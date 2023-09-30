$(document).ready(function () {
    let pk = $.fn.getPkDetail();
    let frmDetail = $('#frmDetail');
    GoodsIssueLoadPage.loadGoodsIssueDetail(frmDetail, pk);
})