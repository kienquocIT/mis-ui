$(document).ready(function () {
    new GoodsTransferHandle().load();
    LoadDetailGoodsTransfer('update');

    $('#frm_goods_transfer_update').submit(function (event) {
        event.preventDefault();
        let form = new GoodsTransferHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})