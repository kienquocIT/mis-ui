const initEmployee = JSON.parse($('#employee_current').text());
const APCreatorEle = $('#creator-select-box')
const APTypeEle = $('#type-select-box')
const supplierEle = $('#supplier-select-box')
const tableLineDetail = $('#tab_line_detail_datatable')
const money_gave = $('#money-gave')
const quotation_mapped_select = $('#quotation_mapped_select')
const sale_order_mapped_select = $('#sale_order_mapped_select')
const opp_mapped_select = $('#opportunity_id')
const script_url = $('#script-url')
const script_trans = $('#script-trans')
const ap_method_Ele = $('#ap-method')
const tab_plan_datatable = $('#tab_plan_datatable')
let ap_for = null

class APLoadPage {
    static LoadCreatedDate() {
        $('#created_date_id').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 1901,
            locale: {
                format: 'YYYY-MM-DD'
            },
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10)
        }).prop('disabled', true);
    }
    static LoadCreator(data) {
        APCreatorEle.val(data?.['full_name']).prop('readonly', true).prop('disabled', true)
        let btn_detail = $('#btn-detail-creator-tab');
        $('#creator-detail-span').prop('hidden', false);
        $('#creator-name').text(data?.['full_name']);
        $('#creator-code').text(data?.['code']);
        $('#creator-department').text(data?.['group']?.['title']);
        let url = btn_detail.attr('data-url').replace('0', data?.['id']);
        btn_detail.attr('href', url);
    }
    static LoadQuotation(data) {
        quotation_mapped_select.initSelect2({
            allowClear: true,
            ajax: {
                url: quotation_mapped_select.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'quotation_list',
            keyId: 'id',
            keyText: 'code',
        }).on('change', function () {
            opp_mapped_select.empty();
            sale_order_mapped_select.empty();
            if (quotation_mapped_select.val()) {
                opp_mapped_select.prop('disabled', true)
                sale_order_mapped_select.prop('disabled', true)
                let selected = SelectDDControl.get_data_from_idx(quotation_mapped_select, quotation_mapped_select.val())
                APLoadPage.LoadSaleOrder(selected?.['sale_order'])
                APLoadTab.LoadPlanQuotationOnly($(this).val())
                ap_for = 'quotation'
            }
            else {
                opp_mapped_select.prop('disabled', false)
                sale_order_mapped_select.prop('disabled', false)
                ap_for = null
                APLoadTab.DrawTablePlan()
            }
        })
    }
    static LoadSaleOrder(data) {
        sale_order_mapped_select.initSelect2({
            allowClear: true,
            ajax: {
                url: sale_order_mapped_select.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'code',
        }).on('change', function () {
            opp_mapped_select.empty()
            quotation_mapped_select.empty()
            if (sale_order_mapped_select.val()) {
                opp_mapped_select.prop('disabled', true)
                quotation_mapped_select.prop('disabled', true)
                let selected = SelectDDControl.get_data_from_idx(sale_order_mapped_select, sale_order_mapped_select.val())
                APLoadPage.LoadQuotation(selected?.['quotation'])
                APLoadTab.LoadPlanSaleOrderOnly($(this).val())
                ap_for = 'saleorder'
            }
            else {
                opp_mapped_select.prop('disabled', false)
                quotation_mapped_select.prop('disabled', false)
                ap_for = null
                APLoadTab.DrawTablePlan()
            }
        })
    }
    static LoadSupplier(data) {
        supplierEle.initSelect2({
            ajax: {
                url: supplierEle.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let result = [];
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (resp.data[keyResp][i].account_type.includes('Supplier')) {
                        result.push(resp.data[keyResp][i])
                    }
                }
                if (result.length > 0) {
                    $('.select2-results__message').prop('hidden', true);
                }
                return result;
            },
            data: (data ? data : null),
            keyResp: 'account_list',
            keyId: 'id',
            keyText: 'name',
        }).on('change', function () {
            let obj_selected = JSON.parse($('#' + supplierEle.attr('data-idx-data-loaded')).text())[supplierEle.val()];
            APLoadPage.LoadSupplierInfor(obj_selected);
            APLoadTab.LoadBankInfo(obj_selected?.['bank_accounts_mapped']);
        })
    }
    static LoadSupplierInfor(data) {
        let btn_detail = $('#btn-detail-supplier-tab');
        $('#supplier-detail-span').prop('hidden', false);
        $('#supplier-name').text(data?.['name']);
        $('#supplier-code').text(data?.['code']);
        $('#supplier-owner').text(data?.['owner']?.['fullname']);
        $('#supplier-industry').text(data?.['industry']?.['title']);
        let url = btn_detail.attr('data-url').replace('0', data?.['id']);
        btn_detail.attr('href', url);
    }
    static LoadReturnDate() {
        $('#return_date_id').daterangepicker({
            singleDatePicker: true,
            timePicker: false,
            showDropdowns: true,
            autoApply: true,
            minYear: parseInt(moment().format('YYYY')),
            minDate: new Date(parseInt(moment().format('YYYY')), parseInt(moment().format('MM'))-1, parseInt(moment().format('DD'))),
            locale: {
                format: 'DD/MM/YYYY'
            },
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY')) + 100,
        }).val('')
    }
}

