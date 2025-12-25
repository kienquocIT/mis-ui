class ServiceOrderPageHandler {
    // Hàm load sẵn data cần thiết cho các page
    static async initializeCommonData() {
        await Promise.all([
            ServiceOrder.loadCurrencyRateData(),
            ServiceOrder.loadTaxData(),
            ServiceOrder.loadUoMData()
        ]);
    }

    // Hàm set up form data
    static setUpFormData(formInstance) {
        const startDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $('#so-start-date').val());
        const endDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $('#so-end-date').val());

        formInstance.dataForm['title'] = $('#so-title').val();
        formInstance.dataForm['customer'] = $('#so-customer').val() || null;
        formInstance.dataForm['start_date'] = startDate;
        formInstance.dataForm['end_date'] = endDate;
        formInstance.dataForm['exchange_rate_data'] = ServiceOrder.getExchangeRate();
        formInstance.dataForm['service_detail_data'] = ServiceOrder.getServiceDetailData();
        formInstance.dataForm['work_order_data'] = ServiceOrder.getWorkOrderData();
        formInstance.dataForm['payment_data'] = ServiceOrder.getPaymentData();
        formInstance.dataForm['shipment'] = TabShipmentFunction.combineShipmentData();
        formInstance.dataForm['expenses_data'] = TabExpenseFunction.combineExpenseData();

        ServiceOrderPageHandler.setTotalFields(formInstance);
        ServiceOrderPageHandler.setIndicatorData(formInstance);
    }

    // Hàm set total fields
    static setTotalFields(formInstance) {
        // total product
        const $pretaxPrdEle = $('#service-detail-pretax-value');
        const $taxPrdEle = $('#service-detail-taxes-value');
        const $totalPrdEle = $('#service-detail-total-value');
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
        // total cost
        let total_cost = 0;
        for (let woData of formInstance.dataForm?.['work_order_data'] ? formInstance.dataForm?.['work_order_data'] : []) {
            for (let pcData of woData?.['product_contribution'] ? woData?.['product_contribution'] : []) {
                total_cost += pcData?.['total_cost'] ? pcData?.['total_cost'] : 0;
            }
        }
        formInstance.dataForm['total_cost_pretax_amount'] = total_cost;
        formInstance.dataForm['total_cost'] = total_cost;
    }

    // Hàm set indicator
    static setIndicatorData(formInstance) {
        const keyInd = "quotation_indicator_data";
        const indicators_data_setup = IndicatorControl.loadIndicator(formInstance?.['dataForm']);

        if (indicators_data_setup.length > 0) {
            formInstance.dataForm['service_order_indicators_data'] = indicators_data_setup;

            const indicatorMap = {
                "IN0001": 'indicator_revenue',
                "IN0003": 'indicator_gross_profit',
                "IN0006": 'indicator_net_income'
            };

            for (let indicator of indicators_data_setup) {
                const code = indicator?.[keyInd]?.['code'];
                if (indicatorMap[code]) {
                    formInstance.dataForm[indicatorMap[code]] = indicator?.['indicator_value'] || 0;
                }
            }
        }
    }

    // Hàm tạo events chung cho trang create và update
    static registerCommonEventHandlers() {
        ServiceOrder.handleSaveProduct();
        ServiceOrder.handleCheckProduct();
        ServiceOrder.handleSaveExchangeRate();
        ServiceOrder.handleOpportunityChange();
        ServiceOrder.adjustTableSizeWhenChangeTab();

        ServiceOrderPageHandler.handleServiceDetailEvents();
        ServiceOrderPageHandler.handleWorkOrderEvents();
        ServiceOrderPageHandler.handleModalWorkOrderCostEvents();
        ServiceOrderPageHandler.handleModalWorkOrderContributionEvents();
        ServiceOrderPageHandler.handlePaymentEvents();
        ServiceOrderPageHandler.handleModalPaymentDetailEvents();
        ServiceOrderPageHandler.setupDashboardLink();
    }

    // Hàm chung cho các event lên quan tới bảng service detail
    static handleServiceDetailEvents() {
        ServiceOrder.handleChangeServiceDescription();
        ServiceOrder.handleChangeServiceQuantity();
        ServiceOrder.handleDeleteServiceDetailRow();
        ServiceOrder.handleChangeServicePrice();
        ServiceOrder.handleChangeServiceDetail();
        ServiceOrder.handleChangeServicePercentage();
    }

    // Hàm chung cho các event lên quan tới bảng work
    static handleWorkOrderEvents() {
        ServiceOrder.handleChangeWorkOrderDetail();
        ServiceOrder.handleClickOpenWorkOrderCost();
        ServiceOrder.handleSelectWorkOrderCostTax();
        ServiceOrder.handleSelectWorkOrderCurrency();
        ServiceOrder.handleAddWorkOrderNonItem();
        ServiceOrder.handleClickOpenServiceDelivery();
        ServiceOrder.handleCheckDelivery();
        ServiceOrder.handleDeleteWorkOrderRow();
    }

    // Hàm chung cho các event lên quan tới bảng work cost
    static handleModalWorkOrderCostEvents() {
        ServiceOrder.handleAddWorkOrderCostRow();
        ServiceOrder.handleChangeWorkOrderCostQuantityAndUnitCost();
        ServiceOrder.handleSaveWorkOrderCost();
        ServiceOrder.handleChangeWorkOrderCostTitleAndDescription();
        ServiceOrder.handleDeleteWorkOrderCostRow();
        ServiceOrder.handleSelectWorkOrderCostExpense();
    }

    // Hàm chung cho các event lên quan tới bảng work contribution
    static handleModalWorkOrderContributionEvents() {
        ServiceOrder.handleSaveProductContribution();
        ServiceOrder.handleUncheckContribution();
        ServiceOrder.handleChangeDeliveryCost();
        ServiceOrder.handleChangeProductContributionPercentage();
        ServiceOrder.handleCheckPackage();
        ServiceOrder.handleOpenModalPackage();
        ServiceOrder.handleSaveModalPackage();
        ServiceOrder.handleTogglePackageChildren();
        ServiceOrder.handleSelectContainer();
        ServiceOrder.handleClickOpenDeliveryLogs();
    }

    // Hàm chung cho các event lên quan tới bảng payment
    static handlePaymentEvents() {
        ServiceOrder.handleAddPaymentRow();
        ServiceOrder.handleChangePaymentDate();
        ServiceOrder.handleChangePaymentType();
        ServiceOrder.handleCheckInvoice();
        ServiceOrder.handleOpenPaymentDetail();
        ServiceOrder.handleDeletePaymentRow();
    }

    // Hàm chung cho các event lên quan tới bảng payment detail
    static handleModalPaymentDetailEvents() {
        ServiceOrder.handleSavePaymentDetail();
        ServiceOrder.handleChangePaymentDetail();
        ServiceOrder.handleOpenModalReconcile();
        ServiceOrder.handleSavePaymentReconcile();
    }

    // Hàm tạo link cho dashboard
    static setupDashboardLink() {
        $('#view-dashboard').on('click', function() {
            const url = $(this).attr('data-url') + '?service_order_id=' + $.fn.getPkDetail();
            $(this).attr('href', url);
        });
    }

    // Hàm set up form submit
    static setupFormSubmit(formSelector) {
        SetupFormSubmit.call_validate($(formSelector), {
            onsubmit: true,
            submitHandler: () => {
                const isValidData = ServiceOrder.validateDates() && ServiceOrder.validateTotalServiceDetailPercent();
                if (!isValidData) {
                    return false;
                }

                let formInstance = new SetupFormSubmit($(formSelector));

                if (formInstance.dataForm.hasOwnProperty('attachment')) {
                    formInstance.dataForm['attachment'] = $x.cls.file.get_val(
                        formInstance.dataForm?.['attachment'], []
                    );
                } else {
                    formInstance.dataForm['attachment'] = [];
                }

                ServiceOrderPageHandler.setUpFormData(formInstance);
                WFRTControl.callWFSubmitForm(formInstance);
            }
        });
    }

    // Hàm set up indicator canvas
    static setupIndicatorCanvas(formSelector) {
        IndicatorControl.$openCanvas.on('click', () => {
            let formInstance = new SetupFormSubmit($(formSelector));

            if (formInstance.dataForm.hasOwnProperty('attachment')) {
                formInstance.dataForm['attachment'] = $x.cls.file.get_val(
                    formInstance.dataForm?.['attachment'], []
                );
            } else {
                formInstance.dataForm['attachment'] = [];
            }

            ServiceOrderPageHandler.setUpFormData(formInstance);
            IndicatorControl.loadIndicator(formInstance?.['dataForm']);
            IndicatorControl.$canvas.offcanvas('show');
        });
    }

    // Data loading helpers
    // Hàm goộp init các table
    static initializeTables(isOrderPage=true){
        ServiceOrder.initServiceDetailDataTable();
        if(isOrderPage){
            ServiceOrder.initWorkOrderDataTable();
        } else {
            ServiceOrder.initQuotationWorkOrderDataTable();
        }
        ServiceOrder.initPaymentDataTable();
        TabShipmentFunction.initShipmentDataTable();
        TabExpenseFunction.initExpenseTable();
    }

    // Hàm gộp init các field khác table
    static initializeComponents(isCreatePage=true) {
        ServiceOrder.initDateTime();
        ServiceOrder.initPageSelect();
        ServiceOrder.initProductModalDataTable();
        ServiceOrder.initModalContextTracking();
        if (isCreatePage){
            ServiceOrder.initAttachment();
        }
        TabShipmentFunction.LoadContainerType();
        TabShipmentFunction.LoadPackageType();
        TabShipmentEventHandler.InitPageEvent();
        TabExpenseEventHandler.InitPageEvent();
    }

    // Hàm format date dữ liệu
    static formatDate(date, fromFormat, toFormat) {
        return date ? DateTimeControl.formatDateType(fromFormat, toFormat, date) : '';
    }

    // Hàm format shipment data
    static formatShipmentData(shipmentData) {
        const result = [];
        if (shipmentData.length > 0) {
            const containers = shipmentData.filter(item => item?.is_container === true);
            const packages = shipmentData.filter(item => item?.is_container === false);

            containers.sort((a, b) => a?.order - b?.order);
            containers.forEach(container => {
                result.push(container);
                const containerPackages = packages.filter(pkg =>
                    pkg['packageContainerRef'] === container?.containerRefNumber
                );
                containerPackages.sort((a, b) => a?.order - b?.order);
                result.push(...containerPackages);
            });
        }
        return result;
    }

    // Hàm load data các field opp
    static loadBastionFields(data, isReadOnly = false) {
        const oppData = data?.['opportunity'];
        const inheritData = data?.['employee_inherit'];

        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            data_opp: oppData && Object.keys(oppData).length > 0 ? [{
                ...oppData,
                selected: true
            }] : [],
            data_inherit: inheritData && Object.keys(inheritData).length > 0 ? [{
                ...inheritData,
                selected: true
            }] : [],
            oppFlagData: { disabled: isReadOnly },
            inheritFlagData: { disabled: isReadOnly }
        }).init();
    }

    // Hàm load data customer
    static loadCustomerList(data) {
        ServiceOrder.pageElement.commonData.$customer.initSelect2({
            ajax: {
                url: ServiceOrder.pageElement.commonData.$customer.attr('data-url'),
                method: 'GET'
            },
            data: data || null,
            keyResp: 'account_dd_list',
            keyId: 'id',
            keyText: 'name'
        });
    }

    // Hàm load service order data cho detail page
    static async loadServiceOrderData(dataUrl, isReadOnly = false, isServiceOrder=true) {
        if(!dataUrl){
            console.log('missing data url detail')
            return false
        }
        await $.fn.callAjax2({
            url: dataUrl,
            method: 'GET',
        }).then(
            (resp)=>{
                const data = $.fn.switcherResp(resp);

                // Common data population
                $x.fn.renderCodeBreadcrumb(data);
                $.fn.compareStatusShowPageAction(data);

                ServiceOrder.pageVariable.documentRootId = data?.document_root_id
                ServiceOrder.pageVariable.systemStatus = data?.system_status

                // Attachment
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: !isReadOnly,
                    enable_download: true,
                    data: data?.['attachment']
                });

                // Load all form data
                ServiceOrderPageHandler.loadBastionFields(data, isReadOnly);
                ServiceOrderPageHandler.loadBasicFields(data);
                ServiceOrderPageHandler.loadTableData(data, isReadOnly, isServiceOrder);

                // Indicators
                if (data?.['service_order_indicators_data']) {
                    IndicatorControl.dtbIndicator(data['service_order_indicators_data']);
                }

                $.fn.initMaskMoney2();

                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
            }
        ).finally(
            ()=>{
                if (isServiceOrder){
                    ServiceOrderPageHandler.showBtnCompare()
                }
            }
        )
    }

    // Hàm load data các field chung cho detail
    static loadBasicFields(data) {
        ServiceOrder.pageElement.commonData.$titleEle.val(data?.title);
        ServiceOrderPageHandler.loadCustomerList(data?.customer_data);

        const startDate = ServiceOrderPageHandler.formatDate(data.start_date, "YYYY-MM-DD", "DD/MM/YYYY");
        const endDate = ServiceOrderPageHandler.formatDate(data.end_date, "YYYY-MM-DD", "DD/MM/YYYY");

        ServiceOrder.pageElement.commonData.$startDate.val(startDate);
        ServiceOrder.pageElement.commonData.$endDate.val(endDate);

        ServiceOrder.loadExchangeRateData(data?.exchange_rate_data);
    }

    // Hàm load data detail cho table
    static loadTableData(data, isReadOnly, isServiceOrder=true) {
        // Shipment
        const shipmentData = ServiceOrderPageHandler.formatShipmentData(data?.shipment || []);
        TabShipmentFunction.initShipmentDataTable(shipmentData, isReadOnly);
        TabShipmentFunction.pushToShipmentData(shipmentData);

        // Service Detail
        ServiceOrder.initServiceDetailDataTable(data.service_detail_data);
        ServiceOrder.loadServiceDetailRelatedData(data.service_detail_data);
        ServiceOrder.loadServiceDetailSummaryValue();

        // Work
        const workOrderData = data.work_order_data.map(wo => ({
            ...wo,
            start_date: ServiceOrderPageHandler.formatDate(wo.start_date, "YYYY-MM-DD", "DD/MM/YYYY"),
            end_date: ServiceOrderPageHandler.formatDate(wo.end_date, "YYYY-MM-DD", "DD/MM/YYYY")
        }));

        if (isServiceOrder) {
            ServiceOrder.initWorkOrderDataTable(workOrderData);
        } else {
            ServiceOrder.initQuotationWorkOrderDataTable(workOrderData);
        }
        ServiceOrder.loadWorkOrderRelatedData(workOrderData);
        ServiceOrder.loadWorkOrderDetailSummaryValue();

        // Payment
        const paymentData = data.payment_data.map(payment => ({
            ...payment,
            due_date: ServiceOrderPageHandler.formatDate(payment.due_date, "YYYY-MM-DD", "DD/MM/YYYY")
        }));
        ServiceOrder.initPaymentDataTable(paymentData);
        ServiceOrder.loadPaymentRelatedData(paymentData);

        // Expense
        tabExpenseElements.$preTaxAmount.attr('value', data?.['total_expense_pretax_amount'] || 0);
        tabExpenseElements.$taxEle.attr('value', data?.['total_expense_tax'] || 0);
        tabExpenseElements.$totalValueEle.attr('value', data?.['total_expense'] || 0);
        TabExpenseFunction.initExpenseTable(data?.['expenses_data'] || [], isReadOnly);
    }

    static showBtnCompare(){
        if (ServiceOrder.pageVariable.systemStatus === 3){
            $('#open_version_compare').removeAttr('hidden')
        }
    }
}