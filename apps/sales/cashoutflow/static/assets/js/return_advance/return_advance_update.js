$(document).ready(function () {
    ReturnAPHandle.LoadPage()
    WFRTControl.setWFInitialData('returnpayment', 'PUT')
    ReturnAPHandle.LoadDetail('update');

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    $('#form-detail-return-ap').submit(function (event) {
        event.preventDefault();
        let form = ReturnAPHandle.CombinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})