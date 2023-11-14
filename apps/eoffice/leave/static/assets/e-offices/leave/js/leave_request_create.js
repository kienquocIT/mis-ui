const $FormElm = $('#leave_create')

$(document).ready(function () {
    const $EmpElm = $('#selectEmployeeInherit')

    // load datepicker for request date
    $('#inputRequestDate').daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        locale: {
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
    })

    // I. first of all load employee inherit dropdown, prepare for available list and detail tab list
    const dataEmp = JSON.parse($('#employee_current').text())
    $EmpElm.attr('data-onload', JSON.stringify({
        'id': dataEmp.id,
        'full_name': dataEmp.full_name,
        'first_name': dataEmp.first_name,
        'last_name': dataEmp.last_name
    })).initSelect2().on('select2:select', function () {
        $('#leave_detail_tbl').DataTable().clear().draw()
        TabAvailable.$tableElm.DataTable().ajax.reload()
    });

    // II. wait until dropdown employee inherit init loaded then trigger element
    // after trigger employee loaded common func will be run next function
    const awEmp = setInterval(function () {
        if ($EmpElm.hasClass("select2-hidden-accessible")) {
            // Select2 has been initialized
            clearInterval(awEmp)
            $EmpElm.trigger('Employee.Loaded')
        }
    }, 200)

    // form submit
    SetupFormSubmit.validate($FormElm,{
        rules: {
            title: {
                required: true,
            },
            request_date: {
                required: true,
            },
            employee_inherit: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
})