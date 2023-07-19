
$(function () {

    $(document).ready(function () {

        let loadDataClass = new loadDataHandle();
        let dataTableClass = new dataTableHandle();
        let calculateClass = new calculateCaseHandle();
        let submitClass = new submitHandle();
        let promotionClass = new promotionHandle();
        let shippingClass = new shippingHandle();
        let configClass = new checkConfigHandle();

        let formSubmit = $('#frm_quotation_create');

        let data = JSON.parse($('#data-quotation').val());
        let boxOpportunity = $('#select-box-quotation-create-opportunity');
        let boxCustomer = $('#select-box-quotation-create-customer');
        let boxContact = $('#select-box-quotation-create-contact');
        let boxSalePerson = $('#select-box-quotation-create-sale-person');
        let boxPriceList = $('#select-box-quotation-create-price-list');
        let boxPaymentTerm = $('#select-box-quotation-create-payment-term');
        let boxQuotation = $('#select-box-quotation');
        let tabPrice = $('#tab_terms');
        loadDataClass.loadBoxQuotationSalePerson('select-box-quotation-create-sale-person', null, true);
        loadDataClass.loadInitQuotationProduct('data-init-quotation-create-tables-product');
        loadDataClass.loadInitQuotationUOM('data-init-quotation-create-tables-uom');
        loadDataClass.loadInitQuotationTax('data-init-quotation-create-tables-tax');
        loadDataClass.loadInitQuotationExpense('data-init-quotation-create-tables-expense');
        // load config
        loadDataClass.loadInitQuotationConfig('quotation-config-data', formSubmit.attr('data-method'));

        dataTableClass.dataTableProduct(data,'datable-quotation-create-product');
        dataTableClass.dataTableCost(data, 'datable-quotation-create-cost');
        dataTableClass.dataTableExpense(data, 'datable-quotation-create-expense');
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

// Action on click dropdown opportunity
        boxOpportunity.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadDataClass.loadBoxQuotationOpportunity('select-box-quotation-create-opportunity');
            }
        });

// Action on change dropdown opportunity
        boxOpportunity.on('change', function (e) {
            let eleData = $(this)[0].options[$(this)[0].selectedIndex].querySelector('.data-default');
            if (eleData) {
                let data = JSON.parse(eleData.value);
                if (data.customer) {
                    let valueToSelect = data.customer.id;
                    loadDataClass.loadBoxQuotationCustomer('select-box-quotation-create-customer', valueToSelect, modalShipping, modalBilling);
                }
            } else { // No Value => load again dropdowns
                loadDataClass.loadBoxQuotationCustomer('select-box-quotation-create-customer', null, modalShipping, modalBilling);
            }
            loadDataClass.loadInformationSelectBox($(this));
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // ReCheck Config when change Opportunity
            configClass.checkConfig(true);
        });

// Action on click dropdown customer
        boxCustomer.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadDataClass.loadBoxQuotationCustomer('select-box-quotation-create-customer', null, modalShipping, modalBilling);
            }
        });

// Action on change dropdown customer
        boxCustomer.on('change', function (e) {
            let optionSelected = boxCustomer[0].options[boxCustomer[0].selectedIndex];
            if (optionSelected) {
                loadDataClass.loadShippingBillingCustomer(modalShipping, modalBilling);
                if (optionSelected.querySelector('.data-default')) {
                    let data = JSON.parse(optionSelected.querySelector('.data-default').value);
                    // load Shipping & Billing by Customer
                    loadDataClass.loadShippingBillingCustomer(modalShipping, modalBilling, data);
                    // load Contact by Customer
                    if (data.id && data.owner) {
                        loadDataClass.loadBoxQuotationContact('select-box-quotation-create-contact', data.owner.id, data.id);
                    }
                    // load Payment Term by Customer
                    loadDataClass.loadBoxQuotationPaymentTerm('select-box-quotation-create-payment-term', data.payment_term_mapped.id);
                    // Store Account Price List
                    if (Object.keys(data.price_list_mapped).length !== 0) {
                        document.getElementById('customer-price-list').value = data.price_list_mapped.id;
                    }
                } else { // No Value => load again dropdowns
                    loadDataClass.loadBoxQuotationContact('select-box-quotation-create-contact');
                    loadDataClass.loadBoxQuotationPaymentTerm('select-box-quotation-create-payment-term');
                    document.getElementById('customer-price-list').value = "";
                }
            }
            loadDataClass.loadInformationSelectBox($(this));
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // load again price of product by customer price list then Re Calculate
            loadDataClass.loadDataProductAll();
        });

