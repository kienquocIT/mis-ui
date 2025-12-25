const SOURCE_TYPE = {
    INVENTORY_TRANSFER: 0,
    ASSET_PURCHASE: 1,
    ASSET_MANUFACTURED: 2,
    CAPITAL_INVESTMENT: 3,
    DONATION: 4,
    CAPITAL_CONTRIBUTION: 5
}

const SOURCE_TYPE_MAP = {
    0: $.fn.gettext('Transfer from Inventory'),
    1: $.fn.gettext('Purchase Fixed Assets'),
    2: $.fn.gettext('Self-Manufactured Fixed Assets'),
    3: $.fn.gettext('Capital Construction Investment'),
    4: $.fn.gettext('Donation / Sponsorship'),
    5: $.fn.gettext('Receive Capital Contribution'),
}

const TRACKING_METHOD = {
    NONE: 0,
    LOT: 1,
    SERIAL: 2
}

const TRACKING_METHOD_DISPLAY = {
    0: $.fn.gettext('None'),
    1: $.fn.gettext('Batch/Lot number'),
    2: $.fn.gettext('Serial number'),
}

const CASH_OUT_FLOW_TYPE = {
    PAYMENT_SUPPLIER: 0,
    PAYMENT_CUSTOMER: 1,
    ADVANCE_PAYMENT_EMPLOYEE: 2,
    PAYMENT_ACCOUNT: 3
}

const CASH_OUT_FLOW_TYPE_DISPLAY = {
    0: $.fn.gettext('Payment to supplier'),
    1: $.fn.gettext('Payment to customer'),
    2: $.fn.gettext('Advance payment to employee'),
    4: $.fn.gettext('Payment on account'),
}

const PURCHASE_REQUEST_PURPOSE = {
    'FIXED_ASSET': 2
}

const ASSET_EVENTS = {
    SOURCE_TYPE_SELECTED: 'source_type:selected',

    INVENTORY_PRODUCT_CONFIRMED: 'inventory_product:confirmed',
    AP_INVOICE_ITEM_CONFIRMED: 'ap_invoice_item:confirmed',
    AP_INVOICE_ITEM_CLEARED: 'ap_invoice_item:cleared',

    DEPR_START_DATE_CHANGED: 'depr_start-date:changed',

    CASH_OUT_CONFIRMED: 'cash_out:confirmed',
    CASH_OUT_CLEARED: 'cash_out:cleared',
}

class EventBus {
    constructor() {
        this.events = {}
    }

    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }
        this.events[eventName].push(callback)

        // Return unsubscribe function
        return () => {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
        }
    }

    publish(eventName, data) {
        if (!this.events[eventName]) return
        this.events[eventName].forEach(callback => callback(data))
    }

    clear(eventName) {
        if (eventName) {
            delete this.events[eventName]
        } else {
            this.events = {}
        }
    }
}

// Global EventBus instance
const assetEventBus = new EventBus()

class AssetStepperHandler {
    constructor(eventBus) {
        this.eventBus = eventBus

        this.$sourceTypeSelectCard = $('#source-type-select-card')
        this.$assetDetailCard = $('#asset-detail-card')
        this.$btnSelectSource = $('#btn-select-source')
        this.$btnBackPreviousStep = $('#btn-back-previous-step')

        this.$btnSave = $('button[form="form-fixed-asset"]')
        this.sourceType = null
    }

    init(){
        this.showSelectSourceTypeContent()
        this.handleEventListeners()
    }

    handleEventListeners(){
        this.$btnSelectSource.on('click', () => this.handleSelectSource())

        this.$btnBackPreviousStep.on('click', () => this.goToStepSelectSource())

        this.$sourceTypeSelectCard.on('change', 'input[name="source_type"]', (e)=>{
            const val = Number($(e.currentTarget).val())
            this.sourceType = val
            this.eventBus.publish(ASSET_EVENTS.SOURCE_TYPE_SELECTED, val)
        })
    }

    setSourceType(sourceType){
        this.sourceType = sourceType
    }

    handleSelectSource() {
        if (!this.validateSourceSelection()) return

        this.goToStepAssetDetail()
    }

    validateSourceSelection() {
        if (this.sourceType === null) {
            alert('Please select a source type before proceeding.')
            return false
        }
        return true
    }

    setStep(stepNumber) {
        const $step1 = $('#step1');
        const $step2 = $('#step2');

        if (!$step1.length || !$step2.length) return;

        const $step1Circle = $('#step1-circle');
        const $step1Text = $('#step1-text');
        const $step2Circle = $('#step2-circle');
        const $step2Text = $('#step2-text');
        const $progressLine = $('#progress-line');

        // Remove all classes first
        $step1Circle.removeClass('step-circle-active step-circle-completed step-circle-inactive');
        $step1Text.removeClass('step-text-active step-text-completed step-text-inactive');
        $step2Circle.removeClass('step-circle-active step-circle-completed step-circle-inactive');
        $step2Text.removeClass('step-text-active step-text-completed step-text-inactive');
        $progressLine.removeClass('progress-line-active');

        if (stepNumber === 1) {
            // Step 1 Active
            $step1Circle.addClass('step-circle-active').text('1');
            $step1Text.addClass('step-text-active');

            // Step 2 Inactive
            $step2Circle.addClass('step-circle-inactive').text('2');
            $step2Text.addClass('step-text-inactive');

            this.$btnSelectSource.show()
            this.$btnBackPreviousStep.hide()
            this.$btnSave.hide()

        } else if (stepNumber === 2) {
            // Step 1 Completed
            $step1Circle.addClass('step-circle-completed').html('<i class="bi bi-check"></i>');
            $step1Text.addClass('step-text-completed');

            // Step 2 Active
            $step2Circle.addClass('step-circle-active').text('2');
            $step2Text.addClass('step-text-active');

            // Update progress line
            $progressLine.addClass('progress-line-active');

            this.$btnSelectSource.hide()
            this.$btnBackPreviousStep.show()
            this.$btnSave.show()
        }
    }

    goToStepAssetDetail() {
        this.setStep(2)
        this.showAssetDetailContent()
        this.setSourceTypeName()
    }

    goToStepSelectSource() {
        this.setStep(1)
        this.showSelectSourceTypeContent()
    }

    showAssetDetailContent() {
        this.$sourceTypeSelectCard.hide()
        this.$assetDetailCard.show()

        this.showSourceDocumentContent()
    }

    showSelectSourceTypeContent() {
        this.$sourceTypeSelectCard.show()
        this.$assetDetailCard.hide()

        this.$btnSelectSource.show()
        this.$btnBackPreviousStep.hide()
        this.$btnSave.hide()
    }

    showSourceDocumentContent() {
        const content = $('#source-document-content')
        content.empty()
        let html = ``
        switch(this.sourceType) {
            case 0:
                html = SearchInventoryHandler.getInventoryTransferHTML()
                content.append(html)
                break;
            case 1:
                html = PurchaseAssetHandler.getPurchaseAssetHTML()
                content.append(html)
                break;
        }
    }

    setSourceTypeName() {
        const name = SOURCE_TYPE_MAP[this.sourceType]
        $('#selected-source-type-name').text(name)
    }
}

class SearchInventoryHandler {
    constructor(eventBus) {
        this.eventBus = eventBus

        this.$modal = $('#modal-search-inventory')
        this.$productListTable = $('#table-product-list')
        this.$warehouseListTable = $('#table-warehouse-list')
        this.$serialItemListTable = $('#table-serial-item')
        this.$lotItemListTable = $('#table-lot-item')

        this.btnOpenModalSelector = '#btn-open-search-inventory'
        this.productContentSelector = '#product-content'
        this.warehouseContentSelector = '#warehouse-and-item-content'
        this.stockPlaceholderSelector = '#stock-placeholder'
        this.lotSectionSelector = '#lot-selection-section'
        this.quantitySectionSelector = '#quantity-input-section'
        this.serialSectionSelector = '#serial-number-section'
        this.btnBackSelector = '#btn-back-inventory-product'
        this.btnConfirmSelector = '#btn-confirm-inventory-product'
        this.btnNextSelector = '#btn-next-inventory-product'
        this.selectedInventoryItemContent = '#selected-inventory-item'
        this.stockAvailableQtySelector = '#stock-available-quantity'
        this.stockUnitCostSelector= '#stock-unit-cost'

        this.productListDtb = null
        this.warehouseListDtb = null
        this.serialItemListDtb = null
        this.lotItemListDtb = null

        this.selectedProductId = null
        this.selectedProductData = null

        this.selectedWarehouseId = null
        this.selectedWarehouseData = null

        this.trackingMethod = null
    }

