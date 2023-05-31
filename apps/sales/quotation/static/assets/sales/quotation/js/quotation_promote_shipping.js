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
                    if (prod) {
                        if (prod.value === prodID && parseFloat(quantity.value) > 0) {
                            if (conditionCheck.hasOwnProperty('is_min_quantity')) { // Check condition quantity of product
                                if (parseFloat(quantity.value) >= conditionCheck.num_minimum) {
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
                                    'product_quantity': parseFloat(conditionCheck.num_product_received),
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
                                    'product_quantity': parseFloat(conditionCheck.num_product_received),
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
                        if (prod.value === purchase_product_id && parseFloat(quantity.value) > 0) {
                            if (parseFloat(quantity.value) >= purchase_num) {
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
                                        'product_quantity': parseFloat(conditionCheck.num_product_received),
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
        let is_promotion_on_row = false;
        let is_before_tax = true;
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
                    DiscountAmount = condition.fix_value;
                    taxID = "";
                    is_before_tax = false;
                }
            }
            is_promotion_on_row = true;
        } else if (condition.is_on_order === true) { // discount on whole order
            if (condition.is_on_percent === true) { // discount by percent
                if (condition.is_before_tax === true) {
                    let preTax = document.getElementById('quotation-create-product-pretax-amount-raw').value;
                    let discount = document.getElementById('quotation-create-product-discount-amount-raw').value;
                    let total = parseFloat(preTax) - parseFloat(discount);
                    DiscountAmount = ((total * parseFloat(condition.percent_discount)) / 100);
                    // check discount amount with max discount amount & re calculate discount_rate_on_order
                    discount_rate_on_order = parseFloat(condition.percent_discount);
                    if (DiscountAmount > parseFloat(condition.max_amount)) {
                        DiscountAmount = parseFloat(condition.max_amount)
                        discount_rate_on_order = ((DiscountAmount / total) * 100)
                    }
                } else if (condition.is_after_tax === true) {
                    let total = document.getElementById('quotation-create-product-total-raw').value;
                    DiscountAmount = ((parseFloat(total) * parseFloat(condition.percent_discount)) / 100);
                    // check discount amount with max discount amount & re calculate discount_rate_on_order
                    discount_rate_on_order = parseFloat(condition.percent_discount);
                    if (DiscountAmount > parseFloat(condition.max_amount)) {
                        DiscountAmount = parseFloat(condition.max_amount)
                        discount_rate_on_order = ((DiscountAmount / total) * 100)
                    }
                    is_before_tax = false;
                }
            } else if (condition.is_fix_amount === true) { // discount by fix amount
                if (condition.is_before_tax === true) {
                    DiscountAmount = condition.fix_value;
                    // get promotion rate
                    let preTax = document.getElementById('quotation-create-product-pretax-amount-raw').value;
                    let discount = document.getElementById('quotation-create-product-discount-amount-raw').value;
                    let total = parseFloat(preTax) - parseFloat(discount);
                    discount_rate_on_order = ((DiscountAmount / total) * 100)
                } else if (condition.is_after_tax === true) {
                    DiscountAmount = condition.fix_value;
                    let total = document.getElementById('quotation-create-product-total-raw').value;
                    discount_rate_on_order = ((DiscountAmount / total) * 100);
                    is_before_tax = false
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
            'is_promotion_on_row': is_promotion_on_row,
            'is_before_tax': is_before_tax
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

function reCalculateIfPromotion(table, promotion_discount_rate, promotion_amount, is_before_tax = true) {
    let eleTaxes = document.getElementById('quotation-create-product-taxes');
    let eleTaxesRaw = document.getElementById('quotation-create-product-taxes-raw');
    let taxAmountTotal = 0;
    if (is_before_tax === true) {
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-price')) {
                // setup data
                let price = 0;
                let quantity = 0;
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    price = $(elePrice).valCurrency();
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    if (eleQuantity.value) {
                        quantity = parseFloat(eleQuantity.value)
                    } else if (!eleQuantity.value || eleQuantity.value === "0") {
                        quantity = 0
                    }
                }
                let tax = 0;
                let discount = 0;
                let subtotalPlus = 0;
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        tax = parseFloat(optionSelected.getAttribute('data-value'));
                    }
                }
                // calculate discount & tax
                let eleDiscount = row.querySelector('.table-row-discount');
                let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
                if (eleDiscount && eleDiscountAmount) {
                    // apply discount ON ROW
                    if (eleDiscount.value) {
                        discount = parseFloat(eleDiscount.value)
                    } else if (!eleDiscount.value || eleDiscount.value === "0") {
                        discount = 0
                    }
                    let discountAmount = ((price * discount) / 100);
                    let priceDiscountOnRow = (price - discountAmount);
                    // apply discount ON TOTAL
                    let discountRateOnTotal = 0;
                    if (document.getElementById('quotation-create-product-discount').value) {
                        discountRateOnTotal = parseFloat(document.getElementById('quotation-create-product-discount').value)
                    }
                    let discountAmountOnTotal = ((priceDiscountOnRow * discountRateOnTotal) / 100);
                    let priceAfterDisCountTotal = (priceDiscountOnRow - discountAmountOnTotal);
                    // apply discount PROMOTION
                    let discountAmountPromotion = ((priceAfterDisCountTotal * promotion_discount_rate) / 100);
                    let finalPrice = (priceAfterDisCountTotal - discountAmountPromotion);
                    subtotalPlus = (finalPrice * quantity);
                    // ReCalculate tax
                    if (row.querySelector('.table-row-tax-amount')) {
                        let taxAmount = ((subtotalPlus * tax) / 100);
                        taxAmountTotal += taxAmount;
                    }
                }
            }
        }
    } else if (is_before_tax === false) {
        let totalTaxAmountMinus = 0;
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-price')) {
                // setup data
                let price = 0;
                let quantity = 0;
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    price = $(elePrice).valCurrency();
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    if (eleQuantity.value) {
                        quantity = parseFloat(eleQuantity.value)
                    } else if (!eleQuantity.value || eleQuantity.value === "0") {
                        quantity = 0
                    }
                }
                let tax = 0;
                let discount = 0;
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
                    // apply discount ON ROW
                    if (eleDiscount.value) {
                        discount = parseFloat(eleDiscount.value)
                    } else if (!eleDiscount.value || eleDiscount.value === "0") {
                        discount = 0
                    }
                    let discountAmount = ((price * discount) / 100);
                    let priceDiscountOnRow = (price - discountAmount);
                    // apply discount ON TOTAL
                    let discountRateOnTotal = 0;
                    if (document.getElementById('quotation-create-product-discount').value) {
                        discountRateOnTotal = parseFloat(document.getElementById('quotation-create-product-discount').value)
                    }
                    let discountAmountOnTotal = ((priceDiscountOnRow * discountRateOnTotal) / 100);
                    let finalPrice = (priceDiscountOnRow - discountAmountOnTotal);
                    subtotalPlus = (finalPrice * quantity);
                    // ReCalculate tax
                    if (row.querySelector('.table-row-tax-amount')) {
                        let taxAmount = ((subtotalPlus * tax) / 100);
                        let subtotalPlusAfterTax = subtotalPlus + taxAmount;
                        let discountAmountPromotion = ((subtotalPlusAfterTax * promotion_discount_rate) / 100)
                        totalTaxAmountMinus += ((discountAmountPromotion * tax) / 100);
                    }
                }
            }
        }
        taxAmountTotal = parseFloat(eleTaxesRaw.value) - totalTaxAmountMinus;
    }
    // apply Final Tax
    $(eleTaxes).attr('value', String(taxAmountTotal));
    eleTaxesRaw.value = taxAmountTotal;

    let eleTotal = document.getElementById('quotation-create-product-total');
    let eleTotalRaw = document.getElementById('quotation-create-product-total-raw');

    // ReCalculate TOTAL
    let elePretaxAmountRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
    let eleDiscountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
    let totalFinal = (parseFloat(elePretaxAmountRaw.value) - parseFloat(eleDiscountRaw.value) - parseFloat(promotion_amount) + taxAmountTotal);
    if (is_before_tax === false) {
        totalFinal = (parseFloat(eleTotalRaw.value) - promotion_amount);
    }

    // apply Final Total
    $(eleTotal).attr('value', String(totalFinal));
    eleTotalRaw.value = totalFinal;

    $.fn.initMaskMoney2();
}

