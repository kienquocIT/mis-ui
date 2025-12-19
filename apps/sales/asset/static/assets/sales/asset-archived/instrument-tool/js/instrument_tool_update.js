$(document).ready(function () {
    class UpdateHandler extends ToolCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-instrument-tool')
        }
    }

    WFRTControl.setWFInitialData('instrumenttool');
    const instance = new UpdateHandler()
    instance.init(true)
    instance.setupFormSubmit(instance.$formSubmit)
    instance.fetchDetailData(false)
})