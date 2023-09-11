$(async function () {
    const $trans = $('#trans-factory');
    const $url = $('#url-factory');
    // prod tab handle
    class prodDetailUtil {
        prodList = {}
        wareHouseList = {}
        prodConfig = {}

        set setProdList(data) {
            this.prodList = data
        }

        set setProdConfig(config) {
            this.prodConfig = config
        }

        get getProdList() {
            return this.prodList
        }

        get getProdConfig() {
            return this.prodConfig
        }

        set setWarehouseList(data) {
            this.wareHouseList = data
        }

        get getWarehouseList() {
            return this.wareHouseList
        }

        contentModalHandle(idx, config, prod_data) {
            const _this = this
            let url = $url.attr('data-warehouse-prod')

            $.fn.callAjax2({
                'url': url,
                'method': 'get',
                'data': {
                    'product_id': prod_data?.product_data?.id,
                    'uom_id': prod_data?.uom_data?.id
                }

            }).then((req) => {
                const isKey = `${prod_data?.product_data?.id}.${prod_data?.uom_data?.id}`
                let temp = _this.getWarehouseList
                const res = $.fn.switcherResp(req);
                const table = $('#productStockDetail')
                let isData = res.warehouse_stock
                temp[isKey] = isData
                _this.setWarehouseList = temp
                // nếu có hoạt động picking kiểm tra có thông tin delivery_data ko.
                // nếu có tạo thêm key là picked. mục đích show lên popup mục get cho user thấy.
                let delivery = prod_data?.delivery_data;
                let newData = []
                for (let [idx, item] of isData.entries()) {
                    item.picked = 0
                    if (!config.is_picking && !config.is_partial_ship) {
                        // config 1, 2
                        if (delivery)
                            for (const val of delivery) {
                                if (val.warehouse === item.id
                                    && val.uom === prod_data.uom_data.id
                                )
                                    item.picked = val.stock
                            }
                    }
                    else if ((config.is_picking && !config.is_partial_ship) && delivery) {
                        // config 3
                        item.product_amount = 0
                        for (const val of delivery) {
                            if (val.warehouse === item.id
                                && val.uom === prod_data.uom_data.id
                            ) {
                                item.product_amount += val.stock
                                item.picked += val.stock
                            }
                        }
                    }
                    else if ((config.is_picking && config.is_partial_ship) && delivery) {
                        // config 4
                        // nếu ready quantity > 0 => có hàng để giao
                        // lấy delivery
                        if (prod_data.ready_quantity > 0) {
                            for (const val of delivery) {
                                if (val.warehouse === item.id
                                    && val.uom === prod_data.uom_data.id
                                ) {
                                    item.product_amount = prod_data.ready_quantity
                                    item.picked = prod_data.ready_quantity
                                    if (prod_data.picked_quantity) item.picked = prod_data.picked_quantity
                                }
                            }
                        }
                    }
                    newData.push(item)
                }
                table.not('.dataTable').DataTableDefault({
                    data: newData,
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
                                return `<p>${row}</p>`;
                            }
                        },
                        {
                            targets: 3,
                            class: 'w-15 text-center',
                            data: 'picked',
                            render: (row, type, data, meta) => {
                                let disabled = data.product_amount <= 0 ? 'disabled' : '';
                                // condition 1 for config 3, condition 2 for config 4
                                if (config.is_picking && !config.is_partial_ship ||
                                    (config.is_picking && config.is_partial_ship && data.picked_ready === 0)
                                ) disabled = 'disabled'
                                return `<input class="form-control" type="number" id="warehouse_stock-${meta.row}" value="${row}" ${disabled}>`;
                            }
                        },
                    ],
                    rowCallback(row, data, index) {
                        $(`input.form-control`, row).on('blur', function (e) {
                            e.preventDefault();
                            if (this.value > 0) {
                                data.picked = this.value
                                table.DataTable().row(index).data(data).draw();
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
                    table.DataTable().rows.add(newData).draw();
                }
                $('#warehouseStockModal').modal('show');
                $('#save-stock').off().on('click', function (e) {
                    let isSelected = table.DataTable().data().toArray()
                    let temp_picked = 0
                    let sub_delivery_data = []
                    for (let item of isSelected) {
                        const picked = parseFloat(item.picked)
                        if (picked > 0) {
                            sub_delivery_data.push({
                                'warehouse': item.id,
                                'uom': prod_data.uom_data.id,
                                'stock': picked
                            })
                            temp_picked += picked
                        }
                    }
                    if (temp_picked > 0) {
                        // lấy hàng từ popup warehouse add vào danh sách product detail
                        let tableTargetData = _this.getProdList
                        tableTargetData[idx]['picked_quantity'] = temp_picked
                        tableTargetData[idx]['delivery_data'] = sub_delivery_data
                        _this.setProdList = tableTargetData
                        let targetTable = $('#dtbPickingProductList')
                        targetTable.DataTable().row(idx).data(tableTargetData[idx]).draw()
                    }
                    $('#warehouseStockModal').modal('hide');
                })
            })
        }

        initTableProd() {
            const _this = this
            let $table = $('#dtbPickingProductList');
            const delivery_config = this.getProdConfig
            $table.DataTableDefault({
                info: false,
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
                            const dataCont = DataTableAction.item_view(row, $url.attr('data-prod-detail'))
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
                            if (delivery_config.is_picking && !delivery_config.is_partial_ship) {
                                html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                    + `<p id="ready_row-${meta.row}">${row}<p/>`
                                    + `<button type="button" class="btn btn-flush-primary btn-animated select-prod" `
                                    + `data-idx="${meta.row}" data-id="${data.product_data.id}">`
                                    + `<i class="fa-solid fa-ellipsis"></i></button></div>`;
                            }
                            if (!data?.is_not_inventory){
                                html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                    + `<p id="ready_row-${meta.row}">${row}<p/>`
                                    + `<button type="button" class="btn btn-flush-primary btn-icon" disabled>`
                                    + `<i class="fa-solid fa-ellipsis"></i></button></div>`;
                            }
                            return html
                        }
                    },
                    {
                        targets: 7,
                        class: 'w-15 text-center',
                        render: (row, type, data, meta) => {
                            let quantity = 0
                            if (data.picked_quantity) quantity = data.picked_quantity
                            let html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                + `<p id="prod_row-${meta.row}">${quantity}<p/>`
                                + `<button type="button" class="btn btn-flush-primary btn-animated select-prod">`
                                + `<i class="fa-solid fa-ellipsis"></i></button></div>`;
                            if (delivery_config.is_picking && !delivery_config.is_partial_ship)
                                html = `<p class="text-center">${quantity}<p/>`
                            if (!data?.is_not_inventory){
                                html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                + `<input type="number" class="form-control w-100p services_input" id="prod_row-${meta.row}" value="${quantity}">`
                                + `<button type="button" class="btn" disabled>`
                                + `<i class="fa-solid fa-ellipsis"></i></button></div>`;
                            }
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
                    $(`input.services_input`, row).off().on('blur', function () {
                        if (parseFloat(this.value) > data.remaining_quantity){
                            $.fn.notifyB({
                                    description: $trans.attr('data-error-picked-quantity')
                                },
                                'failure')
                            return false
                        }
                        data.picked_quantity = parseFloat(this.value)
                        return true
                    })
                }
            });
        }

        static modalLogistics(customerID) {
            $.fn.callAjax2({
                url: $url.attr('data-customer-detail').format_url_with_uuid(customerID),
                method: 'GET'
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                data = data['account_detail']
                // handle event modal show via btn click
                $('#modal_choise_logistics').on('shown.bs.modal', function (e) {
                    let dataLogistics
                    // show address else show billing
                    if ($(e.relatedTarget).attr('data-is-address')){
                        dataLogistics = data?.shipping_address
                        $(this).find('.modal-body').attr('data-logistic', 'address')
                    }
                    else{
                        dataLogistics = data?.billing_address
                        $(this).find('.modal-body').attr('data-logistic', 'bill')
                    }
                    let htmlTemp = ''
                    for (let item of dataLogistics){
                        htmlTemp += `<div class="col mb-3 text-right txt-cl-black wrap_logistic"><textarea disabled class="form-control mb-2 txt-cl-black" data-id="${
                            item?.id ? item.id : item
                        }">${item?.full_address ? item.full_address : item}</textarea><button class="btn btn-primary btn_logistics_choise">${
                            $trans.attr('data-select_address')}</button></div>`
                    }
                    $(this).find('.modal-body').html(htmlTemp)
                    $('.wrap_logistic button', $(this).find('.modal-body')).on('click', function () {
                        let val = $(this).parents('.wrap_logistic').find('textarea').val()
                        if ($(this).closest('.modal-body').attr('data-logistic') === 'address') {
                            $('#textareaShippingAddress').val(val)
                        } else {
                            $('#textareaBilling').val(val)
                        }
                        $('#modal_choise_logistics').modal('hide')
                    });
                });
            },
                (err) => console.log(err)
            );
        }
    }

    let prodTable = new prodDetailUtil();

    // base on config setup HTML show hide default
    function prepareHTMLConfig(config) {
        const $htmlElm = $('.html-table-title')
        const $titleTable = $('.table-handle-btn')
        // button html
        if (config.is_picking) $('button[form="delivery_form"]').attr('disabled', true)

        // table setup
        if (!config.is_picking && !config.is_partial_ship) $titleTable.html($('.case-01', $htmlElm).html())
        else if (config.is_picking && !config.is_partial_ship) $titleTable.html($('.case-02', $htmlElm).html())
        else $titleTable.html($('.case-03', $htmlElm).html())
    }

    function getPageDetail() {
        const $form = $('#delivery_form')
        $.fn.callAjax2({
            'url': $form.attr('data-url'),
            'method': 'GET'
        })
            .then((req) => {

                const res = $.fn.switcherResp(req);
                prepareHTMLConfig(res.config_at_that_point)

                const $saleOrder = $('#inputSaleOrder');
                $saleOrder.val(res.sale_order_data.code)
                $('.title-code').text(res.code)

                if (res.estimated_delivery_date) {
                    const deliveryDate = moment(res.estimated_delivery_date, 'YYYY-MM-DD hh:mm:ss').format(
                        'DD/MM/YYYY hh:mm A')
                    $('#inputDeliveryDate').val(deliveryDate)
                }
                if (res.actual_delivery_date) {
                    const actualDate = moment(res.actual_delivery_date, 'YYYY-MM-DD hh:mm:ss').format(
                        'DD/MM/YYYY hh:mm A')
                    $('#inputActualDate').val(actualDate)
                }
                if (res.customer_data) {
                    const $cusID = $('#customer_id')
                    $cusID.attr(res.customer_data.id)
                    $cusID.val(res.customer_data.title)
                    const cusContent = DataTableAction.item_view(res.customer_data, $url.attr('data-customer'))
                    $cusID.prev().find('.dropdown-menu').html(cusContent)
                    prodDetailUtil.modalLogistics(res.customer_data.id, res.sale_order_data)
                    $('#textareaShippingAddress').val(res.delivery_logistic?.shipping_address ||
                        res.sale_order_data?.shipping_address?.address)
                    $('#textareaBilling').val(res.delivery_logistic?.billing_address ||
                        res.sale_order_data?.billing_address?.bill)
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
                    if (res.state === 2) {
                        $('#config-one-all').attr('disabled', true)
                        $('button[type="submit"]').attr('disabled', true)
                        $('#save-stock').attr('disabled', true)
                    }
                }
                if (res?.employee_inherit){
                    $('#selectEmployeeInherit').initSelect2().val(res.employee_inherit.id).trigger('change')
                }
                $('#textareaRemarks').val(res.remarks)
                prodTable.setProdList = res.products
                prodTable.setProdConfig = res.config_at_that_point

                $('#request-data').text(JSON.stringify(res))
                // run table
                prodTable.initTableProd()
                if (res.attachments){
                    const fileDetail = res.attachments[0]?.['files']
                    FileUtils.init($(`[name="attachments"]`).siblings('button'), fileDetail);
                }
                if (res.remaining_quantity === res.ready_quantity && res.state < 2) {
                    if ($('#config-three-all').length) $('#config-three-all').attr('disabled', false)
                }
                if (res.ready_quantity > 0 && res.state < 2) $('button[form="delivery_form"]').attr('disabled', false)

                WFRTControl.setWFRuntimeID(res?.['workflow_runtime_id']);

                // after prepare HTML run event click button done
                btnDoneClick()
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
            if (_form.dataForm['estimated_delivery_date'])
                putData['estimated_delivery_date'] = moment(
                    _form.dataForm['estimated_delivery_date'],
                    'DD/MM/YYYY hh:mm A'
                ).format('YYYY-MM-DD hh:mm:ss')
            if (_form.dataForm['actual_delivery_date'])
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
            putData['attachments'] = $('[name="attachments"]').val()
            putData['delivery_logistic'] = {
                "shipping_address": $('#textareaShippingAddress').val(),
                "billing_address": $('#textareaBilling').val(),
            }

            putData['employee_inherit_id'] = $('#selectEmployeeInherit').val()

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
            if (!prodSub.length && $('#wrap-employee_inherit').attr('data-is_lead').toLowerCase() !== 'true') {
                // ko co and ko fai lead
                $.fn.notifyB({description: $trans.attr('data-error-done')}, 'failure')
                return false
            }
            else putData.products = prodSub
            $.fn.callAjax2({
                'url': _form.dataUrl,
                'method': _form.dataMethod,
                'data': putData
            })
                .then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.detail}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    }
                )
                .catch((err) => console.log(err))
        })
    }

    // widget button click done
    function btnDoneClick(){
        $('#config-one-all').off().on('click', function (e) {
            e.preventDefault()
            handleOnClickDone()
        })

        // quick select config 3
        $('#config-three-all').off().on('click', function (e) {
            e.preventDefault()
            const tableData = prodTable.getProdList
            for (let item of tableData) {
                item.picked_quantity = item.ready_quantity
            }
            prodTable.setProdList = tableData
            $('#dtbPickingProductList').DataTable().clear().rows.add(tableData).draw();
        });
    }

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
    $('#inputDeliveryDate').val(null).trigger('change')
    $('#inputActualDate').val(null).trigger('change')

    // run get detail func
    getPageDetail()
    // handle before form submit
    formSubmit()

    // quick pick product form one warehouse
    async function handleOnClickDone() {
        const tableData = prodTable.getProdList
        const callableWarehouse = prodTable.getWarehouseList
        for (const item of tableData) {
            const key = `${item.product_data.id}.${item.uom_data.id}`;
            let prodCheck = []
            if (callableWarehouse.hasOwnProperty(key)) prodCheck = callableWarehouse[key]
            else if (item.is_not_inventory){
                // cho case có prod trong kho
                const listPromise = await $.fn.callAjax(
                    $url.attr('data-warehouse-prod'),
                    'GET',
                    {'product_id': item.product_data.id, 'uom_id': item.uom_data.id}
                )
                if (listPromise.data.status === 200) {
                    prodCheck = listPromise.data.warehouse_stock
                }
                let flag = false
                item.picked_quantity = 0
                item.delivery_data = []
                for (const value of prodCheck) {
                    if (item.picked_quantity !== item.delivery_quantity) {
                        // kiem tra pick chưa đủ
                        const remain = item.delivery_quantity - item.picked_quantity
                        if (value.product_amount > 0) {
                            let temp = {
                                'warehouse': value.id,
                                'uom': item.uom_data.id,
                                'stock': 0
                            }
                            if (value.product_amount >= remain) {
                                temp.stock = remain
                                item.picked_quantity += remain
                            } else {
                                temp.stock = value.product_amount
                                item.picked_quantity += value.product_amount
                            }
                            item.delivery_data.push(temp)
                            if (item.picked_quantity === item.delivery_quantity) {
                                flag = true
                                break
                            }
                        }
                    }
                }
                if (!flag)
                    $.fn.notifyB({description: $trans.attr('data-outstock')}, 'failure')
            }
            else if (!item.is_not_inventory)
                // cho case có prod là dịch vụ
                item.picked_quantity = item.ready_quantity
        }
        prodTable.setProdList = tableData
        $('#dtbPickingProductList').DataTable().clear().rows.add(tableData).draw();
    }
}, (jQuery));
