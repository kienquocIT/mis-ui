$(document).ready(function () {
    //
    const emailGroup$ = $('#email-authenticate');
    const formGetOtp$ = emailGroup$.find('form#form-email-get-otp');
    const formVerifyOtp$ = emailGroup$.find('form#form-email-verify-otp');

    let interval;

    const getOtpValidator = formGetOtp$.validateB({
        onsubmit: true,
        submitHandler: function (form, event) {
            event.preventDefault();

            if (interval) clearInterval(interval);

            const btnSubmit$ = formGetOtp$.find('button[type=submit]');
            btnSubmit$.addClass('active').prop('disabled', true);
            const data = $.fn.formSerializerObject($(form));
            const email = data?.email;
            if (email) {
                $.fn.formCallAjax({
                    url: formGetOtp$.attr('data-url'),
                    method: 'POST',
                    data: {
                        ...data,
                    }
                }).then(
                    resp => {
                        btnSubmit$.removeClass('active').prop('disabled', false);
                        let data = resp?.['data'] || {};
                        if (data && typeof data === 'object' && data.hasOwnProperty('id')) {
                            const id = data['id'];
                            const dateExpires = data['otp_expires'];
                            if (id && dateExpires) {
                                formVerifyOtp$.find('input[name=id]').val(id);
                                formVerifyOtp$.find('input[name=email]').val(email);

                                const eleCountDown$ = $('#idx-count-down');
                                const dateExpiresToDate = new Date(new Date(dateExpires + "+07:00").toUTCString());
                                const dateNow = new Date();
                                let countdown = Number.parseInt((dateExpiresToDate.getTime() - dateNow.getTime()) / 1000);
                                eleCountDown$.css('color', 'blue').text(countdown);
                                interval = setInterval(
                                    () => {
                                        if (countdown > 0){
                                            if (countdown <= 5){
                                                eleCountDown$.css('color', '#ff0000')
                                            } else if (countdown < 30){
                                                eleCountDown$.css('color', '#ff9100')
                                            }
                                            countdown = countdown - 1;
                                            eleCountDown$.text(countdown);
                                        } else {
                                            clearInterval(interval);
                                        }
                                    },
                                    1000
                                )
                            }
                        }
                    },
                    errs => {
                        if (interval) clearInterval(interval);
                        btnSubmit$.removeClass('active').prop('disabled', false);
                        getOtpValidator.showErrors(errs);
                    },
                )
            } else {
                if (interval) clearInterval(interval);
                btnSubmit$.removeClass('active').prop('disabled', false);
                getOtpValidator.showErrors({
                    email: $.fn.formGettext('This field is required')
                });
            }
        }
    })

    const verifyValidator = formVerifyOtp$.validateB({
        onsubmit: true,
        submitHandler: function (form, event) {
            event.preventDefault();
            const btnSubmit$ = formVerifyOtp$.find('button[type=submit]');
            btnSubmit$.addClass('active').prop('disabled', true);

            const data = $.fn.formSerializerObject($(form));
            if (data?.['email'] && data?.['id'] && data?.['otp']) {
                $.fn.formCallAjax({
                    url: formVerifyOtp$.attr('data-url'),
                    method: 'PUT',
                    data: {
                        ...data,
                    }
                }).then(
                    resp => {
                        btnSubmit$.removeClass('active').prop('disabled', false);
                        if (interval) clearInterval(interval);
                        $.fn.formNotify(
                            $.fn.formGettext('Verification complete!'),
                            'success'
                        )
                        setTimeout(
                            () => {
                                $.fn.formNotify(
                                    $.fn.formGettext("You'll be taken to the form shortly."),
                                    'info'
                                )
                                const urlNext = new URL(window.location.href).searchParams.get('next');
                                if (urlNext) setTimeout(
                                    () => window.location.href = urlNext,
                                    1500
                                )
                            },
                            500
                        )
                    },
                    errs => {
                        console.log(errs);
                        btnSubmit$.removeClass('active').prop('disabled', false);
                        verifyValidator.showErrors(errs);
                    },
                )
            } else {
                btnSubmit$.removeClass('active').prop('disabled', false);
                let errors = {};
                if (!data?.['email']) errors['email'] = $.fn.formGettext('This field is required');
                if (!data?.['id']) errors['id'] = $.fn.formGettext('This field is required');
                if (!data?.['otp']) errors['otp'] = $.fn.formGettext('This field is required');
                if (errors) verifyValidator.showErrors(errors);
            }
        }
    })
})