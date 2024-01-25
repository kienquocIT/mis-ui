let promotionClass = new promotionHandle();
let shippingClass = new shippingHandle();

// Load data
class QuotationLoadDataHandle {
    static opportunitySelectEle = $('#opportunity_id');
    static customerSelectEle = $('#select-box-quotation-create-customer');
    static contactSelectEle = $('#select-box-quotation-create-contact');
    static paymentSelectEle = $('#select-box-quotation-create-payment-term');
    static salePersonSelectEle = $('#employee_inherit_id');
    static quotationSelectEle = $('#select-box-quotation');
    static transEle = $('#app-trans-factory');

    static loadInformationSelectBox(ele, is_expense = false) {
        let optionSelected;
        let dropdownContent;
        let eleInfo;
        if (is_expense === false) { // Normal dropdown
            optionSelected = ele;
            eleInfo = ele[0].closest('.input-affix-wrapper').querySelector('.fa-info-circle');
            let inputWrapper = ele[0].closest('.input-affix-wrapper');
            dropdownContent = inputWrapper.querySelector('.dropdown-menu');
        } else { // Expense dropdown
            optionSelected = ele[0].querySelector('.option-btn-checked');
            eleInfo = ele[0].closest('.dropdown-expense').querySelector('.fa-info-circle');
            dropdownContent = ele[0].closest('.dropdown-expense').querySelector('.expense-more-info');
        }
        dropdownContent.innerHTML = ``;
        eleInfo.setAttribute('disabled', true);
        let link = "";
        if (optionSelected) {
            let eleData;
            if (is_expense === false) {
                eleData = SelectDDControl.get_data_from_idx($(optionSelected), $(optionSelected).val());
            } else {
                eleData = optionSelected.querySelector('.data-info');
            }
            if (eleData) {
                // remove attr disabled
                if (eleInfo) {
                    eleInfo.removeAttribute('disabled');
                }
                // end
                let data = {};
                if (is_expense === false) {
                    data = eleData;
                } else {
                    data = JSON.parse(eleData.value);
                }
                let info = ``;
                info += `<h6 class="dropdown-header header-wth-bg">${QuotationLoadDataHandle.transEle.attr('data-more-information')}</h6>`;
                for (let key in data) {
                    if (['id', 'title', 'name', 'fullname', 'full_name', 'code'].includes(key)) {
                        if (key === 'id') {
                            let linkDetail = ele.data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(data[key]);
                            }
                        } else {
                            info += `<div class="row mb-1"><h6><i>${key}</i></h6><p>${data[key]}</p></div>`;
                        }
                    }
                }
                info += `<div class="dropdown-divider"></div>
                    <div class="row float-right">
                        <a href="${link}" target="_blank" class="link-primary underline_hover">
                            <span><span>${QuotationLoadDataHandle.transEle.attr('data-view-detail-info')}</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                        </a>
                    </div>`;
                dropdownContent.innerHTML = info;
            }
        }
    }

    static loadInitOpportunity() {
        let form = $('#frm_quotation_create');
        if (form.attr('data-method') === 'POST') {
            let dataInitOppRaw = $('#data-init-opportunity').val();
            if (dataInitOppRaw) {
                let dataInitOpp = JSON.parse(dataInitOppRaw);
                let list_from_app = 'quotation.quotation.create';
                if (form[0].classList.contains('sale-order')) {
                    list_from_app = 'saleorder.saleorder.create';
                }
                $.fn.callAjax2({
                        'url': QuotationLoadDataHandle.opportunitySelectEle.attr('data-url'),
                        'method': QuotationLoadDataHandle.opportunitySelectEle.attr('data-method'),
                        'data': {'list_from_app': list_from_app},
                        // 'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                for (let opp of data.opportunity_list) {
                                    if (opp?.['id'] === dataInitOpp?.['id']) {
                                        QuotationLoadDataHandle.opportunitySelectEle.initSelect2({
                                            data: opp,
                                            'allowClear': true,
                                            disabled: !(QuotationLoadDataHandle.opportunitySelectEle.attr('data-url')),
                                        });
                                        QuotationLoadDataHandle.opportunitySelectEle.change();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                )
            }
        }
    };

    static loadDataByOpportunity() {
        let tableProduct = $('#datable-quotation-create-product');
        QuotationLoadDataHandle.loadBoxQuotationCustomer();
        QuotationLoadDataHandle.loadBoxQuotationContact();
        QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        if ($(QuotationLoadDataHandle.opportunitySelectEle).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.opportunitySelectEle, $(QuotationLoadDataHandle.opportunitySelectEle).val());
            if (dataSelected) {
                let dataCustomer = dataSelected?.['customer'];
                // load Shipping & Billing by Customer
                QuotationLoadDataHandle.loadShippingBillingCustomer();
                QuotationLoadDataHandle.loadShippingBillingCustomer(dataCustomer);
                // clear shipping + billing text area
                $('#quotation-create-shipping-address')[0].value = '';
                $('#quotation-create-customer-shipping').val('');
                $('#quotation-create-billing-address')[0].value = '';
                $('#quotation-create-customer-billing').val('');
                // Store Account Price List
                if (Object.keys(dataCustomer?.['price_list_mapped']).length !== 0) {
                    document.getElementById('customer-price-list').value = dataCustomer?.['price_list_mapped']?.['id'];
                }
            }
        } else {
            document.getElementById('customer-price-list').value = "";
        }
        // Delete all promotion rows
        deletePromotionRows(tableProduct, true, false);
        // Delete all shipping rows
        deletePromotionRows(tableProduct, false, true);
        // ReCheck Config when change Opportunity
        let check_config = QuotationCheckConfigHandle.checkConfig(true);
        // load again total products if after check config the price change
        if (check_config?.['is_make_price_change'] === true) {
            QuotationCalculateCaseHandle.calculateAllRowsTableProduct($(tableProduct));
        }
    };

    static loadBoxQuotationCustomer(dataCustomer = {}) {
        QuotationLoadDataHandle.customerSelectEle.empty();
        let form = $('#frm_quotation_create');
        let data_filter = {};
        if ($(QuotationLoadDataHandle.opportunitySelectEle).val()) { // Has Opportunity
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.opportunitySelectEle, $(QuotationLoadDataHandle.opportunitySelectEle).val());
            if (dataSelected) {
                if (dataSelected?.['customer']) {
                    dataSelected['customer']['name'] = dataSelected['customer']['title'];
                    dataCustomer = dataSelected?.['customer'];
                }
                QuotationLoadDataHandle.customerSelectEle.initSelect2({
                    data: dataCustomer,
                    disabled: !(QuotationLoadDataHandle.customerSelectEle.attr('data-url')),
                    callbackTextDisplay: function (item) {
                        return item?.['name'] || '';
                    },
                });
            }
        } else { // No Opportunity
            let sale_person_id = null;
            let employee_current = $('#data-init-quotation-create-request-employee').val();
            if (employee_current) {
                let employee_current_data = JSON.parse(employee_current);
                sale_person_id = employee_current_data?.['id'];
            }
            if (QuotationLoadDataHandle.salePersonSelectEle.val()) {
                sale_person_id = QuotationLoadDataHandle.salePersonSelectEle.val();
            }
            data_filter['employee__id'] = sale_person_id;
            if (sale_person_id) { // Has SalePerson
                QuotationLoadDataHandle.customerSelectEle.initSelect2({
                    data: dataCustomer,
                    'dataParams': data_filter,
                    disabled: !(QuotationLoadDataHandle.customerSelectEle.attr('data-url')),
                    callbackTextDisplay: function (item) {
                        return item?.['name'] || '';
                    },
                });
            } else { // No SalePerson
                QuotationLoadDataHandle.customerSelectEle.initSelect2({
                    data: dataCustomer,
                    disabled: !(QuotationLoadDataHandle.customerSelectEle.attr('data-url')),
                    callbackTextDisplay: function (item) {
                        return item?.['name'] || '';
                    },
                });
            }
        }
        // QuotationLoadDataHandle.loadInformationSelectBox(QuotationLoadDataHandle.customerSelectEle);
        if (form.attr('data-method') !== 'GET') {
            if (!dataCustomer?.['is_copy']) {
                QuotationLoadDataHandle.loadDataProductAll();
            }
        }
    };

    static loadDataByCustomer() {
        let tableProduct = $('#datable-quotation-create-product');
        QuotationLoadDataHandle.loadBoxQuotationContact();
        QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        // load again payment stage because payment change
        $('#datable-quotation-payment-stage').DataTable().clear().draw();
        QuotationLoadDataHandle.loadDataTablePaymentStage();
        if ($(QuotationLoadDataHandle.customerSelectEle).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, $(QuotationLoadDataHandle.customerSelectEle).val());
            if (dataSelected) {
                // load Shipping & Billing by Customer
                QuotationLoadDataHandle.loadShippingBillingCustomer();
                QuotationLoadDataHandle.loadShippingBillingCustomer(dataSelected);
                // clear shipping + billing text area
                $('#quotation-create-shipping-address')[0].value = '';
                $('#quotation-create-customer-shipping').val('');
                $('#quotation-create-billing-address')[0].value = '';
                $('#quotation-create-customer-billing').val('');
                // Store Account Price List
                if (Object.keys(dataSelected?.['price_list_mapped']).length !== 0) {
                    document.getElementById('customer-price-list').value = dataSelected?.['price_list_mapped']?.['id'];
                }
            }
        } else {
            document.getElementById('customer-price-list').value = "";
        }
        // Delete all promotion rows
        deletePromotionRows(tableProduct, true, false);
        // Delete all shipping rows
        deletePromotionRows(tableProduct, false, true);
        // load again price of product by customer price list then Re Calculate
        QuotationLoadDataHandle.loadDataProductAll();
    }

    static loadBoxQuotationContact(dataContact = {}, customerID = null) {
        QuotationLoadDataHandle.contactSelectEle.empty();
        if ($(QuotationLoadDataHandle.customerSelectEle).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, $(QuotationLoadDataHandle.customerSelectEle).val());
            if (dataSelected) {
                if (dataSelected?.['contact_mapped']) {
                    dataContact = dataSelected?.['contact_mapped'];
                }
                if (dataSelected?.['owner']) {
                    dataContact = dataSelected?.['owner'];
                }
                customerID = dataSelected?.['id'];
            }
        }
        QuotationLoadDataHandle.contactSelectEle.initSelect2({
            data: dataContact,
            'dataParams': {'account_name_id': customerID},
            disabled: !(QuotationLoadDataHandle.contactSelectEle.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['fullname'] || '';
            },
        });
        // QuotationLoadDataHandle.loadInformationSelectBox(QuotationLoadDataHandle.contactSelectEle);
    };

    static loadBoxQuotationPaymentTerm(dataPayment = {}) {
        QuotationLoadDataHandle.paymentSelectEle.empty();
        if ($(QuotationLoadDataHandle.customerSelectEle).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, $(QuotationLoadDataHandle.customerSelectEle).val());
            if (dataSelected) {
                if (dataSelected?.['payment_term_customer_mapped']) {
                    dataPayment = dataSelected?.['payment_term_customer_mapped'];
                }
            }
        }
        QuotationLoadDataHandle.paymentSelectEle.initSelect2({
            data: dataPayment,
            disabled: !(QuotationLoadDataHandle.paymentSelectEle.attr('data-url')),
        });
        // QuotationLoadDataHandle.loadInformationSelectBox(QuotationLoadDataHandle.paymentSelectEle);
    }

    static loadDataBySalePerson() {
        if (!QuotationLoadDataHandle.opportunitySelectEle.val()) {
            QuotationLoadDataHandle.loadBoxQuotationCustomer();
            QuotationLoadDataHandle.loadBoxQuotationContact();
            QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        }
    };

    static loadBoxSOQuotation(dataQuotation = {}) {
        QuotationLoadDataHandle.quotationSelectEle.empty();
        QuotationLoadDataHandle.quotationSelectEle.initSelect2({
            data: dataQuotation,
            disabled: !(QuotationLoadDataHandle.quotationSelectEle.attr('data-url')),
        });
    }

    static loadBoxQuotationPrice() {
        let ele = $('#select-box-quotation-create-price-list');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('price_list') && Array.isArray(data.price_list)) {
                        ele.append(`<option value=""></option>`);
                        data.price_list.map(function (item) {
                            let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                            ele.append(`<option value="${item.id}">
                                        <span class="opp-title">${item.title}</span>
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                        })
                    }
                }
            }
        )
    }

    static loadInitQuotationProduct() {
        let ele = QuotationDataTableHandle.productInitEle;
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('product_sale_list') && Array.isArray(data.product_sale_list)) {
                        ele.val(JSON.stringify(data.product_sale_list))
                    }
                }
            }
        )
    }

    static loadBoxQuotationProduct(ele, dataProduct = {}) {
        ele.initSelect2({
            data: dataProduct,
            // dataParams: data_filter,
            disabled: !(ele.attr('data-url')),
        });
    }

    static loadBoxQuotationExpenseItem(ele, dataExpenseItem = {}) {
        ele.initSelect2({
            data: dataExpenseItem,
            // dataParams: data_filter,
            disabled: !(ele.attr('data-url')),
        });
    }

    static loadBoxQuotationUOM(ele, dataUOM = {}, uom_group_id = null) {
        ele.initSelect2({
            data: dataUOM,
            'dataParams': {'group': uom_group_id},
            disabled: !(ele.attr('data-url')),
        });
    }

    static loadBoxQuotationTax(ele, dataTax = {}) {
        ele.initSelect2({
            data: dataTax,
            disabled: !(ele.attr('data-url')),
        });
    }

    static loadBoxQuotationExpense(ele, dataExpense = {}) {
        ele.empty();
        ele.initSelect2({
            data: dataExpense,
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadBoxQuotationProductPurchasing(box_id, valueToSelect = null) {
        let ele = QuotationDataTableHandle.productInitEle;
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let dataResp = $.fn.switcherResp(resp);
                if (dataResp) {
                    if (dataResp.hasOwnProperty('product_sale_list') && Array.isArray(dataResp.product_sale_list)) {
                        ele.val(JSON.stringify(dataResp.product_sale_list));
                        let linkDetail = ele.attr('data-link-detail');
                        eleBox.attr('data-link-detail', linkDetail);
                        let data = dataResp.product_sale_list
                        for (let i = 0; i < data.length; i++) {
                            if (Array.isArray(data[i].product_choice)) {
                                if (data[i].product_choice.includes(2)) {
                                    let uom_title = "";
                                    let default_uom = {};
                                    let uom_group = {};
                                    let tax_code = {};
                                    if (Object.keys(data[i]?.['sale_information']).length !== 0) {
                                        if (Object.keys(data[i]?.['sale_information']?.['default_uom']).length !== 0) {
                                            uom_title = data[i]?.['sale_information']?.['default_uom']?.['title']
                                        }
                                        default_uom = data[i]?.['sale_information']?.['default_uom'];
                                        tax_code = data[i]?.['sale_information']?.['tax_code'];
                                    }
                                    if (Object.keys(data[i]?.['sale_information']).length !== 0) {
                                        uom_group = data[i]?.['sale_information']?.['uom_group'];
                                    }
                                    let dataStr = JSON.stringify({
                                        'id': data[i].id,
                                        'title': data[i].title,
                                        'code': data[i].code,
                                        'unit of measure': uom_title,
                                        'is_product': true,
                                    }).replace(/"/g, "&quot;");
                                    let product_data = JSON.stringify({
                                        'id': data[i].id,
                                        'title': data[i].title,
                                        'code': data[i].code,
                                        'unit_of_measure': default_uom,
                                        'uom_group': uom_group,
                                        'price_list': data[i].price_list,
                                        'cost_price': data[i].cost_price,
                                        'tax': tax_code,
                                    }).replace(/"/g, "&quot;");
                                    let option = `<button type="button" class="btn btn-white dropdown-item table-row-expense-option" data-value="${data[i].id}">
                                        <div class="float-left"><span class="expense-title">${data[i].title}</span></div>
                                        <input type="hidden" class="data-default" value="${product_data}">
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </button>`
                                    if (valueToSelect && valueToSelect === data[i].id) {
                                        option = `<button type="button" class="btn btn-white dropdown-item table-row-expense-option option-btn-checked" data-value="${data[i].id}">
                                        <div class="float-left"><span class="expense-title">${data[i].title}</span></div>
                                        <input type="hidden" class="data-default" value="${product_data}">
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </button>`
                                    }
                                    eleBox.append(option);
                                }
                            }
                        }
                    }
                }
            }
        )
    };

    static loadDataProductSelect(ele) {
        let productData = SelectDDControl.get_data_from_idx(ele, ele.val());
        if (productData) {
            let data = productData;
            data['unit_of_measure'] = data?.['sale_information']?.['default_uom'];
            data['uom_group'] = data?.['general_information']?.['uom_group'];
            data['tax'] = data?.['sale_information']?.['tax_code'];
            let description = ele[0].closest('tr').querySelector('.table-row-description');
            let uom = ele[0].closest('tr').querySelector('.table-row-uom');
            let price = ele[0].closest('tr').querySelector('.table-row-price');
            let priceList = ele[0].closest('tr').querySelector('.table-row-price-list');
            let tax = ele[0].closest('tr').querySelector('.table-row-tax');
            // load Description
            if (description) {
                description.innerHTML = data?.['description'];
            }
            // load UOM
            if (uom && data.unit_of_measure && data.uom_group) {
                $(uom).empty();
                QuotationLoadDataHandle.loadBoxQuotationUOM($(uom), data.unit_of_measure, data.uom_group.id);
            } else {
                QuotationLoadDataHandle.loadBoxQuotationUOM($(uom));
            }
            // load PRICE
            if (price && priceList) {
                QuotationLoadDataHandle.loadPriceProduct(ele[0], true);
            }
            // load TAX
            if (tax && data.tax) {
                $(tax).empty();
                QuotationLoadDataHandle.loadBoxQuotationTax($(tax), data.tax);
            } else {
                QuotationLoadDataHandle.loadBoxQuotationTax($(tax));
            }
        }
        $.fn.initMaskMoney2();
    };

    static loadTableCopyQuotation(opp_id = null, sale_person_id = null) {
        let ele = $('#data-init-copy-quotation');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $('#datable-copy-quotation').DataTable().destroy();
        if (sale_person_id) {
            let data_filter = {
                'employee_inherit': sale_person_id,
                'system_status__in': [2, 3].join(','),
            };
            if (opp_id) {
                data_filter['opportunity'] = opp_id;
                data_filter['opportunity__sale_order__isnull'] = true;
                data_filter['opportunity__is_close_lost'] = false;
                data_filter['opportunity__is_deal_close'] = false;
                if (QuotationLoadDataHandle.opportunitySelectEle.val()) {
                    let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.opportunitySelectEle, QuotationLoadDataHandle.opportunitySelectEle.val());
                    if (dataSelected?.['quotation']?.['id']) {
                        data_filter['id'] = dataSelected?.['quotation']?.['id'];
                    } else {
                        QuotationDataTableHandle.dataTableCopyQuotation();
                        return false;
                    }
                }
            } else {
                data_filter['opportunity__isnull'] = true;
            }
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'data': data_filter,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('quotation_list') && Array.isArray(data.quotation_list)) {
                            QuotationDataTableHandle.dataTableCopyQuotation(data.quotation_list);
                        }
                    }
                }
            )
        } else {
            QuotationDataTableHandle.dataTableCopyQuotation();
        }
        return true;
    };

    static loadShippingBillingCustomer(item = null) {
        let modalShippingContent = $('#quotation-create-modal-shipping-body')[0].querySelector('.modal-body');
        if (modalShippingContent) {
            $(modalShippingContent).empty();
            if (item) {
                for (let i = 0; i < item.shipping_address.length; i++) {
                    let shipping = item.shipping_address[i];
                    $(modalShippingContent).append(`<div class="row ml-1 shipping-group">
                                                    <div class="row mb-1">
                                                        <textarea class="form-control show-not-edit shipping-content disabled-custom-show" rows="3" cols="50" id="${shipping.id}" disabled>${shipping.full_address}</textarea>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-5"></div>
                                                        <div class="col-4"></div>
                                                        <div class="col-3 float-right">
                                                            <button type="button" class="btn btn-primary choose-shipping" data-bs-dismiss="modal" id="${shipping.id}" data-address="${shipping.full_address}">${QuotationLoadDataHandle.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>`)
                }
            }
        }
        let modalBillingContent = $('#quotation-create-modal-billing-body')[0].querySelector('.modal-body');
        if (modalBillingContent) {
            $(modalBillingContent).empty();
            if (item) {
                for (let i = 0; i < item.billing_address.length; i++) {
                    let billing = item.billing_address[i];
                    $(modalBillingContent).append(`<div class="row ml-1 billing-group">
                                                    <div class="row mb-1">
                                                        <textarea class="form-control show-not-edit billing-content disabled-custom-show" rows="3" cols="50" id="${billing.id}" disabled>${billing.full_address}</textarea>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-5"></div>
                                                        <div class="col-4"></div>
                                                        <div class="col-3">
                                                            <button type="button" class="btn btn-primary choose-billing" data-bs-dismiss="modal" id="${billing.id}" data-address="${billing.full_address}">${QuotationLoadDataHandle.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>`)
                }
            }
        }
    }

    static loadBoxSaleOrderQuotation(quotation_id, valueToSelect = null, opp_id = null, sale_person_id = null) {
        let self = this;
        let jqueryId = '#' + quotation_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (sale_person_id) {
            let data_filter = {'employee_inherit': sale_person_id};
            if (opp_id) {
                data_filter = {
                    'employee_inherit': sale_person_id,
                    'opportunity': opp_id
                }
            }
            $.fn.callAjax(url, method, data_filter).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.empty();
                        if (data.hasOwnProperty('quotation_list') && Array.isArray(data.quotation_list)) {
                            ele.append(`<option value=""></option>`);
                            data.quotation_list.map(function (item) {
                                let dataStr = JSON.stringify({
                                    'id': item.id,
                                    'title': item.title,
                                    'code': item.code,
                                }).replace(/"/g, "&quot;");
                                let option = `<option value="${item.id}">
                                            <span class="quotation-title">${item.title}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                                if (valueToSelect && valueToSelect === item.id) {
                                    option = `<option value="${item.id}" selected>
                                            <span class="quotation-title">${item.title}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                                }
                                ele.append(option)
                            });
                            // QuotationLoadDataHandle.loadInformationSelectBox(ele);
                        }
                    }
                }
            )
        }
    }

    static loadAPIDetailQuotation(select_id) {
        let ele = $('#data-init-copy-quotation');
        let url = ele.attr('data-url-detail').format_url_with_uuid(select_id);
        let method = ele.attr('data-method');
        $.fn.callAjax2(
            {
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#data-copy-quotation-detail').val(JSON.stringify(data))
                }
            }
        )
    }

    static loadTotal(data, is_product, is_cost, is_expense) {
        let pretax = null;
        let tax = null;
        let total = null;
        let discount = null;
        let pretaxRaw = null;
        let taxRaw = null;
        let totalRaw = null;
        let discountRaw = null;
        let discountRate = null;
        let discountRateCopy = document.getElementById('quotation-copy-discount-on-total');
        let finalRevenueBeforeTax = null;
        if (is_product === true) {
            let tableProduct = document.getElementById('datable-quotation-create-product');
            if (tableProduct.closest('.dataTables_scroll')) {
                let tableProductFt = tableProduct.closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot');
                pretax = tableProductFt.querySelector('.quotation-create-product-pretax-amount');
                tax = tableProductFt.querySelector('.quotation-create-product-taxes');
                total = tableProductFt.querySelector('.quotation-create-product-total');
                discount = tableProductFt.querySelector('.quotation-create-product-discount-amount');
                pretaxRaw = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
                taxRaw = tableProductFt.querySelector('.quotation-create-product-taxes-raw');
                totalRaw = tableProductFt.querySelector('.quotation-create-product-total-raw');
                discountRaw = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
                discountRate = tableProductFt.querySelector('.quotation-create-product-discount');
                finalRevenueBeforeTax = tableProductFt.querySelector('.quotation-final-revenue-before-tax');
            }
        } else if (is_cost === true) {
            let tableCost = document.getElementById('datable-quotation-create-cost');
            pretax = tableCost.querySelector('.quotation-create-cost-pretax-amount');
            tax = tableCost.querySelector('.quotation-create-cost-taxes');
            total = tableCost.querySelector('.quotation-create-cost-total');
            pretaxRaw = tableCost.querySelector('.quotation-create-cost-pretax-amount-raw');
            taxRaw = tableCost.querySelector('.quotation-create-cost-taxes-raw');
            totalRaw = tableCost.querySelector('.quotation-create-cost-total-raw');
        } else if (is_expense === true) {
            let tableExpense = document.getElementById('datable-quotation-create-expense');
            if (tableExpense.closest('.dataTables_scroll')) {
                let tableExpenseFt = tableExpense.closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot');
                pretax = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount');
                tax = tableExpenseFt.querySelector('.quotation-create-expense-taxes');
                total = tableExpenseFt.querySelector('.quotation-create-expense-total');
                pretaxRaw = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount-raw');
                taxRaw = tableExpenseFt.querySelector('.quotation-create-expense-taxes-raw');
                totalRaw = tableExpenseFt.querySelector('.quotation-create-expense-total-raw');
            }
        }
        if (pretax && pretaxRaw && tax && taxRaw && total && totalRaw) {
            // pretax
            if (is_product === true) {
                $(pretax).attr('data-init-money', String(data.total_product_pretax_amount));
                pretaxRaw.value = data.total_product_pretax_amount
            } else if (is_cost === true) {
                $(pretax).attr('data-init-money', String(data.total_cost_pretax_amount));
                pretaxRaw.value = data.total_cost_pretax_amount
            } else if (is_expense === true) {
                $(pretax).attr('data-init-money', String(data.total_expense_pretax_amount));
                pretaxRaw.value = data.total_expense_pretax_amount
            }
            // discount
            if (discount && discountRaw && discountRate) {
                $(discount).attr('data-init-money', String(data.total_product_discount));
                discountRaw.value = data.total_product_discount;
                discountRate.value = data.total_product_discount_rate;
                discountRateCopy.value = data.total_product_discount_rate;
            }
            // tax
            if (is_product === true) {
                $(tax).attr('data-init-money', String(data.total_product_tax));
                taxRaw.value = data.total_product_tax
            } else if (is_cost === true) {
                $(tax).attr('data-init-money', String(data.total_cost_tax));
                taxRaw.value = data.total_cost_tax
            } else if (is_expense === true) {
                $(tax).attr('data-init-money', String(data.total_expense_tax));
                taxRaw.value = data.total_expense_tax
            }
            // total
            if (is_product === true) {
                $(total).attr('data-init-money', String(data.total_product));
                totalRaw.value = data.total_product
            } else if (is_cost === true) {
                $(total).attr('data-init-money', String(data.total_cost));
                totalRaw.value = data.total_cost
            } else if (is_expense === true) {
                $(total).attr('data-init-money', String(data.total_expense));
                totalRaw.value = data.total_expense
            }
            // load total revenue before tax for tab product
            if (finalRevenueBeforeTax) {
                finalRevenueBeforeTax.value = data.total_product_revenue_before_tax;
            }
        }
        $.fn.initMaskMoney2();
    };

    static loadRowDisabled(row) {
        if (row.querySelector('.table-row-item')) {
            row.querySelector('.table-row-item').setAttribute('disabled', 'true');
        }
        if (row.querySelector('.table-row-uom')) {
            row.querySelector('.table-row-uom').setAttribute('disabled', 'true');
        }
        if (row.querySelector('.table-row-quantity')) {
            row.querySelector('.table-row-quantity').setAttribute('disabled', 'true');
        }
        if (row.querySelector('.table-row-price')) {
            row.querySelector('.table-row-price').setAttribute('disabled', 'true');
        }
        if (row.querySelector('.table-row-discount')) {
            row.querySelector('.table-row-discount').setAttribute('disabled', 'true');
        }
        if (row.querySelector('.table-row-tax')) {
            row.querySelector('.table-row-tax').setAttribute('disabled', 'true');
        }
    };

    static loadPriceProduct(eleProduct, is_change_item = false) {
        let productData = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
        let is_change_price = false;
        if (productData) {
            let data = productData;
            let price = eleProduct.closest('tr').querySelector('.table-row-price');
            let priceList = eleProduct.closest('tr').querySelector('.table-row-price-list');
            // load PRICE
            if (price && priceList) {
                let account_price_id = document.getElementById('customer-price-list').value;
                let general_price_id = null;
                let general_price = 0;
                let customer_price = null;
                let current_price_checked = price.getAttribute('value');
                let transJSON = {};
                transJSON['Valid'] = QuotationLoadDataHandle.transEle.attr('data-valid');
                $(priceList).empty();
                if (Array.isArray(data.price_list) && data.price_list.length > 0) {
                    for (let i = 0; i < data.price_list.length; i++) {
                        if (data.price_list[i]?.['price_type'] === 0) { // PRICE TYPE IS PRODUCT (SALE)
                            if (data.price_list[i].is_default === true) { // check GENERAL_PRICE_LIST OF PRODUCT then set general_price
                                general_price_id = data.price_list[i].id;
                                general_price = parseFloat(data.price_list[i].value);
                            }
                            if (!["Expired", "Invalid"].includes(data.price_list[i]?.['price_status'])) { // If Valid Price
                                if (data.price_list[i].id === account_price_id) { // check CUSTOMER_PRICE then set customer_price
                                    customer_price = parseFloat(data.price_list[i].value);
                                    $(priceList).append(`<a class="dropdown-item table-row-price-option option-btn-checked" data-value="${parseFloat(data.price_list[i].value)}">
                                                            <div class="d-flex">
                                                                <span class="mr-2">${data.price_list[i].title}</span>
                                                                <span class="badge badge-soft-success mr-2"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></span>
                                                                <small class="valid-price mr-2"><i>${transJSON[data.price_list[i]?.['price_status']]}</i></small>
                                                            </div>
                                                        </a>`);
                                } else {
                                    $(priceList).append(`<a class="dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                                            <div class="d-flex">
                                                                <span class="mr-2">${data.price_list[i].title}</span>
                                                                <span class="badge badge-soft-success mr-2"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></span>
                                                                <small class="valid-price mr-2"><i>${transJSON[data.price_list[i]?.['price_status']]}</i></small>
                                                            </div>
                                                        </a>`);
                                }
                            }
                        } else if (data.price_list[i]?.['price_type'] === 2) { // PRICE TYPE IS EXPENSE
                            general_price = parseFloat(data.price_list[i].value);
                            $(priceList).append(`<a class="dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                                    <div class="d-flex">
                                                        <span class="mr-2">${data.price_list[i].title}</span>
                                                        <span class="badge badge-soft-success mr-2"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></span>
                                                        <small class="valid-price mr-2"><i>${transJSON[data.price_list[i]?.['price_status']]}</i></small>
                                                    </div>
                                                </a>`);
                        }
                    }
                }
                // get Price to display
                if (is_change_item === true) {
                    if (customer_price) {
                        $(price).attr('value', String(customer_price));
                    } else {
                        $(price).attr('value', String(general_price));
                    }
                }
                if (current_price_checked !== price.getAttribute('value')) {
                    is_change_price = true;
                }
            }
        }
        $.fn.initMaskMoney2();
        // If change price then remove promotion & shipping
        if (is_change_price === true) {
            let tableProduct = document.getElementById('datable-quotation-create-product');
            deletePromotionRows($(tableProduct), true, false);
            deletePromotionRows($(tableProduct), false, true);
        }
    };

    static loadReInitDataTableProduct() {
        let $form = $('#frm_quotation_create');
        let $table = $('#datable-quotation-create-product');
        let tableData = [];
        let dataDetail = {};
        if ($form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['quotation_products_data']) {
                        tableData = dataDetail?.['quotation_products_data'];
                    }
                    if (dataDetail?.['sale_order_products_data']) {
                        tableData = dataDetail?.['sale_order_products_data'];
                    }
                }
            }
        } else {
            $table.DataTable().rows().every(function () {
                let rowData = {};
                let row = this.node();
                let eleProduct = row.querySelector('.table-row-item');
                let elePromotion = row.querySelector('.table-row-promotion');
                let eleShipping = row.querySelector('.table-row-shipping');
                if ($(eleProduct).val()) { // PRODUCT
                    let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                    if (dataProduct) {
                        rowData['product'] = dataProduct;
                        rowData['product_title'] = dataProduct?.['title'];
                        rowData['product_code'] = dataProduct?.['code'];
                    }
                    let eleUOM = row.querySelector('.table-row-uom');
                    if ($(eleUOM).val()) {
                        let dataUOM = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                        if (dataUOM) {
                            rowData['unit_of_measure'] = dataUOM;
                            rowData['product_uom_title'] = dataUOM?.['title'];
                            rowData['product_uom_code'] = dataUOM?.['code'];
                        }
                    }
                    let eleTax = row.querySelector('.table-row-tax');
                    if ($(eleTax).val()) {
                        let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                        if (dataTax) {
                            rowData['tax'] = dataTax;
                            rowData['product_tax_title'] = dataTax?.['title'];
                            rowData['product_tax_value'] = dataTax?.['rate'];
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                    let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                    if (eleTaxAmount) {
                        rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                    }
                    let eleDescription = row.querySelector('.table-row-description');
                    if (eleDescription) {
                        rowData['product_description'] = eleDescription.innerHTML;
                    }
                    let eleQuantity = row.querySelector('.table-row-quantity');
                    if (eleQuantity) {
                        rowData['product_quantity'] = parseFloat(eleQuantity.value);
                    }
                    let elePrice = row.querySelector('.table-row-price');
                    if (elePrice) {
                        rowData['product_unit_price'] = $(elePrice).valCurrency();
                    }
                    let eleDiscount = row.querySelector('.table-row-discount');
                    if (eleDiscount) {
                        if (eleDiscount.value || eleDiscount.value === "0") {
                            rowData['product_discount_value'] = parseFloat(eleDiscount.value);
                        } else {
                            rowData['product_discount_value'] = 0;
                        }
                    }
                    let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
                    if (eleDiscountAmount) {
                        rowData['product_discount_amount'] = $(eleDiscountAmount).valCurrency();
                    }
                    let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                    if (eleSubtotal) {
                        rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                    }
                    if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                        rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount']
                    }
                    let eleOrder = row.querySelector('.table-row-order');
                    if (eleOrder) {
                        rowData['order'] = parseInt(eleOrder.innerHTML);
                    }
                    rowData['is_promotion'] = false;
                    rowData['promotion'] = null;
                    rowData['is_shipping'] = false;
                    rowData['shipping'] = null;
                    tableData.push(rowData);
                } else if (elePromotion) { // PROMOTION
                    let check_none_blank_list = ['', "", null, "undefined"];
                    rowData['product'] = null;
                    if (elePromotion.getAttribute('data-id-product') && !check_none_blank_list.includes(elePromotion.getAttribute('data-id-product'))) {
                        rowData['product'] = elePromotion.getAttribute('data-id-product');
                    }
                    rowData['is_promotion'] = true;
                    rowData['promotion'] = elePromotion.getAttribute('data-id');
                    rowData['is_shipping'] = false;
                    rowData['shipping'] = null;
                    rowData['product_title'] = elePromotion.value;
                    rowData['product_code'] = elePromotion.value;
                    rowData['unit_of_measure'] = null;
                    rowData['product_uom_title'] = "";
                    rowData['product_uom_code'] = "";
                    let uomData = getDataByProductID(elePromotion.getAttribute('data-id-product'));
                    if (uomData && Object.keys(uomData).length > 0) {
                        rowData['unit_of_measure'] = uomData;
                        rowData['product_uom_title'] = uomData?.['title'];
                        rowData['product_uom_code'] = uomData?.['code'];
                    }
                    let eleTax = row.querySelector('.table-row-tax');
                    if (eleTax) {
                        let optionSelected = eleTax.options[eleTax.selectedIndex];
                        if (optionSelected) {
                            if (optionSelected.querySelector('.data-info')) {
                                let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                                rowData['tax'] = dataInfo;
                                rowData['product_tax_title'] = dataInfo?.['title'];
                                rowData['product_tax_value'] = dataInfo?.['value'];
                            } else {
                                rowData['product_tax_value'] = 0;
                            }
                        }
                    }
                    let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                    if (eleTaxAmount) {
                        rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                    }
                    let eleDescription = row.querySelector('.table-row-description');
                    if (eleDescription) {
                        rowData['product_description'] = eleDescription.value;
                    }
                    let eleQuantity = row.querySelector('.table-row-quantity');
                    if (eleQuantity) {
                        rowData['product_quantity'] = parseFloat(eleQuantity.value);
                    }
                    let elePrice = row.querySelector('.table-row-price');
                    if (elePrice) {
                        rowData['product_unit_price'] = $(elePrice).valCurrency();
                    }
                    rowData['product_discount_value'] = 0;
                    rowData['product_discount_amount'] = 0;
                    let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                    if (eleSubtotal) {
                        rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                    }
                    let eleOrder = row.querySelector('.table-row-order');
                    if (eleOrder) {
                        rowData['order'] = parseInt(eleOrder.innerHTML);
                    }
                    tableData.push(rowData);
                } else if (eleShipping) { // SHIPPING
                    rowData['product'] = null;
                    rowData['is_shipping'] = true;
                    rowData['shipping'] = eleShipping.getAttribute('data-id');
                    rowData['is_promotion'] = false;
                    rowData['promotion'] = null;
                    rowData['product_title'] = eleShipping.value;
                    rowData['product_code'] = eleShipping.value;
                    rowData['unit_of_measure'] = null;
                    rowData['product_uom_title'] = "";
                    rowData['product_uom_code'] = "";
                    let eleTax = row.querySelector('.table-row-tax');
                    if (eleTax) {
                        let optionSelected = eleTax.options[eleTax.selectedIndex];
                        if (optionSelected) {
                            if (optionSelected.querySelector('.data-info')) {
                                let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                                rowData['tax'] = dataInfo;
                                rowData['product_tax_title'] = dataInfo?.['title'];
                                rowData['product_tax_value'] = dataInfo?.['value'];
                            } else {
                                rowData['product_tax_value'] = 0;
                            }
                        }
                    }
                    let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                    if (eleTaxAmount) {
                        rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                    }
                    let eleDescription = row.querySelector('.table-row-description');
                    if (eleDescription) {
                        rowData['product_description'] = eleDescription.value;
                    }
                    let eleQuantity = row.querySelector('.table-row-quantity');
                    if (eleQuantity) {
                        rowData['product_quantity'] = parseFloat(eleQuantity.value);
                    }
                    let elePrice = row.querySelector('.table-row-price');
                    if (elePrice) {
                        rowData['product_unit_price'] = $(elePrice).valCurrency();
                    }
                    rowData['product_discount_value'] = 0;
                    rowData['product_discount_amount'] = 0;
                    let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                    if (eleSubtotal) {
                        rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                    }
                    let eleOrder = row.querySelector('.table-row-order');
                    if (eleOrder) {
                        rowData['order'] = parseInt(eleOrder.innerHTML);
                    }
                    tableData.push(rowData);
                }
            })
        }
        $table.DataTable().destroy();
        QuotationDataTableHandle.dataTableProduct();
        if (tableData.length === 0 && $form.attr('data-method').toLowerCase() === 'put') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['quotation_products_data']) {
                        tableData = dataDetail?.['quotation_products_data'];
                    }
                    if (dataDetail?.['sale_order_products_data']) {
                        tableData = dataDetail?.['sale_order_products_data'];
                    }
                }
            }
        }
        $table.DataTable().rows.add(tableData).draw();
        if ($form.attr('data-method').toLowerCase() === 'get') {
            QuotationLoadDataHandle.loadTableDisabled($table);
        }
        // load dropdowns
        QuotationLoadDataHandle.loadDropDowns($table);
        // check config & load price list for rows
        $table.DataTable().rows().every(function () {
            let row = this.node();
            QuotationCheckConfigHandle.checkConfig(false, row);
            QuotationLoadDataHandle.loadPriceProduct(row.querySelector('.table-row-item'));
        })

        $.fn.initMaskMoney2();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
    };

    static loadReInitDataTableExpense() {
        let $form = $('#frm_quotation_create');
        let $table = $('#datable-quotation-create-expense');
        let tableData = [];
        let dataDetail = {};
        if ($form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['quotation_expenses_data']) {
                        tableData = dataDetail?.['quotation_expenses_data'];
                    }
                    if (dataDetail?.['sale_order_expenses_data']) {
                        tableData = dataDetail?.['sale_order_expenses_data'];
                    }
                }
            }
        } else {
            $table.DataTable().rows().every(function () {
                let rowData = {};
                let row = this.node();
                let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
                if (dataRowRaw) {
                    let dataRow = JSON.parse(dataRowRaw);
                    rowData['is_labor'] = dataRow?.['is_labor'];
                }
                let eleExpenseItem = row.querySelector('.table-row-item');
                if ($(eleExpenseItem).val()) {
                    let dataExpenseItem = SelectDDControl.get_data_from_idx($(eleExpenseItem), $(eleExpenseItem).val());
                    if (dataExpenseItem) {
                        rowData['expense_item'] = dataExpenseItem;
                        rowData['expense_code'] = dataExpenseItem?.['code'];
                        rowData['expense_type_title'] = dataExpenseItem?.['title'];
                    }
                }
                if (row?.querySelector('.table-row-expense-title')) {
                    rowData['expense_title'] = row.querySelector('.table-row-expense-title').value;
                }
                let eleLaborItem = row?.querySelector('.table-row-labor-item');
                if (eleLaborItem) {
                    if ($(eleLaborItem).val()) {
                        let dataLaborItem = SelectDDControl.get_data_from_idx($(eleLaborItem), $(eleLaborItem).val());
                        if (dataLaborItem) {
                            rowData['expense'] = dataLaborItem;
                            rowData['expense_title'] = dataLaborItem?.['title'];
                        }
                    }
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if ($(eleUOM).val()) {
                    let dataUOM = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                    if (dataUOM) {
                        rowData['unit_of_measure'] = dataUOM;
                        rowData['product_uom_title'] = dataUOM?.['title'];
                        rowData['product_uom_code'] = dataUOM?.['code'];
                    }
                }
                let eleTax = row.querySelector('.table-row-tax');
                if ($(eleTax).val()) {
                    let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                    if (dataTax) {
                        rowData['tax'] = dataTax;
                        rowData['product_tax_title'] = dataTax?.['title'];
                        rowData['product_tax_value'] = dataTax?.['rate'];
                    } else {
                        rowData['product_tax_value'] = 0;
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['expense_tax_amount'] = parseFloat(eleTaxAmount.value)
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['expense_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['expense_price'] = $(elePrice).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['expense_subtotal_price'] = parseFloat(eleSubtotal.value)
                }
                if (rowData.hasOwnProperty('expense_subtotal_price') && rowData.hasOwnProperty('expense_tax_amount')) {
                    rowData['expense_subtotal_price_after_tax'] = rowData['expense_subtotal_price'] + rowData['expense_tax_amount']
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                tableData.push(rowData);
            })
        }
        $table.DataTable().destroy();
        QuotationDataTableHandle.dataTableExpense();
        if (tableData.length === 0 && $form.attr('data-method').toLowerCase() === 'put') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['quotation_expenses_data']) {
                        tableData = dataDetail?.['quotation_expenses_data'];
                    }
                    if (dataDetail?.['sale_order_expenses_data']) {
                        tableData = dataDetail?.['sale_order_expenses_data'];
                    }
                }
            }
        }
        $table.DataTable().rows.add(tableData).draw();
        if ($form.attr('data-method').toLowerCase() === 'get') {
            QuotationLoadDataHandle.loadTableDisabled($table);
        }
        QuotationLoadDataHandle.loadDropDowns($table, true);
        $.fn.initMaskMoney2();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
    };

    static loadDataTablePaymentStage() {
        let $table = $('#datable-quotation-payment-stage');
        let term = [];
        let dataSO = {'stage': 0, 'is_ar_invoice': false, 'number_of_day': 0,};
        let dataContract = {};
        let dataDelivery = [];
        let dataAcceptance = [];
        let valueSO = 0;
        let tableProduct = document.getElementById('datable-quotation-create-product');
        if (tableProduct.closest('.dataTables_scroll')) {
            let tableProductFt = tableProduct.closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot');
            if (tableProductFt.querySelector('.quotation-create-product-total-raw')) {
                valueSO = parseFloat(tableProductFt.querySelector('.quotation-create-product-total-raw').value);
            }
        }
        if (QuotationLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                term = dataSelected?.['term'];
            }
        }
        if (term.length > 0) {
            for (let termData of term) {
                let value = 0;
                let ratio = 0;
                let numberOfDay = 0;
                if (termData?.['unit_type'] === 0) {
                    if (termData?.['value']) {
                       ratio = parseFloat(termData?.['value']);
                       value = (ratio * valueSO) / 100;
                    }
                    if (termData?.['no_of_days']) {
                        numberOfDay = parseInt(termData?.['no_of_days']);
                    }
                }
                if (termData['after'] === 1) {
                    dataContract = {
                        'stage': 1,
                        'date_type': termData['after'],
                        'payment_ratio': ratio,
                        'value_before_tax': value,
                        'is_ar_invoice': false,
                        'number_of_day': numberOfDay,
                    }
                } else if (termData['after'] === 2) {
                    dataDelivery.push({
                        'stage': 2,
                        'date_type': termData['after'],
                        'payment_ratio': ratio,
                        'value_before_tax': value,
                        'is_ar_invoice': false,
                        'number_of_day': numberOfDay,
                    })
                } else if (termData['after'] === 4) {
                    dataAcceptance.push({
                        'stage': 3,
                        'date_type': termData['after'],
                        'payment_ratio': ratio,
                        'value_before_tax': value,
                        'is_ar_invoice': false,
                        'number_of_day': numberOfDay,
                    })
                }
            }
            if ($table.DataTable().data().count() === 0) {  // if dataTable empty then add init
                let data = [dataSO];
                if (Object.keys(dataContract).length > 0) {
                    data.push(dataContract);
                }
                for (let deli of dataDelivery) {
                    if (Object.keys(deli).length > 0) {
                        data.push(deli);
                    }
                }
                for (let acc of dataAcceptance) {
                    if (Object.keys(acc).length > 0) {
                        data.push(acc);
                    }
                }
                $table.DataTable().clear().draw();
                $table.DataTable().rows.add(data).draw();
                // load date picker
                $table.DataTable().rows().every(function () {
                    let row = this.node();
                    if (row.querySelector('.table-row-date')) {
                        $(row.querySelector('.table-row-date')).daterangepicker({
                            singleDatePicker: true,
                            timepicker: false,
                            showDropdowns: false,
                            minYear: 2023,
                            locale: {
                                format: 'DD/MM/YYYY'
                            },
                            maxYear: parseInt(moment().format('YYYY'), 10),
                        });
                        $(row.querySelector('.table-row-date')).val(null).trigger('change');
                        row.querySelector('.table-row-due-date').innerHTML = '';
                    }
                })
            } else {  // if dataTable is not empty then update data
                $table.DataTable().rows().every(function () {
                    let row = this.node();
                    let eleStage = row.querySelector('.table-row-stage');
                    if (eleStage) {
                        let dataRowRaw = eleStage.getAttribute('data-row');
                        if (dataRowRaw) {
                            let dataRow = JSON.parse(dataRowRaw);
                            if (dataRow?.['stage'] !== 0) {
                                let eleRatio = row.querySelector('.table-row-ratio');
                                let eleValue = row.querySelector('.table-row-value');
                                if (eleRatio && eleValue) {
                                    let value = (parseFloat(eleRatio.getAttribute('data-ratio')) * valueSO) / 100;
                                    eleValue.setAttribute('data-init-money', String(value));
                                }
                            }
                        }
                    }
                })
            }
        }
        // mask money
        $.fn.initMaskMoney2();
        return true;
    };

    static loadDueDatePaymentStage(ele) {
        let row = ele.closest('tr');
        let date = $(ele).val();
        let numberOfDay = ele.getAttribute('data-number-of-day');
        let eleDueDate = row.querySelector('.table-row-due-date');
        if (date && numberOfDay && eleDueDate) {
            eleDueDate.innerHTML = calculateDate(date, {'number_day_after': parseInt(numberOfDay)});
        }
        return true;
    };

    static loadDataTableCost() {
        let $table = $('#datable-quotation-create-cost');
        let $tableProduct = $('#datable-quotation-create-product');
        // clear table
        $table.DataTable().clear().draw();
        $table[0].querySelector('.quotation-create-cost-pretax-amount').innerHTML = "0";
        $table[0].querySelector('.quotation-create-cost-taxes').innerHTML = "0";
        $table[0].querySelector('.quotation-create-cost-total').innerHTML = "0";
        // copy data tab detail to table cost
        if ($table.DataTable().data().count() === 0) {  // if dataTable empty then add init
            let valueOrder = 0;
            $tableProduct.DataTable().rows().every(function () {
                let row = this.node();
                let valueQuantity = 0;
                let valuePrice = 0;
                let valueTaxAmount = 0;
                let valueSubtotal = 0;
                let dataProduct = {};
                let dataUOM = {};
                let dataTax = {};
                let product = row.querySelector('.table-row-item');
                let uom = row.querySelector('.table-row-uom');
                let tax = row.querySelector('.table-row-tax');
                let shipping = row.querySelector('.table-row-shipping');
                if ($(product).val()) { // PRODUCT
                    dataProduct = SelectDDControl.get_data_from_idx($(product), $(product).val());
                    valuePrice = dataProduct?.['sale_cost'] ? dataProduct?.['sale_cost'] : 0;
                    if ($(uom).val()) {
                        dataUOM = SelectDDControl.get_data_from_idx($(uom), $(uom).val());
                    }
                    if ($(tax).val()) {
                        dataTax = SelectDDControl.get_data_from_idx($(tax), $(tax).val());
                    }
                    valueQuantity = parseFloat(row.querySelector('.table-row-quantity').value);
                    valueOrder++
                    let dataAdd = {
                        "tax": {
                            "id": "",
                            "code": "",
                            "title": "",
                            "value": 0
                        },
                        "order": valueOrder,
                        "product": {
                            "id": "",
                            "code": "",
                            "title": ""
                        },
                        "product_code": "",
                        "product_title": "",
                        "unit_of_measure": {
                            "id": "",
                            "code": "",
                            "title": ""
                        },
                        "product_quantity": valueQuantity,
                        "product_uom_code": "",
                        "product_tax_title": "",
                        "product_tax_value": 0,
                        "product_uom_title": "",
                        "product_cost_price": valuePrice,
                        "product_tax_amount": valueTaxAmount,
                        "product_subtotal_price": valueSubtotal,
                        "is_shipping": false,
                        "shipping": {},
                    }
                    let newRow = $table.DataTable().row.add(dataAdd).draw().node();
                    QuotationLoadDataHandle.loadBoxQuotationProduct($(newRow.querySelector('.table-row-item')), dataProduct);
                    QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')), dataUOM);
                    QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')), dataTax);
                } else if (shipping) { // SHIPPING
                    let shippingID = shipping.getAttribute('data-id');
                    let shippingTitle = shipping.value;
                    valueQuantity = 1;
                    valueSubtotal = parseFloat(row.querySelector('.table-row-subtotal-raw').value);
                    // check if margin then minus
                    let shippingPriceMargin = shipping.getAttribute('data-shipping-price-margin');
                    if (shippingPriceMargin) {
                        if (parseFloat(shippingPriceMargin) > 0) {
                            valueSubtotal = valueSubtotal - parseFloat(shippingPriceMargin);
                        }
                    }
                    valueOrder++
                    let dataAdd = {
                        "tax": {
                            "id": "",
                            "code": "",
                            "title": "",
                            "value": 0
                        },
                        "order": valueOrder,
                        "product": {
                            "id": shippingID,
                            "code": "",
                            "title": shippingTitle
                        },
                        "product_code": "",
                        "product_title": shippingTitle,
                        "unit_of_measure": {
                            "id": "",
                            "code": "",
                            "title": ""
                        },
                        "product_quantity": valueQuantity,
                        "product_uom_code": "",
                        "product_tax_title": "",
                        "product_tax_value": 0,
                        "product_uom_title": "",
                        "product_cost_price": valueSubtotal,
                        "product_tax_amount": valueTaxAmount,
                        "product_subtotal_price": valueSubtotal,
                        "is_shipping": true,
                        "shipping": {"id": shippingID},
                    }
                    let newRow = $table.DataTable().row.add(dataAdd).draw().node();
                    QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')), dataUOM);
                    QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')), dataTax);
                }
            })
            // Re calculate
            QuotationCalculateCaseHandle.calculateAllRowsTableCost($table);
        }
    };

    static loadSetWFRuntimeZone() {
        let $form = $('#frm_quotation_create');
        if ($form.attr('data-method').toLowerCase() === 'get' || $form.attr('data-method').toLowerCase() === 'put') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    let dataDetail = JSON.parse(eleDetail.val());
                    // set again WF runtime
                    if (Object.keys(dataDetail).length > 0) {
                        WFRTControl.setWFRuntimeID(dataDetail?.['workflow_runtime_id']);
                    }
                }
            }
        }
    };

    static loadCopyData(ele) {
        let formSubmit = $('#frm_quotation_create');
        let divCopyOption = $('#copy-quotation-option');
        let tableCopyQuotationProduct = $('#datable-copy-quotation-product');
        let tableProduct = $('#datable-quotation-create-product');
        let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
        let dataCopyTo = {'id': dataCopy.id, 'option': 'all'};
        let type = $(ele)[0].getAttribute('data-copy-type');
        if (divCopyOption[0].querySelector('.check-option').checked === false) { // if option copy is custom then setup data products & costs for load
            let result = [];
            let productCopyTo = [];
            let order = 0;
            tableCopyQuotationProduct.DataTable().rows().every(function () {
                let row = this.node();
                let check = row.querySelector('.table-row-check-product');
                if (check.checked === true) {
                    let quantyInput = row.querySelector('.table-row-quantity-input').value;
                    let prodID = check.getAttribute('data-id');
                    for (let i = 0; i < dataCopy.quotation_products_data.length; i++) {
                        let data = dataCopy.quotation_products_data[i];
                        if (data.product.id === prodID) {
                            data['product_quantity'] = parseFloat(quantyInput);
                            order++
                            data['order'] = order;
                            result.push(data);
                            productCopyTo.push({'id': data.product.id, 'quantity': parseFloat(quantyInput)})
                            break
                        }
                    }
                }
            });
            dataCopy['quotation_products_data'] = result;
            dataCopyTo['option'] = 'custom';
            dataCopyTo['products'] = productCopyTo;
            dataCopy['quotation_costs_data'] = [];
        } else { // if option copy is ALL product
            dataCopy['quotation_products_data'] = dataCopy.quotation_products_data;
        }
        if (type === 'copy-from') { // COPY FROM (SALE ORDER CREATE -> CHOOSE QUOTATION)
            // Begin load data copy FROM
            document.getElementById('customer-price-list').value = dataCopy.customer?.['customer_price_list'];
            QuotationLoadDataHandle.loadDataTablesAndDropDowns(dataCopy);
            QuotationLoadDataHandle.loadDetailQuotation(dataCopy, true);
            QuotationCalculateCaseHandle.calculateAllRowsTableProduct(tableProduct);
            // Check promotion -> re calculate
            QuotationLoadDataHandle.loadReApplyPromotion(dataCopy, tableProduct);
            // load again table cost
            QuotationLoadDataHandle.loadDataTableCost();
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
            // Set form novalidate
            formSubmit[0].setAttribute('novalidate', 'novalidate');
        } else if (type === 'copy-to') { // COPY TO (QUOTATION DETAIL -> SALE ORDER CREATE)
            // create URL and add to href
            let eleRedirect = document.getElementById('link-to-sale-order-create');
            let urlSaleOrder = eleRedirect.getAttribute('data-url') + "?data_copy_to=" + encodeURIComponent(JSON.stringify(dataCopyTo));
            eleRedirect.setAttribute('href', urlSaleOrder);
            // active event on click <a>
            eleRedirect.click();
        }
    };

    // Load detail
    static loadDetailQuotation(data, is_copy = false) {
        let form = document.getElementById('frm_quotation_create');
        if (data?.['title'] && is_copy === false) {
            document.getElementById('quotation-create-title').value = data?.['title'];
        }
        if (data?.['opportunity'] && data?.['sale_person']) {
            new $x.cls.bastionField({
                has_opp: true,
                has_inherit: true,
                data_inherit: [{
                    "id": data?.['sale_person']?.['id'],
                    "full_name": data?.['sale_person']?.['full_name'] || '',
                    "first_name": data?.['sale_person']?.['first_name'] || '',
                    "last_name": data?.['sale_person']?.['last_name'] || '',
                    "email": data?.['sale_person']?.['email'] || '',
                    "is_active": data?.['sale_person']?.['is_active'] || false,
                    "selected": true,
                }],
                data_opp: [{
                    "id": data?.['opportunity']?.['id'] || '',
                    "title": data?.['opportunity']?.['title'] || '',
                    "code": data?.['opportunity']?.['code'] || '',
                    "selected": true,
                }]
            }).init();
        }
        if (Object.keys(data?.['opportunity']).length > 0) {
            if (data?.['opportunity']?.['quotation_id'] !== data?.['id']) {  // Check if quotation is invalid in Opp => disabled btn copy to SO (only for detail page)
                if (form.getAttribute('data-method') === 'GET') {
                    let btnCopy = document.getElementById('btn-copy-quotation');
                    if (btnCopy) {
                        btnCopy.setAttribute('disabled', 'true');
                    }
                }
            }
        }
        if (data?.['customer']) {
            data['customer']['name'] = data['customer']['title'];
            if (is_copy === true) {
                data['customer']['is_copy'] = true;
            }
            QuotationLoadDataHandle.loadBoxQuotationCustomer(data?.['customer']);
        }
        if (data?.['contact']) {
            data['contact']['fullname'] = data['contact']['title'];
            QuotationLoadDataHandle.loadBoxQuotationContact(data?.['contact']);
        }
        if (data?.['payment_term']) {
            QuotationLoadDataHandle.loadBoxQuotationPaymentTerm(data?.['payment_term'])
        }
        if (data?.['quotation'] && data?.['sale_person']) {
            QuotationLoadDataHandle.loadBoxSOQuotation(data?.['quotation']);
        }
        if (data?.['date_created']) {
            $('#quotation-create-date-created').val(moment(data?.['date_created']).format('DD/MM/YYYY'));
        }
        if (data?.['is_customer_confirm'] && is_copy === false) {
            $('#quotation-customer-confirm')[0].checked = data?.['is_customer_confirm'];
        }
        if (is_copy === false) {
            // check if finish then hidden btn edit page
            if ([2, 3].includes(data?.['system_status'])) {
                let $btn = $('#btn-enable-edit');
                if ($btn.length) {
                    $btn[0].setAttribute('hidden', 'true');
                }
            }
            // check if is not finish then hidden btn delivery (Sale Order)
            if (![2, 3].includes(data?.['system_status'])) {
                if (form.classList.contains('sale-order')) {
                    let btnDelivery = $('#btnDeliverySaleOrder');
                    if (btnDelivery.length > 0){
                        btnDelivery[0].setAttribute('hidden', 'true');
                    }
                }
            }
            // check if is not finish then disable btn copy
            if (![2, 3].includes(data?.['system_status'])) {
                let btnCopy = document.getElementById('btn-copy-quotation');
                let eleTooltipBtnCopy = document.getElementById('tooltip-btn-copy');
                if (btnCopy) {
                    btnCopy.setAttribute('disabled', 'true');
                }
                if (eleTooltipBtnCopy) {
                    eleTooltipBtnCopy.removeAttribute('data-bs-original-title');
                    eleTooltipBtnCopy.setAttribute('data-bs-placement', 'top');
                    eleTooltipBtnCopy.setAttribute('title', QuotationLoadDataHandle.transEle.attr('data-not-allow-use'));
                }
            }
        }
        if (is_copy === true) {
            let dataQuotationCopy = {
                'id': data?.['id'],
                'title': data?.['title'],
                'code': data?.['code'],
            }
            QuotationLoadDataHandle.loadBoxSOQuotation(dataQuotationCopy);
        }
        if (data?.['quotation_logistic_data']) {
            document.getElementById('quotation-create-shipping-address').value = data?.['quotation_logistic_data']?.['shipping_address'];
            document.getElementById('quotation-create-billing-address').value = data?.['quotation_logistic_data']?.['billing_address'];
        } else if (data?.['sale_order_logistic_data']) {
            document.getElementById('quotation-create-shipping-address').value = data?.['sale_order_logistic_data']?.['shipping_address'];
            document.getElementById('quotation-create-billing-address').value = data?.['sale_order_logistic_data']?.['billing_address'];
        }
        $('#quotation-create-customer-shipping').val(data?.['customer_shipping_id']);
        $('#quotation-create-customer-billing').val(data?.['customer_billing_id']);
        // load totals
        QuotationLoadDataHandle.loadTotal(data, true, false, false);
        QuotationLoadDataHandle.loadTotal(data, false, true, false);
        QuotationLoadDataHandle.loadTotal(data, false, false, true);
    };

    static loadDataProductAll() {
        let table = document.getElementById('datable-quotation-create-product');
        for (let i = 0; i < table.tBodies[0].rows.length; i++) {
            let row = table.tBodies[0].rows[i];
            let eleItem = row.querySelector('.table-row-item');
            if (eleItem) {
                QuotationLoadDataHandle.loadPriceProduct(eleItem);
                // Re Calculate all data of rows & total
                QuotationCalculateCaseHandle.commonCalculate($(table), row, true, false, false);
            }
        }
    };

    static loadInitQuotationConfig(page_method) {
        let ele = $('#quotation-config-data');
        if (ele.hasClass('quotation-config')) {
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2(
                {
                    'url': url,
                    'method': method,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.val(JSON.stringify(data));
                        // check config first time
                        if (page_method === "POST" && !$('#data-init-quotation-copy-to').val()) {
                            QuotationCheckConfigHandle.checkConfig(true, null, true);
                        }
                    }
                }
            )
        }
    }

    static loadDataTablesAndDropDowns(data, is_detail = false) {
        QuotationLoadDataHandle.loadDataTables(data, is_detail);
        QuotationLoadDataHandle.loadTableDropDowns();
        return true;
    };

    static loadDataTables(data, is_detail = false) {
        let form = document.getElementById('frm_quotation_create');
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');
        let tableIndicator = $('#datable-quotation-create-indicator');
        let tablePaymentStage = $('#datable-quotation-payment-stage');
        let products_data = data?.['quotation_products_data'];
        let costs_data = data?.['quotation_costs_data'];
        let expenses_data = data?.['quotation_expenses_data'];
        let indicators_data = data?.['quotation_indicators_data'];
        if (data.hasOwnProperty('sale_order_products_data') && data.hasOwnProperty('sale_order_costs_data') && data.hasOwnProperty('sale_order_expenses_data') && data.hasOwnProperty('sale_order_indicators_data')) {
            products_data = data?.['sale_order_products_data'];
            costs_data = data?.['sale_order_costs_data'];
            expenses_data = data?.['sale_order_expenses_data'];
            indicators_data = data?.['sale_order_indicators_data'];
        }
        tableProduct.DataTable().clear().draw();
        tableCost.DataTable().clear().draw();
        tableExpense.DataTable().clear().draw();

        tableProduct.DataTable().rows.add(products_data).draw();
        tableCost.DataTable().rows.add(costs_data).draw();
        tableExpense.DataTable().rows.add(expenses_data).draw();
        // payment stage (sale order)
        if (form.classList.contains('sale-order')) {
            if (data?.['sale_order_payment_stage']) {
                tablePaymentStage.DataTable().clear().draw();
                tablePaymentStage.DataTable().rows.add(data?.['sale_order_payment_stage']).draw();
                tablePaymentStage.DataTable().rows().every(function () {
                    let row = this.node();
                    if (row.querySelector('.table-row-date')) {
                        $(row.querySelector('.table-row-date')).daterangepicker({
                            singleDatePicker: true,
                            timepicker: false,
                            showDropdowns: false,
                            minYear: 2023,
                            locale: {
                                format: 'DD/MM/YYYY'
                            },
                            maxYear: parseInt(moment().format('YYYY'), 10),
                        });
                    }
                })
            }
        }
        // load indicators & set attr disabled
        if (is_detail === true) {
            // load indicators
            tableIndicator.DataTable().clear().draw();
            tableIndicator.DataTable().rows.add(indicators_data).draw();
            // set disabled
            QuotationLoadDataHandle.loadTableDisabled(tableProduct);
            QuotationLoadDataHandle.loadTableDisabled(tableCost);
            QuotationLoadDataHandle.loadTableDisabled(tableExpense);
            if (form.classList.contains('sale-order')) {
                QuotationLoadDataHandle.loadTableDisabled(tablePaymentStage);
            }
            // mask money
            $.fn.initMaskMoney2();
        }
        return true
    };

    static loadTableDropDowns() {
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');
        QuotationLoadDataHandle.loadDropDowns(tableProduct);
        QuotationLoadDataHandle.loadDropDowns(tableCost);
        QuotationLoadDataHandle.loadDropDowns(tableExpense, true);
    };

    static loadDropDowns(table, is_expense = false) {
        if (!table[0].querySelector('.dataTables_empty')) {
            for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
                let row = table[0].tBodies[0].rows[i];
                let dataRow = JSON.parse(row.querySelector('.table-row-order')?.getAttribute('data-row'));
                if (is_expense === false) { // PRODUCT
                    $(row.querySelector('.table-row-item')).empty();
                    QuotationLoadDataHandle.loadBoxQuotationProduct($(row.querySelector('.table-row-item')), dataRow?.['product']);
                } else { // EXPENSE
                    $(row.querySelector('.table-row-item')).empty();
                    QuotationLoadDataHandle.loadBoxQuotationExpenseItem($(row.querySelector('.table-row-item')), dataRow?.['expense_item']);
                    if (row?.querySelector('.table-row-labor-item') && dataRow?.['is_labor'] === true) {
                        $(row.querySelector('.table-row-labor-item')).empty();
                        QuotationLoadDataHandle.loadBoxQuotationExpense($(row.querySelector('.table-row-labor-item')), dataRow?.['expense']);
                    }
                }
                $(row.querySelector('.table-row-uom')).empty();
                QuotationLoadDataHandle.loadBoxQuotationUOM($(row.querySelector('.table-row-uom')), dataRow?.['unit_of_measure']);
                $(row.querySelector('.table-row-tax')).empty();
                QuotationLoadDataHandle.loadBoxQuotationTax($(row.querySelector('.table-row-tax')), dataRow?.['tax']);
            }
        }
        return true;
    };

    static loadTableDisabled(table) {
        for (let ele of table[0].querySelectorAll('.table-row-item')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-labor-item')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-expense-title')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-uom')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-quantity')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-price')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-discount')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-tax')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.input-group-price')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.input-group-expense-purchase-product')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.del-row')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-remark')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-date')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-checkbox-invoice')) {
            ele.setAttribute('disabled', 'true');
        }
    };

    static loadReApplyPromotion(data, table) {
        if (Object.keys(data?.['customer']).length > 0) {
            let dataProductList = data?.['quotation_products_data'];
            for (let dataProduct of dataProductList) {
                if (Object.keys(dataProduct?.['promotion']).length > 0) {
                    let check = promotionClass.checkAvailablePromotion(dataProduct?.['promotion'], data?.['customer']?.['id']);
                    let promotionResult = promotionClass.getPromotionResult(check?.['condition']);
                    promotionClass.reCalculateIfPromotion(table, promotionResult?.['discount_rate_on_order'], promotionResult?.['product_price']);
                }
            }
        }
    };

}

// DataTable
class QuotationDataTableHandle {
    static productInitEle = $('#data-init-quotation-create-tables-product');
    static expenseItemInitEle = $('#data-init-quotation-create-tables-expense-item');
    static expenseInitEle = $('#data-init-quotation-create-tables-expense');
    static uomInitEle = $('#data-init-quotation-create-tables-uom');
    static taxInitEle = $('#data-init-quotation-create-tables-tax');

    static dataTableProduct(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-product');
        $tables.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            columns: [  // 50, 250, 200, 100, 150, 250, 150, 100, 200, 50 (1500p)
                {
                    targets: 0,
                    width: '3.33%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '16.66%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        let itemType = 0  // product
                        if (row.hasOwnProperty('product') && row.hasOwnProperty('promotion') && row.hasOwnProperty('shipping')) {
                            if (Object.keys(row['promotion']).length > 0) {
                                itemType = 1  // promotion
                            }
                            if (Object.keys(row['shipping']).length > 0) {
                                itemType = 2  // shipping
                            }
                        }
                        if (itemType === 0) { // PRODUCT
                            return `<div class="row">
                                        <div class="col-12">
                                            <select 
                                            class="form-select table-row-item" 
                                            data-url="${QuotationDataTableHandle.productInitEle.attr('data-url')}"
                                            data-link-detail="${QuotationDataTableHandle.productInitEle.attr('data-link-detail')}"
                                            data-method="${QuotationDataTableHandle.productInitEle.attr('data-method')}"
                                            data-keyResp="product_sale_list"
                                            data-zone="${dataZone}"
                                            required>
                                            </select>
                                        </div>
                                    </div>`;
                        } else if (itemType === 1) { // PROMOTION
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-promotion').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row?.['promotion']?.['id']);
                            }
                            return `<div class="row">
                                    <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <a href="${link}" target="_blank">
                                                <i class="fas fa-gift text-brown"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-promotion disabled-custom-show" value="${row.product_title}" data-id="${row.promotion.id}" data-is-promotion-on-row="${row.is_promotion_on_row}" data-id-product="${row.product.id}" data-bs-toggle="tooltip" title="${row.product_title}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        } else if (itemType === 2) { // SHIPPING
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-shipping').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row?.['shipping']?.['id']);
                            }
                            let price_margin = row?.['shipping']?.['shipping_price_margin'] ? row?.['shipping']?.['shipping_price_margin'] : "0";
                            return `<div class="row">
                                    <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <a href="${link}" target="_blank">
                                                <i class="fas fa-shipping-fast text-teal"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-shipping disabled-custom-show" value="${row?.['product_title']}" data-id="${row?.['shipping']?.['id']}" data-shipping-price-margin="${price_margin}" data-bs-toggle="tooltip" title="${row?.['product_title']}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '13.33%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="row">
                                    <p><span class="table-row-description" data-zone="${dataZone}">${row?.['product']?.['description'] ? row?.['product']?.['description'] : ''}</span></p>
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    width: '6.66%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        let itemType = 0  // product
                        if (row.hasOwnProperty('product') && row.hasOwnProperty('promotion') && row.hasOwnProperty('shipping')) {
                            if (Object.keys(row['promotion']).length > 0) {
                                itemType = 1  // promotion
                            }
                            if (Object.keys(row['shipping']).length > 0) {
                                itemType = 2  // shipping
                            }
                        }
                        if (itemType === 0) {  // product
                            return `<select 
                                        class="form-select table-row-uom"
                                        data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        data-zone="${dataZone}"
                                        required
                                     >
                                    </select>`;
                        } else {  // promotion || shipping
                            return `<select 
                                        class="form-select table-row-uom"
                                        data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        required
                                        disabled
                                     >
                                    </select>`;
                        }
                    },
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity validated-number" value="${row?.['product_quantity']}" data-zone="${dataZone}" required>`;
                    }
                },
                {
                    targets: 5,
                    width: '16.66%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="row">
                                    <div class="dropdown">
                                        <div class="input-group dropdown-action input-group-price" aria-expanded="false" data-bs-toggle="dropdown">
                                        <div class="input-affix-wrapper">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-price" 
                                                value="${row?.['product_unit_price']}"
                                                data-return-type="number"
                                                data-zone="${dataZone}"
                                            >
                                            <div class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-caret-down"></i></div>
                                        </div>
                                        </div>
                                        <div role="menu" class="dropdown-menu table-row-price-list w-650p">
                                        <a class="dropdown-item" data-value=""></a>
                                        </div>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="row">
                                    <div class="input-group">
                                        <div class="input-affix-wrapper">
                                            <input type="text" class="form-control table-row-discount validated-number" value="${row?.['product_discount_value']}" data-zone="${dataZone}">
                                            <div class="input-suffix"><i class="fas fa-percentage"></i></div>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        class="form-control mask-money table-row-discount-amount"
                                        data-return-type="number"
                                        hidden
                                    >
                                    <input
                                        type="text"
                                        class="form-control table-row-discount-amount-raw"
                                        value="0"
                                        hidden
                                    >
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '6.66%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        let taxID = "";
                        let taxRate = "0";
                        if (row?.['tax']) {
                            taxID = row?.['tax']?.['id'];
                            taxRate = row?.['tax']?.['value'];
                        }
                        let itemType = 0  // product
                        if (row.hasOwnProperty('product') && row.hasOwnProperty('promotion') && row.hasOwnProperty('shipping')) {
                            if (Object.keys(row['promotion']).length > 0) {
                                itemType = 1  // promotion
                            }
                            if (Object.keys(row['shipping']).length > 0) {
                                itemType = 2  // shipping
                            }
                        }
                        if (itemType === 0) {  // product
                            return `<select 
                                        class="form-select table-row-tax"
                                        data-url="${QuotationDataTableHandle.taxInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.taxInitEle.attr('data-method')}"
                                        data-keyResp="tax_list"
                                        data-zone="${dataZone}"
                                     >
                                    </select>
                                    <input
                                        type="text"
                                        class="form-control mask-money table-row-tax-amount"
                                        value="${row?.['product_tax_amount']}"
                                        data-return-type="number"
                                        hidden
                                    >
                                    <input
                                        type="text"
                                        class="form-control table-row-tax-amount-raw"
                                        value="${row?.['product_tax_amount']}"
                                        hidden
                                    >`;
                        } else {  // promotion || shipping
                            return `<select class="form-select table-row-tax disabled-custom-show" disabled>
                                        <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                    </select>
                                    <input
                                        type="text"
                                        class="form-control mask-money table-row-tax-amount"
                                        value="${row?.['product_tax_amount']}"
                                        data-return-type="number"
                                        hidden
                                    >
                                    <input
                                        type="text"
                                        class="form-control table-row-tax-amount-raw"
                                        value="${row?.['product_tax_amount']}"
                                        hidden
                                    >`;
                        }
                    }
                },
                {
                    targets: 8,
                    width: '13.33%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="row subtotal-area">
                                <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}" data-zone="${dataZone}"></span></p>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row?.['product_subtotal_price']}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 9,
                    width: '3.33%',
                    render: () => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" data-zone="${dataZone}"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                },
            ],
        });

    }

    static dataTableCost(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-cost');
        $tables.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_costs_data_readonly";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data_readonly";
                        }
                        let itemType = 0  // product
                        if (row.hasOwnProperty('product') && row.hasOwnProperty('shipping')) {
                            if (Object.keys(row['shipping']).length > 0) {
                                itemType = 1  // shipping
                            }
                        }
                        if (itemType === 0) {  // product
                            return `<select
                                        class="form-select table-row-item disabled-custom-show"
                                        data-url="${QuotationDataTableHandle.productInitEle.attr('data-url')}"
                                        data-link-detail="${QuotationDataTableHandle.productInitEle.attr('data-link-detail')}"
                                        data-method="${QuotationDataTableHandle.productInitEle.attr('data-method')}"
                                        data-keyResp="product_sale_list"
                                        data-zone="${dataZone}"
                                        disabled
                                    >
                                    </select>`;
                        } else if (itemType === 1) {  // shipping
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-shipping').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row.shipping.id);
                            }
                            return `<div class="row">
                                    <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <a href="${link}" target="_blank">
                                                <i class="fas fa-shipping-fast text-teal"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-shipping disabled-custom-show" value="${row.product_title}" data-id="${row.shipping.id}" data-bs-toggle="tooltip" title="${row.product_title}" data-zone="${dataZone}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    render: () => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_costs_data_readonly";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data_readonly";
                        }
                        return `<select 
                                    class="form-select table-row-uom disabled-custom-show"
                                    data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                    data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                    data-keyResp="unit_of_measure"
                                    data-zone="${dataZone}"
                                    disabled
                                >
                                </select>`;
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_costs_data_readonly";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data_readonly";
                        }
                        return `<input type="text" class="form-control table-row-quantity disabled-custom-show" value="${row.product_quantity}" data-zone="${dataZone}" disabled>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_costs_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        let itemType = 0  // product
                        if (row.hasOwnProperty('product') && row.hasOwnProperty('shipping')) {
                            if (Object.keys(row['shipping']).length > 0) {
                                itemType = 1  // shipping
                            }
                        }
                        if (itemType === 0) {  // product
                            return `<input 
                                        type="text" 
                                        class="form-control mask-money table-row-price" 
                                        data-return-type="number"
                                        value="${row.product_cost_price}"
                                        data-zone="${dataZone}"
                                        required
                                    >`;
                        } else if (itemType === 1) {  // shipping
                            return `<input 
                                        type="text" 
                                        class="form-control mask-money table-row-price disabled-custom-show" 
                                        data-return-type="number"
                                        value="${row.product_cost_price}"
                                        data-zone="${dataZone}"
                                        required
                                        disabled
                                    >`;
                        }
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_costs_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        let itemType = 0  // product
                        if (row.hasOwnProperty('product') && row.hasOwnProperty('shipping')) {
                            if (Object.keys(row['shipping']).length > 0) {
                                itemType = 1  // shipping
                            }
                        }
                        if (itemType === 0) {  // product
                            return `<select 
                                        class="form-select table-row-tax"
                                        data-url="${QuotationDataTableHandle.taxInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.taxInitEle.attr('data-method')}"
                                        data-keyResp="tax_list"
                                        data-zone="${dataZone}"
                                    >
                                    </select>
                                    <input
                                        type="text"
                                        class="form-control mask-money table-row-tax-amount"
                                        value="${row.product_tax_amount}"
                                        data-return-type="number"
                                        hidden
                                    >
                                    <input
                                        type="text"
                                        class="form-control table-row-tax-amount-raw"
                                        value="${row.product_tax_amount}"
                                        hidden
                                    >`;
                        } else if (itemType === 1) {  // shipping
                            return `<select 
                                        class="form-select table-row-tax disabled-custom-show"
                                        data-url="${QuotationDataTableHandle.taxInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.taxInitEle.attr('data-method')}"
                                        data-keyResp="tax_list"
                                        disabled
                                    >
                                    </select>
                                    <input
                                        type="text"
                                        class="form-control mask-money table-row-tax-amount"
                                        value="${row.product_tax_amount}"
                                        data-return-type="number"
                                        hidden
                                    >
                                    <input
                                        type="text"
                                        class="form-control table-row-tax-amount-raw"
                                        value="${row.product_tax_amount}"
                                        hidden
                                    >`;
                        }
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_costs_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<div class="row subtotal-area">
                                <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}" data-zone="${dataZone}"></span></p>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row.product_subtotal_price}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 7,
                    render: () => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_costs_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" data-zone="${dataZone}"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                },
            ],
        });
    }

    static dataTableExpense(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-expense');
        $tables.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            columns: [  // 50,300,300,100,150,250,100,200,50 (1500p)
                {
                    targets: 0,
                    width: '3.33%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_expenses_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        if (row?.['is_labor'] === false) {
                            return `<input type="text" class="form-control table-row-expense-title" value="${row?.['expense_title']}" data-zone="${dataZone}" required>`;
                        } else {
                            return `<select 
                                    class="form-select table-row-labor-item" 
                                    data-url="${QuotationDataTableHandle.expenseInitEle.attr('data-url')}"
                                    data-link-detail="${QuotationDataTableHandle.expenseInitEle.attr('data-link-detail')}"
                                    data-method="${QuotationDataTableHandle.expenseInitEle.attr('data-method')}"
                                    data-keyResp="expense_list"
                                    data-zone="${dataZone}"
                                    required>
                                    </select>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_expenses_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        if (row?.['is_labor'] === false) {
                           return `<select 
                                    class="form-select table-row-item" 
                                    data-url="${QuotationDataTableHandle.expenseItemInitEle.attr('data-url')}"
                                    data-link-detail="${QuotationDataTableHandle.expenseItemInitEle.attr('data-link-detail')}"
                                    data-method="${QuotationDataTableHandle.expenseItemInitEle.attr('data-method')}"
                                    data-keyResp="expense_item_list"
                                    data-zone="${dataZone}"
                                    required>
                                    </select>`;
                        } else {
                            return `<select 
                                    class="form-select table-row-item" 
                                    data-url="${QuotationDataTableHandle.expenseItemInitEle.attr('data-url')}"
                                    data-link-detail="${QuotationDataTableHandle.expenseItemInitEle.attr('data-link-detail')}"
                                    data-method="${QuotationDataTableHandle.expenseItemInitEle.attr('data-method')}"
                                    data-keyResp="expense_item_list"
                                    data-zone="${dataZone}"
                                    disabled>
                                    </select>`;
                        }

                    }
                },
                {
                    targets: 3,
                    width: '6.66%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_expenses_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        if (row?.['is_labor'] === false) {
                           return `<select 
                                        class="form-select table-row-uom"
                                        data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        data-zone="${dataZone}"
                                        required
                                    >
                                    </select>`;
                        } else {
                            return `<select 
                                        class="form-select table-row-uom"
                                        data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        data-zone="${dataZone}"
                                        required
                                        disabled
                                    >
                                    </select>`;
                        }
                    },
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_expenses_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity validated-number" value="${row?.['expense_quantity']}" data-zone="${dataZone}" required>`;
                    }
                },
                {
                    targets: 5,
                    width: '16.66%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_expenses_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    value="${row?.['expense_price']}"
                                    data-return-type="number"
                                    data-zone="${dataZone}"
                                >`;
                    }
                },
                {
                    targets: 6,
                    width: '6.66%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_expenses_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<select 
                                    class="form-select table-row-tax"
                                    data-url="${QuotationDataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${QuotationDataTableHandle.taxInitEle.attr('data-method')}"
                                    data-keyResp="tax_list"
                                    data-zone="${dataZone}"
                                >
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.expense_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.expense_tax_amount}"
                                    hidden
                                >`;
                    }
                },
                {
                    targets: 7,
                    width: '13.33%',
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_expenses_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<div class="row subtotal-area">
                                <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['expense_subtotal_price'] ? row?.['expense_subtotal_price'] : '0')}" data-zone="${dataZone}"></span></p>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row.expense_subtotal_price}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 8,
                    width: '3.33%',
                    render: () => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_expenses_data";
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" data-zone="${dataZone}"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                },
            ],
        });
    }

    static dataTablePromotion(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-promotion');
        $tables.DataTableDefault({
            data: data ? data : [],
            // searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function () {
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.is_pass === true) {
                            return `<button type="button" class="btn btn-primary apply-promotion" data-promotion-condition="${JSON.stringify(row.condition).replace(/"/g, "&quot;")}" data-promotion-id="${row.id}" data-bs-dismiss="modal">${QuotationLoadDataHandle.transEle.attr('data-apply')}</button>`;
                        } else {
                            return `<button type="button" class="btn btn-primary apply-promotion" disabled>${QuotationLoadDataHandle.transEle.attr('data-apply')}</button>`;
                        }
                    },
                }
            ],
        });
    }

    static loadTableQuotationPromotion(promotion_id, customer_id = null, is_submit_check = false) {
        let self = this;
        let jqueryId = '#' + promotion_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        let passList = [];
        let failList = [];
        let checkList = [];
        if (customer_id) {
            let data_filter = {
                'customer_type': 0,
                'customers_map_promotion__id': customer_id
            };
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'data': data_filter,
                    'isDropdown': true,
                }
                // url, method, data_filter
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('promotion_check_list') && Array.isArray(data.promotion_check_list)) {
                            $('#datable-quotation-create-promotion').DataTable().destroy();
                            data.promotion_check_list.map(function (item) {
                                if (!checkList.includes(item.id)) {
                                    let check = promotionClass.checkAvailablePromotion(item, customer_id);
                                    if (check.is_pass === true) {
                                        item['is_pass'] = true;
                                        item['condition'] = check.condition;
                                        passList.push(item);
                                    } else {
                                        item['is_pass'] = false;
                                        failList.push(item);
                                        if (is_submit_check === true) { // check again promotion limit when submit
                                            let tableProduct = document.getElementById('datable-quotation-create-product');
                                            let rowPromotion = tableProduct.querySelector('.table-row-promotion');
                                            if (rowPromotion) {
                                                if (item.id === rowPromotion.getAttribute('data-id')) {
                                                    // Delete Promotion Row & ReCalculate Total
                                                    deletePromotionRows($(tableProduct), true, false);
                                                    QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false);
                                                    return true
                                                } else {
                                                    return true
                                                }
                                            } else {
                                                return true
                                            }
                                        }
                                    }
                                    checkList.push(item.id)
                                }
                            })
                            passList = passList.concat(failList);
                            self.dataTablePromotion(passList);
                        }
                    }
                }
            )
        }
        return true
    }

    static dataTableCopyQuotation(data) {
        // init dataTable
        let $tables = $('#datable-copy-quotation');
        $tables.DataTableDefault({
            data: data ? data : [],
            // paging: false,
            // ordering: false,
            // info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox"
                                        class="form-check-input table-row-check"
                                        data-id="${row.id}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.code}</span>`
                    },
                }
            ],
        });
    }

    static dataTableCopyQuotationProduct(data) {
        // init dataTable
        let $tables = $('#datable-copy-quotation-product');
        $tables.DataTableDefault({
            data: data ? data : [],
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function () {
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox"
                                        class="form-check-input table-row-check-product"
                                        data-id="${row.product.id}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.product_title}</span>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row.product_quantity}</span>`
                    },
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity-input" value="${row.product_quantity}">`
                    },
                }
            ],
        });
    }

    static dataTableShipping(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-shipping');
        $tables.DataTableDefault({
            data: data ? data : [],
            // searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function () {
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row.is_pass === true) {
                            return `<button type="button" class="btn btn-primary apply-shipping" data-shipping-price="${row.final_shipping_price}" data-shipping-price-margin="${row.margin_shipping_price}" data-shipping-id="${row.id}" data-shipping="${JSON.stringify(row.data_shipping).replace(/"/g, "&quot;")}" data-bs-dismiss="modal">Apply</button>`;
                        } else {
                            return `<button type="button" class="btn btn-primary apply-shipping" disabled>Apply</button>`;
                        }
                    },
                }
            ],
        });
    }

    static loadTableQuotationShipping(shipping_id) {
        let self = this;
        let jqueryId = '#' + shipping_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        let passList = [];
        let failList = [];
        let checkList = [];
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
            // url, method
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('shipping_check_list') && Array.isArray(data.shipping_check_list)) {
                        $('#datable-quotation-create-shipping').DataTable().destroy();
                        let shippingAddress = $('#quotation-create-shipping-address').val();
                        if (shippingAddress) {
                            data.shipping_check_list.map(function (item) {
                                if (!checkList.includes(item.id)) {
                                    let check = shippingClass.checkAvailableShipping(item, shippingAddress)
                                    if (check.is_pass === true) {
                                        item['is_pass'] = true;
                                        item['final_shipping_price'] = check.final_shipping_price;
                                        item['margin_shipping_price'] = check.margin_shipping_price;
                                        item['data_shipping'] = check.data_shipping;
                                        passList.push(item)
                                    } else {
                                        item['is_pass'] = false;
                                        failList.push(item)
                                    }
                                    checkList.push(item.id)
                                }
                            })
                            passList = passList.concat(failList);
                            self.dataTableShipping(passList);
                        } else {
                            self.dataTableShipping(passList);
                            $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-check-if-shipping-address')}, 'failure');
                        }
                    }
                }
            }
        )
    }

    static dataTableQuotationIndicator(data) {
        $('#datable-quotation-create-indicator').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            drawCallback: function () {
                $.fn.initMaskMoney2();
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order" data-value="${(meta.row + 1)}" data-zone="quotation_indicators_data">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title" data-id="${row?.['indicator']?.['id']}" data-zone="quotation_indicators_data">${row?.['indicator']?.['title']}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row?.['indicator_value'])}" data-value="${row?.['indicator_value']}" data-zone="quotation_indicators_data"></span>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-rate" data-value="${row?.['indicator_rate']}" data-zone="quotation_indicators_data">${row?.['indicator_rate']} %</span>`
                    }
                }
            ],
        });
    }

    static dataTableSaleOrderIndicator(data) {
        $('#datable-quotation-create-indicator').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            drawCallback: function () {
                // render icon after table callback
                feather.replace();
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order" data-value="${(meta.row + 1)}" data-zone="sale_order_indicators_data">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title" data-id="${row.quotation_indicator.id}" data-zone="sale_order_indicators_data">${row.quotation_indicator.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-quotation-value" data-init-money="${parseFloat(row.quotation_indicator_value)}" data-value="${row.quotation_indicator_value}" data-zone="sale_order_indicators_data"></span>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row.indicator_value)}" data-value="${row.indicator_value}" data-zone="sale_order_indicators_data"></span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-difference-value" data-init-money="${parseFloat(row.difference_indicator_value)}" data-value="${row.difference_indicator_value}" data-zone="sale_order_indicators_data"></span>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-rate" data-value="${row.indicator_rate}" data-zone="sale_order_indicators_data">${row.indicator_rate} %</span>`
                    }
                }
            ],
        });
    }

    static dataTablePaymentStage(data) {
        // init dataTable
        let $tables = $('#datable-quotation-payment-stage');
        $tables.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        let dataStage = JSON.parse($('#payment_term_stage').text());
                        return `<span class="table-row-stage" data-row="${dataRow}" data-stage="${row?.['stage']}" data-order="${(meta.row + 1)}">${dataStage[row?.['stage']][1]}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-remark" value="${row?.['remark'] ? row?.['remark'] : ''}">`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row?.['date'] !== '') {
                            return `<div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-date" data-number-of-day="${row?.['number_of_day']}" value="${moment(row?.['date']).format('DD/MM/YYYY')}">
                                        <div class="input-suffix"><i class="far fa-calendar"></i></div>
                                    </div>`;
                        } else {
                            return `<div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-date" data-number-of-day="${row?.['number_of_day']}" value="">
                                        <div class="input-suffix"><i class="far fa-calendar"></i></div>
                                    </div>`;
                        }
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let dataDateType = JSON.parse($('#payment_date_type').text());
                        if (row?.['stage'] !== 0) {
                            return `<span class="table-row-date-type" data-date-type="${row?.['date_type']}">${dataDateType[row?.['date_type']][1]}</span>`;
                        } else {
                            return `<span></span>`;
                        }
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (row?.['stage'] !== 0) {
                            return `<span class="table-row-ratio" data-ratio="${row?.['payment_ratio']}">${row?.['payment_ratio']} %</span>`;
                        } else {
                            return `<span></span>`;
                        }
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        if (row?.['stage'] !== 0) {
                            return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row?.['value_before_tax'] ? row?.['value_before_tax'] : '0')}"></span>`;
                        } else {
                            return `<span></span>`;
                        }
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        if (row?.['due_date']) {
                            return `<p class="table-row-due-date">${moment(row?.['due_date'] ? row?.['due_date'] : '').format('DD/MM/YYYY')}</p>`;
                        } else {
                            return `<p class="table-row-due-date"></p>`;
                        }
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        if (row?.['is_ar_invoice'] === true) {
                            return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox-invoice" checked></div>`;
                        } else {
                            return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox-invoice"></div>`;
                        }
                    }
                },
            ],
        });
    }
}

