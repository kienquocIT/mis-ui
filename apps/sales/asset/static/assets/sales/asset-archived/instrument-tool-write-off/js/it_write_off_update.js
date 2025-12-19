$(document).ready(function () {
    class ITWriteOffUpdate extends ITWriteOffCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-instrument-tool-writeoff')
        }
    }

    const instance = new ITWriteOffUpdate();
    instance.init(true)
    instance.fetchDetailData(instance.$formSubmit, false)
    instance.setUpFormSubmit(instance.$formSubmit)
})