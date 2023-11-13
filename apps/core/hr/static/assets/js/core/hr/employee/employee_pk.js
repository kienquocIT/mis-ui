function callDetailData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data && data.hasOwnProperty('employee')) {
            return data.employee;
        }
        return {};
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
            keyId: 'user--id',
            keyText: 'user--full_name',
            data: (userData ? {'user': userData} : null),
        }).on('change', function () {
            let selectedVal = $(this).val();
            let dataBackup = SelectDDControl.get_data_from_idx($(this), selectedVal);

            let userDetail = dataBackup?.['user'] || {};
            let tabInfoEle = $('#tab-info');

            tabInfoEle.find('input[name="first_name"]').val(userDetail['first_name'] || '');
            tabInfoEle.find('input[name="last_name"]').val(userDetail['last_name'] || '');
            tabInfoEle.find('input[name="email"]').val(userDetail['email'] || '');
            tabInfoEle.find('input[name="phone"]').val(userDetail['phone'] || '');
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
        let data = dobData ? moment(dobData).format('DD/MM/YYYY') : null;
        EmployeeLoadPage.dobEle.dateRangePickerDefault({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: true,
            minYear: 1901,
            maxYear: parseInt(moment().format('YYYY'), 10),
            locale: {
                format: 'DD/MM/YYYY'
            },
        })
            .val(data)
            .on('hide.daterangepicker', function () {
                $(this).val($(this).val().split(" ")[0])
            });
    }

    static loadDateJoined(dateJoinedData, default_is_now = false) {
        let dtPickerEle = EmployeeLoadPage.dateJoinedEle.dateRangePickerDefault({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: true,
            minYear: 1901,
            maxYear: parseInt(moment().format('YYYY'), 10),
            locale: {
                format: 'DD/MM/YYYY'
            },
        });

        if (dateJoinedData || default_is_now === true){
            let txtDateJoinedData = dateJoinedData ? moment(dateJoinedData).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY');
            dtPickerEle.val(txtDateJoinedData).on('hide.daterangepicker', function () {
                $(this).val($(this).val().split(" ")[0])
            });
        } else {
            dtPickerEle.val("");
        }
    }

    static combinesForm(frmIdx, hasPermit = true) {
        let frm = new SetupFormSubmit($(frmIdx));
        // if (hasPermit === true) frm.dataForm['permission_by_configured'] = new HandlePermissions().combinesData()['data'];
        frm.dataForm['is_active'] = frm.dataForm['is_active'] === 'on';
        frm.dataForm['is_admin_company'] = frm.dataForm['is_admin_company'] === 'on';
        // frm.dataForm['plan_app'] = new HandlePlanApp().combinesData();
        let dateJoinedTxt = $('#employee-date-joined').val();
        frm.dataForm['date_joined'] = dateJoinedTxt ? moment(dateJoinedTxt).format('YYYY-MM-DD HH:mm:ss') : null;
        let dateOfBirthday = $('#employee-dob').val();
        frm.dataForm['dob'] = dateOfBirthday ? moment(dateOfBirthday).format('YYYY-MM-DD') : null;
        frm.dataForm['role'] = EmployeeLoadPage.roleSelectEle.val()

        if (!frm.dataForm['user']) frm.dataForm['user'] = null;
        if (!frm.dataForm['group']) frm.dataForm['group'] = null;

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
        };
    }
}
