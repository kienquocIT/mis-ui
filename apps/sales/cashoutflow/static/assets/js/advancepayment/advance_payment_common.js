const initEmployee = JSON.parse($('#employee_current').text());
let APCreatorEle = $('#creator-select-box')
let APBeneficiaryEle = $('#beneficiary-select-box')
let saleCodeEle = $('#sale-code-select-box')
let saleCodeTypeEle = $('.sale_code_type')
let APTypeEle = $('#type-select-box')
let supplierEle = $('#supplier-select-box')
let tableLineDetail = $('#tab_line_detail_datatable')
let money_gave = $('#money-gave')
let OPP_LIST = [];
let QUO_LIST = [];
let SO_LIST = [];

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
        APBeneficiaryEle.prop('disabled', false);
        getSaleCode();
    }
    else if ($(this).val() === '2') {
        btn_sale_code_type.text('Non-sale');
        $('#sale-code-label-id').removeClass('required');
        saleCodeEle.prop('disabled', true);
        APBeneficiaryEle.prop('disabled', true);
    }
})

APTypeEle.on('change', function () {
    if (APTypeEle.val() === '1') {
        supplierEle.prop('disabled', false);
        APLoadSupplier();
    }
    else {
        supplierEle.prop('disabled', true);
    }
})

function InforSpanBeneficiary(data) {
    let btn_detail = $('#btn-detail-beneficiary-tab');
    $('#beneficiary-detail-span').prop('hidden', false);
    $('#beneficiary-name').text(data?.['full_name']);
    $('#beneficiary-code').text(data?.['code']);
    $('#beneficiary-department').text(data?.['group']['title']);
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

function APLoadCreator(data) {
    APCreatorEle.append(`<option value="${data['id']}" selected>${data['full_name']}</option>`);
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

function APLoadBeneficiary(data, filter=[]) {
    APBeneficiaryEle.initSelect2({
        ajax: {
            url: APBeneficiaryEle.attr('data-url'),
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
        let obj_selected = JSON.parse($('#' + APBeneficiaryEle.attr('data-idx-data-loaded')).text())[APBeneficiaryEle.val()];
        InforSpanBeneficiary(obj_selected);
    })
}

function getSaleCode() {
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
        APLoadSaleCode([{}].concat(sale_code_list));
    }).catch((error) => {
        console.log(error)
        $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
    });
}

function APLoadSaleCode(sale_code) {
    saleCodeEle.initSelect2({
        templateResult: function(data) {
            let ele = $('<div class="row col-12"></div>');
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
            APLoadBeneficiary(initEmployee, sale_team)
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

            let call_ap_list = $.fn.callAjax($('#form-create-advance').attr('data-url-list'), 'GET').then((resp) => {
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
        loadProductList('row-' + count.toString());
        loadProductTaxList('row-' + count.toString());
        loadProductUomList('row-' + count.toString());
    }
    return count;
}

function loadProductList(row_id, data) {
    let ele = $('#' + row_id + ' .product-select-box');
    ele.initSelect2({
        ajax: {
            url: tableLineDetail.attr('data-url-product-list'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let obj_selected = JSON.parse($('#' + $(this).attr('data-idx-data-loaded')).text())[$(this).val()];
        let parent_tr = $(this).closest('tr');
        parent_tr.find('.product-type').val(obj_selected?.['general_product_type']['title']);
        loadProductTaxList(parent_tr.attr('id'), obj_selected?.['sale_tax'] ? obj_selected?.['sale_tax'] : null);
        loadProductUomList(parent_tr.attr('id'), obj_selected?.['general_uom_group']['id'], obj_selected?.['sale_default_uom']);
        changePrice(parent_tr.attr('id'));
        LoadPriceList(parent_tr.attr('id'), obj_selected?.['price_list_mapped'])

        $('#' + parent_tr.attr('id') + ' .product-unit-price-select-box').attr('value', '');
        $('#' + parent_tr.attr('id') + ' .product-quantity').val(1);
        $('#' + parent_tr.attr('id') + ' .product-subtotal-price').attr('value', '');
        $('#' + parent_tr.attr('id') + ' .product-subtotal-price-after-tax').attr('value', '');
    })
}

function loadProductTaxList(row_id, data) {
    let ele = $('#' + row_id + ' .product-tax-select-box');
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

function loadProductUomList(row_id, uom_group_id, data) {
    let ele = $('#' + row_id + ' .product-uom-select-box');
    ele.initSelect2({
        ajax: {
            url: tableLineDetail.attr('data-url-uom-list'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [data];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].group.id === uom_group_id) {
                    result.push(resp.data[keyResp][i])
                }
            }
            if (result.length > 0) {
                $('.select2-results__message').prop('hidden', true);
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'unit_of_measure',
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
        let subtotal = parseFloat(table_body.find(row_id + ' .product-subtotal-price').attr('value'));
        let subtotal_after_tax = parseFloat(table_body.find(row_id + ' .product-subtotal-price-after-tax').attr('value'));
        let tax_selected = JSON.parse($('#' + table_body.find(row_id + ' .product-tax-select-box').attr('data-idx-data-loaded')).text())[table_body.find(row_id + ' .product-tax-select-box').val()];
        let tax_rate = tax_selected.rate;
        if (!isNaN(subtotal) && !isNaN(subtotal_after_tax) && tax_rate !== undefined) {
            sum_subtotal = sum_subtotal + subtotal;
            sum_subtotal_price_after_tax = sum_subtotal_price_after_tax + subtotal_after_tax;
            sum_tax = sum_tax + subtotal * parseFloat(tax_rate) / 100;
        }
    }
    pretax_div.attr('data-init-money', sum_subtotal);
    taxes_div.attr('data-init-money', sum_tax);
    total_div.attr('data-init-money', sum_subtotal_price_after_tax);
    $.fn.initMaskMoney2();
}

function changePriceCommon(tr) {
    let unit_price = tr.find('.product-unit-price-select-box');
    let quantity = tr.find('.product-quantity');
    let subtotal = tr.find('.product-subtotal-price');
    let subtotal_after_tax = tr.find('.product-subtotal-price-after-tax');
    let tax_selected = JSON.parse($('#' + tr.find('.product-tax-select-box').attr('data-idx-data-loaded')).text())[tr.find('.product-tax-select-box').val()];
    let tax_rate = tax_selected.rate;
    $.fn.initMaskMoney2();
    if (unit_price.attr('value') && quantity.val() && tax_rate !== undefined) {
        let subtotal_value = parseFloat(unit_price.attr('value')) * parseInt(quantity.val())
        subtotal.attr('value', subtotal_value);
        subtotal_after_tax.attr('value', subtotal_value + subtotal_value * parseFloat(tax_rate) / 100);
    }
    else {
        unit_price.attr('value', '');
        subtotal.attr('value', '');
        subtotal_after_tax.attr('value', '');
    }
    calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
}

function changePrice(row_id) {
    $('#' + row_id + ' .product-unit-price-select-box').on('change', function () {
        changePriceCommon($(this).closest('tr'));
    })
    $('#' + row_id + ' .product-tax-select-box').on('change', function () {
        changePriceCommon($(this).closest('tr'));
    })
    $('#' + row_id + ' .product-quantity').on('change', function () {
        changePriceCommon($(this).closest('tr'));
    })
}

function LoadPriceList(row_id, data) {
    let html = ``;
    for (let i = 0; i < data.length; i++) {
        html += `<div class="dropdown-item">
                    <div class="row">
                        <label class="col-7" data-price-list-id="${data[i].id}">${data[i].title}</label>
                        <span class="col-5 text-primary text-right mask-money unit-price-value" data-init-money="${data[i].price}"></span>
                    </div>
                </div>`
    }
    $('#' + row_id + ' .dropdown-menu').html(html);
    $('.dropdown-item').on('click', function () {
        let unit_price_value = $(this).find('.unit-price-value').attr('data-init-money');
        $(this).closest('.input-group').find('.product-unit-price-select-box').attr('value', unit_price_value);
        changePriceCommon($(this).closest('.input-group').find('.product-unit-price-select-box').closest('tr'));
        $.fn.initMaskMoney2();
    })
    $.fn.initMaskMoney2();
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

$(document).on("click", '#btn-add-row-line-detail', function () {
    let table_body = $('#tab_line_detail_datatable tbody');
    table_body.append(`<tr id="" class="row-number">
        <td class="number text-center"></td>
        <td><select class="form-select product-select-box" data-method="GET"><option selected></option></select></td>
        <td><input class="form-control product-type" style="color: black; background: none" disabled></td>
        <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
        <td><input type="number" min="1" class="form-control product-quantity" value="1"></td>
        <td>
            <div class="input-group">
                <input data-return-type="number" type="text" class="form-control product-unit-price-select-box mask-money">
                <button type="button" data-bs-toggle="dropdown" class="dropdown-toggle btn-choose-from-price-list btn btn-outline-secondary" title="Choose from Price List"><span class="icon"><i class="bi bi-list"></i></span></button>
                <div class="dropdown-menu w-600p"></div>
            </div>
        </td>
        <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
        <td><input type="text" data-return-type="number" class="form-control product-subtotal-price mask-money" style="color: black; background: none" disabled></td>
        <td><input type="text" data-return-type="number" class="form-control product-subtotal-price-after-tax mask-money" style="color: black; background: none" disabled></td>
        <td><button class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
    </tr>`);

    $.fn.initMaskMoney2();

    count_row(table_body, 1);

    $('.btn-del-line-detail').on('click', function () {
        $(this).closest('tr').remove();
        count_row(table_body, 2);
        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
    })
});

$('#recalculate-price').on('click', function () {
    calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
})

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
                $.fn.compareStatusShowPageAction(data);

                $('#ap-code').text(data.code);

                $('#title').val(data.title);

                let plan_dtb = $('#tab_plan_datatable');
                plan_dtb.DataTable().clear().destroy();
                plan_dtb.prop('hidden', true);
                $('#notify-none-sale-code').prop('hidden', false);
                let btn_sale_code_type = $('#btn-change-sale-code-type');
                if (data.sale_code_type === 0) {
                    $("#radio-sale").prop("checked", true);
                    btn_sale_code_type.text('Sale');
                    $('#sale-code-label-id').addClass('required');
                    saleCodeEle.prop('disabled', false);
                    APBeneficiaryEle.prop('disabled', false);
                }
                else if (data.sale_code_type === 2) {
                    $("#radio-sale").prop("checked", true);
                    btn_sale_code_type.text('Non-sale');
                    $('#sale-code-label-id').removeClass('required');
                    saleCodeEle.prop('disabled', true);
                    APBeneficiaryEle.prop('disabled', true);
                }

                let sale_code = null;
                if (data?.['opportunity_mapped'].length > 0) {
                    sale_code = data?.['opportunity_mapped'][0];
                }
                if (data?.['quotation_mapped'].length > 0) {
                    sale_code = data?.['quotation_mapped'][0];
                }
                if (data?.['sale_order_mapped'].length > 0) {
                    sale_code = data?.['sale_order_mapped'][0];
                }
                APLoadSaleCode(sale_code);

                APTypeEle.val(data.advance_payment_type);

                APLoadSupplier(data.supplier);

                $('#ap-method').val(data.method);

                $('#created_date_id').val(data.date_created.split(' ')[0])

                $('#return_date_id').val(data.return_date.split(' ')[0])

                APLoadCreator(initEmployee);

                APLoadBeneficiary(data.beneficiary);

                if (Object.keys(data?.['supplier']).length !== 0) {
                    InforSpanSupplier(data?.['supplier']);
                    LoadBankAccount(data?.['supplier']?.['bank_accounts_mapped']);
                }

                InforSpanBeneficiary(data?.['beneficiary']);

                let sale_code_selected_id = saleCodeEle.val();
                let call_ap_list = $.fn.callAjax($('#form-detail-advance').attr('data-url-list'), 'GET').then((resp) => {
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
                    if (data.sale_code_type === 0) {
                        loadSaleOrderProduct(sale_code_selected_id, all_product_items);
                    }
                    if (data.sale_code_type === 1) {
                        loadQuotationProduct(sale_code_selected_id, all_product_items);
                    }
                }).catch((error) => {
                    console.log(error)
                    $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
                });

                let table_body = $('#tab_line_detail_datatable tbody');
                for (let i = 0; i < data?.['product_items'].length; i++) {
                    table_body.append(`<tr id="" class="row-number">
                        <td class="number text-center"></td>
                        <td><select class="form-select product-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input class="form-control product-type" style="color: black; background: none" disabled></td>
                        <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input type="number" min="1" class="form-control product-quantity" value="1"></td>
                        <td>
                            <div class="input-group">
                                <input data-return-type="number" type="text" class="form-control product-unit-price-select-box mask-money">
                                <button type="button" data-bs-toggle="dropdown" class="dropdown-toggle btn-choose-from-price-list btn btn-outline-secondary" title="Choose from Price List"><span class="icon"><i class="bi bi-list"></i></span></button>
                                <div class="dropdown-menu w-600p"></div>
                            </div>
                        </td>
                        <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input type="text" data-return-type="number" class="form-control product-subtotal-price mask-money" style="color: black; background: none" disabled></td>
                        <td><input type="text" data-return-type="number" class="form-control product-subtotal-price-after-tax mask-money" style="color: black; background: none" disabled></td>
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
                    loadProductList(row_id, data?.['product_items'][i]['product']);
                    let rowEle = $('#'+row_id);
                    rowEle.find('.product-type').val(data?.['product_items'][i]['product']['type']['title']);
                    rowEle.find('.product-quantity').val(data?.['product_items'][i]['product_quantity']);
                    rowEle.find('.product-unit-price-select-box').attr('value', data?.['product_items'][i]['unit_price']);
                    rowEle.find('.product-subtotal-price').attr('value', data?.['product_items'][i]['subtotal_price']);
                    rowEle.find('.product-subtotal-price-after-tax').attr('value', data?.['product_items'][i]['after_tax_price']);
                    loadProductTaxList(row_id, data?.['product_items'][i]['tax'] ? data?.['product_items'][i]['tax'] : null);
                    loadProductUomList(row_id, null, data?.['product_items'][i]['product_uom']);
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
    load() {
        APLoadCreatedDate();
        APLoadReturnDate();
        APLoadCreator(initEmployee);
        APLoadBeneficiary(initEmployee);
        InforSpanBeneficiary(initEmployee);
        APLoadSupplier();
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
                urlRedirect: frm.dataUrlRedirect.format_url_with_uuid(pk),
            };
        }

        frm.dataForm['title'] = $('#title').val();

        frm.dataForm['supplier'] = supplierEle.val();

        frm.dataForm['return_date'] = $('#return_date_id').val();

        frm.dataForm['sale_code_type'] = parseInt($('input[name="sale_code_type"]:checked').val());
        if (![0, 1, 2].includes(frm.dataForm['sale_code_type'])) {
            $.fn.notifyB({description: 'Sale code type must be in [0, 1, 2]'}, 'failure');
            return false;
        }

        frm.dataForm['method'] = parseInt($('#ap-method').val());
        if (![0, 1].includes(frm.dataForm['method'])) {
            $.fn.notifyB({description: 'Method must be in [0, 1]'}, 'failure');
            return false;
        }


        frm.dataForm['advance_payment_type'] = parseInt(APTypeEle.val())
        if (![0, 1].includes(frm.dataForm['advance_payment_type'])) {
            $.fn.notifyB({description: 'Advance Payment type must be in [0, 1, 2]'}, 'failure');
            return false;
        }

        frm.dataForm['creator_name'] = APCreatorEle.val();
        if (frm.dataForm['creator_name'] === '') {
            $.fn.notifyB({description: 'Creator name must not be NULL'}, 'failure');
            return false;
        }

        frm.dataForm['beneficiary'] = APBeneficiaryEle.val();
        if (frm.dataForm['beneficiary'] === '') {
            $.fn.notifyB({description: 'Beneficiary name must not be NULL'}, 'failure');
            return false;
        }

        if (tableLineDetail.find('tbody tr').length > 0) {
            let table_body = tableLineDetail.find('tbody');
            let row_count = table_body.find('tr').length;
            let product_valid_list = [];
            for (let i = 1; i <= row_count; i++) {
                let row_id = '#row-' + i.toString();
                let product_selected = table_body.find(row_id + ' .product-select-box option:selected');
                let uom_selected = table_body.find(row_id + ' .product-uom-select-box option:selected');
                let subtotal_value = parseFloat(table_body.find(row_id + ' .product-subtotal-price').attr('value'));
                let subtotal_after_tax_value = parseFloat(table_body.find(row_id + ' .product-subtotal-price-after-tax').attr('value'));
                let tax_rate = 0;
                let data_tax = $('#' + table_body.find(row_id + ' .product-tax-select-box').attr('data-idx-data-loaded')).text();
                if (data_tax !== '') {
                    let tax_selected = JSON.parse(data_tax)[table_body.find(row_id + ' .product-tax-select-box').val()];
                    tax_rate = parseFloat(tax_selected.rate);
                }
                let unit_price_value = parseFloat(table_body.find(row_id + ' .product-unit-price-select-box').attr('value'));
                if (!isNaN(subtotal_value) && !isNaN(subtotal_after_tax_value) && tax_rate !== undefined) {
                    product_valid_list.push({
                        'product_id': product_selected.attr('value'),
                        'unit_of_measure_id': uom_selected.attr('value'),
                        'quantity': table_body.find(row_id + ' .product-quantity').val(),
                        'tax_id': table_body.find(row_id + ' .product-tax-select-box option:selected').attr('value'),
                        'unit_price': unit_price_value,
                        'tax_price': subtotal_value * tax_rate / 100,
                        'subtotal_price': subtotal_value,
                        'after_tax_price': subtotal_after_tax_value,
                    })
                }
            }
            frm.dataForm['product_valid_list'] = product_valid_list;
        }

        frm.dataForm['money_gave'] = money_gave.is(':checked');

        if (saleCodeEle.val() !== '') {
            let type = 0;
            let sale_code_selected = SO_LIST.filter(function (element) {
                return element.id === saleCodeEle.val();
            });
            if (sale_code_selected.length === 0) {
                sale_code_selected = QUO_LIST.filter(function (element) {
                    return element.id === saleCodeEle.val();
                })
                type = 1;
            }
            if (sale_code_selected.length === 0) {
                sale_code_selected = OPP_LIST.filter(function (element) {
                    return element.id === saleCodeEle.val();
                })
                type = 2;
            }
            if (sale_code_selected.length !== 0) {
                frm.dataForm['sale_code'] = {
                    'id': saleCodeEle.val(),
                    'type': type
                }
            }
        }
        else {
            delete frm.dataForm['sale_code']
        }

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}
