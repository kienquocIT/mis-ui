$(function () {

    $(document).ready(function () {

        // Elements
        let divCopyOption = $('#copy-quotation-option');
        let modalShipping = $('#quotation-create-modal-shipping-body');
        let modalBilling = $('#quotation-create-modal-billing-body');
        let $quotationTabs = $('#quotation-tabs');

        // Load inits
        QuotationLoadDataHandle.loadInitInherit();
        QuotationLoadDataHandle.loadBoxQuotationCustomer();
        FormElementControl.loadInitS2(QuotationLoadDataHandle.contactSelectEle);
        FormElementControl.loadInitS2(QuotationLoadDataHandle.paymentSelectEle, [], {}, null, true);
        $('#quotation-create-date-created').val(DateTimeControl.getCurrentDate("DMY", "/"));
        // init dataTable
        QuotationDataTableHandle.dataTableSelectProduct();
        QuotationDataTableHandle.dataTableProduct();
        QuotationDataTableHandle.dataTableCost();
        QuotationDataTableHandle.dataTableExpense();
        if (!QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {  // quotation
            QuotationDataTableHandle.dataTableQuotationIndicator();
        } else {  // sale order
            QuotationDataTableHandle.dataTableSaleOrderIndicator();
            QuotationDataTableHandle.dataTablePaymentStage();
            QuotationDataTableHandle.dataTableInvoice();
            QuotationDataTableHandle.dataTableSelectTerm();
            QuotationDataTableHandle.dataTableSelectInvoice();
            QuotationDataTableHandle.dataTableSelectReconcile();
        }
        // init config
        QuotationLoadDataHandle.loadInitQuotationConfig(QuotationLoadDataHandle.$form.attr('data-method'));
        // date picker
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });

        // get WF initial zones
        let appCode = 'quotation';
        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
            appCode = 'saleorder';
        }
        WFRTControl.setWFInitialData(appCode);

        QuotationLoadDataHandle.opportunitySelectEle.on('change', function () {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.opportunitySelectEle, QuotationLoadDataHandle.opportunitySelectEle.val());
            if (dataSelected) {
                QuotationLoadDataHandle.loadDataByOpportunity(dataSelected);
            }
        });

        QuotationLoadDataHandle.customerSelectEle.on('change', function () {
            QuotationLoadDataHandle.loadDataByCustomer();
        });

        QuotationLoadDataHandle.paymentSelectEle.on('change', function () {
            QuotationLoadDataHandle.loadChangePaymentTerm();
        });

// PRODUCT
        $quotationTabs.on('click', '.tab-detail', function () {
            QuotationStoreDataHandle.storeDtbData(1);
            QuotationStoreDataHandle.storeDtbData(2);
            QuotationStoreDataHandle.storeDtbData(3);
            QuotationStoreDataHandle.storeDtbData(4);
            QuotationStoreDataHandle.storeDtbData(5);
        });

        QuotationDataTableHandle.$tableSProduct.on('click', '.table-row-checkbox', function () {
            QuotationLoadDataHandle.loadStoreCheckProduct(this);
        });

        QuotationLoadDataHandle.$btnSaveSelectProduct.on('click', function () {
            QuotationLoadDataHandle.loadNewProduct();
        });

        // QUICK PRODUCT
        $('#addQuickProduct').on('shown.bs.modal', function () {
            let $boxPType = $('#add-product-type');
            let $boxPCategory = $('#add-product-category');
            let $boxPUomGr = $('#add-product-uom-group');
            let $boxPUom = $('#add-product-uom');
            let $boxPTax = $('#add-product-tax');
            let $boxPMethod = $('#add-product-method');
            let dataMethod = [
                {'id': 0, 'title': 'None'},
                {'id': 1, 'title': 'Batch/Lot number'},
                {'id': 2, 'title': 'Serial number'},
            ];
            let $modal = $(this);
            FormElementControl.loadInitS2($boxPType, [], {'is_default': true}, $modal);
            FormElementControl.loadInitS2($boxPCategory, [], {}, $modal);
            FormElementControl.loadInitS2($boxPUomGr, [], {}, $modal);
            FormElementControl.loadInitS2($boxPUom, [], {}, $modal);
            FormElementControl.loadInitS2($boxPTax, [], {}, $modal);
            FormElementControl.loadInitS2($boxPMethod, dataMethod, {}, $modal);
        });

        $('#add-product-uom-group').on('change', function () {
            let $boxPUom = $('#add-product-uom');
            let $modal = $('#addQuickProduct');
            FormElementControl.loadInitS2($boxPUom, [], {'group': $(this).val()}, $modal);
        });

        $('#btn-save-quick-product').on('click', function () {
            let dataSubmit = {};
            dataSubmit['title'] = $('#add-product-title').val();
            dataSubmit['code'] = $('#add-product-code').val();
            dataSubmit['description'] = $('#add-product-remark').val();
            dataSubmit['product_types_mapped_list'] = $('#add-product-type').val();
            dataSubmit['general_product_category'] = $('#add-product-category').val();
            dataSubmit['general_uom_group'] = $('#add-product-uom-group').val();
            dataSubmit['sale_default_uom'] = $('#add-product-uom').val();
            dataSubmit['sale_tax'] = $('#add-product-tax').val();
            dataSubmit['general_traceability_method'] = parseInt($('#add-product-method').val());
            dataSubmit['product_choice'] = [0];
            for (let choice of $('#quick-product-choice')[0].querySelectorAll('.form-check-input:checked')) {
                dataSubmit['product_choice'].push(parseInt(choice.value));
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': QuotationLoadDataHandle.urlEle.attr('data-url-quick-product'),
                    'method': 'POST',
                    'data': dataSubmit,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        QuotationLoadDataHandle.loadModalSProduct();
                        $('#selectProductModal').modal('show');
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        });

        QuotationDataTableHandle.$tableProduct.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow(this.closest('tr'), QuotationDataTableHandle.$tableProduct);
            // Re order
            reOrderSTT(QuotationDataTableHandle.$tableProduct);
            // Delete all promotion rows
            deletePromotionRows(QuotationDataTableHandle.$tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(QuotationDataTableHandle.$tableProduct, false, true);
            // ReCalculate Total
            QuotationCalculateCaseHandle.updateTotal(QuotationDataTableHandle.$tableProduct[0]);
            // load again table cost
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
            QuotationStoreDataHandle.storeDtbData(1);
        });

        QuotationDataTableHandle.$tableProduct.on('click', '.btn-select-price', function () {
            let row = this.closest('tr');
            if (row) {
                let itemEle = row.querySelector('.table-row-item');
                if (itemEle) {
                    QuotationLoadDataHandle.loadPriceProduct(itemEle);
                }
            }
         });

        QuotationLoadDataHandle.$btnSavePrice.on('click', function () {
            let modalBody = QuotationLoadDataHandle.$priceModal[0].querySelector('.modal-body');
            if (modalBody) {
                let productTarget = modalBody.querySelector('.product-target');
                let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                if (productTarget && priceChecked) {
                    let product = QuotationDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${productTarget.getAttribute('data-product-id')}"]`);
                    if (product) {
                        let row = product.closest('tr');
                        if (priceChecked.getAttribute('data-value') && priceChecked.getAttribute('data-price') && row.querySelector('.table-row-uom')) {
                            let priceVal = priceChecked.getAttribute('data-value');
                            let eleUOM = row.querySelector('.table-row-uom');
                            let dataPrice = JSON.parse(priceChecked.getAttribute('data-price'));
                            if (dataPrice?.['uom']?.['id'] !== $(eleUOM).val()) {
                                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-valid-price-uom')}, 'failure');
                                return false;
                            }
                            let priceEle = row.querySelector('.table-row-price');
                            if (priceEle) {
                                $(priceEle).attr('value', String(priceVal));
                                $.fn.initMaskMoney2();
                                QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableProduct, row);
                                let priceGrEle = priceEle.closest('.input-group-price');
                                if (priceGrEle) {
                                    priceGrEle.setAttribute('data-price-id', dataPrice?.['id']);
                                }
                            }
                        }
                    }
                }
            }
        });

        QuotationDataTableHandle.$tableProduct.on('change', '.table-row-item, .table-row-uom, .table-row-quantity, .table-row-price, .table-row-tax, .table-row-discount', function () {
            if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let row = this.closest('tr');
                if ($(this).hasClass('table-row-price')) {
                    $(this).removeClass('text-primary');
                    QuotationLoadDataHandle.loadChangePaymentTerm();
                }
                if ($(this).hasClass('table-row-item') || $(this).hasClass('table-row-uom') || $(this).hasClass('table-row-quantity') || $(this).hasClass('table-row-tax')) {
                    QuotationLoadDataHandle.loadSetWFRuntimeZone();
                    if ($(this).hasClass('table-row-uom')) {
                        let modalBody = QuotationLoadDataHandle.$priceModal[0].querySelector('.modal-body');
                        if (modalBody) {
                            let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                            if (priceChecked) {
                                if (priceChecked.getAttribute('data-price')) {
                                    let dataPrice = JSON.parse(priceChecked.getAttribute('data-price'));
                                    if (dataPrice?.['uom']?.['id'] !== $(this).val()) {
                                        let elePrice = row.querySelector('.table-row-price');
                                        if (elePrice) {
                                            $(elePrice).attr('value', String(0));
                                        }
                                        $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-valid-price-uom')}, 'failure');
                                    }
                                }
                            }
                        }
                    }
                    QuotationLoadDataHandle.loadChangePaymentTerm();
                }
                // Delete all promotion rows
                deletePromotionRows(QuotationDataTableHandle.$tableProduct, true, false);
                // Delete all shipping rows
                deletePromotionRows(QuotationDataTableHandle.$tableProduct, false, true);
                // Re Calculate all data of rows & total
                QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableProduct, row);
            }
        });

        QuotationDataTableHandle.$tableProduct.on('click', '.table-row-group', function () {
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        });

        QuotationDataTableHandle.$tableProduct.on('blur', '.table-row-group-title-edit', function () {
            QuotationLoadDataHandle.loadOnBlurGroupTitleEdit(this);
        });

        QuotationDataTableHandle.$tableProduct.on('click', '.btn-edit-group', function () {
            QuotationLoadDataHandle.loadOnClickBtnEditGroup(this);
        });

        QuotationDataTableHandle.$tableProduct.on('click', '.btn-del-group', function () {
            // show product first then delete
            let row = this.closest('tr');
            let eleGroup = row.querySelector('.table-row-group');
            if (eleGroup) {
                if ($(eleGroup).attr('aria-expanded') === 'false') {
                    $(eleGroup).click();
                }
                deleteRow(this.closest('tr'), QuotationDataTableHandle.$tableProduct);
                // load products to another group after del group
                QuotationLoadDataHandle.loadProductAfterDelGroup(row.querySelector('.table-row-group'));
            }
        });

        $('input[type=text].quotation-create-product-discount').on('change', function () {
            // Delete all promotion rows
            deletePromotionRows(QuotationDataTableHandle.$tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(QuotationDataTableHandle.$tableProduct, false, true);
            // Calculate with discount on Total
            QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
                let row = this.node();
                QuotationCalculateCaseHandle.calculate(row);
            });
            QuotationCalculateCaseHandle.updateTotal(QuotationDataTableHandle.$tableProduct[0])
        });

