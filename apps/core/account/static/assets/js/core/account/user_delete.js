$("tbody").on("click", ".del-button", function () {
    if (confirm($('#trans-factory').data('trans-confirm-delete')) === true) {
        let user_id = $(this).attr('data-id');
        let data_url = $(this).attr('href');
        let user_data = {
            'id': user_id
        }
        $.fn.callAjax({
            url: data_url,
            method: 'DELETE',
            data: user_data
        }).then((resp) => {

            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                $.fn.redirectUrl(location.pathname, 1000);
            }
        }, (errs) => {
            $.fn.notifyB({description: errs.data}, 'failure')
        },)
    }

});



