class AdvanceFilterRevenueCommonHandler extends AdvanceFilterCommonHandler{
    constructor() {
        super();
        this.$url = $('#app-url-factory')
        this.CONTENT_TYPE_MAPPING_URL = {
            "saledata.account": {
                "url": $('#app-url-factory').data('account-list'),
                "keyResp": "account_list",
                "keyText": "title"
            },
        }
    }

    getPropUrl() {
        return this.$url.data('app-prop-list')
    }

    getContentTypeMappingUrl(contentType) {
        return this.CONTENT_TYPE_MAPPING_URL[contentType]
    }

    clearDataFormCreateFilter() {
        super.clearDataFormCreateFilter();
        this.init()
    }
}


$(document).ready(function () {
    const advanceFilterRevenueCommonHandler = new AdvanceFilterRevenueCommonHandler();
    advanceFilterRevenueCommonHandler.getCurrPageAppID()
    advanceFilterRevenueCommonHandler.addEventBinding()
    advanceFilterRevenueCommonHandler.init()

    advanceFilterRevenueCommonHandler.setUpFormCreateFilterSubmit()
    advanceFilterRevenueCommonHandler.fetchDataFilterList()

    advanceFilterRevenueCommonHandler.setUpFormUpdateFilterSubmit()
})