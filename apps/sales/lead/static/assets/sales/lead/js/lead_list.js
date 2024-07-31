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
        'Prospect': 'badge badge-outline badge-soft-warning',
        'Open - not contacted': 'badge badge-outline badge-soft-success',
        'Working': 'badge badge-outline badge-soft-primary',
        'Opportunity created': 'badge badge-outline badge-soft-blue',
        'Disqualified': 'badge badge-outline badge-secondary',
        'Not a target': 'badge badge-outline badge-secondary'
    }

    function loadLeadList() {
        if (!$.fn.DataTable.isDataTable('#lead-list-table')) {
            let dtb = $('#lead-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
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
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        className: 'wrap-text w-25',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}">${row?.['title']}</a>`;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        'render': (data, type, row) => {
                            return `<span class="badge badge-sm badge-blue">${row?.['source']}</span>`;
                        }
                    },
                    {
                        className: 'wrap-text w-15',
                        'render': (data, type, row) => {
                            return `${row?.['contact_name']}`;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        'render': (data, type, row) => {
                            return `${moment(row?.['date_created'].split(' ')[0]).format('DD/MM/YYYY')}`;
                        }
                    },
                    {
                        className: 'wrap-text w-15',
                        'render': (data, type, row) => {
                            return `<span class="badge-status">
                                        <span class="badge badge-primary badge-indicator"></span>
                                        <span class="badge-label">${row?.['current_lead_stage']?.['title']}</span>
                                    </span>`;
                        }
                    },
                    {
                        className: 'wrap-text text-center w-15',
                        'render': (data, type, row) => {
                            return `<span class="w-80 ${STATUS_LIST_STYLE[row?.['lead_status']]}">${row?.['lead_status']}</span>`;
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

    $('#reload-invoice-status-btn').on('click', function () {
        WindowControl.showLoading();
        let url_loaded = $('#datatable_ar_invoice_list').attr('data-url') + `?update_status=true`
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    WindowControl.hideLoading();
                    $.fn.notifyB({description: "Update successfully"}, 'success')
                    setTimeout(() => {
                        window.location.replace($('#datatable_ar_invoice_list').attr('data-url-redirect'));
                        location.reload.bind(location);
                    }, 1000);
                }
            },
            (errs) => {
                setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    1000
                )
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            })
    })
})