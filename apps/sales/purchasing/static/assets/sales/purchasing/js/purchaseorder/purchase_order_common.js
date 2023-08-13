let finalRevenueBeforeTax = document.getElementById('purchase-order-final-revenue-before-tax');

// LoadData
class loadDataHandle {
    loadMoreInformation(ele, is_span = false) {
        let optionSelected = null;
        if (is_span === false) {
            optionSelected = ele[0].options[ele[0].selectedIndex];
        } else {
            optionSelected = ele[0]
        }
        let eleInfo = ele[0].closest('.more-information-group').querySelector('.more-information');
        let dropdownContent = ele[0].closest('.more-information-group').querySelector('.dropdown-menu');
        dropdownContent.innerHTML = ``;
        eleInfo.setAttribute('disabled', true);
        let link = "";
        if (optionSelected) {
            let eleData = optionSelected.querySelector('.data-info');
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
                    if (['id', 'title', 'name', 'fullname', 'code'].includes(key)) {
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
                            <span><span>${$.fn.transEle.attr('data-view-detail-info')}</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                        </a>
                    </div>`;
                dropdownContent.innerHTML = info;
            }
        }
    };

    loadBoxSupplier(valueToSelect = null) {
        let self = this;
        let ele = $('#box-purchase-order-supplier');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (ele[0].options.length <= 1 || valueToSelect) {
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('account_sale_list') && Array.isArray(data.account_sale_list)) {
                            ele[0].classList.remove('select2');
                            ele.empty();
                            let dataAppend = ``;
                            let dataMapOpp = ``;
                            data.account_sale_list.map(function (item) {
                                let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                                dataAppend += `<option value="${item.id}">
                                                <span class="account-title">${item.name}</span>
                                                <input type="hidden" class="data-info" value="${dataStr}">
                                            </option>`;
                                if (item.id === valueToSelect) {
                                    dataMapOpp = `<option value="${item.id}" selected>
                                                    <span class="account-title">${item.name}</span>
                                                    <input type="hidden" class="data-info" value="${dataStr}">
                                                </option>`;
                                    // load Contact by Supplier
                                    if (item.id && item.owner) {
                                        self.loadBoxContact(item.owner.id, item.id);
                                    }
                                }
                            })
                            ele.append(`<option value=""></option>`);
                            if (dataMapOpp) { // if Purchase quotation has Supplier
                                ele.append(dataMapOpp);
                            } else { // if Purchase quotation doesn't have Supplier
                                if (!valueToSelect) {
                                    ele.append(dataAppend);
                                }
                                // load Contact no Customer
                                self.loadBoxContact();
                            }
                            self.loadMoreInformation(ele);
                            ele[0].classList.add('select2');
                            $(ele).initSelect2();
                        }
                    }
                }
            )
        }
    };

    loadBoxContact(valueToSelect = null, supplierID = null) {
        let self = this;
        let ele = $('#box-purchase-order-contact');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (supplierID) {
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'data': {'account_name_id': supplierID},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('contact_list') && Array.isArray(data.contact_list)) {
                            ele[0].classList.remove('select2');
                            ele.empty();
                            ele.append(`<option value=""></option>`);
                            data.contact_list.map(function (item) {
                                let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                                let dataAppend = `<option value="${item.id}">
                                                    <span class="contact-title">${item.fullname}</span>
                                                    <input type="hidden" class="data-info" value="${dataStr}">
                                                </option>`;
                                if (item.id === valueToSelect) {
                                    dataAppend = `<option value="${item.id}" selected>
                                                    <span class="contact-title">${item.fullname}</span>
                                                    <input type="hidden" class="data-info" value="${dataStr}">
                                                </option>`;
                                    ele.append(dataAppend);
                                }
                            })
                            self.loadMoreInformation(ele);
                            ele[0].classList.add('select2');
                            $(ele).initSelect2();
                        }
                    }
                }
            )
        } else {
            ele.empty();
            ele.append(`<option value=""></option>`);
        }
    };

    loadInitProduct() {
        let ele = $('#data-init-product');
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
    };

    loadInitUOM() {
        let ele = $('#data-init-uom');
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
                    if (data.hasOwnProperty('unit_of_measure') && Array.isArray(data.unit_of_measure)) {
                        ele.val(JSON.stringify(data.unit_of_measure))
                    }
                }
            }
        )
    };

    loadInitTax() {
        let ele = $('#data-init-tax');
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
                    if (data.hasOwnProperty('tax_list') && Array.isArray(data.tax_list)) {
                        ele.val(JSON.stringify(data.tax_list))
                    }
                }
            }
        )
    };

    loadBoxProduct(eleBox, valueToSelect = null) {
        let self = this;
        let ele = document.getElementById('data-init-product');
        if (ele && eleBox) {
            let linkDetail = ele.getAttribute('data-link-detail');
            eleBox.attr('data-link-detail', linkDetail);
            let data = JSON.parse(ele.value);
            eleBox[0].classList.remove('select2');
            eleBox.empty();
            eleBox.append(`<option value=""></option>`);
            for (let i = 0; i < data.length; i++) {
                let uom_title = "";
                let default_uom = {};
                let uom_group = {};
                let tax_code = {};
                if (Object.keys(data[i].sale_information).length !== 0) {
                    if (Object.keys(data[i].sale_information.default_uom).length !== 0) {
                        uom_title = data[i].sale_information.default_uom.title
                    }
                    default_uom = data[i].sale_information.default_uom;
                    tax_code = data[i].sale_information.tax_code;
                }
                if (Object.keys(data[i].general_information).length !== 0) {
                    uom_group = data[i].general_information.uom_group;
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
                    'uom_group': uom_group,
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
            self.loadMoreInformation(eleBox);
            eleBox[0].classList.add('select2');
            $(eleBox).initSelect2();
        }
    };

    loadDataProductSelect(ele, is_change_item = true) {
        let self = this;
        let optionSelected = ele[0].options[ele[0].selectedIndex];
        let productData = optionSelected.querySelector('.data-default');
        if (productData) {
            let data = JSON.parse(productData.value);
            let uom = ele[0].closest('tr').querySelector('.table-row-uom-order');
            let price = ele[0].closest('tr').querySelector('.table-row-price');
            let priceList = ele[0].closest('tr').querySelector('.table-row-price-list');
            let tax = ele[0].closest('tr').querySelector('.table-row-tax');
            // load UOM
            if (uom && Object.keys(data.unit_of_measure).length !== 0 && Object.keys(data.uom_group).length !== 0) {
                self.loadBoxUOM(uom.id, data.unit_of_measure.id, data.uom_group.id);
            } else {
                self.loadBoxUOM(uom.id);
            }
            // load PRICE
            if (price && priceList) {
                self.loadPriceProduct(ele[0], is_change_item);
            }
            // load TAX
            if (tax && data.tax) {
                self.loadBoxTax(tax.id, data.tax.id);
            } else {
                self.loadBoxTax(tax.id);
            }
            // load modal more information
            self.loadMoreInformation(ele);
        }
        $.fn.initMaskMoney2();
    };

    loadPriceProduct(eleProduct, is_change_item = true) {
        let optionSelected = eleProduct.options[eleProduct.selectedIndex];
        let productData = optionSelected.querySelector('.data-default');
        let is_change_price = false;
        if (productData) {
            let data = JSON.parse(productData.value);
            let price = eleProduct.closest('tr').querySelector('.table-row-price');
            let priceList = eleProduct.closest('tr').querySelector('.table-row-price-list');
            // load PRICE
            if (price && priceList) {
                let account_price_id = document.getElementById('customer-price-list').value;
                let general_price_id = null;
                let general_price = 0;
                let customer_price = null;
                let current_price_checked = price.getAttribute('value');
                $(priceList).empty();
                if (Array.isArray(data.price_list) && data.price_list.length > 0) {
                    for (let i = 0; i < data.price_list.length; i++) {
                        if (data.price_list[i].price_type === 1) { // PRICE TYPE IS PRODUCT (PURCHASE)
                            if (data.price_list[i].is_default === true) { // check & append GENERAL_PRICE_LIST
                                general_price_id = data.price_list[i].id;
                                general_price = parseFloat(data.price_list[i].value);
                                $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                                    <div class="row">
                                                        <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                        <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                        <div class="col-2"><span class="valid-price">${data.price_list[i].price_status}</span></div>
                                                    </div>
                                                </button>`);
                            }
                            if (data.price_list[i].id === account_price_id && general_price_id !== account_price_id) { // check & append CUSTOMER_PRICE_LIST
                                if (!["Expired", "Invalid"].includes(data.price_list[i].price_status)) { // Customer price valid
                                    customer_price = parseFloat(data.price_list[i].value);
                                    $(priceList).empty();
                                    $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option option-btn-checked" data-value="${parseFloat(data.price_list[i].value)}">
                                                        <div class="row">
                                                            <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                            <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                            <div class="col-2"><span class="valid-price">${data.price_list[i].price_status}</span></div>
                                                        </div>
                                                    </button>`);
                                } else { // Customer price invalid, expired
                                    $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option option-btn-checked" data-value="${parseFloat(data.price_list[i].value)}" disabled>
                                                        <div class="row">
                                                            <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                            <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                            <div class="col-2"><span class="expired-price">${data.price_list[i].price_status}</span></div>
                                                        </div>
                                                    </button>`);
                                }
                            }
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

