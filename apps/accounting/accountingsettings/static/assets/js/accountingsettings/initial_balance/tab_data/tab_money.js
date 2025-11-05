class TabMoneyElements {
    constructor() {
        this.$tableMoney = $('#tbl_money');
        this.$btnAddMoney = $('#add_tab_money');
        this.$modalBankAccount = $('#bank_account_modal');
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
                            <option value="1">${$.fn.gettext('Bank')}</option>
                            <option value="2">${$.fn.gettext('Cash')}</option>
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
                               type="button" class="btn btn-primary btn-sm btn-detail-modal">
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
            const $row = $(this).closest('tr');
            const rowIndex = parseInt($row.find('td:first-child').text());

            // Open modal
            tabMoneyElements.$modalBankAccount.modal('show');
        });
    }
}
