$(document).ready(function () {
    class FAWriteOffUpdate extends FAWriteOffCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset-writeoff')
        }
    }

    const instance = new FAWriteOffUpdate();
    instance.init(true)
    instance.fetchDetailData(instance.$formSubmit, false)
    instance.setUpFormSubmit(instance.$formSubmit)
})