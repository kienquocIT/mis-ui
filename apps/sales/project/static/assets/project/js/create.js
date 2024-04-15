$(document).ready(function(){

    // run date-pick
    $('.date-picker').daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        autoApply: true,
        locale: {
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
    });

    // run select
    $('#selectEmployeeInherit, #select_project_owner').each(function(){
        $(this).initSelect2()
    })
});