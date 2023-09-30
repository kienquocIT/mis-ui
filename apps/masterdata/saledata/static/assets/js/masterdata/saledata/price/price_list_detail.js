$(document).ready(function () {
    let frm = $('#form-update-price-list');
    let pk = $.fn.getPkDetail();

    let btnEdit = $('#btn-edit')
    btnEdit.attr('href', btnEdit.attr('href').format_url_with_uuid(pk));
    PriceListLoadPage.loadDetailPage(frm, pk, 'detail');
})
