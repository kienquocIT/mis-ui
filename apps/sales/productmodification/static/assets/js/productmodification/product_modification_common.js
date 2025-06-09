/**
 * Khai báo các element trong page
 */
class ProductModificationPageElements {
    constructor() {
        // info
        this.$script_url = $('#script-url')
        this.$trans_url = $('#trans-url')
        this.$title = $('#title')
        this.$created_date = $('#created-date')
        // modal
        this.$btn_open_modal_product = $('#btn-open-modal-product')
        this.$btn_modal_picking_product = $('#btn-modal-picking-product')
        this.$select_product_modified_modal = $('#select-product-modified-modal')
        this.$table_select_product_modified = $('#table-select-product-modified')
        this.$accept_product_modified_btn = $('#accept-product-modified-btn')
        this.$picking_product_modal = $('#picking-product-modal')
        this.$table_select_warehouse = $('#table-select-warehouse')
        this.$table_select_lot = $('#table-select-lot')
        this.$table_select_serial = $('#table-select-serial')
        this.$accept_picking_product_btn = $('#accept-picking-product-btn')
        // space
        this.$table_current_product_modified = $('#table-current-product-modified')
        this.$confirm_initial_components_modal = $('#confirm-initial-components-modal')
        this.$confirm_initial_components_table = $('#confirm-initial-components-table')
        this.$confirm_initial_components_btn = $('#confirm-initial-components-btn')
        this.$table_product_current_component = $('#table-product-current-component')
        this.$insert_component_btn = $('#insert-component-btn')
        this.$table_select_component_inserted = $('#table-select-component-inserted')
        this.$table_product_removed_component = $('#table-product-removed-component')
        this.$table_select_component_warehouse = $('#table-select-component-warehouse')
        this.$table_select_component_lot = $('#table-select-component-lot')
        this.$table_select_component_serial = $('#table-select-component-serial')
    }
}
const pageElements = new ProductModificationPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class ProductModificationPageVariables {
    constructor() {
        this.current_product_modified = {}
        this.init_component = []
        this.component_inserted_id_list = new Set()
        this.current_component = {}
        this.current_component_row = null
    }
}
const pageVariables = new ProductModificationPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class ProductModificationPageFunction {
    static LoadTableCurrentProductModified(data_list=[], warehouse_code='', serial_number='', lot_number='') {
        pageElements.$table_current_product_modified.DataTable().clear().destroy()
        pageElements.$table_current_product_modified.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            data: data_list,
            columns: [
                {
                    className: 'text-center w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-65',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-primary">${row?.['code'] || ''}</span><br><span class="fw-bold text-primary">${row?.['title'] || ''}</span><br><span class="small">${row?.['description'] || ''}</span>`
                    }
                },
                {
                    className: 'text-right w-30',
                    render: (data, type, row) => {
                        return `<span class="prd-modified-text-detail"></span>`;
                    }
                },
            ],
            initComplete: function () {
                if (warehouse_code) {
                    if (lot_number) {
                        pageElements.$table_current_product_modified.find('tbody tr .prd-modified-text-detail').html(`<span class="badge badge-sm badge-blue">${warehouse_code}</span><br><span>Lot: ${lot_number}</span>`)
                    }
                    else if (serial_number) {
                        pageElements.$table_current_product_modified.find('tbody tr .prd-modified-text-detail').html(`<span class="badge badge-sm badge-blue">${warehouse_code}</span><br><span>Serial: ${serial_number}</span>`)
                    }
                    else {
                        pageElements.$table_current_product_modified.find('tbody tr .prd-modified-text-detail').html(`<span class="badge badge-sm badge-blue">${warehouse_code}</span>`)
                    }
                }
            }
        });
    }
    static LoadTableProductModified() {
        pageElements.$table_select_product_modified.DataTable().clear().destroy()
        pageElements.$table_select_product_modified.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '60vh',
            scrollCollapse: true,
            reloadCurrency: true,
            ajax: {
                url: pageElements.$table_select_product_modified.attr('data-product-modified-list-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['product_modified_list'] ? resp.data['product_modified_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'text-center w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                            <input type="radio"
                            name="product-modified-select"
                            class="form-check-input product-modified-select"
                            data-product-id="${row?.['id']}"
                            data-product-code="${row?.['code']}"
                            data-product-title="${row?.['title']}"
                            data-product-description="${row?.['description'] || ''}"
                            data-product-general-traceability-method="${row?.['general_traceability_method']}"
                            >
                        </div>`;
                    }
                },
                {
                    className: 'w-90',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-primary">${row?.['code']}</span><br><span class="fw-bold text-primary">${row?.['title']}</span><br><span class="small">${row?.['description'] || ''}</span>`
                    }
                }
            ]
        });
    }
    static LoadTableWarehouseByProduct(url='') {
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
                                   data-warehouse-id="${row?.['warehouse_data']?.['id'] || ''}"
                                   data-warehouse-code="${row?.['warehouse_data']?.['code'] || ''}"
                                   data-warehouse-title="${row?.['warehouse_data']?.['title'] || ''}"
                            >
                        </div>`;
                }
            },
            {
                className: 'w-60',
                render: (data, type, row) => {
                    return `<span class="badge badge-sm badge-blue warehouse-code">${row?.['warehouse_data']?.['code'] || ''}</span>
                            <span>${row?.['warehouse_data']?.['title'] || ''}</span>`
                }
            },
            {
                className: 'text-right w-30',
                render: (data, type, row) => {
                    return `<span>${row?.['stock_amount']}</span></span>`
                }
            }
        ]
        pageElements.$table_select_warehouse.DataTable().clear().destroy()
        if (url) {
            pageElements.$table_select_warehouse.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '15vh',
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
                columns: table_columns_cfg
            });
        }
        else {
            pageElements.$table_select_warehouse.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                scrollX: true,
                scrollY: '15vh',
                scrollCollapse: true,
                reloadCurrency: true,
                data: [],
                columns: table_columns_cfg
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
                                <input type="radio" name="lot-select"
                                       class="form-check-input lot-select"
                                       ${row?.['id'] === pageVariables.current_product_modified?.['lot_id'] ? 'checked' : ''}
                                       data-lot-id="${row?.['id'] || ''}"
                                       data-lot="${row?.['lot_number'] || ''}"
                                >
                            </div>`;
                }
            },
            {
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span class="lot-number">${row?.['lot_number']}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span class="quantity-import">${row?.['quantity_import']}</span>`
                }
            },
            {
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span>${moment(row?.['expire_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`
                }
            },
            {
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span>${moment(row?.['manufacture_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`
                }
            },
        ]
        pageElements.$table_select_lot.DataTable().clear().destroy()
        if (url) {
            pageElements.$table_select_lot.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '25vh',
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
            });
        }
        else {
            pageElements.$table_select_lot.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                scrollX: true,
                scrollY: '25vh',
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
                                <input type="radio" name="serial-select"
                                       class="form-check-input serial-select"
                                       ${row?.['id'] === pageVariables.current_product_modified?.['serial_id'] ? 'checked' : ''}
                                       data-serial-id="${row?.['id'] || ''}"
                                       data-sn="${row?.['serial_number'] || ''}"
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
                    return `<span class="serial-number">${row?.['serial_number']}</span>`
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
                scrollY: '25vh',
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
            });
        }
        else {
            pageElements.$table_select_serial.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                scrollX: true,
                scrollY: '25vh',
                scrollCollapse: true,
                reloadCurrency: true,
                data: [],
                columns: table_columns_cfg
            });
        }
    }
    static LoadTableProductConfirmInitComponentList(data_list=[]) {
        pageElements.$confirm_initial_components_table.DataTable().clear().destroy()
        pageElements.$confirm_initial_components_table.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '60vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'text-center w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-75',
                    render: (data, type, row) => {
                        return `<span class="fw-bold init-component-title" data-component-id="${row?.['component_id'] || ''}">${row?.['component_name'] || ''}</span>
                                <br><span class="small init-component-des">${row?.['component_des'] || ''}</span>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<input class="form-control fs-5 init-component-quantity" type="number" min="1" value="${row?.['component_quantity'] || 0}">`;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-danger delete-init-component-btn">
                                    <span class="icon"><i class="fa-solid fa-trash-can text-danger"></i></span>
                                </button>`;
                    }
                },
            ],
            initComplete: function () {
                pageElements.$table_product_current_component.find('tbody tr').each(function (index, ele) {
                    if (data_list[index]?.['is_added_component']) {
                        $(ele).addClass('bg-success-light-5 is_added_component')
                    }
                })
            }
        });
    }
    static LoadTableProductCurrentComponentList(data_list=[], option='create') {
        pageElements.$table_product_current_component.DataTable().clear().destroy()
        pageElements.$table_product_current_component.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '65vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'text-center w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-60',
                    render: (data, type, row) => {
                        if (row?.['product_id']) {
                            return `<span class="badge badge-sm badge-secondary">${row?.['product_code'] || ''}</span>
                                    <br><span data-row-type="${row?.['type']}" data-product-id="${row?.['product_id'] || ''}" class="fw-bold component-title">${row?.['product_title'] || ''}</span>
                                    <br><span class="small component-des">${row?.['product_des'] || ''}</span>`;
                        }
                        return `<span class="fw-bold component-title" data-component-id="${row?.['component_id'] || ''}">${row?.['component_name'] || ''}</span>
                                <br><span class="small component-des">${row?.['component_des'] || ''}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        if (row?.['product_id']) {
                            let picking_component_btn = `
                                <button type="button"
                                        class="btn btn-outline-secondary btn-modal-picking-component"
                                        data-product-id="${row?.['product_id'] || ''}"
                                        data-product-code="${row?.['product_code'] || ''}"
                                        data-product-title="${row?.['product_title'] || ''}"
                                        data-product-description="${row?.['product_des'] || ''}"
                                        data-product-general-traceability-method="${row?.['general_traceability_method']}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#picking-component-modal">
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                            `;
                            return `
                                <div class="input-group">
                                    <input class="form-control fs-5 component-quantity" disabled readonly type="number" min="1" value="${row?.['product_quantity'] || 0}">
                                    ${picking_component_btn}
                                </div>
                                <script class="data-component-none-detail">${JSON.stringify(row?.['component_product_none_detail'] || [])}</script>
                                <script class="data-component-lot-detail">${JSON.stringify(row?.['component_product_lot_detail'] || [])}</script>
                                <script class="data-component-sn-detail">${JSON.stringify(row?.['component_product_sn_detail'] || [])}</script>
                            `;
                        }
                        return `<input class="form-control fs-5 component-quantity" disabled readonly type="number" min="1" value="${row?.['component_quantity'] || 0}">`;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] !== 'new') {
                            if (row?.['is_added_component']) {
                                return `<button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-danger delete-added-component-btn" ${option === 'detail' ? 'disabled' : ''}>
                                            <span class="icon"><i class="fa-solid fa-trash-can text-danger"></i></span>
                                        </button>`;
                            }
                            let comp = {}
                            if (row?.['product_id']) {
                                comp = {
                                    'id': row?.['product_id'],
                                    'code': row?.['product_code'],
                                    'name': row?.['product_title'],
                                    'des': row?.['product_des'],
                                }
                            }
                            else {
                                comp = {
                                    'id': row?.['component_id'],
                                    'name': row?.['component_name'],
                                    'des': row?.['component_des'],
                                }
                            }
                            return `<button type="button"
                                            ${option === 'detail' ? 'disabled' : ''}
                                            class="btn-icon btn-rounded flush-soft-hover btn btn-flush-danger remove-component-btn"
                                            data-component-id="${comp?.['id'] || ''}"
                                            data-component-code="${comp?.['code'] || ''}"
                                            data-component-name="${comp?.['name'] || ''}"
                                            data-component-des="${comp?.['des'] || ''}">
                                        <span class="icon"><i class="bi bi-arrow-right-circle"></i></span>
                                    </button>`;
                        }
                        return `<button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-danger delete-added-component-btn" ${option === 'detail' ? 'disabled' : ''}>
                                    <span class="icon"><i class="fa-solid fa-trash-can text-danger"></i></span>
                                </button>`;
                    }
                },
            ],
            initComplete: function () {
                pageElements.$table_product_current_component.find('tbody tr').each(function (index, ele) {
                    if (data_list[index]?.['is_added_component']) {
                        $(ele).addClass('bg-success-light-5 is_added_component')
                        $(ele).find('.component-title').attr('data-row-type', 'new')
                        pageVariables.component_inserted_id_list.add($(ele).find('.component-title').attr('data-product-id'))
                    }
                })
            }
        });
    }
    static LoadTableProductRemovedComponentList(data_list=[], option='create') {
        pageElements.$table_product_removed_component.DataTable().clear().destroy()
        pageElements.$table_product_removed_component.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '65vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'text-center w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-70',
                    render: (data, type, row) => {
                        if (row?.['component_code']) {
                            return `<span class="badge badge-sm badge-secondary">${row?.['component_code'] || ''}</span><br><span class="fw-bold component-title" data-component-id="${row?.['component_id']}">${row?.['component_name']}</span><br><span class="small component-des">${row?.['component_des'] || ''}</span>`;
                        }
                        return `<span class="fw-bold component-title" data-component-id="${row?.['component_id']}">${row?.['component_name']}</span><br><span class="small component-des">${row?.['component_des'] || ''}</span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<input class="form-control fs-5 component-quantity" disabled readonly type="number" min="1" value="${row?.['component_quantity'] || 0}">`;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<button type="button"
                                        ${option === 'detail' ? 'disabled' : ''}
                                        class="btn-icon btn-rounded flush-soft-hover btn btn-flush-success return-component-btn"
                                        data-component-id="${row?.['component_id'] || ''}"
                                        data-component-code="${row?.['component_code'] || ''}"
                                        data-component-name="${row?.['component_name'] || ''}"
                                        data-component-des="${row?.['component_des'] || ''}"
                                >
                                    <span class="icon"><i class="bi bi-arrow-left-circle"></i></span>
                                </button>`;
                    }
                },
            ]
        });
    }
    // space
    static LoadTableComponentInserted() {
        pageElements.$table_select_component_inserted.DataTable().clear().destroy()
        pageElements.$table_select_component_inserted.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '65vh',
            scrollCollapse: true,
            reloadCurrency: true,
            ajax: {
                url: pageElements.$table_select_component_inserted.attr('data-component-inserted-list-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['component_inserted_list'] ? resp.data['component_inserted_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'text-center w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                            <input type="checkbox"
                                class="form-check-input component-inserted-select"
                                data-product-id="${row?.['id'] || ''}"
                                data-product-code="${row?.['code'] || ''}"
                                data-product-title="${row?.['title'] || ''}"
                                data-product-description="${row?.['description'] || ''}"
                                data-product-general-traceability-method="${row?.['general_traceability_method']}"
                            >
                        </div>`;
                    }
                },
                {
                    className: 'w-90',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-secondary">${row?.['code']}</span><br><span class="fw-bold">${row?.['title']}</span><br><span class="small">${row?.['description'] || ''}</span>`
                    }
                }
            ]
        }).on('draw', function () {
            $('.component-inserted-select').each(function () {
                const rowId = $(this).attr('data-product-id');
                if (pageVariables.component_inserted_id_list.has(rowId)) {
                    $(this).prop('checked', true);
                }
            });
        });
    }
    static LoadTableComponentWarehouseByProduct(url='', general_traceability_method='') {
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
                            <input type="radio" name="product-warehouse-component-select"
                                   class="form-check-input product-warehouse-component-select"
                                   data-warehouse-id="${row?.['warehouse_data']?.['id'] || ''}"
                            >
                        </div>`;
                }
            },
            {
                className: 'w-60',
                render: (data, type, row) => {
                    return `<span class="badge badge-sm badge-blue">${row?.['warehouse_data']?.['code'] || ''}</span> <span>${row?.['warehouse_data']?.['title'] || ''}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span>${row?.['stock_amount']}</span>`
                }
            },
            {
                className: '',
                render: (data, type, row) => {
                    return `<input disabled readonly type="number" min="0" max="${row?.['stock_amount'] || ''}" class="form-control none-picked-quantity" value="0">`
                }
            }
        ]
        pageElements.$table_select_component_warehouse.DataTable().clear().destroy()
        if (url) {
            pageElements.$table_select_component_warehouse.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '15vh',
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
                    pageElements.$table_select_component_warehouse.DataTable().column(4).visible(general_traceability_method === '0')
                    if (general_traceability_method === '0') {
                        let none_list_raw = pageVariables.current_component_row.find('.data-component-none-detail').text()
                        let none_list = none_list_raw ? JSON.parse(none_list_raw) : []
                        pageElements.$table_select_component_warehouse.find('tbody tr').each(function (index, ele) {
                            let existed = none_list.filter(item => item?.['warehouse_id'] === $(ele).find('.product-warehouse-component-select').attr('data-warehouse-id'))
                            if (existed.length === 1) {
                                $(ele).find('.none-picked-quantity').val(existed[0]?.['picked_quantity'])
                            }
                        })
                    }
                    ProductModificationPageFunction.LoadTableComponentLotListByWarehouse()
                    ProductModificationPageFunction.LoadTableComponentSerialListByWarehouse()
                }
            }).on('draw.dt', function () {
                const component_none_list_raw = pageVariables.current_component_row.find('.data-component-none-detail').text()
                const component_none_list = component_none_list_raw ? JSON.parse(component_none_list_raw) : []

                pageElements.$table_select_component_warehouse.find('tbody tr').each(function () {
                    const matched = component_none_list.find(item => item?.['warehouse_id'] === $(this).find('.product-warehouse-component-select').attr('data-warehouse-id'))
                    if (matched) {
                        $(this).find('.none-picked-quantity').val(matched?.['picked_quantity'] || 0)
                    }
                });
            });
        }
        else {
            pageElements.$table_select_component_warehouse.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                scrollX: true,
                scrollY: '15vh',
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
                    pageElements.$table_select_component_warehouse.DataTable().column(4).visible(general_traceability_method === '0')
                    if (general_traceability_method === '0') {
                        let none_list_raw = pageVariables.current_component_row.find('.data-component-none-detail').text()
                        let none_list = none_list_raw ? JSON.parse(none_list_raw) : []
                        pageElements.$table_select_component_warehouse.find('tbody tr').each(function (index, ele) {
                            let existed = none_list.find(item => item?.['warehouse_id'] === $(ele).find('.product-warehouse-component-select').attr('data-warehouse-id'))
                            if (existed) {
                                $(ele).find('.none-picked-quantity').val(existed?.['picked_quantity'])
                            }
                        })
                    }
                    ProductModificationPageFunction.LoadTableComponentLotListByWarehouse()
                    ProductModificationPageFunction.LoadTableComponentSerialListByWarehouse()
                }
            });
        }
    }
    static LoadTableComponentLotListByWarehouse(url='') {
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
                                       name="lot-component-select"
                                       class="form-check-input lot-component-select"
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
                className: 'w-15',
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

        ]
        pageElements.$table_select_component_lot.DataTable().clear().destroy()
        if (url) {
            pageElements.$table_select_component_lot.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '25vh',
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
                let lot_id_list_raw = pageVariables.current_component_row.find('.data-component-lot-detail').text()
                let lot_id_list = lot_id_list_raw ? JSON.parse(lot_id_list_raw) : []
                pageElements.$table_select_component_lot.find('tbody tr .lot-component-select').each(function () {
                    let lot_id = $(this).attr('data-lot-id')
                    let matched_item = lot_id_list.find(item => item?.['lot_id'] === lot_id)
                    if (matched_item) {
                        $(this).closest('tr').find('.lot-picked-quantity').val(matched_item?.['picked_quantity'] || 0)
                    }
                });
            });
        }
        else {
            pageElements.$table_select_component_lot.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                scrollX: true,
                scrollY: '25vh',
                scrollCollapse: true,
                reloadCurrency: true,
                data: [],
                columns: table_columns_cfg
            });
        }
    }
    static LoadTableComponentSerialListByWarehouse(url='') {
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
                                       class="form-check-input serial-component-select"
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
        pageElements.$table_select_component_serial.DataTable().clear().destroy()
        if (url) {
            pageElements.$table_select_component_serial.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '25vh',
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
                let serial_id_list_raw = pageVariables.current_component_row.find('.data-component-sn-detail').text()
                let serial_id_list = serial_id_list_raw ? JSON.parse(serial_id_list_raw) : []
                pageElements.$table_select_component_serial.find('tbody tr .serial-component-select').each(function () {
                    if (serial_id_list.includes($(this).attr('data-serial-id'))) {
                        $(this).prop('checked', true)
                    }
                })
            });
        }
        else {
            pageElements.$table_select_component_serial.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                scrollX: true,
                scrollY: '25vh',
                scrollCollapse: true,
                reloadCurrency: true,
                data: [],
                columns: table_columns_cfg
            });
        }
    }
    // load detail sub
    static ParseDataCurrentComponent(current_component_data=[]) {
        let parsed_current_component_data = []
        for (let i= 0; i < (current_component_data || []).length; i++) {
            let item = current_component_data[i]
            if (Object.keys(item?.['component_product_data']).length !== 0) {
                let component_product_data = item?.['component_product_data']
                parsed_current_component_data.push({
                    'order': item?.['order'],
                    'product_id': component_product_data?.['id'] || '',
                    'product_code': component_product_data?.['code'] || '',
                    'product_title': component_product_data?.['title'] || '',
                    'product_des': component_product_data?.['description'] || '',
                    'general_traceability_method': component_product_data?.['general_traceability_method'],
                    'component_product_none_detail': item?.['component_product_none_detail'] || [],
                    'component_product_lot_detail': item?.['component_product_lot_detail'] || [],
                    'component_product_sn_detail': item?.['component_product_sn_detail'] || [],
                    'product_quantity': item?.['component_quantity'],
                    'is_added_component': item?.['is_added_component'],
                })
            }
            else {
                let component_text_data = item?.['component_text_data']
                parsed_current_component_data.push({
                    'order': item?.['order'],
                    'component_id': item?.['component_id'] || '',
                    'component_name': component_text_data?.['title'] || '',
                    'component_des': component_text_data?.['description'] || '',
                    'component_quantity': item?.['component_quantity']
                })
            }
        }
        return parsed_current_component_data
    }
    static ParseDataRemovedComponent(removed_component_data=[]) {
        let parsed_removed_component_data = []
        for (let i= 0; i < (removed_component_data || []).length; i++) {
            let item = removed_component_data[i]
            if (Object.keys(item?.['component_product_data']).length !== 0) {
                let component_product_data = item?.['component_product_data']
                parsed_removed_component_data.push({
                    'order': item?.['order'],
                    'product_id': component_product_data?.['id'] || '',
                    'product_code': component_product_data?.['code'] || '',
                    'product_title': component_product_data?.['title'] || '',
                    'product_des': component_product_data?.['description'] || '',
                    'general_traceability_method': component_product_data?.['general_traceability_method'],
                    'product_quantity': item?.['component_quantity']
                })
            }
            else {
                let component_text_data = item?.['component_text_data']
                parsed_removed_component_data.push({
                    'order': item?.['order'],
                    'id': item?.['id'] || '',
                    'component_name': component_text_data?.['title'] || '',
                    'component_des': component_text_data?.['description'] || '',
                    'component_quantity': item?.['component_quantity']
                })
            }
        }
        return parsed_removed_component_data
    }
}

/**
 * Khai báo các hàm chính
 */
class ProductModificationHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['product_modified'] = pageVariables.current_product_modified?.['id']
        frm.dataForm['warehouse_id'] = pageVariables.current_product_modified?.['warehouse_id']
        frm.dataForm['prd_wh_lot'] = pageVariables.current_product_modified?.['lot_id']
        frm.dataForm['prd_wh_serial'] = pageVariables.current_product_modified?.['serial_id']

        let current_component_data = []
        pageElements.$table_product_current_component.find('tbody tr').each(function (index, ele) {
            if ($(this).find('.dataTables_empty').length === 0) {
                current_component_data.push({
                    'component_text_data': {
                        'title': $(ele).find('.component-title').attr('data-product-id') || $(ele).find('.component-title').text(),
                        'description': $(ele).find('.component-des').text(),
                    },
                    'component_product_id': $(ele).find('.component-title').attr('data-product-id') || null,
                    'component_product_none_detail': $(ele).find('.data-component-none-detail').text() ? JSON.parse($(ele).find('.data-component-none-detail').text()) : [],
                    'component_product_lot_detail': $(ele).find('.data-component-lot-detail').text() ? JSON.parse($(ele).find('.data-component-lot-detail').text()) : [],
                    'component_product_sn_detail': $(ele).find('.data-component-sn-detail').text() ? JSON.parse($(ele).find('.data-component-sn-detail').text()) : [],
                    'component_quantity': $(ele).find('.component-quantity').val(),
                    'is_added_component': $(ele).hasClass('is_added_component')
                })
            }
        })
        frm.dataForm['current_component_data'] = current_component_data

        let removed_component_data = []
        pageElements.$table_product_removed_component.find('tbody tr').each(function (index, ele) {
            if ($(this).find('.dataTables_empty').length === 0) {
                removed_component_data.push({
                    'component_text_data': {
                        'title': $(ele).find('.component-title').attr('data-product-id') || $(ele).find('.component-title').text(),
                        'description': $(ele).find('.component-des').text(),
                    },
                    'component_product_id': $(ele).find('.component-title').attr('data-product-id') || null,
                    'component_quantity': $(ele).find('.component-quantity').val()
                })
            }
        })
        frm.dataForm['removed_component_data'] = removed_component_data

        return frm
    }
    static LoadDetailProductModification(option) {
        let url_loaded = $('#form-detail-product-modification').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['product_modification_detail'];

                    // console.log(data)

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    pageElements.$title.val(data?.['title'])
                    pageElements.$created_date.val(data?.['date_created'] ? DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "DD/MM/YYYY", data?.['date_created']) : '')
                    pageVariables.current_product_modified = data?.['prd_wh_data']?.['product']
                    pageVariables.current_product_modified['warehouse_id'] = data?.['prd_wh_data']?.['warehouse']?.['id']
                    pageVariables.current_product_modified['product_id'] = data?.['prd_wh_data']?.['product']?.['id']
                    pageVariables.current_product_modified['serial_id'] = data?.['prd_wh_serial_data']?.['id']
                    pageVariables.current_product_modified['lot_id'] = data?.['prd_wh_lot_data']?.['id']
                    ProductModificationPageFunction.LoadTableCurrentProductModified(
                        [pageVariables.current_product_modified],
                        data?.['prd_wh_data']?.['warehouse']?.['code'],
                        data?.['prd_wh_serial_data']?.['serial_number'],
                        data?.['prd_wh_lot_data']?.['lot_number'],
                    )

                    pageElements.$insert_component_btn.prop('hidden', false)

                    ProductModificationPageFunction.LoadTableProductCurrentComponentList(
                        ProductModificationPageFunction.ParseDataCurrentComponent(
                            data?.['current_component_data'] || []
                        ),
                        option
                    )
                    ProductModificationPageFunction.LoadTableProductRemovedComponentList(
                        ProductModificationPageFunction.ParseDataRemovedComponent(
                            data?.['removed_component_data'] || []
                        ),
                        option
                    )

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
class ProductModificationEventHandler {
    static InitPageEven() {
        // info
        pageElements.$btn_open_modal_product.on('click', function () {
            ProductModificationPageFunction.LoadTableProductModified()
        })
        pageElements.$accept_product_modified_btn.on('click', function () {
            const $checkedEle = pageElements.$table_select_product_modified.find('.product-modified-select:checked').first()
            if ($checkedEle.length > 0) {
                pageVariables.current_product_modified = {
                    'id': $checkedEle.attr('data-product-id'),
                    'code': $checkedEle.attr('data-product-code'),
                    'title': $checkedEle.attr('data-product-title'),
                    'description': $checkedEle.attr('data-product-description'),
                    'general_traceability_method': $checkedEle.attr('data-product-general-traceability-method'),
                }
                ProductModificationPageFunction.LoadTableCurrentProductModified([pageVariables.current_product_modified])
                pageElements.$select_product_modified_modal.modal('hide')
            }
            else {
                $.fn.notifyB({description: 'Nothing is selected'}, 'failure')
            }
        })
        pageElements.$btn_modal_picking_product.on('click', function () {
            pageElements.$table_select_lot.closest('.table-serial-space').prop('hidden', true)
            pageElements.$table_select_serial.closest('.table-lot-space').prop('hidden', true)
            let product_id = pageVariables.current_product_modified?.['id']
            let url = `${pageElements.$script_url.attr('data-url-warehouse-list-by-product')}&product_id=${product_id}`
            ProductModificationPageFunction.LoadTableWarehouseByProduct(url)
            ProductModificationPageFunction.LoadTableLotListByWarehouse()
            ProductModificationPageFunction.LoadTableSerialListByWarehouse()
        })
        $(document).on("change", '.product-warehouse-select', function () {
            pageElements.$table_select_lot.closest('.table-lot-space').prop('hidden', Number(pageVariables.current_product_modified?.['general_traceability_method']) !== 1)
            pageElements.$table_select_serial.closest('.table-serial-space').prop('hidden', Number(pageVariables.current_product_modified?.['general_traceability_method']) !== 2)
            if (Number(pageVariables.current_product_modified?.['general_traceability_method']) === 1) {
                let product_id = pageVariables.current_product_modified?.['id']
                let warehouse_id = $(this).attr('data-warehouse-id')
                let url = `${pageElements.$script_url.attr('data-url-lot-list-by-warehouse')}?product_warehouse__product_id=${product_id}&product_warehouse__warehouse_id=${warehouse_id}`
                ProductModificationPageFunction.LoadTableLotListByWarehouse(url)
            }
            if (Number(pageVariables.current_product_modified?.['general_traceability_method']) === 2) {
                let product_id = pageVariables.current_product_modified?.['id']
                let warehouse_id = $(this).attr('data-warehouse-id')
                let url = `${pageElements.$script_url.attr('data-url-serial-list-by-warehouse')}?product_warehouse__product_id=${product_id}&product_warehouse__warehouse_id=${warehouse_id}`
                ProductModificationPageFunction.LoadTableSerialListByWarehouse(url)
            }
        })
        pageElements.$accept_picking_product_btn.on('click', function () {
            let flag = true
            let warehouse_code = ''
            let serial_number = ''
            let lot_number = ''
            const $checked_prd_wh = pageElements.$table_select_warehouse.find('.product-warehouse-select:checked').first()

            if ($checked_prd_wh.length === 0) {
                $.fn.notifyB({description: 'Warehouse is not selected'}, 'failure')
                flag = false
            }
            else {
                pageVariables.current_product_modified['product_id'] = $checked_prd_wh.attr('data-warehouse-id')
                pageVariables.current_product_modified['warehouse_id'] = $checked_prd_wh.attr('data-warehouse-id')
                warehouse_code = $checked_prd_wh.closest('tr').find('.warehouse-code').text()
            }

            if (pageVariables.current_product_modified?.['general_traceability_method'] === '0') {
                // do nothing
            }

            if (pageVariables.current_product_modified?.['general_traceability_method'] === '1') {
                const $checked_lot = pageElements.$table_select_lot.find('.lot-select:checked').first()

                if ($checked_lot.length === 0) {
                    if (pageElements.$table_select_lot.find('tbody .dataTables_empty').length === 0) {
                        $.fn.notifyB({description: 'Please select one lot'}, 'failure')
                        flag = false
                    }
                } else {
                    pageVariables.current_product_modified['lot_id'] = $checked_lot.attr('data-lot-id')
                    lot_number = $checked_lot.closest('tr').find('.lot-number').text()
                }
            }

            if (pageVariables.current_product_modified?.['general_traceability_method'] === '2') {
                const $checked_serial = pageElements.$table_select_serial.find('.serial-select:checked').first()

                if ($checked_serial.length === 0) {
                    if (pageElements.$table_select_serial.find('tbody .dataTables_empty').length === 0) {
                        $.fn.notifyB({description: 'Please select one serial'}, 'failure')
                        flag = false
                    }
                } else {
                    pageVariables.current_product_modified['serial_id'] = $checked_serial.attr('data-serial-id')
                    serial_number = $checked_serial.closest('tr').find('.serial-number').text()
                }
            }

            if (flag) {
                let product_id = pageVariables.current_product_modified?.['id']
                let product_component_list_ajax = $.fn.callAjax2({
                    url: pageElements.$script_url.attr('data-url-product-component-list'),
                    data: {'id': product_id},
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('product_component_list')) {
                            return data?.['product_component_list'][0];
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )

                Promise.all([product_component_list_ajax]).then(
                    (results) => {
                        pageVariables.init_component = results[0]?.['component_list_data'] || []
                        pageElements.$confirm_initial_components_modal.modal('show')
                        ProductModificationPageFunction.LoadTableProductConfirmInitComponentList(pageVariables.init_component)
                    }
                )

                if (pageVariables.current_product_modified?.['general_traceability_method'] === '0') {
                    pageElements.$table_current_product_modified.find('tbody tr .prd-modified-text-detail').html(`
                        <span class="badge badge-sm badge-blue">${warehouse_code}</span>
                    `)
                }

                if (pageVariables.current_product_modified?.['general_traceability_method'] === '1') {
                    pageElements.$table_current_product_modified.find('tbody tr .prd-modified-text-detail').html(`
                        <span class="badge badge-sm badge-blue">${warehouse_code}</span><br><span>Lot: ${lot_number}</span>
                    `)
                }
                if (pageVariables.current_product_modified?.['general_traceability_method'] === '2') {
                    pageElements.$table_current_product_modified.find('tbody tr .prd-modified-text-detail').html(`
                        <span class="badge badge-sm badge-blue">${warehouse_code}</span><br><span>Serial: ${serial_number}</span>
                    `)
                }
                pageElements.$picking_product_modal.modal('hide')
                pageElements.$insert_component_btn.prop('hidden', false)
            }
        })
        $(document).on('click', '.delete-init-component-btn', function () {
            let rowId = $(this).closest('tr').find('.init-component-title').attr('data-component-id')
            pageVariables.init_component = pageVariables.init_component.filter(item => item?.['component_id'] !== rowId)
            UsualLoadPageFunction.DeleteTableRow(
                pageElements.$confirm_initial_components_table,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
        })
        $(document).on('change', '.init-component-quantity', function () {
            let rowId = $(this).closest('tr').find('.init-component-title').attr('data-component-id');
            let quantity = $(this).val() || 0;

            pageVariables.init_component.forEach(item => {
                if (item?.['component_id'] === rowId) {
                    item['component_quantity'] = Number(quantity);
                }
            });
        })
        pageElements.$confirm_initial_components_btn.on('click', function () {
            pageVariables.component_inserted_id_list = new Set()
            ProductModificationPageFunction.LoadTableProductCurrentComponentList(pageVariables.init_component)
            ProductModificationPageFunction.LoadTableProductRemovedComponentList()
        })
        // space
        pageElements.$insert_component_btn.on('click', function () {
            ProductModificationPageFunction.LoadTableComponentInserted()
        })
        $(document).on('change', '.component-inserted-select', function () {
            const rowId = $(this).attr('data-product-id')
            if ($(this).prop('checked')) {
                pageVariables.component_inserted_id_list.add(rowId)
                UsualLoadPageFunction.AddTableRow(
                    pageElements.$table_product_current_component,
                    {
                        'type': 'new',
                        'product_id': $(this).attr('data-product-id'),
                        'product_code': $(this).attr('data-product-code'),
                        'product_title': $(this).attr('data-product-title'),
                        'product_des': $(this).attr('data-product-description'),
                        'general_traceability_method': $(this).attr('data-product-general-traceability-method'),
                        'product_quantity': 0
                    }
                )
                let row_added = pageElements.$table_product_current_component.find('tbody tr:last-child')
                row_added.find('.component-quantity').focus()
                row_added.addClass('bg-success-light-5 is_added_component')
            } else {
                pageVariables.component_inserted_id_list.delete(rowId)
                pageElements.$table_product_current_component.find('tbody tr').each(function (index, ele) {
                    if ($(ele).find('.component-title').attr('data-row-type') === 'new' && $(ele).find('.component-title').attr('data-product-id') === rowId) {
                        UsualLoadPageFunction.DeleteTableRow(
                            pageElements.$table_product_current_component,
                            parseInt($(ele).find('td:first-child').text())
                        )
                    }
                })
            }
            // scroll về cuối bảng
            const container = $('#table-product-current-component_wrapper .dataTables_scrollBody')[0]
            container.scrollTop = container.scrollHeight
        })
        $(document).on('click', '.delete-added-component-btn', function () {
            let rowId = $(this).closest('tr').find('.component-title').attr('data-product-id')
            pageVariables.component_inserted_id_list.delete(rowId)
            UsualLoadPageFunction.DeleteTableRow(
                pageElements.$table_product_current_component,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
            pageElements.$table_select_component_inserted.DataTable().draw(false)
            // scroll về cuối bảng
            const container = $('#table-product-current-component_wrapper .dataTables_scrollBody')[0]
            container.scrollTop = container.scrollHeight
        })
        $(document).on('click', '.btn-modal-picking-component', function () {
            pageElements.$table_select_component_lot.closest('.table-lot-space').prop('hidden', true)
            pageElements.$table_select_component_serial.closest('.table-serial-space').prop('hidden', true)
            pageVariables.current_component_row = $(this).closest('tr')
            pageVariables.current_component = {
                'id': $(this).attr('data-product-id'),
                'code': $(this).attr('data-product-code'),
                'title': $(this).attr('data-product-title'),
                'description': $(this).attr('data-product-description'),
                'general_traceability_method': $(this).attr('data-product-general-traceability-method'),
            }
            let product_id = $(this).attr('data-product-id')
            let url = `${pageElements.$script_url.attr('data-url-warehouse-list-by-product')}&product_id=${product_id}`
            ProductModificationPageFunction.LoadTableComponentWarehouseByProduct(url, $(this).attr('data-product-general-traceability-method'))
        })
        $(document).on("change", '.product-warehouse-component-select', function () {
            pageElements.$table_select_component_lot.closest('.table-lot-space').prop('hidden', pageVariables.current_component?.['general_traceability_method'] !== '1')
            pageElements.$table_select_component_serial.closest('.table-serial-space').prop('hidden', pageVariables.current_component?.['general_traceability_method'] !== '2')
            if (pageVariables.current_component?.['general_traceability_method'] === '0') {
                pageElements.$table_select_component_warehouse.find('tr .none-picked-quantity').prop('disabled', true).prop('readonly', true)
                $(this).closest('tr').find('.none-picked-quantity').prop('disabled', false).prop('readonly', false)
            }
            if (pageVariables.current_component?.['general_traceability_method'] === '1') {
                let url = `${pageElements.$script_url.attr('data-url-lot-list-by-warehouse')}?product_warehouse__product_id=${pageVariables.current_component?.['id']}&product_warehouse__warehouse_id=${$(this).attr('data-warehouse-id')}`
                ProductModificationPageFunction.LoadTableComponentLotListByWarehouse(url)
            }
            if (pageVariables.current_component?.['general_traceability_method'] === '2') {
                let url = `${pageElements.$script_url.attr('data-url-serial-list-by-warehouse')}?product_warehouse__product_id=${pageVariables.current_component?.['id']}&product_warehouse__warehouse_id=${$(this).attr('data-warehouse-id')}`
                ProductModificationPageFunction.LoadTableComponentSerialListByWarehouse(url)
            }
        })
        $(document).on("change", '.none-picked-quantity', function () {
            let component_none_list = []

            let sum_picked_quantity = 0
            pageElements.$table_select_component_warehouse.find('tbody tr').each(function (index, ele) {
                component_none_list.push({
                    'warehouse_id': $(ele).find('.product-warehouse-component-select').attr('data-warehouse-id'),
                    'picked_quantity': parseFloat($(ele).find('.none-picked-quantity').val()) || 0
                })
                sum_picked_quantity += parseFloat($(ele).find('.none-picked-quantity').val()) || 0
            })

            pageVariables.current_component_row.find('.data-component-none-detail').text(JSON.stringify(component_none_list))
            pageVariables.current_component_row.find('.component-quantity').val(sum_picked_quantity)
        })
        $(document).on("change", '.lot-component-select', function () {
            pageElements.$table_select_component_lot.find('tr .lot-picked-quantity').prop('disabled', true).prop('readonly', true)
            $(this).closest('tr').find('.lot-picked-quantity').prop('disabled', false).prop('readonly', false)
        })
        $(document).on("change", ".lot-picked-quantity", function () {
            let row = $(this).closest("tr");
            let lot_id_list_raw = pageVariables.current_component_row.find(".data-component-lot-detail").text();
            let lot_id_list = lot_id_list_raw ? JSON.parse(lot_id_list_raw) : [];

            let lot_id = row.find(".lot-component-select").attr("data-lot-id");

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

            pageVariables.current_component_row.find(".data-component-lot-detail").text(JSON.stringify(lot_id_list));
            pageVariables.current_component_row.find(".component-quantity").val(sum_picked_quantity);
        })
        $(document).on("change", '.serial-component-select', function () {
            let serial_id_list_raw = pageVariables.current_component_row.find('.data-component-sn-detail').text()
            let serial_id_list = serial_id_list_raw ? JSON.parse(serial_id_list_raw) : []

            let serial_id = $(this).attr('data-serial-id')

            if ($(this).prop('checked')) {
                if (!serial_id_list.includes(serial_id)) {
                    serial_id_list.push(serial_id)
                }
            } else {
                serial_id_list = serial_id_list.filter(id => id !== serial_id)
            }
            pageVariables.current_component_row.find('.data-component-sn-detail').text(JSON.stringify(serial_id_list))
            pageVariables.current_component_row.find('.component-quantity').val(serial_id_list.length)
        })
        $(document).on('click', '.remove-component-btn', function () {
            let component_quantity = parseFloat($(this).closest('tr').find('.component-quantity').val() || 0)
            let component_id = $(this).attr('data-component-id')
            let component_code = $(this).attr('data-component-code')
            let component_name = $(this).attr('data-component-name')
            let component_des = $(this).attr('data-component-des')
            if (component_quantity > 0) {
                let data_removed = {
                    'component_id': component_id,
                    'component_code': component_code,
                    'component_name': component_name,
                    'component_des': component_des,
                    'component_quantity': 1
                }

                let existed_row = null
                pageElements.$table_product_removed_component.find('tbody tr').each(function (index, ele) {
                    if ($(ele).find('.component-title').attr('data-component-id') === component_id) {
                        existed_row = $(ele)
                        return false
                    }
                })

                if (!existed_row) {
                    // add to removed_table
                    UsualLoadPageFunction.AddTableRow(
                        pageElements.$table_product_removed_component,
                        data_removed
                    )
                }
                else {
                    // update row in removed_table
                    let removed_quantity = parseFloat(existed_row.find('.component-quantity').val() || 0)
                    existed_row.find('.component-quantity').val(removed_quantity + 1)
                }

                $(this).closest('tr').find('.component-quantity').val(component_quantity - 1)
                if (component_quantity - 1 === 0) {
                    // remove row = 0
                    UsualLoadPageFunction.DeleteTableRow(
                        pageElements.$table_product_current_component,
                        parseInt($(this).closest('tr').find('td:first-child').text())
                    )
                }
            }
        })
        $(document).on('click', '.return-component-btn', function () {
            let component_quantity = parseFloat($(this).closest('tr').find('.component-quantity').val() || 0)
            let component_id = $(this).attr('data-component-id')
            let component_code = $(this).attr('data-component-code')
            let component_name = $(this).attr('data-component-name')
            let component_des = $(this).attr('data-component-des')
            if (component_quantity > 0) {
                let data_return = {
                    'id': component_id,
                    'component_code': component_code,
                    'component_name': component_name,
                    'component_des': component_des,
                    'component_quantity': 1
                }

                let existed_row = null
                pageElements.$table_product_current_component.find('tbody tr').each(function (index, ele) {
                    if ($(ele).find('.component-title').attr('data-component-id') === component_id) {
                        existed_row = $(ele)
                        return false
                    }
                })

                if (!existed_row) {
                    // add to current_table
                    UsualLoadPageFunction.AddTableRow(
                        pageElements.$table_product_current_component,
                        data_return
                    )
                }
                else {
                    // update row in current_table
                    let removed_quantity = parseFloat(existed_row.find('.component-quantity').val() || 0)
                    existed_row.find('.component-quantity').val(removed_quantity + 1)
                }

                $(this).closest('tr').find('.component-quantity').val(component_quantity - 1)
                if (component_quantity - 1 === 0) {
                    // remove row = 0
                    UsualLoadPageFunction.DeleteTableRow(
                        pageElements.$table_product_removed_component,
                        parseInt($(this).closest('tr').find('td:first-child').text())
                    )
                }
            }
        })
    }
}