// EXPENSE
        $quotationTabs.on('click', '.tab-expense', function () {
            QuotationStoreDataHandle.storeDtbData(1);
            QuotationStoreDataHandle.storeDtbData(2);
            QuotationStoreDataHandle.storeDtbData(3);
            QuotationStoreDataHandle.storeDtbData(4);
            QuotationStoreDataHandle.storeDtbData(5);
        });

        QuotationDataTableHandle.$tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow(this.closest('tr'), QuotationDataTableHandle.$tableExpense);
            // Re order
            reOrderSTT(QuotationDataTableHandle.$tableExpense);
            QuotationCalculateCaseHandle.updateTotal(QuotationDataTableHandle.$tableExpense[0]);
            QuotationStoreDataHandle.storeDtbData(3);
        });

        QuotationDataTableHandle.$tableExpense.on('click', '.table-row-price-option', function () {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).attr('value', String(priceValRaw));
                    $.fn.initMaskMoney2();
                    QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableExpense, row);
                }
            }
        });

        QuotationDataTableHandle.$tableExpense.on('change', '.table-row-item, .table-row-labor-item, .table-row-uom, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if (this.classList.contains('table-row-labor-item')) {
                QuotationLoadDataHandle.loadChangeLabor(this);
            }
            if (this.classList.contains('table-row-uom')) {
                if (row.querySelector('.table-row-labor-item')) {
                    let dataLabor = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-labor-item')), $(row.querySelector('.table-row-labor-item')).val());
                    let dataUOM = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-uom')), $(row.querySelector('.table-row-uom')).val());
                    if (dataLabor && dataUOM) {
                        QuotationLoadDataHandle.loadPriceLabor(row, dataLabor, dataUOM?.['id']);
                    }
                }
            }
            QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableExpense, row);
        });

