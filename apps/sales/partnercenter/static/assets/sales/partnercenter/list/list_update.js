$(document).ready(function () {
    let partnerCenterListHandlerInstance = new PartnerCenterListHandler()

    partnerCenterListHandlerInstance.fetchData(false)
    partnerCenterListHandlerInstance.addEventBinding()
    partnerCenterListHandlerInstance.setUpFormSubmit()
})