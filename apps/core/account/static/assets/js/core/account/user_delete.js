$("tbody").on("click", ".del-button", function (){
    let csr = $("input[name=csrfmiddlewaretoken]").val();
    let user_id = $(this).attr('data-id');
    let form = $('#form-user');
    let data_url = form.attr('data-url');
    user_data = {
        'id': user_id
    }
    $.fn.callAjax( data_url + '/' + user_id, "DELETE", user_data, csr).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            $.fn.notifyPopup({description: "Thành công"}, 'success')
            $.fn.redirectUrl(location.pathname, 1500);
        }
    }, (errs) => {
        $.fn.notifyPopup({description: "Thất bại"}, 'failure')
    },)
});



