$(document).ready(function () {
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
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary ap_info" data-id="${row.id}" data-title="${row.title}" data-code="${row.code}"><b>${row.title}</b></span></a>`
                        }
                    },
                    {
                        data: 'period',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="text-secondary"><b>${row.period_mapped.title}</b></span>`
                        }
                    },
                    {
                        data: 'sale_person',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="text-secondary">${row.employee_created.full_name}</span>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="text-secondary">${row.date_created.split(' ')[0]}</span>`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (row.status === 'Opening') {
                                return `<span class="badge badge-success">${row.status}</span>`
                            }
                            else {
                                return `<span class="badge badge-secondary">${row.status}</span>`
                            }
                        }
                    }
                ],
            });
        }
    }

    loadRevenuePlanList();
})
