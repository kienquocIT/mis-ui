$(document).ready(function(){
    // get detail request info
    WFRTControl.setWFInitialData('assettoolsdelivery');
    $.fn.callAjax2({
        'url': $('#url-factory').attr('data-detail-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            $('#titleInput').val(data.title)
            $('#dateCreatedInput').val($x.fn.reformatData(data.date_created, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#remarkInput').val(data.remark)
            $('#SystemStatusInput').val(JSON.parse($('#sys_stt').text())[data.system_status][1])
            $('#inputEmployeeInheritor').val(data.employee_inherit.full_name)
                .attr('value', data.employee_inherit.id)

            const provide = {
                ...data.provide,
                selected: true,
            }
            $('#selectProvide').initSelect2({
                'data': provide,
                'templateResult': renderTemplateResult
            }).trigger({
                type: 'select2:select',
                params: {data: {data: provide}}
            })
            if (data.attachments) {
                const fileDetail = $.map(data.attachments, function(item){
                    return item?.['files']
                })
                FileUtils.init($(`[name="attachments"]`).siblings('button'), fileDetail);
            }

            DeliveryTableHandle.init(data.products)
            if (data.system_status >= 2) $('#idxRealAction').remove()

            // load attachments
            new $x.cls.file(
                $('#attachment')
            ).init({
                enable_edit: false,
                data: data.attachments,
            })
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
});