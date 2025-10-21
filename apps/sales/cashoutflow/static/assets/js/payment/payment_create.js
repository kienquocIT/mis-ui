$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    // call load page
    PaymentEventHandler.InitPageEven()
    UsualLoadPageFunction.AutoLoadCurrentEmployee({element: pageElements.$employee_created})
    UsualLoadPageFunction.LoadDate({element: pageElements.$date_created, empty: false})
    const {opp_id} = $x.fn.getManyUrlParameters(['opp_id'])
    PaymentHandler.LoadPageActionWithParams(opp_id)

    PaymentPageFunction.LoadQuotation()
    PaymentPageFunction.LoadSaleOrder()
    PaymentPageFunction.LoadSupplier()
    PaymentPageFunction.LoadEmployee()
    PaymentPageFunction.LoadTableBankAccount()
    PaymentPageFunction.DrawLineDetailTable()
    PaymentPageFunction.DrawTablePlan()
    WFRTControl.setWFInitialData('payment')

    let form_validator = $('#form-create-payment').validate({
        submitHandler: function (form) {
            let form_data = PaymentHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
});