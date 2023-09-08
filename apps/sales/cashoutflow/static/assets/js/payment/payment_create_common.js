const initEmployee = JSON.parse($('#employee_current').text());
let PaymentCreatorEle = $('#creator-select-box')
let PaymentBeneficiaryEle = $('#beneficiary-select-box')
let supplierEle = $('#supplier-select-box')
let saleCodeTypeEle = $('.sale_code_type')
let saleCodeEle = $('#sale-code-select-box')
let OPP_LIST = [];
let QUO_LIST = [];
let SO_LIST = [];

function PaymentLoadCreatedDate() {
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

function PaymentLoadCreator(data) {
    PaymentCreatorEle.append(`<option value="${data['id']}" selected>${data['full_name']}</option>`);
    PaymentCreatorEle.select2();
    PaymentCreatorEle.prop('disabled', true);
    let btn_detail = $('#btn-detail-creator-tab');
    $('#creator-detail-span').prop('hidden', false);
    $('#creator-name').text(data?.['full_name']);
    $('#creator-code').text(data?.['code']);
    $('#creator-department').text(data?.['group']['title']);
    let url = btn_detail.attr('data-url').replace('0', data?.['id']);
    btn_detail.attr('href', url);
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

function InforSpanBeneficiary(data) {
    let btn_detail = $('#btn-detail-beneficiary-tab');
    $('#beneficiary-detail-span').prop('hidden', false);
    $('#beneficiary-name').text(data?.['full_name']);
    $('#beneficiary-code').text(data?.['code']);
    $('#beneficiary-department').text(data?.['group']['title']);
    let url = btn_detail.attr('data-url').replace('0', data?.['id']);
    btn_detail.attr('href', url);
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

function PaymentLoadSupplier(data) {
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

function PaymentLoadBeneficiary(data, filter=[]) {
    PaymentBeneficiaryEle.initSelect2({
        ajax: {
            url: PaymentBeneficiaryEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [data];
            if (filter.length > 0) {
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (filter.includes(resp.data[keyResp][i].id)) {
                        result.push(resp.data[keyResp][i])
                    }
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    }).on('change', function () {
        let obj_selected = JSON.parse($('#' + PaymentBeneficiaryEle.attr('data-idx-data-loaded')).text())[PaymentBeneficiaryEle.val()];
        InforSpanBeneficiary(obj_selected);
    })
}

saleCodeTypeEle.on('change', function () {
    let plan_dtb = $('#tab_plan_datatable');
    plan_dtb.DataTable().clear().destroy();
    plan_dtb.prop('hidden', true);
    $('#notify-none-sale-code').prop('hidden', false);
    let btn_sale_code_type = $('#btn-change-sale-code-type');
    if ($(this).val() === '0') {
        btn_sale_code_type.text('Sale');
        $('#sale-code-label-id').addClass('required');
        saleCodeEle.prop('disabled', false);
        PaymentBeneficiaryEle.prop('disabled', false);
        getPaymentSaleCode();
    }
    if ($(this).val() === '3') {
        btn_sale_code_type.text('MULTI');
    }
})

function getPaymentSaleCode() {
    let call_opp_list = $.fn.callAjax(saleCodeEle.attr('data-url-opp'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_list')) {
                return data?.['opportunity_list'];
            }
            return [];
        }
    })
    let call_quo_list = $.fn.callAjax(saleCodeEle.attr('data-url-quotation'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('quotation_list')) {
                return data?.['quotation_list'];
            }
            return [];
        }
    })
    let call_so_list = $.fn.callAjax(saleCodeEle.attr('data-url-sale-order'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('sale_order_list')) {
                return data?.['sale_order_list'];
            }
            return [];
        }
    })
    Promise.all([call_opp_list, call_quo_list, call_so_list]).then((results) => {
        OPP_LIST = results[0];
        QUO_LIST = results[1];
        SO_LIST = results[2];
        let so_list = results[2];
        let quo_list = results[1];
        let opp_list = results[0];
        for (let i = 0; i < so_list.length; i++) {
            let get_quo_id = so_list[i].quotation?.['id'];
            let get_opp_id = so_list[i].opportunity?.['id'];
            if (get_quo_id !== undefined) {
                quo_list = quo_list.filter(function (item) {
                    return item.id !== get_quo_id;
                })
            }
            if (get_opp_id !== undefined) {
                opp_list = opp_list.filter(function (item) {
                    return item.id !== get_opp_id;
                })
            }
        }
        for (let i = 0; i < quo_list.length; i++) {
            let get_opp_id = quo_list[i].opportunity?.['id'];
            if (get_opp_id !== undefined) {
                opp_list = opp_list.filter(function (item) {
                    return item.id !== get_opp_id;
                })
            }
        }
        let sale_code_list = so_list.concat(quo_list).concat(opp_list);
        PaymentLoadSaleCode([{}].concat(sale_code_list));
    }).catch((error) => {
        console.log(error)
        $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
    });
}

