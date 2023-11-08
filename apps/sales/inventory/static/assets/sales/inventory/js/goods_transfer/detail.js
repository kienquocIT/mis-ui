$(document).ready(function () {
    let pk = $.fn.getPkDetail();
    let frmDetail = $('#frmDetail');
    GoodsTransferLoadPage.loadDtbProduct([]);
    GoodsTransferLoadPage.loadGoodsTransferDetail(frmDetail, pk);
})