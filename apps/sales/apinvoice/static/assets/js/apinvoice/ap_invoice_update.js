$(document).ready(function () {
    APInvoiceEventHandler.InitPageEven()
    APInvoiceHandler.LoadDetailAPInvoice('update')

    WFRTControl.setWFInitialData('apinvoice')

    let form_validator = $('#form-detail-ap-invoice').validate({
        submitHandler: function (form) {
            let form_data = APInvoiceHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})