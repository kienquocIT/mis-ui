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

    EmployeeHRMInit.loadDetail();
})