$(document).ready(function () {
    PaymentHandle.LoadPage('update')
    PaymentHandle.LoadDetailPayment('update');
    WFRTControl.setWFInitialData('payment', 'PUT')

    let form_validator = $('#form-detail-payment').validate({
        submitHandler: function (form) {
            let form_data = PaymentHandle.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
})