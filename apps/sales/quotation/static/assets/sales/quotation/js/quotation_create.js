"use strict";

$(function () {

    $(document).ready(function () {

        $(".select2").select2();

        let boxOpportunity = $('#select-box-quotation-create-opportunity');
        let boxCustomer = $('#select-box-quotation-create-customer');
        let boxContact = $('#select-box-quotation-create-contact');
        let boxSalePerson = $('#select-box-quotation-create-sale-person');
        let boxPriceList = $('#select-box-quotation-create-price-list');
        let boxPaymentTerm = $('#select-box-quotation-create-payment-term');
        let tabPrice = $('#tab_terms');
        loadBoxQuotationSalePerson('select-box-quotation-create-sale-person');
        loadInitQuotationProduct('data-init-quotation-create-tables-product');
        loadInitQuotationUOM('data-init-quotation-create-tables-uom');
        loadInitQuotationTax('data-init-quotation-create-tables-tax');

        dataTableProduct([],'datable-quotation-create-product');
        dataTableCost([], 'datable-quotation-create-cost');
        dataTableExpense([], 'datable-quotation-create-expense');
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
                loadBoxQuotationOpportunity('select-box-quotation-create-opportunity');
            }
        });

// Action on change dropdown opportunity
        boxOpportunity.on('change', function (e) {
            let eleData = $(this)[0].options[$(this)[0].selectedIndex].querySelector('.data-default');
            if (eleData) {
                let data = JSON.parse(eleData.value);
                if (data.customer) {
                    let valueToSelect = data.customer.id;
                    loadBoxQuotationCustomer('select-box-quotation-create-customer', valueToSelect, modalShipping, modalBilling);
                }
            } else {
                loadBoxQuotationCustomer('select-box-quotation-create-customer', null, modalShipping, modalBilling);
                loadBoxQuotationContact('select-box-quotation-create-contact');
            }
            loadInformationSelectBox($(this));
        });

// Action on click dropdown customer
        boxCustomer.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadBoxQuotationCustomer('select-box-quotation-create-customer', null, modalShipping, modalBilling);
            }
        });

// Action on change dropdown customer
        boxCustomer.on('change', function (e) {
            let optionSelected = boxCustomer[0].options[boxCustomer[0].selectedIndex];
            if (optionSelected) {
                loadShippingBillingCustomer(modalShipping, modalBilling);
                if (optionSelected.querySelector('.data-default')) {
                    let data = JSON.parse(optionSelected.querySelector('.data-default').value);
                    loadShippingBillingCustomer(modalShipping, modalBilling, data);
                    if (data.id && data.owner) {
                        loadBoxQuotationContact('select-box-quotation-create-contact', data.owner.id, data.id);
                    }
                } else {
                    loadBoxQuotationContact('select-box-quotation-create-contact');
                }
            }
            loadInformationSelectBox($(this));
        });

// Action on click dropdown contact
        boxContact.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadBoxQuotationContact('select-box-quotation-create-contact');
            }
        });

// Action on change dropdown contact
        boxContact.on('change', function (e) {
            loadInformationSelectBox($(this));
        });

// Action on click dropdown sale person
//         boxSalePerson.on('click', function(e) {
//             if (!$(this)[0].innerHTML) {
//                 loadBoxQuotationSalePerson('select-box-quotation-create-sale-person');
//             }
//         });

// Action on change dropdown sale person
        boxSalePerson.on('change', function (e) {
            loadInformationSelectBox($(this));
        });

// Action on click dropdown price list
        tabPrice.on('click', function(e) {
            if (!boxPriceList[0].innerHTML) {
                loadBoxQuotationPrice('select-box-quotation-create-price-list');
            }
        });

// Action on click dropdown payment term
        boxPaymentTerm.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadBoxQuotationPaymentTerm('select-box-quotation-create-payment-term');
            }
        });

// Action on change dropdown payment term
        boxPaymentTerm.on('change', function(e) {
            loadInformationSelectBox($(this));
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
            let addRow = tableProduct.DataTable().row.add({
                'order': order,
                'selectProductID': selectProductID,
                'selectUOMID': selectUOMID,
                'selectTaxID': selectTaxID
            }).draw();
            let newRow = tableProduct.DataTable().row(addRow).node();
            let $newRow = $(newRow);
            init_mask_money_single($newRow);
            loadBoxQuotationProduct('data-init-quotation-create-tables-product', selectProductID);
            loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID);
        });

// Action on delete row product
        tableProduct.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableProduct, 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total');
        });

// Action on click price list's option
        tableProduct.on('click', '.table-row-price-option', function (e) {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    elePrice.value = priceValRaw;
                    $(elePrice).maskMoney('mask', priceValRaw);
                    commonCalculate(tableProduct, row, true, false, false);
                }
            }
        });

// ******** Action on change data of table row PRODUCT => calculate data for row & calculate data total
        tableProduct.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax, .table-row-discount', function (e) {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                loadDataProductSelect($(this));
            }
            commonCalculate(tableProduct, row, true, false, false);
        });

// Action on change total discount of product
        $('#quotation-create-product-discount').on('change', function (e) {
            for (let i = 0; i < tableProduct[0].tBodies[0].rows.length; i++) {
                let row = tableProduct[0].tBodies[0].rows[i];
                commonCalculate(tableProduct, row, true, false, false)
            }
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
            let addRow = tableExpense.DataTable().row.add({
                'selectUOMID': selectUOMID,
                'selectTaxID': selectTaxID,
                'order': order
            }).draw();
            let newRow = tableExpense.DataTable().row(addRow).node();
            let $newRow = $(newRow);
            init_mask_money_single($newRow);
            loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID)
        });

