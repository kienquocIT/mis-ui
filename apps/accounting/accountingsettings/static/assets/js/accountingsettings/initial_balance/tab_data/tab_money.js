class TabMoneyElements {
    constructor() {
        this.$tableMoney = $('#tbl_money');
        this.$btnAddMoney = $('#add_tab_money');
        this.$modalBankAccount = $('#bank_account_modal');
        this.$tableBankAccount = $('#bank_account_table');
        this.$btnSaveBankAccount = $('#btn_save_bank_account');
    }
}

const tabMoneyElements = new TabMoneyElements();
let currentMoneyRow = null;    // save row is selected


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
                            <option value="1">🏦 ${$.fn.gettext('Bank Deposit')}</option>
                            <option value="2">💵 ${$.fn.gettext('Cash')}</option>
                        </select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 row-currency"></select>`;
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
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money row-exchange-rate" readonly>`;
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
            drawCallback: function() {
                tabMoneyElements.$tableMoney.find('tbody tr').each(function (index, ele) {
                    const currencyData = data[index]?.currency;
                    InitialBalanceLoadDataHandle.loadCurrencyData({
                        element: $(ele).find('.row-currency'),
                        data: currencyData ? currencyData : null
                    });
                });
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

    static updateDebitValue($row = null) {
        const $rows = $row ? $row : tabMoneyElements.$tableMoney.find('tbody tr');

        $rows.each(function () {
            const $exchangeInput = $(this).find('.row-exchange-rate');

            // get values
            const amount = parseFloat($(this).find('.row-amount').attr('value') || 0);
            const exchange = parseFloat($exchangeInput.attr('value') || 0);

            // check if exchange rate is disabled/readonly
            const exchangeIsDisabled = $exchangeInput.prop('readonly') === true
                || $exchangeInput.prop('disabled') === true
                || $exchangeInput.hasClass('disabled');

            const debitValue = exchangeIsDisabled ? amount : exchange;
            $(this).find('.row-debit').attr('value', debitValue);
        });

        $.fn.initMaskMoney2();
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
            currentMoneyRow = $(this).closest('tr');
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

        // disable exchange rate for VND, enable for other currencies
        tabMoneyElements.$tableMoney.on('change', '.row-currency', function() {
            const $row = $(this).closest('tr');
            const selectedValue = $(this).val();
            const selectedText = $(this).find('option:selected').text().trim().toUpperCase();
            const $exchangeRateInput = $row.find('.row-exchange-rate');

            const isVND = selectedText.includes('VND') || selectedText.includes('VIỆT NAM') || selectedText.includes('VIET NAM');

            if (isVND) {
                $exchangeRateInput.prop('readonly', true).addClass('disabled').val(''); // clear the value
            } else if (selectedValue) {
                $exchangeRateInput.prop('readonly', false).removeClass('disabled');
            } else {
                $exchangeRateInput.prop('readonly', true).addClass('disabled').val(''); // disable if no currency
            }

            // update debit value after currency change
            TabMoneyFunction.updateDebitValue($row);
        });

        // event allow selecting one checkbox
        tabMoneyElements.$tableBankAccount.on('change', '.bank-account-checkbox', function() {
            if ($(this).is(':checked')) {
                tabMoneyElements.$tableBankAccount.find('.bank-account-checkbox').not(this).prop('checked', false); // remove all checkbox
            }
        });

        // calculate debit based on amount and exchange rate
        tabMoneyElements.$tableMoney.on('change', '.row-amount, .row-exchange-rate', function() {
            TabMoneyFunction.updateDebitValue($(this).closest('tr'));
        });

        // event for button save in bank account modal
        tabMoneyElements.$btnSaveBankAccount.on('click', function() {
            // find selected row
            const selectedCheckbox = tabMoneyElements.$tableBankAccount.find('.bank-account-checkbox:checked');
            if (selectedCheckbox.length !== 0) {
                const rowIndex = selectedCheckbox.closest('tr').index();
                const table = tabMoneyElements.$tableBankAccount.DataTable();
                const rowData = table.row(rowIndex).data();

                // get selected row info
                const accountNumber = rowData?.bank_account_number || '-';
                const abbreviation = rowData?.bank_mapped_data?.bank_abbreviation || '-';

                if (currentMoneyRow) {
                    const detailCell = currentMoneyRow.find('td:eq(9)');
                    detailCell.html(`
                       <div class="text-center">
                            <div class="bank-info-selected">
                                <i class="fas fa-check-circle text-success"></i>
                                <strong class="d-block">${abbreviation}</strong>
                                <small class="text-muted d-block">${accountNumber}</small>
                            </div>
                            <a href="javascript:void(0)" class="btn-detail-modal text-primary" 
                               style="font-size: 0.875rem; text-decoration: underline;">
                                <i class="fas fa-sync-alt"></i> ${$.fn.gettext('Change')}
                            </a>
                       </div>
                    `);
                }
                // reset
                currentMoneyRow = null;
                selectedCheckbox.prop('checked', false);
            }
        });
    }
}
