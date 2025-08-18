$(document).ready(function () {
    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()
    ServiceOrder.initShipmentDataTable()

    ServiceOrder.handleSaveProductAndService()
    ServiceOrder.handleChangeServiceQuantity()
    ServiceOrder.handleChangeDescription()
    ServiceOrder.handleSaveContainer()
})