// COST
        $quotationTabs.on('click', '.tab-cost', function () {
            QuotationStoreDataHandle.storeDtbData(1);
            QuotationStoreDataHandle.storeDtbData(2);
            QuotationStoreDataHandle.storeDtbData(3);
            QuotationStoreDataHandle.storeDtbData(4);
            QuotationStoreDataHandle.storeDtbData(5);
            if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                QuotationLoadDataHandle.loadDataTableCost();
            }
        });

        QuotationDataTableHandle.$tableCost.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let row = this.closest('tr');
                QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableCost, row);
                QuotationStoreDataHandle.storeDtbData(2);
            }
        });

        QuotationDataTableHandle.$tableCost.on('click', '.btn-select-cost', function () {
            let row = this.closest('tr');
            if (row) {
                let itemEle = row.querySelector('.table-row-item');
                if (itemEle) {
                    QuotationLoadDataHandle.loadCostProduct(itemEle);
                }
            }
         });

        QuotationLoadDataHandle.$btnSaveCost.on('click', function () {
            let modalBody = QuotationLoadDataHandle.$costModal[0].querySelector('.modal-body');
            if (modalBody) {
                let productTarget = modalBody.querySelector('.product-target');
                let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                if (productTarget && priceChecked) {
                    let product = QuotationDataTableHandle.$tableCost[0].querySelector(`.table-row-item[data-product-id="${productTarget.getAttribute('data-product-id')}"]`);
                    if (product) {
                        let priceValRaw = priceChecked.getAttribute('data-value');
                        if (priceValRaw) {
                            let row = product.closest('tr');
                            let elePrice = row.querySelector('.table-row-price');
                            if (elePrice) {
                                $(elePrice).attr('value', String(priceValRaw));
                                if (priceChecked.getAttribute('data-wh')) {
                                    $(elePrice).attr('data-wh', priceChecked.getAttribute('data-wh'));
                                    let dataWH = JSON.parse(priceChecked.getAttribute('data-wh'));
                                    let inputGrPrice = elePrice.closest('.input-group-price');
                                    if (inputGrPrice) {
                                        inputGrPrice.setAttribute('data-cost-wh-id', dataWH?.['id']);
                                    }
                                }
                                $.fn.initMaskMoney2();
                                QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableCost, row);
                            }
                        }
                        QuotationStoreDataHandle.storeDtbData(2);
                    }
                }
            }
        });

        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        modalShipping.on('click', '.choose-shipping', function () {
            // Enable other buttons
            $('.choose-shipping').prop('disabled', false);
            // Disable the clicked button
            $(this).prop('disabled', true);
            $('#quotation-create-shipping-address')[0].value = this.getAttribute('data-address');
            $('#quotation-create-customer-shipping').val(this.id);
            let rowShipping = QuotationDataTableHandle.$tableProduct[0].querySelector('.table-row-shipping');
            if (rowShipping) {
                // Delete all promotion rows
                deletePromotionRows(QuotationDataTableHandle.$tableProduct, true, false);
                // Delete all shipping rows
                deletePromotionRows(QuotationDataTableHandle.$tableProduct, false, true);
                // ReCalculate Total
                QuotationCalculateCaseHandle.updateTotal(QuotationDataTableHandle.$tableProduct[0]);
            }
        });

        modalBilling.on('click', '.choose-billing', function () {
            // Enable other buttons
            $('.choose-billing').prop('disabled', false);
            // Disable the clicked button
            $(this).prop('disabled', true);
            $('#quotation-create-billing-address')[0].value = this.getAttribute('data-address');
            $('#quotation-create-customer-billing').val(this.id);
        });

