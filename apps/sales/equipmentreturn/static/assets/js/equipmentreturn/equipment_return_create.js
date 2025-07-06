$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    EquipmentReturnEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$document_date, auto_load: true, empty: false})

    WFRTControl.setWFInitialData('equipmentreturn')

    let form_validator = $('#form-create-equipment-return').validate({
        submitHandler: function (form) {
            let form_data = EquipmentReturnHandler.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
});
