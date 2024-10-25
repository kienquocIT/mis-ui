$(document).ready(function () {
    function loadGoodsTransferList() {
        if (!$.fn.DataTable.isDataTable('#goods_transfer_list_table')) {
            let dtb = $('#goods_transfer_list_table');
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
                            return resp.data['goods_transfer_list'] ? resp.data['goods_transfer_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'wrap-text',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="badge badge-primary w-70">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-50',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary"><b>${row.title}</b></span></a>`
                        }
                    },
                    {
                        data: 'date_transfer',
                        className: 'wrap-text text-center w-30',
                        render: (data, type, row) => {
                            return moment(data.split(' ')[0]).format('DD/MM/YYYY')
                        }
                    },
                    {
                        data: 'system_status',
                        className: 'wrap-text text-center w-10',
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

    loadGoodsTransferList();
})