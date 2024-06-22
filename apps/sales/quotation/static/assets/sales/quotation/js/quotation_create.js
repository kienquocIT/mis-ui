$(function () {

    $(document).ready(function () {

        // Elements
        let formSubmit = $('#frm_quotation_create');
        let boxPriceList = $('#select-box-quotation-create-price-list');
        let boxQuotation = $('#select-box-quotation');
        let tabPrice = $('#tab_terms');
        let btnAddProductGr = $('#btn-add-product-group-quotation');
        let btnAddProduct = $('#btn-add-product-quotation-create');

        // Load inits
        QuotationLoadDataHandle.loadInitCustomer();
        QuotationLoadDataHandle.loadBoxQuotationCustomer();
        QuotationLoadDataHandle.loadBoxQuotationContact();
        QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        QuotationLoadDataHandle.loadInitQuotationProduct();
        if (formSubmit[0].classList.contains('sale-order')) {
            QuotationLoadDataHandle.loadInitS2(QuotationLoadDataHandle.quotationSelectEle);
        }
        // init first time indicator
        indicatorHandle.loadQuotationIndicator('quotation-indicator-data', true);
        // init dataTable
        QuotationDataTableHandle.dataTableProduct();
        QuotationDataTableHandle.dataTableCost();
        QuotationDataTableHandle.dataTableExpense();
        if (!formSubmit[0].classList.contains('sale-order')) {  // quotation indicators
            QuotationDataTableHandle.dataTableQuotationIndicator();
        } else {  // sale order indicators
            QuotationDataTableHandle.dataTableSaleOrderIndicator();
        }
        if (formSubmit[0].classList.contains('sale-order')) {
            QuotationDataTableHandle.dataTablePaymentStage();
        }
        // init config
        QuotationLoadDataHandle.loadInitQuotationConfig(formSubmit.attr('data-method'));
        // ele tables
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');
        let tablePS = $('#datable-quotation-payment-stage');
        // promotion
        let tablePromotion = $('#datable-quotation-create-promotion');
        // shipping
        let tableShipping = $('#datable-quotation-create-shipping');
        // copy quotation
        let tableCopyQuotation = $('#datable-copy-quotation');
        let divCopyOption = $('#copy-quotation-option');
        let tableCopyQuotationProduct = $('#datable-copy-quotation-product');

        let modalShipping = $('#quotation-create-modal-shipping-body');
        let modalBilling = $('#quotation-create-modal-billing-body');

        let $quotationTabs = $('#quotation-tabs');

        $('input[name="date_created"]').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 1901,
            maxYear: parseInt(moment().format('YYYY'), 10),
            locale: {
                format: 'DD/MM/YYYY'
            },
        });
        $('.daterangepicker').remove();

        // get WF initial zones
        let appCode = 'quotation';
        if (formSubmit[0].classList.contains('sale-order')) {
            appCode = 'saleorder';
        }
        WFRTControl.setWFInitialData(appCode, formSubmit.attr('data-method'));


// Action on change dropdown opportunity
        QuotationLoadDataHandle.opportunitySelectEle.on('change', function () {
            QuotationLoadDataHandle.loadDataByOpportunity();
        });

// Action on change dropdown customer
        QuotationLoadDataHandle.customerSelectEle.on('change', function () {
            QuotationLoadDataHandle.loadDataByCustomer();
        });

// Action on change dropdown sale person
        QuotationLoadDataHandle.salePersonSelectEle.on('change', function () {
            QuotationLoadDataHandle.loadDataBySalePerson();
        });

// Action on click dropdown price list
        tabPrice.on('click', function() {
            if (!boxPriceList[0].innerHTML) {
                QuotationLoadDataHandle.loadBoxQuotationPrice();
            }
        });

// Action on click dropdown payment term
        QuotationLoadDataHandle.paymentSelectEle.on('click', function () {
            QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        });

        QuotationLoadDataHandle.paymentSelectEle.on('change', function () {
            QuotationLoadDataHandle.loadChangePaymentTerm();
        });

// Action on click dropdown contact
        boxQuotation.on('click', function() {
            if (!$(this)[0].innerHTML) {
                let opp_id = null;
                let sale_person_id = null;
                if (QuotationLoadDataHandle.opportunitySelectEle.val()) {
                    opp_id = QuotationLoadDataHandle.opportunitySelectEle.val()
                }
                if (QuotationLoadDataHandle.salePersonSelectEle.val()) {
                    sale_person_id = QuotationLoadDataHandle.salePersonSelectEle.val()
                }
                QuotationLoadDataHandle.loadBoxSaleOrderQuotation('select-box-quotation', null, opp_id, sale_person_id);
            }
        });

// PRODUCT
        $quotationTabs.on('click', '.tab-detail', function () {
            QuotationLoadDataHandle.loadReInitDataTableProduct();
        });

// Action on add group title
        btnAddProductGr.on('click', function () {
            QuotationLoadDataHandle.loadAddRowProductGr();
        });

// Action on click button add product
        btnAddProduct.on('click', function (e) {
            QuotationLoadDataHandle.loadAddRowProduct();
        });

// Action on click select2 product
        tableProduct.on('click', '.table-row-item-area', function () {
           QuotationLoadDataHandle.loadBtnAddProductS2(this.closest('tr'));
        });

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
            QuotationLoadDataHandle.loadInitS2($boxPType, [], {'is_default': true}, $modal);
            QuotationLoadDataHandle.loadInitS2($boxPCategory, [], {}, $modal);
            QuotationLoadDataHandle.loadInitS2($boxPUomGr, [], {}, $modal);
            QuotationLoadDataHandle.loadInitS2($boxPUom, [], {}, $modal);
            QuotationLoadDataHandle.loadInitS2($boxPTax, [], {}, $modal);
            QuotationLoadDataHandle.loadInitS2($boxPMethod, dataMethod, {}, $modal);
        });

        $('#add-product-uom-group').on('change', function () {
            let $boxPUom = $('#add-product-uom');
            let $modal = $('#addQuickProduct');
            QuotationLoadDataHandle.loadInitS2($boxPUom, [], {'group': $(this).val()}, $modal);
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
                            // call ajax again data ProductSales
                            if (QuotationDataTableHandle.productInitEle.val()) {
                                let dataInitProduct = JSON.parse(QuotationDataTableHandle.productInitEle.val());
                                dataInitProduct.unshift(data);
                                QuotationDataTableHandle.productInitEle.val(JSON.stringify(dataInitProduct));
                                QuotationLoadDataHandle.loadReInitDataTableProduct();
                            }
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

// Action on delete row product
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
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0]);
            // load again table cost
            QuotationLoadDataHandle.loadDataTableCost();
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
        });

