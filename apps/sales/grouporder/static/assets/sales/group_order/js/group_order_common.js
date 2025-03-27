class GroupOrderCommon {
    constructor() {
        this.$serviceDurationInput = $('#service-duration')
        this.$createdDateInput = $('#created-date')

        this.$detailDataTable = $('#datatable-detail')

        this.$productModalDatatable = $('#modal-datatable-product')

        this.$costDataTable = $('#datatable-cost')

        this.$expenseDataTable = $('#datatable-expense')

        this.$urlScript = $('#url-script')

        this.$formSubmit = $('#form-group-order')

        // common fields
        this.$orderNumberInput = $('#order-number')
        this.$maxGuestInput = $('#max-guest')
        this.$registeredGuest = $('#registered-guest')
        this.$costPerGuestInput = $('#cost-per-guest')
        this.$costPerRegisteredGuestInput = $('#cost-per-registered-guest')
        this.$plannedRevenueInput = $('#planned-revenue')
        this.$actualRevenueInput = $('#actual-revenue')
        this.$descriptionInput = $('#description')
        this.$orderStatusSelect = $('#status')
        this.$orderPaymentTermSelect = $('#payment-term')
        this.$markupPercentageInput = $('#markup-percentage')
        this.$totalCostInput = $('#total-cost')

        // total
        this.$totalGuest = $('#total-guest')
        this.$taxSelect = $('#tax')
        this.$totalAmount = $('#total-amount')
        this.$totalAmountVAT = $('#total-amount-vat')

        // offcanvas

        this.$addCustomerOffcanvas = $('#offcanvas-add-customer')
        this.$canvasServiceNameInput = $('#canvas-service-name')
        this.$canvasServiceCodeInput = $('#canvas-service-code')
        this.$canvasRegisterDate = $('#canvas-register-date')
        this.$canvasCustomerSelect = $('#canvas-customer')
        this.$canvasCustomerCodeInput = $('#canvas-customer-code')
        this.$canvasPhoneInput = $('#canvas-phone')
        this.$canvasEmailInput = $('#canvas-email')
        this.$canvasPaymentSelect = $('#canvas-payment-status')
        this.$canvasNoteInput = $('#canvas-note')

        this.$canvasUpdateCustomer = $('#offcanvas-update-customer')
        this.$canvasServiceNameInputUpdate = $('#canvas-service-name-update')
        this.$canvasServiceCodeInputUpdate = $('#canvas-service-code-update')
        this.$canvasRegisterDateUpdate = $('#canvas-register-date-update')
        this.$canvasCustomerSelectUpdate = $('#canvas-customer-update')
        this.$canvasCustomerCodeInputUpdate = $('#canvas-customer-code-update')
        this.$canvasPhoneInputUpdate = $('#canvas-phone-update')
        this.$canvasEmailInputUpdate = $('#canvas-email-update')
        this.$canvasPaymentSelectUpdate = $('#canvas-payment-status-update')
        this.$canvasNoteInputUpdate = $('#canvas-note-update')
        this.$canvasUpdateCustomerBtn = $('#btn-offcanvas-update-customer')

        // modal
        this.$selectPriceModal = $('#modal-select-price')
    }

    init(isDetail=false){
        this.initTaxData()
        this.initDateInput(this.$canvasRegisterDate, null, false)
        if(!isDetail){
            new $x.cls.bastionField().init()
            this.initProductModalDataTable()
            this.initDateInput(this.$serviceDurationInput, null, true)
            this.initDateInput(this.$createdDateInput, null, false)
            this.initDetailDataTable()
            this.initCostDataTable()
            this.initExpenseDataTable()
        }
        $.fn.initMaskMoney2()
    }

    initSelect($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    }

    handleEvents(isDetail=false){
        this.handleOpenAddCustomerModal()
        this.handleChangeOrderNumberAndDescription()
        this.handleAddNewCustomer()
        this.handleSelectCustomer()
        this.handleAddProduct()
        this.handleOpenPriceModal(isDetail)
        this.handleEditProductPriceInPriceModal(isDetail)
        this.handleSelectPriceInPriceModal()
        this.handleFinishSelectPrice()
        this.handleSelectTax()
        this.handleChangeMaxGuest()
        this.handleSelectProductInPriceModal()
        this.handleOpenCustomerDetail()
        this.handleUpdateCustomer()
        this.handleDeleteCustomer()
        this.handleChangeDiscount()
        this.handleDeleteCostProduct()
        this.handleChangeDetailCustomerQuantity()
        this.handleChangeCostQuantityType()
        this.handleChangePackQuantity()
        this.handleChangeUnitCost()
        this.handleAddExpense()
        this.handleChangeExpense()
        this.handleDeleteExpense()
        this.handleReselectDataInherit()
        this.handleChangeMarkupPercentage()
    }

    initInput($selector, data=null){
        $selector.val(data)
    }

    // dateDate format must be YYYY-MM-DD
    initDateInput($dateInput, dateData, isRange = false) {
        // Reformat dateData if provided
        let startDate, endDate;
        if (dateData) {
            if (typeof dateData === 'object' && dateData.start && dateData.end && isRange) {
                // Handle object with start and end dates for range
                startDate = $x.fn.reformatData(
                    dateData.start,
                    $x.cls.datetime.defaultFormatDatetime,
                    'DD-MM-YYYY',
                    moment().format('DD-MM-YYYY')
                );
                endDate = $x.fn.reformatData(
                    dateData.end,
                    $x.cls.datetime.defaultFormatDatetime,
                    'DD-MM-YYYY',
                    moment().format('DD-MM-YYYY')
                );
            } else {
                // Handle single date (string) or fallback
                startDate = $x.fn.reformatData(
                    dateData,
                    $x.cls.datetime.defaultFormatDatetime,
                    'DD-MM-YYYY',
                    moment().format('DD-MM-YYYY')
                );
                endDate = isRange ? moment(startDate, 'DD-MM-YYYY').add(1, 'days') : null;
            }
        } else {
            // No dateData provided, use defaults
            startDate = moment().format('DD-MM-YYYY');
            endDate = isRange ? moment().add(1, 'days').format('DD-MM-YYYY') : null;
        }

        $dateInput.daterangepicker({
            singleDatePicker: !isRange, // True if not isRange, false if isRange
            timePicker: false,
            showDropdowns: isRange, // Show dropdowns only for range selection
            minYear: 2023,
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
            autoUpdateInput: false,
            locale: {
                format: 'DD/MM/YYYY',
            },
            startDate: moment(startDate, 'DD-MM-YYYY'),
            ...(isRange && { // Only include endDate if isRange is true
                endDate: moment(endDate, 'DD-MM-YYYY')
            })
        }).on('apply.daterangepicker', function (ev, picker) {
            if (isRange) {
                // Range mode: Format as "start - end"
                const startDate = picker.startDate.format('DD-MM-YYYY');
                const endDate = picker.endDate.format('DD-MM-YYYY');
                $(this).val(`${startDate} - ${endDate}`).trigger('change');
            } else {
                // Single mode: Format as single date
                $(this).val(picker.startDate.format('DD-MM-YYYY')).trigger('change');
            }
        }).on('show.daterangepicker', function (ev, picker) {
            if (dateData) {
                if (typeof dateData === 'object' && dateData.start && dateData.end && isRange) {
                    picker.setStartDate(moment(startDate, 'DD-MM-YYYY'));
                    picker.setEndDate(moment(endDate, 'DD-MM-YYYY'));
                } else {
                    picker.setStartDate(moment(startDate, 'DD-MM-YYYY'));
                    if (isRange) {
                        picker.setEndDate(moment(endDate, 'DD-MM-YYYY'));
                    }
                }
            }
        });

        // Set initial value based on isRange
        if (dateData) {
            if (isRange) {
                if (typeof dateData === 'object' && dateData.start && dateData.end) {
                    const formattedStart = moment(startDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
                    const formattedEnd = moment(endDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
                    $dateInput.val(`${formattedStart} - ${formattedEnd}`).trigger('change');
                } else {
                    const formattedStart = moment(startDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
                    const formattedEnd = moment(startDate, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY');
                    $dateInput.val(`${formattedStart} - ${formattedEnd}`).trigger('change');
                }
            } else {
                $dateInput.val(moment(startDate, 'DD-MM-YYYY').format('DD-MM-YYYY')).trigger('change');
            }
        } else {
            if (isRange) {
                const defaultStart = moment().format('DD-MM-YYYY');
                const defaultEnd = moment().add(1, 'days').format('DD-MM-YYYY');
                $dateInput.val(`${defaultStart} - ${defaultEnd}`).trigger('change');
            } else {
                $dateInput.val(moment().format('DD-MM-YYYY')).trigger('change');
            }
        }
    }

    initMaskMoneyInput($selector, data=null){
        $selector.attr('value', data).focus({preventScroll: true}).blur()
    }

    initDetailDataTable(data=[], isDetail=false){
        this.$detailDataTable.DataTableDefault({
            data: data,
            rowIdx: true,
            reloadCurrency: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    width: '5%',
                    render: (data, type, row) => {
                        const customerCode = row?.['customer_code']
                        return `<div class="detail-customer-code">${customerCode}</div>`
                    }
                },
                {
                    targets: 2,
                    width: '18%',
                    render: (data, type, row) => {
                        const customerName = row?.['customer_name']
                        return `<div class="detail-customer-name">${customerName}</div>`
                    }
                },
                {
                    targets: 3,
                    width: '7%',
                    render: (data, type, row) => {
                        const registerCode = row?.['register_code']
                        return `<div class="detail-register-code">${registerCode}</div>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        const registerDate = row?.['register_date']
                        return `<div>${registerDate}</div>`
                    }
                },
                {
                    targets: 5,
                    width: '7%',
                    render: (data, type, row) => {
                        const isIndividual = row?.['is_individual'] === 'true' || row?.['is_individual'] === true
                        const quantity = row?.['quantity']
                        if(isIndividual){
                            return `<div class="detail-quantity">${quantity}</div>`
                        } else {
                            return `<div class="form-group mt-3">
                                        <input min="0" type="number" class="form-control detail-quantity" value="${quantity}">
                                    </div>`
                        }
                    }
                },
                {
                    targets: 6,
                    width: '15%',
                    render: (data, type, row) => {
                        const unitPrice = row?.['unit_price']
                        const customerId = row?.['customer_id']
                        return `<span>
                                    <span class="mask-money detail-unit-price" data-customer-id="${customerId}" data-init-money="${unitPrice}"></span>
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-select-price"
                                        title="Select price"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        data-url=""
                                        data-customer-id="${customerId}"
                                    >
                                        <span class="icon"><i class="fas fa-ellipsis-h"></i></span>
                                    </button>
                                </span>`
                    }
                },
                {
                    targets: 7,
                    width: '12%',
                    render: (data, type, row) => {
                        const subTotal = row?.['sub_total']
                        return `<span class="mask-money detail-sub-total" data-init-money="${subTotal}"></span>`
                    }
                },
                {
                    targets: 8,
                    width: '7%',
                    render: (data, type, row) => {
                        const discount = row?.['discount'] || 0
                        return `<div class="form-group mt-3">
                                    <input min="0" type="number" class="form-control detail-discount" value="${discount}">
                                </div>`
                    }
                },
                {
                    targets: 9,
                    width: '5%',
                    render: (data, type, row) => {
                        const paymentStatusMap = {
                            1: 'paid',
                            0: 'unpaid'
                        }
                        const paymentStatus = paymentStatusMap[row?.['payment_status']]
                        return `<div class="detail-payment-status">${paymentStatus}</div>`
                    }
                },
                {
                    targets: 10,
                    width: '5%',
                    render: (data, type, row) => {
                        const dataDetail = encodeURIComponent(JSON.stringify(row))
                        const customerId = row?.['customer_id']
                        return `<div class="d-flex justify-content-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover detail-edit-row" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom" 
                                        title=""
                                        data-detail="${dataDetail}"
                                        data-customer-id="${customerId}"
                                    >
                                        <span class="icon">
                                            <i class="${isDetail ? "far fa-eye" : "fas fa-pencil"}"></i>
                                        </span>
                                    </button>
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover detail-del-row" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom" 
                                        title=""
                                        data-detail="${dataDetail}"
                                        data-customer-id="${customerId}"
                                    >
                                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                                    </button>
                                </div>`
                    }
                },
            ],
            // rowCallback: function(row, data) {
            //
            //     if (data.isNew) {
            //         const $select = $(row).find('.tax-select')
            //         const dataScript = $('#data-script')
            //         let dataTax = JSON.parse(dataScript.attr('data-tax')) || []
            //         this.initSelect($select, dataTax)
            //         const newOption = new Option('Select', '', true, true)
            //         $select.append(newOption).trigger('change');
            //
            //         data.isNew = false;
            //     }
            // }.bind(this),
        })
    }

    initProductModalDataTable(data=[]){
        this.$productModalDatatable.DataTableDefault({
            data: data,
            rowIdx: true,
            reloadCurrency: true,
            useDataServer: true,
            ajax: {
                url: this.$productModalDatatable.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['group_order_product_list'] ? resp.data['group_order_product_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    width: '10%',
                    render: (data, type, row) => {
                        const code = row?.['code']
                        return `<div class="product-code">${code}</div>`
                    }
                },
                {
                    targets: 2,
                    width: '30%',
                    render: (data, type, row) => {
                        const title = row?.['title']
                        return `<div class="product-title">${title}</div>`
                    }
                },
                {
                    targets: 3,
                    width: '15%',
                    render: (data, type, row) => {
                        const value = row?.['standard_price']
                        return `<span class="mask-money product-standard-price" data-init-money=${value} value=${value}></span>`
                    }
                },
                {
                    targets: 4,
                    width: '30%',
                    render: (data, type, row) => {
                        const bomTitle = row?.['bom_product']?.['title'] ? row?.['bom_product']?.['title'] : 'no data'
                        return `<div>${bomTitle}</div>`
                    }
                },
                {
                    targets: 5,
                    width: '15%',
                    render: (data, type, row) => {
                        const bomValue = row?.['bom_product']?.['sum_price'] ? row?.['bom_product']?.['sum_price'] : 0
                        return `<span class="mask-money bom-price" data-init-money=${bomValue} value=${bomValue}></span>`
                    }
                },
                {
                    targets: 6,
                    width: '1%',
                    render: (data, type, row) => {
                        const generalPrice = row?.['general_price']?.['price'] || 0
                        const generalPriceId = row?.['general_price']?.['id']
                        const productId = row?.['id']
                        const productData = encodeURIComponent(JSON.stringify(row))
                        return `<input 
                                    type="checkbox" 
                                    class="form-check-input" 
                                    name="select-product" 
                                    data-general-price-id="${generalPriceId}" 
                                    data-general-price="${generalPrice}" 
                                    data-product-id="${productId}"
                                    data-product="${productData}"
                                />`
                    }
                },
            ],
            drawCallback: function (row, data) {
                const dataScript = $('#data-script');
                const savedProducts = JSON.parse(dataScript.attr('data-selected-product') || '[]');

                const savedProductIds = new Set(savedProducts.map(product => product.id));
                console.log(savedProducts)
                console.log(savedProductIds)
                // Loop through all rows in the table
                const api = this.api(); // Get DataTable API instance
                api.rows().every(function () {
                    const row = this.node(); // DOM node of the row
                    const rowData = this.data(); // Row data object
                    const productId = rowData?.['id'];
                    const $checkbox = $(row).find('input[type="checkbox"]');

                    const isInSavedProducts = savedProductIds.has(productId);
                    $checkbox.prop('checked', isInSavedProducts);
                    $checkbox.prop('disabled', isInSavedProducts);
                });
            },
        })
    }

    initCostDataTable(data=[]){
        this.$costDataTable.DataTableDefault({
            data: data,
            rowIdx: true,
            reloadCurrency: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    width: '10%',
                    render: (data, type, row) => {
                        const code = row?.['code']
                        return `<div>${code}</div>`
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    render: (data, type, row) => {
                        const title = row?.['title']
                        return `<div>${title}</div>`
                    }
                },
                {
                    targets: 3,
                    width: '25%',
                    render: (data, type, row) => {
                        const quantity = row?.['quantity']
                        const guestQuantity = row?.['guest_quantity']
                        const productId = row?.['id']
                        const isUsingGuestQuantity = row?.['is_using_guest_quantity']
                        return `<div class="row">
                                    <div class="col-6">
                                        <div class="form-check d-flex align-items-center">
                                            <input 
                                                type="radio" 
                                                class="form-check-input cost-quantity-radio" 
                                                name="cost-quantity-${productId}" 
                                                data-product-id="${productId}"
                                                data-quantity-type="pack"
                                                data-quantity="${quantity}"
                                                ${!isUsingGuestQuantity ? 'checked' : ''}
                                            >
                                            <div class="d-flex align-items-center">
                                                <div class="mr-1">Pack: </div>
                                                <div class="form-group mt-3">
                                                    <input type="number" min="0" class="form-control pack-quantity w-70" value="${quantity}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6 border-start border-grey">
                                        <div class="form-check d-flex align-items-center">
                                            <input 
                                                type="radio" 
                                                class="form-check-input cost-quantity-radio" 
                                                name="cost-quantity-${productId}" 
                                                data-product-id="${productId}"
                                                data-quantity-type="guest"
                                                data-quantity="${guestQuantity}"
                                                ${isUsingGuestQuantity ? 'checked' : ''}
                                            >
                                            <div class="d-flex align-items-center">
                                                <div class="mr-1">Guest: </div>
                                                <div class="form-group mt-3">
                                                    <input type="number" disabled readonly class="form-control guest-quantity w-70" value="${guestQuantity}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                    }
                },
                {
                    targets: 4,
                    width: '15%',
                    render: (data, type, row) => {
                        const unitCost = row?.['unit_cost'] ? row?.['unit_cost'] : 0
                        return `<div class="form-group mt-3">
                                    <input class="form-control mask-money cost-unit-cost" value="${unitCost}">
                                </div>`
                    }
                },
                {
                    targets: 5,
                    width: '15%',
                    render: (data, type, row) => {
                        const isUsingGuestQuantity = row?.['is_using_guest_quantity']
                        let quantity = 0
                        if (!isUsingGuestQuantity){
                            quantity = row?.['quantity'] ? row?.['quantity'] : 0
                        } else {
                            quantity = row?.['guest_quantity'] ? row?.['guest_quantity'] : 0
                        }
                        const unitCost = row?.['unit_cost'] ? row?.['unit_cost'] : 0
                        const subTotal = quantity * unitCost
                        return `<span class="mask-money cost-sub-total" data-init-money=${subTotal}></span>`
                    }
                },
                {
                    targets: 6,
                    width: '6%',
                    render: (data, type, row) => {
                        const note = row?.['note'] ? row?.['note'] : ''
                        return `<div class="form-group">
                                    <label class="form-label" hidden></label>
                                    <textarea class="form-control cost-note" value="${note}">${note}</textarea>
                                </div>`
                    }
                },
                {
                    targets: 7,
                    width: '4%',
                    render: (data, type, row) => {
                        const productId = row?.['id']
                        return `<div class="d-flex justify-content-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover cost-del-row"
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom" 
                                        data-product-id="${productId}"
                                    >
                                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                                    </button>
                                </div>`
                    }
                },
            ]
        })
    }

    initExpenseDataTable(data=[]){
        this.$expenseDataTable.DataTableDefault({
            data: data,
            rowIdx: true,
            reloadCurrency: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        const expenseName = row?.['expense_name'] || ''
                        return `<div class="form-group">
                                    <label class="form-label required" hidden></label>
                                    <input required class="form-control expense-name" value="${expenseName}">
                                </div>`
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        const expenseListUrl = this.$urlScript.attr('data-expense-item-list-url')
                        return `<div class="form-group">
                                    <select class="form-select select2 expense-item-select" data-url="${expenseListUrl}" data-keyResp="expense_item_list">
                                    </select>
                                </div>
                                `
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        const uomListUrl = this.$urlScript.attr('data-uom-list-url')
                        return `<div class="form-group">
                                    <select class="form-select select2 uom-select" data-url="${uomListUrl}" data-keyResp="unit_of_measure">
                                    </select>
                                </div>`
                    }
                },
                {
                    targets: 4,
                    width: '5%',
                    render: (data, type, row) => {
                        const quantity = row?.['expense_quantity'] || ''
                        return `<div class="form-group">
                                    <input min="0" type="number" required class="form-control expense-quantity" value="${quantity}">
                                </div>`
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        const cost = row?.['expense_cost'] || ''
                        return `<div class="form-group">
                                    <input required class="form-control mask-money expense-cost" value="${cost}">
                                </div>`
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="form-group">
                                    <select class="form-select select2 expense-tax-select" >
                                    </select>
                                </div>`
                    }
                },
                {
                    targets: 7,
                    width: '10%',
                    render: (data, type, row) => {
                        const subTotal = row?.['expense_sub_total'] || 0
                        return `<div class="form-group">
                                    <span class="mask-money expense-sub-total" data-init-money="${subTotal}"></span>
                                </div>`
                    }
                },
                {
                    targets: 8,
                    width: '10%',
                    render: (data, type, row) => {
                        const expenseId = row?.['id'] || ''
                        return `<div class="d-flex justify-content-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover expense-del-row"
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom" 
                                        data-expense-id="${expenseId}"
                                    >
                                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                                    </button>
                                </div>`
                    }
                },
            ],
            rowCallback: function (row, data) {
                if (data.isNew) {
                    const $select = $(row).find('.expense-tax-select')
                    const $expenseSelect = $(row).find('.expense-item-select')
                    const $uomSelect = $(row).find('.uom-select')
                    const dataScript = $('#data-script')
                    let dataTax = JSON.parse(dataScript.attr('data-tax')) || []
                    this.initSelect($select, dataTax)
                    const newOption = new Option('Select', '', true, true)
                    $select.append(newOption).trigger('change');

                    this.initSelect($expenseSelect)
                    this.initSelect($uomSelect)
                    data.isNew = false;
                }
            }.bind(this),
        })
    }

    handleOpenAddCustomerModal(){
        $(document).on('click', '#btn-add-customer', (e)=>{
            const serviceName = this.$descriptionInput.val()
            const serviceCode = this.$orderNumberInput.val()

            this.$canvasServiceNameInput.val(serviceName)
            this.$canvasServiceCodeInput.val(serviceCode)
        })
    }

    handleChangeOrderNumberAndDescription(){
        $(document).on('change', '#description, #order-number', (e)=>{
            const serviceName = this.$descriptionInput.val()
            const serviceCode = this.$orderNumberInput.val()
            const table = this.$detailDataTable.DataTable()
            table.rows().every(function () {
                let rowData = this.data()
                const $row = $(this.node())
                const unitPrice = $row.find('.detail-unit-price').attr('data-init-money')
                const subTotal = $row.find('.detail-sub-total').attr('data-init-money')
                rowData['unit_price'] = unitPrice
                rowData['sub_total'] = subTotal
                rowData['service_name'] = serviceName
                rowData['register_code'] = serviceCode
                this.data(rowData)
            })
            table.draw()
        })
    }

    handleAddNewCustomer(){
        $(document).on('click', '#btn-offcanvas-add-customer', (e)=>{
            const serviceName = this.$canvasServiceNameInput.val()
            const serviceCode = this.$canvasServiceCodeInput.val()
            const registerDate = this.$canvasRegisterDate.val()
            const customerName = this.$canvasCustomerSelect.find(':selected').text()
            const customerID = this.$canvasCustomerSelect.val()
            const customerCode = this.$canvasCustomerCodeInput.val()
            const phone = this.$canvasPhoneInput.val()
            const email = this.$canvasEmailInput.val()
            const paymentStatus = this.$canvasPaymentSelect.val()
            const note = this.$canvasNoteInput.val()
            const isIndividual = $(e.currentTarget).attr('data-is-individual')

            const dataScript = $('#data-script')
            let totalGeneralPrice = dataScript.attr('data-total-general-price') || 0
            totalGeneralPrice = Number(totalGeneralPrice)

            // check if product is already in the table
            let exists = false
            this.$detailDataTable.DataTable().rows().every(function () {
                let rowData = this.data();
                if (rowData.customer_id === customerID) {
                    exists = true
                    return false
                }
            })

            if (exists) {
                alert("This item has already been added.")
                return
            }

            const data={
                service_name: serviceName,
                customer_id: customerID,
                customer_code: customerCode,
                customer_name: customerName,
                register_code: serviceCode,
                register_date: registerDate,
                phone: phone,
                email: email,
                payment_status: paymentStatus,
                unit_price: totalGeneralPrice,
                sub_total: totalGeneralPrice,
                quantity: 1,
                note: note,
                is_individual: isIndividual,
                discount: 0
            }

            this.$detailDataTable.DataTable().row.add(data).draw()

            let dataProductList = JSON.parse(dataScript.attr('data-selected-product'))
            let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))
            let dataSelectedPriceByCustomer = dataSelectedPriceList[customerID] || []
            // add general price to script
            for (const product of dataProductList){
                const defaultPrice = product['product_price_list_data'].find((item)=>item['is_default']===true)
                dataSelectedPriceByCustomer.push({
                    id: defaultPrice?.['id'],
                    value: defaultPrice?.['price'],
                    productId: product?.['id']
                })
            }
            dataSelectedPriceList[customerID] = dataSelectedPriceByCustomer

            dataScript.attr('data-selected-price', JSON.stringify(dataSelectedPriceList))

            this.reLoadGuestQuantity()

            this.reCalculateDataTotalCost()

            this.hideOffCanvas('#offcanvas-add-customer')

            this.loadDataCustomerPrice()

            this.loadTotalData()

            this.clearDataCustomerCanvas()
        })
    }

    handleSelectCustomer(){
        $(document).on('change', '#canvas-customer', (e)=>{
            // const contactID = $(e.currentTarget).val()
            // let url = this.$urlScript.attr('data-detail-account-url').format_url_with_uuid(contactID)
            const accountID = $(e.currentTarget).val()
            let url = this.$urlScript.attr('data-detail-account-url').format_url_with_uuid(accountID)
            $.fn.callAjax2({
                url: url,
                method:'GET',
                isLoading: true,
            }).then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        // this.initInput(this.$canvasCustomerCodeInput, data?.['contact_detail']?.['code'])
                        // this.initInput(this.$canvasPhoneInput, data?.['contact_detail']?.['phone'] ? data?.['contact_detail']?.['phone'] : 'no data')
                        // this.initInput(this.$canvasEmailInput, data?.['contact_detail']?.['email'] ? data?.['contact_detail']?.['email'] : 'no data')
                        this.initInput(this.$canvasCustomerCodeInput, data?.['account_detail']?.['code'])
                        this.initInput(this.$canvasPhoneInput, data?.['account_detail']?.['phone'] ? data?.['account_detail']?.['phone'] : 'no data')
                        this.initInput(this.$canvasEmailInput, data?.['account_detail']?.['email'] ? data?.['account_detail']?.['email'] : 'no data')
                        const isIndividual = data?.['account_detail']?.['account_type_selection'] === 0
                        $('#btn-offcanvas-add-customer').attr('data-is-individual', isIndividual)
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
                })
            })
    }

    handleAddProduct(){
        $(document).on('click', '#btn-add-product', ()=>{
            // get data from script
            const dataScript = $('#data-script')
            let totalCost = Number(dataScript.attr('data-total-cost') || 0)
            let totalGeneralPrice = Number(dataScript.attr('data-total-general-price') || 0)

            // get data from selected row
            const costTable =  this.$costDataTable.DataTable()
            const selectedProductCheckboxes = this.$productModalDatatable.find('input[type="checkbox"]:checked')
            const guestQuantity = this.$detailDataTable.DataTable().rows().count()
            const existingIds = new Set()
            const selectedIds = new Set()
            let newRows = []
            costTable.rows().every(function () {
                let rowData = this.data();
                existingIds.add(rowData.id);
            })

            selectedProductCheckboxes.each((i, ele) => {
                const $checkbox = $(ele)
                const id = $checkbox.attr('data-product-id')
                selectedIds.add(id)

                if (existingIds.has(id)) {
                    return
                }

                const selectedProductRow = $checkbox.closest('tr')
                const code = selectedProductRow.find('.product-code').text()
                const title = selectedProductRow.find('.product-title').text()
                let standardPrice = Number(selectedProductRow.find('.product-standard-price').attr('value') || 0);
                let bomPrice = Number(selectedProductRow.find('.bom-price').attr('value') || 0);
                let generalPrice = Number($checkbox.attr('data-general-price') || 0);
                let unit_cost = Number(bomPrice !== 0 ? bomPrice : standardPrice);
                const quantity = 1
                const productData = JSON.parse(decodeURIComponent($checkbox.attr('data-product')))

                newRows.push({
                    id: id,
                    code: code,
                    title: title,
                    quantity: quantity,
                    guest_quantity: guestQuantity,
                    unit_cost: unit_cost,
                    general_price: generalPrice,
                    is_using_guest_quantity: false,
                    productData: productData
                });
            });


            newRows.forEach(row => {
                this.$costDataTable.DataTable().row.add({
                    id: row.id,
                    code: row.code,
                    title: row.title,
                    quantity: row.quantity,
                    guest_quantity: row.guest_quantity,
                    unit_cost: row.unit_cost,
                    general_price: row.general_price,
                    is_using_guest_quantity: row.is_using_guest_quantity
                });

                totalCost += row.unit_cost * row.quantity
                totalGeneralPrice += row.general_price

                this.addProductGeneralPriceToEachCustomer(row.productData)
                this.saveSelectedProductToScript(row.productData)
            });

            costTable.draw()

            // Update script attributes
            dataScript.attr('data-total-cost', totalCost)
            dataScript.attr('data-total-general-price', totalGeneralPrice)

            // Update UI
            this.loadTotalData()

            this.$productModalDatatable.DataTable().draw()
        })
    }

    handleOpenPriceModal(isDetail=false){
        $(document).on('click', '.btn-select-price', (e)=>{
            const dataScript = $('#data-script')
            let dataProductList = JSON.parse(dataScript.attr('data-selected-product'))

            const customerId = $(e.currentTarget).attr('data-customer-id')

            this.$selectPriceModal.attr('data-customer-id', customerId)

            const $selectPriceModalProductListArea = $('#modal-product-list')
            const $selectPriceModalPriceListArea = $('#modal-price-list')

            $selectPriceModalProductListArea.empty()
            $selectPriceModalPriceListArea.empty()

            let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))
            let dataSelectedPriceByCustomer = dataSelectedPriceList[customerId] || []

            for (const item of dataProductList) {
                const title = item?.['title']
                const id = item?.['id']
                const isChecked = !!dataSelectedPriceByCustomer.find((priceItem)=>priceItem?.['productId'] === id)
                $selectPriceModalProductListArea.append(`
                    <div class="form-check d-flex align-items-center">
                        <input type="checkbox" class="form-check-input price-modal-checkbox" name="price-modal-select-product" data-product-id="${id}" ${isChecked ? 'checked' : ''} ${isDetail ? 'disabled' : ''}>
                        <label class="form-check-label">${title}</label>
                        <button 
                            type="button"
                            class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover price-modal-edit-product"
                            title="Choose price"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            data-product-id="${id}"
                            ${isChecked ? '' : 'disabled'}
                        >   
                            <span class="icon">
                                <i class="${isDetail ? 'far fa-eye' : 'far fa-eye'}"></i>
                            <!--<i class="${isDetail ? 'far fa-eye' : 'fas fa-pencil'}"></i>-->
                            </span>
                        </button>
                    </div>
                `)
            }

            const sumPrice = this.getSumPriceInPriceModal()

            $('#modal-price-sum-price').attr('data-init-money', sumPrice)

            $.fn.initMaskMoney2()

            this.$selectPriceModal.modal('show')
        })
    }

    handleEditProductPriceInPriceModal(isDetail=false){
        $(document).on('click', '.price-modal-edit-product', (e)=>{
            const customerId = this.$selectPriceModal.attr('data-customer-id')

            const dataScript = $('#data-script')
            let dataProductList = JSON.parse(dataScript.attr('data-selected-product'))
            let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))

            let dataSelectedPriceByCustomer = dataSelectedPriceList[customerId] || []

            const productId = $(e.currentTarget).attr('data-product-id')

            const productData =  dataProductList.find((item)=>item.id === productId)
            const productPriceListData = productData?.['product_price_list_data']

            const $modalPriceListArea = $('#modal-price-list')
            const productTitle = productData?.['title']
            $modalPriceListArea.empty()
            $modalPriceListArea.append(`
                <div>${productTitle}</div>
            `)
            for (const item of productPriceListData) {

                const title = item?.['title']
                const price = item?.['price']
                const id = item?.['id']
                let isExisting = !!dataSelectedPriceByCustomer.find((item)=>item.id === id)

                $modalPriceListArea.append(`
                    <div class="form-check">
                        <input 
                            type="radio" 
                            class="form-check-input price-modal-select-price" 
                            name="price-for-${productId}" 
                            data-price-id="${id}" 
                            data-price-value="${price}"
                            data-product-id="${productId}"
                            ${isExisting ? "checked" : ""}
                            ${isDetail ? 'disabled' : ''}
                            hidden
                            disabled
                        >
                        <label class="form-check-label w-100">
                            <div class="row w-100">
                                <div class="col-6">
                                    <span class="fw-bold">${title}</span>
                                </div>
                                <div class="col-6">
                                    <span class="mask-money" data-init-money=${price}></span>
                                </div>
                            </div>
                        </label>
                    </div>
                `)
            }
            $.fn.initMaskMoney2()
        })
    }

    handleSelectPriceInPriceModal(){
        $(document).on('click', '.price-modal-select-price', (e)=>{

            const customerId = this.$selectPriceModal.attr('data-customer-id')
            const dataScript = $('#data-script')
            let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))

            let dataSelectedPriceByCustomer = dataSelectedPriceList[customerId] || []

            const priceId = $(e.currentTarget).attr('data-price-id')
            const priceValue = Number($(e.currentTarget).attr('data-price-value'))
            const productId = $(e.currentTarget).attr('data-product-id')


            dataSelectedPriceByCustomer = dataSelectedPriceByCustomer.filter((item)=>item?.['productId'] !== productId)

            dataSelectedPriceByCustomer.push({
                id: priceId,
                value: priceValue,
                productId: productId,
            })

            dataSelectedPriceList[customerId] = dataSelectedPriceByCustomer

            dataScript.attr('data-selected-price', JSON.stringify(dataSelectedPriceList))

            const sumPrice = this.getSumPriceInPriceModal()

            $('#modal-price-sum-price').attr('data-init-money', sumPrice)

            $.fn.initMaskMoney2()
        })
    }

    handleFinishSelectPrice(){
        $(document).on('click', '#btn-finish', (e)=>{
            const dataScript = $('#data-script')

            const customerId = this.$selectPriceModal.attr('data-customer-id')
            let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))
            let dataSelectedPriceByCustomer = dataSelectedPriceList[customerId] || []

            const $selectPriceModalProductListArea = $('#modal-product-list')
            const $selectedProductList = $selectPriceModalProductListArea.find('input[type="checkbox"][name="price-modal-select-product"]:checked')
            const selectedProductIdList = []
            $selectedProductList.each(function() {
                selectedProductIdList.push($(this).attr('data-product-id'));
            })

            dataSelectedPriceByCustomer = dataSelectedPriceByCustomer.filter(item =>
                selectedProductIdList.includes(item?.['productId'])
            )
            dataSelectedPriceList[customerId] = dataSelectedPriceByCustomer
            dataScript.attr('data-selected-price', JSON.stringify(dataSelectedPriceList))

            const sumPrice = this.getSumPriceInPriceModal()

            // const $unitPrice = $(`.detail-unit-price[data-customer-id="${customerId}"]`)
            // this.loadDataPriceToTableDetail($unitPrice, sumPrice)

            this.loadTotalData()
        })
    }

    handleSelectProductInPriceModal(){
        $(document).on('click', '.price-modal-checkbox', (e)=>{
            const isChecked = $(e.currentTarget).is(':checked')
            const customerId = this.$selectPriceModal.attr('data-customer-id')
            const dataScript = $('#data-script')
            let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))
            let dataSelectedProductList = JSON.parse(dataScript.attr('data-selected-product'))
            let dataSelectedPriceByCustomer = dataSelectedPriceList[customerId] || []
            const productId = $(e.currentTarget).attr('data-product-id')

            if(!isChecked){
                dataSelectedPriceByCustomer = dataSelectedPriceByCustomer.filter((item)=>item?.['productId'] !== productId)

                dataSelectedPriceList[customerId] = dataSelectedPriceByCustomer

                dataScript.attr('data-selected-price', JSON.stringify(dataSelectedPriceList))

                const sumPrice = this.getSumPriceInPriceModal()

                $('#modal-price-sum-price').attr('data-init-money', sumPrice)
                $('#modal-price-list').empty()
                const $editButton = $(e.currentTarget).siblings('.price-modal-edit-product')
                $editButton.prop('disabled', true)
            } else {
                const selectedProduct = dataSelectedProductList.find((item)=>item?.['id'] === productId)

                const defaultPrice = selectedProduct?.['product_price_list_data'].find((item)=>item['is_default']===true)
                dataSelectedPriceByCustomer.push({
                    id: defaultPrice?.['id'],
                    value: defaultPrice?.['price'],
                    productId: selectedProduct?.['id']
                })
                dataSelectedPriceList[customerId] = dataSelectedPriceByCustomer

                dataScript.attr('data-selected-price', JSON.stringify(dataSelectedPriceList))

                const sumPrice = this.getSumPriceInPriceModal()

                $('#modal-price-sum-price').attr('data-init-money', sumPrice)

                const $editButton = $(e.currentTarget).siblings('.price-modal-edit-product')
                $editButton.prop('disabled', false)
            }

            $.fn.initMaskMoney2()
        })
    }

    handleSelectTax(){
        $(document).on('change', '#tax', (e)=>{
            const dataScript = $('#data-script')
            let dataTax = JSON.parse(dataScript.attr('data-tax')) || []

            const $row = $(e.currentTarget).closest('tr')
            const taxId = $(e.currentTarget).val()

            const tax = dataTax.find((item)=>item.id === taxId)
            const taxRate = Number(tax?.['rate'] || 0)

            const totalAmount = Number(this.$totalAmount.attr('data-init-money') || 0)

            const totalAmountVAT = totalAmount + (totalAmount * taxRate/100)

            this.$totalAmountVAT.attr('data-init-money', totalAmountVAT);

            this.loadTotalData()

            $.fn.initMaskMoney2()
        })
    }

    handleChangeMaxGuest(){
        $(document).on('change', '#max-guest', (e)=>{
            this.loadDataCustomerPrice()
            this.loadDataGuestAndCostCommonFields()
        })
    }

    handleOpenCustomerDetail(){
        $(document).on('click', '.detail-edit-row',(e)=>{
            const dataCustomerDetail = JSON.parse(decodeURIComponent($(e.currentTarget).attr('data-detail')))

            const serviceName = dataCustomerDetail?.['service_name']
            const serviceCode = dataCustomerDetail?.['register_code']
            const customerId = dataCustomerDetail?.['customer_id']
            const customerName = dataCustomerDetail?.['customer_name']
            const customerCode = dataCustomerDetail?.['customer_code']
            let registerDate = dataCustomerDetail?.['register_date'].split('-').reverse().join('-')
            const phone = dataCustomerDetail?.['phone'] ? dataCustomerDetail?.['phone'] : 'no data'
            const email = dataCustomerDetail?.['email'] ? dataCustomerDetail?.['email'] : 'no data'
            const note = dataCustomerDetail?.['note']
            const paymentStatus = dataCustomerDetail?.['payment_status']

            this.initInput(this.$canvasServiceNameInputUpdate, serviceName)
            this.initInput(this.$canvasServiceCodeInputUpdate, serviceCode)
            this.initInput(this.$canvasPhoneInputUpdate, phone)
            this.initInput(this.$canvasEmailInputUpdate, email)
            this.initInput(this.$canvasNoteInputUpdate, note)
            this.initSelect(this.$canvasCustomerSelectUpdate)
            const option = new Option(customerName, customerId, true, true)
            this.$canvasCustomerSelectUpdate.append(option).trigger('change')
            this.initInput(this.$canvasCustomerCodeInputUpdate, customerCode)
            this.initDateInput(this.$canvasRegisterDateUpdate, registerDate, false)
            this.$canvasPaymentSelectUpdate.val(paymentStatus).trigger('change')

            this.$canvasUpdateCustomerBtn.attr('data-customer-id', customerId)

            this.showOffCanvas('#offcanvas-update-customer')
        })
    }

    handleUpdateCustomer(){
        $(document).on('click', '#btn-offcanvas-update-customer',(e)=>{
            const customerId = $(e.currentTarget).attr('data-customer-id')
            let $row = $(`.detail-edit-row[data-customer-id="${customerId}"]`).closest('tr')

            const serviceName = this.$canvasServiceNameInputUpdate.val();
            const serviceCode = this.$canvasServiceCodeInputUpdate.val();
            const registerDate = this.$canvasRegisterDateUpdate.val();
            const customerName = this.$canvasCustomerSelectUpdate.find(':selected').text();
            const customerID = this.$canvasCustomerSelectUpdate.val();
            const customerCode = this.$canvasCustomerCodeInputUpdate.val();
            const phone = this.$canvasPhoneInputUpdate.val();
            const email = this.$canvasEmailInputUpdate.val();
            const paymentStatus = this.$canvasPaymentSelectUpdate.val();
            const note = this.$canvasNoteInputUpdate.val();

            const unitPrice = Number($row.find('.detail-unit-price').attr('data-init-money') || 0)
            const taxId = $row.find('.tax-select').val()
            const taxName = $row.find('.tax-select').find(':selected').text()
            const subTotal = Number($row.find('.detail-sub-total').attr('data-init-money') || 0)
            let rowData = this.$detailDataTable.DataTable().row($row).data()
            const quantity = rowData['quantity']
            const discount = rowData['discount']

            const data ={
                service_name: serviceName,
                customer_id: customerID,
                customer_code: customerCode,
                customer_name: customerName,
                register_code: serviceCode,
                register_date: registerDate,
                phone: phone,
                email: email,
                quantity: quantity,
                discount: discount,
                payment_status: paymentStatus,
                unit_price: unitPrice,
                sub_total: subTotal,
                note: note,
                isNew: false,
            }

            this.$detailDataTable.DataTable().row($row).data(data).draw()

            // const $select = $row.find('.tax-select')
            // const dataScript = $('#data-script')
            // let dataTax = JSON.parse(dataScript.attr('data-tax')) || []
            // this.initSelect($select, dataTax)
            // const newOption = new Option(taxName, taxId, true, true)
            // $select.append(newOption).trigger('change.select2')

            this.hideOffCanvas('#offcanvas-update-customer')
        })
    }

    handleDeleteCustomer(){
        $(document).on('click', '.detail-del-row',(e)=>{
            const customerId = $(e.currentTarget).attr('data-customer-id')
            let $row = $(e.currentTarget).closest('tr')
            const dataScript = $('#data-script')
            let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))

            delete dataSelectedPriceList[customerId]
            dataScript.attr('data-selected-price', JSON.stringify(dataSelectedPriceList))

            this.$detailDataTable.DataTable().row($row).remove().draw()
            this.reLoadGuestQuantity()
            this.reCalculateDataTotalCost()
            this.loadTotalData()
        })
    }

    handleChangeDiscount(){
        $(document).on('change', '.detail-discount', (e)=>{
            const $row = $(e.currentTarget).closest('tr')
            let rowData = this.$detailDataTable.DataTable().row($row).data()
            rowData['discount'] = Number($(e.currentTarget).val() || 0)

            this.$detailDataTable.DataTable().row($row).data(rowData).draw()

            this.loadDataCustomerPrice()
            this.loadTotalData()
        })
    }

    handleDeleteCostProduct(){
        $(document).on('click', '.cost-del-row',(e)=>{
            const productId = $(e.currentTarget).attr('data-product-id')
            const dataScript = $('#data-script')
            // remove product in price list
            let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))
            for (let customerId in dataSelectedPriceList){
                // change unit price of each customer in detail table
                const priceValue = dataSelectedPriceList[customerId].find((item)=> item?.['productId'] === productId)?.['value']
                const $customerCurrUnitPrice = $(`.detail-unit-price[data-customer-id="${customerId}"]`)
                const currUnitPriceValue = Number($customerCurrUnitPrice.attr('data-init-money') || 0)
                const newUnitPriceValue = currUnitPriceValue - priceValue
                this.loadDataPriceToTableDetail($customerCurrUnitPrice, newUnitPriceValue)
                dataSelectedPriceList[customerId] = dataSelectedPriceList[customerId].filter((item)=> item?.['productId'] !== productId)
            }
            dataScript.attr('data-selected-price', JSON.stringify(dataSelectedPriceList))

            // remove product in product list
            let dataSelectedProductList = JSON.parse(dataScript.attr('data-selected-product'))
            const product = dataSelectedProductList.find((item)=>item?.['id'] === productId)
            const productGeneralPrice = product?.['product_price_list_data'].find((item)=>item?.['is_default']===true)?.['price']
            dataSelectedProductList = dataSelectedProductList.filter((item)=> item?.['id'] !== productId)
            dataScript.attr('data-selected-product', JSON.stringify(dataSelectedProductList))

            // remove from cost table
            const $row = $(e.currentTarget).closest('tr')
            this.$costDataTable.DataTable().row($row).remove().draw()

            // change total cost + total general price
            const productCost = Number($row.find('.cost-sub-total').attr('data-init-money') || 0)

            const currTotalCost = Number(dataScript.attr('data-total-cost') || 0)
            const currTotalGeneralPrice = Number(dataScript.attr('data-total-general-price') || 0)

            const newTotalCost = currTotalCost - productCost
            const newTotalGeneralPrice = currTotalGeneralPrice - productGeneralPrice

            dataScript.attr('data-total-cost', newTotalCost)
            dataScript.attr('data-total-general-price', newTotalGeneralPrice)

            this.loadDataCustomerPrice()
            this.loadTotalData()
            this.$productModalDatatable.DataTable().draw();
        })
    }

    handleChangeDetailCustomerQuantity(){
        $(document).on('change', '.detail-quantity', (e) => {
            const $input = $(e.currentTarget)
            const $row = $input.closest('tr')
            let rowData = this.$detailDataTable.DataTable().row($row).data()
            const $unitPrice = $row.find('.detail-unit-price')
            const $subTotal = $row.find('.detail-sub-total')
            const value = Number($unitPrice.attr('data-init-money') || 0)
            const quantity = Number($input.val() || 1)
            $subTotal.attr('data-init-money', value * quantity)
            rowData['quantity'] = quantity
            rowData['sub_total'] = value * quantity
            this.$detailDataTable.DataTable().row($row).data(rowData).draw()

            $.fn.initMaskMoney2()
            this.loadDataCustomerPrice()
            this.loadTotalData()
        })
    }

    handleChangeCostQuantityType(){
        $(document).on('change', '.cost-quantity-radio', (e)=>{
            const $row = $(e.currentTarget).closest('tr')
            let rowData = this.$costDataTable.DataTable().row($row).data()
            const quantityType = $(e.currentTarget).attr('data-quantity-type')
            rowData['is_using_guest_quantity'] = quantityType === 'guest'
            this.$costDataTable.DataTable().row($row).data(rowData).draw()

            this.reCalculateDataTotalCost()
            this.loadDataCustomerPrice()
            this.loadTotalData()
        })
    }

    handleChangePackQuantity(){
        $(document).on('change', '.pack-quantity', (e)=>{
            const $row = $(e.currentTarget).closest('tr')
            let rowData = this.$costDataTable.DataTable().row($row).data()
            rowData['quantity'] = Number($(e.currentTarget).val() || 1)

            this.$costDataTable.DataTable().row($row).data(rowData).draw()

            this.reCalculateDataTotalCost()
            this.loadDataCustomerPrice()
            this.loadTotalData()
        })
    }

    handleChangeUnitCost(){
        $(document).on('change', '.cost-unit-cost', (e)=>{
            const $row = $(e.currentTarget).closest('tr')
            let rowData = this.$costDataTable.DataTable().row($row).data()
            rowData['unit_cost'] = Number($(e.currentTarget).attr('value') || 0)

            this.$costDataTable.DataTable().row($row).data(rowData).draw()

            this.reCalculateDataTotalCost()
            this.loadDataCustomerPrice()
            this.loadTotalData()
        })
    }

    handleAddExpense(){
        $(document).on('click', '#btn-add-expense',(e)=>{
            this.$expenseDataTable.DataTable().row.add({
                isNew: true
            }).draw()
        })
    }

    handleChangeExpense() {
        $(document).on('change', '.expense-quantity, .expense-cost, .expense-tax-select', (e) => {
            const $row = $(e.currentTarget).closest('tr');

            const $expenseQuantity = $row.find('.expense-quantity');
            const $expenseCost = $row.find('.expense-cost');
            const $expenseTax = $row.find('.expense-tax-select');
            const $subTotal = $row.find('.expense-sub-total');

            const quantity = Number($expenseQuantity.val() || 0);
            const cost = Number($expenseCost.attr('value') || 0)
            const taxId = $expenseTax.val() || 0;

            const dataScript = $('#data-script');
            const dataTax = JSON.parse(dataScript.attr('data-tax')) || [];
            const tax = dataTax.find((item) => item.id === taxId);
            const taxRate = Number(tax?.['rate'] || 0);

            const valueBeforeTax = quantity * cost;
            const valueAfterTax = valueBeforeTax + (valueBeforeTax * taxRate / 100);

            $subTotal.attr('data-init-money', valueAfterTax);
            $.fn.initMaskMoney2($subTotal);
        });
    }

    handleDeleteExpense(){
        $(document).on('click', '.expense-del-row',(e)=>{
            const $row = $(e.currentTarget).closest('tr')
            this.$expenseDataTable.DataTable().row($row).remove().draw()
        })
    }

    handleReselectDataInherit(){
        $(document).on('change', '#employee_inherit_id', (e)=>{
            const clsSelect2 = $(e.currentTarget).data('clsSelect2')
            clsSelect2.loadInfoMore($(e.currentTarget))
        })
    }

    handleChangeMarkupPercentage(){
        $(document).on('change', '#markup-percentage', (e)=>{
            this.loadDataCustomerPrice()
            this.loadTotalData()
        })
    }

    getSumPriceInPriceModal(){
        const customerId = this.$selectPriceModal.attr('data-customer-id')
        const dataScript = $('#data-script')
        let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))

        let dataSelectedPriceByCustomer = dataSelectedPriceList[customerId] || []

        let sumPrice = 0

        for (const item of dataSelectedPriceByCustomer) {
            const value = Number(item?.['value'])
            sumPrice += value
        }
        return sumPrice
    }

    hideOffCanvas(offcanvasId){
        const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasId)
        offcanvasInstance.hide()
    }

    showOffCanvas(offcanvasId){
        const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasId)
        offcanvasInstance.show()
    }

    loadDataPriceToTableDetail($detailUnitPriceSelects, value){
        $detailUnitPriceSelects.attr('data-init-money', value)
        $detailUnitPriceSelects.each((i, e)=>{
            const $subTotal = $(e).closest('tr').find('.detail-sub-total')
            const $quantityElement = $(e).closest('tr').find('.detail-quantity')

            const quantity = $quantityElement.is('input') ? $quantityElement.val() : $quantityElement.text()

            const subTotal = Number(value) * Number(quantity || 1)
            $subTotal.attr('data-init-money', subTotal)
        })
        $.fn.initMaskMoney2()
    }

    reLoadGuestQuantity(){
        const guestQuantity = this.$detailDataTable.DataTable().rows().count()
        this.$costDataTable.DataTable().rows().every(function(){
            let rowData = this.data()
            rowData['guest_quantity'] = guestQuantity
            this.data(rowData).draw()
        })
    }

    reCalculateDataTotalCost(){
        const dataScript = $('#data-script')
        let newTotalCost = 0
        this.$costDataTable.DataTable().rows().every(function(){
            let $row = $(this.node())
            let subTotal = Number($row.find('.cost-sub-total').attr('data-init-money') || 0)
            newTotalCost += subTotal
        })
        dataScript.attr('data-total-cost', newTotalCost)
        this.$totalCostInput.attr('value',newTotalCost)
        $.fn.initMaskMoney2()
    }

    calculateDetailTotalData(){
        let totalGuest = 0
        let totalAmount = 0
        let totalAmountVAT = 0
        this.$detailDataTable.DataTable().rows().every(function(){
            let row = $(this.node())
            totalGuest++
            totalAmount += Number(row.find('.detail-sub-total').attr('data-init-money') || 0)
        })
        const taxId = this.$taxSelect.val()
        if(taxId){
            const dataScript = $('#data-script')
            let dataTax = JSON.parse(dataScript.attr('data-tax')) || []
            const tax = dataTax.find((item)=>item.id === taxId)
            const taxRate = Number(tax?.['rate'] || 0)

            totalAmountVAT = totalAmount + totalAmount*taxRate/100
        }
        return {
            totalGuest,
            totalAmount,
            totalAmountVAT
        }
    }

    loadTotalData(){
        let totalValues = this.calculateDetailTotalData()

        this.$totalGuest.text(totalValues.totalGuest)
        this.$totalAmount.attr('data-init-money', totalValues.totalAmount)
        this.$totalAmountVAT.attr('data-init-money', totalValues.totalAmountVAT)

        this.loadDataGuestAndCostCommonFields()
        $.fn.initMaskMoney2()
    }

    saveSelectedProductToScript(productData){
        const dataScript = $('#data-script')
        let currSelectedProductData = JSON.parse(dataScript.attr('data-selected-product'))
        currSelectedProductData.push(productData)

        dataScript.attr('data-selected-product', JSON.stringify(currSelectedProductData))
    }

    initTaxData(){
        const dataScript = $('#data-script')
        let dataTax = JSON.parse(dataScript.attr('data-tax'))
        let url = this.$urlScript.attr('data-tax-list-url')
        $.fn.callAjax2({
                url: url,
                method:'GET',
                isLoading: true,
            }).then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('tax_list')) {
                        dataTax = data['tax_list']
                        dataScript.attr('data-tax', JSON.stringify(dataTax))
                        return dataTax
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
                })
            .then(
                (taxData) => {
                    this.initSelect(this.$taxSelect, taxData)
                    const newOption = new Option('Select...', null, true, true)
                    this.$taxSelect.append(newOption).trigger('change.select2')
                }
            )


    }

    loadDataGuestAndCostCommonFields(){
        const totalGuest = Number(this.$totalGuest.text() || 0)
        this.initInput(this.$registeredGuest, totalGuest)

        const dataScript = $('#data-script');
        let dataTotalCost = Number(dataScript.attr('data-total-cost') || 0)

        const costPerRegisterGuest = dataTotalCost / totalGuest
        this.$costPerRegisteredGuestInput.attr('value', costPerRegisterGuest)

        const maxGuest = Number(this.$maxGuestInput.val() || 0)
        const costPerGuest = dataTotalCost / maxGuest
        this.$costPerGuestInput.attr('value', costPerGuest)

        let dataSelectedProductList = JSON.parse(dataScript.attr('data-selected-product') || [])
        let planRevenue = 0
        // for (const product of dataSelectedProductList){
        //     const defaultPrice = product['product_price_list_data'].find((item)=>item['is_default']===true)
        //     planRevenue += defaultPrice?.['price']
        // }
        const markupPercentage = Number(this.$markupPercentageInput.val() || 1)/100
        const customerPrice = costPerGuest*(1+markupPercentage) | 0

        planRevenue = customerPrice * maxGuest
        this.$plannedRevenueInput.attr('value', planRevenue)

        let totalAmountPrice = this.calculateDetailTotalData().totalAmount
        this.$actualRevenueInput.attr('value', totalAmountPrice)

        $.fn.initMaskMoney2()
    }

    loadDataCustomerPrice(){
        const dataScript = $('#data-script');
        let dataTotalCost = Number(dataScript.attr('data-total-cost') || 0)
        const maxGuest = Number(this.$maxGuestInput.val() || 0)
        const costPerGuest = dataTotalCost / maxGuest
        const markupPercentage = Number(this.$markupPercentageInput.val() || 1)/100
        const customerUnitPrice = costPerGuest*(1+markupPercentage) | 0
        const table = this.$detailDataTable.DataTable()
        table.rows().every(function(){
            let rowData = this.data()
            const quantity = rowData['quantity']
            const discount = rowData['discount'] / 100
            rowData['unit_price'] = customerUnitPrice
            rowData['sub_total'] = customerUnitPrice * quantity * (1-discount)
            this.data(rowData)
        })
        table.draw()
    }

    clearDataCustomerCanvas(){
        this.$canvasServiceNameInput.val('').trigger('change')
        this.$canvasServiceCodeInput.val('').trigger('change')
        this.initDateInput(this.$canvasRegisterDate, null, false)
        this.initSelect(this.$canvasCustomerSelect)
        this.$canvasCustomerCodeInput.val('').trigger('change')
        this.$canvasPhoneInput.val('').trigger('change')
        this.$canvasEmailInput.val('').trigger('change')
        this.$canvasPaymentSelect.val(1).trigger('change')
        this.$canvasNoteInput.val('').trigger('change')
    }

    addProductGeneralPriceToEachCustomer(product){
        const dataScript = $('#data-script')
        let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))

        this.$detailDataTable.DataTable().rows().every(function(){
            const rowData = this.data()
            const customerId = rowData?.['customer_id']

            let dataSelectedPriceByCustomer = dataSelectedPriceList[customerId] || []
            const defaultPrice = product['product_price_list_data'].find((item)=>item['is_default']===true)
            dataSelectedPriceByCustomer.push({
                id: defaultPrice?.['id'],
                value: defaultPrice?.['price'],
                productId: product?.['id']
            })
            dataSelectedPriceList[customerId] = dataSelectedPriceByCustomer
        })

        dataScript.attr('data-selected-price', JSON.stringify(dataSelectedPriceList))
    }

    setupFormData(dataForm){
        let customerDetailList = []
        let costList = []
        let expenseList = []
        const dataScript = $('#data-script')
        let dataSelectedPriceList = JSON.parse(dataScript.attr('data-selected-price'))
        let dataSelectedProductList = JSON.parse(dataScript.attr('data-selected-product'))
        let dataTotalCost = dataScript.attr('data-total-cost') || 0
        let dataTotalGeneralPrice = dataScript.attr('data-total-general-price') || 0

        // get customer data
        this.$detailDataTable.DataTable().rows().every(function(rowIdx){
            let rowData = this.data()
            const $row = $(this.node())
            const customerId = rowData?.['customer_id']
            let customerPriceListSelect = dataSelectedPriceList[customerId]

            const unitPrice = Number($row.find('.detail-unit-price').attr('data-init-money') || 0)
            const subTotal = Number($row.find('.detail-sub-total').attr('data-init-money') || 0)
            // const tax = $row.find('.tax-select').val()
            rowData['unit_price'] = unitPrice
            rowData['sub_total'] = subTotal
            // rowData['tax'] = tax
            rowData['quantity'] = Number($row.find('.detail-quantity').val() || 0)
            rowData['order'] = rowIdx
            let tmpData = rowData['register_date'].split('-').reverse().join('-')
            rowData['register_date'] = tmpData
            rowData['price_list_select'] = []
            rowData['email'] = rowData['email'] === 'no data' ? null : rowData['email']
            rowData['phone'] = rowData['phone'] === 'no data' ? null : rowData['phone']
            for(const item of customerPriceListSelect){
                rowData['price_list_select'].push({
                    product_price_list: item?.['id'],
                    value: item?.['value'],
                    product: item?.['productId']
                })
            }
            customerDetailList.push(rowData)
        })
        dataForm['customer_detail_list'] = customerDetailList

        // get cost data
        this.$costDataTable.DataTable().rows().every(function(rowIdx){
            let rowData = this.data()
            const $row = $(this.node())
            const subTotal = Number($row.find('.cost-sub-total').attr('data-init-money') || 0)
            const note = $row.find('.cost-note').val()
            rowData['product'] = rowData?.['id']
            rowData['sub_total'] = subTotal
            rowData['order'] = rowIdx
            rowData['note'] = note
            costList.push(rowData)
        })
        dataForm['cost_list'] = costList

        // get expense data
        this.$expenseDataTable.DataTable().rows().every(function(rowIdx){
            let rowData = {}
            const $row = $(this.node())
            rowData['expense_name'] = $row.find('.expense-name').val()
            rowData['expense'] = $row.find('.expense-item-select').val()
            rowData['expense_uom'] = $row.find('.uom-select').val()
            rowData['quantity'] = $row.find('.expense-quantity').val()
            rowData['cost'] = $row.find('.expense-cost').attr('value')
            rowData['expense_tax'] = $row.find('.expense-tax-select').val()
            rowData['sub_total'] = $row.find('.expense-sub-total').attr('data-init-money') || 0
            rowData['order'] = rowIdx
            expenseList.push(rowData)
        })
        dataForm['expense_list'] = expenseList

        let serviceDuration = dataForm['service_duration']
        let startDate = serviceDuration.split(" - ")[0]
        let endDate = serviceDuration.split(" - ")[1]
        dataForm['service_start_date'] = startDate.split('-').reverse().join('-')
        dataForm['service_end_date'] = endDate.split('-').reverse().join('-')
        dataForm['planned_revenue'] = this.$plannedRevenueInput.attr('value') || 0
        dataForm['actual_revenue'] = this.$actualRevenueInput.attr('value') || 0
        dataForm['cost_per_guest'] = this.$costPerGuestInput.attr('value') || 0
        dataForm['cost_per_registered_guest'] = this.$costPerRegisteredGuestInput.attr('value') || 0
        dataForm['service_created_date'] = dataForm['service_created_date'].split('-').reverse().join('-')

        dataForm['total_amount'] = this.$totalAmount.attr('data-init-money') || 0
        dataForm['total_amount_including_VAT'] = this.$totalAmountVAT.attr('data-init-money') || 0

        dataForm['total_general_price'] = dataTotalGeneralPrice
        dataForm['total_cost'] = dataTotalCost
        dataForm['data_selected_price_list'] = dataSelectedPriceList
        dataForm['data_product_list'] = dataSelectedProductList
    }

    setUpFormSubmit($formSubmit){
        SetupFormSubmit.call_validate($formSubmit, {
            onsubmit: true,
            submitHandler: (form, event) => {
                let _form = new SetupFormSubmit($formSubmit);
                this.setupFormData(_form['dataForm'])
                 // WFRTControl.callWFSubmitForm(_form)
                const url = _form.dataUrl
                $.fn.callAjax2({
                    url: url,
                    method: _form.dataMethod,
                    data: _form.dataForm,
                    isLoading: true,
                }).then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                             $.fn.notifyB({
                                'description': 'Success',
                            }, 'success');
                            setTimeout(() => {
                                window.location.replace(_form.dataUrlRedirect);
                            }, 3000);
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
                    })
            }
        })
    }

    disableFields(){
        let $fields = this.$formSubmit.find('input, select, button, textarea')
        $fields = $fields.not('.close-btn')
        $fields.attr('disabled', true)
        $fields.attr('readonly', true)

        this.$detailDataTable.on('draw.dt', function() {
            let disableFields = $(this).find('button, select, input')
            disableFields = disableFields.not('.btn-select-price').not('.detail-edit-row')
            disableFields.attr('disabled', true).attr('readonly', true)
        })
        this.$costDataTable.on('draw.dt', function() {
            let disableFields = $(this).find('button, input, textarea')
            disableFields.attr('disabled', true).attr('readonly', true)
        })
        this.$expenseDataTable.on('draw.dt', function() {
            let disableFields = $(this).find('button, input, select')
            disableFields.attr('disabled', true).attr('readonly', true)
        })

        $fields = this.$selectPriceModal.find('#btn-finish')
        $fields.attr('disabled', true)
        $fields.attr('readonly', true)
    }

    fetchDetailData($formSubmit ,disabledFields=false){
        return $.fn.callAjax2({
            url: $formSubmit.attr('data-url'),
            method:'GET',
            isLoading: true
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp)
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data)
                    $.fn.compareStatusShowPageAction(data)
                    const dataScript = $('#data-script')
                    const dataTax = JSON.parse(dataScript.attr('data-tax'))
                    const isDetail = disabledFields
                    new $x.cls.bastionField().init({
                        data_inherit: [
                            {
                                "id": data?.['employee_inherit']?.['id'],
                                "full_name": data?.['employee_inherit']?.['full_name'],
                                "selected": true,
                            }
                        ]
                    })
                    const inheritOption = new Option(data?.['employee_inherit']?.['full_name'], data?.['employee_inherit']?.['id'], true, true)
                    $('#employee_inherit_id').append(inheritOption).trigger('change.select2')

                    // common fields
                    this.initInput(this.$descriptionInput, data?.['title'])
                    this.initInput(this.$orderNumberInput, data?.['order_number'])
                    this.initDateInput(
                        this.$serviceDurationInput,
                        {
                            start: data?.['service_start_date'],
                            end: data?.['service_end_date']
                        },
                        true
                    )
                    this.initDateInput(this.$createdDateInput, data?.['service_created_date'], false)
                    this.initInput(this.$maxGuestInput, data?.['max_guest'])
                    this.initInput(this.$registeredGuest, data?.['registered_guest'])
                    this.$orderStatusSelect.val(data?.['order_status'])
                    this.initSelect(this.$orderPaymentTermSelect, [data?.['payment_term']])
                    this.initInput(this.$markupPercentageInput, data?.['markup_percentage'])
                    this.initMaskMoneyInput(this.$costPerGuestInput, data?.['cost_per_guest'])
                    this.initMaskMoneyInput(this.$costPerRegisteredGuestInput, data?.['cost_per_registered_guest'])
                    this.initMaskMoneyInput(this.$plannedRevenueInput, data?.['planned_revenue'])
                    this.initMaskMoneyInput(this.$actualRevenueInput, data?.['actual_revenue'])
                    this.initMaskMoneyInput(this.$totalCostInput, data?.['total_cost'])
                    this.$totalGuest.text(data?.['registered_guest'])
                    this.$totalAmount.attr('data-init-money', data?.['total_amount'])
                    this.$totalAmountVAT.attr('data-init-money', data?.['total_amount_including_VAT'])

                    for(let item of data?.['customer_detail_list']){
                        item['isNew'] = false
                        let tmp = item['register_date'].split('-').reverse().join('-')
                        item['register_date'] = tmp
                    }
                    this.initDetailDataTable(data?.['customer_detail_list'], isDetail)
                    // this.$detailDataTable.DataTable().rows().every((rowIdx)=>{
                    //     const rowData = this.$detailDataTable.DataTable().row(rowIdx).data()
                    //     const $row = $(this.$detailDataTable.DataTable().row(rowIdx).node())
                    //     const $select = $row.find('.tax-select')
                    //     const dataTax = JSON.parse(dataScript.attr('data-tax'))
                    //     const tax = rowData['tax']
                    //     this.initSelect($select, dataTax)
                    //     const newOption = new Option(tax['title'], tax['id'], true, true)
                    //     $select.append(newOption).trigger('change.select2')
                    // })


                    this.initCostDataTable(data?.['cost_list'])
                    this.initExpenseDataTable(data?.['expense_list'])
                    this.$expenseDataTable.DataTable().rows().every((rowIdx)=>{
                        const rowData = this.$expenseDataTable.DataTable().row(rowIdx).data()
                        const $row = $(this.$expenseDataTable.DataTable().row(rowIdx).node())
                        const expenseItem = rowData?.['expense']
                        const uom = rowData?.['expense_uom']
                        const cost = rowData?.['cost']
                        const quantity = rowData?.['quantity']
                        const subTotal = rowData?.['sub_total']
                        this.initSelect($row.find('.expense-item-select'), [expenseItem])
                        this.initSelect($row.find('.uom-select'), [uom])
                        this.initMaskMoneyInput($row.find('.expense-cost'), cost)
                        this.initInput($row.find('.expense-quantity'), quantity)
                        const $taxSelect = $row.find('.expense-tax-select')
                        const tax = rowData['expense_tax']
                        this.initSelect($taxSelect, dataTax)
                        const newOption = new Option(tax['title'], tax['id'], true, true)
                        $taxSelect.append(newOption).trigger('change.select2')
                        $row.find('.expense-sub-total').attr('data-init-money', subTotal)
                    })


                    dataScript.attr('data-total-cost', data?.['total_cost'])
                    dataScript.attr('data-total-general-price', data?.['total_general_price'])
                    dataScript.attr('data-selected-product', JSON.stringify(data?.['data_product_list']))
                    dataScript.attr('data-selected-price', JSON.stringify(data?.['data_selected_price_list']))
                    const tax = data['tax']
                    this.initSelect(this.$taxSelect, dataTax)
                    const newOption = new Option(tax['title'], tax['id'], true, true)
                    this.$taxSelect.append(newOption).trigger('change.select2')

                    this.initProductModalDataTable()
                    // this.loadTotalData()
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
            })
            .finally(() => {
                if (disabledFields) {
                    this.disableFields();
                }
            })
    }
}