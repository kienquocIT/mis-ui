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
                            // console.log(resp.data['ap_invoice_list'])
                            return resp.data['ap_invoice_list'] ? resp.data['ap_invoice_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-30',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary" data-id="${row?.['id']}" data-title="${row?.['title']}"><b>${row?.['title']}</b></span></a>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            if (row?.['purchase_order_mapped_data']?.['id']) {
                                return `<span class="badge badge-soft-secondary badge-outline badge-sm">${row?.['purchase_order_mapped_data']?.['code']}</span>`
                            }
                            else {
                                return ``
                            }
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-25',
                        render: (data, type, row) => {
                            if (row?.['supplier_mapped_data']?.['id']) {
                                return `${row?.['supplier_mapped_data']?.['name']}`
                            }
                            return ``
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                ],
            });
        }
    }

    loadARInvoiceList();
})