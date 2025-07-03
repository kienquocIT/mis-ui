$(document).ready(function () {
    ShiftLoadDataHandle.initPage();
    ShiftLoadEventHandler.InitPageEvent();
    $('#modal-create-shift').submit(function (event) {
        event.preventDefault();
        let combineData = ShiftLoadDataHandle.combineData($(this));
        if (combineData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            debugger
            $.fn.callAjax2(combineData).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Creat new shift successfully"}, 'success');
                        setTimeout(() => {
                            window.location.replace($(this).attr('data-url-redirect'));
                            location.reload.bind(location);
                        }, 1000);
                    }
                },
                (errs) => {
                    debugger
                    setTimeout(() => {WindowControl.hideLoading();}, 1000);
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
})