$("tbody").on("click", ".del-user", function (){
    let csr = $("input[name=csrfmiddlewaretoken]").val();
    let user_id = $(this).attr('data-id');
    user_data = {
        'id': user_id
    }
    $.fn.callAjax('/account/users/' + user_id, "DELETE", user_data, csr).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            $.fn.notifyPopup({description: "Thành công"}, 'success')
            $.fn.redirectUrl(location.pathname, 3000);
        }
    }, (errs) => {
        $.fn.notifyPopup({description: "Thất bại"}, 'failure')
    },)
});



