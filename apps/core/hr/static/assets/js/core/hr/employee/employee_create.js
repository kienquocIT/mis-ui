$(document).ready(function () {
    EmployeeLoadPage.loadUserList();
    EmployeeLoadPage.loadGroupList();
    EmployeeLoadPage.loadRoleList();
    EmployeeLoadPage.loadDob();
    EmployeeLoadPage.loadDateJoined();

    callAppList().then((result) => {
        renderAppList(result);
    })

    let frm = $('#frm_employee_create');
    frm.validate({
        invalidHandler: function (event, validator) {
            Object.keys(validator.errorMap).map(
                (key) => {
                    $.fn.notifyB({
                        'title': key,
                        'description': validator.errorMap[key]
                    }, 'failure');
                }
            )
        },
        submitHandler: function () {
            let ajaxConfig = EmployeeLoadPage.combinesForm('#frm_employee_create', false);
            console.log('ajaxConfig: ', ajaxConfig);
            $.fn.callAjax2(ajaxConfig).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    // if (errs.data.errors.hasOwnProperty('detail')) {
                    //     $.fn.notifyB({description: String(errs.data.errors['detail'])}, 'failure')
                    // }
                }
            )
        },
    })
});
