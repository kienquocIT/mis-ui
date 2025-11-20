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
    static initMoneyTable(data = []) {
        tabMoneyElements.$tableMoney.DataTable().destroy();
        tabMoneyElements.$tableMoney.DataTableDefault({
            rowIdx: true,
            useDataServer: false,
            reloadCurrency: true,
            scrollCollapse: true,
            scrollY: '70vh',
            scrollX: true,
            data: data,
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
                        return `<select class="form-select row-money-type row-access" disabled>
                            <option value=""></option>
                            <option value="0">${$.fn.gettext('Cash')}</option>
                            <option value="1">${$.fn.gettext('Bank Deposit')}</option>
                        </select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<select class="form-select select2 row-currency row-access" disabled></select>`;
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        return `<div class="input-group">
                            <select class="form-select select2 row-account row-access" disabled></select>
                            <span class="input-group-text p-0">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-regular fa-circle-question"></i>
                                </a>
                                <div class="dropdown-menu bflow-mirrow-card-40 p-3" style="min-width: 200px;">
                                    <h5 class="row-account-code fw-bold"></h5>
                                    <h6 class="row-fk-account-name"></h6>
                                    <h6 class="row-account-name"></h6>
                                </div>
                            </span>
                        </div>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-amount row-amount-changed row-access" value="0" disabled>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-exchange-amount" value="0" readonly>`;
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
                        return `<button type="button" class="bflow-mirrow-badge btn-detail-modal row-access" disabled
                                        data-bs-toggle="modal"
                                        data-bs-target="#bank_account_modal">
                                   <i class="fas fa-info"></i>
                                </button>
                                <script class="bank-info-script"></script>`;
                    }
                },
                {
                    className: "w-5 text-center",
                    render: () => {
                        return `
                           <button 
                               type="button" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover update-row">
                               <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                            </button>
                            <button 
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                            </button>`;
                    }
                },
            ],
            initComplete: function() {
                tabMoneyElements.$tableMoney.find('tbody tr').each(function (index, ele) {
                    const $row = $(ele);
                    const rowData = data[index];
                    if (!rowData) return;

                    // set row  attribute
                    if (rowData?.['id']) {
                        $row.attr('data-id', rowData['id']);
                    }
                    $row.attr('data-type-row', 'loaded');

                    // load money type
                    $row.find('.row-money-type').val(rowData?.['money_type']?.toString() || '');

                    // load currency data
                    if (rowData?.['currency_mapped_data']) {
                        UsualLoadPageFunction.LoadCurrency({
                            element: $row.find('.row-currency'),
                            data_url: pageElements.$urlFactory.attr('data-url-currency'),
                            data: rowData['currency_mapped_data'],
                        });
                    }

                    // load account data
                    if (rowData?.['account_data']) {
                        UsualLoadPageAccountingFunction.LoadAccountingAccount({
                            element: $row.find('.row-account'),
                            data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                            data_params: {'acc_type': 1, 'is_account': true},
                            data: rowData['account_data'],
                        });
                    }

                    // load amount values
                    $row.find('.row-amount').attr('value', rowData?.['money_value'] || 0);
                    const isFC = rowData?.['is_fc'] || false;
                    $row.find('.row-exchange-amount').attr('value', rowData?.['money_value_exchange'] || 0)
                        .prop('readonly', !isFC)
                        .prop('disabled', true);


                    // load debit and credit value
                    $row.find('.row-debit').attr('value', rowData?.['debit_value'] || 0);
                    $row.find('.row-credit').attr('value', rowData?.['credit_value'] || 0);

                    // load bank account details
                    const moneyType = rowData?.['money_type']?.toString() || '';
                    if (moneyType === '1' && rowData?.['money_detail_data']) {
                        const bankDetail = rowData['money_detail_data'];
                        const bankInfo = {
                            bank_id: bankDetail?.['bank_id'] || '',
                            bank_number: bankDetail?.['bank_number'] || '',
                            bank_abbreviation: bankDetail?.['bank_abbreviation'] || ''
                        };
                        $row.find('.bank-info-script').text(JSON.stringify(bankInfo));

                        // update button display with bank info
                        if (bankInfo.bank_abbreviation && bankInfo.bank_number) {
                            $row.find('.btn-detail-modal').html(`
                                <span class="fw-bold mr-1">${bankInfo.bank_abbreviation}</span>
                                <span>(${bankInfo.bank_number})</span>
                            `);
                        }
                    }

                    //enable/disable bank detail button based on money type
                    $row.find('.btn-detail-modal').prop('disabled', true);
                    $.fn.initMaskMoney2();
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
                    return resp.data['bank_account_list'] || [];
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

        InitialBalancePageFunction.UpdateTabAccountBalance($row)
    }

    static combineTabCashData() {
        const moneyDataList = [];

        tabMoneyElements.$tableMoney.find('tbody tr').each(function() {
            const typeRow = $(this).attr('data-type-row');
            const $currencyItem = $(this).find('.row-currency');
            const $currencyMappedData = $currencyItem.length ? SelectDDControl.get_data_from_idx($currencyItem, $currencyItem.val()) : {};

            // Parse bank detail data
            const bankDataStr = $(this).find('.bank-info-script').text().trim();
            const bankDetailData = bankDataStr ? (JSON.parse(bankDataStr) || {}) : {};

            if (typeRow === 'added' || typeRow === 'updated') {
                const rowData = {
                    type_row: typeRow,
                    currency_mapped: $currencyItem.val(),
                    currency_mapped_data: $currencyMappedData,
                    account: $(this).find('.row-account').val(),
                    debit_value: parseFloat($(this).find('.row-debit').attr('value') || 0),
                    credit_value: parseFloat($(this).find('.row-credit').attr('value') || 0),
                    detail_data: {
                        money_type: $(this).find('.row-money-type').val(),
                        money_value: parseFloat($(this).find('.row-amount').attr('value') || 0),
                        money_value_exchange: parseFloat($(this).find('.row-exchange-amount').attr('value') || 0),
                        money_detail_data: bankDetailData
                    },
                }
                moneyDataList.push(rowData)
            }
        });
        return moneyDataList;
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
            let row_added = tabMoneyElements.$tableMoney.find('tbody tr:last-child');
            row_added.attr('data-type-row', 'added');
            row_added.find('.row-access').prop('disabled', false);
            UsualLoadPageFunction.LoadCurrency({
                element: row_added.find('.row-currency'),
                data_url: pageElements.$urlFactory.attr('data-url-currency')
            });
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-account'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1, 'is_account': true}
            });
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

        tabMoneyElements.$tableMoney.on('change', '.row-account', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val());
            $(this).closest('tr').find('.row-account-code').text(selected?.['acc_code'] || '');
            $(this).closest('tr').find('.row-fk-account-name').text(selected?.['foreign_acc_name'] || '');
            $(this).closest('tr').find('.row-account-name').text(`(${selected?.['acc_name'] || ''})`);
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
                const bankInfo = {
                    bank_id: selectedCheckbox.attr('data-bank-id') || '',
                    bank_number: selectedCheckbox.attr('data-bank-number') || '',
                    bank_abbreviation: selectedCheckbox.attr('data-bank-abbreviation') || ''
                };
                tabMoneyVariables.currentMoneyRow.find('.bank-info-script').text(JSON.stringify(bankInfo));

                let btn_detail_modal = tabMoneyVariables.currentMoneyRow.find('.btn-detail-modal');
                btn_detail_modal.html(`
                   <span class="fw-bold mr-1">${bankInfo.bank_abbreviation}</span><span>(${bankInfo.bank_number})</span>
                `);
            }
            else {
                tabMoneyVariables.currentMoneyRow.find('.bank-info-script').text('');
                let btn_detail_modal = tabMoneyVariables.currentMoneyRow.find('.btn-detail-modal');
                btn_detail_modal.html(`<i class="fas fa-info"></i>`);
            }
        });

        // event when click btn edit row
        tabMoneyElements.$tableMoney.on('click', '.update-row', function() {
            const $row = $(this).closest('tr');
            $row.find('.row-access').prop('disabled', false);
            $row.attr('data-type-row', 'updated');
        });
    }
}
