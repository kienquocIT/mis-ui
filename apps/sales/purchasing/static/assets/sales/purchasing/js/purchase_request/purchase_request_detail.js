$(document).ready(function () {
    const frmDetail = $('#frm-detail-pr');
    const pk = $.fn.getPkDetail();

    PurchaseRequestAction.loadDtbPrProductDetail([]);

    let btn_edit_ele = $('#btn-edit');
    btn_edit_ele.attr('href', btn_edit_ele.attr('href').format_url_with_uuid(pk));

    PurchaseRequestLoadPage.loadDetail(frmDetail, pk);
})