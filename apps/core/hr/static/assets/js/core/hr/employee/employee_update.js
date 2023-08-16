$(function () {
    function renderDetailForUpdate(data) {
        if (data && data.hasOwnProperty('employee')) {
            let employeeData = data.employee;
            $x.fn.renderCodeBreadcrumb(employeeData);
            EmployeeLoadPage.firstNameEle.val(employeeData.first_name);
            EmployeeLoadPage.lastNameEle.val(employeeData.last_name);
            EmployeeLoadPage.emailEle.val(employeeData.email);
            EmployeeLoadPage.phoneEle.val(employeeData.phone);
            EmployeeLoadPage.loadUserList(employeeData?.user);
            EmployeeLoadPage.loadGroupList(employeeData.group);
            EmployeeLoadPage.loadRoleList(employeeData.role);
            EmployeeLoadPage.loadDob(employeeData.dob);
            EmployeeLoadPage.loadDateJoined(employeeData.date_joined);

            new HandlePermissions().loadData(employeeData.plan_app, employeeData.permission_by_configured || []);
            new HandlePlanApp().appendPlanAppOfEmployee(employeeData.plan_app);

            EmployeeLoadPage.isAdminEle.prop('checked', employeeData.is_admin_company ? employeeData.is_admin_company : false);
        }
    }

    $(document).ready(function () {
        Promise.all([
            callAppList(), callDetailData($('#frm_employee_update').attr('data-url'), 'GET')
        ]).then((results) => {
            renderAppList(results[0]);
            return results;
        }).then((results) => {
            renderDetailForUpdate(results[1]);
            return results;
        });
    });

    $('#frm_employee_update').submit(function (event) {
        event.preventDefault();

        let ajaxConfig = EmployeeLoadPage.combinesForm('#frm_employee_update');
        if (ajaxConfig){
            $.fn.callAjax2(ajaxConfig).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                    // $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                }
            }, (errs) => {
                $.fn.switcherResp(errs);
            })
        }
    });
})