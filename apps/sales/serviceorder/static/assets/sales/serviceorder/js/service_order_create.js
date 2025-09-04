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
    let startDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $('#so-start-date').val())
    let endDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $('#so-end-date').val())
    let pretaxValue = tabExpenseElements.$preTaxAmount.val() || "0"
    let taxValue = tabExpenseElements.$taxEle.val() || "0"
    let totalValue = tabExpenseElements.$totalValueEle.val() || "0"

    formInstance.dataForm['title'] = $('#so-title').val()
    formInstance.dataForm['customer'] = $('#so-customer').val()
    formInstance.dataForm['start_date'] = startDate
    formInstance.dataForm['end_date'] = endDate
    // formInstance.dataForm['service_detail_data'] = ServiceOrder.getServiceDetailData()
    // formInstance.dataForm['work_order_data'] = ServiceOrder.getWorkOrderData()
    // formInstance.dataForm['payment_data'] = ServiceOrder.getPaymentData()
    formInstance.dataForm['shipment'] = TabShipmentFunction.combineShipmentData()
    formInstance.dataForm['expense'] = TabExpenseFunction.combineExpenseData()
    formInstance.dataForm['pretax_amount'] = parseFloat(pretaxValue.replace(/[^\d]/g, "")) || 0
    formInstance.dataForm['tax_value'] = parseFloat(taxValue.replace(/[^\d]/g, "")) || 0
    formInstance.dataForm['total_value'] = parseFloat(totalValue.replace(/[^\d]/g, "")) || 0
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
    WFRTControl.setWFInitialData('serviceorder')

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

    setUpFormSubmit($('#form-create-service-order'))
})
