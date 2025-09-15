$(document).ready(function () {
    OpportunityEventHandler.InitPageEven()
    UsualLoadPageFunction.LoadDate({element: $input_open_date})
    UsualLoadPageFunction.LoadDate({element: $input_close_date})
    OpportunityHandler.LoadDetailOpportunity('update')

    // submit form edit
    new SetupFormSubmit($('#frm-detail')).validate({
        submitHandler: function (form) {
            WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
            let frm = new SetupFormSubmit($(form));
            let dataForm = OpportunityHandler.GetDataForm();
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: 'Successfully'}, 'success')
                        setTimeout(() => {
                            window.location.replace(frm.dataUrlRedirect.format_url_with_uuid($.fn.getPkDetail()));
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
