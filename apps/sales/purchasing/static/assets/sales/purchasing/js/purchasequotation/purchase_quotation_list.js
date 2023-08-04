$(function () {
    $(document).ready(function () {
        $('#create_purchase_quotation_button').on('click', function () {
            $.fn.redirectUrl($(this).attr('data-redirect'), 500);
        })

        function loadPQRList() {
            if (!$.fn.DataTable.isDataTable('#datatable_pqr_list')) {
                let dtb = $('#datatable_pqr_list');
                let frm = new SetupFormSubmit(dtb);
                dtb.DataTableDefault({
                    reloadCurrency: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                console.log(data)
                                return resp.data['purchase_quotation_request_list'] ? resp.data['purchase_quotation_request_list'] : [];
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
                            className: 'wrap-text w-25purchase_quotation_request_create_from_PR.html',
                            render: (data, type, row, meta) => {
                                return `<a class="link-primary underline_hover" target="_blank" href="` + $('#datatable_pqr_list').attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
                            }
                        },
                        {
                            data: 'purchase_requests w-25',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                let html = ``;
                                for (let i = 0; i < row.purchase_requests.length; i++) {
                                    html += `<span class="badge badge-secondary mr-1 mb-1 w-30">${row.purchase_requests[i].code}</span>`;
                                }
                                return html;
                            }
                        },
                        {
                            data: 'delivered_date w-15',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return row.delivered_date.split(' ')[0];
                            }
                        },
                        {
                            data: 'status',
                            className: 'wrap-text w-10',
                            render: (data, type, row, meta) => {
                                return `<span class="text-success" id="status">Open</span>`
                            }
                        },
                        {
                            data: 'response_status w-10',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="text-primary" id="response_status">Wait</span>`
                            }
                        }
                    ],
                });
            }
        }

        loadPQRList();
    })
})