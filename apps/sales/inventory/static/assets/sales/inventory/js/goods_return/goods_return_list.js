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
                            return []
                            // return resp.data['goods_return_list'] ? resp.data['goods_return_list'] : [];
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
                            return ``
                        }
                    },
                    {
                        data: 'sale_person',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        data: 'sale_order',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        data: 'delivery_mapped',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return ``
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `Done`
                        }
                    },
                ],
            });
        }
    }

    loadGoodsReturnList();
})