$(document).ready(function () {
    WFRTControl.setWFInitialData('kmsincomingdocument');

    IncomingDocEventHandler.InitPageEvent();
    IncomingDocPageFunction.loadEditor();
    IncomingDocPageFunction.initDatePickers();
    IncomingDocPageFunction.LoadDocumentType();
    IncomingDocPageFunction.LoadContentGroup();
    IncomingDocPageFunction.LoadFolderType();

    new $x.cls.file($('#attachment')).init({
        name: 'attachment',
        enable_edit: true,
    });

    const $form = $('#frm_create_incoming_document');
    $form.validate({
        submitHandler: function (form) {
            const form_data = IncomingDocLoadDataHandle.combineData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    });
});
