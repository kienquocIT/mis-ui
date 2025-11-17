//IIFE pattern, hide pageElement and pageVariable from browser console
const ServiceOrder = (function($) {
    const pageElement = {
        $urlScript: $('#script-url'),
        commonData: {
            $titleEle: $('#so-title'),
            $startDate: $('#so-start-date'),
            $endDate: $('#so-end-date'),
            $customer: $('#so-customer'),
        },
        modalData: {
            $tableProduct: $('#modal-table-product'),
            $btnSaveProduct: $('#btn-save-product'),

            $tableExchangeRate: $('#modal-table-exchange-rate'),
            $btnSaveExchangeRate: $('#btn-save-exchange-rate'),

            $tableWorkOrderCost: $('#modal-table-work-order-cost'),
            $btnSaveWorkOrderCost: $('#btn-save-work-order-cost'),

            $modalProductContribution: $('#modal-product-contribution'),
            $tableProductContribution: $('#modal-table-product-contribution'),
            $btnSaveProductContribution: $('#btn-save-product-contribution'),

            $modalPaymentDetailNoInvoice: $('#modal-payment-detail-no-invoice'),
            $tablePaymentDetailNoInvoice: $('#modal-table-payment-detail-no-invoice'),
            $btnSavePaymentNoInvoice: $('#btn-save-payment-no-invoice'),

            $modalPaymentDetail: $('#modal-payment-detail'),
            $tablePaymentDetail: $('#modal-table-payment-detail'),
            $btnSavePayment: $('#btn-save-payment'),

            $modalPaymentReconcile: $('#modal-payment-reconcile'),
            $tablePaymentReconcile: $('#modal-table-payment-reconcile'),
            $btnSavePaymentReconcile: $('#btn-save-payment-reconcile'),

            $modalContributionPackage: $('#modal-contribution-package'),
            $tableContributionPackage: $('#modal-table-contribution-package'),
            $btnSaveContributionPackage: $('#btn-save-contribution-package'),
        },
        serviceDetail: {
            $table: $('#table-service-detail'),
            $btnOpenServiceProductModal: $('#btn-open-service-product-modal'),
            $pretaxValue: $('#service-detail-pretax-value'),
            $taxValue: $('#service-detail-taxes-value'),
            $totalValue: $('#service-detail-total-value'),
        },
        workOrder:{
            $table: $('#table-work-order'),
            $btnAddNonItem: $('#btn-add-non-item'),
            $pretaxValue: $('#work-order-pretax-value'),
            $taxValue: $('#work-order-taxes-value'),
            $totalValue: $('#work-order-total-value'),
        },
        payment: {
            $table: $('#table-payment'),
            $btnAddInstallment: $('#btn-add-installment'),
        }
    }

    const pageVariable = {
        tempSelectedProducts: [],
        currencyList: null,
        taxList: null,
        uomList: null,
        modalContext: null,
        workOrderCostData: {},

        /**
         * @type {{ [work_order_id: string]: [{ service_id: string, contribution_percent: number, delivered_quantity: number}] }}
         * @description Biến lưu dữ liệu đóng góp của 1 hàng work (còn gồm nhiều field khác)
         */
        productContributionData: {},

        /**
         * @type {{ [service_id: string]: { total_contribution_percent: number, delivery_balance_value: number} }}
         * @description Biến lưu dữ liệu tổng đóng góp và còn lại của 1 dòng service detail
         */
        serviceDetailTotalContributionData: {},

        /**
         * @type {{ [contribution_id: string]: [{ title: string}] }}
         * @description Biến lưu dữ liệu package của 1 contribution
         */
        contributionPackageData: {},

        /**
         * @type {{ [payment_id: string]: [{ service_id: string, payment_percent: number, payment_value: number, total_reconciled_value: number}] }}
         * @description Biến lưu dữ liệu thanh toán của 1 hàng payment (tuỳ theo loại payment có hoá đơn hay ko có hoá đơn mà field khác nhau)
         */
        paymentDetailData: {},

        /**
         * @type {{ [service_id: string]: { total_payment_percent: number, total_payment_value: number} }}
         * @description Biến lưu dữ liệu tổng thanh toán của 1 service detail
         */
        serviceDetailTotalPaymentData: {},

        /**
         * @type {{ [payment_detail_id: string]: [{payment_id: string, service_id: string, reconcile_value: number}] }}
         * @description Biến lưu dữ liệu cấn trừ
         */
        reconcileData: {},

        documentRootId: null,

        systemStatus: null,
    }

    const WORK_ORDER_STATUS = {
        pending: 0,
        in_progress: 1,
        completed: 2,
        cancelled: 3,
    }

    const PAYMENT_TYPE = {
        advance: 0,
        payment: 1
    }

    function initSelect($ele, opts = {}) {
        if ($ele.hasClass("select2-hidden-accessible") && $ele) {
            $ele.select2('destroy')
        }
        $ele.empty()
        $ele.initSelect2({
            ...opts
        })
    }

    function initDateTime() {
        UsualLoadPageFunction.LoadDate({
            element: pageElement.commonData.$startDate,
            empty: false
        })

        UsualLoadPageFunction.LoadDate({
            element: pageElement.commonData.$endDate,
        })
    }

    function initPageSelect() {
        initSelect(pageElement.commonData.$customer, {
            dataParams: {
                account_types_mapped__account_type_order: 0
            }
        })
    }

    function initModalContextTracking() {
        //để biết add cho service detail hay workorder
        pageElement.serviceDetail.$btnOpenServiceProductModal.on('click', function(e) {
            pageVariable.modalContext = 'serviceDetail'
        })

        $('[data-bs-target="#modal-product"]:not(#btn-open-service-product-modal)').on('click', function(e) {
            pageVariable.modalContext = 'workOrder'
        })

        // Clear context when modal is closed
        $('#modal-product').on('hidden.bs.modal', function() {
            pageVariable.modalContext = null
        })
    }

    function initAttachment() {
        new $x.cls.file($('#attachment')).init({
            name: 'attachment',
            enable_edit: true,
        });
    }

    function transformProductData(rowData, productId) {
        const uniqueStr = Math.random().toString(36).slice(2)
        const baseData = {
            product_id: productId,
            code: rowData.code,
            title: rowData.title,
            description: rowData.description || '',
            quantity: 1,
            uom_title: rowData?.sale_default_uom?.title || '',
            uom_data: rowData?.sale_default_uom ?? {},
            duration_unit_data: rowData?.duration_unit_data ?? {},
            duration_id: rowData?.duration_unit_data ? rowData?.duration_unit_data?.id : null,
            id: uniqueStr,
            service_percent: 0
        }

        if (pageVariable.modalContext === 'serviceDetail') {
            const price = rowData.general_price || 0
            const taxRate = (rowData?.sale_tax?.rate || 0) / 100
            const taxAmount = price * taxRate
            const total = taxAmount + price
            const durationId = Object.keys(baseData.duration_unit_data).length > 0 ? baseData.duration_unit_data.id : null

            return {
                ...baseData,
                price: price,
                tax_code: rowData?.sale_tax?.code || '',
                tax_data: rowData?.sale_tax || {},
                sub_total_value: price,
                total_value: total,
                duration_id: durationId
            }
        } else if (pageVariable.modalContext === 'workOrder') {
            return {
                ...baseData,
                unit_cost: 0,
                total_value: 0, // Will be recalculated when quantity changes
                start_date: '',
                end_date: '',
                is_delivery_point: false,
                status: WORK_ORDER_STATUS.pending
            }
        }


        return baseData
    }

    function calculateWorkOrderCostTotalData(rowData){
        const quantity = rowData?.quantity || 0
        const unitCost =rowData?.unit_cost || 0
        const currencyId = rowData?.currency_id
        const taxId = rowData?.tax_id

        let total = quantity * unitCost
        let exchangedTotal = 0

        if(taxId && pageVariable.taxList){
            const taxData = pageVariable.taxList.find(tax => tax.id === taxId)
            if(taxData && taxData.rate){
                const taxAmount = total * (taxData.rate / 100)
                total = total + taxAmount
            }
        }

        if(currencyId && pageVariable.currencyList){
            const currencyData = pageVariable.currencyList.find(currency => currency.id === currencyId)
            if(currencyData && currencyData.rate){
                exchangedTotal = total * currencyData.rate
            }
        }

        return {
            total_value: total,
            exchanged_total_value: exchangedTotal
        }
    }

    function adjustTableSizeWhenChangeTab(){
        $('a[data-bs-toggle="tab"][href="#tab_work_order"]').on('shown.bs.tab', function () {
            if ($.fn.DataTable.isDataTable(pageElement.workOrder.$table)) {
                pageElement.workOrder.$table.DataTable().columns.adjust();
            }
        })
    }

    function loadServiceDetailSummaryValue(){
        const table = pageElement.serviceDetail.$table.DataTable()
        let pretaxTotal = 0
        let taxTotal = 0
        let grandTotal = 0

        // Calculate totals from all rows
        table.rows().every(function() {
            const rowData = this.data()
            const $row = $(this.node())

            const subtotal = rowData.sub_total_value || 0

            // Calculate tax
            const taxRate = (rowData.tax_data?.rate || 0) / 100

            const taxAmount = subtotal * taxRate

            // Add to totals
            pretaxTotal += subtotal
            taxTotal += taxAmount
            grandTotal += (subtotal + taxAmount)
        })

        // Update the summary fields
        pageElement.serviceDetail.$pretaxValue.attr('value', pretaxTotal)
        pageElement.serviceDetail.$taxValue.attr('value', taxTotal)
        pageElement.serviceDetail.$totalValue.attr('value', grandTotal)

        // Reinitialize money formatting
        $.fn.initMaskMoney2()
    }

    function loadWorkOrderDetailSummaryValue(){
        const table = pageElement.workOrder.$table.DataTable();
        let pretaxTotal = 0;
        let taxTotal = 0;
        let grandTotal = 0;

        // Calculate totals from all work order rows
        table.rows().every(function() {
            const rowData = this.data();
            const quantity = rowData.quantity || 0;
            const workOrderId = rowData.id;

            // Get the cost breakdown for this work order
            const costDataList = pageVariable.workOrderCostData[workOrderId] || [];

            let rowPretaxTotal = 0;
            let rowTaxTotal = 0;

            // Calculate totals from cost breakdown
            costDataList.forEach(costItem => {
                const costQuantity = costItem.quantity || 0;
                const unitCost = costItem.unit_cost || 0;
                const subtotal = costQuantity * unitCost;

                // Get tax rate
                let taxRate = 0;
                if (costItem.tax_id && pageVariable.taxList) {
                    const taxData = pageVariable.taxList.find(tax => tax.id === costItem.tax_id);
                    taxRate = taxData ? (taxData.rate || 0) / 100 : 0;
                }

                const taxAmount = subtotal * taxRate;
                const total = subtotal + taxAmount;

                // Apply currency exchange rate if needed
                let exchangeRate = 1;
                if (costItem.currency_id && pageVariable.currencyList) {
                    const currencyData = pageVariable.currencyList.find(currency => currency.id === costItem.currency_id);
                    exchangeRate = currencyData ? (currencyData.rate || 1) : 1;
                }

                // Add to row totals (in base currency)
                rowPretaxTotal += subtotal * exchangeRate;
                rowTaxTotal += taxAmount * exchangeRate;
            });

            // Multiply by work order quantity
            const finalPretaxTotal = rowPretaxTotal * quantity;
            const finalTaxTotal = rowTaxTotal * quantity;

            // Add to grand totals
            pretaxTotal += finalPretaxTotal;
            taxTotal += finalTaxTotal;
            grandTotal += finalPretaxTotal + finalTaxTotal;
        });

        // Update the summary fields if they exist
        // You'll need to add these elements to your HTML if they don't exist
        if (pageElement.workOrder.$pretaxValue) {
            pageElement.workOrder.$pretaxValue.attr('value', pretaxTotal);
        }
        if (pageElement.workOrder.$taxValue) {
            pageElement.workOrder.$taxValue.attr('value', taxTotal);
        }
        if (pageElement.workOrder.$totalValue) {
            pageElement.workOrder.$totalValue.attr('value', grandTotal);
        }
    }

// --------------------LOAD DATA---------------------

    function loadCurrencyRateData() {
        const currencyListUrl = pageElement.$urlScript.attr('data-currency-list-url')
        return $.fn.callAjax2({
            url: currencyListUrl,
            type: 'GET',
            dataType: 'json',
            success: function (resp) {
                let data = $.fn.switcherResp(resp)
                if (data && resp.data['currency_list']) {
                    let currencyList = resp.data['currency_list']
                    currencyList.map(item => {
                        if (item.rate === null){
                            item.rate = 0
                        }
                        return item
                    })
                    pageVariable.currencyList = currencyList
                }
            },
            error: function (error) {
                console.error('Failed to load currency:', error)
            }
        }).then(data => {
            initCurrencyRateModalDataTable(pageVariable.currencyList)
        })
    }

    function loadTaxData(){
        const taxListUrl = pageElement.$urlScript.attr('data-tax-list-url')
        return $.fn.callAjax2({
            url: taxListUrl,
            type: 'GET',
            dataType: 'json',
            success: function (resp) {
                let data = $.fn.switcherResp(resp)
                if (data && resp.data['tax_list']) {
                    pageVariable.taxList = resp.data['tax_list']
                }
            },
            error: function (error) {
                console.error('Failed to load currency:', error)
            }
        }).then(data => {})
    }

    function loadUoMData(){
        const uomListUrl = pageElement.$urlScript.attr('data-uom-list-url')
        return $.fn.callAjax2({
            url: uomListUrl,
            type: 'GET',
            dataType: 'json',
            success: function (resp) {
                let data = $.fn.switcherResp(resp)
                if (data && resp.data['unit_of_measure']) {
                    pageVariable.uomList = resp.data['unit_of_measure']
                }
            },
            error: function (error) {
                console.error('Failed to load uom:', error)
            }
        }).then(data => {})
    }

// --------------------HANDLE INIT DATATABLES---------------------

    function initProductModalDataTable() {
        pageElement.modalData.$tableProduct.DataTableDefault({
            rowIdx: true,
            useDataServer: true,
            reloadCurrency: true,
            scrollCollapse: true,
            scrollY: '50vh',
            scrollX: true,
            ajax: {
                url: pageElement.modalData.$tableProduct.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['product_list'] ? resp.data['product_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="select-product-${row?.['id']}" name="select-product" data-product-id="${row?.['id'] || ''}"/>
                                </div>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<label class="form-check-label mr-2" for="select-product-${row?.['id']}">
                                    <span class="badge badge-sm badge-soft-secondary mr-1">${row?.['code'] || ''}</span>
                                    <span>${row?.['title'] || ''}</span>
                                </label>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span>${row?.['description'] || ''}</span>`
                    }
                },
            ],
        })
    }

    function initCurrencyRateModalDataTable(data = []) {
        if ($.fn.DataTable.isDataTable(pageElement.modalData.$tableExchangeRate)) {
            pageElement.modalData.$tableExchangeRate.DataTable().destroy()
        }

        pageElement.modalData.$tableExchangeRate.DataTableDefault({
            data: data,
            autoWidth: false,
            rowIdx: true,
            scrollCollapse: true,
            scrollY: '35vh',
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    className: 'min-w-150p',
                    render: (data, type, row) => {
                        const abbreviation = row?.['abbreviation']
                        return `<div>${abbreviation}</div>`
                    }
                },
                {
                    targets: 2,
                    width: '40%',
                    className: 'min-w-210p',
                    render: (data, type, row) => {
                        const name = row?.['title']
                        const isPrimary = row?.['is_primary']
                        return `<div>
                                    ${name} ${isPrimary ? ' (primary)' : ''}
                                </div>`
                    }
                },
                {
                    targets: 4,
                    width: '30%',
                    render: (data, type, row) => {
                        const rate = row?.['rate']
                        const isPrimary = row?.['is_primary']
                        return `<div class="input-group">
                                    <input 
                                        ${isPrimary ? 'disabled' : ''}
                                        type="text"  
                                        class="form-control"
                                        value="${rate}"
                                    />
                                </div>`
                    }
                },
            ],
        })
    }

    function initServiceDetailDataTable(data = []) {
        if ($.fn.DataTable.isDataTable(pageElement.serviceDetail.$table)) {
            pageElement.serviceDetail.$table.DataTable().destroy()
        }

        pageElement.serviceDetail.$table.DataTableDefault({
            styleDom: "hide-foot",
            data: data,
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-secondary">${row?.['code'] || ''}</span><br><span>${row?.['title'] || ''}</span>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<textarea class="form-control cost-description" rows="2">${row?.['description'] || ''}</textarea>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        const percentage = row?.['service_percent'] || 0
                        return `<div class="input-group">
                                    <input type="number" class="form-control service-percentage" value="${percentage}" min="0" max="100" step="0.01">
                                    <span class="input-group-text">%</span>
                                </div>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<input type="number" class="form-control service-quantity" value="${row?.['quantity'] || 0}" min="0">`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['uom_title']}</span>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        const isDurationEnable = Object.keys(row?.['duration_unit_data']).length > 0
                        if (isDurationEnable){
                            return `<input type="number" class="form-control service-duration" value="${row?.['duration'] || 1}" min="1" step="1">`
                        }
                        else {
                            return `<span>--</span>`
                        }
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        const uomListUrl = pageElement.$urlScript.attr('data-uom-list-url')
                        const isDurationEnable = Object.keys(row?.['duration_unit_data']).length > 0
                        if (isDurationEnable){
                            return `<div class="input-group">
                                    <select readonly class="select2 form-select service-duration-select" data-url="${uomListUrl}" data-keyResp="unit_of_measure">
                                    </select>
                                </div>`
                        }
                        else {
                            return `<span>--</span>`
                        }
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ProductAttribute.renderProductAttributeButton(row.has_attributes, row.attributes_total_cost, row, row.selected_attributes)
                    }
                },
                {
                    className: 'w-10 text-right',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control mask-money service-detail-price" value="${row?.['price'] || 0}">`
                    }
                },
                {
                    className: 'w-10 text-right',
                    render: (data, type, row) => {
                        const taxListUrl = pageElement.$urlScript.attr('data-tax-list-url')
                        return `<div class="input-group">
                                    <select class="select2 form-select service-tax-select" data-url="${taxListUrl}" data-keyResp="tax_list">
                                    </select>
                                </div>`
                    }
                },
                {
                    className: 'w-10 text-right',
                    render: (data, type, row) => {
                        return `<span class="mask-money service-detail-total" data-init-money="${row?.['total_value'] || 0}"></span>`
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover service-del-row">
                                    <span class="icon"><i class="far fa-trash-alt"></i></span>
                                </button>`

                    }
                },
            ],
            initComplete: function () {
                pageElement.serviceDetail.$table.DataTable().columns.adjust();
            },
            rowCallback: function (row, data){
                const $row = $(row)
                const durationId = data.duration_id
                $row.find('.service-duration-select').attr('data-duration-id', durationId)


                const taxId = data.tax_data?.id
                $row.find('.service-tax-select').attr('data-tax-id', taxId)
            },
            drawCallback: function(settings) {
                const $table = $(this)
                const api = $table.DataTable()

                const $durationUnitSelects = $(this).find('.service-duration-select')
                $durationUnitSelects.each(function () {
                    const durationId = $(this).attr('data-duration-id')
                    const durationData = pageVariable.uomList.find(duration => duration.id === durationId)

                    if(durationData) {
                        initSelect($(this),{
                            data:{
                                id: durationId,
                                title: durationData.title,
                            },
                            dataParams: {'group__code': 'Time', 'group__is_default': true}
                        })
                    } else {
                        initSelect($(this), {
                            dataParams: {'group__code': 'Time', 'group__is_default': true}
                        })
                    }
                })

                const $taxSelects = $(this).find('.service-tax-select')
                $taxSelects.each(function () {
                    const taxId = $(this).attr('data-tax-id')
                    const taxData = pageVariable.taxList.find(tax => tax.id === taxId)

                    if(taxData) {
                        initSelect($(this), {
                            data: {
                                id: taxId,
                                title: taxData.title,
                            }
                        })
                    } else {
                        initSelect($(this))
                    }
                })
            }
        })
    }

    function initWorkOrderDataTable(data = []) {
        if ($.fn.DataTable.isDataTable(pageElement.workOrder.$table)) {
            pageElement.workOrder.$table.DataTable().destroy()
        }

        pageElement.workOrder.$table.DataTableDefault({
            styleDom: "hide-foot",
            data: data,
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '60vh',
            scrollCollapse: true,
            columns: [
                {
                    className: '',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        if (row?.['product_id']){
                            return `<span class="badge badge-sm badge-soft-secondary">${row?.['code'] || ''}</span><br><span class="" title="${row?.['title'] || ''}">${row?.['title'] || ''}</span>`
                        } else {
                            return `<textarea class="form-control work-order-description" rows="2">${row?.['title'] || ''}</textarea>`
                        }
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return TaskExtend.renderTaskTblRow();
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-input work-order-start-date" required value="${row?.['start_date'] || ''}" placeholder="DD/MM/YYYY">`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-input work-order-end-date" value="${row?.['end_date'] || ''}" placeholder="DD/MM/YYYY">`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <div class="form-check me-2">
                                        <input type="checkbox" class="form-check-input work-order-service-delivery" ${row?.['is_delivery_point'] || false ? 'checked' : ''}/>
                                    </div>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-open-service-delivery" 
                                    data-row-id="${row?.['id']}" data-bs-toggle="modal" data-bs-target="#modal-product-contribution" title="Open service delivery details">
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<input type="number" class="form-control work-order-quantity" value="${row?.['quantity'] || 0}" min="0">`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <span class="mask-money work-order-unit-cost" data-init-money="${row?.['unit_cost'] || 0}"></span>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover ml-2 btn-open-work-order-cost"
                                            data-bs-toggle="modal" data-bs-target="#modal-work-order-cost" data-work-order-id="${row?.['id'] || ''}">
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money work-order-total-amount" data-init-money="${row?.['total_value'] || 0}"></span>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<span class="table-row-percent-completed"></span>`;
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover work-order-del-row"
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom"
                                        title="Delete"
                                    >
                                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                                    </button>
                                </div>`
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                if (data?.['task_data']) {
                    for (let taskData of data?.['task_data']) {
                        TaskExtend.storeData(taskData, row);
                    }
                    TaskExtend.renderTaskAvatarTblRow(data?.['task_data'], row);
                    let percentCompletedEle = row.querySelector('.table-row-percent-completed');
                    if (percentCompletedEle) {
                        let percent = TaskExtend.calculatePercentCompletedAll(data?.['task_data']);
                        let badgeCls = 'bg-grey-light-4';
                        if (percent >= 50 && percent < 100) {
                            badgeCls = 'bg-blue-light-4';
                        }
                        if (percent >= 100) {
                            badgeCls = 'bg-green-light-4';
                        }
                        $(percentCompletedEle).html(`<span class="badge ${badgeCls} text-dark-10 fs-8">${String(percent) + ' %'}</span>`);
                    }
                }
            },
            drawCallback: function (data, type, row) {
                pageElement.workOrder.$table.find('input.date-input').each(function(){
                    const $input = $(this)
                    const value = $input.val()

                    UsualLoadPageFunction.LoadDate({ element: $input })

                    if (value && $input.data('daterangepicker')) {
                        $input.data('daterangepicker').setStartDate(value)
                    }
                })
            }
        })
    }

    function initQuotationWorkOrderDataTable(data = []){
        if ($.fn.DataTable.isDataTable(pageElement.workOrder.$table)) {
            pageElement.workOrder.$table.DataTable().destroy()
        }

        pageElement.workOrder.$table.DataTableDefault({
            styleDom: "hide-foot",
            data: data,
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            columns: [
                {
                    className: '',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        if (row?.['product_id']){
                            return `<span class="badge badge-sm badge-soft-secondary mr-1">${row?.['code'] || ''}</span><span class="" title="${row?.['title'] || ''}">${row?.['title'] || ''}</span>`
                        } else {
                            return `<textarea class="form-control work-order-description" rows="2">${row?.['title'] || ''}</textarea>`
                        }
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-input work-order-start-date" required value="${row?.['start_date'] || ''}" placeholder="DD/MM/YYYY">`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-input work-order-end-date" value="${row?.['end_date'] || ''}" placeholder="DD/MM/YYYY">`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <div class="form-check me-2">
                                        <input type="checkbox" class="form-check-input work-order-service-delivery" ${row?.['is_delivery_point'] || false ? 'checked' : ''}/>
                                    </div>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-open-service-delivery" 
                                    data-row-id="${row?.['id']}" data-bs-toggle="modal" data-bs-target="#modal-product-contribution" title="Open service delivery details">
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<input type="number" class="form-control work-order-quantity" value="${row?.['quantity'] || 0}" min="0">`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <span class="mask-money work-order-unit-cost" data-init-money="${row?.['unit_cost'] || 0}"></span>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover ml-2 btn-open-work-order-cost"
                                            data-bs-toggle="modal" data-bs-target="#modal-work-order-cost" data-work-order-id="${row?.['id'] || ''}">
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="mask-money work-order-total-amount" data-init-money="${row?.['total_value'] || 0}"></span>`
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover work-order-del-row"
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom"
                                        title="Delete"
                                    >
                                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                                    </button>
                                </div>`
                    }
                },
            ],
            drawCallback: function (data, type, row) {
                pageElement.workOrder.$table.find('input.date-input').each(function(){
                    const $input = $(this)
                    const value = $input.val()

                    UsualLoadPageFunction.LoadDate({ element: $input })

                    if (value && $input.data('daterangepicker')) {
                        $input.data('daterangepicker').setStartDate(value)
                    }
                })
            }
        })
    }

    function initWorkOrderCostModalDataTable(data=[{}]){
        if ($.fn.DataTable.isDataTable(pageElement.modalData.$tableWorkOrderCost)) {
            pageElement.modalData.$tableWorkOrderCost.DataTable().destroy()
        }

        pageElement.modalData.$tableWorkOrderCost.DataTableDefault({
            data: data,
            reloadCurrency: true,
            rowIdx: false,
            autoWidth: false,
            scrollX: true,
            scrollY: '35vh',
            scrollCollapse: true,
            columns: [
                {
                    className: 'text-center w-3',
                    render: (data, type, row, meta) => {
                        return `<div class="btn-add-cost-area"></div>`
                    }
                },
                {
                    className: 'text-center w-2',
                    render: (data, type, row, meta) => {
                        return Number(meta.row) + 1
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        const title = row.title || ''
                        return `<div class="input-group">
                                    <input
                                        type="text"
                                        class="form-control wo-cost-title"
                                        value="${title}"
                                    />
                                </div>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        const description = row.description || ''
                        return `<div class="input-group">
                                    <textarea
                                        class="form-control wo-cost-description"
                                        rows="2"
                                    >${description}</textarea>
                                </div>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        const expenseListUrl = pageElement.$urlScript.attr('data-expense-item-list-url')

                        return `<select class="form-select select2 work-order-cost-expense-select" data-url="${expenseListUrl}" data-keyResp="expense_item_list"/>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        const quantity = row.quantity || 0
                        return `<div class="input-group">
                                    <input
                                        type="number"
                                        class="form-control work-order-cost-quantity"
                                        value="${quantity}"
                                        min="0"
                                    />
                                </div>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        const unitCost = row.unit_cost || 0
                        const selectedCurrency = row.currency_id || ''
                        const currencyData = pageVariable.currencyList.find(currency => currency.id === selectedCurrency)

                        const currencyAbbr = currencyData?.abbreviation || ' '

                        return `<div class="input-group">
                                    <input
                                        type="text"
                                        class="form-control mask-money work-order-cost-unit-cost"
                                        value="${unitCost}"
                                        data-other-abbreviation="${currencyAbbr}"
                                    />
                                </div>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        const selectedCurrency = row.currency_id || ''
                        let options = '<option value="">Select</option>'

                        if (pageVariable.currencyList) {
                            pageVariable.currencyList.forEach(currency => {
                                const selected = currency.id === selectedCurrency ? 'selected' : ''
                                options += `<option value="${currency.id}" data-rate="${currency.rate}" ${selected}>
                                                ${currency.abbreviation}
                                            </option>`
                            })
                        }

                        return `<div class="input-group">
                                    <select class="form-select currency-select">
                                        ${options}
                                    </select>
                                </div>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        const taxListUrl = pageElement.$urlScript.attr('data-tax-list-url')
                        const selectedTax = row.tax_id || ''
                        return `<div class="input-group">
                                    <select class="select2 form-select tax-select" data-url="${taxListUrl}" data-keyResp="tax_list">
                                    </select>
                                </div>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        const total = row.total_value || 0
                        const selectedCurrency = row.currency_id || ''
                        const currencyData = pageVariable.currencyList.find(currency => currency.id === selectedCurrency)

                        const currencyAbbr = currencyData?.abbreviation || ' '
                        return `<div>
                                    <span data-other-abbreviation="${currencyAbbr}" class="order-cost-total mask-money" data-init-money="${total}"></span>
                                </div>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        const exchangedTotal = row.exchanged_total_value || 0
                        return `<div>
                                    <span class="order-cost-exchanged-total mask-money" data-init-money="${exchangedTotal}"></span>
                                </div>`
                    }
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return `<button
                                    type="button"
                                    class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover delete-cost-row"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Delete"
                                >
                                    <span class="icon"><i class="far fa-trash-alt"></i></span>
                                </button>`
                    }
                }
            ],
            rowCallback: function (row, data){
                const $row = $(row)
                const taxId = data.tax_id
                $row.find('.tax-select').attr('data-tax-id', taxId)
            },
            drawCallback: function(settings) {
                const $table = $(this)
                const api = $table.DataTable()
                $table.find('.btn-add-cost-area').empty()

                // Add plus button to the last row only
                const $rows = $table.find('tbody tr')
                if ($rows.length > 0) {
                    const $lastRow = $rows.last()
                    $lastRow.find('.btn-add-cost-area').html(`
                        <button
                            type="button"
                            class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover add-work-order-cost-row"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Add new row"
                        >
                            <span class="icon"><i class="fas fa-plus"></i></span>
                        </button>
                    `)
                }

                const $taxSelects = $(this).find('.tax-select')
                $taxSelects.each(function () {
                    const taxId = $(this).attr('data-tax-id')
                    const taxData = pageVariable.taxList.find(tax => tax.id === taxId)

                    if(taxData) {
                        initSelect($(this),{
                            data:{
                                id: taxId,
                                title: taxData.title,
                            }
                        })
                    } else {
                        initSelect($(this))
                    }
                })

                const $expenseSelects = $table.find('.work-order-cost-expense-select')
                $expenseSelects.each(function() {
                    const $row = $(this).closest('tr')
                    const rowData = $table.DataTable().row($row).data()
                    const expenseData = rowData.expense_data || {}

                    if(Object.keys(expenseData).length > 0) {
                        initSelect($(this), {
                            data: {
                                id: expenseData?.id,
                                title: expenseData?.title,
                            }
                        })
                    } else {
                        initSelect($(this))
                    }
                })
            }
        })
    }

    function initProductContributionModalDataTable(data=[]){
        if ($.fn.DataTable.isDataTable(pageElement.modalData.$tableProductContribution)) {
            pageElement.modalData.$tableProductContribution.DataTable().destroy()
        }

        const isDelivery = pageElement.modalData.$modalProductContribution.data('is-delivery')

        pageElement.modalData.$tableProductContribution.DataTableDefault({
            data: data,
            reloadCurrency: true,
            rowIdx: false,
            autoWidth: false,
            scrollX: true,
            scrollY: '35vh',
            scrollCollapse: true,
            columns: [
                {
                    width: '5%',
                    title: $.fn.gettext(''),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        const isChecked = row.is_selected
                        const serviceRowId = row.service_id
                        return `<div class="form-check">
                                    <input
                                        ${isChecked ? 'checked ' : ' '} 
                                        type="checkbox"
                                        class="form-check-input"
                                        name="select-pc"
                                        data-service-row-id="${serviceRowId}"
                                    />
                                </div>`
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Order'),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        return Number(meta.row) + 1
                    }
                },
                {
                    width: '20%',
                    title: $.fn.gettext('Title'),
                    render: (data, type, row) => {
                        return row?.title
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Contribution'),
                    render: (data, type, row) => {
                        const contribution = row.contribution_percent || 0
                        return `<div class="input-group">
                                    <input
                                        type="number"
                                        class="form-control pc-contribution"
                                        value="${contribution}"
                                        min="0"
                                        max="100"
                                    />
                                    <span class="input-group-text">%</span>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Remaining'),
                    render: (data, type, row) => {
                        // Calculate remaining percentage
                        const contribution = row.contribution_percent || 0
                        const totalContribution = row.total_contribution_percent || 0
                        const remaining = 100 - totalContribution

                        // Color code based on remaining value
                        let badgeClass = 'badge-soft-success'
                        if (remaining < 0) {
                            badgeClass = 'badge-soft-danger'  // Over-allocated
                        } else if (remaining > 0) {
                            badgeClass = 'badge-soft-warning'  // Under-allocated
                        }

                        // const displayNumber = remaining + contribution
                        const displayNumber = remaining
                        return `<span class="badge ${badgeClass} remaining-contribution"  data-remaining-contribution="${remaining}">
                                    ${displayNumber.toFixed(2)}%
                                </span>`
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Total Balance'),
                    render: (data, type, row) => {
                        let balance = row.balance_quantity || 0
                        const isSelected = row.is_selected
                        const deliveredQuantity = row.delivered_quantity || 0
                        balance += isSelected ? deliveredQuantity : 0
                        return `${balance}`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('No. of Service Delivered'),
                    render: (data, type, row) => {
                        const quantity = row.delivered_quantity || 0
                        const balance = row.balance_quantity || 0
                        let btnLogs = ``;
                        let $formPut = $('#form-update-service-order');
                        if ($formPut.length > 0) {
                            let $transEle = $('#app-trans-factory');
                            btnLogs = `<button 
                                        type="button" 
                                        class="btn btn-icon btn-outline-light btn-sm btn-delivery-log"
                                        data-bs-toggle="tooltip" data-bs-placement="bottom" title="${$transEle.attr('data-delivery-logs')}"
                                    >
                                        <span class="icon"><i class="fa-solid fa-clock-rotate-left"></i></span>
                                    </button>`;
                        }
                        return `<div class="d-flex justify-content-between align-items-center">
                                <div class="input-group">
                                    <input
                                        ${!isDelivery ? 'disabled' : ''}
                                        type="number"
                                        class="form-control pc-delivered-quantity"
                                        value="${quantity}"
                                        min="0"
                                        max="${balance}"
                                    />
                                </div>
                                ${btnLogs}
                                </div>`;
                    }
                },
                // {
                //     width: '10%',
                //     title: $.fn.gettext('Package'),
                //     render: (data, type, row) => {
                //         const hasPackage = row.has_package || false
                //         const rowId = row.id
                //         return `<div class="d-flex align-items-center">
                //                     <div class="form-check me-2">
                //                         <input
                //                             ${!isDelivery ? 'disabled' : ''}
                //                             type="checkbox"
                //                             class="form-check-input contribution-package"
                //                             ${hasPackage ? 'checked' : ''}
                //                         />
                //                     </div>
                //                     <button
                //                         ${!isDelivery ? 'disabled' : ''}
                //                         type="button"
                //                         class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-open-contribution-package"
                //                         data-contribution-id="${rowId}"
                //                         title="Open package"
                //                     >
                //                         <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                //                     </button>
                //                 </div>`
                //     }
                // },
                {
                    width: '15%',
                    title: $.fn.gettext('Unit Cost'),
                    render: (data, type, row) => {
                        const unitCost = row?.unit_cost || 0
                        return `<input
                                    ${!isDelivery ? 'disabled' : ''}
                                    type="text"
                                    class="form-control mask-money pc-unit-cost"
                                    value="${unitCost}"
                                />`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Total Cost'),
                    render: (data, type, row) => {
                        const total = row?.total_cost || 0
                        return `<div>
                                    <span class="mask-money" data-init-money="${total}"></span>
                                </div>`
                    }
                },
            ],
        })
    }

    function initContributionPackageModalDataTable(data=[{}]){
        if ($.fn.DataTable.isDataTable(pageElement.modalData.$tableContributionPackage)) {
            pageElement.modalData.$tableContributionPackage.DataTable().destroy()
        }

        pageElement.modalData.$tableContributionPackage.DataTableDefault({
            data: data,
            reloadCurrency: true,
            rowIdx: false,
            autoWidth: false,
            scrollX: true,
            scrollY: '35vh',
            scrollCollapse: true,
            columns: [
                {
                    width: '5%',
                    title: $.fn.gettext(''),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        const isChecked = row.is_selected
                        return `<div class="form-check">
                                    <input
                                        ${isChecked ? 'checked ' : ' '} 
                                        type="checkbox"
                                        class="form-check-input"
                                        name="select-package"
                                    />
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext(''),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        if(row?.is_container){
                            return `
                                <button type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs btn-show-package-child">
                                    <span class="icon"><i class="fa-solid fa-caret-down"></i></span>
                                </button>`
                        }
                        else {
                            return ''
                        }
                    }
                },
                {
                    width: '30%',
                    title: $.fn.gettext('Name'),
                    render: (data, type, row) => {
                        return row.title || ''
                    }
                },
                {
                    width: '55%',
                    title: $.fn.gettext('Note'),
                    render: (data, type, row) => {
                        return row.description || ''
                    }
                },
            ],
        })
    }

    function initPaymentDataTable(data = []) {
        if ($.fn.DataTable.isDataTable(pageElement.payment.$table)) {
            pageElement.payment.$table.DataTable().destroy()
        }

        pageElement.payment.$table.DataTableDefault({
            data: data,
            reloadCurrency: true,
            rowIdx: true,
            autoWidth: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            columns: [
                {
                    width: '7%',
                    title: $.fn.gettext('Installment'),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        let installmentNumber = Number(meta.row) + 1;
                        let installmentText = $.fn.gettext('Installment')
                        return `${installmentText} ${installmentNumber}`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Description'),
                    render: (data, type, row, meta) => {
                        const description = row?.description || ''
                        return `<div class="input-group">
                                    <textarea
                                        class="form-control payment-description"
                                        rows="2"
                                    >${description}</textarea>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Payment Type'),
                    render: (data, type, row, meta) => {
                        const paymentType = row.payment_type ?? 0
                        return `<div class="input-group">
                                    <select class="form-select payment-type-select">
                                        <option value="0" ${paymentType === 0 && 'selected'}>
                                            ${$.fn.gettext('Advance')}
                                        </option>
                                        <option value="1" ${paymentType === 1 && 'selected'}>
                                            ${$.fn.gettext('Payment')}
                                        </option>
                                    </select>
                                </div>`
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Invoice'),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        const isInvoiceRequired = row.is_invoice_required ?? false
                        return `<div class="form-check">
                                    <input type="checkbox" ${isInvoiceRequired && 'checked'} class="form-check-input invoice-require">
                                </div>`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Payment Value'),
                    render: (data, type, row, meta) => {
                        const paymentValue = row.payment_value ?? 0
                        const isInvoice = row.is_invoice_required
                        const paymentRowId = row.id
                        return `<div class="d-flex align-items-center">
                                    <div>
                                        <span class="mask-money payment-value" data-init-money="${paymentValue}"></span>
                                    </div>
                                    <button data-row-id="${paymentRowId}" type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover ml-2 btn-open-payment-detail">
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Tax'),
                    render: (data, type, row, meta) => {
                        const taxValue = row.tax_value ?? 0
                        return `<div class="input-group">
                                    <span class="mask-money payment-tax" data-init-money="${taxValue}"></span>
                                </div>`
                    }
                },
                {
                    width: '12%',
                    title: $.fn.gettext('Reconcile'),
                    render: (data, type, row, meta) => {
                        const reconcile = row.reconcile_value ?? 0
                        return `<div class="input-group">
                                    <span class="mask-money payment-reconcile" data-init-money="${reconcile}"></span>
                                </div>`
                    }
                },
                {
                    width: '12%',
                    title: $.fn.gettext('Receivable Value'),
                    render: (data, type, row, meta) => {
                        const receivableValue = row.receivable_value ?? 0
                        return `<div class="input-group">
                                    <span class="mask-money payment-receivable-value" data-init-money="${receivableValue}"></span>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Due Date'),
                    render: (data, type, row) => {
                        const dueDate = row.due_date || ''
                        return `<div class="input-group">
                                    <input type="text" class="form-control date-input payment-due-date" value="${dueDate}" placeholder="DD/MM/YYYY">
                                </div>`
                    }
                },
                {
                    width: '4%',
                    title: $.fn.gettext('Action'),
                    className: 'text-center',
                    render: (data, type, row) => {
                        return `<button
                                    type="button"
                                    class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover delete-payment-row"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Delete"
                                >
                                    <span class="icon"><i class="far fa-trash-alt"></i></span>
                                </button>`
                    }
                }
            ],
            drawCallback: function (settings) {
                // Initialize date inputs AFTER all DOM manipulations
                const api = this.api();

                // First, do the row indexing
                api.rows().every(function (rowIdx) {
                    const $row = $(this.node())
                    let data = this.data()

                    data.installment = rowIdx + 1
                    this.data(data)
                    $row.attr('data-payment-row-id', data.id)
                })

                // Then initialize date pickers after DOM is stable
                pageElement.payment.$table.find('input.date-input').each(function(){
                    const $input = $(this)

                    // Check if already initialized and destroy if needed
                    if ($input.data('daterangepicker')) {
                        $input.data('daterangepicker').remove();
                    }

                    const value = $input.val()

                    // Initialize with empty: true to allow clearing
                    UsualLoadPageFunction.LoadDate({
                        element: $input,
                        empty: true
                    })

                    // Set value if exists
                    if (value && $input.data('daterangepicker')) {
                        $input.data('daterangepicker').setStartDate(value)
                    }
                })
            }
        })
    }

    function initNoInvoicePaymentDetailModalDataTable(data=[]){
        if ($.fn.DataTable.isDataTable(pageElement.modalData.$tablePaymentDetailNoInvoice)) {
            pageElement.modalData.$tablePaymentDetailNoInvoice.DataTable().destroy()
        }

        pageElement.modalData.$tablePaymentDetailNoInvoice.DataTableDefault({
            data: data,
            reloadCurrency: true,
            rowIdx: false,
            autoWidth: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            columns: [
                {
                    width: '5%',
                    title: '',
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        const serviceRowId = row.service_id
                        const isChecked = row.is_selected
                        return `<div class="form-check">
                                    <input 
                                        ${isChecked ? 'checked' : ''}
                                        data-service-row-id=${serviceRowId}
                                        type="checkbox"  
                                        class="form-check-input"
                                    />
                                </div>`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Name'),
                    render: (data, type, row, meta) => {
                        const name = row.title
                        return `${name}`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Total Before Tax'),
                    render: (data, type, row, meta) => {
                        const subTotal = row.sub_total_value
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${subTotal}"></span>
                                </div>`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Value') + ' %',
                    render: (data, type, row, meta) => {
                        const paymentPercentage = row.payment_percent
                        return `<div class="input-group">
                                    <input
                                        type="number"
                                        class="form-control no-invoice-payment-detail-percentage"
                                        value="${paymentPercentage}"
                                        min="0"
                                        max="100"
                                    />
                                    <span class="input-group-text">%</span>
                                </div>`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Value'),
                    render: (data, type, row, meta) => {
                        const paymentValue = row.payment_value
                        return `<div class="input-group">
                                    <input
                                        type="text"
                                        class="form-control no-invoice-payment-detail-value mask-money"
                                        value="${paymentValue}"
                                    />
                                </div>`
                    }
                },
            ],
        })
    }

    function initPaymentDetailModalDataTable(data=[]){
        if ($.fn.DataTable.isDataTable(pageElement.modalData.$tablePaymentDetail)) {
            pageElement.modalData.$tablePaymentDetail.DataTable().destroy()
        }

        pageElement.modalData.$tablePaymentDetail.DataTableDefault({
            data: data,
            reloadCurrency: true,
            rowIdx: false,
            autoWidth: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            columns: [
                {
                    width: '3%',
                    title: '',
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        const serviceRowId = row.service_id
                        const isChecked = row.is_selected
                        return `<div class="form-check">
                                    <input 
                                        ${isChecked ? 'checked' : ''}
                                        data-service-row-id=${serviceRowId}
                                        type="checkbox"  
                                        class="form-check-input"
                                    />
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Name'),
                    render: (data, type, row, meta) => {
                        const name = row.title
                        return `${name}`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Total Before Tax'),
                    render: (data, type, row, meta) => {
                        const subTotal = row.sub_total_value || 0
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${subTotal}"></span>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Issued Invoice'),
                    render: (data, type, row, meta) => {
                        let issuedInvoiceValue = row.issued_value || 0
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${issuedInvoiceValue}"></span>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Balance'),
                    render: (data, type, row, meta) => {
                        let balance = row.balance_value || 0
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${balance}"></span>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Invoice value') + ' %',
                    render: (data, type, row, meta) => {
                        const paymentPer = row.payment_percent || 0
                        return `<div class="input-group">
                                    <input
                                        type="number"
                                        class="form-control payment-detail-percentage"
                                        value="${paymentPer}"
                                        min="0"
                                        max="100"
                                    />
                                    <span class="input-group-text">%</span>
                                </div>`
                    }
                },
                {
                    width: '12%',
                    title: $.fn.gettext('Invoice value'),
                    render: (data, type, row, meta) => {
                        const paymentValue = row.payment_value || 0
                        return `<div class="input-group">
                                    <input
                                        type="text"
                                        class="form-control payment-detail-value mask-money"
                                        value="${paymentValue}"
                                    />
                                </div>`
                    }
                },
                {
                    width: '8%',
                    title: $.fn.gettext('VAT'),
                    render: (data, type, row, meta) => {
                        const taxValue = row.tax_value || 0
                        return `<div class="input-group">
                                    <span class="mask-money payment-detail-tax-value" data-init-money="${taxValue}"></span>
                                </div>`
                    }
                },
                {
                    width: '12%',
                    title: $.fn.gettext('Reconcile value'),
                    render: (data, type, row, meta) => {
                        const reconcileValue = row.reconcile_value || 0
                        const serviceRowId = row.service_id
                        return `<div class="d-flex align-items-center">
                                    <div>
                                        <span class="mask-money payment-detail-reconcile-value" data-init-money="${reconcileValue}"></span>
                                    </div>
                                    <button data-service-row-id="${serviceRowId}" type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover ml-2 btn-open-reconcile">
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Receivable value'),
                    render: (data, type, row, meta) => {
                        const receivableValue = row.receivable_value || 0
                        return `<div class="input-group">
                                    <span class="mask-money payment-detail-receivable-value" data-init-money="${receivableValue}"></span>
                                </div>`
                    }
                },
            ],
        })
    }

    function initPaymentReconcileModalDataTable(data=[]){
        if ($.fn.DataTable.isDataTable(pageElement.modalData.$tablePaymentReconcile)) {
            pageElement.modalData.$tablePaymentReconcile.DataTable().destroy()
        }

        pageElement.modalData.$tablePaymentReconcile.DataTableDefault({
            data: data,
            reloadCurrency: true,
            rowIdx: false,
            autoWidth: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            columns: [
                {
                    width: '5%',
                    title: '',
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        const isChecked = row.is_selected
                        const paymentDetailServiceId = pageElement.modalData.$tablePaymentReconcile.attr('data-service-row-id')
                        const rowServiceId = row.service_id
                        const isDisabled = paymentDetailServiceId !== rowServiceId

                        return `<div class="form-check">
                                    <input
                                        ${isDisabled ? 'disabled': '' }
                                        ${isChecked ? 'checked' : ''}
                                        type="checkbox"  
                                        class="form-check-input"
                                    />
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Installment'),
                    render: (data, type, row, meta) => {
                        const installment = row.installment
                        return `${installment}`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Service Name'),
                    render: (data, type, row, meta) => {
                        const name = row.title
                        return `${name}`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Total'),
                    render: (data, type, row, meta) => {
                        const total = row.total_value
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${total}"></span>
                                </div>`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Reconciled Value'),
                    render: (data, type, row, meta) => {
                        const reconciledValue = row.total_reconciled_value
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${reconciledValue}"></span>
                                </div>`
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Current Reconcile Value'),
                    render: (data, type, row, meta) => {
                        const value = row.reconcile_value
                        const paymentDetailServiceId = pageElement.modalData.$tablePaymentReconcile.attr('data-service-row-id')
                        const rowServiceId = row.service_id
                        const isDisabled = paymentDetailServiceId !== rowServiceId

                        return `<div class="input-group">
                                    <input
                                        ${isDisabled ? 'disabled': '' }
                                        type="text"
                                        class="form-control mask-money payment-detail-reconcile-value"
                                        value="${value}"
                                    />
                                </div>`
                    }
                },
            ]
        })
    }

// --------------------HANDLE EVENTS---------------------

    function handleCheckProduct(){
        pageElement.modalData.$tableProduct.on('change', 'input[name="select-product"]', function () {
            const $checkbox = $(this);
            const productId = $checkbox.data('product-id');
            const rowData = pageElement.modalData.$tableProduct.DataTable().row($checkbox.closest('tr')).data();

            if ($checkbox.is(':checked')) {
                if (!pageVariable.tempSelectedProducts.some(p => p.product_id === productId)) {
                    pageVariable.tempSelectedProducts.push(transformProductData(rowData, productId));
                }
            } else {
                pageVariable.tempSelectedProducts = pageVariable.tempSelectedProducts.filter(p => p.product_id !== productId);
            }
        });
        pageElement.modalData.$tableProduct.on('draw.dt', function () {
            pageElement.modalData.$tableProduct.find('input[name="select-product"]').each(function () {
                const $checkbox = $(this);
                const productId = $checkbox.data('product-id');

                if (pageVariable.tempSelectedProducts.some(p => p.product_id === productId)) {
                    $checkbox.prop('checked', true);
                }
            });
        });
    }

    function handleSaveProduct() {
        pageElement.modalData.$btnSaveProduct.on('click', function (e) {
            const checkedProducts = [...pageVariable.tempSelectedProducts];

            // Add checked products to service detail table
            if (checkedProducts.length > 0) {
                if (pageVariable.modalContext === 'serviceDetail') {
                    const table = pageElement.serviceDetail.$table.DataTable()
                    const currentData = table.data().toArray()
                    const newData = [...currentData, ...checkedProducts]
                    table.clear().rows.add(newData).draw(false)
                    loadServiceDetailSummaryValue()
                } else if (pageVariable.modalContext === 'workOrder') {
                    const table = pageElement.workOrder.$table.DataTable()
                    const currentData = table.data().toArray()
                    const newData = [...currentData, ...checkedProducts]
                    table.clear().rows.add(newData).draw(false)
                }
                pageElement.modalData.$tableProduct.find('input[name="select-product"]').prop('checked', false)
            }
        })

        $('#modal-product').on('hidden.bs.modal', function () {
            pageVariable.tempSelectedProducts = [];
        });

    }

    function handleSaveExchangeRate(){
        pageElement.modalData.$btnSaveExchangeRate.on('click', function (e) {
            const table = pageElement.modalData.$tableExchangeRate.DataTable()
            const rows = table.rows()
            const currencyData = []
            rows.every(function(){
                const $row = $(this.node())
                const rowData = this.data()
                const $rate = $row.find('input[type="text"]')
                const rateValue = Number($rate.val())
                console.log($rate.val())
                rowData.rate = rateValue || 0
                $rate.attr('value', rateValue)
                currencyData.push(rowData)
            })
            pageVariable.currencyList = currencyData

            Object.keys(pageVariable.workOrderCostData).forEach(workOrderId => {
                const costDataList = pageVariable.workOrderCostData[workOrderId]

                if (costDataList && costDataList.length > 0) {
                    costDataList.forEach(costItem => {
                        const totalData = calculateWorkOrderCostTotalData(costItem)
                        costItem.total_value = totalData.total_value
                        costItem.exchanged_total_value = totalData.exchanged_total_value
                    })

                    const $workOrderRow = pageElement.workOrder.$table.find(`.btn-open-work-order-cost[data-work-order-id=${workOrderId}]`).closest('tr')
                    if ($workOrderRow.length > 0) {
                        const workOrderTable = pageElement.workOrder.$table.DataTable()
                        const workOrderRowData = workOrderTable.row($workOrderRow).data()

                        let totalAmount = 0
                        costDataList.forEach(item => {
                            totalAmount += item.exchanged_total_value || 0
                        })

                        workOrderRowData.unit_cost = totalAmount
                        workOrderRowData.total_value = totalAmount * workOrderRowData.quantity

                        $workOrderRow.find('.work-order-unit-cost').attr('data-init-money', totalAmount)
                        $workOrderRow.find('.work-order-total-amount').attr('data-init-money', totalAmount * workOrderRowData.quantity)

                        $.fn.initMaskMoney2()

                        // workOrderTable.row($workOrderRow).data(workOrderRowData).draw(false)
                    }
                }
            })
        })
    }

    function handleOpportunityChange() {
        $(document).on('change', '#opportunity_id', function (e) {
            const $select = $(e.currentTarget);
            let oppData = SelectDDControl.get_data_from_idx($select, $select.val());
            FormElementControl.loadInitS2(pageElement.commonData.$customer, [oppData?.customer]);
        });
    }

    // ============ service detail =============

    function handleChangeServiceDetail(){
        pageElement.serviceDetail.$table.on('change', '.service-duration', function(e){
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')

            const tableServiceDetail = pageElement.serviceDetail.$table.DataTable()
            const rowData = tableServiceDetail.row($row).data()

            const newDuration = Number($ele.val())

            // Update the data
            rowData.duration = newDuration

            // Calculate new total (quantity * price)
            const quantity = rowData.quantity || 1
            const price = parseFloat(rowData.price) || 0;
            const taxRate = parseFloat(rowData.tax_data?.rate || 0) / 100
            const subtotal = newDuration * price * quantity
            const taxAmount = subtotal * taxRate
            rowData.sub_total_value = subtotal
            rowData.total_value = subtotal + taxAmount

            if (window.productAttributeInstance) {
                if(window.productAttributeInstance.hasAttributes()){
                    $(document).trigger('changeDuration', Number($ele.val()))
                } else {
                    //update total
                    const $totalMoney = $row.find('.service-detail-total')
                    $totalMoney.attr('data-init-money', subtotal + taxAmount)
                    $.fn.initMaskMoney2();

                    // Update the summary values
                    loadServiceDetailSummaryValue();
                }
                window.productAttributeInstance.setRowData(JSON.parse(JSON.stringify(rowData)))
            }
        })

        pageElement.serviceDetail.$table.on('change', 'select.service-duration-select', function(e){
            const $select = $(e.currentTarget)
            const $row = $select.closest('tr')
            const durationId = $select.val()

            const tableServiceDetail = pageElement.serviceDetail.$table.DataTable()
            const rowData = tableServiceDetail.row($row).data()

            // Update the data
            rowData.duration_id = durationId
        })

        // Add tax change handler
        pageElement.serviceDetail.$table.on('change', '.service-tax-select', function(e){
            function updatePaymentRowAfterTaxChange(paymentId) {
                const paymentTable = pageElement.payment.$table.DataTable()
                const $paymentRow = pageElement.payment.$table.find(`[data-payment-row-id="${paymentId}"]`)

                if ($paymentRow.length > 0) {
                    const paymentDetails = pageVariable.paymentDetailData[paymentId] || []
                    const rowData = paymentTable.row($paymentRow).data()

                    let totalPaymentValue = 0
                    let totalTaxValue = 0
                    let totalReconcileValue = 0
                    let totalReceivableValue = 0

                    // Recalculate totals from all selected payment details
                    paymentDetails.forEach(detail => {
                        if (detail.is_selected) {
                            totalPaymentValue += detail.payment_value || 0
                            totalTaxValue += detail.tax_value || 0
                            totalReconcileValue += detail.reconcile_value || 0
                            totalReceivableValue += detail.receivable_value || 0
                        }
                    })

                    // Update row data
                    rowData.payment_value = totalPaymentValue
                    rowData.tax_value = totalTaxValue
                    rowData.reconcile_value = totalReconcileValue
                    rowData.receivable_value = totalReceivableValue

                    // Update UI elements
                    $paymentRow.find('.payment-value').attr('data-init-money', totalPaymentValue)
                    $paymentRow.find('.payment-tax').attr('data-init-money', totalTaxValue)
                    $paymentRow.find('.payment-reconcile').attr('data-init-money', totalReconcileValue)
                    $paymentRow.find('.payment-receivable-value').attr('data-init-money', totalReceivableValue)

                    $.fn.initMaskMoney2()
                }
            }

            const $select = $(e.currentTarget)
            const $row = $select.closest('tr')
            const taxId = $select.val()

            const tableServiceDetail = pageElement.serviceDetail.$table.DataTable()
            const rowData = tableServiceDetail.row($row).data()
            const serviceId = rowData.id

            // Find the tax object
            const taxData = pageVariable.taxList ? pageVariable.taxList.find(item => item.id === taxId) : null

            // Update the row data
            rowData.tax_data = taxData || {}
            rowData.tax_code = taxData?.code || ''

            // Recalculate totals with new tax
            const quantity = rowData.quantity || 1
            const duration = rowData.duration || 1
            const price = parseFloat(rowData.price) || 0
            const attrTotalCost = rowData.attributes_total_cost || 0
            const taxRate = (taxData?.rate || 0) / 100

            const subtotal = quantity * price * duration + attrTotalCost
            const taxAmount = subtotal * taxRate

            rowData.sub_total_value = subtotal
            rowData.total_value = subtotal + taxAmount

            // Update the total display
            const $totalMoney = $row.find('.service-detail-total')
            $totalMoney.attr('data-init-money', subtotal + taxAmount)

            // Update payment details that have invoice requirement
            const paymentTable = pageElement.payment.$table.DataTable()
            paymentTable.rows().every(function() {
                const paymentRowData = this.data()
                const paymentId = paymentRowData.id
                const isInvoiceRequired = paymentRowData.is_invoice_required

                // Only process payments with invoice requirement
                if (isInvoiceRequired && pageVariable.paymentDetailData[paymentId]) {
                    const paymentDetails = pageVariable.paymentDetailData[paymentId]
                    let needsUpdate = false

                    pageVariable.paymentDetailData[paymentId] = paymentDetails.map(detail => {
                        if (detail.service_id === serviceId) {
                            // Only update if this detail has tax_data (invoice-based payment)
                            if (detail.tax_data !== undefined) {
                                needsUpdate = true

                                // Update tax data
                                detail.tax_data = taxData || {}

                                // Recalculate tax value based on payment value
                                const paymentValue = detail.payment_value || 0
                                const newTaxRate = (taxData?.rate || 0) / 100
                                const newTaxValue = paymentValue * newTaxRate

                                // Update tax and receivable values
                                detail.tax_value = newTaxValue

                                // Recalculate receivable value: payment + tax - reconcile
                                const reconcileValue = detail.reconcile_value || 0
                                detail.receivable_value = paymentValue + newTaxValue - reconcileValue
                            }
                        }
                        return detail
                    })

                    // Update payment row totals if any detail was updated
                    if (needsUpdate) {
                        updatePaymentRowAfterTaxChange(paymentId)
                    }
                }
            })

            // Reinitialize money formatting
            $.fn.initMaskMoney2()

            // Update summary values
            loadServiceDetailSummaryValue()
        })

        $(document).on('productAttributeUpdate', function (e, data) {
            // data contains: rowIndex, rowData, attributes, totalCost, table

            const table = pageElement.serviceDetail.$table.DataTable();
            const rowIndex = data.rowIndex;

            // Get the row by index
            const row = table.row(rowIndex);
            const currentRowData = row.data();

            if (currentRowData) {
                // Update the row data with new attribute information
                currentRowData.selected_attributes = data.attributes;
                currentRowData.attributes_total_cost = data.totalCost
                currentRowData.has_attributes = true;

                const quantity = currentRowData.quantity || 1;
                const duration = currentRowData.duration || 1;
                const basePrice = parseFloat(currentRowData.price) || 0;

                // Base subtotal (without attributes)
                const baseSubtotal = duration * basePrice * quantity;

                // Add the new attribute total cost
                const subtotal = baseSubtotal + data.totalCost;

                // Update price-related fields
                currentRowData.sub_total_value = subtotal;

                // Recalculate tax
                const taxRate = (currentRowData.tax_data?.rate || 0) / 100;
                const taxAmount = subtotal * taxRate;

                currentRowData.total_value = subtotal + taxAmount;

                // Update the row data in the table
                row.data(currentRowData);

                // Update the displayed values in the DOM
                const $rowNode = $(row.node());

                // Update the total display
                $rowNode.find('.service-detail-total').attr('data-init-money', subtotal + taxAmount);

                // Reinitialize money formatting
                $.fn.initMaskMoney2();

                // Update the summary values
                loadServiceDetailSummaryValue();

                // Optionally, redraw the row to ensure all renders are updated
                table.row(rowIndex).invalidate().draw(false);
            }
        });
    }

    function handleChangeServiceDescription() {
        pageElement.serviceDetail.$table.on('change', 'textarea', function (e) {
            const $textArea = $(this)
            const $row = $textArea.closest('tr')
            const table = pageElement.serviceDetail.$table.DataTable()
            const rowData = table.row($row).data()
            const newDescription = $textArea.val()
            if (rowData) {
                rowData.description = newDescription
            }
        })
    }

    function handleChangeServiceQuantity() {
        function updateServiceQuantityAndResetData($input, $row, rowData) {
            const newQuantity = parseFloat($input.val()) || 0
            const serviceId = rowData.id

            // Update row data
            rowData.quantity = newQuantity

            // Calculate new total (quantity * price)
            const attrTotalCost = rowData?.['attributes_total_cost'] || 0
            const duration = rowData.duration || 1
            const price = parseFloat(rowData.price) || 0
            const taxRate = parseFloat(rowData.tax_data?.rate || 0) / 100
            const subtotal = newQuantity * price * duration + attrTotalCost
            const taxAmount = subtotal * taxRate
            rowData.sub_total_value = subtotal
            rowData.total_value = subtotal + taxAmount

            // Update total display
            const $totalMoney = $row.find('.service-detail-total')
            $totalMoney.attr('data-init-money', subtotal + taxAmount)

            // 1. Reset serviceDetailTotalContributionData
            if (pageVariable.serviceDetailTotalContributionData[serviceId]) {
                delete pageVariable.serviceDetailTotalContributionData[serviceId]
            }

            // 2. Reset product contribution data for this service
            Object.keys(pageVariable.productContributionData).forEach(workOrderId => {
                const contributions = pageVariable.productContributionData[workOrderId]
                if (contributions) {
                    pageVariable.productContributionData[workOrderId] = contributions.map(contribution => {
                        if (contribution.service_id === serviceId) {
                            return {
                                ...contribution,
                                quantity: newQuantity,
                                balance_quantity: newQuantity,
                                delivered_quantity: 0,
                                total_cost: 0
                            }
                        }
                        return contribution
                    })
                }
            })

            // 3. Reset serviceDetailTotalPaymentData
            if (pageVariable.serviceDetailTotalPaymentData[serviceId]) {
                delete pageVariable.serviceDetailTotalPaymentData[serviceId]
            }

            // 4. Reset payment detail data for this service
            Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
                const paymentDetails = pageVariable.paymentDetailData[paymentId]
                if (paymentDetails) {
                    pageVariable.paymentDetailData[paymentId] = paymentDetails.map(detail => {
                        if (detail.service_id === serviceId) {
                            // Reset payment detail for this service
                            const resetDetail = {
                                ...detail,
                                sub_total_value: subtotal,
                                payment_percent: 0,
                                payment_value: 0,
                                is_selected: false,
                            }

                            // For advance and invoiced payments, also reset additional fields
                            if (detail.tax_data !== undefined) {
                                resetDetail.tax_value = 0
                                resetDetail.issued_value = 0
                                resetDetail.balance_value = subtotal
                                resetDetail.reconcile_value = 0
                                resetDetail.receivable_value = 0
                            } else {
                                resetDetail.total_reconciled_value = 0
                            }

                            // Remove reconcile data for this payment detail
                            if (pageVariable.reconcileData[detail.id]) {
                                delete pageVariable.reconcileData[detail.id]
                            }

                            return resetDetail
                        }
                        return detail
                    })
                }
                updatePaymentRowAfterReset(paymentId)
            })

            $.fn.initMaskMoney2()
            loadServiceDetailSummaryValue()
        }

        pageElement.serviceDetail.$table.on('change', '.service-quantity', function (e) {
            const $input = $(this)
            const $row = $input.closest('tr')
            const table = pageElement.serviceDetail.$table.DataTable()
            const rowData = table.row($row).data()
            const serviceId = rowData.id

            // Check if there are any contributions linked to this service detail
            let hasLinkedContributions = false

            // Check through all work order contributions
            Object.keys(pageVariable.productContributionData).forEach(workOrderId => {
                const contributions = pageVariable.productContributionData[workOrderId]
                if (contributions && Array.isArray(contributions)) {
                    contributions.forEach(contribution => {
                        if (contribution.service_id === serviceId) {
                            // Check if this contribution has any meaningful data
                            if (contribution.is_selected ||
                                (contribution.contribution_percent && contribution.contribution_percent > 0) ||
                                (contribution.delivered_quantity && contribution.delivered_quantity > 0)) {
                                hasLinkedContributions = true
                            }
                        }
                    })
                }
            })

            // Check if there are any payment details linked to this service
            let hasLinkedPayments = false
            Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
                const paymentDetails = pageVariable.paymentDetailData[paymentId]
                if (paymentDetails && Array.isArray(paymentDetails)) {
                    paymentDetails.forEach(detail => {
                        if (detail.service_id === serviceId) {
                            if (detail.is_selected ||
                                (detail.payment_percent && detail.payment_percent > 0) ||
                                (detail.payment_value && detail.payment_value > 0)) {
                                hasLinkedPayments = true
                            }
                        }
                    })
                }
            })

            // If there are linked contributions or payments, show warning
            if (hasLinkedContributions || hasLinkedPayments) {
                let contribConfirmText = hasLinkedContributions ? 'contribution deliver quantity' : ''
                let paymentConfirmText = hasLinkedPayments ? 'payment data' : ''
                let linkText = (hasLinkedContributions && hasLinkedPayments) ? 'and' : ''

                const oldQuantity = rowData.quantity
                const confirmTitle = $.fn.gettext('Change service quantity')
                let confirmText = $.fn.gettext(`This action will reset ${contribConfirmText} ${linkText} ${paymentConfirmText}`)

                Swal.fire({
                    html: `
                        <div class="mb-3"><i class="ri-alert-line fs-5 text-warning"></i></div>
                        <h5 class="text-warning">${confirmTitle}</h5>
                        <div>${confirmText}</div>`,
                    customClass: {
                        confirmButton: 'btn btn-outline-secondary text-danger',
                        cancelButton: 'btn btn-outline-secondary text-gray',
                        container: 'swal2-has-bg',
                        actions: 'w-100'
                    },
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: $.fn.gettext('Confirm'),
                    cancelButtonText: $.fn.gettext('Cancel'),
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        // User confirmed - proceed with the update
                        updateServiceQuantityAndResetData($input, $row, rowData)
                    } else {
                        // User cancelled - restore the old quantity
                        $input.val(oldQuantity)
                    }
                })
            } else {
                // No linked contributions or payments - proceed without warning
                updateServiceQuantityAndResetData($input, $row, rowData)
            }
        })
    }

    function handleChangeServicePrice(){
        pageElement.serviceDetail.$table.on('change', '.service-detail-price', function (e) {
            const $input = $(this)
            const $row = $input.closest('tr')
            const table = pageElement.serviceDetail.$table.DataTable()
            const rowData = table.row($row).data()
            const dataWorkOrder = pageElement.workOrder.$table.DataTable().data().toArray()
            const dataPayment = pageElement.payment.$table.DataTable().data()

            // allow change without warning
            const newPrice = parseFloat($input.attr('value')) || 0
            const serviceId = rowData.id

            // Update row data
            rowData.price = newPrice

            // Calculate new total (quantity * price)
            const quantity = parseFloat(rowData.quantity) || 0;
            const duration = parseFloat(rowData.duration) || 1;
            const attrTotalCost = rowData.attributes_total_cost || 0;
            const taxRate = parseFloat(rowData.tax_data?.rate || 0) / 100
            const subtotal = newPrice * quantity * duration  + attrTotalCost
            const taxAmount = subtotal * taxRate
            rowData.sub_total_value = subtotal
            rowData.total_value = subtotal + taxAmount

            //update total
            const $totalMoney = $row.find('.service-detail-total')
            $totalMoney.attr('data-init-money', subtotal + taxAmount)

            // 3. Reset serviceDetailTotalPaymentData
            if (pageVariable.serviceDetailTotalPaymentData[serviceId]) {
                delete pageVariable.serviceDetailTotalPaymentData[serviceId]
            }

            // 4. Reset payment detail data for this service
            Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
                const paymentDetails = pageVariable.paymentDetailData[paymentId]
                if (paymentDetails) {
                    pageVariable.paymentDetailData[paymentId] = paymentDetails.map(detail => {
                        if (detail.service_id === serviceId) {
                            // Reset payment detail for this service
                            const resetDetail = {
                                ...detail,
                                sub_total_value: subtotal,
                                payment_percent: 0,
                                payment_value: 0,
                                is_selected: false,

                            }

                            // For each advance and invoiced payments, also reset additional fields
                            if (detail.tax_data !== undefined) {
                                resetDetail.tax_value = 0
                                resetDetail.issued_value = 0
                                resetDetail.balance_value = subtotal
                                resetDetail.reconcile_value = detail.payment_value || 0
                                resetDetail.receivable_value = 0
                            }
                            else {
                                resetDetail.total_reconciled_value = 0
                            }

                            // Remove reconcile data for this payment detail
                            if (pageVariable.reconcileData[detail.id]) {
                                delete pageVariable.reconcileData[detail.id]
                            }

                            return resetDetail
                        }
                        return detail
                    })
                }
                updatePaymentRowAfterReset(paymentId)
            })
            $.fn.initMaskMoney2()
            loadServiceDetailSummaryValue()

            // if(dataWorkOrder.length > 0 || dataPayment.length > 0){
            //     const confirmTitle = $.fn.gettext('Change service detail price')
            //     const confirmText = $.fn.gettext('This will reset the payment data')
            //     Swal.fire({
            //         html: `
            //             <div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>
            //             <h5 class="text-danger">${confirmTitle}</h5>
            //             <p>${confirmText}</p>`,
            //         customClass: {
            //             confirmButton: 'btn btn-outline-secondary text-danger',
            //             cancelButton: 'btn btn-outline-secondary text-gray',
            //             container: 'swal2-has-bg',
            //             actions: 'w-100'
            //         },
            //         showCancelButton: true,
            //         buttonsStyling: false,
            //         confirmButtonText: $.fn.gettext('Yes'),
            //         cancelButtonText: $.fn.gettext('Cancel'),
            //         reverseButtons: true
            //     }).then((result) => {
            //         if (result.value) {
            //             if (rowData) {
            //                 const newPrice = parseFloat($input.attr('value')) || 0
            //                 const serviceId = rowData.id
            //
            //                 // Update row data
            //                 rowData.price = newPrice
            //
            //                 // Calculate new total (quantity * price)
            //                 const quantity = parseFloat(rowData.quantity) || 0;
            //                 const duration = parseFloat(rowData.duration) || 1;
            //                 const attrTotalCost = rowData.attributes_total_cost || 0;
            //                 const taxRate = parseFloat(rowData.tax_data?.rate || 0) / 100
            //                 const subtotal = newPrice * quantity * duration  + attrTotalCost
            //                 const taxAmount = subtotal * taxRate
            //                 rowData.sub_total_value = subtotal
            //                 rowData.total_value = subtotal + taxAmount
            //
            //                 //update total
            //                 const $totalMoney = $row.find('.service-detail-total')
            //                 $totalMoney.attr('data-init-money', subtotal + taxAmount)
            //
            //                 // 3. Reset serviceDetailTotalPaymentData
            //                 if (pageVariable.serviceDetailTotalPaymentData[serviceId]) {
            //                     delete pageVariable.serviceDetailTotalPaymentData[serviceId]
            //                 }
            //
            //                 // 4. Reset payment detail data for this service
            //                 Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
            //                     const paymentDetails = pageVariable.paymentDetailData[paymentId]
            //                     if (paymentDetails) {
            //                         pageVariable.paymentDetailData[paymentId] = paymentDetails.map(detail => {
            //                             if (detail.service_id === serviceId) {
            //                                 // Reset payment detail for this service
            //                                 const resetDetail = {
            //                                     ...detail,
            //                                     sub_total_value: subtotal,
            //                                     payment_percent: 0,
            //                                     payment_value: 0,
            //                                     is_selected: false,
            //
            //                                 }
            //
            //                                 // For each advance and invoiced payments, also reset additional fields
            //                                 if (detail.tax_data !== undefined) {
            //                                     resetDetail.tax_value = 0
            //                                     resetDetail.issued_value = 0
            //                                     resetDetail.balance_value = subtotal
            //                                     resetDetail.reconcile_value = 0
            //                                     resetDetail.receivable_value = 0
            //                                 }
            //                                 else {
            //                                     resetDetail.total_reconciled_value = 0
            //                                 }
            //
            //                                 // Remove reconcile data for this payment detail
            //                                 if (pageVariable.reconcileData[detail.id]) {
            //                                     delete pageVariable.reconcileData[detail.id]
            //                                 }
            //
            //                                 return resetDetail
            //                             }
            //                             return detail
            //                         })
            //                     }
            //                     updatePaymentRowAfterReset(paymentId)
            //                 })
            //                 $.fn.initMaskMoney2()
            //                 loadServiceDetailSummaryValue()
            //             }
            //         }
            //         else {
            //             $input.val(rowData.quantity)
            //         }
            //     });
            // }
            // else {
            //      const newPrice = parseFloat($input.attr('value')) || 0
            //         const serviceId = rowData.id
            //
            //         // Update row data
            //         rowData.price = newPrice
            //
            //         // Calculate new total (quantity * price)
            //         const quantity = parseFloat(rowData.quantity) || 0;
            //         const duration = parseFloat(rowData.duration) || 1;
            //         const attrTotalCost = rowData.attributes_total_cost || 0;
            //         const taxRate = parseFloat(rowData.tax_data?.rate || 0) / 100
            //         const subtotal = newPrice * quantity * duration  + attrTotalCost
            //         const taxAmount = subtotal * taxRate
            //         rowData.sub_total_value = subtotal
            //         rowData.total_value = subtotal + taxAmount
            //
            //         //update total
            //         const $totalMoney = $row.find('.service-detail-total')
            //         $totalMoney.attr('data-init-money', subtotal + taxAmount)
            //
            //         // 3. Reset serviceDetailTotalPaymentData
            //         if (pageVariable.serviceDetailTotalPaymentData[serviceId]) {
            //             delete pageVariable.serviceDetailTotalPaymentData[serviceId]
            //         }
            //
            //         // 4. Reset payment detail data for this service
            //         Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
            //             const paymentDetails = pageVariable.paymentDetailData[paymentId]
            //             if (paymentDetails) {
            //                 pageVariable.paymentDetailData[paymentId] = paymentDetails.map(detail => {
            //                     if (detail.service_id === serviceId) {
            //                         // Reset payment detail for this service
            //                         const resetDetail = {
            //                             ...detail,
            //                             sub_total_value: subtotal,
            //                             payment_percent: 0,
            //                             payment_value: 0,
            //                             is_selected: false,
            //
            //                         }
            //
            //                         // For each advance and invoiced payments, also reset additional fields
            //                         if (detail.tax_data !== undefined) {
            //                             resetDetail.tax_value = 0
            //                             resetDetail.issued_value = 0
            //                             resetDetail.balance_value = subtotal
            //                             resetDetail.reconcile_value = 0
            //                             resetDetail.receivable_value = 0
            //                         }
            //                         else {
            //                             resetDetail.total_reconciled_value = 0
            //                         }
            //
            //                         // Remove reconcile data for this payment detail
            //                         if (pageVariable.reconcileData[detail.id]) {
            //                             delete pageVariable.reconcileData[detail.id]
            //                         }
            //
            //                         return resetDetail
            //                     }
            //                     return detail
            //                 })
            //             }
            //             updatePaymentRowAfterReset(paymentId)
            //         })
            //         $.fn.initMaskMoney2()
            //         loadServiceDetailSummaryValue()
            // }
        })
    }

    function handleChangeServicePercentage() {
        pageElement.serviceDetail.$table.on('change', '.service-percentage', function(e) {
            const $input = $(this)
            const $row = $input.closest('tr')
            const table = pageElement.serviceDetail.$table.DataTable()
            const rowData = table.row($row).data()

            const newPercentage = parseFloat($input.val()) || 0

            // Validate individual percentage
            if (newPercentage < 0 || newPercentage > 100) {
                $.fn.notifyB({
                    description: $.fn.gettext('Percentage must be between 0 and 100')
                }, 'failure')
                $input.val(rowData.service_percent || 0)
                return
            }

            // Calculate total percentage across all rows
            let totalPercentage = 0
            table.rows().every(function() {
                const data = this.data()
                const $currentRow = $(this.node())

                if ($currentRow[0] === $row[0]) {
                    // Use the new value for the current row
                    totalPercentage += newPercentage
                } else {
                    // Use existing values for other rows
                    const existingPercentage = parseFloat(data.service_percent) || 0
                    totalPercentage += existingPercentage
                }
            })

            // Check if total exceeds 100%
            if (totalPercentage > 100) {
                $.fn.notifyB({
                    description: $.fn.gettext(`Total percentage cannot exceed 100%. Current total would be ${totalPercentage.toFixed(2)}%`)
                }, 'failure')
                $input.val(rowData.service_percent || 0)
                return
            }

            // Update the row data
            rowData.service_percent = newPercentage

            // Update percentage display in footer or summary area
            updateServicePercentageSummary()
        })
    }

    function updateServicePercentageSummary() {
        const table = pageElement.serviceDetail.$table.DataTable()
        let totalPercentage = 0

        table.rows().every(function() {
            const rowData = this.data()
            totalPercentage += parseFloat(rowData.service_percent) || 0
        })

        // You can display this somewhere in your UI
        const remaining = 100 - totalPercentage

        // Optional: Add a visual indicator for the total
        if (Math.abs(totalPercentage - 100) < 0.01) {
            // Total is 100% (allowing for floating point precision)
            console.log('Total percentage is 100%')
        } else if (totalPercentage < 100) {
            console.log(`Remaining: ${remaining.toFixed(2)}%`)
        }
    }

    // Helper function to update payment row totals after reset
    function updatePaymentRowAfterReset(paymentId) {
        const paymentTable = pageElement.payment.$table.DataTable()
        const $paymentRow = pageElement.payment.$table.find(`[data-payment-row-id="${paymentId}"]`)

        if ($paymentRow.length > 0) {
            const paymentDetails = pageVariable.paymentDetailData[paymentId] || []
            const rowData = paymentTable.row($paymentRow).data()

            let totalPaymentValue = 0
            let totalTaxValue = 0
            let totalReconcileValue = 0
            let totalReceivableValue = 0

            // Recalculate totals from remaining selected payment details
            paymentDetails.forEach(detail => {
                if (detail.is_selected) {
                    totalPaymentValue += detail.payment_value || 0
                    totalTaxValue += detail.tax_value || 0
                    totalReconcileValue += detail.reconcile_value || 0
                    totalReceivableValue += detail.receivable_value || 0
                }
            })

            // Update row data
            rowData.payment_value = totalPaymentValue
            rowData.tax_value = totalTaxValue
            rowData.reconcile_value = totalReconcileValue
            rowData.receivable_value = totalReceivableValue

            // Update UI
            $paymentRow.find('.payment-value').attr('data-init-money', totalPaymentValue)
            $paymentRow.find('.payment-tax').attr('data-init-money', totalTaxValue)
            $paymentRow.find('.payment-reconcile').attr('data-init-money', totalReconcileValue)
            $paymentRow.find('.payment-receivable-value').attr('data-init-money', totalReceivableValue)


            $.fn.initMaskMoney2()
        }
    }


    // ============ work =============

    function handleChangeWorkOrderDetail(){
        function validateDates(rowData) {
            if (rowData.start_date && rowData.end_date) {
                const startDate = moment(rowData.start_date, 'DD/MM/YYYY')
                const endDate = moment(rowData.end_date, 'DD/MM/YYYY')

                if (endDate.isSameOrBefore(startDate)) {
                    $.fn.notifyB({description: $.fn.gettext('End date must be greater than start date')}, 'failure')
                    return false
                }
            }
            return true
        }
        pageElement.workOrder.$table.on('apply.daterangepicker', '.work-order-start-date', function (ev, picker) {
            const $input = $(ev.currentTarget)
            const $row = $input.closest('tr')
            const table = pageElement.workOrder.$table.DataTable()
            const rowData = table.row($row).data()
            const oldStartDate = rowData.start_date
            rowData.start_date = moment(picker.startDate).format('DD/MM/YYYY')
            if (!validateDates(rowData)) {
                rowData.start_date = oldStartDate
                $input.val(oldStartDate || '')
            }
        })
        pageElement.workOrder.$table.on('apply.daterangepicker', '.work-order-end-date', function (ev, picker) {
            const $input = $(ev.currentTarget)
            const $row = $input.closest('tr')
            const table = pageElement.workOrder.$table.DataTable()
            const rowData = table.row($row).data()
            const oldEndDate = rowData.end_date
            rowData.end_date = moment(picker.endDate).format('DD/MM/YYYY')
        })
        pageElement.workOrder.$table.on('click', '.btn-open-task', function () {
            TaskExtend.openAddTaskFromTblRow(this, pageElement.workOrder.$table);
        })
        pageElement.workOrder.$table.on('click', '.btn-list-task', function () {
            TaskExtend.openListTaskFromTblRow(this, pageElement.workOrder.$table);
        })
        // pageElement.workOrder.$table.on('click', '.work-order-del-row', function () {
        //     TaskExtend.delTaskFromDelRow(this);
        // })
        pageElement.workOrder.$table.on('change', '.work-order-quantity', function (e){
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.workOrder.$table.DataTable()
            const rowData = table.row($row).data()
            rowData.quantity = Number($ele.val() || 0)

            const totalData = calculateWorkOrderCostTotalData(rowData)
            rowData.total_value = totalData.total_value
            rowData.exchanged_total_value = totalData.exchanged_total_value
            table.row($row).data(rowData).draw(false)
            loadWorkOrderDetailSummaryValue()
        })
        pageElement.workOrder.$table.on('change', '.work-order-description', function (e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.workOrder.$table.DataTable()
            const rowData = table.row($row).data()
            rowData.title = $ele.val()
        })
    }

    function handleClickOpenWorkOrderCost() {
        pageElement.workOrder.$table.on('click', '.btn-open-work-order-cost', function(e){
            const $row = $(e.currentTarget).closest('tr')
            const table = pageElement.workOrder.$table.DataTable()
            const rowData = table.row($row).data()
            const rowId = rowData.id
            // const rowIndex = table.row($row).index()
            let rowWorkOrderCost = pageVariable.workOrderCostData[rowId]

            if(!rowWorkOrderCost || rowWorkOrderCost?.length === 0){
                rowWorkOrderCost = [{}]
            }

            pageElement.modalData.$tableWorkOrderCost.attr('data-work-order-id', rowId)
            initWorkOrderCostModalDataTable(rowWorkOrderCost)
        })
    }

    function handleSelectWorkOrderCostTax() {
        pageElement.modalData.$tableWorkOrderCost.on('change', 'select.tax-select', function (e) {
            const $select = $(e.currentTarget)
            const $row = $select.closest('tr')
            const taxId = $select.val()

            const tableWorkOrderCost = pageElement.modalData.$tableWorkOrderCost.DataTable()
            const rowData = tableWorkOrderCost.row($row).data()

            // Update the data
            rowData.tax_id = taxId

            // Find the tax object
            const tax = pageVariable.taxList ? pageVariable.taxList.find(item => item.id === taxId) : null
            const taxRate = tax ? (tax.rate || 0) / 100 : 0

            // Recalculate totals
            const quantity = rowData.quantity || 0
            const unitCost = rowData.unit_cost || 0
            const subtotal = quantity * unitCost
            const taxAmount = subtotal * taxRate
            const total = subtotal + taxAmount

            // Calculate exchanged total
            let exchangedTotal = total
            if (rowData.currency_id && pageVariable.currencyList) {
                const currency = pageVariable.currencyList.find(c => c.id === rowData.currency_id)
                if (currency && currency.rate) {
                    exchangedTotal = total * currency.rate
                }
            }
            $row.find('.order-cost-total').attr('data-init-money', total)
            $row.find('.order-cost-exchanged-total').attr('data-init-money', exchangedTotal)
            rowData.total_value = total
            rowData.exchanged_total_value = exchangedTotal
            $.fn.initMaskMoney2()
            // tableWorkOrderCost.row($row).data(rowData).draw(false)
        })
    }

    function handleSelectWorkOrderCostExpense(){
        pageElement.modalData.$tableWorkOrderCost.on('change', 'select.work-order-cost-expense-select', function(e){
            const $select = $(e.currentTarget)
            const $row = $select.closest('tr')

            const expenseId = $select.val()
            const expenseData = SelectDDControl.get_data_from_idx($select, expenseId)

            const rowData = pageElement.modalData.$tableWorkOrderCost.DataTable().row($row).data()
            rowData.expense_item_id = expenseData?.id
            rowData.expense_data = {
                id: expenseData?.id,
                title: expenseData?.title
            }
        })
    }

    function handleSelectWorkOrderCurrency(){
        pageElement.modalData.$tableWorkOrderCost.on('change', '.currency-select', function (e) {
            const $select = $(e.currentTarget)
            const $row = $select.closest('tr')
            const currencyId = $select.val()

            const tableWorkOrderCost = pageElement.modalData.$tableWorkOrderCost.DataTable()
            const rowData = tableWorkOrderCost.row($row).data()

            rowData.currency_id = currencyId

            const totalData = calculateWorkOrderCostTotalData(rowData)
            rowData.total_value = totalData.total_value
            rowData.exchanged_total_value = totalData.exchanged_total_value
            tableWorkOrderCost.row($row).data(rowData).draw(false)
        })
    }

    function handleAddWorkOrderNonItem() {
        pageElement.workOrder.$btnAddNonItem.on('click', function(e) {
            const uniqueStr = Math.random().toString(36).slice(2)

            // Add empty row to work for manual entry
            const emptyWorkOrderItem = {
                id: uniqueStr,
                code: '',
                title: '',
                quantity: 1,
                unit_cost: 0,
                total_value: 0,
                start_date: '',
                end_date: '',
                is_delivery_point: false,
                status: 0
            }
            const table = pageElement.workOrder.$table.DataTable()
            const currentData = table.data().toArray()
            const newData = [...currentData, emptyWorkOrderItem]
            table.clear().rows.add(newData).draw(false)
        })
    }

    function handleAddWorkOrderCostRow(){
        pageElement.modalData.$tableWorkOrderCost.on('click', '.add-work-order-cost-row', function(e) {
            const table = pageElement.modalData.$tableWorkOrderCost.DataTable()
            const currentData = table.data().toArray()

            const newRow = {
                title: '',
                description: '',
                quantity: 0,
                unit_cost: 0,
                currency_id: '',
                tax_id: '',
                total_value: 0,
                exchanged_total_value: 0
            }

            currentData.push(newRow)
            table.clear().rows.add(currentData).draw(false)
        })
    }

    function handleChangeWorkOrderCostQuantityAndUnitCost() {
        pageElement.modalData.$tableWorkOrderCost.on('change', '.work-order-cost-quantity', function (e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.modalData.$tableWorkOrderCost.DataTable()

            const rowData = table.row($row).data()
            const currVal = Number($ele.val()) || 0
            rowData.quantity = currVal

            const totalData = calculateWorkOrderCostTotalData(rowData)
            rowData.total_value = totalData.total_value
            rowData.exchanged_total_value = totalData.exchanged_total_value
            table.row($row).data(rowData).draw(false)
        })
        pageElement.modalData.$tableWorkOrderCost.on('change', '.work-order-cost-unit-cost', function (e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.modalData.$tableWorkOrderCost.DataTable()
            const rowData = table.row($row).data()

            const currVal = Number($ele.attr('value')) || 0
            rowData.unit_cost = currVal

            const totalData = calculateWorkOrderCostTotalData(rowData)
            rowData.total_value = totalData.total_value
            rowData.exchanged_total_value = totalData.exchanged_total_value
            table.row($row).data(rowData).draw(false)
        })
    }

    function handleSaveWorkOrderCost(){
        pageElement.modalData.$btnSaveWorkOrderCost.on('click', function(e) {
            const workOrderRowId = pageElement.modalData.$tableWorkOrderCost.attr('data-work-order-id')
            const $workOrderRow = pageElement.workOrder.$table.find(`.btn-open-work-order-cost[data-work-order-id=${workOrderRowId}]`).closest('tr')

            const table = pageElement.modalData.$tableWorkOrderCost.DataTable()

            const workOrderCostList = table.data().toArray()

            let totalAmount = 0

            workOrderCostList.forEach((item, index) => {
                totalAmount += item.exchanged_total_value
                item.order = index
            })
            pageVariable.workOrderCostData[workOrderRowId] = workOrderCostList

            const workOrderRow = pageElement.workOrder.$table.DataTable().row($workOrderRow)
            const workOrderRowData = workOrderRow.data()
            workOrderRowData.unit_cost = totalAmount
            workOrderRowData.total_value = totalAmount * workOrderRowData.quantity
            pageElement.workOrder.$table.DataTable().row(workOrderRow).data(workOrderRowData).draw(false)

            loadWorkOrderDetailSummaryValue()
        })
    }

    function handleChangeWorkOrderCostTitleAndDescription() {
        pageElement.modalData.$tableWorkOrderCost.on('change', '.wo-cost-title, .wo-cost-description', function (e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.modalData.$tableWorkOrderCost.DataTable()
            const rowData = table.row($row).data()

            if($ele.hasClass('wo-cost-title')) {
                rowData.title = $ele.val()
            } else if ($ele.hasClass('wo-cost-description')) {
                rowData.description = $ele.val()
            }
        })
    }

    function handleClickOpenServiceDelivery() {
        pageElement.workOrder.$table.on('click', '.btn-open-service-delivery', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const rowId = $ele.attr('data-row-id')
            const serviceDeliveryCheckbox = $row.find('.work-order-service-delivery')
            const isDeliveryPoint = serviceDeliveryCheckbox.is(':checked')
            //add isDelivery field to modal
            pageElement.modalData.$modalProductContribution.data('is-delivery', isDeliveryPoint)

            const serviceDetailTable = pageElement.serviceDetail.$table.DataTable()
            const serviceDetailData = serviceDetailTable.data().toArray()

            pageElement.modalData.$modalProductContribution.data('row-id', rowId)

            //get new product contribution data from serviceDetail
            let productContributionData = serviceDetailData.map((sdItem, index) => {
                const serviceDetailId = sdItem.id
                const contributionData = pageVariable.serviceDetailTotalContributionData?.[serviceDetailId]
                const totalContribution = contributionData?.total_contribution_percent || 0
                //if .balance = null or undefined, get .quantity, else get .balance
                const balance = contributionData?.delivery_balance_value ?? sdItem.quantity
                const uniqueStr = Math.random().toString(36).slice(2)
                return {
                    id: uniqueStr,
                    service_id: serviceDetailId,
                    code: sdItem.code,
                    title: sdItem.title,
                    quantity: sdItem.quantity,
                    total_contribution_percent: totalContribution,
                    balance_quantity: balance,
                    contribution_percent: 0,
                    delivered_quantity: 0,
                    is_selected: false,
                    has_package: false,
                    unit_cost: 0,
                    total_cost: 0
                }
            })

            //join with current productcontribution
            const currProductContributionData = pageVariable.productContributionData?.[rowId]

            if(currProductContributionData) {
                productContributionData = productContributionData.map((pcItem, index) => {
                    const currProductContribution = currProductContributionData.find(cpcItem =>
                        cpcItem.service_id === pcItem.service_id
                    )
                    if(currProductContribution){
                        return {
                            ...pcItem,
                            id: currProductContribution.id,
                            is_selected: Boolean(currProductContribution.is_selected),
                            contribution_percent: currProductContribution.contribution_percent || 0,
                            delivered_quantity: currProductContribution.delivered_quantity || 0,
                            has_package: currProductContribution.has_package,
                            unit_cost: currProductContribution.unit_cost,
                            total_cost: currProductContribution.total_cost,
                        }
                    }
                    return pcItem
                })
            }
            pageVariable.productContributionData[rowId] = JSON.parse(JSON.stringify(productContributionData))
            initProductContributionModalDataTable(productContributionData)

            // set work description
            let desEle = $row[0].querySelector('.work-order-description');
            let desModalEle = pageElement.modalData.$modalProductContribution[0].querySelector('.work-order-description');
            if (desEle && desModalEle) {
                $(desModalEle).text($(desEle).val());

                let row = this.closest('tr');
                let rowIndex = pageElement.workOrder.$table.DataTable().row(row).index();
                let $rowCost = pageElement.workOrder.$table.DataTable().row(rowIndex);
                let dataRow = $rowCost.data();
                $(desModalEle).attr('data-work-id', dataRow?.['order']);
            }
        })
    }

    function handleSaveProductContribution(){
        pageElement.modalData.$btnSaveProductContribution.on('click', function(e) {
            const productContributionTable = pageElement.modalData.$tableProductContribution.DataTable()
            const workOrderRowId = pageElement.modalData.$modalProductContribution.data('row-id')

            let productContributionData = pageVariable.productContributionData[workOrderRowId]
            const productContributionTableRows = productContributionTable.rows()

            let isValid = true
            productContributionTableRows.every(function (rowIdx) {
                const $row = $(this.node())
                const $checkbox = $row.find('input[name="select-pc"]')
                const $contributionInput = $row.find('.pc-contribution')
                const $deliveredQuantityInput = $row.find('.pc-delivered-quantity')
                const $deliveryUnitCost = $row.find('.pc-unit-cost')

                const isSelected = $checkbox.is(':checked')
                const hasPackage = $row.find('.contribution-package').is(':checked')
                const rowId = $checkbox.data('service-row-id')
                let contribution = parseFloat($contributionInput.val()) || 0
                let deliveredQuantity = parseFloat($deliveredQuantityInput.val()) || 0
                let unitCost = parseFloat($deliveryUnitCost.attr('value')) || 0
                let totalCost = unitCost * deliveredQuantity  // Calculate total cost

                const serviceRowContributionData = productContributionData.find(item => item.service_id === rowId)
                const serviceRowContribution = serviceRowContributionData.contribution_percent
                const serviceRowDeliveredQuantity = serviceRowContributionData.delivered_quantity
                const serviceRowQuantity = serviceRowContributionData.quantity

                if(contribution > 100) {
                    $.fn.notifyB({description: $.fn.gettext(`Contribution must not exceed 100`)}, 'failure')
                    isValid = false
                    return false
                }

                if(deliveredQuantity > serviceRowQuantity) {
                    $.fn.notifyB({description: $.fn.gettext(`Delivered quantity must not exceed total quantity`)}, 'failure')
                    isValid = false
                    return false
                }

                const serviceDetailRowContributionData = pageVariable.serviceDetailTotalContributionData?.[rowId]
                if(serviceDetailRowContributionData){
                    const currTotalContribution = serviceDetailRowContributionData.total_contribution_percent
                    const currBalance = serviceDetailRowContributionData.delivery_balance_value

                    if(isSelected){
                        const newTotalContribution = currTotalContribution - serviceRowContribution + contribution
                        const newBalance = currBalance + serviceRowDeliveredQuantity - deliveredQuantity

                        if(newTotalContribution > 100) {
                            $.fn.notifyB({description: $.fn.gettext(`Contribution must not exceed 100`)}, 'failure')
                            isValid = false
                            return false
                        }

                        if(newBalance < 0) {
                            $.fn.notifyB({description: $.fn.gettext(`Delivered quantity must not exceed total quantity`)}, 'failure')
                            isValid = false
                            return false
                        }

                        pageVariable.serviceDetailTotalContributionData[rowId] = {
                            total_contribution_percent: newTotalContribution,
                            delivery_balance_value: newBalance,
                        }
                    }
                    else {
                        const newTotalContribution = currTotalContribution - serviceRowContribution
                        const newBalance = currBalance + serviceRowDeliveredQuantity

                        if(newTotalContribution > 100) {
                            $.fn.notifyB({description: $.fn.gettext(`Contribution must not exceed 100`)}, 'failure')
                            isValid = false
                            return false
                        }

                        if(newBalance < 0) {
                            $.fn.notifyB({description: $.fn.gettext(`Delivered quantity must not exceed total quantity`)}, 'failure')
                            isValid = false
                            return false
                        }

                        pageVariable.serviceDetailTotalContributionData[rowId] = {
                            total_contribution_percent: newTotalContribution,
                            delivery_balance_value: newBalance,
                        }
                    }
                }
                else {
                    if(isSelected){
                        pageVariable.serviceDetailTotalContributionData[rowId] = {
                            total_contribution_percent: contribution,
                            delivery_balance_value: serviceRowQuantity - deliveredQuantity,
                        }
                    }
                }

                productContributionData  = productContributionData.map((item)=>{
                    if(item.service_id === rowId){
                        return{
                            ...item,
                            has_package: hasPackage,
                            is_selected: isSelected,
                            contribution_percent: isSelected ? contribution : 0,
                            delivered_quantity: isSelected ? deliveredQuantity : 0,
                            total_contribution_percent: pageVariable.serviceDetailTotalContributionData[rowId]?.total_contribution_percent,
                            balance_quantity: pageVariable.serviceDetailTotalContributionData[rowId]?.delivery_balance_value,
                            unit_cost: isSelected ? unitCost : 0,
                            total_cost: isSelected ? totalCost : 0,
                        }
                    }
                    return item
                })
            })
            if(!isValid){
                return
            }
            pageVariable.productContributionData[workOrderRowId] = productContributionData

            // Sync balance to other contribution
            Object.keys(pageVariable.productContributionData).forEach(rowKey => {
                let productContribution = pageVariable.productContributionData[rowKey]
                productContribution = productContribution.map(item => {
                    const sdData = pageVariable.serviceDetailTotalContributionData[item.service_id]
                        if (sdData) {
                            return {
                                ...item,
                                total_contribution_percent: sdData.total_contribution_percent,
                                balance_quantity: sdData.delivery_balance_value,
                            }
                        }
                        return item
                })
                pageVariable.productContributionData[rowKey] = JSON.parse(JSON.stringify(productContribution))
            })
        })
    }

    function handleCheckDelivery(){
        pageElement.workOrder.$table.on('change', '.work-order-service-delivery', function(e) {
            const $ele = $(e.currentTarget)
            const isCheck = $ele.is(':checked')
            const $row = $ele.closest('tr')
            const table = pageElement.workOrder.$table.DataTable()
            const rowData = table.row($row).data()
            rowData.is_delivery_point = isCheck
            if (!isCheck) {
                const rowId = rowData.id
                const productContributions = pageVariable.productContributionData[rowId]

                if (productContributions) {
                    productContributions.forEach(item => {
                        if (item.delivered_quantity > 0) {
                            const serviceId = item.service_id

                            if (pageVariable.serviceDetailTotalContributionData[serviceId]) {
                                pageVariable.serviceDetailTotalContributionData[serviceId].delivery_balance_value += item.delivered_quantity
                            }

                            item.delivered_quantity = 0
                            item.is_selected = false
                            item.balance_quantity = pageVariable.serviceDetailTotalContributionData[serviceId]?.delivery_balance_value || item.quantity
                        }
                    })
                }
            }
        })
    }

    function handleUncheckContribution(){
        pageElement.modalData.$modalProductContribution.on('change', 'input[name="select-pc"]', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const isChecked = $ele.is(':checked')
            if(!isChecked){
                $row.find('.pc-contribution').val(0)
                $row.find('.pc-delivered-quantity').val(0)
                $row.find('.pc-unit-cost').attr('value', 0)
                $row.find('.pc-total-cost').attr('value', 0)
            }
            $.fn.initMaskMoney2()
        })
    }

    function handleChangeDeliveryCost(){
        pageElement.modalData.$modalProductContribution.on('change', '.pc-unit-cost', function(e) {
            const $input = $(e.currentTarget)
            const $row = $input.closest('tr')
            const table = pageElement.modalData.$tableProductContribution.DataTable()
            const rowData = table.row($row).data()

            const unitCost = parseFloat($input.attr('value')) || 0

            //auto check row
            if (unitCost > 0){
                $row.find('input[name="select-pc"]').prop('checked', true)
            }
            const deliveredQuantity = rowData.delivered_quantity || 0
            const totalCost = unitCost * deliveredQuantity

            rowData.unit_cost = unitCost
            rowData.total_cost = totalCost

            $row.find('.mask-money').attr('data-init-money', totalCost)
            $.fn.initMaskMoney2()
        })

        pageElement.modalData.$modalProductContribution.on('change', '.pc-delivered-quantity', function(e) {
            const $input = $(e.currentTarget)
            const $row = $input.closest('tr')
            const table = pageElement.modalData.$tableProductContribution.DataTable()
            const rowData = table.row($row).data()

            const deliveredQuantity = parseFloat($input.val()) || 0
            const unitCost = rowData.unit_cost || 0
            const totalCost = unitCost * deliveredQuantity

            //auto check row
            if (deliveredQuantity > 0){
                $row.find('input[name="select-pc"]').prop('checked', true)
            }

            rowData.delivered_quantity = deliveredQuantity
            rowData.total_cost = totalCost
            $row.find('.mask-money').attr('data-init-money', totalCost)
            $.fn.initMaskMoney2()
        })
    }

    function handleCheckPackage(){
        pageElement.modalData.$tableProductContribution.on('change', '.contribution-package', function(e) {
            const $ele = $(e.currentTarget)
            const isCheck = $ele.is(':checked')
            const $row = $ele.closest('tr')
            const table = pageElement.modalData.$tableProductContribution.DataTable()
            const rowData = table.row($row).data()
            rowData.has_package= isCheck

            if(!isCheck){
                const contributionId = rowData.id
                delete pageVariable.contributionPackageData[contributionId]
            }
        })
    }

    function handleOpenModalPackage(){
        pageElement.modalData.$tableProductContribution.on('click', '.btn-open-contribution-package', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const rowData = pageElement.modalData.$tableProductContribution.DataTable().row($row).data()
            const contributionId = $ele.attr('data-contribution-id')
            const shipmentTable = $('#table_shipment').DataTable()
            const shipmentData = shipmentTable.data().toArray()
            if(!rowData.has_package){
                return
            }
            let packageData = shipmentData.map((item, index) => {
                if(item.is_container){
                    return {
                        id: item.id,
                        is_container: true,
                        title: item.containerName,
                        description: item.containerNote,
                        packages: item.packages,
                        container_ref: item.containerRefNumber,
                        is_selected: false,
                    }
                }
                else {
                    return {
                        id: item.id,
                        is_container: false,
                        title: item.packageName,
                        description: item.packageNote,
                        container_ref: item.packageContainerRef,
                        is_selected: false,
                    }
                }
            })
            const currPackageData = pageVariable.contributionPackageData[contributionId]
            if(currPackageData) {
                packageData = packageData.map((pItem, index) => {
                    const currPackage = currPackageData.find(cpItem =>
                        pItem.id === cpItem.id
                    )
                    if(currPackage){
                        return {
                            ...pItem,
                            is_selected: currPackage.is_selected
                        }
                    }
                    return pItem
                })
            }

            pageVariable.contributionPackageData[contributionId] = JSON.parse(JSON.stringify(packageData))
            initContributionPackageModalDataTable(JSON.parse(JSON.stringify(packageData)))
            pageElement.modalData.$modalContributionPackage.modal('show')

            //save contribution id to btn save
            pageElement.modalData.$btnSaveContributionPackage.attr('data-contribution-id', contributionId)
        })
    }

    function handleSaveModalPackage(){
        pageElement.modalData.$btnSaveContributionPackage.on('click', function(e) {
            const $ele = $(e.currentTarget)
            const contributionID = $ele.attr('data-contribution-id')
            const table = pageElement.modalData.$tableContributionPackage.DataTable()

            // Get all rows data with their corresponding checkbox states
            let allRows = []

            // Loop through each row in the table
            table.rows().every(function(rowIdx) {
                const rowNode = this.node()
                const rowData = this.data()

                // Check if the checkbox in this row is checked
                const checkbox = $(rowNode).find('input[name="select-package"]')

                // Update the is_selected property based on current checkbox state
                rowData.is_selected = checkbox.prop('checked')

                // Add all rows (both checked and unchecked) to the array
                allRows.push(rowData)
            })

            // Save all rows to pageVariable with updated is_selected states
            pageVariable.contributionPackageData[contributionID] = JSON.parse(JSON.stringify(allRows))
        })
    }

    function handleTogglePackageChildren() {
        pageElement.modalData.$tableContributionPackage.on('click', '.btn-show-package-child', function(e) {
            const $btn = $(e.currentTarget);
            const $row = $btn.closest('tr');
            const table = pageElement.modalData.$tableContributionPackage.DataTable();
            const rowData = table.row($row).data();
            const containerRef = rowData.container_ref;

            // Toggle icon
            const $icon = $btn.find('i');
            const isExpanded = $icon.hasClass('fa-caret-down');

            if (isExpanded) {
                $icon.removeClass('fa-caret-down').addClass('fa-caret-right');
            } else {
                $icon.removeClass('fa-caret-right').addClass('fa-caret-down');
            }

            // Toggle visibility of child rows
            table.rows().every(function() {
                const childRowData = this.data();
                const $childRow = $(this.node());

                // Skip the container row itself
                if (childRowData.id === rowData.id) {
                    return;
                }

                // Check if this row belongs to the container
                if (!childRowData.is_container && childRowData.container_ref === containerRef) {
                    if (isExpanded) {
                        $childRow.hide();
                    } else {
                        $childRow.show();
                    }
                }
            });
        });
    }

    function handleSelectContainer() {
        pageElement.modalData.$tableContributionPackage.on('change', 'input[name="select-package"]', function(e) {
            const $checkbox = $(e.currentTarget);
            const $row = $checkbox.closest('tr');
            const table = pageElement.modalData.$tableContributionPackage.DataTable();
            const rowData = table.row($row).data();
            const isChecked = $checkbox.prop('checked');

            // Only process if this is a container row
            if (rowData.is_container) {
                const containerRef = rowData.container_ref;

                // Update all child packages with the same container_ref
                table.rows().every(function() {
                    const childRowData = this.data();
                    const $childRow = $(this.node());

                    // Skip the container row itself
                    if (childRowData.id === rowData.id) {
                        return;
                    }

                    // Check if this row is a child of the container
                    if (!childRowData.is_container && childRowData.container_ref === containerRef) {
                        // Update the checkbox
                        const $childCheckbox = $childRow.find('input[name="select-package"]');
                        $childCheckbox.prop('checked', isChecked);
                    }
                });
            }
        });
    }

    function handleChangeProductContributionPercentage(){
        pageElement.modalData.$tableProductContribution.on('input change', '.pc-contribution', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            // auto check row
            if ($ele.val() > 0){
                $row.find('input[name="select-pc"]').prop('checked', true)
            }
            updateRemainingContributionDisplay()
        })
    }

    function updateRemainingContributionDisplay() {
        const table = pageElement.modalData.$tableProductContribution.DataTable()

        table.rows().every(function() {
            const rowData = this.data()
            const $row = $(this.node())

            // Get current contribution value from input
            const currentContribution = parseFloat($row.find('.pc-contribution').val()) || 0

            // Old contribution from work
            const oldContribution = rowData.contribution_percent || 0

            // Get the badge
            const $remainingBadge = $row.find('.remaining-contribution')

            // Remaining contribution doesn't include current contribution value
            let remainingContribution = Number($remainingBadge.attr('data-remaining-contribution')) || 0
            let displayNumber = remainingContribution - currentContribution + oldContribution

            // Update badge class based on value
            $remainingBadge
                .removeClass('badge-soft-success badge-soft-warning badge-soft-danger')
                .addClass(() => {
                    if (Math.abs(displayNumber) < 0.01) {
                        return 'badge-soft-success'  // Fully allocated (0%)
                    } else if (displayNumber < 0) {
                        return 'badge-soft-danger'   // Over-allocated (negative)
                    } else {
                        return 'badge-soft-warning'  // Under-allocated (positive)
                    }
                })
                .text(`${displayNumber.toFixed(2)}%`)
        })
    }

    function handleClickOpenDeliveryLogs() {
        pageElement.modalData.$tableProductContribution.on('click', '.btn-delivery-log', function () {
            WindowControl.showLoading();
            let $transEle = $('#app-trans-factory');
            let $urlsEle = $('#script-url');
            let row = this.closest('tr');
            let desModalEle = pageElement.modalData.$modalProductContribution[0].querySelector('.work-order-description');
            let $modalEle = $('#deliveryLogModal');
            let $formEle = $('#form-update-service-order');
            if (row && desModalEle && $modalEle.length > 0 && $formEle.length > 0) {
                let bodyEle = $modalEle[0].querySelector('.modal-body');
                let rowIndex = pageElement.modalData.$tableProductContribution.DataTable().row(row).index();
                let $row = pageElement.modalData.$tableProductContribution.DataTable().row(rowIndex);
                let dataRow = $row.data();
                if (bodyEle) {
                    $.fn.callAjax2({
                            'url': pageElement.$urlScript.attr('data-delivery-log-url'),
                            'method': 'GET',
                            'data': {'service_order__document_root_id': $formEle.attr('data-idx')},
                            'isDropdown': true,
                        }
                    ).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                if (data.hasOwnProperty('delivery_work_log') && Array.isArray(data.delivery_work_log)) {
                                    let dataLogs = data.delivery_work_log;
                                    let workID = $(desModalEle).attr('data-work-id');
                                    $(bodyEle).empty();
                                    for (let dataLog of dataLogs) {
                                        let linkSO = $urlsEle.attr('data-service-order-detail-url').format_url_with_uuid(dataLog?.['service_order_data']?.['id']);
                                        for (let dataProd of dataLog?.['products']) {
                                            if (dataProd?.['product_data']?.['code'] === dataRow?.['code'] && String(dataProd?.['work_data']?.['order']) === workID) {
                                                $(bodyEle).append(`<div class="bg-light p-2 border rounded-5 mb-2">
                                                                    <div class="mb-2"><b class="text-primary">${$transEle.attr('data-service-order-version')}: </b><a href="${linkSO}" target="_blank" class="link-primary underline_hover">${dataLog?.['service_order_data']?.['code']}</a></div>
                                                                    <div class="mb-2"><b class="text-primary">${$transEle.attr('data-delivery-quantity')}: </b><span>${dataProd?.['delivery_quantity']}</span></div>
                                                                    </div>`);
                                            }
                                        }
                                    }
                                    $modalEle.modal('show');
                                    WindowControl.hideLoading();
                                }
                            }
                        }
                    )
                }
            }
        });
    }

    // ============ payment =============

    function handleChangePaymentDate() {
        pageElement.payment.$table.on('apply.daterangepicker', '.payment-due-date', function (ev, picker) {
            const $input = $(ev.currentTarget)
            const $row = $input.closest('tr')
            const table = pageElement.payment.$table.DataTable()
            const rowData = table.row($row).data()
            rowData.due_date = moment(picker.startDate).format('DD/MM/YYYY')
        })
    }

    function handleAddPaymentRow(){
        pageElement.payment.$btnAddInstallment.on('click', function(e) {
            const uniqueStr = Math.random().toString(36).slice(2)
            const newRowData = {
                description: '',
                payment_type: 0,
                is_invoice_required: false,
                payment_value: 0,
                tax_value: 0,
                reconcile_value: 0,
                receivable_value: 0,
                due_date: '',
                id: uniqueStr,
            }

            const table = pageElement.payment.$table.DataTable();

            table.row.add(newRowData).draw(false)
        })
    }

    function handleChangePaymentType(){
        pageElement.payment.$table.on('change', '.payment-type-select', function (e) {
            const paymentTable = pageElement.payment.$table.DataTable()
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')

            const rowData = paymentTable.row($row).data()
            rowData.payment_type = Number($ele.val())
        })
    }

    function handleCheckInvoice(){
        pageElement.payment.$table.on('change', '.invoice-require', function (e) {
            const paymentTable = pageElement.payment.$table.DataTable()
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const isChecked = $ele.is(':checked')
            const rowData = paymentTable.row($row).data()
            const rowId = rowData.id
            rowData.is_invoice_required = isChecked

            let isValid = true
            if (rowData.payment_type === PAYMENT_TYPE.payment && !isChecked){
                $.fn.notifyB({description: $.fn.gettext(`Payment must have an invoice`)}, 'failure')
                isValid = false
                //payment ko dc uncheck invoice
                rowData.is_invoice_required = true
                $ele.prop('checked', true)
            }

            //remove payment no invoice data
            if(isChecked && isValid){
                delete pageVariable.paymentDetailData[rowId]

                $row.find('.payment-value').attr('data-init-money', 0)
                $row.find('.payment-receivable-value').attr('data-init-money', 0)

                $.fn.initMaskMoney2()
            }
            //remove payment with invoice data
            else if(!isChecked && isValid) {
                let paymentData = pageVariable.paymentDetailData[rowId]
                if(paymentData){
                    paymentData.forEach((pdItem)=>{
                        const serviceId = pdItem.service_id
                        const totalPaymentData = pageVariable.serviceDetailTotalPaymentData[serviceId]
                        if(totalPaymentData){
                            let totalPercentage = totalPaymentData.total_payment_percent
                            let totalValue = totalPaymentData.total_payment_value

                            totalPercentage -= pdItem.payment_percent
                            totalValue -= pdItem.payment_value

                            pageVariable.serviceDetailTotalPaymentData[serviceId] = {
                                total_payment_percent: totalPercentage,
                                total_payment_value: totalValue
                            }
                        }
                    })
                }

                delete pageVariable.paymentDetailData[rowId]

                $row.find('.payment-value').attr('data-init-money', 0)
                $row.find('.payment-receivable-value').attr('data-init-money', 0)
                $row.find('.payment-tax').attr('data-init-money', 0)

                $.fn.initMaskMoney2()
            }

            // paymentTable.row($row).draw(false)
        })
    }

    function handleOpenPaymentDetail(){
        pageElement.payment.$table.on('click', '.btn-open-payment-detail', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const rowId = $ele.attr('data-row-id')
            const paymentTable = pageElement.payment.$table.DataTable()
            const rowData = paymentTable.row($row).data()

            const isInvoiceRequired = rowData.is_invoice_required
            const serviceTable = pageElement.serviceDetail.$table.DataTable()
            const serviceTableData = serviceTable.data().toArray()

            if(!isInvoiceRequired){
                pageElement.modalData.$modalPaymentDetailNoInvoice.attr('data-payment-row-id', rowId)
                let paymentDetailNoInvoiceData = serviceTableData.map((sdItem, index) => {
                    const serviceDetailId = sdItem.id
                    const paymentDetailId = Math.random().toString(36).slice(2)
                    return {
                        id: paymentDetailId, //generate a random id for payment detail row
                        service_id: serviceDetailId,
                        title: sdItem.title,
                        sub_total_value: sdItem.sub_total_value,
                        payment_percent: 0,
                        payment_value: 0,
                        total_reconciled_value: 0
                    }
                })

                const currPaymentDetailData = pageVariable.paymentDetailData?.[rowId]

                if(currPaymentDetailData) {
                    paymentDetailNoInvoiceData = paymentDetailNoInvoiceData.map(pdniItem => {
                        const currPayment = currPaymentDetailData.find(cpdItem =>
                            cpdItem.service_id === pdniItem.service_id
                        )
                        if(currPayment){
                            return {
                                ...pdniItem,
                                id: currPayment.id, //if old id exists, assign it to current id
                                is_selected: currPayment.is_selected,
                                payment_percent: currPayment.payment_percent,
                                payment_value: currPayment.payment_value,
                                total_reconciled_value: currPayment.total_reconciled_value,
                            }
                        }
                        return pdniItem
                    })
                }

                //deepcopy
                pageVariable.paymentDetailData[rowId] = JSON.parse(JSON.stringify(paymentDetailNoInvoiceData))
                initNoInvoicePaymentDetailModalDataTable(paymentDetailNoInvoiceData)
                pageElement.modalData.$modalPaymentDetailNoInvoice.modal('show')
            }
            else {
                pageElement.modalData.$modalPaymentDetail.attr('data-payment-row-id', rowId)
                let paymentDetailData = serviceTableData.map((sdItem, index) => {
                    const serviceDetailId = sdItem.id
                    const serviceTotalPaymentData = pageVariable.serviceDetailTotalPaymentData?.[serviceDetailId]
                    const issuedValue = serviceTotalPaymentData?.total_payment_value || 0
                    const paymentDetailId = Math.random().toString(36).slice(2)
                    return {
                        id: paymentDetailId, //generate a random id for payment detail row
                        service_id: serviceDetailId,
                        title: sdItem.title,
                        sub_total_value: sdItem.sub_total_value,
                        issued_value: issuedValue,
                        balance_value: sdItem.sub_total_value - issuedValue,
                        payment_percent: 0,
                        payment_value: 0,
                        tax_value: 0,
                        tax_data: sdItem.tax_data,
                        reconcile_value: 0,
                        receivable_value: 0,
                    }
                })

                const currPaymentDetailData = pageVariable.paymentDetailData?.[rowId]

                if(currPaymentDetailData) {
                    paymentDetailData = paymentDetailData.map(pdItem => {
                        const currPayment = currPaymentDetailData.find(cpdItem =>
                            cpdItem.service_id === pdItem.service_id
                        )
                        if(currPayment){
                            return {
                                ...pdItem,
                                id: currPayment.id, //if old id exists, assign it to current id
                                is_selected: currPayment.is_selected,
                                payment_percent: currPayment.payment_percent,
                                payment_value: currPayment.payment_value,
                                tax_value: currPayment.tax_value,
                                reconcile_value: currPayment.reconcile_value,
                                receivable_value: currPayment.receivable_value
                            }
                        }
                        return pdItem
                    })
                }

                //deepcopy
                pageVariable.paymentDetailData[rowId] = JSON.parse(JSON.stringify(paymentDetailData))
                initPaymentDetailModalDataTable(paymentDetailData)
                pageElement.modalData.$modalPaymentDetail.modal('show')
            }
        })
    }

    function handleSavePaymentDetail(){
        pageElement.modalData.$btnSavePaymentNoInvoice.on('click', function(e) {
            const $paymentTable = pageElement.payment.$table
            const paymentTable = $paymentTable.DataTable()
            const paymentDetailTable = pageElement.modalData.$tablePaymentDetailNoInvoice.DataTable()
            const paymentRowId = pageElement.modalData.$modalPaymentDetailNoInvoice.attr('data-payment-row-id')
            let paymentData = pageVariable.paymentDetailData[paymentRowId]

            const paymentDetailTableRows = paymentDetailTable.rows()
            let isValid = true
            let receivableValue = 0
            paymentDetailTableRows.every(function(){
                const $row = $(this.node())
                const rowData = this.data()
                const $checkbox = $row.find('input[type="checkbox"]')
                const isSelected = $checkbox.is(':checked')

                const rowId = $checkbox.data('service-row-id')
                let paymentPercentage = rowData.payment_percent
                let paymentValue = rowData.payment_value

                //data saved
                const serviceRowPaymentData = paymentData.find(item => item.service_id === rowId)
                const serviceRowPaymentPercentage = serviceRowPaymentData?.payment_percent || 0
                const serviceRowPaymentValue = serviceRowPaymentData?.payment_value || 0
                const serviceRowPaymentTotalData = pageVariable.serviceDetailTotalPaymentData[rowId]

                //if exist serviceDetailTotalDAta
                if (serviceRowPaymentTotalData){
                    const currTotalPaymentVal = serviceRowPaymentTotalData.total_payment_value
                    const currTotalPaymentPer = serviceRowPaymentTotalData.total_payment_percent

                    //if is selected add data to total value
                    if(isSelected){
                        const newTotalPaymentVal = currTotalPaymentVal - serviceRowPaymentValue + paymentValue
                        const newTotalPaymentPer = currTotalPaymentPer - serviceRowPaymentPercentage + paymentPercentage

                        // if(newTotalPaymentPer > 100) {
                        //     $.fn.notifyB({description: $.fn.gettext(`Value must not exceed 100`)}, 'failure')
                        //     isValid = false
                        //     return false
                        // }


                        // pageVariable.serviceDetailTotalPaymentData[rowId] = {
                        //     total_payment_value: newTotalPaymentVal,
                        //     total_payment_percentage: newTotalPaymentPer
                        // }
                    }
                    //else remove value from total value
                    else {
                        const newTotalPaymentVal = currTotalPaymentVal - serviceRowPaymentValue
                        const newTotalPaymentPer = currTotalPaymentPer - serviceRowPaymentPercentage

                        // if(newTotalPaymentPer > 100) {
                        //     $.fn.notifyB({description: $.fn.gettext(`Value must not exceed 100`)}, 'failure')
                        //     isValid = false
                        //     return false
                        // }

                        // pageVariable.serviceDetailTotalPaymentData[rowId] = {
                        //     total_payment_value: newTotalPaymentVal,
                        //     total_payment_percentage: newTotalPaymentPer
                        // }
                    }
                }
                //else if not serviceDetailTotalData, if it is selected, add to total data
                else {
                    if(isSelected){
                        // pageVariable.serviceDetailTotalPaymentData[rowId] = {
                        //     total_payment_value: paymentValue,
                        //     total_payment_percentage: paymentPercentage,
                        // }
                    }
                }

                paymentData  = paymentData.map((item)=>{
                    if(item.service_id === rowId){
                        if(isSelected){
                            receivableValue += paymentValue
                        }
                        return{
                            ...item,
                            is_selected: isSelected,
                            payment_value: isSelected ? paymentValue : 0,
                            payment_percent: isSelected ? paymentPercentage : 0,
                        }
                    }
                    return item
                })
            })

            if(!isValid){
                return
            }
            pageVariable.paymentDetailData[paymentRowId] = JSON.parse(JSON.stringify(paymentData))

            //update data payment row
            const $paymentRow = $paymentTable.find(`[data-payment-row-id="${paymentRowId}"]`)
            const paymentRowData = paymentTable.row($paymentRow).data()
            paymentRowData.receivable_value = receivableValue
            paymentRowData.payment_value = receivableValue

            $paymentRow.find('.payment-value').attr('data-init-money', receivableValue)
            $paymentRow.find('.payment-receivable-value').attr('data-init-money', receivableValue)

            $.fn.initMaskMoney2()
        })

        pageElement.modalData.$btnSavePayment.on('click', function(e) {
            const $paymentTable = pageElement.payment.$table
            const paymentTable = $paymentTable.DataTable()
            const paymentDetailTable = pageElement.modalData.$tablePaymentDetail.DataTable()
            const paymentRowId = pageElement.modalData.$modalPaymentDetail.attr('data-payment-row-id')

            let paymentData = pageVariable.paymentDetailData[paymentRowId]
            const paymentTableRows = paymentDetailTable.rows()

            let isValid = true
            let totalPaymentVal = 0
            let totalTaxValue = 0
            let totalReconcile = 0
            let totalReceivable = 0
            paymentTableRows.every(function(){
                const $row = $(this.node())
                const rowData = this.data()
                const $checkbox = $row.find('input[type="checkbox"]')
                const isSelected = $checkbox.is(':checked')
                const rowId = $checkbox.data('service-row-id')

                let paymentPercentage = rowData?.payment_percent || 0
                let paymentValue = rowData?.payment_value || 0
                const taxValue = rowData?.tax_value || 0
                const reconcileValue = rowData?.reconcile_value || 0
                const receivableValue = rowData?.receivable_value || 0

                const serviceRowPaymentData = paymentData.find(item => item.service_id === rowId)
                const serviceRowPaymentPercentage = serviceRowPaymentData?.payment_percent || 0
                const serviceRowPaymentValue = serviceRowPaymentData?.payment_value || 0

                const serviceRowPaymentTotalData = pageVariable.serviceDetailTotalPaymentData[rowId]
                let issuedValue = 0
                if (serviceRowPaymentTotalData){
                    const currTotalPaymentVal = serviceRowPaymentTotalData.total_payment_value
                    const currTotalPaymentPer = serviceRowPaymentTotalData.total_payment_percent

                    if(isSelected){
                        const newTotalPaymentVal = currTotalPaymentVal - serviceRowPaymentValue + paymentValue
                        const newTotalPaymentPer = currTotalPaymentPer - serviceRowPaymentPercentage + paymentPercentage
                        issuedValue = newTotalPaymentVal
                        if(newTotalPaymentPer > 100) {
                            $.fn.notifyB({description: $.fn.gettext(`Value must not exceed 100`)}, 'failure')
                            isValid = false
                            return false
                        }

                        pageVariable.serviceDetailTotalPaymentData[rowId] = {
                            total_payment_value: newTotalPaymentVal,
                            total_payment_percent: newTotalPaymentPer
                        }
                    }
                    else {
                        const newTotalPaymentVal = currTotalPaymentVal - serviceRowPaymentValue
                        const newTotalPaymentPer = currTotalPaymentPer - serviceRowPaymentPercentage
                        issuedValue = newTotalPaymentVal
                        if(newTotalPaymentPer > 100) {
                            $.fn.notifyB({description: $.fn.gettext(`Value must not exceed 100`)}, 'failure')
                            isValid = false
                            return false
                        }

                        pageVariable.serviceDetailTotalPaymentData[rowId] = {
                            total_payment_value: newTotalPaymentVal,
                            total_payment_percent: newTotalPaymentPer
                        }
                    }
                }
                else {
                    if(isSelected){
                        issuedValue = paymentValue
                        pageVariable.serviceDetailTotalPaymentData[rowId] = {
                            total_payment_value: paymentValue,
                            total_payment_percent: paymentPercentage,
                        }
                    }
                }

                paymentData  = paymentData.map((item)=>{
                    if(item.service_id === rowId){
                        if(isSelected){
                            totalPaymentVal += paymentValue
                            totalTaxValue += taxValue
                            totalReconcile += reconcileValue
                            totalReceivable += receivableValue
                        }
                        const balance = item.sub_total_value - issuedValue
                        return{
                            ...item,
                            issued_value: issuedValue,
                            balance_value: balance,
                            is_selected: isSelected,
                            payment_value: paymentValue,
                            payment_percent: paymentPercentage,
                            reconcile_value: reconcileValue,
                            tax_value: taxValue,
                            receivable_value: receivableValue
                        }
                    }
                    return item
                })
            })
            if(!isValid){
                return
            }
            pageVariable.paymentDetailData[paymentRowId] = JSON.parse(JSON.stringify(paymentData))

            // 🔄 Sync all paymentDetailData with latest serviceDetailTotalPaymentData
            Object.keys(pageVariable.paymentDetailData).forEach(paymentRowKey => {
                let payment = pageVariable.paymentDetailData[paymentRowKey]
                payment = payment.map(item => {
                    const sdData = pageVariable.serviceDetailTotalPaymentData[item.service_id]
                        if (sdData) {
                            return {
                                ...item,
                                issued_value: sdData.total_payment_value,
                                balance_value: item.sub_total_value - sdData.total_payment_value
                            }
                        }
                        return item
                })
                pageVariable.paymentDetailData[paymentRowKey] = JSON.parse(JSON.stringify(payment))
            })


            //update data payment row
            const $paymentRow = $paymentTable.find(`[data-payment-row-id="${paymentRowId}"]`)
            const paymentRowData = paymentTable.row($paymentRow).data()
            paymentRowData.payment_value = totalPaymentVal
            paymentRowData.tax_value = totalTaxValue
            paymentRowData.reconcile_value = totalReconcile
            paymentRowData.receivable_value = totalReceivable

            $paymentRow.find('.payment-value').attr('data-init-money', totalPaymentVal)
            $paymentRow.find('.payment-receivable-value').attr('data-init-money', totalReceivable)
            $paymentRow.find('.payment-tax').attr('data-init-money', totalTaxValue)
            $paymentRow.find('.payment-reconcile').attr('data-init-money', totalReconcile)
            $.fn.initMaskMoney2()
        })
    }

    function handleChangePaymentDetail(){
        pageElement.modalData.$tablePaymentDetail.on('change', '.payment-detail-percentage, .payment-detail-value', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.modalData.$tablePaymentDetail.DataTable()
            const rowData = table.row($row).data()
            const subTotal = rowData.sub_total_value
            if($ele.hasClass('payment-detail-percentage')){
                let paymentPercentage = Number($ele.val()) || 0
                if(paymentPercentage>100){
                    $.fn.notifyB({description: $.fn.gettext(`Value must not exceed 100`)}, 'failure')
                } else {
                    const taxData = rowData.tax_data
                    const reconcileValue = rowData.reconcile_value
                    let taxRate = (taxData?.rate || 0)/100
                    const paymentValue = subTotal * (paymentPercentage /100)
                    const taxValue = paymentValue * taxRate
                    const receivableValue = paymentValue + taxValue - reconcileValue

                    rowData.payment_percent = paymentPercentage
                    rowData.payment_value = paymentValue
                    rowData.tax_value = taxValue
                    rowData.receivable_value = receivableValue

                    table.row($row).data(rowData).draw(false)
                }
            }
            else {
                let paymentValue = Number($ele.attr('value')) || 0
                if(paymentValue > subTotal){
                    $.fn.notifyB({description: $.fn.gettext(`Value must not exceed subtotal`)}, 'failure')
                }
                else {
                    const taxData = rowData.tax_data
                    const reconcileValue = rowData.reconcile_value
                    let taxRate = (taxData?.rate || 0)/100

                    let paymentPercentage = (paymentValue/ subTotal) * 100
                    paymentPercentage = parseFloat(paymentPercentage.toFixed(6))

                    const taxValue = paymentValue * taxRate
                    const receivableValue = paymentValue + taxValue - reconcileValue

                    rowData.payment_percent = paymentPercentage
                    rowData.payment_value = paymentValue
                    rowData.tax_value = taxValue
                    rowData.receivable_value = receivableValue

                    table.row($row).data(rowData).draw(false)
                }
            }
        })

        pageElement.modalData.$tablePaymentDetailNoInvoice.on('change', '.no-invoice-payment-detail-percentage, .no-invoice-payment-detail-value', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.modalData.$tablePaymentDetailNoInvoice.DataTable()
            const rowData = table.row($row).data()
            const subTotal = rowData.sub_total_value

            if($ele.hasClass('no-invoice-payment-detail-percentage')){
                let paymentPercentage = Number($ele.val()) || 0
                if(paymentPercentage>100){
                    $.fn.notifyB({description: $.fn.gettext(`Value must not exceed 100`)}, 'failure')
                    $ele.attr('value', 0)
                } else {
                    rowData.payment_percent = paymentPercentage
                    paymentPercentage = paymentPercentage /100
                    rowData.payment_value = subTotal * paymentPercentage
                    table.row($row).data(rowData).draw(false)
                }
            } else {
                let paymentValue = Number($ele.val()) || 0
                if(paymentValue > subTotal){
                    $.fn.notifyB({description: $.fn.gettext(`Value must not exceed total value`)}, 'failure')
                    $ele.attr('value', 0)
                } else {
                    rowData.payment_value = paymentValue
                    let paymentPercentage = (paymentValue/ subTotal) * 100
                    paymentPercentage = parseFloat(paymentPercentage.toFixed(6))
                    rowData.payment_percent = paymentPercentage
                    table.row($row).data(rowData).draw(false)
                }
            }
        })

        pageElement.modalData.$tablePaymentDetail.on('change', 'input[type="checkbox"]', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.modalData.$tablePaymentDetail.DataTable()
            const rowData = table.row($row).data()

            const isChecked = $ele.is(':checked')
            rowData.is_selected = isChecked
            if (!isChecked) {
                rowData.payment_value = 0
                rowData.payment_percent = 0

                $row.find('.payment-detail-percentage').attr('value', 0)
                $row.find('.payment-detail-value').attr('data-init-money', 0)

                $.fn.initMaskMoney2()
            }
        })

        pageElement.modalData.$tablePaymentDetailNoInvoice.on('change', 'input[type="checkbox"]', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.modalData.$tablePaymentDetailNoInvoice.DataTable()
            const rowData = table.row($row).data()

            const isChecked = $ele.is(':checked')
            rowData.is_selected = isChecked
            if (!isChecked) {
                rowData.payment_value = 0
                rowData.payment_percent = 0

                $row.find('.no-invoice-payment-detail-percentage').attr('value', 0)
                $row.find('.no-invoice-payment-detail-value').attr('value', 0)

                $.fn.initMaskMoney2()
            }
        })

        pageElement.payment.$table.on('change', '.payment-type-select', function(e){
            const paymentTable = pageElement.payment.$table.DataTable()
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const currPaymentType = Number($ele.val())

            const rowData = paymentTable.row($row).data()
            const rowId = rowData.id

            rowData.payment_type = currPaymentType

            if(currPaymentType === PAYMENT_TYPE.payment && rowData.is_invoice_required === false){
                const $invoiceCheckbox = $row.find('.invoice-require')
                $invoiceCheckbox.prop('checked', true)
                rowData.is_invoice_required = true

                delete pageVariable.paymentDetailData[rowId]

                $row.find('.payment-value').attr('data-init-money', 0)
                $row.find('.payment-receivable-value').attr('data-init-money', 0)
                $row.find('.payment-tax').attr('data-init-money', 0)

                $.fn.initMaskMoney2()
            }
        })

        pageElement.payment.$table.on('change', '.payment-description', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.payment.$table.DataTable()
            const rowData = table.row($row).data()
            rowData.description = $ele.val()
        })
    }

    function handleOpenModalReconcile(){
        pageElement.modalData.$tablePaymentDetail.on('click', '.btn-open-reconcile', function(e) {
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')

            const paymentTable = pageElement.payment.$table.DataTable()

            const paymentDetailTable =  pageElement.modalData.$tablePaymentDetail.DataTable()

            const serviceRowId = $ele.attr('data-service-row-id')

            const paymentDetailRowData = paymentDetailTable.row($row).data()
            const paymentDetailRowId = paymentDetailRowData.id

            const paymentRowId = pageElement.modalData.$modalPaymentDetail.attr('data-payment-row-id')
            const paymentRowData = paymentTable.data().toArray().find(item => item.id === paymentRowId)
            const paymentRowInstallment = paymentRowData?.installment

            const paymentTableRows = paymentTable.rows()

            let reconcileTableData = []
            // loop through payment table
            paymentTableRows.every(function () {
                const rowData = this.data()
                const rowId = rowData?.id
                const isAdvancePayment = rowData.payment_type === PAYMENT_TYPE.advance
                const isInvoiceRequired = rowData.is_invoice_required
                const installment = rowData.installment

                //if payment row is advance and has installment smaller than currPaymentRow
                if(isAdvancePayment && !isInvoiceRequired && installment < paymentRowInstallment) {
                    const paymentDetailData = pageVariable.paymentDetailData[rowId]
                    if(paymentDetailData){
                        paymentDetailData.forEach(function(paymentDetailItem){
                            const reconcileId = Math.random().toString(36).slice(2)
                            reconcileTableData.push({
                                id: reconcileId,
                                advance_payment_id: rowId, //id of payment table row
                                advance_payment_detail_id: paymentDetailItem.id, //id of payment detail table row
                                installment: installment,
                                title: paymentDetailItem.title,
                                total_value: paymentDetailItem.payment_value,
                                total_reconciled_value: paymentDetailItem?.total_reconciled_value || 0,
                                reconcile_value: 0,
                                service_id: paymentDetailItem.service_id
                            })
                        })
                    }
                }
            })

            const currentPaymentReconcileData = pageVariable.reconcileData?.[paymentDetailRowId]

            if(currentPaymentReconcileData) {
                reconcileTableData = reconcileTableData.map(rItem => {
                    const currReconcile = currentPaymentReconcileData.find(cprItem =>
                        cprItem.advance_payment_id === rItem.advance_payment_id
                        && cprItem.service_id === rItem.service_id
                        && cprItem.advance_payment_detail_id === rItem.advance_payment_detail_id
                    )
                    if(currReconcile){
                        return {
                            ...rItem,
                            id: currReconcile.id,
                            is_selected: currReconcile.is_selected,
                            reconcile_value: currReconcile.reconcile_value,
                        }
                    }
                    return rItem
                })
            }
            pageVariable.reconcileData[paymentDetailRowId] = JSON.parse(JSON.stringify(reconcileTableData))

            pageElement.modalData.$tablePaymentReconcile.attr('data-payment-detail-row-id', paymentDetailRowId)
            pageElement.modalData.$tablePaymentReconcile.attr('data-service-row-id', serviceRowId)
            initPaymentReconcileModalDataTable(reconcileTableData)
            pageElement.modalData.$modalPaymentReconcile.modal('show')
        })
    }

    function handleSavePaymentReconcile(){
        pageElement.modalData.$btnSavePaymentReconcile.on('click', function(e) {
            const $paymentReconcileTable = pageElement.modalData.$tablePaymentReconcile
            const paymentReconcileTable = $paymentReconcileTable.DataTable()

            const paymentDetailRowId = $paymentReconcileTable.attr('data-payment-detail-row-id')

            const paymentReconcileRows = paymentReconcileTable.rows()

            let reconcileData = JSON.parse(JSON.stringify(pageVariable.reconcileData[paymentDetailRowId]))

            let totalValue = 0 //value for assigning to payment detail reconcile value
            paymentReconcileRows.every(function () {
                const $row = $(this.node())
                const rowData = this.data()
                const $checkbox = $row.find('input[type="checkbox"]')
                const isSelected = $checkbox.is(':checked')
                const reconcileValue = Number($row.find('.payment-detail-reconcile-value').attr('value')) || 0

                //lấy data của 1 payment row
                const advancePaymentData = pageVariable.paymentDetailData[rowData.advance_payment_id]

                //tổng giá trị đã cấn trừ
                let totalReconciledValue = 0
                let paymentDetailRowData = null

                if (advancePaymentData){
                    //lấy data của 1 dòng payment detail
                    paymentDetailRowData = advancePaymentData.find(item => item.id === rowData.advance_payment_detail_id)
                    totalReconciledValue = paymentDetailRowData?.total_reconciled_value || 0
                }

                const currReconcileRowData = reconcileData.find(item =>
                    item.id === rowData.id
                )
                const currReconcileValue = currReconcileRowData?.reconcile_value

                if(reconcileData){
                    if (isSelected){
                        totalValue += reconcileValue
                        // tổng đã cấn trừ, trừ cho giá trị cấn trừ cũ, cộng giá tri cấn trừ mới
                        totalReconciledValue = totalReconciledValue - currReconcileValue + reconcileValue
                    }
                    else {
                        // tổng đã cấn trừ, trừ cho giá trị cấn trừ cũ
                        totalReconciledValue = totalReconciledValue - currReconcileValue
                    }
                }
                else {
                    if (isSelected){
                        totalValue += reconcileValue
                        totalReconciledValue = reconcileValue
                    }
                }

                //lưu tổng cấn trừ vô lại payment detail data
                if (pageVariable.paymentDetailData[rowData.advance_payment_id]) {
                    const detailRow = pageVariable.paymentDetailData[rowData.advance_payment_id]
                        .find(item => item.id === rowData.advance_payment_detail_id)
                    if (detailRow) {
                        detailRow.total_reconciled_value = totalReconciledValue
                    }
                }

                reconcileData  = reconcileData.map((item)=>{
                    if(item.id === rowData.id){
                        return{
                            ...item,
                            is_selected: isSelected,
                            reconcile_value: reconcileValue
                        }
                    }
                    return item
                })

            })
            pageVariable.reconcileData[paymentDetailRowId] = reconcileData
            const paymentDetailTable = pageElement.modalData.$tablePaymentDetail.DataTable()
            const paymentDetailRowIdx = paymentDetailTable.rows().indexes().toArray().find((idx) => {
                const rowData = paymentDetailTable.row(idx).data()
                return rowData.id === paymentDetailRowId
            })

            if (paymentDetailRowIdx !== undefined) {
                let paymentDetailRowData = paymentDetailTable.row(paymentDetailRowIdx).data()
                const $paymentDetailRow = $(paymentDetailTable.row(paymentDetailRowIdx).node())

                const receivableValue = paymentDetailRowData?.receivable_value || 0
                const oldReconcileValue = paymentDetailRowData?.reconcile_value || 0
                const newReceivableValue = receivableValue + oldReconcileValue - totalValue

                paymentDetailRowData.reconcile_value = totalValue
                paymentDetailRowData.receivable_value = newReceivableValue

                $paymentDetailRow.find('.payment-detail-reconcile-value').attr('data-init-money', totalValue)
                $paymentDetailRow.find('.payment-detail-receivable-value').attr('data-init-money', newReceivableValue)
            }
            $.fn.initMaskMoney2()
        })
    }

    // ============ submit handler =============

    function getExchangeRate(){
        const table = pageElement.modalData.$tableExchangeRate.DataTable()
        let exchangeData = table.data().toArray()
        return exchangeData || {}
    }

    function getServiceDetailData(){
        const table = pageElement.serviceDetail.$table.DataTable()
        const serviceDetailData = []

        table.rows().every(function(rowIdx) {
            const rowData = this.data()
            const $row = $(this.node())
            const currentDescription = $row.find('.cost-description').val() || rowData.description || ''
            const currentQuantity = parseFloat($row.find('.service-quantity').val()) || rowData.quantity || 0

            const price = parseFloat(rowData.price) || 0
            const taxRate = parseFloat(rowData.tax_data?.rate || 0) / 100
            const subtotal = rowData.sub_total_value || 0
            const taxAmount = subtotal * taxRate
            const currentTotal = subtotal + taxAmount

            const deliveryBalanceValue = pageVariable.serviceDetailTotalContributionData?.[rowData.id]?.delivery_balance_value ?? currentQuantity

            const serviceDetail = {
                id: rowData.id,
                order: rowIdx + 1,
                product: rowData.product_id,
                code: rowData.code,
                title: rowData.title,
                description: currentDescription,
                quantity: currentQuantity,
                uom: rowData.uom_data?.id || null,
                uom_data: rowData.uom_data,
                service_percent: parseFloat(rowData.service_percent) || 0,
                price: price,
                tax: rowData.tax_data?.id || null,
                tax_data: rowData.tax_data || {},
                sub_total_value: subtotal,
                total_value: currentTotal,
                total_contribution_percent: pageVariable.serviceDetailTotalContributionData?.[rowData.id]?.total_contribution_percent || 0,
                delivery_balance_value: deliveryBalanceValue,
                total_payment_percent: pageVariable.serviceDetailTotalPaymentData?.[rowData.id]?.total_payment_percent || 0,
                total_payment_value: pageVariable.serviceDetailTotalPaymentData?.[rowData.id]?.total_payment_value || 0,
                //data for attribute
                attributes_total_cost: rowData.attributes_total_cost || 0,
                duration_id: rowData.duration_id || null,
                duration_unit_data: rowData.duration_unit_data || {},
                selected_attributes: rowData.selected_attributes || {},
            }

            serviceDetailData.push(serviceDetail)
        })
        return serviceDetailData
    }

    function getWorkOrderData() {
        const table = pageElement.workOrder.$table.DataTable();
        const workOrderData = [];

        // Iterate through all rows in the DataTable
        table.rows().every(function(rowIdx) {
            const rowData = this.data();
            const $row = $(this.node());

            // Get current values from the DOM elements
            const currentDescription = $row.find('.work-order-description').val() || rowData.title || '';
            const currentQuantity = parseFloat($row.find('.work-order-quantity').val()) || rowData.quantity || 0;
            let currentStartDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $row.find('.work-order-start-date').val())
            let currentEndDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $row.find('.work-order-end-date').val())
            const isDeliveryPoint = $row.find('.work-order-service-delivery').is(':checked') || false;

            // Calculate current total
            const unitCost = parseFloat(rowData.unit_cost) || 0;
            const currentTotal = currentQuantity * unitCost;

            //get cost data
            let costData = pageVariable.workOrderCostData?.[rowData.id] || []
            costData = costData.map((item, index) => ({
                ...item,
                order: index + 1,
            }))

            //get contribution with package data
            let contributionData = pageVariable.productContributionData?.[rowData.id] || []
            contributionData = contributionData.map((item, index) => {
                // Get package data for this contribution if it has packages
                let packageData = null;
                if (item.has_package && pageVariable.contributionPackageData?.[item.id]) {
                    packageData = pageVariable.contributionPackageData[item.id]
                        .map((pkg, pkgIndex) => ({
                            id: pkg.id,
                            order: pkgIndex + 1,
                            is_container: pkg.is_container,
                            title: pkg.title,
                            description: pkg.description,
                            container_ref: pkg.container_ref,
                            packages: pkg.packages || null,
                            is_selected: pkg.is_selected,
                        }));
                }

                return {
                    ...item,
                    order: index + 1,
                    package_data: packageData
                }
            })

            // task data
            let taskData = [];
            let taskDataEle = $row[0].querySelector('.table-row-task-data');
            if (taskDataEle) {
                if ($(taskDataEle).val()) {
                    taskData = JSON.parse($(taskDataEle).val());
                }
            }

            // Collect the work data
            const workOrder = {
                id: rowData.id,
                order: rowIdx + 1,
                product: rowData.product_id || null, // Null for non-item rows
                code: rowData.code || '',
                title: currentDescription,
                assignee: rowData.assignee || null,
                start_date: currentStartDate,
                end_date: currentEndDate,
                is_delivery_point: isDeliveryPoint,
                quantity: currentQuantity,
                unit_cost: unitCost,
                total_value: currentTotal,
                work_status: rowData.status || 0,
                // Include work cost breakdown if exists
                cost_data: costData,
                // Include product contribution data if exists and is delivery point
                product_contribution: contributionData,
                // task data
                task_data: taskData,
            };

            workOrderData.push(workOrder);
        });

        return workOrderData;
    }

    function getPaymentData() {
        const table = pageElement.payment.$table.DataTable();
        const paymentData = [];

        // Iterate through all rows in the DataTable
        table.rows().every(function(rowIdx) {
            const rowData = this.data();
            const $row = $(this.node());

            // Get current values from the DOM elements
            const currentDescription = $row.find('.payment-description').val() || rowData.description || '';
            const currentPaymentType = parseInt($row.find('.payment-type-select').val()) || rowData.payment_type || 0;
            const isInvoiceRequired = $row.find('.invoice-require').is(':checked') || false;
            let currentDueDate = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', $row.find('.payment-due-date').val())

            // Get payment values from data (these are updated via other functions)
            const paymentValue = parseFloat(rowData.payment_value) || 0
            const taxValue = parseFloat(rowData.tax_value) || 0
            const reconcileValue = parseFloat(rowData.reconcile_value) || 0
            const receivableValue = parseFloat(rowData.receivable_value) || 0

            // Collect the payment data
            const payment = {
                id: rowData.id,
                installment: rowIdx + 1, // Installment number based on row index
                description: currentDescription,
                payment_type: currentPaymentType,
                is_invoice_required: isInvoiceRequired,
                payment_value: paymentValue,
                tax_value: taxValue,
                reconcile_value: reconcileValue,
                receivable_value: receivableValue,
                due_date: currentDueDate,
                // Include payment detail data if exists
                payment_detail_data: (() =>{
                    const paymentData = []
                    if (pageVariable.paymentDetailData?.[rowData.id]){
                        pageVariable.paymentDetailData[rowData.id].forEach((paymentDetail, idx) => {
                            paymentData.push({
                                ...paymentDetail,
                                order: idx + 1
                            })
                        })
                    }
                    return paymentData
                })(),
                // Include reconcile data for each payment detail
                reconcile_data: (() => {
                    const reconcileDetails = []
                    if (pageVariable.paymentDetailData?.[rowData.id]) {
                        pageVariable.paymentDetailData[rowData.id].forEach(paymentDetail => {
                            if (paymentDetail.is_selected && pageVariable.reconcileData?.[paymentDetail.id]) {
                                const reconcileItems = pageVariable.reconcileData[paymentDetail.id]
                                    .filter(item => item.is_selected)
                                if (reconcileItems.length > 0) {
                                    reconcileItems.forEach((reconcileItem, idx) => {
                                        reconcileDetails.push({
                                            order: idx + 1,
                                            payment_detail_id: paymentDetail.id,
                                            service_id: paymentDetail.service_id,
                                            advance_payment_detail_id: reconcileItem.advance_payment_detail_id,
                                            advance_payment_id: reconcileItem.advance_payment_id,
                                            installment: reconcileItem.installment,
                                            reconcile_value: reconcileItem.reconcile_value,
                                            total_value: reconcileItem.total_value,
                                        })
                                    })
                                }
                            }
                        })
                    }
                    return reconcileDetails
                })()
            }
            paymentData.push(payment)
        })
        return paymentData
    }

    function validateDates() {
        // Validate work dates
        const workOrderTable = ServiceOrder.pageElement.workOrder.$table.DataTable()
        let hasError = false

        workOrderTable.rows().every(function(rowIdx) {
            const $row = $(this.node())
            const startDate = $row.find('.work-order-start-date').val()
            const endDate = $row.find('.work-order-end-date').val()

            if (!startDate) {
                $.fn.notifyB({
                    description: $.fn.gettext(`Work row ${rowIdx + 1}: Start Date is required`)
                }, 'failure')
                hasError = true
                return false // Break the loop
            }

            if (!endDate) {
                $.fn.notifyB({
                    description: $.fn.gettext(`Work row ${rowIdx + 1}: End Date is required`)
                }, 'failure')
                hasError = true
                return false
            }
        })

        if (hasError) return false

        // Validate payment due dates
        const paymentTable = ServiceOrder.pageElement.payment.$table.DataTable()

        paymentTable.rows().every(function(rowIdx) {
            const $row = $(this.node())
            const dueDate = $row.find('.payment-due-date').val()

            if (!dueDate) {
                $.fn.notifyB({
                    description: $.fn.gettext(`Payment Installment ${rowIdx + 1}: Due Date is required`)
                }, 'failure')
                hasError = true
                return false
            }
        })

        return !hasError
    }

    function validateTotalServiceDetailPercent() {
        // Validate service detail
        const serviceDetailTable = ServiceOrder.pageElement.serviceDetail.$table.DataTable()

        let totalPercentage = 0
        serviceDetailTable.rows().every(function() {
            const rowData = this.data()
            totalPercentage += rowData.service_percent
        })

        if (totalPercentage !== 100){
            $.fn.notifyB({
                description: $.fn.gettext(`Total Service Detail Percentage must equal 100`)
            }, 'failure')
            return false
        }

        return true
    }

    // ============ detail handler ==============

    function loadServiceDetailRelatedData(serviceDetailData=[]){
        for (const serviceDetail of serviceDetailData){
            ServiceOrder.pageVariable.serviceDetailTotalContributionData[serviceDetail.id] = {
                total_contribution_percent: serviceDetail.total_contribution_percent,
                delivery_balance_value: serviceDetail.delivery_balance_value,
            }

            ServiceOrder.pageVariable.serviceDetailTotalPaymentData[serviceDetail.id] = {
                total_payment_value: serviceDetail.total_payment_value,
                total_payment_percent: serviceDetail.total_payment_percent
            }
        }
    }

    function loadWorkOrderRelatedData(workOrderData=[]){
        function addProductContributionData(workOrder){
            const productContributionAPIData = workOrder.product_contribution_data
            const productContributionData = []
            for (const productContribution of productContributionAPIData){
                productContributionData.push(productContribution)

                //push product contribution
                if (productContribution.has_package && productContribution.package_data) {
                    const packageData = []
                    for (const pkg of productContribution.package_data){
                        packageData.push({
                            id: pkg.id,
                            is_container: pkg.is_container,
                            title: pkg.title,
                            description: pkg.description,
                            container_ref: pkg.container_ref,
                            packages: pkg.packages || null,
                            is_selected: pkg.is_selected
                        })
                    }
                    ServiceOrder.pageVariable.contributionPackageData[productContribution.id] = JSON.parse(JSON.stringify(packageData))
                }
            }
            ServiceOrder.pageVariable.productContributionData[workOrder.id] = JSON.parse(JSON.stringify(productContributionData))
        }

        function addUnitCostData(workOrder){
            let costData = []
            if (workOrder.cost_data && workOrder.cost_data.length > 0){
                costData = workOrder.cost_data
            }
            ServiceOrder.pageVariable.workOrderCostData[workOrder.id] = JSON.parse(JSON.stringify(costData))
        }

        for (const workOrder of workOrderData){
            addProductContributionData(workOrder)
            addUnitCostData(workOrder)
        }
    }

    function loadPaymentRelatedData(paymentData=[]) {
        function addReconcileData(paymentDetail){
            const reconcileAPIData = paymentDetail.reconcile_data ?? []
            if(reconcileAPIData.length === 0){
                return
            }
            const reconcileData = []
            for (const reconcile of reconcileAPIData){
                reconcileData.push({
                    ...reconcile,
                    is_selected: true
                })
            }
            ServiceOrder.pageVariable.reconcileData[paymentDetail.id] = JSON.parse(JSON.stringify(reconcileData))
        }

        function addPaymentDetailData(payment){
            const paymentDetailAPIData = payment.payment_detail_data
            const paymentDetailData = []
            for (const paymentDetail of paymentDetailAPIData){
                paymentDetailData.push({
                    ...paymentDetail,
                    is_selected: true
                })
                addReconcileData(paymentDetail)
            }
            ServiceOrder.pageVariable.paymentDetailData[payment.id] = JSON.parse(JSON.stringify(paymentDetailData))
        }

        for (const payment of paymentData) {
            addPaymentDetailData(payment)
        }
    }

    function loadExchangeRateData(exchangeRateData=[]){
        ServiceOrder.pageVariable.currencyList = exchangeRateData
        initCurrencyRateModalDataTable(exchangeRateData)
    }

    // ============ delete handler ==============

    function handleDeleteServiceDetailRow() {
        pageElement.serviceDetail.$table.on('click', '.service-del-row', function(e) {
            e.preventDefault()

            const $btn = $(this)
            const $row = $btn.closest('tr')
            const table = pageElement.serviceDetail.$table.DataTable()
            const rowData = table.row($row).data()
            const serviceDetailId = rowData.id

            // Check for linked contributions
            let hasLinkedContributions = false
            Object.keys(pageVariable.productContributionData).forEach(workOrderId => {
                const contributions = pageVariable.productContributionData[workOrderId];
                if (contributions && Array.isArray(contributions)) {
                    contributions.forEach(contribution => {
                        if (contribution.service_id === serviceDetailId) {
                            // Check if this contribution has any meaningful data
                            if (contribution.is_selected ||
                                (contribution.contribution_percent && contribution.contribution_percent > 0) ||
                                (contribution.delivered_quantity && contribution.delivered_quantity > 0)) {
                                hasLinkedContributions = true
                            }
                        }
                    })
                }
            })

            // Check for linked payments
            let hasLinkedPayments = false
            Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
                const paymentDetails = pageVariable.paymentDetailData[paymentId];
                if (paymentDetails && Array.isArray(paymentDetails)) {
                    paymentDetails.forEach(detail => {
                        if (detail.service_id === serviceDetailId) {
                            if (detail.is_selected ||
                                (detail.payment_percent && detail.payment_percent > 0) ||
                                (detail.payment_value && detail.payment_value > 0)) {
                                hasLinkedPayments = true
                            }
                        }
                    });
                }
            });

            if (hasLinkedContributions || hasLinkedPayments) {
                const errorTitle = $.fn.gettext('Cannot delete service detail');
                let errorMessage = $.fn.gettext('This service detail cannot be deleted because it has:');

                // Build detailed error message
                let errorDetails = '<ul class="text-start mt-3">';

                if (hasLinkedContributions) {
                    errorDetails += '<strong>' + $.fn.gettext('Work Order Contributions') + '</strong>'
                }

                if (hasLinkedPayments) {
                    errorDetails += '<strong>' + $.fn.gettext('Payment Allocations:') + '</strong>'
                }

                errorDetails += '</ul>';
                errorDetails += '<p class="mt-3 text-muted">' +
                               $.fn.gettext('Please remove all contributions and payment allocations before deleting this service detail.') +
                               '</p>';

                Swal.fire({
                    html: `
                        <div class="mb-3"><i class="ri-error-warning-line fs-5 text-danger"></i></div>
                        <h5 class="text-danger">${errorTitle}</h5>
                        <p>${errorMessage}</p>
                        ${errorDetails}`,
                    customClass: {
                        confirmButton: 'btn btn-outline-secondary text-danger',
                        container: 'swal2-has-bg'
                    },
                    showCancelButton: false,
                    buttonsStyling: false,
                    confirmButtonText: $.fn.gettext('Confirm'),
                });

                return // Stop here, don't allow deletion
            }

            const confirmTitle = $.fn.gettext('Delete service detail?')
            Swal.fire({
                html: `
                    <div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>
                    <h5 class="text-danger">${confirmTitle}</h5>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-danger',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg',
                    actions: 'w-100'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: $.fn.gettext('Yes'),
                cancelButtonText: $.fn.gettext('Cancel'),
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    table.row($row).remove().draw(false);

                    // Clean up related data structures
                    cleanupServiceDetailRelatedData(serviceDetailId);
                    loadServiceDetailSummaryValue()
                }
            });
        });
    }

    function cleanupServiceDetailRelatedData(serviceDetailId) {
        // 1. Remove from serviceDetailTotalContributionData
        if (pageVariable.serviceDetailTotalContributionData[serviceDetailId]) {
            delete pageVariable.serviceDetailTotalContributionData[serviceDetailId];
        }

        // 2. Remove from serviceDetailTotalPaymentData
        if (pageVariable.serviceDetailTotalPaymentData[serviceDetailId]) {
            delete pageVariable.serviceDetailTotalPaymentData[serviceDetailId];
        }

        // 3. Clean up productContributionData
        // Remove this service from all work contributions
        Object.keys(pageVariable.productContributionData).forEach(workOrderId => {
            const contributions = pageVariable.productContributionData[workOrderId];
            if (contributions) {
                // Filter out the deleted service detail
                pageVariable.productContributionData[workOrderId] = contributions.filter(
                    item => item.service_id !== serviceDetailId
                );
            }
        });

        // 4. Clean up paymentDetailData
        // Remove this service from all payment details
        Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
            const paymentDetails = pageVariable.paymentDetailData[paymentId];
            if (paymentDetails) {
                // Find and remove the payment detail for this service
                const deletedPaymentDetail = paymentDetails.find(
                    item => item.service_id === serviceDetailId
                );

                if (deletedPaymentDetail) {
                    // Clean up reconcile data for this payment detail
                    if (pageVariable.reconcileData[deletedPaymentDetail.id]) {
                        delete pageVariable.reconcileData[deletedPaymentDetail.id];
                    }

                    // Filter out the deleted service detail from payment details
                    pageVariable.paymentDetailData[paymentId] = paymentDetails.filter(
                        item => item.service_id !== serviceDetailId
                    );

                    // Update payment row totals if needed
                    updatePaymentRowTotals(paymentId);
                }
            }
        });

        // 5. Clean up reconcileData
        // Remove any reconcile entries that reference this service
        Object.keys(pageVariable.reconcileData).forEach(paymentDetailId => {
            const reconcileItems = pageVariable.reconcileData[paymentDetailId];
            if (reconcileItems) {
                pageVariable.reconcileData[paymentDetailId] = reconcileItems.filter(
                    item => item.service_id !== serviceDetailId
                );

                // If no items left, delete the entry
                if (pageVariable.reconcileData[paymentDetailId].length === 0) {
                    delete pageVariable.reconcileData[paymentDetailId];
                }
            }
        });
    }

    function updatePaymentRowTotals(paymentId) {
        // Recalculate totals for the payment row after removing a service detail
        const paymentTable = pageElement.payment.$table.DataTable();
        const $paymentRow = pageElement.payment.$table.find(`[data-payment-row-id="${paymentId}"]`);

        if ($paymentRow.length > 0) {
            const paymentRowData = paymentTable.row($paymentRow).data();
            const paymentDetails = pageVariable.paymentDetailData[paymentId] || [];

            let totalPaymentValue = 0;
            let totalTaxValue = 0;
            let totalReconcileValue = 0;
            let totalReceivableValue = 0;

            // Sum up values from remaining payment details
            paymentDetails.forEach(detail => {
                if (detail.is_selected) {
                    totalPaymentValue += detail.payment_value || 0;
                    totalTaxValue += detail.tax_value || 0;
                    totalReconcileValue += detail.reconcile_value || 0;
                    totalReceivableValue += detail.receivable_value || 0;
                }
            });

            // Update payment row data
            paymentRowData.payment_value = totalPaymentValue;
            paymentRowData.tax_value = totalTaxValue;
            paymentRowData.reconcile_value = totalReconcileValue;
            paymentRowData.receivable_value = totalReceivableValue;

            // Update DOM elements
            $paymentRow.find('.payment-value').attr('data-init-money', totalPaymentValue);
            $paymentRow.find('.payment-tax').attr('data-init-money', totalTaxValue);
            $paymentRow.find('.payment-reconcile').attr('data-init-money', totalReconcileValue);
            $paymentRow.find('.payment-receivable-value').attr('data-init-money', totalReceivableValue);

            // Reinitialize money masks
            $.fn.initMaskMoney2();
        }
    }

    function handleDeleteWorkOrderRow() {
        pageElement.workOrder.$table.on('click', '.work-order-del-row', function(e) {
            e.preventDefault();

            const $btn = $(this);
            const $row = $btn.closest('tr');
            const table = pageElement.workOrder.$table.DataTable();
            const rowData = table.row($row).data();
            const workOrderId = rowData.id;

            const confirmTitle = $.fn.gettext('Delete Work?')
            Swal.fire({
                html: `
                    <div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>
                    <h5 class="text-danger">${confirmTitle}</h5>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-danger',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg',
                    actions: 'w-100'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: $.fn.gettext('Yes'),
                cancelButtonText: $.fn.gettext('Cancel'),
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    // Remove the row from DataTable
                    table.row($row).remove().draw(false);

                    // Clean up related data structures
                    cleanupWorkOrderRelatedData(workOrderId);
                }
            });

            loadWorkOrderDetailSummaryValue()
        });
    }

    function cleanupWorkOrderRelatedData(workOrderId) {
        // 1. Clean up work cost data
        if (pageVariable.workOrderCostData[workOrderId]) {
            delete pageVariable.workOrderCostData[workOrderId];
        }

        // 2. Clean up product contribution data
        if (pageVariable.productContributionData[workOrderId]) {
            const contributions = pageVariable.productContributionData[workOrderId];

            // Restore the contribution percentages and delivered quantities back to service details
            contributions.forEach(contribution => {
                if (contribution.is_selected) {
                    const serviceId = contribution.service_id;
                    const totalContributionData = pageVariable.serviceDetailTotalContributionData[serviceId];

                    if (totalContributionData) {
                        // Subtract this work's contribution from totals
                        totalContributionData.total_contribution_percent -= contribution.contribution_percent;
                        totalContributionData.delivery_balance_value += contribution.delivered_quantity;

                        // Ensure values don't go negative
                        if (totalContributionData.total_contribution_percent < 0) {
                            totalContributionData.total_contribution_percent = 0;
                        }
                    }
                }
            });

            // Delete the work's contribution data
            delete pageVariable.productContributionData[workOrderId];
        }

        // 3. Update any other work's contribution data to reflect the new balances
        Object.keys(pageVariable.productContributionData).forEach(otherWorkOrderId => {
            if (otherWorkOrderId !== workOrderId) {
                const otherContributions = pageVariable.productContributionData[otherWorkOrderId];

                otherContributions.forEach(contribution => {
                    const serviceId = contribution.service_id;
                    const totalContributionData = pageVariable.serviceDetailTotalContributionData[serviceId];

                    if (totalContributionData) {
                        contribution.total_contribution_percent = totalContributionData.total_contribution_percent;
                        contribution.balance_quantity = totalContributionData.delivery_balance_value ?? contribution.quantity;
                    }
                });
            }
        });
    }

    function handleDeleteWorkOrderCostRow() {
        pageElement.modalData.$tableWorkOrderCost.on('click', '.delete-cost-row', function(e) {
            e.preventDefault();

            const $btn = $(this);
            const $row = $btn.closest('tr');
            const table = pageElement.modalData.$tableWorkOrderCost.DataTable();
            const totalRows = table.rows().count();

            // Prevent deleting if it's the only row
            if (totalRows === 1) {
                $.fn.notifyB({
                    description: $.fn.gettext('Cannot delete the last cost row. At least one row must remain.')
                }, 'warning');
                return;
            }

            // Simply remove the row from the table without saving
            table.row($row).remove().draw(false)

            loadWorkOrderDetailSummaryValue()
        });
    }

    function handleDeletePaymentRow() {
        pageElement.payment.$table.on('click', '.delete-payment-row', function(e) {
            e.preventDefault();

            const $btn = $(this);
            const $row = $btn.closest('tr');
            const table = pageElement.payment.$table.DataTable();
            const rowData = table.row($row).data();
            const paymentId = rowData.id;
            const paymentType = rowData.payment_type;
            const installmentNumber = rowData.installment;

            let warningMessage = ''
            // Check if this payment has reconciliations
            const hasReconciliations = checkIfPaymentHasReconciliations(paymentId);
            if (hasReconciliations) {
                warningMessage = $.fn.gettext('This payment has active reconciliations that will be removed.');
            }

            const confirmTitle = $.fn.gettext('Delete payment row?')

            Swal.fire({
                html: `
                    <div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>
                    <h5 class="text-danger">${confirmTitle}</h5>
                    <p>${warningMessage}</p>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-danger',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg',
                    actions: 'w-100'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: $.fn.gettext('Yes'),
                cancelButtonText: $.fn.gettext('Cancel'),
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    table.row($row).remove();

                    // Clean up related data structures
                    cleanupPaymentRelatedData(paymentId, paymentType);

                    // Redraw table with updated installment numbers
                    table.draw(false);
                }
            });
        });
    }

    function cleanupPaymentRelatedData(paymentId, paymentType) {
        // 1. Handle payment detail data cleanup
        const paymentDetails = pageVariable.paymentDetailData[paymentId];

        if (paymentDetails) {
            paymentDetails.forEach(detail => {
                if (detail.is_selected) {
                    const serviceId = detail.service_id;

                    // Update service detail total payment data
                    if (pageVariable.serviceDetailTotalPaymentData[serviceId]) {
                        const totalPaymentData = pageVariable.serviceDetailTotalPaymentData[serviceId];

                        // Subtract this payment's contribution
                        totalPaymentData.total_payment_value -= detail.payment_value || 0;
                        totalPaymentData.total_payment_percent -= detail.payment_percent || 0;

                        // Ensure values don't go negative
                        if (totalPaymentData.total_payment_value < 0) {
                            totalPaymentData.total_payment_value = 0;
                        }
                        if (totalPaymentData.total_payment_percent < 0) {
                            totalPaymentData.total_payment_percent = 0;
                        }

                        // If no payments left, could optionally delete the entry
                        if (totalPaymentData.total_payment_value === 0) {
                            delete pageVariable.serviceDetailTotalPaymentData[serviceId];
                        }
                    }

                    // Clean up reconcile data for this payment detail
                    if (pageVariable.reconcileData[detail.id]) {
                        delete pageVariable.reconcileData[detail.id];
                    }
                }
            });

            // Delete payment detail data
            delete pageVariable.paymentDetailData[paymentId];
        }

        // 2. If this is an advance payment, remove it from all reconciliations
        if (paymentType === PAYMENT_TYPE.advance) {
            cleanupAdvancePaymentReconciliations(paymentId);
        }

        // 3. Update other payment details to reflect new balances
        updateAllPaymentDetailsAfterDeletion();
    }

    function cleanupAdvancePaymentReconciliations(advancePaymentId) {
        // Go through all reconcile data and remove references to this advance payment
        Object.keys(pageVariable.reconcileData).forEach(paymentDetailId => {
            const reconcileItems = pageVariable.reconcileData[paymentDetailId];

            if (reconcileItems) {
                // Filter out reconciliations with the deleted advance payment
                const filteredReconcileItems = reconcileItems.filter(
                    item => item.advance_payment_id !== advancePaymentId
                );

                if (filteredReconcileItems.length > 0) {
                    pageVariable.reconcileData[paymentDetailId] = filteredReconcileItems;
                } else {
                    // If no reconcile items left, delete the entry
                    delete pageVariable.reconcileData[paymentDetailId];
                }
            }
        });

        // Update payment detail totals affected by removed reconciliations
        Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
            const paymentDetails = pageVariable.paymentDetailData[paymentId];

            if (paymentDetails) {
                paymentDetails.forEach(detail => {
                    // Recalculate reconcile value for this payment detail
                    let newReconcileValue = 0;

                    if (pageVariable.reconcileData[detail.id]) {
                        pageVariable.reconcileData[detail.id].forEach(reconcileItem => {
                            if (reconcileItem.is_selected) {
                                newReconcileValue += reconcileItem.reconcile_value || 0;
                            }
                        });
                    }

                    // Update the payment detail
                    const oldReconcileValue = detail.reconcile_value || 0;
                    detail.reconcile_value = newReconcileValue;

                    // Update receivable value
                    if (detail.is_selected) {
                        const paymentValue = detail.payment_value || 0;
                        const taxValue = detail.tax_value || 0;
                        detail.receivable_value = paymentValue + taxValue - newReconcileValue;
                    }
                });

                // Update the payment row totals
                updatePaymentRowTotalsAfterReconcileChange(paymentId);
            }
        });
    }

    function updatePaymentRowTotalsAfterReconcileChange(paymentId) {
        const paymentTable = pageElement.payment.$table.DataTable();
        const $paymentRow = pageElement.payment.$table.find(`[data-payment-row-id="${paymentId}"]`);

        if ($paymentRow.length > 0) {
            const paymentDetails = pageVariable.paymentDetailData[paymentId] || [];

            let totalReconcileValue = 0;
            let totalReceivableValue = 0;

            paymentDetails.forEach(detail => {
                if (detail.is_selected) {
                    totalReconcileValue += detail.reconcile_value || 0;
                    totalReceivableValue += detail.receivable_value || 0;
                }
            });

            // Update DOM elements
            $paymentRow.find('.payment-reconcile').attr('data-init-money', totalReconcileValue);
            $paymentRow.find('.payment-receivable-value').attr('data-init-money', totalReceivableValue);

            // Update row data
            const rowData = paymentTable.row($paymentRow).data();
            if (rowData) {
                rowData.reconcile_value = totalReconcileValue;
                rowData.receivable_value = totalReceivableValue;
            }

            // Reinitialize money masks
            $.fn.initMaskMoney2();
        }
    }

    function checkIfPaymentHasReconciliations(paymentId) {
        // Check if this payment is referenced in any reconciliations
        let hasReconciliations = false;

        Object.values(pageVariable.reconcileData).forEach(reconcileItems => {
            if (reconcileItems) {
                const found = reconcileItems.some(item =>
                    item.advance_payment_id === paymentId && item.is_selected
                );
                if (found) {
                    hasReconciliations = true;
                }
            }
        });

        return hasReconciliations;
    }

    function updateAllPaymentDetailsAfterDeletion() {
    // Sync all payment detail data with the updated service detail totals
    Object.keys(pageVariable.paymentDetailData).forEach(paymentId => {
        let paymentDetails = pageVariable.paymentDetailData[paymentId];

        if (paymentDetails) {
            paymentDetails = paymentDetails.map(detail => {
                const serviceId = detail.service_id;
                const totalPaymentData = pageVariable.serviceDetailTotalPaymentData[serviceId];

                if (totalPaymentData) {
                    return {
                        ...detail,
                        issued_value: totalPaymentData.total_payment_value,
                        balance_value: detail.sub_total_value - totalPaymentData.total_payment_value
                    };
                }

                // If no total payment data, reset issued value
                return {
                    ...detail,
                    issued_value: 0,
                    balance_value: detail.sub_total_value
                };
            });

            pageVariable.paymentDetailData[paymentId] = paymentDetails;
        }
    });
}

    return {
        pageVariable,
        pageElement,
        initDateTime,
        initPageSelect,
        loadCurrencyRateData,
        loadTaxData,
        loadUoMData,
        adjustTableSizeWhenChangeTab,
        initProductModalDataTable,
        initServiceDetailDataTable,
        initWorkOrderDataTable,
        initQuotationWorkOrderDataTable,
        initModalContextTracking,
        initPaymentDataTable,
        initAttachment,

        handleCheckProduct,
        handleSaveProduct,
        handleSaveExchangeRate,
        handleOpportunityChange,

        handleChangeServiceDetail,
        handleChangeServiceQuantity,
        handleChangeServicePrice,
        handleChangeServiceDescription,
        loadServiceDetailSummaryValue,
        loadWorkOrderDetailSummaryValue,
        handleChangeServicePercentage,

        handleChangeWorkOrderDetail,
        handleClickOpenWorkOrderCost,
        handleSelectWorkOrderCostTax,
        handleSelectWorkOrderCurrency,
        handleAddWorkOrderNonItem,
        handleAddWorkOrderCostRow,
        handleChangeWorkOrderCostQuantityAndUnitCost,
        handleSaveWorkOrderCost,
        handleChangeWorkOrderCostTitleAndDescription,
        handleSelectWorkOrderCostExpense,
        handleClickOpenServiceDelivery,
        handleSaveProductContribution,
        handleCheckDelivery,
        handleUncheckContribution,
        handleChangeDeliveryCost,
        handleCheckPackage,
        handleOpenModalPackage,
        handleSaveModalPackage,
        handleTogglePackageChildren,
        handleSelectContainer,
        handleChangeProductContributionPercentage,
        handleClickOpenDeliveryLogs,

        handleChangePaymentDate,
        handleAddPaymentRow,
        handleChangePaymentType,
        handleCheckInvoice,
        handleOpenPaymentDetail,
        handleSavePaymentDetail,
        handleChangePaymentDetail,
        handleOpenModalReconcile,
        handleSavePaymentReconcile,

        getExchangeRate,
        getServiceDetailData,
        getWorkOrderData,
        getPaymentData,
        validateDates,
        validateTotalServiceDetailPercent,

        loadExchangeRateData,
        loadServiceDetailRelatedData,
        loadWorkOrderRelatedData,
        loadPaymentRelatedData,

        handleDeleteServiceDetailRow,
        handleDeleteWorkOrderRow,
        handleDeleteWorkOrderCostRow,
        handleDeletePaymentRow
    }
})(jQuery)
