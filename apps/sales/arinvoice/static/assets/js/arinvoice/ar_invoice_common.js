const scriptUrlEle = $('#script-url')
const scriptTransEle = $('#script-trans')
const tableSelectCustomerEle = $('#table-select-customer')
const selectCustomerBtn = $('#select-customer-btn')
const customerNameEle = $('#customer-name')
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
let invoice_signs_Ele = $('#invoice_signs')
const invoice_signs = invoice_signs_Ele.text() ? JSON.parse(invoice_signs_Ele.text()) : {};


postingDateEle.daterangepicker({
    singleDatePicker: true,
    timepicker: false,
    showDropdowns: false,
    minYear: 2023,
    locale: {
        format: 'DD/MM/YYYY'
    },
    maxYear: parseInt(moment().format('YYYY'), 10),
    drops: 'up',
    autoApply: true,
});

documentDateEle.daterangepicker({
    singleDatePicker: true,
    timepicker: false,
    showDropdowns: false,
    minYear: 2023,
    locale: {
        format: 'DD/MM/YYYY'
    },
    maxYear: parseInt(moment().format('YYYY'), 10),
    drops: 'up',
    autoApply: true,
});

invoiceDateEle.daterangepicker({
    singleDatePicker: true,
    timepicker: false,
    showDropdowns: false,
    minYear: 2023,
    locale: {
        format: 'DD/MM/YYYY'
    },
    maxYear: parseInt(moment().format('YYYY'), 10),
    drops: 'up',
    autoApply: true,
});

selectCustomerBtn.on('click', function () {
    let selected_id = null
    let selected_code = ''
    let selected_name = ''
    let selected_tax = ''
    let selected_billing_address = ''
    let selected_bank_code = ''
    let selected_bank_number = ''
    $('input[name="customer-selected-radio"]').each(function () {
        if ($(this).prop('checked')) {
            selected_id = $(this).attr('data-id')
            selected_name = $(this).attr('data-name')
            selected_code = $(this).attr('data-code')
            selected_tax = $(this).attr('data-tax-number')
            selected_billing_address = $(this).attr('data-billing-address')
            selected_bank_code = $(this).attr('data-bank-name')
            selected_bank_number = $(this).attr('data-bank-number')
        }
    })
    if (selected_id) {
        customerCodeEle.val(selected_code)
        customerNameEle.val(selected_name).attr('data-id', selected_id)
        $('#mst').val(selected_tax)
        $('#billing-address').val(selected_billing_address)
        $('#bank-code').val(selected_bank_code)
        $('#bank-number').val(selected_bank_number)

        customerSelectModal.modal('hide')
        loadSaleOrder()
        $('.for-free-input').prop('readonly', true).prop('disabled', true)
        saleOrderEle.prop('disabled', false)
        $('#add_row_items_btn').prop('hidden', true)
        $('#edit_items_btn').prop('hidden', false)
    }
    else {
        $.fn.notifyB({description: 'Nothing selected'}, 'warning');
    }
})