// COPY FROM - TO
// Action on click button copy quotation on sale order page + restart all status of all element of modal
        $('#btn-copy-quotation').on('click', function () {
            let type = $(this)[0].getAttribute('data-copy-type');
            $(divCopyOption[0].querySelector('.check-option')).prop('checked', true);
            QuotationDataTableHandle.$tableQuotationCopyProduct[0].setAttribute('hidden', true);
            if (type === 'copy-from') {
                // restart all status of all element of modal
                $('#btn-select-quotation-copy')[0].removeAttribute('hidden');
                $('#btn-quotation-copy-confirm')[0].setAttribute('hidden', true);
                QuotationDataTableHandle.$tableQuotationCopy[0].removeAttribute('hidden');
                divCopyOption[0].setAttribute('hidden', true);
                // load table quotation list for copy
                QuotationLoadDataHandle.loadTableCopyQuotation();
            } else if (type === 'copy-to') {
                // load data product for table datable-copy-quotation-product
                let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
                QuotationDataTableHandle.$tableQuotationCopyProduct.DataTable().destroy();
                // Filter all data is not Promotion from quotation_products_data
                let finalList = filterDataProductNotPromotion(dataCopy.quotation_products_data);
                QuotationDataTableHandle.dataTableCopyQuotationProduct(finalList);
            }
        });

        QuotationDataTableHandle.$tableQuotationCopy.on('click', '.table-row-check', function () {
            QuotationDataTableHandle.$tableQuotationCopy.find('.table-row-check').prop('checked', false);
            $(this).prop('checked', true);
            QuotationLoadDataHandle.loadAPIDetailQuotation($(this)[0].getAttribute('data-id'));
        });

        $('#btn-select-quotation-copy').on('click', function() {
            QuotationDataTableHandle.$tableQuotationCopy[0].setAttribute('hidden', true);
            QuotationDataTableHandle.$tableQuotationCopy.DataTable().clear().draw();
            QuotationDataTableHandle.$tableQuotationCopy.empty();
            QuotationDataTableHandle.$tableQuotationCopy.DataTable().destroy();
            $('#copy-quotation-option')[0].removeAttribute('hidden');
            // load data product for table datable-copy-quotation-product
            let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
            QuotationDataTableHandle.$tableQuotationCopyProduct.DataTable().destroy();
            // Filter all data is not Promotion from quotation_products_data
            let finalList = filterDataProductNotPromotion(dataCopy.quotation_products_data);
            QuotationDataTableHandle.dataTableCopyQuotationProduct(finalList);

            $('#btn-select-quotation-copy')[0].setAttribute('hidden', true);
            $('#btn-quotation-copy-confirm')[0].removeAttribute('hidden')
        });

        divCopyOption.on('change', '.check-option', function() {
            if ($(this)[0].checked === false) {
                QuotationDataTableHandle.$tableQuotationCopyProduct[0].removeAttribute('hidden');
            } else {
                QuotationDataTableHandle.$tableQuotationCopyProduct[0].setAttribute('hidden', true);
            }
        });

        $('#btn-quotation-copy-confirm').on('click', function () {
            QuotationLoadDataHandle.loadSetupCopy(this);
        });

        function prepareDataCopyTo() {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    QuotationLoadDataHandle.loadAPIDetailQuotation(dataRaw?.['id']);
                    checkElementValuesBeforeLoadDataCopy();
                }
            }
        }
        prepareDataCopyTo();

        function loadDataCopyTo(dataCopy) {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    if (dataRaw?.['option'] === 'custom') { // if option copy is custom then setup data products & costs for load
                        let products = dataRaw?.['products'];
                        let result = [];
                        let order = 0;
                        for (let idx = 0; idx < products.length; idx++) {
                            let checkedID = products[idx]?.['id'];
                            let checkedQuantity = products[idx]?.['quantity'];
                            for (let i = 0; i < dataCopy?.['quotation_products_data'].length; i++) {
                                let data = dataCopy?.['quotation_products_data'][i];
                                if (data?.['product']?.['id'] === checkedID) {
                                    data['product_quantity'] = parseFloat(checkedQuantity);
                                    order++
                                    data['order'] = order;
                                    result.push(data);
                                    break
                                }
                            }
                        }
                        dataCopy['quotation_products_data'] = result;
                        dataCopy['quotation_costs_data'] = [];
                    }
                    QuotationLoadDataHandle.loadCopyData(dataCopy);
                }
            }
        }

        function checkElementValuesBeforeLoadDataCopy() {
            let element0 = $('#data-copy-quotation-detail').val();
            if (element0) {
                loadDataCopyTo(JSON.parse(element0));  // call loadDataCopyTo() if all condition pass
            } else {
                setTimeout(checkElementValuesBeforeLoadDataCopy, 1000);  // call again after 1s if condition not pass yet
            }
        }

        QuotationLoadDataHandle.loadInitOpportunity();
        QuotationLoadDataHandle.loadRecurrenceData();