// Calculate
class QuotationCalculateCaseHandle {

    static updateTotal(table, is_product, is_cost, is_expense) {
        let form = document.getElementById('frm_quotation_create');
        let pretaxAmount = 0;
        let discountAmount = 0;
        let taxAmount = 0;
        let elePretaxAmount = null;
        let eleTaxes = null;
        let eleTotal = null;
        let eleDiscount = null;
        let elePretaxAmountRaw = null;
        let eleTaxesRaw = null;
        let eleTotalRaw = null;
        let eleDiscountRaw = null;
        let eleDiscountRateTotal = null;
        let finalRevenueBeforeTax = null;
        if (is_product === true) {
            let tableProduct = document.getElementById('datable-quotation-create-product');
            if (tableProduct.closest('.dataTables_scroll')) {
                let tableProductFt = tableProduct.closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot');
                elePretaxAmount = tableProductFt.querySelector('.quotation-create-product-pretax-amount');
                eleTaxes = tableProductFt.querySelector('.quotation-create-product-taxes');
                eleTotal = tableProductFt.querySelector('.quotation-create-product-total');
                eleDiscount = tableProductFt.querySelector('.quotation-create-product-discount-amount');
                elePretaxAmountRaw = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
                eleTaxesRaw = tableProductFt.querySelector('.quotation-create-product-taxes-raw');
                eleTotalRaw = tableProductFt.querySelector('.quotation-create-product-total-raw');
                eleDiscountRaw = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
                eleDiscountRateTotal = tableProductFt.querySelector('.quotation-create-product-discount');
                finalRevenueBeforeTax = tableProductFt.querySelector('.quotation-final-revenue-before-tax');
            }
        } else if (is_cost === true) {
            let tableCost = document.getElementById('datable-quotation-create-cost');
            elePretaxAmount = tableCost.querySelector('.quotation-create-cost-pretax-amount');
            eleTaxes = tableCost.querySelector('.quotation-create-cost-taxes');
            eleTotal = tableCost.querySelector('.quotation-create-cost-total');
            elePretaxAmountRaw = tableCost.querySelector('.quotation-create-cost-pretax-amount-raw');
            eleTaxesRaw = tableCost.querySelector('.quotation-create-cost-taxes-raw');
            eleTotalRaw = tableCost.querySelector('.quotation-create-cost-total-raw');
        } else if (is_expense === true) {
            let tableExpense = document.getElementById('datable-quotation-create-expense');
            if (tableExpense.closest('.dataTables_scroll')) {
                let tableExpenseFt = tableExpense.closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot');
                elePretaxAmount = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount');
                eleTaxes = tableExpenseFt.querySelector('.quotation-create-expense-taxes');
                eleTotal = tableExpenseFt.querySelector('.quotation-create-expense-total');
                elePretaxAmountRaw = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount-raw');
                eleTaxesRaw = tableExpenseFt.querySelector('.quotation-create-expense-taxes-raw');
                eleTotalRaw = tableExpenseFt.querySelector('.quotation-create-expense-total-raw');
            }
        }
        if (elePretaxAmount && elePretaxAmountRaw && eleTaxes && eleTaxesRaw && eleTotal && eleTotalRaw) {
            let shippingFee = 0;
            let tableLen = table.tBodies[0].rows.length;
            for (let i = 0; i < tableLen; i++) {
                let row = table.tBodies[0].rows[i];
                let is_promotion = false;
                if (row.querySelector('.table-row-promotion')) {
                    is_promotion = true
                }
                // calculate Pretax Amount
                let subtotalRaw = row.querySelector('.table-row-subtotal-raw');
                if (subtotalRaw) {
                    if (subtotalRaw.value) {
                        // check if not promotion then plus else minus
                        if (is_promotion === false) { // not promotion
                            pretaxAmount += parseFloat(subtotalRaw.value)
                        } else { // promotion
                            if (row.querySelector('.table-row-promotion').getAttribute('data-is-promotion-on-row') === "true") {
                                pretaxAmount -= parseFloat(subtotalRaw.value)
                            }
                        }
                        // get shipping fee to minus on discount total
                        if (row.querySelector('.table-row-shipping')) {
                            shippingFee = parseFloat(subtotalRaw.value);
                        }
                    }
                }
                // calculate Tax Amount
                let subTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
                if (subTaxAmountRaw) {
                    if (subTaxAmountRaw.value) {
                        // check if not promotion then plus else minus
                        if (is_promotion === false) { // not promotion
                            taxAmount += parseFloat(subTaxAmountRaw.value)
                        } else { // promotion
                            if (row.querySelector('.table-row-promotion').getAttribute('data-is-promotion-on-row') === "true") {
                                taxAmount -= parseFloat(subTaxAmountRaw.value)
                            }
                        }
                    }
                }
                // calculate Discount Amount
                let eleRowDiscountAmountRaw = row.querySelector('.table-row-discount-amount-raw');
                let eleRowQuantity = row.querySelector('.table-row-quantity');
                if (eleRowDiscountAmountRaw && eleRowQuantity) {
                    discountAmount += (parseFloat(eleRowDiscountAmountRaw.value) * parseFloat(eleRowQuantity.value));
                }
            }
            let discount_on_total = 0;
            let discountTotalRate = document.getElementById('datable-quotation-create-product').closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot').querySelector('.quotation-create-product-discount').value;
            if (form.classList.contains('sale-order')) {
                discountTotalRate = $('#quotation-copy-discount-on-total').val();
            }
            if (discountTotalRate && eleDiscount) {
                if (!form.classList.contains('sale-order')) {
                    discount_on_total = parseFloat(discountTotalRate);
                    discountAmount = ((pretaxAmount * discount_on_total) / 100);
                    // check if shipping fee then minus before calculate discount
                    if (shippingFee > 0) {
                        discountAmount = (((pretaxAmount - shippingFee) * discount_on_total) / 100);
                    }
                } else {
                    discount_on_total = parseFloat(discountTotalRate);
                    let discountAmountOnTotal = 0;
                    // check if shipping fee then minus before calculate discount
                    if (shippingFee > 0) {
                        discountAmountOnTotal = (((pretaxAmount - discountAmount - shippingFee) * discount_on_total) / 100);
                    } else {
                        discountAmountOnTotal = (((pretaxAmount - discountAmount) * discount_on_total) / 100);
                    }
                    discountAmount += discountAmountOnTotal;

                    if (pretaxAmount > 0) {
                        discount_on_total = ((discountAmount / pretaxAmount) * 100).toFixed(2);
                        if (eleDiscountRateTotal) {
                            eleDiscountRateTotal.value = discount_on_total;
                        }
                    }
                }
            }
            let totalFinal = (pretaxAmount - discountAmount + taxAmount);
            $(elePretaxAmount).attr('data-init-money', String(pretaxAmount));
            elePretaxAmountRaw.value = pretaxAmount;
            if (is_product === true) {
                if (finalRevenueBeforeTax) {
                    finalRevenueBeforeTax.value = pretaxAmount;
                }
            }
            if (eleDiscount && eleDiscountRaw) {
                $(eleDiscount).attr('data-init-money', String(discountAmount));
                eleDiscountRaw.value = discountAmount;
                if (finalRevenueBeforeTax) {
                    finalRevenueBeforeTax.value = (pretaxAmount - discountAmount);
                }
            }
            $(eleTaxes).attr('data-init-money', String(taxAmount));
            eleTaxesRaw.value = taxAmount;
            $(eleTotal).attr('data-init-money', String(totalFinal));
            eleTotalRaw.value = totalFinal;
        }
        $.fn.initMaskMoney2();
    };

