"use strict";

$(function () {

    $(document).ready(function () {

        loadBoxQuotationSalePerson('select-box-quotation-sale-person');
        dataTableProduct([],'datable-quotation-create-product');
        dataTableCost([], 'datable-quotation-create-cost');
        dataTableExpense([], 'datable-quotation-create-expense');
        $("#select-box-quotation-term-price").select2();
        $("#select-box-quotation-term-discount").select2();
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
            let dataAdd =
                {
                    'product': `<div class="row">
                                    <select class="form-select quotation-product-product" required>
                                        <option value=""></option>
                                        <option value="">Laptop HP</option>
                                        <option value="">Laptop Dell</option>
                                        <option value="">Laptop Lenovo</option>
                                    </select>
                                </div>`,
                    'description': `<div class="row"><input type="text" class="form-control quotation-product-description"></div>`,
                    'unit_of_measure': `<div class="row">
                                            <select class="form-select quotation-product-uom" required>
                                                <option value=""></option>
                                                <option value="">Item</option>
                                                <option value="">Box</option>
                                            </select>
                                        </div>`,
                    'quantity': `<div class="row"><input type="text" class="form-control quotation-product-quantity" required></div>`,
                    'unit_price': `<div class="row"><input type="text" class="form-control quotation-product-unit-price" required></div>`,
                    'tax': `<div class="row">
                                <select class="form-select quotation-product-tax" data-tax-amount="">
                                    <option value=""></option>
                                    <option value="10">Vat-10</option>
                                    <option value="5">Vat-5</option>
                                    <option value="20">Vat-20</option>
                                </select>
                            </div>`,
                    'order': `<span class="product-order">${order}</span>`
                }
            tableProduct.DataTable().row.add(dataAdd).draw();
        });

// Action on delete row product
        tableProduct.on('click', '.del-product', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let currentRow = $(this).closest('tr');
            let tableBody = $(this)[0].closest('tbody');
            currentRow.remove();
            let order = 0;
            for (let idx = 0; idx < tableBody.rows.length; idx++) {
                order++;
                let productOrder = tableBody.rows[idx].querySelector('.product-order');
                if (productOrder) {
                    productOrder.innerHTML = order;
                }
            }
            updateTotal(tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', '.quotation-product-subtotal', '.quotation-product-tax', true, true);
            return false;
        });

// Action on change product quantity
        tableProduct.on('change', '.quotation-product-quantity', function (e) {
            let quantity = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let price = row.querySelector('.quotation-product-unit-price');
            if (price) {
                if (price.value && quantity) {
                    let subtotal = (Number(quantity) * Number(price.value));
                    let eleTotal = row.querySelector('.quotation-product-subtotal')
                    if (eleTotal) {
                        eleTotal.innerHTML = subtotal;
                        eleTotal.setAttribute('data-value', String(subtotal));
                    }
                }
            }
            updateTotal(tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', '.quotation-product-subtotal', '.quotation-product-tax', true, false);
        });

// Action on change product unit price
        tableProduct.on('change', '.quotation-product-unit-price', function (e) {
            let price = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let quantity = row.querySelector('.quotation-product-quantity');
            if (quantity) {
                if (quantity.value && price) {
                    let subtotal = (Number(price) * Number(quantity.value));
                    let eleTotal = row.querySelector('.quotation-product-subtotal')
                    if (eleTotal) {
                        eleTotal.innerHTML = subtotal;
                        eleTotal.setAttribute('data-value', String(subtotal));
                    }
                }
            }
            updateTotal(tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', '.quotation-product-subtotal', '.quotation-product-tax',true, false);
        });

// Action on change product tax
        tableProduct.on('change', '.quotation-product-tax', function (e) {
            let tax = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let subtotal = row.querySelector('.quotation-product-subtotal');
            if (subtotal) {
                let subtotalVal = subtotal.getAttribute('data-value');
                if (subtotalVal && tax) {
                    let taxAmount = ((Number(subtotalVal) * Number(tax))/100);
                    $(this)[0].setAttribute('data-tax-amount', String(taxAmount))
                }
            }
            updateTotal(tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', '.quotation-product-subtotal', '.quotation-product-tax', false, true);
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
            let dataAdd =
                {
                    'expense': `<div class="row">
                                    <select class="form-select quotation-expense-expense" required>
                                        <option value=""></option>
                                        <option value="">Laptop HP</option>
                                        <option value="">Laptop Dell</option>
                                        <option value="">Laptop Lenovo</option>
                                    </select>
                                </div>`,
                    'unit_of_measure': `<div class="row">
                                            <select class="form-select quotation-expense-uom" required>
                                                <option value=""></option>
                                                <option value="">Item</option>
                                                <option value="">Box</option>
                                            </select>
                                        </div>`,
                    'quantity': `<div class="row"><input type="text" class="form-control quotation-expense-quantity" required></div>`,
                    'expense_price': `<div class="row"><input type="text" class="form-control quotation-expense-price" required></div>`,
                    'tax': `<div class="row">
                                <select class="form-select quotation-expense-tax" data-tax-amount="">
                                    <option value=""></option>
                                    <option value="10">Vat-10</option>
                                    <option value="5">Vat-5</option>
                                    <option value="20">Vat-20</option>
                                </select>
                            </div>`,
                    'order': `<span class="expense-order">${order}</span>`
                }
            tableExpense.DataTable().row.add(dataAdd).draw();
        });

// Action on delete row expense
        tableExpense.on('click', '.del-expense', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let currentRow = $(this).closest('tr');
            let tableBody = $(this)[0].closest('tbody');
            currentRow.remove();
            let order = 0;
            for (let idx = 0; idx < tableBody.rows.length; idx++) {
                order++;
                let expenseOrder = tableBody.rows[idx].querySelector('.expense-order');
                if (expenseOrder) {
                    expenseOrder.innerHTML = order;
                }
            }
            updateTotal(tableExpense[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total', '.quotation-expense-subtotal', '.quotation-expense-tax', true, true);
            return false;
        });

// Action on change expense quantity
        tableExpense.on('change', '.quotation-expense-quantity', function (e) {
            let quantity = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let price = row.querySelector('.quotation-expense-price');
            if (price) {
                if (price.value && quantity) {
                    let subtotal = (Number(quantity) * Number(price.value));
                    let eleTotal = row.querySelector('.quotation-expense-subtotal')
                    if (eleTotal) {
                        eleTotal.innerHTML = subtotal;
                        eleTotal.setAttribute('data-value', String(subtotal));
                    }
                }
            }
            updateTotal(tableExpense[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total', '.quotation-expense-subtotal', '.quotation-expense-tax', true, false);
        });

// Action on change expense price
        tableExpense.on('change', '.quotation-expense-price', function (e) {
            let price = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let quantity = row.querySelector('.quotation-expense-quantity');
            if (quantity) {
                if (quantity.value && price) {
                    let subtotal = (Number(price) * Number(quantity.value));
                    let eleTotal = row.querySelector('.quotation-expense-subtotal')
                    if (eleTotal) {
                        eleTotal.innerHTML = subtotal;
                        eleTotal.setAttribute('data-value', String(subtotal));
                    }
                }
            }
            updateTotal(tableExpense[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total', '.quotation-expense-subtotal', '.quotation-expense-tax', true, false);
        });

// Action on change product tax
        tableExpense.on('change', '.quotation-expense-tax', function (e) {
            let tax = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let subtotal = row.querySelector('.quotation-expense-subtotal');
            if (subtotal) {
                let subtotalVal = subtotal.getAttribute('data-value');
                if (subtotalVal && tax) {
                    let taxAmount = ((Number(subtotalVal) * Number(tax)) / 100);
                    $(this)[0].setAttribute('data-tax-amount', String(taxAmount))
                }
            }
            updateTotal(tableExpense[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total', '.quotation-expense-subtotal', '.quotation-expense-tax', false, true);
        });

// Action on click tab cost (clear table cost & copy product data -> cost data)
        $('#quotation-tabs').on('click', '.quotation-cost', function (e) {
            let tableEmpty = tableProduct[0].querySelector('.dataTables_empty');
            if (!tableEmpty) {
                // clear table
                let tableCost = $('#datable-quotation-create-cost');
                tableCost.DataTable().clear();
                // copy data
                let valueProduct = "";
                let showProduct = "";
                let valueUOM = "";
                let showUOM = "";
                let valueQuantity = "";
                let optionTax = ``;
                let valueOrder = "";
                for (let i = 0; i < tableProduct[0].tBodies[0].rows.length; i++) {
                    let row = tableProduct[0].tBodies[0].rows[i];
                    let product = row.querySelector('.quotation-product-product');
                    if (product) {
                        valueProduct = product.value;
                        showProduct = product.options[product.selectedIndex].text;
                    }
                    let uom = row.querySelector('.quotation-product-uom');
                    if (uom) {
                        valueUOM = uom.value;
                        showUOM = uom.options[uom.selectedIndex].text;
                    }
                    let quantity = row.querySelector('.quotation-product-quantity');
                    if (quantity) {
                        valueQuantity = quantity.value;
                    }
                    let tax = row.querySelector('.quotation-product-tax');
                    if (tax) {
                        for (let t = 0; t < tax.options.length; t++) {
                            let option = tax.options[t];
                            if (option.selected === true) {
                                optionTax += `<option value="${option.value}" selected>${option.text}</option>`
                            } else {
                                optionTax += `<option value="${option.value}">${option.text}</option>`
                            }
                        }
                    }
                    let order = row.querySelector('.product-order');
                    if (order) {
                        valueOrder = order.innerHTML;
                    }

                    let dataAdd =
                        {
                            'product': `<div class="row">
                                            <select class="form-select quotation-cost-product" disabled>
                                                <option value="${valueProduct}" selected>${showProduct}</option>
                                            </select>
                                        </div>`,
                            'unit_of_measure': `<div class="row">
                                                    <select class="form-select quotation-cost-uom" disabled>
                                                        <option value="${valueUOM}" selected>${showUOM}</option>
                                                    </select>
                                                </div>`,
                            'quantity': `<div class="row"><input type="text" class="form-control quotation-cost-quantity" value="${valueQuantity}" disabled></div>`,
                            'cost_price': `<div class="row"><input type="text" class="form-control quotation-cost-price" required></div>`,
                            'tax': `<div class="row">
                                        <select class="form-select quotation-cost-tax" data-tax-amount="">${optionTax}</select>
                                    </div>`,
                            'order': `<span class="cost-order">${valueOrder}</span>`
                        }
                    tableCost.DataTable().row.add(dataAdd).draw();
                }
            }
        });

// Action on change cost price
        tableCost.on('change', '.quotation-cost-price', function (e) {
            let price = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let quantity = row.querySelector('.quotation-cost-quantity');
            if (quantity) {
                if (quantity.value && price) {
                    let subtotal = (Number(price) * Number(quantity.value));
                    let eleTotal = row.querySelector('.quotation-cost-subtotal')
                    if (eleTotal) {
                        eleTotal.innerHTML = subtotal;
                        eleTotal.setAttribute('data-value', String(subtotal));
                    }
                }
            }
            updateTotal(tableCost[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total', '.quotation-cost-subtotal', '.quotation-cost-tax', true, false);
        });

// Action on change cost tax
        tableCost.on('change', '.quotation-cost-tax', function (e) {
            let tax = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let subtotal = row.querySelector('.quotation-cost-subtotal');
            if (subtotal) {
                let subtotalVal = subtotal.getAttribute('data-value');
                if (subtotalVal && tax) {
                    let taxAmount = ((Number(subtotalVal) * Number(tax)) / 100);
                    $(this)[0].setAttribute('data-tax-amount', String(taxAmount))
                }
            }
            updateTotal(tableCost[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total', '.quotation-cost-subtotal', '.quotation-cost-tax', false, true);
        });


    });
});
