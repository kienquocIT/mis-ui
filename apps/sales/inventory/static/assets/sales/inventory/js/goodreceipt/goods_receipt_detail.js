$(function () {

    $(document).ready(function () {
        let $form = $('#frm_good_receipt_create');

        GRDataTableHandle.dataTableGoodReceiptPOProduct();
        GRDataTableHandle.dataTableGoodReceiptPR();
        GRDataTableHandle.dataTableGoodReceiptWH();
        GRDataTableHandle.dataTableGoodReceiptWHLot();
        GRDataTableHandle.dataTableGoodReceiptWHSerial();
        GRDataTableHandle.dataTableGoodReceiptLineDetailPO();

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
                    $('#data-detail-page').val(JSON.stringify(data));
                    GRLoadDataHandle.loadDetailPage(data);

                    // WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            }
        )





    });
});