    static calculate(row) {
        let form = document.getElementById('frm_quotation_create');
        let price = 0;
        let quantity = 0;
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            price = $(elePrice).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-quantity');
        if (eleQuantity) {
            if (eleQuantity.value) {
                quantity = parseFloat(eleQuantity.value)
            } else if (!eleQuantity.value || eleQuantity.value === "0") {
                quantity = 0
            }
        }
        let tax = 0;
        let discount = 0;
        let subtotal = (price * quantity);
        let subtotalPlus = 0;
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax.hasOwnProperty('rate')) {
                    tax = parseInt(dataTax.rate);
                }
            }
        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        let eleTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
        // calculate discount + tax
        let eleDiscount = row.querySelector('.table-row-discount');
        let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
        let eleDiscountAmountRaw = row.querySelector('.table-row-discount-amount-raw');
        if (eleDiscount && eleDiscountAmount) {
            if (eleDiscount.value) {
                discount = parseFloat(eleDiscount.value)
            } else if (!eleDiscount.value || eleDiscount.value === "0") {
                discount = 0
            }
            let discount_on_total = 0;
            let discountTotalRate = document.getElementById('datable-quotation-create-product').closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot').querySelector('.quotation-create-product-discount').value;
            if (form.classList.contains('sale-order')) {
                discountTotalRate = $('#quotation-copy-discount-on-total').val();
            }
            if (discountTotalRate) {
                discount_on_total = parseFloat(discountTotalRate);
            }
            let discountAmount = ((price * discount) / 100);
            let priceDiscountOnRow = (price - discountAmount);
            if (!form.classList.contains('sale-order')) {
                subtotal = (priceDiscountOnRow * quantity);
            }
            let discountAmountOnTotal = ((priceDiscountOnRow * discount_on_total) / 100);
            subtotalPlus = ((priceDiscountOnRow - discountAmountOnTotal) * quantity);
            // calculate tax
            if (eleTaxAmount) {
                if (!form.classList.contains('sale-order')) { // Quotation (normal calculate)
                    let taxAmount = ((subtotalPlus * tax) / 100);
                    $(eleTaxAmount).attr('value', String(taxAmount));
                    eleTaxAmountRaw.value = taxAmount;
                } else { // Sale Order
                    let taxAmount = ((subtotalPlus * tax) / 100);
                    $(eleTaxAmount).attr('value', String(taxAmount));
                    eleTaxAmountRaw.value = taxAmount;
                }
            }
            // store discount amount
            if (!form.classList.contains('sale-order')) {
                if (discountAmountOnTotal > 0) {
                    $(eleDiscountAmount).attr('value', String(discountAmountOnTotal));
                    eleDiscountAmountRaw.value = discountAmountOnTotal;
                } else {
                    $(eleDiscountAmount).attr('value', String(discountAmount));
                    eleDiscountAmountRaw.value = discountAmount;
                }
            } else {
                $(eleDiscountAmount).attr('value', String(discountAmount));
                eleDiscountAmountRaw.value = discountAmount;
            }
        } else {
            // calculate tax no discount on total
            if (eleTaxAmount) {
                let taxAmount = ((subtotal * tax) / 100);
                $(eleTaxAmount).attr('value', String(taxAmount));
                eleTaxAmountRaw.value = taxAmount;
            }
        }
        // set subtotal value
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        let eleSubtotalRaw = row.querySelector('.table-row-subtotal-raw');
        if (eleSubtotal) {
            $(eleSubtotal).attr('data-init-money', String(subtotal));
            eleSubtotalRaw.value = subtotal;
        }
        $.fn.initMaskMoney2();
    };

    static commonCalculate(table, row, is_product = false, is_cost = false, is_expense = false) {
        QuotationCalculateCaseHandle.calculate(row);
        // calculate total
        if (is_product === true) {
            QuotationCalculateCaseHandle.updateTotal(table[0], true, false, false);
        } else if (is_cost === true) {
            QuotationCalculateCaseHandle.updateTotal(table[0], false, true, false);
        } else if (is_expense === true) {
            QuotationCalculateCaseHandle.updateTotal(table[0], false, false, true);
        }
    };

    static calculateAllRowsTableProduct(table) {
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-item')) {
                QuotationCalculateCaseHandle.calculate(row);
            }
        }
        QuotationCalculateCaseHandle.updateTotal(table[0], true, false, false);
    };

    static calculateAllRowsTableCost(table) {
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-item')) {
                QuotationCalculateCaseHandle.commonCalculate(table, row, false, true, false);
            }
        }
    };

}

