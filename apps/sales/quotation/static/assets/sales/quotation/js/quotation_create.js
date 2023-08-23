
$(function () {

    $(document).ready(function () {

        let promotionClass = new promotionHandle();
        let shippingClass = new shippingHandle();
        // Elements
        let formSubmit = $('#frm_quotation_create');
        let boxOpportunity = $('#select-box-quotation-create-opportunity');
        let boxCustomer = $('#select-box-quotation-create-customer');
        let boxContact = $('#select-box-quotation-create-contact');
        let boxPayment = $('#select-box-quotation-create-payment-term');
        let boxSalePerson = $('#select-box-quotation-create-sale-person');
        let boxPriceList = $('#select-box-quotation-create-price-list');
        let boxQuotation = $('#select-box-quotation');
        let tabPrice = $('#tab_terms');

        // Load inits
        QuotationLoadDataHandle.loadBoxQuotationContact();
        QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        if (formSubmit.attr('data-method') === 'POST') {
            let employee_current = $('#data-init-quotation-create-request-employee').val();
            if (employee_current) {
                let employee_current_data = JSON.parse(employee_current);
                QuotationLoadDataHandle.loadBoxQuotationSalePerson(employee_current_data);
                QuotationLoadDataHandle.loadBoxQuotationOpportunity({}, employee_current_data.id);
                QuotationLoadDataHandle.loadBoxQuotationCustomer({}, employee_current_data.id);
            } else {
                QuotationLoadDataHandle.loadBoxQuotationOpportunity();
                QuotationLoadDataHandle.loadBoxQuotationCustomer();
            }
        }
        QuotationLoadDataHandle.loadInitQuotationProduct();
        // init config
        QuotationLoadDataHandle.loadInitQuotationConfig('quotation-config-data', formSubmit.attr('data-method'));
        // init first time indicator
        indicatorClass.loadQuotationIndicator('quotation-indicator-data', true);
        // init dataTable
        QuotationDataTableHandle.dataTableProduct();
        QuotationDataTableHandle.dataTableCost();
        QuotationDataTableHandle.dataTableExpense();

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

        $('input[name="date_created"]').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 1901,
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10)
        });
        $('.daterangepicker').remove();

// Action on change dropdown opportunity
        boxOpportunity.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(boxOpportunity, $(this).val());
                if (dataSelected) {
                    boxCustomer.empty();
                    QuotationLoadDataHandle.loadBoxQuotationCustomer(dataSelected.customer);
                    boxCustomer.change();
                }
            } else { // No Value => load again dropdowns
                boxCustomer.empty();
                QuotationLoadDataHandle.loadBoxQuotationCustomer();
                boxCustomer.change();
            }
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // ReCheck Config when change Opportunity
            QuotationCheckConfigHandle.checkConfig(true);
        });

// Action on change dropdown customer
        boxCustomer.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(boxCustomer, $(this).val());
                if (dataSelected) {
                    if (boxOpportunity.val()) {
                        let dataOppSelected = SelectDDControl.get_data_from_idx(boxOpportunity, boxOpportunity.val());
                        if (dataOppSelected) {
                            if (Object.keys(dataOppSelected.customer).length !== 0) {
                                if (dataOppSelected.customer.id !== $(this).val()) {
                                    boxOpportunity.empty();
                                    QuotationLoadDataHandle.loadBoxQuotationOpportunity();
                                }
                            }
                        }
                    }
                    // load Shipping & Billing by Customer
                    QuotationLoadDataHandle.loadShippingBillingCustomer();
                    QuotationLoadDataHandle.loadShippingBillingCustomer(dataSelected);
                    // load Contact by Customer
                    boxContact.empty();
                    QuotationLoadDataHandle.loadBoxQuotationContact(dataSelected.owner, dataSelected.id);
                    // load Payment Term by Customer
                    boxPayment.empty();
                    QuotationLoadDataHandle.loadBoxQuotationPaymentTerm(dataSelected?.['payment_term_mapped']);
                    // Store Account Price List
                    if (Object.keys(dataSelected?.['price_list_mapped']).length !== 0) {
                        document.getElementById('customer-price-list').value = dataSelected?.['price_list_mapped'].id;
                    }
                    // Load again dropdown sale_person only valueSelected
                    QuotationLoadDataHandle.loadBoxQuotationSalePerson($('#select-box-quotation-create-sale-person').val());
                }
            } else { // No Value => load again dropdowns
                boxOpportunity.empty();
                boxContact.empty();
                boxPayment.empty();
                QuotationLoadDataHandle.loadBoxQuotationOpportunity();
                QuotationLoadDataHandle.loadBoxQuotationContact();
                QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
                document.getElementById('customer-price-list').value = "";
                if (!$('#select-box-quotation-create-opportunity').val()) {
                    QuotationLoadDataHandle.loadBoxQuotationSalePerson($('#select-box-quotation-create-sale-person').val());
                }
            }
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // load again price of product by customer price list then Re Calculate
            QuotationLoadDataHandle.loadDataProductAll();
        });

