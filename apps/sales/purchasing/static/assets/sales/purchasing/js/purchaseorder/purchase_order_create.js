$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_purchase_order_create');
        // Elements
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        let elePurchaseQuotation = $('#purchase-order-purchase-quotation');
        let eleBoxSupplier = $('#box-purchase-order-supplier');
        let eleBoxContact = $('#box-purchase-order-contact');
        // Tables
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        let tablePurchaseQuotation = $('#datable-purchase-quotation');
        let tablePurchaseOrderProductAdd = $('#datable-purchase-order-product-add');
        let tablePurchaseOrderProductRequest = $('#datable-purchase-order-product-request');

        // Load init
        POLoadDataHandle.loadBoxSupplier();
        POLoadDataHandle.loadBoxContact();
        PODataTableHandle.dataTablePurchaseRequest();
        PODataTableHandle.dataTablePurchaseRequestProduct();
        PODataTableHandle.dataTablePurchaseRequestProductMerge();
        PODataTableHandle.dataTablePurchaseQuotation();
        PODataTableHandle.dataTablePurchaseOrderProductAdd();
        PODataTableHandle.dataTablePurchaseOrderProductRequest();

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

        function checkDataTableRenderThenHidden() {
            let element0 = $('#datable-purchase-order-product-request_wrapper');
            let element1 = $('#datable-purchase-request-product-merge_wrapper');
            if (element0.length && element1.length) { // hidden ele if condition pass
                element0[0].setAttribute('hidden', 'true');
                element1[0].setAttribute('hidden', 'true');
            } else {
                setTimeout(checkDataTableRenderThenHidden, 1000);  // call again after 1s if condition not pass yet
            }
        }
        checkDataTableRenderThenHidden();

// EVENTS
        // Action on change dropdown supplier
        eleBoxSupplier.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(eleBoxSupplier, $(this).val());
                if (dataSelected) {
                    eleBoxContact.empty();
                    POLoadDataHandle.loadBoxContact(dataSelected.owner, dataSelected.id);
                }
            } else { // No Value => load again dropdowns
                eleBoxContact.empty();
                POLoadDataHandle.loadBoxContact();
            }
            POLoadDataHandle.loadMoreInformation($(this));
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
        $('#table-purchase-request-checkbox-all').on('click', function() {
            clickCheckBoxAll($(this), tablePurchaseRequest);
            POLoadDataHandle.loadModalPurchaseRequestProductTable(true);
        });

        // Action on click .table-row-checkbox of tablePurchaseRequest
        tablePurchaseRequest.on('click', '.table-row-checkbox', function() {
            $('#table-purchase-request-checkbox-all')[0].checked = false;
            POLoadDataHandle.loadModalPurchaseRequestProductTable();
        });

        // Action on click btn add purchase request
        $('#btn-confirm-add-purchase-request').on('click', function () {
            POLoadDataHandle.loadDataShowPurchaseRequest();
        });

        // Action on click btn remove purchase request
        elePurchaseRequest.on('click', '.custom-btn-remove', function() {
            let removeIDList = [this.id];
            POLoadDataHandle.loadDataAfterClickRemove(tablePurchaseRequest, removeIDList, "purchase_request");
        });

        // Action on change quantity order of tablePurchaseRequestProduct
        tablePurchaseRequestProduct.on('change', '.table-row-quantity-order', function() {
            POValidateHandle.validateNumber(this);
            let remain = parseFloat(this.closest('tr').querySelector('.table-row-remain').innerHTML);
            POValidateHandle.validateQuantityOrderAndRemain(this, remain);
        });

        // Purchase quotation modal
        $('#btn-purchase-quotation-modal').on('click', function () {
            POLoadDataHandle.loadModalPurchaseQuotation();
        });

        // Action on click add purchase quotation
        $('#btn-confirm-add-purchase-quotation').on('click', function () {
            POLoadDataHandle.loadDataShowPurchaseQuotation();
        });

        // Action on click checkbox purchase quotation
        elePurchaseQuotation.on('click', '.checkbox-quotation', function () {
            if (this.checked === true) {
               POLoadDataHandle.loadSupplierContactByCheckedQuotation(this);
            }
            for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                if (item.id !== $(this)[0].id) {
                    item.checked = false;
                }
            }
            POLoadDataHandle.loadCheckProductsByCheckedQuotation(this);
        });

        // Action on click btn remove purchase quotation
        elePurchaseQuotation.on('click', '.custom-btn-remove', function() {
            let checked_id = null;
            for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                if (item.checked === true) {
                    checked_id = item.id;
                }
            }
            let removeIDList = [this.id];
            POLoadDataHandle.loadDataAfterClickRemove(tablePurchaseQuotation, removeIDList, "purchase_quotation");
            if (checked_id) {
                for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                    if (item.id === checked_id) {
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
            if (elePurchaseRequest[0].innerHTML) {
                $('#btn-warning-add-product').click();
            } else {
                POLoadDataHandle.loadTableProductNoPurchaseRequest();
            }
        });

        // Action on click btn continue to add product
        $('#btn-continue-add-product').on('click', function() {
            POLoadDataHandle.loadTableProductNoPurchaseRequest();
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

        // Action on change data on row of tablePurchaseOrderProductRequest
        tablePurchaseOrderProductRequest.on('change', '.table-row-quantity-order-actual, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-quantity-order-actual')) {
                POValidateHandle.validateNumber(this);
                let order_on_request = row.querySelector('.table-row-quantity-order-request').innerHTML;
                POValidateHandle.validateQuantityOrderFinal(this, order_on_request);
            }
            POCalculateHandle.calculateMain(tablePurchaseOrderProductRequest, row);
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
                // system
                'system_status',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });



    });
});
