$(document).ready(function () {
    EmailHandle.load();

    SetupFormSubmit.validate($('#form-new-email'), {
        submitHandler: function (form, event) {
            event.preventDefault();
            let combinesData = EmailHandle.combinesData($(form));
            if (combinesData) {
                WindowControl.showLoading();
                $.fn.callAjax2(combinesData)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                setTimeout(() => {
                                    window.location.href = $(form).attr('data-url-redirect');
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
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
            }
        },
    })
});
