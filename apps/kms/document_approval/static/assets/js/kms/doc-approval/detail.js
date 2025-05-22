$(document).ready(function(){
    // get detail data
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
            $('#table_attached_info').DataTable().rows.add(data.attached_list).draw()
            tinymce.activeEditor.setMode('readonly');
            tinymce.activeEditor.setContent(data.remark)
            $('#table_internal_recipient').DataTable().rows.add(data.internal_recipient).draw()
        }),
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
})
