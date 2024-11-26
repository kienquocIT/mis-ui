$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search)

    let opp_mapped = urlParams.get('opp_mapped') ? JSON.parse(decodeURIComponent(urlParams.get('opp_mapped'))) : null
    let sale_person_mapped = urlParams.get('sale_person_mapped') ? JSON.parse(decodeURIComponent(urlParams.get('sale_person_mapped'))) : null

    if (opp_mapped && sale_person_mapped) {
        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            data_inherit: [{
                "id": sale_person_mapped?.['id'],
                "full_name": sale_person_mapped?.['full_name'] || '',
                "first_name": sale_person_mapped?.['first_name'] || '',
                "last_name": sale_person_mapped?.['last_name'] || '',
                "email": sale_person_mapped?.['email'] || '',
                "is_active": sale_person_mapped?.['is_active'] || false,
                "selected": true,
            }],
            data_opp: [{
                "id": opp_mapped?.['id'] || '',
                "title": opp_mapped?.['title'] || '',
                "code": opp_mapped?.['code'] || '',
                "selected": true,
            }]

        }).init();
        OpportunityBOMLoadPage.LoadFinishGoodsAndServices(productEle)
    }

    OpportunityBOMHandle.LoadPage();
    WFRTControl.setWFInitialData('bom', 'POST')

    $('#form-create-prj-bom').submit(function (event) {
        event.preventDefault();
        let form = OpportunityBOMHandle.CombinesDataForProductionBOM($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})
