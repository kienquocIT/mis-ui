/**
 * Khai báo các element trong page
 */
class AdvancePaymentPageElements {
    constructor() {
        // info
        this.$script_url = $('#script-url')
        this.$script_trans = $('#script-trans')
        this.$opportunity_id = $('#opportunity_id')
        this.$employee_inherit_id = $('#employee_inherit_id')
        this.$quotation_mapped_select = $('#quotation_mapped_select')
        this.$sale_order_mapped_select = $('#sale_order_mapped_select')
        this.$title = $('#title')
        this.$advance_payment_type = $('#advance_payment_type')
        this.$supplier_id = $('#supplier_id')
        this.$supplier_label = $('#supplier-label')
        this.$method = $('#method')
        this.$bank_info = $('#bank-info')
        this.$bank_account_table = $('#bank-account-table')
        this.$accept_bank_account_btn = $('#accept-bank-account-btn')
        this.$date_created = $('#date_created')
        this.$employee_created = $('#employee_created')
        this.$return_date = $('#return_date')
        this.$advance_date = $('#advance_date')
        this.$money_gave = $('#money-gave')
        // tab
        this.$table_line_detail = $('#table_line_detail')
        this.$table_plan = $('#table_plan')
    }
}
const pageElements = new AdvancePaymentPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class AdvancePaymentPageVariables {
    constructor() {
        this.ap_for = null
    }
}
const pageVariables = new AdvancePaymentPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class AdvancePaymentPageFunction {
    // load page
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
                            return `<div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Bank name')}:</label><div class="col-9"><textarea rows="1" class="form-control bank_name"></textarea></div></div>
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Account name')}:</label><div class="col-9"><textarea rows="1" class="form-control bank_account_name"></textarea></div></div>
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Account number')}:</label><div class="col-9"><textarea rows="1" class="form-control bank_account_number"></textarea></div></div>`
                        }
                        return `${row?.['is_default'] ? `<span class="text-blue small">(${$.fn.gettext('Default')})</span><br>` : ''}
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Bank name')}:</label><div class="col-9"><textarea rows="1" disabled readonly class="form-control bank_name">${row?.['bank_name'] || ''}</textarea></div></div>
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Account name')}:</label><div class="col-9"><textarea rows="1" disabled readonly class="form-control bank_account_name">${row?.['bank_account_name'] || ''}</textarea></div></div>
                                    <div class="row mb-1"><label class="form-label col-form-label col-3">${$.fn.gettext('Account number')}:</label><div class="col-9"><textarea rows="1" disabled readonly class="form-control bank_account_number">${row?.['bank_account_number'] || ''}</textarea></div></div>`
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
                AdvancePaymentPageFunction.LoadSaleOrder(selected?.['sale_order'])
                AdvancePaymentPageFunction.LoadPlanQuotationOnly($(this).val())
                pageVariables.ap_for = 'quotation'
            }
            else {
                pageElements.$opportunity_id.prop('disabled', false)
                pageElements.$sale_order_mapped_select.prop('disabled', false)
                pageVariables.ap_for = null
                AdvancePaymentPageFunction.DrawTablePlan()
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
                AdvancePaymentPageFunction.LoadQuotation(selected?.['quotation'])
                AdvancePaymentPageFunction.LoadPlanSaleOrderOnly($(this).val())
                pageVariables.ap_for = 'saleorder'
            }
            else {
                pageElements.$opportunity_id.prop('disabled', false)
                pageElements.$quotation_mapped_select.prop('disabled', false)
                pageVariables.ap_for = null
                AdvancePaymentPageFunction.DrawTablePlan()
            }
        })
    }
    static LoadSupplier(data) {
        pageElements.$supplier_id.initSelect2({
            allowClear: true,
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
                AdvancePaymentPageFunction.LoadTableBankAccount(supplier_selected?.['bank_accounts_mapped'] || [])
            }
        })
    }
    // line detail
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
            $(this).closest('tr').find('.expense-unit-price-input').attr('value', 0);
            $(this).closest('tr').find('.expense_quantity').val(1);
            $(this).closest('tr').find('.expense-subtotal-price').attr('value', 0);
            $(this).closest('tr').find('.expense-subtotal-price-after-tax').attr('value', 0);
            $.fn.initMaskMoney2()
        })
    }
    static LoadExpenseTax(ele, data) {
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
    static LoadLineDetailTable(data_list=[], option='create') {
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
                    'render': () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 expense-type-select-box"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<textarea ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-des-input">${row?.['expense_description'] ? row?.['expense_description'] : ''}</textarea>`
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
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="text" class="form-control expense-unit-price-input mask-money" value="${row?.['expense_unit_price'] ? row?.['expense_unit_price'] : 0}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input type="text" class="form-control expense-subtotal-price mask-money zone-readonly" value="${row?.['expense_subtotal_price'] ? row?.['expense_subtotal_price'] : 0}" disabled readonly>`;
                    }
                },
                {
                    'render': () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 expense-tax-select-box" data-method="GET"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input type="text" class="form-control expense-subtotal-price-after-tax mask-money zone-readonly" value="${row?.['expense_after_tax_price'] ? row?.['expense_after_tax_price'] : 0}" disabled readonly>`;
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
                        AdvancePaymentPageFunction.LoadExpenseItem($(this).find('.expense-type-select-box'), data_list[index]?.['expense_type'])
                        AdvancePaymentPageFunction.LoadExpenseTax($(this).find('.expense-tax-select-box'), data_list[index]?.['expense_tax'])
                    })
                    AdvancePaymentPageFunction.CalculateTotalPrice();
                }
            }
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
                            return `<span data-zone="plan_tab" class="text-primary">${row?.['expense_item']?.['title']}</span>`
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

                    AdvancePaymentPageFunction.DrawTablePlan(data_table_planned)
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

                    AdvancePaymentPageFunction.DrawTablePlan(data_table_planned)
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

                    AdvancePaymentPageFunction.DrawTablePlan(data_table_planned)
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

                    AdvancePaymentPageFunction.DrawTablePlan(data_table_planned)
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

                    AdvancePaymentPageFunction.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
    // sub
    static ChangeRowPrice(tr) {
        let unit_price = tr.find('.expense-unit-price-input');
        let quantity = tr.find('.expense_quantity');
        let subtotal = tr.find('.expense-subtotal-price');
        let subtotal_after_tax = tr.find('.expense-subtotal-price-after-tax');
        let tax_rate = 0;
        if (tr.find('.expense-tax-select-box').val()) {
            let tax_selected = JSON.parse($('#' + tr.find('.expense-tax-select-box').attr('data-idx-data-loaded')).text())[tr.find('.expense-tax-select-box').val()];
            tax_rate = tax_selected?.['rate'];
        }
        if (unit_price.attr('value') && quantity.val()) {
            let subtotal_value = parseFloat(unit_price.attr('value')) * parseFloat(quantity.val())
            subtotal.attr('value', subtotal_value);
            let tax_value = subtotal_value * tax_rate / 100
            subtotal_after_tax.attr('value', subtotal_value + parseFloat(tax_value.toFixed(0)));
        }
        else {
            unit_price.attr('value', '');
            subtotal.attr('value', '');
            subtotal_after_tax.attr('value', '');
        }
        AdvancePaymentPageFunction.CalculateTotalPrice();
    }
    static CalculateTotalPrice() {
        let sum_subtotal = 0
        $('.expense-subtotal-price').each(function () {
            sum_subtotal += $(this).attr('value') ? parseFloat($(this).attr('value')) : 0
        });
        let sum_subtotal_price_after_tax = 0;
        $('.expense-subtotal-price-after-tax').each(function () {
            sum_subtotal_price_after_tax += $(this).attr('value') ? parseFloat($(this).attr('value')) : 0
        });
        let sum_tax = sum_subtotal_price_after_tax - sum_subtotal;
        $('#pretax-value').attr('value', sum_subtotal);
        $('#taxes-value').attr('value', sum_tax);
        $('#total-value').attr('value', sum_subtotal_price_after_tax);
        let total_value_by_words = UsualLoadPageFunction.ReadMoneyVND(sum_subtotal_price_after_tax) + ' đồng'
        total_value_by_words = total_value_by_words.charAt(0).toUpperCase() + total_value_by_words.slice(1)
        if (total_value_by_words[total_value_by_words.length - 1] === ',') {
            total_value_by_words = total_value_by_words.substring(0, total_value_by_words.length - 1) + ' đồng'
        }
        $('#total-value-by-words').val(total_value_by_words)
        $.fn.initMaskMoney2();
    }
}

