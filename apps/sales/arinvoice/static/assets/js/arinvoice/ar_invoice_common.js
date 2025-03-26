const scriptUrlEle = $('#script-url')
const tableSelectCustomerEle = $('#table-select-customer')
const selectCustomerBtn = $('#select-customer-btn')
const customerNameEle = $('#customer-name')
const customerSelectModal = $('#customer-select-modal')
const saleOrderEle = $('#sale-order')
const viewPaymentTermEle = $('#view-payment-term')
const tableSelectDeliveryEle = $('#table-select-delivery')
const tableDeliveryProductEle = $('#table-delivery-product')
const delivery_product_data = $('#delivery_product_data')
const NormalTable = $('#normal_datatable')
const DescriptionTable = $('#description_datatable')
const paymentTermInfoTable = $('#payment-term-info-table')
const postingDateEle = $('#posting-date')
const documentDateEle = $('#document-date')
const invoiceDateEle= $('#invoice-date')
const customerSelectBtn = $('#customer-select-btn')
const tax_codeEle = $('#tax_code')
const billingAddressEle = $('#billing-address')
const invoiceMethodEle = $('#invoice-method')
const bankNumberEle = $('#bank-number')
const invoice_exp = $('#invoice-exp')
const invoice_action = $('#invoice-action')
const invoice_sign = $('#invoice-sign')
let invoice_signs_Ele = $('#invoice_signs')
const invoice_signs = invoice_signs_Ele.text() ? JSON.parse(invoice_signs_Ele.text()) : {};
const btn_for_delivery_ar = $('.btn-for-delivery-ar')
const btn_select_from_delivery = $('#btn-select-from-delivery')
const btn_add_optionally = $('#btn-add-optionally')
const btn_add_des = $('#btn-add-des')

class ARInvoiceLoadPage {
    static LoadCustomer() {
        tableSelectCustomerEle.DataTable().clear().destroy()
        tableSelectCustomerEle.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '50vh',
            scrollX: '100vw',
            scrollCollapse: true,
            ajax: {
                url: tableSelectCustomerEle.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let res = []
                        for (let i = 0; i < resp.data['account_list'].length; i++) {
                            if (resp.data['account_list'][i]['account_type'].some(item => item === "Customer")) {
                                res.push(resp.data['account_list'][i])
                            }
                        }
                        return res;
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'wrap-text w-5',
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
                    className: 'wrap-text w-70',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary mr-2">${row?.['code']}</span><span>${row?.['name']}</span>`
                    }
                },
                {
                    data: 'tax_code',
                    className: 'wrap-text w-20',
                    render: (data, type, row) => {
                        return row.tax_code
                    }
                },
            ],
        })
    }
    static LoadSaleOrder(data) {
        saleOrderEle.initSelect2({
            allowClear: true,
            ajax: {
                url: saleOrderEle.attr('data-url') + `?customer_id=${customerNameEle.attr('data-id')}`,
                method: 'GET',
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
            if (saleOrderEle.val()) {
                btn_for_delivery_ar.removeClass('disabled')
                btn_add_optionally.addClass('disabled')
            }
            else {
                btn_for_delivery_ar.addClass('disabled')
                btn_add_optionally.removeClass('disabled')
            }
        })
    }
}

