$(document).ready(function () {
    let shipping_address_id_dict = [];
    let billing_address_id_dict = [];

    // load Cities SelectBox
    function loadCities() {
        $("#shipping-district option:selected").prop("selected", false);
        $("#shipping-ward option:selected").prop("selected", false);
        let ele = $('#shipping-city');
        let url = ele.attr('data-select2-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected>---</option>`)
                    if (data.hasOwnProperty('cities') && Array.isArray(data.cities)) {
                        data.cities.map(function (item) {
                            ele.append(`<option data-country-id="` + item.country_id + `" value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    loadCities();

    function load_contact_mapped(contact_mapped) {
        if (!$.fn.DataTable.isDataTable('#datatable_contact_mapped_list')) {
            let dtb = $('#datatable_contact_mapped_list');
            dtb.DataTableDefault({
                data: contact_mapped,
                columns: [
                    {
                        data: 'fullname',
                        render: (data, type, row, meta) => {
                            return `<a href="/saledata/contact/` + row.id + `" data-id="${row.id}"><span><b>` + data + `</b></span></a>`
                        }
                    },
                    {
                        data: 'job_title',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-primary badge-pill span-product-type" style="min-width: 100%; width: 100%">` + data + `</span>`
                        }
                    },
                    {
                        data: 'mobile',
                        render: (data, type, row, meta) => {
                            if (row.mobile) {
                                return `<center><span class="text-secondary span-product-type" style="min-width: 100%; width: 100%">${row.mobile}</span></center>`
                            }
                            return ``
                        }
                    },
                    {
                        data: 'email',
                        render: (data, type, row, meta) => {
                            if (row.email) {
                                return `<center><span class="text-secondary span-product-type" style="min-width: 100%; width: 100%">${row.email}</span></center>`
                            }
                            return ``
                        }
                    },
                ],
            });
        }
    }

    // load data detail
    let pk = window.location.pathname.split('/').pop();
    let url_loaded = $('#form-detail-update-account').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['account_detail']?.['workflow_runtime_id']);
                data = data['account_detail'];
                $.fn.compareStatusShowPageAction(data);

                $('#account-title-id').val(data.name);
                $('#account-code-id').val(data.code);
                $('#account-website-id').val(data.website);
                $('#account-phone-number-id').val(data.phone);
                $('#account-email-id').val(data.email);
                $('#account-tax-code-id').val(data.tax_code);

                if (data.account_type_selection === 0) {
                    $('#inp-individual').prop('checked', true);
                    $('#parent-account-div-id').prop('hidden', true);
                    $('#account-tax-code-label-id').removeClass('required');
                    $('#total_employees_label').removeClass('required');
                } else if (data.account_type_selection === 1) {
                    $('#inp-organization').prop('checked', true);
                    $('#parent-account-div-id').prop('hidden', false);
                    $('#account-tax-code-label-id').addClass('required');
                    $('#total_employees_label').addClass('required');
                }

                let list_shipping_address = ``;
                for (let i = 0; i < data.shipping_address.length; i++) {
                    let shipping_address = data.shipping_address[i];
                    if (shipping_address.is_default) {
                        list_shipping_address += `<div class="form-check ml-5 mb-2">
                                    <input class="form-check-input" type="radio" name="shippingaddressRadio" checked disabled>
                                    <label>` + shipping_address.full_address + `</label>
                                    <a hidden href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                               </div>`;
                    } else {
                        list_shipping_address += `<div class="form-check ml-5 mb-2">
                                    <input class="form-check-input" type="radio" name="shippingaddressRadio" disabled>
                                    <label>` + shipping_address.full_address + `</label>
                                    <a hidden href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                               </div>`;
                    }
                }
                $('#list-shipping-address').html(list_shipping_address);

                let list_billing_address = ``
                for (let i = 0; i < data.billing_address.length; i++) {
                    let billing_address = data.billing_address[i];
                    if (billing_address.is_default) {
                        list_billing_address += `<div class="form-check ml-5 mb-2">
                                    <input class="form-check-input" type="radio" name="billingaddressRadio" checked disabled>
                                    <label>` + billing_address.full_address + `</label>
                                    <a hidden href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                               </div>`;
                    } else {
                        list_billing_address += `<div class="form-check ml-5 mb-2">
                                    <input class="form-check-input" type="radio" name="billingaddressRadio" disabled>
                                    <label>` + billing_address.full_address + `</label>
                                    <a hidden href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                               </div>`;
                    }
                }
                $('#list-billing-address').html(list_billing_address)

                let list_bank_accounts_html = ``
                for (let i = 0; i < data.bank_accounts_information.length; i++) {
                    let country_id = data.bank_accounts_information[i].country_id;
                    let bank_name = data.bank_accounts_information[i].bank_name;
                    let bank_code = data.bank_accounts_information[i].bank_code;
                    let bank_account_name = data.bank_accounts_information[i].bank_account_name;
                    let bank_account_number = data.bank_accounts_information[i].bank_account_number;
                    let bic_swift_code = data.bank_accounts_information[i].bic_swift_code;
                    let is_default = '';
                    if (data.bank_accounts_information[i].is_default) {
                        is_default = 'checked';
                    }
                    list_bank_accounts_html += `<div class="card card-bank-account col-8 ml-3">
                                        <span class="mt-2">
                                            <div class="row">
                                                <div class="col-6">
                                                    <a class="btn-del-bank-account" hidden href="#"><i class="bi bi-x"></i></a>
                                                </div>
                                                <div class="col-6 text-right">
                                                    <input class="form-check-input ratio-select-bank-account-default" disabled type="radio" name="bank-account-select-default"` + is_default + `>
                                                </div>
                                            </div>
                                        </span>
                                        <label class="ml-3">Bank account name: <a class="bank-account-name-label" href="#"><b>` + bank_account_name + `</b></a></label>
                                        <label class="ml-3">Bank name: <a class="bank-name-label" href="#"><b>` + bank_name + `</b></a></label>
                                        <label class="ml-3 mb-3">Bank account number: <a class="bank-account-number-label" href="#"><b>` + bank_account_number + `</b></a></label>
                                        <label hidden class="ml-3">Country ID: <a class="country-id-label" href="#"><b>` + country_id + `</b></a></label>
                                        <label hidden class="ml-3">Bank code: <a class="bank-code-label" href="#"><b>` + bank_code + `</b></a></label>
                                        <label hidden class="ml-3">BIC/SWIFT Code: <a class="bic-swift-code-label" href="#"><b>` + bic_swift_code + `</b></a></label>
                                    </div>`
                }
                $('#list-bank-account-information').html(list_bank_accounts_html);

                let list_credit_cards_html = ``
                for (let i = 0; i < data.credit_cards_information.length; i++) {
                    let credit_card_type = data.credit_cards_information[i].credit_card_type;
                    let credit_card_number = data.credit_cards_information[i].credit_card_number;
                    let credit_card_name = data.credit_cards_information[i].credit_card_name;
                    let credit_card_exp_date = data.credit_cards_information[i].expired_date;
                    let is_default = '';
                    if (data.credit_cards_information[i].is_default) {
                        is_default = 'checked';
                    }
                    list_credit_cards_html += `<div class="card card-credit-card col-8 ml-3">
                                            <span class="mt-2">
                                                <div class="row">
                                                    <div class="col-6">
                                                        <a class="btn-del-credit-card" hidden href="#"><i class="bi bi-x"></i></a>
                                                    </div>
                                                    <div class="col-6 text-right">
                                                        <input class="form-check-input credit-card-select-default" disabled type="radio" name="credit-card-select-default"` + is_default + `>
                                                    </div>
                                                </div>
                                            </span>
                                            <label class="ml-3">Card Type: <a class="credit_card_type" href="#"><b>` + credit_card_type + `</b></a></label>
                                            <label class="ml-3">Card Number: <a class="credit_card_number" href="#"><b>` + credit_card_number + `</b></a></label>
                                            <label class="ml-3">Card Exp: <a class="expired_date" href="#"><b>` + credit_card_exp_date + `</b></a></label>
                                            <label class="ml-3 mb-3">Card Name: <a class="credit_card_name" href="#"><b>` + credit_card_name + `</b></a></label>
                                        </div>`
                }
                $('#list-credit-card-information').html(list_credit_cards_html);

                // delete bank account item
                $('.btn-del-bank-account').on('click', function () {
                    $(this).closest('.card').remove()
                })

                // delete credit card item
                $('.btn-del-credit-card').on('click', function () {
                    $(this).closest('.card').remove()
                })

                load_contact_mapped(data.contact_mapped);

                loadAccountType(data.account_type.map(obj => obj.id));

                if ($.inArray("organization", data.account_type.map(obj => obj.detail)) !== -1) {
                    $('#inp-organization').attr('checked', true);
                    $("#account-tax-code-label-id").addClass("required");
                    $('#parent-account-div-id').prop('hidden', false);
                }
                if ($.inArray("individual", data.account_type.map(obj => obj.detail)) !== -1) {
                    $('#inp-individual').prop('checked', true);
                    $("#account-tax-code-label-id").removeClass("required");
                    $('#parent-account-div-id').prop('hidden', true);
                }

                $('#edit-account-on').on('click', function () {
                    $('.select2-selection').css({
                        'border': 'solid #aaa 1px',
                        'background': 'none'
                    });
                    $('#account-type-id').prop('disabled', false);
                    $('#account-manager-id').prop('disabled', false);

                    $('.form-select').prop('disabled', false);
                    $('.input-can-edit').prop('readonly', false);
                    $('.form-check-input').prop('disabled', false);
                    if ($.inArray("organization", data.account_type.map(obj => obj.detail)) !== -1) {
                        $('#parent-account-id').attr('disabled', false);
                    }
                    $('.view-mode-for-select').hide();
                    $('#edit-account-on').prop('hidden', true);
                    $('#save-account-on').prop('hidden', false);
                    $('#shipping-address-btn').prop('hidden', false);
                    $('#billing-address-btn').prop('hidden', false);
                    $('#bank-account-information-btn').prop('hidden', false);
                    $('#credit-card-information-btn').prop('hidden', false);
                    $('.del-address-item').prop('hidden', false);

                    $('.bank-account-select-default').prop('disabled', false);
                    $('.btn-del-bank-account').prop('hidden', false);

                    $('.credit-card-select-default').prop('disabled', false);
                    $('.btn-del-credit-card').prop('hidden', false);

                    $('#parent-account-id').select2();
                    $('#account-owner-id').select2();

                    $('#shipping-city').initSelect2();
                    $('#shipping-district').initSelect2();
                    $('#shipping-ward').initSelect2();

                    $('#select-box-account-name').initSelect2();
                })

                // delete address item
                $('.del-address-item').on('click', function () {
                    $(this).parent().remove();
                })

                loadIndustry(data.industry);

                $('#account-revenue-id').find(`option[value="` + data.annual_revenue + `"]`).prop('selected', true);
                $('#total-employees-id').find(`option[value="` + data.total_employees + `"]`).prop('selected', true);

                loadParentAccount(data.parent_account, data.id);

                loadAccountManager(data.manager.map(obj => obj.id));

                loadCurrency(data.currency);

                let current_owner = data.owner;
                let current_contact = data.contact_mapped;
                loadAccountOwner(current_owner, current_contact)

                loadAccountGroup(data.account_group);

                loadPaymentTerms(data.payment_term_customer_mapped, data.payment_term_supplier_mapped);

                loadPriceList(data.price_list_mapped);

                loadCountries('country_mapped');

                $('#credit-limit-id-customer').attr('value', data.credit_limit_customer);
                $('#credit-limit-id-supplier').attr('value', data.credit_limit_supplier);
                $.fn.initMaskMoney2();

                $('#account-type-id').prop('disabled', true);
                $('#account-manager-id').prop('disabled', true);
                $('.select2-selection').css({
                    'border': 'none',
                    'background': '#f7f7f7'
                });
            }
        })

    // load Account Type SelectBox
    function loadAccountType(account_type_mapped) {
        let ele = $('#account-type-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_type_list') && Array.isArray(data.account_type_list)) {
                        data.account_type_list.map(function (item) {
                            if (account_type_mapped.includes(item.id)) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                                if (item.title === 'Customer') {
                                    $('#role-for-customer').prop('hidden', false);
                                }
                                if (item.title === 'Supplier') {
                                    $('#role-for-supplier').prop('hidden', false);
                                }
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    $('#account-type-id').select2();

    // load Industry SelectBox
    function loadIndustry(industry_mapped) {
        let ele = $('#account-industry-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected></option>`)
                    if (data.hasOwnProperty('industry_list') && Array.isArray(data.industry_list)) {
                        data.industry_list.map(function (item) {
                            if (industry_mapped === item.id) {
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

    // loaf Currency
    function loadCurrency(currency_mapped) {
        let ele = $('#currency-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected></option>`)
                    if (data.hasOwnProperty('currency_list') && Array.isArray(data.currency_list)) {
                        data.currency_list.map(function (item) {
                            if (currency_mapped === item.id) {
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

    // load Payment Terms SelectBox
    function loadPaymentTerms(payment_term_customer_mapped, payment_term_supplier_mapped) {
        let ele = $('#payment-terms-id-customer');
        let ele2 = $('#payment-terms-id-supplier');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected></option>`)
                    ele2.text("");
                    ele2.append(`<option value="" selected></option>`)
                    if (data.hasOwnProperty('payment_terms_list') && Array.isArray(data.payment_terms_list)) {
                        data.payment_terms_list.map(function (item) {
                            if (payment_term_customer_mapped === item.id) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                            if (payment_term_supplier_mapped === item.id) {
                                ele2.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                            } else {
                                ele2.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    // load Price List SelectBox
    function loadPriceList(price_list_mapped) {
        let ele = $('#price-list-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected></option>`)
                    if (data.hasOwnProperty('price_list') && Array.isArray(data.price_list)) {
                        data.price_list.map(function (item) {
                            if (price_list_mapped === item.id) {
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

    // load Countries SelectBox
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

    // load Parent Account SelectBox
    function loadParentAccount(parent_account_mapped, current_account_id) {
        let ele = $('#parent-account-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                        ele.append(`<option value=""></option>`)
                        data.account_list.map(function (item) {
                            if (item.id !== current_account_id) {
                                if (parent_account_mapped === item.id) {
                                    ele.append(`<option value="` + item.id + `" selected>` + item.name + `</option>`)
                                } else {
                                    ele.append(`<option value="` + item.id + `">` + item.name + `</option>`)
                                }
                            }
                        })
                    }
                }
            }
        )
    }

    // load Account Manager SelectBox
    function loadAccountManager(account_managers_mapped) {
        let ele = $('#account-manager-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        data.employee_list.map(function (item) {
                            if (account_managers_mapped.includes(item.id)) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.full_name + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    $('#account-manager-id').select2();

    let dict_contact = {};

    // load Account Owner SelectBox
    function loadAccountOwner(current_account_owner, contacts_mapped) {
        $('#owner-job-title-id').val(current_account_owner.job_title);
        $('#owner-email-id').val(current_account_owner.email);
        $('#owner-mobile-id').val(current_account_owner.mobile);

        let ele = $('#account-owner-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value=""></option>`)
                    if (data.hasOwnProperty('contact_list_not_map_account') && Array.isArray(data.contact_list_not_map_account)) {

                        for (let i = 0; i < contacts_mapped.length; i++) {
                            data.contact_list_not_map_account.unshift(contacts_mapped[i]);
                        }
                        dict_contact = data.contact_list_not_map_account.reduce((obj, item) => {
                            obj[item.id] = item;
                            return obj;
                        }, {});
                        loadDtbContactList(data.contact_list_not_map_account)
                        data.contact_list_not_map_account.map(function (item) {
                            if (item.id === current_account_owner.id) {
                                ele.append(`<option data-mobile="` + item.mobile + `" data-email="` + item.email + `" data-job-title="` + item.job_title + `" value="` + item.id + `" selected>` + item.fullname + `</option>`)
                            } else {
                                ele.append(`<option data-mobile="` + item.mobile + `" data-email="` + item.email + `" data-job-title="` + item.job_title + `" value="` + item.id + `">` + item.fullname + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    // load Account Group SelectBox
    function loadAccountGroup(account_group_id) {
        let ele = $('#account-group-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_group_list') && Array.isArray(data.account_group_list)) {
                        ele.append(`<option value="" selected></option>`)
                        data.account_group_list.map(function (item) {
                            if (item.id === account_group_id) {
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

    $("#credit-card-exp-date").datepicker({
        format: "mm/yyyy",
        startView: "months",
        minViewMode: "months",
    });

    function loadDtbContactList(contact_list) {
        if (!$.fn.DataTable.isDataTable('#datatable_contact_list')) {
            let dtb = $('#datatable_contact_list');
            dtb.DataTableDefault({
                paging: false,
                scrollY: '200px',
                autoWidth: false,
                columnDefs: [
                    {
                        "width": "30%",
                        "targets": 0
                    }, {
                        "width": "20%",
                        "targets": 1
                    }, {
                        "width": "20%",
                        "targets": 2
                    },
                    {
                        "width": "20%",
                        "targers": 3
                    },
                    {
                        "width": "10%",
                        "targets": 4
                    }
                ],
                data: contact_list,
                columns: [
                    {
                        data: 'fullname',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="span-fullname">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'job_title',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-soft-primary span-job-title">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'mobile',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="span-mobile">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'email',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="span-email">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="form-check"><input data-id="{0}" type="checkbox" class="form-check-input input-select-contact" /></span>`.format_by_idx(row.id)
                        }
                    },
                ],
            });
        }
    }

    function getContactMap() {
        let table = document.getElementById('datatable_contact_mapped_list');
        let tbody = table.getElementsByTagName('tbody')[0];
        let rows = tbody.getElementsByTagName('tr');
        if (rows[0].children.length > 1) {
            let list_contact_map_id = []
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                let parts = row.getElementsByTagName('a')[0].href.split('/');
                let id = parts[parts.length - 1];
                list_contact_map_id.push(id);
            }
            return list_contact_map_id;
        }
        return []
    }
})
