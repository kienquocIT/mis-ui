$(document).ready(function () {
    const $trans_script = $('#trans-script')
    const $url_script = $('#url-script')
    const $periodEle = $('#period-select')
    const $month_filter = $('#month-filter')
    const $quarter_filter = $('#quarter-filter')
    const $month_select = $('#month-select')
    const $quarter_select = $('#quarter-select')

    const $current_period_Ele = $('#current_period')
    let current_period = {}
    if ($current_period_Ele.text() !== '') {
        current_period = JSON.parse($current_period_Ele.text())
        getMonthOrder(current_period['space_month'], current_period?.['fiscal_year'])
        $month_select.val(new Date().getMonth() - current_period['space_month'] + 1).trigger('change');
    }

    function getQuarterMonth(quarter) {
        let month_list = []
        for (let i = 0; i < 3; i++) {
            month_list.push(
                [
                    [1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]
                ][parseFloat(quarter) - 1][i] + parseFloat(current_period['space_month'])
            )
        }
        return month_list
    }

    function getMonthOrder(space_month, fiscal_year) {
        $month_select.html(``)
        let data = []
        for (let i = 0; i < 12; i++) {
            let year_temp = fiscal_year
            let trans_order = i + 1 + space_month
            if (trans_order > 12) {
                trans_order -= 12
                year_temp += 1
            }
            if (fiscal_year !== current_period['fiscal_year'] || trans_order <= new Date().getMonth() + 1) {
                if (year_temp === new Date().getFullYear()) {
                    $month_select.append(`<option value="${i + 1}">${$trans_script.attr(`data-trans-m${trans_order}th`)}</option>`)
                    data.push({
                        'id': i + 1,
                        'title': $trans_script.attr(`data-trans-m${trans_order}th`),
                        'month': i + 1,
                        'year': year_temp
                    })
                }
            }
        }
        data.push({
            'id': '',
            'title': 'Select...',
            'month': 0,
            'year': 0,
        })
        $month_select.empty();
        $month_select.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
            data: data,
            allowClear: true,
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                return $(`<span>${state.text} ${groupHTML}</span>`);
            },
        });
    }

    function LoadGroup(ele, data) {
        ele.initSelect2({
            allowClear: true,
            placeholder: $trans_script.attr('data-trans-get-by-config'),
            ajax: {
                url: ele.attr('data-url'),
                data: {'current_emp': true},
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let res = []
                for (const config of resp.data?.['budget_plan_config']) {
                    if (config?.['can_view_company']) {
                        res.push({'id': '0', 'title': $trans_script.attr('data-trans-all-group')})
                    }
                    for (const group_allowed of config?.['group_allowed']) {
                        if (group_allowed?.['can_view']) {
                            res.push(group_allowed?.['group'])
                        }
                    }
                }
                return res
            },
            data: (data ? data : null),
            keyId: 'id',
            keyText: 'title',
        })
    }
    LoadGroup($('#group-select'))

    function LoadPeriod(ele, data) {
        ele.initSelect2({
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp] ? resp.data[keyResp] : []
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            current_period = SelectDDControl.get_data_from_idx(ele, ele.val())
            getMonthOrder(current_period['space_month'], current_period?.['fiscal_year'])
        })
    }
    LoadPeriod($periodEle, current_period)

    function LoadTableForAllCompany() {
        WindowControl.showLoading();
        let dataParam = {}
        dataParam['budget_plan__period_mapped_id'] = $periodEle.val()
        let budget_report_company_list_ajax = $.fn.callAjax2({
            url: $url_script.attr('data-url-budget-report-company-list'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('budget_report_company_list')) {
                    if ($month_filter.prop('checked')) {
                        return filter_by_month(data?.['budget_report_company_list'], true)
                    }
                    if ($quarter_filter.prop('checked')) {
                        return filter_by_quarter(data?.['budget_report_company_list'], true)
                    }
                    let filtered_data = []
                    for (let i = 0; i < data?.['budget_report_company_list'].length; i++) {
                        filtered_data.push({
                            'expense_item': data?.['budget_report_company_list'][i]?.['expense_item'],
                            'plan_value': data?.['budget_report_company_list'][i]?.['company_year'],
                            'actual_value': 0,
                            'difference_value': 0 - data?.['budget_report_company_list'][i]?.['company_year'],
                            'rate_value': 0
                        })
                    }
                    return filtered_data;
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([budget_report_company_list_ajax]).then(
            (results) => {
                RenderTable($('#main-table'), results[0], null)
                setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    500
                )
            })
    }

    function LoadTableForEachGroup(group_id) {
        WindowControl.showLoading();
        let dataParam = {}
        dataParam['budget_plan__period_mapped_id'] = $periodEle.val()
        dataParam['budget_plan_group__group_mapped_id'] = group_id
        let budget_report_group_list_ajax = $.fn.callAjax2({
            url: $url_script.attr('data-url-budget-report-group-list'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('budget_report_group_list')) {
                    if ($month_filter.prop('checked')) {
                        return filter_by_month(data?.['budget_report_group_list'], false)
                    }
                    if ($quarter_filter.prop('checked')) {
                        return filter_by_quarter(data?.['budget_report_group_list'], false)
                    }
                    let filtered_data = []
                    for (let i = 0; i < data?.['budget_report_group_list'].length; i++) {
                        filtered_data.push({
                            'expense_item': data?.['budget_report_group_list'][i]?.['expense_item'],
                            'plan_value': data?.['budget_report_group_list'][i]?.['group_year'],
                            'actual_value': 0,
                            'difference_value': 0 - data?.['budget_report_group_list'][i]?.['group_year'],
                            'rate_value': 0
                        })
                    }
                    return filtered_data;
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([budget_report_group_list_ajax]).then(
            (results) => {
                RenderTable($('#main-table'), results[0], group_id)
                setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    500
                )
            })
    }

    $('#btn-view').on('click', function () {
        let group_id = $('#group-select').val()
        if (group_id) {
            if (group_id === '0') {
                LoadTableForAllCompany()
            }
            else {
                LoadTableForEachGroup(group_id)
            }
        }
        else {
            $.fn.notifyB({"description": 'Please select a group.', "timeout": 3500}, 'warning')
        }
    })

    function filter_by_month(data, company=true) {
        if (company) {
            let month_order = parseFloat($month_select.val()) - 1
            let filtered_data = []
            for (let i = 0; i < data.length; i++) {
                let plan_value = data[i]?.['company_month_list'] ? parseFloat(data[i]?.['company_month_list']?.[month_order]) : 0
                filtered_data.push({
                    'expense_item': data[i]?.['expense_item'],
                    'plan_value': plan_value,
                    'actual_value': 0,
                    'difference_value': 0 - plan_value,
                    'rate_value': 0
                })
            }
            return filtered_data
        }
        else {
            let month_order = parseFloat($month_select.val()) - 1
            let filtered_data = []
            for (let i = 0; i < data.length; i++) {
                let plan_value = data[i]?.['group_month_list'] ? parseFloat(data[i]?.['group_month_list']?.[month_order]) : 0
                filtered_data.push({
                    'expense_item': data[i]?.['expense_item'],
                    'plan_value': plan_value,
                    'actual_value': 0,
                    'difference_value': 0 - plan_value,
                    'rate_value': 0
                })
            }
            return filtered_data
        }
    }

    function filter_by_quarter(data, company=true) {
        if (company) {
            let quarter_order = $quarter_select.val() - 1
            let filtered_data = []
            for (let i = 0; i < data.length; i++) {
                let plan_value = data[i]?.['company_quarter_list'] ? parseFloat(data[i]?.['company_quarter_list']?.[quarter_order]) : 0
                filtered_data.push({
                    'expense_item': data[i]?.['expense_item'],
                    'plan_value': plan_value,
                    'actual_value': 0,
                    'difference_value': 0 - plan_value,
                    'rate_value': 0
                })
            }
            return filtered_data
        }
        else {
            let quarter_order = $quarter_select.val() - 1
            let filtered_data = []
            for (let i = 0; i < data.length; i++) {
                let plan_value = data[i]?.['group_quarter_list'] ? parseFloat(data[i]?.['group_quarter_list']?.[quarter_order]) : 0
                filtered_data.push({
                    'expense_item': data[i]?.['expense_item'],
                    'plan_value': plan_value,
                    'actual_value': 0,
                    'difference_value': 0 - plan_value,
                    'rate_value': 0
                })
            }
            return filtered_data
        }
    }

    function BuildTable(table, data_list=[], group_id) {
        table.DataTable().clear().destroy()
        table.DataTableDefault({
            ordering: false,
            rowIdx: true,
            paging: false,
            reloadCurrency: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        if (!row?.['planned']) {
                            return `<span data-expense-id="${row?.['expense_item']?.['id']}" class="expense-item-span out-plan text-danger">${row?.['expense_item']?.['title']}</span>`
                        }
                        return `<span data-expense-id="${row?.['expense_item']?.['id']}" class="expense-item-span in-plan text-primary">${row?.['expense_item']?.['title']}</span>`
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row) => {
                        if (!row?.['planned']) {
                            return `<span class="text-danger plan_value_span">-</span>`
                        }
                        return `<span class="text-primary mask-money plan_value_span" data-init-money="${row?.['plan_value']}"></span>`
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row) => {
                        if (!row?.['planned']) {
                            return `<span class="text-danger mask-money actual_value_span" data-init-money="${row?.['actual_value']}"></span>`
                        }
                        return `<span class="text-primary mask-money actual_value_span" data-init-money="${row?.['actual_value']}"></span>`
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row) => {
                        if (!row?.['planned']) {
                            return `<span class="text-danger difference_value_span">-</span>`
                        }
                        if (row?.['difference_value'] < 0) {
                            return `<span class="text-primary">(<span class="text-primary mask-money difference_value_span" data-init-money="${row?.['difference_value'] * (-1)}"></span>)</span>`
                        }
                        return `<span class="text-primary mask-money difference_value_span" data-init-money="${row?.['difference_value']}"></span>`
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row) => {
                        if (!row?.['planned']) {
                            return `<span class="text-danger rate_value_span">-</span>`
                        }
                        return `<span class="text-primary rate_value_span">${row?.['rate_value']} %</span>`
                    }
                },
            ],
            initComplete: function () {
                if (table.find('tbody tr .in-plan').length + table.find('tbody tr .out-plan').length > 0) {
                    table.find('tfoot').html('')
                    let space_top = $(`<tr><td class="border-bottom-0"></td><td class="border-bottom-0"></td><td class="border-bottom-0"></td><td class="border-bottom-0"></td><td class="border-bottom-0"></td><td class="border-bottom-0"></td></tr>`)
                    let sum_in_planned = 0
                    let sum_in_actual = 0
                    let sum_in_difference = 0
                    table.find('tbody tr .in-plan').each(function () {
                        let row = $(this).closest('tr')
                        let planned = parseFloat(row.find('.plan_value_span').attr('data-init-money'))
                        let actual = parseFloat(row.find('.actual_value_span').attr('data-init-money'))
                        let difference = actual - planned
                        sum_in_planned += planned
                        sum_in_actual += actual
                        sum_in_difference += difference
                    })
                    let difference_html = `<span class="text-primary mask-money" data-init-money="${sum_in_difference}"></span>`
                    if (sum_in_difference < 0) {
                        difference_html = `<span class="text-primary">(<span class="text-primary mask-money" data-init-money="${sum_in_difference * (-1)}"></span>)</span>`
                    }
                    let in_plan_html = $(`
                        <tr class="in-plan-total">
                            <td class="border-0"></td>
                            <td class="fst-italic text-primary text-decoration-underline border-0">${$trans_script.attr('data-trans-total-in-plan')}</td>
                            <td class="text-right border-0"><span class="text-primary mask-money" data-init-money="${sum_in_planned}"></span></td>
                            <td class="text-right border-0"><span class="text-primary mask-money" data-init-money="${sum_in_actual}"></span></td>
                            <td class="text-right border-0">${difference_html}</td>
                            <td class="text-right border-0"><span class="text-primary">${sum_in_planned !== 0 ? (sum_in_actual * 100 / sum_in_planned).toFixed(2) : 0} %</span></td>
                        </tr>
                    `)
                    let sum_out_actual = 0
                    table.find('tbody tr .out-plan').each(function () {
                        let row = $(this).closest('tr')
                        let actual = parseFloat(row.find('.actual_value_span').attr('data-init-money'))
                        sum_out_actual += actual
                    })
                    let out_plan_html = $(`
                        <tr class="out-plan-total">
                            <td class="border-0"></td>
                            <td class="fst-italic text-danger text-decoration-underline border-0">${$trans_script.attr('data-trans-total-out-plan')}</td>
                            <td class="text-right border-0"><span class="text-danger">-</span></td>
                            <td class="text-right border-0"><span class="text-danger mask-money" data-init-money="${sum_out_actual}"></span></td>
                            <td class="text-right border-0"><span class="text-danger">-</span></td>
                            <td class="text-right border-0"><span class="text-danger">-</span></td>
                        </tr>
                    `)
                    let space_bottom = $(`<tr><td class="border-top-0"></td><td class="border-top-0"></td><td class="border-top-0"></td><td class="border-top-0"></td><td class="border-top-0"></td><td class="border-top-0"></td></tr>`)

                    if (sum_in_planned > 0 || sum_out_actual > 0) {
                        table.find('tfoot').append(space_top)
                        if (sum_in_planned > 0) {
                            table.find('tfoot').append(in_plan_html)
                        }
                        if (sum_out_actual > 0) {
                            table.find('tfoot').append(out_plan_html)
                        }
                        table.find('tfoot').append(space_bottom)
                    }
                    $.fn.initMaskMoney2()
                }
            }
        });
    }

    function RenderTable(table, data_planned_list=[], group_id=null, init=false) {
        if (!init) {
            let dataParam = {}
            if ($month_filter.prop('checked') && $month_select.val()) {
                dataParam['month_list'] = JSON.stringify([$month_select.val()])
            }
            else if ($quarter_filter.prop('checked') && $quarter_select.val()) {
                dataParam['month_list'] = JSON.stringify(getQuarterMonth($quarter_select.val()))
            }
            else {
                dataParam['date_approved__year'] = current_period?.['fiscal_year']
            }
            if (group_id) {
                dataParam['employee_inherit__group_id'] = group_id
            }
            let payment_list_ajax = $.fn.callAjax2({
                url: $url_script.attr('data-url-payment-list'),
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('budget_report_payment_list')) {
                        return data?.['budget_report_payment_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([payment_list_ajax]).then(
                (results) => {
                    let table_data = []
                    for (const data of data_planned_list) {
                        let actual_value = 0
                        for (const payment of results[0]) {
                            for (const payment_expense of payment?.['expense_items']) {
                                if (data?.['expense_item']?.['id'] === payment_expense?.['id']) {
                                    actual_value += parseFloat(payment_expense?.['value'])
                                    payment_expense['planned'] = true
                                }
                            }
                        }
                        let plan_value = data['plan_value']
                        data['planned'] = true
                        data['actual_value'] = actual_value
                        data['difference_value'] = actual_value - plan_value
                        data['rate_value'] = plan_value !== 0 ? parseFloat((actual_value * 100 / plan_value).toFixed(2)) : 0
                        table_data.push(data)
                    }

                    let not_in_plan = []
                    for (const payment of results[0]) {
                        for (const payment_expense of payment?.['expense_items']) {
                            if (payment_expense?.['planned'] !== true) {
                                not_in_plan.push(
                                    {
                                        "expense_item": {
                                            "id": payment_expense?.['id'],
                                            "code": payment_expense?.['code'],
                                            "title": payment_expense?.['title']
                                        },
                                        "plan_value": 0,
                                        "actual_value": payment_expense?.['value'],
                                        "difference_value": payment_expense?.['value'],
                                        "rate_value": 0
                                    }
                                )
                            }
                        }
                    }
                    const aggregatedData = not_in_plan.reduce((acc, item) => {
                        const id = item.expense_item.id;
                        if (!acc[id]) {
                            acc[id] = {
                                expense_item: item.expense_item,
                                plan_value: 0,
                                actual_value: 0,
                                difference_value: 0,
                                rate_value: item.rate_value
                            };
                        }
                        acc[id].plan_value += item.plan_value;
                        acc[id].actual_value += item.actual_value;
                        acc[id].difference_value += item.difference_value;
                        return acc;
                    }, {});

                    BuildTable(table, table_data.concat(Object.values(aggregatedData)), group_id)
                })
        }
        else {
            BuildTable(table, [])
        }
    }
    RenderTable($('#main-table'), [], true, true)

    $month_filter.on('change', function () {
        if ($(this).prop('checked')) {
            $quarter_filter.prop('checked', !$(this).prop('checked'))
            $quarter_select.prop('disabled', $(this).prop('checked'))
        }
        $month_select.prop('disabled', !$(this).prop('checked'))
    })

    $quarter_filter.on('change', function () {
        if ($(this).prop('checked')) {
            $month_filter.prop('checked', !$(this).prop('checked'))
            $month_select.prop('disabled', $(this).prop('checked'))
        }
        $quarter_select.prop('disabled', !$(this).prop('checked'))
    })
})
