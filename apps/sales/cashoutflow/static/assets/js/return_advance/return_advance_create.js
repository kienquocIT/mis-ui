$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search)

    let advance_payment_json= urlParams.get('advance_payment')

    let advance_payment = advance_payment_json ? JSON.parse(decodeURIComponent(advance_payment_json)) : null

    ReturnAPHandle.LoadPage(advance_payment)
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