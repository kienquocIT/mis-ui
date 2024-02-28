
$(document).ready(function () {

    // run select provide
    let $ProvideElm = $('#selectProvide')
    $ProvideElm.initSelect2({
        'templateResult': renderTemplateResult
    })
    // handle submit function
    let $FormElm = $('#asset_delivery_form')
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
            provide: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});