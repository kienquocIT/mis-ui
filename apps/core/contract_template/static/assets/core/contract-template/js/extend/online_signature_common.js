class Signature {
    constructor() {
        this.attachments = {}
    }

    set setAttachment(data){
        this.attachments = data;
    }
    get getAttachment(){
        return this.attachments;
    }

    init() {

        // show btn sign request
        const $btnSign = $('.request_sign')
        $btnSign.removeClass('hidden')
        // load draw tab
        $('a.nav-link[href="#tab_block_2"]').on('shown.bs.tab', function(){
            const $canvas = $('#signature_element');
            const width = $canvas.closest('.tab-pane').width();
            const height = 1 / 3 * width;
            if (!$('.canvas-container').length) {
                const canvas = new fabric.Canvas($canvas[0], {
                    isDrawingMode: true,
                });
                canvas.setWidth(width);
                canvas.setHeight(height);
                canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

                $('#sign_clear').on('click', () => canvas.clear());

                if (canvas.freeDrawingBrush) {
                    canvas.freeDrawingBrush.color = '#000';
                    canvas.freeDrawingBrush.width = 3
                }

                $('#sign_export').on('click', () => {
                    Swal.fire({
                        html: `<h5 class="mb-1">${$.fn.gettext('rename signature file')}</h5>`,
                        input: 'text',
                        inputAttributes: {
                            autocapitalize: 'off',
                            name: "txt_file_name",
                        },
                        customClass: {
                            confirmButton: 'btn btn-primary me-2',
                            denyButton: 'btn btn-info',
                            input: 'form-control'
                        },
                        buttonsStyling: false,
                        showCancelButton: false,
                        confirmButtonText: $.fn.gettext('Rename'),
                        showDenyButton: true,
                        denyButtonText: $.fn.gettext('Name generator'),

                    }).then((result) => {
                        const date = new Date().getTime()
                        let fileName = `signature-${date}.png`
                        if (result.value && result.isConfirmed) {
                            fileName = `${result.value}.png`
                        }
                        canvas.getElement().toBlob(blob => {
                            let fileNew = new File([blob], fileName, {type: blob.type});
                            this.uploadDataFile(fileNew)
                        }, 'image/png');

                    })
                })
            }
        });


        // init attachment
        this.loadSignList();
    }

    uploadDataFile(dataFile) {
        // upload file to server
        let formData = new FormData();
        formData.append('file', dataFile);
        const signElm = $('#attach_sign');

        $.fn.callAjax2({
            url: signElm.find('.dad-file-control-group').attr('data-url'),
            method: 'POST',
            data: formData,
            contentType: 'multipart/form-data',
        }).then((resp) => {
            let detailFile = resp?.data?.detail ? resp.data.detail : resp?.data?.['file_detail'];
            // upload signature file to employee info
            let lstAtt = []
            lstAtt.push(detailFile.id)
            this.updateToEmployeeInfo(lstAtt)
        }, (errs) => {
            let existData = errs?.data?.['errors']?.['exist'];
            if (existData){
                Swal.fire($.fn.gettext('File name is exist please rename and re-upload'), "", "error");
            }
        });
    }

    updateToEmployeeInfo(lst_attCh_id){
        const data = lst_attCh_id.concat($('#attach_sign input[name="attach_sign"]').val().split(','))
        $.fn.callAjax2({
            url: $('#attach_sign').attr('data-update'),
            method: 'PUT',
            data: {'attachment': data}
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data.status === 200){
                    Swal.fire($.fn.gettext('File upload successfully'), "", "success");
                    this.loadSignList();
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data?.['errors']}, 'failure')
            }
        )
    }

    loadSignList(){
        const atcElm = $('#attach_sign');
        const isInit = atcElm.find('.dm-uploader-initializer').length > 0
        const urlAttLst = atcElm.attr('data-list')
        if (isInit){
            // đã init => reinit lại data
            atcElm.find('input[name="attach_sign"]').remove();
            atcElm.find('.dm-uploader').dmUploader("destroy");
        }
        $.fn.callAjax2({
            url: urlAttLst,
            method: 'GET',
            data: {'id': $('#frm_employee_hrm input[name="id"]').val()}
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    const attachment = data['attachment_list'][0]['signature']
                    new $x.cls.file(
                        atcElm,
                        {
                            allowedTypes: 'image',
                            extFilter: ['png'],
                        }
                    ).init({
                        name: 'attach_sign',
                        enable_edit: true,
                        enable_download: true,
                        data: attachment,
                    });
                    // init attach to data
                    this.convertIDtoURL(attachment)

                    // init menu right click
                    this.initContextMenu()
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.detail}, 'failure')
            }
        )
    }

    convertIDtoURL(attach_list){
        if (attach_list){
            let temp_lst = {}
            for (let value = 0; value < attach_list.length; value++){
                const item = attach_list[value]
                temp_lst[item.id] = `${window.location.origin}${item?.link}`
            }
            this.setAttachment = temp_lst
        }
    }

    initContextMenu(){
        const attachmentElm = $('#attach_sign');
        const _this = this
        if (attachmentElm.find('.context-menu-one').length > 0)
            $.contextMenu('update');
        else{
            let options = {
                selector: '.dm-uploader-result-list li',
                items: {
                    copy: {
                        name: $.fn.gettext("Copy image URL"),
                        icon: "copy",
                        callback: function (key, opt) {
                            const $liElm = $(opt.$trigger[0]);
                            const attach_lst = _this.getAttachment
                            navigator.clipboard.writeText(attach_lst[$liElm.attr('data-file-id')]).then(() => {
                            }).catch(err => {
                                console.error('Lỗi khi sao chép', err);
                            });
                            const spanElm = $(`<span class="copied">${$.fn.gettext('copied!')}</span>`)
                            $liElm.append(spanElm)
                            spanElm.fadeOut(1500, function(){
                                $(this).remove()
                            })
                        },
                    },
                }
            };
            $.contextMenu( options );
        }
    }

}