// Action on change dropdown sale person
        boxSalePerson.on('change', function () {
            // clear Customer box & Opportunity box & Contact box & PaymentTerm box & PriceListVal
            boxOpportunity.empty();
            boxCustomer.empty();
            boxContact.empty();
            boxPayment.empty();
            QuotationLoadDataHandle.loadBoxQuotationOpportunity({}, $(this).val());
            QuotationLoadDataHandle.loadBoxQuotationCustomer({}, $(this).val());
            document.getElementById('customer-price-list').value = "";
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // load again price of product by customer price list then Re Calculate
            QuotationLoadDataHandle.loadDataProductAll();
            // ReCheck Config when change Opportunity
            QuotationCheckConfigHandle.checkConfig(true);
        });

// Action on click dropdown price list
        tabPrice.on('click', function() {
            if (!boxPriceList[0].innerHTML) {
                QuotationLoadDataHandle.loadBoxQuotationPrice();
            }
        });

// Action on click dropdown payment term
        boxPayment.on('click', function() {
            QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        });

// Action on click dropdown contact
        boxQuotation.on('click', function() {
            if (!$(this)[0].innerHTML) {
                let opp_id = null;
                let sale_person_id = null;
                if (boxOpportunity.val()) {
                    opp_id = boxOpportunity.val()
                }
                if (boxSalePerson.val()) {
                    sale_person_id = boxSalePerson.val()
                }
                QuotationLoadDataHandle.loadBoxSaleOrderQuotation('select-box-quotation', null, opp_id, sale_person_id);
            }
        });

// Action on click button add product
        $('#btn-add-product-quotation-create').on('click', function (e) {
            e.preventDefault();
            // delete all Promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // ReCalculate Total
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false);
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
                    "id": "",
                    "code": "",
                    "title": ""
                },
                "product_code": "",
                "product_title": "",
                "unit_of_measure": {
                    "id": "",
                    "code": "",
                    "title": ""
                },
                "product_quantity": 0,
                "product_uom_code": "",
                "product_tax_title": "",
                "product_tax_value": 0,
                "product_uom_title": "",
                "product_tax_amount": 0,
                "product_unit_price": 0,
                "product_description": "",
                "product_discount_value": 0,
                "product_subtotal_price": 0,
                "product_discount_amount": 0,
                "is_promotion": false,
                "is_shipping": false,
            }
            let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
            // check disable
            tableProduct.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
            // check Config for new row
            QuotationCheckConfigHandle.checkConfig(false, newRow);
            // load data dropdown
            QuotationLoadDataHandle.loadBoxQuotationProduct($(newRow.querySelector('.table-row-item')));
            QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')));
            QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')));
            // Clear table COST if add new row Product
            tableCost.DataTable().clear().draw();
            document.getElementById('quotation-create-cost-pretax-amount').innerHTML = "0";
            document.getElementById('quotation-create-cost-taxes').innerHTML = "0";
            document.getElementById('quotation-create-cost-total').innerHTML = "0";
        });