// Action on click price list's option
        tableProduct.on('click', '.table-row-price-option', function () {
            let row = this.closest('tr');
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).attr('value', String(priceValRaw));
                    $.fn.initMaskMoney2();
                    QuotationCalculateCaseHandle.commonCalculate(tableProduct, row);
                }
                // make button option checked
                let allOption = $(row).find('.table-row-price-option');
                if (allOption) {
                    allOption.removeClass('option-btn-checked');
                }
                $(this).addClass('option-btn-checked');
            }
            // store data
            QuotationStoreDataHandle.storeProduct(row);
        });

// ******** Action on change data of table row PRODUCT => calculate data for row & calculate data total
        tableProduct.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax, .table-row-discount', function () {
            if (formSubmit.attr('data-method').toLowerCase() !== 'get') {
                let row = $(this)[0].closest('tr');
                if ($(this).hasClass('table-row-item')) {
                    QuotationLoadDataHandle.loadDataProductSelect($(this));
                }
                // validate number
                if ($(this).hasClass('validated-number')) {
                    validateNumber(this);
                }
                // Clear table COST if item or quantity change
                if ($(this).hasClass('table-row-item') || $(this).hasClass('table-row-quantity') || $(this).hasClass('table-row-tax')) {
                    // load again table cost
                    QuotationLoadDataHandle.loadDataTableCost();
                    QuotationLoadDataHandle.loadSetWFRuntimeZone();
                }
                // Delete all promotion rows
                deletePromotionRows(tableProduct, true, false);
                // Delete all shipping rows
                deletePromotionRows(tableProduct, false, true);
                // Re Calculate all data of rows & total
                QuotationCalculateCaseHandle.commonCalculate(tableProduct, row);
                // change value before tax table payment
                QuotationLoadDataHandle.loadChangePSValueBTAll();
                // store data
                QuotationStoreDataHandle.storeProduct(row);
            }
        });