// Shipping
function checkAvailableShipping(data_shipping) {
    let final_shipping_price = 0;
    if (data_shipping.cost_method === 0) { // Fixed Price Method
        final_shipping_price = parseFloat(data_shipping.fixed_price)
        return {
            'is_pass': true,
            'final_shipping_price': final_shipping_price
        }
    } else if (data_shipping.cost_method === 1) { // Formula Method
        let shippingAddress = $('#quotation-create-shipping-address').val();
        let formula_condition = data_shipping.formula_condition;
        for (let i = 0; i < formula_condition.length; i++) {
            let location_condition = formula_condition[i].location_condition
            for (let l = 0; l < location_condition.length; l++) {
                let location = location_condition[l];
                if (shippingAddress.includes(location.title)) { // check location
                    let table = document.getElementById('datable-quotation-create-product');
                    let formula_list = formula_condition[i].formula;
                    for (let f = 0; f < formula_list.length; f++) {
                        let formula = formula_list[f]; // check formula condition
                        let unit = formula.unit;
                        let amount_condition = parseFloat(formula.threshold);
                        let operator = formula.comparison_operators;
                        let extra_amount = parseFloat(formula.extra_amount);
                        let shipping_price = parseFloat(formula.amount_condition);
                        final_shipping_price = (shipping_price + (extra_amount * amount_condition));
                        let result_to_check = 0;
                        if (unit.title === "price") { // if condition is price
                            for (let idx = 0; idx < table.tBodies[0].rows.length; idx++) {
                                let row = table.tBodies[0].rows[idx];
                                if (row.querySelector('.table-row-item')) {
                                    let quantity = row.querySelector('.table-row-quantity');
                                    let elePrice = row.querySelector('.table-row-price');
                                    if (quantity && elePrice) {
                                        result_to_check += (parseFloat(quantity.value) * $(elePrice).valCurrency());
                                    }
                                }
                            }
                        } else if (unit.title === "quantity") { // if condition is quantity
                            for (let idx = 0; idx < table.tBodies[0].rows.length; idx++) {
                                let row = table.tBodies[0].rows[idx];
                                if (row.querySelector('.table-row-item')) {
                                    let quantity = row.querySelector('.table-row-quantity');
                                    if (quantity) {
                                        result_to_check += parseFloat(quantity.value);
                                    }
                                }
                            }
                        } else if (unit.title === "volume") { // if condition is volume

                        } else if (unit.title === "weight") { // if condition is weight

                        }
                        if (operator === 1) {
                            if (result_to_check < amount_condition) {
                                return {
                                    'is_pass': true,
                                    'final_shipping_price': final_shipping_price
                                }
                            }
                        } else if (operator === 2) {
                            if (result_to_check > amount_condition) {
                                return {
                                    'is_pass': true,
                                    'final_shipping_price': final_shipping_price
                                }
                            }
                        } else if (operator === 3) {
                            if (result_to_check <= amount_condition) {
                                return {
                                    'is_pass': true,
                                    'final_shipping_price': final_shipping_price
                                }
                            }
                        } else if (operator === 4) {
                            if (result_to_check >= amount_condition) {
                                return {
                                    'is_pass': true,
                                    'final_shipping_price': final_shipping_price
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
        'final_shipping_price': final_shipping_price
    }
}

function reCalculateIfShipping(shipping_price) {
    let elePretaxAmount = document.getElementById('quotation-create-product-pretax-amount');
    let eleDiscountAmount = document.getElementById('quotation-create-product-discount-amount');
    let eleTotalAmount = document.getElementById('quotation-create-product-total');
    let elePretaxAmountRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
    let eleDiscountAmountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
    let eleTaxAmountRaw = document.getElementById('quotation-create-product-taxes-raw');
    let eleTotalAmountRaw = document.getElementById('quotation-create-product-total-raw');
    let discountRateOnTotal = 0;
    if (document.getElementById('quotation-create-product-discount').value) {
        discountRateOnTotal = parseFloat(document.getElementById('quotation-create-product-discount').value)
    }

    // Re calculate pretax, discount, total
    let pretaxNew = parseFloat(elePretaxAmountRaw.value) + parseFloat(shipping_price);
    let discountNew = ((pretaxNew * discountRateOnTotal) / 100);
    let totalNew = (pretaxNew - discountNew + parseFloat(eleTaxAmountRaw.value));

    // Apply new pretax, discount, total
    $(elePretaxAmount).attr('value', String(pretaxNew));
    elePretaxAmountRaw.value = pretaxNew;
    $(eleDiscountAmount).attr('value', String(discountNew));
    eleDiscountAmountRaw.value = discountNew;
    $(eleTotalAmount).attr('value', String(totalNew));
    eleTotalAmountRaw.value = totalNew;

    $.fn.initMaskMoney2();
}

// Config
function loadPriceProduct(ele) {
        let optionSelected = ele[0].options[ele[0].selectedIndex];
        let productData = optionSelected.querySelector('.data-default');
        if (productData) {
            let data = JSON.parse(productData.value);
            let price = ele[0].closest('tr').querySelector('.table-row-price');
            let priceList = ele[0].closest('tr').querySelector('.table-row-price-list');
            // load PRICE
            if (price && priceList) {
                let valList = [];
                let account_price_list = document.getElementById('customer-price-list').value;
                $(priceList).empty();
                for (let i = 0; i < data.price_list.length; i++) {
                    if (data.price_list[i].id === account_price_list) {
                        valList.push(parseFloat(data.price_list[i].value.toFixed(2)));
                        let option = `<a class="dropdown-item table-row-price-option" data-value="${parseFloat(data.price_list[i].value)}">
                                    <div class="row">
                                        <div class="col-5"><span>${data.price_list[i].title}</span></div>
                                        <div class="col-2"></div>
                                        <div class="col-5"><span class="mask-money" data-init-money="${parseFloat(data.price_list[i].value)}"></span></div>
                                    </div>
                                </a>`;
                        $(priceList).append(option);
                    }
                }
                // get Min Price to display
                if (valList.length > 0) {
                    let minVal = Math.min(...valList);
                    $(price).attr('value', String(minVal));
                }
            }
        }
        $.fn.initMaskMoney2();
    }

function checkConfig(is_change_opp = false) {
    let opportunity = $('#select-box-quotation-create-opportunity').val();
    // let config = JSON.parse($('#quotation-config-data').val());
    let config = {
        'short_sale_config': {
            'is_choose_price_list': false,
            'is_input_price': false,
            'is_discount_on_product': false,
            'is_discount_on_total': false
        },
        'long_sale_config': {
            'is_not_input_price': false,
            'is_not_discount_on_product': false,
            'is_not_discount_on_total': false,
        }
    }
    let tableProduct = document.getElementById('datable-quotation-create-product');
    let tableExpense = document.getElementById('datable-quotation-create-expense');
    let empty_list = ["", null]
    if (!opportunity || empty_list.includes(opportunity)) { // short sale
        if (is_change_opp === true) {
            // ReCheck Table Product
            if (!tableProduct.querySelector('.dataTables_empty')) {
                for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                    let row = tableProduct.tBodies[0].rows[i];
                    let elePriceList = row.querySelector('.dropdown-action');
                    let elePrice = row.querySelector('.table-row-price');
                    let eleDiscount = row.querySelector('.table-row-discount');
                    let eleDiscountTotal = document.getElementById('quotation-create-product-discount');
                    if (config.short_sale_config.is_choose_price_list === false) {
                        if (elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.removeAttribute('data-bs-toggle')
                        }
                    } else {
                        if (!elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.setAttribute('data-bs-toggle', 'dropdown')
                        }
                    }
                    if (config.short_sale_config.is_input_price === false) {
                        if (!elePrice.hasAttribute('disabled')) {
                            elePrice.setAttribute('disabled', 'true');
                            elePrice.classList.add('disabled-custom-show');
                            $(elePrice).attr('value', String(0));
                        }
                    } else {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    }
                    if (config.short_sale_config.is_discount_on_product === false) {
                        if (!eleDiscount.hasAttribute('disabled')) {
                            eleDiscount.setAttribute('disabled', 'true');
                            eleDiscount.classList.add('disabled-custom-show');
                            eleDiscount.value = "0";
                        }
                    } else {
                        if (eleDiscount.hasAttribute('disabled')) {
                            eleDiscount.removeAttribute('disabled');
                            eleDiscount.classList.remove('disabled-custom-show');
                        }
                    }
                    if (config.short_sale_config.is_discount_on_total === false) {
                        if (!eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.setAttribute('disabled', 'true');
                            eleDiscountTotal.classList.add('disabled-custom-show');
                            eleDiscountTotal.value = "0";
                        }
                    } else {
                        if (eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.removeAttribute('disabled');
                            eleDiscountTotal.classList.remove('disabled-custom-show');
                        }
                    }
                }
            }
            // ReCheck Table Expense
            if (!tableExpense.querySelector('.dataTables_empty')) {
                for (let i = 0; i < tableExpense.tBodies[0].rows.length; i++) {
                    let row = tableExpense.tBodies[0].rows[i];
                    let elePriceList = row.querySelector('.dropdown-action');
                    let elePrice = row.querySelector('.table-row-price');
                    if (config.short_sale_config.is_choose_price_list === false) {
                        if (elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.removeAttribute('data-bs-toggle')
                        }
                    } else {
                        if (!elePriceList.hasAttribute('data-bs-toggle')) {
                            elePriceList.setAttribute('data-bs-toggle', 'dropdown')
                        }
                    }
                    if (config.short_sale_config.is_input_price === false) {
                        if (!elePrice.hasAttribute('disabled')) {
                            elePrice.setAttribute('disabled', 'true');
                            elePrice.classList.add('disabled-custom-show');
                            $(elePrice).attr('value', String(0));
                        }
                    } else {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    }
                }
            }
        }
        $.fn.initMaskMoney2();
        return {
            'is_short_sale': true,
            'is_long_sale': false,
            'short_sale_config': config.short_sale_config,
        }
    } else { // long sale
        if (is_change_opp === true) {
            // ReCheck Table Product
            if (!tableProduct.querySelector('.dataTables_empty')) {
                for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                    let row = tableProduct.tBodies[0].rows[i];
                    let elePriceList = row.querySelector('.dropdown-action');
                    let elePrice = row.querySelector('.table-row-price');
                    let eleDiscount = row.querySelector('.table-row-discount');
                    let eleDiscountTotal = document.getElementById('quotation-create-product-discount');
                    if (!elePriceList.hasAttribute('data-bs-toggle')) {
                        elePriceList.setAttribute('data-bs-toggle', 'dropdown')
                    }
                    if (config.long_sale_config.is_not_input_price === false) {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    } else {
                        if (!elePrice.hasAttribute('disabled')) {
                            elePrice.setAttribute('disabled', 'true');
                            elePrice.classList.add('disabled-custom-show');
                        }
                    }
                    if (config.long_sale_config.is_not_discount_on_product === false) {
                        if (eleDiscount.hasAttribute('disabled')) {
                            eleDiscount.removeAttribute('disabled');
                            eleDiscount.classList.remove('disabled-custom-show');
                        }
                    } else {
                        if (!eleDiscount.hasAttribute('disabled')) {
                            eleDiscount.setAttribute('disabled', 'true');
                            eleDiscount.classList.add('disabled-custom-show');
                        }
                    }
                    if (config.long_sale_config.is_not_discount_on_total === false) {
                        if (eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.removeAttribute('disabled');
                            eleDiscountTotal.classList.remove('disabled-custom-show');
                        }
                    } else {
                        if (!eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.setAttribute('disabled', 'true');
                            eleDiscountTotal.classList.add('disabled-custom-show');
                        }
                    }
                }
            }
            // ReCheck Table Expense
            if (!tableExpense.querySelector('.dataTables_empty')) {
                for (let i = 0; i < tableExpense.tBodies[0].rows.length; i++) {
                    let row = tableExpense.tBodies[0].rows[i];
                    let elePriceList = row.querySelector('.dropdown-action');
                    let elePrice = row.querySelector('.table-row-price');
                    if (!elePriceList.hasAttribute('data-bs-toggle')) {
                        elePriceList.setAttribute('data-bs-toggle', 'dropdown')
                    }
                    if (config.long_sale_config.is_not_input_price === false) {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    } else {
                        if (!elePrice.hasAttribute('disabled')) {
                            elePrice.setAttribute('disabled', 'true');
                            elePrice.classList.add('disabled-custom-show');
                        }
                    }
                }
            }
        }
        $.fn.initMaskMoney2();
        return {
            'is_short_sale': false,
            'is_long_sale': true,
            'short_sale_config': config.long_sale_config,
        }
    }
}