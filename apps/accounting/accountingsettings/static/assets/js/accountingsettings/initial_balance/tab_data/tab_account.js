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
                    className: "w-20",
                    render: (data, type, row) => {
                        return `<select class="form-select select2 row-account-code"></select>`;
                    }
                },
                {
                    className: "w-40",
                    render: (data, type, row) => {
                        return `<span class="row-ar-account-name"></span><br><span class="row-account-name"></span>`;
                    }
                },
                {
                    className: "w-15",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-account-debit">`;
                    }
                },
                {
                    className: "w-15",
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
                element: row_added.find('.row-account-code'),
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

        // event for load account name when account code is selected
        tabAccountElements.$tableAccount.on('change', '.row-account-code', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val());
            $(this).closest('tr').find('.row-ar-account-name').text(selected?.['foreign_acc_name'] || '');
            $(this).closest('tr').find('.row-account-name').text(`(${selected?.['acc_name'] || ''})`);
        });
    }
}