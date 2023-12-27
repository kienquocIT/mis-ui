$(document).ready(function () {
    new MeetingScheduleHandle().load()

    $('#form-create-online-meeting').submit(function (event) {
        event.preventDefault();
        let combinesData = new MeetingScheduleHandle().combinesData($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            setTimeout(
                                () => {
                                    WindowControl.hideLoading();
                                },
                                1000
                            )
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            console.log(data)
                            $('#meeting-link').attr('href', data?.['meeting_url'])
                            $('#meeting-link p').text(data?.['meeting_url'])
                            $('#meeting-password').text(data?.['password'])
                            // setTimeout(() => {
                            //     window.location.replace($(this).attr('data-url-redirect'));
                            //     location.reload.bind(location);
                            // }, 1000);
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
    })
});
