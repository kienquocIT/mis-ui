$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    APHandle.LoadPage();
    WFRTControl.setWFInitialData('advancepayment', 'POST')

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    let form_validator = $('#form-create-advance').validate({
        submitHandler: function (form) {
            let form_data = APHandle.CombinesData(form, 'create');
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

        }, {
            key: 'employee_inherit_id',
            condition: (value, element) => {
                let conditions = [APTypeEle.val() === '0', value]
                return conditions.every(c => c)
            },
        },
    ])
});
