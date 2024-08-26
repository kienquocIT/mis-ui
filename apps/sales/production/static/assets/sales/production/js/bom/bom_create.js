$(document).ready(function () {
    new BOMHandle().load();
    WFRTControl.setWFInitialData('bom', 'POST')

    $('#form-create-bom').submit(function (event) {
        event.preventDefault();
        let form = new BOMHandle().combinesDataForProductionBOM($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})