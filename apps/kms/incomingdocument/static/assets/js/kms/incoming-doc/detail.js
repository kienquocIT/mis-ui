function fillFormFields(data, $form) {
    $('#txt_create_title').val(data.title);
    $('#textarea_remark').val(data.remark.replace(/<[^>]*>?/gm, ''));
    $('#sender').val(data.attached_list?.[0]?.sender || '');
    $('#id_document_type').val(data.attached_list?.[0]?.document_type?.title || '');
    $('#id_content_group').val(data.attached_list?.[0]?.content_group?.title || '');

    const isoEffectiveDay = data.attached_list?.[0]?.effective_date || '';
    const formattedEffectiveDay = isoEffectiveDay ? moment(isoEffectiveDay).format('DD/MM/YYYY') : '';
    $('#kms_effective_date').val(formattedEffectiveDay);

    const isoExpiredDay = data.attached_list?.[0]?.expired_date || '';
    const formattedExpiredDay = isoExpiredDay ? moment(isoExpiredDay).format('DD/MM/YYYY') : '';
    $('#kms_expired_date').val(formattedExpiredDay);

    $('#id_security_level').val(data.attached_list?.[0]?.security_level || '');
}

function renderAttachments(data) {
    const attachments = data.attached_list?.[0]?.attachment || [];
    const $tbody = $('#table_attached_info tbody');
    $tbody.empty();
    attachments.forEach((file, index) => {
        const rowHtml = `
            <tr>
                <td>${index + 1}</td>
                <td>${file.file_name}</td>
            </tr>`;
        $tbody.append(rowHtml);
    });
    // $('#table_internal_recipient').DataTable().rows.add(data.internal_recipient).draw();
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
            renderAttachments(data);
            setFormReadonly($form);
        },
        (err) => $.fn.notifyB({ description: err.data.errors }, 'failure')
    );
});