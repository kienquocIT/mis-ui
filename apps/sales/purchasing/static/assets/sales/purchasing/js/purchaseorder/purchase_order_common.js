// LoadData
class POLoadDataHandle {
    static $form = $('#frm_purchase_order_create');
    static supplierSelectEle = $('#box-purchase-order-supplier');
    static contactSelectEle = $('#box-purchase-order-contact');
    static PRDataEle = $('#purchase_requests_data');
    static PQDataEle = $('#purchase_quotations_data');
    static eleDivTablePOProductRequest = $('#table-purchase-order-product-request-area');
    static eleDivTablePOProductAdd = $('#table-purchase-order-product-add-area');
    static eleDivTablePRProduct = $('#table-purchase-request-product-area');
    static eleDivTablePRProductMerge = $('#table-purchase-request-product-merge-area');
    static $priceModal = $('#viewPriceModal');
    static $elePQ = $('#purchase-order-purchase-quotation');
    static $btnSaveInvoice = $('#btn-save-select-invoice');
    static $btnSaveReconcile = $('#btn-save-select-reconcile');
    static transEle = $('#app-trans-factory');
    static urlEle = $('#app-url-factory');

    static loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = ``;
                let res2 = ``;
                if (customRes?.['res1']) {
                    res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`;
                }
                if (customRes?.['res2']) {
                    res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`;
                }
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadCssS2($ele, maxWidth) {
        if ($ele.is("select") && $ele.hasClass("select2-hidden-accessible")) {
            let $render = $ele.next('.select2-container').find('.select2-selection__rendered');
            if ($render && $render.length > 0) {
                $render.css('max-width', maxWidth);
            }
        }
        return true;
    };

    static loadEventCheckbox($area, trigger = false) {
        // Use event delegation for dynamically added elements
        $area.on('click', '.form-check', function (event) {
            // Prevent handling if the direct checkbox is clicked
            if (event.target.classList.contains('form-check-input')) {
                return; // Let the checkbox handler handle this
            }

            // Find the checkbox inside the clicked element
            let checkbox = this.querySelector('.form-check-input[type="checkbox"]');
            if (checkbox) {
                // Check if the checkbox is disabled
                if (checkbox.disabled) {
                    return; // Exit early if the checkbox is disabled
                }
                // Prevent the default behavior
                event.preventDefault();
                event.stopImmediatePropagation();

                // Toggle the checkbox state manually
                checkbox.checked = !checkbox.checked;
                // Optional: Trigger a change event if needed
                if (trigger === true) {
                    $(checkbox).trigger('change');
                }
            }
        });

        // Handle direct clicks on the checkbox itself
        $area.on('click', '.form-check-input', function (event) {
            // Prevent the default behavior to avoid double-triggering
            event.stopPropagation();
            event.stopImmediatePropagation();

            // Checkbox state is toggled naturally, so no need to modify it
            if (trigger === true) {
                $(this).trigger('change'); // Optional: Trigger change event explicitly
            }
        });

        return true;
    };

    static loadEventRadio($area) {
        // Use event delegation for dynamically added elements
        $area.on('click', '.form-check', function () {
            // Find and mark the radio button inside this group as checked
            let radio = this.querySelector('.form-check-input');
            if (radio) {
                let checkboxes = $area[0].querySelectorAll('.form-check-input[type="radio"]');
                // Uncheck all radio buttons and reset row styles
                for (let eleCheck of checkboxes) {
                    eleCheck.checked = false;
                }
                // Set the current radio button as checked and apply style
                radio.checked = true;
            }
        });
        return true;
    };

