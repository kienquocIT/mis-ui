$(document).ready(function () {
    function loadRAList() {
        if (!$.fn.DataTable.isDataTable('#dtbReturnAdvance')) {
            let dtb = $('#dtbReturnAdvance');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                reloadCurrency: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            // console.log(resp.data['return_advances'])
                            return resp.data['return_advances'] ? resp.data['return_advances'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-25',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<a class="badge badge-light" target="_blank" href="${dtb.attr('data-url-detail-ap').replace('0', row?.['advance_payment']?.['id'])}">${row?.['advance_payment']?.['code']}</a>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-10',
                        render: (data, type, row) => {
                            return `<span title="${row?.['advance_payment']?.['sale_code'] || '--'}">${row?.['advance_payment']?.['sale_code'] || '--'}</span>`
                        }
                    },

                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="${row?.['return_total']}"></span>`
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
                    },
                ],
            });
        }
    }

    loadRAList();
})