$('#invoice-exp').on('change', function () {
    if ($(this).val() === '2') {
        if (invoice_signs?.['sale_invoice_sign']) {
            $('#invoice-sign').val(invoice_signs?.['sale_invoice_sign'])
        } else {
            $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'failure')
        }
    }
    else {
        if (tabLineDetailTable.find('.product_taxes').length > 0) {
            let vat_number = []
            tabLineDetailTable.find('.product_taxes').each(function () {
                if ($(this).val()) {
                    let tax_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
                    if (vat_number.includes(parseFloat(tax_selected?.['rate'])) === false) {
                        vat_number.push(parseFloat(tax_selected?.['rate']))
                    }
                } else {
                    if (vat_number.includes(0) === false) {
                        vat_number.push(0)
                    }
                }
            })
            if (vat_number.length > 1) {
                if ($('#invoice-exp').val() === '0') {
                    if (invoice_signs?.['many_vat_sign']) {
                        $('#invoice-sign').val(invoice_signs?.['many_vat_sign'])
                    } else {
                        $.fn.notifyB({description: "Can not get Invoice sign for many tax case. Input in Setting."}, 'failure')
                    }
                } else if ($('#invoice-exp').val() === '2') {
                    if (invoice_signs?.['sale_invoice_sign']) {
                        $('#invoice-sign').val(invoice_signs?.['sale_invoice_sign'])
                    } else {
                        $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'failure')
                    }
                } else {
                    $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
                }
            } else {
                if ($('#invoice-exp').val() === '0') {
                    if (invoice_signs?.['one_vat_sign']) {
                        $('#invoice-sign').val(invoice_signs?.['one_vat_sign'])
                    } else {
                        $.fn.notifyB({description: "Can not get Invoice sign for one tax case. Input in Setting."}, 'failure')
                    }
                } else if ($('#invoice-exp').val() === '2') {
                    if (invoice_signs?.['sale_invoice_sign']) {
                        $('#invoice-sign').val(invoice_signs?.['sale_invoice_sign'])
                    } else {
                        $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'failure')
                    }
                } else {
                    $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
                }
            }
        }
        else {
            $('#invoice-sign').val('')
        }
    }
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
    if (datasource.length > 0) {
        let vat_number = []
        for (const item of datasource) {
            if (item?.['picked_quantity'] > 0 && vat_number.includes(item?.['data_from_so']?.['product_tax_value']) === false) {
                vat_number.push(item?.['data_from_so']?.['product_tax_value'])
            }
        }
        if (vat_number.length > 1) {
            if ($('#invoice-exp').val() === '0') {
                if (invoice_signs?.['many_vat_sign']) {
                    $('#invoice-sign').val(invoice_signs?.['many_vat_sign'])
                } else {
                    $.fn.notifyB({description: "Can not get Invoice sign for many tax case. Input in Setting."}, 'failure')
                    return;
                }
            }
            else if ($('#invoice-exp').val() === '2') {
                if (invoice_signs?.['sale_invoice_sign']) {
                    $('#invoice-sign').val(invoice_signs?.['sale_invoice_sign'])
                } else {
                    $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'failure')
                }
            }
            else {
                $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
                return;
            }
        } else {
            if ($('#invoice-exp').val() === '0') {
                if (invoice_signs?.['one_vat_sign']) {
                    $('#invoice-sign').val(invoice_signs?.['one_vat_sign'])
                } else {
                    $.fn.notifyB({description: "Can not get Invoice sign for one tax case. Input in Setting."}, 'failure')
                    return;
                }
            }
            else if ($('#invoice-exp').val() === '2') {
                if (invoice_signs?.['sale_invoice_sign']) {
                    $('#invoice-sign').val(invoice_signs?.['sale_invoice_sign'])
                } else {
                    $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'failure')
                }
            }
            else {
                $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
                return;
            }
        }
    }

    tabLineDetailTable.DataTable().clear().destroy()
    tabLineDetailTable.DataTableDefault({
        dom: "",
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
                    return `<span class="small">${row?.['data_from_so']?.['product_description']}</span>`
                }
            },
            {
                data: 'uom_data__title',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="uom-id" data-id="${row?.['uom_data']?.['id']}">${row?.['uom_data']?.['title']}</span>`
                }
            },
            {
                data: 'picked_quantity',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input type="number" disabled readonly value="${row?.['picked_quantity']}" class="form-control picked_quantity recalculate-field">`
                }
            },
            {
                data: 'product_unit_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input class="recalculate-field product_unit_price mask-money form-control" value="${row?.['data_from_so']?.['product_unit_price']}">`
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
                    return `<div class="input-affix-wrapper">
                                <input type="number" class="recalculate-field form-control product_discount_rate" value="${row?.['data_from_so']?.['product_discount_value']}">
                                <div class="input-suffix"><i class="fas fa-percentage"></i></div>
                            </div>`
                }
            },
            {
                data: 'product_discount_value',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product_discount_value mask-money text-danger" data-init-money="${row?.['data_from_so']?.['product_discount_value'] / 100 * row?.['data_from_so']?.['product_unit_price'] * row?.['picked_quantity']}"></span>`
                }
            },
            {
                data: 'product_tax_rate',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<select data-tax-rate="0" class="recalculate-field form-select select2 product_taxes"></select>
                            <script class="script_product_taxes" data-tax-id="${row?.['data_from_so']?.['tax']}" data-tax-rate="${row?.['data_from_so']?.['product_tax_value']}" data-tax-title="${row?.['data_from_so']?.['product_tax_title']}"></script>`
                }
            },
            {
                data: 'product_tax_value',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let subtotal = row?.['data_from_so']?.['product_unit_price'] * row?.['picked_quantity']
                    let discount = subtotal * row?.['data_from_so']?.['product_discount_value'] / 100
                    let tax_value = (subtotal - discount) * row?.['data_from_so']?.['product_tax_value'] / 100
                    return `<span class="mask-money text-primary product_taxes_value" data-init-money="${tax_value}"></span>`
                }
            },
            {
                data: 'product_subtotal_price_final',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let subtotal = row?.['data_from_so']?.['product_unit_price'] * row?.['picked_quantity']
                    let discount = subtotal * row?.['data_from_so']?.['product_discount_value'] / 100
                    let tax_value = (subtotal - discount) * row?.['data_from_so']?.['product_tax_value'] / 100
                    let final = subtotal - discount + tax_value
                    return `<span class="product_subtotal_price_final mask-money text-primary" data-init-money="${final}"></span>`
                }
            },
            {
                className: 'wrap-text text-center',
                render: () => {
                    return `<button type='button' disabled class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs"><span class="icon"><i class="fas fa-trash"></i></span></button>`;
                }
            },
        ],
        initComplete: function(settings, json) {
            if (datasource.length > 0) {
                tabLineDetailTable.find('tbody tr').each(function () {
                    let tax_script = $(this).find('.script_product_taxes')
                    let tax_select = $(this).find('.product_taxes')
                    loadRowTax(tax_select, {
                        'id': tax_script.attr('data-tax-id'),
                        'title': tax_script.attr('data-tax-title'),
                        'rate': tax_script.attr('data-tax-rate')
                    })
                })
                calculatePrice()
            }
        }
    });
}

