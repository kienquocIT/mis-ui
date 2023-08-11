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
        EmployeeLoadPage.userSelectEle.initSelect2({
            allowClear: true,
            data: userData,
            callbackTextDisplay: function (item, key) {
                if (item.hasOwnProperty('user')) item = item?.['user'];
                return item?.['full_name'] || '';
            },
        });
    }

    static loadRoleList(roleData) {
        let ele = EmployeeLoadPage.roleSelectEle;
        ele.initSelect2({
            data: roleData,
            multiple: true,
            closeOnSelect: false,
            disabled: !(ele.attr('data-url')),
        });
    }

    static loadGroupList(groupData) {
        let ele = EmployeeLoadPage.groupSelectEle;
        ele.initSelect2({
            data: groupData,
            'allowClear': true,
            disabled: !(ele.attr('data-url')),
        })
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