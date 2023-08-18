$(document).ready(function () {
    EmployeeLoadPage.loadUserList();
    EmployeeLoadPage.loadGroupList();
    EmployeeLoadPage.loadRoleList();
    EmployeeLoadPage.loadDob();
    EmployeeLoadPage.loadDateJoined();

    callAppList().then((result) => {
        renderAppList(result);
    })

    SetupFormSubmit.validate(
        $('#frm_employee_create'),
        {
            submitHandler: function (form) {
                let ajaxConfig = EmployeeLoadPage.combinesForm($(form), false);
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
