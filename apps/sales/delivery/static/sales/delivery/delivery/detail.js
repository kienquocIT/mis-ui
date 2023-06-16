$(async function () {
    // prod tab handle
    class prodDetailUtil {
        prodList = {}
        wareHouseList = {}

        set setProdList(data) {
            this.prodList = data
        }

        get getProdList() {
            return this.prodList
        }

        set setWarehouseList(data) {
            this.wareHouseList = data
        }

        get getWarehouseList() {
            return this.wareHouseList
        }

        contentModalHandle(idx, config, prod_data) {
            const _this = this
            let url = $('#url-factory').attr('data-warehouse-prod')
            $.fn.callAjax(url, 'get', {
                'product_id': prod_data?.product_data?.id,
                'uom_id': prod_data?.uom_data?.id
            })
                .then((req) => {
                    const isKey = `${prod_data?.product_data?.id}.${prod_data?.uom_data?.id}`
                    let temp = _this.getWarehouseList
                    const res = $.fn.switcherResp(req);
                    const table = $('#productStockDetail')
                    let isData = res.warehouse_stock
                    temp[isKey] = isData
                    _this.setWarehouseList = temp
                    // nếu có hoạt động picking kiểm tra có thông tin delivery_data ko.
                    // nếu có tạo thêm key là picked. mục đích show lên popup mục get cho user thấy
                    let delivery = prod_data?.delivery_data;
                    let listConvert_config1 = []
                    for (let [idx, item] of isData.entries()){
                        item.picked = 0
                        if (!config.is_picking && !config.is_partial_ship){
                            // config 1, 2
                            if (delivery)
                                for (const val of delivery){
                                    if (val.warehouse === item.id
                                        && val.uom === prod_data.uom_data.id
                                    )
                                    item.picked = val.stock
                                }
                        }
                        else if (config.is_picking && !config.is_partial_ship && delivery){
                            // config 3
                                item.product_amount = 0
                                for (const val of delivery){
                                    if (val.warehouse === item.id
                                        && val.uom === prod_data.uom_data.id
                                    ){
                                        item.product_amount += val.stock
                                        item.picked += val.stock
                                    }
                                }
                        }
                        listConvert_config1.push(item)
                    }
                    isData = listConvert_config1
                    table.not('.dataTable').DataTable({
                        data: isData,
                        searching: false,
                        ordering: false,
                        paginate: false,
                        info: false,
                        columns: [
                            {
                                targets: 0,
                                class: 'w-15 text-center',
                                data: 'code',
                                render: (row, type, data) => {
                                    return `<p>${row}</p>`;
                                }
                            },
                            {
                                targets: 1,
                                class: 'w-45 text-center',
                                data: 'title',
                                render: (row, type, data) => {
                                    return `<p>${row}</p>`;
                                }
                            },
                            {
                                targets: 2,
                                class: 'w-25 text-center',
                                data: 'product_amount',
                                render: (row, type, data) => {
                                    if (data.picked_ready > 0)
                                        return `<p>${row}&nbsp;&nbsp;&nbsp;(${data.picked_ready})`
                                    return `<p>${row}</p>`;
                                }
                            },
                            {
                                targets: 3,
                                class: 'w-15 text-center',
                                data: 'picked',
                                render: (row, type, data, meta) => {
                                    const disabled = data.product_amount <= 0 ? 'disabled' : '';
                                    return `<input class="form-control" ${config.is_picking? 'readonly': ''} type="number" id="warehouse_stock-${meta.row}" value="${row}" ${disabled}>`;
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
                        },
                        footerCallback: function (row, data, start, end, display) {
                            var api = this.api();

                            // Remove the formatting to get integer data for summation
                            var intVal = function (i) {
                                return typeof i === 'string' ? i.replace(/[\$,]/g, '') * 1 : typeof i === 'number' ? i : 0;
                            };

                            // Total over this page
                            const allStock = api
                                .column(2, {page: 'current'})
                                .data()
                                .reduce(function (a, b) {
                                    return intVal(a) + intVal(b);
                                }, 0);


                            const GetStock = api
                                .column(3, {page: 'current'})
                                .data()
                                .reduce(function (a, b) {
                                    return intVal(a) + intVal(b);
                                }, 0);
                            // Update footer
                            $(api.column(2).footer()).html(`<b><i>${allStock}</i></b>`);
                            $(api.column(3).footer()).html(`<b><i>${GetStock}</i></b>`);
                        },
                    })
                    if (table.hasClass('dataTable')) {
                        table.DataTable().clear().draw();
                        table.DataTable().rows.add(isData).draw();
                    }
                    $('#warehouseStockModal').modal('show');
                    $('#save-stock').off().on('click', function (e) {
                        let isSelected = table.DataTable().data().toArray()
                        let temp_picked = 0
                        let sub_delivery_data = []
                        for (let item of isSelected) {
                            if (item.picked > 0){
                                sub_delivery_data.push({
                                    'warehouse': item.id,
                                    'uom': prod_data.uom_data.id,
                                    'stock': item.picked
                                })
                                temp_picked += item.picked
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
                            let is_gift = ''
                            if (data.is_promotion)
                                is_gift = '<span class="ml-2"><i class="fa-solid fa-gift text-gift"></i></span>'
                            let html = `<div class="input-group">
                                            <div class="dropdown pointer mr-2">
                                                <i class="fas fa-info-circle text-blue"
                                                   data-bs-toggle="dropdown"
                                                   data-dropdown-animation
                                                   aria-haspopup="true"
                                                   aria-expanded="false"></i>
                                                <div class="dropdown-menu w-210p mt-2">${dataCont}</div>
                                            </div>
                                            <p>${row.title}</p>${is_gift}
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
                            if (delivery_config.is_picking && !delivery_config.is_partial_ship){
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
                        class: 'w-15 text-center',
                        render: (row, type, data, meta) => {
                            const isDisabled = ''
                            let quantity = 0
                            if (data.picked_quantity) quantity = data.picked_quantity
                            // if (parseInt($('[name="state"]').val()) === 2)
                            // quantity = data.delivery_quantity
                            let html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                + `<p id="prod_row-${meta.row}">${quantity}<p/>`
                                + `<button type="button" class="btn btn-flush-primary btn-animated select-prod">`
                                +`<i class="bi bi-three-dots font-3 ${isDisabled}"></i></button></div>`;
                            if (delivery_config.is_picking && !delivery_config.is_partial_ship)
                                html = `<p class="text-center">${quantity}<p/>`
                            return html
                        }
                    },
                ],
                rowCallback(row, data, index) {
                    $('td:eq(0)', row).html(index + 1)
                    // delivery modal popup
                    $(`button.select-prod`, row).off().on('click', function (e) {
                        e.preventDefault()
                        e.stopPropagation()
                        _this.contentModalHandle(index, delivery_config, data)
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
                const $trans = $('#trans-factory');
                const $url = $('#url-factory');
                const res = $.fn.switcherResp(req);
                const $saleOrder = $('#inputSaleOrder');
                $saleOrder.val(res.sale_order_data.title)
                $('.title-code').text(res.code)
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
                if (res.state !== undefined && Number.isInteger(res.state)) {
                    const stateMap = {
                        0: 'warning',
                        1: 'info',
                        2: 'success',
                    }
                    let templateEle = `<span class="badge badge-${stateMap[res.state]} badge-outline">`
                        + `${$trans.attr('data-state-' + stateMap[res.state])}</span>`;
                    $('#state').html(templateEle);
                    if (res.state === 2){
                        $('#config-one-all').attr('disabled', true)
                        $('button[type="submit"]').attr('disabled', true)
                        $('#save-stock').attr('disabled', true)
                    }
                }
                $('#textareaRemarks').val(res.remarks)
                prodTable.setProdList = res.products
                $('#request-data').text(JSON.stringify(res))
                // run table
                prodTable.initTableProd()
                $('#textareaShippingAddress').val(res.sale_order_data?.shipping_address)
                $('#textareaBilling').val(res.sale_order_data?.billing_address)
                $('#input-attachment').val(res.attachments)
                if (res.remaining_quantity === res.ready_quantity && res.state < 2){
                    if($('#config-three-all').length) $('#config-three-all').attr('disabled', false)
                    $('button[form="delivery_form"]').attr('disabled', false)
                }
            })
    };

    function formSubmit() {
        const $form = $('#delivery_form')
        $form.on('submit', function (e) {
            e.preventDefault();
            const $storedData = JSON.parse($('#request-data').text())
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
            putData['order_delivery'] = $storedData.order_delivery
            putData['state'] = $storedData.state
            putData['times'] = $storedData['times']
            putData['delivery_quantity'] = $storedData.delivery_quantity
            putData['delivered_quantity_before'] = $storedData.delivered_quantity_before
            putData['remaining_quantity'] = $storedData.remaining_quantity
            putData['ready_quantity'] = $storedData.ready_quantity
            putData['is_updated'] = $storedData.is_updated
            let prodSub = []
            for (prod of prodTable.getProdList) {
                if (prod.picked_quantity > 0)
                    prodSub.push({
                        'product_id': prod.product_data.id,
                        'done': prod.picked_quantity,
                        'delivery_data': prod.delivery_data,
                        'order': prod.order,
                    })
            }
            if (!prodSub || !prodSub.length) {
                $.fn.notifyPopup({description: $transElm.attr('data-error-done')}, 'failure')
                return false
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
    $('input[type=text].date-picker').daterangepicker({
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

    // quick pick product form one warehouse
    async function handleOnClickDone(){
        const tableData = prodTable.getProdList
        const callableWarehouse = prodTable.getWarehouseList
        for (const item of tableData){
            const key = `${item.product_data.id}.${item.uom_data.id}`;
            let prodCheck = []
            if (callableWarehouse.hasOwnProperty(key)) prodCheck = callableWarehouse[key]
            else{
                const listPromise = await $.fn.callAjax(
                    $('#url-factory').attr('data-warehouse-prod'),
                    'GET',
                    {'product_id': item.product_data.id, 'uom_id': item.uom_data.id}
                )
                if (listPromise.data.status === 200){
                    prodCheck = listPromise.data.warehouse_stock
                }
            }
            let flag = false
            item.picked_quantity = 0
            item.delivery_data = []
            for (const value of prodCheck){
                if (item.picked_quantity !== item.delivery_quantity){
                    // kiem tra pick chưa đủ
                    const remain = item.delivery_quantity - item.picked_quantity
                    if(value.product_amount > 0){
                        let temp = {
                            'warehouse': value.id,
                            'uom': item.uom_data.id,
                            'stock': 0
                        }
                        if (value.product_amount >= remain){
                            temp.stock = remain
                            item.picked_quantity += remain
                        }
                        else{
                            temp.stock = value.product_amount
                            item.picked_quantity += value.product_amount
                        }
                        item.delivery_data.push(temp)
                        if (item.picked_quantity === item.delivery_quantity){
                            flag= true
                            break
                        }
                    }
                }
            }
            if(!flag){
                $.fn.notifyPopup({description: $('#trans-factory').attr('data-outstock')}, 'failure')
            }
        }
        prodTable.setProdList = tableData
        $('#dtbPickingProductList').DataTable().clear().rows.add(tableData).draw();
    }
    $('#config-one-all').off().on('click', function(e){
        e.preventDefault()
        handleOnClickDone()
    })

    // quick select config 3
    $('#config-three-all').off().on('click', function(e){
        e.preventDefault()
        const tableData = prodTable.getProdList
        for (let item of tableData){
            item.picked_quantity = item.ready_quantity
        }
        prodTable.setProdList = tableData
        $('#dtbPickingProductList').DataTable().clear().rows.add(tableData).draw();
    });
}, (jQuery));
