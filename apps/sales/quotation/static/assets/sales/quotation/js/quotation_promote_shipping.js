// Promotions
function checkAvailablePromotion(data_promotion) {
    let tableProd = $('#datable-quotation-create-product');
    let tableEmpty = tableProd[0].querySelector('.dataTables_empty');
    if (!tableEmpty) {
        // DISCOUNT
        if (data_promotion.is_discount === true) {
            let is_before_tax = false;
            let is_after_tax = false;
            let percentDiscount = 0;
            let maxDiscountAmount = 0;
            let fixDiscountAmount = 0;
            let conditionCheck = data_promotion.discount_method;
            if (conditionCheck.before_after_tax === true) {
                is_before_tax = true;
            } else {
                is_after_tax = true;
            }

            if (conditionCheck.percent_fix_amount === true) {
                percentDiscount = conditionCheck.percent_value;
                maxDiscountAmount = conditionCheck.max_percent_value;

            } else {
                fixDiscountAmount = parseFloat(conditionCheck.fix_value);
            }
            if (conditionCheck.hasOwnProperty('is_on_product')) { // discount on specific product
                let prodID = conditionCheck.product_selected.id;
                for (let i = 0; i < tableProd[0].tBodies[0].rows.length; i++) {
                    let row = tableProd[0].tBodies[0].rows[i];
                    let prod = row.querySelector('.table-row-item');
                    let quantity = row.querySelector('.table-row-quantity');
                    if (prod.value === prodID && parseInt(quantity.value) > 0) {
                        if (conditionCheck.hasOwnProperty('is_min_quantity')) { // Check condition quantity of product
                            if (parseInt(quantity.value) >= conditionCheck.num_minimum) {
                                if (conditionCheck.percent_fix_amount === true) { // discount by percent
                                    return {
                                        'is_pass': true,
                                        'condition': {
                                            'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                            'is_discount': true,
                                            'is_gift': false,
                                            'is_before_tax': is_before_tax,
                                            'is_after_tax': is_after_tax,
                                            'is_on_product': true,
                                            'is_on_order': false,
                                            'is_on_percent': true,
                                            'is_fix_amount': false,
                                            'percent_discount': percentDiscount,
                                            'max_amount': maxDiscountAmount,
                                            'product_id': "",
                                            'product_title': data_promotion.title,
                                            'product_code': data_promotion.code,
                                            'product_description': data_promotion.remark,
                                            'product_quantity': 1,
                                        }
                                    }
                                } else { // discount by fix amount
                                    return {
                                        'is_pass': true,
                                        'condition': {
                                            'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                            'is_discount': true,
                                            'is_gift': false,
                                            'is_before_tax': is_before_tax,
                                            'is_after_tax': is_after_tax,
                                            'is_on_product': true,
                                            'is_on_order': false,
                                            'is_on_percent': false,
                                            'is_fix_amount': true,
                                            'fix_value': fixDiscountAmount,
                                            'product_id': "",
                                            'product_title': data_promotion.title,
                                            'product_code': data_promotion.code,
                                            'product_description': data_promotion.remark,
                                            'product_quantity': 1,
                                        }
                                    }
                                }
                            }
                        } else {
                            if (conditionCheck.percent_fix_amount === true) { // discount by percent
                                return {
                                    'is_pass': true,
                                    'condition': {
                                        'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                        'is_discount': true,
                                        'is_gift': false,
                                        'is_before_tax': is_before_tax,
                                        'is_after_tax': is_after_tax,
                                        'is_on_product': true,
                                        'is_on_order': false,
                                        'is_on_percent': true,
                                        'is_fix_amount': false,
                                        'percent_discount': percentDiscount,
                                        'max_amount': maxDiscountAmount,
                                        'product_id': "",
                                        'product_title': data_promotion.title,
                                        'product_code': data_promotion.code,
                                        'product_description': data_promotion.remark,
                                        'product_quantity': 1,
                                    }
                                }
                            } else { // discount by fix amount
                                return {
                                    'is_pass': true,
                                    'condition': {
                                        'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                        'is_discount': true,
                                        'is_gift': false,
                                        'is_before_tax': is_before_tax,
                                        'is_after_tax': is_after_tax,
                                        'is_on_product': true,
                                        'is_on_order': false,
                                        'is_on_percent': false,
                                        'is_fix_amount': true,
                                        'fix_value': fixDiscountAmount,
                                        'product_id': "",
                                        'product_title': data_promotion.title,
                                        'product_code': data_promotion.code,
                                        'product_description': data_promotion.remark,
                                        'product_quantity': 1,
                                    }
                                }
                            }
                        }
                    }
                }
            } else if ((conditionCheck.hasOwnProperty('is_on_order'))) { // discount on whole order
                if (conditionCheck.is_minimum === true) {
                    if (parseFloat(document.getElementById('quotation-create-product-total-raw').value) >= parseFloat(conditionCheck.minimum_value)) {
                        if (conditionCheck.percent_fix_amount === true) { // discount by percent
                            return {
                                'is_pass': true,
                                'condition': {
                                    'row_apply_index': null,
                                    'is_discount': true,
                                    'is_gift': false,
                                    'is_before_tax': is_before_tax,
                                    'is_after_tax': is_after_tax,
                                    'is_on_product': false,
                                    'is_on_order': true,
                                    'is_on_percent': true,
                                    'is_fix_amount': false,
                                    'percent_discount': percentDiscount,
                                    'max_amount': maxDiscountAmount,
                                    'product_id': "",
                                    'product_title': data_promotion.title,
                                    'product_code': data_promotion.code,
                                    'product_description': data_promotion.remark,
                                    'product_quantity': 1,
                                }
                            }
                        } else { // discount by fix amount
                            return {
                                'is_pass': true,
                                'condition': {
                                    'row_apply_index': null,
                                    'is_discount': true,
                                    'is_gift': false,
                                    'is_before_tax': is_before_tax,
                                    'is_after_tax': is_after_tax,
                                    'is_on_product': false,
                                    'is_on_order': true,
                                    'is_on_percent': false,
                                    'is_fix_amount': true,
                                    'fix_value': fixDiscountAmount,
                                    'product_id': "",
                                    'product_title': data_promotion.title,
                                    'product_code': data_promotion.code,
                                    'product_description': data_promotion.remark,
                                    'product_quantity': 1,
                                }
                            }
                        }
                    }
                }
            }
        } else if (data_promotion.is_gift === true) { // GIFT
            let conditionCheck = data_promotion.gift_method;
            if (conditionCheck.is_free_product === true) {
                if (conditionCheck.hasOwnProperty('is_min_purchase')) {
                    if (conditionCheck.before_after_tax === true) {
                        let elePretaxAmountRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
                        let eleDiscountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
                        if ((parseFloat(elePretaxAmountRaw.value) - parseFloat(eleDiscountRaw.value)) >= parseFloat(conditionCheck.min_purchase_cost)) {
                            return {
                                'is_pass': true,
                                'condition': {
                                    'row_apply_index': null,
                                    'is_discount': false,
                                    'is_gift': true,
                                    'product_id': conditionCheck.product_received.id,
                                    'product_title': conditionCheck.product_received.title,
                                    'product_code': conditionCheck.product_received.code,
                                    'product_description': data_promotion.remark,
                                    'product_quantity': parseInt(conditionCheck.num_product_received),
                                }
                            }
                        }
                    } else {
                        let eleTotalRaw = document.getElementById('quotation-create-product-total-raw');
                        if (parseFloat(eleTotalRaw.value) >= parseFloat(conditionCheck.min_purchase_cost)) {
                            return {
                                'is_pass': true,
                                'condition': {
                                    'row_apply_index': null,
                                    'is_discount': false,
                                    'is_gift': true,
                                    'product_id': conditionCheck.product_received.id,
                                    'product_title': conditionCheck.product_received.title,
                                    'product_code': conditionCheck.product_received.code,
                                    'product_description': data_promotion.remark,
                                    'product_quantity': parseInt(conditionCheck.num_product_received),
                                }
                            }
                        }
                    }

                } else if (conditionCheck.hasOwnProperty('is_purchase')) {
                    let purchase_product_id = conditionCheck.purchase_product.id;
                    let purchase_num = conditionCheck.purchase_num;
                    for (let i = 0; i < tableProd[0].tBodies[0].rows.length; i++) {
                        let row = tableProd[0].tBodies[0].rows[i];
                        let prod = row.querySelector('.table-row-item');
                        let quantity = row.querySelector('.table-row-quantity');
                        if (prod.value === purchase_product_id && parseInt(quantity.value) > 0) {
                            if (parseInt(quantity.value) >= purchase_num) {
                                return {
                                    'is_pass': true,
                                    'condition': {
                                        'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                        'is_discount': false,
                                        'is_gift': true,
                                        'product_id': conditionCheck.product_received.id,
                                        'product_title': conditionCheck.product_received.title,
                                        'product_code': conditionCheck.product_received.code,
                                        'product_description': data_promotion.remark,
                                        'product_quantity': parseInt(conditionCheck.num_product_received),
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return {
        'is_pass': false,
    }
}

function getPromotionResult(condition) {
    let result = {
        'product_quantity': 0,
        'product_price': 0
    };
    let tableProd = $('#datable-quotation-create-product');
    if (condition.is_discount === true) { // DISCOUNT
        let DiscountAmount = 0;
        let taxID = "";
        let discount_rate_on_order = null;
        if (condition.is_on_product === true) { // discount on specific product
            let row = tableProd.DataTable().row(condition.row_apply_index).node();
            let taxSelected = row.querySelector('.table-row-tax').options[row.querySelector('.table-row-tax').selectedIndex];
            let taxValue = taxSelected.getAttribute('data-value')
            taxID = taxSelected.value;
            if (condition.is_on_percent === true) { // discount by percent
                let subtotal = row.querySelector('.table-row-subtotal-raw').value;
                DiscountAmount = ((parseFloat(subtotal) * parseFloat(condition.percent_discount)) / 100);
                if (DiscountAmount > parseFloat(condition.max_amount)) { // check discount amount with max discount amount
                    DiscountAmount = parseFloat(condition.max_amount)
                }
            } else if (condition.is_fix_amount === true) { // discount by fix amount
                if (condition.is_before_tax === true) {
                    DiscountAmount = condition.fix_value;
                } else if (condition.is_after_tax === true) {
                    // DiscountAmount = (condition.fix_value / (1 + (taxValue/100)))
                    DiscountAmount = condition.fix_value;
                    taxID = "";
                }
            }

        } else if (condition.is_on_order === true) { // discount on whole order
            if (condition.is_on_percent === true) { // discount by percent
                if (condition.is_before_tax === true) {
                    let preTax = document.getElementById('quotation-create-product-pretax-amount-raw').value;
                    let discount = document.getElementById('quotation-create-product-discount-amount-raw').value;
                    let total = parseFloat(preTax) - parseFloat(discount);
                    DiscountAmount = ((total * parseFloat(condition.percent_discount)) / 100);
                    discount_rate_on_order = parseFloat(condition.percent_discount);
                } else if (condition.is_after_tax === true) {
                    let total = document.getElementById('quotation-create-product-total-raw').value;
                    DiscountAmount = ((parseFloat(total) * parseFloat(condition.percent_discount)) / 100);
                }
                if (DiscountAmount > parseFloat(condition.max_amount)) { // check discount amount with max discount amount
                    DiscountAmount = parseFloat(condition.max_amount)
                    if (condition.is_before_tax === true) {
                        let preTax = document.getElementById('quotation-create-product-pretax-amount-raw').value;
                        let discount = document.getElementById('quotation-create-product-discount-amount-raw').value;
                        let total = parseFloat(preTax) - parseFloat(discount);
                        discount_rate_on_order = ((DiscountAmount / total) * 100)
                    }
                }
            } else if (condition.is_fix_amount === true) { // discount by fix amount
                if (condition.is_before_tax === true) {
                    DiscountAmount = condition.fix_value;
                } else if (condition.is_after_tax === true) {
                    DiscountAmount = condition.fix_value;
                }
            }
        }
        return {
            'row_apply_index': condition.row_apply_index,
            'is_discount': true,
            'is_gift': false,
            'product_id': condition.product_id,
            'product_title': condition.product_title,
            'product_code': condition.product_code,
            'product_description': "(Voucher) " + condition.product_description,
            'product_quantity': condition.product_quantity,
            'product_price': DiscountAmount,
            'value_tax': taxID,
            'discount_rate_on_order': discount_rate_on_order,
        }
    } else if (condition.is_gift === true) { // GIFT
        return {
            'row_apply_index': condition.row_apply_index,
            'is_discount': false,
            'is_gift': true,
            'product_id': condition.product_id,
            'product_title': condition.product_title,
            'product_code': condition.product_code,
            'product_description': "(Gift) " + condition.product_description,
            'product_quantity': condition.product_quantity,
            'product_price': 0,
        }
    }
    return result
}

function deletePromotionRows(table, is_promotion = false, is_shipping = false) {
    for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
        let row = table[0].tBodies[0].rows[i];
        if (row.querySelector('.table-row-promotion') && is_promotion === true) {
            deleteRow($(row), row.closest('tbody'), table)
        } else if (row.querySelector('.table-row-shipping') && is_shipping === true) {
            deleteRow($(row), row.closest('tbody'), table)
        }
    }
}

function filterDataProductNotPromotion(data_products) {
    let finalList = [];
    let order = 0;
    for (let i = 0; i < data_products.length; i++) {
        let dataProd = data_products[i];
        if (!dataProd.hasOwnProperty('is_promotion')) {
            order++;
            dataProd['order'] = order;
            finalList.push(dataProd)
        }
    }
    return finalList
}

function reCalculateTax(table, promotion_discount_rate) {
    let eleTaxes = document.getElementById('quotation-create-product-taxes');
    let eleTaxesRaw = document.getElementById('quotation-create-product-taxes-raw');
    let taxAmountTotal = 0;
    for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
        let row = table[0].tBodies[0].rows[i];
        if (row.querySelector('.table-row-price')) {
            let price = 0;
            let quantity = 0;
            let elePrice = row.querySelector('.table-row-price');
            if (elePrice) {
                price = $(elePrice).valCurrency();
            }
            let eleQuantity = row.querySelector('.table-row-quantity');
            if (eleQuantity) {
                if (eleQuantity.value) {
                    quantity = parseInt(eleQuantity.value)
                } else if (!eleQuantity.value || eleQuantity.value === "0") {
                    quantity = 0
                }
            }
            let tax = 0;
            let discount = 0;
            let subtotal = (price * quantity);
            let subtotalPlus = 0;
            let eleTax = row.querySelector('.table-row-tax');
            if (eleTax) {
                let optionSelected = eleTax.options[eleTax.selectedIndex];
                if (optionSelected) {
                    tax = parseInt(optionSelected.getAttribute('data-value'));
                }
            }
            // calculate discount & tax
            let eleDiscount = row.querySelector('.table-row-discount');
            let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
            if (eleDiscount && eleDiscountAmount) {
                if (eleDiscount.value) {
                    discount = parseFloat(eleDiscount.value)
                } else if (!eleDiscount.value || eleDiscount.value === "0") {
                    discount = 0
                }
                let discountAmount = ((price * discount) / 100);
                let priceDiscountOnRow = (price - discountAmount);
                subtotal = (priceDiscountOnRow * quantity);

                let discountRateOnTotal = 0;
                if (document.getElementById('quotation-create-product-discount').value) {
                    discountRateOnTotal = parseFloat(document.getElementById('quotation-create-product-discount').value)
                }
                let discountAmountOnTotal = ((priceDiscountOnRow * (promotion_discount_rate + discountRateOnTotal)) / 100);
                subtotalPlus = ((priceDiscountOnRow - discountAmountOnTotal) * quantity);
                // calculate tax
                if (row.querySelector('.table-row-tax-amount')) {
                    let taxAmount = ((subtotalPlus * tax) / 100);
                    taxAmountTotal += taxAmount;
                }
            }
        }
    }
    $(eleTaxes).attr('value', String(taxAmountTotal));
    eleTaxesRaw.value = taxAmountTotal;
    $.fn.initMaskMoney2();
}

// Shipping
function checkAvailableShipping(data_shipping) {
    let operators = {
        1: "<",
        2: ">",
        3: "<=",
        4: ">=",
    }
    if (data_shipping.cost_method === 0) { // Fixed Price Method
        return {
            'is_pass': true,
            'final_shipping_price': parseFloat(data_shipping.fixed_price)
        }
    } else if (data_shipping.cost_method === 1) { // Formula Method
        let shippingAddress = $('#quotation-create-shipping-address').val();
        let formula_condition = data_shipping.formula_condition;
        for (let i = 0; i < formula_condition.length; i++) {
            let formula = formula_condition[i].formula;
            let location_condition = formula_condition[i].location_condition
            for (let l = 0; l < location_condition.length; l++) {
                let location = location_condition[l];
                if (shippingAddress.includes(location.title)) {
                    return {
                        'is_pass': true,
                    }
                }
            }
        }
    }

    return {
        'is_pass': false,
    }
}