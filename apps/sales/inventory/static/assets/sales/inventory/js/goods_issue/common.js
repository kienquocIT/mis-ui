/**
 * Khai báo các element trong page
 */
class GISPageElements {
    constructor() {
        this.script_url = $('#script-url')
        this.script_trans = $('#script-trans')
        this.gis_type = $('#type')
        this.IAEle = $('#box-select-ia')
        this.POWOEle = $('#box-select-powo')
        this.PMEle = $('#box-select-pm')
        this.FAEle = $('#box-select-fa')
        this.IAItemTable = $('#dtbProductIA')
        this.POItemTable = $('#dtbProductProduction')
        this.PMItemTable = $('#dtbProductPM')
        this.FAItemTable = $('#dtbProductFA')
        this.IAItemTableDiv = $('#table-for-ia')
        this.POItemTableDiv = $('#table-for-production')
        this.PMItemTableDiv = $('#table-for-pm')
        this.FAItemTableDiv = $('#table-for-fa')
        this.NONETable = $('#select-detail-table-none')
        this.SNTable = $('#select-detail-table-sn')
        this.SNTableNotify = $('#select-detail-table-sn-notify')
        this.LOTTable = $('#select-detail-table-lot')
        this.done_none = $('#select-detail-table-none-done')
        this.done_sn = $('#select-detail-table-sn-done')
        this.done_lot = $('#select-detail-table-lot-done')
        this.detail_modal = $('#select-detail-modal')
        this.btn_select_ia = $('#btn-select-ia')
        this.btn_accept_select_ia = $('#btn-accept-select-ia')
        this.ia_table = $('#select-ia-table')
        this.select_ia_modal = $('#select-ia-modal')
        this.btn_select_powo = $('#btn-select-powo')
        this.btn_accept_select_powo = $('#btn-accept-select-powo')
        this.powo_table = $('#select-powo-table')
        this.select_powo_modal = $('#select-powo-modal')
        this.btn_select_pm = $('#btn-select-pm')
        this.btn_accept_select_pm = $('#btn-accept-select-pm')
        this.pm_table = $('#select-pm-table')
        this.select_pm_modal = $('#select-pm-modal')
        this.stock_quantity = $('#stock-quantity')
        this.issue_quantity = $('#issue-quantity')
    }
}
const pageElements = new GISPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class GISPageVariables {
    constructor() {
        this.current_detail_row_btn = null
        this.IS_DETAIL_PAGE = false
        this.IS_DONE_GIS = false
    }
}
const pageVariables = new GISPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class GISPageFunction {
    static DrawTableIAItems(data_list=[]) {
        pageElements.IAItemTable.DataTable().clear().destroy()
        pageElements.IAItemTable.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '68vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-light">${row?.['product_mapped']?.['code'] || ''}</span><br>
                                <span>${row?.['product_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['product_mapped']?.['description'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-light">${row?.['warehouse_mapped']?.['code'] || ''}</span> <span>${row?.['warehouse_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['uom_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="sum-quantity">${row?.['sum_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="before-quantity">${row?.['before_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="remain-quantity">${row?.['remain_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <input readonly disabled class="form-control selected-quantity" type="number" value="${row?.['issued_quantity'] || 0}">
                                    <button ${((row?.['product_mapped']?.['general_traceability_method'] || '') === 0 && pageVariables.IS_DONE_GIS || (row?.['issued_quantity'] || '') === 0 && pageVariables.IS_DONE_GIS) ? 'disabled' : ''}
                                            data-uom-id="${row?.['uom_mapped']?.['id'] || ''}"
                                            data-uom-title="${row?.['uom_mapped']?.['title'] || ''}"
                                            data-prd-id="${row?.['product_mapped']?.['id'] || ''}"
                                            data-prd-type="${row?.['product_mapped']?.['general_traceability_method'] || ''}"
                                            data-wh-id="${row?.['warehouse_mapped']?.['id'] || ''}"
                                            data-remain-quantity="${row?.['remain_quantity'] || 0}"
                                            data-item-id="${row?.['id'] || ''}"
                                            data-bs-toggle="modal"
                                            data-bs-target="#select-detail-modal"
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary select-detail">
                                        <i class="bi bi-list-check"></i>
                                    </button>
                                </div>
                                <script class="lot-data-script">${row?.['lot_data'] ? JSON.stringify(row?.['lot_data']) : JSON.stringify([])}</script>
                                <script class="sn-data-script">${row?.['sn_data'] ? JSON.stringify(row?.['sn_data']) : JSON.stringify([])}</script>
                        `;
                    }
                },
            ],
        })
    }
    static DrawTablePOItems(data_list=[], option='create') {
        pageElements.POItemTable.DataTable().clear().destroy()
        pageElements.POItemTable.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '68vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-light">${row?.['product_mapped']?.['code'] || ''}</span><br>
                                <span>${row?.['product_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['product_mapped']?.['description'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 selected-warehouse"></select>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['uom_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="sum-quantity">${row?.['sum_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="before-quantity">${row?.['before_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="remain-quantity">${row?.['remain_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <input readonly disabled class="form-control selected-quantity" type="number" value="${row?.['issued_quantity']|| 0}">
                                    <button ${((row?.['product_mapped']?.['general_traceability_method'] || '') === 0 && pageVariables.IS_DONE_GIS || (row?.['issued_quantity'] || '') === 0 && pageVariables.IS_DONE_GIS) ? 'disabled' : ''}
                                            data-uom-id="${row?.['uom_mapped']?.['id'] || ''}"
                                            data-uom-title="${row?.['uom_mapped']?.['title'] || ''}"
                                            data-prd-id="${row?.['product_mapped']?.['id'] || ''}"
                                            data-prd-type="${row?.['product_mapped']?.['general_traceability_method'] || ''}"
                                            data-wh-id="${row?.['warehouse_mapped']?.['id'] || ''}"
                                            data-remain-quantity="${row?.['remain_quantity'] || 0}"
                                            data-item-id="${row?.['id'] || ''}"
                                            data-bs-toggle="modal"
                                            data-bs-target="#select-detail-modal"
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary select-detail">
                                        <i class="bi bi-list-check"></i>
                                    </button>
                                </div>
                                <script class="lot-data-script">${row?.['lot_data'] ? JSON.stringify(row?.['lot_data']) : JSON.stringify([])}</script>
                                <script class="sn-data-script">${row?.['sn_data'] ? JSON.stringify(row?.['sn_data']) : JSON.stringify([])}</script>
                        `;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    pageElements.POItemTable.find('tbody tr').each(function (index) {
                        GISPageFunction.LoadWarehouse($(this).find('.selected-warehouse'), data_list[index]?.['warehouse_mapped'])
                    })
                }
            }
        })
    }
    static DrawTablePMItems(data_list=[], for_root=false) {
        let table_columns_cfg = [
                {
                    className: 'w-5',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-light">${row?.['product_mapped']?.['code'] || ''}</span><br>
                                <span>${row?.['product_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<span>${row?.['product_mapped']?.['description'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-light">${row?.['warehouse_mapped']?.['code'] || ''}</span> <span>${row?.['warehouse_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['uom_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="sum-quantity">${row?.['sum_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <input readonly disabled class="form-control selected-quantity" type="number" value="${row?.['issued_quantity'] || 0}">
                                    <button ${((row?.['product_mapped']?.['general_traceability_method'] || '') === 0 && pageVariables.IS_DONE_GIS || (row?.['issued_quantity'] || '') === 0 && pageVariables.IS_DONE_GIS) ? 'disabled' : ''}
                                            data-uom-id="${row?.['uom_mapped']?.['id'] || ''}"
                                            data-uom-title="${row?.['uom_mapped']?.['title'] || ''}"
                                            data-prd-id="${row?.['product_mapped']?.['id'] || ''}"
                                            data-prd-type="${row?.['product_mapped']?.['general_traceability_method'] || ''}"
                                            data-wh-id="${row?.['warehouse_mapped']?.['id'] || ''}"
                                            data-remain-quantity="${row?.['remain_quantity'] || 0}"
                                            data-item-id="${row?.['id'] || ''}"
                                            data-bs-toggle="modal"
                                            data-bs-target="#select-detail-modal"
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary select-detail">
                                        <i class="bi bi-list-check"></i>
                                    </button>
                                </div>
                                <script class="lot-data-script">${row?.['lot_data'] ? JSON.stringify(row?.['lot_data']) : JSON.stringify([])}</script>
                                <script class="sn-data-script">${row?.['sn_data'] ? JSON.stringify(row?.['sn_data']) : JSON.stringify([])}</script>
                        `;
                    }
                },
            ]
        let table_columns_cfg_for_root = [
            {
                className: 'w-5',
                render: () => {
                    return ``;
                }
            },
            {
                className: 'w-30',
                render: (data, type, row) => {
                    return `<span class="badge badge-sm badge-light">${row?.['code'] || ''}</span><br>
                            <span>${row?.['title'] || ''}</span>`;
                }
            },
            {
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span>${row?.['description'] || ''}</span>`;
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<select class="form-select select2 root-prd-wh-select"></select>`;
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span>${row?.['uom_mapped']?.['title'] || ''}</span>`;
                }
            },
            {
                className: 'text-center w-10',
                render: (data, type, row) => {
                    return `<span class="remain-quantity">1</span>`;
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<div class="input-group">
                                <input readonly disabled class="form-control selected-quantity" type="number" value="${row?.['issued_quantity'] || 0}">
                                <button ${((row?.['general_traceability_method'] || '') === 0 && pageVariables.IS_DONE_GIS || (row?.['issued_quantity'] || '') === 0 && pageVariables.IS_DONE_GIS) ? 'disabled' : ''}
                                        data-uom-id="${row?.['uom_mapped']?.['id'] || ''}"
                                        data-uom-title="${row?.['uom_mapped']?.['title'] || ''}"
                                        data-prd-id="${row?.['id'] || ''}"
                                        data-prd-type="${row?.['general_traceability_method'] || ''}"
                                        data-wh-id="${row?.['warehouse_mapped']?.['id'] || ''}"
                                        data-remain-quantity="1"
                                        data-item-id="${row?.['id'] || ''}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#select-detail-modal"
                                        type="button"
                                        class="btn btn-sm btn-outline-secondary select-detail">
                                    <i class="bi bi-list-check"></i>
                                </button>
                            </div>
                            <script class="lot-data-script">${row?.['lot_data'] ? JSON.stringify(row?.['lot_data']) : JSON.stringify([])}</script>
                            <script class="sn-data-script">${row?.['sn_data'] ? JSON.stringify(row?.['sn_data']) : JSON.stringify([])}</script>
                    `;
                }
            },
        ]
        pageElements.PMItemTable.DataTable().clear().destroy()
        pageElements.PMItemTable.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '68vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: for_root ? table_columns_cfg_for_root : table_columns_cfg,
            initComplete: function () {
                if (for_root) {
                    pageElements.PMItemTable.find('tbody tr').each(function (index, ele) {
                        UsualLoadPageFunction.LoadWarehouse({
                            element: $(ele).find('.root-prd-wh-select'),
                            data_url: pageElements.script_url.attr('data-url-warehouse-list'),
                        })
                    })

                    if (data_list.length > 0) {
                        pageElements.PMItemTable.find('tbody tr').each(function (index, ele) {
                            UsualLoadPageFunction.LoadWarehouse({
                                element: $(ele).find('.root-prd-wh-select'),
                                data_url: pageElements.script_url.attr('data-url-warehouse-list'),
                                data: data_list[index]?.['warehouse_mapped']
                            })
                        })
                    }
                }
            }
        })
    }
    static DrawTableFAItems(data_list=[], option='create') {
        pageElements.FAItemTable.DataTable().clear().destroy()
        pageElements.FAItemTable.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '68vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-light">${row?.['product_mapped']?.['code'] || ''}</span><br>
                                <span>${row?.['product_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['product_mapped']?.['description'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 selected-warehouse"></select>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['uom_mapped']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="sum-quantity">${row?.['sum_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="before-quantity">${row?.['before_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<span class="remain-quantity">${row?.['remain_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <input readonly disabled class="form-control selected-quantity" type="number" value="${row?.['issued_quantity']|| 0}">
                                    <button ${((row?.['product_mapped']?.['general_traceability_method'] || '') === 0 && pageVariables.IS_DONE_GIS || (row?.['issued_quantity'] || '') === 0 && pageVariables.IS_DONE_GIS) ? 'disabled' : ''}
                                            data-uom-id="${row?.['uom_mapped']?.['id'] || ''}"
                                            data-uom-title="${row?.['uom_mapped']?.['title'] || ''}"
                                            data-prd-id="${row?.['product_mapped']?.['id'] || ''}"
                                            data-prd-type="${row?.['product_mapped']?.['general_traceability_method'] || ''}"
                                            data-wh-id="${row?.['warehouse_mapped']?.['id'] || ''}"
                                            data-remain-quantity="${row?.['remain_quantity'] || 0}"
                                            data-item-id="${row?.['id'] || ''}"
                                            data-bs-toggle="modal"
                                            data-bs-target="#select-detail-modal"
                                            type="button"
                                            class="btn btn-sm btn-outline-secondary select-detail">
                                        <i class="bi bi-list-check"></i>
                                    </button>
                                </div>
                                <script class="lot-data-script">${row?.['lot_data'] ? JSON.stringify(row?.['lot_data']) : JSON.stringify([])}</script>
                                <script class="sn-data-script">${row?.['sn_data'] ? JSON.stringify(row?.['sn_data']) : JSON.stringify([])}</script>
                        `;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    pageElements.FAItemTable.find('tbody tr').each(function (index) {
                        GISPageFunction.LoadWarehouse($(this).find('.selected-warehouse'), data_list[index]?.['warehouse_mapped'])
                    })
                }
            }
        })
    }
    static DrawTableItemsLOT(data_list=[], selected_list=[]) {
        pageElements.LOTTable.DataTable().clear().destroy()
        pageElements.LOTTable.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '58vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    render: () => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['lot_number']}`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="limit-quantity">${row?.['quantity_import'] ? row?.['quantity_import'] : 0}</span>`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['expire_date'] ? moment(row?.['expire_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['manufacture_date'] ? moment(row?.['manufacture_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    render: (data, type, row) => {
                        let lot_selected_quantity = 0
                        for (let i = 0; i < selected_list.length; i++) {
                            if (selected_list[i]?.['lot_id'] === row?.['id']) {
                                lot_selected_quantity = selected_list[i]?.['quantity']
                            }
                        }
                        return `<input ${pageVariables.IS_DETAIL_PAGE ? 'disabled readonly' : ''} data-lot-id="${row?.['id']}" type="number" class="form-control lot-input" value="${lot_selected_quantity}">`;
                    }
                },
            ],
            initComplete: function () {
                if (!pageVariables.IS_DONE_GIS) {
                    $('.lot-input').trigger('change')
                }
                else {
                    $('.limit-quantity').text('--')
                    $('#amount-selected-lot').text(selected_list.reduce((acc, item) => acc + (item?.['quantity'] ? parseFloat(item?.['quantity']) : 0), 0))
                    $('#amount-balance-lot').text(pageVariables.current_detail_row_btn.closest('tr').find('.remain-quantity').text())
                }
            }
        })
    }
    static DrawTableItemsSN(data_list=[], selected_list=[]) {
        pageElements.SNTable.DataTable().clear().destroy()
        pageElements.SNTable.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '58vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    render: () => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['vendor_serial_number']}`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['serial_number']}`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['expire_date'] ? moment(row?.['expire_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['manufacture_date'] ? moment(row?.['manufacture_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['warranty_start'] ? moment(row?.['warranty_start'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `${row?.['warranty_end'] ? moment(row?.['warranty_end'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'}`;
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        let is_checked = selected_list.includes(row?.['id'])
                        return `<div class="form-check">
                                    <input ${is_checked ? 'checked': ''} data-sn-id="${row?.['id']}" type="checkbox" class="form-check-input sn-checkbox">
                                    <label class="form-check-label"></label>
                                </div>`;
                    }
                },
            ],
            initComplete: function () {
                $('.sn-checkbox').trigger('change')
                $('#get-all').prop('hidden', false)
            }
        })
    }
    static LoadIA() {
        let selected_ia = pageElements.IAEle.attr('data-id')
        pageElements.ia_table.DataTable().clear().destroy()
        pageElements.ia_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollY: '58vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.ia_table.attr('data-ia-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('inventory_adjustment_list')) {
                        return resp.data['inventory_adjustment_list'] ? resp.data['inventory_adjustment_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                            <input ${row?.['id'] === selected_ia ? 'checked' : ''} type="radio" name="ia-group" class="ia-selected form-check-input">
                        </div>`
                    }
                },
                {
                    className: 'w-50',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-secondary">${row?.['code']}</span><br><span data-id="${row?.['id']}" class="ia-title">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-20',
                    render: (data, type, row) => {
                        return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-20',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                    }
                },
            ],
        });
    }
    static LoadPOWO(dataList) {
        let selected_powo = pageElements.POWOEle.attr('data-id')
        pageElements.powo_table.DataTable().clear().destroy()
        pageElements.powo_table.DataTableDefault({
            rowIdx: true,
            scrollY: '58vh',
            scrollX: true,
            scrollCollapse: true,
            data: dataList,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                            <input ${row?.['id'] === selected_powo ? 'checked' : ''} type="radio" name="powo-group" class="powo-selected form-check-input">
                        </div>`
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<span>${row?.['app']}</span>`
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-secondary">${row?.['code']}</span><br><span data-id="${row?.['id']}" data-type="${row?.['type']}" class="powo-title">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-15',
                    render: (data, type, row) => {
                        return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-15',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                    }
                },
            ],
        });
    }
    static LoadPM() {
        let selected_pm = pageElements.PMEle.attr('data-id')
        pageElements.pm_table.DataTable().clear().destroy()
        pageElements.pm_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollY: '58vh',
            scrollX: true,
            scrollCollapse: true,
            ordering: false,
            ajax: {
                url: pageElements.pm_table.attr('data-pm-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('product_modification_list')) {
                        return resp.data['product_modification_list'] ? resp.data['product_modification_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                            <input ${row?.['id'] === selected_pm ? 'checked' : ''} type="radio" name="pm-group" class="pm-selected form-check-input">
                        </div>`
                    }
                },
                {
                    className: 'w-50',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-secondary">${row?.['code']}</span><br><span data-id="${row?.['id']}" class="pm-title">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-20',
                    render: (data, type, row) => {
                        return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-20',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                    }
                },
            ],
        });
    }
    static LoadWarehouse(ele, data) {
        ele.initSelect2({
            data: data,
            ajax: {
                data: {},
                url: pageElements.script_url.attr('data-url-warehouse-list'),
                method: 'GET',
            },
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if (ele.val()) {
                let warehouse_selected = SelectDDControl.get_data_from_idx(ele, ele.val())
                ele.closest('tr').find('.select-detail').attr('data-wh-id', warehouse_selected?.['id'])
                ele.closest('tr').find('.selected-quantity').val(0)
                ele.closest('tr').find('.lot-data-script').text('[]')
                ele.closest('tr').find('.sn-data-script').text('[]')
            }
        })
    }
}

/**
 * Khai báo các hàm chính
 */
class GISHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val()
        let detail_data_ia = []
        let detail_data_po = []
        let detail_data_wo = []
        let detail_data_pm = []
        if (pageElements.gis_type.val() === '0') {
            frm.dataForm['goods_issue_type'] = 0
            frm.dataForm['inventory_adjustment_id'] = pageElements.IAEle.attr('data-id')
            pageElements.IAItemTable.find('tbody tr').each(function () {
                let row = $(this);
                detail_data_ia.push({
                    'inventory_adjustment_item_id': row.find('.select-detail').attr('data-item-id'),
                    'product_id': row.find('.select-detail').attr('data-prd-id'),
                    'warehouse_id': row.find('.select-detail').attr('data-wh-id'),
                    'uom_id': row.find('.select-detail').attr('data-uom-id'),
                    'before_quantity': row.find('.before-quantity').text(),
                    'remain_quantity': row.find('.remain-quantity').text(),
                    'issued_quantity': row.find('.selected-quantity').val(),
                    'lot_data': row.find('.lot-data-script').text() ? JSON.parse(row.find('.lot-data-script').text()) : [],
                    'sn_data': row.find('.sn-data-script').text() ? JSON.parse(row.find('.sn-data-script').text()) : []
                })
            })
        }
        else if (pageElements.gis_type.val() === '1') {
            frm.dataForm['goods_issue_type'] = 1
        }
        else if (pageElements.gis_type.val() === '2') {
            frm.dataForm['goods_issue_type'] = 2
            let type = pageElements.POWOEle.attr('data-type')
            if (type === '0') {
                frm.dataForm['production_order_id'] = pageElements.POWOEle.attr('data-id')
                pageElements.POItemTable.find('tbody tr').each(function () {
                    let row = $(this);
                    detail_data_po.push({
                        'production_order_item_id': row.find('.select-detail').attr('data-item-id'),
                        'product_id': row.find('.select-detail').attr('data-prd-id'),
                        'warehouse_id': row.find('.select-detail').attr('data-wh-id'),
                        'uom_id': row.find('.select-detail').attr('data-uom-id'),
                        'before_quantity': row.find('.before-quantity').text(),
                        'remain_quantity': row.find('.remain-quantity').text(),
                        'issued_quantity': row.find('.selected-quantity').val(),
                        'lot_data': row.find('.lot-data-script').text() ? JSON.parse(row.find('.lot-data-script').text()) : [],
                        'sn_data': row.find('.sn-data-script').text() ? JSON.parse(row.find('.sn-data-script').text()) : []
                    })
                })
            }
            else {
                frm.dataForm['work_order_id'] = pageElements.POWOEle.attr('data-id')
                pageElements.POItemTable.find('tbody tr').each(function () {
                    let row = $(this);
                    detail_data_wo.push({
                        'work_order_item_id': row.find('.select-detail').attr('data-item-id'),
                        'product_id': row.find('.select-detail').attr('data-prd-id'),
                        'warehouse_id': row.find('.select-detail').attr('data-wh-id'),
                        'uom_id': row.find('.select-detail').attr('data-uom-id'),
                        'before_quantity': row.find('.before-quantity').text(),
                        'remain_quantity': row.find('.remain-quantity').text(),
                        'issued_quantity': row.find('.selected-quantity').val(),
                        'lot_data': row.find('.lot-data-script').text() ? JSON.parse(row.find('.lot-data-script').text()) : [],
                        'sn_data': row.find('.sn-data-script').text() ? JSON.parse(row.find('.sn-data-script').text()) : []
                    })
                })
            }
        }
        else if (pageElements.gis_type.val() === '3') {
            frm.dataForm['goods_issue_type'] = 3
            frm.dataForm['product_modification_id'] = pageElements.PMEle.attr('data-id')
            pageElements.PMItemTable.find('tbody tr').each(function () {
                let row = $(this);
                detail_data_pm.push({
                    'product_id': row.find('.select-detail').attr('data-prd-id'),
                    'warehouse_id': row.find('.select-detail').attr('data-wh-id'),
                    'uom_id': row.find('.select-detail').attr('data-uom-id'),
                    'before_quantity': 1,
                    'remain_quantity': 1,
                    'issued_quantity': 1,
                    'lot_data': row.find('.lot-data-script').text() ? JSON.parse(row.find('.lot-data-script').text()) : [],
                    'sn_data': row.find('.sn-data-script').text() ? JSON.parse(row.find('.sn-data-script').text()) : []
                })
            })
        }

        frm.dataForm['note'] = $('#note').val()
        frm.dataForm['detail_data_ia'] = detail_data_ia;
        frm.dataForm['detail_data_po'] = detail_data_po;
        frm.dataForm['detail_data_wo'] = detail_data_wo;
        frm.dataForm['detail_data_pm'] = detail_data_pm;

        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        // console.log(frm)
        return frm
    }
    static LoadDetailGIS(option) {
        let url_loaded = $('#frmDetail').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['goods_issue_detail'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    // console.log(data)

                    pageVariables.IS_DETAIL_PAGE = option === 'detail'
                    pageVariables.IS_DONE_GIS = data?.['system_status'] === 3
                    if (pageVariables.IS_DONE_GIS) {
                        pageElements.done_none.remove()
                        pageElements.done_sn.remove()
                        pageElements.done_lot.remove()
                    }

                    $('input[name="issue-type"]').prop('disabled', true)
                    $('#title').val(data?.['title'])
                    $('#date_created').val(moment(data?.['date_created'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#note').val(data?.['note'])

                    if (data?.['goods_issue_type'] === 0) {
                        pageElements.gis_type.val(0)
                        pageElements.IAEle.val(data?.['inventory_adjustment']?.['title'])
                        pageElements.IAEle.attr('data-id', data?.['inventory_adjustment']?.['id'])
                        $('#ia-select-space').prop('hidden', false)
                        GISPageFunction.DrawTableIAItems(data?.['detail_data_ia'])
                        pageElements.IAItemTableDiv.prop('hidden', false)
                        pageElements.POItemTableDiv.prop('hidden', true)
                        pageElements.PMItemTableDiv.prop('hidden', true)
                        pageElements.FAItemTableDiv.prop('hidden', true)
                    }
                    else if (data?.['goods_issue_type'] === 1) {
                    }
                    else if (data?.['goods_issue_type'] === 2) {
                        pageElements.gis_type.val(2)
                        if (Object.keys(data?.['production_order']).length > 0) {
                            pageElements.POWOEle.val(data?.['production_order']?.['title'])
                            pageElements.POWOEle.attr('data-id', data?.['production_order']?.['id'])
                            pageElements.POWOEle.attr('data-type', 0)
                            GISPageFunction.DrawTablePOItems(data?.['detail_data_po'], option)
                        }
                        else {
                            pageElements.POWOEle.val(data?.['work_order']?.['title'])
                            pageElements.POWOEle.attr('data-id', data?.['work_order']?.['id'])
                            pageElements.POWOEle.attr('data-type', 1)
                            GISPageFunction.DrawTablePOItems(data?.['detail_data_wo'], option)
                        }
                        $('#ia-select-space').prop('hidden', true)
                        $('#powo-select-space').prop('hidden', false)
                        $('#pm-select-space').prop('hidden', true)
                        pageElements.IAItemTableDiv.prop('hidden', true)
                        pageElements.POItemTableDiv.prop('hidden', false)
                        pageElements.PMItemTableDiv.prop('hidden', true)
                        pageElements.FAItemTableDiv.prop('hidden', true)
                    }
                    else if (data?.['goods_issue_type'] === 3) {
                        pageElements.gis_type.val(3)
                        $('#ia-select-space').prop('hidden', true)
                        $('#powo-select-space').prop('hidden', true)
                        $('#pm-select-space').prop('hidden', false)

                        pageElements.PMEle.attr('data-id', data?.['product_modification']?.['id'])
                        pageElements.PMEle.val(data?.['product_modification']?.['title'])

                        const merged = {}
                        for (const item of (data?.['detail_data_pm'] || [])) {
                            const warehouseId = item?.['warehouse_mapped']?.['id'];
                            const productId = item?.['product_mapped']?.['id'];
                            const key = `${warehouseId}_${productId}`;

                            if (!merged[key]) {
                                merged[key] = JSON.parse(JSON.stringify(item));
                            } else {
                                const mergedItem = merged[key];
                                mergedItem.sum_quantity += item.sum_quantity;
                                mergedItem.before_quantity += item.before_quantity;
                                mergedItem.remain_quantity += item.remain_quantity;
                                mergedItem.issued_quantity += item.issued_quantity;

                                mergedItem.lot_data = mergedItem.lot_data.concat(item.lot_data);
                                mergedItem.sn_data = mergedItem.sn_data.concat(item.sn_data);
                            }
                        }

                        const result = Object.values(merged);

                        GISPageFunction.DrawTablePMItems(result)
                        pageElements.IAItemTableDiv.prop('hidden', true)
                        pageElements.POItemTableDiv.prop('hidden', true)
                        pageElements.PMItemTableDiv.prop('hidden', false)
                        pageElements.FAItemTableDiv.prop('hidden', true)
                    }
                    else if (data?.['goods_issue_type'] === 4) {
                        pageElements.gis_type.val(4)
                        $('#ia-select-space').prop('hidden', true)
                        $('#powo-select-space').prop('hidden', true)
                        $('#pm-select-space').prop('hidden', true)
                        $('#fa-select-space').prop('hidden', false)

                        pageElements.FAEle.attr('data-id', data?.['fixed_asset']?.['id'])
                        pageElements.FAEle.val(data?.['fixed_asset']?.['title'])

                        const merged = {}
                        for (const item of (data?.['detail_data_fa'] || [])) {
                            const warehouseId = item?.['warehouse_mapped']?.['id'];
                            const productId = item?.['product_mapped']?.['id'];
                            const key = `${warehouseId}_${productId}`;

                            if (!merged[key]) {
                                merged[key] = JSON.parse(JSON.stringify(item));
                            } else {
                                const mergedItem = merged[key];
                                mergedItem.sum_quantity += item.sum_quantity;
                                mergedItem.before_quantity += item.before_quantity;
                                mergedItem.remain_quantity += item.remain_quantity;
                                mergedItem.issued_quantity += item.issued_quantity;

                                mergedItem.lot_data = mergedItem.lot_data.concat(item.lot_data);
                                mergedItem.sn_data = mergedItem.sn_data.concat(item.sn_data);
                            }
                        }

                        const result = Object.values(merged);

                        GISPageFunction.DrawTableFAItems(result)
                        pageElements.IAItemTableDiv.prop('hidden', true)
                        pageElements.POItemTableDiv.prop('hidden', true)
                        pageElements.PMItemTableDiv.prop('hidden', true)
                        pageElements.FAItemTableDiv.prop('hidden', false)
                    }

                    new $x.cls.file($('#attachment')).init({
                        enable_download: option === 'detail',
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    UsualLoadPageFunction.DisablePage(option==='detail', ['.select-detail'])
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class GISEventHandler {
    static InitPageEven() {
        pageElements.gis_type.on('change', function () {
            if ($(this).val() === '0') {
                GISPageFunction.LoadIA()
                GISPageFunction.DrawTableIAItems()
                $('#ia-select-space').prop('hidden', false)
                $('#powo-select-space').prop('hidden', true)
                $('#pm-select-space').prop('hidden', true)
                pageElements.IAItemTableDiv.prop('hidden', false)
                pageElements.POItemTableDiv.prop('hidden', true)
                pageElements.PMItemTableDiv.prop('hidden', true)
            }
            else if ($(this).val() === '2') {
                GISPageFunction.LoadPOWO()
                GISPageFunction.DrawTablePOItems()
                $('#ia-select-space').prop('hidden', true)
                $('#powo-select-space').prop('hidden', false)
                $('#pm-select-space').prop('hidden', true)
                pageElements.IAItemTableDiv.prop('hidden', true)
                pageElements.POItemTableDiv.prop('hidden', false)
                pageElements.PMItemTableDiv.prop('hidden', true)
            }
            else if ($(this).val() === '3') {
                GISPageFunction.LoadPM()
                GISPageFunction.DrawTablePMItems()
                $('#ia-select-space').prop('hidden', true)
                $('#powo-select-space').prop('hidden', true)
                $('#pm-select-space').prop('hidden', false)
                pageElements.IAItemTableDiv.prop('hidden', true)
                pageElements.POItemTableDiv.prop('hidden', true)
                pageElements.PMItemTableDiv.prop('hidden', false)
            }
        })
        $(document).on("click", '.select-detail', function () {
            if ($(this).attr('data-prd-id') && $(this).attr('data-wh-id')) {
                pageVariables.current_detail_row_btn = $(this)
                if ($(this).attr('data-prd-type') === '0') {
                    let dataParam = {
                        'product_id': $(this).attr('data-prd-id'),
                        'warehouse_id': $(this).attr('data-wh-id')
                    }
                    let prd_wh = $.fn.callAjax2({
                        url: pageElements.NONETable.attr('data-url-prd-wh'),
                        data: dataParam,
                        method: 'GET'
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_products_list')) {
                                return data?.['warehouse_products_list'];
                            }
                            return {};
                        },
                        (errs) => {
                            console.log(errs);
                        }
                    )

                    Promise.all([prd_wh]).then(
                        (results) => {
                            pageElements.LOTTable.DataTable().clear().destroy()
                            pageElements.SNTable.DataTable().clear().destroy()
                            pageElements.NONETable.prop('hidden', false)
                            pageElements.SNTable.prop('hidden', true)
                            pageElements.SNTableNotify.prop('hidden', true)
                            pageElements.LOTTable.prop('hidden', true)
                            pageElements.done_none.prop('hidden', false)
                            pageElements.done_sn.prop('hidden', true)
                            pageElements.done_lot.prop('hidden', true)
                            pageElements.stock_quantity.val(results[0].length ? results[0][0]?.['stock_amount'] : 0)
                            pageElements.issue_quantity.val($(this).closest('tr').find('.selected-quantity').val())
                        })
                }
                else if ($(this).attr('data-prd-type') === '1') {
                    let flag = true
                    let dataParam = {}
                    if (pageVariables.IS_DONE_GIS) {
                        let detail_string_list = $(this).closest('td').find('.lot-data-script').text() ? JSON.parse($(this).closest('td').find('.lot-data-script').text()) : []
                        if (detail_string_list.length === 0) {
                            flag = false
                        } else {
                            let detail_string_list_id = []
                            for (let i = 0; i < detail_string_list.length; i++) {
                                detail_string_list_id.push(detail_string_list[i]?.['lot_id'])
                            }
                            dataParam['detail_list'] = JSON.stringify(detail_string_list_id).slice(1, -1).replaceAll('"', '')
                        }
                    } else {
                        dataParam['product_warehouse__product_id'] = $(this).attr('data-prd-id')
                        dataParam['product_warehouse__warehouse_id'] = $(this).attr('data-wh-id')
                    }

                    if (flag) {
                        let prd_wh_lot = $.fn.callAjax2({
                            url: pageElements.LOTTable.attr('data-lot-url'),
                            data: dataParam,
                            method: 'GET'
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_lot_list')) {
                                    return data?.['warehouse_lot_list'];
                                }
                                return {};
                            },
                            (errs) => {
                                console.log(errs);
                            }
                        )

                        Promise.all([prd_wh_lot]).then(
                            (results) => {
                                pageElements.NONETable.prop('hidden', true)
                                pageElements.SNTable.prop('hidden', true)
                                pageElements.SNTableNotify.prop('hidden', true)
                                pageElements.LOTTable.prop('hidden', false)
                                pageElements.done_none.prop('hidden', true)
                                pageElements.done_sn.prop('hidden', true)
                                pageElements.done_lot.prop('hidden', false)
                                $('#amount-balance-lot').text(pageVariables.current_detail_row_btn.closest('tr').find('.remain-quantity').text() + ' ' + $(this).attr('data-uom-title')).attr('data-value', $(this).attr('data-remain-quantity'))
                                pageElements.SNTable.DataTable().clear().destroy()
                                let filter_lot = []
                                for (let i = 0; i < results[0].length; i++) {
                                    if (results[0][i]?.['quantity_import'] > 0) {
                                        filter_lot.push(results[0][i])
                                    }
                                }
                                let selected_list = pageVariables.current_detail_row_btn.closest('tr').find('.lot-data-script').text() ? JSON.parse(pageVariables.current_detail_row_btn.closest('tr').find('.lot-data-script').text()) : []
                                GISPageFunction.DrawTableItemsLOT(filter_lot, selected_list)
                            })
                    }
                }
                else if ($(this).attr('data-prd-type') === '2') {
                    let flag = true
                    let dataParam = {}
                    if (pageVariables.IS_DONE_GIS) {
                        let detail_string_list = $(this).closest('td').find('.sn-data-script').text() ? JSON.parse($(this).closest('td').find('.sn-data-script').text()) : []
                        if (detail_string_list.length === 0) {
                            flag = false
                        }
                        dataParam['detail_list'] = JSON.stringify(detail_string_list).slice(1, -1).replaceAll('"', '')
                    } else {
                        dataParam['product_warehouse__product_id'] = $(this).attr('data-prd-id')
                        dataParam['product_warehouse__warehouse_id'] = $(this).attr('data-wh-id')
                        dataParam['is_delete'] = false
                    }

                    if (flag) {
                        let prd_wh_serial = $.fn.callAjax2({
                            url: pageElements.SNTable.attr('data-sn-url'),
                            data: dataParam,
                            method: 'GET'
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_serial_list')) {
                                    return data?.['warehouse_serial_list'];
                                }
                                return {};
                            },
                            (errs) => {
                                console.log(errs);
                            }
                        )

                        Promise.all([prd_wh_serial]).then(
                            (results) => {
                                pageElements.NONETable.prop('hidden', true)
                                pageElements.SNTable.prop('hidden', false)
                                pageElements.SNTableNotify.prop('hidden', false)
                                pageElements.LOTTable.prop('hidden', true)
                                pageElements.done_none.prop('hidden', true)
                                pageElements.done_sn.prop('hidden', false)
                                pageElements.done_lot.prop('hidden', true)
                                $('#amount-balance-sn').text(pageVariables.current_detail_row_btn.closest('tr').find('.remain-quantity').text() + ' ' + $(this).attr('data-uom-title')).attr('data-value', $(this).attr('data-remain-quantity'))
                                pageElements.LOTTable.DataTable().clear().destroy()
                                let selected_list = pageVariables.current_detail_row_btn.closest('tr').find('.sn-data-script').text() ? JSON.parse(pageVariables.current_detail_row_btn.closest('tr').find('.sn-data-script').text()) : []
                                GISPageFunction.DrawTableItemsSN(results[0], selected_list)
                            })
                    }
                }
            }
            else {
                if (!$(this).attr('data-prd-id')) {
                    $.fn.notifyB({description: "Product is required."}, 'warning')
                }
                if (!$(this).attr('data-wh-id')) {
                    $.fn.notifyB({description: "Warehouse is required."}, 'warning')
                }
            }
        })
        $(document).on("change", '.root-prd-wh-select', function () {
            $(this).closest('tr').find('.select-detail').attr('data-wh-id', $(this).val())
        })
        pageElements.issue_quantity.on('change', function () {
            if (!pageElements.gis_type.val() === '2') {
                const limit = parseFloat(pageVariables.current_detail_row_btn.closest('tr').find('.remain-quantity').text())
                let selected = parseFloat($(this).val())
                if (selected > limit) {
                    $.fn.notifyB({description: "Issue quantity is invalid."}, 'warning')
                    $(this).val(0)
                }
            }
        })
        $(document).on("change", '.sn-checkbox', function () {
            if (pageElements.gis_type.val() !== '2') {
                const limit = parseFloat($('#amount-balance-sn').attr('data-value'))
                let selected = $('.sn-checkbox:checked').length
                $('#amount-selected-sn').text(selected)
                if (selected >= limit) {
                    $('.sn-checkbox').prop('disabled', true)
                    $('.sn-checkbox:checked').prop('disabled', pageVariables.IS_DETAIL_PAGE)
                } else {
                    $('.sn-checkbox').prop('disabled', pageVariables.IS_DETAIL_PAGE)
                }
            }
        })
        $(document).on("change", '.lot-input', function () {
            if (pageElements.gis_type.val() !== '2') {
                let old_value = parseInt($(this).val())
                const limit = parseFloat($('#amount-balance-lot').attr('data-value'))
                let selected = 0
                $('.lot-input').each(function () {
                    selected += $(this).val() ? parseFloat($(this).val()) : 0
                })
                $('#amount-selected-lot').text(selected)
                if (selected > limit) {
                    $.fn.notifyB({description: "Issue quantity is invalid."}, 'warning')
                    $(this).val(0)
                    $('#amount-selected-lot').text(selected - old_value)
                }
            }
        })
        pageElements.done_none.on('click', function () {
            let issue_quantity = parseFloat(pageElements.issue_quantity.val())
            let stock_quantity = parseFloat(pageElements.stock_quantity.val())
            let limit_quantity = parseFloat(pageVariables.current_detail_row_btn.closest('tr').find('.remain-quantity').text())
            if (pageElements.gis_type.val() !== '2') {
                if (issue_quantity <= stock_quantity && issue_quantity <= limit_quantity) {
                    pageVariables.current_detail_row_btn.closest('tr').find('.selected-quantity').val(issue_quantity)
                    pageElements.detail_modal.modal('hide')
                } else {
                    $.fn.notifyB({description: 'Issue quantity value is not valid.'}, 'failure')
                }
            }
            else {
                pageVariables.current_detail_row_btn.closest('tr').find('.selected-quantity').val(issue_quantity)
                pageElements.detail_modal.modal('hide')
            }
        })
        pageElements.done_sn.on('click', function () {
            let issue_quantity = $('.sn-checkbox:checked').length
            let remain_quantity = parseFloat(pageVariables.current_detail_row_btn.closest('tr').find('.remain-quantity').text())
            if (pageElements.gis_type.val() !== '2') {
                if (issue_quantity <= remain_quantity) {
                    pageVariables.current_detail_row_btn.closest('tr').find('.selected-quantity').val(issue_quantity)
                    let sn_data = []
                    $('.sn-checkbox:checked').each(function () {
                        sn_data.push($(this).attr('data-sn-id'))
                    })
                    pageVariables.current_detail_row_btn.closest('tr').find('.sn-data-script').text(JSON.stringify(sn_data))
                    pageElements.detail_modal.modal('hide')
                } else {
                    $.fn.notifyB({description: 'Issue quantity value is not valid.'}, 'failure')
                }
            }
            else {
                pageVariables.current_detail_row_btn.closest('tr').find('.selected-quantity').val(issue_quantity)
                let sn_data = []
                $('.sn-checkbox:checked').each(function () {
                    sn_data.push($(this).attr('data-sn-id'))
                })
                pageVariables.current_detail_row_btn.closest('tr').find('.sn-data-script').text(JSON.stringify(sn_data))
                pageElements.detail_modal.modal('hide')
            }
        })
        pageElements.done_lot.on('click', function () {
            let issue_quantity = 0
            $('.lot-input').each(function () {
                issue_quantity += $(this).val() ? parseFloat($(this).val()) : 0
            })
            let remain_quantity = parseFloat(pageVariables.current_detail_row_btn.closest('tr').find('.remain-quantity').text())
            if (pageElements.gis_type.val() !== '2') {
                if (issue_quantity <= remain_quantity) {
                    pageVariables.current_detail_row_btn.closest('tr').find('.selected-quantity').val(issue_quantity)
                    let lot_data = []
                    $('.lot-input').each(function () {
                        let quantity = $(this).val() ? parseFloat($(this).val()) : 0
                        let old_quantity = $(this).closest('tr').find('.limit-quantity').text() ? parseFloat($(this).closest('tr').find('.limit-quantity').text()) : 0
                        if (quantity > 0) {
                            lot_data.push({
                                'lot_id': $(this).attr('data-lot-id'),
                                'old_quantity': old_quantity,
                                'quantity': quantity
                            })
                        }
                    })
                    pageVariables.current_detail_row_btn.closest('tr').find('.lot-data-script').text(JSON.stringify(lot_data))
                    pageElements.detail_modal.modal('hide')
                }
                else {
                    $.fn.notifyB({description: 'Issue quantity value is not valid.'}, 'failure')
                }
            }
            else {
                pageVariables.current_detail_row_btn.closest('tr').find('.selected-quantity').val(issue_quantity)
                let lot_data = []
                $('.lot-input').each(function () {
                    let quantity = $(this).val() ? parseFloat($(this).val()) : 0
                    let old_quantity = $(this).closest('tr').find('.limit-quantity').text() ? parseFloat($(this).closest('tr').find('.limit-quantity').text()) : 0
                    if (quantity > 0) {
                        lot_data.push({
                            'lot_id': $(this).attr('data-lot-id'),
                            'old_quantity': old_quantity,
                            'quantity': quantity
                        })
                    }
                })
                pageVariables.current_detail_row_btn.closest('tr').find('.lot-data-script').text(JSON.stringify(lot_data))
                pageElements.detail_modal.modal('hide')
            }
        })
        pageElements.btn_select_ia.on('click', function () {
            GISPageFunction.LoadIA()
        })
        pageElements.btn_select_powo.on('click', function () {
            let po_dataParam = {}
            let po_list_ajax = $.fn.callAjax2({
                url: pageElements.powo_table.attr('data-url-po'),
                data: po_dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('production_order_list')) {
                        return data?.['production_order_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let wo_dataParam = {}
            let wo_list_ajax = $.fn.callAjax2({
                url: pageElements.powo_table.attr('data-url-wo'),
                data: wo_dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('work_order_list')) {
                        return data?.['work_order_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([po_list_ajax, wo_list_ajax]).then(
                (results) => {
                    GISPageFunction.LoadPOWO(results[0].concat(results[1]))
                })
        })
        pageElements.btn_accept_select_ia.on('click', function () {
            pageElements.ia_table.find('tbody tr').each(function () {
                if ($(this).find('.ia-selected').prop('checked')) {
                    pageElements.IAEle.val($(this).find('.ia-title').text())
                    pageElements.IAEle.attr('data-id', $(this).find('.ia-title').attr('data-id'))
                    let dataParam = {}
                    let ia_list_ajax = $.fn.callAjax2({
                        url: `${pageElements.script_url.attr('data-url-ia').replace('/0', `/${pageElements.IAEle.attr('data-id')}`)}`,
                        data: dataParam,
                        method: 'GET'
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && typeof data === 'object' && data.hasOwnProperty('inventory_adjustment_detail')) {
                                return data?.['inventory_adjustment_detail'];
                            }
                            return {};
                        },
                        (errs) => {
                            console.log(errs);
                        }
                    )

                    Promise.all([ia_list_ajax]).then(
                        (results) => {
                            GISPageFunction.DrawTableIAItems(results[0]?.['ia_data'])
                            pageElements.select_ia_modal.modal('hide')
                        })
                }
            })
        })
        pageElements.btn_accept_select_powo.on('click', function () {
            pageElements.powo_table.find('tbody tr').each(function () {
                if ($(this).find('.powo-selected').prop('checked')) {
                    pageElements.POWOEle.val($(this).find('.powo-title').text())
                    pageElements.POWOEle.attr('data-id', $(this).find('.powo-title').attr('data-id'))
                    pageElements.POWOEle.attr('data-type', $(this).find('.powo-title').attr('data-type'))

                    let type = $(this).find('.powo-title').attr('data-type')
                    if (type === '0') {
                        let dataParam = {}
                        let po_detail_ajax = $.fn.callAjax2({
                            url: `${pageElements.script_url.attr('data-url-po').replace('/0', `/${pageElements.POWOEle.attr('data-id')}`)}`,
                            data: dataParam,
                            method: 'GET'
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && typeof data === 'object' && data.hasOwnProperty('production_order_detail')) {
                                    return data?.['production_order_detail'];
                                }
                                return {};
                            },
                            (errs) => {
                                console.log(errs);
                            }
                        )

                        Promise.all([po_detail_ajax]).then(
                            (results) => {
                                GISPageFunction.DrawTablePOItems(results[0]?.['task_data'])
                                pageElements.select_powo_modal.modal('hide')
                            })
                    }
                    else {
                        let dataParam = {}
                        let wo_detail_ajax = $.fn.callAjax2({
                            url: `${pageElements.script_url.attr('data-url-wo').replace('/0', `/${pageElements.POWOEle.attr('data-id')}`)}`,
                            data: dataParam,
                            method: 'GET'
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && typeof data === 'object' && data.hasOwnProperty('work_order_detail')) {
                                    return data?.['work_order_detail'];
                                }
                                return {};
                            },
                            (errs) => {
                                console.log(errs);
                            }
                        )

                        Promise.all([wo_detail_ajax]).then(
                            (results) => {
                                GISPageFunction.DrawTablePOItems(results[0]?.['task_data'])
                                pageElements.select_powo_modal.modal('hide')
                            })
                    }
                }
            })
        })
        pageElements.btn_accept_select_pm.on('click', function () {
            pageElements.pm_table.find('tbody tr').each(function () {
                if ($(this).find('.pm-selected').prop('checked')) {
                    pageElements.PMEle.val($(this).find('.pm-title').text())
                    pageElements.PMEle.attr('data-id', $(this).find('.pm-title').attr('data-id'))

                    let dataParam = {}
                    let pm_detail_ajax = $.fn.callAjax2({
                        url: `${pageElements.script_url.attr('data-url-pm').replace('/0', `/${pageElements.PMEle.attr('data-id')}`)}`,
                        data: dataParam,
                        method: 'GET'
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && typeof data === 'object' && data.hasOwnProperty('product_modification_detail')) {
                                return data?.['product_modification_detail'];
                            }
                            return {};
                        },
                        (errs) => {
                            console.log(errs);
                        }
                    )

                    Promise.all([pm_detail_ajax]).then(
                        (results) => {
                            console.log(results);
                            GISPageFunction.DrawTablePMItems([results[0]?.['representative_product_modified']], true)
                            pageElements.select_pm_modal.modal('hide')
                        })
                }
            })
        })
        $('#get-all').on('click', function () {
            if ($(this).attr('data-get') === '') {
                $('.sn-checkbox').prop('checked', true)
                $(this).attr('data-get', '1')
                $('#amount-selected-sn').text($('.sn-checkbox').length)
            }
            else {
                $('.sn-checkbox').prop('checked', false)
                $(this).attr('data-get', '')
                $('#amount-selected-sn').text(0)
            }
        })
    }
}
