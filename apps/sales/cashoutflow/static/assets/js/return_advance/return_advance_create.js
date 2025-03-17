$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search)
    let advance_payment_json= urlParams.get('advance_payment')
    let advance_payment = advance_payment_json ? JSON.parse(decodeURIComponent(advance_payment_json)) : null

    ReturnAPHandle.LoadPage(advance_payment)
    WFRTControl.setWFInitialData('returnadvance')

    // SUBMIT FORM CREATE RETURN ADVANCE
    let form_validator = $('#form-create-return-ap').validate({
        submitHandler: function (form) {
            let form_data = ReturnAPHandle.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
})