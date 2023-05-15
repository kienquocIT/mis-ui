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
            dataTableClass.loadTableQuotationPromotion('data-init-quotation-create-promotion')
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
                    loadDataClass.loadShippingBillingCustomer(modalShipping, modalBilling, data);
                    if (data.id && data.owner) {
                        loadDataClass.loadBoxQuotationContact('select-box-quotation-create-contact', data.owner.id, data.id);
                    }
                } else {
                    loadDataClass.loadBoxQuotationContact('select-box-quotation-create-contact');
                }
            }
            loadDataClass.loadInformationSelectBox($(this));
            // load promotion for this customer
            dataTableClass.loadTableQuotationPromotion('data-init-quotation-create-promotion')
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
                loadDataClass.loadBoxSaleOrderQuotation('select-box-quotation');
            }
        });

// Action on click button add product
        $('#btn-add-product-quotation-create').on('click', function (e) {
            e.preventDefault();
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
            $.fn.initMaskMoney2();
            loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', selectProductID);
            loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID);
        });

// Action on delete row product
        tableProduct.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            calculateClass.deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableProduct);
            calculateClass.updateTotal(tableProduct[0], true, false, false)
        });

// Action on click price list's option
        tableProduct.on('click', '.table-row-price-option', function (e) {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).val(priceValRaw);
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
            calculateClass.commonCalculate(tableProduct, row, true, false, false);
        });

// Check no negative number for input
        $('#tab-content-quotation-product').on('change', '.validated-number', function (e) {
            let value = this.value;
            // Remove unnecessary zeros from the integer part
            value = value.replace("-", "").replace(/^0+(?=\d)/, '');
            // Update value of input
            this.value = value;
        });

// Action on change total discount of product
        $('#quotation-create-product-discount').on('change', function (e) {
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
            $.fn.initMaskMoney2();
            loadDataClass.loadBoxQuotationExpense('data-init-quotation-create-tables-expense', selectExpenseID);
            loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID)
        });

// Action on delete row expense
        tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            calculateClass.deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableExpense);
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
            let tableEmpty = tableProduct[0].querySelector('.dataTables_empty');
            if (!tableEmpty) {
                // clear table
                let tableCost = $('#datable-quotation-create-cost');
                tableCost.DataTable().clear();
                document.getElementById('quotation-create-cost-pretax-amount').innerHTML = "0";
                document.getElementById('quotation-create-cost-taxes').innerHTML = "0";
                document.getElementById('quotation-create-cost-total').innerHTML = "0";
                // copy data
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
                    let valueOrder = "";
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
                                valuePrice = parseFloat(product_data_json.cost_price);
                                product_data = JSON.stringify(product_data_json).replace(/"/g, "&quot;");
                            }
                            if (optionSelected.querySelector('.data-info')) {
                                let dataStrJson = JSON.parse(optionSelected.querySelector('.data-info').value);
                                productDataStr = JSON.stringify(dataStrJson).replace(/"/g, "&quot;");
                            }
                        }
                        optionProduct = `<option value="${valueProduct}" selected></option>`
                    }
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
                    let order = row.querySelector('.table-row-order');
                    if (order) {
                        valueOrder = order.innerHTML;
                    }
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
                    let addRow = tableCost.DataTable().row.add(dataAdd).draw();
                    let newRow = tableCost.DataTable().row(addRow).node();
                    let $newRow = $(newRow);
                    $.fn.initMaskMoney2();
                    loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', selectProductID, valueProduct);
                    loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID, valueUOM);
                    loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID, valueTax);
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

// Submit form quotation
        $('#btn-create_quotation').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('frm_quotation_create');
            let is_sale_order = false;
            if ($form.classList.contains('sale-order')) {
                is_sale_order = true;
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
                        $.fn.notifyPopup({description: "Quotation create fail"}, 'failure')
                    }
                )
        });




    });
});
