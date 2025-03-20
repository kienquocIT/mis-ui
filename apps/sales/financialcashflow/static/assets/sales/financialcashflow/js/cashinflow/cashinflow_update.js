$(document).ready(function () {
    CashInflowHandle.LoadPage();
    WFRTControl.setWFInitialData('cashinflow')
    CashInflowHandle.LoadDetailCIF('update');

    // SUBMIT FORM UPDATE
    let form_validator = $('#form-detail-cashinflow').validate({
        submitHandler: function (form) {
            let form_data = CashInflowHandle.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
})