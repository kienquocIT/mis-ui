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
    const CHART_COLORS_OPACITY = {
        blue: 'rgba(54, 162, 235, 0.6)',
        red: 'rgba(255, 99, 132, 0.6)',
        orange: 'rgba(255, 159, 64, 0.6)',
        yellow: 'rgba(255, 205, 86, 0.6)',
        green: 'rgba(75, 192, 96, 0.6)',
        purple: 'rgba(153, 102, 255, 0.6)',
        grey: 'rgba(201, 203, 207, 0.6)',
        custom1: 'rgba(58, 110, 31, 0.6)',
        custom2: 'rgba(194, 0, 35, 0.6)',
        custom3: 'rgba(13, 46, 118, 0.6)'
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
        DrawRevenueProfitChart(false)
        DrawTopSaleCustomerChart(false)
    })

    moneyRoundEle.on('change', function () {
        $(this).val($(this).val() || 1);
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
            $('#revenue-spinner').prop('hidden', false)
            $('#profit-spinner').prop('hidden', false)
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

    $('.large-view-btn').on('click', function () {
        if ($(this).closest('.view-space').attr('class') === 'view-space col-6 col-md-6 col-lg-6 mt-3') {
            $(this).closest('.view-space').attr('class', 'view-space col-12 mt-3')
        }
        else {
            $(this).closest('.view-space').attr('class', 'view-space col-6 col-md-6 col-lg-6 mt-3')
        }
    })

    // common of Revenue and Profit

    let revenueprofit_DF = []
    let revenue_chart = null
    let revenue_expected_DF = []
    let profit_chart = null
    let profit_expected_DF = []
    let profit_expected_type = null
    let COMPANY_CURRENT_REVENUE = null
    let COMPANY_CURRENT_PROFIT = null

    function RevenueProfitChartCfg(chart_type, labelX, data_list, chart_title='', titleX='', titleY='') {
        return {
            type: chart_type,
            data: {
                labels: labelX,
                datasets: data_list
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: titleX,
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: titleY,
                        },
                    },
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: chart_title
                    }
                },
                animations: {
                    radius: {
                        duration: 500,
                        easing: 'linear',
                        loop: (context) => context.active
                    }
                },
                hoverRadius: 15,
                interaction: {
                    mode: 'nearest',
                    intersect: false,
                    axis: 'x'
                },
            }
        }
    }

    function DrawRevenueProfitChart(is_init=false) {
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

                if (!is_init) {
                    revenue_chart.destroy();
                    profit_chart.destroy();
                }

                let [revenueChartDataset, profitChartDataset] = GetRevenueProfitChartDatasets()
                revenue_chart = new Chart(
                    $('#revenue_chart')[0].getContext('2d'),
                    RevenueProfitChartCfg(
                        revenueprofitChartTypeEle.val() === '0' ? 'line' : 'bar',
                        getMonthOrder(space_month_Setting),
                        revenueChartDataset,
                        trans_script.attr('data-trans-chart-revenue'),
                        trans_script.attr('data-trans-month'),
                        trans_script.attr('data-trans-revenue'),
                    )
                )
                $('#revenue-spinner').prop('hidden', true)
                profit_chart = new Chart(
                    $('#profit_chart')[0].getContext('2d'),
                    RevenueProfitChartCfg(
                        revenueprofitChartTypeEle.val() === '0' ? 'line' : 'bar',
                        getMonthOrder(space_month_Setting),
                        profitChartDataset,
                        trans_script.attr('data-trans-chart-profit'),
                        trans_script.attr('data-trans-month'),
                        trans_script.attr('data-trans-profit')
                    )
                )
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
                pointStyle: 'circle',
                pointRadius: 5,
                borderColor: CHART_COLORS?.['blue'],
                backgroundColor: CHART_COLORS_OPACITY?.['blue'],
                borderWidth: 1,
            },
            {
                label: trans_script.attr('data-trans-reality'),
                data: revenue_chart_data,
                pointStyle: 'circle',
                pointRadius: 5,
                borderColor: CHART_COLORS?.['red'],
                backgroundColor: CHART_COLORS_OPACITY?.['red'],
                borderWidth: 1,
            }
        ]

        let profit_series_data = [
            {
                label: trans_script.attr('data-trans-expected'),
                data: profit_expected_data,
                pointStyle: 'circle',
                pointRadius: 5,
                borderColor: CHART_COLORS?.['blue'],
                backgroundColor: CHART_COLORS_OPACITY?.['blue'],
                borderWidth: 1,
            },
            {
                label: trans_script.attr('data-trans-reality'),
                data: profit_chart_data,
                pointStyle: 'circle',
                pointRadius: 5,
                borderColor: CHART_COLORS?.['green'],
                backgroundColor: CHART_COLORS_OPACITY?.['green'],
                borderWidth: 1,
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
                    pointStyle: 'circle',
                    pointRadius: 5,
                    borderColor: CHART_COLORS?.['blue'],
                    backgroundColor: CHART_COLORS_OPACITY?.['blue'],
                    borderWidth: 1,
                },
                {
                    label: trans_script.attr('data-trans-reality'),
                    data: revenue_chart_data,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    borderColor: CHART_COLORS?.['red'],
                    backgroundColor: CHART_COLORS_OPACITY?.['red'],
                    borderWidth: 1,
                }
            ]

            profit_series_data = [
                {
                    label: trans_script.attr('data-trans-expected'),
                    data: profit_expected_data,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    borderColor: CHART_COLORS?.['blue'],
                    backgroundColor: CHART_COLORS_OPACITY?.['blue'],
                    borderWidth: 1,
                },
                {
                    label: trans_script.attr('data-trans-reality'),
                    data: profit_chart_data,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    borderColor: CHART_COLORS?.['green'],
                    backgroundColor: CHART_COLORS_OPACITY?.['green'],
                    borderWidth: 1,
                }
            ]
        }

        return [revenue_series_data, profit_series_data]
    }

    $('#reload-revenue-profit-data-btn').on('click', function () {
        DrawRevenueProfitChart(false)
    })

    const revenueprofitChartTypeEle = $('#revenue-profit-chart-type')
    revenueprofitChartTypeEle.on('change', function () {
        DrawRevenueProfitChart(false)
    })

    const revenueprofitViewTypeEle = $('#revenue-profit-view-type')
    revenueprofitViewTypeEle.on('change', function () {
        DrawRevenueProfitChart(false)
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
            DrawRevenueProfitChart(false)
        })
    }

    const profitTypeEle = $('#profit-type')
    profitTypeEle.on('change', function () {
        DrawRevenueProfitChart(false)
    })

    // common of Top sale and Top Customer

    function TopSaleCustomerChartCfg(chart_type, labelX, data_list, chart_title='', titleX='', titleY='', indexAxis='x') {
        return {
            type: chart_type,
            data: {
                labels: labelX,
                datasets: data_list
            },
            options: {
                borderWidth: 1,
                indexAxis: indexAxis,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: titleX,
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: titleY,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: chart_title
                    }
                },
            }
        }
    }

    function DrawTopSaleCustomerChart(is_init=false, chart_name=['sale', 'customer']) {
        if (chart_name.includes('sale')) {
            $('#topsale-spinner').prop('hidden', false)
        }
        if (chart_name.includes('customer')) {
            $('#topcustomer-spinner').prop('hidden', false)
        }

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

                    if (!is_init) {
                        topSale_chart.destroy();
                    }
                    let [topX_full_name, series_data] = GetTopSaleDatasets()
                    topSale_chart = new Chart(
                        $('#topsale_chart')[0].getContext('2d'),
                        TopSaleCustomerChartCfg(
                            'bar',
                            topX_full_name,
                            series_data,
                            trans_script.attr('data-trans-chart-topsale'),
                            trans_script.attr('data-trans-revenue'),
                            '',
                            'y'
                        )
                    )
                    $('#topsale-spinner').prop('hidden', true)
                }
                if (chart_name.includes('customer')) {
                    topCustomer_DF = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })

                    if (!is_init) {
                        topCustomer_chart.destroy();
                    }
                    let [topX_title, series_data] = GetTopCustomerDatasets()
                    topCustomer_chart = new Chart(
                        $('#topcustomer_chart')[0].getContext('2d'),
                        TopSaleCustomerChartCfg(
                            'bar',
                            topX_title,
                            series_data,
                            trans_script.attr('data-trans-chart-topcustomer'),
                            trans_script.attr('data-trans-revenue'),
                            '',
                            'y'
                        )
                    )
                    $('#topcustomer-spinner').prop('hidden', true)
                }
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

    // Top sale chart

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
        let series_data = [{
            data: topX_revenue,
            borderColor: CHART_COLORS?.['orange'],
            backgroundColor: CHART_COLORS_OPACITY?.['orange'],
            borderWidth: 1,
        }]

        return [topX_full_name, series_data]
    }

    const topSaleNumberEle = $('#top-sale-number')
    topSaleNumberEle.on('change', function () {
        DrawTopSaleCustomerChart(false, ['sale'])
    })

    // Top customer chart

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
        let series_data = [{
            data: topX_revenue,
            borderColor: CHART_COLORS?.['purple'],
            backgroundColor: CHART_COLORS_OPACITY?.['purple'],
            borderWidth: 1,
        }]

        return [topX_title, series_data]
    }

    const topCustomerNumberEle = $('#top-customer-number')
    topCustomerNumberEle.on('change', function () {
        DrawTopSaleCustomerChart(false, ['customer'])
    })

    // common of Top Category and Top Produce

    function TopCategoryProductChartCfg(chart_type, labelX, data_list, chart_title='', titleX='', titleY='', indexAxis='x') {
        return {
            type: chart_type,
            data: {
                labels: labelX,
                datasets: data_list
            },
            options: {
                borderWidth: 1,
                indexAxis: indexAxis,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: titleX,
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: titleY,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: chart_title
                    }
                },
            }
        }
    }

    function DrawTopCategoryProductChart(is_init=false, chart_name=['category', 'product']) {
        if (chart_name.includes('category')) {
            $('#topcategory-spinner').prop('hidden', false)
        }
        if (chart_name.includes('product')) {
            $('#topproduct-spinner').prop('hidden', false)
        }

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

                    if (!is_init) {
                        topCategory_chart.destroy();
                    }
                    let [topX_title, series_data] = GetTopCategoryDatasets()
                    topCategory_chart = new Chart(
                        $('#topcategory_chart')[0].getContext('2d'),
                        TopCategoryProductChartCfg(
                            'bar',
                            topX_title,
                            series_data,
                            trans_script.attr('data-trans-chart-topcategory'),
                            trans_script.attr('data-trans-revenue'),
                            '',
                            'y'
                        )
                    )
                    $('#topcategory-spinner').prop('hidden', true)
                }
                if (chart_name.includes('product')) {
                    topProduct_DF = (results[0] ? results[0] : []).filter(item => {
                        return Check_in_period(new Date(item?.['date_approved']), period_selected_Setting)
                    })

                    if (!is_init) {
                        topProduct_chart.destroy();
                    }
                    let [topX_title, series_data] = GetTopProductDatasets()
                    topProduct_chart = new Chart(
                        $('#topproduct_chart')[0].getContext('2d'),
                        TopCategoryProductChartCfg(
                            'bar',
                            topX_title,
                            series_data,
                            trans_script.attr('data-trans-chart-topproduct'),
                            trans_script.attr('data-trans-revenue'),
                            '',
                            'y'
                        )
                    )
                    $('#topproduct-spinner').prop('hidden', true)
                }
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

    // Top category chart

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
        let series_data = [{
            data: topX_revenue,
            borderColor: CHART_COLORS?.['blue'],
            backgroundColor: CHART_COLORS_OPACITY?.['blue'],
            borderWidth: 1,
        }]

        return [topX_title, series_data]
    }

    const topCategoryNumberEle = $('#top-category-number')
    topCategoryNumberEle.on('change', function () {
        DrawTopCategoryProductChart(false, ['category'])
    })

    // Top product chart

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
        let series_data = [{
            data: topX_revenue,
            borderColor: CHART_COLORS?.['red'],
            backgroundColor: CHART_COLORS_OPACITY?.['red'],
            borderWidth: 1,
        }]

        return [topX_title, series_data]
    }

    const topProductNumberEle = $('#top-product-number')
    topProductNumberEle.on('change', function () {
        DrawTopCategoryProductChart(false, ['product'])
    })

    // Load Page

    LoadPeriod(current_period)
    LoadRevenueGroup()
    DrawRevenueProfitChart(true)
    DrawTopSaleCustomerChart(true)
    DrawTopCategoryProductChart(true)
})
