$(document).ready(function () {
    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()
    ServiceOrder.loadTaxData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()
    ServiceOrder.initWorkOrderDataTable()
    ServiceOrder.initModalContextTracking()

    ServiceOrder.handleSaveProduct()

    function handleServiceDetailTabEvent(){
        ServiceOrder.handleChangeServiceDescription()
        ServiceOrder.handleChangeServiceQuantity()
    }

    function handleWorkOrderDetailTabEvent(){
        ServiceOrder.handleChangeWorkOrderDate()
        ServiceOrder.handleChangeWorkOrderQuantity()
        ServiceOrder.handleClickOpenWorkOrderCost()
        ServiceOrder.handleSelectWorkOrderCostTax()
        ServiceOrder.handleSelectWorkOrderCurrency()
        ServiceOrder.handleAddWorkOrderNonItem()
    }

    function handleModalWorkOrderCostEvent(){
        ServiceOrder.handleAddWorkOrderCostRow()
        ServiceOrder.handleChangeWorkOrderCostQuantityAndUnitCost()
        ServiceOrder.handleSaveWorkOrderCost()
    }

    handleServiceDetailTabEvent()
    handleWorkOrderDetailTabEvent()
    handleModalWorkOrderCostEvent()
})
