$(document).ready(function () {
    function loadGoodsReturnList() {
        if (!$.fn.DataTable.isDataTable('#goods_return_list')) {
            let dtb = $('#goods_return_list');
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
                            return resp.data['goods_return_list'] ? resp.data['goods_return_list'] : [];
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
                            return `<a href="${link}" class="badge badge-primary w-70">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="text-primary"><b>${row.title}</b></a>`;
                        }
                    },
                    {
                        data: 'customer',
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            return `${row?.['sale_order']?.['customer']?.['name']}`
                        }
                    },
                    {
                        data: 'sale_person',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `${row?.['sale_order']?.['sale_person']?.['fullname']}`
                        }
                    },
                    {
                        data: 'sale_order',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<button type="button" class="btn btn-sm btn-light">
                                ${row?.['sale_order']?.['code']} <span class="badge badge-sm badge-secondary">${row?.['delivery']?.['code']}</span>
                            </button>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text text-center w-10',
                        render: (data, type, row) => {
                            return `${moment(row.date_created.split(' ')[0]).format('DD/MM/YYYY')}`
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

    loadGoodsReturnList();
})