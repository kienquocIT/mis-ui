$(document).ready(function () {
    new AccountHandle().load();

    // Form Create Account
    let frm = $('#form-create-account')
    frm.submit(function (event) {
        event.preventDefault();
        WindowControl.showLoading();
        let combinesData = new AccountHandle().combinesData($(this));
        console.log(combinesData)
        $.fn.callAjax2(combinesData)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.replace($(this).attr('data-url-redirect'));
                            location.reload.bind(location);
                        }, 1000);
                    }

                },
                (errs) => {
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                        },
                        1000
                    )
                    //$.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    });
});