function PaymentLoadSaleCode(sale_code) {
    saleCodeEle.initSelect2({
        templateResult: function(data) {
            let opp_code = 'No Opportunity';
            if (Object.keys(data).includes('data')) {
                if (Object.keys(data.data).includes('opportunity')) {
                    if (Object.keys(data.data.opportunity).length !== 0) {
                        opp_code = data.data.opportunity['code'];
                    }
                }
            }
            let ele = $('<div class="row col-12" data-bs-toggle="tooltip" data-bs-placement="right" title="' + opp_code + '"></div>');
            ele.append('<div class="col-4">' + data.data?.['code'] + '</div>');
            ele.append('<div class="col-8">' + data.data?.['title'] + '</div>');
            return ele;
        },
        data: sale_code,
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let sale_code_selected_id = saleCodeEle.val()
        if (sale_code_selected_id !== '') {
            let obj_sale_code = JSON.parse($('#' + saleCodeEle.attr('data-idx-data-loaded')).text())[sale_code_selected_id];
            let get_opp_obj_mapped = OPP_LIST.filter(function (item) {
                return item.id === obj_sale_code.opportunity?.['id'] ? obj_sale_code.opportunity?.['id'] : obj_sale_code?.['id'];
            })
            let sale_team = [obj_sale_code?.['sale_person'].id];
            if (get_opp_obj_mapped.length === 1) {
                for (let i = 0; i < get_opp_obj_mapped[0].opportunity_sale_team_datas.length; i++) {
                    sale_team.push(get_opp_obj_mapped[0].opportunity_sale_team_datas[i].member.id)
                }
            }
            PaymentLoadBeneficiary(initEmployee, sale_team)
            let type = 0;
            let sale_code_selected = SO_LIST.filter(function (element) {
                return element.id === sale_code_selected_id;
            });
            if (sale_code_selected.length === 0) {
                sale_code_selected = QUO_LIST.filter(function (element) {
                    return element.id === sale_code_selected_id;
                })
                type = 1;
            }
            if (sale_code_selected.length === 0) {
                sale_code_selected = OPP_LIST.filter(function (element) {
                    return element.id === sale_code_selected_id;
                })
                type = 2;
            }

            let call_ap_list = $.fn.callAjax($('#form-create-payment').attr('data-url-list'), 'GET').then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_list')) {
                        return data?.['advance_payment_list'];
                    }
                    return [];
                }
            })
            Promise.all([call_ap_list]).then((results) => {
                let all_product_items = [];
                for (let i = 0; i < results[0].length; i++) {
                    if (results[0][i]?.['sale_order_mapped']['id'] === sale_code_selected_id || results[0][i]?.['quotation_mapped']['id'] === sale_code_selected_id || results[0][i]?.['opportunity_mapped']['id'] === sale_code_selected_id) {
                        all_product_items = all_product_items.concat(results[0][i]?.['product_items'])
                    }
                }
                if (sale_code_selected.length > 0 && type === 0) {
                    loadSaleOrderProduct(sale_code_selected_id, all_product_items);
                }
                if (sale_code_selected.length > 0 && type === 1) {
                    loadQuotationProduct(sale_code_selected_id, all_product_items);
                }
            }).catch((error) => {
                console.log(error)
                $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
            });
        }
    })
}

function loadSaleOrderProduct(filter_sale_order, ap_items_list) {
    let dtb = $('#tab_plan_datatable');
    if (filter_sale_order !== '') {
        dtb.prop('hidden', false);
        $('#notify-none-sale-code').prop('hidden', true);
    }
    else {
        dtb.prop('hidden', true);
        $('#notify-none-sale-code').prop('hidden', false);
    }
    dtb.DataTable().clear().destroy();
    let frm = new SetupFormSubmit(dtb);
    frm.dataUrl = dtb.attr('data-url-sale-order');
    dtb.DataTableDefault({
        reloadCurrency: true,
        rowIdx: true,
        useDataServer: true,
        dom: '',
        ajax: {
            url: frm.dataUrl + '?filter_sale_order=' + filter_sale_order,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let data_detail = data?.['sale_order_expense_list'];
                    let result1 = []
                    for (let i = 0; i < data_detail.length; i++) {
                        let sum_AP_approved_list = ap_items_list.filter(function (element) {
                            return element.product.id === data_detail[i].product_id;
                        })
                        let sum_AP_approved_value = 0;
                        let sum_returned_value = 0;
                        let sum_to_payment_value = 0;
                        let sum_others_payment_value = 0;
                        for (let i = 0; i < sum_AP_approved_list.length; i++) {
                            sum_AP_approved_value += sum_AP_approved_list[i]?.['subtotal_price'];
                            sum_returned_value += sum_AP_approved_list[i]?.['returned_total'];
                            sum_to_payment_value += sum_AP_approved_list[i]?.['to_payment_total'];
                        }
                        let sum_available_value = data_detail[i].plan_after_tax - sum_AP_approved_value - sum_others_payment_value + sum_returned_value;
                        if (sum_available_value < 0) {
                            sum_available_value = 0;
                        }
                        if (data_detail[i].is_product) {
                            result1.push({
                                'expense_id': data_detail[i].expense_id ? data_detail[i].expense_id : data_detail[i].product_id,
                                'expense_title': data_detail[i].expense_title ? data_detail[i].expense_title : data_detail[i].product_title,
                                'tax': data_detail[i].tax,
                                'plan_after_tax': data_detail[i].plan_after_tax,
                                'sum_AP_approved': sum_AP_approved_value,
                                'returned': sum_returned_value,
                                'to_payment': sum_to_payment_value,
                                'others_payment': sum_others_payment_value,
                                'available': sum_available_value,
                            })
                        }
                    }
                    return result1;
                }
                return [];
            },
        },
        columns: [
            {
                render: () => {
                    return ``;
                }
            },
            {
                data: 'expense_title',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<a href="#"><span>` + row.expense_title + `</span></a>`
                }
            },
            {
                data: 'tax',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row.tax.title) {
                        return `<span class="badge badge-soft-indigo badge-outline">` + row.tax.title + `</span>`
                    }
                    return ``
                }
            },
            {
                data: 'plan_after_tax',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.plan_after_tax + `"></span>`
                }
            },
            {
                data: 'sum_AP_approved',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.sum_AP_approved + `"></span>`
                }
            },
            {
                data: 'returned',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.returned + `"></span>`
                }
            },
            {
                data: 'to_payment',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.to_payment + `"></span>`
                }
            },
            {
                data: 'others_payment',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.others_payment + `"></span>`
                }
            },
            {
                data: 'available',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.available + `"></span>`
                }
            }
        ],
    });
}

