$(document).ready(function () {
    WFRTControl.setWFInitialData('consulting')
    let consultingInstance = new ConsultingHandler()
    consultingInstance.fetchDataSelect(
        consultingInstance.customerSelect,
        {
                keyResp: 'consulting_account_list',
                keyId: 'id',
                keyText: 'name'
            })
    console.log(consultingInstance.customerSelect)
    consultingInstance.initAttachment()
    consultingInstance.initDateField(consultingInstance.consultingDate)
    consultingInstance.initTableProductCategories(consultingInstance.tableProductCategories,[], consultingInstance.consultingValue)
    consultingInstance.handleAddProductCategory(consultingInstance.btnAddProductCategory, consultingInstance.tableProductCategories)
    consultingInstance.initAbstractField('')
    consultingInstance.handleDeleteProductCategory(consultingInstance.tableProductCategories, consultingInstance.consultingValue)
    consultingInstance.initTableMasterDataDoc(consultingInstance.tableMasterDoc)
    consultingInstance.handleAddNewRowManualDoc(consultingInstance.btnAddManualDoc, this.tableManualDoc)
    consultingInstance.initTableManualDataDoc(consultingInstance.tableManualDoc)
    consultingInstance.handleAddDoc(consultingInstance.btnAddDoc)
    consultingInstance.initTableDoc(consultingInstance.tableDoc, [], false)
    consultingInstance.handleAttachFile(consultingInstance.tableDoc,false)
    consultingInstance.handleDeleteDoc(consultingInstance.tableDoc, consultingInstance.tableMasterDoc, consultingInstance.tableManualDoc)
    consultingInstance.initOpp()
    consultingInstance.handleSubmitForm(consultingInstance.submitForm)
    consultingInstance.handleSelectOpp(consultingInstance.customerSelect, consultingInstance.opp)
    consultingInstance.handleOpenDocModal(consultingInstance.btnOpendocModal, consultingInstance.tableDoc)
})