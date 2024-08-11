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
const ap_method_Ele = $('#ap-method')
const tab_plan_datatable = $('#tab_plan_datatable')
const tab_plan_datatable_tbody = $('#tab_plan_datatable tbody')

opp_mapped_select.on('change', function () {
    quotation_mapped_select.empty();
    sale_order_mapped_select.empty();
    if (opp_mapped_select.val()) {
        let opp_mapped_opp = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())
        if (opp_mapped_opp?.['is_close']) {
            $.fn.notifyB({description: `Opportunity ${opp_mapped_opp?.['code']} has been closed. Can not select.`}, 'failure');
            opp_mapped_select.find('option').remove();
        }
        else {
            sale_order_mapped_select.prop('disabled', true);
            quotation_mapped_select.prop('disabled', true);

            let quo_mapped_opp = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())['quotation'];
            let so_mapped_opp = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())['sale_order'];
            APLoadQuotation(quo_mapped_opp)
            LoadPlanQuotation(opp_mapped_select.val(), quo_mapped_opp?.['id'])
            APLoadSaleOrder(so_mapped_opp);
        }
    }
    else {
        quotation_mapped_select.prop('disabled', false);
        sale_order_mapped_select.prop('disabled', false);
    }
})

function read_money_vnd(num) {
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
        result = xe2[parseInt(str_n[0])] + " " + read_money_vnd(parseInt(str_n.substring(1, len_n)))
    }
    else if (len_n <= 6) {
        result = read_money_vnd(parseInt(str_n.substring(0, len_n - 3))) + " nghìn, " + read_money_vnd(parseInt(str_n.substring(len_n - 3, len_n)))
    }
    else if (len_n <= 9) {
        result = read_money_vnd(parseInt(str_n.substring(0, len_n - 6))) + " triệu, " + read_money_vnd(parseInt(str_n.substring(len_n - 6, len_n)))
    }
    else if (len_n <= 12) {
        result = read_money_vnd(parseInt(str_n.substring(0, len_n - 9))) + " tỷ, " + read_money_vnd(parseInt(str_n.substring(len_n - 9, len_n)))
    }

    result = String(result.trim())
    return result;
}

