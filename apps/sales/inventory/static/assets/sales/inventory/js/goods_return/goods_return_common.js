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
                    return `<span data-id="${row.id}" class="text-primary delivery-code-span">${row.code}</span>`
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
    tableProductLOT.closest('div').prop('hidden', $(this).attr('data-type') !== '1')
    tableProductSN.closest('div').prop('hidden', $(this).attr('data-type') !== '2')
    if ($(this).attr('data-type') === '1') {
        let product_id_selected = $(this).attr('data-id')
        console.log(DELIVERY_PRODUCT_NOW.filter(function (item) {
                return item.product.id === product_id_selected
            }))
        loadTableSelectProductLOT(
            DELIVERY_PRODUCT_NOW.filter(function (item) {
                return item.product.id === product_id_selected
            })
        )
    }
    else if ($(this).attr('data-type') === '2') {
        let product_id_selected = $(this).attr('data-id')
        loadTableSelectProductSerial(
            DELIVERY_PRODUCT_NOW.filter(function (item) {
                return item.product.id === product_id_selected
            })
        )
    }
})

$('#add-product-btn').on('click', function () {
    let data_type = '0'
    tableDetailProductEle.find('.selected-product').each(function () {
        if ($(this).prop('checked')) {
            data_type = $(this).attr('data-type')
        }
    })
    if (data_type === '0') {
        let data_line_detail_table = []
        tableDetailProductEle.find('tbody tr').each(function () {
            let delivery_id = null
            let delivery_code = null
            $('.selected-delivery').each(function () {
                if ($(this).prop('checked')) {
                    delivery_id = $(this).closest('tr').find('.delivery-code-span').attr('data-id')
                    delivery_code = $(this).closest('tr').find('.delivery-code-span').text()
                }
            })
            let this_selected = $(this).find('.selected-product')
            if (this_selected.prop('checked')) {
                data_line_detail_table.push({
                    'type': 0,
                    'delivery_id': delivery_id,
                    'delivery_code': delivery_code,
                    'lot_number': '',
                    'lot_quantity': '',
                    'lot_id': '',
                    'vendor_serial_number': '',
                    'serial_number': '',
                    'serial_id': '',
                    'product_id': this_selected.attr('data-product-id'),
                    'product_title': this_selected.attr('data-product-title'),
                    'product_code': this_selected.attr('data-product-code'),
                    'uom_id': this_selected.attr('data-uom-id'),
                    'uom_title': this_selected.attr('data-uom-title'),
                    'product_unit_price': this_selected.attr('data-unit-price'),
                    'is_return': this_selected.closest('tr').find('.return-number-input').val(),
                    'is_redelivery': this_selected.closest('tr').find('.re-delivery-number-input').val()
                })
            }
        })

        dataLineDetailTableScript.text(JSON.stringify(data_line_detail_table))
        let processed_data = {}
        for (const item of data_line_detail_table) {
            if (processed_data[item.product_id] === undefined) {
                processed_data[item.product_id] = {
                    'type': 0,
                    'delivery_id': item.delivery_id,
                    'delivery_code': item.delivery_code,
                    'product_id': item.product_id,
                    'product_code': item.product_code,
                    'product_title': item.product_title,
                    'uom_id': item.uom_id,
                    'uom_title': item.uom_title,
                    'lot_number': item.lot_number,
                    'vendor_serial_number_with_serial_number': '',
                    'is_return': parseFloat(item.is_return),
                    'is_redelivery': parseFloat(item.is_redelivery),
                    'product_unit_price': parseFloat(item.product_unit_price),
                }
            }
        }
        let processed_data_list = Object.values(processed_data)
        console.log(processed_data_list)
        loadTableLineDetail(processed_data_list, [4, 5])
    }
    else if (data_type === '1') {
        let data_line_detail_table = []
        tableProductLOT.find('tbody tr').each(function () {
            let lot_data = $(this).find('.lot-data-span')
            let delivery_id = lot_data.attr('data-delivery-id')
            let delivery_code = lot_data.attr('data-delivery-code')
            let is_return = $(this).find('.return-lot-input').val()
            let is_redelivery = $(this).find('.redelivery-lot-input').val()
            let lot_number = lot_data.attr('data-lot-number')
            let lot_quantity = lot_data.attr('data-lot-quantity')
            let lot_id = lot_data.attr('data-lot-id')
            let product_id = lot_data.attr('data-product-id')
            let product_code = lot_data.attr('data-product-code')
            let product_title = lot_data.attr('data-product-title')
            let uom_id = lot_data.attr('data-uom-id')
            let uom_title = lot_data.attr('data-uom-title')
            let product_unit_price = lot_data.attr('data-unit-price')
            if (parseFloat(is_return) > 0) {
                data_line_detail_table.push({
                    'type': 1,
                    'delivery_id': delivery_id,
                    'delivery_code': delivery_code,
                    'lot_number': lot_number,
                    'lot_quantity': lot_quantity,
                    'lot_id': lot_id,
                    'vendor_serial_number': '',
                    'serial_number': '',
                    'serial_id': '',
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
                processed_data[item.product_id].lot_number.push(item.lot_number)
                processed_data[item.product_id].is_redelivery.push(item.is_redelivery)
                processed_data[item.product_id].is_return.push(item.is_return)
            } else {
                processed_data[item.product_id] = {
                    'type': 1,
                    'delivery_id': item.delivery_id,
                    'delivery_code': item.delivery_code,
                    'product_id': item.product_id,
                    'product_code': item.product_code,
                    'product_title': item.product_title,
                    'uom_id': item.uom_id,
                    'uom_title': item.uom_title,
                    'lot_number': [item.lot_number],
                    'is_return': [item.is_return],
                    'is_redelivery': [item.is_redelivery],
                    'product_unit_price': parseFloat(item.product_unit_price),
                }
            }
        }
        let processed_data_list = Object.values(processed_data)
        console.log(processed_data_list)
        loadTableLineDetail(processed_data_list, [5])
    }
    else if (data_type === '2') {
        let data_line_detail_table = []
        tableProductSN.find('tbody tr').each(function () {
            let serial_data = $(this).find('.serial-data-span')
            let delivery_id = serial_data.attr('data-delivery-id')
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
                    'type': 2,
                    'delivery_id': delivery_id,
                    'delivery_code': delivery_code,
                    'lot_number': '',
                    'lot_quantity': '',
                    'lot_id': '',
                    'vendor_serial_number': vendor_serial_number,
                    'serial_number': serial_number,
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
                    'type': 2,
                    'delivery_id': item.delivery_id,
                    'delivery_code': item.delivery_code,
                    'product_id': item.product_id,
                    'product_code': item.product_code,
                    'product_title': item.product_title,
                    'uom_id': item.uom_id,
                    'uom_title': item.uom_title,
                    'vendor_serial_number_with_serial_number': [`${item.vendor_serial_number} (serial: ${item.serial_number})`],
                    'is_return': [item.is_return],
                    'is_redelivery': [item.is_redelivery],
                    'product_unit_price': parseFloat(item.product_unit_price),
                }
            }
        }
        let processed_data_list = Object.values(processed_data)
        console.log(processed_data_list)
        loadTableLineDetail(processed_data_list, [4, 6])
    }
})

function loadTableLineDetail(data_source=[], targets_hidden_cols=[]) {
    selectDeliveryOffcanvasEle.offcanvas('hide')
    lineDetailTable.DataTable().clear().destroy()
    lineDetailTable.DataTableDefault({
        dom: "",
        columnDefs : [{
            visible: false, targets: targets_hidden_cols
        }],
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
                    return `<span class="badge badge-secondary badge-sm">${row?.['product_code']}</span><br>${row?.['product_title']}`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `${row?.['uom_title']}`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="text-primary">${row?.['delivery_code']}</span>`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row?.['type'] === 1) {
                        let html = ``
                        for (let i = 0; i < row?.['lot_number'].length; i++) {
                            html += `<span class="text-secondary mb-1">${row?.['lot_number'][i]}</span><br>`
                        }
                        return html
                    }
                    return ``
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row?.['type'] === 2) {
                        let html = ``
                        for (let i = 0; i < row?.['vendor_serial_number_with_serial_number'].length; i++) {
                            html += `<span class="text-secondary mb-1">${row?.['vendor_serial_number_with_serial_number'][i]}</span><br>`
                        }
                        return html
                    }
                    else {
                        return ``
                    }
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row?.['type'] === 1) {
                        let html = ``
                        for (let i = 0; i < row?.['is_return'].length; i++) {
                            html += `<span class="text-secondary mb-1">${row?.['is_return'][i]}</span><br>`
                        }
                        return html
                    }
                    else if (row?.['type'] === 2) {
                        let html = ``
                        for (let i = 0; i < row?.['is_return'].length; i++) {
                            html += `<span class="text-secondary mb-1">${row?.['is_return'][i] ? 'Yes' : 'No'}</span><br>`
                        }
                        return html
                    }
                    else {
                        return row?.['is_return']
                    }
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row?.['type'] === 1) {
                        let html = ``
                        for (let i = 0; i < row?.['is_redelivery'].length; i++) {
                            html += `<span class="text-secondary mb-1">${row?.['is_redelivery'][i]}</span><br>`
                        }
                        return html
                    }
                    else if (row?.['type'] === 2) {
                        let html = ``
                        for (let i = 0; i < row?.['is_redelivery'].length; i++) {
                            html += `<span class="text-secondary mb-1">${row?.['is_redelivery'][i] ? 'Yes' : 'No'}</span><br>`
                        }
                        return html
                    }
                    else {
                        return row?.['is_redelivery']
                    }
                }
            },
            // {
            //     data: '',
            //     className: 'wrap-text',
            //     render: (data, type, row) => {
            //         return `<span class="mask-money text-primary" data-init-money="${row?.['product_unit_price']}"></span>`
            //     }
            // },
            // {
            //     data: '',
            //     className: 'wrap-text',
            //     render: (data, type, row) => {
            //         if (row?.['type'] === 1) {
            //             let sum = data_source[0]?.['is_return'].reduce(function (acc, current) {
            //                 return acc + current;
            //             }, 0);
            //             return `<span class="mask-money text-primary" data-init-money="${row?.['product_unit_price'] * sum}"></span>`
            //         }
            //         else if (row?.['type'] === 2) {
            //             return `<span class="mask-money text-primary" data-init-money="${row?.['product_unit_price'] * data_source[0]?.['is_return'].length}"></span>`
            //         }
            //         else {
            //             return `<span class="mask-money text-primary" data-init-money="${row?.['product_unit_price'] * data_source[0]?.['is_return']}"></span>`
            //         }
            //     }
            // }
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
            console.log(results[0])
            if (results[0]?.['products_delivered_data_by_serial'].length > 0) {
                DELIVERY_PRODUCT_NOW = results[0]?.['products_delivered_data_by_serial']
            }
            else {
                DELIVERY_PRODUCT_NOW = results[0]?.['products_delivered_data_by_lot']
            }
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
                                <input type="radio" name="selected-product" class="form-check-input selected-product"
                                        data-type="${row?.['product_general_traceability_method']}" 
                                        data-id="${row?.['product_data']?.['id']}"
                                        data-product-id="${row?.['product_data']?.['id']}"
                                        data-product-code="${row?.['product_data']?.['code']}"
                                        data-product-title="${row?.['product_data']?.['title']}"
                                        data-uom-id="${row?.['uom_data']?.['id']}"
                                        data-uom-title="${row?.['uom_data']?.['title']}"
                                        data-unit-price="${row?.['product_unit_price']}"
                                >
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

function loadTableSelectProductLOT(datasource=[]) {
    let selected_delivery_id = null
    let selected_delivery_code = null
    $('.selected-delivery').each(function () {
        if ($(this).prop('checked')) {
            selected_delivery_id = $(this).attr('data-id')
            selected_delivery_code = $(this).closest('tr').find('.delivery-code-span').text()
        }
    })
    tableProductLOT.DataTable().clear().destroy()
    tableProductLOT.DataTableDefault({
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
                    return `<span class="lot-data-span"
                                data-delivery-id="${selected_delivery_id}"
                                data-delivery-code="${selected_delivery_code}"
                                data-lot-quantity="${row?.['lot_quantity']}"
                                data-lot-number="${row?.['lot_number']}"
                                data-lot-id="${row?.['lot_id']}"
                                data-product-id="${row?.['product']?.['id']}"
                                data-product-code="${row?.['product']?.['code']}"
                                data-product-title="${row?.['product']?.['title']}"
                                data-uom-id="${row?.['uom']?.['id']}"
                                data-uom-title="${row?.['uom']?.['title']}"
                                data-unit-price="${row?.['product_unit_price']}"
                            >${row?.['lot_number']}</span>`
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `${row?.['quantity_delivery']}`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<input type="number" class="form-control return-lot-input" value="0">`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<input type="number" class="form-control redelivery-lot-input" value="0">`
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

$(document).on("change", '.return-lot-input', function () {
    if (!$(this).val()) {$(this).val(0)}
    $(this).closest('tr').find('.redelivery-lot-input').val(0)
    let sum_return = 0
    let sum_re_delivery = 0
    $('.return-lot-input').each(function () {
        if ($(this).val()) {
            sum_return += parseFloat($(this).val())
        }
    })
    $('.redelivery-lot-input').each(function () {
        if ($(this).val()) {
            sum_re_delivery += parseFloat($(this).val())
        }
    })
    tableDetailProductEle.find('.selected-product').each(function () {
        if ($(this).prop('checked')) {
            $(this).closest('tr').find('.return-number-input').val(sum_return)
            $(this).closest('tr').find('.re-delivery-number-input').val(sum_re_delivery)
        }
    })
})

$(document).on("change", '.redelivery-lot-input', function () {
    if (!$(this).val()) {$(this).val(0)}
    if (parseFloat($(this).val()) <= parseFloat($(this).closest('tr').find('.return-lot-input').val())) {
        let sum_return = 0
        let sum_re_delivery = 0
        $('.return-lot-input').each(function () {
            if ($(this).val()) {
                sum_return += parseFloat($(this).val())
            }
        })
        $('.redelivery-lot-input').each(function () {
            if ($(this).val()) {
                sum_re_delivery += parseFloat($(this).val())
            }
        })
        tableDetailProductEle.find('.selected-product').each(function () {
            if ($(this).prop('checked')) {
                $(this).closest('tr').find('.return-number-input').val(sum_return)
                $(this).closest('tr').find('.re-delivery-number-input').val(sum_re_delivery)
            }
        })
    }
    else {
        $.fn.notifyB({description: "Redelivery number must be smaller or equal Return number"}, 'warning')
        $(this).val(0)
    }
})

$(document).on("change", '.return-number-input', function () {
    if (!$(this).val()) {$(this).val(0)}
    $(this).closest('tr').find('.re-delivery-number-input').val(0)
})

$(document).on("change", '.re-delivery-number-input', function () {
    if (!$(this).val()) {$(this).val(0)}
    if (parseFloat($(this).val()) > parseFloat($(this).closest('tr').find('.return-number-input').val())) {
        $.fn.notifyB({description: "Redelivery number must be smaller or equal Return number"}, 'warning')
        $(this).val(0)
    }
})

$('#btn-add-row-line-detail').on('click', function () {
    if (saleOrderEle.val()) {
        loadTableSelectDetailProduct([])
        loadTableSelectDelivery()
        tableProductLOT.closest('div').prop('hidden', true)
        tableProductSN.closest('div').prop('hidden', true)
    }
    else {
        $.fn.notifyB({description: "You have not selected Sale order yet"}, 'warning')
    }
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
        tableProductLOT.closest('div').prop('hidden', true)
        tableProductSN.closest('div').prop('hidden', true)
        if (saleOrderEle.val()) {
            let so_selected = SelectDDControl.get_data_from_idx(saleOrderEle, saleOrderEle.val())
            customerEle.val(so_selected?.['customer']?.['title'])
            loadTableSelectDelivery()
            loadTableSelectDetailProduct([])
            loadTableSelectProductSerial([])
            loadTableSelectProductLOT([])
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
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = $('#title').val()
        frm.dataForm['sale_order'] = $('#sale-order').val()
        frm.dataForm['note'] = $('#note').val()

        let data_item = JSON.parse(dataLineDetailTableScript.text())

        frm.dataForm['delivery'] = data_item[0]?.['delivery_id']
        frm.dataForm['product'] = data_item[0]?.['product_id']
        frm.dataForm['uom'] = data_item[0]?.['uom_id']

        let product_detail_list = []
        if (data_item[0]?.['type'] === 0) {
            product_detail_list.push({
                'type': 0,
                'default_return_number': parseFloat(data_item[0]?.['is_return']),
                'default_redelivery_number': parseFloat(data_item[0]?.['is_redelivery'])
            })
        }
        else if (data_item[0]?.['type'] === 1) {
            for (let item of data_item) {
                product_detail_list.push({
                    'type': 1,
                    'lot_no_id': item?.['lot_id'],
                    'lot_return_number': parseFloat(item?.['is_return']),
                    'lot_redelivery_number': parseFloat(item?.['is_redelivery'])
                })
            }
        }
        else if (data_item[0]?.['type'] === 2) {
            for (let item of 1) {
                product_detail_list.push({
                    'type': 2,
                    'serial_no_id': item?.['serial_id'],
                    'is_return': item?.['is_return'],
                    'is_redelivery': item?.['is_redelivery']
                })
            }
        }
        frm.dataForm['product_detail_list'] = product_detail_list

        // frm.dataForm['system_status'] = 1;

        if (frm.dataForm['product_detail_list'].length === 0 ) {
            $.fn.notifyB({description: "No item in tab line detail"}, 'failure')
            return false
        }

        console.log(frm.dataForm)
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

function Disable() {
    $('.form-control').prop('disabled', true).css({color: 'black'});
    $('.form-select').prop('disabled', true).css({color: 'black'});
    $('.select2').prop('disabled', true);
    $('#collapse-area input').prop('disabled', true);
}

function LoadDetailGoodsReturn(option) {

}
