const fixed_costs_table = $('#fixed-costs-table')
const add_new_fixed_expense = $('#add-new-fixed-expense')
const variable_costs_table = $('#variable-costs-table')
const add_new_variable_expense = $('#add-new-variable-expense')
const productEle = $('#product')
const suppliersEle = $('#suppliers')
const no_of_months = $('#no-of-months')

function loadFixedCostsTable() {
    fixed_costs_table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
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
                    return `<select class="form-select select2"></select>`
                }
            },
            {
                className: 'wrap-text w-40',
                'render': (data, type, row) => {
                    return `<input class="form-control mask-money" value="0">`;
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
                    return `<select class="form-select select2"></select>`
                }
            },
            {
                className: 'wrap-text w-40',
                'render': (data, type, row) => {
                    return `<input class="form-control mask-money" value="0">`;
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
    })
}

function addRow(table, data) {
    data.map(function (item) {
        table.DataTable().row.add(item).draw();
    })
}

function deleteRow(table, currentRow) {
    currentRow = parseInt(currentRow) - 1
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    row.remove().draw();
}

add_new_fixed_expense.on('click', function () {
    addRow(fixed_costs_table, [{}])
})

add_new_variable_expense.on('click', function () {
    addRow(variable_costs_table, [{}])
})

$(document).on("click", '.del-expense-row', function () {
    deleteRow($(this).closest('table'), $(this).closest('tr').find('td:eq(0)').text())
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