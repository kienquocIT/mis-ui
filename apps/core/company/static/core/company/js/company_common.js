let companyCityEle = $('#company-address-city')
let companyDistrictEle = $('#company-address-district')
let companyWardEle = $('#company-address-ward')
let primary_currency = $('#primary-currency')
let VND_currency = {}
if ($('#VND_currency').text() !== '') {
    VND_currency = JSON.parse($('#VND_currency').text())
}

function loadCompanyCities(cityData) {
    companyCityEle.initSelect2({
        data: (cityData ? cityData : null),
        keyResp: 'cities',
    }).on('change', function () {
        let dataParams = JSON.stringify({'city_id': $(this).val()});
        companyDistrictEle.attr('data-params', dataParams).val("");
        companyWardEle.attr('data-params', '{}').val("");
    });
}

function loadCompanyDistrict(disData) {
    companyDistrictEle.initSelect2({
        data: (disData ? disData : null),
        keyResp: 'districts',
    }).on('change', function () {
        let dataParams = JSON.stringify({'district_id': $(this).val()});
        companyWardEle.attr('data-params', dataParams).val("");
    });
}

function loadCompanyWard(wardData) {
    companyWardEle.initSelect2({
        data: (wardData ? wardData : null),
        keyResp: 'wards',
    });
}

$('#save-changes-modal-company-address').on('click', function () {
    let company_address_modal = $('#detail-company-address-modal');
    try {
        let detail_company_address = company_address_modal.val();
        let city = companyCityEle.find(`option:selected`).text();
        let district = companyDistrictEle.find(`option:selected`).text();
        let ward = companyWardEle.find(`option:selected`).text();

        let company_address = '';
        if (city !== '' && district !== '' && detail_company_address !== '') {

            if (ward === '') {
                company_address = detail_company_address + ', ' + district + ', ' + city;
            } else {
                company_address = detail_company_address + ', ' + ward + ', ' + district + ', ' + city;
            }

            company_address_modal.val('');
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }

        if (company_address !== '') {
            $('#address').val(company_address);
        }
    } catch (error) {
        $.fn.notifyB({description: "No address information!"}, 'failure');
    }
})

let schema_item_list = $('#schema-item-list');
let current_schema_row = null;

const schema_item_list_value = [
    '{Number}',
    '{Short year}',
    '{Long year}',
    '{Short month}',
    '{Long month}',
    '{Month of year}',
    '{Week of year}',
    '{Day of year}',
    '{Day of month}',
    '{Day of week}'
]

$('.schema-item').on('click', function () {
    let old_content = schema_item_list.val();
    if (old_content === '') {
        schema_item_list.val(schema_item_list_value[parseInt($(this).attr('data-value'))])
    }
    else {
        schema_item_list.val(old_content + '-' + schema_item_list_value[parseInt($(this).attr('data-value'))])
    }
})

$(document).on("click", '.schema-custom', function () {
    current_schema_row = $(this).closest('tr');
})

$(document).on("click", '.numbering-by-selection', function () {
    current_schema_row = $(this).closest('tr');
    if ($(this).val() === '0') {
        current_schema_row.find('.schema-custom').prop('hidden', true);
        current_schema_row.find('.schema-show').text('');
    }
    else {
        current_schema_row.find('.schema-custom').prop('hidden', false);
    }
})

function formatInputSchema() {
    let schema_item_value_list = schema_item_list.val().split('-');
    for (let i = 0; i < schema_item_value_list.length; i++) {
        if (schema_item_value_list[i] !== '') {
            if (!schema_item_list_value.includes(schema_item_value_list[i])) {
                if (schema_item_value_list[i].includes('{') || schema_item_value_list[i].includes('}')) {
                    return false;
                }
            }
        }
    }
    return true;
}

function formatSubmitSchema(raw_schema) {
    let raw_schema_item_list = raw_schema.split('-');
    let formatted_schema = '';
    for (let i = 0; i < raw_schema_item_list.length; i++) {
        if (schema_item_list_value.includes(raw_schema_item_list[i])) {
            let format_value = schema_item_list_value.indexOf(raw_schema_item_list[i]);
            formatted_schema = formatted_schema + format_value.toString();
        }
        else {
            formatted_schema = formatted_schema + '[' + raw_schema_item_list[i] + ']';
        }
    }
    return formatted_schema;
}

