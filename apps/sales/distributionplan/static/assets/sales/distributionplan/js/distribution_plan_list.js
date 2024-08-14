$(document).ready(function () {
    function loadDPList() {
        if (!$.fn.DataTable.isDataTable('#db-list-table')) {
            let dtb = $('#db-list-table');
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
                            return resp.data['distribution_plan_list'] ? resp.data['distribution_plan_list'] : [];
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
                            return `<a href="${link}"><span class="badge badge-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        className: 'wrap-text w-40',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><b>${row?.['title']}</b></a>`;
                        }
                    },
                    {
                        className: 'wrap-text w-20 text-center',
                        'render': (data, type, row) => {
                            return `${moment(row?.['start_date'].split(' ')[0]).format('DD/MM/YYYY')}`;
                        }
                    },
                    {
                        className: 'wrap-text w-20 text-center',
                        'render': (data, type, row) => {
                            return `${row?.['no_of_month']}`;
                        }
                    },
                    {
                        className: 'wrap-text w-10 text-center',
                        'render': (data, type, row) => {
                            let approved_trans = ['Draft', 'Created', 'Added', 'Finish', 'Cancel']
                            let text_color = ['secondary', 'primary', 'blue', 'success', 'danger']
                            return `<span class="w-100 badge badge-soft-${text_color[row?.['system_status']]}">${approved_trans[row?.['system_status']]}</span>`
                        }
                    },
                ],
            });
        }
    }

    loadDPList();
})