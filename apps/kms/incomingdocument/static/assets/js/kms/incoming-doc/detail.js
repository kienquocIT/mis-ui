function fillFormFields(data, $form) {
    // load data in attached list
    const isoEffectiveDay = data.attached_list?.[0]?.effective_date || '';
    const formattedEffectiveDay = isoEffectiveDay ? moment(isoEffectiveDay).format('DD/MM/YYYY') : '';
    const isoExpiredDay = data.attached_list?.[0]?.expired_date || '';
    const formattedExpiredDay = isoExpiredDay ? moment(isoExpiredDay).format('DD/MM/YYYY') : '';
    const attachments = data.attached_list?.[0]?.attachment || [];

    // Populate form fields with the extracted data
    pageElements.$titleEle.val(data.title);
    pageElements.$descriptionEle.val(data.remark.replace(/<[^>]*>?/gm, ''));
    pageElements.$senderEle.val(data.attached_list?.[0]?.sender || '');
    pageElements.$docTypeEle.val(data.attached_list?.[0]?.document_type?.title || '');
    pageElements.$contentGroupEle.val(data.attached_list?.[0]?.content_group?.title || '');
    pageElements.$effectiveDateEle.val(formattedEffectiveDay);
    pageElements.$expiredDateEle.val(formattedExpiredDay);
    pageElements.$securityLevelEle.val(data.attached_list?.[0]?.security_level || '');
    IncomingDocLoadDataHandle.loadAttachment(attachments, 'detail');
}

function setFormReadonly($form) {
    $form.find('input, textarea').attr('readonly', true);
    $form.find('select, input[type=checkbox], input[type=radio], input[type=text]').attr('disabled', true);
    if (typeof tinymce !== 'undefined') {
        tinymce.editors.forEach(function (editor) {
            editor.setMode('readonly');
        });
    }
}

$(document).ready(function () {
    const $form = $('#frm_incoming_document');

    // init remark
    const remark = new loadEditor();
    remark.init();

    $.fn.callAjax2({
        'url': $form.attr('data-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            const data = $.fn.switcherResp(resp);
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);

            fillFormFields(data, $form);
            setFormReadonly($form);
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    );
});