// If change product uom then clear table COST
        tableProduct.on('change', '.table-row-uom', function () {
            let row = this.closest('tr');
            // load again table cost
            QuotationLoadDataHandle.loadDataTableCost();
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
            // store data
            QuotationStoreDataHandle.storeProduct(row);
        });

// Action on table row group title
        tableProduct.on('click', '.table-row-group', function () {
            let row = this.closest('tr');
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
            // store data
            QuotationStoreDataHandle.storeProduct(row);
        });

        tableProduct.on('blur', '.table-row-group-title-edit', function () {
            let row = this.closest('tr');
            QuotationLoadDataHandle.loadOnBlurGroupTitleEdit(this);
            // store data
            QuotationStoreDataHandle.storeProduct(row);
        });

        tableProduct.on('click', '.btn-edit-group', function () {
            let row = this.closest('tr');
            QuotationLoadDataHandle.loadOnClickBtnEditGroup(this);
            // store data
            QuotationStoreDataHandle.storeProduct(row);
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
                QuotationLoadDataHandle.loadProductAfterDelGroup(row.querySelector('.table-row-group'));
            }
            // store data
            QuotationStoreDataHandle.storeProduct(row);
        });

// Action on change discount rate on Total of product
        $('input[type=text].quotation-create-product-discount').on('change', function () {
            validateNumber(this);
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // Calculate with discount on Total
            tableProduct.DataTable().rows().every(function () {
                let row = this.node();
                QuotationCalculateCaseHandle.calculate(row);
            });
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0])
        });

// EXPENSE
        $quotationTabs.on('click', '.tab-expense', function () {
            QuotationLoadDataHandle.loadReInitDataTableExpense();
        });

// Action on click button add expense
        $('#btn-add-expense-quotation-create').on('click', function (e) {
            QuotationLoadDataHandle.loadAddRowExpense();
        });

// Action on click button add internal labor
        $('#btn-add-labor-quotation-create').on('click', function (e) {
            QuotationLoadDataHandle.loadAddRowLabor();
        });

// Action on click expense option
        tableExpense.on('click', '.table-row-expense-option', function () {
            let itemID = $(this)[0].getAttribute('data-value');
            let itemTitle = $(this)[0].querySelector('.expense-title').innerHTML;
            if (itemID && itemTitle) {
                let row = $(this)[0].closest('tr');
                let eleExpenseShow = row.querySelector('.table-row-item');
                let eleExpenseDropdown = row.querySelector('.expense-option-list');
                if (eleExpenseShow) {
                    eleExpenseShow.value = itemTitle;
                    eleExpenseShow.setAttribute('data-value', itemID);
                    // make button option checked
                    let allOption = $(row).find('.table-row-expense-option');
                    if (allOption) {
                        allOption.removeClass('option-btn-checked');
                    }
                    $(this).addClass('option-btn-checked');
                    // load data expense selected
                    QuotationLoadDataHandle.loadDataProductSelect($(eleExpenseDropdown));
                }
            }
        });

// Action on delete row expense
        tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow(this.closest('tr'), tableExpense);
            // Re order
            reOrderSTT(tableExpense);
            QuotationCalculateCaseHandle.updateTotal(tableExpense[0]);
        });

// Action on click price list's option
        tableExpense.on('click', '.table-row-price-option', function () {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).attr('value', String(priceValRaw));
                    $.fn.initMaskMoney2();
                    QuotationCalculateCaseHandle.commonCalculate(tableExpense, row);
                }
            }
        });

// ******** Action on change data of table row EXPENSE => calculate data for row & calculate data total
        tableExpense.on('change', '.table-row-item, .table-row-labor-item, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if (this.classList.contains('table-row-labor-item')) {
                if ($(this).val()) {
                    let dataSelected = SelectDDControl.get_data_from_idx($(this), $(this).val());
                    QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataSelected?.['expense_item']]);
                    QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataSelected?.['uom']]);
                    if (dataSelected?.['price_list'].length > 0) {
                       $(row.querySelector('.table-row-price')).attr('value', String(dataSelected?.['price_list'][0]?.['price_value']));
                    }
                }
            }
            // validate number
            if ($(this).hasClass('table-row-quantity') && $(this).hasClass('validated-number')) {
                validateNumber(this);
            }
            QuotationCalculateCaseHandle.commonCalculate(tableExpense, row);
            // store data
            QuotationStoreDataHandle.storeExpense(row);
        });

