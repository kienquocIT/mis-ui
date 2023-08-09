$(function () {
    function renderDetailData(data) {
        if (data && data.hasOwnProperty('employee')) {
            let employeeData = data.employee;

            new HandlePermissions().loadData(employeeData.plan_app, employeeData.permission_by_configured || []);
            new HandlePlanApp().appendPlanAppOfEmployee(employeeData.plan_app);

            EmployeeLoadPage.firstNameEle.val(employeeData.first_name);
            EmployeeLoadPage.lastNameEle.val(employeeData.last_name);
            EmployeeLoadPage.emailEle.val(employeeData.email);
            EmployeeLoadPage.phoneEle.val(employeeData.phone);
            EmployeeLoadPage.isAdminEle.prop('checked', employeeData.is_admin_company);
            EmployeeLoadPage.isActive.prop('checked', employeeData.is_active);
            EmployeeLoadPage.loadUserList(employeeData.user);
            EmployeeLoadPage.loadGroupList(employeeData.group);
            EmployeeLoadPage.loadRoleList(employeeData.role);
            EmployeeLoadPage.loadDob(employeeData.dob);
            EmployeeLoadPage.loadDateJoined(employeeData.date_joined);
        }
    }

    $(document).ready(function () {
        $x.fn.showLoadingPage();
        Promise.all([
            callAppList(), callDetailData($('#employee-detail-page').attr('data-url'), 'GET')
        ]).then((results) => {
            renderAppList(results[0]);
            return results;
        }).then((results) => {
            renderDetailData(results[1]);
            return results;
        }).then(
            (results)=>{
                $x.fn.hideLoadingPage();
            }
        );
    });
});