let [
    accountName,
    accountCode,
    accountWebsite,
    accountTaxCode,
    inputPhone,
    inputEmail,
    accountTypeEle,
    accountManagerEle,
    accountOwnerEle,
    industryEle,
    accountGroupEle,
    totalEmployeeEle,
    annualRevenueEle,
    parentAccountEle,
    shippingCityEle,
    shippingDistrictEle,
    shippingWardEle,
    contactOwnerEle,
    inputOrganizationEle,
    inputIndividualEle,
    billingAddressEle
] = [
    $('#inp-account-name'),
    $('#inp-account-code'),
    $('#inp-account-website'),
    $('#inp-tax-code'),
    $('#inp-phone'),
    $('#inp-email'),
    $('#select-box-acc-type'),
    $('#select-box-acc-manager'),
    $('#select-box-contact'),
    $('#select-box-industry'),
    $('#select-box-account-group'),
    $('#select-box-total-emp'),
    $('#select-box-annual-revenue'),
    $('#select-box-parent-account'),
    $('#shipping-city'),
    $('#shipping-district'),
    $('#shipping-ward'),
    $('#select-box-contact-owner'),
    $('#inp-organization'),
    $('#inp-individual'),
    $('#select-box-address')
];

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

function loadAccountOwner(accountOwnerData) {
    accountOwnerEle.initSelect2({
        ajax: {
            url: accountOwnerEle.attr('data-url'),
            method: 'GET',
        },
        data: (accountOwnerData ? accountOwnerData : null),
        keyResp: 'contact_list_not_map_account',
        keyId: 'id',
        keyText: 'fullname',
    }).on('change', function () {
        let owner_selected = accountOwnerEle.val();
        if (owner_selected !== null) {
            let obj_owner = JSON.parse($('#' + accountOwnerEle.attr('data-idx-data-loaded')).text())[owner_selected];
            $('#job_title').val(obj_owner.job_title);
            let data = {
                'id': obj_owner.id,
                'job_title': obj_owner.job_title,
                'fullname': obj_owner.fullname,
                'mobile': obj_owner.mobile,
                'email': obj_owner.email,
                'owner': true
            }
            data_contact_mapped = [data];
            loadTableSelectedContact([data]);
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

function loadTotalEmployees() {
    totalEmployeeEle.initSelect2({
        data: {},
    })
}

function loadAnnualRevenue() {
    annualRevenueEle.initSelect2({
        data: {},
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

class AccountHandle {
    load() {
        loadAccountType();
        loadAccountManager();
        loadAccountOwner();
        loadIndustry();
        loadAccountGroup();
        loadTotalEmployees();
        loadAnnualRevenue();
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

$('#save-changes-modal-shipping-address').on('click', function () {
    let shipping_address_modal = $('#detail-modal-shipping-address');
    let shipping_city = $('#shipping-city');
    let shipping_district = $('#shipping-district');
    let shipping_ward = $('#shipping-ward');
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

$('#save-changes-modal-billing-address').on('click', function () {
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

let config = {
    scrollY: $(window).height() * 0.45,
    scrollCollapse: true,
    paging: false,
    drawCallback: function () {
        $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
    },
    data: [],
    columns: [{
        'data': 'fullname',
        render: (data, type, row) => {
            return `<a href="#"><span><b>` + row.fullname + `</b></span></a>`
        }
    }, {
        'data': 'job_title',
        render: (data, type, row) => {
            if (row.job_title) {
                return `<span>` + row.job_title + `</span>`
            }
            return ``
        }
    }, {
        'data': 'owner',
        render: (data, type, row) => {
            if (row.owner.fullname) {
                return `<span>` + row.owner.fullname + `</span>`
            }
            return ``
        }
    }, {
        'data': 'mobile',
        'render': (data, type, row) => {
            if (row.mobile) {
                return `<span>` + row.mobile + `</span>`
            }
            return ``
        }
    }, {
        'data': 'email',
        'render': (data, type, row) => {
            if (row.email) {
                return `<span>` + row.email + `</span>`
            }
            return ``
        }
    }, {
        'render': (data, type, row, meta) => {
            let currentId = "chk_sel_" + String(meta.row + 1)
            return `<span class="form-check mb-0"><input type="checkbox" class="contact-added form-check-input check-select" id="${currentId}" value=` + row.id + `></span>`;
        }
    }]
}

inputIndividualEle.on('change', function () {
    $('#select-box-parent-account').prop('selectedIndex', -1).attr('disabled', true);
    $("#tax-code-label").removeClass("required");
    $("#total_employees_label").removeClass("required");
})

inputOrganizationEle.on('change', function () {
    $('#select-box-parent-account').attr('disabled', false);
    $("#tax-code-label").addClass("required");
    $("#total_employees_label").addClass("required");
})

// Button add shipping address
$('#add-shipping-address-btn').on('click', function () {
    if ($('#list-shipping-address input').length === 0)
        $('#make-default-shipping-address').prop('checked', true);
})

// Button add billing address
$('#add-billing-address-btn').on('click', function () {
    let ele = $('#select-box-account-name')
    ele.html('');
    $('#edited-billing-address').val('').prop('hidden', true);
    billingAddressEle.prop('hidden', false);
    $('#button_add_new_billing_address').html(`<i class="fas fa-plus-circle"></i> Add/Edit`)

    $('#input-account-name').val(accountName.val());
    $('#inp-tax-code-address').val(accountTaxCode.val());
    $('#inp-email-address').val($('#inp-email').val());
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

// process address
billingAddressEle.on('change', function () {
    $('#edited-billing-address').val($(this).find('option:selected').text());
})

$('#button_add_new_billing_address').on('click', function () {
    if ($('#button_add_new_billing_address i').attr('class') === 'fas fa-plus-circle') {
        $(this).html(`<i class="bi bi-backspace-fill"></i> Select`);
        billingAddressEle.prop('hidden', true).prop('disabled', true);
        $('#edited-billing-address').prop('hidden', false);
    } else {
        $(this).html(`<i class="fas fa-plus-circle"></i> Add/Edit`)
        billingAddressEle.prop('hidden', false).prop('disabled', false);
        $('#edited-billing-address').prop('hidden', true);
    }
})

// show modal add new contact
$('#btn-add-new-contact').on('click', function () {
    let ele = $('#select-box-contact-owner');
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

function loadTableSelectContact() {
    account_owner_id = accountOwnerEle.val();
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

$('#add-contact-btn').on('click', function () {
    loadTableSelectContact();
})

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
            }, {
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

function checkSelectAll() {
    document.getElementById('check-select-all').checked = document.querySelectorAll('.selected_contact:checked').length === document.querySelectorAll('.selected_contact').length;
}

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
