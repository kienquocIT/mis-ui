let accountName = $('#inp-account-name')
let accountCode = $('#inp-account-code')
let accountWebsite = $('#inp-account-website')
let accountTaxCode = $('#inp-tax-code')
let inputPhone = $('#inp-phone')
let inputEmail = $('#inp-email')
let accountTypeEle = $('#select-box-acc-type')
let accountManagerEle = $('#select-box-acc-manager')
let accountOwnerEle = $('#select-box-contact')
let industryEle = $('#select-box-industry')
let accountGroupEle = $('#select-box-account-group')
let totalEmployeeEle = $('#select-box-total-emp')
let annualRevenueEle = $('#select-box-annual-revenue')
let parentAccountEle = $('#select-box-parent-account')
let shippingCityEle = $('#shipping-city')
let shippingDistrictEle = $('#shipping-district')
let shippingWardEle = $('#shipping-ward')
let contactOwnerEle = $('#select-box-contact-owner')
let inputOrganizationEle = $('#inp-organization')
let inputIndividualEle = $('#inp-individual')
let billingAddressEle = $('#select-box-address')
let add_shipping_address_btn = $('#add-shipping-address-btn')
let add_billing_address_btn = $('#add-billing-address-btn')
let add_contact_btn = $('#add-contact-btn')
let add_contact_btn_detail = $('#add-contact-btn-detail')
let save_shipping_address = $('#save-changes-modal-shipping-address')
let save_billing_address = $('#save-changes-modal-billing-address')
let custom_billing_address = $('#custom_billing_address')
let new_contact_shortcut = $('#new_contact_shortcut')
let shipping_address_id_dict = [];
let billing_address_id_dict = [];
let data_contact_mapped = [];

