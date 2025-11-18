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
                            <input type="text" class="form-control row-supplier-info" 
                                placeholder="Click to select..." readonly/>
                            <span class="input-group-text p-0">
                                <button type="button" ${option === 'detail' ? 'disabled' : ''}
                                    class="btn btn-primary btn-sm add-supplier-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#supplier-modal">
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
                        return `<div class="input-group">
                            <select class="form-select select2 row-supplier-payable-code"></select>
                            <span class="input-group-text p-0">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-regular fa-circle-question"></i>
                                </a>
                                <div class="dropdown-menu bflow-mirrow-card-80 p-3" style="min-width: 200px;">
                                    <h5 class="row-supplier-payable-code-detail fw-bold"></h5>
                                    <h6 class="row-fk-supplier-payable-name"></h6>
                                    <h6 class="row-supplier-payable-name"></h6>
                                </div>
                            </span>
                        </div>`;
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
                    className: "w-5 text-right",
                    render: () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''}
                               type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-supplier-payable-row">
                               <span class="icon"><i class="far fa-trash-alt"></i></span>
                          </button>`;
                    }
                },
            ]
        });
    }

    static loadSupplierList() {
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
                        return `<div class="form-check">
                                    <input type="radio" name="supplier-checkbox" class="form-check-input supplier-checkbox"
                                        data-supplier-id="${row?.['id'] || ''}"
                                        data-supplier-code="${row?.['code'] || ''}"
                                        data-supplier-name="${row?.['name'] || ''}">
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


class TabSupplierPayableEventHandler {
    static InitPageEvent() {
        // event when click button add
        tabSupplierPayableElements.$btnAddSupplierPayable.on('click', function() {
            UsualLoadPageFunction.AddTableRow(tabSupplierPayableElements.$tableSupplierPayable);
            let row_added = tabSupplierPayableElements.$tableSupplierPayable.find('tbody tr:last-child');
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: row_added.find('.row-supplier-payable-code'),
                data_url: pageElements.$urlFactory.attr('data-url-accounting-account'),
                data_params: {'acc_type': 1}
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

            if (tabSupplierPayableElements.$invoiceSupplierForm.is(':visible')) {
                const invoiceNumber = tabSupplierPayableElements.$txtSupplierInvoiceNumber.val();
                const invoiceValue = tabSupplierPayableElements.$unpaidSupplierAmountEle.attr('value') || 0;

                $currentRow.find('.row-detail-supplier-payable').val(`HÐ: ${invoiceNumber} - ${invoiceValue} (VND)`);
                $currentRow.find('.row-supplier-payable-debit').attr('value', 0);
                $currentRow.find('.row-supplier-payable-credit').attr('value', invoiceValue);
            } else if (tabSupplierPayableElements.$prepaymentSupplierForm.is(':visible')) {
                // prepayment form is open
                const advancePaymentValue = tabSupplierPayableElements.$advanceSupplierPayment.attr('value') || 0;
                $currentRow.find('.row-detail-supplier-payable').val(`Pre-payment: ${advancePaymentValue}`);

                // set advance payment value to debit and credit fields
                $currentRow.find('.row-supplier-payable-debit').attr('value', advancePaymentValue);
                $currentRow.find('.row-supplier-payable-credit').attr('value', 0);
            }
            $.fn.initMaskMoney2();
        });

        // event when modal is opened - reset to default state
        tabSupplierPayableElements.$supplierPayableModal.on('show.bs.modal', function() {
            tabSupplierPayableElements.$prepaymentSupplierForm.hide();
            tabSupplierPayableElements.$invoiceSupplierForm.show();
            tabSupplierPayableElements.$prepaymentSupplierCheckbox.prop('checked', false);  // uncheck prepayment checkbox
        });
    }
}
