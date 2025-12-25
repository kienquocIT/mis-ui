let select_account_id = ""
let total_value = {
    summarize_debit: 0,
    summarize_credit: 0,
}
let export_inventory_data_list = []

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
    static loadGeneralLedgerReportList(from_date = '', to_date = '', accountIdList = []) {
        if ($.fn.DataTable.isDataTable(pageElements.$tableReport)) {
            pageElements.$tableReport.DataTable().destroy();
        }

        let frm = new SetupFormSubmit(pageElements.$tableReport);

        GeneralLedgerReportFunction.ResetValue()
        pageElements.$tableReport.DataTableDefault({
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
                    'to_date': to_date,
                    'account_id': accountIdList.join(','),
                    'is_general_ledger': true,
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        export_inventory_data_list = resp.data['report_journal_entry_list'] ? resp.data['report_journal_entry_list'] : []
                        return export_inventory_data_list;
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
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="fw-bold">${row?.['account_data']?.['acc_code']}</span>`;
                    }
                },
                {
                    className: "w-15 text-right",
                    render: (data, type, row) => {
                        let total_debit = parseFloat(row?.['debit'] || 0);
                        total_value.summarize_debit += total_debit
                        return total_debit ? `<span class="mask-money text-danger" data-init-money="${total_debit}"></span>` : '--';
                    }
                },
                {
                    className: "w-15 text-right",
                    render: (data, type, row) => {
                        let total_credit = parseFloat(row?.['credit'] || 0);
                        total_value.summarize_credit += total_credit
                        return total_credit ? `<span class="mask-money text-primary" data-init-money="${total_credit}"></span>` : '--';
                    }
                }
            ],
            drawCallback: function () {
                const api = this.api();
                const $tfoot = $(api.table().footer());
                GeneralLedgerReportFunction.RenderTotalToFooter($tfoot)
            }
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

    static RenderTotalToFooter($tfoot) {
        $tfoot.find('.total-debit').html(
            `<span class="mask-money fw-bold fs-6" data-init-money="${total_value.summarize_debit}"></span>`
        );
        $tfoot.find('.total-credit').html(
            `<span class="mask-money fw-bold fs-6" data-init-money="${total_value.summarize_credit}"></span>`
        );
    }

    static ResetValue() {
        total_value = {
            summarize_debit: 0,
            summarize_credit: 0,
        }
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
            let accountIdList = pageElements.$accountFilter.val() || [];
            GeneralLedgerReportFunction.loadGeneralLedgerReportList(dayStart, dayEnd, accountIdList);
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
            GeneralLedgerReportFunction.loadGeneralLedgerReportList(dayStart, dayEnd);
        });

        // event when account filter changes
        pageElements.$accountFilter.on('change', function () {
            const selectedData = $(this).select2('data');
            select_account_id = selectedData[0]?.['data']['id']
            GeneralLedgerReportFunction.updateAccountInfoPopover(selectedData);
        });
    }
}

function ExportExcel() {
    let parseData = [];

    export_inventory_data_list.forEach(function (data) {
        parseData.push({
            "Ngày": data?.['journal_entry_info']?.['date_created'],
            "JE Code": data?.['journal_entry_info']?.['code'] || '',
            "Giao dịch gốc": data?.['journal_entry_info']?.['original_transaction_parsed'] || '',
            "Người tạo": data?.['journal_entry_info']?.['employee_created']?.['full_name'] || '',
            "Số hiệu Tài khoản": data?.['account_data']?.['acc_code'] || '',
            "Nợ": Number(data?.['debit'] || 0),
            "Có": Number(data?.['credit'] || 0)
        });
    });

    parseData.push({
        "Ngày": "",
        "JE Code": "",
        "Giao dịch gốc": "TỔNG CỘNG",
        "Người tạo": "",
        "Số hiệu Tài khoản": "",
        "Nợ": total_value.summarize_debit,
        "Có": total_value.summarize_credit
    });

    const worksheet = XLSX.utils.json_to_sheet(parseData);

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const totalRow = range.e.r + 1;

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        let debitCell = worksheet[XLSX.utils.encode_cell({r: R, c: 5})]
        debitCell.s = {
            font: {color: {rgb: "FF0000"}}
        };

        let creditCell = worksheet[XLSX.utils.encode_cell({r: R, c: 6})];
        creditCell.s = {
            font: {color: {rgb: "0070C0"}}
        };
    }

    worksheet['!cols'] = Object.keys(parseData[0]).map(key => ({
        wch: Math.max(
            key.length,
            ...parseData.map(row => String(row[key] || "").length)
        ) + 2
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "General ledger Report");

    const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
    XLSX.writeFile(workbook, `general_ledger_${timestamp}.xlsx`);
}

$('#btn-export-to-excel').on('click', function () {
    ExportExcel()
})

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
    GeneralLedgerReportFunction.loadGeneralLedgerReportList(dayStart, dayEnd);

    GeneralLedgerReportEventHandler.initPageEvent();
});
