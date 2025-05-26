$(document).ready(function(){
    const $form = $('#frm_document_approval');
    $.fn.callAjax2({
        'url': $form.attr('data-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            $('#txt_title').val(data.title)
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
})