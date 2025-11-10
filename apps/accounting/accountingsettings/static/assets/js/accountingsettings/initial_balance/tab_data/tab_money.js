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

class TabMoneyVariables {
    constructor() {
        this.currentMoneyRow = null
    }
}
const tabMoneyVariables = new TabMoneyVariables();

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
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select row-money-type">
                            <option value=""></option>
                            <option value="1">${$.fn.gettext('Bank Deposit')}</option>
                            <option value="2">${$.fn.gettext('Cash')}</option>
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
                        return `<select class="form-select select2 row-account-code"></select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<span class="row-fk-account-name"></span><br><span class="row-account-name"></span>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money row-amount" value="0">`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money row-exchange-amount" value="0" readonly>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-debit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-credit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-10 text-center",
                    render: (data, type, row) => {
                        return `<button ${option === 'detail' ? 'disabled' : ''} type="button" class="bflow-mirrow-badge btn-detail-modal" disabled
                                        data-bs-toggle="modal"
                                        data-bs-target="#bank_account_modal">
                                   <i class="fas fa-info"></i>
                                </button>
                                <script class="bank-info-script"></script>`;
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
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input type="radio" name="bank-account-checkbox" class="form-check-input bank-account-checkbox"
                                    data-bank-id="${row?.['id'] || ''}" 
                                    data-bank-number="${row?.['bank_account_number'] || ''}"
                                    data-bank-abbreviation="${row?.['bank_mapped_data']?.['bank_abbreviation'] || ''}"
                                ></div>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['bank_account_number'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-60',
                    render: (data, type, row) => {
                        return `<span>${row?.['bank_mapped_data']?.['bank_name'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['bank_mapped_data']?.['bank_abbreviation'] || ''}</span>`;
                    }
                }
            ]
        });
    }

    static updateDebitValue($row) {
        const $row_currency = $row.find('.row-currency');
        const $row_amount = $row.find('.row-amount');
        const $exchange_amount = $row.find('.row-exchange-amount');
        const amount = parseFloat($row_amount.attr('value') || 0);
        const exchange = parseFloat($exchange_amount.attr('value') || 0);

        let currency_selected = SelectDDControl.get_data_from_idx($row_currency, $row_currency.val())
        const isVND = currency_selected?.['abbreviation'] === 'VND'
        const debitValue = isVND ? amount : exchange;
        $row.find('.row-debit').attr('value', debitValue);

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
            let row_added = tabMoneyElements.$tableMoney.find('tbody tr:last-child')
            UsualLoadPageFunction.LoadCurrency({
                element: row_added.find('.row-currency'),
                data_url: pageElements.$urlFactory.attr('data-url-currency')
            });
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-account-code'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1}
            })
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
            tabMoneyVariables.currentMoneyRow = $(this).closest('tr');
            TabMoneyFunction.loadBankAccountList();
        });

        // event only allow bank account detail when choose bank type
        tabMoneyElements.$tableMoney.on('change', '.row-money-type', function() {
            $(this).closest('tr').find('.btn-detail-modal').prop('disabled', $(this).val() !== '1');
        });

        // disable exchange rate for VND, enable for other currencies
        tabMoneyElements.$tableMoney.on('change', '.row-currency', function() {
            const $row = $(this).closest('tr');
            const $exchange_amount = $row.find('.row-exchange-amount');
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            const isVND = selected?.['abbreviation'] === 'VND'
            $exchange_amount.prop('readonly', isVND).attr('value', 0);

            // update debit value after currency change
            TabMoneyFunction.updateDebitValue($row);
        });

        tabMoneyElements.$tableMoney.on('change', '.row-account-code', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            $(this).closest('tr').find('.row-fk-account-name').text(selected?.['foreign_acc_name'] || '')
            $(this).closest('tr').find('.row-account-name').text(`(${selected?.['acc_name'] || ''})`)
        });

        // calculate debit based on amount and exchange rate
        tabMoneyElements.$tableMoney.on('change', '.row-amount, .row-exchange-amount', function() {
            const $row = $(this).closest('tr');
            TabMoneyFunction.updateDebitValue($row);
        });

        // event for button save in bank account modal
        tabMoneyElements.$btnSaveBankAccount.on('click', function() {
            // find selected row
            const selectedCheckbox = tabMoneyElements.$tableBankAccount.find('.bank-account-checkbox:checked');
            if (selectedCheckbox.length !== 0) {
                tabMoneyVariables.currentMoneyRow.find('.bank-info-script').text(selectedCheckbox.attr('data-bank-id') || '')
                let bank_number = selectedCheckbox.attr('data-bank-number') || ''
                let bank_abbreviation = selectedCheckbox.attr('data-bank-abbreviation') || ''
                let btn_detail_modal = tabMoneyVariables.currentMoneyRow.find('.btn-detail-modal')
                btn_detail_modal.html(`
                   <span class="fw-bold mr-1">${bank_abbreviation}</span><span>(${bank_number})</span>
                `)
            }
            else {
                tabMoneyVariables.currentMoneyRow.find('.bank-info-script').text('')
                let btn_detail_modal = tabMoneyVariables.currentMoneyRow.find('.btn-detail-modal')
                btn_detail_modal.html(`<i class="fas fa-info"></i>`)
            }
        });
    }
}
