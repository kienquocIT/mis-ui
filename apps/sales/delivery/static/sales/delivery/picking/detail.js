class pickupUtil {
    prodList = [];
    pickingData = {};
    warehouseList = [];
    // constructor of warehouseList: object{}
    // {
    //   productID: {warehouseID1: product_amount1, warehouseID2: product_amount2},
    //   productID2: {warehouseID3: product_amount3, warehouseID4: product_amount4}
    // }

    set setProdList(data) {
        this.prodList = data
    }

    get getProdList() {
        return this.prodList
    }

    set setPicking(data) {
        this.pickingData = data
    }

    get getPicking() {
        return this.pickingData
    }

    set setWarehouseList(data) {
        this.warehouseList = data
    }

    get getWarehouseList() {
        return this.warehouseList
    }

    // Picked quantity on change
    pickedQuantityUtil(ele, idx) {
        $(ele).removeClass('is-invalid cl-red');
        let currentList = this.getProdList
        let row = ele.closest('tr');
        if (row) {
            let eleAvailable = row.querySelector('.pw-available');
            if (eleAvailable) {
                let value = parseInt(ele.value);
                let available = parseInt(eleAvailable.innerHTML);
                let remain = parseInt(currentList[idx]['remaining_quantity']);
                currentList[idx]['picked_quantity'] = value;
                if (value > available) {
                    $(ele).addClass('is-invalid cl-red');
                    $.fn.notifyB({description: $('#trans-factory').attr('data-exceed-available')}, 'failure');
                    ele.value = 0;
                    currentList[idx]['picked_quantity'] = 0;
                }
                if (value > remain) {
                    $(ele).addClass('is-invalid cl-red');
                    $.fn.notifyB({description: $('#trans-factory').attr('data-exceed-remain')}, 'failure');
                    ele.value = 0;
                    currentList[idx]['picked_quantity'] = 0;
                }
                this.setProdList = currentList
            }
        }
        // nhập đủ tự check all
        let countTemp = 0
        let sub = this.getPicking
        for (let item of currentList) {
            countTemp += item?.['picked_quantity']
        }
        if (countTemp === sub?.['remaining_quantity'])
            $('#idxDoneAll').prop('checked', true)
        else
            $('#idxDoneAll').prop('checked', false)
        $('.cus-loading').remove()
    }

    checkAllHandle() {
        let _this = this
        $('#idxDoneAll').off().on('change', function () {
            let currentList = _this.getProdList
            let $table = $('#dtbPickingProductList')
            // Cập nhật lại giá trị trên mỗi dòng
            for (let [idx, item] of currentList.entries()) {
                if (this.checked)
                    currentList[idx]['picked_quantity'] = currentList[idx]['remaining_quantity']
                else
                    currentList[idx]['picked_quantity'] = 0
                // update cell của table mà ko cần draw lại toàn bộ table
                $table.DataTable().cell(idx, 6).data(currentList[idx]['picked_quantity']).draw(true)
                // check if not enough stock then update picked_quantity = 0
                let rowElement = $table.DataTable().row(idx).nodes();
                if (rowElement) {
                    let elePick = rowElement[0].querySelector('.table-row-quantity-pick');
                    let elePWStock = rowElement[0].querySelector('.product-warehouse-stock');
                    if (elePick && elePWStock) {
                        if (elePWStock.innerHTML) {
                            if (parseFloat(elePWStock.innerHTML) < currentList[idx]['picked_quantity']) {
                                elePick.value = 0;
                                currentList[idx]['picked_quantity'] = 0;
                                $.fn.notifyB({description: $('#trans-factory').attr('data-outstock')}, 'failure');
                                $(elePick).addClass('is-invalid cl-red');
                            }
                        }
                    }
                }

            }
            _this.setProdList = currentList
        })
    }

    async getWarehouseStock(dataProd) {
        const _this = this
        const warehouseID = $('#inputWareHouse').val();
        let currentWHList = this.getWarehouseList
        let checkResult = 0
        if (dataProd && dataProd?.['product_data']?.['id'] && dataProd?.['uom_data']?.['id']){
            let prodKey = `${dataProd?.['product_data']?.['id']}.${dataProd?.['uom_data']?.['id']}`
            if (currentWHList?.[prodKey] && currentWHList?.[prodKey]?.[warehouseID])
                checkResult = currentWHList[prodKey][warehouseID]
            else {
                let callData = await $.fn.callAjax2(
                    {
                        'url': $('#url-factory').attr('data-product-warehouse'),
                        'method': 'GET',
                        'data': {
                            'product_id': dataProd?.['product_data']?.['id'],
                            'warehouse_id': warehouseID,
                        },
                        'isDropdown': true,
                    }
                )
                if(callData.status === 200) {
                    let res = $.fn.switcherResp(callData);
                    res = res?.['warehouse_products_list'];
                    if (res.length){
                        let dataFormatted = {}
                        for (let productWarehouse of res){
                            let finalRatio = 1;
                            let uomSORatio = dataProd?.['uom_data']?.['ratio'];
                            let uomWHRatio = productWarehouse?.['uom']?.['ratio'];
                            if (uomSORatio && uomWHRatio) {
                                finalRatio = uomWHRatio / uomSORatio;
                            }
                            let available_stock = (productWarehouse?.['stock_amount'] - productWarehouse?.['picked_ready']) * finalRatio;
                            dataFormatted[productWarehouse?.['warehouse']?.['id']] = available_stock
                            if (productWarehouse?.['warehouse']?.['id'] === warehouseID) checkResult = available_stock
                        }
                        currentWHList[prodKey] = dataFormatted;
                        _this.setWarehouseList = currentWHList;
                    }
                }
            }
        }
        return checkResult
    }
}

