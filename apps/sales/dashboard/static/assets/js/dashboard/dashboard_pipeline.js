$(document).ready(function () {
    let scriptUrlEle = $('#script-url')
    let FROM = 0
    let TO = 10

    // Total pipeline chart

    const totalPipelineGroupEle = $('#total-pipeline-group')
    const totalPipelineYearFilterEle = $('#total-pipeline-year-filter')
    const totalPipelineBillionCheckboxEle = $('#total-pipeline-billion-checkbox')

    let total_pipeline_chart_list_DF = []
    let total_pipeline_chart_DF = null
    let top_sale_by_total_pipeline_chart_list_DF = null
    let customer_activities_pipeline_chart_list_DF = null
    let stage_id_DF = null
    let stage_indicator_DF = null
    let stage_dict_DF = null

    function LoadTotalPipelineGroup(data) {
        totalPipelineGroupEle.initSelect2({
            allowClear: true,
            ajax: {
                url: totalPipelineGroupEle.attr('data-url'),
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
            UpdateOptionTotalPipelineChart()
            UpdateOptionTopSaleByTotalPipelineChart(0, 3)
        })
    }

    LoadTotalPipelineGroup()

    function CombineTotalPipelineChartData(group_filter, show_billion, titleY = "Stage", titleX = 'Total (million)', chart_title='Total Pipeline Chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let data_process = []
        for (const item of total_pipeline_chart_list_DF) {
            let employee_group_id = null
            if (group_filter) {
                employee_group_id = item?.['employee_inherit']?.['group_id']
            }
            let stage_id = item?.['opportunity']?.['stage']?.['id']
            let stage_winrate = item?.['opportunity']?.['stage']?.['win_rate']
            let stage_title = `${item?.['opportunity']?.['stage']?.['indicator']} (${item?.['opportunity']?.['stage']?.['win_rate']}%)`
            data_process.push({
                'employee_id': item?.['employee_inherit']?.['id'],
                'employee_fullname': item?.['employee_inherit']?.['full_name'],
                'employee_group_id': employee_group_id,
                'opp_stage_id': stage_id,
                'opp_stage_title': stage_title,
                'opp_stage_winrate': stage_winrate,
                'opp_open_date': item?.['opportunity']?.['open_date'],
                'opp_close_date': item?.['opportunity']?.['close_date'],
                'forecast_value': item?.['opportunity']?.['forecast_value'],
                'value': item?.['opportunity']?.['value'],
            })
        }

        // console.log(data_process)

        const data_stage_value_dict = {};
        data_process.forEach(item => {
            const oppStageId = item.opp_stage_id;
            if (
                item.opp_stage_winrate !== 0
                && item.opp_stage_winrate !== 100
                && item.employee_group_id === group_filter
                && new Date(item.opp_open_date).getFullYear() === parseInt(totalPipelineYearFilterEle.val())
            ) {
                if (!data_stage_value_dict[oppStageId]) {
                    data_stage_value_dict[oppStageId] = {
                        opp_stage_id: oppStageId,
                        opp_stage_title: item.opp_stage_title,
                        opp_stage_winrate: item.opp_stage_winrate,
                        value: 0
                    };
                }

                data_stage_value_dict[oppStageId].value += item.value || 0;
            }
        });

        let data_stage_value_list = Object.values(data_stage_value_dict);
        data_stage_value_list = data_stage_value_list.filter(item => item.value !== 0);
        data_stage_value_list.sort((a, b) => a.opp_stage_winrate - b.opp_stage_winrate);

        let stage_id = []
        let stage_indicator = []
        let stage_value = []
        let stage_dict = []
        for (const item of data_stage_value_list) {
            stage_id.push(item.opp_stage_id)
            stage_indicator.push(item.opp_stage_title)
            stage_value.push(item.value / cast_billion)
            stage_dict.push({
                'stage_id': item.opp_stage_id,
                'stage_indicator': item.opp_stage_title
            })
        }
        stage_id_DF = stage_id
        stage_indicator_DF = stage_indicator
        stage_dict_DF = stage_dict

        return {
            series: [{
                data: stage_value
            }],
            chart: {
                type: 'bar',
                height: 400,
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 200
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 300
                    }
                }
            },
            plotOptions: {
                bar: {
                    barHeight: '80%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'center'
                    }
                }
            },
            colors: [
                '#3932ff', '#009b50', '#a88500', '#ce007b',
                '#ff5e5e', '#b9ec8f', '#e3b388', '#3d3aaf',
            ],
            dataLabels: {
                enabled: true,
                // textAnchor: 'start',
                style: {
                    colors: ['#fff']
                },
                formatter: function (val) {
                    return val
                    // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: false
                }
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            xaxis: {
                categories: stage_indicator,
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(3)
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
                align: 'left',
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function () {
                            return ''
                        }
                    }
                }
            },
            legend: {
                show: false
            },
        };
    }

    function InitOptionTotalPipelineChart() {
        let group = totalPipelineGroupEle.val()
        const isBillionChecked = totalPipelineBillionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTotalPipelineChartData(
            group,
            isBillionChecked,
            '',
            `Total (${unitText})`,
            `Total Pipeline Chart of Company in ${totalPipelineYearFilterEle.val()}`
        )
        $('#total-pipeline-spinner').prop('hidden', true)
        total_pipeline_chart_DF = new ApexCharts(document.querySelector("#total_pipeline_chart"), options);
        total_pipeline_chart_DF.render();
    }

    function UpdateOptionTotalPipelineChart() {
        let group = totalPipelineGroupEle.val()
        let group_title = SelectDDControl.get_data_from_idx(totalPipelineGroupEle, totalPipelineGroupEle.val())['title']
        if (!group_title) {
            group_title = 'Company'
        }
        const isBillionChecked = totalPipelineBillionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTotalPipelineChartData(
            group,
            isBillionChecked,
            '',
            `Total (${unitText})`,
            `Total Pipeline Chart of ${group_title} in ${totalPipelineYearFilterEle.val()}`
        )
        total_pipeline_chart_DF.updateOptions(options)
    }

    function AjaxTotalPipelineChart() {
        let TotalPipeline_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-pipeline-list'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('report_pipeline_list')) {
                    return data?.['report_pipeline_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            })

        Promise.all([TotalPipeline_chart_ajax]).then(
            (results) => {
                total_pipeline_chart_list_DF = results[0];
                // console.log(total_pipeline_chart_list_DF)
                totalPipelineYearFilterEle.val(new Date().getFullYear())
                $('#customer-activities-year').val(new Date().getFullYear())
                $('#forecast-year').val(new Date().getFullYear())
                InitOptionTotalPipelineChart()
                InitOptionTopSaleByTotalPipelineChart()
                InitOptionCustomerActivitiesPipelineChart()
                InitOptionForecastChart()
            })
    }

    AjaxTotalPipelineChart()

    $('.timechart-total-pipeline').on('change', function () {
        UpdateOptionTotalPipelineChart()
        TOP_FROM = 0
        TOP_TO = 5
        UpdateOptionTopSaleByTotalPipelineChart(0, 5)
    })

    // Top sale by total pipeline chart

    let series_data_DF = null
    let employee_fullname_list_DF = null
    let TOP_FROM = 0
    let TOP_TO = 5

    function ProcessDataTopSale(group_filter, show_billion, from, to) {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let data_process = []
        for (const item of total_pipeline_chart_list_DF) {
            let stage_id = item?.['opportunity']?.['stage']?.['id']
            let stage_winrate = item?.['opportunity']?.['stage']?.['win_rate']
            let stage_title = `${item?.['opportunity']?.['stage']?.['indicator']} (${item?.['opportunity']?.['stage']?.['win_rate']}%)`
            data_process.push({
                'employee_id': item?.['employee_inherit']?.['id'],
                'employee_fullname': item?.['employee_inherit']?.['full_name'],
                'employee_group_id': item?.['employee_inherit']?.['group_id'],
                'opp_stage_id': stage_id,
                'opp_stage_title': stage_title,
                'opp_stage_winrate': stage_winrate,
                'opp_open_date': item?.['opportunity']?.['open_date'],
                'value': item?.['opportunity']?.['value'],
            })
        }

        data_process.forEach(item => {
            for (const stage_indicator of stage_indicator_DF) {
                if (item.opp_stage_title === stage_indicator) {
                    item[stage_indicator] = item.value
                }
                else {
                    item[stage_indicator] = 0
                }
            }
        })

        const employee_data_merge_dict = {};

        data_process.forEach(item => {
            const employee_id = item.employee_id;

            if (!employee_data_merge_dict[employee_id]) {
                employee_data_merge_dict[employee_id] = {
                    employee_id: employee_id,
                    employee_fullname: item.employee_fullname,
                    employee_group_id: item.employee_group_id,
                    sum_value: 0
                };
                for (const stage_indicator of stage_indicator_DF) {
                    employee_data_merge_dict[employee_id][stage_indicator] = 0
                }
            }

            let sum_value = 0
            for (const stage_indicator of stage_indicator_DF) {
                employee_data_merge_dict[employee_id][stage_indicator] += item[stage_indicator] || 0
                sum_value += employee_data_merge_dict[employee_id][stage_indicator]
            }
            employee_data_merge_dict[employee_id].sum_value = sum_value
        });

        let employee_data_merge_list = Object.values(employee_data_merge_dict);

        if (group_filter) {
            employee_data_merge_list = employee_data_merge_list.filter(item => item.employee_group_id === group_filter)
        }

        employee_data_merge_list.sort((a, b) => b.sum_value - a.sum_value);
        employee_data_merge_list = employee_data_merge_list.slice(from, to)

        // console.log(employee_data_merge_list)

        let series_data = []
        for (const stage_indicator of stage_indicator_DF) {
            let data = []
            for (const item of employee_data_merge_list) {
                data.push(item[stage_indicator] / cast_billion)
            }
            series_data.push({
                'name': stage_indicator,
                'data': data
            })
        }

        series_data_DF = series_data

        let employee_fullname_list = []
        for (const item of employee_data_merge_list) {
            employee_fullname_list.push(item['employee_fullname'])
        }

        employee_fullname_list_DF = employee_fullname_list

        return [series_data, employee_fullname_list_DF]
    }

    function CombineTopSaleByTotalPipelineChartData(titleY = "Stage", titleX = 'Total (million)', chart_title='Top sale by Total Pipeline Chart') {
        return {
            series: series_data_DF,
            chart: {
                type: 'bar',
                height: 400,
                stacked: true,
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 200
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 300
                    }
                }
            },
            colors: [
                '#3932ff', '#009b50', '#a88500', '#ce007b',
                '#ff5e5e', '#b9ec8f', '#e3b388', '#3d3aaf',
            ],
            plotOptions: {
                bar: {
                    barHeight: '80%',
                    distributed: false,
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 10,
                            formatter: function (val) {
                                if (val) {
                                    return val.toFixed(3)
                                } else {
                                    return val
                                }
                            },
                        }
                    }
                }
            },
            xaxis: {
                categories: employee_fullname_list_DF,
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(3)
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
                align: 'left',
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (val) {
                            return ''
                        }
                    },
                }
            }
        };
    }

    function InitOptionTopSaleByTotalPipelineChart() {
        let group = totalPipelineGroupEle.val()
        const isBillionChecked = totalPipelineBillionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        ProcessDataTopSale(group, isBillionChecked, 0, 5)
        let options = CombineTopSaleByTotalPipelineChartData(
            '',
            `Total (${unitText})`,
            `Top sale by Total Pipeline Chart of Company in ${totalPipelineYearFilterEle.val()}`
        )
        $('#top-sale-by-total-pipeline-spinner').prop('hidden', true)
        top_sale_by_total_pipeline_chart_list_DF = new ApexCharts(document.querySelector("#top_sale_by_total_pipeline_chart"), options);
        top_sale_by_total_pipeline_chart_list_DF.render();
    }

    function UpdateOptionTopSaleByTotalPipelineChart(from, to) {
        let group = totalPipelineGroupEle.val()
        let group_title = SelectDDControl.get_data_from_idx(totalPipelineGroupEle, totalPipelineGroupEle.val())['title']
        if (!group_title) {
            group_title = 'Company'
        }
        const isBillionChecked = totalPipelineBillionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        ProcessDataTopSale(group, isBillionChecked, from, to)
        let options = CombineTopSaleByTotalPipelineChartData(
            '',
            `Total (${unitText})`,
            `Top sale by Total Pipeline Chart of ${group_title} in ${totalPipelineYearFilterEle.val()}`
        )
        top_sale_by_total_pipeline_chart_list_DF.updateOptions(options)
    }

    $('#top-next').on('click', function () {
        if (TOP_FROM < employee_fullname_list_DF.length) {
            TOP_FROM += 5
            TOP_TO += 5
            UpdateOptionTopSaleByTotalPipelineChart(TOP_FROM, TOP_TO)
        }
    })

    $('#top-previous').on('click', function () {
        if (TOP_FROM > 0) {
            TOP_FROM -= 5
            TOP_TO -= 5
            UpdateOptionTopSaleByTotalPipelineChart(TOP_FROM, TOP_TO)
        }
    })

    // Forecast chart

    function LoadForeCastGroup(data) {
        $('#forecast-group').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#forecast-group').attr('data-url'),
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
            UpdateOptionForecastChart(parseInt($('#forecast-type').val()))
        })
    }

    LoadForeCastGroup()

    let forecast_chart_list_DF = null

    function CombineForecastMonthChartData(group_filter, show_billion, titleY = "Month", titleX = 'Total (million)', chart_title='Forecast value chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let data_process = []
        for (const item of total_pipeline_chart_list_DF) {
            let stage_winrate = item?.['opportunity']?.['stage']?.['win_rate']
            data_process.push({
                'group_id': item?.['employee_inherit']?.['group_id'],
                'opp_stage_winrate': stage_winrate,
                'opp_id': item?.['opportunity']?.['id'],
                'opp_close_date': item?.['opportunity']?.['close_date'],
                'forecast_value': item?.['opportunity']?.['forecast_value'],
            })
        }

        if (group_filter) {
            data_process = data_process.filter(item => item.group_id === group_filter)
        }

        let all_data_year = {}
        for (let i = 0; i < 12; i++) {
            let winrate_100 = 0
            let winrate_70s = 0
            let winrate_70g = 0
            for (const item of data_process) {
                if (
                    new Date(item.opp_close_date).getMonth() === i
                    && new Date(item.opp_close_date).getFullYear() === parseInt($('#forecast-year').val())
                ) {
                    if (item?.['opp_stage_winrate'] === 100) {
                        winrate_100 += item.forecast_value
                    } else if (item?.['opp_stage_winrate'] <= 70) {
                        winrate_70s += item.forecast_value
                    } else if (item?.['opp_stage_winrate'] > 70 && item?.['opp_stage_winrate'] < 100) {
                        winrate_70g += item.forecast_value
                    }
                }
            }
            all_data_year[`${i+1}`] = {
                'group_1': winrate_70s / cast_billion,
                'group_2': winrate_70g / cast_billion,
                'group_3': winrate_100 / cast_billion
            }
        }

        let group_1_list = []
        let group_2_list = []
        let group_3_list = []
        for (let i = 0; i < 12; i++) {
            group_1_list.push(all_data_year[i+1]['group_1'])
            group_2_list.push(all_data_year[i+1]['group_2'])
            group_3_list.push(all_data_year[i+1]['group_3'])
        }

        return {
            series: [{
                name: '<= 70%',
                data: group_1_list
            }, {
                name: '> 70%',
                data: group_2_list
            }, {
                name: '100%',
                data: group_3_list
            }],
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 200
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 300
                    }
                }
            },
            colors: [
                '#4885e1', '#69d5a0', '#007a3e'
            ],
            plotOptions: {
                bar: {
                    barHeight: '80%',
                    distributed: false,
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 10,
                            formatter: function (val) {
                                if (val) {
                                    return val.toFixed(3)
                                } else {
                                    return val
                                }
                            },
                        }
                    }
                }
            },
            xaxis: {
                categories: [
                    'Jan','Feb','Mar',
                    'Apr','May','Jun',
                    'Jul','Aug','Sep',
                    'Oct','Nov','Dec'
                ],
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(3)
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
                align: 'left',
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (val) {
                            return ''
                        }
                    },
                }
            }
        };
    }

    function CombineForecastQuarterChartData(group_filter, show_billion, titleY = "Month", titleX = 'Total (million)', chart_title='Forecast value chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let data_process = []
        for (const item of total_pipeline_chart_list_DF) {
            let stage_winrate = item?.['opportunity']?.['stage']?.['win_rate']
            data_process.push({
                'group_id': item?.['employee_inherit']?.['group_id'],
                'opp_stage_winrate': stage_winrate,
                'opp_close_date': item?.['opportunity']?.['close_date'],
                'forecast_value': item?.['opportunity']?.['forecast_value'],
            })
        }

        if (group_filter) {
            data_process = data_process.filter(item => item.group_id === group_filter)
        }

        let all_data_year = {}
        for (let i = 0; i < 12; i++) {
            let winrate_100 = 0
            let winrate_70s = 0
            let winrate_70g = 0
            for (const item of data_process) {
                if (
                    new Date(item.opp_close_date).getMonth() === i
                    && new Date(item.opp_close_date).getFullYear() === parseInt($('#forecast-year').val())
                ) {
                    if (item?.['opp_stage_winrate'] === 100) {
                        winrate_100 += item.forecast_value
                    } else if (item?.['opp_stage_winrate'] <= 70) {
                        winrate_70s += item.forecast_value
                    } else if (item?.['opp_stage_winrate'] > 70 && item?.['opp_stage_winrate'] < 100) {
                        winrate_70g += item.forecast_value
                    }
                }
            }
            all_data_year[`${i+1}`] = {
                'group_1': winrate_70s / cast_billion,
                'group_2': winrate_70g / cast_billion,
                'group_3': winrate_100 / cast_billion
            }
        }

        let group_1_list = []
        let group_2_list = []
        let group_3_list = []
        for (let i = 0; i < 12; i++) {
            group_1_list.push(all_data_year[i+1]['group_1'])
            group_2_list.push(all_data_year[i+1]['group_2'])
            group_3_list.push(all_data_year[i+1]['group_3'])
        }

        let group_1_list_quarter = [];
        let group_2_list_quarter = [];
        let group_3_list_quarter = [];

        for (let i = 0; i < group_1_list.length; i += 3) {
            group_1_list_quarter.push(group_1_list.slice(i, i + 3).reduce((sum, value) => sum + value, 0).toFixed(3));
            group_2_list_quarter.push(group_2_list.slice(i, i + 3).reduce((sum, value) => sum + value, 0).toFixed(3));
            group_3_list_quarter.push(group_3_list.slice(i, i + 3).reduce((sum, value) => sum + value, 0).toFixed(3));
        }

        return {
            series: [{
                name: '<= 70%',
                data: group_1_list_quarter
            }, {
                name: '> 70%',
                data: group_2_list_quarter
            }, {
                name: '100%',
                data: group_3_list_quarter
            }],
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 200
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 300
                    }
                }
            },
            colors: [
                '#4885e1', '#69d5a0', '#007a3e'
            ],
            plotOptions: {
                bar: {
                    barHeight: '80%',
                    distributed: false,
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 10,
                            formatter: function (val) {
                                if (val) {
                                    return val.toFixed(3)
                                } else {
                                    return val
                                }
                            },
                        }
                    }
                }
            },
            xaxis: {
                categories: ['1','2','3','4'],
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val) {
                            return val.toFixed(3)
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
                align: 'left',
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: false
                },
                y: {
                    title: {
                        formatter: function (val) {
                            return ''
                        }
                    },
                }
            }
        };
    }

    function InitOptionForecastChart() {
        const isBillionChecked = $('#forecast-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineForecastMonthChartData(
            null,
            isBillionChecked,
            'Month',
            `Total (${unitText})`,
            'Forecast value chart'
        )
        $('#forecast-pipeline-spinner').prop('hidden', true)
        forecast_chart_list_DF = new ApexCharts(document.querySelector("#forecast_pipeline_chart"), options);
        forecast_chart_list_DF.render();
    }

    function UpdateOptionForecastChart(type=0) {
        let group = $('#forecast-group').val()
        const isBillionChecked = $('#forecast-billion-checkbox').prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        if (type === 0) {
            let options = CombineForecastMonthChartData(
                group,
                isBillionChecked,
                'Month',
                `Total (${unitText})`,
                'Forecast value chart'
            )
            forecast_chart_list_DF.updateOptions(options)
        }
        else {
            let options = CombineForecastQuarterChartData(
                group,
                isBillionChecked,
                'Quarter',
                `Total (${unitText})`,
                'Forecast value chart'
            )
            forecast_chart_list_DF.updateOptions(options)
        }
    }

    $('#forecast-year').on('change', function () {
        UpdateOptionForecastChart()
    })

    $('#forecast-type').on('change', function () {
        UpdateOptionForecastChart(parseInt($(this).val()))
    })

    $('.timechart-forecast').on('change', function () {
        UpdateOptionForecastChart(parseInt($('#forecast-type').val()))
    })

    // Customer activities chart

    const customerActivitiesMonthEle = $('#customer-activities-month')
    let customer_title_chart_data_DF = []
    let call_chart_data_DF = []
    let email_chart_data_DF = []
    let meeting_chart_data_DF = []
    let document_chart_data_DF = []

    function ProcessDataCustomerActivities() {
        let activities_data = []
        for (const item of total_pipeline_chart_list_DF) {
            let month_filter = parseInt(customerActivitiesMonthEle.val())
            let flag_month = true
            if (month_filter !== 0) {
                flag_month = new Date(item?.['opportunity']?.['open_date']).getMonth() + 1 === month_filter
            }
            if (
                flag_month &&
                new Date(item?.['opportunity']?.['open_date']).getFullYear() === parseInt($('#customer-activities-year').val())
            ) {
                activities_data.push({
                    'id': item?.['opportunity']['customer']['id'],
                    'title': item?.['opportunity']['customer']['title'],
                    'call': item?.['opportunity']['call'],
                    'email': item?.['opportunity']['email'],
                    'meeting': item?.['opportunity']['meeting'],
                    'document': item?.['opportunity']['document']
                })
            }
        }

        const activities_data_merge_dict = {};

        activities_data.forEach(item => {
            const id = item.id;

            // Nếu id chưa có trong đối tượng totalsById, tạo một đối tượng mới
            if (!activities_data_merge_dict[id]) {
                activities_data_merge_dict[id] = {
                    id: id,
                    title: item.title,
                    call: 0,
                    email: 0,
                    meeting: 0,
                    document: 0,
                    sum_activities: 0
                };
            }

            // Cập nhật giá trị
            activities_data_merge_dict[id].call += item.call || 0;
            activities_data_merge_dict[id].email += item.email || 0;
            activities_data_merge_dict[id].meeting += item.meeting || 0;
            activities_data_merge_dict[id].document += item.document || 0;
            activities_data_merge_dict[id].sum_activities = activities_data_merge_dict[id].call + activities_data_merge_dict[id].email + activities_data_merge_dict[id].meeting + activities_data_merge_dict[id].document;
        });

        const activities_data_merge_list = Object.values(activities_data_merge_dict);
        activities_data_merge_list.sort((a, b) => b.sum_activities - a.sum_activities);

        for (let i = 0; i < activities_data_merge_list.length; i++) {
            if (activities_data_merge_list[i]['call'] + activities_data_merge_list[i]['email'] + activities_data_merge_list[i]['meeting'] + activities_data_merge_list[i]['document'] > 0) {
                customer_title_chart_data_DF.push(activities_data_merge_list[i]['title'])
                call_chart_data_DF.push(activities_data_merge_list[i]['call'])
                email_chart_data_DF.push(activities_data_merge_list[i]['email'])
                meeting_chart_data_DF.push(activities_data_merge_list[i]['meeting'])
                document_chart_data_DF.push(activities_data_merge_list[i]['document'])
            }
        }

        return true
    }

    function CombineCustomerActivitiesPipelineChartData(titleX='Times', titleY='Customers', chart_title='Top customer activities chart', from=0, to=10) {
        return {
            series: [{
                name: 'Call',
                data: call_chart_data_DF.slice(from, to)
            }, {
                name: 'Email',
                data: email_chart_data_DF.slice(from, to)
            }, {
                name: 'Meeting',
                data: meeting_chart_data_DF.slice(from, to)
            }, {
                name: 'Document',
                data: document_chart_data_DF.slice(from, to)
            }],
            chart: {
                type: 'bar',
                height: 280,
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true,
                },
                animations: {
                    enabled: true,
                    easing: 'linear',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 200
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 300
                    }
                }
            },
            colors: [
                '#ff9090', '#69d5a0', '#74acff', '#b6b6b6'
            ],
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }],
            plotOptions: {
                bar: {
                    barHeight: '80%',
                    distributed: false,
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            formatter: function (val) {
                                return val
                            },
                        }
                    }
                }
            },
            xaxis: {
                categories: customer_title_chart_data_DF.slice(from, to),
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
                align: 'left',
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    formatter: function (val) {
                        return val
                    },
                    title: {
                        formatter: function (val) {
                            return val + ':'
                        }
                    },
                }
            },
            legend: {
                position: 'right',
                offsetY: 40
            },
        };
    }

    function InitOptionCustomerActivitiesPipelineChart() {
        ProcessDataCustomerActivities()
        let options = CombineCustomerActivitiesPipelineChartData(
            'Times',
            '',
            'Top customer activities chart',
            0,
            10
        )
        customer_activities_pipeline_chart_list_DF = new ApexCharts(document.querySelector("#customer_activities_pipeline_chart"), options);
        customer_activities_pipeline_chart_list_DF.render();
    }

    function UpdateOptionCustomerActivitiesPipelineChart(from, to) {
        let options = CombineCustomerActivitiesPipelineChartData(
            'Times',
            '',
            'Top customer activities chart',
            from,
            to
        )
        customer_activities_pipeline_chart_list_DF.updateOptions(options)
    }

    $('#next').on('click', function () {
        if (FROM < customer_title_chart_data_DF.length) {
            FROM += 10
            TO += 10
            UpdateOptionCustomerActivitiesPipelineChart(FROM, TO)
        }
    })

    $('#previous').on('click', function () {
        if (FROM > 0) {
            FROM -= 10
            TO -= 10
            UpdateOptionCustomerActivitiesPipelineChart(FROM, TO)
        }
    })

    $('#customer-activities-year').on('change', function () {
        FROM = 0
        TO = 10
        customer_title_chart_data_DF = []
        call_chart_data_DF = []
        email_chart_data_DF = []
        meeting_chart_data_DF = []
        document_chart_data_DF = []
        ProcessDataCustomerActivities()
        UpdateOptionCustomerActivitiesPipelineChart(0, 10)
    })

    customerActivitiesMonthEle.on('change', function () {
        FROM = 0
        TO = 10
        customer_title_chart_data_DF = []
        call_chart_data_DF = []
        email_chart_data_DF = []
        meeting_chart_data_DF = []
        document_chart_data_DF = []
        ProcessDataCustomerActivities()
        UpdateOptionCustomerActivitiesPipelineChart(0, 10)
    })
})
