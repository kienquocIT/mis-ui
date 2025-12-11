$(document).ready(function () {
    function loadServiceQuotationList() {
        if (!$.fn.DataTable.isDataTable('#table-service-quotation')) {
            const $tb = $('#table-service-quotation');
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
                    dataSrc: "data.service_quotation_list"
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
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-25', render: (data, type, row) => {
                            const link = $tb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: "ellipsis-cell-lg w-25",
                        render: (data, type, row) => {
                            return row?.['customer_data']?.['name'] || '';
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-5',
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
            })
        }
    }

    loadServiceQuotationList();
});
