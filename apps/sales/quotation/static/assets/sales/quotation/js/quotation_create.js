
$(function () {

    $(document).ready(function () {

        let promotionClass = new promotionHandle();
        let shippingClass = new shippingHandle();
        // Elements
        let formSubmit = $('#frm_quotation_create');
        let boxPriceList = $('#select-box-quotation-create-price-list');
        let boxQuotation = $('#select-box-quotation');
        let tabPrice = $('#tab_terms');
        let btnAddProductGr = $('#btn-add-product-group-quotation');
        let btnAddProduct = $('#btn-add-product-quotation-create');

        // Load inits
        QuotationLoadDataHandle.loadBoxQuotationCustomer();
        QuotationLoadDataHandle.loadBoxQuotationContact();
        QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        QuotationLoadDataHandle.loadInitQuotationProduct();
        if (formSubmit[0].classList.contains('sale-order')) {
            QuotationLoadDataHandle.loadBoxSOQuotation();
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
        if (formSubmit.attr('data-method').toLowerCase() === 'post') {
            if (!formSubmit[0].classList.contains('sale-order')) {
                WFRTControl.setWFInitialData('quotation');
            } else {
                WFRTControl.setWFInitialData('saleorder');
            }
        }


// Action on change dropdown opportunity
        QuotationLoadDataHandle.opportunitySelectEle.on('change', function () {
            QuotationLoadDataHandle.loadDataByOpportunity(this);
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
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false);
            // load again table cost
            QuotationLoadDataHandle.loadDataTableCost();
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
        });

// Action on click price list's option
        tableProduct.on('click', '.table-row-price-option', function () {
            if (!$(this)[0].querySelector('.expired-price')) { // Check if price not expired
                let priceValRaw = $(this)[0].getAttribute('data-value');
                if (priceValRaw) {
                    let row = $(this)[0].closest('tr');
                    let elePrice = row.querySelector('.table-row-price');
                    if (elePrice) {
                        $(elePrice).attr('value', String(priceValRaw));
                        $.fn.initMaskMoney2();
                        QuotationCalculateCaseHandle.commonCalculate(tableProduct, row, true, false, false);
                    }
                    // make button option checked
                    let allOption = $(row).find('.table-row-price-option');
                    if (allOption) {
                        allOption.removeClass('option-btn-checked');
                    }
                    $(this).addClass('option-btn-checked');
                }
            }
        });

// ******** Action on change data of table row PRODUCT => calculate data for row & calculate data total
        tableProduct.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax, .table-row-discount', function () {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                QuotationLoadDataHandle.loadDataProductSelect($(this));
            }
            // validate number
            if ($(this).hasClass('table-row-quantity') && $(this).hasClass('validated-number')) {
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
            QuotationCalculateCaseHandle.commonCalculate(tableProduct, row, true, false, false);
            // change value before tax table payment
            QuotationLoadDataHandle.loadChangePSValueBTAll();
        });

// If change product uom then clear table COST
        tableProduct.on('change', '.table-row-uom', function () {
            // load again table cost
            QuotationLoadDataHandle.loadDataTableCost();
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
        });

// Action on table row group title
        tableProduct.on('click', '.table-row-group', function () {
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        });

        tableProduct.on('blur', '.table-row-group-title-edit', function () {
            QuotationLoadDataHandle.loadOnBlurGroupTitleEdit(this);
        });

        tableProduct.on('click', '.btn-edit-group', function () {
            QuotationLoadDataHandle.loadOnClickBtnEditGroup(this);
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
        });

// Action on change discount rate on Total of product
        $('#quotation-create-product-discount').on('change', function () {
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // Calculate with discount on Total
            for (let i = 0; i < tableProduct[0].tBodies[0].rows.length; i++) {
                let row = tableProduct[0].tBodies[0].rows[i];
                QuotationCalculateCaseHandle.calculate(row);
            }
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false)
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

// Action on check expense option (filter expense item or purchasing item)
        tableExpense.on('click', '.checkbox-expense-item, .checkbox-purchasing-item', function() {
            let eleExpenseDropDownID = $(this)[0].closest('tr').querySelector('.expense-option-list').id;
            let jqueryId = '#' + eleExpenseDropDownID;
            $(jqueryId).empty();
            if ($(this).hasClass('checkbox-expense-item')) {
                let otherCheckbox = $(this)[0].closest('tr').querySelector('.checkbox-purchasing-item');
                if ($(this)[0].checked === true) {
                    if (otherCheckbox.checked === true) {
                        QuotationLoadDataHandle.loadBoxQuotationExpense(eleExpenseDropDownID);
                        QuotationLoadDataHandle.loadBoxQuotationProductPurchasing(eleExpenseDropDownID);
                    } else if (otherCheckbox.checked === false) {
                        QuotationLoadDataHandle.loadBoxQuotationExpense(eleExpenseDropDownID);
                    }
                } else if ($(this)[0].checked === false) {
                    if (otherCheckbox.checked === true) {
                        QuotationLoadDataHandle.loadBoxQuotationProductPurchasing(eleExpenseDropDownID);
                    }
                }
           } else if ($(this).hasClass('checkbox-purchasing-item')) {
                let otherCheckbox = $(this)[0].closest('tr').querySelector('.checkbox-expense-item');
                if ($(this)[0].checked === true) {
                    if (otherCheckbox.checked === true) {
                        QuotationLoadDataHandle.loadBoxQuotationExpense(eleExpenseDropDownID);
                        QuotationLoadDataHandle.loadBoxQuotationProductPurchasing(eleExpenseDropDownID);
                    } else if (otherCheckbox.checked === false) {
                        QuotationLoadDataHandle.loadBoxQuotationProductPurchasing(eleExpenseDropDownID);
                    }
                } else if ($(this)[0].checked === false) {
                    if (otherCheckbox.checked === true) {
                        QuotationLoadDataHandle.loadBoxQuotationExpense(eleExpenseDropDownID);
                    }
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
            QuotationCalculateCaseHandle.updateTotal(tableExpense[0], false, false, true);
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
                    QuotationCalculateCaseHandle.commonCalculate(tableExpense, row, false, false, true);
                }
            }
        });

// ******** Action on change data of table row EXPENSE => calculate data for row & calculate data total
        tableExpense.on('change', '.table-row-item, .table-row-labor-item, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if (this.classList.contains('table-row-labor-item')) {
                if ($(this).val()) {
                    let dataSelected = SelectDDControl.get_data_from_idx($(this), $(this).val());
                    QuotationLoadDataHandle.loadBoxQuotationExpense($(row.querySelector('.table-row-item')), dataSelected?.['expense_item']);
                    QuotationLoadDataHandle.loadBoxQuotationUOM($(row.querySelector('.table-row-uom')), dataSelected?.['uom']);
                    if (dataSelected?.['price_list'].length > 0) {
                       $(row.querySelector('.table-row-price')).attr('value', String(dataSelected?.['price_list'][0]?.['price_value']));
                    }
                }
            }
            // validate number
            if ($(this).hasClass('table-row-quantity') && $(this).hasClass('validated-number')) {
                validateNumber(this);
            }
            QuotationCalculateCaseHandle.commonCalculate(tableExpense, row, false, false, true);
        });

// COST
// COPY PRODUCT -> COST

// ******** Action on change data of table row COST => calculate data for row & calculate data total
        tableCost.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            QuotationCalculateCaseHandle.commonCalculate(tableCost, row, false, true, false);
        });

