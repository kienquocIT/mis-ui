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
                        className: 'wrap-text w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`;
                        }
                    },
                    {
                        className: 'wrap-text w-30',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary" data-id="${row?.['id']}" data-title="${row?.['title']}"><b>${row?.['title']}</b></span></a>`
                        }
                    },
                    {
                        className: 'wrap-text w-10',
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
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            if (row?.['supplier_mapped_data']?.['id']) {
                                return `${row?.['supplier_mapped_data']?.['name']}`
                            }
                            return ``
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return row?.['date_created'] ? moment(row?.['date_created'], 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
                        }
                    },
                    {
                        className: 'wrap-text text-center w-10',
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

    loadARInvoiceList();
})