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
    static initEmployeePayableTable(data=[]) {
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
                            <div class="input-group">
                                <input type="text" class="form-control row-employee-info row-access" 
                                    placeholder="Click to select..." readonly/>
                                <span class="input-group-text p-0">
                                    <button type="button" class="btn btn-primary btn-sm add-employee-btn row-access"
                                        data-bs-toggle="modal"
                                        data-bs-target="#employee-modal">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </span>
                            </div>`;
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                    return  `<select class="form-select row-payable-type row-access" disabled>
                            <option value=""></option>
                            <option value="0">${$.fn.gettext('Advance Payment')}</option>
                            <option value="1">${$.fn.gettext('Payable')}</option>
                            <option value="2">${$.fn.gettext('Advance Salary')}</option>
                        </select>`;
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        let $ele = $(UsualLoadPageAccountingFunction.default_account_select2);
                        $ele.find('.row-account').prop('disabled', true);
                        $ele.find('.row-account').addClass('row-access');
                        return $ele.prop('outerHTML');
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-employee-payable-amount row-access" value="0" disabled>`;
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
                    className: "w-5 text-center",
                    render: () => {
                        return `
                            <button 
                               type="button" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover update-employee-payable-row">
                               <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                            </button>
                            <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-employee-payable-row">
                                   <span class="icon"><i class="far fa-trash-alt"></i></span>
                            </button>`;
                    }
                },
            ],
            initComplete: function() {
                tabEmployeePayableElements.$tableEmployeePayable.find('tbody tr').each(function(index, ele) {
                    const rowData = data[index];
                    if (!rowData) return;
                    $(this).attr('data-id', rowData?.['id'] || '');

                    // load employee
                    const employeeData = rowData?.['employee_payable_employee_data'];
                    if (employeeData) {
                        const $employeeInput = $(this).find('.row-employee-info');
                        $employeeInput.val(employeeData?.['name'] || '');
                        $employeeInput.attr('data-employee-id', employeeData?.['id'] || '');
                        $employeeInput.attr('data-employee-code', employeeData?.['code'] || '');
                    }

                    // load employee type
                    $(this).find('.row-payable-type').val(rowData?.['employee_payable_type']?.toString() || '');

                    // load account data
                    if (rowData?.['account_data']) {
                        UsualLoadPageAccountingFunction.LoadAccountingAccount({
                            element: $(this).find('.row-account'),
                            data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                            data_params: {'acc_type': 1, 'is_account': true},
                            data: rowData['account_data'],
                        });
                    }

                    // load debit and credit value
                    $(this).find('.row-employee-payable-amount').attr('value', rowData?.['employee_payable_value'] || 0);
                    $(this).find('.row-employee-payable-debit').attr('value', rowData?.['debit_value'] || 0);
                    $(this).find('.row-employee-payable-credit').attr('value', rowData?.['credit_value'] || 0);
                    $.fn.initMaskMoney2();
                });
            }
        });
    }

    static loadEmployeeList() {
        const currentEmployeeId = tabEmployeePayableVariables.currentEmployeePayableRow?.find('.row-employee-info')?.attr('data-employee-id');
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
                        const isChecked = currentEmployeeId && currentEmployeeId == String(row?.['id']);
                        return `<div class="form-check">
                                    <input type="radio" name="customer-checkbox" class="form-check-input employee-checkbox"
                                        data-employee-id="${row?.['id'] || ''}"
                                        data-employee-code="${row?.['code'] || ''}"
                                        data-employee-name="${row?.['full_name'] || ''}"
                                        ${isChecked ? 'checked': ''}>
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

    static combineTabEmployeePayableData() {
        const employeePayableDataList = [];
        tabEmployeePayableElements.$tableEmployeePayable.find('tbody tr').each(function() {
            const typeRow = $(this).attr('data-type-row');
            if (typeRow === 'added' || typeRow === 'updated') {
                const rowData = {
                    id: typeRow === 'added' ? null : $(this).attr('data-id'),
                    type_row: typeRow,
                    account: $(this).find('.row-account').val(),
                    debit_value: parseFloat($(this).find('.row-employee-payable-debit').attr('value') || 0),
                    credit_value: parseFloat($(this).find('.row-employee-payable-credit').attr('value') || 0),
                    detail_data: {
                        employee_payable_type: $(this).find('.row-payable-type').val(),
                        employee_payable_value: parseFloat($(this).find('.row-employee-payable-amount').attr('value') || 0),
                        employee_payable_employee: $(this).find('.row-employee-info').attr('data-employee-id'),
                        employee_payable_detail_data: {}
                    }
                };
                employeePayableDataList.push(rowData);
            }
        });
        return employeePayableDataList;
    }
}


class TabEmployeePayableEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabEmployeePayableElements.$btnAddEmployeePayable.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabEmployeePayableElements.$tableEmployeePayable);
            let row_added = tabEmployeePayableElements.$tableEmployeePayable.find('tbody tr:last-child');
            row_added.attr('data-type-row', 'added');
            row_added.find('.row-access').prop('disabled', false);
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-account'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1, 'is_account': true}
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
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            $(this).closest('tr').find('.row-employee-payable-code-detail').text(selected?.['acc_code'] || '')
            $(this).closest('tr').find('.row-fk-employee-payable-name').text(selected?.['foreign_acc_name'] || '')
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

        // event when click btn edit row
        tabEmployeePayableElements.$tableEmployeePayable.on('click', '.update-employee-payable-row', function() {
            const $row = $(this).closest('tr');
            $row.find('.row-access').prop('disabled', false);
            $row.attr('data-type-row', 'updated');
        });
    }

    // helper function to update debit and credit based on payable type and amount
    static updateDebitCredit($row) {
        const payableType = $row.find('.row-payable-type').val();
        const amount = $row.find('.row-employee-payable-amount').attr('value') || 0;

        if (payableType === '0' || payableType === '2') {
            $row.find('.row-employee-payable-debit').attr('value', amount);
            $row.find('.row-employee-payable-credit').attr('value', 0);
        } else if (payableType === '1') {
            $row.find('.row-employee-payable-debit').attr('value', 0);
            $row.find('.row-employee-payable-credit').attr('value', amount);
        }
        $.fn.initMaskMoney2();
    }
}