function loadQuotationProduct(filter_quotation, ap_items_list) {
    let dtb = $('#tab_plan_datatable');
    if (filter_quotation !== '') {
        dtb.prop('hidden', false);
        $('#notify-none-sale-code').prop('hidden', true);
    }
    else {
        dtb.prop('hidden', true);
        $('#notify-none-sale-code').prop('hidden', false);
    }
    dtb.DataTable().clear().destroy();
    let frm = new SetupFormSubmit(dtb);
    frm.dataUrl = dtb.attr('data-url-sale-order');
    dtb.DataTableDefault({
        reloadCurrency: true,
        rowIdx: true,
        useDataServer: true,
        dom: '',
        ajax: {
            url: frm.dataUrl + '?filter_quotation=' + filter_quotation,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let data_detail = data?.['quotation_expense_list'];
                    let result2 = []
                    for (let i = 0; i < data_detail.length; i++) {
                        let sum_AP_approved_list = ap_items_list.filter(function (element) {
                            return element.product.id === data_detail[i].product_id;
                        })
                        let sum_AP_approved_value = 0;
                        let sum_returned_value = 0;
                        let sum_to_payment_value = 0;
                        let sum_others_payment_value = 0;
                        for (let i = 0; i < sum_AP_approved_list.length; i++) {
                            sum_AP_approved_value += sum_AP_approved_list[i]?.['subtotal_price'];
                            sum_returned_value += sum_AP_approved_list[i]?.['returned_total'];
                            sum_to_payment_value += sum_AP_approved_list[i]?.['to_payment_total'];
                        }
                        let sum_available_value = data_detail[i].plan_after_tax - sum_AP_approved_value - sum_others_payment_value + sum_returned_value;
                        if (sum_available_value < 0) {
                            sum_available_value = 0;
                        }
                        if (data_detail[i].is_product) {
                            result2.push({
                                'expense_id': data_detail[i].expense_id ? data_detail[i].expense_id : data_detail[i].product_id,
                                'expense_title': data_detail[i].expense_title ? data_detail[i].expense_title : data_detail[i].product_title,
                                'tax': data_detail[i].tax,
                                'plan_after_tax': data_detail[i].plan_after_tax,
                                'sum_AP_approved': sum_AP_approved_value,
                                'returned': sum_returned_value,
                                'to_payment': sum_to_payment_value,
                                'others_payment': sum_others_payment_value,
                                'available': sum_available_value,
                            })
                        }
                    }
                    return result2;
                }
                return [];
            },
        },
        columns: [
            {
                render: () => {
                    return ``;
                }
            },
            {
                data: 'expense_title',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<a href="#"><span>` + row.expense_title + `</span></a>`
                }
            },
            {
                data: 'tax',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row.tax.title) {
                        return `<span class="badge badge-soft-indigo badge-outline">` + row.tax.title + `</span>`
                    }
                    return ``
                }
            },
            {
                data: 'plan_after_tax',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.plan_after_tax + `"></span>`
                }
            },
            {
                data: 'sum_AP_approved',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.sum_AP_approved + `"></span>`
                }
            },
            {
                data: 'returned',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.returned + `"></span>`
                }
            },
            {
                data: 'to_payment',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.to_payment + `"></span>`
                }
            },
            {
                data: 'others_payment',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.others_payment + `"></span>`
                }
            },
            {
                data: 'available',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="` + row.available + `"></span>`
                }
            }
        ],
    });
}

class PaymentHandle {
    load() {
        PaymentLoadCreatedDate();
        PaymentLoadCreator(initEmployee);
        PaymentLoadBeneficiary(initEmployee);
        InforSpanBeneficiary(initEmployee);
        PaymentLoadSupplier();
    }
}