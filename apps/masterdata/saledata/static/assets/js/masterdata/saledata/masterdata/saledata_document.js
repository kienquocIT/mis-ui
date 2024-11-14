$(document).ready(function () {

    const column_document_type = [
        {
            className: 'wrap-text w-10',
            render: (data, type, row, meta) => {
                return '';
            }
        },
        {
            data: 'code',
            className: 'wrap-text w-30',
            render: (data, type, row) => {
                if (row.is_default) {
                    return `<span class="badge badge-secondary">${row.code}</span>`
                } else {
                    return `<span class="badge badge-primary">${row.code}</span>`
                }
            }
        },
        {
            data: 'title',
            className: 'wrap-text w-45',
            render: (data, type, row, meta) => {
                if (!row?.['is_default']) {
                    return `<span class="text-primary"><b>${data}</b></span>`
                }
                return `<span><b>${data}</b></span>`
            }
        },
        {
            className: 'wrap-text w-10',
            render: (data, type, row, meta) => {
                if (!row?.['is_default']) {
                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-document-type"
                               data-id="${row?.['id']}"
                               data-code="${row?.['code']}"
                               data-title="${row?.['title']}"
                               data-bs-toggle="modal"
                               data-bs-target="#modal_update_document_type"
                               data-bs-placement="top" title=""
                               >
                               <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                            </a>`
                }
                return ``
            }
        }
    ]

    $("#tab-select-table a.section_document_type").on("click", function () {
        $('.btn-show-modal').attr('data-bs-target', '#modal_document_type')
        let section = $(this).attr('data-collapse');
        switch (section) {
            case 'section_document_type':
                loadDocumentType()
                break;
        }
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $('#modal_document_type h5').text($(this).text());
        $(id_tag).show();
        $('#modal_document_type').attr('data-lookup', $(this).attr('data-collapse'));
    })

    function loadDocumentType() {
        if (!$.fn.DataTable.isDataTable('#datatable-document-type-list')) {
            let tbl = $('#datatable-document-type-list');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
                    useDataServer: true,
                    rowIdx: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('document_type_list')) {
                                return resp.data['document_type_list'] ? resp.data['document_type_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: column_document_type,
                },
            );
        }
    }

    loadDocumentType()

    $(document).on("click", ".btn-update-document-type", function (e) {
        e.preventDefault()
        console.log($(this).attr('data-code'))
        let modal = $('#modal_update_document_type')
        modal.find('#inp_code').val($(this).attr('data-code'))
        modal.find('#inp_name').val($(this).attr('data-title'))
        let raw_url = $('#form_update_document_type').attr('data-url-update-document-type')
        $('#form_update_document_type').attr('data-url-update-document-type', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })


// Submit form
    let form_create = $('#form_create_document_type');
    new SetupFormSubmit(form_create).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let frm_data = frm.dataForm;
            let data_url =  form_create.attr('data-url-document-type');
            $.fn.callAjax2({
                'url': data_url,
                'method': frm.dataMethod,
                'data': frm_data,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $('#modal_document_type').modal('hide');
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#datatable-document-type-list').DataTable().ajax.reload();
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let form_update = $('#form_update_document_type');
    new SetupFormSubmit(form_update).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let frm_data = frm.dataForm;
            let data_url =  form_update.attr('data-url-update-document-type');
            $.fn.callAjax2({
                'url': data_url,
                'method': frm.dataMethod,
                'data': frm_data,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $('#modal_update_document_type').modal('hide');
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#datatable-document-type-list').DataTable().ajax.reload();
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    $('.btn-show-modal').on('click', function () {
        $('#modal_document_type .form-control').val('');
    })
})
