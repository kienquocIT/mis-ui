$(document).ready(function () {
    class ITWriteOffDetail extends ITWriteOffCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-instrument-tool-writeoff')
        }
    }

    const instance = new ITWriteOffDetail();
    instance.fetchDetailData(instance.$formSubmit, true)
})