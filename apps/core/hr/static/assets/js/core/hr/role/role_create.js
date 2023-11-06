$(document).ready(function () {
    callAppList().then((result) => {
        renderAppList(result);
    })

    RoleLoadPage.loadMembers();

    let frm = $("#form-role");
    SetupFormSubmit.validate(
        frm,
        {
            submitHandler: function (form) {
                let ajaxConfig = new RoleForm({'form': $(form)}).combinesForm();
                ajaxConfig['data']['permission_by_configured'] = new HandlePlanAppNew().combinesPermissions();
                ajaxConfig['data']['plan_app'] = new HandlePlanAppNew().combinesPlanApp();
                return $.fn.callAjax2({...ajaxConfig, isLoading: true}).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: $.fn.transEle.attr('data-success')}, 'success');
                            if ($(frm).attr('data-url-redirect')) {
                                $.fn.redirectUrl($(frm).attr('data-url-redirect'), 1000);
                            } else {
                                setTimeout(
                                    () => {
                                        window.location.reload()
                                    },
                                    1000
                                )
                            }
                        }
                        $x.fn.hideLoadingPage();
                    },
                    (errs) => {
                        $.fn.switcherResp(errs);
                        $x.fn.hideLoadingPage();
                    }
                )
            }
        });
});
