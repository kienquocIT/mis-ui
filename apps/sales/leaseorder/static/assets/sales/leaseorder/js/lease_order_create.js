$(function () {

    $(document).ready(function () {

        // Elements
        let boxPriceList = $('#select-box-quotation-create-price-list');
        let tabPrice = $('#tab_terms');
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');
        let tablePS = $('#datable-quotation-payment-stage');
        let tablePromotion = $('#datable-quotation-create-promotion');
        let tableShipping = $('#datable-quotation-create-shipping');
        let tableCopyQuotation = $('#datable-copy-quotation');
        let divCopyOption = $('#copy-quotation-option');
        let tableCopyQuotationProduct = $('#datable-copy-quotation-product');
        let modalShipping = $('#quotation-create-modal-shipping-body');
        let modalBilling = $('#quotation-create-modal-billing-body');
        let $quotationTabs = $('#quotation-tabs');


        // Load inits
        LeaseOrderLoadDataHandle.loadCustomCss();
        LeaseOrderLoadDataHandle.loadInitInherit();
        LeaseOrderLoadDataHandle.loadInitCustomer();
        LeaseOrderLoadDataHandle.loadBoxQuotationCustomer();
        LeaseOrderLoadDataHandle.loadBoxQuotationContact();
        LeaseOrderLoadDataHandle.loadBoxQuotationPaymentTerm();
        LeaseOrderLoadDataHandle.loadInitDate();
        // init dataTable
        LeaseOrderDataTableHandle.dataTableSelectProduct();
        LeaseOrderDataTableHandle.dataTableSelectOffset();
        LeaseOrderDataTableHandle.dataTableSelectQuantity();
        LeaseOrderDataTableHandle.dataTableProduct();
        LeaseOrderDataTableHandle.dataTableCost();
        LeaseOrderDataTableHandle.dataTableExpense();
        LeaseOrderDataTableHandle.dataTableSaleOrderIndicator();
        LeaseOrderDataTableHandle.dataTablePaymentStage();
        // init config
        LeaseOrderLoadDataHandle.loadInitQuotationConfig(LeaseOrderLoadDataHandle.$form.attr('data-method'));
        // date picker
        $('.date-picker').each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            });
            $(this).val('').trigger('change');
        })

        // get WF initial zones
        WFRTControl.setWFInitialData('leaseorder');

        LeaseOrderLoadDataHandle.opportunitySelectEle.on('change', function () {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.opportunitySelectEle, LeaseOrderLoadDataHandle.opportunitySelectEle.val());
            if (dataSelected) {
                LeaseOrderLoadDataHandle.loadDataByOpportunity(dataSelected);
            }
        });

        LeaseOrderLoadDataHandle.customerSelectEle.on('change', function () {
            LeaseOrderLoadDataHandle.loadDataByCustomer();
        });

        LeaseOrderLoadDataHandle.salePersonSelectEle.on('change', function () {
            LeaseOrderLoadDataHandle.loadDataBySalePerson();
        });

        tabPrice.on('click', function() {
            if (!boxPriceList[0].innerHTML) {
                LeaseOrderLoadDataHandle.loadBoxQuotationPrice();
            }
        });

        LeaseOrderLoadDataHandle.paymentSelectEle.on('click', function () {
            LeaseOrderLoadDataHandle.loadBoxQuotationPaymentTerm();
        });

        LeaseOrderLoadDataHandle.paymentSelectEle.on('change', function () {
            LeaseOrderLoadDataHandle.loadChangePaymentTerm();
        });

