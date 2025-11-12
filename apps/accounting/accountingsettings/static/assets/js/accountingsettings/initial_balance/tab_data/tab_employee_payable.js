class TabEmployeePayableElements {
    constructor() {
        this.$tableEmployeePayable = $('#tbl_employee_payable');
        this.$btnAddEmployeePayable = $('#add_tab_employee_payable');
    }
}
const tabEmployeePayableElements = new TabEmployeePayableElements();


class TabEmployeePayableFunction {
    static initEmployeePayableTable(data=[], option='create') {
        tabEmployeePayableElements.$tableEmployeePayable.DataTable().destroy();
        tabEmployeePayableElements.$tableEmployeePayable.DataTableDefault({
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
                    return  `
                        <div class="d-flex align-items-center gap-2">
                            <input type="text" class="form-control row-employee-info" 
                                placeholder="Click to select..." readonly/>
                            <button type="button" ${option === 'detail' ? 'disabled' : ''}
                                class="btn btn-primary btn-sm add-employee-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#employee-modal">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    `;
                    }
                },
                {
                    className: "w-30",
                    render: (data, type, row) => {
                    return  `<select ${option === 'detail' ? 'disabled' : ''} class="form-select row-payable-type">
                            <option value=""></option>
                            <option value="1">${$.fn.gettext('Advance Payment')}</option>
                            <option value="2">${$.fn.gettext('Payable')}</option>
                            <option value="3">${$.fn.gettext('Advance Salary')}</option>
                        </select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<select class="form-select select2 row-employee-payable-code"></select>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<span class="row-ar-account-name"></span><br><span class="row-employee-payable-name"></span>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-employee-payable-debit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-employee-payable-credit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-5 text-right",
                    render: () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-employee-payable-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ]
        });
    }

    static loadEmployeeList() {

    }
}


class TabEmployeePayableEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabEmployeePayableElements.$btnAddEmployeePayable.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabEmployeePayableElements.$tableEmployeePayable);
            let row_added = tabEmployeePayableElements.$tableEmployeePayable.find('tbody tr:last-child');
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-employee-payable-code'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1}
            });
        });

        // event for deleting row
        tabEmployeePayableElements.$tableEmployeePayable.on('click', '.del-employee-payable-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                tabEmployeePayableElements.$tableEmployeePayable,
                parseInt($(this).closest('tr').find('td:first-child').text())
            );
        });

        // event for load account name when account code is selected
        tabEmployeePayableElements.$tableEmployeePayable.on('change', '.row-employee-payable-code', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val());
            $(this).closest('tr').find('.row-ar-account-name').text(selected?.['foreign_acc_name'] || '');
            $(this).closest('tr').find('.row-employee-payable-name').text(`(${selected?.['acc_name'] || ''})`)
        });
    }
}