$(function () {

    $(document).ready(function () {
        let $form = $('#frm_recurrence_create');

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
                    // load data detail
                    RecurrenceLoadDataHandle.loadDetail(data);
                }
            }
        )
    });
});