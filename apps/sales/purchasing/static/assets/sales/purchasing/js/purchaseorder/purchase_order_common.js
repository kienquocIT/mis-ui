// LoadData
class loadDataHandle {
    loadMoreInformation(ele) {
        let optionSelected = ele[0].options[ele[0].selectedIndex];
        let eleInfo = ele[0].closest('.input-affix-wrapper').querySelector('.more-information');
        let dropdownContent = ele[0].closest('.input-affix-wrapper').querySelector('.dropdown-menu');
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
        if (!ele[0].innerHTML || valueToSelect) {
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
                                let ownerName = "";
                                if (item.owner) {
                                    ownerName = item.owner.fullname;
                                }
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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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

    loadModalPurchaseRequestTable() {
        let tablePurchaseRequest = $('#datable-purchase-request');
        if (tablePurchaseRequest[0].querySelector('.dataTables_empty')) {
            tablePurchaseRequest.DataTable().destroy();
            dataTableClass.dataTablePurchaseRequest();
        }
    };

    loadModalPurchaseRequestProductTable() {
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        let frm = new SetupFormSubmit(tablePurchaseRequestProduct);
        let request_id_list = [];
        let product_checked_list = [];
        for (let i = 0; i < tablePurchaseRequest[0].tBodies[0].rows.length; i++) {
            let row = tablePurchaseRequest[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-checkbox').checked === true) {
                request_id_list.push(row.querySelector('.table-row-checkbox').id);
            }
        }
        for (let idx = 0; idx < tablePurchaseRequestProduct[0].tBodies[0].rows.length; idx++) {
            let row = tablePurchaseRequestProduct[0].tBodies[0].rows[idx];
            if (row.querySelector('.table-row-checkbox').checked === true) {
                product_checked_list.push({
                    'id': row.querySelector('.table-row-checkbox').id,
                    'quantity_order': row.querySelector('.table-row-quantity-order').value,
                });
            }
        }
        $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': {'purchase_request_id__in': request_id_list},
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('purchase_request_product_list') && Array.isArray(data.purchase_request_product_list)) {
                        tablePurchaseRequestProduct.DataTable().destroy();
                        dataTableClass.dataTablePurchaseRequestProduct(data.purchase_request_product_list);
                        for (let idx = 0; idx < tablePurchaseRequestProduct[0].tBodies[0].rows.length; idx++) {
                            let row = tablePurchaseRequestProduct[0].tBodies[0].rows[idx];
                            for (let data_prod of product_checked_list) {
                                if (row.querySelector('.table-row-checkbox').id === data_prod.id) {
                                    row.querySelector('.table-row-checkbox').checked = true;
                                    row.querySelector('.table-row-quantity-order').value = data_prod.quantity_order;
                                }
                            }
                        }
                    }
                }
            }
        )
    };

    loadMergeProductTable(eleCheckbox) {
        if (eleCheckbox[0].checked === true) {
            $('#sroll-datable-purchase-request-product')[0].setAttribute('hidden', 'true');
            $('#sroll-datable-purchase-request-product-merge')[0].removeAttribute('hidden');
            $('#datable-purchase-request-product-merge').DataTable().destroy();
            let data = setupMergeProduct();
            dataTableClass.dataTablePurchaseRequestProductMerge(data);
        } else {
            $('#sroll-datable-purchase-request-product-merge')[0].setAttribute('hidden', 'true');
            $('#sroll-datable-purchase-request-product')[0].removeAttribute('hidden');
        }
    };

    loadDataShowPurchaseRequest(elePurchaseRequest, tablePurchaseRequest) {
        let self = this;
        let purchase_requests_data = [];
        if (!tablePurchaseRequest[0].querySelector('.dataTables_empty')) {
            let eleAppend = ``;
            let is_checked = false;
            for (let i = 0; i < tablePurchaseRequest[0].tBodies[0].rows.length; i++) {
                let row = tablePurchaseRequest[0].tBodies[0].rows[i];
                if (row.querySelector('.table-row-checkbox').checked === true) {
                    is_checked = true;
                    purchase_requests_data.push(row.querySelector('.table-row-checkbox').id);
                    let link = "";
                    eleAppend += `<div class="inline-elements-badge mr-2 mb-1" id="${row.querySelector('.table-row-checkbox').id}">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span>${row.querySelector('.table-row-code').innerHTML}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                }
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
        $('#purchase_quotations_data').val(JSON.stringify(purchase_requests_data));
    };

    loadModalPurchaseQuotation(tablePurchaseQuotation) {
        if (tablePurchaseQuotation[0].querySelector('.dataTables_empty')) {
            tablePurchaseQuotation.DataTable().destroy();
            dataTableClass.dataTablePurchaseQuotation([{
                'id': 1,
                'code': 'PQ0001',
                'title': 'Bao gia mua hang so 1',
                'supplier': {'id': 1, 'title': 'Cong ty Unilever'},
                'purchase_quotation_request': {'id': 1, 'code': 'PQR0001'},
                'purchase_request': {'id': 1, 'code': 'PR0001'},
            }, {
                'id': 2,
                'code': 'PQ0002',
                'title': 'Bao gia mua hang so 2',
                'supplier': {'id': 1, 'title': 'Cong ty Apple'},
                'purchase_quotation_request': {'id': 1, 'code': 'PQR0002'},
                'purchase_request': {'id': 2, 'code': 'PR0002'},
            }, {
                'id': 3,
                'code': 'PQ0003',
                'title': 'Bao gia mua hang so 3',
                'supplier': {'id': 1, 'title': 'Cong ty Lenovo'},
                'purchase_quotation_request': {'id': 1, 'code': 'PQR0003'},
                'purchase_request': {'id': 3, 'code': 'PR0003'},
            }, {
                'id': 4,
                'code': 'PQ0004',
                'title': 'Bao gia mua hang so 4',
                'supplier': {'id': 1, 'title': 'Cong ty Hao Hao'},
                'purchase_quotation_request': {'id': 1, 'code': 'PQR0004'},
                'purchase_request': {'id': 4, 'code': 'PR0004'},
            }]);
        }
    };

    loadDataShowPurchaseQuotation(elePurchaseQuotation, tablePurchaseQuotation) {
        let self = this;
        if (!tablePurchaseQuotation[0].querySelector('.dataTables_empty')) {
            let eleAppend = ``;
            let is_checked = false;
            for (let i = 0; i < tablePurchaseQuotation[0].tBodies[0].rows.length; i++) {
                let row = tablePurchaseQuotation[0].tBodies[0].rows[i];
                if (row.querySelector('.table-row-checkbox').checked === true) {
                    is_checked = true;
                    let link = "";
                    eleAppend += `<div class="inline-elements-badge mr-2 mb-1" id="${row.querySelector('.table-row-checkbox').id}">
                                    <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" id="${row.querySelector('.table-row-checkbox').id}" value="option1">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover ml-3"><span>${row.querySelector('.table-row-code').innerHTML}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                }
            }
            if (is_checked === true) {
                elePurchaseQuotation.empty();
                elePurchaseQuotation.append(eleAppend);
            } else {
                elePurchaseQuotation.empty();
            }
        }
        self.loadPriceListByPurchaseQuotation(null);
    };

    loadDataAfterClickRemove(ele, eleShow, table, code) {
        let self = this;
        let targetID = ele[0].closest('.inline-elements-badge').id;
        uncheckRowTableByID(table, targetID);
        if (code === "purchase_request") {
            self.loadDataShowPurchaseRequest(eleShow, table);
            // Remove relate purchase quotation
            let tablePQ = $('#datable-purchase-quotation');
            let eleShowPQ = $('#purchase-order-purchase-quotation');
            uncheckRowTableRelate(tablePQ, targetID);
            self.loadDataShowPurchaseQuotation(eleShowPQ, tablePQ);
            // Remove relate purchase request product
            let tablePRProduct = $('#datable-purchase-request-product');
            uncheckRowTableRelate(tablePRProduct, targetID);
            let eleCheckboxMerge = $('#merge-same-product');
            self.loadMergeProductTable(eleCheckboxMerge);
            self.loadTableProductByPurchaseRequest();
        } else if (code === "purchase_quotation") {
            self.loadDataShowPurchaseQuotation(eleShow, table);
        }
    }

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
        dataTableClass.dataTablePurchaseOrderProductRequest();
        tablePurchaseOrderProductRequest.DataTable().rows.add(data).draw();
        self.loadDataRowTable(tablePurchaseOrderProductRequest);
    };

    loadTableProductNoPurchaseRequest() {
        let self = this;
        $('#purchase-order-purchase-request').empty();
        $('#purchase-order-purchase-quotation').empty();
        let tablePurchaseOrderProductRequest = $('#datable-purchase-order-product-request');
        let tablePurchaseOrderProductAdd = $('#datable-purchase-order-product-add');
        let order = 1;
        let tableEmpty = tablePurchaseOrderProductAdd[0].querySelector('.dataTables_empty');
        let tableLen = tablePurchaseOrderProductAdd[0].tBodies[0].rows.length;
        if (tableLen !== 0 && !tableEmpty) {
            order = (tableLen + 1);
        }
        let data = {
            'product': {'id': 1},
            'uom_request': {'id': 1},
            'uom_order': {'id': 1},
            'tax': {'id': 1, 'value': 10},
            'stock': 3,
            'product_title': '',
            'product_description': 'xxxxx',
            'product_uom_request_title': '',
            'product_uom_order_title': '',
            'product_quantity_request': 0,
            'product_quantity_order': 0,
            'remain': 0,
            'product_unit_price': 1800000,
            'product_tax_title': 'vat-10',
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
        }
        self.loadBoxUOM($(row.querySelector('.table-row-uom-order')));
        self.loadBoxTax($(row.querySelector('.table-row-tax')));
    }

    loadPriceListByPurchaseQuotation(purchase_quotation_list) {
        let data = {
            1: [
                {
                    'quotation_id': 1,
                    'title': 'Bao gia so 1',
                    'quotation_price': 1000000,
                },
                {
                    'quotation_id': 2,
                    'title': 'Bao gia so 2',
                    'quotation_price': 2000000,
                },
                {
                    'quotation_id': 3,
                    'title': 'Bao gia so 3',
                    'quotation_price': 3000000,
                }
            ],
            2: [
                {
                    'quotation_id': 1,
                    'title': 'Bao gia so 1',
                    'quotation_price': 1500000,
                },
                {
                    'quotation_id': 2,
                    'title': 'Bao gia so 2',
                    'quotation_price': 2500000,
                },
                {
                    'quotation_id': 3,
                    'title': 'Bao gia so 3',
                    'quotation_price': 3500000,
                }
            ],
            3: [
                {
                    'quotation_id': 1,
                    'title': 'Bao gia so 1',
                    'quotation_price': 1800000,
                },
                {
                    'quotation_id': 2,
                    'title': 'Bao gia so 2',
                    'quotation_price': 2800000,
                },
                {
                    'quotation_id': 3,
                    'title': 'Bao gia so 3',
                    'quotation_price': 3800000,
                }
            ],
        }
        let $table = $('#datable-purchase-order-product-request');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let priceListData = data[row.querySelector('.table-row-item').id];
            let elePrice = row.querySelector('.table-row-price');
            let elePriceShow = row.querySelector('.table-row-price-show');
            let elePriceList = row.querySelector('.table-row-price-list');
            $(elePrice).attr('value', String(0));
            $(elePriceShow).attr('data-init-money', String(0));
            if (elePriceList) {
                $(elePriceList).empty();
                for (let price of priceListData) {
                    $(elePriceList).append(`<div class="dropdown-item disabled text-black border border-grey mb-1" id="${price.quotation_id}" data-value="${parseFloat(price.quotation_price)}">
                                                <div class="row">
                                                    <div class="col-7"><span>${price.title}</span></div>
                                                    <div class="col-5"><span
                                                        class="mask-money" data-init-money="${parseFloat(price.quotation_price)}"
                                                    ></span></div>
                                                </div>
                                            </div>`);
                }
            }
        });
        // mask money
        $.fn.initMaskMoney2();
    };

    loadPriceByCheckedQuotation(ele) {
        let checked_id = ele[0].id;
        let $table = $('#datable-purchase-order-product-request');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let elePrice = row.querySelector('.table-row-price');
            let elePriceShow = row.querySelector('.table-row-price-show');
            let elePriceList = row.querySelector('.table-row-price-list');
            for (let item of elePriceList.querySelectorAll('.dropdown-item')) {
                if (ele[0].checked === true) {
                    if (item.id === checked_id) {
                        item.classList.add('bg-light');
                        $(elePrice).attr('value', String(item.getAttribute('data-value')));
                        $(elePriceShow).attr('data-init-money', String(item.getAttribute('data-value')));
                    } else {
                        item.classList.remove('bg-light');
                    }
                } else {
                    item.classList.remove('bg-light');
                    $(elePrice).attr('value', String(0));
                    $(elePriceShow).attr('data-init-money', String(0));
                }
            }
            calculateClass.calculateMain($table, row);
        });
        $.fn.initMaskMoney2();
    }
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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}" data-purchase-request-id="${purchase_request_id}"></div>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.product.title}</span>`
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.code}</span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom-request">${row.uom.title}</span>`
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
                        return `<span class="table-row-remain">${row.remain}</span>`
                    }
                },
                {
                    targets: 7,
                    render: () => {
                        return `<input type="text" class="form-control table-row-quantity-order" value="0">`
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
                        return `<span class="table-row-uom-request">${row.product_uom_request_title}</span>`
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
                        return `<span class="table-row-quantity-order">${row.product_quantity_order}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    dataTablePurchaseQuotation(data) {
        let $table = $('#datable-purchase-quotation');
        let frm = new SetupFormSubmit($table);
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
                        let purchase_request_id = "";
                        if (Object.keys(row.purchase_request).length !== 0) {
                            purchase_request_id = row.purchase_request.id;
                        }
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}" data-purchase-request-id="${purchase_request_id}"></div>`
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
                        return `<span class="table-row-supplier">${row.supplier.title}</span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-purchase-quotation-request">${row.purchase_quotation_request.code}</span>`
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
                        return `<div class="row">
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
                                    <span class="table-row-item" id="${row.product.id}">${row.product_title}<input type="hidden" class="data-info" value="${dataStr}"></span>
                                </div>
                            </div>`
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span>${row.product_description}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let dataStr = JSON.stringify(row.uom_request).replace(/"/g, "&quot;");
                        return `<span class="table-row-uom-request" id="${row.uom_request.id}">${row.product_uom_request_title}<input type="hidden" class="data-info" value="${dataStr}"></span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span>${row.product_quantity_request}</span>`;
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
                                    <select class="form-control select2 table-row-uom-order" required>
                                        <option value="${row.uom_order.id}" selected>${row.product_uom_order_title}</option>
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-quantity-order validated-number" value="${row.product_quantity_order}" required>
                                </div>`;
                    }
                },
                {
                    targets: 8,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <div class="col-8">
                                    <span class="mask-money mr-4 table-row-price-show" data-init-money="${parseFloat(row.product_unit_price)}"></span>
                                    <input 
                                        type="text" 
                                        class="form-control mask-money table-row-price" 
                                        value="${row.product_unit_price}"
                                        data-return-type="number"
                                        hidden
                                    >
                                    </div>
                                    <div class="col-4">
                                        <button 
                                        aria-expanded="false"
                                        data-bs-toggle="dropdown"
                                        class="btn btn-link btn-sm"
                                        type="button">
                                        <i class="fas fa-angle-down"></i>
                                        </button>
                                        <div role="menu" class="dropdown-menu dropdown-bordered table-row-price-list w-460p">
                                        </div>
                                    </div>
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
                }, {
                    "width": "20%",
                    "targets": 1
                }, {
                    "width": "10%",
                    "targets": 2
                }, {
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
                            return `<div class="row">
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
                                    <select class="form-control select2 table-row-uom-order" required>
                                        <option value="${row.uom_order.id}">${row.product_uom_order_title}</option>
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-quantity-order validated-number" value="${row.product_quantity_order}" required>
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
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
        let discountAmount = 0;
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
            let totalFinal = (pretaxAmount - discountAmount + taxAmount);
            $(elePretaxAmount).attr('value', String(pretaxAmount));
            elePretaxAmountRaw.value = pretaxAmount;
            finalRevenueBeforeTax.value = pretaxAmount;
            $(eleTaxes).attr('value', String(taxAmount));
            eleTaxesRaw.value = taxAmount;
            $(eleTotal).attr('value', String(totalFinal));
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
        let eleQuantity = row.querySelector('.table-row-quantity-order');
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

}

let calculateClass = new calculateHandle();

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
                    if (optionSelected.querySelector('.data-info')) {
                        let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
                    }
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleUOMRequest = row.querySelector('.table-row-uom-request');
                if (eleUOMRequest) {
                    let dataInfo = JSON.parse(eleUOMRequest.querySelector('.data-info').value);
                    rowData['uom_request'] = dataInfo.id;
                    rowData['product_uom_request_title'] = dataInfo.title;
                }
                let eleUOMOrder = row.querySelector('.table-row-uom-order');
                if (eleUOMOrder) {
                    let optionSelected = eleUOMOrder.options[eleUOMOrder.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['uom_order'] = dataInfo.id;
                            rowData['product_uom_order_title'] = dataInfo.title;
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
                let eleQuantityRequest = row.querySelector('.table-row-quantity-request');
                if (eleQuantityRequest) {
                    rowData['product_quantity_request'] = parseFloat(eleQuantityRequest.value);
                }
                let eleQuantityOrder = row.querySelector('.table-row-quantity-order');
                if (eleQuantityOrder) {
                    rowData['product_quantity_order'] = parseFloat(eleQuantityOrder.value);
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
        let dateDeliveredVal = $('#purchase-order-date-delivered').val();
        if (dateDeliveredVal) {
            _form.dataForm['date_delivered'] = moment(dateDeliveredVal).format('YYYY-MM-DD HH:mm:ss')
        }
        let products_data_setup = self.setupDataProduct();
        if (products_data_setup.length > 0) {
            _form.dataForm['purchase_order_products_data'] = products_data_setup
        }
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

function uncheckRowTableByID(table, targetID) {
    for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
        let row = table[0].tBodies[0].rows[i];
        if (row.querySelector('.table-row-checkbox').checked === true) {
            if (row.querySelector('.table-row-checkbox').id === targetID) {
                row.querySelector('.table-row-checkbox').checked = false;
                break;
            }
        }
    }
}

function uncheckRowTableRelate(table, targetID) {
    for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
        let row = table[0].tBodies[0].rows[i];
        if (row.querySelector('.table-row-checkbox').getAttribute('data-purchase-request-id') === targetID) {
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
            if (row.querySelector('.table-row-checkbox').checked === true) {
                if (!dataJson.hasOwnProperty(row.querySelector('.table-row-checkbox').id)) {
                    order++
                    dataJson[row.querySelector('.table-row-checkbox').id] = {
                        'id': row.querySelector('.table-row-checkbox').id,
                        'product': {'id': order},
                        'uom_request': {'id': 1},
                        'uom_order': {'id': 1},
                        'tax': {'id': 1, 'value': 10},
                        'stock': 3,
                        'product_title': row.querySelector('.table-row-title').innerHTML,
                        'code_list': [row.querySelector('.table-row-code').innerHTML],
                        'product_description': 'xxxxx',
                        'product_uom_request_title': row.querySelector('.table-row-uom-request').innerHTML,
                        'product_uom_order_title': row.querySelector('.table-row-uom-request').innerHTML,
                        'product_quantity_request': parseFloat(row.querySelector('.table-row-quantity-request').innerHTML),
                        'product_quantity_order': parseFloat(row.querySelector('.table-row-quantity-order').value),
                        'remain': parseFloat(row.querySelector('.table-row-remain').innerHTML),
                        'product_unit_price': 0,
                        'product_tax_title': 'vat-10',
                        'product_tax_amount': 0,
                        'product_subtotal_price': 0,
                        'order': order,
                    };
                } else {
                    dataJson[row.querySelector('.table-row-checkbox').id].code_list.push(row.querySelector('.table-row-code').innerHTML);
                    dataJson[row.querySelector('.table-row-checkbox').id].product_quantity_request += parseFloat(row.querySelector('.table-row-quantity-request').innerHTML);
                    dataJson[row.querySelector('.table-row-checkbox').id].remain += parseFloat(row.querySelector('.table-row-remain').innerHTML);
                    dataJson[row.querySelector('.table-row-checkbox').id].product_quantity_order += parseFloat(row.querySelector('.table-row-quantity-order').value);
                }
            }
        }
        for (let key in dataJson) {
            data.push(dataJson[key]);
        }
    }
    return data
}