function loadLineDetailTable(data=[]) {
    tableLineDetail.DataTable().clear().destroy()
    tableLineDetail.DataTableDefault({
        styleDom: 'hide-foot',
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        data: data,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'wrap-text',
                'render': (data, type, row) => {
                    return `<input class="form-control expense-name-input" value="${row?.['expense_name'] ? row?.['expense_name'] : ''}">`
                }
            },
            {
                className: 'wrap-text',
                'render': () => {
                    return `<select class="form-select select2 expense-type-select-box"></select>`;
                }
            },
            {
                className: 'wrap-text',
                'render': (data, type, row) => {
                    return `<input class="form-control expense-uom-input" value="${row?.['expense_uom_name'] ? row?.['expense_uom_name'] : ''}">`;
                }
            },
            {
                className: 'wrap-text',
                'render': (data, type, row) => {
                    return `<input type="number" min="1" class="form-control expense_quantity" value="${row?.['expense_quantity'] ? row?.['expense_quantity'] : 1}">`;
                }
            },
            {
                className: 'wrap-text',
                'render': (data, type, row) => {
                    return `<input data-return-type="number" type="text" class="form-control expense-unit-price-input mask-money" value="${row?.['expense_unit_price'] ? row?.['expense_unit_price'] : 0}">`;
                }
            },
            {
                className: 'wrap-text',
                'render': () => {
                    return `<select class="form-select select2 expense-tax-select-box" data-method="GET"></select>`;
                }
            },
            {
                className: 'wrap-text',
                'render': (data, type, row) => {
                    return `<input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money zone-readonly" value="${row?.['expense_subtotal_price'] ? row?.['expense_subtotal_price'] : 0}" disabled readonly>`;
                }
            },
            {
                className: 'wrap-text',
                'render': (data, type, row) => {
                    return `<input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money zone-readonly" value="${row?.['expense_after_tax_price'] ? row?.['expense_after_tax_price'] : 0}" disabled readonly>`;
                }
            },
            {
                className: 'wrap-text text-center',
                'render': () => {
                    return `<button class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                }
            },
        ],
        initComplete: function () {
            if (data.length > 0) {
                tableLineDetail.find('tbody tr').each(function (index) {
                    loadExpenseItem($(this).find('.expense-type-select-box'), data[index]?.['expense_type'])
                    loadExpenseTaxList($(this).find('.expense-tax-select-box'), data[index]?.['expense_tax'])
                })
                calculate_price();
            }
        }
    });
}

function APLoadQuotation(data) {
    quotation_mapped_select.initSelect2({
        allowClear: data === null,
        ajax: {
            url: quotation_mapped_select.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (Object.keys(resp.data[keyResp][i]?.['opportunity']).length === 0 && resp.data[keyResp][i].system_status === 3) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'quotation_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        opp_mapped_select.find('option').remove();
        sale_order_mapped_select.find('option').remove();
        if (quotation_mapped_select.val()) {
            opp_mapped_select.prop('disabled', true);
            sale_order_mapped_select.prop('disabled', true);

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
                        APLoadSaleOrder(so_mapped_opp[0]);
                    }
                })

            LoadPlanQuotationNoOPP($(this).val());
        }
        else {
            opp_mapped_select.prop('disabled', false);
            sale_order_mapped_select.prop('disabled', false);
        }
    })
}

function APLoadSaleOrder(data) {
    sale_order_mapped_select.initSelect2({
        allowClear: data === null,
        ajax: {
            url: sale_order_mapped_select.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (Object.keys(resp.data[keyResp][i]?.['opportunity']).length === 0 && resp.data[keyResp][i].system_status === 3) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'sale_order_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        opp_mapped_select.empty();
        quotation_mapped_select.empty();
        if (sale_order_mapped_select.val()) {
            opp_mapped_select.prop('disabled', true);
            quotation_mapped_select.prop('disabled', true);

            let quo_mapped_opp = SelectDDControl.get_data_from_idx(sale_order_mapped_select, sale_order_mapped_select.val())['quotation'];
            APLoadQuotation(quo_mapped_opp)
            LoadPlanSaleOrderNoOPP($(this).val());
        }
        else {
            opp_mapped_select.prop('disabled', false);
            quotation_mapped_select.prop('disabled', false);
        }
    })
}

function APLoadType(data=null) {
    if (data === null) {
        data = [
            {'value': 0, 'title': APTypeEle.attr('data-trans-to-emp')},
            {'value': 1, 'title': APTypeEle.attr('data-trans-to-sup')},
        ]
    }
    APTypeEle.initSelect2({
        data: data,
        keyId: 'value',
        keyText: 'title',
    }).on('change', function () {
        if (APTypeEle.val() === '1') {
            supplierEle.prop('disabled', false);
            $('#supplier-label').addClass('required');
            APLoadSupplier();
        }
        else {
            supplierEle.prop('disabled', true);
            $('#supplier-label').removeClass('required');
        }
    })
}

function APLoadMethod(data=null) {
    if (data === null) {
        data = [
            {'value': 0, 'title': ap_method_Ele.attr('data-trans-cash')},
            {'value': 1, 'title': ap_method_Ele.attr('data-trans-bank-transfer')},
        ]
    }
    ap_method_Ele.initSelect2({
        data: data,
        keyId: 'value',
        keyText: 'title',
    })
}

function InforSpanSupplier(data) {
    let btn_detail = $('#btn-detail-supplier-tab');
    $('#supplier-detail-span').prop('hidden', false);
    $('#supplier-name').text(data?.['name']);
    $('#supplier-code').text(data?.['code']);
    $('#supplier-owner').text(data?.['owner']['fullname']);
    $('#supplier-industry').text(data?.['industry']['title']);
    let url = btn_detail.attr('data-url').replace('0', data?.['id']);
    btn_detail.attr('href', url);
}

function APLoadCreator(data) {
    APCreatorEle.html('');
    APCreatorEle.append(`<option value="${data.id}">${data.full_name}</option>`)
    APCreatorEle.select2();
    APCreatorEle.prop('disabled', true);
    let btn_detail = $('#btn-detail-creator-tab');
    $('#creator-detail-span').prop('hidden', false);
    $('#creator-name').text(data?.['full_name']);
    $('#creator-code').text(data?.['code']);
    $('#creator-department').text(data?.['group']['title']);
    let url = btn_detail.attr('data-url').replace('0', data?.['id']);
    btn_detail.attr('href', url);
}

function APLoadCreatedDate() {
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

function APLoadReturnDate() {
    $('#return_date_id').daterangepicker({
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
    }).val('')
}

function APLoadSupplier(data) {
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
        InforSpanSupplier(obj_selected);
        LoadBankAccount(obj_selected?.['bank_accounts_mapped']);
    })
}

function loadExpenseItem(ele, data) {
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
        $(this).closest('tr').find('.expense-unit-price-input').attr('value', '');
        $(this).closest('tr').find('.expense_quantity').val(1);
        $(this).closest('tr').find('.expense-subtotal-price').attr('value', '');
        $(this).closest('tr').find('.expense-subtotal-price-after-tax').attr('value', '');
    })
}

function loadExpenseTaxList(ele, data) {
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

function calculate_price() {
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
    let total_value_by_words = read_money_vnd(sum_subtotal_price_after_tax)
    total_value_by_words = total_value_by_words.charAt(0).toUpperCase() + total_value_by_words.slice(1)
    if (total_value_by_words[total_value_by_words.length - 1] === ',') {
        total_value_by_words = total_value_by_words.substring(0, total_value_by_words.length - 1) + ' đồng'
    }
    $('#total-value-by-words').val(total_value_by_words)
    $.fn.initMaskMoney2();
}

function changePriceCommon(tr) {
    let unit_price = tr.find('.expense-unit-price-input');
    let quantity = tr.find('.expense_quantity');
    let subtotal = tr.find('.expense-subtotal-price');
    let subtotal_after_tax = tr.find('.expense-subtotal-price-after-tax');
    let tax_rate = 0;
    if (tr.find('.expense-tax-select-box').val()) {
        let tax_selected = JSON.parse($('#' + tr.find('.expense-tax-select-box').attr('data-idx-data-loaded')).text())[tr.find('.expense-tax-select-box').val()];
        tax_rate = tax_selected.rate;
    }
    $.fn.initMaskMoney2();
    if (unit_price.attr('value') && quantity.val()) {
        let subtotal_value = parseFloat(unit_price.attr('value')) * parseInt(quantity.val())
        subtotal.attr('value', subtotal_value);
        subtotal_after_tax.attr('value', subtotal_value + subtotal_value * tax_rate / 100);
    }
    else {
        unit_price.attr('value', '');
        subtotal.attr('value', '');
        subtotal_after_tax.attr('value', '');
    }
    calculate_price();
}

function LoadBankAccount(data) {
    let ele = $('#list-bank-account-information');
    ele.html(``);
    if (data.length > 0) {
        $('#notify-none-bank-account').prop('hidden', true);
        for (let i = 0; i < data.length; i++) {
            let bank_account = data[i];
            let default_card_color = '';
            let checked = '';
            if (bank_account?.['is_default'] === true) {
                default_card_color = 'bg-primary text-dark bg-opacity-10';
                checked = 'checked';
            }
            ele.append(
                `<div class="card ${default_card_color} close-over col-12 col-lg-5 col-md-5 mr-5">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-1">
                                <div class="card-text">
                                    <input disabled class="radio_select_default_bank_account" name="bank_account_default" type="radio" ${checked}>                 
                                </div>
                            </div>
                            <div class="col-11">
                                <div class="card-text">
                                    Bank account name: <span class="bank_account_name"><b>${bank_account?.['bank_account_name']}</b></span>
                                </div>
                                <div class="card-text">
                                    Bank name: <span class="bank_name"><b>${bank_account?.['bank_name']}</b></span>
                                </div>
                                <div class="card-text">
                                    Bank account number: <span class="bank_account_number"><b>${bank_account?.['bank_account_number']}</b></span>
                                </div>
                                <div class="card-text" hidden>
                                    Country ID: <span class="bank_country_id"><b>${bank_account?.['bank_country_id']}</b></span>
                                </div>
                                <div class="card-text" hidden>
                                    Bank code: <span class="bank_code"><b>${bank_account?.['bank_code']}</b></span>
                                </div>
                                <div class="card-text" hidden>
                                    BIC/SWIFT Code: <span class="bic_swift_code"><b>${bank_account?.['bic_swift_code']}</b></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            )
        }
    }
    else {
        $('#notify-none-bank-account').prop('hidden', false);
    }
}

