$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_purchase_order_create');
        let loadDataClass = new loadDataHandle();
        let dataTableClass = new dataTableHandle();
        let submitClass = new submitHandle();
        let calculateClass = new calculateHandle();
        // Elements
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        let elePurchaseQuotation = $('#purchase-order-purchase-quotation');
        let eleBoxSupplier = $('#box-purchase-order-supplier');
        let eleCommonArea = $('#common-information-area');
        // Tables
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        let tablePurchaseQuotation = $('#datable-purchase-quotation');
        let tablePurchaseOrderProductAdd = $('#datable-purchase-order-product-add');
        let tablePurchaseOrderProductRequest = $('#datable-purchase-order-product-request');

        // Load init
        loadDataClass.loadInitProduct();
        loadDataClass.loadInitUOM();
        loadDataClass.loadInitTax();
        dataTableClass.dataTablePurchaseRequest();
        dataTableClass.dataTablePurchaseRequestProduct();
        dataTableClass.dataTablePurchaseQuotation();
        dataTableClass.dataTablePurchaseOrderProductAdd();

        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            minYear: 1901,
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            // "cancelClass": "btn-secondary",
            // maxYear: parseInt(moment().format('YYYY'), 10)
            locale: {
                format: 'DD/MM/YYYY hh:mm A'
            }
        });
        $('#purchase-order-date-delivered').val(null).trigger('change');

// EVENTS
        // Action on click dropdown supplier
        // eleBoxSupplier.on('click', function() {
        //     loadDataClass.loadBoxSupplier(null);
        // });

        // Action on click dropdown supplier
        eleCommonArea.on('click', '.select2-selection', function() {
            let eleSelect = $(this)[0].closest('.form-group').querySelector('.form-select');
            if (eleSelect.id === 'box-purchase-order-supplier') {
                loadDataClass.loadBoxSupplier(null);
            }
        });

        // Action on change dropdown supplier
        eleBoxSupplier.on('change', function () {
            let optionSelected = eleBoxSupplier[0].options[eleBoxSupplier[0].selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let data = JSON.parse(optionSelected.querySelector('.data-info').value);
                    // load Contact by supplier
                    if (data.id && data.owner) {
                        loadDataClass.loadBoxContact(data.owner.id, data.id);
                    }
                } else { // No Value => load again dropdowns
                    loadDataClass.loadBoxContact();
                }
            }
            loadDataClass.loadMoreInformation($(this));
        });

        // Purchase request modal
        $('#btn-purchase-request-modal').on('click', function () {
            loadDataClass.loadModalPurchaseRequest(tablePurchaseRequest, tablePurchaseRequestProduct);
        });

        // Checkbox merge product
        $('#merge-same-product').on('click', function() {
            loadDataClass.loadMergeProductTable($(this));
        });

        // Checkbox all
        $('#table-purchase-reqeust-checkbox-all').on('click', function() {
            clickCheckBoxAll($(this), tablePurchaseRequest);
        });

        // Action on click .table-row-checkbox of tablePurchaseRequest
        tablePurchaseRequest.on('click', '.table-row-checkbox', function() {
            if ($(this)[0].checked === false) {
                let targetID = $(this)[0].id;
                uncheckRowTableRelate(tablePurchaseRequestProduct, targetID)
            }
        });

        // Action on click btn add purchase request
        $('#btn-confirm-add-purchase-request').on('click', function () {
            loadDataClass.loadDataShowPurchaseRequest(elePurchaseRequest, tablePurchaseRequest);
        });

        // Action on click btn remove purchase request
        elePurchaseRequest.on('click', '.custom-btn-remove', function() {
            loadDataClass.loadDataAfterClickRemove($(this), elePurchaseRequest, tablePurchaseRequest, "purchase_request");
        });

        // Purchase quotation modal
        $('#btn-purchase-quotation-modal').on('click', function () {
            loadDataClass.loadModalPurchaseQuotation(tablePurchaseQuotation);
        });

        // Action on click add purchase quotation
        $('#btn-confirm-add-purchase-quotation').on('click', function () {
            loadDataClass.loadDataShowPurchaseQuotation(elePurchaseQuotation, tablePurchaseQuotation);
        });

        // Action on click btn remove purchase quotation
        elePurchaseQuotation.on('click', '.custom-btn-remove', function() {
            let checked_id = null;
            for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                if (item.checked === true) {
                    checked_id = item.id;
                }
            }
            loadDataClass.loadDataAfterClickRemove($(this), elePurchaseQuotation, tablePurchaseQuotation, "purchase_quotation");
            if (checked_id) {
                for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                    if (item.id === checked_id) {
                        item.checked = true;
                        loadDataClass.loadPriceByCheckedQuotation($(item));
                    }
                }
            }
        });

        // Action on click checkbox purchase quotation
        elePurchaseQuotation.on('click', '.checkbox-quotation', function () {
            for (let item of elePurchaseQuotation[0].querySelectorAll('.checkbox-quotation')) {
                if (item.id !== $(this)[0].id) {
                    item.checked = false;
                }
            }
            loadDataClass.loadPriceByCheckedQuotation($(this));
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
                loadDataClass.loadTableProductNoPurchaseRequest();
            }
        });

        // Action on click btn continue to add product
        $('#btn-continue-add-product').on('click', function() {
            loadDataClass.loadTableProductNoPurchaseRequest();
        });

        // Action on change data on row of tablePurchaseOrderProductAdd
        tablePurchaseOrderProductAdd.on('change', '.table-row-item, .table-row-quantity-order, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if ($(this).hasClass('table-row-item')) {
                loadDataClass.loadDataProductSelect($(this));
            } else {
                calculateClass.calculateMain(tablePurchaseOrderProductAdd, row);
            }
        });

        // Action on change data on row of tablePurchaseOrderProductRequest
        tablePurchaseOrderProductRequest.on('change', '.table-row-quantity-order, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            calculateClass.calculateMain(tablePurchaseOrderProductRequest, row);
        });

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            submitClass.setupDataSubmit(_form);
            let submitFields = [
                'title',
                'purchase_requests_data',
                'supplier',
                'contact',
                // total amount
                'total_product_pretax_amount',
                'total_product_tax',
                'total_product',
                'total_product_revenue_before_tax',
                // purchase order tabs
                'purchase_order_products_data',
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
