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
             // "oppFlagData": {"disabled": !isUpdate},
             // "inheritFlagData": {"disabled": true},
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
            method: 'GET',
            isLoading: true,
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
                DetailDataHandler.loadCustomerList(data?.customer_data)
                ServiceOrder.pageElement.commonData.$startDate.val(startDate)
                ServiceOrder.pageElement.commonData.$endDate.val(endDate)
                console.log(data?.exchange_rate_data)
                ServiceOrder.loadExchangeRateData(data?.exchange_rate_data)

                // shipment
                let shipmentDataFormatted = DetailDataHandler.formatShipmentDetailData(data?.shipment || [])
                TabShipmentFunction.initShipmentDataTable(shipmentDataFormatted, isDetail)
                TabShipmentFunction.pushToShipmentData(shipmentDataFormatted)

                //service detail
                ServiceOrder.initServiceDetailDataTable(data.service_detail_data)
                ServiceOrder.loadServiceDetailRelatedData(data.service_detail_data)
                ServiceOrder.loadServiceDetailSummaryValue()

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

                // indicator
                let indicatorsData = data?.['service_order_indicators_data'];
                IndicatorControl.dtbIndicator(indicatorsData);

                $.fn.initMaskMoney2()
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
                UsualLoadPageFunction.DisablePage(isDisablePage,
                    ['.btn-close', '.modal-header button', '#view-dashboard', '#btn-open-exchange-modal', '.btn-list-task',
                            '.btn-open-service-delivery', '.btn-open-work-order-cost', '.btn-open-contribution-package',
                            'btn-open-product-attribute'])
            }
        )
    }
}

$(document).ready(function () {
    Promise.all([
        ServiceOrder.loadCurrencyRateData(),
        ServiceOrder.loadTaxData(),
        ServiceOrder.loadUoMData()
    ]).then(() => {
        TabShipmentEventHandler.InitPageEvent();
        DetailDataHandler.loadDetailServiceOrder($('#form-detail-service-order'), "detail");
    })
    ServiceOrder.pageElement.workOrder.$table.on('click', '.btn-open-task', function () {
        TaskExtend.openAddTaskFromTblRow(this, ServiceOrder.pageElement.workOrder.$table);
    })
    ServiceOrder.pageElement.workOrder.$table.on('click', '.btn-list-task', function () {
        TaskExtend.openListTaskFromTblRow(this, ServiceOrder.pageElement.workOrder.$table);
    })
    ServiceOrder.adjustTableSizeWhenChangeTab()
    ServiceOrder.handleClickOpenServiceDelivery()
    ServiceOrder.handleClickOpenWorkOrderCost()
    ServiceOrder.handleOpenPaymentDetail()
    ServiceOrder.handleOpenModalReconcile()
    ServiceOrder.handleOpenModalPackage()
    ServiceOrder.handleTogglePackageChildren()

    $('#view-dashboard').on('click', function () {
        let url = $(this).attr('data-url') + '?service_order_id=' + $.fn.getPkDetail()
        $(this).attr('href', url)
    })

    IndicatorControl.$openCanvas.on('click', function () {
        IndicatorControl.$canvas.offcanvas('show');
    });

})
