$(document).ready(function () {
    WFRTControl.setWFInitialData('kmsincomingdocument');
    IncomingDocLoadDataHandle.initPage();
    IncomingDocLoadDataHandle.initInternalRecipientTable();
    IncomingDocLoadDataHandle.loadAttachment(null,"create");
    const remark = new loadEditor();
    remark.init();

     $('#frm_create_incoming_document').validate({
        submitHandler: function (form) {
            let form_data = IncomingDocLoadDataHandle.combineData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
});