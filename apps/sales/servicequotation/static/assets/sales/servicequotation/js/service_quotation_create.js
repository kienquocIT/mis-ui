function handleServiceDetailTabEvent(){
    ServiceOrder.handleChangeServiceDescription()
    ServiceOrder.handleChangeServiceQuantity()
    ServiceOrder.handleDeleteServiceDetailRow()
    ServiceOrder.handleChangeServicePrice()
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
    WFRTControl.setWFInitialData('servicequotation')

    initBastionFields()

    ServiceOrder.initDateTime()
    ServiceOrder.initPageSelect()
    ServiceOrder.loadCurrencyRateData()
    ServiceOrder.loadTaxData()
    ServiceOrder.loadUoMData()

    ServiceOrder.initProductModalDataTable()
    ServiceOrder.initServiceDetailDataTable()
    ServiceOrder.initQuotationWorkOrderDataTable()
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

    setUpFormSubmit($('#form-create-service-quotation'))


    class ServiceQuotationCopyCanvas {
        constructor() {
            this.$canvas = $('#offcanvas-copy-service-quotation')
            this.$table = $('#datatable-copy-service-quotation')
            this.$selectBtn = $('#btn-select-quotation-copy')
            this.currentQuotId = null
        }

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

        getSelectedQuotationId(){
            const self= this
            return self.currentQuotId
        }

        updateSelectedQuotationId(quotationId){
            const self= this
            self.currentQuotId = quotationId
        }

        init(){
            const self = this
            self.initDataTable()
            self.initEvents()
        }

        initDataTable(){
            const self= this
            self.$table.DataTableDefault({
                useDataServer: true,
                rowIdx: false,
                ajax: {
                url: self.$canvas.attr('data-quotation-list-url'),
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['service_quotation_list'] ? resp.data['service_quotation_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-25',
                        render: (data, type, row) => {
                            const quotationId = row['id']
                            return `<div class="form-check form-check-lg d-flex align-items-center">
                                        <input type="radio" name="row-check" class="form-check-input table-row-check" id="${quotationId}" data-id="${row?.['id']}">
                                        <label class="form-check-label table-row-title" for="${quotationId}">${row?.['title']}</label>
                                    </div>`;
                        }
                    },
                    {
                        className: 'w-25',
                        render: (data, type, row) => {
                            return `<span>${row?.['code'] ? row?.['code'] : '__'}</span>`;
                        }
                    },
                    {
                        className: 'w-25',
                        render: (data, type, row) => {
                            if (row?.['opportunity']?.['title'] && row?.['opportunity']?.['code']) {
                                return `<span>${row?.['opportunity']?.['title']}</span>`;
                            }
                            return `__`;
                        }
                    },
                    {
                        className: 'w-25',
                        render: (data, type, row) => {
                            if (row?.['customer_data']?.['name']) {
                                return `<p>${row?.['customer_data']?.['name']}</p>`;
                            }
                            return `__`;
                        }
                    }
                ]
            })
        }

        initEvents(){
            const self= this
            self.$selectBtn.on('click', (e) => {
                const templateDetailUrl = self.$canvas.attr('data-quotation-detail')
                const detailUrl = templateDetailUrl.format_url_with_uuid(self.getSelectedQuotationId())
                $.fn.callAjax2({
                    url: detailUrl,
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

                        ServiceQuotationCopyCanvas.loadDetailOpp(data)

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
                        ServiceQuotationCopyCanvas.loadCustomerList(data?.customer_data)
                        ServiceOrder.pageElement.commonData.$startDate.val(startDate)
                        ServiceOrder.pageElement.commonData.$endDate.val(endDate)
                        console.log(data?.exchange_rate_data)
                        ServiceOrder.loadExchangeRateData(data?.exchange_rate_data)

                        // shipment
                        let shipmentDataFormatted = ServiceQuotationCopyCanvas.formatShipmentDetailData(data?.shipment || [])
                        TabShipmentFunction.initShipmentDataTable(shipmentDataFormatted, false)
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
                        ServiceOrder.initQuotationWorkOrderDataTable(workOrderData)
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
                        TabExpenseFunction.initExpenseTable(data?.expense || [], false)

                        $.fn.initMaskMoney2()
                        WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
                    })
            })

            self.$table.on('click', 'input[type="radio"]', (e)=>{
                self.updateSelectedQuotationId($(e.currentTarget).attr('data-id'))
                console.log($(e.currentTarget).attr('data-id'))
            })
        }
    }

    const serviceQuotationCopyCanvas = new ServiceQuotationCopyCanvas()
    serviceQuotationCopyCanvas.init()
})
