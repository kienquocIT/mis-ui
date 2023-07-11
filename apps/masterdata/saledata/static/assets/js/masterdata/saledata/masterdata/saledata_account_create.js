$(document).ready(function () {

    let ele_account_type = $('#section-account-type').html()
    let ele_account_group = $('#section-account-group').html()
    let ele_industry = $('#section-industry').html()
    // load Data
    "use strict";

    function loadAccountType() {
        if (!$.fn.DataTable.isDataTable('#datatable-account-type-list')) {
            let tbl = $('#datatable-account-type-list');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
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
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_type" data-id="{0}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
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
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="account_group" data-id="{0}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
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
                                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-type="industry" data-id="{0}" data-bs-toggle="modal" data-bs-target="#modal-update-data" data-bs-placement="top" title="" data-bs-original-title="Edit"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`.format_by_idx(
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

        $.fn.callAjax(data_url, frm.dataMethod, frm_data, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $('#modal-lookup-data').hide();
                    }
                },
                (errs) => {
                }
            ).then(
            (rep) => { // reload dataTalbe after create
                if (lookup === 'section-account-type') {
                    $('#section-account-type').empty();
                    $('#section-account-type').append(ele_account_type);
                    loadAccountType();
                }
                if (lookup === 'section-account-group') {
                    $('#section-account-group').empty();
                    $('#section-account-group').append(ele_account_group);
                    loadAccountGroup();
                }
                if (lookup === 'section-industry') {
                    $('#section-industry').empty();
                    $('#section-industry').append(ele_industry);
                    loadIndustry();
                }
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
    $(document).on('click', '#datatable-account-type-list .edit-button, #datatable-industry-list .edit-button, #datatable-account-group-list .edit-button', function () {
        let frm_update = $('#form-update-masterdata')
        let check_type = 0;
        let data_url;
        if ($(this).attr('data-type') === 'account_type') {
            $('#modal-update-data h5').text('Edit Account Type');
            data_url = frm_update.attr('data-url-account-type').replace(0, $(this).attr('data-id'))
            check_type = 1;
        }
        if ($(this).attr('data-type') === 'account_group') {
            $('#modal-update-data h5').text('Edit Account Group');
            data_url = frm_update.attr('data-url-account-group').replace(0, $(this).attr('data-id'))
            check_type = 2;
        }
        if ($(this).attr('data-type') === 'industry') {
            $('#modal-update-data h5').text('Edit Industry');
            data_url = frm_update.attr('data-url-industry').replace(0, $(this).attr('data-id'))
            check_type = 3;
        }
        $.fn.callAjax(data_url, 'GET').then(
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
                $.fn.notifyPopup({description: errs.data.errors}, 'failure');
            },)
        // save edit
        $('#modal-update-data .edit-button').off().on('click', function () {
            let csr = $("input[name=csrfmiddlewaretoken]").last().val();
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

            $.fn.callAjax(data_url, 'PUT', data_form, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            $('#modal-update-data').hide();
                        }
                    },
                    (errs) => {
                        $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                    }
                ).then(
                (resp) => {// reload after save edit
                    if (check_type === 1) {
                        $('#section-account-type').empty();
                        $('#section-account-type').append(ele_account_type);
                        loadAccountType();
                    }
                    if (check_type === 2) {
                        $('#section-account-group').empty();
                        $('#section-account-group').append(ele_account_group);
                        loadAccountGroup();
                    }
                    if (check_type === 3) {
                        $('#section-industry').empty();
                        $('#section-industry').append(ele_industry);
                        loadIndustry();
                    }
                }
            )
        });
    });
});
