function fillFormFields(data, $form) {
    // load data in attached list
    const isoEffectiveDay = data.attached_list?.[0]?.effective_date || '';
    const formattedEffectiveDay = isoEffectiveDay ? moment(isoEffectiveDay).format('DD/MM/YYYY') : '';
    const isoExpiredDay = data.attached_list?.[0]?.expired_date || '';
    const formattedExpiredDay = isoExpiredDay ? moment(isoExpiredDay).format('DD/MM/YYYY') : '';
    const recipients = data.internal_recipient || [];

    // Populate form fields with the extracted data
    pageElements.$titleEle.val(data.title);
    pageElements.$descriptionEle.val(data.remark.replace(/<[^>]*>?/gm, ''));
    pageElements.$senderEle.val(data.attached_list?.[0]?.sender || '');
    pageElements.$docTypeEle.val(data.attached_list?.[0]?.document_type?.title || '');
    pageElements.$contentGroupEle.val(data.attached_list?.[0]?.content_group?.title || '');
    pageElements.$effectiveDateEle.val(formattedEffectiveDay);
    pageElements.$expiredDateEle.val(formattedExpiredDay);
    pageElements.$securityLevelEle.val(data.attached_list?.[0]?.security_level || '');
    IncomingDocLoadDataHandle.initInternalRecipientTable(recipients);
}

function setFormReadonly($form) {
    $form.find('input, textarea').attr('readonly', true);
    $form.find('table').css('pointer-events', 'none').addClass('readonly-table');
    $form.find('select, input[type=checkbox], input[type=radio], input[type=text]').attr('disabled', true);
    if (typeof tinymce !== 'undefined') {
        tinymce.editors.forEach(function (editor) {
            editor.setMode('readonly');
        });
    }
}

$(document).ready(function () {
    IncomingDocLoadDataHandle.initPage();
    const $form = $('#frm_incoming_document');
    $.fn.callAjax2({
        'url': $form.attr('data-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            const data = $.fn.switcherResp(resp);
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
            new $x.cls.file($('#attachment')).init({
                enable_edit: false,
                enable_download: true,
                data: data?.['attachment'],
            });
            fillFormFields(data, $form);
            setFormReadonly($form);
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    );
});