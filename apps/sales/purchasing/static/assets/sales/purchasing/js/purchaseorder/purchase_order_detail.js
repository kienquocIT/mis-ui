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
                    // attachment
                    let enable_edit = true;
                    if (POLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                        enable_edit = false;
                    }
                    new $x.cls.file($('#attachment')).init({
                        name: 'attachment',
                        enable_edit: enable_edit,
                        enable_download: true,
                        data: data?.['attachment'],
                    });
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            }
        )





    });
});
