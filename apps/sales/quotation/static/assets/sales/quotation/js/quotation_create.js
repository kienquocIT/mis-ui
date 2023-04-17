"use strict";

$(function () {

    $(document).ready(function () {

        loadBoxQuotationSalePerson('select-box-quotation-create-sale-person');
        loadBoxQuotationCustomer('select-box-quotation-create-customer');
        loadInitQuotationProduct('data-init-quotation-create-tables-product');
        loadInitQuotationUOM('data-init-quotation-create-tables-uom');
        loadInitQuotationTax('data-init-quotation-create-tables-tax');
        dataTableProduct([],'datable-quotation-create-product');
        dataTableCost([], 'datable-quotation-create-cost');
        dataTableExpense([], 'datable-quotation-create-expense');
        $("#select-box-quotation-term-price").select2();
        $("#select-box-quotation-term-discount").select2();

        $('input[name="date_created"]').daterangepicker({
			singleDatePicker: true,
			timePicker: true,
			showDropdowns: true,
			minYear: 1901,
			"cancelClass": "btn-secondary",
			maxYear: parseInt(moment().format('YYYY'),10)
			}, function(start, end, label) {
			var years = moment().diff(start, 'years');
			alert("You are " + years + " years old!");
		});

        let popoverOppTriggerList = document.querySelectorAll('.popover-opp');
        let popoverOppList = [...popoverOppTriggerList].map(popoverTriggerEl => {
            let popoverContent = `<div class="row"><span><b><i>Code</i></b></span><span class="ml-1">ABC</span></div>`;
            popoverTriggerEl.setAttribute('data-bs-content', popoverContent);
            popoverTriggerEl.setAttribute('data-bs-html', 'true');
            return new bootstrap.Popover(popoverTriggerEl);
        });

        let popoverCustomerTriggerList = document.querySelectorAll('.popover-customer');


        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');

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
            let dataAdd =
                {
                    'product': `<div class="row">
                                    <select class="form-select table-row-item" id="${selectProductID}" required>
                                        <option value=""></option>
                                    </select>
                                </div>`,
                    'description': `<div class="row"><input type="text" class="form-control table-row-description"></div>`,
                    'unit_of_measure': `<div class="row">
                                            <select class="form-select table-row-uom" id="${selectUOMID}" required>
                                                <option value=""></option>
                                            </select>
                                        </div>`,
                    'quantity': `<div class="row"><input type="text" class="form-control table-row-quantity" required></div>`,
                    'unit_price': `<div class="row"><input type="text" class="form-control w-85 table-row-price" required><span class="w-5 mt-2 quotation-currency">VND</span></div>`,
                    'tax': `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value=""></option>
                                </select>
                                <input type="hidden" class="table-row-tax-amount">
                            </div>`,
                    'subtotal': `<div class="row"><input type="text" class="form-control w-85 table-row-subtotal" disabled><span class="w-5 mt-2 quotation-currency">VND</span></div>`,
                    'order': `<span class="table-row-order">${order}</span>`
                }
            tableProduct.DataTable().row.add(dataAdd).draw();
            loadBoxQuotationProduct('data-init-quotation-create-tables-product', selectProductID);
            loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
            loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID)
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
            let productData = optionSelected.querySelector('.product-data');
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
                }
                if (tax) {
                    tax.value = data.tax.id;
                }
            }
        });

// Action on change product quantity
        tableProduct.on('change', '.table-row-quantity', function (e) {
            changeQuantity($(this)[0].value, $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total');
        });

// Action on change product price
        tableProduct.on('change', '.table-row-price', function (e) {
            changePrice($(this)[0].value, $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total');
        });

// Action on change product tax
        tableProduct.on('change', '.table-row-tax', function (e) {
            let optionSelected = $(this)[0].options[$(this)[0].selectedIndex];
            changeTax(optionSelected.getAttribute('data-value'), $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total');
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
            let dataAdd =
                {
                    'expense': `<div class="row">
                                    <select class="form-select table-row-item" required>
                                        <option value=""></option>
                                        <option value="">Laptop HP</option>
                                        <option value="">Laptop Dell</option>
                                        <option value="">Laptop Lenovo</option>
                                    </select>
                                </div>`,
                    'unit_of_measure': `<div class="row">
                                            <select class="form-select table-row-uom" id="${selectUOMID}" required>
                                                <option value=""></option>
                                            </select>
                                        </div>`,
                    'quantity': `<div class="row"><input type="text" class="form-control table-row-quantity" required></div>`,
                    'expense_price': `<div class="row"><input type="text" class="form-control w-85 table-row-price" required><span class="w-5 mt-2 quotation-currency">VND</span></div>`,
                    'tax': `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value=""></option>
                                </select>
                                <input type="hidden" class="table-row-tax-amount">
                            </div>`,
                    'subtotal': `<div class="row"><input type="text" class="form-control w-85 table-row-subtotal" disabled><span class="w-5 mt-2 quotation-currency">VND</span></div>`,
                    'order': `<span class="table-row-order">${order}</span>`
                }
            tableExpense.DataTable().row.add(dataAdd).draw();
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
                            if (optionSelected.querySelector('.product-data')) {
                                let data = JSON.parse(optionSelected.querySelector('.product-data').value);
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
                    let dataAdd =
                        {
                            'product': `<div class="row">
                                            <select class="form-select table-row-item" disabled>
                                                <option value="${valueProduct}" selected>${showProduct}</option>
                                            </select>
                                        </div>`,
                            'unit_of_measure': `<div class="row">
                                                    <select class="form-select table-row-uom" disabled>
                                                        <option value="${valueUOM}" selected>${showUOM}</option>
                                                    </select>
                                                </div>`,
                            'quantity': `<div class="row"><input type="text" class="form-control table-row-quantity" value="${valueQuantity}" disabled></div>`,
                            'cost_price': `<div class="row"><input type="text" class="form-control w-85 table-row-price" value="${valuePrice}" required><span class="w-5 mt-2 quotation-currency">VND</span></div>`,
                            'tax': `<div class="row">
                                        <select class="form-select table-row-tax">${optionTax}</select>
                                        <input type="hidden" class="table-row-tax-amount" value="${valueTaxAmount}">
                                    </div>`,
                            'subtotal': `<div class="row"><input type="text" class="form-control w-85 table-row-subtotal" value="${valueSubtotal}" disabled><span class="w-5 mt-2 quotation-currency">VND</span></div>`,
                            'order': `<span class="table-row-order">${valueOrder}</span>`
                        }
                    tableCost.DataTable().row.add(dataAdd).draw();
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

// Action on change dropdown account
        $('#select-box-quotation-create-customer').on('change', function (e) {
            let optionSelected = $(this)[0].options[$(this)[0].selectedIndex];
            if (optionSelected) {
                let eleDataCustomer = optionSelected.querySelector('.account-data');
                if (eleDataCustomer) {
                    let tmp = eleDataCustomer.value;
                    let data = JSON.parse(eleDataCustomer.value);
                    let info = ``;
                    for (let key in data) {
                        info += `<div class="row"><span><b><i>${key}</i></b></span><span class="ml-1">${data[key]}</span></div>`;
                    }
                    let popoverCustomerList = [...popoverCustomerTriggerList].map(popoverTriggerEl => {
                        popoverTriggerEl.setAttribute('data-bs-content', info);
                        popoverTriggerEl.setAttribute('data-bs-html', 'true');
                        return new bootstrap.Popover(popoverTriggerEl);
                    });
                }
            }
        });


    });
});