// PROMOTION
// Action on click button Check Available Promotion (show list promotions)
        QuotationDataTableHandle.$tablePromotion.on('click', '.apply-promotion', function () {
            $(this).prop('disabled', true);
            deletePromotionRows(QuotationDataTableHandle.$tableProduct, true, false);
            // ReCalculate Total
            QuotationCalculateCaseHandle.updateTotal(QuotationDataTableHandle.$tableProduct[0]);
            // get promotion condition to apply
            let promotionData = JSON.parse($(this)[0].getAttribute('data-promotion'));
            let promotionParse = QuotationPromotionHandle.getPromotionResult(promotionData);
            let TotalOrder = QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-order').length;
            let TotalGroup = QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-group').length;
            let order = (TotalOrder - TotalGroup) + 1;
            let dataAdd = {
                "tax": {},
                "order": order,
                "product": {},
                "product_code": promotionParse?.['product_code'],
                "product_title": promotionParse?.['product_title'],
                "unit_of_measure": {},
                "product_quantity": promotionParse?.['product_quantity'],
                "product_uom_code": "",
                "product_tax_title": "",
                "product_tax_value": 0,
                "product_uom_title": "",
                "product_tax_amount": 0,
                "product_unit_price": promotionParse?.['product_price'],
                "product_description": promotionParse?.['product_description'],
                "product_discount_value": 0,
                "product_subtotal_price": 0,
                "product_discount_amount": 0,
                "is_promotion": true,
                "promotion_id": promotionParse?.['id'],
                "promotion_data": promotionParse,
                "is_shipping": false,
                "shipping": {},
            };
            if (promotionParse?.['is_discount'] === true) { // DISCOUNT
                if (promotionParse?.['row_apply_index'] !== null) { // on product
                    let newRow = QuotationDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    let afterRow = QuotationDataTableHandle.$tableProduct.DataTable().row(promotionParse?.['row_apply_index']).node();
                    $(newRow).detach().insertAfter(afterRow);
                    QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableProduct, newRow);
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                } else { // on whole order
                    let newRow = QuotationDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableProduct, newRow);
                    if (promotionParse.hasOwnProperty('discount_rate_on_order')) {
                        if (promotionParse.discount_rate_on_order !== null) {
                            if (promotionParse.is_before_tax === true) {
                                QuotationPromotionHandle.calculatePromotion(QuotationDataTableHandle.$tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price']);
                            } else {
                                QuotationPromotionHandle.calculatePromotion(QuotationDataTableHandle.$tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price'], false)
                            }
                        }
                    }
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                }
            } else if (promotionParse?.['is_gift'] === true) { // GIFT
                if (promotionParse?.['row_apply_index'] !== null) { // on product
                    let newRow = QuotationDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                    let afterRow = QuotationDataTableHandle.$tableProduct.DataTable().row(promotionParse?.['row_apply_index']).node();
                    $(newRow).detach().insertAfter(afterRow);
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                } else { // on whole order
                    let newRow = QuotationDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                }
            }
            reOrderSTT(QuotationDataTableHandle.$tableProduct);
        });

