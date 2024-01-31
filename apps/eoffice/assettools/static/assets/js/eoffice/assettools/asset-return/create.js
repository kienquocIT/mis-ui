$(document).ready(function () {
    // handle submit function
    let $FormElm = $('#asset_return_form')
    SetupFormSubmit.validate($FormElm, {
        rules: {
            title: {
                required: true,
            },
            employee_inherit: {
                required: true,
            },
            products: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});