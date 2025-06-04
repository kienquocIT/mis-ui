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
        this.$table_select_serial = $('#table-select-serial')
        this.$accept_picking_product_btn = $('#accept-picking-product-btn')
        // space
        this.$table_current_product_modified = $('#table-current-product-modified')
        this.$table_product_current_component = $('#table-product-current-component')
        this.$insert_component_btn = $('#insert-component-btn')
        this.$table_select_component_inserted = $('#table-select-component-inserted')
        this.$table_product_removed_component = $('#table-product-removed-component')
        this.$picking_component_modal = $('#picking-component-modal')
        this.$accept_picking_component_btn = $('#accept-picking-component-btn')
        this.$table_select_component_warehouse = $('#table-select-component-warehouse')
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
    static LoadTableCurrentProductModified(data_list=[], warehouse_code='', serial_number='') {
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
                if (warehouse_code && serial_number) {
                    pageElements.$table_current_product_modified.find('tbody tr .prd-modified-text-detail').html(`<span class="badge badge-sm badge-primary">${warehouse_code}</span><br><span>Serial: ${serial_number}</span>`)
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
                            data-product-general-traceability-method="${row?.['general_traceability_method'] || ''}"
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
                                   data-warehouse-id="${(row?.['warehouse_data'] || {})?.['id'] || ''}"
                                   data-warehouse-code="${(row?.['warehouse_data'] || {})?.['code'] || ''}"
                                   data-warehouse-title="${(row?.['warehouse_data'] || {})?.['title'] || ''}"
                            >
                        </div>`;
                }
            },
            {
                className: 'w-60',
                render: (data, type, row) => {
                    return `<span class="badge badge-sm badge-primary warehouse-code">${(row?.['warehouse_data'] || {})?.['code'] || ''}</span>
                            <span class="text-primary">${(row?.['warehouse_data'] || {})?.['title'] || ''}</span>`
                }
            },
            {
                className: 'text-right w-30',
                render: (data, type, row) => {
                    return `<span>${row?.['stock_amount'] || ''}</span> <span>${(row?.['uom_data'] || {})?.['title']}</span>`
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
                                    <br><span data-row-type="${row?.['type'] || ''}" data-product-id="${row?.['product_id'] || ''}" class="fw-bold component-title">${row?.['product_title'] || ''}</span>
                                    <br><span class="small component-des">${row?.['product_des'] || ''}</span>`;
                        }
                        return `<span class="fw-bold component-title" data-component-id="${row?.['id'] || ''}">${row?.['component_name'] || ''}</span>
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
                                        data-product-general-traceability-method="${row?.['general_traceability_method'] || ''}"
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
                                <script class="data-component-none-detail"></script>
                                <script class="data-component-lot-detail"></script>
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
                            if (row?.['product_id']) {
                                return `<button type="button"
                                            ${option === 'detail' ? 'disabled' : ''}
                                            class="btn-icon btn-rounded flush-soft-hover btn btn-flush-danger remove-component-btn"
                                            data-component-id="${row?.['product_id'] || ''}"
                                            data-component-code="${row?.['product_code'] || ''}"
                                            data-component-name="${row?.['product_title'] || ''}"
                                            data-component-des="${row?.['product_des'] || ''}"
                                    >
                                        <span class="icon"><i class="bi bi-arrow-right-circle"></i></span>
                                    </button>`;
                            }
                            return `<button type="button"
                                            ${option === 'detail' ? 'disabled' : ''}
                                            class="btn-icon btn-rounded flush-soft-hover btn btn-flush-danger remove-component-btn"
                                            data-component-id="${row?.['id'] || ''}"
                                            data-component-name="${row?.['component_name'] || ''}"
                                            data-component-des="${row?.['component_des'] || ''}"
                                    >
                                        <span class="icon"><i class="bi bi-arrow-right-circle"></i></span>
                                    </button>`;
                        }
                        return `<i class="fa-solid fa-trash-can text-danger delete-added-component-btn"></i>`;
                    }
                },
            ]
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
                            return `<span class="badge badge-sm badge-secondary">${row?.['component_code'] || ''}</span><br><span class="fw-bold component-title" data-component-id="${row?.['id']}">${row?.['component_name']}</span><br><span class="small component-des">${row?.['component_des'] || ''}</span>`;
                        }
                        return `<span class="fw-bold component-title" data-component-id="${row?.['id']}">${row?.['component_name']}</span><br><span class="small component-des">${row?.['component_des'] || ''}</span>`
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
                                        data-component-id="${row?.['id'] || ''}"
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
                                data-product-id="${row?.['id']}"
                                data-product-code="${row?.['code']}"
                                data-product-title="${row?.['title']}"
                                data-product-description="${row?.['description'] || ''}"
                                data-product-general-traceability-method="${row?.['general_traceability_method'] || ''}"
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
    static LoadTableComponentWarehouseByProduct(data_list=[]) {
        pageElements.$table_select_component_warehouse.DataTable().clear().destroy()
        pageElements.$table_select_component_warehouse.DataTableDefault({
            useDataServer: false,
            rowIdx: true,
            paging: false,
            scrollX: true,
            scrollY: '15vh',
            scrollCollapse: true,
            reloadCurrency: true,
            data: data_list,
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
                                    <input type="radio" name="product-warehouse-component-select"
                                           class="form-check-input product-warehouse-component-select"
                                           data-warehouse-id="${(row?.['warehouse_data'] || {})?.['id'] || ''}"
                                    >
                                </div>`;
                    }
                },
                {
                    className: 'w-60',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-primary">${(row?.['warehouse_data'] || {})?.['code'] || ''}</span> <span class="text-primary">${(row?.['warehouse_data'] || {})?.['title'] || ''}</span>`
                    }
                },
                {
                    className: 'text-right w-30',
                    render: (data, type, row) => {
                        return `<span>${row?.['stock_amount'] || ''}</span> <span>${(row?.['uom_data'] || {})?.['title'] || ''}</span>`
                    }
                }
            ]
        });
    }
    static LoadTableComponentSerialListByWarehouse(data_list=[], serial_id_list=[]) {
        pageElements.$table_select_component_serial.DataTable().clear().destroy()
        pageElements.$table_select_component_serial.DataTableDefault({
            useDataServer: false,
            rowIdx: true,
            paging: false,
            scrollX: true,
            scrollY: '25vh',
            scrollCollapse: true,
            reloadCurrency: true,
            data: data_list,
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
                                    <input type="checkbox"
                                           ${serial_id_list.includes(row?.['id']) ? 'checked' : ''}
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
        });
    }
    // load detail sub
    static ParseDataCurrentComponent(current_component_data=[]) {
        let parsed_current_component_data = []
        for (let i= 0; i < (current_component_data || []).length; i++) {
            let item = current_component_data[i]
            if (Object.keys(item?.['component_product_data']).length !== 0) {
                let component_product_data = item?.['component_product_data'] || {}
                parsed_current_component_data.push({
                    'order': item?.['order'] || '',
                    'product_id': component_product_data?.['id'] || '',
                    'product_code': component_product_data?.['code'] || '',
                    'product_title': component_product_data?.['title'] || '',
                    'product_des': component_product_data?.['description'] || '',
                    'general_traceability_method': component_product_data?.['general_traceability_method'] || '',
                    'component_product_sn_detail': item?.['component_product_sn_detail'] || [],
                    'product_quantity': item?.['component_quantity'] || ''
                })
            }
            else {
                let component_text_data = item?.['component_text_data'] || {}
                parsed_current_component_data.push({
                    'order': item?.['order'] || '',
                    'id': item?.['id'] || '',
                    'component_name': component_text_data?.['title'] || '',
                    'component_des': component_text_data?.['description'] || '',
                    'component_quantity': item?.['component_quantity'] || ''
                })
            }
        }
        console.log(parsed_current_component_data)
        return parsed_current_component_data
    }
    static ParseDataRemovedComponent(removed_component_data=[]) {
        let parsed_removed_component_data = []
        for (let i= 0; i < (removed_component_data || []).length; i++) {
            let item = removed_component_data[i]
            if (Object.keys(item?.['component_product_data']).length !== 0) {
                let component_product_data = item?.['component_product_data'] || {}
                parsed_removed_component_data.push({
                    'order': item?.['order'] || '',
                    'product_id': component_product_data?.['id'] || '',
                    'product_code': component_product_data?.['code'] || '',
                    'product_title': component_product_data?.['title'] || '',
                    'product_des': component_product_data?.['description'] || '',
                    'general_traceability_method': component_product_data?.['general_traceability_method'] || '',
                    'product_quantity': item?.['component_quantity'] || ''
                })
            }
            else {
                let component_text_data = item?.['component_text_data'] || {}
                parsed_removed_component_data.push({
                    'order': item?.['order'] || '',
                    'id': item?.['id'] || '',
                    'component_name': component_text_data?.['title'] || '',
                    'component_des': component_text_data?.['description'] || '',
                    'component_quantity': item?.['component_quantity'] || ''
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
                    'component_product_sn_detail': $(ele).find('.data-component-sn-detail').text() ? JSON.parse($(ele).find('.data-component-sn-detail').text()) : [],
                    'component_quantity': $(ele).find('.component-quantity').val()
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

                    console.log(data)

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    pageElements.$title.val(data?.['title'])
                    pageElements.$created_date.val(data?.['date_created'] ? DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "DD/MM/YYYY", data?.['date_created']) : '')
                    pageVariables.current_product_modified = (data?.['prd_wh_data'] || {})?.['product'] || {}
                    pageVariables.current_product_modified['warehouse_id'] = ((data?.['prd_wh_data'] || {})?.['warehouse'] || {})?.['id']
                    pageVariables.current_product_modified['product_id'] = ((data?.['prd_wh_data'] || {})?.['product'] || {})?.['id']
                    pageVariables.current_product_modified['serial_id'] = (data?.['prd_wh_serial_data'] || {})?.['id']
                    ProductModificationPageFunction.LoadTableCurrentProductModified(
                        [pageVariables.current_product_modified],
                        ((data?.['prd_wh_data'] || {})?.['warehouse'] || {})?.['code'],
                        (data?.['prd_wh_serial_data'] || {})?.['serial_number']
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
            pageElements.$table_select_serial.closest('.table-serial-space').prop('hidden', true)
            let product_id = pageVariables.current_product_modified?.['id']
            let url = `${pageElements.$script_url.attr('data-url-warehouse-list-by-product')}&product_id=${product_id}`
            ProductModificationPageFunction.LoadTableWarehouseByProduct(url)
            ProductModificationPageFunction.LoadTableSerialListByWarehouse()
        })
        $(document).on("change", '.product-warehouse-select', function () {
            pageElements.$table_select_serial.closest('.table-serial-space').prop('hidden', Number(pageVariables.current_product_modified?.['general_traceability_method']) !== 2)
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
            const $checked_prd_wh = pageElements.$table_select_warehouse.find('.product-warehouse-select:checked').first()
            const $checked_serial = pageElements.$table_select_serial.find('.serial-select:checked').first()

            if ($checked_prd_wh.length === 0) {
                $.fn.notifyB({description: 'Warehouse is not selected'}, 'failure')
                flag = false
            }
            else {
                pageVariables.current_product_modified['product_id'] = $checked_prd_wh.attr('data-warehouse-id')
                pageVariables.current_product_modified['warehouse_id'] = $checked_prd_wh.attr('data-warehouse-id')
                warehouse_code = $checked_prd_wh.closest('tr').find('.warehouse-code').text()
            }

            if ($checked_serial.length === 0) {
                if (pageElements.$table_select_serial.find('tbody .dataTables_empty').length === 0) {
                    $.fn.notifyB({description: 'Please select one serial'}, 'failure')
                    flag = false
                }
            }
            else {
                pageVariables.current_product_modified['serial_id'] = $checked_serial.attr('data-serial-id')
                serial_number = $checked_serial.closest('tr').find('.serial-number').text()
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
                        ProductModificationPageFunction.LoadTableProductCurrentComponentList(results[0]?.['component_list_data' || []])
                        ProductModificationPageFunction.LoadTableProductRemovedComponentList()
                    }
                )

                pageElements.$table_current_product_modified.find('tbody tr .prd-modified-text-detail').html(`<span class="badge badge-sm badge-primary">${warehouse_code}</span><br><span>Serial: ${serial_number}</span>`)
                pageElements.$picking_product_modal.modal('hide')
                pageElements.$insert_component_btn.prop('hidden', false)
            }
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
                row_added.addClass('bg-success-light-5')
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
            let warehouse_ajax = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-warehouse-list-by-product'),
                data: {'product_id': product_id},
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_list_by_product')) {
                        return data?.['warehouse_list_by_product'];
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )

            Promise.all([warehouse_ajax]).then(
                (results) => {
                    ProductModificationPageFunction.LoadTableComponentWarehouseByProduct(results[0])
                    ProductModificationPageFunction.LoadTableComponentSerialListByWarehouse()
                }
            )
        })
        $(document).on("change", '.product-warehouse-component-select', function () {
            pageElements.$table_select_component_serial.closest('.table-serial-space').prop('hidden', pageVariables.current_component?.['general_traceability_method'] !== '2')
            if (pageVariables.current_component?.['general_traceability_method'] === '2') {
                let serial_list_ajax = $.fn.callAjax2({
                    url: pageElements.$script_url.attr('data-url-serial-list-by-warehouse'),
                    data: {
                        'product_warehouse__product_id': pageVariables.current_component?.['id'],
                        'product_warehouse__warehouse_id': $(this).attr('data-warehouse-id')
                    },
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('product_serial_list')) {
                            return data?.['product_serial_list'];
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )

                Promise.all([serial_list_ajax]).then(
                    (results) => {
                        let serial_id_list_raw = pageVariables.current_component_row.find('.data-component-sn-detail').text()
                        let serial_id_list = serial_id_list_raw ? JSON.parse(serial_id_list_raw) : []

                        ProductModificationPageFunction.LoadTableComponentSerialListByWarehouse(results[0], serial_id_list)
                    }
                )
            }
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
                    'id': component_id,
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
