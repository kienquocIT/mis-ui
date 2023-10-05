const initEmployee = JSON.parse($('#employee_current').text());
let PaymentCreatorEle = $('#creator-select-box')
let PaymentBeneficiaryEle = $('#beneficiary-select-box')
let supplierEle = $('#supplier-select-box')
let saleCodeEle = $('#sale-code-select-box')
let sale_code_loading_span = $('#sale-code-loading-span')
let tableLineDetail = $('#tab_line_detail_datatable')
let AP_db = $('#advance_payment_list_datatable')
let OPP_LIST = [];
let QUO_LIST = [];
let SO_LIST = [];
let current_value_converted_from_ap = '';

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

function PaymentLoadBeneficiary(data) {
    PaymentBeneficiaryEle.html('');
    PaymentBeneficiaryEle.append(`<option value="${data.id}">${data.full_name}</option>`)
    PaymentBeneficiaryEle.select2();
    PaymentBeneficiaryEle.prop('disabled', true);
    let btn_detail = $('#btn-detail-beneficiary-tab');
    $('#beneficiary-detail-span').prop('hidden', false);
    $('#beneficiary-name').text(data?.['full_name']);
    $('#beneficiary-code').text(data?.['code']);
    $('#beneficiary-department').text(data?.['group']['title']);
    let url = btn_detail.attr('data-url').replace('0', data?.['id']);
    btn_detail.attr('href', url);
}

