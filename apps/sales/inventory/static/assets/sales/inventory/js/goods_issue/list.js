$(document).ready(function () {
    function loadDtb() {
        if (!$.fn.DataTable.isDataTable('#dtbGoodsIssue')) {
            let dtb = $('#dtbGoodsIssue')
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
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
                        if (data && resp.data.hasOwnProperty('goods_issue_list')) {
                            return resp.data['goods_issue_list'] ? resp.data['goods_issue_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        data: 'code',
                        render: (data, type, row) => {
                            return ``;
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
                        className: 'ellipsis-cell-lg w-30',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-20',
                        render: (data, type, row) => {
                            let type_trans = [
                                dtb.attr('data-trans-ia'),
                                dtb.attr('data-trans-liquidation'),
                                dtb.attr('data-trans-production'),
                                dtb.attr('data-trans-product-modification'),
                                dtb.attr('data-trans-fixed-asset'),
                            ]
                            return `<span class="text-muted fst-italic">${type_trans[row?.['goods_issue_type']]}</span>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status'], row?.['system_auto_create']);
                        }
                    },
                ],
            });
        }
    }
    loadDtb();
})
