// Promotions
class promotionHandle {
    checkAvailablePromotion(data_promotion, customer_id = null) {
        let self = this;
        let tableProd = $('#datable-quotation-create-product');
        let tableEmpty = tableProd[0].querySelector('.dataTables_empty');
        if (!tableEmpty) {
            if (data_promotion.is_discount === true) { // DISCOUNT
                let is_before_tax = false;
                let is_after_tax = false;
                let percentDiscount = 0;
                let maxDiscountAmount = 0;
                let fixDiscountAmount = 0;
                let conditionCheck = data_promotion.discount_method;
                // check limit used on Sale Order
                let check_limit = self.checkLimit(data_promotion, conditionCheck, customer_id);
                if (check_limit === false) {
                    return {
                        'is_pass': false,
                    }
                }
                // end check limit
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
                    } else {
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
            } else if (data_promotion.is_gift === true) { // GIFT
                let conditionCheck = data_promotion.gift_method;
                // check limit used on Sale Order
                let check_limit = self.checkLimit(data_promotion, conditionCheck, customer_id);
                if (check_limit === false) {
                    return {
                        'is_pass': false,
                    }
                }
                // end check limit
                if (conditionCheck.is_free_product === true) {
                    if (conditionCheck.hasOwnProperty('is_min_purchase')) { // Check total price
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
                    } else if (conditionCheck.hasOwnProperty('is_purchase')) { // Check quantity
                        let purchase_product_id = conditionCheck.purchase_product.id;
                        let purchase_num = conditionCheck.purchase_num;
                        for (let i = 0; i < tableProd[0].tBodies[0].rows.length; i++) {
                            let row = tableProd[0].tBodies[0].rows[i];
                            let prod = row.querySelector('.table-row-item');
                            let quantity = row.querySelector('.table-row-quantity');
                            if (prod && quantity) {
                                if (prod.value === purchase_product_id && parseFloat(quantity.value) > 0) {
                                    if (parseFloat(quantity.value) >= purchase_num) {
                                        let total_received_raw = ((parseFloat(quantity.value) / parseFloat(purchase_num)) * parseFloat(conditionCheck.num_product_received))
                                        let total_received = Math.floor(total_received_raw);
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
                                                'product_quantity': total_received,
                                            }
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

    checkLimit(data_promotion, conditionCheck, customer_id) {
        let self = this;
        // CHECK MAX USAGES
        let max_usages = conditionCheck.max_usages;
        if (max_usages > 0) {
            let check_max_usages = 0;
            for (let idx = 0; idx < data_promotion.sale_order_used.length; idx++) {
                let order_used = data_promotion.sale_order_used[idx];
                if (order_used.customer_id === customer_id) {
                    check_max_usages++
                }
            }
            if (check_max_usages >= max_usages) {
                return false
            }
        }
        // CHECK USE COUNT
        let use_count = conditionCheck.use_count;
        if (use_count > 0) {
            let times_condition = conditionCheck.times_condition;
            let check_use_count = 0;
            for (let i = 0; i < data_promotion.sale_order_used.length; i++) {
                let order_used = data_promotion.sale_order_used[i];
                if (order_used.customer_id === customer_id) {
                    if (times_condition === 1) { // IN VALID TIME
                        let dateToCheck = new Date(moment(order_used.date_created).format('YYYY-MM-DD')).getTime();
                        let startDate = new Date(data_promotion.valid_date_start).getTime();
                        let endDate = new Date(data_promotion.valid_date_end).getTime();
                        if (dateToCheck >= startDate && dateToCheck <= endDate) {
                            check_use_count++
                        }
                    } else if (times_condition === 2) { // IN CURRENT WEEK
                        let dateToCheck = new Date(moment(order_used.date_created).format('YYYY-MM'));
                        let dateCurrent = new Date(moment($('#quotation-create-date-created').val()).format('YYYY-MM'));
                        const weekNumber1 = self.getWeekNumber(dateToCheck);
                        const weekNumber2 = self.getWeekNumber(dateCurrent);
                        if (weekNumber1 === weekNumber2) {
                            check_use_count++
                        }
                    } else if (times_condition === 3) { // IN CURRENT MONTH
                        let dateToCheck = new Date(moment(order_used.date_created).format('YYYY-MM')).getTime();
                        let dateCurrent = new Date(moment($('#quotation-create-date-created').val()).format('YYYY-MM')).getTime();
                        if (dateToCheck === dateCurrent) {
                            check_use_count++
                        }
                    }
                }
            }
            if (check_use_count >= use_count) {
                return false
            }
        }
    return true
    }

    getWeekNumber(date) {
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(
            ((date - yearStart) / 86400000 + yearStart.getDay() + 1) / 7
        );
        return weekNumber;
    }

    getPromotionResult(condition) {
        let result = {
            'product_quantity': 0,
            'product_price': 0
        };
        let tableProd = $('#datable-quotation-create-product');
        let shippingFee = 0;
        let eleShipping = tableProd[0].querySelector('.table-row-shipping');
        if (eleShipping) {
            let shippingPrice = eleShipping.closest('tr').querySelector('.table-row-subtotal-raw');
            if (shippingPrice) {
                shippingFee = parseFloat(shippingPrice.value)
            }
        }
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
                        // check if shippingFee then minus
                        if (shippingFee > 0) {
                            total = (parseFloat(preTax) - parseFloat(discount)) - shippingFee;
                        }
                        DiscountAmount = ((total * parseFloat(condition.percent_discount)) / 100);
                        // check discount amount with max discount amount & re calculate discount_rate_on_order
                        discount_rate_on_order = parseFloat(condition.percent_discount);
                        if (DiscountAmount > parseFloat(condition.max_amount)) {
                            DiscountAmount = parseFloat(condition.max_amount)
                            discount_rate_on_order = ((DiscountAmount / total) * 100)
                        }
                    } else if (condition.is_after_tax === true) {
                        let total = document.getElementById('quotation-create-product-total-raw').value;
                        // check if shippingFee then minus
                        if (shippingFee > 0) {
                            total = parseFloat(document.getElementById('quotation-create-product-total-raw').value) - shippingFee;
                        }
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
                        // check if shippingFee then minus
                        if (shippingFee > 0) {
                            total = (parseFloat(preTax) - parseFloat(discount)) - shippingFee;
                        }
                        discount_rate_on_order = ((DiscountAmount / total) * 100)
                    } else if (condition.is_after_tax === true) {
                        DiscountAmount = condition.fix_value;
                        let total = document.getElementById('quotation-create-product-total-raw').value;
                        // check if shippingFee then minus
                        if (shippingFee > 0) {
                            total = parseFloat(document.getElementById('quotation-create-product-total-raw').value) - shippingFee;
                        }
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

    reCalculateIfPromotion(table, promotion_discount_rate, promotion_amount, is_before_tax = true) {
        let eleTaxes = document.getElementById('quotation-create-product-taxes');
        let eleTaxesRaw = document.getElementById('quotation-create-product-taxes-raw');
        let taxAmountTotal = 0;
        if (is_before_tax === true) {
            for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
                let row = table[0].tBodies[0].rows[i];
                if (!row.querySelector('.table-row-shipping')) {
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
                            if ($(eleTax).val()) {
                                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                                if (dataTax.hasOwnProperty('rate')) {
                                    tax = parseInt(dataTax.rate);
                                }
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
            }
        } else if (is_before_tax === false) {
            let totalTaxAmountMinus = 0;
            for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
                let row = table[0].tBodies[0].rows[i];
                if (!row.querySelector('.table-row-shipping')) {
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
                            if ($(eleTax).val()) {
                                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                                if (dataTax.hasOwnProperty('rate')) {
                                    tax = parseInt(dataTax.rate);
                                }
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
            }
            taxAmountTotal = parseFloat(eleTaxesRaw.value) - totalTaxAmountMinus;
        }
        // apply Final Tax
        $(eleTaxes).attr('data-init-money', String(taxAmountTotal));
        eleTaxesRaw.value = taxAmountTotal;

        let eleTotal = document.getElementById('quotation-create-product-total');
        let eleTotalRaw = document.getElementById('quotation-create-product-total-raw');

        // ReCalculate TOTAL
        let elePretaxAmountRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
        let eleDiscountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
        let totalFinal = (parseFloat(elePretaxAmountRaw.value) - parseFloat(eleDiscountRaw.value) - parseFloat(promotion_amount) + taxAmountTotal);
        document.getElementById('quotation-final-revenue-before-tax').value = (parseFloat(elePretaxAmountRaw.value) - parseFloat(eleDiscountRaw.value) - parseFloat(promotion_amount));
        if (is_before_tax === false) { // CASE AFTER TAX
            totalFinal = (parseFloat(eleTotalRaw.value) - promotion_amount);
            document.getElementById('quotation-final-revenue-before-tax').value = (totalFinal - taxAmountTotal);
        }

        // apply Final Total
        $(eleTotal).attr('data-init-money', String(totalFinal));
        eleTotalRaw.value = totalFinal;

        $.fn.initMaskMoney2();
    }

    checkPromotionIfSubmit(promotion_id, customer_id = null) {
        let jqueryId = '#' + promotion_id;
        let ele = $(jqueryId);
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        let checkList = [];
        if (customer_id) {
            let data_filter = {
                'customer_type': 0,
                'customers_map_promotion__id': customer_id
            };
            $.fn.callAjax(url, method, data_filter).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('promotion_check_list') && Array.isArray(data.promotion_check_list)) {
                            let check_length = 0;
                            let eleCheck = $('#quotation-check-promotion');
                            data.promotion_check_list.map(function (item) {
                                if (!checkList.includes(item.id)) {
                                    let check = promotionClass.checkAvailablePromotion(item, customer_id);
                                    if (check.is_pass === false) {
                                        let tableProduct = document.getElementById('datable-quotation-create-product');
                                        let rowPromotion = tableProduct.querySelector('.table-row-promotion');
                                        if (rowPromotion) {
                                            if (item.id === rowPromotion.getAttribute('data-id')) {
                                                eleCheck.val('false');
                                            }
                                        }
                                    }
                                    checkList.push(item.id)
                                }
                                check_length++;
                                if (check_length === data.promotion_check_list.length) {
                                    if (!eleCheck.val()) {
                                        eleCheck.val('true');
                                    }
                                }
                            })
                        }
                    }
                }
            )
        }
    }
}

// Shipping
class shippingHandle {
    checkAvailableShipping(data_shipping, shippingAddress) {
        let final_shipping_price = 0;
        let margin_shipping_price = 0;
        let formula_condition = data_shipping.formula_condition;
        let margin = parseFloat(data_shipping.margin);
        let isPass = false;
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
                        let result_to_check = 0;
                        for (let idx = 0; idx < table.tBodies[0].rows.length; idx++) {
                            let row = table.tBodies[0].rows[idx];
                            if (row.querySelector('.table-row-item')) {
                                let quantity = row.querySelector('.table-row-quantity');
                                let elePrice = row.querySelector('.table-row-price');
                                if (unit.title === "price") { // if condition is price
                                    if (quantity && elePrice) {
                                        result_to_check += (parseFloat(quantity.value) * $(elePrice).valCurrency());
                                    }
                                } else if (unit.title === "quantity") { // if condition is quantity
                                    if (quantity) {
                                        result_to_check += parseFloat(quantity.value);
                                    }
                                } else if (unit.title === "volume") { // if condition is volume
                                    return {
                                        'is_pass': isPass,
                                        'final_shipping_price': final_shipping_price
                                    }
                                } else if (unit.title === "weight") { // if condition is weight
                                    return {
                                        'is_pass': isPass,
                                        'final_shipping_price': final_shipping_price
                                    }
                                }
                            }
                        }
                        if (operator === 1) {
                            if (result_to_check < amount_condition) {
                                isPass = true;
                            }
                        } else if (operator === 2) {
                            if (result_to_check > amount_condition) {
                                isPass = true;
                            }
                        } else if (operator === 3) {
                            if (result_to_check <= amount_condition) {
                                isPass = true;
                            }
                        } else if (operator === 4) {
                            if (result_to_check >= amount_condition) {
                                isPass = true;
                            }
                        }
                        if (isPass === true) {
                            if (data_shipping.cost_method === 0) {
                                final_shipping_price = parseFloat(data_shipping.fixed_price);
                            } else if (data_shipping.cost_method === 1) {
                                final_shipping_price = (shipping_price + (extra_amount * result_to_check));
                            }
                            if (margin > 0) {
                                margin_shipping_price = ((final_shipping_price * margin) / 100);
                                final_shipping_price = (final_shipping_price + margin_shipping_price)
                            }
                            return {
                                'is_pass': isPass,
                                'final_shipping_price': final_shipping_price,
                                'margin_shipping_price': margin_shipping_price,
                                'data_shipping': {
                                    'shipping_id': data_shipping.id,
                                    'shipping_title': data_shipping.title,
                                    'shipping_code': data_shipping.code,
                                },
                            }
                        }
                    }
                }
            }
        }
        return {
            'is_pass': isPass,
            'final_shipping_price': final_shipping_price
        }
    }

    reCalculateIfShipping(shipping_price) {
        let elePretaxAmount = document.getElementById('quotation-create-product-pretax-amount');
        let eleTotalAmount = document.getElementById('quotation-create-product-total');
        let elePretaxAmountRaw = document.getElementById('quotation-create-product-pretax-amount-raw');
        let eleDiscountAmountRaw = document.getElementById('quotation-create-product-discount-amount-raw');
        let eleTaxAmountRaw = document.getElementById('quotation-create-product-taxes-raw');
        let eleTotalAmountRaw = document.getElementById('quotation-create-product-total-raw');

        // Re calculate pretax, discount, total
        let pretaxNew = parseFloat(elePretaxAmountRaw.value) + parseFloat(shipping_price);
        let totalNew = (pretaxNew - parseFloat(eleDiscountAmountRaw.value) + parseFloat(eleTaxAmountRaw.value));
        document.getElementById('quotation-final-revenue-before-tax').value = (pretaxNew - parseFloat(eleDiscountAmountRaw.value));

        // Apply new pretax, total
        $(elePretaxAmount).attr('data-init-money', String(pretaxNew));
        elePretaxAmountRaw.value = pretaxNew;
        $(eleTotalAmount).attr('data-init-money', String(totalNew));
        eleTotalAmountRaw.value = totalNew;

        $.fn.initMaskMoney2();
    }
}
