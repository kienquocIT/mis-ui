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
let bank_account_table = $('#list-bank-account-information')
let credit_card_table = $('#list-credit-card-information')
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
            account_type_title_selected.push($(this).text().toLowerCase())
        })
        if (account_type_title_selected.includes('customer'))
        {
            roleForCustomerEle.prop('hidden', false);
        }
        else {
            roleForCustomerEle.prop('hidden', true);
        }
        if (account_type_title_selected.includes('supplier'))
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
        templateResult: function(data) {
            let ele = $('<div class="row col-12"></div>');
            ele.append('<div class="col-8">' + data.data?.['full_name'] + '</div>');
            if (data.data?.['group']?.['title'] !== undefined) {
                ele.append('<div class="col-4">(' + data.data?.['group']['title'] + ')</div>');
            }
            return ele;
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
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
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
    tbl.DataTable().clear().destroy();
    tbl.DataTableDefault({
        styleDom: 'hide-foot',
        useDataServer: true,
        rowIdx: true,
        paging: false,
        scrollX: '100vw',
        scrollY: '70vh',
        scrollCollapse: true,
        ajax: {
            url: tbl.attr('data-url'),
            type: 'GET',
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('contact_list_not_map_account')) {
                    let data_list = data?.['contact_list_not_map_account'].concat(selected_contact_list_detail);
                    for (let i = 0; i < data_list.length; i++) {
                        data_list[i]['is_checked'] = selected_contact_list.includes(data_list[i]?.['id']) ? 'checked' : '';
                    }
                    return data_list
                }
            },
        },
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return ''
                }
            },
            {
                className: 'w-30',
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-primary mr-1">${row?.['code'] ? row?.['code'] : ''}</span><span class="text-primary">${row?.['fullname'] ? row?.['fullname'] : ''}</span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `${row?.['job_title'] ? row?.['job_title'] : ''}`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `${row?.['mobile'] ? row?.['mobile'] : ''}`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `${row?.['email'] ? row?.['email'] : ''}`
                }
            },
            {
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-blue mr-1">${row?.['owner']?.['code'] ? row?.['owner']?.['code'] : ''}</span><span class="text-blue">${row?.['owner']?.['fullname'] ? row?.['owner']?.['fullname'] : ''}</span>`
                }
            },
            {
                className: 'w-5 text-right',
                render: (data, type, row) => {
                    return `<span class="form-check">
                                <input type="checkbox" class="form-check-input selected_contact"
                                data-id="${row?.['id']}"
                                ${row?.['is_checked']}
                                data-fullname="${row?.['fullname']}"
                                data-mobile="${row?.['mobile']}"
                                data-email="${row?.['email']}"
                                data-job-title="${row?.['job_title']}">
                                <label class="form-check-label"></label>
                            </span>`
                }
            },
        ],
    })
}

function loadTableSelectedContact(data=[], option='') {
    let tbl = $('#datatable_contact_list');
    tbl.DataTable().clear().destroy();
    tbl.DataTableDefault({
        dom: '',
        styleDom: 'hide-foot',
        rowIdx: true,
        paging: false,
        data: data,
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return ''
                }
            },
            {
                className: 'w-20',
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
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span class="text-secondary">${row.job_title ? row.job_title : ''}</span>`
                }
            },
            {
                data: 'mobile',
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span class="text-secondary">${row.mobile ? row.mobile : ''}</span>`
                }
            },
            {
                data: 'email',
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span class="text-secondary">${row.email ? row.email : ''}</span>`
                }
            },
        ],
    })
}

function loadTableShippingAddress(data=[], option='') {
    tableShippingAddressEle.DataTable().clear().destroy()
    tableShippingAddressEle.DataTableDefault({
        dom: '',
        styleDom: 'hide-foot',
        rowIdx: true,
        paging: false,
        data: data,
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return ''
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="form-check">
                                <input ${option === 'detail' ? 'disabled' : ''} type="radio" class="form-check-input" name="shippingaddressRadio" ${row?.['is_default'] ? 'checked' : ''}>
                            </span>
                            <span hidden class="shipping_address_country_id">${row?.['country_id']}</span>
                            <span hidden class="shipping_address_city_id">${row?.['city_id']}</span>
                            <span hidden class="shipping_address_district_id">${row?.['district_id']}</span>
                            <span hidden class="shipping_address_ward_id">${row?.['ward_id']}</span>
                            <span hidden class="shipping_address_detail_address">${row?.['detail_address']}</span>`
                }
            },
            {
                className: 'w-80',
                render: (data, type, row) => {
                    return `<span class="shipping_address_full_address">${row?.['full_address']}</span>`
                }
            },
            {
                className: 'w-5 text-right',
                render: (data, type, row) => {
                    return `<span><a href="#" ${option === 'detail' ? 'hidden' : ''} class="text-muted del-row"><i class="bi bi-trash"></i></a></span>`
                }
            }
        ],
    })
}

