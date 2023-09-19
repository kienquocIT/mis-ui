$(document).ready(function (){
    let frm = $('#frmDetail');
    let pk = $.fn.getPkDetail();
    WarehouseLoadPage.loadDetail(frm, pk);

    let btn_edit_ele = $('#btn-edit')
    btn_edit_ele.attr('href', btn_edit_ele.attr('href').format_url_with_uuid(pk))
})