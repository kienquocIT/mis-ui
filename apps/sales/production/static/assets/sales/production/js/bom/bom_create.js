$(document).ready(function () {
    BOMHandle.LoadPage();
    WFRTControl.setWFInitialData('bom', 'POST')

    $('#form-create-bom').submit(function (event) {
        event.preventDefault();
        let form = BOMHandle.CombinesBOMData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})
