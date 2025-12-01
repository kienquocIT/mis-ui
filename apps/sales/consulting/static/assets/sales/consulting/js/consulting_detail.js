$(document).ready(function () {
    let formSubmit = $('#form_consulting_create');
    $.fn.callAjax2({
        url: formSubmit.data('url'),
        method: 'GET',
        isLoading: true,
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $x.fn.renderCodeBreadcrumb(data)
                $.fn.compareStatusShowPageAction(data)
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
                let consultingClassInstance = new ConsultingHandler()
                consultingClassInstance.fetchPageData(data, true)
                consultingClassInstance.disableFields([
                    consultingClassInstance.consultingName,
                    consultingClassInstance.consultingDate,
                    consultingClassInstance.btnOpendocModal,
                    consultingClassInstance.btnAddProductCategory,
                    consultingClassInstance.remark,
                    consultingClassInstance.customerSelect
                ])
                consultingClassInstance.handleAttachFile(consultingClassInstance.tableDoc, true)
            }
        }
    )
});
