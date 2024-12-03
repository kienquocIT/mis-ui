$(document).ready(function () {
    MeetingHandle.load();

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
});