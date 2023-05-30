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
    let load_default = 0;

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
                        $('#beneficiary-select-box').prop('disabled', false);
                        loadBeneficiary('', $('#creator-select-box option:selected').attr('data-department-id'), '');
                        $('#sale-code-select-box').prop('disabled', true);
                        $('#sale-code-select-box').val('');
                        $('#sale-code-select-box2-show').attr('style', '');
                        $('#sale-code-select-box2-show').attr('disabled', true);
                        $('#sale-code-select-box2-show').attr('placeholder', 'Select beneficiary first');
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
                                <span class="col-1"><input type="checkbox" class="form-check-input multi-sale-code" id="` + item.id + `"></span>
                            </div>`)
            }
            else {
                sale_not_opp += `<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code">
                                    <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                    <span class="col-7 title-span" data-sale-person-id="` + item.sale_person.id + `">` + item.title +`</span>
                                    <span class="col-1"><input type="checkbox" class="form-check-input multi-sale-code" id="` + item.id + `"></span>
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
                                <span class="col-1"><input type="checkbox" class="form-check-input multi-sale-code" id="` + item.id + `"></span>
                            </div>`)
            }
            else {
                quotation_not_opp += `<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code">
                                        <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                        <span class="col-7 title-span" data-sale-person-id="` + item.sale_person.id + `">` + item.title +`</span>
                                        <span class="col-1"><input type="checkbox" class="form-check-input multi-sale-code" id="` + item.id + `"></span>
                                    </div>`
            }
        })
        ele.append(quotation_not_opp);

        $('#sale-code-select-box2 .multi-sale-code').on('click', function () {
            $(this).each(function() {
                if ($(this).is(':checked')) {
                    sale_code_selected_list.push($(this).attr('id'));
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
            if ($('#sale-code-select-box').val() !== null) {
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
            let table_body = $('#tab_line_detail tbody');
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
                <td class="action">
                    <a class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></a>
                    <a class="row-toggle btn text-primary btn-link btn-animated" title="Toggle row"><span class="icon"><i class="bi bi-caret-down-square"></i></span></a>
                </td>
            </tr>`);

            table_body.append(`<tr class="">
                <td colspan="1"></td>
                <td colspan="1">
                    <label>Sale code</label>
                </td>
                <td colspan="2">
                    <label>Value</label>
                </td>
                <td colspan="1"></td>
                <td colspan="2">
                    <label>Value converted from advance payment</label>
                </td>
                <td colspan="3"></td>
            </tr>`)

            for (let i=0; i<sale_code_length; i++) {
                table_body.append(`<tr class="">
                    <td colspan="1"></td>
                    <td colspan="1">
                        <label class="sale_code_expense_detail" data-sale-code-id="` + sale_code_id_list[i] + `"><b>` + opp_code_list[i] + `</b></label>
                    </td>
                    <td colspan="2">
                        <input data-return-type="number" class="form-control mask-money">
                    </td>
                    <td colspan="1">
                        <center><i class="bi bi-plus"></i></center>
                    </td>
                    <td colspan="2">
                        <div class="input-group">
                            <input data-return-type="number" class="form-control mask-money">
                            <button style="border: 1px solid #ced4da" data-bs-toggle="offcanvas" 
                            data-bs-target="#offcanvasSelectDetailAP" aria-controls="offcanvasExample" 
                            class="btn btn-soft-secondary btn-add-payment-value" type="button">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </div>
                    </td>
                    <td colspan="3"></td>
                </tr>`);
            }

            table_body.append(`<script>
                function checkInputQuantity(value) {
                    if (parseInt(value) < 0) {
                        return value*(-1);
                    }
                    return value;
                }
            </script>`);
            $.fn.initMaskMoney2();
            let row_count = count_row(table_body, sale_code_length+1, 1);

            $('#row-' + row_count.toString()).find('.btn-del-line-detail').on('click', function () {
                for (let i = 0; i <= sale_code_length; i++) {
                    $(this).closest('tr').next('tr').remove();
                }
                $(this).closest('tr').remove();
                count_row(table_body, sale_code_length+1, 2);
            })

            $('#row-' + row_count.toString()).find(".row-toggle").on('click', function() {
                let row_number = $(this).closest('tr').attr('id').split('-')[1];
                let detail_expense_id = '.row-detail-expense-' + row_number;
                if ($(detail_expense_id).is(":hidden")) {
                    $(detail_expense_id).prop('hidden', false);
                }
                else {
                    $(detail_expense_id).prop('hidden', true);
                }
            });

            $('.row-detail-expense-' + row_count.toString()).find(".btn-add-payment-value").on('click', function() {
                console.log(1);
            });
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
        // if (option === 1) {
        //     loadExpenseList('row-' + count.toString());
        //     loadExpenseTaxList('row-' + count.toString());
        // }
        return count;
    }

    // Initialize wizard
    $("#wizard").steps();

    $('.first').addClass('w-50');
    $('.last').addClass('w-40');
})