$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_purchase_order_create');
        let loadDataClass = new loadDataHandle();
        let dataTableClass = new dataTableHandle();
        // Elements
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        let elePurchaseQuotation = $('#purchase-order-purchase-quotation');
        // Tables
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        let tablePurchaseRequestProductMerge = $('#datable-purchase-request-product-merge');
        let tablePurchaseQuotation = $('#datable-purchase-quotation');


        dataTableClass.dataTablePurchaseRequest();
        dataTableClass.dataTablePurchaseRequestProduct();
        dataTableClass.dataTablePurchaseQuotation();
        dataTableClass.dataTablePurchaseOrderProductRequest();

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
        // Purchase request modal
        $('#btn-purchase-request-modal').on('click', function () {
            loadDataClass.loadModalPurchaseRequest(tablePurchaseRequest, tablePurchaseRequestProduct);
        });

        // Checkbox merge product
        $('#merge-same-product').on('click', function() {
            loadDataClass.loadMergeProductTable($(this), tablePurchaseRequestProductMerge, tablePurchaseRequestProduct);
        });

        // Checkbox all
        $('#table-purchase-reqeust-checkbox-all').on('click', function() {
            clickCheckBoxAll($(this), tablePurchaseRequest);
        });

        // Btn add purchase request
        $('#btn-confirm-add-purchase-request').on('click', function () {
            loadDataClass.loadDataShowPurchaseRequest(elePurchaseRequest, tablePurchaseRequest);
            loadDataClass.loadTableProductByPurchaseRequest();
        });

        // Btn remove purchase request
        elePurchaseRequest.on('click', '.custom-btn-remove', function() {
            loadDataClass.loadDataAfterClickRemove($(this), elePurchaseRequest, tablePurchaseRequest, "purchase_request");
        });

        // Purchase quotation modal
        $('#btn-purchase-quotation-modal').on('click', function () {
            loadDataClass.loadModalPurchaseQuotation(tablePurchaseQuotation);
        });

        // Btn add purchase quotation
        $('#btn-confirm-add-purchase-quotation').on('click', function () {
            loadDataClass.loadDataShowPurchaseQuotation(elePurchaseQuotation, tablePurchaseQuotation);
        });

        // Btn remove purchase quotation
        elePurchaseQuotation.on('click', '.custom-btn-remove', function() {
            loadDataClass.loadDataAfterClickRemove($(this), elePurchaseQuotation, tablePurchaseQuotation, "purchase_quotation");
        });

        // Action on click button collapse
        $('#info-collapse').click(function () {
            $(this).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            let submitFields = ['title']
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
