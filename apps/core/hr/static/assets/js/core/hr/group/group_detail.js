$(function () {
    $(document).ready(function () {
        let frm = $('#frm_group_create');

        $.fn.callAjax2({
            url: frm.attr('data-url'),
            method: 'GET',
            isLoading: true,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let groupData = data?.['group'];
                    if (groupData) {
                        $x.fn.renderCodeBreadcrumb(groupData);
                        GroupLoadDataHandle.loadDetail(groupData);
                    }
                }
            }
        )

    });
});