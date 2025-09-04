$('document').ready(function () {
    function loadServiceOrderList() {
        if (!$.fn.DataTable.isDataTable('#table-service-order')) {
            const $tb = $('#table-service-order');
            $tb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: $tb.attr('data-url'),
                    type: 'GET',
                    dataSrc: "data.service_order_list"
                },
                columns: [
                    {
                        className: "w-5",
                        render: () => {
                            return ""
                        }
                    },
                    {
                        className: "ellipsis-cell-lg w-10",
                        render: (data, type, row) => {
                            const link = $tb.attr('data-url-detail').replace('0', row?.['id']);
                            const code = row?.['code'] || '--';
                            return `<a href="${link}" class="link-primary underline_hover" title="${code}">${code}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20', render: (data, type, row) => {
                            const link = $tb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" 
                                    class="link-primary underline_hover" 
                                    title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: "w-20",
                        render: (data, type, row) => {
                            return row?.['customer_data']?.['name'] || '';
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                           return ''
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['end_date'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                           return ''
                        }
                    },
                    {
                        className: "w-10",
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    }
                ],
            })
        }
    }

    loadServiceOrderList();
});
