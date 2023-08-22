$(document).ready(function () {
    const pk = window.location.pathname.split('/').pop();
    const frmDetail = $('#frmDetailShipping');
    loadDetail(frmDetail, pk);
    let btn_edit_ele = $('#btn-edit')
    btn_edit_ele.attr('href', btn_edit_ele.attr('href').format_url_with_uuid(pk))
})