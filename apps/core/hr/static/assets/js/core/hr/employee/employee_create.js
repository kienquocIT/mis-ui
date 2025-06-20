$(document).ready(function () {
    $.fn.InitAutoGenerateCodeField({
        param_app_code: 'employee',
        param_ele_code_id: 'employee-code'
    })

    EmployeeLoadPage.loadUserList();
    EmployeeLoadPage.loadGroupList();
    EmployeeLoadPage.loadRoleList();
    // date picker
    $('.date-picker').each(function () {
        DateTimeControl.initDatePicker(this);
    });

    callAppList().then((result) => {
        renderAppList(result);
    })

    SetupFormSubmit.validate(
        $('#frm_employee_create'),
        {
            submitHandler: function (form, event) {
                let ajaxConfig = EmployeeLoadPage.combinesForm($(form), false);
                ajaxConfig['data']['permission_by_configured'] = new HandlePlanAppNew().combinesPermissions();
                ajaxConfig['data']['plan_app'] = new HandlePlanAppNew().combinesPlanApp();
                $.fn.callAjax2({
                    ...ajaxConfig,
                    isLoading: true,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        setTimeout(() => {
                            window.location.href = $(form).attr('data-url-redirect');
                        }, 1000)
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        }
    );
});
