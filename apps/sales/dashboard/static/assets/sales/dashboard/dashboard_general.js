$(document).ready(function () {
    const HEIGHT = 280
    const scriptUrlEle = $('#script-url')
    const trans_script = $('#trans-url')
    const moneyDisplayEle = $('#money-display')
    const moneyRoundEle = $('#money-round')
    const periodFiscalYearFilterEle = $('#period-filter')
    const current_period_Ele = $('#current_period')
    const current_period = current_period_Ele.text() ? JSON.parse(current_period_Ele.text()) : {}
    let period_selected_Setting = current_period
    let fiscal_year_Setting = current_period?.['fiscal_year']
    let space_month_Setting = current_period?.['space_month']
    let COMPANY_CURRENT_REVENUE = null
    let COMPANY_CURRENT_PROFIT = null

    moneyDisplayEle.on('change', function () {
        COMPANY_CURRENT_REVENUE = null
        COMPANY_CURRENT_PROFIT = null
        UpdateRevenueChart()
        UpdateProfitChart()
        UpdateTopSellersChart()
        UpdateTopCustomersChart()
        UpdateTopCategoriesChart()
        UpdateTopProductsChart()
    })

    moneyRoundEle.on('change', function () {
        UpdateRevenueChart()
        UpdateProfitChart()
        UpdateTopSellersChart()
        UpdateTopCustomersChart()
        UpdateTopCategoriesChart()
        UpdateTopProductsChart()
    })

    function GetQuarterFromMonth(month) {
        if ([1,2,3].includes(month)) {
            return 1
        }
        if ([4,5,6].includes(month)) {
            return 2
        }
        if ([7,8,9].includes(month)) {
            return 3
        }
        if ([10,11,12].includes(month)) {
            return 4
        }
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
            UpdateRevenueChart()
            UpdateProfitChart()
            topSellersTimeEle.prop('disabled', fiscal_year_Setting !== new Date().getFullYear())
            topSellersNumberEle.prop('disabled', fiscal_year_Setting !== new Date().getFullYear())
            topCustomersTimeEle.prop('disabled', fiscal_year_Setting !== new Date().getFullYear())
            topCustomersNumberEle.prop('disabled', fiscal_year_Setting !== new Date().getFullYear())
            topCategoriesTimeEle.prop('disabled', fiscal_year_Setting !== new Date().getFullYear())
            topCategoriesNumberEle.prop('disabled', fiscal_year_Setting !== new Date().getFullYear())
            topProductsTimeEle.prop('disabled', fiscal_year_Setting !== new Date().getFullYear())
            topProductsNumberEle.prop('disabled', fiscal_year_Setting !== new Date().getFullYear())
        })
    }

    function Check_in_period(dateApproved, period_selected_Setting) {
        if (Object.keys(period_selected_Setting).length === 0) {
            period_selected_Setting = current_period
            fiscal_year_Setting = current_period?.['fiscal_year']
            space_month_Setting = current_period?.['space_month']
        }
        const month = dateApproved.getMonth() + 1
        const year = dateApproved.getFullYear()
        const space_month = period_selected_Setting?.['space_month']
        const fiscal_year = period_selected_Setting?.['fiscal_year']
        let list_month_period = []
        for (let i = 0; i < 12; i++) {
            let period_month = i + space_month + 1
            let period_year = fiscal_year
            if (period_month > 12) {
                period_month = period_month - 12
                period_year = fiscal_year + 1
            }
            list_month_period.push(period_month.toString() + period_year.toString())
        }
        return list_month_period.includes(month.toString() + year.toString());
    }

    $('.large-view-btn').on('click', function () {
        $('.view-space').each(function () {
            $(this).attr('class', 'view-space col-12 col-md-6 col-lg-4 mt-3')
        })
        $(this).closest('.view-space').attr('class', 'view-space col-12 col-md-8 col-lg-8 mt-3')

    })

    // Revenue chart

    const revenueGroupEle = $('#revenue-group')
    const revenueViewTypeEle = $('#revenue-view-type')
    let revenue_chart = null
    let revenue_DF = []
    let revenue_expected_DF = []
    let revenue_expected_detail_DF = []

    function LoadRevenueGroup(data) {
        revenueGroupEle.initSelect2({
            allowClear: true,
            ajax: {
                url: revenueGroupEle.attr('data-url'),
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
            UpdateRevenueChart()
        })
    }

    function CombineRevenueChartDataPeriod(group_filter, show_billion, titleY = 'Revenue', titleX = 'Month', chart_title = '') {
        const cast_billion = show_billion ? 1e9 : 1e6
        let revenue_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of revenue_DF) {
            const group_id = item?.['group_inherit_id']
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth()
            if (Check_in_period(dateApproved, period_selected_Setting)) {
                if (!group_filter) {
                    revenue_chart_data[month - space_month_Setting] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                } else {
                    if (group_id === group_filter) {
                        revenue_chart_data[month - space_month_Setting] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                    }
                }
            }
        }

        let revenue_expected_data = []
        if (group_filter) {
            let group_found_data = revenue_expected_detail_DF.find(item => item?.['group_mapped_id'] === group_filter)
            if (group_found_data) {
                let group_expected_data = group_found_data?.['group_month_target']
                for (let i = 0; i < group_expected_data.length; i++) {
                    revenue_expected_data.push(group_expected_data[i] / cast_billion)
                }
            }
            else {
                revenue_expected_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        }
        else {
            for (let i = 0; i < revenue_expected_DF.length; i++) {
                revenue_expected_data.push(revenue_expected_DF[i] / cast_billion)
            }
        }

        let series_data = [
            {name: "Expected", data: revenue_expected_data},
            {name: "Reality", data: revenue_chart_data}
        ]
        if (new Date().getFullYear() === fiscal_year_Setting) {
            for (let i = new Date().getMonth() + 1 - space_month_Setting; i < 12; i++) {
                revenue_chart_data[i] = null;
            }
            series_data = [
                {name: "Expected", data: revenue_expected_data},
                {name: "Reality", data: revenue_chart_data}
            ]
        }

        COMPANY_CURRENT_REVENUE = COMPANY_CURRENT_REVENUE === null ? (revenue_chart_data[new Date().getMonth() - space_month_Setting] * cast_billion) : COMPANY_CURRENT_REVENUE
        $('#current-revenue').attr('data-init-money', COMPANY_CURRENT_REVENUE)
        $.fn.initMaskMoney2()

        return {
            series: series_data,
            chart: {
                height: HEIGHT,
                type: 'area',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#ADC6F4', '#417DDC'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: chart_title,
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0
                },
            },
            markers: {
                size: 5
            },
            xaxis: {
                categories: getMonthOrder(space_month_Setting),
                title: {
                    text: titleX
                }
            },
            yaxis: {
                title: {
                    text: titleY
                },
                labels: {
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(parseInt(moneyRoundEle.val()))
                        } else {
                            return val
                        }
                    }
                }
                // min: 5,
                // max: 40
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    show: true,
                }
            },
        };
    }

    function CombineRevenueChartDataAccumulated(group_filter, show_billion, titleY = 'Revenue', titleX = 'Month', chart_title = '') {
        const cast_billion = show_billion ? 1e9 : 1e6
        let revenue_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of revenue_DF) {
            const group_id = item?.['group_inherit_id']
            const dateApproved = new Date(item?.['date_approved']);
            const month = dateApproved.getMonth();
            if (Check_in_period(dateApproved, period_selected_Setting)) {
                if (!group_filter) {
                    revenue_chart_data[month - space_month_Setting] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                } else {
                    if (group_id === group_filter) {
                        revenue_chart_data[month - space_month_Setting] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                    }
                }
            }
        }

        for (let i = 0; i < revenue_chart_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = revenue_chart_data[i - 1]
            }
            revenue_chart_data[i] += last_sum
        }

        let revenue_expected_data = []
        if (group_filter) {
            let group_found_data = revenue_expected_detail_DF.find(item => item?.['group_mapped_id'] === group_filter)
            if (group_found_data) {
                let group_expected_data = group_found_data?.['group_month_target']
                for (let i = 0; i < group_expected_data.length; i++) {
                    revenue_expected_data.push(group_expected_data[i] / cast_billion)
                }
            }
            else {
                revenue_expected_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        }
        else {
            for (let i = 0; i < revenue_expected_DF.length; i++) {
                revenue_expected_data.push(revenue_expected_DF[i] / cast_billion)
            }
        }

        for (let i = 0; i < revenue_expected_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = revenue_expected_data[i - 1]
            }
            revenue_expected_data[i] += last_sum
        }

        let series_data = [
            {name: "Expected", data: revenue_expected_data},
            {name: "Reality", data: revenue_chart_data}
        ]
        if (new Date().getFullYear() === fiscal_year_Setting) {
            for (let i = new Date().getMonth() + 1 - space_month_Setting; i < 12; i++) {
                revenue_chart_data[i] = null;
            }
            series_data = [
                {name: "Expected", data: revenue_expected_data},
                {name: "Reality", data: revenue_chart_data}
            ]
        }

        return {
            series: series_data,
            chart: {
                height: HEIGHT,
                type: 'area',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#ADC6F4', '#417DDC'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: chart_title,
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0
                },
            },
            markers: {
                size: 5
            },
            xaxis: {
                categories: getMonthOrder(space_month_Setting),
                title: {
                    text: titleX
                }
            },
            yaxis: {
                title: {
                    text: titleY
                },
                labels: {
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(parseInt(moneyRoundEle.val()))
                        } else {
                            return val
                        }
                    }
                }
                // min: 5,
                // max: 40
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    show: true,
                }
            },
        };
    }

    function InitRevenueChart() {
        const group = revenueGroupEle.val()
        const calculate_type = revenueViewTypeEle.val()
        const isBillionChecked = moneyDisplayEle.val() === '1'
        const options = calculate_type === '0' ? CombineRevenueChartDataPeriod(
            group,
            isBillionChecked
        ) : CombineRevenueChartDataAccumulated(
            group,
            isBillionChecked
        )
        revenue_chart = new ApexCharts(document.querySelector("#revenue_chart"), options);
        revenue_chart.render();
        $('#revenue-spinner').prop('hidden', true)
    }

    function UpdateRevenueChart() {
        const group = revenueGroupEle.val()
        const calculate_type = revenueViewTypeEle.val()
        const isBillionChecked = moneyDisplayEle.val() === '1'
        const options = calculate_type === '0' ? CombineRevenueChartDataPeriod(
            group,
            isBillionChecked,
        ) : CombineRevenueChartDataAccumulated(
            group,
            isBillionChecked
        )
        revenue_chart.updateOptions(options)
    }

    function CallAjaxRevenueChart(is_init=false) {
        let revenue_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-report-revenue-profit-list'),
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

        let company_revenue_plan_list_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-company-revenue-plan-list'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('revenue_plan_list')) {
                    for (let i = 0; i < data?.['revenue_plan_list'].length; i++) {
                        if (new Date(data?.['revenue_plan_list'][i]?.['period_mapped']?.['start_date']).getFullYear() === new Date().getFullYear()) {
                            return data?.['revenue_plan_list'][i]
                        }
                    }
                }
                return [];
            },
            (errs) => {
                console.log(errs);
            })

        Promise.all([revenue_chart_ajax, company_revenue_plan_list_ajax]).then(
            (results) => {
                revenue_DF = results[0] ? results[0] : [];
                revenue_expected_DF = results[1]?.['company_month_target'] ? results[1]?.['company_month_target'] : [];
                revenue_expected_detail_DF = results[1]?.['company_month_target_detail'] ? results[1]?.['company_month_target_detail'] : [];

                period_selected_Setting = results[1]?.['period_mapped'] ? results[1]?.['period_mapped'] : {}
                fiscal_year_Setting = period_selected_Setting ? period_selected_Setting?.['fiscal_year'] : null
                space_month_Setting = period_selected_Setting ? period_selected_Setting?.['space_month'] : null
                LoadPeriod(period_selected_Setting)
                if (is_init) {
                    InitRevenueChart()
                }
            })
    }

    revenueViewTypeEle.on('change', function () {
        UpdateRevenueChart()
    })

    $('#reload-revenue-data-btn').on('click', function () {
        CallAjaxRevenueChart()
        UpdateRevenueChart()
        $.fn.notifyB({description: 'Reloaded latest data'}, 'success')
    })

    // Profit chart

    const profitGroupEle = $('#profit-group')
    const profitTypeEle = $('#profit-type')
    const profitViewTypeEle = $('#profit-view-type')
    let profit_chart = null
    let profit_chart_DF = []
    let profit_expected_DF = []
    let profit_expected_detail_DF = []
    let profit_type_DF = profitTypeEle.val()

    function LoadProfitGroup(data) {
        profitGroupEle.initSelect2({
            allowClear: true,
            ajax: {
                url: profitGroupEle.attr('data-url'),
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
            UpdateProfitChart()
        })
    }

    function CombineProfitChartDataPeriod(group_filter, show_billion, profit_type='gross_profit', titleY = 'Profit', titleX = 'Month', chart_title = '') {
        const cast_billion = show_billion ? 1e9 : 1e6
        let profit_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of profit_chart_DF) {
            const group_id = item?.['group_inherit_id']
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth()
            if (Check_in_period(dateApproved, period_selected_Setting)) {
                if (!group_filter) {
                    profit_chart_data[month - space_month_Setting] += (item?.[profit_type] ? item?.[profit_type] : 0) / cast_billion
                } else {
                    if (group_id === group_filter) {
                        profit_chart_data[month - space_month_Setting] += (item?.[profit_type] ? item?.[profit_type] : 0) / cast_billion
                    }
                }
            }
        }

        let profit_expected_DF_copy = [...profit_expected_DF]  //create a copy
        if (profit_type_DF + (profitTypeEle.val() === '1' ? 1 : 0) === 1) {
            profit_expected_DF_copy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        let profit_expected_data = []
        if (group_filter) {
            let group_found_data = profit_expected_detail_DF.find(item => item?.['group_mapped_id'] === group_filter)
            if (group_found_data) {
                let group_expected_data = group_found_data?.['group_month_profit_target']
                for (let i = 0; i < group_expected_data.length; i++) {
                    profit_expected_data.push(group_expected_data[i] / cast_billion)
                }
            }
            else {
                profit_expected_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        }
        else {
            for (let i = 0; i < profit_expected_DF_copy.length; i++) {
                profit_expected_data.push(profit_expected_DF_copy[i] / cast_billion)
            }
        }

        let series_data = [
            {name: "Expected", data: profit_expected_data},
            {name: "Reality", data: profit_chart_data}
        ]
        if (new Date().getFullYear() === fiscal_year_Setting) {
            for (let i = new Date().getMonth() + 1 - space_month_Setting; i < 12; i++) {
                profit_chart_data[i] = null;
            }
            series_data = [
                {name: "Expected", data: profit_expected_data},
                {name: "Reality", data: profit_chart_data}
            ]
        }

        COMPANY_CURRENT_PROFIT = COMPANY_CURRENT_PROFIT === null ? (profit_chart_data[new Date().getMonth() - space_month_Setting] * cast_billion) : COMPANY_CURRENT_PROFIT
        $('#current-profit').attr('data-init-money', COMPANY_CURRENT_PROFIT)
        $.fn.initMaskMoney2()

        return {
            series: series_data,
            chart: {
                height: HEIGHT,
                type: 'area',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: [
                '#82DBA6',
                '#44A65E'
            ],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: chart_title,
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0
                },
            },
            markers: {
                size: 5
            },
            xaxis: {
                categories: getMonthOrder(space_month_Setting),
                title: {
                    text: titleX
                }
            },
            yaxis: {
                title: {
                    text: titleY
                },
                labels: {
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(parseInt(moneyRoundEle.val()))
                        } else {
                            return val
                        }
                    }
                }
                // min: 5,
                // max: 40
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    show: true,
                }
            },
        };
    }

    function CombineProfitChartDataAccumulated(group_filter, show_billion, profit_type='gross_profit', titleY = 'Profit', titleX = 'Month', chart_title = '') {
        const cast_billion = show_billion ? 1e9 : 1e6
        let profit_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of profit_chart_DF) {
            const group_id = item?.['group_inherit_id']
            const dateApproved = new Date(item?.['date_approved']);
            const month = dateApproved.getMonth();
            if (Check_in_period(dateApproved, period_selected_Setting)) {
                if (!group_filter) {
                    profit_chart_data[month - space_month_Setting] += (item?.[profit_type] ? item?.[profit_type] : 0) / cast_billion
                } else {
                    if (group_id === group_filter) {
                        profit_chart_data[month - space_month_Setting] += (item?.[profit_type] ? item?.[profit_type] : 0) / cast_billion
                    }
                }
            }
        }
        for (let i = 0; i < profit_chart_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = profit_chart_data[i - 1]
            }
            profit_chart_data[i] += last_sum
        }

        let profit_expected_DF_copy = [...profit_expected_DF]  //create a copy
        if (profit_type_DF + (profitTypeEle.val() === '1' ? 1 : 0) === 1) {
            profit_expected_DF_copy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        let profit_expected_data = []
        if (group_filter) {
            let group_found_data = profit_expected_detail_DF.find(item => item?.['group_mapped_id'] === group_filter)
            if (group_found_data) {
                let group_expected_data = group_found_data?.['group_month_profit_target']
                for (let i = 0; i < group_expected_data.length; i++) {
                    profit_expected_data.push(group_expected_data[i] / cast_billion)
                }
            }
            else {
                profit_expected_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        }
        else {
            for (let i = 0; i < profit_expected_DF_copy.length; i++) {
                profit_expected_data.push(profit_expected_DF_copy[i] / cast_billion)
            }
        }

        for (let i = 0; i < profit_expected_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = profit_expected_data[i - 1]
            }
            profit_expected_data[i] += last_sum
        }

        let series_data = [
            {name: "Expected", data: profit_expected_data},
            {name: "Reality", data: profit_chart_data}
        ]
        if (new Date().getFullYear() === fiscal_year_Setting) {
            for (let i = new Date().getMonth() + 1 - space_month_Setting; i < 12; i++) {
                profit_chart_data[i] = null;
            }
            series_data = [
                {name: "Expected", data: profit_expected_data},
                {name: "Reality", data: profit_chart_data}
            ]
        }

        return {
            series: series_data,
            chart: {
                height: HEIGHT,
                type: 'area',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: [
                '#82DBA6',
                '#44A65E'
            ],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: chart_title,
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0
                },
            },
            markers: {
                size: 5
            },
            xaxis: {
                categories: getMonthOrder(space_month_Setting),
                title: {
                    text: titleX
                }
            },
            yaxis: {
                title: {
                    text: titleY
                },
                labels: {
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(parseInt(moneyRoundEle.val()))
                        } else {
                            return val
                        }
                    }
                }
                // min: 5,
                // max: 40
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    show: true,
                }
            },
        };
    }

    function InitProfitChart() {
        const group = profitGroupEle.val()
        const calculate_type = profitViewTypeEle.val()
        const isBillionChecked = moneyDisplayEle.val() === '1'
        const options = calculate_type === '0' ? CombineProfitChartDataPeriod(
            group,
            isBillionChecked
        ) : CombineProfitChartDataAccumulated(
            group,
            isBillionChecked
        )
        profit_chart = new ApexCharts(document.querySelector("#profit_chart"), options);
        profit_chart.render();
        $('#profit-spinner').prop('hidden', true)
    }

    function UpdateProfitChart() {
        const group = profitGroupEle.val()
        const calculate_type = profitViewTypeEle.val()
        const isBillionChecked = moneyDisplayEle.val() === '1'
        const profit_type = profitTypeEle.val() === '1' ? 'net_income' : 'gross_profit'

        let options = calculate_type === '0' ? CombineProfitChartDataPeriod(
            group,
            isBillionChecked,
            profit_type
        ) : CombineProfitChartDataAccumulated(
            group,
            profit_type
        )
        profit_chart.updateOptions(options)
    }

    function CallAjaxProfitChart(is_init=false) {
        let profit_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-report-revenue-profit-list'),
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

        let company_revenue_plan_list_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-company-revenue-plan-list'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('revenue_plan_list')) {
                    for (let i = 0; i < data?.['revenue_plan_list'].length; i++) {
                        if (new Date(data?.['revenue_plan_list'][i]?.['period_mapped']?.['start_date']).getFullYear() === new Date().getFullYear()) {
                            return data?.['revenue_plan_list'][i]
                        }
                    }
                }
                return [];
            },
            (errs) => {
                console.log(errs);
            })

        Promise.all([profit_chart_ajax, company_revenue_plan_list_ajax]).then(
            (results) => {
                profit_chart_DF = results[0] ? results[0] : [];
                profit_expected_DF = results[1]?.['company_month_profit_target'] ? results[1]?.['company_month_profit_target'] : [];
                profit_type_DF = results[1]?.['profit_target_type'] ? results[1]?.['profit_target_type'] : null
                profitTypeEle.val(results[1]?.['profit_target_type'])
                profit_expected_detail_DF = results[1]?.['company_month_target_detail'] ? results[1]?.['company_month_target_detail'] : [];

                period_selected_Setting = results[1]?.['period_mapped'] ? results[1]?.['period_mapped'] : {}
                fiscal_year_Setting = period_selected_Setting ? period_selected_Setting?.['fiscal_year'] : null
                space_month_Setting = period_selected_Setting ? period_selected_Setting?.['space_month'] : null
                LoadPeriod(period_selected_Setting)
                if (is_init) {
                    InitProfitChart()
                }
            })
    }

    profitTypeEle.on('change', function () {
        UpdateProfitChart()
    })

    profitViewTypeEle.on('change', function () {
        UpdateProfitChart()
    })

    $('#reload-profit-data-btn').on('click', function () {
        CallAjaxProfitChart()
        UpdateProfitChart()
        $.fn.notifyB({description: 'Reloaded latest data'}, 'success')
    })

    // Top sellers chart

    const topSellersTimeEle = $('#top-sellers-time')
    const topSellersNumberEle = $('#top-sellers-number')
    let top_sellers_chart = null
    let top_sellers_chart_DF = []

    function CombineTopSellersChartData(show_billion, titleY = "Seller", titleX = 'Revenue', chart_title='') {
        const cast_billion = show_billion ? 1e9 : 1e6

        const current_month = new Date().getMonth() + 1
        const current_quarter = GetQuarterFromMonth(current_month - space_month_Setting)

        let top_sellers_chart_data = []
        for (const item of top_sellers_chart_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth() + 1
            const quarter = GetQuarterFromMonth(month - space_month_Setting)
            const filterTimes = topSellersTimeEle.val()
            if (Check_in_period(dateApproved, period_selected_Setting)) {
                if (filterTimes === '0') {
                    if (month === current_month) {
                        top_sellers_chart_data.push({
                            'id': item?.['employee_inherit']?.['id'],
                            'full_name': item?.['employee_inherit']?.['full_name'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                }
                else if (filterTimes === '1') {
                    if (quarter === current_quarter) {
                        top_sellers_chart_data.push({
                            'id': item?.['employee_inherit']?.['id'],
                            'full_name': item?.['employee_inherit']?.['full_name'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                }
                else if (filterTimes === '2') {
                    top_sellers_chart_data.push({
                            'id': item?.['employee_inherit']?.['id'],
                            'full_name': item?.['employee_inherit']?.['full_name'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                }
            }
        }
        let top_sellers_chart_data_sum = {}
        for (const item of top_sellers_chart_data) {
            if (top_sellers_chart_data_sum[item.id] !== undefined) {
                top_sellers_chart_data_sum[item.id].revenue += item.revenue
            } else {
                top_sellers_chart_data_sum[item.id] = item
            }
        }
        top_sellers_chart_data = Object.values(top_sellers_chart_data_sum)

        top_sellers_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = top_sellers_chart_data.slice(0, topSellersNumberEle.val())
        let topX_revenue = topX.map(item => item.revenue);
        let topX_full_name = topX.map(item => item.full_name);

        return {
            series: [{
                data: topX_revenue
            }],
            chart: {
                type: 'bar',
                height: HEIGHT
            },
            colors: ['#FA8019'],
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    if (val) {
                        return val.toFixed(parseInt(moneyRoundEle.val()))
                    } else {
                        return val
                    }
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
            },
            xaxis: {
                categories: topX_full_name,
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(parseInt(moneyRoundEle.val()))
                        } else {
                            return val
                        }
                    }
                },
                title: {
                    text: titleX
                },
            },
            yaxis: {
                labels: {
                    show: true
                },
                title: {
                    text: titleY
                },
            },
            title: {
                text: chart_title,
                align: 'left'
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    show: true,
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            },
            legend: {
                show: false
            }
        };
    }

    function InitTopSellersChart() {
        const isBillionChecked = moneyDisplayEle.val() === '1'
        let options = CombineTopSellersChartData(
            isBillionChecked
        )
        $('#top-sellers-spinner').prop('hidden', true)
        top_sellers_chart = new ApexCharts(document.querySelector("#top_sellers_chart"), options);
        top_sellers_chart.render();
    }

    function UpdateTopSellersChart() {
        const isBillionChecked = moneyDisplayEle.val() === '1'
        let options = CombineTopSellersChartData(
            isBillionChecked
        )
        top_sellers_chart.updateOptions(options)
    }

    function CallAjaxTopSellersChart(is_init=false) {
        let top_sellers_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-top-sellers-customers-list'),
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
            })

        Promise.all([top_sellers_chart_ajax]).then(
            (results) => {
                top_sellers_chart_DF = results[0];
                $('#top-sellers-time-filter-year').val(new Date().getFullYear())
                if (is_init) {
                    InitTopSellersChart()
                }
            })
    }

    topSellersTimeEle.on('change', function () {
        UpdateTopSellersChart()
    })

    topSellersNumberEle.on('change', function () {
        UpdateTopSellersChart()
    })

    $('#reload-top-sellers-data-btn').on('click', function () {
        CallAjaxTopSellersChart()
        UpdateTopSellersChart()
        $.fn.notifyB({description: 'Reloaded latest data'}, 'success')
    })

    // Top customers chart

    const topCustomersTimeEle = $('#top-customers-time')
    const topCustomersNumberEle = $('#top-customers-number')
    let top_customers_chart = null
    let top_customers_chart_DF = []

    function CombineTopCustomersChartData(show_billion, titleY = "Customer", titleX = 'Revenue', chart_title="") {
        const cast_billion = show_billion ? 1e9 : 1e6
        const current_month = new Date().getMonth() + 1
        const current_quarter = GetQuarterFromMonth(current_month - space_month_Setting)
        let top_customers_chart_data = []
        for (const item of top_customers_chart_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth() + 1
            const quarter = GetQuarterFromMonth(month - space_month_Setting)
            const filterTimes = topCustomersTimeEle.val()
            if (Check_in_period(dateApproved, period_selected_Setting)) {
                if (filterTimes === '0') {
                    if (month === current_month) {
                        top_customers_chart_data.push({
                            'id': item?.['customer']?.['id'],
                            'title': item?.['customer']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                }
                else if (filterTimes === '1') {
                    if (quarter === current_quarter) {
                        top_customers_chart_data.push({
                            'id': item?.['customer']?.['id'],
                            'title': item?.['customer']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                }
                else if (filterTimes === '2') {
                    top_customers_chart_data.push({
                            'id': item?.['customer']?.['id'],
                            'title': item?.['customer']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                }
            }
        }
        let top_customers_chart_data_sum = {}
        for (const item of top_customers_chart_data) {
            if (top_customers_chart_data_sum[item.id] !== undefined) {
                top_customers_chart_data_sum[item.id].revenue += item.revenue
            } else {
                top_customers_chart_data_sum[item.id] = item
            }
        }
        top_customers_chart_data = Object.values(top_customers_chart_data_sum)

        top_customers_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = top_customers_chart_data.slice(0, topCustomersNumberEle.val())
        let topX_revenue = topX.map(item => item.revenue);
        let topX_title = topX.map(item => item.title);

        return {
            series: [{
                data: topX_revenue
            }],
            chart: {
                type: 'bar',
                height: HEIGHT
            },
            colors: ['#50C9D9'],
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    if (val) {
                        return val.toFixed(parseInt(moneyRoundEle.val()))
                    } else {
                        return val
                    }
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
            },
            xaxis: {
                categories: topX_title,
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(parseInt(moneyRoundEle.val()))
                        } else {
                            return val
                        }
                    }
                },
                title: {
                    text: titleX
                },
            },
            yaxis: {
                labels: {
                    show: true
                },
                title: {
                    text: titleY
                },
            },
            title: {
                text: chart_title,
                align: 'left'
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    show: true,
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            },
            legend: {
                show: false
            }
        };
    }

    function InitTopCustomersChart() {
        const isBillionChecked = moneyDisplayEle.val() === '1'
        let options = CombineTopCustomersChartData(
            isBillionChecked
        )
        $('#top-customers-spinner').prop('hidden', true)
        top_customers_chart = new ApexCharts(document.querySelector("#top_customers_chart"), options);
        top_customers_chart.render();
    }

    function UpdateTopCustomersChart() {
        const isBillionChecked = moneyDisplayEle.val() === '1'
        let options = CombineTopCustomersChartData(
            isBillionChecked
        )
        top_customers_chart.updateOptions(options)
    }

    function CallAjaxTopCustomersChart(is_init=false) {
        let top_customers_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-top-sellers-customers-list'),
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
            })

        Promise.all([top_customers_chart_ajax]).then(
            (results) => {
                top_customers_chart_DF = results[0];
                $('#top-customers-time-filter-year').val(new Date().getFullYear())
                if (is_init) {
                    InitTopCustomersChart()
                }
            })
    }

    topCustomersTimeEle.on('change', function () {
        UpdateTopCustomersChart()
    })

    topCustomersNumberEle.on('change', function () {
        UpdateTopCustomersChart()
    })

    $('#reload-top-customers-data-btn').on('click', function () {
        CallAjaxTopCustomersChart()
        UpdateTopCustomersChart()
        $.fn.notifyB({description: 'Reloaded latest data'}, 'success')
    })

    // Top categories chart

    const topCategoriesTimeEle = $('#top-categories-time')
    const topCategoriesNumberEle = $('#top-categories-number')
    let top_categories_chart = null
    let top_categories_chart_DF = []

    function CombineTopCategoriesChartData(show_billion, titleY = "Revenue", titleX = "Category", chart_title="") {
        const cast_billion = show_billion ? 1e9 : 1e6
        const current_month = new Date().getMonth() + 1
        const current_quarter = GetQuarterFromMonth(current_month - space_month_Setting)

        let top_categories_chart_data = []
        for (const item of top_categories_chart_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth() + 1
            const quarter = GetQuarterFromMonth(month - space_month_Setting)
            const filterTimes = topCategoriesTimeEle.val()
            if (Check_in_period(dateApproved, period_selected_Setting)) {
                if (filterTimes === '0') {
                    if (month === current_month) {
                        top_categories_chart_data.push({
                            'id': item?.['product']?.['general_product_category']?.['id'],
                            'title': item?.['product']?.['general_product_category']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                }
                else if (filterTimes === '1') {
                    if (quarter === current_quarter) {
                        top_categories_chart_data.push({
                            'id': item?.['product']?.['general_product_category']?.['id'],
                            'title': item?.['product']?.['general_product_category']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                }
                else if (filterTimes === '2') {
                    top_categories_chart_data.push({
                        'id': item?.['product']?.['general_product_category']?.['id'],
                        'title': item?.['product']?.['general_product_category']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
        }
        let top_categories_chart_data_sum = {}
        for (const item of top_categories_chart_data) {
            if (top_categories_chart_data_sum[item.id] !== undefined) {
                top_categories_chart_data_sum[item.id].revenue += item.revenue
            } else {
                top_categories_chart_data_sum[item.id] = item
            }
        }
        top_categories_chart_data = Object.values(top_categories_chart_data_sum)

        top_categories_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = top_categories_chart_data.slice(0, topCategoriesNumberEle.val())
        let topX_revenue = topX.map(item => item.revenue);
        let topX_title = topX.map(item => item.title);

        return {
            series: [{
                data: topX_revenue
            }],
            chart: {
                type: 'bar',
                height: HEIGHT
            },
            colors: ['#DC3545'],
            plotOptions: {
                bar: {
                    horizontal: false,
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    if (val) {
                        return val.toFixed(parseInt(moneyRoundEle.val()))
                    } else {
                        return val
                    }
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
            },
            xaxis: {
                categories: topX_title,
                labels: {
                    show: true
                },
                title: {
                    text: titleX
                },
            },
            yaxis: {
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(parseInt(moneyRoundEle.val()))
                        } else {
                            return val
                        }
                    }
                },
                title: {
                    text: titleY
                },
            },
            title: {
                text: chart_title,
                align: 'left'
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    show: true,
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            },
        };
    }

    function InitTopCategoriesChart() {
        const isBillionChecked = moneyDisplayEle.val() === '1'
        let options = CombineTopCategoriesChartData(
            isBillionChecked
        )
        $('#top-categories-spinner').prop('hidden', true)
        top_categories_chart = new ApexCharts(document.querySelector("#top_categories_chart"), options);
        top_categories_chart.render();
    }

    function UpdateTopCategoriesChart() {
        const isBillionChecked = moneyDisplayEle.val() === '1'
        let options = CombineTopCategoriesChartData(
            isBillionChecked
        )
        top_categories_chart.updateOptions(options)
    }

    function CallAjaxTopCategoriesChart(is_init=false) {
        let top_categories_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-top-categories-products-list'),
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
            })

        Promise.all([top_categories_chart_ajax]).then(
            (results) => {
                top_categories_chart_DF = results[0];
                $('#top-categories-time-filter-year').val(new Date().getFullYear())
                if (is_init) {
                    InitTopCategoriesChart()
                }
            })
    }

    topCategoriesNumberEle.on('change', function () {
        UpdateTopCategoriesChart()
    })

    topCategoriesTimeEle.on('change', function () {
        UpdateTopCategoriesChart()
    })

    $('#reload-top-categories-data-btn').on('click', function () {
        CallAjaxTopCategoriesChart()
        UpdateTopCategoriesChart()
        $.fn.notifyB({description: 'Reloaded latest data'}, 'success')
    })

    // Top products chart

    const topProductsTimeEle = $('#top-products-time')
    const topProductsNumberEle = $('#top-products-number')
    let top_products_chart = null
    let top_products_chart_DF = []

    function CombineTopProductsChartData(show_billion, titleY = "Revenue", titleX = "Product", chart_title="") {
        const cast_billion = show_billion ? 1e9 : 1e6
        const current_month = new Date().getMonth() + 1
        const current_quarter = GetQuarterFromMonth(current_month - space_month_Setting)

        let top_products_chart_data = []
        for (const item of top_products_chart_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth() + 1
            const quarter = GetQuarterFromMonth(month - space_month_Setting)
            const filterTimes = topProductsTimeEle.val()
            if (Check_in_period(dateApproved, period_selected_Setting)) {
                if (filterTimes === '0') {
                    if (month === current_month) {
                        top_products_chart_data.push({
                            'id': item?.['product']?.['id'],
                            'title': item?.['product']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                }
                else if (filterTimes === '1') {
                    if (quarter === current_quarter) {
                        top_products_chart_data.push({
                            'id': item?.['product']?.['id'],
                            'title': item?.['product']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                }
                else if (filterTimes === '2') {
                    top_products_chart_data.push({
                            'id': item?.['product']?.['id'],
                            'title': item?.['product']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                }
            }
        }
        let top_products_chart_data_sum = {}
        for (const item of top_products_chart_data) {
            if (top_products_chart_data_sum[item.id] !== undefined) {
                top_products_chart_data_sum[item.id].revenue += item.revenue
            } else {
                top_products_chart_data_sum[item.id] = item
            }
        }
        top_products_chart_data = Object.values(top_products_chart_data_sum)

        top_products_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = top_products_chart_data.slice(0, topProductsNumberEle.val())
        let topX_revenue = topX.map(item => item.revenue);
        let topX_title = topX.map(item => item.title);

        return {
            series: [{
                data: topX_revenue
            }],
            chart: {
                type: 'bar',
                height: HEIGHT
            },
            colors: ['#2B77A4'],
            plotOptions: {
                bar: {
                    horizontal: false,
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    if (val) {
                        return val.toFixed(parseInt(moneyRoundEle.val()))
                    } else {
                        return val
                    }
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
            },
            xaxis: {
                categories: topX_title,
                labels: {
                    show: true
                },
                title: {
                    text: titleX
                },
            },
            yaxis: {
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(parseInt(moneyRoundEle.val()))
                        } else {
                            return val
                        }
                    }
                },
                title: {
                    text: titleY
                },
            },
            title: {
                text: chart_title,
                align: 'left'
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    show: true,
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            },
        };
    }

    function InitTopProductsChart() {
        const isBillionChecked = moneyDisplayEle.val() === '1'
        let options = CombineTopProductsChartData(
            isBillionChecked
        )
        $('#top-products-spinner').prop('hidden', true)
        top_products_chart = new ApexCharts(document.querySelector("#top_products_chart"), options);
        top_products_chart.render();
    }

    function UpdateTopProductsChart() {
        const isBillionChecked = moneyDisplayEle.val() === '1'
        let options = CombineTopProductsChartData(
            isBillionChecked
        )
        top_products_chart.updateOptions(options)
    }

    function CallAjaxTopProductsChart(is_init=false) {
        let top_products_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-top-categories-products-list'),
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
            })

        Promise.all([top_products_chart_ajax]).then(
            (results) => {
                top_products_chart_DF = results[0];
                $('#top-products-time-filter-year').val(new Date().getFullYear())
                if (is_init) {
                    InitTopProductsChart()
                }
            })
    }

    topProductsNumberEle.on('change', function () {
        UpdateTopProductsChart()
    })

    topProductsTimeEle.on('change', function () {
        UpdateTopProductsChart()
    })

    $('#reload-top-products-data-btn').on('click', function () {
        CallAjaxTopProductsChart()
        UpdateTopProductsChart()
        $.fn.notifyB({description: 'Reloaded latest data'}, 'success')
    })

    // Load Page
    LoadPeriod(current_period)
    LoadRevenueGroup()
    CallAjaxRevenueChart(true)
    LoadProfitGroup()
    CallAjaxProfitChart(true)
    CallAjaxTopSellersChart(true)
    CallAjaxTopCustomersChart(true)
    CallAjaxTopCategoriesChart(true)
    CallAjaxTopProductsChart(true)
})
