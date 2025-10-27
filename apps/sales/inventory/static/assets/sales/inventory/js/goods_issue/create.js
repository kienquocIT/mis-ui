$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    GISEventHandler.InitPageEven()
    GISPageFunction.DrawTableIAItems()
    WFRTControl.setWFInitialData('goodsissue')

    $('#frmCreate').submit(function (event) {
        event.preventDefault();
        let form = GISHandler.CombinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})