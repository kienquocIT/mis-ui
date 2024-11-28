$(document).ready(function () {
    const processSetup$ = $('#process-config');

    const clsProcess = new ProcessStages(processSetup$, ProcessStages.defaultProcessData, {
        'debug': true,
        'enableEdit': true,
        'applicationList': [],
    },);
    clsProcess.init();

    function loadNewApplication(params) {
        $.fn.callAjax2({
            url: processSetup$.data('url-app') + '?' + $.param({
                'allow_process': true,
                'pageSize': '-1',
                ...params,
            }),
            method: 'GET',
            isLoading: true,
            loadingOpts: {
                'html': $.fn.gettext('Applications loading...'),
            },
        }).then(resp => {
            const appData = $.fn.switcherResp(resp);
            if (appData) {
                clsProcess.applicationList = appData['tenant_application_list'] || [];
                clsProcess.setApplicationDict();
                clsProcess.reloadNewAppToSelect();
                clsProcess.checkExistDataWithApplication();
            }
        })
    }

    const frm$ = $('#frm-process-create');
    frm$.find('input[name=apply_start]').flatpickr({
        'allowInput': true,
        'altInput': true,
        'enableTime': true,
        'altFormat': 'l, j-m-Y H:i',
        'dateFormat': 'Y-m-d H:i',
        'locale': globeLanguage === 'vi' ? 'vn' : 'default',
        'shorthandCurrentMonth': true,
    })
    frm$.find('input[name=apply_finish]').flatpickr({
        'allowInput': true,
        'altInput': true,
        'enableTime': true,
        'altFormat': 'l, j-m-Y H:i',
        'dateFormat': 'Y-m-d H:i',
        'locale': globeLanguage === 'vi' ? 'vn' : 'default',
        'shorthandCurrentMonth': true,
    })
    frm$.find('input[name=for_opp]').on('change', function(){
        loadNewApplication($(this).prop('checked') ? {
            'allow_opportunity': true,
        } : {});
    }).trigger('change');
    new SetupFormSubmit(frm$).validate({
        submitHandler: function (form, event) {
            const frm = new SetupFormSubmit($(form));
            const config = clsProcess.getFullConfig();
            if (config) {
                $.fn.callAjax2({
                    url: $(form).data('url'),
                    method: 'POST',
                    data: {
                        ...frm.dataForm,
                        'apply_start': frm.dataForm?.['appy_start'] ? frm.dataForm['appy_start'] : null,
                        'apply_finish': frm.dataForm?.['apply_finish'] ? frm.dataForm['apply_finish'] : null,
                        ...config,
                    },
                    isLoading: true,
                    isNotify: true,
                    areaControl: frm$.add($('#modalStageConfig')),
                }).then(resp => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                        setTimeout(() => window.location.href = $(form).data('url-redirect'), 1000)
                    }
                }, errs => {
                })
            }
        },
    })
})