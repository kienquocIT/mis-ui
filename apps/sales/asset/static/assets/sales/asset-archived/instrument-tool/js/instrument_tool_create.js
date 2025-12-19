$(document).ready(function () {
    class CreateHandler extends ToolCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-instrument-tool')
        }

    }
    WFRTControl.setWFInitialData('instrumenttool');
    const instance = new CreateHandler()
    instance.init()
    instance.setupFormSubmit(instance.$formSubmit)
})