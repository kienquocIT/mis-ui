$(function () {

    $(document).ready(function () {
        let $form = $('#frm_purchase_order_create');

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
                    // file
                    new $x.cls.file($('#attachment')).init({
                        name: 'attachment',
                        enable_edit: true,
                        enable_download: true,
                        data: data?.['attachment'],
                    });
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            }
        )





    });
});
