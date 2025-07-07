/**
 * Khai báo các element trong page
 */
class APInvoicePageElements {
    constructor() {
        // info
        this.$script_url = $('#script-url')
        this.$supplier_name = $('#supplier-name')
        this.$supplier_select_btn = $('#supplier-select-btn')
        this.$supplier_select_modal = $('#supplier-select-modal')
        this.$table_select_supplier = $('#table-select-supplier')
        this.$accept_select_supplier_btn = $('#accept-supplier-select-btn')
        this.$supplier_code = $('#supplier-code')
        this.$tax_code = $('#tax_code')
        this.$view_tax_code_info = $('#view-tax-code-info')
        this.$invoice_number = $('#invoice-number')
        this.$invoice_exp = $('#invoice-exp')
        this.$invoice_sign = $('#invoice-sign')
        this.$invoice_date= $('#invoice-date')
        this.$title = $('#title')
        this.$purchase_order = $('#purchase-order')
        this.$posting_date = $('#posting-date')
        this.$document_date = $('#document-date')
        this.$note = $('#note')
        // tab
        this.$btn_select_from_gr = $('#btn-select-from-gr')
        this.$gr_table = $('#goods-receipt-table')
        this.$gr_product_table = $('#goods-receipt-product-table')
        this.$tab_line_detail_table = $('#tab_line_detail_datatable')
        this.$accept_gr_product_btn = $('#accept-gr-product-btn')
        this.$gr_product_data_script = $('#gr_product_data_script')
    }
}
const pageElements = new APInvoicePageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class APInvoicePageVariables {
    constructor() {
        this.invoice_signs = JSON.parse($('#invoice_signs').text() || '{}')
    }
}
const pageVariables = new APInvoicePageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class APInvoicePageFunction {
    static LoadSupplierTable() {
        pageElements.$table_select_supplier.DataTable().clear().destroy()
        pageElements.$table_select_supplier.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            ajax: {
                url: pageElements.$table_select_supplier.attr('data-url') + '?full_info=true',
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('supplier_list')) {
                        return data?.['supplier_list'];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input type="radio"
                                    name="supplier-selected-radio"
                                    class="form-check-input"
                                    data-supplier='${JSON.stringify(row)}'/>
                                </div>`
                    }
                },
                {
                    data: 'code',
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
    static LoadPurchaseOrder(data) {
        pageElements.$purchase_order.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$purchase_order.attr('data-url') + `?supplier_id=${pageElements.$supplier_name.attr('data-id')}`,
                method: 'GET',
            },
            templateResult: function(data) {
                let ele = $('<div class="row"></div>');
                ele.append(`<div class="col-12"><span class="badge badge-soft-primary">${data.data?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['title']}</div>`);
                return ele;
            },
            data: (data ? data : null),
            keyResp: 'purchase_order_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if (pageElements.$purchase_order.val()) {
                pageElements.$btn_select_from_gr.removeClass('disabled')
            }
            else {
                pageElements.$btn_select_from_gr.addClass('disabled')
            }
        })
    }
    static LoadGoodsReceiptTable() {
        pageElements.$gr_table.DataTable().destroy()
        pageElements.$gr_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            ajax: {
                url: pageElements.$script_url.attr('data-url-goods-receipt-list') + `?purchase_order_id=${pageElements.$purchase_order.val()}`,
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $('#select-goods-receipt-offcanvas').offcanvas('show')
                        // console.log(resp.data['goods_receipt_list'])
                        return resp.data['goods_receipt_list']
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
                    className: 'w-50',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary mr-1">${row?.['code']}</span><span class="text-primary">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `${moment(row?.['date_received'], 'YYYY-MM-DD').format('DD/MM/YYYY')}`
                    }
                },
                {
                    className: 'w-20 text-center',
                    render: (data, type, row) => {
                        return `${row?.['already'] ? `<i class="fas fa-check-circle text-success mr-1"></i>` + $.fn.gettext('Invoiced') : ''}
                                <div class="form-check" ${row?.['already'] ? 'hidden' : ''}>
                                    <input data-detail='${JSON.stringify(row?.['details'] || [])}' ${row?.['already'] ? 'checked' : ''} data-already="${row?.['already'] ? '1' : '0'}" data-id="${row?.['id']}" type="checkbox" name="selected-goods-receipt" class="form-check-input selected-goods-receipt">
                                    <label class="form-check-label"></label>
                                </div>`

                    }
                },
            ]
        });
    }
    static LoadGoodsReceiptProductTable(datasource=[]) {
        pageElements.$gr_product_table.DataTable().clear().destroy()
        pageElements.$gr_product_table.DataTableDefault({
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
                        return `<span>${row?.['gr_quantity'] || 0}</span>`
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        return `<span>${row?.['gr_quantity_before'] || 0}</span>`
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
    static LoadLineDetailTable(datasource=[], option='create') {
        let from_po = pageElements.$purchase_order.val() ? 'disabled readonly' : ''
        pageElements.$tab_line_detail_table.DataTable().clear().destroy()
        pageElements.$tab_line_detail_table.DataTableDefault({
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
                    className: 'text-center',
                    render: () => {
                        return `<button type='button' ${from_po} class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs delete-item-row">
                                    <span class="icon"><i class="fas fa-trash"></i></span>
                                </button>`;
                    }
                },
                {
                        render: (data, type, row) => {
                        let product_data = row?.['product_data'] || {}
                        return `<div class="input-group">
                                <span class="input-affix-wrapper">
                                    <span class="input-prefix product-des" data-bs-toggle="tooltip" title="${product_data?.['description']}"><i class="bi bi-info-circle"></i></span>
                                    <select ${from_po} data-product='${JSON.stringify(product_data)}' class="form-select select-2 product-select"></select>
                                </span>
                            </div>`
                    }
                },
                {
                        render: (data, type, row) => {
                        let product_uom_data = row?.['product_uom_data'] || {}
                        return `<select ${from_po} data-product-uom='${JSON.stringify(product_uom_data)}' class="form-select select-2 uom-select"></select>`
                    }
                },
                {
                        render: (data, type, row) => {
                        let product_quantity = row?.['product_quantity'] || 0
                        return `<input type="number" ${from_po} value="${product_quantity}" class="form-control product_quantity text-right">`
                    }
                },
                {
                        render: (data, type, row) => {
                        return `<input ${from_po} class="product_unit_price mask-money form-control text-right" value="${row?.['product_unit_price'] || 0}">`
                    }
                },
                {
                        render: (data, type, row) => {
                        return `<span class="product_subtotal_price mask-money" data-init-money="${row?.['product_subtotal'] || 0}"></span>`
                    }
                },
                {
                        render: (data, type, row) => {
                        let product_tax_data = row?.['product_tax_data'] || {}
                        return `<select ${from_po}
                                        data-tax='${JSON.stringify(product_tax_data)}'
                                        data-tax-value="${row?.['product_tax_value'] || 0}"
                                        class="form-select select2 product_taxes"></select>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        return `<span class="product_subtotal_price_final mask-money" data-init-money="${row?.['product_subtotal_final'] || 0}"></span>`
                    }
                },
                {
                        render: (data, type, row) => {
                        return `<textarea rows="1" class="form-control note">${row?.['note'] || ''}</textarea>`
                    }
                },
            ],
            initComplete: function(settings, json) {
                if (datasource.length > 0) {
                    pageElements.$tab_line_detail_table.find('tbody tr').each(function () {
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
                    APInvoicePageFunction.CalculatePrice()

                    if (option === 'detail') {
                        pageElements.$tab_line_detail_table.find('tbody tr input').prop('disabled', true).prop('readonly', true)
                        pageElements.$tab_line_detail_table.find('tbody tr textarea').prop('disabled', true).prop('readonly', true)
                        pageElements.$tab_line_detail_table.find('tbody tr select').prop('disabled', true)
                        pageElements.$tab_line_detail_table.find('tbody tr button').prop('disabled', true)
                    }
                }
            }
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
            result = xe2[parseInt(str_n[0])] + " " + APInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(1, len_n)))
        }
        else if (len_n <= 6) {
            result = APInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 3))) + " nghìn " + APInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(len_n - 3, len_n)))
        }
        else if (len_n <= 9) {
            result = APInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 6))) + " triệu " + APInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(len_n - 6, len_n)))
        }
        else if (len_n <= 12) {
            result = APInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 9))) + " tỷ " + APInvoicePageFunction.ReadMoneyVND(parseInt(str_n.substring(len_n - 9, len_n)))
        }

        result = String(result.trim())
        return result;
    }
    static CalculatePrice() {
        let sum_taxes = 0
        let sum_subtotal_price = 0
        let sum_amount = 0
        let dropdown_tax_detail_data = {}
        pageElements.$tab_line_detail_table.find('tbody tr').each(function () {
            let row = $(this)
            let quantity = parseFloat(row.find('.product_quantity').val() || 0)
            let unit_price = parseFloat(row.find('.product_unit_price').attr('value') || 0)
            let tax_selected = SelectDDControl.get_data_from_idx(row.find('.product_taxes'), row.find('.product_taxes').val())
            let tax_rate = parseFloat(tax_selected?.['rate'] || 0)

            let row_subtotal = quantity * unit_price
            let row_tax = row_subtotal * tax_rate / 100
            let row_amount = row_subtotal + row_tax

            sum_subtotal_price += row_subtotal
            sum_taxes += row_tax
            sum_amount += row_amount

            if (dropdown_tax_detail_data?.[tax_rate]) {
                dropdown_tax_detail_data[tax_rate] += row_tax
            }
            else {
                dropdown_tax_detail_data[tax_rate] = row_tax
            }
        })


        $('#pretax-value').attr('value', sum_subtotal_price)
        $('#taxes-value').attr('value', sum_taxes)
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

        let by_words = APInvoicePageFunction.ReadMoneyVND(sum_amount) + ' đồng'
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
class APInvoiceHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['supplier_mapped'] = pageElements.$supplier_name.attr('data-id') || null
        frm.dataForm['purchase_order_mapped'] = pageElements.$purchase_order.val() || null
        frm.dataForm['note'] = pageElements.$note.val()
        frm.dataForm['posting_date'] = moment(pageElements.$posting_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment(pageElements.$document_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['invoice_date'] = moment(pageElements.$invoice_date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['invoice_sign'] = pageElements.$invoice_sign.val()
        frm.dataForm['invoice_number'] = pageElements.$invoice_number.val()
        frm.dataForm['invoice_example'] = pageElements.$invoice_exp.val()
        frm.dataForm['goods_receipt_mapped_list'] = pageElements.$tab_line_detail_table.attr('data-goods-receipt-selected').split(',')

        let data_item_list = []
        pageElements.$tab_line_detail_table.find('tbody tr').each(function () {
            data_item_list.push({
                'item_index': $(this).find('td:first-child').text(),
                'product_id': $(this).find('.product-select').val() || null,
                'product_uom_id': $(this).find('.uom-select').val() || null,
                'product_quantity': $(this).find('.product_quantity').val(),
                'product_unit_price': $(this).find('.product_unit_price').attr('value'),
                'product_subtotal': $(this).find('.product_subtotal_price').attr('data-init-money'),
                'product_discount_value': $(this).find('.product_discount_value').attr('value'),
                'product_tax_id': $(this).find('.product_taxes').val() || null,
                'product_tax_value': $(this).find('.product_taxes').attr('data-tax-value'),
                'product_subtotal_final': $(this).find('.product_subtotal_price_final').attr('data-init-money'),
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
    static LoadDetailAPInvoice(option) {
        let url_loaded = $('#form-detail-ap-invoice').attr('data-url')
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['ap_invoice_detail'];

                    // console.log(data)

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
                    pageElements.$supplier_name.val(data?.['supplier_mapped_data']?.['name'])
                    pageElements.$supplier_name.attr('data-id', data?.['supplier_mapped_data']?.['id'])
                    pageElements.$supplier_code.val(data?.['supplier_mapped_data']?.['code'])
                    pageElements.$tax_code.val(data?.['supplier_mapped_data']?.['tax_code'])
                    APInvoicePageFunction.LoadPurchaseOrder(data?.['purchase_order_mapped_data'])

                    pageElements.$posting_date.val(moment(data?.['posting_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    pageElements.$document_date.val(moment(data?.['document_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    pageElements.$invoice_date.val(moment(data?.['invoice_date'].split(' ')[0]).format('DD/MM/YYYY'))
                    pageElements.$invoice_sign.val(data?.['invoice_sign'])
                    pageElements.$invoice_number.val(data?.['invoice_number'])
                    pageElements.$invoice_exp.val(data?.['invoice_example'])
                    $('#ap-invoice-label').text(pageElements.$invoice_exp.find('option:selected').attr('data-text'))
                    pageElements.$note.val(data?.['note'])

                    pageElements.$tab_line_detail_table.attr('data-goods-receipt-selected', data?.['goods_receipt_mapped'].map(item => item.id).join(','))

                    APInvoicePageFunction.LoadLineDetailTable(data?.['item_mapped'].sort((a, b) => a.item_index - b.item_index), option)

                    new $x.cls.file($('#attachment')).init({
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    $.fn.initMaskMoney2();

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                    UsualLoadPageFunction.DisablePage(
                        option==='detail',
                        ['#view-tax-code-info']
                    )
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class APInvoiceEventHandler {
    static InitPageEven() {
        pageElements.$invoice_exp.on('change', function () {
            $('#ap-invoice-label').text($(this).find('option:selected').attr('data-text'))
        })
        pageElements.$accept_select_supplier_btn.on('click', function () {
            let selected_obj = null
            $('input[name="supplier-selected-radio"]').each(async function () {
                if ($(this).prop('checked')) {
                    selected_obj = $(this).attr('data-supplier') ? JSON.parse($(this).attr('data-supplier')) : {}
                    pageElements.$supplier_name.val(selected_obj?.['name']).attr('data-id', selected_obj?.['id']).prop('readonly', true).prop('disabled', true)
                    pageElements.$supplier_code.val(selected_obj?.['code'])
                    pageElements.$tax_code.val(selected_obj?.['tax_code'])
                    pageElements.$purchase_order.prop('disabled', false)
                    APInvoicePageFunction.LoadPurchaseOrder()
                    pageElements.$supplier_select_modal.modal('hide')

                    let [tax_code_status, responseData] = await APInvoicePageFunction.CheckTaxCode()
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
                let [tax_code_status, responseData] = await APInvoicePageFunction.CheckTaxCode()
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
        pageElements.$supplier_select_btn.on('click', function () {
            APInvoicePageFunction.LoadSupplierTable()
        })
        pageElements.$accept_gr_product_btn.on('click', function () {
            APInvoicePageFunction.LoadLineDetailTable(JSON.parse(pageElements.$gr_product_data_script.text()))
            $('#select-goods-receipt-offcanvas').offcanvas('hide')
            let data_product = []
            $('.selected-goods-receipt').each(function () {
                if ($(this).prop('checked') && $(this).attr('data-already') === '0') {
                    data_product.push($(this).attr('data-id'))
                }
            })
            pageElements.$tab_line_detail_table.attr('data-goods-receipt-selected', data_product.join(','))
        })
        pageElements.$btn_select_from_gr.on('click', function () {
            if (pageElements.$purchase_order.val()) {
                APInvoicePageFunction.LoadGoodsReceiptTable()
                APInvoicePageFunction.LoadGoodsReceiptProductTable()
            }
            else {
                $.fn.notifyB({description: "You have not selected Purchase order yet"}, 'warning')
            }
        })
        $(document).on("click", '.delete-item-row', function () {
            UsualLoadPageFunction.DeleteTableRow(
                pageElements.$tab_line_detail_table,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
            APInvoicePageFunction.CalculatePrice()
        })
        $(document).on("change", '.selected-goods-receipt', function () {
            // xử lí dữ liệu product goods receipt
            let data_product = []
            let data_product_already = []
            $('.selected-goods-receipt').each(function () {
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

                    if (!merged_data_product[productId]) {
                        merged_data_product[productId] = {
                            product_data: entry?.['product_data'],
                            product_uom_data: entry?.['product_uom_data'],
                            gr_quantity: entry?.['gr_quantity'],
                            gr_quantity_before: data_product_already
                                .filter(item => item?.['product_data']?.['id'] === productId)
                                .reduce((sum, item) => sum + item?.['product_quantity'], 0),
                            product_quantity: entry?.['product_quantity'],
                            product_unit_price: entry?.['product_unit_price'],
                            product_subtotal: entry?.['product_subtotal'],
                            product_tax_data: entry?.['product_tax_data'],
                            product_tax_value: entry?.['product_tax_value'],
                            product_subtotal_final: entry?.['product_subtotal_final'],
                        }
                    }
                    else {
                        merged_data_product[productId]['product_quantity'] += entry?.['product_quantity']
                        merged_data_product[productId]['product_subtotal'] += entry?.['product_subtotal']
                        merged_data_product[productId]['product_tax_value'] += entry?.['product_tax_value']
                        merged_data_product[productId]['product_subtotal_final'] += entry?.['product_subtotal_final']
                    }
                }
            });
            data_product = Object.values(merged_data_product)

            APInvoicePageFunction.LoadGoodsReceiptProductTable(data_product)
            pageElements.$gr_product_data_script.text(JSON.stringify(data_product))
        })
    }
}
