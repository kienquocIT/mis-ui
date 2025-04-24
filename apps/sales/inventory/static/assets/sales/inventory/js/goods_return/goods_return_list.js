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
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'w-25',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="text-primary"><b>${row.title}</b></a>`;
                        }
                    },
                    {
                        data: 'customer',
                        className: 'w-20',
                        render: (data, type, row) => {
                            return `${row?.['sale_order']?.['customer']?.['name']}`
                        }
                    },
                    {
                        data: 'sale_person',
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `${row?.['sale_order']?.['sale_person']?.['fullname']}`
                        }
                    },
                    {
                        data: 'sale_order',
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<button type="button" class="btn btn-sm btn-light">
                                ${row?.['sale_order']?.['code']} <span class="badge badge-sm badge-secondary">${row?.['delivery']?.['code']}</span>
                            </button>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return `${moment(row.date_created.split(' ')[0]).format('DD/MM/YYYY')}`
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

    loadGoodsReturnList();
})