$(document).ready(function () {
    const trans_script = $('#trans-script')
    function loadBOMList() {
        if (!$.fn.DataTable.isDataTable('#prj-bom-list-table')) {
            let dtb = $('#prj-bom-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
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
                    data: {
                        'for_opp_space': true
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
                        className: 'w-10',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'w-25',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-10',
                        'render': (data, type, row) => {
                            if (row?.['bom_type'] === 0) {
                                return `<span>${trans_script.attr('data-trans-for-production')} ${row?.['for_outsourcing'] ? `<span class="text-primary">(${trans_script.attr('data-trans-outsourcing')})</span>` : ''}</span>`;
                            }
                            else if (row?.['bom_type'] === 1) {
                                return `<span>${trans_script.attr('data-trans-for-service')}</span>`;
                            }
                            else if (row?.['bom_type'] === 2) {
                                return `<span>${trans_script.attr('data-trans-for-sale')}</span>`;
                            }
                            else if (row?.['bom_type'] === 3) {
                                return `<span>${trans_script.attr('data-trans-for-internal-expense')}</span>`;
                            }
                            else if (row?.['bom_type'] === 4) {
                                return `<span>${trans_script.attr('data-trans-for-opp')}</span>`;
                            }
                            return ''
                        }
                    },
                    {
                        className: 'w-10',
                        'render': (data, type, row) => {
                            return `<span><a class="link-muted underline_hover" target="_blank" href="${dtb.attr('data-url-opp-detail').replace('0', row?.['opportunity']?.['id'])}">${row?.['opportunity']?.['code']}</a></span>`
                        }
                    },
                    {
                        className: 'w-15',
                        'render': (data, type, row) => {
                            return `<span>${parseFloat(row?.['sum_time'].toFixed(2))} (h)</span>`;
                        }
                    },
                    {
                        className: 'w-15',
                        'render': (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${row?.['sum_price']}"></span>`;
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