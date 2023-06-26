let submitClass = new submitHandle();
let tableIndicator = $('#datable-quotation-create-indicator');

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