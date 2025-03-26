$(document).ready(function () {
    CIFEventHandler.InitPageEven()
    CIFPageFunction.LoadCustomer()
    CIFPageFunction.LoadDate(pageElements.$posting_date)
    CIFPageFunction.LoadDate(pageElements.$document_date)
    CIFPageFunction.LoadCompanyBankAccount()
    CIFPageFunction.LoadCustomerAdvanceTable()
    CIFPageFunction.LoadARInvoiceTable()
    WFRTControl.setWFInitialData('cashinflow')

    // SUBMIT FORM CREATE
    let form_validator = $('#form-create-cashinflow').validate({
        submitHandler: function (form) {
            let form_data = CIFHandler.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
});