class APLoadTab {
    // line detail
    static LoadExpenseItem(ele, data) {
        ele.initSelect2({
            ajax: {
                url: tableLineDetail.attr('data-url-expense-type-list'),
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
                url: tableLineDetail.attr('data-url-tax-list'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tax_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadLineDetailTable(data=[], option='create') {
        tableLineDetail.DataTable().clear().destroy()
        tableLineDetail.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '30vh',
            scrollX: '100vh',
            scrollCollapse: true,
            data: data,
            columns: [
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input required ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-name-input" value="${row?.['expense_name'] ? row?.['expense_name'] : ''}">`
                    }
                },
                {
                    'render': () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 expense-type-select-box"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-uom-input" value="${row?.['expense_uom_name'] ? row?.['expense_uom_name'] : ''}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="number" min="1" class="form-control expense_quantity" value="${row?.['expense_quantity'] ? row?.['expense_quantity'] : 1}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="text" class="form-control expense-unit-price-input mask-money" value="${row?.['expense_unit_price'] ? row?.['expense_unit_price'] : 0}">`;
                    }
                },
                {
                    'render': () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 expense-tax-select-box" data-method="GET"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input type="text" class="form-control expense-subtotal-price mask-money zone-readonly" value="${row?.['expense_subtotal_price'] ? row?.['expense_subtotal_price'] : 0}" disabled readonly>`;
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
                        return `<button ${option === 'detail' ? 'disabled' : ''} class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            initComplete: function () {
                if (data.length > 0) {
                    tableLineDetail.find('tbody tr').each(function (index) {
                        APLoadTab.LoadExpenseItem($(this).find('.expense-type-select-box'), data[index]?.['expense_type'])
                        APLoadTab.LoadExpenseTax($(this).find('.expense-tax-select-box'), data[index]?.['expense_tax'])
                    })
                    APAction.CalculateTotalPrice();
                }
            }
        });
    }
    // plan
    static DrawTablePlan(data_list=[]) {
        $('#notify-none-sale-code').prop('hidden', data_list.length > 0 && opp_mapped_select.val() || quotation_mapped_select.val() || sale_order_mapped_select.val())
        tab_plan_datatable.DataTable().clear().destroy()
        tab_plan_datatable.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '30vh',
            scrollX: '100vh',
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
                url: script_url.attr('data-url-expense-quotation'),
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
                url: script_url.attr('data-url-ap-cost-list'),
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
                url: script_url.attr('data-url-payment-cost-list'),
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
                        if (sum_available < 0) {
                            sum_available = 0;
                        }

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
                            unplanned_ap_merged[typeId].expense_name = null;
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

                    APLoadTab.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
    static LoadPlanQuotationOnly(quotation_id, workflow_runtime_id) {
        if (quotation_id) {
            let dataParam1 = {'quotation_id': quotation_id}
            let expense_quotation = $.fn.callAjax2({
                url: script_url.attr('data-url-expense-quotation'),
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
                url: script_url.attr('data-url-ap-cost-list'),
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
                url: script_url.attr('data-url-payment-cost-list'),
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
                        if (sum_available < 0) {
                            sum_available = 0;
                        }
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
                            unplanned_ap_merged[typeId].expense_name = null;
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

                    APLoadTab.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
    static LoadPlanSaleOrderOnly(sale_order_id, workflow_runtime_id) {
        if (sale_order_id) {
            let dataParam1 = {'sale_order_id': sale_order_id}
            let expense_sale_order = $.fn.callAjax2({
                url: script_url.attr('data-url-expense-sale-order'),
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
                url: script_url.attr('data-url-ap-cost-list'),
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
                url: script_url.attr('data-url-payment-cost-list'),
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
                        if (sum_available < 0) {
                            sum_available = 0;
                        }
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
                            unplanned_ap_merged[typeId].expense_name = null;
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

                    APLoadTab.DrawTablePlan(data_table_planned)
                    WFRTControl.setWFRuntimeID(workflow_runtime_id);
                })
        }
    }
    // bank info
    static LoadBankInfo(data) {
        if (data.length > 0) {
            $('#notify-none-bank-account').prop('hidden', true)
            let bank_cards = ``
            for (let i = 0; i < data.length; i++) {
                let bank_account = data[i];
                bank_cards += `<div class="col-12 col-md-6 col-lg-3 mb-2">
                    <div class="border border-secondary rounded p-3 min-h-200p">
                        <div class="text-center"><i class="bi bi-bank"></i></div>
                        ${bank_account?.['bank_account_name'] ? `<div class="bank_account_name text-muted text-center">${bank_account?.['is_default'] ? '<i class="text-blue fas fa-thumbtack fa-rotate-by" style="--fa-rotate-angle: -45deg;""></i>' : ''} <b>${bank_account?.['bank_account_name'].toUpperCase()}</b></div>` : ''}
                        ${bank_account?.['bank_account_number'] ? `<div class="bank_account_number text-muted text-center mb-3">${script_trans.attr('data-trans-bank-account-no')}: <b>${bank_account?.['bank_account_number']}</b></div>` : ''}
                        ${bank_account?.['bank_name'] ? `<div class="bank_name text-muted text-center">${script_trans.attr('data-trans-bank-name')}: <b>${bank_account?.['bank_name']}</b></div>` : ''}
                        ${bank_account?.['bank_code'] ? `<div class="bank_code text-muted text-center">${script_trans.attr('data-trans-bank-code')}: <b>${bank_account?.['bank_code'].toUpperCase()}</b></div>` : ''}
                        ${bank_account?.['bic_swift_code'] ? `<div class="bic_swift_code text-muted text-center">${script_trans.attr('data-trans-BICSWIFT-code')}: <b>${bank_account?.['bic_swift_code'].toUpperCase()}</b></div>` : ''}
                    </div>
                </div>`
            }
            $('#list-bank-account-information').append(`<div class="row">${bank_cards}</div>`)
        }
        else {
            $('#notify-none-bank-account').prop('hidden', false)
        }
    }
}

class APAction {
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
            result = xe2[parseInt(str_n[0])] + " " + APAction.ReadMoneyVND(parseInt(str_n.substring(1, len_n)))
        }
        else if (len_n <= 6) {
            result = APAction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 3))) + " nghìn " + APAction.ReadMoneyVND(parseInt(str_n.substring(len_n - 3, len_n)))
        }
        else if (len_n <= 9) {
            result = APAction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 6))) + " triệu " + APAction.ReadMoneyVND(parseInt(str_n.substring(len_n - 6, len_n)))
        }
        else if (len_n <= 12) {
            result = APAction.ReadMoneyVND(parseInt(str_n.substring(0, len_n - 9))) + " tỷ " + APAction.ReadMoneyVND(parseInt(str_n.substring(len_n - 9, len_n)))
        }
    
        result = String(result.trim())
        return result;
    }
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
        $.fn.initMaskMoney2();
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
        APAction.CalculateTotalPrice();
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
        let total_value_by_words = APAction.ReadMoneyVND(sum_subtotal_price_after_tax) + ' đồng'
        total_value_by_words = total_value_by_words.charAt(0).toUpperCase() + total_value_by_words.slice(1)
        if (total_value_by_words[total_value_by_words.length - 1] === ',') {
            total_value_by_words = total_value_by_words.substring(0, total_value_by_words.length - 1) + ' đồng'
        }
        $('#total-value-by-words').val(total_value_by_words)
        $.fn.initMaskMoney2();
    }
    static AddRow(table, data) {
        table.DataTable().row.add(data).draw();
    }
    static DeleteRow(table, currentRow) {
        currentRow = parseInt(currentRow) - 1
        let rowIndex = table.DataTable().row(currentRow).index();
        let row = table.DataTable().row(rowIndex);
        row.remove().draw();
    }
    static DisabledDetailPage(option) {
        if (option === 'detail') {
            $('.form-control').prop('readonly', true);
            $('.form-select').prop('disabled', true);
            $('.select2').prop('disabled', true);
            $('form input').prop('disabled', true);
            $('.del-address-item').prop('hidden', true);
            $('.card-close').addClass('disabled').prop('hidden', true);
            $('#btn-add-row-line-detail').prop('disabled', true);
            $('.btn-del-line-detail').prop('disabled', true);
            $('.btn-choose-from-price-list').prop('disabled', true);
        }
    }
}

class APHandle {
    static LoadPage(opportunity=null) {
        APLoadPage.LoadCreatedDate()
        APLoadPage.LoadCreator(initEmployee)
        if (opportunity) {
            new $x.cls.bastionField({
                has_opp: true,
                has_inherit: true,
                data_opp: [opportunity]
            }).init();

            sale_order_mapped_select.prop('disabled', true)
            quotation_mapped_select.prop('disabled', true)
            let quo_mapped = opportunity['quotation'];
            let so_mapped = opportunity['sale_order'];
            APLoadPage.LoadQuotation(quo_mapped)
            APLoadTab.LoadPlanQuotation(opportunity?.['id'], quo_mapped?.['id'])
            APLoadPage.LoadSaleOrder(so_mapped);
            ap_for = 'opportunity'
        }
        APLoadPage.LoadQuotation()
        APLoadPage.LoadSaleOrder()
        APLoadPage.LoadSupplier()
        APLoadPage.LoadReturnDate()
        APLoadTab.LoadLineDetailTable()
        APLoadTab.DrawTablePlan()
    }
    static CombinesData(frmEle, option) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val()

        if (option === 'create') {
            if (ap_for === 'opportunity') {
                frm.dataForm['opportunity_id'] = opp_mapped_select.val()
                frm.dataForm['sale_code_type'] = 0
            }
            else if (ap_for === 'quotation') {
                frm.dataForm['quotation_mapped_id'] = quotation_mapped_select.val()
                frm.dataForm['sale_code_type'] = 0
            }
            else if (ap_for === 'saleorder') {
                frm.dataForm['sale_order_mapped_id'] = sale_order_mapped_select.val()
                frm.dataForm['sale_code_type'] = 0
            }
            else {
                frm.dataForm['opportunity_id'] = null
                frm.dataForm['quotation_mapped_id'] = null
                frm.dataForm['sale_order_mapped_id'] = null
                frm.dataForm['sale_code_type'] = 2
            }
            frm.dataForm['employee_inherit_id'] = $('#employee_inherit_id').val()
        }

        frm.dataForm['advance_payment_type'] = APTypeEle.val()
        frm.dataForm['supplier_id'] = supplierEle.val() ? supplierEle.val() : null
        frm.dataForm['method'] = ap_method_Ele.val()
        frm.dataForm['return_date'] = moment($('#return_date_id').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['money_gave'] = money_gave.prop('checked')

        let ap_item_list = []
        tableLineDetail.find('tbody tr').each(function () {
            let row = $(this);
            let expense_name = row.find('.expense-name-input').val();
            let expense_type = row.find('.expense-type-select-box').val();
            let expense_uom_name = row.find('.expense-uom-input').val();
            let expense_quantity = row.find('.expense_quantity').val();
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
                    'expense_name': expense_name,
                    'expense_type_id': expense_type,
                    'expense_uom_name': expense_uom_name,
                    'expense_quantity': expense_quantity,
                    'expense_tax_id': expense_tax,
                    'expense_unit_price': expense_unit_price,
                    'expense_subtotal_price': expense_subtotal_price,
                    'expense_after_tax_price': expense_after_tax_price,
                    'expense_tax_price': expense_subtotal_price * tax_rate / 100
                })
            }
        })
        frm.dataForm['ap_item_list'] = ap_item_list

        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        let advanceVal = $('#total-value').valCurrency();
        if (advanceVal) {
            frm.dataForm['advance_value'] = parseFloat(advanceVal);
        }

        // console.log(frm)
        return frm
    }
    static LoadDetailAP(option) {
        let url_loaded = $('#form-detail-advance').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['advance_payment_detail'];
                    if (option === 'detail') {
                        new PrintTinymceControl().render('57725469-8b04-428a-a4b0-578091d0e4f5', data, false);
                    }
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    // console.log(data)

                    opp_mapped_select.prop('disabled', true)
                    quotation_mapped_select.prop('disabled', true)
                    sale_order_mapped_select.prop('disabled', true)
                    $('#employee_inherit_id').prop('disabled', true)

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
                        opp_disabled: true,
                        has_inherit: true,
                        inherit_disabled: true,
                        has_process: true,
                        process_disabled: true,
                        data_inherit: data_inherit,
                        data_opp: data_opp,
                        data_process: data_process,
                        data_process_stage_app: data_process_stage_app,
                    }).init();

                    if (Object.keys(data?.['opportunity']).length !== 0 && Object.keys(data?.['employee_inherit']).length !== 0) {
                        APLoadPage.LoadQuotation(data?.['opportunity']?.['quotation_mapped'])
                        APLoadTab.LoadPlanQuotation(
                            opp_mapped_select.val(),
                            data?.['opportunity']?.['quotation_mapped']?.['id'],
                            data?.['workflow_runtime_id']
                        )
                        APLoadPage.LoadSaleOrder(data?.['opportunity']?.['sale_order_mapped']);
                        ap_for = 'opportunity'
                    }
                    else if (Object.keys(data?.['quotation_mapped']).length !== 0) {
                        APLoadPage.LoadQuotation(data?.['quotation_mapped'])
                        APLoadPage.LoadSaleOrder(data?.['quotation_mapped']?.['sale_order_mapped'])

                        let dataParam = {'quotation_id': quotation_mapped_select.val()}
                        let ap_mapped_item = $.fn.callAjax2({
                            url: sale_order_mapped_select.attr('data-url'),
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
                                    APLoadPage.LoadSaleOrder(so_mapped_opp[0]);
                                }
                            })

                        APLoadTab.LoadPlanQuotationOnly(
                            data?.['quotation_mapped']?.['id'],
                            data?.['workflow_runtime_id']
                        )
                        ap_for = 'quotation'
                    }
                    else if (Object.keys(data?.['sale_order_mapped']).length !== 0) {
                        APLoadPage.LoadSaleOrder(data?.['sale_order_mapped'])
                        APLoadPage.LoadQuotation(data?.['sale_order_mapped']?.['quotation_mapped'])
                        APLoadTab.LoadPlanSaleOrderOnly(
                            data?.['sale_order_mapped']?.['id'],
                            data?.['workflow_runtime_id']
                        )
                        ap_for = 'saleorder'
                    }
                    else {
                        ap_for = null
                    }

                    $('#title').val(data.title);

                    APTypeEle.val(data.advance_payment_type);

                    APLoadPage.LoadSupplier(data.supplier);

                    ap_method_Ele.val(data.method)

                    $('#created_date_id').val(data.date_created.split(' ')[0]).prop('readonly', true)

                    $('#return_date_id').val(moment(data.return_date.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))

                    APLoadPage.LoadCreator(data.employee_created)

                    if (Object.keys(data?.['supplier']).length !== 0) {
                        APLoadPage.LoadSupplier(data?.['supplier'])
                        APLoadPage.LoadSupplierInfor(data?.['supplier']);
                        APLoadTab.LoadBankInfo(data?.['supplier']?.['bank_accounts_mapped']);
                    }

                    APLoadTab.LoadLineDetailTable(data?.['expense_items'], option)

                    money_gave.prop('disabled', data?.['money_gave']);
                    money_gave.prop('checked', data?.['money_gave']);

                    $.fn.initMaskMoney2();

                    new $x.cls.file($('#attachment')).init({
                        enable_download: option === 'detail',
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    APAction.DisabledDetailPage(option);
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

opp_mapped_select.on('change', function () {
    quotation_mapped_select.empty()
    sale_order_mapped_select.empty()
    if (opp_mapped_select.val()) {
        let selected = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())
        if (selected?.['is_close']) {
            $.fn.notifyB({description: `Opportunity ${selected?.['code']} has been closed. Can not select.`}, 'failure');
            opp_mapped_select.empty()
            ap_for = null
        }
        else {
            sale_order_mapped_select.prop('disabled', true)
            quotation_mapped_select.prop('disabled', true)
            let quo_mapped = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())['quotation'];
            let so_mapped = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())['sale_order'];
            APLoadPage.LoadQuotation(quo_mapped)
            APLoadTab.LoadPlanQuotation(opp_mapped_select.val(), quo_mapped?.['id'])
            APLoadPage.LoadSaleOrder(so_mapped);
            ap_for = 'opportunity'
        }
    }
    else {
        quotation_mapped_select.prop('disabled', false)
        sale_order_mapped_select.prop('disabled', false)
        ap_for = null
        APLoadTab.DrawTablePlan()
    }
})

APTypeEle.on('change', function () {
    if (APTypeEle.val() === '1') {
        supplierEle.prop('disabled', false);
        $('#supplier-label').addClass('required');
        APLoadPage.LoadSupplier();
    }
    else {
        supplierEle.prop('disabled', true);
        $('#supplier-label').removeClass('required');
    }
})

$(document).on("click", '#btn-add-row-line-detail', function () {
    APAction.AddRow(tableLineDetail, {})
    let row_added = tableLineDetail.find('tbody tr:last-child')
    APLoadTab.LoadExpenseItem(row_added.find('.expense-type-select-box'))
    APLoadTab.LoadExpenseTax(row_added.find('.expense-tax-select-box'))
});

$(document).on("click", '.btn-del-line-detail', function () {
    APAction.DeleteRow(tableLineDetail, parseInt($(this).closest('tr').find('td:first-child').text()))
    APAction.CalculateTotalPrice();
});

$(document).on("change", '.expense-unit-price-input', function () {
    APAction.ChangeRowPrice($(this).closest('tr'));
})

$(document).on("change", '.expense-tax-select-box', function () {
    APAction.ChangeRowPrice($(this).closest('tr'));
})

$(document).on("change", '.expense_quantity', function () {
    APAction.ChangeRowPrice($(this).closest('tr'));
})
