$(document).ready(function () {
    new BOMHandle().load();

    $('#form-create-bom').submit(function (event) {
        event.preventDefault();
        let form = new BOMHandle().combinesDataForProductionBOM($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})