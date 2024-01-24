$(document).ready(function () {
    $('#modal-dashboard-setting .modal-dialog').draggable({
        "handle": ".modal-header"
    });

    const scriptUrlEle = $('#script-url')
    const trans_script = $('#trans-url')
    const moneyRadioEle = $('.money-radio')
    const billionCheckboxEle = $('#billion-checkbox')
    const moneyRoundEle = $('#money-round')
    const periodFiscalYearFilterEle = $('#period-filter')
    let period_selected_Setting = SelectDDControl.get_data_from_idx(periodFiscalYearFilterEle, periodFiscalYearFilterEle.val())
    let fiscal_year_Setting = period_selected_Setting?.['fiscal_year']
    let space_month_Setting = period_selected_Setting?.['space_month']

    moneyRadioEle.on('change', function () {
        UpdateOptionRevenueChart()
        UpdateOptionProfitChart()
        UpdateOptionTopSellersChart()
        UpdateOptionTopCustomersChart()
        UpdateOptionTopCategoriesChart()
        UpdateOptionTopProductsChart()
    })

    moneyRoundEle.on('change', function () {
        UpdateOptionRevenueChart()
        UpdateOptionProfitChart()
        UpdateOptionTopSellersChart()
        UpdateOptionTopCustomersChart()
        UpdateOptionTopCategoriesChart()
        UpdateOptionTopProductsChart()
    })

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

    function LoadRevenuePeriod(data) {
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
            UpdateOptionRevenueChart()
            UpdateOptionProfitChart()
        })
    }

    // Revenue chart

    const revenueGroupEle = $('#revenue-group')
    const revenueTypeEle = $('#revenue-type')
    let revenue_chart_list_DF = []
    let revenue_chart_DF = null
    let revenue_expected_data_DF = []
    let revenue_expected_data_detail_DF = []

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
            UpdateOptionRevenueChart()
        })
    }

    LoadRevenueGroup()

    function CombineRevenueChartDataPeriod(group_filter, show_billion, titleY = 'Revenue (million)', titleX = 'Fiscal month', chart_title = 'Revenue chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let revenue_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of revenue_chart_list_DF) {
            const group_id = item?.['group_inherit_id']
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth()
            const year = dateApproved.getFullYear()
            if (year === fiscal_year_Setting) {
                if (!group_filter) {
                    revenue_chart_data[month] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                } else {
                    if (group_id === group_filter) {
                        revenue_chart_data[month] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                    }
                }
            }
        }

        let revenue_expected_data = []
        if (group_filter) {
            let group_found_data = revenue_expected_data_detail_DF.find(item => item?.['group_mapped_id'] === group_filter)
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
            for (let i = 0; i < revenue_expected_data_DF.length; i++) {
                revenue_expected_data.push(revenue_expected_data_DF[i] / cast_billion)
            }
        }

        return {
            series: [
                {
                    name: "Expected",
                    data: revenue_expected_data
                },
                {
                    name: "Reality",
                    data: revenue_chart_data
                }
            ],
            chart: {
                height: 230,
                type: 'line',
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
            colors: ['#5a9a9a', '#955cfa'],
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

    function CombineRevenueChartDataAccumulated(group_filter, show_billion, titleY = 'Revenue (million)', titleX = 'Fiscal month', chart_title = 'Revenue chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }
        let revenue_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of revenue_chart_list_DF) {
            const group_id = item?.['group_inherit_id']
            const dateApproved = new Date(item?.['date_approved']);
            const month = dateApproved.getMonth();
            const year = dateApproved.getFullYear();
            if (year === fiscal_year_Setting) {
                if (!group_filter) {
                    revenue_chart_data[month] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                } else {
                    if (group_id === group_filter) {
                        revenue_chart_data[month] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
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
            let group_found_data = revenue_expected_data_detail_DF.find(item => item?.['group_mapped_id'] === group_filter)
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
            for (let i = 0; i < revenue_expected_data_DF.length; i++) {
                revenue_expected_data.push(revenue_expected_data_DF[i] / cast_billion)
            }
        }

        for (let i = 0; i < revenue_expected_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = revenue_expected_data[i - 1]
            }
            revenue_expected_data[i] += last_sum
        }
        return {
            series: [
                {
                    name: "Expected",
                    data: revenue_expected_data
                },
                {
                    name: "Reality",
                    data: revenue_chart_data
                }
            ],
            chart: {
                height: 230,
                type: 'line',
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
            colors: ['#5a9a9a', '#955cfa'],
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

    function InitOptionRevenueChart() {
        let group = revenueGroupEle.val()
        let group_title = SelectDDControl.get_data_from_idx(revenueGroupEle, revenueGroupEle.val())['title']
        if (!group_title) {
            group_title = 'Company'
        }
        let calculate_type = revenueTypeEle.val()
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        if (calculate_type === '0') {
            let options = CombineRevenueChartDataPeriod(
                group,
                isBillionChecked,
                `Revenue (${unitText})`,
                'Fiscal month',
                `Revenue chart of ${group_title} in ${fiscal_year_Setting}`
            )
            revenue_chart_DF = new ApexCharts(document.querySelector("#revenue_chart"), options);
            revenue_chart_DF.render();
        } else {
            let options = CombineRevenueChartDataAccumulated(
                group,
                isBillionChecked,
                `Revenue (${unitText})`,
                'Fiscal month',
                `Revenue chart of ${group_title} in ${fiscal_year_Setting}`
            )
            revenue_chart_DF = new ApexCharts(document.querySelector("#revenue_chart"), options);
            revenue_chart_DF.render();
        }
        $('#revenue-spinner').prop('hidden', true)
    }

    function UpdateOptionRevenueChart() {
        let company_revenue_plan_list_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-company-revenue-plan-list'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('revenue_plan_list')) {
                    for (let i = 0; i < data?.['revenue_plan_list'].length; i++) {
                        if (new Date(data?.['revenue_plan_list'][i]?.['period_mapped']?.['start_date']).getFullYear() === fiscal_year_Setting) {
                            return data?.['revenue_plan_list'][i]
                        }
                    }
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            })

        Promise.all([company_revenue_plan_list_ajax]).then(
            (results) => {
                revenue_expected_data_DF = results[0]?.['company_month_target'];
                let group = revenueGroupEle.val()
                let group_title = SelectDDControl.get_data_from_idx(revenueGroupEle, revenueGroupEle.val())['title']
                if (!group_title) {
                    group_title = 'Company'
                }
                let calculate_type = revenueTypeEle.val()
                const isBillionChecked = billionCheckboxEle.prop('checked')
                const unitText = isBillionChecked ? 'billion' : 'million'
                if (calculate_type === '0') {
                    let options = CombineRevenueChartDataPeriod(
                        group,
                        isBillionChecked,
                        `Revenue (${unitText})`,
                        'Fiscal month',
                        `Revenue chart of ${group_title} in ${fiscal_year_Setting}`
                    )
                    revenue_chart_DF.updateOptions(options)
                } else {
                    let options = CombineRevenueChartDataAccumulated(
                        group,
                        isBillionChecked,
                        `Revenue (${unitText})`,
                        'Fiscal month',
                        `Revenue chart of ${group_title} in ${fiscal_year_Setting}`
                    )
                    revenue_chart_DF.updateOptions(options)
                }
            })
    }

    function AjaxRevenueChart(is_init = true) {
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
                revenue_chart_list_DF = results[0];
                revenue_expected_data_DF = results[1]?.['company_month_target'];
                revenue_expected_data_detail_DF = results[1]?.['company_month_target_detail'];

                period_selected_Setting = results[1]?.['period_mapped']
                fiscal_year_Setting = period_selected_Setting?.['fiscal_year']
                space_month_Setting = period_selected_Setting?.['space_month']
                if (is_init) {
                    LoadRevenuePeriod(period_selected_Setting)
                    InitOptionRevenueChart()
                } else {
                    $.fn.notifyB({description: "Get the latest revenue data successfully"}, 'success')
                    UpdateOptionRevenueChart()
                }
            })
    }

    AjaxRevenueChart()

    revenueTypeEle.on('change', function () {
        UpdateOptionRevenueChart()
    })

    $('#reload-revenue-data-btn').on('click', function () {
        AjaxRevenueChart(false)
    })

    $('.timechart-revenue').on('change', function () {
        UpdateOptionRevenueChart()
    })

    // Profit chart

    const profitGroupEle = $('#profit-group')
    const profitTypeEle = $('#profit-type')
    let profit_chart_list_DF = []
    let profit_chart_DF = null
    let profit_expected_data_DF = []
    let profit_expected_data_detail_DF = []

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
            UpdateOptionProfitChart()
        })
    }

    LoadProfitGroup()

    function CombineProfitChartDataPeriod(group_filter, show_billion, titleY = 'Profit (million)', titleX = 'Fiscal month', chart_title = 'Profit chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let profit_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of profit_chart_list_DF) {
            const group_id = item?.['group_inherit_id']
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth()
            const year = dateApproved.getFullYear()
            if (year === fiscal_year_Setting) {
                if (!group_filter) {
                    profit_chart_data[month] += (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                } else {
                    if (group_id === group_filter) {
                        profit_chart_data[month] += (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                    }
                }
            }
        }

        let profit_expected_data = []
        if (group_filter) {
            let group_found_data = profit_expected_data_detail_DF.find(item => item?.['group_mapped_id'] === group_filter)
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
            for (let i = 0; i < profit_expected_data_DF.length; i++) {
                profit_expected_data.push(profit_expected_data_DF[i] / cast_billion)
            }
        }

        return {
            series: [
                {
                    name: "Expected",
                    data: profit_expected_data
                },
                {
                    name: "Reality",
                    data: profit_chart_data
                }
            ],
            chart: {
                height: 230,
                type: 'line',
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
                '#5a9a9a',
                '#E92990'
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

    function CombineProfitChartDataAccumulated(group_filter, show_billion, titleY = 'Profit (million)', titleX = 'Fiscal month', chart_title = 'Profit chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }
        let profit_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of profit_chart_list_DF) {
            const group_id = item?.['group_inherit_id']
            const dateApproved = new Date(item?.['date_approved']);
            const month = dateApproved.getMonth();
            const year = dateApproved.getFullYear();
            if (year === fiscal_year_Setting) {
                if (!group_filter) {
                    profit_chart_data[month] += (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                } else {
                    if (group_id === group_filter) {
                        profit_chart_data[month] += (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
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

        let profit_expected_data = []
        if (group_filter) {
            let group_found_data = profit_expected_data_detail_DF.find(item => item?.['group_mapped_id'] === group_filter)
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
            for (let i = 0; i < profit_expected_data_DF.length; i++) {
                profit_expected_data.push(profit_expected_data_DF[i] / cast_billion)
            }
        }

        for (let i = 0; i < profit_expected_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = profit_expected_data[i - 1]
            }
            profit_expected_data[i] += last_sum
        }
        return {
            series: [
                {
                    name: "Expected",
                    data: profit_expected_data
                },
                {
                    name: "Reality",
                    data: profit_chart_data
                }
            ],
            chart: {
                height: 230,
                type: 'line',
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
                '#5a9a9a',
                '#E92990'
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

    function InitOptionProfitChart() {
        let group = profitGroupEle.val()
        let group_title = SelectDDControl.get_data_from_idx(profitGroupEle, profitGroupEle.val())['title']
        if (!group_title) {
            group_title = 'Company'
        }
        let calculate_type = profitTypeEle.val()
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        if (calculate_type === '0') {
            let options = CombineProfitChartDataPeriod(
                group,
                isBillionChecked,
                `Profit (${unitText})`,
                'Fiscal month',
                `Profit chart of ${group_title} in ${fiscal_year_Setting}`
            )
            profit_chart_DF = new ApexCharts(document.querySelector("#profit_chart"), options);
            profit_chart_DF.render();
        } else {
            let options = CombineProfitChartDataAccumulated(
                group,
                isBillionChecked,
                `Profit (${unitText})`,
                'Fiscal month',
                `Profit chart of ${group_title} in ${fiscal_year_Setting}`
            )
            profit_chart_DF = new ApexCharts(document.querySelector("#profit_chart"), options);
            profit_chart_DF.render();
        }
        $('#profit-spinner').prop('hidden', true)
    }

    function UpdateOptionProfitChart() {
        let company_revenue_plan_list_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-company-revenue-plan-list'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('revenue_plan_list')) {
                    for (let i = 0; i < data?.['revenue_plan_list'].length; i++) {
                        if (new Date(data?.['revenue_plan_list'][i]?.['period_mapped']?.['start_date']).getFullYear() === fiscal_year_Setting) {
                            return data?.['revenue_plan_list'][i]
                        }
                    }
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            })

        Promise.all([company_revenue_plan_list_ajax]).then(
            (results) => {
                profit_expected_data_DF = results[0]?.['company_month_target'];
                let group = profitGroupEle.val()
                let group_title = SelectDDControl.get_data_from_idx(profitGroupEle, profitGroupEle.val())['title']
                if (!group_title) {
                    group_title = 'Company'
                }
                let calculate_type = profitTypeEle.val()
                const isBillionChecked = billionCheckboxEle.prop('checked')
                const unitText = isBillionChecked ? 'billion' : 'million'
                if (calculate_type === '0') {
                    let options = CombineProfitChartDataPeriod(
                        group,
                        isBillionChecked,
                        `Profit (${unitText})`,
                        'Fiscal month',
                        `Profit chart of ${group_title} in ${fiscal_year_Setting}`
                    )
                    profit_chart_DF.updateOptions(options)
                } else {
                    let options = CombineProfitChartDataAccumulated(
                        group,
                        isBillionChecked,
                        `Profit (${unitText})`,
                        'Fiscal month',
                        `Profit chart of ${group_title} in ${fiscal_year_Setting}`
                    )
                    profit_chart_DF.updateOptions(options)
                }
            })
    }

    function AjaxProfitChart(is_init = true) {
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
                profit_chart_list_DF = results[0];
                profit_expected_data_DF = results[1]?.['company_month_profit_target'];
                profit_expected_data_detail_DF = results[1]?.['company_month_target_detail'];

                period_selected_Setting = results[1]?.['period_mapped']
                fiscal_year_Setting = period_selected_Setting?.['fiscal_year']
                space_month_Setting = period_selected_Setting?.['space_month']
                if (is_init) {
                    LoadRevenuePeriod(period_selected_Setting)
                    InitOptionProfitChart()
                } else {
                    $.fn.notifyB({description: "Get the latest profit data successfully"}, 'success')
                    UpdateOptionProfitChart()
                }
            })
    }

    AjaxProfitChart()

    profitTypeEle.on('change', function () {
        UpdateOptionProfitChart()
    })

    $('#reload-profit-data-btn').on('click', function () {
        AjaxProfitChart(false)
    })

    $('.timechart-profit').on('change', function () {
        UpdateOptionProfitChart()
    })

    // Top sellers chart

    const topSellersTimeFilterYearEle = $('#top-sellers-time-filter-year')
    const topSellersTimeFilterMMQQEle = $('#top-sellers-time-filter-mm-qq')
    const topSellersTimeFilterSelectEle = $('#top-sellers-time-filter-select')
    const topSellersTimeEle = $('#top-sellers-time')
    const topSellersNumberEle = $('#top-sellers-number')

    let top_sellers_chart_list_DF = []
    let top_sellers_chart_DF = null

    function CombineTopSellersChartData(show_billion, titleY = "Seller's fullname", titleX = 'Revenue (million)') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        const current_year = new Date().getFullYear()
        const current_month = new Date().getMonth() + 1
        const current_quarter = parseInt(current_month / 3) + 1
        const filter_year = topSellersTimeFilterYearEle.val()
        const filter_qq_mm = topSellersTimeFilterMMQQEle.val()

        let top_sellers_chart_data = []
        for (const item of top_sellers_chart_list_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const year = dateApproved.getFullYear()
            const month = dateApproved.getMonth() + 1
            const quarter = parseInt(month / 3) + 1
            const filterTimes = topSellersTimeEle.val()
            if (filterTimes === '0') {
                if (year === current_year && month === current_month) {
                    top_sellers_chart_data.push({
                        'id': item?.['employee_inherit']?.['id'],
                        'full_name': item?.['employee_inherit']?.['full_name'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else if (filterTimes === '1') {
                if (year === current_year && quarter === current_quarter) {
                    top_sellers_chart_data.push({
                        'id': item?.['employee_inherit']?.['id'],
                        'full_name': item?.['employee_inherit']?.['full_name'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else if (filterTimes === '2') {
                if (year === current_year) {
                    top_sellers_chart_data.push({
                        'id': item?.['employee_inherit']?.['id'],
                        'full_name': item?.['employee_inherit']?.['full_name'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else {
                if (topSellersTimeFilterSelectEle.val() === '0') {
                    if (year === parseInt(filter_year)) {
                        top_sellers_chart_data.push({
                            'id': item?.['employee_inherit']?.['id'],
                            'full_name': item?.['employee_inherit']?.['full_name'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                } else if (topSellersTimeFilterSelectEle.val() === '1') {
                    if (month === parseInt(filter_qq_mm) && year === parseInt(filter_year)) {
                        top_sellers_chart_data.push({
                            'id': item?.['employee_inherit']?.['id'],
                            'full_name': item?.['employee_inherit']?.['full_name'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                } else if (topSellersTimeFilterSelectEle.val() === '2') {
                    if (quarter === parseInt(filter_qq_mm) && year === parseInt(filter_year)) {
                        top_sellers_chart_data.push({
                            'id': item?.['employee_inherit']?.['id'],
                            'full_name': item?.['employee_inherit']?.['full_name'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
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
                height: 230
            },
            colors: ['#147945'],
            plotOptions: {
                bar: {
                    borderRadius: 5,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true,
                // textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val) {
                    if (val) {
                        return val.toFixed(parseInt(moneyRoundEle.val()))
                    } else {
                        return val
                    }
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
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
                text: `Top ${topX.length} Sellers Chart`,
                align: 'left',
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

    function InitOptionTopSellersChart() {
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopSellersChartData(
            isBillionChecked,
            '',
            `Revenue (${unitText})`
        )
        $('#top-sellers-spinner').prop('hidden', true)
        top_sellers_chart_DF = new ApexCharts(document.querySelector("#top_sellers_chart"), options);
        top_sellers_chart_DF.render();
    }

    function UpdateOptionTopSellersChart() {
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopSellersChartData(
            isBillionChecked,
            '',
            `Revenue (${unitText})`
        )
        top_sellers_chart_DF.updateOptions(options)
    }

    function AjaxTopSellersChart(is_init = true) {
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
                top_sellers_chart_list_DF = results[0];
                $('#top-sellers-time-filter-year').val(new Date().getFullYear())
                if (is_init) {
                    InitOptionTopSellersChart()
                } else {
                    $.fn.notifyB({description: "Get the latest top sellers data successfully"}, 'success')
                    UpdateOptionTopSellersChart()
                }
            })
    }

    AjaxTopSellersChart()

    topSellersNumberEle.on('change', function () {
        UpdateOptionTopSellersChart()
    })

    topSellersTimeEle.on('change', function () {
        if ($(this).val() === '3') {
            topSellersTimeFilterSelectEle.val('0').prop('hidden', false).prop('disabled', false)
            topSellersTimeFilterMMQQEle.prop('disabled', topSellersTimeFilterSelectEle.val() === '0')
            topSellersTimeFilterYearEle.prop('hidden', false).prop('disabled', false)
        } else {
            UpdateOptionTopSellersChart()
            topSellersTimeFilterSelectEle.prop('hidden', true).prop('disabled', true)
            topSellersTimeFilterMMQQEle.prop('disabled', true)
            topSellersTimeFilterYearEle.prop('hidden', true).prop('disabled', true)
            topSellersTimeFilterMMQQEle.closest('div').prop('hidden', true)
        }
    })

    topSellersTimeFilterSelectEle.on('change', function () {
        topSellersTimeFilterMMQQEle.val('').prop('disabled', $(this).val() === '0')
        topSellersTimeFilterMMQQEle.closest('div').prop('hidden', $(this).val() === '0')

        topSellersTimeFilterYearEle.val(new Date().getFullYear())
        if ($(this).val() === '1') {
            topSellersTimeFilterMMQQEle.val(new Date().getMonth() + 1)
        } else if ($(this).val() === '2') {
            topSellersTimeFilterMMQQEle.val(parseInt((new Date().getMonth() + 1) / 3) + 1)
        }
    })

    $('#reload-top-sellers-data-btn').on('click', function () {
        AjaxTopSellersChart(false)
    })

    $('.timechart-sellers').on('change', function () {
        UpdateOptionTopSellersChart()
    })

    // Top customers chart
    const topCustomersTimeFilterYearEle = $('#top-customers-time-filter-year')
    const topCustomersTimeFilterMMQQEle = $('#top-customers-time-filter-mm-qq')
    const topCustomersTimeFilterSelectEle = $('#top-customers-time-filter-select')
    const topCustomersTimeEle = $('#top-customers-time')
    const topCustomersNumberEle = $('#top-customers-number')

    let top_customers_chart_list_DF = []
    let top_customers_chart_DF = null

    function CombineTopCustomersChartData(show_billion, titleY = "Customer's name", titleX = 'Revenue (million)') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        const current_year = new Date().getFullYear()
        const current_month = new Date().getMonth() + 1
        const current_quarter = parseInt(current_month / 3) + 1
        const filter_year = topCustomersTimeFilterYearEle.val()
        const filter_qq_mm = topCustomersTimeFilterMMQQEle.val()

        let top_customers_chart_data = []
        for (const item of top_customers_chart_list_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const year = dateApproved.getFullYear()
            const month = dateApproved.getMonth() + 1
            const quarter = parseInt(month / 3) + 1
            const filterTimes = topCustomersTimeEle.val()
            if (filterTimes === '0') {
                if (year === current_year && month === current_month) {
                    top_customers_chart_data.push({
                        'id': item?.['customer']?.['id'],
                        'title': item?.['customer']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else if (filterTimes === '1') {
                if (year === current_year && quarter === current_quarter) {
                    top_customers_chart_data.push({
                        'id': item?.['customer']?.['id'],
                        'title': item?.['customer']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else if (filterTimes === '2') {
                if (year === current_year) {
                    top_customers_chart_data.push({
                        'id': item?.['customer']?.['id'],
                        'title': item?.['customer']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else {
                if (topCustomersTimeFilterSelectEle.val() === '0') {
                    if (year === parseInt(filter_year)) {
                        top_customers_chart_data.push({
                            'id': item?.['customer']?.['id'],
                            'title': item?.['customer']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                } else if (topCustomersTimeFilterSelectEle.val() === '1') {
                    if (month === parseInt(filter_qq_mm) && year === parseInt(filter_year)) {
                        top_customers_chart_data.push({
                            'id': item?.['customer']?.['id'],
                            'title': item?.['customer']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                } else if (topCustomersTimeFilterSelectEle.val() === '2') {
                    if (quarter === parseInt(filter_qq_mm) && year === parseInt(filter_year)) {
                        top_customers_chart_data.push({
                            'id': item?.['customer']?.['id'],
                            'title': item?.['customer']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
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
                height: 230
            },
            colors: ['#c07725'],
            plotOptions: {
                bar: {
                    borderRadius: 5,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: true,
                // textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val) {
                    if (val) {
                        return val.toFixed(parseInt(moneyRoundEle.val()))
                    } else {
                        return val
                    }
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
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
                text: `Top ${topX.length} Customers Chart`,
                align: 'left',
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

    function InitOptionTopCustomersChart() {
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopCustomersChartData(
            isBillionChecked,
            '',
            `Revenue (${unitText})`
        )
        $('#top-customers-spinner').prop('hidden', true)
        top_customers_chart_DF = new ApexCharts(document.querySelector("#top_customers_chart"), options);
        top_customers_chart_DF.render();
    }

    function UpdateOptionTopCustomersChart() {
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopCustomersChartData(
            isBillionChecked,
            '',
            `Revenue (${unitText})`
        )
        top_customers_chart_DF.updateOptions(options)
    }

    function AjaxTopCustomersChart(is_init = true) {
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
                top_customers_chart_list_DF = results[0];
                $('#top-customers-time-filter-year').val(new Date().getFullYear())
                if (is_init) {
                    InitOptionTopCustomersChart()
                } else {
                    $.fn.notifyB({description: "Get the latest top customers data successfully"}, 'success')
                    UpdateOptionTopCustomersChart()
                }
            })
    }

    AjaxTopCustomersChart()

    topCustomersNumberEle.on('change', function () {
        UpdateOptionTopCustomersChart()
    })

    topCustomersTimeEle.on('change', function () {
        if ($(this).val() === '3') {
            topCustomersTimeFilterSelectEle.val('0').prop('hidden', false).prop('disabled', false)
            topCustomersTimeFilterMMQQEle.prop('disabled', topCustomersTimeFilterSelectEle.val() === '0')
            topCustomersTimeFilterYearEle.prop('hidden', false).prop('disabled', false)
        } else {
            UpdateOptionTopCustomersChart()
            topCustomersTimeFilterSelectEle.prop('hidden', true).prop('disabled', true)
            topCustomersTimeFilterMMQQEle.prop('disabled', true)
            topCustomersTimeFilterYearEle.prop('hidden', true).prop('disabled', true)
            topCustomersTimeFilterMMQQEle.closest('div').prop('hidden', true)
        }
    })

    topCustomersTimeFilterSelectEle.on('change', function () {
        topCustomersTimeFilterMMQQEle.val('').prop('disabled', $(this).val() === '0')
        topCustomersTimeFilterMMQQEle.closest('div').prop('hidden', $(this).val() === '0')
        topCustomersTimeFilterYearEle.val(new Date().getFullYear())
        if ($(this).val() === '1') {
            topCustomersTimeFilterMMQQEle.val(new Date().getMonth() + 1)
        } else if ($(this).val() === '2') {
            topCustomersTimeFilterMMQQEle.val(parseInt((new Date().getMonth() + 1) / 3) + 1)
        }
    })

    $('#reload-top-customers-data-btn').on('click', function () {
        AjaxTopCustomersChart(false)
    })

    $('.timechart-customers').on('change', function () {
        UpdateOptionTopCustomersChart()
    })

    // Top categories chart

    const topCategoriesTimeFilterYearEle = $('#top-categories-time-filter-year')
    const topCategoriesTimeFilterMMQQEle = $('#top-categories-time-filter-mm-qq')
    const topCategoriesTimeFilterSelectEle = $('#top-categories-time-filter-select')
    const topCategoriesTimeEle = $('#top-categories-time')
    const topCategoriesNumberEle = $('#top-categories-number')

    let top_categories_chart_list_DF = []
    let top_categories_chart_DF = null

    function CombineTopCategoriesChartData(show_billion, titleY = "Revenue (million)", titleX = "Category's name") {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        const current_year = new Date().getFullYear()
        const current_month = new Date().getMonth() + 1
        const current_quarter = parseInt(current_month / 3) + 1
        const filter_year = topCategoriesTimeFilterYearEle.val()
        const filter_qq_mm = topCategoriesTimeFilterMMQQEle.val()

        let top_categories_chart_data = []
        for (const item of top_categories_chart_list_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const year = dateApproved.getFullYear()
            const month = dateApproved.getMonth() + 1
            const quarter = parseInt(month / 3) + 1
            const filterTimes = topCategoriesTimeEle.val()
            if (filterTimes === '0') {
                if (year === current_year && month === current_month) {
                    top_categories_chart_data.push({
                        'id': item?.['product']?.['general_product_category']?.['id'],
                        'title': item?.['product']?.['general_product_category']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else if (filterTimes === '1') {
                if (year === current_year && quarter === current_quarter) {
                    top_categories_chart_data.push({
                        'id': item?.['product']?.['general_product_category']?.['id'],
                        'title': item?.['product']?.['general_product_category']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else if (filterTimes === '2') {
                if (year === current_year) {
                    top_categories_chart_data.push({
                        'id': item?.['product']?.['general_product_category']?.['id'],
                        'title': item?.['product']?.['general_product_category']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else {
                if (topCategoriesTimeFilterSelectEle.val() === '0') {
                    if (year === parseInt(filter_year)) {
                        top_categories_chart_data.push({
                            'id': item?.['product']?.['general_product_category']?.['id'],
                            'title': item?.['product']?.['general_product_category']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                } else if (topCategoriesTimeFilterSelectEle.val() === '1') {
                    if (month === parseInt(filter_qq_mm) && year === parseInt(filter_year)) {
                        top_categories_chart_data.push({
                            'id': item?.['product']?.['general_product_category']?.['id'],
                            'title': item?.['product']?.['general_product_category']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                } else if (topCategoriesTimeFilterSelectEle.val() === '2') {
                    if (quarter === parseInt(filter_qq_mm) && year === parseInt(filter_year)) {
                        top_categories_chart_data.push({
                            'id': item?.['product']?.['general_product_category']?.['id'],
                            'title': item?.['product']?.['general_product_category']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
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
                height: 230
            },
            colors: ['#fd8b9f'],
            plotOptions: {
                bar: {
                    borderRadius: 5,
                    horizontal: false,
                }
            },
            dataLabels: {
                enabled: true,
                // textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val) {
                    if (val) {
                        return val.toFixed(parseInt(moneyRoundEle.val()))
                    } else {
                        return val
                    }
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
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

    function InitOptionTopCategoriesChart() {
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopCategoriesChartData(
            isBillionChecked,
            `Revenue (${unitText})`,
            "Category's name",
        )
        $('#top-categories-spinner').prop('hidden', true)
        top_categories_chart_DF = new ApexCharts(document.querySelector("#top_categories_chart"), options);
        top_categories_chart_DF.render();
    }

    function UpdateOptionTopCategoriesChart() {
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopCategoriesChartData(
            isBillionChecked,
            `Revenue (${unitText})`,
            "Category's name",
        )
        top_categories_chart_DF.updateOptions(options)
    }

    function AjaxTopCategoriesChart(is_init = true) {
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
                top_categories_chart_list_DF = results[0];
                $('#top-categories-time-filter-year').val(new Date().getFullYear())
                if (is_init) {
                    InitOptionTopCategoriesChart()
                } else {
                    $.fn.notifyB({description: "Get the latest top categories data successfully"}, 'success')
                    UpdateOptionTopCategoriesChart()
                }
            })
    }

    AjaxTopCategoriesChart()

    topCategoriesNumberEle.on('change', function () {
        UpdateOptionTopCategoriesChart()
    })

    topCategoriesTimeEle.on('change', function () {
        if ($(this).val() === '3') {
            topCategoriesTimeFilterSelectEle.val('0').prop('hidden', false).prop('disabled', false)
            topCategoriesTimeFilterMMQQEle.prop('disabled', topCategoriesTimeFilterSelectEle.val() === '0')
            topCategoriesTimeFilterYearEle.prop('hidden', false).prop('disabled', false)
        } else {
            UpdateOptionTopCategoriesChart()
            topCategoriesTimeFilterSelectEle.prop('hidden', true).prop('disabled', true)
            topCategoriesTimeFilterMMQQEle.prop('disabled', true)
            topCategoriesTimeFilterYearEle.prop('hidden', true).prop('disabled', true)
            topCategoriesTimeFilterMMQQEle.closest('div').prop('hidden', true)
        }
    })

    topCategoriesTimeFilterSelectEle.on('change', function () {
        topCategoriesTimeFilterMMQQEle.val('').prop('disabled', $(this).val() === '0')
        topCategoriesTimeFilterMMQQEle.closest('div').prop('hidden', $(this).val() === '0')
        topCategoriesTimeFilterYearEle.val(new Date().getFullYear())
        if ($(this).val() === '1') {
            topCategoriesTimeFilterMMQQEle.val(new Date().getMonth() + 1)
        } else if ($(this).val() === '2') {
            topCategoriesTimeFilterMMQQEle.val(parseInt((new Date().getMonth() + 1) / 3) + 1)
        }
    })

    $('#reload-top-categories-data-btn').on('click', function () {
        AjaxTopCategoriesChart(false)
    })

    $('.timechart-categories').on('change', function () {
        UpdateOptionTopCategoriesChart()
    })

    // Top products chart

    const topProductsTimeFilterYearEle = $('#top-products-time-filter-year')
    const topProductsTimeFilterMMQQEle = $('#top-products-time-filter-mm-qq')
    const topProductsTimeFilterSelectEle = $('#top-products-time-filter-select')
    const topProductsTimeEle = $('#top-products-time')
    const topProductsNumberEle = $('#top-products-number')

    let top_products_chart_list_DF = []
    let top_products_chart_DF = null

    function CombineTopProductsChartData(show_billion, titleY = "Revenue (million)", titleX = "Product's name") {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        const current_year = new Date().getFullYear()
        const current_month = new Date().getMonth() + 1
        const current_quarter = parseInt(current_month / 3) + 1
        const filter_year = topProductsTimeFilterYearEle.val()
        const filter_qq_mm = topProductsTimeFilterMMQQEle.val()

        let top_products_chart_data = []
        for (const item of top_products_chart_list_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const year = dateApproved.getFullYear()
            const month = dateApproved.getMonth() + 1
            const quarter = parseInt(month / 3) + 1
            const filterTimes = topProductsTimeEle.val()
            if (filterTimes === '0') {
                if (year === current_year && month === current_month) {
                    top_products_chart_data.push({
                        'id': item?.['product']?.['id'],
                        'title': item?.['product']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else if (filterTimes === '1') {
                if (year === current_year && quarter === current_quarter) {
                    top_products_chart_data.push({
                        'id': item?.['product']?.['id'],
                        'title': item?.['product']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else if (filterTimes === '2') {
                if (year === current_year) {
                    top_products_chart_data.push({
                        'id': item?.['product']?.['id'],
                        'title': item?.['product']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            } else {
                if (topProductsTimeFilterSelectEle.val() === '0') {
                    if (year === parseInt(filter_year)) {
                        top_products_chart_data.push({
                            'id': item?.['product']?.['id'],
                            'title': item?.['product']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                } else if (topProductsTimeFilterSelectEle.val() === '1') {
                    if (month === parseInt(filter_qq_mm) && year === parseInt(filter_year)) {
                        top_products_chart_data.push({
                            'id': item?.['product']?.['id'],
                            'title': item?.['product']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
                } else if (topProductsTimeFilterSelectEle.val() === '2') {
                    if (quarter === parseInt(filter_qq_mm) && year === parseInt(filter_year)) {
                        top_products_chart_data.push({
                            'id': item?.['product']?.['id'],
                            'title': item?.['product']?.['title'],
                            'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                        })
                    }
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
                height: 230
            },
            colors: ['#28abbe'],
            plotOptions: {
                bar: {
                    borderRadius: 5,
                    horizontal: false,
                }
            },
            dataLabels: {
                enabled: true,
                // textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val) {
                    if (val) {
                        return val.toFixed(parseInt(moneyRoundEle.val()))
                    } else {
                        return val
                    }
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
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

    function InitOptionTopProductsChart() {
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopProductsChartData(
            isBillionChecked,
            `Revenue (${unitText})`,
            "Product's name",
        )
        $('#top-products-spinner').prop('hidden', true)
        top_products_chart_DF = new ApexCharts(document.querySelector("#top_products_chart"), options);
        top_products_chart_DF.render();
    }

    function UpdateOptionTopProductsChart() {
        const isBillionChecked = billionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopProductsChartData(
            isBillionChecked,
            `Revenue (${unitText})`,
            "Product's name",
        )
        top_products_chart_DF.updateOptions(options)
    }

    function AjaxTopProductsChart(is_init = true) {
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
                top_products_chart_list_DF = results[0];
                $('#top-products-time-filter-year').val(new Date().getFullYear())
                if (is_init) {
                    InitOptionTopProductsChart()
                } else {
                    $.fn.notifyB({description: "Get the latest top products data successfully"}, 'success')
                    UpdateOptionTopProductsChart()
                }
            })
    }

    AjaxTopProductsChart()

    topProductsNumberEle.on('change', function () {
        UpdateOptionTopProductsChart()
    })

    topProductsTimeEle.on('change', function () {
        if ($(this).val() === '3') {
            topProductsTimeFilterSelectEle.val('0').prop('hidden', false).prop('disabled', false)
            topProductsTimeFilterMMQQEle.prop('disabled', topProductsTimeFilterSelectEle.val() === '0')
            topProductsTimeFilterYearEle.prop('hidden', false).prop('disabled', false)
        } else {
            UpdateOptionTopProductsChart()
            topProductsTimeFilterSelectEle.prop('hidden', true).prop('disabled', true)
            topProductsTimeFilterMMQQEle.prop('disabled', true)
            topProductsTimeFilterYearEle.prop('hidden', true).prop('disabled', true)
            topProductsTimeFilterMMQQEle.closest('div').prop('hidden', true)
        }
    })

    topProductsTimeFilterSelectEle.on('change', function () {
        topProductsTimeFilterMMQQEle.val('').prop('disabled', $(this).val() === '0')
        topProductsTimeFilterMMQQEle.closest('div').prop('hidden', $(this).val() === '0')
        topProductsTimeFilterYearEle.val(new Date().getFullYear())
        if ($(this).val() === '1') {
            topProductsTimeFilterMMQQEle.val(new Date().getMonth() + 1)
        } else if ($(this).val() === '2') {
            topProductsTimeFilterMMQQEle.val(parseInt((new Date().getMonth() + 1) / 3) + 1)
        }
    })

    $('#reload-top-products-data-btn').on('click', function () {
        AjaxTopProductsChart(false)
    })

    $('.timechart-products').on('change', function () {
        UpdateOptionTopProductsChart()
    })
})
