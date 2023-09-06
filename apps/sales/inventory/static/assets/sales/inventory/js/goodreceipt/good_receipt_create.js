$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_good_receipt_create');
        // Elements
        let btnEdit = $('#btn-edit-product-good-receipt');
        let tablePOProduct = $('#datable-good-receipt-po-product');
        let tablePR = $('#datable-good-receipt-purchase-request');
        // Load init
        if (formSubmit.attr('data-method') === 'POST') {
            GRLoadDataHandle.loadBoxSupplier();
            GRLoadDataHandle.loadBoxPO();
            GRDataTableHandle.dataTableGoodReceiptProduct();
            GRDataTableHandle.dataTableGoodReceiptPOProduct();
            GRDataTableHandle.dataTableGoodReceiptPR();
            GRDataTableHandle.dataTableGoodReceiptWH();
            // PODataTableHandle.dataTablePurchaseRequestProduct();
            // PODataTableHandle.dataTablePurchaseRequestProductMerge();
            // PODataTableHandle.dataTablePurchaseQuotation();
            // PODataTableHandle.dataTablePurchaseOrderProductAdd();
            // PODataTableHandle.dataTablePurchaseOrderProductRequest();
        }


        // Action on change dropdown supplier
        GRLoadDataHandle.supplierSelectEle.on('change', function () {
            GRLoadDataHandle.loadMoreInformation($(this));
        });

        // Action on change dropdown PO
        GRLoadDataHandle.POSelectEle.on('change', function () {
            GRLoadDataHandle.loadMoreInformation($(this));
            btnEdit.click();
        });

        btnEdit.on('click', function() {
            GRLoadDataHandle.loadModalProduct();
        });

        tablePOProduct.on('click', '.table-row-checkbox', function () {
            let dataRow = JSON.parse($(this).attr('data-row'));
            let is_checked = false;
            if (this.checked === true) {
                is_checked = true;
            }
            for (let eleCheck of tablePOProduct[0].querySelectorAll('.table-row-checkbox')) {
                eleCheck.checked = false;
                if (is_checked === true) {
                    this.checked = true;
                }
            }
            tablePR.DataTable().clear().draw();
            if (is_checked === true) {
                if (dataRow?.['purchase_request_products_data'].length > 0) {
                    tablePR.DataTable().rows.add(dataRow?.['purchase_request_products_data']).draw();
                    $('#scroll-table-pr')[0].removeAttribute('hidden');
                } else {

                }
            }
        });

    });
});
