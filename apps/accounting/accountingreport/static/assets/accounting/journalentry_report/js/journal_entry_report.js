class loadJournalEntryReportInfo {
    static loadJournalEntryReportList(startDate = '', endDate = '') {
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
            scrollY: '64vh',
            autoWidth: true,
            scrollCollapse: true,
            reloadCurrency: true,
            // paging: false,
            ajax: {
                url: frm.dataUrl,
                type: 'GET',
                data: {
                    'journal_entry__date_created__lte': endDate,
                    'journal_entry__date_created__gte': startDate
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
                    className: "w-10",
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['journal_entry_info']?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
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
                    className: "w-10",
                    render: (data, type, row) => {
                        const accCode = row?.['account_data']?.['acc_code'] || '--';
                        return `<span class="badge bg-primary">${accCode}</span>`;
                    }
                },
                {
                    className: "w-15",
                    render: (data, type, row) => {
                        return row?.['account_data']?.['acc_name'] || '--';
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        const dimensions = row?.dimensions;
                        return dimensions?.[dimensions.length - 1]?.title || '--';
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        let total_debit = parseFloat(row?.['debit'] || 0);
                        return `<span class="mask-money text-danger" data-init-money="${total_debit}"></span>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        let total_credit = parseFloat(row?.['credit'] || 0);
                        return `<span class="mask-money text-indigo" data-init-money="${total_credit}"></span>`;
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-10',
                    render: (data, type, row) => {
                        let total_debit = parseFloat(row?.['debit'] || 0);
                        let total_credit = parseFloat(row?.['credit'] || 0);
                        return total_debit === total_credit ? `<span class="text-success h6">${$.fn.gettext('Balanced')}</span>`
                            : `<span class="text-danger h6">${$.fn.gettext('Not balance')}</span>`;
                    }
                },
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
    }

}

$('document').ready(function () {
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
