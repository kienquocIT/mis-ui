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
                        className: 'wrap-text w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="badge badge-soft-primary w-70">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'customer',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="text-primary"><b>${row.title}</b></a>`;
                        }
                    },
                    {
                        data: 'sale_person',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `${row?.['sale_order']?.['sale_person']?.['fullname']}`
                        }
                    },
                    {
                        data: 'sale_order',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="badge badge-blue badge-sm">${row?.['sale_order']?.['code']}</span>&nbsp;${row?.['sale_order']?.['title']}`
                        }
                    },
                    {
                        data: 'delivery_mapped',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<i class="bi bi-truck"></i>&nbsp;&nbsp;<span class="text-secondary"><b>${row?.['delivery']?.['code']}</b></span>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `${row.date_created.split(' ')[0]}`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="badge-success badge">Done</span>`
                        }
                    },
                ],
            });
        }
    }

    loadGoodsReturnList();
})