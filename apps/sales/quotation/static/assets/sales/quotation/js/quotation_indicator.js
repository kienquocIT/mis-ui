let submitClass = new submitHandle();
let tableIndicator = $('#datable-quotation-create-indicator');

function max(data_list) {
  return Math.max(...data_list);
}

function min(data_list) {
  return Math.min(...data_list);
}

function dataTableQuotationIndicator(data, table_id) {
    // init dataTable
    let listData = data ? data : [];
    let jqueryId = '#' + table_id;
    let $tables = $(jqueryId);
    $tables.DataTable({
        data: listData,
        searching: false,
        ordering: false,
        paginate: false,
        info: false,
        drawCallback: function (row, data) {
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
                    return `<span class="table-row-order">${(meta.row + 1)}</span>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<span class="table-row-title">${row.title}</span>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${parseFloat(row.value)}"></span>`
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return `<span class="table-row-title">${row.rate} %</span>`
                }
            }
        ],
    });
}

function loadQuotationIndicator(indicator_id) {
    let jqueryId = '#' + indicator_id;
    let ele = $(jqueryId);
    if (!ele.val()) {
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('quotation_indicator_list') && Array.isArray(data.quotation_indicator_list)) {
                        ele.val(JSON.stringify(data.quotation_indicator_list));
                        calculateIndicator(data.quotation_indicator_list);
                    }
                }
            }
        )
    } else {
        let data_list = JSON.parse(ele.val());
        calculateIndicator(data_list);
    }

}

function calculateIndicator(indicator_list) {
    let result_list = [];
    let result_json = {}
    let is_sale_order = false;
    let _form = new SetupFormSubmit($('#frm_quotation_create'));
    submitClass.setupDataSubmit(_form, is_sale_order);
    let data_form = _form.dataForm;
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
                            parse_formula += result_json[item.order].value;
                        }
                    }
                } else if (item.hasOwnProperty('param_type')) {
                    if (item.param_type === 2) { // FUNCTION
                        if (item.code === 'max' || item.code === 'min') {
                            let functionData = functionClass.functionMaxMin(item, data_form, result_json);
                            parse_formula += functionData;
                        } else if (item.code === 'sumItemIf') {
                            let functionData = functionClass.functionSumItemIf(item, data_form);
                            parse_formula += functionData;
                        }
                    }
                }
            } else if (typeof item === 'string') {
                parse_formula += item;
            }
        }
        // calculate
        let value = evaluateFormula(parse_formula);
        if (typeof value === 'number') {
            if (value < 0) {
                value = 0;
            }
            result_list.push({
                'order': indicator.order,
                'title': indicator.title,
                'value': value,
                'rate': 100
            });
            result_json[indicator.order] = {
                'value': value,
                'rate': 100
            }
        }
    }
    //
    tableIndicator.DataTable().destroy();
    dataTableQuotationIndicator(result_list, 'datable-quotation-create-indicator');
}

function evaluateFormula(formulaText) {
    try {
        const evaluated = eval(formulaText);
        return evaluated;
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
                        functionBody += result_json[function_child.order].value;
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

    functionSumItemIf(item, data_form) {
        let syntax = "sum(";
        let functionBody = "";
        let leftValue = null;
        let rightValue = null;
        let operator_list = ['===', '!==', '<', '>', '<=', '>='];
        let condition_operator = operator_list.filter((element) => item.function_data.includes(element))[0];
        const operatorIndex = item.function_data.indexOf(condition_operator);
        if (operatorIndex !== -1 && operatorIndex > 0 && operatorIndex < item.function_data.length - 1) {
            leftValue = item.function_data[operatorIndex - 1];
            rightValue = item.function_data[operatorIndex + 1];
        }
        let lastElement = item.function_data[item.function_data.length - 1];
        for (let product_data of data_form.quotation_products_data) {
            if (typeof leftValue === 'object' && leftValue !== null) {
                if (product_data.hasOwnProperty(leftValue.code)) {
                    let check = evaluateFormula(product_data[leftValue.code].replace(/\s/g, "") + condition_operator + rightValue);
                    if (check === true) {
                        functionBody += product_data[lastElement.code]
                    }
                }
            }
        }
        return syntax + functionBody + ")";
    }

}

let functionClass = new indicatorFunctionHandle();


$(function () {

    $(document).ready(function () {

        $('#tab-indicator').on('click', function (e) {
            loadQuotationIndicator('quotation-indicator-data');
        });

        $('#btn-refresh-quotation-indicator').on('click', function (e) {
            loadQuotationIndicator('quotation-indicator-data');
        });

    });
});