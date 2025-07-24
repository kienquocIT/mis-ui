$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search)
    let account_id = urlParams.get('account_id')
    let account_name = urlParams.get('account_name')
    let el_selected_id = urlParams.get('el_selected_id')

    pageElements.$account.val(account_name)
    pageElements.$account.attr('data-id', account_id)

    requestAnimationFrame(() => {
        $('#select-detail-modal').modal('show')
        EquipmentReturnPageFunction.LoadEquipmentLoanTableByAccount(account_id || null, el_selected_id || null)
        EquipmentReturnPageFunction.LoadEquipmentLoanItemsTable()
        EquipmentReturnPageFunction.LoadEquipmentLoanItemsNoneTable()
        EquipmentReturnPageFunction.LoadEquipmentLoanItemsLotTable()
        EquipmentReturnPageFunction.LoadEquipmentLoanItemsSerialTable()
    })

    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    EquipmentReturnEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$document_date, auto_load: true, empty: false})
    EquipmentReturnPageFunction.LoadLineDetailTable()

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
