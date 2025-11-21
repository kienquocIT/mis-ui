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
                        $(this).find('.btn-account-receivable-modal').prop('disabled', false);
                        const $detailInput = $(this).find('.row-detail-account-receivable');
                        if (detailData?.['is_prepayment']) {
                            const advancePayment = detailData?.['advanced_payment'] || 0;
                            $detailInput.val(`Pre-payment: ${advancePayment.toLocaleString('vi-VN')} VND`);
                        } else {
                            const invoiceNumber = detailData?.['invoice_number'] || '';
                            const unpaidAmount = detailData?.['unpaid_amount'] || 0;
                            $detailInput.val(`HÐ: ${invoiceNumber} - ${unpaidAmount.toLocaleString('vi-VN')} VND`);
                        }
                    }
                });
                $.fn.initMaskMoney2();
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

    static loadDetailDataToModal($row) {
        // Get detail data from row attribute
        const detailJson = $row.attr('data-detail-json');

        if (detailJson) {
            try {
                const detailData = JSON.parse(detailJson);
                const isPrepayment = detailData?.['is_prepayment'];

                // Set prepayment checkbox
                tabAccountReceivableElements.$prepaymentCheckbox.prop('checked', isPrepayment);

                if (isPrepayment) {
                    // Show prepayment form, hide invoice form
                    tabAccountReceivableElements.$prepaymentForm.show();
                    tabAccountReceivableElements.$invoiceForm.hide();

                    // Load prepayment data
                    const advancePayment = detailData?.['advanced_payment'] || 0;
                    tabAccountReceivableElements.$advancePayment.val(advancePayment);
                    tabAccountReceivableElements.$advancePayment.attr('value', advancePayment);
                    $('#note_account_receivable').val(detailData?.['note'] || '');
                } else {
                    // Show invoice form, hide prepayment form
                    tabAccountReceivableElements.$prepaymentForm.hide();
                    tabAccountReceivableElements.$invoiceForm.show();

                    // Load invoice data
                    tabAccountReceivableElements.$txtInvoiceNumber.val(detailData?.['invoice_number'] || '');

                    const unpaidAmount = detailData?.['unpaid_amount'] || 0;
                    tabAccountReceivableElements.$unpaidAmountEle.val(unpaidAmount);
                    tabAccountReceivableElements.$unpaidAmountEle.attr('value', unpaidAmount);

                    // Load dates
                    if (detailData?.['invoice_date']) {
                        const invoiceDate = moment(detailData['invoice_date'], 'YYYY-MM-DD');
                        if (invoiceDate.isValid()) {
                            tabAccountReceivableElements.$invoiceDate.val(invoiceDate.format('DD/MM/YYYY'));
                        }
                    }

                    if (detailData?.['expected_payment_date']) {
                        const expectedDate = moment(detailData['expected_payment_date'], 'YYYY-MM-DD');
                        if (expectedDate.isValid()) {
                            tabAccountReceivableElements.$expectedPaymentDate.val(expectedDate.format('DD/MM/YYYY'));
                        }
                    }
                }

                // Initialize mask money
                $.fn.initMaskMoney2();
            } catch (e) {
                console.error('Error parsing detail data:', e);
            }
        } else {
            // No existing data - reset modal to default state
            tabAccountReceivableElements.$prepaymentCheckbox.prop('checked', false);
            tabAccountReceivableElements.$prepaymentForm.hide();
            tabAccountReceivableElements.$invoiceForm.show();

            // Clear all fields
            tabAccountReceivableElements.$txtInvoiceNumber.val('');
            tabAccountReceivableElements.$unpaidAmountEle.val('0').attr('value', 0);
            tabAccountReceivableElements.$invoiceDate.val('');
            tabAccountReceivableElements.$expectedPaymentDate.val('');
            tabAccountReceivableElements.$advancePayment.val('0').attr('value', 0);
            $('#note_account_receivable').val('');
        }
    }

    static combineTabAccountReceivableData() {
        const accountReceivableDataList = [];

        tabAccountReceivableElements.$tableAccountReceivable.find('tbody tr').each(function() {
            const typeRow = $(this).attr('data-type-row');
            const invoiceDate = moment(tabAccountReceivableElements.$invoiceDate.val(), "DD/MM/YYYY", true);
            const expectedPaymentDate = moment(tabAccountReceivableElements.$expectedPaymentDate.val(), "DD/MM/YYYY", true);
            if (typeRow === 'added' || typeRow === 'updated') {
                const rowData = {
                    id: typeRow === 'added' ? null : $(this).attr('data-id'),
                    type_row: typeRow,
                    account: $(this).find('.row-account').val(),
                    debit_value: parseFloat($(this).find('.row-account-receivable-debit').attr('value') || 0),
                    credit_value: parseFloat($(this).find('.row-account-receivable-credit').attr('value') || 0),
                    detail_data: {
                        customer_receivable_customer: $(this).find('.row-customer-account-receivable').attr('data-customer-id'),
                        customer_receivable_detail_data: {
                            is_prepayment: tabAccountReceivableElements.$prepaymentCheckbox.is(":checked"),
                            invoice_number: tabAccountReceivableElements.$txtInvoiceNumber.val() || '',
                            unpaid_amount: parseFloat(tabAccountReceivableElements.$unpaidAmountEle.attr('value') || 0),
                            invoice_date: invoiceDate.isValid() ? invoiceDate.format('YYYY-MM-DD') : null,
                            expected_payment_date: expectedPaymentDate.isValid() ? expectedPaymentDate.format('YYYY-MM-DD') : null,
                            advanced_payment: parseFloat(tabAccountReceivableElements.$advancePayment.attr('value') || 0),
                            note: $('#note_account_receivable').val() || ''
                        },
                    }
                };
                accountReceivableDataList.push(rowData);
            }
        });

        return accountReceivableDataList;
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
                element: row_added.find('.row-account-receivable-code'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1}
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

            if (tabAccountReceivableElements.$invoiceForm.is(':visible')) {
                const invoiceNumber = tabAccountReceivableElements.$txtInvoiceNumber.val();
                const invoiceValue = tabAccountReceivableElements.$unpaidAmountEle.attr('value') || 0;

                $currentRow.find('.row-detail-account-receivable').val(`HÐ: ${invoiceNumber} - ${invoiceValue} (VND)`);
                $currentRow.find('.row-account-receivable-debit').attr('value', invoiceValue);
                $currentRow.find('.row-account-receivable-credit').attr('value', 0);
            } else if (tabAccountReceivableElements.$prepaymentForm.is(':visible')) {
                // prepayment form is open
                const advancePaymentValue = tabAccountReceivableElements.$advancePayment.attr('value') || 0;
                $currentRow.find('.row-detail-account-receivable').val(`Pre-payment: ${advancePaymentValue}`);

                // set advance payment value to amount and credit fields
                $currentRow.find('.row-account-receivable-debit').attr('value', 0);
                $currentRow.find('.row-account-receivable-credit').attr('value', advancePaymentValue);
            }
            $.fn.initMaskMoney2();
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
    }
}
