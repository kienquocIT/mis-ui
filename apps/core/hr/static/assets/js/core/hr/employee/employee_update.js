$(function () {
    function renderDetailForUpdate(employeeData) {
        if (employeeData && typeof employeeData === 'object') {
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

            EmployeeLoadPage.isAdminEle.prop('checked', employeeData.is_admin_company ? employeeData.is_admin_company : false);
        }
    }

    $(document).ready(function () {
        $x.fn.showLoadingPage();
        HandlePlanAppNew.editEnabled = true;
        HandlePlanAppNew.hasSpaceChoice = true;
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
                renderDetailForUpdate(results[1]);
                return results;
            }
        ).then(
            (results) => {
                $x.fn.hideLoadingPage();
            }
        );

    });

    function callAPIUpdateEmployee(ajaxConfig) {
        if (ajaxConfig) {
            $.fn.callAjax2({
                ...ajaxConfig,
                isLoading: true,
            }).then((resp) => {
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
    }

    let frmEmployeeUpdate = $('#frm_employee_update');
    frmEmployeeUpdate.submit(function (event) {
        event.preventDefault();
        let ajaxConfig = EmployeeLoadPage.combinesForm('#frm_employee_update');
        ajaxConfig['data']['permission_by_configured'] = new HandlePlanAppNew().combinesPermissions();
        ajaxConfig['data']['plan_app'] = new HandlePlanAppNew().combinesPlanApp();
        // make sure confirm if user linked is null!
        if (!ajaxConfig['data']['user']) {
            Swal.fire({
                title: $.fn.transEle.data('sure-change'),
                text: frmEmployeeUpdate.data('msg-user-no-value'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $.fn.transEle.data('msg-yes-update-it'),
                cancelButtonText: $.fn.transEle.data('cancel'),
            }).then((result) => {
                if (result.isConfirmed) {
                    callAPIUpdateEmployee(ajaxConfig)
                }
            })
        } else {
            callAPIUpdateEmployee(ajaxConfig);
        }
    });
})