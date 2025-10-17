$(document).ready(async function() {
    WFRTControl.setWFInitialData('servicequotation');
    await ServiceOrderPageHandler.initializeCommonData();
    await ServiceOrderPageHandler.loadServiceOrderData($('#form-update-service-quotation').attr('data-url'), false);
    ServiceOrderPageHandler.initializeComponents(false)
    ServiceOrderPageHandler.registerCommonEventHandlers()
    ServiceOrderPageHandler.setupFormSubmit('#form-update-service-quotation')
    ServiceOrderPageHandler.setupIndicatorCanvas('#form-update-service-quotation')
});