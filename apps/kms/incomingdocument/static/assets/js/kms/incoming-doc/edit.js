$(document).ready(function () {
    IncomingDocEventHandler.InitPageEvent();
    IncomingDocPageFunction.loadEditor();
    IncomingDocPageFunction.loadDetailIncomingDoc('update');

    const $form = $('#frm_detail_incoming_document');
    $form.validate({
        submitHandler: function (form) {
            const form_data = IncomingDocLoadDataHandle.combineData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    });
});