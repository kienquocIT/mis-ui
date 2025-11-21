$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    AdvancePaymentEventHandler.InitPageEven()
    UsualLoadPageFunction.AutoLoadCurrentEmployee({element: pageElements.$employee_created})
    UsualLoadPageFunction.LoadDate({element: pageElements.$date_created, empty: false})
    UsualLoadPageFunction.LoadDate({element: pageElements.$return_date})
    UsualLoadPageFunction.LoadDate({element: pageElements.$advance_date})
    const {opp_id} = $x.fn.getManyUrlParameters(['opp_id'])
    AdvancePaymentHandler.LoadPageActionWithParams(opp_id)

    AdvancePaymentPageFunction.LoadQuotation()
    AdvancePaymentPageFunction.LoadSaleOrder()
    AdvancePaymentPageFunction.LoadSupplier()
    AdvancePaymentPageFunction.LoadTableBankAccount()
    AdvancePaymentPageFunction.LoadLineDetailTable()
    AdvancePaymentPageFunction.DrawTablePlan()

    WFRTControl.setWFInitialData('advancepayment')

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    let form_validator = $('#form-create-advance').validate({
        submitHandler: function (form) {
            let form_data = AdvancePaymentHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [
        {
            key: 'supplier_id',
            condition: (value, element) => {
                let conditions = [pageElements.$advance_payment_type.val() === '1', value]
                return conditions.every(c => c)
            },
        },
    ])
});
