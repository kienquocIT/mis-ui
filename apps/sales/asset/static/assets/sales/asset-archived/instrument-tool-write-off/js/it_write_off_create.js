$(document).ready(function () {
    class ITWriteOffCreate extends ITWriteOffCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-instrument-tool-writeoff')
        }
    }

    const instance = new ITWriteOffCreate();
    instance.init()
    instance.setUpFormSubmit(instance.$formSubmit)
})