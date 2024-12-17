$(document).ready(function () {
    CallLogHandle.load();

    SetupFormSubmit.validate($('#form-call-log'), {
        submitHandler: function (form, event) {
            event.preventDefault();
            let combinesData = CallLogHandle.combinesData($(form));
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