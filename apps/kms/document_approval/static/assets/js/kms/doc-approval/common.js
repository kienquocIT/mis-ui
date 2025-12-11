class handleAttached {
    resetForm(){
        $('#form_attached')[0].reset()
        $('#select-box-doc_type, #select-box-content_group, #kms_group, #kms_folder').val('').trigger('change')
        const $element = $('#attachment')
        $element.find('.dm-uploader').dmUploader("reset");
        $element.find('.dm-uploader-result-list').html('');
        $element.find('.dm-uploader-no-files').css({'display': 'block'});
    }

    addNewBtn(){
        const $Form = $('#form_attached');
        const _this = this
        $Form.on('submit', function(e){
            let data = $Form.serializeObject()
            e.preventDefault()
            let file_name_lst = []
            $('.dm-uploader-result-list li').each(function(){
                file_name_lst.push($(this).find('.f-item-name').text())
            });

            let temp_data = {
                    attachment: data.attachment.split(','),
                    content_group: data.content_group,
                    document_type: data.document_type,
                    folder: data.folder,
                    published_place: data.published_place,
                    security_lv: parseInt(data.security_lv),
                    file_name: file_name_lst,
                    id: null,
                    title: data.title,
                }
            if (data.effective_date) temp_data.effective_date = data.effective_date
            if (data.expired_date) temp_data.expired_date = data.expired_date

            _this.init_table_attached([temp_data]
            )
            _this.resetForm()

        });
    }

    init_table_attached(data){
        const $tbl = $('#table_attached_info')
        if ($tbl.hasClass('dataTable')) $tbl.DataTable().rows.add(data).draw();
        else
            $tbl.DataTableDefault({
                data: data,
                paging: false,
                info: false,
                searching: false,
                columns: [
                    {
                        data: 'file_name',
                        width: '45%',
                        render: (row, index, data) => {
                            let txt = ''
                            if (!row){
                                row = []
                                for(let item of data.attachment){
                                    row.push(item.file_name)
                                }
                            }
                            for (let item of row) txt += `<span class="text-decoration-underline">${item}</span>, `
                            return txt
                        }
                    },
                    {
                        data: 'title',
                        width: '45%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: 'id',
                        width: '10%',
                        render: (row) => {
                            return `<div class="actions-btn text-center">` +
                                `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn" title="Delete"` +
                                `href="#" data-id="${row}" data-action="delete">` +
                                `<span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a></div>`;
                        }
                    }
                ],
                rowCallback: function (row) {
                    $('.actions-btn a', row).off().on('click', function (e) {
                        e.stopPropagation();
                        $tbl.DataTable().row(row).remove().draw(false);
                    })
                },
            }).on('draw.dt', function () {
                $tbl.find('tbody').find('tr').each(function () {
                    $(this).after('<tr class="table-row-gap"><td></td></tr>');
                });
            });
    }

    init(){
        this.addNewBtn()
        this.init_table_attached()
    }
}

class load_editor{
    init(){
        const $txtArea = $('#txtarea_remark');
        $txtArea.tinymce({
            height: 500,
            menubar: false,
            plugins: ['columns', 'print', 'preview', 'paste', 'importcss', 'searchreplace', 'autolink', 'autosave',
                'save', 'directionality', 'code', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media',
                'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc',
                'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'noneditable',
                'help', 'charmap', 'quickbars', 'emoticons'],
            toolbar: 'bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist table twoColumn threeColumn | preview pagebreak removeformat print visualblocks',  // | rarely_used
            quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak',
            toolbar_groups: {
                rarely_used: {
                    icon: 'more-drawer',
                    tooltip: 'Rarely Used',
                    items: 'ltr rtl | charmap emoticons | superscript subscript | nonbreaking anchor media | undo redo | '
                }
            },
            font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Cambria=cambria,serif; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
            pagebreak_split_block: true,
            pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
            nonbreaking_force_tab: true,
            insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
            content_css: $txtArea.attr('data-css-url-render'),
            content_style: `
                body { font-family: Cambria,sans-serif; font-size: 12pt; }
                @import url('/static/assets/fonts/cambria/Cambria.ttf');
                @media print {
                    .mce-visual-caret {
                        display: none;
                    }
                }
            `
        });
    }
}


$(document).ready(function (e) {

    function init_table_recipient(data){
        const $tbl = $('#table_internal_recipient');
        if ($tbl.hasClass('dataTable')) $tbl.DataTable().clear().rows.add(data).draw();
        else
            $tbl.DataTableDefault({
                data: data,
                paging: false,
                info: false,
                searching: false,
                columns: [
                    {
                        data: 'id',
                        render: (row, index, data) => {
                            if (!$x.fn.checkUUID4(row)) data.id = $x.cls.util.generateUUID4();
                            let html = ``;
                            const key = data?.kind === 1 ? 'employee_access' : 'group_access'
                            const data_loop = data[key]
                            for (let val of Object.values(data_loop)){
                                html += `<div class="chip chip-outline-primary pill chip-pill mr-2"><span class="chip-text">${
                                    data.kind === 1 ? val.full_name : val?.title
                                }</span></div>`
                            }
                            return html
                        }
                    },
                    {
                        data: 'title',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: 'id',
                        render: (row) => {
                            return `<div class="actions-btn text-center">` +
                                `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button"` +
                                `title="Edit" href="#" data-id="${row}" data-action="edit">` +
                                `<span class="btn-icon-wrap"><i class="fa-solid fa-pen"></i></span></a>` +
                                `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn" title="Delete"` +
                                `href="#" data-id="${row}" data-action="delete">` +
                                `<span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a></div>`;
                        }
                    }
                ],
                rowCallback: function (row, data, index) {
                    $('.actions-btn a.delete-btn', row).off().on('click', function (e) {
                        e.stopPropagation();
                        $tbl.DataTable().row(row).remove().draw(false);
                    })
                    $('.actions-btn a.edit-button', row).off().on('click', function (e) {
                        e.stopPropagation();
                        $('#modal-recipient').trigger('modal.Recipient.edit', [{row_index: index}]);
                    })
                },
            })
    }

    function loadDate(elm, dobData) {
        elm.flatpickr({
            'allowInput': true,
            'altInput': true,
            'altFormat': 'd/m/Y',
            'dateFormat': 'Y-m-d',
            'defaultDate': dobData || null,
            'locale': globeLanguage === 'vi' ? 'vn' : 'default',
            'shorthandCurrentMonth': true,
        })
    }

    // INIT PAGE

    // load date
    loadDate($('#kms_effective_date'))
    loadDate($('#kms_expired_date'))

    // load internal recipient
    init_table_recipient()

    // load select
    $('#kms_folder').initSelect2()
    $('#select-box-doc_type').initSelect2()
    $('#select-box-content_group').initSelect2()
    $('#kms_group').initSelect2()

    // active attached document
    const doc_attached = new handleAttached()
    doc_attached.init()

    // load editor
    const remark = new load_editor()
    remark.init()

    // form on submit
    SetupFormSubmit.validate(
        $('#frm_document_approval'),
        {
            submitHandler: function (form) {
                const frm = new SetupFormSubmit(form);
                let data = frm.dataForm
                data.attached_list = $('#table_attached_info').DataTable().data().toArray()
                data.internal_recipient = $('#table_internal_recipient').DataTable().data().toArray()
                frm.formElm = form
                frm.resetForm = true
                WFRTControl.callWFSubmitForm(frm);
            }
        }
    )
})