function LoadPlanQuotation(opportunity_id, quotation_id) {
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

        let dataParam2 = {'opportunity_mapped_id': opportunity_id}
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

        let dataParam3 = {'opportunity_mapped_id': opportunity_id}
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
                let data_ap_mapped_item = results[1];
                let data_payment_mapped_item = results[2];
                $('#notify-none-sale-code').prop('hidden', true);
                tab_plan_datatable.prop('hidden', false);
                tab_plan_datatable.find('tbody').html(``);
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
                    tab_plan_datatable_tbody.append(`
                        <tr>
                            <td>${i+1}</td>
                            <td class="expense_item_title text-primary" data-id="${data_expense[i]?.['id']}" data-expense-id="${data_expense[i]?.['expense_item']?.['id']}">${data_expense[i]?.['expense_item']?.['title']}</td>
                            <td><span class="plan_after_tax mask-money text-primary" data-init-money="${data_expense[i]?.['plan_after_tax']}"></span></td>
                            <td><span class="ap_approved mask-money text-primary" data-init-money="${ap_approved_value}"></span></td>
                            <td><span class="returned mask-money text-primary" data-init-money="${sum_return_value}"></span></td>
                            <td><span class="to_payment mask-money text-primary" data-init-money="${sum_converted_value}"></span></td>
                            <td><span class="other_payment mask-money text-primary" data-init-money="${sum_real_value}"></span></td>
                            <td><span class="available mask-money text-primary" data-init-money="${sum_available}"></span></td>
                        </tr>
                    `)
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
                    tab_plan_datatable_tbody.append(`<tr><td colspan="8" class="text-secondary"><b>${script_url.attr("data-trans-unplanned")}</b></td></tr>`)
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
                        tab_plan_datatable_tbody.append(`
                            <tr>
                                <td>${$('#tab_plan_datatable tbody tr').length}</td>
                                <td class="text-danger" data-expense-id="${unplanned_ap_merged[i]?.['expense_type']?.['id']}">${unplanned_ap_merged[i]?.['expense_type']?.['title']}</td>
                                <td>--</td>
                                <td><span class="mask-money text-danger" data-init-money="${unplanned_ap_merged[i]?.['expense_after_tax_price']}"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="${unplanned_ap_merged[i]?.['sum_return_value']}"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="${unplanned_sum_converted_value}"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="${unplanned_sum_real_value}"></span></td>
                                <td>--</td>
                            </tr>
                        `)
                    }
                    for (let i = 0; i < unplanned_payment_merged.length; i++) {
                        if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                            tab_plan_datatable_tbody.append(`
                                <tr>
                                    <td>${$('#tab_plan_datatable tbody tr').length}</td>
                                    <td class="text-danger" data-expense-id="${unplanned_payment_merged[i]?.['expense_type']?.['id']}">${unplanned_payment_merged[i]?.['expense_type']?.['title']}</td>
                                    <td>--</td>
                                    <td><span class="mask-money text-danger" data-init-money="0"></span></td>
                                    <td><span class="mask-money text-danger" data-init-money="0"></span></td>
                                    <td><span class="mask-money text-danger" data-init-money="${unplanned_payment_merged[i]?.['converted_value']}"></span></td>
                                    <td><span class="mask-money text-danger" data-init-money="${unplanned_payment_merged[i]?.['real_value']}"></span></td>
                                    <td>--</td>
                                </tr>
                            `)
                        }
                    }
                }
                $.fn.initMaskMoney2();
            })
    }
}

