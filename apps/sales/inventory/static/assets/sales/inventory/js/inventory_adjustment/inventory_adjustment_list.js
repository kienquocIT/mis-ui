$(document).ready(function () {
    function loadIAList() {
        if (!$.fn.DataTable.isDataTable('#inventory_adjustment_list')) {
            let dtb = $('#inventory_adjustment_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
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
                        className: 'ellipsis-cell-xs w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'w-30',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            let html = ``;
                            for (let i = 0; i < row?.['warehouses'].length; i++) {
                                let item = row?.['warehouses'][i]
                                html += `<span class="badge badge-sm badge-light mr-1">${item?.['code']}</span><span>${item?.['title']}</span><br>`
                            }
                            return html;
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<span class="${['text-primary', 'text-blue', 'text-success'][row?.['state']]}">${row?.['state_detail']} ${['<i class="fa-solid fa-calendar-plus"></i>', '<i class="fa-solid fa-spinner"></i>', '<i class="fa-solid fa-check"></i>'][row?.['state']]}</span>`
                        }
                    }
                ],
            });
        }
    }

    loadIAList();
})