// COST
// ******** Action on change data of table row COST => calculate data for row & calculate data total
        tableCost.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            if (formSubmit.attr('data-method').toLowerCase() !== 'get') {
                let row = $(this)[0].closest('tr');
                QuotationCalculateCaseHandle.commonCalculate(tableCost, row);
            }
        });

// Action on click price list's option
        tableCost.on('click', '.table-row-price-option', function () {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            let whIDValRaw = $(this)[0].getAttribute('data-wh-id');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).attr('value', String(priceValRaw));
                    $(elePrice).attr('data-wh-id', whIDValRaw);
                    $.fn.initMaskMoney2();
                    QuotationCalculateCaseHandle.commonCalculate(tableCost, row);
                }
                // make button option checked
                let allOption = $(row).find('.table-row-price-option');
                if (allOption) {
                    allOption.removeClass('option-btn-checked');
                }
                $(this).addClass('option-btn-checked');
            }
        });

// Action on click button collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

// Action on click choose shipping
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
                QuotationCalculateCaseHandle.updateTotal(tableProduct[0]);
            }
        });

// Action on click choose billing
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
                if (QuotationLoadDataHandle.opportunitySelectEle.val()) {
                    opp_id = QuotationLoadDataHandle.opportunitySelectEle.val()
                }
                if (QuotationLoadDataHandle.salePersonSelectEle.val()) {
                    sale_person_id = QuotationLoadDataHandle.salePersonSelectEle.val()
                }
                QuotationLoadDataHandle.loadTableCopyQuotation(opp_id, sale_person_id);
            } else if (type === 'copy-to') {
                // load data product for table datable-copy-quotation-product
                let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
                tableCopyQuotationProduct.DataTable().destroy();
                // Filter all data is not Promotion from quotation_products_data
                let finalList = filterDataProductNotPromotion(dataCopy.quotation_products_data);
                QuotationDataTableHandle.dataTableCopyQuotationProduct(finalList);
            }
        });

// Action on check quotation for copy
        tableCopyQuotation.on('click', '.table-row-check', function () {
            tableCopyQuotation.find('.table-row-check').prop('checked', false);
            $(this).prop('checked', true);
            QuotationLoadDataHandle.loadAPIDetailQuotation($(this)[0].getAttribute('data-id'));
        });

// Action on click button select quotation for copy
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
            QuotationDataTableHandle.dataTableCopyQuotationProduct(finalList);

            $('#btn-select-quotation-copy')[0].setAttribute('hidden', true);
            $('#btn-quotation-copy-confirm')[0].removeAttribute('hidden')
        });

// Action on check copy option
        divCopyOption.on('change', '.check-option', function() {
            if ($(this)[0].checked === false) {
                tableCopyQuotationProduct[0].removeAttribute('hidden');
            } else {
                tableCopyQuotationProduct[0].setAttribute('hidden', true);
            }
        });

// Action on confirm copy quotation
        $('#btn-quotation-copy-confirm').on('click', function () {
            QuotationLoadDataHandle.loadCopyData(this);
        });

