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

    // init contract
    EmployeeHRMInit.loadDate($('#effected_date'));
    EmployeeHRMInit.loadDate($('#expired_date'));
    EmployeeHRMInit.loadDate($('#signing_date'));

    const _clsContract = new contract_data()
    const _editor = new editor_handle()
    const runtime = new PrepareSign()
    $(document).on('detail.DetailLoaded', () =>{
        _clsContract.load_list()
        _editor.init()
        runtime.init()
    })

})