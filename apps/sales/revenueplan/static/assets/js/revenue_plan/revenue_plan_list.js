$(document).ready(function () {
    const transEle = $('#trans-script')
    function loadRevenuePlanList() {
        if (!$.fn.DataTable.isDataTable('#table-revenue-plan-list')) {
            let dtb = $('#table-revenue-plan-list');
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
                            console.log(resp.data['revenue_plan_list'])
                            return resp.data['revenue_plan_list'] ? resp.data['revenue_plan_list'] : [];
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
                        data: 'code',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-45',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary fw-bold" data-id="${row.id}" data-title="${row.title}" data-code="${row.code}">${row.title}</span></a>`
                        }
                    },
                    {
                        data: 'period',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<span>${row.period_mapped.title}</span>`
                        }
                    },
                    {
                        data: 'employee_created',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<span class="text-blue">${row.employee_created.full_name}</span>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let parsedDate = new Date(row.date_created.split(' ')[0]);
                            let formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getFullYear()}`;
                            return `<span>${formattedDate}</span>`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text text-center w-10',
                        render: (data, type, row) => {
                            if (row.status === 'Opening') {
                                return `<span class="w-100 badge badge-soft-success">${transEle.attr('data-trans-opening')}</span>`
                            }
                            else if (row.status === 'Waiting') {
                                return `<span class="w-100 badge badge-soft-warning">${transEle.attr('data-trans-waiting')}</span>`
                            }
                            else {
                                return `<span class="w-100 badge badge-secondary">${transEle.attr('data-trans-closed')}</span>`
                            }
                        }
                    }
                ],
            });
        }
    }

    loadRevenuePlanList();
})
