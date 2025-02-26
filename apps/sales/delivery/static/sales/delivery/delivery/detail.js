$(async function () {
    const $trans = $('#trans-factory');
    const $url = $('#url-factory');
    let $form = $('#delivery_form');
    let $eleSO = $('#inputSaleOrder');

    let $tableMain = $('#dtbPickingProductList');
    let $tableProductNew = $('#productNew');
    let $tableProductLeased = $('#productLeased');
    let $tablePW = $('#productStockDetail');
    let $tableLot = $('#datable-delivery-wh-lot');
    let $tableSerial = $('#datable-delivery-wh-serial');
    let $scrollProduct = $('#scroll-new-leased-product');
    let $scrollLot = $('#scroll-table-lot');
    let $scrollSerial = $('#scroll-table-serial');
    let $canvasPW = $('#warehouseStockCanvas');
    let $btnSave = $('#save-stock');

    let dataCompanyConfig = await DocumentControl.getCompanyConfig();
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

        contentCanvasHandle() {
            let prod_data = {};
            if ($btnSave.attr('data-target')) {
                let idx = parseInt($btnSave.attr('data-target'));
                let $row = $tableMain.DataTable().row(idx);
                prod_data = $row.data();
            }

            // Kiểm tra giao hàng theo đơn hàng hay đơn cho thuê
            let targetItemData = prod_data?.['product_data'];
            if (prod_data?.['offset_data']?.['id']) {
                $('#productLeasedDiv').removeAttr('hidden');
                targetItemData = prod_data?.['offset_data'];
                $tableProductLeased.DataTable().clear().draw();
                $tableProductLeased.DataTable().rows.add(prod_data?.['product_quantity_leased_data'] ? prod_data?.['product_quantity_leased_data'] : []).draw();
            }
            $tableProductNew.DataTable().clear().draw();
            $tableProductNew.DataTable().rows.add([prod_data]).draw();
            prodTable.loadEventRadio($scrollProduct);

            let checkedEle = $tableProductNew[0].querySelector('.table-row-checkbox:checked');
            if (checkedEle) {
                $(checkedEle).trigger('click');
            }

            // load tên SP cho canvas header
            let titleMdl = $canvasPW[0].querySelector('.title-mdl');
            if (titleMdl) {
                $(titleMdl).empty();
                $(titleMdl).append(`${$trans.attr('data-title-mdl')} (${targetItemData?.['title']})`);
            }

            $canvasPW.offcanvas('show');
        };

        loadCallAjaxPW(targetItemData, prod_data) {
            let _this = this;
            if ($btnSave.attr('data-target')) {
                let idx = parseInt($btnSave.attr('data-target'));

                let url = $url.attr('data-product-warehouse');
                let dataParam = {'product_id': targetItemData?.['id']};
                let keyResp = 'warehouse_products_list';
                let dataRegisConfig = prodTable.getRegisConfig();
                let isRegis = dataRegisConfig?.['isRegis'];
                let dataSO = dataRegisConfig?.['dataSO'];
                if (isRegis === true && dataSO) {
                    url = $url.attr('data-product-regis');
                    dataParam = {
                        'so_item__sale_order_id': dataSO?.['id'],
                        'product_id': targetItemData?.['id'],
                    };
                    keyResp = 'regis_borrow_list';
                }
                $.fn.callAjax2({
                    'url': url,
                    'method': 'get',
                    'data': dataParam,
                }).then((req) => {
                    const isKey = `${targetItemData?.['id']}.${prod_data?.['uom_data']?.['id']}`
                    let temp = _this.getWarehouseList
                    const res = $.fn.switcherResp(req);
                    let ResData = res?.[keyResp];
                    let isData = ResData;
                    temp[isKey] = isData;
                    _this.setWarehouseList = temp;

                    $tablePW.DataTable().destroy();
                    if (keyResp === 'regis_borrow_list') {
                        if (ResData.length > 0) {
                            isData = ResData[0];
                            temp[isKey] = isData?.['regis_data'];
                            _this.setWarehouseList = temp;

                            let dataRegis = prodTable.setupDataPW(isData?.['regis_data'], prod_data, 0);
                            for (let borrow_data of isData?.['borrow_data']) {
                                let dataBorrow = prodTable.setupDataPW(borrow_data?.['regis_data'], prod_data, 0);
                                dataRegis = dataRegis.concat(dataBorrow);
                            }
                            for (let borrow_data of isData?.['borrow_data_general_stock']) {
                                let dataBorrow = prodTable.setupDataPW(borrow_data?.['regis_data'], prod_data, 1);
                                dataRegis = dataRegis.concat(dataBorrow);
                            }
                            prodTable.dataTablePW(dataRegis);
                        }
                    } else {
                        let dataPW = prodTable.setupDataPW(isData, prod_data, 0);
                        prodTable.dataTablePW(dataPW);
                    }

                    $tableLot.DataTable().clear().draw();
                    $tableSerial.DataTable().clear().draw();
                    if ([1, 2].includes(targetItemData?.['general_traceability_method'])) {
                        if ($scrollLot && $scrollSerial && $scrollLot.length > 0 && $scrollSerial.length > 0) {
                            if (targetItemData?.['general_traceability_method'] === 1) {
                                $scrollLot[0].removeAttribute('hidden');
                            }
                            if (targetItemData?.['general_traceability_method'] === 2) {
                                $scrollSerial[0].removeAttribute('hidden');
                            }
                        }
                    }
                    $canvasPW.offcanvas('show');
                    $btnSave.off().on('click', function () {
                        let delivery_data = [];
                        let product_quantity_leased_data = [];
                        let temp_picked = 0;
                        $tableProductNew.DataTable().rows().every(function () {
                            let row = this.node();
                            let rowIndex = $tableProductNew.DataTable().row(row).index();
                            let $row = $tableProductNew.DataTable().row(rowIndex);
                            let rowData = $row.data();
                            delivery_data = rowData?.['delivery_data'];
                            temp_picked += rowData?.['picked_quantity'];
                        });
                        $tableProductLeased.DataTable().rows().every(function () {
                            let row = this.node();
                            let rowIndex = $tableProductLeased.DataTable().row(row).index();
                            let $row = $tableProductLeased.DataTable().row(rowIndex);
                            let rowData = $row.data();
                            product_quantity_leased_data.push(rowData);
                            temp_picked += rowData?.['picked_quantity'];
                        });
                        if (temp_picked > 0) {
                            // lấy hàng từ popup warehouse add vào danh sách product detail
                            let tableTargetData = _this.getProdList;
                            tableTargetData[idx]['picked_quantity'] = temp_picked;
                            tableTargetData[idx]['delivery_data'] = delivery_data;
                            tableTargetData[idx]['product_quantity_leased_data'] = product_quantity_leased_data;
                            _this.setProdList = tableTargetData;
                            $tableMain.DataTable().row(idx).data(tableTargetData[idx]).draw();
                        }
                        $scrollLot[0].setAttribute('hidden', 'true');
                        $scrollSerial[0].setAttribute('hidden', 'true');
                        $canvasPW.offcanvas('hide');
                    })
                });
            }
        };

        loadPWData(pwh, prod_data) {
            for (let val of prod_data?.['delivery_data']) {
                let check = false;
                if (val?.['warehouse_id'] === pwh?.['warehouse_id']) {
                    if (($eleSO.attr('data-so'))) {
                        if (val?.['sale_order_id'] === pwh?.['sale_order_id']) {
                            check = true;
                        }
                    }
                    if (($eleSO.attr('data-lo'))) {
                        check = true;
                    }

                    if (check === true) {
                        if (val?.['stock'] && prod_data?.['picked_quantity']) {
                            if (prod_data?.['picked_quantity'] > 0) {
                                pwh['picked_quantity'] = val?.['stock'];
                            }
                        }
                        if (val?.['lot_data']) {
                            pwh['lot_data'] = val?.['lot_data'];
                        }
                        if (val?.['serial_data']) {
                            pwh['serial_data'] = val?.['serial_data'];
                        }
                        break;
                    }
                }
            }
            return true;
        };

        initTableProd() {
            const _this = this
            const delivery_config = this.getProdConfig
            $tableMain.DataTableDefault({
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
                            return `<div class="input-group">
                                            <div class="dropdown pointer mr-2">
                                                <i class="fas fa-info-circle text-blue"
                                                   data-bs-toggle="dropdown"
                                                   data-dropdown-animation
                                                   aria-haspopup="true"
                                                   aria-expanded="false"></i>
                                                <div class="dropdown-menu w-210p mt-2">${dataCont}</div>
                                            </div>
                                            <p>${row.title}</p>${is_gift}
                                        </div>`;
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
                        visible: delivery_config?.['is_partial_ship'],
                        render: (row, type, data) => {
                            return `<p>${data.delivered_quantity_before}</p>`;
                        }
                    },
                    {
                        targets: 5,
                        class: 'w-10 text-center',
                        visible: delivery_config?.['is_partial_ship'],
                        render: (row, type, data) => {
                            return `<p>${data.remaining_quantity}</p>`;
                        }
                    },
                    {
                        targets: 6,
                        class: 'w-10 text-center',
                        visible: delivery_config?.['is_picking'],
                        data: 'ready_quantity',
                        render: (row, type, data, meta) => {
                            let html = `<p>${row}</p>`;
                            if (delivery_config?.['is_picking'] && !delivery_config?.['is_partial_ship']) {
                                html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                    + `<p id="ready_row-${meta.row}">${row}<p/>`
                                    + `<button type="button" class="btn btn-flush-primary btn-animated select-prod" `
                                    + `data-idx="${meta.row}" data-id="${data.product_data.id}">`
                                    + `<i class="fa-solid fa-ellipsis"></i></button></div>`;
                            }
                            if (!data?.['is_not_inventory']){
                                html = `<p id="ready_row-${meta.row}">${row}<p/>`;
                            }
                            return html
                        }
                    },
                    {
                        targets: 7,
                        class: 'w-15 text-center',
                        render: (row, type, data, meta) => {
                            let disabled = '';
                            if ($form.attr('data-method').toLowerCase() === 'get') {
                                disabled = 'disabled';
                            }
                            let quantity = 0
                            if (data.picked_quantity) quantity = data.picked_quantity
                            let html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                + `<p id="prod_row-${meta.row}">${quantity}<p/>`
                                + `<button type="button" class="btn btn-flush-primary btn-animated select-prod" data-zone="products">`
                                + `<i class="fa-solid fa-ellipsis"></i></button></div>`;

                            let detailDataRaw = $('#request-data').text();
                            if (detailDataRaw) {
                                let detailData = JSON.parse(detailDataRaw);
                                if (detailData?.['state'] === 0) {
                                    html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                            + `<p id="prod_row-${meta.row}">${quantity}<p/>`
                                            + `<button type="button" class="btn btn-flush-primary btn-animated select-prod" disabled>`
                                            + `<i class="fa-solid fa-ellipsis"></i></button></div>`;
                                }
                            }


                            if (delivery_config.is_picking && !delivery_config?.['is_partial_ship'])
                                html = `<p class="text-center">${quantity}<p/>`
                            if (!data?.['is_not_inventory']){
                                html = `<div class="d-flex justify-content-evenly align-items-center flex-gap-3">`
                                + `<input type="number" class="form-control w-100p services_input" id="prod_row-${meta.row}" value="${quantity}" ${disabled}>`
                                + `</div>`;
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
                        $btnSave.attr('data-target', index);
                        _this.contentCanvasHandle();
                    })
                    $(`input.services_input`, row).off().on('change', function () {
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
        };

        loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
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
                    let res1 = ``;
                    let res2 = ``;
                    if (customRes?.['res1']) {
                        res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`;
                    }
                    if (customRes?.['res2']) {
                        res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`;
                    }
                    return $(`<span>${res1} ${res2}</span>`);
                }
            }
            $ele.initSelect2(opts);
            return true;
        };

        loadEventCheckbox($area, trigger = false) {
            // Use event delegation for dynamically added elements
            $area.on('click', '.form-check', function (event) {
                // Prevent handling if the direct checkbox is clicked
                if (event.target.classList.contains('form-check-input')) {
                    return; // Let the checkbox handler handle this
                }

                // Find the checkbox inside the clicked element
                let checkbox = this.querySelector('.form-check-input[type="checkbox"]');
                if (checkbox) {
                    // Check if the checkbox is disabled
                    if (checkbox.disabled) {
                        return; // Exit early if the checkbox is disabled
                    }
                    // Prevent the default behavior
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    // Toggle the checkbox state manually
                    checkbox.checked = !checkbox.checked;
                    // Optional: Trigger a change event if needed
                    if (trigger === true) {
                        $(checkbox).trigger('change');
                    }
                }
            });

            // Handle direct clicks on the checkbox itself
            $area.on('click', '.form-check-input', function (event) {
                // Prevent the default behavior to avoid double-triggering
                event.stopPropagation();
                event.stopImmediatePropagation();

                // Checkbox state is toggled naturally, so no need to modify it
                if (trigger === true) {
                    $(this).trigger('change'); // Optional: Trigger change event explicitly
                }
            });

            return true;
        };

        loadEventRadio($area) {
            // Use event delegation for dynamically added elements
            if (!$area.data('radio-handler-bound')) {
                $area.on('click', '.form-check', function () {
                    // Find and mark the radio button inside this group as checked
                    let radio = this.querySelector('.form-check-input');
                    if (radio) {
                        let checkboxes = $area[0].querySelectorAll('.form-check-input[type="radio"]');
                        // Uncheck all radio buttons and reset row styles
                        for (let eleCheck of checkboxes) {
                            eleCheck.checked = false;
                        }
                        // Set the current radio button as checked and apply style
                        radio.checked = true;
                    }
                });

                // Mark the handler as bound to prevent rebinding
                $area.data('radio-handler-bound', true);
            }

            return true;
        };

        loadEventCheckboxAll($area) {
            $area.on('click', '.table-row-checkbox-all', function () {
                let checked = this.checked;
                for (let checkbox of $area[0].querySelectorAll('.table-row-checkbox')) {
                    if (checkbox) {
                        checkbox.checked = checked;
                        let state = prodTable.loadDeliverBySerial(checkbox);
                        if (state === false) {
                            break;
                        }
                    }
                }
            });
            return true;
        };

        setupDataPW(dataSrc, prod_data, type) {
            // type: 0 normal | 1: borrow

            let _this = this;
            let config = _this.getProdConfig;
            let finalData = [];
            let baseData = [];
            let soDataJson = {};
            let commonDataJson = {};
            for (let pwh of dataSrc) {
                pwh['picked_quantity'] = 0;
                pwh['is_regis_so'] = false;
                pwh['product_id'] = pwh?.['product']?.['id'];
                pwh['product_data'] = pwh?.['product'];
                pwh['warehouse_id'] = pwh?.['warehouse']?.['id'];
                pwh['warehouse_data'] = pwh?.['warehouse'];
                pwh['uom_id'] = pwh?.['uom']?.['id'];
                pwh['uom_data'] = pwh?.['uom'];
                if (!pwh.hasOwnProperty('sale_order') && type === 0) {
                    if ($eleSO.attr('data-so')) {
                        pwh['sale_order_data'] = JSON.parse($eleSO.attr('data-so'));
                        for (let deliveryData of prod_data?.['delivery_data'] ? prod_data?.['delivery_data'] : []) {
                            if (pwh?.['sale_order_data']?.['id'] === deliveryData?.['sale_order_data']?.['id'] && pwh?.['warehouse_data']?.['id'] === deliveryData?.['warehouse_data']?.['id']) {
                                pwh['picked_quantity'] = deliveryData?.['picked_quantity'];
                            }
                        }
                    }
                }
                if (!pwh.hasOwnProperty('lease_order') && type === 0) {
                    if ($eleSO.attr('data-lo')) {
                        pwh['lease_order_data'] = JSON.parse($eleSO.attr('data-lo'));
                        for (let deliveryData of prod_data?.['delivery_data'] ? prod_data?.['delivery_data'] : []) {
                            if (pwh?.['warehouse_data']?.['id'] === deliveryData?.['warehouse_data']?.['id']) {
                                pwh['picked_quantity'] = deliveryData?.['picked_quantity'];
                            }
                        }
                    }
                }

                let finalRate = 1;
                if (pwh?.['uom'] && prod_data?.['uom_data']) {
                    pwh['uom_stock'] = pwh?.['uom'];
                    pwh['uom_delivery'] = prod_data?.['uom_data'];
                    if (pwh?.['uom_stock']?.['ratio'] && pwh?.['uom_delivery']?.['ratio']) {
                        if (pwh?.['uom_delivery']?.['ratio'] > 0) {
                            finalRate = pwh?.['uom_stock']?.['ratio'] / pwh?.['uom_delivery']?.['ratio'];
                        }
                    }
                }
                if (!$eleSO.attr('data-lo')) {  // Nếu không phải leaseorder thì check có picking hay không picking
                    if (!config?.['is_picking'] && config?.['is_partial_ship']) { // Trường hợp none_picking_many_delivery
                        pwh['stock_amount'] = pwh?.['stock_amount'] * finalRate;
                        pwh['available_stock'] = pwh?.['available_stock'] * finalRate;
                        if (prod_data?.['delivery_data']) {
                            prodTable.loadPWData(pwh, prod_data);
                        }
                    }
                    if ((config?.['is_picking'] && config?.['is_partial_ship']) && prod_data?.['delivery_data']) { // Trường hợp has_picking_many_delivery
                        // nếu ready quantity > 0 => có hàng để giao
                        // lấy delivery
                        pwh['stock_amount'] = pwh?.['picked_ready'] * finalRate;
                        pwh['available_stock'] = pwh?.['available_picked'] * finalRate;
                        if (prod_data?.['ready_quantity'] > 0) {
                            prodTable.loadPWData(pwh, prod_data);
                        }
                        // change column name stock -> picked
                        if (!$tablePW.hasClass('dataTable')) {
                            let columnStock = $tablePW[0]?.querySelector('.stock-picked-exchange');
                            if (columnStock) {
                                columnStock.innerHTML = $trans.attr('data-picked-ready');
                            }
                        }
                    }
                } else {  // Nếu là lease order thì luôn không có picking
                    pwh['stock_amount'] = pwh?.['stock_amount'] * finalRate;
                    pwh['available_stock'] = pwh?.['available_stock'] * finalRate;
                    if (prod_data?.['delivery_data']) {
                        prodTable.loadPWData(pwh, prod_data);
                    }
                }
                baseData.push(pwh);

                if (type === 0) {  // normal
                    if (pwh?.['sale_order_data']?.['id']) {
                        if (!soDataJson.hasOwnProperty(String(pwh?.['sale_order_data']?.['id']))) {
                            soDataJson[String(pwh?.['sale_order_data']?.['id'])] = {
                                'sale_order_id': pwh?.['sale_order_id'],
                                'sale_order_data': pwh?.['sale_order_data'],
                                'available_stock': pwh?.['available_stock'],
                                'is_regis_so': true,
                                'pw_data': [pwh]
                            };
                        } else {
                            soDataJson[String(pwh?.['sale_order_data']?.['id'])]['pw_data'].push(pwh);
                            soDataJson[String(pwh?.['sale_order_data']?.['id'])]['available_stock'] += pwh?.['available_stock'];
                        }
                    }
                }
                if (type === 1) {  // borrow
                    if (!commonDataJson.hasOwnProperty('common_warehouse')) {
                        commonDataJson['common_warehouse'] = {
                            'sale_order_id': pwh?.['sale_order_id'],
                            'sale_order_data': pwh?.['sale_order_data'],
                            'available_stock': pwh?.['common_stock'],
                            'is_regis_common': true,
                            'pw_data': [pwh]
                        };
                    } else {
                        commonDataJson['common_warehouse']['pw_data'].push(pwh);
                    }
                }
            }
            for (let key in soDataJson) {
                finalData.push(soDataJson[key]);
                for (let pwData of soDataJson[key]?.['pw_data']) {
                    finalData.push(pwData);
                }
            }
            for (let key in commonDataJson) {
                finalData.push(commonDataJson[key]);
                for (let pwData of commonDataJson[key]?.['pw_data']) {
                    finalData.push(pwData);
                }
            }
            if (finalData.length === 0) {
                finalData = baseData;
            }
            return finalData;
        };

        loadEventPW() {
            $tablePW.DataTable().rows().every(function () {
                let row = this.node();
                let data = this.data();

                // Find the checkbox only once
                let checkbox = row.querySelector('.form-check');
                if (checkbox) {
                    // Remove any previously bound event listeners to avoid duplication
                    checkbox.replaceWith(checkbox.cloneNode(true)); // Clear all event listeners
                    checkbox = row.querySelector('.table-row-checkbox'); // Reassign the reference

                    // Add the event listener
                    checkbox.addEventListener('click', function () {
                        prodTable.loadCheckPW(checkbox, data, row); // Pass necessary parameters
                    });
                }
            });
            return true;
        };

        loadCheckPW(ele, data, row) {
            if ([1, 2].includes(data?.['product']?.['general_traceability_method'])) {
                let productWHID = ele.getAttribute('data-id');
                if (data?.['product']?.['general_traceability_method'] === 1) {
                    prodTable.loadLot(ele, row, data, productWHID);
                }
                if (data?.['product']?.['general_traceability_method'] === 2) {
                    prodTable.loadSerial(ele, row, data, productWHID);
                }
            }
        };

        setupCollapse() {
            for (let child of $tablePW[0].querySelectorAll('.cl-child')) {
                if (child.getAttribute('data-row')) {
                    let dataRow = JSON.parse(child.getAttribute('data-row'));
                    let row = child.closest('tr');
                    let cls = '';
                    if (dataRow?.['sale_order']?.['id']) {
                        cls = 'cl-' + dataRow?.['sale_order']?.['id'].replace(/-/g, "");
                    } else {
                        cls = 'cl-is_regis_common';
                    }
                    row.classList.add(cls);
                    row.classList.add('collapse');
                    row.classList.add('show');
                }
            }
            return true;
        };

        getRegisConfig() {
            let isRegis = false;
            if (dataCompanyConfig?.['config']?.['cost_per_project'] === true && $eleSO.attr('data-so')) {
                let dataSO = JSON.parse($eleSO.attr('data-so'));
                if (dataSO?.['opportunity']) {
                    if (Object.keys(dataSO?.['opportunity']).length !== 0) {
                        isRegis = true;
                    }
                }
                return {'isRegis': isRegis, 'dataSO': dataSO}
            }
            return {'isRegis': isRegis, 'dataSO': {}}
        };

        loadLot(eleChecked, row, data, productWHID) {
            let dataRegisConfig = prodTable.getRegisConfig();
            let isRegis = dataRegisConfig?.['isRegis'];
            let dataSO = dataRegisConfig?.['dataSO'];
            let url = $tableLot.attr('data-url');
            let dataParam = {'product_warehouse_id': productWHID};
            let keyResp = 'warehouse_lot_list';
            if (isRegis === true && dataSO && eleChecked.getAttribute('data-row')) {
                let dataRow = JSON.parse(eleChecked.getAttribute('data-row'));
                if (!dataRow?.['is_pw']) {
                    url = $tableLot.attr('data-url-regis');
                    dataParam = {
                        'gre_item_prd_wh__gre_item__so_item__sale_order_id': dataRow?.['sale_order']?.['id'],
                        'gre_item_prd_wh__gre_item__product_id': data?.['product']?.['id'],
                        'gre_item_prd_wh__warehouse_id': data?.['warehouse']?.['id'],
                    };
                    keyResp = 'gre_item_prd_wh_lot_list';
                } else {
                    isRegis = false;
                }
            }
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': url,
                    'method': 'GET',
                    'data': dataParam,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let dataLot = $.fn.switcherResp(resp);
                    if (dataLot) {
                        if (dataLot.hasOwnProperty(keyResp) && Array.isArray(dataLot?.[keyResp])) {
                            let dataFn = dataLot?.[keyResp];
                            if (isRegis === true) {
                                dataFn = [];
                                for (let lot of dataLot?.[keyResp]) {
                                    dataFn.push(lot?.['lot_registered']);
                                }
                            }
                            $tableLot.DataTable().clear().draw();
                            $tableLot.DataTable().rows.add(dataFn).draw();

                            let dataCheck = {};
                            $tablePW.DataTable().rows().every(function () {
                                let row = this.node();
                                let rowIndex = $tablePW.DataTable().row(row).index();
                                let $row = $tablePW.DataTable().row(rowIndex);
                                let rowData = $row.data();

                                let checkedEle = row.querySelector('.table-row-checkbox:checked');
                                if (checkedEle) {
                                    if (rowData?.['product_data']?.['general_traceability_method'] === 1) {
                                        if (rowData?.['lot_data']) {
                                            for (let lotData of rowData?.['lot_data']) {
                                                if (lotData?.['quantity_delivery'] > 0) {
                                                    dataCheck[lotData?.['product_warehouse_lot_id']] = lotData?.['quantity_delivery'];
                                                }
                                            }
                                        }
                                    }
                                }
                            });

                            $tableLot.DataTable().rows().every(function () {
                                let row = this.node();
                                let rowIndex = $tableLot.DataTable().row(row).index();
                                let $row = $tableLot.DataTable().row(rowIndex);
                                let rowData = $row.data();

                                if (dataCheck.hasOwnProperty(rowData?.['id'])) {
                                    rowData['quantity_delivery'] = dataCheck?.[rowData?.['id']];
                                    $tableLot.DataTable().row(rowIndex).data(rowData).draw();
                                }
                            });
                        }
                    }
                    WindowControl.hideLoading();
                }
            )
            return true;
        };

        loadDeliverByLot(ele) {
            let row = ele.closest('tr');
            let rowIndex = $tableLot.DataTable().row(row).index();
            let $row = $tableLot.DataTable().row(rowIndex);
            let rowData = $row.data();

            DeliveryStoreDataHandle.storeData();
            let check = prodTable.loadCheckExceedQuantity();
            if (check === false) {
                rowData['quantity_delivery'] = 0;
                $tableLot.DataTable().row(rowIndex).data(rowData).draw();
                DeliveryStoreDataHandle.storeData();
            }
            let rowChecked = $tablePW[0]?.querySelector('.table-row-checkbox:checked')?.closest('tr');
            if (rowChecked) {
                let deliver = 0;
                let {valStock, valAvb} = prodTable.getValStockValAvb($tablePW, rowChecked);
                $tableLot.DataTable().rows().every(function () {
                    let row = this.node();
                    let inputEle = row?.querySelector('.table-row-quantity-delivery');
                    if (inputEle) {
                        if ($(inputEle).val()) {
                            deliver += parseFloat($(inputEle).val());
                        }
                    }
                });
                if (deliver <= valStock && deliver <= valAvb) {
                    // store data
                    DeliveryStoreDataHandle.storeData();
                    let check = prodTable.loadCheckExceedQuantity();
                    if (check === false) {
                        rowData['quantity_delivery'] = 0;
                        $tableLot.DataTable().row(rowIndex).data(rowData).draw();
                        DeliveryStoreDataHandle.storeData();
                    }
                } else {
                    $.fn.notifyB({description: $trans.attr('data-exceed-available-quantity')}, 'failure');
                    rowData['quantity_delivery'] = 0;
                    $tableLot.DataTable().row(rowIndex).data(rowData).draw();
                    DeliveryStoreDataHandle.storeData();
                    return false;
                }
            }
            return true;
        };

        loadSerial(eleChecked, row, data, productWHID) {
            let dataRegisConfig = prodTable.getRegisConfig();
            let isRegis = dataRegisConfig?.['isRegis'];
            let dataSO = dataRegisConfig?.['dataSO'];
            let url = $tableSerial.attr('data-url');
            let dataParam = {'product_warehouse_id': productWHID, 'is_delete': false, 'gre_sn_registered__isnull': true};
            let keyResp = 'warehouse_serial_list';
            if ($form.attr('data-method').toLowerCase() === 'get') {
                dataParam = {'product_warehouse_id': productWHID};
            }
            if (isRegis === true && dataSO && eleChecked.getAttribute('data-row')) {
                let dataRow = JSON.parse(eleChecked.getAttribute('data-row'));
                if (!dataRow?.['is_pw']) {
                    url = $tableSerial.attr('data-url-regis');
                    dataParam = {
                        'gre_item_prd_wh__gre_item__so_item__sale_order_id': dataRow?.['sale_order']?.['id'],
                        'gre_item_prd_wh__gre_item__product_id': data?.['product']?.['id'],
                        'gre_item_prd_wh__warehouse_id': data?.['warehouse']?.['id'],
                        'sn_registered__is_delete': false,
                    };
                    keyResp = 'good_registration_serial';
                } else {
                    isRegis = false;
                }
            }
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': url,
                    'method': 'GET',
                    'data': dataParam,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let dataSerial = $.fn.switcherResp(resp);
                    if (dataSerial) {
                        if (dataSerial.hasOwnProperty(keyResp) && Array.isArray(dataSerial?.[keyResp])) {
                            let dataFn = dataSerial?.[keyResp];
                            if (isRegis === true) {
                                dataFn = [];
                                for (let serial of dataSerial?.[keyResp]) {
                                    dataFn.push(serial?.['sn_registered']);
                                }
                            }
                            $tableSerial.DataTable().clear().draw();
                            $tableSerial.DataTable().rows.add(dataFn).draw();

                            let dataCheck = [];
                            $tablePW.DataTable().rows().every(function () {
                                let row = this.node();
                                let rowIndex = $tablePW.DataTable().row(row).index();
                                let $row = $tablePW.DataTable().row(rowIndex);
                                let rowData = $row.data();

                                let checkedEle = row.querySelector('.table-row-checkbox:checked');
                                if (checkedEle) {
                                    if (rowData?.['product_data']?.['general_traceability_method'] === 2) {
                                        if (rowData?.['serial_data']) {
                                            for (let serialData of rowData?.['serial_data']) {
                                                if (serialData?.['product_warehouse_serial_id']) {
                                                    dataCheck.push(serialData?.['product_warehouse_serial_id']);
                                                }
                                            }
                                        }
                                    }
                                }
                            });

                            $tableSerial.DataTable().rows().every(function () {
                                let row = this.node();
                                let rowIndex = $tableSerial.DataTable().row(row).index();
                                let $row = $tableSerial.DataTable().row(rowIndex);
                                let rowData = $row.data();

                                let checkEle = row.querySelector('.table-row-checkbox');
                                if (checkEle) {
                                    if (dataCheck.includes(rowData?.['id'])) {
                                        checkEle.checked = true;
                                    }
                                }
                            });
                        }
                    }
                    WindowControl.hideLoading();
                }
            )
            return true;
        };

        loadDeliverBySerial(ele) {
            let rowChecked = $tablePW[0]?.querySelector('.table-row-checkbox:checked')?.closest('tr');
            if (rowChecked) {
                let deliver = 0;
                let {valStock, valAvb} = prodTable.getValStockValAvb($tablePW, rowChecked);
                $tableSerial.DataTable().rows().every(function () {
                    let row = this.node();
                    let checkEle = row?.querySelector('.table-row-checkbox');
                    if (checkEle) {
                        if (checkEle.checked === true) {
                            deliver++;
                        }
                    }
                });
                if (deliver <= valStock && deliver <= valAvb) {  // Kiểm tra <= tồn kho và <= khả dụng (mượn hàng)
                    // store data
                    DeliveryStoreDataHandle.storeData();
                    let check = prodTable.loadCheckExceedQuantity();
                    if (check === false) {
                        ele.checked = false;
                        DeliveryStoreDataHandle.storeData();
                    }
                } else {
                    $.fn.notifyB({description: $trans.attr('data-exceed-available-quantity')}, 'failure');
                    ele.checked = false;
                    DeliveryStoreDataHandle.storeData();
                    return false;
                }
            }
            return true;
        };

        getValStockValAvb(table, rowChecked) {
            let valStock = 0;
            if (rowChecked?.querySelector('.table-row-available')) {
                valStock = parseFloat(rowChecked?.querySelector('.table-row-available')?.innerHTML);
            }
            let valAvb = valStock;
            for (let cls of rowChecked.classList) {
                if (cls.includes('cl')) {
                    let target = '.' + cls;
                    let clParent = table[0].querySelector(`.cl-parent[data-bs-target="${target}"]`);
                    if (clParent) {
                        if (clParent.getAttribute('data-row')) {
                            let dataRow = JSON.parse(clParent.getAttribute('data-row'));
                            valAvb = dataRow?.['available_stock'];
                            break;
                        }
                    }
                }
            }
            return {valStock: valStock, valAvb: valAvb};
        };

        formatNum(ele) {
            let value = ele.value;
            // Replace non-digit characters with an empty string
            value = value.replace(/[^0-9.]/g, '');
            // Remove unnecessary zeros from the integer part
            value = value.replace("-", "").replace(/^0+(?=\d)/, '');
            // Update value of input
            ele.value = value;
        };

        // DataTable
        dataTableProductNew(data) {
            // init dataTable
            $tableProductNew.DataTableDefault({
                styleDom: 'hide-foot',
                data: data ? data : [],
                ordering: false,
                paging: false,
                info: false,
                searching: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        targets: 0,
                        width: '30%',
                        render: (data, type, row) => {
                            let targetData = row?.['product_data'];
                            if (row?.['offset_data']?.['id']) {
                                targetData = row?.['offset_data'];
                            }
                            let checked = '';
                            if (!$scrollProduct[0].querySelector('.table-row-checkbox:checked')) {
                                checked = 'checked';
                            }
                            return `<div class="d-flex align-items-center">
                                        <div class="form-check form-check-lg">
                                            <input
                                                type="radio"
                                                class="form-check-input table-row-checkbox"
                                                id="new-product-${targetData?.['id'].replace(/-/g, "")}"
                                                ${checked}
                                            >
                                        </div>
                                        <textarea class="form-control table-row-item-show" rows="2" readonly>${targetData?.['code']}</textarea>
                                    </div>
                                    <div class="row table-row-item-area hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select
                                                class="form-select table-row-item"
                                                data-url="${$url.attr('data-md-product')}"
                                                data-method="GET"
                                                data-keyResp="product_sale_list"
                                                data-product-id="${targetData?.['id']}"
                                                readonly
                                            >
                                            </select>
                                        </div>
                                    </div>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '30%',
                        render: (data, type, row) => {
                            let targetData = row?.['product_data'];
                            if (row?.['offset_data']?.['id']) {
                                targetData = row?.['offset_data'];
                            }
                            return `<textarea class="form-control table-row-name" rows="2" readonly>${targetData?.['title'] ? targetData?.['title'] : ''}</textarea>`;
                        },
                    },
                    {
                        targets: 1,
                        width: '20%',
                        render: (data, type, row) => {
                            return `<span class="table-row-remain">${row?.['remaining_quantity_new'] ? row?.['remaining_quantity_new'] : 0}</span>`;
                        },
                    },
                    {
                        targets: 2,
                        width: '20%',
                        render: (data, type, row) => {
                            let value = 0;
                            let picked = row?.['picked_quantity'] ? row?.['picked_quantity'] : 0;
                            let leased = row?.['product_quantity_leased'] ? row?.['product_quantity_leased'] : 0;
                            if (row?.['offset_data']?.['id']) {
                                value = picked - leased;
                            } else {
                                value = picked;
                            }
                            return `<b class="table-row-picked">${value}</b>`;
                        },
                    },
                ],
                rowCallback: function (row, data, index) {
                    let itemEle = row.querySelector('.table-row-item');
                    if (itemEle) {
                        let dataS2 = [];
                        if (data?.['product_data']) {
                            dataS2 = [data?.['product_data']];
                        }
                        prodTable.loadInitS2($(itemEle), dataS2);
                        $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                    }
                },
                drawCallback: function () {
                    if ($eleSO.attr('data-lo')) {
                        prodTable.dtbProductNewHDCustom();
                    }
                },
            });
        };

        dataTableProductLeased(data) {
            // init dataTable
            $tableProductLeased.DataTableDefault({
                styleDom: 'hide-foot',
                data: data ? data : [],
                ordering: false,
                paging: false,
                info: false,
                searching: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        targets: 0,
                        width: '30%',
                        render: (data, type, row) => {
                            return `<div class="d-flex align-items-center">
                                        <div class="form-check form-check-lg">
                                            <input
                                                type="radio"
                                                class="form-check-input table-row-checkbox"
                                                id="leased-product-${row?.['product_data']?.['id'].replace(/-/g, "")}"
                                            >
                                        </div>
                                        <textarea class="form-control table-row-item-show" rows="2" readonly>${row?.['product_data']?.['lease_code']}</textarea>
                                    </div>
                                    <div class="row table-row-item-area hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select
                                                class="form-select table-row-item"
                                                data-url="${$url.attr('data-md-product')}"
                                                data-method="GET"
                                                data-keyResp="product_sale_list"
                                                data-product-id="${row?.['product_data']?.['id']}"
                                                readonly
                                            >
                                            </select>
                                        </div>
                                    </div>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '30%',
                        render: (data, type, row) => {
                            return `<textarea class="form-control table-row-name" rows="2" readonly>${row?.['product_data']?.['title'] ? row?.['product_data']?.['title'] : ''}</textarea>`;
                        },
                    },
                    {
                        targets: 2,
                        width: '20%',
                        render: (data, type, row) => {
                            return `<span class="table-row-remain">${row?.['remaining_quantity_leased'] ? row?.['remaining_quantity_leased'] : 0}</span>`;
                        },
                    },
                    {
                        targets: 3,
                        width: '20%',
                        render: (data, type, row) => {
                            return `<b class="table-row-picked">${row?.['picked_quantity'] ? row?.['picked_quantity'] : 0}</b>`;
                        },
                    },
                ],
                rowCallback: function (row, data, index) {
                    let itemEle = row.querySelector('.table-row-item');
                    if (itemEle) {
                        let dataS2 = [];
                        if (data?.['product_data']) {
                            dataS2 = [data?.['product_data']];
                        }
                        prodTable.loadInitS2($(itemEle), dataS2);
                        $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                    }
                },
                drawCallback: function () {
                    if ($eleSO.attr('data-lo')) {
                        prodTable.dtbProductLeasedHDCustom();
                    }
                },
            });
        };

        dataTablePW(data) {
            let _this = this;
            let config = _this.getProdConfig;
            $tablePW.DataTableDefault({
                data: data ? data : [],
                ordering: false,
                paginate: false,
                info: false,
                columns: [
                    {
                        targets: 0,
                        class: 'w-35',
                        render: (data, type, row) => {
                            if (row?.['is_regis_so'] === true) {
                                let project = `<span class="badge badge-primary badge-outline mr-1">${$trans.attr('data-other-order')}: ${row?.['sale_order']?.['code']}</span>`;
                                if ($eleSO.attr('data-so')) {
                                    let dataSO = JSON.parse($eleSO.attr('data-so'));
                                    if (row?.['sale_order_data']?.['id'] === dataSO?.['id']) {
                                        project = `<span class="badge badge-primary badge-outline mr-1">${$trans.attr('data-current-order')}</span>`;
                                    }
                                }
                                let target = ".cl-" + row?.['sale_order_data']?.['id'].replace(/-/g, "");
                                return `<div class="d-flex align-items-center">
                                            <button 
                                                type="button" 
                                                class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-xs cl-parent mr-1" 
                                                data-bs-toggle="collapse"
                                                data-bs-target="${target}"
                                                data-bs-placement="top"
                                                aria-expanded="true"
                                                aria-controls="newGroup"
                                                data-group-order="${row?.['group_order']}"
                                            >
                                                <span class="icon"><i class="fas fa-chevron-down"></i></span>
                                            </button>
                                            ${project}<span class="badge badge-pink badge-outline">${$trans.attr('data-available')}: ${row?.['available_stock']}</span>
                                        </div>`;
                            }
                            if (row?.['is_regis_common'] === true) {
                                let target = ".cl-is_regis_common";
                                return `<div class="d-flex align-items-center">
                                            <button 
                                                type="button" 
                                                class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-xs cl-parent mr-1" 
                                                data-bs-toggle="collapse"
                                                data-bs-target="${target}"
                                                data-bs-placement="top"
                                                aria-expanded="true"
                                                aria-controls="newGroup"
                                                data-group-order="${row?.['group_order']}"
                                            >
                                                <span class="icon"><i class="fas fa-chevron-down"></i></span>
                                            </button>
                                            <span class="badge badge-primary badge-outline mr-1">${$trans.attr('data-common-wh')}</span><span class="badge badge-pink badge-outline">${$trans.attr('data-available')}: ${row?.['available_stock']}</span>
                                        </div>`;
                            }
                            let checked = '';
                            let hidden = '';
                            if (row?.['is_checked'] === true) {
                                checked = 'checked';
                            }
                            if (row?.['product']?.['general_traceability_method'] === 0) {
                                hidden = 'hidden';
                            }
                            return `<div class="form-check form-check-lg">
                                        <input
                                            type="radio"
                                            class="form-check-input table-row-checkbox cl-child"
                                            id="pw-${row?.['id'].replace(/-/g, "")}"
                                            data-id="${row?.['id']}"
                                            ${checked}
                                            ${hidden}
                                        >
                                        <label class="form-check-label" for="pw-${row?.['id'].replace(/-/g, "")}">${row?.['warehouse']?.['title']}</label>
                                        <span class="badge badge-light badge-outline">${row?.['warehouse']?.['code']}</span>
                                    </div>`;
                        }
                    },
                    {
                        targets: 1,
                        class: 'w-15',
                        render: (data, type, row) => {
                            if (row?.['is_regis_so'] === true || row?.['is_regis_common'] === true) {
                                return ``;
                            }
                            return `<span class="table-row-uom-delivery">${row?.['uom_delivery']?.['title'] ? row?.['uom_delivery']?.['title'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-20',
                        render: (data, type, row) => {
                            if (row?.['is_regis_so'] === true || row?.['is_regis_common'] === true) {
                                return ``;
                            }
                            return `<p class="table-row-available">${row?.['available_stock']}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        class: 'w-25',
                        render: (data, type, row, meta) => {
                            if (row?.['is_regis_so'] === true || row?.['is_regis_common'] === true) {
                                return ``;
                            }
                            let disabled = row?.['product_amount'] <= 0 ? 'disabled' : '';
                            if ($form.attr('data-method').toLowerCase() === 'get') {
                                disabled = 'disabled';
                            }
                            if ($form.attr('data-method').toLowerCase() === 'put') {
                                // condition 1 for config 3, condition 2 for config 4
                                if (config?.['is_picking'] && !config?.['is_partial_ship'] ||
                                    (config?.['is_picking'] && config?.['is_partial_ship'] && row?.['picked_ready'] === 0)
                                ) disabled = 'disabled';
                                if ([1, 2].includes(row?.['product']?.['general_traceability_method'])) {
                                    disabled = 'disabled';
                                }
                            }
                            return `<input class="form-control table-row-picked text-black" type="number" id="warehouse_stock-${meta.row}" value="${row?.['picked_quantity'] ? row?.['picked_quantity'] : 0}" ${disabled}>`;
                        }
                    },
                ],
                drawCallback: function () {
                    prodTable.setupCollapse();
                    prodTable.loadEventRadio($tablePW);
                    prodTable.loadEventPW();
                },
            })
        };

        dataTableTableLot(data) {
            $tableLot.not('.dataTable').DataTableDefault({
                data: data ? data : [],
                ordering: false,
                paginate: false,
                info: false,
                columns: [
                    {
                        targets: 0,
                        class: 'w-25',
                        render: (data, type, row) => {
                            return `<p>${row?.['lot_number']}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        class: 'w-10',
                        render: (data, type, row) => {
                            return `<p class="table-row-quantity-init">${row?.['available_stock']}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-15',
                        render: (data, type, row) => {
                            if (row?.['expire_date']) {
                                return `<p>${moment(row?.['expire_date'], 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')}</p>`;
                            } else {
                                return `<p>--</p>`;
                            }
                        }
                    },
                    {
                        targets: 3,
                        class: 'w-15',
                        render: (data, type, row) => {
                            if (row?.['manufacture_date']) {
                                return `<p>${moment(row?.['manufacture_date'], 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')}</p>`;
                            } else {
                                return `<p>--</p>`;
                            }
                        }
                    },
                    {
                        targets: 4,
                        class: 'w-20',
                        render: (data, type, row) => {
                            let disabled = '';
                            if ($form.attr('data-method').toLowerCase() === 'get') {
                                disabled = 'disabled';
                            }
                            return `<input class="form-control table-row-quantity-delivery" type="number" value="${row?.['quantity_delivery'] ? row?.['quantity_delivery'] : 0}" ${disabled}>`;
                        }
                    },
                ],
            });
        };

        dataTableTableSerial(data) {
            let checkAll = $tableSerial[0].querySelector('.table-row-checkbox-all');
            if (checkAll) {
                checkAll.checked = false;
            }
            $tableSerial.not('.dataTable').DataTableDefault({
                data: data ? data : [],
                columns: [
                    {
                        targets: 0,
                        class: 'w-5',
                        render: (data, type, row) => {
                            let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                            if ($form.attr('data-method').toLowerCase() === 'put') {
                                if (row?.['is_checked'] === true) {
                                    return `<div class="form-check form-check-lg">
                                                <input
                                                    type="checkbox"
                                                    class="form-check-input table-row-checkbox"
                                                    data-id="${row?.['id']}"
                                                    data-row="${dataRow}"
                                                    checked
                                                >
                                            </div>`;
                                }
                                return `<div class="form-check form-check-lg">
                                            <input
                                                type="checkbox"
                                                class="form-check-input table-row-checkbox"
                                                data-id="${row?.['id']}"
                                                data-row="${dataRow}"
                                            >
                                        </div>`;
                            } else {
                                if (row?.['is_checked'] === true) {
                                    return `<div class="form-check form-check-lg">
                                        <input
                                            type="checkbox"
                                            class="form-check-input table-row-checkbox"
                                            data-id="${row?.['id']}"
                                            data-row="${dataRow}"
                                            checked
                                            disabled
                                        >
                                    </div>`;
                                }
                                return `<div class="form-check form-check-lg">
                                        <input
                                            type="checkbox"
                                            class="form-check-input table-row-checkbox"
                                            data-id="${row?.['id']}"
                                            data-row="${dataRow}"
                                            disabled
                                        >
                                    </div>`;
                            }
                        }
                    },
                    {
                        targets: 1,
                        class: 'w-15',
                        render: (data, type, row) => {
                            return `<p>${row?.['vendor_serial_number']}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-15',
                        render: (data, type, row) => {
                            return `<p>${row?.['serial_number']}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        class: 'w-15',
                        render: (data, type, row) => {
                            if (row?.['warranty_start']) {
                                return `<p>${moment(row?.['warranty_start'], 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')}</p>`;
                            } else {
                                return `<p>--</p>`;
                            }
                        }
                    },
                    {
                        targets: 4,
                        class: 'w-15',
                        render: (data, type, row) => {
                            if (row?.['warranty_end']) {
                                return `<p>${moment(row?.['warranty_end'], 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')}</p>`;
                            } else {
                                return `<p>--</p>`;
                            }
                        }
                    },
                ],
                drawCallback: function () {
                    prodTable.loadEventCheckboxAll($tableSerial);
                    let checkAll = $tableSerial[0].querySelector('.table-row-checkbox-all');
                    if (checkAll) {
                        checkAll.checked = false;
                    }
                },
            });
        };

        // dtb header custom
        dtbProductNewHDCustom() {
            let wrapper$ = $tableProductNew.closest('.dataTables_wrapper');
            let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
            headerToolbar$.prepend(textFilter$);

            if (textFilter$.length > 0) {
                textFilter$.css('display', 'flex');
                // Check if the button already exists before appending
                if (!$('#label-new-product').length) {
                    let $group = $(`<b id="label-new-product">New products</b>`);
                    textFilter$.append(
                        $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                    );
                }
            }
        };

        dtbProductLeasedHDCustom() {
            let wrapper$ = $tableProductLeased.closest('.dataTables_wrapper');
            let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
            headerToolbar$.prepend(textFilter$);

            if (textFilter$.length > 0) {
                textFilter$.css('display', 'flex');
                // Check if the button already exists before appending
                if (!$('#label-leased-product').length) {
                    let $group = $(`<b id="label-leased-product">Leased products</b>`);
                    textFilter$.append(
                        $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                    );
                }
            }
        };

        loadCheckExceedQuantity() {
            let check = true;
            $tableLot.DataTable().rows().every(function () {
                let row = this.node();
                let availableELe = row.querySelector('.table-row-quantity-init');
                let deliverELe = row.querySelector('.table-row-quantity-delivery');
                if (availableELe && deliverELe) {
                    if (availableELe.innerHTML && deliverELe.value) {
                        let available = parseFloat(availableELe.innerHTML);
                        let delivered = parseFloat(deliverELe.value);
                        if (delivered > available) {
                            check = false;
                            $.fn.notifyB({description: $trans.attr('data-valid-delivery-amount')}, 'failure');
                            return false;
                        }
                    }
                }
            });
            $tablePW.DataTable().rows().every(function () {
                let row = this.node();
                let availableELe = row.querySelector('.table-row-available');
                let deliverELe = row.querySelector('.table-row-picked');
                if (availableELe && deliverELe) {
                    if (availableELe.innerHTML && deliverELe.value) {
                        let available = parseFloat(availableELe.innerHTML);
                        let delivered = parseFloat(deliverELe.value);
                        if (delivered > available) {
                            check = false;
                            $.fn.notifyB({description: $trans.attr('data-valid-delivery-amount')}, 'failure');
                            return false;
                        }
                    }
                }
            });
            $tableProductNew.DataTable().rows().every(function () {
                let row = this.node();
                let remainELe = row.querySelector('.table-row-remain');
                let deliverELe = row.querySelector('.table-row-picked');
                if (remainELe && deliverELe) {
                    if (remainELe.innerHTML && deliverELe.innerHTML) {
                        let remain = parseFloat(remainELe.innerHTML);
                        let delivered = parseFloat(deliverELe.innerHTML);
                        if (delivered > remain) {
                            check = false;
                            $.fn.notifyB({description: $trans.attr('data-valid-delivery-amount')}, 'failure');
                            return false;
                        }
                    }
                }
            });
            $tableProductLeased.DataTable().rows().every(function () {
                let row = this.node();
                let remainELe = row.querySelector('.table-row-remain');
                let deliverELe = row.querySelector('.table-row-picked');
                if (remainELe && deliverELe) {
                    if (remainELe.innerHTML && deliverELe.innerHTML) {
                        let remain = parseFloat(remainELe.innerHTML);
                        let delivered = parseFloat(deliverELe.innerHTML);
                        if (delivered > remain) {
                            check = false;
                            $.fn.notifyB({description: $trans.attr('data-valid-delivery-amount')}, 'failure');
                            return false;
                        }
                    }
                }
            });

            return check;
        };

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
                        }">${item?.full_address ? item.full_address : item}</textarea><button type="button" class="btn btn-primary btn_logistics_choise">${
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

    // Store data
    class DeliveryStoreDataHandle {
        static storeData() {
            // Lưu lại data row của tất cả dtb & draw() lại row, dòng checked sẽ được lưu thêm data sub từ các dtb phụ
            // dtb data cố định => store hết, dtb data động callAjax => store data có thay đổi

            let lotData = [];
            let serialData = [];
            let pwData = [];
            let deliveryData = [];

            $tableLot.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $tableLot.DataTable().row(row).index();
                let $row = $tableLot.DataTable().row(rowIndex);
                let rowData = $row.data();

                let deliverEle = row.querySelector('.table-row-quantity-delivery');
                if (deliverEle) {
                    if (deliverEle.value) {
                        rowData['quantity_delivery'] = parseFloat(deliverEle.value);
                    }
                }

                if (rowData?.['quantity_delivery'] > 0) {
                    lotData.push({
                        'product_warehouse_lot_id': rowData?.['id'],
                        'product_warehouse_lot_data': rowData,
                        'quantity_initial': rowData?.['available_stock'],
                        'quantity_delivery': rowData?.['quantity_delivery'],
                    })
                }
            });

            $tableSerial.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $tableSerial.DataTable().row(row).index();
                let $row = $tableSerial.DataTable().row(rowIndex);
                let rowData = $row.data();
                let checkEle = row?.querySelector('.table-row-checkbox');
                if (checkEle) {
                    if (checkEle.checked === true) {
                        serialData.push({
                            'product_warehouse_serial_id': rowData?.['id'],
                            'product_warehouse_serial_data': rowData,
                        })
                    }
                }
            });

            $tablePW.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $tablePW.DataTable().row(row).index();
                let $row = $tablePW.DataTable().row(rowIndex);
                let rowData = $row.data();

                // update serial_data & lot_data cho dòng đang được chọn
                let checkedEle = row.querySelector('.table-row-checkbox:checked');
                if (checkedEle) {
                    rowData['serial_data'] = serialData;
                    rowData['lot_data'] = lotData;
                }
                // SP không quản lý lô hay serial thì số lượng nhập lấy số nhập trực tiếp
                let deliverEle = row.querySelector('.table-row-picked');
                if (deliverEle) {
                    if (deliverEle.value) {
                        rowData['picked_quantity'] = parseFloat(deliverEle.value);
                    }
                }
                // Kiểm tra SP có quản lý lô hay serial thì số lượng nhập lấy tổng nhập của lô hay serial
                if (rowData?.['product_data']?.['general_traceability_method'] === 1) {
                    if (rowData?.['lot_data']) {
                        let picked = 0;
                        for (let lotData of rowData?.['lot_data'] ? rowData?.['lot_data'] : []) {
                            picked += lotData?.['quantity_delivery'];
                        }
                        rowData['picked_quantity'] = picked;
                    }
                }
                if (rowData?.['product_data']?.['general_traceability_method'] === 2) {
                    if (rowData?.['serial_data']) {
                        rowData['picked_quantity'] = rowData?.['serial_data'].length;
                    }
                }

                $tablePW.DataTable().row(rowIndex).data(rowData).draw();
                if (rowData?.['picked_quantity'] > 0) {
                    pwData.push(rowData);
                }

                if (checkedEle) {
                    let checkEle = row.querySelector('.table-row-checkbox');
                    if (checkEle) {
                        checkEle.checked = true;
                    }
                }
            });

            $tableProductNew.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $tableProductNew.DataTable().row(row).index();
                let $row = $tableProductNew.DataTable().row(rowIndex);
                let rowData = $row.data();

                // update delivery_data cho dòng đang được chọn
                let checkedEle = row.querySelector('.table-row-checkbox:checked');
                if (checkedEle) {
                    rowData['delivery_data'] = pwData;
                }
                let picked = 0;
                if (rowData?.['delivery_data']) {
                    for (let deliData of rowData?.['delivery_data'] ? rowData?.['delivery_data'] : []) {
                        picked += deliData?.['picked_quantity'];
                    }
                }
                rowData['picked_quantity'] = picked;

                $tableProductNew.DataTable().row(rowIndex).data(rowData);
                deliveryData.push(rowData);

                if (checkedEle) {
                    let checkEle = row.querySelector('.table-row-checkbox');
                    if (checkEle) {
                        checkEle.checked = true;
                    }
                }
            });

            $tableProductLeased.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $tableProductLeased.DataTable().row(row).index();
                let $row = $tableProductLeased.DataTable().row(rowIndex);
                let rowData = $row.data();

                // update delivery_data cho dòng đang được chọn
                let checkedEle = row.querySelector('.table-row-checkbox:checked');
                if (checkedEle) {
                    rowData['delivery_data'] = pwData;
                }
                let picked = 0;
                for (let deliData of rowData?.['delivery_data'] ? rowData?.['delivery_data'] : []) {
                    picked += deliData?.['picked_quantity'];
                }
                rowData['picked_quantity'] = picked;

                $tableProductLeased.DataTable().row(rowIndex).data(rowData);
                deliveryData.push(rowData);

                if (checkedEle) {
                    let checkEle = row.querySelector('.table-row-checkbox');
                    if (checkEle) {
                        checkEle.checked = true;
                    }
                }
            });

            return true;
        };

    }

    let prodTable = new prodDetailUtil();

    // base on config setup HTML show hide default
    function prepareHTMLConfig(config) {
        const $htmlElm = $('.html-table-title')
        const $titleTable = $('.table-handle-btn')
        // button html
        if (config?.['is_picking']) $('button[form="delivery_form"]').attr('disabled', true)

        // table setup
        if (!config?.['is_picking'] && !config?.['is_partial_ship']) $titleTable.html($('.case-01', $htmlElm).html())
        else if (config?.['is_picking'] && !config?.['is_partial_ship']) $titleTable.html($('.case-02', $htmlElm).html())
        else $titleTable.html($('.case-03', $htmlElm).html())
    }

    function getPageDetail() {
        $.fn.callAjax2({
            'url': $form.attr('data-url'),
            'method': 'GET'
        })
            .then((req) => {

                const res = $.fn.switcherResp(req);
                prepareHTMLConfig(res?.['config_at_that_point'])
                $x.fn.renderCodeBreadcrumb(res);
                $.fn.compareStatusShowPageAction(res);
                if ($('#delivery_form').attr('data-method') === 'GET') {
                    new PrintTinymceControl().render('1373e903-909c-4b77-9957-8bcf97e8d6d3', res, false);
                }
                let formGroup = $eleSO[0].closest('.form-group');
                if (formGroup) {
                    if (res?.['sale_order_data']?.['code']) {
                        $eleSO.val(res?.['sale_order_data']?.['code']);
                        $eleSO.attr('data-so', JSON.stringify(res?.['sale_order_data']));
                    }
                    if (res?.['lease_order_data']?.['code']) {
                        for (let label of formGroup.querySelectorAll('.deli-for')) {
                            label.setAttribute('hidden', 'true');
                            if (label.classList.contains('lease-order')) {
                                label.removeAttribute('hidden');
                            }
                        }
                        $eleSO.val(res?.['lease_order_data']?.['code']);
                        $eleSO.attr('data-lo', JSON.stringify(res?.['lease_order_data']));
                        $('#scroll-table-lease').removeAttr('hidden');
                    }
                }


                if (res.estimated_delivery_date) {
                    const deliveryDate = moment(res.estimated_delivery_date, 'YYYY-MM-DD hh:mm:ss').format(
                        'DD/MM/YYYY')
                    $('#inputDeliveryDate').val(deliveryDate)
                }
                if (res.actual_delivery_date) {
                    const actualDate = moment(res.actual_delivery_date, 'YYYY-MM-DD hh:mm:ss').format(
                        'DD/MM/YYYY')
                    $('#inputActualDate').val(actualDate)
                }
                if (res?.['customer_data']) {
                    const $cusID = $('#customer_id')
                    $cusID.attr(res?.['customer_data']?.['id'])
                    $cusID.val(res?.['customer_data']?.['title'])
                    const cusContent = DataTableAction.item_view(res?.['customer_data'], $url.attr('data-customer'))
                    $cusID.prev().find('.dropdown-menu').html(cusContent)
                    prodDetailUtil.modalLogistics(res?.['customer_data']?.['id'], res?.['sale_order_data'])
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

                // reset data stock
                if ($form.attr('data-method').toLowerCase() === 'put' && res?.['system_status'] !== 0) {
                    if (res.hasOwnProperty('products') && Array.isArray(res?.['products'])) {
                        for (let product of res?.['products']) {
                            if (product.hasOwnProperty('delivery_data') && Array.isArray(product?.['delivery_data'])) {
                                for (let deliData of product?.['delivery_data']) {
                                    deliData['stock'] = 0;
                                }
                            }
                        }
                    }
                }

                prodTable.setProdList = res.products
                prodTable.setProdConfig = res?.['config_at_that_point']

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

                // check if state delivery is finish then hidden btn edit page
                if (res?.['state'] === 2) {
                    let $btn = $('#btn-enable-edit');
                    if ($btn.length) {
                        $btn[0].setAttribute('hidden', 'true');
                    }
                }
                // after prepare HTML run event click button done
                btnDoneClick()
                // reset data for edit page
                if ($form.attr('data-method').toLowerCase() === 'put' && res?.['system_status'] !== 0) {
                    for (let productData of res?.['products']) {
                        for (let deliveryData of productData?.['delivery_data']) {
                            deliveryData['lot_data'] = [];
                            deliveryData['serial_data'] = [];
                        }
                    }
                }
                // file
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: true,
                    enable_download: true,
                    data: res?.['attachments'],
                });
                // wf
                WFRTControl.setWFRuntimeID(res?.['workflow_runtime_id']);
                // wf initial
                WFRTControl.setWFInitialData('orderdeliverysub');
            })
    }

    function formSubmit() {
        $form.on('submit', function (e) {
            e.preventDefault();
            const $storedData = JSON.parse($('#request-data').text())
            let _form = new SetupFormSubmit($form);
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
            if (_form.dataForm.hasOwnProperty('attachment')) {
                putData['attachments'] = $x.cls.file.get_val(_form.dataForm?.['attachment'], []);
            }
            putData['delivery_logistic'] = {
                "shipping_address": $('#textareaShippingAddress').val(),
                "billing_address": $('#textareaBilling').val(),
            }

            putData['employee_inherit_id'] = $('#selectEmployeeInherit').val()

            let prodSub = []
            for (let prod of prodTable.getProdList) {
                if (prod?.['picked_quantity'] > 0) {
                    prodSub.push({
                        'product_id': prod?.['product_data']?.['id'],
                        'done': prod?.['picked_quantity'],
                        'delivery_data': prod?.['delivery_data'],
                        'product_quantity_leased_data': prod?.['product_quantity_leased_data'],
                        'order': prod?.['order'],
                    })
                }
            }
            if (!prodSub.length && $('#wrap-employee_inherit').attr('data-is_lead').toLowerCase() !== 'true') {
                // ko co and ko fai lead
                $.fn.notifyB({description: $trans.attr('data-error-done')}, 'failure')
                return false
            }
            else putData.products = prodSub
            _form.dataForm = putData;
            // submit run WF
            WFRTControl.callWFSubmitForm(_form);
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
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        locale: {
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
        autoApply: true,
    });
    $('#inputDeliveryDate').val(null).trigger('change')
    $('#inputActualDate').val(null).trigger('change')

    // run get detail func
    getPageDetail()
    // init Dtb
    prodTable.dataTableProductNew();
    prodTable.dataTableProductLeased();
    prodTable.dataTablePW();
    prodTable.dataTableTableLot();
    prodTable.dataTableTableSerial();
    // event
    $tableProductNew.on('click', '.table-row-checkbox', function () {
        let row = this.closest('tr');
        if (row) {
            let rowIndex = $tableProductNew.DataTable().row(row).index();
            let $row = $tableProductNew.DataTable().row(rowIndex);
            let rowData = $row.data();

            let targetItemData = rowData?.['product_data'];
            if (rowData?.['offset_data']?.['id']) {
                targetItemData = rowData?.['offset_data'];
            }
            prodTable.loadCallAjaxPW(targetItemData, rowData);
        }
        return true;
    });

    $tableProductLeased.on('click', '.table-row-checkbox', function () {
        let row = this.closest('tr');
        if (row) {
            let rowIndex = $tableProductLeased.DataTable().row(row).index();
            let $row = $tableProductLeased.DataTable().row(rowIndex);
            let rowData = $row.data();

            prodTable.loadCallAjaxPW(rowData?.['product_data'], rowData);
        }
        return true;
    });

    $tablePW.on('change', '.table-row-picked', function () {
        let row = this.closest('tr');
        if (row) {
            DeliveryStoreDataHandle.storeData();
            let check = prodTable.loadCheckExceedQuantity();
            if (check === false) {
                let rowIndex = $tablePW.DataTable().row(row).index();
                let $row = $tablePW.DataTable().row(rowIndex);
                let rowData = $row.data();
                rowData['picked_quantity'] = 0;
                $tablePW.DataTable().row(rowIndex).data(rowData);
                DeliveryStoreDataHandle.storeData();
            }
        }
    });

    $tablePW.on('click', '.cl-parent', function () {
        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
    });

    $tableLot.on('change', '.table-row-quantity-delivery', function () {
        prodTable.formatNum(this);
        prodTable.loadDeliverByLot(this);
        return true;
    });

    $tableSerial.on('click', '.table-row-checkbox', function () {
        if (this.checked === false) {
            let checkAll = $tableSerial[0].querySelector('.table-row-checkbox-all');
            if (checkAll) {
                checkAll.checked = false;
            }
        }
        prodTable.loadDeliverBySerial(this);
        return true;
    });
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
            else if (item?.['is_not_inventory']){
                // cho case có prod trong kho
                const listPromise = await $.fn.callAjax(
                    $url.attr('data-warehouse-prod'),
                    'GET',
                    {'product_id': item.product_data.id, 'uom_id': item.uom_data.id}
                )
                if (listPromise.data.status === 200) {
                    prodCheck = listPromise.data?.['warehouse_stock']
                }
                let flag = false
                item.picked_quantity = 0
                item.delivery_data = []
                for (const value of prodCheck) {
                    if (item.picked_quantity !== item.delivery_quantity) {
                        // kiem tra pick chưa đủ
                        const remain = item.delivery_quantity - item.picked_quantity
                        if (value?.['product_amount'] > 0) {
                            let temp = {
                                'warehouse': value.id,
                                'uom': item.uom_data.id,
                                'stock': 0
                            }
                            if (value?.['product_amount'] >= remain) {
                                temp.stock = remain
                                item.picked_quantity += remain
                            } else {
                                temp.stock = value?.['product_amount']
                                item.picked_quantity += value?.['product_amount']
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
            else if (!item?.['is_not_inventory'])
                // cho case có prod là dịch vụ
                item.picked_quantity = item.ready_quantity
        }
        prodTable.setProdList = tableData
        $('#dtbPickingProductList').DataTable().clear().rows.add(tableData).draw();
    }
}, (jQuery));
