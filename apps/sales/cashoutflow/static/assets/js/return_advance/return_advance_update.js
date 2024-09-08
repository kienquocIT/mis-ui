$(document).ready(function () {
    ReturnAPHandle.LoadPage()
    WFRTControl.setWFInitialData('returnpayment', 'PUT')
    ReturnAPHandle.LoadDetail('update');

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    $('#frmDetail').submit(function (event) {
        event.preventDefault();
        let form = ReturnAPHandle.CombinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})