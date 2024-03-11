// LoadData
class POLoadDataHandle {
    static supplierSelectEle = $('#box-purchase-order-supplier');
    static contactSelectEle = $('#box-purchase-order-contact');
    static PRDataEle = $('#purchase_requests_data');
    static PQDataEle = $('#purchase_quotations_data');
    static eleDivTablePOProductRequest = $('#table-purchase-order-product-request-area');
    static eleDivTablePOProductAdd = $('#table-purchase-order-product-add-area');
    static eleDivTablePRProduct = $('#table-purchase-request-product-area');
    static eleDivTablePRProductMerge = $('#table-purchase-request-product-merge-area');
    static transEle = $('#app-trans-factory');

    static loadBoxSupplier(dataCustomer = {}) {
        let ele = POLoadDataHandle.supplierSelectEle;
        ele.initSelect2({
            data: dataCustomer,
            'dataParams': {'account_types_mapped__account_type_order': 1},
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['name'] || '';
            },
        });
    };

    static loadBoxContact(dataContact = {}, supplierID = null) {
        let ele = POLoadDataHandle.contactSelectEle;
        ele.initSelect2({
            data: dataContact,
            'dataParams': {'account_name_id': supplierID},
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['fullname'] || '';
            },
        });
    };

    static loadInitProduct() {
        let finalData = [];
        let ele = PODataTableHandle.productInitEle;
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
                        for (let product of data.product_sale_list) {
                            if (product.hasOwnProperty('product_choice') && Array.isArray(product.product_choice)) {
                                if (product['product_choice'].includes(2)) {
                                    finalData.push(product);
                                }
                            }
                        }
                        ele.val(JSON.stringify(finalData));
                    }
                }
            }
        )
    };

    static loadBoxProduct(ele, dataProduct = {}) {
        let dataDD = []
        if (PODataTableHandle.productInitEle.val()) {
            dataDD = JSON.parse(PODataTableHandle.productInitEle.val());
        }
        if (Object.keys(dataProduct).length > 0) {
            dataDD = dataProduct
        }
        ele.initSelect2({
            data: dataDD,
        });
    };

    static loadDataProductSelect(ele, is_change_item = true) {
        if (ele.val()) {
            let data = SelectDDControl.get_data_from_idx(ele, ele.val());
            if (data) {
                ele.attr('data-product-id', data?.['id']);
                data['unit_of_measure'] = data?.['purchase_information']?.['uom'];
                data['uom_group'] = data?.['general_information']?.['uom_group'];
                data['tax'] = data?.['purchase_information']?.['tax'];
                let description = ele[0].closest('tr').querySelector('.table-row-description');
                let uom = ele[0].closest('tr').querySelector('.table-row-uom-order-actual');
                let tax = ele[0].closest('tr').querySelector('.table-row-tax');
                // load Description
                if (description) {
                    description.innerHTML = data?.['description'];
                }
                // load UOM
                if (uom && Object.keys(data?.['unit_of_measure']).length !== 0 && Object.keys(data?.['uom_group']).length !== 0) {
                    POLoadDataHandle.loadBoxUOM($(uom), data?.['unit_of_measure'], data?.['uom_group']?.['id']);
                } else {
                    POLoadDataHandle.loadBoxUOM($(uom));
                }
                // load TAX
                if (tax && data?.['tax']) {
                    POLoadDataHandle.loadBoxTax($(tax), data?.['tax']);
                } else {
                    POLoadDataHandle.loadBoxTax($(tax));
                }
            }
            $.fn.initMaskMoney2();
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

    static loadModalPurchaseRequestTable(is_clear_all = false) {
        let tablePurchaseRequest = $('#datable-purchase-request');
        if (is_clear_all === false) {
            if (tablePurchaseRequest[0].querySelector('.dataTables_empty')) {
                tablePurchaseRequest.DataTable().clear().destroy();
                PODataTableHandle.dataTablePurchaseRequest();
            }
        } else {
            tablePurchaseRequest.DataTable().clear().destroy();
            PODataTableHandle.dataTablePurchaseRequest();
        }
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
                    checked_data[PRProduct?.['purchase_request_product']?.['id']] = {
                        'id': PRProduct?.['purchase_request_product']?.['id'],
                        'quantity_order': PRProduct?.['quantity_order'],
                    }
                }
            }
            for (let PRProduct of dataDetail?.['purchase_request_products_data']) {
                checked_data[PRProduct?.['purchase_request_product']?.['id']] = {
                    'id': PRProduct?.['purchase_request_product']?.['id'],
                    'quantity_order': PRProduct?.['quantity_order'],
                }
            }
            if (POLoadDataHandle.PRDataEle.val()) {
                for (let prId of JSON.parse(POLoadDataHandle.PRDataEle.val())) {
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
                                POLoadDataHandle.loadPRProductNotInPO(dataDetail);
                            }
                            if (is_remove === true) {
                                POLoadDataHandle.loadDataShowPurchaseRequest();
                                POLoadDataHandle.loadTableProductByPurchaseRequest();
                                POLoadDataHandle.loadModalPurchaseQuotation(true);
                            }
                        }
                    }
                }
            )
        } else {
            POLoadDataHandle.loadDataShowPurchaseRequest();
            POLoadDataHandle.loadTableProductByPurchaseRequest();
            POLoadDataHandle.loadModalPurchaseQuotation(true);
        }
        return true;
    };

    static loadOrHiddenMergeProductTable() {
        let eleCheckbox = $('#merge-same-product');
        if (eleCheckbox[0].checked === true) {
            POLoadDataHandle.eleDivTablePRProduct[0].setAttribute('hidden', 'true');
            POLoadDataHandle.eleDivTablePRProductMerge[0].removeAttribute('hidden');
            POLoadDataHandle.loadDataMergeProductTable();
        } else {
            POLoadDataHandle.eleDivTablePRProductMerge[0].setAttribute('hidden', 'true');
            POLoadDataHandle.eleDivTablePRProduct[0].removeAttribute('hidden');
        }
        return true;
    };

    static loadDataMergeProductTable() {
        let tableMerged = $('#datable-purchase-request-product-merge');
        tableMerged.DataTable().clear().draw();
        let data = setupMergeProduct();
        tableMerged.DataTable().rows.add(data).draw();
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
                eleAppend += `<div class="chip chip-outline-primary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                    <span>
                                        <a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${prCode}</span></a>
                                        <button type="button" class="btn-close custom-btn-remove" data-id="${prID}"></button>
                                    </span>
                                </div>`;
                purchase_requests_data.push(prID);
            }
            elePurchaseRequest.empty();
            if (is_checked === true) {
                elePurchaseRequest.append(eleAppend);
            }
        }
        if (purchase_requests_data.length > 0) {
            POLoadDataHandle.PRDataEle.val(JSON.stringify(purchase_requests_data));
        } else {
            POLoadDataHandle.PRDataEle.val('');
        }
        // clear supplier, contact
        POLoadDataHandle.supplierSelectEle.empty();
        POLoadDataHandle.loadBoxSupplier();
        POLoadDataHandle.contactSelectEle.empty();
        POLoadDataHandle.loadBoxContact();
        // reset PQ
        let $tablePQ = $('#datable-purchase-quotation');
        $tablePQ.DataTable().clear().draw();
        POLoadDataHandle.loadModalPurchaseQuotation();
        let $elePQ = $('#purchase-order-purchase-quotation');
        $elePQ.empty();
        POLoadDataHandle.PQDataEle.val('');
        // uncheck merge product
        let eleMergeProduct = $('#merge-same-product');
        if (eleMergeProduct[0].checked === true) {
            eleMergeProduct.click();
        }
        return true;
    };

    static loadModalPurchaseQuotation(is_remove = false, dataDetail = null) {
        let tablePurchaseQuotation = $('#datable-purchase-quotation');
        let checked_data = {};
        if (dataDetail) {
            for (let PQ of dataDetail?.['purchase_quotations_data']) {
                checked_data[PQ?.['purchase_quotation']?.['id']] = {
                    'id': PQ?.['purchase_quotation']?.['id'],
                    'is_use': PQ?.['is_use'],
                };
            }
        }
        if (!tablePurchaseQuotation[0].querySelector('.dataTables_empty')) {
            for (let eleChecked of tablePurchaseQuotation[0].querySelectorAll('.table-row-checkbox:checked')) {
                checked_data[eleChecked.getAttribute('data-id')] = {
                    'id': eleChecked.getAttribute('data-id'),
                    'is_use': false,
                };
            }
        }
        let frm = new SetupFormSubmit(tablePurchaseQuotation);
        let dataFilter = {};
        // by Supplier
        if (POLoadDataHandle.supplierSelectEle.val()) {
            dataFilter = {'supplier_mapped_id': POLoadDataHandle.supplierSelectEle.val()}
        }
        // by PR
        // let purchase_requests_data = POLoadDataHandle.PRDataEle;
        // if (purchase_requests_data.val()) {
        //     let purchase_requests_data_parse = JSON.parse(purchase_requests_data.val());
        //     if (Array.isArray(purchase_requests_data_parse)) {
        //         if (purchase_requests_data_parse.length > 0) {
        //             dataFilter = {'purchase_quotation_request_mapped__purchase_request_mapped__id__in': purchase_requests_data_parse.join(',')};
        //         }
        //     }
        // }
        $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': dataFilter,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('purchase_quotation_list') && Array.isArray(data.purchase_quotation_list)) {
                        if (Object.keys(checked_data).length !== 0) {
                            for (let PQ of data.purchase_quotation_list) {
                                if (checked_data.hasOwnProperty(PQ.id)) {
                                    PQ['is_checked'] = true;
                                    PQ['is_use'] = checked_data[PQ.id]?.['is_use'];
                                }
                            }
                        }
                        tablePurchaseQuotation.DataTable().clear().draw();
                        tablePurchaseQuotation.DataTable().rows.add(data.purchase_quotation_list).draw();
                        if (is_remove === true) {
                            POLoadDataHandle.loadDataShowPurchaseQuotation();
                            POLoadDataHandle.loadPriceListByPurchaseQuotation();
                        }
                    }
                }
            }
        )
        return true;
    };

    static loadDataShowPurchaseQuotation() {
        let elePurchaseQuotation = $('#purchase-order-purchase-quotation');
        let tablePurchaseQuotation = $('#datable-purchase-quotation');
        let purchase_quotations_data = [];
        let eleAppend = ``;
        let is_check = false;
        let checked_id = null;
        if (elePurchaseQuotation[0].innerHTML) {
            for (let eleChecked of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation:checked')) {
                checked_id = eleChecked.getAttribute('data-id');
            }
        }
        for (let eleChecked of tablePurchaseQuotation[0].querySelectorAll('.table-row-checkbox:checked')) {
            is_check = true;
            let pqID = eleChecked.getAttribute('data-id');
            let pqCode = eleChecked.closest('tr').querySelector('.table-row-code').innerHTML;
            let pqSupplier = JSON.parse(eleChecked.closest('tr').querySelector('.table-row-supplier').getAttribute('data-supplier'));
            let pqSupplierStr = JSON.stringify(pqSupplier).replace(/"/g, "&quot;");
            let link = "";
            let linkDetail = elePurchaseQuotation.attr('data-link-detail');
            link = linkDetail.format_url_with_uuid(pqID);
            eleAppend += `<div class="chip chip-outline-primary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                <span>
                                    <div class="form-check">
                                        <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1">
                                        <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                    </div>
                                    <button type="button" class="btn-close custom-btn-remove" data-id="${pqID}"></button>
                                </span>
                            </div>`;
            purchase_quotations_data.push({
                'purchase_quotation': pqID,
                'is_use': false
            })
        }
        if (is_check === true) {
            elePurchaseQuotation.empty();
            elePurchaseQuotation.append(eleAppend);
        } else {
            elePurchaseQuotation.empty();
        }
        POLoadDataHandle.PQDataEle.val(JSON.stringify(purchase_quotations_data));
        if (checked_id) {
            if (elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                for (let eleCheck of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                    if (eleCheck.getAttribute('data-id') === checked_id) {
                        eleCheck.checked = true;
                    }
                }
            }
        }
        return true;
    };

    static loadDataWhenRemovePR(ele) {
        let removeID = ele.getAttribute('data-id');
        let table = $('#datable-purchase-request');
        for (let eleChecked of table[0].querySelectorAll('.table-row-checkbox:checked')) {
            if (eleChecked.getAttribute('data-id') === removeID) {
                eleChecked.checked = false;
            }
        }
        POLoadDataHandle.loadModalPurchaseRequestProductTable(true);
    };

    static loadDataWhenRemovePQ(ele) {
        let removeID = ele.getAttribute('data-id');
        let table = $('#datable-purchase-quotation');
        let eleCheckbox = ele?.closest('.chip')?.querySelector('.checkbox-quotation');
        if (eleCheckbox) {
            if (eleCheckbox.checked === true) {
                eleCheckbox.checked = false;
                POLoadDataHandle.loadUpdateDataPQ(eleCheckbox);
                POLoadDataHandle.loadSupplierContactByCheckedQuotation(eleCheckbox);
                POLoadDataHandle.loadDataByCheckedQuotation(eleCheckbox);
            }
            for (let eleChecked of table[0].querySelectorAll('.table-row-checkbox:checked')) {
                if (eleChecked.getAttribute('data-id') === removeID) {
                    eleChecked.checked = false;
                }
            }
            POLoadDataHandle.loadDataShowPurchaseQuotation();
            POLoadDataHandle.loadPriceListByPurchaseQuotation();
        }
    };

    static loadTableProductByPurchaseRequest() {
        let $tableProductPR = $('#datable-purchase-order-product-request');
        let $tableProductAdd = $('#datable-purchase-order-product-add');
        // clear dataTable
        $tableProductPR.DataTable().clear().draw();
        $tableProductPR.DataTable().destroy();
        PODataTableHandle.dataTablePurchaseOrderProductRequest();
        $tableProductAdd.DataTable().clear().draw();
        let data = setupMergeProduct();
        POLoadDataHandle.eleDivTablePOProductAdd[0].setAttribute('hidden', 'true');
        POLoadDataHandle.eleDivTablePOProductRequest[0].removeAttribute('hidden');
        $tableProductPR.DataTable().rows.add(data).draw();
        if (data.length > 0) {
            POLoadDataHandle.loadDataRowTable($tableProductPR);
        }
        // restart totals
        let tableWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            let elePretaxAmount = tableFt.querySelector('.purchase-order-product-pretax-amount');
            let eleTaxes = tableFt.querySelector('.purchase-order-product-taxes');
            let eleTotal = tableFt.querySelector('.purchase-order-product-total');
            let elePretaxAmountRaw = tableFt.querySelector('.purchase-order-product-pretax-amount-raw');
            let eleTaxesRaw = tableFt.querySelector('.purchase-order-product-taxes-raw');
            let eleTotalRaw = tableFt.querySelector('.purchase-order-product-total-raw');
            let finalRevenueBeforeTaxRequest = tableFt.querySelector('.purchase-order-final-revenue-before-tax');
            $(elePretaxAmount).attr('data-init-money', String(0));
            elePretaxAmountRaw.value = 0;
            finalRevenueBeforeTaxRequest.value = 0;
            $(eleTaxes).attr('data-init-money', String(0));
            eleTaxesRaw.value = 0;
            $(eleTotal).attr('data-init-money', String(0));
            eleTotalRaw.value = 0;
        }
        $.fn.initMaskMoney2();
        return true;
    };

    static loadAddRowTableProductAdd() {
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
        POLoadDataHandle.eleDivTablePOProductRequest[0].setAttribute('hidden', 'true');
        POLoadDataHandle.eleDivTablePOProductAdd[0].removeAttribute('hidden');
        tablePurchaseOrderProductRequest.DataTable().clear().draw();
        let newRow = tablePurchaseOrderProductAdd.DataTable().row.add(data).draw().node();
        POLoadDataHandle.loadDataRow(newRow, 'datable-purchase-order-product-add');
        $(newRow.querySelector('.table-row-item')).val('').trigger('change');
        return true;
    };

    static loadDataRowTable($table) {
        if (!$table[0].querySelector('.dataTables_empty')) {
            for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
                let row = $table[0].tBodies[0].rows[i];
                let table_id = $table[0].id;
                POLoadDataHandle.loadDataRow(row, table_id);
            }
        }
    };

    static loadDataRow(row) {
        // mask money
        $.fn.initMaskMoney2();
        let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
        if (dataRowRaw) {
            let dataRow = JSON.parse(dataRowRaw);
            POLoadDataHandle.loadBoxProduct($(row.querySelector('.table-row-item')));
            $(row.querySelector('.table-row-item')).val(dataRow?.['product']?.['id']).trigger('change');
            POLoadDataHandle.loadBoxUOM($(row.querySelector('.table-row-uom-order-actual')), dataRow?.['uom_order_actual'], dataRow?.['uom_order_actual']?.['uom_group']?.['id']);
            POLoadDataHandle.loadBoxTax($(row.querySelector('.table-row-tax')), dataRow?.['tax']);
        }
    };

    static loadPriceListByPurchaseQuotation() {
        let eleQuotationProduct = $('#data-purchase-quotation-products');
        let PQIDList = [];
        let checked_id = null;
        let $table = $('#datable-purchase-order-product-add');
        if (POLoadDataHandle.PRDataEle.val()) { // PO PR products
            $table = $('#datable-purchase-order-product-request');
        }
        if (POLoadDataHandle.PQDataEle.val()) {
            for (let PQData of JSON.parse(POLoadDataHandle.PQDataEle.val())) {
                PQIDList.push(PQData?.['purchase_quotation']);
                if (PQData?.['is_use'] === true) {
                    checked_id = PQData?.['purchase_quotation'];
                }
            }
        }
        if (PQIDList.length > 0) { // Has PQ
            $.fn.callAjax2({
                    'url': eleQuotationProduct.attr('data-url'),
                    'method': eleQuotationProduct.attr('data-method'),
                    'data': {'purchase_quotation_id__in': PQIDList.join(',')},
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
                                if (!dataProduct.hasOwnProperty(result?.['product_id'])) {
                                    dataProduct[result?.['product_id']] = [{
                                        'purchase_quotation': result?.['purchase_quotation'],
                                        'unit_price': result?.['unit_price'],
                                        'uom': result?.['uom'],
                                    }]
                                } else {
                                    dataProduct[result?.['product_id']].push({
                                        'purchase_quotation': result?.['purchase_quotation'],
                                        'unit_price': result?.['unit_price'],
                                        'uom': result?.['uom'],
                                    })
                                }
                                // setup data to load again product by check PQ
                                if (!dataPQMapProducts.hasOwnProperty(result?.['purchase_quotation']?.['id'])) {
                                    dataPQMapProducts[result?.['purchase_quotation']?.['id']] = [result?.['product_id']];
                                } else {
                                    dataPQMapProducts[result?.['purchase_quotation']?.['id']].push(result?.['product_id']);
                                }
                            }
                            eleQuotationProduct.val(JSON.stringify(dataPQMapProducts));
                            $table.DataTable().rows().every(function () {
                                let row = this.node();
                                let eleUOM = row.querySelector('.table-row-uom-order-actual');
                                let priceListData = dataProduct[row.querySelector('.table-row-item').getAttribute('data-product-id')];
                                let elePrice = row.querySelector('.table-row-price');
                                let elePriceList = row.querySelector('.table-row-price-list');
                                if (priceListData) {
                                    elePrice.setAttribute('disabled', 'true');
                                    $(elePrice).attr('value', String(0));
                                    if (elePriceList) {
                                        $(elePriceList).empty();
                                        for (let price of priceListData) {
                                            let priceAppend = `<div class="dropdown-item disabled text-black border border-grey mb-1" id="${price?.['purchase_quotation']?.['id']}" data-value="${parseFloat(price?.['unit_price'])}">
                                                                    <div class="row">
                                                                        <div class="col-12 col-md-4 col-lg-4"><span>${price?.['purchase_quotation']?.['title']}</span></div>
                                                                        <div class="col-12 col-md-4 col-lg-4">
                                                                            <span
                                                                                class="mask-money" data-init-money="${parseFloat(price?.['unit_price'])}"
                                                                            ></span>
                                                                        </div>
                                                                        <div class="col-12 col-md-4 col-lg-4"><span>${price?.['uom']?.['title']}</span></div>
                                                                    </div>
                                                                </div>`
                                            if (price?.['purchase_quotation']?.['id'] === checked_id) { // If check PQ
                                                priceAppend = `<div class="dropdown-item disabled text-black border border-grey mb-1 bg-light" id="${price?.['purchase_quotation']?.['id']}" data-value="${parseFloat(price?.['unit_price'])}">
                                                                    <div class="row">
                                                                        <div class="col-12 col-md-4 col-lg-4"><span>${price?.['purchase_quotation']?.['title']}</span></div>
                                                                        <div class="col-12 col-md-4 col-lg-4">
                                                                            <span
                                                                                class="mask-money" data-init-money="${parseFloat(price?.['unit_price'])}"
                                                                            ></span>
                                                                        </div>
                                                                        <div class="col-12 col-md-4 col-lg-4"><span>${price?.['uom']?.['title']}</span></div>
                                                                    </div>
                                                                </div>`;
                                                // Price && UOM must follow PQ checked
                                                $(elePrice).attr('value', String(parseFloat(price?.['unit_price'])));
                                                $(eleUOM).empty();
                                                POLoadDataHandle.loadBoxUOM($(eleUOM), price?.['uom'], price?.['uom']?.['uom_group']?.['id']);
                                                $(eleUOM).change();
                                                $(eleUOM).attr('disabled', 'true');
                                            }
                                            $(elePriceList).append(priceAppend);
                                        }
                                        $.fn.initMaskMoney2();
                                        POCalculateHandle.calculateMain($table, row);
                                    }
                                }
                            });
                            // mask money
                            $.fn.initMaskMoney2();
                        }
                    }
                }
            )
        } else { // No PQ
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let elePrice = row.querySelector('.table-row-price');
                let elePriceList = row.querySelector('.table-row-price-list');
                elePrice.removeAttribute('disabled');
                $(elePriceList).empty();
            });
        }
        return true
    };

    static loadDataByCheckedQuotation(ele) {
        if (POLoadDataHandle.PRDataEle.val()) {  // PO PR products
            let tablePRProduct = $('#datable-purchase-request-product');
            let checked_id = ele.getAttribute('data-id');
            let isProductNotIn = false;
            // reset status
            for (let eleChecked of tablePRProduct[0].querySelectorAll('.table-row-checkbox:checked, .table-row-checkbox.disabled-by-pq')) {
                let row = eleChecked.closest('tr');
                eleChecked.classList.remove('disabled-by-pq');
                eleChecked.removeAttribute('disabled');
                row.querySelector('.table-row-quantity-order').removeAttribute('disabled');
                $(row).css('background-color', '');
                row.removeAttribute('data-bs-toggle');
                row.removeAttribute('data-bs-placement');
                row.removeAttribute('title');
            }
            if (ele.checked === true) {
                let eleDataPQProducts = $('#data-purchase-quotation-products');
                if (eleDataPQProducts.val()) {
                    let dataPQMapProductsList = JSON.parse(eleDataPQProducts.val());
                    let dataPQMapProducts = dataPQMapProductsList[checked_id];
                    for (let eleChecked of tablePRProduct[0].querySelectorAll('.table-row-checkbox:checked')) {
                        let row = eleChecked.closest('tr');
                        let productID = row.querySelector('.table-row-item').id;
                        // update status
                        if (!dataPQMapProducts.includes(productID)) {
                            eleChecked.classList.add('disabled-by-pq');
                            eleChecked.setAttribute('disabled', 'true');
                            row.querySelector('.table-row-quantity-order').setAttribute('disabled', 'true');
                            $(row).css('background-color', '#f7f7f7');
                            row.setAttribute('data-bs-toggle', 'tooltip');
                            row.setAttribute('data-bs-placement', 'top');
                            row.setAttribute('title', POLoadDataHandle.transEle.attr('data-product-not-in') + ' ' + ele.getAttribute('data-code'));
                            isProductNotIn = true;
                        }
                    }
                }
            }
            POLoadDataHandle.loadPriceListByPurchaseQuotation();
            POLoadDataHandle.loadTableProductByPurchaseRequest();
            if (isProductNotIn === true) {
                $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-product-not-in') + ' ' + POLoadDataHandle.transEle.attr('data-purchase-quotation')}, 'failure');
                return false;
            }
        } else {  // PO Add Products
            POLoadDataHandle.loadPriceListByPurchaseQuotation();
        }
    };

    static loadUpdateDataPQ(ele) {
        let PQData = [];
        let checked_id = ele.getAttribute('data-id');
        if (POLoadDataHandle.PQDataEle.val()) {
            if (ele.checked === true) {
                for (let purchase_quotation of JSON.parse(POLoadDataHandle.PQDataEle.val())) {
                    PQData.push({
                        'purchase_quotation': purchase_quotation?.['purchase_quotation'],
                        'is_use': (purchase_quotation.purchase_quotation === checked_id)
                    })
                }
            } else {
                for (let purchase_quotation of JSON.parse(POLoadDataHandle.PQDataEle.val())) {
                    PQData.push({
                        'purchase_quotation': purchase_quotation?.['purchase_quotation'],
                        'is_use': false
                    })
                }
            }
        }
        POLoadDataHandle.PQDataEle.val(JSON.stringify(PQData))
    };

    static loadSupplierContactByCheckedQuotation(ele) {
        POLoadDataHandle.supplierSelectEle.empty();
        POLoadDataHandle.contactSelectEle.empty();
        if (ele.checked === true) {
            let supplier = JSON.parse(ele.getAttribute('data-supplier'));
            // load supplier by Purchase Quotation
            POLoadDataHandle.loadBoxSupplier(supplier);
            POLoadDataHandle.loadBoxContact(supplier?.['owner'], supplier?.['id']);
        }
        return true
    };

    static loadDataWhenClearPR(is_clear_all = false) {
        // Load again data & events relate with Purchase Request
        $('#purchase-order-purchase-request').empty();
        POLoadDataHandle.loadModalPurchaseRequestTable(is_clear_all);
        $('#datable-purchase-request')[0].querySelector('.table-checkbox-all').checked = false;
        POLoadDataHandle.loadModalPurchaseRequestProductTable(is_clear_all);
        // Load again data & events relate with Purchase Quotation
        $('#purchase-order-purchase-quotation').empty();
        POLoadDataHandle.loadModalPurchaseQuotation(is_clear_all);
        POLoadDataHandle.supplierSelectEle.empty();
        POLoadDataHandle.contactSelectEle.empty();
        // ReCalculate Totals
        let tableWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            let elePretaxAmount = tableFt.querySelector('.purchase-order-product-pretax-amount');
            let eleTaxes = tableFt.querySelector('.purchase-order-product-taxes');
            let eleTotal = tableFt.querySelector('.purchase-order-product-total');
            let elePretaxAmountRaw = tableFt.querySelector('.purchase-order-product-pretax-amount-raw');
            let eleTaxesRaw = tableFt.querySelector('.purchase-order-product-taxes-raw');
            let eleTotalRaw = tableFt.querySelector('.purchase-order-product-total-raw');
            let finalRevenueBeforeTaxAdd = tableFt.querySelector('.purchase-order-final-revenue-before-tax');
            $(elePretaxAmount).attr('data-init-money', String(0));
            elePretaxAmountRaw.value = '0';
            finalRevenueBeforeTaxAdd.value = '0';
            $(eleTaxes).attr('data-init-money', String(0));
            eleTaxesRaw.value = '0';
            $(eleTotal).attr('data-init-money', String(0));
            eleTotalRaw.value = '0';
        }
        return true
    };

    static loadAddPaymentStage() {
        let $table = $('#datable-po-payment-stage');
        let dataAdd = {
            'remark': '',
            'payment_ratio': 0,
            'value_before_tax': 0,
            'tax': {},
            'value_after_tax': 0,
        }
        let newRow = $table.DataTable().row.add(dataAdd).draw().node();
        // init select2
        POLoadDataHandle.loadBoxTax($(newRow.querySelector('.table-row-tax')));
        // init datePicker
        $(newRow.querySelector('.table-row-due-date')).daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
        });
        $(newRow.querySelector('.table-row-due-date')).val(null).trigger('change');
        // init maskMoney
        $.fn.initMaskMoney2();
    };

    static loadCssToDTScrollBody() {
        let tableAddWrapper = document.getElementById('datable-purchase-order-product-add_wrapper');
        let tablePRWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
        if (tableAddWrapper) {
            let tableAddBd = tableAddWrapper.querySelector('.dataTables_scrollBody');
            if (tableAddBd) {
                tableAddBd.style.minHeight = '200px';
            }
        }
        if (tablePRWrapper) {
            let tablePRBd = tablePRWrapper.querySelector('.dataTables_scrollBody');
            if (tablePRBd) {
                tablePRBd.style.minHeight = '200px';
            }
        }
    };

    // LOAD DETAIL
    static loadDetailPage(data) {
        $('#data-detail-page').val(JSON.stringify(data));
        $('#purchase-order-title').val(data?.['title']);
        if ([2, 3].includes(data?.['system_status'])) {
            let $btn = $('#btn-enable-edit');
            if ($btn.length) {
                $btn[0].setAttribute('hidden', 'true');
            }
        }
        $('#purchase-order-date-delivered').val(moment(data?.['date_created']).format('DD/MM/YYYY hh:mm A'));
        POLoadDataHandle.loadBoxSupplier(data?.['supplier']);
        POLoadDataHandle.loadBoxContact(data?.['contact']);

        POLoadDataHandle.loadDataShowPRPQ(data);
        PODataTableHandle.dataTablePurchaseRequest();
        POLoadDataHandle.loadModalPurchaseRequestProductTable(false, data);
        POLoadDataHandle.loadModalPurchaseQuotation(false, data);
        POLoadDataHandle.loadTablesDetailPage(data);
        POLoadDataHandle.loadTotals(data);
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
                elePRAppend += `<div class="chip chip-outline-primary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                    <span>
                                        <a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${prCode}</span></a>
                                        <button type="button" class="btn-close custom-btn-remove" data-id="${prID}" disabled></button>
                                    </span>
                                </div>`;
            } else {
                elePRAppend += `<div class="chip chip-outline-primary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                    <span>
                                        <a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${prCode}</span></a>
                                        <button type="button" class="btn-close custom-btn-remove" data-id="${prID}"></button>
                                    </span>
                                </div>`;
            }
            purchase_requests_data.push(prID);
        }
        elePurchaseRequest.append(elePRAppend);
        POLoadDataHandle.PRDataEle.val(JSON.stringify(purchase_requests_data));
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
                    elePQAppend += `<div class="chip chip-outline-primary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                        <span>
                                            <div class="form-check">
                                                <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" disabled>
                                                <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                            </div>
                                            <button type="button" class="btn-close custom-btn-remove" data-id="${pqID}" disabled></button>
                                        </span>
                                    </div>`;
                } else {
                    elePQAppend += `<div class="chip chip-outline-primary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                        <span>
                                            <div class="form-check">
                                                <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" checked disabled>
                                                <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                            </div>
                                            <button type="button" class="btn-close custom-btn-remove" data-id="${pqID}" disabled></button>
                                        </span>
                                    </div>`;
                }
            } else {
                if (dataPQ?.['is_use'] === false) {
                    elePQAppend += `<div class="chip chip-outline-primary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                        <span>
                                            <div class="form-check">
                                                <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1">
                                                <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                            </div>
                                            <button type="button" class="btn-close custom-btn-remove" data-id="${pqID}"></button>
                                        </span>
                                    </div>`;
                } else {
                    elePQAppend += `<div class="chip chip-outline-primary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                        <span>
                                            <div class="form-check">
                                                <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" checked>
                                                <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                            </div>
                                            <button type="button" class="btn-close custom-btn-remove" data-id="${pqID}"></button>
                                        </span>
                                    </div>`;
                }
            }
            purchase_quotations_data.push({
                'purchase_quotation': pqID,
                'is_use': dataPQ?.['is_use']
            })
        }
        elePurchaseQuotation.append(elePQAppend);
        POLoadDataHandle.PQDataEle.val(JSON.stringify(purchase_quotations_data));
    };

    static loadPRProductNotInPO(data) {
        let PRProductIDList = [];
        for (let PRProduct of data?.['purchase_request_products_data']) {
            PRProductIDList.push(PRProduct?.['purchase_request_product']?.['id'])
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
            let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                if (PRProductIDList.includes(dataRow?.['id'])) {
                    eleChecked.classList.add('disabled-by-pq');
                    eleChecked.setAttribute('disabled', 'true');
                    row.querySelector('.table-row-quantity-order').setAttribute('disabled', 'true');
                    $(row).css('background-color', '#f7f7f7');
                    row.setAttribute('data-bs-toggle', 'tooltip');
                    row.setAttribute('data-bs-placement', 'top');
                    row.setAttribute('title', POLoadDataHandle.transEle.attr('data-product-not-in') + ' ' + PQCode);
                }
            }
        }
    };

    static loadTablesDetailPage(data) {
        let form = $('#frm_purchase_order_create');
        let tableProductAdd = $('#datable-purchase-order-product-add');
        let tableProductRequest = $('#datable-purchase-order-product-request');
        let tablePaymentStage = $('#datable-po-payment-stage');
        if (data?.['purchase_requests_data'].length > 0) {
            POLoadDataHandle.eleDivTablePOProductAdd[0].setAttribute('hidden', 'true');
            POLoadDataHandle.eleDivTablePOProductRequest[0].removeAttribute('hidden');
            tableProductRequest.DataTable().rows.add(data?.['purchase_order_products_data']).draw();
            POLoadDataHandle.loadDataRowTable(tableProductRequest);
            if (form.attr('data-method') === 'GET') {
                POLoadDataHandle.loadTableDisabled(tableProductRequest);
            }
        } else {
            POLoadDataHandle.eleDivTablePOProductRequest[0].setAttribute('hidden', 'true');
            POLoadDataHandle.eleDivTablePOProductAdd[0].removeAttribute('hidden');
            tableProductAdd.DataTable().rows.add(data?.['purchase_order_products_data']).draw();
            POLoadDataHandle.loadDataRowTable(tableProductAdd);
            if (form.attr('data-method') === 'GET') {
                POLoadDataHandle.loadTableDisabled(tableProductAdd);
            }
        }
        // payment stage
        tablePaymentStage.DataTable().clear().draw();
        tablePaymentStage.DataTable().rows.add(data?.['purchase_order_payment_stage']).draw();
        POLoadDataHandle.loadTableDropDowns();
        if (form.attr('data-method') === 'GET') {
            POLoadDataHandle.loadTableDisabled(tablePaymentStage);
        }
        tablePaymentStage.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-due-date')) {
                $(row.querySelector('.table-row-due-date')).daterangepicker({
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
        // mask money
        $.fn.initMaskMoney2();
    };

    static loadTotals(data) {
        let tableWrapper = document.getElementById('datable-purchase-order-product-add_wrapper');
        if (data?.['purchase_requests_data']) {
            if (data?.['purchase_requests_data'].length > 0) {
                tableWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
            }
        }
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            let elePretaxAmount = tableFt.querySelector('.purchase-order-product-pretax-amount');
            let eleTaxes = tableFt.querySelector('.purchase-order-product-taxes');
            let eleTotal = tableFt.querySelector('.purchase-order-product-total');
            let elePretaxAmountRaw = tableFt.querySelector('.purchase-order-product-pretax-amount-raw');
            let eleTaxesRaw = tableFt.querySelector('.purchase-order-product-taxes-raw');
            let eleTotalRaw = tableFt.querySelector('.purchase-order-product-total-raw');
            let finalRevenueBeforeTaxAdd = tableFt.querySelector('.purchase-order-final-revenue-before-tax');
            $(elePretaxAmount).attr('data-init-money', String(data?.['total_product_pretax_amount']));
            elePretaxAmountRaw.value = data?.['total_product_pretax_amount'];
            $(eleTaxes).attr('data-init-money', String(data?.['total_product_tax']));
            eleTaxesRaw.value = data?.['total_product_tax'];
            $(eleTotal).attr('data-init-money', String(data?.['total_product']));
            eleTotalRaw.value = data?.['total_product'];
            finalRevenueBeforeTaxAdd.value = data?.['total_product_revenue_before_tax'];
        }
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
        for (let ele of table[0].querySelectorAll('.table-row-remark')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-ratio')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-after-tax')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-before-tax')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-due-date')) {
            ele.setAttribute('disabled', 'true');
        }
    };

    static loadTableDropDowns() {
        let tablePaymentStage = $('#datable-po-payment-stage');
        POLoadDataHandle.loadDropDowns(tablePaymentStage);
    };

    static loadDropDowns($table) {
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let eleRemark = row.querySelector('.table-row-remark');
            if (eleRemark) {
                if (eleRemark.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleRemark.getAttribute('data-row'));
                    if (row.querySelector('.table-row-tax')) {
                        POLoadDataHandle.loadBoxTax($(row.querySelector('.table-row-tax')), dataRow?.['tax']);
                    }
                }
            }
        });
        return true;
    };

}

