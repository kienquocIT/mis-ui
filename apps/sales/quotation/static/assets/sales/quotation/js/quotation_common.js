let promotionClass = new promotionHandle();
let shippingClass = new shippingHandle();

// Load data
class loadDataHandle {
    loadBoxQuotationOpportunity(opp_id, valueToSelect = null, sale_person = null) {
        let jqueryId = '#' + opp_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (!sale_person) {
            sale_person = $('#select-box-quotation-create-sale-person').val(); // filter by sale_person
        }
        if (sale_person) {
            let data_filter = {'sale_person_id': sale_person};
            ele.empty();
            ele.append(`<option value=""></option>`);
            $.fn.callAjax(url, method, data_filter).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                            data.opportunity_list.map(function (item) {
                                let check_used = item.quotation_id;
                                if ($('#frm_quotation_create')[0].classList.contains('sale-order')) {
                                   check_used = item.sale_order_id
                                }
                                if (check_used === null || valueToSelect === item.id) {
                                    let dataStr = JSON.stringify({
                                        'id': item.id,
                                        'title': item.title,
                                        'code': item.code,
                                        'customer': item.customer.title
                                    }).replace(/"/g, "&quot;");
                                    let opportunity_data = JSON.stringify(item).replace(/"/g, "&quot;");
                                    let data_show = `${item.code}` + ` - ` + `${item.title}`;
                                    let option = `<option value="${item.id}">
                                                <span class="opp-title">${data_show}</span>
                                                <input type="hidden" class="data-default" value="${opportunity_data}">
                                                <input type="hidden" class="data-info" value="${dataStr}">
                                            </option>`
                                    if (valueToSelect && valueToSelect === item.id) {
                                        option = `<option value="${item.id}" selected>
                                                <span class="opp-title">${data_show}</span>
                                                <input type="hidden" class="data-default" value="${opportunity_data}">
                                                <input type="hidden" class="data-info" value="${dataStr}">
                                            </option>`
                                    }
                                    ele.append(option)
                                }
                            })
                        }
                    }
                }
            )
        } else {
            ele.append(`<option value=""></option>`);
        }
    }

    loadBoxQuotationCustomer(customer_id, valueToSelect = null, modalShipping = null, modalBilling = null, sale_person = null) {
        let self = this;
        let jqueryId = '#' + customer_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (!sale_person) {
            sale_person = $('#select-box-quotation-create-sale-person').val(); // filter by sale_person
        }
        if (sale_person) {
            let data_filter = {'employee__id': sale_person}
            self.loadShippingBillingCustomer(modalShipping, modalBilling);
            ele.empty();
            ele.append(`<option value=""></option>`);
            $.fn.callAjax(url, method, data_filter).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('account_sale_list') && Array.isArray(data.account_sale_list)) {
                            let dataAppend = ``;
                            let dataMapOpp = ``;
                            data.account_sale_list.map(function (item) {
                                let ownerName = "";
                                if (item.owner) {
                                    ownerName = item.owner.fullname;
                                }
                                let dataStr = JSON.stringify({
                                    'id': item.id,
                                    'Name': item.name,
                                    'Owner name': ownerName,
                                }).replace(/"/g, "&quot;");
                                let customer_data = JSON.stringify(item).replace(/"/g, "&quot;");
                                dataAppend += `<option value="${item.id}">
                                                <span class="account-title">${item.name}</span>
                                                <input type="hidden" class="data-default" value="${customer_data}">
                                                <input type="hidden" class="data-info" value="${dataStr}">
                                            </option>`
                                if (item.id === valueToSelect) {
                                    dataMapOpp = `<option value="${item.id}" selected>
                                                <span class="account-title">${item.name}</span>
                                                <input type="hidden" class="data-default" value="${customer_data}">
                                                <input type="hidden" class="data-info" value="${dataStr}">
                                            </option>`
                                    // load Shipping & Billing by Customer
                                    self.loadShippingBillingCustomer(modalShipping, modalBilling, item);
                                    // load Contact by Customer
                                    if (item.id && item.owner) {
                                        self.loadBoxQuotationContact('select-box-quotation-create-contact', item.owner.id, item.id);
                                    }
                                    // load Payment Term by Customer
                                    self.loadBoxQuotationPaymentTerm('select-box-quotation-create-payment-term', item.payment_term_mapped.id);
                                    // Store Account Price List
                                    document.getElementById('customer-price-list').value = item.price_list_mapped.id;
                                    // load again price of product by customer price list then Re Calculate
                                    self.loadDataProductAll();
                                }
                            })
                            if (dataMapOpp) { // if Opportunity has Customer
                                ele.append(dataMapOpp);
                            } else { // if Opportunity doesn't have Customer or Opportunity's customer does not map customer list
                                if (!valueToSelect) {
                                    ele.append(dataAppend);
                                }
                                // load Contact no Customer
                                self.loadBoxQuotationContact('select-box-quotation-create-contact');
                                // load Payment Term no Customer
                                self.loadBoxQuotationPaymentTerm('select-box-quotation-create-payment-term')
                                // Store Account Price List
                                document.getElementById('customer-price-list').value = "";
                                // load again price of product by customer price list then Re Calculate
                                self.loadDataProductAll();

                            }
                            self.loadInformationSelectBox(ele);
                        }
                    }
                }
            )
        } else {
            ele.append(`<option value=""></option>`);
        }
    }

    loadBoxQuotationContact(contact_id, valueToSelect = null, customerID = null) {
        let self = this;
        let jqueryId = '#' + contact_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method, {'account_name_id': customerID}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.empty();
                    if (data.hasOwnProperty('contact_list') && Array.isArray(data.contact_list)) {
                        ele.append(`<option value=""></option>`);
                        data.contact_list.map(function (item) {
                            let dataStr = JSON.stringify({
                                'id': item.id,
                                'Name': item.fullname,
                                'Job title': item.job_title,
                                'Mobile': item.mobile,
                                'Email': item.email
                            }).replace(/"/g, "&quot;");
                            let dataAppend = `<option value="${item.id}">
                                            <span class="contact-title">${item.fullname}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                            if (item.id === valueToSelect) {
                                dataAppend = `<option value="${item.id}" selected>
                                            <span class="contact-title">${item.fullname}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                            }
                            ele.append(dataAppend)
                        })
                        self.loadInformationSelectBox(ele);
                    }
                }
            }
        )
    }

    loadBoxQuotationSalePerson(sale_person_id, valueToSelect = null, is_load_init = false) {
        let jqueryId = '#' + sale_person_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.empty();
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        let initEmployee = $('#data-init-quotation-create-request-employee-id');
                        if (initEmployee.val() && is_load_init === true) {
                            valueToSelect = initEmployee.val();
                        }
                        ele.append(`<option value=""></option>`);
                        data.employee_list.map(function (item) {
                            let group = '';
                            if (item.group) {
                                group = item.group.title
                            }
                            let dataStr = JSON.stringify({
                                'id': item.id,
                                'Name': item.full_name,
                                'Code': item.code,
                                'Group': group
                            }).replace(/"/g, "&quot;");
                            let option = `<option value="${item.id}">
                                            <span class="employee-title">${item.full_name}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                            if (valueToSelect && valueToSelect === item.id) {
                                option = `<option value="${item.id}" selected>
                                            <span class="employee-title">${item.full_name}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                            }
                            ele.append(option)
                        })
                    }
                }
            }
        )
    }

    loadBoxQuotationPaymentTerm(term_id, valueToSelect = null) {
        let jqueryId = '#' + term_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.empty();
                    if (data.hasOwnProperty('payment_terms_list') && Array.isArray(data.payment_terms_list)) {
                        ele.append(`<option value=""></option>`);
                        data.payment_terms_list.map(function (item) {
                            let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                            let option = `<option value="${item.id}">
                                            <span class="opp-title">${item.title}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                            if (valueToSelect && valueToSelect === item.id) {
                                option = `<option value="${item.id}" selected>
                                            <span class="opp-title">${item.title}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                            }
                            ele.append(option)
                        })
                    }
                }
            }
        )
    }

    loadBoxQuotationPrice(price_id) {
        let jqueryId = '#' + price_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
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

    loadInitQuotationProduct(product_id) {
        let jqueryId = '#' + product_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('product_list') && Array.isArray(data.product_list)) {
                        ele.val(JSON.stringify(data.product_list))
                    }
                }
            }
        )
    }

    loadBoxQuotationProduct(product_id, box_id, valueToSelect = null) {
        let self = this;
        let ele = document.getElementById(product_id);
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let linkDetail = ele.getAttribute('data-link-detail');
            eleBox.attr('data-link-detail', linkDetail);
            let data = JSON.parse(ele.value);
            eleBox.empty();
            eleBox.append(`<option value=""></option>`);
            for (let i = 0; i < data.length; i++) {
                let uom_title = "";
                let default_uom = {};
                let tax_code = {};
                if (data[i].sale_information) {
                    if (data[i].sale_information.default_uom) {
                        uom_title = data[i].sale_information.default_uom.title
                    }
                    default_uom = data[i].sale_information.default_uom;
                    tax_code = data[i].sale_information.tax_code;
                }
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'unit of measure': uom_title,
                }).replace(/"/g, "&quot;");
                let product_data = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'unit_of_measure': default_uom,
                    'price_list': data[i].price_list,
                    'cost_price': data[i].cost_price,
                    'tax': tax_code,
                }).replace(/"/g, "&quot;");
                let option = `<option value="${data[i].id}">
                                <span class="product-title">${data[i].title}</span>
                                <input type="hidden" class="data-default" value="${product_data}">
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                if (valueToSelect && valueToSelect === data[i].id) {
                    option = `<option value="${data[i].id}" selected>
                                <span class="product-title">${data[i].title}</span>
                                <input type="hidden" class="data-default" value="${product_data}">
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                }
                eleBox.append(option);
            }
            // load data information
            self.loadInformationSelectBox(eleBox);
        }
    }

    loadInitQuotationUOM(uom_id) {
        let jqueryId = '#' + uom_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('unit_of_measure') && Array.isArray(data.unit_of_measure)) {
                        ele.val(JSON.stringify(data.unit_of_measure))
                    }
                }
            }
        )
    }

    loadBoxQuotationUOM(uom_id, box_id, valueToSelect = null) {
        let ele = document.getElementById(uom_id);
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let data = JSON.parse(ele.value);
            let optionSelected = ``;
            eleBox.empty();
            eleBox.append(`<option value=""></option>`);
            for (let i = 0; i < data.length; i++) {
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                }).replace(/"/g, "&quot;");
                let option = `<option value="${data[i].id}">
                                <span class="uom-title">${data[i].title}</span>
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                if (valueToSelect && valueToSelect === data[i].id) {
                    optionSelected = `<option value="${data[i].id}" selected>
                                <span class="uom-title">${data[i].title}</span>
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                }
                eleBox.append(option)
            }
            // check if option selected
            if (optionSelected) {
                eleBox.empty();
                eleBox.append(`<option value=""></option>`);
                eleBox.append(optionSelected);
            }
        }
    }

    loadInitQuotationTax(tax_id) {
        let jqueryId = '#' + tax_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('tax_list') && Array.isArray(data.tax_list)) {
                        ele.val(JSON.stringify(data.tax_list))
                    }
                }
            }
        )
    }

    loadBoxQuotationTax(tax_id, box_id, valueToSelect = null) {
        let ele = document.getElementById(tax_id);
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let data = JSON.parse(ele.value);
            eleBox.empty();
            eleBox.append(`<option value="" data-value="0">0 %</option>`);
            for (let i = 0; i < data.length; i++) {
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'value': data[i].rate,
                }).replace(/"/g, "&quot;");
                let option = `<option value="${data[i].id}" data-value="${data[i].rate}">
                                <span class="tax-title">${data[i].rate} %</span>
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                if (valueToSelect && valueToSelect === data[i].id) {
                    option = `<option value="${data[i].id}" data-value="${data[i].rate}" selected>
                                <span class="tax-title">${data[i].rate} %</span>
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`
                }
                eleBox.append(option)
            }
        }
    }

    loadInitQuotationExpense(expense_id) {
        let jqueryId = '#' + expense_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('expense_list') && Array.isArray(data.expense_list)) {
                        ele.val(JSON.stringify(data.expense_list))
                    }
                }
            }
        )
    }

    loadBoxQuotationExpense(expense_id, box_id, valueToSelect = null) {
        let self = this;
        let ele = document.getElementById(expense_id);
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let linkDetail = ele.getAttribute('data-link-detail');
            eleBox.attr('data-link-detail', linkDetail);
            let data = JSON.parse(ele.value);
            eleBox.empty();
            eleBox.append(`<option value=""></option>`);
            for (let i = 0; i < data.length; i++) {
                let uom_title = "";
                let expense_type_title = "";
                let expense_type = {};
                let default_uom = {};
                let tax_code = {};
                let price_list = [];
                if (data[i].general_information) {
                    if (data[i].general_information.uom) {
                        uom_title = data[i].general_information.uom.title
                    }
                    if (data[i].general_information.expense_type) {
                        expense_type = data[i].general_information.expense_type;
                        expense_type_title = data[i].general_information.expense_type.title;
                    }
                    default_uom = data[i].general_information.uom;
                    tax_code = data[i].general_information.tax_code;
                    price_list = data[i].general_information.price_list;
                }
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'unit of measure': uom_title,
                    'expense type': expense_type_title,
                }).replace(/"/g, "&quot;");
                let expense_data = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'expense_type': expense_type,
                    'unit_of_measure': default_uom,
                    'price_list': price_list,
                    'tax': tax_code,
                }).replace(/"/g, "&quot;");
                let option = `<option value="${data[i].id}">
                            <span class="expense-title">${data[i].title}</span>
                            <input type="hidden" class="data-default" value="${expense_data}">
                            <input type="hidden" class="data-info" value="${dataStr}">
                        </option>`
                if (valueToSelect && valueToSelect === data[i].id) {
                    option = `<option value="${data[i].id}" selected>
                            <span class="expense-title">${data[i].title}</span>
                            <input type="hidden" class="data-default" value="${expense_data}">
                            <input type="hidden" class="data-info" value="${dataStr}">
                        </option>`
                }
                eleBox.append(option);
            }
            // load data information
            self.loadInformationSelectBox(eleBox);
        }
    }

    loadDataProductSelect(ele, is_change_item = true) {
        let self = this;
        let optionSelected = ele[0].options[ele[0].selectedIndex];
        let productData = optionSelected.querySelector('.data-default');
        if (productData) {
            let data = JSON.parse(productData.value);
            let uom = ele[0].closest('tr').querySelector('.table-row-uom');
            let price = ele[0].closest('tr').querySelector('.table-row-price');
            let priceList = ele[0].closest('tr').querySelector('.table-row-price-list');
            let tax = ele[0].closest('tr').querySelector('.table-row-tax');
            // load UOM
            if (uom && data.unit_of_measure) {
                self.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', uom.id, data.unit_of_measure.id);
            } else {
                self.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', uom.id);
            }
            // load PRICE
            if (price && priceList) {
                let valList = [];
                let account_price_list = document.getElementById('customer-price-list').value;
                $(priceList).empty();
                if (Array.isArray(data.price_list) && data.price_list.length > 0) {
                    for (let i = 0; i < data.price_list.length; i++) {
                        if (data.price_list[i].id === account_price_list) {
                            valList.push(parseFloat(data.price_list[i].value.toFixed(2)));
                            let option = `<a class="dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                        <div class="row">
                                            <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                            <div class="col-2"></div>
                                            <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                        </div>
                                    </a>`;
                            $(priceList).append(option);
                        }
                    }
                }
                // get Min Price to display
                if (is_change_item === true) {
                    if (valList.length > 0) {
                        let minVal = Math.min(...valList);
                        $(price).attr('value', String(minVal));
                    } else { // Product doesn't have price list or not map with customer price list
                        $(price).attr('value', String(0));
                    }
                }
            }
            // load TAX
            if (tax && data.tax) {
                self.loadBoxQuotationTax('data-init-quotation-create-tables-tax', tax.id, data.tax.id);
            } else {
                self.loadBoxQuotationTax('data-init-quotation-create-tables-tax', tax.id);
            }
            self.loadInformationSelectBox(ele);
        }
        $.fn.initMaskMoney2();
    }

    loadInformationSelectBox(ele) {
        let optionSelected = ele[0].options[ele[0].selectedIndex];
        let inputWrapper = ele[0].closest('.input-affix-wrapper');
        let dropdownContent = inputWrapper.querySelector('.dropdown-menu');
        dropdownContent.innerHTML = ``;
        let eleInfo = ele[0].closest('.input-affix-wrapper').querySelector('.fa-info-circle');
        eleInfo.setAttribute('disabled', true);
        let eleData = optionSelected.querySelector('.data-info');
        let link = "";
        if (optionSelected) {
            if (eleData) {
                // remove attr disabled
                if (eleInfo) {
                    eleInfo.removeAttribute('disabled');
                }
                // end
                let data = JSON.parse(eleData.value);
                let info = ``;
                info += `<h6 class="dropdown-header header-wth-bg">${$.fn.transEle.attr('data-more-information')}</h6>`;
                for (let key in data) {
                    if (key === 'id') {
                        let linkDetail = ele.data('link-detail');
                        if (linkDetail) {
                            link = linkDetail.format_url_with_uuid(data[key]);
                        }
                    } else {
                        info += `<div class="row mb-1"><h6><i>${key}</i></h6><p>${data[key]}</p></div>`;
                    }
                }
                info += `<div class="dropdown-divider"></div>
                    <div class="row">
                        <div class="col-4"></div>
                        <div class="col-8">
                            <a href="${link}" target="_blank" class="link-primary underline_hover">
                                <span><span>${$.fn.transEle.attr('data-view-detail-info')}</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                            </a>
                        </div>
                    </div>`;
                dropdownContent.innerHTML = info;
            }
        }
    }

    loadShippingBillingCustomer(modalShipping, modalBilling, item = null) {
        let modalShippingContent = modalShipping[0].querySelector('.modal-body');
        if (modalShippingContent) {
            $(modalShippingContent).empty();
            if (item) {
                for (let i = 0; i < item.shipping_address.length; i++) {
                    let address = item.shipping_address[i];
                    $(modalShippingContent).append(`<div class="row ml-1 shipping-group">
                                                    <div class="row mb-1">
                                                        <textarea class="form-control show-not-edit shipping-content disabled-custom-show" rows="3" cols="50" name="" disabled>${address}</textarea>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-5"></div>
                                                        <div class="col-4"></div>
                                                        <div class="col-3">
                                                            <button class="btn btn-primary choose-shipping">${$.fn.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>`)
                }
            }
        }
        let modalBillingContent = modalBilling[0].querySelector('.modal-body');
        if (modalBillingContent) {
            $(modalBillingContent).empty();
            if (item) {
                for (let i = 0; i < item.billing_address.length; i++) {
                    let address = item.billing_address[i];
                    $(modalBillingContent).append(`<div class="row ml-1 billing-group">
                                                    <div class="row mb-1">
                                                        <textarea class="form-control show-not-edit billing-content disabled-custom-show" rows="3" cols="50" name="" disabled>${address}</textarea>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-5"></div>
                                                        <div class="col-4"></div>
                                                        <div class="col-3">
                                                            <button class="btn btn-primary choose-billing">${$.fn.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>`)
                }
            }
        }
    }

    loadBoxSaleOrderQuotation(quotation_id, valueToSelect = null, opp_id = null, sale_person_id = null) {
        let jqueryId = '#' + quotation_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (sale_person_id) {
            let data_filter = {'sale_person': sale_person_id};
            if (opp_id) {
                data_filter = {
                    'sale_person': sale_person_id,
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
                                let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
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
                            })
                        }
                    }
                }
            )
        }
    }

    loadAPIDetailQuotation(quotation_id, select_id) {
        let jqueryId = '#' + quotation_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url-detail').format_url_with_uuid(select_id);
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#data-copy-quotation-detail').val(JSON.stringify(data))
                }
            }
        )
    }

    loadTotal(data, is_product, is_cost, is_expense) {
        let pretax = null;
        let tax = null;
        let total = null;
        let discount = null;
        let pretaxRaw = null;
        let taxRaw = null;
        let totalRaw = null;
        let discountRaw = null;
        if (is_product === true) {
            pretax = document.getElementById('quotation-create-product-pretax-amount');
            tax = document.getElementById('quotation-create-product-taxes');
            total = document.getElementById('quotation-create-product-total');
            discount = document.getElementById('quotation-create-product-discount-amount');
            pretaxRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
            taxRaw = document.getElementById('quotation-create-product-taxes-raw');
            totalRaw = document.getElementById('quotation-create-product-total-raw');
            discountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
        } else if (is_cost === true) {
            pretax = document.getElementById('quotation-create-cost-pretax-amount');
            tax = document.getElementById('quotation-create-cost-taxes');
            total = document.getElementById('quotation-create-cost-total');
            pretaxRaw = document.getElementById('quotation-create-cost-pretax-amount-raw');
            taxRaw = document.getElementById('quotation-create-cost-taxes-raw');
            totalRaw = document.getElementById('quotation-create-cost-total-raw');
        } else if (is_expense === true) {
            pretax = document.getElementById('quotation-create-expense-pretax-amount');
            tax = document.getElementById('quotation-create-expense-taxes');
            total = document.getElementById('quotation-create-expense-total');
            pretaxRaw = document.getElementById('quotation-create-expense-pretax-amount-raw');
            taxRaw = document.getElementById('quotation-create-expense-taxes-raw');
            totalRaw = document.getElementById('quotation-create-expense-total-raw');
        }
        if (pretax && tax && total) {
            if (is_product === true) {
                $(pretax).attr('value', String(data.total_product_pretax_amount));
                pretaxRaw.value = data.total_product_pretax_amount
            } else if (is_cost === true) {
                $(pretax).attr('value', String(data.total_cost_pretax_amount));
                pretaxRaw.value = data.total_cost_pretax_amount
            } else if (is_expense === true) {
                $(pretax).attr('value', String(data.total_expense_pretax_amount));
                pretaxRaw.value = data.total_expense_pretax_amount
            }
            let discountRate = document.getElementById('quotation-create-product-discount');
            if (discount && discountRate) {
                $(discount).attr('value', String(data.total_product_discount));
                discountRaw.value = data.total_product_discount;
                discountRate.value = data.total_product_discount_rate
            }
            if (is_product === true) {
                $(tax).attr('value', String(data.total_product_tax));
                taxRaw.value = data.total_product_tax
            } else if (is_cost === true) {
                $(tax).attr('value', String(data.total_cost_tax));
                taxRaw.value = data.total_cost_tax
            } else if (is_expense === true) {
                $(tax).attr('value', String(data.total_expense_tax));
                taxRaw.value = data.total_expense_tax
            }
            if (is_product === true) {
                $(total).attr('value', String(data.total_product));
                totalRaw.value = data.total_product
            } else if (is_cost === true) {
                $(total).attr('value', String(data.total_cost));
                totalRaw.value = data.total_cost
            } else if (is_expense === true) {
                $(total).attr('value', String(data.total_expense));
                totalRaw.value = data.total_expense
            }
        }
    }

    loadDetailQuotation(data, is_copy = false) {
        let self = this;
        if (data.title && is_copy === false) {
            document.getElementById('quotation-create-title').value = data.title;
        }
        if (data.code) {
            if ($('#quotation-create-code').length) {
                document.getElementById('quotation-create-code').value = data.code;
            }
        }
        if (data.opportunity) {
            if (data.sale_person) {
                self.loadBoxQuotationOpportunity('select-box-quotation-create-opportunity', data.opportunity.id, data.sale_person.id);
            } else {
                self.loadBoxQuotationOpportunity('select-box-quotation-create-opportunity', data.opportunity.id);
            }
        }
        if (data.customer) {
            if (data.sale_person) {
                self.loadBoxQuotationCustomer('select-box-quotation-create-customer', data.customer.id, $('#quotation-create-modal-shipping-body'), $('#quotation-create-modal-billing-body'), data.sale_person.id);
            } else {
                self.loadBoxQuotationCustomer('select-box-quotation-create-customer', data.customer.id, $('#quotation-create-modal-shipping-body'), $('#quotation-create-modal-billing-body'));
            }
        }
        if (data.contact) {
            self.loadBoxQuotationContact('select-box-quotation-create-contact', data.contact.id, data.customer.id)
        }
        if (data.sale_person) {
            self.loadBoxQuotationSalePerson('select-box-quotation-create-sale-person', data.sale_person.id)
        }
        if (data.payment_term) {
            self.loadBoxQuotationPaymentTerm('select-box-quotation-create-payment-term', data.payment_term.id)
        }
        if (data.quotation && data.sale_person) {
            self.loadBoxSaleOrderQuotation('select-box-quotation', data.quotation.id, null, data.sale_person.id)
        }
        if (data.date_created) {
            $('#quotation-create-date-created').val(moment(data.date_created).format('MM/DD/YYYY'));
        }
        if (is_copy === true) {
            $('#select-box-quotation').append(`<option value="${data.id}" selected>${data.title}</option>`)
            // self.loadBoxSaleOrderQuotation('select-box-quotation', data.id)
        }
        if (data.quotation_logistic_data) {
            document.getElementById('quotation-create-shipping-address').value = data.quotation_logistic_data.shipping_address;
            document.getElementById('quotation-create-billing-address').value = data.quotation_logistic_data.billing_address;
        } else if (data.sale_order_logistic_data) {
            document.getElementById('quotation-create-shipping-address').value = data.sale_order_logistic_data.shipping_address;
            document.getElementById('quotation-create-billing-address').value = data.sale_order_logistic_data.billing_address;
        }
        // product totals
        self.loadTotal(data, true, false, false);
        self.loadTotal(data, false, true, false);
        self.loadTotal(data, false, false, true);
    }

    loadDataProductAll() {
        let table = document.getElementById('datable-quotation-create-product');
        for (let i = 0; i < table.tBodies[0].rows.length; i++) {
            let row = table.tBodies[0].rows[i];
            let eleItem = row.querySelector('.table-row-item');
            if (eleItem) {
                loadPriceProduct(eleItem);
                // Re Calculate all data of rows & total
                calculateClass.commonCalculate($(table), row, true, false, false);
            }
        }
    }

    loadInitQuotationConfig(config_id, page_method) {
        let jqueryId = '#' + config_id;
        let ele = $(jqueryId);
        if (ele.hasClass('quotation-config')) {
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax(url, method).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.val(JSON.stringify(data));
                        // check config first time
                        if (page_method === "POST") {
                            configClass.checkConfig(true, null, true);
                        }
                    }
                }
            )
        }
    }
}

// DataTable
class dataTableHandle {
    dataTableProduct(data, table_id, is_load_detail = false) {
        // init dataTable
        let listData = data ? data : [];
        let jqueryId = '#' + table_id;
        let $tables = $(jqueryId);
        $tables.DataTable({
            data: listData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data, index) {
                // $.fn.initMaskMoney2();
            },
            columns: [
                {
                    targets: 0,
                    width: "1%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                let selectProductID = 'quotation-create-product-box-product-' + String(row.order);
                                return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select 
                                        class="form-select table-row-item" 
                                        id="${selectProductID}"
                                        required>
                                            <option value="${row.product.id}">${row.product.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                            } else {
                                let selectProductID = 'quotation-create-product-box-product-' + String(row.order);
                                return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select 
                                        class="form-select table-row-item disabled-but-edit" 
                                        id="${selectProductID}"
                                        required
                                        disabled>
                                            <option value="${row.product.id}">${row.product.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                            }
                        } else if (row.hasOwnProperty('is_promotion')) {
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-promotion').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row.promotion.id);
                            }
                            return `<div class="row">
                                    <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <a href="${link}" target="_blank">
                                                <i class="fas fa-gift"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-promotion disabled-custom-show" value="${row.product_title}" data-id="${row.promotion.id}" data-is-promotion-on-row="${row.is_promotion_on_row}" data-id-product="${row.product.id}" data-bs-toggle="tooltip" title="${row.product_title}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        } else if (row.hasOwnProperty('is_shipping')) {
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-shipping').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row.shipping.id);
                            }
                            let price_margin = "0";
                            if (row.shipping.hasOwnProperty('shipping_price_margin')) {
                                price_margin = row.shipping.shipping_price_margin;
                            }
                            return `<div class="row">
                                    <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <a href="${link}" target="_blank">
                                                <i class="fas fa-shipping-fast"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-shipping disabled-custom-show" value="${row.product_title}" data-id="${row.shipping.id}" data-shipping-price-margin="${price_margin}" data-bs-toggle="tooltip" title="${row.product_title}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <input type="text" class="form-control table-row-description" value="${row.product_description}">
                            </div>`;
                            } else {
                                return `<div class="row">
                                <input type="text" class="form-control table-row-description disabled-but-edit" value="${row.product_description}" disabled>
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                        <input type="text" class="form-control table-row-description disabled-custom-show" value="${row.product_description}" data-bs-toggle="tooltip" title="${row.product_description}" disabled>
                                    </div>`;
                        }
                    }
                },
                {
                    targets: 3,
                    width: "1%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                let selectUOMID = 'quotation-create-product-box-uom-' + String(row.order);
                                return `<div class="row">
                                        <select class="form-select table-row-uom" id="${selectUOMID}" required>
                                            <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                        </select>
                                    </div>`;
                            } else {
                                let selectUOMID = 'quotation-create-product-box-uom-' + String(row.order);
                                return `<div class="row">
                                        <select class="form-select table-row-uom disabled-but-edit" id="${selectUOMID}" required disabled>
                                            <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                        </select>
                                    </div>`;
                            }
                        } else {
                            return `<div class="row">
                                        <select class="form-select table-row-uom disabled-custom-show" required disabled>
                                            <option value="${row.unit_of_measure.id}">${row.product_uom_title}</option>
                                        </select>
                                    </div>`;
                        }

                    },
                },
                {
                    targets: 4,
                    width: "1%",
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number" value="${row.product_quantity}" required>
                            </div>`;
                            } else {
                                return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number disabled-but-edit" value="${row.product_quantity}" required disabled>
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number disabled-custom-show" value="${row.product_quantity}" disabled>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price" 
                                            value="${row.product_unit_price}"
                                            data-return-type="number"
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                            } else {
                                return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price disabled-but-edit" 
                                            value="${row.product_unit_price}"
                                            data-return-type="number"
                                            disabled
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price disabled-custom-show" 
                                            value="${row.product_unit_price}"
                                            data-return-type="number"
                                            disabled
                                        >
                                        <span class="input-suffix"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-discount validated-number" value="${row.product_discount_value}">
                                        <span class="input-suffix">%</span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-discount-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                            } else {
                                return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-discount validated-number disabled-but-edit" value="${row.product_discount_value}" disabled>
                                        <span class="input-suffix">%</span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-discount-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-discount validated-number disabled-custom-show" value="${row.product_discount_value}" disabled>
                                        <span class="input-suffix">%</span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-discount-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        let selectTaxID = 'quotation-create-product-box-tax-' + String(row.order);
                        let taxID = "";
                        let taxRate = "0";
                        if (row.tax) {
                            taxID = row.tax.id;
                            taxRate = row.tax.value;
                        }
                        if (!row.hasOwnProperty('is_promotion') && !row.hasOwnProperty('is_shipping')) {
                            if (is_load_detail === false) {
                                return `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
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
                                >
                            </div>`;
                            } else { // PROMOTION & SHIPPING
                                return `<div class="row">
                                <select class="form-select table-row-tax disabled-but-edit" id="${selectTaxID}" disabled>
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
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
                                >
                            </div>`;
                            }
                        } else {
                            return `<div class="row">
                                <select class="form-select table-row-tax disabled-custom-show" id="${selectTaxID}" disabled>
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
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
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 8,
                    render: (data, type, row) => {
                        return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-subtotal disabled-custom-show" 
                                    value="${row.product_subtotal_price}"
                                    data-return-type="number"
                                    disabled
                                >
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
                    targets: 9,
                    width: "1%",
                    render: () => {
                        // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a>`;
                        // return `${bt3}`
                        if (is_load_detail === false) {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                        } else {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row disabled-but-edit" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                        }
                    }
                },
            ],
        });

    }

    dataTableCost(data, table_id, is_load_detail = false) {
        // init dataTable
        let listData = data ? data : [];
        let jqueryId = '#' + table_id;
        let $tables = $(jqueryId);
        $tables.DataTable({
            data: listData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data) {
                // $.fn.initMaskMoney2();
            },
            columns: [
                {
                    targets: 0,
                    width: "1%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_shipping')) {
                            let selectProductID = 'quotation-create-cost-box-product-' + String(row.order);
                        return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select class="form-select table-row-item disabled-custom-show" id="${selectProductID}" disabled>
                                            <option value="${row.product.id}">${row.product.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                        } else {
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
                                                <i class="fas fa-shipping-fast"></i>
                                            </a>
                                        </span>
                                        <input type="text" class="form-control table-row-shipping disabled-custom-show" value="${row.product_title}" data-id="${row.shipping.id}" data-bs-toggle="tooltip" title="${row.product_title}" disabled>
                                    </span>
                                </div>
                                </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: "1%",
                    render: (data, type, row) => {
                        let selectUOMID = 'quotation-create-cost-box-uom-' + String(row.order);
                        return `<div class="row">
                                <select class="form-select table-row-uom disabled-custom-show" id="${selectUOMID}" disabled>
                                    <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                </select>
                            </div>`;
                    },
                },
                {
                    targets: 3,
                    width: "1%",
                    render: (data, type, row) => {
                        return `<div class="row">
                                <input type="text" class="form-control table-row-quantity disabled-custom-show" value="${row.product_quantity}" disabled>
                            </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    data-return-type="number"
                                    value="${row.product_cost_price}"
                                    required
                                >
                            </div>`;
                        } else {
                            return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-price disabled-but-edit" 
                                    data-return-type="number"
                                    value="${row.product_cost_price}"
                                    required
                                    disabled
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            let selectTaxID = 'quotation-create-cost-box-tax-' + String(row.order);
                            let taxID = "";
                            let taxRate = "";
                            if (row.tax) {
                                taxID = row.tax.id;
                                taxRate = row.tax.value;
                            }
                            return `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
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
                                >
                            </div>`;
                        } else {
                            let selectTaxID = 'quotation-create-cost-box-tax-' + String(row.order);
                            let taxID = "";
                            let taxRate = "";
                            if (row.tax) {
                                taxID = row.tax.id;
                                taxRate = row.tax.value;
                            }
                            return `<div class="row">
                                <select class="form-select table-row-tax disabled-but-edit" id="${selectTaxID}" disabled>
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
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
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-subtotal disabled-custom-show" 
                                    value="${row.product_subtotal_price}"
                                    data-return-type="number"
                                    disabled
                                >
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
                    width: "1%",
                    render: () => {
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a>`;
                        return `${bt3}`
                    }
                },
            ],
        });
    }

    dataTableExpense(data, table_id, is_load_detail = false) {
        // init dataTable
        let listData = data ? data : [];
        let jqueryId = '#' + table_id;
        let $tables = $(jqueryId);
        $tables.DataTable({
            data: listData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data) {
                // $.fn.initMaskMoney2();
            },
            columns: [
                {
                    targets: 0,
                    width: "1%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            let selectExpenseID = 'quotation-create-expense-box-expense-' + String(row.order);
                            return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select 
                                        class="form-select table-row-item" 
                                        id="${selectExpenseID}"
                                        required>
                                            <option value="${row.expense.id}">${row.expense.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                        } else {
                            let selectExpenseID = 'quotation-create-expense-box-expense-' + String(row.order);
                            return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select 
                                        class="form-select table-row-item disabled-but-edit" 
                                        id="${selectExpenseID}"
                                        required
                                        disabled>
                                            <option value="${row.expense.id}">${row.expense.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: "1%",
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            let selectUOMID = 'quotation-create-expense-box-uom-' + String(row.order);
                            return `<div class="row">
                                <select class="form-select table-row-uom" id="${selectUOMID}" required>
                                    <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                </select>
                            </div>`;
                        } else {
                            let selectUOMID = 'quotation-create-expense-box-uom-' + String(row.order);
                            return `<div class="row">
                                <select class="form-select table-row-uom disabled-but-edit" id="${selectUOMID}" required disabled>
                                    <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                </select>
                            </div>`;
                        }
                    },
                },
                {
                    targets: 3,
                    width: "1%",
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number" value="${row.expense_quantity}" required>
                            </div>`;
                        } else {
                            return `<div class="row">
                                <input type="text" class="form-control table-row-quantity validated-number disabled-but-edit" value="${row.expense_quantity}" required disabled>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price" 
                                            value="${row.expense_price}"
                                            data-return-type="number"
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                        } else {
                            return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price disabled-but-edit" 
                                            value="${row.expense_price}"
                                            data-return-type="number"
                                            disabled
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        if (is_load_detail === false) {
                            let selectTaxID = 'quotation-create-expense-box-tax-' + String(row.order);
                            let taxID = "";
                            let taxRate = "";
                            if (row.tax) {
                                taxID = row.tax.id;
                                taxRate = row.tax.value
                            }
                            return `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
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
                                >
                            </div>`;
                        } else {
                            let selectTaxID = 'quotation-create-expense-box-tax-' + String(row.order);
                            let taxID = "";
                            let taxRate = "";
                            if (row.tax) {
                                taxID = row.tax.id;
                                taxRate = row.tax.value
                            }
                            return `<div class="row">
                                <select class="form-select table-row-tax disabled-but-edit" id="${selectTaxID}" disabled>
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
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
                                >
                            </div>`;
                        }
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-subtotal disabled-custom-show" 
                                    value="${row.expense_subtotal_price}"
                                    data-return-type="number"
                                    disabled
                                >
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
                    targets: 7,
                    width: "1%",
                    render: () => {
                        // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a>`;
                        // return `${bt3}`
                        if (is_load_detail === false) {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                        } else {
                            return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row disabled-but-edit" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                        }
                    }
                },
            ],
        });
    }

    dataTablePromotion(data, table_id) {
        // init dataTable
        let listData = data ? data : [];
        let jqueryId = '#' + table_id;
        let $tables = $(jqueryId);
        $tables.DataTable({
            data: listData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
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
                            return `<button type="button" class="btn btn-primary apply-promotion" data-promotion-condition="${JSON.stringify(row.condition).replace(/"/g, "&quot;")}" data-promotion-id="${row.id}" data-bs-dismiss="modal">Apply</button>`;
                        } else {
                            return `<button type="button" class="btn btn-primary apply-promotion" disabled>Apply</button>`;
                        }
                    },
                }
            ],
        });
    }

    loadTableQuotationPromotion(promotion_id, customer_id = null, is_submit_check = false) {
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
            $.fn.callAjax(url, method, data_filter).then(
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
                                                    calculateClass.updateTotal(tableProduct[0], true, false, false);
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
                            self.dataTablePromotion(passList, 'datable-quotation-create-promotion');
                        }
                    }
                }
            )
        }
        return true
    }

    dataTableCopyQuotation(data, table_id) {
        // init dataTable
        let listData = data ? data : [];
        let jqueryId = '#' + table_id;
        let $tables = $(jqueryId);
        $tables.DataTable({
            data: listData,
            searching: false,
            language: {
                // search: "_INPUT_",
                // searchPlaceholder: "Search...",
                paginate: {
                    "previous": '<i data-feather="chevron-left"></i>',
                    "next": '<i data-feather="chevron-right"></i>'
                },
                info: 'Showing _START_ to _END_ of _TOTAL_ rows',
                lengthMenu: '_MENU_ rows per page',
            },
            ordering: false,
            // paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
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

    loadTableCopyQuotation(quotation_id, opp_id = null, sale_person_id = null) {
        let self = this;
        let jqueryId = '#' + quotation_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $('#datable-copy-quotation').DataTable().destroy();
        if (sale_person_id) {
            let data_filter = {'sale_person': sale_person_id};
            if (opp_id) {
                data_filter = {
                    'sale_person': sale_person_id,
                    'opportunity': opp_id
                }
            }
            $.fn.callAjax(url, method, data_filter).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('quotation_list') && Array.isArray(data.quotation_list)) {
                            self.dataTableCopyQuotation(data.quotation_list, 'datable-copy-quotation');
                        }
                    }
                }
            )
        } else {
            self.dataTableCopyQuotation([], 'datable-copy-quotation');
        }
    }

    dataTableCopyQuotationProduct(data, table_id) {
        // init dataTable
        let listData = data ? data : [];
        let jqueryId = '#' + table_id;
        let $tables = $(jqueryId);
        $tables.DataTable({
            data: listData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
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
                    render: (data, type, row, meta) => {
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

    dataTableShipping(data, table_id) {
        // init dataTable
        let listData = data ? data : [];
        let jqueryId = '#' + table_id;
        let $tables = $(jqueryId);
        $tables.DataTable({
            data: listData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
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

    loadTableQuotationShipping(shipping_id) {
        let self = this;
        let jqueryId = '#' + shipping_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        let passList = [];
        let failList = [];
        let checkList = [];
        let data_filter = {};
        $.fn.callAjax(url, method).then(
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
                            self.dataTableShipping(passList, 'datable-quotation-create-shipping');
                        } else {
                            self.dataTableShipping(passList, 'datable-quotation-create-shipping');
                            $.fn.notifyPopup({description: $.fn.transEle.attr('data-check-if-shipping-address')}, 'failure');
                        }
                    }
                }
            }
        )
    }
}

// Calculate
class calculateCaseHandle {
    updateTotal(table, is_product, is_cost, is_expense) {
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
        if (is_product === true) {
            elePretaxAmount = document.getElementById('quotation-create-product-pretax-amount');
            eleTaxes = document.getElementById('quotation-create-product-taxes');
            eleTotal = document.getElementById('quotation-create-product-total');
            eleDiscount = document.getElementById('quotation-create-product-discount-amount');
            elePretaxAmountRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
            eleTaxesRaw = document.getElementById('quotation-create-product-taxes-raw');
            eleTotalRaw = document.getElementById('quotation-create-product-total-raw');
            eleDiscountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
        } else if (is_cost === true) {
            elePretaxAmount = document.getElementById('quotation-create-cost-pretax-amount');
            eleTaxes = document.getElementById('quotation-create-cost-taxes');
            eleTotal = document.getElementById('quotation-create-cost-total');
            elePretaxAmountRaw = document.getElementById('quotation-create-cost-pretax-amount-raw');
            eleTaxesRaw = document.getElementById('quotation-create-cost-taxes-raw');
            eleTotalRaw = document.getElementById('quotation-create-cost-total-raw');
        } else if (is_expense === true) {
            elePretaxAmount = document.getElementById('quotation-create-expense-pretax-amount');
            eleTaxes = document.getElementById('quotation-create-expense-taxes');
            eleTotal = document.getElementById('quotation-create-expense-total');
            elePretaxAmountRaw = document.getElementById('quotation-create-expense-pretax-amount-raw');
            eleTaxesRaw = document.getElementById('quotation-create-expense-taxes-raw');
            eleTotalRaw = document.getElementById('quotation-create-expense-total-raw');
        }
        if (elePretaxAmount && eleTaxes && eleTotal) {
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
            }
            let discount_on_total = 0;
            let discountTotalRate = $('#quotation-create-product-discount').val();
            if (discountTotalRate && eleDiscount) {
                discount_on_total = parseFloat(discountTotalRate);
                discountAmount = ((pretaxAmount * discount_on_total) / 100)
                // check if shipping fee then minus before calculate discount
                if (shippingFee > 0) {
                    discountAmount = (((pretaxAmount - shippingFee) * discount_on_total) / 100)
                }
            }
            let totalFinal = (pretaxAmount - discountAmount + taxAmount);

            $(elePretaxAmount).attr('value', String(pretaxAmount));
            elePretaxAmountRaw.value = pretaxAmount;
            if (eleDiscount) {
                $(eleDiscount).attr('value', String(discountAmount));
                eleDiscountRaw.value = discountAmount;
            }
            $(eleTaxes).attr('value', String(taxAmount));
            eleTaxesRaw.value = taxAmount;
            $(eleTotal).attr('value', String(totalFinal));
            eleTotalRaw.value = totalFinal;
        }
        $.fn.initMaskMoney2();
    }

    calculate(row) {
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
            let optionSelected = eleTax.options[eleTax.selectedIndex];
            if (optionSelected) {
                tax = parseInt(optionSelected.getAttribute('data-value'));
            }
        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        let eleTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
        // calculate discount + tax
        let eleDiscount = row.querySelector('.table-row-discount');
        let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
        if (eleDiscount && eleDiscountAmount) {
            if (eleDiscount.value) {
                discount = parseFloat(eleDiscount.value)
            } else if (!eleDiscount.value || eleDiscount.value === "0") {
                discount = 0
            }
            let discount_on_total = 0;
            let discountTotalRate = $('#quotation-create-product-discount').val();
            if (discountTotalRate) {
                discount_on_total = parseFloat(discountTotalRate);
            }

            let discountAmount = ((price * discount) / 100);
            let priceDiscountOnRow = (price - discountAmount);
            subtotal = (priceDiscountOnRow * quantity);

            let discountAmountOnTotal = ((priceDiscountOnRow * discount_on_total) / 100);
            subtotalPlus = ((priceDiscountOnRow - discountAmountOnTotal) * quantity);
            // calculate tax
            if (eleTaxAmount) {
                let taxAmount = ((subtotalPlus * tax) / 100);
                $(eleTaxAmount).attr('value', String(taxAmount));
                eleTaxAmountRaw.value = taxAmount;
            }
            // eleDiscountAmount.value = discountAmountOnTotal;
            $(eleDiscountAmount).attr('value', String(discountAmountOnTotal));
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
            $(eleSubtotal).attr('value', String(subtotal));
            eleSubtotalRaw.value = subtotal;
        }
        $.fn.initMaskMoney2();
    }

    commonCalculate(table, row, is_product = false, is_cost = false, is_expense = false) {
        let self = this;
        self.calculate(row);
        // calculate total
        if (is_product === true) {
            self.updateTotal(table[0], true, false, false)
        } else if (is_cost === true) {
            self.updateTotal(table[0], false, true, false)
        } else if (is_expense === true) {
            self.updateTotal(table[0], false, false, true)
        }

    }

    loadProductCopy(dataCopy, table, is_product = false, is_expense = false) {
        let self = this;
        let dataApply = [];
        let btnAddID = "";
        let selectID = ""
        if (is_product === true) {
            dataApply = dataCopy.quotation_products_data;
            btnAddID = 'btn-add-product-quotation-create';
            selectID = '#quotation-create-product-box-product-'
        } else if (is_expense === true) {
            dataApply = dataCopy.quotation_expenses_data;
            btnAddID = 'btn-add-expense-quotation-create';
            selectID = '#quotation-create-expense-box-expense-'
        }
        table.DataTable().clear().draw();
        for (let i = 0; i < dataApply.length; i++) {
            document.getElementById(btnAddID).click();
        }
        for (let i = 0; i < dataApply.length; i++) {
            let data = dataApply[i];
            let selectProdID = selectID + String(data.order);
            let row = table[0].querySelector(selectProdID).closest('tr');
            if (row) {
                if (is_product === true) {
                    row.querySelector('.table-row-order').innerHTML = data.order;
                    for (let p = 0; p < row.querySelector('.table-row-item').options.length; p++) {
                        let option = row.querySelector('.table-row-item').options[p];
                        if (option.value === data.product.id) {
                            option.selected = true;
                            break
                        }
                    }
                    row.querySelector('.table-row-description').value = data.product_description;
                    for (let u = 0; u < row.querySelector('.table-row-uom').options.length; u++) {
                        let option = row.querySelector('.table-row-uom').options[u];
                        if (option.value === data.unit_of_measure.id) {
                            option.selected = true;
                            break
                        }
                    }
                    row.querySelector('.table-row-quantity').value = data.product_quantity;
                    $(row.querySelector('.table-row-price')).attr('value', data.product_unit_price);
                    row.querySelector('.table-row-discount').value = data.product_discount_value;
                    for (let t = 0; t < row.querySelector('.table-row-tax').options.length; t++) {
                        let option = row.querySelector('.table-row-tax').options[t];
                        if (option.value === data.tax.id) {
                            option.selected = true;
                            break
                        }
                    }
                    // self.commonCalculate(table, row, true, false, false);
                } else if (is_expense === true) {
                    row.querySelector('.table-row-order').innerHTML = data.order;
                    for (let p = 0; p < row.querySelector('.table-row-item').options.length; p++) {
                        let option = row.querySelector('.table-row-item').options[p];
                        if (option.value === data.expense.id) {
                            option.selected = true;
                            break
                        }
                    }
                    for (let u = 0; u < row.querySelector('.table-row-uom').options.length; u++) {
                        let option = row.querySelector('.table-row-uom').options[u];
                        if (option.value === data.unit_of_measure.id) {
                            option.selected = true;
                            break
                        }
                    }
                    row.querySelector('.table-row-quantity').value = data.expense_quantity;
                    $(row.querySelector('.table-row-price')).attr('value', data.expense_price);
                    if (data.tax) {
                        for (let t = 0; t < row.querySelector('.table-row-tax').options.length; t++) {
                            let option = row.querySelector('.table-row-tax').options[t];
                            if (option.value === data.tax.id) {
                                option.selected = true;
                                break
                            }
                        }
                    }
                    self.commonCalculate(table, row, false, false, true);
                }
            }
        }
        if (is_product === true) {
            let totalDiscountRate = document.getElementById('quotation-create-product-discount');
            totalDiscountRate.value = dataCopy.total_product_discount_rate;
            $('#quotation-create-product-discount').trigger('change');
        }
    }

}

let calculateClass = new calculateCaseHandle();

// Config
class checkConfigHandle {
    checkConfig(is_change_opp = false, new_row = null, is_first_time = false, is_has_opp_detail = false) {
        let self = this;
        let configRaw = $('#quotation-config-data').val();
        if (configRaw) {
            let opportunity = $('#select-box-quotation-create-opportunity').val();
            let config = JSON.parse(configRaw);
            let tableProduct = document.getElementById('datable-quotation-create-product');
            let empty_list = ["", null]
            if ((!opportunity || empty_list.includes(opportunity)) && is_has_opp_detail === false) { // short sale
                if (is_change_opp === true) {
                    // ReCheck Table Product
                    if (is_first_time === false) {
                        if (!tableProduct.querySelector('.dataTables_empty')) {
                            for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                                let row = tableProduct.tBodies[0].rows[i];
                                self.reCheckTable(config, row, true, false);
                                // Re Calculate all data of rows & total
                                calculateClass.commonCalculate($(tableProduct), row, true, false, false);
                            }
                        }
                    }
                    let eleDiscountTotal = document.getElementById('quotation-create-product-discount');
                    if (config.short_sale_config.is_discount_on_total === false) {
                        if (!eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.setAttribute('disabled', 'true');
                            eleDiscountTotal.classList.add('disabled-custom-show');
                            eleDiscountTotal.value = "0";
                        }
                    } else {
                        if (eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.removeAttribute('disabled');
                            eleDiscountTotal.classList.remove('disabled-custom-show');
                        }
                    }
                    // ReCalculate Total
                    if (is_first_time === false) {
                        calculateClass.updateTotal(tableProduct, true, false, false);
                    }
                } else {
                    if (new_row) {
                        self.reCheckTable(config, new_row, true, false);
                    }
                }
                $.fn.initMaskMoney2();
                return {
                    'is_short_sale': true,
                    'is_long_sale': false,
                    'short_sale_config': config.short_sale_config,
                }
            } else { // long sale
                if (is_change_opp === true) {
                    // ReCheck Table Product
                    if (is_first_time === false) {
                        if (!tableProduct.querySelector('.dataTables_empty')) {
                            for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                                let row = tableProduct.tBodies[0].rows[i];
                                self.reCheckTable(config, row, false, true);
                                // Re Calculate all data of rows & total
                                calculateClass.commonCalculate($(tableProduct), row, true, false, false);
                            }
                        }
                    }
                    let eleDiscountTotal = document.getElementById('quotation-create-product-discount');
                    if (config.long_sale_config.is_not_discount_on_total === false) {
                        if (eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.removeAttribute('disabled');
                            eleDiscountTotal.classList.remove('disabled-custom-show');
                        }
                    } else {
                        if (!eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.setAttribute('disabled', 'true');
                            eleDiscountTotal.classList.add('disabled-custom-show');
                            eleDiscountTotal.value = "0";
                        }
                    }
                    // ReCalculate Total
                    if (is_first_time === false) {
                        calculateClass.updateTotal(tableProduct, true, false, false);
                    }
                } else {
                    if (new_row) {
                        self.reCheckTable(config, new_row, false, true);
                    }
                }
                $.fn.initMaskMoney2();
                return {
                    'is_short_sale': false,
                    'is_long_sale': true,
                    'short_sale_config': config.long_sale_config,
                }
            }
        }
        return {
            'is_short_sale': false,
            'is_long_sale': false,
        }
    }

    reCheckTable(config, row, is_short_sale = false, is_long_sale = false) {
        let self = this;
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
                            loadPriceProduct(eleProduct);
                        }
                    } else {
                        if (!elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.setAttribute('data-bs-toggle', 'dropdown')
                        }
                    }
                    if (config.short_sale_config.is_input_price === false) {
                        if (!elePrice.hasAttribute('disabled')) {
                            elePrice.setAttribute('disabled', 'true');
                            elePrice.classList.add('disabled-custom-show');
                            // $(elePrice).attr('value', String(0));
                            loadPriceProduct(eleProduct);
                        }
                    } else {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    }
                    if (eleDiscount) {
                        if (config.short_sale_config.is_discount_on_product === false) {
                            if (!eleDiscount.hasAttribute('disabled')) {
                                eleDiscount.setAttribute('disabled', 'true');
                                eleDiscount.classList.add('disabled-custom-show');
                                eleDiscount.value = "0";
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
                        if (!elePrice.hasAttribute('disabled')) {
                            elePrice.setAttribute('disabled', 'true');
                            elePrice.classList.add('disabled-custom-show');
                            loadPriceProduct(eleProduct);
                        }
                    }
                    if (eleDiscount) {
                        if (config.long_sale_config.is_not_discount_on_product === false) {
                            if (eleDiscount.hasAttribute('disabled')) {
                                eleDiscount.removeAttribute('disabled');
                                eleDiscount.classList.remove('disabled-custom-show');
                            }
                        } else {
                            if (!eleDiscount.hasAttribute('disabled')) {
                                eleDiscount.setAttribute('disabled', 'true');
                                eleDiscount.classList.add('disabled-custom-show');
                                eleDiscount.value = "0";
                            }
                        }
                    }
                }
            }
        }
    }

}

