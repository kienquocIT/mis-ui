$(document).ready(function () {
    class DetailHandler extends CommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset')
        }

    }
    WFRTControl.setWFInitialData('fixedasset');
    const instance = new DetailHandler()
    instance.fetchDetailData(true)
})