// Config
class QuotationCheckConfigHandle {
    static checkConfig(is_change_opp = false, new_row = null, is_first_time = false, is_has_opp_detail = false, is_copy = false) {
        let form = document.getElementById('frm_quotation_create');
        let configRaw = $('#quotation-config-data').val();
        if (configRaw) {
            let opportunity = QuotationLoadDataHandle.opportunitySelectEle.val();
            let config = JSON.parse(configRaw);
            let tableProduct = document.getElementById('datable-quotation-create-product');
            let empty_list = ["", null];
            let is_make_price_change = false;
            if ((!opportunity || empty_list.includes(opportunity)) && is_has_opp_detail === false) { // short sale
                if (is_change_opp === true) {
                    // ReCheck Table Product
                    if (is_first_time === false) {
                        if (!tableProduct.querySelector('.dataTables_empty')) {
                            for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                                let row = tableProduct.tBodies[0].rows[i];
                                is_make_price_change = QuotationCheckConfigHandle.reCheckTable(config, row, true, false, is_make_price_change);
                            }
                        }
                    }
                    if (!form.classList.contains('sale-order')) {  // quotation
                        let eleDiscountTotal = document.getElementById('datable-quotation-create-product').closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot').querySelector('.quotation-create-product-discount');
                        if (config.short_sale_config.is_discount_on_total === false) {
                            eleDiscountTotal.setAttribute('disabled', 'true');
                            eleDiscountTotal.classList.add('disabled-custom-show');
                            if (eleDiscountTotal.value !== "0") {
                                eleDiscountTotal.value = "0";
                                is_make_price_change = true;
                            }
                        } else {
                            if (eleDiscountTotal.hasAttribute('disabled')) {
                                eleDiscountTotal.removeAttribute('disabled');
                                eleDiscountTotal.classList.remove('disabled-custom-show');
                            }
                        }
                    }
                } else {
                    if (new_row) {
                        is_make_price_change = QuotationCheckConfigHandle.reCheckTable(config, new_row, true, false, is_make_price_change);
                    }
                }
                $.fn.initMaskMoney2();
                // check if config make price change then remove promotion & shipping
                if (is_make_price_change === true) {
                    deletePromotionRows($(tableProduct), true, false);
                    deletePromotionRows($(tableProduct), false, true);
                }
                return {
                    'is_short_sale': true,
                    'is_long_sale': false,
                    'short_sale_config': config.short_sale_config,
                    'is_make_price_change': is_make_price_change,
                }
            } else { // long sale
                if (is_change_opp === true) {
                    // ReCheck Table Product
                    if (is_first_time === false) {
                        if (!tableProduct.querySelector('.dataTables_empty')) {
                            for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                                let row = tableProduct.tBodies[0].rows[i];
                                is_make_price_change = QuotationCheckConfigHandle.reCheckTable(config, row, false, true, is_make_price_change);
                            }
                        }
                    }
                    if (!form.classList.contains('sale-order')) {
                        let eleDiscountTotal = document.getElementById('datable-quotation-create-product').closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot').querySelector('.quotation-create-product-discount');
                        if (config.long_sale_config.is_not_discount_on_total === false) {
                            if (eleDiscountTotal.hasAttribute('disabled')) {
                                eleDiscountTotal.removeAttribute('disabled');
                                eleDiscountTotal.classList.remove('disabled-custom-show');
                            }
                        } else {
                            eleDiscountTotal.setAttribute('disabled', 'true');
                            eleDiscountTotal.classList.add('disabled-custom-show');
                            if (eleDiscountTotal.value !== "0") {
                                eleDiscountTotal.value = "0";
                                is_make_price_change = true;
                            }
                        }
                    }
                    // ReCalculate Total
                    // if (is_first_time === false && is_copy === false) {
                    //     QuotationCalculateCaseHandle.updateTotal(tableProduct, true, false, false);
                    // }
                } else {
                    if (new_row) {
                        is_make_price_change = QuotationCheckConfigHandle.reCheckTable(config, new_row, false, true, is_make_price_change);
                    }
                }
                $.fn.initMaskMoney2();
                // check if config make price change then remove promotion & shipping
                if (is_make_price_change === true) {
                    deletePromotionRows($(tableProduct), true, false);
                    deletePromotionRows($(tableProduct), false, true);
                }
                return {
                    'is_short_sale': false,
                    'is_long_sale': true,
                    'short_sale_config': config.long_sale_config,
                    'is_make_price_change': is_make_price_change,
                }
            }
        }
        return {
            'is_short_sale': false,
            'is_long_sale': false,
        }
    };

    static reCheckTable(config, row, is_short_sale = false, is_long_sale = false, is_make_price_change = false) {
        if (row) {
            let eleProduct = row.querySelector('.table-row-item');
            if (eleProduct) {
                let elePriceList = row.querySelector('.dropdown-action');
                let elePrice = row.querySelector('.table-row-price');
                let eleDiscount = row.querySelector('.table-row-discount');
                if (is_short_sale === true) {
                    if (config.short_sale_config.is_choose_price_list === false) {
                        if (elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.removeAttribute('data-bs-toggle');
                            QuotationLoadDataHandle.loadPriceProduct(eleProduct);
                        }
                    } else {
                        if (!elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.setAttribute('data-bs-toggle', 'dropdown')
                        }
                    }
                    if (config.short_sale_config.is_input_price === false) {
                        elePrice.setAttribute('disabled', 'true');
                        elePrice.classList.add('disabled-custom-show');
                        QuotationLoadDataHandle.loadPriceProduct(eleProduct);
                    } else {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    }
                    if (eleDiscount) {
                        if (config.short_sale_config.is_discount_on_product === false) {
                            eleDiscount.setAttribute('disabled', 'true');
                            eleDiscount.classList.add('disabled-custom-show');
                            if (eleDiscount.value !== "0") {
                                eleDiscount.value = "0";
                                is_make_price_change = true;
                            }
                        } else {
                            if (eleDiscount.hasAttribute('disabled')) {
                                eleDiscount.removeAttribute('disabled');
                                eleDiscount.classList.remove('disabled-custom-show');
                            }
                        }
                    }
                } else if (is_long_sale === true) {
                    if (!elePriceList.hasAttribute('data-bs-toggle')) {
                        elePriceList.setAttribute('data-bs-toggle', 'dropdown');
                    }
                    if (config.long_sale_config.is_not_input_price === false) {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    } else {
                        elePrice.setAttribute('disabled', 'true');
                        elePrice.classList.add('disabled-custom-show');
                        QuotationLoadDataHandle.loadPriceProduct(eleProduct);
                    }
                    if (eleDiscount) {
                        if (config.long_sale_config.is_not_discount_on_product === false) {
                            if (eleDiscount.hasAttribute('disabled')) {
                                eleDiscount.removeAttribute('disabled');
                                eleDiscount.classList.remove('disabled-custom-show');
                            }
                        } else {
                            eleDiscount.setAttribute('disabled', 'true');
                            eleDiscount.classList.add('disabled-custom-show');
                            if (eleDiscount.value !== "0") {
                                eleDiscount.value = "0";
                                is_make_price_change = true;
                            }
                        }
                    }
                }
            }
        }
        return is_make_price_change
    };

}