function loadAccountType(accountTypeData) {
    accountTypeEle.initSelect2({
        ajax: {
            url: accountTypeEle.attr('data-url'),
            method: 'GET',
        },
        data: (accountTypeData ? accountTypeData : null),
        keyResp: 'account_type_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadAccountManager(accountManagerData) {
    accountManagerEle.initSelect2({
        ajax: {
            url: accountManagerEle.attr('data-url'),
            method: 'GET',
        },
        data: (accountManagerData ? accountManagerData : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    })
}

function loadIndustry(industryData) {
    industryEle.initSelect2({
        ajax: {
            url: industryEle.attr('data-url'),
            method: 'GET',
        },
        data: (industryData ? industryData : null),
        keyResp: 'industry_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadAccountOwner(accountOwnerData, contact_mapped) {
    accountOwnerEle.initSelect2({
        ajax: {
            url: accountOwnerEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp){
            return resp.data[keyResp].concat(contact_mapped);
        },
        data: (accountOwnerData ? accountOwnerData : null),
        keyResp: 'contact_list_not_map_account',
        keyId: 'id',
        keyText: 'fullname',
    }).on('change', function () {
        let owner_selected = accountOwnerEle.val();
        if (owner_selected !== null) {
            let obj_owner = JSON.parse($('#' + accountOwnerEle.attr('data-idx-data-loaded')).text())[owner_selected];
            $('#job_title').val(obj_owner.job_title).css({color: 'black'});
            $('#owner-email').val(obj_owner.email).css({color: 'black'});
            $('#owner-mobile').val(obj_owner.mobile).css({color: 'black'});
            let data = {
                'id': obj_owner.id,
                'job_title': obj_owner.job_title,
                'fullname': obj_owner.fullname,
                'mobile': obj_owner.mobile,
                'email': obj_owner.email,
                'owner': true
            }
            data_contact_mapped = [data];

            let reselect_owner = true;
            document.querySelectorAll('.selected_contact_full_name').forEach(function (element) {
                if (element.getAttribute('data-id') === obj_owner.id) {
                    let icon = document.getElementById('datatable_contact_list').getElementsByTagName('i');
                    icon[0].parentNode.removeChild(icon[0]);
                    let new_icon = document.createElement('i');
                    new_icon.className = 'bi bi-check2-square text-primary';
                    element.closest('tr').querySelector('td:first-child').appendChild(new_icon);
                    reselect_owner = false;
                }
            })

            if (reselect_owner === true) {
                loadTableSelectedContact([data]);
            }
        }
    });
}

function loadAccountGroup(accountGroupData) {
    accountGroupEle.initSelect2({
        ajax: {
            url: accountGroupEle.attr('data-url'),
            method: 'GET',
        },
        data: (accountGroupData ? accountGroupData : null),
        keyResp: 'account_group_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadParentAccount(parentAccountData) {
    parentAccountEle.initSelect2({
        ajax: {
            url: parentAccountEle.attr('data-url'),
            method: 'GET',
        },
        data: (parentAccountData ? parentAccountData : null),
        keyResp: 'account_list',
        keyId: 'id',
        keyText: 'name',
    })
}

function loadShippingCities(cityData) {
    shippingCityEle.initSelect2({
        data: (cityData ? cityData : null),
        keyResp: 'cities',
    }).on('change', function () {
        let dataParams = JSON.stringify({'city_id': $(this).val()});
        shippingDistrictEle.attr('data-params', dataParams).val("");
        shippingWardEle.attr('data-params', '{}').val("");
    });
}

function loadShippingDistrict(disData) {
    shippingDistrictEle.initSelect2({
        data: (disData ? disData : null),
        keyResp: 'districts',
    }).on('change', function () {
        let dataParams = JSON.stringify({'district_id': $(this).val()});
        shippingWardEle.attr('data-params', dataParams).val("");
    });
}

function loadShippingWard(wardData) {
    shippingWardEle.initSelect2({
        data: (wardData ? wardData : null),
        keyResp: 'wards',
    });
}

function loadContactOwner(contactOwnerData) {
    contactOwnerEle.initSelect2({
        ajax: {
            url: contactOwnerEle.attr('data-url'),
            method: 'GET',
        },
        data: (contactOwnerData ? contactOwnerData : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    })
}

function loadTableSelectContact() {
    let account_owner_id = accountOwnerEle.val();
    let selected_contact_list = [];
    document.querySelectorAll('.selected_contact_full_name').forEach(function (element) {
        selected_contact_list.push(element.getAttribute('data-id'));
    })
    let tbl = $('#datatable-add-contact');
    tbl.DataTable().destroy();
    tbl.DataTableDefault({
        scrollY: true,
        paging: false,
        useDataServer: true,
        rowIdx: true,
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.data['contact_list_not_map_account']) {
                        let data_raw = resp.data['contact_list_not_map_account'];
                        let data_filter = [];
                        for (let i = 0; i < data_raw.length; i++) {
                            if (account_owner_id !== data_raw[i].id) {
                                data_filter.push(data_raw[i]);
                            }
                        }
                        return data_filter;
                    } else {
                        return [];
                    }
                }
                return [];
            }
        },
        columns: [
            {
                className: 'w-5',
                render: () => {
                    return ``;
                }
            },
            {
                data: 'fullname',
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span class="text-primary"><b>${row.fullname}</b></span>`
                }
            },
            {
                data: 'job_title',
                className: 'text-center w-15',
                render: (data, type, row) => {
                    return `<span class="text-secondary">${row.job_title}</span>`
                }
            },
            {
                data: 'owner',
                className: 'w-20',
                render: (data, type, row) => {
                    if (Object.keys(row.owner).length !== 0) {
                        return `<span class="text-secondary">${row.owner.fullname}</span>`
                    }
                    return ``
                }
            },
            {
                data: 'mobile',
                className: 'text-center w-15',
                render: (data, type, row) => {
                    if (row.mobile !== null) {
                        return `<span class="text-secondary">${row.mobile}</span>`
                    }
                    return ``
                }
            },
            {
                data: 'email',
                className: 'text-center w-15',
                render: (data, type, row) => {
                    if (row.email !== null) {
                        return `<span class="text-secondary">${row.email}</span>`
                    }
                    return ``
                }
            },
            {
                data: '',
                className: 'text-center w-5',
                render: (data, type, row) => {
                    if (selected_contact_list.includes(row.id)) {
                        return `<span class="form-check">
                            <input type="checkbox" class="form-check-input selected_contact"
                            data-id="${row.id}" checked
                            data-fullname="${row.fullname}"
                            data-mobile="${row.mobile}"
                            data-email="${row.email}"
                            data-job-title="${row.job_title}">
                            <label class="form-check-label"></label>
                        </span>`
                    }
                    else {
                        return `<span class="form-check">
                            <input type="checkbox" class="form-check-input selected_contact"
                            data-id="${row.id}"
                            data-fullname="${row.fullname}"
                            data-mobile="${row.mobile}"
                            data-email="${row.email}"
                            data-job-title="${row.job_title}">
                            <label class="form-check-label"></label>
                        </span>`
                    }
                }
            },
        ],
    })
}

function loadTableSelectContactDetail(contact_mapped) {
    let account_owner_id = accountOwnerEle.val();
    let selected_contact_list = [];
    document.querySelectorAll('.selected_contact_full_name').forEach(function (element) {
        selected_contact_list.push(element.getAttribute('data-id'));
    })
    let tbl = $('#datatable-add-contact');
    tbl.DataTable().destroy();
    tbl.DataTableDefault({
        scrollY: true,
        paging: false,
        useDataServer: true,
        rowIdx: true,
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.data['contact_list_not_map_account']) {
                        let data_raw = resp.data['contact_list_not_map_account'];
                        if (contact_mapped !== undefined) {
                            data_raw = data_raw.concat(contact_mapped)
                        }
                        let data_filter = [];
                        for (let i = 0; i < data_raw.length; i++) {
                            if (account_owner_id !== data_raw[i].id) {
                                data_filter.push(data_raw[i]);
                            }
                        }
                        return data_filter;
                    } else {
                        return [];
                    }
                }
                return [];
            }
        },
        columns: [
            {
                className: 'w-5',
                render: () => {
                    return ``;
                }
            },
            {
                data: 'fullname',
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span class="text-primary"><b>${row.fullname}</b></span>`
                }
            },
            {
                data: 'job_title',
                className: 'text-center w-15',
                render: (data, type, row) => {
                    return `<span class="text-secondary">${row.job_title}</span>`
                }
            },
            {
                data: 'owner',
                className: 'w-20',
                render: (data, type, row) => {
                    if (Object.keys(row.owner).length !== 0) {
                        return `<span class="text-secondary">${row.owner.fullname}</span>`
                    }
                    return ``
                }
            },
            {
                data: 'mobile',
                className: 'text-center w-15',
                render: (data, type, row) => {
                    if (row.mobile !== null) {
                        return `<span class="text-secondary">${row.mobile}</span>`
                    }
                    return ``
                }
            },
            {
                data: 'email',
                className: 'text-center w-15',
                render: (data, type, row) => {
                    if (row.email !== null) {
                        return `<span class="text-secondary">${row.email}</span>`
                    }
                    return ``
                }
            },
            {
                data: '',
                className: 'text-center w-5',
                render: (data, type, row) => {
                    if (selected_contact_list.includes(row.id)) {
                        return `<span class="form-check">
                            <input type="checkbox" class="form-check-input selected_contact"
                            data-id="${row.id}" checked
                            data-fullname="${row.fullname}"
                            data-mobile="${row.mobile}"
                            data-email="${row.email}"
                            data-job-title="${row.job_title}">
                            <label class="form-check-label"></label>
                        </span>`
                    }
                    else {
                        return `<span class="form-check">
                            <input type="checkbox" class="form-check-input selected_contact"
                            data-id="${row.id}"
                            data-fullname="${row.fullname}"
                            data-mobile="${row.mobile}"
                            data-email="${row.email}"
                            data-job-title="${row.job_title}">
                            <label class="form-check-label"></label>
                        </span>`
                    }
                }
            },
        ],
    })
}

function loadTableSelectedContact(data) {
    let tbl = $('#datatable_contact_list');
    tbl.DataTable().destroy();
    tbl.DataTableDefault({
        dom: '',
        paging: false,
        data: data,
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    if (row.owner === true) {
                        return `<span class="text-primary"><i class="bi bi-check2-square"></i></span>`
                    }
                    return ``;
                }
            },
            {
                data: 'fullname',
                className: 'w-30',
                render: (data, type, row) => {
                    return `<span class="text-secondary selected_contact_full_name" data-id="${row.id}"><b>${row.fullname}</b></span>`
                }
            },
            {
                data: 'job_title',
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span class="text-secondary">${row.job_title}</span>`
                }
            },
            {
                data: 'mobile',
                className: 'w-25',
                render: (data, type, row) => {
                    if (row.mobile !== null && row.mobile !== 'null') {
                        return `<span class="text-secondary">${row.mobile}</span>`
                    }
                    return ``
                }
            },
            {
                data: 'email',
                className: 'w-20',
                render: (data, type, row) => {
                    if (row.email !== null && row.email !== 'null') {
                        return `<span class="text-secondary">${row.email}</span>`
                    }
                    return ``
                }
            },
        ],
    })
}

function checkSelectAll() {
    document.getElementById('check-select-all').checked = document.querySelectorAll('.selected_contact:checked').length === document.querySelectorAll('.selected_contact').length;
}

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
        $('.select2').prop('disabled', true);
        $('input').prop('disabled', true);
        $('.del-address-item').prop('hidden', true);
        add_shipping_address_btn.addClass('disabled');
        add_shipping_address_btn.prop('hidden', true);
        add_billing_address_btn.addClass('disabled');
        add_billing_address_btn.prop('hidden', true);
        add_contact_btn.addClass('disabled');
        add_contact_btn.prop('hidden', true);
    }
}

function LoadDetail(option) {
    new AccountHandle().load();
    // load data detail
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-update-account').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['account_detail']?.['workflow_runtime_id']);
                data = data['account_detail'];
                console.log(data)

                $.fn.compareStatusShowPageAction(data);

                accountName.val(data.name);
                accountCode.val(data.code);
                accountWebsite.val(data.website);
                inputPhone.val(data.phone);
                inputEmail.val(data.email);
                accountTaxCode.val(data.tax_code);

                if (data.account_type_selection === 0) {
                    inputIndividualEle.prop('checked', true);
                    $('#parent-account-div-id').prop('hidden', true);
                    $('#account-tax-code-label-id').removeClass('required');
                    $('#total_employees_label').removeClass('required');
                } else if (data.account_type_selection === 1) {
                    inputOrganizationEle.prop('checked', true);
                    $('#parent-account-div-id').prop('hidden', false);
                    $('#account-tax-code-label-id').addClass('required');
                    $('#total_employees_label').addClass('required');
                }

                let list_shipping_address = ``;
                for (let i = 0; i < data.shipping_address.length; i++) {
                    let shipping_address = data.shipping_address[i];
                    if (shipping_address.is_default) {
                        list_shipping_address += `<div class="form-check ml-5 mb-2">
                                    <input class="form-check-input" type="radio" name="shippingaddressRadio" checked>
                                    <span><label>` + shipping_address.full_address + `</label></span>
                                    &nbsp;<span><a href="#" class="text-danger del-address-item"><i class="bi bi-trash"></i></a></span>
                               </div>`;
                    } else {
                        list_shipping_address += `<div class="form-check ml-5 mb-2">
                                    <input class="form-check-input" type="radio" name="shippingaddressRadio">
                                    <span><label>` + shipping_address.full_address + `</label></span>
                                    &nbsp;<span><a href="#" class="text-danger del-address-item"><i class="bi bi-trash"></i></a></span>
                               </div>`;
                    }
                }
                $('#list-shipping-address').html(list_shipping_address);

                let list_billing_address = ``
                for (let i = 0; i < data.billing_address.length; i++) {
                    let billing_address = data.billing_address[i];
                    if (billing_address.is_default) {
                        list_billing_address += `<div class="form-check ml-5 mb-2">
                                    <input class="form-check-input" type="radio" name="billingaddressRadio" checked>
                                    <span><label>` + billing_address.full_address + `</label></span>
                                    &nbsp;<span><a href="#" class="text-danger del-address-item"><i class="bi bi-trash"></i></a></span>
                               </div>`;
                    } else {
                        list_billing_address += `<div class="form-check ml-5 mb-2">
                                    <input class="form-check-input" type="radio" name="billingaddressRadio">
                                    <span><label>` + billing_address.full_address + `</label></span>
                                    &nbsp;<span><a href="#" class="text-danger del-address-item"><i class="bi bi-trash"></i></a></span>
                               </div>`;
                    }
                }
                $('#list-billing-address').html(list_billing_address)

                let list_bank_accounts_html = ``
                let bank_accounts_information = data?.['bank_accounts_information'];
                for (let i = 0; i < data?.['bank_accounts_information'].length; i++) {
                    let country_id = bank_accounts_information[i].country_id;
                    let bank_name = bank_accounts_information[i].bank_name;
                    let bank_code = bank_accounts_information[i].bank_code;
                    let bank_account_name = bank_accounts_information[i].bank_account_name;
                    let bank_account_number = bank_accounts_information[i].bank_account_number;
                    let bic_swift_code = bank_accounts_information[i].bic_swift_code;
                    let is_default = '';
                    if (bank_accounts_information[i].is_default) {
                        is_default = 'checked';
                    }
                    list_bank_accounts_html += `<div class="card card-bank-account col-8 ml-3">
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
                                    </div>`
                }
                $('#list-bank-account-information').html(list_bank_accounts_html);

                let list_credit_cards_html = ``
                let credit_cards_information = data?.['credit_cards_information']
                for (let i = 0; i < credit_cards_information.length; i++) {
                    let credit_card_type = credit_cards_information[i]?.['credit_card_type'];
                    let credit_card_number = credit_cards_information[i]?.['credit_card_number'];
                    let credit_card_name = credit_cards_information[i]?.['credit_card_name'];
                    let credit_card_exp_date = credit_cards_information[i]?.['expired_date'];
                    let is_default = '';
                    if (credit_cards_information[i].is_default) {
                        is_default = 'checked';
                    }
                    list_credit_cards_html += `<div class="card card-credit-card col-8 ml-3">
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

                // delete address item
                $('.del-address-item').on('click', function () {
                    $(this).closest('.form-check').remove();
                })

                totalEmployeeEle.val(data.total_employees)
                annualRevenueEle.val(data.annual_revenue)

                loadAccountType(data.account_type)

                for (let i = 0; i < data.account_type.length; i++) {
                    if (data.account_type[i].title === 'Customer')
                    {
                        $('#role-for-customer').prop('hidden', false);
                    }
                    if (data.account_type[i].title === 'Supplier')
                    {
                        $('#role-for-supplier').prop('hidden', false);
                    }
                }

                loadAccountGroup(data.account_group)

                loadIndustry(data.industry)

                loadAccountOwner(data.owner, data.contact_mapped)
                $('#job_title').val(data.owner.job_title).css({color: 'black'});
                $('#owner-email').val(data.owner.email).css({color: 'black'});
                $('#owner-mobile').val(data.owner.mobile).css({color: 'black'});

                loadAccountManager(data.manager)

                loadParentAccount(data.parent_account)

                loadTableSelectedContact(data.contact_mapped);

                add_contact_btn_detail.on('click', function () {
                    loadTableSelectContactDetail(data.contact_mapped);
                })

                // For Detail
                loadCurrency(data.currency)
                loadPaymentTermForCustomer(data?.['payment_term_customer_mapped'])
                loadPaymentTermForSupplier(data?.['payment_term_supplier_mapped'])
                loadPriceListForCustomer(data?.['price_list_mapped'])
                $('#credit-limit-id-customer').attr('value', data?.['credit_limit_customer']);
                $('#credit-limit-id-supplier').attr('value', data?.['credit_limit_supplier']);
                loadCountries();

                $.fn.initMaskMoney2();

                Disable(option);
            }
        })
}

save_shipping_address.on('click', function () {
    let shipping_address_modal = $('#detail-modal-shipping-address');
    let shipping_city = shippingCityEle;
    let shipping_district = shippingDistrictEle;
    let shipping_ward = shippingWardEle;
    let make_default_shipping_address = $('#make-default-shipping-address');
    try {
        let detail_shipping_address = shipping_address_modal.val();
        let city = shipping_city.find(`option:selected`).text();
        let district = shipping_district.find(`option:selected`).text();
        let ward = shipping_district.find(`option:selected`).text();

        let selectedVal = shipping_city.val();
        let dataBackup = SelectDDControl.get_data_from_idx(shipping_city, selectedVal);
        let country_id = dataBackup?.['country_id'] || null;
        let city_id = shipping_city.find(`option:selected`).attr('value');
        let district_id = shipping_district.find(`option:selected`).attr('value');
        let ward_id = shipping_ward.find(`option:selected`).attr('value');

        let shipping_address = '';
        if (city !== '' && district !== '' && detail_shipping_address !== '') {

            if (ward === '') {
                shipping_address = detail_shipping_address + ', ' + district + ', ' + city;
            } else {
                shipping_address = detail_shipping_address + ', ' + ward + ', ' + district + ', ' + city;
            }

            $('#modal-shipping-address').modal('hide');
            shipping_address_modal.val('');
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }

        if (shipping_address !== '') {
            let is_default = '';
            if (make_default_shipping_address.prop('checked') === true) {
                is_default = 'checked';
            }

            $('#list-shipping-address').append(
                `<div class="form-check ml-5 mb-2">
                    <input class="form-check-input" type="radio" name="shippingaddressRadio" ` + is_default +`>
                    <span><label>` + shipping_address + `</label></span>
                    &nbsp;<span><a href="#" class="text-danger del-address-item"><i class="bi bi-trash"></i></a></span>
                </div>`
            )

            // delete address item
            $('.del-address-item').on('click', function () {
                $(this).closest('.form-check').remove();
            })

            shipping_address_id_dict.push({
                'country_id': country_id,
                'detail_address': detail_shipping_address,
                'city_id': city_id,
                'district_id': district_id,
                'ward_id': ward_id,
                'full_address': shipping_address,
                'is_default': make_default_shipping_address.prop('checked')
            })
        }
    } catch (error) {
        $.fn.notifyB({description: "No address information!"}, 'failure');
    }
})

save_billing_address.on('click', function () {
    let make_default_billing_address = $('#make-default-billing-address');
    try {
        let acc_name = $('#input-account-name').val();
        let email_address = $('#inp-email-address').val();
        let tax_code = $('#inp-tax-code-address').val();

        let account_address = billingAddressEle.find('option:selected').val();
        if (billingAddressEle.is(':hidden')) {
            account_address = $('#edited-billing-address').val()
        }

        let billing_address = '';
        if (email_address !== '' && tax_code !== '' && account_address !== '0') {
            billing_address = acc_name + ', ' + account_address + ' (email: ' + email_address + ', tax code: ' + tax_code + ')';
            $('#modal-billing-address').modal('hide');
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }

        if (billing_address !== '') {
            let is_default = '';
            if (make_default_billing_address.prop('checked') === true) {
                is_default = 'checked';
            }

            $('#list-billing-address').append(
                `<div class="form-check ml-5">
                    <input class="form-check-input" type="radio" name="billingaddressRadio" ` + is_default + `>
                    <span><label>` + billing_address + `</label></span>
                    &nbsp;<span><a href="#" class="text-danger del-address-item"><i class="bi bi-trash"></i></a></span>
                </div>`
            )

            // delete address item
            $('.del-address-item').on('click', function () {
                $(this).closest('.form-check').remove();
            })

            billing_address_id_dict.push({
                'account_name': acc_name,
                'email': email_address,
                'tax_code': tax_code,
                'account_address': account_address,
                'full_address': billing_address,
                'is_default': make_default_billing_address.prop('checked'),
            })
        }
    } catch (error) {
        $.fn.notifyB({description: "No address information!"}, 'failure');
    }
})

inputIndividualEle.on('change', function () {
    parentAccountEle.prop('selectedIndex', -1).attr('disabled', true);
    $("#tax-code-label").removeClass("required");
    $("#total_employees_label").removeClass("required");
})

inputOrganizationEle.on('change', function () {
    parentAccountEle.attr('disabled', false);
    $("#tax-code-label").addClass("required");
    $("#total_employees_label").addClass("required");
})

add_shipping_address_btn.on('click', function () {
    if ($('#list-shipping-address input').length === 0)
        $('#make-default-shipping-address').prop('checked', true);
})

add_billing_address_btn.on('click', function () {
    let ele = $('#select-box-account-name')
    ele.html('');
    $('#edited-billing-address').val('').prop('hidden', true);
    billingAddressEle.prop('hidden', false);
    custom_billing_address.html(`<i class="fas fa-plus-circle"></i> Add/Edit`)

    $('#input-account-name').val(accountName.val());
    $('#inp-tax-code-address').val(accountTaxCode.val());
    $('#inp-email-address').val(inputEmail.val());
    ele.prepend(`<option value="">` + accountName.val() + `</option>`)

    if ($('#list-billing-address input').length === 0)
        $('#make-default-billing-address').prop('checked', true);

    billingAddressEle.empty();
    billingAddressEle.append(`<option value="0" selected></option>`)
    $('#list-shipping-address').children().each(function () {
        if ($(this).find('input').prop('checked') === true)
            billingAddressEle.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
        else
            billingAddressEle.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
    });
})

billingAddressEle.on('change', function () {
    $('#edited-billing-address').val($(this).find('option:selected').text());
})

custom_billing_address.on('click', function () {
    if ($('#custom_billing_address i').attr('class') === 'fas fa-plus-circle') {
        $(this).html(`<i class="bi bi-backspace-fill"></i> Select`);
        billingAddressEle.prop('hidden', true).prop('disabled', true);
        $('#edited-billing-address').prop('hidden', false);
    } else {
        $(this).html(`<i class="fas fa-plus-circle"></i> Add/Edit`)
        billingAddressEle.prop('hidden', false).prop('disabled', false);
        $('#edited-billing-address').prop('hidden', true);
    }
})

new_contact_shortcut.on('click', function () {
    let ele = contactOwnerEle;
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $('#modal-add-new-contact input').val('');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                ele.text("");
                if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                    ele.append(`<option selected></option>`)
                    data.employee_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                    })
                }
            }
        }
    )
})

