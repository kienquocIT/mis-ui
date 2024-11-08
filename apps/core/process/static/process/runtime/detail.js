$(document).ready(function () {
    const target$ = $("#process-runtime-detail");
    const stagesAllHead$ = target$.find('.stages-all-head-items');
    const frm$ = $('#form-process');

    $.fn.callAjax2({
        url: target$.data('url'),
        method: 'GET',
        isLoading: true,
    }).then(
        resp => {
            stagesAllHead$.empty();
            const detailData = $.fn.switcherResp(resp);
            if (detailData) {
                const processDetail = detailData?.['process_runtime_detail'] || {};
                frm$.find(':input[name=title]').val(processDetail?.['title'] || '');
                frm$.find(':input[name=remark]').val(processDetail?.['remark'] || '');

                const linkProcessConfig$ = $('#link-process-config');
                linkProcessConfig$.attr('href', linkProcessConfig$.attr('href').replaceAll(
                    '__pk__',
                    processDetail?.['config']?.['id'] || ''
                )).show(0);

                const oppData = processDetail?.['opp'];
                const opp$ = frm$.find(':input[name=opp]');
                const oppLink$ = opp$.siblings('.form-text');
                if (oppData){
                    opp$.val(oppData?.['title'] || '');
                    oppLink$.attr('href',  oppLink$.attr('href').replaceAll('__pk__', oppData?.['id']))
                } else {
                    oppLink$.hide(0);
                }

                const clsProcess = new ProcessStages(
                    target$,
                    processDetail,
                    {
                        'debug': true,
                        'enableAppInfoShow': true,
                        'enableAppControl': true,
                        'enableStagesInfoShow': true,
                    },
                );
                clsProcess.init();
            }
        },
        errs => $.fn.switcherResp(errs),
    )
})