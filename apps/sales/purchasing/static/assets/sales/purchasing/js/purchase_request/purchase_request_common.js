/**
 * Khai báo các element trong page
 */
class PurchaseRequestPageElements {
    constructor() {
        this.$script_url = $('#script-url')
        this.$script_trans = $('#script-trans')
        this.$request_for = $('#request-for')
        this.$transaction_code = $('#transaction-code')
        this.$title = $('#title')
        this.$supplier = $('#supplier')
        this.$contact = $('#contact')
        this.$note = $('#note')
        this.$pr_status = $('#pr-status')
        this.$date_delivery = $('#date-delivery')
        // for so
        this.$table_so_product_line_detail = $('#table-so-product-line-detail')
        this.$modal_select_so_product = $('#modal-select-so-product')
        this.$table_so = $('#table-so')
        this.$table_so_product = $('#table-so-product')
        this.$btn_select_so_product = $('#btn-select-so-product')
        this.$so_filter_by_customer = $('#so-filter-by-customer')
        this.$btn_change_sale_order = $('#btn-change-so')
        // for sf
        this.$table_product_stock_free_line_detail = $('#table-product-stock-free-line-detail')
        this.$btn_add_stock_free_product = $('#btn-add-stock-free-product')
        // for fa
        this.$table_product_fixed_asset_line_detail = $('#table-product-fixed-asset-line-detail')
        this.$btn_add_fixed_asset_product = $('#btn-add-fixed-asset-product')
        // for dp
        this.$table_dp_product_line_detail = $('#table-dp-product-line-detail')
        this.$modal_select_dp_product = $('#modal-select-dp-product')
        this.$table_dp = $('#table-dp')
        this.$table_dp_product = $('#table-dp-product')
        this.$btn_select_dp_product = $('#btn-select-dp-product')
        this.$btn_change_dp = $('#btn-change-dp')
        // for svo
        this.$table_svo_product_line_detail = $('#table-svo-product-line-detail')
        this.$modal_select_svo_product = $('#modal-select-svo-product')
        this.$table_svo = $('#table-svo')
        this.$table_svo_product = $('#table-svo-product')
        this.$btn_select_svo_product = $('#btn-select-svo-product')
        this.$svo_filter_by_customer = $('#svo-filter-by-customer')
        this.$btn_change_svo = $('#btn-change-svo')
    }
}
const pageElements = new PurchaseRequestPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class PurchaseRequestPageVariables {
    constructor() {
        this.emp_current_id = JSON.parse($('#employee_current').text() || '{}')?.['id']
        this.is_all_so = false
        this.current_so_id = null
        this.current_dp_id = null
        this.current_svo_id = null
    }
}
const pageVariables = new PurchaseRequestPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class PurchaseRequestPageFunction {
    static LoadLineDetailTable($table, data_list=[], option='create') {
        $table.DataTable().clear().destroy()
        $table.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span data-so-product-id="${row?.['sale_order_product_id'] || ''}"
                                      data-svo-product-id="${row?.['service_order_product_id'] || ''}"
                                      data-product-id="${row?.['product_data']?.['id'] || ''}"
                                      class="badge badge-soft-secondary badge-sm product-detail">${row?.['product_data']?.['code'] || ''}</span>
                                <span class="ml-1">${row?.['product_data']?.['title'] || ''}</span>
                                <br><span class="small">${row?.['product_data']?.['description'] || ''}</span>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="request-number">${row?.['quantity'] || 0}</span>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span data-uom-id="${row?.['uom_data']?.['id'] || ''}" class="product-uom">${row?.['uom_data']?.['title'] || ''}</span>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money unit-price" value="${row?.['unit_price'] || 0}">`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 tax"></select>`;
                    }
                },
                {
                    className: 'w-15 text-right',
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money text-right subtotal-price" disabled readonly value="${row?.['sub_total_price'] || 0}">`
                    }
                },
            ],
            initComplete: function () {
                $table.find('tbody tr').each(function (index) {
                    UsualLoadPageFunction.LoadTax({
                        element: $(this).find('.tax'),
                        data: data_list[index]?.['tax_data'] || {},
                        data_url: pageElements.$script_url.attr('data-url-tax')
                    })
                })
            }
        });
    }
    static LoadLineDetailTableManual($table, data_list=[], option='create') {
        $table.DataTable().clear().destroy()
        $table.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 product-detail"></select>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="small product-des-detail">${row?.['description'] || ''}</span>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} type="number" class="form-control request-number" value="${row?.['quantity'] || 0}">`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 product-uom"></select>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money unit-price" value="${row?.['unit_price'] || 0}">`
                    }
                },
                {
                    className: 'w-15',
                    render: () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 tax"></select>`;
                    }
                },
                {
                    className: 'w-15 text-right',
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money text-right subtotal-price" disabled readonly value="${row?.['sub_total_price'] || 0}">`
                    }
                },
                {
                    className: 'w-5 text-right',
                    'render': () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''} type='button' class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs btn-del-line-detail">
                                        <span class="icon"><i class="fas fa-trash"></i></span>
                                    </button>`;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    $table.find('tbody tr').each(function (index) {
                        UsualLoadPageFunction.LoadProduct({
                            element: $(this).find('.product-detail'),
                            data: data_list[index]?.['product_data'] || {},
                            data_url: pageElements.$script_url.attr('data-url-product')
                        })
                        UsualLoadPageFunction.LoadUOM({
                            element: $(this).find('.product-uom'),
                            data: data_list[index]?.['uom_data'] || {},
                            data_params: {'group_id': data_list[index]?.['uom_group_id']?.['group_id']},
                            data_url: pageElements.$script_url.attr('data-url-uom')
                        })
                        UsualLoadPageFunction.LoadTax({
                            element: $(this).find('.tax'),
                            data: data_list[index]?.['tax_data'] || {},
                            data_url: pageElements.$script_url.attr('data-url-tax')
                        })
                    })
                }
            }
        });
    }
    static LoadSaleOrderTable() {
        $('#self-so').prop('hidden', pageVariables.is_all_so)
        $('#all-so').prop('hidden', !pageVariables.is_all_so)
        pageElements.$table_so.DataTable().clear().destroy()
        pageElements.$table_so.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollY: '45vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.$table_so.attr('data-url'),
                data: pageVariables.is_all_so ? {'customer_id': pageElements.$so_filter_by_customer.val()} : {'customer_id': pageElements.$so_filter_by_customer.val(), 'employee_inherit_id': pageVariables.emp_current_id},
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('sale_order_list')) {
                        let sale_order_list = [];
                        resp.data['sale_order_list'].map(function (item) {
                            if (item?.['is_create_purchase_request']) {
                                sale_order_list.push(item);
                            }
                        })
                        return sale_order_list;
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input type="radio" name="radioSaleOrder" class="form-check-input inp-check-so" data-id="${row?.['id']}"/></span>`
                    }
                },
                {
                    className: 'w-90',
                    render: (data, type, row) => {
                        let group = row?.['employee_inherit']?.['group']?.['title']
                        return `<span class="badge badge-soft-primary mr-1 so-code">${row?.['code']}</span><span class="text-primary">${row?.['title']}</span>
                                <br><span class="text-muted">${row?.['customer_data']?.['name']}</span>
                                <br><span class="text-blue">${row?.['employee_inherit']?.['full_name']} ${group ? `(${group})` : ''}</span>`
                    }
                }
            ],
        });
    }
    static LoadSaleOrderProductTable(sale_order_id=null) {
        const table_cfg = [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-45',
                render: (data, type, row) => {
                    return `<span data-so-product-id="${row?.['id']}"
                              data-product='${JSON.stringify(row?.['product_data'] || {})}'
                              data-uom='${JSON.stringify(row?.['uom_data'] || {})}'
                              data-tax='${JSON.stringify(row?.['tax_data'] || {})}'
                              class="badge badge-sm badge-soft-primary product-span"
                        >${row?.['product_data']?.['code']}</span>
                        <br><span class="text-muted">${row?.['product_data']?.['title'] || ''}</span>
                        <br><span class="text-muted small">${row?.['product_data']?.['description'] || ''}</span>`
                }
            },
            {
                className: 'w-35',
                render: (data, type, row) => {
                    return `<span class="mr-1">${$.fn.gettext('Ordered')}:</span><span class="quantity-span mr-1">${row?.['product_quantity'] || 0}</span><span>${row?.['uom_data']?.['title'] || ''}</span>
                            <br><span class="mr-1">${$.fn.gettext('Requested')}:</span><span class="requested-span mr-1">${parseFloat(row?.['product_quantity'] || 0) - parseFloat(row?.['remain_for_purchase_request'] || 0)}</span><span>${row?.['uom_data']?.['title'] || ''}</span>
                            <br><span class="mr-1">${$.fn.gettext('Remain')}:</span><span class="remain-span mr-1">${row?.['remain_for_purchase_request'] || 0}</span><span>${row?.['uom_data']?.['title'] || ''}</span>`
                }
            },
            {
                className: 'text-center w-15',
                render: (data, type, row) => {
                    return `<input type="number" class="form-control text-center request-number-input" value="0" min="0" max="${parseFloat(row?.['remain_for_purchase_request'] || 0)}">`
                }
            }
        ]
        pageElements.$table_so_product.DataTable().clear().destroy()
        if (!sale_order_id) {
            pageElements.$table_so_product.DataTableDefault({
                styleDom: 'hide-foot',
                rowIdx: true,
                paging: false,
                scrollY: '45vh',
                scrollX: true,
                scrollCollapse: true,
                data: [],
                columns: table_cfg,
            });
        }
        else {
            pageElements.$table_so_product.DataTableDefault({
                useDataServer: true,
                styleDom: 'hide-foot',
                rowIdx: true,
                paging: false,
                scrollY: '45vh',
                scrollX: true,
                scrollCollapse: true,
                ajax: {
                    url: pageElements.$table_so_product.attr('data-url').replace('0', sale_order_id),
                    data: {},
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('so_product_list')) {
                            return resp.data['so_product_list']?.['product_data'] || [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: table_cfg,
            });
        }
    }
    static LoadDistributionTable() {
        pageElements.$table_dp.DataTable().clear().destroy()
        pageElements.$table_dp.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollY: '45vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.$table_dp.attr('data-url'),
                data: {},
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('distribution_plan_list')) {
                        return resp.data['distribution_plan_list'].filter(item => item?.['is_expired'] === false);
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input type="radio" name="radioDistributionPlan" class="form-check-input inp-check-dp" data-id="${row?.['id']}"/></span>`
                    }
                },
                {
                    className: 'w-90',
                    render: (data, type, row) => {
                        let group = row?.['employee_inherit']?.['group']?.['title']
                        return `<span class="badge badge-soft-primary mr-1 dp-code">${row?.['code']}</span><span class="text-primary">${row?.['title']}</span>
                                <br><span class="text-blue">${row?.['employee_inherit']?.['full_name']} ${group ? `(${group})` : ''}</span>`
                    }
                }
            ],
        });
    }
    static LoadDistributionProductTable(distribution_id=null) {
        const table_cfg = [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-45',
                render: (data, type, row) => {
                    return `<span data-product='${JSON.stringify(row?.['product_data'] || {})}'
                              data-uom='${JSON.stringify(row?.['uom_data'] || {})}'
                              class="badge badge-sm badge-soft-primary product-span"
                        >${row?.['product_data']?.['code']}</span>
                        <br><span class="text-muted">${row?.['product_data']?.['title'] || ''}</span>
                        <br><span class="text-muted small">${row?.['product_data']?.['description'] || ''}</span>`
                }
            },
            {
                className: 'w-35',
                render: (data, type, row) => {
                    let planned_quantity = parseFloat(row?.['expected_number']) * parseFloat(row?.['no_of_month'])
                    let requested_quantity = parseFloat(row?.['purchase_request_number'])
                    let remain_quantity = (parseFloat(row?.['expected_number']) * parseFloat(row?.['no_of_month'])) - parseFloat(row?.['purchase_request_number'])
                    return `<span class="mr-1">${$.fn.gettext('Ordered')}:</span><span class="quantity-span mr-1">${planned_quantity}</span><span>${row?.['uom_data']?.['title'] || ''}</span>
                    <br><span class="mr-1">${$.fn.gettext('Requested')}:</span><span class="requested-span mr-1">${requested_quantity}</span><span>${row?.['uom_data']?.['title'] || ''}</span>
                    <br><span class="mr-1">${$.fn.gettext('Remain')}:</span><span class="remain-span mr-1">${remain_quantity >= 0 ? remain_quantity : '(' + remain_quantity * (-1) + ')'}</span><span>${row?.['uom_data']?.['title'] || ''}</span>`
                }
            },
            {
                className: 'text-center w-15',
                render: (data, type, row) => {
                    return `<input type="number" class="form-control text-center request-number-input" min="0" value="0">`
                }
            }
        ]
        pageElements.$table_dp_product.DataTable().clear().destroy()
        if (!distribution_id) {
            pageElements.$table_dp_product.DataTableDefault({
                rowIdx: true,
                paging: false,
                scrollY: '45vh',
                scrollX: true,
                scrollCollapse: true,
                data: [],
                columns: table_cfg
            });
        }
        else {
            pageElements.$table_dp_product.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                paging: false,
                scrollY: '45vh',
                scrollX: true,
                scrollCollapse: true,
                ajax: {
                    url: pageElements.$table_dp_product.attr('data-url').replace('/0', `/${distribution_id}`),
                    data: {},
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('dp_product_list')) {
                            return [resp.data['dp_product_list']]
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: table_cfg
            });
        }
    }
    static LoadServiceOrderTable() {
        pageElements.$table_svo.DataTable().clear().destroy()
        pageElements.$table_svo.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollY: '45vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.$table_svo.attr('data-url'),
                data: {},
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('service_order_list')) {
                        return resp.data['service_order_list'];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input type="radio" name="radioServiceOrder" class="form-check-input inp-check-svo" data-id="${row?.['id']}"/></span>`
                    }
                },
                {
                    className: 'w-90',
                    render: (data, type, row) => {
                        let group = row?.['employee_inherit']?.['group']?.['title']
                        return `<span class="badge badge-soft-primary mr-1 svo-code">${row?.['code']}</span><span class="text-primary">${row?.['title']}</span>
                                <br><span class="text-muted">${row?.['customer_data']?.['name']}</span>
                                <br><span class="text-blue">${row?.['employee_inherit']?.['full_name']} ${group ? `(${group})` : ''}</span>`
                    }
                }
            ],
        });
    }
    static LoadServiceOrderProductTable(service_order_id=null) {
        const table_cfg = [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-45',
                render: (data, type, row) => {
                    return `<span data-svo-product-id="${row?.['id']}"
                              data-product='${JSON.stringify(row?.['product_data'] || {})}'
                              data-uom='${JSON.stringify(row?.['uom_data'] || {})}'
                              data-tax='${JSON.stringify(row?.['tax_data'] || {})}'
                              class="badge badge-sm badge-soft-primary product-span"
                        >${row?.['product_data']?.['code']}</span>
                        <br><span class="text-muted">${row?.['product_data']?.['title'] || ''}</span>
                        <br><span class="text-muted small">${row?.['product_data']?.['description'] || ''}</span>`
                }
            },
            {
                className: 'w-35',
                render: (data, type, row) => {
                    return `<span class="mr-1">${$.fn.gettext('Ordered')}:</span><span class="quantity-span mr-1">${row?.['product_quantity'] || 0}</span><span>${row?.['uom_data']?.['title'] || ''}</span>
                            <br><span class="mr-1">${$.fn.gettext('Requested')}:</span><span class="requested-span mr-1">${parseFloat(row?.['product_quantity'] || 0) - parseFloat(row?.['remain_for_purchase_request'] || 0)}</span><span>${row?.['uom_data']?.['title'] || ''}</span>
                            <br><span class="mr-1">${$.fn.gettext('Remain')}:</span><span class="remain-span mr-1">${row?.['remain_for_purchase_request'] || 0}</span><span>${row?.['uom_data']?.['title'] || ''}</span>`
                }
            },
            {
                className: 'text-center w-15',
                render: (data, type, row) => {
                    return `<input type="number" class="form-control text-center request-number-input" value="0" min="0" max="${parseFloat(row?.['remain_for_purchase_request'] || 0)}">`
                }
            }
        ]
        pageElements.$table_svo_product.DataTable().clear().destroy()
        if (!service_order_id) {
            pageElements.$table_svo_product.DataTableDefault({
                rowIdx: true,
                paging: false,
                scrollY: '45vh',
                scrollX: true,
                scrollCollapse: true,
                data: [],
                columns: table_cfg
            });
        }
        else {
            pageElements.$table_svo_product.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                paging: false,
                scrollY: '45vh',
                scrollX: true,
                scrollCollapse: true,
                ajax: {
                    url: pageElements.$table_svo_product.attr('data-url').replace('/0', `/${service_order_id}`),
                    data: {},
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('svo_product_list')) {
                            return resp.data['svo_product_list']?.['product_data'] || [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: table_cfg
            });
        }
    }
    static CalculateSumLineDetail(row) {
        let table_line_detail = row.closest('table')
        let sum_pre_tax = 0
        let sum_tax = 0
        let sum_after_tax = 0
        table_line_detail.find('tbody tr').each(function () {
            let row = $(this)
            let quantity = parseFloat(row.find('.request-number').text()) || parseFloat(row.find('.request-number').val()) || 0
            let unit_price = parseFloat(row.find('.unit-price').attr('value') || 0)
            let tax_rate = row.find('.tax').val() ? SelectDDControl.get_data_from_idx(row.find('.tax'), row.find('.tax').val())?.['rate'] : 0
            tax_rate = tax_rate || 0
            let subtotal = quantity * unit_price
            let after_tax = subtotal + (subtotal * tax_rate/100)
            row.find('.subtotal-price').attr('value', subtotal + (subtotal * tax_rate / 100))

            sum_pre_tax += subtotal
            sum_after_tax += after_tax
            sum_tax += subtotal * tax_rate/100
        })
        $('#input-product-pretax-amount').attr('value', sum_pre_tax)
        $('#input-product-taxes').attr('value', sum_tax)
        $('#input-product-total').attr('value', sum_after_tax)
        $.fn.initMaskMoney2()
    }
}

