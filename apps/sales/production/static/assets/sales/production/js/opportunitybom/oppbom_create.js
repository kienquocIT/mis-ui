$(document).ready(function () {
    WFRTControl.setWFInitialData('bom')

    $('#form-create-prj-bom').submit(function (event) {
        event.preventDefault();
        let form = OpportunityBOMHandle.CombinesBOMData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})