let configClass = new checkConfigHandle();

// Submit Form
class submitHandle {
    setupDataProduct() {
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
                let optionSelected = eleProduct.options[eleProduct.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
                    }
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if (eleUOM) {
                    let optionSelected = eleUOM.options[eleUOM.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['unit_of_measure'] = dataInfo.id;
                            rowData['product_uom_title'] = dataInfo.title;
                            rowData['product_uom_code'] = dataInfo.code;
                        }
                    }
                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
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
                rowData['promotion'] = null;
                rowData['shipping'] = null;
            } else if (elePromotion) { // PROMOTION
                let check_none_blank_list = ['', "", null, "undefined"];
                rowData['is_promotion'] = true;
                rowData['product'] = null;
                if (elePromotion.getAttribute('data-id-product') && !check_none_blank_list.includes(elePromotion.getAttribute('data-id-product'))) {
                   rowData['product'] = elePromotion.getAttribute('data-id-product');
                }
                rowData['promotion'] = elePromotion.getAttribute('data-id');
                rowData['shipping'] = null;
                rowData['product_title'] = elePromotion.value;
                rowData['product_code'] = elePromotion.value;
                rowData['unit_of_measure'] = null;
                rowData['product_uom_title'] = "";
                rowData['product_uom_code'] = "";
                let uomData = getDataByProductID(elePromotion.getAttribute('data-id-product'));
                if (uomData && Object.keys(uomData).length > 0) {
                    rowData['unit_of_measure'] = uomData.id;
                    rowData['product_uom_title'] = uomData.title;
                    rowData['product_uom_code'] = uomData.code;
                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
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
            } else if (eleShipping) { // SHIPPING
                rowData['is_shipping'] = true;
                rowData['product'] = null;
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
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
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
            }
            result.push(rowData);
        }
        return result
    }

    setupDataCost() {
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
            if (eleProduct) { // PRODUCT
                let optionSelected = eleProduct.options[eleProduct.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
                    }
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if (eleUOM) {
                    let optionSelected = eleUOM.options[eleUOM.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['unit_of_measure'] = dataInfo.id;
                            rowData['product_uom_title'] = dataInfo.title;
                            rowData['product_uom_code'] = dataInfo.code;
                        }
                    }

                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
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
                rowData['shipping'] = null;
            } else if (eleShipping) { // SHIPPING
                rowData['is_shipping'] = true;
                rowData['product'] = null;
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
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.value;
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
            }
            result.push(rowData);
        }
        return result
    }

    setupDataExpense() {
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
            let eleExpense = row.querySelector('.table-row-item');
            if (eleExpense) {
                let optionSelected = eleExpense.options[eleExpense.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['expense'] = dataInfo.id;
                        rowData['expense_title'] = dataInfo.title;
                        rowData['expense_code'] = dataInfo.code;
                        rowData['expense_type_title'] = dataInfo['expense type'];
                    }
                }
            }
            let eleUOM = row.querySelector('.table-row-uom');
            if (eleUOM) {
                let optionSelected = eleUOM.options[eleUOM.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['unit_of_measure'] = dataInfo.id;
                        rowData['expense_uom_title'] = dataInfo.title;
                        rowData['expense_uom_code'] = dataInfo.code;
                    }
                }

            }
            let eleTax = row.querySelector('.table-row-tax');
            if (eleTax) {
                let optionSelected = eleTax.options[eleTax.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['tax'] = dataInfo.id;
                        rowData['expense_tax_title'] = dataInfo.title;
                        rowData['expense_tax_value'] = dataInfo.value;
                    } else {
                        rowData['expense_tax_value'] = 0;
                    }
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
            if (rowData.hasOwnProperty('expense') && rowData.hasOwnProperty('unit_of_measure')) {
                result.push(rowData);
            }
        }
        return result
    }

    setupDataLogistic() {
        return {
            'shipping_address': $('#quotation-create-shipping-address').val(),
            'billing_address': $('#quotation-create-billing-address').val(),
        }
    }

    setupDataIndicator() {
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
                result.push({
                    'indicator': indicator,
                    'indicator_value': parseFloat(indicator_value),
                    'indicator_rate': parseFloat(indicator_rate),
                    'order': parseInt(order),
                })
            }
        }
        return result
    }

    setupDataSubmit(_form, is_sale_order = false) {
        let self = this;
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
            _form.dataForm['date_created'] = moment(dateCreatedVal).format('YYYY-MM-DD HH:mm:ss')
        }
        _form.dataForm['status'] = $('#quotation-create-status').val();
        _form.dataForm['total_product_pretax_amount'] = parseFloat($('#quotation-create-product-pretax-amount-raw').val());
        let totalProductDiscountRate = $('#quotation-create-product-discount').val();
        if (totalProductDiscountRate) {
            _form.dataForm['total_product_discount_rate'] = parseFloat(totalProductDiscountRate);
        } else {
            _form.dataForm['total_product_discount_rate'] = 0;
        }
        _form.dataForm['total_product_discount'] = parseFloat($('#quotation-create-product-discount-amount-raw').val());
        _form.dataForm['total_product_tax'] = parseFloat($('#quotation-create-product-taxes-raw').val());
        _form.dataForm['total_product'] = parseFloat($('#quotation-create-product-total-raw').val());
        _form.dataForm['total_cost_pretax_amount'] = parseFloat($('#quotation-create-cost-pretax-amount-raw').val());
        _form.dataForm['total_cost_tax'] = parseFloat($('#quotation-create-cost-taxes-raw').val());
        _form.dataForm['total_cost'] = parseFloat($('#quotation-create-cost-total-raw').val());
        _form.dataForm['total_expense_pretax_amount'] = parseFloat($('#quotation-create-expense-pretax-amount-raw').val());
        _form.dataForm['total_expense_tax'] = parseFloat($('#quotation-create-expense-taxes-raw').val());
        _form.dataForm['total_expense'] = parseFloat($('#quotation-create-expense-total-raw').val());

        let quotation_products_data_setup = self.setupDataProduct();
        if (quotation_products_data_setup.length > 0) {
            _form.dataForm[quotation_products_data] = quotation_products_data_setup
        }
        let quotation_costs_data_setup = self.setupDataCost();
        if (quotation_costs_data_setup.length > 0) {
            _form.dataForm[quotation_costs_data] = quotation_costs_data_setup
        }
        let quotation_expenses_data_setup = self.setupDataExpense();
        if (quotation_expenses_data_setup.length > 0) {
            _form.dataForm[quotation_expenses_data] = quotation_expenses_data_setup
        }

        _form.dataForm[quotation_logistic_data] = self.setupDataLogistic();

        let quotation_indicators_data_setup = self.setupDataIndicator();
        if (quotation_indicators_data_setup.length > 0) {
            _form.dataForm[quotation_indicators_data] = quotation_indicators_data_setup
        }
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
        table.DataTable().clear();
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
        if (!dataProd.hasOwnProperty('is_promotion') && !dataProd.hasOwnProperty('is_shipping')) {
            order++;
            dataProd['order'] = order;
            finalList.push(dataProd)
        }
    }
    return finalList
}

