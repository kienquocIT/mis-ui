$(document).ready(function () {
    // load Data
    function loadAccountType() {
        if (!$.fn.DataTable.isDataTable('#datatable-account-type-list')) {
            let tbl = $('#datatable-account-type-list');
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
                            if (data && resp.data.hasOwnProperty('account_type_list')) {
                                return resp.data['account_type_list'] ? resp.data['account_type_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: [
                        {
                            className: 'wrap-text w-5',
                            render: () => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                if (row?.['is_default']) {
                                    return `<span class="badge badge-secondary">${data}</span>`
                                }
                                return `<span class="badge badge-primary">${data}</span>`
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-40',
                            render: (data, type, row, meta) => {
                                if (row.is_default) {
                                     return `<b>${data}</b>`
                                }
                                return `<b class="text-primary">${data}</b>`
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text w-30',
                            render: (data) => {
                                return `<span class="initial-wrap">${data}</span>`
                            }
                        },
                        {
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                if (!row?.['is_default']) {
                                    let url = $('#url-factory').data('url-account-type').format_url_with_uuid(row.id);
                                    return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="${row.id}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span></a>`
                                }
                                return ``
                            }
                        }
                    ],
                },
            );
        }
    }

    function loadAccountGroup() {
        if (!$.fn.DataTable.isDataTable('#datatable-account-group-list')) {
            let tbl = $('#datatable-account-group-list');
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
                            if (data && resp.data.hasOwnProperty('account_group_list')) {
                                return resp.data['account_group_list'] ? resp.data['account_group_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: [
                        {
                            className: 'wrap-text w-5',
                            render: () => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return `<span class="badge badge-primary">${data}</span>`
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-40',
                            render: (data) => {
                                return `<b class="text-primary">${data}</b>`
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text w-30',
                            render: (data) => {
                                return `<span class="initial-wrap">${data}</span>`
                            }
                        },
                        {
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                let url = $('#url-factory').data('url-account-group').format_url_with_uuid(row.id);
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="{0}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
                                    row.id
                                )
                            }
                        }
                    ],
                },
            );
        }
    }

    function loadIndustry() {
        if (!$.fn.DataTable.isDataTable('#datatable-industry-list')) {
            let tbl = $('#datatable-industry-list');
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
                            if (data && resp.data.hasOwnProperty('industry_list')) {
                                return resp.data['industry_list'] ? resp.data['industry_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: [
                        {
                            className: 'wrap-text w-5',
                            render: () => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return `<span class="badge badge-primary">${data}</span>`
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-40',
                            render: (data) => {
                                return `<b class="text-primary">${data}</b>`
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text w-30',
                            render: (data) => {
                                return `<span class="initial-wrap">${data}</span>`
                            }
                        },
                        {
                            className: 'wrap-text w-10',
                            render: (data, type, row) => {
                                let url = $('#url-factory').data('url-industry').format_url_with_uuid(row.id);
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="{0}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
                                    row.id
                                )
                            }
                        }
                    ],
                },
            );
        }
    }

    loadAccountType()
    loadAccountGroup()
    loadIndustry()

    $('#btn-show-modal-create').on('click', function () {
        $('.modal-body input').val('');
    })

    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        if (section === 'section-account-type') {
            $('#modal-lookup-data .modal-title').text($(this).text());
            loadAccountType();
        }
        if (section === 'section-account-group') {
            $('#modal-lookup-data .modal-title').text($(this).text());
            loadAccountGroup();
        }
        if (section === 'section-industry') {
            $('#modal-lookup-data .modal-title').text($(this).text());
            loadIndustry();
        }
        $('#form-create-lookup').attr('data-lookup', section)
        $(id_tag).show();
    })

    $(document).on('click', '.edit-button', function () {
        if ($(this).attr('data-type') === 'account_type') {
            $('#master-data-type').val('account_type');
        } else if ($(this).attr('data-type') === 'account_group') {
            $('#master-data-type').val('account_group');
        } else if ($(this).attr('data-type') === 'industry') {
            $('#master-data-type').val('industry');
        }

        let data_url = $(this).data('url');
        $('#master-data-url-detail').val(data_url);
        $.fn.callAjax2({
            'url': data_url,
            'method': 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data')) {
                        if (resp.data.hasOwnProperty('account_type')) {
                            $('#name-update').val(data.account_type.title);
                            $('#code-update').val(data.account_type.code);
                            $('#description-update').val(data.account_type.description);
                        } else if (resp.data.hasOwnProperty('account_group')) {
                            $('#name-update').val(data?.['account_group'].title);
                            $('#code-update').val(data?.['account_group'].code);
                            $('#description-update').val(data?.['account_group'].description);
                        } else if (resp.data.hasOwnProperty('industry')) {
                            $('#name-update').val(data?.['industry'].title);
                            $('#code-update').val(data?.['industry'].code);
                            $('#description-update').val(data?.['industry'].description);
                        }
                    }
                }
            }, (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            },)

    });

    const frm = $('#form-create-lookup');
    new SetupFormSubmit(frm).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let frm_data = frm.dataForm;
            let lookup = $(form).attr('data-lookup');
            let data_url = ''
            if (lookup === 'section-account-type') {
                data_url = $(form).attr('data-url-account-type');
            }
            if (lookup === 'section-account-group') {
                data_url = $(form).attr('data-url-account-group');
            }
            if (lookup === 'section-industry') {
                data_url = $(form).attr('data-url-industry');
            }
            $.fn.callAjax2({
                'url': data_url,
                'method': frm.dataMethod,
                'data': frm_data,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        $('#modal-lookup-data').modal('hide');
                        $('#datatable-account-type-list').DataTable().ajax.reload();
                        $('#datatable-account-group-list').DataTable().ajax.reload();
                        $('#datatable-industry-list').DataTable().ajax.reload();
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    const frmUpdate = $('#form-update-masterdata');
    new SetupFormSubmit(frmUpdate).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let inp_name = $('#name-update');
            let inp_code = $('#code-update');
            let inp_des = $('#description-update');
            let data_form = {
                'code': inp_code.val(),
                'title': inp_name.val(),
                'description': inp_des.val(),
            }
            let data_url = $('#master-data-url-detail').val();
            $.fn.callAjax2({
                'url': data_url,
                'method': frm.dataMethod,
                'data': data_form
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        $('#modal-update-data').modal('hide');
                        $('#datatable-account-type-list').DataTable().ajax.reload();
                        $('#datatable-account-group-list').DataTable().ajax.reload();
                        $('#datatable-industry-list').DataTable().ajax.reload();
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    });
});
