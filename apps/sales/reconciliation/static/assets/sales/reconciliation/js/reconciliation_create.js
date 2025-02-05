$(document).ready(function () {
    ReconHandle.LoadPage();
    WFRTControl.setWFInitialData('reconciliation', 'POST')

    // SUBMIT FORM CREATE
    const recon_create_form = $('#form-create-recon')
    let form_validator = recon_create_form.validate({
        submitHandler: function (form) {
            let form_data = ReconHandle.CombinesData(form);
            if (form_data) {
                WindowControl.showLoading();
                $.fn.callAjax2(form_data)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                setTimeout(() => {
                                    window.location.replace(recon_create_form.attr('data-url-redirect'));
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
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
});
