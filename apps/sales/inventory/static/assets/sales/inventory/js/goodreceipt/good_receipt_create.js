$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_good_receipt_create');
        // Load init
        if (formSubmit.attr('data-method') === 'POST') {
            GRLoadDataHandle.loadBoxSupplier();
            GRLoadDataHandle.loadBoxPO();
            GRDataTableHandle.dataTableGoodReceiptProduct();
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
        });

    });
});
