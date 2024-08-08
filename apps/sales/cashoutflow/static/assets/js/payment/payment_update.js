$(document).ready(function () {
    new PaymentHandle().load()
    LoadDetailPayment('update');
    WFRTControl.setWFInitialData('payment', 'PUT')

    let pk = $.fn.getPkDetail();
    $('#form-detail-payment').submit(function (event) {
        event.preventDefault();
        let form = new PaymentHandle().combinesData($(this), true);
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})