$(document).ready(function () {
    function loadCIFList() {
        if (!$.fn.DataTable.isDataTable('#table-cash-inflow')) {
            let dtb = $('#table-cash-inflow');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['cash_inflow_list'] ? resp.data['cash_inflow_list'] : [];
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
                        data: 'code',
                        className: 'w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'w-25',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary"><b>${row?.['title']}</b></span></a>`
                        }
                    },
                    {
                        data: 'customer_data',
                        className: 'w-20',
                        render: (data, type, row) => {
                            return `<span class="text-muted">${row?.['customer_data']?.['name']}</span>`
                        }
                    },
                    {
                        data: 'total_value',
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `<span class="text-muted mask-money" data-init-money="${row?.['total_value'] ? row?.['total_value'] : '0'}"></span>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        data: 'status',
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    }
                ],
            });
        }
    }

    loadCIFList();
})