function loadTableLineDetailForDetailPage(datasource=[], option='detail', is_free_input=false) {
    tabLineDetailTable.DataTable().clear().destroy()
    let input_disabled = ''
    if (option === 'detail') {
        input_disabled = 'disabled readonly'
    }
    if (is_free_input === false) {
        tabLineDetailTable.DataTableDefault({
            dom: "",
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
                        return `<span class="small">${row?.['product']?.['des']}</span>`
                    }
                },
                {
                    data: 'uom_data__title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="uom-id" data-id="${row?.['product_uom']?.['id']}">${row?.['product_uom']?.['title']}</span>`
                    }
                },
                {
                    data: 'picked_quantity',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<input type="number" disabled readonly value="${row?.['product_quantity']}" class="form-control picked_quantity recalculate-field">`
                    }
                },
                {
                    data: 'product_unit_price',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<input ${input_disabled} class="product_unit_price mask-money form-control" value="${row?.['product_unit_price']}">`
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
                        return `<div class="input-affix-wrapper">
                                    <input ${input_disabled} type="number" class="form-control product_discount_rate recalculate-field" value="${row?.['product_discount_rate']}">
                                    <div class="input-suffix"><i class="fas fa-percentage"></i></div>
                                </div>`
                    }
                },
                {
                    data: 'product_discount_value',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="product_discount_value mask-money text-danger" data-init-money="${row?.['product_discount_value']}"></span>`
                    }
                },
                {
                    data: 'product_tax_rate',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<select data-tax-rate="0" ${input_disabled} class="form-select select2 product_taxes recalculate-field"></select>
                                <script class="script_product_taxes" data-tax-id="${row?.['product_tax']?.['id']}" data-tax-rate="${row?.['product_tax']?.['rate']}" data-tax-title="${row?.['product_tax']?.['title']}"></script>`
                    }
                },
                {
                    data: 'product_tax_value',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="mask-money text-primary product_taxes_value" data-init-money="${row?.['product_tax_value']}"></span>`
                    }
                },
                {
                    data: 'product_subtotal_final',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="product_subtotal_price_final mask-money text-primary" data-init-money="${row?.['product_subtotal_final']}"></span>`
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: () => {
                        return `<button disabled class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs"><span class="icon"><i class="fas fa-trash"></i></span></button>`;
                    }
                },
            ],
            initComplete: function(settings, json) {
                if (datasource.length > 0) {
                    tabLineDetailTable.find('tbody tr').each(function () {
                        let tax_script = $(this).find('.script_product_taxes')
                        let tax_select = $(this).find('.product_taxes')
                        loadRowTax(tax_select, tax_script.attr('data-tax-id') !== 'undefined' ? {
                            'id': tax_script.attr('data-tax-id'),
                            'title': tax_script.attr('data-tax-title'),
                            'rate': tax_script.attr('data-tax-rate')
                        } : null)
                    })
                    calculatePrice()
                }
            }
        });
    }
    else {
        for (const item of datasource) {
            tabLineDetailTable.find('tbody .dataTables_empty').closest('tr').remove()
            let index = tabLineDetailTable.find('tbody tr').length + 1
            let row = $(`
                <tr>
                    <td class="wrap-text">${index}</td>
                    <td class="wrap-text">
                        <select class="form-select select-2 product-select"></select>
                    </td>
                    <td class="wrap-text">
                        <span class="des small">${item?.['product']?.['des']}</span>
                    </td>
                    <td class="wrap-text">
                        <select class="form-select select-2 uom-select"></select>
                    </td>
                    <td class="wrap-text">
                        <input type="number" class="form-control picked_quantity recalculate-field" value="${item?.['product_quantity']}">
                    </td>
                    <td class="wrap-text">
                        <input class="product_unit_price mask-money form-control recalculate-field" value="${item['product_unit_price']}">
                    </td>
                    <td class="wrap-text">
                        <span class="product_subtotal_price mask-money text-primary" data-init-money="${item?.['product_subtotal']}"></span>
                    </td>
                    <td class="wrap-text">
                        <div class="input-affix-wrapper">
                            <input type="number" class="form-control product_discount_rate recalculate-field" value="${item?.['product_discount_rate']}">
                            <div class="input-suffix">
                                <i class="fas fa-percentage"></i>
                            </div>
                        </div>
                    </td>
                    <td class="wrap-text">
                        <span class="product_discount_value mask-money text-danger" data-init-money="${item?.['product_discount_value']}"></span>
                    </td>
                    <td class="wrap-text">
                        <select data-tax-rate="0" class="form-select select2 product_taxes recalculate-field"></select>
                    </td>
                    <td class="wrap-text">
                        <span class="mask-money text-primary product_taxes_value" data-init-money="${item?.['product_tax_value']}"></span>
                    </td>
                    <td class="wrap-text">
                        <span class="product_subtotal_price_final mask-money text-primary" data-init-money="${item?.['product_subtotal_final']}"></span>
                    </td>
                    <td class="wrap-text text-center">
                        <button type='button' class="delete-item-row btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-xs">
                            <span class="icon"><i class="fas fa-trash"></i></span>
                        </button>
                    </td>
                </tr>
            `)
            tabLineDetailTable.find('tbody').append(row)
            row.find('.product-select').initSelect2({
                ajax: {
                    url: scriptUrlEle.attr('data-url-product-list'),
                    method: 'GET',
                },
                data: item?.['product'],
                keyResp: 'product_list',
                keyId: 'id',
                keyText: 'title',
            }).on('change', function () {
                if ($(this).val()) {
                    let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
                    $(this).closest('tr').find('.des').text(selected?.['description'])
                    loadRowUOM(row.find('.uom-select'), null, selected?.['general_uom_group']?.['id'])
                    loadRowTax(row.find('.product_taxes'))
                }
            })
            loadRowUOM(row.find('.uom-select'), item?.['product_uom'], item?.['product_uom']?.['group_id'])
            loadRowTax(row.find('.product_taxes'), item?.['product_tax'])
        }
        calculatePrice()
    }
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
                                    <input type="radio" name="customer-selected-radio" class="form-check-input"
                                           data-id="${row?.['id']}"
                                           data-name="${row?.['name']}"
                                           data-code="${row?.['code']}"
                                           data-tax-number="${row?.['tax_code']}"
                                           data-billing-address="${row?.['billing_address'].length > 0 ? row?.['billing_address'][0]['account_address'] : ''}"
                                           data-bank-name="${row?.['bank_accounts_mapped'].length > 0 ? row?.['bank_accounts_mapped'][0]['bank_name'] : ''}"
                                           data-bank-number="${row?.['bank_accounts_mapped'].length > 0 ? row?.['bank_accounts_mapped'][0]['bank_account_number'] : ''}"
                                    >
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
            url: saleOrderEle.attr('data-url') + `?customer_id=${customerNameEle.attr('data-id')}`,
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].system_status === 3) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        templateResult: function(data) {
            let opp_code = data.data?.['opportunity']?.['code']
            if (data.data?.['opportunity']?.['code'] === undefined) {
                opp_code = ''
            }
            let ele = $('<div class="row"></div>');
            ele.append(`<div class="col-9"><span class="badge badge-soft-primary">${data.data?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['title']}</div>
                        <div class="col-3"><span class="badge badge-soft-secondary">${opp_code}</span></div>`);
            return ele;
        },
        data: (data ? data : null),
        keyResp: 'sale_order_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        if (saleOrderEle.val()) {
            loadTableSelectDelivery()
            $('#add_row_items_btn').prop('hidden', true)
            $('#edit_items_btn').prop('hidden', false)
        }
        else {
            loadTableLineDetail([])
            $('#add_row_items_btn').prop('hidden', false)
            $('#edit_items_btn').prop('hidden', true)
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
    let sum_taxes = 0
    let sum_subtotal_price = 0
    let sum_discount = 0
    tabLineDetailTable.find('tbody tr').each(function () {
        if ($(this).find('.product_subtotal_price').length > 0) {
            sum_subtotal_price += parseFloat($(this).find('.product_subtotal_price').attr('data-init-money'))
        }
        if ($(this).find('.product_discount_value').length > 0) {
            sum_discount += parseFloat($(this).find('.product_discount_value').attr('data-init-money'))
        }
        if ($(this).find('.product_taxes_value').length > 0) {
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
        frm.dataForm['customer_mapped'] = customerNameEle.attr('data-id')
        frm.dataForm['sale_order_mapped'] = saleOrderEle.val()

        frm.dataForm['posting_date'] = moment(postingDateEle.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment(documentDateEle.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['invoice_date'] = moment(invoiceDateEle.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['invoice_sign'] = $('#invoice-sign').val()
        frm.dataForm['invoice_number'] = $('#invoice-number').val()
        frm.dataForm['invoice_example'] = $('#invoice-exp').val()

        frm.dataForm['customer_code'] = customerCodeEle.val()
        frm.dataForm['customer_name'] = customerNameEle.val()
        frm.dataForm['buyer_name'] = $('#buyer-name').val()
        frm.dataForm['customer_tax_number'] = $('#mst').val()
        frm.dataForm['customer_billing_address'] = $('#billing-address').val()
        frm.dataForm['customer_bank_code'] = $('#bank-code').val()
        frm.dataForm['customer_bank_number'] = $('#bank-number').val()

        frm.dataForm['delivery_mapped_list'] = tabLineDetailTable.attr('data-delivery-selected') !== '' ? tabLineDetailTable.attr('data-delivery-selected').split(',') : []

        let vat_number = []
        frm.dataForm['data_item_list'] = []
        if (saleOrderEle.val()) {
            tabLineDetailTable.find('tbody tr').each(function () {
                if ($(this).find('.product_taxes').val()) {
                    vat_number.push($(this).find('.product_taxes').val())
                }
                frm.dataForm['data_item_list'].push({
                    'item_index': $(this).find('td:first-child').text(),
                    'product_id': $(this).find('.product-id').attr('data-id'),
                    'product_uom_id': $(this).find('.uom-id').attr('data-id'),
                    'product_quantity': $(this).find('.picked_quantity').val(),
                    'product_unit_price': $(this).find('.product_unit_price').attr('value'),
                    'product_subtotal': $(this).find('.product_subtotal_price').attr('data-init-money'),
                    'product_discount_rate': $(this).find('.product_discount_rate').val(),
                    'product_discount_value': $(this).find('.product_discount_value').attr('data-init-money'),
                    'product_tax_id': $(this).find('.product_taxes').val(),
                    'product_tax_value': $(this).find('.product_taxes_value').attr('data-init-money'),
                    'product_subtotal_final': $(this).find('.product_subtotal_price_final').attr('data-init-money')
                })
            })
        }
        else {
            tabLineDetailTable.find('tbody tr').each(function () {
                if ($(this).find('.product_taxes').val()) {
                    vat_number.push($(this).find('.product_taxes').val())
                }
                frm.dataForm['data_item_list'].push({
                    'item_index': $(this).find('td:first-child').text(),
                    'product_id': $(this).find('.product-select').val(),
                    'product_uom_id': $(this).find('.uom-select').val(),
                    'product_quantity': $(this).find('.picked_quantity').val(),
                    'product_unit_price': $(this).find('.product_unit_price').attr('value'),
                    'product_subtotal': $(this).find('.product_subtotal_price').attr('data-init-money'),
                    'product_discount_rate': $(this).find('.product_discount_rate').val(),
                    'product_discount_value': $(this).find('.product_discount_value').attr('data-init-money'),
                    'product_tax_id': $(this).find('.product_taxes').val(),
                    'product_tax_value': $(this).find('.product_taxes_value').attr('data-init-money'),
                    'product_subtotal_final': $(this).find('.product_subtotal_price_final').attr('data-init-money')
                })
            })
        }

        // frm.dataForm['system_status'] = 1;

        if (frm.dataForm['data_item_list'].length === 0) {
            $.fn.notifyB({description: "No item in tab line detail"}, 'failure')
            return false
        }

        if (vat_number.length > 0 && $('#invoice-exp').val() === '2') {
            $.fn.notifyB({description: "Product rows in sales invoice can not have VAT."}, 'failure')
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

                if (invoice_signs?.['many_vat_sign'] === data?.['invoice_sign']) {
                    $('#invoice-sign').val(invoice_signs?.['many_vat_sign'])
                }

                if (invoice_signs?.['one_vat_sign'] === data?.['invoice_sign']) {
                    $('#invoice-sign').val(invoice_signs?.['one_vat_sign'])
                }

                if (invoice_signs?.['sale_invoice_sign'] === data?.['invoice_sign']) {
                    $('#invoice-sign').val(invoice_signs?.['sale_invoice_sign'])
                }

                if (data?.['is_created_einvoice'] === false) {
                    $('#view_invoice_btn').closest('a').remove()
                }
                else {
                    $('#invoice-action').text($('#invoice-action').attr('data-trans-update'))
                    $('#invoice-action').closest('button').find('.icon').html('<i class="fa-solid fa-retweet"></i>')
                }

                if (data?.['is_free_input'] === false) {
                    $('.for-free-input').prop('readonly', true).prop('disabled', true)
                }

                $('#name').val(data?.['title'])
                customerNameEle.attr('data-id', data?.['customer_mapped'])
                loadSaleOrder(data?.['sale_order_mapped'])
                postingDateEle.val(moment(data?.['posting_date'].split(' ')[0]).format('DD/MM/YYYY'))
                documentDateEle.val(moment(data?.['document_date'].split(' ')[0]).format('DD/MM/YYYY'))
                invoiceDateEle.val(moment(data?.['invoice_date'].split(' ')[0]).format('DD/MM/YYYY'))
                $('#invoice-sign').val(data?.['invoice_sign'])
                $('#invoice-number').val(data?.['invoice_number'])
                $('#invoice-exp').val(data?.['invoice_example'])

                customerCodeEle.val(data?.['customer_code'])
                customerNameEle.val(data?.['customer_name'])
                $('#buyer-name').val(data?.['buyer_name'])
                $('#mst').val(data?.['customer_tax_number'])
                $('#billing-address').val(data?.['customer_billing_address'])
                $('#bank-code').val(data?.['customer_bank_code'])
                $('#bank-number').val(data?.['customer_bank_number'])

                tabLineDetailTable.attr('data-delivery-selected', data?.['delivery_mapped'].map(item => item.id).join(','))

                loadTableLineDetailForDetailPage(data?.['item_mapped'].sort((a, b) => a.item_index - b.item_index), option, data?.['is_free_input'])

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
    $(this).closest('a').attr('href', $(this).closest('a').attr('data-href').replace(0, pk) + `?pattern=${$('#invoice-sign').val()}`)
})

$('#edit_items_btn').on('click', function () {
    if (saleOrderEle.val()) {
        loadTableSelectDelivery()
    }
    else {
        loadTableLineDetail([])
        $.fn.notifyB({description: "You have not selected Sale order yet."}, 'warning')
    }
})

$('#add_row_items_btn').on('click', function () {
    tabLineDetailTable.find('tbody .dataTables_empty').closest('tr').remove()
    let index = tabLineDetailTable.find('tbody tr').length + 1
    let row = $(`
        <tr>
            <td class="wrap-text">${index}</td>
            <td class="wrap-text">
                <select class="form-select select-2 product-select"></select>
            </td>
            <td class="wrap-text">
                <span class="des small"></span>
            </td>
            <td class="wrap-text">
                <select class="form-select select-2 uom-select"></select>
            </td>
            <td class="wrap-text">
                <input type="number" class="form-control picked_quantity recalculate-field">
            </td>
            <td class="wrap-text">
                <input class="product_unit_price mask-money form-control recalculate-field" value="0">
            </td>
            <td class="wrap-text">
                <span class="product_subtotal_price mask-money text-primary" data-init-money="0"></span>
            </td>
            <td class="wrap-text">
                <div class="input-affix-wrapper">
                    <input type="number" class="form-control product_discount_rate recalculate-field" value="0">
                    <div class="input-suffix">
                        <i class="fas fa-percentage"></i>
                    </div>
                </div>
            </td>
            <td class="wrap-text">
                <span class="product_discount_value mask-money text-danger" data-init-money="0"></span>
            </td>
            <td class="wrap-text">
                <select data-tax-rate="0" class="form-select select2 product_taxes recalculate-field"></select>
            </td>
            <td class="wrap-text">
                <span class="mask-money text-primary product_taxes_value" data-init-money="0"></span>
            </td>
            <td class="wrap-text">
                <span class="product_subtotal_price_final mask-money text-primary" data-init-money="0"></span>
            </td>
            <td class="wrap-text text-center">
                <button type='button' class="delete-item-row btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-xs">
                    <span class="icon"><i class="fas fa-trash"></i></span>
                </button>
            </td>
        </tr>
    `)
    tabLineDetailTable.find('tbody').append(row)
    row.find('.product-select').initSelect2({
        ajax: {
            url: scriptUrlEle.attr('data-url-product-list'),
            method: 'GET',
        },
        data: null,
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        if ($(this).val()) {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            $(this).closest('tr').find('.des').text(selected?.['description'])
            loadRowUOM(row.find('.uom-select'), selected?.['sale_default_uom'], selected?.['general_uom_group']?.['id'])
            loadRowTax(row.find('.product_taxes'))
        }
    })
})

function loadRowUOM(ele, data, group_id) {
    ele.initSelect2({
        ajax: {
            url: scriptUrlEle.attr('data-url-uom-list') + `?group=${group_id}`,
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'unit_of_measure',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadRowTax(ele, data) {
    ele.initSelect2({
        allowClear: true,
        ajax: {
            url: scriptUrlEle.attr('data-url-tax-list'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'tax_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        if ($(this).val()) {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            $(this).attr('data-tax-rate', selected?.['rate'])
        }
        else {
            $(this).attr('data-tax-rate', 0)
        }
    })
}

$(document).on("click", '.delete-item-row', function () {
    $(this).closest('tr').remove()
    if (tabLineDetailTable.find('tbody tr').length === 0) {
        loadTableLineDetail([])
    }
    tabLineDetailTable.find('tbody tr').each(function (index, ele) {
        $(this).find('td:first-child').text(index + 1)
    })
})

function calculatePriceRow(row) {
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

    $.fn.initMaskMoney2()
}

$(document).on("change", '.recalculate-field', function () {
    calculatePriceRow($(this).closest('tr'))
    calculatePrice()
    let vat_number = []
    tabLineDetailTable.find('.product_taxes').each(function () {
        if ($(this).val()) {
            let tax_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            if (vat_number.includes(parseFloat(tax_selected?.['rate'])) === false) {
                vat_number.push(parseFloat(tax_selected?.['rate']))
            }
        }
        else {
            if (vat_number.includes(0) === false) {
                vat_number.push(0)
            }
        }
    })
    if (vat_number.length > 1) {
        if ($('#invoice-exp').val() === '0') {
            if (invoice_signs?.['many_vat_sign']) {
                $('#invoice-sign').val(invoice_signs?.['many_vat_sign'])
            } else {
                $.fn.notifyB({description: "Can not get Invoice sign for many tax case. Input in Setting."}, 'failure')
            }
        }
        else if ($('#invoice-exp').val() === '2') {
            if (invoice_signs?.['sale_invoice_sign']) {
                $('#invoice-sign').val(invoice_signs?.['sale_invoice_sign'])
            } else {
                $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'failure')
            }
        }
        else {
            $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
        }
    } else {
        if ($('#invoice-exp').val() === '0') {
            if (invoice_signs?.['one_vat_sign']) {
                $('#invoice-sign').val(invoice_signs?.['one_vat_sign'])
            } else {
                $.fn.notifyB({description: "Can not get Invoice sign for one tax case. Input in Setting."}, 'failure')
            }
        }
        else if ($('#invoice-exp').val() === '2') {
            if (invoice_signs?.['sale_invoice_sign']) {
                $('#invoice-sign').val(invoice_signs?.['sale_invoice_sign'])
            } else {
                $.fn.notifyB({description: "Can not get Invoice sign for sales invoice case. Input in Setting."}, 'failure')
            }
        }
        else {
            $.fn.notifyB({description: "Invalid invoice form."}, 'failure')
        }
    }
})

$('#get-vat-number-info-btn').on('click', function () {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.vietqr.io/v2/business/${$('#mst').val()}`, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            let responseData = JSON.parse(xhr.responseText);
            if (responseData.code !== '00') {
                Swal.fire({
                        html:
                            '<span class="text-danger mt-3"><i class="fas fa-exclamation-triangle"></i></span>' +
                            `<p class="text-danger mt-3">${responseData.desc}</p>`,
                        customClass: {
                            confirmButton: 'btn btn-outline-primary text-secondary',
                            cancelButton: 'btn btn-outline-secondary text-secondary',
                            container: 'swal2-has-bg',
                            actions: 'w-100'
                        },
                        showCancelButton: false,
                        buttonsStyling: false,
                        confirmButtonText: 'Cancel',
                        cancelButtonText: 'No',
                        reverseButtons: false
                    })
            }
            else {
                console.log(responseData.data)
                Swal.fire({
                        html:
                            `<p class="text-left text-secondary mt-1">International Name: <input class="form-control mb-1" readonly value="${responseData?.['data']?.['internationalName']}"></p>` +
                            `<p class="text-left text-secondary mt-1">Name: <input class="form-control mb-1" readonly value="${responseData?.['data']?.['name']}"></p>` +
                            `<p class="text-left text-secondary mt-1">ShortName: <input class="form-control mb-1" readonly value="${responseData?.['data']?.['shortName']}"></p>` +
                            `<p class="text-left text-secondary mt-1">Tax number: <input class="form-control mb-1" readonly value="${responseData?.['data']?.['id']}"></p>` +
                            `<p class="text-left text-secondary mt-1">Address: <textarea class="form-control mb-1" readonly>${responseData?.['data']?.['address']}</textarea></p>`,
                        customClass: {
                            confirmButton: 'btn btn-outline-primary text-primary',
                            cancelButton: 'btn btn-outline-secondary text-secondary',
                            container: 'swal2-has-bg',
                            actions: 'w-100'
                        },
                        showCancelButton: false,
                        buttonsStyling: false,
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.value) {
                        }
                    })
            }
        } else {
            $.fn.notifyB({description: 'Can not get this Tax number information'}, 'failure');
        }
    };
    xhr.onerror = function() {
        $.fn.notifyB({description: 'Request failed'}, 'failure');
    };
    xhr.send();
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
