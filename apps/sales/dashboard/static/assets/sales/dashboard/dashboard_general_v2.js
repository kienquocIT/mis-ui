/**
 * Khai báo các element trong page
 */
class DashBoardGeneralPageElements {
    constructor() {
        this.$script_url = $('#script-url')
        this.$trans_script = $('#trans-script')
        this.$money_display = $('#money-display')
        this.$money_round = $('#money-round')
        this.$period_filter = $('#period-filter')
        this.$current_period = $('#current_period')
        // main
        this.$revenueprofitViewTypeEle = $('#revenue-profit-view-type')
        this.$revenueprofitGroupEle = $('#revenue-profit-group')
        this.$profitTypeEle = $('#profit-type')
        this.$reload_revenue_profit_data_btn = $('#reload-revenue-profit-data-btn')
    }
}
const pageElements = new DashBoardGeneralPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class DashBoardGeneralPageVariables {
    constructor() {
        this.CHART_COLORS = {
            primary: 'rgb(0, 125, 136)',
            blue: 'rgb(41, 141, 255)',
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(37, 203, 161)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)',
            custom1: 'rgb(58, 110, 31)',
            custom2: 'rgb(194, 0, 35)',
            custom3: 'rgb(13, 46, 118)',
        }
        this.CURRENT_PERIOD = pageElements.$current_period.text() ? JSON.parse(pageElements.$current_period.text()) : {}
        // main
        this.revenue_chart = null
        this.profit_chart = null
        this.revenueprofit_DF = []
        this.revenue_expected_DF = []
        this.profit_expected_DF = []
        this.profit_expected_type = null
        this.COMPANY_CURRENT_REVENUE = null
        this.COMPANY_CURRENT_PROFIT = null
    }
}
const pageVariables = new DashBoardGeneralPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class DashBoardGeneralPageFunction {
    static GetQuarter(dateApproved, period) {
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
    static getMonthOrder(space_month) {
        let month_order = []
        for (let i = 0; i < 12; i++) {
            let trans_order = i + 1 + space_month
            if (trans_order > 12) {
                trans_order -= 12
            }
            month_order.push(pageElements.$trans_script.attr(`data-trans-m${trans_order}th`))
        }
        return month_order
    }
    static LoadPeriod(data) {
        if (Object.keys(data).length === 0) {
            data = pageVariables.CURRENT_PERIOD
        }
        pageElements.$period_filter.initSelect2({
            ajax: {
                url: pageElements.$period_filter.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            $('#revenue-spinner').prop('hidden', false)
            $('#profit-spinner').prop('hidden', false)
            pageVariables.CURRENT_PERIOD = SelectDDControl.get_data_from_idx(pageElements.$period_filter, pageElements.$period_filter.val())
            DashBoardGeneralPageFunction.DrawRevenueProfitChart()
        })
    }
    static Check_in_period(dateApproved, period) {
        let start_date = period?.['start_date'];
        let end_date = period?.['end_date'];

        if (!start_date || !end_date) return false;

        let approvedDate = new Date(dateApproved);
        let startDate = new Date(start_date);
        let endDate = new Date(end_date);

        return startDate <= approvedDate && approvedDate <= endDate;
    }
    static GetSub(date, period) {
        let subs = period?.['subs'] ? period?.['subs'] : []
        for (let i=subs.length - 1; i >= 0; i--) {
            if (new Date(date) >= new Date(subs[i]?.['start_date'])) {
                return subs[i]?.['order']
            }
        }
    }
    static LoadRevenueGroup(data) {
        pageElements.$revenueprofitGroupEle.initSelect2({
            allowClear: true,
            placeholder: pageElements.$trans_script.attr('data-trans-all'),
            ajax: {
                url: pageElements.$revenueprofitGroupEle.attr('data-url'),
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
            DashBoardGeneralPageFunction.DrawRevenueProfitChart()
        })
    }
    // main
    static DrawRevenueProfitChart() {
        $('#revenue-spinner').prop('hidden', false)
        $('#profit-spinner').prop('hidden', false)

        let report_revenue_ajax = $.fn.callAjax2({
            url: pageElements.$script_url.attr('data-url-report-revenue-profit'),
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
            url: pageElements.$script_url.attr('data-url-revenue-plan-by-report-perm'),
            data: {'fiscal_year': pageVariables.CURRENT_PERIOD?.['fiscal_year']},
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
                pageVariables.revenueprofit_DF = (results[0] ? results[0] : []).filter(item => {
                    return DashBoardGeneralPageFunction.Check_in_period(new Date(item?.['date_approved']), pageVariables.CURRENT_PERIOD)
                })
                if (pageElements.$revenueprofitGroupEle.val()) {
                    pageVariables.revenueprofit_DF = pageVariables.revenueprofit_DF.filter(item => {
                        return item?.['group_inherit_id'] === pageElements.$revenueprofitGroupEle.val()
                    })
                }

                pageVariables.revenue_expected_DF = Array(12).fill(0)
                pageVariables.profit_expected_DF = Array(12).fill(0)
                pageVariables.profit_expected_type = results[1].length ? results[1][0]?.['profit_target_type'] : null
                if (pageVariables.profit_expected_type) {
                    $('#profit-type').val(pageVariables.profit_expected_type)
                }
                if (parseInt(pageVariables.profit_expected_type) === parseInt(pageElements.$profitTypeEle.val())) {
                    for (let i = 0; i < results[1].length; i++) {
                        if (!pageElements.$revenueprofitGroupEle.val() || results[1][i]?.['employee_mapped']?.['group']?.['id'] === pageElements.$revenueprofitGroupEle.val()) {
                            const empMonthTarget = results[1][i]?.['emp_month_target']
                            if (Array.isArray(empMonthTarget)) {
                                for (let j = 0; j < empMonthTarget.length; j++) {
                                    pageVariables.revenue_expected_DF[j] += empMonthTarget[j] || 0
                                }
                            }
                            const empMonthProfitTarget = results[1][i]?.['emp_month_profit_target']
                            if (Array.isArray(empMonthProfitTarget)) {
                                for (let j = 0; j < empMonthProfitTarget.length; j++) {
                                    pageVariables.profit_expected_DF[j] += empMonthProfitTarget[j] || 0
                                }
                            }
                        }
                    }
                }

                [revenueChartDataset, profitChartDataset] = DashBoardGeneralPageFunction.GetRevenueProfitChartDatasets()
            }).then(() => {
                if (pageVariables.revenue_chart) {
                    pageVariables.revenue_chart.dispose()
                    pageVariables.revenue_chart = null
                }
                if (pageVariables.profit_chart) {
                    pageVariables.profit_chart.dispose()
                    pageVariables.profit_chart = null
                }

                pageVariables.revenue_chart = echarts.init($('#revenue_chart')[0])
                let revenue_option = {
                    title: {
                        text: pageElements.$trans_script.attr('data-trans-chart-revenue'),
                        textStyle: {
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: 14,
                            fontWeight: 'normal',
                            color: '#333'
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
                                let value = item?.['value'] !== undefined ? parseFloat(item?.['value']).toFixed(parseInt(pageElements.$money_round.val() || 0)) : '-';
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
                        data: DashBoardGeneralPageFunction.getMonthOrder(pageVariables.CURRENT_PERIOD?.['space_month']),
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
                            smooth: 0.2,
                            lineStyle: {
                                color: pageVariables.CHART_COLORS?.['blue'],
                                width: 3
                            },
                            itemStyle: {
                                color: pageVariables.CHART_COLORS?.['blue']
                            },
                            data: revenueChartDataset[0]?.['data'],
                        },
                        {
                            name: revenueChartDataset[1]?.['label'],
                            type: 'line',
                            smooth: 0.2,
                            lineStyle: {
                                color: pageVariables.CHART_COLORS?.['red'],
                                width: 3
                            },
                            itemStyle: {
                                color: pageVariables.CHART_COLORS?.['red']
                            },
                            data: revenueChartDataset[1]?.['data'],
                        }
                    ]
                };

                pageVariables.revenue_chart.setOption(revenue_option)

                pageVariables.profit_chart = echarts.init($('#profit_chart')[0])
                let profit_option = {
                    title: {
                        text: pageElements.$trans_script.attr('data-trans-chart-profit'),
                        textStyle: {
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: 14,
                            fontWeight: 'normal',
                            color: '#333'
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
                                let value = item?.['value'] !== undefined ? parseFloat(item?.['value']).toFixed(parseInt(pageElements.$money_round.val() || 0)) : '-';
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
                        data: DashBoardGeneralPageFunction.getMonthOrder(pageVariables.CURRENT_PERIOD?.['space_month']),
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
                            smooth: 0.2,
                            lineStyle: {
                                color: pageVariables.CHART_COLORS?.['blue'],
                                width: 3
                            },
                            itemStyle: {
                                color: pageVariables.CHART_COLORS?.['blue']
                            },
                            data: profitChartDataset[0]?.['data'],
                        },
                        {
                            name: profitChartDataset[1]?.['label'],
                            type: 'line',
                            smooth: 0.2,
                            lineStyle: {
                                color: pageVariables.CHART_COLORS?.['green'],
                                width: 3
                            },
                            itemStyle: {
                                color: pageVariables.CHART_COLORS?.['green']
                            },
                            data: profitChartDataset[1]?.['data'],
                        }
                    ]
                };
                pageVariables.profit_chart.setOption(profit_option)

                $('#revenue-spinner').prop('hidden', true)
                $('#profit-spinner').prop('hidden', true)
                $('#latest-data-time-revenue-profit').text(moment().format('DD/MM/YYYY HH:mm:ss'))
            })
    }
    static GetRevenueProfitChartDatasets() {
        const type = pageElements.$revenueprofitViewTypeEle.val() === '0' ? 'Period' : 'Accumulated'
        const cast_billion = pageElements.$money_display.val() === '1' ? 1e9 : 1e6

        let revenue_chart_data = Array(12).fill(0)
        let profit_chart_data = Array(12).fill(0)
        for (const item of pageVariables.revenueprofit_DF) {
            let index = DashBoardGeneralPageFunction.GetSub(item?.['date_approved'], pageVariables.CURRENT_PERIOD) - 1

            revenue_chart_data[index] += Number((
                (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
            ).toFixed(parseInt(pageElements.$money_round.val())))

            if (pageElements.$profitTypeEle.val() === '0') {
                profit_chart_data[index] += Number((
                    (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                ).toFixed(parseInt(pageElements.$money_round.val())))
            }
            else {
                profit_chart_data[index] += Number((
                    (item?.['net_income'] ? item?.['net_income'] : 0) / cast_billion
                ).toFixed(parseInt(pageElements.$money_round.val())))
            }
        }

        let revenue_expected_data = pageVariables.revenue_expected_DF.map(value => Number((value / cast_billion).toFixed(parseInt(pageElements.$money_round.val()))));
        let profit_expected_data = pageVariables.profit_expected_DF.map(value => Number((value / cast_billion).toFixed(parseInt(pageElements.$money_round.val()))));

        if (type === 'Period') {
            pageVariables.COMPANY_CURRENT_REVENUE = pageVariables.COMPANY_CURRENT_REVENUE === null ? (revenue_chart_data[DashBoardGeneralPageFunction.GetSub(new Date().toString(), pageVariables.CURRENT_PERIOD) - 1] * cast_billion) : pageVariables.COMPANY_CURRENT_REVENUE
            let company_last_revenue = revenue_chart_data[DashBoardGeneralPageFunction.GetSub(new Date().toString(), pageVariables.CURRENT_PERIOD) - 2] * cast_billion || 0
            $('#current-revenue').attr('data-init-money', pageVariables.COMPANY_CURRENT_REVENUE)
            let up_down_revenue = pageVariables.COMPANY_CURRENT_REVENUE - company_last_revenue
            if (up_down_revenue >= 0) {
                $('#current-revenue-status').attr('title', pageElements.$trans_script.attr('data-compare-with-last-month')).attr('class', 'badge badge-sm badge-soft-success ml-1 d-inline-flex align-items-center').html(`<i class="bi bi-arrow-up"></i><span class="mask-money" data-init-money="${up_down_revenue}"></span>`)
            }
            else {
                $('#current-revenue-status').attr('title', pageElements.$trans_script.attr('data-compare-with-last-month')).attr('class', 'badge badge-sm badge-soft-danger ml-1 d-inline-flex align-items-center').html(`<i class="bi bi-arrow-down"></i><span class="mask-money" data-init-money="${Math.abs(up_down_revenue)}"></span>`)
            }

            pageVariables.COMPANY_CURRENT_PROFIT = pageVariables.COMPANY_CURRENT_PROFIT === null ? (profit_chart_data[DashBoardGeneralPageFunction.GetSub(new Date().toString(), pageVariables.CURRENT_PERIOD) - 1] * cast_billion) : pageVariables.COMPANY_CURRENT_PROFIT
            let company_last_profit = profit_chart_data[DashBoardGeneralPageFunction.GetSub(new Date().toString(), pageVariables.CURRENT_PERIOD) - 2] * cast_billion || 0
            $('#current-profit').attr('data-init-money', pageVariables.COMPANY_CURRENT_PROFIT)
            let up_down_profit = pageVariables.COMPANY_CURRENT_PROFIT - company_last_profit
            if (up_down_profit >= 0) {
                $('#current-profit-status').attr('title', pageElements.$trans_script.attr('data-compare-with-last-month')).attr('class', 'badge badge-sm badge-soft-success ml-1 d-inline-flex align-items-center').html(`<i class="bi bi-arrow-up"></i><span class="mask-money" data-init-money="${up_down_profit}"></span>`)
            }
            else {
                $('#current-profit-status').attr('title', pageElements.$trans_script.attr('data-compare-with-last-month')).attr('class', 'badge badge-sm badge-soft-danger ml-1 d-inline-flex align-items-center').html(`<i class="bi bi-arrow-down"></i><span class="mask-money" data-init-money="${Math.abs(up_down_profit)}"></span>`)
            }

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
                label: pageElements.$trans_script.attr('data-trans-expected'),
                data: revenue_expected_data,
            },
            {
                label: pageElements.$trans_script.attr('data-trans-reality'),
                data: revenue_chart_data,
            }
        ]

        let profit_series_data = [
            {
                label: pageElements.$trans_script.attr('data-trans-expected'),
                data: profit_expected_data,
            },
            {
                label: pageElements.$trans_script.attr('data-trans-reality'),
                data: profit_chart_data,
            }
        ]

        if (new Date().getFullYear() === pageVariables.CURRENT_PERIOD?.['fiscal_year']) {
            for (let i = new Date().getMonth() + 1 - pageVariables.CURRENT_PERIOD?.['space_month']; i < 12; i++) {
                revenue_chart_data[i] = null;
                profit_chart_data[i] = null;
            }

            revenue_series_data = [
                {
                    label: pageElements.$trans_script.attr('data-trans-expected'),
                    data: revenue_expected_data,
                },
                {
                    label: pageElements.$trans_script.attr('data-trans-reality'),
                    data: revenue_chart_data,
                }
            ]

            profit_series_data = [
                {
                    label: pageElements.$trans_script.attr('data-trans-expected'),
                    data: profit_expected_data,
                },
                {
                    label: pageElements.$trans_script.attr('data-trans-reality'),
                    data: profit_chart_data,
                }
            ]
        }

        return [revenue_series_data, profit_series_data]
    }
}

/**
 * Khai báo các hàm chính
 */
class DashBoardGeneralHandler {

}

/**
 * Khai báo các Event
 */
class DashBoardGeneralEventHandler {
    static InitPageEven() {
        $('.btn-group .dropdown-menu').on('click', function (e) {
            e.stopPropagation();
        });
        pageElements.$money_display.on('change', function () {
            pageVariables.COMPANY_CURRENT_REVENUE = null
            pageVariables.COMPANY_CURRENT_PROFIT = null
            DashBoardGeneralPageFunction.DrawRevenueProfitChart()
        })
        pageElements.$money_round.on('change', function () {
            $(this).val($(this).val() || 1);
            DashBoardGeneralPageFunction.DrawRevenueProfitChart()
        })
        // Revenue and Profit
        pageElements.$reload_revenue_profit_data_btn.on('click', function () {
            DashBoardGeneralPageFunction.DrawRevenueProfitChart()
        })
        pageElements.$revenueprofitViewTypeEle.on('change', function () {
            DashBoardGeneralPageFunction.DrawRevenueProfitChart()
        })
        pageElements.$profitTypeEle.on('change', function () {
            DashBoardGeneralPageFunction.DrawRevenueProfitChart()
        })
    }
}


$(document).ready(function () {
    DashBoardGeneralEventHandler.InitPageEven()
    // Load Page
    DashBoardGeneralPageFunction.LoadPeriod(pageVariables.CURRENT_PERIOD)
    DashBoardGeneralPageFunction.LoadRevenueGroup()
    DashBoardGeneralPageFunction.DrawRevenueProfitChart()
    setInterval(DashBoardGeneralPageFunction.DrawRevenueProfitChart, 15 * 60 * 1000);
})