// Action on delete row product
        tableProduct.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableProduct);
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // ReCalculate Total
            QuotationCalculateCaseHandle.updateTotal(tableProduct[0], true, false, false)
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
            // Clear table COST if item or quantity change
            if ($(this).hasClass('table-row-item') || $(this).hasClass('table-row-quantity') || $(this).hasClass('table-row-tax')) {
                tableCost.DataTable().clear().draw();
                document.getElementById('quotation-create-cost-pretax-amount').innerHTML = "0";
                document.getElementById('quotation-create-cost-taxes').innerHTML = "0";
                document.getElementById('quotation-create-cost-total').innerHTML = "0";
            }
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // Re Calculate all data of rows & total
            QuotationCalculateCaseHandle.commonCalculate(tableProduct, row, true, false, false);
        });

// If change product uom then clear table COST
        tableProduct.on('change', '.table-row-uom', function () {
            // Clear table COST if change product uom
            tableCost.DataTable().clear().draw();
            document.getElementById('quotation-create-cost-pretax-amount').innerHTML = "0";
            document.getElementById('quotation-create-cost-taxes').innerHTML = "0";
            document.getElementById('quotation-create-cost-total').innerHTML = "0";
        });

// Check valid number for input
        $('#tab-content-quotation-product').on('change', '.validated-number', function () {
            let value = this.value;
            // Replace non-digit characters with an empty string
            value = value.replace(/[^0-9.]/g, '');
            // Remove unnecessary zeros from the integer part
            value = value.replace("-", "").replace(/^0+(?=\d)/, '');
            // Update value of input
            this.value = value;
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

// Action on click button add expense
        $('#btn-add-expense-quotation-create').on('click', function (e) {
            e.preventDefault();
            let order = 1;
            let tableEmpty = tableExpense[0].querySelector('.dataTables_empty');
            let tableLen = tableExpense[0].tBodies[0].rows.length;
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
                "expense": {
                    "id": "",
                    "code": "",
                    "title": ""
                },
                "product": {
                    "id": "",
                    "code": "",
                    "title": ""
                },
                "expense_code": "",
                "expense_price": 0,
                "expense_title": "",
                "unit_of_measure": {
                    "id": "",
                    "code": "",
                    "title": ""
                },
                "expense_quantity": 0,
                "expense_uom_code": "",
                "expense_tax_title": "",
                "expense_tax_value": 0,
                "expense_uom_title": "",
                "expense_tax_amount": 0,
                "expense_subtotal_price": 0,
                "is_product": false,
            }
            let newRow = tableExpense.DataTable().row.add(dataAdd).draw().node();
            // load data dropdown
            let selectExpenseID = 'quotation-create-expense-box-expense-' + String(order);
            QuotationLoadDataHandle.loadBoxQuotationExpense(selectExpenseID);
            QuotationLoadDataHandle.loadBoxQuotationProductPurchasing(selectExpenseID);
            QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')));
            QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')));
            // check disable
            tableExpense.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
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
                    QuotationLoadDataHandle.loadDataProductSelect($(eleExpenseDropdown), true, true);
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
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableExpense);
            QuotationCalculateCaseHandle.updateTotal(tableExpense[0], false, false, true)
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
        tableExpense.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
            }
            QuotationCalculateCaseHandle.commonCalculate(tableExpense, row, false, false, true);
        });

