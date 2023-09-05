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

        tablePOProduct.on('click', '.table-row-checkbox', function() {
            let dataRow = JSON.parse($(this).attr('data-row'));
            tablePR.DataTable().clear().draw();
            tablePR.DataTable().rows.add(dataRow?.['purchase_request_products_data']).draw();
            $('#scroll-table-pr')[0].removeAttribute('hidden');
        })

    });
});
