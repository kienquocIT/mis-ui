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
                    const processId = process_detail?.['id'] || '';
                    const processTitle = process_detail?.['title'] || '';
                    const processRemark = process_detail?.['remark'] || '';
                    const forOpp = !!process_detail?.['for_opp'];
                    const isActive = !!process_detail?.['is_active'];

                    frm$.find('input[name=title]').val(processTitle);
                    frm$.find(':input[name=remark]').val(process_detail?.['remark'] || '');
                    frm$.find('input[name=apply_start]').val(process_detail?.['apply_start'] || '');
                    frm$.find('input[name=apply_finish]').val(process_detail?.['apply_finish'] || '');
                    frm$.find('input[name=is_active]').prop('checked', !!process_detail?.['is_active'] || '');
                    frm$.find('input[name=for_opp]').prop('checked', forOpp);

                    frm$.find(':input').prop('disabled', true);
                    frm$.find('input[name=apply_start]').flatpickr({
                        'allowInput': false,
                        'altInput': true,
                        'enableTime': true,
                        'altFormat': 'l, j-m-Y H:i',
                        'dateFormat': 'Y-m-d H:i',
                        'locale': globeLanguage === 'vi' ? 'vn' : 'default',
                        'shorthandCurrentMonth': true,
                    })
                    frm$.find('input[name=apply_finish]').flatpickr({
                        'allowInput': false,
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
                                        'enableAppInfoShow': true,
                                        'enableStagesInfoShow': true,
                                        'applicationList': appData['tenant_application_list'] || [],
                                    },
                                );
                                clsProcess.init();
                            }
                        },
                        errs => {

                        }
                    )

                    const btnStartProcess$ = $('#btn-start-process');
                    const btnStartProcessWithoutOpp$ = $('#btn-start-process-without-opp');
                    const modalStartProcess$ = $("#modalStartProcess");
                    const frmStartProcess$ = $('#frm-start-process-without-opp');

                    if (isActive === true) {
                        if (forOpp === true) {
                            btnStartProcess$.show(0);
                            const eleA$ = btnStartProcess$.closest('a');
                            eleA$.attr('href', eleA$.attr('href') + '?' + $.param({
                                'create__process': processId,
                                'create__process_name': processTitle
                            }))
                        } else {
                            btnStartProcessWithoutOpp$.show(0);
                            btnStartProcessWithoutOpp$.on('click', function () {
                                modalStartProcess$.find(':input[name=title]').val(processTitle);
                                modalStartProcess$.find(':input[name=remark]').val(processRemark);
                                modalStartProcess$.modal('show');
                            });

                            SetupFormSubmit.validate(frmStartProcess$, {
                                submitHandler: function (form, event) {
                                    event.preventDefault();
                                    const frm = new SetupFormSubmit($(form));
                                    $.fn.callAjax2({
                                        url: $(form).data('url'),
                                        method: 'POST',
                                        data: {
                                            'config': processId,
                                            ...frm.dataForm
                                        },
                                        isLoading: true,
                                    }).then(
                                        resp => {
                                            const data = $.fn.switcherResp(resp);
                                            if (data) {
                                                $.fn.notifyB({
                                                    'description': $.fn.gettext('Successful'),
                                                }, 'success');
                                                const process_runtime = data?.['process_runtime'];
                                                if (process_runtime && process_runtime.hasOwnProperty('id')) {
                                                    setTimeout(
                                                        () => {
                                                            window.location.href = $(form).data('url-redirect').replaceAll('__pk__', process_runtime['id']);
                                                        },
                                                        1000
                                                    )
                                                }
                                            }
                                        },
                                        errs => $.fn.switcherResp(errs),
                                    )
                                }
                            })
                        }
                    }
                }
            }
        },
        errs => $.fn.switcherResp(errs),
    )
})