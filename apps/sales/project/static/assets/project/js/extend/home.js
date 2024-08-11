$(document).ready(function(){
    let colors = ['#FC9F66', '#FAC357', '#FAE39C', '#B8E0E3', '#97C5D8', '#84A9CD'];

    /*******************/
    // project expense
    let $expChart = $('#prj_chart_expense')
    var options44 = {
        series: [{
            data: [21000000, 22000000, 1000000, 2800000, 1650000, 2100000, 13000000, 3000000, 4100000, 5200000, 8000000,
            6500000, 1200000]
        }],
        chart: {
            height: 380,
            type: 'bar',
        },
        plotOptions: {
            bar: {
			    distributed: true,
            }
        },
        colors: colors,
        dataLabels: {
            enabled: false
        },
        legend:{show: false},
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value + "$";
                }
            },
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['John Doe John Doe', 'Joe Smith', 'Jake Williams', 'Amber', 'Peter Brown', 'Mary Evans',
                'David Wilson', 'Lily Roberts', 'Lily Roberts 2', 'Lily Roberts 3', 'Lily Roberts 4', 'Lily Roberts 5',
                'Lily Roberts 6'],
            labels: {
                formatter: function (value) {
                    return value.length < 20 ? value : value.slice(0, 15);
                }
            }
        },
        tooltip: {
            enabled: true,
            custom: function ({series, seriesIndex, dataPointIndex, w}) {
                let color = w.globals.colors[dataPointIndex];
                return (`<div class="apexcharts-tooltip-title">${w.globals.labels[dataPointIndex]}</div>` +
                        `<div class="apexcharts-tooltip-series-group d-flex"><span class="apexcharts-tooltip-marker" style="background: ${color}"></span>` +
                            `<div class="apexcharts-tooltip-text">${series[seriesIndex][dataPointIndex]}</div></div>`
                );
            }
        }
    };
    var chart44 = new ApexCharts($expChart[0], options44);
    chart44.render();

    const _urlElm = $('#url-factory')

    // get data all list
    getProjData({
        'url': _urlElm.attr('data-prj-list'),
        'method': 'get',
        'data': {page: 1, pageSize: 100}
    }, 'Trigger_Loaded');
    $(document).on('Trigger_Loaded', function(){
        WindowControl.hideLoading();
        const $elm = $('#Trigger_Loaded')
        const project_list = $elm.data('Trigger_Loaded')
        $elm.remove()
        HomeChart.runBlock(project_list)
        HomeChart.runChartPOwner(project_list)
        HomeChart.runChartPPYear(project_list)
        HomeChart.runChartPStatus(project_list)
    });

    // get data expense
    getProjData({
        'url': _urlElm.attr('data-prj-expense-list'),
        'method': 'get',
        'data': {page: 1, pageSize: 100}
    }, 'Trigger_expense');
    $(document).on('Trigger_expense', function(){
        WindowControl.hideLoading();
        const $elm = $('#Trigger_expense')
        const project_list = $elm.data('Trigger_expense')
        $elm.remove()
        HomeChart.runExpense(project_list)
    });

});

// func get data via ajax
function getProjData(opts, strTrigger, page=1, prj = []){
        WindowControl.showLoading();
        if (page)
            opts.data.page = page
        $.fn.callAjax2(opts)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    let res = []
                    if(data?.['project_list']) res = data['project_list']
                    else if (data?.['project_expense_list']) res = data['project_expense_list']
                    prj = [...res, ...prj]
                    if (data.page_next > 0) getProjData(opts, strTrigger, data.page_next, prj)
                    else{
                        $('body').append(`<input id="${strTrigger}"/>`)
                        $(`#${strTrigger}`).data(strTrigger, prj)
                        $(document).trigger(strTrigger)
                    }
                },
                (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
            )
    };

function formatSuffixNumber(number){
     // Remove commas and convert to number
    var num = parseInt(number.replace(/,/g, ''));

    // Define intervals and suffixes
    var intervals = [0, 1e3, 1e6, 1e9, 1e12];
    var suffixes = ["", "K", "M", "B", "T"];

    // Find the appropriate interval
    var div = intervals.findIndex(function(interval) {
        return num < interval;
    }) - 1;

    // Handle edge case where number is larger than the largest interval
    if (div < 0) div = intervals.length - 1;

    // Calculate the compressed value
    var compressedValue = (num / Math.pow(10, 3 * div)).toFixed(1);

    // Return the compressed value with the appropriate suffix
    return compressedValue + suffixes[div];
}

class HomeChart {

