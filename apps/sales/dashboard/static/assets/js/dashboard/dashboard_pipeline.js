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
            // console.log(resp.data[keyResp])
            return resp.data[keyResp]
        },
        data: (data ? data : null),
        keyResp: 'group_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        // UpdateOptionRevenueChart()
    })
}

LoadTotalPipelineGroup()

function CombineTotalPipelineChartData(show_billion, titleY="Stage", titleX='Total (million)') {
    let cast_billion = 1e6
    if (show_billion) {
        cast_billion = 1e9
    }

    const current_year = new Date().getFullYear()
    let total_pipeline_chart_data = []
    for (const item of total_pipeline_chart_list_DF) {
        if (
            item.opportunity?.['stage']?.['win_rate'] !== 0 &&
            item.opportunity?.['stage']?.['win_rate'] !== 100 &&
            new Date(item.opportunity?.['open_date']).getFullYear() === parseInt(totalPipelineYearFilterEle.val())
        ) {
            total_pipeline_chart_data.push({
                'id': item.opportunity?.['id'],
                'title': item.opportunity?.['title'],
                'value': item.opportunity?.['value'],
                'stage_indicator': item.opportunity?.['stage']?.['indicator']
            })
        }
    }

    let sortedData = total_pipeline_chart_data.sort(function(a, b) {
        return a.stage_indicator.localeCompare(b.stage_indicator);
    });

    let groupedData = {};
    sortedData.forEach(function(item) {
        let stage = item.stage_indicator;
        if (!groupedData[stage]) {
            groupedData[stage] = [];
        }
        groupedData[stage].push(item);
    });

    let list_stage_indicator = []
    let data_group_by_stage_indicator = []
    for (let stage in groupedData) {
        list_stage_indicator.push(stage)
        let sumValue = groupedData[stage].reduce((total, item) => total + item.value, 0);
        data_group_by_stage_indicator.push(sumValue / cast_billion)
    }

    return {
        series: [{
            data: data_group_by_stage_indicator
        }],
        chart: {
            type: 'bar',
            height: 230
        },
        colors: ['#307b8c'],
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
                return val
                // return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
            },
            offsetX: 0,
            dropShadow: {
                enabled: false
            }
        },
        xaxis: {
            categories: list_stage_indicator,
            labels: {
                show: true,
                formatter: function(val) {
                    return val.toFixed(3);
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
            text: `Total Pipeline Chart`,
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

function InitOptionTotalPipelineChart() {
    const isBillionChecked = totalPipelineBillionCheckboxEle.prop('checked')
    const unitText = isBillionChecked ? 'billion' : 'million'
    let options = CombineTotalPipelineChartData(
        isBillionChecked,
        'Stage',
        `Total (${unitText})`
    )
    total_pipeline_chart_DF = new ApexCharts(document.querySelector("#total_pipeline_chart"), options);
    total_pipeline_chart_DF.render();
}

function UpdateOptionTotalPipelineChart() {
    const isBillionChecked = totalPipelineBillionCheckboxEle.prop('checked')
    const unitText = isBillionChecked ? 'billion' : 'million'
    let options = CombineTotalPipelineChartData(
        isBillionChecked,
        'Stage',
        `Total (${unitText})`
    )
    total_pipeline_chart_DF.updateOptions(options)
}

function AjaxTotalPipelineChart(is_init=true) {
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
            totalPipelineYearFilterEle.val(new Date().getFullYear())
            if (is_init) {
                InitOptionTotalPipelineChart()
            }
            else {
                $.fn.notifyB({description: "Get the latest TotalPipeline data successfully"}, 'success')
                UpdateOptionTotalPipelineChart()
            }
        })
}

AjaxTotalPipelineChart()

$('.timechart-total-pipeline').on('change', function () {
    UpdateOptionTotalPipelineChart()
})
