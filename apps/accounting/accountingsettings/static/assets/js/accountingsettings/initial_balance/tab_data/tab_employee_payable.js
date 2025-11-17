class TabEmployeePayableElements {
    constructor() {
        this.$tableEmployeePayable = $('#tbl_employee_payable');
        this.$tableEmployee = $('#employee_table');

        this.$btnAddEmployeePayable = $('#add_tab_employee_payable');
        this.$btnSaveEmployee = $('#btn_save_employee');
    }
}
const tabEmployeePayableElements = new TabEmployeePayableElements();

class TabEmployeePayableVariables {
    constructor() {
        this.currentEmployeePayableRow = null;
    }
}
const tabEmployeePayableVariables = new TabEmployeePayableVariables();


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
                    className: "w-20",
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
                        return `<input class="form-control mask-money row-employee-payable-amount" value="0">`;
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
        tabEmployeePayableElements.$tableEmployee.DataTable().clear().destroy();
        tabEmployeePayableElements.$tableEmployee.DataTableDefault({
            useDataServer: true,
            scrollY: '60vh',
            scrollCollapse: true,
            rowIndex: true,
            ajax: {
                url: tabEmployeePayableElements.$tableEmployee.attr('data-url'),
                method: 'GET',
                dataSrc: function (resp) {
                    return resp.data['employee_list'] || [];
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
                        return `<div class="form-check">
                                    <input type="radio" name="customer-checkbox" class="form-check-input employee-checkbox"
                                        data-employee-id="${row?.['id'] || ''}"
                                        data-employee-code="${row?.['code'] || ''}"
                                        data-employee-name="${row?.['full_name'] || ''}">
                                </div>`;
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span>${row?.['code'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-55',
                    render: (data, type, row) => {
                        return`<span>${row?.['full_name'] || ''}</span>`;
                    }
                },
            ]
        });
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

        // event for opening customer modal
        tabEmployeePayableElements.$tableEmployeePayable.on('click', '.add-employee-btn', function() {
            tabEmployeePayableVariables.currentEmployeePayableRow = $(this).closest('tr');
            TabEmployeePayableFunction.loadEmployeeList();
        })

        // event for load account name when account code is selected
        tabEmployeePayableElements.$tableEmployeePayable.on('change', '.row-employee-payable-code', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val());
            $(this).closest('tr').find('.row-ar-account-name').text(selected?.['foreign_acc_name'] || '');
            $(this).closest('tr').find('.row-employee-payable-name').text(`(${selected?.['acc_name'] || ''})`)
        });

        // event for button save in employee modal
        tabEmployeePayableElements.$btnSaveEmployee.on('click', function() {
            const selectedCheckbox = tabEmployeePayableElements.$tableEmployee.find('.employee-checkbox:checked');
            if (selectedCheckbox.length !== 0) {
                const employeeName = selectedCheckbox.attr('data-employee-name');
                const employeeId = selectedCheckbox.attr('data-employee-id');
                const employeeCode = selectedCheckbox.attr('data-employee-code');

                // get the input field in the current row and set the employee name
                const $inputField = tabEmployeePayableVariables.currentEmployeePayableRow.find('.row-employee-info');
                $inputField.val(employeeName);

                // store employee data in the input field for later use
                $inputField.attr('data-employee-id', employeeId);
                $inputField.attr('data-employee-code', employeeCode);
            }
        });

        // event for payable type change
        tabEmployeePayableElements.$tableEmployeePayable.on('change', '.row-payable-type', function() {
            TabEmployeePayableEventHandler.updateDebitCredit($(this).closest('tr'));
        });

        // event for amount change
        tabEmployeePayableElements.$tableEmployeePayable.on('change', '.row-employee-payable-amount', function() {
            TabEmployeePayableEventHandler.updateDebitCredit($(this).closest('tr'));
        });
    }

    // helper function to update debit and credit based on payable type and amount
    static updateDebitCredit($row) {
        const payableType = $row.find('.row-payable-type').val();
        const amount = $row.find('.row-employee-payable-amount').attr('value') || 0;

        if (payableType === '1' || payableType === '3') {
            // Advance Payment (1) or Advance Salary (3)
            $row.find('.row-employee-payable-debit').attr('value', amount);
            $row.find('.row-employee-payable-credit').attr('value', 0);
        } else if (payableType === '2') {
            $row.find('.row-employee-payable-debit').attr('value', 0);
            $row.find('.row-employee-payable-credit').attr('value', amount);
        }

        $.fn.initMaskMoney2();
    }
}