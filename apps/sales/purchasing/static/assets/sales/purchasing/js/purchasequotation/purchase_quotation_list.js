$(function () {
    $(document).ready(function () {
        function loadPQRList() {
            if (!$.fn.DataTable.isDataTable('#datatable_pq_list')) {
                let dtb = $('#datatable_pq_list');
                let frm = new SetupFormSubmit(dtb);
                dtb.DataTableDefault({
                    rowIdx: true,
                    reloadCurrency: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                console.log(resp.data['purchase_quotation_list'])
                                return resp.data['purchase_quotation_list'] ? resp.data['purchase_quotation_list'] : [];
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
                            className: 'wrap-text w-15',
                            render: (data, type, row) => {
                                const link = dtb.attr('data-url-detail').replace('0', row.id);
                                return `<a href="${link}" class="badge badge-soft-primary w-70">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`;
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-25',
                            render: (data, type, row) => {
                                return `<span><b>` + row.title + `</b></span>`
                            }
                        },
                        {
                            data: 'purchase_quotation_request',
                            className: 'wrap-text w-15',
                            render: (data, type, row) => {
                                if (Object.keys(row.purchase_quotation_request_mapped).length != 0) {
                                    return `<span class="badge badge-secondary mr-1 mb-1 w-80">${row.purchase_quotation_request_mapped.code}</span>`;
                                }
                                else {
                                    return ``;
                                }
                            }
                        },
                        {
                            data: 'supplier_mapped',
                            className: 'wrap-text w-20',
                            render: (data, type, row) => {
                                return row.supplier_mapped.name;
                            }
                        },
                        {
                            data: 'expiration_date',
                            className: 'wrap-text w-15',
                            render: (data, type, row) => {
                                return row.expiration_date.split(' ')[0];
                            }
                        },
                        {
                            data: 'status',
                            className: 'wrap-text w-10',
                            render: () => {
                                return `<span class="text-success" id="status">Open</span>`
                            }
                        },
                    ],
                });
            }
        }

        loadPQRList();
    })
})