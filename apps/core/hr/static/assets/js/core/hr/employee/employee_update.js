$(function () {
    let avatarFiles = null;

    function renderDetailForUpdate(employeeData) {
        if (employeeData && typeof employeeData === 'object') {
            $x.fn.renderCodeBreadcrumb(employeeData);
            $('#employee-code').val(employeeData.code)
            EmployeeLoadPage.firstNameEle.val(employeeData.first_name);
            EmployeeLoadPage.lastNameEle.val(employeeData.last_name);
            EmployeeLoadPage.emailEle.val(employeeData.email);
            $('#span-verified').prop('hidden', !employeeData.email_app_password_status)
            $('#span-not-verified').prop('hidden', employeeData.email_app_password_status)
            EmployeeLoadPage.phoneEle.val(employeeData.phone);
            EmployeeLoadPage.loadUserList(employeeData?.user);
            EmployeeLoadPage.loadGroupList(employeeData.group);
            EmployeeLoadPage.loadRoleList(employeeData.role);
            EmployeeLoadPage.loadDob(employeeData.dob);
            EmployeeLoadPage.loadDateJoined(employeeData.date_joined, false);

            EmployeeLoadPage.isActive.prop('checked', employeeData?.is_active || false);
            EmployeeLoadPage.isAdminEle.prop('checked', employeeData?.['is_admin_company'] || false);

            let avatarEle = $('#employee-avatar-img-input');
            if (employeeData.avatar_img) {
                avatarEle.attr('data-default-file', employeeData.avatar_img)
            }
            avatarEle.dropify({
                messages: {
                    'default': '',
                }
            })
            avatarEle.on('change', function (event){
                avatarFiles = event.target.files[0];
                console.log('avatarFiles:', avatarFiles);
            })
            avatarEle.fadeIn();
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
                'loadingOpts': {
                    'loadingTitleAction': 'UPDATE',
                    'loadingTitleMore': 'General information',
                },
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'title': `${$.fn.gettext('Employee Information')}`, 'description': $.fn.transEle.attr('data-success')}, 'success');

                        if (avatarFiles){
                            let eleInputAvatar = $('#employee-avatar-img-input');
                            let formData = new FormData();
                            formData.append('file', avatarFiles);
                            $.fn.callAjax2({
                                url: eleInputAvatar.attr('data-url'),
                                method: eleInputAvatar.attr('data-method'),
                                data: formData,
                                contentType: 'multipart/form-data',
                                isLoading: true,
                                'loadingOpts': {
                                    'loadingTitleAction': 'UPDATE',
                                    'loadingTitleMore': 'Avatar',
                                },
                            }).then(
                                (resp) => {
                                    let data = $.fn.switcherResp(resp);
                                    if (data){
                                        $.fn.notifyB({'title': `${$.fn.gettext('Avatar')}`, 'description': $.fn.transEle.attr('data-success')}, 'success');
                                        setTimeout(() => window.location.reload(), 1000)
                                    }
                                },
                                (errs) => $.fn.switcherResp(errs),
                            )
                        } else {
                            setTimeout(() => window.location.reload(), 1000)
                        }
                    }
                },
                (errs) => $.fn.switcherResp(errs),
            )
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

    // for verify email

    function combinesDataTestEmailConnection() {
        let data = {}
        data['email'] = $('#employee-email').val();
        data['email_app_password'] = $('#email-app-password').attr('data-value');
        if (data['email'] && data['email_app_password']) {
            return {
                url: $("#btn-test-email-connection").attr('data-url'),
                method: 'GET',
                data: data,
            };
        }
        else {
            $.fn.notifyB({description: "Missing email or App Password"}, 'warning')
        }
    }

    $('#span-verified').on('click', function () {
        $('#email-app-password').val('')
    })

    $('#span-not-verified').on('click', function () {
        $('#email-app-password').val('')
    })

    $("#btn-test-email-connection").on('click', function (event) {
        $('#email-app-password').attr('data-value', $('#email-app-password').val())
        event.preventDefault();
        let combinesData = combinesDataTestEmailConnection();
        if (combinesData) {
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Connect successfully"}, 'success')
                            $('#span-verified').prop('hidden', false)
                            $('#span-not-verified').prop('hidden', true)
                            $('#update-emp').trigger('click')
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: 'Can not verify your Email. Check your App password again.'}, 'failure');
                        $('#span-verified').prop('hidden', true)
                        $('#span-not-verified').prop('hidden', false)
                        $('#update-emp').trigger('click')
                    }
                )
        }
    })
})