"use strict";

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

function init_mask_money_detail(ele) {
    $.fn.getCompanyCurrencyConfig().then((currencyConfig) => {
        if (currencyConfig) {
            ele.find('.mask-money').initInputCurrency(currencyConfig);
            ele.find('.mask-money-value').parseCurrencyDisplay(currencyConfig);
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
    loadTotal(data, 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount', true, false, false);
    loadTotal(data, 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total', null, false, true, false);
    loadTotal(data, 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total', null, false, false, true);
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
