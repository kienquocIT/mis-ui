$(document).ready(function () {
    let shipping_address_id_dict = [];
    let billing_address_id_dict = [];

    // load Cities SelectBox
    function loadCities() {
        $("#shipping-district option:selected").prop("selected", false);
        $("#shipping-ward option:selected").prop("selected", false);
        let ele = $('#shipping-city');
        let url = ele.attr('data-url');
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

    // load Districts SelectBox
    function loadDistricts() {
        let ele = $('#shipping-district');
        let url = ele.attr('data-url').replace('pk', $('#shipping-city').val())
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected>---</option>`)
                    if (data.hasOwnProperty('districts') && Array.isArray(data.districts)) {
                        data.districts.map(function (item) {
                            ele.append(`<option data-city-id="` + item.city_id + `" value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    // load Wards SelectBox
    function loadWards() {
        let ele = $('#shipping-ward');
        let url = ele.attr('data-url').replace('pk', $('#shipping-district').val())
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected>---</option>`)
                    if (data.hasOwnProperty('wards') && Array.isArray(data.wards)) {
                        data.wards.map(function (item) {
                            ele.append(`<option data-district-id="` + item.district_id + `" value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    $('#shipping-city').on('change', function () {
        loadDistricts();
        $('#shipping-ward').html('<option value="" selected>---</option>');
    })

    $('#shipping-district').on('change', function () {
        loadWards();
    })

    $('#save-changes-modal-shipping-address').on('click', function () {
        try {
            let detail_shipping_address = $('#detail-modal-shipping-address').val();
            let city = $('#shipping-city').find(`option:selected`).text();
            let district = $('#shipping-district').find(`option:selected`).text();
            let ward = $('#shipping-ward').find(`option:selected`).text();

            let country_id = $('#shipping-city').find(`option:selected`).attr('data-country-id');
            let city_id = $('#shipping-city').find(`option:selected`).attr('value');
            let district_id = $('#shipping-district').find(`option:selected`).attr('value');
            let ward_id = $('#shipping-ward').find(`option:selected`).attr('value');

            let shipping_address = '';
            if (city !== '' && district !== '' && detail_shipping_address !== '') {

                if (ward === '') {
                    shipping_address = detail_shipping_address + ', ' + district + ', ' + city;
                } else {
                    shipping_address = detail_shipping_address + ', ' + ward + ', ' + district + ', ' + city;
                }

                $('#modal-shipping-address').modal('hide');
                $('#detail-modal-shipping-address').val('');
            } else {
                $.fn.notifyPopup({description: "Missing address information!"}, 'failure');
            }

            if (shipping_address !== '') {
                let is_default = '';
                if ($('#make-default-shipping-address').prop('checked') === true) {
                    is_default = 'checked';
                }

                $('#list-shipping-address').append(
                    `<div class="form-check ml-5 mb-2">
                        <input class="form-check-input" type="radio" name="shippingaddressRadio" ` + is_default +`>
                        <label>` + shipping_address + `</label>
                        <a href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                    </div>`
                )

                shipping_address_id_dict.push({
                    'country_id': country_id,
                    'detail_address': detail_shipping_address,
                    'city_id': city_id,
                    'district_id': district_id,
                    'ward_id': ward_id,
                    'full_address': shipping_address,
                    'is_default': $('#make-default-shipping-address').prop('checked')
                })
            }
        } catch (error) {
            $.fn.notifyPopup({description: "No address information!"}, 'failure');
        }
    })

    $('#save-changes-modal-billing-address').on('click', function () {
        try {
            let acc_name = $('#select-box-account-name').find(`option:selected`).text();
            let email_address = $('#inp-email-address').val();
            let tax_code = $('#inp-tax-code-address').val();

            let acc_name_id = $('#select-box-account-name').find(`option:selected`).attr('value');

            let account_address = $('#select-box-address').find('option:selected').val();
            if ($('#select-box-address').is(':hidden')) {
                account_address = $('#edited-billing-address').val()
            }

            let billing_address = '';
            if (email_address !== '' && tax_code !== '' && account_address !== '0') {
                billing_address = acc_name + ', ' + account_address + ' (email: ' + email_address + ', tax code: ' + tax_code + ')';
                $('#modal-billing-address').modal('hide');
            } else {
                $.fn.notifyPopup({description: "Missing address information!"}, 'failure');
            }

            if (billing_address !== '') {
                let is_default = '';
                if ($('#make-default-billing-address').prop('checked') === true) {
                    is_default = 'checked';
                }

                $('#list-billing-address').append(
                    `<div class="form-check ml-5">
                        <input class="form-check-input" type="radio" name="billingaddressRadio" ` + is_default + `>
                        <label>` + billing_address + `</label>
                        <a href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                    </div>`
                )

                billing_address_id_dict.push({
                    'account_name_id': acc_name_id,
                    'email': email_address,
                    'tax_code': tax_code,
                    'account_address': account_address,
                    'full_address': billing_address,
                    'is_default': $('#make-default-billing-address').prop('checked'),
                })
            }
        } catch (error) {
            $.fn.notifyPopup({description: "No address information!"}, 'failure');
        }
    })


    // load data detail
    let pk = window.location.pathname.split('/').pop();
    let url_loaded = $('#form-detail-update-account').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.setWFRuntimeID(data['account_detail']?.['workflow_runtime_id']);
                data = data['account_detail'];

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
                }
                else if (data.account_type_selection === 1) {
                    $('#inp-organization').prop('checked', true);
                    $('#parent-account-div-id').prop('hidden', false);
                    $('#account-tax-code-label-id').addClass('required');
                }

                let list_shipping_address = ``;
                for (let i = 0; i < data.shipping_address.length; i++) {
                    if (i === 0) {
                        list_shipping_address += `<div class="form-check ml-5 mb-2">
                                <input class="form-check-input" type="radio" name="shippingaddressRadio" checked disabled>
                                <label>`+ data.shipping_address[i] +`</label>
                                <a hidden href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                           </div>`;
                    }
                    else {
                        list_shipping_address += `<div class="form-check ml-5 mb-2">
                                <input class="form-check-input" type="radio" name="shippingaddressRadio" disabled>
                                <label>`+ data.shipping_address[i] +`</label>
                                <a hidden href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                           </div>`;
                    }
                }
                $('#list-shipping-address').html(list_shipping_address);

                let list_billing_address = ``
                for (let i = 0; i < data.billing_address.length; i++) {
                    let billing_address = data.billing_address[i];
                    if (i === 0) {
                        list_billing_address += `<div class="form-check ml-5 mb-2">
                                <input class="form-check-input" type="radio" name="billingaddressRadio" checked disabled>
                                <label>`+ billing_address + `</label>
                                <a hidden href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                           </div>`;
                    }
                    else {
                        list_billing_address += `<div class="form-check ml-5 mb-2">
                                <input class="form-check-input" type="radio" name="billingaddressRadio" disabled>
                                <label>`+ billing_address + `</label>
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

                function load_contact_mapped(contact_mapped) {
                    if (!$.fn.DataTable.isDataTable('#datatable_contact_mapped_list')) {
                        let dtb = $('#datatable_contact_mapped_list');
                        dtb.DataTableDefault({
                            data: contact_mapped,
                            columns: [
                                {
                                    render: (data, type, row, meta) => {
                                        return ''
                                    }
                                },
                                {
                                    data: 'fullname', render: (data, type, row, meta) => {
                                        return `<a href="/saledata/contact/` + row.id + `"><span><b>` + data + `</b></span></a>`
                                    }
                                },
                                {
                                    data: 'job_title', render: (data, type, row, meta) => {
                                        return `<span class="badge badge-soft-danger badge-pill span-product-type" style="min-width: 100%; width: 100%">` + data + `</span>`
                                    }
                                },
                                {
                                    data: 'mobile', render: (data, type, row, meta) => {
                                        return `<span class="badge badge-soft-blue badge-pill span-product-type" style="min-width: 100%; width: 100%">` + data + `</span>`
                                    }
                                },
                                {
                                    data: 'email', render: (data, type, row, meta) => {
                                        return `<span class="badge badge-soft-green badge-pill span-product-type" style="min-width: 100%; width: 100%">` + data + `</span>`
                                    }
                                },
                            ],
                        });
                    }
                }

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
                    $('.select2-selection').css({'border': 'solid #aaa 1px', 'background': 'none'});
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

                    $('#shipping-city').select2();
                    $('#shipping-district').select2();
                    $('#shipping-ward').select2();

                    $('#select-box-account-name').select2();
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

                loadPaymentTerms(data.payment_term_mapped);

                loadPriceList(data.price_list_mapped);

                loadCountries('country_mapped');

                $('#credit-limit-id').val(data.credit_limit);

                $('#account-type-id').prop('disabled', true);
                $('#account-manager-id').prop('disabled', true);
                $('.select2-selection').css({'border': 'none', 'background': '#f7f7f7'});
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
    function loadPaymentTerms(payment_term_mapped) {
        let ele = $('#payment-terms-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected></option>`)
                    if (data.hasOwnProperty('payment_terms_list') && Array.isArray(data.payment_terms_list)) {
                        data.payment_terms_list.map(function (item) {
                            if (payment_term_mapped === item.id) {
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
                            data.contact_list_not_map_account.push(contacts_mapped[i]);
                        }
                        data.contact_list_not_map_account.map(function (item) {
                            if (item.id === current_account_owner.id) {
                                ele.append(`<option data-mobile="`+ item.mobile +`" data-email="`+ item.email +`" data-job-title="`+ item.job_title +`" value="` + item.id + `" selected>` + item.fullname + `</option>`)
                            } else {
                                ele.append(`<option data-mobile="`+ item.mobile +`" data-email="`+ item.email +`" data-job-title="`+ item.job_title +`" value="` + item.id + `">` + item.fullname + `</option>`)
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
                            }
                            else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    // load data for Shipping address modal
    $('#edit-shipping-address').on('click', function () {
        if ($('#list-shipping-address input').length === 0)
            $('#make-default-shipping-address').prop('checked', true);
    })

    // load data for Billing address modal
    $('#edit-billing-address').on('click', function () {
        let ele = $('#select-box-account-name')
        ele.html('');
        $('#edited-billing-address').val('');
        $('#button_add_new_billing_address').prop('hidden', true);
        $('#select-box-address').prop('hidden', false);
        $('#edited-billing-address').prop('hidden', true);
        $('#button_add_new_billing_address').html(`<i class="fas fa-plus-circle"></i> Add/Edit`)

        let list_emp = []
        $('#account-manager-id').find('option:selected').each(function () {
            list_emp.push($(this).val());
        })

        let list_acc_map_emp = []
        let data_url = $('#account-manager-id').attr('data-url-accounts')
        let data_method = $('#account-manager-id').attr('data-method')
        $.fn.callAjax(data_url, data_method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('accounts_map_employee')) {
                        data.accounts_map_employee.map(function (item) {
                            if (list_emp.includes(item.employee)) {
                                if (!list_acc_map_emp.includes(item.account.id)) {
                                    list_acc_map_emp.push(item.account.id)
                                    ele.append(`<option value="` + item.account.id + `">` + item.account.name + `</option>`)
                                }
                            }
                        })
                    }
                }
            }
        )

        $('#inp-tax-code-address').val($('#account-tax-code-id').val());
        $('#inp-email-address').val($('#account-email-id').val());

        if ($('#list-billing-address input').length === 0)
            $('#make-default-billing-address').prop('checked', true);

        let select_box = $('#select-box-address')
        select_box.empty();
        select_box.append(`<option value="" selected></option>`)
        $('#list-shipping-address').children().each(function () {
            if ($(this).find('input').prop('checked') === true)
                select_box.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
            else
                select_box.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
        });
    })

    // button event change select-box-account-name in modal billing address
    $('#select-box-account-name').on('change', function () {
        $('#edited-billing-address').val('');
        let id_account = $(this).find('option:selected').val();
        let select_box = $('#select-box-address');
        select_box.empty();
        select_box.append(`<option value="" selected></option>`)

        if (id_account === '') {
            $('#button_add_new_billing_address').prop('hidden', true);
            $('#inp-tax-code-address').val($('#inp-tax-code').val());
            $('#inp-email-address').val($('#inp-email').val());

            $('#list-shipping-address').children().each(function () {
                if ($(this).find('input').prop('checked') === true)
                    select_box.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
                else
                    select_box.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
            });
        } else {
            $('#button_add_new_billing_address').prop('hidden', false);
            let url = $(this).attr('data-url').replace(0, id_account);
            let method = $(this).attr('data-method');
            $.fn.callAjax(url, method).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('account_detail')) {
                            $('#inp-email-address').val(data.account_detail.email);
                            $('#inp-tax-code-address').val(data.account_detail.tax_code);
                            data.account_detail.shipping_address.map(function (item) {
                                $('#select-box-address').append(`<option value="` + item + `">` + item + `</option>`)
                            })
                        }
                    }
                }
            )
        }
    })

    // process address
    $('#select-box-address').on('change', function () {
        $('#edited-billing-address').val($(this).find('option:selected').text());
    })

    // click on edit billing address btn
    $('#button_add_new_billing_address').on('click', function () {
        if ($('#button_add_new_billing_address i').attr('class') === 'fas fa-plus-circle') {
            $(this).html(`<i class="bi bi-backspace-fill"></i> Select`);
            $('#select-box-address').prop('hidden', true);
            $('#edited-billing-address').prop('hidden', false);
        } else {
            $(this).html(`<i class="fas fa-plus-circle"></i> Add/Edit`)
            $('#select-box-address').prop('hidden', false);
            $('#edited-billing-address').prop('hidden', true);
        }
    })

    // ratio individual onchange
    $('#inp-individual').on('change', function () {
        $('#parent-account-div-id').prop('hidden', true);
        $("#account-tax-code-label-id").removeClass("required");
    })

    // Account Owner onchange
    $('#account-owner-id').on('change', function () {
        let option_selected = $(this).find('option:selected');
        $('#owner-job-title-id').val(option_selected.attr('data-job-title'));
        $('#owner-email-id').val(option_selected.attr('data-email'));
        $('#owner-mobile-id').val(option_selected.attr('data-mobile'));
    });

    // ratio organization onchange
    $('#inp-organization').on('change', function () {
        $('#parent-account-div-id').prop('hidden', false);
        $("#account-tax-code-label-id").addClass("required");
    })

    // add default item bank first
    $('#edit-bank-account-information').on('click', function () {
        if ($('#list-bank-account-information input').length === 0) {
            $('#make-default-bank-account').prop('checked', true);
            $('#make-default-bank-account').prop('disabled', true);
        }
        else {
            $('#make-default-bank-account').prop('checked', false);
            $('#make-default-bank-account').prop('disabled', false);
        }
    })

    // add default item credit card first
    $('#edit-credit-card-information').on('click', function () {
        if ($('#list-credit-card-information input').length === 0) {
            $('#make-default-credit-card').prop('checked', true);
            $('#make-default-credit-card').prop('disabled', true);
        }
        else {
            $('#make-default-credit-card').prop('checked', false);
            $('#make-default-credit-card').prop('disabled', false);
        }
    })

    // add new bank account
    $('#save-changes-modal-bank-account').on('click', function () {
        let country_id = $('#country-select-box-id').val();
        let bank_name = $('#bank-name-id').val();
        let bank_code = $('#bank-code-id').val();
        let bank_account_name = $('#bank-account-name-id').val();
        let bank_account_number = $('#bank-account-number-id').val();
        let bic_swift_code = $('#bic-swift-code-id').val();

        if (country_id !== '' && bank_name !== '' && bank_code !== '' && bank_account_name !== '' && bank_account_number !== '') {
            let is_default = '';
            if ($('#make-default-bank-account').is(':checked')) {
                is_default = 'checked';
            }
            $('#list-bank-account-information').append(`<div class="card card-bank-account col-8 ml-3">
                                            <span class="mt-2">
                                                <div class="row">
                                                    <div class="col-6">
                                                        <a class="btn-del-bank-account" href="#"><i class="bi bi-x"></i></a>
                                                    </div>
                                                    <div class="col-6 text-right">
                                                        <input class="form-check-input ratio-select-bank-account-default" type="radio" name="bank-account-select-default"` + is_default + `>
                                                    </div>
                                                </div>
                                            </span>
                                            <label class="ml-3">Bank account name: <a class="bank-account-name-label" href="#"><b>` + bank_account_name + `</b></a></label>
                                            <label class="ml-3">Bank name: <a class="bank-name-label" href="#"><b>` + bank_name + `</b></a></label>
                                            <label class="ml-3 mb-3">Bank account number: <a class="bank-account-number-label" href="#"><b>` + bank_account_number + `</b></a></label>
                                            <label hidden class="ml-3">Country ID: <a class="country-id-label" href="#"><b>` + country_id + `</b></a></label>
                                            <label hidden class="ml-3">Bank code: <a class="bank-code-label" href="#"><b>` + bank_code + `</b></a></label>
                                            <label hidden class="ml-3">BIC/SWIFT Code: <a class="bic-swift-code-label" href="#"><b>` + bic_swift_code + `</b></a></label>
                                        </div>`)
            $('#modal-bank-account-information').hide();

            // delete bank account item
            $('.btn-del-bank-account').on('click', function () {
            $(this).closest('.card').remove()
        })
        }
        else {
            $.fn.notifyPopup({description: "Missing value Banking Account."}, 'failure');
        }
    })

    // add new credit card
    $('#save-changes-modal-credit-card').on('click', function () {
        let credit_card_type = $('#credit-card-type-select-box-id').val();
        let credit_card_number = $('#credit-card-number-id').val();
        let credit_card_exp_date = $('#credit-card-exp-date').val();
        let credit_card_name = $('#credit-card-name-id').val();

        if (credit_card_type !== '' && credit_card_number !== '' && credit_card_exp_date !== '' && credit_card_name !== '') {
            let is_default = '';
            if ($('#make-default-credit-card').is(':checked')) {
                is_default = 'checked';
            }
            $('#list-credit-card-information').append(`<div class="card card-credit-card col-8 ml-3">
                                            <span class="mt-2">
                                                <div class="row">
                                                    <div class="col-6">
                                                        <a class="btn-del-credit-card" href="#"><i class="bi bi-x"></i></a>
                                                    </div>
                                                    <div class="col-6 text-right">
                                                        <input class="form-check-input credit-card-select-default" type="radio" name="credit-card-select-default"` + is_default + `>
                                                    </div>
                                                </div>
                                            </span>
                                            <label class="ml-3">Card Type: <a class="credit_card_type" href="#"><b>` + credit_card_type + `</b></a></label>
                                            <label class="ml-3">Card Number: <a class="credit_card_number" href="#"><b>` + credit_card_number + `</b></a></label>
                                            <label class="ml-3">Card Exp: <a class="expired_date" href="#"><b>` + credit_card_exp_date + `</b></a></label>
                                            <label class="ml-3 mb-3">Card Name: <a class="credit_card_name" href="#"><b>` + credit_card_name + `</b></a></label>
                                        </div>`)
            $('#modal-credit-card-information').hide();
            // delete credit card item
            $('.btn-del-credit-card').on('click', function () {
                $(this).closest('.card').remove()
            })
        }
        else {
            $.fn.notifyPopup({description: "Missing value Credit Card."}, 'failure');
        }
    })

    /* Single table*/
    $("#credit-card-exp-date").datepicker( {
        format: "mm/yyyy",
        startView: "months",
        minViewMode: "months",
    });

    // send data to update
    let frm = $('#form-detail-update-account')
    frm.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        if ($('#account-type-id').val().length > 0) {
            frm.dataForm['account_type'] = $('#account-type-id').val();
        }

        if ($('#inp-organization').is(':checked')) {
            frm.dataForm['account_type_selection'] = 1;
        } else {
            frm.dataForm['account_type_selection'] = 0;
        }

        if ($('#account-manager-id').val().length > 0) {
            frm.dataForm['manager'] = $('#account-manager-id').val();
        }

        let shipping_address_list = [];
        $('#list-shipping-address input[type=radio]').each(function () {
            if ($(this).is(':checked')) {
                shipping_address_list.unshift($(this).next('label').text().trim());
            }
            else {
                shipping_address_list.push($(this).next('label').text().trim());
            }
        });

        let billing_address_list = [];
        $('#list-billing-address input[type=radio]').each(function () {
            if ($(this).is(':checked')) {
                billing_address_list.unshift($(this).next('label').text().trim());
            }
            else {
                billing_address_list.push($(this).next('label').text().trim());
            }
        });

        if (frm.dataForm['parent_account'] === '') {
            frm.dataForm['parent_account'] = null;
        }

        if (frm.dataForm['credit_limit'] === '') {
            frm.dataForm['credit_limit'] = null;
        }

        if ($('#account-owner-id').val() === '') {
            frm.dataForm['account-owner'] = null;
        }

        if ($('#account-revenue-id').val() === '0') {
            frm.dataForm['annual_revenue'] = null;
        }

        if ($('#total-employees-id').val() === '0') {
            frm.dataForm['total_employees'] = null;
        }

        let bank_account_information = [];
        let list_bank = $('#list-bank-account-information').children();
        for (let i = 0; i < list_bank.length; i++) {
            let country_id = $(list_bank[i]).find('a.country-id-label').text();
            let bank_name = $(list_bank[i]).find('a.bank-name-label').text();
            let bank_code = $(list_bank[i]).find('a.bank-code-label').text();
            let bank_account_name = $(list_bank[i]).find('a.bank-account-name-label').text();
            let bank_account_number = $(list_bank[i]).find('a.bank-account-number-label').text();
            let bic_swift_code = $(list_bank[i]).find('a.bic-swift-code-label').text();
            let is_default = $(list_bank[i]).find('input[type=radio]').is(':checked');

            bank_account_information.push({
                'country_id': country_id,
                'bank_name': bank_name,
                'bank_code': bank_code,
                'bank_account_name': bank_account_name,
                'bank_account_number': bank_account_number,
                'bic_swift_code': bic_swift_code,
                'is_default': is_default
            })
        }
        frm.dataForm['bank_accounts_information'] = bank_account_information;

        let credit_cards_information = [];
        let list_card = $('#list-credit-card-information').children();
        for (let i = 0; i < list_card.length; i++) {
            let credit_card_type = $(list_card[i]).find('a.credit_card_type').text();
            let credit_card_number = $(list_card[i]).find('a.credit_card_number').text();
            let credit_card_name = $(list_card[i]).find('a.credit_card_name').text();
            let expired_date = $(list_card[i]).find('a.expired_date').text();
            let is_default = $(list_card[i]).find('input[type=radio]').is(':checked');

            credit_cards_information.push({
                'credit_card_type': credit_card_type,
                'credit_card_number': credit_card_number,
                'credit_card_name': credit_card_name,
                'expired_date': expired_date,
                'is_default': is_default
            })
        }
        frm.dataForm['credit_cards_information'] = credit_cards_information;

        frm.dataForm['shipping_address'] = shipping_address_list;
        frm.dataForm['billing_address'] = billing_address_list;
        frm.dataForm['shipping_address_id_dict'] = shipping_address_id_dict;
        frm.dataForm['billing_address_id_dict'] = billing_address_id_dict;

        // console.log(frm.dataForm)

        $.fn.callAjax(frm.dataUrl.replace(0, window.location.pathname.split('/').pop()), frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Updating account"}, 'success')
                        setTimeout(function () {
                            location.reload()
                        }, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    });
})
