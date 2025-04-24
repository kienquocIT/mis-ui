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
                                // console.log(resp.data['purchase_quotation_list'])
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
                            className: 'w-10',
                            render: (data, type, row) => {
                                const link = dtb.attr('data-url-detail').replace('0', row.id);
                                return `<a href="${link}" class="link-primary underline_hover">${row?.['code'] || '--'}</a>`;
                            }
                        },
                        {
                            data: 'title',
                            className: 'w-30',
                            render: (data, type, row) => {
                                return `<span><b>` + row.title + `</b></span>`
                            }
                        },
                        {
                            data: 'purchase_quotation_request',
                            className: 'w-15',
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
                            className: 'w-25',
                            render: (data, type, row) => {
                                return row.supplier_mapped.name;
                            }
                        },
                        {
                            data: 'expiration_date',
                            className: 'w-10',
                            render: (data, type, row) => {
                                return moment(row.expiration_date.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY');
                            }
                        },
                        {
                            data: 'status',
                            className: 'w-10',
                            render: () => {
                                return `<span class="badge badge-soft-success w-80" id="status">Open</span>`
                            }
                        },
                    ],
                });
            }
        }

        loadPQRList();
    })
})