    static loadBoxProduct($ele, dataProduct = {}) {
        let dataDD = []
        if (PODataTableHandle.productInitEle.val()) {
            dataDD = JSON.parse(PODataTableHandle.productInitEle.val());
        }
        if (Object.keys(dataProduct).length > 0) {
            dataDD = dataProduct
        }
        $ele.initSelect2({
            data: dataDD,
        });
        // add css to select2_rendered
        POLoadDataHandle.loadCssS2($ele, '200px');
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
                    description.innerHTML = data?.['description'] ? data?.['description'] : '';
                }
                // load UOM
                if (uom && Object.keys(data?.['unit_of_measure']).length !== 0 && Object.keys(data?.['uom_group']).length !== 0) {
                    FormElementControl.loadInitS2($(uom), [data?.['unit_of_measure']], {'group': data?.['uom_group']?.['id']});
                } else {
                    FormElementControl.loadInitS2($(uom));
                }
                // load TAX
                if (tax && data?.['tax']) {
                    FormElementControl.loadInitS2($(tax), [data?.['tax']]);
                } else {
                    FormElementControl.loadInitS2($(tax));
                }
            }
            $.fn.initMaskMoney2();
        }
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
            WindowControl.showLoading();
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
                            tablePurchaseRequestProduct.DataTable().clear().draw();
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
                    WindowControl.hideLoading();
                }
            )
        } else {
            POLoadDataHandle.loadDataShowPurchaseRequest();
            POLoadDataHandle.loadTableProductByPurchaseRequest();
            POLoadDataHandle.loadModalPurchaseQuotation(true);
        }
        return true;
    };

    static loadModalSInvoice(ele) {
        let row = ele.closest('tr');
        if (row) {
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                POLoadDataHandle.$btnSaveInvoice.attr('data-id', orderEle.innerHTML);
            }
        }
        let datas = POSubmitHandle.setupDataInvoice();
        PODataTableHandle.$tableSInvoice.DataTable().clear().draw();
        PODataTableHandle.$tableSInvoice.DataTable().rows.add(datas).draw();
        return true;
    };

    static loadModalSReconcile(ele) {
        let row = ele.closest('tr');
        if (row) {
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                POLoadDataHandle.$btnSaveReconcile.attr('data-id', orderEle.innerHTML);
            }
        }
        let fnData = [];
        let check = parseInt(POLoadDataHandle.$btnSaveReconcile.attr('data-id'));
        let datas = POSubmitHandle.setupDataPaymentStage();
        for (let data of datas) {
            if (data?.['order'] < check && data?.['invoice'] === null) {
                fnData.push(data);
            }
        }
        PODataTableHandle.$tableSReconcile.DataTable().clear().draw();
        PODataTableHandle.$tableSReconcile.DataTable().rows.add(fnData).draw();
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
        let data = POSubmitHandle.setupMergeProduct();
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
                eleAppend += `<div class="chip chip-secondary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                    <span>
                                        <a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${prCode}</span></a>
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
        POLoadDataHandle.loadResetPQAndPriceList();
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
        WindowControl.showLoading();
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
                    if (data.hasOwnProperty('purchase_quotation_sale_list') && Array.isArray(data.purchase_quotation_sale_list)) {
                        if (Object.keys(checked_data).length !== 0) {
                            for (let PQ of data.purchase_quotation_sale_list) {
                                if (checked_data.hasOwnProperty(PQ.id)) {
                                    PQ['is_checked'] = true;
                                    PQ['is_use'] = checked_data[PQ.id]?.['is_use'];
                                }
                            }
                        }
                        tablePurchaseQuotation.DataTable().clear().draw();
                        tablePurchaseQuotation.DataTable().rows.add(data.purchase_quotation_sale_list).draw();
                        if (is_remove === true) {
                            POLoadDataHandle.loadDataShowPurchaseQuotation();
                            POLoadDataHandle.loadAllTablesDisabled();
                        }
                        WindowControl.hideLoading();
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
            eleAppend += `<div class="chip chip-secondary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                <span>
                                    <div class="form-check">
                                        <input type="radio" class="form-check-input checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1">
                                        <a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a>
                                    </div>
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
        POLoadDataHandle.loadEventRadio(elePurchaseQuotation);
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
        }
    };

    static loadReDataTbl() {
        let $tableProductPR = $('#datable-purchase-order-product-request');
        let $tableProductAdd = $('#datable-purchase-order-product-add');
        $tableProductPR.DataTable().destroy();
        PODataTableHandle.dataTablePurchaseOrderProductRequest();
        // clear dataTable
        $tableProductPR.DataTable().clear().draw();
        $tableProductAdd.DataTable().clear().draw();
        return true;
    };

    static loadTableProductByPurchaseRequest() {
        let $tableProductPR = $('#datable-purchase-order-product-request');
        // clear dataTable
        $tableProductPR.DataTable().clear().draw();
        let data = POSubmitHandle.setupMergeProduct();
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
        POCalculateHandle.calculateTable($tableProductPR);
        $.fn.initMaskMoney2();
        return true;
    };

    static loadAddRowTableProductAdd(type = 0) {
        // type: {0: product, 1: shipping}
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
        if (type === 1) {
            data['is_shipping'] = true;
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
        let table_id = $table[0].id;
        $table.DataTable().rows().every(function () {
            let row = this.node();
            POLoadDataHandle.loadDataRow(row, table_id);
        });
        return true;
    };

    static loadDataRow(row) {
        // mask money
        $.fn.initMaskMoney2();
        let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
        if (dataRowRaw) {
            let dataRow = JSON.parse(dataRowRaw);
            POLoadDataHandle.loadBoxProduct($(row.querySelector('.table-row-item')));
            FormElementControl.loadInitS2($(row.querySelector('.table-row-uom-order-actual')), [], {'group': dataRow?.['uom_order_actual']?.['uom_group']?.['id']});
            FormElementControl.loadInitS2($(row.querySelector('.table-row-tax')));
            if (dataRow?.['product']?.['id']) {
                FormElementControl.loadInitS2($(row.querySelector('.table-row-item')), [dataRow?.['product']]);
            }
            if (dataRow?.['uom_order_actual']?.['id']) {
                FormElementControl.loadInitS2($(row.querySelector('.table-row-uom-order-actual')), [dataRow?.['uom_order_actual']], {'group': dataRow?.['uom_order_actual']?.['uom_group']?.['id']});
            }
            if (dataRow?.['tax']?.['id']) {
                FormElementControl.loadInitS2($(row.querySelector('.table-row-tax')), [dataRow?.['tax']]);
            }
        }
    };

    static loadPriceListPQ(ele) {
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
        let modalBody = POLoadDataHandle.$priceModal[0].querySelector('.modal-body');
        if (modalBody) {
            $(modalBody).empty();
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
                                let row = ele.closest('tr');
                                let eleUOM = row.querySelector('.table-row-uom-order-actual');
                                let priceListData = dataProduct[row.querySelector('.table-row-item').getAttribute('data-product-id')];
                                let elePrice = row.querySelector('.table-row-price');
                                if (priceListData) {
                                    let htmlPriceList = ``;
                                    for (let price of priceListData) {
                                        let checked = '';
                                        if (price?.['purchase_quotation']?.['id'] === checked_id) {
                                            checked = 'checked';
                                        }
                                        htmlPriceList += `<div class="d-flex justify-content-between align-items-center">
                                                                <div class="form-check form-check-lg">
                                                                    <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="pq-price-${price?.['purchase_quotation']?.['id'].replace(/-/g, "")}" data-value="${parseFloat(price?.['unit_price'])}" disabled ${checked}>
                                                                    <label class="form-check-label" for="pq-price-${price?.['purchase_quotation']?.['id'].replace(/-/g, "")}">${price?.['purchase_quotation']?.['title']}</label>
                                                                </div>
                                                                <div class="d-flex justify-content-between align-items-center">
                                                                    <span class="mask-money mr-2" data-init-money="${parseFloat(price?.['unit_price'])}"></span>
                                                                    <span class="mr-2">/</span>
                                                                    <span class="badge badge-light">${price?.['uom']?.['title']}</span>
                                                                </div>
                                                            </div>`;

                                        if (price?.['purchase_quotation']?.['id'] === checked_id) { // If check PQ
                                            // Price && UOM must follow PQ checked
                                            $(elePrice).attr('value', String(parseFloat(price?.['unit_price'])));
                                            $(eleUOM).empty();
                                            FormElementControl.loadInitS2($(eleUOM), [price?.['uom']], {'group': price?.['uom']?.['uom_group']?.['id']});
                                            $(eleUOM).change();
                                            $(eleUOM).attr('disabled', 'true');
                                        }
                                    }
                                    $(modalBody).append(`${htmlPriceList}`);
                                    $.fn.initMaskMoney2();
                                    POCalculateHandle.calculateMain($table, row);
                                }
                                // mask money
                                $.fn.initMaskMoney2();
                            }
                        }
                    }
                )
            }
        }
        return true
    };

    static loadCheckPQ(ele) {
        POLoadDataHandle.loadUpdateDataPQ(ele);
        POLoadDataHandle.loadSupplierContactByCheckedQuotation(ele);
        POLoadDataHandle.loadDataByCheckedQuotation(ele);
        if (ele.checked === true) {
            for (let item of POLoadDataHandle.$elePQ[0].querySelectorAll('.checkbox-quotation')) {
                if (item.getAttribute('data-id') !== ele.getAttribute('data-id')) {
                    item.checked = false;
                }
            }
        }
        PODataTableHandle.$tablePOByRequest.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.btn-view-price')) {
                POLoadDataHandle.loadPriceListPQ(row.querySelector('.btn-view-price'));
            }
        });
        return true;
    }

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
            POLoadDataHandle.loadTableProductByPurchaseRequest();
            if (isProductNotIn === true) {
                $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-product-not-in') + ' ' + POLoadDataHandle.transEle.attr('data-purchase-quotation')}, 'failure');
                return false;
            }
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
            let supplierData = JSON.parse(ele.getAttribute('data-supplier'));
            // load supplier by Purchase Quotation
            FormElementControl.loadInitS2(POLoadDataHandle.supplierSelectEle, [supplierData], {'account_types_mapped__account_type_order': 1}, null, true);
            FormElementControl.loadInitS2(POLoadDataHandle.contactSelectEle, [supplierData?.['owner']], {'account_name_id': supplierData?.['id']});
        }
        return true
    };

    static loadDataWhenClearPR(is_clear_all = false) {
        // Load again data & events relate with Purchase Request
        $('#purchase-order-purchase-request').empty();
        POLoadDataHandle.loadModalPurchaseRequestTable(is_clear_all);
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

    static loadCssToDTScrollBody() {
        let tableAddWrapper = document.getElementById('datable-purchase-order-product-add_wrapper');
        let tablePRWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
        if (tableAddWrapper) {
            let tableAddBd = tableAddWrapper.querySelector('.dataTables_scrollBody');
            if (tableAddBd) {
                tableAddBd.style.minHeight = '100px';
            }
        }
        if (tablePRWrapper) {
            let tablePRBd = tablePRWrapper.querySelector('.dataTables_scrollBody');
            if (tablePRBd) {
                tablePRBd.style.minHeight = '100px';
            }
        }
    };

    static loadResetPQAndPriceList() {
        // reset PQ
        let $tableProductPR = $('#datable-purchase-order-product-request');
        let $tableProductAdd = $('#datable-purchase-order-product-add');
        let $tablePQ = $('#datable-purchase-quotation');
        $tablePQ.DataTable().clear().draw();
        if ($tableProductPR.DataTable().rows().count() !== 0 || $tableProductAdd.DataTable().rows().count() !== 0) {
            POLoadDataHandle.loadModalPurchaseQuotation();
        }
        let $elePQ = $('#purchase-order-purchase-quotation');
        $elePQ.empty();
        POLoadDataHandle.PQDataEle.val('');
        // clear prices by PQ
        let $table = $tableProductAdd;
        if (POLoadDataHandle.PRDataEle.val()) { // PO PR products
            $table = $tableProductPR;
        }
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let elePrice = row.querySelector('.table-row-price');
            let elePriceList = row.querySelector('.table-row-price-list');
            elePrice.removeAttribute('disabled');
            $(elePrice).attr('value', String(0));
            $(elePriceList).empty();
            $.fn.initMaskMoney2();
            POCalculateHandle.calculateMain($table, row);
        });
        // reset status
        let tablePRProduct = $('#datable-purchase-request-product');
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
        return true;
    };

    static loadCssToDtb(tableID) {
        let tableIDWrapper = tableID + '_wrapper';
        let tableWrapper = document.getElementById(tableIDWrapper);
        if (tableWrapper) {
            let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
            if (headerToolbar) {
                headerToolbar.classList.add('hidden');
            }
        }
    };

    static loadReInitDataTablePayment() {
        let tableData = [];
        let dataDetail = {};
        if (POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#data-detail-page');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
                    tableData = dataDetail?.['purchase_order_payment_stage'];
                }
            }
        } else {
            PODataTableHandle.$tablePayment.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = PODataTableHandle.$tablePayment.DataTable().row(row).index();
                let $row = PODataTableHandle.$tablePayment.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let detailDataEle = $('#data-detail-page');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
                        tableData = dataDetail?.['purchase_order_payment_stage'];
                    }
                }
            }
        }
        PODataTableHandle.dataTablePaymentStage(tableData);
        if (POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            POLoadDataHandle.loadTableDisabled(PODataTableHandle.$tablePayment);
        }
        POLoadDataHandle.loadDropDowns(PODataTableHandle.$tablePayment);
        $.fn.initMaskMoney2();
        return true;
    };

    static loadReInitDataTableInvoice() {
        let tableData = [];
        let dataDetail = {};
        if (POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#data-detail-page');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
                    tableData = dataDetail?.['purchase_order_invoice'];
                }
            }
        } else {
            PODataTableHandle.$tableInvoice.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = PODataTableHandle.$tableInvoice.DataTable().row(row).index();
                let $row = PODataTableHandle.$tableInvoice.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let detailDataEle = $('#data-detail-page');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
                        tableData = dataDetail?.['purchase_order_invoice'];
                    }
                }
            }
        }
        PODataTableHandle.dataTableInvoice(tableData);
        if (POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            POLoadDataHandle.loadTableDisabled(PODataTableHandle.$tableInvoice);
        }
        $.fn.initMaskMoney2();
        return true;
    };

    static loadChangePaymentTerm() {
        if (POLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            PODataTableHandle.$tableInvoice.DataTable().clear().draw();
            PODataTableHandle.$tablePayment.DataTable().clear().draw();
        }
        return true;
    };

    // TABLE PAYMENT STAGE
    static loadAddPaymentStage() {
        let order = PODataTableHandle.$tablePayment[0].querySelectorAll('.table-row-order').length + 1;
        let dataAdd = {
            'order': order,
            'ratio': 0,
            'value_before_tax': 0,
            'is_ap_invoice': false,
        };
        PODataTableHandle.$tablePayment.DataTable().row.add(dataAdd).draw().node();
        // mask money
        $.fn.initMaskMoney2();
        return true;
    };

    static loadPaymentStage() {
        let datas = [];
        PODataTableHandle.$tablePayment.DataTable().clear().draw();
        PODataTableHandle.$tablePayment.DataTable().rows.add(datas).draw();

        PODataTableHandle.$tablePayment.DataTable().rows().every(function () {
            let row = this.node();
            let installmentEle = row.querySelector('.table-row-installment');
            if (installmentEle) {
                $(installmentEle).trigger('change');
            }
        })
        return true;
    };

    static loadChangeInstallment(ele) {
        let row = ele.closest('tr');
        let dataDateType = JSON.parse($('#payment_date_type').text());
        let remarkELe = row.querySelector('.table-row-remark');
        let ratioEle = row.querySelector('.table-row-ratio');
        let eleDate = row.querySelector('.table-row-date');
        let valBeforeEle = row.querySelector('.table-row-value-before-tax');
        let valTotalEle = row.querySelector('.table-row-value-total');
        let dueDateEle = row.querySelector('.table-row-due-date');
        if ($(ele).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx($(ele), $(ele).val());
            if (remarkELe && ratioEle && eleDate && valBeforeEle && valTotalEle && dueDateEle && dataSelected && dataDateType) {
                $(remarkELe).val(dataDateType[dataSelected?.['after']][1]);
                ratioEle.setAttribute('readonly', 'true');
                $(ratioEle).val('');
                if (dataSelected?.['value']) {
                    if (dataSelected?.['unit_type'] === 0 || dataSelected?.['unit_type'] === 2) {
                        $(ratioEle).val(parseFloat(dataSelected?.['value']));
                        POLoadDataHandle.loadPaymentValues(ratioEle);
                    }
                    if (dataSelected?.['unit_type'] === 1) {
                        $(valBeforeEle).attr('value', String(dataSelected?.['value']));
                        $(valTotalEle).attr('value', String(dataSelected?.['value']));
                    }
                }
                dueDateEle.setAttribute('disabled', 'true');
                let date = $(eleDate).val();
                if (date && dataSelected?.['no_of_days']) {
                    let dueDate = calculateDate(date, {'number_day_after': parseInt(dataSelected?.['no_of_days'])});
                    if (dueDate) {
                        $(dueDateEle).val(dueDate);
                    }
                }
            }
        } else {
            if (ratioEle && valBeforeEle && dueDateEle) {
                if (["post", "put"].includes(POLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    ratioEle.removeAttribute('readonly');
                    dueDateEle.removeAttribute('disabled');
                }
            }
        }
        // mask money
        $.fn.initMaskMoney2();
        return true;
    };

    static loadChangePSDate(ele) {
        let row = ele.closest('tr');
        let eleDueDate = row.querySelector('.table-row-due-date');
        let eleInstallment = row.querySelector('.table-row-installment');
        if (eleDueDate && eleInstallment) {
            if ($(eleInstallment).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx($(eleInstallment), $(eleInstallment).val());
                if (dataSelected) {
                    let date = $(ele).val();
                    if (date && dataSelected?.['no_of_days']) {
                        let dueDate = calculateDate(date, {'number_day_after': parseInt(dataSelected?.['no_of_days'])});
                        if (dueDate) {
                            $(eleDueDate).val(dueDate);
                        }
                    }
                }
            }
        }
        return true;
    };

    static loadChangePSIssueInvoice(ele) {
        let rowFocus = ele.closest('tr');
        if (rowFocus) {
            let issueTarget = $(ele).val();
            let eleValueATFocus = rowFocus.querySelector('.table-row-value-after-tax');
            if (eleValueATFocus) {

                if (!issueTarget) {
                    $(eleValueATFocus).attr('hidden', 'true');
                    $(eleValueATFocus).attr('value', String(0));
                    // mask money
                    $.fn.initMaskMoney2();
                    let issueTarget = parseInt($(ele).val());
                    PODataTableHandle.$tablePayment.DataTable().rows().every(function () {
                        let row = this.node();
                        let eleIssueInvoice = row.querySelector('.table-row-issue-invoice');
                        if (eleIssueInvoice) {
                            if (eleIssueInvoice !== ele) {
                                if ($(eleIssueInvoice).val()) {
                                    let issue = parseInt($(eleIssueInvoice).val());
                                    // check other different issue -> trigger change
                                    if (issue !== issueTarget) {
                                        $(eleIssueInvoice).trigger('change');
                                    }
                                }
                            }
                        }
                    });
                    return true;
                }
                if (issueTarget) {
                    let countInvoiceIssue = 0;
                    let countInvoiceVal0 = 0;
                    PODataTableHandle.$tablePayment.DataTable().rows().every(function () {
                        let row = this.node();
                        let invoiceIssueEle = row.querySelector('.table-row-issue-invoice');
                        let invoiceValueEle = row.querySelector('.table-row-value-after-tax');
                        if (invoiceIssueEle && invoiceValueEle) {
                            let issue = $(invoiceIssueEle).val();
                            let value = $(invoiceValueEle).valCurrency();
                            if (issue === issueTarget) {
                                countInvoiceIssue++;
                                if (value === 0) {
                                    $(invoiceValueEle).attr('hidden', 'true');
                                    countInvoiceVal0++;
                                }
                                if (value !== 0) {
                                    $(invoiceValueEle).removeAttr('hidden');
                                }
                            }
                        }
                    });
                    if (countInvoiceIssue === 1) {
                        $(eleValueATFocus).removeAttr('hidden');
                    }
                    if (countInvoiceIssue > 1) {
                        if (countInvoiceIssue === countInvoiceVal0) {
                            $(ele).val("").trigger('change');
                            $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-invalid')}, 'failure');
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    };

    static loadPaymentValues(ele) {
        let row = ele.closest('tr');
        if (row) {
            let ratioEle = row.querySelector('.table-row-ratio');
            let valBeforeEle = row.querySelector('.table-row-value-before-tax');
            let valReconcileEle = row.querySelector('.table-row-value-reconcile');
            let taxEle = row.querySelector('.table-row-tax');
            let valTaxEle = row.querySelector('.table-row-value-tax');
            let valTotalEle = row.querySelector('.table-row-value-total');
            if (ratioEle && valBeforeEle && valReconcileEle && taxEle && valTaxEle && valTotalEle) {
                let valBefore = $(valBeforeEle).valCurrency();
                if ($(ratioEle).val()) {
                    let ratio = parseFloat($(ratioEle).val());
                    if (ratio > 0) {
                        let tableWrapper = document.getElementById('datable-purchase-order-product-add_wrapper');
                        if (POLoadDataHandle.PRDataEle.val()) {
                            tableWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
                        }
                        if (tableWrapper) {
                            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
                            if (tableFt) {
                                let elePretaxAmountRaw = tableFt.querySelector('.purchase-order-product-pretax-amount-raw');
                                if ($(elePretaxAmountRaw).val() && $(ratioEle).val()) {
                                    valBefore = parseFloat($(elePretaxAmountRaw).val()) * parseFloat($(ratioEle).val()) / 100;
                                }
                            }
                        }
                    }
                }
                $(valBeforeEle).attr('value', valBefore);
                $(valTotalEle).attr('value', valBefore + $(valTaxEle).valCurrency());
                let taxData = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                if (taxData?.['rate']) {
                    let datasRelateTax1 = POCalculateHandle.getDatasRelateTax(valBefore, taxData?.['rate']);
                    $(valTaxEle).attr('value', datasRelateTax1?.['valTax']);
                    $(valTotalEle).attr('value', datasRelateTax1?.['valAfter']);

                    if ($(valReconcileEle).valCurrency() > 0) {
                        let datasRelateTax2 = POCalculateHandle.getDatasRelateTax($(valReconcileEle).valCurrency(), taxData?.['rate']);
                        $(valTaxEle).attr('value', datasRelateTax1?.['valTax'] + datasRelateTax2?.['valTax']);
                        $(valTotalEle).attr('value', datasRelateTax1?.['valAfter'] + datasRelateTax2?.['valTax']);
                    }
                }
                // mask money
                $.fn.initMaskMoney2();
            }
        }
        return true;
    };

    static loadAddInvoice() {
        let total = 0;
        PODataTableHandle.$tableInvoice.DataTable().rows().every(function () {
            let row = this.node();
            let totalEle = row.querySelector('.table-row-total');
            if (totalEle) {
                if ($(totalEle).valCurrency()) {
                    total += $(totalEle).valCurrency();
                }
            }
        });
        if (total > 0) {
            let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
                    let totalSOEle = tableProductFt.querySelector('.quotation-create-product-total-raw');
                    if (totalSOEle) {
                        let totalSO = parseFloat(totalSOEle.value);
                        if (total >= totalSO) {
                            $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-paid-in-full')}, 'failure');
                            return false;
                        }
                    }
                }
            }
        }

        let orderEleList = PODataTableHandle.$tableInvoice[0].querySelectorAll('.table-row-order');

        PODataTableHandle.$tableInvoice.DataTable().row.add({"order": (orderEleList.length + 1)}).draw();
        return true;
    };

    static loadSaveSTerm() {
        let target = PODataTableHandle.$tableInvoice[0].querySelector(`[data-id="${POLoadDataHandle.$btnSaveTerm.attr('data-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let termDataEle = targetRow.querySelector('.table-row-term-data');
                let ratioEle = targetRow.querySelector('.table-row-ratio');
                let totalEle = targetRow.querySelector('.table-row-total');
                let balanceEle = targetRow.querySelector('.table-row-balance');
                if (termDataEle && ratioEle && totalEle && balanceEle) {
                    let termData = [];
                    let ratio = 0;
                    let amount = 0;
                    for (let checkedEle of PODataTableHandle.$tableSTerm[0].querySelectorAll('.table-row-checkbox:checked')) {
                        let row = checkedEle.closest('tr');
                        if (row) {
                            let rowIndex = PODataTableHandle.$tableSTerm.DataTable().row(row).index();
                            let $row = PODataTableHandle.$tableSTerm.DataTable().row(rowIndex);
                            let dataRow = $row.data();
                            termData.push(dataRow);
                            if (dataRow?.['unit_type'] === 0 || dataRow?.['unit_type'] === 2) {
                                ratio += parseFloat(dataRow?.['value'] ? dataRow?.['value'] : "0");
                            }
                            if (dataRow?.['unit_type'] === 1) {
                                amount += parseFloat(dataRow?.['value'] ? dataRow?.['value'] : "0");
                            }
                        }
                    }
                    $(termDataEle).val(JSON.stringify(termData));
                    $(ratioEle).val('');
                    $(totalEle).attr('value', String(0));
                    $(balanceEle).attr('value', String(0));
                    $.fn.initMaskMoney2();
                    if (ratio > 0) {
                        $(ratioEle).val(ratio);
                        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
                        if (tableProductWrapper) {
                            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                            if (tableProductFt) {
                                let totalSOEle = tableProductFt.querySelector('.quotation-create-product-total-raw');
                                if (totalSOEle) {
                                    let totalSO = parseFloat(totalSOEle.value);
                                    let total = (ratio * totalSO) / 100;
                                    $(totalEle).attr('value', String(total));
                                    $(balanceEle).attr('value', String(total));
                                    $.fn.initMaskMoney2();
                                }
                            }
                        }
                    }
                    if (amount > 0) {
                        $(totalEle).attr('value', String($(totalEle).valCurrency() + amount));
                        $(balanceEle).attr('value', String($(balanceEle).valCurrency() + amount));
                        $.fn.initMaskMoney2();
                    }
                }
            }
        }
        return true;
    };

    static loadSaveSInvoice() {
        let target = PODataTableHandle.$tablePayment[0].querySelector(`[data-id="${POLoadDataHandle.$btnSaveInvoice.attr('data-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let dateEle = targetRow.querySelector('.table-row-date');
                let invoiceEle = targetRow.querySelector('.table-row-invoice');
                let invoiceDataEle = targetRow.querySelector('.table-row-invoice-data');
                let valBeforeEle = targetRow.querySelector('.table-row-value-before-tax');
                let taxEle = targetRow.querySelector('.table-row-tax');
                let valTaxEle = targetRow.querySelector('.table-row-value-tax');
                let valTotalEle = targetRow.querySelector('.table-row-value-total');

                let checkedEle = PODataTableHandle.$tableSInvoice[0].querySelector('.table-row-checkbox:checked');
                if (checkedEle && dateEle && invoiceEle && invoiceDataEle && valBeforeEle && taxEle && valTaxEle && valTotalEle) {
                    let row = checkedEle.closest('tr');
                    if (row) {
                        let rowIndex = PODataTableHandle.$tableSInvoice.DataTable().row(row).index();
                        let $row = PODataTableHandle.$tableSInvoice.DataTable().row(rowIndex);
                        let dataRow = $row.data();

                        $(dateEle).val(moment(dataRow?.['date']).format('DD/MM/YYYY')).trigger('change');
                        $(invoiceEle).val(dataRow?.['order']);
                        $(invoiceDataEle).val(JSON.stringify(dataRow));
                        FormElementControl.loadInitS2($(taxEle), [dataRow?.['tax_data']]);

                        $(valBeforeEle).trigger('change');
                    }
                }
            }
        }
        return true;
    };

    static loadSaveSReconcile() {
        let target = PODataTableHandle.$tablePayment[0].querySelector(`[data-id="${POLoadDataHandle.$btnSaveReconcile.attr('data-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let valBeforeEle = targetRow.querySelector('.table-row-value-before-tax');
                let valReconcileEle = targetRow.querySelector('.table-row-value-reconcile');
                let reconcileDataEle = targetRow.querySelector('.table-row-reconcile-data');
                let reconcile = 0;
                let reconcileData = [];
                for (let checkedEle of PODataTableHandle.$tableSReconcile[0].querySelectorAll('.table-row-checkbox:checked')) {
                    let row = checkedEle.closest('tr');
                    let rowIndex = PODataTableHandle.$tableSReconcile.DataTable().row(row).index();
                    let $row = PODataTableHandle.$tableSReconcile.DataTable().row(rowIndex);
                    let dataRow = $row.data();
                    reconcile += dataRow?.['value_total'];
                    reconcileData.push(dataRow);
                }
                if (valBeforeEle && valReconcileEle && reconcileDataEle) {
                    $(valReconcileEle).attr('value', reconcile);
                    $.fn.initMaskMoney2();
                    $(valBeforeEle).trigger('change');
                    $(reconcileDataEle).val(JSON.stringify(reconcileData));
                }
            }
        }
        return true;
    };

    static loadMinusBalance() {
        PODataTableHandle.$tableInvoice.DataTable().rows().every(function () {
            let rowI = this.node();
            let rowIndex = PODataTableHandle.$tableInvoice.DataTable().row(rowI).index();
            let $row = PODataTableHandle.$tableInvoice.DataTable().row(rowIndex);
            let dataRow = $row.data();

            let totalEle = rowI.querySelector('.table-row-total');
            let balanceEle = rowI.querySelector('.table-row-balance');
            if (totalEle && balanceEle) {
                $(balanceEle).attr('value', String($(totalEle).valCurrency()));
                $.fn.initMaskMoney2();
                let balance = 0;

                PODataTableHandle.$tablePayment.DataTable().rows().every(function () {
                    let rowP = this.node();
                    let invoiceDataEle = rowP.querySelector('.table-row-invoice-data');
                    let valBeforeEle = rowP.querySelector('.table-row-value-before-tax');
                    let valReconcileEle = rowP.querySelector('.table-row-value-reconcile');
                    let valTaxEle = rowP.querySelector('.table-row-value-tax');
                    if (invoiceDataEle && valBeforeEle && valReconcileEle && valTaxEle) {
                        if ($(invoiceDataEle).val()) {
                            let invoiceData = JSON.parse($(invoiceDataEle).val());
                            let before = parseFloat($(valBeforeEle).valCurrency());
                            let reconcile = parseFloat($(valReconcileEle).valCurrency());
                            let tax = parseFloat($(valTaxEle).valCurrency());
                            if (dataRow?.['order'] === invoiceData?.['order']) {
                                balance += (before + reconcile + tax);
                            }
                        }
                    }

                });
                $(balanceEle).attr('value', String($(balanceEle).valCurrency() - balance));
                $.fn.initMaskMoney2();
            }
        });
        POStoreDataHandle.storeDtbData(4);
    };

    static loadCheckSameMixTax() {
        let listTaxID = [];
        let listTax = [];
        PODataTableHandle.$tablePOByAdd.DataTable().rows().every(function () {
            let row = this.node();
            let taxEle = row.querySelector('.table-row-tax');
            if (taxEle) {
                if ($(taxEle).val()) {
                    let taxData = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                    listTaxID.push(taxData?.['id']);
                    listTax.push(taxData);
                }
            }
        });
        return {"check": listTaxID.every(val => val === listTaxID[0]) ? "same" : "mixed", "list_tax": listTax};
    };

    // LOAD DETAIL
    static loadDetailPage(data) {
        $('#data-detail-page').val(JSON.stringify(data));
        $('#purchase-order-title').val(data?.['title']);
        let delivered_date = '';
        if (data?.['delivered_date']) {
            delivered_date = data?.['delivered_date'];
            $('#purchase-order-date-delivered').val(moment(delivered_date).format('DD/MM/YYYY'));
        }

        POLoadDataHandle.loadDataShowPRPQ(data);
        POLoadDataHandle.loadModalPurchaseRequestProductTable(false, data);
        POLoadDataHandle.loadModalPurchaseQuotation(false, data);
        POLoadDataHandle.loadTablesDetailPage(data);
        POLoadDataHandle.loadAllTablesDisabled();
        POLoadDataHandle.loadTotals(data);

        FormElementControl.loadInitS2(POLoadDataHandle.supplierSelectEle, [data?.['supplier_data']], {'account_types_mapped__account_type_order': 1}, null, true);
        FormElementControl.loadInitS2(POLoadDataHandle.contactSelectEle, [data?.['contact_data']]);
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
                elePRAppend += `<div class="chip chip-secondary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                    <span>
                                        <a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${prCode}</span></a>
                                    </span>
                                </div>`;
            } else {
                elePRAppend += `<div class="chip chip-secondary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                    <span>
                                        <a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${prCode}</span></a>
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
                    elePQAppend += `<div class="chip chip-secondary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                        <span>
                                            <div class="form-check">
                                                <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" disabled>
                                                <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                            </div>
                                        </span>
                                    </div>`;
                } else {
                    elePQAppend += `<div class="chip chip-secondary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                        <span>
                                            <div class="form-check">
                                                <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" checked disabled>
                                                <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                            </div>
                                        </span>
                                    </div>`;
                }
            } else {
                if (dataPQ?.['is_use'] === false) {
                    elePQAppend += `<div class="chip chip-secondary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                        <span>
                                            <div class="form-check">
                                                <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1">
                                                <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                            </div>
                                        </span>
                                    </div>`;
                } else {
                    elePQAppend += `<div class="chip chip-secondary chip-dismissable bg-green-light-5 mr-1 mb-1">
                                        <span>
                                            <div class="form-check">
                                                <input class="form-check-input checkbox-circle checkbox-quotation" type="checkbox" data-id="${pqID}" data-code="${pqCode}" data-supplier="${pqSupplierStr}" value="option1" checked>
                                                <label class="form-check-label"><a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${pqCode}</span></a></label>
                                            </div>
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
            PRProductIDList.push(PRProduct?.['purchase_request_product']?.['id']);
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
        let tableProductAdd = $('#datable-purchase-order-product-add');
        let tableProductRequest = $('#datable-purchase-order-product-request');
        let tablePaymentStage = $('#datable-po-payment-stage');
        if (data?.['purchase_requests_data'].length > 0) {
            POLoadDataHandle.eleDivTablePOProductAdd[0].setAttribute('hidden', 'true');
            POLoadDataHandle.eleDivTablePOProductRequest[0].removeAttribute('hidden');
            tableProductRequest.DataTable().rows.add(data?.['purchase_order_products_data']).draw();
            POLoadDataHandle.loadDataRowTable(tableProductRequest);
        } else {
            POLoadDataHandle.eleDivTablePOProductRequest[0].setAttribute('hidden', 'true');
            POLoadDataHandle.eleDivTablePOProductAdd[0].removeAttribute('hidden');
            tableProductAdd.DataTable().rows.add(data?.['purchase_order_products_data']).draw();
            POLoadDataHandle.loadDataRowTable(tableProductAdd);
        }
        // payment stage
        if (data?.['purchase_order_payment_stage']) {
            PODataTableHandle.$tablePayment.DataTable().clear().draw();
            PODataTableHandle.$tablePayment.DataTable().rows.add(data?.['purchase_order_payment_stage']).draw();
        }
        if (data?.['purchase_order_invoice']) {
            PODataTableHandle.$tableInvoice.DataTable().clear().draw();
            PODataTableHandle.$tableInvoice.DataTable().rows.add(data?.['purchase_order_invoice']).draw();
        }
        POLoadDataHandle.loadTableDropDowns();
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

    static loadAllTablesDisabled() {
        let form = $('#frm_purchase_order_create');
        if (form.attr('data-method').toLowerCase() === 'get') {
            POLoadDataHandle.loadTableDisabled(PODataTableHandle.$tablePOByAdd);
            POLoadDataHandle.loadTableDisabled(PODataTableHandle.$tablePOByRequest);
            POLoadDataHandle.loadTableDisabled(PODataTableHandle.$tablePayment);
            POLoadDataHandle.loadTableDisabled(PODataTableHandle.$tableInvoice);
        }
        return true;
    };

    static loadTableDisabled(table) {
        for (let ele of table[0].querySelectorAll('.table-row-item')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-shipping')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-description')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-uom-order-actual')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-quantity-order-actual')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-price')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('disabled-custom-show');
        }
        for (let ele of table[0].querySelectorAll('.input-group-price')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-checkbox')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-quantity-order')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.del-row')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-remark')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-ratio')) {
            ele.setAttribute('readonly', 'true');
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
        for (let ele of table[0].querySelectorAll('.table-row-total')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-before-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-total')) {
            ele.setAttribute('readonly', 'true');
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
                        FormElementControl.loadInitS2($(row.querySelector('.table-row-tax')), [dataRow?.['tax']]);
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
    static $tablePOByRequest = $('#datable-purchase-order-product-request');
    static $tablePOByAdd = $('#datable-purchase-order-product-add');
    static $tablePayment = $('#datable-quotation-payment-stage');
    static $tableInvoice = $('#datable-quotation-invoice');
    static $tableSInvoice = $('#table-select-invoice');
    static $tableSReconcile = $('#table-select-reconcile');

    static dataTablePurchaseRequest() {
        let $table = $('#datable-purchase-request');
        let frm = new SetupFormSubmit($table);
        $table.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                data: {'is_all_ordered': false, 'system_status': 3},
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('purchase_request_sale_list')) {
                        let fnData = [];
                        for (let prData of resp.data['purchase_request_sale_list']) {
                            if ([1, 2, 3].includes(prData?.['request_for'])) {
                                fnData.push(prData);
                            }
                            if (prData?.['request_for'] === 0) {
                                if (prData?.['sale_order']?.['is_deal_closed'] === false) {
                                    fnData.push(prData);
                                }
                            }
                        }
                        return fnData;
                    }
                    throw Error('Call data raise errors.')
                },
            },
            autoWidth: true,
            scrollX: true,
            scrollY: "60vh",
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let checked = '';
                        let disabled = '';
                        if (POLoadDataHandle.PRDataEle.val()) {
                            let PRIDList = JSON.parse(POLoadDataHandle.PRDataEle.val());
                            if (PRIDList.includes(row?.['id'])) {
                                checked = 'checked';
                            }
                        }
                        if ($('#frm_purchase_order_create').attr('data-method').toLowerCase() === 'get') {
                            disabled = 'disabled';
                        }
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox" id="pr-${row?.['id'].replace(/-/g, "")}" data-id="${row?.['id']}" ${checked} ${disabled}>
                                    <label class="form-check-label table-row-title" for="pr-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                </div>`;
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-code">${row?.['code'] ? row?.['code'] : ''}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                POLoadDataHandle.loadCssToDtb('datable-purchase-request');
                POLoadDataHandle.loadEventCheckbox($table, true);
                PODataTableHandle.dtbPurchaseRequestHDCustom();
            },
        });
    };

    static dataTablePurchaseRequestProduct(data) {
        let $table = $('#datable-purchase-request-product');
        $table.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "60vh",
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '30%',
                    render: (data, type, row) => {
                        let checked = '';
                        let disabled = '';
                        let purchase_request_id = '';
                        if (Object.keys(row?.['purchase_request']).length !== 0) {
                            purchase_request_id = row?.['purchase_request']?.['id'];
                        }
                        if (row?.['is_checked']) {
                            checked = 'checked';
                        }
                        if ($('#frm_purchase_order_create').attr('data-method').toLowerCase() === 'get') {
                            disabled = 'disabled';
                        }
                        return `<div class="form-check form-check-lg">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        id="pr-pro-${row?.['product']?.['id'].replace(/-/g, "")}-${purchase_request_id.replace(/-/g, "")}"
                                        data-id="${row?.['id']}" 
                                        data-purchase-request-id="${purchase_request_id}"
                                        data-sale-order-product-id="${row?.['sale_order_product_id']}"
                                        ${checked}
                                        ${disabled}
                                    >
                                    <label class="form-check-label table-row-item" for="pr-pro-${row?.['product']?.['id'].replace(/-/g, "")}-${purchase_request_id.replace(/-/g, "")}" id="${row?.['product']?.['id']}">${row?.['product']?.['title']}</label>
                                </div>`;
                    },
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['purchase_request']?.['code']}</span>`
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-uom-request" id="${row.uom.id}">${row.uom.title}</span>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-request">${row.quantity}</span>`
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-remain">${row?.['remain_for_purchase_order']}</span>`
                    }
                },
                {
                    targets: 6,
                    width: '15%',
                    render: (data, type, row) => {
                        if ($('#frm_purchase_order_create').attr('data-method') !== 'GET') {
                            if (row.hasOwnProperty('quantity_order')) {
                                return `<input type="text" class="form-control valid-num table-row-quantity-order" value="${row?.['quantity_order']}">`;
                            } else {
                                return `<input type="text" class="form-control valid-num table-row-quantity-order" value="0">`;
                            }
                        } else {
                            if (row.hasOwnProperty('quantity_order')) {
                                return `<input type="text" class="form-control valid-num table-row-quantity-order" value="${row?.['quantity_order']}" disabled>`;
                            } else {
                                return `<input type="text" class="form-control valid-num table-row-quantity-order" value="0" disabled>`;
                            }
                        }
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                POLoadDataHandle.loadCssToDtb('datable-purchase-request-product');
                POLoadDataHandle.loadEventCheckbox($table);
                PODataTableHandle.dtbPurchaseRequestProductHDCustom();
            },
        });
    };

    static dataTablePurchaseRequestProductMerge(data) {
        let $table = $('#datable-purchase-request-product-merge');
        $table.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '25%',
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" class="form-check-input table-row-checkbox" data-id="${row?.['id']}" checked disabled>
                                    <label class="form-check-label table-row-title">${row?.['product_title']}</label>
                                </div>`;
                    },
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        let codeList = ``;
                        for (let item of row?.['code_list']) {
                            codeList += `<span class="dropdown-item">${item}</span>`
                        }
                        return `<button
                                    type="button"
                                    class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover"
                                    aria-expanded="false"
                                    data-bs-toggle="dropdown"
                                ><span class="icon"><i class="fas fa-ellipsis-h"></i></span></button>
                                <div role="menu" class="dropdown-menu">
                                    ${codeList}
                                </div>`
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-uom-request">${row?.['uom_order_request']?.['title']}</span>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-request">${row?.['product_quantity_request']}</span>`
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-remain">${row?.['remain']}</span>`
                    }
                },
                {
                    targets: 6,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-order">${row?.['product_quantity_order_actual']}</span>`
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                POLoadDataHandle.loadCssToDtb('datable-purchase-request-product-merge');
                PODataTableHandle.dtbPurchaseRequestProductMergeHDCustom();
            },
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
                        return `<span class="table-row-order" id="${row?.['id']}" data-row="${dataRow}">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (row?.['title'] && row?.['code']) {
                            let checked = '';
                            let disabled = '';
                            if (row?.['is_checked']) {
                                checked = 'checked';
                            }
                            if ($('#frm_purchase_order_create').attr('data-method').toLowerCase() === 'get') {
                                disabled = 'disabled';
                            }
                            return `<div class="form-check form-check-lg">
                                        <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox" id="pq-${row?.['id'].replace(/-/g, "")}" data-id="${row?.['id']}" ${checked} ${disabled}>
                                        <span class="badge badge-soft-success table-row-code">${row?.['code'] ? row?.['code'] : ''}</span>
                                        <label class="form-check-label table-row-title" for="pq-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                    </div>`;
                        }
                        return ``;
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let dataSupplier = JSON.stringify(row?.['supplier_mapped']).replace(/"/g, "&quot;");
                        if (row?.['supplier_mapped']?.['name'] && row?.['supplier_mapped']?.['code']) {
                            return `<span class="badge badge-light">${row?.['supplier_mapped']?.['code'] ? row?.['supplier_mapped']?.['code'] : ''}</span>
                                    <span class="table-row-supplier" data-supplier="${dataSupplier}" id="${row?.['supplier_mapped']?.['id']}">${row?.['supplier_mapped']?.['name']}</span>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-purchase-quotation-request">${row?.['purchase_quotation_request_mapped']?.['code'] ? row?.['purchase_quotation_request_mapped']?.['code'] : ''}</span>`
                    }
                },
            ],
            drawCallback: function () {
                POLoadDataHandle.loadEventCheckbox($table);
            },
        });
    };

    static dataTablePurchaseOrderProductRequest(data) {
        PODataTableHandle.$tablePOByRequest.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [  // 25,325,325,100,100,100,125,125,300,125,270 (1920p)
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" id="${row?.['id']}" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-item-show zone-readonly" rows="2" readonly>${row?.['product']?.['title']}</textarea>
                                <div class="row table-row-item-area hidden">
                                    <div class="col-12 col-md-12 col-lg-12">
                                        <select
                                            class="form-select table-row-item"
                                            data-product-id="${row?.['product']?.['id']}"
                                            data-url="${PODataTableHandle.productInitEle.attr('data-url')}"
                                            data-link-detail="${PODataTableHandle.productInitEle.attr('data-link-detail')}"
                                            data-method="${PODataTableHandle.productInitEle.attr('data-method')}"
                                            data-keyResp="product_sale_list"
                                            required
                                            readonly
                                        >
                                        </select>
                                    </div>
                                </div>`;
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<div class="row"><textarea class="table-row-description form-control" rows="2" readonly>${row?.['product']?.['description'] ? row?.['product']?.['description'] : ''}</textarea></div>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let dataStr = JSON.stringify(row?.['uom_order_request']).replace(/"/g, "&quot;");
                        return `<span class="table-row-uom-order-request" id="${row?.['uom_order_request']?.['id']}">${row?.['uom_order_request']?.['title']}<input type="hidden" class="data-info" value="${dataStr}"></span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-order-request">${row?.['product_quantity_order_request']}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-stock">${row?.['stock']}</span>`
                    }
                },
                {
                    targets: 6,
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
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control valid-num table-row-quantity-order-actual valid-num" value="${row?.['product_quantity_order_actual']}" required>
                                </div>`;
                    }
                },
                {
                    targets: 8,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <div class="dropend">
                                        <div class="input-group input-group-price">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-price" 
                                                value="${row?.['product_unit_price']}"
                                                data-return-type="number"
                                            >
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-light btn-view-price"
                                                data-bs-toggle="modal"
                                                data-bs-target="#viewPriceModal"
                                            ><i class="fas fa-ellipsis-h"></i>
                                            </button>
                                        </div>
                                    </div>`;
                    }
                },
                {
                    targets: 9,
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
                PODataTableHandle.dtbProductRequestHDCustom();
            },
        });
    };

    static dataTablePurchaseOrderProductAdd(data) {
        PODataTableHandle.$tablePOByAdd.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [  // 25,325,325,150,175,325,150,270,25 (1920p)
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" id="${row.id}" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        if (row?.['is_shipping'] === true) {
                            return `<input type="text" class="form-control table-row-shipping" value="${row?.['shipping_title'] ? row?.['shipping_title'] : ''}" required>`;
                        }
                        return `<div class="row table-row-item-area">
                                    <div class="col-12 col-md-12 col-lg-12">
                                        <select 
                                            class="form-select table-row-item"
                                            data-url="${PODataTableHandle.productInitEle.attr('data-url')}"
                                            data-method="GET"
                                            data-keyResp="product_sale_list"
                                            required
                                        ></select>
                                    </div>
                                </div>`;
                    },
                },
                {
                    targets: 2,
                    width: '18%',
                    render: (data, type, row) => {
                        let readonly = "readonly";
                        if (row?.['is_shipping'] === true) {
                            readonly = "";
                        }
                        let des = '';
                        if (row?.['product']?.['description']) {
                            if (row?.['product']?.['description'] !== '') {
                                des = row?.['product']?.['description'];
                            }
                        }
                        return `<textarea class="table-row-description form-control" rows="2" ${readonly}>${des}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
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
                                    <input type="text" class="form-control valid-num table-row-quantity-order-actual valid-num" value="${row?.['product_quantity_order_actual']}" required>
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    value="${row?.['product_unit_price']}"
                                    data-return-type="number"
                                >`;
                    }
                },
                {
                    targets: 6,
                    width: '10%',
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
                    width: '15%',
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
                    width: '1%',
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                },
            ],
            drawCallback: function () {
                // add css to dataTables_scrollBody
                POLoadDataHandle.loadCssToDTScrollBody();
                PODataTableHandle.dtbProductHDCustom();
            },
        });
    };

    static dataTablePaymentStage(data) {
        // init dataTable
        if ($.fn.dataTable.isDataTable(PODataTableHandle.$tablePayment)) {
            PODataTableHandle.$tablePayment.DataTable().destroy();
        }
        PODataTableHandle.$tablePayment.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        return `<span class="table-row-order" data-id="${row?.['order']}">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-remark" rows="2">${row?.['remark'] ? row?.['remark'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 2,
                    width: '8%',
                    render: (data, type, row) => {
                        let value = "";
                        if (row?.['date'] !== "") {
                            value = moment(row?.['date']).format('DD/MM/YYYY');
                        }
                        return `<div class="input-affix-wrapper">
                                    <input type="text" class="form-control table-row-date" data-number-of-day="${row?.['number_of_day']}" value="${value}">
                                    <div class="input-suffix"><i class="fas fa-calendar-alt"></i></div>
                                </div>`;
                    },
                },
                {
                    targets: 3,
                    width: '8%',
                    render: (data, type, row) => {
                        let value = "";
                        if (row?.['due_date'] !== "") {
                            value = moment(row?.['due_date']).format('DD/MM/YYYY');
                        }
                        return `<div class="input-affix-wrapper">
                                    <input type="text" class="form-control table-row-due-date text-black" value="${value}">
                                    <div class="input-suffix"><i class="fas fa-calendar-alt"></i></div>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    width: '6%',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-ratio valid-num" value="${row?.['ratio'] ? row?.['ratio'] : '0'}">
                                        <div class="input-suffix"><small><i class="fas fa-percentage"></i></small></div>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    width: '6%',
                    render: (data, type, row) => {
                        // return `<select class="form-select table-row-issue-invoice"></select>`;
                        return `<div class="d-flex justify-content-between align-items-center">
                                    <input type="text" class="form-control table-row-invoice valid-num" value="${row?.['invoice_data']?.['order'] ? row?.['invoice_data']?.['order'] : ''}" readonly>
                                    <button
                                        type="button"
                                        class="btn btn-icon btn-select-invoice"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectInvoiceModal"
                                    ><i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control table-row-invoice-data hidden">`;
                    }
                },
                {
                    targets: 6,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-before-tax text-black" 
                                    value="${row?.['value_before_tax'] ? row?.['value_before_tax'] : '0'}"
                                    data-return-type="number"
                                >`;
                    }
                },
                {
                    targets: 7,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-between align-items-center">
                                    <input 
                                        type="text" 
                                        class="form-control mask-money table-row-value-reconcile text-black" 
                                        value="${row?.['value_reconcile'] ? row?.['value_reconcile'] : '0'}"
                                        data-return-type="number"
                                        readonly
                                    >
                                    <button
                                        type="button"
                                        class="btn btn-icon btn-select-reconcile"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectReconcileModal"
                                    ><i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control table-row-reconcile-data hidden">`;
                    }
                },
                {
                    targets: 8,
                    width: '6%',
                    render: () => {
                        return `<div class="table-row-tax-area">
                                    <select
                                        class="form-select table-row-tax"
                                        data-url="${POLoadDataHandle.urlEle.attr('data-md-tax')}"
                                        data-method="GET"
                                        data-keyResp="tax_list"
                                        readonly
                                    >
                                    </select>
                                </div>
                                <span class="table-row-tax-check" hidden>${POLoadDataHandle.transEle.attr('data-mixed')}</span>`;
                    }
                },
                {
                    targets: 9,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-tax text-black" 
                                    value="${row?.['value_tax'] ? row?.['value_tax'] : '0'}"
                                    data-return-type="number"
                                >`;
                    }
                },
                {
                    targets: 10,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-total text-black" 
                                    value="${row?.['value_total'] ? row?.['value_total'] : '0'}"
                                    data-return-type="number"
                                >`;
                    }
                },
                {
                    targets: 11,
                    width: '1%',
                    render: () => {
                        let hidden = '';
                        if (PODataTableHandle.$tableInvoice.DataTable().data().count() !== 0) {
                            hidden = 'hidden';
                        }
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="sale_order_payment_stage" ${hidden}><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let dateEle = row.querySelector('.table-row-date');
                let dueDateEle = row.querySelector('.table-row-due-date');
                let invoiceDataEle = row.querySelector('.table-row-invoice-data');
                let valBeforeEle = row.querySelector('.table-row-value-before-tax');
                let reconcileDataEle = row.querySelector('.table-row-reconcile-data');
                let taxAreaEle = row.querySelector('.table-row-tax-area');
                let taxEle = row.querySelector('.table-row-tax');
                let taxCheckEle = row.querySelector('.table-row-tax-check');
                let valTaxEle = row.querySelector('.table-row-value-tax');
                let valTotalEle = row.querySelector('.table-row-value-total');

                let checkTax = POLoadDataHandle.loadCheckSameMixTax();
                if (dateEle) {
                    DateTimeControl.initFlatPickrDate(dateEle);
                    if (data?.['date']) {
                        $(dateEle).val(moment(data?.['date']).format('DD/MM/YYYY'));
                    }
                }
                if (dueDateEle) {
                    DateTimeControl.initFlatPickrDate(dueDateEle);
                    if (data?.['due_date']) {
                        $(dueDateEle).val(moment(data?.['due_date']).format('DD/MM/YYYY'));
                    }
                }
                if (invoiceDataEle) {
                    $(invoiceDataEle).val(JSON.stringify(data?.['invoice_data'] ? data?.['invoice_data'] : {}));
                }
                if (valBeforeEle) {
                    if (checkTax?.['check'] === "mixed" && POLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        valBeforeEle.removeAttribute('readonly');
                    }
                }
                if (reconcileDataEle) {
                    $(reconcileDataEle).val(JSON.stringify(data?.['reconcile_data'] ? data?.['reconcile_data'] : []));
                }
                if (taxEle && taxAreaEle && taxCheckEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    FormElementControl.loadInitS2($(taxEle), dataS2);

                    if (checkTax?.['check'] === "same" && PODataTableHandle.$tableInvoice.DataTable().rows().count() === 0) {
                        FormElementControl.loadInitS2($(taxEle), checkTax?.['list_tax']);
                    }
                    if (checkTax?.['check'] === "mixed") {
                        taxAreaEle.setAttribute('hidden', 'true');
                        taxCheckEle.removeAttribute('hidden');
                    }
                }
                if (valTaxEle) {
                    if (checkTax?.['check'] === "mixed" && POLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        valTaxEle.removeAttribute('readonly');
                    }
                }
                if (valTotalEle) {
                    if (checkTax?.['check'] === "mixed" && POLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        valTotalEle.removeAttribute('readonly');
                    }
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                PODataTableHandle.dtbPaymentHDCustom();
            },
        });
    };

    static dataTableInvoice(data) {
        // init dataTable
        if ($.fn.dataTable.isDataTable(PODataTableHandle.$tableInvoice)) {
            PODataTableHandle.$tableInvoice.DataTable().destroy();
        }
        PODataTableHandle.$tableInvoice.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<span class="table-row-order" data-id="${row?.['order']}">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-remark" rows="2">${row?.['remark'] ? row?.['remark'] : ""}</textarea>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<div class="input-affix-wrapper">
                                    <input type="text" class="form-control date-picker text-black table-row-date" autocomplete="off">
                                    <div class="input-suffix">
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let ratio = '';
                        if (row?.['ratio']) {
                            if (row?.['ratio'] !== null) {
                                ratio = row?.['ratio'];
                            }
                        }
                        return `<div class="input-group">
                                    <div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-ratio valid-num" value="${ratio}" readonly>
                                        <div class="input-suffix"><small><i class="fas fa-percentage"></i></small></div>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: () => {
                        return `<div class="table-row-tax-area">
                                    <select
                                        class="form-select table-row-tax"
                                        data-url="${POLoadDataHandle.urlEle.attr('data-md-tax')}"
                                        data-method="GET"
                                        data-keyResp="tax_list"
                                    >
                                    </select>
                                </div>
                                <span class="table-row-tax-check" hidden>${POLoadDataHandle.transEle.attr('data-mixed')}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-total text-black" 
                                    value="${row?.['total'] ? row?.['total'] : '0'}"
                                    data-return-type="number"
                                >`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <div class=input-group">
                                        <span class="input-affix-wrapper">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-balance text-black" 
                                                value="${row?.['balance'] ? row?.['balance'] : 0}"
                                                data-return-type="number"
                                                readonly
                                            >
                                            <span class="input-suffix"><i class="far fa-check-circle text-success paid-full" hidden></i></span>
                                        </span>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let dateEle = row.querySelector('.table-row-date');
                let taxAreaEle = row.querySelector('.table-row-tax-area');
                let taxEle = row.querySelector('.table-row-tax');
                let taxCheckEle = row.querySelector('.table-row-tax-check');
                let termDataEle = row.querySelector('.table-row-term-data');
                let totalEle = row.querySelector('.table-row-total');
                let paidFullEle = row.querySelector('.paid-full');

                let checkTax = POLoadDataHandle.loadCheckSameMixTax();
                if (dateEle) {
                    DateTimeControl.initFlatPickrDate(dateEle);
                    if (data?.['date']) {
                        $(dateEle).val(moment(data?.['date']).format('DD/MM/YYYY'));
                    }
                }
                if (taxEle && taxAreaEle && taxCheckEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    FormElementControl.loadInitS2($(taxEle), dataS2);

                    if (checkTax?.['check'] === "same") {
                        taxEle.setAttribute('readonly', 'true');
                        FormElementControl.loadInitS2($(taxEle), checkTax?.['list_tax']);
                    }
                    if (checkTax?.['check'] === "mixed") {
                        taxAreaEle.setAttribute('hidden', 'true');
                        taxCheckEle.removeAttribute('hidden');
                    }
                }
                if (termDataEle) {
                    $(termDataEle).val(JSON.stringify(data?.['term_data'] ? data?.['term_data'] : []));
                }
                if (totalEle) {
                    if (checkTax?.['check'] === "mixed" && POLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        totalEle.removeAttribute('readonly');
                    }
                }
                if (paidFullEle) {
                    if (data?.['total'] > 0 && data?.['balance'] === 0) {
                        paidFullEle.removeAttribute('hidden');
                    }
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                PODataTableHandle.dtbInvoiceHDCustom();
            },
        });
    };

    static dataTableSelectInvoice(data) {
        PODataTableHandle.$tableSInvoice.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "400px",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let checked = "";
                        let target = PODataTableHandle.$tablePayment[0].querySelector(`[data-id="${POLoadDataHandle.$btnSaveInvoice.attr('data-id')}"]`);
                        if (target) {
                            let targetRow = target.closest('tr');
                            if (targetRow) {
                                let invoiceDataEle = targetRow.querySelector('.table-row-invoice-data');
                                if (invoiceDataEle) {
                                    if ($(invoiceDataEle).val()) {
                                        let invoiceData = JSON.parse($(invoiceDataEle).val());
                                        if (row?.['order'] === invoiceData?.['order']) {
                                            checked = "checked";
                                        }
                                    }
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="radio" name="row-checkbox" class="form-check-input table-row-checkbox" id="s-invoice-${row?.['order']}" ${checked}>
                                    <label class="form-check-label table-row-order" for="s-invoice-${row?.['order']}">${row?.['order']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span>${row?.['remark']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let txt = ``;
                        if (row?.['ratio']) {
                            if (row?.['ratio'] !== null) {
                                txt = `<span>${row?.['ratio']} %</span>`;
                            }
                        }
                        return txt;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span>${row?.['tax_data']?.['title'] ? row?.['tax_data']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['total'] ? row?.['total'] : 0}"></span>`;
                    }
                },
            ],
            drawCallback: function () {
                POLoadDataHandle.loadEventRadio(PODataTableHandle.$tableSInvoice);
                $.fn.initMaskMoney2();
            }
        });
    };

    static dataTableSelectReconcile(data) {
        PODataTableHandle.$tableSReconcile.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "400px",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let checked = "";
                        let target = PODataTableHandle.$tablePayment[0].querySelector(`[data-id="${POLoadDataHandle.$btnSaveReconcile.attr('data-id')}"]`);
                        if (target) {
                            let targetRow = target.closest('tr');
                            if (targetRow) {
                                let reconcileDataEle = targetRow.querySelector('.table-row-reconcile-data');
                                if (reconcileDataEle) {
                                    if ($(reconcileDataEle).val()) {
                                        let reconcileData = JSON.parse($(reconcileDataEle).val());
                                        for (let reconcile of reconcileData) {
                                            if (row?.['order'] === reconcile?.['order']) {
                                                checked = "checked";
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox" id="s-reconcile-${row?.['order']}" ${checked}>
                                    <label class="form-check-label table-row-order" for="s-reconcile-${row?.['order']}">${row?.['term_data']?.['title'] ? row?.['term_data']?.['title'] : row?.['remark']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span>${row?.['remark']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let txt = ``;
                        if (row?.['ratio']) {
                            if (row?.['ratio'] !== null) {
                                txt = `<span>${row?.['ratio']} %</span>`;
                            }
                        }
                        return txt;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span>${row?.['tax_data']?.['title'] ? row?.['tax_data']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['value_total'] ? row?.['value_total'] : 0}"></span>`;
                    }
                },
            ],
            drawCallback: function () {
                POLoadDataHandle.loadEventCheckbox(PODataTableHandle.$tableSReconcile);
                $.fn.initMaskMoney2();
            }
        });
    };

    // Custom dtb
    static dtbPurchaseRequestHDCustom() {
        let $table = $('#datable-purchase-request');
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbPurchaseRequestProductHDCustom() {
        let $table = $('#datable-purchase-request-product');
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbPurchaseRequestProductMergeHDCustom() {
        let $table = $('#datable-purchase-request-product-merge');
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbProductHDCustom() {
        let $table = PODataTableHandle.$tablePOByAdd;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-product-purchase-order').length && !$('#btn-add-shipping-purchase-order').length) {
                let hidden = "";
                if (POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" aria-expanded="false" data-bs-toggle="dropdown" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${POLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>
                                <div class="dropdown-menu w-210p">
                                    <a class="dropdown-item" href="#" id="btn-add-product-purchase-order"><i class="dropdown-icon fas fa-cube"></i><span class="mt-2">${POLoadDataHandle.transEle.attr('data-add-product')}</span></a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#" id="btn-add-shipping-purchase-order"><i class="dropdown-icon fas fa-shipping-fast"></i><span class="mt-2">${POLoadDataHandle.transEle.attr('data-shipping')}</span></a>
                                </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-product-purchase-order').on('click', function () {
                    if (POLoadDataHandle.PRDataEle.val()) {
                        $('#btn-warning-add-product').click();
                    } else {
                        POLoadDataHandle.loadAddRowTableProductAdd();
                    }
                });
                $('#btn-add-shipping-purchase-order').on('click', function () {
                    POLoadDataHandle.loadAddRowTableProductAdd(1);
                });
            }
        }
    };

    static dtbProductRequestHDCustom() {
        let $table = PODataTableHandle.$tablePOByRequest;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbPaymentHDCustom() {
        let $table = PODataTableHandle.$tablePayment;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-payment-stage').length) {
                let hidden = "";
                if (POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-payment-stage" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${POLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-payment-stage').on('click', function () {
                    POStoreDataHandle.storeDtbData(3);
                    POLoadDataHandle.loadAddPaymentStage();
                    POLoadDataHandle.loadReInitDataTablePayment();
                });
            }
        }
    };

    static dtbInvoiceHDCustom() {
        let $table = PODataTableHandle.$tableInvoice;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-invoice').length) {
                let hidden = "";
                if (POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-invoice" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${POLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-invoice').on('click', function () {
                    POStoreDataHandle.storeDtbData(4);
                    POLoadDataHandle.loadAddInvoice();
                });
            }
        }
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
        let elePretaxAmount = table.querySelector('.purchase-order-product-pretax-amount');
        let eleTaxes = table.querySelector('.purchase-order-product-taxes');
        let eleTotal = table.querySelector('.purchase-order-product-total');
        let elePretaxAmountRaw = table.querySelector('.purchase-order-product-pretax-amount-raw');
        let eleTaxesRaw = table.querySelector('.purchase-order-product-taxes-raw');
        let eleTotalRaw = table.querySelector('.purchase-order-product-total-raw');
        let finalRevenueBeforeTaxAdd = table.querySelector('.purchase-order-final-revenue-before-tax');
        let pretaxAmount = 0;
        let taxAmount = 0;
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');

            elePretaxAmount = tableFt.querySelector('.purchase-order-product-pretax-amount');
            eleTaxes = tableFt.querySelector('.purchase-order-product-taxes');
            eleTotal = tableFt.querySelector('.purchase-order-product-total');
            elePretaxAmountRaw = tableFt.querySelector('.purchase-order-product-pretax-amount-raw');
            eleTaxesRaw = tableFt.querySelector('.purchase-order-product-taxes-raw');
            eleTotalRaw = tableFt.querySelector('.purchase-order-product-total-raw');
            finalRevenueBeforeTaxAdd = tableFt.querySelector('.purchase-order-final-revenue-before-tax');
        }
        if (elePretaxAmount && eleTaxes && eleTotal) {
            $(table).DataTable().rows().every(function () {
                let row = this.node();
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
            });
            let totalFinal = (pretaxAmount + taxAmount);
            $(elePretaxAmount).attr('data-init-money', String(pretaxAmount));
            elePretaxAmountRaw.value = pretaxAmount;
            finalRevenueBeforeTaxAdd.value = pretaxAmount;
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
        POCalculateHandle.calculateRow(row);
        // calculate total
        POCalculateHandle.calculateTotal(table[0]);
        return true;
    };

    static calculateTable(table) {
        table.DataTable().rows().every(function () {
            let row = this.node();
            POCalculateHandle.calculateMain(table, row);
        });
        return true;
    };

    // Calculate funcs
    static getDatasRelateTax(valBefore, tax) {
        let valTax = valBefore * tax / 100;
        let valAfter = valBefore + valTax;
        return {'valBefore': valBefore, 'valTax': valTax, 'valAfter': valAfter};
    };

}

