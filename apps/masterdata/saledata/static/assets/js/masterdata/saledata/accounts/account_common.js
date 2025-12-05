/**
 * Khai báo các element trong page
 */
class AccountPageElements {
    constructor() {
        // info
        this.$organization = $('#inp-organization')
        this.$individual = $('#inp-individual')
        this.$tax_code_label = $("#tax-code-label")
        this.$tax_code = $('#inp-tax-code')
        this.$name_label = $("#name-label")
        this.$name = $('#inp-name')
        this.$code_label = $("#code-label")
        this.$code = $('#inp-code')
        this.$website = $('#inp-website')
        this.$phone = $('#inp-phone')
        this.$email = $('#inp-email')
        this.$industry = $('#slb-industry')
        this.$annual_revenue = $('#slb-annual-revenue')
        this.$total_employee = $('#slb-total-employee')
        this.$account_group = $('#slb-account-group')
        this.$account_manager = $('#slb-account-manager')
        this.$currency = $('#currency')
        this.$account_type = $('#slb-account-type')
        this.$parent_account = $('#slb-parent-account')
        // tab contact
        this.$contact_list_table = $('#contact-list-table')
        this.$select_contact_btn = $('#select-contact-btn')
        this.$contact_selected_table_noti = $('#select-contact-table-noti')
        this.$add_contact_btn = $('#add-contact-btn')
        this.$add_contact_table = $('#add-contact-table')
        // tab shipping address
        this.$shipping_address_table = $('#shipping-address-table')
        this.$add_shipping_address_btn = $('#add-shipping-address-btn')
        this.$modal_shipping_address = $('#modal-shipping-address')
        this.$shipping_address_detail = $('#shipping-address-detail')
        this.$default_shipping_address = $('#default-shipping-address')
        this.$save_modal_shipping_address = $('#save-modal-shipping-address')
        // tab billing address
        this.$billing_address_table = $('#billing-address-table')
        this.$add_billing_address_btn = $('#add-billing-address-btn')
        this.$modal_billing_address = $('#modal-billing-address')
        this.$change_billing_address = $('#change-billing-address')
        this.$edit_billing_address = $('#edited-billing-address')
        this.$billing_address_slb = $('#slb-billing-address')
        this.$default_billing_address = $('#default-billing-address')
        this.$save_modal_billing_address = $('#save-modal-billing-address')
        // tab payment term
        this.$role_for_customer_space = $('#role-for-customer-space')
        this.$for_customer_payment_term = $('#for-customer-payment-terms')
        this.$for_customer_price_list = $('#for-customer-price-list')
        this.$for_customer_credit_limit = $('#for-customer-credit-limit')
        this.$role_for_supplier_space = $('#role-for-supplier-space')
        this.$for_supplier_payment_term = $('#for-supplier-payment-term')
        this.$for_supplier_credit_limit = $('#for-supplier-credit-limit')
        this.$bank_account_table = $('#bank-account-table')
        this.$bank_account_country = $('#slb-bank-account-country')
        this.$save_modal_bank_account = $('#save-modal-bank-account')
        this.$credit_card_table = $('#credit-card-table')
        this.$save_modal_credit_card = $('#save-modal-credit-card')
        // tab activity
        this.$datable_account_activity = $('#datable-account-activity')
    }
}
const pageElements = new AccountPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class AccountPageVariables {
    constructor() {
        this.current_owner = {}
        this.current_contact_mapped = []
    }
}
const pageVariables = new AccountPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class AccountPageFunction {
    // info
    static async CheckTaxCode() {
    if (pageElements.$tax_code.val()) {
        try {
            let response = await fetch(`https://api.vietqr.io/v2/business/${pageElements.$tax_code.val()}`);
            if (!response.ok) {
                return [false, {desc: 'Network response was not ok'}];
            }
            let responseData = await response.json();
            if (responseData.code === '00') {
                return [true, responseData];
            } else {
                return [false, responseData];
            }
        } catch (error) {
            $.fn.notifyB({description: 'Can not get this Tax number information'}, 'failure');
            return [false, {}];
        }
    }
}
    static LoadCurrency(currencyData) {
        pageElements.$currency.initSelect2({
            ajax: {
                url: pageElements.$currency.attr('data-url'),
                method: 'GET',
            },
            data: (currencyData ? currencyData : null),
            keyResp: 'currency_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static OnChangeAccountTypeRadio(type='') {
    if (type === 'individual') {
        pageElements.$tax_code_label.removeClass("required")
        pageElements.$parent_account.attr('disabled', true)
        pageElements.$name_label.text(pageElements.$name_label.attr('data-trans-individual'))
        pageElements.$code_label.text(pageElements.$code_label.attr('data-trans-individual'))
        pageElements.$name.prop('readonly', true)
        pageElements.$phone.prop('readonly', true)
        pageElements.$email.prop('readonly', true)
        pageElements.$total_employee.prop('disabled', true)
        pageElements.$contact_selected_table_noti.prop('hidden', false)
    }
    if (type === 'organization') {
        pageElements.$tax_code_label.addClass("required")
        pageElements.$parent_account.attr('disabled', false)
        pageElements.$name_label.text(pageElements.$name_label.attr('data-trans-organization'))
        pageElements.$code_label.text(pageElements.$code_label.attr('data-trans-organization'))
        pageElements.$name.prop('readonly', false)
        pageElements.$phone.prop('readonly', false)
        pageElements.$email.prop('readonly', false)
        pageElements.$total_employee.prop('disabled', false)
        pageElements.$contact_selected_table_noti.prop('hidden', true)
    }
}
    // tab contact
    static LoadTableSelectContact(data_list=[]) {
        pageElements.$add_contact_table.DataTable().clear().destroy();
        pageElements.$add_contact_table.DataTableDefault({
            styleDom: 'hide-foot',
            useDataServer: true,
            rowIdx: true,
            paging: false,
            scrollX: true,
            scrollY: '64vh',
            scrollCollapse: true,
            ajax: {
                url: pageElements.$add_contact_table.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('contact_list_not_map_account')) {
                        let res = data?.['contact_list_not_map_account'];
                        for (let i = 0; i < res.length; i++) {
                            res[i]['is_checked'] = data_list.includes(res[i]?.['id']) ? 'checked' : '';
                        }
                        return res
                    }
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
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
                        return `<span class="badge badge-outline badge-light mr-1">${row?.['owner']?.['code'] ? row?.['owner']?.['code'] : ''}</span><span>${row?.['owner']?.['fullname'] ? row?.['owner']?.['fullname'] : ''}</span>`
                    }
                },
                {
                    className: 'w-5 text-center',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input type="checkbox" class="form-check-input selected_contact"
                                        ${row?.['is_checked']}
                                        data-id="${row?.['id']}"
                                        data-code="${row?.['code']}"
                                        data-fullname="${row?.['fullname']}"
                                        data-mobile="${row?.['mobile'] || ''}"
                                        data-email="${row?.['email'] || ''}"
                                        data-job-title="${row?.['job_title'] || ''}">
                                    <label class="form-check-label"></label>
                                </span>`
                    }
                },
            ],
        })
    }
    static LoadTableContactMapped(data_list=[], option='') {
        pageElements.$contact_list_table.DataTable().clear().destroy();
        pageElements.$contact_list_table.DataTableDefault({
            styleDom: 'hide-foot',
            useDataServer: false,
            rowIdx: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    data: 'fullname',
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<span class="badge badge-outline badge-primary mr-1">${row?.code}</span><span class="text-muted selected_contact_full_name" data-id="${row?.id}">${row?.fullname}</span>`
                    }
                },
                {
                    data: 'job_title',
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="text-secondary">${row?.job_title || ''}</span>`
                    }
                },
                {
                    data: 'mobile',
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="text-secondary">${row?.mobile || ''}</span>`
                    }
                },
                {
                    data: 'email',
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="text-secondary">${row?.email || ''}</span>`
                    }
                },
                {
                    className: 'w-20 text-center',
                    render: (data, type, row) => {
                        let disabled = '';
                        if (option === 'detail' || pageElements.$individual.prop('checked')) {
                            disabled = 'disabled';
                        }
                        if (row?.['is_account_owner'] || pageVariables.current_owner?.['id'] === row?.['id']) {
                            return `<div class="form-check form-switch"><input ${disabled} checked name="is_account_owner_radio" type="checkbox" data-id="${row?.id}" class="form-check-input is_account_owner"></div>`;
                        }
                        else {
                            return `<div class="form-check form-switch"><input ${disabled} name="is_account_owner_radio" type="checkbox" data-id="${row?.id}" class="form-check-input is_account_owner"></div>`;
                        }
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: () => {
                        return `<span><a ${option === 'detail' ? 'hidden' : ''} href="#" class="text-danger del-row"><i class="bi bi-trash"></i></a></span>`
                    }
                }
            ],
        })
    }
    // tab shipping
    static LoadTableShippingAddress(data=[], option='') {
        pageElements.$shipping_address_table.DataTable().clear().destroy()
        pageElements.$shipping_address_table.DataTableDefault({
            dom: '',
            styleDom: 'hide-foot',
            rowIdx: true,
            paging: false,
            data: data,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input ${option === 'detail' ? 'disabled' : ''} type="radio" class="form-check-input shippingaddressRadio" name="shippingaddressRadio" ${row?.['is_default'] ? 'checked' : ''}>
                                </span>
                                <script class="address_data">${JSON.stringify(row?.['address_data'] || {})}</script>`
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
                    render: () => {
                        return `<span><a href="#" ${option === 'detail' ? 'hidden' : ''} class="text-muted del-row"><i class="bi bi-trash"></i></a></span>`
                    }
                }
            ],
        })
    }
    // tab billing
    static LoadCountries(countriesData) {
        pageElements.$bank_account_country.initSelect2({
            ajax: {
                url: pageElements.$bank_account_country.attr('data-url'),
                method: 'GET',
            },
            data: (countriesData ? countriesData : null),
            keyResp: 'countries',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadTableBillingAddress(data=[], option='') {
        pageElements.$billing_address_table.DataTable().clear().destroy()
        pageElements.$billing_address_table.DataTableDefault({
            dom: '',
            styleDom: 'hide-foot',
            rowIdx: true,
            paging: false,
            data: data,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input ${option === 'detail' ? 'disabled' : ''} type="radio" class="form-check-input" name="billingaddressRadio" ${row?.['is_default'] ? 'checked' : ''}></span>
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
                    render: () => {
                        return `<span><a ${option === 'detail' ? 'hidden' : ''} href="#" class="text-muted del-row"><i class="bi bi-trash"></i></a></span>`
                    }
                }
            ],
        })
    }
    // tab payment
    static LoadTableBankAccount(data=[], option='') {
        pageElements.$bank_account_table.DataTable().clear().destroy()
        pageElements.$bank_account_table.DataTableDefault({
            dom: '',
            styleDom: 'hide-foot',
            rowIdx: true,
            paging: false,
            data: data,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input ${option === 'detail' ? 'disabled' : ''} class="radio_select_default_bank_account form-check-input" name="bank_account_default" type="radio" ${row?.['is_default'] ? 'checked' : ''}></span>
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
                    render: () => {
                        return `<span><a ${option === 'detail' ? 'hidden' : ''} href="#" class="text-muted del-row"><i class="bi bi-trash"></i></a></span>`
                    }
                }
            ],
        })
    }
    static LoadTableCreditCard(data=[], option='') {
        pageElements.$credit_card_table.DataTable().clear().destroy()
        pageElements.$credit_card_table.DataTableDefault({
            dom: '',
            styleDom: 'hide-foot',
            rowIdx: true,
            paging: false,
            data: data,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ''
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input ${option === 'detail' ? 'disabled' : ''} class="radio_select_default_credit_card form-check-input" name="credit_card_default" type="radio" ${row?.['is_default'] ? 'checked' : ''}></span>
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
                    render: () => {
                        return `<span><a ${option === 'detail' ? 'hidden' : ''} href="#" class="text-muted del-row"><i class="bi bi-trash"></i></a></span>`
                    }
                }
            ],
        })
    }
    static LoadPaymentTermForCustomer(paymentTermData) {
        pageElements.$for_customer_payment_term.initSelect2({
            ajax: {
                url: pageElements.$for_customer_payment_term.attr('data-url'),
                method: 'GET',
            },
            data: (paymentTermData ? paymentTermData : null),
            keyResp: 'payment_terms_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadPaymentTermForSupplier(paymentTermData) {
        pageElements.$for_supplier_payment_term.initSelect2({
            ajax: {
                url: pageElements.$for_supplier_payment_term.attr('data-url'),
                method: 'GET',
            },
            data: (paymentTermData ? paymentTermData : null),
            keyResp: 'payment_terms_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadPriceListForCustomer(priceListCustomerData) {
        pageElements.$for_customer_price_list.initSelect2({
            ajax: {
                url: pageElements.$for_customer_price_list.attr('data-url'),
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
    // tab activity
    static LoadDataTableActivity(data) {
        let transEle = $('#app-trans-factory');
        pageElements.$datable_account_activity.DataTableDefault({
            data: data ? data : [],
            rowIdx: true,
            columns: [
                {
                    targets: 0,
                    render: () => {
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
    // combine data support
    static get_bank_accounts_information() {
        let bank_accounts_information = [];
        pageElements.$bank_account_table.find('tbody tr').each(function () {
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
    static get_credit_cards_information() {
        let credit_cards_information = [];
        pageElements.$credit_card_table.find('tbody tr').each(function () {
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
    static get_shipping_address() {
        let shipping_address = [];
        $('#shipping-address-table tbody tr').each(function (index, ele) {
            if ($(ele).find('.dataTables_empty').length === 0) {
                shipping_address.push({
                    'full_address': $(ele).find('.shipping_address_full_address').text(),
                    'is_default': $(ele).find('.shippingaddressRadio').prop('checked'),
                    'address_data': $(ele).find('.address_data').text() ? JSON.parse($(ele).find('.address_data').text()) : {}
                })
            }
        })
        return shipping_address;
    }
    static get_billing_address() {
        let billing_address = [];
        $('#billing-address-table tbody tr').each(function () {
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
    static get_contacts_mapped() {
        let contact_mapped_list = [];
        $('#contact-list-table tbody .is_account_owner').each(function () {
            if ($(this).attr('data-id')) {
                contact_mapped_list.push({
                    'id': $(this).attr('data-id'),
                    'is_account_owner': $(this).is(':checked')
                })
            }
        })
        return contact_mapped_list;
    }
}

/**
 * Khai báo các hàm chính
 */
class AccountHandler {
    static CombinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['name'] = pageElements.$name.val();
        frm.dataForm['code'] = pageElements.$code.val();
        frm.dataForm['website'] = pageElements.$website.val();
        frm.dataForm['account_type'] = pageElements.$account_type.val();
        frm.dataForm['account_type_selection'] = pageElements.$organization.is(':checked') ? 1 : 0;
        frm.dataForm['account_group'] = pageElements.$account_group.val() ? pageElements.$account_group.val() : null
        frm.dataForm['manager'] = pageElements.$account_manager.val();
        frm.dataForm['parent_account_mapped'] = pageElements.$parent_account.val() ? pageElements.$parent_account.val() : null
        frm.dataForm['annual_revenue'] = pageElements.$annual_revenue.val() ? pageElements.$annual_revenue.val() : null
        frm.dataForm['total_employees'] = pageElements.$total_employee.val() ? pageElements.$total_employee.val() : null
        frm.dataForm['tax_code'] = pageElements.$tax_code.val() === '#' ? '' : pageElements.$tax_code.val();
        frm.dataForm['industry'] = pageElements.$industry.val() ? pageElements.$industry.val() : null
        frm.dataForm['phone'] = pageElements.$phone.val();
        frm.dataForm['email'] = pageElements.$email.val();
        frm.dataForm['currency'] = pageElements.$currency.val() ? pageElements.$currency.val() : null

        frm.dataForm['contact_mapped'] = AccountPageFunction.get_contacts_mapped()
        frm.dataForm['shipping_address_dict'] = AccountPageFunction.get_shipping_address()
        frm.dataForm['billing_address_dict'] = AccountPageFunction.get_billing_address()
        frm.dataForm['system_status'] = 1; // save, not draft

        let url_return = frm.dataUrl;

        if (for_update === true) {
            frm.dataForm['bank_accounts_information'] = AccountPageFunction.get_bank_accounts_information()
            frm.dataForm['credit_cards_information'] = AccountPageFunction.get_credit_cards_information()

            if (pageElements.$for_customer_payment_term.val()) {
                frm.dataForm['payment_term_customer_mapped'] = pageElements.$for_customer_payment_term.val() ? pageElements.$for_customer_payment_term.val() : null
            }
            if (pageElements.$for_customer_price_list.val()) {
                frm.dataForm['price_list_mapped'] = pageElements.$for_customer_price_list.val() ? pageElements.$for_customer_price_list.val() : null
            }
            if (pageElements.$for_customer_credit_limit.attr('value')) {
                frm.dataForm['credit_limit_customer'] = pageElements.$for_customer_credit_limit.attr('value');
            }
            if (pageElements.$for_supplier_payment_term.val()) {
                frm.dataForm['payment_term_supplier_mapped'] = pageElements.$for_supplier_payment_term.val() ? pageElements.$for_supplier_payment_term.val() : null
            }
            if (pageElements.$for_supplier_credit_limit.attr('value')) {
                frm.dataForm['credit_limit_supplier'] = pageElements.$for_supplier_credit_limit.attr('value');
            }

            let pk = $.fn.getPkDetail()
            url_return = frm.dataUrl.format_url_with_uuid(pk);
        }

        // console.log(frm.dataForm)

        return {
            url: url_return,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
    static LoadDetail(option) {
        let pk = $.fn.getPkDetail()
        let url_loaded = $('#form-detail-update-account').attr('data-url').replace(0, pk);
        $.fn.callAjax(url_loaded, 'GET').then(
            async (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.compareStatusShowPageAction(data);
                    let account_detail = data['account_detail'];
                    // console.log(account_detail)

                    pageElements.$name.val(account_detail?.['name']);
                    pageElements.$code.val(account_detail?.['code']).prop('readonly', true).addClass('form-control-line fw-bold');
                    pageElements.$website.val(account_detail?.['website']);
                    pageElements.$phone.val(account_detail?.['phone']);
                    pageElements.$email.val(account_detail?.['email']);
                    pageElements.$tax_code.val(account_detail?.['tax_code']);

                    if (account_detail?.['account_type_selection'] === 0) {
                        pageElements.$individual.prop('checked', true)
                        AccountPageFunction.OnChangeAccountTypeRadio('individual')
                    }
                    else {
                        pageElements.$organization.prop('checked', true)
                        AccountPageFunction.OnChangeAccountTypeRadio('organization')
                    }

                    pageElements.$total_employee.val(account_detail?.['total_employees'])
                    pageElements.$annual_revenue.val(account_detail?.['annual_revenue'])

                    UsualLoadPageFunction.LoadAccountType({
                        element: pageElements.$account_type,
                        data: account_detail?.['account_type']
                    })

                    for (let i = 0; i < (account_detail?.['account_type'] || []).length; i++) {
                        if (account_detail?.['account_type'][i]?.['code'] === 'AT001') {
                            pageElements.$role_for_customer_space.prop('hidden', false);
                        }
                        if (account_detail?.['account_type'][i]?.['code'] === 'AT002') {
                            pageElements.$role_for_supplier_space.prop('hidden', false);
                        }
                    }

                    UsualLoadPageFunction.LoadAccountGroup({
                        element: pageElements.$account_group,
                        data: account_detail?.['account_group']
                    })

                    UsualLoadPageFunction.LoadIndustry({
                        element: pageElements.$industry,
                        data: account_detail?.['industry'],
                        allowClear: true
                    })

                    UsualLoadPageFunction.LoadEmployee({
                        element: pageElements.$account_manager,
                        data: account_detail?.['manager']
                    })

                    UsualLoadPageFunction.LoadAccount({
                        element: pageElements.$parent_account,
                        data: account_detail?.['parent_account_mapped'],
                        allowClear: true
                    })

                    for (let i = 0; i < (account_detail?.['contact_mapped'] || []).length; i++) {
                        if (account_detail?.['contact_mapped'][i]?.['is_account_owner']) {
                            pageVariables.current_owner = account_detail?.['contact_mapped'][i];
                            break
                        }
                    }

                    // For Detail
                    $('#revenue-ytd').attr('data-init-money', account_detail?.['revenue_information']?.['revenue_ytd'])
                    $('#no-order').text(account_detail?.['revenue_information']?.['order_number'])
                    $('#revenue-avg').attr('data-init-money', account_detail?.['revenue_information']?.['revenue_average'])
                    AccountPageFunction.LoadTableContactMapped(account_detail?.['contact_mapped'] || [], option);
                    pageVariables.current_contact_mapped = account_detail?.['contact_mapped']
                    AccountPageFunction.LoadTableShippingAddress(account_detail?.['shipping_address'] || [], option);
                    AccountPageFunction.LoadTableBillingAddress(account_detail?.['billing_address'] || [], option);

                    AccountPageFunction.LoadCurrency(account_detail?.['currency'])
                    AccountPageFunction.LoadPaymentTermForCustomer(account_detail?.['payment_term_customer_mapped'] || {})
                    AccountPageFunction.LoadPaymentTermForSupplier(account_detail?.['payment_term_supplier_mapped'] || {})
                    AccountPageFunction.LoadPriceListForCustomer(account_detail?.['price_list_mapped'])
                    $('#for-customer-credit-limit').attr('value', account_detail?.['credit_limit_customer']);
                    $('#for-supplier-credit-limit').attr('value', account_detail?.['credit_limit_supplier']);
                    AccountPageFunction.LoadCountries();
                    AccountPageFunction.LoadTableBankAccount(account_detail?.['bank_accounts_mapped'] || [], option);
                    AccountPageFunction.LoadTableCreditCard(account_detail?.['credit_cards_mapped'] || [], option);

                    $.fn.initMaskMoney2();

                    // load activity
                    AccountPageFunction.LoadDataTableActivity(account_detail?.['activity']);

                    UsualLoadPageFunction.DisablePage(
                        option==='detail',
                        ['#view-tax-code-info']
                    );
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class AccountEventHandler {
    static InitPageEven() {
        $(document).on('click', '.del-row', function () {
            UsualLoadPageFunction.DeleteTableRow(
                $(this).closest('table'),
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
        })
        // info
        $('input[name="account-type-radio"]').on('change', function () {
            AccountPageFunction.LoadTableContactMapped()
            AccountPageFunction.OnChangeAccountTypeRadio(pageElements.$individual.prop('checked') ? 'individual' : 'organization')
        })
        pageElements.$tax_code.on('change', async function () {
            if ($.fn.getPkDetail() === 'None') {
                let [tax_code_status, responseData] = await AccountPageFunction.CheckTaxCode()
                $('#invalid-tax').prop('hidden', tax_code_status)
                $('#valid-tax').prop('hidden', !tax_code_status)
                pageElements.$name.val(responseData?.['data']?.['name'])
            }
        })
        $('#view-tax-code-info').on('click', async function () {
            if (pageElements.$tax_code.val()) {
                let [tax_code_status, responseData] = await AccountPageFunction.CheckTaxCode()
                $('#invalid-tax').prop('hidden', tax_code_status)
                $('#valid-tax').prop('hidden', !tax_code_status)
                if (tax_code_status) {
                    $('#tax-code-info-international-name').val(responseData?.['data']?.['internationalName'])
                    $('#tax-code-info-name').val(responseData?.['data']?.['name'])
                    $('#tax-code-info-short-name').val(responseData?.['data']?.['shortName'])
                    $('#tax-code-info-tax-code').val(responseData?.['data']?.['id'])
                    $('#tax-code-info-address').val(responseData?.['data']?.['address'])
                } else {
                    Swal.fire({
                        html: `<p class="text-danger mt-3">${responseData.desc}</p>`,
                        customClass: {
                            confirmButton: 'btn btn-xs btn-secondary',
                            cancelButton: 'btn btn-xs btn-secondary',
                        },
                        showCancelButton: false,
                        buttonsStyling: false,
                        confirmButtonText: 'Cancel',
                        cancelButtonText: 'No',
                        reverseButtons: false
                    })
                }
            }
        })
        pageElements.$account_type.on('change', function () {
            let account_type_title_selected = [];
            pageElements.$account_type.find('option:selected').each(function () {
                account_type_title_selected.push($(this).text().toLowerCase())
            })
            pageElements.$role_for_customer_space.prop('hidden', !account_type_title_selected.includes('customer'));
            pageElements.$role_for_supplier_space.prop('hidden', !account_type_title_selected.includes('supplier'));
        })
        // tab contact
        $('#check-select-all').on('click', function () {
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
        })
        pageElements.$select_contact_btn.on('click', function () {
            let contact_mapped_list = [];
            $('#contact-list-table tbody').find('.selected_contact_full_name').each(function () {
                contact_mapped_list.push($(this).attr('data-id'))
            })
            AccountPageFunction.LoadTableSelectContact(contact_mapped_list);
        })
        pageElements.$add_contact_btn.on('click', function () {
            AccountPageFunction.LoadTableContactMapped()
            let contact_selected = []
            document.querySelectorAll('.selected_contact').forEach(function (element) {
                if (element.checked) {
                    contact_selected.push({
                        'id': element.getAttribute('data-id'),
                        'job_title': element.getAttribute('data-job-title'),
                        'code': element.getAttribute('data-code'),
                        'fullname': element.getAttribute('data-fullname'),
                        'mobile': element.getAttribute('data-mobile'),
                        'email': element.getAttribute('data-email'),
                        'is_account_owner': false,
                    })
                }
            })

            contact_selected = pageVariables.current_contact_mapped.concat(contact_selected)
            if (pageElements.$individual.prop('checked')) {
                if (contact_selected.length !== 1) {
                    $.fn.notifyB({description: "You can not select more than ONE contact for Individual account."}, 'failure');
                }
                else {
                    for (let i = 0; i < contact_selected.length; i++) {
                        contact_selected[i]['is_account_owner'] = true
                        UsualLoadPageFunction.AddTableRow(pageElements.$contact_list_table, contact_selected[i])
                        pageElements.$name.val(contact_selected[i]?.['fullname'])
                        pageElements.$phone.val(contact_selected[i]?.['mobile'])
                        pageElements.$email.val(contact_selected[i]?.['email'])
                    }
                    $('#offcanvas_SelectContact').offcanvas('hide')
                }
            }
            else {
                for (let i = 0; i < contact_selected.length; i++) {
                    UsualLoadPageFunction.AddTableRow(pageElements.$contact_list_table, contact_selected[i])
                }
                $('#offcanvas_SelectContact').offcanvas('hide')
            }
        })
        $(document).on('change', '.is_account_owner', function () {
            let row_data_id = $(this).attr('data-id')
            pageElements.$contact_list_table.find('tbody tr .is_account_owner').each(function () {
                if ($(this).attr('data-id') !== row_data_id) {
                    $(this).prop('checked', false)
                }
            })
        })
        $('#frm-create-new-contact').submit(function (event) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'})
            event.preventDefault();
            let combinesData = {
                url: $(this).attr('data-url'),
                method: $(this).attr('data-method'),
                data: {
                    'owner': $('#slb-contact-owner').val(),
                    'fullname': $('#contact-fullname').val(),
                    'job_title': $('#contact-job-title').val(),
                    'email': $('#contact-email').val(),
                    'phone': $('#contact-phone').val(),
                    'mobile': $('#contact-mobile').val()
                },
            }
            $.fn.callAjax2(combinesData).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $('#modal-add-new-contact').hide();
                        let selected_contact = [];
                        pageElements.$add_contact_table.find('tbody .selected_contact').each(function () {
                            if ($(this).prop('checked')) {
                                selected_contact.push($(this).attr('data-id'))
                            }
                        })
                        AccountPageFunction.LoadTableSelectContact(selected_contact);
                        WindowControl.hideLoading()
                    }
                },
                (errs) => {
                    console.log(errs)
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                    WindowControl.hideLoading()
                })
        })
        // tab shipping
        pageElements.$add_shipping_address_btn.on('click', function () {
            if ($('#shipping-address-table input').length === 0) {
                pageElements.$default_shipping_address.prop('checked', true).prop('disabled', true);
            }
            else {
                pageElements.$default_shipping_address.prop('checked', false).prop('disabled', false);
            }
        })
        pageElements.$save_modal_shipping_address.on('click', function () {
            try {
                let shipping_address_detail = $('#modal-shipping-address .location_detail_address').val()
                let shipping_country = $('#modal-shipping-address .location_country').find(`option:selected`).text()
                let shipping_province = $('#modal-shipping-address .location_province').find(`option:selected`).text()
                let shipping_ward = $('#modal-shipping-address .location_ward').find(`option:selected`).text()

                let country_id = $('#modal-shipping-address .location_country').val()
                let province_id = $('#modal-shipping-address .location_province').val()
                let ward_id = $('#modal-shipping-address .location_ward').val()

                let full_address = '';
                if (country_id && province_id && ward_id && shipping_address_detail) {
                    full_address = `${shipping_address_detail}, ${shipping_ward}, ${shipping_province}, ${shipping_country}`
                    pageElements.$modal_shipping_address.modal('hide');
                    pageElements.$shipping_address_detail.val('');
                } else {
                    $.fn.notifyB({description: "Missing address information!"}, 'failure');
                }

                if (full_address) {
                    UsualLoadPageFunction.AddTableRow(
                        pageElements.$shipping_address_table,
                        {
                            'full_address': full_address,
                            'is_default': pageElements.$default_shipping_address.prop('checked'),
                            'address_data': {
                                'country_id': country_id,
                                'province_id': province_id,
                                'ward_id': ward_id,
                                'detail_address': shipping_address_detail,
                            }
                        }
                    )
                }
            } catch (error) {
                $.fn.notifyB({description: "No address information!"}, 'failure');
            }
        })
        // tab billing
        pageElements.$add_billing_address_btn.on('click', function () {
            let ele = $('#select-box-account-name')
            ele.html('');
            pageElements.$edit_billing_address.val('').prop('hidden', true);
            pageElements.$billing_address_slb.prop('hidden', false);
            pageElements.$change_billing_address.html(`<i class="fas fa-plus-circle"></i> Add/Edit`)

            $('#billing-account-name').val(pageElements.$name.val());
            $('#billing-tax-code').val(pageElements.$tax_code.val());
            $('#billing-email').val(pageElements.$email.val());
            ele.prepend(`<option value="">` + pageElements.$name.val() + `</option>`)

            if ($('#billing-address-table input').length === 0)
                $('#default-billing-address').prop('checked', true);

            pageElements.$billing_address_slb.empty();
            pageElements.$billing_address_slb.append(`<option value="0" selected></option>`)
            pageElements.$shipping_address_table.find('.shipping_address_full_address').each(function () {
                if ($(this).closest('tr').find('input[type="radio"]').is(':checked') === true)
                    pageElements.$billing_address_slb.append(`<option selected>` + $(this).text() + `</option>`)
                else
                    pageElements.$billing_address_slb.append(`<option>` + $(this).text() + `</option>`)
            });
        })
        pageElements.$save_modal_billing_address.on('click', function () {
            try {
                let billing_account_name = $('#billing-account-name').val();
                let billing_email = $('#billing-email').val();
                let billing_tax_code = $('#billing-tax-code').val();

                let account_address = pageElements.$billing_address_slb.val();
                if (pageElements.$billing_address_slb.is(':hidden')) {
                    account_address = pageElements.$edit_billing_address.val()
                }
                let full_address = '';
                if (billing_email && billing_tax_code && account_address !== '0') {
                    full_address = `${billing_account_name}, ${account_address} (email: ${billing_email}, tax code: ${billing_tax_code})`
                    pageElements.$modal_billing_address.modal('hide');
                } else {
                    $.fn.notifyB({description: "Missing address information!"}, 'failure');
                }
                if (full_address) {
                    UsualLoadPageFunction.AddTableRow(
                        pageElements.$billing_address_table,
                        {
                            'is_default': pageElements.$default_billing_address.prop('checked'),
                            'account_name': billing_account_name,
                            'email': billing_email,
                            'tax_code': billing_tax_code,
                            'account_address': account_address,
                            'full_address': full_address
                        }
                    )
                }
            } catch (error) {
                $.fn.notifyB({description: "No address information!"}, 'failure');
            }
        })
        pageElements.$billing_address_slb.on('change', function () {
            pageElements.$edit_billing_address.val($(this).find('option:selected').text());
        })
        pageElements.$change_billing_address.on('click', function () {
            if ($('#change-billing-address i').attr('class') === 'fas fa-plus-circle') {
                $(this).html(`<i class="bi bi-backspace-fill"></i> Select`);
                pageElements.$billing_address_slb.prop('hidden', true).prop('disabled', true);
                pageElements.$edit_billing_address.prop('hidden', false);
            } else {
                $(this).html(`<i class="fas fa-plus-circle"></i> Add/Edit`)
                pageElements.$billing_address_slb.prop('hidden', false).prop('disabled', false);
                pageElements.$edit_billing_address.prop('hidden', true);
            }
        })
        // tab payment
        pageElements.$save_modal_bank_account.on('click', function () {
            let bank_country_id = $('#slb-bank-account-country').val()
            let bank_name = $('#bank-name').val()
            let bank_code = $('#bank-code').val()
            let bank_account_name = $('#bank-account-name').val()
            let bank_account_number = $('#bank-account-number').val()
            let bic_swift_code = $('#bic-swift-code').val()
            let is_default = $('#default-bank-account').prop('checked')

            if (bank_country_id && bank_name && bank_code && bank_account_name && bank_account_number) {
                UsualLoadPageFunction.AddTableRow(pageElements.$bank_account_table, {
                    'is_default': is_default,
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
        pageElements.$save_modal_credit_card.on('click', function () {
            let credit_card_type = $('#slb-credit-card-type').val()
            let credit_card_number = $('#credit-card-number').val()
            let card_expired_date = $('#credit-card-exp-date').val()
            let credit_card_name = $('#credit-card-name').val()
            let is_default = $('#default-credit-card').prop('checked')

            if (credit_card_type && credit_card_number && card_expired_date && credit_card_name) {
                UsualLoadPageFunction.AddTableRow(
                    pageElements.$credit_card_table,
                    {
                        'is_default': is_default,
                        'credit_card_type': credit_card_type,
                        'credit_card_number': credit_card_number,
                        'card_expired_date': card_expired_date,
                        'credit_card_name': credit_card_name,
                    }
                )
                $('#modal-credit-card-information').hide();
            } else {
                $.fn.notifyB({description: "Missing value Credit Card."}, 'failure');
            }
        })
    }
}
