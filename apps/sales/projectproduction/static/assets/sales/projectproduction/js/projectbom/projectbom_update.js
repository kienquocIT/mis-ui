$(document).ready(function () {
    ProjectBOMHandle.LoadPage();
    WFRTControl.setWFInitialData('bom', 'PUT')

    ProjectBOMHandle.LoadDetailBOM('update');

    $('#form-detail-prj-bom').submit(function (event) {
        event.preventDefault();
        let form = ProjectBOMHandle.CombinesDataForProductionBOM($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})