// Action on click dropdown contact
//         boxContact.on('click', function(e) {
//             if (!$(this)[0].innerHTML) {
//                 loadDataClass.loadBoxQuotationContact('select-box-quotation-create-contact');
//             }
//         });

// Action on change dropdown contact
//         boxContact.on('change', function (e) {
//             loadDataClass.loadInformationSelectBox($(this));
//         });

// Action on change dropdown sale person
        boxSalePerson.on('change', function (e) {
            loadDataClass.loadInformationSelectBox($(this));
            // clear Customer box & Opportunity box & Contact box & PaymentTerm box & PriceListVal
            $('#select-box-quotation-create-customer').empty();
            $('#select-box-quotation-create-opportunity').empty();
            $('#select-box-quotation-create-contact').empty();
            $('#select-box-quotation-create-payment-term').empty();
            document.getElementById('customer-price-list').value = "";
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // load again price of product by customer price list then Re Calculate
            loadDataClass.loadDataProductAll();
            // ReCheck Config when change Opportunity
            configClass.checkConfig(true);
        });

// Action on click dropdown price list
        tabPrice.on('click', function(e) {
            if (!boxPriceList[0].innerHTML) {
                loadDataClass.loadBoxQuotationPrice('select-box-quotation-create-price-list');
            }
        });

// Action on click dropdown payment term
//         boxPaymentTerm.on('click', function(e) {
//             if (!$(this)[0].innerHTML) {
//                 loadDataClass.loadBoxQuotationPaymentTerm('select-box-quotation-create-payment-term');
//             }
//         });

// Action on change dropdown payment term
//         boxPaymentTerm.on('change', function(e) {
//             loadDataClass.loadInformationSelectBox($(this));
//         });

// Action on click dropdown contact
        boxQuotation.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                let opp_id = null;
                let sale_person_id = null;
                if (boxOpportunity.val()) {
                    opp_id = boxOpportunity.val()
                }
                if (boxSalePerson.val()) {
                    sale_person_id = boxSalePerson.val()
                }
                loadDataClass.loadBoxSaleOrderQuotation('select-box-quotation', null, opp_id, sale_person_id);
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
            calculateClass.updateTotal(tableProduct[0], true, false, false);
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
                "product_discount_amount": 0
            }
            let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();

            // check disable
            tableProduct.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');

            // check Config for new row
            configClass.checkConfig(false, newRow);
            // load data dropdown
            let selectProductID = 'quotation-create-product-box-product-' + String(order);
            let selectUOMID = 'quotation-create-product-box-uom-' + String(order);
            let selectTaxID = 'quotation-create-product-box-tax-' + String(order);
            loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', selectProductID);
            loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID);
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
            calculateClass.updateTotal(tableProduct[0], true, false, false)
        });

