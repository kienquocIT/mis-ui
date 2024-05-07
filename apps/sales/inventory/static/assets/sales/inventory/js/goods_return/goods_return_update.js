$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    new GoodsReturnHandle().load();
    LoadDetailGoodsReturn('update');
    $('#frm_goods_return_update').submit(function (event) {
        event.preventDefault();
        let form = new GoodsReturnHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})