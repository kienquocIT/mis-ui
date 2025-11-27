class loadJournalEntryReportInfo {
    static loadJournalEntryReportList() {
        if (!$.fn.DataTable.isDataTable('#je_table_report')) {
            const $tb = $('#je_table_report');
            let frm = new SetupFormSubmit($tb);
            $tb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '64vh',
                autoWidth: true,
                scrollCollapse: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: 'GET',
                    dataSrc: function(resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['report_journal_entry_list'] ? resp.data['report_journal_entry_list'] : [];
                        }
                        return [];
                    }
                },
                columns: [
                    {
                        className: "w-5",
                        render: () => {
                            return ""
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            const jeId = row?.['journal_entry_data']?.['id'];
                            const jeCode = row?.['journal_entry_data']?.['code'] || '--';
                            const jeState = row?.['journal_entry_data']?.['je_state']
                            const link = $tb.attr('data-url-detail').replace('0', jeId);
                            return ` <div class="d-flex">
                                <a title="${jeCode}"  href="${link}"
                                class="link-primary underline_hover fw-bold">${jeCode}</a>
                             
                            </div>`;
                        }
                    },
                    {
                        className: "w-5",
                        render: (data, type, row) => {
                            return row?.['account'] || '--';
                        }
                    },
                    {
                        className: "w-10",
                        render: (data, type, row) => {
                            return row?.['description'] || '--';
                        }
                    },
                    {
                        className: "w-10",
                        render: (data, type, row) => {
                            return row?.['dimensions'] || '--';
                        }
                    },
                    {
                        className: "w-10",
                        render: (data, type, row) => {
                            let total_debit = parseFloat(row?.['total_debit'] || 0);
                            return `<span class="mask-money text-danger" data-init-money="${total_debit}"></span>`;
                        }
                    },
                    {
                        className: "w-10",
                        render: (data, type, row) => {
                            let total_credit = parseFloat(row?.['total_credit'] || 0);
                            return `<span class="mask-money text-indigo" data-init-money="${total_credit}"></span>`;
                        }
                    },
                    {
                        className: "w-10",
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: "w-15",
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['je_transaction_data']?.['date_approved'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-5',
                        render: (data, type, row) => {
                            let total_debit = parseFloat(row?.['total_debit'] || 0);
                            let total_credit = parseFloat(row?.['total_credit'] || 0);
                            return total_debit === total_credit ? `<span class="text-success h6">${$.fn.gettext('Balanced')}</span>`
                                : `<span class="text-danger h6">${$.fn.gettext('Not balance')}</span>`;
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status'], row?.['system_auto_create']);
                        }
                    },
                ],
            })
        }
    }
}


$('document').ready(function () {
    loadJournalEntryReportInfo.loadJournalEntryReportList();
});
