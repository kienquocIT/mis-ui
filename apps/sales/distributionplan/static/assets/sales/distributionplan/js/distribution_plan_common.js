const title_box = $('#title')
const fixed_costs_table = $('#fixed-costs-table')
const add_new_fixed_expense_btn = $('#add-new-fixed-expense')
const variable_costs_table = $('#variable-costs-table')
const add_new_variable_expense_btn = $('#add-new-variable-expense')
const product_box = $('#product')
const suppliers_box = $('#suppliers')
const no_of_months_box = $('#no-of-months')
const no_month_box = $('.no-month')
const start_date_box = $('#start-date')
const end_date_box = $('#end-date')
const product_price_box = $('#product-price')
const break_event_point_box = $('#break-event-point')
const break_event_point_all_box = $('#break-event-point-all')
const expected_number_box = $('#expected-number')
const expected_number_all_box = $('#expected-number-all')
const net_income_box = $('#net-income')
const net_income_all_box = $('#net-income-all')
const rate_box = $('#rate')
const plan_des_box = $('#plan-des')
const script_url = $('#script-url')

start_date_box.daterangepicker({
    singleDatePicker: true,
    timepicker: false,
    showDropdowns: false,
    minYear: 2023,
    locale: {
        format: 'DD/MM/YYYY'
    },
    maxYear: parseInt(moment().format('YYYY'), 10),
    drops: 'up',
    autoApply: true,
}).on('change', function () {
    end_date_box.val(findEndDate(start_date_box.val(), parseFloat(no_of_months_box.val())))
});

end_date_box.val(findEndDate(start_date_box.val(), parseFloat(no_of_months_box.val())))

function loadFixedCostsTable(data_list=[], option='create') {
    fixed_costs_table.DataTable().clear().destroy()
    fixed_costs_table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollY: '35vh',
        scrollX: '100vw',
        scrollCollapse: true,
        data: data_list,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'wrap-text w-50',
                'render': () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 fixed-cost-expense-item"></select>`
                }
            },
            {
                className: 'wrap-text w-40',
                'render': () => {
                    return `<input ${option === 'detail' ? 'readonly disabled' : ''} class="form-control mask-money text-right fixed-cost-value" value="0">`;
                }
            },
            {
                className: 'wrap-text w-10 text-center',
                'render': () => {
                    return `<button type="button" class="btn ${option === 'detail' ? 'disabled' : ''} del-expense-row"><i class="fas fa-trash-alt text-secondary"></i></button>`;
                }
            },
        ],
        initComplete: function () {
            if (data_list.length > 0) {
                fixed_costs_table.find('tbody tr').each(function (index) {
                    loadExpenseItem($(this).find('.fixed-cost-expense-item'), data_list[index]?.['expense_item'])
                    $(this).find('.fixed-cost-value').attr('value', data_list[index]?.['value'])
                })
            }
        }
    });
}

function loadVariableCostsTable(data_list=[], option='create') {
    variable_costs_table.DataTable().clear().destroy()
    variable_costs_table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollY: '35vh',
        scrollX: '100vw',
        scrollCollapse: true,
        data: data_list,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'wrap-text w-50',
                'render': () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 variable-cost-expense-item"></select>`
                }
            },
            {
                className: 'wrap-text w-40',
                'render': () => {
                    return `<input ${option === 'detail' ? 'readonly disabled' : ''} class="form-control text-right mask-money variable-cost-value" value="0">`;
                }
            },
            {
                className: 'wrap-text w-10 text-center',
                'render': () => {
                    return `<button type="button" class="btn ${option === 'detail' ? 'disabled' : ''} del-expense-row"><i class="fas fa-trash-alt text-secondary"></i></button>`;
                }
            },
        ],
        initComplete: function () {
            if (data_list.length > 0) {
                variable_costs_table.find('tbody tr').each(function (index) {
                    loadExpenseItem($(this).find('.variable-cost-expense-item'), data_list[index]?.['expense_item'])
                    $(this).find('.variable-cost-value').attr('value', data_list[index]?.['value'])
                })
            }
        }
    });
}

