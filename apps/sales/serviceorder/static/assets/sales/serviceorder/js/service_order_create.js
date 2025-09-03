$(document).ready(function () {
    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()
    ServiceOrder.loadTaxData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()
    ServiceOrder.initWorkOrderDataTable()
    ServiceOrder.initPaymentDataTable()
    // ServiceOrder.initPaymentDetailModalDataTable()
    ServiceOrder.initModalContextTracking()
    ServiceOrder.initAttachment()

    // ============ tab shipment =============
    TabShipmentFunction.initShipmentDataTable()
    TabShipmentFunction.LoadContainerType()
    TabShipmentFunction.LoadPackageType()
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

    function handlePaymentTabEvent(){
        ServiceOrder.handleAddPaymentRow()
        ServiceOrder.handleChangePaymentDate()
        ServiceOrder.handleChangePaymentType()
        ServiceOrder.handleCheckInvoice()
        ServiceOrder.handleOpenPaymentDetail()
    }

    function handleModalPaymentDetailEvent(){
        ServiceOrder.handleSavePaymentDetail()
        ServiceOrder.handleChangePaymentDetail()
        ServiceOrder.handleOpenModalReconcile()
        ServiceOrder.handleSavePaymentReconcile()
    }

    handleServiceDetailTabEvent()
    handleWorkOrderDetailTabEvent()
    handleModalWorkOrderCostEvent()
    handleModalWorkOrderContributionEvent()
    handlePaymentTabEvent()
    handleModalPaymentDetailEvent()
})
