/**
 * Khai báo các element trong page
 */
class PaymentPageElements {
    constructor() {
        this.$script_trans = $('#script-trans')
        this.$script_url = $('#script-url')
        this.$opportunity_id = $('#opportunity_id')
        this.$employee_inherit_id = $('#employee_inherit_id')
        this.$quotation_mapped_select = $('#quotation_mapped_select')
        this.$sale_order_mapped_select = $('#sale_order_mapped_select')
        this.$title = $('#title')
        this.$payment_type = $('#payment_type')
        this.$supplier_id = $('#supplier_id')
        this.$employee_payment_id = $('#employee_payment_id')
        this.$payment_method = $('#payment-method')
        this.$bank_info = $('#bank-info')
        this.$bank_account_table = $('#bank-account-table')
        this.$accept_bank_account_btn = $('#accept-bank-account-btn')
        this.$date_created = $('#date_created')
        this.$employee_created = $('#employee_created')
        // tab
        this.$table_line_detail = $('#table_line_detail')
        this.$table_plan = $('#table_plan')
        this.$advance_payment_list_datatable = $('#advance_payment_list_datatable')
        this.$offcanvasRightLabel = $('#offcanvasRightLabel')
    }
}
const pageElements = new PaymentPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class PaymentPageVariables {
    constructor() {
        this.current_value_converted_from_ap = ''
        this.AP_filter = null
        this.DETAIL_DATA = null
        this.payment_for = null
    }
}
const pageVariables = new PaymentPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class PaymentPageFunction {
    static LoadTableBankAccount(data_list=[]) {
        pageElements.$bank_account_table.DataTable().clear().destroy()
        pageElements.$bank_account_table.DataTableDefault({
            styleDom: 'hide-foot',
            scrollY: '64vh',
            scrollCollapse: true,
            rowIdx: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    className: 'w-5 text-center',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input class="form-check-input bank_account_selected" name="bank_account_selected" type="radio"></div>`
                    }
                },
                {
                    className: 'w-90',
                    render: (data, type, row) => {
                        if (row?.['manual']) {
                            return `<div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Bank name')}:</label><div class="col-9"><input class="form-control fw-bold bank_name"></div></div>
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Account name')}:</label><div class="col-9"><input class="form-control fw-bold bank_account_name"></div></div>
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Account number')}:</label><div class="col-9"><input class="form-control fw-bold bank_account_number"></div></div>`
                        }
                        return `${row?.['is_default'] ? `<span class="text-blue small">(${$.fn.gettext('Default')})</span><br>` : ''}
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Bank name')}:</label><div class="col-9"><input disabled readonly class="form-control fw-bold bank_name" value="${row?.['bank_name'] || ''}"></div></div>
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Account name')}:</label><div class="col-9"><input disabled readonly class="form-control fw-bold bank_account_name" value="${row?.['bank_account_name'] || ''}"></div></div>
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Account number')}:</label><div class="col-9"><input disabled readonly class="form-control fw-bold bank_account_number" value="${row?.['bank_account_number'] || ''}"></div></div>`
                    }
                },
            ],
            initComplete: function () {
                UsualLoadPageFunction.AddTableRow(
                    pageElements.$bank_account_table,
                    {'manual': true}
                )
                let row_added = pageElements.$bank_account_table.find('tbody tr:last-child')
                row_added.addClass('bg-primary-light-5')
            }
        })
    }
    static LoadQuotation(data) {
        pageElements.$quotation_mapped_select.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$quotation_mapped_select.attr('data-url'),
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<span class="badge badge-soft-primary mr-2">${state.data?.['code']}</span><span>${state.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'quotation_list',
            keyId: 'id',
            keyText: 'code',
        }).on('change', function () {
            pageElements.$opportunity_id.empty();
            pageElements.$sale_order_mapped_select.empty();
            if (pageElements.$quotation_mapped_select.val()) {
                pageElements.$opportunity_id.prop('disabled', true)
                pageElements.$sale_order_mapped_select.prop('disabled', true)
                let selected = SelectDDControl.get_data_from_idx(pageElements.$quotation_mapped_select, pageElements.$quotation_mapped_select.val())
                PaymentPageFunction.LoadSaleOrder(selected?.['sale_order'])
                PaymentPageFunction.LoadPlanQuotationOnly($(this).val())
                pageVariables.payment_for = 'quotation'
            }
            else {
                pageElements.$opportunity_id.prop('disabled', false)
                pageElements.$sale_order_mapped_select.prop('disabled', false)
                pageVariables.payment_for = null
                PaymentPageFunction.DrawTablePlan()
            }
        })
    }
    static LoadSaleOrder(data) {
        pageElements.$sale_order_mapped_select.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$sale_order_mapped_select.attr('data-url'),
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<span class="badge badge-soft-primary mr-2">${state.data?.['code']}</span><span>${state.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'code',
        }).on('change', function () {
            pageElements.$opportunity_id.empty()
            pageElements.$quotation_mapped_select.empty()
            if (pageElements.$sale_order_mapped_select.val()) {
                pageElements.$opportunity_id.prop('disabled', true)
                pageElements.$quotation_mapped_select.prop('disabled', true)
                let selected = SelectDDControl.get_data_from_idx(pageElements.$sale_order_mapped_select, pageElements.$sale_order_mapped_select.val())
                PaymentPageFunction.LoadQuotation(selected?.['quotation'])
                PaymentPageFunction.LoadPlanSaleOrderOnly($(this).val())
                pageVariables.payment_for = 'saleorder'
            }
            else {
                pageElements.$opportunity_id.prop('disabled', false)
                pageElements.$quotation_mapped_select.prop('disabled', false)
                pageVariables.payment_for = null
                PaymentPageFunction.DrawTablePlan()
            }
        })
    }
    static LoadEmployee(data) {
        pageElements.$employee_payment_id.initSelect2({
            ajax: {
                url: pageElements.$employee_payment_id.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            templateResult: function (data) {
                let ele = $('<div class="row col-12"></div>');
                ele.append(`<div class="col-2"><span class="badge badge-soft-primary">${data.data?.['code']}</span></div><div class="col-6">${data.data?.['full_name']}</div>`);
                if (data.data?.['group']['title'] !== undefined) {
                    ele.append(`<div class="col-4">(${data.data?.['group']['title']})</div>`);
                }
                return ele;
            },
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }
    static LoadSupplier(data) {
        pageElements.$supplier_id.initSelect2({
            ajax: {
                url: pageElements.$supplier_id.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'supplier_list',
            keyId: 'id',
            keyText: 'name',
        }).on('change', function () {
            if ($(this).val()) {
                let supplier_selected = SelectDDControl.get_data_from_idx(pageElements.$supplier_id, pageElements.$supplier_id.val())
                PaymentPageFunction.LoadTableBankAccount(supplier_selected?.['bank_accounts_mapped'] || [])
            }
        })
    }
    static ChangeRowPrice(tr) {
        if (!$('#free-input').prop('checked')) {
            let unit_price = tr.find('.expense-unit-price-input')
            let quantity = tr.find('.expense_quantity');
            let subtotal = tr.find('.expense-subtotal-price');
            let subtotal_after_tax = tr.find('.expense-subtotal-price-after-tax');
            let tax_rate = 0;
            if (tr.find('.expense-tax-select-box').val()) {
                let tax_selected = SelectDDControl.get_data_from_idx(tr.find('.expense-tax-select-box'), tr.find('.expense-tax-select-box').val())
                tax_rate = tax_selected?.['rate'] ? parseFloat(tax_selected?.['rate']) : 0;
            }
            if (unit_price.attr('value') && quantity.val()) {
                let subtotal_value = parseFloat(unit_price.attr('value')) * parseFloat(quantity.val())
                let tax_value = subtotal_value * tax_rate / 100
                let subtotal_after_tax_value = subtotal_value + tax_value
                subtotal.attr('value', subtotal_value.toFixed(0));
                subtotal_after_tax.attr('value', subtotal_after_tax_value.toFixed(0));
            } else {
                unit_price.attr('value', 0);
                subtotal.attr('value', 0);
                subtotal_after_tax.attr('value', 0);
            }
        }
        PaymentPageFunction.CheckAndOpenExpandRow(tr)
        PaymentPageFunction.CalculateTotalPrice();
        $.fn.initMaskMoney2();
    }
    static CalculateTotalPrice() {
        let sum_subtotal = 0
        let sum_tax = 0;
        let sum_subtotal_price_after_tax = 0;

        pageElements.$table_line_detail.find('tbody tr').each(function (index, ele) {
            let tr = $(ele)
            let subtotal = tr.find('.expense-subtotal-price')
            let subtotal_after_tax = tr.find('.expense-subtotal-price-after-tax')
            let tax_rate = 0;
            if (tr.find('.expense-tax-select-box').val()) {
                let tax_selected = SelectDDControl.get_data_from_idx(tr.find('.expense-tax-select-box'), tr.find('.expense-tax-select-box').val())
                tax_rate = tax_selected?.['rate'] ? parseFloat(tax_selected?.['rate']) : 0;
            }
            if (subtotal.attr('value') && subtotal_after_tax.attr('value')) {
                sum_subtotal += parseFloat(subtotal.attr('value'))
                sum_tax += parseFloat(subtotal.attr('value')) * tax_rate / 100
                sum_subtotal_price_after_tax += parseFloat(subtotal_after_tax.attr('value'))
            }
        })

        $('#pretax-value').attr('value', sum_subtotal.toFixed(0));
        $('#taxes-value').attr('value', sum_tax.toFixed(0));
        $('#total-value').attr('value', sum_subtotal_price_after_tax.toFixed(0));
        let total_value_by_words = UsualLoadPageFunction.ReadMoneyVND(sum_subtotal_price_after_tax) + ' đồng'
        total_value_by_words = total_value_by_words.charAt(0).toUpperCase() + total_value_by_words.slice(1)
        if (total_value_by_words[total_value_by_words.length - 1] === ',') {
            total_value_by_words = total_value_by_words.substring(0, total_value_by_words.length - 1) + ' đồng'
        }
        $('#total-value-by-words').val(total_value_by_words)
        $.fn.initMaskMoney2();
    }
    static SumAPItemsCast() {
        let result_total_value = 0;
        $('.product-tables').find('.total-converted-value').each(function () {
            result_total_value += parseFloat($(this).attr('data-init-money'));
        })
        return result_total_value;
    }
    static GetAPItems() {
        let ap_expense_items = [];
        $('.product-tables').find('.product-selected').each(function () {
            if ($(this).is(':checked')) {
                let value_converted = parseFloat($(this).closest('tr').find('.converted-value-inp').attr('value'));
                if ($(this).attr('data-id') && value_converted > 0) {
                    ap_expense_items.push({
                        'ap_title': $(this).attr('data-ap-title'),
                        'ap_cost_converted_id': $(this).attr('data-id'),
                        'value_converted': value_converted,
                    });
                }
            }
        })
        return ap_expense_items;
    }
    static ExpandRowFormat(data_row) {
        let detail_converted_html_full = ``
        if (Object.keys(data_row).length > 0) {
            let detail_converted_html = ``;
            for (let x = 0; x < data_row?.['ap_cost_converted_list'].length; x++) {
                detail_converted_html += `<a class="dropdown-item" href="#">${data_row?.['ap_cost_converted_list'][x]?.['ap_title']}: <span class="mask-money text-secondary" data-init-money="${data_row?.['ap_cost_converted_list'][x]?.['value_converted']}"></span></a>`
            }
            if (detail_converted_html) {
                detail_converted_html_full = `<div class="btn-group" role="group">
                    <button data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn btn-sm btn-rounded btn-icon btn-outline-light" type="button">
                        <span class="icon"><i class="bi bi-chevron-down"></i></span>
                    </button>
                    <div class="dropdown-menu">
                        ${detail_converted_html}
                    </div>
                </div>`;
            }
        }
        return `<div class="row">
                    <div class="col-4">
                        <div class="row">
                            <label class="col-3 col-form-label">${pageElements.$script_trans.attr('data-trans-payment-value')}</label>
                            <div class="col-7">
                                <input class="value-inp form-control form-control-line mask-money text-primary text-right" value="${data_row?.['real_value'] ? data_row?.['real_value'] : 0}">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="row">
                            <label class="col-3 col-form-label">${pageElements.$script_trans.attr('data-trans-converted-from-ap')}</label>
                            <div class="col-7">
                                <input class="value-converted-from-ap-inp form-control form-control-line mask-money text-primary text-right" value="${data_row?.['converted_value'] ? data_row?.['converted_value'] : 0}" disabled readonly>
                            </div>
                            <div class="col-2">
                                <div class="input-group">
                                    <button data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasSelectDetailAP"
                                            aria-controls="offcanvasExample"
                                            class="mx-2 btn btn-sm btn-rounded btn-icon btn-outline-primary btn-add-payment-value"
                                            type="button">
                                        <span class="icon"><i class="bi bi-pencil-square"></i></span>
                                    </button>
                                    ${detail_converted_html_full}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="row">
                            <label class="col-3 col-form-label">${pageElements.$script_trans.attr('data-trans-sum')}</label>
                            <div class="col-7">
                                <input class="total-value-salecode-item form-control form-control-line mask-money text-primary text-right" value="${data_row?.['sum_value'] ? data_row?.['sum_value'] : 0}" disabled readonly>
                            </div>
                            <script type="application/json" class="detail-ap-items">${data_row?.['ap_cost_converted_list'] ? JSON.stringify(data_row?.['ap_cost_converted_list']) : ''}</script>
                        </div>
                    </div>
                </div>`
    }
    static FindValueConvertedById(id, converted_list) {
        for (let i = 0; i < converted_list.length; i++) {
            if (converted_list[i].ap_cost_converted_id === id) {
                return converted_list[i].value_converted;
            }
        }
        return 0;
    }
    static CheckAndOpenExpandRow(row, data={}) {
        let this_product_item = row.find('.expense-type-select-box').val()
        let this_quantity = row.find('.expense_quantity').val() ? parseFloat(row.find('.expense_quantity').val()) : 0
        let this_after_tax_subtotal = row.find('.expense-subtotal-price-after-tax').attr('value') ? parseFloat(row.find('.expense-subtotal-price-after-tax').attr('value')) : 0
        let this_uom = row.find('.expense-uom-input').val()
        let this_document_number = row.find('.expense-document-number').val()
        if (this_product_item && this_quantity > 0 && this_after_tax_subtotal > 0 && this_uom && this_document_number) {
            PaymentPageFunction.AddExpandRow(row, data)
        }
        else {
            PaymentPageFunction.RemoveExpandRow(row)
        }
    }
    static AddExpandRow(tr, data) {
        tr.find('.hide-expand-row-btn').prop('disabled', false)
        let row = pageElements.$table_line_detail.DataTable().row(tr);
        if (!row.child.isShown()) {
            row.child(PaymentPageFunction.ExpandRowFormat(data)).show();
            tr.next().attr('class', `row-detail-product-${tr.find('td:eq(0)').text()}`)
            tr.addClass('shown');
        }
        $.fn.initMaskMoney2()
    }
    static RemoveExpandRow(tr) {
        tr.find('.hide-expand-row-btn').prop('disabled', true)
        let row = pageElements.$table_line_detail.DataTable().row(tr);
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        $.fn.initMaskMoney2()
    }
    // line detail
    static DrawLineDetailTable(data_list = [], option = 'create') {
        pageElements.$table_line_detail.DataTable().clear().destroy()
        pageElements.$table_line_detail.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': ()=> {
                        return `<button ${option === 'create' ? 'disabled' : ''} class="hide-expand-row-btn btn btn-icon btn-rounded btn-flush-primary flush-soft-hover" type="button">
                                    <span class="icon"><i class="far fa-window-maximize"></i></span>
                                </button>`;
                    },
                },
                {
                    'render': () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 expense-type-select-box"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<textarea ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-des-input">${row?.['expense_description'] ? row?.['expense_description'] : ''}</textarea>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<div class="input-group">
                                    <div class="row g-1">
                                        <div class="col-5">
                                            <input ${option === 'detail' ? 'disabled readonly' : ''} type="number" min="1" class="form-control expense_quantity" value="${row?.['expense_quantity'] ? row?.['expense_quantity'] : 1}">
                                        </div>
                                        <div class="col-7">
                                            <input ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-uom-input" value="${row?.['expense_uom_name'] ? row?.['expense_uom_name'] : ''}" placeholder="${$.fn.gettext('input UOM...')}">
                                        </div>
                                    </div>
                                </div>`
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-unit-price-input mask-money" value="${row?.['expense_unit_price'] ? row?.['expense_unit_price'] : '0'}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input class="form-control expense-subtotal-price mask-money" ${$('#free-input').prop('checked') ? '' : 'readonly disabled'} value="${row?.['expense_subtotal_price'] ? row?.['expense_subtotal_price'] : '0'}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 expense-tax-select-box"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input class="form-control expense-subtotal-price-after-tax mask-money" ${$('#free-input').prop('checked') ? '' : 'readonly disabled'} value="${row?.['expense_after_tax_price'] ? row?.['expense_after_tax_price'] : '0'}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-document-number" value="${row?.['document_number'] ? row?.['document_number'] : ''}">`;
                    }
                },
                {
                    className: 'text-right',
                    'render': () => {
                        return `<button type='button' ${option === 'detail' ? 'disabled' : ''} class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs btn-del-line-detail">
                                    <span class="icon"><i class="fas fa-trash"></i></span>
                                </button>`;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    pageElements.$table_line_detail.find('tbody tr').each(function (index) {
                        $(this).attr('id', `row-${index+1}`)
                        PaymentPageFunction.LoadExpenseItem($(this).find('.expense-type-select-box'), data_list[index]?.['expense_type'])
                        PaymentPageFunction.LoadTax($(this).find('.expense-tax-select-box'), data_list[index]?.['expense_tax'])
                        PaymentPageFunction.CheckAndOpenExpandRow($(this), data_list[index])
                        $('.btn-add-payment-value').prop('disabled', option==='detail');
                    })
                    PaymentPageFunction.CalculateTotalPrice();
                }
            }
        });
    }
    static LoadExpenseItem(ele, data) {
        ele.initSelect2({
            ajax: {
                url: pageElements.$table_line_detail.attr('data-url-expense-type-list'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'expense_item_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            PaymentPageFunction.CheckAndOpenExpandRow($(this).closest('tr'))
        })
    }
    static LoadTax(ele, data) {
        ele.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$table_line_detail.attr('data-url-tax-list'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tax_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadAPList() {
        let current_sale_code = []
        if (pageVariables.DETAIL_DATA) {
            if (pageVariables.DETAIL_DATA?.['opportunity']) {
                current_sale_code.push(pageVariables.DETAIL_DATA?.['opportunity']?.['id'])
            } else if (pageVariables.DETAIL_DATA?.['quotation_mapped']) {
                current_sale_code.push(pageVariables.DETAIL_DATA?.['quotation_mapped']?.['id'])
            } else if (pageVariables.DETAIL_DATA?.['sale_order_mapped']) {
                current_sale_code.push(pageVariables.DETAIL_DATA?.['sale_order_mapped']?.['id'])
            }
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            let type = urlParams.get('type');
            if (type) {
                let opportunity = pageElements.$opportunity_id.val();
                let quotation_mapped = pageElements.$quotation_mapped_select.val();
                let sale_order_mapped = pageElements.$sale_order_mapped_select.val();
                if (opportunity && type === '0') {
                    current_sale_code.push(opportunity)
                } else if (quotation_mapped && type === '1') {
                    current_sale_code.push(quotation_mapped)
                } else if (sale_order_mapped && type === '2') {
                    current_sale_code.push(sale_order_mapped)
                }
            } else {
                let opportunity = pageElements.$opportunity_id.val();
                let quotation_mapped = pageElements.$quotation_mapped_select.val();
                let sale_order_mapped = pageElements.$sale_order_mapped_select.val();
                if (opportunity && pageElements.$opportunity_id.prop('disabled') === false) {
                    current_sale_code.push(opportunity)
                } else if (quotation_mapped && pageElements.$quotation_mapped_select.prop('disabled') === false) {
                    current_sale_code.push(quotation_mapped)
                } else if (sale_order_mapped && pageElements.$sale_order_mapped_select.prop('disabled') === false) {
                    current_sale_code.push(sale_order_mapped)
                }
            }
        }

        pageElements.$advance_payment_list_datatable.DataTable().clear().destroy();
        pageElements.$advance_payment_list_datatable.DataTableDefault({
            styleDom: 'hide-foot',
            scrollY: '64vh',
            scrollCollapse: true,
            rowIdx: true,
            paging: false,
            ajax: {
                url: pageElements.$advance_payment_list_datatable.attr('data-url'),
                type: pageElements.$advance_payment_list_datatable.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.data['advance_payment_list']) {
                            let result = [];
                            if (!pageVariables.AP_filter) {
                                for (let i = 0; i < resp.data['advance_payment_list'].length; i++) {
                                    let item = resp.data['advance_payment_list'][i]
                                    let this_sale_code = []
                                    if (item?.['opportunity']?.['id']) this_sale_code = this_sale_code.concat(item?.['opportunity']?.['id'])
                                    if (item?.['quotation_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['quotation_mapped']?.['id'])
                                    if (item?.['sale_order_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['sale_order_mapped']?.['id'])
                                    if (item?.['remain_value'] > 0 && item?.['employee_inherit']?.['id'] === pageElements.$employee_inherit_id.val()) {
                                        if (current_sale_code.length > 0 && this_sale_code.length > 0) {
                                            if (current_sale_code[0] === this_sale_code[0] && item?.['system_status'] === 3) {
                                                result.push(item)
                                            }
                                        }
                                        if (current_sale_code.length === 0 && this_sale_code.length === 0) {
                                            if (item?.['system_status'] === 3) {
                                                result.push(item)
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (let i = 0; i < resp.data['advance_payment_list'].length; i++) {
                                    let item = resp.data['advance_payment_list'][i]
                                    let this_sale_code = []
                                    if (item?.['opportunity']?.['id']) this_sale_code = this_sale_code.concat(item?.['opportunity']?.['id'])
                                    if (item?.['quotation_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['quotation_mapped']?.['id'])
                                    if (item?.['sale_order_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['sale_order_mapped']?.['id'])
                                    if (item?.['remain_value'] > 0 && item?.['employee_inherit']?.['id'] === pageElements.$employee_inherit_id.val() && item?.['id'] === pageVariables.AP_filter) {
                                        if (current_sale_code.length > 0 && this_sale_code.length > 0) {
                                            if (current_sale_code[0] === this_sale_code[0] && item?.['system_status'] === 3) {
                                                result.push(item)
                                                break
                                            }
                                        }
                                        if (current_sale_code.length === 0 && this_sale_code.length === 0) {
                                            if (item?.['system_status'] === 3) {
                                                result.push(item)
                                            }
                                        }
                                    }
                                }
                            }
                            return result;
                        } else {
                            return [];
                        }
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: '',
                        render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row) => {
                        let checked = '';
                        let disabled = '';
                        if (pageVariables.AP_filter) {
                            checked = 'checked';
                            disabled = 'disabled';
                        }
                        return `<div class="form-check"><input ${checked} ${disabled} data-id="${row.id}" class="form-check-input ap-selected" type="checkbox"></div>`
                    }
                },
                {
                    data: 'code',
                        render: (data, type, row) => {
                        return `<span class="fw-bold text-primary">${row.code}</span>`;
                    }
                },
                {
                    data: 'title',
                        render: (data, type, row) => {
                        return `<span class="text-primary">${row.title}</span>`;
                    }
                },
                {
                    data: 'to_payment',
                        render: (data, type, row) => {
                        return `<span class="text-primary mask-money" data-init-money="${row?.['to_payment']}"></span>`
                    }
                },
                {
                    data: 'return_value',
                        render: (data, type, row) => {
                        return `<span class="text-primary mask-money" data-init-money="${row.return_value}"></span>`
                    }
                },
                {
                    data: 'remain_value',
                        render: (data, type, row) => {
                        return `<span class="text-primary mask-money" data-init-money="${row.remain_value}"></span>`
                    }
                },
            ],
        });
    }
    // plan
    static DrawTablePlan(data_list=[]) {
        $('#notify-none-sale-code').prop('hidden', data_list.length > 0 && pageElements.$opportunity_id.val() || pageElements.$quotation_mapped_select.val() || pageElements.$sale_order_mapped_select.val())
        pageElements.$table_plan.DataTable().clear().destroy()
        pageElements.$table_plan.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '30vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {

                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span data-zone="plan_tab" class="text-primary">${row?.['expense_item']?.['title']}</spandata-zone>`
                        }
                        return `<span data-zone="plan_tab" class="text-danger">${row?.['expense_item']?.['title']}</span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span data-zone="plan_tab" class="plan_after_tax mask-money text-primary" data-init-money="${row?.['plan_after_tax']}"></span>`
                        }
                        return `<span data-zone="plan_tab">--</span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span data-zone="plan_tab" class="ap_approved mask-money text-primary" data-init-money="${row?.['ap_approved_value']}"></span>`
                        }
                        return `<span data-zone="plan_tab" class="ap_approved mask-money text-danger" data-init-money="${row?.['ap_approved_value']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span data-zone="plan_tab" class="returned mask-money text-primary" data-init-money="${row?.['sum_return_value']}"></span>`
                        }
                        return `<span data-zone="plan_tab" class="returned mask-money text-danger" data-init-money="${row?.['sum_return_value']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span data-zone="plan_tab" class="to_payment mask-money text-primary" data-init-money="${row?.['sum_converted_value']}"></span>`
                        }
                        return `<span data-zone="plan_tab" class="to_payment mask-money text-danger" data-init-money="${row?.['sum_converted_value']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span data-zone="plan_tab" class="other_payment mask-money text-primary" data-init-money="${row?.['sum_real_value']}"></span>`
                        }
                        return `<span data-zone="plan_tab" class="other_payment mask-money text-danger" data-init-money="${row?.['sum_real_value']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span data-zone="plan_tab" class="available mask-money text-primary" data-init-money="${row?.['sum_available']}"></span>`
                        }
                        return `<span data-zone="plan_tab">--</span>`;
                    }
                },
            ],
        })
    }
    static LoadPlanQuotation(opportunity_id, quotation_id, workflow_runtime_id) {
        if (opportunity_id && quotation_id) {
            let dataParam1 = {'quotation_id': quotation_id}
            let expense_quotation = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-expense-quotation'),
                data: dataParam1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('quotation_expense_list')) {
                        return data?.['quotation_expense_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam2 = {'opportunity_id': opportunity_id}
            let ap_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-ap-cost-list'),
                data: dataParam2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_cost_list')) {
                        return data?.['advance_payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam3 = {'opportunity_id': opportunity_id}
            let payment_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-payment-cost-list'),
                data: dataParam3,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('payment_cost_list')) {
                        return data?.['payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([expense_quotation, ap_mapped_item, payment_mapped_item]).then(
                (results) => {
                    let data_expense = results[0]
                    let data_ap_mapped_item = results[1]
                    let data_payment_mapped_item = results[2]
                    $('#notify-none-sale-code').prop('hidden', true)

                    let data_expense_merge = {};
                    data_expense.forEach(function (item) {
                        let expenseItemId = item?.['expense_item']?.['id'];
                        if (data_expense_merge[expenseItemId] === undefined) {
                            data_expense_merge[expenseItemId] = {
                                id: item?.['id'],
                                expense_title: item?.['expense_title'],
                                expense_item: item?.['expense_item'],
                                tax: item?.['tax'],
                                plan_after_tax: item?.['plan_after_tax']
                            };
                        } else {
                            data_expense_merge[expenseItemId].plan_after_tax += item?.['plan_after_tax'];
                            data_expense_merge[expenseItemId].expense_title += ' (merge) ' + item?.['expense_title'];
                        }
                    });
                    data_expense = Object.values(data_expense_merge);

                    let data_table_planned = []

                    let planned_ap_id = [];
                    let planned_payment_id = [];
                    for (let i = 0; i < data_expense.length; i++) {
                        let ap_approved_value = 0;
                        let sum_return_value = 0;
                        let sum_converted_value = 0;
                        let sum_real_value = 0;
                        for (let j = 0; j < data_ap_mapped_item.length; j++) {
                            if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                                sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                                planned_ap_id.push(data_ap_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        for (let j = 0; j < data_payment_mapped_item.length; j++) {
                            if (data_payment_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                sum_real_value += data_payment_mapped_item[j]?.['real_value'];
                                sum_converted_value += data_payment_mapped_item[j]?.['converted_value'];
                                planned_payment_id.push(data_payment_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                        // if (sum_available < 0) {
                        //     sum_available = 0;
                        // }

                        data_table_planned.push({
                            'type': 'planned',
                            'expense_item': data_expense[i]?.['expense_item'],
                            'plan_after_tax': data_expense[i]?.['plan_after_tax'],
                            'ap_approved_value': ap_approved_value,
                            'sum_return_value': sum_return_value,
                            'sum_converted_value': sum_converted_value,
                            'sum_real_value': sum_real_value,
                            'sum_available': sum_available
                        })
                    }

                    let unplanned_ap = [];
                    let unplanned_payment = [];
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (!planned_ap_id.includes(data_ap_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_ap.push(data_ap_mapped_item[j])
                        }
                    }
                    for (let j = 0; j < data_payment_mapped_item.length; j++) {
                        if (!planned_payment_id.includes(data_payment_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_payment.push(data_payment_mapped_item[j])
                        }
                    }

                    let unplanned_ap_merged = {};
                    $.each(unplanned_ap, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_ap_merged[typeId]) {
                            unplanned_ap_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_ap_merged[typeId].expense_after_tax_price += element.expense_after_tax_price;
                            unplanned_ap_merged[typeId].expense_description = null;
                            unplanned_ap_merged[typeId].expense_quantity += element.expense_quantity;
                            unplanned_ap_merged[typeId].expense_subtotal_price += element.expense_subtotal_price;
                            unplanned_ap_merged[typeId].expense_tax = null;
                            unplanned_ap_merged[typeId].expense_tax_price += element.expense_tax_price;
                            unplanned_ap_merged[typeId].expense_unit_price = null;
                            unplanned_ap_merged[typeId].expense_uom_name = null;
                            unplanned_ap_merged[typeId].sum_converted_value += element.sum_converted_value;
                            unplanned_ap_merged[typeId].sum_return_value += element.sum_return_value;
                        }
                    });
                    unplanned_ap_merged = $.map(unplanned_ap_merged, function(value) {
                        return value;
                    });

                    let unplanned_payment_merged = {};
                    $.each(unplanned_payment, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_payment_merged[typeId]) {
                            unplanned_payment_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_payment_merged[typeId].converted_value += element.converted_value;
                            unplanned_payment_merged[typeId].real_value += element.real_value;
                        }
                    });
                    unplanned_payment_merged = $.map(unplanned_payment_merged, function(value) {
                        return value;
                    });

                    if (unplanned_ap_merged.length !== 0 || unplanned_payment_merged.length !== 0) {
                        let unplanned_payment_merged_has_ap = [];
                        for (let i = 0; i < unplanned_ap_merged.length; i++) {
                            let unplanned_sum_converted_value = 0;
                            let unplanned_sum_real_value = 0;
                            for (let j = 0; j < unplanned_payment_merged.length; j++) {
                                if (unplanned_payment_merged[j]?.['expense_type']?.['id'] === unplanned_ap_merged[i]?.['expense_type']?.['id']) {
                                    unplanned_sum_converted_value += unplanned_payment_merged[j]?.['converted_value']
                                    unplanned_sum_real_value += unplanned_payment_merged[j]?.['real_value']
                                    unplanned_payment_merged_has_ap.push(unplanned_payment_merged[j]?.['expense_type']?.['id'])
                                }
                            }
                            data_table_planned.push({
                                'type': 'unplanned',
                                'expense_item': unplanned_ap_merged[i]?.['expense_type'],
                                'plan_after_tax': '--',
                                'ap_approved_value': unplanned_ap_merged[i]?.['expense_after_tax_price'],
                                'sum_return_value': unplanned_ap_merged[i]?.['sum_return_value'],
                                'sum_converted_value': unplanned_sum_converted_value,
                                'sum_real_value': unplanned_sum_real_value,
                                'sum_available': '--'
                            })
                        }
                        for (let i = 0; i < unplanned_payment_merged.length; i++) {
                            if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                                data_table_planned.push({
                                    'type': 'unplanned',
                                    'expense_item': unplanned_payment_merged[i]?.['expense_type'],
                                    'plan_after_tax': '--',
                                    'ap_approved_value': 0,
                                    'sum_return_value': 0,
                                    'sum_converted_value': unplanned_payment_merged[i]?.['converted_value'],
                                    'sum_real_value': unplanned_payment_merged[i]?.['real_value'],
                                    'sum_available': '--'
                                })
                            }
                        }
                    }

                    PaymentPageFunction.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
    static LoadPlanSaleOrder(opportunity_id, sale_order_id, workflow_runtime_id) {
        if (opportunity_id && sale_order_id) {
            let dataParam1 = {'sale_order_id': sale_order_id}
            let expense_sale_order = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-expense-sale-order'),
                data: dataParam1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('sale_order_expense_list')) {
                        return data?.['sale_order_expense_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam2 = {'opportunity_id': opportunity_id}
            let ap_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-ap-cost-list'),
                data: dataParam2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_cost_list')) {
                        return data?.['advance_payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam3 = {'opportunity_id': opportunity_id}
            let payment_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-payment-cost-list'),
                data: dataParam3,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('payment_cost_list')) {
                        return data?.['payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([expense_sale_order, ap_mapped_item, payment_mapped_item]).then(
                (results) => {
                    let data_expense = results[0]
                    let data_ap_mapped_item = results[1]
                    let data_payment_mapped_item = results[2]
                    $('#notify-none-sale-code').prop('hidden', true)

                    let data_expense_merge = {};
                    data_expense.forEach(function (item) {
                        let expenseItemId = item?.['expense_item']?.['id'];
                        if (data_expense_merge[expenseItemId] === undefined) {
                            data_expense_merge[expenseItemId] = {
                                id: item?.['id'],
                                expense_title: item?.['expense_title'],
                                expense_item: item?.['expense_item'],
                                tax: item?.['tax'],
                                plan_after_tax: item?.['plan_after_tax']
                            };
                        } else {
                            data_expense_merge[expenseItemId].plan_after_tax += item?.['plan_after_tax'];
                            data_expense_merge[expenseItemId].expense_title += ' (merge) ' + item?.['expense_title'];
                        }
                    });
                    data_expense = Object.values(data_expense_merge);

                    let data_table_planned = []

                    let planned_ap_id = [];
                    let planned_payment_id = [];
                    for (let i = 0; i < data_expense.length; i++) {
                        let ap_approved_value = 0;
                        let sum_return_value = 0;
                        let sum_converted_value = 0;
                        let sum_real_value = 0;
                        for (let j = 0; j < data_ap_mapped_item.length; j++) {
                            if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                                sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                                planned_ap_id.push(data_ap_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        for (let j = 0; j < data_payment_mapped_item.length; j++) {
                            if (data_payment_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                sum_real_value += data_payment_mapped_item[j]?.['real_value'];
                                sum_converted_value += data_payment_mapped_item[j]?.['converted_value'];
                                planned_payment_id.push(data_payment_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                        // if (sum_available < 0) {
                        //     sum_available = 0;
                        // }

                        data_table_planned.push({
                            'type': 'planned',
                            'expense_item': data_expense[i]?.['expense_item'],
                            'plan_after_tax': data_expense[i]?.['plan_after_tax'],
                            'ap_approved_value': ap_approved_value,
                            'sum_return_value': sum_return_value,
                            'sum_converted_value': sum_converted_value,
                            'sum_real_value': sum_real_value,
                            'sum_available': sum_available
                        })
                    }

                    let unplanned_ap = [];
                    let unplanned_payment = [];
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (!planned_ap_id.includes(data_ap_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_ap.push(data_ap_mapped_item[j])
                        }
                    }
                    for (let j = 0; j < data_payment_mapped_item.length; j++) {
                        if (!planned_payment_id.includes(data_payment_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_payment.push(data_payment_mapped_item[j])
                        }
                    }

                    let unplanned_ap_merged = {};
                    $.each(unplanned_ap, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_ap_merged[typeId]) {
                            unplanned_ap_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_ap_merged[typeId].expense_after_tax_price += element.expense_after_tax_price;
                            unplanned_ap_merged[typeId].expense_description = null;
                            unplanned_ap_merged[typeId].expense_quantity += element.expense_quantity;
                            unplanned_ap_merged[typeId].expense_subtotal_price += element.expense_subtotal_price;
                            unplanned_ap_merged[typeId].expense_tax = null;
                            unplanned_ap_merged[typeId].expense_tax_price += element.expense_tax_price;
                            unplanned_ap_merged[typeId].expense_unit_price = null;
                            unplanned_ap_merged[typeId].expense_uom_name = null;
                            unplanned_ap_merged[typeId].sum_converted_value += element.sum_converted_value;
                            unplanned_ap_merged[typeId].sum_return_value += element.sum_return_value;
                        }
                    });
                    unplanned_ap_merged = $.map(unplanned_ap_merged, function(value) {
                        return value;
                    });

                    let unplanned_payment_merged = {};
                    $.each(unplanned_payment, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_payment_merged[typeId]) {
                            unplanned_payment_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_payment_merged[typeId].converted_value += element.converted_value;
                            unplanned_payment_merged[typeId].real_value += element.real_value;
                        }
                    });
                    unplanned_payment_merged = $.map(unplanned_payment_merged, function(value) {
                        return value;
                    });

                    if (unplanned_ap_merged.length !== 0 || unplanned_payment_merged.length !== 0) {
                        let unplanned_payment_merged_has_ap = [];
                        for (let i = 0; i < unplanned_ap_merged.length; i++) {
                            let unplanned_sum_converted_value = 0;
                            let unplanned_sum_real_value = 0;
                            for (let j = 0; j < unplanned_payment_merged.length; j++) {
                                if (unplanned_payment_merged[j]?.['expense_type']?.['id'] === unplanned_ap_merged[i]?.['expense_type']?.['id']) {
                                    unplanned_sum_converted_value += unplanned_payment_merged[j]?.['converted_value']
                                    unplanned_sum_real_value += unplanned_payment_merged[j]?.['real_value']
                                    unplanned_payment_merged_has_ap.push(unplanned_payment_merged[j]?.['expense_type']?.['id'])
                                }
                            }
                            data_table_planned.push({
                                'type': 'unplanned',
                                'expense_item': unplanned_ap_merged[i]?.['expense_type'],
                                'plan_after_tax': '--',
                                'ap_approved_value': unplanned_ap_merged[i]?.['expense_after_tax_price'],
                                'sum_return_value': unplanned_ap_merged[i]?.['sum_return_value'],
                                'sum_converted_value': unplanned_sum_converted_value,
                                'sum_real_value': unplanned_sum_real_value,
                                'sum_available': '--'
                            })
                        }
                        for (let i = 0; i < unplanned_payment_merged.length; i++) {
                            if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                                data_table_planned.push({
                                    'type': 'unplanned',
                                    'expense_item': unplanned_payment_merged[i]?.['expense_type'],
                                    'plan_after_tax': '--',
                                    'ap_approved_value': 0,
                                    'sum_return_value': 0,
                                    'sum_converted_value': unplanned_payment_merged[i]?.['converted_value'],
                                    'sum_real_value': unplanned_payment_merged[i]?.['real_value'],
                                    'sum_available': '--'
                                })
                            }
                        }
                    }

                    PaymentPageFunction.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
    static LoadPlanOppOnly(opportunity_id, workflow_runtime_id) {
        if (opportunity_id) {
            let dataParam1 = {'opportunity_id': opportunity_id}
            let ap_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-ap-cost-list'),
                data: dataParam1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_cost_list')) {
                        return data?.['advance_payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam2 = {'opportunity_id': opportunity_id}
            let payment_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-payment-cost-list'),
                data: dataParam2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('payment_cost_list')) {
                        return data?.['payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([ap_mapped_item, payment_mapped_item]).then(
                (results) => {
                    let data_ap_mapped_item = results[0]
                    let data_payment_mapped_item = results[1]
                    $('#notify-none-sale-code').prop('hidden', true)

                    let data_table_planned = []

                    let unplanned_ap = [];
                    let unplanned_payment = [];
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        unplanned_ap.push(data_ap_mapped_item[j])
                    }
                    for (let j = 0; j < data_payment_mapped_item.length; j++) {
                        unplanned_payment.push(data_payment_mapped_item[j])
                    }

                    let unplanned_ap_merged = {};
                    $.each(unplanned_ap, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_ap_merged[typeId]) {
                            unplanned_ap_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_ap_merged[typeId].expense_after_tax_price += element.expense_after_tax_price;
                            unplanned_ap_merged[typeId].expense_description = null;
                            unplanned_ap_merged[typeId].expense_quantity += element.expense_quantity;
                            unplanned_ap_merged[typeId].expense_subtotal_price += element.expense_subtotal_price;
                            unplanned_ap_merged[typeId].expense_tax = null;
                            unplanned_ap_merged[typeId].expense_tax_price += element.expense_tax_price;
                            unplanned_ap_merged[typeId].expense_unit_price = null;
                            unplanned_ap_merged[typeId].expense_uom_name = null;
                            unplanned_ap_merged[typeId].sum_converted_value += element.sum_converted_value;
                            unplanned_ap_merged[typeId].sum_return_value += element.sum_return_value;
                        }
                    });
                    unplanned_ap_merged = $.map(unplanned_ap_merged, function(value) {
                        return value;
                    });

                    let unplanned_payment_merged = {};
                    $.each(unplanned_payment, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_payment_merged[typeId]) {
                            unplanned_payment_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_payment_merged[typeId].converted_value += element.converted_value;
                            unplanned_payment_merged[typeId].real_value += element.real_value;
                        }
                    });
                    unplanned_payment_merged = $.map(unplanned_payment_merged, function(value) {
                        return value;
                    });

                    if (unplanned_ap_merged.length !== 0 || unplanned_payment_merged.length !== 0) {
                        let unplanned_payment_merged_has_ap = [];
                        for (let i = 0; i < unplanned_ap_merged.length; i++) {
                            let unplanned_sum_converted_value = 0;
                            let unplanned_sum_real_value = 0;
                            for (let j = 0; j < unplanned_payment_merged.length; j++) {
                                if (unplanned_payment_merged[j]?.['expense_type']?.['id'] === unplanned_ap_merged[i]?.['expense_type']?.['id']) {
                                    unplanned_sum_converted_value += unplanned_payment_merged[j]?.['converted_value']
                                    unplanned_sum_real_value += unplanned_payment_merged[j]?.['real_value']
                                    unplanned_payment_merged_has_ap.push(unplanned_payment_merged[j]?.['expense_type']?.['id'])
                                }
                            }
                            data_table_planned.push({
                                'type': 'unplanned',
                                'expense_item': unplanned_ap_merged[i]?.['expense_type'],
                                'plan_after_tax': '--',
                                'ap_approved_value': unplanned_ap_merged[i]?.['expense_after_tax_price'],
                                'sum_return_value': unplanned_ap_merged[i]?.['sum_return_value'],
                                'sum_converted_value': unplanned_sum_converted_value,
                                'sum_real_value': unplanned_sum_real_value,
                                'sum_available': '--'
                            })
                        }
                        for (let i = 0; i < unplanned_payment_merged.length; i++) {
                            if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                                data_table_planned.push({
                                    'type': 'unplanned',
                                    'expense_item': unplanned_payment_merged[i]?.['expense_type'],
                                    'plan_after_tax': '--',
                                    'ap_approved_value': 0,
                                    'sum_return_value': 0,
                                    'sum_converted_value': unplanned_payment_merged[i]?.['converted_value'],
                                    'sum_real_value': unplanned_payment_merged[i]?.['real_value'],
                                    'sum_available': '--'
                                })
                            }
                        }
                    }

                    PaymentPageFunction.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
    static LoadPlanQuotationOnly(quotation_id, workflow_runtime_id) {
        if (quotation_id) {
            let dataParam1 = {'quotation_id': quotation_id}
            let expense_quotation = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-expense-quotation'),
                data: dataParam1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('quotation_expense_list')) {
                        return data?.['quotation_expense_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam2 = {'quotation_mapped_id': quotation_id}
            let ap_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-ap-cost-list'),
                data: dataParam2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_cost_list')) {
                        return data?.['advance_payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam3 = {'quotation_mapped_id': quotation_id}
            let payment_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-payment-cost-list'),
                data: dataParam3,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('payment_cost_list')) {
                        return data?.['payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([expense_quotation, ap_mapped_item, payment_mapped_item]).then(
                (results) => {
                    let data_expense = results[0];
                    let data_ap_mapped_item = results[1];
                    let data_payment_mapped_item = results[2];

                    let data_expense_merge = {};
                    data_expense.forEach(function (item) {
                        let expenseItemId = item?.['expense_item']?.['id'];

                        if (data_expense_merge[expenseItemId] === undefined) {
                            data_expense_merge[expenseItemId] = {
                                id: item?.['id'],
                                expense_title: item?.['expense_title'],
                                expense_item: item?.['expense_item'],
                                tax: item?.['tax'],
                                plan_after_tax: item?.['plan_after_tax']
                            };
                        } else {
                            data_expense_merge[expenseItemId].plan_after_tax += item?.['plan_after_tax'];
                            data_expense_merge[expenseItemId].expense_title += ' (merge) ' + item?.['expense_title'];
                        }
                    });
                    data_expense = Object.values(data_expense_merge);

                    let data_table_planned = []

                    let planned_ap_id = [];
                    let planned_payment_id = [];
                    for (let i = 0; i < data_expense.length; i++) {
                        let ap_approved_value = 0;
                        let sum_return_value = 0;
                        let sum_converted_value = 0;
                        let sum_real_value = 0;
                        for (let j = 0; j < data_ap_mapped_item.length; j++) {
                            if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                                sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                                planned_ap_id.push(data_ap_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        for (let j = 0; j < data_payment_mapped_item.length; j++) {
                            if (data_payment_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                sum_real_value += data_payment_mapped_item[j]?.['real_value'];
                                sum_converted_value += data_payment_mapped_item[j]?.['converted_value'];
                                planned_payment_id.push(data_payment_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                        // if (sum_available < 0) {
                        //     sum_available = 0;
                        // }
                        data_table_planned.push({
                            'type': 'planned',
                            'expense_item': data_expense[i]?.['expense_item'],
                            'plan_after_tax': data_expense[i]?.['plan_after_tax'],
                            'ap_approved_value': ap_approved_value,
                            'sum_return_value': sum_return_value,
                            'sum_converted_value': sum_converted_value,
                            'sum_real_value': sum_real_value,
                            'sum_available': sum_available
                        })
                    }

                    let unplanned_ap = [];
                    let unplanned_payment = [];
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (!planned_ap_id.includes(data_ap_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_ap.push(data_ap_mapped_item[j])
                        }
                    }
                    for (let j = 0; j < data_payment_mapped_item.length; j++) {
                        if (!planned_payment_id.includes(data_payment_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_payment.push(data_payment_mapped_item[j])
                        }
                    }

                    let unplanned_ap_merged = {};
                    $.each(unplanned_ap, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_ap_merged[typeId]) {
                            unplanned_ap_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_ap_merged[typeId].expense_after_tax_price += element.expense_after_tax_price;
                            unplanned_ap_merged[typeId].expense_description = null;
                            unplanned_ap_merged[typeId].expense_quantity += element.expense_quantity;
                            unplanned_ap_merged[typeId].expense_subtotal_price += element.expense_subtotal_price;
                            unplanned_ap_merged[typeId].expense_tax = null;
                            unplanned_ap_merged[typeId].expense_tax_price += element.expense_tax_price;
                            unplanned_ap_merged[typeId].expense_unit_price = null;
                            unplanned_ap_merged[typeId].expense_uom_name = null;
                            unplanned_ap_merged[typeId].sum_converted_value += element.sum_converted_value;
                            unplanned_ap_merged[typeId].sum_return_value += element.sum_return_value;
                        }
                    });
                    unplanned_ap_merged = $.map(unplanned_ap_merged, function(value) {
                        return value;
                    });

                    let unplanned_payment_merged = {};
                    $.each(unplanned_payment, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_payment_merged[typeId]) {
                            unplanned_payment_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_payment_merged[typeId].converted_value += element.converted_value;
                            unplanned_payment_merged[typeId].real_value += element.real_value;
                        }
                    });
                    unplanned_payment_merged = $.map(unplanned_payment_merged, function(value) {
                        return value;
                    });

                    if (unplanned_ap_merged.length !== 0 || unplanned_payment_merged.length !== 0) {
                        let unplanned_payment_merged_has_ap = [];
                        for (let i = 0; i < unplanned_ap_merged.length; i++) {
                            let unplanned_sum_converted_value = 0;
                            let unplanned_sum_real_value = 0;
                            for (let j = 0; j < unplanned_payment_merged.length; j++) {
                                if (unplanned_payment_merged[j]?.['expense_type']?.['id'] === unplanned_ap_merged[i]?.['expense_type']?.['id']) {
                                    unplanned_sum_converted_value += unplanned_payment_merged[j]?.['converted_value']
                                    unplanned_sum_real_value += unplanned_payment_merged[j]?.['real_value']
                                    unplanned_payment_merged_has_ap.push(unplanned_payment_merged[j]?.['expense_type']?.['id'])
                                }
                            }
                            data_table_planned.push({
                                'type': 'unplanned',
                                'expense_item': unplanned_ap_merged[i]?.['expense_type'],
                                'plan_after_tax': '--',
                                'ap_approved_value': unplanned_ap_merged[i]?.['expense_after_tax_price'],
                                'sum_return_value': unplanned_ap_merged[i]?.['sum_return_value'],
                                'sum_converted_value': unplanned_sum_converted_value,
                                'sum_real_value': unplanned_sum_real_value,
                                'sum_available': '--'
                            })
                        }
                        for (let i = 0; i < unplanned_payment_merged.length; i++) {
                            if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                                data_table_planned.push({
                                    'type': 'unplanned',
                                    'expense_item': unplanned_payment_merged[i]?.['expense_type'],
                                    'plan_after_tax': '--',
                                    'ap_approved_value': 0,
                                    'sum_return_value': 0,
                                    'sum_converted_value': unplanned_payment_merged[i]?.['converted_value'],
                                    'sum_real_value': unplanned_payment_merged[i]?.['real_value'],
                                    'sum_available': '--'
                                })
                            }
                        }
                    }

                    PaymentPageFunction.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
    static LoadPlanSaleOrderOnly(sale_order_id, workflow_runtime_id) {
        if (sale_order_id) {
            let dataParam1 = {'sale_order_id': sale_order_id}
            let expense_sale_order = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-expense-sale-order'),
                data: dataParam1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('sale_order_expense_list')) {
                        return data?.['sale_order_expense_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam2 = {'sale_order_mapped_id': sale_order_id}
            let ap_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-ap-cost-list'),
                data: dataParam2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_cost_list')) {
                        return data?.['advance_payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam3 = {'sale_order_mapped_id': sale_order_id}
            let payment_mapped_item = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-payment-cost-list'),
                data: dataParam3,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('payment_cost_list')) {
                        return data?.['payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([expense_sale_order, ap_mapped_item, payment_mapped_item]).then(
                (results) => {
                    let data_expense = results[0];
                    let data_ap_mapped_item = results[1];
                    let data_payment_mapped_item = results[2];

                    let data_expense_merge = {};
                    data_expense.forEach(function (item) {
                        let expenseItemId = item?.['expense_item']?.['id'];

                        if (data_expense_merge[expenseItemId] === undefined) {
                            data_expense_merge[expenseItemId] = {
                                id: item?.['id'],
                                expense_title: item?.['expense_title'],
                                expense_item: item?.['expense_item'],
                                tax: item?.['tax'],
                                plan_after_tax: item?.['plan_after_tax']
                            };
                        } else {
                            data_expense_merge[expenseItemId].plan_after_tax += item?.['plan_after_tax'];
                            data_expense_merge[expenseItemId].expense_title += ' (merge) ' + item?.['expense_title'];
                        }
                    });
                    data_expense = Object.values(data_expense_merge);

                    let data_table_planned = []

                    let planned_ap_id = [];
                    let planned_payment_id = [];
                    for (let i = 0; i < data_expense.length; i++) {
                        let ap_approved_value = 0;
                        let sum_return_value = 0;
                        let sum_converted_value = 0;
                        let sum_real_value = 0;
                        for (let j = 0; j < data_ap_mapped_item.length; j++) {
                            if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                                sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                                planned_ap_id.push(data_ap_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        for (let j = 0; j < data_payment_mapped_item.length; j++) {
                            if (data_payment_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                sum_real_value += data_payment_mapped_item[j]?.['real_value'];
                                sum_converted_value += data_payment_mapped_item[j]?.['converted_value'];
                                planned_payment_id.push(data_payment_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                        // if (sum_available < 0) {
                        //     sum_available = 0;
                        // }
                        data_table_planned.push({
                            'type': 'planned',
                            'expense_item': data_expense[i]?.['expense_item'],
                            'plan_after_tax': data_expense[i]?.['plan_after_tax'],
                            'ap_approved_value': ap_approved_value,
                            'sum_return_value': sum_return_value,
                            'sum_converted_value': sum_converted_value,
                            'sum_real_value': sum_real_value,
                            'sum_available': sum_available
                        })
                    }

                    let unplanned_ap = [];
                    let unplanned_payment = [];
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (!planned_ap_id.includes(data_ap_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_ap.push(data_ap_mapped_item[j])
                        }
                    }
                    for (let j = 0; j < data_payment_mapped_item.length; j++) {
                        if (!planned_payment_id.includes(data_payment_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_payment.push(data_payment_mapped_item[j])
                        }
                    }

                    let unplanned_ap_merged = {};
                    $.each(unplanned_ap, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_ap_merged[typeId]) {
                            unplanned_ap_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_ap_merged[typeId].expense_after_tax_price += element.expense_after_tax_price;
                            unplanned_ap_merged[typeId].expense_description = null;
                            unplanned_ap_merged[typeId].expense_quantity += element.expense_quantity;
                            unplanned_ap_merged[typeId].expense_subtotal_price += element.expense_subtotal_price;
                            unplanned_ap_merged[typeId].expense_tax = null;
                            unplanned_ap_merged[typeId].expense_tax_price += element.expense_tax_price;
                            unplanned_ap_merged[typeId].expense_unit_price = null;
                            unplanned_ap_merged[typeId].expense_uom_name = null;
                            unplanned_ap_merged[typeId].sum_converted_value += element.sum_converted_value;
                            unplanned_ap_merged[typeId].sum_return_value += element.sum_return_value;
                        }
                    });
                    unplanned_ap_merged = $.map(unplanned_ap_merged, function(value) {
                        return value;
                    });

                    let unplanned_payment_merged = {};
                    $.each(unplanned_payment, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_payment_merged[typeId]) {
                            unplanned_payment_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_payment_merged[typeId].converted_value += element.converted_value;
                            unplanned_payment_merged[typeId].real_value += element.real_value;
                        }
                    });
                    unplanned_payment_merged = $.map(unplanned_payment_merged, function(value) {
                        return value;
                    });

                    if (unplanned_ap_merged.length !== 0 || unplanned_payment_merged.length !== 0) {
                        let unplanned_payment_merged_has_ap = [];
                        for (let i = 0; i < unplanned_ap_merged.length; i++) {
                            let unplanned_sum_converted_value = 0;
                            let unplanned_sum_real_value = 0;
                            for (let j = 0; j < unplanned_payment_merged.length; j++) {
                                if (unplanned_payment_merged[j]?.['expense_type']?.['id'] === unplanned_ap_merged[i]?.['expense_type']?.['id']) {
                                    unplanned_sum_converted_value += unplanned_payment_merged[j]?.['converted_value']
                                    unplanned_sum_real_value += unplanned_payment_merged[j]?.['real_value']
                                    unplanned_payment_merged_has_ap.push(unplanned_payment_merged[j]?.['expense_type']?.['id'])
                                }
                            }
                            data_table_planned.push({
                                'type': 'unplanned',
                                'expense_item': unplanned_ap_merged[i]?.['expense_type'],
                                'plan_after_tax': '--',
                                'ap_approved_value': unplanned_ap_merged[i]?.['expense_after_tax_price'],
                                'sum_return_value': unplanned_ap_merged[i]?.['sum_return_value'],
                                'sum_converted_value': unplanned_sum_converted_value,
                                'sum_real_value': unplanned_sum_real_value,
                                'sum_available': '--'
                            })
                        }
                        for (let i = 0; i < unplanned_payment_merged.length; i++) {
                            if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                                data_table_planned.push({
                                    'type': 'unplanned',
                                    'expense_item': unplanned_payment_merged[i]?.['expense_type'],
                                    'plan_after_tax': '--',
                                    'ap_approved_value': 0,
                                    'sum_return_value': 0,
                                    'sum_converted_value': unplanned_payment_merged[i]?.['converted_value'],
                                    'sum_real_value': unplanned_payment_merged[i]?.['real_value'],
                                    'sum_available': '--'
                                })
                            }
                        }
                    }

                    PaymentPageFunction.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
}

/**
 * Khai báo các hàm chính
 */
class PaymentHandler {
    static LoadPageActionWithParams(opp_id) {
        if (opp_id) {
            let dataParam = {'id': opp_id}
            let opportunity_ajax = $.fn.callAjax2({
                url: pageElements.$script_url.attr('data-url-opp-list'),
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_list')) {
                        return data?.['opportunity_list'].length > 0 ? data?.['opportunity_list'][0] : null;
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([opportunity_ajax]).then(
                (results) => {
                    let opportunity_data = results[0];
                    if (opportunity_data) {
                        $('#opportunity_id').trigger('change')
                        pageElements.$quotation_mapped_select.empty()
                        pageElements.$sale_order_mapped_select.empty()
                        if (opportunity_data?.['id']) {
                            if (opportunity_data?.['is_close']) {
                                $.fn.notifyB({description: `Opportunity ${opportunity_data?.['code']} has been closed. Can not select.`}, 'failure');
                                pageElements.$opportunity_id.empty()
                                pageVariables.payment_for = null
                            } else {
                                pageElements.$sale_order_mapped_select.prop('disabled', true)
                                pageElements.$quotation_mapped_select.prop('disabled', true)
                                let quo_mapped = opportunity_data?.['quotation'];
                                let so_mapped = opportunity_data?.['sale_order'];
                                PaymentPageFunction.LoadQuotation(quo_mapped)
                                PaymentPageFunction.LoadSaleOrder(so_mapped);
                                if (so_mapped?.['id']) {
                                    PaymentPageFunction.LoadPlanSaleOrder(opportunity_data?.['id'], so_mapped?.['id'])
                                } else if (quo_mapped?.['id']) {
                                    PaymentPageFunction.LoadPlanQuotation(opportunity_data?.['id'], quo_mapped?.['id'])
                                } else {
                                    PaymentPageFunction.LoadPlanOppOnly(opportunity_data?.['id'])
                                }
                                pageVariables.payment_for = 'opportunity'
                            }
                        } else {
                            pageElements.$quotation_mapped_select.prop('disabled', false)
                            pageElements.$sale_order_mapped_select.prop('disabled', false)
                            pageVariables.payment_for = null
                            PaymentPageFunction.DrawTablePlan()
                        }
                    }
                })
        }
    }
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = pageElements.$title.val()
        if (pageVariables.payment_for === 'opportunity') {
            frm.dataForm['opportunity_id'] = pageElements.$opportunity_id.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else if (pageVariables.payment_for === 'quotation') {
            frm.dataForm['quotation_mapped_id'] = pageElements.$quotation_mapped_select.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else if (pageVariables.payment_for === 'saleorder') {
            frm.dataForm['sale_order_mapped_id'] = pageElements.$sale_order_mapped_select.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else {
            frm.dataForm['opportunity_id'] = null
            frm.dataForm['quotation_mapped_id'] = null
            frm.dataForm['sale_order_mapped_id'] = null
            frm.dataForm['sale_code_type'] = 2
        }
        frm.dataForm['is_internal_payment'] = Number(pageElements.$payment_type.val())
        frm.dataForm['employee_inherit_id'] = pageElements.$employee_inherit_id.val() || null
        frm.dataForm['supplier_id'] = pageElements.$supplier_id.val() || null
        frm.dataForm['employee_payment_id'] = pageElements.$employee_payment_id.val() || null
        if (pageElements.$payment_type.val() === '0') {
            frm.dataForm['employee_payment_id'] = null
        }
        else {
            frm.dataForm['supplier_id'] = null
        }
        frm.dataForm['method'] = parseInt(pageElements.$payment_method.val())
        frm.dataForm['bank_data'] = pageElements.$bank_info.val()

        frm.dataForm['free_input'] = $('#free-input').prop('checked')
        let payment_item_list = [];
        if (pageElements.$table_line_detail.find('tr').length > 0) {
            let row_count = pageElements.$table_line_detail.find('tr').length / 2;
            for (let i = 1; i <= row_count; i++) {
                let expense_detail_value = 0;
                let row_id = '#row-' + i.toString();
                let expense_type = pageElements.$table_line_detail.find(row_id + ' .expense-type-select-box').val();
                let expense_description = pageElements.$table_line_detail.find(row_id + ' .expense-des-input').val();
                let expense_uom_name = pageElements.$table_line_detail.find(row_id + ' .expense-uom-input').val();
                let expense_quantity = parseFloat(pageElements.$table_line_detail.find(row_id + ' .expense_quantity').val());
                let expense_tax = pageElements.$table_line_detail.find(row_id + ' .expense-tax-select-box option:selected').attr('value');
                let expense_unit_price = parseFloat(pageElements.$table_line_detail.find(row_id + ' .expense-unit-price-input').attr('value'));
                let expense_subtotal_price = parseFloat(pageElements.$table_line_detail.find(row_id + ' .expense-subtotal-price').attr('value'));
                let expense_after_tax_price = parseFloat(pageElements.$table_line_detail.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));

                let row_tax_ELe = pageElements.$table_line_detail.find(row_id + ' .expense-tax-select-box')
                let tax_selected = SelectDDControl.get_data_from_idx(row_tax_ELe, row_tax_ELe.val())
                let tax_rate = 0;
                if (Object.keys(tax_selected).length !== 0) {
                    tax_rate = tax_selected?.['rate']
                }
                let document_number = pageElements.$table_line_detail.find(row_id + ' .expense-document-number').val();

                let sale_code_item = pageElements.$table_line_detail.find(row_id).nextAll().slice(0, 1);
                sale_code_item.each(function () {
                    let expense_items_detail_list = [];
                    if ($(this).find('.detail-ap-items').html()) {
                        expense_items_detail_list = JSON.parse($(this).find('.detail-ap-items').html());
                    }
                    let real_value = 0;
                    if ($(this).find('.value-inp').attr('value') && $(this).find('.value-inp').attr('value') !== 'NaN') {
                        real_value = parseFloat($(this).find('.value-inp').attr('value'));
                    }
                    let converted_value = $(this).find('.value-converted-from-ap-inp').attr('value');
                    if (expense_items_detail_list.length <= 0) {
                        converted_value = 0;
                    }
                    let sum_value = 0;
                    if ($(this).find('.total-value-salecode-item').attr('value')) {
                        sum_value = parseFloat($(this).find('.total-value-salecode-item').attr('value'));
                    }
                    expense_detail_value = expense_detail_value + sum_value;
                    payment_item_list.push({
                        'expense_type_id': expense_type,
                        'expense_description': expense_description,
                        'expense_uom_name': expense_uom_name,
                        'expense_quantity': expense_quantity,
                        'expense_unit_price': expense_unit_price,
                        'expense_tax_id': expense_tax,
                        'expense_tax_price': expense_subtotal_price * tax_rate / 100,
                        'expense_subtotal_price': expense_subtotal_price,
                        'expense_after_tax_price': expense_after_tax_price,
                        'document_number': document_number,
                        'real_value': real_value,
                        'converted_value': converted_value,
                        'sum_value': sum_value,
                        'ap_cost_converted_list': expense_items_detail_list
                    })
                })

                if (parseFloat(expense_after_tax_price) !== parseFloat(expense_detail_value)) {
                    $.fn.notifyB({description: 'Detail tab - line ' + i.toString() + ': product value must be equal to sum Sale Code value.'}, 'failure');
                    return false;
                }
            }
        }
        frm.dataForm['payment_item_list'] = payment_item_list

        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        // console.log(frm)
        return frm
    }
    static LoadDetailPayment(option) {
        let url_loaded = $('#form-detail-payment').attr('data-url')
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['payment_detail'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    pageVariables.DETAIL_DATA = data;

                    if (data?.['system_status'] === 3) {
                        $('#print-document').prop('hidden', false)
                    }

                    // console.log(data)

                    const data_inherit = Object.keys(data?.['employee_inherit'] || {}).length > 0 ? [{
                        "id": data?.['employee_inherit']?.['id'],
                        "full_name": data?.['employee_inherit']?.['full_name'] || '',
                        "first_name": data?.['employee_inherit']?.['first_name'] || '',
                        "last_name": data?.['employee_inherit']?.['last_name'] || '',
                        "email": data?.['employee_inherit']?.['email'] || '',
                        "is_active": data?.['employee_inherit']?.['is_active'] || false,
                        "selected": true,
                    }] : [];
                    const data_opp = Object.keys(data?.['opportunity'] || {}).length > 0 ? [{
                        "id": data?.['opportunity']?.['id'] || '',
                        "title": data?.['opportunity']?.['title'] || '',
                        "code": data?.['opportunity']?.['code'] || '',
                        "selected": true,
                    }] : [];
                    const data_process = Object.keys(data?.['process'] || {}).length > 0 ? [{
                        ...data?.['process'],
                        "selected": true,
                    }] : [];
                    const data_process_stage_app = Object.keys(data?.['process_stage_app'] || []).length > 0 ? [{
                        ...data['process_stage_app'],
                        'selected': true,
                    }] : [];

                    new $x.cls.bastionField({
                        has_opp: true,
                        has_inherit: true,
                        has_process: true,
                        data_opp: data_opp,
                        data_inherit: data_inherit,
                        data_process: data_process,
                        data_process_stage_app: data_process_stage_app,
                    }).init();

                    if (Object.keys(data?.['opportunity']).length !== 0 && Object.keys(data?.['employee_inherit']).length !== 0) {
                        pageElements.$quotation_mapped_select.prop('disabled', true)
                        pageElements.$sale_order_mapped_select.prop('disabled', true)
                        PaymentPageFunction.LoadQuotation(data?.['opportunity']?.['quotation_mapped'])
                        PaymentPageFunction.LoadSaleOrder(data?.['opportunity']?.['sale_order_mapped']);
                        if (data?.['opportunity']?.['sale_order_mapped']?.['id']) {
                            PaymentPageFunction.LoadPlanSaleOrder(
                                pageElements.$opportunity_id.val(),
                                data?.['opportunity']?.['sale_order_mapped']?.['id'],
                                data?.['workflow_runtime_id']
                            )
                        }
                        else if (data?.['opportunity']?.['quotation_mapped']?.['id']) {
                            PaymentPageFunction.LoadPlanQuotation(
                                pageElements.$opportunity_id.val(),
                                data?.['opportunity']?.['quotation_mapped']?.['id'],
                                data?.['workflow_runtime_id']
                            )
                        }
                        else {
                            PaymentPageFunction.LoadPlanOppOnly(pageElements.$opportunity_id.val())
                        }
                        pageVariables.payment_for = 'opportunity'
                    }
                    else if (Object.keys(data?.['quotation_mapped']).length !== 0) {
                        pageElements.$opportunity_id.prop('disabled', true)
                        pageElements.$sale_order_mapped_select.prop('disabled', true)
                        PaymentPageFunction.LoadQuotation(data?.['quotation_mapped'])
                        PaymentPageFunction.LoadSaleOrder(data?.['quotation_mapped']?.['sale_order_mapped'])

                        let dataParam = {'quotation_id': pageElements.$quotation_mapped_select.val()}
                        let ap_mapped_item = $.fn.callAjax2({
                            url: pageElements.$sale_order_mapped_select.attr('data-url'),
                            data: dataParam,
                            method: 'GET'
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && typeof data === 'object' && data.hasOwnProperty('sale_order_list')) {
                                    return data?.['sale_order_list'];
                                }
                                return {};
                            },
                            (errs) => {
                                console.log(errs);
                            }
                        )

                        Promise.all([ap_mapped_item]).then(
                            (results) => {
                                let so_mapped_opp = results[0];
                                if (so_mapped_opp.length > 0) {
                                    PaymentPageFunction.LoadSaleOrder(so_mapped_opp[0]);
                                }
                            })

                        PaymentPageFunction.LoadPlanQuotationOnly(
                            data?.['quotation_mapped']?.['id'],
                            data?.['workflow_runtime_id']
                        )
                        pageVariables.payment_for = 'quotation'
                    }
                    else if (Object.keys(data?.['sale_order_mapped']).length !== 0) {
                        pageElements.$opportunity_id.prop('disabled', true)
                        pageElements.$quotation_mapped_select.prop('disabled', true)
                        PaymentPageFunction.LoadSaleOrder(data?.['sale_order_mapped'])
                        PaymentPageFunction.LoadQuotation(data?.['sale_order_mapped']?.['quotation_mapped'])

                        PaymentPageFunction.LoadPlanSaleOrderOnly(
                            data?.['sale_order_mapped']?.['id'],
                            data?.['workflow_runtime_id']
                        )
                        pageVariables.payment_for = 'saleorder'
                    }
                    else {
                        pageVariables.payment_for = null
                    }

                    pageElements.$title.val(data?.['title']);

                    pageElements.$date_created.val(data.date_created ? DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "DD/MM/YYYY", data.date_created) : '')

                    UsualLoadPageFunction.AutoLoadCurrentEmployee({element: pageElements.$employee_created, fullname: data.employee_created?.['full_name']})

                    pageElements.$payment_type.val(Number(data?.['is_internal_payment']))

                    pageElements.$employee_payment_id.closest('.form-group').prop('hidden', !data?.['is_internal_payment'])
                    pageElements.$supplier_id.closest('.form-group').prop('hidden', data?.['is_internal_payment'])
                    PaymentPageFunction.LoadEmployee(data?.['employee_payment'])
                    PaymentPageFunction.LoadSupplier(data?.['supplier'])

                    pageElements.$payment_method.val(data?.['method']).trigger('change')

                    pageElements.$bank_info.val(data?.['bank_data'] || '')

                    $('#free-input').prop('checked', data?.['free_input'])

                    PaymentPageFunction.DrawLineDetailTable(data?.['expense_items'], option)

                    $.fn.initMaskMoney2();

                    new $x.cls.file($('#attachment')).init({
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    UsualLoadPageFunction.DisablePage(
                        option==='detail'
                    );

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class PaymentEventHandler {
    static InitPageEven() {
        pageElements.$accept_bank_account_btn.on('click', function () {
            let bank_selected = $('.bank_account_selected:checked')
            if (bank_selected) {
                let bank_name = bank_selected.closest('tr').find('.bank_name').val()
                let account_name = bank_selected.closest('tr').find('.bank_account_name').val()
                let account_number = bank_selected.closest('tr').find('.bank_account_number').val()
                if (bank_name && account_name && account_number) {
                    pageElements.$bank_info.val(`${$.fn.gettext('Bank name')}: ${bank_name}\n${$.fn.gettext('Account name')}: ${account_name}\n${$.fn.gettext('Account number')}: ${account_number}`)
                    $('#bank-account-modal').modal('hide')
                } else {
                    pageElements.$bank_info.val('')
                    $.fn.notifyB({description: 'Bank information is missing'}, 'failure');
                }
            }
        })
        pageElements.$opportunity_id.on('change', function () {
            pageElements.$quotation_mapped_select.empty()
            pageElements.$sale_order_mapped_select.empty()
            if (pageElements.$opportunity_id.val()) {
                let selected = SelectDDControl.get_data_from_idx(pageElements.$opportunity_id, pageElements.$opportunity_id.val())
                if (selected?.['is_close']) {
                    $.fn.notifyB({description: `Opportunity ${selected?.['code']} has been closed. Can not select.`}, 'failure');
                    pageElements.$opportunity_id.empty()
                    pageVariables.payment_for = null
                }
                else {
                    pageElements.$sale_order_mapped_select.prop('disabled', true)
                    pageElements.$quotation_mapped_select.prop('disabled', true)
                    let quo_mapped = SelectDDControl.get_data_from_idx(pageElements.$opportunity_id, pageElements.$opportunity_id.val())['quotation'];
                    let so_mapped = SelectDDControl.get_data_from_idx(pageElements.$opportunity_id, pageElements.$opportunity_id.val())['sale_order'];
                    PaymentPageFunction.LoadQuotation(quo_mapped)
                    PaymentPageFunction.LoadSaleOrder(so_mapped);
                    if (so_mapped?.['id']) {
                        PaymentPageFunction.LoadPlanSaleOrder(pageElements.$opportunity_id.val(), so_mapped?.['id'])
                    }
                    else if (quo_mapped?.['id']) {
                        PaymentPageFunction.LoadPlanQuotation(pageElements.$opportunity_id.val(), quo_mapped?.['id'])
                    }
                    else {
                        PaymentPageFunction.LoadPlanOppOnly(pageElements.$opportunity_id.val())
                    }
                    pageVariables.payment_for = 'opportunity'
                }
            }
            else {
                pageElements.$quotation_mapped_select.prop('disabled', false)
                pageElements.$sale_order_mapped_select.prop('disabled', false)
                pageVariables.payment_for = null
                PaymentPageFunction.DrawTablePlan()
            }
        })
        pageElements.$payment_type.on('change', function () {
            pageElements.$employee_payment_id.closest('.form-group').prop('hidden', $(this).val() !== '1')
            pageElements.$supplier_id.closest('.form-group').prop('hidden', $(this).val() === '1')
        })
        $(document).on("click", '#btn-add-row-line-detail', function () {
            UsualLoadPageFunction.AddTableRow(pageElements.$table_line_detail, {})
            let row_added = pageElements.$table_line_detail.find('tbody tr:last-child')
            row_added.attr('id', `row-${row_added.find('td:eq(0)').text()}`)
            PaymentPageFunction.LoadExpenseItem(row_added.find('.expense-type-select-box'))
            PaymentPageFunction.LoadTax(row_added.find('.expense-tax-select-box'))
        })
        $(document).on("click", '.btn-del-line-detail', function () {
            UsualLoadPageFunction.DeleteTableRow(
                pageElements.$table_line_detail,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
        })
        $(document).on('click', '.hide-expand-row-btn', function () {
            let is_hiding = $(this).closest('tr').next().prop('hidden')
            $(this).closest('tr').next().prop('hidden', !is_hiding)
        })
        $(document).on("change", '.expense-unit-price-input', function () {
            PaymentPageFunction.ChangeRowPrice($(this).closest('tr'));
        })
        $(document).on("change", '.expense-tax-select-box', function () {
            PaymentPageFunction.ChangeRowPrice($(this).closest('tr'));
        })
        $(document).on("change", '.expense_quantity', function () {
            PaymentPageFunction.ChangeRowPrice($(this).closest('tr'));
        })
        $(document).on("change", '.expense-subtotal-price', function () {
            PaymentPageFunction.CheckAndOpenExpandRow($(this).closest('tr'))
            PaymentPageFunction.CalculateTotalPrice();
            $.fn.initMaskMoney2();
        })
        $(document).on("change", '.expense-subtotal-price-after-tax', function () {
            PaymentPageFunction.CheckAndOpenExpandRow($(this).closest('tr'))
            PaymentPageFunction.CalculateTotalPrice();
            $.fn.initMaskMoney2();
        })
        $(document).on("change", '#free-input', function () {
            let current_stage = $(this).prop('checked')
            Swal.fire({
                html: `<span>${pageElements.$script_trans.attr('data-trans-free-input-turn-on-off')}</span>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-primary',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg'
                },
                showCancelButton: true,
                buttonsStyling: false,
            }).then((result) => {
                if (result.value) {
                    if (current_stage === true) {
                        Swal.fire({
                            html: `<div class="d-flex align-items-center">
                                        <i class="ri-checkbox-line me-2 fs-3 text-success"></i>
                                        <h5 class="text-success mb-0">${pageElements.$script_trans.attr('data-trans-free-input-is-on')}</h5>
                                    </div>
                                    <p class="mt-2 small text-start">${pageElements.$script_trans.attr('data-trans-free-input-responsible')}</p>`,
                            customClass: {
                                confirmButton: 'btn btn-primary',
                                actions: 'w-100',
                            },
                            buttonsStyling: false,
                        })
                    }
                    PaymentPageFunction.DrawLineDetailTable()
                }
                else {
                    $(this).prop('checked', !current_stage)
                }
            })
        })
        $(document).on("change", '.expense-uom-input', function () {
            PaymentPageFunction.ChangeRowPrice($(this).closest('tr'));
        })
        $(document).on("change", '.expense-document-number', function () {
            PaymentPageFunction.ChangeRowPrice($(this).closest('tr'));
        })
        $(document).on("change", '.value-inp', function () {
            let value_converted_from_ap = parseFloat($(this).closest('tr').find('.value-converted-from-ap-inp').attr('value'));
            let this_value = parseFloat($(this).attr('value'));
            if (isNaN(value_converted_from_ap)) {
                value_converted_from_ap = 0;
            }
            if (isNaN(this_value)) {
                this_value = 0;
            }
            $(this).closest('tr').find('.total-value-salecode-item').attr('value', this_value + value_converted_from_ap);
            $.fn.initMaskMoney2();
        })
        $(document).on("click", '.btn-add-payment-value', function () {
            $('.total-converted').attr('hidden', true);
            pageVariables.current_value_converted_from_ap = $(this);
            $('.total-product-selected').attr('data-init-money', 0);
            $.fn.initMaskMoney2();
            $('.product-tables').html(``);

            PaymentPageFunction.LoadAPList();

            pageElements.$offcanvasRightLabel.text(pageElements.$offcanvasRightLabel.attr('data-text-1'));
            $('#step1').prop('hidden', false);
            $('#step2').prop('hidden', true);
            $('#next-btn').prop('hidden', false);
            $('#previous-btn').prop('hidden', true);
            $('#finish-btn').prop('hidden', true);
            $('#total-converted').attr('hidden', true);
        })
        $("#next-btn").on('click', function () {
            pageElements.$offcanvasRightLabel.text(pageElements.$offcanvasRightLabel.attr('data-text-2'));
            $('#step1').prop('hidden', true);
            $('#step2').prop('hidden', false);
            $('#next-btn').prop('hidden', true);
            $('#previous-btn').prop('hidden', false);
            $('#finish-btn').prop('hidden', false);
            $('#total-converted').attr('hidden', false);

            let tab2 = $('.product-tables');
            tab2.html(``);

            let selected_ap_list = [];
            let selected_ap_code_list = [];
            $('.ap-selected').each(function () {
                if ($(this).is(':checked') === true) {
                    selected_ap_list.push($(this).attr('data-id'));
                    selected_ap_code_list.push($(this).closest('tr').find('td:first-child span').text());
                }
            })
            if (selected_ap_list.length === 0) {
                $.fn.notifyB({description: 'Warning: Select at least 1 Advance Payment Item for next step.'}, 'warning');
            } else {
                let selected_converted_value = []
                $('.detail-ap-items').each(function () {
                    if ($(this).text() && $(this).closest('tr').attr('class') !== pageVariables.current_value_converted_from_ap.closest('tr').attr('class')) {
                        selected_converted_value = selected_converted_value.concat(JSON.parse($(this).text()))
                    }
                })

                for (let i = 0; i < selected_ap_list.length; i++) {
                    $.fn.callAjax(pageElements.$advance_payment_list_datatable.attr('data-url-ap-detail').format_url_with_uuid(selected_ap_list[i]), pageElements.$advance_payment_list_datatable.attr('data-method')).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                                let ap_item_detail = data?.['advance_payment_detail'];
                                if (ap_item_detail?.['expense_items'].length > 0) {
                                    tab2.append(`<table id="expense-item-table-${ap_item_detail.id}" class="table nowrap w-100 mb-10">
                                        <thead>
                                            <tr>
                                                <th class="w-10"><span class="ap-code-span badge badge-primary w-100">${selected_ap_code_list[i]}</span></th>
                                                <th class="w-15">${$.fn.gettext('Expense name')}</th>
                                                <th class="w-15">${$.fn.gettext('Expense type')}</th>
                                                <th class="w-5">${$.fn.gettext('Quantity')}</th>
                                                <th class="w-15">${$.fn.gettext('Unit price')}</th>
                                                <th class="w-10">${$.fn.gettext('Tax')}</th>
                                                <th class="w-15">${$.fn.gettext('Available')}</th>
                                                <th class="w-15">${$.fn.gettext('Converted value')}</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>`);
                                    let product_table = $('#expense-item-table-' + ap_item_detail.id);
                                    let total_remain_value = 0;
                                    for (let i = 0; i < ap_item_detail?.['expense_items'].length; i++) {
                                        let expense_item = ap_item_detail?.['expense_items'][i];
                                        let row_id_previous = `#row-${pageVariables.current_value_converted_from_ap.closest('tr').attr('class').slice(-1)}`
                                        if ($(row_id_previous).find('.expense-type-select-box').val() === expense_item?.['expense_type']?.['id']) {
                                            let tax_code = expense_item?.['expense_tax']?.['code'] ? expense_item?.['expense_tax']?.['code'] : '';
                                            let disabled = 'disabled';
                                            if (expense_item.remain_total > 0) {
                                                disabled = '';
                                            }
                                            total_remain_value += expense_item.remain_total - PaymentPageFunction.FindValueConvertedById(expense_item.id, selected_converted_value);
                                            product_table.find('tbody').append(`<tr>
                                                <td class="text-center"><div class="form-check"><input data-ap-title="${ap_item_detail?.['title']}" data-id="${expense_item.id}" class="form-check-input product-selected" type="checkbox" ${disabled}></div></td>
                                                <td>${expense_item.expense_description}</td>
                                                <td>${expense_item.expense_type.title}</td>
                                                <td>${expense_item.expense_quantity}</td>
                                                <td><span class="text-primary mask-money" data-init-money="${expense_item.expense_unit_price}"></span></td>
                                                <td><span class="badge badge-soft-danger">${tax_code}</span></td>
                                                <td>
                                                <span class="text-primary mask-money product-remain-value" data-init-money="${expense_item.remain_total - PaymentPageFunction.FindValueConvertedById(expense_item.id, selected_converted_value)}"></span>
                                                </td>
                                                <td><input class="mask-money form-control converted-value-inp" disabled></td>
                                            </tr>`)
                                        }
                                    }
                                    if (product_table.find('tbody').html() === '') {
                                        product_table.remove()
                                    } else {
                                        product_table.find('tbody').append(`<tr style="background-color: #ebf5f5">
                                            <td colspan="5"></td>
                                            <td><span style="text-align: left"><b>Total:</b></span></td>
                                            <td><span class="mask-money total-available-value text-primary" data-init-money="${total_remain_value}"></span></td>
                                            <td><span class="mask-money total-converted-value text-primary" data-init-money="0"></span></td>
                                        </tr>`)
                                    }

                                    $('.converted-value-inp').on('change', function () {
                                        let product_remain_value = $(this).closest('tr').find('.product-remain-value').attr('data-init-money');
                                        let converted_value = $(this).attr('value');
                                        if (parseFloat(converted_value) > parseFloat(product_remain_value)) {
                                            $(this).attr('value', parseFloat(product_remain_value));
                                        }

                                        let new_total_converted_value = 0;
                                        $(this).closest('tbody').find('.converted-value-inp').each(function () {
                                            if (parseFloat($(this).attr('value'))) {
                                                new_total_converted_value += parseFloat($(this).attr('value'));
                                            }
                                        });
                                        $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                        $('.total-product-selected').attr('data-init-money', PaymentPageFunction.SumAPItemsCast());

                                        $.fn.initMaskMoney2();
                                    });

                                    $('.product-selected').on('change', function () {
                                        if ($(this).is(':checked')) {
                                            $(this).closest('tr').find('.converted-value-inp').prop('disabled', false);
                                            $(this).closest('tr').find('.converted-value-inp').addClass('is-valid');
                                        } else {
                                            $(this).closest('tr').find('.converted-value-inp').prop('disabled', true);
                                            $(this).closest('tr').find('.converted-value-inp').attr('value', '');
                                            $(this).closest('tr').find('.converted-value-inp').removeClass('is-valid');
                                        }

                                        let new_total_converted_value = 0;
                                        $(this).closest('tbody').find('.converted-value-inp').each(function () {
                                            if (parseFloat($(this).attr('value'))) {
                                                new_total_converted_value += parseFloat($(this).attr('value'));
                                            }
                                        });
                                        $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                        $('.total-product-selected').attr('data-init-money', PaymentPageFunction.SumAPItemsCast());

                                        $.fn.initMaskMoney2();
                                    });

                                    $.fn.initMaskMoney2();
                                }
                            }
                        }
                    });
                }
            }
        })
        $("#previous-btn").on('click', function () {
            pageElements.$offcanvasRightLabel.text(pageElements.$offcanvasRightLabel.attr('data-text-1'));
            $('#step1').prop('hidden', false);
            $('#step2').prop('hidden', true);
            $('#next-btn').prop('hidden', false);
            $('#previous-btn').prop('hidden', true);
            $('#finish-btn').prop('hidden', true);
            $('#total-converted').attr('hidden', true);
        })
        $("#finish-btn").on('click', function () {
            $('.total-converted').attr('hidden', true);
            let result_total_value = PaymentPageFunction.SumAPItemsCast();
            pageVariables.current_value_converted_from_ap.closest('.row').find('.value-converted-from-ap-inp').attr('value', result_total_value);

            pageVariables.current_value_converted_from_ap.closest('tr').prev().find('.expense-type-select-box').prop('disabled', true).prop('readonly', true)
            let value_input_ap = parseFloat(pageVariables.current_value_converted_from_ap.closest('tr').find('.value-inp').attr('value'));
            if (isNaN(value_input_ap)) {
                value_input_ap = 0;
            }
            pageVariables.current_value_converted_from_ap.closest('tr').find('.total-value-salecode-item').attr('value', result_total_value + value_input_ap);
            let ap_product_items = PaymentPageFunction.GetAPItems()
            pageVariables.current_value_converted_from_ap.closest('tr').find('.detail-ap-items').text(JSON.stringify(ap_product_items));
            if (result_total_value > 0) {
                let detail_converted_html = ``;
                for (let x = 0; x < ap_product_items.length; x++) {
                    detail_converted_html += `<a class="dropdown-item" href="#">${ap_product_items[x]?.['ap_title']}: <span class="mask-money text-secondary" data-init-money="${ap_product_items[x]?.['value_converted']}"></span></a>`
                }
                let detail_converted_html_full = ``
                if (detail_converted_html) {
                    detail_converted_html_full = `<div class="btn-group" role="group">
                        <button data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                class="btn btn-icon btn-flush-primary flush-soft-hover" type="button">
                            <span class="icon"><i class="bi bi-chevron-down text-primary"></i></span>
                        </button>
                        <div class="dropdown-menu">
                            ${detail_converted_html}
                        </div>
                    </div>`;
                }
                pageVariables.current_value_converted_from_ap.closest('tr').find('.input-group .btn-group').remove()
                pageVariables.current_value_converted_from_ap.closest('tr').find('.input-group').append(detail_converted_html_full)
            }

            $.fn.initMaskMoney2();
        })
    }
}
