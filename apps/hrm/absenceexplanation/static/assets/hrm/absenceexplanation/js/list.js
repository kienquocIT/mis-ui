$(document).ready(function () {
    function loadAbsenceExplanationList() {
        if (!$.fn.DataTable.isDataTable('#tbl_absence_explanation')) {
            const $tb = $('#tbl_absence_explanation');
            $tb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: $tb.attr('data-url'),
                    type: 'GET',
                    dataSrc: "data.absence_explanation_list"
                },
                columns: [
                    {
                        className: "w-5",
                        render: () => {
                            return ""
                        }
                    },
                    {
                        className: "ellipsis-cell-lg w-35",
                        render: (data, type, row) => {
                            const link = $tb.attr('data-url-detail').replace('0', row?.['id']);
                            const description = row?.['description'] || '--';
                            return `<a href="${link}" class="link-primary underline_hover"
                                    title="${description}">${description}</a>`;
                        }
                    },
                    {
                        className: "w-10",
                        render: (data, type, row) => {
                            let absence_type = row?.['absence_type'] ?? '';
                            return pageElements.$absenceTypeDict?.[absence_type] || '';
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-20', render: (data, type, row) => {
                            let employeeInfo = row?.['employee'] || {};
                            if (employeeInfo) {
                                return employeeInfo?.['full_name'] || '';
                            } else {
                                return ''
                            }
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: "w-15",
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    }
                ],
            })
        }
    }

    loadAbsenceExplanationList();
});
