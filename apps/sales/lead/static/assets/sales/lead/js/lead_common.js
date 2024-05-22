const $script_trans = $('#script-trans')
const $btn_add_note = $('#btn-add-note')

const $lead_name = $('#lead-name')
const $contact_name = $('#contact-name')
const $job_title = $('#job-title')
const $mobile = $('#mobile')
const $email = $('#email')
const $company_name = $('#company-name')
const $account_name = $('#account-name')
const $industry = $('#industry')
const $total_employees = $('#total-employees')
const $revenue = $('#revenue')
const $assign_to_sale = $('#assign-to-sale')
const $lead_source = $('#lead-source')
const $lead_status = $('#lead-status')
const $lead_note = $('.lead-note')

const $convert_to_contact_check = $('#convert-to-contact-check')
const $convert_to_opp_check = $('#convert-to-opp-check')
const $convert_to_new_opp_radio = $('#convert-to-new-opp-radio')
const $select_an_existing_opp_radio = $('#select-an-existing-opp-radio')
const $convert_to_new_account_radio = $('#convert-to-new-account-radio')
const $select_an_existing_account_radio = $('#select-an-existing-account-radio')
const $assign_to_sale_config = $('#assign-to-sale-config')
const $selected_opp = $('.selected-opp')
const $account_existing = $('#existing-account')
const $select_an_existing_opp_table = $('#select-an-existing-opp-table')


$convert_to_opp_check.on('change', function () {
    $('.convert-to-opp-check-child').prop('hidden', !$(this).prop('checked'))
})

$('input[name="convert-to-opp"]').on('change', function () {
    $('.convert-to-new-opp-radio-child').prop('hidden', !$('#convert-to-new-opp-radio').prop('checked'))
    $('.select-an-existing-opp-radio-child').prop('hidden', !$('#select-an-existing-opp-radio').prop('checked'))
})

$('input[name="convert-to-opp-option"]').on('change', function () {
    $('.select-an-existing-account-radio-child').prop('hidden', !$('#select-an-existing-account-radio').prop('checked'))
})

$btn_add_note.on('click', function () {
    let note_html = $(`<textarea class="form-control lead-note mb-3" placeholder=""></textarea>`)
    let index = $('#note-area textarea').length
    note_html.attr('placeholder', `${$script_trans.attr('data-trans-note')} ${index + 1}`)
    $('#note-area').prepend(note_html)
})

function Disable(option) {
    if (option === 'detail') {
    }
}

function LoadDetailLead(option) {
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

                $('#created_date_id').val(data.date_created.split(' ')[0]).prop('readonly', true)

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
                        <td><input class="form-control expense-name-input" name="expense_valid_list"></td>
                        <td><select class="form-select expense-type-select-box" name="expense_valid_list"></select></td>
                        <td><input class="form-control expense-uom-input" name="expense_valid_list"></td>
                        <td><input type="number" min="1" class="form-control expense_quantity" value="1" name="expense_valid_list"></td>
                        <td><input data-return-type="number" type="text" class="form-control expense-unit-price-input mask-money" name="expense_valid_list"></td>
                        <td><select class="form-select expense-tax-select-box" data-method="GET" name="expense_valid_list"><option selected></option></select></td>
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
                    changePrice(`row-${i+1}`)
                }

                calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));

                money_gave.prop('disabled', data?.['money_gave']);
                money_gave.prop('checked', data?.['money_gave']);

                $.fn.initMaskMoney2();

                new $x.cls.file($('#attachment')).init({
                    enable_edit: option !== 'detail',
                    data: data.attachment,
                })

                Disable(option);
                quotation_mapped_select.attr('disabled', true).attr('readonly', true);
                sale_order_mapped_select.attr('disabled', true).attr('readonly', true);
            }
        })
}