// PRODUCT
        $quotationTabs.on('click', '.tab-detail', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderStoreDataHandle.storeDtbData(2);
            LeaseOrderStoreDataHandle.storeDtbData(3);
            LeaseOrderStoreDataHandle.storeDtbData(4);
        });

        LeaseOrderLoadDataHandle.$btnSaveSelectProduct.on('click', function () {
            LeaseOrderLoadDataHandle.loadNewProduct();
        });

        LeaseOrderLoadDataHandle.$btnSaveSelectOffset.on('click', function () {
            LeaseOrderLoadDataHandle.loadOffset(this);
        });

        LeaseOrderLoadDataHandle.$btnSaveSelectQuantity.on('click', function () {
            LeaseOrderLoadDataHandle.loadQuantity(this);
            LeaseOrderStoreDataHandle.storeDtbData(1);
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
            LeaseOrderLoadDataHandle.loadInitS2($boxPType, [], {'is_default': true}, $modal);
            LeaseOrderLoadDataHandle.loadInitS2($boxPCategory, [], {}, $modal);
            LeaseOrderLoadDataHandle.loadInitS2($boxPUomGr, [], {}, $modal);
            LeaseOrderLoadDataHandle.loadInitS2($boxPUom, [], {}, $modal);
            LeaseOrderLoadDataHandle.loadInitS2($boxPTax, [], {}, $modal);
            LeaseOrderLoadDataHandle.loadInitS2($boxPMethod, dataMethod, {}, $modal);
        });

        $('#add-product-uom-group').on('change', function () {
            let $boxPUom = $('#add-product-uom');
            let $modal = $('#addQuickProduct');
            LeaseOrderLoadDataHandle.loadInitS2($boxPUom, [], {'group': $(this).val()}, $modal);
        });

        $('#btn-save-product').on('click', function () {
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
                    'url': LeaseOrderLoadDataHandle.urlEle.attr('data-url-quick-product'),
                    'method': 'POST',
                    'data': dataSubmit,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        LeaseOrderLoadDataHandle.loadModalSProduct();
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

        tableProduct.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow(this.closest('tr'), tableProduct);
            // Re order
            reOrderSTT(tableProduct);
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // ReCalculate Total
            LeaseOrderCalculateCaseHandle.updateTotal(tableProduct[0]);
            // load again table cost
            LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        });

        tableProduct.on('click', '.btn-select-price', function () {
            if (this.closest('tr')) {
                if (this.closest('tr').querySelector('.table-row-item')) {
                    LeaseOrderLoadDataHandle.loadPriceProduct(this.closest('tr').querySelector('.table-row-item'));
                }
            }
         });

        LeaseOrderLoadDataHandle.$btnSavePrice.on('click', function () {
            let modalBody = LeaseOrderLoadDataHandle.$priceModal[0].querySelector('.modal-body');
            if (modalBody) {
                let productTarget = modalBody.querySelector('.product-target');
                let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                if (productTarget && priceChecked) {
                    let product = tableProduct[0].querySelector(`.table-row-item[data-product-id="${productTarget.getAttribute('data-product-id')}"]`);
                    if (product) {
                        let row = product.closest('tr');
                        if (priceChecked.getAttribute('data-value') && priceChecked.getAttribute('data-price') && row.querySelector('.table-row-uom')) {
                            let priceVal = priceChecked.getAttribute('data-value');
                            let eleUOM = row.querySelector('.table-row-uom');
                            let dataPrice = JSON.parse(priceChecked.getAttribute('data-price'));
                            if (dataPrice?.['uom']?.['id'] !== $(eleUOM).val()) {
                                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-valid-price-uom')}, 'failure');
                                return false;
                            }
                            let elePrice = row.querySelector('.table-row-price');
                            if (elePrice) {
                                $(elePrice).attr('value', String(priceVal));
                                $.fn.initMaskMoney2();
                                LeaseOrderCalculateCaseHandle.commonCalculate(tableProduct, row);
                                let inputGrPrice = elePrice.closest('.input-group-price');
                                if (inputGrPrice) {
                                    inputGrPrice.setAttribute('data-price-id', dataPrice?.['id']);
                                }
                            }
                        }
                    }
                }
            }
        });

        tableProduct.on('change', '.table-row-item, .table-row-uom, .table-row-quantity, .table-row-uom-time, .table-row-quantity-time, .table-row-price, .table-row-tax, .table-row-discount', function () {
            if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let row = $(this)[0].closest('tr');
                if ($(this).hasClass('table-row-item')) {
                    LeaseOrderLoadDataHandle.loadDataProductSelect($(this));
                }
                if ($(this).hasClass('validated-number')) {
                    validateNumber(this);
                }
                if ($(this).hasClass('table-row-price')) {
                    $(this).removeClass('text-primary');
                }
                if ($(this).hasClass('table-row-item') || $(this).hasClass('table-row-uom') || $(this).hasClass('table-row-quantity') || $(this).hasClass('table-row-tax')) {
                    // load again table cost
                    LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
                    if ($(this).hasClass('table-row-uom')) {
                        let modalBody = LeaseOrderLoadDataHandle.$priceModal[0].querySelector('.modal-body');
                        if (modalBody) {
                            let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                            if (priceChecked.getAttribute('data-price')) {
                                let dataPrice = JSON.parse(priceChecked.getAttribute('data-price'));
                                if (dataPrice?.['uom']?.['id'] !== $(this).val()) {
                                    let elePrice = row.querySelector('.table-row-price');
                                    if (elePrice) {
                                        $(elePrice).attr('value', String(0));
                                    }
                                    $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-valid-price-uom')}, 'failure');
                                }
                            }
                        }
                    }
                }
                // Delete all promotion rows
                deletePromotionRows(tableProduct, true, false);
                // Delete all shipping rows
                deletePromotionRows(tableProduct, false, true);
                // Re Calculate all data of rows & total
                LeaseOrderCalculateCaseHandle.commonCalculate(tableProduct, row);
                // change value before tax table payment
                LeaseOrderLoadDataHandle.loadChangePSValueBTAll();
            }
        });

        tableProduct.on('click', '.table-row-group', function () {
            let row = this.closest('tr');
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        });

        tableProduct.on('blur', '.table-row-group-title-edit', function () {
            let row = this.closest('tr');
            LeaseOrderLoadDataHandle.loadOnBlurGroupTitleEdit(this);
        });

        tableProduct.on('click', '.btn-edit-group', function () {
            let row = this.closest('tr');
            LeaseOrderLoadDataHandle.loadOnClickBtnEditGroup(this);
        });

        tableProduct.on('click', '.btn-del-group', function () {
            // show product first then delete
            let row = this.closest('tr');
            let eleGroup = row.querySelector('.table-row-group');
            if (eleGroup) {
                if ($(eleGroup).attr('aria-expanded') === 'false') {
                    $(eleGroup).click();
                }
                deleteRow(this.closest('tr'), tableProduct);
                // load products to another group after del group
                LeaseOrderLoadDataHandle.loadProductAfterDelGroup(row.querySelector('.table-row-group'));
            }
        });

        $('input[type=text].quotation-create-product-discount').on('change', function () {
            validateNumber(this);
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // Calculate with discount on Total
            tableProduct.DataTable().rows().every(function () {
                let row = this.node();
                LeaseOrderCalculateCaseHandle.calculate(row);
            });
            LeaseOrderCalculateCaseHandle.updateTotal(tableProduct[0])
        });

