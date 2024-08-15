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
                let check = true;
                let value = parseInt(ele.value);
                let available = parseInt(eleAvailable.innerHTML);
                let remain = parseInt(currentList[idx]['remaining_quantity']);
                currentList[idx]['picked_quantity'] = value;
                if (value > available) {
                    check = false;
                    $.fn.notifyB({description: $('#trans-factory').attr('data-exceed-available')}, 'failure');
                }
                if (value > remain) {
                    check = false;
                    $.fn.notifyB({description: $('#trans-factory').attr('data-exceed-remain')}, 'failure');
                }
                if (check === false) {
                    $(ele).addClass('is-invalid cl-red');
                    ele.value = 0;
                    currentList[idx]['picked_quantity'] = 0;
                    for (let eleSOPick of row.querySelectorAll('.so-quantity-pick')) {
                        eleSOPick.value = 0;
                    }
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
    let $eleSO = $('#inputSaleOrder');
    let $table = $('#dtbPickingProductList');

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
            $saleOrder.html(data?.['sale_order_data']?.['code']);
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

    function getStockByProdID(prod, row) {
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
                let menuDD = row.querySelector('.dropdown-menu-stock');
                let areaPick = row.querySelector('.area-pick');
                if (menuDD && areaPick) {
                    let $menuDD = $(menuDD);
                    let link = '';
                    let dataWH = {};
                    let dataUOM = {};
                    let warehouseTitle = '';
                    let $eleWH = $('#inputWareHouse');
                    let whID = $eleWH.val();
                    let htmlStock = ``;
                    let htmlPick = ``;
                    if ($eleWH && $eleWH.length > 0) {
                        dataWH = SelectDDControl.get_data_from_idx($eleWH, $eleWH.val());
                        if (dataWH?.['title']) {
                            warehouseTitle = dataWH?.['title'];
                        }
                        if (dataWH?.['text']) {
                            warehouseTitle = dataWH?.['text'];
                        }
                    }

                    // link = $('#url-factory').attr('data-product-detail').format_url_with_uuid(dataPW?.['product']?.['id']);

                    if (data?.[keyResp].length > 0) {
                        let dataPW = [data?.[keyResp][0]];
                        if (keyResp === 'warehouse_products_list') {  // no regis
                            if ($eleSO.attr('data-so')) {
                                let dataS0 = JSON.parse($eleSO.attr('data-so'));
                                for (let data of dataPW) {
                                    data['sale_order'] = dataS0;
                                }
                            }
                        }
                        if (keyResp === 'regis_borrow_list') {  // has regis
                            dataPW = [];
                            let dataRegis = setupDataPW(data?.[keyResp][0]?.['regis_data'], whID);
                            if (dataRegis.hasOwnProperty('available_stock') && dataRegis.hasOwnProperty('available_picked')) {
                                dataPW.push(dataRegis);
                            }
                            for (let borrow_data of data?.[keyResp][0]?.['borrow_data']) {
                                let dataBorrow = setupDataPW(borrow_data?.['regis_data'], whID);
                                if (dataBorrow.hasOwnProperty('available_stock') && dataBorrow.hasOwnProperty('available_picked')) {
                                    if (dataPW.length > 0) {
                                        dataPW.push(dataBorrow);
                                    } else {
                                        dataPW = [dataBorrow];
                                    }
                                }
                            }
                            for (let borrow_data of data?.[keyResp][0]?.['borrow_data_general_stock']) {
                                if ($eleSO.attr('data-so')) {
                                    let dataSO = JSON.parse($eleSO.attr('data-so'));
                                    for (let data of borrow_data?.['regis_data']) {
                                        data['sale_order'] = dataSO;
                                        data['available_stock'] = data?.['common_stock'];
                                    }
                                }
                                let dataBorrow = setupDataPW(borrow_data?.['regis_data'], whID);
                                if (dataBorrow.hasOwnProperty('available_stock') && dataBorrow.hasOwnProperty('available_picked')) {
                                    if (dataPW.length > 0) {
                                        dataPW.push(dataBorrow);
                                    } else {
                                        dataPW = [dataBorrow];
                                    }
                                }
                            }
                        }
                        for (let data of dataPW) {
                            let finalRate = 1;
                            if (data?.['uom'] && prod?.['uom_data']) {
                                if (data?.['uom']?.['ratio'] && prod?.['uom_data']?.['ratio']) {
                                    if (prod?.['uom_data']?.['ratio'] > 0) {
                                        finalRate = data?.['uom']?.['ratio'] / prod?.['uom_data']?.['ratio'];
                                    }
                                }
                                dataUOM = prod?.['uom_data'];
                            }
                            let so = data?.['sale_order'];
                            let available = (data?.['available_stock'] - data?.['available_picked']) * finalRate;
                            let badgeStock = `<span class="badge badge-primary badge-outline mr-2">${$elmTrans.attr('data-project')}: ${so?.['code']}</span>`;
                            if ($eleSO.attr('data-so')) {
                                let dataSO = JSON.parse($eleSO.attr('data-so'));
                                if (so?.['id'] === dataSO?.['id']) {
                                    badgeStock = `<span class="badge badge-primary badge-outline mr-2">${$elmTrans.attr('data-my-project')}</span>`;
                                }
                            }
                            if (data?.['is_pw']) {
                                badgeStock = `<span class="badge badge-primary badge-outline mr-2">${$elmTrans.attr('data-common-wh')}</span>`;
                            }
                            htmlStock += `<div class="row mb-1 align-items-center">
                                            <div class="col-12 col-md-6 col-lg-6">${badgeStock}</div>
                                            <div class="col-12 col-md-6 col-lg-6"><span class="badge badge-pink badge-outline pw-available" data-so="${JSON.stringify(so).replace(/"/g, "&quot;")}" data-so-id="${so?.['id']}">${available}</span></div>
                                        </div>`;
                            htmlPick += `<div class="row mb-1 align-items-center">
                                            <div class="col-12 col-md-6 col-lg-6"><div>${badgeStock}</div></div>
                                            <div class="col-12 col-md-6 col-lg-6"><input class="form-control so-quantity-pick" type="number" value="0" data-so="${JSON.stringify(so).replace(/"/g, "&quot;")}" data-so-id="${so?.['id']}"></div>                                   
                                        </div>`;
                        }
                    }

                    let areaTitle = `<div class="d-flex mb-3 border-bottom"><b class="mr-2">${$elmTrans.attr('data-warehouse')}:</b><p class="picking-warehouse" data-warehouse="${JSON.stringify(dataWH).replace(/"/g, "&quot;")}">${warehouseTitle}</p></div>`;
                    let areaUOM = `<div class="d-flex mb-3 border-bottom"><b class="mr-2">${$elmTrans.attr('data-uom')}:</b><p class="picking-uom" data-uom="${JSON.stringify(dataUOM).replace(/"/g, "&quot;")}">${prod?.['uom_data']?.['title']}</p></div>`;
                    let areaStock = `<b class="mr-2">${$elmTrans.attr('data-available')}:</b>${htmlStock}`;
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
                    // custom column pick
                    $(areaPick).empty().append(htmlPick);
                }
            }
        });
    }

    // init product list by DataTable
    function loadProductList(data) {
        pickupInit.setProdList = data
        $table.DataTableDefault({
            rowIdx: true,
            visibleSearchField: false,
            visiblePaging: false,
            paginate: false,
            data: pickupInit.getProdList,
            columns: [
                {
                    width: '1%',
                    render: () => {
                        return ``;
                    }
                },
                {
                    width: '20%',
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
                                    <p class="mt-2 table-row-product" data-id="${row?.['product_data']?.['id']}">${row?.['product_data']?.['title']}</p>
                                </div>`;
                    }
                },
                {
                    width: '10%',
                    render: (data, type, row) => {
                        return row?.['uom_data']?.['title'];
                    }
                },
                {
                    width: '10%',
                    render: (data, type, row) => {
                        return row?.['pickup_quantity'];
                    }
                },
                {
                    width: '10%',
                    render: (data, type, row) => {
                        return row?.['picked_quantity_before'];
                    }
                },
                {
                    width: '10%',
                    render: (data, type, row) => {
                        return row?.['remaining_quantity'];
                    }
                },
                {
                    width: '20%',
                    render: (row, type, data, meta) => {
                        let isDisabled = ''
                        if (data.picked_quantity === data.remaining_quantity) isDisabled = 'disabled'
                        if ($form.attr('data-method').toLowerCase() === 'get') {
                            isDisabled = 'disabled';
                        }
                        return `<div class="row area-pick">
                                    <div class="col-xs-12 col-sm-6">
                                        <input class="form-control table-row-quantity-pick" type="number" id="prod_row-${meta.row}" 
                                        value="${data.picked_quantity}" ${isDisabled}/>
                                    </div>
                                </div><input class="form-control table-row-quantity-pick" type="number" id="prod_row-${meta.row}" 
                                        value="${data.picked_quantity}" hidden>`;
                    }
                },
            ],
            rowCallback(row, data, index) {
                let menuDD = row.querySelector('.dropdown-menu-stock');
                if (menuDD) {
                    getStockByProdID(data, row);
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

    function setupPickingData(product_id) {
        let picking_data = [];
        let eleProduct = $table[0].querySelector(`.table-row-product[data-id="${product_id}"]`);
        if (eleProduct) {
            let row = eleProduct.closest('tr');
            let eleWH = row.querySelector('.picking-warehouse');
            let eleUOM = row.querySelector('.picking-uom');
            if (eleWH && eleUOM) {
                if (eleWH.getAttribute('data-warehouse') && eleUOM.getAttribute('data-uom')) {
                    let dataWH = JSON.parse(eleWH.getAttribute('data-warehouse'));
                    let dataUOM = JSON.parse(eleUOM.getAttribute('data-uom'));
                    for (let ele of row.querySelectorAll('.so-quantity-pick')) {
                        if (ele.getAttribute('data-so')) {
                            let dataSO = JSON.parse(ele.getAttribute('data-so'));
                            picking_data.push({
                                'sale_order': dataSO?.['id'],
                                'sale_order_data': dataSO,
                                'warehouse': dataWH?.['id'],
                                'warehouse_data': dataWH,
                                'uom': dataUOM?.['id'],
                                'uom_data': dataUOM,
                                'done': parseFloat(ele.value),
                            })
                        }
                    }
                }
            }
        }
        return picking_data;
    }

    $table.on('change', '.so-quantity-pick', function () {
        let row = this.closest('tr');
        let total = 0;
        let elePick = row.querySelector('.table-row-quantity-pick');
        if (elePick) {
            for (let ele of row.querySelectorAll('.so-quantity-pick')) {
                let soID = ele.getAttribute('data-so-id');
                let soValid = row.querySelector(`.pw-available[data-so-id="${soID}"]`);
                if (soValid) {
                    if (parseFloat(ele.value) > parseFloat(soValid.innerHTML)) {
                        $.fn.notifyB({description: $('#trans-factory').attr('data-exceed-available')}, 'failure');
                        ele.value = 0;
                        return false;
                    }
                }
                total += parseFloat(ele.value);
            }
            elePick.value = total;
            $(elePick).change();
        }
        return true;
    });

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
        for (let product of pickingData.products) {
            product['picking_data'] = setupPickingData(product?.['product_id']);
        }

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