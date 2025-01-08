$(document).ready(function () {
    partnerCenterListHandlerInstance = new PartnerCenterListHandler()

    partnerCenterListHandlerInstance.fetchData(false)
    partnerCenterListHandlerInstance.addEventBinding()
    partnerCenterListHandlerInstance.setUpFormSubmit()
})