// EXPENSE
        $quotationTabs.on('click', '.tab-expense', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderStoreDataHandle.storeDtbData(2);
            LeaseOrderStoreDataHandle.storeDtbData(3);
            LeaseOrderStoreDataHandle.storeDtbData(4);
        });

        $('#btn-add-expense-quotation-create').on('click', function (e) {
            LeaseOrderLoadDataHandle.loadAddRowExpense();
        });

        $('#btn-add-labor-quotation-create').on('click', function (e) {
            LeaseOrderLoadDataHandle.loadAddRowLabor();
        });

        tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow(this.closest('tr'), tableExpense);
            // Re order
            reOrderSTT(tableExpense);
            LeaseOrderCalculateCaseHandle.updateTotal(tableExpense[0]);
        });

        tableExpense.on('click', '.table-row-price-option', function () {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).attr('value', String(priceValRaw));
                    $.fn.initMaskMoney2();
                    LeaseOrderCalculateCaseHandle.commonCalculate(tableExpense, row);
                }
            }
        });

        tableExpense.on('change', '.table-row-item, .table-row-labor-item, .table-row-uom, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if (this.classList.contains('table-row-labor-item')) {
                LeaseOrderLoadDataHandle.loadChangeLabor(this);
            }
            if (this.classList.contains('table-row-uom')) {
                if (row.querySelector('.table-row-labor-item')) {
                    let dataLabor = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-labor-item')), $(row.querySelector('.table-row-labor-item')).val());
                    let dataUOM = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-uom')), $(row.querySelector('.table-row-uom')).val());
                    if (dataLabor && dataUOM) {
                        LeaseOrderLoadDataHandle.loadPriceLabor(row, dataLabor, dataUOM?.['id']);
                    }
                }
            }
            // validate number
            if ($(this).hasClass('table-row-quantity') && $(this).hasClass('validated-number')) {
                validateNumber(this);
            }
            LeaseOrderCalculateCaseHandle.commonCalculate(tableExpense, row);
        });

