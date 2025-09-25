$(document).ready(function () {
    function LoadPurchaseRequestList() {
        if (!$.fn.DataTable.isDataTable('#datatable-purchase-request')) {
            let $table = $('#datatable-purchase-request')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 2
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('purchase_request_list')) {
                            return resp.data['purchase_request_list'] ? resp.data['purchase_request_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-5',
                        render: (data, type, row) => {
                            let link = $('#url-factory').data('url-detail').format_url_with_uuid(row?.['id'])+`?type=${row?.['request_for']}`;
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20',
                        render: (data, type, row) => {
                            let link = $('#url-factory').data('url-detail').format_url_with_uuid(row?.['id'])+`?type=${row?.['request_for']}`;
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            let doc_code = ''
                            if (row?.['request_for'] === 0) {
                                doc_code = row?.['sale_order']?.['code'];
                            }
                            else if (row?.['request_for'] === 3) {
                                doc_code = row?.['distribution_plan']?.['code'];
                            }
                            return `<span>${row?.['request_for_string']}&nbsp;<span class="fw-bold">${doc_code}</span></span>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-15',
                        render: (data, type, row) => {
                            return `<p class="text-muted">${row?.['supplier']?.['title']}</p>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['delivered_date'], {'outputFormat': 'DD/MM/YYYY'});
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
                        className: 'text-center w-5',
                        render: (data, type, row) => {
                            let status_data = {
                                0: "text-blue",
                                1: "text-orange",
                                2: "text-success",
                            }
                            return `<span class="${status_data[row?.['purchase_status']]}">${row?.['purchase_status_string']}</span>`;
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

    LoadPurchaseRequestList();
})