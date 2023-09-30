let tableIndicator = $('#datable-quotation-create-indicator');

function max(data_list) {
  return Math.max(...data_list);
}

function min(data_list) {
  return Math.min(...data_list);
}

function sum() {
  return Array.prototype.reduce.call(arguments, function(acc, val) {
    return acc + val;
  }, 0);
}

function dataTableQuotationIndicator(data) {
    tableIndicator.DataTableDefault({
        data: data ? data : [],
        paging: false,
        info: false,
        columnDefs: [],
        drawCallback: function () {
            // render icon after table callback
            feather.replace();
            $.fn.initMaskMoney2();
        },
        rowCallback: function (row, data) {
        },
        columns: [
            {
                targets: 0,
                render: (data, type, row, meta) => {
                    return `<span class="table-row-order" data-value="${(meta.row + 1)}">${(meta.row + 1)}</span>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<span class="table-row-title" data-id="${row.indicator.id}">${row.indicator.title}</span>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row.indicator_value)}" data-value="${row.indicator_value}"></span>`
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return `<span class="table-row-rate" data-value="${row.indicator_rate}">${row.indicator_rate} %</span>`
                }
            }
        ],
    });
}

function dataTableSaleOrderIndicator(data) {
    tableIndicator.DataTableDefault({
        data: data ? data : [],
        paging: false,
        info: false,
        columnDefs: [],
        drawCallback: function () {
            // render icon after table callback
            feather.replace();
            $.fn.initMaskMoney2();
        },
        rowCallback: function (row, data) {
        },
        columns: [
            {
                targets: 0,
                render: (data, type, row, meta) => {
                    return `<span class="table-row-order" data-value="${(meta.row + 1)}">${(meta.row + 1)}</span>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    // return `<span class="table-row-title" data-id="${row.indicator.id}">${row.indicator.title}</span>`
                    return `<span class="table-row-title" data-id="${row.quotation_indicator.id}">${row.quotation_indicator.title}</span>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<span class="mask-money table-row-quotation-value" data-init-money="${parseFloat(row.quotation_indicator_value)}" data-value="${row.quotation_indicator_value}"></span>`
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row.indicator_value)}" data-value="${row.indicator_value}"></span>`
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    return `<span class="mask-money table-row-difference-value" data-init-money="${parseFloat(row.difference_indicator_value)}" data-value="${row.difference_indicator_value}"></span>`
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    return `<span class="table-row-rate" data-value="${row.indicator_rate}">${row.indicator_rate} %</span>`
                }
            }
        ],
    });
}

// function loadQuotationIndicator(indicator_id) {
//     let jqueryId = '#' + indicator_id;
//     let ele = $(jqueryId);
//     if (!ele.val()) {
//         let url = ele.attr('data-url');
//         let method = ele.attr('data-method');
//         $.fn.callAjax(url, method).then(
//             (resp) => {
//                 let data = $.fn.switcherResp(resp);
//                 if (data) {
//                     if (data.hasOwnProperty('quotation_indicator_list') && Array.isArray(data.quotation_indicator_list)) {
//                         ele.val(JSON.stringify(data.quotation_indicator_list));
//                         calculateIndicator(data.quotation_indicator_list);
//                     }
//                 }
//             }
//         )
//     } else {
//         let data_list = JSON.parse(ele.val());
//         calculateIndicator(data_list);
//     }
//
// }