// COST
        $quotationTabs.on('click', '.tab-cost', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderStoreDataHandle.storeDtbData(2);
            LeaseOrderStoreDataHandle.storeDtbData(3);
            LeaseOrderStoreDataHandle.storeDtbData(4);
            if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                LeaseOrderLoadDataHandle.loadDataTableCost();
            }
        });

        tableCost.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax, .table-row-depreciation', function () {
            if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let row = this.closest('tr');
                LeaseOrderCalculateCaseHandle.commonCalculate(tableCost, row);
            }
        });

        tableCost.on('click', '.btn-select-cost', function () {
            if (this.closest('tr')) {
                if (this.closest('tr').querySelector('.table-row-item')) {
                    LeaseOrderLoadDataHandle.loadCostProduct(this.closest('tr').querySelector('.table-row-item'));
                }
            }
         });

        LeaseOrderLoadDataHandle.$btnSaveCost.on('click', function () {
            let modalBody = LeaseOrderLoadDataHandle.$costModal[0].querySelector('.modal-body');
            if (modalBody) {
                let productTarget = modalBody.querySelector('.product-target');
                let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                if (productTarget && priceChecked) {
                    let product = tableCost[0].querySelector(`.table-row-item[data-product-id="${productTarget.getAttribute('data-product-id')}"]`);
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
                                LeaseOrderCalculateCaseHandle.commonCalculate(tableCost, row);
                            }
                        }
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
            let rowShipping = tableProduct[0].querySelector('.table-row-shipping');
            if (rowShipping) {
                // Delete all promotion rows
                deletePromotionRows(tableProduct, true, false);
                // Delete all shipping rows
                deletePromotionRows(tableProduct, false, true);
                // ReCalculate Total
                LeaseOrderCalculateCaseHandle.updateTotal(tableProduct[0]);
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
            tableCopyQuotationProduct[0].setAttribute('hidden', true);
            if (type === 'copy-from') {
                // restart all status of all element of modal
                $('#btn-select-quotation-copy')[0].removeAttribute('hidden');
                $('#btn-quotation-copy-confirm')[0].setAttribute('hidden', true);
                tableCopyQuotation[0].removeAttribute('hidden');
                divCopyOption[0].setAttribute('hidden', true);
                // load table quotation list for copy
                let opp_id = null;
                let sale_person_id = null;
                if (LeaseOrderLoadDataHandle.opportunitySelectEle.val()) {
                    opp_id = LeaseOrderLoadDataHandle.opportunitySelectEle.val()
                }
                if (LeaseOrderLoadDataHandle.salePersonSelectEle.val()) {
                    sale_person_id = LeaseOrderLoadDataHandle.salePersonSelectEle.val()
                }
                LeaseOrderLoadDataHandle.loadTableCopyQuotation(opp_id, sale_person_id);
            } else if (type === 'copy-to') {
                // load data product for table datable-copy-quotation-product
                let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
                tableCopyQuotationProduct.DataTable().destroy();
                // Filter all data is not Promotion from quotation_products_data
                let finalList = filterDataProductNotPromotion(dataCopy.quotation_products_data);
                LeaseOrderDataTableHandle.dataTableCopyQuotationProduct(finalList);
            }
        });

        tableCopyQuotation.on('click', '.table-row-check', function () {
            tableCopyQuotation.find('.table-row-check').prop('checked', false);
            $(this).prop('checked', true);
            LeaseOrderLoadDataHandle.loadAPIDetailQuotation($(this)[0].getAttribute('data-id'));
        });

        $('#btn-select-quotation-copy').on('click', function() {
            tableCopyQuotation[0].setAttribute('hidden', true);
            tableCopyQuotation.DataTable().clear().draw();
            tableCopyQuotation.empty();
            tableCopyQuotation.DataTable().destroy();
            $('#copy-quotation-option')[0].removeAttribute('hidden');
            // load data product for table datable-copy-quotation-product
            let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
            tableCopyQuotationProduct.DataTable().destroy();
            // Filter all data is not Promotion from quotation_products_data
            let finalList = filterDataProductNotPromotion(dataCopy.quotation_products_data);
            LeaseOrderDataTableHandle.dataTableCopyQuotationProduct(finalList);

            $('#btn-select-quotation-copy')[0].setAttribute('hidden', true);
            $('#btn-quotation-copy-confirm')[0].removeAttribute('hidden')
        });

        divCopyOption.on('change', '.check-option', function() {
            if ($(this)[0].checked === false) {
                tableCopyQuotationProduct[0].removeAttribute('hidden');
            } else {
                tableCopyQuotationProduct[0].setAttribute('hidden', true);
            }
        });

        $('#btn-quotation-copy-confirm').on('click', function () {
            LeaseOrderLoadDataHandle.loadSetupCopy(this);
        });

        function prepareDataCopyTo() {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    LeaseOrderLoadDataHandle.loadAPIDetailQuotation(dataRaw?.['id']);
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
                            for (let i = 0; i < dataCopy?.['lease_products_data'].length; i++) {
                                let data = dataCopy?.['lease_products_data'][i];
                                if (data?.['product']?.['id'] === checkedID) {
                                    data['product_quantity'] = parseFloat(checkedQuantity);
                                    order++
                                    data['order'] = order;
                                    result.push(data);
                                    break
                                }
                            }
                        }
                        dataCopy['lease_products_data'] = result;
                        dataCopy['lease_costs_data'] = [];
                    }
                    LeaseOrderLoadDataHandle.loadCopyData(dataCopy);
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

        LeaseOrderLoadDataHandle.loadInitOpportunity();
        LeaseOrderLoadDataHandle.loadRecurrenceData();

