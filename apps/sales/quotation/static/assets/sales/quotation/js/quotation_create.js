"use strict";

$(function () {

    $(document).ready(function () {

        let loadDataClass = new loadDataHandle();
        let dataTableClass = new dataTableHandle();
        let calculateClass = new calculateCaseHandle();
        let submitClass = new submitHandle();

        let data = JSON.parse($('#data-quotation').val());
        let boxOpportunity = $('#select-box-quotation-create-opportunity');
        let boxCustomer = $('#select-box-quotation-create-customer');
        let boxContact = $('#select-box-quotation-create-contact');
        let boxSalePerson = $('#select-box-quotation-create-sale-person');
        let boxPriceList = $('#select-box-quotation-create-price-list');
        let boxPaymentTerm = $('#select-box-quotation-create-payment-term');
        let boxQuotation = $('#select-box-quotation');
        let tabPrice = $('#tab_terms');
        loadDataClass.loadBoxQuotationSalePerson('select-box-quotation-create-sale-person');
        loadDataClass.loadInitQuotationProduct('data-init-quotation-create-tables-product');
        loadDataClass.loadInitQuotationUOM('data-init-quotation-create-tables-uom');
        loadDataClass.loadInitQuotationTax('data-init-quotation-create-tables-tax');
        loadDataClass.loadInitQuotationExpense('data-init-quotation-create-tables-expense');

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

        $("#select-box-quotation-create-discount-list").select2();

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
            } else {
                loadDataClass.loadBoxQuotationCustomer('select-box-quotation-create-customer', null, modalShipping, modalBilling);
                loadDataClass.loadBoxQuotationContact('select-box-quotation-create-contact');
            }
            loadDataClass.loadInformationSelectBox($(this));
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
                } else {
                    loadDataClass.loadBoxQuotationContact('select-box-quotation-create-contact');
                }
            }
            loadDataClass.loadInformationSelectBox($(this));
        });

// Action on click dropdown contact
        boxContact.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadDataClass.loadBoxQuotationContact('select-box-quotation-create-contact');
            }
        });

// Action on change dropdown contact
        boxContact.on('change', function (e) {
            loadDataClass.loadInformationSelectBox($(this));
        });

// Action on change dropdown sale person
        boxSalePerson.on('change', function (e) {
            loadDataClass.loadInformationSelectBox($(this));
        });

// Action on click dropdown price list
        tabPrice.on('click', function(e) {
            if (!boxPriceList[0].innerHTML) {
                loadDataClass.loadBoxQuotationPrice('select-box-quotation-create-price-list');
            }
        });

// Action on click dropdown payment term
        boxPaymentTerm.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadDataClass.loadBoxQuotationPaymentTerm('select-box-quotation-create-payment-term');
            }
        });

// Action on change dropdown payment term
        boxPaymentTerm.on('change', function(e) {
            loadDataClass.loadInformationSelectBox($(this));
        });

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
            let order = 1;
            let tableEmpty = tableProduct[0].querySelector('.dataTables_empty');
            let tableLen = tableProduct[0].tBodies[0].rows.length;
            if (tableLen !== 0 && !tableEmpty) {
                order = (tableLen+1);
            }
            let selectProductID = 'quotation-create-product-box-product-' + String(order);
            let selectUOMID = 'quotation-create-product-box-uom-' + String(order);
            let selectTaxID = 'quotation-create-product-box-tax-' + String(order);
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
            tableProduct.DataTable().row.add(dataAdd).draw();
            loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', selectProductID);
            loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID);
        });

// Action on delete row product
        tableProduct.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableProduct);
            // Delete all promotion rows
            deletePromotionRows(tableProduct, true, false);

            calculateClass.updateTotal(tableProduct[0], true, false, false)
        });

