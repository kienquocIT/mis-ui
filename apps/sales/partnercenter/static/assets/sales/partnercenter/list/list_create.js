$(document).ready(function () {
    partnerCenterListHandlerInstance = new PartnerCenterListHandler()

    partnerCenterListHandlerInstance.fetchDataObject()
    partnerCenterListHandlerInstance.addEventBinding()
    partnerCenterListHandlerInstance.setUpFormSubmit()
})