function LoadPlanQuotationNoOPP(quotation_id) {
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
                let data_ap_mapped_item = results[1];
                let data_payment_mapped_item = results[2];

                $('#notify-none-sale-code').prop('hidden', true);
                tab_plan_datatable.prop('hidden', false);
                tab_plan_datatable.find('tbody').html(``);
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
                    tab_plan_datatable_tbody.append(`
                        <tr>
                            <td>${i+1}</td>
                            <td class="expense_item_title text-primary" data-id="${data_expense[i]?.['id']}" data-expense-id="${data_expense[i]?.['expense_item']?.['id']}">${data_expense[i]?.['expense_item']?.['title']}</td>
                            <td><span class="plan_after_tax mask-money text-primary" data-init-money="${data_expense[i]?.['plan_after_tax']}"></span></td>
                            <td><span class="ap_approved mask-money text-primary" data-init-money="${ap_approved_value}"></span></td>
                            <td><span class="returned mask-money text-primary" data-init-money="${sum_return_value}"></span></td>
                            <td><span class="to_payment mask-money text-primary" data-init-money="${sum_converted_value}"></span></td>
                            <td><span class="other_payment mask-money text-primary" data-init-money="${sum_real_value}"></span></td>
                            <td><span class="available mask-money text-primary" data-init-money="${sum_available}"></span></td>
                        </tr>
                    `)
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
                    tab_plan_datatable_tbody.append(`<tr><td colspan="8" class="text-secondary"><b>${script_url.attr("data-trans-unplanned")}</b></td></tr>`)
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
                        tab_plan_datatable_tbody.append(`
                        <tr>
                            <td>${$('#tab_plan_datatable tbody tr').length}</td>
                            <td class="text-danger" data-expense-id="${unplanned_ap_merged[i]?.['expense_type']?.['id']}">${unplanned_ap_merged[i]?.['expense_type']?.['title']}</td>
                            <td>--</td>
                            <td><span class="mask-money text-danger" data-init-money="${unplanned_ap_merged[i]?.['expense_after_tax_price']}"></span></td>
                            <td><span class="mask-money text-danger" data-init-money="${unplanned_ap_merged[i]?.['sum_return_value']}"></span></td>
                            <td><span class="mask-money text-danger" data-init-money="${unplanned_sum_converted_value}"></span></td>
                            <td><span class="mask-money text-danger" data-init-money="${unplanned_sum_real_value}"></span></td>
                            <td>--</td>
                        </tr>
                    `)
                    }
                    for (let i = 0; i < unplanned_payment_merged.length; i++) {
                        if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                            tab_plan_datatable_tbody.append(`
                            <tr>
                                <td>${$('#tab_plan_datatable tbody tr').length}</td>
                                <td class="text-danger" data-expense-id="${unplanned_payment_merged[i]?.['expense_type']?.['id']}">${unplanned_payment_merged[i]?.['expense_type']?.['title']}</td>
                                <td>--</td>
                                <td><span class="mask-money text-danger" data-init-money="0"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="0"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="${unplanned_payment_merged[i]?.['converted_value']}"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="${unplanned_payment_merged[i]?.['real_value']}"></span></td>
                                <td>--</td>
                            </tr>
                        `)
                        }
                    }
                }
                $.fn.initMaskMoney2();
            })
    }
}

