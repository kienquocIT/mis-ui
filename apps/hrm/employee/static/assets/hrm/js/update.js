$(document).ready(function () {
    EmployeeHRMInit.loadUserList();
    EmployeeHRMInit.loadEmpList();
    EmployeeHRMInit.loadDate($('#employee-dob'));
    EmployeeHRMInit.loadDate($('#date_joined'));
    EmployeeHRMInit.loadDate($('#employee_doi'));

    EmployeeHRMInit.loadPOI($('#employee-pob'));
    EmployeeHRMInit.loadNationality();
    EmployeeHRMInit.loadPOI($('#employee-poo'));
    EmployeeHRMInit.switchChoice();
    EmployeeHRMInit.loadBank();


    EmployeeHRMInit.loadDetail();

    // load tab contract
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});
    EmployeeHRMInit.loadDate($('#effected_date'));
    EmployeeHRMInit.loadDate($('#expired_date'));
    EmployeeHRMInit.loadDate($('#signing_date'));

    const _clsContract = new contract_data()
    const _editor = new editor_handle()
    $(document).on('detail.DetailLoaded', () =>{
        _clsContract.load_list()
        _editor.init()
    })

    // handle form SUBMIT
    SetupFormSubmit.validate(
        $('#frm_employee_hrm'),
        {
            submitHandler: function (form) {

                let employeeData = {};
                const serializerArray = SetupFormSubmit.serializerObject(form);
                for (let key in serializerArray) {
                    const item = serializerArray[key]
                    if (item) employeeData[key] = item
                }
                let contract = _clsContract.valid_data()
                if (contract) employeeData.contract = contract
                employeeData.last_name = `${serializerArray.last_name} ${serializerArray['middle_name']}`
                $.fn.callAjax2({
                    url: form.attr('data-hrm-update'),
                    method: 'put',
                    data: employeeData,
                    isLoading: true,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        $(form)[0].reset();
                        setTimeout(() => {
                            window.location.replace($(form).attr('data-url-redirect'));
                        }, 1000)
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        }
    );
})