// DataTable
class PODataTableHandle {
    static productInitEle = $('#data-init-product');
    static uomInitEle = $('#data-init-uom');
    static taxInitEle = $('#data-init-tax');

    static dataTablePurchaseRequest() {
        let $table = $('#datable-purchase-request');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                data: {'is_all_ordered': false, 'system_status': 3},
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('purchase_request_list')) {
                        return resp.data['purchase_request_list'] ? resp.data['purchase_request_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            paging: false,
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
                        if ($('#frm_purchase_order_create').attr('data-method') !== 'GET') {
                            if (POLoadDataHandle.PRDataEle.val()) {
                                let PRIDList = JSON.parse(POLoadDataHandle.PRDataEle.val());
                                if (PRIDList.includes(row.id)) {
                                    return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}" checked></div>`;
                                }
                            }
                            return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}"></div>`;
                        } else {
                            if (POLoadDataHandle.PRDataEle.val()) {
                                let PRIDList = JSON.parse(POLoadDataHandle.PRDataEle.val());
                                if (PRIDList.includes(row.id)) {
                                    return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}" checked disabled></div>`;
                                }
                            }
                            return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}" disabled></div>`;
                        }
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
        });
    };

    static dataTablePurchaseRequestProduct(data) {
        let $table = $('#datable-purchase-request-product');
        $table.DataTableDefault({
            data: data ? data : [],
            // searching: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let purchase_request_id = "";
                        if (Object.keys(row?.['purchase_request']).length !== 0) {
                            purchase_request_id = row?.['purchase_request']?.['id'];
                        }
                        if ($('#frm_purchase_order_create').attr('data-method') !== 'GET') {
                            if (!row.hasOwnProperty('is_checked')) {
                                return `<div class="form-check">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input table-row-checkbox" 
                                            data-id="${row.id}" 
                                            data-purchase-request-id="${purchase_request_id}"
                                            data-sale-order-product-id="${row?.['sale_order_product_id']}"
                                        >
                                    </div>`
                            } else {
                                return `<div class="form-check">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input table-row-checkbox" 
                                            data-id="${row.id}" 
                                            data-purchase-request-id="${purchase_request_id}"
                                            data-sale-order-product-id="${row?.['sale_order_product_id']}"
                                            checked
                                        >
                                    </div>`
                            }
                        } else {
                            if (!row.hasOwnProperty('is_checked')) {
                                return `<div class="form-check">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input table-row-checkbox" 
                                            data-id="${row.id}" 
                                            data-purchase-request-id="${purchase_request_id}"
                                            data-sale-order-product-id="${row?.['sale_order_product_id']}"
                                            disabled
                                        >
                                    </div>`
                            } else {
                                return `<div class="form-check">
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input table-row-checkbox" 
                                            data-id="${row.id}" 
                                            data-purchase-request-id="${purchase_request_id}"
                                            data-sale-order-product-id="${row?.['sale_order_product_id']}"
                                            checked
                                            disabled
                                        >
                                    </div>`
                            }
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
                        return `<span class="table-row-code">${row?.['purchase_request']?.['code']}</span>`
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
                        return `<span class="table-row-remain">${row?.['remain_for_purchase_order']}</span>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        if ($('#frm_purchase_order_create').attr('data-method') !== 'GET') {
                            if (row.hasOwnProperty('quantity_order')) {
                                return `<input type="text" class="form-control table-row-quantity-order" value="${row.quantity_order}">`;
                            } else {
                                return `<input type="text" class="form-control table-row-quantity-order" value="0">`;
                            }
                        } else {
                            if (row.hasOwnProperty('quantity_order')) {
                                return `<input type="text" class="form-control table-row-quantity-order" value="${row.quantity_order}" disabled>`;
                            } else {
                                return `<input type="text" class="form-control table-row-quantity-order" value="0" disabled>`;
                            }
                        }
                    }
                },
            ],
        });
    };

    static dataTablePurchaseRequestProductMerge(data) {
        let $table = $('#datable-purchase-request-product-merge');
        $table.DataTableDefault({
            data: data ? data : [],
            // searching: false,
            paging: false,
            info: false,
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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}" checked disabled></div>`
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
        });
    };

    static dataTablePurchaseQuotation(data) {
        let $table = $('#datable-purchase-quotation');
        $table.DataTableDefault({
            data: data ? data : [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" id="${row.id}" data-row="${dataRow}">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if ($('#frm_purchase_order_create').attr('data-method') !== 'GET') {
                            if (!row.hasOwnProperty('is_checked')) {
                                return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}"></div>`;
                            } else {
                                return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}" checked></div>`;
                            }
                        } else {
                            if (!row.hasOwnProperty('is_checked')) {
                                return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}" disabled></div>`;
                            } else {
                                return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row.id}" checked disabled></div>`;
                            }
                        }
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<div class="row"><span class="badge badge-primary table-row-code">${row?.['code']}</span></div>`
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row?.['title']}</span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let dataSupplier = JSON.stringify(row?.['supplier_mapped']).replace(/"/g, "&quot;");
                        return `<div class="row"><span class="badge badge-soft-warning table-row-supplier" data-supplier="${dataSupplier}" id="${row?.['supplier_mapped']?.['id']}">${row?.['supplier_mapped']?.['name']}</span></div>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-purchase-quotation-request">${row?.['purchase_quotation_request_mapped']?.['code'] ? row?.['purchase_quotation_request_mapped']?.['code'] : ''}</span>`
                    }
                },
            ],
        });
    };

    static dataTablePurchaseOrderProductRequest(data) {
        let $table = $('#datable-purchase-order-product-request');
        $table.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            columns: [  // 50,300,300,100,100,100,150,150,350,150,250 (2000p)
                {
                    targets: 0,
                    width: '2.5%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" id="${row?.['id']}" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<select
                                    class="form-select table-row-item"
                                    data-product-id="${row?.['product']?.['id']}"
                                    data-url="${PODataTableHandle.productInitEle.attr('data-url')}"
                                    data-link-detail="${PODataTableHandle.productInitEle.attr('data-link-detail')}"
                                    data-method="${PODataTableHandle.productInitEle.attr('data-method')}"
                                    data-keyResp="product_sale_list"
                                    required
                                    disabled
                                >
                                </select>`;
                    },
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <p><span class="table-row-description">${row?.['product']?.['description'] ? row?.['product']?.['description'] : ''}</span></p>
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        let dataStr = JSON.stringify(row?.['uom_order_request']).replace(/"/g, "&quot;");
                        return `<span class="table-row-uom-order-request" id="${row?.['uom_order_request']?.['id']}">${row?.['uom_order_request']?.['title']}<input type="hidden" class="data-info" value="${dataStr}"></span>`;
                    }
                },
                {
                    targets: 4,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-order-request">${row?.['product_quantity_order_request']}</span>`;
                    }
                },
                {
                    targets: 5,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-stock">${row?.['stock']}</span>`
                    }
                },
                {
                    targets: 6,
                    width: '7.5%',
                    render: () => {
                        return `<div class="row">
                                    <select 
                                        class="form-control table-row-uom-order-actual"
                                        data-url="${PODataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${PODataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        required
                                    >
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '7.5%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-quantity-order-actual validated-number" value="${row?.['product_quantity_order_actual']}" required>
                                </div>`;
                    }
                },
                {
                    targets: 8,
                    width: '17.5%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <div class="dropdown">
                                        <div class="input-group dropdown-action input-group-price" aria-expanded="false" data-bs-toggle="dropdown">
                                        <span class="input-affix-wrapper">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-price" 
                                                value="${row?.['product_unit_price']}"
                                                data-return-type="number"
                                            >
                                            <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-caret-down"></i></span>
                                        </span>
                                        </div>
                                        <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                        <a class="dropdown-item" data-value=""></a>
                                        </div>
                                    </div>`;
                    }
                },
                {
                    targets: 9,
                    width: '7.5%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                <select 
                                    class="form-control table-row-tax"
                                    data-url="${PODataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${PODataTableHandle.taxInitEle.attr('data-method')}"
                                    data-keyResp="tax_list"
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
                                >
                            </div>`;
                    }
                },
                {
                    targets: 10,
                    width: '12.5%',
                    render: (data, type, row) => {
                        return `<div class="row subtotal-area">
                                    <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}"></span></p>
                                    <input
                                        type="text"
                                        class="form-control table-row-subtotal-raw"
                                        value="${row?.['product_subtotal_price']}"
                                        hidden
                                    >
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to dataTables_scrollBody
                POLoadDataHandle.loadCssToDTScrollBody();
            },
        });
    };

    static dataTablePurchaseOrderProductAdd(data) {
        let $table = $('#datable-purchase-order-product-add');
        $table.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            columns: [  // 50,350,350,150,200,350,150,350,50 (2000p)
                {
                    targets: 0,
                    width: '2.5%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" id="${row.id}" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '17.5%',
                    render: () => {
                            return `<select class="form-select table-row-item"></select>`;
                    },
                },
                {
                    targets: 2,
                    width: '17.5%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <p><span class="table-row-description">${row?.['product']?.['description'] ? row?.['product']?.['description'] : ''}</span></p>
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    width: '7.5%',
                    render: () => {
                        return `<div class="row">
                                    <select 
                                        class="form-control table-row-uom-order-actual"
                                        data-url="${PODataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${PODataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        required
                                    >
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-quantity-order-actual valid-number" value="${row?.['product_quantity_order_actual']}" required>
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    width: '17.5%',
                    render: (data, type, row) => {
                        return `<div class="row more-information-group">
                                    <div class="dropdown">
                                        <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                        <span class="input-affix-wrapper">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-price" 
                                                value="${row?.['product_unit_price']}"
                                                data-return-type="number"
                                            >
                                            <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-caret-down"></i></span>
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
                    width: '7.5%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                <select 
                                    class="form-control table-row-tax"
                                    data-url="${PODataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${PODataTableHandle.taxInitEle.attr('data-method')}"
                                    data-keyResp="tax_list"
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
                                >
                            </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '17.5%',
                    render: (data, type, row) => {
                        return `<div class="row subtotal-area">
                                    <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}"></span></p>
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
                    targets: 8,
                    width: '2.5%',
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                },
            ],
            drawCallback: function () {
                // add css to dataTables_scrollBody
                POLoadDataHandle.loadCssToDTScrollBody();
            },
        });
    };

    static dataTablePaymentStage(data) {
        // init dataTable
        let $tables = $('#datable-po-payment-stage');
        $tables.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<input type="text" class="form-control table-row-remark" data-row="${dataRow}" data-order="${(meta.row + 1)}" value="${row?.['remark'] ? row?.['remark'] : ''}">`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-ratio valid-number" value="${row?.['payment_ratio'] ? row?.['payment_ratio'] : '0'}">
                                        <div class="input-suffix"><i class="fas fa-percentage"></i></div>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-before-tax" 
                                    value="${row?.['value_before_tax'] ? row?.['value_before_tax'] : '0'}"
                                    data-return-type="number"
                                >`;
                    },
                },
                {
                    targets: 3,
                    render: () => {
                        return `<select 
                                    class="form-select table-row-tax"
                                    data-url="${PODataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${PODataTableHandle.taxInitEle.attr('data-method')}"
                                    data-keyResp="tax_list"
                                 >
                                </select>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-value-after-tax" data-init-money="${parseFloat(row?.['value_after_tax'] ? row?.['value_after_tax'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        if (row?.['due_date'] !== '') {
                            return `<div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-due-date" value="${moment(row?.['due_date']).format('DD/MM/YYYY')}">
                                        <div class="input-suffix"><i class="far fa-calendar"></i></div>
                                    </div>`;
                        } else {
                            return `<div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-due-date" value="">
                                        <div class="input-suffix"><i class="far fa-calendar"></i></div>
                                    </div>`;
                        }
                    }
                },
                {
                    targets: 6,
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
        });
    };

}

// Calculate
class POCalculateHandle {
    static calculateTotal(table) {
        let tableWrapper = null;
        if (table.id === 'datable-purchase-order-product-add') {
            tableWrapper = document.getElementById('datable-purchase-order-product-add_wrapper');
        }
        if (table.id === 'datable-purchase-order-product-request') {
            tableWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
        }
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            let pretaxAmount = 0;
            let taxAmount = 0;
            let elePretaxAmount = tableFt.querySelector('.purchase-order-product-pretax-amount');
            let eleTaxes = tableFt.querySelector('.purchase-order-product-taxes');
            let eleTotal = tableFt.querySelector('.purchase-order-product-total');
            let elePretaxAmountRaw = tableFt.querySelector('.purchase-order-product-pretax-amount-raw');
            let eleTaxesRaw = tableFt.querySelector('.purchase-order-product-taxes-raw');
            let eleTotalRaw = tableFt.querySelector('.purchase-order-product-total-raw');
            let finalRevenueBeforeTaxAdd = tableFt.querySelector('.purchase-order-final-revenue-before-tax');
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
                finalRevenueBeforeTaxAdd.value = pretaxAmount;
                $(eleTaxes).attr('data-init-money', String(taxAmount));
                eleTaxesRaw.value = taxAmount;
                $(eleTotal).attr('data-init-money', String(totalFinal));
                eleTotalRaw.value = totalFinal;
            }

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
        POCalculateHandle.calculateRow(row);
        // calculate total
        POCalculateHandle.calculateTotal(table[0]);
        return true;
    };

    static calculateTable(table) {
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            POCalculateHandle.calculateMain(table, row)
        }
    };

    // payment stage
    static calculateValueAfterTax(row) {
        let eleValueBT = row.querySelector('.table-row-value-before-tax');
        let eleTax = row.querySelector('.table-row-tax');
        let eleValueAT = row.querySelector('.table-row-value-after-tax');
        if (eleValueBT && eleTax && eleValueAT) {
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax) {
                    let valueTax = ($(eleValueBT).valCurrency() * parseFloat(dataTax?.['rate'])) / 100;
                    let valueAT = $(eleValueBT).valCurrency() + valueTax;
                    $(eleValueAT).attr('data-init-money', String(valueAT));
                }
            } else {
                let valueAT = $(eleValueBT).valCurrency();
                $(eleValueAT).attr('data-init-money', String(valueAT));
            }
        }
        // init maskMoney
        $.fn.initMaskMoney2();
        return true;
    }

}

// Validate
class POValidateHandle {
    static validateNumber(ele) {
        let value = ele.value;
        // Replace non-digit characters with an empty string
        value = value.replace(/[^0-9.]/g, '');
        // Remove unnecessary zeros from the integer part
        value = value.replace("-", "").replace(/^0+(?=\d)/, '');
        // Update value of input
        ele.value = value;
    };

    static validateQuantityOrderRequest(ele, remain) {
        if (parseFloat(ele.value) > remain) {
            ele.value = '0';
            $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-validate-order-request')}, 'failure');
            return false;
        }
        return true;
    };

    static validateQuantityOrderActualAndUpdateStock(row) {
        let eleQuantityRequest = row.querySelector('.table-row-quantity-order-request');
        let eleQuantityOrder = row.querySelector('.table-row-quantity-order-actual');
        let eleStock = row.querySelector('.table-row-stock');
        let quantity_request = eleQuantityRequest.innerHTML;
        let quantity_order = eleQuantityOrder.value;
        let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
        let eleUOMOrder = row.querySelector('.table-row-uom-order-actual');
        if (dataRowRaw && $(eleUOMOrder).val()) {
            let dataRow = JSON.parse(dataRowRaw);
            let uomRequestData = dataRow?.['uom_order_request'];
            let uomOrderData = SelectDDControl.get_data_from_idx($(eleUOMOrder), $(eleUOMOrder).val());
            if (uomRequestData?.['id'] === uomOrderData?.['id']) { // IF COMMON UOM
                if (parseFloat(quantity_order) < parseFloat(quantity_request)) {
                    eleQuantityOrder.value = '0';
                    eleStock.innerHTML = '0';
                    $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-validate-order-actual')}, 'failure');
                    return false
                } else {
                    eleStock.innerHTML = String((parseFloat(quantity_order) - parseFloat(quantity_request)).toFixed(2));
                }
            } else { // IF DIFFERENT UOM
                let finalRatio = (parseFloat(uomOrderData?.['ratio']) / parseFloat(uomRequestData?.['ratio']));
                if ((parseFloat(quantity_order) * finalRatio) < (parseFloat(quantity_request))) {
                    eleQuantityOrder.value = '0';
                    eleStock.innerHTML = '0';
                    $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-validate-order-actual')}, 'failure');
                    return false
                } else {
                   eleStock.innerHTML = String(((parseFloat(quantity_order) * finalRatio) - parseFloat(quantity_request)).toFixed(2));
                }
            }
        }
        return true
    };

}

// Submit Form
class POSubmitHandle {

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
            let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                result.push({
                    'purchase_request_product': dataRow?.['id'],
                    'sale_order_product': sale_order_id,
                    'quantity_order': quantity_order,
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
        $(table).DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
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
                    rowData['product_description'] = eleDescription.innerHTML;
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
                        rowData['tax'] = dataInfo?.['id'];
                        rowData['product_tax_title'] = dataInfo?.['title'];
                        rowData['product_tax_value'] = dataInfo?.['rate'];
                    } else {
                        rowData['product_tax_value'] = 0;
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    if (eleTaxAmount.value) {
                       rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                    }
                }
                let eleQuantityRequest = row.querySelector('.table-row-quantity-order-request');
                if (eleQuantityRequest) {
                    if (eleQuantityRequest.innerHTML) {
                        rowData['product_quantity_order_request'] = parseFloat(eleQuantityRequest.innerHTML);
                    }
                }
                let eleQuantityOrder = row.querySelector('.table-row-quantity-order-actual');
                if (eleQuantityOrder) {
                    if (eleQuantityOrder.value) {
                        rowData['product_quantity_order_actual'] = parseFloat(eleQuantityOrder.value);
                    }
                }
                let stock = row.querySelector('.table-row-stock');
                if (stock) {
                    if (stock.innerHTML) {
                        rowData['stock'] = parseFloat(stock.innerHTML);
                    }
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    if (eleSubtotal.value) {
                        rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                    }
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
                        // Check if stock > 0
                        if (rowData['stock'] > 0) {
                            rowData['purchase_request_products_data'].push({
                                'quantity_order': rowData['stock'],
                                'uom_stock': rowData['uom_order_request'],
                                'is_stock': true,
                            })
                        }
                    }
                }
            }
            result.push(rowData);
        });
        return result
    };

    static setupDataPaymentStage() {
        let result = [];
        let $table = $('#datable-po-payment-stage');
        $table.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let eleRemark = row.querySelector('.table-row-remark');
            if (eleRemark) {
                rowData['remark'] = eleRemark.value;
                if (eleRemark.getAttribute('data-order')) {
                    rowData['order'] = parseInt(eleRemark.getAttribute('data-order'));
                }
            }
            let eleRatio = row.querySelector('.table-row-ratio');
            if (eleRatio) {
                rowData['payment_ratio'] = parseFloat(eleRatio.value);
            }
            let eleValueBT = row.querySelector('.table-row-value-before-tax');
            if (eleValueBT) {
                if ($(eleValueBT).valCurrency()) {
                    rowData['value_before_tax'] = parseFloat($(eleValueBT).valCurrency());
                }
            }
            let eleTax = row.querySelector('.table-row-tax');
            if (eleTax) {
                if ($(eleTax).val()) {
                    rowData['tax'] = $(eleTax).val();
                }
            }
            let eleValueAT = row.querySelector('.table-row-value-after-tax');
            if (eleValueAT) {
                if (eleValueAT.getAttribute('data-init-money')) {
                    rowData['value_after_tax'] = parseFloat(eleValueAT.getAttribute('data-init-money'));
                }
            }
            let eleDueDate = row.querySelector('.table-row-due-date');
            if (eleDueDate) {
                if (eleDueDate.value) {
                    rowData['due_date'] = String(moment(eleDueDate.value, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            result.push(rowData);
        });
        return result;
    };

    static setupDataSubmit(_form) {
        if (POLoadDataHandle.PRDataEle.val()) {
            _form.dataForm['purchase_requests_data'] = JSON.parse(POLoadDataHandle.PRDataEle.val());
        }
        if (POLoadDataHandle.PQDataEle.val()) {
           _form.dataForm['purchase_quotations_data'] = JSON.parse(POLoadDataHandle.PQDataEle.val());
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
        let tableWrapper = document.getElementById('datable-purchase-order-product-add_wrapper');
        if (POLoadDataHandle.PRDataEle.val()) {
            tableWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
        }
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            let elePretaxAmountRaw = tableFt.querySelector('.purchase-order-product-pretax-amount-raw');
            let eleTaxesRaw = tableFt.querySelector('.purchase-order-product-taxes-raw');
            let eleTotalRaw = tableFt.querySelector('.purchase-order-product-total-raw');
            let finalRevenueBeforeTaxAdd = tableFt.querySelector('.purchase-order-final-revenue-before-tax');
            _form.dataForm['total_product_pretax_amount'] = parseFloat($(elePretaxAmountRaw).val());
            _form.dataForm['total_product_tax'] = parseFloat($(eleTaxesRaw).val());
            _form.dataForm['total_product'] = parseFloat($(eleTotalRaw).val());
            _form.dataForm['total_product_revenue_before_tax'] = parseFloat(finalRevenueBeforeTaxAdd.value);
        }
        // payment stage
        let dataPaymentStage = POSubmitHandle.setupDataPaymentStage();
        if (dataPaymentStage.length > 0) {
            _form.dataForm['purchase_order_payment_stage'] = dataPaymentStage;
        }

        // system fields
        if (_form.dataMethod === "POST") {
            _form.dataForm['system_status'] = 1;
        }
        // attachment
        _form.dataForm['attachment'] = $x.cls.file.get_val(_form.dataForm['attachment'], []);
    };
}

// *** COMMON FUNCTIONS ***
function clickCheckBoxAll(ele, table) {
    for (let eleCheck of table[0].querySelectorAll('.table-row-checkbox')) {
        eleCheck.checked = ele[0].checked;
    }
}

function areAllEqual(arr) {
    if (arr.length === 0) {
        return true; // An empty array is considered as all elements being equal.
    }
    const firstElement = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== firstElement) {
            return false; // If any element is not equal to the first one, return false.
        }
    }
    return true; // All elements are equal.
}

function setupMergeProduct() {
    let data = [];
    let dataJson = {};
    let table = $('#datable-purchase-request-product');
    if (!table[0].querySelector('.dataTables_empty')) {
        let order = 0;
        let uom_reference = {};
        let uom_default = {};
        // Setup Merge Data by Product
        for (let eleChecked of table[0].querySelectorAll('.table-row-checkbox:checked:not(.disabled-by-pq)')) {
            let row = eleChecked.closest('tr');
            let sale_order_id = eleChecked.getAttribute('data-sale-order-product-id');
            if (sale_order_id === "null") {
                sale_order_id = null;
            }
            let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                if (Object.keys(uom_reference).length === 0) {
                    uom_reference = dataRow?.['uom']?.['uom_group']?.['uom_reference'];
                }
                if (Object.keys(uom_default).length === 0) {
                    uom_default = dataRow?.['product']?.['purchase_information']?.['uom'];
                }
                let tax = dataRow?.['tax'];
                let product_id = dataRow?.['product']?.['id'];
                let quantity = parseFloat(dataRow?.['quantity']);
                let quantity_order = parseFloat(row.querySelector('.table-row-quantity-order').value);
                let remain = (parseFloat(row.querySelector('.table-row-remain').innerHTML) - quantity_order);
                if (dataRow?.['uom']?.['id'] !== uom_default?.['id']) {
                    let finalRatio = (parseFloat(dataRow?.['uom']?.['ratio']) / parseFloat(uom_default?.['ratio']));
                    quantity = (parseFloat(dataRow?.['quantity']) * finalRatio);
                    quantity_order = (parseFloat(row.querySelector('.table-row-quantity-order').value) * finalRatio);
                    remain = ((parseFloat(row.querySelector('.table-row-remain').innerHTML) * finalRatio) - quantity_order);
                }
                // origin data to check
                let quantity_origin = parseFloat(dataRow?.['quantity']);
                let quantity_order_origin = parseFloat(row.querySelector('.table-row-quantity-order').value);
                let remain_origin = (parseFloat(row.querySelector('.table-row-remain').innerHTML) - quantity_order);
                if (parseFloat(row.querySelector('.table-row-remain').innerHTML) > 0) {
                    if (!dataJson.hasOwnProperty(product_id)) {
                        order++
                        dataJson[product_id] = {
                            'id': dataRow?.['id'],
                            'purchase_request_products_data': [{
                                'purchase_request_product': dataRow?.['id'],
                                'sale_order_product': sale_order_id,
                                'quantity_order': quantity_order_origin,
                                'quantity_remain': parseFloat(dataRow?.['remain_for_purchase_order']),
                            }],
                            'product': dataRow?.['product'],
                            'uom_order_request': uom_default,
                            'uom_order_actual': uom_default,
                            'uom_list': [dataRow?.['uom']],
                            'uom_id_list': [dataRow?.['uom']?.['id']],
                            'tax': tax,
                            'stock': 0,
                            'product_title': dataRow?.['product']?.['title'],
                            'code_list': [dataRow?.['purchase_request']?.['code']],
                            'product_description': 'xxxxx',
                            'product_quantity_request': quantity,
                            'product_quantity_order_request': quantity_order,
                            'product_quantity_order_actual': quantity_order,
                            'remain': remain,
                            'quantity_origin': quantity_origin,
                            'quantity_order_origin': quantity_order_origin,
                            'remain_origin': remain_origin,
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
                            'quantity_order': quantity_order_origin,
                            'quantity_remain': parseFloat(dataRow?.['remain_for_purchase_order']),
                        });
                        dataJson[product_id].product_quantity_request += quantity;
                        dataJson[product_id].product_quantity_order_request += quantity_order;
                        dataJson[product_id].product_quantity_order_actual += quantity_order;
                        dataJson[product_id].remain += remain;

                        dataJson[product_id].quantity_origin += quantity_origin;
                        dataJson[product_id].quantity_order_origin += quantity_order_origin;
                        dataJson[product_id].remain_origin += remain_origin;
                        dataJson[product_id].uom_list.push(dataRow?.['uom']);
                        dataJson[product_id].uom_id_list.push(dataRow?.['uom']?.['id']);
                    }
                }
            }
        }
        for (let key in dataJson) {
            if (dataJson[key]['uom_id_list'].length > 0 && areAllEqual(dataJson[key]['uom_id_list']) === true) {
                dataJson[key]['uom_order_request'] = dataJson[key]['uom_list'][0];
                dataJson[key]['uom_order_actual'] = dataJson[key]['uom_list'][0];

                dataJson[key]['product_quantity_request'] = dataJson[key]['quantity_origin'];
                dataJson[key]['product_quantity_order_request'] = dataJson[key]['quantity_order_origin'];
                dataJson[key]['product_quantity_order_actual'] = dataJson[key]['quantity_order_origin'];
                dataJson[key]['remain'] = dataJson[key]['remain_origin'];
            }
            data.push(dataJson[key]);
        }
    }
    return data
}

function deleteRow(currentRow, table) {
    // Get the index of the current row within the DataTable
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    // Delete current row
    row.remove().draw();
}
