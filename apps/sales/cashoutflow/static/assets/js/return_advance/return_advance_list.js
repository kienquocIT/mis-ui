$(document).ready(function () {
    function loadShipping() {
        if (!$.fn.DataTable.isDataTable('#dtbReturnAdvance')) {
            let dtb = $('#dtbReturnAdvance');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
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
                        render: (data, type, row, meta) => {
                            return '';
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<a href="{0}"><span class="badge badge-soft-primary">{1}</span></a>`.format_by_idx(
                                frm.getUrlDetail(row.id), data
                            )
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span>{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span>{0}</span>`.format_by_idx(
                                row.advance_payment.code
                            )
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
                            return `<span class="mask-money" data-init-money="{0}"></span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'money_received',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span>{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'status',
                        render: (data, type, row) => {
                            return `<span>{0}</span>`.format_by_idx(
                                data
                            )
                        },
                    },

                ],
            });
        }
    }
    loadShipping();
})