function calculateIndicator(indicator_list) {
    let result_list = [];
    let result_json = {};
    let revenueValue = 0;
    let rateValue = 0;
    let formSubmit = $('#frm_quotation_create');
    let is_sale_order = false;
    let _form = new SetupFormSubmit(formSubmit);
    if (formSubmit[0].classList.contains('sale-order')) {
        is_sale_order = true;
    }
    QuotationSubmitHandle.setupDataSubmit(_form, is_sale_order);
    let data_form = _form.dataForm;
    // Check special case
    functionClass.checkSpecialCaseIndicator(data_form);
    for (let indicator of indicator_list) {
        let parse_formula = "";
        let formula_data = indicator.formula_data;
        for (let item of formula_data) {
            if (typeof item === 'object' && item !== null) {
                if (item.hasOwnProperty('is_property')) {
                    if (data_form.hasOwnProperty(item.code)) {
                        parse_formula += data_form[item.code];
                    }
                } else if (item.hasOwnProperty('is_indicator')) {
                    if (result_json.hasOwnProperty(item.order)) {
                        if (item.order < indicator.order) {
                            parse_formula += result_json[item.order].indicator_value;
                        }
                    }
                } else if (item.hasOwnProperty('param_type')) {
                    if (item.param_type === 2) { // FUNCTION
                        if (item.code === 'max' || item.code === 'min') {
                            let functionData = functionClass.functionMaxMin(item, data_form, result_json);
                            parse_formula += functionData;
                        } else if (item.code === 'sumItemIf') {
                            let functionData = functionClass.functionSumItemIf(item, data_form, is_sale_order);
                            parse_formula += functionData;
                        }
                    }
                }
            } else if (typeof item === 'string') {
                parse_formula += item;
            }
        }
        // calculate
        // value
        let value = evaluateFormula(parse_formula);
        if (!value || ['', "", "undefined", null].includes(value)) {
            value = 0;
        }
        // rate value
        if (indicator.title === "Revenue") {
            revenueValue = value
        }
        if (revenueValue !== 0) {
           rateValue = ((value / revenueValue) * 100).toFixed(1);
        }
        // quotation value
        let quotationValue = 0;
        let differenceValue = value;
        // check if sale order then get quotation value
        let eleDetailQuotation = $('#data-copy-quotation-detail');
        if (eleDetailQuotation.length) {
            if (eleDetailQuotation.val()) {
                let dataDetail = JSON.parse(eleDetailQuotation.val());
                for (let quotation_indicator of dataDetail.quotation_indicators_data) {
                    if (indicator.title === quotation_indicator.indicator.title) {
                        quotationValue = quotation_indicator.indicator_value;
                        differenceValue = (value - quotation_indicator.indicator_value);
                        break;
                    }
                }
            }
        }
        // append result
        result_list.push({
            'indicator': {
                'id': indicator.id,
                'title': indicator.title,
            },
            'quotation_indicator': {
                'id': indicator.id,
                'title': indicator.title,
            },
            'order': indicator.order,
            'indicator_value': value,
            'indicator_rate': rateValue,
            'quotation_indicator_value': quotationValue,
            'difference_indicator_value': differenceValue,
        });
        result_json[indicator.order] = {
            'indicator_value': value,
            'indicator_rate': rateValue
        }
    }
    //
    tableIndicator.DataTable().destroy();
    if (!tableIndicator.hasClass('sale-order')) {
        dataTableQuotationIndicator(result_list);
    } else {
        dataTableSaleOrderIndicator(result_list)
    }
}

function evaluateFormula(formulaText) {
    try {
        return eval(formulaText);
        // return evaluated;
    } catch (error) {
        return null;
    }
}

// INDICATOR FUNCTIONS
class indicatorFunctionHandle {
    functionMaxMin(item, data_form, result_json) {
        let functionBody = "[";
        let idx = 0;
        for (let function_child of item.function_data) {
            idx++;
            if (typeof function_child === 'object' && function_child !== null) {
                if (function_child.hasOwnProperty('is_property')) {
                    if (data_form.hasOwnProperty(function_child.code)) {
                        functionBody += data_form[function_child.code];
                        if (idx < item.function_data.length) {
                            functionBody += ",";
                        }
                    }
                } else if (function_child.hasOwnProperty('is_indicator')) {
                    if (result_json.hasOwnProperty(function_child.order)) {
                        functionBody += result_json[function_child.order].indicator_value;
                        if (idx < item.function_data.length) {
                            functionBody += ",";
                        }
                    }
                }
            } else if (typeof function_child === 'string') {
                functionBody += function_child;
                if (idx < item.function_data.length) {
                    functionBody += ",";
                }
            }
        }
        return item.syntax + functionBody + "])";
    }

