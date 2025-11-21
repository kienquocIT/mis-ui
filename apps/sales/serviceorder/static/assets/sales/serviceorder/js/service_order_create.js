$(document).ready(async function() {
    function initializeBastionFields() {
        const params = $x.fn.getManyUrlParameters([
            'opp_id', 'opp_title', 'opp_code',
            'inherit_id', 'inherit_title',
            'customer_id', 'customer_code', 'customer_title'
        ]);
        if (params.opp_id) {
            new $x.cls.bastionField({
                data_opp: $x.fn.checkUUID4(params.opp_id) ? [{
                    id: params.opp_id,
                    title: $x.fn.decodeURI(params.opp_title),
                    code: $x.fn.decodeURI(params.opp_code),
                    selected: true
                }] : [],
                data_inherit: $x.fn.checkUUID4(params.inherit_id) ? [{
                    id: params.inherit_id,
                    full_name: params.inherit_title,
                    selected: true
                }] : []
            }).init();
            ServiceOrderPageHandler.loadCustomerList([{
                id: params.customer_id,
                code: params.customer_code,
                name: params.customer_title
            }]);

        } else {
            new $x.cls.bastionField().init();
        }
    }

    WFRTControl.setWFInitialData('serviceorder');
    WindowControl.showLoading()
    await ServiceOrderPageHandler.initializeCommonData();
    WindowControl.hideLoading()
    ServiceOrderPageHandler.initializeComponents(true)
    ServiceOrderPageHandler.registerCommonEventHandlers()
    ServiceOrderPageHandler.setupFormSubmit('#form-create-service-order')
    ServiceOrderPageHandler.setupIndicatorCanvas('#form-create-service-order')
    ServiceOrderPageHandler.initializeTables();

    initializeBastionFields()
});