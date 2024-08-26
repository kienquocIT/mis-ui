$(document).ready(function () {
    new BOMHandle().load();

    LoadDetailBOM('update');

    $('#form-detail-bom').submit(function (event) {
        event.preventDefault();
        let form = new BOMHandle().combinesDataForProductionBOM($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})