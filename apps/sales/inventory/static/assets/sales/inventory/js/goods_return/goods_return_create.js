$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    new GoodsReturnHandle().load();

    $('#frm_goods_return_create').submit(function (event) {
        event.preventDefault();
        let form = new GoodsReturnHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})