// COPY PRODUCT -> COST
        $('#quotation-tabs').on('click', '.quotation-cost', function () {
            let tableEmpty = tableCost[0].querySelector('.dataTables_empty');
            if (tableEmpty) {
                // copy data
                let valueOrder = 0;
                for (let i = 0; i < tableProduct[0].tBodies[0].rows.length; i++) {
                    let valueQuantity = 0;
                    let valuePrice = 0;
                    let valueTaxAmount = 0;
                    let valueSubtotal = 0;
                    let dataProduct = {};
                    let dataUOM = {};
                    let dataTax = {};
                    let row = tableProduct[0].tBodies[0].rows[i];
                    let product = row.querySelector('.table-row-item');
                    let uom = row.querySelector('.table-row-uom');
                    let tax = row.querySelector('.table-row-tax');
                    let shipping = row.querySelector('.table-row-shipping');
                    if (product) { // PRODUCT
                        dataProduct = SelectDDControl.get_data_from_idx($(product), $(product).val());
                        if (uom) {
                            dataUOM = SelectDDControl.get_data_from_idx($(uom), $(uom).val());
                        }
                        if (tax) {
                            dataTax = SelectDDControl.get_data_from_idx($(tax), $(tax).val());
                            // valueTaxAmount = parseFloat(row.querySelector('.table-row-tax-amount-raw').value);
                            valueTaxAmount = 0;
                        }
                        valueQuantity = parseFloat(row.querySelector('.table-row-quantity').value);
                        let elePrice = row.querySelector('.table-row-price');
                        if (elePrice) {
                            // valuePrice = $(elePrice).valCurrency();
                            valuePrice = 0;
                        }
                        // valueSubtotal = parseFloat(row.querySelector('.table-row-subtotal-raw').value);
                        valueSubtotal = 0;
                        valueOrder++
                        let dataAdd = {
                            "tax": {
                                "id": "",
                                "code": "",
                                "title": "",
                                "value": 0
                            },
                            "order": valueOrder,
                            "product": {
                                "id": "",
                                "code": "",
                                "title": ""
                            },
                            "product_code": "",
                            "product_title": "",
                            "unit_of_measure": {
                                "id": "",
                                "code": "",
                                "title": ""
                            },
                            "product_quantity": valueQuantity,
                            "product_uom_code": "",
                            "product_tax_title": "",
                            "product_tax_value": 0,
                            "product_uom_title": "",
                            "product_cost_price": valuePrice,
                            "product_tax_amount": valueTaxAmount,
                            "product_subtotal_price": valueSubtotal,
                            "is_shipping": false,
                        }
                        let newRow = tableCost.DataTable().row.add(dataAdd).draw().node();
                        QuotationLoadDataHandle.loadBoxQuotationProduct($(newRow.querySelector('.table-row-item')), dataProduct);
                        QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')), dataUOM);
                        QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')), dataTax);
                    } else if (shipping) { // SHIPPING
                        let shippingID = shipping.getAttribute('data-id');
                        let shippingTitle = shipping.value;
                        valueQuantity = 1;
                        valueSubtotal = parseFloat(row.querySelector('.table-row-subtotal-raw').value);
                        // check if margin then minus
                        let shippingPriceMargin = shipping.getAttribute('data-shipping-price-margin');
                        if (shippingPriceMargin) {
                            if (parseFloat(shippingPriceMargin) > 0) {
                                valueSubtotal = valueSubtotal - parseFloat(shippingPriceMargin);
                            }
                        }
                        valueOrder++
                        let dataAdd = {
                            "tax": {
                                "id": "",
                                "code": "",
                                "title": "",
                                "value": 0
                            },
                            "order": valueOrder,
                            "product": {
                                "id": shippingID,
                                "code": "",
                                "title": shippingTitle
                            },
                            "product_code": "",
                            "product_title": shippingTitle,
                            "unit_of_measure": {
                                "id": "",
                                "code": "",
                                "title": ""
                            },
                            "product_quantity": valueQuantity,
                            "product_uom_code": "",
                            "product_tax_title": "",
                            "product_tax_value": 0,
                            "product_uom_title": "",
                            "product_cost_price": valueSubtotal,
                            "product_tax_amount": valueTaxAmount,
                            "product_subtotal_price": valueSubtotal,
                            "is_shipping": true,
                            "shipping": {"id": shippingID},
                        }
                        let newRow = tableCost.DataTable().row.add(dataAdd).draw().node();
                        QuotationLoadDataHandle.loadBoxQuotationUOM($(newRow.querySelector('.table-row-uom')), dataUOM);
                        QuotationLoadDataHandle.loadBoxQuotationTax($(newRow.querySelector('.table-row-tax')), dataTax);
                    }
                }
                // update total
                QuotationCalculateCaseHandle.updateTotal(tableCost[0], false, true, false);
                // check disable
                tableCost.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
            }
        });

// ******** Action on change data of table row COST => calculate data for row & calculate data total
        tableCost.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            QuotationCalculateCaseHandle.commonCalculate(tableCost, row, false, true, false);
        });

