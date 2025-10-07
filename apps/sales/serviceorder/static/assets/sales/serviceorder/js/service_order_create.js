function handleServiceDetailTabEvent(){
    ServiceOrder.handleChangeServiceDescription()
    ServiceOrder.handleChangeServiceQuantity()
    ServiceOrder.handleDeleteServiceDetailRow()
    ServiceOrder.handleChangeServicePrice()
    ServiceOrder.handleChangeServiceDetail()
    ServiceOrder.handleChangeServicePercentage()
}

function handleWorkOrderDetailTabEvent(){
    ServiceOrder.handleChangeWorkOrderDetail()
    ServiceOrder.handleClickOpenWorkOrderCost()
    ServiceOrder.handleSelectWorkOrderCostTax()
    ServiceOrder.handleSelectWorkOrderCurrency()
    ServiceOrder.handleAddWorkOrderNonItem()
    ServiceOrder.handleClickOpenServiceDelivery()
    ServiceOrder.handleCheckDelivery()
    ServiceOrder.handleDeleteWorkOrderRow()
}

function handleModalWorkOrderCostEvent(){
    ServiceOrder.handleAddWorkOrderCostRow()
    ServiceOrder.handleChangeWorkOrderCostQuantityAndUnitCost()
    ServiceOrder.handleSaveWorkOrderCost()
    ServiceOrder.handleChangeWorkOrderCostTitleAndDescription()
    ServiceOrder.handleDeleteWorkOrderCostRow()
    ServiceOrder.handleSelectWorkOrderCostExpense()
}

function handleModalWorkOrderContributionEvent(){
    ServiceOrder.handleSaveProductContribution()
    ServiceOrder.handleUncheckContribution()
    ServiceOrder.handleChangeDeliveryCost()
    ServiceOrder.handleChangeProductContributionPercentage()

    ServiceOrder.handleCheckPackage()
    ServiceOrder.handleOpenModalPackage()
    ServiceOrder.handleSaveModalPackage()
    ServiceOrder.handleTogglePackageChildren()
    ServiceOrder.handleSelectContainer()
}

function handlePaymentTabEvent(){
    ServiceOrder.handleAddPaymentRow()
    ServiceOrder.handleChangePaymentDate()
    ServiceOrder.handleChangePaymentType()
    ServiceOrder.handleCheckInvoice()
    ServiceOrder.handleOpenPaymentDetail()
    ServiceOrder.handleDeletePaymentRow()
}

function handleModalPaymentDetailEvent(){
    ServiceOrder.handleSavePaymentDetail()
    ServiceOrder.handleChangePaymentDetail()
    ServiceOrder.handleOpenModalReconcile()
    ServiceOrder.handleSavePaymentReconcile()
}

function setUpFormData(formInstance) {
    let startDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $('#so-start-date').val())
    let endDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $('#so-end-date').val())

    formInstance.dataForm['title'] = $('#so-title').val()
    formInstance.dataForm['customer'] = $('#so-customer').val() || null
    formInstance.dataForm['start_date'] = startDate
    formInstance.dataForm['end_date'] = endDate
    formInstance.dataForm['exchange_rate_data'] = ServiceOrder.getExchangeRate()
    formInstance.dataForm['service_detail_data'] = ServiceOrder.getServiceDetailData()
    formInstance.dataForm['work_order_data'] = ServiceOrder.getWorkOrderData()
    formInstance.dataForm['payment_data'] = ServiceOrder.getPaymentData()
    formInstance.dataForm['shipment'] = TabShipmentFunction.combineShipmentData()
    formInstance.dataForm['expense'] = TabExpenseFunction.combineExpenseData()

    // total fields
    let $pretaxPrdEle = $('#service-detail-pretax-value');
    let $taxPrdEle = $('#service-detail-taxes-value');
    let $totalPrdEle = $('#service-detail-total-value');
    if ($pretaxPrdEle.length > 0 && $taxPrdEle.length > 0 && $totalPrdEle.length > 0) {
        if ($pretaxPrdEle.valCurrency()) {
            formInstance.dataForm['total_product_pretax_amount'] = parseFloat($pretaxPrdEle.valCurrency());
            formInstance.dataForm['total_product_revenue_before_tax'] = parseFloat($pretaxPrdEle.valCurrency());
        }
        if ($taxPrdEle.valCurrency()) {
            formInstance.dataForm['total_product_tax'] = parseFloat($taxPrdEle.valCurrency());
        }
        if ($totalPrdEle.valCurrency()) {
            formInstance.dataForm['total_product'] = parseFloat($totalPrdEle.valCurrency());
        }
    }
}

