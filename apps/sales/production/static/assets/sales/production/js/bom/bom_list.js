$(document).ready(function () {
    function loadBOMList() {
        if (!$.fn.DataTable.isDataTable('#bom-list-table')) {
            let dtb = $('#bom-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                ajax: {
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
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="badge badge-primary w-70">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        className: 'wrap-text w-40',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="text-primary"><b>${row?.['product']?.['title']}</b></a>`;
                        }
                    },
                    {
                        className: 'wrap-text w-20 text-center',
                        'render': (data, type, row) => {
                            return `<span>${row?.['sum_time']} (h)</span>`;
                        }
                    },
                    {
                        className: 'wrap-text w-20 text-center',
                        'render': (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${row?.['sum_price']}"></span>`;
                        }
                    },
                    {
                        className: 'wrap-text w-10 text-center',
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