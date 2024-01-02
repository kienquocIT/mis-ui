$(document).ready(function () {
    // handle submit function
    let $FormElm = $('#asset_provide_form')
    SetupFormSubmit.validate($FormElm, {
        rules: {
            title: {
                required: true,
            },
            date: {
                required: true,
            },
            employee_inherit: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});