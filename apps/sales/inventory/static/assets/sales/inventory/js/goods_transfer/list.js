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
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'ellipsis-cell-xs w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'w-50',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary"><b>${row.title}</b></span></a>`
                        }
                    },
                    {
                        data: 'date_transfer',
                        className: 'text-center w-30',
                        render: (data, type, row) => {
                            return moment(data.split(' ')[0]).format('DD/MM/YYYY')
                        }
                    },
                    {
                        data: 'system_status',
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                ],
            });
        }
    }

    loadGoodsTransferList();
})