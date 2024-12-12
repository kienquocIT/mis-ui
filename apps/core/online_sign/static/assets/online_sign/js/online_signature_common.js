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
        const clearEl = $('#sign_clear');
        const $canvas = $('#signature_element');
        const width = 570;
        const height = 9/16 * width;
        if (!$('.canvas-container').length){
            const canvas = new fabric.Canvas($canvas[0], {
                isDrawingMode: true,
            });
            canvas.setWidth(width);
            canvas.setHeight(height);
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

            clearEl.on('click', () => canvas.clear());

            if (canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = '#000';
                canvas.freeDrawingBrush.width = 1
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

        // init attachment
        const _this = this
        $(document).on('detail.DetailLoaded', function(){
            _this.loadSignList();
        });

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
$(document).ready(function () {
    const activeSignature = new Signature();
    activeSignature.init()

    var tour = {
        id: "hopscotch-light",
		steps: [
            {
                target: "signature_element",
                placement: 'left',
                title: $.fn.gettext('Step 1'),
                content: $.fn.gettext("Firstly draw your signature"),
            },
            {
                target: "sign_clear",
                placement: 'bottom',
                title: $.fn.gettext('Clear Signature error file'),
                content: $.fn.gettext("Clear file and redrawn file"),
            },
            {
                target: "sign_export",
                placement: 'bottom',
                title: $.fn.gettext('Step 2'),
                content: $.fn.gettext("Secondly click to upload file"),
                onNext: function () {
                    hopscotch.endTour();
                    $('.simplebar-content-wrapper').animate({ scrollTop: 400 }, 300);
                    setTimeout(() => {
                        hopscotch.startTour(tour, 3);
                    }, 400); // Delay 0.6 giây
                }
            },
            {
                target: "#attach_sign .dm-uploader-result-list",
                placement: 'top',
                title: $.fn.gettext('File after uploaded'),
                content: $.fn.gettext("Finally r-click to copy file URL"),
            },
        ],
        showPrevButton: true,
        i18n: {
            nextBtn: $.fn.gettext('Next'),
            prevBtn: $.fn.gettext('Back'),
            doneBtn: $.fn.gettext('Done')
        }
    }
    // Start the tour!
    $('.start-tour').on('click', function(){
	    hopscotch.startTour(tour);
    });

});