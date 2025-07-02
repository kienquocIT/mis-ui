$(document).ready(function () {
    ShiftLoadDataHandle.initPage();
    $('#modal-creat-shift').submit(function (event) {
        event.preventDefault();
        let combineData = ShiftLoadDataHandle.combineData($(this));
        if (combineData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combineData).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Succesfully"}, 'success');
                        setTimeout(() => {
                            window.location.replace($(this).attr('data-url-redirect'));
                            location.reload.bind(location);
                        }, 1000);
                    }
                },
                (errs) => {
                    setTimeout(() => {WindowControl.hideLoading();}, 1000);
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
})