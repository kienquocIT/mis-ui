/**
 * Khai báo các element trong page
 */
class ARInvoicePageElements {
    constructor() {
        // info
        this.$script_url = $('#script-url')
        this.$customer_select_btn = $('#customer-select-btn')
        this.$customer_select_modal = $('#customer-select-modal')
        this.$accept_select_customer_btn = $('#accept-select-customer-btn')
        this.$customer_name = $('#customer-name')
        this.$table_select_customer = $('#table-select-customer')
        this.$tax_code = $('#tax_code')
        this.$view_tax_code_info = $('#view-tax-code-info')
        this.$billing_address = $('#billing-address')
        this.$buyer_name = $('#buyer-name')
        this.$invoice_exp = $('#invoice-exp')
        this.$invoice_sign = $('#invoice-sign')
        this.$invoice_number = $('#invoice-number')
        this.$invoice_date = $('#invoice-date')
        this.$title = $('#title')
        this.$sale_order = $('#sale-order')
        this.$lease_order = $('#lease-order')
        this.$view_payment_term_so = $('#view-payment-term-so')
        this.$view_payment_term_lo = $('#view-payment-term-lo')
        this.$payment_term_info_table = $('#payment-term-info-table')
        this.$invoice_method = $('#invoice-method')
        this.$bank_info = $('#bank-info')
        this.$posting_date = $('#posting-date')
        this.$document_date = $('#document-date')
        this.$note = $('#note')
        // tab
        this.$main_table = $('#main-table')
        this.$table_select_delivery = $('#table-select-delivery')
        this.$table_delivery_product = $('#table-delivery-product')
        this.$delivery_product_data_script = $('#delivery_product_data_script')
        this.$accept_delivery_product_btn = $('#accept-delivery-product-btn')
        this.$btn_select_from_delivery = $('#btn-select-from-delivery')
        this.$btn_add_optionally = $('#btn-add-optionally')
    }
}
const pageElements = new ARInvoicePageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class ARInvoicePageVariables {
    constructor() {
        this.invoice_signs = JSON.parse($('#invoice_signs').text() || '{}')
    }
}
const pageVariables = new ARInvoicePageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class ARInvoicePageFunction {
    // info
    static LoadCustomerTable() {
        pageElements.$table_select_customer.DataTable().clear().destroy()
        pageElements.$table_select_customer.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.$table_select_customer.attr('data-url') + '?full_info=true',
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('customer_list')) {
                        return data?.['customer_list'];
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
                                    <input type="radio"
                                    name="customer-selected-radio"
                                    class="form-check-input"
                                    data-customer='${JSON.stringify(row)}'/>
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
    static LoadSaleOrder(data) {
        pageElements.$sale_order.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$sale_order.attr('data-url') + `?customer_id=${pageElements.$customer_name.attr('data-id')}`,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp].filter(function (item) {
                    return item?.['has_not_ar_delivery'] === true
                });
            },
            templateResult: function(data) {
                let opp_code = data.data?.['opportunity']?.['code'] ? data.data?.['opportunity']?.['code'] : ''
                let ele = $('<div class="row"></div>');
                ele.append(`<div class="col-9"><span class="badge badge-soft-primary">${data.data?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['title']}</div>
                            <div class="col-3 text-right"><span class="badge badge-light" data-bs-toggle="tooltip" title="${data.data?.['opportunity']?.['title']}">${opp_code}</span></div>`);
                return ele;
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if (pageElements.$sale_order.val()) {
                pageElements.$btn_select_from_delivery.removeClass('disabled')
                pageElements.$btn_add_optionally.addClass('disabled')
            }
            else {
                pageElements.$btn_select_from_delivery.addClass('disabled')
                pageElements.$btn_add_optionally.removeClass('disabled')
            }
        })
    }
    static LoadLeaseOrder(data) {
        pageElements.$lease_order.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$lease_order.attr('data-url') + `?customer_id=${pageElements.$customer_name.attr('data-id')}`,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp].filter(function (item) {
                    return item?.['has_not_ar_delivery'] === true
                });
            },
            templateResult: function(data) {
                let opp_code = data.data?.['opportunity']?.['code'] ? data.data?.['opportunity']?.['code'] : ''
                let ele = $('<div class="row"></div>');
                ele.append(`<div class="col-9"><span class="badge badge-soft-primary">${data.data?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['title']}</div>
                            <div class="col-3 text-right"><span class="badge badge-light" data-bs-toggle="tooltip" title="${data.data?.['opportunity']?.['title']}">${opp_code}</span></div>`);
                return ele;
            },
            data: (data ? data : null),
            keyResp: 'lease_order_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if (pageElements.$lease_order.val()) {
                pageElements.$btn_select_from_delivery.removeClass('disabled')
                pageElements.$btn_add_optionally.addClass('disabled')
            }
            else {
                pageElements.$btn_select_from_delivery.addClass('disabled')
                pageElements.$btn_add_optionally.removeClass('disabled')
            }
        })
    }
    static LoadCompanyBankAccount(data) {
        pageElements.$bank_info.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$bank_info.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'bank_account_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    // tab
    static LoadDeliveryTable() {
        let root_url = pageElements.$script_url.attr('data-url-delivery-list')
        let param_key = pageElements.$sale_order.val() ? '?order_delivery__sale_order_id=' : '?order_delivery__lease_order_id='
        let order_id = pageElements.$sale_order.val() || pageElements.$lease_order.val() || ''
        pageElements.$table_select_delivery.DataTable().clear().destroy()
        pageElements.$table_select_delivery.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '30vh',
            scrollCollapse: true,
            ajax: {
                url: root_url + param_key + order_id,
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $('#select-delivery-offcanvas').offcanvas('show')
                        return resp.data?.['delivery_list'] ? resp.data?.['delivery_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-10',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        return `<span class="badge badge-primary">${row?.['code']}</span>`
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `${moment(row?.['actual_delivery_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}`
                    }
                },
                {
                    className: 'w-25 text-center',
                    render: (data, type, row) => {
                        return `${row?.['already'] ? `<i class="fas fa-check-circle text-success mr-1"></i>` + $.fn.gettext('Invoiced') : ''}
                                <div class="form-check" ${row?.['already'] ? 'hidden' : ''}>
                                    <input data-detail="${JSON.stringify(row?.['details'] || []).replace(/"/g, "&quot;")}" data-already="${row?.['already'] ? 1 : 0}" data-id="${row?.['id']}" type="checkbox" name="selected-delivery" class="form-check-input selected-delivery" ${row?.['already'] ? 'checked' : ''}>
                                    <label class="form-check-label"></label>
                                </div>`
                    }
                },
            ]
        });
    }
    static LoadDeliveryProductTable(datasource=[]) {
        pageElements.$table_delivery_product.DataTable().clear().destroy()
        pageElements.$table_delivery_product.DataTableDefault({
            styleDom: "hide-foot",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '30vh',
            scrollCollapse: true,
            data: datasource,
            columns: [
                {
                    render: () => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-secondary">${(row?.['product_data'] || {})?.['code'] || ''}</span>&nbsp;${(row?.['product_data'] || {})?.['title'] || ''}`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary">${(row?.['product_uom_data'] || {})?.['title'] || ''}</span>`
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        return `<span>${row?.['delivery_quantity'] || 0}</span>`
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        return `<span>${row?.['delivered_quantity_before'] || 0}</span>`
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['product_quantity'] || 0}</span>`
                    }
                },
            ],
        });
    }
    static LoadMainTable(datasource=[], option='create') {
        let from_delivery = (pageElements.$sale_order.val() || pageElements.$lease_order.val()) ? 'disabled readonly' : ''
        pageElements.$main_table.DataTable().clear().destroy()
        pageElements.$main_table.DataTableDefault({
            styleDom: "hide-foot",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '30vh',
            scrollCollapse: true,
            data: datasource,
            columns: [
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row) => {
                        let product_data = row?.['product_data'] || {}
                        let delivery_item_mapped_id = row?.['delivery_item_mapped_id'] || ''
                        return `<div class="input-group">
                            <span class="input-affix-wrapper">
                                <span class="input-prefix product-des" data-bs-toggle="tooltip" title="${product_data?.['description']}"><i class="bi bi-info-circle"></i></span>
                                <select ${option==='detail' ? 'disabled' : ''} ${from_delivery} data-delivery-item-mapped-id="${delivery_item_mapped_id}" data-product="${JSON.stringify(product_data).replace(/"/g, "&quot;")}" class="form-select select-2 product-select"></select>
                            </span>
                        </div>`
                    }
                },
                {
                    render: (data, type, row) => {
                        let product_uom_data = row?.['product_uom_data'] || {}
                        return `<select ${option==='detail' ? 'disabled' : ''} ${from_delivery} data-product-uom="${JSON.stringify(product_uom_data).replace(/"/g, "&quot;")}" class="form-select select-2 uom-select"></select>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        let product_quantity = row?.['product_quantity'] || 0
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} type="number" ${from_delivery} value="${product_quantity}" class="form-control product_quantity recalculate-field text-right">`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} ${from_delivery} class="form-control product_unit_price mask-money recalculate-field text-right" value="${row?.['product_unit_price'] || 0}">`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input ${option==='detail' ? 'disabled readonly' : ''} class="form-control product_payment_percent recalculate-field text-right" type="number" value="${row?.['product_payment_percent'] || 100}" min="1" max="100">
                                        <span class="input-suffix"><i class="fa-solid fa-percent"></i></span>
                                    </span>
                                    <span class="input-group-text">=</span>
                                    <input ${option==='detail' ? 'disabled readonly' : ''} class="form-control product_payment_value mask-money recalculate-field text-right" style="min-width: 200px" value="${row?.['product_payment_value'] || 0}">
                                </div>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input ${option==='detail' ? 'disabled readonly' : ''} class="form-control product_discount_percent recalculate-field text-danger text-right" type="number" value="${row?.['product_discount_percent'] || 0}" min="0" max="100">
                                        <span class="input-suffix"><i class="fa-solid fa-percent"></i></span>
                                    </span>
                                    <span class="input-group-text">=</span>
                                    <input ${option==='detail' ? 'disabled readonly' : ''} class="form-control product_discount_value mask-money recalculate-field text-danger text-right" style="min-width: 200px" value="${row?.['product_discount_value'] || 0}">
                                </div>`
                    }
                },
                {
                    render: (data, type, row) => {
                        let product_tax_data = row?.['product_tax_data'] || {}
                        return `<select ${option==='detail' ? 'disabled' : ''}
                                        ${from_delivery}
                                        data-tax="${JSON.stringify(product_tax_data).replace(/"/g, "&quot;")}"
                                        data-tax-value="${row?.['product_tax_value'] || 0}"
                                        class="form-select select2 product_taxes recalculate-field"></select>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        return `<span class="product_subtotal_final mask-money" data-init-money="${row?.['product_subtotal_final'] || 0}"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<textarea ${option==='detail' ? 'disabled readonly' : ''} rows="1" class="form-control note">${row?.['note'] || ''}</textarea>`
                    }
                },
                {
                    className: 'text-right',
                    render: () => {
                        return `<button ${option==='detail' ? 'disabled' : ''} type='button' ${from_delivery} class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs delete-item-row">
                                    <span class="icon"><i class="fas fa-trash"></i></span>
                                </button>`;
                    }
                },
            ],
            initComplete: function() {
                if (datasource.length > 0) {
                    pageElements.$main_table.find('tbody tr').each(function () {
                        let prd_select = $(this).find('.product-select')
                        let prd_data = prd_select.attr('data-product') ? JSON.parse(prd_select.attr('data-product')) : {}
                        UsualLoadPageFunction.LoadProduct({
                            element: prd_select,
                            data: prd_data,
                            data_url: pageElements.$script_url.attr('data-url-product-list')
                        })

                        let uom_select = $(this).find('.uom-select')
                        let uom_data = uom_select.attr('data-product-uom') ? JSON.parse(uom_select.attr('data-product-uom')) : {}
                        UsualLoadPageFunction.LoadUOM({
                            element: uom_select,
                            data: uom_data,
                            data_params: {'group_id': prd_data?.['general_uom_group']?.['id']},
                            data_url: pageElements.$script_url.attr('data-url-uom-list')
                        })

                        let tax_select = $(this).find('.product_taxes')
                        let tax_data = tax_select.attr('data-tax') ? JSON.parse(tax_select.attr('data-tax')) : {}
                        UsualLoadPageFunction.LoadTax({
                            element: tax_select,
                            data: tax_data,
                            data_url: pageElements.$script_url.attr('data-url-tax-list')
                        })
                    })
                    ARInvoicePageFunction.CalculatePrice()

                    if (option === 'detail') {
                        pageElements.$main_table.find('tbody tr input').prop('disabled', true).prop('readonly', true)
                        pageElements.$main_table.find('tbody tr textarea').prop('disabled', true).prop('readonly', true)
                        pageElements.$main_table.find('tbody tr select').prop('disabled', true)
                        pageElements.$main_table.find('tbody tr button').prop('disabled', true)
                    }
                }
            }
        });
    }
    static LoadPaymentTermViewTable(datasource=[]) {
        pageElements.$payment_term_info_table.DataTable().clear().destroy()
        pageElements.$payment_term_info_table.DataTableDefault({
            styleDom: "hide-foot",
            rowIdx: true,
            reloadCurrency: true,
            useDataServer: false,
            paging: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            data: datasource,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                }, {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `${(row?.['term_data'] || {})?.['title'] || ''}`
                    }
                }, {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `${row?.['remark'] || ''}`
                    }
                }, {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `${row?.['date']? moment(row?.['date'].split(' '), 'YYYY-MM-DDD').format('DD/MM/YYYY') : '-'}`
                    }
                }, {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `${row?.['ratio'] ? row?.['ratio'] : '-'}%`
                    }
                }, {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['value_before_tax'] || 0}"></span>`
                    }
                }, {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['value_total'] || 0}"></span>`
                    }
                }, {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `${['due_date'] ? moment(row?.['due_date'].split(' '), 'YYYY-MM-DDD').format('DD/MM/YYYY') : ''}`
                    }
                }
            ]
        });
    }
    // sub function
    static ReadMoneyVND(num) {
        let xe0 = [
            '',
            'một',
            'hai',
            'ba',
            'bốn',
            'năm',
            'sáu',
            'bảy',
            'tám',
            'chín'
        ]
        let xe1 = [
            '',
            'mười',
            'hai mươi',
            'ba mươi',
            'bốn mươi',
            'năm mươi',
            'sáu mươi',
            'bảy mươi',
            'tám mươi',
            'chín mươi'
        ]
        let xe2 = [
            '',
            'một trăm',
            'hai trăm',
            'ba trăm',
            'bốn trăm',
            'năm trăm',
            'sáu trăm',
            'bảy trăm',
            'tám trăm',
            'chín trăm'
        ]

        let result = ""
        let str_n = String(num)
        let len_n = str_n.length

        if (len_n === 1) {
            result = xe0[num]
        }
        else if (len_n === 2) {
            if (num === 10) {
                result = "mười"
            }
            else {
                result = xe1[parseInt(str_n[0])] + " " + xe0[parseInt(str_n[1])]
            }
        }
        else if (len_n === 3) {
            result = xe2[parseInt(str_n[0])] + " " + ARInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(1, len_n)))
        }
        else if (len_n <= 6) {
            result = ARInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 3))) + " nghìn " + ARInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(len_n - 3, len_n)))
        }
        else if (len_n <= 9) {
            result = ARInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 6))) + " triệu " + ARInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(len_n - 6, len_n)))
        }
        else if (len_n <= 12) {
            result = ARInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 9))) + " tỷ " + ARInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(len_n - 9, len_n)))
        }

        result = String(result.trim())
        return result;
    }
    static CalculatePriceRow(row) {
        let quantity = parseFloat(row.find('.product_quantity').val() || 0)
        let unit_price = parseFloat(row.find('.product_unit_price').attr('value') || 0)
        let product_payment_percent = parseFloat(row.find('.product_payment_percent').val() || 100) / 100
        let product_payment_value = quantity * unit_price * product_payment_percent

        if (row.find('.product_payment_percent').val() === '') {
            product_payment_value = parseFloat(row.find('.product_payment_value').attr('value') || 0)
        }

        row.find('.product_payment_value').attr('value', product_payment_value)

        let product_discount_percent = parseFloat(row.find('.product_discount_percent').val() || 0)
        let product_discount_value = product_payment_value * product_discount_percent / 100
        if (row.find('.product_discount_percent').val() === '') {
            product_discount_value = parseFloat(row.find('.product_discount_value').attr('value') || 0)
        }

        row.find('.product_discount_value').attr('value', product_discount_value)

        let product_payment_value_after_discount = product_payment_value - product_discount_value

        let tax_selected = SelectDDControl.get_data_from_idx(row.find('.product_taxes'), row.find('.product_taxes').val())
        let tax_rate = parseFloat(tax_selected?.['rate'] || 0)
        let product_taxes = product_payment_value_after_discount * tax_rate / 100

        let product_subtotal_final = product_payment_value_after_discount + product_taxes

        row.find('.product_taxes').attr('data-tax-value', product_taxes)
        row.find('.product_subtotal_final').attr('data-init-money', product_subtotal_final)

        ARInvoicePageFunction.CalculatePrice()
        $.fn.initMaskMoney2()
    }
    static CalculatePrice() {
        let sum_taxes = 0
        let sum_subtotal_price = 0
        let sum_discount = 0
        let sum_amount = 0
        let dropdown_tax_detail_data = {}
        pageElements.$main_table.find('tbody tr').each(function () {
            let row = $(this)
            let tax_selected = SelectDDControl.get_data_from_idx(row.find('.product_taxes'), row.find('.product_taxes').val())
            let tax_rate = parseFloat(tax_selected?.['rate'] || 0)

            let product_payment_value = parseFloat(row.find('.product_payment_value').attr('value') || 0)
            let product_discount_value = parseFloat(row.find('.product_discount_value').attr('value') || 0)
            let product_taxes = (product_payment_value - product_discount_value) * tax_rate / 100
            let product_subtotal_final = parseFloat(row.find('.product_subtotal_final').attr('data-init-money') || 0)

            sum_subtotal_price += product_payment_value
            sum_discount += product_discount_value
            sum_taxes += product_taxes
            sum_amount += product_subtotal_final

            if (dropdown_tax_detail_data?.[tax_rate]) {
                dropdown_tax_detail_data[tax_rate] += product_taxes
            }
            else {
                dropdown_tax_detail_data[tax_rate] = product_taxes
            }
        })

        $('#pretax-value').attr('value', sum_subtotal_price)
        $('#taxes-value').attr('value', sum_taxes)
        $('#discount-all').attr('value', sum_discount)
        $('#total-value').attr('value', sum_amount)

        let dropdown_tax_detail_html = ''
        for (let key in dropdown_tax_detail_data) {
             dropdown_tax_detail_html += `
                <a class="dropdown-item" href="#">
                    <div class="row">
                        <div class="col-4"><span class="text-blue">${$.fn.gettext('VAT')} ${key}%</span></div>
                        <div class="col-8 text-right"><span class="mask-money" data-init-money="${parseFloat(dropdown_tax_detail_data[key])}"></span></div>
                    </div>
                </a>
            `
        }
        $('#dropdown-tax-detail').html(dropdown_tax_detail_html)

        let by_words = ARInvoicePageFunction.ReadMoneyVND(sum_amount) + ' đồng'
        by_words = by_words.charAt(0).toUpperCase() + by_words.slice(1)
        if (by_words[by_words.length - 1] === ',') {
            by_words = by_words.substring(0, by_words.length - 1) + ' đồng'
        }
        $('#total-value-by-words').text(by_words)

        $.fn.initMaskMoney2()
    }
    static async CheckTaxCode() {
        if (pageElements.$tax_code.val()) {
            try {
                let response = await fetch(`https://api.vietqr.io/v2/business/${pageElements.$tax_code.val()}`);
                if (!response.ok) {
                    return [false, {desc: 'Network response was not ok'}];
                }
                let responseData = await response.json();
                if (responseData.code === '00') {
                    return [true, responseData];
                } else {
                    return [false, responseData];
                }
            } catch (error) {
                $.fn.notifyB({description: 'Can not get this Tax number information'}, 'failure');
                return [false, {}];
            }
        }
    }
}