// SHIPPING
// Action on click button Add Shipping Fee (show list shipping)
        QuotationDataTableHandle.$tableShipping.on('click', '.apply-shipping', function () {
            $(this).prop('disabled', true);
            // Delete all promotion rows
            deletePromotionRows(QuotationDataTableHandle.$tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(QuotationDataTableHandle.$tableProduct, false, true);
            // ReCalculate Total
            QuotationCalculateCaseHandle.updateTotal(QuotationDataTableHandle.$tableProduct[0]);
            if (this.getAttribute('data-shipping')) {
                let dataShipping = JSON.parse(this.getAttribute('data-shipping'));
                let shippingPrice = parseFloat(dataShipping?.['shipping_price']);
                let TotalOrder = QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-order').length;
                let TotalGroup = QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-group').length;
                let order = (TotalOrder - TotalGroup) + 1;
                let dataAdd = {
                    "order": order,
                    "product_quantity": 1,
                    "product_uom_code": "",
                    "product_tax_title": "",
                    "product_tax_value": 0,
                    "product_uom_title": "",
                    "product_tax_amount": 0,
                    "product_unit_price": shippingPrice,
                    "product_description": dataShipping?.['title'],
                    "product_discount_value": 0,
                    "product_subtotal_price": shippingPrice,
                    "product_discount_amount": 0,
                    "is_promotion": false,
                    "is_shipping": true,
                    "shipping_id": dataShipping?.['id'],
                    "shipping_data": dataShipping,
                };
                let newRow = QuotationDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
                FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
                // Re Calculate after add shipping (pretax, discount, total)
                shippingHandle.calculateShipping(shippingPrice);
                // Load disabled
                QuotationLoadDataHandle.loadRowDisabled(newRow);
                // ReOrder STT
                reOrderSTT(QuotationDataTableHandle.$tableProduct);
                QuotationLoadDataHandle.loadSetWFRuntimeZone();
            }
        });

// INDICATORS
        $('#tab-indicator').on('click', function () {
            if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                indicatorHandle.loadIndicator();
                QuotationLoadDataHandle.loadSetWFRuntimeZone();
            }
        });

