$(document).ready(function() {
    const $trial_balance_table = $('#trial-balance-table')
    const $account_level_filter = $('#account_level_filter')
    const $account_display_filter = $('#account_display_filter')
    const $apply_filter = $('#apply_filter')

    let account_level = -1;
    let account_display = 0;

    function LoadTrialBalanceTable() {
        $trial_balance_table.DataTable().clear().destroy()
        $trial_balance_table.DataTableDefault({
            useDataServer: true,
            rowIdx: false,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '50vh',
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
                        console.log(data_list)
                        return data_list ? data_list : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    render: (data, type, row) => {
                        return `<p>${row?.['account_code']}</p>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<p>${row?.['account_name']}</p>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<p class="text-danger">${row?.['opening_balance'] || 0}</p>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<p class="text-success">${row?.['opening_balance'] || 0}</p>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        return `<span class="mask-money text-danger" data-init-money="${row?.['total_debit'] || 0}"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<p class="text-success">${row?.['total_credit'] || 0}</p>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<p class="text-danger">${row?.['closing_balance'] || 0}</p>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<p class="text-success">${row?.['closing_balance'] || 0}</p>`
                    }
                },
            ],
            rowGroup: {
                dataSrc: 'account_type_name'
            },
        });
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

    LoadTrialBalanceTable()
})