add_contact_btn.on('click', function () {
    loadTableSelectContact();
})

$(document).on('click', '#btn-add-contact', function () {
    let selected_contact = [];
    let owner_selected = accountOwnerEle.val();
    if (owner_selected !== null) {
        let obj_owner = JSON.parse($('#' + accountOwnerEle.attr('data-idx-data-loaded')).text())[owner_selected];
        let data = {
            'id': obj_owner.id,
            'job_title': obj_owner.job_title,
            'fullname': obj_owner.fullname,
            'mobile': obj_owner.mobile,
            'email': obj_owner.email,
            'owner': true
        }
        selected_contact.push(data)
    }

    document.querySelectorAll('.selected_contact').forEach(function (element) {
        if (element.checked) {
            selected_contact.push({
                'id': element.getAttribute('data-id'),
                'job_title': element.getAttribute('data-job-title'),
                'fullname': element.getAttribute('data-fullname'),
                'mobile': element.getAttribute('data-mobile'),
                'email': element.getAttribute('data-email'),
                'owner': false
            })
        }
    })
    data_contact_mapped = selected_contact;
    loadTableSelectedContact(selected_contact);
    checkSelectAll();
});

$(document).on('click', '.selected_contact', function () {
    checkSelectAll();
});

$(document).on('click', '#check-select-all', function () {
    if ($(this).is(':checked')) {
        document.querySelectorAll('.selected_contact').forEach(function (element) {
            element.checked = true;
        })
    }
    else {
        document.querySelectorAll('.selected_contact').forEach(function (element) {
            element.checked = false;
        })
    }
});