function loadPriceProduct(eleProduct) {
        let optionSelected = eleProduct.options[eleProduct.selectedIndex];
        let productData = optionSelected.querySelector('.data-default');
        if (productData) {
            let data = JSON.parse(productData.value);
            let price = eleProduct.closest('tr').querySelector('.table-row-price');
            let priceList = eleProduct.closest('tr').querySelector('.table-row-price-list');
            // load PRICE
            if (price && priceList) {
                let valList = [];
                let account_price_list = document.getElementById('customer-price-list').value;
                $(priceList).empty();
                for (let i = 0; i < data.price_list.length; i++) {
                    if (data.price_list[i].id === account_price_list) {
                        valList.push(parseFloat(data.price_list[i].value.toFixed(2)));
                        let option = `<a class="dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                    <div class="row">
                                        <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                        <div class="col-2"></div>
                                        <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                    </div>
                                </a>`;
                        $(priceList).append(option);
                    }
                }
                // get Min Price to display
                if (valList.length > 0) {
                    let minVal = Math.min(...valList);
                    $(price).attr('value', String(minVal));
                } else { // Product doesn't have price list or not map with customer price list
                    $(price).attr('value', String(0));
                }
            }
        }
        $.fn.initMaskMoney2();
    }

function getDataByProductID(product_id) {
    let uom_data = {};
    let eleDataList = document.getElementById('data-init-quotation-create-tables-product');
    let dataList = JSON.parse(eleDataList.value);
    for (let i = 0; i < dataList.length; i++) {
        let data = dataList[i];
        if (data.id === product_id) {
            if (data.sale_information) {
                uom_data = data.sale_information.default_uom;
                break
            }
        }
    }
    return uom_data
}