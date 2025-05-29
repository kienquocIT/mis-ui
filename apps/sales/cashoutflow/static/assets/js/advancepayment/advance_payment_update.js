$(document).ready(function () {
    AdvancePaymentEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$return_date})
    UsualLoadPageFunction.LoadDate({element: pageElements.$advance_date})
    AdvancePaymentHandler.LoadDetailAP('update');
    WFRTControl.setWFInitialData('advancepayment')

    // SUBMIT FORM UPDATE ADVANCE PAYMENT
    let form_validator = $('#form-detail-advance').validate({
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
})