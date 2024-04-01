$(document).ready(function () {
    function loadARInvoiceList() {
        if (!$.fn.DataTable.isDataTable('#datatable_ar_invoice_list')) {
            let dtb = $('#datatable_ar_invoice_list');
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
                            console.log(resp.data['ar_invoice_list'])
                            return resp.data['ar_invoice_list'] ? resp.data['ar_invoice_list'] : [];
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
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary ap_info" data-id="${row.id}" data-title="${row.title}"><b>${row.title}</b></span></a>`
                        }
                    },
                    {
                        data: 'sale_order',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (row?.['sale_order_mapped']?.['id']) {
                                return `<span class="badge badge-soft-primary">${row?.['sale_order_mapped']?.['code']}</span> ${row?.['sale_order_mapped']?.['title']}`
                            }
                            else {
                                return ``
                            }
                        }
                    },
                    {
                        data: 'supplier',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (row?.['customer_mapped']?.['id']) {
                                return `<b>${row?.['customer_mapped']?.['name']}</b>`
                            }
                            else if (row?.['customer_name']) {
                                return `${row?.['customer_name']}`
                            }
                            else {
                                return `${row?.['buyer_name']}`
                            }
                        }
                    },
                    {
                        data: 'invoice_number',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `${row.invoice_number}`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="badge badge-primary">Created</span>`;
                        }
                    },
                ],
            });
        }
    }

    loadARInvoiceList();
})