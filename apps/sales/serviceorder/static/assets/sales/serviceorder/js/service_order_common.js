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
        },
        serviceDetail: {
            $table: $('#table-service-detail'),
            $btnOpenServiceProductModal: $('#btn-open-service-product-modal'),
        },
        workOrder:{
            $table: $('#table-work-order'),
        }
    }

    const pageVariable = {
        currencyList: null,
        modalProductContext: null
    }



    function initSelect($ele, opts = {}) {
        if ($ele.hasClass("select2-hidden-accessible")) {
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
            const unitCost = rowData.general_price || 0

            return {
                ...baseData,
                unit_cost: unitCost,
                total: unitCost, // Will be recalculated when quantity changes
                start_date: '',
                end_date: '',
                is_service_delivery: false,
                status: 'pending'
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
                    width: '10%',
                    title: $.fn.gettext('Start Date'),
                    render: (data, type, row) => {
                        const startDate = row.start_date || ''
                        return `<div class="input-group">
                                <input type="text" class="form-control date-input work-order-start-date" value="${startDate}" placeholder="DD/MM/YYYY">
                            </div>`
                    }
                },
                {
                    width: '10%',
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
                        const isServiceDelivery = row.is_service_delivery || false
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
                    width: '12%',
                    title: $.fn.gettext('Unit Cost'),
                    render: (data, type, row) => {
                        const unitCost = row.unit_cost || 0
                        return `<div class="input-group">
                                <span class="mask-money" data-init-money="${unitCost}">
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
                        const status = row.status || 'pending'
                        const statusOptions = {
                            'pending': { label: 'Pending', class: 'badge-warning' },
                            'in_progress': { label: 'In Progress', class: 'badge-info' },
                            'completed': { label: 'Completed', class: 'badge-success' },
                            'cancelled': { label: 'Cancelled', class: 'badge-danger' }
                        }
                        const statusInfo = statusOptions[status] || statusOptions['pending']
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
                } else if (pageVariable.modalContext === 'workOrder') {
                    addProductsToWorkOrder(checkedProducts)
                }
                // Clear selections
                pageElement.modalData.$tableProduct.find('input[name="select-product"]').prop('checked', false)
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

    function handleChangeDescription() {
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

    // function handleAddNonItem() {
    //     pageElement.buttons.$btnAddNonItem.on('click', function(e) {
    //         e.preventDefault()
    //
    //         // Add empty row to work order for manual entry
    //         const emptyWorkOrderItem = {
    //             code: '',
    //             description: '',
    //             quantity: 1,
    //             unit_cost: 0,
    //             total: 0,
    //             start_date: '',
    //             end_date: '',
    //             is_service_delivery: false,
    //             status: 'pending'
    //         }
    //
    //         addProductsToWorkOrder([emptyWorkOrderItem])
    //     })
    // }

    return  {
        initDateTime,
        initPageSelect,
        loadCurrencyRateData,
        initProductModalDataTable,
        initServiceDetailDataTable,
        initWorkOrderDataTable,
        initModalContextTracking,
        handleSaveProduct,
        handleChangeServiceQuantity,
        handleChangeDescription,
        handleChangeWorkOrderDate
    }
})(jQuery)