async function getPaymentSaleCode(sale_code_mapped_param, type_param) {
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
    let call_user_perm = $.fn.callAjax($('#form-create-payment').attr('data-url-payment-perm'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('payment_config_list')) {
                let user_allowed = data?.['payment_config_list'].filter(function (element) {
                    return element.employee_allowed.id === initEmployee.id
                });
                return user_allowed.length > 0;

            }
            return false;
        }
    })
    Promise.all([call_opp_list, call_quo_list, call_so_list, call_user_perm]).then((results) => {
        OPP_LIST = results[0];
        QUO_LIST = results[1];
        SO_LIST = results[2];
        let so_list_temp = results[2];
        let quo_list_temp = results[1];
        let opp_list_temp = results[0];
        for (let i = 0; i < so_list_temp.length; i++) {
            let get_quo_id = so_list_temp[i].quotation?.['id'];
            let get_opp_id = so_list_temp[i].opportunity?.['id'];
            if (get_quo_id !== undefined) {
                quo_list_temp = quo_list_temp.filter(function (item) {
                    return item.id !== get_quo_id;
                })
            }
            if (get_opp_id !== undefined) {
                opp_list_temp = opp_list_temp.filter(function (item) {
                    return item.id !== get_opp_id;
                })
            }
        }
        for (let i = 0; i < quo_list_temp.length; i++) {
            let get_opp_id = quo_list_temp[i].opportunity?.['id'];
            if (get_opp_id !== undefined) {
                opp_list_temp = opp_list_temp.filter(function (item) {
                    return item.id !== get_opp_id;
                })
            }
        }
        let sale_code_list_temp = so_list_temp.concat(quo_list_temp).concat(opp_list_temp);
        let sale_code_list = [];
        for (let i = 0; i < sale_code_list_temp.length; i++) {
            let sale_person = sale_code_list_temp[i]['sale_person'];

            let opp_mapped = sale_code_list_temp[i].opportunity || {'id': sale_code_list_temp[i].id, 'code': sale_code_list_temp[i].code,  'title': sale_code_list_temp[i].title};
            let opp_sale_team = (Object.keys(opp_mapped).length !== 0 && sale_code_list_temp[i].opportunity_sale_team_datas !== undefined) ? sale_code_list_temp[i].opportunity_sale_team_datas : [];

            let sale_team = [];
            let flag = 0;
            for (let i = 0; i < opp_sale_team.length; i++) {
                sale_team.push(opp_sale_team[i].member)
                if (opp_sale_team[i].member.id === initEmployee.id) {
                    flag = 1;
                }
            }
            sale_code_list_temp[i]['sale_team'] = sale_team;

            let get_app_data_ap = initEmployee.permission_by_configured.find(element => element.app_data.code === 'advancepayment');
            let can_create = get_app_data_ap ? get_app_data_ap.create : false;

            if (initEmployee.id === sale_person.id || flag === 1 || can_create) {
                sale_code_list.push(sale_code_list_temp[i])
            }
        }
        if (sale_code_mapped_param !== null) {
            let sale_code_mapped_obj = null;
            if (type_param === 0) {
                sale_code_mapped_obj = SO_LIST.filter(function (element) {
                    return element.id === sale_code_mapped_param;
                })
            }
            if (type_param === 1) {
                sale_code_mapped_obj = QUO_LIST.filter(function (element) {
                    return element.id === sale_code_mapped_param;
                })
            }
            if (type_param === 2) {
                sale_code_mapped_obj = OPP_LIST.filter(function (element) {
                    return element.id === sale_code_mapped_param;
                })
            }
            PaymentLoadSaleCode(sale_code_mapped_obj)
            saleCodeEle.prop('disabled', true);
            PaymentLoadBeneficiary(initEmployee)

            let sale_code_selected_id = sale_code_mapped_obj[0].id
            tableLineDetail.find('tbody').html('');
            let obj_sale_code = JSON.parse($('#' + saleCodeEle.attr('data-idx-data-loaded')).text())[sale_code_selected_id];
            PaymentLoadBeneficiary(obj_sale_code.sale_person)

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
                let ap_selected = null;
                for (let i = 0; i < results[0].length; i++) {
                    let ap_opp_mapped = results[0][i]?.['opportunity_mapped'];
                    let ap_quo_mapped = results[0][i]?.['quotation_mapped'];
                    let ap_so_mapped = results[0][i]?.['sale_order_mapped'];
                    if (Object.keys(ap_opp_mapped).length !== 0) {
                        if (sale_code_selected_id === ap_opp_mapped.id) {
                            ap_selected = results[0][i].id;
                            break;
                        }
                    }
                    if (Object.keys(ap_quo_mapped).length !== 0) {
                        if (sale_code_selected_id === ap_quo_mapped.id) {
                            ap_selected = results[0][i].id;
                            break;
                        }
                    }
                    if (Object.keys(ap_so_mapped).length !== 0) {
                        if (sale_code_selected_id === ap_so_mapped.id) {
                            ap_selected = results[0][i].id;
                            break;
                        }
                    }
                }
                if (ap_selected !== null) {
                    let url_loaded = $('#form-create-payment').attr('data-url-detail').replace(0, ap_selected);
                    $.fn.callAjax(url_loaded, 'GET').then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                data = data['advance_payment_detail'];
                                let sale_code_selected_id_list = {};

                                if (Object.keys(data?.['sale_code_relate']).includes('opportunity_linked')) {
                                    sale_code_selected_id_list['opportunity_linked_id'] = data?.['sale_code_relate']['opportunity_linked'].id;
                                }
                                if (Object.keys(data?.['sale_code_relate']).includes('quotation_linked')) {
                                    sale_code_selected_id_list['quotation_linked_id'] = data?.['sale_code_relate']['quotation_linked'].id;
                                }
                                if (Object.keys(data?.['sale_code_relate']).includes('sale_order_linked')) {
                                    sale_code_selected_id_list['sale_order_linked_id'] = data?.['sale_code_relate']['sale_order_linked'].id;
                                }

                                let all_expense_items = [];
                                for (let i = 0; i < results[0].length; i++) {
                                    let item = results[0][i];
                                    let so_mapped_id = item?.['sale_order_mapped']['id'];
                                    let quo_mapped_id = item?.['quotation_mapped']['id'];
                                    let opp_mapped_id = item?.['opportunity_mapped']['id'];

                                    if ((sale_code_selected_id_list['sale_order_linked_id'] === so_mapped_id && so_mapped_id !== undefined) ||
                                        (sale_code_selected_id_list['quotation_linked_id'] === quo_mapped_id && quo_mapped_id !== undefined) ||
                                        (sale_code_selected_id_list['opportunity_linked_id'] === opp_mapped_id && opp_mapped_id !== undefined)) {
                                        all_expense_items = all_expense_items.concat(item?.['expense_items']);
                                    }
                                }
                                if (sale_code_selected_id_list['sale_order_linked_id']) {
                                    loadSaleOrderExpensesPlan(sale_code_selected_id_list['sale_order_linked_id'], all_expense_items, data?.['payment_value_list'], data?.['returned_value_list']);
                                }
                                else if (sale_code_selected_id_list['quotation_linked_id']) {
                                    loadQuotationExpensesPlan(sale_code_selected_id_list['quotation_linked_id'], all_expense_items, data?.['payment_value_list'], data?.['returned_value_list']);
                                }

                                $.fn.initMaskMoney2();
                            }
                        })
                }
                else {
                    let check_is_so = SO_LIST.filter(function (element) {
                        return element.id === sale_code_selected_id;
                    })
                    let check_is_quo = QUO_LIST.filter(function (element) {
                        return element.id === sale_code_selected_id;
                    })
                    if (check_is_so.length > 0) {
                        loadSaleOrderExpensesPlan(sale_code_selected_id)
                    }
                    if (check_is_quo.length > 0) {
                        loadQuotationExpensesPlan(sale_code_selected_id)
                    }
                }
            }).catch((error) => {
                console.log(error)
                $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
            });
        }
        else {
            if (results[3]) {
                saleCodeEle.prop('multiple', true);
                saleCodeEle.addClass('select-multiple select2');
                saleCodeEle.attr('data-placeholder', 'Select MULTI Sale Code');
                PaymentLoadSaleCodeMULTI([].concat(sale_code_list));
            }
            else {
                PaymentLoadSaleCode([{}].concat(sale_code_list));
            }
            saleCodeEle.prop('disabled', false);
        }
        sale_code_loading_span.attr('hidden', true);
        $('#btn-add-row-line-detail').attr('hidden', false);
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
            ele.append(`<div class="col-4">${data.data?.['code']}</div>`);
            ele.append(`<div class="col-8">${data.data?.['title']}</div>`);
            return ele;
        },
        data: sale_code,
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        $('#tab_plan_datatable tbody').html('')
        let sale_code_selected_id = saleCodeEle.val();
        if (sale_code_selected_id !== '') {
            tableLineDetail.find('tbody').html('');
            let obj_sale_code = JSON.parse($('#' + saleCodeEle.attr('data-idx-data-loaded')).text())[sale_code_selected_id];
            PaymentLoadBeneficiary(obj_sale_code.sale_person)

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
                let ap_selected = null;
                for (let i = 0; i < results[0].length; i++) {
                    let ap_opp_mapped = results[0][i]?.['opportunity_mapped'];
                    let ap_quo_mapped = results[0][i]?.['quotation_mapped'];
                    let ap_so_mapped = results[0][i]?.['sale_order_mapped'];
                    if (Object.keys(ap_opp_mapped).length !== 0) {
                        if (sale_code_selected_id === ap_opp_mapped.id) {
                            ap_selected = results[0][i].id;
                            break;
                        }
                    }
                    if (Object.keys(ap_quo_mapped).length !== 0) {
                        if (sale_code_selected_id === ap_quo_mapped.id) {
                            ap_selected = results[0][i].id;
                            break;
                        }
                    }
                    if (Object.keys(ap_so_mapped).length !== 0) {
                        if (sale_code_selected_id === ap_so_mapped.id) {
                            ap_selected = results[0][i].id;
                            break;
                        }
                    }
                }
                if (ap_selected !== null) {
                    let url_loaded = $('#form-create-payment').attr('data-url-detail').replace(0, ap_selected);
                    $.fn.callAjax(url_loaded, 'GET').then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                data = data['advance_payment_detail'];
                                let sale_code_selected_id_list = {};

                                if (Object.keys(data?.['sale_code_relate']).includes('opportunity_linked')) {
                                    sale_code_selected_id_list['opportunity_linked_id'] = data?.['sale_code_relate']['opportunity_linked'].id;
                                }
                                if (Object.keys(data?.['sale_code_relate']).includes('quotation_linked')) {
                                    sale_code_selected_id_list['quotation_linked_id'] = data?.['sale_code_relate']['quotation_linked'].id;
                                }
                                if (Object.keys(data?.['sale_code_relate']).includes('sale_order_linked')) {
                                    sale_code_selected_id_list['sale_order_linked_id'] = data?.['sale_code_relate']['sale_order_linked'].id;
                                }

                                let all_expense_items = [];
                                for (let i = 0; i < results[0].length; i++) {
                                    let item = results[0][i];
                                    let so_mapped_id = item?.['sale_order_mapped']['id'];
                                    let quo_mapped_id = item?.['quotation_mapped']['id'];
                                    let opp_mapped_id = item?.['opportunity_mapped']['id'];

                                    if ((sale_code_selected_id_list['sale_order_linked_id'] === so_mapped_id && so_mapped_id !== undefined) ||
                                        (sale_code_selected_id_list['quotation_linked_id'] === quo_mapped_id && quo_mapped_id !== undefined) ||
                                        (sale_code_selected_id_list['opportunity_linked_id'] === opp_mapped_id && opp_mapped_id !== undefined)) {
                                        all_expense_items = all_expense_items.concat(item?.['expense_items']);
                                    }
                                }
                                if (sale_code_selected_id_list['sale_order_linked_id']) {
                                    loadSaleOrderExpensesPlan(sale_code_selected_id_list['sale_order_linked_id'], all_expense_items, data?.['payment_value_list'], data?.['returned_value_list']);
                                }
                                else if (sale_code_selected_id_list['quotation_linked_id']) {
                                    loadQuotationExpensesPlan(sale_code_selected_id_list['quotation_linked_id'], all_expense_items, data?.['payment_value_list'], data?.['returned_value_list']);
                                }

                                $.fn.initMaskMoney2();
                            }
                        })
                }
                else {
                    let check_is_so = SO_LIST.filter(function (element) {
                        return element.id === sale_code_selected_id;
                    })
                    let check_is_quo = QUO_LIST.filter(function (element) {
                        return element.id === sale_code_selected_id;
                    })
                    if (check_is_so.length > 0) {
                        loadSaleOrderExpensesPlan(sale_code_selected_id)
                    }
                    if (check_is_quo.length > 0) {
                        loadQuotationExpensesPlan(sale_code_selected_id)
                    }
                }
            }).catch((error) => {
                console.log(error)
                $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
            });
        }
    })
}

