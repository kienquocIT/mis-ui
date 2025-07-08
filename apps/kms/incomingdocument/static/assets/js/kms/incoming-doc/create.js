$(document).ready(function () {
    WFRTControl.setWFInitialData('kmsincomingdocument');
    IncomingDocLoadDataHandle.initPage();
    IncomingDocLoadDataHandle.initInternalRecipientTable();
    IncomingDocPageFunction.loadEditor();
    new $x.cls.file($('#attachment')).init({
        name: 'attachment',
        enable_edit: true,
    });

    $('#frm_create_incoming_document').validate({
        submitHandler: function (form) {
            let form_data = IncomingDocLoadDataHandle.combineData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
});