$(document).ready(function () {
    ContactHandle.load();

    const frm = new SetupFormSubmit($('#form-create-contact'));
    frm.validate({
        submitHandler: function (form) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            let combinesData = ContactHandle.combinesData(form);
            $.fn.callAjax2(combinesData).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: $('#base-trans-factory').attr('data-success')}, 'success');
                        setTimeout(() => {
                            window.location.replace(form.attr('data-url-redirect'));
                        }, 1000);
                    }
                }, (err) => {
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                }
            )
        }
    })
})
