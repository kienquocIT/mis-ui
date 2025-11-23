class TabSupplierPayableElements {
    constructor() {
        this.$tableSupplierPayable = $('#tbl_supplier_payable');
        this.$tableSupplier = $('#supplier_table');

        this.$prepaymentSupplierCheckbox = $('#prepaymentSupplierCheckbox');
        this.$prepaymentSupplierForm = $('#prepaymentSupplierForm');
        this.$invoiceSupplierForm = $('#invoiceSupplierForm');
        this.$supplierInvoiceDate = $('#supplier_invoice_day');
        this.$expectedSupplierPaymentDate = $('#expected_supplier_payment');
        this.$supplierPayableModal = $('#supplier_payable_modal');

        this.$txtSupplierInvoiceNumber = $('#txt_supplier_invoice_number');
        this.$unpaidSupplierAmountEle = $('#unpaid_supplier_amount');
        this.$advanceSupplierPayment = $('#advance_supplier_payment');

        this.$btnAddSupplierPayable = $('#add_tab_supplier_payable');
        this.$btnSaveSupplier = $('#btn_save_supplier');
        this.$btnSaveSupplierPayableDetail = $('#btn_save_supplier_payable');
    }
}
const tabSupplierPayableElements = new TabSupplierPayableElements();


class TabSupplierPayableVariables {
    constructor() {
        this.currentSupplierPayableRow = null;
    }
}
const tabSupplierPayableVariables = new TabSupplierPayableVariables();


