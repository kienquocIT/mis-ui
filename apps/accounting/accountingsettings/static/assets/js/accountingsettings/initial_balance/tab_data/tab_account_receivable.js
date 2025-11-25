class TabAccountReceivableElements {
    constructor() {
        this.$tableAccountReceivable = $('#tbl_account_receivable');
        this.$tableCustomer = $('#customer_table');

        this.$prepaymentCheckbox = $('#prepaymentCheckbox');
        this.$prepaymentForm = $('#prepaymentForm');
        this.$invoiceForm = $('#invoiceForm');
        this.$invoiceDate = $('#invoice_day');
        this.$expectedPaymentDate = $('#expected_payment');
        this.$accountReceivableModal = $('#account_receivable_modal');

        this.$txtInvoiceNumber = $('#txt_invoice_number');
        this.$unpaidAmountEle = $('#unpaid_amount');
        this.$advancePayment = $('#advance_payment');

        this.$btnAddAccountReceivable = $('#add_tab_account_receivable');
        this.$btnSaveCustomer = $('#btn_save_customer');
        this.$btnSaveReceivableDetail = $('#btn_save_account_receivable');
    }
}
const tabAccountReceivableElements = new TabAccountReceivableElements();


class TabAccountReceivableVariables {
    constructor() {
        this.currentAccountReceiableRow = null;
    }
}
const tabAccountReceivableVariables = new TabAccountReceivableVariables();