// Action on click button collapse
        $('#quotation-info-collapse').click(function () {
            $(this).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

// SHIPPING-BILLING
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
                if (boxOpportunity.val()) {
                    opp_id = boxOpportunity.val()
                }
                if (boxSalePerson.val()) {
                    sale_person_id = boxSalePerson.val()
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
            QuotationLoadDataHandle.loadAPIDetailQuotation('data-init-copy-quotation', $(this)[0].getAttribute('data-id'));
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
            let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
            let dataCopyTo = {'id': dataCopy.id, 'option': 'all'};
            let type = $(this)[0].getAttribute('data-copy-type');
            if (divCopyOption[0].querySelector('.check-option').checked === false) { // if option copy is custom then setup data products & costs for load
                let result = [];
                let productCopyTo = [];
                let order = 0;
                for (let idx = 0; idx < tableCopyQuotationProduct[0].tBodies[0].rows.length; idx++) {
                    let row = tableCopyQuotationProduct[0].tBodies[0].rows[idx];
                    let check = row.querySelector('.table-row-check-product');
                    if (check.checked === true) {
                        let quantyInput = row.querySelector('.table-row-quantity-input').value;
                        let prodID = check.getAttribute('data-id');
                        for (let i = 0; i < dataCopy.quotation_products_data.length; i++) {
                            let data = dataCopy.quotation_products_data[i];
                            if (data.product.id === prodID) {
                                data['product_quantity'] = parseFloat(quantyInput);
                                order++
                                data['order'] = order;
                                result.push(data);
                                productCopyTo.push({'id': data.product.id, 'quantity': parseFloat(quantyInput)})
                                break
                            }
                        }
                    }
                }
                dataCopy['quotation_products_data'] = result;
                dataCopyTo['option'] = 'custom';
                dataCopyTo['products'] = productCopyTo;
                dataCopy['quotation_costs_data'] = [];
            } else { // if option copy is ALL product
                dataCopy['quotation_products_data'] = dataCopy.quotation_products_data;
            }
            if (type === 'copy-from') { // COPY FROM (SALE ORDER CREATE -> CHOOSE QUOTATION)
                // Begin load data copy FROM
                document.getElementById('customer-price-list').value = dataCopy.customer?.['customer_price_list'];
                QuotationLoadDataHandle.loadDetailQuotation(dataCopy, true);
                QuotationLoadDataHandle.loadDataTablesAndDropDowns(dataCopy);
                if (dataCopyTo.option === 'custom') {
                    QuotationCalculateCaseHandle.calculateAllRowsTableProduct(tableProduct);
                } else {
                    QuotationCalculateCaseHandle.calculateAllRowsTableProduct(tableProduct);
                }

            } else if (type === 'copy-to') { // COPY TO (QUOTATION DETAIL -> SALE ORDER CREATE)
                // create URL and add to href
                let eleRedirect = document.getElementById('link-to-sale-order-create');
                let urlSaleOrder = eleRedirect.getAttribute('data-url') + "?data_copy_to=" + encodeURIComponent(JSON.stringify(dataCopyTo));
                eleRedirect.setAttribute('href', urlSaleOrder);
                // active event on click <a>
                eleRedirect.click();
            }
        });

// Load data quotation COPY TO sale order when sale order page loaded
        function prepareDataCopyTo() {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    QuotationLoadDataHandle.loadAPIDetailQuotation('data-init-copy-quotation', dataRaw.id);
                    checkElementValuesBeforeLoadDataCopy();
                    checkOppLoaded();
                }
            }
        }
        prepareDataCopyTo();

        function loadDataCopyTo(dataCopy) {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    QuotationLoadDataHandle.loadDetailQuotation(dataCopy, true);
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
                    if (dataRaw.option === 'custom') {
                        QuotationCalculateCaseHandle.calculateAllRowsTableProduct(tableProduct);
                    } else {
                        QuotationCalculateCaseHandle.calculateAllRowsTableProduct(tableProduct);
                    }
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

        function checkOppLoaded() {
            let oppVal = boxOpportunity.val();
            let dataCopy = $('#data-copy-quotation-detail').val();
            if (oppVal && dataCopy) {
                let data = JSON.parse(dataCopy);
                document.getElementById('quotation-final-revenue-before-tax').value = data.total_product_revenue_before_tax;
            } else {
                setTimeout(checkOppLoaded, 1000);  // call again after 1s if condition not pass yet
            }
        }

// PROMOTION
// Action on click button Check Available Promotion (show list promotions)
        $('#btn-check-promotion').on('click', function() {
            if (boxCustomer.val()) {
                // destroy dataTable then call API load-check again
                QuotationDataTableHandle.loadTableQuotationPromotion('data-init-quotation-create-promotion', boxCustomer.val())
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
                    "id": promotionResult.product_id,
                    "code": promotionResult.product_code,
                    "title": promotionResult.product_title
                },
                "product_code": promotionResult.product_code,
                "product_title": promotionResult.product_title,
                "unit_of_measure": {
                    "id": "",
                    "code": "",
                    "title": ""
                },
                "product_quantity": promotionResult.product_quantity,
                "product_uom_code": "",
                "product_tax_title": "",
                "product_tax_value": 0,
                "product_uom_title": "",
                "product_tax_amount": 0,
                "product_unit_price": promotionResult.product_price,
                "product_description": promotionResult.product_description,
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
                                promotionClass.reCalculateIfPromotion(tableProduct, promotionResult.discount_rate_on_order, promotionResult.product_price)
                            } else {
                                promotionClass.reCalculateIfPromotion(tableProduct, promotionResult.discount_rate_on_order, promotionResult.product_price, false)
                            }
                        }
                    }
                }
            } else if (promotionResult.is_gift === true) { // GIFT
                if (promotionResult.row_apply_index !== null) { // on Specific product
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    // Get the desired position
                    let afterRow = tableProduct.DataTable().row(promotionResult.row_apply_index).node();
                    // Remove the new row and re-insert it at the desired position
                    $(newRow).detach().insertAfter(afterRow);
                } else { // on Whole order
                    tableProduct.DataTable().row.add(dataAdd).draw()
                }
            }
            // ReOrder STT
            reOrderSTT(tableProduct[0].tBodies[0], tableProduct);
            // check disable
            tableProduct.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
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
                    "id": dataShipping.id,
                    "code": "",
                    "title": dataShipping.shipping_title,
                },
                "product_code": "",
                "product_title": dataShipping.shipping_title,
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
                "product_description": dataShipping.shipping_title,
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
            // ReOrder STT
            reOrderSTT(tableProduct[0].tBodies[0], tableProduct)
            // Clear table COST if add new row Product
            tableCost.DataTable().clear().draw();
            document.getElementById('quotation-create-cost-pretax-amount').innerHTML = "0";
            document.getElementById('quotation-create-cost-taxes').innerHTML = "0";
            document.getElementById('quotation-create-cost-total').innerHTML = "0";
        });


