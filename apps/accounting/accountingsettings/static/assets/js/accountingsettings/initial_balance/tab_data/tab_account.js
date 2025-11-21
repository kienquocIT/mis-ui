class TabAccountElements {
    constructor() {
        this.$tableAccount = $('#tbl_account');
        this.$btnAddAccount = $('#add_tab_account');
    }
}
const tabAccountElements = new TabAccountElements();

class TabAccountFunction {
    static initAccountTable(data=[], option='create') {
        tabAccountElements.$tableAccount.DataTable().destroy();
        tabAccountElements.$tableAccount.DataTableDefault({
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
                    className: "w-40",
                    render: (data, type, row) => {
                        return $(UsualLoadPageAccountingFunction.default_account_select2)
                    }
                },
                {
                    className: "w-25",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-account-debit">`;
                    }
                },
                {
                    className: "w-25",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-account-credit">`;
                    }
                },
                {
                    className: "w-5 text-right",
                    render: () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-account-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ]
        });
    }
}


class TabAccountEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabAccountElements.$btnAddAccount.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabAccountElements.$tableAccount);
            let row_added = tabAccountElements.$tableAccount.find('tbody tr:last-child');
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-account'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'is_account': true}
            });
        });

        // event for deleting row
        tabAccountElements.$tableAccount.on('click', '.del-account-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                tabAccountElements.$tableAccount,
                parseInt($(this).closest('tr').find('td:first-child').text())
            );
        });
    }
}