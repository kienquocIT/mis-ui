$(document).ready(function () {
    class FAWriteOffCreate extends FAWriteOffCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset-writeoff')
        }
    }

    const instance = new FAWriteOffCreate();
    instance.init()
    instance.setUpFormSubmit(instance.$formSubmit)
})