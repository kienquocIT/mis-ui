const saleOrderEle = $('#sale-order')
const customerEle = $('#customer')
const dateEle = $('#date')
const selectDeliveryOffcanvasEle = $('#select-delivery-offcanvas')
const tableSelectDeliveryEle = $('#table-select-delivery')
const tableDetailProductEle = $('#table-product-detail')
const dataLineDetailTableScript = $('#data-line-detail-table')
const lineDetailTable = $('#tab_line_detail_datatable')
const scriptUrlEle = $('#script-url')
const tableProductSN = $('#table-product-sn')
const tableProductLOT = $('#table-product-lot')
let DELIVERY_PRODUCT_NOW = null

function LoadDate() {
    dateEle.daterangepicker({
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        minYear: parseInt(moment().format('YYYY')),
        minDate: new Date(parseInt(moment().format('YYYY')), parseInt(moment().format('MM'))-1, parseInt(moment().format('DD'))),
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY')) + 100,
    })
}

function loadTableSelectDelivery() {
    tableSelectDeliveryEle.DataTable().destroy()
    tableSelectDeliveryEle.DataTableDefault({
        dom: "",
        useDataServer: true,
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        ajax: {
            url: scriptUrlEle.attr('data-url-delivery') + '?sale_order_id=' + saleOrderEle.val(),
            type: 'GET',
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    selectDeliveryOffcanvasEle.offcanvas('show')
                    // console.log(resp.data['delivery_list'])
                    let res = []
                    for (let i = 0; i < resp.data['delivery_list'].length; i++) {
                        res.push(resp.data['delivery_list'][i])
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
                    return `<span class="text-primary delivery-code-span">${row.code}</span>`
                }
            },
            {
                data: 'date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<i class="far fa-calendar-check"></i>&nbsp;&nbsp;${row.date.split('T')[0]}`
                }
            },
            {
                data: 'select',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    let details = JSON.stringify(row.details)
                    return `<div class="form-check">
                                <input data-id="${row.id}" type="radio" name="selected-delivery" class="form-check-input selected-delivery">
                                <label class="form-check-label"></label>
                                <script class="details">${details}</script>
                            </div>`
                }
            },
        ]
    });
}

$(document).on("change", '.selected-delivery', function () {
    SelectDeliveryOnChange($(this).attr('data-id'))
})

$(document).on("change", '.selected-product', function () {
    if ($(this).attr('data-type') === '1') {
        let product_id_selected = $(this).attr('data-id')
        tableProductSN.closest('div').prop('hidden', true)
        tableProductLOT.closest('div').prop('hidden', false)
        loadTableSelectProductSerial(
            DELIVERY_PRODUCT_NOW.filter(function (item) {
                console.log(item.product.id, product_id_selected)
                return item.product.id === product_id_selected
            })
        )
    }
    else if ($(this).attr('data-type') === '2') {
        let product_id_selected = $(this).attr('data-id')
        tableProductSN.closest('div').prop('hidden', false)
        tableProductLOT.closest('div').prop('hidden', true)
        loadTableSelectProductSerial(
            DELIVERY_PRODUCT_NOW.filter(function (item) {
                console.log(item.product.id, product_id_selected)
                return item.product.id === product_id_selected
            })
        )
    }
    else {
        tableProductSN.closest('div').prop('hidden', true)
        tableProductLOT.closest('div').prop('hidden', true)
    }
})

