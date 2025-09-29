$(document).ready(function () {
    PurchaseRequestEventHandler.InitPageEven()

    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    WFRTControl.setWFInitialData('purchaserequest');

    let form_validator = $('#form-create-pr').validate({
        submitHandler: function (form) {
            let form_data = PurchaseRequestHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)

    pageElements.$request_for.trigger('change')
})