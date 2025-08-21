$(document).ready(function () {
    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()
    ServiceOrder.loadTaxData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()
    ServiceOrder.initWorkOrderDataTable()
    ServiceOrder.initPaymentDataTable()
    ServiceOrder.initModalContextTracking()
    ServiceOrder.initAttachment()
    // ============ tab shipment =============
    TabShipmentFunction.initShipmentDataTable()
    TabShipmentEventHandler.InitPageEvent()

    // ========== tab expense ===========
    TabExpenseFunction.initExpenseTable()
    TabExpenseEventHandler.InitPageEvent()

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

    handleServiceDetailTabEvent()
    handleWorkOrderDetailTabEvent()
    handleModalWorkOrderCostEvent()
    handleModalWorkOrderContributionEvent()
})
