$(document).ready(function () {
    const CHART_COLORS = {
        blue: 'rgb(54, 162, 235)',
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 96)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)',
        custom1: 'rgb(58, 110, 31)',
        custom2: 'rgb(194, 0, 35)',
        custom3: 'rgb(13, 46, 118)',
    }
    const scriptUrlEle = $('#script-url')
    const trans_script = $('#trans-script')
    const moneyDisplayEle = $('#money-display')
    const moneyRoundEle = $('#money-round')
    const periodFiscalYearFilterEle = $('#period-filter')
    const current_period_Ele = $('#current_period')
    const current_period = current_period_Ele.text() ? JSON.parse(current_period_Ele.text()) : {}
    let period_selected_Setting = current_period
    let fiscal_year_Setting = current_period?.['fiscal_year']
    let space_month_Setting = current_period?.['space_month']

    moneyDisplayEle.on('change', function () {
        COMPANY_CURRENT_REVENUE = null
        COMPANY_CURRENT_PROFIT = null
        DrawRevenueProfitChart()
    })

    moneyRoundEle.on('change', function () {
        $(this).val($(this).val() || 1);
        DrawRevenueProfitChart()
    })

    function GetQuarter(dateApproved, period) {
        let sub_current = null
        for (let i=0; i < period?.['subs'].length; i++) {
            let sub = period?.['subs'][i]
            let start_date = sub?.['start_date'];
            let end_date = sub?.['end_date'];

            if (!start_date || !end_date) return false;

            let approvedDate = new Date(dateApproved);
            let startDate = new Date(start_date);
            let endDate = new Date(end_date);

            if (startDate <= approvedDate && approvedDate <= endDate) {
                sub_current = sub
            }
        }
        if (sub_current) {
            if ([1, 2, 3].includes(sub_current?.['order'])) {
                return 1
            } else if ([4, 5, 6].includes(sub_current?.['order'])) {
                return 2
            } else if ([7, 8, 9].includes(sub_current?.['order'])) {
                return 3
            } else if ([10, 11, 12].includes(sub_current?.['order'])) {
                return 4
            }
        }
        return null
    }

    function getMonthOrder(space_month) {
        let month_order = []
        for (let i = 0; i < 12; i++) {
            let trans_order = i + 1 + space_month
            if (trans_order > 12) {
                trans_order -= 12
            }
            month_order.push(trans_script.attr(`data-trans-m${trans_order}th`))
        }
        return month_order
    }

    function LoadPeriod(data) {
        if (Object.keys(data).length === 0) {
            data = current_period
        }
        periodFiscalYearFilterEle.initSelect2({
            ajax: {
                url: periodFiscalYearFilterEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            $('#revenue-spinner').prop('hidden', false)
            $('#profit-spinner').prop('hidden', false)
            period_selected_Setting = SelectDDControl.get_data_from_idx(periodFiscalYearFilterEle, periodFiscalYearFilterEle.val())
            fiscal_year_Setting = period_selected_Setting?.['fiscal_year']
            space_month_Setting = period_selected_Setting?.['space_month']
            DrawRevenueProfitChart()
        })
    }

    function Check_in_period(dateApproved, period) {
        let start_date = period?.['start_date'];
        let end_date = period?.['end_date'];

        if (!start_date || !end_date) return false;

        let approvedDate = new Date(dateApproved);
        let startDate = new Date(start_date);
        let endDate = new Date(end_date);

        return startDate <= approvedDate && approvedDate <= endDate;
    }

    function GetSub(date, period) {
        let subs = period?.['subs'] ? period?.['subs'] : []
        for (let i=subs.length - 1; i >= 0; i--) {
            if (new Date(date) >= new Date(subs[i]?.['start_date'])) {
                return subs[i]?.['order']
            }
        }
    }

    // common of Revenue and Profit

    let revenue_chart = null
    let profit_chart = null
    let revenueprofit_DF = []
    let revenue_expected_DF = []
    let profit_expected_DF = []
    let profit_expected_type = null
    let COMPANY_CURRENT_REVENUE = null
    let COMPANY_CURRENT_PROFIT = null

    function DrawRevenueProfitChart() {
        $('#revenue-spinner').prop('hidden', false)
        $('#profit-spinner').prop('hidden', false)

        let report_revenue_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-report-revenue-profit'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('report_revenue_list')) {
                    return data?.['report_revenue_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            })

        let revenue_plan_by_report_perm_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-revenue-plan-by-report-perm'),
            data: {'fiscal_year': fiscal_year_Setting},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('revenue_plan_by_report_perm_list')) {
                    return data?.['revenue_plan_by_report_perm_list']
                }
                return [];
            },
            (errs) => {
                console.log(errs);
            })

        let [revenueChartDataset, profitChartDataset] = [null, null]
        Promise.all([report_revenue_ajax, revenue_plan_by_report_perm_ajax]).then(
            (results) => {
                revenueprofit_DF = (results[0] ? results[0] : []).filter(item => {
                    return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                })
                if (revenueprofitGroupEle.val()) {
                    revenueprofit_DF = revenueprofit_DF.filter(item => {
                        return item?.['group_inherit_id'] === revenueprofitGroupEle.val()
                    })
                }

                revenue_expected_DF = Array(12).fill(0)
                profit_expected_DF = Array(12).fill(0)
                profit_expected_type = results[1].length ? results[1][0]?.['profit_target_type'] : null
                if (parseInt(profit_expected_type) === parseInt(profitTypeEle.val())) {
                    for (let i = 0; i < results[1].length; i++) {
                        if (!revenueprofitGroupEle.val() || results[1][i]?.['employee_mapped']?.['group']?.['id'] === revenueprofitGroupEle.val()) {
                            const empMonthTarget = results[1][i]?.['emp_month_target']
                            if (Array.isArray(empMonthTarget)) {
                                for (let j = 0; j < empMonthTarget.length; j++) {
                                    revenue_expected_DF[j] += empMonthTarget[j] || 0
                                }
                            }
                            const empMonthProfitTarget = results[1][i]?.['emp_month_profit_target']
                            if (Array.isArray(empMonthProfitTarget)) {
                                for (let j = 0; j < empMonthProfitTarget.length; j++) {
                                    profit_expected_DF[j] += empMonthProfitTarget[j] || 0
                                }
                            }
                        }
                    }
                }

                [revenueChartDataset, profitChartDataset] = GetRevenueProfitChartDatasets()
            }).then(() => {
                if (revenue_chart) {
                    revenue_chart.dispose()
                    revenue_chart = null
                }
                if (profit_chart) {
                    profit_chart.dispose()
                    profit_chart = null
                }

                revenue_chart = echarts.init($('#revenue_chart')[0])
                let revenue_option = {
                    title: {
                        text: trans_script.attr('data-trans-chart-revenue'),
                        textStyle: {
                            fontFamily: 'Roboto, sans-serif'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            fontFamily: 'Roboto, sans-serif',
                            color: '#fff' // Màu chữ của tooltip
                        },
                        backgroundColor: '#333',  // Màu nền của tooltip
                        formatter: function (params) {
                            let result = `${params[0]?.['axisValue']}<br/>`;
                            params.forEach(item => {
                                let value = parseFloat(item.value).toFixed(parseInt(moneyRoundEle.val() || 0));
                                result += `${item?.['marker']} ${item?.['seriesName']}: <b>${value}</b><br/>`;
                            });
                            return result;
                        }
                    },
                    legend: {
                        data: [revenueChartDataset[0]?.['label'], revenueChartDataset[1]?.['label']],
                        textStyle: {
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: 14,
                            color: '#333'
                        },
                        itemWidth: 20,
                        itemHeight: 10,
                        orient: 'horizontal',
                        left: 'center',
                        top: '10%'  // Đặt legend ở giữa và cách trên 10%
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '1%',
                        containLabel: true
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            dataView: { readOnly: true },
                            magicType: { type: ['line', 'bar'] },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: getMonthOrder(space_month_Setting),
                        axisLabel: {
                            color: '#333',
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#888',
                                width: 2,
                                type: 'solid' // Kiểu đường trục
                            }
                        },
                        splitLine: {
                            show: false  // Ẩn đường phân chia
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            color: '#333'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#888',
                                width: 2
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#ccc',
                                type: 'dashed'
                            }
                        }
                    },
                    series: [
                        {
                            name: revenueChartDataset[0]?.['label'],
                            type: 'line',
                            smooth: 0.25,
                            lineStyle: {
                                color: CHART_COLORS?.['blue']
                            },
                            itemStyle: {
                                color: CHART_COLORS?.['blue']
                            },
                            data: revenueChartDataset[0]?.['data'],
                        },
                        {
                            name: revenueChartDataset[1]?.['label'],
                            type: 'line',
                            smooth: 0.25,
                            lineStyle: {
                                color: CHART_COLORS?.['red']
                            },
                            itemStyle: {
                                color: CHART_COLORS?.['red']
                            },
                            data: revenueChartDataset[1]?.['data'],
                        }
                    ]
                };

                revenue_chart.setOption(revenue_option)

                profit_chart = echarts.init($('#profit_chart')[0])
                let profit_option = {
                    title: {
                        text: trans_script.attr('data-trans-chart-profit'),
                        textStyle: {
                            fontFamily: 'Roboto, sans-serif'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        textStyle: {
                            fontFamily: 'Roboto, sans-serif',
                            color: '#fff' // Màu chữ của tooltip
                        },
                        backgroundColor: '#333',  // Màu nền của tooltip
                        formatter: function (params) {
                            let result = `${params[0]?.['axisValue']}<br/>`;
                            params.forEach(item => {
                                let value = parseFloat(item.value).toFixed(parseInt(moneyRoundEle.val() || 0));
                                result += `${item?.['marker']} ${item?.['seriesName']}: <b>${value}</b><br/>`;
                            });
                            return result;
                        }
                    },
                    legend: {
                        data: [profitChartDataset[0]?.['label'], profitChartDataset[1]?.['label']],
                        textStyle: {
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: 14,
                            color: '#333'
                        },
                        itemWidth: 20,
                        itemHeight: 10,
                        orient: 'horizontal',
                        left: 'center',
                        top: '10%'
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '1%',
                        containLabel: true
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            dataView: { readOnly: true },
                            magicType: { type: ['line', 'bar'] },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: getMonthOrder(space_month_Setting),
                        axisLabel: {
                            color: '#333',
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#888',
                                width: 2,
                                type: 'solid'
                            }
                        },
                        splitLine: {
                            show: false  // Ẩn đường phân chia
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            color: '#333'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#888',
                                width: 2
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#ccc',
                                type: 'dashed'
                            }
                        }
                    },
                    series: [
                        {
                            name: profitChartDataset[0]?.['label'],
                            type: 'line',
                            smooth: 0.25,
                            lineStyle: {
                                color: CHART_COLORS?.['blue']
                            },
                            itemStyle: {
                                color: CHART_COLORS?.['blue']
                            },
                            data: profitChartDataset[0]?.['data'],
                        },
                        {
                            name: profitChartDataset[1]?.['label'],
                            type: 'line',
                            smooth: 0.25,
                            lineStyle: {
                                color: CHART_COLORS?.['green']
                            },
                            itemStyle: {
                                color: CHART_COLORS?.['green']
                            },
                            data: profitChartDataset[1]?.['data'],
                        }
                    ]
                };
                profit_chart.setOption(profit_option)

                $('#revenue-spinner').prop('hidden', true)
                $('#profit-spinner').prop('hidden', true)
        })
    }

    function GetRevenueProfitChartDatasets() {
        const type = revenueprofitViewTypeEle.val() === '0' ? 'Period' : 'Accumulated'
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let revenue_chart_data = Array(12).fill(0)
        let profit_chart_data = Array(12).fill(0)
        for (const item of revenueprofit_DF) {
            let index = GetSub(item?.['date_approved'], period_selected_Setting) - 1

            revenue_chart_data[index] += Number((
                (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
            ).toFixed(parseInt(moneyRoundEle.val())))

            if (profitTypeEle.val() === '0') {
                profit_chart_data[index] += Number((
                    (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                ).toFixed(parseInt(moneyRoundEle.val())))
            }
            else {
                profit_chart_data[index] += Number((
                    (item?.['net_income'] ? item?.['net_income'] : 0) / cast_billion
                ).toFixed(parseInt(moneyRoundEle.val())))
            }
        }

        let revenue_expected_data = revenue_expected_DF.map(value => Number((value / cast_billion).toFixed(parseInt(moneyRoundEle.val()))));
        let profit_expected_data = profit_expected_DF.map(value => Number((value / cast_billion).toFixed(parseInt(moneyRoundEle.val()))));

        if (type === 'Period') {
            COMPANY_CURRENT_REVENUE = COMPANY_CURRENT_REVENUE === null ? (revenue_chart_data[GetSub(new Date().toString(), period_selected_Setting) - 1] * cast_billion) : COMPANY_CURRENT_REVENUE
            $('#current-revenue').attr('data-init-money', COMPANY_CURRENT_REVENUE)

            COMPANY_CURRENT_PROFIT = COMPANY_CURRENT_PROFIT === null ? (profit_chart_data[GetSub(new Date().toString(), period_selected_Setting) - 1] * cast_billion) : COMPANY_CURRENT_PROFIT
            $('#current-profit').attr('data-init-money', COMPANY_CURRENT_PROFIT)

            $.fn.initMaskMoney2()
        }

        if (type === 'Accumulated') {
            for (let i = 0; i < revenue_chart_data.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = revenue_chart_data[i - 1]
                }
                revenue_chart_data[i] += last_sum
            }
            for (let i = 0; i < revenue_expected_data.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = revenue_expected_data[i - 1]
                }
                revenue_expected_data[i] += last_sum
            }

            for (let i = 0; i < profit_chart_data.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = profit_chart_data[i - 1]
                }
                profit_chart_data[i] += last_sum
            }
            for (let i = 0; i < profit_expected_data.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = profit_expected_data[i - 1]
                }
                profit_expected_data[i] += last_sum
            }
        }

        let revenue_series_data = [
            {
                label: trans_script.attr('data-trans-expected'),
                data: revenue_expected_data,
            },
            {
                label: trans_script.attr('data-trans-reality'),
                data: revenue_chart_data,
            }
        ]

        let profit_series_data = [
            {
                label: trans_script.attr('data-trans-expected'),
                data: profit_expected_data,
            },
            {
                label: trans_script.attr('data-trans-reality'),
                data: profit_chart_data,
            }
        ]

        if (new Date().getFullYear() === fiscal_year_Setting) {
            for (let i = new Date().getMonth() + 1 - space_month_Setting; i < 12; i++) {
                revenue_chart_data[i] = null;
                profit_chart_data[i] = null;
            }

            revenue_series_data = [
                {
                    label: trans_script.attr('data-trans-expected'),
                    data: revenue_expected_data,
                },
                {
                    label: trans_script.attr('data-trans-reality'),
                    data: revenue_chart_data,
                }
            ]

            profit_series_data = [
                {
                    label: trans_script.attr('data-trans-expected'),
                    data: profit_expected_data,
                },
                {
                    label: trans_script.attr('data-trans-reality'),
                    data: profit_chart_data,
                }
            ]
        }

        return [revenue_series_data, profit_series_data]
    }

    $('#reload-revenue-profit-data-btn').on('click', function () {
        DrawRevenueProfitChart()
    })

    const revenueprofitViewTypeEle = $('#revenue-profit-view-type')
    revenueprofitViewTypeEle.on('change', function () {
        DrawRevenueProfitChart()
    })

    const revenueprofitGroupEle = $('#revenue-profit-group')
    function LoadRevenueGroup(data) {
        revenueprofitGroupEle.initSelect2({
            allowClear: true,
            placeholder: trans_script.attr('data-trans-all'),
            ajax: {
                url: revenueprofitGroupEle.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp]
            },
            data: (data ? data : null),
            keyResp: 'group_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            DrawRevenueProfitChart()
        })
    }

    const profitTypeEle = $('#profit-type')
    profitTypeEle.on('change', function () {
        DrawRevenueProfitChart()
    })

    // Load Page

    LoadPeriod(current_period)
    LoadRevenueGroup()
    DrawRevenueProfitChart()
})
