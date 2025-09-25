$(document).ready(function () {
    ARInvoiceEventHandler.InitPageEven()
    ARInvoiceHandler.LoadDetailARInvoice('update')

    WFRTControl.setWFInitialData('arinvoice')

    let form_validator = $('#form-detail-ar-invoice').validate({
        submitHandler: function (form) {
            let form_data = ARInvoiceHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})