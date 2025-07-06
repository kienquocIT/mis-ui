$(document).ready(function () {
    EquipmentReturnEventHandler.InitPageEven()
    EquipmentReturnHandler.LoadDetailEquipmentReturn('update')

    WFRTControl.setWFInitialData('equipmentreturn')

    let form_validator = $('#form-detail-equipment-return').validate({
        submitHandler: function (form) {
            let form_data = EquipmentReturnHandler.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})