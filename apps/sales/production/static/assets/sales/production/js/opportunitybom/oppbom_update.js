$(document).ready(function () {
    OpportunityBOMHandle.LoadPage('update');
    WFRTControl.setWFInitialData('bom', 'PUT')

    OpportunityBOMHandle.LoadDetailBOM('update');

    $('#form-detail-prj-bom').submit(function (event) {
        event.preventDefault();
        let form = OpportunityBOMHandle.CombinesBOMData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})