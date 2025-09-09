function handleServiceDetailTabEvent(){
    ServiceOrder.handleChangeServiceDescription()
    ServiceOrder.handleChangeServiceQuantity()
    ServiceOrder.handleDeleteServiceDetailRow()
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

function setUpFormData(formInstance) {
    let startDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $('#so-start-date').val())
    let endDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $('#so-end-date').val())

    formInstance.dataForm['title'] = $('#so-title').val()
    formInstance.dataForm['customer'] = $('#so-customer').val() || null
    formInstance.dataForm['start_date'] = startDate
    formInstance.dataForm['end_date'] = endDate
    formInstance.dataForm['service_detail_data'] = ServiceOrder.getServiceDetailData()
    formInstance.dataForm['work_order_data'] = ServiceOrder.getWorkOrderData()
    formInstance.dataForm['payment_data'] = ServiceOrder.getPaymentData()
    formInstance.dataForm['shipment'] = TabShipmentFunction.combineShipmentData()
    formInstance.dataForm['expense'] = TabExpenseFunction.combineExpenseData()
    formInstance.dataForm['expense_pretax_value'] = parseFloat(tabExpenseElements.$preTaxAmount.attr('value') || 0)
    formInstance.dataForm['expense_tax_value'] = parseFloat(tabExpenseElements.$taxEle.attr('value') || 0)
    formInstance.dataForm['expense_total_value'] = parseFloat(tabExpenseElements.$totalValueEle.attr('value') || 0)
}

function setUpFormSubmit($form) {
    SetupFormSubmit.call_validate($form, {
        onsubmit: true,
        submitHandler: () => {
            const isValidData = ServiceOrder.validateDates()
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
            WFRTControl.callWFSubmitForm(formInstance)
        },
    })
}

class DetailDataHandler {
    static loadDetailOpp(data){
         new $x.cls.bastionField({
            data_opp: data?.['opportunity']?.['id'] ? [
                {
                    "id": data?.['opportunity']?.['id'],
                    "title": data?.['opportunity']?.['title'] || '',
                    "code": data?.['opportunity']?.['code'] || '',
                    "selected": true,
                }
            ] : [],
            data_inherit: data?.['employee_inherit']?.['id'] ? [
                {
                    "id": data?.['employee_inherit']?.['id'],
                    "full_name": data?.['employee_inherit']?.['full_name'] || '',
                    "code": data?.['employee_inherit']?.['code'] || '',
                    "selected": true,
                }
            ] : [],
             "oppFlagData": {"disabled": true},
             "inheritFlagData": {"disabled": true},
        }).init()
    }

    static loadCustomerList(data) {
        ServiceOrder.pageElement.commonData.$customer.initSelect2({
            ajax: {
                url: ServiceOrder.pageElement.commonData.$customer.attr('data-url'),
                method: 'GET'
            },
            data: (data ? data : null),
            keyResp: 'account_dd_list',
            keyId: 'id',
            keyText: 'name'
        })
    }

    static formatShipmentDetailData(shipmentData) {
        const result = [];
        if (shipmentData.length > 0) {
            const containers = shipmentData.filter(item => item?.is_container === true);
            const packages = shipmentData.filter(item => item?.is_container === false);

            containers.sort((a, b) => a?.order - b?.order);   // sort container by order
            containers.forEach(container => {
                result.push(container);

                const containerPackages = packages.filter(pkg =>
                    pkg['packageContainerRef'] === container?.containerRefNumber
                );

                containerPackages.sort((a, b) => a?.order - b?.order);  // sort package by order
                result.push(...containerPackages);
            });
            return result;
        } else {
            return [];
        }
    }

    static loadDetailServiceOrder($form, isDetail) {
        let isDisablePage = isDetail === "detail";
        const data_url = $form.attr('data-url');
        $.fn.callAjax2({
            url: data_url,
            method: 'GET'
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                $x.fn.renderCodeBreadcrumb(data);
                $.fn.compareStatusShowPageAction(data);
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: !isDisablePage,
                    enable_download: true,
                    data: data?.['attachment'],
                })

                DetailDataHandler.loadDetailOpp(data)

                const createdDate = data.date_created ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.date_created
                ) : ''

                const startDate = data.start_date ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.start_date
                ) : ''

                const endDate = data.end_date ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.end_date
                ) : ''

                // basic information fields
                ServiceOrder.pageElement.commonData.$titleEle.val(data?.title)
                ServiceOrder.pageElement.commonData.$createdDate.val(createdDate)
                DetailDataHandler.loadCustomerList(data?.customer_data)
                ServiceOrder.pageElement.commonData.$startDate.val(startDate)
                ServiceOrder.pageElement.commonData.$endDate.val(endDate)

                // shipment
                let shipmentDataFormatted = DetailDataHandler.formatShipmentDetailData(data?.shipment || [])
                TabShipmentFunction.initShipmentDataTable(shipmentDataFormatted, isDetail)

                //service detail
                ServiceOrder.initServiceDetailDataTable(data.service_detail_data)
                ServiceOrder.loadServiceDetailRelatedData(data.service_detail_data)

                //work order
                ServiceOrder.initWorkOrderDataTable(data.work_order_data)
                ServiceOrder.loadWorkOrderRelatedData(data.work_order_data)

                //payment
                let paymentData = data.payment_data
                paymentData.forEach(payment => {
                    payment.due_date = DateTimeControl.formatDateType(
                        "YYYY-MM-DD",
                        "DD/MM/YYYY",
                        payment.due_date
                    )
                })
                ServiceOrder.initPaymentDataTable(paymentData)
                ServiceOrder.loadPaymentRelatedData(paymentData)

                //expense
                tabExpenseElements.$preTaxAmount.attr('value', data?.expense_pretax_value || 0)
                tabExpenseElements.$taxEle.attr('value', data?.expense_tax_value || 0)
                tabExpenseElements.$totalValueEle.attr('value', data?.expense_total_value || 0)
                TabExpenseFunction.initExpenseTable(data?.expense || [], isDetail)

                $.fn.initMaskMoney2()
                ServiceOrder.disableTableFields()
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
                UsualLoadPageFunction.DisablePage(isDisablePage, ['.btn-close'])
            }
        )
    }
}

$(document).ready(function () {
    Promise.all([
        ServiceOrder.loadCurrencyRateData(),
        ServiceOrder.loadTaxData(),
    ]).then(() => {
        DetailDataHandler.loadDetailServiceOrder($('#form-update-service-order'), "update");
    })
    ServiceOrder.adjustTableSizeWhenChangeTab()

    WFRTControl.setWFInitialData('serviceorder')

    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initModalContextTracking()
    ServiceOrder.initAttachment()

    // ============ tab shipment =============
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

    setUpFormSubmit($('#form-update-service-order'))
})
