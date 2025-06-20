$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});
    WFRTControl.setWFInitialData('kmsincomingdocument');

    IncomingDocLoadDataHandle.initPage();
    const remark = new loadEditor();
    remark.init();

     $('#frm_create_incoming_document').validate({
        submitHandler: function (form) {
            let form_data = IncomingDocLoadDataHandle.combineData(form, 'create');
            debugger
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
});