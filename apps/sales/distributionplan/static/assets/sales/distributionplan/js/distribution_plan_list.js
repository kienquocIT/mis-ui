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
                        className: 'w-15',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'w-35',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><b>${row?.['title']}</b></a>`;
                        }
                    },
                    {
                        className: 'w-15 text-center',
                        'render': (data, type, row) => {
                            return `<span class="text-muted">${moment(row?.['start_date'].split(' ')[0]).format('DD/MM/YYYY')}</span>`;
                        }
                    },
                    {
                        className: 'w-10 text-center',
                        'render': (data, type, row) => {
                            return `<span class="text-muted">${row?.['no_of_month']}</span>`;
                        }
                    },
                    {
                        className: 'w-15 text-center',
                        'render': (data, type, row) => {
                            return `<span class="${row?.['is_expired'] ? 'text-danger' : 'text-primary'}">${moment(row?.['end_date'].split(' ')[0]).format('DD/MM/YYYY')}</span>`;
                        }
                    },
                    {
                        className: 'text-center w-10',
                        'render': (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                ],
            });
        }
    }

    loadDPList();
})