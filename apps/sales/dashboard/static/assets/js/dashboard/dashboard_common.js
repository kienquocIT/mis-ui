$(document).ready(function () {
    let scriptUrlEle = $('#script-url')

    // Revenue chart

    let revenue_chart_list_DF = []
    let revenue_chart_DF = null
    let revenue_expected_data_DF = [3.0e+9, 3.0e+9, 4.0e+9, 5.0e+9, 4.0e+9, 3.0e+9, 4.0e+9, 3.0e+9, 4.0e+9, 3.2e+9, 3.4e+9, 4.0e+9,]

    function LoadRevenueGroup(data) {
        $('#revenue-group').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#revenue-group').attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                // console.log(resp.data[keyResp])
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

    function CombineRevenueChartDataPeriod(group_filter, show_billion, titleY='Revenue (million)', titleX='Fiscal month') {
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
            const filterYear = parseInt($('#revenue-year-filter').val())
            if (year === filterYear) {
                if (!group_filter) {
                    revenue_chart_data[month] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                }
                else {
                    if (group_id === group_filter) {
                        revenue_chart_data[month] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                    }
                }
            }
        }
        // auto
        // for (let i = 0; i < revenue_chart_data.length; i++) {
        //     if (revenue_chart_data[i] <= 0) {
        //         revenue_chart_data[i] = 4e+9 / cast_billion
        //     }
        // }

        let revenue_expected_data = []
        for (let i = 0; i < revenue_expected_data_DF.length; i++) {
            revenue_expected_data.push(revenue_expected_data_DF[i] / cast_billion)
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
                text: 'Revenue chart',
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                title: {
                    text: titleX
                }
            },
            yaxis: {
                title: {
                    text: titleY
                },
                labels: {
                    formatter: function(val, index) {
                        return val.toFixed(3);
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

    function CombineRevenueChartDataAccumulated(group_filter, show_billion, titleY='Revenue (million)', titleX='Fiscal month') {
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
            const filterYear = parseInt($('#revenue-year-filter').val());
            if (year === filterYear) {
                if (!group_filter) {
                    revenue_chart_data[month] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                }
                else {
                    if (group_id === group_filter) {
                        revenue_chart_data[month] += (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion
                    }
                }
            }
        }
        // auto
        // for (let i = 0; i < revenue_chart_data.length; i++) {
        //     if (revenue_chart_data[i] <= 0) {
        //         revenue_chart_data[i] = 4e+9 / cast_billion
        //     }
        // }
        for (let i = 0; i < revenue_chart_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = revenue_chart_data[i-1]
            }
            revenue_chart_data[i] += last_sum
        }

        let revenue_expected_data = []
        for (let i = 0; i < revenue_expected_data_DF.length; i++) {
            revenue_expected_data.push(revenue_expected_data_DF[i] / cast_billion)
        }
        for (let i = 0; i < revenue_expected_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = revenue_expected_data[i-1]
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
                text: 'Revenue chart',
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                title: {
                    text: titleX
                }
            },
            yaxis: {
                title: {
                    text: titleY
                },
                labels: {
                    formatter: function(val, index) {
                        return val.toFixed(3);
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
        let group = $('#revenue-group').val()
        let calculate_type = $('#revenue-type').val()
        const isBillionChecked = $('#revenue-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        if (calculate_type === '0') {
            let options = CombineRevenueChartDataPeriod(
                group,
                isBillionChecked,
                `Revenue (${unitText})`
            )
            revenue_chart_DF = new ApexCharts(document.querySelector("#revenue_chart"), options);
            revenue_chart_DF.render();
        }
        else {
            let options = CombineRevenueChartDataAccumulated(
                group,
                isBillionChecked,
                `Revenue (${unitText})`
            )
            revenue_chart_DF = new ApexCharts(document.querySelector("#revenue_chart"), options);
            revenue_chart_DF.render();
        }
    }

    function UpdateOptionRevenueChart() {
        let group = $('#revenue-group').val()
        let calculate_type = $('#revenue-type').val()
        const isBillionChecked = $('#revenue-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        if (calculate_type === '0') {
            let options = CombineRevenueChartDataPeriod(
                group,
                isBillionChecked,
                `Revenue (${unitText})`
            )
            revenue_chart_DF.updateOptions(options)
        }
        else {
            let options = CombineRevenueChartDataAccumulated(
                group,
                isBillionChecked,
                `Revenue (${unitText})`
            )
            revenue_chart_DF.updateOptions(options)
        }
    }

    function AjaxRevenueChart(is_init=true) {
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

        Promise.all([revenue_chart_ajax]).then(
            (results) => {
                revenue_chart_list_DF = results[0];
                if (is_init) {
                    InitOptionRevenueChart()
                }
                else {
                    $.fn.notifyB({description: "Get the latest revenue data successfully"}, 'success')
                    UpdateOptionRevenueChart()
                }
            })
    }

    AjaxRevenueChart()

    $('#btn-show-revenue-chart').on('click', function() {
        UpdateOptionRevenueChart()
    })

    $('#revenue-type').on('change', function() {
        UpdateOptionRevenueChart()
    })

    $('#reload-revenue-data-btn').on('click', function() {
        AjaxRevenueChart(false)
    })

    // Profit chart

    let profit_chart_list_DF = []
    let profit_chart_DF = null
    let profit_expected_data_DF = [1.0e+9, 1.7e+9, 1.5e+9, 1.8e+9, 1.0e+9, 0.5e+9, 1.5e+9, 1.3e+9, 1.5e+9, 1.2e+9, 1.4e+9, 2.0e+9,]

    function LoadProfitGroup(data) {
        $('#profit-group').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#profit-group').attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                // console.log(resp.data[keyResp])
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

    function CombineProfitChartDataPeriod(group_filter, show_billion, titleY='Profit (million)', titleX='Fiscal month') {
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
            const filterYear = parseInt($('#profit-year-filter').val())
            if (year === filterYear) {
                if (!group_filter) {
                    profit_chart_data[month] += (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                }
                else {
                    if (group_id === group_filter) {
                        profit_chart_data[month] += (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                    }
                }
            }
        }
        // auto
        // for (let i = 0; i < profit_chart_data.length; i++) {
        //     if (profit_chart_data[i] <= 0) {
        //         profit_chart_data[i] = 2e+9 / cast_billion
        //     }
        // }

        let profit_expected_data = []
        for (let i = 0; i < profit_expected_data_DF.length; i++) {
            profit_expected_data.push(profit_expected_data_DF[i] / cast_billion)
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
            colors: ['#5a9a9a', '#E92990'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Profit chart',
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                title: {
                    text: titleX
                }
            },
            yaxis: {
                title: {
                    text: titleY
                },
                labels: {
                    formatter: function(val, index) {
                        return val.toFixed(3);
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

    function CombineProfitChartDataAccumulated(group_filter, show_billion, titleY='Profit (million)', titleX='Fiscal month') {
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
            const filterYear = parseInt($('#profit-year-filter').val());
            if (year === filterYear) {
                if (!group_filter) {
                    profit_chart_data[month] += (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                }
                else {
                    if (group_id === group_filter) {
                        profit_chart_data[month] += (item?.['gross_profit'] ? item?.['gross_profit'] : 0) / cast_billion
                    }
                }
            }
        }
        // auto
        // for (let i = 0; i < profit_chart_data.length; i++) {
        //     if (profit_chart_data[i] <= 0) {
        //         profit_chart_data[i] = 2e+9 / cast_billion
        //     }
        // }
        for (let i = 0; i < profit_chart_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = profit_chart_data[i-1]
            }
            profit_chart_data[i] += last_sum
        }

        let profit_expected_data = []
        for (let i = 0; i < profit_expected_data_DF.length; i++) {
            profit_expected_data.push(profit_expected_data_DF[i] / cast_billion)
        }
        for (let i = 0; i < profit_expected_data.length; i++) {
            let last_sum = 0
            if (i > 0) {
                last_sum = profit_expected_data[i-1]
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
            colors: ['#5a9a9a', '#E92990'],
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: 'Profit chart',
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
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                title: {
                    text: titleX
                }
            },
            yaxis: {
                title: {
                    text: titleY
                },
                labels: {
                    formatter: function(val, index) {
                        return val.toFixed(3);
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
        let group = $('#profit-group').val()
        let calculate_type = $('#profit-type').val()
        const isBillionChecked = $('#profit-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        if (calculate_type === '0') {
            let options = CombineProfitChartDataPeriod(
                group,
                isBillionChecked,
                `Profit (${unitText})`
            )
            profit_chart_DF = new ApexCharts(document.querySelector("#profit_chart"), options);
            profit_chart_DF.render();
        }
        else {
            let options = CombineProfitChartDataAccumulated(
                group,
                isBillionChecked,
                `Profit (${unitText})`
            )
            profit_chart_DF = new ApexCharts(document.querySelector("#profit_chart"), options);
            profit_chart_DF.render();
        }
    }

    function UpdateOptionProfitChart() {
        let group = $('#profit-group').val()
        let calculate_type = $('#profit-type').val()
        const isBillionChecked = $('#profit-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        if (calculate_type === '0') {
            let options = CombineProfitChartDataPeriod(
                group,
                isBillionChecked,
                `Profit (${unitText})`
            )
            profit_chart_DF.updateOptions(options)
        }
        else {
            let options = CombineProfitChartDataAccumulated(
                group,
                isBillionChecked,
                `Profit (${unitText})`
            )
            profit_chart_DF.updateOptions(options)
        }
    }

    function AjaxProfitChart(is_init=true) {
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

        Promise.all([profit_chart_ajax]).then(
            (results) => {
                profit_chart_list_DF = results[0];
                // console.log(profit_chart_list_DF)
                if (is_init) {
                    InitOptionProfitChart()
                }
                else {
                    $.fn.notifyB({description: "Get the latest profit data successfully"}, 'success')
                    UpdateOptionProfitChart()
                }
            })
    }

    AjaxProfitChart()

    $('#btn-show-profit-chart').on('click', function() {
        UpdateOptionProfitChart()
    })

    $('#profit-type').on('change', function() {
        UpdateOptionProfitChart()
    })

    $('#reload-profit-data-btn').on('click', function() {
        AjaxProfitChart(false)
    })

    // Top sellers chart

    let top_sellers_chart_list_DF = []
    let top_sellers_chart_DF = null

    function CombineTopSellersChartData(show_billion, titleY="Seller's fullname", titleX='Revenue (million)') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let top_sellers_chart_data = []
        for (const item of top_sellers_chart_list_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth() + 1
            const year = dateApproved.getFullYear()
            const filterYear = parseInt($('#top-sellers-year-filter').val())
            const filterMonth = parseInt($('#top-sellers-month-filter').val())
            const filterQuarter = parseInt($('#top-sellers-quarter-filter').val())
            const filterTimes = $('#top-sellers-time').val()
            if (filterTimes === '0') {
                if (year === filterYear && month === filterMonth) {
                    top_sellers_chart_data.push({
                        'id': item?.['employee_inherit']?.['id'],
                        'full_name': item?.['employee_inherit']?.['full_name'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '1') {
                if (year === filterYear && parseInt(month/3) === filterQuarter) {
                    top_sellers_chart_data.push({
                        'id': item?.['employee_inherit']?.['id'],
                        'full_name': item?.['employee_inherit']?.['full_name'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else {
                if (year === filterYear) {
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
            }
            else {
                top_sellers_chart_data_sum[item.id] = item
            }
        }
        top_sellers_chart_data = Object.values(top_sellers_chart_data_sum)

        top_sellers_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = top_sellers_chart_data.slice(0, $('#top-sellers-number').val())
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
                formatter: function (val, opt) {
                    return val
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
                    show: true
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
        const isBillionChecked = $('#top-sellers-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopSellersChartData(
            isBillionChecked,
            '',
            `Revenue (${unitText})`
        )
        top_sellers_chart_DF = new ApexCharts(document.querySelector("#top_sellers_chart"), options);
        top_sellers_chart_DF.render();
    }

    function UpdateOptionTopSellersChart() {
        const isBillionChecked = $('#top-sellers-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopSellersChartData(
            isBillionChecked,
            '',
            `Revenue (${unitText})`
        )
        top_sellers_chart_DF.updateOptions(options)
    }

    function AjaxTopSellersChart(is_init=true) {
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
                // console.log(top_sellers_chart_list_DF)
                if (is_init) {
                    InitOptionTopSellersChart()
                }
                else {
                    $.fn.notifyB({description: "Get the latest top sellers data successfully"}, 'success')
                    UpdateOptionTopSellersChart()
                }
            })
    }

    AjaxTopSellersChart()

    $('#btn-show-top-sellers-chart').on('click', function() {
        UpdateOptionTopSellersChart()
    })

    $('#top-sellers-number').on('change', function() {
        UpdateOptionTopSellersChart()
    })

    $('#top-sellers-time').on('change', function() {
        UpdateOptionTopSellersChart()
    })

    $('#reload-top-sellers-data-btn').on('click', function() {
        AjaxTopSellersChart(false)
    })

    // Top customers chart
    
    let top_customers_chart_list_DF = []
    let top_customers_chart_DF = null

    function CombineTopCustomersChartData(show_billion, titleY="Customer's name", titleX='Revenue (million)') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let top_customers_chart_data = []
        for (const item of top_customers_chart_list_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth() + 1
            const year = dateApproved.getFullYear()
            const filterYear = parseInt($('#top-customers-year-filter').val())
            const filterMonth = parseInt($('#top-customers-month-filter').val())
            const filterQuarter = parseInt($('#top-customers-quarter-filter').val())
            const filterTimes = $('#top-customers-time').val()
            if (filterTimes === '0') {
                if (year === filterYear && month === filterMonth) {
                    top_customers_chart_data.push({
                        'id': item?.['customer']?.['id'],
                        'title': item?.['customer']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '1') {
                if (year === filterYear && parseInt(month/3) === filterQuarter) {
                    top_customers_chart_data.push({
                        'id': item?.['customer']?.['id'],
                        'title': item?.['customer']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else {
                if (year === filterYear) {
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
            }
            else {
                top_customers_chart_data_sum[item.id] = item
            }
        }
        top_customers_chart_data = Object.values(top_customers_chart_data_sum)

        top_customers_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = top_customers_chart_data.slice(0, $('#top-customers-number').val())
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
                formatter: function (val, opt) {
                    return val
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
        const isBillionChecked = $('#top-customers-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopCustomersChartData(
            isBillionChecked,
            '',
            `Revenue (${unitText})`
        )
        top_customers_chart_DF = new ApexCharts(document.querySelector("#top_customers_chart"), options);
        top_customers_chart_DF.render();
    }

    function UpdateOptionTopCustomersChart() {
        const isBillionChecked = $('#top-customers-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopCustomersChartData(
            isBillionChecked,
            '',
            `Revenue (${unitText})`
        )
        top_customers_chart_DF.updateOptions(options)
    }

    function AjaxTopCustomersChart(is_init=true) {
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
                // console.log(top_customers_chart_list_DF)
                if (is_init) {
                    InitOptionTopCustomersChart()
                }
                else {
                    $.fn.notifyB({description: "Get the latest top customers data successfully"}, 'success')
                    UpdateOptionTopCustomersChart()
                }
            })
    }

    AjaxTopCustomersChart()

    $('#btn-show-top-customers-chart').on('click', function() {
        UpdateOptionTopCustomersChart()
    })

    $('#top-customers-number').on('change', function() {
        UpdateOptionTopCustomersChart()
    })

    $('#top-customers-time').on('change', function() {
        UpdateOptionTopCustomersChart()
    })

    $('#reload-top-customers-data-btn').on('click', function() {
        AjaxTopCustomersChart(false)
    })
    
    // Top categories chart

    let top_categories_chart_list_DF = []
    let top_categories_chart_DF = null

    function CombineTopCategoriesChartData(show_billion, titleY="Revenue (million)", titleX="Category's name") {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let top_categories_chart_data = []
        for (const item of top_categories_chart_list_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth() + 1
            const year = dateApproved.getFullYear()
            const filterYear = parseInt($('#top-categories-year-filter').val())
            const filterMonth = parseInt($('#top-categories-month-filter').val())
            const filterQuarter = parseInt($('#top-categories-quarter-filter').val())
            const filterTimes = $('#top-categories-time').val()
            if (filterTimes === '0') {
                if (year === filterYear && month === filterMonth) {
                    top_categories_chart_data.push({
                        'id': item?.['product']?.['general_product_category']?.['id'],
                        'title': item?.['product']?.['general_product_category']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '1') {
                if (year === filterYear && parseInt(month/3) === filterQuarter) {
                    top_categories_chart_data.push({
                        'id': item?.['product']?.['general_product_category']?.['id'],
                        'title': item?.['product']?.['general_product_category']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else {
                if (year === filterYear) {
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
            }
            else {
                top_categories_chart_data_sum[item.id] = item
            }
        }
        top_categories_chart_data = Object.values(top_categories_chart_data_sum)

        top_categories_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = top_categories_chart_data.slice(0, $('#top-categories-number').val())
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
                formatter: function (val, opt) {
                    return val
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
                    show: true
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
        const isBillionChecked = $('#top-categories-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopCategoriesChartData(
            isBillionChecked,
            `Revenue (${unitText})`,
            "Category's name",
        )
        top_categories_chart_DF = new ApexCharts(document.querySelector("#top_categories_chart"), options);
        top_categories_chart_DF.render();
    }

    function UpdateOptionTopCategoriesChart() {
        const isBillionChecked = $('#top-categories-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopCategoriesChartData(
            isBillionChecked,
            `Revenue (${unitText})`,
            "Category's name",
        )
        top_categories_chart_DF.updateOptions(options)
    }

    function AjaxTopCategoriesChart(is_init=true) {
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
                // console.log(top_categories_chart_list_DF)
                if (is_init) {
                    InitOptionTopCategoriesChart()
                }
                else {
                    $.fn.notifyB({description: "Get the latest top categories data successfully"}, 'success')
                    UpdateOptionTopCategoriesChart()
                }
            })
    }

    AjaxTopCategoriesChart()

    $('#btn-show-top-categories-chart').on('click', function() {
        UpdateOptionTopCategoriesChart()
    })

    $('#top-categories-number').on('change', function() {
        UpdateOptionTopCategoriesChart()
    })

    $('#top-categories-time').on('change', function() {
        UpdateOptionTopCategoriesChart()
    })

    $('#reload-top-categories-data-btn').on('click', function() {
        AjaxTopCategoriesChart(false)
    })

    // Top products chart

    let top_products_chart_list_DF = []
    let top_products_chart_DF = null

    function CombineTopProductsChartData(show_billion, titleY="Revenue (million)", titleX="Product's name") {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let top_products_chart_data = []
        for (const item of top_products_chart_list_DF) {
            const dateApproved = new Date(item?.['date_approved'])
            const month = dateApproved.getMonth() + 1
            const year = dateApproved.getFullYear()
            const filterYear = parseInt($('#top-products-year-filter').val())
            const filterMonth = parseInt($('#top-products-month-filter').val())
            const filterQuarter = parseInt($('#top-products-quarter-filter').val())
            const filterTimes = $('#top-products-time').val()
            if (filterTimes === '0') {
                if (year === filterYear && month === filterMonth) {
                    top_products_chart_data.push({
                        'id': item?.['product']?.['id'],
                        'title': item?.['product']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else if (filterTimes === '1') {
                if (year === filterYear && parseInt(month/3) === filterQuarter) {
                    top_products_chart_data.push({
                        'id': item?.['product']?.['id'],
                        'title': item?.['product']?.['title'],
                        'revenue': (item?.['revenue'] ? item?.['revenue'] : 0) / cast_billion,
                    })
                }
            }
            else {
                if (year === filterYear) {
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
            }
            else {
                top_products_chart_data_sum[item.id] = item
            }
        }
        top_products_chart_data = Object.values(top_products_chart_data_sum)

        top_products_chart_data.sort((a, b) => b.revenue - a.revenue);
        let topX = top_products_chart_data.slice(0, $('#top-products-number').val())
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
            colors: ['#ba97d3'],
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
                formatter: function (val, opt) {
                    return val
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
                    show: true
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
        const isBillionChecked = $('#top-products-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopProductsChartData(
            isBillionChecked,
            `Revenue (${unitText})`,
            "Product's name",
        )
        top_products_chart_DF = new ApexCharts(document.querySelector("#top_products_chart"), options);
        top_products_chart_DF.render();
    }

    function UpdateOptionTopProductsChart() {
        const isBillionChecked = $('#top-products-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopProductsChartData(
            isBillionChecked,
            `Revenue (${unitText})`,
            "Product's name",
        )
        top_products_chart_DF.updateOptions(options)
    }

    function AjaxTopProductsChart(is_init=true) {
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
                // console.log(top_products_chart_list_DF)
                if (is_init) {
                    InitOptionTopProductsChart()
                }
                else {
                    $.fn.notifyB({description: "Get the latest top products data successfully"}, 'success')
                    UpdateOptionTopProductsChart()
                }
            })
    }

    AjaxTopProductsChart()

    $('#btn-show-top-products-chart').on('click', function() {
        UpdateOptionTopProductsChart()
    })

    $('#top-products-number').on('change', function() {
        UpdateOptionTopProductsChart()
    })

    $('#top-products-time').on('change', function() {
        UpdateOptionTopProductsChart()
    })

    $('#reload-top-products-data-btn').on('click', function() {
        AjaxTopProductsChart(false)
    })
})