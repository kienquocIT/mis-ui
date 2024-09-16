$(document).ready(function () {
    ProjectBOMHandle.LoadPage();
    WFRTControl.setWFInitialData('bom', 'POST')

    $('#form-create-prj-bom').submit(function (event) {
        event.preventDefault();
        let form = ProjectBOMHandle.CombinesDataForProductionBOM($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})
