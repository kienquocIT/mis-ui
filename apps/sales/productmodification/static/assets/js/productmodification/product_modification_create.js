$(document).ready(function () {
    ProductModificationEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: pageElements.$created_date, auto_load: true, empty: false})
    ProductModificationPageFunction.LoadTableCurrentProductModified()
    ProductModificationPageFunction.LoadTableProductCurrentComponentList()
    ProductModificationPageFunction.LoadTableProductRemovedComponentList()

    WFRTControl.setWFInitialData('productmodification')

    let form_validator = $('#form-create-product-modification').validate({
        submitHandler: function (form) {
            let form_data = ProductModificationHandler.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator)
});