// Indicator
class indicatorHandle {
    static loadQuotationIndicator(indicator_id, is_load_init_indicator = false) {
        let jqueryId = '#' + indicator_id;
        let ele = $(jqueryId);
        if (!ele.val()) {
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'isDropdown': true,
                }
                // url, method
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('quotation_indicator_list') && Array.isArray(data.quotation_indicator_list)) {
                            ele.val(JSON.stringify(data.quotation_indicator_list));
                            if (is_load_init_indicator === false) {
                                indicatorHandle.calculateIndicator(data.quotation_indicator_list);
                            }
                        }
                    }
                }
            )
        } else {
            if (is_load_init_indicator === false) {
                let data_list = JSON.parse(ele.val());
                indicatorHandle.calculateIndicator(data_list);
            }
        }

    }

    static calculateIndicator(indicator_list) {
        let result_list = [];
        let result_json = {};
        let revenueValue = 0;
        let rateValue = 0;
        let formSubmit = $('#frm_quotation_create');
        let is_sale_order = false;
        let _form = new SetupFormSubmit(formSubmit);
        if (formSubmit[0].classList.contains('sale-order')) {
            is_sale_order = true;
        }
        QuotationSubmitHandle.setupDataSubmit(_form, is_sale_order);
        let data_form = _form.dataForm;
        let dataDetailCopy = {};
        let eleDetailCopy = $('#data-copy-quotation-detail');
        if (eleDetailCopy && eleDetailCopy.length > 0) {
            if (eleDetailCopy.val()) {
                dataDetailCopy = JSON.parse(eleDetailCopy.val());
            }
        }
        let dataDetail = {};
        let eleDetail = $('#quotation-detail-data');
        if (eleDetail && eleDetail.length > 0) {
            if (eleDetail.val()) {
                dataDetail = JSON.parse(eleDetail.val());
            }
        }
        // check zone before calculate
        let keyHidden = WFRTControl.getZoneHiddenKeyData();
        if (keyHidden) {
            if (keyHidden.length > 0) {
                // special case: tab cost depend on tab detail
                if (!keyHidden.includes('quotation_products_data') && !keyHidden.includes('sale_order_products_data')) {
                    QuotationLoadDataHandle.loadDataTableCost();
                    QuotationSubmitHandle.setupDataSubmit(_form, is_sale_order);
                    data_form = _form.dataForm;
                    QuotationLoadDataHandle.loadSetWFRuntimeZone();
                }
                // set data detail to zones hidden
                if (data_form && dataDetail) {
                    for (let key of keyHidden) {
                        if (!data_form.hasOwnProperty(key) && dataDetail.hasOwnProperty(key)) {
                            data_form[key] = dataDetail[key];
                        }
                    }
                }
            }
        }
        // Check special case
        indicatorHandle.checkSpecialCaseIndicator(data_form);
        for (let indicator of indicator_list) {
            let parse_formula = "";
            let formula_data = indicator.formula_data;
            for (let item of formula_data) {
                if (typeof item === 'object' && item !== null) {
                    if (item.hasOwnProperty('is_property')) {
                        if (data_form.hasOwnProperty(item.code)) {
                            parse_formula += data_form[item.code];
                        }
                    } else if (item.hasOwnProperty('is_indicator')) {
                        if (result_json.hasOwnProperty(item.order)) {
                            if (item.order < indicator.order) {
                                parse_formula += result_json[item.order].indicator_value;
                            }
                        }
                    } else if (item.hasOwnProperty('param_type')) {
                        if (item.param_type === 2) { // FUNCTION
                            if (item.code === 'max' || item.code === 'min') {
                                let functionData = indicatorHandle.functionMaxMin(item, data_form, result_json);
                                parse_formula += functionData;
                            } else if (item.code === 'sumItemIf') {
                                let functionData = indicatorHandle.functionSumItemIf(item, data_form, is_sale_order);
                                parse_formula += functionData;
                            }
                        }
                    }
                } else if (typeof item === 'string') {
                    parse_formula += item;
                }
            }
            // begin calculate
            // format
            parse_formula = indicatorHandle.formatExpression(parse_formula);
            // value
            let value = indicatorHandle.evaluateFormula(parse_formula);
            // rate value
            if (indicator?.['code'] === "IN0001") {
                revenueValue = value
            }
            if (value && revenueValue) {
                if (revenueValue !== 0) {
                    rateValue = ((value / revenueValue) * 100).toFixed(1);
                }
            }
            // quotation value
            let quotationValue = 0;
            let differenceValue = value;
            // check if sale order then get quotation value
            if (formSubmit[0].classList.contains('sale-order')) {
                if (formSubmit.attr('data-method') === 'POST') {
                    if (dataDetailCopy?.['quotation_indicators_data']) {
                        for (let quotation_indicator of dataDetailCopy?.['quotation_indicators_data']) {
                            if (indicator.title === quotation_indicator.indicator.title) {
                                quotationValue = quotation_indicator.indicator_value;
                                differenceValue = (value - quotation_indicator.indicator_value);
                                break;
                            }
                        }
                    }
                } else {
                    if (dataDetail?.['quotation']?.['quotation_indicators_data']) {
                        for (let quotation_indicator of dataDetail?.['quotation']?.['quotation_indicators_data']) {
                            if (indicator.title === quotation_indicator.indicator.title) {
                                quotationValue = quotation_indicator.indicator_value;
                                differenceValue = (value - quotation_indicator.indicator_value);
                                break;
                            }
                        }
                    }
                }
            }
            // append result
            result_list.push({
                'indicator': {
                    'id': indicator.id,
                    'title': indicator.title,
                },
                'quotation_indicator': {
                    'id': indicator.id,
                    'title': indicator.title,
                },
                'order': indicator.order,
                'indicator_value': value,
                'indicator_rate': rateValue,
                'quotation_indicator_value': quotationValue,
                'difference_indicator_value': differenceValue,
            });
            result_json[indicator.order] = {
                'indicator_value': value,
                'indicator_rate': rateValue
            }
        }
        //
        let $table = $('#datable-quotation-create-indicator');
        $table.DataTable().clear().draw();
        $table.DataTable().rows.add(result_list).draw();
    }

    static evaluateFormula(formulaText) {
        try {
            return eval(formulaText);
            // return evaluated;
        } catch (error) {
            return null;
        }
    }

    static functionMaxMin(item, data_form, result_json) {
        let functionBody = "[";
        let idx = 0;
        for (let function_child of item.function_data) {
            idx++;
            if (typeof function_child === 'object' && function_child !== null) {
                if (function_child.hasOwnProperty('is_property')) {
                    if (data_form.hasOwnProperty(function_child.code)) {
                        functionBody += data_form[function_child.code];
                        if (idx < item.function_data.length) {
                            functionBody += ",";
                        }
                    }
                } else if (function_child.hasOwnProperty('is_indicator')) {
                    if (result_json.hasOwnProperty(function_child.order)) {
                        functionBody += result_json[function_child.order].indicator_value;
                        if (idx < item.function_data.length) {
                            functionBody += ",";
                        }
                    }
                }
            } else if (typeof function_child === 'string') {
                functionBody += function_child;
                if (idx < item.function_data.length) {
                    functionBody += ",";
                }
            }
        }
        return item.syntax + functionBody + "])";
    }

    static functionSumItemIf(item, data_form, is_sale_order) {
        let syntax = "sum(";
        let functionBody = "";
        let leftValueJSON = null;
        let rightValue = null;
        let operator_list = ['===', '!==', '<', '>', '<=', '>='];
        let condition_operator = operator_list.filter((element) => item.function_data.includes(element))[0];
        let operatorIndex = item.function_data.indexOf(condition_operator);
        if (operatorIndex !== -1 && operatorIndex > 0 && operatorIndex < item.function_data.length - 1) {
            leftValueJSON = item.function_data[operatorIndex - 1];
            rightValue = item.function_data[operatorIndex + 1];
        }
        let lastElement = item.function_data[item.function_data.length - 1];
        // Tab Products
        if (data_form?.['quotation_products_data']) {}
        // Tab Expense
        if (is_sale_order === false) {
            if (data_form?.['quotation_expenses_data']) {
                functionBody = indicatorHandle.extractDataToSum(data_form?.['quotation_expenses_data'], leftValueJSON, condition_operator, rightValue, lastElement);
            }
        } else {
            if (data_form?.['sale_order_expenses_data']) {
                functionBody = indicatorHandle.extractDataToSum(data_form?.['sale_order_expenses_data'], leftValueJSON, condition_operator, rightValue, lastElement);
            }
        }
        if (functionBody[functionBody.length - 1] === ",") {
            let functionBodySlice = functionBody.slice(0, -1);
            return syntax + functionBodySlice + ")";
        }
        return syntax + functionBody + ")";
    }

    static extractDataToSum(data_list, leftValueJSON, condition_operator, rightValue, lastElement) {
        let functionBody = "";
        for (let data of data_list) {
            if (typeof leftValueJSON === 'object' && leftValueJSON !== null) {
                if (data.hasOwnProperty(leftValueJSON.code)) {
                    if (typeof data[leftValueJSON.code] === 'string') {
                        let leftValue = data[leftValueJSON.code].replace(/\s/g, "").toLowerCase();
                        let checkExpression = `"${leftValue}" ${condition_operator} "${rightValue}"`;
                        let check = indicatorHandle.evaluateFormula(checkExpression);
                        if (check === true) {
                            functionBody += String(data[lastElement.code]);
                            functionBody += ",";
                        }
                    }
                }
            }
        }
        return functionBody
    }

    static checkSpecialCaseIndicator(data_form) {
        // check if product data has promotion gift then => += vào total_cost_pretax_amount
        if (data_form.hasOwnProperty('total_cost_pretax_amount')) {
            let promotion = document.getElementById('datable-quotation-create-product').querySelector('.table-row-promotion');
            if (promotion) {
                if (promotion.closest('tr').querySelector('.table-row-description').value === '(Gift)') {
                    let productGift = promotion.getAttribute('data-id-product');
                    let product_data_list = [];
                    if (data_form.hasOwnProperty('quotation_costs_data')) {
                        product_data_list = data_form['quotation_costs_data'];
                    } else if (data_form.hasOwnProperty('sale_order_costs_data')) {
                        product_data_list = data_form['sale_order_costs_data'];
                    }
                    for (let product of product_data_list) {
                        if (product.product === productGift) {
                            data_form['total_cost_pretax_amount'] += product.product_cost_price;
                            break;
                        }
                    }
                }
            }
        }
    }

    static formatExpression(input) {
        // Replace consecutive subtraction operators with a space before each minus sign
        return input.replace(/--/g, '+');
    }

}

