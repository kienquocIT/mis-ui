$(document).ready(function () {
    $.fn.InitAutoGenerateCodeField({param_app_code: 'product', param_ele_code_id: 'product-code'})
    EquipmentLoanEventHandler.InitPageEven()
    EquipmentLoanHandler.LoadDetailEquipmentLoan('update')

    WFRTControl.setWFInitialData('equipmentloan')

    let form_validator = $('#form-detail-equipment-loan').validate({
        submitHandler: function (form) {
            let form_data = EquipmentLoanHandler.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})