function LoadPlanSaleOrderNoOPP(sale_order_id) {
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

                let data_ap_mapped_item = results[1];
                let data_payment_mapped_item = results[2];
                $('#notify-none-sale-code').prop('hidden', true);
                tab_plan_datatable.prop('hidden', false);
                tab_plan_datatable.find('tbody').html(``);
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
                    tab_plan_datatable_tbody.append(`
                        <tr>
                            <td>${i+1}</td>
                            <td class="expense_item_title text-primary" data-id="${data_expense[i]?.['id']}" data-expense-id="${data_expense[i]?.['expense_item']?.['id']}">${data_expense[i]?.['expense_item']?.['title']}</td>
                            <td><span class="plan_after_tax mask-money text-primary" data-init-money="${data_expense[i]?.['plan_after_tax']}"></span></td>
                            <td><span class="ap_approved mask-money text-primary" data-init-money="${ap_approved_value}"></span></td>
                            <td><span class="returned mask-money text-primary" data-init-money="${sum_return_value}"></span></td>
                            <td><span class="to_payment mask-money text-primary" data-init-money="${sum_converted_value}"></span></td>
                            <td><span class="other_payment mask-money text-primary" data-init-money="${sum_real_value}"></span></td>
                            <td><span class="available mask-money text-primary" data-init-money="${sum_available}"></span></td>
                        </tr>
                    `)
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
                    tab_plan_datatable_tbody.append(`<tr><td colspan="8" class="text-secondary"><b>${script_url.attr("data-trans-unplanned")}</b></td></tr>`)
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
                        tab_plan_datatable_tbody.append(`
                        <tr>
                            <td>${$('#tab_plan_datatable tbody tr').length}</td>
                            <td class="text-danger" data-expense-id="${unplanned_ap_merged[i]?.['expense_type']?.['id']}">${unplanned_ap_merged[i]?.['expense_type']?.['title']}</td>
                            <td>--</td>
                            <td><span class="mask-money text-danger" data-init-money="${unplanned_ap_merged[i]?.['expense_after_tax_price']}"></span></td>
                            <td><span class="mask-money text-danger" data-init-money="${unplanned_ap_merged[i]?.['sum_return_value']}"></span></td>
                            <td><span class="mask-money text-danger" data-init-money="${unplanned_sum_converted_value}"></span></td>
                            <td><span class="mask-money text-danger" data-init-money="${unplanned_sum_real_value}"></span></td>
                            <td>--</td>
                        </tr>
                    `)
                    }
                    for (let i = 0; i < unplanned_payment_merged.length; i++) {
                        if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                            tab_plan_datatable_tbody.append(`
                            <tr>
                                <td>${$('#tab_plan_datatable tbody tr').length}</td>
                                <td class="text-danger" data-expense-id="${unplanned_payment_merged[i]?.['expense_type']?.['id']}">${unplanned_payment_merged[i]?.['expense_type']?.['title']}</td>
                                <td>--</td>
                                <td><span class="mask-money text-danger" data-init-money="0"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="0"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="${unplanned_payment_merged[i]?.['converted_value']}"></span></td>
                                <td><span class="mask-money text-danger" data-init-money="${unplanned_payment_merged[i]?.['real_value']}"></span></td>
                                <td>--</td>
                            </tr>
                        `)
                        }
                    }
                }
                $.fn.initMaskMoney2();
            })
    }
}

