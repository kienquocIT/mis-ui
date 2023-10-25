$(document).ready(function () {
    LoadDetailPQR();

    const pk = $.fn.getPkDetail();
    const btn_edit = $('#btn-edit');
    btn_edit.attr('href', btn_edit.attr('href').format_url_with_uuid(pk));
})