$(function () {
    // prod tab handle
    class prodDetailUtil {
        prodList = {}

        set setProdList(data) {
            this.prodList = data
        }

        get getProdList() {
            return this.prodList
        }

        contentModalHandle(prodID, idx, config, prod_data) {
            const _this = this
            let url = $('#url-factory').attr('data-warehouse-prod')
            $.fn.callAjax(url, 'get', {'product': prodID})
                .then((req) => {
                    const res = $.fn.switcherResp(req);
                    const table = $('#productStockDetail')
                    let isData = res.warehouse_stock.filter((item) => item.stock > 0)
                    if (config.is_picking){
                        let delivery = prod_data?.delivery_data;
                        let listConvert_config1 = []
                        for (let item of isData){
                            if (delivery.hasOwnProperty(item.warehouse.id)){
                                item.stock = delivery[item.warehouse.id]
                                item.picked = delivery[item.warehouse.id]
                                listConvert_config1.push(item)
                            }
                        }
                        isData = listConvert_config1
                    }
                    table.not('.dataTable').DataTable({
                        data: isData,
                        searching: false,
                        ordering: false,
                        paginate: false,
                        info: false,
                        columns: [
                            {
                                targets: 0,
                                class: 'w-20 text-center',
                                data: 'warehouse',
                                render: (row, type, data) => {
                                    return `<p>${row?.code}</p>`;
                                }
                            },
                            {
                                targets: 1,
                                class: 'w-50 text-center',
                                data: 'warehouse',
                                render: (row, type, data) => {
                                    return `<p>${row?.title}</p>`;
                                }
                            },
                            {
                                targets: 2,
                                class: 'w-15 text-center',
                                data: 'stock',
                                render: (row, type, data) => {
                                    return `<p>${row}</p>`;
                                }
                            },
                            {
                                targets: 3,
                                class: 'w-15 text-center',
                                render: (row, type, data, meta) => {
                                    return `<input class="form-control" ${config.is_picking? 'readonly': ''} type="number" id="warehouse_stock-${meta.row}" value="${data.picked}">`;
                                }
                            },
                        ],
                        rowCallback(row, data, index) {
                            $(`input.form-control`, row).on('blur', function (e) {
                                e.preventDefault();
                                const val = parseInt(this.value)
                                let current = data
                                if (val > 0) {
                                    current.picked = val
                                    table.DataTable().row(index).data(current).draw();
                                }
                            })
                        }
                    })
                    if (table.hasClass('dataTable')) {
                        table.DataTable().clear().draw();
                        table.DataTable().rows.add(isData).draw();
                    }
                    $('#warehouseStockModal').modal('show');
                    $('#save-stock').off().on('click', function (e) {
                        let isSelected = table.DataTable().data().toArray()
                        let temp_picked = 0
                        let sub_delivery_data = {}
                        for (let item of isSelected) {
                            if (item.picked > 0){
                                temp_picked += item.picked
                                sub_delivery_data[item.warehouse.id] = item.picked
                            }
                        }
                        let tableTargetData = _this.getProdList
                        tableTargetData[idx]['picked_quantity'] = temp_picked
                        tableTargetData[idx]['delivery_data'] = sub_delivery_data
                        _this.setProdList = tableTargetData
                        let targetTable = $('#dtbPickingProductList')
                        targetTable.DataTable().row(idx).data(tableTargetData[idx]).draw()
                        $('#warehouseStockModal').modal('hide');
                    })
                })
        }



        initTableProd() {
            const _this = this
            let $table = $('#dtbPickingProductList');
            const delivery_config = JSON.parse($('#delivery_config').text())
            $table.DataTable({
                searching: false,
                ordering: false,
                paginate: false,
                data: this.getProdList,
                columns: [
                    {
                        targets: 0,
                        class: 'w-5',
                        defaultContent: '',
                    },
                    {
                        targets: 1,
                        class: 'w-30',
                        data: 'product_data',
                        render: (row, type, data) => {
                            const dataCont = DataTableAction.item_view(row, $('#url-factory').attr('data-prod-detail'))
                            let html = `<div class="input-group">
                                            <div class="dropdown pointer mr-2">
                                                <i class="fas fa-info-circle "
                                                   data-bs-toggle="dropdown"
                                                   data-dropdown-animation
                                                   aria-haspopup="true"
                                                   aria-expanded="false"></i>
                                                <div class="dropdown-menu w-210p mt-2">${dataCont}</div>
                                            </div>
                                            <p>${row.title}</p>
                                        </div>`
                            return html;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-10 text-center',
                        render: (row, type, data) => {
                            return `<p>${data.uom_data.title}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        class: 'w-10 text-center',
                        render: (row, type, data) => {
                            return `<p>${data.delivery_quantity}</p>`;
                        }
                    },
                    {
                        targets: 4,
                        class: 'w-10 text-center',
                        visible: delivery_config.is_partial_ship,
                        render: (row, type, data) => {
                            return `<p>${data.delivered_quantity_before}</p>`;
                        }
                    },
                    {
                        targets: 5,
                        class: 'w-10 text-center',
                        visible: delivery_config.is_partial_ship,
                        render: (row, type, data) => {
                            return `<p>${data.remaining_quantity}</p>`;
                        }
                    },
                    {
                        targets: 6,
                        class: 'w-10 text-center',
                        visible: delivery_config.is_picking,
                        data: 'ready_quantity',
                        render: (row, type, data, meta) => {
                            let html = `<p>${row}</p>`;
                            if (delivery_config.is_picking){
                                html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                + `<p id="ready_row-${meta.row}">${row}<p/>`
                                + `<button type="button" class="btn btn-flush-primary btn-animated select-prod" `
                                +`data-idx="${meta.row}" data-id="${data.product_data.id}">`
                                +`<i class="bi bi-three-dots font-3"></i></button></div>`;
                            }
                            return html
                        }
                    },
                    {
                        targets: 7,
                        class: `w-15 ${delivery_config.is_picking && !delivery_config.is_partial_ship ? 'text-center': ''}`,
                        render: (row, type, data, meta) => {
                            const isDisabled = ''
                            let quantity = 0
                            if (data.picked_quantity) quantity = data.picked_quantity
                            let html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                + `<p id="prod_row-${meta.row}">${quantity}<p/>`
                                + `<button type="button" class="btn btn-flush-primary btn-animated select-prod" `
                                +`data-idx="${meta.row}" data-id="${data.product_data.id}">`
                                +`<i class="bi bi-three-dots font-3 ${isDisabled}"></i></button></div>`;
                            if (delivery_config.is_picking && !delivery_config.is_partial_ship)
                                html = `<p class="text-center">${quantity}<p/>`
                            return html
                        }
                    },
                ],
                rowCallback(row, data, index) {
                    $('td:eq(0)', row).html(index + 1)
                    // done click
                    $(`button.select-prod`, row).off().on('click', function (e) {
                        e.preventDefault()
                        const prodID = $(this).attr('data-id');
                        const idx = $(this).attr('data-idx');
                        _this.contentModalHandle(prodID, idx, delivery_config, data)
                    })
                }
            });
        }

    }

    let prodTable = new prodDetailUtil();

    function getPageDetail() {
        const $form = $('#delivery_form')
        $.fn.callAjax($form.attr('data-url'), 'get')
            .then((req) => {
                const $trans = $('#trans-factory')
                const $url = $('#url-factory')
                const res = $.fn.switcherResp(req);
                const $saleOrder = $('#inputSaleOrder')
                $saleOrder.val(res.sale_order_data.title)
                $saleOrder.attr('value', res.sale_order_data.id)
                if (res.estimated_delivery_date) {
                    const deliveryDate = moment(res.estimated_delivery_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY hh:mm A')
                    $('#inputDeliveryDate').val(deliveryDate)
                }
                if (res.actual_delivery_date) {
                    const actualDate = moment(res.actual_delivery_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY hh:mm A')
                    $('#inputActualDate').val(actualDate)
                }
                if (res.customer_data) {
                    const $cusID = $('#customer_id')
                    $cusID.attr(res.customer_data.id)
                    $cusID.val(res.customer_data.title)
                    const cusContent = DataTableAction.item_view(res.customer_data, $url.attr('data-customer'))
                    $cusID.prev().find('.dropdown-menu').html(cusContent)
                }
                if (res.contact_data) {
                    const $conID = $('#contact_id')
                    $conID.attr('value', res.contact_data.id)
                    $conID.val(res.contact_data.title)
                    const conContent = DataTableAction.item_view(res.contact_data, $url.attr('data-contact'))
                    $conID.prev().find('.dropdown-menu').html(conContent)
                }
                $('#inputState').val(res.state)
                if (res.state !== undefined && Number.isInteger(res.state)) {
                    const stateMap = {
                        0: 'info',
                        1: 'warning',
                        2: 'success',
                        3: 'primary'
                    }
                    let templateEle = `<span class="badge badge-${stateMap[res.state]} badge-outline">`
                        + `${$trans.attr('data-state-' + stateMap[res.state])}</span>`;
                    $('#state').html(templateEle);
                    $('[name="state"]').val(res.state)
                }
                $('#textareaRemarks').val(res.remarks)
                prodTable.setProdList = res.sub.products
                // run table
                prodTable.initTableProd()
                $('#delivery_opt').val(res.delivery_option)
                $('#sub_id').val(res?.sub?.id)
                $('#textareaShippingAddress').val(res.sale_order_data?.shipping_address)
                $('#textareaBilling').val(res.sale_order_data?.billing_address)
                $('#input-attachment').val(res.attachments)
            })
    };

    function formSubmit() {
        const $form = $('#delivery_form')
        $form.on('submit', function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit($form);
            const csr = $("[name=csrfmiddlewaretoken]").val();
            let putData = {}
            putData['estimated_delivery_date'] = moment(
                _form.dataForm['estimated_delivery_date'],
                'DD/MM/YYYY hh:mm A'
            ).format('YYYY-MM-DD hh:mm:ss')
            putData['actual_delivery_date'] = moment(
                _form.dataForm['actual_delivery_date'],
                'DD/MM/YYYY hh:mm A'
            ).format('YYYY-MM-DD hh:mm:ss')
            putData['remarks'] = _form.dataForm['remarks']
            putData['kind_pickup'] = 0
            putData['sale_order_id'] = $('#inputSaleOrder').attr('value')
            putData['sub_id'] = $('#sub_id').attr('value')
            putData['delivery_option'] = parseInt($('#delivery_opt').attr('value'))
            let prodSub = []
            for (prod of prodTable.getProdList) {
                if (prod.picked_quantity > 0)
                    prodSub.push({
                        'product_id': prod.product_data.id,
                        'done': prod.picked_quantity,
                        'delivery_data': prod.delivery_data
                    })
            }
            putData.products = prodSub
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, putData, csr)
                .then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.detail}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                )
                .catch((err) => {
                    console.log(err)
                })
        })
    }

    // run get detail func
    getPageDetail()
    // run datetimepicker
    $('input[type=text].date-picker').dateRangePickerDefault({
        minYear: 1901,
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        // "cancelClass": "btn-secondary",
        // maxYear: parseInt(moment().format('YYYY'), 10)
        locale: {
            format: 'DD/MM/YYYY hh:mm A'
        }
    })
    // handle before form submit
    formSubmit()
}, (jQuery));
