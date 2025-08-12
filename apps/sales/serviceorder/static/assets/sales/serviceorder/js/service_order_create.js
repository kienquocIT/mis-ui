$(document).ready(function () {
    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()

    ServiceOrder.handleSaveProductAndService()
    ServiceOrder.handleChangeServiceQuantity()
    ServiceOrder.handleChangeDescription()
})
