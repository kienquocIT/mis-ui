$(document).ready(function () {
    // for location
    UsualLoadPageFunction.LoadLocationCountry($('#modal-work-address .location_country'))
    UsualLoadPageFunction.LoadLocationProvince($('#modal-work-address .location_province'))
    UsualLoadPageFunction.LoadLocationWard($('#modal-work-address .location_ward'))
    UsualLoadPageFunction.LoadLocationCountry($('#modal-home-address .location_country'))
    UsualLoadPageFunction.LoadLocationProvince($('#modal-home-address .location_province'))
    UsualLoadPageFunction.LoadLocationWard($('#modal-home-address .location_ward'))

    ContactHandle.LoadDetailContact('update')

    const frm = new SetupFormSubmit($('#form-detail-contact'));
    frm.validate({
        submitHandler: function (form) {
            WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
            let combinesData = ContactHandle.CombinesData(form);
            $.fn.callAjax2(combinesData).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: $('#base-trans-factory').attr('data-success')}, 'success');
                        setTimeout(() => {
                            window.location.replace(form.attr('data-url-redirect').replace('/0', `/${$.fn.getPkDetail()}`));
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
});
