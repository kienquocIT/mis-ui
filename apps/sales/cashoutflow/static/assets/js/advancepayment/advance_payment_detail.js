$(document).ready(function () {
    let pk = window.location.pathname.split('/').pop();
    let url_detail = $('#form-update-advance').attr('data-url-detail').replace('0', pk)
    $.fn.callAjax(url_detail, 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            console.log(data);
            let advance_payment = data.advance_payment_detail;
            $('#advance-payment-code').text(advance_payment.code);
            $('#advance-payment-title').val(advance_payment.title);
        }
    })
})