class AccountHandle {
    load() {
        loadAccountType();
        loadAccountManager();
        loadAccountOwner();
        loadIndustry();
        loadAccountGroup();
        loadParentAccount();
        loadShippingCities();
        loadShippingDistrict();
        loadShippingWard();
        loadContactOwner();
    }
    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        if (accountName.val()) {
            frm.dataForm['name'] = accountName.val();
        }
        else {
            $.fn.notifyB({description: 'Account name is required.'}, 'failure');
            return false;
        }
        if (accountCode.val()) {
            frm.dataForm['code'] = accountCode.val();
        }
        else {
            $.fn.notifyB({description: 'Account code is required.'}, 'failure');
            return false;
        }
        frm.dataForm['website'] = accountWebsite.val();
        if (accountTypeEle.val().length > 0) {
            frm.dataForm['account_type'] = accountTypeEle.val();
        }
        else {
            $.fn.notifyB({description: 'Account type is required.'}, 'failure');
            return false;
        }
        if (inputOrganizationEle.is(':checked')) {
            frm.dataForm['account_type_selection'] = 1;
        }
        else {
            frm.dataForm['account_type_selection'] = 0;
        }
        if (accountGroupEle.val()) {
            frm.dataForm['account_group'] = accountGroupEle.val();
        }
        else {
            $.fn.notifyB({description: 'Account group is required.'}, 'failure');
            return false;
        }
        if (accountOwnerEle.val()) {
            frm.dataForm['owner'] = accountOwnerEle.val();
        }
        if (accountManagerEle.val().length > 0) {
            frm.dataForm['manager'] = accountManagerEle.val();
        }
        else {
            $.fn.notifyB({description: 'Account manager is required.'}, 'failure');
            return false;
        }
        if (parentAccountEle.val()) {
            frm.dataForm['parent_account'] = parentAccountEle.val();
        }
        if (annualRevenueEle.val()) {
            frm.dataForm['annual_revenue'] = annualRevenueEle.val();
        }
        if (totalEmployeeEle.val()) {
            frm.dataForm['total_employees'] = totalEmployeeEle.val();
        }
        else {
            if (inputOrganizationEle.is(':checked')) {
                $.fn.notifyB({description: 'Total employee is required with Organization Account.'}, 'failure');
                return false;
            }
        }
        if (accountTaxCode.val()) {
            frm.dataForm['tax_code'] = accountTaxCode.val();
        }
        else {
            if (inputOrganizationEle.is(':checked')) {
                $.fn.notifyB({description: 'Tax code is required with Organization Account.'}, 'failure');
                return false;
            }
        }
        if (industryEle.val()) {
            frm.dataForm['industry'] = industryEle.val();
        }
        else {
            $.fn.notifyB({description: 'Industry is required.'}, 'failure');
            return false;
        }
        if (inputPhone.val()) {
            frm.dataForm['phone'] = inputPhone.val();
        }
        if (inputEmail.val()) {
            frm.dataForm['email'] = inputEmail.val();
        }

