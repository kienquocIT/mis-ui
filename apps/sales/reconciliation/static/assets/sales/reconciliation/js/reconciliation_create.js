$(document).ready(function () {
    ReconEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadCustomer({element: pageElements.$customer})
    UsualLoadPageFunction.LoadSupplier({element: pageElements.$supplier})
    UsualLoadPageFunction.LoadDate({element: pageElements.$posting_date})
    UsualLoadPageFunction.LoadDate({element: pageElements.$document_date})

    ReconPageFunction.LoadTableRecon()

    WFRTControl.setWFInitialData('reconciliation')

    let form_validator = $('#form-create-recon').validate({
        submitHandler: function (form) {
            let form_data = ReconHandler.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
});
