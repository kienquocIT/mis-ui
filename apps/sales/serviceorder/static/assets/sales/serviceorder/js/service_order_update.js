$(document).ready(async function() {
    WFRTControl.setWFInitialData('serviceorder');
    WindowControl.showLoading()
    ServiceOrderPageHandler.initializeComponents(false)
    await ServiceOrderPageHandler.initializeCommonData();
    await ServiceOrderPageHandler.loadServiceOrderData($('#form-update-service-order').attr('data-url'), false);
    WindowControl.hideLoading()
    ServiceOrderPageHandler.registerCommonEventHandlers()
    ServiceOrderPageHandler.setupFormSubmit('#form-update-service-order')
    ServiceOrderPageHandler.setupIndicatorCanvas('#form-update-service-order')
});