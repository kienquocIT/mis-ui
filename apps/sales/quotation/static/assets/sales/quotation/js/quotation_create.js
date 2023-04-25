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
        loadInitQuotationProduct('data-init-quotation-create-tables-product');
        loadInitQuotationUOM('data-init-quotation-create-tables-uom');
        loadInitQuotationTax('data-init-quotation-create-tables-tax');

        dataTableProduct([],'datable-quotation-create-product');
        dataTableCost([], 'datable-quotation-create-cost');
        dataTableExpense([], 'datable-quotation-create-expense');
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');

        $("#select-box-quotation-term-discount").select2();

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
                loadInformationSelectBox($(this));
                let data = JSON.parse(eleData.value);
                if (data.customer) {
                    let valueToSelect = data.customer.id;
                    if (!boxCustomer[0].innerHTML) {
                        loadBoxQuotationCustomer('select-box-quotation-create-customer', valueToSelect);
                    } else {
                        let optionSelectedCustomer = boxCustomer[0].options[boxCustomer[0].selectedIndex];
                        if (optionSelectedCustomer) {
                            optionSelectedCustomer.removeAttribute('selected');
                        }
                        for (let option of boxCustomer[0].options) {
                            if (option.value === valueToSelect) {
                                option.setAttribute('selected', true);
                                break;
                            }
                        }
                        loadInformationSelectBox(boxCustomer);
                    }
                }
            }
        });

// Action on click dropdown customer
        boxCustomer.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadBoxQuotationCustomer('select-box-quotation-create-customer');
            }
        });

// Action on change dropdown customer
        boxCustomer.on('change', function (e) {
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
        boxSalePerson.on('click', function(e) {
            if (!$(this)[0].innerHTML) {
                loadBoxQuotationSalePerson('select-box-quotation-create-sale-person');
            }
        });

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

// Action on change product
        tableProduct.on('change', '.table-row-item', function (e) {
            let optionSelected = $(this)[0].options[$(this)[0].selectedIndex];
            let productData = optionSelected.querySelector('.data-default');
            if (productData) {
                let data = JSON.parse(productData.value);
                let uom = $(this)[0].closest('tr').querySelector('.table-row-uom');
                let price = $(this)[0].closest('tr').querySelector('.table-row-price');
                let tax = $(this)[0].closest('tr').querySelector('.table-row-tax');
                if (uom) {
                    uom.value = data.unit_of_measure.id;
                }
                if (price) {
                    price.value = data.unit_price;
                    $(price).maskMoney('mask', parseFloat(data.unit_price));
                    let priceVal = $(price).valCurrency();
                    changePrice(priceVal, $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount');
                }
                if (tax) {
                    tax.value = data.tax.id;
                    changeTax(data.tax.rate, $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount');
                }
            loadInformationSelectBox($(this));
            }
        });

// Action on change product quantity
        tableProduct.on('change', '.table-row-quantity', function (e) {
            changeQuantity($(this)[0].value, $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount');
        });

// Action on change product price
        tableProduct.on('change', '.table-row-price', function (e) {
            let price = $(this).valCurrency();
            if (price) {
                changePrice(price, $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount');
            }
        });

// Action on change product tax
        tableProduct.on('change', '.table-row-tax', function (e) {
            let optionSelected = $(this)[0].options[$(this)[0].selectedIndex];
            changeTax(optionSelected.getAttribute('data-value'), $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount');
        });

// Action on change product tax
        tableProduct.on('change', '.table-row-discount', function (e) {
            changeDiscount($(this)[0].value, $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount')
        });

// Action on change total discount of product
        $('#quotation-create-product-discount').on('change', function(e) {
            updateDiscountTotal($(this)[0].value, 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount')
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

// Action on change expense quantity
        tableExpense.on('change', '.table-row-quantity', function (e) {
            changeQuantity($(this)[0].value, $(this)[0].closest('tr'), tableExpense[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total');
        });

// Action on change expense price
        tableExpense.on('change', '.table-row-price', function (e) {
            changePrice($(this)[0].value, $(this)[0].closest('tr'), tableExpense[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total');
        });

// Action on change expense tax
        tableExpense.on('change', '.table-row-tax', function (e) {
            let optionSelected = $(this)[0].options[$(this)[0].selectedIndex];
            changeTax(optionSelected.getAttribute('data-value'), $(this)[0].closest('tr'), tableExpense[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total');
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
                    let valueUOM = "";
                    let showUOM = "";
                    let valueQuantity = "";
                    let valuePrice = "";
                    let optionTax = ``;
                    let valueTaxSelected = "";
                    let valueTaxAmount = "";
                    let valueOrder = "";
                    let valueSubtotal = "";
                    let row = tableProduct[0].tBodies[0].rows[i];
                    let product = row.querySelector('.table-row-item');
                    if (product) {
                        valueProduct = product.value;
                        showProduct = product.options[product.selectedIndex].text;
                        let optionSelected = product.options[product.selectedIndex];
                        if (optionSelected) {
                            if (optionSelected.querySelector('.data-default')) {
                                let data = JSON.parse(optionSelected.querySelector('.data-default').value);
                                valuePrice = data.cost_price;
                            }
                        }
                    }
                    let uom = row.querySelector('.table-row-uom');
                    if (uom) {
                        valueUOM = uom.value;
                        showUOM = uom.options[uom.selectedIndex].text;
                    }
                    let quantity = row.querySelector('.table-row-quantity');
                    if (quantity) {
                        valueQuantity = quantity.value;
                    }
                    let tax = row.querySelector('.table-row-tax');
                    if (tax) {
                        for (let t = 0; t < tax.options.length; t++) {
                            let option = tax.options[t];
                            if (option.selected === true) {
                                optionTax += `<option value="${option.value}" data-value="${option.getAttribute('data-value')}" selected>${option.text}</option>`
                                valueTaxSelected = option.value;
                            } else {
                                optionTax += `<option value="${option.value}" data-value="${option.getAttribute('data-value')}">${option.text}</option>`
                            }
                        }
                    }
                    let order = row.querySelector('.table-row-order');
                    if (order) {
                        valueOrder = order.innerHTML;
                    }
                    if (valuePrice && valueQuantity) {
                        valueSubtotal = (Number(valuePrice) * Number(valueQuantity));
                        if (valueTaxSelected) {
                            valueTaxAmount = ((valueSubtotal * Number(valueTaxSelected)) / 100)
                        }
                    }
                    let addRow = tableCost.DataTable().row.add({
                        'valueProduct': valueProduct,
                        'showProduct': showProduct,
                        'valueUOM': valueUOM,
                        'showUOM': showUOM,
                        'valueQuantity': valueQuantity,
                        'valuePrice': valuePrice,
                        'optionTax': optionTax,
                        'valueTaxAmount': valueTaxAmount,
                        'valueSubtotal': valueSubtotal,
                        'valueOrder': valueOrder
                    }).draw();
                    let newRow = tableCost.DataTable().row(addRow).node();
                    let $newRow = $(newRow);
                    init_mask_money_single($newRow);
                }
                // update total
                updateTotal(tableCost[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total');
            }
        });

// Action on change cost price
        tableCost.on('change', '.table-row-price', function (e) {
            changePrice($(this)[0].value, $(this)[0].closest('tr'), tableCost[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total');
        });

// Action on change cost tax
        tableCost.on('change', '.table-row-tax', function (e) {
            let optionSelected = $(this)[0].options[$(this)[0].selectedIndex];
            changeTax(optionSelected.getAttribute('data-value'), $(this)[0].closest('tr'), tableCost[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total');
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
