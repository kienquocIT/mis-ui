$(function () {
    $(document).ready(function () {
        $('#create_purchase_quotation_button').on('click', function () {
            $.fn.redirectUrl($(this).attr('data-redirect'), 500);
        })

        function loadPQRList() {
            if (!$.fn.DataTable.isDataTable('#datatable_pq_list')) {
                let dtb = $('#datatable_pq_list');
                let frm = new SetupFormSubmit(dtb);
                dtb.DataTableDefault({
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
                            data: 'code',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return `<span class="text-secondary">` + row.code + `</span>`
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-25',
                            render: (data, type, row, meta) => {
                                return `<a class="link-primary underline_hover" target="_blank" href="` + $('#datatable_pq_list').attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
                            }
                        },
                        {
                            data: 'purchase_quotation_request w-25',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (Object.keys(row.purchase_quotation_request_mapped).length != 0) {
                                    return `<span class="badge badge-secondary mr-1 mb-1 w-80">${row.purchase_quotation_request_mapped.code}</span>`;
                                }
                                else {
                                    return ``;
                                }
                            }
                        },
                        {
                            data: 'supplier_mapped w-15',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return row.supplier_mapped.name;
                            }
                        },
                        {
                            data: 'expiration_date w-15',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return row.expiration_date.split(' ')[0];
                            }
                        },
                        {
                            data: 'status',
                            className: 'wrap-text w-10',
                            render: (data, type, row, meta) => {
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