function PaymentLoadSaleCodeMULTI(sale_code) {
    for (let i = 0; i < sale_code.length; i++) {
        let data_row = sale_code[i];
        let opp_code = 'No Opportunity';
        if (Object.keys(data_row).includes('opportunity')) {
            if (Object.keys(data_row.opportunity).length !== 0) {
                opp_code = data_row.opportunity['code'];
            }
        }
        let html = $(`<option class="row col-12" data-bs-toggle="tooltip" data-bs-placement="right" value="${data_row?.['id']}" title="rrr">${data_row?.['code']} - ${data_row?.['title']}</option>`);
        saleCodeEle.append(html);
    }
    saleCodeEle.initSelect2({
        templateResult: function(data) {
            let ele = $(`<div class="row col-12" data-bs-toggle="tooltip" data-bs-placement="right" title="${data.title}"></div>`);
            ele.append(`<div class="col-5">${data.text.split(' - ')[0]}</div>`);
            ele.append(`<div class="col-7">${data.text.split(' - ')[1]}</div>`);
            return ele;
        }
    })
    saleCodeEle.on('change', function () {
        PaymentBeneficiaryEle.prop('disabled', true);
        $('#tab_line_detail_datatable tbody').html(``);
        $('#tab_plan_datatable tbody').html(``);
    })
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

function loadProductTaxList(row_id, data) {
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

function count_row(table_body, option) {
    let count = 0;
    table_body.find('tr td.number').each(function() {
        count = count + 1;
        $(this).text(count);
        $(this).closest('tr').attr('id', 'row-' + count.toString());
        let sale_code_length = [].concat(saleCodeEle.val()).length;
        let detail_product_element = $(this).closest('tr').nextAll().slice(0, sale_code_length + 1)
        detail_product_element.each(function () {
            $(this).attr('class', 'row-detail-product-' + count.toString());
        });
    });
    if (option === 1) {
        loadExpenseType('row-' + count.toString());
        loadProductTaxList('row-' + count.toString());
    }
    return count;
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
        subtotal_after_tax.attr('value', subtotal_value + subtotal_value * parseFloat(tax_rate) / 100);
    }
    else {
        unit_price.attr('value', '');
        subtotal.attr('value', '');
        subtotal_after_tax.attr('value', '');
    }
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

function get_ap_product_items() {
    let ap_expense_items = [];
    $('.product-tables').find('.product-selected').each(function () {
        if ($(this).is(':checked')) {
            let value = parseFloat($(this).closest('tr').find('.converted-value-inp').attr('value'));
            if ($(this).attr('data-id') && value > 0) {
                ap_expense_items.push({'expense_converted_id': $(this).attr('data-id'), 'expense_value_converted': value});
            }
        }
    })
    return ap_expense_items;
}

function loadAPList(sale_code_id) {
    AP_db.DataTable().clear().destroy();
    AP_db.DataTableDefault({
        reloadCurrency: true,
        dom: "",
        paging: false,
        ajax: {
            url: AP_db.attr('data-url'),
            type: AP_db.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.data['advance_payment_list']) {
                        let all = [];
                        for (let i = 0; i < sale_code_id.length; i++) {
                            // if sale_code_id is so_id
                            let so_filter = SO_LIST.filter(function (item) {
                                return item.id === sale_code_id[i];
                            });
                            // if sale_code_id is quo_id
                            let quo_filter = QUO_LIST.filter(function (item) {
                                return item.id === sale_code_id[i];
                            });
                            // find quotation mapped with this sale_order_id (if sale_order_id is opp_id)
                            let opp_filter = OPP_LIST.filter(function (item) {
                                return item.id === sale_code_id[i];
                            });

                            let sale_order_mapped = null;
                            let quotation_mapped = null;
                            let opportunity_mapped = null;
                            if (opp_filter.length > 0) {
                                sale_order_mapped = opp_filter[0].sale_order_id;
                                quotation_mapped = opp_filter[0].quotation_id;
                                opportunity_mapped = opp_filter[0].id;
                            } else if (quo_filter.length > 0) {
                                quotation_mapped = quo_filter[0].id;
                                if (Object.keys(quo_filter[0].opportunity).length !== 0) {
                                    opportunity_mapped = quo_filter[0].opportunity.id;
                                }
                            } else if (so_filter.length > 0) {
                                sale_order_mapped = so_filter[0].id;
                                if (Object.keys(so_filter[0].quotation).length !== 0) {
                                    quotation_mapped = so_filter[0].quotation.id;
                                }
                                if (Object.keys(so_filter[0].opportunity).length !== 0) {
                                    opportunity_mapped = so_filter[0].opportunity.id;
                                }
                            }

                            // find ap mapped with this sale_order_mapped
                            let sale_order_mapped_ap = resp.data['advance_payment_list'].filter(function (item) {
                                if (item.sale_order_mapped) {
                                    return item.sale_order_mapped.id === sale_order_mapped;
                                }
                            });
                            // find ap mapped with this quotation_mapped
                            let quotation_mapped_ap = resp.data['advance_payment_list'].filter(function (item) {
                                if (item.quotation_mapped) {
                                    return item.quotation_mapped.id === quotation_mapped;
                                }
                            });
                            // find ap mapped with this opportunity_mapped
                            let opportunity_mapped_ap = resp.data['advance_payment_list'].filter(function (item) {
                                if (item.opportunity_mapped) {
                                    return item.opportunity_mapped.id === opportunity_mapped;
                                }
                            });

                            all = all.concat(sale_order_mapped_ap).concat(quotation_mapped_ap).concat(opportunity_mapped_ap)
                        }
                        return all
                    }
                    else {
                        return [];
                    }
                }
                return [];
            },
        },
        columns: [
            {
                render: (data, type, row) => {
                    if (row.remain_value <= 0) {
                        return `<input data-id="` + row.id + `" class="ap-selected" type="checkbox" disabled>`
                    }
                    else {
                        return `<input data-id="` + row.id + `" class="ap-selected" type="checkbox">`
                    }
                }
            },
            {
                data: 'code',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="badge badge-outline badge-soft-danger">` + row.code + `</span>`;
                }
            },
            {
                data: 'title',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span>` + row.title + `</span>`;
                }
            },
            {
                data: 'to_payment',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="text-primary mask-money" data-init-money="` + row.to_payment + `"></span>`
                }
            },
            {
                data: 'return_value',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="text-primary mask-money" data-init-money="` + row.return_value + `"></span>`
                }
            },
            {
                data: 'remain_value',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="text-primary mask-money" data-init-money="` + row.remain_value + `"></span>`
                }
            },
        ],
    });
}

function loadSaleOrderExpensesPlan(filter_sale_order, ap_items_list=[], payment_value_list=[], returned_value_list=[]) {
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
                    let result = []
                    for (let i = 0; i < data_detail.length; i++) {
                        let existed = result.filter(function (element) {
                            return element.expense_item.id === data_detail[i].expense_item.id;
                        });
                        if (existed.length === 0) {
                            result.push({
                                'id': data_detail[i].id,
                                'expense_title': data_detail[i].expense_title,
                                'expense_item': data_detail[i].expense_item,
                                'plan_after_tax': 0,
                                'sum_AP_approved': 0,
                                'returned': 0,
                                'to_payment': 0,
                                'others_payment': 0,
                                'available': 0,
                            })
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        let sum_plan_after_tax = 0;
                        let sum_AP_approved_value = 0;
                        let sum_returned_value = 0;
                        let sum_to_payment_value = 0;
                        let sum_others_payment_value = 0;

                        for (let j = 0; j < data_detail.length; j++) {
                            if (data_detail[j].expense_item.id === result[i].expense_item.id) {
                                sum_plan_after_tax = sum_plan_after_tax + data_detail[j].plan_after_tax;
                            }
                        }
                        let sum_AP_approved_list = ap_items_list.filter(function (element) {
                            return element.expense_type.id === result[i].expense_item.id;
                        })
                        for (let k = 0; k < sum_AP_approved_list.length; k++) {
                            sum_AP_approved_value += sum_AP_approved_list[k]?.['expense_after_tax_price'];
                        }
                        for (let l = 0; l < payment_value_list.length; l++) {
                            if (payment_value_list[l].expense_type_id === result[i].expense_item.id) {
                                sum_to_payment_value += payment_value_list[l].converted_value;
                                sum_others_payment_value += payment_value_list[l].real_value;
                            }
                        }
                        for (let m = 0; m < returned_value_list.length; m++) {
                            if (returned_value_list[m].expense_type_id === result[i].expense_item.id) {
                                sum_returned_value += returned_value_list[m].returned_value;
                            }
                        }
                        let sum_available_value = sum_plan_after_tax - sum_AP_approved_value - sum_others_payment_value + sum_returned_value;
                        if (sum_available_value < 0) {
                            sum_available_value = 0;
                        }

                        result[i].plan_after_tax = sum_plan_after_tax;
                        result[i].sum_AP_approved = sum_AP_approved_value;
                        result[i].returned = sum_returned_value;
                        result[i].to_payment = sum_to_payment_value;
                        result[i].others_payment = sum_others_payment_value;
                        result[i].available = sum_available_value;
                    }
                    return result;
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
                data: 'expense_item',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<a href="#"><span>` + row.expense_item.title + `</span></a>`
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

function loadQuotationExpensesPlan(filter_quotation, ap_items_list=[], payment_value_list=[], returned_value_list=[]) {
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
    frm.dataUrl = dtb.attr('data-url-quotation');
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
                    let result = []
                    for (let i = 0; i < data_detail.length; i++) {
                        let existed = result.filter(function (element) {
                            return element.expense_item.id === data_detail[i].expense_item.id;
                        });
                        if (existed.length === 0) {
                            result.push({
                                'id': data_detail[i].id,
                                'expense_title': data_detail[i].expense_title,
                                'expense_item': data_detail[i].expense_item,
                                'plan_after_tax': 0,
                                'sum_AP_approved': 0,
                                'returned': 0,
                                'to_payment': 0,
                                'others_payment': 0,
                                'available': 0,
                            })
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        let sum_plan_after_tax = 0;
                        let sum_AP_approved_value = 0;
                        let sum_returned_value = 0;
                        let sum_to_payment_value = 0;
                        let sum_others_payment_value = 0;

                        for (let j = 0; j < data_detail.length; j++) {
                            if (data_detail[j].expense_item.id === result[i].expense_item.id) {
                                sum_plan_after_tax = sum_plan_after_tax + data_detail[j].plan_after_tax;
                            }
                        }
                        let sum_AP_approved_list = ap_items_list.filter(function (element) {
                            return element.expense_type.id === result[i].expense_item.id;
                        })
                        for (let k = 0; k < sum_AP_approved_list.length; k++) {
                            sum_AP_approved_value += sum_AP_approved_list[k]?.['expense_after_tax_price'];
                        }
                        for (let l = 0; l < payment_value_list.length; l++) {
                            if (payment_value_list[l].expense_type_id === result[i].expense_item.id) {
                                sum_to_payment_value += payment_value_list[l].converted_value;
                                sum_others_payment_value += payment_value_list[l].real_value;
                            }
                        }
                        for (let m = 0; m < returned_value_list.length; m++) {
                            if (returned_value_list[m].expense_type_id === result[i].expense_item.id) {
                                sum_returned_value += returned_value_list[m].returned_value;
                            }
                        }
                        let sum_available_value = sum_plan_after_tax - sum_AP_approved_value - sum_others_payment_value + sum_returned_value;
                        if (sum_available_value < 0) {
                            sum_available_value = 0;
                        }

                        result[i].plan_after_tax = sum_plan_after_tax;
                        result[i].sum_AP_approved = sum_AP_approved_value;
                        result[i].returned = sum_returned_value;
                        result[i].to_payment = sum_to_payment_value;
                        result[i].others_payment = sum_others_payment_value;
                        result[i].available = sum_available_value;
                    }
                    return result;
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
                data: 'expense_item',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span data-id="${row?.['expense_item'].id}">${row?.['expense_item'].title}</span>`
                }
            },
            {
                data: 'plan_after_tax',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['plan_after_tax']}"></span>`
                }
            },
            {
                data: 'sum_AP_approved',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['sum_AP_approved']}"></span>`
                }
            },
            {
                data: 'returned',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['returned']}"></span>`
                }
            },
            {
                data: 'to_payment',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['to_payment']}"></span>`
                }
            },
            {
                data: 'others_payment',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['others_payment']}"></span>`
                }
            },
            {
                data: 'available',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['available']}"></span>`
                }
            }
        ],
    });
}

