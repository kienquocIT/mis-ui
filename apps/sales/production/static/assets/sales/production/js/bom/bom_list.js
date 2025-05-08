$(document).ready(function () {
    const trans_script = $('#trans-script')
    function loadBOMList() {
        if (!$.fn.DataTable.isDataTable('#bom-list-table')) {
            let dtb = $('#bom-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                ajax: {
                    data: {
                        'for_production_space': true,
                    },
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['bom_list'] ? resp.data['bom_list'] : [];
                        }
                        return [];
                    },
                },
                data: [],
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-10',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'w-20',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="text-primary"><b>${row?.['title']}</b></a>`;
                        }
                    },
                    {
                        className: 'w-15',
                        'render': (data, type, row) => {
                            if (row?.['bom_type'] === 0) {
                                return `<span class="fst-italic">${trans_script.attr('data-trans-for-production')} ${row?.['for_outsourcing'] ? `<span class="text-primary">(${trans_script.attr('data-trans-outsourcing')})</span>` : ''}</span>`;
                            }
                            else if (row?.['bom_type'] === 1) {
                                return `<span class="fst-italic">${trans_script.attr('data-trans-for-service')}</span>`;
                            }
                            else if (row?.['bom_type'] === 2) {
                                return `<span class="fst-italic">${trans_script.attr('data-trans-for-sale')}</span>`;
                            }
                            else if (row?.['bom_type'] === 3) {
                                return `<span class="fst-italic">${trans_script.attr('data-trans-for-internal-expense')}</span>`;
                            }
                            return ''
                        }
                    },
                    {
                        className: 'w-10',
                        'render': (data, type, row) => {
                            return `<span>${parseFloat(row?.['sum_time'].toFixed(2))} (h)</span>`;
                        }
                    },
                    {
                        className: 'w-10',
                        'render': (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${row?.['sum_price']}"></span>`;
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
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                ],
            });
        }
    }

    loadBOMList();
})