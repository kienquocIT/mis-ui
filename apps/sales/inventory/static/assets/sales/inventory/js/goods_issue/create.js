$(document).ready(function () {
    GISHandle.LoadPage();
    WFRTControl.setWFInitialData('goodsissue', 'POST')

    $('#frmCreate').submit(function (event) {
        event.preventDefault();
        let form = GISHandle.CombinesDataForIA($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})