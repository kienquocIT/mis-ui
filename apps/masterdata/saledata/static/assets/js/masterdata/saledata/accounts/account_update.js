$(document).ready(function () {
    AccountEventHandler.InitPageEven()

    UsualLoadPageFunction.LoadAccountType({
        element: pageElements.$account_type
    })
    UsualLoadPageFunction.LoadEmployee({
        element: pageElements.$account_manager
    })
    UsualLoadPageFunction.LoadIndustry({
        element: pageElements.$industry,
        allow_clear: true
    })
    UsualLoadPageFunction.LoadAccountGroup({
        element: pageElements.$account_group
    })
    UsualLoadPageFunction.LoadAccount({
        element: pageElements.$parent_account,
        allow_clear: true
    })
    UsualLoadPageFunction.LoadEmployee({
        element: $('#slb-contact-owner')
    })
    AccountPageFunction.LoadTableContactMapped()
    AccountPageFunction.LoadShippingCities()
    AccountPageFunction.LoadShippingDistrict()
    AccountPageFunction.LoadShippingWard()
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