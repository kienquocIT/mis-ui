$(function () {
    let avatarFiles = null;
    // const $span_not_verified = $('#span-not-verified')
    // const $span_verified = $('#span-verified')
    // const $email_app_password = $('#email-app-password')
    // const $btn_test_email_connection = $("#btn-test-email-connection")
    const frmEmployeeUpdate = $('#frm_employee_update')

    function renderDetailForUpdate(employeeData) {
        if (employeeData && typeof employeeData === 'object') {
            $x.fn.renderCodeBreadcrumb(employeeData);
            EmployeeLoadPage.codeEle.val(employeeData.code)
            if (EmployeeLoadPage.codeEle.val()) {
                EmployeeLoadPage.codeEle.attr('readonly', 'true');
            }
            EmployeeLoadPage.firstNameEle.val(employeeData.first_name);
            EmployeeLoadPage.lastNameEle.val(employeeData.last_name);
            EmployeeLoadPage.emailEle.val(employeeData.email);
            // $span_verified.prop('hidden', !employeeData.email_app_password_status)
            // $span_not_verified.prop('hidden', employeeData.email_app_password_status)
            EmployeeLoadPage.phoneEle.val(employeeData.phone);
            EmployeeLoadPage.loadUserList(employeeData?.user);
            EmployeeLoadPage.loadGroupList(employeeData.group);
            EmployeeLoadPage.loadRoleList(employeeData.role);
            if (employeeData?.['date_joined']) {
                EmployeeLoadPage.dateJoinedEle.val(moment(employeeData?.['date_joined']).format('DD/MM/YYYY'));
            }
            EmployeeLoadPage.dobEle.val('');
            if (employeeData?.['dob']) {
                EmployeeLoadPage.dobEle.val(moment(employeeData?.['dob']).format('DD/MM/YYYY'));
            }

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
        // date picker
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });
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

    // function combinesDataTestEmailConnection() {
    //     let data = {}
    //     data['email'] = $('#employee-email').val();
    //     data['email_app_password'] = $email_app_password.attr('data-value');
    //     if (data['email'] && data['email_app_password']) {
    //         return {
    //             url: $btn_test_email_connection.attr('data-url'),
    //             method: 'GET',
    //             data: data,
    //         };
    //     }
    //     else {
    //         $.fn.notifyB({description: "Missing email or App Password"}, 'warning')
    //     }
    // }

    // $span_verified.on('click', function () {
    //     $email_app_password.val('')
    // })

    // $span_not_verified.on('click', function () {
    //     $email_app_password.val('')
    // })

    // const $form_update_email_api_key = $('#form-update-email-api-key')
    // function CallAPIUpdateEmailAPIKey() {
    //     $.fn.callAjax2({
    //         url: $form_update_email_api_key.attr('data-url').replace('/0', `/${$.fn.getPkDetail()}`),
    //         method: 'PUT',
    //         data: {'email_app_password': $email_app_password.attr('data-value')},
    //     }).then(
    //         (resp) => {
    //             let data = $.fn.switcherResp(resp);
    //             if (data) {
    //                 WindowControl.hideLoading()
    //                 setTimeout(() => window.location.reload(), 1000)
    //             }
    //         },
    //         (errs) => {
    //             WindowControl.hideLoading()
    //             $.fn.switcherResp(errs)
    //         },
    //     )
    // }

    // $btn_test_email_connection.on('click', function (event) {
    //     WindowControl.showLoading()
    //     event.preventDefault();
    //     $email_app_password.attr('data-value', $email_app_password.val())
    //     let combinesData = combinesDataTestEmailConnection();
    //     if (combinesData) {
    //         $.fn.callAjax2(combinesData)
    //             .then(
    //                 (resp) => {
    //                     let data = $.fn.switcherResp(resp);
    //                     if (data) {
    //                         let timerInterval
    //                         Swal.fire({
    //                             title: '',
    //                             html: `<span class="text-success">${$form_update_email_api_key.attr('data-trans-update-success')}</span>`,
    //                             timer: 2000,
    //                             timerProgressBar: true,
    //                             onClose: () => {
    //                                 clearInterval(timerInterval)
    //                             }
    //                         }).then((result) => {
    //                             if (result.dismiss === Swal.DismissReason.timer) {
    //                                 window.location.reload()
    //                             }
    //                         })
    //                         CallAPIUpdateEmailAPIKey()
    //                     }
    //                 },
    //                 (errs) => {
    //                     let timerInterval
    //                     Swal.fire({
    //                         title: '',
    //                         html: `<span class="text-danger">${$form_update_email_api_key.attr('data-trans-update-fail')}</span>`,
    //                         onClose: () => {
    //                             clearInterval(timerInterval)
    //                         }
    //                     })
    //                     WindowControl.hideLoading()
    //                 }
    //             )
    //     }
    // })
})