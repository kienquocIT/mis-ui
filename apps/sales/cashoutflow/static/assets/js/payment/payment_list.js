$(document).ready(function () {
    function loadPaymentList() {
        if (!$.fn.DataTable.isDataTable('#datatable_payment_list')) {
            let dtb = $('#datatable_payment_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.removeAttr('width').DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['payment_list'] ? resp.data['payment_list'] : [];
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
                        className: 'ellipsis-cell-lg w-15',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            if (row?.['supplier']) {
                                return `<span>${dtb.attr('data-trans-supplier')}</span>`;
                            }
                            return `<span>${dtb.attr('data-trans-internal')}</span>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-10',
                        render: (data, type, row) => {
                            let target = row?.['supplier_data']?.['name'] || '--'
                            return `<span title="${target}">${target}</span>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-10',
                        render: (data, type, row) => {
                            return `<span title="${row?.['sale_code'] || '--'}">${row?.['sale_code'] || '--'}</span>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="${row?.['payment_value']}"></span>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_inherit']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    }
                ],
            });
        }
    }

    loadPaymentList();
})