// Load data quotation COPY TO sale order when sale order page CREATE loaded
        function prepareDataCopyTo() {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    QuotationLoadDataHandle.loadAPIDetailQuotation(dataRaw.id);
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
                    if (dataRaw.option === 'custom') { // if option copy is custom then setup data products & costs for load
                        let products = dataRaw.products;
                        let result = [];
                        let order = 0;
                        for (let idx = 0; idx < products.length; idx++) {
                            let checkedID = products[idx].id;
                            let checkedQuantity = products[idx].quantity;
                            for (let i = 0; i < dataCopy.quotation_products_data.length; i++) {
                                let data = dataCopy.quotation_products_data[i];
                                if (data.product.id === checkedID) {
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
                    // Begin load data copy TO
                    document.getElementById('customer-price-list').value = dataCopy.customer?.['customer_price_list'];
                    QuotationLoadDataHandle.loadDataTablesAndDropDowns(dataCopy);
                    QuotationLoadDataHandle.loadDetailQuotation(dataCopy, true);
                    QuotationCalculateCaseHandle.calculateAllRowsTableProduct(tableProduct);
                    // Check promotion -> re calculate
                    QuotationLoadDataHandle.loadReApplyPromotion(dataCopy, tableProduct);
                    // Set form novalidate
                    formSubmit[0].setAttribute('novalidate', 'novalidate');
                }
            }
        }

        function checkElementValuesBeforeLoadDataCopy() {
            let element0 = $('#data-copy-quotation-detail').val();
            let element1 = $('#data-init-quotation-create-tables-product').val();
            if (element0 && element1) {
                loadDataCopyTo(JSON.parse(element0));  // call loadDataCopyTo() if all condition pass
            } else {
                setTimeout(checkElementValuesBeforeLoadDataCopy, 1000);  // call again after 1s if condition not pass yet
            }
        }

// Load init Opportunity
        QuotationLoadDataHandle.loadInitOpportunity();

// PROMOTION
// Action on click button Check Available Promotion (show list promotions)
        $('#btn-check-promotion').on('click', function() {
            if (QuotationLoadDataHandle.customerSelectEle.val()) {
                promotionHandle.callPromotion(QuotationLoadDataHandle.customerSelectEle.val(), 0);
            } else {
                $('#datable-quotation-create-promotion').DataTable().destroy();
                QuotationDataTableHandle.dataTablePromotion();
            }
        });

// Action click Apply Promotion
        tablePromotion.on('click', '.apply-promotion', function () {
            $(this).prop('disabled', true);
            deletePromotionRows(tableProduct, true, false);
            // ReCalculate Total
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0]);
            // get promotion condition to apply
            let promotionData = JSON.parse($(this)[0].getAttribute('data-promotion-condition'));
            let promotionParse = promotionHandle.getPromotionResult(promotionData);
            let is_promotion_on_row = false;
            if (promotionParse?.['is_promotion_on_row'] === true) {
                is_promotion_on_row = true;
            }
            let TotalOrder = tableProduct[0].querySelectorAll('.table-row-order').length;
            let TotalGroup = tableProduct[0].querySelectorAll('.table-row-group').length;
            let order = (TotalOrder - TotalGroup) + 1;
            let dataAdd = {
                "tax": {},
                "order": order,
                "product": {
                    "id": promotionParse?.['product_id'],
                    "title": promotionParse?.['product_title'],
                    "code": promotionParse?.['product_code'],
                },
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
                "is_promotion_on_row": is_promotion_on_row,
                "promotion": {"id": promotionParse?.['id'], "title": promotionParse?.['title']},
                "is_shipping": false,
                "shipping": {},
            };
            if (promotionParse?.['is_discount'] === true) { // DISCOUNT
                if (promotionParse?.['row_apply_index'] !== null) { // on Specific product
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    // Get the desired position
                    let afterRow = tableProduct.DataTable().row(promotionParse?.['row_apply_index']).node();
                    // Remove the new row and re-insert it at the desired position
                    $(newRow).detach().insertAfter(afterRow);
                    // Re Calculate all data
                    QuotationCalculateCaseHandle.commonCalculate(tableProduct, newRow);
                    // Load disabled
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                    // store data
                    QuotationStoreDataHandle.storeProduct(newRow);
                } else { // on Whole order
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    // Re Calculate all data
                    QuotationCalculateCaseHandle.commonCalculate(tableProduct, newRow);
                    // Re Calculate Tax on Total
                    if (promotionParse.hasOwnProperty('discount_rate_on_order')) {
                        if (promotionParse.discount_rate_on_order !== null) {
                            if (promotionParse.is_before_tax === true) {
                                promotionHandle.calculatePromotion(tableProduct, promotionParse.discount_rate_on_order, promotionParse?.['product_price']);
                            } else {
                                promotionHandle.calculatePromotion(tableProduct, promotionParse.discount_rate_on_order, promotionParse?.['product_price'], false)
                            }
                        }
                    }
                    // Load disabled
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                    // store data
                    QuotationStoreDataHandle.storeProduct(newRow);
                }
            } else if (promotionParse?.['is_gift'] === true) { // GIFT
                if (promotionParse?.['row_apply_index'] !== null) { // on Specific product
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    // Get the desired position
                    let afterRow = tableProduct.DataTable().row(promotionParse?.['row_apply_index']).node();
                    // Remove the new row and re-insert it at the desired position
                    $(newRow).detach().insertAfter(afterRow);
                    // load data dropdown
                    // QuotationLoadDataHandle.loadBoxQuotationProduct($(newRow.querySelector('.table-row-item')));
                    QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    // Load disabled
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                    // store data
                    QuotationStoreDataHandle.storeProduct(newRow);
                } else { // on Whole order
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    // Load disabled
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                    // store data
                    QuotationStoreDataHandle.storeProduct(newRow);
                }
            }
            // ReOrder STT
            reOrderSTT(tableProduct);
        });

