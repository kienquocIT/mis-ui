$(document).ready(function () {
    const $trans_script = $('#trans-script')
    const $url_script = $('#url-script')
    const $periodMonthEle = $('#month-select')
    const $periodEle = $('#period-select')

    const $current_period_Ele = $('#current_period')
    let current_period = {}
    if ($current_period_Ele.text() !== '') {
        current_period = JSON.parse($current_period_Ele.text())
        getMonthOrder(current_period['space_month'], current_period?.['fiscal_year'])
        $periodMonthEle.val(new Date().getMonth() - current_period['space_month'] + 1).trigger('change');
    }

    function getMonthOrder(space_month, fiscal_year) {
        $periodMonthEle.html(``)
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
                    $periodMonthEle.append(`<option value="${i + 1}">${$trans_script.attr(`data-trans-m${trans_order}th`)}</option>`)
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
        $periodMonthEle.empty();
        $periodMonthEle.initSelect2({
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
            placeholder: $trans_script.attr('data-trans-all'),
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp] ? resp.data[keyResp] : []
            },
            data: (data ? data : null),
            keyResp: 'group_list',
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
            $('#quarter-select').empty()
        })
    }
    LoadPeriod($periodEle, current_period)
    $('#quarter-select').empty()

    $('#btn-view').on('click', function () {
        WindowControl.showLoading();
        let dataParam = {}
        dataParam['budget_plan__period_mapped_id'] = $periodEle.val() ? $periodEle.val() : null
        let budget_report_list_ajax = $.fn.callAjax2({
            url: $url_script.attr('data-url-budget-report-list'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('budget_report_list')) {
                    let filtered_data = data?.['budget_report_list']
                    filtered_data = filter_by_month(filtered_data)
                    // filtered_data = filter_by_po_staff(filtered_data)
                    // filtered_data = filter_by_sale_order(filtered_data)
                    console.log(filtered_data)
                    return filtered_data;
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([budget_report_list_ajax]).then(
            (results) => {
                RenderTable($('#main-table'), results[0])
                setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    500
                )
            })
    })
    $('#btn-view').trigger('click')

    function filter_by_month(data) {
        if ($('#month-filter').prop('checked')) {
            let month = $periodMonthEle.val()
            let filtered_data = []
            for (let i = 0; i < data.length; i++) {
                let plan_value = data[i]?.['company_month_list'] ? parseFloat(data[i]?.['company_month_list']?.[month]) : 0
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

    function RenderTable(table, data_list=[]) {
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
                    className: 'text-primary w-35',
                    render: (data, type, row) => {
                        return `<span data-expense-id="${row?.['expense_item']?.['id']}" class="expense-item-span fw-bold">${row?.['expense_item']?.['title']}</span>`
                    }
                },
                {
                    className: 'text-primary text-right w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money plan_value_span" data-init-money="${row?.['plan_value']}"></span>`
                    }
                },
                {
                    className: 'text-primary text-right w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money actual_value_span" data-init-money="${row?.['actual_value']}"></span>`
                    }
                },
                {
                    className: 'text-primary text-right w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money difference_value_span" data-init-money="${row?.['difference_value']}"></span>`
                    }
                },
                {
                    className: 'text-primary text-right w-15',
                    render: (data, type, row) => {
                        return `<span class="rate_value_span">${row?.['rate_value'] !== -1 ? row?.['rate_value'] : '***'} %</span>`
                    }
                },
            ],
            initComplete: function () {
                let dataParam = {'date_approved_month': $periodMonthEle.val()}
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
                        console.log(results[0])
                        table.find('tbody tr').each(function () {
                            let row = $(this)
                            let plan_value = row.find('.plan_value_span').attr('data-init-money')
                            let actual_value = 0
                            for (const payment of results[0]) {
                                for (const payment_expense of payment?.['expense_items']) {
                                    if (row.find('.expense-item-span').attr('data-expense-id') === payment_expense?.['id']) {
                                        actual_value += parseFloat(payment_expense?.['value'])
                                    }
                                }
                            }
                            row.find('.actual_value_span').attr('data-init-money', actual_value)
                            actual_value < plan_value ? row.find('.difference_value_span').closest('td').prepend('(').append(')') : ''
                            row.find('.difference_value_span').attr('data-init-money', actual_value < plan_value ? (actual_value - plan_value) * (-1) : actual_value - plan_value)
                            row.find('.rate_value_span').text(plan_value !== 0 ? (actual_value*100/plan_value).toFixed(2).toString() + ' %' : '***')
                        })
                        $.fn.initMaskMoney2()
                    })
            }
        });
    }
})
