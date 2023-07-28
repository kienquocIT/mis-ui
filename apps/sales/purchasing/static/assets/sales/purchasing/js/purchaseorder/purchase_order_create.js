$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_purchase_order_create');
        let loadDataClass = new loadDataHandle();
        let dataTableClass = new dataTableHandle();
        // Elements
        let elePurchaseRequest = $('#purchase-order-purchase-request');
        // Tables
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
                let data = [];
                let dataJson = {};
                $('#sroll-datable-purchase-request-product')[0].setAttribute('hidden', 'true');
                $('#sroll-datable-purchase-request-product-merge')[0].removeAttribute('hidden');
                tablePurchaseRequestProductMerge.DataTable().destroy();
                if (!tablePurchaseRequestProduct[0].querySelector('.dataTables_empty')) {
            for (let i = 0; i < tablePurchaseRequestProduct[0].tBodies[0].rows.length; i++) {
                let row = tablePurchaseRequestProduct[0].tBodies[0].rows[i];
                if (row.querySelector('.table-row-checkbox').checked === true) {
                    if (!dataJson.hasOwnProperty(row.querySelector('.table-row-checkbox').id)) {
                        dataJson[row.querySelector('.table-row-checkbox').id] = {
                            'id': row.querySelector('.table-row-checkbox').id,
                            'title': row.querySelector('.table-row-title').innerHTML,
                            'code_list': [row.querySelector('.table-row-code').innerHTML],
                            'uom': row.querySelector('.table-row-uom').innerHTML,
                            'quantity': parseFloat(row.querySelector('.table-row-quantity').innerHTML),
                            'remain': parseFloat(row.querySelector('.table-row-remain').innerHTML),
                            'quantity_purchase': parseFloat(row.querySelector('.table-row-quantity-purchase').innerHTML),
                        }
                    } else {
                        dataJson[row.querySelector('.table-row-checkbox').id].code_list.push(row.querySelector('.table-row-code').innerHTML);
                        dataJson[row.querySelector('.table-row-checkbox').id].quantity += parseFloat(row.querySelector('.table-row-quantity').innerHTML);
                        dataJson[row.querySelector('.table-row-checkbox').id].quantity_purchase += parseFloat(row.querySelector('.table-row-quantity-purchase').innerHTML);
                    }
                }
            }
            for (let key in dataJson) {
                data.push(dataJson[key]);
            }
        }
                dataTableClass.dataTablePurchaseRequestProductMerge(data);
            } else {
                $('#sroll-datable-purchase-request-product-merge')[0].setAttribute('hidden', 'true');
                $('#sroll-datable-purchase-request-product')[0].removeAttribute('hidden');
            }
        });

        $('#btn-confirm-add-purchase-request').on('click', function () {
            loadDataClass.loadDataShowPurchaseRequest(elePurchaseRequest, tablePurchaseRequest);
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
