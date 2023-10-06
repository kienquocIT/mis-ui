$(document).ready(function () {
    let pk = $.fn.getPkDetail();
    let frmDetail = $('#frmDetail');

    let btn_edit_ele = $('#btn-edit');
    btn_edit_ele.attr('href', btn_edit_ele.attr('href').format_url_with_uuid(pk));
    GoodsIssueLoadPage.loadGoodsIssueDetail(frmDetail, pk);
})