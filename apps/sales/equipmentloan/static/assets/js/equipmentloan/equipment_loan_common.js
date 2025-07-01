/**
 * Khai báo các element trong page
 */
class EquipmentLoanPageElements {
    constructor() {
        // info
        this.$script_url = $('#script-url')
        this.$trans_url = $('#trans-url')
        this.$title = $('#title')
        this.$account = $('#account')
        this.$document_date = $('#document-date')
        this.$loan_date = $('#loan-date')
        this.$return_date = $('#return-date')
        // line detail
        this.$table_line_detail = $('#table_line_detail')
        // modal
        this.$account_select_btn = $('#account-select-btn')
        this.$account_select_modal = $('#account-select-modal')
        this.$accept_select_account_btn = $('#accept-select-account-btn')
        this.$table_select_account = $('#table-select-account')
        // picking
        this.$picking_product_modal = $('#picking-product-modal')
        this.$table_select_warehouse = $('#table-select-warehouse')
        this.$table_select_lot = $('#table-select-lot')
        this.$table_select_serial = $('#table-select-serial')
        this.$accept_picking_product_btn = $('#accept-picking-product-btn')
    }
}
const pageElements = new EquipmentLoanPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class EquipmentLoanPageVariables {
    constructor() {
        this.current_product = null
        this.current_loan_row = null
    }
}
const pageVariables = new EquipmentLoanPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class EquipmentLoanPageFunction {
    static LoadAccountTable() {
        pageElements.$table_select_account.DataTable().clear().destroy()
        pageElements.$table_select_account.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.$table_select_account.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('account_dd_list')) {
                        return data?.['account_dd_list'];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input type="radio" name="account-selected-radio" class="form-check-input" data-account='${JSON.stringify(row)}'/>
                                </div>`
                    }
                },
                {
                    data: 'name',
                    className: 'w-70',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary mr-2">${row?.['code']}</span><span>${row?.['name']}</span>`
                    }
                },
                {
                    data: 'tax_code',
                    className: 'w-20',
                    render: (data, type, row) => {
                        return row?.['tax_code']
                    }
                },
            ],
        })
    }
    static LoadLineDetailTable(data_list=[], option='create') {
        pageElements.$table_line_detail.DataTable().clear().destroy()
        pageElements.$table_line_detail.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '60vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-75',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <span class="input-group-text" id="basic-addon1">
                                        <a class="icon-collapse" data-bs-toggle="collapse" href="" role="button" aria-expanded="false" aria-controls="">
                                            <i class="bi bi-info-circle"></i>
                                        </a>
                                        <span class="badge badge-sm badge-light ml-1 loan-product-code">${row?.['product_data']?.['code'] || ''}</span>
                                    </span>
                                    <select ${option === 'detail' ? 'disabled readonly' : ''} class="form-select select2 loan-product"></select>
                                </div>
                                <div class="collapse"><span class="small">${row?.['product_data']?.['description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <input disabled readonly type="number" min="0" class="form-control loan-quantity">
                                    <button type='button' ${option === 'detail' ? 'disabled' : ''}
                                            class="btn btn-outline-secondary btn-xs btn-pick-detail"
                                            disabled
                                            data-bs-toggle="modal"
                                            data-bs-target="#picking-product-modal">
                                        <span class="icon"><i class="fa-solid fa-ellipsis"></i></span>
                                    </button>
                                </div>
                                <script class="data-none-detail">${JSON.stringify(row?.['product_none_detail'] || [])}</script>
                                <script class="data-lot-detail">${JSON.stringify(row?.['product_lot_detail'] || [])}</script>
                                <script class="data-sn-detail">${JSON.stringify(row?.['product_sn_detail'] || [])}</script>`
                    }
                },
                {
                    className: 'w-5 text-right',
                    'render': () => {
                        return `<button type='button' ${option === 'detail' ? 'disabled' : ''}
                                        class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs btn-del-line-detail"
                                        >
                                    <span class="icon"><i class="fas fa-trash"></i></span>
                                </button>`;
                    }
                },
            ],
            initComplete: function () {
                pageElements.$table_line_detail.find('tbody tr').each(function (index, ele) {
                    $(ele).find('.loan-product-code').text(data_list[index]?.['loan_product_data']?.['code'])
                    UsualLoadPageFunction.LoadProduct({
                        element: $(ele).find('.loan-product'),
                        data: data_list[index]?.['loan_product_data'],
                        data_url: pageElements.$table_line_detail.attr('data-url-loan-product-list')
                    })
                    $(ele).find('.loan-quantity').val(data_list[index]?.['loan_quantity'])
                    $(ele).find('.data-none-detail').text(JSON.stringify(data_list[index]?.['loan_product_none_detail']))
                    $(ele).find('.data-lot-detail').text(JSON.stringify(data_list[index]?.['loan_product_lot_detail']))
                    $(ele).find('.data-sn-detail').text(JSON.stringify(data_list[index]?.['loan_product_sn_detail']))
                })
            }
        })
    }
    static LoadTableWarehouseByProduct(url='', general_traceability_method='') {
        const table_columns_cfg = [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<div class="form-check">
                            <input type="radio" name="product-warehouse-select"
                                   class="form-check-input product-warehouse-select"
                                   data-product-warehouse-id="${row?.['id'] || ''}"
                                   data-warehouse-id="${row?.['warehouse_data']?.['id'] || ''}"
                            >
                        </div>`;
                }
            },
            {
                className: 'w-50',
                render: (data, type, row) => {
                    return `<span class="badge badge-sm badge-soft-blue">${row?.['warehouse_data']?.['code'] || ''}</span> <span>${row?.['warehouse_data']?.['title'] || ''}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span>${row?.['stock_amount']}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<input disabled readonly type="number" min="0" max="${row?.['stock_amount'] || ''}" class="form-control none-picked-quantity" value="0">`
                }
            }
        ]
        pageElements.$table_select_warehouse.DataTable().clear().destroy()
        if (url) {
            pageElements.$table_select_warehouse.DataTableDefault({
                styleDom: 'hide-foot',
                useDataServer: true,
                rowIdx: true,
                paging: false,
                scrollX: true,
                scrollY: '63vh',
                scrollCollapse: true,
                reloadCurrency: true,
                ajax: {
                    url: url,
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['warehouse_list_by_product'] ? resp.data['warehouse_list_by_product'] : [];
                        }
                        return [];
                    },
                },
                columns: table_columns_cfg,
                columnDefs: [
                    {
                        targets: [4],
                        visible: false,
                    }
                ],
                initComplete: function () {
                    pageElements.$table_select_warehouse.DataTable().column(4).visible(Number(general_traceability_method) === 0)
                    if (Number(general_traceability_method) === 0) {
                        let none_list_raw = pageVariables.current_loan_row.find('.data-none-detail').text()
                        let none_list = none_list_raw ? JSON.parse(none_list_raw) : []
                        pageElements.$table_select_warehouse.find('tbody tr').each(function (index, ele) {
                            let existed = none_list.find(item => item?.['warehouse_id'] === $(ele).find('.product-warehouse-select').attr('data-warehouse-id'))
                            if (existed) {
                                $(ele).find('.none-picked-quantity').val(existed?.['picked_quantity'])
                            }
                        })
                    }
                    EquipmentLoanPageFunction.LoadTableLotListByWarehouse()
                    EquipmentLoanPageFunction.LoadTableSerialListByWarehouse()
                }
            })
        }
        else {
            pageElements.$table_select_warehouse.DataTableDefault({
                styleDom: 'hide-foot',
                useDataServer: false,
                rowIdx: true,
                paging: false,
                scrollX: true,
                scrollY: '63vh',
                scrollCollapse: true,
                reloadCurrency: true,
                data: [],
                columns: table_columns_cfg,
                columnDefs: [
                    {
                        targets: [4],
                        visible: false,
                    }
                ],
                initComplete: function () {
                    pageElements.$table_select_warehouse.DataTable().column(4).visible(Number(general_traceability_method) === 0)
                    if (Number(general_traceability_method) === 0) {
                        let none_list_raw = pageVariables.current_loan_row.find('.data-none-detail').text()
                        let none_list = none_list_raw ? JSON.parse(none_list_raw) : []
                        pageElements.$table_select_warehouse.find('tbody tr').each(function (index, ele) {
                            let existed = none_list.find(item => item?.['warehouse_id'] === $(ele).find('.product-warehouse-select').attr('data-warehouse-id'))
                            if (existed) {
                                $(ele).find('.none-picked-quantity').val(existed?.['picked_quantity'])
                            }
                        })
                    }
                    EquipmentLoanPageFunction.LoadTableLotListByWarehouse()
                    EquipmentLoanPageFunction.LoadTableSerialListByWarehouse()
                }
            });
        }
    }
    static LoadTableLotListByWarehouse(url='') {
        const table_columns_cfg = [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<div class="form-check">
                                <input type="radio"
                                       name="lot-select"
                                       class="form-check-input lot-select"
                                       data-lot-id="${row?.['id']}"
                                >
                            </div>`;
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span>${row?.['lot_number']}</span>`
                }
            },
            {
                className: 'w-15 text-center',
                render: (data, type, row) => {
                    return `<span class="quantity-import">${row?.['quantity_import']}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span>${moment(row?.['expire_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span>${moment(row?.['manufacture_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<input disabled readonly type="number" min="0" max="${row?.['quantity_import'] || ''}" class="form-control lot-picked-quantity" value="0">`
                }
            },
        ];
        pageElements.$table_select_lot.DataTable().clear().destroy()
        if (url) {
            pageElements.$table_select_lot.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '63vh',
                scrollCollapse: true,
                reloadCurrency: true,
                ajax: {
                    url: url,
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['product_lot_list'] ? resp.data['product_lot_list'] : [];
                        }
                        return [];
                    },
                },
                columns: table_columns_cfg
            }).on('draw.dt', function () {
                let lot_id_list_raw = pageVariables.current_loan_row.find('.data-lot-detail').text()
                let lot_id_list = lot_id_list_raw ? JSON.parse(lot_id_list_raw) : []
                pageElements.$table_select_lot.find('tbody tr .lot-select').each(function () {
                    let lot_id = $(this).attr('data-lot-id')
                    let matched_item = lot_id_list.find(item => item?.['lot_id'] === lot_id)
                    if (matched_item) {
                        $(this).closest('tr').find('.lot-picked-quantity').val(matched_item?.['picked_quantity'] || 0)
                    }
                });
            });
        }
        else {
            pageElements.$table_select_lot.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                scrollX: true,
                scrollY: '63vh',
                scrollCollapse: true,
                reloadCurrency: true,
                data: [],
                columns: table_columns_cfg
            });
        }
    }
    static LoadTableSerialListByWarehouse(url='') {
        const table_columns_cfg = [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<div class="form-check">
                                <input type="checkbox"
                                       class="form-check-input serial-select"
                                       data-serial-id="${row?.['id']}"
                                >
                            </div>`;
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span>${row?.['vendor_serial_number']}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span>${row?.['serial_number']}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span>${moment(row?.['expire_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span>${moment(row?.['manufacture_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span>${moment(row?.['warranty_start'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span>${moment(row?.['warranty_end'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`
                }
            },
        ]
        pageElements.$table_select_serial.DataTable().clear().destroy()
        if (url) {
            pageElements.$table_select_serial.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '63vh',
                scrollCollapse: true,
                reloadCurrency: true,
                ajax: {
                    url: url,
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['product_serial_list'] ? resp.data['product_serial_list'] : [];
                        }
                        return [];
                    },
                },
                columns: table_columns_cfg
            }).on('draw.dt', function () {
                let serial_id_list_raw = pageVariables.current_loan_row.find('.data-sn-detail').text()
                let serial_id_list = serial_id_list_raw ? JSON.parse(serial_id_list_raw) : []
                pageElements.$table_select_serial.find('tbody tr .serial-select').each(function () {
                    if (serial_id_list.includes($(this).attr('data-serial-id'))) {
                        $(this).prop('checked', true)
                    }
                })
            });
        }
        else {
            pageElements.$table_select_serial.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                scrollX: true,
                scrollY: '63vh',
                scrollCollapse: true,
                reloadCurrency: true,
                data: [],
                columns: table_columns_cfg
            });
        }
    }
}

