$(document).ready(function () {
    PaymentEventHandler.InitPageEven()
    PaymentPageFunction.LoadQuotation()
    PaymentPageFunction.LoadSaleOrder()
    PaymentPageFunction.LoadSupplier()
    PaymentPageFunction.LoadEmployee()
    PaymentPageFunction.DrawLineDetailTable()
    PaymentPageFunction.DrawTablePlan()
    PaymentHandler.LoadDetailPayment('update');
    WFRTControl.setWFInitialData('payment')

    let form_validator = $('#form-detail-payment').validate({
        submitHandler: function (form) {
            let form_data = PaymentHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
})