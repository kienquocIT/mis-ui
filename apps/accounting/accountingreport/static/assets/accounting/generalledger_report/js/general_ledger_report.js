class GeneralLedgerReportElements {
    constructor() {
        this.$tableReport = $('#gl_table_report');
        this.$startDateFilter = $('#start_date_filter');
        this.$endDateFilter = $('#end_date_filter');
        this.$accountFilter = $('#account_filter');
        this.$accountInfoBtn = $('#account_info_btn');
        this.$applyFilterBtn = $('#apply_filter');
        this.$resetFilterBtn = $('#reset_filter');
    }
}
const pageElements = new GeneralLedgerReportElements();

/**
 * Khai bao cac ham load data
 */
class GeneralLedgerReportFunction {
    static loadGeneralLedgerReportList(startDate = '', endDate = '', accountId = '') {
        if ($.fn.DataTable.isDataTable(pageElements.$tableReport)) {
            pageElements.$tableReport.DataTable().destroy();
        }

        let frm = new SetupFormSubmit(pageElements.$tableReport);

        pageElements.$tableReport.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '56vh',
            autoWidth: true,
            scrollCollapse: true,
            reloadCurrency: true,
            ajax: {
                url: frm.dataUrl,
                type: 'GET',
                data: {
                    'journal_entry__date_created__lte': endDate,
                    'journal_entry__date_created__gte': startDate,
                    'account_id': accountId,
                    'is_general_ledger': true,
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
                    className: 'w-20',
                    render: (data, type, row) => {
                        const jeId = row?.['journal_entry_info']?.['id'];
                        const jeCode = row?.['journal_entry_info']?.['code'] || '--';
                        const link = pageElements.$tableReport.attr('data-url-detail').replace('0', jeId);
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
        })
    }

    static updateAccountInfoPopover(selectedData) {
        if (selectedData && selectedData.length > 0 && selectedData[0].data) {
            const accountData = selectedData[0].data;
            const popoverContent = `
                <div class="text-left p-2" style="min-width: 250px">
                    <h5 class="fw-bold">${accountData?.['acc_code'] || ''}</h5>
                    <h6>${accountData?.['foreign_acc_name'] || ''}</h6>
                    <h6>${accountData?.['acc_name'] || ''}</h6>
                </div>
            `;
            // destroy existing popover if any
            const existingPopover = bootstrap.Popover.getInstance(pageElements.$accountInfoBtn[0]);
            if (existingPopover) {
                existingPopover.dispose();
            }
            // create new popover
            new bootstrap.Popover(pageElements.$accountInfoBtn[0], {
                html: true,
                content: popoverContent,
                trigger: 'hover',
                placement: 'bottom',
                container: 'body'
            });
            pageElements.$accountInfoBtn.show();
        } else {
            GeneralLedgerReportFunction.hideAccountInfoPopover();
        }
    }

    static hideAccountInfoPopover() {
        const existingPopover = bootstrap.Popover.getInstance(pageElements.$accountInfoBtn[0]);
        if (existingPopover) existingPopover.dispose();
        pageElements.$accountInfoBtn.hide();
    }
}

/**
 * Khai bao cac ham su kien
 */
class GeneralLedgerReportEventHandler {
    static initPageEvent() {
        // event when click apply filter button
        pageElements.$applyFilterBtn.on('click', function () {
            let dayStart = DateTimeControl.formatDateType("DD/MM/YYYY", "YYYY-MM-DD", pageElements.$startDateFilter.val());
            let dayEnd = DateTimeControl.formatDateType("DD/MM/YYYY", "YYYY-MM-DD", pageElements.$endDateFilter.val());
            let accountId = pageElements.$accountFilter.val() || null;
            GeneralLedgerReportFunction.loadGeneralLedgerReportList(dayStart, dayEnd, accountId);
        });

        // event when click reset filter button
        pageElements.$resetFilterBtn.on('click', function () {
            const today = moment();
            const firstDayOfMonth = moment().startOf('month');

            pageElements.$startDateFilter.val(firstDayOfMonth.format('DD/MM/YYYY'));
            pageElements.$endDateFilter.val(today.format('DD/MM/YYYY'));
            pageElements.$accountFilter.val(null).trigger('change');

            // Hide account info button
            GeneralLedgerReportFunction.hideAccountInfoPopover();

            const dayStart = firstDayOfMonth.format('YYYY-MM-DD');
            const dayEnd = today.format('YYYY-MM-DD');
            GeneralLedgerReportFunction.loadGeneralLedgerReportList(dayStart, dayEnd, '');
        });

        // event when account filter changes
        pageElements.$accountFilter.on('change', function() {
            const selectedData = $(this).select2('data');
            GeneralLedgerReportFunction.updateAccountInfoPopover(selectedData);
        });
    }
}


$(document).ready(function () {
    const today = moment();
    const firstDayOfMonth = moment().startOf('month');

    // Initialize date pickers
    UsualLoadPageFunction.LoadDate({
        element: pageElements.$startDateFilter,
        empty: false
    });
    UsualLoadPageFunction.LoadDate({
        element: pageElements.$endDateFilter,
        empty: false
    });

    // Initialize account select2
    UsualLoadPageAccountingFunction.LoadAccountingAccount({
        element: pageElements.$accountFilter,
        data_url: pageElements.$accountFilter.attr('data-url'),
        data_params: {'is_account': true},
        apply_default_on_change: false
    });

    // set default values
    pageElements.$startDateFilter.val(firstDayOfMonth.format('DD/MM/YYYY'));
    pageElements.$endDateFilter.val(today.format('DD/MM/YYYY'));

    // load data with default date range
    const dayStart = firstDayOfMonth.format('YYYY-MM-DD');
    const dayEnd = today.format('YYYY-MM-DD');
    GeneralLedgerReportFunction.loadGeneralLedgerReportList(dayStart, dayEnd, '');

    GeneralLedgerReportEventHandler.initPageEvent();
});
