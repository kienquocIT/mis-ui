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
                        return `<div class="input-group">
                            <select class="form-select select2 row-account-code"></select>
                            <span class="input-group-text p-0">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-regular fa-circle-question"></i>
                                </a>
                                <div class="dropdown-menu bflow-mirrow-card-80 p-3" style="min-width: 200px;">
                                    <h5 class="row-account-code-detail fw-bold"></h5>
                                    <h6 class="row-fk-account-name"></h6>
                                    <h6 class="row-account-name"></h6>
                                </div>
                            </span>
                        </div>`;
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
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            $(this).closest('tr').find('.row-account-code-detail').text(selected?.['acc_code'] || '')
            $(this).closest('tr').find('.row-fk-account-name').text(selected?.['foreign_acc_name'] || '')
            $(this).closest('tr').find('.row-account-name').text(`(${selected?.['acc_name'] || ''})`)
        });
    }
}