const saleOrderEle = $('#sale-order')
const customerEle = $('#customer')
const dateEle = $('#date')
const selectDeliveryOffcanvasEle = $('#select-delivery-offcanvas')
const tableSelectDeliveryEle = $('#table-select-delivery')
const tableDetailProductEle = $('#table-product-detail')
const dataLineDetailTableScript = $('#data-line-detail-table')
const lineDetailTable = $('#tab_line_detail_datatable')
const scriptUrlEle = $('#script-url')
const scriptTransEle = $('#script-trans')
const tableProductSN = $('#table-product-sn')
const tableProductLOT = $('#table-product-lot')
const btnAddRowLineDetail = $('#btn-add-row-line-detail')
let RETURN_DATA_CREATE = []
let RETURN_DATA_CREATE_PROCESSED = []

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
        cancelClass: "btn-secondary",
        maxYear: parseInt(moment().format('YYYY')) + 50,
    })
}

function loadTableSelectDelivery() {
    tableSelectDeliveryEle.DataTable().clear().destroy()
    tableSelectDeliveryEle.DataTableDefault({
        dom: '',
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
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    let details = JSON.stringify(row?.['details'])
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
    SelectDeliveryOnChange($(this).closest('div').find('.details').text())
    loadTableSelectProductSerial([])
    loadTableSelectProductLOT([])
})

$(document).on("change", '.selected-product', function () {
    tableProductLOT.closest('div').prop('hidden', $(this).attr('data-type') !== '1')
    tableProductSN.closest('div').prop('hidden', $(this).attr('data-type') !== '2')
    if ($(this).attr('data-type') === '1') {
        loadTableSelectProductLOT(
            $(this).closest('div').find('.product-details').text() ? JSON.parse($(this).closest('div').find('.product-details').text()) : []
        )
    }
    else if ($(this).attr('data-type') === '2') {
        loadTableSelectProductSerial(
            $(this).closest('div').find('.product-details').text() ? JSON.parse($(this).closest('div').find('.product-details').text()) : []
        )
    }
})

$('#add-product-btn').on('click', function () {
    tableDetailProductEle.find('.selected-product').each(function () {
        if ($(this).prop('checked')) {
            let data_type = $(this).attr('data-type')
            let data_delivery_item_id = $(this).attr('data-delivery-item-id')
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
                            'data_delivery_item_id': data_delivery_item_id,
                            'lot_number': null,
                            'lot_quantity': null,
                            'lot_id': null,
                            'vendor_serial_number': null,
                            'serial_number': null,
                            'serial_id': null,
                            'delivery_item_id': this_selected.attr('data-delivery-item-id'),
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

                RETURN_DATA_CREATE = RETURN_DATA_CREATE.concat(data_line_detail_table)
                dataLineDetailTableScript.text(JSON.stringify(RETURN_DATA_CREATE))
                let processed_data = {}
                for (const item of data_line_detail_table) {
                    if (processed_data[item.product_id] === undefined) {
                        processed_data[item.product_id] = {
                            'type': 0,
                            'delivery_id': item.delivery_id,
                            'delivery_code': item.delivery_code,
                            'data_delivery_item_id': item.data_delivery_item_id,
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
                RETURN_DATA_CREATE_PROCESSED.push(Object.values(processed_data)[0])
                loadTableLineDetail(RETURN_DATA_CREATE_PROCESSED)
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
                            'data_delivery_item_id': data_delivery_item_id,
                            'lot_number': lot_number,
                            'lot_quantity': lot_quantity,
                            'lot_id': lot_id,
                            'vendor_serial_number': null,
                            'serial_number': null,
                            'serial_id': null,
                            'delivery_item_id': lot_data.attr('data-delivery-item-id'),
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

                RETURN_DATA_CREATE = RETURN_DATA_CREATE.concat(data_line_detail_table)
                dataLineDetailTableScript.text(JSON.stringify(RETURN_DATA_CREATE))
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
                            'data_delivery_item_id': item.data_delivery_item_id,
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
                RETURN_DATA_CREATE_PROCESSED.push(Object.values(processed_data)[0])
                loadTableLineDetail(RETURN_DATA_CREATE_PROCESSED)
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
                            'data_delivery_item_id': data_delivery_item_id,
                            'lot_number': null,
                            'lot_quantity': null,
                            'lot_id': null,
                            'vendor_serial_number': vendor_serial_number,
                            'serial_number': serial_number,
                            'serial_id': serial_id,
                            'delivery_item_id': serial_data.attr('data-delivery-item-id'),
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

                RETURN_DATA_CREATE = RETURN_DATA_CREATE.concat(data_line_detail_table)
                dataLineDetailTableScript.text(JSON.stringify(RETURN_DATA_CREATE))
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
                            'data_delivery_item_id': item.data_delivery_item_id,
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
                RETURN_DATA_CREATE_PROCESSED.push(Object.values(processed_data)[0])
                loadTableLineDetail(RETURN_DATA_CREATE_PROCESSED)
            }
            else {
                $.fn.notifyB({description: 'Please select product which you want to return'}, 'warning')
            }
            $(this).closest('tr').remove()
            tableProductSN.closest('div').prop('hidden', true)
            tableProductLOT.closest('div').prop('hidden', true)
        }
    })
})

function loadTableLineDetail(data_source=[], detail='create') {
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
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<select class="form-select select2 return-to-wh" data-delivery-item-id="${row?.['data_delivery_item_id']}" data-url="${scriptUrlEle.attr('data-url-warehouse') + '?interact=1'}" data-method="GET"></select>`
                }
            },
        ],
        initComplete: function(settings, json) {
            for (const wh_ele of lineDetailTable.find('.return-to-wh')) {
                LoadWarehouse($(wh_ele));
            }
            if (detail !== 'create') {
                let warehouse_rows = lineDetailTable.find('.return-to-wh')
                for (let i = 0; i < data_source.length; i++) {
                    let disabled_wh = detail === 'detail'
                    LoadWarehouse($(warehouse_rows[i]), data_source[i]?.['return_to_warehouse'], disabled_wh);
                }
            }
        }
    });
}

function SelectDeliveryOnChange(data_product) {
    if (data_product) {
        loadTableSelectDetailProduct(JSON.parse(data_product))
    }
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
                    let product_row = []
                    if (row?.['product_general_traceability_method'] === 1) {
                        product_row = row?.['lot_data']
                    }
                    else if (row?.['product_general_traceability_method'] === 2) {
                        product_row = row?.['sn_data']
                    }
                    if (product_row[0]?.['serial_id'] !== undefined) {
                        let returned_number_sn = product_row.filter(function (item) {
                            return item?.['is_returned'] === true
                        })
                        return `<span>${row?.['total_order']}</span> - <span class="text-primary">${row?.['delivered_quantity']}</span> - <span class="text-danger">${returned_number_sn.length}</span>`
                    } else if (product_row[0]?.['lot_id'] !== undefined) {
                        let returned_number_lot = 0
                        for (const prd of product_row) {
                            returned_number_lot += prd?.['returned_quantity']
                        }
                        return `<span>${row?.['total_order']}</span> - <span class="text-primary">${row?.['delivered_quantity']}</span> - <span class="text-danger">${returned_number_lot}</span>`
                    }
                    else if (product_row[0]?.['serial_id'] === undefined && product_row[0]?.['lot_id'] === undefined) {
                        let product_row = datasource.filter(function (item) {
                            return item?.['product_data']?.['id'] === row?.['product_data']?.['id']
                        })
                        let returned_number_default = product_row[0]?.['returned_quantity_default']
                        return `<span>${row?.['total_order']}</span> - <span class="text-primary">${row?.['delivered_quantity']}</span> - <span class="data-max-value text-danger">${returned_number_default}</span>`
                    }
                    return `---`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    if ([1, 2].includes(row?.['product_general_traceability_method'])) {
                        return `<input value="0" disabled readonly class="form-control return-number-input" type="number" min="0">`
                    }
                    let product_row = datasource.filter(function (item) {
                        return item?.['product_data']?.['id'] === row?.['product_data']?.['id']
                    })
                    let returned_number_default = product_row[0]?.['returned_quantity_default']
                    return `<input value="0" data-max="${row?.['delivered_quantity'] - returned_number_default}" class="form-control return-number-input" type="number" min="0">`
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
                    let product_delivery_data = ''
                    if (row?.['product_general_traceability_method'] === 1) {
                        product_delivery_data = JSON.stringify(row?.['lot_data'])
                    }
                    else if (row?.['product_general_traceability_method'] === 2) {
                        product_delivery_data = JSON.stringify(row?.['sn_data'])
                    }
                    return `<div class="form-check">
                                <input type="radio" name="selected-product" class="form-check-input selected-product"
                                        data-type="${row?.['product_general_traceability_method']}" 
                                        data-delivery-item-id="${row?.['id']}"
                                        data-product-id="${row?.['product_data']?.['id']}"
                                        data-product-code="${row?.['product_data']?.['code']}"
                                        data-product-title="${row?.['product_data']?.['title']}"
                                        data-uom-id="${row?.['uom_data']?.['id']}"
                                        data-uom-title="${row?.['uom_data']?.['title']}"
                                        data-unit-price="${row?.['product_unit_price']}"
                                        data-amount="${row?.['delivered_quantity']}"
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
                    let delivery_item_id = null
                    tableDetailProductEle.find('.selected-product').each(function () {
                        if ($(this).prop('checked')) {
                            delivery_item_id = $(this).attr('data-delivery-item-id')
                        }
                    })
                    return `<span class="serial-data-span"
                                data-delivery-id="${selected_delivery_id}"
                                data-delivery-code="${selected_delivery_code}"
                                data-delivery-item-id="${delivery_item_id}"
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
                    if (row?.['is_returned'] === true) {
                        return `<span class="badge badge-sm badge-soft-secondary">${scriptTransEle.attr('data-trans-has-returned')}</span>`
                    }
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
                    if (row?.['is_returned'] === true) {
                        return ``
                    }
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
                    let delivery_item_id = null
                    tableDetailProductEle.find('.selected-product').each(function () {
                        if ($(this).prop('checked')) {
                            delivery_item_id = $(this).attr('data-delivery-item-id')
                        }
                    })
                    return `<span class="lot-data-span"
                                data-delivery-id="${selected_delivery_id}"
                                data-delivery-code="${selected_delivery_code}"
                                data-delivery-item-id="${delivery_item_id}"
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
                    return `<span class="data-remain-span">${row?.['quantity_delivery'] - row?.['returned_quantity']}</span>`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: () => {
                    return `<input type="number" class="form-control return-lot-input" value="0">`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: () => {
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

$(document).on("input", '.return-lot-input', function () {
    if (!$(this).val()) {
        $(this).val(0)
    }
    else {
        let return_val = parseFloat($(this).val())
        let remain_val = parseFloat($(this).closest('tr').find('.data-remain-span').text())
        if (return_val > remain_val) {
            $.fn.notifyB({description: `Return amount must <= remain amount (${return_val} > ${remain_val})`}, 'failure')
            return_val = 0
            $(this).val(return_val)
        }
        else {
            $(this).val(return_val)
            $(this).closest('tr').find('.redelivery-lot-input').val(0)
        }
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
})

$(document).on("input", '.redelivery-lot-input', function () {
    if (!$(this).val()) {
        $(this).val(0)
    }
    else {
        let redelivery_val = parseFloat($(this).val())
        let return_val = parseFloat($(this).closest('tr').find('.return-lot-input').val())
        if (redelivery_val > return_val) {
            $.fn.notifyB({description: `Redelivery amount must <= return number (${redelivery_val} > ${return_val})`}, 'failure')
            redelivery_val = 0
            $(this).val(return_val)
        }
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
})

$(document).on("input", '.return-number-input', function () {
    if (!$(this).val()) {
        $(this).val(0)
    }
    else {
        if (parseFloat($(this).val()) > parseFloat($(this).attr('data-max'))) {
            $.fn.notifyB({description: `Return amount must not greater than Delivered amount: ${parseFloat($(this).val())} > ${parseFloat($(this).attr('data-max'))}`}, 'failure')
            $(this).val(0)
        }
        else {
            $(this).val(parseFloat($(this).val()))
        }
        $(this).closest('tr').find('.re-delivery-number-input').val(0)
    }
})

$(document).on("input", '.re-delivery-number-input', function () {
    if (!$(this).val()) {
        $(this).val(0)
    }
    else {
        if (parseFloat($(this).val()) > parseFloat($(this).closest('tr').find('.return-number-input').val())) {
            $.fn.notifyB({description: "Redelivery number must be smaller or equal Return number"}, 'failure')
            $(this).val(0)
        }
        else {
            $(this).val(parseFloat($(this).val()))
        }
    }
})

btnAddRowLineDetail.on('click', function () {
    if (saleOrderEle.val()) {
        loadTableLineDetail([])
        RETURN_DATA_CREATE = []
        RETURN_DATA_CREATE_PROCESSED = []
        loadTableSelectDetailProduct([])
        loadTableSelectDelivery()
        tableProductLOT.closest('div').prop('hidden', true)
        tableProductSN.closest('div').prop('hidden', true)
    }
    else {
        $.fn.notifyB({description: "You have not selected Sale order yet"}, 'warning')
    }
})

$('#finish-btn').on('click', function () {
    selectDeliveryOffcanvasEle.offcanvas('hide')
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

function LoadWarehouse(ele, data, disabled_wh) {
    ele.initSelect2({
        disabled: disabled_wh,
        allowClear: true,
        ajax: {
            url: `${ele.attr('data-url')}`,
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                result.push(resp.data[keyResp][i])
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'warehouse_list',
        keyId: 'id',
        keyText: 'title',
    })
}

class GoodsReturnHandle {
    load() {
        loadTableLineDetail([])
        LoadSaleOrder()
        LoadDate()
    }
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle))
        let flag = true

        frm.dataForm['title'] = $('#title').val()
        frm.dataForm['sale_order'] = saleOrderEle.val()
        frm.dataForm['note'] = $('#note').val()

        let lineDetailTable_rows = lineDetailTable.find('tbody tr')
        for (let i = 0; i < lineDetailTable_rows.length; i++) {
            let wh_selected = $(lineDetailTable_rows[i]).find('.return-to-wh').val()
            let delivery_item_id = $(lineDetailTable_rows[i]).find('.return-to-wh').attr('data-delivery-item-id')
            for (const item of RETURN_DATA_CREATE) {
                if (item?.['data_delivery_item_id'] === delivery_item_id) {
                    item['return_to_warehouse_id'] = wh_selected
                }
            }
            RETURN_DATA_CREATE_PROCESSED[i]['return_to_warehouse_id'] = wh_selected
        }
        frm.dataForm['product_detail_list'] = RETURN_DATA_CREATE
        frm.dataForm['data_line_detail_table'] = RETURN_DATA_CREATE_PROCESSED

        if (frm.dataForm['data_line_detail_table'].length === 0) {
            $.fn.notifyB({description: "No item in tab line detail"}, 'failure')
            return false
        }

        frm.dataForm['delivery'] = RETURN_DATA_CREATE_PROCESSED[0]?.['delivery_id']

        // console.log(frm.dataForm)
        if (flag) {
            return frm
        }
        else {
            $.fn.notifyB({description: "Return quantity must be > 0"}, 'failure')
            return false
        }
    }
}

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
        $('.select2').prop('disabled', true);
        $('#collapse-area input').prop('disabled', true);
        $('.return-to-wh').prop('disabled', true);
        btnAddRowLineDetail.remove();
    }
}

function LoadDetailGoodsReturn(option) {
    let url_loaded = option === 'detail' ? $('#frm_goods_return_detail').attr('data-url') : $('#frm_goods_return_update').attr('data-url')
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['good_return_detail'];
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                $('#title').val(data?.['title'])
                LoadSaleOrder(data?.['sale_order'])
                $('#customer').val(data?.['sale_order']?.['customer_name'])
                $('#date').val(data?.['date_created'].split(' ')[0])
                $('#note').val(data?.['note'])

                loadTableLineDetail(data?.['data_line_detail_table'], option)
                RETURN_DATA_CREATE = data?.['product_detail_list']
                RETURN_DATA_CREATE_PROCESSED = data?.['data_line_detail_table']
                dataLineDetailTableScript.text(JSON.stringify(data?.['data_line_detail']))
                new $x.cls.file($('#attachment')).init({
                    enable_edit: option !== 'detail',
                    data: data.attachment,
                })

                $.fn.initMaskMoney2();

                Disable(option);
            }
        })
}