    functionSumItemIf(item, data_form, is_sale_order) {
        let self = this;
        let syntax = "sum(";
        let functionBody = "";
        let leftValueJSON = null;
        let rightValue = null;
        let operator_list = ['===', '!==', '<', '>', '<=', '>='];
        let condition_operator = operator_list.filter((element) => item.function_data.includes(element))[0];
        let operatorIndex = item.function_data.indexOf(condition_operator);
        if (operatorIndex !== -1 && operatorIndex > 0 && operatorIndex < item.function_data.length - 1) {
            leftValueJSON = item.function_data[operatorIndex - 1];
            rightValue = item.function_data[operatorIndex + 1];
        }
        let lastElement = item.function_data[item.function_data.length - 1];
        // Tab Products
        if (data_form?.['quotation_products_data']) {}
        // Tab Expense
        if (is_sale_order === false) {
            if (data_form?.['quotation_expenses_data']) {
                functionBody = self.extractDataToSum(data_form?.['quotation_expenses_data'], leftValueJSON, condition_operator, rightValue, lastElement);
            }
        } else {
            if (data_form?.['sale_order_expenses_data']) {
                functionBody = self.extractDataToSum(data_form?.['sale_order_expenses_data'], leftValueJSON, condition_operator, rightValue, lastElement);
            }
        }
        if (functionBody[functionBody.length - 1] === ",") {
            let functionBodySlice = functionBody.slice(0, -1);
            return syntax + functionBodySlice + ")";
        }
        return syntax + functionBody + ")";
    }

    extractDataToSum(data_list, leftValueJSON, condition_operator, rightValue, lastElement) {
        let functionBody = "";
        for (let data of data_list) {
            if (typeof leftValueJSON === 'object' && leftValueJSON !== null) {
                if (data.hasOwnProperty(leftValueJSON.code)) {
                    let leftValue = data[leftValueJSON.code].replace(/\s/g, "").toLowerCase();
                    let checkExpression = `"${leftValue}" ${condition_operator} "${rightValue}"`;
                    let check = evaluateFormula(checkExpression);
                    if (check === true) {
                        functionBody += String(data[lastElement.code]);
                        functionBody += ",";
                    }
                }
            }
        }
        return functionBody
    }

    checkSpecialCaseIndicator(data_form) {
        // check if product data has promotion gift then => += vào total_cost_pretax_amount
        if (data_form.hasOwnProperty('total_cost_pretax_amount')) {
            let promotion = document.getElementById('datable-quotation-create-product').querySelector('.table-row-promotion');
            if (promotion) {
                if (promotion.closest('tr').querySelector('.table-row-description').value === '(Gift)') {
                    let productGift = promotion.getAttribute('data-id-product');
                    let product_data_list = [];
                    if (data_form.hasOwnProperty('quotation_costs_data')) {
                        product_data_list = data_form['quotation_costs_data'];
                    } else if (data_form.hasOwnProperty('sale_order_costs_data')) {
                        product_data_list = data_form['sale_order_costs_data'];
                    }
                    for (let product of product_data_list) {
                        if (product.product === productGift) {
                            data_form['total_cost_pretax_amount'] += product.product_cost_price;
                            break;
                        }
                    }
                }
            }
        }
    }

}

let functionClass = new indicatorFunctionHandle();


$(function () {

    $(document).ready(function () {

        function initDataTableIndicator() {
            if (!tableIndicator.hasClass('sale-order')) {
                dataTableQuotationIndicator();
            } else {
                dataTableSaleOrderIndicator();
            }
        }
        initDataTableIndicator();

        $('#tab-indicator').on('click', function () {
            let btnEdit = $('#btn-edit_quotation');
            if (btnEdit.length) {
                if (btnEdit.is(':hidden')) {
                    indicatorClass.loadQuotationIndicator('quotation-indicator-data');
                } else {
                    if (tableIndicator[0].querySelector('.dataTables_empty')) {
                        let detailData = JSON.parse($('#quotation-detail-data').val());
                        tableIndicator.DataTable().destroy();
                        if (!tableIndicator.hasClass('sale-order')) {
                            dataTableQuotationIndicator(detailData.quotation_indicators_data);
                        } else {
                            dataTableSaleOrderIndicator(detailData?.['sale_order_indicators_data']);
                        }
                    }
                }
            } else {
                indicatorClass.loadQuotationIndicator('quotation-indicator-data');
            }
        });

        // Clear data indicator store then call API to get new
        $('#btn-refresh-quotation-indicator').on('click', function () {
            let transEle = $('#app-trans-factory');
            document.getElementById('quotation-indicator-data').value = "";
            indicatorClass.loadQuotationIndicator('quotation-indicator-data');
            $.fn.notifyB({description: transEle.attr('data-refreshed')}, 'success');
        });

    });
});