$(document).ready(function(){
    WFRTControl.setWFInitialData('assettoolsreturn')
    const $formElm = $('#asset_return_form')
    // get detail request info
    $.fn.callAjax2({
        'url': $formElm.attr('data-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)
            $x.fn.renderCodeBreadcrumb(data);
            $('#titleInput').val(data.title)
            $('#dateCreatedInput').val($x.fn.reformatData(data.date_return, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#remarkInput').val(data.remark)
            $('#SystemStatusInput').val(JSON.parse($('#sys_stt').text())[data.system_status][1])

            $('#selectEmployeeInherit').attr('data-onload', JSON.stringify({
                ...data.employee_inherit,
                selected: true
            })).html(`<option value="${data.employee_inherit.id}" selected>${data.employee_inherit.full_name}</option>`).trigger('change')
            AssetReturnProductList.init(data.products)
            if (data.attachments) {
                const fileDetail = $.map(data.attachments, function(item){
                    return item?.['files']
                })
                FileUtils.init($(`[name="attachments"]`).siblings('button'), fileDetail);
            }
            if (data.system_status >= 2) $('#idxRealAction').remove()
            // load attachments
            new $x.cls.file(
                $('#attachment')
            ).init({
                enable_edit: false,
                data: data.attachments,
            })
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )

    // handle submit function
    SetupFormSubmit.validate($formElm, {
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});