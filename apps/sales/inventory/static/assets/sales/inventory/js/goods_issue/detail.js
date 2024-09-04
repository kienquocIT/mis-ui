$(document).ready(function () {
    new GISHandle().load();
    let pk = $.fn.getPkDetail();
    let frmDetail = $('#frmDetail');

    GISHandle.loadGoodsIssueDetail(frmDetail, pk, 'detail');
})