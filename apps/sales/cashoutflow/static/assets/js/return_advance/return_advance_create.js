$(document).ready(function () {
    ReturnAPHandle.LoadPage()
    WFRTControl.setWFInitialData('returnadvance', 'POST')

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    $('#frmCreate').submit(function (event) {
        event.preventDefault();
        let form = ReturnAPHandle.CombinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})