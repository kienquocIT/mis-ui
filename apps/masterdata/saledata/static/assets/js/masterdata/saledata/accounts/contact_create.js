$(document).ready(function () {
    new ContactHandle().load();

    const frm = new SetupFormSubmit($('#form-create-contact'));
    frm.validate({
        submitHandler: function (form) {
            WindowControl.showLoading();
            let combinesData = new ContactHandle().combinesData(form);
            $.fn.callAjax2(combinesData).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: $('#base-trans-factory').attr('data-success')}, 'success');
                        setTimeout(() => {
                            window.location.replace(frm.formSelected.attr('data-url-redirect'));
                        }, 1000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                }
            )
        }
    })
})