        frm.dataForm['shipping_address_id_dict'] = shipping_address_id_dict;
        frm.dataForm['billing_address_id_dict'] = billing_address_id_dict;
        frm.dataForm['contact_mapped'] = data_contact_mapped;
        frm.dataForm['system_status'] = 1; // save, not draft
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}

let currencyEle = $('#currency')
let paymentTermCustomerEle = $('#payment-terms-id-customer')
let paymentTermSupplierEle = $('#payment-terms-id-supplier')
let priceListCustomerEle = $('#price-list-id')
let bankAccountCountryEle = $('#country-select-box-id')
let creditCardExpDate= $("#credit-card-exp-date")

function loadCurrency(currencyData) {
    currencyEle.initSelect2({
        ajax: {
            url: currencyEle.attr('data-url'),
            method: 'GET',
        },
        data: (currencyData ? currencyData : null),
        keyResp: 'currency_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadPaymentTermForCustomer(paymentTermData) {
    paymentTermCustomerEle.initSelect2({
        ajax: {
            url: paymentTermCustomerEle.attr('data-url'),
            method: 'GET',
        },
        data: (paymentTermData ? paymentTermData : null),
        keyResp: 'payment_terms_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadPaymentTermForSupplier(paymentTermData) {
    paymentTermSupplierEle.initSelect2({
        ajax: {
            url: paymentTermSupplierEle.attr('data-url'),
            method: 'GET',
        },
        data: (paymentTermData ? paymentTermData : null),
        keyResp: 'payment_terms_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadPriceListForCustomer(priceListCustomerData) {
    priceListCustomerEle.initSelect2({
        ajax: {
            url: priceListCustomerEle.attr('data-url'),
            method: 'GET',
        },
        data: (priceListCustomerData ? priceListCustomerData : null),
        keyResp: 'price_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadCountries(countriesData) {
    bankAccountCountryEle.initSelect2({
        ajax: {
            url: bankAccountCountryEle.attr('data-url'),
            method: 'GET',
        },
        data: (countriesData ? countriesData : null),
        keyResp: 'countries',
        keyId: 'id',
        keyText: 'title',
    })
}

$(document).on('click', '#save-changes-modal-bank-account', function () {
    let bank_country_id = $('#country-select-box-id').val();
    let bank_name = $('#bank-name-id').val();
    let bank_code = $('#bank-code-id').val();
    let bank_account_name = $('#bank-account-name-id').val();
    let bank_account_number = $('#bank-account-number-id').val();
    let bic_swift_code = $('#bic-swift-code-id').val();

    if (bank_country_id !== '' && bank_name !== '' && bank_code !== '' && bank_account_name !== '' && bank_account_number !== '') {
        let is_default = '';
        if ($('#make-default-bank-account').is(':checked')) {
            is_default = 'checked';
        }
        $('#list-bank-account-information').append(
            `<div class="card close-over col-5 mr-5">
                <div class="card-body">
                    <button type="button" class="card-close btn-close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="row">
                        <div class="col-1">
                            <div class="card-text">
                                <input class="radio_select_default_bank_account" name="bank_account_default" type="radio" ` + is_default + `>                 
                            </div>
                        </div>
                        <div class="col-11">
                            <div class="card-text">
                                Bank account name: <span class="bank_account_name"><b>` + bank_account_name + `</b></span>
                            </div>
                            <div class="card-text">
                                Bank name: <span class="bank_name"><b>` + bank_name + `</b></span>
                            </div>
                            <div class="card-text">
                                Bank account number: <span class="bank_account_number"><b>` + bank_account_number + `</b></span>
                            </div>
                            <div class="card-text" hidden>
                                Country ID: <span class="bank_country_id"><b>` + bank_country_id + `</b></span>
                            </div>
                            <div class="card-text" hidden>
                                Bank code: <span class="bank_code"><b>` + bank_code + `</b></span>
                            </div>
                            <div class="card-text" hidden>
                                BIC/SWIFT Code: <span class="bic_swift_code"><b>` + bic_swift_code + `</b></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        )
        $('#modal-bank-account-information').hide();
    } else {
        $.fn.notifyB({description: "Missing value Banking Account."}, 'failure');
    }
})

$(document).on('click', '#save-changes-modal-credit-card', function () {
    let credit_card_type = $('#credit-card-type-select-box-id').val();
    let credit_card_number = $('#credit-card-number-id').val();
    let credit_card_exp_date = $('#credit-card-exp-date').val();
    let credit_card_name = $('#credit-card-name-id').val();

    if (credit_card_type !== '' && credit_card_number !== '' && credit_card_exp_date !== '' && credit_card_name !== '') {
        let is_default = '';
        if ($('#make-default-credit-card').is(':checked')) {
            is_default = 'checked';
        }
        $('#list-credit-card-information').append(
            `<div class="card close-over col-5 mr-5">
                <div class="card-body">
                    <button type="button" class="card-close btn-close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="row">
                        <div class="col-1">
                            <div class="card-text">
                                <input class="radio_select_default_credit_card" name="credit_card_default" type="radio" ` + is_default + `>
                            </div>
                        </div>
                        <div class="col-11">
                            <div class="card-text">
                                Card Type: <span class="credit_card_type"><b>` + credit_card_type + `</b></span>
                            </div>
                            <div class="card-text">
                                Card Number: <span class="credit_card_number"><b>` + credit_card_number + `</b></span>
                            </div>
                            <div class="card-text">
                                Card Exp: <span class="credit_expired_date"><b>` + credit_card_exp_date + `</b></span>
                            </div>
                            <div class="card-text">
                                Card Name: <span class="credit_card_name"><b>` + credit_card_name + `</b></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        )
        $('#modal-credit-card-information').hide();
    } else {
        $.fn.notifyB({description: "Missing value Credit Card."}, 'failure');
    }
})

creditCardExpDate.datepicker({
    format: "mm/yyyy",
    startView: "months",
    minViewMode: "months",
});

