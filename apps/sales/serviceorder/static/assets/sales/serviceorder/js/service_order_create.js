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
        ServiceOrder.handleClickOpenServiceDelivery()
        ServiceOrder.handleCheckDelivery()
    }

    function handleModalWorkOrderCostEvent(){
        ServiceOrder.handleAddWorkOrderCostRow()
        ServiceOrder.handleChangeWorkOrderCostQuantityAndUnitCost()
        ServiceOrder.handleSaveWorkOrderCost()
        ServiceOrder.handleChangeWorkOrderCostTitleAndDescription()
    }

    function handleModalWorkOrderContributionEvent(){
        ServiceOrder.handleSaveProductContribution()
        ServiceOrder.handleUncheckContribution()
    }

    function handleShipmentEvent(){
        ServiceOrder.handleSaveContainer()
    }

    handleServiceDetailTabEvent()
    handleWorkOrderDetailTabEvent()
    handleModalWorkOrderCostEvent()
    handleModalWorkOrderContributionEvent()
    handleShipmentEvent()
})
