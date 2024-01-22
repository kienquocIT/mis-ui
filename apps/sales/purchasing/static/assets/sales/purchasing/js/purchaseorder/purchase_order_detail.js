$(function () {

    $(document).ready(function () {
        let $form = $('#frm_purchase_order_create');

        PODataTableHandle.dataTablePurchaseRequestProduct();
        PODataTableHandle.dataTablePurchaseRequestProductMerge();
        PODataTableHandle.dataTablePurchaseQuotation();
        PODataTableHandle.dataTablePurchaseOrderProductAdd();
        PODataTableHandle.dataTablePurchaseOrderProductRequest();
        PODataTableHandle.dataTablePaymentStage();

        // call ajax get info quotation detail
        $.fn.callAjax2({
                'url': $form.data('url'),
                'method': 'GET',
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data);
                    $.fn.compareStatusShowPageAction(data);
                    POLoadDataHandle.loadDetailPage(data);

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            }
        )





    });
});