$(document).on("click", '#btn-add-row-line-detail', function () {
    if (saleCodeEle.val() === '') {
        $.fn.notifyB({description: 'Select Sale code first.'}, 'warning');
    }
    else {
        let sale_code_list = [].concat(saleCodeEle.val());
        let sale_code_length = sale_code_list.length;
        let sale_code_code_list = [];

        for (let i = 0; i < sale_code_length; i++) {
            let flag = 0;
            let sale_code_mapped = SO_LIST.filter(function (element) {
                return element.id === sale_code_list[i];
            })
            if (sale_code_mapped.length === 0) {
                flag = 1;
                sale_code_mapped = QUO_LIST.filter(function (element) {
                    return element.id === sale_code_list[i];
                })
            }
            if (sale_code_mapped.length === 0) {
                flag = 2;
                sale_code_mapped = OPP_LIST.filter(function (element) {
                    return element.id === sale_code_list[i];
                })
            }
            if (sale_code_mapped.length > 0) {
                sale_code_mapped = sale_code_mapped[0];
                if (sale_code_mapped.opportunity && [0, 1, 2].includes(flag)) {
                    sale_code_code_list.push(sale_code_mapped.opportunity.code);
                } else {
                    sale_code_code_list.push(sale_code_mapped.code);
                }
            }
        }

        tableLineDetail.append(`<tr id="" class="row-number">
            <td class="number text-center"></td>
            <td><select class="form-select expense-type-select-box"></select></td>
            <td><input class="form-control expense-name-input"></td>
            <td><input class="form-control expense-uom-input"></td>
            <td><input type="number" min="1" class="form-control expense_quantity" value="1"></td>
            <td><input data-return-type="number" type="text" class="form-control expense-unit-price-input mask-money"></td>
            <td><select class="form-select expense-tax-select-box" data-method="GET"><option selected></option></select></td>
            <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money" style="color: black; background: none" disabled></td>
            <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money" style="color: black; background: none" disabled></td>
            <td><input type="text" class="form-control expense-document-number"></td>
            <td>
            <button class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button>
            <button class="btn-row-toggle btn text-primary btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="bi bi-caret-down-square"></i></span></button>
            </td>
        </tr>`);
        tableLineDetail.append(`<tr class="" hidden>
            <td colspan="1"></td>
            <td colspan="1">
                <label class="text-primary"><b>Sale code</b></label>
            </td>
            <td colspan="2">
                <label class="text-primary"><b>Value</b></label>
            </td>
            <td colspan="1"></td>
            <td colspan="2">
                <label class="text-primary"><b>Value converted from advance payment</b></label>
            </td>
            <td colspan="1"></td>
            <td colspan="1">
                <label class="text-primary"><b>Sum</b></label>
            </td>
            <td colspan="1"></td>
        </tr>`)
        for (let i = 0; i < sale_code_length; i++) {
            tableLineDetail.append(`<tr class="" hidden>
                <td colspan="1"></td>
                <td colspan="1">
                    <span class="sale_code_product_detail badge badge-outline badge-soft-primary" data-sale-code-id="` + sale_code_list[i] + `"><b>` + sale_code_code_list[i] + `</b></span>
                </td>
                <td colspan="2">
                    <input data-return-type="number" placeholder="Enter payment value" class="value-inp form-control mask-money ">
                </td>
                <td colspan="1">
                    <i class="fas fa-plus text-primary"></i>
                </td>
                <td colspan="2">
                    <div class="input-group">
                        <input data-return-type="number" placeholder="Click button to select payment value" class="value-converted-from-ap-inp form-control mask-money" disabled style="background-color: white; color: black">
                        <button style="border: 1px solid #ced4da" data-bs-toggle="offcanvas" 
                        data-bs-target="#offcanvasSelectDetailAP" aria-controls="offcanvasExample" 
                        class="btn btn-icon btn-flush-primary flush-soft-hover btn-add-payment-value" type="button">
                            <span class="icon"><i class="bi bi-pencil-square text-primary"></i></span>
                        </button>
                    </div>
                </td>
                <td colspan="1">
                    <i class="fas fa-equals text-primary"></i>
                </td>
                <td colspan="1">
                    <span class="mask-money total-value-salecode-item text-primary" data-init-money="0"></span>
                </td>
                <td colspan="1">
                    <script type="application/json" class="detail-ap-items"></script>
                </td>
            </tr>`);
        }

        $.fn.initMaskMoney2();

        $('.value-inp').on('change', function () {
            let value_converted_from_ap = parseFloat($(this).closest('tr').find('.value-converted-from-ap-inp').attr('value'));
            let this_value = parseFloat($(this).attr('value'));
            if (isNaN(value_converted_from_ap)) { value_converted_from_ap = 0; }
            if (isNaN(this_value)) { this_value = 0; }
            $(this).closest('tr').find('.total-value-salecode-item').attr('data-init-money', this_value + value_converted_from_ap);
            $.fn.initMaskMoney2();
        })

        let row_count = count_row(tableLineDetail, 1);

        changePrice('row-' + row_count);
    }
});