// Submit form quotation + sale order
        formSubmit.submit(function (e) {
            e.preventDefault();
            if (tableProduct[0].querySelector('.table-row-promotion') && $(this).attr('data-method') === "POST") { // HAS PROMOTION => Check condition again
                promotionClass.checkPromotionIfSubmit('data-init-quotation-create-promotion', boxCustomer.val());
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

// Main Function Submit
        function submitForm(formSubmit) {
            let is_sale_order = false;
            if (formSubmit[0].classList.contains('sale-order')) {
                is_sale_order = true;
            }
            let _form = new SetupFormSubmit(formSubmit);

            // Load again indicator when Submit
            indicatorClass.loadQuotationIndicator('quotation-indicator-data');

            QuotationSubmitHandle.setupDataSubmit(_form, is_sale_order);
            let submitFields = [
                'title',
                'opportunity',
                'customer',
                'contact',
                'employee_inherit',
                'payment_term',
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
                // 'system_status',
            ]
            if (is_sale_order === true) {
                submitFields = [
                    'title',
                    'opportunity',
                    'customer',
                    'contact',
                    'employee_inherit',
                    'payment_term',
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
                    // system
                    // 'system_status',
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
                'opportunity',
                'customer',
                'contact',
                'employee_inherit',
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

            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
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
