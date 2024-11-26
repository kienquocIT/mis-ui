$(document).ready(function () {
    OpportunityBOMHandle.LoadPage();
    WFRTControl.setWFInitialData('bom', 'PUT')

    OpportunityBOMHandle.LoadDetailBOM('update');

    $('#form-detail-prj-bom').submit(function (event) {
        event.preventDefault();
        let form = OpportunityBOMHandle.CombinesDataForProductionBOM($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})