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
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="text-secondary">` + row.code + `</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<a class="link-primary underline_hover" target="_blank" href="` + dtb.attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
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