const scriptUrlEle = $('#script-url')
const scriptTransEle = $('#script-trans')
const tableSelectSupplierEle = $('#table-select-supplier')
const selectSupplierBtn = $('#select-supplier-btn')
const supplierCodeEle = $('#supplier-code')
const supplierSelectModal = $('#supplier-select-modal')
const purchaseOrderEle = $('#purchase-order')
const tableSelectGoodsReceiptEle = $('#table-select-goods-receipt')
const tableDetailProductEle = $('#table-product-detail')
const dataLineDetailTableScript = $('#data-line-detail-table')
const tabLineDetailTable = $('#tab_line_detail_datatable')
const postingDateEle = $('#posting-date')
const documentDateEle = $('#document-date')
const invoiceDateEle= $('#invoice-date')
const supplierSelectBtn = $('#supplier-select-btn')

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

selectSupplierBtn.on('click', function () {
    let selected_id = null
    let selected_name = ''
    $('input[name="supplier-selected-radio"]').each(function () {
        if ($(this).prop('checked')) {
            selected_id = $(this).attr('data-id')
            selected_name = $(this).attr('data-name')
        }
    })
    if (selected_id) {
        supplierCodeEle.val(selected_name)
        supplierCodeEle.attr('data-id', selected_id)
        supplierSelectModal.modal('hide')
    }
    else {
        $.fn.notifyB({description: 'Nothing selected'}, 'warning');
    }
})

supplierSelectBtn.on('click', function () {
    // loadPurchaseOrder({})
})

function loadTableSelectGoodsReceipt(gr_filter) {
    tableSelectGoodsReceiptEle.DataTable().destroy()
    tableSelectGoodsReceiptEle.DataTableDefault({
        dom: "<'d-flex dtb-header-toolbar'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>rt",
        useDataServer: true,
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        ajax: {
            url: scriptUrlEle.attr('data-url-goods-receipt-list') + `?purchase_order_id=${purchaseOrderEle.val()}`,
            type: 'GET',
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#select-goods-receipt-offcanvas').offcanvas('show')
                    console.log(resp.data['goods_receipt_list'])
                    return resp.data['goods_receipt_list']
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
                data: 'title',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return row.title
                }
            },
            {
                data: 'already',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    if (parseInt(row?.['already']) > 0) {
                        return `<i class="fas fa-check-circle"></i>`
                    }
                    else {
                        return ``
                    }
                }
            },
            {
                data: 'select',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    let details = JSON.stringify(row.details)
                    let total_quantity = JSON.stringify(row.purchase_order.detail)
                    if (parseInt(row?.['already']) > 0) {
                        return `<div class="form-check" hidden>
                                    <input checked data-already="1" data-id="${row.id}" type="checkbox" name="selected-goods-receipt" class="form-check-input selected-goods-receipt">
                                    <label class="form-check-label"></label>
                                    <script class="details">${details}</script>
                                    <script class="total_quantity">${total_quantity}</script>
                                </div>`
                    }
                    else {
                        return `<div class="form-check">
                                    <input data-already="0" data-id="${row.id}" type="checkbox" name="selected-goods-receipt" class="form-check-input selected-goods-receipt">
                                    <label class="form-check-label"></label>
                                    <script class="details">${details}</script>
                                    <script class="total_quantity">${total_quantity}</script>
                                </div>`
                    }
                }
            },
        ]
    });
}

$(document).on("change", '.selected-goods-receipt', function () {
    SelectGoodsReceiptOnChange()
})

