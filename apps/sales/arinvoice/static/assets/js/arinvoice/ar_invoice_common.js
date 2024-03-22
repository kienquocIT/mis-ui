const scriptUrlEle = $('#script-url')
const scriptTransEle = $('#script-trans')
const tableSelectCustomerEle = $('#table-select-customer')
const selectCustomerBtn = $('#select-customer-btn')
const customerCodeEle = $('#customer-code')
const customerSelectModal = $('#customer-select-modal')
const saleOrderEle = $('#sale-order')
const tableSelectDeliveryEle = $('#table-select-delivery')
const tableDetailProductEle = $('#table-product-detail')
const dataLineDetailTableScript = $('#data-line-detail-table')
const tabLineDetailTable = $('#tab_line_detail_datatable')
const postingDateEle = $('#posting-date')
const documentDateEle = $('#document-date')
const invoiceDateEle= $('#invoice-date')
const customerSelectBtn = $('#customer-select-btn')
let EZ_invoice_headers = null


postingDateEle.daterangepicker({
    singleDatePicker: true,
    timePicker: true,
    showDropdowns: false,
    minYear: 1901,
    locale: {
        format: 'YYYY-MM-DD'
    },
    "cancelClass": "btn-secondary",
    maxYear: parseInt(moment().format('YYYY'), 10)
}).val('');

documentDateEle.daterangepicker({
    singleDatePicker: true,
    timePicker: true,
    showDropdowns: false,
    minYear: 1901,
    locale: {
        format: 'YYYY-MM-DD'
    },
    "cancelClass": "btn-secondary",
    maxYear: parseInt(moment().format('YYYY'), 10)
}).val('');

invoiceDateEle.daterangepicker({
    singleDatePicker: true,
    timePicker: true,
    showDropdowns: false,
    minYear: 1901,
    locale: {
        format: 'YYYY-MM-DD'
    },
    "cancelClass": "btn-secondary",
    maxYear: parseInt(moment().format('YYYY'), 10)
}).val('');

selectCustomerBtn.on('click', function () {
    let selected_id = null
    let selected_name = ''
    $('input[name="customer-selected-radio"]').each(function () {
        if ($(this).prop('checked')) {
            selected_id = $(this).attr('data-id')
            selected_name = $(this).attr('data-name')
        }
    })
    if (selected_id) {
        customerCodeEle.val(selected_name)
        customerCodeEle.attr('data-id', selected_id)
        customerSelectModal.modal('hide')
        loadSaleOrder()
    }
    else {
        $.fn.notifyB({description: 'Nothing selected'}, 'warning');
    }
})

customerSelectBtn.on('click', function () {
    // loadSaleOrder({})
})

function loadTableSelectDelivery() {
    tableSelectDeliveryEle.DataTable().clear().destroy()
    tableSelectDeliveryEle.DataTableDefault({
        dom: "<'d-flex dtb-header-toolbar'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>rt",
        useDataServer: true,
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        ajax: {
            url: scriptUrlEle.attr('data-url-delivery-list') + '?sale_order_id=' + saleOrderEle.val(),
            type: 'GET',
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#select-delivery-offcanvas').offcanvas('show')
                    // console.log(resp.data['delivery_list'])
                    return resp.data['delivery_list'];
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
                    return `<span class="text-primary">${row.code}</span>`
                }
            },
            {
                data: 'name',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let content = ''
                    if (row.times === 1) {
                        content = `${scriptTransEle.attr('data-trans-delivery-for')} 1st ${scriptTransEle.attr('data-trans-delivery-time')}`
                    }
                    else if (row.times === 2) {
                        content = `${scriptTransEle.attr('data-trans-delivery-for')} 2nd ${scriptTransEle.attr('data-trans-delivery-time')}`
                    }
                    else if (row.times === 3) {
                        content = `${scriptTransEle.attr('data-trans-delivery-for')} 3rd ${scriptTransEle.attr('data-trans-delivery-time')}`
                    }
                    else {
                        content = `${scriptTransEle.attr('data-trans-delivery-for')} ${row?.['times']}th ${scriptTransEle.attr('data-trans-delivery-time')}`
                    }
                    return `${content}`
                }
            },
            {
                data: 'already',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    if (row?.['already']) {
                        return `<i class="fas fa-check-circle"></i>`
                    }
                    return ``
                }
            },
            {
                data: 'select',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    if (row?.['already']) {
                        let details = JSON.stringify(row.details)
                        return `<div class="form-check" hidden>
                                    <input checked data-already="1" data-id="${row.id}" type="checkbox" name="selected-delivery" class="form-check-input selected-delivery">
                                    <label class="form-check-label"></label>
                                    <script class="details">${details}</script>
                                </div>`
                    }
                    else {
                        let details = JSON.stringify(row.details)
                        return `<div class="form-check">
                                    <input data-already="0" data-id="${row.id}" type="checkbox" name="selected-delivery" class="form-check-input selected-delivery">
                                    <label class="form-check-label"></label>
                                    <script class="details">${details}</script>
                                </div>`
                    }
                }
            },
        ]
    });
}

