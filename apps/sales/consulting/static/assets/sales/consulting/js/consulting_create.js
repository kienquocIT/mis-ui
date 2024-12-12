$(document).ready(function () {
     WFRTControl.setWFInitialData('consulting')

    let formSubmit = $('#form_consulting_create')
    let transScript = $('#trans-script')


    let consultingInstance = new ConsultingHandler()
    consultingInstance.fetchDataSelect(
        consultingInstance.customerSelect,
        {
                keyResp: 'consulting_account_list',
                keyId: 'id',
                keyText: 'name'
            })
    console.log(consultingInstance.customerSelect)
    consultingInstance.initDateField(consultingInstance.consultingDate)
    consultingInstance.initTableProductCategories(consultingInstance.tableProductCategories,
        [{
            'order': 1,
            'title': 'aaa',
        }])
    consultingInstance.handleAddProductCategory(consultingInstance.btnAddProductCategory)
})