class TabAccountReceivableFunction {
    static initAccountReceivableTable(data = []) {
        tabAccountReceivableElements.$tableAccountReceivable.DataTable().destroy();
        tabAccountReceivableElements.$tableAccountReceivable.DataTableDefault({
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
                            <input type="text" class="form-control row-customer-account-receivable row-access" 
                                placeholder="Click to select..." readonly/>
                            <span class="input-group-text p-0">
                                <button type="button" class="btn btn-primary btn-sm add-customer-btn row-access"
                                    data-bs-toggle="modal"
                                    data-bs-target="#customer-modal" disabled>
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </span>
                        </div>`;
                    }
                },
                {
                    className: "w-30",
                    render: (data, type, row) => {
                        return `
                            <div class="input-group">
                                <input type="text" class="form-control row-detail-account-receivable"
                                    placeholder="Click icon to add detail..." readonly/>
                                <span class="input-group-text p-0">
                                    <button type="button" class="btn btn-primary btn-sm btn-account-receivable-modal" disabled
                                        data-bs-toggle="modal"
                                        data-bs-target="#account_receivable_modal">
                                        <i class="fa-solid fa-circle-info"></i>
                                    </button>
                                </span>
                            </div>`;
                    }
                },
                {
                    className: "w-20",
                    render: (data, type, row) => {
                        let $ele = $(UsualLoadPageAccountingFunction.default_account_select2)
                        $ele.find('.row-account').prop('disabled', true);
                        $ele.find('.row-account').addClass('row-access');
                        return $ele.prop('outerHTML')
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-account-receivable-debit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-account-receivable-credit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-5 text-center",
                    render: () => {
                        return `
                           <button 
                               type="button" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover update-account-receivable-row">
                               <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                           </button>
                          <button 
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-account-receivable-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ],
            initComplete: function() {
                tabAccountReceivableElements.$tableAccountReceivable.find('tbody tr').each(function(index, ele) {
                    const rowData = data[index];
                    if (!rowData) return;
                    $(this).attr('data-id', rowData?.['id'] || '');    // set row attributes

                    // load customer
                    const customerData = rowData?.['customer_receivable_customer_data'];
                    if (customerData) {
                        const $customerInput = $(this).find('.row-customer-account-receivable');
                        $customerInput.val(customerData?.['name'] || '');
                        $customerInput.attr('data-customer-id', customerData?.['id'] || '');
                        $customerInput.attr('data-customer-code', customerData?.['code'] || '');
                    }

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
                    $(this).find('.row-account-receivable-debit').attr('value', rowData?.['debit_value'] || 0);
                    $(this).find('.row-account-receivable-credit').attr('value', rowData?.['credit_value'] || 0);

                    // load and store detail data
                    const detailData = rowData?.['customer_receivable_detail_data'];
                    if (detailData) {
                        const $detailInput = $(this).find('.row-detail-account-receivable');
                        // assign detail information to Json variable
                        $detailInput.attr('data-detail-info', JSON.stringify(detailData));
                        $(this).find('.btn-account-receivable-modal').prop('disabled', false);

                        if (detailData?.['is_prepayment']) {
                            const advancePayment = detailData?.['advanced_payment'] || 0;
                            $detailInput.val(`Pre-payment: ${advancePayment.toLocaleString('vi-VN')} VND`);
                        } else {
                            const invoiceNumber = detailData?.['invoice_number'] || '';
                            const unpaidAmount = detailData?.['unpaid_amount'] || 0;
                            $detailInput.val(`HÐ: ${invoiceNumber} - ${unpaidAmount.toLocaleString('vi-VN')} VND`);
                        }
                    }
                    $.fn.initMaskMoney2();
                });
            }
        });
    }

    static loadCustomerList() {
        const currentCustomerId = tabAccountReceivableVariables.currentAccountReceiableRow
            ?.find('.row-customer-account-receivable')
            ?.attr('data-customer-id');

        tabAccountReceivableElements.$tableCustomer.DataTable().clear().destroy();
        tabAccountReceivableElements.$tableCustomer.DataTableDefault({
            useDataServer: true,
            scrollY: '60vh',
            scrollCollapse: true,
            rowIndex: true,
            ajax: {
                url: tabAccountReceivableElements.$tableCustomer.attr('data-url'),
                method: 'GET',
                dataSrc: function (resp) {
                    return resp.data['customer_list'] || [];
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
                        const isChecked = currentCustomerId && currentCustomerId === String(row?.['id']);
                        return `<div class="form-check">
                                    <input type="radio" name="customer-checkbox" class="form-check-input customer-checkbox"
                                        data-customer-id="${row?.['id'] || ''}"
                                        data-customer-code="${row?.['code'] || ''}"
                                        data-customer-name="${row?.['name'] || ''}"
                                        ${isChecked ? 'checked' : ''}>
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
                        return`<span>${row?.['name'] || ''}</span>`;
                    }
                },
            ]
        });
    }

    static combineTabAccountReceivableData() {
        const accountReceivableDataList = [];

        tabAccountReceivableElements.$tableAccountReceivable.find('tbody tr').each(function() {
            const typeRow = $(this).attr('data-type-row');
            if (typeRow === 'added' || typeRow === 'updated') {
                const rowData = {
                    id: typeRow === 'added' ? null : $(this).attr('data-id'),
                    type_row: typeRow,
                    account: $(this).find('.row-account').val(),
                    debit_value: parseFloat($(this).find('.row-account-receivable-debit').attr('value') || 0),
                    credit_value: parseFloat($(this).find('.row-account-receivable-credit').attr('value') || 0),
                    detail_data: {
                        customer_receivable_customer: $(this).find('.row-customer-account-receivable').attr('data-customer-id'),
                        customer_receivable_detail_data: $(this).find('.row-detail-account-receivable').data('detailInfo') || {}
                    }
                };
                accountReceivableDataList.push(rowData);
            }
        });
        return accountReceivableDataList;
    }

    static loadAccountReceivableDetail($row) {
        const $detailInput = $row.find('.row-detail-account-receivable');

        // reset modal
        tabAccountReceivableElements.$prepaymentCheckbox.prop('checked', false);
        tabAccountReceivableElements.$txtInvoiceNumber.val('');
        tabAccountReceivableElements.$unpaidAmountEle.attr('value', 0);
        tabAccountReceivableElements.$invoiceDate.val('');
        tabAccountReceivableElements.$expectedPaymentDate.val('');
        tabAccountReceivableElements.$advancePayment.attr('value', 0);
        $('#note_account_receivable').val('');


        const detailDataStr = $detailInput.attr('data-detail-info');
        if (!detailDataStr) {
            tabAccountReceivableElements.$prepaymentForm.hide();
            tabAccountReceivableElements.$invoiceForm.show();
            return;
        }
        const detailData = JSON.parse(detailDataStr);
        const isPrepayment = detailData?.['is_prepayment'] === true;

        if (isPrepayment) {
            // load prepayment data from attributes
            tabAccountReceivableElements.$prepaymentCheckbox.prop('checked', true);
            tabAccountReceivableElements.$prepaymentForm.show();
            tabAccountReceivableElements.$invoiceForm.hide();

            tabAccountReceivableElements.$advancePayment.attr('value', parseFloat(detailData?.['advanced_payment'] || 0));
            $('#note_account_receivable').val(detailData?.['note'] || '');

        } else {
            // load invoice data from attributes
            tabAccountReceivableElements.$prepaymentCheckbox.prop('checked', false);
            tabAccountReceivableElements.$invoiceForm.show();
            tabAccountReceivableElements.$prepaymentForm.hide();

            tabAccountReceivableElements.$txtInvoiceNumber.val(detailData?.['invoice_number'] || '');
            tabAccountReceivableElements.$unpaidAmountEle.attr('value', parseFloat(detailData?.['unpaid_amount'] || 0));

            if (detailData?.['invoice_date']) {
                const formattedInvoiceDate = moment(detailData['invoice_date'], 'YYYY-MM-DD').format('DD/MM/YYYY');
                tabAccountReceivableElements.$invoiceDate.val(formattedInvoiceDate);
            }
            if (detailData?.['expected_payment_date']) {
                const formattedExpectedDate = moment(detailData['expected_payment_date'], 'YYYY-MM-DD').format('DD/MM/YYYY');
                tabAccountReceivableElements.$expectedPaymentDate.val(formattedExpectedDate);
            }
        }
        $.fn.initMaskMoney2();
    }

}


class TabAccountReceivableEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabAccountReceivableElements.$btnAddAccountReceivable.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabAccountReceivableElements.$tableAccountReceivable);
            let row_added = tabAccountReceivableElements.$tableAccountReceivable.find('tbody tr:last-child');
            row_added.attr('data-type-row', 'added');
            row_added.find('.row-access').prop('disabled', false);
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-account'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1, 'is_account': true}
            });
        });

        // event for deleting row
        tabAccountReceivableElements.$tableAccountReceivable.on('click', '.del-account-receivable-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                tabAccountReceivableElements.$tableAccountReceivable,
                parseInt($(this).closest('tr').find('td:first-child').text())
            );
        });

        // event for opening customer modal
        tabAccountReceivableElements.$tableAccountReceivable.on('click', '.add-customer-btn', function () {
            tabAccountReceivableVariables.currentAccountReceiableRow = $(this).closest('tr');
            TabAccountReceivableFunction.loadCustomerList();
        });

        // event for button save in customer modal
        tabAccountReceivableElements.$btnSaveCustomer.on('click', function() {
            const selectedCheckbox = tabAccountReceivableElements.$tableCustomer.find('.customer-checkbox:checked');
            if (selectedCheckbox.length !== 0) {
                const customerName = selectedCheckbox.attr('data-customer-name');
                const customerId = selectedCheckbox.attr('data-customer-id');
                const customerCode = selectedCheckbox.attr('data-customer-code');

                // get the input field in the current row and set the customer name
                const $inputField = tabAccountReceivableVariables.currentAccountReceiableRow.find('.row-customer-account-receivable');
                $inputField.val(customerName);

                // store customer data in the input field for later use
                $inputField.attr('data-customer-id', customerId);
                $inputField.attr('data-customer-code', customerCode);

                // enable the detail button
                const $detailButton = tabAccountReceivableVariables.currentAccountReceiableRow.find('.btn-account-receivable-modal');
                $detailButton.prop('disabled', false);
            }
        });

        // event for prepayment checkbox toggle
        tabAccountReceivableElements.$prepaymentCheckbox.on('change', function() {
            if ($(this).is(':checked')) {
                // show prepayment form and hide invoice form
                tabAccountReceivableElements.$prepaymentForm.show();
                tabAccountReceivableElements.$invoiceForm.hide();
            } else {
                // show invoice form and hide prepayment form
                tabAccountReceivableElements.$prepaymentForm.hide();
                tabAccountReceivableElements.$invoiceForm.show();
            }
        });

        // event for button save account receivable detail
        tabAccountReceivableElements.$btnSaveReceivableDetail.on('click', function() {
            const $currentRow = tabAccountReceivableVariables.currentAccountReceiableRow;
            const $detailInput = $currentRow.find('.row-detail-account-receivable');

            const detailData = {
                is_prepayment: tabAccountReceivableElements.$prepaymentCheckbox.is(':checked'),
                note: $('#note_account_receivable').val() || ''
            };

            if (tabAccountReceivableElements.$invoiceForm.is(':visible')) {
                const invoiceNumber = tabAccountReceivableElements.$txtInvoiceNumber.val() || '';
                const unpaidAmount = parseFloat(tabAccountReceivableElements.$unpaidAmountEle.attr('value') || 0);
                const invoiceDate = tabAccountReceivableElements.$invoiceDate.val();
                const expectedPaymentDate = tabAccountReceivableElements.$expectedPaymentDate.val();

                detailData.is_prepayment = false;
                detailData.invoice_number = invoiceNumber;
                detailData.unpaid_amount = unpaidAmount;
                detailData.invoice_date = invoiceDate ? moment(invoiceDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '';
                detailData.expected_payment_date = expectedPaymentDate ? moment(expectedPaymentDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '';
                detailData.advanced_payment = 0;

                // Update display text
                $detailInput.val(`HÐ: ${invoiceNumber} - ${unpaidAmount.toLocaleString('vi-VN')} VND`);
                $currentRow.find('.row-account-receivable-debit').attr('value', unpaidAmount);
                $currentRow.find('.row-account-receivable-credit').attr('value', 0);

            } else if (tabAccountReceivableElements.$prepaymentForm.is(':visible')) {
                const advancePayment = parseFloat(tabAccountReceivableElements.$advancePayment.attr('value') || 0);

                detailData.is_prepayment = true;
                detailData.advanced_payment = advancePayment;
                detailData.invoice_number = '';
                detailData.unpaid_amount = 0;
                detailData.invoice_date = '';
                detailData.expected_payment_date = '';

                // Update display text
                $detailInput.val(`Pre-payment: ${advancePayment.toLocaleString('vi-VN')} VND`);
                $currentRow.find('.row-account-receivable-debit').attr('value', 0);
                $currentRow.find('.row-account-receivable-credit').attr('value', advancePayment);
            }
            $detailInput.data('detailInfo', detailData);
            $currentRow.find('.btn-account-receivable-modal').prop('disabled', false);  // enable detail button
            $.fn.initMaskMoney2();
            $('#account_receivable_modal').modal('hide');
        });

        // event when modal is opened - reset to default state
        tabAccountReceivableElements.$accountReceivableModal.on('show.bs.modal', function() {
            tabAccountReceivableElements.$prepaymentForm.hide();
            tabAccountReceivableElements.$invoiceForm.show();
            tabAccountReceivableElements.$prepaymentCheckbox.prop('checked', false);  // uncheck prepayment checkbox
        });

        // event when click btn edit row
        tabAccountReceivableElements.$tableAccountReceivable.on('click', '.update-account-receivable-row', function() {
            const $row = $(this).closest('tr');
            $row.find('.row-access').prop('disabled', false);
            $row.attr('data-type-row', 'updated');
        });

        // event when click button to open account receivable modal
        tabAccountReceivableElements.$tableAccountReceivable.on('click', '.btn-account-receivable-modal', function () {
            const $row = $(this).closest('tr');
            tabAccountReceivableVariables.currentAccountReceiableRow = $row;
            TabAccountReceivableFunction.loadAccountReceivableDetail($row);  // load existing detail data into modal if available
        });
    }
}
