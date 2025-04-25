$(document).ready(function () {
    const transEle = $('#trans-script')
    const urlEle = $('#url-script')

    function loadRevenuePlanList() {
        if (!$.fn.DataTable.isDataTable('#table-revenue-plan-list')) {
            let dtb = $('#table-revenue-plan-list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
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
                            return resp.data['revenue_plan_list'] ? resp.data['revenue_plan_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-5',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-40',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            let btn_view_plan = `<button data-bs-toggle="modal" data-bs-target="#modal-my-plan" type="button" id="view-my-revenue-plan" class="btn btn-gradient-primary btn-xs ml-2" data-method="GET" data-url="${urlEle.attr('data-url-view-plan')}">${transEle.attr('data-trans-btn-view-plan')}</button>`
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>${row?.['status'] === 'Opening' ? btn_view_plan : ''}`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<span>${row?.['period_mapped']?.['title']}</span>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `<span>${row?.['employee_created']?.['full_name']}</span>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            if (row?.['status'] === 'Opening') {
                                return `<span class="text-success">${transEle.attr('data-trans-opening')}</span>`
                            }
                            else if (row?.['status'] === 'Waiting') {
                                return `<span class="text-orange">${transEle.attr('data-trans-waiting')}</span>`
                            }
                            else {
                                return `<span class="text-secondary">${transEle.attr('data-trans-closed')}</span>`
                            }
                        }
                    }
                ],
            });
        }
    }

    loadRevenuePlanList();

    function getMonthOrder(space_month) {
        for (let i = 0; i < 12; i++) {
            let trans_order = i+1+space_month
            if (trans_order > 12) {
                trans_order -= 12
            }
            $(`#m${i+1}th`).text(transEle.attr(`data-trans-m${trans_order}th`))
        }
    }

    $(document).on('click', '#view-my-revenue-plan', function () {
        let dataParam = {'myself': true}
        let employee_revenue_plan = $.fn.callAjax2({
            url: $(this).attr('data-url'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('revenue_plan_by_report_perm_list')) {
                    return data?.['revenue_plan_by_report_perm_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([employee_revenue_plan]).then(
            (results) => {
                let data_list = []
                for (let i = 0; i < results[0].length; i++) {
                    getMonthOrder(results[0][i]?.['period_mapped']?.['space_month'])
                    data_list.push({
                        'employee_full_name': results[0][i]?.['employee_mapped']?.['full_name'],
                        'profit_target_type': results[0][i]?.['profit_target_type'] === 0 ? transEle.attr('data-trans-gross-profit') : transEle.attr('data-trans-net-profit'),

                        'm1_revenue': results[0][i]?.['emp_month_target'][0],
                        'm1_profit': results[0][i]?.['emp_month_profit_target'][0],
                        'm2_revenue': results[0][i]?.['emp_month_target'][1],
                        'm2_profit': results[0][i]?.['emp_month_profit_target'][1],
                        'm3_revenue': results[0][i]?.['emp_month_target'][2],
                        'm3_profit': results[0][i]?.['emp_month_profit_target'][2],
                        'm4_revenue': results[0][i]?.['emp_month_target'][3],
                        'm4_profit': results[0][i]?.['emp_month_profit_target'][3],
                        'm5_revenue': results[0][i]?.['emp_month_target'][4],
                        'm5_profit': results[0][i]?.['emp_month_profit_target'][4],
                        'm6_revenue': results[0][i]?.['emp_month_target'][5],
                        'm6_profit': results[0][i]?.['emp_month_profit_target'][5],
                        'm7_revenue': results[0][i]?.['emp_month_target'][6],
                        'm7_profit': results[0][i]?.['emp_month_profit_target'][6],
                        'm8_revenue': results[0][i]?.['emp_month_target'][7],
                        'm8_profit': results[0][i]?.['emp_month_profit_target'][7],
                        'm9_revenue': results[0][i]?.['emp_month_target'][8],
                        'm9_profit': results[0][i]?.['emp_month_profit_target'][8],
                        'm10_revenue': results[0][i]?.['emp_month_target'][9],
                        'm10_profit': results[0][i]?.['emp_month_profit_target'][9],
                        'm11_revenue': results[0][i]?.['emp_month_target'][10],
                        'm11_profit': results[0][i]?.['emp_month_profit_target'][10],
                        'm12_revenue': results[0][i]?.['emp_month_target'][11],
                        'm12_profit': results[0][i]?.['emp_month_profit_target'][11],

                        'q1_revenue': results[0][i]?.['emp_quarter_target'][0],
                        'q1_profit': results[0][i]?.['emp_quarter_profit_target'][0],
                        'q2_revenue': results[0][i]?.['emp_quarter_target'][1],
                        'q2_profit': results[0][i]?.['emp_quarter_profit_target'][1],
                        'q3_revenue': results[0][i]?.['emp_quarter_target'][2],
                        'q3_profit': results[0][i]?.['emp_quarter_profit_target'][2],
                        'q4_revenue': results[0][i]?.['emp_quarter_target'][3],
                        'q4_profit': results[0][i]?.['emp_quarter_profit_target'][3],

                        'year_revenue': results[0][i]?.['emp_year_target'],
                        'year_profit': results[0][i]?.['emp_year_profit_target'],
                    })
                }
                let dtb = $('#my-revenue-plan-table')
                dtb.prop('hidden', false)
                dtb.DataTable().clear().destroy()
                dtb.DataTableDefault({
                    dom: 't',
                    scrollX: true,
                    paging: false,
                    scrollCollapse: true,
                    reloadCurrency: true,
                    data: data_list,
                    columns: [
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary">${transEle.attr('data-trans-revenue')}</span><br>
                                    <span class="text-right mask-money text-secondary">${row?.['profit_target_type']}</span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m1_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m1_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m2_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m2_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m3_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m3_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['q1_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['q1_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m4_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m4_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m5_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m5_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m6_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m6_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['q2_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['q2_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m7_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m7_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m8_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m8_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m9_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m9_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['q3_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['q3_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m10_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m10_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m11_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m11_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['m12_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['m12_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['q4_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['q4_profit']}"></span>
                                `
                            }
                        },
                        {
                            className: 'text-right',
                            render: (data, type, row)  => {
                                return `
                                    <span class="mb-1 text-right mask-money text-primary" data-init-money="${row?.['year_revenue']}"></span><br>
                                    <span class="text-right mask-money text-secondary" data-init-money="${row?.['year_profit']}"></span>
                                `
                            }
                        }
                    ],
                });
            })
    })
})
