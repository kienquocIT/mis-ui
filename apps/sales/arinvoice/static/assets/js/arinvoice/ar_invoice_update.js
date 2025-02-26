$(document).ready(function () {
    ARInvoiceHandle.Load();

    ARInvoiceHandle.LoadDetailARInvoice('update');

    let form_validator = $('#form-detail-ar-invoice').validate({
        submitHandler: function (form) {
            let form_data = ARInvoiceHandle.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})