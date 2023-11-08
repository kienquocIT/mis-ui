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
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span><b>` + row.title + `</b></span>`
                        }
                    },
                    {
                        data: 'warehouses',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let html = ``;
                            for (let i = 0; i < row?.['warehouses'].length; i++) {
                                html = html + `<span class="badge badge-soft-primary mr-1 mb-1">${row?.['warehouses'][i]['warehouse_title']}</span>`
                            }
                            return html;
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span>` + row.date_created.split(' ')[0] + `</span>`
                        }
                    },
                ],
            });
        }
    }

    loadIAList();
})