// PROMOTION
// Action on click button Check Available Promotion (show list promotions)
        $('#btn-check-promotion').on('click', function () {
            LeaseOrderPromotionHandle.callPromotion(0);
        });

        tablePromotion.on('click', '.apply-promotion', function () {
            $(this).prop('disabled', true);
            deletePromotionRows(tableProduct, true, false);
            // ReCalculate Total
            LeaseOrderCalculateCaseHandle.updateTotal(tableProduct[0]);
            // get promotion condition to apply
            let promotionData = JSON.parse($(this)[0].getAttribute('data-promotion'));
            let promotionParse = LeaseOrderPromotionHandle.getPromotionResult(promotionData);
            let TotalOrder = tableProduct[0].querySelectorAll('.table-row-order').length;
            let TotalGroup = tableProduct[0].querySelectorAll('.table-row-group').length;
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
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    let afterRow = tableProduct.DataTable().row(promotionParse?.['row_apply_index']).node();
                    $(newRow).detach().insertAfter(afterRow);
                    LeaseOrderCalculateCaseHandle.commonCalculate(tableProduct, newRow);
                    LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                } else { // on whole order
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    LeaseOrderCalculateCaseHandle.commonCalculate(tableProduct, newRow);
                    if (promotionParse.hasOwnProperty('discount_rate_on_order')) {
                        if (promotionParse.discount_rate_on_order !== null) {
                            if (promotionParse.is_before_tax === true) {
                                LeaseOrderPromotionHandle.calculatePromotion(tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price']);
                            } else {
                                LeaseOrderPromotionHandle.calculatePromotion(tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price'], false)
                            }
                        }
                    }
                    LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                }
            } else if (promotionParse?.['is_gift'] === true) { // GIFT
                if (promotionParse?.['row_apply_index'] !== null) { // on product
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    let afterRow = tableProduct.DataTable().row(promotionParse?.['row_apply_index']).node();
                    $(newRow).detach().insertAfter(afterRow);
                    LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                } else { // on whole order
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                }
            }
            reOrderSTT(tableProduct);
        });

// SHIPPING
// Action on click button Add Shipping Fee (show list shipping)
        $('#btn-add-shipping').on('click', function() {
            LeaseOrderDataTableHandle.loadTableQuotationShipping();
        });

        tableShipping.on('click', '.apply-shipping', function () {
            $(this).prop('disabled', true);
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // ReCalculate Total
            LeaseOrderCalculateCaseHandle.updateTotal(tableProduct[0]);
            if (this.getAttribute('data-shipping')) {
                let dataShipping = JSON.parse(this.getAttribute('data-shipping'));
                let shippingPrice = parseFloat(dataShipping?.['shipping_price']);
                let TotalOrder = tableProduct[0].querySelectorAll('.table-row-order').length;
                let TotalGroup = tableProduct[0].querySelectorAll('.table-row-group').length;
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
                let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
                LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
                // Re Calculate after add shipping (pretax, discount, total)
                shippingHandle.calculateShipping(shippingPrice);
                // Load disabled
                LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                // ReOrder STT
                reOrderSTT(tableProduct);
                LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
            }
        });

