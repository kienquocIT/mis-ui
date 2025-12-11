$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    ARInvoiceEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$posting_date})
    UsualLoadPageFunction.LoadDate({element: pageElements.$document_date})
    UsualLoadPageFunction.LoadDate({element: pageElements.$invoice_date})
    ARInvoicePageFunction.LoadCompanyBankAccount()
    ARInvoicePageFunction.LoadMainTable()
    ARInvoicePageFunction.LoadPaymentTermViewTable()

    WFRTControl.setWFInitialData('arinvoice')

    let form_validator = $('#form-create-ar-invoice').validate({
        submitHandler: function (form) {
            let form_data = ARInvoiceHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
});
