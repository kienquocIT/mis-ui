$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    GISHandle.LoadPage();
    WFRTControl.setWFInitialData('goodsissue', 'POST')

    $('#frmCreate').submit(function (event) {
        event.preventDefault();
        let form = GISHandle.CombinesDataGoodsIssue($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})