function SelectGoodsReceiptOnChange() {
    let data_product_already = []
    $('.selected-goods-receipt').each(function () {
        if ($(this).prop('checked') && $(this).attr('data-already') === '1') {
            data_product_already = data_product_already.concat(JSON.parse($(this).closest('div').find('.details').text()))
        }
    })

    let data_product = []
    $('.selected-goods-receipt').each(function () {
        if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
            let data_po = JSON.parse($(this).closest('div').find('.total_quantity').text())
            let temp = JSON.parse($(this).closest('div').find('.details').text())
            temp[0]['quantity_import_total'] = data_po.filter(function (item) {
                return item.product_id === temp[0]?.['product_data']?.['id']
            })[0]?.['product_quantity_order_actual']
            temp[0]['quantity_imported_before'] = data_product_already
                .filter(item => item?.['product_data']?.['id'] === temp[0]?.['product_data']?.['id'])
                .reduce((sum, item) => sum + item?.['quantity_import'], 0)
            data_product = data_product.concat(temp)
        }
    })

    console.log(data_product)

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
                data: 'quantity_import_total',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<b>${row?.['quantity_import_total']}</b>`
                }
            },
            {
                data: 'quantity_imported_before',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return row?.['quantity_imported_before']
                }
            },
            {
                data: 'quantity_import',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    return `<span class="text-primary"><b>${row?.['quantity_import']}</b></span>`
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
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product-id" data-id="${row?.['product_data']?.['id']}">${row?.['product_data']?.['title']}</span>`
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
                data: 'quantity_import',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="quantity_import">${row?.['quantity_import']}</span>`
                }
            },
            {
                data: 'product_unit_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input class="product_unit_price mask-money form-control" value="${row?.['product_unit_price']}">`
                }
            },
            {
                data: 'product_tax_value',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product_taxes mask-money text-primary" data-init-money="${row?.['product_subtotal_price_after_tax'] - row?.['product_subtotal_price']}"></span>`
                }
            },
            {
                data: 'product_subtotal_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product_subtotal_price mask-money text-primary" data-init-money="${row?.['product_subtotal_price']}"></span>`
                }
            },
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
                data: 'product_data__title',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product-id" data-id="${row?.['product_data']?.['id']}">${row?.['product_data']?.['title']}</span>`
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
                data: 'quantity_import',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="quantity_import">${row?.['quantity_import']}</span>`
                }
            },
            {
                data: 'product_unit_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input class="product_unit_price mask-money form-control" value="${row?.['product_unit_price']}">`
                }
            },
            {
                data: 'product_tax_value',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product_taxes mask-money text-primary" data-init-money="${row?.['product_tax_value']}"></span>`
                }
            },
            {
                data: 'product_subtotal_price',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="product_subtotal_price mask-money text-primary" data-init-money="${row?.['product_subtotal_price']}"></span>`
                }
            },
        ],
        initComplete: function(settings, json) {
            if (option === 'detail') {
                Disabled(option)
            }
            calculatePrice()
        }
    });
}

$(document).on("change", '.product_unit_price', function () {
    let subtotal = parseFloat($(this).attr('value')) * parseFloat($(this).closest('tr').find('.quantity_import').text())
    $(this).closest('tr').find('.product_subtotal_price').attr('data-init-money', subtotal)
    $.fn.initMaskMoney2()

    calculatePrice()
})

function loadTableSelectSupplier() {
    if (!$.fn.DataTable.isDataTable('#table-select-supplier')) {
        let frm = new SetupFormSubmit(tableSelectSupplierEle);
        tableSelectSupplierEle.DataTableDefault({
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
                            if (resp.data['account_list'][i]['account_type'].some(item => item === "Supplier")) {
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
                                    <input data-id="${row.id}" data-name="${row.name}" type="radio" name="supplier-selected-radio" class="form-check-input">
                                </div>`
                    }
                },
            ],
        });
    }
}

function loadPurchaseOrder(data) {
    purchaseOrderEle.initSelect2({
        allowClear: true,
        ajax: {
            url: `${purchaseOrderEle.attr('data-url')}`,
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            console.log(resp.data[keyResp])
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].system_status === 3 && resp.data[keyResp][i]?.['supplier']?.['id'] === supplierCodeEle.attr("data-id")) {
                    result.push(resp.data[keyResp][i])
                }
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
        keyResp: 'purchase_order_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        if (purchaseOrderEle.val()) {
            loadTableSelectGoodsReceipt(purchaseOrderEle.val())
        }
    })
}

$('#add-product-btn').on('click', function () {
    loadTableLineDetail(JSON.parse(dataLineDetailTableScript.text()))
    $('#select-goods-receipt-offcanvas').offcanvas('hide')
    let data_product = []
    $('.selected-goods-receipt').each(function () {
        if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
            data_product.push($(this).attr('data-id'))
        }
    })
    tabLineDetailTable.attr('data-goods-receipt-selected', data_product.join(','))
})

$('#btn-add-row-line-detail').on('click', function () {
    if (purchaseOrderEle.val()) {
        loadTableSelectDetailProduct([])
        loadTableSelectGoodsReceipt(purchaseOrderEle.val())
    }
})

$('#btn-add-row-line-detail-discount').on('click', function () {
    let index = tabLineDetailTable.find('tbody tr').length + 1
    tabLineDetailTable.find('tbody').append(`
        <tr>
            <td>${index}</td>
            <td><input class="discount-name form-control"></td>
            <td><input class="discount-uom form-control"></td>
            <td><input type="number" class="discount-quantity form-control"></td>
            <td><input class="discount-unit-price mask-money form-control" value="0"></td>
            <td><span class="mask-money text-danger" data-init-money="0"></td>
            <td><span class="discount-subtotal-price mask-money text-danger" data-init-money="0"></span></td>
            <td><button class="btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-xs del-discount">
                <span class="icon"><i class="bi bi-trash-fill"></i></span>
            </button></td>
        </tr>
    `)
})