/**
 * Khai báo các hàm chính
 */
class PurchaseRequestHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))
        frm.dataForm['request_for'] = pageElements.$request_for.val()
        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['delivered_date'] = moment(pageElements.$date_delivery.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['supplier'] = pageElements.$supplier.val() || null
        frm.dataForm['contact'] = pageElements.$contact.val() || null
        frm.dataForm['note'] = pageElements.$note.val()
        frm.dataForm['pretax_amount'] = parseFloat($('#input-product-pretax-amount').attr('value') || 0)
        frm.dataForm['taxes'] = parseFloat($('#input-product-taxes').attr('value') || 0)
        frm.dataForm['total_price'] = parseFloat($('#input-product-total').attr('value') || 0)
        let purchase_request_product_datas = []
        if (pageElements.$request_for.val() === '0') {
            frm.dataForm['sale_order'] = pageVariables.current_so_id || null
            pageElements.$table_so_product_line_detail.find('tbody tr').each(function () {
                purchase_request_product_datas.push({
                    'sale_order_product': $(this).find('.product-detail').attr('data-so-product-id') || null,
                    'product': $(this).find('.product-detail').attr('data-product-id') || null,
                    'uom': $(this).find('.product-uom').attr('data-uom-id') || null,
                    'tax': $(this).find('.tax').val() || null,
                    'quantity': parseFloat($(this).find('.request-number').text() || 0),
                    'unit_price': parseFloat($(this).find('.unit-price').attr('value') || 0),
                    'sub_total_price': parseFloat($(this).find('.subtotal-price').attr('value') || 0),
                })
            })
        }
        else if (pageElements.$request_for.val() === '1') {
            $('#table-product-stock-free-line-detail tbody tr').each(function () {
                purchase_request_product_datas.push({
                    'product': $(this).find('.product-detail').val() || null,
                    'uom': $(this).find('.product-uom').val() || null,
                    'tax': $(this).find('.tax').val() || null,
                    'quantity': parseFloat($(this).find('.request-number').val() || 0),
                    'unit_price': parseFloat($(this).find('.unit-price').attr('value') || 0),
                    'sub_total_price': parseFloat($(this).find('.subtotal-price').attr('value') || 0),
                })
            })
        }
        else if (pageElements.$request_for.val() === '2') {
            $('#table-product-fixed-asset-line-detail tbody tr').each(function () {
                purchase_request_product_datas.push({
                    'product': $(this).find('.product-detail').val() || null,
                    'uom': $(this).find('.product-uom').val() || null,
                    'tax': $(this).find('.tax').val() || null,
                    'quantity': parseFloat($(this).find('.request-number').val() || 0),
                    'unit_price': parseFloat($(this).find('.unit-price').attr('value') || 0),
                    'sub_total_price': parseFloat($(this).find('.subtotal-price').attr('value') || 0),
                })
            })
        }
        else if (pageElements.$request_for.val() === '3') {
            frm.dataForm['distribution_plan'] = pageVariables.current_dp_id || null
            $('#table-dp-product-line-detail tbody tr').each(function () {
                purchase_request_product_datas.push({
                    'product': $(this).find('.product-detail').attr('data-product-id') || null,
                    'uom': $(this).find('.product-uom').attr('data-uom-id') || null,
                    'tax': $(this).find('.tax').val() || null,
                    'quantity': parseFloat($(this).find('.request-number').text() || 0),
                    'unit_price': parseFloat($(this).find('.unit-price').attr('value') || 0),
                    'sub_total_price': parseFloat($(this).find('.subtotal-price').attr('value') || 0),
                })
            })
        }
        else if (pageElements.$request_for.val() === '4') {
            frm.dataForm['service_order'] = pageVariables.current_svo_id || null
            $('#table-svo-product-line-detail tbody tr').each(function () {
                purchase_request_product_datas.push({
                    'service_order_product': $(this).find('.product-detail').attr('data-svo-product-id') || null,
                    'product': $(this).find('.product-detail').attr('data-product-id') || null,
                    'uom': $(this).find('.product-uom').attr('data-uom-id') || null,
                    'tax': $(this).find('.tax').val() || null,
                    'quantity': parseFloat($(this).find('.request-number').text() || 0),
                    'unit_price': parseFloat($(this).find('.unit-price').attr('value') || 0),
                    'sub_total_price': parseFloat($(this).find('.subtotal-price').attr('value') || 0),
                })
            })
        }
        frm.dataForm['purchase_request_product_datas'] = purchase_request_product_datas
        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        // budget line data
        frm.dataForm['budget_line_data'] = BudgetControl.setupSubmitTblBudget();
        return frm
    }
    static LoadDetailPR(option) {
    let url_loaded = $('#frm-detail-pr').attr('data-url');
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['purchase_request'];
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                pageElements.$request_for.val(data?.['request_for'])
                pageElements.$title.val(data?.['title'])
                UsualLoadPageFunction.LoadSupplier({
                    element: pageElements.$supplier,
                    data: data?.['supplier'] || null,
                    data_url: pageElements.$supplier.attr('data-url')
                })
                UsualLoadPageFunction.LoadContact({
                    element: pageElements.$contact,
                    data: data?.['contact'] || null,
                    data_url: pageElements.$contact.attr('data-url')
                })
                pageElements.$note.val(data?.['note'])
                pageElements.$date_delivery.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                pageElements.$pr_status.val(data?.['purchase_status'])
                $('#input-product-pretax-amount').attr('value', data?.['pretax_amount'] || 0)
                $('#input-product-taxes').attr('value', data?.['taxes'] || 0)
                $('#input-product-total').attr('value', data?.['total_price'] || 0)
                if (data?.['request_for'] === 0) {
                    $('.for-sale-order-request').prop('hidden', false)
                    pageVariables.current_so_id = data?.['sale_order']?.['id']
                    pageElements.$transaction_code.val(data?.['sale_order']?.['code'])
                    PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_so_product_line_detail, data?.['purchase_request_product_datas'] || [], option)
                }
                else if (data?.['request_for'] === 1) {
                    $('.for-stock-free-request').prop('hidden', false)
                    PurchaseRequestPageFunction.LoadLineDetailTableManual(pageElements.$table_product_stock_free_line_detail, data?.['purchase_request_product_datas'] || [], option)
                }
                else if (data?.['request_for'] === 2) {
                    $('.for-fixed-asset-request').prop('hidden', false)
                    PurchaseRequestPageFunction.LoadLineDetailTableManual(pageElements.$table_product_fixed_asset_line_detail, data?.['purchase_request_product_datas'] || [], option)
                }
                else if (data?.['request_for'] === 3) {
                    $('.for-distribution-request').prop('hidden', false)
                    pageVariables.current_dp_id = data?.['distribution_plan']?.['id']
                    pageElements.$transaction_code.val(data?.['distribution_plan']?.['code'])
                    PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_dp_product_line_detail, data?.['purchase_request_product_datas'] || [], option)
                }
                else if (data?.['request_for'] === 4) {
                    $('.for-service-order-request').prop('hidden', false)
                    pageVariables.current_svo_id = data?.['service_order']?.['id']
                    pageElements.$transaction_code.val(data?.['service_order']?.['code'])
                    PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_svo_product_line_detail, data?.['purchase_request_product_datas'] || [], option)
                }

                new $x.cls.file($('#attachment')).init({
                    enable_download: option === 'detail',
                    enable_edit: option !== 'detail',
                    data: data.attachment,
                    name: 'attachment'
                })

                UsualLoadPageFunction.DisablePage(option === 'detail')

                $.fn.initMaskMoney2()

                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                // budget line data
                BudgetControl.dtbRenderDetail(data?.['budget_line_data'] ? data?.['budget_line_data'] : []);
            }
        })
}
}