$(document).on("change", '.selected-delivery', function () {
    SelectDeliveryOnChange()
})

function SelectDeliveryOnChange() {
    let data_product_already = []
    $('.selected-delivery').each(function () {
        if ($(this).prop('checked') && $(this).attr('data-already') === '1') {
            data_product_already = data_product_already.concat(JSON.parse($(this).closest('div').find('.details').text()))
        }
    })

    let data_product = []
    $('.selected-delivery').each(function () {
        if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
            data_product = data_product.concat(JSON.parse($(this).closest('div').find('.details').text()))
        }
    })

    const merged_data_product = {};
    data_product.forEach(entry => {
        if (parseFloat(entry.picked_quantity) > 0) {
            const productId = entry.product_data.id;

            if (!merged_data_product[productId]) {
                merged_data_product[productId] = {
                    product_data: entry.product_data,
                    uom_data: entry.uom_data,
                    delivery_quantity: entry.delivery_quantity,
                    delivered_quantity_before: data_product_already
                        .filter(item => item?.['product_data']?.['id'] === productId)
                        .reduce((sum, item) => sum + item?.['picked_quantity'], 0),
                    picked_quantity: 0,
                    data_from_so: entry.data_from_so,
                };
            }

            merged_data_product[productId].picked_quantity += entry.picked_quantity;
        }
    });
    data_product = Object.values(merged_data_product);

    loadTableSelectDetailProduct(data_product)
    dataLineDetailTableScript.text(JSON.stringify(data_product))
}

function loadTableSelectDetailProduct(datasource=[]) {
    tableDetailProductEle.DataTable().clear().destroy()
    tableDetailProductEle.DataTableDefault({
        dom: "<'d-flex dtb-header-toolbar'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>rt",
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
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

function loadTableLineDetail(datasource=[]) {
    tabLineDetailTable.DataTable().clear().destroy()
    tabLineDetailTable.DataTableDefault({
        dom: "<'d-flex dtb-header-toolbar'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>rt",
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        data: datasource,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                data: 'product_data__title',
                className: 'wrap-text text-primary',
                render: (data, type, row) => {
                    return `<span class="product-id" data-id="${row?.['product_data']?.['id']}"><b>${row?.['product_data']?.['title']}</b></span>`
                }
            },
            {
                data: 'product_data__des',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="w-90">${row?.['data_from_so']?.['product_description']}</span>`
                }
            },
            {
                data: 'uom_data__title',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<span class="uom-id" data-id="${row?.['uom_data']?.['id']}">${row?.['uom_data']?.['title']}</span>`
                }
            },
            {
                data: 'picked_quantity',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<span class="picked_quantity">${row?.['picked_quantity']}</span>`
                }
            },
            {
                data: 'product_unit_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input disabled readonly class="product_unit_price mask-money form-control w-80" value="${row?.['data_from_so']?.['product_unit_price']}">`
                }
            },
            {
                data: 'product_subtotal_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product_subtotal_price mask-money text-primary" data-init-money="${row?.['data_from_so']?.['product_unit_price'] * row?.['picked_quantity']}"></span>`
                }
            },
            {
                data: 'product_discount_rate',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<div class="input-affix-wrapper w-80">
                                <input disabled readonly type="number" class="form-control product_discount_rate" value="${row?.['data_from_so']?.['product_discount_value']}">
                                <div class="input-suffix"><i class="fas fa-percentage"></i></div>
                            </div>`
                }
            },
            {
                data: 'product_discount_value',
                className: 'wrap-text hidden',
                render: (data, type, row) => {
                    return `<span class="product_discount_value mask-money text-primary" data-init-money="${row?.['data_from_so']?.['product_discount_value'] / 100 * row?.['data_from_so']?.['product_unit_price'] * row?.['picked_quantity']}"></span>`
                }
            },
            {
                data: 'product_tax_rate',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="text-primary product_taxes" data-tax-rate="${row?.['data_from_so']?.['product_tax_value']}" data-tax-amount="${row?.['data_from_so']?.['product_tax_amount']}">${row?.['data_from_so']?.['product_tax_title']}</span>`
                }
            },
            {
                data: 'product_tax_value',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let subtotal = row?.['data_from_so']?.['product_unit_price'] * row?.['picked_quantity']
                    let discount = subtotal * row?.['data_from_so']?.['product_discount_value'] / 100
                    let tax_value = (subtotal - discount) * row?.['data_from_so']?.['product_tax_value'] / 100
                    console.log(subtotal, discount, tax_value)
                    return `<span class="mask-money text-primary product_taxes_value" data-init-money="${tax_value}"></span>`
                }
            },
            {
                data: 'product_subtotal_price_final',
                className: 'wrap-text hidden',
                render: (data, type, row) => {
                    let subtotal = row?.['data_from_so']?.['product_unit_price'] * row?.['picked_quantity']
                    let discount = subtotal * row?.['data_from_so']?.['product_discount_value'] / 100
                    let tax_value = (subtotal - discount) * row?.['data_from_so']?.['product_tax_value'] / 100
                    let final = subtotal - discount + tax_value
                    return `<span class="product_subtotal_price_final mask-money text-primary" data-init-money="${final}"></span>`
                }
            }
        ],
        initComplete: function(settings, json) {
            calculatePrice()
        }
    });
}

