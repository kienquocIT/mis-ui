const initEmployee = JSON.parse($('#employee_current').text());
let APCreatorEle = $('#creator-select-box')
let APTypeEle = $('#type-select-box')
let supplierEle = $('#supplier-select-box')
let tableLineDetail = $('#tab_line_detail_datatable')
let money_gave = $('#money-gave')
let quotation_mapped_select = $('#quotation_mapped_select')
let sale_order_mapped_select = $('#sale_order_mapped_select')
let opp_mapped_select = $('#opportunity_id')
let script_url = $('#script-url')
let tab_plan_datatable = $('#tab_plan_datatable')

$('#input-file-now').dropify({
    messages: {
        'default': 'Drag and drop your file here.',
    },
    tpl: {
        message: '<div class="dropify-message">' +
            '<span class="file-icon"></span>' +
            '<h5>{{ default }}</h5>' +
            '</div>',
    }
});

APTypeEle.on('change', function () {
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

opp_mapped_select.on('change', function () {
    quotation_mapped_select.find('option').remove();
    sale_order_mapped_select.find('option').remove();

    if (opp_mapped_select.val() !== null) {
        sale_order_mapped_select.prop('disabled', true);
        quotation_mapped_select.prop('disabled', true);

        let quo_mapped_opp = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())['quotation'];
        let so_mapped_opp = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())['sale_order'];
        APLoadQuotation(quo_mapped_opp)
        LoadPlanQuotation(opp_mapped_select.val(), quo_mapped_opp?.['id'])
        APLoadSaleOrder(so_mapped_opp);
    }
    else {
        quotation_mapped_select.prop('disabled', false);
        sale_order_mapped_select.prop('disabled', false);
    }
})

