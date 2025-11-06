$(document).ready(function () {
    const CHART_COLORS = {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        light: '#f3f4f6',
        dark: '#1f2937'
    }
    
    const scriptUrlEle = $('#script-url')
    const trans_script = $('#trans-script')
    const moneyDisplayEle = $('#money-display')
    const periodFiscalYearFilterEle = $('#period-filter')
    const current_period_Ele = $('#current_period')
    const current_period = current_period_Ele.text() ? JSON.parse(current_period_Ele.text()) : {}
    let period_selected_Setting = current_period
    let fiscal_year_Setting = current_period?.['fiscal_year']
    let space_month_Setting = current_period?.['space_month']
    let CURRENT_GROUP = []

    moneyDisplayEle.on('change', function () {
        COMPANY_CURRENT_REVENUE = 0
        COMPANY_CURRENT_PROFIT = 0
        DrawRevenueProfitChart(false)
        DrawTopSaleCustomerChart(false)
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
            period_selected_Setting = SelectDDControl.get_data_from_idx(periodFiscalYearFilterEle, periodFiscalYearFilterEle.val())
            fiscal_year_Setting = period_selected_Setting?.['fiscal_year']
            space_month_Setting = period_selected_Setting?.['space_month']
            DrawRevenueProfitChart(false)
            DrawTopSaleCustomerChart(false)
            DrawTopCategoryProductChart(false)
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

    // Handle window resize
    window.addEventListener('resize', function() {
        if (revenue_chart_compare) revenue_chart_compare.resize();
        if (profit_chart_compare) profit_chart_compare.resize();
    });

    LoadPeriod(current_period)

    // FOR COMPARE
    let revenueprofit_DF_compare_1 = []
    let revenue_chart_compare = null
    let revenue_expected_DF_compare_1 = []
    let profit_chart_compare = null
    let profit_expected_DF_compare_1 = []
    let profit_expected_type_compare_1 = null

    function RevenueProfitChartCfg(labelX, data_list, chart_title='', titleX='', titleY='') {
        return {
            textStyle: {
                fontFamily: 'Arial, Helvetica, sans-serif'
            },
            title: {
                text: chart_title,
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: true
                },
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(function(item) {
                        result += `${item.marker} ${item.seriesName}: ${item.value ? item.value : '--'}<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: data_list.map(item => item.name),
                bottom: 0,
                selectedMode: 'multiple'
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '2%',
                top: '2%',
                feature: {
                    dataView: {
                        readOnly: false,
                        title: 'Xem dữ liệu',
                        lang: ['Dữ liệu', 'Đóng', 'Làm mới']
                    },
                    magicType: {
                        type: ['line', 'bar'],
                        title: {
                            line: 'Biểu đồ đường',
                            bar: 'Biểu đồ cột'
                        }
                    },
                    restore: {
                        title: 'Khôi phục'
                    },
                    saveAsImage: {
                        title: 'Lưu hình',
                        pixelRatio: 2
                    }
                }
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }],
            grid: {
                left: '1%',
                right: '1%',
                bottom: '15%',
                top: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: labelX,
                name: titleX,
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: {
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: 'shadow'
                }
            },
            yAxis: {
                type: 'value',
                name: titleY,
                nameLocation: 'middle',
                nameGap: 60,
                nameTextStyle: {
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: 'line'
                }
            },
            animation: true,
            animationThreshold: 2000,
            animationDuration: 1000,
            animationEasing: 'cubicOut',
            animationDelay: function (idx) {
                return idx * 50;
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'cubicOut',
            series: data_list.map((item, index) => ({
                ...item,
                type: 'line',
                smooth: true,
                emphasis: {
                    focus: 'series',
                    blurScope: 'coordinateSystem',
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,0.3)'
                    }
                },
                lineStyle: {
                    width: 3
                },
                itemStyle: {
                    borderRadius: 0
                },
                animationDelay: function (idx) {
                    return idx * 10 + index * 100;
                }
            }))
        }
    }

    function GetRevenueProfitChartCompareDatasets() {
        const type = revenueprofitViewTypeCompareEle.val() === '0' ? 'Period' : 'Accumulated'
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let revenue_chart_data_compare = Array(12).fill(0)
        let profit_chart_data_compare = Array(12).fill(0)
        for (const item of revenueprofit_DF) {
            let index = GetSub(item?.['date_approved'], period_selected_Setting) - 1

            revenue_chart_data_compare[index] += Number(item?.['revenue'] || 0)

            if (profitTypeCompareEle.val() === '0') {
                profit_chart_data_compare[index] += Number(item?.['gross_profit'] || 0)
            }
            else {
                profit_chart_data_compare[index] += Number(item?.['net_income'] || 0)
            }
        }

        revenue_chart_data_compare = revenue_chart_data_compare.map(value => Number((value / cast_billion)));
        profit_chart_data_compare = profit_chart_data_compare.map(value => Number((value / cast_billion)));

        let revenue_expected_data_compare = revenue_expected_DF_compare_1.map(value => Number((value / cast_billion)));
        let profit_expected_data_compare = profit_expected_DF_compare_1.map(value => Number((value / cast_billion)));

        if (type === 'Accumulated') {
            for (let i = 0; i < revenue_chart_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = revenue_chart_data[i - 1]
                }
                revenue_chart_data_compare[i] += last_sum
            }
            for (let i = 0; i < revenue_expected_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = revenue_expected_data[i - 1]
                }
                revenue_expected_data_compare[i] += last_sum
            }

            for (let i = 0; i < profit_chart_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = profit_chart_data[i - 1]
                }
                profit_chart_data_compare[i] += last_sum
            }
            for (let i = 0; i < profit_expected_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = profit_expected_data[i - 1]
                }
                profit_expected_data_compare[i] += last_sum
            }
        }

        let revenue_series_data_compare = [
            {
                name: trans_script.attr('data-trans-expected'),
                data: revenue_expected_data_compare,
                itemStyle: { color: CHART_COLORS.primary }
            },
            {
                name: trans_script.attr('data-trans-reality'),
                data: revenue_chart_data_compare,
                itemStyle: { color: CHART_COLORS.danger }
            }
        ]

        let profit_series_data_compare = [
            {
                name: trans_script.attr('data-trans-expected'),
                data: profit_expected_data_compare,
                itemStyle: { color: CHART_COLORS.info }
            },
            {
                name: trans_script.attr('data-trans-reality'),
                data: profit_chart_data_compare,
                itemStyle: { color: CHART_COLORS.success }
            }
        ]

        if (new Date().getFullYear() === fiscal_year_Setting) {
            for (let i = new Date().getMonth() + 1 - space_month_Setting; i < 12; i++) {
                revenue_chart_data_compare[i] = null;
                profit_chart_data_compare[i] = null;
            }

            revenue_series_data_compare[1].data = revenue_chart_data_compare;
            profit_series_data_compare[1].data = profit_chart_data_compare;
        }

        return [revenue_series_data_compare, profit_series_data_compare]
    }

    function DrawRevenueProfitChartCompare(is_init=false) {
        if ((revenueprofitGroupCompareEle1.val() || []).length > 0 && (revenueprofitGroupCompareEle2.val() || []).length > 0) {
            WindowControl.showLoading()

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

            Promise.all([report_revenue_ajax, revenue_plan_by_report_perm_ajax]).then(
                (results) => {
                    revenueprofit_DF_compare_1 = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })
                    let selected_group_list = revenueprofitGroupCompareEle1.val() || []
                    if (selected_group_list.length > 0) {
                        if (revenueprofitGroupTypeCompareEle.val() === '0') {
                            revenueprofit_DF_compare_1 = revenueprofit_DF_compare_1.filter(item => {
                                return selected_group_list.includes(item?.['group_inherit_id'])
                            })
                        } else {
                            let all_children_group_list = []
                            for (let i = 0; i < selected_group_list.length; i++) {
                                let selected_group = CURRENT_GROUP.find(item => item?.['id'] === selected_group_list[i])
                                all_children_group_list.push(...selected_group?.['all_children_group_list'] || []);
                            }
                            all_children_group_list.push(...selected_group_list)
                            all_children_group_list = [...new Set(all_children_group_list)];
                            revenueprofit_DF_compare_1 = revenueprofit_DF_compare_1.filter(item => {
                                return all_children_group_list.includes(item?.['group_inherit_id'])
                            })
                        }
                    }

                    revenue_expected_DF_compare_1 = Array(12).fill(0)
                    profit_expected_DF_compare_1 = Array(12).fill(0)
                    profit_expected_type_compare_1 = results[1].length ? results[1][0]?.['profit_target_type'] : null

                    // auto change profit type
                    if (is_init) {
                        profitTypeCompareEle.val(profit_expected_type_compare_1)
                    }

                    if (parseInt(profit_expected_type_compare_1) === parseInt(profitTypeCompareEle.val())) {
                        for (let i = 0; i < results[1].length; i++) {
                            if (selected_group_list.length === 0 || selected_group_list.includes(results[1][i]?.['employee_mapped']?.['group']?.['id'])) {
                                const empMonthTarget = results[1][i]?.['emp_month_target']
                                if (Array.isArray(empMonthTarget)) {
                                    for (let j = 0; j < empMonthTarget.length; j++) {
                                        revenue_expected_DF_compare_1[j] += empMonthTarget[j] || 0
                                    }
                                }
                                const empMonthProfitTarget = results[1][i]?.['emp_month_profit_target']
                                if (Array.isArray(empMonthProfitTarget)) {
                                    for (let j = 0; j < empMonthProfitTarget.length; j++) {
                                        profit_expected_DF_compare_1[j] += empMonthProfitTarget[j] || 0
                                    }
                                }
                            }
                        }
                    }

                    if (!is_init && revenue_chart_compare && profit_chart_compare) {
                        revenue_chart_compare.dispose();
                        profit_chart_compare.dispose();
                    }

                    const revenueContainerCompare = document.getElementById('revenue_chart_compare');
                    const profitContainerCompare = document.getElementById('profit_chart_compare');

                    revenue_chart_compare = echarts.init(revenueContainerCompare);
                    profit_chart_compare = echarts.init(profitContainerCompare);

                    let [revenueChartCompareDataset, profitChartCompareDataset] = GetRevenueProfitChartCompareDatasets()
                    console.log([revenueChartCompareDataset, profitChartCompareDataset])

                    revenue_chart_compare.setOption(RevenueProfitChartCfg(
                        getMonthOrder(space_month_Setting),
                        revenueChartCompareDataset,
                        trans_script.attr('data-trans-chart-revenue'),
                        trans_script.attr('data-trans-month'),
                        trans_script.attr('data-trans-revenue'),
                    ))

                    profit_chart_compare.setOption(RevenueProfitChartCfg(
                        getMonthOrder(space_month_Setting),
                        profitChartCompareDataset,
                        trans_script.attr('data-trans-chart-profit'),
                        trans_script.attr('data-trans-month'),
                        trans_script.attr('data-trans-profit'),
                    ))

                    WindowControl.hideLoading()
                })
        }
    }

    const revenueprofitGroupTypeCompareEle = $('#revenue-profit-group-type-compare')
    revenueprofitGroupTypeCompareEle.on('change', function () {
        DrawRevenueProfitChartCompare(false)
    })

    const revenueprofitViewTypeCompareEle = $('#revenue-profit-view-type-compare')
    revenueprofitViewTypeCompareEle.on('change', function () {
        DrawRevenueProfitChartCompare(false)
    })

    const revenueprofitGroupCompareEle1 = $('#revenue-profit-group-compare-1')
    LoadRevenueGroup(revenueprofitGroupCompareEle1)
    revenueprofitGroupCompareEle1.on('change', function () {
        DrawRevenueProfitChartCompare(false)
    })

    const revenueprofitGroupCompareEle2 = $('#revenue-profit-group-compare-2')
    LoadRevenueGroup(revenueprofitGroupCompareEle2)
    revenueprofitGroupCompareEle2.on('change', function () {
        DrawRevenueProfitChartCompare(false)
    })

    const profitTypeCompareEle = $('#profit-type-compare')
    profitTypeCompareEle.on('change', function () {
        DrawRevenueProfitChartCompare(false)
    })

    DrawRevenueProfitChartCompare(true)
})
