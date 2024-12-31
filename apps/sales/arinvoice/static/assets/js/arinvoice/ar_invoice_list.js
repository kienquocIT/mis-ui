$(document).ready(function () {
    function loadARInvoiceList() {
        if (!$.fn.DataTable.isDataTable('#datatable_ar_invoice_list')) {
            let dtb = $('#datatable_ar_invoice_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['ar_invoice_list'] ? resp.data['ar_invoice_list'] : [];
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
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary" data-id="${row?.['id']}" data-title="${row?.['title']}"><b>${row?.['title']}</b></span></a>`
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            if (row?.['sale_order_mapped']?.['id']) {
                                return `<span class="badge badge-soft-blue badge-outline badge-sm">${row?.['sale_order_mapped']?.['code']}</span>`
                            }
                            else {
                                return ``
                            }
                        }
                    },
                    {
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            if (row?.['customer_mapped']?.['id']) {
                                return `${row?.['customer_mapped']?.['name']}`
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
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `${row?.['invoice_number'] !== '0' ? `<span class="text-primary">${row?.['invoice_number']}</span>` : `<span class="text-danger small">Chưa cấp số</span>`}`
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let color = [
                                'text-blue',
                                'text-primary',
                                'text-info',
                                'text-danger',
                                'text-warning'
                            ]
                            return `<span class="${color[row?.['invoice_status']]}">${[
                                'Khởi tạo', 'Đã phát hành', 'Đã kê khai', 'Đã thay thế', 'Đã điều chỉnh'
                            ][row?.['invoice_status']]}</span>`;
                        }
                    },
                ]
            });
        }
    }

    loadARInvoiceList();

    $('#reload-invoice-status-btn').on('click', function () {
        WindowControl.showLoading();
        let url_loaded = $('#datatable_ar_invoice_list').attr('data-url') + `?update_status=true`
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    WindowControl.hideLoading();
                    $.fn.notifyB({description: "Update successfully"}, 'success')
                    setTimeout(() => {
                        window.location.replace($('#datatable_ar_invoice_list').attr('data-url-redirect'));
                        location.reload.bind(location);
                    }, 1000);
                }
            },
            (errs) => {
                setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    1000
                )
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            })
    })
})