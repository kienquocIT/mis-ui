$(document).ready(function () {

    // load data detail
    let pk = window.location.pathname.split('/').pop();
    let url_loaded = $('#form-detail-account').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['account_detail'];
                console.log(data);
                $('#account-title-id').val(data.name);
                $('#account-code-id').val(data.code);
                $('#account-website-id').val(data.website);
                $('#account-owner-id').val(data.owner[0].fullname);
            }
        })

})