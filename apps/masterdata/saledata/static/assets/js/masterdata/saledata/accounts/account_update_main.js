$(document).ready(function () {
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

                loadAccountGroup(data.account_group)

                loadIndustry(data.industry)

                loadAccountOwner(data.owner)
                $('#job_title').val(data.owner.job_title).css({color: 'black'});
                $('#owner-email').val(data.owner.email).css({color: 'black'});
                $('#owner-mobile').val(data.owner.mobile).css({color: 'black'});

                loadAccountManager(data.manager)

                loadParentAccount(data.parent_account)

                loadTableSelectedContact(data.contact_mapped);

                $.fn.initMaskMoney2();
            }
        })
})