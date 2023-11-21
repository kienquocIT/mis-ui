let companyCityEle = $('#company-address-city')
let companyDistrictEle = $('#company-address-district')
let companyWardEle = $('#company-address-ward')
let primary_currency = $('#primary-currency')
let VND_currency = {}
const VND_currency_text = $('#VND_currency').text()
if (VND_currency_text) {
    VND_currency = JSON.parse(VND_currency_text)
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
        if (city && district && detail_company_address) {

            if (ward === '') {
                company_address = detail_company_address + ', ' + district + ', ' + city;
            } else {
                company_address = detail_company_address + ', ' + ward + ', ' + district + ', ' + city;
            }

            company_address_modal.val('');
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }

        if (company_address) {
            $('#address').val(company_address);
        }
    } catch (error) {
        $.fn.notifyB({description: "No address information!"}, 'failure');
    }
})

let schema_item_list = $('#schema-item-list');
let first_number_ele = $('#first-number');
let last_number_ele = $('#last-number');
let reset_frequency_ele = $('#reset-frequency');
let min_num_char_ele = $('#min_num_char');
let min_num_char_checkbox_ele = $('#min_num_char_checkbox');
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

// Create a new Date object
const currentDate= new Date();
const fullYear= currentDate.getFullYear();
const shortYear= fullYear.toString().slice(-2);
function getISOWeekNumber(date) {
  const diff= date - new Date(date.getFullYear(), 0, 1) + 1;
  return Math.ceil(diff / 604800000); // 604800000 is 7 days in milliseconds
}
const monthOfYear = currentDate.getMonth() + 1;
const weekOfYear = getISOWeekNumber(currentDate);
const dayOfYear = Math.floor((currentDate - new Date(fullYear, 0, 0)) / 86400000);
const dayOfMonth = currentDate.getDate();
const dayOfWeek = currentDate.getDay() || 7;

const schema_item_preview = [
    '#number',
    shortYear.toString(),
    fullYear.toString(),
    currentDate.toLocaleString('default', { month: 'short' }),
    currentDate.toLocaleString('default', { month: 'long' }),
    monthOfYear.toString(),
    weekOfYear.toString(),
    dayOfYear.toString(),
    dayOfMonth.toString(),
    dayOfWeek.toString()
]

min_num_char_checkbox_ele.on('change', function () {
    if ($(this).is(':checked')) {
        min_num_char_ele.prop('disabled', false);
    }
    else {
        min_num_char_ele.val('').prop('disabled', true);
    }
    Preview()
})

min_num_char_ele.on('change', function () {
    Preview()
})

schema_item_list.on('input', function () {
    Preview()
})

first_number_ele.on('input', function () {
    Preview()
})

last_number_ele.on('input', function () {
    Preview()
})

function Preview() {
    let raw_schema = schema_item_list.val();
    if (raw_schema && last_number_ele.val() && first_number_ele) {
        let raw_schema_item_list = raw_schema.match(/{([^}]+)}/g);
        let code_1 = raw_schema;
        let code_2 = raw_schema;
        for (let i = 0; i < raw_schema_item_list.length; i++) {
            if (schema_item_list_value.includes(raw_schema_item_list[i])) {
                let format_value = schema_item_list_value.indexOf(raw_schema_item_list[i]);
                if (format_value === 0) {
                    let min_char_number = parseInt(min_num_char_ele.val()) ? min_num_char_ele.val() : 0;
                    code_1 = code_1.replace(raw_schema_item_list[i], last_number_ele.val().padStart(min_char_number, '0'));
                    code_2 = code_2.replace(raw_schema_item_list[i], (parseInt(last_number_ele.val()) + 1).toString().padStart(min_char_number, '0'));
                }
                else {
                    code_1 = code_1.replace(raw_schema_item_list[i], schema_item_preview[format_value]);
                    code_2 = code_2.replace(raw_schema_item_list[i], schema_item_preview[format_value]);
                }
            }
        }
        $('#preview').html(`<span class="badge badge-primary">${code_1}</span><i class="mr-1 ml-1 fas fa-caret-right"></i><span class="badge badge-primary">${code_2}</span><i class="mr-1 ml-1 fas fa-caret-right"></i>...`);
    }
}

$('.schema-item').on('click', function () {
    let old_content = schema_item_list.val();
    if (old_content === '') {
        schema_item_list.val(schema_item_list_value[parseInt($(this).attr('data-value'))])
    }
    else {
        schema_item_list.val(old_content + schema_item_list_value[parseInt($(this).attr('data-value'))])
    }
    Preview()
})