let indicatorClass = new indicatorHandle();

// Submit Form
class QuotationSubmitHandle {
    static setupDataProduct() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-product');
        let tableEmpty = table.querySelector('.dataTables_empty');
        if (tableEmpty) {
            return []
        }
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let eleProduct = row.querySelector('.table-row-item');
            let elePromotion = row.querySelector('.table-row-promotion');
            let eleShipping = row.querySelector('.table-row-shipping');
            if (eleProduct) { // PRODUCT
                if ($(eleProduct).val()) {
                    let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                    if (dataProduct) {
                        rowData['product'] = dataProduct?.['id'];
                        rowData['product_title'] = dataProduct?.['title'];
                        rowData['product_code'] = dataProduct?.['code'];
                    }
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if ($(eleUOM).val()) {
                    let dataUOM = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                    if (dataUOM) {
                        rowData['unit_of_measure'] = dataUOM?.['id'];
                        rowData['product_uom_title'] = dataUOM?.['title'];
                        rowData['product_uom_code'] = dataUOM?.['code'];
                    }
                }
                let eleTax = row.querySelector('.table-row-tax');
                if ($(eleTax).val()) {
                    let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                    if (dataTax) {
                        rowData['tax'] = dataTax?.['id'];
                        rowData['product_tax_title'] = dataTax?.['title'];
                        rowData['product_tax_value'] = dataTax?.['rate'];
                    } else {
                        rowData['product_tax_value'] = 0;
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.innerHTML;
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                let eleDiscount = row.querySelector('.table-row-discount');
                if (eleDiscount) {
                    if (eleDiscount.value || eleDiscount.value === "0") {
                        rowData['product_discount_value'] = parseFloat(eleDiscount.value);
                    } else {
                        rowData['product_discount_value'] = 0;
                    }
                }
                let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
                if (eleDiscountAmount) {
                    rowData['product_discount_amount'] = $(eleDiscountAmount).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                    rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount']
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                rowData['is_promotion'] = false;
                rowData['promotion'] = null;
                rowData['is_shipping'] = false;
                rowData['shipping'] = null;

                result.push(rowData);
            } else if (elePromotion) { // PROMOTION
                let check_none_blank_list = ['', "", null, "undefined"];
                rowData['product'] = null;
                if (elePromotion.getAttribute('data-id-product') && !check_none_blank_list.includes(elePromotion.getAttribute('data-id-product'))) {
                    rowData['product'] = elePromotion.getAttribute('data-id-product');
                }
                rowData['is_promotion'] = true;
                rowData['promotion'] = elePromotion.getAttribute('data-id');
                rowData['is_shipping'] = false;
                rowData['shipping'] = null;
                rowData['product_title'] = elePromotion.value;
                rowData['product_code'] = elePromotion.value;
                rowData['unit_of_measure'] = null;
                rowData['product_uom_title'] = "";
                rowData['product_uom_code'] = "";
                let uomData = getDataByProductID(elePromotion.getAttribute('data-id-product'));
                if (uomData && Object.keys(uomData).length > 0) {
                    rowData['unit_of_measure'] = uomData?.['id'];
                    rowData['product_uom_title'] = uomData?.['title'];
                    rowData['product_uom_code'] = uomData?.['code'];
                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo?.['id'];
                            rowData['product_tax_title'] = dataInfo?.['title'];
                            rowData['product_tax_value'] = dataInfo?.['value'];
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                rowData['product_discount_value'] = 0;
                rowData['product_discount_amount'] = 0;
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }

                result.push(rowData);
            } else if (eleShipping) { // SHIPPING
                rowData['product'] = null;
                rowData['is_shipping'] = true;
                rowData['shipping'] = eleShipping.getAttribute('data-id');
                rowData['is_promotion'] = false;
                rowData['promotion'] = null;
                rowData['product_title'] = eleShipping.value;
                rowData['product_code'] = eleShipping.value;
                rowData['unit_of_measure'] = null;
                rowData['product_uom_title'] = "";
                rowData['product_uom_code'] = "";
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo?.['id'];
                            rowData['product_tax_title'] = dataInfo?.['title'];
                            rowData['product_tax_value'] = dataInfo?.['value'];
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                rowData['product_discount_value'] = 0;
                rowData['product_discount_amount'] = 0;
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }

                result.push(rowData);
            }
            // result.push(rowData);
        }
        return result
    }

    static setupDataCost() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-cost');
        let tableEmpty = table.querySelector('.dataTables_empty');
        if (tableEmpty) {
            return []
        }
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let eleProduct = row.querySelector('.table-row-item');
            let eleShipping = row.querySelector('.table-row-shipping');
            if ($(eleProduct).val()) { // PRODUCT
                let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                if (dataProduct) {
                    rowData['product'] = dataProduct?.['id'];
                    rowData['product_title'] = dataProduct?.['title'];
                    rowData['product_code'] = dataProduct?.['code'];
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if ($(eleUOM).val()) {
                    let dataUOM = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                    if (dataUOM) {
                        rowData['unit_of_measure'] = dataUOM?.['id'];
                        rowData['product_uom_title'] = dataUOM?.['title'];
                        rowData['product_uom_code'] = dataUOM?.['code'];
                    }
                }
                let eleTax = row.querySelector('.table-row-tax');
                if ($(eleTax).val()) {
                    let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                    if (dataTax) {
                        rowData['tax'] = dataTax?.['id'];
                        rowData['product_tax_title'] = dataTax?.['title'];
                        rowData['product_tax_value'] = dataTax?.['rate'];
                    } else {
                        rowData['product_tax_value'] = 0;
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value)
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_cost_price'] = $(elePrice).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                    rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount']
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                rowData['is_shipping'] = false;
                rowData['shipping'] = null;

                result.push(rowData);
            } else if (eleShipping) { // SHIPPING
                rowData['product'] = null;
                rowData['is_shipping'] = true;
                rowData['shipping'] = eleShipping.getAttribute('data-id');
                rowData['promotion'] = null;
                rowData['product_title'] = eleShipping.value;
                rowData['product_code'] = eleShipping.value;
                rowData['unit_of_measure'] = null;
                rowData['product_uom_title'] = "";
                rowData['product_uom_code'] = "";
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo?.['id'];
                            rowData['product_tax_title'] = dataInfo?.['title'];
                            rowData['product_tax_value'] = dataInfo?.['value'];
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_cost_price'] = $(elePrice).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }

                result.push(rowData);
            }
            // result.push(rowData);
        }
        return result
    }

