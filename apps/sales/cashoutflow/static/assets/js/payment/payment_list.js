$(document).ready(function () {
    function loadAdvanceList() {
        if (!$.fn.DataTable.isDataTable('#datatable_payment_list')) {
            let dtb = $('#datatable_payment_list');
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
                            return resp.data['payment_list'] ? resp.data['payment_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        'render': (data, type, row, meta) => {
                            return ``;
                        }
                    }, {
                        data: 'code',
                        className: 'wrap-text w-15',
                        render: (data, type, row, meta) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="text-primary">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary"><b>${row.title}</b></span></a>`
                        }
                    },
                    {
                        data: 'type',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            if (!row.supplier) {
                                return `<span class="badge badge-sm badge-soft-blue">Internal</span>`;
                            }
                            return `<span class="badge badge-sm badge-soft-danger">Supplier</span>`;
                        }
                    },
                    {
                        data: 'sale_code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (Object.keys(row.opportunity_mapped).length !== 0) {
                                return `Opp <span><a class="link-secondary underline_hover" target="_blank" href="${dtb.attr('data-url-opp-detail').replace('0', row.opportunity_mapped.id)}"><b>${row.opportunity_mapped.title}</b></a></span>`
                            }
                            else if (Object.keys(row.quotation_mapped).length !== 0) {
                                return `Quo <span><a class="link-secondary underline_hover" target="_blank" href="${dtb.attr('data-url-quo-detail').replace('0', row.quotation_mapped.id)}"><b>${row.quotation_mapped.title}</b></a></span>`
                            }
                            else if (Object.keys(row.sale_order_mapped).length !== 0) {
                                return `SO <span><a class="link-secondary underline_hover" target="_blank" href="${dtb.attr('data-url-so-detail').replace('0', row.sale_order_mapped.id)}"><b>${row.sale_order_mapped.title}</b></a></span>`
                            }
                            else {
                                return ''
                            }
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        data: 'payment_value',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.payment_value + `"></span>`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let approved_trans = ``
                            let text_color = ``
                            if (row.system_status === 0) {
                                approved_trans = 'Draft'
                                text_color = 'badge-secondary'
                            }
                            else if (row.system_status === 1) {
                                approved_trans = 'Created'
                                text_color = 'badge-primary'
                            }
                            else if (row.system_status === 2) {
                                approved_trans = 'Added'
                                text_color = 'badge-blue'
                            }
                            else if (row.system_status === 3) {
                                approved_trans = 'Finish'
                                text_color = 'badge-success'
                            }
                            else if (row.system_status ===4) {
                                approved_trans = 'Cancel'
                                text_color = 'badge-danger'
                            }
                            return `<span class="badge ${text_color}">` + approved_trans + `</span>`
                        }
                    }
                ],
            });
        }
    }

    loadAdvanceList();
})