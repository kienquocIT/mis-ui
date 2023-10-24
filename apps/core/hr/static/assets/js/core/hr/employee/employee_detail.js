$(function () {
    function renderDetailData(employeeData) {
        if (employeeData && typeof employeeData === 'object') {
            $x.fn.renderCodeBreadcrumb(employeeData);

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
        HandlePlanAppNew.editEnabled = false;
        Promise.all(
            [
                getAllAppOfTenant(),
                callDetailData($('#employee-detail-page').attr('data-url'), 'GET'),
            ]
        ).then(
            (results) => {
                HandlePlanAppNew.setPlanApp(results[1]?.plan_app || [])
                HandlePlanAppNew.setPermissionByConfigured(results[1]?.permission_by_configured || [])

                let clsNew = new HandlePlanAppNew();
                clsNew.renderTenantApp(results[0]);
                clsNew.renderPermissionSelected()
                return results;
            }
        ).then(
            (results) => {
                renderDetailData(results[1]);
                return results;
            }
        ).then(
            () => {
                $x.fn.hideLoadingPage();
            }
        );
    });
});