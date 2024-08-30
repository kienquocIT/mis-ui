$(document).ready(function () {
    PaymentHandle.LoadPage()
    PaymentHandle.LoadDetailPayment('update');
    WFRTControl.setWFInitialData('payment', 'PUT')

    $('#form-detail-payment').submit(function (event) {
        event.preventDefault();
        let form = PaymentHandle.CombinesData($(this), true);
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})