function APLoadQuotation(data) {
    quotation_mapped_select.initSelect2({
        allowClear: true,
        ajax: {
            url: quotation_mapped_select.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (Object.keys(resp.data[keyResp][i]?.['opportunity']).length === 0) {
                    result.push(resp.data[keyResp][i])
                }
            }
            if (result.length > 0) {
                $('.select2-results__message').prop('hidden', true);
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
        if (quotation_mapped_select.val() !== null) {
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
        allowClear: true,
        ajax: {
            url: sale_order_mapped_select.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (Object.keys(resp.data[keyResp][i]?.['opportunity']).length === 0) {
                    result.push(resp.data[keyResp][i])
                }
            }
            if (result.length > 0) {
                $('.select2-results__message').prop('hidden', true);
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'sale_order_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        opp_mapped_select.find('option').remove();
        quotation_mapped_select.find('option').remove();
        if (sale_order_mapped_select.val() !== null) {
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
    $('#created_date_id').dateRangePickerDefault({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'),10)
    }).prop('disabled', true);
}

function APLoadReturnDate() {
    $('#return_date_id').dateRangePickerDefault({
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
    }).val('').prop('readonly', true);
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

function count_row(table_body, option) {
    let count = 0;
    table_body.find('tr td.number').each(function() {
        count = count + 1;
        $(this).text(count);
        $(this).closest('tr').attr('id', 'row-' + count.toString())
    });
    if (option === 1) {
        loadExpenseType('row-' + count.toString());
        loadExpenseTaxList('row-' + count.toString());
    }
    return count;
}

function loadExpenseType(row_id, data) {
    let ele = $('#' + row_id + ' .expense-type-select-box');
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
        let parent_tr = $(this).closest('tr');
        $('#' + parent_tr.attr('id') + ' .expense-unit-price-input').attr('value', '');
        $('#' + parent_tr.attr('id') + ' .expense_quantity').val(1);
        $('#' + parent_tr.attr('id') + ' .expense-subtotal-price').attr('value', '');
        $('#' + parent_tr.attr('id') + ' .expense-subtotal-price-after-tax').attr('value', '');
    })
}

function loadExpenseTaxList(row_id, data) {
    let ele = $('#' + row_id + ' .expense-tax-select-box');
    ele.initSelect2({
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

function calculate_price(table_body, pretax_div, taxes_div, total_div) {
    let row_count = table_body.find('tr').length;
    let sum_subtotal = 0;
    let sum_subtotal_price_after_tax = 0;
    let sum_tax = 0;
    for (let i = 1; i <= row_count; i++) {
        let row_id = '#row-' + i.toString();
        let subtotal = parseFloat(table_body.find(row_id + ' .expense-subtotal-price').attr('value'));
        let subtotal_after_tax = parseFloat(table_body.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));
        let tax_rate = 0;
        if (table_body.find(row_id + ' .expense-tax-select-box').val()) {
            let tax_selected = JSON.parse($('#' + table_body.find(row_id + ' .expense-tax-select-box').attr('data-idx-data-loaded')).text())[table_body.find(row_id + ' .expense-tax-select-box').val()];
            tax_rate = tax_selected.rate;
        }
        if (!isNaN(subtotal) && !isNaN(subtotal_after_tax)) {
            sum_subtotal = sum_subtotal + subtotal;
            sum_subtotal_price_after_tax = sum_subtotal_price_after_tax + subtotal_after_tax;
            sum_tax = sum_tax + subtotal * tax_rate / 100;
        }
    }
    pretax_div.attr('data-init-money', sum_subtotal);
    taxes_div.attr('data-init-money', sum_tax);
    total_div.attr('data-init-money', sum_subtotal_price_after_tax);
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
    calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
}

function changePrice(row_id) {
    $('#' + row_id + ' .expense-unit-price-input').on('change', function () {
        changePriceCommon($(this).closest('tr'));
    })
    $('#' + row_id + ' .expense-tax-select-box').on('change', function () {
        changePriceCommon($(this).closest('tr'));
    })
    $('#' + row_id + ' .expense_quantity').on('change', function () {
        changePriceCommon($(this).closest('tr'));
    })
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
                `<div class="card ${default_card_color} close-over col-5 mr-5">
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
    if (opportunity_id !== null && opportunity_id !== undefined && quotation_id !== null && quotation_id !== undefined) {
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

        Promise.all([expense_quotation, ap_mapped_item]).then(
            (results) => {
                let data_expense = results[0];
                let data_ap_mapped_item = results[1];
                console.log(data_expense)
                console.log(data_ap_mapped_item)

                $('#notify-none-sale-code').prop('hidden', true);
                tab_plan_datatable.prop('hidden', false);
                tab_plan_datatable.find('tbody').html(``);
                for (let i = 0; i < data_expense.length; i++) {
                    let ap_approved_value = 0;
                    let sum_return_value = 0;
                    let sum_converted_value = 0;
                    let sum_real_value = 0;
                    let number_record = 0;
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                            ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                            sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                            sum_converted_value += data_ap_mapped_item[j]?.['sum_converted_value'];
                            sum_real_value += data_ap_mapped_item[j]?.['sum_real_value'];
                            number_record += 1;
                        }
                    }
                    if (number_record > 0) {
                        sum_real_value = sum_real_value / number_record;
                    }
                    let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                    if (sum_available < 0) {
                        sum_available = 0;
                    }

                    $('#tab_plan_datatable tbody').append(`
                        <tr>
                            <td>${i+1}</td>
                            <td class="expense_item_title" data-id="${data_expense[i]?.['expense_item']?.['id']}">${data_expense[i]?.['expense_item']?.['title']}</td>
                            <td><span class="plan_after_tax mask-money text-primary" data-init-money="${data_expense[i]?.['plan_after_tax']}"></span></td>
                            <td><span class="ap_approved mask-money text-primary" data-init-money="${ap_approved_value}"></span></td>
                            <td><span class="returned mask-money text-primary" data-init-money="${sum_return_value}"></span></td>
                            <td><span class="to_payment mask-money text-primary" data-init-money="${sum_converted_value}"></span></td>
                            <td><span class="other_payment mask-money text-primary" data-init-money="${sum_real_value}"></span></td>
                            <td><span class="available mask-money text-primary" data-init-money="${sum_available}"></span></td>
                        </tr>
                    `)
                }
                $.fn.initMaskMoney2();
            })
    }
}

function LoadPlanQuotationNoOPP(quotation_id) {
    if (quotation_id !== null && quotation_id !== undefined) {
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

        Promise.all([expense_quotation, ap_mapped_item]).then(
            (results) => {
                let data_expense = results[0];
                let data_ap_mapped_item = results[1];

                $('#notify-none-sale-code').prop('hidden', true);
                tab_plan_datatable.prop('hidden', false);
                tab_plan_datatable.find('tbody').html(``);
                for (let i = 0; i < data_expense.length; i++) {
                    let ap_approved_value = 0;
                    let sum_return_value = 0;
                    let sum_converted_value = 0;
                    let sum_real_value = 0;
                    let number_record = 0;
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                            ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                            sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                            sum_converted_value += data_ap_mapped_item[j]?.['sum_converted_value'];
                            sum_real_value += data_ap_mapped_item[j]?.['sum_real_value'];
                            number_record += 1;
                        }
                    }
                    if (number_record > 0) {
                        sum_real_value = sum_real_value / number_record;
                    }
                    let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                    if (sum_available < 0) {
                        sum_available = 0;
                    }

                    $('#tab_plan_datatable tbody').append(`
                        <tr>
                            <td>${i+1}</td>
                            <td class="expense_item_title" data-id="${data_expense[i]?.['expense_item']?.['id']}">${data_expense[i]?.['expense_item']?.['title']}</td>
                            <td><span class="plan_after_tax mask-money text-primary" data-init-money="${data_expense[i]?.['plan_after_tax']}"></span></td>
                            <td><span class="ap_approved mask-money text-primary" data-init-money="${ap_approved_value}"></span></td>
                            <td><span class="returned mask-money text-primary" data-init-money="${sum_return_value}"></span></td>
                            <td><span class="to_payment mask-money text-primary" data-init-money="${sum_converted_value}"></span></td>
                            <td><span class="other_payment mask-money text-primary" data-init-money="${sum_real_value}"></span></td>
                            <td><span class="available mask-money text-primary" data-init-money="${sum_available}"></span></td>
                        </tr>
                    `)
                }
                $.fn.initMaskMoney2();
            })
    }
}

function LoadPlanSaleOrderNoOPP(sale_order_id) {
    if (sale_order_id !== null && sale_order_id !== undefined) {
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

        Promise.all([expense_sale_order, ap_mapped_item]).then(
            (results) => {
                let data_expense = results[0];
                let data_ap_mapped_item = results[1];

                $('#notify-none-sale-code').prop('hidden', true);
                tab_plan_datatable.prop('hidden', false);
                tab_plan_datatable.find('tbody').html(``);
                for (let i = 0; i < data_expense.length; i++) {
                    let ap_approved_value = 0;
                    let sum_return_value = 0;
                    let sum_converted_value = 0;
                    let sum_real_value = 0;
                    let number_record = 0;
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                            ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                            sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                            sum_converted_value += data_ap_mapped_item[j]?.['sum_converted_value'];
                            sum_real_value += data_ap_mapped_item[j]?.['sum_real_value'];
                            number_record += 1;
                        }
                    }
                    if (number_record > 0) {
                        sum_real_value = sum_real_value / number_record;
                    }
                    let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                    if (sum_available < 0) {
                        sum_available = 0;
                    }

                    $('#tab_plan_datatable tbody').append(`
                        <tr>
                            <td>${i+1}</td>
                            <td class="expense_item_title" data-id="${data_expense[i]?.['expense_item']?.['id']}">${data_expense[i]?.['expense_item']?.['title']}</td>
                            <td><span class="plan_after_tax mask-money text-primary" data-init-money="${data_expense[i]?.['plan_after_tax']}"></span></td>
                            <td><span class="ap_approved mask-money text-primary" data-init-money="${ap_approved_value}"></span></td>
                            <td><span class="returned mask-money text-primary" data-init-money="${sum_return_value}"></span></td>
                            <td><span class="to_payment mask-money text-primary" data-init-money="${sum_converted_value}"></span></td>
                            <td><span class="other_payment mask-money text-primary" data-init-money="${sum_real_value}"></span></td>
                            <td><span class="available mask-money text-primary" data-init-money="${sum_available}"></span></td>
                        </tr>
                    `)
                }
                $.fn.initMaskMoney2();
            })
    }
}

$(document).on("click", '#btn-add-row-line-detail', function () {
    let table_body = $('#tab_line_detail_datatable tbody');
    table_body.append(`<tr id="" class="row-number">
        <td class="number text-center"></td>
        <td><input class="form-control expense-name-input"></td>
        <td><select class="form-select expense-type-select-box"></select></td>
        <td><input class="form-control expense-uom-input"></td>
        <td><input type="number" min="1" class="form-control expense_quantity" value="1"></td>
        <td><input data-return-type="number" type="text" class="form-control expense-unit-price-input mask-money"></td>
        <td><select class="form-select expense-tax-select-box" data-method="GET"><option selected></option></select></td>
        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money" style="color: black; background: none" disabled></td>
        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money" style="color: black; background: none" disabled></td>
        <td><button class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
    </tr>`);

    $.fn.initMaskMoney2();

    let row_number = count_row(table_body, 1);

    changePrice('row-' + row_number);

    $('.btn-del-line-detail').on('click', function () {
        $(this).closest('tr').remove();
        count_row(table_body, 2);
        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
    });
});

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
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
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-advance').attr('data-url-detail').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['advance_payment_detail']?.['workflow_runtime_id']);
                data = data['advance_payment_detail'];
                console.log(data)
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

                APLoadSupplier(data.supplier);

                $('#ap-method').val(data.method);

                $('#created_date_id').val(data.date_created.split(' ')[0])

                $('#return_date_id').val(data.return_date.split(' ')[0])

                APLoadCreator(data.creator_name);

                if (Object.keys(data?.['supplier']).length !== 0) {
                    APLoadSupplier(data?.['supplier'])
                    InforSpanSupplier(data?.['supplier']);
                    LoadBankAccount(data?.['supplier']?.['bank_accounts_mapped']);
                }

                let table_body = $('#tab_line_detail_datatable tbody');
                for (let i = 0; i < data?.['expense_items'].length; i++) {
                    table_body.append(`<tr id="" class="row-number">
                        <td class="number text-center"></td>
                        <td><input class="form-control expense-name-input"></td>
                        <td><select class="form-select expense-type-select-box"></select></td>
                        <td><input class="form-control expense-uom-input"></td>
                        <td><input type="number" min="1" class="form-control expense_quantity" value="1"></td>
                        <td><input data-return-type="number" type="text" class="form-control expense-unit-price-input mask-money"></td>
                        <td><select class="form-select expense-tax-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money" disabled></td>
                        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money" disabled></td>
                        <td><button class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                    </tr>`);
                    $.fn.initMaskMoney2();
                    count_row(table_body, 1);
                    $('.btn-del-line-detail').on('click', function () {
                        $(this).closest('tr').remove();
                        count_row(table_body, 2);
                        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                    })
                    let row_id = 'row-' + (i + 1);
                    let rowEle = $('#' + row_id);
                    let data_row = data?.['expense_items'][i];
                    loadExpenseType(row_id, data_row['expense_type']);
                    loadExpenseTaxList(row_id, data_row['expense_tax'] ? data_row['expense_tax'] : null);
                    rowEle.find('.expense-name-input').val(data_row['expense_name']);
                    rowEle.find('.expense-uom-input').val(data_row['expense_uom_name']);
                    rowEle.find('.expense_quantity').val(data_row['expense_quantity']);
                    rowEle.find('.expense-unit-price-input').attr('value', data_row['expense_unit_price']);
                    rowEle.find('.expense-subtotal-price').attr('value', data_row['expense_subtotal_price']);
                    rowEle.find('.expense-subtotal-price-after-tax').attr('value', data_row['expense_after_tax_price']);
                }

                calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));

                money_gave.prop('checked', data?.['money_gave']);

                $.fn.initMaskMoney2();

                Disable(option);

                money_gave.prop('disabled', data?.['money_gave']);
            }
        })
}

class AdvancePaymentHandle {
    load(opp_obj) {
        APLoadCreatedDate();
        APLoadReturnDate();
        APLoadCreator(initEmployee);
        APLoadSupplier();
        APLoadQuotation();
        APLoadSaleOrder();
    }
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        if (for_update) {
            frm.dataForm['money_gave'] = money_gave.is(':checked');
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }

        frm.dataForm['title'] = $('#title').val();

        frm.dataForm['supplier'] = supplierEle.val();

        frm.dataForm['advance_payment_type'] = parseInt(APTypeEle.val())
        if (![0, 1].includes(frm.dataForm['advance_payment_type'])) {
            $.fn.notifyB({description: 'Advance Payment type must be in [0, 1, 2]'}, 'failure');
            return false;
        }

        if (frm.dataForm['advance_payment_type'] === 1 && frm.dataForm['supplier'] === null) {
            $.fn.notifyB({description: 'Supplier is required.'}, 'failure');
            return false;
        }

        frm.dataForm['method'] = parseInt($('#ap-method').val());
        if (![0, 1].includes(frm.dataForm['method'])) {
            $.fn.notifyB({description: 'Method must be in [0, 1]'}, 'failure');
            return false;
        }

        frm.dataForm['return_date'] = $('#return_date_id').val();

        frm.dataForm['creator_name'] = APCreatorEle.val();
        if (frm.dataForm['creator_name'] === null) {
            $.fn.notifyB({description: 'Creator name must not be NULL'}, 'failure');
            return false;
        }

        frm.dataForm['sale_code_type'] = 0;
        let opportunity_mapped = opp_mapped_select.val();
        let quotation_mapped = quotation_mapped_select.val();
        let sale_order_mapped = sale_order_mapped_select.val();
        if (opportunity_mapped !== null && opportunity_mapped !== '') {
            frm.dataForm['opportunity_mapped'] = opp_mapped_select.val();
        }
        else if (quotation_mapped !== null && quotation_mapped !== '') {
            frm.dataForm['quotation_mapped'] = quotation_mapped_select.val();
        }
        else if (sale_order_mapped !== null && sale_order_mapped !== '') {
            frm.dataForm['sale_order_mapped'] = sale_order_mapped_select.val();
        }
        else {
            frm.dataForm['sale_code_type'] = 2;
        }

        frm.dataForm['employee_inherit'] = $('#employee_inherit_id').val();
        if (frm.dataForm['employee_inherit'] === '') {
            $.fn.notifyB({description: 'Employee Inherit must not be NULL'}, 'failure');
            return false;
        }

        if (tableLineDetail.find('tbody tr').length > 0) {
            let table_body = tableLineDetail.find('tbody');
            let row_count = table_body.find('tr').length;
            let expense_valid_list = [];
            for (let i = 1; i <= row_count; i++) {
                let row_id = '#row-' + i.toString();
                let expense_name = table_body.find(row_id + ' .expense-name-input').val();
                let expense_type = table_body.find(row_id + ' .expense-type-select-box').val();
                let expense_uom_name = table_body.find(row_id + ' .expense-uom-input').val();
                let expense_quantity = table_body.find(row_id + ' .expense_quantity').val();
                let expense_tax = table_body.find(row_id + ' .expense-tax-select-box option:selected').attr('value');
                let expense_unit_price = parseFloat(table_body.find(row_id + ' .expense-unit-price-input').attr('value'));
                let expense_subtotal_price = parseFloat(table_body.find(row_id + ' .expense-subtotal-price').attr('value'));
                let expense_after_tax_price = parseFloat(table_body.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));
                let tax_rate = 0;
                if (table_body.find(row_id + ' .expense-tax-select-box').val()) {
                    let tax_selected = JSON.parse($('#' + table_body.find(row_id + ' .expense-tax-select-box').attr('data-idx-data-loaded')).text())[table_body.find(row_id + ' .expense-tax-select-box').val()];
                    tax_rate = parseFloat(tax_selected.rate);
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
            }
            frm.dataForm['expense_valid_list'] = expense_valid_list;
        }

        frm.dataForm['money_gave'] = money_gave.is(':checked');
        frm.dataForm['status'] = frm.dataForm['money_gave'];

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}