// Action on click price list's option
        tableProduct.on('click', '.table-row-price-option', function (e) {
            if (!$(this)[0].querySelector('.expired-price')) { // Check if price not expired
                let priceValRaw = $(this)[0].getAttribute('data-value');
                if (priceValRaw) {
                    let row = $(this)[0].closest('tr');
                    let elePrice = row.querySelector('.table-row-price');
                    if (elePrice) {
                        $(elePrice).attr('value', String(priceValRaw));
                        $.fn.initMaskMoney2();
                        calculateClass.commonCalculate(tableProduct, row, true, false, false);
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
        tableProduct.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax, .table-row-discount', function (e) {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                loadDataClass.loadDataProductSelect($(this));
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
            calculateClass.commonCalculate(tableProduct, row, true, false, false);
        });

// If change product uom then clear table COST
        tableProduct.on('change', '.table-row-uom', function (e) {
            // Clear table COST if change product uom
            tableCost.DataTable().clear().draw();
            document.getElementById('quotation-create-cost-pretax-amount').innerHTML = "0";
            document.getElementById('quotation-create-cost-taxes').innerHTML = "0";
            document.getElementById('quotation-create-cost-total').innerHTML = "0";
        });

// Check valid number for input
        $('#tab-content-quotation-product').on('change', '.validated-number', function (e) {
            let value = this.value;
            // Replace non-digit characters with an empty string
            value = value.replace(/[^0-9.]/g, '');
            // Remove unnecessary zeros from the integer part
            value = value.replace("-", "").replace(/^0+(?=\d)/, '');
            // Update value of input
            this.value = value;
        });

// Action on change discount rate on Total of product
        $('#quotation-create-product-discount').on('change', function (e) {
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // Calculate with discount on Total
            for (let i = 0; i < tableProduct[0].tBodies[0].rows.length; i++) {
                let row = tableProduct[0].tBodies[0].rows[i];
                calculateClass.calculate(row);
            }
            calculateClass.updateTotal(tableProduct[0], true, false, false)
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
                "expense_subtotal_price": 0
            }
            let newRow = tableExpense.DataTable().row.add(dataAdd).draw().node();
            // load data dropdown
            let selectExpenseID = 'quotation-create-expense-box-expense-' + String(order);
            let selectUOMID = 'quotation-create-expense-box-uom-' + String(order);
            let selectTaxID = 'quotation-create-expense-box-tax-' + String(order);
            loadDataClass.loadBoxQuotationExpense('data-init-quotation-create-tables-expense', selectExpenseID);
            loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID);

            // check disable
            tableExpense.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
        });

// Action on click expense option
        tableExpense.on('click', '.table-row-expense-option', function (e) {
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
                    loadDataClass.loadDataProductSelect($(eleExpenseDropdown), true, true);
                }
            }
        });

// Action on delete row expense
        tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableExpense);
            calculateClass.updateTotal(tableExpense[0], false, false, true)
        });

// Action on click price list's option
        tableExpense.on('click', '.table-row-price-option', function (e) {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).attr('value', String(priceValRaw));
                    $.fn.initMaskMoney2();
                    calculateClass.commonCalculate(tableExpense, row, false, false, true);
                }
            }
        });

// ******** Action on change data of table row EXPENSE => calculate data for row & calculate data total
        tableExpense.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function (e) {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                // loadDataClass.loadDataProductSelect($(this));
            }
            calculateClass.commonCalculate(tableExpense, row, false, false, true);
        });