/**
 * Khai báo các Event
 */
class PurchaseRequestEventHandler {
    static InitPageEven() {
        pageElements.$request_for.on('change', function () {
            $('.for-sale-order-request, .for-stock-free-request, .for-fixed-asset-request, .for-distribution-request, .for-service-order-request').prop('hidden', true)
            pageElements.$transaction_code.val('')
            UsualLoadPageFunction.LoadSupplier({
                element: pageElements.$supplier,
                data_url: pageElements.$supplier.attr('data-url')
            })
            UsualLoadPageFunction.LoadContact({
                element: pageElements.$contact,
                data_url: pageElements.$contact.attr('data-url')
            })
            UsualLoadPageFunction.LoadDate({element: pageElements.$date_delivery})
            if (pageElements.$request_for.val() === '0') {
                $('.for-sale-order-request').prop('hidden', false)
                PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_so_product_line_detail, [])

                let dataParam = {}
                let pr_config = $.fn.callAjax2({
                    url: pageElements.$script_url.attr('data-url-pr-config-so'),
                    data: dataParam,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('config')) {
                            return data?.['config']?.['employee_reference'] ? data?.['config']?.['employee_reference'] : [];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([pr_config]).then(
                    (results) => {
                        pageVariables.is_all_so = (results[0] || []).some(emp => emp?.['employee']?.['id'] === pageVariables.emp_current_id)
                        PurchaseRequestPageFunction.LoadSaleOrderTable()
                        PurchaseRequestPageFunction.LoadSaleOrderProductTable()
                        UsualLoadPageFunction.LoadCustomer({
                            element: pageElements.$so_filter_by_customer,
                            data_url: pageElements.$so_filter_by_customer.attr('data-url')
                        })
                    })
            }
            else if (pageElements.$request_for.val() === '1') {
                $('.for-stock-free-request').prop('hidden', false)
                PurchaseRequestPageFunction.LoadLineDetailTableManual(pageElements.$table_product_stock_free_line_detail, [])
            }
            else if (pageElements.$request_for.val() === '2') {
                $('.for-fixed-asset-request').prop('hidden', false)
                PurchaseRequestPageFunction.LoadLineDetailTableManual(pageElements.$table_product_fixed_asset_line_detail, [])
            }
            else if (pageElements.$request_for.val() === '3') {
                $('.for-distribution-request').prop('hidden', false)
                PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_dp_product_line_detail, [])
                PurchaseRequestPageFunction.LoadDistributionTable()
                PurchaseRequestPageFunction.LoadDistributionProductTable()
            }
            else if (pageElements.$request_for.val() === '4') {
                $('.for-service-order-request').prop('hidden', false)
                PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_svo_product_line_detail, [])
                PurchaseRequestPageFunction.LoadServiceOrderTable()
                PurchaseRequestPageFunction.LoadServiceOrderProductTable()
                UsualLoadPageFunction.LoadCustomer({
                    element: pageElements.$svo_filter_by_customer,
                    data_url: pageElements.$svo_filter_by_customer.attr('data-url')
                })
            }
        })
        pageElements.$supplier.on('change', function () {
            let selected = SelectDDControl.get_data_from_idx(pageElements.$supplier, pageElements.$supplier.val())
            if (selected) {
                pageElements.$contact.empty()
                UsualLoadPageFunction.LoadContact({
                    element: pageElements.$contact,
                    data: selected?.['owner'],
                    data_url: pageElements.$contact.attr('data-url')
                })
            }
        })
        pageElements.$btn_change_sale_order.on('click', function () {
            $('.for-sale-order-request, .for-stock-free-request, .for-fixed-asset-request, .for-distribution-request, .for-service-order-request').prop('hidden', true)
            $('.for-sale-order-request').prop('hidden', false)
            let dataParam = {}
            let pr_config = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-pr-config-so'),
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('config')) {
                        return data?.['config']?.['employee_reference'] ? data?.['config']?.['employee_reference'] : [];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([pr_config]).then(
                (results) => {
                    pageVariables.is_all_so = (results[0] || []).some(emp => emp?.['employee']?.['id'] === pageVariables.emp_current_id)
                    PurchaseRequestPageFunction.LoadSaleOrderTable()
                    PurchaseRequestPageFunction.LoadSaleOrderProductTable()
                })
        })
        pageElements.$so_filter_by_customer.on('change', function () {
            PurchaseRequestPageFunction.LoadSaleOrderTable()
            PurchaseRequestPageFunction.LoadSaleOrderProductTable()
        })
        $(document).on('change', '.inp-check-so', function () {
            $(this).closest('table').find('tr').removeClass('bg-secondary-light-5');
            $(this).closest('tr').addClass('bg-secondary-light-5');
            PurchaseRequestPageFunction.LoadSaleOrderProductTable($(this).attr('data-id'))
        })
        pageElements.$btn_select_so_product.on('click', function () {
            let request_product_data = []
            let flag = true
            pageElements.$table_so_product.find('tbody tr').each(function () {
                let limit_number = parseFloat($(this).find('.remain-span').text() || 0)
                let request_number = parseFloat($(this).find('.request-number-input').val() || 0)

                if (request_number <= limit_number) {
                    request_product_data.push({
                        'sale_order_product_id': $(this).find('.product-span').attr('data-so-product-id'),
                        'product_data': JSON.parse($(this).find('.product-span').attr('data-product') || '{}'),
                        'uom_data': JSON.parse($(this).find('.product-span').attr('data-uom') || '{}'),
                        'tax_data': JSON.parse($(this).find('.product-span').attr('data-tax') || '{}'),
                        'quantity': request_number
                    })
                }
                else {
                    if (request_number) {
                        $.fn.notifyB({description: $.fn.gettext('Request number is invalid!')}, 'failure')
                        flag = false
                        request_product_data = []
                    }
                }
            })
            if (flag) {
                PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_so_product_line_detail, request_product_data)
                $('.inp-check-so').each(function () {
                    if ($(this).prop('checked')) {
                        pageVariables.current_so_id = $(this).attr('data-id')
                        pageElements.$transaction_code.val($(this).closest('tr').find('.so-code').text())
                    }
                })
                pageElements.$modal_select_so_product.modal('hide')
            }
        })
        pageElements.$btn_change_dp.on('click', function () {
            $('.for-sale-order-request, .for-stock-free-request, .for-fixed-asset-request, .for-distribution-request, .for-service-order-request').prop('hidden', true)
            $('.for-distribution-request').prop('hidden', false)
            PurchaseRequestPageFunction.LoadDistributionTable()
            PurchaseRequestPageFunction.LoadDistributionProductTable()
        })
        pageElements.$btn_change_svo.on('click', function () {
            $('.for-sale-order-request, .for-stock-free-request, .for-fixed-asset-request, .for-distribution-request, .for-service-order-request').prop('hidden', true)
            $('.for-service-order-request').prop('hidden', false)
            PurchaseRequestPageFunction.LoadServiceOrderTable()
            PurchaseRequestPageFunction.LoadServiceOrderProductTable()
        })
        $(document).on('change', '.inp-check-svo', function () {
            $(this).closest('table').find('tr').removeClass('bg-secondary-light-5');
            $(this).closest('tr').addClass('bg-secondary-light-5');
            PurchaseRequestPageFunction.LoadServiceOrderProductTable($(this).attr('data-id'))
        })
        pageElements.$btn_select_svo_product.on('click', function () {
            let request_product_data = []
            let flag = true
            pageElements.$table_svo_product.find('tbody tr').each(function () {
                let limit_number = parseFloat($(this).find('.remain-span').text() || 0)
                let request_number = parseFloat($(this).find('.request-number-input').val() || 0)

                if (request_number <= limit_number) {
                    request_product_data.push({
                        'service_order_product_id': $(this).find('.product-span').attr('data-svo-product-id'),
                        'product_data': JSON.parse($(this).find('.product-span').attr('data-product') || '{}'),
                        'uom_data': JSON.parse($(this).find('.product-span').attr('data-uom') || '{}'),
                        'tax_data': JSON.parse($(this).find('.product-span').attr('data-tax') || '{}'),
                        'quantity': request_number
                    })
                }
                else {
                    if (request_number) {
                        $.fn.notifyB({description: $.fn.gettext('Request number is invalid!')}, 'failure')
                        flag = false
                        request_product_data = []
                    }
                }
            })
            if (flag) {
                PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_svo_product_line_detail, request_product_data)
                $('.inp-check-svo').each(function () {
                    if ($(this).prop('checked')) {
                        pageVariables.current_svo_id = $(this).attr('data-id')
                        pageElements.$transaction_code.val($(this).closest('tr').find('.svo-code').text())
                    }
                })
                pageElements.$modal_select_svo_product.modal('hide')
            }
        })
        $(document).on('change', '.inp-check-dp', function () {
            $(this).closest('table').find('tr').removeClass('bg-secondary-light-5');
            $(this).closest('tr').addClass('bg-secondary-light-5');
            PurchaseRequestPageFunction.LoadDistributionProductTable($(this).attr('data-id'))
        })
        pageElements.$btn_select_dp_product.on('click', function () {
            let request_product_data = []
            let flag = true
            pageElements.$table_dp_product.find('tbody tr').each(function () {
                let limit_number = parseFloat($(this).find('.remain-span').text() || 0)
                let request_number = parseFloat($(this).find('.request-number-input').val() || 0)

                if (request_number <= limit_number) {
                    request_product_data.push({
                        'product_data': JSON.parse($(this).find('.product-span').attr('data-product') || '{}'),
                        'uom_data': JSON.parse($(this).find('.product-span').attr('data-uom') || '{}'),
                        'tax_data': JSON.parse($(this).find('.product-span').attr('data-tax') || '{}'),
                        'quantity': request_number
                    })
                }
                else {
                    if (request_number) {
                        $.fn.notifyB({description: $.fn.gettext('Request number is invalid!')}, 'failure')
                        flag = false
                        request_product_data = []
                    }
                }
            })
            if (flag) {
                PurchaseRequestPageFunction.LoadLineDetailTable(pageElements.$table_dp_product_line_detail, request_product_data)
                $('.inp-check-dp').each(function () {
                    if ($(this).prop('checked')) {
                        pageVariables.current_dp_id = $(this).attr('data-id')
                        pageElements.$transaction_code.val($(this).closest('tr').find('.dp-code').text())
                    }
                })
                pageElements.$modal_select_dp_product.modal('hide')
            }
        })
        pageElements.$btn_add_stock_free_product.on('click', function () {
            UsualLoadPageFunction.AddTableRow(pageElements.$table_product_stock_free_line_detail)
            let row_added = pageElements.$table_product_stock_free_line_detail.find('tbody tr:last-child')
            UsualLoadPageFunction.LoadProduct({
                element: row_added.find('.product-detail'),
                data_url: pageElements.$script_url.attr('data-url-product')
            })
            UsualLoadPageFunction.LoadTax({
                element: row_added.find('.tax'),
                data_url: pageElements.$script_url.attr('data-url-tax')
            })
        })
        pageElements.$btn_add_fixed_asset_product.on('click', function () {
            UsualLoadPageFunction.AddTableRow(pageElements.$table_product_fixed_asset_line_detail)
            let row_added = pageElements.$table_product_fixed_asset_line_detail.find('tbody tr:last-child')
            UsualLoadPageFunction.LoadProduct({
                element: row_added.find('.product-detail'),
                data_url: pageElements.$script_url.attr('data-url-product')
            })
            UsualLoadPageFunction.LoadTax({
                element: row_added.find('.tax'),
                data_url: pageElements.$script_url.attr('data-url-tax')
            })
        })
        $(document).on("click", '.btn-del-line-detail', function () {
            UsualLoadPageFunction.DeleteTableRow(
                $(this).closest('table'),
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
            PurchaseRequestPageFunction.CalculateSumLineDetail($(this).closest('tr'))
        })
        $(document).on('change', '.product-detail', function () {
            let product_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            $(this).closest('tr').find('.product-des-detail').text(product_selected?.['description'] || '')
            UsualLoadPageFunction.LoadUOM({
                element: $(this).closest('tr').find('.product-uom'),
                data: product_selected?.['purchase_information']?.['default_uom'] || {},
                data_params: {'group_id': product_selected?.['general_uom_group']?.['id']},
                data_url: pageElements.$script_url.attr('data-url-uom')
            })
            UsualLoadPageFunction.LoadTax({
                element: $(this).closest('tr').find('.tax'),
                data: product_selected?.['purchase_information']?.['tax'] || {},
                data_url: pageElements.$script_url.attr('data-url-tax')
            })
        })
        $(document).on('change', '.unit-price', function () {
            PurchaseRequestPageFunction.CalculateSumLineDetail($(this).closest('tr'))
        })
        $(document).on('change', '.request-number', function () {
            PurchaseRequestPageFunction.CalculateSumLineDetail($(this).closest('tr'))
        })
        $(document).on('change', '.tax', function () {
            PurchaseRequestPageFunction.CalculateSumLineDetail($(this).closest('tr'))
        })
    }
}
