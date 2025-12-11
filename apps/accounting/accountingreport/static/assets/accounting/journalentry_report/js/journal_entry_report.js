class loadJournalEntryReportInfo {
    static loadJournalEntryReportList(from_date = '', to_date = '') {
        const $tb = $('#je_table_report');

        // Destroy existing DataTable if exists
        if ($.fn.DataTable.isDataTable('#je_table_report')) {
            $tb.DataTable().destroy();
        }

        let frm = new SetupFormSubmit($tb);
        $tb.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '56vh',
            autoWidth: true,
            scrollCollapse: true,
            reloadCurrency: true,
            paging: false,
            ajax: {
                url: frm.dataUrl,
                type: 'GET',
                data: {
                    'from_date': from_date,
                    'to_date': to_date
                },
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
                    className: "w-15",
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['journal_entry_info']?.['date_created'], {'outputFormat': 'DD/MM/YYYY'}, true);
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        const jeId = row?.['journal_entry_info']?.['id'];
                        const jeCode = row?.['journal_entry_info']?.['code'] || '--';
                        const link = $tb.attr('data-url-detail').replace('0', jeId);
                        return ` <div class="d-flex">
                            <a title="${jeCode}"  href="${link}"
                            class="link-primary underline_hover fw-bold">${jeCode}</a>
                        </div>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="mr-1">${row?.['journal_entry_info']?.['original_transaction_parsed']}</span><span class="fw-bold bflow-mirrow-badge-sm">${(row?.['journal_entry_info']?.['je_transaction_data'] || {})?.['code'] || ''}</span>`
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-15',
                    render: (data, type, row) => {
                        return WFRTControl.displayEmployeeWithGroup(row?.['journal_entry_info']?.['employee_created']);
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        let $ele = $(UsualLoadPageAccountingFunction.default_account_select2)
                        $ele.find('.row-account').prop('disabled', true);
                        $ele.find('.row-account').attr('data-account-mapped', JSON.stringify(row?.['account_data'] ||{}));
                        return $ele.prop('outerHTML')
                    }
                },
                {
                    className: "w-15 text-right",
                    render: (data, type, row) => {
                        let total_debit = parseFloat(row?.['debit'] || 0);
                        return total_debit ? `<span class="mask-money" data-init-money="${total_debit}"></span>` : '--';
                    }
                },
                {
                    className: "w-15 text-right",
                    render: (data, type, row) => {
                        let total_credit = parseFloat(row?.['credit'] || 0);
                        return total_credit ? `<span class="mask-money" data-init-money="${total_credit}"></span>` : '--';
                    }
                }
            ],
            initComplete: function () {
                $tb.find('tbody tr').each(function (index, ele) {
                    if ($(ele).find('.row-account').length) {
                        UsualLoadPageAccountingFunction.LoadAccountingAccount({
                            element: $(ele).find('.row-account'),
                            data: JSON.parse($(ele).find('.row-account').attr('data-account-mapped') || '{}')
                        })
                    }
                })
            },
            rowGroup: {
                dataSrc: function (row) {
                    if (row?.['journal_entry_info']?.['date_created']) {
                        return $x.fn.displayRelativeTime(row?.['journal_entry_info']?.['date_created'], {'outputFormat': 'DD/MM/YYYY'}, true);
                    }
                    return ''
                }
            },
            columnDefs: [
                {
                    "visible": false,
                    "targets": [1]
                }
            ],
        })
    }
}

class JEReportEventHandler {
    static initPageEvent() {
        // event when click apply filter button
        $('#apply_filter').on('click', function () {
            let dayStart = DateTimeControl.formatDateType("DD/MM/YYYY", "YYYY-MM-DD", $('#start_date_filter').val());
            let dayEnd = DateTimeControl.formatDateType("DD/MM/YYYY", "YYYY-MM-DD", $('#end_date_filter').val());
            loadJournalEntryReportInfo.loadJournalEntryReportList(dayStart, dayEnd);
        });

        // event when click reset filter button
        $('#reset_filter').on('click', function() {
            const today = moment();
            const firstDayOfMonth = moment().startOf('month');
            $('#start_date_filter').val(firstDayOfMonth.format('DD/MM/YYYY'));
            $('#end_date_filter').val(today.format('DD/MM/YYYY'));

            const dayStart = firstDayOfMonth.format('YYYY-MM-DD');
            const dayEnd = today.format('YYYY-MM-DD');
            loadJournalEntryReportInfo.loadJournalEntryReportList(dayStart, dayEnd);
        });
    }

}

$(document).ready(function () {
    const today = moment();
    const firstDayOfMonth = moment().startOf('month');

    UsualLoadPageFunction.LoadDate({
        element: $('#start_date_filter'),
        empty: false
    });
    UsualLoadPageFunction.LoadDate({
        element: $('#end_date_filter'),
        empty: false
    });

    // set default values
    $('#start_date_filter').val(firstDayOfMonth.format('DD/MM/YYYY'));
    $('#end_date_filter').val(today.format('DD/MM/YYYY'));

    // load data with default date range
    const dayStart = firstDayOfMonth.format('YYYY-MM-DD');
    const dayEnd = today.format('YYYY-MM-DD');
    loadJournalEntryReportInfo.loadJournalEntryReportList(dayStart, dayEnd);

    JEReportEventHandler.initPageEvent();
});
