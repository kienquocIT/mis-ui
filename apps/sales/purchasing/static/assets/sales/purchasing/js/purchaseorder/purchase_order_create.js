$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_purchase_order_create');
        // Elements
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        let eleTabArea = $('#tab-content-quotation-product');
        let $tabs = $('#quotation-tabs');
        // Tables
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        let tablePurchaseOrderProductAdd = $('#datable-purchase-order-product-add');
        let tablePurchaseOrderProductRequest = $('#datable-purchase-order-product-request');

        // Load init
        POLoadDataHandle.loadInitS2(POLoadDataHandle.supplierSelectEle, [], {'account_types_mapped__account_type_order': 1}, null, true);
        POLoadDataHandle.loadInitS2(POLoadDataHandle.contactSelectEle);
        POLoadDataHandle.loadInitProduct();
        PODataTableHandle.dataTablePurchaseRequest();
        PODataTableHandle.dataTablePurchaseRequestProduct();
        PODataTableHandle.dataTablePurchaseRequestProductMerge();
        PODataTableHandle.dataTablePurchaseQuotation();
        PODataTableHandle.dataTablePurchaseOrderProductAdd();
        PODataTableHandle.dataTablePurchaseOrderProductRequest();
        PODataTableHandle.dataTablePaymentStage();
        PODataTableHandle.dataTableInvoice();
        PODataTableHandle.dataTableSelectInvoice();
        PODataTableHandle.dataTableSelectReconcile();

        // init date picker
        $('.date-picker').each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            });
            $(this).val('').trigger('change');
        })

        // file
        if (formSubmit.attr('data-method').toLowerCase() === 'post') {
            new $x.cls.file($('#attachment')).init({
                name: 'attachment',
                enable_edit: true,
            });
        }

        // collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        // workflow init
        WFRTControl.setWFInitialData("purchaseorder");


