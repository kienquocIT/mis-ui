function callAppList() {
    let tableApply = $('#dtb-plan-app');
    let frm = new SetupFormSubmit(tableApply);
    return $.fn.callAjax2({
        'url': frm.dataUrl,
        'method': frm.dataMethod,
        'isDropdown': true,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

function renderAppList(data) {
    if (data && data.hasOwnProperty('tenant_plan_list') && Array.isArray(data.tenant_plan_list)) {
        new HandlePlanApp().loadData(data.tenant_plan_list);
    }
}

function callDetailData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
        isDropdown: true,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

class EmployeeLoadPage {
    static groupSelectEle = $('#select-box-group-employee');
    static roleSelectEle = $('#select-box-role-employee');
    static userSelectEle = $('#select-box-user');
    static dobEle = $('#employee-dob');
    static dateJoinedEle = $('#employee-date-joined');
    static firstNameEle = $('#employee-first-name');
    static lastNameEle = $('#employee-last-name');
    static emailEle = $('#employee-email');
    static phoneEle = $('#employee-phone');
    static isAdminEle = $('#idx_is_admin_company');
    static isActive = $('#is_active');

    static loadUserList(userData) {
        // load user list
        let eleUserList = EmployeeLoadPage.userSelectEle;
        let userIdCurrent = null;
        eleUserList.text("");
        if (userData && userData.hasOwnProperty('id')) {
            userIdCurrent = userData['id'];
            eleUserList.append(`
                <option 
                    value="${userData.id}" 
                    data-first-name="${userData.first_name}" 
                    data-last-name="${userData.last_name}" 
                    data-email="${userData.email}" 
                    data-phone="${userData.phone}"
                >${userData?.['full_name']}</option>`
            )
            eleUserList.trigger('change');
        } else {
            eleUserList.append(`<option value=""></option>`);
        }

        let url = eleUserList.attr('data-url');
        let method = eleUserList.attr('data-method');
        if (url && method) {
            $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('company_user_list') && Array.isArray(data.company_user_list)) {
                        data.company_user_list.map(function (item) {
                            let userData = item?.user;
                            if (userData && Object.keys(userData).length > 0) {
                                if (!userIdCurrent || (userIdCurrent && userIdCurrent !== item.id)) {
                                    eleUserList.append(`
                                    <option 
                                        value="${userData.id}" 
                                        data-first-name="${userData.first_name}" 
                                        data-last-name="${userData.last_name}" 
                                        data-email="${userData.email}" 
                                        data-phone="${userData.phone}"
                                    >${userData?.['full_name']}</option>`);
                                }
                            }
                        })
                    }
                }
                eleUserList.initSelect2({
                    allowClear: true,
                });
            })
        }
    }

    static loadRoleList(roleData) {
        let ele = EmployeeLoadPage.roleSelectEle;
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');

        let roleCurrentIds = [];
        if (roleData && Array.isArray(roleData)) {
            roleData.map((item) => {
                let idx = item.id;
                roleCurrentIds.push(idx);
                if (idx) ele.append(`<option value="${idx}" selected>${item.title}</option>`); else throw Error('Role does not exist.');
            })
        } else {
            ele.append(`<option value=""></option>`);
        }

        if (url && method) {
            $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('role_list') && Array.isArray(data.role_list)) {
                        data.role_list.map(function (item) {
                            if (!roleCurrentIds.includes(item.id)) ele.append(`<option value="${item.id}">${item.title}</option>`);
                        });
                        ele.initSelect2({
                            'multiple': true,
                            closeOnSelect: false
                        });
                    }
                }
            })
        } else {
            ele.initSelect2({
                'multiple': true,
                disabled: true
            });
        }
    }

    static loadGroupList(groupData) {
        let ele = EmployeeLoadPage.groupSelectEle;
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        let groupCurrentId = null;
        if (groupData && groupData.hasOwnProperty('id')) {
            groupCurrentId = groupData.id;
            ele.append(`<option value="${groupData.id}" selected>${groupData.title}</option>`)
        } else {
            ele.append(`<option value=""></option>`);
        }

        if (url && method) {
            $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('group_list') && Array.isArray(data.group_list)) {
                        data.group_list.map(function (item) {
                            if (item.id !== groupCurrentId) ele.append(`<option value="${item.id}">${item.title}</option>`);
                        })
                        ele.initSelect2({'allowClear': true})
                    }
                }
            })
        }
    }

    static loadDob(dobData) {
        EmployeeLoadPage.dobEle.dateRangePickerDefault({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: true,
            minYear: 1901,
            maxYear: parseInt(moment().format('YYYY'), 10)
        }).val(dobData ? moment(dobData).format('MM/DD/YYYY') : null).on('hide.daterangepicker', function () {
            $(this).val($(this).val().split(" ")[0])
        });
    }

    static loadDateJoined(dateJoinedData) {
        EmployeeLoadPage.dateJoinedEle.dateRangePickerDefault({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: true,
            minYear: 1901,
            maxYear: parseInt(moment().format('YYYY'), 10)
        }).val(dateJoinedData ? moment(dateJoinedData).format('MM/DD/YYYY') : null).on('hide.daterangepicker', function () {
            $(this).val($(this).val().split(" ")[0])
        });
    }

    static combinesForm(frmIdx, hasPermit = true) {
        let frm = new SetupFormSubmit($(frmIdx));
        if (hasPermit === true) frm.dataForm['permission_by_configured'] = new HandlePermissions().combinesData()['data'];
        frm.dataForm['is_active'] = frm.dataForm['is_active'] === 'on';
        frm.dataForm['is_admin_company'] = frm.dataForm['is_admin_company'] === 'on';
        frm.dataForm['plan_app'] = new HandlePlanApp().combinesData();
        frm.dataForm['date_joined'] = frm.dataForm['date_joined'] ? moment(frm.dataForm['date_joined']).format('YYYY-MM-DD HH:mm:ss') : null;
        frm.dataForm['dob'] = frm.dataForm['dob'] ? moment(frm.dataForm['dob']).format('YYYY-MM-DD') : null;
        frm.dataForm['role'] = EmployeeLoadPage.roleSelectEle.val()

        if (!frm.dataForm['user']) frm.dataForm['user'] = null;

        if (frm.dataForm['user'] && !frm.dataForm['plan_app']) {
            $.fn.notifyB({description: 'Employee map user must choose applications'}, 'failure');
            return false;
        }

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
        };
    }
}

EmployeeLoadPage.userSelectEle.on('change', function (e) {
    let optSelected = $(this).find(':selected');
    if (optSelected.length > 0) {
        let first_name = $(optSelected).attr('data-first-name');
        let last_name = $(optSelected).attr('data-last-name');
        let email = $(optSelected).attr('data-email');
        let phone = $(optSelected).attr('data-phone');
        EmployeeLoadPage.firstNameEle.val(first_name);
        EmployeeLoadPage.lastNameEle.val(last_name);
        EmployeeLoadPage.emailEle.val(email);
        EmployeeLoadPage.phoneEle.val(phone);
    }
});