$(document).on("click", '.btn-del-line-detail', function () {
    let this_row = $(this).closest('tr');
    let all_child_row = $('.row-detail-product-' + this_row.attr('id').split('-')[1]);
    this_row.remove();
    all_child_row.remove();
    count_row(tableLineDetail, 2);
});

$(document).on("click", '.btn-row-toggle', function() {
    let this_row = $(this).closest('tr');
    let this_product_item = this_row.find('.expense-type-select-box');
    let this_uom = this_row.find('.expense-uom-input');
    let this_quantity = this_row.find('.expense_quantity');
    let this_unit_price = this_row.find('.expense-unit-price-input');
    let this_subtotal_price = this_row.find('.expense-subtotal-price');
    let this_after_tax_subtotal = this_row.find('.expense-subtotal-price-after-tax');
    let this_document_number = this_row.find('.expense-document-number');

    if (this_product_item.val() && this_uom.val() && this_quantity.val() && this_unit_price.attr('value')
        && this_subtotal_price.attr('value') && this_after_tax_subtotal.attr('value') && this_document_number.val())
    {
        let row_number = this_row.attr('id').split('-')[1];
        let detail_product_id = '.row-detail-product-' + row_number;
        if ($(detail_product_id).is(":hidden")) {
            $(detail_product_id).prop('hidden', false);
        }
        else {
            $(detail_product_id).prop('hidden', true);
        }
    }
    else {
        $.fn.notifyB({description: 'Warning: Missing fields in row.'}, 'warning');
    }
});