$('#add-product-btn').on('click', function () {
    let data_type = '0'
    tableDetailProductEle.find('.selected-product').each(function () {
        if ($(this).prop('checked')) {
            data_type = $(this).attr('data-type')
        }
    })
    if (data_type === '2') {
        let data_line_detail_table = []
        tableProductSN.find('tbody tr').each(function () {
            let serial_data = $(this).find('.serial-data-span')
            let delivery_code = serial_data.attr('data-delivery-code')
            let is_return = $(this).find('.return-check').prop('checked')
            let is_redelivery = $(this).find('.redelivery-check').prop('checked')
            let serial_number = serial_data.attr('data-serial-number')
            let vendor_serial_number = serial_data.attr('data-vendor-serial-number')
            let serial_id = serial_data.attr('data-serial-id')
            let product_id = serial_data.attr('data-product-id')
            let product_code = serial_data.attr('data-product-code')
            let product_title = serial_data.attr('data-product-title')
            let uom_id = serial_data.attr('data-uom-id')
            let uom_title = serial_data.attr('data-uom-title')
            let product_unit_price = serial_data.attr('data-unit-price')
            if (is_return) {
                data_line_detail_table.push({
                    'serial_number': serial_number,
                    'delivery_code': delivery_code,
                    'vendor_serial_number': vendor_serial_number,
                    'serial_id': serial_id,
                    'product_id': product_id,
                    'product_title': product_title,
                    'product_code': product_code,
                    'uom_id': uom_id,
                    'uom_title': uom_title,
                    'product_unit_price': product_unit_price,
                    'is_return': is_return,
                    'is_redelivery': is_redelivery
                })
            }
        })
        dataLineDetailTableScript.text(JSON.stringify(data_line_detail_table))
        let processed_data = {}
        for (const item of data_line_detail_table) {
            if (processed_data[item.product_id] !== undefined) {
                processed_data[item.product_id].vendor_serial_number_with_serial_number.push(`${item.vendor_serial_number} (serial: ${item.serial_number})`)
                processed_data[item.product_id].is_redelivery.push(item.is_redelivery)
                processed_data[item.product_id].is_return.push(item.is_return)
            } else {
                processed_data[item.product_id] = {
                    'delivery_code': item.delivery_code,
                    'product_code': item.product_code,
                    'product_title': item.product_title,
                    'uom_title': item.uom_title,
                    'vendor_serial_number_with_serial_number': [`${item.vendor_serial_number} (serial: ${item.serial_number})`],
                    'is_return': [item.is_return],
                    'is_redelivery': [item.is_redelivery],
                    'product_unit_price': parseFloat(item.product_unit_price),
                }
            }
        }
        let processed_data_list = Object.values(processed_data)
        console.log(JSON.parse(dataLineDetailTableScript.text()))
        console.log(processed_data_list)
        loadTableLineDetail(processed_data_list)
    }
})

function loadTableLineDetail(data_source=[]) {
    selectDeliveryOffcanvasEle.offcanvas('hide')
    lineDetailTable.DataTable().clear().destroy()
    lineDetailTable.DataTableDefault({
        dom: "",
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        data: data_source,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="badge badge-secondary badge-sm">${row.product_code}</span><br>${row.product_title}`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `${row.uom_title}`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="text-primary">${row.delivery_code}</span>`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row?.['lot_number']) {
                        return row?.['lot_number']
                    }
                    return ``
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let html = ``
                    for (let i = 0; i < row.vendor_serial_number_with_serial_number.length; i++) {
                        html += `<span class="text-secondary mb-1">${row.vendor_serial_number_with_serial_number[i]}</span><br>`
                    }
                    return html
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let html = ``
                    for (let i = 0; i < row.is_redelivery.length; i++) {
                        html += `<span class="text-secondary mb-1">${row.is_redelivery[i] ? 'Yes' : 'No'}</span><br>`
                    }
                    return html
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row.product_unit_price}"></span>`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row.product_unit_price * data_source[0]?.['is_return'].length}"></span>`
                }
            }
        ],
    });
}

function SelectDeliveryOnChange(delivery_selected_id) {
    let delivery_products_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-delivery-products').replace('/0', `/${delivery_selected_id}`),
            data: {},
            method: 'GET'
        }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('delivery_products_list')) {
                return data?.['delivery_products_list'];
            }
            return {};
        },
        (errs) => {
            console.log(errs);
        }
    )

    Promise.all([delivery_products_ajax]).then(
        (results) => {
            DELIVERY_PRODUCT_NOW = results[0]?.['products_delivered_data_by_serial']
            let data_product = []
            $('.selected-delivery').each(function () {
                if ($(this).prop('checked')) {
                    data_product = data_product.concat(JSON.parse($(this).closest('div').find('.details').text()))
                }
            })
            console.log(data_product)

            loadTableSelectDetailProduct(data_product)
        })
}

function loadTableSelectDetailProduct(datasource=[]) {
    tableDetailProductEle.DataTable().clear().destroy()
    tableDetailProductEle.DataTableDefault({
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
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="badge badge-secondary badge-sm">${row?.['product_data']?.['code']}</span><br>${row?.['product_data']?.['title']}`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-primary">${row?.['uom_data']?.['title']}</span>`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<b>${row?.['total_order']}</b> / ${row?.['delivered_quantity']}`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    if ([1, 2].includes(row?.['product_general_traceability_method'])) {
                        return `<input value="0" disabled readonly class="form-control return-number-input" type="number" min="0">`
                    }
                    return `<input value="0" class="form-control return-number-input" type="number" min="0">`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    if ([1, 2].includes(row?.['product_general_traceability_method'])) {
                        return `<input value="0" disabled readonly class="form-control re-delivery-number-input" type="number" min="0">`
                    }
                    return `<input value="0" class="form-control re-delivery-number-input" type="number" min="0">`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    let product_delivery_data = JSON.stringify(row?.['product_delivery_data'])
                    return `<div class="form-check">
                                <input data-type="${row?.['product_general_traceability_method']}" data-id="${row?.['product_data']?.['id']}" type="radio" name="selected-product" class="form-check-input selected-product">
                                <label class="form-check-label"></label>
                                <script class="product-details">${product_delivery_data}</script>
                            </div>`
                }
            }
        ],
    });
}

