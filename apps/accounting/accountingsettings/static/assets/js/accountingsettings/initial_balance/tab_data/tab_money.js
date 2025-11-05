class TabMoneyElements {
    constructor() {
        this.$tableMoney = $('#tbl_money');
        this.$btnAddMoney = $('#add_tab_money');
        this.$modalBankAccount = $('#bank_account_modal');
        this.$tableBankAccount = $('#bank_account_table');
    }
}

const tabMoneyElements = new TabMoneyElements();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class TabMoneyFunction {
    static initMoneyTable(data = [], option = 'create') {
        tabMoneyElements.$tableMoney.DataTable().destroy();
        tabMoneyElements.$tableMoney.DataTableDefault({
            data: data,
            styleDom: 'hide-foot',
            rowIdx: true,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            reloadCurrency: true,
            columns: [
                {
                    className: "w-5",
                    render: () => {
                        return '';
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 row-money-type">
                            <option value=""></option>
                            <option value="1">🏦 ${$.fn.gettext('Bank')}</option>
                            <option value="2">💵 ${$.fn.gettext('Cash')}</option>
                        </select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 row-currency">
                            <option value=""></option>
                            <option value="1">VND</option>
                            <option value="2">USD</option>
                            <option value="3">EUR</option>
                        </select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} type="text" class="form-control row-account-code">`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} type="text" class="form-control row-account-name">`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money row-amount">`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money row-exchange-rate">`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-debit" readonly>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-credit" readonly>`;
                    }
                },
                {
                    className: "w-10 text-center",
                    render: (data, type, row) => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                                   type="button" class="btn btn-primary btn-sm btn-detail-modal disabled">
                                   <i class="fas fa-info"></i>
                              </button>`;
                    }
                },
                {
                    className: "w-5 text-right",
                    render: () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ],
            initComplete: function() {

            }
        });
    }
    static loadBankAccountList() {
        tabMoneyElements.$tableBankAccount.DataTable().clear().destroy();
        tabMoneyElements.$tableBankAccount.DataTableDefault({
            useDataServer: true,
            scrollY: '70vh',
            scrollCollapse: true,
            rowIndex: true,
            ajax: {
                url: tabMoneyElements.$tableBankAccount.attr('data-url'),
                method: 'GET',
                dataSrc: function (resp) {
                    return resp.data['bank_account_list'] || []
                }
            },
            columns: [
                {
                    className: 'wrap-text w-5 text-center',
                    render: (data, type, row, meta) => meta.row + 1
                },
                {
                    className: 'wrap-text w-10',
                    render: (data, type, row) => {
                        return `<input type="checkbox" class="bank-account-checkbox" style="transform: scale(1.5); cursor: pointer;"
                                data-account-id="${row?.id || ''}" 
                                data-account-number="${row?.bank_account_number || ''}">`;
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<span>${row?.['bank_account_number'] || '-'}</span>`;
                    }
                },
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        return `<span>${row?.['bank_mapped_data']?.['bank_name'] || '-'}</span>`;
                    }
                },
                {
                    className: 'w-20 text-center',
                    render: (data, type, row) => {
                        return `<span>${row?.['bank_mapped_data']?.['bank_abbreviation'] || '-'}</span>`;
                    }
                }
            ]
        });
    }
}

/**
 * Khai báo các Event
 */
class TabMoneyEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabMoneyElements.$btnAddMoney.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabMoneyElements.$tableMoney);
        });

        // event for deleting row
        tabMoneyElements.$tableMoney.on('click', '.del-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                tabMoneyElements.$tableMoney,
                parseInt($(this).closest('tr').find('td:first-child').text())
            );
        });

        // event for opening detail modal
        tabMoneyElements.$tableMoney.on('click', '.btn-detail-modal', function() {
            // const $row = $(this).closest('tr');
            // const rowIndex = parseInt($row.find('td:first-child').text());
            tabMoneyElements.$modalBankAccount.modal('show');
            TabMoneyFunction.loadBankAccountList();
        });

        // event only allow bank account detail when choose bank type
        tabMoneyElements.$tableMoney.on('change', '.row-money-type', function() {
            const selectedValue = $(this).val();
            const $detailButton = $(this).closest('tr').find('.btn-detail-modal');

            if (selectedValue === '2') {
                $detailButton.prop('disabled', true).addClass('disabled');
            } else if (selectedValue === '1') {
                $detailButton.prop('disabled', false).removeClass('disabled');
            } else {
                $detailButton.prop('disabled', true).addClass('disabled');
            }
        });

        // event allow selecting one checkbox
        tabMoneyElements.$tableBankAccount.on('change', '.bank-account-checkbox', function() {
            if ($(this).is(':checked')) {
                // remove all checkbox
                tabMoneyElements.$tableBankAccount.find('.bank-account-checkbox').not(this).prop('checked', false);
                // const selectedAccountId = $(this).data('account-id');
                // const selectedAccountNumber = $(this).data('account-number');
            }
        });
    }
}