    init(){
        this.handleEventListeners()
    }

    handleEventListeners(){
        $(document).on('click', `${this.btnOpenModalSelector}`, (event) => {
            this.resetModal()
            this.initSearchInventoryModalTable()
            this.$modal.modal('show')
        })

        this.$productListTable.on('change', 'input[name="select-product"]',  (e) =>{
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const productId = $ele.attr('data-product-id')
            const trackingMethod = Number($ele.attr('data-tracking-method')) || 0
            const productData = this.productListDtb.row($row).data()
            this.selectedProductId = productId
            this.trackingMethod = trackingMethod
            this.selectedProductData = {...productData}
        })

        this.$modal.on('click', `${this.btnNextSelector}`, () => {
            $(`${this.productContentSelector}`).hide()
            $(`${this.warehouseContentSelector}`).show()

            $(`${this.btnBackSelector}`).show()
            $(`${this.btnConfirmSelector}`).show()
            $(`${this.btnNextSelector}`).hide()

            this.initWarehouseListModalTable()
        })

        this.$modal.on('click', `${this.btnBackSelector}`, () => {
            this.resetModal()
            this.initSearchInventoryModalTable()
        })

        this.$warehouseListTable.on('change', 'input[name="select-warehouse"]',  (e) =>{
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const warehouseData = this.warehouseListDtb.row($row).data()
            this.selectedWarehouseId = $ele.attr('data-warehouse-id')
            this.selectedWarehouseData = {...warehouseData}
            this.loadStockItems()
        })

        this.$modal.on('click', `${this.btnConfirmSelector}`, () => {
            const trackingMethod = this.trackingMethod
            let selectedInventoryProductData = null
            let rowData = null
            let productData =this.selectedProductData
            let warehouseData = this.selectedWarehouseData

            switch (trackingMethod){
                case 0:
                    selectedInventoryProductData = {
                        product_data: {
                            id: productData.id,
                            title: productData.title,
                            code: productData.code,
                            asset_category: productData.asset_category,
                        },
                        warehouse: {
                            id: warehouseData.warehouse?.id,
                            title: warehouseData.warehouse?.title,
                            code: warehouseData.warehouse?.code,
                        },
                        tracking_method: trackingMethod,
                        tracking_number: null,
                        total_register_value: Number($(`${this.stockUnitCostSelector}`).attr('data-init-money')) || 0,
                        product_warehouse_id: null,
                    }
                    break;
                case 1:
                    const selectedLotRow = this.$lotItemListTable.find('input[name="select-lot"]:checked')?.closest('tr')
                    rowData = this.lotItemListDtb.row(selectedLotRow).data()
                    selectedInventoryProductData = {
                        product_data: {
                            id: productData.id,
                            title: productData.title,
                            code: productData.code,
                            asset_category: productData.asset_category,
                        },
                        warehouse: {
                            id: warehouseData.warehouse?.id,
                            title: warehouseData.warehouse?.title,
                            code: warehouseData.warehouse?.code,
                        },
                        tracking_method: trackingMethod,
                        tracking_number: rowData.lot_number,
                        total_register_value: rowData.unit_cost,
                        product_warehouse_id: rowData.id,
                    }
                    break;
                case 2:
                    const selectedSerialRow = this.$serialItemListTable.find('input[name="select-serial"]:checked')?.closest('tr')
                    rowData = this.serialItemListDtb.row(selectedSerialRow).data()
                    selectedInventoryProductData = {
                        product_data: {
                            id: productData.id,
                            title: productData.title,
                            code: productData.code,
                            asset_category: productData.asset_category,
                        },
                        warehouse: {
                            id: warehouseData.warehouse?.id,
                            title: warehouseData.warehouse?.title,
                            code: warehouseData.warehouse?.code,
                        },
                        tracking_method: trackingMethod,
                        tracking_number: rowData.serial_number,
                        total_register_value: rowData.unit_cost,
                        product_warehouse_id: rowData.id,
                    }
                    break;
            }

            if(selectedInventoryProductData){
                let html = this.getSelectedInventoryProductDataHtml(selectedInventoryProductData)
                this.loadSelectedInventoryProductData(html)

                this.eventBus.publish(ASSET_EVENTS.INVENTORY_PRODUCT_CONFIRMED, selectedInventoryProductData)
            }
            $.fn.initMaskMoney2()
            this.$modal.modal('hide')
        })
    }

    resetModal(){
        this.selectedWarehouseId = null
        this.selectedProductId = null
        this.trackingMethod = null

        this.resetContent()
        this.resetBtn()
    }

    resetContent(){
        $(this.productContentSelector).show()
        $(this.warehouseContentSelector).hide()
        $(this.stockPlaceholderSelector).show()

        $(this.lotSectionSelector).hide()
        $(this.quantitySectionSelector).hide()
        $(this.serialSectionSelector).hide()
    }

    resetBtn(){
        $(`${this.btnBackSelector}`).hide()
        $(`${this.btnConfirmSelector}`).hide()
        $(`${this.btnNextSelector}`).show()
    }

