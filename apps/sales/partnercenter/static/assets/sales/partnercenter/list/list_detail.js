$(document).ready(function () {
    let partnerCenterListHandlerInstance = new PartnerCenterListHandler()

    partnerCenterListHandlerInstance.fetchData(true)
    partnerCenterListHandlerInstance.addEventBinding()
    partnerCenterListHandlerInstance.setUpFormSubmit()
})