class ARInvoiceLoadTab {
    static LoadDelivery() {
        tableSelectDeliveryEle.DataTable().clear().destroy()
        tableSelectDeliveryEle.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollY: '30vh',
            scrollCollapse: true,
            ajax: {
                url: scriptUrlEle.attr('data-url-delivery-list') + '?sale_order_id=' + saleOrderEle.val(),
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
                    'render': () => {
                        return ``;
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-primary">${row?.['code']}</span>`
                    }
                },
                {
                    data: 'name',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${moment(row?.['actual_delivery_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}`
                    }
                },
                {
                    data: 'already',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        if (row?.['already']) {
                            return `<i class="fas fa-check-circle text-success"></i>`
                        }
                        return ``
                    }
                },
                {
                    data: 'select',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        if (row?.['already']) {
                            let details = JSON.stringify(row?.['details'])
                            return `<div class="form-check" hidden>
                                        <input checked data-already="1" data-id="${row?.['id']}" type="checkbox" name="selected-delivery" class="form-check-input selected-delivery">
                                        <label class="form-check-label"></label>
                                        <script class="details">${details}</script>
                                    </div>`
                        }
                        else {
                            let details = JSON.stringify(row?.['details'])
                            return `<div class="form-check">
                                        <input data-already="0" data-id="${row?.['id']}" type="checkbox" name="selected-delivery" class="form-check-input selected-delivery">
                                        <label class="form-check-label"></label>
                                        <script class="details">${details}</script>
                                    </div>`
                        }
                    }
                },
            ]
        });
    }
    static LoadDeliveryProduct(datasource=[]) {
        tableDeliveryProductEle.DataTable().clear().destroy()
        tableDeliveryProductEle.DataTableDefault({
            dom: "t",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
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
                    data: 'product_data__title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-secondary">${row?.['product_data']?.['code']}</span>&nbsp;${row?.['product_data']?.['title']}`
                    }
                },
                {
                    data: 'uom_data__title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary">${row?.['uom_data']?.['title']}</span>`
                    }
                },
                {
                    data: 'delivery_quantity',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `<b>${row?.['delivery_quantity']}</b>`
                    }
                },
                {
                    data: 'delivered_quantity_before',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return row?.['delivered_quantity_before']
                    }
                },
                {
                    data: 'picked_quantity',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `<span class="text-primary"><b>${row?.['picked_quantity']}</b></span>`
                    }
                },
            ],
        });
    }
    static LoadTableNormal(datasource=[]) {
        // kiểm tra dữ liệu hóa đơn điện tử
        // if (datasource.length > 0) {
        //     let vat_number = []
        //     for (const item of datasource) {
        //         if (parseFloat(item?.['picked_quantity']) > 0 && vat_number.includes(item?.['data_from_so']?.['product_tax_value']) === false) {
        //             vat_number.push(item?.['data_from_so']?.['product_tax_value'])
        //         }
        //     }
        //     if (vat_number.length > 1) {
        //         if (invoice_exp.val() === '0') {
        //             if (invoice_signs?.['many_vat_sign']) {
        //                 invoice_sign.val(invoice_signs?.['many_vat_sign'])
        //             } else {
        //                 $.fn.notifyB({description: "Can not get Invoice sign for many tax case. Input in Setting."}, 'warning')
        //                 return;
        //             }
        //         }
        //         else if (invoice_exp.val() === '2') {
        //             if (invoice_signs?.['sale_invoice_sign']) {
        //                 invoice_sign.val(invoice_signs?.['sale_invoice_sign'])
        //             } else {
        //                 $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'warning')
        //             }
        //         }
        //         else {
        //             $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
        //             return;
        //         }
        //     }
        //     else {
        //         if (invoice_exp.val() === '0') {
        //             if (invoice_signs?.['one_vat_sign']) {
        //                 invoice_sign.val(invoice_signs?.['one_vat_sign'])
        //             } else {
        //                 $.fn.notifyB({description: "Can not get Invoice sign for one tax case. Input in Setting."}, 'warning')
        //                 return;
        //             }
        //         }
        //         else if (invoice_exp.val() === '2') {
        //             if (invoice_signs?.['sale_invoice_sign']) {
        //                 invoice_sign.val(invoice_signs?.['sale_invoice_sign'])
        //             } else {
        //                 $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'warning')
        //             }
        //         }
        //         else {
        //             $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
        //             return;
        //         }
        //     }
        // }

        let from_delivery = saleOrderEle.val() ? 'disabled readonly' : ''
        NormalTable.DataTable().clear().destroy()
        NormalTable.DataTableDefault({
            dom: "t",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
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
                    className: 'wrap-text text-center',
                    render: () => {
                        return `<button type='button' ${from_delivery} class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs delete-item-row"><span class="icon"><i class="fas fa-trash"></i></span></button>`;
                    }
                },
                {
                    className: 'wrap-text text-primary',
                    render: (data, type, row) => {
                        let product_description = row?.['data_from_so']?.['product_description'] ? row?.['data_from_so']?.['product_description'] : ''
                        return `<div class="input-group">
                            <span class="input-affix-wrapper">
                                <span class="input-prefix product-des" data-bs-toggle="tooltip" title="${product_description}"><i class="bi bi-info-circle"></i></span>
                                <select ${from_delivery} ${row?.['product_data']?.['id'] ? 'disabled' : ''}
                                        data-id="${row?.['product_data']?.['id'] ? row?.['product_data']?.['id'] : ''}"
                                        data-code="${row?.['product_data']?.['code'] ? row?.['product_data']?.['code'] : ''}"
                                        data-title="${row?.['product_data']?.['title'] ? row?.['product_data']?.['title'] : ''}"
                                        class="form-select select-2 product-select"></select>
                            </span>
                        </div>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<select ${from_delivery} ${row?.['product_data']?.['id'] ? 'disabled' : ''}
                                        data-id="${row?.['uom_data']?.['id'] ? row?.['uom_data']?.['id'] : ''}"
                                        data-code="${row?.['uom_data']?.['code'] ? row?.['uom_data']?.['code'] : ''}"
                                        data-title="${row?.['uom_data']?.['title'] ? row?.['uom_data']?.['title'] : ''}"
                                        class="form-select select-2 uom-select"></select>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let picked_quantity = row?.['picked_quantity'] ? row?.['picked_quantity'] : 0
                        return `<input type="number" ${from_delivery} value="${picked_quantity}" class="form-control picked_quantity recalculate-field">`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        let product_unit_price = row?.['data_from_so']?.['product_unit_price'] ? row?.['data_from_so']?.['product_unit_price'] : 0
                        return `<input ${from_delivery} class="recalculate-field product_unit_price mask-money form-control text-right" value="${product_unit_price}">`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        let product_subtotal_price = row?.['data_from_so']?.['product_unit_price'] && row?.['picked_quantity'] ? parseFloat(row?.['data_from_so']?.['product_unit_price']) * parseFloat(row?.['picked_quantity']) : 0
                        return `<span class="product_subtotal_price mask-money text-primary" data-init-money="${product_subtotal_price}"></span>`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        let product_discount_value = row?.['data_from_so']?.['product_discount_value'] ? row?.['data_from_so']?.['product_discount_value'] : 0
                        return `<div class="input-affix-wrapper">
                                    <input type="number" class="recalculate-field form-control product_discount_rate text-right text-danger" value="${product_discount_value}">
                                    <div class="input-suffix"><i class="fas fa-percentage"></i></div>
                                </div>`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        let product_discount_value = row?.['data_from_so']?.['product_discount_value'] && row?.['data_from_so']?.['product_unit_price'] && row?.['picked_quantity'] ? (
                            row?.['data_from_so']?.['product_discount_value'] / 100
                        ) * (
                            row?.['data_from_so']?.['product_unit_price'] * row?.['picked_quantity']
                        ) : 0
                        return `<span class="product_discount_value mask-money text-danger" data-init-money="${product_discount_value}"></span>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<select ${from_delivery} data-tax-id="${row?.['data_from_so']?.['tax'] ? row?.['data_from_so']?.['tax'] : ''}"
                                        data-tax-rate="${row?.['data_from_so']?.['product_tax_value'] ? row?.['data_from_so']?.['product_tax_value'] : 0}"
                                        data-tax-title="${row?.['data_from_so']?.['product_tax_title'] ? row?.['data_from_so']?.['product_tax_title'] : ''}"
                                        class="recalculate-field form-select select2 product_taxes"></select>`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        let subtotal = row?.['data_from_so']?.['product_unit_price'] && row?.['picked_quantity'] ? parseFloat(row?.['data_from_so']?.['product_unit_price']) * parseFloat(row?.['picked_quantity']) : 0
                        let discount = row?.['data_from_so']?.['product_discount_value'] ? subtotal * parseFloat(row?.['data_from_so']?.['product_discount_value']) / 100 : 0
                        let tax_value = row?.['data_from_so']?.['product_tax_value'] ? (subtotal - discount) * parseFloat(row?.['data_from_so']?.['product_tax_value']) / 100 : 0
                        return `<span class="mask-money product_taxes_value" data-init-money="${tax_value}"></span>`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        let subtotal = row?.['data_from_so']?.['product_unit_price'] && row?.['picked_quantity'] ? parseFloat(row?.['data_from_so']?.['product_unit_price']) * parseFloat(row?.['picked_quantity']) : 0
                        let discount = row?.['data_from_so']?.['product_discount_value'] ? subtotal * parseFloat(row?.['data_from_so']?.['product_discount_value']) / 100 : 0
                        let tax_value = row?.['data_from_so']?.['product_tax_value'] ? (subtotal - discount) * parseFloat(row?.['data_from_so']?.['product_tax_value']) / 100 : 0
                        let final = subtotal - discount + tax_value
                        return `<span class="product_subtotal_price_final mask-money" data-init-money="${final}"></span>`
                    }
                },
            ],
            initComplete: function() {
                if (datasource.length > 0) {
                    NormalTable.find('tbody tr').each(function () {
                        let prd_select = $(this).find('.product-select')
                        let prd_data = prd_select.attr('data-id') !== '' ? {
                            'id': prd_select.attr('data-id'),
                            'code': prd_select.attr('data-code'),
                            'title': prd_select.attr('data-title')
                        } : {}
                        UsualLoadPageFunction.LoadProduct({
                            element: prd_select,
                            data: prd_data,
                            data_url: scriptUrlEle.attr('data-url-product-list')
                        })

                        let uom_select = $(this).find('.uom-select')
                        let uom_data = uom_select.attr('data-id') !== '' ? {
                            'id': uom_select.attr('data-id'),
                            'code': uom_select.attr('data-code'),
                            'title': uom_select.attr('data-title')
                        } : {}
                        UsualLoadPageFunction.LoadUOM({
                            element: uom_select,
                            data: uom_data,
                            data_params: {'group_id': prd_data?.['general_uom_group']?.['id']},
                            data_url: scriptUrlEle.attr('data-url-uom-list')
                        })

                        let tax_select = $(this).find('.product_taxes')
                        let tax_data = tax_select.attr('data-id') !== '' ? {
                            'id': tax_select.attr('data-tax-id'),
                            'title': tax_select.attr('data-tax-title'),
                            'rate': tax_select.attr('data-tax-rate')
                        } : {}
                        UsualLoadPageFunction.LoadTax({
                            element: tax_select,
                            data: tax_data,
                            data_url: scriptUrlEle.attr('data-url-tax-list')
                        })
                    })
                    ARInvoiceAction.CalculatePrice()
                }
            }
        });
    }
    static LoadTableNormalForDetailPage(datasource=[], option='detail') {
        NormalTable.DataTable().clear().destroy()
        let input_disabled = ''
        if (option === 'detail') {
            input_disabled = 'disabled readonly'
        }
        let from_delivery = saleOrderEle.val() ? 'disabled readonly' : ''
        NormalTable.DataTableDefault({
            dom: "t",
            rowIdx: true,
            useDataServer: false,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
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
                    className: 'wrap-text text-center',
                    render: () => {
                        return `<button ${from_delivery} ${input_disabled} class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs delete-item-row"><span class="icon"><i class="fas fa-trash"></i></span></button>`;
                    }
                },
                {
                    className: 'wrap-text text-primary',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                            <span class="input-affix-wrapper">
                                <span class="input-prefix product-des" data-bs-toggle="tooltip" title="${row?.['product_data']?.['des']}"><i class="bi bi-info-circle"></i></span>
                                <select ${from_delivery} ${input_disabled} data-product='${JSON.stringify(row?.['product_data'])}' class="form-select select-2 product-select"></select>
                            </span>
                        </div>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<select ${from_delivery} ${input_disabled} data-product-uom='${JSON.stringify(row?.['product_uom_data'])}'
                                        class="form-select select-2 uom-select"></select>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<input ${from_delivery} ${input_disabled} type="number" value="${row?.['product_quantity']}" class="form-control picked_quantity recalculate-field">`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        return `<input ${from_delivery} ${input_disabled} class="product_unit_price mask-money form-control text-right" value="${row?.['product_unit_price']}">`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        return `<span class="product_subtotal_price mask-money" data-init-money="${row?.['product_subtotal']}"></span>`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        return `<div class="input-affix-wrapper">
                                    <input ${input_disabled} type="number" class="form-control product_discount_rate recalculate-field text-danger text-right" value="${row?.['product_discount_rate']}">
                                    <div class="input-suffix"><i class="fas fa-percentage"></i></div>
                                </div>`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        return `<span class="product_discount_value mask-money text-danger" data-init-money="${row?.['product_discount_value']}"></span>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<select ${from_delivery} ${input_disabled}
                                        data-tax='${JSON.stringify(row?.['product_tax_data'])}'
                                        class="form-select select2 product_taxes recalculate-field"></select>`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        return `<span class="mask-money product_taxes_value" data-init-money="${row?.['product_tax_value']}"></span>`
                    }
                },
                {
                    className: 'wrap-text text-right',
                    render: (data, type, row) => {
                        return `<span class="product_subtotal_price_final mask-money" data-init-money="${row?.['product_subtotal_final']}"></span>`
                    }
                },
            ],
            initComplete: function() {
                if (datasource.length > 0) {
                    NormalTable.find('tbody tr').each(function () {
                        let prd_select = $(this).find('.product-select')
                        let prd_data = prd_select.attr('data-product') ? JSON.parse(prd_select.attr('data-product')) : {}
                        UsualLoadPageFunction.LoadProduct({
                            element: prd_select,
                            data: prd_data,
                            data_url: scriptUrlEle.attr('data-url-product-list')
                        })

                        let uom_select = $(this).find('.uom-select')
                        let uom_data = uom_select.attr('data-product-uom') ? JSON.parse(uom_select.attr('data-product-uom')) : {}
                        UsualLoadPageFunction.LoadUOM({
                            element: uom_select,
                            data: uom_data,
                            data_params: {'group_id': prd_data?.['general_uom_group']?.['id']},
                            data_url: scriptUrlEle.attr('data-url-uom-list')
                        })

                        let tax_select = $(this).find('.product_taxes')
                        let tax_data = tax_select.attr('data-tax') ? JSON.parse(tax_select.attr('data-tax')) : {}
                        UsualLoadPageFunction.LoadTax({
                            element: tax_select,
                            data: tax_data,
                            data_url: scriptUrlEle.attr('data-url-tax-list')
                        })
                    })
                    ARInvoiceAction.CalculatePrice()
                }
            }
        });
    }
    static LoadTableDescription(datasource=[]) {
        DescriptionTable.DataTable().clear().destroy()
        DescriptionTable.DataTableDefault({
            dom: "t",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollY: '30vh',
            scrollCollapse: true,
            data: datasource,
            columns: [
                {
                    className: 'wrap-text w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'wrap-text text-center w-5',
                    render: () => {
                        return `<button type='button' class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs delete-item-row"><span class="icon"><i class="fas fa-trash"></i></span></button>`;
                    }
                },
                {
                    className: 'wrap-text w-40',
                    render: (data, type, row) => {
                        let ar_product_des = row?.['ar_product_des'] ? row?.['ar_product_des'] : ''
                        return `<textarea rows="1" class="ar_product_des form-control">${ar_product_des}</textarea>`
                    }
                },
                {
                    className: 'wrap-text text-right w-20',
                    render: (data, type, row) => {
                        return `<input class="recalculate-field product_subtotal_price_final mask-money form-control text-right" value="0">`
                    }
                },
                {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<select class="recalculate-field form-select select2 product_taxes"></select>`
                    }
                },
                {
                    className: 'wrap-text text-right w-20',
                    render: (data, type, row) => {
                        return `<span class="mask-money product_taxes_value" data-init-money="0"></span>`
                    }
                },
            ],
            initComplete: function() {
                if (datasource.length > 0) {
                    ARInvoiceAction.CalculatePrice('des')
                }
            }
        });
    }
    static LoadTableDescriptionForDetailPage(datasource=[], option='detail') {
        DescriptionTable.DataTable().clear().destroy()
        let input_disabled = ''
        if (option === 'detail') {
            input_disabled = 'disabled readonly'
        }
        DescriptionTable.DataTableDefault({
            dom: "t",
            rowIdx: true,
            useDataServer: false,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollY: '30vh',
            scrollCollapse: true,
            data: datasource,
            columns: [
                {
                    className: 'wrap-text w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'wrap-text text-center w-5',
                    render: () => {
                        return `<button ${input_disabled} type='button' class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs delete-item-row"><span class="icon"><i class="fas fa-trash"></i></span></button>`;
                    }
                },
                {
                    className: 'wrap-text w-40',
                    render: (data, type, row) => {
                        let ar_product_des = row?.['ar_product_des'] ? row?.['ar_product_des'] : ''
                        return `<textarea ${input_disabled} rows="1" class="ar_product_des form-control">${ar_product_des}</textarea>`
                    }
                },
                {
                    className: 'wrap-text text-right w-20',
                    render: (data, type, row) => {
                        let product_subtotal_final = row?.['product_subtotal_final'] ? row?.['product_subtotal_final'] : 0
                        return `<input ${input_disabled} class="recalculate-field product_subtotal_price_final mask-money form-control text-right" value="${product_subtotal_final}">`
                    }
                },
                {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<select ${input_disabled} class="recalculate-field form-select select2 product_taxes" 
                                        data-tax='${JSON.stringify(row?.['product_tax_data'])}'
                                        ></select>`
                    }
                },
                {
                    className: 'wrap-text text-right w-20',
                    render: (data, type, row) => {
                        return `<span class="mask-money product_taxes_value" data-init-money="${row?.['product_tax_value']}"></span>`
                    }
                },
            ],
            initComplete: function() {
                if (datasource.length > 0) {
                    let tax_select = $(this).find('.product_taxes')
                    let tax_data = tax_select.attr('data-tax') ? JSON.parse(tax_select.attr('data-tax')) : {}
                    UsualLoadPageFunction.LoadTax({
                        element: tax_select,
                        data: tax_data,
                        data_url: scriptUrlEle.attr('data-url-tax-list')
                    })
                    ARInvoiceAction.CalculatePrice('des')
                }
            }
        });
    }
    static LoadPaymentTermView(datasource=[]) {
        paymentTermInfoTable.DataTable().clear().destroy()
        paymentTermInfoTable.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            useDataServer: false,
            paging: false,
            scrollX: '100vw',
            scrollY: '50vh',
            scrollCollapse: true,
            data: datasource,
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                }, {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `${row?.['term_data']?.['title']}`
                    }
                }, {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `${row?.['remark']}`
                    }
                }, {
                    className: 'wrap-text w-10',
                    render: (data, type, row) => {
                        return `${moment(row?.['date'].split(' '), 'YYYY-MM-DDD').format('DD/MM/YYYY')}`
                    }
                }, {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `${row?.['ratio']}%`
                    }
                }, {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['value_before_tax']}"></span>`
                    }
                }, {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['value_total']}"></span>`
                    }
                }, {
                    className: 'wrap-text w-10',
                    render: (data, type, row) => {
                        return `${moment(row?.['due_date'].split(' '), 'YYYY-MM-DDD').format('DD/MM/YYYY')}`
                    }
                }
            ]
        });
    }
}

