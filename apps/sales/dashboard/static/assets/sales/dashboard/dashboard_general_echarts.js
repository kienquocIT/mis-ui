$(document).ready(function () {
    const CHART_COLORS = {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
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


    let revenueprofit_DF = []
    let revenue_chart = null
    let revenue_expected_DF = []
    let profit_chart = null
    let profit_expected_DF = []
    let profit_expected_type = null
    let COMPANY_CURRENT_REVENUE = 0
    let COMPANY_CURRENT_PROFIT = 0

    function RevenueProfitChartCfg(labelX, data_list, chart_title='', titleX='', titleY='') {
        return {
            textStyle: {
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: '#000'
            },
            title: {
                text: chart_title,
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: '#000',
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
                    color: '#000',
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
                    color: '#000',
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
                smooth: 0,
                emphasis: {
                    focus: 'series',
                    blurScope: 'coordinateSystem',
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0,0,0,0.3)'
                    }
                },
                lineStyle: {
                    width: 2.5
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

    function DrawRevenueProfitChart(is_init=false) {
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
                revenueprofit_DF = (results[0] ? results[0] : []).filter(item => {
                    return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                })
                let selected_group_list = revenueprofitGroupEle.val() || []
                if (selected_group_list.length > 0) {
                    if (revenueprofitGroupTypeEle.val() === '0') {
                        revenueprofit_DF = revenueprofit_DF.filter(item => {
                            return selected_group_list.includes(item?.['group_inherit_id'])
                        })
                    }
                    else {
                        let all_children_group_list = []
                        for (let i=0; i < selected_group_list.length; i++) {
                            let selected_group = CURRENT_GROUP.find(item => item?.['id'] === selected_group_list[i])
                            all_children_group_list.push(...selected_group?.['all_children_group_list'] || []);
                        }
                        all_children_group_list.push(...selected_group_list)
                        all_children_group_list = [...new Set(all_children_group_list)];
                        revenueprofit_DF = revenueprofit_DF.filter(item => {
                            return all_children_group_list.includes(item?.['group_inherit_id'])
                        })
                    }
                }

                revenue_expected_DF = Array(12).fill(0)
                profit_expected_DF = Array(12).fill(0)
                profit_expected_type = results[1].length ? results[1][0]?.['profit_target_type'] : null

                // auto change profit type
                if (is_init) {
                    profitTypeEle.val(profit_expected_type)
                }

                if (parseInt(profit_expected_type) === parseInt(profitTypeEle.val())) {
                    for (let i = 0; i < results[1].length; i++) {
                        if (selected_group_list.length === 0 || selected_group_list.includes(results[1][i]?.['employee_mapped']?.['group']?.['id'])) {
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

                if (!is_init && revenue_chart && profit_chart) {
                    revenue_chart.dispose();
                    profit_chart.dispose();
                }

                const revenueContainer = document.getElementById('revenue_chart');
                const profitContainer = document.getElementById('profit_chart');
                
                revenue_chart = echarts.init(revenueContainer);
                profit_chart = echarts.init(profitContainer);

                let [revenueChartDataset, profitChartDataset] = GetRevenueProfitChartDatasets()
                
                revenue_chart.setOption(RevenueProfitChartCfg(
                    getMonthOrder(space_month_Setting),
                    revenueChartDataset,
                    trans_script.attr('data-trans-chart-revenue'),
                    trans_script.attr('data-trans-month'),
                    trans_script.attr('data-trans-revenue'),
                ))
                
                profit_chart.setOption(RevenueProfitChartCfg(
                    getMonthOrder(space_month_Setting),
                    profitChartDataset,
                    trans_script.attr('data-trans-chart-profit'),
                    trans_script.attr('data-trans-month'),
                    trans_script.attr('data-trans-profit'),
                ))

                WindowControl.hideLoading()
            })
    }

    function GetRevenueProfitChartDatasets() {
        const type = revenueprofitViewTypeEle.val() === '0' ? 'Period' : 'Accumulated'
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let revenue_chart_data = Array(12).fill(0)
        let profit_chart_data = Array(12).fill(0)
        for (const item of revenueprofit_DF) {
            let index = GetSub(item?.['date_approved'], period_selected_Setting) - 1

            revenue_chart_data[index] += Number(item?.['revenue'] || 0)

            if (profitTypeEle.val() === '0') {
                profit_chart_data[index] += Number(item?.['gross_profit'] || 0)
            }
            else {
                profit_chart_data[index] += Number(item?.['net_income'] || 0)
            }
        }

        revenue_chart_data = revenue_chart_data.map(value => Number((value / cast_billion)));
        profit_chart_data = profit_chart_data.map(value => Number((value / cast_billion)));

        let revenue_expected_data = revenue_expected_DF.map(value => Number((value / cast_billion)));
        let profit_expected_data = profit_expected_DF.map(value => Number((value / cast_billion)));

        if (type === 'Period') {
            COMPANY_CURRENT_REVENUE = revenue_chart_data[GetSub(new Date().toString(), period_selected_Setting) - 1] * cast_billion || 0
            $('#current-revenue').attr('data-init-money', COMPANY_CURRENT_REVENUE)

            COMPANY_CURRENT_PROFIT = profit_chart_data[GetSub(new Date().toString(), period_selected_Setting) - 1] * cast_billion || 0
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
                name: trans_script.attr('data-trans-expected'),
                data: revenue_expected_data,
                color: CHART_COLORS.danger
            },
            {
                name: trans_script.attr('data-trans-reality'),
                data: revenue_chart_data,
                color: CHART_COLORS.primary
            }
        ]

        let profit_series_data = [
            {
                name: trans_script.attr('data-trans-expected'),
                data: profit_expected_data,
                color: CHART_COLORS.warning
            },
            {
                name: trans_script.attr('data-trans-reality'),
                data: profit_chart_data,
                color: CHART_COLORS.success
            }
        ]

        if (new Date().getFullYear() === fiscal_year_Setting) {
            for (let i = new Date().getMonth() + 1 - space_month_Setting; i < 12; i++) {
                revenue_chart_data[i] = null;
                profit_chart_data[i] = null;
            }

            revenue_series_data[1].data = revenue_chart_data;
            profit_series_data[1].data = profit_chart_data;
        }

        return [revenue_series_data, profit_series_data]
    }

    function LoadRevenueGroup(ele, data) {
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
                CURRENT_GROUP.push(...resp.data[keyResp])
                return resp.data[keyResp]
            },
            data: (data ? data : null),
            keyResp: 'group_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    $('#reload-revenue-profit-data-btn').on('click', function () {
        DrawRevenueProfitChart(false)
    })

    const revenueprofitGroupTypeEle = $('#revenue-profit-group-type')
    revenueprofitGroupTypeEle.on('change', function () {
        DrawRevenueProfitChart(false)
    })

    const revenueprofitViewTypeEle = $('#revenue-profit-view-type')
    revenueprofitViewTypeEle.on('change', function () {
        DrawRevenueProfitChart(false)
    })

    const revenueprofitGroupEle = $('#revenue-profit-group')
    revenueprofitGroupEle.on('change', function () {
        DrawRevenueProfitChart(false)
    })

    const profitTypeEle = $('#profit-type')
    profitTypeEle.on('change', function () {
        DrawRevenueProfitChart(false)
    })

    function TopSaleCustomerChartCfg(labelX, data_list, chart_title='', titleX='', titleY='') {
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
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            tooltip: {
                trigger: 'item',
                confine: true,
                formatter: function(params) {
                    if (params.componentType === 'series') {
                        return new Intl.NumberFormat('vi-VN').format(params.value ? params.value : '--');
                    }
                    return '';
                }
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
                    restore: {
                        title: 'Khôi phục'
                    },
                    saveAsImage: {
                        title: 'Lưu hình',
                        pixelRatio: 2
                    }
                }
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '10%',
                top: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: titleX,
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: 'line'
                }
            },
            yAxis: {
                type: 'category',
                data: labelX,
                name: titleY,
                nameLocation: 'middle',
                nameGap: 60,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisLabel: {
                    formatter: function(value) {
                        if (value.length > 15) {
                            return value.substring(0, 15) + '...';
                        }
                        return value;
                    },
                    tooltip: {
                        show: false
                    },
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: 'shadow'
                }
            },
            animation: true,
            animationThreshold: 2000,
            animationDuration: 1000,
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return idx * 100;
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'elasticOut',
            series: [{
                data: data_list[0].data,
                type: 'bar',
                itemStyle: {
                    color: data_list[0].color,
                    borderRadius: [0, 8, 8, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                animationDelay: function (idx) {
                    return idx * 50;
                }
            }]
        }
    }

    function DrawTopSaleCustomerChart(is_init=false, chart_name=['sale', 'customer']) {
        WindowControl.showLoading()

        let report_top_sale_customer_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-top-sale-customer-list'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('report_customer_list')) {
                    return data?.['report_customer_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([report_top_sale_customer_ajax]).then(
            (results) => {
                if (chart_name.includes('sale')) {
                    topSale_DF = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })

                    if (!is_init && topSale_chart) {
                        topSale_chart.dispose();
                    }
                    
                    const topSaleContainer = document.getElementById('topsale_chart');
                    topSale_chart = echarts.init(topSaleContainer);
                    
                    let [topX_full_name, series_data] = GetTopSaleDatasets()
                    topSale_chart.setOption(TopSaleCustomerChartCfg(
                        topX_full_name,
                        series_data,
                        trans_script.attr('data-trans-chart-topsale'),
                        trans_script.attr('data-trans-revenue'),
                        ''
                    ))
                }
                if (chart_name.includes('customer')) {
                    topCustomer_DF = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })

                    if (!is_init && topCustomer_chart) {
                        topCustomer_chart.dispose();
                    }
                    
                    const topCustomerContainer = document.getElementById('topcustomer_chart');
                    topCustomer_chart = echarts.init(topCustomerContainer);
                    
                    let [topX_title, series_data] = GetTopCustomerDatasets()
                    topCustomer_chart.setOption(TopSaleCustomerChartCfg(
                        topX_title,
                        series_data,
                        trans_script.attr('data-trans-chart-topcustomer'),
                        trans_script.attr('data-trans-revenue'),
                        ''
                    ))
                }

                WindowControl.hideLoading()
            })
    }

    $('#reload-top-sale-customer-data-btn').on('click', function () {
        DrawTopSaleCustomerChart(false)
    })

    const topSaleCustomerTimeEle = $('#top-sale-customer-time')
    topSaleCustomerTimeEle.on('change', function () {
        topSaleCustomerTimeDetailEle.empty()
        if ($(this).val() === '0') {
            topSaleCustomerTimeDetailEle.prop('disabled', false)
            for (let i = 0; i < period_selected_Setting?.['subs'].length; i++) {
                let sub = period_selected_Setting?.['subs'][i]
                let value = sub?.['order'] + space_month_Setting
                topSaleCustomerTimeDetailEle.append(`<option value="${value <= 12 ? value : value - 12}">${moment(sub?.['start_date'], 'YYYY-MM-DD').format('MM/YYYY')}</option>`)
            }
        }
        else if ($(this).val() === '1') {
            topSaleCustomerTimeDetailEle.prop('disabled', false)
            for (let i = 1; i <= 4; i++) {
                topSaleCustomerTimeDetailEle.append(`<option value="${i}">${trans_script.attr(`data-trans-quarter-${i}`)}</option>`)
            }
        }
        else if ($(this).val() === '2') {
            topSaleCustomerTimeDetailEle.prop('disabled', true)
        }
        DrawTopSaleCustomerChart(false)
    })

    const topSaleCustomerTimeDetailEle = $('#top-sale-customer-time-detail')
    topSaleCustomerTimeDetailEle.on('change', function () {
        DrawTopSaleCustomerChart(false)
    })

    let topSale_chart = null
    let topSale_DF = []

    function GetTopSaleDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let topSale_chart_data = []
        for (const item of topSale_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const filterTimes = topSaleCustomerTimeEle.val()
            if (filterTimes === '0') {
                if (dateApproved.getMonth() + 1 === parseInt(topSaleCustomerTimeDetailEle.val())) {
                    topSale_chart_data.push({
                        'id': item?.['employee_inherit']?.['id'],
                        'full_name': item?.['employee_inherit']?.['full_name'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '1') {
                if (GetQuarter(dateApproved, period_selected_Setting) === parseInt(topSaleCustomerTimeDetailEle.val())) {
                    topSale_chart_data.push({
                        'id': item?.['employee_inherit']?.['id'],
                        'full_name': item?.['employee_inherit']?.['full_name'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '2') {
                topSale_chart_data.push({
                    'id': item?.['employee_inherit']?.['id'],
                    'full_name': item?.['employee_inherit']?.['full_name'],
                    'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                })
            }
        }
        let topSale_chart_data_sum = {}
        for (const item of topSale_chart_data) {
            if (topSale_chart_data_sum[item.id] !== undefined) {
                topSale_chart_data_sum[item.id].revenue += item.revenue
            } else {
                topSale_chart_data_sum[item.id] = item
            }
        }
        topSale_chart_data = Object.values(topSale_chart_data_sum)

        topSale_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = topSale_chart_data.slice(0, topSaleNumberEle.val())
        let topX_revenue = topX.map(item => item.revenue);
        let topX_full_name = topX.map(item => item.full_name);
        
        // Reverse arrays to show from high to low (top to bottom)
        topX_revenue.reverse();
        topX_full_name.reverse();
        
        let series_data = [{
            data: topX_revenue,
            color: CHART_COLORS.warning
        }]

        return [topX_full_name, series_data]
    }

    const topSaleNumberEle = $('#top-sale-number')
    topSaleNumberEle.on('change', function () {
        DrawTopSaleCustomerChart(false, ['sale'])
    })

    let topCustomer_chart = null
    let topCustomer_DF = []

    function GetTopCustomerDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let topCustomer_chart_data = []
        for (const item of topCustomer_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const filterTimes = topSaleCustomerTimeEle.val()
            if (filterTimes === '0') {
                if (dateApproved.getMonth() + 1 === parseInt(topSaleCustomerTimeDetailEle.val())) {
                    topCustomer_chart_data.push({
                        'id': item?.['customer']?.['id'],
                        'title': item?.['customer']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '1') {
                if (GetQuarter(dateApproved, period_selected_Setting) === parseInt(topSaleCustomerTimeDetailEle.val())) {
                    topCustomer_chart_data.push({
                        'id': item?.['customer']?.['id'],
                        'title': item?.['customer']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '2') {
                topCustomer_chart_data.push({
                    'id': item?.['customer']?.['id'],
                    'title': item?.['customer']?.['title'],
                    'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                })
            }
        }
        let topCustomer_chart_data_sum = {}
        for (const item of topCustomer_chart_data) {
            if (topCustomer_chart_data_sum[item.id] !== undefined) {
                topCustomer_chart_data_sum[item.id].revenue += item.revenue
            } else {
                topCustomer_chart_data_sum[item.id] = item
            }
        }
        topCustomer_chart_data = Object.values(topCustomer_chart_data_sum)

        topCustomer_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = topCustomer_chart_data.slice(0, topCustomerNumberEle.val())
        let topX_revenue = topX.map(item => item.revenue);
        let topX_title = topX.map(item => item.title);
        
        // Reverse arrays to show from high to low (top to bottom)
        topX_revenue.reverse();
        topX_title.reverse();
        
        let series_data = [{
            data: topX_revenue,
            color: CHART_COLORS.secondary
        }]

        return [topX_title, series_data]
    }

    const topCustomerNumberEle = $('#top-customer-number')
    topCustomerNumberEle.on('change', function () {
        DrawTopSaleCustomerChart(false, ['customer'])
    })

    function TopCategoryProductChartCfg(labelX, data_list, chart_title='', titleX='', titleY='') {
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
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            tooltip: {
                trigger: 'item',
                confine: true,
                formatter: function(params) {
                    if (params.componentType === 'series') {
                        return new Intl.NumberFormat('vi-VN').format(params.value ? params.value : '--');
                    }
                    return '';
                }
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
                    restore: {
                        title: 'Khôi phục'
                    },
                    saveAsImage: {
                        title: 'Lưu hình',
                        pixelRatio: 2
                    }
                }
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '10%',
                top: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name: titleX,
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: 'line'
                }
            },
            yAxis: {
                type: 'category',
                data: labelX,
                name: titleY,
                nameLocation: 'middle',
                nameGap: 60,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisLabel: {
                    formatter: function(value) {
                        if (value.length > 15) {
                            return value.substring(0, 15) + '...';
                        }
                        return value;
                    },
                    tooltip: {
                        show: false
                    },
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: 'shadow'
                }
            },
            animation: true,
            animationThreshold: 2000,
            animationDuration: 1200,
            animationEasing: 'backOut',
            animationDelay: function (idx) {
                return idx * 80;
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'backOut',
            series: [{
                data: data_list[0].data,
                type: 'bar',
                itemStyle: {
                    color: data_list[0].color,
                    borderRadius: [0, 8, 8, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                animationDelay: function (idx) {
                    return idx * 60;
                }
            }]
        }
    }

    function DrawTopCategoryProductChart(is_init=false, chart_name=['category', 'product']) {
        WindowControl.showLoading()

        let report_top_category_product_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-top-category-product-list'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('report_product_list')) {
                    return data?.['report_product_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([report_top_category_product_ajax]).then(
            (results) => {
                if (chart_name.includes('category')) {
                    topCategory_DF = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })

                    if (!is_init && topCategory_chart) {
                        topCategory_chart.dispose();
                    }
                    
                    const topCategoryContainer = document.getElementById('topcategory_chart');
                    topCategory_chart = echarts.init(topCategoryContainer);
                    
                    let [topX_title, series_data] = GetTopCategoryDatasets()
                    topCategory_chart.setOption(TopCategoryProductChartCfg(
                        topX_title,
                        series_data,
                        trans_script.attr('data-trans-chart-topcategory'),
                        trans_script.attr('data-trans-revenue'),
                        ''
                    ))
                }
                if (chart_name.includes('product')) {
                    topProduct_DF = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })

                    if (!is_init && topProduct_chart) {
                        topProduct_chart.dispose();
                    }
                    
                    const topProductContainer = document.getElementById('topproduct_chart');
                    topProduct_chart = echarts.init(topProductContainer);
                    
                    let [topX_title, series_data] = GetTopProductDatasets()
                    topProduct_chart.setOption(TopCategoryProductChartCfg(
                        topX_title,
                        series_data,
                        trans_script.attr('data-trans-chart-topproduct'),
                        trans_script.attr('data-trans-revenue'),
                        ''
                    ))
                }

                WindowControl.hideLoading()
            })
    }

    $('#reload-top-category-product-data-btn').on('click', function () {
        DrawTopCategoryProductChart(false)
    })

    const topCategoryProductTimeEle = $('#top-category-product-time')
    topCategoryProductTimeEle.on('change', function () {
        topCategoryProductTimeDetailEle.empty()
        if ($(this).val() === '0') {
            topCategoryProductTimeDetailEle.prop('disabled', false)
            for (let i = 0; i < period_selected_Setting?.['subs'].length; i++) {
                let sub = period_selected_Setting?.['subs'][i]
                let value = sub?.['order'] + space_month_Setting
                topCategoryProductTimeDetailEle.append(`<option value="${value <= 12 ? value : value - 12}">${moment(sub?.['start_date'], 'YYYY-MM-DD').format('MM/YYYY')}</option>`)
            }
        }
        else if ($(this).val() === '1') {
            topCategoryProductTimeDetailEle.prop('disabled', false)
            for (let i = 1; i <= 4; i++) {
                topCategoryProductTimeDetailEle.append(`<option value="${i}">${trans_script.attr(`data-trans-quarter-${i}`)}</option>`)
            }
        }
        else if ($(this).val() === '2') {
            topCategoryProductTimeDetailEle.prop('disabled', true)
        }
        DrawTopCategoryProductChart(false)
    })

    const topCategoryProductTimeDetailEle = $('#top-category-product-time-detail')
    topCategoryProductTimeDetailEle.on('change', function () {
        DrawTopCategoryProductChart(false)
    })

    let topCategory_chart = null
    let topCategory_DF = []

    function GetTopCategoryDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let topCategory_chart_data = []
        for (const item of topCategory_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const filterTimes = topCategoryProductTimeEle.val()
            if (filterTimes === '0') {
                if (dateApproved.getMonth() + 1 === parseInt(topCategoryProductTimeDetailEle.val())) {
                    topCategory_chart_data.push({
                        'id': item?.['product']?.['general_product_category']?.['id'],
                        'title': item?.['product']?.['general_product_category']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '1') {
                if (GetQuarter(dateApproved, period_selected_Setting) === parseInt(topCategoryProductTimeDetailEle.val())) {
                    topCategory_chart_data.push({
                        'id': item?.['product']?.['general_product_category']?.['id'],
                        'title': item?.['product']?.['general_product_category']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '2') {
                topCategory_chart_data.push({
                    'id': item?.['product']?.['general_product_category']?.['id'],
                    'title': item?.['product']?.['general_product_category']?.['title'],
                    'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                })
            }
        }
        let topCategory_chart_data_sum = {}
        for (const item of topCategory_chart_data) {
            if (topCategory_chart_data_sum[item.id] !== undefined) {
                topCategory_chart_data_sum[item.id].revenue += item.revenue
            } else {
                topCategory_chart_data_sum[item.id] = item
            }
        }
        topCategory_chart_data = Object.values(topCategory_chart_data_sum)

        topCategory_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = topCategory_chart_data.slice(0, topCategoryNumberEle.val())
        let topX_revenue = topX.map(item => item.revenue);
        let topX_title = topX.map(item => item.title);
        
        // Reverse arrays to show from high to low (top to bottom)
        topX_revenue.reverse();
        topX_title.reverse();
        
        let series_data = [{
            data: topX_revenue,
            color: CHART_COLORS.primary
        }]

        return [topX_title, series_data]
    }

    const topCategoryNumberEle = $('#top-category-number')
    topCategoryNumberEle.on('change', function () {
        DrawTopCategoryProductChart(false, ['category'])
    })

    let topProduct_chart = null
    let topProduct_DF = []

    function GetTopProductDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6

        let topProduct_chart_data = []
        for (const item of topProduct_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const filterTimes = topCategoryProductTimeEle.val()
            if (filterTimes === '0') {
                if (dateApproved.getMonth() + 1 === parseInt(topCategoryProductTimeDetailEle.val())) {
                    topProduct_chart_data.push({
                        'id': item?.['product']?.['id'],
                        'title': item?.['product']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '1') {
                if (GetQuarter(dateApproved, period_selected_Setting) === parseInt(topCategoryProductTimeDetailEle.val())) {
                    topProduct_chart_data.push({
                        'id': item?.['product']?.['id'],
                        'title': item?.['product']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '2') {
                topProduct_chart_data.push({
                    'id': item?.['product']?.['id'],
                    'title': item?.['product']?.['title'],
                    'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                })
            }
        }
        let topProduct_chart_data_sum = {}
        for (const item of topProduct_chart_data) {
            if (topProduct_chart_data_sum[item.id] !== undefined) {
                topProduct_chart_data_sum[item.id].revenue += item.revenue
            } else {
                topProduct_chart_data_sum[item.id] = item
            }
        }
        topProduct_chart_data = Object.values(topProduct_chart_data_sum)

        topProduct_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = topProduct_chart_data.slice(0, topProductNumberEle.val())
        let topX_revenue = topX.map(item => item.revenue);
        let topX_title = topX.map(item => item.title);
        
        // Reverse arrays to show from high to low (top to bottom)
        topX_revenue.reverse();
        topX_title.reverse();
        
        let series_data = [{
            data: topX_revenue,
            color: CHART_COLORS.danger
        }]

        return [topX_title, series_data]
    }

    const topProductNumberEle = $('#top-product-number')
    topProductNumberEle.on('change', function () {
        DrawTopCategoryProductChart(false, ['product'])
    })

    // Handle window resize
    window.addEventListener('resize', function() {
        if (revenue_chart) revenue_chart.resize();
        if (profit_chart) profit_chart.resize();
        if (topSale_chart) topSale_chart.resize();
        if (topCustomer_chart) topCustomer_chart.resize();
        if (topCategory_chart) topCategory_chart.resize();
        if (topProduct_chart) topProduct_chart.resize();
    });

    LoadPeriod(current_period)
    LoadRevenueGroup(revenueprofitGroupEle)
    DrawRevenueProfitChart(true)
    DrawTopSaleCustomerChart(true)
    DrawTopCategoryProductChart(true)
})
