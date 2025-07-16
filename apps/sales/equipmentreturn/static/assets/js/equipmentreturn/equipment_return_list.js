$(document).ready(function () {
    function loadERList() {
        if (!$.fn.DataTable.isDataTable('#datatable_equipment_return_list')) {
            let dtb = $('#datatable_equipment_return_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
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
                            return resp.data['equipment_return_list'] ? resp.data['equipment_return_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-5',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-15',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20',
                        render: (data, type, row) => {
                            return `<span title="${(row?.['account_mapped_data'] || {})?.['name'] || ''}">${(row?.['account_mapped_data'] || {})?.['name'] || ''}</span>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-10',
                        render: (data, type, row) => {
                            let html = ``
                            for (let i=0; i < (row?.['product_return_data'] || []).length; i++) {
                                let item = row?.['product_return_data'][i]
                                html += `<div class="col-12" title="${(item || {})?.['title'] || ''}"><span class="badge badge-sm badge-secondary mr-1">${(item)?.['code'] || ''}</span><span>${(item || {})?.['title'] || ''}</span></div>`;
                            }
                            return `<div class="row">${html}</div>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                ]
            });
        }
    }

    loadERList();
})