//IIFE pattern, hide pageElement and pageVariable from browser console
const ServiceOrder = (function($) {
    const pageElement = {
        $urlScript: $('#script-url'),
        commonData: {
            $createdDate: $('#so-created-date'),
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
        },
        serviceDetail: {
            $table: $('#table-service-detail'),
            $btnOpenServiceProductModal: $('#btn-open-service-product-modal'),
        },
        workOrder:{
            $table: $('#table-work-order'),
            $btnAddNonItem: $('#btn-add-non-item'),
        },
        payment: {
            $table: $('#table-payment'),
            $btnAddInstallment: $('#btn-add-installment'),
        }
    }

    const pageVariable = {
        currencyList: null,
        taxList: null,
        modalProductContext: null,
        workOrderCostData: {},

        /**
         * @type {{ [work_order_id: string]: [{ service_id: string, contribution_percent: number, delivered_quantity: number}] }}
         * @description Biến lưu dữ liệu đóng góp của 1 hàng work order (còn gồm nhiều field khác)
         */
        productContributionData: {},

        /**
         * @type {{ [service_id: string]: { total_contribution_percent: number, delivery_balance_value: number} }}
         * @description Biến lưu dữ liệu tổng đóng góp và còn lại của 1 dòng service detail
         */
        serviceDetailTotalContributionData: {},

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
            element: pageElement.commonData.$createdDate,
            empty: false
        })

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
            id: uniqueStr
        }

        if (pageVariable.modalContext === 'serviceDetail') {
            const price = rowData.general_price || 0
            const taxRate = (rowData?.sale_tax?.rate || 0) / 100
            const taxAmount = price * taxRate
            const total = taxAmount + price

            return {
                ...baseData,
                price: price,
                tax_code: rowData?.sale_tax?.code || '',
                tax_data: rowData?.sale_tax || {},
                sub_total_value: price,
                total_value: total
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

// --------------------LOAD DATA---------------------
    function loadCurrencyRateData() {
        const currencyListUrl = pageElement.$urlScript.attr('data-currency-list-url')
        $.fn.callAjax2({
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
        $.fn.callAjax2({
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

// --------------------HANDLE INIT DATATABLES---------------------
    function initProductModalDataTable() {
        pageElement.modalData.$tableProduct.DataTableDefault({
            useDataServer: true,
            reloadCurrency: true,
            autoWidth: false,
            scrollCollapse: true,
            scrollY: '35vh',
            ajax: {
                url: pageElement.modalData.$tableProduct.attr('data-url'),
                type: 'GET',
                data: function (params) {

                },
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
                    targets: 0,
                    width: '10%',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    width: '30%',
                    className: 'min-w-150p',
                    render: (data, type, row) => {
                        const code = row?.['code']
                        return `<div>${code}</div>`
                    }
                },
                {
                    targets: 2,
                    width: '50%',
                    className: 'min-w-210p',
                    render: (data, type, row) => {
                        const name = row?.['title']
                        return `<div>${name}</div>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        const productId = row?.['id']
                        return `<div class="form-check">
                                <input 
                                    type="checkbox"  
                                    class="form-check-input"
                                    name="select-product" 
                                    data-product-id="${productId}"
                                />
                            </div>`
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
            data: data,
            reloadCurrency: true,
            rowIdx: true,
            autoWidth: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            columns: [
                {
                    width: '1',
                    title: $.fn.gettext(''),
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Code'),
                    render: (data, type, row) => {
                        return row.code || ''
                    }
                },
                {
                    width: '20%',
                    title: $.fn.gettext('Name'),
                    render: (data, type, row) => {
                        return row.title || ''
                    }
                },
                {
                    width: '20%',
                    title: $.fn.gettext('Description'),
                    render: (data, type, row) => {
                        const rowDescription = row.description || ''
                        return `<div class="input-group">
                                <textarea class="form-control cost-description">${rowDescription}</textarea>
                            </div>`
                    }
                },
                {
                    width: '8%',
                    title: $.fn.gettext('Quantity'),
                    render: (data, type, row) => {
                        const rowQuantity = row.quantity || 1
                        return `<div class="input-group">
                                <input type="number" class="form-control service-quantity" value="${rowQuantity}" min="0">
                            </div>`
                    }
                },
                {
                    width: '7%',
                    title: $.fn.gettext('Unit'),
                    render: (data, type, row) => {
                        return row.uom_title || ''
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Price'),
                    render: (data, type, row) => {
                        const price = row.price || 0
                        return `<div class="input-group">
                                <span class="mask-money" data-init-money="${price}"></span>
                            </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Tax'),
                    render: (data, type, row) => {
                        return row.tax_code || ''
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Total amount'),
                    render: (data, type, row) => {
                        const total = row.total_value || 0
                        return `<div class="input-group">
                                <span class="mask-money" data-init-money="${total}"></span>
                            </div>`
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Action'),
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover service-del-row"
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom"
                                    >
                                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                                    </button>
                                </div>`

                    }
                },
            ]
        })
    }

    function initWorkOrderDataTable(data = []) {
        if ($.fn.DataTable.isDataTable(pageElement.workOrder.$table)) {
            pageElement.workOrder.$table.DataTable().destroy()
        }

        pageElement.workOrder.$table.DataTableDefault({
            data: data,
            reloadCurrency: true,
            rowIdx: true,
            autoWidth: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            columns: [
                {
                    width: '1%',
                    title: $.fn.gettext(''),
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Code'),
                    render: (data, type, row) => {
                        return row.code || ''
                    }
                },
                {
                    width: '12%',
                    title: $.fn.gettext('Description'),
                    render: (data, type, row) => {
                        const name = row.title || ''
                        const isItemRow = row?.product_id
                        if (isItemRow){
                            return `<div class="" title="${name}">${name}</div>`
                        } else {
                            return `<div class="input-group">
                                        <textarea
                                            class="form-control work-order-description"
                                            rows="1"
                                        >${name}</textarea>
                                    </div>`
                        }
                    }
                },
                {
                    width: '8%',
                    title: $.fn.gettext('Assignee'),
                    render: (data, type, row) => {
                        const assignee = row?.assignee || 'not yet'
                        return `<div class="d-flex align-items-center">
                                    <div>
                                        <span>${assignee}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover"
                                        title=""
                                    >
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    width: '9%',
                    title: $.fn.gettext('Start Date'),
                    render: (data, type, row) => {
                        const startDate = row.start_date || ''
                        return `<div class="input-group">
                                <input type="text" class="form-control date-input work-order-start-date" value="${startDate}" placeholder="DD/MM/YYYY">
                            </div>`
                    }
                },
                {
                    width: '9%',
                    title: $.fn.gettext('End Date'),
                    render: (data, type, row) => {
                        const endDate = row.end_date || ''
                        return `<div class="input-group">
                                <input type="text" class="form-control date-input work-order-end-date" value="${endDate}" placeholder="DD/MM/YYYY">
                            </div>`
                    }
                },
                {
                    width: '9%',
                    title: $.fn.gettext('Is Service Delivery'),
                    render: (data, type, row) => {
                        const isServiceDelivery = row.is_delivery_point || false
                        const rowId = row.id
                        return `<div class="d-flex align-items-center">
                                    <div class="form-check me-2">
                                        <input 
                                            type="checkbox"  
                                            class="form-check-input work-order-service-delivery"
                                            ${isServiceDelivery ? 'checked' : ''}
                                        />
                                    </div>
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-open-service-delivery"
                                        data-row-id="${rowId}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-product-contribution"
                                        title="Open service delivery details"
                                    >
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    width: '8%',
                    title: $.fn.gettext('Quantity'),
                    render: (data, type, row) => {
                        const quantity = row.quantity || 1
                        return `<div class="input-group">
                                <input type="number" class="form-control work-order-quantity" value="${quantity}" min="0">
                            </div>`
                    }
                },
                {
                    width: '12%',
                    title: $.fn.gettext('Unit Cost'),
                    render: (data, type, row) => {
                        const unitCost = row.unit_cost || 0
                        const workOrderId = row.id || null
                        return `<div class="d-flex align-items-center">
                                    <div>
                                        <span class="mask-money" data-init-money="${unitCost}"></span>
                                    </div>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover ml-2 btn-open-work-order-cost"
                                            data-bs-toggle="modal" data-bs-target="#modal-work-order-cost">
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    width: '11%',
                    title: $.fn.gettext('Total Amount'),
                    render: (data, type, row) => {
                        const totalAmount = row.total_value || 0
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${totalAmount}"></span>
                                </div>`
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Status'),
                    render: (data, type, row) => {
                        const status = row.status || WORK_ORDER_STATUS.pending
                        const statusOptions = {
                            0: { label: 'Pending', class: 'badge-warning' },
                            1: { label: 'In Progress', class: 'badge-info' },
                            2: { label: 'Completed', class: 'badge-success' },
                            3: { label: 'Cancelled', class: 'badge-danger' }
                        }
                        const statusInfo = statusOptions[status] || statusOptions[0]
                        return `<span class="badge ${statusInfo.class}">${$.fn.gettext(statusInfo.label)}</span>`
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Action'),
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
                    width: '5%',
                    title: $.fn.gettext(''),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        return `<div class="btn-add-cost-area"></div>`
                    }
                },
                {
                    width: '4%',
                    title: $.fn.gettext('Order'),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        return Number(meta.row) + 1
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Title'),
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
                    width: '15%',
                    title: $.fn.gettext('Description'),
                    render: (data, type, row) => {
                        const description = row.description || ''
                        return `<div class="input-group">
                                    <textarea
                                        class="form-control wo-cost-description"
                                        rows="1"
                                    >${description}</textarea>
                                </div>`
                    }
                },
                {
                    width: '6%',
                    title: $.fn.gettext('Quantity'),
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
                    width: '10%',
                    title: $.fn.gettext('Unit Cost'),
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
                    width: '8%',
                    title: $.fn.gettext('Currency'),
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
                    width: '8%',
                    title: $.fn.gettext('Tax'),
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
                    width: '12%',
                    title: $.fn.gettext('Total Amount'),
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
                    width: '12%',
                    title: $.fn.gettext('Total'),
                    render: (data, type, row) => {
                        const exchangedTotal = row.exchanged_total_value || 0
                        return `<div>
                                    <span class="order-cost-exchanged-total mask-money" data-init-money="${exchangedTotal}"></span>
                                </div>`
                    }
                },
                {
                    width: '5%',
                    title: $.fn.gettext('Action'),
                    className: 'text-center',
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
                    width: '30%',
                    title: $.fn.gettext('Title'),
                    render: (data, type, row) => {
                        return row?.title
                    }
                },
                {
                    width: '20%',
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
                    width: '20%',
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
                    width: '20%',
                    title: $.fn.gettext('No of Service Delivered'),
                    render: (data, type, row) => {
                        const quantity = row.delivered_quantity || 0
                        const balance = row.balance_quantity || 0
                        return `<div class="input-group">
                                    <input
                                        ${!isDelivery ? 'disabled' : ''}
                                        type="number"
                                        class="form-control pc-delivered-quantity"
                                        value="${quantity}"
                                        min="0"
                                        max="${balance}"
                                    />
                                </div>`
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
                    width: '5%',
                    title: $.fn.gettext('Installment'),
                    className: 'text-center',
                    render: (data, type, row, meta) => {
                        return Number(meta.row) + 1
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
                                        rows="1"
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
                    width: '13%',
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
                    width: '5%',
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
            drawCallback: function (data, type, row) {
                pageElement.payment.$table.find('input.date-input').each(function(){
                    const $input = $(this)
                    const value = $input.val()

                    UsualLoadPageFunction.LoadDate({ element: $input })

                    if (value && $input.data('daterangepicker')) {
                        $input.data('daterangepicker').setStartDate(value)
                    }
                })

                pageElement.payment.$table.DataTable().rows().every(function (rowIdx) {
                    const $row = $(this.node())
                    let data = this.data()

                    data.installment = rowIdx + 1
                    this.data(data)
                    $row.attr('data-payment-row-id', data.id)
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
                        const issuedInvoiceValue = row.issued_value || 0
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${issuedInvoiceValue}"></span>
                                </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Balance'),
                    render: (data, type, row, meta) => {
                        const balance = row.balance_value || 0
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
    function handleSaveProduct() {
        pageElement.modalData.$btnSaveProduct.on('click', function (e) {
            // Get all checked products from modal table
            const checkedProducts = [];
            pageElement.modalData.$tableProduct.find('input[name="select-product"]:checked').each(function () {
                const $row = $(this).closest('tr');
                const rowData = pageElement.modalData.$tableProduct.DataTable().row($row).data();

                if (rowData) {
                    checkedProducts.push(transformProductData(rowData, $(this).data('product-id')));
                }
            });

            // Add checked products to service detail table
            if (checkedProducts.length > 0) {
                if (pageVariable.modalContext === 'serviceDetail') {
                    const table = pageElement.serviceDetail.$table.DataTable()
                    const currentData = table.data().toArray()
                    const newData = [...currentData, ...checkedProducts]
                    table.clear().rows.add(newData).draw(false)
                } else if (pageVariable.modalContext === 'workOrder') {
                    const table = pageElement.workOrder.$table.DataTable()
                    const currentData = table.data().toArray()
                    const newData = [...currentData, ...checkedProducts]
                    table.clear().rows.add(newData).draw(false)
                }
                // Clear selections
                pageElement.modalData.$tableProduct.find('input[name="select-product"]').prop('checked', false)
            }
        })
    }

    // ============ service detail =============
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
        pageElement.serviceDetail.$table.on('change', '.service-quantity', function (e) {
            const $input = $(this)
            const $row = $input.closest('tr')
            const table = pageElement.serviceDetail.$table.DataTable()
            const rowData = table.row($row).data()

            if (rowData) {
                const newQuantity = parseFloat($input.val()) || 0

                // Update row data
                rowData.quantity = newQuantity

                // Calculate new total (quantity * price)
                const price = parseFloat(rowData.price) || 0;
                const taxRate = parseFloat(rowData.tax_data?.rate || 0) / 100
                const subtotal = newQuantity * price
                const taxAmount = subtotal * taxRate
                rowData.sub_total_value = subtotal
                rowData.total_value = subtotal + taxAmount

                //col 8
                const $totalCell = $row.find('td').eq(8)
                const $totalMoneySpan = $totalCell.find('.mask-money')
                $totalMoneySpan.attr('data-init-money', subtotal + taxAmount)

                $.fn.initMaskMoney2()
            }
        })
    }

    // ============ work order =============
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
            if (!validateDates(rowData)) {
                rowData.end_date = oldEndDate
                $input.val(oldEndDate || '')
            }
        })
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
            const rowWorkOrderCost = pageVariable.workOrderCostData[rowId]

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

            // Add empty row to work order for manual entry
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

            const table = pageElement.modalData.$tableWorkOrderCost.DataTable()

            const workOrderCostList = table.data().toArray()

            let totalAmount = 0

            workOrderCostList.forEach((item, index) => {
                totalAmount += item.exchanged_total_value
                item.order = index
                    return item
            })
            pageVariable.workOrderCostData[workOrderRowId] = workOrderCostList

            const workOrderRow = pageElement.workOrder.$table.DataTable().row(workOrderRowId)
            const workOrderRowData = workOrderRow.data()
            workOrderRowData.unit_cost = totalAmount
            workOrderRowData.total_value = totalAmount * workOrderRowData.quantity
            pageElement.workOrder.$table.DataTable().row(workOrderRow).data(workOrderRowData).draw(false)
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

                return {
                    service_id: serviceDetailId,
                    code: sdItem.code,
                    title: sdItem.title,
                    quantity: sdItem.quantity,
                    total_contribution_percent: totalContribution,
                    balance_quantity: balance,
                    contribution_percent: 0,
                    delivered_quantity: 0,
                    is_selected: false,
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
                            is_selected: Boolean(currProductContribution.is_selected),
                            contribution_percent: currProductContribution.contribution_percent || 0,
                            delivered_quantity: currProductContribution.delivered_quantity || 0
                        }
                    }
                    return pcItem
                })
            }
            pageVariable.productContributionData[rowId] = JSON.parse(JSON.stringify(productContributionData))
            initProductContributionModalDataTable(productContributionData)
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

                const isSelected = $checkbox.is(':checked')
                const rowId = $checkbox.data('service-row-id')
                let contribution = parseFloat($contributionInput.val()) || 0
                let deliveredQuantity = parseFloat($deliveredQuantityInput.val()) || 0
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
                            is_selected: isSelected,
                            contribution_percent: isSelected ? contribution : 0,
                            delivered_quantity: isSelected ? deliveredQuantity : 0,
                            total_contribution_percent: pageVariable.serviceDetailTotalContributionData[rowId]?.total_contribution_percent,
                            balance_quantity: pageVariable.serviceDetailTotalContributionData[rowId]?.delivery_balance_value,
                        }
                    }
                    return item
                })
            })
            if(!isValid){
                return
            }
            pageVariable.productContributionData[workOrderRowId] = productContributionData
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
            }
        })
    }

    // ============ payment =============
    function handleChangePaymentDate() {
        pageElement.payment.$table.on('apply.daterangepicker', '.payment-due-date', function (ev, picker) {
            const $input = $(ev.currentTarget)
            const $row = $input.closest('tr')
            const table = pageElement.payment.$table.DataTable()
            const rowData = table.row($row).data()
            rowData.start_date = moment(picker.startDate).format('DD/MM/YYYY')
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

            //remove payment no invoice data
            if(isChecked){
                let noInvoicePaymentData = pageVariable.paymentDetailData[rowId]
                if (noInvoicePaymentData){
                    noInvoicePaymentData.forEach((nipdItem)=>{
                        const serviceId = nipdItem.service_id
                        const totalPaymentData = pageVariable.serviceDetailTotalPaymentData[serviceId]
                        if(totalPaymentData){
                            let totalPercentage = totalPaymentData?.total_payment_percent
                            let totalValue = totalPaymentData?.total_payment_value

                            totalPercentage -= nipdItem.payment_percent
                            totalValue -= nipdItem.payment_value

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

                $.fn.initMaskMoney2()
            }
            //remove payment with invoice data
            else {
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
                        payment_value: 0
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
                                payment_value: currPayment.payment_value
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

                        if(newTotalPaymentPer > 100) {
                            $.fn.notifyB({description: $.fn.gettext(`Value must not exceed 100`)}, 'failure')
                            isValid = false
                            return false
                        }


                        // pageVariable.serviceDetailTotalPaymentData[rowId] = {
                        //     total_payment_value: newTotalPaymentVal,
                        //     total_payment_percentage: newTotalPaymentPer
                        // }
                    }
                    //else remove value from total value
                    else {
                        const newTotalPaymentVal = currTotalPaymentVal - serviceRowPaymentValue
                        const newTotalPaymentPer = currTotalPaymentPer - serviceRowPaymentPercentage

                        if(newTotalPaymentPer > 100) {
                            $.fn.notifyB({description: $.fn.gettext(`Value must not exceed 100`)}, 'failure')
                            isValid = false
                            return false
                        }

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
                            receivable_value: receivableValue,
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
                const installment = rowData.installment

                //if payment row is advance and has installment smaller than currPaymentRow
                if(isAdvancePayment && installment < paymentRowInstallment) {
                    const paymentDetailData = pageVariable.paymentDetailData[rowId]
                    if(paymentDetailData){
                        paymentDetailData.forEach(function(paymentDetailItem){
                            const reconcileId = Math.random().toString(36).slice(2)
                            reconcileTableData.push({
                                id: reconcileId,
                                advance_payment_id: rowId, //id of payment table row
                                payment_detail_id: paymentDetailItem.id, //id of payment detail table row
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
                        && cprItem.payment_detail_id === rItem.payment_detail_id
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
                    paymentDetailRowData = advancePaymentData.find(item => item.id === rowData.payment_detail_id)
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
                        totalReconciledValue = totalReconciledValue - reconcileValue
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
                        .find(item => item.id === rowData.payment_detail_id)
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
            const subtotal = currentQuantity * price
            const taxAmount = subtotal * taxRate
            const currentTotal = subtotal + taxAmount

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
                price: price,
                tax: rowData.tax_data?.id || null,
                tax_data: rowData.tax_data || {},
                total_value: currentTotal,
                total_contribution_percent: pageVariable.serviceDetailTotalContributionData?.[rowData.id]?.total_contribution_percent || 0,
                delivery_balance_value: pageVariable.serviceDetailTotalContributionData?.[rowData.id]?.delivery_balance_value || currentQuantity,
                total_payment_percent: pageVariable.serviceDetailTotalPaymentData?.[rowData.id]?.total_payment_percent || 0,
                total_payment_value: pageVariable.serviceDetailTotalPaymentData?.[rowData.id]?.total_payment_value || 0
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
            const currentStartDate = $row.find('.work-order-start-date').val() || rowData.start_date || '';
            const currentEndDate = $row.find('.work-order-end-date').val() || rowData.end_date || '';
            const isDeliveryPoint = $row.find('.work-order-service-delivery').is(':checked') || false;

            // Calculate current total
            const unitCost = parseFloat(rowData.unit_cost) || 0;
            const currentTotal = currentQuantity * unitCost;

            // Collect the work order data
            const workOrder = {
                id: rowData.id,
                product_id: rowData.product_id || null, // Null for non-item rows
                code: rowData.code || '',
                title: currentDescription,
                assignee: rowData.assignee || null,
                start_date: currentStartDate,
                end_date: currentEndDate,
                is_delivery_point: isDeliveryPoint,
                quantity: currentQuantity,
                unit_cost: unitCost,
                total_value: currentTotal,
                status: rowData.status || 0,
                // Include work order cost breakdown if exists
                cost_data: pageVariable.workOrderCostData?.[rowData.id] || [],
                // Include product contribution data if exists and is delivery point
                product_contribution: pageVariable.productContributionData?.[rowData.id]
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
            const currentDueDate = $row.find('.payment-due-date').val() || rowData.due_date || '';

            // Get payment values from data (these are updated via other functions)
            const paymentValue = parseFloat(rowData.payment_value) || 0;
            const taxValue = parseFloat(rowData.tax_value) || 0;
            const reconcileValue = parseFloat(rowData.reconcile_value) || 0;
            const receivableValue = parseFloat(rowData.receivable_value) || 0;

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
                payment_details: pageVariable.paymentDetailData?.[rowData.id],
                // Include reconcile data for each payment detail
                reconcile_details: (() => {
                    const reconcileDetails = [];
                    if (pageVariable.paymentDetailData?.[rowData.id]) {
                        pageVariable.paymentDetailData[rowData.id].forEach(paymentDetail => {
                            if (paymentDetail.is_selected && pageVariable.reconcileData?.[paymentDetail.id]) {
                                const reconcileItems = pageVariable.reconcileData[paymentDetail.id]
                                    .filter(item => item.is_selected);
                                if (reconcileItems.length > 0) {
                                    reconcileDetails.push({
                                        payment_detail_id: paymentDetail.id,
                                        service_id: paymentDetail.service_id,
                                        reconcile_items: reconcileItems
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

    return {
        pageVariable,
        pageElement,
        initDateTime,
        initPageSelect,
        loadCurrencyRateData,
        loadTaxData,
        initProductModalDataTable,
        initServiceDetailDataTable,
        initWorkOrderDataTable,
        initModalContextTracking,
        initPaymentDataTable,
        initAttachment,
        handleSaveProduct,
        handleChangeServiceQuantity,
        handleChangeServiceDescription,
        handleChangeWorkOrderDetail,
        handleClickOpenWorkOrderCost,
        handleSelectWorkOrderCostTax,
        handleSelectWorkOrderCurrency,
        handleAddWorkOrderNonItem,
        handleAddWorkOrderCostRow,
        handleChangeWorkOrderCostQuantityAndUnitCost,
        handleSaveWorkOrderCost,
        handleChangeWorkOrderCostTitleAndDescription,
        handleClickOpenServiceDelivery,
        handleSaveProductContribution,
        handleCheckDelivery,
        handleUncheckContribution,
        handleChangePaymentDate,
        handleAddPaymentRow,
        handleChangePaymentType,
        handleCheckInvoice,
        handleOpenPaymentDetail,
        handleSavePaymentDetail,
        handleChangePaymentDetail,
        handleOpenModalReconcile,
        handleSavePaymentReconcile,
        getServiceDetailData,
        getWorkOrderData,
        getPaymentData
    }
})(jQuery)
