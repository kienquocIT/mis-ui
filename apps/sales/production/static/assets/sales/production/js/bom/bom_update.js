$(document).ready(function () {
    BOMHandle.LoadPage();
    WFRTControl.setWFInitialData('bom', 'PUT')

    BOMHandle.LoadDetailBOM('update');

    $('#form-detail-bom').submit(function (event) {
        event.preventDefault();
        let form = BOMHandle.CombinesBOMData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})