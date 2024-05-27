$(document).ready(function () {
    const STATUS_LIST = ['Prospect', 'Open - not contacted', 'Working', 'Opportunity created', 'Not a target']

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
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}">${row?.['title']}</a>`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `<span class="badge badge-sm badge-blue">${row?.['source']}</span>`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `${row?.['contact_name']}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `${moment(row?.['date_created'].split(' ')[0]).format('DD/MM/YYYY')}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `<span class="fst-italic">${row?.['lead_status']}</span>`;
                        }
                    },
                ],
                initComplete: function (settings, json) {
                    const lead_list = json?.['data']?.['lead_list']
                    let stages_data = {}
                    for (const status of STATUS_LIST) {
                        stages_data[status] = 0
                    }

                    for (const lead of lead_list) {
                        stages_data[lead?.['lead_status']] += 1
                    }

                    let series_data = []
                    for (const status of STATUS_LIST) {
                        series_data.push(stages_data?.[status])
                    }

                    let options = {
                        series: series_data,
                        labels: STATUS_LIST,
                        chart: {
                            type: 'donut',
                        },
                        dataLabels: {
                            formatter: function (val, opts) {
                                return [opts.w.config.series[opts.seriesIndex], val.toFixed(2) + '%']
                            },
                        },
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

                    let chart = new ApexCharts(document.querySelector("#all-lead-chart"), options);
                    chart.render();
                }
            });
        }
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