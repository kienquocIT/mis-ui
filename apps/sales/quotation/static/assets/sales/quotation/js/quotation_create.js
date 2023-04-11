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
                                    <select class="form-select table-row-item" required>
                                        <option value=""></option>
                                        <option value="">Laptop HP</option>
                                        <option value="">Laptop Dell</option>
                                        <option value="">Laptop Lenovo</option>
                                    </select>
                                </div>`,
                    'description': `<div class="row"><input type="text" class="form-control table-row-description"></div>`,
                    'unit_of_measure': `<div class="row">
                                            <select class="form-select table-row-uom" required>
                                                <option value=""></option>
                                                <option value="">Item</option>
                                                <option value="">Box</option>
                                            </select>
                                        </div>`,
                    'quantity': `<div class="row"><input type="text" class="form-control table-row-quantity" required></div>`,
                    'unit_price': `<div class="row"><input type="text" class="form-control table-row-price" required></div>`,
                    'tax': `<div class="row">
                                <select class="form-select table-row-tax">
                                    <option value=""></option>
                                    <option value="10">Vat-10</option>
                                    <option value="5">Vat-5</option>
                                    <option value="20">Vat-20</option>
                                </select>
                                <input type="hidden" class="table-row-tax-amount">
                            </div>`,
                    'order': `<span class="table-row-order">${order}</span>`
                }
            tableProduct.DataTable().row.add(dataAdd).draw();
        });

// Action on delete row product
        tableProduct.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableProduct);
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
            changeTax($(this)[0].value, $(this)[0].closest('tr'), tableProduct[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total');
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
                                    <select class="form-select table-row-item" required>
                                        <option value=""></option>
                                        <option value="">Laptop HP</option>
                                        <option value="">Laptop Dell</option>
                                        <option value="">Laptop Lenovo</option>
                                    </select>
                                </div>`,
                    'unit_of_measure': `<div class="row">
                                            <select class="form-select table-row-uom" required>
                                                <option value=""></option>
                                                <option value="">Item</option>
                                                <option value="">Box</option>
                                            </select>
                                        </div>`,
                    'quantity': `<div class="row"><input type="text" class="form-control table-row-quantity" required></div>`,
                    'expense_price': `<div class="row"><input type="text" class="form-control table-row-price" required></div>`,
                    'tax': `<div class="row">
                                <select class="form-select table-row-tax" data-tax-amount="">
                                    <option value=""></option>
                                    <option value="10">Vat-10</option>
                                    <option value="5">Vat-5</option>
                                    <option value="20">Vat-20</option>
                                </select>
                                <input type="hidden" class="table-row-tax-amount">
                            </div>`,
                    'order': `<span class="table-row-order">${order}</span>`
                }
            tableExpense.DataTable().row.add(dataAdd).draw();
        });

// Action on delete row expense
        tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow($(this).closest('tr'), $(this)[0].closest('tbody'), tableExpense);
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
            changeTax($(this)[0].value, $(this)[0].closest('tr'), tableExpense[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total');
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
                let valueProduct = "";
                let showProduct = "";
                let valueUOM = "";
                let showUOM = "";
                let valueQuantity = "";
                let optionTax = ``;
                let valueOrder = "";
                for (let i = 0; i < tableProduct[0].tBodies[0].rows.length; i++) {
                    let row = tableProduct[0].tBodies[0].rows[i];
                    let product = row.querySelector('.table-row-item');
                    if (product) {
                        valueProduct = product.value;
                        showProduct = product.options[product.selectedIndex].text;
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
                                optionTax += `<option value="${option.value}" selected>${option.text}</option>`
                            } else {
                                optionTax += `<option value="${option.value}">${option.text}</option>`
                            }
                        }
                    }
                    let order = row.querySelector('.table-row-order');
                    if (order) {
                        valueOrder = order.innerHTML;
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
                            'cost_price': `<div class="row"><input type="text" class="form-control table-row-price" required></div>`,
                            'tax': `<div class="row">
                                        <select class="form-select table-row-tax">${optionTax}</select>
                                        <input type="hidden" class="table-row-tax-amount">
                                    </div>`,
                            'order': `<span class="table-row-order">${valueOrder}</span>`
                        }
                    tableCost.DataTable().row.add(dataAdd).draw();
                }
            }
        });

// Action on change cost price
        tableCost.on('change', '.table-row-price', function (e) {
            changePrice($(this)[0].value, $(this)[0].closest('tr'), tableCost[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total');
        });

// Action on change cost tax
        tableCost.on('change', '.table-row-tax', function (e) {
            changeTax($(this)[0].value, $(this)[0].closest('tr'), tableCost[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total');
        });


    });
});
