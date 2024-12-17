$(document).ready(function () {
    const trans_script = $('#trans-script')
    function loadBOMList() {
        if (!$.fn.DataTable.isDataTable('#prj-bom-list-table')) {
            let dtb = $('#prj-bom-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '75vh',
                scrollCollapse: true,
                reloadCurrency: true,
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
                        className: 'wrap-text w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="badge badge-primary">${row?.['code']}</a>`;
                        }
                    },
                    {
                        className: 'wrap-text w-25',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="text-primary"><b>${row?.['title']}</b></a>`;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
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
                            else if (row?.['bom_type'] === 4) {
                                return `<span class="fst-italic">${trans_script.attr('data-trans-for-opp')}</span>`;
                            }
                            return ''
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        'render': (data, type, row) => {
                            return `<span><a class="link-muted underline_hover" target="_blank" href="${dtb.attr('data-url-opp-detail').replace('0', row?.['opportunity']?.['id'])}">${row?.['opportunity']?.['code']}</a></span>`
                        }
                    },
                    {
                        className: 'wrap-text w-15',
                        'render': (data, type, row) => {
                            return `<span>${parseFloat(row?.['sum_time'].toFixed(2))} (h)</span>`;
                        }
                    },
                    {
                        className: 'wrap-text w-15',
                        'render': (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${row?.['sum_price']}"></span>`;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let approved_trans = ``
                            let text_color = ``
                            if (row?.['system_status'] === 0) {
                                approved_trans = 'Draft'
                                text_color = 'badge-soft-secondary'
                            }
                            else if (row?.['system_status'] === 1) {
                                approved_trans = 'Created'
                                text_color = 'badge-soft-primary'
                            }
                            else if (row?.['system_status'] === 2) {
                                approved_trans = 'Added'
                                text_color = 'badge-soft-blue'
                            }
                            else if (row?.['system_status'] === 3) {
                                approved_trans = 'Finish'
                                text_color = 'badge-soft-success'
                            }
                            else if (row?.['system_status'] === 4) {
                                approved_trans = 'Cancel'
                                text_color = 'badge-soft-danger'
                            }
                            return `<span class="w-100 badge ${text_color}">` + approved_trans + `</span>`
                        }
                    },
                ],
            });
        }
    }

    loadBOMList();
})