$(document).on("click", '.schema-custom', function () {
    current_schema_row = $(this).closest('tr');
    let schema_show_ele = current_schema_row.find('.schema-show');
    if (schema_show_ele.text()) {
        schema_item_list.val(schema_show_ele.text());
        first_number_ele.val(schema_show_ele.attr('data-first-number'));
        last_number_ele.val(schema_show_ele.attr('data-last-number'));
        reset_frequency_ele.val(schema_show_ele.attr('data-reset-frequency'));
        min_num_char_ele.val(schema_show_ele.attr('data-min-number-char')).prop('disabled', false);
        min_num_char_checkbox_ele.prop('checked', true);
    }
    else {
        schema_item_list.val('');
        first_number_ele.val('');
        last_number_ele.val('');
        reset_frequency_ele.val('');
        min_num_char_ele.val('').prop('disabled', true);
        min_num_char_checkbox_ele.prop('checked', false);
    }
    Preview()
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
    let schema_item_value_list = schema_item_list.val().match(/{([^}]+)}/g);
    for (let i = 0; i < schema_item_value_list.length; i++) {
        if (schema_item_value_list[i]) {
            if (!schema_item_list_value.includes(schema_item_value_list[i])) {
                if (schema_item_value_list[i].includes('{') || schema_item_value_list[i].includes('}')) {
                    $.fn.notifyB({description: "Wrong schema format: " + schema_item_value_list[i]}, 'warning');
                    return false;
                }
            }
        }
    }
    if (!schema_item_value_list.includes('{Number}')) {
        $.fn.notifyB({description: "Schema must be included {Number}"}, 'failure');
        return false;
    }
    return true;
}

function formatSubmitSchema(raw_schema) {
    let raw_schema_item_list = raw_schema.match(/{([^}]+)}/g);
    for (let i = 0; i < raw_schema_item_list.length; i++) {
        if (schema_item_list_value.includes(raw_schema_item_list[i])) {
            let format_value = schema_item_list_value.indexOf(raw_schema_item_list[i]);
            raw_schema = raw_schema.replace(raw_schema_item_list[i], '[' + format_value.toString() + ']');
        }
    }
    return raw_schema;
}

$('#save-changes-modal-function-number').on('click', function () {
    if (formatInputSchema()) {
        let schema = schema_item_list.val();
        let first_number = first_number_ele.val();
        let last_number = last_number_ele.val();
        let reset_frequency = reset_frequency_ele.val();
        let min_number_char = min_num_char_ele.val();

        if (min_number_char < 2) {
            $.fn.notifyB({'description': 'Minimum char number must be > 2.'}, 'warning');
        }
        else {
            if (schema && first_number && last_number && reset_frequency) {
                let schema_show_ele = current_schema_row.find('.schema-show');
                schema_show_ele.text(schema);
                schema_show_ele.attr('data-schema', formatSubmitSchema(schema));
                schema_show_ele.attr('data-first-number', first_number);
                schema_show_ele.attr('data-last-number', last_number);
                schema_show_ele.attr('data-reset-frequency', reset_frequency);
                schema_show_ele.attr('data-min-number-char', min_number_char);
                $('#modal-function-number').hide();
            }
            else {
                $.fn.notifyB({description: "Missing information!"}, 'failure');
            }
        }
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
            ele.append('<div class="col-2">' + data.data?.['code'] + '</div>');
            return ele;
        },
        data: (data ? data : null),
        keyResp: 'base_currencies',
        keyId: 'id',
        keyText: 'title'
    })
}

let trans_script_ele = $('#trans-script')

