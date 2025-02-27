$(function () {

    $(document).ready(function () {
        // call ajax get info lease detail
        $.fn.callAjax2({
            url: RecoveryLoadDataHandle.$form.data('url'),
            method: 'GET',
            isLoading: true,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data);
                    $.fn.compareStatusShowPageAction(data);
                    RecoveryLoadDataHandle.loadDetailPage(data);

                    // init workflow
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                    // get WF initial zones for change
                    let appCode = 'goodsrecovery';
                    WFRTControl.setWFInitialData(appCode);

                }
            }
        )
        // mask money
        $.fn.initMaskMoney2();

    });
});
