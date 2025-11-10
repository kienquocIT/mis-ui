$(document).ready(function () {
    const CHART_COLORS = {
        primary: '#3b82f6',       // Xanh biển đậm
        primary_soft: '#93c5fd',  // Xanh biển nhạt
        success: '#10b981',       // Xanh lá đậm
        success_soft: '#6ee7b7',  // Xanh lá nhạt
    };
    
    const scriptUrlEle = $('#script-url')
    const trans_script = $('#trans-script')
    const moneyDisplayEle = $('#money-display')
    const current_period_Ele = $('#current_period')
    const current_period = current_period_Ele.text() ? JSON.parse(current_period_Ele.text()) : {}
    let period_selected_Setting = current_period
    let fiscal_year_Setting = current_period?.['fiscal_year']
    let space_month_Setting = current_period?.['space_month']
    let CURRENT_GROUP_COMPARE_1 = []
    let CURRENT_GROUP_COMPARE_2 = []

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
        if (revenue_profit_chart_compare_1) revenue_profit_chart_compare_1.resize();
        if (revenue_profit_chart_compare_2) revenue_profit_chart_compare_2.resize();
    });

    // FOR COMPARE
    let revenue_profit_chart_compare_1 = null
    let revenue_profit_chart_compare_2 = null

    let revenue_profit_DF_compare_1 = []
    let revenue_expected_DF_compare_1 = []
    let profit_expected_DF_compare_1 = []

    let revenue_profit_DF_compare_2 = []
    let revenue_expected_DF_compare_2 = []
    let profit_expected_DF_compare_2 = []

    let profit_expected_type_compare = null

    function RevenueProfitChartCfg(labelX, data_list_revenue, data_list_profit, chart_title = '', titleX = '', titleY = '') {
        const combinedSeries = [
            {...data_list_revenue[0], name: trans_script.attr('data-trans-expected-revenue'), type: 'bar', itemStyle: {color: CHART_COLORS.primary}},
            {...data_list_revenue[1], name: trans_script.attr('data-trans-reality-revenue'), type: 'bar', itemStyle: {color: CHART_COLORS.primary_soft}},
            {...data_list_profit[0], name: trans_script.attr('data-trans-expected-profit'), type: 'bar', itemStyle: {color: CHART_COLORS.success}},
            {...data_list_profit[1], name: trans_script.attr('data-trans-reality-profit'), type: 'bar', itemStyle: {color: CHART_COLORS.success_soft}},
        ];

        return {
            textStyle: {
                color: '#000',
                fontFamily: 'Arial, Helvetica, sans-serif'
            },
            title: {
                text: chart_title,
                left: 'center',
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {type: 'shadow'},
                formatter: (params) => {
                    let result = params[0].name + '<br/>';
                    params.forEach(item => {
                        result += `${item.marker} ${item.seriesName}: ${item.value ?? '--'}<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: combinedSeries.map(i => i.name),
                bottom: 0,
                selectedMode: 'multiple'
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '2%',
                top: '2%',
                feature: {
                    dataView: {readOnly: false, lang: ['Dữ liệu', 'Đóng', 'Làm mới']},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {pixelRatio: 2}
                }
            },
            dataZoom: [{type: 'inside', start: 0, end: 100}],
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
                axisPointer: {type: 'shadow'}
            },
            yAxis: {
                type: 'value',
                name: titleY,
                nameLocation: 'middle',
                nameGap: 60
            },
            series: combinedSeries.map((s, index) => ({
                ...s,
                barGap: 0,
                barCategoryGap: '40%',
                emphasis: {
                    focus: 'series',
                    itemStyle: {shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)'}
                },
                itemStyle: {
                    ...s.itemStyle,
                    borderRadius: [8, 8, 0, 0]
                },
                animationDelay: (idx) => idx * 20 + index * 80
            }))
        };
    }

    function GetRevenueProfitChartCompareDatasets1() {
        const type = revenueprofitViewTypeCompareEle.val() === '0' ? 'Period' : 'Accumulated'
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let revenue_chart_data_compare = Array(12).fill(0)
        let profit_chart_data_compare = Array(12).fill(0)
        for (const item of revenue_profit_DF_compare_1) {
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
                    last_sum = revenue_chart_data_compare[i - 1]
                }
                revenue_chart_data_compare[i] += last_sum
            }
            for (let i = 0; i < revenue_expected_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = revenue_expected_data_compare[i - 1]
                }
                revenue_expected_data_compare[i] += last_sum
            }

            for (let i = 0; i < profit_chart_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = profit_chart_data_compare[i - 1]
                }
                profit_chart_data_compare[i] += last_sum
            }
            for (let i = 0; i < profit_expected_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = profit_expected_data_compare[i - 1]
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

    function GetRevenueProfitChartCompareDatasets2() {
        const type = revenueprofitViewTypeCompareEle.val() === '0' ? 'Period' : 'Accumulated'
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let revenue_chart_data_compare = Array(12).fill(0)
        let profit_chart_data_compare = Array(12).fill(0)
        for (const item of revenue_profit_DF_compare_2) {
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

        let revenue_expected_data_compare = revenue_expected_DF_compare_2.map(value => Number((value / cast_billion)));
        let profit_expected_data_compare = profit_expected_DF_compare_2.map(value => Number((value / cast_billion)));

        if (type === 'Accumulated') {
            for (let i = 0; i < revenue_chart_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = revenue_chart_data_compare[i - 1]
                }
                revenue_chart_data_compare[i] += last_sum
            }
            for (let i = 0; i < revenue_expected_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = revenue_expected_data_compare[i - 1]
                }
                revenue_expected_data_compare[i] += last_sum
            }

            for (let i = 0; i < profit_chart_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = profit_chart_data_compare[i - 1]
                }
                profit_chart_data_compare[i] += last_sum
            }
            for (let i = 0; i < profit_expected_data_compare.length; i++) {
                let last_sum = 0
                if (i > 0) {
                    last_sum = profit_expected_data_compare[i - 1]
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

    function LoadRevenueGroup1(ele, data) {
        ele.initSelect2({
            allowClear: true,
            placeholder: trans_script.attr('data-trans-all'),
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<div class="row w-100">
                    <div class="col-12">
                        <span>${state.data?.['title']}</span>
                        <span class="bflow-mirrow-badge-sm">Level ${state.data?.['level'] || ''} ${state.data?.['parent_n']?.['title'] ? `(${$.fn.gettext('Parent')}: ${state.data?.['parent_n']?.['title']})` : ''}</span>
                    </div>
                </div>`);
            },
            callbackDataResp: function (resp, keyResp) {
                CURRENT_GROUP_COMPARE_1.push(...resp.data[keyResp])
                return resp.data[keyResp]
            },
            data: (data ? data : null),
            keyResp: 'group_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    function LoadRevenueGroup2(ele, data) {
        ele.initSelect2({
            allowClear: true,
            placeholder: trans_script.attr('data-trans-all'),
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<div class="row w-100">
                    <div class="col-12">
                        <span>${state.data?.['title']}</span>
                        <span class="bflow-mirrow-badge-sm">Level ${state.data?.['level'] || ''} ${state.data?.['parent_n']?.['title'] ? `(${$.fn.gettext('Parent')}: ${state.data?.['parent_n']?.['title']})` : ''}</span>
                    </div>
                </div>`);
            },
            callbackDataResp: function (resp, keyResp) {
                CURRENT_GROUP_COMPARE_2.push(...resp.data[keyResp])
                return resp.data[keyResp]
            },
            data: (data ? data : null),
            keyResp: 'group_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    function DrawRevenueProfitChartCompare1(is_init=false) {
        if ((revenueprofitGroupCompareEle1.val() || []).length > 0) {
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
                    revenue_profit_DF_compare_1 = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })
                    let selected_group_list = revenueprofitGroupCompareEle1.val() || []
                    if (selected_group_list.length > 0) {
                        if (revenueprofitGroupTypeCompareEle.val() === '0') {
                            revenue_profit_DF_compare_1 = revenue_profit_DF_compare_1.filter(item => {
                                return selected_group_list.includes(item?.['group_inherit_id'])
                            })
                        } else {
                            let all_children_group_list = []
                            for (let i = 0; i < selected_group_list.length; i++) {
                                let selected_group = CURRENT_GROUP_COMPARE_1.find(item => item?.['id'] === selected_group_list[i])
                                all_children_group_list.push(...selected_group?.['all_children_group_list'] || []);
                            }
                            all_children_group_list.push(...selected_group_list)
                            all_children_group_list = [...new Set(all_children_group_list)];
                            revenue_profit_DF_compare_1 = revenue_profit_DF_compare_1.filter(item => {
                                return all_children_group_list.includes(item?.['group_inherit_id'])
                            })
                        }
                    }

                    revenue_expected_DF_compare_1 = Array(12).fill(0)
                    profit_expected_DF_compare_1 = Array(12).fill(0)
                    profit_expected_type_compare = results[1].length ? results[1][0]?.['profit_target_type'] : null

                    // auto change profit type
                    profitTypeCompareEle.val(profit_expected_type_compare)

                    if (parseInt(profit_expected_type_compare) === parseInt(profitTypeCompareEle.val())) {
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

                    if (!is_init && revenue_profit_chart_compare_1) {
                        revenue_profit_chart_compare_1.dispose();
                    }

                    const revenueprofitContainerCompare1 = document.getElementById('revenue_profit_chart_compare_1');

                    revenue_profit_chart_compare_1 = echarts.init(revenueprofitContainerCompare1);

                    let [revenue_chart_compare_dataset, profit_chart_compare_dataset] = GetRevenueProfitChartCompareDatasets1()

                    revenue_profit_chart_compare_1.setOption(RevenueProfitChartCfg(
                        getMonthOrder(space_month_Setting),
                        revenue_chart_compare_dataset,
                        profit_chart_compare_dataset,
                        trans_script.attr('data-trans-revenue-profit-chart'),
                        trans_script.attr('data-trans-month'),
                        '',
                    ))

                    WindowControl.hideLoading()
                })
        }
    }

    function DrawRevenueProfitChartCompare2(is_init=false) {
        if ((revenueprofitGroupCompareEle2.val() || []).length > 0) {
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
                    revenue_profit_DF_compare_2 = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })
                    let selected_group_list = revenueprofitGroupCompareEle2.val() || []
                    if (selected_group_list.length > 0) {
                        if (revenueprofitGroupTypeCompareEle.val() === '0') {
                            revenue_profit_DF_compare_2 = revenue_profit_DF_compare_2.filter(item => {
                                return selected_group_list.includes(item?.['group_inherit_id'])
                            })
                        } else {
                            let all_children_group_list = []
                            for (let i = 0; i < selected_group_list.length; i++) {
                                let selected_group = CURRENT_GROUP_COMPARE_2.find(item => item?.['id'] === selected_group_list[i])
                                all_children_group_list.push(...selected_group?.['all_children_group_list'] || []);
                            }
                            all_children_group_list.push(...selected_group_list)
                            all_children_group_list = [...new Set(all_children_group_list)];
                            revenue_profit_DF_compare_2 = revenue_profit_DF_compare_2.filter(item => {
                                return all_children_group_list.includes(item?.['group_inherit_id'])
                            })
                        }
                    }

                    revenue_expected_DF_compare_2 = Array(12).fill(0)
                    profit_expected_DF_compare_2 = Array(12).fill(0)
                    profit_expected_type_compare = results[1].length ? results[1][0]?.['profit_target_type'] : null

                    // auto change profit type
                    profitTypeCompareEle.val(profit_expected_type_compare)

                    if (parseInt(profit_expected_type_compare) === parseInt(profitTypeCompareEle.val())) {
                        for (let i = 0; i < results[1].length; i++) {
                            if (selected_group_list.length === 0 || selected_group_list.includes(results[1][i]?.['employee_mapped']?.['group']?.['id'])) {
                                const empMonthTarget = results[1][i]?.['emp_month_target']
                                if (Array.isArray(empMonthTarget)) {
                                    for (let j = 0; j < empMonthTarget.length; j++) {
                                        revenue_expected_DF_compare_2[j] += empMonthTarget[j] || 0
                                    }
                                }
                                const empMonthProfitTarget = results[1][i]?.['emp_month_profit_target']
                                if (Array.isArray(empMonthProfitTarget)) {
                                    for (let j = 0; j < empMonthProfitTarget.length; j++) {
                                        profit_expected_DF_compare_2[j] += empMonthProfitTarget[j] || 0
                                    }
                                }
                            }
                        }
                    }

                    if (!is_init && revenue_profit_chart_compare_2) {
                        revenue_profit_chart_compare_2.dispose();
                    }

                    const revenueprofitContainerCompare2 = document.getElementById('revenue_profit_chart_compare_2');

                    revenue_profit_chart_compare_2 = echarts.init(revenueprofitContainerCompare2);

                    let [revenue_chart_compare_dataset, profit_chart_compare_dataset] = GetRevenueProfitChartCompareDatasets2()

                    revenue_profit_chart_compare_2.setOption(RevenueProfitChartCfg(
                        getMonthOrder(space_month_Setting),
                        revenue_chart_compare_dataset,
                        profit_chart_compare_dataset,
                        trans_script.attr('data-trans-revenue-profit-chart'),
                        trans_script.attr('data-trans-month'),
                        '',
                    ))

                    WindowControl.hideLoading()
                })
        }
    }

    const revenueprofitGroupTypeCompareEle = $('#revenue-profit-group-type-compare')
    revenueprofitGroupTypeCompareEle.on('change', function () {
        DrawRevenueProfitChartCompare1(false)
        DrawRevenueProfitChartCompare2(false)
    })

    const revenueprofitViewTypeCompareEle = $('#revenue-profit-view-type-compare')
    revenueprofitViewTypeCompareEle.on('change', function () {
        DrawRevenueProfitChartCompare1(false)
        DrawRevenueProfitChartCompare2(false)
    })

    const revenueprofitGroupCompareEle1 = $('#revenue-profit-group-compare-1')
    LoadRevenueGroup1(revenueprofitGroupCompareEle1)
    revenueprofitGroupCompareEle1.on('change', function () {
        DrawRevenueProfitChartCompare1(false)
    })

    const revenueprofitGroupCompareEle2 = $('#revenue-profit-group-compare-2')
    LoadRevenueGroup2(revenueprofitGroupCompareEle2)
    revenueprofitGroupCompareEle2.on('change', function () {
        DrawRevenueProfitChartCompare2(false)
    })

    const profitTypeCompareEle = $('#profit-type-compare')
    profitTypeCompareEle.on('change', function () {
        DrawRevenueProfitChartCompare1(false)
        DrawRevenueProfitChartCompare2(false)
    })

    DrawRevenueProfitChartCompare1(true)
    DrawRevenueProfitChartCompare2(true)

    $('#reload-revenue-profit-data-btn-compare').on('click', function () {
        DrawRevenueProfitChartCompare1(false)
        DrawRevenueProfitChartCompare2(false)
    })
})