function setUpFormSubmit($form) {
    SetupFormSubmit.call_validate($form, {
        onsubmit: true,
        submitHandler: () => {
            const isValidData = ServiceOrder.validateDates() && ServiceOrder.validateTotalServiceDetailPercent()
            if(!isValidData){
                return false
            }
            let formInstance = new SetupFormSubmit($form)
            if (formInstance.dataForm.hasOwnProperty('attachment')) {
                formInstance.dataForm['attachment'] = $x.cls.file.get_val(
                    formInstance.dataForm?.['attachment'],
                    []
                )
            } else {
                formInstance.dataForm['attachment'] = []
            }
            setUpFormData(formInstance)
            // append indicator
            let keyInd = "quotation_indicator_data";
            let indicators_data_setup = IndicatorControl.loadIndicator(formInstance?.['dataForm']);
            if (indicators_data_setup.length > 0) {
                formInstance.dataForm['service_order_indicators_data'] = indicators_data_setup;
                for (let indicator of indicators_data_setup) {
                    if (indicator?.[keyInd]?.['code'] === "IN0001") {
                        formInstance.dataForm['indicator_revenue'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                    }
                    if (indicator?.[keyInd]?.['code'] === "IN0003") {
                        formInstance.dataForm['indicator_gross_profit'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                    }
                    if (indicator?.[keyInd]?.['code'] === "IN0006") {
                        formInstance.dataForm['indicator_net_income'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                    }
                }
            }
            WFRTControl.callWFSubmitForm(formInstance)
        },
    })
}

function initBastionFields(){
        const {
            opp_id,
            opp_title,
            opp_code,
            inherit_id,
            inherit_title,
            customer_id,
            customer_code,
            customer_title
        } = $x.fn.getManyUrlParameters([
            'opp_id', 'opp_title', 'opp_code',
            'inherit_id', 'inherit_title',
            'customer_id', 'customer_code', 'customer_title'
        ])
        if (opp_id){
            new $x.cls.bastionField({
                data_opp: $x.fn.checkUUID4(opp_id) ? [
                    {
                        "id": opp_id,
                        "title": $x.fn.decodeURI(opp_title),
                        "code": $x.fn.decodeURI(opp_code),
                        "selected": true,
                    }
                ] : [],
                data_inherit: $x.fn.checkUUID4(inherit_id) ? [
                    {
                        "id": inherit_id,
                        "full_name": inherit_title,
                        "selected": true,
                    }
                ] : [],
            }).init()
        } else {
            new $x.cls.bastionField().init()
        }
    }

$(document).ready(function () {
    WFRTControl.setWFInitialData('serviceorder')

    initBastionFields()

    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()
    ServiceOrder.loadTaxData()
    ServiceOrder.loadUoMData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()
    ServiceOrder.initWorkOrderDataTable()
    ServiceOrder.initPaymentDataTable()
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
    ServiceOrder.handleSaveExchangeRate()

    handleServiceDetailTabEvent()
    handleWorkOrderDetailTabEvent()
    handleModalWorkOrderCostEvent()
    handleModalWorkOrderContributionEvent()
    handlePaymentTabEvent()
    handleModalPaymentDetailEvent()

    setUpFormSubmit($('#form-create-service-order'))

    IndicatorControl.$openCanvas.on('click', function () {
        let formInstance = new SetupFormSubmit($('#form-create-service-order'))
        if (formInstance.dataForm.hasOwnProperty('attachment')) {
            formInstance.dataForm['attachment'] = $x.cls.file.get_val(
                formInstance.dataForm?.['attachment'],
                []
            )
        } else {
            formInstance.dataForm['attachment'] = []
        }
        setUpFormData(formInstance);
        IndicatorControl.loadIndicator(formInstance?.['dataForm']);
        IndicatorControl.$canvas.offcanvas('show');
    });

})
