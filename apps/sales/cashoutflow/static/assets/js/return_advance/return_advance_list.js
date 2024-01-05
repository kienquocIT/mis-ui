$(document).ready(function () {
    function loadRAList() {
        if (!$.fn.DataTable.isDataTable('#dtbReturnAdvance')) {
            let dtb = $('#dtbReturnAdvance');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                reloadCurrency: true,
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            console.log(resp.data['return_advances'])
                            return resp.data['return_advances'] ? resp.data['return_advances'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        targets: 0,
                        render: () => {
                            return ``
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
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
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<a class="link-danger underline_hover" target="_blank" href="` + $('#dtbReturnAdvance').attr('data-url-detail-ap').replace('0', row.advance_payment.id) + `">` + row.advance_payment.code + `</a>`
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
                        data: 'return_total',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="mask-money text-primary" data-init-money="{0}"></span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'money_received',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<div>
                                        <span class="badge-status">
                                            <span class="badge badge-primary badge-indicator"></span>
                                            <span class="badge-label">${row.money_received}</span>
                                        </span>
                                    </div>`
                        }
                    },
                    {
                        data: 'status',
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
                    },
                ],
            });
        }
    }

    loadRAList();
})