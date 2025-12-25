let total_value = {
    summarize_debit: 0,
    summarize_credit: 0,
}
let export_inventory_data_list = []

/**
 * Khai bao cac ham load data
 */
class JEReportFunction {
    static loadJournalEntryReportList(from_date = '', to_date = '') {
        const $tb = $('#je_table_report');

        // Destroy existing DataTable if exists
        if ($.fn.DataTable.isDataTable('#je_table_report')) {
            $tb.DataTable().destroy();
        }

        JEReportFunction.ResetValue()
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
                        $ele.find('.row-account').attr('data-account-mapped', JSON.stringify(row?.['account_data'] || {}));
                        return $ele.prop('outerHTML')
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
            drawCallback: function () {
                const api = this.api();
                const $tfoot = $(api.table().footer());
                JEReportFunction.RenderTotalToFooter($tfoot)
            }
        })
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
class JEReportEventHandler {
    static initPageEvent() {
        // event when click apply filter button
        $('#apply_filter').on('click', function () {
            let dayStart = DateTimeControl.formatDateType("DD/MM/YYYY", "YYYY-MM-DD", $('#start_date_filter').val());
            let dayEnd = DateTimeControl.formatDateType("DD/MM/YYYY", "YYYY-MM-DD", $('#end_date_filter').val());
            JEReportFunction.loadJournalEntryReportList(dayStart, dayEnd);
        });

        // event when click reset filter button
        $('#reset_filter').on('click', function () {
            const today = moment();
            const firstDayOfMonth = moment().startOf('month');
            $('#start_date_filter').val(firstDayOfMonth.format('DD/MM/YYYY'));
            $('#end_date_filter').val(today.format('DD/MM/YYYY'));

            const dayStart = firstDayOfMonth.format('YYYY-MM-DD');
            const dayEnd = today.format('YYYY-MM-DD');
            JEReportFunction.loadJournalEntryReportList(dayStart, dayEnd);
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
        let debitCell = worksheet[XLSX.utils.encode_cell({r: R, c: 5})];
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
    JEReportFunction.loadJournalEntryReportList(dayStart, dayEnd);

    JEReportEventHandler.initPageEvent();
});