// Store data
class POStoreDataHandle {
    static storeDtbData(type) {
        let dataJSON = {};
        let datas = [];
        let $table = null;
        if (type === 3) {
            datas = POSubmitHandle.setupDataPaymentStage();
            $table = PODataTableHandle.$tablePayment;
        }
        if (type === 4) {
            datas = POSubmitHandle.setupDataInvoice();
            $table = PODataTableHandle.$tableInvoice;
        }
        if (datas.length > 0 && $table) {
            for (let data of datas) {
                if (!dataJSON.hasOwnProperty(String(data?.['order']))) {
                    dataJSON[String(data?.['order'])] = data;
                }
            }
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $table.DataTable().row(row).index();
                let orderEle = row.querySelector('.table-row-order');
                if (orderEle) {
                    let key = orderEle.innerHTML;
                    $table.DataTable().row(rowIndex).data(dataJSON?.[key]);
                }
            });
            if (type === 3) {
                POLoadDataHandle.loadReInitDataTablePayment();
            }
            if (type === 4) {
                POLoadDataHandle.loadReInitDataTableInvoice();
            }
        }
        return true;
    };
}

// Validate
class POValidateHandle {

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
    static setupMergeProduct() {
        let data = [];
        let dataJson = {};
        let table = $('#datable-purchase-request-product');
        if (!table[0].querySelector('.dataTables_empty')) {
            let order = 0;
            let productMapUOMList = {};
            // Setup smallest UOM from many UOM of PRs
            for (let eleChecked of table[0].querySelectorAll('.table-row-checkbox:checked:not(.disabled-by-pq)')) {
                let row = eleChecked.closest('tr');
                let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
                if (dataRowRaw) {
                    let dataRow = JSON.parse(dataRowRaw);
                    if (dataRow?.['product']?.['id'] && dataRow?.['uom']) {
                        if (!productMapUOMList.hasOwnProperty(dataRow?.['product']?.['id'])) {
                            productMapUOMList[dataRow?.['product']?.['id']] = [dataRow?.['uom']];
                        } else {
                            productMapUOMList[dataRow?.['product']?.['id']].push(dataRow?.['uom']);
                        }
                    }
                }
            }
            for (let key in productMapUOMList) {
                let uomApply = {};
                for (let uom of productMapUOMList[key]) {
                    if (Object.keys(uomApply).length === 0) {
                        uomApply = uom;
                    } else {
                        if (uom?.['ratio'] && uomApply?.['ratio']) {
                            if (uom?.['ratio'] < uomApply?.['ratio']) {
                                uomApply = uom;
                            }
                        }
                    }
                }
                productMapUOMList[key] = uomApply;
            }
            for (let eleChecked of table[0].querySelectorAll('.table-row-checkbox:checked:not(.disabled-by-pq)')) {
                let row = eleChecked.closest('tr');
                let sale_order_id = eleChecked.getAttribute('data-sale-order-product-id');
                if (sale_order_id === "null") {
                    sale_order_id = null;
                }
                let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
                if (dataRowRaw) {
                    let dataRow = JSON.parse(dataRowRaw);
                    let is_allow_gr = false;
                    if (dataRow?.['product'].hasOwnProperty('product_choice') && Array.isArray(dataRow?.['product']?.['product_choice'])) {
                        if (dataRow?.['product']?.['product_choice'].includes(1)) {  // product allow inventory
                            is_allow_gr = true;
                        }
                    }
                    let tax = dataRow?.['tax'];
                    let product_id = dataRow?.['product']?.['id'];
                    let quantity = parseFloat(dataRow?.['quantity']);
                    let quantity_order = parseFloat(row.querySelector('.table-row-quantity-order').value);
                    let remain = (parseFloat(row.querySelector('.table-row-remain').innerHTML) - quantity_order);
                    if (dataRow?.['uom']?.['ratio'] && productMapUOMList[product_id]?.['ratio']) {
                        let finalRatio = (parseFloat(dataRow?.['uom']?.['ratio']) / parseFloat(productMapUOMList[product_id]?.['ratio']));
                        quantity = (parseFloat(dataRow?.['quantity']) * finalRatio);
                        quantity_order = (parseFloat(row.querySelector('.table-row-quantity-order').value) * finalRatio);
                        remain = ((parseFloat(row.querySelector('.table-row-remain').innerHTML) * finalRatio) - quantity_order);
                    }
                    // origin data to check
                    let quantity_origin = parseFloat(dataRow?.['quantity']);
                    let quantity_order_origin = parseFloat(row.querySelector('.table-row-quantity-order').value);
                    let remain_origin = (parseFloat(row.querySelector('.table-row-remain').innerHTML) - quantity_order);
                    let gr_remain_quantity = 0;
                    if (is_allow_gr === true) {
                        gr_remain_quantity = quantity_order_origin;
                    }
                    if (parseFloat(row.querySelector('.table-row-remain').innerHTML) > 0) {
                        if (!dataJson.hasOwnProperty(product_id)) {
                            order++
                            dataJson[product_id] = {
                                'id': dataRow?.['id'],
                                'purchase_request_products_data': [{
                                    'purchase_request_product': dataRow,
                                    'sale_order_product': sale_order_id,
                                    'quantity_order': quantity_order_origin,
                                    'quantity_remain': parseFloat(dataRow?.['remain_for_purchase_order']),
                                    'gr_remain_quantity': gr_remain_quantity,
                                }],
                                'product': dataRow?.['product'],
                                'uom_order_request': productMapUOMList[product_id],
                                'uom_order_actual': productMapUOMList[product_id],
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
                                'product_unit_price': dataRow?.['unit_price'],
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
                                'purchase_request_product': dataRow,
                                'sale_order_product': sale_order_id,
                                'quantity_order': quantity_order_origin,
                                'quantity_remain': parseFloat(dataRow?.['remain_for_purchase_order']),
                                'gr_remain_quantity': gr_remain_quantity,
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
    };

    static setupDataProduct() {
        let result = [];
        let $table = PODataTableHandle.$tablePOByAdd;
        if (document.getElementById('purchase-order-purchase-request').innerHTML) {
            $table = PODataTableHandle.$tablePOByRequest;
        }
        $table.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let eleProduct = row.querySelector('.table-row-item');
            let eleShipping = row.querySelector('.table-row-shipping');
            if (eleProduct) {  // PRODUCT
                if ($(eleProduct).val()) {
                    let dataInfo = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                    rowData['product'] = dataInfo?.['id'];
                    rowData['product_title'] = dataInfo?.['title'];
                    rowData['product_code'] = dataInfo?.['code'];
                }
                let eleUOMRequest = row.querySelector('.table-row-uom-order-request');
                if (eleUOMRequest) {
                    let dataInfo = JSON.parse(eleUOMRequest.querySelector('.data-info').value);
                    rowData['uom_order_request'] = dataInfo?.['id'];
                }
                let eleQuantityRequest = row.querySelector('.table-row-quantity-order-request');
                if (eleQuantityRequest) {
                    if (eleQuantityRequest.innerHTML) {
                        rowData['product_quantity_order_request'] = parseFloat(eleQuantityRequest.innerHTML);
                    }
                }
                let stock = row.querySelector('.table-row-stock');
                if (stock) {
                    if (stock.innerHTML) {
                        rowData['stock'] = parseFloat(stock.innerHTML);
                    }
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                    if (eleOrder.getAttribute('data-row')) {
                        let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                        rowData['purchase_request_products_data'] = dataRow?.['purchase_request_products_data'];
                        if (rowData['purchase_request_products_data']) {
                            for (let PRProductData of rowData['purchase_request_products_data']) {
                                if (PRProductData?.['purchase_request_product']?.['id']) {
                                    PRProductData['purchase_request_product'] = PRProductData?.['purchase_request_product']?.['id'];
                                }
                                if (PRProductData?.['uom_stock']?.['id']) {
                                    PRProductData['uom_stock'] = PRProductData?.['uom_stock']?.['id'];
                                } else {
                                    PRProductData['uom_stock'] = null;
                                }
                            }
                        }
                        // Check if stock > 0
                        if (rowData['stock'] > 0) {
                            rowData['purchase_request_products_data'].push({
                                'quantity_order': rowData['stock'],
                                'uom_stock': rowData['uom_order_request'],
                                'is_stock': true,
                                'gr_remain_quantity': rowData['stock'],
                            })
                        }
                    }
                }
            }
            if (eleShipping) {  // SHIPPING
                rowData['is_shipping'] = true;
                rowData['shipping_title'] = eleShipping.value;
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
            }
            // COMMON
            let eleDescription = row.querySelector('.table-row-description');
            if (eleDescription) {
                rowData['product_description'] = eleDescription.innerHTML;
            }
            let eleUOMOrder = row.querySelector('.table-row-uom-order-actual');
            if ($(eleUOMOrder).val()) {
                let dataInfo = SelectDDControl.get_data_from_idx($(eleUOMOrder), $(eleUOMOrder).val());
                if (dataInfo) {
                    rowData['uom_order_actual'] = dataInfo?.['id'];
                }
            }
            let eleQuantityOrder = row.querySelector('.table-row-quantity-order-actual');
            if (eleQuantityOrder) {
                if (eleQuantityOrder.value) {
                    rowData['product_quantity_order_actual'] = parseFloat(eleQuantityOrder.value);
                    rowData['gr_remain_quantity'] = parseFloat(eleQuantityOrder.value);
                }
            }
            let elePrice = row.querySelector('.table-row-price');
            if (elePrice) {
                rowData['product_unit_price'] = $(elePrice).valCurrency();
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
            let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
            if (eleSubtotal) {
                if (eleSubtotal.value) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
            }
            if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount'];
            }

            result.push(rowData);
        });
        return result
    };

    static setupDataPaymentStage() {
        let result = [];
        PODataTableHandle.$tablePayment.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                rowData['order'] = parseInt(eleOrder.innerHTML);
            }
            let eleInstallment = row.querySelector('.table-row-installment');
            if (eleInstallment) {
                if ($(eleInstallment).val()) {
                    rowData['term_id'] = $(eleInstallment).val();
                    rowData['term_data'] = SelectDDControl.get_data_from_idx($(eleInstallment), $(eleInstallment).val());
                }
            }
            let remarkEle = row.querySelector('.table-row-remark');
            if (remarkEle) {
                rowData['remark'] = $(remarkEle).val();
            }
            let dateEle = row.querySelector('.table-row-date');
            if (dateEle) {
                if ($(dateEle).val()) {
                    rowData['date'] = String(moment($(dateEle).val(), 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            let eleDateType = row.querySelector('.table-row-date-type');
            if (eleDateType) {
                rowData['date_type'] = $(eleDateType).val();
            }
            let ratioEle = row.querySelector('.table-row-ratio');
            if (ratioEle) {
                rowData['ratio'] = null;
                if ($(ratioEle).val()) {
                    rowData['ratio'] = parseFloat($(ratioEle).val());
                }
            }
            let invoiceEle = row.querySelector('.table-row-invoice');
            if (invoiceEle) {
                rowData['invoice'] = null;
                rowData['is_ap_invoice'] = false;
                if ($(invoiceEle).val()) {
                    rowData['invoice'] = parseInt($(invoiceEle).val());
                    rowData['is_ap_invoice'] = true;
                }
            }
            let invoiceDataEle = row.querySelector('.table-row-invoice-data');
            if (invoiceDataEle) {
                if ($(invoiceDataEle).val()) {
                    rowData['invoice_data'] = JSON.parse($(invoiceDataEle).val());
                }
            }
            let valBeforeEle = row.querySelector('.table-row-value-before-tax');
            if (valBeforeEle) {
                if ($(valBeforeEle).valCurrency()) {
                    rowData['value_before_tax'] = parseFloat($(valBeforeEle).valCurrency());
                }
            }
            let valReconcileEle = row.querySelector('.table-row-value-reconcile');
            if (valReconcileEle) {
                if ($(valReconcileEle).valCurrency()) {
                    rowData['value_reconcile'] = parseFloat($(valReconcileEle).valCurrency());
                }
            }
            let reconcileDataEle = row.querySelector('.table-row-reconcile-data');
            if (reconcileDataEle) {
                if ($(reconcileDataEle).val()) {
                    rowData['reconcile_data'] = JSON.parse($(reconcileDataEle).val());
                }
            }
            let taxEle = row.querySelector('.table-row-tax');
            if (taxEle) {
                if ($(taxEle).val()) {
                    rowData['tax_id'] = $(taxEle).val();
                    rowData['tax_data'] = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                }
            }
            let valTaxEle = row.querySelector('.table-row-value-tax');
            if (valTaxEle) {
                if ($(valTaxEle).valCurrency()) {
                    rowData['value_tax'] = parseFloat($(valTaxEle).valCurrency());
                }
            }
            let valTotalEle = row.querySelector('.table-row-value-total');
            if (valTotalEle) {
                if ($(valTotalEle).valCurrency()) {
                    rowData['value_total'] = parseFloat($(valTotalEle).valCurrency());
                }
            }
            let dueDateEle = row.querySelector('.table-row-due-date');
            if (dueDateEle) {
                if ($(dueDateEle).val()) {
                    rowData['due_date'] = String(moment($(dueDateEle).val(), 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            result.push(rowData);
        });
        return result;
    };

    static setupDataInvoice() {
        let result = [];
        PODataTableHandle.$tableInvoice.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                rowData['order'] = parseInt(orderEle.innerHTML);
            }
            let remarkEle = row.querySelector('.table-row-remark');
            if (remarkEle) {
                rowData['remark'] = $(remarkEle).val();
            }
            let dateEle = row.querySelector('.table-row-date');
            if (dateEle) {
                if ($(dateEle).val()) {
                    rowData['date'] = moment($(dateEle).val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
                }
            }
            let termDataEle = row.querySelector('.table-row-term-data');
            if (termDataEle) {
                if ($(termDataEle).val()) {
                    rowData['term_data'] = JSON.parse($(termDataEle).val());
                }
            }
            let ratioEle = row.querySelector('.table-row-ratio');
            if (ratioEle) {
                rowData['ratio'] = null;
                if ($(ratioEle).val()) {
                    rowData['ratio'] = parseFloat($(ratioEle).val());
                }
            }
            let taxEle = row.querySelector('.table-row-tax');
            if (taxEle) {
                if ($(taxEle).val()) {
                    rowData['tax_id'] = $(taxEle).val();
                    rowData['tax_data'] = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                }
            }
            let totalEle = row.querySelector('.table-row-total');
            if (totalEle) {
                rowData['total'] = parseFloat($(totalEle).valCurrency());
            }
            let balanceEle = row.querySelector('.table-row-balance');
            if (balanceEle) {
                rowData['balance'] = parseFloat($(balanceEle).valCurrency());
            }
            result.push(rowData);
        });
        return result;
    };

    static setupDataSubmit(_form) {
        if (POLoadDataHandle.supplierSelectEle.val()) {
            _form.dataForm['supplier_data'] = SelectDDControl.get_data_from_idx(POLoadDataHandle.supplierSelectEle, POLoadDataHandle.supplierSelectEle.val());
        }
        if (POLoadDataHandle.contactSelectEle.val()) {
            _form.dataForm['contact_data'] = SelectDDControl.get_data_from_idx(POLoadDataHandle.contactSelectEle, POLoadDataHandle.contactSelectEle.val());
        }
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
        if (products_data_setup.length <= 0) {
            $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-required-product')}, 'failure');
            return false;
        }
        let tableWrapper = document.getElementById('datable-purchase-order-product-add_wrapper');
        if (POLoadDataHandle.PRDataEle.val()) {
            tableWrapper = document.getElementById('datable-purchase-order-product-request_wrapper');
        }
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            if (tableFt) {
                let elePretaxAmountRaw = tableFt.querySelector('.purchase-order-product-pretax-amount-raw');
                let eleTaxesRaw = tableFt.querySelector('.purchase-order-product-taxes-raw');
                let eleTotalRaw = tableFt.querySelector('.purchase-order-product-total-raw');
                let finalRevenueBeforeTaxAdd = tableFt.querySelector('.purchase-order-final-revenue-before-tax');
                _form.dataForm['total_product_pretax_amount'] = parseFloat($(elePretaxAmountRaw).val());
                _form.dataForm['total_product_tax'] = parseFloat($(eleTaxesRaw).val());
                _form.dataForm['total_product'] = parseFloat($(eleTotalRaw).val());
                _form.dataForm['total_product_revenue_before_tax'] = parseFloat(finalRevenueBeforeTaxAdd.value);
            }
        }
        // payment stage
        _form.dataForm['purchase_order_payment_stage'] = POSubmitHandle.setupDataPaymentStage();
        _form.dataForm['purchase_order_invoice'] = POSubmitHandle.setupDataInvoice();
        // validate payment stage submit
        // if (_form.dataForm?.['purchase_order_payment_stage'] && _form.dataForm?.['total_product']) {
        //     if (_form.dataForm?.['purchase_order_payment_stage'].length > 0) {
        //         let totalPayment = 0;
        //         for (let payment of _form.dataForm['purchase_order_payment_stage']) {
        //             totalPayment += payment?.['value_total'] ? payment?.['value_total'] : 0;
        //         }
        //         if (totalPayment !== _form.dataForm?.['total_product']) {
        //             $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-validate-total-payment')}, 'failure');
        //             return false;
        //         }
        //     }
        // }
        // attachment
        if (_form.dataForm.hasOwnProperty('attachment')) {
          _form.dataForm['attachment'] = $x.cls.file.get_val(_form.dataForm?.['attachment'], []);
        }
        return _form.dataForm;
    };
}

// *** COMMON FUNCTIONS ***
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

function deleteRow(currentRow, table) {
    // Get the index of the current row within the DataTable
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    // Delete current row
    row.remove().draw();
}

function reOrderSTT(table) {
    let order = 1;
    let itemCount = table[0].querySelectorAll('.table-row-order').length;
    if (itemCount === 0) {
        table.DataTable().clear().draw();
    } else {
        for (let eleOrder of table[0].querySelectorAll('.table-row-order')) {
            eleOrder.innerHTML = order;
            order++
            if (order > itemCount) {
                break;
            }
        }
    }
}