    initSearchInventoryModalTable() {
        const $table = this.$productListTable
        if (this.productListDtb){
            this.productListDtb.ajax.reload()
        }
        else {
            this.productListDtb = this.$productListTable.DataTableDefault({
                useDataServer: true,
                loading: true,
                ajax: {
                    url: $table.attr('data-url'),
                    type: $table.attr('data-method'),
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('product_list')) {
                            return resp.data['product_list'] ? resp.data['product_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                pageLength: 10,
                columns: [
                    {
                        render: (data, type, row) => {
                            return `<div class="form-check">
                                        <input
                                            type="radio"
                                            class="form-check-input"
                                            id="select-product-${row?.['id']}"
                                            name="select-product"
                                            data-product-id="${row?.['id'] || ''}"
                                            data-tracking-method="${row?.general_traceability_method}"
                                        />
                                    </div>`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `<label class="form-check-label mr-2" for="select-product-${row?.['id']}">
                                        <span class="badge badge-soft-secondary mr-1">${row?.['code'] || ''}</span>
                                    </label>`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `${row.title}`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `${row?.general_product_category?.title}`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `${TRACKING_METHOD_DISPLAY[row.general_traceability_method]}`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `${row.stock_amount}`
                        }
                    },
                ],
            })
        }
    }

    initWarehouseListModalTable(){
        const $table = this.$warehouseListTable
        const selectedProductId = this.selectedProductId

        if (this.warehouseListDtb){

            this.warehouseListDtb.settings()[0].ajax.data = {
                'product_id': selectedProductId,
            }
            this.warehouseListDtb.ajax.reload()
        } else {
            this.warehouseListDtb = this.$warehouseListTable.DataTableDefault({
                useDataServer: true,
                loading: true,
                ajax: {
                    url: $table.attr('data-url'),
                    type: $table.attr('data-method'),
                    data: {
                        'product_id': selectedProductId,
                    },
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('product_warehouse_list')) {
                            console.log(resp.data['product_warehouse_list'])
                            return resp.data['product_warehouse_list'] ? resp.data['product_warehouse_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                pageLength: 10,
                columns: [
                    {
                        render: (data, type, row) => {
                            return `<div class="form-check">
                                        <input type="radio" class="form-check-input" id="select-warehouse-${row?.['id']}" name="select-warehouse" data-warehouse-id="${row?.['warehouse']?.['id'] || ''}"/>
                                    </div>`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `<label class="form-check-label mr-2" for="select-warehouse-${row?.['id']}">
                                        <span class="badge badge-soft-secondary mr-1">${row?.['warehouse']?.['code'] || ''}</span>
                                    </label>`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `${row?.warehouse?.title}`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `${row?.stock_amount}`
                        }
                    },
                ],
            })
        }
    }

    initSerialItemModalTable(){
        const $table = this.$serialItemListTable
        const selectedProductId = this.selectedProductId
        const selectedWarehouseId = this.selectedWarehouseId

        if (this.serialItemListDtb){
             this.serialItemListDtb.settings()[0].ajax.data = {
                'product_id': selectedProductId,
                'warehouse_id': selectedWarehouseId
            }
            this.serialItemListDtb.ajax.reload()
        } else {
            this.serialItemListDtb = $table.DataTableDefault({
                useDataServer: true,
                loading: true,
                ajax: {
                    url: $table.attr('data-url'),
                    type: $table.attr('data-method'),
                    data: {
                        'product_id': selectedProductId,
                        'warehouse_id': selectedWarehouseId
                    },
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('product_warehouse_list') && resp.data['product_warehouse_list'].length > 0) {
                            return resp.data['product_warehouse_list']?.[0]?.['serial_items_data'] ? resp.data['product_warehouse_list']?.[0]?.['serial_items_data'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                pageLength: 10,
                reloadCurrency: true,
                columns: [
                    {
                        render: (data, type, row) => {
                            return `<div class="form-check">
                                        <input
                                            type="radio"
                                            class="form-check-input"
                                            id="select-serial-${row?.['id']}"
                                            name="select-serial"
                                            data-serial-id="${row?.['id'] || ''}"
                                        />
                                    </div>`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `<label class="form-check-label mr-2" for="select-serial-${row?.['id']}">
                                        <span class="badge badge-soft-secondary mr-1">${row?.['serial_number'] || ''}</span>
                                    </label>`
                        }
                    },
                    {
                        render: (data, type, row) => {
                            const date = $x.fn.displayRelativeTime(row.manufacture_date, {'outputFormat': 'DD/MM/YYYY'})
                            return `${date}`
                        }
                    },
                    {
                        className: 'text-end',
                        render: (data, type, row) => {
                            console.log(row?.['unit_cost'])
                            return `<span class="mask-money" data-init-money="${row?.['unit_cost'] || 0}"></span>`
                        }
                    },
                ],
            })
        }
    }

    initLotItemModalTable(){
        const $table = this.$lotItemListTable
        const selectedProductId = this.selectedProductId
        const selectedWarehouseId = this.selectedWarehouseId

        if (this.lotItemListDtb){
             this.lotItemListDtb.settings()[0].ajax.data = {
                'product_id': selectedProductId,
                'warehouse_id': selectedWarehouseId
            }
            this.lotItemListDtb.ajax.reload()
        } else {
            this.lotItemListDtb = $table.DataTableDefault({
                useDataServer: true,
                loading: true,
                ajax: {
                    url: $table.attr('data-url'),
                    type: $table.attr('data-method'),
                    data: {
                        'product_id': selectedProductId,
                        'warehouse_id': selectedWarehouseId
                    },
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('product_warehouse_list') && resp.data['product_warehouse_list'].length > 0) {
                            return resp.data['product_warehouse_list']?.[0]?.['lot_items_data'] ? resp.data['product_warehouse_list']?.[0]?.['lot_items_data'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                pageLength: 10,
                reloadCurrency: true,
                columns: [
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<div class="form-check">
                                        <input
                                            type="radio"
                                            class="form-check-input"
                                            id="select-lot-${row?.['id']}"
                                            name="select-lot"
                                            data-lot-id="${row?.['id'] || ''}"
                                        />
                                    </div>`
                        }
                    },
                    {
                        className: 'w-20',
                        render: (data, type, row) => {
                            return `<label class="form-check-label mr-2" for="select-lot-${row?.['id']}">
                                        <span class="badge badge-soft-secondary mr-1">${row?.['lot_number'] || ''}</span>
                                    </label>`
                        }
                    },
                    {
                        className: 'w-20',
                        render: (data, type, row) => {
                            const date = $x.fn.displayRelativeTime(row.manufacture_date, {'outputFormat': 'DD/MM/YYYY'});
                            return `${date}`
                        }
                    },
                    {
                        className: 'w-20 text-center',
                        render: (data, type, row) => {
                            const qty = row.quantity_import
                            return `${qty}`
                        }
                    },
                    {
                        className: 'text-end w-30',
                        render: (data, type, row) => {
                            console.log(row?.['unit_cost'])
                            return `<span class="mask-money" data-init-money="${row?.['unit_cost'] || 0}"></span>`
                        }
                    },
                ],
            })
        }
    }

    loadQuantityInputData(){
        const $qty = $(`${this.stockAvailableQtySelector}`)
        const $unitCost = $(`${this.stockUnitCostSelector}`)

        const quantity = this.selectedWarehouseData?.stock_amount
        const unitCost = this.selectedWarehouseData?.product_unit_cost

        $qty.text(quantity)
        $unitCost.attr('data-init-money', unitCost)
        $.fn.initMaskMoney2()
    }

    loadStockItems(){
        $(`${this.stockPlaceholderSelector}`).hide()

        const trackingMethod = this.trackingMethod

        if (trackingMethod === TRACKING_METHOD.NONE) {
            $(`${this.quantitySectionSelector}`).show()
            this.loadQuantityInputData()
        }
        else if (trackingMethod === TRACKING_METHOD.LOT) {
            $(`${this.lotSectionSelector}`).show()

            this.initLotItemModalTable()
        }
        else if (trackingMethod === TRACKING_METHOD.SERIAL) {
            $(`${this.serialSectionSelector}`).show()

            this.initSerialItemModalTable()
        }
    }

    static getInventoryTransferHTML(){
        return `
            <h6 class="fw-semibold mb-3 text-lg">${$.fn.gettext('Select Inventory Item to Transfer')}</h6>
            <button type="button" class="btn btn-success btn-lg" id='btn-open-search-inventory'>
                <i class="bi bi-search me-1"></i>
                ${$.fn.gettext('Search Inventory')}
            </button>
            <div id='selected-inventory-item' class="mt-3"></div>
        `
    }

    getSelectedInventoryProductDataHtml(data){
        const productCode = data.product_data?.code
        const productTitle = data.product_data?.title
        const warehouseCode = data?.warehouse?.code
        const warehouseTitle = data?.warehouse?.title
        const transferValue = data.total_register_value
        const trackingMethod = data?.tracking_method
        const trackingNumber = data?.tracking_number || '__'
        return `
            <div class="card card-border mt-3 border-success">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-semibold text-success mb-0">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            ${$.fn.gettext('Selected Inventory Transfer')}
                        </h6>
                    </div>
                    <div class="row">
                        <div class="col-md-8">
                            <table class="table table-sm table-borderless mb-0">
                                <tr>
                                    <td class="text-muted" style="width: 150px;">${$.fn.gettext('Product')}:</td>
                                    <td class="fw-semibold">${productCode} - ${productTitle}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">Warehouse:</td>
                                    <td class="fw-semibold">${warehouseCode} - ${warehouseTitle}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">${$.fn.gettext('Tracking Method')}:</td>
                                    <td class="fw-semibold">${TRACKING_METHOD_DISPLAY[trackingMethod]}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">${$.fn.gettext('Tracking Number')}:</td>
                                    <td class="fw-semibold">${trackingNumber}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="bg-success bg-opacity-10 p-3 rounded border border-success">
                                <small class="text-muted d-block mb-1">Total Transfer Value</small>
                                <h4 class="text-success mb-0"><span data-init-money="${transferValue}" class="mask-money"></span></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    loadSelectedInventoryProductData(dataHtml){
        const $inventoryItemContent = $(this.selectedInventoryItemContent)
        $inventoryItemContent.empty()
        $inventoryItemContent.append(dataHtml)
    }
}

class PurchaseAssetHandler {
    constructor(eventBus) {
        this.eventBus = eventBus

        this.$modalApInvoice = $('#modal-search-ap-invoice')
        this.$apInvoiceListTable = $('#table-ap-invoice-list')

        this.btnOpenAPModalSelector = '#btn-open-ap-invoice'

        this.apInvoiceContent = '#ap-invoice-content'
        this.apInvoiceDetailContent = '#ap-invoice-detail-content'

        this.apInvoiceItemList = '#ap-invoice-item-list'

        this.btnBackInvoiceSelector = '#btn-back-ap-invoice'
        this.btnConfirmInvoiceSelector = '#btn-confirm-ap-invoice'
        this.btnNextInvoiceSelector = '#btn-next-ap-invoice'

        this.invoiceTotalSummarySelector = '#ap-invoice-total-summary'

        this.selectedApInvoiceItemSelector = '#selected-ap-invoice-item'

        this.invoiceItemRowClass = '.ap-item-row'
        this.invoiceItemQuantityClass = '.invoice-item-quantity-select'
        this.invoiceItemAmountClass = '.invoice-item-amount'

        this.btnClearInvoiceSelector = '.btn-clear-ap-invoice'

        this.apInvoiceListDtb = null

        this.selectedInvoiceData = null

        this.$modalCashout = $('#modal-search-cash-out')
        this.$cashOutListTable = $('#table-cash-out-list')

        this.btnOpenCashoutModalSelector = '#btn-open-cash-out'
        this.btnConfirmCashOutSelector = '#btn-confirm-cash-out'
        this.btnClearCashOutSelector = '.btn-clear-cash-out'
        this.selectedCashOutItemSelector = '#selected-cash-out-item'
        this.cashOutListDtb = null
        this.selectedCashOutData = null
    }

    init(){
        this.handleEventListeners()
    }

    handleEventListeners(){
        $(document).on('click', `${this.btnOpenAPModalSelector}`, (event) => {
            this.resetInvoiceModal()
            this.initInvoiceModalTable()
            this.$modalApInvoice.modal('show')
        })

        this.$modalApInvoice.on('click', `${this.btnBackInvoiceSelector}`, () => {
            this.resetInvoiceModal()
            this.initInvoiceModalTable()
        })

        this.$apInvoiceListTable.on('change', 'input[name="select-ap-invoice"]',  (e) =>{
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const data = this.apInvoiceListDtb.row($row).data()
            this.selectedInvoiceData = {...data}
        })

        this.$modalApInvoice.on('click', `${this.btnNextInvoiceSelector}`, () => {
            $(`${this.apInvoiceContent}`).hide()
            $(`${this.apInvoiceDetailContent}`).show()

            $(`${this.btnBackInvoiceSelector}`).show()
            $(`${this.btnConfirmInvoiceSelector}`).show()
            $(`${this.btnNextInvoiceSelector}`).hide()

            const itemData = this.selectedInvoiceData?.['item_mapped']
            let html = this.getInvoiceDetailItemHtml(itemData)
            this.loadInvoiceDetailItem(html)
            $.fn.initMaskMoney2()
        })

        this.$modalApInvoice.on('click', `${this.btnConfirmInvoiceSelector}`, () => {
            const apInvoiceData = this.selectedInvoiceData
            const apInvoiceId = apInvoiceData?.id
            const apInvoiceCode = apInvoiceData?.code
            const apInvoiceTitle = apInvoiceData?.title
            const originalItems = apInvoiceData?.['item_mapped'] || []

            // Collect selected items
            let itemData = []
            $(`${this.invoiceItemQuantityClass}`).each((index, el) => {
                const $input = $(el)
                const selectedQty = parseFloat($input.val()) || 0

                if (selectedQty > 0) {
                    const itemId = $input.data('item-id')
                    const unitPrice = parseFloat($input.data('unit-price')) || 0
                    const amount = selectedQty * unitPrice

                    // Find original item data
                    const originalItem = originalItems.find(item => item.id === itemId)
                    const productData = originalItem?.product_data || {}

                    itemData.push({
                        ap_item_id: itemId,
                        product_code: productData?.code || '',
                        product_title: productData?.title || originalItem?.ap_product_des || '',
                        quantity: selectedQty,
                        unit_price: unitPrice,
                        amount: amount,
                        asset_category: productData?.asset_category || null
                    })
                }
            })
            let totalAmount = Number($(`${this.invoiceTotalSummarySelector}`).attr('data-init-money')) || 0
            let detailData = {
                id: apInvoiceId,
                code: apInvoiceCode,
                title: apInvoiceTitle,
                selected_items: itemData,
                total_register_value: totalAmount
            }
            let html = this.getSelectedInvoiceDetailHTML(detailData)
            this.loadSelectedInvoiceDetail(html)
            $.fn.initMaskMoney2()

            this.eventBus.publish(ASSET_EVENTS.AP_INVOICE_ITEM_CONFIRMED, detailData)
            this.$modalApInvoice.modal('hide')
        })

        this.$modalApInvoice.on('change', `${this.invoiceItemQuantityClass}`, (e) => {
            const $input = $(e.currentTarget)
            this.handleQuantityChange($input)
            this.updateInvoiceTotalSummary()
            $.fn.initMaskMoney2()
        })

        $(document).on('click', `${this.btnClearInvoiceSelector}`, (e) => {
            const $btn = $(e.currentTarget)
            const invoiceId = $btn.data('invoice-id')
            this.clearSelectedInvoice(invoiceId)
        })

        $(document).on('click', `${this.btnOpenCashoutModalSelector}`, () => {
            this.resetCashOutModal()
            this.initCashOutModalTable()
            this.$modalCashout.modal('show')
        })

        this.$cashOutListTable.on('change', 'input[name="select-cash-out"]',  (e) =>{
            const $ele = $(e.currentTarget)
            const $row = $ele.closest('tr')
            const data = this.cashOutListDtb.row($row).data()
            this.selectedCashOutData = {...data}
        })

        this.$modalCashout.on('click', `${this.btnConfirmCashOutSelector}`, () => {
            const cashOutData = this.selectedCashOutData
            if(!cashOutData) {
                return
            }
            const detailData = {
                id: cashOutData.id,
                code: cashOutData.code,
                title: cashOutData.title,
                cof_type: cashOutData.cof_type,
                cof_type_display: CASH_OUT_FLOW_TYPE_DISPLAY[cashOutData?.cof_type],
                date_created: cashOutData.date_created,
                total_register_value: cashOutData.total_value || 0
            }

            let html = this.getSelectedCashOutHTML(detailData)
            this.loadSelectedCashOut(html)
            $.fn.initMaskMoney2()

            this.eventBus.publish(ASSET_EVENTS.CASH_OUT_CONFIRMED, detailData)
            this.$modalCashout.modal('hide')
        })

        $(document).on('click', `${this.btnClearCashOutSelector}`, (e) => {
            const $btn = $(e.currentTarget)
            const cashOutId = $btn.data('cash-out-id')
            this.clearSelectedCashOut(cashOutId)
        })
    }
    handleQuantityChange($input) {
        const unitPrice = parseFloat($input.data('unit-price')) || 0
        const maxQty = parseFloat($input.data('max-quantity')) || 0
        let selectedQty = parseFloat($input.val()) || 0

        // Validate against maximum available quantity
        if (selectedQty > maxQty) {
            selectedQty = maxQty
            $input.val(maxQty)
            $.fn.notifyB({description: `${$.fn.gettext('Maximum available quantity is')} ${maxQty}`}, 'failure')
        }

        if (selectedQty < 0) {
            selectedQty = 0
            $input.val(0)
            $.fn.notifyB({description: $.fn.gettext('Quantity cannot be negative')}, 'failure')
        }

        // Calculate and update item amount
        const amount = selectedQty * unitPrice
        const $amountEl = $input.closest('.ap-item-row').find(this.invoiceItemAmountClass)
        $amountEl.attr('data-init-money', amount)
    }


    resetCashOutModal() {
        this.selectedCashOutData = null
        if (this.cashOutListDtb) {
            this.$cashOutListTable.find('input[name="select-cash-out"]').prop('checked', false)
        }
    }
    resetInvoiceModal(){
        this.resetInvoiceContent()
        this.resetInvoiceBtn()
    }
    resetInvoiceContent(){
        $(`${this.apInvoiceContent}`).show()
        $(`${this.apInvoiceDetailContent}`).hide()

        $(`${this.apInvoiceItemList}`).empty()
        $(`${this.invoiceTotalSummarySelector}`).attr('data-init-money', 0)
    }
    resetInvoiceBtn(){
        $(`${this.btnBackInvoiceSelector}`).hide()
        $(`${this.btnConfirmInvoiceSelector}`).hide()
        $(`${this.btnNextInvoiceSelector}`).show()
    }

    initCashOutModalTable(){
        const $table = this.$cashOutListTable

        if (this.cashOutListDtb) {
            this.cashOutListDtb.ajax.reload()
        } else {
            this.cashOutListDtb = $table.DataTableDefault({
                useDataServer: true,
                loading: true,
                ajax: {
                    url: $table.attr('data-url'),
                    type: $table.attr('data-method'),
                    data: {
                        'purpose': PURCHASE_REQUEST_PURPOSE.FIXED_ASSET,
                        'asset_purchase_items__isnull': true
                    },
                    dataSrc: (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['cash_outflow_list'] || [];
                        }
                        return [];
                    },
                },
                pageLength: 10,
                reloadCurrency: true,
                columns: [
                    {
                        className: 'w-5',
                        render: (data, type, row) => `
                            <div class="form-check">
                                <input type="radio" class="form-check-input"
                                    id="select-cash-out-${row?.id}"
                                    name="select-cash-out"
                                    data-cash-out-id="${row?.id || ''}"/>
                            </div>`
                    },
                    {
                        className: 'w-25',
                        render: (data, type, row) => `
                            <label class="form-check-label mr-2" for="select-cash-out-${row?.id}">
                                <span class="badge badge-sm badge-soft-secondary mr-1">${row?.code || ''}</span>
                                <span>${row?.title || ''}</span>
                            </label>`
                    },
                    {
                        className: 'w-30',
                        render: (data, type, row) => `<span>${CASH_OUT_FLOW_TYPE_DISPLAY[row?.cof_type]}</span>`
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) =>
                            $x.fn.displayRelativeTime(row?.date_created, { outputFormat: 'DD/MM/YYYY' })
                    },
                    {
                        className: 'text-end w-20',
                        render: (data, type, row) => {
                            const amount = row?.total_value || 0
                            return `<span class="mask-money" data-init-money="${amount}"></span>`
                        }
                    },
                ],
            })
        }
    }
    initInvoiceModalTable(){
        const $table = this.$apInvoiceListTable

        if (this.apInvoiceListDtb){
            this.apInvoiceListDtb.ajax.reload()
        } else {
            this.apInvoiceListDtb = $table.DataTableDefault({
                useDataServer: true,
                loading: true,
                ajax: {
                    url: $table.attr('data-url'),
                    type: $table.attr('data-method'),
                    data: {
                        'purchase_order_mapped__purchase_requests__request_for': PURCHASE_REQUEST_PURPOSE.FIXED_ASSET
                    },
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['ap_invoice_list'] ? resp.data['ap_invoice_list'] : [];
                        }
                        return [];
                    },
                },
                pageLength: 10,
                reloadCurrency: true,
                columns: [
                    {
                        className: 'w-5',
                        render: (data, type, row) => {
                            return `<div class="form-check">
                                        <input
                                            type="radio"
                                            class="form-check-input"
                                            id="select-ap-invoice-${row?.['id']}"
                                            name="select-ap-invoice"
                                            data-ap-invoice-id="${row?.['id'] || ''}"
                                        />
                                    </div>`
                        }
                    },
                    {
                        className: 'w-25',
                        render: (data, type, row) => {
                            return `<label class="form-check-label mr-2" for="select-ap-invoice-${row?.['id']}">
                                        <span class="badge badge-sm badge-soft-secondary mr-1">${row?.['code'] || ''}</span>
                                        <span>${row?.['title'] || ''}</span>
                                    </label>`
                        }
                    },
                    {
                        className: 'w-30',
                        render: (data, type, row) => {
                            const supplierTitle = row?.['supplier_mapped_data']?.['name'] || ''
                            return `${supplierTitle}`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            const invoiceDate =  $x.fn.displayRelativeTime(row?.['invoice_date'], {'outputFormat': 'DD/MM/YYYY'})
                            return `${invoiceDate}`
                        }
                    },
                    {
                        className: 'text-end w-20',
                        render: (data, type, row) => {
                            const totalAmount = row?.['sum_pretax_value']
                            return `<span class="mask-money" data-init-money="${totalAmount}"></span>`
                        }
                    },
                ],
            })
        }
    }

    updateInvoiceTotalSummary() {
        let totalAmount = 0

        $(`${this.invoiceItemQuantityClass}`).each((index, el) => {
            const $input = $(el)
            const unitPrice = parseFloat($input.data('unit-price')) || 0
            const selectedQty = parseFloat($input.val()) || 0
            totalAmount += selectedQty * unitPrice
        })

        const $totalSummary = $(`${this.invoiceTotalSummarySelector}`)
        $totalSummary.attr('data-init-money', totalAmount)
    }

    getInvoiceDetailItemHtml(data) {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return `<div class="text-center text-muted py-4">No items found</div>`
        }

        let html = ``

        data.forEach((item, index) => {
            const itemId = item?.id
            const productData = item?.product_data
            const productTitle = (productData && Object.keys(productData).length > 0)
                                    ? productData.title
                                    : item?.ap_product_des
            const productCode = productData.code || ''
            const quantity = item?.product_quantity || 0
            const unitPrice = item?.product_unit_price || 0
            const increased_quantity = item?.increased_asset_quantity || 0

            const maxAvailableQty = quantity - increased_quantity

            html += `
            <div class="card mb-3" style="border-top: 4px solid #0d6efd;" data-item-id="${itemId}">
                <div class="card-body">
                    <div class="row align-items-center ${this.invoiceItemRowClass.replace('.', '')}">
                        <!-- Left: Item Info -->
                        <div class="col-md-3">
                            <div class="fw-semibold mb-2 fs-5">${productTitle}</div>
                            <div class="row g-3">
                                <div class="col-auto">
                                    <span class="text-muted fs-6">Code:</span><br>
                                    <strong>${productCode}</strong>
                                </div>
                            </div>
                        </div>
                        <!-- Qty in Invoice (Read-only) -->
                        <div class="col-md-2">
                            <label class="form-label text-muted fw-semibold fs-6">${$.fn.gettext('Invoice Quantity')}</label>
                            <div class="fw-semibold">${quantity}</div>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label text-muted fw-semibold fs-6">${$.fn.gettext('Increased Quantity')}</label>
                            <div class="fw-semibold">${increased_quantity}</div>
                        </div>
                        <!-- Select Qty (Input) -->
                        <div class="col-md-2">
                            <label class="form-label text-muted fw-semibold fs-6">Select Qty:</label>
                            <input 
                                type="number" 
                                class="form-control ${this.invoiceItemQuantityClass.replace('.', '')}"
                                data-item-id="${itemId}"
                                data-unit-price="${unitPrice}"
                                data-max-quantity="${maxAvailableQty}"
                                min="0" 
                                max="${maxAvailableQty}" 
                                value="0"
                                ${maxAvailableQty === 0 ? 'disabled' : ''}
                            >
                            <small class="text-muted">Max: ${maxAvailableQty}</small>
                        </div>
                        <!-- Unit Price (Read-only) -->
                        <div class="col-md-3">
                            <label class="form-label text-muted fw-semibold fs-6">Unit Price:</label>
                            <div class="fw-semibold text-primary">
                                <span class="mask-money" data-init-money="${unitPrice}"></span>
                            </div>
                        </div>
                        <!-- Total Amount (Calculated) -->
                        <div class="col-md-2">
                            <label class="form-label text-muted fw-semibold fs-6">Amount:</label>
                            <div class="fw-semibold text-primary">
                                <span class="mask-money ${this.invoiceItemAmountClass.replace('.', '')}" data-init-money="0"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })

        return html
    }
    getSelectedInvoiceDetailHTML(data) {
        if (!data || data.selected_items.length === 0) {
            return ''
        }

        const itemRows = data.selected_items.map(item => `
            <tr>
                <td><span class="badge badge-soft-secondary">${item.product_code}</span> ${item.product_title}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-end"><span class="mask-money" data-init-money="${item.unit_price}"></span></td>
                <td class="text-end"><span class="mask-money" data-init-money="${item.amount}"></span></td>
            </tr>
        `).join('')

        return `
            <div class="card card-border mt-3 border-success">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-semibold text-success mb-0">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            ${$.fn.gettext('AP Invoice')}
                        </h6>
                        <button type="button" class="btn btn-sm btn-outline-danger ${this.btnClearInvoiceSelector.replace('.','')}" data-invoice-id="${data.id}">
                            <i class="bi bi-x-circle me-1"></i>
                            ${$.fn.gettext('Clear')}
                        </button>
                    </div>
                    <p class="mb-3">${data.title} <span class="badge badge-soft-secondary">${data.code}</span></p>
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th class="text-center">Qty</th>
                                <th class="text-end">Unit Price</th>
                                <th class="text-end">Amount</th>
                            </tr>
                        </thead>
                        <tbody>${itemRows}</tbody>
                        <tfoot>
                            <tr class="fw-bold">
                                <td colspan="3" class="text-end">Total:</td>
                                <td class="text-end text-success">
                                    <span class="mask-money" data-init-money="${data.total_register_value}"></span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `
    }
    getSelectedCashOutHTML(data) {
        const formattedDate = $x.fn.displayRelativeTime(data.cof_type, { outputFormat: 'DD/MM/YYYY' })
        return `
            <div class="card card-border mt-3 border-success">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="fw-semibold text-success mb-0">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            ${$.fn.gettext('Cash Out')}
                        </h6>
                        <button type="button" class="btn btn-sm btn-outline-danger btn-clear-cash-out" 
                            data-cash-out-id="${data.id}">
                            <i class="bi bi-x-circle me-1"></i>${$.fn.gettext('Clear')}
                        </button>
                    </div>
                    <div class="row">
                        <div class="col-md-8">
                            <table class="table table-sm table-borderless mb-0">
                                <tr>
                                    <td class="text-muted" style="width: 150px;">Code:</td>
                                    <td class="fw-semibold"><span class="badge badge-soft-secondary">${data.code}</span></td>
                                </tr>
                                <tr>
                                    <td class="text-muted">Title:</td>
                                    <td class="fw-semibold">${data.title || '-'}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">Type:</td>
                                    <td class="fw-semibold">${data?.cof_type_display || 0}</td>
                                </tr>
                                <tr>
                                    <td class="text-muted">Date:</td>
                                    <td class="fw-semibold">${formattedDate}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="bg-success bg-opacity-10 p-3 rounded border border-success">
                                <small class="text-muted d-block mb-1">Total Amount</small>
                                <h4 class="text-success mb-0">
                                    <span data-init-money="${data.total_register_value}" class="mask-money"></span>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    }

    loadInvoiceDetailItem(html){
        $(`${this.apInvoiceItemList}`).append(html)
    }
    loadSelectedInvoiceDetail(html){
        $(`${this.selectedApInvoiceItemSelector}`).append(html)
    }
    loadSelectedCashOut(html){
        $(`${this.selectedCashOutItemSelector}`).append(html)
    }

    clearSelectedCashOut(cashOutId) {
        $(`${this.selectedCashOutItemSelector}`).find(`[data-cash-out-id="${cashOutId}"]`).closest('.card').remove()
        this.selectedCashOutData = null

        this.eventBus.publish(ASSET_EVENTS.CASH_OUT_CLEARED, { cashOutId })
    }
    clearSelectedInvoice(invoiceId) {
        $(`${this.selectedApInvoiceItemSelector}`).find(`[data-invoice-id="${invoiceId}"]`).closest('.card').remove()

        // Reset state
        this.selectedInvoiceData = null

        // Publish event with the invoice id to remove
        this.eventBus.publish(ASSET_EVENTS.AP_INVOICE_ITEM_CLEARED, { invoiceId })
    }

    static getPurchaseAssetHTML(){
        return `
            <h6 class="fw-semibold mb-3">Purchase Document Selection</h6>
            <div class="warning-box">
                <strong>With PO?</strong> Select AP Invoice | <strong>Without PO?</strong> Select Cash Out
            </div>
            <div class="row g-3">
                <div class="col-md-6">
                    <button type="button" class="btn btn-outline-primary w-100" id="btn-open-ap-invoice">
                        <i class="bi bi-file-earmark-text me-1"></i>
                        Select AP Invoice (with PO)
                    </button>
                </div>
                <div class="col-md-6">
                    <button type="button" class="btn btn-outline-primary w-100" id="btn-open-cash-out">
                        <i class="bi bi-cash me-1"></i>
                        Select Cash Out (without PO)
                    </button>
                </div>
            </div>
            <div id='selected-ap-invoice-item' class="mt-3"></div>
            <div id='selected-cash-out-item' class="mt-3"></div>
        `
    }
}

class AssetHandler {
    constructor() {
        this.eventBus = assetEventBus

        this.$formSubmit = $('#form-fixed-asset')

        this.$sourceTypeSelectCard = $('#source-type-select-card')
        this.$assetDetailCard = $('#asset-detail-card')

        this.$assetName = $('#asset-name')
        this.$assetNumber = $('#asset-number')
        this.$assetCategorySelect = $('#asset-category')
        this.$depreciationMethodSelect = $('#depreciation-method')
        this.$depreciationTime = $('#depreciation-time')
        this.$depreciationStartDate = $('#depreciation-start-date')
        this.$depreciationEndDate = $('#depreciation-end-date')
        this.$depreciationTimeUnit = $('#depreciation-time-unit')
        this.$depreciationValue = $('#depreciation-value')
        this.$depreciationAdjustFactor = $('#adjustment-factor')
        this.$tableDepreciationPreview = $('#table-depreciation-preview')
        this.$modalPreviewDepreciation = $('#modal-depreciation-preview')

        this.$assetAccountSelect = $('#asset-account')
        this.$accumulatedDepreciationSelect = $('#accum-dep-account')
        this.$depreciationExpenseSelect = $('#dep-expense-account')

        this.$loadDepreciationBtn = $('#load-depreciation-btn')

        this.$originalCost = $('#original-cost')
        this.$accumulativeDepreciation = $('#accumulative-depreciation')
        this.$netBookValue = $('#net-book-value')

        this.$manageDepartment = $('#manage-department')
        this.$useDepartment = $('#use-department')

        // State
        this.sourceType = null
        this.inventoryProduct = null
        this.apInvoiceItems = []
        this.cashOutItems = []
        this.originalCostValue = 0

        this.assetStepHandler = new AssetStepperHandler(this.eventBus)
    }

    init(){
        this.assetStepHandler.init()
        this.loadAccountingAccount(this.$assetAccountSelect, null)
        this.loadAccountingAccount(this.$accumulatedDepreciationSelect, null)
        this.loadAccountingAccount(this.$depreciationExpenseSelect, null)
        this.subscribeToEvents()
        this.initDate()
        this.handleEventListeners()
        this.setUpSubmit(this.$formSubmit)
    }
    initDate(){
        UsualLoadPageFunction.LoadDate({element: this.$depreciationStartDate})
        UsualLoadPageFunction.LoadDate({element: this.$depreciationEndDate})
    }
    initHandlers(){
        const sourceType = this.sourceType
        switch (sourceType) {
            case 0:
                if (!this.searchInventoryHandler) {
                    this.searchInventoryHandler = new SearchInventoryHandler(this.eventBus)
                    this.searchInventoryHandler.init()
                }
                break
            case 1:
                if (!this.purchaseAssetHandler) {
                    this.purchaseAssetHandler = new PurchaseAssetHandler(this.eventBus)
                    this.purchaseAssetHandler.init()
                }
                break
        }
    }

    handleEventListeners(){
        this.$assetCategorySelect.on('change', (e) => {
            this.handleAssetCategoryChange()
        })

        this.$depreciationStartDate.on('apply.daterangepicker', (e) => {
            this.updateEndDate()
        })

        this.$depreciationTime.on('change', (e) => {
            this.updateEndDate()
        })

        this.$depreciationTimeUnit.on('change', (e) => {
            this.updateEndDate()
        })

        this.$depreciationMethodSelect.on('change', (e)=>{
            const val = $(e.currentTarget).val()
            if (val === '0') {
                this.$depreciationAdjustFactor.val(0).trigger('change')
                this.$depreciationAdjustFactor.attr('readonly', true)
            } else {
                this.$depreciationAdjustFactor.attr('readonly', false)
                this.$depreciationAdjustFactor.attr('disabled', false)
            }
        })

        this.$loadDepreciationBtn.on('click', (e) => {
            let isValid = Boolean(
                this.$depreciationValue.attr('value') &&
                this.$depreciationStartDate.val() &&
                this.$depreciationEndDate.val()
            )
            if (isValid){
                const data = this.loadDepreciationData()
                this.loadDepreciationPreviewData(data)
            }
        })
    }
    subscribeToEvents(){
        this.eventBus.subscribe(ASSET_EVENTS.INVENTORY_PRODUCT_CONFIRMED, (data) => {
            this.handleInventoryProductConfirmed(data)
        })

        this.eventBus.subscribe(ASSET_EVENTS.SOURCE_TYPE_SELECTED, (data) => {
            this.setSourceType(data)
        })

        this.eventBus.subscribe(ASSET_EVENTS.AP_INVOICE_ITEM_CONFIRMED, (data) => {
            this.handleAPInvoiceItemConfirmed(data)
        })

        this.eventBus.subscribe(ASSET_EVENTS.AP_INVOICE_ITEM_CLEARED, (data) => {
            this.handleAPInvoiceItemCleared(data.invoiceId)
        })

        this.eventBus.subscribe(ASSET_EVENTS.CASH_OUT_CONFIRMED, (data) => {
            this.handleCashOutConfirmed(data)
        })

        this.eventBus.subscribe(ASSET_EVENTS.CASH_OUT_CLEARED, (data) => {
            this.handleCashOutCleared(data.cashOutId)
        })
    }

    setSourceType(data){
        this.sourceType = data

        this.initHandlers()
    }

    handleInventoryProductConfirmed(data) {
        this.inventoryProduct = data
        this.loadCostSummaryData(data)
        const assetName = data.product_data?.title
        const assetNumber = data.tracking_number
        const assetCategoryData = data.product_data?.asset_category?.length ? {
            id: data.product_data?.asset_category?.id,
            title: data.product_data?.asset_category?.title,
            code: data.product_data?.asset_category?.code,
        } : null

        this.$assetName.val(assetName)
        this.$assetNumber.val(assetNumber)
        this.$assetCategorySelect.initSelect2({
            data: assetCategoryData
        })
        if(assetCategoryData){
            this.loadCategoryRelatedFields(assetCategoryData)
        }
    }

    handleAPInvoiceItemConfirmed(data){
        this.apInvoiceItems.push(data)

        this.loadCostSummaryData({
            total_register_value: this.originalCostValue + data.total_register_value,
            quantity: 1,
        })
    }
    handleAPInvoiceItemCleared(invoiceId) {
        const invoiceToRemove = this.apInvoiceItems.find(item => item.id === invoiceId)

        if (invoiceToRemove) {
            // Update original cost
            const clearedAmount = invoiceToRemove.total_register_value || 0
            this.originalCostValue = Math.max(0, this.originalCostValue - clearedAmount)
            this.$originalCost.attr('data-init-money', this.originalCostValue)
            this.$netBookValue.attr('data-init-money', this.originalCostValue)
            $.fn.initMaskMoney2()

            // Remove from array
            this.apInvoiceItems = this.apInvoiceItems.filter(item => item.id !== invoiceId)
        }
    }

    handleCashOutConfirmed(data) {
        this.cashOutItems.push(data)

        this.loadCostSummaryData({
            total_register_value: this.originalCostValue + data.total_register_value,
            quantity: 1,
        })
    }
    handleCashOutCleared(cashOutId) {
        const cashOutToRemove = this.cashOutItems.find(item => item.id === cashOutId)

        if (cashOutToRemove) {
            // Update original cost
            const clearedAmount = cashOutToRemove.total_register_value || 0
            this.originalCostValue = Math.max(0, this.originalCostValue - clearedAmount)
            this.$originalCost.attr('data-init-money', this.originalCostValue)
            this.$netBookValue.attr('data-init-money', this.originalCostValue)
            $.fn.initMaskMoney2()

            // Remove from array
            this.cashOutItems = this.cashOutItems.filter(item => item.id !== cashOutId)
        }
    }

    handleAssetCategoryChange(){
        const selectedData = this.$assetCategorySelect.select2('data')?.[0]?.data
        if (!selectedData || !selectedData.id) {
            this.clearDepreciationAndAccountFields()
            return
        }
        this.loadCategoryRelatedFields(selectedData)
    }
    loadCostSummaryData(data){
        const baseCost = parseFloat(data.total_register_value) || 0
        const quantity = parseFloat(data.quantity) || 1
        const totalBaseCost = baseCost * quantity

        // Store and display original cost
        this.originalCostValue = totalBaseCost
        this.$originalCost.attr('data-init-money', totalBaseCost)

        // init data for these 2 fields
        this.$netBookValue.attr('data-init-money', totalBaseCost)
        this.$accumulativeDepreciation.attr('data-init-money', 0)

        $.fn.initMaskMoney2()
    }
    loadCategoryRelatedFields(categoryData){
        const depreciationMethod = categoryData.depreciation_method
        const depreciationTime = categoryData.depreciation_time
        const assetAccountData = categoryData.asset_account
        const accumulatedDepreciation = categoryData.accumulated_depreciation_account
        const depreciationExpense = categoryData.depreciation_expense_account

        if (depreciationMethod !== undefined && depreciationMethod !== null) {
            this.$depreciationMethodSelect.val(depreciationMethod).trigger('change')
        }

        if (depreciationTime !== undefined && depreciationTime !== null) {
            this.$depreciationTime.val(depreciationTime)
        }

        // Load GL accounts
        this.loadAccountingAccount(this.$assetAccountSelect, assetAccountData)
        this.loadAccountingAccount(this.$accumulatedDepreciationSelect, accumulatedDepreciation)
        this.loadAccountingAccount(this.$depreciationExpenseSelect, depreciationExpense)
    }
    loadAccountingAccount($ele, data){
        if ($ele.hasClass("select2-hidden-accessible") && $ele) {
            $ele.select2('destroy')
        }
        $ele.empty()
        UsualLoadPageAccountingFunction.LoadAccountingAccount({element: $ele, data: data})
    }
    loadDepreciationPreviewData(data){
        this.$modalPreviewDepreciation.modal('show')

        if ($.fn.DataTable.isDataTable(this.$tableDepreciationPreview)){
            this.$tableDepreciationPreview.DataTable().destroy()
        }
        this.$tableDepreciationPreview.DataTableDefault({
            reloadCurrency: true,
            data: data,
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['month']}</div>`;
                    }
                },
                {
                    targets: 1,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['begin']}</div>`;
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['end']}</div>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        let beginNetValue = row?.['start_value']
                        return `<span class="mask-money" data-init-money="${beginNetValue}"></span>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        let depreciationValue = row?.['depreciation_value']
                        return `<span class="mask-money" data-init-money="${depreciationValue}"></span>`
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        let endNetValue = row?.['end_value']
                        return `<span class="mask-money" data-init-money="${endNetValue}"></span>`
                    }
                },
            ],
        })
    }
    loadDepreciationData(){
        const depreciationMethod = Number(this.$depreciationMethodSelect.val())
        let depreciationTime = 0
        const depreciationTimeUnit = Number(this.$depreciationTimeUnit.val())
        if (depreciationTimeUnit === 0){
            depreciationTime = this.$depreciationTime.val()
        } else {
            depreciationTime = Number(this.$depreciationTime.val())*12
        }
        const startDate = this.$depreciationStartDate.val()
        const endDate = this.$depreciationEndDate.val()
        const depreciationValue = Number(this.$depreciationValue.attr('value')) || 0
        const adjustmentFactor = Number(this.$depreciationAdjustFactor.val()) || 0

        return DepreciationControl.callDepreciation({
            method: depreciationMethod,
            months: depreciationTime,
            start_date: startDate,
            end_date: endDate,
            price: Number(depreciationValue),
            adjust: Number(adjustmentFactor)
        })
    }

    updateEndDate(){
        const startDate = this.$depreciationStartDate.val()
        const timeValue = Number(this.$depreciationTime.val()) || 0
        const timeUnit = Number(this.$depreciationTimeUnit.val()) || 0 // 0 = Months, 1 = Years

        // Validate inputs
        if (!startDate || !timeValue) {
            this.$depreciationEndDate.val('')
            return
        }

        // Convert years to months if needed
        const totalMonths = timeUnit === 1 ? timeValue * 12 : timeValue

        // Calculate end date
        const endDate = DepreciationControl.getEndDateDepreciation(startDate, totalMonths)

        // Set the end date field
        this.$depreciationEndDate.val(endDate)
    }
    clearDepreciationAndAccountFields(){
        this.$depreciationMethodSelect.val('').trigger('change')
        this.$depreciationTime.val('')
        this.loadAccountingAccount(this.$assetAccountSelect, null)
        this.loadAccountingAccount(this.$accumulatedDepreciationSelect, null)
        this.loadAccountingAccount(this.$depreciationExpenseSelect, null)
    }

    setupFormData(_form){
        _form.dataForm['source_type'] = this.sourceType
        // Depreciation settings
        _form.dataForm['depreciation_start_date'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', this.$depreciationStartDate.val())
        _form.dataForm['depreciation_end_date'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', this.$depreciationEndDate.val())
        _form.dataForm['depreciation_value'] = Number(this.$depreciationValue.attr('value')) || 0

        // Cost summary
        _form.dataForm['original_cost'] = Number(this.$originalCost.attr('data-init-money')) || 0
        _form.dataForm['accumulative_depreciation'] = Number(this.$accumulativeDepreciation.attr('data-init-money')) || 0
        _form.dataForm['net_book_value'] = Number(this.$netBookValue.attr('data-init-money')) || 0

        let depreciationData = this.loadDepreciationData()
        depreciationData.forEach(item => {
            item['begin'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', item['begin'])
            item['end'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', item['end'])
        })
        _form.dataForm['depreciation_data'] = depreciationData

        // Source-specific data
        switch(this.sourceType) {
            case 0: // Transfer from Inventory
                if (this.inventoryProduct) {
                    _form.dataForm['source_data'] = {
                        product_id: this.inventoryProduct.product_data?.id,
                        warehouse_id: this.inventoryProduct.warehouse?.id,
                        tracking_method: this.inventoryProduct.tracking_method,
                        tracking_number: this.inventoryProduct.tracking_number,
                        product_warehouse_id: this.inventoryProduct.product_warehouse_id,
                        total_register_value: this.inventoryProduct.total_register_value,
                    }
                }
                break
            case 1: // Purchase Fixed Assets
                _form.dataForm['source_data'] = {
                    ap_invoice_items: [],
                    cash_out_items: []
                }
                if (this.apInvoiceItems.length > 0) {
                    _form.dataForm['source_data']['ap_invoice_items'] = this.apInvoiceItems.map(invoice => ({
                        ap_invoice_id: invoice.id,
                        ap_invoice_code: invoice.code,
                        ap_invoice_title: invoice.title,
                        total_register_value: invoice.total_register_value,
                        detail_products: invoice.selected_items.map(item => ({
                            title: item.product_title,
                            code: item.product_code,
                            quantity: item.quantity,
                            unit_price: item.unit_price,
                            amount: item.amount,
                            ap_invoice_item_id: item.ap_item_id
                        }))
                    }))
                }
                if (this.cashOutItems.length > 0) {
                    _form.dataForm['source_data']['cash_out_items'] = this.cashOutItems.map(cashOut => ({
                        title: cashOut.title,
                        code: cashOut.code,
                        cash_out_id: cashOut.id,
                        total_register_value: cashOut.total_register_value
                    }))
                }
                break
        }
    }
    setUpSubmit($form){
        SetupFormSubmit.call_validate($form, {
            onsubmit: true,
            submitHandler: (form, event) => {
                let _form = new SetupFormSubmit($form);
                this.setupFormData(_form)
                WFRTControl.callWFSubmitForm(_form)
            }
        })
    }

    loadDetailData(){
        WindowControl.showLoading()
        $.fn.callAjax2({
            url: this.$formSubmit.attr('data-url'),
            method:'GET',
        })
        .then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data);
                    $.fn.compareStatusShowPageAction(data)
                    //handle step
                    const sourceType = data.source_type
                    this.setSourceType(sourceType)
                    this.assetStepHandler.setSourceType(sourceType)
                    this.assetStepHandler.goToStepAssetDetail()

                    // common information
                    this.$assetName.val(data.title)
                    this.$assetNumber.val(data.asset_code)
                    this.$manageDepartment.initSelect2({
                        data: data.manage_department
                    })
                    this.$useDepartment.initSelect2({
                        data: data.use_department
                    })
                    this.$assetCategorySelect.initSelect2({
                        data: data.asset_category
                    })
                    if(data.asset_category){
                        this.loadCategoryRelatedFields({
                            depreciation_method: data.depreciation_method,
                            depreciation_time: data.depreciation_time,
                            asset_account: data.asset_account,
                            accumulated_depreciation_account: data.accumulated_depreciation_account,
                            depreciation_expense_account: data.depreciation_expense_account
                        })
                    }

                    const startDate = DateTimeControl.formatDateType( "YYYY-MM-DD", "DD/MM/YYYY", data.depreciation_start_date)
                    const endDate = DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", data.depreciation_end_date)
                    this.$depreciationStartDate.val(startDate)
                    this.$depreciationEndDate.val(endDate)

                    this.$depreciationValue.attr('value', data.depreciation_value)

                    this.$originalCost.attr('data-init-money', data.original_cost)
                    this.$accumulativeDepreciation.attr('data-init-money', data.accumulative_depreciation)
                    this.$netBookValue.attr('data-init-money', data.net_book_value)

                    // load selected product
                    switch (sourceType) {
                        case SOURCE_TYPE["INVENTORY_TRANSFER"]:
                            this.inventoryProduct = {
                                product_data: {
                                    id: data.source_data.product_id,
                                    code: data.source_data.product_code,
                                    title: data.source_data.product_title,
                                },
                                warehouse: {
                                    id: data.source_data.warehouse_id,
                                    code: data.source_data.warehouse_code,
                                    title: data.source_data.warehouse_title,
                                },
                                tracking_method: data.source_data.tracking_method,
                                tracking_number: data.source_data.tracking_number,
                                product_warehouse_id: data.source_data.product_warehouse_id,
                                total_register_value: data.source_data.total_register_value
                            }

                            let inventoryHtml = this.searchInventoryHandler.getSelectedInventoryProductDataHtml(this.inventoryProduct)
                            this.searchInventoryHandler.loadSelectedInventoryProductData(inventoryHtml)
                            break
                        case SOURCE_TYPE["ASSET_PURCHASE"]:
                            const sourceData = data.source_data

                            // Load AP Invoice Items
                            if (sourceData?.ap_invoice_items && sourceData.ap_invoice_items.length > 0) {
                                sourceData.ap_invoice_items.forEach(invoice => {
                                    const selectedItems = invoice.detail_products?.map(product => ({
                                        id: product.id,
                                        ap_item_id: product.ap_invoice_item_id || null,
                                        product_code: product.code || '',
                                        product_title: product.title || '',
                                        quantity: product.quantity,
                                        unit_price: product.unit_price,
                                        amount: product.amount,

                                    })) || []

                                    const invoiceData = {
                                        id: invoice.ap_invoice_id,
                                        code: invoice.ap_invoice_code,
                                        title: invoice.ap_invoice_title,
                                        selected_items: selectedItems,
                                        total_register_value: invoice.total_register_value
                                    }

                                    // Store in state
                                    this.apInvoiceItems.push(invoiceData)

                                    // Generate and append HTML
                                    let invoiceHtml = this.purchaseAssetHandler.getSelectedInvoiceDetailHTML(invoiceData)
                                    this.purchaseAssetHandler.loadSelectedInvoiceDetail(invoiceHtml)
                                })
                            }

                            // Load Cash Out Items
                            if (sourceData?.cash_out_items && sourceData.cash_out_items.length > 0) {
                                sourceData.cash_out_items.forEach(cashOut => {
                                    const cashOutData = {
                                        id: cashOut.cash_out_id,
                                        code: cashOut.cash_out_code,
                                        title: cashOut.cash_out_title,
                                        cof_type: cashOut.cof_type,
                                        cof_type_display: CASH_OUT_FLOW_TYPE_DISPLAY[cashOut.cof_type],
                                        date_created: cashOut.date_created,
                                        total_register_value: cashOut.total_register_value
                                    }

                                    // Store in state
                                    this.cashOutItems.push(cashOutData)

                                    // Generate and append HTML
                                    let cashOutHtml = this.purchaseAssetHandler.getSelectedCashOutHTML(cashOutData)
                                    this.purchaseAssetHandler.loadSelectedCashOut(cashOutHtml)
                                })
                            }

                            // Update original cost value from all sources
                            let totalCost = 0
                            this.apInvoiceItems.forEach(item => {
                                totalCost += item.total_register_value || 0
                            })
                            this.cashOutItems.forEach(item => {
                                totalCost += item.total_amount || 0
                            })
                            this.originalCostValue = totalCost
                            break;
                    }
                    $.fn.initMaskMoney2()
                }
            },
            (errs) => {
                if(errs.data.errors){
                    for (const [key, value] of Object.entries(errs.data.errors)) {
                        $.fn.notifyB({title: key, description: value}, 'failure')
                    }
                } else {
                    $.fn.notifyB('Error', 'failure')
                }
            }
        )
        .finally(()=>{
            WindowControl.hideLoading()
        })
    }
}
