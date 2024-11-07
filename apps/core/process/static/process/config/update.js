$(document).ready(function () {
    const processSetup$ = $('#process-config');
    const frm$ = $('#frm-process-update');

    $.fn.callAjax2({
        url: frm$.data('url'),
        method: 'GET',
        isLoading: true,
    }).then(
        resp => {
            const data = $.fn.switcherResp(resp);
            if (data) {
                const process_detail = data?.['process_detail'];
                if (process_detail) {
                    frm$.find('input[name=title]').val(process_detail?.['title'] || '');
                    frm$.find(':input[name=remark]').val(process_detail?.['remark'] || '');
                    frm$.find('input[name=apply_start]').val(process_detail?.['apply_start'] || '');
                    frm$.find('input[name=apply_finish]').val(process_detail?.['apply_finish'] || '');
                    frm$.find('input[name=is_active]').prop('checked', !!process_detail?.['is_active'] || '');
                    frm$.find('input[name=for_opp]').prop('checked', !!process_detail?.['for_opp'] || '');

                    frm$.find('input[name=apply_start]').flatpickr({
                        'allowInput': true,
                        'altInput': true,
                        'enableTime': true,
                        'altFormat': 'l, j-m-Y H:i',
                        'dateFormat': 'Y-m-d H:i',
                        'locale': globeLanguage === 'vi' ? 'vn' : 'default',
                        'shorthandCurrentMonth': true,
                    });
                    frm$.find('input[name=apply_finish]').flatpickr({
                        'allowInput': true,
                        'altInput': true,
                        'enableTime': true,
                        'altFormat': 'l, j-m-Y H:i',
                        'dateFormat': 'Y-m-d H:i',
                        'locale': globeLanguage === 'vi' ? 'vn' : 'default',
                        'shorthandCurrentMonth': true,
                    });

                    $.fn.callAjax2({
                        'url': frm$.data('url-app') + '?' + $.param({'pageSize': -1, 'allow_process': true}),
                    }).then(
                        resp => {
                            const appData = $.fn.switcherResp(resp);
                            if (appData) {
                                const clsProcess = new ProcessStages(
                                    processSetup$,
                                    process_detail,
                                    {
                                        'debug': false,
                                        'enableEdit': true,
                                        'applicationList': appData['tenant_application_list'] || [],
                                    },
                                );
                                clsProcess.init();
                                new SetupFormSubmit(frm$).validate({
                                    submitHandler: function (form, event) {
                                        const frm = new SetupFormSubmit($(form));
                                        const stages = clsProcess.getFullStages();
                                        if (stages){
                                            $.fn.callAjax2({
                                                url: $(form).data('url'),
                                                method: 'PUT',
                                                data: {
                                                    ...frm.dataForm,
                                                    'apply_start': frm.dataForm?.['appy_start'] ? frm.dataForm['appy_start'] : null,
                                                    'apply_finish': frm.dataForm?.['apply_finish'] ? frm.dataForm['apply_finish'] : null,
                                                    'stages': stages,
                                                }
                                            }).then(resp => {
                                                const data = $.fn.switcherResp(resp);
                                                if (data) {
                                                    $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                                                    setTimeout(
                                                        () => window.location.href = $(form).data('url-redirect'),
                                                        1000
                                                    )
                                                }
                                            }, errs => $.fn.switcherResp(errs))
                                        }
                                    },
                                })

                            }
                        },
                        errs => {

                        }
                    )
                }
            }
        },
        errs => $.fn.switcherResp(errs),
    )
})