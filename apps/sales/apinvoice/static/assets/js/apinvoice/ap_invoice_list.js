$(document).ready(function () {
    function loadARInvoiceList() {
        if (!$.fn.DataTable.isDataTable('#datatable_ap_invoice_list')) {
            let dtb = $('#datatable_ap_invoice_list');
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
                            console.log(resp.data['ap_invoice_list'])
                            return resp.data['ap_invoice_list'] ? resp.data['ap_invoice_list'] : [];
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
                        data: 'po',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="badge badge-soft-primary">${row?.['po_mapped']?.['code']}</span> ${row?.['po_mapped']?.['title']}`
                        }
                    },
                    {
                        data: 'supplier',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (row?.['supplier_mapped']) {
                                return `${row?.['supplier_mapped']?.['name']}`
                            }
                            return `${row?.['supplier_name']}`
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
                            return `<span class="badge badge-success">Open</span>`;
                        }
                    },
                ],
            });
        }
    }

    loadARInvoiceList();
})