function LoadIndustry(data) {
    $industry.initSelect2({
        allowClear: true,
        ajax: {
            url: $industry.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'industry_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {})
}

function LoadSales(data) {
    $assign_to_sale.initSelect2({
        allowClear: true,
        ajax: {
            url: $assign_to_sale.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    }).on('change', function () {})
}

function LoadSalesConfig(data) {
    $assign_to_sale_config.initSelect2({
        allowClear: true,
        ajax: {
            url: $assign_to_sale_config.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    }).on('change', function () {})
}

function LoadAccountConfig(data) {
    $account_existing.initSelect2({
        allowClear: true,
        ajax: {
            url: $account_existing.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'account_list',
        keyId: 'id',
        keyText: 'name',
    }).on('change', function () {})
}

function LoadOpportunityList() {
    if (!$.fn.DataTable.isDataTable('#select-an-existing-table')) {
        let frm = new SetupFormSubmit($select_an_existing_opp_table);
        $select_an_existing_opp_table.DataTableDefault({
            useDataServer: true,
            paging: false,
            ordering: false,
            scrollCollapse: true,
            scrollY: '50vh',
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('opportunity_list')) {
                        return resp.data['opportunity_list'] ? resp.data['opportunity_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-sm">
                                    <input data-id="${row?.['id']}" type="radio" name="selected-opp" class="selected-opp form-check-input">
                                    <label class="form-check-label badge badge-soft-primary">${row?.['code']}</label>
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<p class="fw-bold">${row?.['title']}</p>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<p>${row?.['customer']?.['title']}</p>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="badge badge badge-soft-blue ml-2 mt-2">${row?.['sale_person']?.['full_name']}</span>`
                    }
                },
            ],
        });
    }
}

class LeadHandle {
    load() {
        LoadIndustry()
        LoadSales()
        LoadSalesConfig()
        LoadAccountConfig()
        LoadOpportunityList()
    }

    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        // lead main data
        frm.dataForm['title'] = $lead_name.val()
        frm.dataForm['contact_name'] = $contact_name.val()
        frm.dataForm['job_title'] = $job_title.val()
        frm.dataForm['mobile'] = $mobile.val()
        frm.dataForm['email'] = $email.val()
        frm.dataForm['company_name'] = $company_name.val()
        frm.dataForm['account_name'] = $account_name.val()
        frm.dataForm['industry'] = $industry.val()
        frm.dataForm['total_employees'] = $total_employees.val()
        frm.dataForm['revenue'] = $revenue.val()
        frm.dataForm['source'] = $lead_source.val()
        frm.dataForm['lead_status'] = $lead_status.val()
        frm.dataForm['assign_to_sale'] = $assign_to_sale.val()

        // lead note data
        let note_data = []
        $lead_note.each(function () {
            if ($(this).val()) {
                note_data.push($(this).val())
            }
        })
        frm.dataForm['note_data'] = note_data

        // lead config data
        frm.dataForm['config_data'] = {}
        let create_contact = $convert_to_contact_check.prop('checked')
        let convert_opp = $convert_to_opp_check.prop('checked')
        frm.dataForm['config_data']['create_contact'] = create_contact
        frm.dataForm['config_data']['convert_opp'] = convert_opp
        if (convert_opp) {
            let convert_opp_create = $convert_to_new_opp_radio.prop('checked')
            frm.dataForm['config_data']['convert_opp_create'] = convert_opp_create
            if (convert_opp_create) {
                let convert_account_create = $convert_to_new_account_radio.prop('checked')
                let convert_account_select = $select_an_existing_account_radio.prop('checked')
                frm.dataForm['config_data']['convert_account_create'] = convert_account_create
                frm.dataForm['config_data']['convert_account_select'] = convert_account_select
                if (convert_account_select) {
                    frm.dataForm['config_data']['account_select'] = $account_existing.val()
                }
                frm.dataForm['config_data']['assign_to_sale_config'] = $assign_to_sale_config.val()
            }
            let convert_opp_select = $select_an_existing_opp_radio.prop('checked')
            frm.dataForm['config_data']['convert_opp_select'] = convert_opp_select
            if (convert_opp_select) {
                frm.dataForm['config_data']['opp_select'] = $selected_opp.find('option:selected').attr('data-id')
            }
        }

        return frm;
    }
}