// PAYMENT STAGE
        $quotationTabs.on('click', '.tab-payment', function () {
            QuotationStoreDataHandle.storeDtbData(1);
            QuotationStoreDataHandle.storeDtbData(2);
            QuotationStoreDataHandle.storeDtbData(3);
            QuotationStoreDataHandle.storeDtbData(4);
            QuotationStoreDataHandle.storeDtbData(5);
        });

        QuotationDataTableHandle.$tableInvoice.on('click', '.btn-select-term', function () {
            QuotationLoadDataHandle.loadModalSTerm(this);
        });

        QuotationDataTableHandle.$tableInvoice.on('change', '.table-row-total', function () {
            let row = this.closest('tr');
            if (row) {
                let balanceEle = row.querySelector('.table-row-balance');
                if (balanceEle) {
                    $(balanceEle).attr('value', String($(this).valCurrency()));
                    $.fn.initMaskMoney2();
                }
            }
        });

        QuotationDataTableHandle.$tableInvoice.on('click', '.del-row', function (e) {
            deleteRow(this.closest('tr'), QuotationDataTableHandle.$tableInvoice);
            reOrderSTT(QuotationDataTableHandle.$tableInvoice);
            QuotationDataTableHandle.$tablePayment.DataTable().clear().draw();
            QuotationStoreDataHandle.storeDtbData(5);
        });

        QuotationLoadDataHandle.$btnSaveTerm.on('click', function () {
           QuotationLoadDataHandle.loadSaveSTerm();
        });

        QuotationDataTableHandle.$tablePayment.on('change', '.table-row-date, .table-row-installment, .table-row-ratio, .table-row-value-before-tax, .table-row-issue-invoice, .table-row-value-tax, .table-row-value-total, .table-row-due-date', function () {
            if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order') && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let row = this.closest('tr');
                if ($(this).hasClass('table-row-date')) {
                    let isCheck = true;
                    let eleDueDate = row.querySelector('.table-row-due-date');
                    let eleInstallment = row.querySelector('.table-row-installment');
                    if (eleDueDate && eleInstallment) {
                        if ($(this).val() && $(eleDueDate).val() && !$(eleInstallment).val()) {
                            isCheck = validateStartEndDate($(this).val(), $(eleDueDate).val());
                        }
                    }
                    if (isCheck === true) {
                        QuotationLoadDataHandle.loadChangePSDate(this);
                    } else {
                        $(this).val(null);
                        $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-validate-due-date')}, 'failure');
                        return false;
                    }
                }
                if ($(this).hasClass('table-row-installment')) {
                    QuotationLoadDataHandle.loadChangeInstallment(this);
                }
                if ($(this).hasClass('table-row-ratio')) {
                    QuotationLoadDataHandle.loadPaymentValues(this);
                    let valBeforeEle = row.querySelector('.table-row-value-before-tax');
                    validatePSValue(valBeforeEle);
                    QuotationLoadDataHandle.loadMinusBalance();
                }
                if ($(this).hasClass('table-row-issue-invoice')) {
                    QuotationLoadDataHandle.loadChangePSIssueInvoice(this);
                }
                if ($(this).hasClass('table-row-due-date')) {
                    let row = this.closest('tr');
                    let eleDate = row.querySelector('.table-row-date');
                    let eleTerm = row.querySelector('.table-row-term');
                    if (eleDate && eleTerm) {
                        if ($(this).val() && $(eleDate).val() && !$(eleTerm).val()) {
                            let isCheck = validateStartEndDate($(eleDate).val(), $(this).val());
                            if (isCheck === false) {
                                $(this).val(null);
                                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-validate-due-date')}, 'failure');
                                return false;
                            }
                        }
                    }
                }
                if ($(this).hasClass('table-row-value-before-tax')) {
                    QuotationLoadDataHandle.loadPaymentValues(this);
                    QuotationLoadDataHandle.loadMinusBalance();
                }
                if ($(this).hasClass('table-row-value-tax')) {
                    QuotationLoadDataHandle.loadPaymentValues(this);
                    QuotationLoadDataHandle.loadMinusBalance();
                }
            }
        });

        QuotationDataTableHandle.$tablePayment.on('click', '.btn-select-invoice', function () {
            QuotationLoadDataHandle.loadModalSInvoice(this);
        });

        QuotationLoadDataHandle.$btnSaveInvoice.on('click', function () {
            QuotationLoadDataHandle.loadSaveSInvoice();
        });

        QuotationDataTableHandle.$tablePayment.on('click', '.btn-select-reconcile', function () {
            QuotationLoadDataHandle.loadModalSReconcile(this);
        });

        QuotationLoadDataHandle.$btnSaveReconcile.on('click', function () {
            QuotationLoadDataHandle.loadSaveSReconcile();
        });

        QuotationDataTableHandle.$tablePayment.on('click', '.del-row', function () {
            deleteRow(this.closest('tr'), QuotationDataTableHandle.$tablePayment);
            reOrderSTT(QuotationDataTableHandle.$tablePayment);
            QuotationStoreDataHandle.storeDtbData(4);
        });

// IMPORT TABLE
        $('#modal-load-datatable-from-excel .btn-gradient-primary').on('click', function () {
            QuotationLoadDataHandle.loadImport();
        });

