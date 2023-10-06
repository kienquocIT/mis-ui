$(document).ready(function () {
    function loadShipping() {
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
                            return `<a href="${link}" class="badge badge-soft-primary w-70">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span><b>` + row.title + `</b></span>`
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
                            return `<span>{0}</span>`.format_by_idx(
                                data.split(" ")[0]
                            )
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
                            if (row.money_received === 'Waiting') {
                                return `<span class="badge badge-soft-warning badge-outline">${data}</span>`
                            } else {
                                return `<span class="badge badge-soft-blue badge-outline">${data}</span>`
                            }

                        }
                    },
                    {
                        data: 'status',
                        render: (data, type, row) => {
                            if (row.money_received === 'Received') {
                                return `<span class="text-success">${data}<i class="bi bi-check2-circle"></i></span>`
                            }
                            if (row.money_received === 'Waiting') {
                                return `<span class="text-success">${data}</span>`
                            }
                        },
                    },

                ],
            });
        }
    }

    loadShipping();
})