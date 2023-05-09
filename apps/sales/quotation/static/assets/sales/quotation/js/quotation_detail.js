"use strict";

function loadTabProduct(data_list) {
    let order = 1;
    let table = $('#datable-quotation-create-product');
    for (let i = 0; i < data_list.length; i++) {
        let data = data_list[i];
        let selectProductID = 'quotation-create-product-box-product-' + String(order);
        let selectUOMID = 'quotation-create-product-box-uom-' + String(order);
        let selectTaxID = 'quotation-create-product-box-tax-' + String(order);
        let addRow = table.DataTable().row.add({
            'order': order,
            'selectProductID': selectProductID,
            'selectUOMID': selectUOMID,
            'selectTaxID': selectTaxID
        }).draw();
        let newRow = table.DataTable().row(addRow).node();
        let $newRow = $(newRow);
        loadBoxQuotationProduct('data-init-quotation-create-tables-product', selectProductID);
        loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
        loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID);
        // load product
        let rowProduct = $newRow[0].querySelector('.table-row-item');
        if (rowProduct) {
            rowProduct.setAttribute('disabled', true);
            rowProduct.classList.add('disabled-but-edit');
            for (let t = 0; t < rowProduct.options.length; t++) {
                let option = rowProduct.options[t];
                if (option.value === data.product.id) {
                    option.setAttribute('selected', true);
                    loadInformationSelectBox($(rowProduct))
                }
            }
        }
        // load description
        let rowDescription = $newRow[0].querySelector('.table-row-description');
        if (rowDescription) {
            rowDescription.setAttribute('disabled', true);
            rowDescription.classList.add('disabled-but-edit');
            rowDescription.value = data.product_description;
        }
        // load uom
        let rowUOM = $newRow[0].querySelector('.table-row-uom');
        if (rowUOM) {
            rowUOM.setAttribute('disabled', true);
            rowUOM.classList.add('disabled-but-edit');
            for (let t = 0; t < rowUOM.options.length; t++) {
                let option = rowUOM.options[t];
                if (option.value === data.unit_of_measure.id) {
                    option.setAttribute('selected', true);
                }
            }
        }
        // load quantity
        let rowQuantity = $newRow[0].querySelector('.table-row-quantity');
        if (rowQuantity) {
            rowQuantity.setAttribute('disabled', true);
            rowQuantity.classList.add('disabled-but-edit');
            rowQuantity.value = data.product_quantity;
        }
        // load price
        let rowPrice = $newRow[0].querySelector('.table-row-price');
        if (rowPrice) {
            rowPrice.setAttribute('disabled', true);
            rowPrice.classList.add('disabled-but-edit');
            rowPrice.value = data.product_unit_price;
        }
        // load discount
        let rowDiscount = $newRow[0].querySelector('.table-row-discount');
        if (rowDiscount) {
            rowDiscount.setAttribute('disabled', true);
            rowDiscount.classList.add('disabled-but-edit');
            rowDiscount.value = data.product_discount_value;
        }
        // load tax
        let rowTax = $newRow[0].querySelector('.table-row-tax');
        if (rowTax) {
            rowTax.setAttribute('disabled', true);
            rowTax.classList.add('disabled-but-edit');
            if (data.tax) {
                for (let t = 0; t < rowTax.options.length; t++) {
                    let option = rowTax.options[t];
                    if (option.value === data.tax.id) {
                        option.setAttribute('selected', true);
                    }
                }
            }
        }
        // load subtotal
        let rowSubtotal = $newRow[0].querySelector('.table-row-subtotal');
        if (rowSubtotal) {
            rowSubtotal.setAttribute('disabled', true);
            rowSubtotal.classList.add('disabled-but-edit');
            rowSubtotal.value = data.product_subtotal_price;
        }
        init_mask_money_single($newRow);
        order++;
    }
}

