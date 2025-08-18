$(document).ready(function () {
    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()
    ServiceOrder.loadTaxData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()
    ServiceOrder.initWorkOrderDataTable()
    ServiceOrder.initModalContextTracking()
    ServiceOrder.initShipmentDataTable()

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

    function handleShipmentEvent(){
        ServiceOrder.handleSaveContainer()
        ServiceOrder.handleSavePackage()
    }

    handleServiceDetailTabEvent()
    handleWorkOrderDetailTabEvent()
    handleModalWorkOrderCostEvent()
    handleShipmentEvent()

})
