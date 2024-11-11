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
                return ``
            }
        }
    ]

    $("#tab-select-table a.section_document_type").on("click", function () {
        $('.btn-show-modal').attr('data-bs-target', '#modal-document-type')
        let section = $(this).attr('data-collapse');
        switch (section) {
            case 'section_document_type':
                loadDocumentType()
                break;
        }
        $(".lookup-data").hide()
        let id_tag = `#` + section
        $('#modal-document-type h5').text($(this).text());
        $(id_tag).show();
        $('#modal-document-type').attr('data-lookup', $(this).attr('data-collapse'));
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



// Submit form
    let form_create = $('#form-create-document-type');
    new SetupFormSubmit(form_create).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let frm_data = frm.dataForm;
            let lookup = $(form).attr('data-lookup');
            let data_url = ''
            if (lookup === 'section_document_type') {
                data_url = $('#form-create-document-type').attr('data-url-document-type');
            }
            $.fn.callAjax2({
                'url': data_url,
                'method': frm.dataMethod,
                'data': frm_data,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Tạo mới"}, 'success')
                        $('#modal-document-type').modal('hide');
                        if (lookup === 'section_document_type') {
                            $('#datatable-document-type-list').DataTable().ajax.reload();
                        }
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    $('.btn-show-modal').on('click', function () {
        $('#modal-document-type .form-control').val('');
    })
})