    loadBoxUOM(eleBox, valueToSelect = null, uom_group = null) {
        let ele = document.getElementById('data-init-uom');
        if (ele && eleBox) {
            let data = JSON.parse(ele.value);
            eleBox[0].classList.remove('select2');
            eleBox.empty();
            eleBox.append(`<option value=""></option>`);
            for (let i = 0; i < data.length; i++) {
                // check uom_group with product
                // if (data[i].group.id === uom_group) {
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
                        option = `<option value="${data[i].id}" selected>
                                    <span class="uom-title">${data[i].title}</span>
                                    <input type="hidden" class="data-info" value="${dataStr}">
                                </option>`
                    }
                eleBox.append(option);
                eleBox[0].classList.add('select2');
                $(eleBox).initSelect2();
                // }
            }
        }
    };

    loadBoxTax(eleBox, valueToSelect = null) {
        let ele = document.getElementById('data-init-tax');
        if (ele && eleBox) {
            let data = JSON.parse(ele.value);
            eleBox[0].classList.remove('select2');
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
                eleBox.append(option);
                eleBox[0].classList.add('select2');
                $(eleBox).initSelect2();
            }
        }
    };

    loadModalPurchaseRequestTable(is_clear_all = false) {
        let tablePurchaseRequest = $('#datable-purchase-request');
        if (is_clear_all === false) {
            if (tablePurchaseRequest[0].querySelector('.dataTables_empty')) {
                tablePurchaseRequest.DataTable().clear().destroy();
                dataTableClass.dataTablePurchaseRequest();
            }
        } else {
            tablePurchaseRequest.DataTable().clear().destroy();
            dataTableClass.dataTablePurchaseRequest();
        }
        return true;
    };

    loadModalPurchaseRequestProductTable(is_clear_all = false, is_click = false) {
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        let frm = new SetupFormSubmit(tablePurchaseRequestProduct);
        let request_id_list = [];
        let checked_data = {};
        for (let eleChecked of tablePurchaseRequest[0].querySelectorAll('.table-row-checkbox:checked')) {
            request_id_list.push(eleChecked.id);
        }
        if (!tablePurchaseRequestProduct[0].querySelector('.dataTables_empty') && is_clear_all === false) {
            for (let eleChecked of tablePurchaseRequestProduct[0].querySelectorAll('.table-row-checkbox:checked')) {
                checked_data[eleChecked.id] = {
                    'id': eleChecked.id,
                    'quantity_order': eleChecked.closest('tr').querySelector('.table-row-quantity-order').value,
                };
            }
            for (let eleChecked of tablePurchaseRequestProduct[0].querySelectorAll('.disabled-by-pq')) {
                checked_data[eleChecked.id] = {
                    'id': eleChecked.id,
                    'quantity_order': eleChecked.closest('tr').querySelector('.table-row-quantity-order').value,
                };
            }
        }
        tablePurchaseRequestProduct.DataTable().clear().destroy();
        dataTableClass.dataTablePurchaseRequestProduct();
        if (request_id_list.length > 0) {
            $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    'data': {'purchase_request_id__in': request_id_list.join(',')},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('purchase_request_product_list') && Array.isArray(data.purchase_request_product_list)) {
                            if (Object.keys(checked_data).length !== 0) {
                                for (let prProduct of data.purchase_request_product_list) {
                                    if (checked_data.hasOwnProperty(prProduct.id)) {
                                        prProduct['is_checked'] = true;
                                        prProduct['quantity_order'] = checked_data[prProduct.id].quantity_order;
                                    }
                                }
                            }
                            tablePurchaseRequestProduct.DataTable().clear().destroy();
                            dataTableClass.dataTablePurchaseRequestProduct();
                            tablePurchaseRequestProduct.DataTable().rows.add(data.purchase_request_product_list).draw();
                            if (is_click === true) {
                                $('#btn-confirm-add-purchase-request').click();
                            }
                        }
                    }
                }
            )
        }
        return true;
    };

    loadOrHiddenMergeProductTable() {
        let self = this;
        let eleCheckbox = $('#merge-same-product');
        if (eleCheckbox[0].checked === true) {
            $('#sroll-datable-purchase-request-product')[0].setAttribute('hidden', 'true');
            $('#sroll-datable-purchase-request-product-merge')[0].removeAttribute('hidden');
            self.loadDataMergeProductTable();
        } else {
            $('#sroll-datable-purchase-request-product-merge')[0].setAttribute('hidden', 'true');
            $('#sroll-datable-purchase-request-product')[0].removeAttribute('hidden');
        }
        return true;
    };

    loadDataMergeProductTable() {
        $('#datable-purchase-request-product-merge').DataTable().destroy();
        let data = setupMergeProduct();
        dataTableClass.dataTablePurchaseRequestProductMerge(data);
        return true;
    };

    loadDataShowPurchaseRequest() {
        let self = this;
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        let tablePurchaseRequest = $('#datable-purchase-request');
        let purchase_requests_data = [];
        if (!tablePurchaseRequest[0].querySelector('.dataTables_empty')) {
            let eleAppend = ``;
            let is_checked = false;
            for (let eleChecked of tablePurchaseRequest[0].querySelectorAll('.table-row-checkbox:checked')) {
                is_checked = true;
                let prID = eleChecked.id;
                let prCode = eleChecked.closest('tr').querySelector('.table-row-code').innerHTML;
                let link = "";
                eleAppend += `<div class="inline-elements-badge mr-2 mb-1" id="${prID}">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span>${prCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" id="${prID}" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                purchase_requests_data.push(prID);
            }
            if (is_checked === true) {
                elePurchaseRequest.empty();
                elePurchaseRequest.append(eleAppend);
                self.loadTableProductByPurchaseRequest();
            } else {
                elePurchaseRequest.empty();
                self.loadTableProductByPurchaseRequest();
            }
        }
        $('#purchase_requests_data').val(JSON.stringify(purchase_requests_data));
        return true;
    };

    loadModalPurchaseQuotation(is_clear_all = false, is_click = false) {
        let tablePurchaseQuotation = $('#datable-purchase-quotation');
        let checked_list = [];
        if (!tablePurchaseQuotation[0].querySelector('.dataTables_empty') && is_clear_all === false) {
            for (let eleChecked of tablePurchaseQuotation[0].querySelectorAll('.table-row-checkbox:checked')) {
                checked_list.push(eleChecked.id);
            }
        }
        let frm = new SetupFormSubmit(tablePurchaseQuotation);
        let purchase_requests_data = $('#purchase_requests_data');
        if (purchase_requests_data.val()) {
            let purchase_requests_data_parse = JSON.parse(purchase_requests_data.val());
            if (JSON.parse(purchase_requests_data.val()).length > 0) {
                $.fn.callAjax2({
                        'url': frm.dataUrl,
                        'method': frm.dataMethod,
                        'data': {'purchase_quotation_request_mapped__purchase_request_mapped__id__in': purchase_requests_data_parse.join(',')},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('purchase_quotation_list') && Array.isArray(data.purchase_quotation_list)) {
                                if (checked_list.length > 0) {
                                    for (let PQ of data.purchase_quotation_list) {
                                        if (checked_list.includes(PQ.id)) {
                                            PQ['is_checked'] = true;
                                        }
                                    }
                                }
                                tablePurchaseQuotation.DataTable().clear().destroy();
                                dataTableClass.dataTablePurchaseQuotation();
                                tablePurchaseQuotation.DataTable().rows.add(data.purchase_quotation_list).draw();
                                if (is_click === true) {
                                    $('#btn-confirm-add-purchase-quotation').click();
                                }
                            }
                        }
                    }
                )
            } else {
                if (is_clear_all === true) {
                    tablePurchaseQuotation.DataTable().clear().destroy();
                    dataTableClass.dataTablePurchaseQuotation();
                }
            }
        }
        return true;
    };

    loadDataShowPurchaseQuotation() {
        let self = this;
        let elePurchaseQuotation = $('#purchase-order-purchase-quotation');
        let tablePurchaseQuotation = $('#datable-purchase-quotation');
        let purchase_quotations_data = [];
        let purchase_quotations_id_list = [];
        let eleAppend = ``;
        let is_check = false;
        let checked_id = null;
        if (elePurchaseQuotation[0].innerHTML) {
            for (let eleChecked of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation:checked')) {
                checked_id = eleChecked.id;
            }
        }
        for (let eleChecked of tablePurchaseQuotation[0].querySelectorAll('.table-row-checkbox:checked')) {
            is_check = true;
            let pqID = eleChecked.id;
            let pqCode = eleChecked.closest('tr').querySelector('.table-row-code').innerHTML;
            let pqSupplierID = eleChecked.closest('tr').querySelector('.table-row-supplier').id;
            let link = "";
            eleAppend += `<div class="inline-elements-badge mr-2 mb-1" id="${pqID}">
                                    <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" id="${pqID}" data-supplier-id="${pqSupplierID}" value="option1">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover ml-3"><span>${pqCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" id="${pqID}" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
            purchase_quotations_data.push({
                'purchase_quotation': pqID,
                'is_use': false
            })
            purchase_quotations_id_list.push(pqID);
        }
        $('#box-purchase-order-supplier').empty();
        $('#box-purchase-order-contact').empty();
        if (is_check === true) {
            elePurchaseQuotation.empty();
            elePurchaseQuotation.append(eleAppend);
        } else {
            elePurchaseQuotation.empty();
        }
        $('#purchase_quotations_data').val(JSON.stringify(purchase_quotations_data));

        if (elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
            if (checked_id) {
                for (let eleCheck of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                    if (eleCheck.id === checked_id) {
                        eleCheck.checked = true;
                    }
                }
            }
            self.loadPriceListByPurchaseQuotation(purchase_quotations_id_list, checked_id);
        }
        return true;
    };

    loadDataAfterClickRemove(table, removeIDList, code) {
        let self = this;
        for (let eleChecked of table[0].querySelectorAll('.table-row-checkbox:checked')) {
            if (removeIDList.includes(eleChecked.id)) {
                eleChecked.checked = false;
            }
        }
        if (code === "purchase_request") {
            self.loadDataWhenClearPR(false);
        } else if ("purchase_quotation") {
            self.loadDataWhenClearPQ();
        }
        return true
    };

    loadTableProductByPurchaseRequest() {
        let self = this;
        let tablePurchaseOrderProductRequest = $('#datable-purchase-order-product-request');
        let tablePurchaseOrderProductAdd = $('#datable-purchase-order-product-add');
        if (tablePurchaseOrderProductRequest[0].hasAttribute('hidden')) {
            tablePurchaseOrderProductAdd.DataTable().clear().destroy();
            tablePurchaseOrderProductAdd[0].setAttribute('hidden', 'true');
            tablePurchaseOrderProductRequest[0].removeAttribute('hidden');
        }
        let data = setupMergeProduct();
        if (data.length > 0) {
            tablePurchaseOrderProductRequest.DataTable().clear().destroy();
            dataTableClass.dataTablePurchaseOrderProductRequest();
            tablePurchaseOrderProductRequest.DataTable().rows.add(data).draw();
            self.loadDataRowTable(tablePurchaseOrderProductRequest);
        } else {
            tablePurchaseOrderProductRequest.DataTable().clear().destroy();
            dataTableClass.dataTablePurchaseOrderProductRequest();
        }
        return true;
    };

    loadTableProductNoPurchaseRequest() {
        let self = this;
        self.loadDataWhenClearPR(true);
        let tablePurchaseOrderProductRequest = $('#datable-purchase-order-product-request');
        let tablePurchaseOrderProductAdd = $('#datable-purchase-order-product-add');
        let order = 1;
        let tableEmpty = tablePurchaseOrderProductAdd[0].querySelector('.dataTables_empty');
        let tableLen = tablePurchaseOrderProductAdd[0].tBodies[0].rows.length;
        if (tableLen !== 0 && !tableEmpty) {
            order = (tableLen + 1);
        }
        let data = {
            'product': {},
            'uom_order_request': {},
            'uom_order_actual': {},
            'tax': {},
            'stock': 0,
            'product_title': '',
            'product_description': '',
            'product_quantity_order_request': 0,
            'product_quantity_order_actual': 0,
            'remain': 0,
            'product_unit_price': 0,
            'product_tax_title': '',
            'product_tax_amount': 0,
            'product_subtotal_price': 0,
            'order': order,
        }
        if (tablePurchaseOrderProductAdd[0].hasAttribute('hidden')) {
            tablePurchaseOrderProductRequest.DataTable().clear().destroy();
            tablePurchaseOrderProductRequest[0].setAttribute('hidden', 'true');
            tablePurchaseOrderProductAdd[0].removeAttribute('hidden');
            dataTableClass.dataTablePurchaseOrderProductAdd();
        }
        let newRow = tablePurchaseOrderProductAdd.DataTable().row.add(data).draw().node();
        self.loadDataRow(newRow, 'datable-purchase-order-product-add');
        return true;
    };

    loadDataRowTable($table) {
        let self = this;
        // callBack Row to load data for select box
        for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
            let row = $table[0].tBodies[0].rows[i];
            let table_id = $table[0].id;
            self.loadDataRow(row, table_id);
        }
    };

    loadDataRow(row, table_id) {
        let self = this;
        // mask money
        $.fn.initMaskMoney2();
        if (table_id === 'datable-purchase-order-product-add') {
            self.loadBoxProduct($(row.querySelector('.table-row-item')));
            self.loadBoxUOM($(row.querySelector('.table-row-uom-order-actual')));
        } else if (table_id === 'datable-purchase-order-product-request') {
            self.loadMoreInformation($(row.querySelector('.table-row-item')), true);
            self.loadBoxUOM($(row.querySelector('.table-row-uom-order-actual')), row.querySelector('.table-row-uom-order-request').id);
        }
        self.loadBoxTax($(row.querySelector('.table-row-tax')));
    };

    loadPriceListByPurchaseQuotation(purchase_quotations_id_list, checked_id = null) {
        let eleQuotationProduct = $('#data-purchase-quotation-products');
        if (purchase_quotations_id_list.length > 0) {
            $.fn.callAjax2({
                    'url': eleQuotationProduct.attr('data-url'),
                    'method': eleQuotationProduct.attr('data-method'),
                    'data': {'purchase_quotation_id__in': purchase_quotations_id_list.join(',')},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('purchase_quotation_product_list') && Array.isArray(data.purchase_quotation_product_list)) {
                            let dataProduct = {};
                            let dataPQMapProducts = {};
                            for (let result of data.purchase_quotation_product_list) {
                                // setup data to load price list
                                if (!dataProduct.hasOwnProperty(result.product_id)) {
                                    dataProduct[result.product_id] = [{
                                        'purchase_quotation': result.purchase_quotation,
                                        'unit_price': result.unit_price
                                    }]
                                } else {
                                    dataProduct[result.product_id].push({
                                        'purchase_quotation': result.purchase_quotation,
                                        'unit_price': result.unit_price
                                    })
                                }
                                // setup data to load again product by check PQ
                                if (!dataPQMapProducts.hasOwnProperty(result.purchase_quotation.id)) {
                                    dataPQMapProducts[result.purchase_quotation.id] = [result.product_id];
                                } else {
                                    dataPQMapProducts[result.purchase_quotation.id].push(result.product_id);
                                }
                            }
                            eleQuotationProduct.val(JSON.stringify(dataPQMapProducts));
                            let $table = $('#datable-purchase-order-product-request');
                            $table.DataTable().rows().every(function () {
                                let row = this.node();
                                let priceListData = dataProduct[row.querySelector('.table-row-item').id];
                                let elePrice = row.querySelector('.table-row-price');
                                let elePriceShow = row.querySelector('.table-row-price-show');
                                let elePriceList = row.querySelector('.table-row-price-list');
                                if (priceListData) {
                                    row.querySelector('.table-row-price-show-area').removeAttribute('hidden');
                                    elePrice.setAttribute('hidden', 'true');
                                    $(elePrice).attr('value', String(0));
                                    $(elePriceShow).attr('data-init-money', String(0));
                                    if (elePriceList) {
                                        $(elePriceList).empty();
                                        for (let price of priceListData) {
                                            let priceAppend = `<div class="dropdown-item disabled text-black border border-grey mb-1" id="${price.purchase_quotation.id}" data-value="${parseFloat(price.unit_price)}">
                                                                    <div class="row">
                                                                        <div class="col-7"><span>${price.purchase_quotation.title}</span></div>
                                                                        <div class="col-5"><span
                                                                            class="mask-money" data-init-money="${parseFloat(price.unit_price)}"
                                                                        ></span></div>
                                                                    </div>
                                                                </div>`
                                            if (price.purchase_quotation.id === checked_id) {
                                                priceAppend = `<div class="dropdown-item disabled text-black border border-grey mb-1 bg-light" id="${price.purchase_quotation.id}" data-value="${parseFloat(price.unit_price)}">
                                                                    <div class="row">
                                                                        <div class="col-7"><span>${price.purchase_quotation.title}</span></div>
                                                                        <div class="col-5"><span
                                                                            class="mask-money" data-init-money="${parseFloat(price.unit_price)}"
                                                                        ></span></div>
                                                                    </div>
                                                                </div>`;
                                                $(elePrice).attr('value', String(parseFloat(price.unit_price)));
                                                $(elePriceShow).attr('data-init-money', String(parseFloat(price.unit_price)));

                                            }
                                            $(elePriceList).append(priceAppend);
                                        }
                                        $.fn.initMaskMoney2();
                                        calculateClass.calculateMain($table, row);
                                    }
                                }
                            });
                            // mask money
                            $.fn.initMaskMoney2();
                        }
                    }
                }
            )
        }
        return true
    };

    loadCheckProductsByCheckedQuotation(ele) {
        let self = this;
        if (ele.checked === true) {
            let eleDataPQProducts = $('#data-purchase-quotation-products');
            if (eleDataPQProducts.val()) {
                let dataPQMapProductsList = JSON.parse(eleDataPQProducts.val());
                let dataPQMapProducts = dataPQMapProductsList[ele.id];
                let tablePRProduct = $('#datable-purchase-request-product');
                for (let eleChecked of tablePRProduct[0].querySelectorAll('.table-row-checkbox:checked')) {
                    let row = eleChecked.closest('tr');
                    let productID = row.querySelector('.table-row-item').id;
                    if (!dataPQMapProducts.includes(productID)) {
                        eleChecked.checked = false;
                        eleChecked.classList.add('disabled-by-pq');
                        eleChecked.setAttribute('disabled', 'true');
                        row.querySelector('.table-row-quantity-order').setAttribute('disabled', 'true');
                        $(row).css('background-color', '#f7f7f7');
                        row.setAttribute('data-bs-toggle', 'tooltip');
                        row.setAttribute('data-bs-placement', 'top');
                        row.setAttribute('title', 'This product is not in purchase quotation');
                    }
                }
                $('#btn-confirm-add-purchase-request').click();
                $('#btn-confirm-add-purchase-quotation').click();
            }
        } else {
            self.loadModalPurchaseRequestProductTable(false, true)
        }
    };

    loadSupplierContactByCheckedQuotation(ele) {
        let self = this;
        let checked_id = ele.id;
        let supplierID = ele.getAttribute('data-supplier-id');
        for (let purchase_quotation of JSON.parse($('#purchase_quotations_data').val())) {
            purchase_quotation.is_use = (purchase_quotation.purchase_quotation === checked_id);
        }
        // load supplier by Purchase Quotation
        self.loadBoxSupplier(supplierID);
        return true
    };

    loadDataWhenClearPR(is_clear_all = false) {
        let self = this;
        // Load again data & events relate with Purchase Request
        $('#purchase-order-purchase-request').empty();
        self.loadModalPurchaseRequestTable(is_clear_all);
        $('#table-purchase-reqeust-checkbox-all')[0].checked = false;
        self.loadModalPurchaseRequestProductTable(is_clear_all, true);
        // Load again data & events relate with Purchase Quotation
        $('#purchase-order-purchase-quotation').empty();
        self.loadModalPurchaseQuotation(is_clear_all, true);
        $('#box-purchase-order-supplier').empty();
        $('#box-purchase-order-contact').empty();
        // ReCalculate Totals
        let table = $('#datable-purchase-order-product-request');
        if (table[0].querySelector('.dataTables_empty')) {
            let elePretaxAmount = document.getElementById('purchase-order-product-pretax-amount');
            let eleTaxes = document.getElementById('purchase-order-product-taxes');
            let eleTotal = document.getElementById('purchase-order-product-total');
            let elePretaxAmountRaw = document.getElementById('purchase-order-product-pretax-amount-raw');
            let eleTaxesRaw = document.getElementById('purchase-order-product-taxes-raw');
            let eleTotalRaw = document.getElementById('purchase-order-product-total-raw');
            let finalRevenueBeforeTax = document.getElementById('purchase-order-final-revenue-before-tax');
            $(elePretaxAmount).attr('data-init-money', String(0));
            elePretaxAmountRaw.value = '0';
            finalRevenueBeforeTax.value = '0';
            $(eleTaxes).attr('data-init-money', String(0));
            eleTaxesRaw.value = '0';
            $(eleTotal).attr('data-init-money', String(0));
            eleTotalRaw.value = '0';
        } else {
            calculateClass.calculateTable(table);
        }
        return true
    };

    loadDataWhenClearPQ() {
        let self = this;
        // Load again data & events relate with Purchase Request
        self.loadModalPurchaseRequestProductTable(false, true);
        // Load again data & events relate with Purchase Quotation
        $('#purchase-order-purchase-quotation').empty();
        self.loadModalPurchaseQuotation(false, true);
        $('#box-purchase-order-supplier').empty();
        $('#box-purchase-order-contact').empty();
        return true
    };
}

