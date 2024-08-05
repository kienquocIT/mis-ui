$(document).ready(function(){
    let colors = ['#FC9F66', '#FAC357', '#FAE39C', '#B8E0E3', '#97C5D8', '#84A9CD'];
    // chart employee inherit of project
    let $empChart = $('#prj_chart_employee')
    var optionsemp = {
        series: [{
            data: [21, 22, 10, 28, 16, 21, 13, 30]
        }],
        chart: {
            height: 380,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                horizontal: true,
			    distributed: true,
                // dataLabels: {
                //     position: 'bottom'
                // },
            }
        },
        legend:{show: false},
        colors: colors,
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['John Doe', 'Joe Smith', 'Jake Williams', 'Amber', 'Peter Brown', 'Mary Evans',
                'David Wilson', 'Lily Roberts'],
        }
    };
    var chartemp = new ApexCharts($empChart[0], optionsemp);
    chartemp.render();

    // chart project count
    let $prjChart = $('#prj_chart_year')
    // timestemp của năm
    var ts1 = 1577811600000;
    var ts2 = 1578416400000;
    var ts3 = 1609606800000;

    // prepare data
    var dataSet = [
        [],
        [],
        [],
    ];
    // danh sach value
    var dataSeries = [
        [
            {"value": 1},
            {"value": 2},
            {"value": 3},
            {"value": 4},
            {"value": 5},
            {"value": 10},
            {"value": 20},
            {"value": 30},
            {"value": 45},
            {"value": 55},
            {"value": 66},
            {"value": 77},
        ],
        [
            {"value": 12},
            {"value": 14},
            {"value": 20},
            {"value": 40},
            {"value": 60},
            {"value": 66},
            {"value": 32},
            {"value": 12},
            {"value": 20},
            {"value": 42},
            {"value": 53},
            {"value": 80}
        ],
        [
            {"value": 31},
            {"value": 41},
            {"value": 12},
            {"value": 21},
            {"value": 35},
            {"value": 15},
            {"value": 18},
            {"value": 21},
            {"value": 39},
            {"value": 65},
            {"value": 41},
            {"value": 79},
        ]
    ];

    for (var i = 0; i < 12; i++) {
        ts1 = ts1 + 5260032000;
        var innerArr = [ts1, dataSeries[2][i].value];
        dataSet[0].push(innerArr)
    }
    for (var i = 0; i < 12; i++) {
        ts2 = ts2 + 5260032000;
        var innerArr = [ts2, dataSeries[1][i].value];
        dataSet[1].push(innerArr)
    }
    for (var i = 0; i < 12; i++) {
        ts3 = ts3 + 5260032000;
        var innerArr = [ts3, dataSeries[0][i].value];
        dataSet[2].push(innerArr)
    }

    var optionscount = {
        series: [{
            name: 'PRODUCT A',
            data: dataSet[0]
        },
        {
            name: 'PRODUCT B',
            data: dataSet[1]
        },
        {
            name: 'PRODUCT C',
            data: dataSet[2]
        }
        ],
        chart: {
            height: 380,
            type: 'area',
            stacked: false,
            zoom: {
                enabled: false
            },
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.65,
                opacityTo: 0.05,
                stops: [20, 100, 100, 100]
            },
        },
        xaxis: {
            type: 'datetime',
            tickAmount: 12,
            min: new Date("01/01/2020").getTime(),
            max: new Date("01/01/2024").getTime(),
            labels: {
                rotate: -15,
                rotateAlways: true,
                formatter: function (val, timestamp) {
                    return moment(new Date(timestamp)).format("DD MMM")
                }
            }
        },
        tooltip: {
            shared: true
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetX: -10
        }
    };

    var chartcount = new ApexCharts($prjChart[0], optionscount);
    chartcount.render();


    /************************************/
    /*Donut Chart*/
    let $prjStatus = $('#prj_chart_status')
    var optionsstt = {
        series: [44, 55, 41, 17],
        labels: ['Created', 'Pending', 'Completed', 'In Progress'],
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

    var chartstt = new ApexCharts($prjStatus[0], optionsstt);
    chartstt.render();

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
            fillSeriesColor: true,
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

    // get data all list
    let $loaded = $('#trigger_load')
    let proj_lst = []
    function getProjData(page=1){
        WindowControl.showLoading();
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-prj-list'),
            'method': 'get',
            'data': {page: page, pageSize: 100}
        })
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    let res = data['project_list']
                    proj_lst = [...res, ...proj_lst]
                    if (data.page_next > 0) getProjData(data.page_next)
                    else $loaded.trigger('Trigger.Loaded')
                },
                (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
            )
    };
    getProjData();
    $loaded.on('Trigger.Loaded', function(){
        WindowControl.hideLoading();
        HomeChart.runBlockNewThisMonth(proj_lst)
    });
});

class HomeChart {
    static runBlockNewThisMonth(data){
        let count = 0, count_all = data.length, crt_date = new Date(), $cardElm = $('.card_new_prj');

        for (let item of data){
            const dateItem = new Date(item.date_created)
            if (crt_date.getFullYear() === dateItem.getFullYear() && crt_date.getMonth() === dateItem.getMonth())
                count++
        }
        let configs = {
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
        if (count > 0 && count_all > 0)
            configs.series = [(count/count_all * 100).toFixed(0)]
        let chartNew = new ApexCharts(document.querySelector("#pie_chart_1"), configs);
        chartNew.render();
        $cardElm.find('.heading_cards').text(`${count} ${$.fn.gettext('Project new')}`)
    }

    static runBlockBaseline(data){
        let count_project = 0, count_baseline = data.length;
        for (let item of data){
            count_project += item.baseline.count
        }

    }
}