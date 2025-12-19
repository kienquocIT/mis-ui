$(document).ready(function () {
    class DetailHandler extends ToolCommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-instrument-tool')
        }

    }
    WFRTControl.setWFInitialData('instrumenttool');
    const instance = new DetailHandler()
    instance.fetchDetailData(true)
})