$(document).on("click", '.btn-add-payment-value', function() {
    $('.total-converted').attr('hidden', true);
    current_value_converted_from_ap = $(this);
    $('.total-product-selected').attr('data-init-money', 0);
    $.fn.initMaskMoney2();
    $('.product-tables').html(``);
    loadAPList([saleCodeEle.val()]);

    $('#offcanvasRightLabel').text($('#offcanvasRightLabel').attr('data-text-1'));
    $('#step1').prop('hidden', false);
    $('#step2').prop('hidden', true);
    $('#next-btn').prop('hidden', false);
    $('#previous-btn').prop('hidden', true);
    $('#finish-btn').prop('hidden', true);
    $('#total-converted').attr('hidden', true);
});

function calculate_sum_ap_product_items() {
    let result_total_value = 0;
    $('.product-tables').find('.total-converted-value').each(function () {
        result_total_value += parseFloat($(this).attr('data-init-money'));
    })
    return result_total_value;
}

$("#next-btn").on('click', function () {
    $('#offcanvasRightLabel').text($('#offcanvasRightLabel').attr('data-text-2'));
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
            selected_ap_code_list.push($(this).closest('td').next('td').text());
        }
    })
    if (selected_ap_list.length === 0) {
            $.fn.notifyB({description: 'Warning: Select at least 1 Advance Payment Item for next step.'}, 'warning');
    }
    else {
        for (let i = 0; i < selected_ap_list.length; i++) {
            $.fn.callAjax(AP_db.attr('data-url-ap-detail').replace('/0', '/' + selected_ap_list[i]), AP_db.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                        let ap_item_detail = data.advance_payment_detail;
                        if (ap_item_detail.expense_items.length > 0) {
                            tab2.append(`<span class="ap-code-span badge badge-primary mb-3">` + selected_ap_code_list[i] + `</span>`)
                            tab2.append(`<table id="expense-item-table-` + ap_item_detail.id + `" class="table nowrap w-100">
                                <thead>
                                    <tr>
                                        <th class="w-5"></th>
                                        <th class="w-10">Expense Items</th>
                                        <th class="w-10">Type</th>
                                        <th class="w-5">Quantity</th>
                                        <th class="w-15">Unit Price</th>
                                        <th class="w-10">Tax</th>
                                        <th class="w-15">Remain</th>
                                        <th class="w-15">Converted Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>`);
                            let product_table = $('#expense-item-table-' + ap_item_detail.id)
                            let total_remain_value = 0;
                            for (let i = 0; i < ap_item_detail.expense_items.length; i++) {
                                let expense_item = ap_item_detail.expense_items[i];
                                let tax_code = '';
                                if (expense_item.expense_tax) {
                                    tax_code = expense_item.expense_tax.code
                                }
                                let disabled = 'disabled';
                                if (expense_item.remain_total > 0) {
                                    disabled = '';
                                }
                                total_remain_value += expense_item.remain_total;
                                product_table.append(`<tr>
                                    <td><input data-id="` + expense_item.id + `" class="product-selected" type="checkbox" ` + disabled + `></td>
                                    <td>` + expense_item.expense_name + `</td>
                                    <td>` + expense_item.expense_type.title + `</td>
                                    <td class="text-center">` + expense_item.expense_quantity + `</td>
                                    <td><span class="text-primary mask-money" data-init-money="` + expense_item.expense_unit_price + `"></span></td>
                                    <td><span class="badge badge-soft-danger">` + tax_code + `</span></td>
                                    <td><span class="text-primary mask-money product-remain-value" data-init-money="` + expense_item.remain_total + `"></span></td>
                                    <td><input class="mask-money form-control converted-value-inp" disabled></td>
                                </tr>`)
                            }
                            product_table.append(`<tr style="background-color: #ebf5f5">
                                <td></td><td></td><td></td><td></td><td></td>
                                <td><span style="text-align: left"><b>Total:</b></span></td>
                                <td><span class="mask-money total-available-value text-primary" data-init-money="` + total_remain_value + `"></span></td>
                                <td><span class="mask-money total-converted-value text-primary" data-init-money="0"></span></td>
                            </tr>`)

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

                                $('.total-product-selected').attr('data-init-money', calculate_sum_ap_product_items());

                                $.fn.initMaskMoney2();
                            });

                            $('.product-selected').on('change', function () {
                                if ($(this).is(':checked')) {
                                    $(this).closest('tr').find('.converted-value-inp').prop('disabled', false);
                                }
                                else {
                                    $(this).closest('tr').find('.converted-value-inp').prop('disabled', true);
                                    $(this).closest('tr').find('.converted-value-inp').attr('value', '');
                                }

                                let new_total_converted_value = 0;
                                $(this).closest('tbody').find('.converted-value-inp').each(function () {
                                    if (parseFloat($(this).attr('value'))) {
                                        new_total_converted_value += parseFloat($(this).attr('value'));
                                    }
                                });
                                $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                $('.total-product-selected').attr('data-init-money', calculate_sum_ap_product_items());

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
    $('#offcanvasRightLabel').text($('#offcanvasRightLabel').attr('data-text-1'));
    $('#step1').prop('hidden', false);
    $('#step2').prop('hidden', true);
    $('#next-btn').prop('hidden', false);
    $('#previous-btn').prop('hidden', true);
    $('#finish-btn').prop('hidden', true);
    $('#total-converted').attr('hidden', true);
})
$("#finish-btn").on('click', function () {
    $('.total-converted').attr('hidden', true);
    let result_total_value = calculate_sum_ap_product_items();
    current_value_converted_from_ap.closest('div').find('.value-converted-from-ap-inp').attr('value', result_total_value);

    let value_input_ap = parseFloat(current_value_converted_from_ap.closest('tr').find('.value-inp').attr('value'));
    if (isNaN(value_input_ap)) {
        value_input_ap = 0;
    }
    current_value_converted_from_ap.closest('tr').find('.total-value-salecode-item').attr('data-init-money', result_total_value + value_input_ap);
    current_value_converted_from_ap.closest('tr').find('.detail-ap-items').text(JSON.stringify(get_ap_product_items()));

    $.fn.initMaskMoney2();
})

function Disable() {
    $('.form-control').prop('disabled', true).css({color: 'black'});
    $('.form-select').prop('disabled', true).css({color: 'black'});
    $('.select2').prop('disabled', true);
    $('input').prop('disabled', true);
    $('#btn-add-row-line-detail').prop('disabled', true);
    $('.btn-del-line-detail').prop('disabled', true);
}

function LoadDetailPayment() {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-payment').attr('data-url-detail').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['payment_detail']?.['workflow_runtime_id']);
                data = data['payment_detail'];
                $.fn.compareStatusShowPageAction(data);
                console.log(data)

                $('#payment-code').text(data.code);
                $('#title').val(data.title);

                let sale_order_mapped = data?.['sale_order_mapped']
                let quotation_mapped = data?.['quotation_mapped']
                let opportunity_mapped = data?.['opportunity_mapped']
                let sale_code_mapped = sale_order_mapped.concat(quotation_mapped).concat(opportunity_mapped)

                saleCodeEle.prop('multiple', true);
                saleCodeEle.addClass('select-multiple select2');
                saleCodeEle.attr('data-placeholder', 'Select MULTI Sale Code');
                PaymentLoadSaleCode(sale_code_mapped)
                PaymentLoadBeneficiary(data.beneficiary)

                if (Object.keys(data?.['supplier']).length !== 0) {
                    PaymentLoadSupplier(data?.['supplier'])
                    InforSpanSupplier(data?.['supplier']);
                    LoadBankAccount(data?.['supplier']?.['bank_accounts_mapped']);
                }

                $('#ap-method').val(data.method);

                $('#created_date_id').val(data.date_created.split(' ')[0]);

                PaymentLoadCreator(initEmployee)

                for (let i = 0; i < data?.['expense_items'].length; i++) {
                    let data_row = data?.['expense_items'][i];
                    let tax_html = ``;
                    if (Object.keys(data_row?.['expense_tax']).length !== 0) {
                        tax_html = `<option selected>${data_row?.['expense_tax']['title']}</option>`;
                    }
                    tableLineDetail.append(`<tr id="row-${parseInt(i+1)}" class="row-number">
                        <td class="number text-center">${parseInt(i+1)}</td>
                        <td><select class="form-select expense-type-select-box"><option selected>${data_row?.['expense_type']['title']}</option></select></td>
                        <td><input class="form-control expense-name-input" value="${data_row?.['expense_description']}"></td>
                        <td><input class="form-control expense-uom-input" value="${data_row?.['expense_uom_name']}"></td>
                        <td><input type="number" min="1" class="form-control expense_quantity" value="${data_row?.['expense_quantity']}"></td>
                        <td><input data-return-type="number" type="text" class="form-control expense-unit-price-input mask-money" value="${data_row?.['expense_unit_price']}"></td>
                        <td><select class="form-select expense-tax-select-box" data-method="GET">${tax_html}</select></td>
                        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money" value="${data_row?.['expense_subtotal_price']}" disabled></td>
                        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money" value="${data_row?.['expense_after_tax_price']}" disabled></td>
                        <td><input type="text" class="form-control expense-document-number" value="${data_row?.['document_number']}"></td>
                        <td>
                        <button class="btn-row-toggle btn text-primary btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="bi bi-caret-down-square"></i></span></button>
                        </td>
                    </tr>`);
                    tableLineDetail.append(`<tr class="" hidden>
                        <td colspan="1"></td>
                        <td colspan="1">
                            <label class="text-primary"><b>Sale code</b></label>
                        </td>
                        <td colspan="2">
                            <label class="text-primary"><b>Value</b></label>
                        </td>
                        <td colspan="1"></td>
                        <td colspan="2">
                            <label class="text-primary"><b>Value converted from advance payment</b></label>
                        </td>
                        <td colspan="1"></td>
                        <td colspan="1">
                            <label class="text-primary"><b>Sum</b></label>
                        </td>
                        <td colspan="1"></td>
                    </tr>`)
                    for (let j = 0; j < data_row?.['expense_ap_detail_list'].length; j++) {
                        let data_row_detail = data_row?.['expense_ap_detail_list'][j];
                        tableLineDetail.append(`<tr class="row-detail-product-1" hidden>
                            <td colspan="1"></td>
                            <td colspan="1">
                                <span class="sale_code_product_detail badge badge-outline badge-soft-primary" data-sale-code-id="${data_row_detail?.['sale_code_mapped']}"><b>${data_row_detail?.['sale_code_mapped_code']}</b></span>
                            </td>
                            <td colspan="2">
                                <input data-return-type="number" placeholder="Enter payment value" class="value-inp form-control mask-money" value="${data_row_detail?.['real_value']}">
                            </td>
                            <td colspan="1">
                                <i class="fas fa-plus text-primary"></i>
                            </td>
                            <td colspan="2">
                                <div class="input-group">
                                    <input data-return-type="number" placeholder="Click button to select payment value" class="value-converted-from-ap-inp form-control mask-money" value="${data_row_detail?.['converted_value']}" disabled>
                                    <button style="border: 1px solid #ced4da" data-bs-toggle="offcanvas" 
                                    data-bs-target="#offcanvasSelectDetailAP" aria-controls="offcanvasExample" 
                                    class="disabled btn btn-icon btn-flush-primary flush-soft-hover btn-add-payment-value" type="button">
                                        <span class="icon"><i class="bi bi-pencil-square text-primary"></i></span>
                                    </button>
                                </div>
                            </td>
                            <td colspan="1">
                                <i class="fas fa-equals text-primary"></i>
                            </td>
                            <td colspan="1">
                                <span class="mask-money total-value-salecode-item text-primary" data-init-money="${data_row_detail?.['sum_value']}" ></span>
                            </td>
                            <td colspan="1">
                                <script type="application/json" class="detail-ap-items"></script>
                            </td>
                        </tr>`);
                    }

                    count_row(tableLineDetail, 1);
                }

                $.fn.initMaskMoney2();

                Disable();
            }
        })
}

