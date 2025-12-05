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
                        let $ele = $(UsualLoadPageAccountingFunction.default_account_select2);
                        $ele.find('.row-account').prop('disabled', true);
                        $ele.find('.row-account').addClass('row-access');
                        return $ele.prop('outerHTML');
                    }
                },
                {
                    className: "w-25",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-account-debit row-access" disabled>`;
                    }
                },
                {
                    className: "w-25",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-account-credit row-access" disabled>`;
                    }
                },
                {
                    className: "w-5 text-center",
                    render: () => {
                        return `
                            <button 
                               type="button" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover update-account-row">
                               <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                            </button>
                            <button
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-account-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                            </button>`;
                    }
                },
            ],
            initComplete: function() {
                tabAccountElements.$tableAccount.find('tbody tr').each(function(index, ele) {
                    const rowData = data[index];
                    if (!rowData) return;
                    $(this).attr('data-id', rowData?.['id'] || '');

                    // load account data
                    if (rowData?.['account_data']) {
                        UsualLoadPageAccountingFunction.LoadAccountingAccount({
                            element: $(this).find('.row-account'),
                            data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                            data_params: {'is_account': true},
                            data: rowData['account_data'],
                        });
                    }

                    // load debit and credit value
                    $(this).find('.row-account-debit').attr('value', rowData?.['debit_value'] || 0);
                    $(this).find('.row-account-credit').attr('value', rowData?.['credit_value'] || 0);
                    $.fn.initMaskMoney2();
                });
            }
        });
    }

    static combineTabAccountData() {
        const accountsDataList = [];
        tabAccountElements.$tableAccount.find('tbody tr').each(function() {
            const typeRow = $(this).attr('data-type-row');
            if (typeRow === 'added' || typeRow === 'updated') {
                const rowData = {
                    id: typeRow === 'added' ? null : $(this).attr('data-id'),
                    typeRow: typeRow,
                    account: $(this).find('.row-account').val(),
                    debit_value: parseFloat($(this).find('.row-account-debit').attr('value') || 0),
                    credit_value: parseFloat($(this).find('.row-account-credit').attr('value') || 0)
                }
                accountsDataList.push(rowData);
            }
        });
        return accountsDataList;
    }
}


class TabAccountEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabAccountElements.$btnAddAccount.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabAccountElements.$tableAccount);
            let row_added = tabAccountElements.$tableAccount.find('tbody tr:last-child');
            row_added.attr('data-type-row', 'added');
            row_added.find('.row-access').prop('disabled', false);
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

        // event when click btn edit row
        tabAccountElements.$tableAccount.on('click', '.update-account-row', function() {
            const $row = $(this).closest('tr');
            $row.find('.row-access').prop('disabled', false);
            $row.attr('data-type-row', 'updated');
        });
    }
}