// DataTable
class dataTableHandle {
    dataTablePurchaseRequest() {
        let $table = $('#datable-purchase-request');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('purchase_request_list')) {
                        return resp.data['purchase_request_list'] ? resp.data['purchase_request_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}"></div>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.code}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    dataTablePurchaseRequestProduct(data) {
        let $table = $('#datable-purchase-request-product');
        $table.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
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
                        let purchase_request_id = "";
                        if (Object.keys(row.purchase_request).length !== 0) {
                            purchase_request_id = row.purchase_request.id;
                        }
                        if (!row.hasOwnProperty('is_checked')) {
                            return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        id="${row.id}" 
                                        data-purchase-request-id="${purchase_request_id}"
                                        data-sale-order-product-id="${row.sale_order_product_id}"
                                    >
                                </div>`
                        } else {
                            return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        id="${row.id}" 
                                        data-purchase-request-id="${purchase_request_id}"
                                        data-sale-order-product-id="${row.sale_order_product_id}"
                                        checked
                                    >
                                </div>`
                        }

                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-item" id="${row.product.id}">${row.product.title}</span>`
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.purchase_request.code}</span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom-request" id="${row.uom.id}">${row.uom.title}</span>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-request">${row.quantity}</span>`
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-remain">${row.remain_for_purchase_order}</span>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        if (row.hasOwnProperty('quantity_order')) {
                            return `<input type="text" class="form-control table-row-quantity-order" value="${row.quantity_order}">`;
                        } else {
                            return `<input type="text" class="form-control table-row-quantity-order" value="0">`;
                        }
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    dataTablePurchaseRequestProductMerge(data) {
        let $table = $('#datable-purchase-request-product-merge');
        $table.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}" checked disabled></div>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.product_title}</span>`
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let codeList = ``;
                        for (let item of row.code_list) {
                            codeList += `<span class="dropdown-item">${item}</span>`
                        }
                        return `<button
                                    type="button"
                                    class="btn btn-link"
                                    aria-expanded="false"
                                    data-bs-toggle="dropdown"
                                ><i class="fas fa-ellipsis-h"></i></button>
                                <div role="menu" class="dropdown-menu">
                                    ${codeList}
                                </div>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom-request">${row.uom_order_request.title}</span>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-request">${row.product_quantity_request}</span>`
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-remain">${row.remain}</span>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-order">${row.product_quantity_order_actual}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    dataTablePurchaseQuotation(data) {
        let $table = $('#datable-purchase-quotation');
        $table.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        if (!row.hasOwnProperty('is_checked')) {
                            return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}"></div>`;
                        } else {
                            return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}" checked></div>`;
                        }
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.code}</span>`
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-supplier" id="${row.supplier_mapped.id}">${row.supplier_mapped.name}</span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-purchase-quotation-request">${row.purchase_quotation_request_mapped.code}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    dataTablePurchaseOrderProductRequest(data) {
        let $table = $('#datable-purchase-order-product-request');
        $table.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [
                {
                    "width": "1%",
                    "targets": 0
                }, {
                    "width": "20%",
                    "targets": 1
                }, {
                    "width": "10%",
                    "targets": 2
                }, {
                    "width": "5%",
                    "targets": 3
                }, {
                    "width": "5%",
                    "targets": 4
                }, {
                    "width": "5%",
                    "targets": 5,
                },
                {
                    "width": "10%",
                    "targets": 6,
                },
                {
                    "width": "2%",
                    "targets": 7,
                },
                {
                    "width": "15%",
                    "targets": 8,
                },
                {
                    "width": "10%",
                    "targets": 9,
                },
                {
                    "width": "15%",
                    "targets": 10,
                }
            ],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<span class="table-row-order" id="${row.id}">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let dataStr = JSON.stringify(row.product).replace(/"/g, "&quot;");
                        let purchase_request_product_datas = JSON.stringify(row.purchase_request_product_datas).replace(/"/g, "&quot;");
                        return `<div class="row more-information-group">
                                <div class="col-3">
                                    <div class="btn-group dropstart">
                                        <i
                                            class="fas fa-info-circle more-information"
                                            data-bs-toggle="dropdown"
                                            data-dropdown-animation
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            disabled
                                        >
                                        </i>
                                        <div class="dropdown-menu w-210p mt-4"></div>
                                    </div>
                                </div>
                                <div class="col-9" style="margin-left: -20px">
                                    <span class="table-row-item" id="${row.product.id}" data-purchase-request-product-datas="${purchase_request_product_datas}">${row.product_title}<input type="hidden" class="data-info" value="${dataStr}"></span>
                                </div>
                            </div>`
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-description">${row.product_description}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let dataStr = JSON.stringify(row.uom_order_request).replace(/"/g, "&quot;");
                        return `<span class="table-row-uom-order-request" id="${row.uom_order_request.id}">${row.uom_order_request.title}<input type="hidden" class="data-info" value="${dataStr}"></span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-order-request">${row.product_quantity_order_request}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-stock">${row.stock}</span>`
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <select class="form-control select2 table-row-uom-order-actual" required>
                                        <option value="${row.uom_order_actual.id}" selected>${row.uom_order_actual.title}</option>
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-quantity-order-actual validated-number" value="${row.product_quantity_order_actual}" required>
                                </div>`;
                    }
                },
                {
                    targets: 8,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <div class="row table-row-price-show-area inline-elements" hidden>
                                        <span class="mask-money mr-4 table-row-price-show" data-init-money="${parseFloat(row.product_unit_price)}"></span>
                                        <button 
                                            aria-expanded="false"
                                            data-bs-toggle="dropdown"
                                            class="btn btn-link btn-sm w-10"
                                            type="button"
                                            style="margin-left: -40px"
                                        >
                                        <i class="fas fa-angle-down"></i>
                                        </button>
                                        <div role="menu" class="dropdown-menu dropdown-bordered table-row-price-list w-460p"></div>
                                    </div>
                                    <input 
                                        type="text" 
                                        class="form-control mask-money table-row-price" 
                                        value="${row.product_unit_price}"
                                        data-return-type="number"
                                    >
                                </div>`;
                    }
                },
                {
                    targets: 9,
                    render: (data, type, row) => {
                        let taxID = "";
                        let taxRate = "0";
                        if (row.tax) {
                            taxID = row.tax.id;
                            taxRate = row.tax.value;
                        }
                        return `<div class="row">
                                <select class="form-control select2 table-row-tax">
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
                    targets: 10,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row.product_subtotal_price)}"></span>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row.product_subtotal_price}"
                                    hidden
                                >`;
                    }
                },
            ],
            drawCallback: function () {},
        });
    };

    dataTablePurchaseOrderProductAdd(data) {
        let $table = $('#datable-purchase-order-product-add');
        $table.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [
                {
                    "width": "5%",
                    "targets": 0
                },
                {
                    "width": "20%",
                    "targets": 1
                },
                {
                    "width": "10%",
                    "targets": 2
                },
                {
                    "width": "10%",
                    "targets": 3,
                },
                {
                    "width": "10%",
                    "targets": 4,
                },
                {
                    "width": "15%",
                    "targets": 5,
                },
                {
                    "width": "10%",
                    "targets": 6,
                },
                {
                    "width": "15%",
                    "targets": 7,
                },
                {
                    "width": "5%",
                    "targets": 8,
                }
            ],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<span class="table-row-order" id="${row.id}">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                            return `<div class="row more-information-group">
                                        <div class="input-group">
                                            <span class="input-affix-wrapper">
                                                <span class="input-prefix">
                                                    <div class="btn-group dropstart">
                                                        <i
                                                            class="fas fa-info-circle more-information"
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
                                                <select class="form-select select2 table-row-item" required>
                                                    <option value="${row.product.id}">${row.product_title}</option>
                                                </select>
                                            </span>
                                        </div>
                                    </div>`;
                    },
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
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <select class="form-control select2 table-row-uom-order-actual" required>
                                        <option value="${row.uom_order_actual.id}">${row.uom_order_actual.title}</option>
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-quantity-order-actual validated-number" value="${row.product_quantity_order_actual}" required>
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<div class="row more-information-group">
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
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        let taxID = "";
                        let taxRate = "0";
                        if (row.tax) {
                            taxID = row.tax.id;
                            taxRate = row.tax.value;
                        }
                        return `<div class="row">
                                <select class="form-control select2 table-row-tax">
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
                    targets: 7,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row.product_subtotal_price)}"></span>
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
                    targets: 8,
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                },
            ],
            drawCallback: function () {},
        });
    };

}