class TabSupplierPayableFunction {
    static initSupplierPayableTable(data = [], option = 'create') {
        tabSupplierPayableElements.$tableSupplierPayable.DataTable().destroy();
        tabSupplierPayableElements.$tableSupplierPayable.DataTableDefault({
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
                            <input type="text" class="form-control row-supplier-info row-access" 
                                placeholder="Click to select..." readonly/>
                            <span class="input-group-text p-0">
                                <button type="button" class="btn btn-primary btn-sm add-supplier-btn row-access"
                                    data-bs-toggle="modal"
                                    data-bs-target="#supplier-modal" disabled>
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
                                    <input type="text" class="form-control row-detail-supplier-payable" 
                                        placeholder="Click icon to add detail..." readonly/>
                                    <button type="button" class="btn btn-primary btn-sm btn-supplier-payable-modal" disabled
                                            data-bs-toggle="modal"
                                            data-bs-target="#supplier_payable_modal">
                                       <i class="fa-solid fa-circle-info"></i>
                                    </button>
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
                        return `<input class="form-control mask-money row-supplier-payable-debit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-10",
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money row-supplier-payable-credit" value="0" readonly>`;
                    }
                },
                {
                    className: "w-5 text-center",
                    render: () => {
                        return `
                            <button 
                               type="button" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover update-supplier-payable-row">
                               <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                            </button>
                            <button 
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-supplier-payable-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                            </button>`;
                    }
                },
            ],
            initComplete: function() {
                tabSupplierPayableElements.$tableSupplierPayable.find('tbody tr').each(function(index, ele) {
                    const rowData = data[index];
                    if (!rowData) return;
                    $(this).attr('data-id', rowData?.['id'] || '');

                    // load supplier
                    const supplierData = rowData?.['supplier_payable_supplier_data'];
                    if (supplierData) {
                        const $supplierInput = $(this).find('.row-supplier-info');
                        $supplierInput.val(supplierData?.['name'] || '');
                        $supplierInput.attr('data-supplier-id', supplierData?.['id'] || '');
                        $supplierInput.attr('data-supplier-code', supplierData?.['code'] || '');
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
                    $(this).find('.row-supplier-payable-debit').attr('value', rowData?.['debit_value'] || 0);
                    $(this).find('.row-supplier-payable-credit').attr('value', rowData?.['credit_value'] || 0);

                    // load and store detail data
                    const detailData = rowData?.['supplier_payable_detail_data'];
                    if (detailData) {
                        const $detailInput = $(this).find('.row-detail-supplier-payable');
                        // assign detail information to Json variable
                        $detailInput.attr('data-detail-info', JSON.stringify(detailData));
                        $(this).find('.btn-supplier-payable-modal').prop('disabled', false);

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
                })
            }
        });
    }

    static loadSupplierList() {
        const currentSupplierId = tabSupplierPayableVariables.currentSupplierPayableRow?.find('.row-supplier-info')?.attr('data-supplier-id');
        tabSupplierPayableElements.$tableSupplier.DataTable().clear().destroy();
        tabSupplierPayableElements.$tableSupplier.DataTableDefault({
            useDataServer: true,
            scrollY: '60vh',
            scrollCollapse: true,
            rowIndex: true,
            ajax: {
                url: tabSupplierPayableElements.$tableSupplier.attr('data-url'),
                method: 'GET',
                dataSrc: function (resp) {
                    return resp.data['supplier_list'] || [];
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
                        const isChecked = currentSupplierId && currentSupplierId === String(row?.['id']);
                        return `<div class="form-check">
                                    <input type="radio" name="supplier-checkbox" class="form-check-input supplier-checkbox"
                                        data-supplier-id="${row?.['id'] || ''}"
                                        data-supplier-code="${row?.['code'] || ''}"
                                        data-supplier-name="${row?.['name'] || ''}"
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
                        return`<span>${row?.['name'] || ''}</span>`;
                    }
                },
            ]
        });
    }

    static combineTabSupplierPayableData() {
        const supplierPayableDataList = [];

        tabSupplierPayableElements.$tableSupplierPayable.find('tbody tr').each(function() {
            const typeRow = $(this).attr('data-type-row');
            if (typeRow === 'added' || typeRow === 'updated') {
                const rowData = {
                    id: typeRow === 'added' ? null : $(this).attr('data-id'),
                    type_row: typeRow,
                    account: $(this).find('.row-account').val(),
                    debit_value: parseFloat($(this).find('.row-supplier-payable-debit').attr('value') || 0),
                    credit_value: parseFloat($(this).find('.row-supplier-payable-credit').attr('value') || 0),
                    detail_data: {
                        supplier_payable_supplier: $(this).find('.row-supplier-info').attr('data-supplier-id'),
                        supplier_payable_detail_data: $(this).find('.row-detail-supplier-payable').data('detailInfo') || {}
                    }
                };
                supplierPayableDataList.push(rowData);
            }
        });
        return supplierPayableDataList;
    }

    static loadSupplierPayableDetail($row) {
        const $detailInput = $row.find('.row-detail-supplier-payable');

        tabSupplierPayableElements.$prepaymentSupplierCheckbox.prop('checked', false);
        tabSupplierPayableElements.$txtSupplierInvoiceNumber.val('');
        tabSupplierPayableElements.$unpaidSupplierAmountEle.attr('value', 0);
        tabSupplierPayableElements.$supplierInvoiceDate.val('');
        tabSupplierPayableElements.$expectedSupplierPaymentDate.val('');
        tabSupplierPayableElements.$advanceSupplierPayment.attr('value', 0);
        $('#note_supplier_payable').val('');

        const detailDataStr = $detailInput.attr('data-detail-info');
        if (!detailDataStr) {
            tabSupplierPayableElements.$prepaymentSupplierForm.hide();
            tabSupplierPayableElements.$invoiceSupplierForm.show();
            return;
        }
        const detailData = JSON.parse(detailDataStr);
        const isPrepayment = detailData?.['is_prepayment'] === true;

        if (isPrepayment) {
            // load prepayment data from attributes
            tabSupplierPayableElements.$prepaymentSupplierCheckbox.prop('checked', true);
            tabSupplierPayableElements.$prepaymentSupplierForm.show();
            tabSupplierPayableElements.$invoiceSupplierForm.hide();

            tabSupplierPayableElements.$advanceSupplierPayment.attr('value', parseFloat(detailData?.['advanced_payment'] || 0));
            $('#note_supplier_payable').val(detailData?.['note'] || '');
        } else {
            // load invoice data from attributes
            tabSupplierPayableElements.$prepaymentSupplierCheckbox.prop('checked', false);
            tabSupplierPayableElements.$invoiceSupplierForm.show();
            tabSupplierPayableElements.$prepaymentSupplierForm.hide();

            tabSupplierPayableElements.$txtSupplierInvoiceNumber.val(detailData?.['invoice_number'] || '');
            tabSupplierPayableElements.$unpaidSupplierAmountEle.attr('value', parseFloat(detailData?.['unpaid_amount'] || 0));

            if (detailData?.['invoice_date']) {
                const formattedInvoiceDate = moment(detailData['invoice_date'], 'YYYY-MM-DD').format('DD/MM/YYYY');
                tabSupplierPayableElements.$supplierInvoiceDate.val(formattedInvoiceDate);
            }
            if (detailData?.['expected_payment_date']) {
                const formattedExpectedDate = moment(detailData['expected_payment_date'], 'YYYY-MM-DD').format('DD/MM/YYYY');
                tabSupplierPayableElements.$expectedSupplierPaymentDate.val(formattedExpectedDate);
            }
        }
        $.fn.initMaskMoney2();
    }
}


class TabSupplierPayableEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabSupplierPayableElements.$btnAddSupplierPayable.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabSupplierPayableElements.$tableSupplierPayable);
            let row_added = tabSupplierPayableElements.$tableSupplierPayable.find('tbody tr:last-child');
            row_added.attr('data-type-row', 'added');
            row_added.find('.row-access').prop('disabled', false);
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-account'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1, 'is_account': true}
            });
        });

        // event for deleting row
        tabSupplierPayableElements.$tableSupplierPayable.on('click', '.del-supplier-payable-row', function() {
            UsualLoadPageFunction.DeleteTableRow(
                tabSupplierPayableElements.$tableSupplierPayable,
                parseInt($(this).closest('tr').find('td:first-child').text())
            );
        });

        // event for opening supplier modal
        tabSupplierPayableElements.$tableSupplierPayable.on('click', '.add-supplier-btn', function () {
            tabSupplierPayableVariables.currentSupplierPayableRow = $(this).closest('tr');
            TabSupplierPayableFunction.loadSupplierList();
        });

        // event for button save in supplier modal
        tabSupplierPayableElements.$btnSaveSupplier.on('click', function() {
            const selectedCheckbox = tabSupplierPayableElements.$tableSupplier.find('.supplier-checkbox:checked');
            if (selectedCheckbox.length !== 0) {
                const supplierName = selectedCheckbox.attr('data-supplier-name');
                const supplierId = selectedCheckbox.attr('data-supplier-id');
                const supplierCode = selectedCheckbox.attr('data-supplier-code');

                // get the input field in the current row and set the supplier name
                const $inputField = tabSupplierPayableVariables.currentSupplierPayableRow.find('.row-supplier-info');
                $inputField.val(supplierName);

                // store supplier data in the input field for later use
                $inputField.attr('data-supplier-id', supplierId);
                $inputField.attr('data-supplier-code', supplierCode);

                // enable the detail button
                const $detailButton = tabSupplierPayableVariables.currentSupplierPayableRow.find('.btn-supplier-payable-modal');
                $detailButton.prop('disabled', false);
            }
        });

        // event for load account name when account code is selected
        tabSupplierPayableElements.$tableSupplierPayable.on('change', '.row-supplier-payable-code', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            $(this).closest('tr').find('.row-supplier-payable-code-detail').text(selected?.['acc_code'] || '')
            $(this).closest('tr').find('.row-fk-supplier-payable-name').text(selected?.['foreign_acc_name'] || '')
            $(this).closest('tr').find('.row-supplier-payable-name').text(`(${selected?.['acc_name'] || ''})`)
        });

        // event for prepayment checkbox toggle
        tabSupplierPayableElements.$prepaymentSupplierCheckbox.on('change', function() {
            if ($(this).is(':checked')) {
                // show prepayment form and hide invoice form
                tabSupplierPayableElements.$prepaymentSupplierForm.show();
                tabSupplierPayableElements.$invoiceSupplierForm.hide();
            } else {
                // show invoice form and hide prepayment form
                tabSupplierPayableElements.$prepaymentSupplierForm.hide();
                tabSupplierPayableElements.$invoiceSupplierForm.show();
            }
        });

        // event for opening detail modal
        tabSupplierPayableElements.$tableSupplierPayable.on('click', '.btn-supplier-payable-modal', function() {
            tabSupplierPayableVariables.currentSupplierPayableRow = $(this).closest('tr');
        });

        // event for button save supplier payable detail
        tabSupplierPayableElements.$btnSaveSupplierPayableDetail.on('click', function() {
            const $currentRow = tabSupplierPayableVariables.currentSupplierPayableRow;
            const $detailInput = $currentRow.find('.row-detail-supplier-payable');

            const detailSupplierData = {
                is_prepayment: tabSupplierPayableElements.$prepaymentSupplierCheckbox.is(':checked'),
                note: $('#note_supplier_payable').val() || ''
            };

            if (tabSupplierPayableElements.$invoiceSupplierForm.is(':visible')) {
                const invoiceNumber = tabSupplierPayableElements.$txtSupplierInvoiceNumber.val() || '';
                const unpaidAmount = parseFloat(tabSupplierPayableElements.$unpaidSupplierAmountEle.attr('value') || 0);
                const invoiceDate = tabSupplierPayableElements.$supplierInvoiceDate.val();
                const expectedPaymentDate = tabSupplierPayableElements.$expectedSupplierPaymentDate.val();

                detailSupplierData.is_prepayment = false;
                detailSupplierData.invoice_number = invoiceNumber;
                detailSupplierData.unpaid_amount = unpaidAmount;
                detailSupplierData.invoice_date = invoiceDate ? moment(invoiceDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '';
                detailSupplierData.expected_payment_date = expectedPaymentDate ? moment(expectedPaymentDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : '';
                detailSupplierData.advanced_payment = 0;

                // Update display text
                $detailInput.val(`HÐ: ${invoiceNumber} - ${unpaidAmount.toLocaleString('vi-VN')} VND`);
                $currentRow.find('.row-supplier-payable-debit').attr('value', unpaidAmount);
                $currentRow.find('.row-supplier-payable-credit').attr('value', 0);

            } else if (tabSupplierPayableElements.$prepaymentSupplierForm.is(':visible')) {
                const advancePayment = parseFloat(tabSupplierPayableElements.$advanceSupplierPayment.attr('value') || 0);

                detailSupplierData.is_prepayment = true;
                detailSupplierData.advanced_payment = advancePayment;
                detailSupplierData.invoice_number = '';
                detailSupplierData.unpaid_amount = 0;
                detailSupplierData.invoice_date = '';
                detailSupplierData.expected_payment_date = '';

                // Update display text
                $detailInput.val(`Pre-payment: ${advancePayment.toLocaleString('vi-VN')} VND`);
                $currentRow.find('.row-supplier-payable-debit').attr('value', 0);
                $currentRow.find('.row-supplier-payable-credit').attr('value', advancePayment);
            }
            $detailInput.data('detailInfo', detailSupplierData);
            $currentRow.find('.btn-supplier-payable-modal').prop('disabled', false);  // enable detail button
            $.fn.initMaskMoney2();
            $('#supplier_payable_modal').modal('hide');
        });

        // event when modal is opened - reset to default state
        tabSupplierPayableElements.$supplierPayableModal.on('show.bs.modal', function() {
            tabSupplierPayableElements.$prepaymentSupplierForm.hide();
            tabSupplierPayableElements.$invoiceSupplierForm.show();
            tabSupplierPayableElements.$prepaymentSupplierCheckbox.prop('checked', false);  // uncheck prepayment checkbox
        });

        // event when click btn edit row
        tabSupplierPayableElements.$tableSupplierPayable.on('click', '.update-supplier-payable-row', function() {
            const $row = $(this).closest('tr');
            $row.find('.row-access').prop('disabled', false);
            $row.attr('data-type-row', 'updated');
        });

        // event when click button to open account receivable modal
        tabSupplierPayableElements.$tableSupplierPayable.on('click', '.btn-supplier-payable-modal', function () {
            const $row = $(this).closest('tr');
            tabSupplierPayableVariables.currentSupplierPayableRow = $row;
            TabSupplierPayableFunction.loadSupplierPayableDetail($row);  // load existing detail data into modal if available
        });
    }
}
