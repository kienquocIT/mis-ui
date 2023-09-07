// LoadData
class GRLoadDataHandle {
    static typeSelectEle = $('#box-good-receipt-type');
    static POSelectEle = $('#box-good-receipt-purchase-order');
    static supplierSelectEle = $('#box-good-receipt-supplier');
    static PRDataEle = $('#purchase_requests_data');
    static finalRevenueBeforeTax = document.getElementById('purchase-order-final-revenue-before-tax');

    static loadMoreInformation(ele, is_span = false) {
        let optionSelected = null;
        if (is_span === false) {
            optionSelected = ele;
        } else {
            optionSelected = ele[0]
        }
        let eleInfo = ele[0].closest('.more-information-group').querySelector('.more-information');
        let dropdownContent = ele[0].closest('.more-information-group').querySelector('.dropdown-menu');
        dropdownContent.innerHTML = ``;
        eleInfo.setAttribute('disabled', true);
        let link = "";
        if (optionSelected) {
            let data = {};
            if (is_span === false) {
                data = SelectDDControl.get_data_from_idx(ele, ele.val());
            } else {
                let eleData = optionSelected.querySelector('.data-info');
                if (eleData) {
                    data = JSON.parse(eleData.value)
                }
            }
            if (Object.keys(data).length !== 0) {
                // remove attr disabled
                if (eleInfo) {
                    eleInfo.removeAttribute('disabled');
                }
                // end
                let info = ``;
                info += `<h6 class="dropdown-header header-wth-bg">${$.fn.transEle.attr('data-more-information')}</h6>`;
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
                            <span><span>${$.fn.transEle.attr('data-view-detail-info')}</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                        </a>
                    </div>`;
                dropdownContent.innerHTML = info;
            }
        }
    };

    static loadBoxType() {
        let ele = GRLoadDataHandle.typeSelectEle;
        let dataType = [
            {
                'id': 1,
                'title': 'For purchase order'
            },
            {
                'id': 2,
                'title': 'For inventory adjustment'
            },
            {
                'id': 3,
                'title': 'For product'
            }
        ];
        ele.initSelect2({
            data: dataType,
        });
    };

    static loadBoxPO(dataPO = {}) {
        let ele = GRLoadDataHandle.POSelectEle;
        ele.initSelect2({
            data: dataPO,
            disabled: !(ele.attr('data-url')),
        });
        GRLoadDataHandle.loadMoreInformation(ele);
    };

    static loadBoxSupplier(dataCustomer = {}) {
        let ele = GRLoadDataHandle.supplierSelectEle;
        ele.initSelect2({
            data: dataCustomer,
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['name'] || '';
            },
        });
        GRLoadDataHandle.loadMoreInformation(ele);
    };

    static loadBoxProduct(ele, dataProduct = {}) {
        ele.initSelect2({
            data: dataProduct,
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadDataProductSelect(ele, is_change_item = true) {
        if (ele.val()) {
            let data = SelectDDControl.get_data_from_idx(ele, ele.val());
            if (data) {
                data['unit_of_measure'] = data?.['sale_information']?.['default_uom'];
                data['uom_group'] = data?.['general_information']?.['uom_group'];
                data['tax'] = data?.['sale_information']?.['tax_code'];
                let uom = ele[0].closest('tr').querySelector('.table-row-uom-order-actual');
                let price = ele[0].closest('tr').querySelector('.table-row-price');
                let priceList = ele[0].closest('tr').querySelector('.table-row-price-list');
                let tax = ele[0].closest('tr').querySelector('.table-row-tax');
                // load UOM
                if (uom && Object.keys(data.unit_of_measure).length !== 0 && Object.keys(data.uom_group).length !== 0) {
                    GRLoadDataHandle.loadBoxUOM($(uom), data.unit_of_measure, data.uom_group.id);
                } else {
                    GRLoadDataHandle.loadBoxUOM($(uom));
                }
                // load PRICE
                if (price && priceList) {
                    GRLoadDataHandle.loadPriceProduct(ele[0], is_change_item);
                }
                // load TAX
                if (tax && data.tax) {
                    GRLoadDataHandle.loadBoxTax($(tax), data.tax);
                } else {
                    GRLoadDataHandle.loadBoxTax($(tax));
                }
                // load modal more information
                GRLoadDataHandle.loadMoreInformation(ele);
            }
            $.fn.initMaskMoney2();
        }
    };

    static loadPriceProduct(eleProduct, is_change_item = true) {
        let data = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
        let is_change_price = false;
        if (data) {
            let price = eleProduct.closest('tr').querySelector('.table-row-price');
            let priceList = eleProduct.closest('tr').querySelector('.table-row-price-list');
            // load PRICE
            if (price && priceList) {
                let account_price_id = document.getElementById('customer-price-list')?.value;
                let general_price_id = null;
                let general_price = 0;
                let customer_price = null;
                let current_price_checked = price.getAttribute('value');
                $(priceList).empty();
                if (Array.isArray(data.price_list) && data.price_list.length > 0) {
                    for (let i = 0; i < data.price_list.length; i++) {
                        if (data.price_list[i]?.['price_type'] === 1) { // PRICE TYPE IS PRODUCT (PURCHASE)
                            if (data.price_list[i].is_default === true) { // check & append GENERAL_PRICE_LIST
                                general_price_id = data.price_list[i].id;
                                general_price = parseFloat(data.price_list[i].value);
                                $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                                    <div class="row">
                                                        <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                        <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                        <div class="col-2"><span class="valid-price">${data.price_list[i]?.['price_status']}</span></div>
                                                    </div>
                                                </button>`);
                            }
                            if (data.price_list[i].id === account_price_id && general_price_id !== account_price_id) { // check & append CUSTOMER_PRICE_LIST
                                if (!["Expired", "Invalid"].includes(data.price_list[i]?.['price_status'])) { // Customer price valid
                                    customer_price = parseFloat(data.price_list[i].value);
                                    $(priceList).empty();
                                    $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option option-btn-checked" data-value="${parseFloat(data.price_list[i].value)}">
                                                        <div class="row">
                                                            <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                            <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                            <div class="col-2"><span class="valid-price">${data.price_list[i]?.['price_status']}</span></div>
                                                        </div>
                                                    </button>`);
                                } else { // Customer price invalid, expired
                                    $(priceList).append(`<button type="button" class="btn btn-white dropdown-item table-row-price-option option-btn-checked" data-value="${parseFloat(data.price_list[i].value)}" disabled>
                                                        <div class="row">
                                                            <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                                            <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                                            <div class="col-2"><span class="expired-price">${data.price_list[i]?.['price_status']}</span></div>
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

    static loadBoxUOM(ele, dataUOM = {}, uom_group_id = null) {
        ele.initSelect2({
            data: dataUOM,
            'dataParams': {'group': uom_group_id},
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadBoxTax(ele, dataTax = {}) {
        ele.initSelect2({
            data: dataTax,
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadModalProduct() {
        let tablePOProduct = $('#datable-good-receipt-po-product');
        let frm = new SetupFormSubmit(tablePOProduct);
        $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    'data': {'purchase_order_id': GRLoadDataHandle.POSelectEle.val()},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('purchase_order_product_list') && Array.isArray(data.purchase_order_product_list)) {
                            tablePOProduct.DataTable().clear().draw();
                            tablePOProduct.DataTable().rows.add(data.purchase_order_product_list).draw();
                        }
                    }
                }
            )
        return true;
    };

    static loadModalWareHouse() {
        let tableWareHouse = $('#datable-good-receipt-warehouse');
        let frm = new SetupFormSubmit(tableWareHouse);
        $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    // 'data': {'purchase_order_id': GRLoadDataHandle.POSelectEle.val()},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('warehouse_list') && Array.isArray(data.warehouse_list)) {
                            tableWareHouse.DataTable().clear().draw();
                            tableWareHouse.DataTable().rows.add(data.warehouse_list).draw();
                        }
                    }
                }
            )
        return true;
    };


    static loadModalPurchaseRequestProductTable(is_remove = false, dataDetail = null) {
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        let frm = new SetupFormSubmit(tablePurchaseRequestProduct);
        let checked_pr_id_list = [];
        let checked_data = {};
        if (dataDetail) {
            for (let dataProduct of dataDetail?.['purchase_order_products_data']) {
                for (let PRProduct of dataProduct?.['purchase_request_products_data']) {
                    checked_data[PRProduct?.['purchase_request_product_id']] = {
                        'id': PRProduct?.['purchase_request_product_id'],
                        'quantity_order': PRProduct?.['quantity_order'],
                    }
                }
            }
            for (let PRProduct of dataDetail?.['purchase_request_products_data']) {
                checked_data[PRProduct?.['purchase_request_product_id']] = {
                    'id': PRProduct?.['purchase_request_product_id'],
                    'quantity_order': PRProduct?.['quantity_order'],
                }
            }
            if (GRLoadDataHandle.PRDataEle.val()) {
                for (let prId of JSON.parse(GRLoadDataHandle.PRDataEle.val())) {
                    checked_pr_id_list.push(prId);
                }
            }
        }
        if (!tablePurchaseRequestProduct[0].querySelector('.dataTables_empty')) {
            for (let eleChecked of tablePurchaseRequestProduct[0].querySelectorAll('.table-row-checkbox:checked')) {
                checked_data[eleChecked.getAttribute('data-id')] = {
                    'id': eleChecked.getAttribute('data-id'),
                    'quantity_order': eleChecked.closest('tr').querySelector('.table-row-quantity-order').value,
                };
            }
        }
        for (let eleChecked of tablePurchaseRequest[0].querySelectorAll('.table-row-checkbox:checked')) {
            checked_pr_id_list.push(eleChecked.getAttribute('data-id'));
        }
        tablePurchaseRequestProduct.DataTable().clear().draw();
        if (checked_pr_id_list.length > 0) {
            $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    'data': {'purchase_request_id__in': checked_pr_id_list.join(',')},
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
                            tablePurchaseRequestProduct.DataTable().rows.add(data.purchase_request_product_list).draw();
                            if (dataDetail) {
                                GRLoadDataHandle.loadPRProductNotInPO(dataDetail);
                            }
                            if (is_remove === true) {
                                GRLoadDataHandle.loadDataShowPurchaseRequest();
                                GRLoadDataHandle.loadTableProductByPurchaseRequest();
                                GRLoadDataHandle.loadModalPurchaseQuotation(true);
                            }
                        }
                    }
                }
            )
        }
        return true;
    };

    static loadOrHiddenMergeProductTable() {
        let eleCheckbox = $('#merge-same-product');
        if (eleCheckbox[0].checked === true) {
            $('#datable-purchase-request-product')[0].setAttribute('hidden', 'true');
            $('#datable-purchase-request-product_wrapper')[0].setAttribute('hidden', 'true');
            $('#datable-purchase-request-product-merge')[0].removeAttribute('hidden');
            $('#datable-purchase-request-product-merge_wrapper')[0].removeAttribute('hidden');
            GRLoadDataHandle.loadDataMergeProductTable();
        } else {
            $('#datable-purchase-request-product-merge')[0].setAttribute('hidden', 'true');
            $('#datable-purchase-request-product-merge_wrapper')[0].setAttribute('hidden', 'true');
            $('#datable-purchase-request-product')[0].removeAttribute('hidden');
            $('#datable-purchase-request-product_wrapper')[0].removeAttribute('hidden');
        }
        return true;
    };

    static loadDataShowPurchaseRequest() {
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        let tablePurchaseRequest = $('#datable-purchase-request');
        let purchase_requests_data = [];
        if (!tablePurchaseRequest[0].querySelector('.dataTables_empty')) {
            let eleAppend = ``;
            let is_checked = false;
            for (let eleChecked of tablePurchaseRequest[0].querySelectorAll('.table-row-checkbox:checked')) {
                is_checked = true;
                let prID = eleChecked.getAttribute('data-id');
                let prCode = eleChecked.closest('tr').querySelector('.table-row-code').innerHTML;
                let link = "";
                let linkDetail = elePurchaseRequest.attr('data-link-detail');
                link = linkDetail.format_url_with_uuid(prID);
                eleAppend += `<div class="inline-elements-badge mr-2 mb-1">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span>${prCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" data-id="${prID}" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                purchase_requests_data.push(prID);
            }
            if (is_checked === true) {
                elePurchaseRequest.empty();
                elePurchaseRequest.append(eleAppend);
            } else {
                elePurchaseRequest.empty();
            }
        }
        GRLoadDataHandle.PRDataEle.val(JSON.stringify(purchase_requests_data));
        let eleMergeProduct = $('#merge-same-product');
        if (eleMergeProduct[0].checked === true) {
            eleMergeProduct.click();
        }
        return true;
    };

    static loadTableProductByPurchaseRequest() {
        let tablePurchaseOrderProductRequest = $('#datable-purchase-order-product-request');
        let tablePurchaseOrderProductAdd = $('#datable-purchase-order-product-add');
        let data = setupMergeProduct();
        if (tablePurchaseOrderProductRequest[0].hasAttribute('hidden')) {
            tablePurchaseOrderProductAdd[0].setAttribute('hidden', 'true');
            $('#datable-purchase-order-product-add_wrapper')[0].setAttribute('hidden', 'true');
            tablePurchaseOrderProductRequest[0].removeAttribute('hidden');
            $('#datable-purchase-order-product-request_wrapper')[0].removeAttribute('hidden');
        }
        if (data.length > 0) {
            tablePurchaseOrderProductRequest.DataTable().clear().draw();
            tablePurchaseOrderProductRequest.DataTable().rows.add(data).draw();
            GRLoadDataHandle.loadDataRowTable(tablePurchaseOrderProductRequest);
        } else {
            tablePurchaseOrderProductRequest.DataTable().clear().draw();
            tablePurchaseOrderProductRequest.DataTable().rows.add(data).draw();
        }
        // restart totals
        let elePretaxAmount = document.getElementById('purchase-order-product-pretax-amount');
        let eleTaxes = document.getElementById('purchase-order-product-taxes');
        let eleTotal = document.getElementById('purchase-order-product-total');
        let elePretaxAmountRaw = document.getElementById('purchase-order-product-pretax-amount-raw');
        let eleTaxesRaw = document.getElementById('purchase-order-product-taxes-raw');
        let eleTotalRaw = document.getElementById('purchase-order-product-total-raw');
        let finalRevenueBeforeTax = document.getElementById('purchase-order-final-revenue-before-tax');
        $(elePretaxAmount).attr('data-init-money', String(0));
        elePretaxAmountRaw.value = 0;
        finalRevenueBeforeTax.value = 0;
        $(eleTaxes).attr('data-init-money', String(0));
        eleTaxesRaw.value = 0;
        $(eleTotal).attr('data-init-money', String(0));
        eleTotalRaw.value = 0;
        $.fn.initMaskMoney2();
        return true;
    };

    static loadDataRowTable($table) {
        if (!$table[0].querySelector('.dataTables_empty')) {
            for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
                let row = $table[0].tBodies[0].rows[i];
                let table_id = $table[0].id;
                GRLoadDataHandle.loadDataRow(row, table_id);
            }
        }
    };

    static loadDataRow(row, table_id) {
        // mask money
        $.fn.initMaskMoney2();
        let dataRowRaw = row.querySelector('.table-row-order').getAttribute('data-row');
        if (dataRowRaw) {
            let dataRow = JSON.parse(dataRowRaw);
            GRLoadDataHandle.loadBoxProduct($(row.querySelector('.table-row-item')), dataRow?.['product']);
            GRLoadDataHandle.loadBoxUOM($(row.querySelector('.table-row-uom-order-actual')), dataRow?.['uom_order_request'], dataRow?.['uom_order_request']?.['uom_group']?.['id']);
            GRLoadDataHandle.loadBoxTax($(row.querySelector('.table-row-tax')), dataRow?.['tax']);
        }
    };

    // LOAD DETAIL
    static loadDetailPage(data) {
        $('#data-detail-page').val(JSON.stringify(data));
        $('#purchase-order-title').val(data?.['title']);
        document.getElementById('purchase-order-code').innerHTML = data?.['code'];
        let eleStatus = $('#purchase-order-status');
        let status_data = {
            "Draft": "badge badge-soft-light",
            "Created": "badge badge-soft-primary",
            "Added": "badge badge-soft-info",
            "Finish": "badge badge-soft-success",
            "Cancel": "badge badge-soft-danger",
        }
        let statusHTML = `<span class="${status_data[data?.['system_status']]}">${data?.['system_status']}</span>`;
        eleStatus.empty();
        eleStatus.append(statusHTML);
        $('#purchase-order-date-delivered').val(moment(data?.['date_created']).format('DD/MM/YYYY hh:mm A'));
        GRLoadDataHandle.loadDataShowPRPQ(data);
        PODataTableHandle.dataTablePurchaseRequest();
        GRLoadDataHandle.loadModalPurchaseRequestProductTable(false, data);
        GRLoadDataHandle.loadModalPurchaseQuotation(false, data);
        GRLoadDataHandle.loadBoxSupplier(data?.['supplier']);
        GRLoadDataHandle.loadBoxContact(data?.['contact']);
        GRLoadDataHandle.loadTablesDetailPage(data);
        GRLoadDataHandle.loadTotals(data);
    };

    static loadDataShowPRPQ(data) {
        let from = $('#frm_purchase_order_create');
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        let elePRAppend = ``;
        let purchase_requests_data = [];
        let elePurchaseQuotation = $('#purchase-order-purchase-quotation');
        let elePQAppend = ``;
        let purchase_quotations_data = [];
        // PR
        for (let dataPR of data?.['purchase_requests_data']) {
            let prID = dataPR?.['id'];
            let prCode = dataPR?.['code'];
            let link = "";
            let linkDetail = elePurchaseRequest.attr('data-link-detail');
            link = linkDetail.format_url_with_uuid(prID);
            if (from.attr('data-method') === 'GET') {
                elePRAppend += `<div class="inline-elements-badge mr-2 mb-1">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span>${prCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" data-id="${prID}" aria-label="Close" disabled>
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
            } else {
                elePRAppend += `<div class="inline-elements-badge mr-2 mb-1">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span>${prCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" data-id="${prID}" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
            }
            purchase_requests_data.push(prID);
        }
        elePurchaseRequest.append(elePRAppend);
        GRLoadDataHandle.PRDataEle.val(JSON.stringify(purchase_requests_data));
        // PQ
        for (let dataPQ of data?.['purchase_quotations_data']) {
            let pqID = dataPQ?.['purchase_quotation']?.['id'];
            let pqCode = dataPQ?.['purchase_quotation']?.['code'];
            let pqSupplier = dataPQ?.['purchase_quotation']?.['supplier'];
            let pqSupplierStr = JSON.stringify(pqSupplier).replace(/"/g, "&quot;");
            let link = "";
            let linkDetail = elePurchaseQuotation.attr('data-link-detail');
            link = linkDetail.format_url_with_uuid(pqID);
            if (from.attr('data-method') === 'GET') {
                if (dataPQ?.['is_use'] === false) {
                    elePQAppend += `<div class="inline-elements-badge mr-2 mb-1">
                                    <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" disabled>
                                    <a href="${link}" target="_blank" class="link-primary underline_hover ml-3"><span>${pqCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" data-id="${pqID}" aria-label="Close" disabled>
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                } else {
                    elePQAppend += `<div class="inline-elements-badge mr-2 mb-1">
                                    <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" checked disabled>
                                    <a href="${link}" target="_blank" class="link-primary underline_hover ml-3"><span>${pqCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" data-id="${pqID}" aria-label="Close" disabled>
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                }
            } else {
                if (dataPQ?.['is_use'] === false) {
                    elePQAppend += `<div class="inline-elements-badge mr-2 mb-1">
                                    <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover ml-3"><span>${pqCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" data-id="${pqID}" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                } else {
                    elePQAppend += `<div class="inline-elements-badge mr-2 mb-1">
                                    <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" checked>
                                    <a href="${link}" target="_blank" class="link-primary underline_hover ml-3"><span>${pqCode}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" data-id="${pqID}" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                }
            }
            purchase_quotations_data.push({
                'purchase_quotation': pqID,
                'is_use': dataPQ?.['is_use']
            })
        }
        elePurchaseQuotation.append(elePQAppend);
        GRLoadDataHandle.PQDataEle.val(JSON.stringify(purchase_quotations_data));
    };

    static loadPRProductNotInPO(data) {
        let PRProductIDList = [];
        for (let PRProduct of data?.['purchase_request_products_data']) {
            PRProductIDList.push(PRProduct?.['purchase_request_product_id'])
        }
        let PQCode = null;
        for (let PQ of data?.['purchase_quotations_data']) {
            if (PQ?.['is_use'] === true) {
                PQCode = PQ?.['purchase_quotation']?.['code'];
                break
            }
        }
        let table = $('#datable-purchase-request-product');
        for (let eleChecked of table[0].querySelectorAll('.table-row-checkbox:checked')) {
            let row = eleChecked.closest('tr');
            let dataRowRaw = row.querySelector('.table-row-order').getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                if (PRProductIDList.includes(dataRow?.['id'])) {
                    eleChecked.classList.add('disabled-by-pq');
                    eleChecked.setAttribute('disabled', 'true');
                    row.querySelector('.table-row-quantity-order').setAttribute('disabled', 'true');
                    $(row).css('background-color', '#f7f7f7');
                    row.setAttribute('data-bs-toggle', 'tooltip');
                    row.setAttribute('data-bs-placement', 'top');
                    row.setAttribute('title', $.fn.transEle.attr('data-product-not-in') + ' ' + PQCode);
                }
            }
        }
    };

    static loadTablesDetailPage(data) {
        let form = $('#frm_purchase_order_create');
        let tableProductAdd = $('#datable-purchase-order-product-add');
        let tableProductRequest = $('#datable-purchase-order-product-request');
        if (data?.['purchase_requests_data']) {
            tableProductAdd[0].setAttribute('hidden', 'true');
            $('#datable-purchase-order-product-add_wrapper')[0].setAttribute('hidden', 'true');
            tableProductRequest[0].removeAttribute('hidden');
            $('#datable-purchase-order-product-request_wrapper')[0].removeAttribute('hidden');
            tableProductRequest.DataTable().rows.add(data?.['purchase_order_products_data']).draw();
            GRLoadDataHandle.loadDataRowTable(tableProductRequest);
            if (form.attr('data-method') === 'GET') {
                GRLoadDataHandle.loadTableDisabled(tableProductRequest);
            }
        }
    };

    static loadTotals(data) {
        let elePretaxAmount = document.getElementById('purchase-order-product-pretax-amount');
        let eleTaxes = document.getElementById('purchase-order-product-taxes');
        let eleTotal = document.getElementById('purchase-order-product-total');
        let elePretaxAmountRaw = document.getElementById('purchase-order-product-pretax-amount-raw');
        let eleTaxesRaw = document.getElementById('purchase-order-product-taxes-raw');
        let eleTotalRaw = document.getElementById('purchase-order-product-total-raw');
        let finalRevenueBeforeTax = document.getElementById('purchase-order-final-revenue-before-tax');
        $(elePretaxAmount).attr('data-init-money', String(data?.['total_product_pretax_amount']));
        elePretaxAmountRaw.value = data?.['total_product_pretax_amount'];
        $(eleTaxes).attr('data-init-money', String(data?.['total_product_tax']));
        eleTaxesRaw.value = data?.['total_product_tax'];
        $(eleTotal).attr('data-init-money', String(data?.['total_product']));
        eleTotalRaw.value = data?.['total_product'];
        finalRevenueBeforeTax.value = data?.['total_product_revenue_before_tax'];
    };

    static loadTableDisabled(table) {
        for (let ele of table[0].querySelectorAll('.table-row-item')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-custom-show');
        }
        for (let ele of table[0].querySelectorAll('.table-row-uom-order-actual')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-custom-show');
        }
        for (let ele of table[0].querySelectorAll('.table-row-quantity-order-actual')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-custom-show');
        }
        for (let ele of table[0].querySelectorAll('.table-row-price')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-custom-show');
        }
        for (let ele of table[0].querySelectorAll('.input-group-price')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-tax')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-custom-show');
        }
        for (let ele of table[0].querySelectorAll('.table-row-checkbox')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-quantity-order')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.del-row')) {
            ele.setAttribute('disabled', 'true');
        }
    };

}

// DataTable
class GRDataTableHandle {
    static productInitEle = $('#data-init-product');
    static uomInitEle = $('#data-init-uom');
    static taxInitEle = $('#data-init-tax');

    static dataTableGoodReceiptPOProduct(data) {
        let $table = $('#datable-good-receipt-po-product');
        $table.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        data-id="${row.id}"
                                        data-row="${dataRow}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-item">${row?.['product']?.['title']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['uom_order_actual']?.['title']}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row?.['product_quantity_order_actual']}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-received">${row?.['quantity_received'] ? row?.['quantity_received'] : 0}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-remain">${row?.['quantity_remain'] ? row?.['quantity_remain'] : 0}</span>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-import">${row?.['quantity_import'] ? row?.['quantity_import'] : 0}</span>`;
                    }
                },
            ],
            drawCallback: function () {},
        });
    };

    static dataTableGoodReceiptPR(data) {
        let $table = $('#datable-good-receipt-purchase-request');
        $table.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        data-id="${row.id}" 
                                        data-row="${dataRow}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-item">${row?.['purchase_request_product']?.['purchase_request']?.['code']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['purchase_request_product']?.['uom']?.['title']}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row?.['quantity_order']}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-received">${row?.['quantity_received'] ? row?.['quantity_received'] : 0}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-remain">${row?.['quantity_remain'] ? row?.['quantity_remain'] : 0}</span>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-import">${row?.['quantity_import'] ? row?.['quantity_import'] : 0}</span>`;
                    }
                },
            ],
            drawCallback: function () {},
        });
    };

    static dataTableGoodReceiptWH(data) {
        let $table = $('#datable-good-receipt-warehouse');
        $table.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        data-id="${row.id}" 
                                        data-row="${dataRow}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['code']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-item">${row?.['title']}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-note">${row?.['remark'] ? row?.['remark'] : ''}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-import validated-number" value="${row?.['quantity'] ? row?.['quantity'] : 0}" required>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {},
        });
    };

    static dataTableGoodReceiptProduct(data) {
        let $table = $('#datable-good-receipt-product');
        $table.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" id="${row.id}" data-row="${dataRow}">${row.order}</span>`
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
                                            <select
                                                class="form-select table-row-item"
                                                data-product-id="${row?.['product']?.['id']}"
                                                data-url="${GRDataTableHandle.productInitEle.attr('data-url')}"
                                                data-link-detail="${GRDataTableHandle.productInitEle.attr('data-link-detail')}"
                                                data-method="${GRDataTableHandle.productInitEle.attr('data-method')}"
                                                data-keyResp="product_sale_list"
                                                required
                                                disabled
                                            >
                                            </select>
                                        </span>
                                    </div>
                                </div>`;
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
                    render: () => {
                        return `<div class="row">
                                    <select 
                                        class="form-control table-row-uom"
                                        data-url="${GRDataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${GRDataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        required
                                    >
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-quantity validated-number" value="${row.product_quantity}" required>
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <div class="dropdown">
                                        <div class="input-group dropdown-action input-group-price" aria-expanded="false" data-bs-toggle="dropdown">
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
                                    </div>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<div class="row">
                                <select 
                                    class="form-control table-row-tax"
                                    data-url="${GRDataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${GRDataTableHandle.taxInitEle.attr('data-method')}"
                                    data-keyResp="tax_list"
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
                                >
                            </div>`;
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<div class="row subtotal-area">
                                    <div class="card card-sm">
                                        <span class="card-body mask-money table-row-subtotal" data-init-money="${parseFloat(row.product_subtotal_price)}"></span>
                                    </div>
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

// Calculate
class GRCalculateHandle {
    static calculateTotal(table) {
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
    };

    static calculateRow(row) {
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
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax.hasOwnProperty('rate')) {
                    tax = parseInt(dataTax.rate);
                }
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
            $(eleSubtotal).attr('data-init-money', String(subtotal));
            eleSubtotalRaw.value = subtotal;
        }
        $.fn.initMaskMoney2();
        return true;
    };

    static calculateMain(table, row) {
        let self = this;
        self.calculateRow(row);
        // calculate total
        self.calculateTotal(table[0]);
        return true;
    };

    static calculateTable(table) {
        let self = this;
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            self.calculateMain(table, row)
        }
    };
}

// Validate
class GRValidateHandle {
    static validateNumber(ele) {
        let value = ele.value;
        // Replace non-digit characters with an empty string
        value = value.replace(/[^0-9.]/g, '');
        // Remove unnecessary zeros from the integer part
        value = value.replace("-", "").replace(/^0+(?=\d)/, '');
        // Update value of input
        ele.value = value;
    };

    static validateQuantityOrderAndRemain(ele, remain) {
        if (parseFloat(ele.value) > remain) {
            ele.value = '0';
            $.fn.notifyB({description: 'Quantity order must be less than quantity remain'}, 'failure');
        }
    };

    static validateQuantityOrderAndUpdateStock(row) {
        let eleQuantityRequest = row.querySelector('.table-row-quantity-order-request');
        let eleQuantityOrder = row.querySelector('.table-row-quantity-order-actual');
        let eleStock = row.querySelector('.table-row-stock');
        let quantity_request = eleQuantityRequest.innerHTML;
        let quantity_order = eleQuantityOrder.value;

        if (parseFloat(quantity_order) < parseFloat(quantity_request)) {
            eleQuantityOrder.value = quantity_request;
            eleStock.innerHTML = '0';
            $.fn.notifyB({description: 'Quantity order actually must be equal or greater than quantity order on request'}, 'failure');
            return false
        } else {
            let dataRowRaw = row.querySelector('.table-row-order').getAttribute('data-row');
            let eleUOMOrder = row.querySelector('.table-row-uom-order-actual');
            if (dataRowRaw && $(eleUOMOrder).val()) {
                let dataRow = JSON.parse(dataRowRaw);
                let uomRequestData = dataRow?.['uom_order_request'];
                let uomOrderData = SelectDDControl.get_data_from_idx($(eleUOMOrder), $(eleUOMOrder).val());
                if (uomRequestData?.['id'] === uomOrderData?.['id']) { // IF COMMON UOM
                    eleStock.innerHTML = String(parseFloat(quantity_order) - parseFloat(quantity_request));
                } else { // IF DIFFERENT UOM
                    let uomRequestExchangeRate = 1;
                    let uomOrderExchangeRate = 1;
                    if (uomRequestData?.['is_referenced_unit'] === false) {
                        uomRequestExchangeRate = uomRequestData?.['ratio'];
                    }
                    if (uomOrderData?.['group']?.['is_referenced_unit'] === false) {
                        uomOrderExchangeRate = uomOrderData?.['ratio'];
                    }
                    let differenceExchangeValue = (parseFloat(quantity_order) * uomOrderExchangeRate) - (parseFloat(quantity_request) * uomRequestExchangeRate);
                    eleStock.innerHTML = String(differenceExchangeValue / uomRequestExchangeRate);
                }
            }
        }
        return true
    };
}

// Submit Form
class GRSubmitHandle {

    static setupDataPRProduct() {
        let result = []
        let table = $('#datable-purchase-request-product');
        for (let eleChecked of table[0].querySelectorAll('.disabled-by-pq')) {
            let sale_order_id = eleChecked.getAttribute('data-sale-order-product-id');
            if (sale_order_id === "null") {
                sale_order_id = null;
            }
            let row = eleChecked.closest('tr');
            let quantity_order = parseFloat(row.querySelector('.table-row-quantity-order').value);
            let dataRowRaw = row.querySelector('.table-row-order').getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                result.push({
                    'purchase_request_product': dataRow?.['id'],
                    'sale_order_product': sale_order_id,
                    'quantity_order': quantity_order,
                    // 'quantity_remain': parseFloat(dataRow?.['remain_for_purchase_order']),
                })
            }
        }
        return result;
    };

    static setupDataProduct() {
        let result = [];
        let table = document.getElementById('datable-purchase-order-product-add');
        if (document.getElementById('purchase-order-purchase-request').innerHTML) {
            table = document.getElementById('datable-purchase-order-product-request');
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
                let dataInfo = {}
                if ($(eleProduct).val()) {
                    dataInfo = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                }
                if (dataInfo) {
                    rowData['product'] = dataInfo.id;
                    rowData['product_title'] = dataInfo.title;
                    rowData['product_code'] = dataInfo.code;
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
                if ($(eleUOMOrder).val()) {
                    let dataInfo = SelectDDControl.get_data_from_idx($(eleUOMOrder), $(eleUOMOrder).val());
                    if (dataInfo) {
                        rowData['uom_order_actual'] = dataInfo.id;
                    }
                }
                let eleTax = row.querySelector('.table-row-tax');
                if ($(eleTax).val()) {
                    let dataInfo = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                    if (dataInfo) {
                        rowData['tax'] = dataInfo.id;
                        rowData['product_tax_title'] = dataInfo.title;
                        rowData['product_tax_value'] = dataInfo.rate;
                    } else {
                        rowData['product_tax_value'] = 0;
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
                let stock = row.querySelector('.table-row-stock');
                if (stock) {
                    rowData['stock'] = parseFloat(stock.innerHTML);
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
                    if (eleOrder.getAttribute('data-row')) {
                        let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                        rowData['purchase_request_products_data'] = dataRow?.['purchase_request_products_data'];
                    }
                }
            }
            result.push(rowData);
        }
        return result
    };

    static setupDataSubmit(_form) {
        if (GRLoadDataHandle.PRDataEle.val()) {
            _form.dataForm['purchase_requests_data'] = JSON.parse(GRLoadDataHandle.PRDataEle.val());
        }
        let pr_products_data_setup = POSubmitHandle.setupDataPRProduct();
        if (pr_products_data_setup.length > 0) {
            _form.dataForm['purchase_request_products_data'] = pr_products_data_setup;
        }
        let dateDeliveredVal = $('#purchase-order-date-delivered').val();
        if (dateDeliveredVal) {
            _form.dataForm['delivered_date'] = moment(dateDeliveredVal,
                'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss')
        }
        _form.dataForm['status_delivered'] = 0;
        let products_data_setup = POSubmitHandle.setupDataProduct();
        if (products_data_setup.length > 0) {
            _form.dataForm['purchase_order_products_data'] = products_data_setup;
        }
        _form.dataForm['total_product_pretax_amount'] = parseFloat($('#purchase-order-product-pretax-amount-raw').val());
        _form.dataForm['total_product_tax'] = parseFloat($('#purchase-order-product-taxes-raw').val());
        _form.dataForm['total_product'] = parseFloat($('#purchase-order-product-total-raw').val());
        _form.dataForm['total_product_revenue_before_tax'] = parseFloat(GRLoadDataHandle.finalRevenueBeforeTax.value);
        // system fields
        if (_form.dataMethod === "POST") {
            _form.dataForm['system_status'] = 1;
        }
    };
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
        let uom_reference = {};
        let tax = {};
        // Setup Merge Data by Product
        for (let eleChecked of table[0].querySelectorAll('.table-row-checkbox:checked:not(.disabled-by-pq)')) {
            let row = eleChecked.closest('tr');
            let sale_order_id = eleChecked.getAttribute('data-sale-order-product-id');
            if (sale_order_id === "null") {
                sale_order_id = null;
            }
            let dataRowRaw = row.querySelector('.table-row-order').getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                if (Object.keys(uom_reference).length === 0) {
                    uom_reference = dataRow?.['uom']?.['uom_group']?.['uom_reference'];
                }
                let tax = dataRow?.['tax'];
                let product_id = dataRow?.['product']?.['id'];
                let quantity = parseFloat(dataRow?.['quantity']);
                let quantity_order = parseFloat(row.querySelector('.table-row-quantity-order').value);
                if (dataRow?.['uom']?.['id'] !== uom_reference?.['id']) {
                    quantity = (parseFloat(dataRow?.['quantity']) * parseFloat(dataRow?.['uom']?.['ratio']));
                    quantity_order = (parseFloat(row.querySelector('.table-row-quantity-order').value) * parseFloat(dataRow?.['uom']?.['ratio']));
                }
                let remain = (quantity_order - quantity);
                if (!dataJson.hasOwnProperty(product_id)) {
                    order++
                    dataJson[product_id] = {
                        'id': dataRow?.['id'],
                        'purchase_request_products_data': [{
                            'purchase_request_product': dataRow?.['id'],
                            'sale_order_product': sale_order_id,
                            'quantity_order': quantity_order,
                            'quantity_remain': parseFloat(dataRow?.['remain_for_purchase_order']),
                        }],
                        'product': dataRow?.['product'],
                        'uom_order_request': uom_reference,
                        'uom_order_actual': uom_reference,
                        'tax': tax,
                        'stock': 0,
                        'product_title': dataRow?.['product']?.['title'],
                        'code_list': [dataRow?.['purchase_request']?.['code']],
                        'product_description': 'xxxxx',
                        'product_quantity_request': quantity,
                        'product_quantity_order_request': quantity_order,
                        'product_quantity_order_actual': quantity_order,
                        'remain': remain,
                        'product_unit_price': 0,
                        'product_tax_title': '',
                        'product_tax_amount': 0,
                        'product_subtotal_price': 0,
                        'order': order,
                    };
                } else {
                    if (!dataJson[product_id].code_list.includes(dataRow?.['purchase_request']?.['code'])) {
                        dataJson[product_id].code_list.push(dataRow?.['purchase_request']?.['code']);
                    }
                    dataJson[product_id].purchase_request_products_data.push({
                        'purchase_request_product': dataRow?.['id'],
                        'sale_order_product': sale_order_id,
                        'quantity_order': quantity_order,
                        'quantity_remain': parseFloat(dataRow?.['remain_for_purchase_order']),
                    });
                    dataJson[product_id].product_quantity_request += quantity;
                    dataJson[product_id].product_quantity_order_request += quantity_order;
                    dataJson[product_id].remain += remain;
                    dataJson[product_id].product_quantity_order_actual += quantity_order;
                }
            }
        }
        for (let key in dataJson) {
            data.push(dataJson[key]);
        }
    }
    return data
}
