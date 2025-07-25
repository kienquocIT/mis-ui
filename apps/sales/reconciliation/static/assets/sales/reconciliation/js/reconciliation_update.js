$(document).ready(function () {
    ReconEventHandler.InitPageEven()

    ReconHandler.LoadDetailRecon('detail');

    WFRTControl.setWFInitialData('reconciliation')

    let form_validator = $('#form-detail-recon').validate({
        submitHandler: function (form) {
            let form_data = ReconHandler.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})