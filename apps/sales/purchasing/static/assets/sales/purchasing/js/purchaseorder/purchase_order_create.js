$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_purchase_order_create');
        // Elements
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        let elePurchaseQuotation = $('#purchase-order-purchase-quotation');
        let btnAddPayment = $('#btn-add-po-payment-stage');
        let eleTabArea = $('#tab-content-quotation-product');
        // Tables
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        // let tablePurchaseQuotation = $('#datable-purchase-quotation');
        let tablePurchaseOrderProductAdd = $('#datable-purchase-order-product-add');
        let tablePurchaseOrderProductRequest = $('#datable-purchase-order-product-request');
        let tablePaymentStage = $('#datable-po-payment-stage');

        // Load init
        if (formSubmit.attr('data-method') === 'POST') {
            POLoadDataHandle.loadBoxSupplier();
            POLoadDataHandle.loadBoxContact();
            PODataTableHandle.dataTablePurchaseRequest();
            PODataTableHandle.dataTablePurchaseRequestProduct();
            PODataTableHandle.dataTablePurchaseRequestProductMerge();
            PODataTableHandle.dataTablePurchaseQuotation();
            PODataTableHandle.dataTablePurchaseOrderProductAdd();
            PODataTableHandle.dataTablePurchaseOrderProductRequest();
            PODataTableHandle.dataTablePaymentStage();
        }

        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            minYear: 1901,
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY hh:mm A'
            }
        });
        $('#purchase-order-date-delivered').val(null).trigger('change');


// EVENTS
        // Action on change title
        $('#purchase-order-title').on('change', function () {
            // check enable btn PR, PQ
            POValidateHandle.validateEnablePRPQ();
        });

        // Action on change dropdown supplier
        POLoadDataHandle.supplierSelectEle.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(POLoadDataHandle.supplierSelectEle, $(this).val());
                if (dataSelected) {
                    POLoadDataHandle.contactSelectEle.empty();
                    POLoadDataHandle.loadBoxContact(dataSelected.owner, dataSelected.id);
                    document.getElementById('customer-price-list').value = dataSelected?.['price_list_mapped']?.['id'];
                    POLoadDataHandle.loadDataProductAll();
                }
                // check enable btn PR, PQ
                POValidateHandle.validateEnablePRPQ();
            } else { // No Value => load again dropdowns
                POLoadDataHandle.contactSelectEle.empty();
                POLoadDataHandle.loadBoxContact();
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

        // Checkbox all
        tablePurchaseRequest.on('click', '.table-checkbox-all', function() {
            clickCheckBoxAll($(this), tablePurchaseRequest);
            POLoadDataHandle.loadModalPurchaseRequestProductTable();
        });

        // Action on click .table-row-checkbox of tablePurchaseRequest
        tablePurchaseRequest.on('click', '.table-row-checkbox', function() {
            tablePurchaseRequest[0].querySelector('.table-checkbox-all').checked = false;
            POLoadDataHandle.loadModalPurchaseRequestProductTable();
        });

        // Action on click btn ADD PURCHASE REQUEST
        $('#btn-confirm-add-purchase-request').on('click', function () {
            POLoadDataHandle.loadDataShowPurchaseRequest();
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
            POValidateHandle.validateNumber(this);
            let remain = parseFloat(this.closest('tr').querySelector('.table-row-remain').innerHTML);
            let valid_quantity = POValidateHandle.validateQuantityOrderRequest(this, remain);
            let eleCheck = this?.closest('tr')?.querySelector('.table-row-checkbox');
            if (eleCheck) {
                eleCheck.checked = valid_quantity;
            }
        });

        // Purchase quotation modal
        $('#btn-purchase-quotation-modal').on('click', function () {
            POLoadDataHandle.loadModalPurchaseQuotation();
        });

        // Action on click ADD PURCHASE QUOTATION
        $('#btn-confirm-add-purchase-quotation').on('click', function () {
            POLoadDataHandle.loadDataShowPurchaseQuotation();
            POLoadDataHandle.loadPriceListByPurchaseQuotation();
        });

        // Action on click checkbox purchase quotation
        elePurchaseQuotation.on('click', '.checkbox-quotation', function () {
            POLoadDataHandle.loadUpdateDataPQ(this);
            POLoadDataHandle.loadSupplierContactByCheckedQuotation(this);
            POLoadDataHandle.loadCheckProductsByCheckedQuotation(this);
            if (this.checked === true) {
                for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                    if (item.getAttribute('data-id') !== $(this)[0].getAttribute('data-id')) {
                        item.checked = false;
                    }
                }
            }
        });

        // Action on click btn remove purchase quotation
        elePurchaseQuotation.on('click', '.custom-btn-remove', function() {
            let checked_id = null;
            for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                if (item.checked === true) {
                    checked_id = item.getAttribute('data-id');
                }
            }
            POLoadDataHandle.loadDataWhenRemovePQ(this);
            if (checked_id) {
                for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                    if (item.getAttribute('data-id') === checked_id) {
                        $(item).click();
                    }
                }
            }
        });

        // Action on click button collapse
        $('#info-collapse').click(function () {
            $(this).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        // Action on click button add product
        $('#btn-add-product-purchase-order').on('click', function() {
            POLoadDataHandle.loadAddRowTableProductAdd();
        });

        // Action on click button add product if request
        $('#btn-add-product-purchase-order-if-request').on('click', function() {
            $('#btn-warning-add-product').click();
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
                POValidateHandle.validateNumber(this);
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

        // PAYMENT STAGE
        btnAddPayment.on('click', function () {
            POLoadDataHandle.loadAddPaymentStage();
        });

        tablePaymentStage.on('change', '.table-row-value-before-tax, .table-row-tax', function () {
           POCalculateHandle.calculateValueAfterTax(this.closest('tr'));
        });

        tablePaymentStage.on('click', '.del-row', function () {
            deleteRow(this.closest('tr'), tablePaymentStage);
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
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            POSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'title',
                'purchase_requests_data',
                'purchase_quotations_data',
                'purchase_request_products_data',
                'supplier',
                'contact',
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
                // system
                'system_status',
                'attachment',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': _form.dataUrl,
                    'method': _form.dataMethod,
                    'data': _form.dataForm,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err.data.errors}, 'failure');
                }
            )
        });



    });
});
