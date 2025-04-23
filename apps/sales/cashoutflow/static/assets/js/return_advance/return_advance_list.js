$(document).ready(function () {
    function loadRAList() {
        if (!$.fn.DataTable.isDataTable('#dtbReturnAdvance')) {
            let dtb = $('#dtbReturnAdvance');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                reloadCurrency: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '75vh',
                scrollCollapse: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            // console.log(resp.data['return_advances'])
                            return resp.data['return_advances'] ? resp.data['return_advances'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'wrap-text w-5',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="badge badge-primary">${row?.['code']}</a>`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary"><b>${row?.[['title']]}</b></span></a>`
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<a class="badge badge-light" target="_blank" href="${dtb.attr('data-url-detail-ap').replace('0', row?.['advance_payment']?.['id'])}">${row?.['advance_payment']?.['code']}</a>`
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `${row?.['advance_payment']?.['sale_code']}`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text w-10',
                        render: (data) => {
                            return $x.fn.displayRelativeTime(data, {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        data: 'return_total',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="${row?.['return_total']}"></span>`
                        }
                    },
                    {
                        data: 'money_received',
                        className: 'wrap-text w-10',
                        render: (data, type, row,) => {
                            if (row?.['money_received']) {
                                return `<span class="text-muted small">${dtb.attr('data-type-translate-received')}</span>`
                            }
                            else {
                                return `<span class="text-muted small">${dtb.attr('data-type-translate-waiting')}</span>`
                            }
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
                    },
                ],
            });
        }
    }

    loadRAList();
})