function loadTableBillingAddress(data=[], option='') {
    tableBillingAddressEle.DataTable().clear().destroy()
    tableBillingAddressEle.DataTableDefault({
        dom: '',
        styleDom: 'hide-foot',
        rowIdx: true,
        paging: false,
        data: data,
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return ''
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="form-check"><input ${option === 'detail' ? 'disabled' : ''} type="radio" class="form-check-input" name="billingaddressRadio" ${row?.['is_default'] ? 'checked' : ''}></span>
                            <span hidden class="billing_address_account_name">${row?.['account_name']}</span>
                            <span hidden class="billing_address_email">${row?.['email']}</span>
                            <span hidden class="billing_address_tax_code">${row?.['tax_code']}</span>
                            <span hidden class="billing_address_account_address">${row?.['account_address']}</span>`
                }
            },
            {
                className: 'w-80',
                render: (data, type, row) => {
                    return `<span class="billing_address_full_address">${row?.['full_address']}</span>`
                }
            },
            {
                className: 'w-5 text-right',
                render: (data, type, row) => {
                    return `<span><a ${option === 'detail' ? 'hidden' : ''} href="#" class="text-muted del-row"><i class="bi bi-trash"></i></a></span>`
                }
            }
        ],
    })
}

function loadTableBankAccount(data=[], option='') {
    bank_account_table.DataTable().clear().destroy()
    bank_account_table.DataTableDefault({
        dom: '',
        styleDom: 'hide-foot',
        rowIdx: true,
        paging: false,
        data: data,
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return ''
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="form-check"><input ${option === 'detail' ? 'disabled' : ''} class="radio_select_default_bank_account form-check-input" name="bank_account_default" type="radio" ${row?.['is_default'] ? 'checked' : ''}></span>
                            <span hidden class="bank_country_id">${row?.['bank_country_id']}</span>
                            <span hidden class="bank_code">${row?.['bank_code']}</span>
                            <span hidden class="bic_swift_code">${row?.['bic_swift_code']}</span>`
                }
            },
            {
                className: 'w-35',
                render: (data, type, row) => {
                    return `<span class="bank_name">${row?.['bank_name']}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span class="bank_account_name">${row?.['bank_account_name']}</span>`
                }
            },
            {
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span class="bank_account_number">${row?.['bank_account_number']}</span>`
                }
            },
            {
                className: 'w-5 text-right',
                render: (data, type, row) => {
                    return `<span><a ${option === 'detail' ? 'hidden' : ''} href="#" class="text-muted del-row"><i class="bi bi-trash"></i></a></span>`
                }
            }
        ],
    })
}

function loadTableCreditCard(data=[], option='') {
    credit_card_table.DataTable().clear().destroy()
    credit_card_table.DataTableDefault({
        dom: '',
        styleDom: 'hide-foot',
        rowIdx: true,
        paging: false,
        data: data,
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return ''
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="form-check"><input ${option === 'detail' ? 'disabled' : ''} class="radio_select_default_credit_card form-check-input" name="credit_card_default" type="radio" ${row?.['is_default'] ? 'checked' : ''}></span>
                            <span hidden class="bank_country_id">${row?.['bank_country_id']}</span>
                            <span hidden class="bank_code">${row?.['bank_code']}</span>
                            <span hidden class="bic_swift_code">${row?.['bic_swift_code']}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span class="credit_card_type">${row?.['credit_card_type']}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span class="credit_card_name">${row?.['credit_card_name']}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span class="credit_card_number">${row?.['credit_card_number']}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span class="card_expired_date">${row?.['card_expired_date']}</span>`
                }
            },
            {
                className: 'w-5 text-right',
                render: (data, type, row) => {
                    return `<span><a ${option === 'detail' ? 'hidden' : ''} href="#" class="text-muted del-row"><i class="bi bi-trash"></i></a></span>`
                }
            }
        ],
    })
}

function checkSelectAll() {
    document.getElementById('check-select-all').checked = document.querySelectorAll('.selected_contact:checked').length === document.querySelectorAll('.selected_contact').length;
}

function Disable(option) {
    if (option === 'detail') {
        $('form select').prop('disabled', true);
        $('form input').prop('disabled', true).prop('readonly', true);
        $('form button').addClass('disabled').prop('hidden', true)
    }
}

