$(document).ready(function () {
    new ContactHandle().load();

    const frmCreate = $('#form-create-contact')
    frmCreate.submit(function (event) {
        event.preventDefault();
        WindowControl.showLoading();
        let combinesData = new ContactHandle().combinesData($(this));
        $.fn.callAjax2(combinesData).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: $('#base-trans-factory').attr('data-success')}, 'success');
                    setTimeout(() => {
                        window.location.replace($(this).attr('data-url-redirect'));
                        location.reload.bind(location);
                    }, 1000);
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
            }
        )
    })
})
