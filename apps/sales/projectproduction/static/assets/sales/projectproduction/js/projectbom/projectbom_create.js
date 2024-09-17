$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search)

    let opp_mapped = urlParams.get('opp_mapped') ? JSON.parse(decodeURIComponent(urlParams.get('opp_mapped'))) : null
    let sale_person_mapped = urlParams.get('sale_person_mapped') ? JSON.parse(decodeURIComponent(urlParams.get('sale_person_mapped'))) : null

    if (opp_mapped) {
        ProjectBOMLoadPage.LoadOpportunity(opp_mapped_select, opp_mapped)
        ProjectBOMLoadPage.LoadInherit(employeeInheritEle, sale_person_mapped)
    }

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
