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
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}"><span class="text-primary" data-id="${row?.['id']}" data-title="${row?.['title']}"><b>${row?.['title']}</b></span></a>`
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            if (row?.['sale_order_mapped_data']?.['id']) {
                                return `<span class="badge badge-soft-secondary badge-outline badge-sm">${row?.['sale_order_mapped_data']?.['code']}</span>`
                            }
                            else {
                                return ``
                            }
                        }
                    },
                    {
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            if (row?.['customer_mapped_data']?.['id']) {
                                return `${row?.['customer_mapped_data']?.['name']}`
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