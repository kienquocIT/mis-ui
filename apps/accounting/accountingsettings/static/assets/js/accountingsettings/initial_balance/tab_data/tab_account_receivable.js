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
    static initAccountReceivableTable(data = [], option = 'create') {
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
                            <input type="text" class="form-control row-customer-account-receivable" 
                                placeholder="Click to select..." readonly/>
                            <span class="input-group-text p-0">
                                <button type="button" ${option === 'detail' ? 'disabled' : ''}
                                    class="btn btn-primary btn-sm add-customer-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#customer-modal">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </span>
                        </div>`;
                    }
                },
                {
                    className: "w-30",
                    render: (data, type, row) => {
                        return `<div class="input-group">
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
                        return `<div class="input-group">
                            <select class="form-select select2 row-account-receivable-code"></select>
                            <span class="input-group-text p-0">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-regular fa-circle-question"></i>
                                </a>
                                <div class="dropdown-menu bflow-mirrow-card-80 p-3" style="min-width: 200px;">
                                    <h5 class="row-account-receivable-code-detail fw-bold"></h5>
                                    <h6 class="row-fk-account-receivable-name"></h6>
                                    <h6 class="row-account-receivable-name"></h6>
                                </div>
                            </span>
                        </div>`;
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
                    className: "w-5 text-right",
                    render: () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-account-receivable-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ]
        });
    }

    static loadCustomerList() {
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
                        return `<div class="form-check">
                                    <input type="radio" name="customer-checkbox" class="form-check-input customer-checkbox"
                                        data-customer-id="${row?.['id'] || ''}" 
                                        data-customer-code="${row?.['code'] || ''}"
                                        data-customer-name="${row?.['name'] || ''}">
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
}


class TabAccountReceivableEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabAccountReceivableElements.$btnAddAccountReceivable.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabAccountReceivableElements.$tableAccountReceivable);
            let row_added = tabAccountReceivableElements.$tableAccountReceivable.find('tbody tr:last-child');
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

        tabAccountReceivableElements.$tableAccountReceivable.on('change', '.row-account-receivable-code', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            $(this).closest('tr').find('.row-account-receivable-code-detail').text(selected?.['acc_code'] || '')
            $(this).closest('tr').find('.row-fk-account-receivable-name').text(selected?.['foreign_acc_name'] || '')
            $(this).closest('tr').find('.row-account-receivable-name').text(`(${selected?.['acc_name'] || ''})`)
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
    }
}
