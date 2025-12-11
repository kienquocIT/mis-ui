$(document).ready(function () {
    function loadIncomingDocumentList() {
        if (!$.fn.DataTable.isDataTable('#tbl_incoming_document')) {
            const $tb = $('#tbl_incoming_document')
            $tb.DataTableDefault({
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
                    url: $tb.attr('data-url'),
                    type: 'GET',
                    dataSrc: "data.incoming_document_list"
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
                        className: "w-10",
                        render: () => {
                            return ""
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-30', render: (data, type, row) => {
                            const link = $tb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: "w-30",
                        render: (data, type, row) => {
                            return row?.['sender'] || ''
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                ],
            })
        }
    }

    loadIncomingDocumentList();
});
