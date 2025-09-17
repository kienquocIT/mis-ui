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
    ServiceOrder.handleDeleteWorkOrderCostRow()
}

function handleModalWorkOrderContributionEvent(){
    ServiceOrder.handleSaveProductContribution()
    ServiceOrder.handleUncheckContribution()
    ServiceOrder.handleChangeDeliveryCost()

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
        //  new $x.cls.bastionField({
        //     data_opp: data?.['opportunity']?.['id'] ? [
        //         {
        //             "id": data?.['opportunity']?.['id'],
        //             "title": data?.['opportunity']?.['title'] || '',
        //             "code": data?.['opportunity']?.['code'] || '',
        //             "selected": true,
        //         }
        //     ] : [],
        //     data_inherit: data?.['employee_inherit']?.['id'] ? [
        //         {
        //             "id": data?.['employee_inherit']?.['id'],
        //             "full_name": data?.['employee_inherit']?.['full_name'] || '',
        //             "code": data?.['employee_inherit']?.['code'] || '',
        //             "selected": true,
        //         }
        //     ] : [],
        //      "oppFlagData": {"disabled": true},
        //      "inheritFlagData": {"disabled": true},
        // }).init()
        let oppData = data?.['opportunity'];
        let inheritData = data?.['employee_inherit'];
        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            data_opp: oppData && Object.keys(oppData).length > 0 ? [
                {
                    ...oppData,
                    'selected': true,
                }
            ] : [],
            data_inherit: inheritData && Object.keys(inheritData).length > 0 ? [
                {
                    ...inheritData,
                    'selected': true,
                }
            ] : [],
        }).init();
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
                result.push({
                    isContainer: container.is_container,
                    ...container
                });

                const containerPackages = packages.filter(pkg =>
                    pkg['packageContainerRef'] === container?.containerRefNumber
                );

                containerPackages.sort((a, b) => a?.order - b?.order);  // sort package by order
                containerPackages.forEach(item => {
                    item.isContainer = item.is_container
                })
                result.push(...containerPackages);
            });
            return result;
        } else {
            return [];
        }
    }

    static loadDetailServiceOrder(isDetail) {
        let $form = $('#form-update-service-order');
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
                    enable_edit: true,
                    enable_download: true,
                    data: data?.['attachment'],
                })

                this.loadDetailOpp(data)

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
                this.loadCustomerList(data?.customer_data)
                ServiceOrder.pageElement.commonData.$startDate.val(startDate)
                ServiceOrder.pageElement.commonData.$endDate.val(endDate)
                ServiceOrder.loadExchangeRateData(data?.exchange_rate_data)

                // shipment
                let shipmentDataFormatted = DetailDataHandler.formatShipmentDetailData(data?.shipment || [])
                TabShipmentFunction.initShipmentDataTable(shipmentDataFormatted, isDetail)

                //service detail
                ServiceOrder.initServiceDetailDataTable(data.service_detail_data)
                ServiceOrder.loadServiceDetailRelatedData(data.service_detail_data)

                //work order
                let workOrderData = data.work_order_data
                workOrderData.forEach(workOrder => {
                    workOrder.start_date = DateTimeControl.formatDateType(
                        "YYYY-MM-DD",
                        "DD/MM/YYYY",
                        workOrder.start_date
                    )
                    workOrder.end_date = DateTimeControl.formatDateType(
                        "YYYY-MM-DD",
                        "DD/MM/YYYY",
                        workOrder.end_date
                    )
                })
                ServiceOrder.initWorkOrderDataTable(workOrderData)
                ServiceOrder.loadWorkOrderRelatedData(workOrderData)

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
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
                UsualLoadPageFunction.DisablePage(false, ['.btn-close', '.modal-header button', '#view-dashboard'])
            }
        )
    }
}

$(document).ready(function () {
    Promise.all([
        ServiceOrder.loadCurrencyRateData(),
        ServiceOrder.loadTaxData(),
    ]).then(() => {
        DetailDataHandler.loadDetailServiceOrder( "update");
    })
    ServiceOrder.adjustTableSizeWhenChangeTab()

    WFRTControl.setWFInitialData('serviceorder')

    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initModalContextTracking()

    // ============ tab shipment =============
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

    setUpFormSubmit($('#form-update-service-order'))

    $('#view-dashboard').on('click', function () {
        let url = $(this).attr('data-url') + '?service_order_id=' + $.fn.getPkDetail()
        $(this).attr('href', url)
    })
})
