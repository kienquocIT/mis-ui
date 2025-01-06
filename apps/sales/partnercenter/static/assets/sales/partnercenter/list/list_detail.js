$(document).ready(function () {
    partnerCenterListHandlerInstance = new PartnerCenterListHandler()

    partnerCenterListHandlerInstance.fetchData(true)
    partnerCenterListHandlerInstance.addEventBinding()
    partnerCenterListHandlerInstance.setUpFormSubmit()
})