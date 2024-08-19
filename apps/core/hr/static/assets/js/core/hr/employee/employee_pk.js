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
            if (selectedVal){
                let dataBackup = SelectDDControl.get_data_from_idx($(this), selectedVal);

                let userDetail = dataBackup?.['user'] || {};
                let tabInfoEle = $('#tab-info');

                tabInfoEle.find('input[name="first_name"]').val(userDetail['first_name'] || '');
                tabInfoEle.find('input[name="last_name"]').val(userDetail['last_name'] || '');
                tabInfoEle.find('input[name="email"]').val(userDetail['email'] || '');
                tabInfoEle.find('input[name="phone"]').val(userDetail['phone'] || '');
            }
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
        let data = $x.fn.reformatData(dobData, $x.cls.datetime.defaultFormatDate, 'DD/MM/YYYY', '');
        EmployeeLoadPage.dobEle.daterangepicker({
            drops: 'up',
            singleDatePicker: true,
            timePicker: false,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            maxYear: parseInt(moment().format('YYYY')),
            locale: {
                format: 'DD/MM/YYYY'
            },
            "cancelClass": "btn-secondary",
        }).val(data).trigger('change');
    }

    static loadDateJoined(dateJoinedData, default_is_now = false) {
        let dtPickerEle = EmployeeLoadPage.dateJoinedEle.daterangepicker({
            drops: 'up',
            singleDatePicker: true,
            timePicker: false,
            showDropdowns: true,
            autoApply: true,
            autoUpdateInput: false,
            maxYear: parseInt(moment().format('YYYY')),
            locale: {
                format: 'DD/MM/YYYY hh:mm A'
            },
            "cancelClass": "btn-secondary",
        });

        let data = '';
        if (dateJoinedData || default_is_now === true) {
            data = $x.fn.reformatData(dateJoinedData, $x.cls.datetime.defaultFormatDate, 'DD/MM/YYYY hh:mm A', moment().format('DD/MM/YYYY hh:mm A'));
        }
        dtPickerEle.val(data).trigger('change')
    }

    static combinesForm(frmIdx, hasPermit = true) {
        let frm = new SetupFormSubmit($(frmIdx));
        // if (hasPermit === true) frm.dataForm['permission_by_configured'] = new HandlePermissions().combinesData()['data'];
        // frm.dataForm['is_active'] = frm.dataForm['is_active'] === 'on';
        // frm.dataForm['is_admin_company'] = frm.dataForm['is_admin_company'] === 'on';
        // frm.dataForm['plan_app'] = new HandlePlanApp().combinesData();
        frm.dataForm['date_joined'] = moment($('#employee-date-joined').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['dob'] = $('#employee-dob').val() ? moment($('#employee-dob').val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        frm.dataForm['role'] = EmployeeLoadPage.roleSelectEle.val()

        if (!frm.dataForm['user']) frm.dataForm['user'] = null;
        if (!frm.dataForm['group']) frm.dataForm['group'] = null;

        frm.dataForm['email_app_password'] = $('#email-app-password').attr('data-value')

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
        };
    }
}
