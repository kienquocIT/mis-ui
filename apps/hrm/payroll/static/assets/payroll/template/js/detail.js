$(document).ready(function(){
    const $formElm = $('#payroll_template_form')

    // get detail request info
    $.fn.callAjax2({
        'url': $formElm.attr('data-url-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            if (data.system_status >= 2) $('#idxRealAction').remove();
            new PayrollTemplateCommon()

            $('#ipt_title').val(data.title)
            let htmlLst = ''
            for (let item of data?.['department_applied_data']){
                htmlLst += `<option value="${item.id}" selected>${item.title}</option>`
            }
            $('#select-apply-for').append(htmlLst).initSelect2()
            $('#ipt_remarks').append(data.remarks)
            $('#tbl_attribute_list').DataTable().rows.add(data.attribute_list).draw()
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
    $('#formula-save').prop('disabled', true)
})