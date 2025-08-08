$(document).ready(function () {
    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()
    ServiceOrder.initWorkOrderDataTable()
    ServiceOrder.initModalContextTracking()

    ServiceOrder.handleSaveProduct()
    ServiceOrder.handleChangeServiceQuantity()
    ServiceOrder.handleChangeDescription()
    ServiceOrder.handleChangeWorkOrderDate()
})