function loadTabCost(data_list) {
    let order = 1;
    let table = $('#datable-quotation-create-cost');
    for (let i = 0; i < data_list.length; i++) {
        let data = data_list[i];
        let valueQuantity = data.product_quantity;
        let valuePrice = data.product_cost_price;
        let valueSubtotal = data.product_subtotal_price;
        let addRow = table.DataTable().row.add({
            'valueQuantity': valueQuantity,
            'valuePrice': valuePrice,
            'valueSubtotal': valueSubtotal,
            'valueOrder': order
        }).draw();
        let newRow = table.DataTable().row(addRow).node();
        let $newRow = $(newRow);
        // load product
        let rowProduct = $newRow[0].querySelector('.table-row-item');
        if (rowProduct) {
            rowProduct.setAttribute('disabled', true);
            rowProduct.classList.add('disabled-custom-show');
            $(rowProduct).append(`<option value="${data.product.id}" selected>
                                        <span class="product-title">${data.product.title}</span>
                                    </option>`)
        }
        // load uom
        let rowUOM = $newRow[0].querySelector('.table-row-uom');
        if (rowUOM) {
            rowUOM.setAttribute('disabled', true);
            rowUOM.classList.add('disabled-custom-show');
            $(rowUOM).append(`<option value="${data.unit_of_measure.id}" selected>
                                        <span class="uom-title">${data.unit_of_measure.title}</span>
                                    </option>`)
        }
        // load tax
        let rowTax = $newRow[0].querySelector('.table-row-tax');
        if (rowTax) {
            rowTax.setAttribute('disabled', true);
            rowTax.classList.add('disabled-but-edit');
            if (data.tax) {
                $(rowTax).append(`<option value="${data.tax.id}" selected>
                                    <span class="uom-title">${data.tax.title}</span>
                                </option>`)
            }
        }
        init_mask_money_single($newRow);
        order++;
    }
}

function loadTabExpense(data_list) {
    let order = 1;
    let table = $('#datable-quotation-create-expense');
    for (let i = 0; i < data_list.length; i++) {
        let data = data_list[i];
        let selectExpenseID = 'quotation-create-expense-box-expense-' + String(order);
        let selectUOMID = 'quotation-create-expense-box-uom-' + String(order);
        let selectTaxID = 'quotation-create-expense-box-tax-' + String(order);
        let addRow = table.DataTable().row.add({
            'order': order,
            'selectExpenseID': selectExpenseID,
            'selectUOMID': selectUOMID,
            'selectTaxID': selectTaxID
        }).draw();
        let newRow = table.DataTable().row(addRow).node();
        let $newRow = $(newRow);
        loadBoxQuotationExpense('data-init-quotation-create-tables-expense', selectExpenseID);
        loadBoxQuotationUOM('data-init-quotation-create-tables-uom', selectUOMID);
        loadBoxQuotationTax('data-init-quotation-create-tables-tax', selectTaxID)
        // load expense
        let rowExpense = $newRow[0].querySelector('.table-row-item');
        if (rowExpense) {
            rowExpense.setAttribute('disabled', true);
            rowExpense.classList.add('disabled-but-edit');
            for (let t = 0; t < rowExpense.options.length; t++) {
                let option = rowExpense.options[t];
                if (option.value === data.expense.id) {
                    option.setAttribute('selected', true);
                    loadInformationSelectBox($(rowExpense))
                }
            }
        }
        // load uom
        let rowUOM = $newRow[0].querySelector('.table-row-uom');
        if (rowUOM) {
            rowUOM.setAttribute('disabled', true);
            rowUOM.classList.add('disabled-but-edit');
            for (let t = 0; t < rowUOM.options.length; t++) {
                let option = rowUOM.options[t];
                if (option.value === data.unit_of_measure.id) {
                    option.setAttribute('selected', true);
                }
            }
        }
        // load quantity
        let rowQuantity = $newRow[0].querySelector('.table-row-quantity');
        if (rowQuantity) {
            rowQuantity.setAttribute('disabled', true);
            rowQuantity.classList.add('disabled-but-edit');
            rowQuantity.value = data.expense_quantity;
        }
        // load price
        let rowPrice = $newRow[0].querySelector('.table-row-price');
        if (rowPrice) {
            rowPrice.setAttribute('disabled', true);
            rowPrice.classList.add('disabled-but-edit');
            rowPrice.value = data.expense_price;
        }
        // load tax
        let rowTax = $newRow[0].querySelector('.table-row-tax');
        if (rowTax) {
            rowTax.setAttribute('disabled', true);
            rowTax.classList.add('disabled-but-edit');
            if (data.tax) {
                for (let t = 0; t < rowTax.options.length; t++) {
                    let option = rowTax.options[t];
                    if (option.value === data.tax.id) {
                        option.setAttribute('selected', true);
                    }
                }
            }
        }
        // load subtotal
        let rowSubtotal = $newRow[0].querySelector('.table-row-subtotal');
        if (rowSubtotal) {
            rowSubtotal.setAttribute('disabled', true);
            rowSubtotal.classList.add('disabled-but-edit');
            rowSubtotal.value = data.expense_subtotal_price;
        }
        init_mask_money_single($newRow);
        order++;
    }
}

