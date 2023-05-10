class loadDataHandle {
    loadBoxQuotationOpportunity(opp_id) {
        let jqueryId = '#' + opp_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                        ele.append(`<option value=""></option>`);
                        data.opportunity_list.map(function (item) {
                            let dataStr = JSON.stringify({
                                'id': item.id,
                                'title': item.title,
                                'code': item.code,
                                'customer': item.customer.title
                            }).replace(/"/g, "&quot;");
                            let opportunity_data = JSON.stringify(item).replace(/"/g, "&quot;");
                            let data_show = `${item.title}` + `-` + `${item.code}`;
                            ele.append(`<option value="${item.id}">
                                        <span class="opp-title">${data_show}</span>
                                        <input type="hidden" class="data-default" value="${opportunity_data}">
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                        })
                    }
                }
            }
        )
    }

    loadBoxQuotationCustomer(customer_id, valueToSelect = null, modalShipping = null, modalBilling = null) {
        let self = this;
        let jqueryId = '#' + customer_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        ele.empty();
        self.loadShippingBillingCustomer(modalShipping, modalBilling);
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                        ele.append(`<option value=""></option>`);
                        let dataAppend = ``;
                        let dataMapOpp = ``;
                        data.account_list.map(function (item) {
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
                                self.loadShippingBillingCustomer(modalShipping, modalBilling, item);
                                if (item.id && item.owner) {
                                    self.loadBoxQuotationContact('select-box-quotation-create-contact', item.owner.id, item.id);
                                }
                            }
                        })
                        if (dataMapOpp) {
                            ele.append(dataMapOpp)
                        } else {
                            ele.append(dataAppend)
                        }
                        self.loadInformationSelectBox(ele);
                    }
                }
            }
        )
    }

    loadBoxQuotationContact(contact_id, valueToSelect = null, customerID = null) {
        let self = this;
        let jqueryId = '#' + contact_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        ele.empty();
        $.fn.callAjax(url, method, {'account_name_id': customerID}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
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

    loadBoxQuotationSalePerson(sale_person_id) {
        let jqueryId = '#' + sale_person_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        let employee_current_id = $('#data-init-quotation-create-request-employee-id').val();
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
                            if (item.id === employee_current_id) {
                                ele.append(`<option value="${item.id}" selected>
                                            <span class="employee-title">${item.full_name}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`)
                            } else {
                                ele.append(`<option value="${item.id}">
                                            <span class="employee-title">${item.full_name}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    loadBoxQuotationPaymentTerm(term_id) {
        let jqueryId = '#' + term_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('payment_terms_list') && Array.isArray(data.payment_terms_list)) {
                        ele.append(`<option value=""></option>`);
                        data.payment_terms_list.map(function (item) {
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

    loadBoxQuotationProduct(product_id, box_id) {
        let ele = document.getElementById(product_id);
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let linkDetail = ele.getAttribute('data-link-detail');
            eleBox.attr('data-link-detail', linkDetail);
            let data = JSON.parse(ele.value);
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
                eleBox.append(`<option value="${data[i].id}">
                            <span class="product-title">${data[i].title}</span>
                            <input type="hidden" class="data-default" value="${product_data}">
                            <input type="hidden" class="data-info" value="${dataStr}">
                        </option>`)
            }
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

    loadBoxQuotationUOM(uom_id, box_id) {
        let ele = document.getElementById(uom_id);
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let data = JSON.parse(ele.value);
            for (let i = 0; i < data.length; i++) {
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                }).replace(/"/g, "&quot;");
                eleBox.append(`<option value="${data[i].id}">
                                <span class="uom-title">${data[i].title}</span>
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`)
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

    loadBoxQuotationTax(tax_id, box_id) {
        let ele = document.getElementById(tax_id);
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let data = JSON.parse(ele.value);
            for (let i = 0; i < data.length; i++) {
                let dataStr = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'value': data[i].rate,
                }).replace(/"/g, "&quot;");
                eleBox.append(`<option value="${data[i].id}" data-value="${data[i].rate}">
                            <span class="tax-title">${data[i].rate} %</span>
                            <input type="hidden" class="data-info" value="${dataStr}">
                        </option>`)
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

    loadBoxQuotationExpense(expense_id, box_id) {
        let ele = document.getElementById(expense_id);
        let jqueryId = '#' + box_id;
        let eleBox = $(jqueryId);
        if (ele && eleBox) {
            let linkDetail = ele.getAttribute('data-link-detail');
            eleBox.attr('data-link-detail', linkDetail);
            let data = JSON.parse(ele.value);
            for (let i = 0; i < data.length; i++) {
                let uom_title = "";
                let default_uom = {};
                let tax_code = {};
                let price_list = [];
                if (data[i].general_information) {
                    if (data[i].general_information.uom) {
                        uom_title = data[i].general_information.uom.title
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
                }).replace(/"/g, "&quot;");
                let expense_data = JSON.stringify({
                    'id': data[i].id,
                    'title': data[i].title,
                    'code': data[i].code,
                    'unit_of_measure': default_uom,
                    'price_list': price_list,
                    'tax': tax_code,
                }).replace(/"/g, "&quot;");
                eleBox.append(`<option value="${data[i].id}">
                            <span class="expense-title">${data[i].title}</span>
                            <input type="hidden" class="data-default" value="${expense_data}">
                            <input type="hidden" class="data-info" value="${dataStr}">
                        </option>`)
            }
        }
    }

    loadDataProductSelect(ele) {
        let self = this;
        let optionSelected = ele[0].options[ele[0].selectedIndex];
        let productData = optionSelected.querySelector('.data-default');
        if (productData) {
            let data = JSON.parse(productData.value);
            let uom = ele[0].closest('tr').querySelector('.table-row-uom');
            let price = ele[0].closest('tr').querySelector('.table-row-price');
            let priceList = ele[0].closest('tr').querySelector('.table-row-price-list');
            let tax = ele[0].closest('tr').querySelector('.table-row-tax');
            if (uom && data.unit_of_measure) {
                uom.value = data.unit_of_measure.id;
            }
            if (price && priceList) {
                let valList = [];
                $(priceList).empty();
                for (let i = 0; i < data.price_list.length; i++) {
                    valList.push(data.price_list[i].value);
                    let option = `<a class="dropdown-item table-row-price-option" data-value="${data.price_list[i].value}">
                                    <div class="row">
                                        <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                        <div class="col-2"></div>
                                        <div class="col-5"><span>${CCurrency.convertCurrency(data.price_list[i].value)}</span></div>
                                    </div>
                                </a>`;
                    $(priceList).append(option);
                }
                if (valList) {
                    let minVal = Math.min(...valList);
                    price.value = minVal;
                    init_mask_money_ele($(price));
                }
            }
            if (tax && data.tax) {
                tax.value = data.tax.id;
            }
            self.loadInformationSelectBox(ele);
        }
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
                info += `<h6 class="dropdown-header header-wth-bg">More Information</h6>`;
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
                        <div class="col-7">
                            <a href="${link}" target="_blank" class="link-primary underline_hover">
                                <span><span>View Detail</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                            </a>
                        </div>
                        <div class="col-1"></div>
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
                                                            <button class="btn btn-primary choose-shipping">Select This Address</button>
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
                                                            <button class="btn btn-primary choose-billing">Select This Address</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <br>`)
            }
        }
    }
}
}

class dataTableHandle {
    dataTableProduct(data, table_id) {
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
                    width: "1%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
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
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<div class="row">
                                <input type="text" class="form-control table-row-description" value="${row.product_description}">
                            </div>`;
                    }
                },
                {
                    targets: 3,
                    width: "1%",
                    render: (data, type, row) => {
                        let selectUOMID = 'quotation-create-product-box-uom-' + String(row.order);
                        return `<div class="row">
                                <select class="form-select table-row-uom" id="${selectUOMID}" required>
                                    <option value="${row.unit_of_measure.id}">${row.unit_of_measure.title}</option>
                                </select>
                            </div>`;
                    },
                },
                {
                    targets: 4,
                    width: "1%",
                    render: (data, type, row) => {
                        return `<div class="row">
                                <input type="text" class="form-control table-row-quantity" value="${row.product_quantity}" required>
                            </div>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price" 
                                            value="${row.product_unit_price}"
                                            data-return-type="number"
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
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-discount non-negative-number" value="${row.product_discount_value}">
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
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        let selectTaxID = 'quotation-create-product-box-tax-' + String(row.order);
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
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                        return `${bt3}`
                    }
                },
            ],
        });

    }

    dataTableCost(data, table_id) {
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
                    width: "1%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
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
                                        <select class="form-select table-row-item disabled-custom-show" disabled>
                                            <option value="${row.product.id}">${row.product.title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                    }
                },
                {
                    targets: 2,
                    width: "1%",
                    render: (data, type, row) => {
                        return `<div class="row">
                                <select class="form-select table-row-uom disabled-custom-show" disabled>
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
                        return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    data-return-type="number"
                                    value="${row.product_cost_price}"
                                    required
                                >
                            </div>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let taxID = "";
                        let taxRate = "";
                        if (row.tax) {
                            taxID = row.tax.id;
                            taxRate = row.tax.value;
                        }
                        return `<div class="row">
                                <select class="form-select table-row-tax">
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
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                        return `${bt3}`
                    }
                },
            ],
        });
    }

    dataTableExpense(data, table_id) {
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
                    width: "1%",
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
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
                    }
                },
                {
                    targets: 2,
                    width: "1%",
                    render: (data, type, row) => {
                        let selectUOMID = 'quotation-create-expense-box-uom-' + String(row.order);
                        return `<div class="row">
                                <select class="form-select table-row-uom" id="${selectUOMID}" required>
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
                                <input type="text" class="form-control table-row-quantity" value="${row.expense_quantity}" required>
                            </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price" 
                                            value="${row.expense_price}"
                                            data-return-type="number"
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
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
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
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                        return `${bt3}`
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
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row.title}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-primary">Apply</button>`;
                    },
                }
            ],
        });
    }
}

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
            let tableLen = table.tBodies[0].rows.length;
            for (let i = 0; i < tableLen; i++) {
                let row = table.tBodies[0].rows[i];
                // calculate Pretax Amount
                let subtotalRaw = row.querySelector('.table-row-subtotal-raw');
                if (subtotalRaw) {
                    if (subtotalRaw.value) {
                        pretaxAmount += parseFloat(subtotalRaw.value)
                    }
                }
                // calculate Tax Amount
                let subTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
                if (subTaxAmountRaw) {
                    if (subTaxAmountRaw.value) {
                        taxAmount += parseFloat(subTaxAmountRaw.value)
                    }
                }
            }
            let discount_on_total = 0;
            let discountTotalRate = $('#quotation-create-product-discount').val();
            if (discountTotalRate && eleDiscount) {
                discount_on_total = parseFloat(discountTotalRate);
                discountAmount = ((pretaxAmount * discount_on_total) / 100)
            }
            let totalFinal = (pretaxAmount - discountAmount + taxAmount);

            elePretaxAmount.value = pretaxAmount;
            elePretaxAmountRaw.value = pretaxAmount;
            init_mask_money_ele($(elePretaxAmount));
            if (eleDiscount) {
                eleDiscount.value = discountAmount;
                eleDiscountRaw.value = discountAmount;
                init_mask_money_ele($(eleDiscount));
            }
            eleTaxes.value = taxAmount;
            eleTaxesRaw.value = taxAmount;
            init_mask_money_ele($(eleTaxes));
            eleTotal.value = totalFinal;
            eleTotalRaw.value = totalFinal;
            init_mask_money_ele($(eleTotal));
        }
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
                quantity = parseInt(eleQuantity.value)
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
                eleTaxAmount.value = taxAmount;
                eleTaxAmountRaw.value = taxAmount;
                init_mask_money_ele($(eleTaxAmount));
            }
            eleDiscountAmount.value = discountAmountOnTotal;
            init_mask_money_ele($(eleDiscountAmount));
        } else {
            // calculate tax no discount on total
            if (eleTaxAmount) {
                let taxAmount = ((subtotal * tax) / 100);
                eleTaxAmount.value = taxAmount;
                eleTaxAmountRaw.value = taxAmount;
                init_mask_money_ele($(eleTaxAmount));
            }
        }
        // set subtotal value
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        let eleSubtotalRaw = row.querySelector('.table-row-subtotal-raw');
        if (eleSubtotal) {
            eleSubtotal.value = subtotal;
            eleSubtotalRaw.value = subtotal;
            init_mask_money_ele($(eleSubtotal));
        }
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

    deleteRow(currentRow, tableBody, table) {
        let self = this;
        table.DataTable().row(currentRow).remove().draw();
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

}

class submitHandle {
    setupDataProduct() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-product');
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let eleProduct = row.querySelector('.table-row-item');
            if (eleProduct) {
                let optionSelected = eleProduct.options[eleProduct.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
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
                rowData['product_quantity'] = parseInt(eleQuantity.value);
            }
            let elePrice = row.querySelector('.table-row-price');
            if (elePrice) {
                rowData['product_unit_price'] = $(elePrice).valCurrency();
            }
            let eleDiscount = row.querySelector('.table-row-discount');
            if (eleDiscount) {
                if (eleDiscount.value || eleDiscount.value === "0") {
                    rowData['product_discount_value'] = parseInt(eleDiscount.value);
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
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                rowData['order'] = parseInt(eleOrder.innerHTML);
            }
            result.push(rowData);
        }
        return result
    }

    setupDataCost() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-cost');
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let eleProduct = row.querySelector('.table-row-item');
            if (eleProduct) {
                let optionSelected = eleProduct.options[eleProduct.selectedIndex];
                if (optionSelected) {
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
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
                rowData['product_quantity'] = parseInt(eleQuantity.value);
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
        return result
    }

    setupDataExpense() {
        let result = [];
        let table = document.getElementById('datable-quotation-create-expense');
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
                rowData['expense_quantity'] = parseInt(eleQuantity.value);
            }
            let elePrice = row.querySelector('.table-row-price');
            if (elePrice) {
                rowData['expense_price'] = $(elePrice).valCurrency();
            }
            let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
            if (eleSubtotal) {
                rowData['expense_subtotal_price'] = parseFloat(eleSubtotal.value)
            }
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                rowData['order'] = parseInt(eleOrder.innerHTML);
            }
            result.push(rowData);
        }
        return result
    }

    setupDataLogistic() {
        return {
            'shipping_address': $('#quotation-create-shipping-address').val(),
            'billing_address': $('#quotation-create-billing-address').val(),
        }
    }

    setupDataSubmit(_form) {
        let self = this;
        let dateCreatedVal = $('#quotation-create-date-created').val();
        if (dateCreatedVal) {
            _form.dataForm['data_created'] = moment(dateCreatedVal).format('YYYY-MM-DD HH:mm:ss')
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

        _form.dataForm['quotation_products_data'] = self.setupDataProduct();
        _form.dataForm['quotation_costs_data'] = self.setupDataCost();
        _form.dataForm['quotation_expenses_data'] = self.setupDataExpense();

        _form.dataForm['quotation_logistic_data'] = self.setupDataLogistic();
    }
}

function init_company_currency_config() {
    $.fn.getCompanyCurrencyConfig().then((currencyConfig) => {
        if (currencyConfig) {
            $('#data-init-quotation-create-company-currency-config').val(JSON.stringify(currencyConfig))
        } else throw  Error('Currency config is not found.')
    });
}

function init_mask_money_single(ele) {
    let currencyConfig = JSON.parse($('#data-init-quotation-create-company-currency-config').val());
    if (currencyConfig) {
        ele.find('.mask-money').initInputCurrency(currencyConfig['currency_rule']);
        ele.find('.mask-money-value').parseCurrencyDisplay(currencyConfig['currency_rule']);
    } else throw  Error('Currency config is not found.')
}

function init_mask_money_ele(ele) {
    let currencyConfig = JSON.parse($('#data-init-quotation-create-company-currency-config').val());
    if (currencyConfig) {
        ele.initInputCurrency(currencyConfig['currency_rule']);
        ele.parseCurrencyDisplay(currencyConfig['currency_rule']);
    } else throw  Error('Currency config is not found.')
}