function getWarehouse() {
    const $elmWarehouse = $('#inputWareHouse')
    let defaultData = $elmWarehouse.attr('data-onload');
    if (!defaultData) {
        $.fn.callAjax($elmWarehouse.attr('data-url'), 'get')
            .then((req) => {
                let res = $.fn.switcherResp(req);
                if (res.hasOwnProperty('warehouse_list')) {
                    let firstData = res.warehouse_list[0];
                    $elmWarehouse.attr('data-onload', JSON.stringify({
                        'id': firstData.id,
                        'title': firstData.title
                    }));
                    $elmWarehouse.initSelect2();
                }
            })
    }
}

$(async function () {
    // declare variable
    const pickupInit = new pickupUtil();

    let $form = $('#picking_form');
    let dataCompanyConfig = await DocumentControl.getCompanyConfig();
    let $urlFact = $('#url-factory');

    // init date picker
    $('.date-picker').each(function () {
        $(this).daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY',
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
            autoUpdateInput: false,
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
        });
        $(this).val('').trigger('change');
    })

    // call data when page loaded
    $.fn.callAjax(
        $('#idxUrlPickingDetail').text(),
        'GET',
        {},
        true,
    ).then((resp) => {
            let data = $.fn.switcherResp(resp);
            // load sale order
            pickupInit.setPicking = data?.['picking_detail']
            data = data?.['picking_detail']
            $x.fn.renderCodeBreadcrumb(data);
            let $saleOrder = $('#inputSaleOrder');
            $saleOrder.val(data?.['sale_order_data']?.['code']);
            $saleOrder.attr('data-so', JSON.stringify(data?.['sale_order_data']));
            // state
            let state = data?.state;
            if (state !== undefined && Number.isInteger(state)) {
                let letStateChoices = JSON.parse($('#dataStateChoices').text());
                let templateEle = `<span class="badge badge-warning badge-outline">{0}</span>`;
                switch (state) {
                    case 0:
                        templateEle = `<span class="badge badge-info badge-outline">{0}</span>`;
                        break
                    case 1:
                        templateEle = `<span class="badge badge-success badge-outline">{0}</span>`;
                        $('button[form="picking_form"]').attr('disabled', true)
                        break
                }
                $('#inputState').append(templateEle.format_by_idx(letStateChoices[state]));
            }

            // picking delivery date
            let estimate_delivery_date = '';
            if (data?.['estimated_delivery_date']) {
                estimate_delivery_date = moment(data?.['estimated_delivery_date'], 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY');
            }
            $('#inputEstimateDeliveryDate').val(estimate_delivery_date);

            // warehouse
            let warehouse_data = data?.['ware_house_data'];
            if (warehouse_data.hasOwnProperty('code')) {
                $('#inputWareHouse').append(
                    `<option value="{0}" selected>{1}</option>`.format_by_idx(
                        warehouse_data['id'],
                        warehouse_data['title'],
                    )
                ).initSelect2()
            } else {
                // load default warehouse
                getWarehouse(pickupInit)
            }

            // descriptions
            let remarks = data?.['remarks']
            if (remarks) {
                $('#inputRemarks').val(remarks);
            }
            const toLocation = data?.to_location
            if (toLocation) $('#inputToLocation').val(toLocation)

            if (data?.employee_inherit) {
                $('#selectEmployeeInherit').initSelect2().val(data.employee_inherit.id).trigger('change')
            }

            // load product list
            loadProductList(
                data?.['products']
            )
        }
    )

    function getRegisConfig() {
        let $eleSO = $('#inputSaleOrder');
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
    }

    function setupDataPW(dataSrc, warehouseID) {
        let data = {};
        for (let pwh of dataSrc) {
            if (pwh?.['warehouse']?.['id'] === warehouseID) {
                if (Object.keys(data).length === 0) {
                    data = pwh;
                } else {
                    data['available_stock'] += pwh['available_stock'];
                    data['available_picked'] += pwh['available_picked'];
                }
            }
        }
        return data;
    }

    function getStockByProdID(prod, $menuDD) {
        let $elmTrans = $('#trans-factory')
        let htmlContent = `<h6 class="dropdown-header header-wth-bg">${$('#base-trans-factory').attr('data-more-info')}</h6>`;
        let $eleWH = $('#inputWareHouse');
        let warehouseID = $eleWH.val();

        let url = $urlFact.attr('data-product-warehouse');
        let dataParam = {
            'product_id': prod?.['product_data']?.['id'],
            'warehouse_id': warehouseID,
        };
        let keyResp = 'warehouse_products_list';
        let dataRegisConfig = getRegisConfig();
        let isRegis = dataRegisConfig?.['isRegis'];
            let dataSO = dataRegisConfig?.['dataSO'];
            if (isRegis === true && dataSO) {
                url = $urlFact.attr('data-product-regis');
                dataParam = {
                    'so_item__sale_order_id': dataSO?.['id'],
                    'product_id': prod?.['product_data']?.['id'],
                };
                keyResp = 'regis_borrow_list';
            }

        $.fn.callAjax2(
            {
                'url': url,
                'method': 'GET',
                'data': dataParam,
                'isDropdown': true,
            }
        ).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data.hasOwnProperty(keyResp) && Array.isArray(data?.[keyResp])) {
                let stock = 0;
                let picked = 0;
                let available = 0;
                let link = '';
                let warehouseTitle = '';
                let $eleWH = $('#inputWareHouse');
                let whID = $eleWH.val();
                if ($eleWH && $eleWH.length > 0) {
                    let dataWHSelected = SelectDDControl.get_data_from_idx($eleWH, $eleWH.val());
                    if (dataWHSelected?.['title']) {
                        warehouseTitle = dataWHSelected?.['title'];
                    }
                    if (dataWHSelected?.['text']) {
                        warehouseTitle = dataWHSelected?.['text'];
                    }
                }

                if (data?.[keyResp].length > 0) {
                    let dataPW = data?.[keyResp][0];
                    if (keyResp === 'regis_borrow_list') {
                        dataPW = {};
                        let dataRegis = setupDataPW(data?.[keyResp][0]?.['regis_data'], whID);
                        if (dataRegis.hasOwnProperty('available_stock') && dataRegis.hasOwnProperty('available_picked')) {
                            dataPW = dataRegis;
                        }
                        for (let borrow_data of data?.[keyResp][0]?.['borrow_data']) {
                            let dataBorrow = setupDataPW(borrow_data?.['regis_data'], whID);
                            if (dataBorrow.hasOwnProperty('available_stock') && dataBorrow.hasOwnProperty('available_picked')) {
                                if (Object.keys(dataPW).length !== 0) {
                                    dataPW['available_stock'] += dataBorrow?.['available_stock'];
                                    dataPW['available_picked'] += dataBorrow?.['available_picked'];
                                } else {
                                    dataPW = dataBorrow;
                                }
                            }
                        }
                    }
                    let finalRate = 1;
                    if (dataPW?.['uom'] && prod?.['uom_data']) {
                        if (dataPW?.['uom']?.['ratio'] && prod?.['uom_data']?.['ratio']) {
                            if (prod?.['uom_data']?.['ratio'] > 0) {
                                finalRate = dataPW?.['uom']?.['ratio'] / prod?.['uom_data']?.['ratio'];
                            }
                        }
                    }
                    stock = dataPW?.['available_stock'] * finalRate;
                    picked = dataPW?.['available_picked'] * finalRate;
                    available = (dataPW?.['available_stock'] - dataPW?.['available_picked']) * finalRate;
                    link = $('#url-factory').attr('data-product-detail').format_url_with_uuid(dataPW?.['product']?.['id']);
                }
                let areaTitle = `<div class="d-flex mb-3 border-bottom"><b class="mr-2">${$elmTrans.attr('data-warehouse')}:</b><p>${warehouseTitle}</p></div>`;
                let areaUOM = `<div class="d-flex mb-3 border-bottom"><b class="mr-2">${$elmTrans.attr('data-uom')}:</b><p>${prod?.['uom_data']?.['title']}</p></div>`;
                let areaStock = `<div class="d-flex mb-3">
                                    <div class="mr-3"><p>${$elmTrans.attr('data-stock')}</p><p>${stock}</p></div>
                                    <div class="mr-3"><p>${$elmTrans.attr('data-picked')}</p><p>${picked}</p></div>
                                    <div class="mr-3"><p>${$elmTrans.attr('data-available')}</p><p class="pw-available text-success">${available}</p></div>
                                </div>`;
                let areaView = `<div class="dropdown-divider"></div><div class="text-right">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover">
                                        <span>${$elmTrans.attr('data-view-detail')}</span>
                                        <span class="icon ml-1">
                                            <i class="bi bi-arrow-right-circle-fill"></i>
                                        </span>
                                    </a>
                                </div>`;
                htmlContent += areaTitle;
                htmlContent += areaUOM;
                htmlContent += areaStock;
                htmlContent += areaView;
                $menuDD.empty().append(htmlContent);
            }
        });
    }

    // init product list by DataTable
    function loadProductList(data) {
        pickupInit.setProdList = data
        $('#dtbPickingProductList').DataTableDefault({
            rowIdx: true,
            visibleSearchField: false,
            visiblePaging: false,
            paginate: false,
            data: pickupInit.getProdList,
            columns: [
                {
                    render: () => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-start">
                                    <div class="dropdown">
                                        <button 
                                            type="button" 
                                            class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false" data-product-id="${row?.['product_data']?.['id']}"
                                        >
                                            <span class="icon"><i class="fas fa-info-circle text-blue"></i></span>
                                         </button>
                                        <div role="menu" class="dropdown-menu w-300p mt-2 dropdown-menu-stock"></div>
                                    </div>
                                    <p class="mt-2">${row?.['product_data']?.['title']}</p>
                                </div>`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return row?.['uom_data']?.['title'];
                    }
                },
                {
                    render: (data, type, row) => {
                        return row?.['pickup_quantity'];
                    }
                },
                {
                    render: (data, type, row) => {
                        return row?.['picked_quantity_before'];
                    }
                },
                {
                    render: (data, type, row) => {
                        return row?.['remaining_quantity'];
                    }
                },
                {
                    render: (row, type, data, meta) => {
                        let isDisabled = ''
                        if (data.picked_quantity === data.remaining_quantity) isDisabled = 'disabled'
                        if ($form.attr('data-method').toLowerCase() === 'get') {
                            isDisabled = 'disabled';
                        }
                        return `<div class="row">
                                    <div class="col-xs-12 col-sm-6">
                                        <input class="form-control table-row-quantity-pick" type="number" id="prod_row-${meta.row}" 
                                        value="${data.picked_quantity}" ${isDisabled}/>
                                    </div>
                                </div>`;
                    }
                },
            ],
            rowCallback(row, data, index) {
                let menuDD = row.querySelector('.dropdown-menu-stock');
                if (menuDD) {
                    getStockByProdID(data, $(menuDD));
                }

                $(`#prod_row-${index}`, row).off().on('change', async function (e) {
                    if (this.value) {
                        // format số âm, nhiều số 0. Ex. 0001, số thập phân.
                        let value = this.value.replace("-", "").replace(/^0+(?=\d)/, '').replace(/\.\d+$/, '');
                        this.value = value
                        $('body').append('<div class="cus-loading"><div class="spinner-border" role="status">' +
                            '<span class="sr-only"></span></div></div>')
                        pickupInit.pickedQuantityUtil(this, index);
                    }
                })
            },
            drawCallback: function () {
                // xử lý event check all
                pickupInit.checkAllHandle();
            }
        });
    }

    // form submit
    jQuery.validator.setDefaults({
        debug: false,
        success: "valid"
    });

    $form.validate({
        errorElement: 'p',
        errorClass: 'is-invalid cl-red',
    })
    $form.on('submit', function (e) {
        e.preventDefault();
        let _form = new SetupFormSubmit($form);
        const $transElm = $('#trans-factory')

        if (!_form.dataForm?.warehouse_id) {
            $.fn.notifyB({description: $transElm.attr('data-error-warehouse')}, 'failure')
            return false
        }
        const pickingData = pickupInit.getPicking
        if (_form.dataForm?.estimated_delivery_date) {
            pickingData['estimated_delivery_date'] = moment(
                _form.dataForm?.['estimated_delivery_date'],
                'DD/MM/YYYY hh:mm A'
            ).format('YYYY-MM-DD hh:mm:ss');
        } else {
            delete pickingData['estimated_delivery_date']
        }

        pickingData['ware_house'] = _form.dataForm['warehouse_id']
        pickingData['remarks'] = _form.dataForm['remarks']
        pickingData['to_location'] = _form.dataForm['to_location']
        pickingData['sale_order_id'] = pickingData['sale_order_data']['id']

        const _EmployeeInherit = $('#selectEmployeeInherit').val() || ''
        if (_EmployeeInherit){
            pickingData['employee_inherit_id'] = _EmployeeInherit
            delete pickingData['employee_inherit']
        }

        let prodSub = []
        for (let prod of pickupInit.getProdList) {
            if (prod?.['picked_quantity'] > 0)
                prodSub.push({
                    'product_id': prod?.['product_data']?.['id'],
                    'done': prod?.['picked_quantity'],
                    'delivery_data': [{
                        'warehouse': _form.dataForm['warehouse_id'],
                        'uom': prod?.['uom_data']?.['id'],
                        'stock': prod?.['picked_quantity'],
                    }],
                    'order': prod?.['order'],
                })
        }
        pickingData.products = prodSub

        //call ajax to update picking
        $.fn.callAjax2({
            'url': _form.dataUrl, 'method': _form.dataMethod, 'data': pickingData
        })
            .then((resp) => {
                const data = $.fn.switcherResp(resp);
                const description = (_form.dataMethod.toLowerCase() === 'put') ? data.detail : data.message;
                if (data) {
                    $.fn.notifyB({description: description}, 'success')
                    $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                }
            }, (errs) => {
                if (errs.data.errors.hasOwnProperty('detail')) {
                    $.fn.notifyB({description: String(errs.data.errors['detail'])}, 'failure')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    })
}, (jQuery));