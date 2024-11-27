$(document).ready(function () {

    EmployeeHRMInit.loadUserList();
    EmployeeHRMInit.loadEmpList();
    EmployeeHRMInit.loadDate($('#employee-dob'));
    EmployeeHRMInit.loadDate($('#employee-date-joined'));
    EmployeeHRMInit.loadDate($('#employee-doi'));

    EmployeeHRMInit.loadPOI($('#employee-pob'));
    EmployeeHRMInit.loadNationality();
    EmployeeHRMInit.loadPOI($('#employee-poo'));
    EmployeeHRMInit.switchChoice();
    EmployeeHRMInit.loadBank();

    // run tinyMCE
    const contract_edt = new editor_handle();
    const _clsContract = new contract_data()
    contract_edt.init()

    // load tab contract
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});
    EmployeeHRMInit.loadDate($('#effected_date'));
    EmployeeHRMInit.loadDate($('#expired_date'));
    EmployeeHRMInit.loadDate($('#signing_date'));

    SetupFormSubmit.validate(
        $('#frm_employee_hrm'),
        {
            submitHandler: function (form) {
                let employeeData = {};
                const serializerArray = SetupFormSubmit.serializerObject(form)
                for (let key in serializerArray) {
                    const item = serializerArray[key]
                    if (item) employeeData[key] = item
                }
                let contract = _clsContract.valid_data()
                if (contract) employeeData.contract = contract
                employeeData.last_name = `${serializerArray.last_name} ${serializerArray['middle_name']}`
                if ($('.select-wrap').hasClass('is-select')) delete employeeData['employee_create']
                else delete employeeData.employee
                $.fn.callAjax2({
                    url: form.attr('data-url'),
                    method: 'post',
                    data: employeeData,
                    isLoading: true,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success');
                        $(form)[0].reset();
                        setTimeout(() => {
                            window.location.href = $(form).attr('data-url-redirect');
                        }, 1000);
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        }
    );
});