function loadTableSelectProductSerial(datasource=[]) {
    let selected_delivery_id = null
    let selected_delivery_code = null
    $('.selected-delivery').each(function () {
        if ($(this).prop('checked')) {
            selected_delivery_id = $(this).attr('data-id')
            selected_delivery_code = $(this).closest('tr').find('.delivery-code-span').text()
        }
    })
    tableProductSN.DataTable().clear().destroy()
    tableProductSN.DataTableDefault({
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
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="serial-data-span"
                                data-delivery-id="${selected_delivery_id}"
                                data-delivery-code="${selected_delivery_code}"
                                data-serial-number="${row?.['serial_number']}"
                                data-vendor-serial-number="${row?.['vendor_serial_number']}"
                                data-serial-id="${row?.['serial_id']}"
                                data-product-id="${row?.['product']?.['id']}"
                                data-product-code="${row?.['product']?.['code']}"
                                data-product-title="${row?.['product']?.['title']}"
                                data-uom-id="${row?.['uom']?.['id']}"
                                data-uom-title="${row?.['uom']?.['title']}"
                                data-unit-price="${row?.['product_unit_price']}"
                            >${row?.['vendor_serial_number']}</span>`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `${row?.['serial_number']}`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<div class="form-check">
                                <input type="checkbox" class="form-check-input return-check">
                                <label class="form-check-label"></label>
                            </div>`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<div class="form-check" hidden>
                                <input type="checkbox" class="form-check-input redelivery-check">
                                <label class="form-check-label"></label>
                            </div>`
                }
            }
        ],
    });
}

$(document).on("change", '.return-check', function () {
    if ($(this).prop('checked')) {
        $(this).closest('tr').find('.redelivery-check').prop('checked', false).closest('div').prop('hidden', false)
    }
    else {
        $(this).closest('tr').find('.redelivery-check').prop('checked', false).closest('div').prop('hidden', true)
    }
    let sum_return = 0
    let sum_re_delivery = 0
    $('.return-check').each(function () {
        if ($(this).prop('checked')) {
            sum_return += 1
            if ($(this).closest('tr').find('.redelivery-check').prop('checked')) {
                sum_re_delivery += 1
            }
        }
    })
    tableDetailProductEle.find('.selected-product').each(function () {
        if ($(this).prop('checked')) {
            $(this).closest('tr').find('.return-number-input').val(sum_return)
            $(this).closest('tr').find('.re-delivery-number-input').val(sum_re_delivery)
        }
    })
})

$(document).on("change", '.redelivery-check', function () {
    let sum_return = 0
    let sum_re_delivery = 0
    $('.return-check').each(function () {
        if ($(this).prop('checked')) {
            sum_return += 1
            if ($(this).closest('tr').find('.redelivery-check').prop('checked')) {
                sum_re_delivery += 1
            }
        }
    })
    tableDetailProductEle.find('.selected-product').each(function () {
        if ($(this).prop('checked')) {
            $(this).closest('tr').find('.return-number-input').val(sum_return)
            $(this).closest('tr').find('.re-delivery-number-input').val(sum_re_delivery)
        }
    })
})

function LoadSaleOrder(data) {
    saleOrderEle.initSelect2({
        allowClear: true,
        ajax: {
            url: `${saleOrderEle.attr('data-url')}`,
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                result.push(resp.data[keyResp][i])
            }
            return result;
        },
        templateResult: function(data) {
            let ele = $('<div class="row"></div>');
            ele.append(`<div class="col-4"><span class="badge badge-soft-primary">${data.data?.['code']}</span></div>
                        <div class="col-8">${data.data?.['title']}</div>`);
            return ele;
        },
        data: (data ? data : null),
        keyResp: 'sale_order_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        if (saleOrderEle.val()) {
            let so_selected = SelectDDControl.get_data_from_idx(saleOrderEle, saleOrderEle.val())
            customerEle.val(so_selected?.['customer']?.['title'])
            loadTableSelectDelivery()
            loadTableSelectDetailProduct([])
            loadTableSelectProductSerial([])
        }
        else {
            customerEle.val('')
        }
    })
}

class GoodsReturnHandle {
    load() {
        LoadSaleOrder()
        LoadDate()
    }
    combinesData(frmEle) {}
}

function Disable() {
    $('.form-control').prop('disabled', true).css({color: 'black'});
    $('.form-select').prop('disabled', true).css({color: 'black'});
    $('.select2').prop('disabled', true);
    $('#collapse-area input').prop('disabled', true);
}

function LoadDetailGoodsReturn(option) {

}