// Action on click tab cost (clear table cost & copy product data -> cost data)
        $('#quotation-tabs').on('click', '.quotation-cost', function (e) {
            let tableEmpty = tableCost[0].querySelector('.dataTables_empty');
            if (tableEmpty) {
                // copy data
                let valueOrder = 0;
                for (let i = 0; i < tableProduct[0].tBodies[0].rows.length; i++) {
                    let valueProduct = "";
                    let showProduct = "";
                    let product_data = "";
                    let productDataStr = "";
                    let optionProduct = ``;

                    let valueUOM = "";
                    let valueUOMGroup = "";
                    let showUOM = "";
                    let uomDataStr = "";
                    let optionUOM = ``;

                    let valueQuantity = 0;
                    let valuePrice = 0;
                    let valueTax = "";
                    let valueTaxSelected = 0;
                    let valueTaxAmount = 0;
                    // let valueOrder = 0;
                    let valueSubtotal = 0;
                    let row = tableProduct[0].tBodies[0].rows[i];
                    let product = row.querySelector('.table-row-item');
                    let shipping = row.querySelector('.table-row-shipping');
                    if (product) { // PRODUCT
                        valueProduct = product.value;
                        let optionSelected = product.options[product.selectedIndex];
                        if (optionSelected) {
                            showProduct = optionSelected.text;
                            if (optionSelected.querySelector('.data-default')) {
                                let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                if (product_data_json.cost_price) {
                                    valuePrice = parseFloat(product_data_json.cost_price);
                                }
                                valueUOMGroup = product_data_json.uom_group.id;
                                product_data = JSON.stringify(product_data_json).replace(/"/g, "&quot;");
                            }
                            if (optionSelected.querySelector('.data-info')) {
                                let dataStrJson = JSON.parse(optionSelected.querySelector('.data-info').value);
                                productDataStr = JSON.stringify(dataStrJson).replace(/"/g, "&quot;");
                            }
                        }
                        optionProduct = `<option value="${valueProduct}" selected></option>`
                        let uom = row.querySelector('.table-row-uom');
                        if (uom) {
                            valueUOM = uom.value;
                            let optionSelected = uom.options[uom.selectedIndex];
                            if (optionSelected) {
                                showUOM = optionSelected.text;
                                if (optionSelected.querySelector('.data-info')) {
                                    let dataStrJson = JSON.parse(optionSelected.querySelector('.data-info').value);
                                    uomDataStr = JSON.stringify(dataStrJson).replace(/"/g, "&quot;");
                                }
                            }
                            optionUOM = `<option value="${valueUOM}" selected></option>`
                        }
                        let quantity = row.querySelector('.table-row-quantity');
                        if (quantity) {
                            valueQuantity = parseFloat(quantity.value);
                        }
                        valueTax = row.querySelector('.table-row-tax').options[row.querySelector('.table-row-tax').selectedIndex].value;
                        valueTaxSelected = parseInt(row.querySelector('.table-row-tax').options[row.querySelector('.table-row-tax').selectedIndex].getAttribute('data-value'));
                        if (valuePrice && valueQuantity) {
                            valueSubtotal = (valuePrice * valueQuantity);
                            if (valueTaxSelected) {
                                valueTaxAmount = ((valueSubtotal * valueTaxSelected) / 100);
                            }
                        }
                        valueOrder++
                        let selectProductID = 'quotation-create-cost-box-product-' + String(valueOrder);
                        let selectUOMID = 'quotation-create-cost-box-uom-' + String(valueOrder);
                        let selectTaxID = 'quotation-create-cost-box-tax-' + String(valueOrder);
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
                            "product_subtotal_price": valueSubtotal
                        }
                        tableCost.DataTable().row.add(dataAdd).draw();
                        loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', selectProductID, valueProduct);
                        loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID, valueUOM, valueUOMGroup);
                        loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID, valueTax);
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
                        tableCost.DataTable().row.add(dataAdd).draw();
                    }
                }
                // update total
                calculateClass.updateTotal(tableCost[0], false, true, false);
                // check disable
                tableCost.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
            }
        });

// ******** Action on change data of table row COST => calculate data for row & calculate data total
        tableCost.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function (e) {
            let row = $(this)[0].closest('tr');
            calculateClass.commonCalculate(tableCost, row, false, true, false);
        });

