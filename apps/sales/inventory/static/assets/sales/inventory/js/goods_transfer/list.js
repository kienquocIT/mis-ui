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
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary"><b>${row.title}</b></span></a>`
                        }
                    },
                    {
                        data: 'date_transfer',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return moment(data.split(' ')[0]).format('DD/MM/YYYY')
                        }
                    },
                    {
                        data: 'system_status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="badge badge-secondary">${data}</span>`
                        }
                    },
                ],
            });
        }
    }

    loadGoodsTransferList();
})