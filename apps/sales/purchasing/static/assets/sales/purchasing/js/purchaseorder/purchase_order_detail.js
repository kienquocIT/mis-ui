$(function () {

    $(document).ready(function () {
        let $form = $('#frm_purchase_order_create');
        PODataTableHandle.dataTablePurchaseRequest();
        PODataTableHandle.dataTablePurchaseRequestProduct();
        PODataTableHandle.dataTablePurchaseRequestProductMerge();
        PODataTableHandle.dataTablePurchaseQuotation();
        PODataTableHandle.dataTablePurchaseOrderProductAdd();
        PODataTableHandle.dataTablePurchaseOrderProductRequest();

        // call ajax get info quotation detail
        $.fn.callAjax2({
                'url': $form.data('url'),
                'method': 'GET',
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.compareStatusShowPageAction(data);
                    POLoadDataHandle.loadDetailPage(data);
                }
            }
        )





    });
});
