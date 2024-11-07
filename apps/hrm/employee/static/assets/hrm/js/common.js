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

class EmployeeHRMInit {

    static userSelectEle = $('#select-box-user');
    static empSelectEle = $('#select-box-employee');

    static dobEle = $('#employee-dob');
    static dateJoinedEle = $('#employee-date-joined');
    static firstNameEle = $('#employee-first-name');
    static lastNameEle = $('#employee-last-name');
    static emailEle = $('#employee-email');
    static phoneEle = $('#employee-phone');
    static isAdminEle = $('#idx_is_admin_company');
    static isActive = $('#is_active');

    static loadUserList(userData) {
        EmployeeHRMInit.userSelectEle.initSelect2({
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

    static loadEmpList(empData){
        EmployeeHRMInit.empSelectEle.initSelect2({
            allowClear: true,
            keyId: 'employee--id',
            keyText: 'employee--full_name',
            data: (empData ? {'employee': empData} : null),
        })
    }

    static loadDob(dobData) {
        EmployeeHRMInit.dobEle.flatpickr({
            'allowInput': true,
            'altInput': true,
            'altFormat': 'd/m/Y',
            'dateFormat': 'Y-m-d',
            'defaultDate': dobData || null,
            'locale': globeLanguage === 'vi' ? 'vn' : 'default',
            'shorthandCurrentMonth': true,
        })
    }

    static loadDateJoined(dateJoinedData) {
        EmployeeHRMInit.dateJoinedEle.flatpickr({
            'allowInput': true,
            'altInput': true,
            'altFormat': 'd/m/Y',
            'dateFormat': 'Y-m-d',
            'defaultDate': dateJoinedData || new Date(),
            'locale': globeLanguage === 'vi' ? 'vn' : 'default',
            'shorthandCurrentMonth': true,
        })
    }

    static combinesForm(frmIdx, hasPermit = true) {
        let frm = new SetupFormSubmit($(frmIdx));
        frm.dataForm['date_joined'] = moment(EmployeeHRMInit.dateJoinedEle.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['dob'] = EmployeeHRMInit.dobEle.val() ? moment(EmployeeHRMInit.dobEle.val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null
        if (!frm.dataForm['user']) frm.dataForm['user'] = null;

        frm.dataForm['email_app_password'] = $('#email-app-password').attr('data-value')

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
        };
    }
}
