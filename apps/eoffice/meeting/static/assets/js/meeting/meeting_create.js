$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    MeetingScheduleHandle.load()

    $('#form-create-meeting').submit(function (event) {
        event.preventDefault();
        let combinesData = MeetingScheduleHandle.combinesData($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            console.log(data)
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
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    // click call check free room
    const roomCheck = new checkRoomAvailable()
    roomCheck.listenEvent()
    $('#check_room').on('click', function(){
        if ($('#start-date').val() && $('#room').val()){
            $('.wrap_time_view').addClass('show')
            roomCheck.validData()
        }
        else{
            $.fn.notifyB({"description": $.fn.gettext("please select Start date and Room to continue")}, 'failure')
        }
    });
});