let dataTableClass = new dataTableHandle();

// Calculate
class calculateHandle {
    calculateTotal(table) {
        let pretaxAmount = 0;
        let taxAmount = 0;
        let elePretaxAmount = document.getElementById('purchase-order-product-pretax-amount');
        let eleTaxes = document.getElementById('purchase-order-product-taxes');
        let eleTotal = document.getElementById('purchase-order-product-total');
        let elePretaxAmountRaw = document.getElementById('purchase-order-product-pretax-amount-raw');
        let eleTaxesRaw = document.getElementById('purchase-order-product-taxes-raw');
        let eleTotalRaw = document.getElementById('purchase-order-product-total-raw');
        let finalRevenueBeforeTax = document.getElementById('purchase-order-final-revenue-before-tax');
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
            let totalFinal = (pretaxAmount + taxAmount);
            $(elePretaxAmount).attr('data-init-money', String(pretaxAmount));
            elePretaxAmountRaw.value = pretaxAmount;
            finalRevenueBeforeTax.value = pretaxAmount;
            $(eleTaxes).attr('data-init-money', String(taxAmount));
            eleTaxesRaw.value = taxAmount;
            $(eleTotal).attr('data-init-money', String(totalFinal));
            eleTotalRaw.value = totalFinal;
        }
        $.fn.initMaskMoney2();
        return true;
    }

    calculateRow(row) {
        let price = 0;
        let quantity = 0;
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            price = $(elePrice).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-quantity-order-actual');
        if (eleQuantity) {
            if (eleQuantity.value) {
                quantity = parseFloat(eleQuantity.value)
            } else if (!eleQuantity.value || eleQuantity.value === "0") {
                quantity = 0
            }
        }
        let tax = 0;
        let subtotal = (price * quantity);
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            let optionSelected = eleTax.options[eleTax.selectedIndex];
            if (optionSelected) {
                tax = parseInt(optionSelected.getAttribute('data-value'));
            }
        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        let eleTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
        // calculate tax
        if (eleTaxAmount) {
            let taxAmount = ((subtotal * tax) / 100);
            $(eleTaxAmount).attr('value', String(taxAmount));
            eleTaxAmountRaw.value = taxAmount;
        }
        // set subtotal value
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        let eleSubtotalRaw = row.querySelector('.table-row-subtotal-raw');
        if (eleSubtotal) {
            $(eleSubtotal).attr('value', String(subtotal));
            $(eleSubtotal).attr('data-init-money', String(subtotal));
            eleSubtotalRaw.value = subtotal;
        }
        $.fn.initMaskMoney2();
        return true;
    }

    calculateMain(table, row) {
        let self = this;
        self.calculateRow(row);
        // calculate total
        self.calculateTotal(table[0]);
        return true;
    };

    calculateTable(table) {
        let self = this;
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            self.calculateMain(table, row)
        }
    }
}