function AddRow(table, data) {
    table.DataTable().row.add(data).draw();
}

function DeleteRow(table, currentRow) {
    currentRow = parseInt(currentRow) - 1
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    row.remove().draw();
}

function LoadDetail(option) {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-update-account').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.compareStatusShowPageAction(data);
                data = data['account_detail'];
                console.log(data)

                accountName.val(data.name);
                accountCode.val(data.code);
                accountWebsite.val(data.website);
                inputPhone.val(data.phone);
                inputEmail.val(data.email);
                accountTaxCode.val(data.tax_code);

                if (data.account_type_selection === 0) {
                    inputIndividualEle.prop('checked', true);
                } else if (data.account_type_selection === 1) {
                    inputOrganizationEle.prop('checked', true);
                }
                inputIndividualEle.trigger('change')
                inputOrganizationEle.trigger('change')

                totalEmployeeEle.val(data.total_employees)
                annualRevenueEle.val(data.annual_revenue)

                loadAccountType(data.account_type)

                for (let i = 0; i < data.account_type.length; i++) {
                    if (data.account_type[i].code === 'AT001')
                    {
                        roleForCustomerEle.prop('hidden', false);
                    }
                    if (data.account_type[i].code === 'AT002')
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

                // For Detail
                $('#revenue-ytd').attr('data-init-money', data?.['revenue_information']?.['revenue_ytd'])
                $('#no-order').text(data?.['revenue_information']?.['order_number'])
                $('#revenue-avg').attr('data-init-money', data?.['revenue_information']?.['revenue_average'])
                loadTableSelectedContact(data?.['contact_mapped'], option);
                loadTableShippingAddress(data?.['shipping_address'], option);
                loadTableBillingAddress(data?.['billing_address'], option);

                loadCurrency(data.currency)
                loadPaymentTermForCustomer(data?.['payment_term_customer_mapped'])
                loadPaymentTermForSupplier(data?.['payment_term_supplier_mapped'])
                loadPriceListForCustomer(data?.['price_list_mapped'])
                $('#credit-limit-id-customer').attr('value', data?.['credit_limit_customer']);
                $('#credit-limit-id-supplier').attr('value', data?.['credit_limit_supplier']);
                loadCountries();
                loadTableBankAccount(data?.['bank_accounts_mapped'], option);
                loadTableCreditCard(data?.['credit_cards_mapped'], option);

                $.fn.initMaskMoney2();

                Disable(option);

                // load activity
                dataTableActivity(data?.['activity']);
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
        let ward = shipping_ward.find(`option:selected`).text();

        let selectedVal = shipping_city.val();
        let dataBackup = SelectDDControl.get_data_from_idx(shipping_city, selectedVal);
        let country_id = dataBackup?.['country_id'] || null;
        let city_id = shipping_city.find(`option:selected`).attr('value');
        let district_id = shipping_district.find(`option:selected`).attr('value');
        let ward_id = shipping_ward.find(`option:selected`).attr('value');

        let full_address = '';
        if (city !== '' && district !== '' && detail_shipping_address !== '') {

            if (ward === '') {
                full_address = detail_shipping_address + ', ' + district + ', ' + city;
            } else {
                full_address = detail_shipping_address + ', ' + ward + ', ' + district + ', ' + city;
            }
            // console.log(detail_shipping_address, ward, district, city)

            $('#modal-shipping-address').modal('hide');
            shipping_address_modal.val('');
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }

        if (full_address !== '') {
            AddRow(tableShippingAddressEle, {
                'is_default': make_default_shipping_address.prop('checked'),
                'country_id': country_id,
                'city_id': city_id,
                'district_id': district_id,
                'ward_id': ward_id,
                'detail_address': detail_shipping_address,
                'full_address': full_address
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

        let full_address = '';
        if (email_address !== '' && tax_code !== '' && account_address !== '0') {
            full_address = acc_name + ', ' + account_address + ' (email: ' + email_address + ', tax code: ' + tax_code + ')';
            $('#modal-billing-address').modal('hide');
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }

        if (full_address !== '') {
            AddRow(tableBillingAddressEle, {
                'is_default': make_default_billing_address.prop('checked'),
                'account_name': acc_name,
                'email': email_address,
                'tax_code': tax_code,
                'account_address': account_address,
                'full_address': full_address
            })
        }
    } catch (error) {
        $.fn.notifyB({description: "No address information!"}, 'failure');
    }
})

inputIndividualEle.on('change', function () {
    parentAccountEle.prop('selectedIndex', -1).attr('disabled', true);
    $("#tax-code-label").removeClass("required");
    // $("#total_employees_label").removeClass("required");
    loadParentAccount();
})

inputOrganizationEle.on('change', function () {
    parentAccountEle.attr('disabled', false);
    $("#tax-code-label").addClass("required");
    // $("#total_employees_label").addClass("required");
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

$(document).on('click', '.del-row', function () {
    DeleteRow($(this).closest('table'), parseInt($(this).closest('tr').find('td:first-child').text()))
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
let frm_create_contact = $('#frm-create-new-contact')

function get_bank_accounts_information() {
    let bank_accounts_information = [];
    bank_account_table.find('tbody tr').each(function () {
        let country_id = $(this).find('.bank_country_id').text();
        let bank_name = $(this).find('.bank_name').text();
        let bank_code = $(this).find('.bank_code').text();
        let bank_account_name = $(this).find('.bank_account_name').text();
        let bank_account_number = $(this).find('.bank_account_number').text();
        let bic_swift_code = $(this).find('.bic_swift_code').text();
        let is_default = $(this).find('.radio_select_default_bank_account').prop('checked');

        if (country_id) {
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
    })
    return bank_accounts_information;
}

function get_credit_cards_information() {
    let credit_cards_information = [];
    credit_card_table.find('tbody tr').each(function () {
        let credit_card_type = $(this).find('.credit_card_type').text();
        let credit_card_number = $(this).find('.credit_card_number').text();
        let credit_card_name = $(this).find('.credit_card_name').text();
        let card_expired_date = $(this).find('.card_expired_date').text();
        let is_default = $(this).find('.radio_select_default_credit_card').prop('checked');

        if (credit_card_type) {
            credit_cards_information.push({
                'credit_card_type': credit_card_type,
                'credit_card_number': credit_card_number,
                'credit_card_name': credit_card_name,
                'expired_date': card_expired_date,
                'is_default': is_default
            })
        }
    })
    return credit_cards_information;
}

function get_shipping_address() {
    let shipping_address = [];
    $('#list-shipping-address tbody tr').each(function () {
        if ($(this).find('.shipping_address_country_id').text()) {
            shipping_address.push({
                'country_id': $(this).find('.shipping_address_country_id').text(),
                'city_id': $(this).find('.shipping_address_city_id').text(),
                'district_id': $(this).find('.shipping_address_district_id').text(),
                'ward_id': $(this).find('.shipping_address_ward_id').text(),
                'detail_address': $(this).find('.shipping_address_detail_address').text(),
                'full_address': $(this).find('.shipping_address_full_address').text(),
                'is_default': $(this).find('input[type="radio"]').is(':checked'),
            })
        }
    })
    return shipping_address;
}

function get_billing_address() {
    let billing_address = [];
    $('#list-billing-address tbody tr').each(function () {
        if ($(this).find('.billing_address_account_name').text()) {
            billing_address.push({
                'account_name': $(this).find('.billing_address_account_name').text(),
                'email': $(this).find('.billing_address_email').text(),
                'tax_code': $(this).find('.billing_address_tax_code').text(),
                'account_address': $(this).find('.billing_address_account_address').text(),
                'full_address': $(this).find('.billing_address_full_address').text(),
                'is_default': $(this).find('input[type="radio"]').is(':checked')
            })
        }
    })
    return billing_address;
}

function get_contacts_mapped() {
    let contact_mapped_list = [];
    $('#datatable_contact_list tbody .is_account_owner').each(function () {
        if ($(this).attr('data-id')) {
            contact_mapped_list.push({
                'id': $(this).attr('data-id'),
                'is_account_owner': $(this).is(':checked')
            })
        }
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
        inputIndividualEle.trigger('change')
        inputOrganizationEle.trigger('change')

        loadTableSelectedContact()
        loadTableShippingAddress()
        loadTableBillingAddress()
        loadTableBankAccount()
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
        // else {
            // if (inputOrganizationEle.is(':checked')) {
            //     $.fn.notifyB({description: 'Total employee is required with Organization Account.'}, 'failure');
            //     return false;
            // }
        // }
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
        if (currencyEle.val()) {
            frm.dataForm['currency'] = currencyEle.val();
        }

        frm.dataForm['contact_mapped'] = get_contacts_mapped();
        frm.dataForm['shipping_address_dict'] = get_shipping_address();
        frm.dataForm['billing_address_dict'] = get_billing_address();
        frm.dataForm['system_status'] = 1; // save, not draft

        let url_return = frm.dataUrl;

        if (for_update === true) {
            frm.dataForm['bank_accounts_information'] = get_bank_accounts_information();
            frm.dataForm['credit_cards_information'] = get_credit_cards_information();

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
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].status === 'Valid') {
                    result.push(resp.data[keyResp][i]);
                }
            }
            return result;
        },
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


// ACTIVITY
function dataTableActivity(data) {
    // init dataTable
    let $tables = $('#datable-account-activity');
    let transEle = $('#app-trans-factory');
    $tables.DataTableDefault({
        data: data ? data : [],
        rowIdx: true,
        columns: [
            {
                targets: 0,
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    let appMapTrans = {
                        'opportunity.opportunity': transEle.attr('data-opportunity'),
                        'opportunity.opportunitymeeting': transEle.attr('data-meeting'),
                        'quotation.quotation': transEle.attr('data-quotation'),
                        'saleorder.saleorder': transEle.attr('data-sale-order'),
                    }
                    let appMapBadge = {
                        'opportunity.opportunity': "badge-indigo badge-outline",
                        'opportunity.opportunitymeeting': "badge-warning badge-outline",
                        'quotation.quotation': "badge-primary badge-outline",
                        'saleorder.saleorder': "badge-success badge-outline",
                    }
                    let appMapIcon = {
                        'opportunity.opportunity': "far fa-lightbulb",
                        'opportunity.opportunitymeeting': "fas fa-users",
                        'quotation.quotation': "fas fa-file-invoice-dollar",
                        'saleorder.saleorder': "fas fa-file-invoice",
                    }
                    return `<span class="badge ${appMapBadge[row?.['app_code']]}">
                                <span>
                                    <span class="icon"><span class="feather-icon"><small><i class="${appMapIcon[row?.['app_code']]}"></i></small></span></span>
                                    ${appMapTrans[row?.['app_code']]}
                                </span>
                            </span>`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<p class="text-primary">${row?.['title']}</p>`;
                },
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['date_activity'], {
                        'outputFormat': 'DD-MM-YYYY',
                    });
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    if (['opportunity.opportunity', 'opportunity.opportunitymeeting'].includes(row?.['app_code'])) {
                        return `<span>--</span>`;
                    }
                    return `<span class="mask-money" data-init-money="${parseFloat(row?.['revenue'] ? row?.['revenue'] : 0)}"></span>`;
                }
            },
        ],
        drawCallback: function () {
            // mask money
            $.fn.initMaskMoney2();
        },
    });
}


$(document).on('click', '#save-changes-modal-bank-account', function () {
    let bank_country_id = $('#country-select-box-id').val();
    let bank_name = $('#bank-name-id').val();
    let bank_code = $('#bank-code-id').val();
    let bank_account_name = $('#bank-account-name-id').val();
    let bank_account_number = $('#bank-account-number-id').val();
    let bic_swift_code = $('#bic-swift-code-id').val();

    if (bank_country_id !== '' && bank_name !== '' && bank_code !== '' && bank_account_name !== '' && bank_account_number !== '') {
        AddRow(bank_account_table, {
            'is_default': $('#make-default-bank-account').prop('checked'),
            'bank_account_name': bank_account_name,
            'bank_name': bank_name,
            'bank_account_number': bank_account_number,
            'bank_country_id': bank_country_id,
            'bank_code': bank_code,
            'bic_swift_code': bic_swift_code,
        })
        $('#modal-bank-account-information').hide();
    } else {
        $.fn.notifyB({description: "Missing value Banking Account."}, 'failure');
    }
})

$(document).on('click', '#save-changes-modal-credit-card', function () {
    let credit_card_type = $('#credit-card-type-select-box-id').val();
    let credit_card_number = $('#credit-card-number-id').val();
    let card_expired_date = $('#credit-card-exp-date').val();
    let credit_card_name = $('#credit-card-name-id').val();

    if (credit_card_type !== '' && credit_card_number !== '' && card_expired_date !== '' && credit_card_name !== '') {
        AddRow(credit_card_table, {
            'is_default': $('#make-default-credit-card').prop('checked'),
            'credit_card_type': credit_card_type,
            'credit_card_number': credit_card_number,
            'card_expired_date': card_expired_date,
            'credit_card_name': credit_card_name,
        })
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
    $.fn.callAjax2(combinesData).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $('#modal-add-new-contact').hide();
                let contact_mapped_list = [];
                $('#datatable_contact_list tbody').find('.selected_contact_full_name').each(function () {
                    contact_mapped_list.push($(this).attr('data-id'))
                })
                loadTableSelectContact(contact_mapped_list);
                $.fn.notifyB({description: "Successfully"}, 'success')
            }
        },
        (errs) => {
            console.log(errs)
            $.fn.notifyB({description: errs.data.errors}, 'failure');
        })
})