class PaymentHandle {
    async load(sale_code_mapped, type) {
        PaymentLoadCreatedDate();
        PaymentLoadCreator(initEmployee);
        PaymentLoadSupplier();
        await getPaymentSaleCode(sale_code_mapped, type);
        $('#btn-add-row-line-detail').removeClass('disabled');
    }
    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();
        if (frm.dataForm['title'] === '') {
            $.fn.notifyB({description: 'Title must not be NULL'}, 'failure');
            return false;
        }

        frm.dataForm['sale_code_list'] = [];
        let sale_code_list = [].concat(saleCodeEle.val());
        for (let i = 0; i < sale_code_list.length; i++) {
            let flag = 0;
            let sale_code_mapped = SO_LIST.filter(function (element) {
                return element.id === sale_code_list[i];
            })
            if (sale_code_mapped.length === 0) {
                flag = 1;
                sale_code_mapped = QUO_LIST.filter(function (element) {
                    return element.id === sale_code_list[i];
                })
            }
            if (sale_code_mapped.length === 0) {
                flag = 2;
                sale_code_mapped = OPP_LIST.filter(function (element) {
                    return element.id === sale_code_list[i];
                })
            }
            if (sale_code_mapped.length > 0 || ![0, 1, 2].includes(flag)) {
                frm.dataForm['sale_code_list'].push({
                    'sale_code_id': sale_code_list[i],
                    'sale_code_detail': flag
                })
            } else {
                $.fn.notifyB({description: 'Sale code detail must be in [0, 1, 2]'}, 'failure');
                return false;
            }
        }