// Action on click price list's option
        tableProduct.on('click', '.table-row-price-option', function (e) {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).attr('value', String(priceValRaw));
                    $.fn.initMaskMoney2();
                    calculateClass.commonCalculate(tableProduct, row, true, false, false);
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
            // Re Calculate all data
            calculateClass.commonCalculate(tableProduct, row, true, false, false);
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
            let selectExpenseID = 'quotation-create-expense-box-expense-' + String(order);
            let selectUOMID = 'quotation-create-expense-box-uom-' + String(order);
            let selectTaxID = 'quotation-create-expense-box-tax-' + String(order);
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
            tableExpense.DataTable().row.add(dataAdd).draw();
            loadDataClass.loadBoxQuotationExpense('data-init-quotation-create-tables-expense', selectExpenseID);
            loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID)
        });

// Action on delete row expense
        tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableExpense);
            calculateClass.updateTotal(tableExpense[0], false, false, true)
        });

// ******** Action on change data of table row EXPENSE => calculate data for row & calculate data total
        tableExpense.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function (e) {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                loadDataClass.loadDataProductSelect($(this));
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
                    if (product) {
                        valueProduct = product.value;
                        let optionSelected = product.options[product.selectedIndex];
                        if (optionSelected) {
                            showProduct = optionSelected.text;
                            if (optionSelected.querySelector('.data-default')) {
                                let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                if (product_data_json.cost_price) {
                                    valuePrice = parseFloat(product_data_json.cost_price);
                                }
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
                            valueQuantity = parseInt(quantity.value);
                        }
                        valueTax = row.querySelector('.table-row-tax').options[row.querySelector('.table-row-tax').selectedIndex].value;
                        valueTaxSelected = parseInt(row.querySelector('.table-row-tax').options[row.querySelector('.table-row-tax').selectedIndex].getAttribute('data-value'));
                        if (valuePrice && valueQuantity) {
                            valueSubtotal = (valuePrice * valueQuantity);
                            if (valueTaxSelected) {
                                valueTaxAmount = ((valueSubtotal * valueTaxSelected) / 100);
                            }
                        }
                        // let order = row.querySelector('.table-row-order');
                        // if (order) {
                        //     valueOrder = order.innerHTML;
                        // }
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
                        loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID, valueUOM);
                        loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID, valueTax);
                    }
                }
                // update total
                calculateClass.updateTotal(tableCost[0], false, true, false);
            }
        });

