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

    }

    static loadDetailServiceOrder(isDetail) {
        let isDisablePage = isDetail === "detail";
        let $form = $('#form-detail-service-order');
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
                    enable_edit: false,
                    enable_download: true,
                    data: data?.['attachment'],
                });

                const createdDate = data.date_created ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.date_created
                ) : '';

                const startDate = data.start_date ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.start_date
                ) : '';

                const endDate = data.end_date ? DateTimeControl.formatDateType(
                    "YYYY-MM-DD",
                    "DD/MM/YYYY",
                    data.end_date
                ) : '';

                // basic information fields
                ServiceOrder.pageElement.commonData.$titleEle.val(data?.title);
                ServiceOrder.pageElement.commonData.$createdDate.val(createdDate);
                DetailDataHandler.loadCustomerList(data.customer_data);
                ServiceOrder.pageElement.commonData.$startDate.val(startDate);
                ServiceOrder.pageElement.commonData.$endDate.val(endDate);

                // shipment
                console.log(data?.shipment);
                TabShipmentFunction.initShipmentDataTable(data?.shipment || []);

                //service detail
                ServiceOrder.initServiceDetailDataTable(data.service_detail_data);
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

                ServiceOrder.disableTableFields()

                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
                UsualLoadPageFunction.DisablePage(true, ['.modal-header button'])
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                UsualLoadPageFunction.DisablePage(isDisablePage, ['.modal-header button']);
            }
        )
    }
}

$(document).ready(function () {
    Promise.all([
        ServiceOrder.loadCurrencyRateData(),
        ServiceOrder.loadTaxData(),
    ]).then(()=>{
        DetailDataHandler.loadDetailServiceOrder("detail");
    })
    ServiceOrder.adjustTableSizeWhenChangeTab()
    ServiceOrder.handleClickOpenServiceDelivery()
    ServiceOrder.handleClickOpenWorkOrderCost()
    ServiceOrder.handleOpenPaymentDetail()
    ServiceOrder.handleOpenModalReconcile()
})