/**
 * Khai báo các hàm chính
 */
class ARInvoiceHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['customer_mapped'] = pageElements.$customer_name.attr('data-id') || null
        frm.dataForm['buyer_name'] = pageElements.$buyer_name.val()
        frm.dataForm['tax_number'] = pageElements.$tax_code.val()
        frm.dataForm['billing_address_id'] = pageElements.$billing_address.val() || null
        frm.dataForm['invoice_method'] = pageElements.$invoice_method.val()
        frm.dataForm['company_bank_account'] = pageElements.$bank_info.val() || null
        frm.dataForm['sale_order_mapped'] = pageElements.$sale_order.val() || null
        frm.dataForm['lease_order_mapped'] = pageElements.$lease_order.val() || null
        frm.dataForm['note'] = pageElements.$note.val()
        frm.dataForm['posting_date'] = moment(pageElements.$posting_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment(pageElements.$document_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['invoice_date'] = moment(pageElements.$invoice_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['invoice_sign'] = pageElements.$invoice_sign.val()
        frm.dataForm['invoice_number'] = pageElements.$invoice_number.val()
        frm.dataForm['invoice_example'] = pageElements.$invoice_exp.val()
        frm.dataForm['delivery_mapped_list'] = (pageElements.$main_table.attr('data-delivery-selected') || '').split(',').filter(Boolean)

        // let vat_number = []
        let data_item_list = []
        pageElements.$main_table.find('tbody tr').each(function () {
            data_item_list.push({
                'delivery_item_mapped_id': $(this).find('.product-select').attr('data-delivery-item-mapped-id') || null,
                'product_id': $(this).find('.product-select').val() || null,
                'product_uom_id': $(this).find('.uom-select').val() || null,
                'product_quantity': $(this).find('.product_quantity').val(),
                'product_unit_price': $(this).find('.product_unit_price').attr('value'),
                'product_payment_percent': $(this).find('.product_payment_percent').val() || null,
                'product_payment_value': $(this).find('.product_payment_value').attr('value'),
                'product_discount_percent': $(this).find('.product_discount_percent').val() || null,
                'product_discount_value': $(this).find('.product_discount_value').attr('value'),
                'product_tax_id': $(this).find('.product_taxes').val() || null,
                'product_subtotal_final': $(this).find('.product_subtotal_final').attr('data-init-money'),
                'note': $(this).find('.note').val()
            })
        })

        frm.dataForm['data_item_list'] = data_item_list

        if (frm.dataForm['data_item_list'].length === 0) {
            $.fn.notifyB({description: "No item in tab line detail"}, 'failure')
            return false
        }

        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        return frm
    }
    static LoadDetailARInvoice(option) {
        let url_loaded = $('#form-detail-ar-invoice').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['ar_invoice_detail'];

                    console.log(data)

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    if (pageVariables.invoice_signs?.['many_vat_sign'] === data?.['invoice_sign']) {
                        pageElements.$invoice_sign.val(pageVariables.invoice_signs?.['many_vat_sign'])
                    }
                    if (pageVariables.invoice_signs?.['one_vat_sign'] === data?.['invoice_sign']) {
                        pageElements.$invoice_sign.val(pageVariables.invoice_signs?.['one_vat_sign'])
                    }
                    if (pageVariables.invoice_signs?.['sale_invoice_sign'] === data?.['invoice_sign']) {
                        pageElements.$invoice_sign.val(pageVariables.invoice_signs?.['sale_invoice_sign'])
                    }

                    pageElements.$title.val(data?.['title'])
                    pageElements.$customer_name.attr('data-id', data?.['customer_mapped_data']?.['id'])
                    pageElements.$customer_name.val(data?.['customer_mapped_data']?.['name'])
                    pageElements.$buyer_name.val(data?.['buyer_name'])
                    pageElements.$tax_code.val(data?.['customer_mapped_data']?.['tax_code'])
                    for (let i = 0; i < (data?.['customer_mapped_data']?.['billing_address_list'] || []).length; i++) {
                        pageElements.$billing_address.append(`
                            <option value="${data?.['customer_mapped_data']?.['billing_address_list'][i]?.['id']}">${data?.['customer_mapped_data']?.['billing_address_list'][i]?.['full_address']}</option>
                        `)
                    }
                    pageElements.$billing_address.val(data?.['customer_mapped_data']?.['billing_address_id'])
                    ARInvoicePageFunction.LoadCompanyBankAccount(data?.['company_bank_account_data'])
                    pageElements.$invoice_method.val(data?.['invoice_method'])
                    if (data?.['invoice_method'] === 1) {
                        pageElements.$bank_info.closest('.form-group').find('label').removeClass('required')
                        pageElements.$bank_info.prop('disabled', true)
                    }
                    else {
                        pageElements.$bank_info.closest('.form-group').find('label').addClass('required')
                        pageElements.$bank_info.prop('disabled', false)
                    }
                    ARInvoicePageFunction.LoadSaleOrder(data?.['sale_order_mapped_data'] || {})
                    ARInvoicePageFunction.LoadLeaseOrder(data?.['lease_order_mapped_data'] || {})

                    pageElements.$posting_date.val(moment(data?.['posting_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    pageElements.$document_date.val(moment(data?.['document_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    pageElements.$invoice_date.val(moment(data?.['invoice_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    pageElements.$invoice_sign.val(data?.['invoice_sign'])
                    pageElements.$invoice_number.val(data?.['invoice_number'])
                    // $('#invoice-status').val(
                    //     ['Khởi tạo', 'Đã phát hành', 'Đã kê khai', 'Đã thay thế', 'Đã điều chỉnh'][data?.['invoice_status']]
                    // ).removeClass('text-blue').addClass(
                    //     ['text-blue', 'text-primary', 'text-info', 'text-danger', 'text-warning'][data?.['invoice_status']]
                    // )
                    pageElements.$invoice_exp.val(data?.['invoice_example'])
                    $('#ar-invoice-label').text(pageElements.$invoice_exp.find('option:selected').attr('data-text'))
                    pageElements.$note.val(data?.['note'])

                    pageElements.$main_table.attr('data-delivery-selected', data?.['delivery_mapped'].map(item => item.id).join(','))
                    ARInvoicePageFunction.LoadMainTable(data?.['item_mapped'], option)

                    if (Object.keys(data?.['sale_order_mapped_data']).length > 0) {
                        pageElements.$btn_select_from_delivery.removeClass('disabled')
                    }
                    else {
                        pageElements.$btn_select_from_delivery.addClass('disabled')
                    }

                    if (Object.keys(data?.['sale_order_mapped_data']).length > 0) {
                        pageElements.$btn_add_optionally.addClass('disabled')
                    }
                    else {
                        pageElements.$btn_add_optionally.removeClass('disabled')
                    }

                    new $x.cls.file($('#attachment')).init({
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    $.fn.initMaskMoney2();

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                    UsualLoadPageFunction.DisablePage(
                        option==='detail',
                        ['#view-tax-code-info', '#view-payment-term']
                    )
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class ARInvoiceEventHandler {
    static InitPageEven() {
        pageElements.$invoice_method.on('change', function () {
            if ($(this).val() === '1') {
                pageElements.$bank_info.closest('.form-group').find('label').removeClass('required')
                pageElements.$bank_info.prop('required', false)
                pageElements.$bank_info.prop('disabled', true)
                pageElements.$bank_info.empty()
            }
            else {
                pageElements.$bank_info.closest('.form-group').find('label').addClass('required')
                pageElements.$bank_info.prop('required', true)
                pageElements.$bank_info.prop('disabled', false)
            }
        })
        pageElements.$customer_select_btn.on('click', function () {
            ARInvoicePageFunction.LoadCustomerTable()
        })
        pageElements.$accept_select_customer_btn.on('click', function () {
            let selected_obj = null
            $('input[name="customer-selected-radio"]').each(async function () {
                if ($(this).prop('checked')) {
                    selected_obj = $(this).attr('data-customer') ? JSON.parse($(this).attr('data-customer')) : {}
                    pageElements.$customer_name.val(selected_obj?.['name']).attr('data-id', selected_obj?.['id']).prop('readonly', true).prop('disabled', true)
                    pageElements.$tax_code.val(selected_obj?.['tax_code'])
                    for (let i = 0; i < (selected_obj?.['billing_address'] || []).length; i++) {
                        pageElements.$billing_address.append(`
                            <option ${selected_obj?.['billing_address'][i]?.['is_default'] ? 'selected' : ''} value="${selected_obj?.['billing_address'][i]?.['id']}">${selected_obj?.['billing_address'][i]?.['full_address']}</option>
                        `)
                    }
                    pageElements.$sale_order.prop('disabled', false)
                    pageElements.$lease_order.prop('disabled', false)
                    ARInvoicePageFunction.LoadSaleOrder()
                    ARInvoicePageFunction.LoadLeaseOrder()
                    pageElements.$customer_select_modal.modal('hide')

                    let [tax_code_status, responseData] = await ARInvoicePageFunction.CheckTaxCode()
                    $('#invalid-tax').prop('hidden', tax_code_status)
                    $('#valid-tax').prop('hidden', !tax_code_status)
                }
            })
            if (!selected_obj) {
                $.fn.notifyB({description: 'Nothing selected'}, 'warning');
            }
        })
        pageElements.$view_tax_code_info.on('click', async function () {
            if (pageElements.$tax_code.val()) {
                let [tax_code_status, responseData] = await ARInvoicePageFunction.CheckTaxCode()
                $('#invalid-tax').prop('hidden', tax_code_status)
                $('#valid-tax').prop('hidden', !tax_code_status)
                if (tax_code_status) {
                    $('#tax-code-info-international-name').val(responseData?.['data']?.['internationalName'])
                    $('#tax-code-info-name').val(responseData?.['data']?.['name'])
                    $('#tax-code-info-short-name').val(responseData?.['data']?.['shortName'])
                    $('#tax-code-info-tax-code').val(responseData?.['data']?.['id'])
                    $('#tax-code-info-address').val(responseData?.['data']?.['address'])
                } else {
                    Swal.fire({
                        html: `<p class="text-danger mt-3">${responseData.desc}</p>`,
                        customClass: {
                            confirmButton: 'btn btn-xs btn-secondary',
                            cancelButton: 'btn btn-xs btn-secondary',
                        },
                        showCancelButton: false,
                        buttonsStyling: false,
                        confirmButtonText: 'Cancel',
                        cancelButtonText: 'No',
                        reverseButtons: false
                    })
                }
            }
        })
        pageElements.$view_payment_term_so.on('click', function () {
            let selected_so = SelectDDControl.get_data_from_idx(pageElements.$sale_order, pageElements.$sale_order.val())
            ARInvoicePageFunction.LoadPaymentTermViewTable(selected_so?.['sale_order_payment_stage'] || [])
        })
        pageElements.$view_payment_term_lo.on('click', function () {
            let selected_lo = SelectDDControl.get_data_from_idx(pageElements.$lease_order, pageElements.$lease_order.val())
            ARInvoicePageFunction.LoadPaymentTermViewTable(selected_lo?.['lease_payment_stage'] || [])
        })
        pageElements.$invoice_exp.on('change', function () {
            $('#ar-invoice-label').text($(this).find('option:selected').attr('data-text'))
        })
        pageElements.$accept_delivery_product_btn.on('click', function () {
            ARInvoicePageFunction.LoadMainTable(JSON.parse(pageElements.$delivery_product_data_script.text() || '[]'))
            $('#select-delivery-offcanvas').offcanvas('hide')
            let data_product = []
            $('.selected-delivery').each(function () {
                if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
                    data_product.push($(this).attr('data-id'))
                }
            })
            pageElements.$main_table.attr('data-delivery-selected', data_product.join(','))
        })
        pageElements.$btn_select_from_delivery.on('click', function () {
            if (pageElements.$sale_order.val() || pageElements.$lease_order.val()) {
                ARInvoicePageFunction.LoadDeliveryTable()
                ARInvoicePageFunction.LoadDeliveryProductTable()
            }
            else {
                $.fn.notifyB({description: "You have not selected Sale order yet."}, 'warning')
            }
        })
        pageElements.$btn_add_optionally.on('click', function () {
            if (!pageElements.$sale_order.val() || !pageElements.$lease_order.val()) {
                UsualLoadPageFunction.AddTableRow(pageElements.$main_table, {})
                let row_added = pageElements.$main_table.find('tbody tr:last-child')
                UsualLoadPageFunction.LoadProduct({
                    element: row_added.find('.product-select'),
                    data_url: pageElements.$script_url.attr('data-url-product-list')
                })
            }
            else {
                $.fn.notifyB({description: "You have selected Sale order already."}, 'warning')
            }
        })
        $(document).on("click", '.delete-item-row', function () {
            UsualLoadPageFunction.DeleteTableRow(pageElements.$main_table, parseInt($(this).closest('tr').find('td:first-child').text()))
            ARInvoicePageFunction.CalculatePrice()
        })
        $(document).on("change", '.product-select', function () {
            if ($(this).val()) {
                let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
                $(this).closest('tr').find('.product-des').attr('title', selected?.['description'] ? selected?.['description'] : '')
                UsualLoadPageFunction.LoadUOM({
                    element: $(this).closest('tr').find('.uom-select'),
                    data: selected?.['sale_default_uom'] || {},
                    data_params: {'group_id': selected?.['general_uom_group']?.['id']},
                    data_url: pageElements.$script_url.attr('data-url-uom-list')
                })
                UsualLoadPageFunction.LoadTax({
                    element: $(this).closest('tr').find('.product_taxes'),
                    data_params: {'group_id': selected?.['general_uom_group']?.['id']},
                    data_url: pageElements.$script_url.attr('data-url-tax-list')
                })
            }
        })
        $(document).on("change", '.product_quantity', function () {
            if ($(this).val() < 0) {
                $(this).val(0)
            }
        })
        $(document).on("change", '.product_payment_percent', function () {
            if ($(this).val() < 0) {
                $(this).val(0)
            }
            if ($(this).val() > 100) {
                $(this).val(100)
            }
        })
        $(document).on("change", '.product_discount_percent', function () {
            if ($(this).val() < 0) {
                $(this).val(0)
            }
            if ($(this).val() > 100) {
                $(this).val(100)
            }
        })
        $(document).on("change", '.recalculate-field', function () {
            ARInvoicePageFunction.CalculatePriceRow($(this).closest('tr'))
        })
        $(document).on("change", '.selected-delivery', function () {
            // xử lí dữ liệu product delivery
            let data_product = []
            let data_product_already = []
            $('.selected-delivery').each(function () {
                if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
                    data_product = data_product.concat(
                        JSON.parse($(this).attr('data-detail') || '[]')
                    )
                }

                if ($(this).prop('checked') && $(this).attr('data-already') === '1') {
                    data_product_already = data_product_already.concat(
                        JSON.parse($(this).attr('data-detail') || '[]')
                    )
                }
            })

            const merged_data_product = {};
            data_product.forEach(entry => {
                if (parseFloat(entry?.['product_quantity']) > 0) {
                    const productId = entry?.['product_id'];
                    const delivery_id = entry?.['delivery_id'];

                    if (merged_data_product[productId] && merged_data_product[delivery_id]) {
                        merged_data_product[productId]['product_quantity'] += entry?.['product_quantity']
                        merged_data_product[productId]['product_subtotal'] += entry?.['product_subtotal']
                        merged_data_product[productId]['product_tax_value'] += entry?.['product_tax_value']
                        merged_data_product[productId]['product_discount_value'] += entry?.['product_discount_value']
                        merged_data_product[productId]['product_subtotal_final'] += entry?.['product_subtotal_final']
                    }
                    else {
                        merged_data_product[productId] = {
                            delivery_item_mapped_id: entry?.['id'],
                            delivery_id: entry?.['delivery_id'],
                            product_data: entry?.['product_data'],
                            product_uom_data: entry?.['product_uom_data'],
                            delivery_quantity: entry?.['delivery_quantity'],
                            delivered_quantity_before: data_product_already
                                .filter(item => item?.['product_data']?.['id'] === productId)
                                .reduce((sum, item) => sum + item?.['product_quantity'], 0),
                            product_quantity: entry?.['product_quantity'],
                            product_unit_price: entry?.['product_unit_price'],
                            product_subtotal: entry?.['product_subtotal'],
                            product_discount_value: entry?.['product_discount_value'],
                            product_tax_data: entry?.['product_tax_data'],
                            product_tax_value: entry?.['product_tax_value'],
                            product_subtotal_final: entry?.['product_subtotal_final'],
                        }
                    }
                }
            });
            data_product = Object.values(merged_data_product)

            ARInvoicePageFunction.LoadDeliveryProductTable(data_product)
            pageElements.$delivery_product_data_script.text(JSON.stringify(data_product))
        })
    }
}
