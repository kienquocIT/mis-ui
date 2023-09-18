$(function () {
    $(document).ready(function () {
        const id = $.fn.getPkDetail()
        const frmDetail = $('#frmDetail');


        let btn_edit_ele = $('#btn-edit');
        btn_edit_ele.attr('href', btn_edit_ele.attr('href').format_url_with_uuid(id));

        loadDataTableCost([], true);

        loadDetail(id, frmDetail);
    })
})