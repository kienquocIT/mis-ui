$(document).ready(function () {
    let scriptUrlEle = $('#script-url')

    // Revenue chart

    let revenue_chart_list_DF = []
    let revenue_chart_DF = null
    let revenue_expected_data_DF = [5.0e+9, 5.0e+9, 6.0e+9, 7.0e+9, 6.0e+9, 5.0e+9, 6.0e+9, 5.0e+9, 6.0e+9, 5.2e+9, 5.4e+9, 6.0e+9,]

    function LoadRevenueGroup(data) {
        $('#revenue-group').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#revenue-group').attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                console.log(resp.data[keyResp])
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

    function CombineRevenueChartDataPeriod(group_filter, show_billion, titleY='Revenue value (million)', titleX='Month') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let revenue_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of revenue_chart_list_DF) {
            const group_id = item?.['sale_order']?.['group']?.['id']
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
        for (let i = 0; i < revenue_chart_data.length; i++) {
            if (revenue_chart_data[i] <= 0) {
                revenue_chart_data[i] = 4e+9 / cast_billion
            }
        }

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
                height: 300,
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
            }
        };
    }

    function CombineRevenueChartDataAccumulated(group_filter, show_billion, titleY='Revenue value (million)', titleX='Month') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }
        let revenue_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of revenue_chart_list_DF) {
            const group_id = item?.['sale_order']?.['group']?.['id']
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
        for (let i = 0; i < revenue_chart_data.length; i++) {
            if (revenue_chart_data[i] <= 0) {
                revenue_chart_data[i] = 4e+9 / cast_billion
            }
        }
        for (let i = 0; i < revenue_chart_data.length; i++) {
            let last_sum = 0
            for (let j = 0; j <= i; j++) {
                last_sum += revenue_chart_data[j]
            }
            revenue_chart_data[i] = last_sum
        }

        let revenue_expected_data = []
        for (let i = 0; i < revenue_expected_data_DF.length; i++) {
            revenue_expected_data.push(revenue_expected_data_DF[i] / cast_billion)
        }
        for (let i = 0; i < revenue_expected_data.length; i++) {
            let last_sum = 0
            for (let j = 0; j <= i; j++) {
                last_sum += revenue_expected_data[j]
            }
            revenue_expected_data[i] = last_sum
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
                height: 300,
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
            }
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
                `Revenue value (${unitText})`
            )
            revenue_chart_DF = new ApexCharts(document.querySelector("#revenue_chart"), options);
            revenue_chart_DF.render();
        }
        else {
            let options = CombineRevenueChartDataAccumulated(
                group,
                isBillionChecked,
                `Revenue value (${unitText})`
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
                `Revenue value (${unitText})`
            )
            revenue_chart_DF.updateOptions(options)
        }
        else {
            let options = CombineRevenueChartDataAccumulated(
                group,
                isBillionChecked,
                `Revenue value (${unitText})`
            )
            revenue_chart_DF.updateOptions(options)
        }
    }

    function AjaxRevenueChart(is_init=true) {
        let revenue_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-report-revenue-list'),
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
    let profit_expected_data_DF = [2.5e+9, 3.0e+9, 2.5e+9, 2.5e+9, 2.5e+9, 1.5e+9, 3.0e+9, 3.0e+9, 2.5e+9, 3.2e+9, 2.4e+9, 3.0e+9,]

    function LoadProfitGroup(data) {
        $('#profit-group').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#profit-group').attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                console.log(resp.data[keyResp])
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

    function CombineProfitChartDataPeriod(group_filter, show_billion, titleY='Revenue value (million)', titleX='Month') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let profit_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of profit_chart_list_DF) {
            const group_id = item?.['sale_order']?.['group']?.['id']
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
        for (let i = 0; i < profit_chart_data.length; i++) {
            if (profit_chart_data[i] <= 0) {
                profit_chart_data[i] = 2e+9 / cast_billion
            }
        }

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
                height: 300,
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
            }
        };
    }

    function CombineProfitChartDataAccumulated(group_filter, show_billion, titleY='Revenue value (million)', titleX='Month') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }
        let profit_chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (const item of profit_chart_list_DF) {
            const group_id = item?.['sale_order']?.['group']?.['id']
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
        for (let i = 0; i < profit_chart_data.length; i++) {
            if (profit_chart_data[i] <= 0) {
                profit_chart_data[i] = 2e+9 / cast_billion
            }
        }
        for (let i = 0; i < profit_chart_data.length; i++) {
            let last_sum = 0
            for (let j = 0; j <= i; j++) {
                last_sum += profit_chart_data[j]
            }
            profit_chart_data[i] = last_sum
        }

        let profit_expected_data = []
        for (let i = 0; i < profit_expected_data_DF.length; i++) {
            profit_expected_data.push(profit_expected_data_DF[i] / cast_billion)
        }
        for (let i = 0; i < profit_expected_data.length; i++) {
            let last_sum = 0
            for (let j = 0; j <= i; j++) {
                last_sum += profit_expected_data[j]
            }
            profit_expected_data[i] = last_sum
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
                height: 300,
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
            }
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
                `Profit value (${unitText})`
            )
            profit_chart_DF = new ApexCharts(document.querySelector("#profit_chart"), options);
            profit_chart_DF.render();
        }
        else {
            let options = CombineProfitChartDataAccumulated(
                group,
                isBillionChecked,
                `Profit value (${unitText})`
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
                `Profit value (${unitText})`
            )
            profit_chart_DF.updateOptions(options)
        }
        else {
            let options = CombineProfitChartDataAccumulated(
                group,
                isBillionChecked,
                `Profit value (${unitText})`
            )
            profit_chart_DF.updateOptions(options)
        }
    }

    function AjaxProfitChart(is_init=true) {
        let profit_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-report-revenue-list'),
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
                console.log(profit_chart_list_DF)
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
})