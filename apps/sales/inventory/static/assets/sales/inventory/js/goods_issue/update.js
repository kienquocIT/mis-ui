$(document).ready(function () {
    GISHandle.LoadPage();
    GISHandle.LoadGoodsIssueDetail('update');
    WFRTControl.setWFInitialData('goodsissue')

    $('#frmDetail').submit(function (event) {
        event.preventDefault();
        let form = GISHandle.CombinesDataGoodsIssue($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})