class ARInvoiceAction {
    static CalculatePriceRow(row, table_name='normal') {
        if (table_name === 'normal') {
            let quantity = parseFloat(row.find('.picked_quantity').val())
            let unit_price = parseFloat(row.find('.product_unit_price').attr('value'))
            let discount_rate = parseFloat(row.find('.product_discount_rate').val())
            let tax_selected = SelectDDControl.get_data_from_idx(row.find('.product_taxes'), row.find('.product_taxes').val())
            let tax_rate = parseFloat(tax_selected?.['rate'])

            discount_rate = discount_rate ? discount_rate : 0
            tax_rate = tax_rate ? tax_rate : 0

            let row_subtotal = quantity * unit_price;
            let row_discount = row_subtotal * discount_rate / 100
            let row_tax = (row_subtotal - row_discount) * tax_rate / 100
            let row_amount = row_subtotal - row_discount + row_tax

            row.find('.product_subtotal_price').attr('data-init-money', row_subtotal)
            row.find('.product_discount_value').attr('data-init-money', row_discount)
            row.find('.product_taxes_value').attr('data-init-money', row_tax)
            row.find('.product_subtotal_price_final').attr('data-init-money', row_amount)
        }
        if (table_name === 'des') {
            let row_subtotal = row.find('.product_subtotal_price_final').attr('value');
            let tax_selected = SelectDDControl.get_data_from_idx(row.find('.product_taxes'), row.find('.product_taxes').val())
            let tax_rate = parseFloat(tax_selected?.['rate'])
            tax_rate = tax_rate ? tax_rate : 0
            let row_tax = row_subtotal * tax_rate / 100
            row.find('.product_taxes_value').attr('data-init-money', row_tax)
        }
        $.fn.initMaskMoney2()
    }
    static CalculatePrice(table_name='normal') {
        let sum_taxes = 0
        let sum_subtotal_price = 0
        let sum_discount = 0
        if (table_name === 'normal') {
            NormalTable.find('tbody tr').each(function () {
                if ($(this).find('.product_subtotal_price').attr('data-init-money')) {
                    sum_subtotal_price += parseFloat($(this).find('.product_subtotal_price').attr('data-init-money'))
                }
                if ($(this).find('.product_discount_value').attr('data-init-money')) {
                    sum_discount += parseFloat($(this).find('.product_discount_value').attr('data-init-money'))
                }
                if ($(this).find('.product_taxes_value').attr('data-init-money')) {
                    sum_taxes += parseFloat($(this).find('.product_taxes_value').attr('data-init-money'))
                }
            })
        }
        if (table_name === 'des') {
            DescriptionTable.find('tbody tr').each(function () {
                if ($(this).find('.product_subtotal_price_final').attr('value')) {
                    sum_subtotal_price += parseFloat($(this).find('.product_subtotal_price_final').attr('value'))
                }
                if ($(this).find('.product_taxes_value').attr('data-init-money')) {
                    sum_taxes += parseFloat($(this).find('.product_taxes_value').attr('data-init-money'))
                }
            })
        }
        $('#pretax-value').attr('value', sum_subtotal_price)
        $('#taxes-value').attr('value', sum_taxes)
        $('#discount-all').attr('value', sum_discount)
        $('#total-value').attr('value', sum_subtotal_price + sum_taxes - sum_discount)

        $.fn.initMaskMoney2()
    }
    static async CheckTaxCode() {
        if (tax_codeEle.val()) {
            try {
                let response = await fetch(`https://api.vietqr.io/v2/business/${tax_codeEle.val()}`);
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

class ARInvoiceHandle {
    static Load() {
        UsualLoadPageFunction.LoadDate({element: postingDateEle})
        UsualLoadPageFunction.LoadDate({element: documentDateEle})
        UsualLoadPageFunction.LoadDate({element: invoiceDateEle})
        ARInvoiceLoadTab.LoadTableNormal()
        ARInvoiceLoadTab.LoadTableDescription()
        ARInvoiceLoadTab.LoadPaymentTermView()
        invoice_exp.trigger('change')
    }
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = $('#title').val()
        frm.dataForm['customer_mapped'] = customerNameEle.attr('data-id') || null
        frm.dataForm['buyer_name'] = $('#buyer-name').val()
        frm.dataForm['tax_number'] = tax_codeEle.val()
        frm.dataForm['billing_address_id'] = billingAddressEle.val()
        frm.dataForm['invoice_method'] = invoiceMethodEle.val()
        frm.dataForm['bank_account_id'] = bankNumberEle.val() ? bankNumberEle.val() : null
        frm.dataForm['sale_order_mapped'] = saleOrderEle.val() ? saleOrderEle.val() : null

        frm.dataForm['posting_date'] = moment(postingDateEle.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment(documentDateEle.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['invoice_date'] = moment(invoiceDateEle.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['invoice_sign'] = invoice_sign.val()
        frm.dataForm['invoice_number'] = $('#invoice-number').val()
        frm.dataForm['invoice_example'] = invoice_exp.val()

        frm.dataForm['delivery_mapped_list'] = NormalTable.attr('data-delivery-selected') !== '' ? NormalTable.attr('data-delivery-selected').split(',') : []

        // let vat_number = []
        let data_item_list = []
        if (!NormalTable.closest('.table_space').prop('hidden')) {
            NormalTable.find('tbody tr').each(function () {
                // if ($(this).find('.product_taxes').val()) {
                //     vat_number.push($(this).find('.product_taxes').val())
                // }
                data_item_list.push({
                    'item_index': $(this).find('td:first-child').text(),
                    'product_id': $(this).find('.product-select').val() || null,
                    'product_uom_id': $(this).find('.uom-select').val() || null,
                    'product_quantity': $(this).find('.picked_quantity').val(),
                    'product_unit_price': $(this).find('.product_unit_price').attr('value'),
                    'product_subtotal': $(this).find('.product_subtotal_price').attr('data-init-money'),
                    'product_discount_rate': $(this).find('.product_discount_rate').val(),
                    'product_discount_value': $(this).find('.product_discount_value').attr('data-init-money'),
                    'product_tax_id': $(this).find('.product_taxes').val() || null,
                    'product_tax_value': $(this).find('.product_taxes_value').attr('data-init-money'),
                    'product_subtotal_final': $(this).find('.product_subtotal_price_final').attr('data-init-money')
                })
            })
        }
        else if (!DescriptionTable.closest('.table_space').prop('hidden')) {
            DescriptionTable.find('tbody tr').each(function () {
                data_item_list.push({
                    'item_index': $(this).find('td:first-child').text(),
                    'ar_product_des': $(this).find('.ar_product_des').val(),
                    'product_subtotal_final': $(this).find('.product_subtotal_price_final').attr('value'),
                    'product_tax_id': $(this).find('.product_taxes').val() || null,
                    'product_tax_value': $(this).find('.product_taxes_value').attr('data-init-money'),
                })
            })
        }

        frm.dataForm['data_item_list'] = data_item_list

        if (frm.dataForm['data_item_list'].length === 0) {
            $.fn.notifyB({description: "No item in tab line detail"}, 'failure')
            return false
        }

        // kiểm tra dữ liệu cho hóa đơn điện tử
        // if (vat_number.length > 0 && invoice_exp.val() === '2') {
        //     $.fn.notifyB({description: "Product rows in sales invoice can not have VAT."}, 'failure')
        //     return false
        // }
        return frm
    }
    static LoadDetailARInvoice(option) {
        let url_loaded = $('#form-detail-ar-invoice').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            async (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['ar_invoice_detail'];

                    // console.log(data)

                    $x.fn.renderCodeBreadcrumb(data);

                    if (invoice_signs?.['many_vat_sign'] === data?.['invoice_sign']) {
                        invoice_sign.val(invoice_signs?.['many_vat_sign'])
                    }

                    if (invoice_signs?.['one_vat_sign'] === data?.['invoice_sign']) {
                        invoice_sign.val(invoice_signs?.['one_vat_sign'])
                    }

                    if (invoice_signs?.['sale_invoice_sign'] === data?.['invoice_sign']) {
                        invoice_sign.val(invoice_signs?.['sale_invoice_sign'])
                    }

                    if (!data?.['is_created_einvoice']) {
                        $('#view_invoice_btn').closest('a').remove()
                    }
                    else {
                        invoice_action.text(invoice_action.attr('data-trans-update'))
                        invoice_action.closest('button').find('.icon').html('<i class="fa-solid fa-retweet"></i>')
                    }

                    $('#title').val(data?.['title'])
                    customerNameEle.attr('data-id', data?.['customer_mapped_data']?.['id'])
                    customerNameEle.val(data?.['customer_mapped_data']?.['name'])
                    $('#buyer-name').val(data?.['buyer_name'])
                    tax_codeEle.val(data?.['customer_mapped_data']?.['tax_code'])
                    for (let i = 0; i < (data?.['customer_mapped_data']?.['billing_address_list'] || []).length; i++) {
                        billingAddressEle.append(`
                            <option value="${data?.['customer_mapped_data']?.['billing_address_list'][i]?.['id']}">${data?.['customer_mapped_data']?.['billing_address_list'][i]?.['full_address']}</option>
                        `)
                    }
                    for (let i = 0; i < (data?.['customer_mapped_data']?.['bank_account_list'] || []).length; i++) {
                        let bank_account_name = data?.['customer_mapped_data']?.['bank_account_list'][i]?.['bank_account_name']
                        let bank_account_number = data?.['customer_mapped_data']?.['bank_account_list'][i]?.['bank_account_number']
                        let bank_code = data?.['customer_mapped_data']?.['bank_account_list'][i]?.['bank_code']
                        let bank_name = data?.['customer_mapped_data']?.['bank_account_list'][i]?.['bank_name']
                        bankNumberEle.append(`
                            <option value="${data?.['customer_mapped_data']?.['bank_account_list'][i]?.['id']}">${bank_name} (${bank_code}) - ${bank_account_number} (${bank_account_name})</option>
                        `)
                    }
                    billingAddressEle.val(data?.['customer_mapped_data']?.['billing_address_id'])
                    bankNumberEle.val(data?.['customer_mapped_data']?.['bank_account_id'])
                    invoiceMethodEle.val(data?.['invoice_method'])
                    if (data?.['invoice_method'] === 1) {
                        bankNumberEle.closest('.form-group').find('label').removeClass('required')
                    }
                    else {
                        bankNumberEle.closest('.form-group').find('label').addClass('required')
                    }
                    ARInvoiceLoadPage.LoadSaleOrder(data?.['sale_order_mapped_data'])
                    saleOrderEle.prop('disabled', false)

                    postingDateEle.val(moment(data?.['posting_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    documentDateEle.val(moment(data?.['document_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    invoiceDateEle.val(moment(data?.['invoice_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    invoice_sign.val(data?.['invoice_sign'])
                    $('#invoice-number').val(data?.['invoice_number'])
                    $('#invoice-status').val(
                        ['Khởi tạo', 'Đã phát hành', 'Đã kê khai', 'Đã thay thế', 'Đã điều chỉnh'][data?.['invoice_status']]
                    ).removeClass('text-blue').addClass(
                        ['text-blue', 'text-primary', 'text-info', 'text-danger', 'text-warning'][data?.['invoice_status']]
                    )
                    invoice_exp.val(data?.['invoice_example'])

                    NormalTable.attr('data-delivery-selected', data?.['delivery_mapped'].map(item => item.id).join(','))

                    if (Object.keys(data?.['sale_order_mapped_data']).length !== 0) {
                        if (data?.['delivery_mapped'].length === 0) {
                            NormalTable.closest('.table_space').prop('hidden', true)
                            DescriptionTable.closest('.table_space').prop('hidden', false)
                            ARInvoiceLoadTab.LoadTableDescriptionForDetailPage(data?.['item_mapped'].sort((a, b) => a.item_index - b.item_index), option)
                        }
                        else {
                            NormalTable.closest('.table_space').prop('hidden', false)
                            DescriptionTable.closest('.table_space').prop('hidden', true)
                            ARInvoiceLoadTab.LoadTableNormalForDetailPage(data?.['item_mapped'].sort((a, b) => a.item_index - b.item_index), option)
                        }
                    }
                    else {
                        NormalTable.closest('.table_space').prop('hidden', false)
                        DescriptionTable.closest('.table_space').prop('hidden', true)
                        ARInvoiceLoadTab.LoadTableNormalForDetailPage(data?.['item_mapped'].sort((a, b) => a.item_index - b.item_index), option)
                    }

                    if (Object.keys(data?.['sale_order_mapped_data']).length > 0) {
                        btn_for_delivery_ar.removeClass('disabled')
                    }
                    else {
                        btn_for_delivery_ar.addClass('disabled')
                    }
                    if (Object.keys(data?.['sale_order_mapped_data']).length > 0) {
                        btn_add_optionally.addClass('disabled')
                    }
                    else {
                        btn_add_optionally.removeClass('disabled')
                    }

                    new $x.cls.file($('#attachment')).init({
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    $.fn.initMaskMoney2();

                    UsualLoadPageFunction.DisablePage(
                        option==='detail',
                        ['#view-tax-code-info', '#view-payment-term']
                    )
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

invoiceMethodEle.on('change', function () {
    if ($(this).val() === '1') {
        bankNumberEle.closest('.form-group').find('label').removeClass('required')
    }
    else {
        bankNumberEle.closest('.form-group').find('label').addClass('required')
    }
})

customerSelectBtn.on('click', function () {
    ARInvoiceLoadPage.LoadCustomer()
})

selectCustomerBtn.on('click', function () {
    let selected_obj = null
    $('input[name="customer-selected-radio"]').each(async function () {
        if ($(this).prop('checked')) {
            selected_obj = $(this).attr('data-customer') ? JSON.parse($(this).attr('data-customer')) : {}
            customerNameEle.val(selected_obj?.['name']).attr('data-id', selected_obj?.['id']).prop('readonly', true).prop('disabled', true)
            tax_codeEle.val(selected_obj?.['tax_code']).prop('readonly', true).prop('disabled', true)
            for (let i = 0; i < (selected_obj?.['billing_address'] || []).length; i++) {
                billingAddressEle.append(`
                    <option ${selected_obj?.['billing_address'][i]?.['is_default'] ? 'selected' : ''} value="${selected_obj?.['billing_address'][i]?.['id']}">${selected_obj?.['billing_address'][i]?.['full_address']}</option>
                `)
            }
            for (let i = 0; i < (selected_obj?.['bank_accounts_mapped'] || []).length; i++) {
                let bank_account_name = selected_obj?.['bank_accounts_mapped'][i]?.['bank_account_name']
                let bank_account_number = selected_obj?.['bank_accounts_mapped'][i]?.['bank_account_number']
                let bank_code = selected_obj?.['bank_accounts_mapped'][i]?.['bank_code']
                let bank_name = selected_obj?.['bank_accounts_mapped'][i]?.['bank_name']
                bankNumberEle.append(`
                    <option value="${selected_obj?.['bank_accounts_mapped'][i]?.['id']}">${bank_name} (${bank_code}) - ${bank_account_number} (${bank_account_name})</option>
                `)
            }
            saleOrderEle.prop('disabled', false)
            ARInvoiceLoadPage.LoadSaleOrder()
            customerSelectModal.modal('hide')

            let [tax_code_status, responseData] = await ARInvoiceAction.CheckTaxCode()
            $('#invalid-tax').prop('hidden', tax_code_status)
            $('#valid-tax').prop('hidden', !tax_code_status)
        }
    })
    if (!selected_obj) {
        $.fn.notifyB({description: 'Nothing selected'}, 'warning');
    }
})

$('#view-tax-code-info').on('click', async function () {
    if (tax_codeEle.val()) {
        let [tax_code_status, responseData] = await ARInvoiceAction.CheckTaxCode()
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

viewPaymentTermEle.on('click', function () {
    let selected_so = SelectDDControl.get_data_from_idx(saleOrderEle, saleOrderEle.val())
    ARInvoiceLoadTab.LoadPaymentTermView(selected_so?.['sale_order_payment_stage'] ? selected_so?.['sale_order_payment_stage'] : [])
})

invoice_exp.on('change', function () {
    // kiểm tra dữ liệu cho hóa đơn điện tử
    // if ($(this).val() === '2') {
    //     if (invoice_signs?.['sale_invoice_sign']) {
    //         invoice_sign.val(invoice_signs?.['sale_invoice_sign'])
    //     } else {
    //         $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'warning')
    //     }
    // }
    // else {
    //     if (NormalTable.find('.product_taxes').length > 0) {
    //         let vat_number = []
    //         NormalTable.find('.product_taxes').each(function () {
    //             if ($(this).val()) {
    //                 let tax_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
    //                 if (vat_number.includes(parseFloat(tax_selected?.['rate'])) === false) {
    //                     vat_number.push(parseFloat(tax_selected?.['rate']))
    //                 }
    //             } else {
    //                 if (vat_number.includes(0) === false) {
    //                     vat_number.push(0)
    //                 }
    //             }
    //         })
    //         if (vat_number.length > 1) {
    //             if (invoice_exp.val() === '0') {
    //                 if (invoice_signs?.['many_vat_sign']) {
    //                     invoice_sign.val(invoice_signs?.['many_vat_sign'])
    //                 } else {
    //                     $.fn.notifyB({description: "Can not get Invoice sign for many tax case. Input in Setting."}, 'warning')
    //                 }
    //             } else if (invoice_exp.val() === '2') {
    //                 if (invoice_signs?.['sale_invoice_sign']) {
    //                     invoice_sign.val(invoice_signs?.['sale_invoice_sign'])
    //                 } else {
    //                     $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'warning')
    //                 }
    //             } else {
    //                 $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
    //             }
    //         } else {
    //             if (invoice_exp.val() === '0') {
    //                 if (invoice_signs?.['one_vat_sign']) {
    //                     invoice_sign.val(invoice_signs?.['one_vat_sign'])
    //                 } else {
    //                     $.fn.notifyB({description: "Can not get Invoice sign for one tax case. Input in Setting."}, 'warning')
    //                 }
    //             } else if (invoice_exp.val() === '2') {
    //                 if (invoice_signs?.['sale_invoice_sign']) {
    //                     invoice_sign.val(invoice_signs?.['sale_invoice_sign'])
    //                 } else {
    //                     $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'warning')
    //                 }
    //             } else {
    //                 $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
    //             }
    //         }
    //     }
    //     else {
    //         invoice_sign.val('')
    //     }
    // }
})

$('#select-delivery-product-btn').on('click', function () {
    NormalTable.closest('.table_space').prop('hidden', false)
    DescriptionTable.closest('.table_space').prop('hidden', true)
    ARInvoiceLoadTab.LoadTableNormal(delivery_product_data.text() ? JSON.parse(delivery_product_data.text()) : [])
    $('#select-delivery-offcanvas').offcanvas('hide')
    let data_product = []
    $('.selected-delivery').each(function () {
        if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
            data_product.push($(this).attr('data-id'))
        }
    })
    NormalTable.attr('data-delivery-selected', data_product.join(','))
})

$('#create_invoice_btn').on('click', function () {
    let combinesData = new ARInvoiceHandle().combinesData($('#form-detail-ar-invoice'), true);
    let pk = $.fn.getPkDetail();
    WindowControl.showLoading();
    $.fn.callAjax2(combinesData).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyB({description: "Successfully"}, 'success')
                setTimeout(() => {
                    window.location.replace($('#form-detail-ar-invoice').attr('data-url-redirect').format_url_with_uuid(pk));
                    location.reload.bind(location);
                }, 1000);
            }
        },
        (errs) => {
            setTimeout(
                () => {
                    WindowControl.hideLoading();
                },
                1000
            )
            $.fn.notifyB({description: errs.data.errors}, 'failure');
        }
    )
})

$('#view_invoice_btn').on('click', function () {
    let pk = $.fn.getPkDetail();
    $(this).closest('a').attr('href', $(this).closest('a').attr('data-href').replace(0, pk) + `?pattern=${invoice_sign.val()}`)
})

btn_select_from_delivery.on('click', function () {
    if (saleOrderEle.val()) {
        ARInvoiceLoadTab.LoadDelivery()
        ARInvoiceLoadTab.LoadDeliveryProduct()
    }
    else {
        $.fn.notifyB({description: "You have not selected Sale order yet."}, 'warning')
    }
})

btn_add_optionally.on('click', function () {
    if (!saleOrderEle.val()) {
        DescriptionTable.closest('.table_space').prop('hidden', true)
        NormalTable.closest('.table_space').prop('hidden', false)
        UsualLoadPageFunction.AddTableRow(NormalTable, {})
        let row_added = NormalTable.find('tbody tr:last-child')
        UsualLoadPageFunction.LoadProduct({
            element: row_added.find('.product-select'),
            data_url: scriptUrlEle.attr('data-url-product-list')
        })
    }
    else {
        $.fn.notifyB({description: "You have selected Sale order already."}, 'warning')
    }
})

btn_add_des.on('click', function () {
    if (saleOrderEle.val()) {
        NormalTable.closest('.table_space').prop('hidden', true)
        DescriptionTable.closest('.table_space').prop('hidden', false)
        UsualLoadPageFunction.AddTableRow(DescriptionTable, {})
        let row_added = DescriptionTable.find('tbody tr:last-child')
        UsualLoadPageFunction.LoadTax({
            element: row_added.find('.product_taxes'),
            data_url: scriptUrlEle.attr('data-url-tax-list')
        })
    }
    else {
        $.fn.notifyB({description: "You have not selected Sale order yet."}, 'warning')
    }
})

$(document).on("change", '.product-select', function () {
    if ($(this).val()) {
        let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
        $(this).closest('tr').find('.product-des').attr('title', selected?.['description'] ? selected?.['description'] : '')
        UsualLoadPageFunction.LoadUOM({
            element: $(this).closest('tr').find('.uom-select'),
            data: selected?.['sale_default_uom'] || {},
            data_params: {'group_id': selected?.['general_uom_group']?.['id']},
            data_url: scriptUrlEle.attr('data-url-uom-list')
        })
        UsualLoadPageFunction.LoadTax({
            element: $(this).closest('tr').find('.product_taxes'),
            data_params: {'group_id': selected?.['general_uom_group']?.['id']},
            data_url: scriptUrlEle.attr('data-url-tax-list')
        })
    }
})

$(document).on("change", '.selected-delivery', function () {
    // xử lí dữ liệu product delivery
    let data_product = []
    let data_product_already = []
    $('.selected-delivery').each(function () {
        if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
            data_product = data_product.concat($(this).closest('div').find('.details').text() ? JSON.parse($(this).closest('div').find('.details').text()) : [])
        }

        if ($(this).prop('checked') && $(this).attr('data-already') === '1') {
            data_product_already = data_product_already.concat($(this).closest('div').find('.details').text() ? JSON.parse($(this).closest('div').find('.details').text()) : [])
        }
    })

    const merged_data_product = {};
    data_product.forEach(entry => {
        if (parseFloat(entry?.['picked_quantity']) > 0) {
            const productId = entry?.['product_data']?.['id'];

            if (!merged_data_product[productId]) {
                merged_data_product[productId] = {
                    product_data: entry?.['product_data'],
                    uom_data: entry?.['uom_data'],
                    delivery_quantity: entry?.['delivery_quantity'],
                    delivered_quantity_before: data_product_already
                        .filter(item => item?.['product_data']?.['id'] === productId)
                        .reduce((sum, item) => sum + item?.['picked_quantity'], 0),
                    picked_quantity: 0,
                    data_from_so: entry?.['data_from_so'],
                };
            }

            merged_data_product[productId].picked_quantity += entry?.['picked_quantity'];
        }
    });
    data_product = Object.values(merged_data_product);

    ARInvoiceLoadTab.LoadDeliveryProduct(data_product)
    delivery_product_data.text(JSON.stringify(data_product))
})

$(document).on("change", '.product_unit_price', function () {
    let subtotal = parseFloat($(this).attr('value')) * parseFloat($(this).closest('tr').find('.picked_quantity').text())
    $(this).closest('tr').find('.product_subtotal_price').attr('data-init-money', subtotal)
    $.fn.initMaskMoney2()
})

$(document).on("change", '.product_discount_value', function () {
    ARInvoiceAction.CalculatePrice()
})

$(document).on("click", '.delete-item-row', function () {
    UsualLoadPageFunction.DeleteTableRow(
        $(this).closest('tr').find('.picked_quantity').length === 0 ? DescriptionTable : NormalTable,
        parseInt($(this).closest('tr').find('td:first-child').text())
    )
    ARInvoiceAction.CalculatePrice($(this).closest('tr').find('.picked_quantity').length === 1 ? 'normal' : 'des')
})

$(document).on("change", '.recalculate-field', function () {
    ARInvoiceAction.CalculatePriceRow($(this).closest('tr'), $(this).closest('tr').find('.picked_quantity').length === 1 ? 'normal' : 'des')
    ARInvoiceAction.CalculatePrice($(this).closest('tr').find('.picked_quantity').length === 1 ? 'normal' : 'des')
    // kiểm tra dữ liệu cho hóa đơn điện tử
    // let vat_number = []
    // NormalTable.find('.product_taxes').each(function () {
    //     if ($(this).val()) {
    //         let tax_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
    //         if (vat_number.includes(parseFloat(tax_selected?.['rate'])) === false) {
    //             vat_number.push(parseFloat(tax_selected?.['rate']))
    //         }
    //     }
    //     else {
    //         if (vat_number.includes(0) === false) {
    //             vat_number.push(0)
    //         }
    //     }
    // })
    // if (vat_number.length > 1) {
    //     if (invoice_exp.val() === '0') {
    //         if (invoice_signs?.['many_vat_sign']) {
    //             invoice_sign.val(invoice_signs?.['many_vat_sign'])
    //         } else {
    //             $.fn.notifyB({description: "Can not get Invoice sign for many tax case. Input in Setting."}, 'warning')
    //         }
    //     }
    //     else if (invoice_exp.val() === '2') {
    //         if (invoice_signs?.['sale_invoice_sign']) {
    //             invoice_sign.val(invoice_signs?.['sale_invoice_sign'])
    //         } else {
    //             $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'warning')
    //         }
    //     }
    //     else {
    //         $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
    //     }
    // } else {
    //     if (invoice_exp.val() === '0') {
    //         if (invoice_signs?.['one_vat_sign']) {
    //             invoice_sign.val(invoice_signs?.['one_vat_sign'])
    //         } else {
    //             $.fn.notifyB({description: "Can not get Invoice sign for one tax case. Input in Setting."}, 'warning')
    //         }
    //     }
    //     else if (invoice_exp.val() === '2') {
    //         if (invoice_signs?.['sale_invoice_sign']) {
    //             invoice_sign.val(invoice_signs?.['sale_invoice_sign'])
    //         } else {
    //             $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'warning')
    //         }
    //     }
    //     else {
    //         $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
    //     }
    // }
})

$(document).on("change", '.product_discount_rate', function () {
    if ($(this).val() < 0) {
        $(this).val(0)
    }
})

$(document).on("change", '.picked_quantity', function () {
    if ($(this).val() < 0) {
        $(this).val(0)
    }
})