function addRow(table, data) {
    table.DataTable().row.add(data).draw();
}

function deleteRow(table, currentRow) {
    currentRow = parseInt(currentRow) - 1
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    row.remove().draw();
}

$(document).on("click", '#btn-add-row-line-detail', function () {
    addRow(tableLineDetail, {})
    let row_added = tableLineDetail.find('tbody tr:last-child')
    loadExpenseItem(row_added.find('.expense-type-select-box'))
    loadExpenseTaxList(row_added.find('.expense-tax-select-box'))
    // let table_body = $('#tab_line_detail_datatable tbody');
    // table_body.append(`<tr id="" class="row-number">
    //     <td class="number text-center"></td>
    //     <td><input class="form-control expense-name-input"></td>
    //     <td><select class="form-select expense-type-select-box"></select></td>
    //     <td><input class="form-control expense-uom-input"></td>
    //     <td><input type="number" min="1" class="form-control expense_quantity" value="1"></td>
    //     <td><input data-return-type="number" type="text" class="form-control expense-unit-price-input mask-money"></td>
    //     <td><select class="form-select expense-tax-select-box" data-method="GET"><option selected></option></select></td>
    //     <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money zone-readonly" disabled></td>
    //     <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money zone-readonly" disabled></td>
    //     <td><button class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="far fa-trash-alt"></i></span></button></td>
    // </tr>`);
    //
    // $.fn.initMaskMoney2();
    //
    // let row_number = count_row(table_body, 1);
    //
    //
    // $('.btn-del-line-detail').on('click', function () {
    //     $(this).closest('tr').remove();
    //     count_row(table_body, 2);
    //     calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
    // });
});

$(document).on("click", '.btn-del-line-detail', function () {
    deleteRow(tableLineDetail, parseInt($(this).find('td:first-child').text()))
    calculate_price();
});

$(document).on("change", '.expense-unit-price-input', function () {
    changePriceCommon($(this).closest('tr'));
})

$(document).on("change", '.expense-tax-select-box', function () {
    changePriceCommon($(this).closest('tr'));
})

$(document).on("change", '.expense_quantity', function () {
    changePriceCommon($(this).closest('tr'));
})

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('readonly', true);
        $('.form-select').prop('disabled', true);
        $('.select2').prop('disabled', true);
        $('input').prop('disabled', true);
        $('.del-address-item').prop('hidden', true);
        $('.card-close').addClass('disabled').prop('hidden', true);
        $('#btn-add-row-line-detail').prop('disabled', true);
        $('.btn-del-line-detail').prop('disabled', true);
        $('.btn-choose-from-price-list').prop('disabled', true);
    }
}

