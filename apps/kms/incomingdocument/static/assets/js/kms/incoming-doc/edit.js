function loadSelectOptions($select) {
    const url = $select.data('url');
    const keyResp = $select.data('keyresp');

    return $.ajax({
        url: url,
        method: 'GET',
    }).then((resp) => {
        const data = $.fn.switcherResp ? $.fn.switcherResp(resp) : resp;
        const list = data[keyResp] || [];

        $select.empty();
        $select.append('<option></option>'); // for placeholder in select2

        list.forEach(item => {
            $select.append(`<option value="${item.id}">${item.title}</option>`);
        });

        // Re-init Select2 if needed
        if ($select.hasClass("select2-hidden-accessible")) {
            $select.select2('destroy');
        }

        $select.select2({
            allowClear: true,
            width: '100%'
        });

        return Promise.resolve();
    });
}

function fillFormFields(data, $form) {
    // Load data in attached list
    const documentTypeId = data.attached_list?.[0]?.document_type?.id;
    const contentGroupId = data.attached_list?.[0]?.content_group?.id;
    const isoEffectiveDay = data.attached_list?.[0]?.effective_date || '';
    const formattedEffectiveDay = isoEffectiveDay ? moment(isoEffectiveDay).format('DD/MM/YYYY') : '';
    const isoExpiredDay = data.attached_list?.[0]?.expired_date || '';
    const formattedExpiredDay = isoExpiredDay ? moment(isoExpiredDay).format('DD/MM/YYYY') : '';
    const levelLabel = data.attached_list?.[0]?.security_level || '';
    const matchedOption = pageElements.$securityLevelEle.find('option').filter(function () {
        return $(this).text().trim() === levelLabel.trim();
    }).first();
    const attachments = data.attached_list?.[0]?.attachment || [];
    const recipients = data.internal_recipient || [];

    // Populate form fields with the extracted data
    pageElements.$titleEle.val(data.title);
    pageElements.$descriptionEle.val(data.remark.replace(/<[^>]*>?/gm, ''));
    pageElements.$senderEle.val(data.attached_list?.[0]?.sender || '');
    loadSelectOptions(pageElements.$docTypeEle).then(() => {
        pageElements.$docTypeEle.val(documentTypeId).trigger('change');
    });
    loadSelectOptions(pageElements.$contentGroupEle).then(() => {
        pageElements.$contentGroupEle.val(contentGroupId).trigger('change');
    });
    pageElements.$effectiveDateEle.val(formattedEffectiveDay);
    pageElements.$expiredDateEle.val(formattedExpiredDay);
    if (matchedOption.length > 0) {
        pageElements.$securityLevelEle.val(matchedOption.val()).trigger('change');
    }
    // IncomingDocLoadDataHandle.loadAttachment(attachments, 'edit');
    IncomingDocLoadDataHandle.initInternalRecipientTable(recipients);
}

$(document).ready(function () {
    let $formSubmit = $('#frm_edit_incoming_document');

    // init page
    IncomingDocLoadDataHandle.initPage();

    // load available data in form
    $.fn.callAjax2({
        'url': $formSubmit.attr('data-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            const data = $.fn.switcherResp(resp);
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            fillFormFields(data, $formSubmit);

            new $x.cls.file($('#attachment')).init({
                name: 'attachment',
                enable_edit: true,
                enable_download: true,
                data: data?.['attachment'],
            });
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    );

    // submit updated data
    $formSubmit.validate({
        submitHandler: function (form) {
            let form_data = IncomingDocLoadDataHandle.combineData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
});