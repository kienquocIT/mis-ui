$(document).ready(function () {
    CashInflowHandle.LoadPage();
    WFRTControl.setWFInitialData('cashinflow', 'POST')

    // SUBMIT FORM CREATE
    let form_validator = $('#form-create-cashinflow').validate({
        submitHandler: function (form) {
            let form_data = CashInflowHandle.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
});
