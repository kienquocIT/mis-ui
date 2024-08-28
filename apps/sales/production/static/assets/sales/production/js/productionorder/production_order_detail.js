$(function () {

    $(document).ready(function () {
        let $form = $('#frm_production_order');

        // call ajax get data detail
        $.fn.callAjax2({
            url: $form.data('url'),
            method: 'GET',
            isLoading: true,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data);
                    $.fn.compareStatusShowPageAction(data);
                    // store && load data detail
                    ProdOrderLoadDataHandle.loadDetail(data);
                    // init workflow
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                    // get WF initial zones for change
                }
            }
        )
    });
});
