$(document).ready(function () {
    ProductModificationEventHandler.InitPageEven()
    ProductModificationHandler.LoadDetailProductModification('update')

    WFRTControl.setWFInitialData('productmodification')

    let form_validator = $('#form-detail-product-modification').validate({
        submitHandler: function (form) {
            let form_data = ProductModificationHandler.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})