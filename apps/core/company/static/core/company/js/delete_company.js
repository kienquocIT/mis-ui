$("tbody").on("click", "#del-company-button", function (event){
    event.preventDefault();
    if (confirm("Confirm delete ?") === true) {
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let user_id = $(this).attr('data-id');
        let url = '/company/delete/' + user_id
        $.fn.callAjax(url, "delete", {'user_id': user_id}, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: resp.detail}, 'success')
                        setTimeout(location.reload.bind(location), 1000);
                    }
                }, (errs) => {
                    $.fn.notifyPopup({description: errs.detail}, 'failure')
                }
            )
    }
});