$(document).ready(function () {
    const $form_create = $('#form-create-account')

    $.fn.InitAutoGenerateCodeField({
        param_app_code: 'account',
        param_ele_code_id: 'inp-code'
    })

    AccountEventHandler.InitPageEven()

    UsualLoadPageFunction.LoadAccountType({
        element: pageElements.$account_type
    })
    UsualLoadPageFunction.LoadEmployee({
        element: pageElements.$account_manager
    })
    UsualLoadPageFunction.LoadIndustry({
        element: pageElements.$industry,
        allowClear: true
    })
    UsualLoadPageFunction.LoadAccountGroup({
        element: pageElements.$account_group
    })
    UsualLoadPageFunction.LoadAccount({
        element: pageElements.$parent_account,
        allowClear: true
    })
    UsualLoadPageFunction.LoadEmployee({
        element: $('#slb-contact-owner')
    })
    AccountPageFunction.LoadTableContactMapped()
    // for location
    UsualLoadPageFunction.LoadLocationCountry($('#modal-shipping-address .location_country'))
    UsualLoadPageFunction.LoadLocationProvince($('#modal-shipping-address .location_province'))
    UsualLoadPageFunction.LoadLocationWard($('#modal-shipping-address .location_ward'))
    AccountPageFunction.LoadTableShippingAddress()
    AccountPageFunction.LoadTableBillingAddress()
    AccountPageFunction.LoadTableBankAccount()

    $form_create.submit(function (event) {
        event.preventDefault();
        let combinesData = AccountHandler.CombinesData($(this));
        // console.log(combinesData)
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect').format_url_with_uuid(data.id));
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
});
