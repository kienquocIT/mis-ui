$(document).ready(async function() {
    WFRTControl.setWFInitialData('servicequotation');
    WindowControl.showLoading()
    ServiceOrderPageHandler.initializeComponents(false)
    await ServiceOrderPageHandler.initializeCommonData();
    await ServiceOrderPageHandler.loadServiceOrderData($('#form-update-service-quotation').attr('data-url'), false, false);
    WindowControl.hideLoading()
    ServiceOrderPageHandler.registerCommonEventHandlers()
    ServiceOrderPageHandler.setupFormSubmit('#form-update-service-quotation')
    ServiceOrderPageHandler.setupIndicatorCanvas('#form-update-service-quotation')
});