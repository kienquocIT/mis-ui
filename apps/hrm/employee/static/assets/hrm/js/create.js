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
                        $.fn.notifyB({description: data.message}, 'success')
                        setTimeout(() => {
                            window.location.href = $(form).attr('data-url-redirect');
                        }, 1000)
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        }
    );
});