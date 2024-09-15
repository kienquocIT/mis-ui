$(function () {

    $(document).ready(function () {
        let $form = $('#frm_production_report');

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
                    // store && load data detail
                    ProdReportLoadDataHandle.loadDetail(data);
                }
            }
        )
    });
});