// ******** Action on change data of table row COST => calculate data for row & calculate data total
        tableCost.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function (e) {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                // loadDataProductSelect($(this));
            }
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
            // if option copy is custom (choose product & quantity)
            if (divCopyOption[0].querySelector('.check-option').checked === false) {
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
                                data['product_quantity'] = parseInt(quantyInput);
                                order++
                                data['order'] = order;
                                result.push(data);
                                productCopyTo.push({'id': data.product.id, 'quantity': parseInt(quantyInput)})
                                break
                            }
                        }
                    }
                }
                dataCopy['quotation_products_data'] = result;
                dataCopyTo['option'] = 'custom';
                dataCopyTo['products'] = productCopyTo;
            } else { // if option copy is all product
                // Filter all data is not Promotion from quotation_products_data
                dataCopy['quotation_products_data'] = filterDataProductNotPromotion(dataCopy.quotation_products_data);
            }
            if (type === 'copy-from') {
                loadDataClass.loadDetailQuotation(dataCopy, true);
                // load product
                calculateClass.loadProductCopy(dataCopy, tableProduct, true, false);
                // load expense
                calculateClass.loadProductCopy(dataCopy, tableExpense, false, true);
                // Clear table COST when copy
                tableCost.DataTable().clear().draw();
                document.getElementById('quotation-create-cost-pretax-amount').innerHTML = "0";
                document.getElementById('quotation-create-cost-taxes').innerHTML = "0";
                document.getElementById('quotation-create-cost-total').innerHTML = "0";
            } else if (type === 'copy-to') {
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
                }
            }
        }
        prepareDataCopyTo();

        function loadDataCopyTo(dataCopy) {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    if (dataRaw.option === 'custom') { // if option copy is custom (choose product & quantity)
                        let products = dataRaw.products;
                        let result = [];
                        let order = 0;
                        for (let idx = 0; idx < products.length; idx++) {
                            let checkedID = products[idx].id;
                            let checkedQuantity = products[idx].quantity;
                            for (let i = 0; i < dataCopy.quotation_products_data.length; i++) {
                                let data = dataCopy.quotation_products_data[i];
                                if (data.product.id === checkedID) {
                                    data['product_quantity'] = parseInt(checkedQuantity);
                                    order++
                                    data['order'] = order;
                                    result.push(data);
                                    break
                                }
                            }
                        }
                        dataCopy['quotation_products_data'] = result;
                    } else if (dataRaw.option === 'all') { // if option copy is all product
                        // Filter all data is not Promotion from quotation_products_data
                        dataCopy['quotation_products_data'] = filterDataProductNotPromotion(dataCopy.quotation_products_data);
                    }
                    loadDataClass.loadDetailQuotation(dataCopy, true);
                    // load product
                    calculateClass.loadProductCopy(dataCopy, tableProduct, true, false);
                    // load expense
                    calculateClass.loadProductCopy(dataCopy, tableExpense, false, true);
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
        checkElementValues();

// PROMOTION
// Action on click button Check Available Promotion (show list promotions)
        $('#btn-check-promotion').on('click', function(e) {
            if (boxCustomer.val()) {
                dataTableClass.loadTableQuotationPromotion('data-init-quotation-create-promotion', boxCustomer.val())
            }
        });

// Action click Apply Promotion
        tablePromotion.on('click', '.apply-promotion', function () {
            $(this).prop('disabled', true);
            deletePromotionRows(tableProduct, true, false);
            let promotionCondition = JSON.parse($(this)[0].getAttribute('data-promotion-condition'));
            let promotionResult = getPromotionResult(promotionCondition);
            // let order = promotionResult.row_apply_index + 0.5;
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
                            reCalculateTax(tableProduct, promotionResult.discount_rate_on_order)
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
            reOrderSTT(tableProduct[0].tBodies[0], tableProduct)
        });

// SHIPPING
// Action on click button Add Shipping Fee (show list shipping)
        $('#btn-add-shipping').on('click', function(e) {
            dataTableClass.loadTableQuotationShipping('data-init-quotation-create-shipping')
        });

// Action click Apply Shipping
        tableShipping.on('click', '.apply-shipping', function () {
            $(this).prop('disabled', true);
            deletePromotionRows(tableProduct, false, true);
            // let promotionCondition = JSON.parse($(this)[0].getAttribute('data-promotion-condition'));
            // let promotionResult = getPromotionResult(promotionCondition);
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
                    "title": "Phí giao hàng nhanh"
                },
                "product_code": "",
                "product_title": "Phí giao hàng nhanh",
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
                "product_unit_price": 0,
                "product_description": "Phí giao hàng nhanh",
                "product_discount_value": 0,
                "product_subtotal_price": 0,
                "product_discount_amount": 0,
                "is_shipping": true,
                "shipping": {"id": $(this)[0].getAttribute('data-shipping-id')}
            };
            tableProduct.DataTable().row.add(dataAdd).draw()
            // ReOrder STT
            reOrderSTT(tableProduct[0].tBodies[0], tableProduct)
        });


// Submit form quotation + sale order
        $('#btn-create_quotation').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('frm_quotation_create');
            let is_sale_order = false;
            let appNotify = "Quotation";
            if ($form.classList.contains('sale-order')) {
                is_sale_order = true;
                appNotify = "Sale Order"
            }
            let _form = new SetupFormSubmit($('#frm_quotation_create'));
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
                ]
            }
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            // validate none & blank
            let check_none_blank_list = ['', "", null, "undefined"];
            if (_form.dataForm.hasOwnProperty('opportunity')) {
                if (check_none_blank_list.includes(_form.dataForm['opportunity'])) {
                    delete _form.dataForm['opportunity']
                }
            }
            let csr = $("[name=csrfmiddlewaretoken]").val()

            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                        // $.fn.notifyPopup({description: appNotify + " create fail"}, 'failure')
                    }
                )
        });




    });
});