function loadTotal(data, pretaxID, taxID, totalID, discountID = null, is_product = false, is_cost = false, is_expense = false) {
    let pretax = document.getElementById(pretaxID);
    if (pretax) {
        if (is_product === true) {
            pretax.value = data.total_product_pretax_amount
        } else if (is_cost === true) {
            pretax.value = data.total_cost_pretax_amount
        } else if (is_expense === true) {
            pretax.value = data.total_expense_pretax_amount
        }
    }
    let discount = document.getElementById(discountID);
    let discountRate = document.getElementById('quotation-create-product-discount');
    if (discount && discountRate) {
        discount.value = data.total_product_discount;
        discountRate.value = data.total_product_discount_rate
    }
    let tax = document.getElementById(taxID);
    if (tax) {
        if (is_product === true) {
            tax.value = data.total_product_tax
        } else if (is_cost === true) {
            tax.value = data.total_cost_tax
        } else if (is_expense === true) {
            tax.value = data.total_expense_tax
        }
    }
    let total = document.getElementById(totalID);
    if (total) {
        if (is_product === true) {
            total.value = data.total_product
        } else if (is_cost === true) {
            total.value = data.total_cost
        } else if (is_expense === true) {
            total.value = data.total_expense
        }
    }
}

function loadDetailQuotation(data) {
    if (data.title) {
        document.getElementById('quotation-create-title').value = data.title
    }
    if (data.opportunity) {
        $('#select-box-quotation-create-opportunity').append(
            `<option class="data-detail" value="${data.opportunity.id}" selected>${data.opportunity.title}</option>`
        )
    }
    if (data.customer) {
        $('#select-box-quotation-create-customer').append(
            `<option class="data-detail" value="${data.customer.id}" selected>${data.customer.title}</option>`
        )
    }
    if (data.contact) {
        $('#select-box-quotation-create-contact').append(
            `<option class="data-detail" value="${data.contact.id}" selected>${data.contact.title}</option>`
        )
    }
    if (data.sale_person) {
        $('#select-box-quotation-create-sale-person').append(
            `<option class="data-detail" value="${data.sale_person.id}" selected>${data.sale_person.full_name}</option>`
        )
    }
    if (data.payment_term) {
        $('#select-box-quotation-create-payment-term').append(
            `<option class="data-detail" value="${data.payment_term.id}" selected>${data.payment_term.title}</option>`
        )
    }
    // quotation tabs
    if (data.quotation_products_data) {
        loadTabProduct(data.quotation_products_data);
    }
    if (data.quotation_costs_data) {
        loadTabCost(data.quotation_costs_data);
    }
    if (data.quotation_expenses_data) {
        loadTabExpense(data.quotation_expenses_data);
    }
    if (data.quotation_logistic_data) {
        document.getElementById('quotation-create-shipping-address').value = data.quotation_logistic_data.shipping_address;
        document.getElementById('quotation-create-billing-address').value = data.quotation_logistic_data.billing_address
    }
    // product totals
    loadTotal(data, 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount', true, false, false);
    init_mask_money_single($('#quotation-tab-product-totals'));
    loadTotal(data, 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total', null, false, true, false);
    init_mask_money_single($('#quotation-tab-cost-totals'));
    loadTotal(data, 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total', null, false, false, true);
    init_mask_money_single($('#quotation-tab-expense-totals'));
}

$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_detail')

        // call ajax get info wf detail
        $.fn.callAjax($form.data('url'), 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        loadDetailQuotation(data);
                    }
                }
            )


    });
});
