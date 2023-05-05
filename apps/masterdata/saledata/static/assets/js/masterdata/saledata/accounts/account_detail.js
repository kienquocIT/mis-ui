$(document).ready(function () {
    // load data detail
    let pk = window.location.pathname.split('/').pop();
    let url_loaded = $('#form-detail-update-account').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['account_detail'];
                console.log(data);
                $('#account-title-id').val(data.name);
                $('#account-code-id').val(data.code);
                $('#account-website-id').val(data.website);
                $('#account-phone-number-id').val(data.phone);
                $('#account-email-id').val(data.email);
                $('#account-tax-code-id').val(data.tax_code);

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

                if ($.inArray("Customer", data.account_type.map(obj => obj.title)) !== -1) {
                    if ($.inArray("organization", data.account_type.map(obj => obj.detail)) !== -1) {
                        $('#inp-organization').attr('checked', true);
                        $("#account-tax-code-label-id").addClass("required");
                    }
                    if ($.inArray("individual", data.account_type.map(obj => obj.detail)) !== -1) {
                        $('#inp-individual').prop('checked', true);
                        $("#account-tax-code-label-id").removeClass("required");
                    }
                    $('#account-type-customer-type-div-id').prop('hidden', false);
                    $('#parent-account-div-id').prop('hidden', false);
                }
                else {
                    $('#account-type-customer-type-div-id').prop('hidden', true);
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
                    $('.del-address-item').prop('hidden', false);

                    $('#account-industry-id').select2();
                    $('#parent-account-id').select2();
                    $('#account-owner-id').select2();
                    $('#account-revenue-id').select2();
                    $('#total-employees-id').select2();

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

                loadAccountManager(data.manager.map(obj => obj.id))

                let current_owner = data.owner
                loadAccountOwner(current_owner)

                loadAccountGroup(data.account_group);

                loadPaymentTerms('payment_terms_mapped');

                loadPriceList('price_list_mapped');

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

    // condition to choosing ParentAccount
    $('#account-type-id').on('change', function () {
        let selected_acc_type = $('#account-type-id option:selected').filter(function () {
            return $(this).text().toLowerCase() === 'customer'
        })

        if (selected_acc_type.length > 0) {
            $('#parent-account-div-id').attr('hidden', false);
            $('#account-type-customer-type-div-id').attr('hidden', false);
        } else {
            $('#parent-account-div-id').attr('hidden', true);
            $('#account-type-customer-type-div-id').attr('hidden', true);
        }
    });

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

    // load Payment Terms SelectBox
    function loadPaymentTerms(payment_terms_mapped) {
        let ele = $('#payment-terms-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="0" selected></option>`)
                    if (data.hasOwnProperty('payment_terms_list') && Array.isArray(data.payment_terms_list)) {
                        data.payment_terms_list.map(function (item) {
                            if (payment_terms_mapped === item.id) {
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
                    ele.append(`<option value="0" selected></option>`)
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
    function loadAccountOwner(current_account_owner) {
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
                    if (data.hasOwnProperty('contact_list_not_map_account') && Array.isArray(data.contact_list_not_map_account)) {
                        if (Object.keys(current_account_owner).length > 0) {
                            data.contact_list_not_map_account.push(current_account_owner);
                        }
                        ele.append(`<option selected></option>`)
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
        select_box.append(`<option value="0" selected></option>`)
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
        select_box.append(`<option value="0" selected></option>`)

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

    // add new card bank account
    $('#save-changes-modal-bank-account').on('click', function () {
        let old_html = $('#list-bank-account-information').html();
        let bank_account_name = $('#bank-account-name-id').val();
        let bank_name = $('#bank-name-id').val();
        let bank_account_number = $('#bank-account-number-id').val();
        let is_default = '';
        if ($('#make-default-bank-account').is(':checked')) {
            is_default = 'checked';
        }
        let new_html = old_html + `<div class="card col-5 mr-3">
                                        <span class="mt-2">
                                            <div class="row">
                                                <div class="col-6">
                                                    <a class="btn-del-bank-account" href="#"><i class="bi bi-x"></i></a>
                                                </div>
                                                <div class="col-6 text-right">
                                                    <input class="form-check-input" type="radio" name="bank-account-select-default"` + is_default + `>
                                                </div>
                                            </div>
                                        </span>
                                        <label class="ml-3">Bank account name: <a href="#"><b>` + bank_account_name + `</b></a></label>
                                        <label class="ml-3">Bank name: <a href="#"><b>` + bank_name + `</b></a></label>
                                        <label class="ml-3 mb-3">Bank account number: <a href="#"><b>` + bank_account_number + `</b></a></label>
                                    </div>`
        $('#list-bank-account-information').html(new_html);
        $('#modal-bank-account-information').hide();

        // delete bank account item
        $('.btn-del-bank-account').on('click', function () {
            $(this).closest('.card').remove()
        })
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

        let customer_detail_type = $('#account-type-id option:selected').filter(function () {
            return $(this).text().toLowerCase() === 'customer';
        })

        if (customer_detail_type.length > 0) {
            if ($('#inp-organization').is(':checked')) {
                frm.dataForm['customer_detail_type'] = 'organization';
            } else {
                frm.dataForm['customer_detail_type'] = 'individual';
            }
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

        if (shipping_address_list.length > 0) {
            frm.dataForm['shipping_address'] = shipping_address_list;
        }

        if (billing_address_list.length > 0) {
            frm.dataForm['billing_address'] = billing_address_list;
        }

        if (frm.dataForm['parent_account'] === '') {
            frm.dataForm['parent_account'] = null;
        }

        if ($('#account-owner-id').val() === '') {
            frm.dataForm['account-owner'] = null;
        }

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
                    // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    });
})

// delete credit card item
$('.btn-del-credit-card').on('click', function () {
            $(this).closest('.card').remove()
        })
