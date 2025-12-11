$(document).ready(function () {
    function loadARInvoiceList() {
        if (!$.fn.DataTable.isDataTable('#datatable_ar_invoice_list')) {
            let dtb = $('#datatable_ar_invoice_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 1,
                    rightColumns: window.innerWidth <= 768 ? 0 : 0
                },
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
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-5',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<span>${row?.['sale_order_mapped_data']?.['code'] || '--'}</span>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20',
                        render: (data, type, row) => {
                            if (row?.['customer_mapped_data']?.['id']) {
                                return `<span title="${row?.['customer_mapped_data']?.['name']}">${row?.['customer_mapped_data']?.['name']}</span>`
                            }
                            return ``
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'w-10',
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
                        className: 'w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
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