    static setupDataExpense() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-expense');
        let tableEmpty = table.querySelector('.dataTables_empty');
        if (tableEmpty) {
            return []
        }
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                rowData['is_labor'] = dataRow?.['is_labor'];
            }
            let eleExpenseItem = row.querySelector('.table-row-item');
            if ($(eleExpenseItem).val()) {
                let dataExpenseItem = SelectDDControl.get_data_from_idx($(eleExpenseItem), $(eleExpenseItem).val());
                if (dataExpenseItem) {
                    rowData['expense_item'] = dataExpenseItem?.['id'];
                    rowData['expense_code'] = dataExpenseItem?.['code'];
                    rowData['expense_type_title'] = dataExpenseItem?.['title'];
                }
            }
            if (row?.querySelector('.table-row-expense-title')) {
              rowData['expense_title'] = row.querySelector('.table-row-expense-title').value;
            }
            let eleLaborItem = row?.querySelector('.table-row-labor-item');
            if (eleLaborItem) {
                if ($(eleLaborItem).val()) {
                    let dataLaborItem = SelectDDControl.get_data_from_idx($(eleLaborItem), $(eleLaborItem).val());
                    if (dataLaborItem) {
                        rowData['expense'] = dataLaborItem?.['id'];
                        rowData['expense_title'] = dataLaborItem?.['title'];
                    }
                }
            }
            let eleUOM = row.querySelector('.table-row-uom');
            if ($(eleUOM).val()) {
                let dataUOM = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                if (dataUOM) {
                    rowData['unit_of_measure'] = dataUOM?.['id'];
                    rowData['product_uom_title'] = dataUOM?.['title'];
                    rowData['product_uom_code'] = dataUOM?.['code'];
                }
            }
            let eleTax = row.querySelector('.table-row-tax');
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax) {
                    rowData['tax'] = dataTax?.['id'];
                    rowData['product_tax_title'] = dataTax?.['title'];
                    rowData['product_tax_value'] = dataTax?.['rate'];
                } else {
                    rowData['product_tax_value'] = 0;
                }
            }
            let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
            if (eleTaxAmount) {
                rowData['expense_tax_amount'] = parseFloat(eleTaxAmount.value)
            }
            let eleQuantity = row.querySelector('.table-row-quantity');
            if (eleQuantity) {
                rowData['expense_quantity'] = parseFloat(eleQuantity.value);
            }
            let elePrice = row.querySelector('.table-row-price');
            if (elePrice) {
                rowData['expense_price'] = $(elePrice).valCurrency();
            }
            let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
            if (eleSubtotal) {
                rowData['expense_subtotal_price'] = parseFloat(eleSubtotal.value)
            }
            if (rowData.hasOwnProperty('expense_subtotal_price') && rowData.hasOwnProperty('expense_tax_amount')) {
                rowData['expense_subtotal_price_after_tax'] = rowData['expense_subtotal_price'] + rowData['expense_tax_amount']
            }
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                rowData['order'] = parseInt(eleOrder.innerHTML);
            }
            result.push(rowData);
        }
        return result
    }

    static setupDataLogistic() {
        return {
            'shipping_address': $('#quotation-create-shipping-address').val(),
            'billing_address': $('#quotation-create-billing-address').val(),
        }
    }

    static setupDataIndicator() {
        let result = [];
        let tableIndicator = document.getElementById('datable-quotation-create-indicator');
        let tableEmpty = tableIndicator.querySelector('.dataTables_empty');
        if (!tableEmpty) {
            for (let i = 0; i < tableIndicator.tBodies[0].rows.length; i++) {
                let row = tableIndicator.tBodies[0].rows[i];
                let indicator = row.querySelector('.table-row-title').getAttribute('data-id');
                let indicator_value = row.querySelector('.table-row-value').getAttribute('data-value');
                let indicator_rate = row.querySelector('.table-row-rate').getAttribute('data-value');
                let order = row.querySelector('.table-row-order').getAttribute('data-value');
                if (!$(tableIndicator).hasClass('sale-order')) { // QUOTATION INDICATOR
                    result.push({
                        'indicator': indicator,
                        'indicator_value': parseFloat(indicator_value),
                        'indicator_rate': parseFloat(indicator_rate),
                        'order': parseInt(order),
                    })
                } else { // SALE ORDER INDICATOR
                    let quotation_indicator_value = row.querySelector('.table-row-quotation-value').getAttribute('data-value');
                    let difference_indicator_rate = row.querySelector('.table-row-difference-value').getAttribute('data-value');
                    result.push({
                        'quotation_indicator': indicator,
                        'indicator_value': parseFloat(indicator_value),
                        'indicator_rate': parseFloat(indicator_rate),
                        'quotation_indicator_value': parseFloat(quotation_indicator_value),
                        'difference_indicator_value': parseFloat(difference_indicator_rate),
                        'order': parseInt(order),
                    })
                }
            }
        }
        return result
    }

    static setupDataPaymentStage() {
        let result = [];
        let $table = $('#datable-quotation-payment-stage');
        $table.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let eleStage = row.querySelector('.table-row-stage');
            if (eleStage) {
                if (eleStage.getAttribute('data-stage')) {
                    rowData['stage'] = parseInt(eleStage.getAttribute('data-stage'));
                    rowData['order'] = parseInt(eleStage.getAttribute('data-order'));
                }
            }
            let eleRemark = row.querySelector('.table-row-remark');
            if (eleRemark) {
                rowData['remark'] = eleRemark.value;
            }
            let eleDate = row.querySelector('.table-row-date');
            if (eleDate) {
                if (eleDate.value) {
                    rowData['date'] = String(moment(eleDate.value, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
                rowData['number_of_day'] = parseInt(eleDate.getAttribute('data-number-of-day'));
            }
            let eleDateType = row.querySelector('.table-row-date-type');
            if (eleDateType) {
                if (eleDateType.getAttribute('data-date-type')) {
                    rowData['date_type'] = parseInt(eleDateType.getAttribute('data-date-type'));
                }
            }
            let eleRatio = row.querySelector('.table-row-ratio');
            if (eleRatio) {
                if (eleRatio.getAttribute('data-ratio')) {
                    rowData['payment_ratio'] = parseFloat(eleRatio.getAttribute('data-ratio'));
                }
            }
            let eleValue = row.querySelector('.table-row-value');
            if (eleValue) {
                if (eleValue.getAttribute('data-init-money')) {
                    rowData['value_before_tax'] = parseFloat(eleValue.getAttribute('data-init-money'));
                }
            }
            let eleDueDate = row.querySelector('.table-row-due-date');
            if (eleDueDate) {
                if (eleDueDate.innerHTML) {
                    rowData['due_date'] = String(moment(eleDueDate.innerHTML, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            let eleARInvoice = row.querySelector('.table-row-checkbox-invoice');
            if (eleARInvoice) {
                rowData['is_ar_invoice'] = eleARInvoice.checked;
            }
            if (rowData.hasOwnProperty('stage')) {
                result.push(rowData);
            }
        });
        return result;
    }

    static setupDataSubmit(_form, is_sale_order = false) {
        let quotation_products_data = 'quotation_products_data';
        let quotation_costs_data = 'quotation_costs_data';
        let quotation_expenses_data = 'quotation_expenses_data';
        let quotation_logistic_data = 'quotation_logistic_data';
        let quotation_indicators_data = 'quotation_indicators_data';
        if (is_sale_order === true) {
            quotation_products_data = 'sale_order_products_data';
            quotation_costs_data = 'sale_order_costs_data';
            quotation_expenses_data = 'sale_order_expenses_data';
            quotation_logistic_data = 'sale_order_logistic_data';
            quotation_indicators_data = 'sale_order_indicators_data';

            let eleQuotation = $('#select-box-quotation');
            if (eleQuotation) {
                if (eleQuotation.val()) {
                    _form.dataForm['quotation'] = eleQuotation.val()
                }
            }
        }
        let dateCreatedVal = $('#quotation-create-date-created').val();
        if (dateCreatedVal) {
            _form.dataForm['date_created'] = moment(dateCreatedVal).format('YYYY-MM-DD HH:mm:ss');
        }
        if (is_sale_order === false) {
            _form.dataForm['is_customer_confirm'] = $('#quotation-customer-confirm')[0].checked;
        }

        let quotation_products_data_setup = QuotationSubmitHandle.setupDataProduct();
        if (quotation_products_data_setup.length > 0) {
            _form.dataForm[quotation_products_data] = quotation_products_data_setup;
            // total product
            let tableProduct = document.getElementById('datable-quotation-create-product');
            if (tableProduct.closest('.dataTables_scroll')) {
                let tableProductFt = tableProduct.closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot');
                _form.dataForm['total_product_pretax_amount'] = parseFloat(tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw').value);
                if (!_form.dataForm['total_product_pretax_amount']) {
                    _form.dataForm['total_product_pretax_amount'] = 0;
                }
                let totalProductDiscountRate = tableProductFt.querySelector('.quotation-create-product-discount').value;
                if (totalProductDiscountRate) {
                    _form.dataForm['total_product_discount_rate'] = parseFloat(totalProductDiscountRate);
                } else {
                    _form.dataForm['total_product_discount_rate'] = 0;
                }
                _form.dataForm['total_product_discount'] = parseFloat(tableProductFt.querySelector('.quotation-create-product-discount-amount-raw').value);
                if (!_form.dataForm['total_product_discount']) {
                    _form.dataForm['total_product_discount'] = 0;
                }
                _form.dataForm['total_product_tax'] = parseFloat(tableProductFt.querySelector('.quotation-create-product-taxes-raw').value);
                if (!_form.dataForm['total_product_tax']) {
                    _form.dataForm['total_product_tax'] = 0;
                }
                _form.dataForm['total_product'] = parseFloat(tableProductFt.querySelector('.quotation-create-product-total-raw').value);
                if (!_form.dataForm['total_product']) {
                    _form.dataForm['total_product'] = 0;
                }
                _form.dataForm['total_product_revenue_before_tax'] = parseFloat(tableProductFt.querySelector('.quotation-final-revenue-before-tax').value);
                if (!_form.dataForm['total_product_revenue_before_tax']) {
                    _form.dataForm['total_product_revenue_before_tax'] = 0;
                }
            }
        }
        // COST
        let quotation_costs_data_setup = QuotationSubmitHandle.setupDataCost();
        if (quotation_costs_data_setup.length > 0) {
            _form.dataForm[quotation_costs_data] = quotation_costs_data_setup;
            // total cost
            let tableCost = document.getElementById('datable-quotation-create-cost');
            _form.dataForm['total_cost_pretax_amount'] = parseFloat(tableCost.querySelector('.quotation-create-cost-pretax-amount-raw').value);
            if (!_form.dataForm['total_cost_pretax_amount']) {
                _form.dataForm['total_cost_pretax_amount'] = 0;
            }
            _form.dataForm['total_cost_tax'] = parseFloat(tableCost.querySelector('.quotation-create-cost-taxes-raw').value);
            if (!_form.dataForm['total_cost_tax']) {
                _form.dataForm['total_cost_tax'] = 0;
            }
            _form.dataForm['total_cost'] = parseFloat(tableCost.querySelector('.quotation-create-cost-total-raw').value);
            if (!_form.dataForm['total_cost']) {
                _form.dataForm['total_cost'] = 0;
            }
        }
        // EXPENSE
        let quotation_expenses_data_setup = QuotationSubmitHandle.setupDataExpense();
        if (quotation_expenses_data_setup.length > 0) {
            _form.dataForm[quotation_expenses_data] = quotation_expenses_data_setup;
            // total expense
            let tableExpense = document.getElementById('datable-quotation-create-expense');
            if (tableExpense.closest('.dataTables_scroll')) {
                let tableExpenseFt = tableExpense.closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot');
                _form.dataForm['total_expense_pretax_amount'] = parseFloat(tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount-raw').value);
                if (!_form.dataForm['total_expense_pretax_amount']) {
                    _form.dataForm['total_expense_pretax_amount'] = 0;
                }
                _form.dataForm['total_expense_tax'] = parseFloat(tableExpenseFt.querySelector('.quotation-create-expense-taxes-raw').value);
                if (!_form.dataForm['total_expense_tax']) {
                    _form.dataForm['total_expense_tax'] = 0;
                }
                _form.dataForm['total_expense'] = parseFloat(tableExpenseFt.querySelector('.quotation-create-expense-total-raw').value);
                if (!_form.dataForm['total_expense']) {
                    _form.dataForm['total_expense'] = 0;
                }
            }
        }

        _form.dataForm[quotation_logistic_data] = QuotationSubmitHandle.setupDataLogistic();

        let customer_shipping = $('#quotation-create-customer-shipping');
        if (customer_shipping.val()) {
            _form.dataForm['customer_shipping'] = customer_shipping.val();
            // handle case hidden zone
            if (_form.dataMethod.toLowerCase() === 'put') {
                let btnEditShipping = $('#btn-edit-shipping');
                if (btnEditShipping.is(':hidden')) {
                    let eleDataDetail = $('#quotation-detail-data');
                    if (eleDataDetail && eleDataDetail.length > 0) {
                        if (eleDataDetail.val()) {
                            let dataDetail = JSON.parse(eleDataDetail.val());
                            _form.dataForm[quotation_logistic_data]['shipping_address'] = dataDetail?.[quotation_logistic_data]?.['shipping_address'];
                        }
                    }
                }
            }
        }
        let customer_billing = $('#quotation-create-customer-billing');
        if (customer_billing.val()) {
            _form.dataForm['customer_billing'] = customer_billing.val();
            // handle case hidden zone
            if (_form.dataMethod.toLowerCase() === 'put') {
                let btnEditShipping = $('#btn-edit-billing');
                if (btnEditShipping.is(':hidden')) {
                    let eleDataDetail = $('#quotation-detail-data');
                    if (eleDataDetail && eleDataDetail.length > 0) {
                        if (eleDataDetail.val()) {
                            let dataDetail = JSON.parse(eleDataDetail.val());
                            _form.dataForm[quotation_logistic_data]['billing_address'] = dataDetail?.[quotation_logistic_data]?.['billing_address'];
                        }
                    }
                }
            }
        }
        // indicator
        let quotation_indicators_data_setup = QuotationSubmitHandle.setupDataIndicator();
        if (quotation_indicators_data_setup.length > 0) {
            _form.dataForm[quotation_indicators_data] = quotation_indicators_data_setup;
        }
        // payment stage
        if (is_sale_order === true) {
            let dataPaymentStage = QuotationSubmitHandle.setupDataPaymentStage();
            if (dataPaymentStage.length > 0) {
                _form.dataForm['sale_order_payment_stage'] = dataPaymentStage;
            }
        }

        // ****************************
        // Auto fill data when form calling submit "$('.btn-saving-form')..."
        // ****************************
        // system fields
        // if (_form.dataMethod === "POST") {
        //     _form.dataForm['system_status'] = 1;
        // }
    }
}

// *** COMMON FUNCTIONS ***
function deleteRow(currentRow, tableBody, table) {
    // Get the index of the current row within the DataTable
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    // Delete current row
    row.remove().draw();
    // ReOrder STT
    reOrderSTT(tableBody, table);
}

function reOrderSTT(tableBody, table) {
    let order = 0;
    if (tableBody.rows.length === 0) {
        table.DataTable().clear().draw();
    } else {
        for (let idx = 0; idx < tableBody.rows.length; idx++) {
            order++;
            let productOrder = tableBody.rows[idx].querySelector('.table-row-order');
            if (productOrder) {
                productOrder.innerHTML = order;
            }
        }
    }
}

function deletePromotionRows(table, is_promotion = false, is_shipping = false) {
    for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
        let row = table[0].tBodies[0].rows[i];
        if (row.querySelector('.table-row-promotion') && is_promotion === true) {
            deleteRow($(row), row.closest('tbody'), table)
        } else if (row.querySelector('.table-row-shipping') && is_shipping === true) {
            deleteRow($(row), row.closest('tbody'), table)
        }
    }
}

function filterDataProductNotPromotion(data_products) {
    let finalList = [];
    let order = 0;
    for (let i = 0; i < data_products.length; i++) {
        let dataProd = data_products[i];
        let itemType = 0  // product
        if (dataProd.hasOwnProperty('product') && dataProd.hasOwnProperty('promotion') && dataProd.hasOwnProperty('shipping')) {
            if (Object.keys(dataProd['promotion']).length > 0) {
                itemType = 1  // promotion
            }
            if (Object.keys(dataProd['shipping']).length > 0) {
                itemType = 2  // shipping
            }
        }
        if (itemType === 0) {
            order++;
            dataProd['order'] = order;
            finalList.push(dataProd)
        }
    }
    return finalList
}

function getDataByProductID(product_id) {
    let uom_data = {};
    let eleDataList = document.getElementById('data-init-quotation-create-tables-product');
    let dataList = JSON.parse(eleDataList.value);
    for (let i = 0; i < dataList.length; i++) {
        let data = dataList[i];
        if (data.id === product_id) {
            if (data?.['sale_information']) {
                uom_data = data?.['sale_information']?.['default_uom'];
                break
            }
        }
    }
    return uom_data
}

// math functions
function max(data_list) {
    return Math.max(...data_list);
}

function min(data_list) {
    return Math.min(...data_list);
}

function sum() {
    return Array.prototype.reduce.call(arguments, function (acc, val) {
        return acc + val;
    }, 0);
}

// date
function calculateDate(dateString, opts = {}) {
    let parts = dateString.split('/');
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript
    let year = parseInt(parts[2], 10);
    let originalDate = new Date(year, month, day);
    if (opts.hasOwnProperty('number_day_after')) {
        let newDate = new Date(originalDate);
        newDate.setDate(originalDate.getDate() + opts?.['number_day_after']);
        let padWithZero = (value) => (value < 10 ? `0${value}` : value);
        return `${padWithZero(newDate.getDate())}/${padWithZero(newDate.getMonth() + 1)}/${newDate.getFullYear()}`;
    }
}

// validate
function validateNumber(ele) {
    let value = ele.value;
    // Replace non-digit characters with an empty string
    value = value.replace(/[^0-9.]/g, '');
    // Remove unnecessary zeros from the integer part
    value = value.replace("-", "").replace(/^0+(?=\d)/, '');
    // Update value of input
    ele.value = value;
    return true;
}