$('#save-changes-modal-function-number').on('click', function () {
    if (formatInputSchema()) {
        let schema = schema_item_list.val();
        let first_number = $('#first-number').val();
        let last_number = $('#last-number').val();
        let reset_frequency = $('#reset-frequency').val();
        if (schema !== '' && first_number !== '' && last_number !== '' && reset_frequency !== '') {
            let content_json = {
                'schema': formatSubmitSchema(schema),
                'first_number': first_number,
                'last_number': last_number,
                'reset_frequency': reset_frequency
            }
            current_schema_row.find('.schema-show').text(schema);
            current_schema_row.find('.schema-json').text(JSON.stringify(content_json));
            $('#modal-function-number').hide();
        }
        else {
            $.fn.notifyB({description: "Missing information!"}, 'failure');
        }
    }
    else {
        $.fn.notifyB({description: "Wrong schema format!"}, 'warning');
    }
})

function loadPrimaryCurrency(data) {
    primary_currency.initSelect2({
        ajax: {
            url: primary_currency.attr('data-url'),
            method: 'GET',
        },
        templateResult: function(data) {
            let ele = $('<div class="row col-12"></div>');
            ele.append('<div class="col-10">' + data.data?.['title'] + '</div>');
            ele.append('<div class="col-2">' + data.data?.['abbreviation'] + '</div>');
            return ele;
        },
        data: (data ? data : null),
        keyResp: 'currency_list',
        keyId: 'id',
        keyText: 'title'
    })
}

function loadFunctionNumberTable(table_data=[]) {
    $('#function_number_table').DataTableDefault({
        dom: '',
        rowIdx: true,
        paging: false,
        data: table_data,
        columns: [
            {
                className: 'wrap-text w-5',
                render: () => {
                    return ``;
                }
            }, {
                data: 'function',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="text-primary">${row.function}</span>`;
                }
            }, {
                data: '',
                className: 'wrap-text w-15',
                render: () => {
                    return `<select class="select2 form-select numbering-by-selection">
                        <option value="0" selected>System</option>
                        <option value="1">User defined</option>
                    </select>`;
                }
            }, {
                data: '',
                className: 'wrap-text w-45',
                render: () => {
                    return `<script class="schema-json"></script><span class="schema-show text-primary"></span>`;
                }
            }, {
                data: '',
                className: 'wrap-text text-center w-10',
                render: () => {
                    return `<span class="text-primary schema-custom" hidden data-bs-toggle="modal" data-bs-target="#modal-function-number"><i class="far fa-edit"></i></span>`;
                }
            }
        ],
    })
}

const FunctionNumberTableData = [
    {
        'function': 'Opportunity'
    },
    {
        'function': 'Sale quotation'
    },
    {
        'function': 'Sale order'
    },
    {
        'function': 'Picking'
    },
    {
        'function': 'Delivery'
    },
    {
        'function': 'Task'
    },
    {
        'function': 'Advance payment'
    },
    {
        'function': 'Payment'
    },
    {
        'function': 'Return payment'
    },
    {
        'function': 'Purchase request'
    }
]

class CompanyHandle {
    load() {
        loadCompanyCities();
        loadCompanyDistrict();
        loadCompanyWard();
        loadPrimaryCurrency(VND_currency);
        loadFunctionNumberTable(FunctionNumberTableData);
    }
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['code'] = $('#code').val();
        frm.dataForm['representative_fullname'] = $('#representative_fullname').val();
        frm.dataForm['address'] = $('#address').val();
        frm.dataForm['email'] = $('#email').val();
        frm.dataForm['phone'] = $('#phone').val();
        frm.dataForm['fax'] = $('#fax').val();

        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        else {
            return {
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }

    }
}

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
        $('.select2').prop('disabled', true);
        $('input').prop('disabled', true);
    }
}

function LoadDetailCompany(option) {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#frm-detail-company').attr('data-url-detail').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['company_detail']?.['workflow_runtime_id']);
                data = data['company_detail'];
                console.log(data)
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                $('#title').val(data.title);
                $('#code').val(data.code);
                $('#representative_fullname').val(data.representative_fullname);
                $('#address').val(data.address);
                $('#email').val(data.email);
                $('#phone').val(data.phone);
                $('#fax').val(data.fax);

                $.fn.initMaskMoney2();

                Disable(option);
            }
        })
}

$("tbody").on("click", "#del-company-button", function (event){
    event.preventDefault();
    if (confirm("Confirm delete ?") === true) {
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let user_id = $(this).attr('data-id');
        let url = '/company/delete/' + user_id
        $.fn.callAjax(url, "delete", {'user_id': user_id}, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'description': 'Successfully.'}, 'success');
                        setTimeout(location.reload.bind(location), 1000);
                    }
                }, (errs) => {
                    $.fn.notifyB({description: errs.detail}, 'failure')
                }
            )
    }
});