function LoadDetailAP(option) {
    let url_loaded = $('#form-detail-advance').attr('data-url');
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['advance_payment_detail'];
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                new PrintTinymceControl().render('57725469-8b04-428a-a4b0-578091d0e4f5', data, false);
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                if (Object.keys(data?.['opportunity_mapped']).length !== 0 && Object.keys(data?.['employee_inherit']).length !== 0) {
                    new $x.cls.bastionField({
                        has_opp: true,
                        has_inherit: true,
                        data_inherit: [{
                            "id": data?.['employee_inherit']?.['id'],
                            "full_name": data?.['employee_inherit']?.['full_name'] || '',
                            "first_name": data?.['employee_inherit']?.['first_name'] || '',
                            "last_name": data?.['employee_inherit']?.['last_name'] || '',
                            "email": data?.['employee_inherit']?.['email'] || '',
                            "is_active": data?.['employee_inherit']?.['is_active'] || false,
                            "selected": true,
                        }],
                        data_opp: [{
                            "id": data?.['opportunity_mapped']?.['id'] || '',
                            "title": data?.['opportunity_mapped']?.['title'] || '',
                            "code": data?.['opportunity_mapped']?.['code'] || '',
                            "selected": true,
                        }]
                    }).init();
                    APLoadQuotation(data?.['opportunity_mapped']?.['quotation_mapped'])
                    LoadPlanQuotation(opp_mapped_select.val(), data?.['opportunity_mapped']?.['quotation_mapped']?.['id'])
                }
                else if (Object.keys(data?.['quotation_mapped']).length !== 0) {
                    new $x.cls.bastionField({
                        has_opp: false,
                        has_inherit: true,
                        data_inherit: [{
                            "id": data?.['employee_inherit']?.['id'],
                            "full_name": data?.['employee_inherit']?.['full_name'] || '',
                            "first_name": data?.['employee_inherit']?.['first_name'] || '',
                            "last_name": data?.['employee_inherit']?.['last_name'] || '',
                            "email": data?.['employee_inherit']?.['email'] || '',
                            "is_active": data?.['employee_inherit']?.['is_active'] || false,
                            "selected": true,
                        }],
                    }).init();
                    APLoadQuotation(data?.['quotation_mapped'])

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
                                APLoadSaleOrder(so_mapped_opp[0]);
                            }
                        })

                    LoadPlanQuotationNoOPP(data?.['quotation_mapped']?.['id'])
                }
                else if (Object.keys(data?.['sale_order_mapped']).length !== 0) {
                    new $x.cls.bastionField({
                        has_opp: false,
                        has_inherit: true,
                        data_inherit: [{
                            "id": data?.['employee_inherit']?.['id'],
                            "full_name": data?.['employee_inherit']?.['full_name'] || '',
                            "first_name": data?.['employee_inherit']?.['first_name'] || '',
                            "last_name": data?.['employee_inherit']?.['last_name'] || '',
                            "email": data?.['employee_inherit']?.['email'] || '',
                            "is_active": data?.['employee_inherit']?.['is_active'] || false,
                            "selected": true,
                        }],
                    }).init();
                    APLoadSaleOrder(data?.['sale_order_mapped'])
                    APLoadQuotation(data?.['sale_order_mapped']?.['quotation_mapped'])

                    LoadPlanSaleOrderNoOPP(data?.['sale_order_mapped']?.['id'])
                }

                $('#title').val(data.title);

                let plan_dtb = tab_plan_datatable;
                plan_dtb.DataTable().clear().destroy();
                plan_dtb.prop('hidden', true);
                $('#notify-none-sale-code').prop('hidden', false);

                APTypeEle.val(data.advance_payment_type);
                APLoadType({
                    'value': data.advance_payment_type,
                    'title': [
                        APTypeEle.attr('data-trans-to-emp'),
                        APTypeEle.attr('data-trans-to-sup')
                    ][data.advance_payment_type]
                })

                APLoadSupplier(data.supplier);

                APLoadMethod({
                    'value': data.method,
                    'title': [
                        ap_method_Ele.attr('data-trans-cash'),
                        ap_method_Ele.attr('data-trans-bank-transfer')
                    ][data.method]
                })

                $('#created_date_id').val(data.date_created.split(' ')[0]).prop('readonly', true)

                $('#return_date_id').val(data.return_date.split(' ')[0])

                APLoadCreator(data.creator_name);

                if (Object.keys(data?.['supplier']).length !== 0) {
                    APLoadSupplier(data?.['supplier'])
                    InforSpanSupplier(data?.['supplier']);
                    LoadBankAccount(data?.['supplier']?.['bank_accounts_mapped']);
                }

                loadLineDetailTable(data?.['expense_items'])

                money_gave.prop('disabled', data?.['money_gave']);
                money_gave.prop('checked', data?.['money_gave']);

                $.fn.initMaskMoney2();

                new $x.cls.file($('#attachment')).init({
                    enable_edit: option !== 'detail',
                    data: data.attachment,
                })

                Disable(option);
                quotation_mapped_select.attr('disabled', true);
                sale_order_mapped_select.attr('disabled', true);
            }
        })
}

