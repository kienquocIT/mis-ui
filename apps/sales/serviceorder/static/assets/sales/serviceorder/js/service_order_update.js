
$(document).ready(function () {
    Promise.all([
        ServiceOrder.loadCurrencyRateData(),
        ServiceOrder.loadTaxData(),
    ]).then(()=>{
        DetailDataHandle.loadDetailServiceOrder()
    })
    ServiceOrder.adjustTableSizeWhenChangeTab()
    ServiceOrder.handleClickOpenServiceDelivery()
    ServiceOrder.handleClickOpenWorkOrderCost()
    ServiceOrder.handleOpenPaymentDetail()
    ServiceOrder.handleOpenModalReconcile()
})