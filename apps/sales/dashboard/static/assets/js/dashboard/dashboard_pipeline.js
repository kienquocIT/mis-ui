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
            UpdateOptionTopSaleByTotalPipelineChart()
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
                }
            },
            colors: [
                '#4885e1', '#706f6f', '#ff5e5e', '#63d75d',
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
                        if (val && titleX.split(' ')[1][1] === 'b') {
                            val = val.toFixed(3)
                        }
                        return `${val}${titleX.split(' ')[1][1].toUpperCase()}`
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
                    show: true
                },
                y: {
                    title: {
                        formatter: function () {
                            return ''
                        }
                    },
                    formatter: function (val) {
                        if (val && titleX.split(' ')[1][1] === 'b') {
                            val = val.toFixed(3)
                        }
                        return `${val}${titleX.split(' ')[1][1].toUpperCase()}`
                    }
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
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
                $('#customer-activities-year').val(new Date().getFullYear())
                if (is_init) {
                    InitOptionTotalPipelineChart()
                    InitOptionTopSaleByTotalPipelineChart()
                    InitOptionCustomerActivitiesPipelineChart()
                } else {
                    $.fn.notifyB({description: "Get the latest total pipeline data successfully"}, 'success')
                    UpdateOptionTotalPipelineChart()
                    UpdateOptionTopSaleByTotalPipelineChart()
                }
            })
    }

    AjaxTotalPipelineChart()

    $('.timechart-total-pipeline').on('change', function () {
        UpdateOptionTotalPipelineChart()
        UpdateOptionTopSaleByTotalPipelineChart()
    })

    // Top sale by total pipeline chart

    function CombineTopSaleByTotalPipelineChartData(group_filter, show_billion, titleY = "Stage", titleX = 'Total (million)', chart_title='Detail Pipeline Chart') {
        let cast_billion = 1e6
        if (show_billion) {
            cast_billion = 1e9
        }

        let employeeInherits = Array.from(new Set(total_pipeline_chart_list_DF.map(item => item.employee_inherit.id)))
            .map(id => total_pipeline_chart_list_DF.find(item => item.employee_inherit.id === id).employee_inherit);

        if (group_filter) {
            employeeInherits = employeeInherits.filter(item => item.group_id === group_filter);
        }

        let all_list_stage_indicator_and_value = []
        for (let i = 0; i < employeeInherits.length; i++) {
            let top_sale_by_total_pipeline_chart_data = []
            for (const item of total_pipeline_chart_list_DF) {
                const group_id = item?.['employee_inherit']?.['group_id']
                if (
                    item?.['employee_inherit']?.['id'] === employeeInherits[i]['id'] &&
                    item.opportunity?.['stage']?.['win_rate'] !== 0 &&
                    item.opportunity?.['stage']?.['win_rate'] !== 100 &&
                    new Date(item.opportunity?.['open_date']).getFullYear() === parseInt(totalPipelineYearFilterEle.val())
                ) {
                    if (!group_filter) {
                        top_sale_by_total_pipeline_chart_data.push({
                            'id': item.opportunity?.['id'],
                            'title': item.opportunity?.['title'],
                            'value': item.opportunity?.['value'],
                            'stage_indicator': item.opportunity?.['stage']?.['indicator'],
                            'stage_win_rate': item.opportunity?.['stage']?.['win_rate']
                        })
                    } else {
                        if (group_id === group_filter) {
                            top_sale_by_total_pipeline_chart_data.push({
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
            // console.log(top_sale_by_total_pipeline_chart_data)
            let sortedDataByIndicator = top_sale_by_total_pipeline_chart_data.sort(function (a, b) {
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
                list_stage_indicator_new.push({
                    'indicator': `${list_stage_indicator[i]} (${data_winrate[i].toString()}%)`,
                    'value': data_group_by_stage_indicator[i]
                })
            }

            // console.log(employeeInherits[i].full_name)
            // console.log(list_stage_indicator_new)
            all_list_stage_indicator_and_value.push(list_stage_indicator_new)
        }
        const all_stages = all_list_stage_indicator_and_value.reduce((max, current) => (current.length > max.length ? current : max), []);
        const all_stages_title = all_stages.map(item => item.indicator)

        let all_indicators_map_value = []
        for (let i = 0; i < all_stages_title.length; i++) {
            const temp = all_list_stage_indicator_and_value.map(subArray => {
                const qualificationItem = subArray.find(item => item.indicator === all_stages_title[i]);
                return qualificationItem ? qualificationItem.value : 0;
            });
            all_indicators_map_value.push({
                'name': all_stages_title[i],
                'data': temp
            })
        }
        console.log(all_indicators_map_value)

        return {
            series: all_indicators_map_value,
            chart: {
                type: 'bar',
                height: 300,
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
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        position: 'center',
                        total: {
                            enabled: true,
                            offsetX: 10,
                            formatter: function (val) {
                                if (val && titleX.split(' ')[1][1] === 'b') {
                                    val = val.toFixed(3)
                                }
                                return `${val}${titleX.split(' ')[1][1].toUpperCase()}`
                            }
                        }
                    },
                    barHeight: '100%',
                }
            },
            colors: [
                '#4885e1', '#706f6f', '#ff5e5e', '#63d75d',
                '#a92c0d', '#02375b', '#83108f', '#334907',
            ],
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            title: {
                text: chart_title
            },
            xaxis: {
                categories: employeeInherits.map(item => item.full_name),
                title: {
                    text: titleX
                },
                labels: {
                    show: true,
                    formatter: function (val) {
                        if (val && titleX.split(' ')[1][1] === 'b') {
                            val = val.toFixed(3)
                        }
                        return `${val}${titleX.split(' ')[1][1].toUpperCase()}`
                    }
                },
            },
            yaxis: {
                title: {
                    text: titleY
                },
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    formatter: function (val) {
                        if (val && titleX.split(' ')[1][1] === 'b') {
                            val = val.toFixed(3)
                        }
                        return `${val}${titleX.split(' ')[1][1].toUpperCase()}`
                    }
                }
            },
            legend: {
                show: false
            }
        };
    }

    function InitOptionTopSaleByTotalPipelineChart() {
        let group = totalPipelineGroupEle.val()
        const isBillionChecked = totalPipelineBillionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopSaleByTotalPipelineChartData(
            group,
            isBillionChecked,
            '',
            `Total (${unitText})`,
            `Detail Pipeline Chart of Company in ${totalPipelineYearFilterEle.val()}`
        )
        $('#top-sale-by-total-pipeline-spinner').prop('hidden', true)
        top_sale_by_total_pipeline_chart_list_DF = new ApexCharts(document.querySelector("#top_sale_by_total_pipeline_chart"), options);
        top_sale_by_total_pipeline_chart_list_DF.render();
    }

    function UpdateOptionTopSaleByTotalPipelineChart() {
        let group = totalPipelineGroupEle.val()
        let group_title = SelectDDControl.get_data_from_idx(totalPipelineGroupEle, totalPipelineGroupEle.val())['title']
        if (!group_title) {
            group_title = 'Company'
        }
        const isBillionChecked = totalPipelineBillionCheckboxEle.prop('checked')
        const unitText = isBillionChecked ? 'billion' : 'million'
        let options = CombineTopSaleByTotalPipelineChartData(
            group,
            isBillionChecked,
            '',
            `Total (${unitText})`,
            `Detail Pipeline Chart of ${group_title} in ${totalPipelineYearFilterEle.val()}`
        )
        top_sale_by_total_pipeline_chart_list_DF.updateOptions(options)
    }

    // Customer activities chart

    let customer_title_chart_data_DF = []
    let call_chart_data_DF = []
    let email_chart_data_DF = []
    let meeting_chart_data_DF = []
    let document_chart_data_DF = []

    function ProcessDataCustomerActivities() {
        let activities_data = []
        for (const item of total_pipeline_chart_list_DF) {
            activities_data.push({
                'id': item?.['opportunity']['customer']['id'],
                'title': item?.['opportunity']['customer']['title'],
                'call': item?.['opportunity']['call'],
                'email': item?.['opportunity']['email'],
                'meeting': item?.['opportunity']['meeting'],
                'document': item?.['opportunity']['document']
            })
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

        // console.log(activities_data_merge_list);

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

    function CombineCustomerActivitiesPipelineChartData(titleX='Times', titleY='Customers', chart_title='Customer activities chart', from=0, to=10) {
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
                height: 300,
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
                    barHeight: '100%',
                    distributed: false,
                    horizontal: true,
                    dataLabels: {
                        total: {
                            enabled: true,
                            style: {
                                fontSize: '13px',
                                fontWeight: 900
                            }
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
            fill: {
                opacity: 1
            }
        };
    }

    function InitOptionCustomerActivitiesPipelineChart() {
        ProcessDataCustomerActivities()
        let options = CombineCustomerActivitiesPipelineChartData(
            'Times',
            'Customers',
            'Customer activities chart',
            0,
            10
        )
        $('#customer-activities-spinner').prop('hidden', true)
        customer_activities_pipeline_chart_list_DF = new ApexCharts(document.querySelector("#customer_activities_pipeline_chart"), options);
        customer_activities_pipeline_chart_list_DF.render();
    }

    function UpdateOptionCustomerActivitiesPipelineChart(from, to) {
        let options = CombineCustomerActivitiesPipelineChartData(
            'Times',
            'Customers',
            'Customer activities chart',
            from,
            to
        )
        customer_activities_pipeline_chart_list_DF.updateOptions(options)
    }

    $('#next').on('click', function () {
        if (FROM < customer_title_chart_data_DF.length) {
            FROM += 5
            TO += 5
            UpdateOptionCustomerActivitiesPipelineChart(FROM, TO)
        }

    })

    $('#previous').on('click', function () {
        if (FROM > 0) {
            FROM -= 5
            TO -= 5
            UpdateOptionCustomerActivitiesPipelineChart(FROM, TO)
        }
    })
})
