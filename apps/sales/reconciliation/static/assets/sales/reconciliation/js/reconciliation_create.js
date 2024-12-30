$(document).ready(function () {
    ReconHandle.LoadPage();
    WFRTControl.setWFInitialData('reconciliation', 'POST')

    // SUBMIT FORM CREATE
    let form_validator = $('#form-create-recon').validate({
        submitHandler: function (form) {
            let form_data = ReconHandle.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
});