class AdvancePaymentHandle {
    async load(sale_code_mapped, type, quotation_object, sale_order_object) {
        APLoadCreatedDate();
        APLoadReturnDate();
        APLoadCreator(initEmployee);
        APLoadSupplier();
        APLoadQuotation();
        APLoadSaleOrder();
        APLoadType();
        APLoadMethod();
        loadLineDetailTable()
        if (sale_code_mapped) {
            if (type === 0) {
                await opp_mapped_select.initSelect2({
                    data: sale_code_mapped,
                    allowClear: true,
                }).promise();
                opp_mapped_select.val(sale_code_mapped.id).attr('disabled', true);
                tableLineDetail.find('tbody').html('');
                quotation_mapped_select.find('option').remove();
                sale_order_mapped_select.find('option').remove();
                quotation_mapped_select.prop('disabled', true);
                sale_order_mapped_select.prop('disabled', true);

                APLoadQuotation(quotation_object)
                APLoadSaleOrder(sale_order_object)

                LoadPlanQuotation(opp_mapped_select.val(), quotation_object?.['id'])
            }
        }
    }
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();

        frm.dataForm['supplier'] = supplierEle.val();

        frm.dataForm['advance_payment_type'] = parseInt(APTypeEle.val())

        frm.dataForm['method'] = parseInt(ap_method_Ele.val());

        frm.dataForm['return_date'] = $('#return_date_id').val();

        frm.dataForm['creator_name'] = APCreatorEle.val();
        if (!frm.dataForm['creator_name']) {
            $.fn.notifyB({description: 'Creator name must not be NULL'}, 'failure');
            return false;
        }

        if (!for_update) {
            frm.dataForm['sale_code_type'] = 0;
            let opportunity_mapped = opp_mapped_select.val();
            let quotation_mapped = quotation_mapped_select.val();
            let sale_order_mapped = sale_order_mapped_select.val();
            if (opp_mapped_select.prop('disabled') && quotation_mapped_select.prop('disabled') && sale_order_mapped_select.prop('disabled')) {
                const urlParams = new URLSearchParams(window.location.search);
                let type = urlParams.get('type');
                if (type) {
                    if (opportunity_mapped && type === '0') {
                        frm.dataForm['opportunity_mapped'] = opp_mapped_select.val();
                    } else if (quotation_mapped && type === '1') {
                        frm.dataForm['quotation_mapped'] = quotation_mapped_select.val();
                    } else if (sale_order_mapped && type === '2') {
                        frm.dataForm['sale_order_mapped'] = sale_order_mapped_select.val();
                    } else {
                        $.fn.notifyB({description: 'Sale code must not be NULL.'}, 'failure');
                        return false;
                    }
                }
            } else {
                if (opportunity_mapped && !opp_mapped_select.prop('disabled')) {
                    frm.dataForm['opportunity_mapped'] = opp_mapped_select.val();
                } else if (quotation_mapped && !quotation_mapped_select.prop('disabled')) {
                    frm.dataForm['quotation_mapped'] = quotation_mapped_select.val();
                } else if (sale_order_mapped && !sale_order_mapped_select.prop('disabled')) {
                    frm.dataForm['sale_order_mapped'] = sale_order_mapped_select.val();
                } else {
                    frm.dataForm['sale_code_type'] = 2;
                }
            }

            frm.dataForm['employee_inherit'] = $('#employee_inherit_id').val();
            if (frm.dataForm['employee_inherit'] === '') {
                $.fn.notifyB({description: 'Employee Inherit must not be NULL'}, 'failure');
                return false;
            }
        }

        let expense_valid_list = [];
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
                expense_valid_list.push({
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

        frm.dataForm['expense_valid_list'] = expense_valid_list;
        frm.dataForm['money_gave'] = money_gave.prop('checked');
        frm.dataForm['status'] = frm.dataForm['money_gave'];

        // console.log(frm)
        return frm
    }
}
