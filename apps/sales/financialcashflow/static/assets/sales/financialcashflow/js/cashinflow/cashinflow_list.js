$(document).ready(function () {
    function loadCIFList() {
        if (!$.fn.DataTable.isDataTable('#table-cash-inflow')) {
            let dtb = $('#table-cash-inflow');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '75vh',
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
                        className: 'wrap-text w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary"><b>${row?.['title']}</b></span></a>`
                        }
                    },
                    {
                        data: 'customer_data',
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            return `<span class="text-muted">${row?.['customer_data']?.['name']}</span>`
                        }
                    },
                    {
                        data: 'total_value',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<span class="text-muted mask-money" data-init-money="${row?.['total_value'] ? row?.['total_value'] : '0'}"></span>`
                        }
                    },
                    {
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY',});
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let approved_trans = ``
                            let text_color = ``
                            if (row?.['system_status'] === 0) {
                                approved_trans = 'Draft'
                                text_color = 'badge-soft-secondary'
                            }
                            else if (row?.['system_status'] === 1) {
                                approved_trans = 'Created'
                                text_color = 'badge-soft-primary'
                            }
                            else if (row?.['system_status'] === 2) {
                                approved_trans = 'Added'
                                text_color = 'badge-soft-blue'
                            }
                            else if (row?.['system_status'] === 3) {
                                approved_trans = 'Finish'
                                text_color = 'badge-soft-success'
                            }
                            else if (row?.['system_status'] === 4) {
                                approved_trans = 'Cancel'
                                text_color = 'badge-soft-danger'
                            }
                            return `<span class="w-100 badge ${text_color}">` + approved_trans + `</span>`
                        }
                    }
                ],
            });
        }
    }

    loadCIFList();
})