// Action on click button collapse
        $('#quotation-info-collapse').click(function () {
            $(this).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

// SHIPPING-BILLING
// Action on click choose shipping
        modalShipping.on('click', '.choose-shipping', function (e) {
            // Enable other buttons
            $('.choose-shipping').prop('disabled', false);
            // Disable the clicked button
            $(this).prop('disabled', true);
            let eleContent = $(this)[0].closest('.shipping-group').querySelector('.shipping-content');
            let eleShow = $('#quotation-create-shipping-address');
            if (eleContent && eleShow) {
                eleShow[0].value = eleContent.value;
            }
            let rowShipping = tableProduct[0].querySelector('.table-row-shipping');
            if (rowShipping) {
                // Delete all promotion rows
                deletePromotionRows(tableProduct, true, false);
                // Delete all shipping rows
                deletePromotionRows(tableProduct, false, true);
                // ReCalculate Total
                calculateClass.updateTotal(tableProduct[0], true, false, false);
            }
        });

// Action on click choose billing
        modalBilling.on('click', '.choose-billing', function (e) {
            // Enable other buttons
            $('.choose-billing').prop('disabled', false);
            // Disable the clicked button
            $(this).prop('disabled', true);
            let eleContent = $(this)[0].closest('.billing-group').querySelector('.billing-content');
            let eleShow = $('#quotation-create-billing-address');
            if (eleContent && eleShow) {
                eleShow[0].value = eleContent.value;
            }
        });

// COPY FROM - TO
// Action on click button copy quotation on sale order page + restart all status of all element of modal
        $('#btn-copy-quotation').on('click', function (e) {
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
                dataTableClass.loadTableCopyQuotation('data-init-copy-quotation', opp_id, sale_person_id)
            } else if (type === 'copy-to') {
                // load data product for table datable-copy-quotation-product
                let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
                tableCopyQuotationProduct.DataTable().destroy();
                // Filter all data is not Promotion from quotation_products_data
                let finalList = filterDataProductNotPromotion(dataCopy.quotation_products_data);
                dataTableClass.dataTableCopyQuotationProduct(finalList, 'datable-copy-quotation-product');

                // dataTableClass.dataTableCopyQuotationProduct(dataCopy.quotation_products_data, 'datable-copy-quotation-product');
            }
        });

// Action on check quotation for copy
        tableCopyQuotation.on('click', '.table-row-check', function (e) {
            tableCopyQuotation.find('.table-row-check').prop('checked', false);
            $(this).prop('checked', true);
            loadDataClass.loadAPIDetailQuotation('data-init-copy-quotation', $(this)[0].getAttribute('data-id'));
        });

// Action on click button select quotation for copy
        $('#btn-select-quotation-copy').on('click', function(e) {
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
            dataTableClass.dataTableCopyQuotationProduct(finalList, 'datable-copy-quotation-product');

            // dataTableClass.dataTableCopyQuotationProduct(dataCopy.quotation_products_data, 'datable-copy-quotation-product');
            $('#btn-select-quotation-copy')[0].setAttribute('hidden', true);
            $('#btn-quotation-copy-confirm')[0].removeAttribute('hidden')
        });

// Action on check copy option
        divCopyOption.on('change', '.check-option', function(e) {
            if ($(this)[0].checked === false) {
                tableCopyQuotationProduct[0].removeAttribute('hidden');
            } else {
                tableCopyQuotationProduct[0].setAttribute('hidden', true);
            }
        });

// Action on confirm copy quotation
        $('#btn-quotation-copy-confirm').on('click', function (e) {
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
                document.getElementById('customer-price-list').value = dataCopy.customer.customer_price_list;
                loadDataClass.loadDetailQuotation(dataCopy, true);
                $('#datable-quotation-create-product').DataTable().destroy();
                $('#datable-quotation-create-cost').DataTable().destroy();
                $('#datable-quotation-create-expense').DataTable().destroy();
                dataTableClass.dataTableProduct(dataCopy.quotation_products_data, 'datable-quotation-create-product');
                dataTableClass.dataTableCost(dataCopy.quotation_costs_data, 'datable-quotation-create-cost');
                dataTableClass.dataTableExpense(dataCopy.quotation_expenses_data, 'datable-quotation-create-expense');
                // load data dropdown for Tabs
                let tableProduct = document.getElementById('datable-quotation-create-product');
                let tableCost = document.getElementById('datable-quotation-create-cost');
                let tableExpense = document.getElementById('datable-quotation-create-expense');
                for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                    let row = tableProduct.tBodies[0].rows[i];
                    if (row.querySelector('.table-row-item')) {
                        loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                        // check expense selected to get uom group filter uom data
                        let optionSelected = row.querySelector('.table-row-item').options[row.querySelector('.table-row-item').selectedIndex];
                        if (optionSelected) {
                            if (optionSelected.querySelector('.data-default')) {
                                let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                            }
                        }
                        loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                    }
                }
                for (let i = 0; i < tableCost.tBodies[0].rows.length; i++) {
                    let row = tableCost.tBodies[0].rows[i];
                    if (row.querySelector('.table-row-item')) {
                        loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                        // check expense selected to get uom group filter uom data
                        let optionSelected = row.querySelector('.table-row-item').options[row.querySelector('.table-row-item').selectedIndex];
                        if (optionSelected) {
                            if (optionSelected.querySelector('.data-default')) {
                                let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                            }
                        }
                        loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                    }
                }
                for (let i = 0; i < tableExpense.tBodies[0].rows.length; i++) {
                    let row = tableExpense.tBodies[0].rows[i];
                    if (row.querySelector('.table-row-item')) {
                        loadDataClass.loadBoxQuotationExpense('data-init-quotation-create-tables-expense', row.querySelector('.expense-option-list').id, row.querySelector('.table-row-item').getAttribute('data-value'));
                        // check expense selected to get uom group filter uom data
                        let optionSelected = row.querySelector('.expense-option-list').querySelector('.option-btn-checked');
                        if (optionSelected) {
                            if (optionSelected.querySelector('.data-default')) {
                                let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                            }
                        }
                        loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                    }
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
                    loadDataClass.loadAPIDetailQuotation('data-init-copy-quotation', dataRaw.id);
                    checkElementValues();
                }
            }
        }
        prepareDataCopyTo();

        function loadDataCopyTo(dataCopy) {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    loadDataClass.loadDetailQuotation(dataCopy, true);
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
                    document.getElementById('customer-price-list').value = dataCopy.customer.customer_price_list;
                    $('#datable-quotation-create-product').DataTable().destroy();
                    $('#datable-quotation-create-cost').DataTable().destroy();
                    $('#datable-quotation-create-expense').DataTable().destroy();
                    dataTableClass.dataTableProduct(dataCopy.quotation_products_data, 'datable-quotation-create-product');
                    dataTableClass.dataTableCost(dataCopy.quotation_costs_data, 'datable-quotation-create-cost');
                    dataTableClass.dataTableExpense(dataCopy.quotation_expenses_data, 'datable-quotation-create-expense');
                    // load data dropdown for Tabs
                    let tableProduct = document.getElementById('datable-quotation-create-product');
                    let tableCost = document.getElementById('datable-quotation-create-cost');
                    let tableExpense = document.getElementById('datable-quotation-create-expense');
                    for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                        let row = tableProduct.tBodies[0].rows[i];
                        if (row.querySelector('.table-row-item')) {
                            loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                            // check product selected to get uom group filter uom data
                            let optionSelected = row.querySelector('.table-row-item').options[row.querySelector('.table-row-item').selectedIndex];
                            if (optionSelected) {
                                if (optionSelected.querySelector('.data-default')) {
                                    let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                    loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                                }
                            }
                            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                        }
                    }
                    for (let i = 0; i < tableCost.tBodies[0].rows.length; i++) {
                        let row = tableCost.tBodies[0].rows[i];
                        if (row.querySelector('.table-row-item')) {
                            loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                            // check product selected to get uom group filter uom data
                            let optionSelected = row.querySelector('.table-row-item').options[row.querySelector('.table-row-item').selectedIndex];
                            if (optionSelected) {
                                if (optionSelected.querySelector('.data-default')) {
                                    let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                    loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                                }
                            }
                            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                        }
                    }
                    for (let i = 0; i < tableExpense.tBodies[0].rows.length; i++) {
                        let row = tableExpense.tBodies[0].rows[i];
                        if (row.querySelector('.table-row-item')) {
                            loadDataClass.loadBoxQuotationExpense('data-init-quotation-create-tables-expense', row.querySelector('.expense-option-list').id, row.querySelector('.table-row-item').getAttribute('data-value'));
                            // check expense selected to get uom group filter uom data
                            let optionSelected = row.querySelector('.expense-option-list').querySelector('.option-btn-checked');
                            if (optionSelected) {
                                if (optionSelected.querySelector('.data-default')) {
                                    let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                    loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value, product_data_json.uom_group.id);
                                }
                            }
                            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                        }
                    }
                }
            }
        }

        function checkElementValues() {
            let element0 = $('#data-copy-quotation-detail').val();
            let element1 = $('#data-init-quotation-create-tables-product').val();
            let element2 = $('#data-init-quotation-create-tables-uom').val();
            let element3 = $('#data-init-quotation-create-tables-tax').val();
            let element4 = $('#data-init-quotation-create-tables-expense').val();


            if (element0 && element1 && element2 && element3 && element4) {
                loadDataCopyTo(JSON.parse(element0));  // call loadDataCopyTo() if all condition pass
            } else {
                setTimeout(checkElementValues, 1000);  // call again after 1s if condition not pass yet
            }
        }