// INDICATORS
        $('#tab-indicator').on('click', function () {
            if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                LeaseOrderIndicatorHandle.loadIndicator();
                LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
            }
        });

// PAYMENT STAGE
        $quotationTabs.on('click', '.tab-payment', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderStoreDataHandle.storeDtbData(2);
            LeaseOrderStoreDataHandle.storeDtbData(3);
            LeaseOrderStoreDataHandle.storeDtbData(4);
        });

        $('#btn-add-payment-stage').on('click', function () {
            LeaseOrderLoadDataHandle.loadAddPaymentStage();
        });

        tablePS.on('change', '.table-row-date, .table-row-installment, .table-row-ratio, .table-row-value-before-tax, .table-row-issue-invoice, .table-row-value-total, .table-row-due-date', function () {
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
                    LeaseOrderLoadDataHandle.loadChangePSDate(this);
                } else {
                    $(this).val(null);
                    $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-validate-due-date')}, 'failure');
                    return false;
                }
            }
            if ($(this).hasClass('table-row-installment')) {
                LeaseOrderLoadDataHandle.loadChangePSInstallment(this);
            }
            if ($(this).hasClass('table-row-ratio') && $(this).hasClass('validated-number')) {
                validateNumber(this);
                let eleValueBeforeTax = row.querySelector('.table-row-value-before-tax');
                LeaseOrderLoadDataHandle.loadPSValueBeforeTax(eleValueBeforeTax, $(this).val());
                validatePSValue(eleValueBeforeTax);
            }
            if ($(this).hasClass('table-row-issue-invoice')) {
                LeaseOrderLoadDataHandle.loadChangePSIssueInvoice(this);
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
                            $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-validate-due-date')}, 'failure');
                            return false;
                        }
                    }
                }
            }
        });

        tablePS.on('click', '.del-row', function () {
            deleteRow(this.closest('tr'), tablePS);
        });

// IMPORT TABLE




// Submit form quotation + sale order
        SetupFormSubmit.validate(LeaseOrderLoadDataHandle.$form, {
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
            if (tableProduct[0].querySelector('.table-row-promotion') && $(this).attr('data-method').toLowerCase() === "post") { // HAS PROMOTION => Check condition again
                LeaseOrderPromotionHandle.callPromotion(1);
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
            let _form = new SetupFormSubmit(LeaseOrderLoadDataHandle.$form);
            // Load again indicator when Submit
            LeaseOrderIndicatorHandle.loadIndicator();
            let result = LeaseOrderSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
            let keyHidden = WFRTControl.getZoneHiddenKeyData();
            if (keyHidden) {
                if (keyHidden.length > 0) {
                    // special case: loadCost if products is not in hidden zones
                    if (!keyHidden.includes('lease_products_data')) {
                        LeaseOrderStoreDataHandle.storeDtbData(2);
                        LeaseOrderLoadDataHandle.loadDataTableCost();
                        LeaseOrderSubmitHandle.setupDataSubmit(_form);
                        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
                    }
                } else {
                    LeaseOrderStoreDataHandle.storeDtbData(2);
                    LeaseOrderLoadDataHandle.loadDataTableCost();
                    LeaseOrderSubmitHandle.setupDataSubmit(_form);
                }
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
                'quotation_id',
                'quotation_data',
                'lease_from',
                'lease_to',
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
                'lease_products_data',
                'lease_logistic_data',
                'customer_shipping',
                'customer_billing',
                'lease_costs_data',
                'lease_expenses_data',
                // indicator tab
                'lease_indicators_data',
                // indicators
                'indicator_revenue',
                'indicator_gross_profit',
                'indicator_net_income',
                // payment stage tab
                'lease_payment_stage',
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
            LeaseOrderCheckConfigHandle.checkConfig(0);
        });

        $('#btn-remove-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            // Delete Promotion Row & ReCalculate Total
            deletePromotionRows(tableProduct, true, false);
            LeaseOrderCalculateCaseHandle.updateTotal(tableProduct[0]);
        });

        $('#btn-check-another-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            $('#btn-check-promotion').click();
        })




    });
});