// SHIPPING
// Action on click button Add Shipping Fee (show list shipping)
        $('#btn-add-shipping').on('click', function() {
            QuotationDataTableHandle.loadTableQuotationShipping('data-init-quotation-create-shipping')
        });

// Action click Apply Shipping
        tableShipping.on('click', '.apply-shipping', function () {
            $(this).prop('disabled', true);
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // ReCalculate Total
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0])
            let shippingPrice = parseFloat($(this)[0].getAttribute('data-shipping-price'));
            let shippingPriceMargin = parseFloat($(this)[0].getAttribute('data-shipping-price-margin'));
            let dataShipping = JSON.parse($(this)[0].getAttribute('data-shipping'));
            let TotalOrder = tableProduct[0].querySelectorAll('.table-row-order').length;
            let TotalGroup = tableProduct[0].querySelectorAll('.table-row-group').length;
            let order = (TotalOrder - TotalGroup) + 1;
            let dataAdd = {
                "tax": {
                    "id": "",
                    "code": "",
                    "title": "",
                    "value": 0
                },
                "order": order,
                "product": {
                    "id": dataShipping?.['id'],
                    "title": dataShipping?.['shipping_title'],
                    "code": "",
                },
                "product_code": "",
                "product_title": dataShipping?.['shipping_title'],
                "unit_of_measure": {
                    "id": "",
                    "code": "",
                    "title": ""
                },
                "product_quantity": 1,
                "product_uom_code": "",
                "product_tax_title": "",
                "product_tax_value": 0,
                "product_uom_title": "",
                "product_tax_amount": 0,
                "product_unit_price": shippingPrice,
                "product_description": dataShipping?.['shipping_title'],
                "product_discount_value": 0,
                "product_subtotal_price": shippingPrice,
                "product_discount_amount": 0,
                "is_promotion": false,
                "is_shipping": true,
                "shipping": {
                    "id": $(this)[0].getAttribute('data-shipping-id'),
                    "shipping_price_margin": shippingPriceMargin
                }
            };
            let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
            QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
            QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
            // Re Calculate after add shipping (pretax, discount, total)
            shippingHandle.calculateShipping(shippingPrice);
            // Load disabled
            QuotationLoadDataHandle.loadRowDisabled(newRow);
            // ReOrder STT
            reOrderSTT(tableProduct);
            // load again table cost
            QuotationLoadDataHandle.loadDataTableCost();
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
            // store data
            QuotationStoreDataHandle.storeProduct(newRow);
        });

// INDICATORS
        $('#tab-indicator').on('click', function () {
            if (formSubmit.attr('data-method').toLowerCase() !== 'get') {
                indicatorHandle.loadQuotationIndicator('quotation-indicator-data');
                QuotationLoadDataHandle.loadSetWFRuntimeZone();
            }
        });

        // Clear data indicator store then call API to get new
        $('#btn-refresh-quotation-indicator').on('click', function () {
            let transEle = $('#app-trans-factory');
            document.getElementById('quotation-indicator-data').value = "";
            indicatorHandle.loadQuotationIndicator('quotation-indicator-data');
            $.fn.notifyB({description: transEle.attr('data-refreshed')}, 'success');
        });

