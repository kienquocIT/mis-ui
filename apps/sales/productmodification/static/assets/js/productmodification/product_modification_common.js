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
        this.$picking_status = $('#picking-status')
        // modal
        this.$btn_open_modal_product = $('#btn-open-modal-product')
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
    }
}
const pageVariables = new ProductModificationPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class ProductModificationPageFunction {
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
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="fw-bold text-primary">${row?.['code']}</span>`
                    }
                },
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span>${row?.['description'] || ''}</span>`
                    }
                }
            ]
        });
    }
    static LoadTableCurrentProductModified(data_list=[]) {
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
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="fw-bold text-primary">${row?.['code']}</span>`
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'text-center w-10',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-xs btn-gradient-primary btn-modal-picking-product"
                                        data-product-id="${row?.['id']}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#picking-product-modal">
                                <span>
                                    <span class="icon">
                                        <span class="feather-icon"><i class="fa-solid fa-ellipsis-vertical"></i></span>
                                    </span>
                                    <span>${pageElements.$trans_url.attr('data-trans-picking')}</span>
                                </span>
                                </button>`;
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<div class="data-product-detail-space"></div>`;
                    }
                },
            ]
        });
    }
    static LoadTableWarehouseByProduct(data_list=[]) {
        pageElements.$table_select_warehouse.DataTable().clear().destroy()
        pageElements.$table_select_warehouse.DataTableDefault({
            useDataServer: false,
            rowIdx: true,
            paging: false,
            scrollX: true,
            scrollY: '20vh',
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
                                    <input type="radio" name="product-warehouse-select"
                                           class="form-check-input product-warehouse-select"
                                           data-product-warehouse-id="${row?.['id']}"
                                           data-warehouse-code="${row?.['warehouse_data']?.['code']}"
                                           data-warehouse-title="${row?.['warehouse_data']?.['title']}"
                                    >
                                </div>`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="fw-bold text-primary">${row?.['warehouse_data']?.['code']}</span>`
                    }
                },
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['warehouse_data']?.['title']}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span>${row?.['stock_amount']}</span> <span>${row?.['uom_data']?.['title']}</span>`
                    }
                }
            ]
        });
    }
    static LoadTableSerialListByWarehouse(data_list=[]) {
        pageElements.$table_select_serial.DataTable().clear().destroy()
        pageElements.$table_select_serial.DataTableDefault({
            useDataServer: false,
            rowIdx: true,
            paging: false,
            scrollX: true,
            scrollY: '30vh',
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
                                    <input type="radio" name="serial-select"
                                           class="form-check-input serial-select"
                                           data-serial-id="${row?.['id']}"
                                           data-sn="${row?.['serial_number']}"
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
    static LoadTableProductCurrentComponentList(data_list=[]) {
        pageElements.$table_product_current_component.DataTable().clear().destroy()
        pageElements.$table_product_current_component.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '50vh',
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
                            return `<span class="badge badge-sm badge-primary">${row?.['product_code']}</span><br><span data-row-type="${row?.['type'] || ''}" data-product-id="${row?.['product_id']}" class="fw-bold text-primary component-title">${row?.['product_title']}</span><br><span class="small">${row?.['product_des'] || ''}</span>`;
                        }
                        return `<span class="fw-bold component-title">${row?.['component_name']}</span><br><span class="small">${row?.['component_des'] || ''}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        let picking_component_btn = `
                            <button type="button"
                                    class="btn btn-outline-secondary btn-modal-picking-component"
                                    data-product-id="${row?.['product_id']}"
                                    data-product-code="${row?.['product_code']}"
                                    data-product-title="${row?.['product_title']}"
                                    data-product-description="${row?.['product_des']}"
                                    data-product-general-traceability-method="${row?.['general_traceability_method']}"
                                    data-bs-toggle="modal"
                                    data-bs-target="#picking-component-modal">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                        `;
                        if (row?.['product_id']) {
                            return `
                                <div class="input-group">
                                    <input class="form-control component-quantity" type="number" min="1" value="${row?.['product_quantity'] || 0}">
                                    ${picking_component_btn}
                                </div>
                            `;
                        }
                        return `<input class="form-control component-quantity" type="number" min="1" value="${row?.['component_quantity'] || 0}">`;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] !== 'new') {
                            return `<i class="fa-solid fa-angles-right text-danger remove-component-btn"></i>`;
                        }
                        return `<i class="fa-solid fa-trash-can text-danger delete-added-component-btn"></i>`;
                    }
                },
            ]
        });
    }
    static LoadTableProductRemovedComponentList(data_list=[]) {
        pageElements.$table_product_removed_component.DataTable().clear().destroy()
        pageElements.$table_product_removed_component.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '50vh',
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
                        return `<span class="fw-bold">${row?.['component_name']}</span><br><span class="small">${row?.['component_des'] || ''}</span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span>${row?.['component_quantity']}</span>`;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<i class="fa-solid fa-angles-left text-blue return-btn"></i>`;
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
                        return `<span class="badge badge-sm badge-primary">${row?.['code']}</span><br><span class="fw-bold text-primary">${row?.['title']}</span><br><span class="small">${row?.['description'] || ''}</span>`
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
            scrollY: '20vh',
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
                                           class="form-check-input product-warehouse-select"
                                           data-product-warehouse-id="${row?.['id']}"
                                           data-warehouse-code="${row?.['warehouse_data']?.['code']}"
                                           data-warehouse-title="${row?.['warehouse_data']?.['title']}"
                                    >
                                </div>`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="fw-bold text-primary">${row?.['warehouse_data']?.['code']}</span>`
                    }
                },
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['warehouse_data']?.['title']}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span>${row?.['stock_amount']}</span> <span>${row?.['uom_data']?.['title']}</span>`
                    }
                }
            ]
        });
    }
    static LoadTableComponentSerialListByWarehouse(data_list=[]) {
        pageElements.$table_select_component_serial.DataTable().clear().destroy()
        pageElements.$table_select_component_serial.DataTableDefault({
            useDataServer: false,
            rowIdx: true,
            paging: false,
            scrollX: true,
            scrollY: '30vh',
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
                                    <input type="radio" name="serial-select"
                                           class="form-check-input serial-select"
                                           data-serial-id="${row?.['id']}"
                                           data-sn="${row?.['serial_number']}"
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
}

/**
 * Khai báo các hàm chính
 */
class ProductModificationHandler {
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
        $(document).on("click", '.btn-modal-picking-product', function () {
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
                    ProductModificationPageFunction.LoadTableWarehouseByProduct(results[0])
                    ProductModificationPageFunction.LoadTableSerialListByWarehouse()
                }
            )
        })
        $(document).on("change", '.product-warehouse-select', function () {
            pageElements.$table_select_serial.closest('.table-serial-space').prop('hidden', pageVariables.current_product_modified?.['general_traceability_method'] !== '2')
            if (pageVariables.current_product_modified?.['general_traceability_method'] === '2') {
                let product_warehouse_id = $(this).attr('data-product-warehouse-id')
                let serial_list_ajax = $.fn.callAjax2({
                    url: pageElements.$script_url.attr('data-url-serial-list-by-warehouse'),
                    data: {'product_warehouse_id': product_warehouse_id},
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
                        ProductModificationPageFunction.LoadTableSerialListByWarehouse(results[0])
                    }
                )
            }
        })
        pageElements.$accept_picking_product_btn.on('click', function () {
            let detail_product = {
                'product_warehouse_id': null,
                'serial_id': null
            }
            let warehouse_data = {}
            let serial_data = {}
            let flag = true
            const $checked_prd_wh = pageElements.$table_select_warehouse.find('.product-warehouse-select:checked').first()
            const $checked_serial = pageElements.$table_select_serial.find('.serial-select:checked').first()
            if ($checked_prd_wh.length > 0) {
                detail_product['product_warehouse_id'] = $checked_prd_wh.attr('data-product-warehouse-id')
                warehouse_data = {
                    'code': $checked_prd_wh.attr('data-warehouse-code'),
                    'title': $checked_prd_wh.attr('data-warehouse-title'),
                }
            }
            else {
                $.fn.notifyB({description: 'Warehouse is not selected'}, 'failure')
                flag = false
            }
            if ($checked_serial.length > 0) {
                detail_product['serial_id'] = $checked_serial.attr('data-serial-id')
                serial_data = {
                    'sn': $checked_serial.attr('data-sn'),
                }
            }
            else {
                if (pageElements.$table_select_serial.find('tbody .dataTables_empty').length === 0) {
                    $.fn.notifyB({description: 'Please select one serial'}, 'failure')
                    flag = false
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
                        ProductModificationPageFunction.LoadTableProductCurrentComponentList(results[0]?.['component_list_data' || []])
                    }
                )

                pageElements.$picking_product_modal.modal('hide')
                pageElements.$picking_status.text(pageElements.$picking_status.attr('data-trans-picked')).attr('class', 'text-success')
                pageElements.$table_current_product_modified.find('tbody .btn-modal-picking-product:eq(0)').attr('data-detail-product', JSON.stringify(detail_product))
                pageElements.$table_current_product_modified.find('tbody .data-product-detail-space').html(`
                    <span class="small">${$.fn.gettext('Warehouse')}: ${warehouse_data?.['code']} - ${warehouse_data?.['title']}</span>, <span class="small">${$.fn.gettext('Serial number')}: ${serial_data?.['sn']}</span>
                `)
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
                        'product_quantity': 1
                    }
                )
                let row_added = pageElements.$table_product_current_component.find('tbody tr:last-child')
                row_added.find('.component-quantity').focus()
                row_added.addClass('bg-success-light-4')
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
                let product_warehouse_id = $(this).attr('data-product-warehouse-id')
                let serial_list_ajax = $.fn.callAjax2({
                    url: pageElements.$script_url.attr('data-url-serial-list-by-warehouse'),
                    data: {'product_warehouse_id': product_warehouse_id},
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
                        ProductModificationPageFunction.LoadTableComponentSerialListByWarehouse(results[0])
                    }
                )
            }
        })
    }
}
