$(document).ready(async function() {
    WFRTControl.setWFInitialData('serviceorder');
    await ServiceOrderPageHandler.initializeCommonData();
    await ServiceOrderPageHandler.loadServiceOrderData($('#form-update-service-order').attr('data-url'), false);
    ServiceOrderPageHandler.initializeComponents(false)
    ServiceOrderPageHandler.registerCommonEventHandlers()
    ServiceOrderPageHandler.setupFormSubmit('#form-update-service-order')
    ServiceOrderPageHandler.setupIndicatorCanvas('#form-update-service-order')
});