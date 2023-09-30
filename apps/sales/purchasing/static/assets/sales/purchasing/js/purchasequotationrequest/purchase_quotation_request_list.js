$(function () {
    $(document).ready(function () {
        $('#btn_redirect_create_new_purchase_quotation_request_from_pr').on('click', function () {
            $.fn.redirectUrl($(this).attr('data-redirect'), 500);
        })

        $('#btn_redirect_create_new_purchase_quotation_request_manual').on('click', function () {
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
                            render: (data, type, row) => {
                                return `<span class="text-secondary">` + row.code + `</span>`
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-25',
                            render: (data, type, row) => {
                                return `<a class="link-primary underline_hover" target="_blank" href="` + $('#datatable_pqr_list').attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
                            }
                        },
                        {
                            data: 'purchase_requests w-15',
                            className: 'wrap-text',
                            render: (data, type, row) => {
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
                            render: (data, type, row) => {
                                return row.delivered_date.split(' ')[0];
                            }
                        },
                        {
                            data: 'status',
                            className: 'wrap-text w-15',
                            render: () => {
                                return `<span class="text-success" id="status">Open</span>`
                            }
                        },
                        {
                            data: 'response_status w-10',
                            className: 'wrap-text',
                            render: () => {
                                return `<span class="text-primary" id="response_status">Wait</span>`
                            }
                        },
                        {
                            data: '',
                            className: 'wrap-text w-5',
                            render: (data, type, row) => {
                                return `<div class="dropdown">
                                            <a type="button" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></a>
                                            <div class="dropdown-menu">
                                                 <a href="` + $('#datatable_pqr_list').attr('data-url-purchase-quotation') + `?purchase-quotation-request=` + row.id + `" class="dropdown-item" href="{1}">Purchase Quotation</a>
                                            </div>
                                        </div>`;
                            }
                        }
                    ],
                });
            }
        }

        loadPQRList();
    })
})