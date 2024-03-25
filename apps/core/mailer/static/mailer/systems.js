$(document).ready(function () {
    let tab$ = $('#tabSystem');
    tab$.find('.btnShowInfo').on('click', function () {
        $(this).closest('.parentGroupInfo').find('.groupInfo').animate({
            height: "toggle",
            opacity: "toggle",
        })
    })
    tab$.find('.btnCollapseGroup').on('click', function () {
        $(this).find('i').toggleClass('rotate-90deg');
        $(this).siblings('button[type=submit]').prop('disabled', (i, v) => !v);
        let groupCollapse$ = $(this).closest('.parentGroupInfo').find('.groupCollapseData');
        groupCollapse$.animate({
            height: "toggle",
            opacity: "toggle"
        });
        groupCollapse$.find('form').each(function () {
            if (!$(this).attr('data-loaded')) {
                let frm$ = $(this);
                $(frm$).attr('data-loaded', true);

                $.fn.callAjax2({
                    url: $(this).attr('data-url-get'),
                    method: 'GET',
                    isLoading: true,
                    sweetAlertOpts: {'allowOutsideClick': true},
                }).then(
                    resp => {
                        let data = $.fn.switcherResp(resp);
                        if (typeof data === 'object' && data.hasOwnProperty('mailer_system')) {
                            let mailerSystem = data['mailer_system'];
                            //
                            let textarea$ = $(frm$).find('textarea[name=contents]');
                            MailerTinymceControl.init_tinymce_editable(textarea$, mailerSystem.contents, {
                                url: $(frm$).attr('data-url-params'),
                                system_code: $(frm$).attr('data-system-code'),
                                application_id: null,
                            }, {
                                templates: JSON.parse(
                                    $(frm$).find('script[type="application/json"]').text()
                                ).map(
                                    (item) => {
                                        item.url = staticStart + item.url;
                                        return item;
                                    }
                                ),
                            });
                            //
                            let active$ = $(frm$).find('input[name=is_active]');
                            active$.prop('checked', mailerSystem.is_active);
                            // subject
                            let subject$ = $(frm$).find('input[name=subject]');
                            subject$.val(mailerSystem.subject)
                            //
                            $(frm$).attr('data-url', $(frm$).attr('data-url').replaceAll('__pk__', mailerSystem.id));

                            new SetupFormSubmit($(frm$)).validate({
                                submitHandler: function (form, event) {
                                    let frmSetup = new SetupFormSubmit($(form));
                                    frmSetup.dataForm['is_active'] = $(form).find('input[name=is_active]').prop('checked');
                                    $.fn.callAjax2({
                                        url: frmSetup.dataUrl,
                                        method: frmSetup.dataMethod,
                                        data: frmSetup.dataForm,
                                    }).then(
                                        resp => {
                                            let data = $.fn.switcherResp(resp);
                                            if (data) {
                                                $.fn.notifyB({
                                                    'description': $.fn.gettext('Success'),
                                                }, 'success');
                                            }
                                        },
                                        errs => $.fn.switcherResp(errs),
                                    )
                                }
                            })
                        }
                    },
                    errs => $.fn.switcherResp(errs),
                )
            }
        })
    });
})