function calculatePrice() {
    let sum_unit_price = 0
    let sum_taxes = 0
    let sum_subtotal_price = 0
    tabLineDetailTable.find('tbody tr').each(function () {
        if ($(this).find('.product_unit_price').length > 0) {
            sum_unit_price += parseFloat($(this).find('.product_unit_price').attr('value'))
        }
        if ($(this).find('.product_subtotal_price').length > 0) {
            sum_subtotal_price += parseFloat($(this).find('.product_subtotal_price').attr('data-init-money'))
        }
        if ($(this).find('.product_taxes').length > 0) {
            sum_taxes += parseFloat($(this).find('.product_taxes').attr('data-init-money'))
        }
    })
    $('#pretax-value').attr('data-init-money', sum_subtotal_price)
    $('#taxes-value').attr('data-init-money', sum_taxes)
    $('#total-value').attr('data-init-money', sum_subtotal_price + sum_taxes)

    $.fn.initMaskMoney2()
}

class APInvoiceHandle {
    load() {
        loadTableSelectSupplier()
        loadPurchaseOrder()
    }
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = $('#name').val()
        frm.dataForm['supplier_mapped'] = supplierCodeEle.attr('data-id')
        frm.dataForm['supplier_name'] = supplierCodeEle.val()
        frm.dataForm['po_mapped'] = purchaseOrderEle.val()
        frm.dataForm['posting_date'] = postingDateEle.val()
        frm.dataForm['document_date'] = documentDateEle.val()
        frm.dataForm['invoice_date'] = invoiceDateEle.val()
        frm.dataForm['invoice_sign'] = $('#invoice-sign').val()
        frm.dataForm['invoice_number'] = $('#invoice-number').val()
        frm.dataForm['invoice_example'] = $('#invoice-exp').val()
        frm.dataForm['goods_receipt_mapped_list'] = tabLineDetailTable.attr('data-goods-receipt-selected').split(',')

        frm.dataForm['data_item_list'] = []
        tabLineDetailTable.find('tbody tr').each(function () {
            if ($(this).find('.product-id').length > 0) {
                frm.dataForm['data_item_list'].push({
                    'item_index': $(this).find('td:first-child').text(),
                    'product_id': $(this).find('.product-id').attr('data-id'),
                    'product_uom_id': $(this).find('.uom-id').attr('data-id'),
                    'product_quantity': $(this).find('.quantity_import').text(),
                    'product_unit_price': $(this).find('.product_unit_price').attr('value'),
                    'product_tax_value': $(this).find('.product_taxes').attr('data-init-money'),
                    'product_subtotal': $(this).find('.product_subtotal_price').attr('data-init-money'),
                })
            }
        })

        // frm.dataForm['system_status'] = 1;
        if (frm.dataForm['data_item_list'].length === 0) {
            $.fn.notifyB({description: "No item in tab line detail"}, 'failure')
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

function Disabled(option) {
    if (option === 'detail') {
        $('#collapse-area input').prop('readonly', true).prop('disabled', true)
        $('#collapse-area select').prop('disabled', true)
        $('tr input').prop('readonly', true).prop('disabled', true)
        supplierSelectBtn.addClass('disabled')
        $('#btn-add-row-line-detail').remove()
        $('#btn-add-row-line-detail-discount').remove()
    }
}

function LoadDetailAPInvoice(option) {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-ap-invoice').attr('data-url-detail-api').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['ap_invoice_detail'];
                console.log(data)
                $x.fn.renderCodeBreadcrumb(data);

                $('#name').val(data?.['title'])
                supplierCodeEle.val(data?.['supplier_mapped']?.['name'])
                supplierCodeEle.attr('data-id', data?.['supplier_mapped']?.['id'])
                loadPurchaseOrder(data?.['po_mapped'])
                postingDateEle.val(data?.['posting_date'].split(' ')[0])
                documentDateEle.val(data?.['document_date'].split(' ')[0])
                invoiceDateEle.val(data?.['invoice_date'].split(' ')[0])
                $('#invoice-sign').val(data?.['invoice_sign'])
                $('#invoice-number').val(data?.['invoice_number'])
                $('#invoice-exp').val(data?.['invoice_example'])

                tabLineDetailTable.attr('data-goods-receipt-selected', data?.['goods_receipt_mapped'].map(item => item.id).join(','))

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
