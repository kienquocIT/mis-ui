let accountName = $('#inp-account-name')
let accountCode = $('#inp-account-code')
let accountWebsite = $('#inp-account-website')
let accountTaxCode = $('#inp-tax-code')
let inputPhone = $('#inp-phone')
let inputEmail = $('#inp-email')
let accountTypeEle = $('#select-box-acc-type')
let accountManagerEle = $('#select-box-acc-manager')
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
let roleForCustomerEle = $('#role-for-customer')
let roleForSupplierEle = $('#role-for-supplier')
let tableShippingAddressEle = $('#list-shipping-address')
let tableBillingAddressEle = $('#list-billing-address')
let current_owner = {'id': null, 'fullname': null}

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
    }).on('change', function () {
        let account_type_title_selected = [];
        accountTypeEle.find('option:selected').each(function () {
            account_type_title_selected.push($(this).text())
        })
        if (account_type_title_selected.includes('Customer'))
        {
            roleForCustomerEle.prop('hidden', false);
        }
        else {
            roleForCustomerEle.prop('hidden', true);
        }
        if (account_type_title_selected.includes('Supplier'))
        {
            roleForSupplierEle.prop('hidden', false);
        }
        else {
            roleForSupplierEle.prop('hidden', true);
        }
    });
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

function loadTableSelectContact(selected_contact_list=[], selected_contact_list_detail=[]) {
    let tbl = $('#datatable-add-contact');
    tbl.DataTable().destroy();
    tbl.DataTableDefault({
        scrollY: true,
        paging: false,
        useDataServer: true,
        dom: "",
        rowIdx: true,
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.data['contact_list_not_map_account']) {
                        return resp.data['contact_list_not_map_account'].concat(selected_contact_list_detail);
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
                render: (data, type, row) => {
                    return `${row.job_title}`
                }
            },
            {
                data: 'owner',
                render: (data, type, row) => {
                    if (Object.keys(row.owner).length !== 0) {
                        return `${row.owner.fullname}`
                    }
                    return ``
                }
            },
            {
                data: 'mobile',
                render: (data, type, row) => {
                    if (row.mobile !== null) {
                        return `${row.mobile}`
                    }
                    return ``
                }
            },
            {
                data: 'email',
                render: (data, type, row) => {
                    if (row.email !== null) {
                        return `${row.email}`
                    }
                    return ``
                }
            },
            {
                data: '',
                className: 'w-5',
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

function loadTableSelectedContact(data, option='') {
    let tbl = $('#datatable_contact_list');
    tbl.DataTable().clear().destroy();
    tbl.DataTableDefault({
        dom: '',
        paging: false,
        data: data,
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    let disabled = '';
                    if (option === 'detail') {
                        disabled = 'disabled';
                    }
                    if (row.is_account_owner || current_owner.id === row.id) {
                        return `<span class="form-check"><input ${disabled} checked name="is_account_owner_radio" type="radio" data-id="${row.id}" class="form-check-input is_account_owner"></span>`;
                    }
                    else {
                        return `<span class="form-check"><input ${disabled} name="is_account_owner_radio" type="radio" data-id="${row.id}" class="form-check-input is_account_owner"></span>`;
                    }
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
        add_shipping_address_btn.addClass('disabled').prop('hidden', true);
        add_billing_address_btn.addClass('disabled').prop('hidden', true);
        add_contact_btn_detail.addClass('disabled').prop('hidden', true);
        addBankAccountEle.addClass('disabled').prop('hidden', true);
        addCreditCardEle.addClass('disabled').prop('hidden', true);
        $('.card-close').addClass('disabled').prop('hidden', true);
    }
}

function load_shipping_address_mapped(data) {
    let list_shipping_address = ``;
    for (let i = 0; i < data.shipping_address.length; i++) {
        let shipping_address = data.shipping_address[i];
        let is_default = '';
        if (shipping_address.is_default === true) {
            is_default = 'checked';
        }
        list_shipping_address +=
            `<tr>
                <td><span class="form-check"><input type="radio" class="form-check-input" name="shippingaddressRadio" ${is_default}></span></td>
                <td><span class="shipping_address_full_address">${shipping_address?.['full_address']}</span></td>
                <td><span><a href="#" class="del-address-item"><i class="bi bi-trash"></i></a></span></td>
                <td hidden class="shipping_address_country_id">${shipping_address?.['country_id']}</td>
                <td hidden class="shipping_address_city_id">${shipping_address?.['city_id']}</td>
                <td hidden class="shipping_address_district_id">${shipping_address?.['district_id']}</td>
                <td hidden class="shipping_address_ward_id">${shipping_address?.['ward_id']}</td>
                <td hidden class="shipping_address_detail_address">${shipping_address?.['detail_address']}</td>
            </tr>`
    }
    tableShippingAddressEle.find('tbody').append(list_shipping_address)
}

function load_billing_address_mapped(data) {
    let list_billing_address = ``
    for (let i = 0; i < data.billing_address.length; i++) {
        let billing_address = data.billing_address[i];
        let is_default = '';
        if (billing_address.is_default === true) {
            is_default = 'checked';
        }
        list_billing_address +=
            `<tr>
                <td><span class="form-check"><input type="radio" class="form-check-input" name="billingaddressRadio" ${is_default}></span></td>
                <td><span class="billing_address_full_address">${billing_address.full_address}</span></td>
                <td><span><a href="#" class="del-address-item"><i class="bi bi-trash"></i></a></span></td>
                <td hidden class="billing_address_account_name">${billing_address.account_name}</td>
                <td hidden class="billing_address_email">${billing_address.email}</td>
                <td hidden class="billing_address_tax_code">${billing_address.tax_code}</td>
                <td hidden class="billing_address_account_address">${billing_address.account_address}</td>
            </tr>`
    }
    tableBillingAddressEle.find('tbody').append(list_billing_address)
}

function load_bank_accounts_mapped(data) {
    for (let i = 0; i < data.length; i++) {
        let bank_account = data[i];
        let default_card_color = '';
        let checked = '';
        if (bank_account?.['is_default'] === true) {
            default_card_color = 'bg-primary text-dark bg-opacity-10';
            checked = 'checked';
        }
        $('#list-bank-account-information').append(
            `<div class="card ${default_card_color} close-over col-12 col-md-5 col-lg-5 mr-5">
                <div class="card-body">
                    <button type="button" class="card-close btn-close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="row">
                        <div class="col-1">
                            <div class="card-text">
                                <input class="radio_select_default_bank_account" name="bank_account_default" type="radio" ${checked}>                 
                            </div>
                        </div>
                        <div class="col-11">
                            <div class="card-text">
                                Bank account name: <span class="bank_account_name"><b>${bank_account?.['bank_account_name']}</b></span>
                            </div>
                            <div class="card-text">
                                Bank name: <span class="bank_name"><b>${bank_account?.['bank_name']}</b></span>
                            </div>
                            <div class="card-text">
                                Bank account number: <span class="bank_account_number"><b>${bank_account?.['bank_account_number']}</b></span>
                            </div>
                            <div class="card-text" hidden>
                                Country ID: <span class="bank_country_id"><b>${bank_account?.['bank_country_id']}</b></span>
                            </div>
                            <div class="card-text" hidden>
                                Bank code: <span class="bank_code"><b>${bank_account?.['bank_code']}</b></span>
                            </div>
                            <div class="card-text" hidden>
                                BIC/SWIFT Code: <span class="bic_swift_code"><b>${bank_account?.['bic_swift_code']}</b></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        )
    }
}

function load_credit_cards_mapped(data) {
    for (let i = 0; i < data.length; i++) {
        let credit_card = data[i];
        let default_card_color = '';
        let checked = '';
        if (credit_card?.['is_default'] === true) {
            default_card_color = 'bg-primary text-dark bg-opacity-10';
            checked = 'checked';
        }
        $('#list-credit-card-information').append(
            `<div class="card ${default_card_color} close-over col-12 col-md-5 col-lg-5 mr-5">
                <div class="card-body">
                    <button type="button" class="card-close btn-close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="row">
                        <div class="col-1">
                            <div class="card-text">
                                <input class="radio_select_default_credit_card" name="credit_card_default" type="radio" ${checked}>
                            </div>
                        </div>
                        <div class="col-11">
                            <div class="card-text">
                                Card Type: <span class="credit_card_type"><b>${credit_card?.['credit_card_type']}</b></span>
                            </div>
                            <div class="card-text">
                                Card Number: <span class="credit_card_number"><b>${credit_card?.['credit_card_number']}</b></span>
                            </div>
                            <div class="card-text">
                                Card Exp: <span class="credit_expired_date"><b>${credit_card?.['card_expired_date']}</b></span>
                            </div>
                            <div class="card-text">
                                Card Name: <span class="credit_card_name"><b>${credit_card?.['credit_card_name']}</b></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        )
    }
}

function LoadDetail(option) {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-update-account').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['account_detail']?.['workflow_runtime_id']);
                data = data['account_detail'];
                // console.log(data)

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
                    $("#tax-code-label").removeClass("required");
                } else if (data.account_type_selection === 1) {
                    inputOrganizationEle.prop('checked', true);
                    $('#parent-account-div-id').prop('hidden', false);
                    $('#account-tax-code-label-id').addClass('required');
                    $('#total_employees_label').addClass('required');
                    $("#tax-code-label").addClass("required");
                }

                load_shipping_address_mapped(data);
                load_billing_address_mapped(data);

                $('.del-address-item').on('click', function () {
                    $(this).closest('tr').remove();
                })

                totalEmployeeEle.val(data.total_employees)
                annualRevenueEle.val(data.annual_revenue)

                loadAccountType(data.account_type)

                for (let i = 0; i < data.account_type.length; i++) {
                    if (data.account_type[i].title === 'Customer')
                    {
                        roleForCustomerEle.prop('hidden', false);
                    }
                    if (data.account_type[i].title === 'Supplier')
                    {
                        roleForSupplierEle.prop('hidden', false);
                    }
                }

                loadAccountGroup(data.account_group)

                loadIndustry(data.industry)

                loadAccountManager(data.manager)

                loadParentAccount(data?.['parent_account_mapped'])

                for (let i = 0; i < data.contact_mapped.length; i++) {
                    if (data.contact_mapped[i].is_account_owner) {
                        current_owner = data.contact_mapped[i];
                    }
                }

                add_contact_btn_detail.on('click', function () {
                    let contact_mapped_list = [];
                    $('#datatable_contact_list tbody').find('.selected_contact_full_name').each(function () {
                        contact_mapped_list.push($(this).attr('data-id'))
                    })
                    loadTableSelectContact(contact_mapped_list, data.contact_mapped);
                })

                loadTableSelectedContact(data.contact_mapped, option);

                // For Detail
                loadCurrency(data.currency)
                loadPaymentTermForCustomer(data?.['payment_term_customer_mapped'])
                loadPaymentTermForSupplier(data?.['payment_term_supplier_mapped'])
                loadPriceListForCustomer(data?.['price_list_mapped'])
                $('#credit-limit-id-customer').attr('value', data?.['credit_limit_customer']);
                $('#credit-limit-id-supplier').attr('value', data?.['credit_limit_supplier']);
                loadCountries();
                load_bank_accounts_mapped(data?.['bank_accounts_mapped']);
                load_credit_cards_mapped(data?.['credit_cards_mapped']);

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
            tableShippingAddressEle.find('tbody').append(
                `<tr>
                    <td><span class="form-check"><input class="form-check-input" type="radio" name="shippingaddressRadio" ${is_default}></span></td>
                    <td><span class="shipping_address_full_address">${shipping_address}</span></td>
                    <td><span><a href="#" class="del-address-item"><i class="bi bi-trash"></i></a></span></td>
                    <td hidden class="shipping_address_country_id">${country_id}</td>
                    <td hidden class="shipping_address_city_id">${city_id}</td>
                    <td hidden class="shipping_address_district_id">${district_id}</td>
                    <td hidden class="shipping_address_ward_id">${ward_id}</td>
                    <td hidden class="shipping_address_detail_address">${detail_shipping_address}</td>
                </tr>`
            )

            $('.del-address-item').on('click', function () {
                $(this).closest('tr').remove();
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
            tableBillingAddressEle.find('tbody').append(
                `<tr>
                    <td><span class="form-check"><input type="radio" class="form-check-input" name="billingaddressRadio" ${is_default}></span></td>
                    <td><span class="billing_address_full_address">${billing_address}</span></td>
                    <td><span><a href="#" class="del-address-item"><i class="bi bi-trash"></i></a></span></td>
                    <td hidden class="billing_address_account_name">${acc_name}</td>
                    <td hidden class="billing_address_email">${email_address}</td>
                    <td hidden class="billing_address_tax_code">${tax_code}</td>
                    <td hidden class="billing_address_account_address">${account_address}</td>
                </tr>`
            )

            $('.del-address-item').on('click', function () {
                $(this).closest('tr').remove();
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
    loadParentAccount();
})

inputOrganizationEle.on('change', function () {
    parentAccountEle.attr('disabled', false);
    $("#tax-code-label").addClass("required");
    $("#total_employees_label").addClass("required");
})

add_shipping_address_btn.on('click', function () {
    if ($('#list-shipping-address input').length === 0) {
        $('#make-default-shipping-address').prop('checked', true).prop('disabled', true);
    }
    else {
        $('#make-default-shipping-address').prop('checked', false).prop('disabled', false);
    }
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
    tableShippingAddressEle.find('.shipping_address_full_address').each(function () {
        if ($(this).closest('tr').find('input[type="radio"]').is(':checked') === true)
            billingAddressEle.append(`<option selected>` + $(this).text() + `</option>`)
        else
            billingAddressEle.append(`<option>` + $(this).text() + `</option>`)
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
    let contact_mapped_list = [];
    $('#datatable_contact_list tbody').find('.selected_contact_full_name').each(function () {
        contact_mapped_list.push($(this).attr('data-id'))
    })
    loadTableSelectContact(contact_mapped_list);
})

$(document).on('click', '#btn-add-contact', function () {
    let selected_contact = [];
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

let currencyEle = $('#currency')
let paymentTermCustomerEle = $('#payment-terms-id-customer')
let creditLimitCustomerEle = $('#credit-limit-id-customer')
let priceListCustomerEle = $('#price-list')
let paymentTermSupplierEle = $('#payment-terms-id-supplier')
let creditLimitSupplierEle = $('#credit-limit-id-supplier')
let bankAccountCountryEle = $('#country-select-box-id')
let creditCardExpDate= $("#credit-card-exp-date")
let addBankAccountEle= $("#bank-account-information-btn")
let addCreditCardEle= $("#credit-card-information-btn")

function get_bank_accounts_information() {
    let bank_accounts_information = [];
    let list_bank_account = $('#list-bank-account-information').children();
    for (let i = 0; i < list_bank_account.length; i++) {
        let country_id = $(list_bank_account[i]).find('span.bank_country_id').text();
        let bank_name = $(list_bank_account[i]).find('span.bank_name').text();
        let bank_code = $(list_bank_account[i]).find('span.bank_code').text();
        let bank_account_name = $(list_bank_account[i]).find('span.bank_account_name').text();
        let bank_account_number = $(list_bank_account[i]).find('span.bank_account_number').text();
        let bic_swift_code = $(list_bank_account[i]).find('span.bic_swift_code').text();
        let is_default = $(list_bank_account[i]).find('input[type=radio]').is(':checked');

        bank_accounts_information.push({
            'country_id': country_id,
            'bank_name': bank_name,
            'bank_code': bank_code,
            'bank_account_name': bank_account_name,
            'bank_account_number': bank_account_number,
            'bic_swift_code': bic_swift_code,
            'is_default': is_default
        })
    }
    return bank_accounts_information;
}

function get_credit_cards_information() {
    let credit_cards_information = [];
    let list_card = $('#list-credit-card-information').children();
    for (let i = 0; i < list_card.length; i++) {
        let credit_card_type = $(list_card[i]).find('span.credit_card_type').text();
        let credit_card_number = $(list_card[i]).find('span.credit_card_number').text();
        let credit_card_name = $(list_card[i]).find('span.credit_card_name').text();
        let expired_date = $(list_card[i]).find('span.credit_expired_date').text();
        let is_default = $(list_card[i]).find('input[type=radio]').is(':checked');

        credit_cards_information.push({
            'credit_card_type': credit_card_type,
            'credit_card_number': credit_card_number,
            'credit_card_name': credit_card_name,
            'expired_date': expired_date,
            'is_default': is_default
        })
    }
    return credit_cards_information;
}

function get_shipping_address() {
    let shipping_address = [];
    $('#list-shipping-address tbody').find('tr').each(function () {
        shipping_address.push({
            'country_id': $(this).find('.shipping_address_country_id').text(),
            'city_id': $(this).find('.shipping_address_city_id').text(),
            'district_id': $(this).find('.shipping_address_district_id').text(),
            'ward_id': $(this).find('.shipping_address_ward_id').text(),
            'detail_address': $(this).find('.shipping_address_detail_address').text(),
            'full_address': $(this).find('.shipping_address_full_address').text(),
            'is_default': $(this).find('input[type="radio"]').is(':checked'),
        })
    })
    return shipping_address;
}

function get_billing_address() {
    let billing_address = [];
    $('#list-billing-address tbody').find('tr').each(function () {
        billing_address.push({
            'account_name': $(this).find('.billing_address_account_name').text(),
            'email': $(this).find('.billing_address_email').text(),
            'tax_code': $(this).find('.billing_address_tax_code').text(),
            'account_address': $(this).find('.billing_address_account_address').text(),
            'full_address': $(this).find('.billing_address_full_address').text(),
            'is_default': $(this).find('input[type="radio"]').is(':checked')
        })
    })
    return billing_address;
}

function get_contacts_mapped() {
    let contact_mapped_list = [];
    $('#datatable_contact_list tbody').find('.is_account_owner').each(function () {
        contact_mapped_list.push({
            'id': $(this).attr('data-id'),
            'is_account_owner': $(this).is(':checked')
        })
    })
    return contact_mapped_list;
}

class AccountHandle {
    load() {
        loadAccountType();
        loadAccountManager();
        loadIndustry();
        loadAccountGroup();
        loadParentAccount();
        loadShippingCities();
        loadShippingDistrict();
        loadShippingWard();
        loadContactOwner();
    }
    combinesData(frmEle, for_update=false) {
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
        if (accountManagerEle.val().length > 0) {
            frm.dataForm['manager'] = accountManagerEle.val();
        }
        else {
            $.fn.notifyB({description: 'Account manager is required.'}, 'failure');
            return false;
        }
        if (parentAccountEle.val()) {
            frm.dataForm['parent_account_mapped'] = parentAccountEle.val();
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

        frm.dataForm['contact_mapped'] = get_contacts_mapped();
        frm.dataForm['shipping_address_dict'] = get_shipping_address();
        frm.dataForm['billing_address_dict'] = get_billing_address();
        frm.dataForm['system_status'] = 1; // save, not draft

        let url_return = frm.dataUrl;

        if (for_update === true) {
            frm.dataForm['bank_accounts_information'] = get_bank_accounts_information();
            frm.dataForm['credit_cards_information'] = get_credit_cards_information();

            if (currencyEle.val()) {
                frm.dataForm['currency'] = currencyEle.val();
            }
            if (paymentTermCustomerEle.val()) {
                frm.dataForm['payment_term_customer_mapped'] = paymentTermCustomerEle.val();
            }
            if (priceListCustomerEle.val()) {
                frm.dataForm['price_list_mapped'] = priceListCustomerEle.val();
            }
            if (creditLimitCustomerEle.attr('value')) {
                frm.dataForm['credit_limit_customer'] = creditLimitCustomerEle.attr('value');
            }
            if (paymentTermSupplierEle.val()) {
                frm.dataForm['payment_term_supplier_mapped'] = paymentTermSupplierEle.val();
            }
            if (creditLimitCustomerEle.attr('value')) {
                frm.dataForm['credit_limit_supplier'] = creditLimitSupplierEle.attr('value');
            }

            let pk = $.fn.getPkDetail()
            url_return = frm.dataUrl.format_url_with_uuid(pk);
        }

        return {
            url: url_return,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}

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
        let default_card_color = '';
        if ($('#make-default-bank-account').is(':checked')) {
            is_default = 'checked';
            default_card_color = 'bg-primary text-dark bg-opacity-10';
        }
        $('#list-bank-account-information').append(
            `<div class="card ${default_card_color} close-over col-12 col-md-5 col-lg-5 mr-5">
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
        let default_card_color = '';
        if ($('#make-default-credit-card').is(':checked')) {
            is_default = 'checked';
            default_card_color = 'bg-primary text-dark bg-opacity-10';
        }
        $('#list-credit-card-information').append(
            `<div class="card ${default_card_color} close-over col-12 col-md-5 col-lg-5 mr-5">
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

$(document).on('click', '#edit-bank-account-information', function () {
    if ($('#list-bank-account-information input').length === 0) {
        $('#make-default-bank-account').prop('checked', true).prop('disabled', true);
    } else {
        $('#make-default-bank-account').prop('checked', false).prop('disabled', false);
    }
})

$(document).on('click', '#edit-credit-card-information', function () {
    if ($('#list-credit-card-information input').length === 0) {
        $('#make-default-credit-card').prop('checked', true).prop('disabled', true);
    } else {
        $('#make-default-credit-card').prop('checked', false).prop('disabled', false);
    }
})

$(document).on('change', 'input[name="shippingaddressRadio"]', function () {
    tableShippingAddressEle.find('tr').removeClass('bg-primary text-dark bg-opacity-10');
    $(this).closest('tr').addClass('bg-primary text-dark bg-opacity-10');
})

$(document).on('change', 'input[name="billingaddressRadio"]', function () {
    tableBillingAddressEle.find('tr').removeClass('bg-primary text-dark bg-opacity-10');
    $(this).closest('tr').addClass('bg-primary text-dark bg-opacity-10');
})

$(document).on('change', '.radio_select_default_bank_account', function () {
    $('#list-bank-account-information').find('.card').removeClass('bg-primary text-dark bg-opacity-10')
    $(this).closest('.card').addClass('bg-primary text-dark bg-opacity-10');
})

$(document).on('change', '.radio_select_default_credit_card', function () {
    $('#list-credit-card-information').find('.card').removeClass('bg-primary text-dark bg-opacity-10')
    $(this).closest('.card').addClass('bg-primary text-dark bg-opacity-10');
})

let frm_create_contact = $('#frm-create-new-contact');

frm_create_contact.submit(function (event) {
    event.preventDefault();
    let data = {
        'owner': $('#select-box-contact-owner').val(),
        'fullname': $('#inp-fullname').val(),
        'job_title': $('#inp-jobtitle').val(),
        'email': $('#inp-email-contact').val(),
        'phone': $('#inp-phone').val(),
        'mobile': $('#inp-mobile').val()
    }
    let combinesData = {
        url: $(this).attr('data-url'),
        method: $(this).attr('data-method'),
        data: data,
    }
    WindowControl.showLoading();
    $.fn.callAjax2(combinesData).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $('#modal-add-new-contact').hide();
                $('#offcanvasRight').offcanvas('show');
                loadTableSelectContact();
                $.fn.notifyB({description: "Successfully"}, 'success')
                setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    1000
                )
            }
        },
        (errs) => {
            setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    1000
                )
            console.log(errs)
            $.fn.notifyB({description: errs.data.errors}, 'failure');
        })
})