// Action on delete row expense
        tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableExpense, 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total');
        });

// ******** Action on change data of table row EXPENSE => calculate data for row & calculate data total
        tableExpense.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function (e) {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                // loadDataProductSelect($(this));
            }
            commonCalculate(tableExpense, row, false, false, true);
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

                    let valueQuantity = "";
                    let valuePrice = "";
                    let taxDataStr = "";
                    let valueTaxSelected = "";
                    let valueTaxAmount = "";
                    let valueOrder = "";
                    let valueSubtotal = "";
                    let row = tableProduct[0].tBodies[0].rows[i];
                    let product = row.querySelector('.table-row-item');
                    if (product) {
                        valueProduct = product.value;
                        let optionSelected = product.options[product.selectedIndex];
                        if (optionSelected) {
                            showProduct = optionSelected.text;
                            if (optionSelected.querySelector('.data-default')) {
                                let product_data_json = JSON.parse(optionSelected.querySelector('.data-default').value);
                                valuePrice = product_data_json.cost_price;
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
                        valueQuantity = quantity.value;
                    }
                    let order = row.querySelector('.table-row-order');
                    if (order) {
                        valueOrder = order.innerHTML;
                    }

                    let addRow = tableCost.DataTable().row.add({
                        'valueQuantity': valueQuantity,
                        'valuePrice': valuePrice,
                        'valueSubtotal': valueSubtotal,
                        'valueOrder': valueOrder
                    }).draw();
                    let newRow = tableCost.DataTable().row(addRow).node();
                    let $newRow = $(newRow);
                    init_mask_money_single($newRow);
                    let rowProduct = $newRow[0].querySelector('.table-row-item');
                    if (rowProduct) {
                        $(rowProduct).append(`<option value="${valueProduct}" selected>
                                                    <span class="product-title">${showProduct}</span>
                                                    <input type="hidden" class="data-default" value="${product_data}">
                                                    <input type="hidden" class="data-info" value="${productDataStr}">
                                                </option>`)
                        loadInformationSelectBox($(rowProduct))
                    }
                    let rowUOM = $newRow[0].querySelector('.table-row-uom');
                    if (rowUOM) {
                        $(rowUOM).append(`<option value="${valueUOM}" selected>
                                                <span class="uom-title">${showUOM}</span>
                                                <input type="hidden" class="data-info" value="${uomDataStr}">
                                        </option>`)
                    }
                    let rowTax = $newRow[0].querySelector('.table-row-tax');
                    if (rowTax) {
                        let tax = row.querySelector('.table-row-tax');
                        if (tax) {
                            for (let t = 0; t < tax.options.length; t++) {
                                let option = tax.options[t];
                                if (option.querySelector('.data-info')) {
                                        let dataStrJson = JSON.parse(option.querySelector('.data-info').value);
                                        taxDataStr = JSON.stringify(dataStrJson).replace(/"/g, "&quot;");
                                    }
                                if (option.selected === true) {
                                    $(rowTax).append(`<option value="${option.value}" data-value="${option.getAttribute('data-value')}" selected>
                                                        <span class="tax-title">${option.text}</span>
                                                        <input type="hidden" class="data-info" value="${taxDataStr}">
                                                    </option>`)
                                    valueTaxSelected = option.value;
                                } else {
                                    $(rowTax).append(`<option value="${option.value}" data-value="${option.getAttribute('data-value')}">
                                                        <span class="tax-title">${option.text}</span>
                                                        <input type="hidden" class="data-info" value="${taxDataStr}">
                                                    </option>`)
                                }
                            }
                        }
                    }
                    let rowTaxAmount = $newRow[0].querySelector('.table-row-tax-amount');
                    if (rowTaxAmount) {
                        if (valuePrice && valueQuantity) {
                            valueSubtotal = (Number(valuePrice) * Number(valueQuantity));
                            if (valueTaxSelected) {
                                valueTaxAmount = ((valueSubtotal * Number(valueTaxSelected)) / 100);
                                rowTaxAmount.value = valueTaxAmount;
                                $(rowTaxAmount).maskMoney('mask', valueTaxAmount)
                            }
                        }
                    }

                }
                // update total
                updateTotal(tableCost[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total');
            }
        });

// ******** Action on change data of table row COST => calculate data for row & calculate data total
        tableCost.on('change', '.table-row-item, .table-row-quantity, .table-row-price, .table-row-tax', function (e) {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                // loadDataProductSelect($(this));
            }
            commonCalculate(tableCost, row, false, true, false);
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
            let _form = new SetupFormSubmit($('#frm_quotation_create'));
            setupDataSubmit(_form);
            let submitFields = [
                'title',
                'opportunity',
                'customer',
                'contact',
                'sale_person',
                'total_product_pretax_amount',
                'total_product_discount',
                'total_product_tax',
                'total_product',
                'total_cost_pretax_amount',
                'total_cost_tax',
                'total_cost',
                'total_expense_pretax_amount',
                'total_expense_tax',
                'total_expense',
                'quotation_products_data',
                'quotation_term_data',
                'quotation_logistic_data',
                'quotation_costs_data',
                'quotation_expenses_data',
                'is_customer_confirm',
            ]
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