    static runBlock(data){
        let count = 0,
            count_all = data.length,
            crt_date = new Date(),
            $cardElm = $('.card_new_prj'),
            $cardBElm = $('.card_baseline'),
            $cardTElm = $('.card_tasks'),
            baseline_count = 0,
            baseline_new = 0,
            task_count = 0,
            task_completed = 0;

        for (let item of data){
            const dateItem = new Date(item.date_created)
            if (crt_date.getFullYear() === dateItem.getFullYear() && crt_date.getMonth() === dateItem.getMonth())
                count++
            baseline_count += item.baseline.count
            baseline_new += item.baseline['new_t_month']
            task_count += item.tasks.all
            task_completed += item.tasks.completed

        };
        // run new project this month block
        $cardElm.find('.heading_cards').html(`${count_all} ${$.fn.gettext('Project')}`)
        $cardElm.find('.percent_block span').text(`+${count}`)
        // run project baseline block
        $cardBElm.find('.heading_cards').text(`${baseline_count} ${$.fn.gettext('Baseline')}`)
        $cardBElm.find('.percent_block span').text(`+${baseline_new}`)
        // run project task count block
        $cardTElm.find('.heading_cards').html(`${task_count} <span>${$.fn.gettext('all')}</span>`)
        let configs_task = {
            series: [0],
            chart: {
                height: 50,
                width: 50,
                type: 'radialBar',
                sparkline: {
                    enabled: true
                }
            },
            dataLabels: {
                enabled: false
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: '75%',
                    },
                    track: {
                        margin: 0
                    },
                    dataLabels: {
                        value:{
                            show: true,
                            fontSize: '12px',
                            fontWeight: 400,
                            offsetY: 5,
                            formatter: (val) => { return val }
                        },
                        name: {
                            show: false,
                        }
                    },
                    barLabels: {
                        enabled: false,
                    },
                },
            },
            colors: ['#00acf0'],
        };
        if (task_count > 0 && task_completed > 0)
            configs_task.series = [(task_completed/task_count * 100).toFixed(0)]
        let chartTNew = new ApexCharts(document.querySelector("#pie_chart_2"), configs_task);
        chartTNew.render();

    }

    static runExpense(data){
        let all_sub = 0
        for (let item of data){
            if (item.sub_total)
                all_sub += item.sub_total
        }
        DocumentControl.getCompanyCurrencyConfig().then((configData) => {
            let prefix = configData?.['prefix'], suffix = configData?.['suffix'];
            let IsTotal = formatSuffixNumber(all_sub.toString())
            if (prefix) IsTotal = prefix + IsTotal
            else IsTotal = IsTotal + suffix
            $('.card_expense .heading_cards .span-money').text(IsTotal)
        });
    }

    static runChartPOwner(data){
        // chart employee inherit of project
        let $empChart = $('#prj_chart_employee');
        let colors = ['#FC9F66', '#FAC357', '#FAE39C', '#B8E0E3', '#97C5D8', '#84A9CD'];
        var optionsEmp = {
            series: [],
            chart: {
                height: 380,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    distributed: true,
                }
            },
            legend:{show: false},
            colors: colors,
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: [],
            },
            tooltip: {
                enabled: true,
                custom: function ({series, seriesIndex, dataPointIndex, w}) {
                    let color = w.globals.colors[dataPointIndex];
                    return (`<div class="apexcharts-tooltip-title">${w.globals.labels[dataPointIndex]}</div>` +
                            `<div class="apexcharts-tooltip-series-group d-flex"><span class="apexcharts-tooltip-marker" style="background: ${color}"></span>` +
                                `<div class="apexcharts-tooltip-text">${series[seriesIndex][dataPointIndex]}</div></div>`
                    );
                }
            }
        };
        let _EmpLst = {}
        for (let item of data){
            if (item.employee_inherit.id in _EmpLst)
                _EmpLst[item.employee_inherit.id].count++
            else{
                _EmpLst[item.employee_inherit.id] = {
                    name: item.employee_inherit.full_name,
                    count: 1
                }
            }
        }
        optionsEmp.series = [{data: $.map(_EmpLst,(item)=>{return item.count})}]
        optionsEmp.xaxis.categories = $.map(_EmpLst,(item)=>{return item.name})
        var chartEmp = new ApexCharts($empChart[0], optionsEmp);
        chartEmp.render();
    }

    static runChartPPYear(data){
        // chart project count
        let $prjChart = $('#prj_chart_year')
        var pieOpt = {
            series: [],
            chart: {
                height: 380,
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false
                },
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: false,
                },
            },
            yaxis: {
                tickAmount: 5,
                labels: {
                    formatter: function (val) {
                        return val.toFixed(0);
                    }
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2
            }
        };
        let prj_dict = {}, minDate = new Date(), MaxDate = new Date();
        // convert project list migrate
        for (let item of data){
            const dateCreated = new Date(item.date_created);
            if (dateCreated < minDate) minDate = dateCreated
            if(dateCreated.getFullYear() in prj_dict)
                prj_dict[dateCreated.getFullYear()].push(item)
            else
                prj_dict[dateCreated.getFullYear()] = [item]
        }

        for (let val in prj_dict){
            let item = prj_dict[val];
            let temp = {
                name: val,
                data: []
            };
            for (let i = 1; i < 12; i++){
                let child = 0
                for (let grandChild of item){
                    const dateCreated = new Date(grandChild.date_created)
                    if (dateCreated.getMonth() === i) child += 1
                }
                temp.data[i-1] = child
                // if (child === 0 && i > 1) temp.data[i-1] = temp.data[i-2]
            }
            pieOpt.series.push(temp)
        }

        var chartArea = new ApexCharts($prjChart[0], pieOpt);
        chartArea.render();
    }

    static runChartPStatus(data){
        /*Donut Chart*/
        let $prjStatus = $('#prj_chart_status'),
            colors = ['#FC9F66', '#FAC357', '#FAE39C', '#B8E0E3', '#97C5D8', '#84A9CD'];

        const _prjStatus = {
            1: $.fn.gettext('Created'),
            2: $.fn.gettext('Added'),
            3: $.fn.gettext('Finish'),
            4: $.fn.gettext('Cancel'),
        }
        var optionsStt = {
            series: [0, 0, 0, 0],
            labels: [_prjStatus[1], _prjStatus[2], _prjStatus[3], _prjStatus[4]],
            chart: {
                type: 'pie',
                width: 380,
            },
            colors: colors,
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
        for (let item of data){
            const stt = item.system_status
            if (stt === 1) optionsStt.series[0] += 1
            else if (stt === 2) optionsStt.series[1] += 1
            else if (stt === 3) optionsStt.series[2] += 1
            else optionsStt.series[3] += 1
        }
        var chartStt = new ApexCharts($prjStatus[0], optionsStt);
        chartStt.render();
    }

}