function loadProduct(data) {
    product_box.initSelect2({
        ajax: {
            url: product_box.attr('data-url'),
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
    suppliers_box.initSelect2({
        ajax: {
            url: suppliers_box.attr('data-url'),
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

function init_tinymce(option='create') {
    plan_des_box.tinymce({
        height: 300,
        menubar: false,
        readonly: option === 'detail',
        placeholder: "Thị trường, Thị phần, Đối thủ cạnh tranh, Yêu cầu về vốn, Yêu cầu khác",
        plugins: [
           'advlist','autolink',
           'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
           'fullscreen','insertdatetime','media','table','help','wordcount'
        ],
        toolbar: 'undo redo | a11ycheck casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent | removeformat | code table help'
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

function findEndDate(startDate, n) {
    const [day, month, year] = startDate.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    date.setMonth(date.getMonth() + n);
    if (date.getDate() < day) {
        date.setDate(0); // Lùi về ngày cuối cùng của tháng trước
    }
    const resultDay = String(date.getDate()).padStart(2, '0');
    const resultMonth = String(date.getMonth() + 1).padStart(2, '0');
    const resultYear = date.getFullYear();
    return moment(new Date(resultYear, resultMonth - 1, resultDay)).format('DD/MM/YYYY');
}

no_of_months_box.on('change', function () {
    if (no_of_months_box.val()) {
        no_month_box.text(no_of_months_box.val() ? no_of_months_box.val() : 0)
        expected_number_all_box.val(expected_number_box.val() ? parseFloat(expected_number_box.val()) * parseFloat(no_of_months_box.val()) : 0)
        calculate_break_event_point()
        calculate_net_income()
    }
    else {
        no_of_months_box.val(1)
    }
    end_date_box.val(findEndDate(start_date_box.val(), parseFloat(no_of_months_box.val())))
})

add_new_fixed_expense_btn.on('click', function () {
    addRow(fixed_costs_table, {})
    let row_added = fixed_costs_table.find('tbody tr:last-child')
    loadExpenseItem(row_added.find('.fixed-cost-expense-item'))
})

add_new_variable_expense_btn.on('click', function () {
    addRow(variable_costs_table, {})
    let row_added = variable_costs_table.find('tbody tr:last-child')
    loadExpenseItem(row_added.find('.variable-cost-expense-item'))
})

$(document).on("click", '.del-expense-row', function () {
    deleteRow($(this).closest('table'), $(this).closest('tr').find('td:eq(0)').text())
    calculate_break_event_point()
    calculate_net_income()
})

function calculate_break_event_point() {
    debugger
    let product_price_value = product_price_box.attr('value') ? parseFloat(product_price_box.attr('value')) : 0
    let sum_fixed_cost = 0
    let sum_variable_cost = 0
    fixed_costs_table.find('tbody tr').each(function () {
        sum_fixed_cost += $(this).find('.fixed-cost-value').attr('value') ? parseFloat($(this).find('.fixed-cost-value').attr('value')) : 0
    })
    variable_costs_table.find('tbody tr').each(function () {
        sum_variable_cost += $(this).find('.variable-cost-value').attr('value') ? parseFloat($(this).find('.variable-cost-value').attr('value')) : 0
    })
    let break_event_point = product_price_value !== sum_variable_cost ? sum_fixed_cost / (product_price_value - sum_variable_cost) : 0
    let no_of_months = no_of_months_box.val() ? parseFloat(no_of_months_box.val()) : 0
    let break_event_point_all = break_event_point * no_of_months
    break_event_point_box.val(break_event_point.toFixed(2))
    break_event_point_all_box.val(break_event_point_all.toFixed(2))
}

function calculate_net_income() {
    let product_price_value = product_price_box.attr('value') ? parseFloat(product_price_box.attr('value')) : 0
    let expected_number_value = expected_number_box.val() ? parseFloat(expected_number_box.val()) : 0
    let sum_fixed_cost = 0
    fixed_costs_table.find('tbody tr').each(function () {
        sum_fixed_cost += $(this).find('.fixed-cost-value').attr('value') ? parseFloat($(this).find('.fixed-cost-value').attr('value')) : 0
    })
    let sum_variable_cost = 0
    variable_costs_table.find('tbody tr').each(function () {
        sum_variable_cost += $(this).find('.variable-cost-value').attr('value') ? parseFloat($(this).find('.variable-cost-value').attr('value')) : 0
    })
    let net_income_value = expected_number_value * (product_price_value - sum_variable_cost) - sum_fixed_cost
    let no_of_months = no_of_months_box.val() ? parseFloat(no_of_months_box.val()) : 0
    let net_income_value_all = net_income_value * no_of_months
    net_income_box.attr('value', net_income_value.toFixed(2))
    net_income_all_box.attr('value', net_income_value_all.toFixed(2))
    $.fn.initMaskMoney2()

    let rate_value = expected_number_value * product_price_value !== 0 ? (net_income_value * 100 / (expected_number_value * product_price_value)) : 0
    rate_box.val(rate_value.toFixed(2))
}

$(document).on("change", '.fixed-cost-value', function () {
    calculate_break_event_point()
    calculate_net_income()
})

$(document).on("change", '.variable-cost-value', function () {
    calculate_break_event_point()
    calculate_net_income()
})

product_price_box.on("change", function () {
    calculate_break_event_point()
    calculate_net_income()
})

expected_number_box.on("change", function () {
    calculate_net_income()
    expected_number_all_box.val(expected_number_box.val() ? parseFloat(expected_number_box.val()) * parseFloat(no_of_months_box.val()) : 0)
})

class DistributionPlanHandle {
    load(option) {
        loadProduct()
        loadSupplier()
        loadFixedCostsTable()
        loadVariableCostsTable()
        init_tinymce(option)
    }

    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = title_box.val()
        frm.dataForm['product'] = product_box.val()
        frm.dataForm['start_date'] = moment(start_date_box.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['end_date'] = moment(end_date_box.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['no_of_month'] = no_of_months_box.val()

        frm.dataForm['product_price'] = product_price_box.attr('value')
        frm.dataForm['break_event_point'] = break_event_point_box.val()
        frm.dataForm['expected_number'] = expected_number_box.val()
        frm.dataForm['net_income'] = net_income_box.attr('value')
        frm.dataForm['rate'] = rate_box.val()
        frm.dataForm['plan_description'] = plan_des_box.val()
        frm.dataForm['supplier_list'] = suppliers_box.val()

        let fixed_cost_list = []
        fixed_costs_table.find('tbody tr').each(function () {
            fixed_cost_list.push({
                'expense_item_id': $(this).find('.fixed-cost-expense-item').val(),
                'value': $(this).find('.fixed-cost-value').attr('value'),
                'order': $(this).find('td:eq(0)').text(),
            })
        })
        frm.dataForm['fixed_cost_list'] = fixed_cost_list

        let variable_cost_list = []
        variable_costs_table.find('tbody tr').each(function () {
            variable_cost_list.push({
                'expense_item_id': $(this).find('.variable-cost-expense-item').val(),
                'value': $(this).find('.variable-cost-value').attr('value'),
                'order': $(this).find('td:eq(0)').text(),
            })
        })
        frm.dataForm['variable_cost_list'] = variable_cost_list

        // console.log(frm.dataForm)
        return frm
    }
}

function Disable(option) {
    if (option === 'detail') {
        $('input').prop('readonly', true).prop('disabled', true)
        $('select').prop('disabled', true)
        add_new_fixed_expense_btn.prop('disabled', true)
        add_new_variable_expense_btn.prop('disabled', true)
    }
}

function LoadDetailDP(option) {
    let url_loaded = $('#form-detail-dp').attr('data-url');
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['distribution_plan_detail'];
                // console.log(data)
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                title_box.val(data?.['title'])
                loadProduct(data?.['product'])
                loadSupplier(data?.['supplier_list'])
                start_date_box.val(moment(data?.['start_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                end_date_box.val(moment(data?.['end_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                no_of_months_box.val(data?.['no_of_month'])
                no_month_box.text(data?.['no_of_month'])
                loadFixedCostsTable(data?.['fixed_cost_list'], option)
                loadVariableCostsTable(data?.['variable_cost_list'], option)
                product_price_box.attr('value', data?.['product_price'])
                break_event_point_box.val(parseFloat(data?.['break_event_point']).toFixed(2))
                break_event_point_all_box.val((parseFloat(data?.['break_event_point']) * parseFloat(data?.['no_of_month'])).toFixed(2))
                expected_number_box.val(data?.['expected_number'])
                expected_number_all_box.val(parseFloat(data?.['expected_number']) * parseFloat(data?.['no_of_month']))
                net_income_box.attr('value', data?.['net_income'])
                net_income_all_box.attr('value', (parseFloat(data?.['net_income']) * parseFloat(data?.['no_of_month'])).toFixed(2))
                rate_box.attr('value', parseFloat(data?.['rate']).toFixed(2))

                plan_des_box.val(data?.['plan_description'])
                setTimeout(function() {
                    tinymce.get("plan-des").setContent(data?.['plan_description']);
                }, 1000);

                Disable(option)
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
            }
        })
}
