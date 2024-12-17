$(document).ready(function () {
    let formSubmit = $('#form_consulting_create');
    // call ajax get data detail
    $.fn.callAjax2({
        url: formSubmit.data('url'),
        method: 'GET',
        isLoading: true,
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                console.log(data)
                let consultingInstance = new ConsultingHandler()
                consultingInstance.fetchPageData(data, false)
                consultingInstance.handleAttachFile(consultingInstance.tableDoc, false)
                consultingInstance.initAttachment()
                consultingInstance.handleAddProductCategory(consultingInstance.btnAddProductCategory, consultingInstance.tableProductCategories)
                consultingInstance.handleDeleteProductCategory(consultingInstance.tableProductCategories, consultingInstance.consultingValue)
                consultingInstance.handleAddNewRowManualDoc(consultingInstance.btnAddManualDoc, this.tableManualDoc)
                consultingInstance.handleAddDoc(consultingInstance.btnAddDoc)
                consultingInstance.handleDeleteDoc(consultingInstance.tableDoc, consultingInstance.tableMasterDoc, consultingInstance.tableManualDoc)
                consultingInstance.handleSubmitForm(consultingInstance.submitForm)
                consultingInstance.handleSelectOpp(consultingInstance.customerSelect, consultingInstance.opp)
                consultingInstance.handleOpenDocModal(consultingInstance.btnOpendocModal, consultingInstance.tableDoc)
            }
        }
    )
});
