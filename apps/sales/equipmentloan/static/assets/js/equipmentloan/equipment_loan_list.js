$(document).ready(function () {
    function loadELList() {
        if (!$.fn.DataTable.isDataTable('#datatable_equipment_loan_list')) {
            let dtb = $('#datatable_equipment_loan_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 2
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['equipment_loan_list'] ? resp.data['equipment_loan_list'] : [];
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
                        className: 'ellipsis-cell-xs w-5',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-25',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-15',
                        render: (data, type, row) => {
                            return `<span title="${(row?.['account_mapped_data'] || {})?.['name'] || ''}">${(row?.['account_mapped_data'] || {})?.['name'] || ''}</span>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['loan_date'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['return_date'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
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
                        className: 'text-center w-5',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        className: 'text-center w-5',
                        render: (data, type, row) => {
                            if (row?.['system_status'] === 3) {
                                const link = dtb.attr('data-url-create-equipment-return') + `?el_selected_id=${row?.['id']}&account_id=${(row?.['account_mapped_data'] || {})?.['id'] || ''}&account_name=${(row?.['account_mapped_data'] || {})?.['name'] || ''}`;
                                let return_redirect = `<a target="_blank" class="ml-1" title="${$.fn.gettext('Equipment return')}" href="${link}"><i class="fa-solid fa-rotate-left"></i></a>`
                                if (row?.['return_status'] === 0) {
                                    return `<span class="small text-muted">${$.fn.gettext('Have not returned yet')} ${return_redirect}</span>`
                                }
                                else if (row?.['return_status'] === 1) {
                                    return `<span class="small text-blue">${$.fn.gettext('Partially returned')} ${return_redirect}</span>`
                                }
                                else if (row?.['return_status'] === 2) {
                                    return `<span class="small text-success">${$.fn.gettext('Returned')} <i class="fa-solid fa-check"></i></span>`
                                }
                            }
                            return '';
                        }
                    },
                ]
            });
        }
    }

    loadELList();
})