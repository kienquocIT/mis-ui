$(document).ready(function () {
    CompanyEventHandler.InitPageEven()
    CompanyPageFunction.loadCompanyCities()
    CompanyPageFunction.loadCompanyDistrict()
    CompanyPageFunction.loadCompanyWard()
    CompanyPageFunction.loadCurrency()

    $("#frm-add-company").submit(function (event) {
        event.preventDefault();
        let combinesData = CompanyHandler.CombinesData($(this), false);
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
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
});
