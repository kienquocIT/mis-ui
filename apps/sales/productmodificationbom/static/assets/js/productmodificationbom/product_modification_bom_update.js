$(document).ready(function () {
    $.fn.InitAutoGenerateCodeField({param_app_code: 'product', param_ele_code_id: 'product-code'})
    ProductModificationBOMEventHandler.InitPageEven()
    ProductModificationBOMHandler.LoadDetailProductModificationBOM('update')

    WFRTControl.setWFInitialData('productmodificationbom')

    let form_validator = $('#form-detail-product-modification-bom').validate({
        submitHandler: function (form) {
            let form_data = ProductModificationBOMHandler.CombinesData(form, 'update');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
})