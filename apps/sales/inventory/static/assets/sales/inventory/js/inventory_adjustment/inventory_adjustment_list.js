$(document).ready(function () {
    function loadIAList() {
        if (!$.fn.DataTable.isDataTable('#inventory_adjustment_list')) {
            let dtb = $('#inventory_adjustment_list');
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
                            return resp.data['inventory_adjustment_list'] ? resp.data['inventory_adjustment_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'w-30',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary fw-bold">${row.title}</span></a>`
                        }
                    },
                    {
                        data: 'warehouses',
                        className: 'w-30',
                        render: (data, type, row) => {
                            let html = ``;
                            for (let i = 0; i < row?.['warehouses'].length; i++) {
                                html = html + `<span class="badge badge-light mr-1 mb-1">${row?.['warehouses'][i]['warehouse_title']}</span>`
                            }
                            return html;
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `${moment(row.date_created.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY')}`
                        }
                    },
                    {
                        data: 'state_detail',
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return `<span class="text-muted">${data}</span>`
                        }
                    },
                ],
            });
        }
    }

    loadIAList();
})