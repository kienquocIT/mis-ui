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
        'Prospect': 'text-warning',
        'Open - not contacted': 'text-success',
        'Working': 'text-primary',
        'Opportunity created': 'text-blue',
        'Disqualified': 'text-secondary',
        'Not a target': 'text-secondary'
    }

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
                            return `<span title="${row?.['lead_status']}" class="${STATUS_LIST_STYLE[row?.['lead_status']]}">${row?.['lead_status']}</span>`;
                        }
                    },
                ],
                initComplete: function (settings, json) {
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
                        }
                    )

                    Promise.all([chart_data_ajax]).then(
                        (results) => {
                            loadStatusChart(results[0]?.['status_amount_information'])
                            loadStageChart(results[0]?.['stage_amount_information'])
                        })
                }
            });
        }
    }

    function loadStatusChart(status_amount_information) {
        let series_data = []
        for (const status of STATUS_LIST) {
            series_data.push(status_amount_information?.[status])
        }

        let options = {
            series: series_data,
            labels: STATUS_LIST,
            chart: {
                type: 'pie',
                height: 250,
            },
            colors: ['#b9ceee', '#80a6e3', '#2464ce', '#003593', '#706f6f', '#ff5e5e'],
            dataLabels: {
                formatter: function (val, opts) {
                    return [opts.w.config.series[opts.seriesIndex], val.toFixed(2) + '%']
                },
            },
            legend: {
                position: 'left',
            },
        };

        let chart = new ApexCharts(document.querySelector("#status-lead-chart"), options);
        chart.render();
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
                height: 250,
                stacked: true,
                stackType: '100'
            },
            colors: ['#4885e1', '#e0ad00', '#ff5e5e', '#00ab57'],
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
        };

        let chart = new ApexCharts(document.querySelector("#stage-lead-chart"), options);
        chart.render();
    }

    loadLeadList();
})