let calculateClass = new calculateHandle();

// Validate
class validateHandle {
    validateNumber(ele) {
        let value = ele.value;
        // Replace non-digit characters with an empty string
        value = value.replace(/[^0-9.]/g, '');
        // Remove unnecessary zeros from the integer part
        value = value.replace("-", "").replace(/^0+(?=\d)/, '');
        // Update value of input
        ele.value = value;
    };

    validateQuantityOrderAndRemain(ele, remain) {
        if (parseFloat(ele.value) > remain) {
            ele.value = '0';
            $.fn.notifyB({description: 'Quantity order must be less than quantity remain'}, 'failure');
        }
    };

    validateQuantityOrderFinal(ele, order_on_request) {
        let eleStock = ele.closest('tr').querySelector('.table-row-stock');
        if (parseFloat(ele.value) < parseFloat(order_on_request)) {
            ele.value = order_on_request;
            eleStock.innerHTML = '0';
            $.fn.notifyB({description: 'Quantity order actually must be equal or greater than quantity order on request'}, 'failure');
        } else {
            eleStock.innerHTML = String(parseFloat(ele.value) - parseFloat(order_on_request));
        }
    };
}

// Submit Form
class submitHandle {
    setupDataProduct() {
        let result = [];
        let is_by_request = false;
        let table = document.getElementById('datable-purchase-order-product-add');
        if (document.getElementById('purchase-order-purchase-request').innerHTML) {
            table = document.getElementById('datable-purchase-order-product-request');
            is_by_request = true;
        }
        if (table.querySelector('.dataTables_empty')) {
            return []
        }
        let tableBody = table.tBodies[0];
        for (let i = 0; i < tableBody.rows.length; i++) {
            let rowData = {};
            let row = tableBody.rows[i];
            let eleProduct = row.querySelector('.table-row-item');
            if (eleProduct) { // PRODUCT
                let optionSelected = eleProduct;
                if (is_by_request === true) {
                    optionSelected = eleProduct;
                } else {
                    optionSelected = eleProduct.options[eleProduct.selectedIndex];
                }
                if (optionSelected) {
                    // rowData['purchase_request_product'] = optionSelected.getAttribute('data-purchase-request-product-id');
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
                        if (optionSelected.getAttribute('data-purchase-request-product-datas')) {
                            rowData['purchase_request_product_datas'] = JSON.parse(optionSelected.getAttribute('data-purchase-request-product-datas'));
                        }
                    }
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleUOMRequest = row.querySelector('.table-row-uom-order-request');
                if (eleUOMRequest) {
                    let dataInfo = JSON.parse(eleUOMRequest.querySelector('.data-info').value);
                    rowData['uom_order_request'] = dataInfo.id;
                }
                let eleUOMOrder = row.querySelector('.table-row-uom-order-actual');
                if (eleUOMOrder) {
                    let optionSelected = eleUOMOrder.options[eleUOMOrder.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['uom_order_actual'] = dataInfo.id;
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
                let eleQuantityRequest = row.querySelector('.table-row-quantity-order-request');
                if (eleQuantityRequest) {
                    rowData['product_quantity_order_request'] = parseFloat(eleQuantityRequest.innerHTML);
                }
                let eleQuantityOrder = row.querySelector('.table-row-quantity-order-actual');
                if (eleQuantityOrder) {
                    rowData['product_quantity_order_actual'] = parseFloat(eleQuantityOrder.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
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
            }
            result.push(rowData);
        }
        return result
    }

    setupDataSubmit(_form) {
        let self = this;
        _form.dataForm['purchase_requests_data'] = JSON.parse($('#purchase_requests_data').val());
        _form.dataForm['purchase_quotations_data'] = JSON.parse($('#purchase_quotations_data').val());
        let dateDeliveredVal = $('#purchase-order-date-delivered').val();
        if (dateDeliveredVal) {
            _form.dataForm['delivered_date'] = moment(dateDeliveredVal).format('YYYY-MM-DD HH:mm:ss');
        }
        _form.dataForm['status_delivered'] = 0;
        let products_data_setup = self.setupDataProduct();
        if (products_data_setup.length > 0) {
            _form.dataForm['purchase_order_products_data'] = products_data_setup;
        }
        _form.dataForm['total_product_pretax_amount'] = parseFloat($('#purchase-order-product-pretax-amount-raw').val());
        _form.dataForm['total_product_tax'] = parseFloat($('#purchase-order-product-taxes-raw').val());
        _form.dataForm['total_product'] = parseFloat($('#purchase-order-product-total-raw').val());
        _form.dataForm['total_product_revenue_before_tax'] = parseFloat(finalRevenueBeforeTax.value);
    }
}

// COMMON FUNCTION
function clickCheckBoxAll(ele, table) {
    if (ele[0].checked === true) {
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            row.querySelector('.table-row-checkbox').checked = true;
        }
    } else {
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            row.querySelector('.table-row-checkbox').checked = false;
        }
    }
}

function setupMergeProduct() {
    let data = [];
    let dataJson = {};
    let table = $('#datable-purchase-request-product');
    if (!table[0].querySelector('.dataTables_empty')) {
        let order = 0;
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            let sale_order_id = row.querySelector('.table-row-checkbox').getAttribute('data-sale-order-product-id');
            if (sale_order_id === "null") {
                sale_order_id = null;
            }
            if (row.querySelector('.table-row-checkbox').checked === true) {
                if (!dataJson.hasOwnProperty(row.querySelector('.table-row-item').id)) {
                    order++
                    dataJson[row.querySelector('.table-row-item').id] = {
                        'id': row.querySelector('.table-row-checkbox').id,
                        'purchase_request_product_datas': [{
                            'purchase_request_product': row.querySelector('.table-row-checkbox').id,
                            'sale_order_product': sale_order_id,
                            'quantity_order': parseFloat(row.querySelector('.table-row-quantity-order').value),
                            'quantity_remain': parseFloat(row.querySelector('.table-row-remain').innerHTML),
                        }],
                        'product': {
                            'id': row.querySelector('.table-row-item').id,
                            'title': row.querySelector('.table-row-item').innerHTML,
                        },
                        'uom_order_request': {
                            'id': row.querySelector('.table-row-uom-request').id,
                            'title': row.querySelector('.table-row-uom-request').innerHTML,
                        },
                        'uom_order_actual': {
                            'id': row.querySelector('.table-row-uom-request').id,
                            'title': row.querySelector('.table-row-uom-request').innerHTML,
                        },
                        'tax': {'id': 1, 'value': 10},
                        'stock': 0,
                        'product_title': row.querySelector('.table-row-item').innerHTML,
                        'code_list': [row.querySelector('.table-row-code').innerHTML],
                        'product_description': 'xxxxx',
                        'product_quantity_request': parseFloat(row.querySelector('.table-row-quantity-request').innerHTML),
                        'product_quantity_order_request': parseFloat(row.querySelector('.table-row-quantity-order').value),
                        'product_quantity_order_actual': parseFloat(row.querySelector('.table-row-quantity-order').value),
                        'remain': parseFloat(row.querySelector('.table-row-remain').innerHTML),
                        'product_unit_price': 0,
                        'product_tax_title': 'vat-10',
                        'product_tax_amount': 0,
                        'product_subtotal_price': 0,
                        'order': order,
                    };
                } else {
                    if (!dataJson[row.querySelector('.table-row-item').id].code_list.includes(row.querySelector('.table-row-code').innerHTML)) {
                        dataJson[row.querySelector('.table-row-item').id].code_list.push(row.querySelector('.table-row-code').innerHTML);
                    }
                    dataJson[row.querySelector('.table-row-item').id].product_quantity_request += parseFloat(row.querySelector('.table-row-quantity-request').innerHTML);
                    dataJson[row.querySelector('.table-row-item').id].product_quantity_order_request += parseFloat(row.querySelector('.table-row-quantity-order').value);
                    dataJson[row.querySelector('.table-row-item').id].remain += parseFloat(row.querySelector('.table-row-remain').innerHTML);
                    dataJson[row.querySelector('.table-row-item').id].product_quantity_order_actual += parseFloat(row.querySelector('.table-row-quantity-order').value);
                }
            }
        }
        for (let key in dataJson) {
            data.push(dataJson[key]);
        }
    }
    return data
}