/**
 * Khai báo các hàm chính
 */
class EquipmentLoanHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['account_mapped'] = pageElements.$account.attr('data-id')
        frm.dataForm['document_date'] = moment(pageElements.$document_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['loan_date'] = moment(pageElements.$loan_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['return_date'] = moment(pageElements.$return_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        let equipment_loan_item_list = []
        pageElements.$table_line_detail.find('tbody tr').each(function (index, ele) {
            if ($(this).find('.dataTables_empty').length === 0) {
                equipment_loan_item_list.push({
                    'loan_product_id': $(ele).find('.loan-product').val() || null,
                    'loan_product_none_detail': $(ele).find('.data-none-detail').text() ? JSON.parse($(ele).find('.data-none-detail').text()) : [],
                    'loan_product_lot_detail': $(ele).find('.data-lot-detail').text() ? JSON.parse($(ele).find('.data-lot-detail').text()) : [],
                    'loan_product_sn_detail': $(ele).find('.data-sn-detail').text() ? JSON.parse($(ele).find('.data-sn-detail').text()) : [],
                    'loan_quantity': $(ele).find('.loan-quantity').val(),
                })
            }
        })
        frm.dataForm['equipment_loan_item_list'] = equipment_loan_item_list

        return frm
    }
    static LoadDetailEquipmentLoan(option) {
        let url_loaded = $('#form-detail-equipment-loan').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['equipment_loan_detail'];

                    console.log(data)

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    pageElements.$title.val(data?.['title'])
                    pageElements.$account.val(data?.['account_mapped_data']?.['name'])
                    pageElements.$account.attr('data-id', data?.['account_mapped_data']?.['id'])
                    pageElements.$document_date.val(moment(data?.['document_date'], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    pageElements.$loan_date.val(moment(data?.['loan_date'], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    pageElements.$return_date.val(moment(data?.['return_date'], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    EquipmentLoanPageFunction.LoadLineDetailTable(data?.['equipment_loan_item_list'], option)

                    $.fn.initMaskMoney2();

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                    UsualLoadPageFunction.DisablePage(
                        option==='detail'
                    )
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class EquipmentLoanEventHandler {
    static InitPageEven() {
        pageElements.$account_select_btn.on('click', function () {
            EquipmentLoanPageFunction.LoadAccountTable()
        })
        pageElements.$accept_select_account_btn.on('click', function () {
            let selected_obj = null
            $('input[name="account-selected-radio"]').each(async function () {
                if ($(this).prop('checked')) {
                    selected_obj = $(this).attr('data-account') ? JSON.parse($(this).attr('data-account')) : {}
                    pageElements.$account.val(selected_obj?.['name']).attr('data-id', selected_obj?.['id']).prop('readonly', true).prop('disabled', true)
                    pageElements.$account_select_modal.modal('hide')
                }
            })
            if (!selected_obj) {
                $.fn.notifyB({description: 'Nothing selected'}, 'warning');
            }
        })
        $(document).on("click", '#btn-add-row-line-detail', function () {
            UsualLoadPageFunction.AddTableRow(
                pageElements.$table_line_detail,
                {}
            )
            let row_added = pageElements.$table_line_detail.find('tbody tr:last-child')
            UsualLoadPageFunction.LoadProduct({
                element: row_added.find('.loan-product'),
                data_url: pageElements.$table_line_detail.attr('data-url-loan-product-list')
            })
        })
        $(document).on("click", '.btn-del-line-detail', function () {
            UsualLoadPageFunction.DeleteTableRow(
                pageElements.$table_line_detail,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
        })
        $(document).on("change", '.loan-product', function () {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            if (Object.keys(selected).length !== 0) {
                $(this).closest('tr').find('.loan-product-code').text(selected?.['code'])
                $(this).closest('tr').find('.icon-collapse').attr('href', `.d1_${selected?.['id']}`)
                $(this).closest('tr').find('.icon-collapse').attr('aria-controls', `.d1_${selected?.['id']}`)
                $(this).closest('tr').find('.collapse').addClass(`d1_${selected?.['id']}`)
                $(this).closest('tr').find('.collapse span').text(selected?.['description'])
                $(this).closest('tr').find('.btn-pick-detail').prop('disabled', false)
            }
        })
        $(document).on("click", '.btn-pick-detail', function () {
            let selected = SelectDDControl.get_data_from_idx($(this).closest('tr').find('.loan-product'), $(this).closest('tr').find('.loan-product').val())
            if (Object.keys(selected).length !== 0) {
                pageVariables.current_loan_row = $(this).closest('tr')
                pageVariables.current_product = selected
                let url = `${pageElements.$script_url.attr('data-url-warehouse-list-by-product')}&product_id=${selected?.['id']}`
                EquipmentLoanPageFunction.LoadTableWarehouseByProduct(url, selected?.['general_traceability_method'])

                if (Number(selected?.['general_traceability_method']) === 0) {
                    pageElements.$table_select_warehouse.closest('.table-none-space').attr('class', 'col-12 col-md-12 col-lg-12 table-none-space border-right')
                }
                else {
                    pageElements.$table_select_warehouse.closest('.table-none-space').attr('class', 'col-12 col-md-4 col-lg-4 table-none-space border-right')
                }
            }
        })
        $(document).on("change", '.product-warehouse-select', function () {
            pageElements.$table_select_lot.closest('.table-lot-space').prop('hidden', Number(pageVariables.current_product?.['general_traceability_method']) !== 1)
            pageElements.$table_select_serial.closest('.table-serial-space').prop('hidden', Number(pageVariables.current_product?.['general_traceability_method']) !== 2)
            if (Number(pageVariables.current_product?.['general_traceability_method']) === 0) {
                pageElements.$table_select_warehouse.find('tr .none-picked-quantity').prop('disabled', true).prop('readonly', true)
                $(this).closest('tr').find('.none-picked-quantity').prop('disabled', false).prop('readonly', false)
            }
            if (Number(pageVariables.current_product?.['general_traceability_method']) === 1) {
                let product_id = pageVariables.current_product?.['id']
                let warehouse_id = $(this).attr('data-warehouse-id')
                let url = `${pageElements.$script_url.attr('data-url-lot-list-by-warehouse')}?product_warehouse__product_id=${product_id}&product_warehouse__warehouse_id=${warehouse_id}`
                EquipmentLoanPageFunction.LoadTableLotListByWarehouse(url)
            }
            if (Number(pageVariables.current_product?.['general_traceability_method']) === 2) {
                let product_id = pageVariables.current_product?.['id']
                let warehouse_id = $(this).attr('data-warehouse-id')
                let url = `${pageElements.$script_url.attr('data-url-serial-list-by-warehouse')}?product_warehouse__product_id=${product_id}&product_warehouse__warehouse_id=${warehouse_id}`
                EquipmentLoanPageFunction.LoadTableSerialListByWarehouse(url)
            }
        })
        $(document).on("change", '.none-picked-quantity', function () {
            let component_none_list = []

            let sum_picked_quantity = 0
            pageElements.$table_select_warehouse.find('tbody tr').each(function (index, ele) {
                component_none_list.push({
                    'product_warehouse_id': $(ele).find('.product-warehouse-select').attr('data-product-warehouse-id'),
                    'picked_quantity': parseFloat($(ele).find('.none-picked-quantity').val()) || 0
                })
                sum_picked_quantity += parseFloat($(ele).find('.none-picked-quantity').val()) || 0
            })

            pageVariables.current_loan_row.find('.data-none-detail').text(JSON.stringify(component_none_list))
            pageVariables.current_loan_row.find('.loan-quantity').val(sum_picked_quantity)
        })
        $(document).on("change", '.serial-select', function () {
            let serial_id_list_raw = pageVariables.current_loan_row.find('.data-sn-detail').text()
            let serial_id_list = serial_id_list_raw ? JSON.parse(serial_id_list_raw) : []

            let serial_id = $(this).attr('data-serial-id')

            if ($(this).prop('checked')) {
                if (!serial_id_list.includes(serial_id)) {
                    serial_id_list.push(serial_id)
                }
            } else {
                serial_id_list = serial_id_list.filter(id => id !== serial_id)
            }
            pageVariables.current_loan_row.find('.data-sn-detail').text(JSON.stringify(serial_id_list))
            pageVariables.current_loan_row.find('.loan-quantity').val(serial_id_list.length)
        })
        $(document).on("change", '.lot-select', function () {
            pageElements.$table_select_lot.find('tr .lot-picked-quantity').prop('disabled', true).prop('readonly', true)
            $(this).closest('tr').find('.lot-picked-quantity').prop('disabled', false).prop('readonly', false)
        })
        $(document).on("change", '.lot-picked-quantity', function () {
            let row = $(this).closest("tr");
            let lot_id_list_raw = pageVariables.current_loan_row.find(".data-lot-detail").text();
            let lot_id_list = lot_id_list_raw ? JSON.parse(lot_id_list_raw) : [];

            let lot_id = row.find(".lot-select").attr("data-lot-id");

            let existed_index = lot_id_list.findIndex(item => item?.['lot_id'] === lot_id);
            let picked_quantity = parseFloat(row.find(".lot-picked-quantity").val()) || 0;

            if (existed_index !== -1) {
                lot_id_list[existed_index]['picked_quantity'] = picked_quantity;
            } else {
                lot_id_list.push({
                    'lot_id': lot_id,
                    'picked_quantity': picked_quantity
                });
            }

            let sum_picked_quantity = lot_id_list.reduce((sum, item) => sum + (item?.['picked_quantity'] || 0), 0);

            pageVariables.current_loan_row.find(".data-lot-detail").text(JSON.stringify(lot_id_list));
            pageVariables.current_loan_row.find(".loan-quantity").val(sum_picked_quantity);
        })
    }
}
