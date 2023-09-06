const initEmployee = JSON.parse($('#employee_current').text());
let PaymentCreatorEle = $('#creator-select-box')
let PaymentBeneficiaryEle = $('#beneficiary-select-box')
let supplierEle = $('#supplier-select-box')

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

function InforSpanBeneficiary(data) {
    let btn_detail = $('#btn-detail-beneficiary-tab');
    $('#beneficiary-detail-span').prop('hidden', false);
    $('#beneficiary-name').text(data?.['full_name']);
    $('#beneficiary-code').text(data?.['code']);
    $('#beneficiary-department').text(data?.['group']['title']);
    let url = btn_detail.attr('data-url').replace('0', data?.['id']);
    btn_detail.attr('href', url);
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

class PaymentHandle {
    load() {
        PaymentLoadCreatedDate();
        PaymentLoadCreator(initEmployee);
        PaymentLoadBeneficiary(initEmployee);
        InforSpanBeneficiary(initEmployee);
        APLoadSupplier();
    }
}