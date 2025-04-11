$(document).ready(function () {
    COFEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadSupplierTable({
        element: pageElements.$table_select_supplier,
    })
    UsualLoadPageFunction.LoadCustomerTable({
        element: pageElements.$table_select_customer,
    })
    UsualLoadPageFunction.LoadEmployeeTable({
        element: pageElements.$table_select_employee,
    })
    UsualLoadPageFunction.LoadDate({
        element: pageElements.$posting_date
    })
    UsualLoadPageFunction.LoadDate({
        element: pageElements.$document_date
    })
    COFPageFunction.LoadAdvanceToSupplierTable()
    COFPageFunction.LoadAPInvoiceTable()
    COFPageFunction.LoadCompanyBankAccount()
    WFRTControl.setWFInitialData('cashoutflow')
    COFHandler.LoadDetailCOF('update')

    // SUBMIT FORM UPDATE
    let form_validator = $('#form-detail-cashoutflow').validate({
        submitHandler: function (form) {
            let form_data = COFHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
})