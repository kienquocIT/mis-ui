$(document).ready(function () {
    const $formElm = $('#payroll_template_form')
    const $tblElm = $('#tbl_attribute_list')
    ComponentListController.init('.list_value_code')
    new PayrollTemplateCommon()

    // get detail request info
    $.fn.callAjax2({
        'url': $formElm.attr('data-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            if (data.system_status >= 2) $('#idxRealAction').remove();

            $('#ipt_title').val(data.title)
            FormElementControl.loadInitS2($('#select-apply-for'), data.department_applied_data);
            $('#ipt_remarks').val(data.remarks)
            $tblElm.DataTable().rows.add(data.attribute_list).draw()
        })
})