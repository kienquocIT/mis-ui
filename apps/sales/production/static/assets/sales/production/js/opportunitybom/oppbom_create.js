$(document).ready(function () {
    const {opp_id, opp_title, opp_code} = $x.fn.getManyUrlParameters(['opp_id', 'opp_title', 'opp_code'])
    let opportunity = opp_id ? {
        'id': opp_id,
        'title': opp_title,
        'code': opp_code
    } : null
    const urlParams = new URLSearchParams(window.location.search)
    let sale_person_mapped = urlParams.get('sale_person_mapped') ? JSON.parse(decodeURIComponent(urlParams.get('sale_person_mapped'))) : null

    if (opportunity && sale_person_mapped) {
        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            data_inherit: [sale_person_mapped],
            data_opp: [opportunity]
        }).init();
    }

    OpportunityBOMHandle.LoadPage();
    WFRTControl.setWFInitialData('bom', 'POST')

    $('#form-create-prj-bom').submit(function (event) {
        event.preventDefault();
        let form = OpportunityBOMHandle.CombinesBOMData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})
