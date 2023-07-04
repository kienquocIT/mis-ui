$(document).ready(function () {
    function loadShipping() {
        if (!$.fn.DataTable.isDataTable('#dtbReturnAdvance')) {
            let dtb = $('#dtbReturnAdvance');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                reloadCurrency: true,
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
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="text-secondary">` + row.code + `</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<a class="link-primary underline_hover" target="_blank" href="` + $('#dtbReturnAdvance').attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
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
                            let waiting_trans = $('#dtbReturnAdvance').attr('data-type-translate-waiting')
                            let received_trans = $('#dtbReturnAdvance').attr('data-type-translate-received')
                            if (row.money_received === 'Waiting') {
                                return `<span class="badge badge-soft-warning badge-outline w-50">` + waiting_trans + `</span>`
                            }
                            else {
                                return `<span class="badge badge-soft-blue badge-outline w-50">` + received_trans + `</span>`
                            }

                        }
                    },
                    {
                        data: 'status',
                        render: (data, type, row) => {
                            let approved_trans = $('#dtbReturnAdvance').attr('data-type-translate-approved')
                            if (row.money_received === 'Received') {
                                return `<span class="text-success">` + approved_trans + `&nbsp;<i class="bi bi-check2-circle"></i></span>`
                            }
                            if (row.money_received === 'Waiting') {
                                return `<span class="text-success">` + approved_trans + `</span>`
                            }
                        },
                    },

                ],
            });
        }
    }
    loadShipping();
})