        frm.dataForm['sale_code_type'] = 0;
        if (frm.dataForm['sale_code_list'].length > 1) {
            frm.dataForm['sale_code_type'] = 3;
        }
        if (![0, 3].includes(frm.dataForm['sale_code_type'])) {
            $.fn.notifyB({description: 'Sale code type must be in [0, 3]'}, 'failure');
            return false;
        }

        frm.dataForm['supplier'] = supplierEle.val();

        frm.dataForm['method'] = parseInt($('#ap-method').val());
        if (![0, 1].includes(frm.dataForm['method'])) {
            $.fn.notifyB({description: 'Method must be in [0, 1]'}, 'failure');
            return false;
        }

        frm.dataForm['creator_name'] = PaymentCreatorEle.val();
        if (frm.dataForm['creator_name'] === '') {
            $.fn.notifyB({description: 'Creator name must not be NULL'}, 'failure');
            return false;
        }

        frm.dataForm['beneficiary'] = PaymentBeneficiaryEle.val();
        if (frm.dataForm['beneficiary'] === '') {
            $.fn.notifyB({description: 'Beneficiary name must not be NULL'}, 'failure');
            return false;
        }

        let payment_expense_valid_list = [];
        if (tableLineDetail.find('tr').length > 0) {
            let row_count = tableLineDetail.find('.row-number').length;
            for (let i = 1; i <= row_count; i++) {
                let expense_detail_value = 0;

                let row_id = '#row-' + i.toString();
                let expense_type = tableLineDetail.find(row_id + ' .expense-type-select-box').val();
                let expense_name_input = tableLineDetail.find(row_id + ' .expense-name-input').val();
                let expense_uom_name = tableLineDetail.find(row_id + ' .expense-uom-input').val();
                let expense_quantity = tableLineDetail.find(row_id + ' .expense_quantity').val();
                let expense_tax = tableLineDetail.find(row_id + ' .expense-tax-select-box option:selected').attr('value');
                let expense_unit_price = parseFloat(tableLineDetail.find(row_id + ' .expense-unit-price-input').attr('value'));
                let expense_subtotal_price = parseFloat(tableLineDetail.find(row_id + ' .expense-subtotal-price').attr('value'));
                let expense_after_tax_price = parseFloat(tableLineDetail.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));
                let tax_rate = 0;
                if (tableLineDetail.find(row_id + ' .expense-tax-select-box').val()) {
                    let tax_selected = JSON.parse($('#' + tableLineDetail.find(row_id + ' .expense-tax-select-box').attr('data-idx-data-loaded')).text())[tableLineDetail.find(row_id + ' .expense-tax-select-box').val()];
                    tax_rate = parseFloat(tax_selected.rate);
                }
                let document_number = tableLineDetail.find(row_id + ' .expense-document-number').val();

                let expense_ap_detail_list = [];
                let sale_code_len = sale_code_list.length;
                let sale_code_item = tableLineDetail.find(row_id).nextAll().slice(1, sale_code_len + 1);
                sale_code_item.each(function() {
                    let expense_items_detail_list = [];
                    if ($(this).find('.detail-ap-items').html()) {
                        expense_items_detail_list = JSON.parse($(this).find('.detail-ap-items').html());
                    }
                    let real_value = 0;
                    if ($(this).find('.value-inp').attr('value') !== '') {
                        real_value = $(this).find('.value-inp').attr('value');
                    }
                    let converted_value = $(this).find('.value-converted-from-ap-inp').attr('value');
                    if (expense_items_detail_list.length <= 0) {
                        converted_value = 0;
                    }
                    let sum_value = 0;
                    if ($(this).find('.total-value-salecode-item').attr('data-init-money') !== '') {
                        sum_value = $(this).find('.total-value-salecode-item').attr('data-init-money');
                    }
                    expense_ap_detail_list.push({
                        'sale_code_mapped': $(this).find('.sale_code_product_detail').attr('data-sale-code-id'),
                        'sale_code_mapped_code': $(this).find('.sale_code_product_detail').text(),
                        'real_value': real_value,
                        'converted_value': converted_value,
                        'sum_value': sum_value,
                        'expense_items_detail_list': expense_items_detail_list
                    })
                    expense_detail_value = parseFloat(expense_detail_value) + parseFloat(sum_value);
                });
                if (!isNaN(expense_subtotal_price) && !isNaN(expense_after_tax_price)) {
                    payment_expense_valid_list.push({
                        'expense_type_id': expense_type,
                        'expense_description': expense_name_input,
                        'expense_uom_name': expense_uom_name,
                        'expense_quantity': expense_quantity,
                        'expense_unit_price': expense_unit_price,
                        'expense_tax_id': expense_tax,
                        'expense_tax_price': expense_subtotal_price * tax_rate / 100,
                        'expense_subtotal_price': expense_subtotal_price,
                        'expense_after_tax_price': expense_after_tax_price,
                        'document_number': document_number,
                        'expense_ap_detail_list': expense_ap_detail_list
                    })
                }

                if (expense_after_tax_price !== expense_detail_value) {
                    $.fn.notifyB({description: 'Detail tab - line ' + i.toString() + ': product value must be equal to sum Sale Code value.'}, 'failure');
                    return false;
                }
            }
        }

        frm.dataForm['payment_expense_valid_list'] = payment_expense_valid_list;

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}
