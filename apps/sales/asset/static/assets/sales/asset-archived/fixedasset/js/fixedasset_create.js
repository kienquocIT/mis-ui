$(document).ready(function () {
    class CreateHandler extends CommonHandler{
        constructor() {
            super();
            this.$formSubmit = $('#form-fixed-asset')
        }

    }
    WFRTControl.setWFInitialData('fixedasset');
    const instance = new CreateHandler()
    instance.init()
    instance.setupFormSubmit(instance.$formSubmit)
})