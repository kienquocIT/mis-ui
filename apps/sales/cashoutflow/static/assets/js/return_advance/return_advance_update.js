$(document).ready(function () {
    ReturnAPHandle.LoadPage()
    WFRTControl.setWFInitialData('returnpayment')
    ReturnAPHandle.LoadDetail('update');

    // SUBMIT FORM UPDATE RETURN ADVANCE
    let form_validator = $('#form-detail-return-ap').validate({
        submitHandler: function (form) {
            let form_data = ReturnAPHandle.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
})