/**
 * Khai báo các hàm chính
 */
class AdvancePaymentHandler {
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
                                pageVariables.ap_for = null
                            } else {
                                pageElements.$sale_order_mapped_select.prop('disabled', true)
                                pageElements.$quotation_mapped_select.prop('disabled', true)
                                let quo_mapped = opportunity_data?.['quotation'];
                                let so_mapped = opportunity_data?.['sale_order'];
                                AdvancePaymentPageFunction.LoadQuotation(quo_mapped)
                                AdvancePaymentPageFunction.LoadSaleOrder(so_mapped);
                                if (so_mapped?.['id']) {
                                    AdvancePaymentPageFunction.LoadPlanSaleOrder(opportunity_data?.['id'], so_mapped?.['id'])
                                } else if (quo_mapped?.['id']) {
                                    AdvancePaymentPageFunction.LoadPlanQuotation(opportunity_data?.['id'], quo_mapped?.['id'])
                                } else {
                                    AdvancePaymentPageFunction.LoadPlanOppOnly(opportunity_data?.['id'])
                                }
                                pageVariables.ap_for = 'opportunity'
                            }
                        } else {
                            pageElements.$quotation_mapped_select.prop('disabled', false)
                            pageElements.$sale_order_mapped_select.prop('disabled', false)
                            pageVariables.ap_for = null
                            AdvancePaymentPageFunction.DrawTablePlan()
                        }
                    }
                })
        }
    }
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = pageElements.$title.val()

        if (pageVariables.ap_for === 'opportunity') {
            frm.dataForm['opportunity_id'] = pageElements.$opportunity_id.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else if (pageVariables.ap_for === 'quotation') {
            frm.dataForm['quotation_mapped_id'] = pageElements.$quotation_mapped_select.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else if (pageVariables.ap_for === 'saleorder') {
            frm.dataForm['sale_order_mapped_id'] = pageElements.$sale_order_mapped_select.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else {
            frm.dataForm['opportunity_id'] = null
            frm.dataForm['quotation_mapped_id'] = null
            frm.dataForm['sale_order_mapped_id'] = null
            frm.dataForm['sale_code_type'] = 2
        }
        frm.dataForm['employee_inherit_id'] = pageElements.$employee_inherit_id.val()

        frm.dataForm['advance_payment_type'] = pageElements.$advance_payment_type.val()
        frm.dataForm['supplier_id'] = pageElements.$supplier_id.val() || null
        frm.dataForm['method'] = pageElements.$method.val()
        frm.dataForm['return_date'] = moment(pageElements.$return_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['advance_date'] = pageElements.$advance_date.val() ? moment(pageElements.$advance_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        frm.dataForm['bank_data'] = pageElements.$bank_info.val()
        frm.dataForm['money_gave'] = pageElements.$money_gave.prop('checked')

        let ap_item_list = []
        let expense_items = [];
        pageElements.$table_line_detail.find('tbody tr').each(function () {
            let row = $(this);
            let expense_description = row.find('.expense-des-input').val();
            let expense_type = row.find('.expense-type-select-box').val();
            let expense_uom_name = row.find('.expense-uom-input').val();
            let expense_quantity = parseFloat(row.find('.expense_quantity').val());
            let expense_tax = row.find('.expense-tax-select-box').val();
            let expense_unit_price = parseFloat(row.find('.expense-unit-price-input').attr('value'));
            let expense_subtotal_price = parseFloat(row.find('.expense-subtotal-price').attr('value'));
            let expense_after_tax_price = parseFloat(row.find('.expense-subtotal-price-after-tax').attr('value'));
            let tax_rate = 0;
            if (row.find('.expense-tax-select-box').val()) {
                let tax_selected = SelectDDControl.get_data_from_idx(row.find('.expense-tax-select-box'), row.find('.expense-tax-select-box').val())
                tax_rate = parseFloat(tax_selected?.['rate']);
            }
            if (!isNaN(expense_subtotal_price) && !isNaN(expense_after_tax_price)) {
                ap_item_list.push({
                    'expense_description': expense_description,
                    'expense_type_id': expense_type,
                    'expense_uom_name': expense_uom_name,
                    'expense_quantity': expense_quantity,
                    'expense_tax_id': expense_tax,
                    'expense_unit_price': expense_unit_price,
                    'expense_subtotal_price': expense_subtotal_price,
                    'expense_after_tax_price': expense_after_tax_price,
                    'expense_tax_price': expense_subtotal_price * tax_rate / 100
                })
                if (expense_type) {
                    let dataExpense = SelectDDControl.get_data_from_idx(row.find('.expense-type-select-box'), expense_type);
                    expense_items.push({
                        'expense_type': dataExpense,
                    })
                }
            }
        })
        frm.dataForm['ap_item_list'] = ap_item_list
        frm.dataForm['expense_items'] = expense_items;

        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        return frm
    }
    static LoadDetailAP(option) {
        let url_loaded = $('#form-detail-advance').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['advance_payment_detail'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    // console.log(data)

                    if (data?.['system_status'] === 3) {
                        $('#print-document').prop('hidden', false)
                    }

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
                    const data_process = Object.keys(data?.['process'] || {}).length > 0 ? [
                        {
                            ...data?.['process'],
                            selected: true,
                        }
                    ] : [];
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
                    AdvancePaymentPageFunction.LoadQuotation()
                    AdvancePaymentPageFunction.LoadSaleOrder()

                    if (Object.keys(data?.['opportunity']).length !== 0 && Object.keys(data?.['employee_inherit']).length !== 0) {
                        pageElements.$quotation_mapped_select.prop('disabled', true)
                        pageElements.$sale_order_mapped_select.prop('disabled', true)
                        AdvancePaymentPageFunction.LoadQuotation(data?.['opportunity']?.['quotation_mapped'])
                        AdvancePaymentPageFunction.LoadSaleOrder(data?.['opportunity']?.['sale_order_mapped']);
                        if (data?.['opportunity']?.['sale_order_mapped']?.['id']) {
                            AdvancePaymentPageFunction.LoadPlanSaleOrder(
                                pageElements.$opportunity_id.val(),
                                data?.['opportunity']?.['sale_order_mapped']?.['id'],
                                data?.['workflow_runtime_id']
                            )
                        }
                        else if (data?.['opportunity']?.['quotation_mapped']?.['id']) {
                            AdvancePaymentPageFunction.LoadPlanQuotation(
                                pageElements.$opportunity_id.val(),
                                data?.['opportunity']?.['quotation_mapped']?.['id'],
                                data?.['workflow_runtime_id']
                            )
                        }
                        else {
                            AdvancePaymentPageFunction.LoadPlanOppOnly(
                                pageElements.$opportunity_id.val(),
                                data?.['workflow_runtime_id']
                            )
                        }
                        pageVariables.ap_for = 'opportunity'
                    }
                    else if (Object.keys(data?.['quotation_mapped']).length !== 0) {
                        pageElements.$opportunity_id.prop('disabled', true)
                        pageElements.$sale_order_mapped_select.prop('disabled', true)
                        AdvancePaymentPageFunction.LoadQuotation(data?.['quotation_mapped'])
                        AdvancePaymentPageFunction.LoadSaleOrder(data?.['quotation_mapped']?.['sale_order_mapped'])

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
                                    AdvancePaymentPageFunction.LoadSaleOrder(so_mapped_opp[0]);
                                }
                            })

                        AdvancePaymentPageFunction.LoadPlanQuotationOnly(
                            data?.['quotation_mapped']?.['id'],
                            data?.['workflow_runtime_id']
                        )
                        pageVariables.ap_for = 'quotation'
                    }
                    else if (Object.keys(data?.['sale_order_mapped']).length !== 0) {
                        pageElements.$opportunity_id.prop('disabled', true)
                        pageElements.$quotation_mapped_select.prop('disabled', true)
                        AdvancePaymentPageFunction.LoadSaleOrder(data?.['sale_order_mapped'])
                        AdvancePaymentPageFunction.LoadQuotation(data?.['sale_order_mapped']?.['quotation_mapped'])
                        AdvancePaymentPageFunction.LoadPlanSaleOrderOnly(
                            data?.['sale_order_mapped']?.['id'],
                            data?.['workflow_runtime_id']
                        )
                        pageVariables.ap_for = 'saleorder'
                    }
                    else {
                        pageVariables.ap_for = null
                    }

                    pageElements.$title.val(data.title);

                    pageElements.$advance_payment_type.val(data.advance_payment_type).trigger('change');

                    pageElements.$date_created.val(data.date_created ? DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "DD/MM/YYYY", data.date_created) : '')

                    UsualLoadPageFunction.AutoLoadCurrentEmployee({element: pageElements.$employee_created, fullname: data.employee_created?.['full_name']})

                    pageElements.$return_date.val(data.return_date ? DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", data.return_date) : '')

                    pageElements.$advance_date.val(data.advance_date ? DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", data.advance_date) : '')

                    AdvancePaymentPageFunction.LoadSupplier(data?.['supplier'] || {})

                    pageElements.$method.val(data.method).trigger('change')

                    pageElements.$bank_info.val(data?.['bank_data'] || '')

                    AdvancePaymentPageFunction.LoadTableBankAccount((data?.['supplier'] || {})?.['bank_accounts_mapped'] || [])

                    AdvancePaymentPageFunction.LoadLineDetailTable(data?.['expense_items'], option)

                    pageElements.$money_gave.prop('checked', data?.['money_gave']);

                    $.fn.initMaskMoney2();

                    new $x.cls.file($('#attachment')).init({
                        enable_download: option === 'detail',
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
class AdvancePaymentEventHandler {
    static InitPageEven() {
        pageElements.$opportunity_id.on('change', function () {
            pageElements.$quotation_mapped_select.empty()
            pageElements.$sale_order_mapped_select.empty()
            if (pageElements.$opportunity_id.val()) {
                let selected = SelectDDControl.get_data_from_idx(pageElements.$opportunity_id, pageElements.$opportunity_id.val())
                if (selected?.['is_close']) {
                    $.fn.notifyB({description: `Opportunity ${selected?.['code']} has been closed. Can not select.`}, 'failure');
                    pageElements.$opportunity_id.empty()
                    pageVariables.ap_for = null
                }
                else {
                    pageElements.$sale_order_mapped_select.prop('disabled', true)
                    pageElements.$quotation_mapped_select.prop('disabled', true)
                    let quo_mapped = SelectDDControl.get_data_from_idx(pageElements.$opportunity_id, pageElements.$opportunity_id.val())['quotation'];
                    let so_mapped = SelectDDControl.get_data_from_idx(pageElements.$opportunity_id, pageElements.$opportunity_id.val())['sale_order'];
                    AdvancePaymentPageFunction.LoadQuotation(quo_mapped)
                    AdvancePaymentPageFunction.LoadSaleOrder(so_mapped);
                    if (so_mapped?.['id']) {
                        AdvancePaymentPageFunction.LoadPlanSaleOrder(pageElements.$opportunity_id.val(), so_mapped?.['id'])
                    }
                    else if (quo_mapped?.['id']) {
                        AdvancePaymentPageFunction.LoadPlanQuotation(pageElements.$opportunity_id.val(), quo_mapped?.['id'])
                    } else {
                        AdvancePaymentPageFunction.LoadPlanOppOnly(pageElements.$opportunity_id.val())
                    }
                    pageVariables.ap_for = 'opportunity'
                }
            }
            else {
                pageElements.$quotation_mapped_select.prop('disabled', false)
                pageElements.$sale_order_mapped_select.prop('disabled', false)
                pageVariables.ap_for = null
                AdvancePaymentPageFunction.DrawTablePlan()
            }
        })
        pageElements.$advance_payment_type.on('change', function () {
            if ($(this).val() === '1') {
                pageElements.$supplier_id.empty().prop('disabled', false);
                pageElements.$supplier_label.addClass('required');
            }
            else {
                pageElements.$supplier_id.empty().prop('disabled', true);
                pageElements.$supplier_label.removeClass('required');
            }
        })
        pageElements.$method.on('change', function () {
            if ($(this).val() === '0') {
                pageElements.$bank_info.closest('.form-group').find('label').removeClass('required')
                pageElements.$bank_info.prop('required', false)
            }
            else {
                pageElements.$bank_info.closest('.form-group').find('label').addClass('required')
                pageElements.$bank_info.prop('required', true)
            }
        })
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
        $(document).on("click", '#btn-add-row-line-detail', function () {
            UsualLoadPageFunction.AddTableRow(
                pageElements.$table_line_detail,
                {}
            )
            let row_added = pageElements.$table_line_detail.find('tbody tr:last-child')
            AdvancePaymentPageFunction.LoadExpenseItem(row_added.find('.expense-type-select-box'))
            AdvancePaymentPageFunction.LoadExpenseTax(row_added.find('.expense-tax-select-box'))
        });
        $(document).on("click", '.btn-del-line-detail', function () {
            UsualLoadPageFunction.DeleteTableRow(
                pageElements.$table_line_detail,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
            AdvancePaymentPageFunction.CalculateTotalPrice();
        });
        $(document).on("change", '.expense-unit-price-input', function () {
            AdvancePaymentPageFunction.ChangeRowPrice($(this).closest('tr'));
        })
        $(document).on("change", '.expense-tax-select-box', function () {
            AdvancePaymentPageFunction.ChangeRowPrice($(this).closest('tr'));
        })
        $(document).on("change", '.expense_quantity', function () {
            AdvancePaymentPageFunction.ChangeRowPrice($(this).closest('tr'));
        })
    }
}
