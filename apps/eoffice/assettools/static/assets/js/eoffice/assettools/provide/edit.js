$(document).ready(function(){
    WFRTControl.setWFInitialData('assettoolsprovide')
    // get detail request info
    $.fn.callAjax2({
        'url': $('#url-factory').attr('data-detail-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $('#titleInput').val(data.title)
            $('#dateCreatedInput').val($x.fn.reformatData(data.date_created, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#remarkInput').val(data.remark)
            $('#SystemStatusInput').val(JSON.parse($('#sys_stt').text())[data.system_status][1])
            data.employee_inherit.selected = true
            $('#selectEmployeeInherit').initSelect2({data:data.employee_inherit})
            ProductsTable.init(data.products)
            $('[name="employee_inherit_id"]').val(data.employee_inherit.id)
            if (data.system_status >= 2) $('#idxRealAction').remove()

            // load attachments
            new $x.cls.file(
                $('#attachment')
            ).init({
                name: 'attachments',
                enable_edit: true,
                data: data.attachments,
            })
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )

    // handle submit function
    let $FormElm = $('#asset_provide_form')
    SetupFormSubmit.validate($FormElm, {
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});