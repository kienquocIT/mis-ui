$(document).ready(function () {
    PurchaseRequestEventHandler.InitPageEven()
    PurchaseRequestHandler.LoadDetailPR('update');

    WFRTControl.setWFInitialData('purchaserequest');

    let form_validator = $('#frm-detail-pr').validate({
        submitHandler: function (form) {
            let form_data = PurchaseRequestHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})