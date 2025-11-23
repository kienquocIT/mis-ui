$(document).ready(function () {
    const trans_script = $('#trans-script')
    const $product_type_account_determination_table = $('#product-type-account-determination-table')
    const columns_cfg = [
        {
            className: 'w-5',
            'render': () => {
                return ``;
            }
        },
        {
            'render': (data, type, row) => {
                return `<span class="text-muted">${row?.['account_determination_type_convert']}</span>`;
            }
        },
        {
            className: 'w-30',
            'render': (data, type, row) => {
                return `<h6 class="text-muted fw-bold">${row?.['title']}</h6><h6 class="small text-primary fw-bold">${row?.['foreign_title']}</h6>`;
            }
        },
        {
            className: 'w-20',
            'render': (data, type, row) => {
                return `<select disabled data-account-mapped='${JSON.stringify(row?.['account_mapped'])}' class="form-select select2 selected-accounts"></select>`;
            }
        },
        {
            className: 'w-35',
            'render': (data, type, row) => {
                return `<div class="selected-accounts-des"></div>`;
            }
        },
        {
            className: 'text-right w-10',
            'render': (data, type, row) => {
                let change_btn = `<a class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-xs btn-change-account">
                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i class="fa-solid fa-pen-to-square"></i></span></span>
                </a>`;
                let save_btn = `<button type="button" data-id="${row?.['id']}" hidden class="btn btn-custom btn-primary btn-xs btn-save-change-account">
                    <span>
                        <span class="icon"><span class="feather-icon"><i class="fa-solid fa-file-pen"></i></span></span>
                        <span>${$.fn.gettext('Save changes')}</span>
                    </span>
                </button>`;
                return row?.['can_change_account'] ? change_btn + save_btn : ''
            }
        },
    ]
    let account_determination_data_list = {}
    let current_product_type_id = null

    function loadAccountDeterminationTable(product_type_mapped_id=null) {
        if (product_type_mapped_id) {
            $product_type_account_determination_table.DataTable().clear().destroy();
            if (account_determination_data_list[product_type_mapped_id]) {
                $product_type_account_determination_table.DataTableDefault({
                    rowIdx: true,
                    reloadCurrency: true,
                    paging: false,
                    scrollX: true,
                    scrollY: '18vw',
                    scrollCollapse: true,
                    data: account_determination_data_list[product_type_mapped_id],
                    columns: columns_cfg,
                    rowGroup: {
                        dataSrc: 'account_determination_type_convert'
                    },
                    columnDefs: [
                        {
                            "visible": false,
                            "targets": [1]
                        }
                    ],
                    initComplete: function () {
                        $product_type_account_determination_table.find('tbody tr .selected-accounts').each(function () {
                            let account_mapped_data = $(this).attr('data-account-mapped')
                            if (account_mapped_data) {
                                account_mapped_data = JSON.parse(account_mapped_data)
                            }
                            $(this).initSelect2({
                                data: (account_mapped_data ? account_mapped_data : null),
                                ajax: {
                                    url: $product_type_account_determination_table.attr('data-chart-of-account-url'),
                                    method: 'GET',
                                },
                                keyResp: 'chart_of_accounts_list',
                                keyId: 'id',
                                keyText: 'acc_code',
                                templateResult: function (state) {
                                    return $(`<span class="badge badge-light">${state.data?.['acc_code']}</span> <span>${state.data?.['acc_name']}</span> <span class="small">(${state.data?.['foreign_acc_name']})</span>`);
                                },
                            })
                        })
                    }
                });
            }
            else {
                let frm = new SetupFormSubmit($product_type_account_determination_table);
                $product_type_account_determination_table.DataTableDefault({
                    useDataServer: true,
                    rowIdx: true,
                    reloadCurrency: true,
                    paging: false,
                    ajax: {
                        url: frm.dataUrl,
                        data: {'product_type_mapped_id': product_type_mapped_id},
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                let data_list = resp.data['product_type_account_determination_list'] ? resp.data['product_type_account_determination_list'] : []
                                data_list.sort((a, b) => {
                                    const typeA = a?.['account_determination_type_convert'];
                                    const typeB = b?.['account_determination_type_convert'];
                                    if (typeA < typeB) return -1;
                                    if (typeA > typeB) return 1;

                                    const accCodeA = parseInt(a?.['account_mapped']?.['acc_code'], 10);
                                    const accCodeB = parseInt(b?.['account_mapped']?.['acc_code'], 10);
                                    return accCodeA - accCodeB;
                                });
                                account_determination_data_list[product_type_mapped_id] = data_list
                                // console.log(data_list)
                                return data_list ? data_list : [];
                            }
                            return [];
                        },
                    },
                    columns: columns_cfg,
                    rowGroup: {
                        dataSrc: 'account_determination_type_convert'
                    },
                    columnDefs: [
                        {
                            "visible": false,
                            "targets": [1]
                        }
                    ],
                    initComplete: function () {
                        $product_type_account_determination_table.find('tbody tr .selected-accounts').each(function () {
                            let account_mapped = $(this).attr('data-account-mapped') ? JSON.parse($(this).attr('data-account-mapped')) : []
                            $(this).initSelect2({
                                data: (account_mapped ? account_mapped : null),
                                ajax: {
                                    url: $product_type_account_determination_table.attr('data-chart-of-account-url'),
                                    method: 'GET',
                                },
                                keyResp: 'chart_of_accounts_list',
                                keyId: 'id',
                                keyText: 'acc_code',
                                templateResult: function (state) {
                                    return $(`<span class="badge badge-light">${state.data?.['acc_code']}</span> <span>${state.data?.['acc_name']}</span> <span class="small">(${state.data?.['foreign_acc_name']})</span>`);
                                },
                            })

                            for (let i = 0; i < account_mapped.length; i++) {
                                $(this).closest('tr').find('.selected-accounts-des').append(
                                    `<h6 class="text-muted">${account_mapped[i]?.['acc_name']}</h6><h6 class="small text-primary">${account_mapped[i]?.['foreign_acc_name']}</h6>`
                                )
                            }
                        })
                    }
                });
            }
        }
    }

    $(document).on('change', '.selected-accounts', function () {
        let account_mapped = [SelectDDControl.get_data_from_idx($(this), $(this).val())]
        $(this).closest('tr').find('.selected-accounts-des').html('')
        for (let i = 0; i < account_mapped.length; i++) {
            $(this).closest('tr').find('.selected-accounts-des').append(
                `<h6 class="text-muted">${account_mapped[i]?.['acc_name']}</h6><h6 class="small text-primary">${account_mapped[i]?.['foreign_acc_name']}</h6>`
            )
        }
        $(this).closest('tr').find('.btn-change-account').prop('hidden', true)
        $(this).closest('tr').find('.btn-save-change-account').prop('hidden', false)
        $(this).closest('tr').addClass('bg-primary-light-5')
    })

    $(document).on('click', '.btn-save-change-account', function () {
        let row_id = $(this).attr('data-id')
        let row_replace_account = $(this).closest('tr').find('.selected-accounts').val()
        Swal.fire({
            html:
            `<div class="d-flex align-items-center">
                <div class="avatar avatar-icon avatar-soft-blue me-3"><span class="initial-wrap"><i class="fa-solid fa-repeat"></i></span></div>
                <div>
                    <h4 class="text-blue">${$product_type_account_determination_table.attr('data-trans-change-confirm')}</h4>
                    <p>${$product_type_account_determination_table.attr('data-trans-change-noti')}</p>
                </div>
            </div>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-blue',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg',
                htmlContainer: 'bg-transparent text-start',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: $.fn.gettext('Confirm'),
            cancelButtonText: $.fn.gettext('Cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let ajax_update_account_prd_type = $.fn.callAjax2({
                    url: $product_type_account_determination_table.attr('data-url-detail').replace('/0', `/${row_id}`),
                    data: {'replace_account': row_replace_account},
                    method: 'PUT'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('detail')) {
                            $.fn.notifyB({description: 'Update account determination successfully!'}, 'success');
                            return data?.['detail'];
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )

                Promise.all([ajax_update_account_prd_type]).then(
                    (results) => {
                        delete account_determination_data_list[current_product_type_id]
                        // loadAccountDeterminationTable(current_product_type_id)
                    }
                )
            }
        })
    })

    $(document).on('click', '.btn-change-account', function () {
        $(this).closest('tr').find('.selected-accounts').prop('disabled', false)
    })

    function loadProductType() {
        let tbl = $('#datatable-product-type-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('product_type_list')) {
                        return resp.data['product_type_list'] ? resp.data['product_type_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'w-30',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${row?.['code']}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'w-25',
                    render: (data, type, row) => {
                        if (!row?.['is_default']) {
                            return `${data}`
                        }
                        return `<b>${data}</b>`
                    }
                },
                {
                    data: 'description',
                    className: 'w-30',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-product-type"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-description="${row?.['description']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-product-type"
                           data-bs-placement="top" title=""
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        if (!row?.['is_default']) {
                            return `${edit_btn}${delete_btn}`
                        }
                        return `${edit_btn}`
                    }
                }
            ],
        });
    }
    function loadProductCategory() {
        let tbl = $('#datatable-product-category-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('product_category_list')) {
                        return resp.data['product_category_list'] ? resp.data['product_category_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'w-20',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${row?.['code']}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'w-30',
                    render: (data, type, row) => {
                        if (!row?.['is_default']) {
                            return `${data}`
                        }
                        return `<b>${data}</b>`
                    }
                },
                {
                    data: 'description',
                    className: 'w-35',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-product-category"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-description="${row?.['description']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-product-category"
                           data-bs-placement="top" title=""
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        return `${edit_btn}${delete_btn}`
                    }
                }
            ],
        });
    }
    function loadManufacturer() {
        let tbl = $('#datatable-manufacturer-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('manufacturer_list')) {
                        return resp.data['manufacturer_list'] ? resp.data['manufacturer_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'w-20',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${row?.['code']}</span>`
                        } else {
                            return `<span class="badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'w-30',
                    render: (data, type, row) => {
                        if (!row?.['is_default']) {
                            return `${data}`
                        }
                        return `<b>${data}</b>`
                    }
                },
                {
                    data: 'description',
                    className: 'w-35',
                    render: (data) => {
                        return `<span class="initial-wrap">${data}</span>`
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-manufacturer"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-description="${row?.['description']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-manufacturer"
                           data-bs-placement="top" title=""
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        return `${edit_btn}${delete_btn}`
                    }
                }
            ],
        });
    }
    function loadUnitOfMeasureGroup() {
        let tbl = $('#datatable-unit-measure-group-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('unit_of_measure_group')) {
                        return resp.data['unit_of_measure_group'] ? resp.data['unit_of_measure_group'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'w-15',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="code-span badge badge-light w-70">${row?.['code']}</span>`
                        } else {
                            return `<span class="code-span badge badge-primary w-70">${row?.['code']}</span>`
                        }
                    }
                },
                {
                    data: 'title',
                    className: 'w-45',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="title-span"><b>${data}</b></span>`
                        } else {
                            return `<span class="title-span">${data}<span>`
                        }
                    }
                },
                {
                    data: 'referenced_unit',
                    className: 'w-25',
                    render: (data, type, row) => {
                        if (row?.['referenced_unit']?.['id']) {
                            return `<span class="badge badge-soft-success w-30 mr-1">${row?.['referenced_unit']?.['code']}</span>${row?.['referenced_unit']?.['title']}`
                        }
                        return ''
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-uom-group"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-referenced-id="${row?.['referenced_unit']?.['id'] ? row?.['referenced_unit']?.['id'] : ''}"
                           data-referenced-code="${row?.['referenced_unit']?.['code'] ? row?.['referenced_unit']?.['code'] : ''}"
                           data-referenced-title="${row?.['referenced_unit']?.['title'] ? row?.['referenced_unit']?.['title'] : ''}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-uom-group"
                           data-bs-placement="top" title="" 
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        if (!row?.['is_default']) {
                            return `${edit_btn}${delete_btn}`
                        }
                        return `${edit_btn}`
                    }
                }
            ],
            initComplete: function () {
                $('.code-span').each(function () {
                    if ($(this).text() === 'Import') {
                        $(this).closest('tr').find('.title-span').append(`
                            <br><span class="text-muted small">${trans_script.attr('data-trans-uom-group-info')}</span>
                        `)
                    }
                })
            }
        });
    }
    function loadSelectBoxUnitMeasureGroup(ele, data) {
        ele.initSelect2({
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp].filter(function (item) {
                    return item?.['code'] !== 'ImportGroup';
                });
            },
            data: (data ? data : {}),
            keyResp: 'unit_of_measure_group',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            let obj = SelectDDControl.get_data_from_idx($(this), $(this).val());
            let data_referenced = obj?.['referenced_unit']?.['title'];
            // create
            $('#referenced-unit').val(data_referenced)
            $('#inp-rounding').val('1');
            $('#ratio-unit').val('');
            // update
            $('#referenced-unit-edit').val(data_referenced)
            $('#inp-rounding-edit').val('1');
            $('#ratio-unit-edit').val('');
        })
    }
    function loadUnitOfMeasure() {
        let tbl = $('#datatable-unit-measure-list');
        let frm = new SetupFormSubmit(tbl);
        tbl.DataTable().clear().destroy()
        tbl.DataTableDefault({
            paging: false,
            useDataServer: true,
            columnDefs: [
                {
                    "searchable": false,
                    "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
                },
                {
                    targets: [3],
                    visible: false
                }
            ],
            rowIdx: true,
            rowGroup: {
                dataSrc: 'group.title'
            },
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('unit_of_measure')) {
                        const unit_of_measure = (resp.data['unit_of_measure'] || []).sort((a, b) => {
                            const groupA = a?.['group']?.['code'];
                            const groupB = b?.['group']?.['code'];
                            if (groupA < groupB) return -1;
                            if (groupA > groupB) return 1;
                            return 0;
                        });
                        return unit_of_measure ? unit_of_measure : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'w-15',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<span class="badge badge-light w-70">${data}</span>`
                        }
                        return `<span class="badge badge-primary w-70">${data}</span>`
                    }
                },
                {
                    data: 'title',
                    className: 'w-30',
                    render: (data, type, row) => {
                        if (row?.['is_default']) {
                            return `<b>${data}</b>`
                        }
                        return `${data}`
                    }
                },
                {
                    data: 'group',
                        render: (data) => {
                        return `${data?.['title']}`
                    }
                },
                {
                    data: 'is_referenced_unit',
                    className: 'w-40 text-center',
                    render: (data, type, row) => {
                        if (row.group.hasOwnProperty('is_referenced_unit')) {
                            if (row.group.is_referenced_unit === true) {
                                return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`;
                            } else {
                                return ``;
                            }
                        }
                        return '';
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-uom"
                                data-id="${row?.['id']}"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-update-uom"
                                data-bs-placement="top" title="">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-primary">
                                    <i data-feather="edit"></i>
                                </span>
                            </span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        if (!row?.['is_default']) {
                            return `${edit_btn}${delete_btn}`
                        }
                        return `${edit_btn}`
                    }
                }
            ],
        })
    }
    function loadSelectBoxUnitMeasure(ele, data, group_id) {
        ele.empty()
        ele.initSelect2({
            allowClear: true,
            ajax: {
                url: ele.attr('data-url')+`?group=${group_id}`,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'unit_of_measure',
            keyId: 'id',
            keyText: 'title',
        })
    }

    loadProductType()
    loadProductCategory()
    loadManufacturer()
    loadSelectBoxUnitMeasureGroup($('#select-box-uom-group'))
    loadUnitOfMeasureGroup()
    loadUnitOfMeasure()

    $(document).on('click', '.btn-delete', function () {
        const tableCurrent = $(this).closest('table')
        Swal.fire({
            html:
            `<div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div><h5 class="text-danger">${trans_script.attr('data-trans-confirm-delete')}</h5><p>${trans_script.attr('data-trans-notify')}</p>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container:'swal2-has-bg',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: trans_script.attr('data-trans-delete'),
            cancelButtonText: trans_script.attr('data-trans-cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let delete_url = tableCurrent.attr('data-url-detail').replace('/0', `/${$(this).attr('data-id')}`)
                $.fn.callAjax2({
                    url: delete_url,
                    data: {},
                    method: 'DELETE',
                }).then(
                    (resp) => {
                        $.fn.switcherResp(resp);
                        $.fn.notifyB({'description': 'Delete successfully!'}, 'success');
                        if (tableCurrent.attr('id') === 'datatable-product-type-list') {
                            loadProductType()
                        }
                        else if (tableCurrent.attr('id') === 'datatable-product-category-list') {
                            loadProductCategory()
                        }
                        else if (tableCurrent.attr('id') === 'datatable-unit-measure-group-list') {
                            loadUnitOfMeasureGroup()
                        }
                        else if (tableCurrent.attr('id') === 'datatable-unit-measure-list') {
                            loadUnitOfMeasure()
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({'description': errs.data.errors.detail}, 'failure');
                    }
                )
            }
        })
    })

    let frm_create_product_type = $('#form-create-product-type')
    let frm_update_product_type = $('#form-update-product-type')

    $(document).on("click", '.btn-update-product-type', function () {
        let modal = $('#modal-update-product-type')
        modal.find('#inp-edit-code-product-type').val($(this).attr('data-code'))
        modal.find('#inp-edit-name-product-type').val($(this).attr('data-title'))
        modal.find('#inp-edit-description-product-type').val($(this).attr('data-description'))
        let raw_url = frm_update_product_type.attr('data-url-raw')
        frm_update_product_type.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
        current_product_type_id = $(this).attr('data-id')
        // loadAccountDeterminationTable(current_product_type_id)
    })

    new SetupFormSubmit(frm_create_product_type).validate({
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
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-product-type').modal('hide')
                        $('#modal-new-product-type form')[0].reset()
                        loadProductType()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_product_type).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-product-type').modal('hide')
                        loadProductType()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let frm_create_product_category = $('#form-create-product-category')
    let frm_update_product_category = $('#form-update-product-category')

    $(document).on("click", '.btn-update-product-category', function () {
        let modal = $('#modal-update-product-category')
        modal.find('#inp-edit-code-product-category').val($(this).attr('data-code'))
        modal.find('#inp-edit-name-product-category').val($(this).attr('data-title'))
        modal.find('#inp-edit-description-product-category').val($(this).attr('data-description'))
        let raw_url = frm_update_product_category.attr('data-url-raw')
        frm_update_product_category.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_product_category).validate({
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
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-product-category').modal('hide')
                        $('#modal-new-product-category form')[0].reset()
                        loadProductCategory()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_product_category).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-product-category').modal('hide')
                        loadProductCategory()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let frm_create_manufacturer = $('#form-create-manufacturer')
    let frm_update_manufacturer = $('#form-update-manufacturer')

    $(document).on("click", '.btn-update-manufacturer', function () {
        let modal = $('#modal-update-manufacturer')
        modal.find('#inp-edit-code-manufacturer').val($(this).attr('data-code'))
        modal.find('#inp-edit-name-manufacturer').val($(this).attr('data-title'))
        modal.find('#inp-edit-description-manufacturer').val($(this).attr('data-description'))
        let raw_url = frm_update_manufacturer.attr('data-url-raw')
        frm_update_manufacturer.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_manufacturer).validate({
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
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-manufacturer').modal('hide')
                        $('#modal-new-manufacturer form')[0].reset()
                        loadManufacturer()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_manufacturer).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-manufacturer').modal('hide')
                        loadManufacturer()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let frm_create_uom_group = $('#form-create-uom-group')
    let frm_update_uom_group = $('#form-update-uom-group')

    $(document).on("click", '.btn-update-uom-group', function () {
        loadSelectBoxUnitMeasure(
            $('#select-referenced-unit'),
            $(this).attr('data-referenced-id') ? {
                'id': $(this).attr('data-referenced-id'),
                'code': $(this).attr('data-referenced-code'),
                'title': $(this).attr('data-referenced-title'),
            } : null,
            $(this).attr('data-id')
        )
        let modal = $('#modal-update-uom-group')
        modal.find('#inp-edit-code-uom-group').val($(this).attr('data-code'))
        modal.find('#inp-edit-name-uom-group').val($(this).attr('data-title'))
        let raw_url = frm_update_uom_group.attr('data-url-raw')
        frm_update_uom_group.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))
    })

    new SetupFormSubmit(frm_create_uom_group).validate({
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
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-uom-group').modal('hide')
                        $('#modal-new-uom-group form')[0].reset()
                        loadUnitOfMeasureGroup()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_uom_group).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-uom-group').modal('hide')
                        loadUnitOfMeasureGroup()
                        loadUnitOfMeasure()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    let frm_create_uom = $('#form-create-uom');
    let frm_update_uom = $('#form-update-uom')

    new SetupFormSubmit(frm_create_uom).validate({
        rules: {
            title: {
                required: true,
            },
            group: {
                required: true,
            },
            code: {
                required: true,
            },
            ratio: {
                required: true,
                number: true,
                min: 0.000001,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-new-uom').modal('hide');
                        $('#modal-new-uom form')[0].reset()
                        $('#select-box-uom-group').empty()
                        $('#select-box-uom-group-edit').empty()
                        loadUnitOfMeasure()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit(frm_update_uom).validate({
        rules: {
            title: {
                required: true,
            },
            ratio: {
                required: true,
                number: true,
                min: 0.000001,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['group'] = $('#select-box-edit-uom-group').find('option:selected').val();
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-update-uom').modal('hide');
                        loadUnitOfMeasure()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    $(document).on('click', '.btn-update-uom', function () {
        let raw_url = frm_update_uom.attr('data-url-raw')
        frm_update_uom.attr('data-url', raw_url.replace('/0', `/${$(this).attr('data-id')}`))

        let ajax_uom_detail = $.fn.callAjax2({
            url: frm_update_uom.attr('data-url'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('unit_of_measure')) {
                    return data?.['unit_of_measure'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ajax_uom_detail]).then(
            (results) => {
                let data = results[0];
                $('#inp-code-uom-update').val(data?.['code']);
                $('#inp-edit-name-unit').val(data?.['title']);
                $('#inp-rounding-edit').val(data?.['rounding']);
                $('#ratio-unit-edit').val(data?.['ratio']);
                loadSelectBoxUnitMeasureGroup($('#select-box-edit-uom-group'), data?.['group']);
                $('#referenced-unit-edit').val(data?.['group']?.['title'])
            })
    })
})