// PROMOTION
// Action on click button Check Available Promotion (show list promotions)
        $('#btn-check-promotion').on('click', function(e) {
            if (boxCustomer.val()) {
                // destroy dataTable then call API load-check again
                dataTableClass.loadTableQuotationPromotion('data-init-quotation-create-promotion', boxCustomer.val())
            } else {
                dataTableClass.dataTablePromotion([], 'datable-quotation-create-promotion');
            }
        });

// Action click Apply Promotion
        tablePromotion.on('click', '.apply-promotion', function () {
            $(this).prop('disabled', true);
            deletePromotionRows(tableProduct, true, false);
            // ReCalculate Total
            calculateClass.updateTotal(tableProduct[0], true, false, false);
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
                "promotion": {"id": $(this)[0].getAttribute('data-promotion-id')}
            };
            if (promotionResult.is_discount === true) { // DISCOUNT
                if (promotionResult.row_apply_index !== null) { // on Specific product
                    let selectTaxID = 'quotation-create-product-box-tax-' + String(order);
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID, promotionResult.value_tax);
                    // Get the desired position
                    let afterRow = tableProduct.DataTable().row(promotionResult.row_apply_index).node();
                    // Remove the new row and re-insert it at the desired position
                    $(newRow).detach().insertAfter(afterRow);
                    // Re Calculate all data
                    calculateClass.commonCalculate(tableProduct, newRow, true, false, false);
                } else { // on Whole order
                    let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
                    // Re Calculate all data
                    calculateClass.commonCalculate(tableProduct, newRow, true, false, false);
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
        $('#btn-add-shipping').on('click', function(e) {
            dataTableClass.loadTableQuotationShipping('data-init-quotation-create-shipping')
        });

// Action click Apply Shipping
        tableShipping.on('click', '.apply-shipping', function () {
            $(this).prop('disabled', true);
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(tableProduct, false, true);
            // ReCalculate Total
            calculateClass.updateTotal(tableProduct[0], true, false, false)
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
                "is_shipping": true,
                "shipping": {
                    "id": $(this)[0].getAttribute('data-shipping-id'),
                    "shipping_price_margin": shippingPriceMargin
                }
            };
            let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
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
            submitClass.setupDataSubmit(_form, is_sale_order);
            let submitFields = [
                'title',
                'opportunity',
                'customer',
                'contact',
                'sale_person',
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
                    'sale_person',
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
                'sale_person',
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
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        }

        $('#btn-remove-promotion').on('click', function(e) {
            $('#quotation-check-promotion').val("");
            // Delete Promotion Row & ReCalculate Total
            deletePromotionRows(tableProduct, true, false);
            calculateClass.updateTotal(tableProduct[0], true, false, false);
        });

        $('#btn-check-another-promotion').on('click', function(e) {
            $('#quotation-check-promotion').val("");
            $('#btn-check-promotion').click();
        })




    });
});
