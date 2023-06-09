$(document).ready(function () {
    let plan_db = $('#tab_plan_datatable_div').html();
    const sale_order_list = JSON.parse($('#sale_order_list').text());
    const quotation_list = JSON.parse($('#quotation_list').text());
    const expense_list = JSON.parse($('#expense_list').text());
    const account_list = JSON.parse($('#account_list').text());
    const account_bank_accounts_information_dict = account_list.reduce((obj, item) => {
        obj[item.id] = item.bank_accounts_information;
        return obj;
    }, {});
    let sale_code_selected_list = [];
    let sale_order_selected_list = [];
    let quotation_selected_list = [];
    let load_default = 0;
    let current_value_converted_from_ap = '';

    function loadSaleOrderExpense(filter_sale_order) {
        $('#tab_plan_datatable').remove();
        $('#tab_plan_datatable_div').html(plan_db);
        let dtb = $('#tab_plan_datatable');
        let frm = new SetupFormSubmit(dtb);
        frm.dataUrl = dtb.attr('data-url-sale-order');
        dtb.DataTableDefault({
            dom: '',
            ajax: {
                url: frm.dataUrl + '?filter_sale_order=' + filter_sale_order,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['sale_order_expense_list'] ? resp.data['sale_order_expense_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    render: (data, type, row, meta) => {
                        return ''
                    }
                },
                {
                    data: 'expense_title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<a href="#"><span>` + row.expense_title + `</span></a>`
                    }
                },
                {
                    data: 'tax',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        if (row.tax.title) {
                            return `<span class="badge badge-soft-indigo badge-outline">` + row.tax.title + `</span>`
                        }
                        return ``
                    }
                },
                {
                    data: 'plan_after_tax',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.plan_after_tax.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                }
            ],
        });
    }

    function loadQuotationExpense(filter_quotation) {
        $('#tab_plan_datatable').remove();
        $('#tab_plan_datatable_div').html(plan_db);
        let dtb = $('#tab_plan_datatable');
        let frm = new SetupFormSubmit(dtb);
        frm.dataUrl = dtb.attr('data-url-quotation');
        dtb.DataTableDefault({
            dom: '',
            ajax: {
                url: frm.dataUrl + '?filter_quotation=' + filter_quotation,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['quotation_expense_list'] ? resp.data['quotation_expense_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    render: (data, type, row, meta) => {
                        return ''
                    }
                },
                {
                    data: 'expense_title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<a href="#"><span>` + row.expense_title + `</span></a>`
                    }
                },
                {
                    data: 'tax',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        if (row.tax.title) {
                            return `<span class="badge badge-soft-indigo badge-outline">` + row.tax.title + `</span>`
                        }
                        return ``
                    }
                },
                {
                    data: 'plan_after_tax',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.plan_after_tax.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-soft-indigo badge-outline"></span>`
                    }
                }
            ],
        });
    }

    function loadCreator() {
        let ele = $('#creator-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    ele.append(`<option></option>`);
                    resp.data.employee_list.map(function (item) {
                        if (item.id === $('#data-init-payment-create-request-employee-id').val()) {
                            ele.append(`<option selected data-department-id="` + item.group.id + `" data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                            $('#creator-detail-span').prop('hidden', false);
                            $('#creator-name').text($('#creator-select-box option:selected').attr('data-name'));
                            $('#creator-code').text($('#creator-select-box option:selected').attr('data-code'));
                            $('#creator-department').text($('#creator-select-box option:selected').attr('data-department'));
                            let url = $('#btn-detail-creator-tab').attr('data-url').replace('0', $('#creator-select-box option:selected').attr('value'));
                            $('#btn-detail-creator-tab').attr('href', url);
                        }
                        else {
                            ele.append(`<option data-department-id="` + item.group.id + `" data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                        }
                    })
                    if (load_default === 0) {
                        $('#beneficiary-select-box').prop('disabled', true);
                        loadBeneficiary('', $('#creator-select-box option:selected').attr('data-department-id'), $('#data-init-payment-create-request-employee-id').val());
                        $('#sale-code-select-box').prop('disabled', false);
                        $('#sale-code-select-box2-show').css({
                            'background': 'none',
                        });
                        $('#sale-code-select-box2-show').attr('disabled', false);
                        $('#sale-code-select-box2-show').attr('placeholder', 'Select one');
                        loadSaleCode($('#data-init-payment-create-request-employee-id').val());
                        $('#sale-code-select-box2-show').val('');
                        $('#sale-code-select-box2').prop('hidden', false);
                        load_default = 1;
                    }
                }
            }
        }, (errs) => {
        },)
    }

    function loadBeneficiary(sale_person_id, department_id, creator_id) {
        let ele = $('#beneficiary-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    ele.append(`<option></option>`);
                    if (sale_person_id) {
                        resp.data.employee_list.map(function (item) {
                            if (item.id === sale_person_id) {
                                ele.append(`<option selected data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                                $('#beneficiary-detail-span').prop('hidden', false);
                                $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
                                $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
                                $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
                                let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
                                $('#btn-detail-beneficiary-tab').attr('href', url);
                            }
                        })
                    }
                    else {
                        resp.data.employee_list.map(function (item) {
                            if (item.group.id === department_id) {
                                if (item.id === creator_id) {
                                    ele.append(`<option selected data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                                    $('#beneficiary-detail-span').prop('hidden', false);
                                    $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
                                    $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
                                    $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
                                    let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
                                    $('#btn-detail-beneficiary-tab').attr('href', url);
                                } else {
                                    ele.append(`<option data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                                    if ($('#radio-non-sale').is(':checked')) {
                                        $('#beneficiary-detail-span').prop('hidden', true);
                                        $('#beneficiary-name').text('');
                                        $('#beneficiary-code').text('');
                                        $('#beneficiary-department').text('');
                                        $('#btn-detail-beneficiary-tab').attr('href', '#');
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }, (errs) => {
        },)
    }

    function loadSaleCode(beneficiary) {
        let ele = $('#sale-code-select-box2');
        ele.html('');
        let sale_not_opp = '';
        let quotation_not_opp = '';
        ele.append(`<optgroup label="Sale Order" class="text-primary">`)
        sale_order_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (item.opportunity.id) {
                    ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `"><div class="row"><span class="code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                }
                else {
                    sale_not_opp += `<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code"><div class="row"><span class="code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`;
                }
            }
        })
        ele.append(sale_not_opp);
        ele.append(`</optgroup>`);
        ele.append(`<optgroup label="Quotation" class="text-primary">`);
        quotation_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (item.opportunity.id) {
                    ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `"><div class="row"><span class="code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                }
                else {
                    quotation_not_opp += `<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code"><div class="row"><span class="code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`;
                }
            }
        })
        ele.append(quotation_not_opp);
        ele.append(`</optgroup>`);

        $('#sale-code-select-box2 .dropdown-item').on('click', function () {
            $('#sale-code-select-box2-show').val($(this).find('.title-span').text())
            $('#sale-code-select-box option:selected').attr('selected', false);
            $('#sale-code-select-box').find(`option[value="` + $(this).attr('data-value') + `"]`).attr('selected', true);
            if ($('#sale-code-select-box option:selected').attr('data-sale-person-id')) {
                if ($('#radio-non-sale').is(':checked') === false) {
                    loadBeneficiary($('#sale-code-select-box option:selected').attr('data-sale-person-id'));
                }
                if ($('#sale-code-select-box option:selected').attr('data-type') === '0') {
                    loadSaleOrderExpense($('#sale-code-select-box option:selected').attr('value'));
                }
                if ($('#sale-code-select-box option:selected').attr('data-type') === '1') {
                    loadQuotationExpense($('#sale-code-select-box option:selected').attr('value'));
                }
                $('#notify-none-sale-code').prop('hidden', true);
                $('#tab_plan_datatable').prop('hidden', false);
            }
            else {
                $('#notify-none-sale-code').prop('hidden', false);
                $('#tab_plan_datatable').prop('hidden', true);
            }
            $('#tab_line_detail_datatable tbody').html('');
        })


        let ele2 = $('#sale-code-select-box');
        ele2.html('');
        ele2.append(`<option></option>`);
        ele2.append(`<optgroup label="Sale Order">`);
        sale_order_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (item.opportunity.id) {
                    ele2.append(`<option data-sale-code="` + item.opportunity.code + `" data-type="0" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">` + item.title + `</option>`);
                } else {
                    ele2.append(`<option data-sale-code="` + item.code + `" data-type="0" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">` + item.title + `</option>`);
                }
            }
        })
        ele2.append(`</optgroup>`);
        ele2.append(`<optgroup label="Quotation">`);
        quotation_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (item.opportunity.id) {
                    ele2.append(`<option data-sale-code="` + item.opportunity.code + `" data-type="1" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">` + item.title + `</option>`);
                } else {
                    ele2.append(`<option data-sale-code="` + item.code + `" data-type="1" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">` + item.title + `</option>`);
                }
            }
        })
        ele2.append(`</optgroup>`);
    }

    function loadSaleCodeMulti() {
        let ele = $('#sale-code-select-box2');
        ele.html('');
        ele.append(`<div class="h-400p"></div>`);
        ele = $('#sale-code-select-box2 .h-400p');

        let sale_not_opp = '';
        let quotation_not_opp = '';
        ele.append(`<div class="row mb-3"><div class="col-12 text-primary"><b>Sale order</b></div></div>`)
        sale_order_list.map(function (item) {
            if (item.opportunity.id) {
                ele.append(`<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `">
                                <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                <span class="col-7 title-span" data-sale-person-id="` + item.sale_person.id + `">` + item.title +`</span>
                                <span class="col-1"><input type="checkbox" class="form-check-input multi-sale-code" data-type="0" id="` + item.id + `"></span>
                            </div>`)
            }
            else {
                sale_not_opp += `<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code">
                                    <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                    <span class="col-7 title-span" data-sale-person-id="` + item.sale_person.id + `">` + item.title +`</span>
                                    <span class="col-1"><input type="checkbox" class="form-check-input multi-sale-code" data-type="0" id="` + item.id + `"></span>
                                </div>`
            }
        })
        ele.append(sale_not_opp);

        ele.append(`<div class="row mb-3"><div class="col-12 text-primary"><b>Quotation</b></div></div>`)
        quotation_list.map(function (item) {
            if (item.opportunity.id) {
                ele.append(`<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `">
                                <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                <span class="col-7 title-span" data-sale-person-id="` + item.sale_person.id + `">` + item.title +`</span>
                                <span class="col-1"><input type="checkbox" class="form-check-input multi-sale-code" data-type="1" id="` + item.id + `"></span>
                            </div>`)
            }
            else {
                quotation_not_opp += `<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code">
                                        <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                        <span class="col-7 title-span" data-sale-person-id="` + item.sale_person.id + `">` + item.title +`</span>
                                        <span class="col-1"><input type="checkbox" class="form-check-input multi-sale-code" data-type="1" id="` + item.id + `"></span>
                                    </div>`
            }
        })
        ele.append(quotation_not_opp);

        $('#sale-code-select-box2 .multi-sale-code').on('click', function () {
            $(this).each(function() {
                if ($(this).is(':checked')) {
                    sale_code_selected_list.push($(this).attr('id'));
                    if ($(this).attr('data-type') === '0') {
                        sale_order_selected_list.push($(this).attr('id'))
                    }
                    if ($(this).attr('data-type') === '1') {
                        quotation_selected_list.push($(this).attr('id'))
                    }
                }
            });
        })
    }

    function loadSupplier() {
        let ele = $('#supplier-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        account_list.map(function (item) {
            if (item.account_type.includes('Supplier')) {
                ele.append(`<option data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
            }
        })
    }

    function LoadBankAccount() {
        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_info = account_bank_accounts_information_dict[supplier_id];
        let list_bank_accounts_html = ``;

        if (bank_info.length > 0) {
            for (let i = 0; i < bank_info.length; i++) {
                let country_id = bank_info[i].country_id;
                let bank_name = bank_info[i].bank_name;
                let bank_code = bank_info[i].bank_code;
                let bank_account_name = bank_info[i].bank_account_name;
                let bank_account_number = bank_info[i].bank_account_number;
                let bic_swift_code = bank_info[i].bic_swift_code;
                let is_default = '';
                if (bank_info[i].is_default) {
                    is_default = 'checked';
                }
                list_bank_accounts_html += `<div id="bank-account-` + i + `" style="border: solid 2px #ddd;" class="card card-bank-account col-5 ml-3">
                            <span class="mt-2">
                                <div class="row">
                                    <div class="col-6">
                                        <a class="btn-del-bank-account" href="#"><i class="bi bi-x"></i></a>
                                    </div>
                                    <div class="col-6 text-right">
                                        <input disabled class="form-check-input ratio-select-bank-account-default" type="radio" name="bank-account-select-default"` + is_default + `>
                                    </div>
                                </div>
                            </span>
                            <label class="ml-4">Bank account name: <a href="#" class="bank-account-name-label"><b>` + bank_account_name + `</b></a></label>
                            <label class="ml-4">Bank name: <a href="#" class="bank-name-label"><b>` + bank_name + `</b></a></label>
                            <label class="ml-4">Bank account number: <a href="#" class="bank-account-number-label"><b>` + bank_account_number + `</b></a></label>
                            <label hidden class="ml-4">Country ID: <a class="country-id-label"><b>` + country_id + `</b></a></label>
                            <label hidden class="ml-4">Bank code: <a class="bank-code-label"><b>` + bank_code + `</b></a></label>
                            <label hidden class="ml-4">BIC/SWIFT Code: <a class="bic-swift-code-label"><b>` + bic_swift_code + `</b></a></label>
                            <span class="mb-2">
                                <div class="row">
                                    <div class="col-12 text-right">
                                        <a data-bs-toggle="offcanvas" data-bs-target="#modal-bank-account-information" type="button"
                                           class="btn-edit-bank-account mr-1" href="#">
                                           <i class="bi bi-pencil-square"></i>
                                        </a>
                                    </div>
                                </div>
                            </span>
                        </div>`
            }
            $('#list-bank-account-information').html(list_bank_accounts_html);
            // delete bank account item
            $('.btn-del-bank-account').on('click', function () {
                let bank_order = parseInt($(this).closest('.card').attr('id').replace('bank-account-', ''));
                let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
                account_bank_accounts_information_dict[supplier_id].splice(bank_order, 1);
                $(this).closest('.card').remove();
            })
            // edit bank account item
            $('.btn-edit-bank-account').on('click', ClickEditBankBtn);
        }
        else {
            let supplier_name = $('#supplier-select-box').find('option:selected').text()
            $('#list-bank-account-information').html(`<div class="row">
                <div class="col-12">
                    <div id="notify-none-bank-account" class="alert alert-secondary" role="alert">
                        <span class="alert-icon-wrap"></span>
                        "` + supplier_name + `" has no bank accounts information!
                    </div>
                </div>
            </div>`);
        }
    }

    function ClickEditBankBtn() {
        loadCountries($(this).closest('.card').find('a.country-id-label').text());
        $('#bank-account-order').val($(this).closest('.card').attr('id'));
        $('#bank-name-id').val($(this).closest('.card').find('a.bank-name-label').text());
        $('#bank-code-id').val($(this).closest('.card').find('a.bank-code-label').text());
        $('#bank-account-name-id').val($(this).closest('.card').find('a.bank-account-name-label').text());
        $('#bank-account-number-id').val($(this).closest('.card').find('a.bank-account-number-label').text());
        $('#bic-swift-code-id').val($(this).closest('.card').find('a.bic-swift-code-label').text());

        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_order = parseInt($(this).closest('.card').attr('id').replace('bank-account-', ''));
        let is_default = account_bank_accounts_information_dict[supplier_id][bank_order].is_default
        if (is_default) {
            $('#make-default-shipping-address').prop('checked', true);
            $('#make-default-shipping-address').prop('disabled', true);
        }
        else {
            $('#make-default-shipping-address').prop('checked', false);
            $('#make-default-shipping-address').prop('disabled', false);
        }
    }

    function loadCountries(country_mapped) {
        let ele = $('#country-select-box-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected></option>`)
                    if (data.hasOwnProperty('countries') && Array.isArray(data.countries)) {
                        data.countries.map(function (item) {
                            if (country_mapped === item.id) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function ChangeBankInfor() {
        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_order = parseInt($('#bank-account-order').val().replace('bank-account-', ''));
        let is_default = false;
        if ($('#make-default-shipping-address').is(':checked')) {
            is_default = true;
        }
        for (let i = 0; i < account_bank_accounts_information_dict[supplier_id].length; i++) {
            if (is_default) {
                if (i !== bank_order) {
                    account_bank_accounts_information_dict[supplier_id][i].is_default = false;
                }
                else {
                    account_bank_accounts_information_dict[supplier_id][i] = {
                        "bank_code": $('#bank-code-id').val(),
                        "bank_name": $('#bank-name-id').val(),
                        "country_id": $('#country-select-box-id option:selected').attr('value'),
                        "is_default": is_default,
                        "bic_swift_code": $('#bic-swift-code-id').val(),
                        "bank_account_name": $('#bank-account-name-id').val(),
                        "bank_account_number": $('#bank-account-number-id').val()
                    }
                }
            }
            else {
                if (i === bank_order) {
                    account_bank_accounts_information_dict[supplier_id][i] = {
                        "bank_code": $('#bank-code-id').val(),
                        "bank_name": $('#bank-name-id').val(),
                        "country_id": $('#country-select-box-id option:selected').attr('value'),
                        "is_default": is_default,
                        "bic_swift_code": $('#bic-swift-code-id').val(),
                        "bank_account_name": $('#bank-account-name-id').val(),
                        "bank_account_number": $('#bank-account-number-id').val()
                    }
                }
            }
        }
    }

    loadCreator();
    $('#beneficiary-select-box').select2();
    loadSupplier();

    $('#created_date_id').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'),10)
    });

    $('#supplier-select-box').on('change', function () {
        if ($(this).find('option:selected').attr('value')) {
            LoadBankAccount();
            $('#supplier-detail-span').prop('hidden', false);
            $('#supplier-name').text($('#supplier-select-box option:selected').attr('data-name'));
            $('#supplier-code').text($('#supplier-select-box option:selected').attr('data-code'));
            $('#supplier-owner').text($('#supplier-select-box option:selected').attr('data-owner'));
            $('#supplier-industry').text($('#supplier-select-box option:selected').attr('data-industry'));
            let url = $('#btn-detail-supplier-tab').attr('data-url').replace('0', $('#supplier-select-box option:selected').attr('value'));
            $('#btn-detail-supplier-tab').attr('href', url);
        }
        else {
            $('#supplier-detail-span').prop('hidden', true);
            $('#btn-detail-supplier-tab').attr('href', '#');
            $('#list-bank-account-information').html(`<div class="row">
                <div class="col-12">
                    <div id="notify-none-bank-account" class="alert alert-secondary" role="alert">
                        <span class="alert-icon-wrap"></span>
                        &nbsp;No bank accounts information!
                    </div>
                </div>
            </div>`)
        }
    })

    $('#beneficiary-select-box').on('change', function () {
        if ($(this).val() !== '') {
            $('#beneficiary-detail-span').prop('hidden', false);
            $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
            $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
            $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
            let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
            $('#btn-detail-beneficiary-tab').attr('href', url);
            if ($('#radio-non-sale').is(':checked')) {
                loadSaleCode($(this).val());
                $('#sale-code-select-box').prop('disabled', false);
                $('#sale-code-select-box2-show').css({
                    'background': 'none',
                });
                $('#sale-code-select-box2-show').attr('disabled', false);
                $('#sale-code-select-box2-show').attr('placeholder', 'Select one');
            }
        }
        else {
            $('#beneficiary-detail-span').prop('hidden', true);
            $('#btn-detail-beneficiary-tab').attr('href', '#');
            if ($('#radio-non-sale').is(':checked')) {
                $('#sale-code-select-box').prop('disabled', true);
                $('#sale-code-select-box').val('');
                $('#sale-code-select-box2-show').attr('style', '');
                $('#sale-code-select-box2-show').attr('disabled', true);
                $('#sale-code-select-box2-show').attr('placeholder', 'Select beneficiary');
            }
        }
    })

    $('.sale_code_type').on('change', function (event) {
        sale_code_selected_list = [];
        sale_order_selected_list = [];
        quotation_selected_list = [];
        $('#tab_line_detail_datatable tbody').html('');
        $('#btn-change-sale-code-type').text($('input[name="sale_code_type"]:checked').val())
        if ($(this).val() === 'sale') {
            $('#beneficiary-select-box').prop('disabled', true);
            loadBeneficiary('', $('#creator-select-box option:selected').attr('data-department-id'), $('#data-init-payment-create-request-employee-id').val());
            $('#sale-code-select-box').prop('disabled', false);
            $('#sale-code-select-box2-show').css({
                'background': 'none',
            });
            $('#sale-code-select-box2-show').attr('disabled', false);
            $('#sale-code-select-box2-show').attr('placeholder', 'Select one');
            loadSaleCode($('#data-init-payment-create-request-employee-id').val());
            $('#sale-code-select-box2-show').val('');
            $('#sale-code-select-box2').prop('hidden', false);
        }
        else if ($(this).val() === 'non-sale') {
            $('#beneficiary-select-box').prop('disabled', false);
            loadBeneficiary('', $('#creator-select-box option:selected').attr('data-department-id'), '');
            $('#sale-code-select-box').prop('disabled', true);
            $('#sale-code-select-box').val('');
            $('#sale-code-select-box2-show').attr('style', '');
            $('#sale-code-select-box2-show').attr('disabled', true);
            $('#sale-code-select-box2-show').attr('placeholder', 'Select beneficiary first');
            $('#sale-code-select-box2-show').val('');
            $('#sale-code-select-box2').prop('hidden', false);
        }
        else if ($(this).val() === 'MULTI') {
            sale_code_selected_list = [];
            $('#beneficiary-select-box').prop('disabled', true);
            loadBeneficiary('', $('#creator-select-box option:selected').attr('data-department-id'), $('#data-init-payment-create-request-employee-id').val());
            $('#sale-code-select-box').prop('disabled', false);
            $('#sale-code-select-box2-show').css({
                'background': 'none',
            });
            $('#sale-code-select-box2-show').attr('disabled', false);
            $('#sale-code-select-box2-show').attr('placeholder', 'Select multi Sale Code available');
            loadSaleCodeMulti();
            $('#sale-code-select-box2-show').val('');
        }
    })

    $('#save-changes-modal-bank-account').on('click', function () {
        ChangeBankInfor();
        LoadBankAccount();
        $('#btn-close-edit-bank-account').click();
    })

    $(document).on("click", '#btn-add-row-line-detail', function () {
        let sale_code_length = 0;
        let opp_code_list = [];
        let sale_code_id_list = [];
        if ($('#radio-non-sale').is(':checked') || $('#radio-sale').is(':checked')) {
            if ($('#sale-code-select-box').val()) {
                sale_code_length = 1;
                opp_code_list.push($('#sale-code-select-box option:selected').attr('data-sale-code'));
                sale_code_id_list.push($('#sale-code-select-box option:selected').attr('value'));
            }
        }
        if ($('#radio-special').is(':checked')) {
            sale_code_length = sale_code_selected_list.length
            $('#sale-code-select-box2 .multi-sale-code').each(function() {
                if ($(this).is(':checked')) {
                    let opp_code = $(this).closest('div').attr('title').split(': ')[0];
                    if (opp_code !== 'No Opportunity Code') {
                        opp_code_list.push(opp_code);
                    }
                    else {
                        opp_code_list.push($(this).closest('div').find('.code-span').text().replace(' ', ''));
                    }
                }
            });
            sale_code_id_list = sale_code_selected_list;
        }

        if (sale_code_length > 0) {
            let table_body = $('#tab_line_detail_datatable tbody');
            table_body.append(`<tr id="" class="row-number">
                <td class="number text-center"></td>
                <td><select class="form-select expense-select-box" data-method="GET"><option selected></option></select></td>
                <td><input class="form-control expense-type" style="color: black; background: none" disabled></td>
                <td><select class="form-select expense-uom-select-box" data-method="GET"><option selected></option></select></td>
                <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control expense-quantity" value="1"></td>
                <td><div class="input-group dropdown" aria-expanded="false" data-bs-toggle="dropdown">
                        <span class="input-affix-wrapper">
                            <input disabled data-return-type="number" type="text" class="form-control expense-unit-price-select-box mask-money" style="color: black; background: none" placeholder="Select a price or enter">
                        </span>
                    </div>
                    <div style="min-width: 25%" class="dropdown-menu" data-method="GET"></div></td>
                <td><select class="form-select expense-tax-select-box" data-method="GET"><option selected></option></select></td>
                <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money" style="color: black; background: none" disabled></td>
                <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money" style="color: black; background: none" disabled></td>
                <td><input type="text" class="form-control expense-document-number" required></td>
                <td class="action">
                    <a class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></a>
                    <a class="row-toggle btn text-primary btn-link btn-animated" title="Toggle row"><span class="icon"><i class="bi bi-caret-down-square"></i></span></a>
                </td>
            </tr>`);

            table_body.append(`<tr class="" hidden>
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
                table_body.append(`<tr class="" hidden>
                    <td colspan="1"></td>
                    <td colspan="1">
                        <span class="sale_code_expense_detail badge badge-outline badge-soft-primary" data-sale-code-id="` + sale_code_id_list[i] + `"><b>` + opp_code_list[i] + `</b></span>
                    </td>
                    <td colspan="2">
                        <input data-return-type="number" placeholder="Enter payment value" class="value-inp form-control mask-money ">
                    </td>
                    <td colspan="1">
                        <center><i class="fas fa-plus text-primary"></i></center>
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
                        <center><i class="fas fa-equals text-primary"></i></center>
                    </td>
                    <td colspan="1">
                        <span class="mask-money total-value-salecode-item text-primary" data-init-money="0"></span>
                    </td>
                    <td colspan="1">
                        <script type="application/json" class="detail-ap-items"></script>
                    </td>
                </tr>`);
            }

            $('.value-inp').on('change', function () {
                let value_converted_from_ap = parseFloat($(this).closest('tr').find('.value-converted-from-ap-inp').attr('value'));
                let this_value = parseFloat($(this).attr('value'));
                if (isNaN(value_converted_from_ap)) { value_converted_from_ap = 0; }
                if (isNaN(this_value)) { this_value = 0; }
                $(this).closest('tr').find('.total-value-salecode-item').attr('data-init-money', this_value + value_converted_from_ap);
                $.fn.initMaskMoney2();
            })

            table_body.append(`<script>
                function checkInputQuantity(value) {
                    if (parseInt(value) < 0) {
                        return value*(-1);
                    }
                    return value;
                }
            </script>`);

            let row_count = count_row(table_body, sale_code_length+1, 1);

            $('#row-' + row_count.toString()).find('.btn-del-line-detail').on('click', function () {
                for (let i = 0; i <= sale_code_length; i++) {
                    $(this).closest('tr').next('tr').remove();
                }
                $(this).closest('tr').remove();
                count_row(table_body, sale_code_length, 2);
            })

            $('#row-' + row_count.toString()).find(".row-toggle").on('click', function() {
                let this_row = $('#row-' + row_count.toString());
                let this_expense_item = this_row.find('.expense-select-box');
                let this_type = this_row.find('.expense-type');
                let this_uom = this_row.find('.expense-uom-select-box');
                let this_quantity = this_row.find('.expense-quantity');
                let this_unit_price = this_row.find('.expense-unit-price-select-box');
                let this_subtotal_price = this_row.find('.expense-subtotal-price');
                let this_after_tax_subtotal = this_row.find('.expense-subtotal-price-after-tax');
                let this_document_number = this_row.find('.expense-document-number');

                if (this_expense_item.val() && this_type.val() && this_uom.val() && this_quantity.val() && this_unit_price.attr('value')
                    && this_subtotal_price.attr('value') && this_after_tax_subtotal.attr('value') && this_document_number.val())
                {
                    let row_number = this_row.attr('id').split('-')[1];
                    let detail_expense_id = '.row-detail-expense-' + row_number;
                    if ($(detail_expense_id).is(":hidden")) {
                        $(detail_expense_id).prop('hidden', false);
                    }
                    else {
                        $(detail_expense_id).prop('hidden', true);
                    }
                }
            });

            $('.row-detail-expense-' + row_count.toString()).find(".btn-add-payment-value").on('click', function() {
                $("#tab-1-offCanvas").attr('style', "font-size: xx-large; font-weight: bolder");
                $("#tab-2-offCanvas").attr('style', "font-size: large; font-weight: bolder");
                current_value_converted_from_ap = $(this);
                sale_code_id_list = sale_code_selected_list;
                if (sale_code_selected_list.length <= 0) {
                    sale_code_id_list = $('#sale-code-select-box option:selected').val();
                }
                $('.total-expense-selected').attr('data-init-money', 0);
                $.fn.initMaskMoney2();
                $('.expense-tables').html(``);
                $('#wizard-t-0').click();
                loadAPList(sale_code_id_list);
            });

            $('#row-' + row_count + ' .expense-select-box').on('change', function () {
                let parent_tr = $(this).closest('tr');
                parent_tr.find('.expense-type').val($(this).find('option:selected').attr('data-type'));
                parent_tr.find('.expense-tax-select-box').val($(this).find('option:selected').attr('data-tax-id'));

                $('#' + parent_tr.attr('id') + ' .expense-unit-price-select-box').attr('value', '');
                $('#' + parent_tr.attr('id') + ' .expense-quantity').val(1);
                $('#' + parent_tr.attr('id') + ' .expense-subtotal-price').attr('value', '');
                $('#' + parent_tr.attr('id') + ' .expense-subtotal-price-after-tax').attr('value', '');
                // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));

                if ($(this).find('option:selected').val() !== '') {
                    loadExpenseUomList(parent_tr.attr('id'), $(this).find('option:selected').attr('data-uom-group-id'), $(this).find('option:selected').attr('data-uom-id'));
                    loadUnitPriceList(parent_tr.attr('id'), $(this).find('option:selected').val());
                }
                else {
                    $('#' + parent_tr.attr('id') + ' .expense-uom-select-box').empty();
                    $('#' + parent_tr.attr('id') + ' .dropdown-menu').html('');
                }
            })

            $.fn.initMaskMoney2();
        }
    });

    function count_row(table_body, sale_code_length, option) {
        let count = 0;
        table_body.find('tr td.number').each(function() {
            count = count + 1;
            $(this).text(count);
            $(this).closest('tr').attr('id', 'row-' + count.toString());
            let detail_expense_element = $(this).closest('tr').nextAll().slice(0, sale_code_length)
            detail_expense_element.each(function (index, element) {
                $(this).attr('class', 'row-detail-expense-' + count.toString());
            });
        });
        if (option === 1) {
            loadExpenseList('row-' + count.toString());
            loadExpenseTaxList('row-' + count.toString());
        }
        return count;
    }

    function loadExpenseList(row_id) {
        let ele = $('#' + row_id + ' .expense-select-box');
        ele.select2();
        ele.html('');
        ele.append(`<option></option>`);
        expense_list.map(function (item) {
            let tax_code_id = '';
            if (item.general_information.tax_code) {
                tax_code_id = item.general_information.tax_code.id;
            }
            ele.append(`<option data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.expense_type.title + `" data-uom-id="` + item.general_information.uom.id + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
        })
    }

    function loadExpenseTaxList(row_id) {
        let ele = $('#' + row_id + ' .expense-tax-select-box');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-tax-list'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele.append(`<option data-rate="0" selected></option>`);
                    resp.data.tax_list.map(function (item) {
                        ele.append(`<option data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadExpenseUomList(row_id, uom_group_id, uom_mapped_id) {
        let ele = $('#' + row_id + ' .expense-uom-select-box');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-uom-list'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    resp.data.unit_of_measure.map(function (item) {
                        if (item.group.id === uom_group_id) {
                            if (item.id === uom_mapped_id) {
                                ele.append(`<option selected value="` + item.id + `">` + item.title + `</option>`);
                            }
                            else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                            }
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUnitPriceList(row_id, expense_item_id) {
        let ele = $('#' + row_id + ' .dropdown-menu');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-unit-price-list').replace('/0', '/' + expense_item_id), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense')) {
                    let primary_currency = 'VND';
                    resp.data.expense.general_information.price_list.map(function (item) {
                        if (item.is_primary === true) {
                            primary_currency = item.abbreviation;
                            ele.append(`<a data-id="` + item.id + `" data-value="` + item.price_value + `" class="dropdown-item"><div class="row">
                                        <div class="col-7 text-left"><span>` + item.title + `:</span></div>
                                        <div class="col-5 text-right"><span class="mask-money" data-init-money="` + item.price_value + `"></span></div>
                                        </div></a>`)
                            $.fn.initMaskMoney2();
                            $(`a[data-id=` + item.id + `]`).on('click', function () {
                                let tr = $(this).closest('tr');
                                let input_show = tr.find('.expense-unit-price-select-box');
                                let subtotal_show = tr.find('.expense-subtotal-price');
                                let subtotal_after_tax_show = tr.find('.expense-subtotal-price-after-tax');
                                let quantity = tr.find('.expense-quantity');
                                let tax = tr.find('.expense-tax-select-box option:selected');
                                input_show.attr('value', $(this).attr('data-value'));
                                $.fn.initMaskMoney2();
                                if (input_show.attr('value') && quantity.val() && tax.attr('data-rate')) {
                                    subtotal_show.attr('value', parseFloat(input_show.attr('value')) * parseInt(quantity.val()));
                                    let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                                    subtotal_after_tax_show.attr('value', parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
                                }
                                // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                            })
                        }
                    })
                    ele.append(`<div class="dropdown-divider"></div>`)
                    ele.append(`<a data-id="unit-price-a-` + expense_item_id + `" data-value=""><div class="row">
                                <div class="col-7 text-left col-form-label"><span style="color: #007D88">Enter price in <b>` + primary_currency + `</b>:</span></div>
                                <div class="col-5 text-right"><input type="text" id="unit-price-input-` + expense_item_id + `" class="form-control mask-money" data-return-type="number"></div>
                                </div></a>`)

                    $.fn.initMaskMoney2();

                    $('#' + row_id + ' #unit-price-input-' + expense_item_id).on('change', function () {
                        let tr = $(this).closest('tr');
                        let input_show = tr.find('.expense-unit-price-select-box');
                        let quantity = tr.find('.expense-quantity');
                        let tax = tr.find('.expense-tax-select-box option:selected');
                        let subtotal_show = tr.find('.expense-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.expense-subtotal-price-after-tax');
                        input_show.attr('value', $(this).attr('value'));
                        $(`a[data-id="unit-price-a-` + expense_item_id + `"]`).attr('data-value', $(this).attr('value'));
                        $.fn.initMaskMoney2();
                        if ($(this).attr('value') && input_show.attr('value') && quantity.val() && tax.attr('data-rate')) {
                            subtotal_show.attr('value', parseFloat(input_show.attr('value')) * parseInt(quantity.val()));
                            let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                            subtotal_after_tax_show.attr('value',parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
                        }
                        else {
                            input_show.attr('value', '');
                            subtotal_show.attr('value', '');
                            subtotal_after_tax_show.attr('value', '');
                        }
                        // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                    })

                    $('#' + row_id + ' .expense-quantity').on('change', function () {
                        let tr = $(this).closest('tr');
                        let input_show = tr.find('.expense-unit-price-select-box');
                        let tax = tr.find('.expense-tax-select-box option:selected');
                        let subtotal_show = tr.find('.expense-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.expense-subtotal-price-after-tax');
                        $.fn.initMaskMoney2();
                        if (input_show.attr('value') && $(this).attr('value') && tax.attr('data-rate')) {
                            subtotal_show.attr('value', parseFloat(input_show.attr('value')) * parseInt($(this).val()));
                            let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                            subtotal_after_tax_show.attr('value', parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
                        }
                        else {
                            input_show.attr('value', '');
                            subtotal_show.attr('value', '');
                            subtotal_after_tax_show.attr('value', '');
                        }
                        // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                    })

                    $('#' + row_id + ' .expense-tax-select-box').on('change', function () {
                        let tr = $(this).closest('tr');
                        let tax = $(this).find('option:selected');
                        let quantity = tr.find('.expense-quantity');
                        let subtotal_show = tr.find('.expense-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.expense-subtotal-price-after-tax');
                        $.fn.initMaskMoney2();
                        if (quantity.val() && tax.attr('data-rate')) {
                            let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                            subtotal_after_tax_show.attr('value', parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
                        }
                        // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                    })
                }
            }
        }, (errs) => {
        },)
    }

    // Initialize wizard
    $("#wizard").steps({
        transitionEffect: 'slide',
    });

    $('#wizard-t-0').attr('hidden', true);
    $('#wizard-t-1').attr('hidden', true);
    $('#wizard-t-0').closest('li').append(`<span id="tab-1-offCanvas" class="text-primary" style="font-size: xx-large; font-weight: bolder">1. Select Advance Payment Items</span>`);
    $('#wizard-t-1').closest('li').append(`<span id="tab-2-offCanvas" class="text-primary" style="font-size: larger; font-weight: bolder">2. Select Expense Items</span>`);

    $('.content').css({
        'background': 'none'
    })

    let AP_db = $('#advance_payment_list_datatable');

    function loadAPList(sale_code_id) {
        $('#advance_payment_list_datatable').DataTable().destroy();
        let AP_db = $('#advance_payment_list_datatable');
        AP_db.DataTableDefault({
            dom: "<'row mt-3 miner-group'<'col-sm-12 col-md-3 col-lg-2 mt-3'f>>" + "<'row mt-3'<'col-sm-12'tr>>",
            scrollY: "75%",
            scrollX: true,
            paginate: false,
            ajax: {
                url: AP_db.attr('data-url'),
                type: AP_db.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.data['advance_payment_list']) {
                            let sale_order_mapped_ap = $.grep(resp.data['advance_payment_list'], function(item) {
                                return sale_code_id.includes(item.sale_order_mapped);
                            });
                            let quotation_mapped_ap = $.grep(resp.data['advance_payment_list'], function(item) {
                                return sale_code_id.includes(item.quotation_mapped);
                            });
                            console.log(sale_order_mapped_ap.concat(quotation_mapped_ap))
                            return sale_order_mapped_ap.concat(quotation_mapped_ap)
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
                    render: (data, type, row, meta) => {
                        return `<input data-id="` + row.id + `" class="ap-selected" type="checkbox">`
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-outline badge-soft-danger">` + row.code + `</span>`;
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.title + `</span>`;
                    }
                },
                {
                    data: 'to_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.to_payment + `"></span>`
                    }
                },
                {
                    data: 'return_value',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.return_value + `"></span>`
                    }
                },
                {
                    data: 'remain_value',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.remain_value + `"></span>`
                    }
                },
                {
                    data: 'available_value',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.available_value + `"></span>`
                    }
                },
            ],
        });
    }

    $('.content').addClass('h-70');
    $('#wizard-p-0').addClass('w-100');
    $('#advance_payment_list_datatable_wrapper').addClass('h-80');

    $('.actions').find('a[href="#next"]').on('click', function () {
        $("#tab-2-offCanvas").attr('style', "font-size: xx-large; font-weight: bolder");
        $("#tab-1-offCanvas").attr('style', "font-size: large; font-weight: bolder");
        let selected_ap_list = [];
        let selected_ap_code_list = [];
        $('.ap-selected').each(function (index, element) {
            if ($(this).is(':checked') === true) {
                selected_ap_list.push($(this).attr('data-id'));
                selected_ap_code_list.push($(this).closest('td').next('td').text());
            }
        })
        if (selected_ap_list.length === 0) {
            setTimeout(function(){
            $('.alert.alert-dismissible .close').addClass('btn-close').removeClass('close');
            },100);
            $.notify("Warning: Select at least 1 Advance Payment Item for next step.", {
                animate: {
                    enter: 'animated bounceInDown',
                    exit: 'animated bounceOutUp'
                },
                type: "dismissible alert-warning",
            });
        }
        else {
            let tab2 = $('.expense-tables');
            tab2.html(``);
            for (let i = 0; i < selected_ap_list.length; i++) {
                $.fn.callAjax(AP_db.attr('data-url-ap-detail').replace('/0', '/' + selected_ap_list[i]), AP_db.attr('data-method')).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                            let ap_item_detail = data.advance_payment_detail;
                            if (ap_item_detail.expense_items.length > 0) {
                                tab2.append(`<div class="mt-7 mb-3 row">
                                    <div class="col-2 mt-2"><span class="ap-code-span badge badge-primary">` + selected_ap_code_list[i] + `</span></div>
                                </div>`)
                                tab2.append(`<table id="expense-item-table-` + ap_item_detail.id + `" class="table nowrap w-100">
                                    <thead>
                                        <tr>
                                            <th class="w-5"></th>
                                            <th class="w-10">Expense/Cost Items</th>
                                            <th class="w-10">Type</th>
                                            <th class="w-5">Quantity</th>
                                            <th class="w-15">Unit Price</th>
                                            <th class="w-10">Tax</th>
                                            <th class="w-15">Remain</th>
                                            <th class="w-15">Available</th>
                                            <th class="w-15">Converted Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>`);
                                let expense_table = $('#expense-item-table-' + ap_item_detail.id)
                                let total_remain_value = 0;
                                for (let i = 0; i < ap_item_detail.expense_items.length; i++) {
                                    let expense_item = ap_item_detail.expense_items[i];
                                    let tax_code = '';
                                    if (expense_item.tax) {
                                        tax_code = expense_item.tax.code
                                    }
                                    let disabled = 'disabled';
                                    if (expense_item.available_total > 0) {
                                        disabled = '';
                                    }
                                    total_remain_value += expense_item.available_total;
                                    expense_table.append(`<tr>
                                        <td><input data-id="` + expense_item.id + `" class="expense-selected" type="checkbox" ` + disabled + `></td>
                                        <td>` + expense_item.expense.title + `</td>
                                        <td>` + expense_item.expense.type.title + `</td>
                                        <td class="text-center">` + expense_item.expense_quantity + `</td>
                                        <td><span class="text-primary mask-money" data-init-money="` + expense_item.unit_price + `"></span></td>
                                        <td><span class="badge badge-soft-danger">` + tax_code + `</span></td>
                                        <td><span class="text-primary mask-money expense-remain-value" data-init-money="` + expense_item.remain_total + `"></span></td>
                                        <td><span class="text-primary mask-money expense-available-value" data-init-money="` + expense_item.available_total + `"></span></td>
                                        <td><input class="mask-money form-control converted-value-inp" disabled></td>
                                    </tr>`)
                                }
                                expense_table.append(`<tr style="background-color: #ebf5f5">
                                    <td></td><td></td><td></td><td></td><td></td><td></td>
                                    <td><span style="text-align: left"><b>Total:</b></span></td>
                                    <td><span class="mask-money total-available-value text-primary" data-init-money="` + total_remain_value + `"></span></td>
                                    <td><span class="mask-money total-converted-value text-primary" data-init-money="0"></span></td>
                                </tr>`)

                                $('.converted-value-inp').on('change', function () {
                                    let expense_available_value = $(this).closest('tr').find('.expense-available-value').attr('data-init-money');
                                    let converted_value = $(this).attr('value');
                                    if (parseFloat(converted_value) > parseFloat(expense_available_value)) {
                                        $(this).attr('value', parseFloat(expense_available_value));
                                    }

                                    let new_total_converted_value = 0;
                                    $(this).closest('tbody').find('.converted-value-inp').each(function (index, element) {
                                        if (parseFloat($(this).attr('value'))) {
                                            new_total_converted_value += parseFloat($(this).attr('value'));
                                        }
                                    });
                                    $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                    $('.total-expense-selected').attr('data-init-money', calculate_sum_ap_expense_items());

                                    $.fn.initMaskMoney2();
                                });

                                $('.expense-selected').on('change', function () {
                                    if ($(this).is(':checked')) {
                                        $(this).closest('tr').find('.converted-value-inp').prop('disabled', false);
                                    }
                                    else {
                                        $(this).closest('tr').find('.converted-value-inp').prop('disabled', true);
                                        $(this).closest('tr').find('.converted-value-inp').attr('value', '');
                                    }

                                    let new_total_converted_value = 0;
                                    $(this).closest('tbody').find('.converted-value-inp').each(function (index, element) {
                                        if (parseFloat($(this).attr('value'))) {
                                            new_total_converted_value += parseFloat($(this).attr('value'));
                                        }
                                    });
                                    $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                    $('.total-expense-selected').attr('data-init-money', calculate_sum_ap_expense_items());

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

    $('.actions').find('a[href="#previous"]').on('click', function () {
        $("#tab-1-offCanvas").attr('style', "font-size: xx-large; font-weight: bolder");
        $("#tab-2-offCanvas").attr('style', "font-size: large; font-weight: bolder");
    })

    $('.actions').find('a[href="#finish"]').on('click', function () {
        let result_total_value = calculate_sum_ap_expense_items();
        current_value_converted_from_ap.closest('div').find('.value-converted-from-ap-inp').attr('value', result_total_value);

        let value_input_ap = parseFloat(current_value_converted_from_ap.closest('tr').find('.value-inp').attr('value'));
        if (isNaN(value_input_ap)) { value_input_ap = 0; }
        current_value_converted_from_ap.closest('tr').find('.total-value-salecode-item').attr('data-init-money', result_total_value + value_input_ap);
        current_value_converted_from_ap.closest('tr').find('.detail-ap-items').text(JSON.stringify(get_ap_expense_items()));

        $.fn.initMaskMoney2();
        $('#offcanvasSelectDetailAP').offcanvas('hide');
    })

    function calculate_sum_ap_expense_items() {
        let result_total_value = 0;
        $('.expense-tables').find('.total-converted-value').each(function (index, element) {
            result_total_value += parseFloat($(this).attr('data-init-money'));
        })
        return result_total_value;
    }

    function get_ap_expense_items() {
        let ap_expense_items = [];
        $('.expense-tables').find('.expense-selected').each(function (index, element) {
            if ($(this).is(':checked')) {
                let value = $(this).closest('tr').find('.converted-value-inp').attr('value');
                ap_expense_items.push({'id': $(this).attr('data-id'), 'value': value});
            }
        })
        return ap_expense_items;
    }

    $('.actions').find('ul').prepend(`<li aria-disabled="false">
            <label class="col-form-label text-primary text-decoration-underline"><b>TOTAL</b></label>
        </li>
        <li aria-disabled="false">
            <div class="row form-group">
                <div class="col-12 text-left">
                    <span style="font-size: x-large" class="mask-money total-expense-selected text-primary" data-init-money="0"></span>
                </div>
            </div>
        </li>`)

    $('#wizard-p-1').addClass('w-100');

    $('#form-create-payment').submit(function (event) {
        let can_submit = 1;
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        if ($('#tab_line_detail tbody').find('tr').length > 0) {
            let table_body = $('#tab_line_detail tbody');
            let row_count = table_body.find('tr').length;
            let expense_valid_list = [];
            for (let i = 1; i <= row_count; i++) {
                let expense_detail_value = 0;

                let row_id = '#row-' + i.toString();
                let document_number = table_body.find(row_id + ' .expense-document-number').val();
                let expense_selected = table_body.find(row_id + ' .expense-select-box option:selected');
                let uom_selected = table_body.find(row_id + ' .expense-uom-select-box option:selected');
                let subtotal_price_value = parseFloat(table_body.find(row_id + ' .expense-subtotal-price').attr('value'));
                let price_after_tax_value = parseFloat(table_body.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));
                let tax_value = parseFloat(table_body.find(row_id + ' .expense-tax-select-box option:selected').attr('data-rate')) / 100 * subtotal_price_value;
                let unit_price_value = parseFloat(table_body.find(row_id + ' .expense-unit-price-select-box').attr('value'));

                let expense_ap_detail_list = [];
                let sale_code_len = 1;
                if (frm.dataForm['sale_code_type'] === 'MULTI') {
                    sale_code_len = sale_code_selected_list.length;
                }
                let sale_code_item = table_body.find(row_id).nextAll().slice(1, sale_code_len + 1);
                sale_code_item.each(function() {
                    let converted_value_detail = [{'id': null, 'value': 0}];
                    if ($(this).find('.detail-ap-items').html()) {
                        converted_value_detail = JSON.parse($(this).find('.detail-ap-items').html());
                    }
                    let real_value = 0;
                    if ($(this).find('.value-inp').attr('value')) {
                        real_value = $(this).find('.value-inp').attr('value');
                    }
                    let converted_value = $(this).find('.value-converted-from-ap-inp').attr('value');
                    if (converted_value_detail[0]['id'] === null) {
                        converted_value = 0;
                    }
                    let sum_value = 0;
                    if ($(this).find('.total-value-salecode-item').attr('data-init-money')) {
                        sum_value = $(this).find('.total-value-salecode-item').attr('data-init-money');
                    }
                    expense_ap_detail_list.push({
                        'sale_code_mapped': $(this).find('.sale_code_expense_detail').attr('data-sale-code-id'),
                        'real_value': real_value,
                        'converted_value': converted_value,
                        'sum_value':  sum_value,
                        'converted_value_detail': converted_value_detail
                    })

                    expense_detail_value = parseFloat(expense_detail_value) + parseFloat(sum_value);
                });
                if (!isNaN(subtotal_price_value) && !isNaN(price_after_tax_value) && !isNaN(tax_value)) {
                    expense_valid_list.push({
                        'expense_id': expense_selected.attr('value'),
                        'unit_of_measure_id': uom_selected.attr('value'),
                        'quantity': table_body.find(row_id + ' .expense-quantity').val(),
                        'tax_id': table_body.find(row_id + ' .expense-tax-select-box option:selected').attr('value'),
                        'unit_price': unit_price_value,
                        'tax_price': tax_value,
                        'subtotal_price': subtotal_price_value,
                        'after_tax_price': price_after_tax_value,
                        'document_number': document_number,
                        'expense_ap_detail_list': expense_ap_detail_list
                    })
                }

                if (price_after_tax_value < expense_detail_value) {
                    can_submit = 0;
                    $.fn.notifyPopup({description: 'Detail tab - line ' + i + ': Expense value declared < Sum SaleCode values'}, 'failure');
                }
            }
            frm.dataForm['expense_valid_list'] = expense_valid_list;
        }

        if ($('input[name="sale_code_type"]:checked').val() === 'non-sale') {
            frm.dataForm['sale_code_type'] = 2;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'sale') {
            frm.dataForm['sale_code_type'] = 0;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'purchase') {
            frm.dataForm['sale_code_type'] = 1;
        }
        else {
            frm.dataForm['sale_code_type'] = 3;
        }

        if (frm.dataForm['sale_code_type'] === 3) { // multi
            delete frm.dataForm['sale_code']
            frm.dataForm['sale_order_selected_list'] = sale_order_selected_list;
            frm.dataForm['quotation_selected_list'] = quotation_selected_list;
        }
        else if (frm.dataForm['sale_code_type'] === 0) {  // sale
            if ($('#sale-code-select-box option:selected').attr('data-type') === '0') {
                frm.dataForm['sale_code_detail'] = 0;
            }
            if ($('#sale-code-select-box option:selected').attr('data-type') === '1') {
                frm.dataForm['sale_code_detail'] = 1;
            }
        }

        if ($('#creator-select-box').val() !== null) {
            frm.dataForm['creator_name'] = $('#creator-select-box').val();
        }
        else {
            frm.dataForm['creator_name'] = null;
        }

        if ($('#beneficiary-select-box').val() !== null) {
            frm.dataForm['beneficiary'] = $('#beneficiary-select-box').val();
        }
        else {
            frm.dataForm['beneficiary'] = null;
        }

        if (frm.dataForm['method'] === '0') {
            frm.dataForm['method'] = 0;
        }
        else if (frm.dataForm['method'] === '1') {
            frm.dataForm['method'] = 1;
        }
        else {
            frm.dataForm['method'] = 2;
        }

        // console.log(frm.dataForm)
        if (can_submit) {
            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

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
})