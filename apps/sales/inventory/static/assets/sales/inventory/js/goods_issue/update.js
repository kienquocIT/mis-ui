$(document).ready(function () {
    GISEventHandler.InitPageEven()
    GISPageFunction.DrawTableIAItems()
    GISHandler.LoadDetailGIS('update')
    WFRTControl.setWFInitialData('goodsissue')

    $('#frmDetail').submit(function (event) {
        event.preventDefault();
        let form = GISHandler.CombinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})