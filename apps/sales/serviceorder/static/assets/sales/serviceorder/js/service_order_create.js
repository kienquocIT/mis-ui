function handleServiceDetailTabEvent(){
    ServiceOrder.handleChangeServiceDescription()
    ServiceOrder.handleChangeServiceQuantity()
}

function handleWorkOrderDetailTabEvent(){
    ServiceOrder.handleChangeWorkOrderDetail()
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

function setUpFormData(formInstance){
    formInstance.dataForm['service_detail_data'] = ServiceOrder.getServiceDetailData()
    formInstance.dataForm['work_order_data'] = ServiceOrder.getWorkOrderData()
    formInstance.dataForm['payment_data'] = ServiceOrder.getPaymentData()

}

function setUpFormSubmit($form){
    SetupFormSubmit.call_validate($form, {
        onsubmit: true,
        submitHandler:  ()=> {
            let formInstance = new SetupFormSubmit($form)
            setUpFormData(formInstance)
            console.log(formInstance.dataForm)
            WFRTControl.callWFSubmitForm(formInstance)
        },
    })
}

$(document).ready(function () {
    WFRTControl.setWFInitialData('')

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

    handleServiceDetailTabEvent()
    handleWorkOrderDetailTabEvent()
    handleModalWorkOrderCostEvent()
    handleModalWorkOrderContributionEvent()
    handlePaymentTabEvent()
    handleModalPaymentDetailEvent()

    setUpFormSubmit($('#form-service-order'))
})
