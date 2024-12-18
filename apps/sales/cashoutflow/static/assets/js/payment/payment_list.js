$(document).ready(function () {
    function loadPaymentList() {
        if (!$.fn.DataTable.isDataTable('#datatable_payment_list')) {
            let dtb = $('#datatable_payment_list');
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
                            return resp.data['payment_list'] ? resp.data['payment_list'] : [];
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
                            return `<a href="${link}" class="badge badge-primary">${row?.['code']}</a>`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary"><b>${row?.['title']}</b></span></a>`
                        }
                    },
                    {
                        data: 'type',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            if (row?.['supplier']) {
                                return `<span class="text-muted small">${dtb.attr('data-trans-supplier')}</span>`;
                            }
                            return `<span class="text-muted small">${dtb.attr('data-trans-internal')}</span>`;
                        }
                    },
                    {
                        data: 'employee_inherit',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<span class="text-blue">${row?.['employee_inherit']?.['full_name']}</span>`;
                        }
                    },
                    {
                        data: 'sale_code',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            if (row?.['opportunity']?.['id']) {
                                return `${row?.['opportunity']?.['code']}`
                            }
                            else if (row?.['quotation_mapped']?.['id']) {
                                return `${row?.['quotation_mapped']?.['code']}`
                            }
                            else if (row?.['sale_order_mapped']?.['id']) {
                                return `${row?.['sale_order_mapped']?.['code']}`
                            }
                            return ''
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
                        data: 'payment_value',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="${row?.['payment_value']}"></span>`
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

    loadPaymentList();
})