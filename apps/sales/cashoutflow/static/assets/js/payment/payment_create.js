$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    // call load page
    PaymentHandle.LoadPage('create')
    WFRTControl.setWFInitialData('payment')

    let form_validator = $('#form-create-payment').validate({
        submitHandler: function (form) {
            let form_data = PaymentHandle.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
});