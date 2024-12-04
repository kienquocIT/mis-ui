$(document).ready(function () {
    // call log
    loadSaleCodeList()
    SetupFormSubmit.validate($('#form-create-new-call-log'), {
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

    // meeting
    loadMeetingSaleCodeList();
    loadEmployeeAttended();
    SetupFormSubmit.validate($('#form-new-meeting'), {
        submitHandler: function(form, event){
            event.preventDefault();
            let combinesData = MeetingHandle.combinesData($(form));
            if (combinesData) {
                WindowControl.showLoading();
                $.fn.callAjax2(combinesData)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                setTimeout(() => {
                                    window.location.replace($(form).attr('data-url-redirect'));
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
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
            }
        }
    });

    // email
    loadEmailSaleCodeList();
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