// PAYMENT STAGE
        $('#btn-add-payment-stage').on('click', function () {
            QuotationLoadDataHandle.loadAddPaymentStage();
        });

        tablePS.on('change', '.table-row-date, .table-row-term, .table-row-ratio, .table-row-value-before-tax, .table-row-due-date', function () {
            if (formSubmit[0].classList.contains('sale-order') && formSubmit.attr('data-method').toLowerCase() !== 'get') {
                let row = this.closest('tr');
                if ($(this).hasClass('table-row-date')) {
                    let isCheck = true;
                    let eleDueDate = row.querySelector('.table-row-due-date');
                    let eleTerm = row.querySelector('.table-row-term');
                    if (eleDueDate && eleTerm) {
                        if ($(this).val() && $(eleDueDate).val() && !$(eleTerm).val()) {
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
                if ($(this).hasClass('table-row-term')) {
                    QuotationLoadDataHandle.loadChangePSTerm(this);
                }
                if ($(this).hasClass('table-row-ratio') && $(this).hasClass('validated-number')) {
                    validateNumber(this);
                    let eleValueBeforeTax = row.querySelector('.table-row-value-before-tax');
                    QuotationLoadDataHandle.loadPSValueBeforeTax(eleValueBeforeTax, $(this).val());
                    validatePSValue(eleValueBeforeTax);
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
            }
        });

        tablePS.on('click', '.del-row', function () {
            deleteRow(this.closest('tr'), tablePS);
        });




// Submit form quotation + sale order
        formSubmit.submit(function (e) {
            e.preventDefault();
            if (tableProduct[0].querySelector('.table-row-promotion') && $(this).attr('data-method') === "POST") { // HAS PROMOTION => Check condition again
                promotionHandle.callPromotion(QuotationLoadDataHandle.customerSelectEle.val(), 1);
                // Check promotion then Submit Form
                submitCheckPromotion();
            } else { // NO PROMOTION => submit normal
                // Submit Form normal
                submitForm($(this));
            }
        });

// function check again promotion before submit
        function submitCheckPromotion() {
            let valueCheck = $('#quotation-check-promotion').val();
            if (valueCheck) {
                if (valueCheck === 'true') {
                    submitForm(formSubmit);
                } else if (valueCheck === 'false') {
                    $('#btn-invalid-promotion').click();
                    return false
                }
            } else {
                setTimeout(submitCheckPromotion, 1000);  // call again after 1s if condition not pass yet
            }
        }

// WORKFLOW

        // events on btn action WF zone (depend on business rule)
        $('#btn-active-edit-zone-wf').on('click', function () {
            QuotationCheckConfigHandle.checkConfig(0);
        });

// Main Function Submit
        function submitForm(formSubmit) {
            let is_sale_order = false;
            if (formSubmit[0].classList.contains('sale-order')) {
                is_sale_order = true;
            }
            let _form = new SetupFormSubmit(formSubmit);
            // Load again indicator when Submit
            indicatorHandle.loadQuotationIndicator('quotation-indicator-data');
            QuotationSubmitHandle.setupDataSubmit(_form, is_sale_order);
            let keyHidden = WFRTControl.getZoneHiddenKeyData();
            if (keyHidden) {
                if (keyHidden.length > 0) {
                    // special case: tab cost depend on tab detail
                    if (!keyHidden.includes('quotation_products_data') && !keyHidden.includes('sale_order_products_data')) {
                        QuotationLoadDataHandle.loadDataTableCost();
                        QuotationSubmitHandle.setupDataSubmit(_form, is_sale_order);
                        QuotationLoadDataHandle.loadSetWFRuntimeZone();
                    }
                }
            }
            let submitFields = [
                'title',
                'opportunity_id',
                'customer',
                'contact',
                'employee_inherit_id',
                'payment_term',
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
                'quotation_term_data',
                'quotation_logistic_data',
                'customer_shipping',
                'customer_billing',
                'quotation_costs_data',
                'quotation_expenses_data',
                'is_customer_confirm',
                // indicator tab
                'quotation_indicators_data',
                // system
                'system_status',
            ]
            if (is_sale_order === true) {
                submitFields = [
                    'title',
                    'opportunity_id',
                    'customer',
                    'contact',
                    'employee_inherit_id',
                    'payment_term',
                    'payment_term_data',
                    'quotation',
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
                    // payment stage tab
                    'sale_order_payment_stage',
                    // system
                    'system_status',
                ]
            }
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            // validate none & blank
            let check_blank_list = ['', "", "undefined"];
            let check_field_list = [
                'opportunity_id',
                'customer',
                'contact',
                'employee_inherit_id',
                'payment_term',
                'quotation'
            ]
            for (let field of check_field_list) {
                if (_form.dataForm.hasOwnProperty(field)) {
                    if (check_blank_list.includes(_form.dataForm[field])) {
                        _form.dataForm[field] = null;
                    }
                }
            }
            WFRTControl.callWFSubmitForm(_form);
        }

        $('#btn-remove-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            // Delete Promotion Row & ReCalculate Total
            deletePromotionRows(tableProduct, true, false);
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0]);
        });

        $('#btn-check-another-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            $('#btn-check-promotion').click();
        })




    });
});
