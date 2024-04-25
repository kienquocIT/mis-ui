$(document).ready(function () {
    new GoodsIssueLoadPage().load();
    let pk = $.fn.getPkDetail();
    let frmDetail = $('#frmDetail');

    GoodsIssueLoadPage.loadGoodsIssueDetail(frmDetail, pk);
})