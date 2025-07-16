/**
 * Khai báo các element trong page
 */
class ProductModificationBOMPageElements {
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
        this.$table_select_product_modified_before = $('#table-select-product-modified-before')
        this.$accept_product_modified_btn = $('#accept-product-modified-btn')
        // space
        this.$table_current_product_modified = $('#table-current-product-modified')
        this.$btn_add_row_init_component = $('#btn-add-row-init-component')
        this.$confirm_initial_components_modal = $('#confirm-initial-components-modal')
        this.$confirm_initial_components_table = $('#confirm-initial-components-table')
        this.$confirm_initial_components_btn = $('#confirm-initial-components-btn')
        this.$table_product_current_component = $('#table-product-current-component')
        this.$insert_component_btn = $('#insert-component-btn')
        this.$table_select_component_inserted = $('#table-select-component-inserted')
        this.$table_product_added_component = $('#table-product-added-component')
    }
}
const pageElements = new ProductModificationBOMPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class ProductModificationBOMPageVariables {
    constructor() {
        this.current_product_modified = {}
    }
}
const pageVariables = new ProductModificationBOMPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class ProductModificationBOMPageFunction {
    static LoadTableCurrentProductModified(data_list=[], base_cost=0, modified_cost=0, option='create') {
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
                    className: 'w-45',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <a data-bs-toggle="collapse" href=".d1_${row?.['id']}" role="button" aria-expanded="false" aria-controls=".d1_${row?.['id']}">
                                        <i class="bi bi-info-circle"></i>
                                    </a>
                                    <span class="badge badge-sm badge-soft-secondary ml-1">${row?.['code'] || ''}</span>
                                    <span class="ml-1">${row?.['title'] || ''}</span>
                                </div>
                                <div class="collapse d1_${row?.['id']}"><span class="small">${row?.['description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} class="form-control mask-money base-code" value="${base_cost || 0}">`
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<input disabled readonly class="form-control mask-money modified-cost" value="${modified_cost || 0}">`
                    }
                },
            ]
        });
    }
    static LoadTableProductRaw() {
        pageElements.$table_select_product_modified.DataTable().clear().destroy()
        pageElements.$table_select_product_modified.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '50vh',
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
                        return `<div class="d-flex align-items-center">
                                    <a data-bs-toggle="collapse" href=".d2_${row?.['id']}" role="button" aria-expanded="false" aria-controls=".d2_${row?.['id']}">
                                        <i class="bi bi-info-circle"></i>
                                    </a>
                                    <span class="badge badge-sm badge-soft-secondary ml-1">${row?.['code']}</span>
                                    <span class="ml-1">${row?.['title']}</span>
                                </div>
                                <div class="collapse d2_${row?.['id']}"><span class="small">${row?.['description'] || ''}</span></div>`
                    }
                }
            ]
        });
    }
    static LoadTableProductModifiedBefore() {
        pageElements.$table_select_product_modified_before.DataTable().clear().destroy()
        pageElements.$table_select_product_modified_before.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            reloadCurrency: true,
            ajax: {
                url: pageElements.$table_select_product_modified_before.attr('data-product-modified-before-list-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['product_modified_before_list'] ? resp.data['product_modified_before_list'] : [];
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
                                data-product-description="${row?.['new_description'] || row?.['description'] || ''}"
                                data-product-general-traceability-method="${row?.['general_traceability_method']}"
                                data-prd-wh="${row?.['product_warehouse_id'] || ''}"
                                data-prd-wh-lot="${row?.['product_warehouse_lot_id'] || ''}"
                                data-prd-wh-serial="${row?.['product_warehouse_serial_id'] || ''}"
                                data-modified-number="${row?.['modified_number'] || ''}"
                                data-serial-number="${row?.['serial_number'] || ''}"
                                data-lot-number="${row?.['lot_number'] || ''}"
                            >
                        </div>`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        if (row?.['serial_number']) {
                            return `<span class="text-primary fw-bold">${row?.['modified_number']}</span><br><span class="small">Serial: ${row?.['serial_number'] || ''}</span>`
                        }
                        if (row?.['lot_number']) {
                            return `<span class="text-primary fw-bold">${row?.['modified_number']}</span><br><span class="small">Lot: ${row?.['lot_number'] || ''}</span>`
                        }
                        return `<span class="text-primary fw-bold">${row?.['modified_number']}</span>`
                    }
                },
                {
                    className: 'w-70',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <a data-bs-toggle="collapse" href=".d2_${row?.['modified_number']}" role="button" aria-expanded="false" aria-controls=".d2_${row?.['modified_number']}">
                                        <i class="bi bi-info-circle"></i>
                                    </a>
                                    <span class="badge badge-sm badge-soft-secondary ml-1">${row?.['code']}</span>
                                    <span class="ml-1">${row?.['title']}</span>
                                </div>
                                <div class="collapse d2_${row?.['modified_number']}"><span class="small">${row?.['new_description'] || row?.['description'] || ''}</span></div>`
                    }
                },
            ]
        });
    }
    static LoadTableProductConfirmInitComponentList(data_list=[]) {
        pageElements.$confirm_initial_components_table.DataTable().clear().destroy()
        pageElements.$confirm_initial_components_table.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '55vh',
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
                        return `<input placeholder="${$.fn.gettext('Component name')}"
                                       class="form-control form-control-line fw-bold mb-1 init-component-title"
                                       value="${row?.['component_name'] || ''}">
                                <textarea placeholder="${$.fn.gettext('Description')}..." rows="3" class="form-control small init-component-des">${row?.['component_des'] || ''}</textarea>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<input class="form-control fs-5 init-component-quantity" type="number" min="1" value="${row?.['component_quantity'] || ''}">`;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-secondary delete-init-component-btn">
                                    <span class="icon"><i class="fa-regular fa-trash-can"></i></span>
                                </button>`;
                    }
                },
            ],
            initComplete: function () {
                pageElements.$table_product_current_component.find('tbody tr').each(function (index, ele) {
                    if (data_list[index]?.['is_added_component']) {
                        $(ele).addClass('is_added_component');
                        $(ele).find('td').first().css('border-left', '4px solid #d1f2e0');
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
                    className: 'w-55',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <a data-bs-toggle="collapse" href=".d3_${(row?.['component_text_data'] || {})?.['title']}" role="button" aria-expanded="false" aria-controls=".d3_${(row?.['component_text_data'] || {})?.['title']}">
                                        <i class="bi bi-info-circle"></i>
                                    </a>
                                    <span class="component-title ml-1" data-component-id="${(row?.['component_text_data'] || {})?.['title'] || ''}">${(row?.['component_text_data'] || {})?.['title'] || ''}</span>
                                </div>
                                <div class="collapse d3_${(row?.['component_text_data'] || {})?.['title']}"><span class="small component-des">${(row?.['component_text_data'] || {})?.['description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="component-base-quantity">${row?.['base_quantity'] || 0}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input class="form-control component-quantity" type="number" min="0" ${option === 'detail' ? 'disabled readonly' : ''} value="${row?.['removed_quantity'] || 0}">`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money component-cost" value="${row?.['cost'] || 0}" ${option === 'detail' ? 'disabled readonly' : ''}>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money component-subtotal" disabled readonly value="${row?.['subtotal'] || 0}">`;
                    }
                },
            ],
        });
    }
    static LoadTableProductAddedComponentList(data_list=[], option='create') {
        pageElements.$table_product_added_component.DataTable().clear().destroy()
        pageElements.$table_product_added_component.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
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
                    className: 'w-60',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <span class="input-group-text" style="width: 100px">
                                        <a class="icon-collapse" data-bs-toggle="collapse" href="" role="button" aria-expanded="false" aria-controls="">
                                            <i class="bi bi-info-circle"></i>
                                        </a>
                                        <span class="badge badge-sm badge-light ml-1 added-product-code">${row?.['product_added_data']?.['code'] || ''}</span>
                                    </span>
                                    <select ${option === 'detail' ? 'disabled readonly' : ''} class="form-select select2 added-product"></select>
                                </div>
                                <div class="collapse ${row?.['product_added_data']?.['id']}"><span class="small">${row?.['product_added_data']?.['description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input class="form-control component-quantity" type="number" min="1" value="${row?.['added_quantity'] || 0}" ${option === 'detail' ? 'disabled readonly' : ''}>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money component-cost" value="${row?.['cost'] || 0}" ${option === 'detail' ? 'disabled readonly' : ''}>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money component-subtotal" disabled readonly value="${row?.['subtotal'] || 0}">`;
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-secondary delete-added-component-btn" ${option === 'detail' ? 'disabled' : ''}>
                                    <span class="icon"><i class="fa-regular fa-trash-can"></i></span>
                                </button>`;
                    }
                },
            ],
            initComplete: function () {
                pageElements.$table_product_added_component.find('tbody tr').each(function (index, ele) {
                    UsualLoadPageFunction.LoadProduct({
                        element: $(ele).find('.added-product'),
                        data_url: pageElements.$script_url.attr('data-url-product-dd-list'),
                        data: data_list[index]?.['product_added_data']
                    })
                })
            }
        });
    }
    static CalculateSubtotal($row) {
        let quantity = Number($row.find('.component-quantity').val() || 0)
        let cost = Number($row.find('.component-cost').attr('value') || 0)
        $row.find('.component-subtotal').attr('value', quantity * cost)
        ProductModificationBOMPageFunction.CalculateModifiedCost()
        $.fn.initMaskMoney2()
    }
    static CalculateModifiedCost() {
        let base_cost = Number(pageElements.$table_current_product_modified.find('tbody tr .base-code').attr('value') || 0)
        let sum_minus_value = 0
        pageElements.$table_product_current_component.find('tbody tr').each(function (index, ele) {
            sum_minus_value += Number($(ele).find('.component-subtotal').attr('value') || 0)
        })
        let sum_plus_value = 0
        pageElements.$table_product_added_component.find('tbody tr').each(function (index, ele) {
            sum_plus_value += Number($(ele).find('.component-subtotal').attr('value') || 0)
        })
        let modified_cost = base_cost - sum_minus_value + sum_plus_value
        pageElements.$table_current_product_modified.find('tbody tr .modified-cost').attr('value', modified_cost)
        pageVariables.current_product_modified['modified_cost'] = modified_cost
        $.fn.initMaskMoney2()
    }
}

/**
 * Khai báo các hàm chính
 */
class ProductModificationBOMHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['product_mapped'] = pageVariables.current_product_modified?.['id']
        frm.dataForm['base_cost'] = Number(pageVariables.current_product_modified?.['base_cost'] || 0)
        frm.dataForm['modified_cost'] = Number(pageVariables.current_product_modified?.['modified_cost'] || 0)

        let current_component_data = []
        pageElements.$table_product_current_component.find('tbody tr').each(function (index, ele) {
            if ($(this).find('.dataTables_empty').length === 0) {
                current_component_data.push({
                    'component_text_data': {
                        'title': $(ele).find('.component-title').text() || '',
                        'description': $(ele).find('.component-des').text() || '',
                    },
                    'base_quantity': Number($(ele).find('.component-base-quantity').text() || 0),
                    'removed_quantity': Number($(ele).find('.component-quantity').val() || 0),
                    'cost': Number($(ele).find('.component-cost').attr('value') || 0),
                })
            }
        })
        frm.dataForm['current_component_data'] = current_component_data

        let added_component_data = []
        pageElements.$table_product_added_component.find('tbody tr').each(function (index, ele) {
            if ($(this).find('.dataTables_empty').length === 0) {
                added_component_data.push({
                    'product_added_id': $(ele).find('.added-product').val() || null,
                    'added_quantity': Number($(ele).find('.component-quantity').val() || 0),
                    'cost': Number($(ele).find('.component-cost').attr('value') || 0),
                })
            }
        })
        frm.dataForm['added_component_data'] = added_component_data

        return frm
    }
    static LoadDetailProductModificationBOM(option) {
        let url_loaded = $('#form-detail-product-modification-bom').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['product_modification_bom_detail'];

                    // console.log(data)

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    pageElements.$title.val(data?.['title'])
                    pageElements.$created_date.val(data?.['date_created'] ? DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "DD/MM/YYYY", data?.['date_created']) : '')
                    pageVariables.current_product_modified = data?.['product_mapped_data']
                    pageVariables.current_product_modified['id'] = data?.['product_mapped_data']?.['id']
                    pageVariables.current_product_modified['base_cost'] = data?.['base_cost']
                    pageVariables.current_product_modified['modified_cost'] = data?.['modified_cost']
                    ProductModificationBOMPageFunction.LoadTableCurrentProductModified(
                        [pageVariables.current_product_modified],
                        data?.['base_cost'],
                        data?.['modified_cost'],
                        option
                    )
                    ProductModificationBOMPageFunction.LoadTableProductCurrentComponentList(data?.['current_component_data'] || [], option)
                    ProductModificationBOMPageFunction.LoadTableProductAddedComponentList(data?.['added_component_data'] || [], option)

                    pageElements.$insert_component_btn.prop('hidden', false)

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
class ProductModificationBOMEventHandler {
    static InitPageEven() {
        // info
        pageElements.$btn_open_modal_product.on('click', function () {
            ProductModificationBOMPageFunction.LoadTableProductRaw()
            ProductModificationBOMPageFunction.LoadTableProductModifiedBefore()
        })
        pageElements.$accept_product_modified_btn.on('click', function () {
            const $checkedEle = pageElements.$select_product_modified_modal.find('.nav-link[href="#tab_product"]').hasClass('active') ? pageElements.$table_select_product_modified.find('.product-modified-select:checked').first() : pageElements.$table_select_product_modified_before.find('.product-modified-select:checked').first()
            if ($checkedEle.length > 0) {
                pageVariables.current_product_modified = {
                    'id': $checkedEle.attr('data-product-id'),
                    'code': $checkedEle.attr('data-product-code'),
                    'title': $checkedEle.attr('data-product-title'),
                    'description': $checkedEle.attr('data-product-description'),
                    'general_traceability_method': $checkedEle.attr('data-product-general-traceability-method'),
                }
                // nếu có modified number
                ProductModificationBOMPageFunction.LoadTableCurrentProductModified([pageVariables.current_product_modified])
                pageElements.$select_product_modified_modal.modal('hide')

                if ($checkedEle.attr('data-modified-number')) {
                    let product_id = pageVariables.current_product_modified?.['id']
                    let latest_component_list_ajax = $.fn.callAjax2({
                        url: pageElements.$script_url.attr('data-url-latest-component-list'),
                        data: {'product_warehouse__product_id': product_id, 'modified_number': $checkedEle.attr('data-modified-number') || ''},
                        method: 'GET'
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && typeof data === 'object' && data.hasOwnProperty('latest_component_list')) {
                                return data?.['latest_component_list'][0];
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )

                    Promise.all([latest_component_list_ajax]).then(
                        (results) => {
                            let current_component_data = results[0]?.['current_component_data'] || []
                            let parsed_current_component_data = []
                            for (let i= 0; i < (current_component_data || []).length; i++) {
                                let item = current_component_data[i]
                                if (Object.keys(item?.['component_product_data']).length !== 0) {
                                    let component_product_data = item?.['component_product_data']
                                    parsed_current_component_data.push({
                                        "id": component_product_data?.['id'] || '',
                                        "order": item?.['order'],
                                        "component_text_data": {
                                            "title": component_product_data?.['title'] || '',
                                            'description': component_product_data?.['description'] || '',
                                        },
                                        "base_quantity": item?.['component_quantity'],
                                        "cost": 0,
                                        "subtotal": 0
                                    })
                                }
                                else {
                                    parsed_current_component_data.push({
                                        "id": item?.['component_id'] || '',
                                        "order": item?.['order'],
                                        "component_text_data": item?.['component_text_data'],
                                        "base_quantity": item?.['component_quantity'],
                                        "cost": 0,
                                        "subtotal": 0
                                    })
                                }
                            }

                            ProductModificationBOMPageFunction.LoadTableProductCurrentComponentList(
                                parsed_current_component_data
                            )
                            ProductModificationBOMPageFunction.LoadTableProductAddedComponentList()
                        }
                    )

                    pageElements.$insert_component_btn.prop('hidden', false)
                }
                else {
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
                            pageElements.$confirm_initial_components_modal.modal('show')
                            ProductModificationBOMPageFunction.LoadTableProductConfirmInitComponentList(results[0]?.['component_list_data'] || [])
                        }
                    )

                    pageElements.$insert_component_btn.prop('hidden', false)
                }
            }
            else {
                $.fn.notifyB({description: 'Nothing is selected'}, 'failure')
            }
        })
        $(document).on('click', '.delete-init-component-btn', function () {
            UsualLoadPageFunction.DeleteTableRow(
                pageElements.$confirm_initial_components_table,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
        })
        pageElements.$btn_add_row_init_component.on('click', function () {
            UsualLoadPageFunction.AddTableRow(pageElements.$confirm_initial_components_table, {'component_quantity': 1})
            const container = $('#confirm-initial-components-table_wrapper .dataTables_scrollBody')[0]
            container.scrollTop = container.scrollHeight
        })
        pageElements.$confirm_initial_components_btn.on('click', function () {
            pageVariables.component_inserted_id_list = new Set()
            let has_error = false
            let init_component = []
            pageElements.$confirm_initial_components_table.find('tbody tr').each(function (index, ele) {
                if ($(this).find('.dataTables_empty').length === 0) {
                    let component_order = index + 1
                    let component_id = 'component_order_' + (component_order).toString()
                    let component_name = $(ele).find('.init-component-title').val() || ''
                    let component_des = $(ele).find('.init-component-des').val() || ''
                    let component_quantity = $(ele).find('.init-component-quantity').val() || ''
                    if (component_name && Number(component_quantity) > 0) {
                        init_component.push({
                            "id": component_id,
                            "order": component_order,
                            "component_text_data": {
                                "title": component_name,
                                "description": component_des,
                            },
                            "base_quantity": component_quantity,
                            "cost": 0,
                            "subtotal": 0
                        })
                    } else {
                        $.fn.notifyB({description: `Missing component information at row ${component_order}`}, 'failure');
                        has_error = true
                        return false
                    }
                }
            })

            if (has_error) return

            ProductModificationBOMPageFunction.LoadTableProductCurrentComponentList(init_component)
            ProductModificationBOMPageFunction.LoadTableProductAddedComponentList()
            pageElements.$confirm_initial_components_modal.modal('hide')
        })
        // space
        pageElements.$insert_component_btn.on('click', function () {
            UsualLoadPageFunction.AddTableRow(
                pageElements.$table_product_added_component,
                {}
            )
            let row_added = pageElements.$table_product_added_component.find('tbody tr:last-child')
            UsualLoadPageFunction.LoadProduct({
                element: row_added.find('.added-product'),
                data_url: pageElements.$script_url.attr('data-url-product-dd-list')
            })
        })
        $(document).on("change", '.added-product', function () {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            if (Object.keys(selected).length !== 0) {
                $(this).closest('tr').find('.added-product-code').text(selected?.['code'])
                $(this).closest('tr').find('.icon-collapse').attr('href', `.d2_${selected?.['id']}`)
                $(this).closest('tr').find('.icon-collapse').attr('aria-controls', `.d2_${selected?.['id']}`)
                $(this).closest('tr').find('.collapse').addClass(`d2_${selected?.['id']}`)
                $(this).closest('tr').find('.collapse span').text(selected?.['description'])
            }
        })
        $(document).on('click', '.delete-added-component-btn', function () {
            let rowId = $(this).closest('tr').find('.component-title').attr('data-component-id')
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
        // change money
        $(document).on("change", '.base-code', function () {
            pageVariables.current_product_modified['base_cost'] = Number($(this).attr('value') || 0)
            ProductModificationBOMPageFunction.CalculateModifiedCost()
        })
        $(document).on("change", '.component-quantity', function () {
            ProductModificationBOMPageFunction.CalculateSubtotal($(this).closest('tr'))
        })
        $(document).on("change", '.component-cost', function () {
            ProductModificationBOMPageFunction.CalculateSubtotal($(this).closest('tr'))
        })
    }
}
