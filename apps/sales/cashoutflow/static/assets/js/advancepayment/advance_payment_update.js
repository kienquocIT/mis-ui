$(document).ready(function () {
    APHandle.LoadPage()
    WFRTControl.setWFInitialData('advancepayment', 'PUT')
    APHandle.LoadDetailAP('update');

    // SUBMIT FORM UPDATE ADVANCE PAYMENT
    let form_validator = $('#form-detail-advance').validate({
        submitHandler: function (form) {
            let form_data = APHandle.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [
        {
            key: 'supplier_id',
            condition: (value, element) => {
                let conditions = [APTypeEle.val() === '1', value]
                return conditions.every(c => c)
            },

        },
    ])
})