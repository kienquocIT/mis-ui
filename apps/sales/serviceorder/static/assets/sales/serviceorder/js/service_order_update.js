$(document).ready(async function() {
    WFRTControl.setWFInitialData('serviceorder');
    WindowControl.showLoading()
    await ServiceOrderPageHandler.initializeCommonData();
    await ServiceOrderPageHandler.loadServiceOrderData($('#form-update-service-order').attr('data-url'), false);
    WindowControl.hideLoading()
    ServiceOrderPageHandler.initializeComponents(false)
    ServiceOrderPageHandler.registerCommonEventHandlers()
    ServiceOrderPageHandler.setupFormSubmit('#form-update-service-order')
    ServiceOrderPageHandler.setupIndicatorCanvas('#form-update-service-order')
});