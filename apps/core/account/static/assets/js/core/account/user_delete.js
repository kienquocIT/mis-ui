$("tbody").on("click", ".del-button", function () {
    if (confirm("Confirm Delete User?") === true) {
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let user_id = $(this).attr('data-id');
        let data_url = $(this).attr('href');
        user_data = {
            'id': user_id
        }
        $.fn.callAjax(data_url + '/api', "DELETE", user_data, csr).then((resp) => {

            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyPopup({description: "Thành công"}, 'success')
                $.fn.redirectUrl(location.pathname, 1000);
            }
        }, (errs) => {
            $.fn.notifyPopup({description: errs.data}, 'failure')
        },)
    }

});



