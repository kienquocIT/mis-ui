$(document).ready(function () {
    GISHandle.LoadPage();
    GISHandle.LoadGoodsIssueDetail('update');
    WFRTControl.setWFInitialData('goodsissue', 'PUT')

    $('#frmDetail').submit(function (event) {
        event.preventDefault();
        let form = GISHandle.CombinesDataForIA($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})