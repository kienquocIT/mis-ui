$(document).ready(function () {
    new GoodsTransferHandle().load();

    $('#frm_goods_transfer_create').submit(function (event) {
        event.preventDefault();
        let form = new GoodsTransferHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})