$(document).ready(function () {
    new LeadHandle().load('create');

    const form_create_lead = $('#form-create-lead')
    let form_validator = form_create_lead.validate({
        submitHandler: function (form) {
            let combinesData = new LeadHandle().combinesData(form);
            if (combinesData) {
                WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
                $.fn.callAjax2(combinesData)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                setTimeout(() => {
                                    window.location.replace(form_create_lead.attr('data-url-redirect'));
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