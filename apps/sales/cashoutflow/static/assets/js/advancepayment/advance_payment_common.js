const initEmployee = JSON.parse($('#employee_current').text());

let APCreatorEle = $('#creator-select-box')
let APBeneficiaryEle = $('#beneficiary-select-box')
let saleCodeEle = $('#sale-code-select-box')
let APTypeEle = $('#type-select-box')
let supplierEle = $('#supplier-select-box')
saleCodeEle.prop('disabled', true)

let OPP_LIST = [];

$('.sale_code_type').on('change', function () {
    $('#btn-change-sale-code-type').text($('input[name="sale_code_type"]:checked').val())
    if ($(this).val() === 'sale') {
        $('#sale-code-label-id').addClass('required');
        getSaleCode();
        saleCodeEle.prop('disabled', false);
        APBeneficiaryEle.prop('disabled', false);
    }
    else if ($(this).val() === 'non-sale') {
        $('#sale-code-label-id').removeClass('required');
        APLoadSaleCode([{}]);
        saleCodeEle.prop('disabled', true);
        APBeneficiaryEle.prop('disabled', true);
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

APTypeEle.on('change', function () {
    if (APTypeEle.val() === '1') {
        supplierEle.prop('disabled', false);
        APLoadSupplier();
    }
    else {
        supplierEle.prop('disabled', true);
    }
})

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
}