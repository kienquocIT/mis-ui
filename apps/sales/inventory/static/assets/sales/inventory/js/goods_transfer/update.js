$(document).ready(function () {
    LoadDetailGoodsTransfer('update');

    $('#frm_goods_transfer_update').submit(function (event) {
        event.preventDefault();
        let form = new GoodsTransferHandle().combinesData($(this));
        if (form) {
            console.log(form)
            WFRTControl.callWFSubmitForm(form);
        }
    })
})