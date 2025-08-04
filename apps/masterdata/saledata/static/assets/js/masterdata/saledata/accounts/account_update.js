$(document).ready(function () {
    AccountEventHandler.InitPageEven()

    UsualLoadPageFunction.LoadEmployee({
        element: $('#slb-contact-owner')
    })
    // for location
    UsualLoadPageFunction.LoadLocationCountry($('#modal-shipping-address .location_country'))
    UsualLoadPageFunction.LoadLocationProvince($('#modal-shipping-address .location_province'))
    UsualLoadPageFunction.LoadLocationWard($('#modal-shipping-address .location_ward'))
    AccountPageFunction.LoadTableShippingAddress()
    AccountPageFunction.LoadTableBillingAddress()
    AccountPageFunction.LoadTableBankAccount()
    $('#credit-card-exp-date').datepicker({
        format: "mm/yyyy",
        startView: "months",
        minViewMode: "months",
    })

    AccountHandler.LoadDetail('update')

    $('#form-detail-update-account').submit(function (event) {
        event.preventDefault();
        let combinesData = AccountHandler.CombinesData($(this), true);
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect').format_url_with_uuid($.fn.getPkDetail()));
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
})