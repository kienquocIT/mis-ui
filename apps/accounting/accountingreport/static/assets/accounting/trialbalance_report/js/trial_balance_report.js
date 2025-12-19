$(document).ready(function () {
    const $trial_balance_table = $('#trial-balance-table')
    const $account_level_filter = $('#account_level_filter')
    const $account_display_filter = $('#account_display_filter')
    const $apply_filter = $('#apply_filter')
    const $btn_export_to_excel = $('#btn-export-to-excel')

    let account_level = -1;
    let account_display = 0;
    let export_inventory_data_list = []
    let total_value = {
        opening_debit: 0,
        opening_credit: 0,
        total_debit: 0,
        total_credit: 0,
        closing_debit: 0,
        closing_credit: 0
    }

    function LoadTrialBalanceTable() {
        ResetValue()
        $trial_balance_table.DataTable().clear().destroy()
        $trial_balance_table.DataTableDefault({
            styleDom: 'hide-foot',
            useDataServer: true,
            rowIdx: false,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '54vh',
            scrollCollapse: true,
            ajax: {
                url: $trial_balance_table.attr('data-table-url'),
                data: {
                    'account_level': account_level,
                    'account_display': account_display
                },
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_list = resp.data['journal_entry_summarize'] ? resp.data['journal_entry_summarize'] : []
                        export_inventory_data_list = data_list
                        return data_list ? data_list : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    render: (data, type, row) => {
                        return `<p class="ml-${row?.['account_level'] * 4} fw-bold">${row?.['account_code']}</p>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<p>${row?.['foreign_account_name']}</p>
                                <p>(${row?.['account_name']})</p>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        total_value.opening_debit += Number(row.opening_debit || 0);
                        return `<span class="mask-money text-danger" data-init-money="${row?.['opening_debit'] || 0}"></span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        total_value.opening_credit += Number(row.opening_credit || 0);
                        return `<span class="mask-money text-primary" data-init-money="${row?.['opening_credit'] || 0}"></span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        total_value.total_debit += Number(row.total_debit || 0);
                        return `<span class="mask-money text-danger" data-init-money="${row?.['total_debit'] || 0}"></span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        total_value.total_credit += Number(row.total_credit || 0);
                        return `<span class="mask-money text-primary" data-init-money="${row?.['total_credit'] || 0}"></span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        total_value.closing_debit += Number(row.closing_debit || 0);
                        return `<span class="mask-money text-danger" data-init-money="${row?.['closing_debit'] || 0}"></span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        total_value.closing_credit += Number(row.closing_credit || 0);
                        return `<span class="mask-money text-primary" data-init-money="${row?.['closing_credit'] || 0}"></span>`
                    }
                },
            ],
            rowGroup: {
                dataSrc: 'account_type_name'
            },
            drawCallback: function () {
                const api = this.api();
                const $tfoot = $(api.table().footer());
                RenderTotalToFooter($tfoot)
            }
        });
    }

    function ExportExcel() {
        if (!export_inventory_data_list || export_inventory_data_list.length === 0) {
            alert("Không có dữ liệu để xuất!");
            return;
        }

        const header = [
            [
                "Mã Tài Khoản\nAccount Code",
                "Tên Tài Khoản\nAccount Name",
                "Số Dư Đầu Kỳ\nOpening Balance", "",
                "Số Phát Sinh Trong Kỳ\nPeriod Movement", "",
                "Số Dư Cuối Kỳ\nClosing Balance", ""
            ],
            [
                "", "",
                "Nợ\nDebit", "Có\nCredit",
                "Nợ\nDebit", "Có\nCredit",
                "Nợ\nDebit", "Có\nCredit"
            ]
        ];

        const body = [];

        export_inventory_data_list.forEach(item => {
            body.push([
                item['account_code'] || "",
                `${item['foreign_account_name']}\n(${item['account_name']})` || "",
                item['opening_debit'] || 0,
                item['opening_credit'] || 0,
                item['total_debit'] || 0,
                item['total_credit'] || 0,
                item['closing_debit'] || 0,
                item['closing_credit'] || 0,
            ]);
        });

        const worksheet = XLSX.utils.aoa_to_sheet([...header, ...body]);

        worksheet["!merges"] = [
            {s: {r: 0, c: 0}, e: {r: 1, c: 0}},
            {s: {r: 0, c: 1}, e: {r: 1, c: 1}},
            {s: {r: 0, c: 2}, e: {r: 0, c: 3}},
            {s: {r: 0, c: 4}, e: {r: 0, c: 5}},
            {s: {r: 0, c: 6}, e: {r: 0, c: 7}},
        ];

        const headerStyle = {
            font: {bold: true},
            alignment: {
                horizontal: "center",
                vertical: "center",
                wrapText: true
            },
            fill: {
                fgColor: {rgb: "F3F3F3"}
            },
            border: {
                top: {style: "thin"},
                bottom: {style: "thin"},
                left: {style: "thin"},
                right: {style: "thin"}
            }
        };

        for (let r = 0; r <= 1; r++) {
            for (let c = 0; c <= 7; c++) {
                const addr = XLSX.utils.encode_cell({r, c});
                if (worksheet[addr]) worksheet[addr].s = headerStyle;
            }
        }

        const range = XLSX.utils.decode_range(worksheet["!ref"]);

        for (let r = 2; r <= range.e.r; r++) {
            for (let c = 0; c <= 7; c++) {
                const addr = XLSX.utils.encode_cell({r, c});
                if (!worksheet[addr]) continue;

                let color = "000000";
                if ([2, 4, 6].includes(c)) color = "CF0F0F"; // Debit
                if ([3, 5, 7].includes(c)) color = "4682A9"; // Credit

                worksheet[addr].s = {
                    font: {color: {rgb: color}},
                    alignment: {
                        vertical: "center",
                        horizontal: c < 2 ? "left" : "right"
                    },
                    border: {
                        top: {style: "thin"},
                        bottom: {style: "thin"},
                        left: {style: "thin"},
                        right: {style: "thin"}
                    }
                };
            }
        }

        worksheet["!cols"] = [
            {wch: 18},
            {wch: 35},
            {wch: 16}, {wch: 16},
            {wch: 16}, {wch: 16},
            {wch: 16}, {wch: 16}
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance");

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, "_");

        XLSX.writeFile(workbook, `trial_balance_${timestamp}.xlsx`);
    }

    function RenderTotalToFooter($tfoot) {

        $tfoot.find('.total-opening-debit').html(
            `<span class="mask-money fw-bold" data-init-money="${total_value.opening_debit}"></span>`
        );
        $tfoot.find('.total-opening-credit').html(
            `<span class="mask-money fw-bold" data-init-money="${total_value.opening_credit}"></span>`
        );
        $tfoot.find('.total-period-debit').html(
            `<span class="mask-money fw-bold" data-init-money="${total_value.total_debit}"></span>`
        );
        $tfoot.find('.total-period-credit').html(
            `<span class="mask-money fw-bold" data-init-money="${total_value.total_credit}"></span>`
        );
        $tfoot.find('.total-closing-debit').html(
            `<span class="mask-money fw-bold" data-init-money="${total_value.closing_debit}"></span>`
        );
        $tfoot.find('.total-closing-credit').html(
            `<span class="mask-money fw-bold" data-init-money="${total_value.closing_credit}"></span>`
        );
    }

    function ResetValue() {
        total_value = {
            opening_debit: 0,
            opening_credit: 0,
            total_debit: 0,
            total_credit: 0,
            closing_debit: 0,
            closing_credit: 0
        }
    }

    $account_level_filter.on('change', function () {
        account_level = $(this).val()
    })

    $account_display_filter.on('change', function () {
        account_display = $(this).val()
    })

    $apply_filter.on('click', function () {
        LoadTrialBalanceTable()
    })

    $btn_export_to_excel.on('click', function () {
        ExportExcel()
    })

    LoadTrialBalanceTable()
})