const FunctionNumberTableData = [
    {
        'function': trans_script_ele.attr('data-trans-opp')
    },
    {
        'function': trans_script_ele.attr('data-trans-quo')
    },
    {
        'function': trans_script_ele.attr('data-trans-so')
    },
    {
        'function': trans_script_ele.attr('data-trans-picking')
    },
    {
        'function': trans_script_ele.attr('data-trans-delivery')
    },
    {
        'function': trans_script_ele.attr('data-trans-task')
    },
    {
        'function': trans_script_ele.attr('data-trans-ap')
    },
    {
        'function': trans_script_ele.attr('data-trans-payment')
    },
    {
        'function': trans_script_ele.attr('data-trans-rp')
    },
    {
        'function': trans_script_ele.attr('data-trans-pr')
    }
]

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
                    let system = trans_script_ele.attr('data-trans-numbering0');
                    let user_defined = trans_script_ele.attr('data-trans-numbering1');
                    return `<select class="form-select numbering-by-selection">
                        <option value="0" selected>${system}</option>
                        <option value="1">${user_defined}</option>
                    </select>`;
                }
            }, {
                data: '',
                className: 'wrap-text w-45',
                render: () => {
                    return `<span class="schema-show text-primary"></span>`;
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

function loadFunctionNumberTableDetail(option='detail', table_detail_data=[]) {
    table_detail_data.sort(function(a, b) {
        return a.function - b.function;
    });
    $('#function_number_table').DataTableDefault({
        dom: '',
        rowIdx: true,
        paging: false,
        data: table_detail_data,
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
                    if ([0, 6, 7, 8].includes(row.function)) {
                        return `<span class="text-primary"><b>${FunctionNumberTableData[row.function].function}</b></span>`;
                    }
                    return `<span class="text-secondary">${FunctionNumberTableData[row.function].function}</span>`;
                }
            }, {
                data: '',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    let disabled = '';
                    if (option === 'detail' || ![0, 6, 7, 8].includes(row.function)) {
                        disabled = 'disabled';
                    }
                    let system = trans_script_ele.attr('data-trans-numbering0');
                    let user_defined = trans_script_ele.attr('data-trans-numbering1');
                    if (row?.['numbering_by']) {
                        return `<select ${disabled} class="form-select numbering-by-selection">
                            <option value="0">${system}</option>
                            <option value="1" selected>${user_defined}</option>
                        </select>`;
                    }
                    else {
                        return `<select ${disabled} class="form-select numbering-by-selection">
                            <option value="0" selected>${system}</option>
                            <option value="1">${user_defined}</option>
                        </select>`;
                    }
                }
            }, {
                data: '',
                className: 'wrap-text w-45',
                render: (data, type, row) => {
                    if (row.schema) {
                        return `<span data-schema="${row.schema}" data-first-number="${row.first_number}" data-last-number="${row.last_number}" data-reset-frequency="${row.reset_frequency}" data-min-number-char="${row.min_number_char}" class="schema-show text-primary">${row.schema_text}</span>`;
                    }
                    else {
                        return `<span class="schema-show text-primary"></span>`;
                    }
                }
            }, {
                data: '',
                className: 'wrap-text text-center w-10',
                render: (data, type, row) => {
                    if (option !== 'detail') {
                        if (row.schema) {
                            return `<span class="text-primary schema-custom" data-bs-toggle="modal" data-bs-target="#modal-function-number"><i class="far fa-edit"></i></span>`;
                        } else {
                            return `<span class="text-primary schema-custom" hidden data-bs-toggle="modal" data-bs-target="#modal-function-number"><i class="far fa-edit"></i></span>`;
                        }
                    }
                    return ``;
                }
            }
        ],
    })
}

class CompanyHandle {
    load() {
        loadCompanyCities();
        loadCompanyDistrict();
        loadCompanyWard();
    }
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        let definition_inventory_valuation = 1;
        if ($('#perpetual-selection').is(':checked')) {
            definition_inventory_valuation = 0;
        }

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['code'] = $('#code').val();
        frm.dataForm['representative_fullname'] = $('#representative_fullname').val();
        frm.dataForm['address'] = $('#address').val();
        frm.dataForm['email'] = $('#email').val();
        frm.dataForm['phone'] = $('#phone').val();
        frm.dataForm['fax'] = $('#fax').val();
        frm.dataForm['primary_currency'] = primary_currency.val();
        frm.dataForm['definition_inventory_valuation'] = definition_inventory_valuation;
        frm.dataForm['default_inventory_value_method'] = $('#default-inventory-value-method').val();
        frm.dataForm['cost_per_warehouse'] = $('#cost-per-warehouse').is(':checked');
        frm.dataForm['cost_per_lot_batch'] = $('#cost-per-lot-batch').is(':checked');

        frm.dataForm['company_function_number_data'] = []
        $('#function_number_table tbody tr').each(function (index) {
            let schema_text = $(this).find('.schema-show').text()
            let schema = $(this).find('.schema-show').attr('data-schema');
            let first_number = $(this).find('.schema-show').attr('data-first-number');
            let last_number = $(this).find('.schema-show').attr('data-last-number');
            let reset_frequency = $(this).find('.schema-show').attr('data-reset-frequency');
            let min_number_char = $(this).find('.schema-show').attr('data-min-number-char');

            if (schema_text && schema && first_number && last_number && reset_frequency) {
                frm.dataForm['company_function_number_data'].push({
                    'function': index,
                    'numbering_by': $(this).find('.numbering-by-selection').val(),
                    'schema_text': schema_text,
                    'schema': schema,
                    'first_number': first_number,
                    'last_number': last_number,
                    'reset_frequency': reset_frequency,
                    'min_number_char': min_number_char
                })
            }
        })

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

function LoadDetailCompany(frm, option) {
    let pk = $.fn.getPkDetail()
    let url_loaded = frm.attr('data-url-detail').replace(0, pk);

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
                loadPrimaryCurrency(data?.['company_setting']?.['primary_currency'])
                if (!data?.['company_setting']?.['definition_inventory_valuation']) {
                    $('#perpetual-selection').prop('checked', true);
                }
                else {
                    $('#periodic-selection').prop('checked', true);
                }

                $('#default-inventory-value-method').val(data?.['company_setting']?.['default_inventory_value_method']);

                if (data?.['company_setting']?.['cost_per_warehouse']) {
                    $('#cost-per-warehouse').prop('checked', true);
                }
                if (data?.['company_setting']?.['cost_per_lot_batch']) {
                    $('#cost-per-lot-batch').prop('checked', true);
                }

                loadFunctionNumberTableDetail(option, data?.['company_function_number'])

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
