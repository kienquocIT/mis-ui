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
        },
        serviceDetail: {
            $table: $('#table-service-detail'),
            $btnOpenServiceProductModal: $('#btn-open-service-product-modal'),
        },
        workOrder:{
            $table: $('#table-work-order'),
            $btnAddNonItem: $('#btn-add-non-item'),
        }
    }

    const pageVariable = {
        currencyList: null,
        taxList: null,
        modalProductContext: null,
        taxSelect: {},
        workOrderCostData: {}
    }

    const WORK_ORDER_STATUS = {
        pending: 0,
        in_progress: 1,
        completed: 2,
        cancelled: 3,
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

    function transformProductData(rowData, productId) {
        const baseData = {
            product_id: productId,
            code: rowData.code,
            name: rowData.title,
            description: rowData.description || '',
            quantity: 1,
            uom: rowData?.sale_default_uom?.title || '',
        }

        if (pageVariable.modalContext === 'serviceDetail') {
            const price = rowData.general_price || 0
            const taxRate = (rowData?.sale_tax?.rate || 0) / 100
            const taxAmount = price * taxRate
            const total = taxAmount + price

            return {
                ...baseData,
                price: price,
                tax: rowData?.sale_tax?.code || '',
                tax_data: rowData?.sale_tax || {},
                total: total
            }
        } else if (pageVariable.modalContext === 'workOrder') {
            return {
                ...baseData,
                unit_cost: 0,
                total: 0, // Will be recalculated when quantity changes
                start_date: '',
                end_date: '',
                is_delivery_point: false,
                status: WORK_ORDER_STATUS.pending
            }
        }

        return baseData
    }

    function addProductsToServiceDetail(products) {
        const table = pageElement.serviceDetail.$table.DataTable()
        const currentData = table.data().toArray()
        const newData = [...currentData, ...products]
        table.clear().rows.add(newData).draw(false)
    }

    function addProductsToWorkOrder(products) {
        const table = pageElement.workOrder.$table.DataTable()
        const currentData = table.data().toArray()
        const newData = [...currentData, ...products]
        table.clear().rows.add(newData).draw(false)
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
            total: total,
            exchanged_total: exchangedTotal
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
                    width: '0%',
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
                        return row.name || ''
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
                        return row.uom || ''
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Price'),
                    render: (data, type, row) => {
                        const price = row.price || 0
                        return `<div class="input-group">
                                <span class="mask-money" data-init-money="${price}">
                            </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Tax'),
                    render: (data, type, row) => {
                        return row.tax || ''
                    }
                },
                {
                    width: '15%',
                    title: $.fn.gettext('Total amount'),
                    render: (data, type, row) => {
                        const total = row.total || 0
                        return `<div class="input-group">
                                <span class="mask-money" data-init-money="${total}">
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
                    width: '15%',
                    title: $.fn.gettext('Description'),
                    render: (data, type, row) => {
                        const name = row.name || ''
                        return `<div class="" title="${name}">${name}</div>`
                    }
                },
                {
                    width: '8%',
                    title: $.fn.gettext('Start Date'),
                    render: (data, type, row) => {
                        const startDate = row.start_date || ''
                        return `<div class="input-group">
                                <input type="text" class="form-control date-input work-order-start-date" value="${startDate}" placeholder="DD/MM/YYYY">
                            </div>`
                    }
                },
                {
                    width: '8%',
                    title: $.fn.gettext('End Date'),
                    render: (data, type, row) => {
                        const endDate = row.end_date || ''
                        return `<div class="input-group">
                                <input type="text" class="form-control date-input work-order-end-date" value="${endDate}" placeholder="DD/MM/YYYY">
                            </div>`
                    }
                },
                {
                    width: '10%',
                    title: $.fn.gettext('Is Service Delivery'),
                    render: (data, type, row) => {
                        const isServiceDelivery = row.is_delivery_point || false
                        const rowId = row.id || Math.random().toString(36).substr(2, 9)
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
                                    class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover work-order-delivery-modal"
                                    data-row-id="${rowId}"
                                    data-bs-toggle="tooltip" 
                                    data-bs-placement="bottom"
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
                    width: '16%',
                    title: $.fn.gettext('Unit Cost'),
                    render: (data, type, row) => {
                        const unitCost = row.unit_cost || 0
                        return `<div class="d-flex align-items-center">
                                    <div>
                                        <span class="mask-money" data-init-money="${unitCost}">
                                    </div>
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover ml-2 btn-open-work-order-cost"
                                            data-bs-toggle="modal" data-bs-target="#modal-work-order-cost">
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </div>`
                    }
                },
                {
                    width: '12%',
                    title: $.fn.gettext('Total Amount'),
                    render: (data, type, row) => {
                        const totalAmount = row.total || 0
                        return `<div class="input-group">
                                    <span class="mask-money" data-init-money="${totalAmount}">
                                </div>`
                    }
                },
                {
                    width: '8%',
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
                                        class="form-control cost-title"
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
                                        class="form-control"
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
                        const total = row.total || 0
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
                    title: $.fn.gettext('Total (VND)'),
                    render: (data, type, row) => {
                        const exchangedTotal = row.exchanged_total || 0
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
                    addProductsToServiceDetail(checkedProducts)
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
                rowData.total = subtotal + taxAmount

                // Update the row data in DataTable
                table.row($row).data(rowData).draw(false)
            }
        })
    }



    function handleChangeWorkOrderDate() {
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
    }

    function handleChangeWorkOrderQuantity(){
        pageElement.workOrder.$table.on('change', '.work-order-quantity', function (e){
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const table = pageElement.workOrder.$table.DataTable()
            const rowData = table.row($row).data()
            rowData.quantity = Number($ele.val() || 0)

            const totalData = calculateWorkOrderCostTotalData(rowData)
            rowData.total = totalData.total
            rowData.exchanged_total = totalData.exchanged_total
            table.row($row).data(rowData).draw(false)
        })
    }

    function handleClickOpenWorkOrderCost() {
        pageElement.workOrder.$table.on('click', '.btn-open-work-order-cost', function(e){
            const $row = $(e.currentTarget).closest('tr')
            const table = pageElement.workOrder.$table.DataTable()
            const rowIndex = table.row($row).index()
            const rowWorkOrderCost = pageVariable.workOrderCostData[rowIndex]
            pageElement.modalData.$tableWorkOrderCost.attr('data-row-index', rowIndex)
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
            rowData.total = total
            rowData.exchanged_total = exchangedTotal
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
            rowData.total = totalData.total
            rowData.exchanged_total = totalData.exchanged_total
            tableWorkOrderCost.row($row).data(rowData).draw(false)
        })
    }

    function handleAddWorkOrderNonItem() {
        pageElement.workOrder.$btnAddNonItem.on('click', function(e) {
            e.preventDefault()

            // Add empty row to work order for manual entry
            const emptyWorkOrderItem = {
                code: '',
                description: '',
                quantity: 1,
                unit_cost: 0,
                total: 0,
                start_date: '',
                end_date: '',
                is_delivery_point: false,
                status: 0
            }

            addProductsToWorkOrder([emptyWorkOrderItem])
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
                total: 0,
                exchanged_total: 0
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
            rowData.total = totalData.total
            rowData.exchanged_total = totalData.exchanged_total
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
            rowData.total = totalData.total
            rowData.exchanged_total = totalData.exchanged_total
            table.row($row).data(rowData).draw(false)
        })
    }

    function handleSaveWorkOrderCost(){
        pageElement.modalData.$btnSaveWorkOrderCost.on('click', function(e) {
            const rowIndex = pageElement.modalData.$tableWorkOrderCost.attr('data-row-index')

            const table = pageElement.modalData.$tableWorkOrderCost.DataTable()

            const workOrderCostList = table.data().toArray()

            let totalAmount = 0

            workOrderCostList.forEach((item, index) => {
                totalAmount += item.exchanged_total
                item.order = index
                    return item
            })
            pageVariable.workOrderCostData[rowIndex] = workOrderCostList

            const workOrderRow = pageElement.workOrder.$table.DataTable().row(rowIndex)
            const workOrderRowData = workOrderRow.data()
            workOrderRowData.unit_cost = totalAmount
            workOrderRowData.total = totalAmount * workOrderRowData.quantity
            pageElement.workOrder.$table.DataTable().row(workOrderRow).data(workOrderRowData).draw(false)
        })
    }

    return {
        pageVariable,
        initDateTime,
        initPageSelect,
        loadCurrencyRateData,
        loadTaxData,
        initProductModalDataTable,
        initServiceDetailDataTable,
        initWorkOrderDataTable,
        initModalContextTracking,
        handleSaveProduct,
        handleChangeServiceQuantity,
        handleChangeServiceDescription,
        handleChangeWorkOrderDate,
        handleChangeWorkOrderQuantity,
        handleClickOpenWorkOrderCost,
        handleSelectWorkOrderCostTax,
        handleSelectWorkOrderCurrency,
        handleAddWorkOrderNonItem,
        handleAddWorkOrderCostRow,
        handleChangeWorkOrderCostQuantityAndUnitCost,
        handleSaveWorkOrderCost
    }
})(jQuery)
