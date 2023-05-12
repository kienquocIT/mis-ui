"use strict";

function loadTotal(data, is_product, is_cost, is_expense) {
    let pretax = null;
    let tax = null;
    let total = null;
    let discount = null;
    let pretaxRaw = null;
    let taxRaw = null;
    let totalRaw = null;
    let discountRaw = null;
    if (is_product === true) {
        pretax = document.getElementById('quotation-create-product-pretax-amount');
        tax = document.getElementById('quotation-create-product-taxes');
        total = document.getElementById('quotation-create-product-total');
        discount = document.getElementById('quotation-create-product-discount-amount');
        pretaxRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
        taxRaw = document.getElementById('quotation-create-product-taxes-raw');
        totalRaw = document.getElementById('quotation-create-product-total-raw');
        discountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
    } else if (is_cost === true) {
        pretax = document.getElementById('quotation-create-cost-pretax-amount');
        tax = document.getElementById('quotation-create-cost-taxes');
        total = document.getElementById('quotation-create-cost-total');
        pretaxRaw = document.getElementById('quotation-create-cost-pretax-amount-raw');
        taxRaw = document.getElementById('quotation-create-cost-taxes-raw');
        totalRaw = document.getElementById('quotation-create-cost-total-raw');
    } else if (is_expense === true) {
        pretax = document.getElementById('quotation-create-expense-pretax-amount');
        tax = document.getElementById('quotation-create-expense-taxes');
        total = document.getElementById('quotation-create-expense-total');
        pretaxRaw = document.getElementById('quotation-create-expense-pretax-amount-raw');
        taxRaw = document.getElementById('quotation-create-expense-taxes-raw');
        totalRaw = document.getElementById('quotation-create-expense-total-raw');
    }
    if (pretax && tax && total) {
        if (is_product === true) {
            pretax.value = Math.round(data.total_product_pretax_amount);
            pretaxRaw.value = data.total_product_pretax_amount
        } else if (is_cost === true) {
            pretax.value = Math.round(data.total_cost_pretax_amount);
            pretaxRaw.value = data.total_cost_pretax_amount
        } else if (is_expense === true) {
            pretax.value = Math.round(data.total_expense_pretax_amount);
            pretaxRaw.value = data.total_expense_pretax_amount
        }
        let discountRate = document.getElementById('quotation-create-product-discount');
        if (discount && discountRate) {
            discount.value = Math.round(data.total_product_discount);
            discountRaw.value = data.total_product_discount;
            discountRate.value = data.total_product_discount_rate
        }
        if (is_product === true) {
            tax.value = Math.round(data.total_product_tax);
            taxRaw.value = data.total_product_tax
        } else if (is_cost === true) {
            tax.value = Math.round(data.total_cost_tax);
            taxRaw.value = data.total_cost_tax
        } else if (is_expense === true) {
            tax.value = Math.round(data.total_expense_tax);
            taxRaw.value = data.total_expense_tax
        }
        if (is_product === true) {
            total.value = Math.round(data.total_product);
            totalRaw.value = data.total_product
        } else if (is_cost === true) {
            total.value = Math.round(data.total_cost);
            totalRaw.value = data.total_cost
        } else if (is_expense === true) {
            total.value = Math.round(data.total_expense);
            totalRaw.value = data.total_expense
        }
    }
}

function init_mask_money_detail(ele) {
    $.fn.getCompanyCurrencyConfig().then((currencyConfig) => {
        if (currencyConfig) {
            ele.find('.mask-money').initInputCurrency(currencyConfig['currency_rule']);
            ele.find('.mask-money-value').parseCurrencyDisplay(currencyConfig['currency_rule']);
        } else throw  Error('Currency config is not found.')
    });
}

function maskMoneyData() {
    init_mask_money_detail($('#tab_block_3'));
    init_mask_money_detail($('#tab_block_6'));
    init_mask_money_detail($('#tab_block_7'));
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
    // product totals
    loadTotal(data, true, false, false);
    loadTotal(data, false, true, false);
    loadTotal(data, false, false, true);
}

$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_detail');
        let dataTableClass = new dataTableHandle();

        // call ajax get info quotation detail
        $.fn.callAjax($form.data('url'), 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        loadDetailQuotation(data);
                        dataTableClass.dataTableProduct(data.quotation_products_data, 'datable-quotation-create-product');
                        dataTableClass.dataTableCost(data.quotation_costs_data, 'datable-quotation-create-cost');
                        dataTableClass.dataTableExpense(data.quotation_expenses_data, 'datable-quotation-create-expense');
                    }
                }
            )

        maskMoneyData();


    });
});
