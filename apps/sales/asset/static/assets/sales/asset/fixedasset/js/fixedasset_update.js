$(document).ready(function () {
    class UpdateHandler extends CommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset')
        }
    }

    WFRTControl.setWFInitialData('fixedasset');
    const instance = new UpdateHandler()
    instance.init(true)
    instance.setupFormSubmit(instance.$formSubmit)
    instance.fetchDetailData(false)
})