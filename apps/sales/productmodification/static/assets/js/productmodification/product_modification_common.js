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
        this.$select_product_modified_modal = $('#select-product-modified-modal')
        this.$table_select_product_modified = $('#table-select-product-modified')
        this.$table_current_product_modified = $('#table-current-product-modified')
        this.$table_product_component = $('#table-product-component')
        this.$accept_product_modified_btn = $('#accept-product-modified-btn')
        this.$table_select_warehouse = $('#table-select-warehouse')
        this.$accept_picking_product_btn = $('#accept-picking-product-btn')
    }
}
const pageElements = new ProductModificationPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class ProductModificationPageVariables {
    constructor() {
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
                        return `<div class="form-check-sm form-check">
                            <input type="radio" class="form-check-input product-modified-select"
                            data-product-id="${row?.['id']}"
                            data-product-code="${row?.['code']}"
                            data-product-title="${row?.['title']}"
                            data-product-description="${row?.['description'] || ''}"
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
                    className: 'w-60',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'text-center w-20',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-xs btn-outline-secondary btn-modal-picking-product"
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
            ]
        });
    }
    static LoadTableProductComponentList(data_list=[]) {
        pageElements.$table_product_component.DataTable().clear().destroy()
        pageElements.$table_product_component.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            scrollX: true,
            scrollY: '30vh',
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
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['component_name']}</span>`
                    }
                },
                {
                    className: 'w-60',
                    render: (data, type, row) => {
                        return `<span>${row?.['component_des'] || ''}</span>`
                    }
                },
                {
                    className: 'text-center w-20',
                    render: (data, type, row) => {
                        return `<span>${row?.['component_quantity']}</span>`;
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
            scrollX: true,
            scrollY: '70vh',
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
                        return `<div class="form-check-sm form-check"><input type="radio" class="form-check-input product-warehouse-select" data-product-warehouse-id="${row?.['id']}"></div>`;
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
                ProductModificationPageFunction.LoadTableCurrentProductModified([{
                    'id': $checkedEle.attr('data-product-id'),
                    'code': $checkedEle.attr('data-product-code'),
                    'title': $checkedEle.attr('data-product-title')
                }])
                pageElements.$select_product_modified_modal.modal('hide')

                let product_id = $checkedEle.attr('data-product-id')
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
                        ProductModificationPageFunction.LoadTableProductComponentList(results[0]?.['component_list_data' || []])
                    }
                )
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
                }
            )
        })
    }
}
