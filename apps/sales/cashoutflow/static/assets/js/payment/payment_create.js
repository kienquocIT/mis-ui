$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    PaymentHandle.LoadPage()
    WFRTControl.setWFInitialData('payment', 'POST')

    let form_validator = $('#form-create-payment').validate({
        submitHandler: function (form) {
            let form_data = PaymentHandle.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
});