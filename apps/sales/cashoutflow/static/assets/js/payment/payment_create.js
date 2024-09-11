$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    PaymentHandle.LoadPage()
    WFRTControl.setWFInitialData('payment', 'POST')

    $('#form-create-payment').submit(function (event) {
        event.preventDefault();
        let form = PaymentHandle.CombinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
});