function loadTableLineDetailForDetailPage(datasource=[], option='detail') {
    tabLineDetailTable.DataTable().clear().destroy()
    tabLineDetailTable.DataTableDefault({
        dom: "<'d-flex dtb-header-toolbar'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>rt",
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        data: datasource,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                data: 'product__title',
                className: 'wrap-text text-primary',
                render: (data, type, row) => {
                    return `<span class="product-id" data-id="${row?.['product']?.['id']}"><b>${row?.['product']?.['title']}</b></span>`
                }
            },
            {
                data: 'product_data__des',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span>${row?.['product']?.['des']}</span>`
                }
            },
            {
                data: 'uom_data__title',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<span class="uom-id" data-id="${row?.['product_uom']?.['id']}">${row?.['product_uom']?.['title']}</span>`
                }
            },
            {
                data: 'picked_quantity',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<span class="picked_quantity">${row?.['product_quantity']}</span>`
                }
            },
            {
                data: 'product_unit_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input disabled readonly class="product_unit_price mask-money form-control w-80" value="${row?.['product_unit_price']}">`
                }
            },
            {
                data: 'product_subtotal_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product_subtotal_price mask-money text-primary" data-init-money="${row?.['product_subtotal']}"></span>`
                }
            },
            {
                data: 'product_discount_rate',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<div class="input-affix-wrapper w-80">
                                <input disabled readonly type="number" class="form-control product_discount_rate" value="${row?.['product_discount_rate']}">
                                <div class="input-suffix"><i class="fas fa-percentage"></i></div>
                            </div>`
                }
            },
            {
                data: 'product_discount_value',
                className: 'wrap-text hidden',
                render: (data, type, row) => {
                    return `<span class="product_discount_value mask-money text-primary" data-init-money="${row?.['product_discount_value']}"></span>`
                }
            },
            {
                data: 'product_tax_rate',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="text-primary product_taxes" data-tax-rate="${row?.['product_tax_rate']}" data-tax-amount="${row?.['product_tax_value']}">${row?.['product_tax_title']}</span>`
                }
            },
            {
                data: 'product_tax_value',
                className: 'wrap-text hidden',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary product_taxes_value" data-init-money="${(row?.['product_subtotal'] - row?.['product_discount_value']) * row?.['product_tax_rate'] / 100}"></span>`
                }
            },
            {
                data: 'product_subtotal_final',
                className: 'wrap-text hidden',
                render: (data, type, row) => {
                    return `<span class="product_subtotal_price_final mask-money text-primary" data-init-money="${row?.['product_subtotal_final']}"></span>`
                }
            }
        ],
        initComplete: function(settings, json) {
            calculatePrice()
        }
    });
}

