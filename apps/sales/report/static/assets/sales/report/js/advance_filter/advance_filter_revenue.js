class AdvanceFilterRevenueCommonHandler extends AdvanceFilterCommonHandler{
    constructor() {
        super();
        this.$url = $('#app-url-factory')
    }

    getPropUrl() {
        return this.$url.data('app-prop-list')
    }
}


$(document).ready(function () {
    const advanceFilterRevenueCommonHandler = new AdvanceFilterRevenueCommonHandler();
    advanceFilterRevenueCommonHandler.getCurrPageAppID()
    advanceFilterRevenueCommonHandler.addEventBinding()
    advanceFilterRevenueCommonHandler.init()
})