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
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<h6><a href="#">{0}</a></h6>`.format_by_idx(
                                    data,
                                )
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                let url = $('#url-factory').data('url-account-type').format_url_with_uuid(row.id);
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="{0}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
                                    row.id
                                )
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
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<h6><a href="#">{0}</a></h6>`.format_by_idx(
                                    data,
                                )
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                let url = $('#url-factory').data('url-account-group').format_url_with_uuid(row.id);
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_group" data-id="{0}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
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
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<h6><a href="#">{0}</a></h6>`.format_by_idx(
                                    data,
                                )
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="initial-wrap"></span></div>{0}`.format_by_idx(
                                    data
                                )
                            }
                        }, {
                            render: (data, type, row, meta) => {
                                let url = $('#url-factory').data('url-industry').format_url_with_uuid(row.id);
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="industry" data-id="{0}" data-url="${url}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
                                    row.id
                                )
                            }
                        }
                    ],
                },
            );
        }
    }

    loadAccountType();

    $('#btn-show-modal-create').on('click', function () {
        $('.modal-body input').val('');
    })

    // Switch view table
    $("#tab-select-table a").on("click", function () {
        let section = $(this).attr('data-collapse')
        $(".lookup-data").hide()
        let id_tag = `#` + section
        if (section === 'section-account-type') {
            $('#modal-lookup-data h5').text('Account Type');
            loadAccountType();
        }
        if (section === 'section-account-group') {
            $('#modal-lookup-data h5').text('Account Group');
            loadAccountGroup();
        }
        if (section === 'section-industry') {
            $('#modal-lookup-data h5').text('Industry');
            loadIndustry();
        }
        $('#form-create-lookup').attr('data-lookup', section)
        $(id_tag).show();
    })

    // submit form create lookup data
    let frm = $('#form-create-lookup');
    frm.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").last().val();
        let frm = new SetupFormSubmit($(this));
        let frm_data = frm.dataForm;
        let lookup = $('#form-create-lookup').attr('data-lookup');
        let data_url = ''
        if (lookup === 'section-account-type') {
            data_url = $('#form-create-lookup').attr('data-url-account-type');
        }
        if (lookup === 'section-account-group') {
            data_url = $('#form-create-lookup').attr('data-url-account-group');
        }
        if (lookup === 'section-industry') {
            data_url = $('#form-create-lookup').attr('data-url-industry');
        }

        if (frm_data['code'] === '') {
            frm_data['code'] = null;
        }

        if (frm_data['title'] === '') {
            frm_data['title'] = null;
        }

        $.fn.callAjax2({
            'url': data_url,
            'method': frm.dataMethod,
            'data': frm_data,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $('#modal-lookup-data').modal('hide');
                    switch (lookup) {
                        case 'section-account-type':
                            $('#datatable-account-type-list').DataTable().ajax.reload();
                            break;
                        case 'section-account-group':
                            $('#datatable-account-group-list').DataTable().ajax.reload();
                            break;
                        case 'section-industry':
                            $('#datatable-industry-list').DataTable().ajax.reload();
                            break;
                    }
                }
            },
            (errs) => {
            }
        )
    })

    // Select checkbox in table
    function selectAllCheckBox(id_table) {
        $(document).on('click', id_table + ` .check-select`, function () {
            if ($(this).is(":checked")) {
                $(this).closest('tr').addClass('selected');
            } else {
                $(this).closest('tr').removeClass('selected');
                $(id_table + ` .check-select-all`).prop('checked', false);
            }
        });
        $(document).on('click', id_table + ` .check-select-all`, function () {
            $(id_table + ` .check-select`).attr('checked', true);
            let table = $(id_table).DataTable();
            let indexList = table.rows().indexes();
            if ($(this).is(":checked")) {
                for (let idx = 0; idx < indexList.length; idx++) {
                    let rowNode = table.rows(indexList[idx]).nodes()[0];
                    rowNode.classList.add('selected');
                    rowNode.firstElementChild.children[0].firstElementChild.checked = true;
                }
                $(id_table + ` .check-select`).prop('checked', true);
            } else {
                for (let idx = 0; idx < indexList.length; idx++) {
                    let rowNode = table.rows(indexList[idx]).nodes()[0];
                    rowNode.classList.remove("selected");
                    rowNode.firstElementChild.children[0].firstElementChild.checked = false;
                }
                $(id_table + ` .check-select`).prop('checked', false);
            }
        });
    }

    selectAllCheckBox('#datatable-account-type-list');
    selectAllCheckBox('#datatable-account-group-list');
    selectAllCheckBox('#datatable-industry-list');

    // show modal edit
    $(document).on('click', '.edit-button', function () {
        if ($(this).attr('data-type') === 'account_type') {
            $('#modal-update-data h5').text('Edit Account Type');
            $('#master-data-type').val('account_type');
        } else if ($(this).attr('data-type') === 'account_group') {
            $('#modal-update-data h5').text('Edit Account Group');
            $('#master-data-type').val('account_group');
        } else if ($(this).attr('data-type') === 'industry') {
            $('#modal-update-data h5').text('Edit Industry');
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
                            $('#name-update').val(data.account_group.title);
                            $('#code-update').val(data.account_group.code);
                            $('#description-update').val(data.account_group.description);
                        } else if (resp.data.hasOwnProperty('industry')) {
                            $('#name-update').val(data.industry.title);
                            $('#code-update').val(data.industry.code);
                            $('#description-update').val(data.industry.description);
                        }
                    }
                }
            }, (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            },)

    });
    let frmUpdate = $('#form-update-masterdata')
    frmUpdate.submit(function (event) {
        event.preventDefault();
        frm = new SetupFormSubmit($(this));
        let inp_name = $('#name-update');
        let inp_code = $('#code-update');
        let inp_des = $('#description-update');
        let data_form = {
            'code': inp_code.val(),
            'title': inp_name.val(),
            'description': inp_des.val(),
        }

        if (data_form['code'] === '') {
            data_form['code'] = null;
        }

        if (data_form['title'] === '') {
            data_form['title'] = null;
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
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $('#modal-update-data').modal('hide');
                    switch ($('#master-data-type').val()) {
                        case 'account_type':
                            $('#datatable-account-type-list').DataTable().ajax.reload();
                            break;
                        case 'account_group':
                            $('#datatable-account-group-list').DataTable().ajax.reload();
                            break;
                        case 'industry':
                            $('#datatable-industry-list').DataTable().ajax.reload();
                            break;
                    }
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        )
    });
});