// EVENTS
        // Action on change dropdown supplier
        POLoadDataHandle.supplierSelectEle.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(POLoadDataHandle.supplierSelectEle, $(this).val());
                if (dataSelected) {
                    POLoadDataHandle.contactSelectEle.empty();
                    POLoadDataHandle.loadInitS2(POLoadDataHandle.contactSelectEle, [dataSelected?.['owner']], {'account_name_id': dataSelected?.['id']});
                    document.getElementById('customer-price-list').value = dataSelected?.['price_list_mapped']?.['id'];
                }
            } else { // No Value => load again contact
                POLoadDataHandle.contactSelectEle.empty();
                POLoadDataHandle.loadInitS2(POLoadDataHandle.contactSelectEle);
            }
            if (POLoadDataHandle.PRDataEle.val()) {
                POLoadDataHandle.loadTableProductByPurchaseRequest();
            }
        });

        // Purchase request modal
        $('#btn-purchase-request-modal').on('click', function () {
            POLoadDataHandle.loadModalPurchaseRequestTable();
        });

        // Checkbox merge product
        $('#merge-same-product').on('click', function() {
            POLoadDataHandle.loadOrHiddenMergeProductTable();
        });

        // Action on click .table-row-checkbox of tablePurchaseRequest
        tablePurchaseRequest.on('change', '.form-check-input', function() {
            POLoadDataHandle.loadModalPurchaseRequestProductTable();
        });

        // Action on click btn ADD PURCHASE REQUEST
        $('#btn-confirm-add-purchase-request').on('click', function () {
            POLoadDataHandle.loadDataShowPurchaseRequest();
            POLoadDataHandle.loadReDataTbl();
            POLoadDataHandle.loadTableProductByPurchaseRequest();
            if (elePurchaseRequest[0].innerHTML) {
                POLoadDataHandle.loadModalPurchaseQuotation();
            } else {
                POLoadDataHandle.loadModalPurchaseQuotation(true);
            }
        });

        // Action on click btn remove purchase request
        elePurchaseRequest.on('click', '.custom-btn-remove', function() {
            POLoadDataHandle.loadDataWhenRemovePR(this);
        });

        // Action on change quantity order of tablePurchaseRequestProduct
        tablePurchaseRequestProduct.on('change', '.table-row-quantity-order', function () {
            let remain = parseFloat(this.closest('tr').querySelector('.table-row-remain').innerHTML);
            let valid_quantity = POValidateHandle.validateQuantityOrderRequest(this, remain);
            let eleCheck = this?.closest('tr')?.querySelector('.table-row-checkbox');
            if (eleCheck) {
                eleCheck.checked = valid_quantity;
            }
        });

        // Purchase quotation modal
        $('#btn-purchase-quotation-modal').on('click', function () {
            let $tableProductPR = $('#datable-purchase-order-product-request');
            let $tableProductAdd = $('#datable-purchase-order-product-add');
            if ($tableProductPR.DataTable().rows().count() !== 0 || $tableProductAdd.DataTable().rows().count() !== 0) {
                POLoadDataHandle.loadModalPurchaseQuotation();
            } else {
                $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-product-needed')}, 'failure');
                return false;
            }
        });

        // Action on click ADD PURCHASE QUOTATION
        $('#btn-confirm-add-purchase-quotation').on('click', function () {
            POLoadDataHandle.loadDataShowPurchaseQuotation();
        });

        // Action on click checkbox purchase quotation
        POLoadDataHandle.$elePQ.on('click', '.checkbox-quotation', function () {
            POLoadDataHandle.loadCheckPQ(this);
        });

        // Action on click btn remove purchase quotation
        POLoadDataHandle.$elePQ.on('click', '.custom-btn-remove', function() {
            let checked_id = null;
            for (let item of POLoadDataHandle.$elePQ[0].querySelectorAll('.checkbox-quotation')) {
                if (item.checked === true) {
                    checked_id = item.getAttribute('data-id');
                }
            }
            POLoadDataHandle.loadDataWhenRemovePQ(this);
            if (checked_id) {
                for (let item of POLoadDataHandle.$elePQ[0].querySelectorAll('.checkbox-quotation')) {
                    if (item.getAttribute('data-id') === checked_id) {
                        $(item).click();
                    }
                }
            }
        });

        // Action on click btn continue to add product
        $('#btn-continue-add-product').on('click', function() {
            POLoadDataHandle.loadDataWhenClearPR(true);
            POLoadDataHandle.loadAddRowTableProductAdd();
        });

        // Action on change data on row of tablePurchaseOrderProductAdd
        tablePurchaseOrderProductAdd.on('change', '.table-row-item, .table-row-quantity-order-actual, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                POLoadDataHandle.loadDataProductSelect($(this));
            } else {
                POCalculateHandle.calculateMain(tablePurchaseOrderProductAdd, row);
            }
        });

        tablePurchaseOrderProductAdd.on('click', '.table-row-price-option', function () {
            if (!$(this)[0].querySelector('.expired-price')) { // Check if price not expired
                let priceValRaw = $(this)[0].getAttribute('data-value');
                if (priceValRaw) {
                    let row = $(this)[0].closest('tr');
                    let elePrice = row.querySelector('.table-row-price');
                    if (elePrice) {
                        $(elePrice).attr('value', String(priceValRaw));
                        $.fn.initMaskMoney2();
                        POCalculateHandle.calculateMain(tablePurchaseOrderProductAdd, row);
                    }
                    // make button option checked
                    let allOption = $(row).find('.table-row-price-option');
                    if (allOption) {
                        allOption.removeClass('option-btn-checked');
                    }
                    $(this).addClass('option-btn-checked');
                }
            }
        });

        tablePurchaseOrderProductAdd.on('click', '.del-row', function () {
            deleteRow(this.closest('tr'), tablePurchaseOrderProductAdd);
            POCalculateHandle.calculateTotal(tablePurchaseOrderProductAdd[0]);
        });

        // Action on change data on row of tablePurchaseOrderProductRequest
        tablePurchaseOrderProductRequest.on('change', '.table-row-uom-order-actual, .table-row-quantity-order-actual, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            // Change quantity
            if ($(this).hasClass('table-row-quantity-order-actual')) {
                POValidateHandle.validateQuantityOrderActualAndUpdateStock(row);
            }
            // Change uom
            if ($(this).hasClass('table-row-uom-order-actual')) {
                let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
                let eleUOMOrder = row.querySelector('.table-row-uom-order-actual');
                if (dataRowRaw && $(eleUOMOrder).val()) {
                    let dataRow = JSON.parse(dataRowRaw);
                    let uomRequestData = dataRow?.['uom_order_request'];
                    let uomOrderData = SelectDDControl.get_data_from_idx($(eleUOMOrder), $(eleUOMOrder).val());
                    if (uomRequestData?.['id'] !== uomOrderData?.['id']) {
                        row.querySelector('.table-row-quantity-order-actual').value = 0;
                        row.querySelector('.table-row-stock').innerHTML = '0';
                    }
                }
            }
            POCalculateHandle.calculateMain(tablePurchaseOrderProductRequest, row);
        });

        tablePurchaseOrderProductRequest.on('click', '.btn-view-price', function () {
            POLoadDataHandle.loadPriceListPQ(this);
        });

        // PAYMENT
        $tabs.on('click', '.tab-payment', function () {
            POStoreDataHandle.storeDtbData(3);
            POStoreDataHandle.storeDtbData(4);
        });

        PODataTableHandle.$tableInvoice.on('change', '.table-row-total', function () {
            let row = this.closest('tr');
            if (row) {
                let balanceEle = row.querySelector('.table-row-balance');
                if (balanceEle) {
                    $(balanceEle).attr('value', String($(this).valCurrency()));
                    $.fn.initMaskMoney2();
                }
            }
        });

        PODataTableHandle.$tableInvoice.on('click', '.del-row', function (e) {
            deleteRow(this.closest('tr'), PODataTableHandle.$tableInvoice);
            reOrderSTT(PODataTableHandle.$tableInvoice);
            PODataTableHandle.$tablePayment.DataTable().clear().draw();
        });

        PODataTableHandle.$tablePayment.on('change', '.table-row-date, .table-row-installment, .table-row-ratio, .table-row-value-before-tax, .table-row-issue-invoice, .table-row-value-tax, .table-row-value-total, .table-row-due-date', function () {
            if (POLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let row = this.closest('tr');
                if ($(this).hasClass('table-row-date')) {
                    let isCheck = true;
                    let eleDueDate = row.querySelector('.table-row-due-date');
                    let eleInstallment = row.querySelector('.table-row-installment');
                    if (eleDueDate && eleInstallment) {
                        if ($(this).val() && $(eleDueDate).val() && !$(eleInstallment).val()) {
                            isCheck = validateStartEndDate($(this).val(), $(eleDueDate).val());
                        }
                    }
                    if (isCheck === true) {
                        POLoadDataHandle.loadChangePSDate(this);
                    } else {
                        $(this).val(null);
                        $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-validate-due-date')}, 'failure');
                        return false;
                    }
                }
                if ($(this).hasClass('table-row-installment')) {
                    POLoadDataHandle.loadChangeInstallment(this);
                }
                if ($(this).hasClass('table-row-ratio')) {
                    POLoadDataHandle.loadPaymentValues(this);
                    let valBeforeEle = row.querySelector('.table-row-value-before-tax');
                    validatePSValue(valBeforeEle);
                    POLoadDataHandle.loadMinusBalance();
                }
                if ($(this).hasClass('table-row-issue-invoice')) {
                    POLoadDataHandle.loadChangePSIssueInvoice(this);
                }
                if ($(this).hasClass('table-row-due-date')) {
                    let row = this.closest('tr');
                    let eleDate = row.querySelector('.table-row-date');
                    let eleTerm = row.querySelector('.table-row-term');
                    if (eleDate && eleTerm) {
                        if ($(this).val() && $(eleDate).val() && !$(eleTerm).val()) {
                            let isCheck = validateStartEndDate($(eleDate).val(), $(this).val());
                            if (isCheck === false) {
                                $(this).val(null);
                                $.fn.notifyB({description: POLoadDataHandle.transEle.attr('data-validate-due-date')}, 'failure');
                                return false;
                            }
                        }
                    }
                }
                if ($(this).hasClass('table-row-value-before-tax')) {
                    POLoadDataHandle.loadPaymentValues(this);
                    POLoadDataHandle.loadMinusBalance();
                }
                if ($(this).hasClass('table-row-value-tax')) {
                    POLoadDataHandle.loadPaymentValues(this);
                    POLoadDataHandle.loadMinusBalance();
                }
            }
        });

        PODataTableHandle.$tablePayment.on('click', '.btn-select-invoice', function () {
            POLoadDataHandle.loadModalSInvoice(this);
        });

        POLoadDataHandle.$btnSaveInvoice.on('click', function () {
            POLoadDataHandle.loadSaveSInvoice();
        });

        PODataTableHandle.$tablePayment.on('click', '.btn-select-reconcile', function () {
            POLoadDataHandle.loadModalSReconcile(this);
        });

        POLoadDataHandle.$btnSaveReconcile.on('click', function () {
            POLoadDataHandle.loadSaveSReconcile();
        });

        // COMMON
        eleTabArea.on('change', '.valid-number', function () {
            let value = this.value;
            // Replace non-digit characters with an empty string
            value = value.replace(/[^0-9.]/g, '');
            // Remove unnecessary zeros from the integer part
            value = value.replace("-", "").replace(/^0+(?=\d)/, '');
            // Update value of input
            this.value = value;
        });

// SUBMIT FORM
        SetupFormSubmit.validate(formSubmit, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            let _form = new SetupFormSubmit(formSubmit);
            let result = POSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
            let submitFields = [
                'title',
                'purchase_requests_data',
                'purchase_quotations_data',
                'purchase_request_products_data',
                'supplier',
                'supplier_data',
                'contact',
                'contact_data',
                'delivered_date',
                'status_delivered',
                // purchase order tabs
                'purchase_order_products_data',
                // total amount
                'total_product_pretax_amount',
                'total_product_tax',
                'total_product',
                'total_product_revenue_before_tax',
                // payment stage tab
                'purchase_order_payment_stage',
                'purchase_order_invoice',
                // attachment
                'attachment',
                // abstract
                'system_status',
                'next_node_collab_id',
                'is_change',
                'document_root_id',
                'document_change_order',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            WFRTControl.callWFSubmitForm(_form);
        }


    });
});
