$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_purchase_order_create');
        let dataTableClass = new dataTableHandle();
        let tablePurchaseRequest = $('#datable-purchase-request');
        let tablePurchaseRequestProduct = $('#datable-purchase-request-product');
        let tablePurchaseRequestProductMerge = $('#datable-purchase-request-product-merge');


// Action on click
        $('#btn-purchase-request-modal').on('click', function() {
            // load dataTablePurchaseRequest
            tablePurchaseRequest.DataTable().destroy();
            dataTableClass.dataTablePurchaseRequest();
            // load dataTablePurchaseRequestProduct
            tablePurchaseRequestProduct.DataTable().destroy();
            dataTableClass.dataTablePurchaseRequestProduct();
        });

        $('#merge-same-product').on('click', function() {
            if ($(this)[0].checked === true) {
                $('#sroll-datable-purchase-request-product')[0].setAttribute('hidden', 'true');
                $('#sroll-datable-purchase-request-product-merge')[0].removeAttribute('hidden');
                tablePurchaseRequestProductMerge.DataTable().destroy();
                dataTableClass.dataTablePurchaseRequestProductMerge();
            } else {
                $('#sroll-datable-purchase-request-product-merge')[0].setAttribute('hidden', 'true');
                $('#sroll-datable-purchase-request-product')[0].removeAttribute('hidden');
            }
        });

        $('#btn-confirm-add-purchase-request').on('click', function() {
           $('#purchase-order-purchase-request').empty();
           let eleAppend = `<div class="div-checkbox">
                                <div class="form-check form-check-sm ml-1">
                                    <input type="checkbox" class="form-check-input" id="customChecks1">
                                    <label class="form-check-label" for="customChecks1">PR0001</label>
                                </div>
                            </div>`;
           $('#purchase-order-purchase-request').append(eleAppend)
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
