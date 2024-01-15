$(document).ready(function () {
    let scriptUrlEle = $('#script-url')

    // Total pipeline chart
    const totalPipelineGroupEle = $('#total-pipeline-group')
    const totalPipelineYearFilterEle = $('#total-pipeline-year-filter')
    const totalPipelineBillionCheckboxEle = $('#total-pipeline-billion-checkbox')

    let total_pipeline_chart_list_DF = []
    let total_pipeline_chart_DF = null

    function LoadTotalPipelineGroup(data) {
        totalPipelineGroupEle.initSelect2({
            allowClear: true,
            ajax: {
                url: totalPipelineGroupEle.attr('data-url'),
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
            UpdateOptionTotalPipelineChart()
        })
    }

    LoadTotalPipelineGroup()

    function CombineTotalPipelineChartData(group_filter, show_billion, titleY = "Stage", titleX = 'Total (million)', chart_title='Total Pipeline Chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let total_pipeline_chart_data = []
        for (const item of total_pipeline_chart_list_DF) {
            const group_id = item?.['employee_inherit']?.['group_id']
            if (
                item.opportunity?.['stage']?.['win_rate'] !== 0 &&
                item.opportunity?.['stage']?.['win_rate'] !== 100 &&
                new Date(item.opportunity?.['open_date']).getFullYear() === parseInt(totalPipelineYearFilterEle.val())
            ) {
                if (!group_filter) {
                    total_pipeline_chart_data.push({
                        'id': item.opportunity?.['id'],
                        'title': item.opportunity?.['title'],
                        'value': item.opportunity?.['value'],
                        'stage_indicator': item.opportunity?.['stage']?.['indicator'],
                        'stage_win_rate': item.opportunity?.['stage']?.['win_rate']
                    })
                } else {
                    if (group_id === group_filter) {
                        total_pipeline_chart_data.push({
                            'id': item.opportunity?.['id'],
                            'title': item.opportunity?.['title'],
                            'value': item.opportunity?.['value'],
                            'stage_indicator': item.opportunity?.['stage']?.['indicator'],
                            'stage_win_rate': item.opportunity?.['stage']?.['win_rate']
                        })
                    }
                }
            }
        }

        let sortedDataByIndicator = total_pipeline_chart_data.sort(function (a, b) {
            return a.stage_indicator.localeCompare(b.stage_indicator);
        });

        let groupedData = {};
        sortedDataByIndicator.forEach(function (item) {
            let stage = item.stage_indicator;
            if (!groupedData[stage]) {
                groupedData[stage] = [];
            }
            groupedData[stage].push(item);
        });

        let list_stage_indicator = []
        let data_group_by_stage_indicator = []
        let data_winrate = []
        for (let stage in groupedData) {
            list_stage_indicator.push(stage)
            let sumValue = groupedData[stage].reduce((total, item) => total + item.value, 0);
            data_group_by_stage_indicator.push(sumValue / cast_billion)
            let wr_temp = groupedData[stage].reduce((wr, item) => wr = item.stage_win_rate, 0);
            data_winrate.push(wr_temp)
        }

        let sortedDataBy_data_winrate = data_winrate.map((item, index) => ({
            data_winrate: item,
            list_stage_indicator: list_stage_indicator[index],
            data_group_by_stage_indicator: data_group_by_stage_indicator[index]
        })).sort(
            (obj1, obj2) => obj1.data_winrate - obj2.data_winrate
        );

        list_stage_indicator = sortedDataBy_data_winrate.map(
            item => item.list_stage_indicator
        );
        data_group_by_stage_indicator = sortedDataBy_data_winrate.map(
            item => item.data_group_by_stage_indicator
        );
        data_winrate = sortedDataBy_data_winrate.map(
            item => item.data_winrate
        );

        let list_stage_indicator_new = []
        for (let i = 0; i < list_stage_indicator.length; i++) {
            list_stage_indicator_new.push(`${list_stage_indicator[i]} (${data_winrate[i].toString()}%)`)
        }

        return {
            series: [{
                data: data_group_by_stage_indicator
            }],
            chart: {
                type: 'bar',
                height: 230,
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
                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'center'
                    },
                    borderRadius: 4,
                }
            },
            colors: [
                '#4885e1', '#93852d', '#ff5e5e', '#63d75d',
                '#a92c0d', '#02375b', '#83108f', '#334907',
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
                categories: list_stage_indicator_new,
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
            }
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

    function AjaxTotalPipelineChart(is_init = true) {
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
                console.log(total_pipeline_chart_list_DF)
                totalPipelineYearFilterEle.val(new Date().getFullYear())
                if (is_init) {
                    InitOptionTotalPipelineChart()
                } else {
                    $.fn.notifyB({description: "Get the latest total pipeline data successfully"}, 'success')
                    UpdateOptionTotalPipelineChart()
                }
            })
    }

    AjaxTotalPipelineChart()

    $('.timechart-total-pipeline').on('change', function () {
        UpdateOptionTotalPipelineChart()
    })

    $('#reload-total-pipeline-data-btn').on('click', function () {
        AjaxTotalPipelineChart(false)
    })
})
