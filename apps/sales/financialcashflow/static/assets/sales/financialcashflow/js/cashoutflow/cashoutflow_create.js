$(document).ready(function () {
    COFEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadSupplierTable({
        element: pageElements.$table_select_supplier,
    })
    UsualLoadPageFunction.LoadCustomerTable({
        element: pageElements.$table_select_customer,
    })
    UsualLoadPageFunction.LoadDate({
        element: pageElements.$posting_date
    })
    UsualLoadPageFunction.LoadDate({
        element: pageElements.$document_date
    })
    COFPageFunction.LoadAdvanceToSupplierTable()
    COFPageFunction.LoadAPInvoiceTable()
    COFPageFunction.LoadPaymentOnAccountTable()
    COFPageFunction.LoadSaleOrder()
    COFPageFunction.LoadLeaseOrder()
    COFPageFunction.LoadServiceOrder()
    COFPageFunction.LoadOrderCostTable()
    WFRTControl.setWFInitialData('cashoutflow')

    // SUBMIT FORM CREATE
    let form_validator = $('#form-create-cashoutflow').validate({
        submitHandler: function (form) {
            let form_data = COFHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
});
