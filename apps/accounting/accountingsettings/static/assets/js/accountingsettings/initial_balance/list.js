$(document).ready(function() {
    const $accountingPeriod = $('#accountingPeriod');

    UsualLoadPageFunction.LoadPeriod({
        element: $accountingPeriod,
        data_url: $accountingPeriod.attr('data-url'),
        apply_default_on_change: true
    });

    function CombinesData(frmEle) {
        let dataForm = {
            "period_mapped": $accountingPeriod.val()
        };
        if (dataForm) {
            let frm = new SetupFormSubmit($(frmEle));
            return {
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: dataForm,
                urlRedirect: frm?.['urlRedirect'],
            };
        }
        return false;
    }

    $('#form-create-initial-balance').submit(function (event) {
        event.preventDefault();
        let combinesData = CombinesData($(this), false);
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success');
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect').replace('0', data?.id));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },1000
                        );
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    });
});