// Action on click button collapse
        $('#quotation-info-collapse').click(function () {
            $(this).toggleClass('fa-angle-double-up fa-angle-double-down');
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
                QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false);
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
                // destroy dataTable then call API load-check again
                QuotationDataTableHandle.loadTableQuotationPromotion('data-init-quotation-create-promotion', QuotationLoadDataHandle.customerSelectEle.val())
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
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false);
            // get promotion condition to apply
            let promotionCondition = JSON.parse($(this)[0].getAttribute('data-promotion-condition'));
            let promotionResult = promotionClass.getPromotionResult(promotionCondition);
            let is_promotion_on_row = false;
            if (promotionResult.hasOwnProperty('is_promotion_on_row')) {
                if (promotionResult.is_promotion_on_row === true) {
                    is_promotion_on_row = true;
                }
            }
            let order = 1;
            let tableEmpty = tableProduct[0].querySelector('.dataTables_empty');
            let tableLen = tableProduct[0].tBodies[0].rows.length;
            if (tableLen !== 0 && !tableEmpty) {
                order = (tableLen + 1);
            }
            let dataAdd = {
                "tax": {
                    "id": "",
                    "code": "",
                    "title": "",
                    "value": 0
                },
                "order": order,
                "product": {
                    "id": promotionResult?.['product_id'],
                    "title": promotionResult?.['product_title'],
                    "code": promotionResult?.['product_code'],
                },
                "product_code": promotionResult?.['product_code'],
                "product_title": promotionResult?.['product_title'],
                "unit_of_measure": {
                    "id": "",
                    "code": "",
                    "title": ""
                },
                "product_quantity": promotionResult?.['product_quantity'],
                "product_uom_code": "",
                "product_tax_title": "",
                "product_tax_value": 0,
                "product_uom_title": "",
                "product_tax_amount": 0,
                "product_unit_price": promotionResult?.['product_price'],
                "product_description": promotionResult?.['product_description'],
                "product_discount_value": 0,
                "product_subtotal_price": 0,
                "product_discount_amount": 0,
                "is_promotion": true,
                "is_promotion_on_row": is_promotion_on_row,
                "promotion": {"id": $(this)[0].getAttribute('data-promotion-id')},
                "is_shipping": false,
            };
            if (promotionResult.is_discount === true) { // DISCOUNT
                if (promotionResult.row_apply_index !== null) { // on Specific product
                    let selectTaxID = 'quotation-create-product-box-tax-' + String(order);
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    QuotationLoadDataHandle.loadBoxQuotationTax(selectTaxID, promotionResult.value_tax);
                    // Get the desired position
                    let afterRow = tableProduct.DataTable().row(promotionResult.row_apply_index).node();
                    // Remove the new row and re-insert it at the desired position
                    $(newRow).detach().insertAfter(afterRow);
                    // Re Calculate all data
                    QuotationCalculateCaseHandle.commonCalculate(tableProduct, newRow, true, false, false);
                    // Load disabled
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                } else { // on Whole order
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')));
                    QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')));
                    // Re Calculate all data
                    QuotationCalculateCaseHandle.commonCalculate(tableProduct, newRow, true, false, false);
                    // Re Calculate Tax on Total
                    if (promotionResult.hasOwnProperty('discount_rate_on_order')) {
                        if (promotionResult.discount_rate_on_order !== null) {
                            if (promotionResult.is_before_tax === true) {
                                promotionClass.reCalculateIfPromotion(tableProduct, promotionResult.discount_rate_on_order, promotionResult.product_price);
                            } else {
                                promotionClass.reCalculateIfPromotion(tableProduct, promotionResult.discount_rate_on_order, promotionResult.product_price, false)
                            }
                        }
                    }
                    // Load disabled
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                }
            } else if (promotionResult.is_gift === true) { // GIFT
                if (promotionResult.row_apply_index !== null) { // on Specific product
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    // Get the desired position
                    let afterRow = tableProduct.DataTable().row(promotionResult.row_apply_index).node();
                    // Remove the new row and re-insert it at the desired position
                    $(newRow).detach().insertAfter(afterRow);
                    // load data dropdown
                    QuotationLoadDataHandle.loadBoxQuotationProduct($(newRow.querySelector('.table-row-item')));
                    QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')));
                    QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')));
                    // Load disabled
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                } else { // on Whole order
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    // Load disabled
                    QuotationLoadDataHandle.loadRowDisabled(newRow);
                }
            }
            // ReOrder STT
            reOrderSTT(tableProduct[0].tBodies[0], tableProduct);
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
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false)
            let shippingPrice = parseFloat($(this)[0].getAttribute('data-shipping-price'));
            let shippingPriceMargin = parseFloat($(this)[0].getAttribute('data-shipping-price-margin'));
            let dataShipping = JSON.parse($(this)[0].getAttribute('data-shipping'));
            let order = 1;
            let tableEmpty = tableProduct[0].querySelector('.dataTables_empty');
            let tableLen = tableProduct[0].tBodies[0].rows.length;
            if (tableLen !== 0 && !tableEmpty) {
                order = (tableLen+1);
            }
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
            QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')));
            QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')));
            // Re Calculate after add shipping (pretax, discount, total)
            shippingClass.reCalculateIfShipping(shippingPrice);
            // Load disabled
            QuotationLoadDataHandle.loadRowDisabled(newRow);
            // ReOrder STT
            reOrderSTT(tableProduct[0].tBodies[0], tableProduct);
            // load again table cost
            QuotationLoadDataHandle.loadDataTableCost();
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
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

        $('#datable-quotation-payment-stage').on('change', '.table-row-date, .table-row-term, .table-row-ratio, .table-row-due-date', function () {
            if (formSubmit[0].classList.contains('sale-order') && formSubmit.attr('data-method').toLowerCase() !== 'get') {
                if ($(this).hasClass('table-row-date')) {
                    let row = this.closest('tr');
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




// Submit form quotation + sale order
        formSubmit.submit(function (e) {
            e.preventDefault();
            if (tableProduct[0].querySelector('.table-row-promotion') && $(this).attr('data-method') === "POST") { // HAS PROMOTION => Check condition again
                promotionClass.checkPromotionIfSubmit('data-init-quotation-create-promotion', QuotationLoadDataHandle.customerSelectEle.val());
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
            QuotationCheckConfigHandle.checkConfig(true);
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


            // WindowControl.showLoading();
            // $.fn.callAjax2(
            //     {
            //         'url': _form.dataUrl,
            //         'method': _form.dataMethod,
            //         'data': _form.dataForm,
            //     }
            // ).then(
            //     (resp) => {
            //         let data = $.fn.switcherResp(resp);
            //         if (data) {
            //             $.fn.notifyB({description: data.message}, 'success')
            //             $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
            //         }
            //     }, (err) => {
            //         setTimeout(() => {
            //             WindowControl.hideLoading();
            //         }, 1000)
            //         $.fn.notifyB({description: err.data.errors}, 'failure');
            //     }
            // )

        }

        $('#btn-remove-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            // Delete Promotion Row & ReCalculate Total
            deletePromotionRows(tableProduct, true, false);
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false);
        });

        $('#btn-check-another-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            $('#btn-check-promotion').click();
        })




    });
});
