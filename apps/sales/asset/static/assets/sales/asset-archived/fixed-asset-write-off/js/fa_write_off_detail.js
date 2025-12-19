$(document).ready(function () {
    class FAWriteOffDetail extends FAWriteOffCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset-writeoff')
        }
    }

    const instance = new FAWriteOffDetail();
    instance.fetchDetailData(instance.$formSubmit, true)
})