// DELIVERY
        QuotationDeliveryHandle.$btnDeliveryInfo.on('click', function () {
            if (QuotationLoadDataHandle.$eleStoreDetail.val()) {
                let dataDetail = JSON.parse(QuotationLoadDataHandle.$eleStoreDetail.val());
                QuotationDeliveryHandle.checkOpenDeliveryInfo(dataDetail);
            }
        });

        QuotationDeliveryHandle.$btnDelivery.on('click', function () {
            if (!QuotationDeliveryHandle.$deliveryEstimatedDateEle.val()) {
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-required-delivery-date')}, 'failure');
                return false;
            }

            let dataDelivery = {};
            dataDelivery['estimated_delivery_date'] = moment(QuotationDeliveryHandle.$deliveryEstimatedDateEle.val(), "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss");
            dataDelivery['remarks'] = QuotationDeliveryHandle.$deliveryRemarkEle.val();

            WindowControl.showLoading();
            $.fn.callAjax2({
                url: QuotationLoadDataHandle.urlEle.attr('data-create-delivery').replace('1', $(this).attr('data-id')),
                method: 'POST',
                data: dataDelivery,
                urlRedirect: null,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data?.['status'] === 200) {
                        const config = data?.config
                        let url_redirect = QuotationLoadDataHandle.urlEle.attr('data-delivery')
                        if (config?.is_picking && !data?.['is_not_picking'])
                            url_redirect = QuotationLoadDataHandle.urlEle.attr('data-picking')
                        setTimeout(() => {
                            window.location.href = url_redirect
                        }, 1000);
                    }
                },
                (errs) => {
                    WindowControl.hideLoading();
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        });




// Submit form quotation + sale order
        SetupFormSubmit.validate(QuotationLoadDataHandle.$form, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
                employee_inherit_id: {
                    required: true,
                },
                customer_id: {
                    required: true,
                },
                contact_id: {
                    required: true,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            if (QuotationDataTableHandle.$tableProduct[0].querySelector('.table-row-promotion') && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === "post") { // HAS PROMOTION => Check condition again
                QuotationPromotionHandle.callPromotion(1);
                // Check promotion then Submit Form
                submitCheckPromotion();
            } else { // NO PROMOTION => submit normal
                // Submit Form normal
                submitForm();
            }
        }

        function submitCheckPromotion() {
            let valueCheck = $('#quotation-check-promotion').val();
            if (valueCheck) {
                if (valueCheck === 'true') {
                    submitForm();
                } else if (valueCheck === 'false') {
                    $('#btn-invalid-promotion').click();
                    return false
                }
            } else {
                setTimeout(submitCheckPromotion, 1000);  // call again after 1s if condition not pass yet
            }
        }

         function submitForm() {
             let is_sale_order = false;
             if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                 is_sale_order = true;
             }
             let _form = new SetupFormSubmit(QuotationLoadDataHandle.$form);
             // Load again indicator when Submit
             indicatorHandle.loadIndicator();
             QuotationLoadDataHandle.loadDataTableCost();
             let result = QuotationSubmitHandle.setupDataSubmit(_form);
             if (result === false) {
                 return false;
             }
            let submitFields = [
                // process
                'process',
                'process_stage_app',
                //
                'title',
                'opportunity_id',
                'customer_id',
                'customer_data',
                'contact_id',
                'contact_data',
                'employee_inherit_id',
                'payment_term_id',
                'payment_term_data',
                // total amount of products
                'total_product_pretax_amount',
                'total_product_discount_rate',
                'total_product_discount',
                'total_product_tax',
                'total_product',
                'total_product_revenue_before_tax',
                // total amount of costs
                'total_cost_pretax_amount',
                'total_cost_tax',
                'total_cost',
                // total amount of expenses
                'total_expense_pretax_amount',
                'total_expense_tax',
                'total_expense',
                // quotation tabs
                'quotation_products_data',
                'quotation_logistic_data',
                'customer_shipping',
                'customer_billing',
                'quotation_costs_data',
                'quotation_expenses_data',
                'is_customer_confirm',
                // indicator tab
                'quotation_indicators_data',
                // indicators
                'indicator_revenue',
                'indicator_gross_profit',
                'indicator_net_income',
                // abstract
                'system_status',
                'next_node_collab_id',
                'is_change',
                'document_root_id',
                'document_change_order',
            ]
            if (is_sale_order === true) {
                submitFields = [
                    // process
                    'process',
                    'process_stage_app',
                    //
                    'title',
                    'opportunity_id',
                    'customer_id',
                    'customer_data',
                    'contact_id',
                    'contact_data',
                    'employee_inherit_id',
                    'payment_term_id',
                    'payment_term_data',
                    'quotation_id',
                    'quotation_data',
                    // total amount of products
                    'total_product_pretax_amount',
                    'total_product_discount_rate',
                    'total_product_discount',
                    'total_product_tax',
                    'total_product',
                    'total_product_revenue_before_tax',
                    // total amount of costs
                    'total_cost_pretax_amount',
                    'total_cost_tax',
                    'total_cost',
                    // total amount of expenses
                    'total_expense_pretax_amount',
                    'total_expense_tax',
                    'total_expense',
                    // sale order tabs
                    'sale_order_products_data',
                    'sale_order_logistic_data',
                    'customer_shipping',
                    'customer_billing',
                    'sale_order_costs_data',
                    'sale_order_expenses_data',
                    // indicator tab
                    'sale_order_indicators_data',
                    // indicators
                    'indicator_revenue',
                    'indicator_gross_profit',
                    'indicator_net_income',
                    // payment stage tab
                    'sale_order_payment_stage',
                    'sale_order_invoice',
                    // abstract
                    'system_status',
                    'next_node_collab_id',
                    'is_change',
                    'document_root_id',
                    'document_change_order',
                    'is_recurrence_template',
                    'is_recurring',
                    'recurrence_task_id',
                ]
            }
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            WFRTControl.callWFSubmitForm(_form);
        }

// WORKFLOW

        // events on btn action WF zone (depend on business rule)
        $('#btn-active-edit-zone-wf').on('click', function () {
            QuotationCheckConfigHandle.checkConfig(0);
        });

        $('#btn-remove-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            // Delete Promotion Row & ReCalculate Total
            deletePromotionRows(QuotationDataTableHandle.$tableProduct, true, false);
            QuotationCalculateCaseHandle.updateTotal(QuotationDataTableHandle.$tableProduct[0]);
        });

        $('#btn-check-another-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            $('#btn-check-promotion').click();
        })




    });
});
