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


// Action on click
        $('#btn-purchase-request-modal').on('click', function () {
            loadDataClass.loadModalPurchaseRequest(tablePurchaseRequest, tablePurchaseRequestProduct);
        });

        $('#merge-same-product').on('click', function() {
            loadDataClass.loadMergeProduct($(this), tablePurchaseRequestProductMerge, tablePurchaseRequestProduct);
        });

        $('#btn-confirm-add-purchase-request').on('click', function () {
            loadDataClass.loadDataShowPurchaseRequest(elePurchaseRequest, tablePurchaseRequest);
        });

        $('#btn-purchase-quotation-modal').on('click', function () {
            loadDataClass.loadModalPurchaseQuotation(tablePurchaseQuotation);
        });

        $('#btn-confirm-add-purchase-quotation').on('click', function () {
            loadDataClass.loadDataShowPurchaseQuotation(elePurchaseQuotation, tablePurchaseQuotation);
        });

// Submit form
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
