const fixed_costs_table = $('#fixed-costs-table')
const add_new_fixed_expense = $('#add-new-fixed-expense')
const variable_costs_table = $('#variable-costs-table')
const add_new_variable_expense = $('#add-new-variable-expense')
const productEle = $('#product')
const suppliersEle = $('#suppliers')
const no_of_months = $('#no-of-months')
const start_date = $('#start-date')
const product_price = $('#product-price')
const break_event_point = $('#break-event-point')
const expected_number = $('#expected-number')
const net_income = $('#net-income')
const rate = $('#rate')
const script_url = $('#script-url')

start_date.daterangepicker({
    singleDatePicker: true,
    timepicker: false,
    showDropdowns: false,
    minYear: 2023,
    locale: {
        format: 'DD/MM/YYYY'
    },
    maxYear: parseInt(moment().format('YYYY'), 10),
    drops: 'up',
    // autoApply: true,
});

function loadFixedCostsTable() {
    fixed_costs_table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollY: '35vh',
        scrollCollapse: true,
        data: [],
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'wrap-text w-50',
                'render': (data, type, row) => {
                    return `<select class="form-select select2 fixed-cost-expense-item"></select>`
                }
            },
            {
                className: 'wrap-text w-40',
                'render': (data, type, row) => {
                    return `<input class="form-control mask-money text-right fixed-cost-value" value="0">`;
                }
            },
            {
                className: 'wrap-text w-10 text-center',
                'render': (data, type, row) => {
                    return `<a href="#" class="del-expense-row"><i class="fas fa-trash-alt text-secondary"></i></a>`;
                }
            },
        ],
    });
}

function loadVariableCostsTable() {
    variable_costs_table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollY: '35vh',
        scrollCollapse: true,
        data: [],
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'wrap-text w-50',
                'render': (data, type, row) => {
                    return `<select class="form-select select2 variable-cost-expense-item"></select>`
                }
            },
            {
                className: 'wrap-text w-40',
                'render': (data, type, row) => {
                    return `<input class="form-control text-right mask-money variable-cost-value" value="0">`;
                }
            },
            {
                className: 'wrap-text w-10 text-center',
                'render': (data, type, row) => {
                    return `<a href="#" class="del-expense-row"><i class="fas fa-trash-alt text-secondary"></i></a>`;
                }
            },
        ],
    });
}

function loadProduct(data) {
    productEle.initSelect2({
        ajax: {
            url: productEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadSupplier(data) {
    suppliersEle.initSelect2({
        ajax: {
            url: suppliersEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let res = []
            for (let i=0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['account_type'].includes("Supplier")) {
                    res.push(resp.data[keyResp][i])
                }
            }
            return res;
        },
        data: (data ? data : null),
        keyResp: 'account_list',
        keyId: 'id',
        keyText: 'name',
    })
}

function loadNoOfMonths(data) {
    no_of_months.initSelect2({
        data: [
            {'order': 1, 'month': 1},
            {'order': 2, 'month': 2},
            {'order': 3, 'month': 3},
            {'order': 4, 'month': 4},
            {'order': 5, 'month': 5},
            {'order': 6, 'month': 6},
            {'order': 7, 'month': 7},
            {'order': 8, 'month': 8},
            {'order': 9, 'month': 9},
            {'order': 10, 'month': 10},
            {'order': 11, 'month': 11},
            {'order': 12, 'month': 12},
        ],
        keyId: 'order',
        keyText: 'month',
    }).val(1).trigger('change')
}

function loadExpenseItem(ele, data) {
    ele.initSelect2({
        ajax: {
            url: script_url.attr('data-url-expense-item'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'expense_item_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function addRow(table, data) {
    table.DataTable().row.add(data).draw();
}

function deleteRow(table, currentRow) {
    currentRow = parseInt(currentRow) - 1
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    row.remove().draw();
}

add_new_fixed_expense.on('click', function () {
    addRow(fixed_costs_table, {})
    let row_added = fixed_costs_table.find('tbody tr:last-child')
    loadExpenseItem(row_added.find('.fixed-cost-expense-item'))
})

add_new_variable_expense.on('click', function () {
    addRow(variable_costs_table, {})
    let row_added = variable_costs_table.find('tbody tr:last-child')
    loadExpenseItem(row_added.find('.variable-cost-expense-item'))
})

$(document).on("click", '.del-expense-row', function () {
    deleteRow($(this).closest('table'), $(this).closest('tr').find('td:eq(0)').text())
})

function calculate_break_event_point() {
    let product_price_value = product_price.attr('value') ? parseFloat(product_price.attr('value')) : 0
    let sum_fixed_cost = 0
    let sum_variable_cost = 0
    fixed_costs_table.find('tbody tr').each(function () {
        sum_fixed_cost += $(this).find('.fixed-cost-value').attr('value') ? parseFloat($(this).find('.fixed-cost-value').attr('value')) : 0
    })
    variable_costs_table.find('tbody tr').each(function () {
        sum_variable_cost += $(this).find('.variable-cost-value').attr('value') ? parseFloat($(this).find('.variable-cost-value').attr('value')) : 0
    })
    break_event_point.val(product_price_value !== sum_variable_cost ? (sum_fixed_cost / (product_price_value - sum_variable_cost)).toFixed(2) : 0)
}

function calculate_net_income() {
    let product_price_value = product_price.attr('value') ? parseFloat(product_price.attr('value')) : 0
    let expected_number_value = expected_number.val() ? parseFloat(expected_number.val()) : 0
    let sum_fixed_cost = 0
    fixed_costs_table.find('tbody tr').each(function () {
        sum_fixed_cost += $(this).find('.fixed-cost-value').attr('value') ? parseFloat($(this).find('.fixed-cost-value').attr('value')) : 0
    })
    let sum_variable_cost = 0
    variable_costs_table.find('tbody tr').each(function () {
        sum_variable_cost += $(this).find('.variable-cost-value').attr('value') ? parseFloat($(this).find('.variable-cost-value').attr('value')) : 0
    })
    let net_income_value = expected_number_value * (product_price_value - sum_variable_cost) - sum_fixed_cost
    net_income.attr('value', net_income_value)
    $.fn.initMaskMoney2()

    let rate_value = expected_number_value * product_price_value !== 0 ? (net_income_value * 100 / (expected_number_value * product_price_value)).toFixed(2) : 0
    rate.val(rate_value)
}

$(document).on("change", '.fixed-cost-value', function () {
    calculate_break_event_point()
    calculate_net_income()
})

$(document).on("change", '.variable-cost-value', function () {
    calculate_break_event_point()
    calculate_net_income()
})

product_price.on("change", function () {
    calculate_break_event_point()
    calculate_net_income()
})

expected_number.on("change", function () {
    calculate_net_income()
})

class DistributionPlanHandle {
    load() {
        loadProduct()
        loadSupplier()
        loadNoOfMonths()
        loadFixedCostsTable()
        loadVariableCostsTable()
    }
}