$(document).on("change", '.product_unit_price', function () {
    let subtotal = parseFloat($(this).attr('value')) * parseFloat($(this).closest('tr').find('.picked_quantity').text())
    $(this).closest('tr').find('.product_subtotal_price').attr('data-init-money', subtotal)
    $.fn.initMaskMoney2()

    calculatePrice()
})

$(document).on("change", '.product_discount_value', function () {
    calculatePrice()
})

function loadTableSelectCustomer() {
    if (!$.fn.DataTable.isDataTable('#table-select-customer')) {
        let frm = new SetupFormSubmit(tableSelectCustomerEle);
        tableSelectCustomerEle.DataTableDefault({
            dom: "<'d-flex dtb-header-toolbar'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>rt",
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
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
                    'render': () => {
                        return ``;
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return row.code
                    }
                },
                {
                    data: 'name',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return row.name
                    }
                },
                {
                    data: 'tax_code',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return row.tax_code
                    }
                },
                {
                    data: 'select',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg">
                                    <input data-id="${row.id}" data-name="${row.name}" type="radio" name="customer-selected-radio" class="form-check-input">
                                </div>`
                    }
                },
            ],
        });
    }
}

function loadSaleOrder(data) {
    saleOrderEle.initSelect2({
        allowClear: true,
        ajax: {
            url: saleOrderEle.attr('data-url') + `?customer_id=${customerCodeEle.attr('data-id')}`,
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            console.log(resp.data[keyResp])
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].system_status === 3) {
                    result.push(resp.data[keyResp][i])
                }
            }
            console.log(result)
            return result;
        },
        templateResult: function(data) {
            let opp_code = data.data?.['opportunity']?.['code']
            if (data.data?.['opportunity']?.['code'] === undefined) {
                opp_code = ''
            }
            let ele = $('<div class="row"></div>');
            ele.append(`<div class="col-3"><span class="badge badge-soft-secondary">${opp_code}</span></div>
                        <div class="col-3"><span class="badge badge-soft-primary">${data.data?.['code']}</span></div>
                        <div class="col-6">${data.data?.['title']}</div>`);
            return ele;
        },
        data: (data ? data : null),
        keyResp: 'sale_order_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        if (saleOrderEle.val()) {
            loadTableSelectDelivery()
        }
    })
}

$('#add-product-btn').on('click', function () {
    loadTableLineDetail(JSON.parse(dataLineDetailTableScript.text()))
    $('#select-delivery-offcanvas').offcanvas('hide')
    let data_product = []
    $('.selected-delivery').each(function () {
        if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
            data_product.push($(this).attr('data-id'))
        }
    })
    tabLineDetailTable.attr('data-delivery-selected', data_product.join(','))
})

$('#btn-add-row-line-detail').on('click', function () {
    if (saleOrderEle.val()) {
        loadTableSelectDetailProduct([])
        loadTableSelectDelivery()
    }
    else {
        $.fn.notifyB({description: "You have not selected Sale order yet"}, 'warning')
    }
})

function calculatePrice() {
    let sum_unit_price = 0
    let sum_taxes = 0
    let sum_subtotal_price = 0
    let sum_discount = 0
    tabLineDetailTable.find('tbody tr').each(function () {
        if ($(this).find('.product_unit_price').length > 0) {
            sum_unit_price += parseFloat($(this).find('.product_unit_price').attr('value'))
        }
        if ($(this).find('.product_subtotal_price').length > 0 && $(this).find('.product_discount_rate').length > 0) {
            sum_subtotal_price += parseFloat($(this).find('.product_subtotal_price').attr('data-init-money'))
            sum_discount += parseFloat($(this).find('.product_discount_value').attr('data-init-money'))
        }
        if ($(this).find('.product_taxes').length > 0) {
            sum_taxes += parseFloat($(this).find('.product_taxes_value').attr('data-init-money'))
        }
    })
    $('#pretax-value').attr('data-init-money', sum_subtotal_price)
    $('#taxes-value').attr('data-init-money', sum_taxes)
    $('#discount-all').attr('data-init-money', sum_discount)
    $('#total-value').attr('data-init-money', sum_subtotal_price + sum_taxes - sum_discount)

    $.fn.initMaskMoney2()
}

class ARInvoiceHandle {
    load() {
        loadTableLineDetail([])
        loadTableSelectCustomer()
    }
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = $('#name').val()
        frm.dataForm['customer_mapped'] = customerCodeEle.attr('data-id')
        frm.dataForm['customer_name'] = customerCodeEle.val()
        frm.dataForm['sale_order_mapped'] = saleOrderEle.val()
        frm.dataForm['posting_date'] = postingDateEle.val()
        frm.dataForm['document_date'] = documentDateEle.val()
        frm.dataForm['invoice_date'] = invoiceDateEle.val()
        frm.dataForm['invoice_sign'] = $('#invoice-sign').val()
        frm.dataForm['invoice_number'] = $('#invoice-number').val()
        frm.dataForm['invoice_example'] = $('#invoice-exp').val()
        frm.dataForm['delivery_mapped_list'] = tabLineDetailTable.attr('data-delivery-selected').split(',')

        frm.dataForm['data_item_list'] = []
        tabLineDetailTable.find('tbody tr').each(function () {
            if ($(this).find('.product-id').length > 0) {
                frm.dataForm['data_item_list'].push({
                    'item_index': $(this).find('td:first-child').text(),
                    'product_id': $(this).find('.product-id').attr('data-id'),
                    'product_uom_id': $(this).find('.uom-id').attr('data-id'),
                    'product_quantity': $(this).find('.picked_quantity').text(),
                    'product_unit_price': $(this).find('.product_unit_price').attr('value'),
                    'product_subtotal': $(this).find('.product_subtotal_price').attr('data-init-money'),
                    'product_discount_rate': $(this).find('.product_discount_rate').attr('value'),
                    'product_discount_value': parseFloat($(this).find('.product_discount_rate').attr('value')) * parseFloat($(this).find('.product_subtotal_price').attr('data-init-money')) / 100,
                    'product_tax_rate': $(this).find('.product_taxes').attr('data-tax-rate'),
                    'product_tax_title': $(this).find('.product_taxes').text(),
                    'product_tax_value': $(this).find('.product_taxes_value').attr('data-init-money'),
                    'product_subtotal_final': $(this).find('.product_subtotal_price_final').attr('data-init-money')
                })
            }
        })

        // frm.dataForm['system_status'] = 1;

        if (frm.dataForm['data_item_list'].length === 0) {
            $.fn.notifyB({description: "No item in tab line detail"}, 'failure')
            return false
        }

        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}

function Disabled(option) {
    if (option === 'detail') {
        $('#collapse-area input').prop('readonly', true).prop('disabled', true)
        $('#collapse-area select').prop('disabled', true)
        $('tr input').prop('readonly', true).prop('disabled', true)
        customerSelectBtn.addClass('disabled')
    }
}

function LoadDetailARInvoice(option) {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-ar-invoice').attr('data-url-detail-api').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['ar_invoice_detail'];
                $x.fn.renderCodeBreadcrumb(data);

                $('#easy_invoice_type').text(data?.['easy_invoice_type'])
                if (data?.['easy_invoice_type'] === null) {
                    $('#view_invoice_btn').closest('a').remove()
                }

                $('#name').val(data?.['title'])
                customerCodeEle.val(data?.['customer_mapped']?.['name'])
                customerCodeEle.attr('data-id', data?.['customer_mapped']?.['id'])
                loadSaleOrder(data?.['sale_order_mapped'])
                postingDateEle.val(data?.['posting_date'].split(' ')[0])
                documentDateEle.val(data?.['document_date'].split(' ')[0])
                invoiceDateEle.val(data?.['invoice_date'].split(' ')[0])
                $('#invoice-sign').val(data?.['invoice_sign'])
                $('#invoice-number').val(data?.['invoice_number'])
                $('#invoice-exp').val(data?.['invoice_example'])

                tabLineDetailTable.attr('data-delivery-selected', data?.['delivery_mapped'].map(item => item.id).join(','))

                loadTableLineDetailForDetailPage(data?.['item_mapped'].sort((a, b) => a.item_index - b.item_index), option)

                Disabled(option)

                new $x.cls.file($('#attachment')).init({
                    enable_edit: option !== 'detail',
                    data: data.attachment,
                })

                $.fn.initMaskMoney2();
            }
        })
}

$('#create_invoice_btn').on('click', function () {
    let combinesData = new ARInvoiceHandle().combinesData($('#form-detail-ar-invoice'), true);
    let pk = $.fn.getPkDetail();
    WindowControl.showLoading();
    combinesData['data']['create_invoice'] = true
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
    $(this).closest('a').attr('href', $(this).closest('a').attr('data-href').replace(0, pk) + `?pattern=${$('#easy_invoice_type').text()}`)
})
