$(document).ready(function () {
    const STATUS_LIST = [
        'Prospect',
        'Open - not contacted',
        'Working',
        'Opportunity created',
        'Disqualified',
        'Not a target'
    ]
    const STATUS_LIST_STYLE = {
        'Prospect': { bg: '#17A2B8', color: '#FFFFFF' },           // Light Blue - same as chart
        'Open - not contacted': { bg: '#FFC107', color: '#000000' },  // Yellow/Orange - same as chart
        'Working': { bg: '#007BFF', color: '#FFFFFF' },            // Blue - same as chart
        'Opportunity created': { bg: '#28A745', color: '#FFFFFF' }, // Green - same as chart
        'Disqualified': { bg: '#DC3545', color: '#FFFFFF' },      // Red - same as chart
        'Not a target': { bg: '#6C757D', color: '#FFFFFF' }       // Gray - same as chart
    }

    // Global chart instances
    let statusChart = null;
    let stageChart = null;

    function loadLeadList() {
        if (!$.fn.DataTable.isDataTable('#lead-list-table')) {
            let dtb = $('#lead-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '32vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['lead_list'] ? resp.data['lead_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-5',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-10',
                        'render': (data, type, row) => {
                            return `<span class="small text-blue">${row?.['source'] || '--'}</span>`;
                        }
                    },
                    {
                        className: 'w-15',
                        'render': (data, type, row) => {
                            return `<span>${row?.['current_lead_stage_data']?.['title'] || '--'}</span>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        'render': (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        'render': (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-15',
                        'render': (data, type, row) => {
                            const statusStyle = STATUS_LIST_STYLE[row?.['lead_status']];
                            if (statusStyle) {
                                return `<span title="${row?.['lead_status']}" class="d-flex align-items-center">
                                    <span class="me-2 d-inline-block rounded-circle" style="width: 12px; height: 12px; background-color: ${statusStyle.bg};"></span>
                                    <span>${row?.['lead_status']}</span>
                                </span>`;
                            }
                            return `<span title="${row?.['lead_status']}" class="d-flex align-items-center">
                                <span class="me-2 d-inline-block rounded-circle" style="width: 12px; height: 12px; background-color: #6C757D;"></span>
                                <span>${row?.['lead_status']}</span>
                            </span>`;
                        }
                    },
                ],
                initComplete: function (settings, json) {
                    loadChartData();
                }
            });
        }
    }

    function loadChartData() {
        // Show loaders
        $('.spinner-border').parent().removeClass('d-none');
        
        let chart_data_ajax = $.fn.callAjax2({
            url: $('#lead-list-table').attr('data-chart'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data?.['chart_data']) {
                        return data?.['chart_data'].length > 0 ? data?.['chart_data'][0] : null
                    } else {
                        return [];
                    }
                }
                return [];
            },
            (errs) => {
                console.log(errs);
                $('.spinner-border').parent().addClass('d-none');
            }
        )

        Promise.all([chart_data_ajax]).then(
            (results) => {
                // Hide loaders
                $('.spinner-border').parent().addClass('d-none');
                
                // Update charts with animation
                loadStatusChart(results[0]?.['status_amount_information'])
                loadStageChart(results[0]?.['stage_amount_information'])
                
                // Update footer stats
                updateChartStats(results[0]);
            })
    }

    function loadStatusChart(status_amount_information) {
        let series_data = []
        for (const status of STATUS_LIST) {
            series_data.push(status_amount_information?.[status] || 0)
        }

        let options = {
            series: series_data,
            labels: STATUS_LIST,
            chart: {
                type: 'donut',
                height: 230,
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                toolbar: {
                    show: false
                }
            },
            colors: (function() {
                // Colors that represent the nature of each status
                const colorMap = {
                    'Prospect': '#17A2B8',           // Light Blue - New potential (hopeful)
                    'Open - not contacted': '#FFC107', // Yellow/Orange - Attention needed (warning)
                    'Working': '#007BFF',            // Blue - Active work in progress
                    'Opportunity created': '#28A745', // Green - Positive outcome (success)
                    'Disqualified': '#DC3545',       // Red - Negative/rejected (danger)
                    'Not a target': '#6C757D'        // Gray - Inactive/neutral (secondary)
                };
                return STATUS_LIST.map(status => colorMap[status] || '#6C757D');
            })(),
            dataLabels: {
                formatter: function (val, opts) {
                    return [opts.w.config.series[opts.seriesIndex], val.toFixed(1) + '%']
                },
                style: {
                    fontSize: '12px',
                    fontWeight: 600
                }
            },
            legend: {
                position: 'left',
                fontSize: '12px',
                markers: {
                    width: 12,
                    height: 12,
                    radius: 6
                },
                itemMargin: {
                    horizontal: 5,
                    vertical: 3
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        labels: {
                            show: false
                        }
                    },
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        height: 250
                    },
                    legend: {
                        position: 'left'
                    }
                }
            }],
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function(value) {
                        return value
                    }
                }
            }
        };

        // Destroy existing chart if exists
        if (statusChart) {
            statusChart.destroy();
        }

        statusChart = new ApexCharts(document.querySelector("#status-lead-chart"), options);
        statusChart.render();
        window.statusChart = statusChart;
    }

    function loadStageChart(stage_amount_information) {
        const arranged_by_level = Object.entries(stage_amount_information).map(([name, lead]) => ({ name, ...lead }));
        arranged_by_level.sort((a, b) => a.level - b.level);

        let series_data = []
        for (const stage of arranged_by_level) {
            series_data.push({
                'name': stage?.['name'],
                'data': [stage?.['amount']]
            })
        }
        
        let options = {
            series: series_data,
            chart: {
                type: 'bar',
                height: 230,
                stacked: true,
                stackType: '100',
                toolbar: {
                    show: false
                }
            },
            colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'],
            xaxis: {
                categories: [
                    new Date().getFullYear()
                ],
            },
            fill: {
                opacity: 1
            },
            legend: {
                position: 'left',
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function(value) {
                        return value
                    }
                }
            }
        };

        // Destroy existing chart if exists
        if (stageChart) {
            stageChart.destroy();
        }

        stageChart = new ApexCharts(document.querySelector("#stage-lead-chart"), options);
        stageChart.render();
        window.stageChart = stageChart;
    }

    function updateChartStats(data) {
        // Update status stats in footer
        if (data?.['status_amount_information']) {
            $('#status-chart-new').text(data.status_amount_information['Prospect'] || 0);
            $('#status-chart-qualified').text(data.status_amount_information['Working'] || 0);
            $('#status-chart-converted').text(data.status_amount_information['Opportunity created'] || 0);
        }
        
        // Update stage stats in footer
        if (data?.['stage_amount_information']) {
            const stages = Object.entries(data.stage_amount_information);
            if (stages.length >= 3) {
                $('#stage-chart-stage1').text(stages[0][1].amount || 0);
                $('#stage-chart-stage2').text(stages[1][1].amount || 0);
                $('#stage-chart-stage3').text(stages[2][1].amount || 0);
            }
        }
    }


    // Initialize
    loadLeadList();
})

// Save chart functions
function saveStatusChart() {
    if (window.statusChart) {
        window.statusChart.dataURI().then(({ imgURI }) => {
            const a = document.createElement('a');
            a.href = imgURI;
            a.download = 'lead-status-chart.png';
            a.click();
        });
    }
}

function saveStageChart() {
    if (window.stageChart) {
        window.stageChart.dataURI().then(({ imgURI }) => {
            const a = document.createElement('a');
            a.href = imgURI;
            a.download = 'lead-stage-chart.png';
            a.click();
        });
    }
}