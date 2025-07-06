$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    $.fn.InitAutoGenerateCodeField({param_app_code: 'product', param_ele_code_id: 'product-code'})
    EquipmentLoanEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$document_date, auto_load: true, empty: false})
    UsualLoadPageFunction.LoadDate({element: pageElements.$loan_date, empty: true})
    UsualLoadPageFunction.LoadDate({element: pageElements.$return_date, empty: true})
    EquipmentLoanPageFunction.LoadLineDetailTable()

    WFRTControl.setWFInitialData('equipmentloan')

    let form_validator = $('#form-create-equipment-loan').validate({
        submitHandler: function (form) {
            let form_data = EquipmentLoanHandler.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
});
