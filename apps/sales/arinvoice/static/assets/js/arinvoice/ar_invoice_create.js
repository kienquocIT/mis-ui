$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    ARInvoiceHandle.Load();
    WFRTControl.setWFInitialData('arinvoice')

    let form_validator = $('#form-create-ar-invoice').validate({
        submitHandler: function (form) {
            let form_data = ARInvoiceHandle.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
});
