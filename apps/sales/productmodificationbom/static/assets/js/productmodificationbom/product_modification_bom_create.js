$(document).ready(function () {
    $.fn.InitAutoGenerateCodeField({param_app_code: 'product', param_ele_code_id: 'product-code'})
    ProductModificationBOMEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$created_date, auto_load: true, empty: false})
    ProductModificationBOMPageFunction.LoadTableCurrentProductModified()
    ProductModificationBOMPageFunction.LoadTableProductCurrentComponentList()
    ProductModificationBOMPageFunction.LoadTableProductAddedComponentList()

    WFRTControl.setWFInitialData('productmodificationbom')

    let form_validator = $('#form-create-product-modification-bom').validate({
        submitHandler: function (form) {
            let form_data = ProductModificationBOMHandler.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
});
