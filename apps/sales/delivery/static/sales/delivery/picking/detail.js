function loadDatePicker() {
    $('input[type=text].date-picker').dateRangePickerDefault();
    $('input[type=text].date-picker').val(null);
}

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
    pickedQuantityUtil(val, idx) {
        let value = parseInt(val);
        let currentList = this.getProdList
        // Cập nhật giá trị của input
        if (value && value <= currentList[idx]['remaining_quantity']) {
            currentList[idx]['picked_quantity'] = value
            this.setProdList = currentList
        }
        else if (value > currentList[idx]['remaining_quantity'])// giá trị nhập vào lớn hơn số tồn kho
            $.fn.notifyB({
                description: $('#trans-factory').attr('data-error-picked-quantity')
            }, 'failure')

        // nhập đủ tự check all
        let countTemp = 0
        let sub = this.getPicking
        for (let item of currentList) {
            countTemp += item.picked_quantity
        }
        if (countTemp === sub.remaining_quantity)
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
            }
            _this.setProdList = currentList
        })
    }

    async getWarehouseStock(dataProd) {
        const _this = this
        const warehouseID = $('#inputWareHouse').val();
        let currentWHList = this.getWarehouseList
        let checkResult = 0
        if (dataProd && dataProd?.product_data?.id && dataProd?.uom_data?.id){
            let prodKey = `${dataProd.product_data.id}.${dataProd.uom_data.id}`
            if (currentWHList?.[prodKey] && currentWHList?.[prodKey]?.[warehouseID])
                checkResult = currentWHList[prodKey][warehouseID]
            else{
                let callData = await $.fn.callAjax(
                    $('#url-factory').attr('data-warehouse-stock'),
                    'GET',
                    {'product_id': dataProd.product_data.id, 'uom_id': dataProd.uom_data.id}
                )
                if(callData.status === 200) {
                    let res = $.fn.switcherResp(callData);
                    res = res.warehouse_stock;
                    if (res.length){
                        let dataFormated = {}
                        for (const warehouse of res){
                            const avai_stock = warehouse.product_amount - warehouse.picked_ready
                            dataFormated[warehouse.id] = avai_stock
                            if (warehouse.id === warehouseID) checkResult = avai_stock
                        }
                        currentWHList[prodKey] = dataFormated
                        _this.setWarehouseList = currentWHList
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

    // init datetime picker
    loadDatePicker()

    // call data when page loaded
    $.fn.callAjax(
        $('#idxUrlPickingDetail').text(),
        'GET',
        {},
        true,
    ).then((resp) => {
            let data = $.fn.switcherResp(resp);
            // load sale order
            pickupInit.setPicking = data.picking_detail
            data = data.picking_detail
            $('#inputSaleOrder').val(data?.sale_order_data?.code);
            $('.title-code').text(data.code)
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
            let estimate_delivery_date = data?.['estimated_delivery_date'];
            if (estimate_delivery_date)
                $('#inputEstimateDeliveryDate').val(estimate_delivery_date).dateRangePickerDefault()

            // warehouse
            let warehouse_data = data?.['ware_house_data'];
            if (warehouse_data.hasOwnProperty('code')) {
                $('#inputWareHouse').append(
                    `<option value="{0}" selected>{1}</option>`.format_by_idx(
                        warehouse_data['id'],
                        warehouse_data['code'] + " - " + warehouse_data['title'],
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

    function getStockByProdID(prod, dropdownElm) {
        const $elmTrans = $('#trans-factory')
        let htmlContent = `<h6 class="dropdown-header header-wth-bg">${
            $('#base-trans-factory').attr('data-more-info')}</h6>`;
        const warehouseID = $('#inputWareHouse').val();

        if(!warehouseID.valid_uuid4()){
            $.fn.notifyB({description: $elmTrans.attr('data-error-warehouse')}, 'failure')
            return false
        }
        $.fn.callAjax(
            $('#url-factory').attr('data-warehouse-stock'),
            'GET',
            {'product_id': prod.product_data.id, 'uom_id':prod.uom_data.id}
        ).then((resp) => {
            let data = $.fn.switcherResp(resp);
            const datas = data.warehouse_stock

            let prodTotal = 0
            let prodName = ''
            let WHInfo = datas.filter((item)=> item.id === warehouseID)[0]

            prodTotal = WHInfo['original_info'].stock_amount - WHInfo['original_info'].sold_amount
            prodName = WHInfo.title
            htmlContent += `<div class="mb-1"><h6><i>${$elmTrans.attr('data-warehouse')}</i></h6><p>${prodName}</p></div>`;
            htmlContent += `<div class="mb-1 d-flex justify-content-between">` +
                            `<div><h6>${$elmTrans.attr('data-stock')}</h6>${prodTotal}</div>` +
                            `<div><h6>${$elmTrans.attr('data-store')}</h6>${prodTotal - WHInfo['original_info'].picked_ready}</div>` +
                            `<div><h6>${$elmTrans.attr('data-picking-area')}</h6>${WHInfo['original_info'].picked_ready}</div>` +
                `</div>`;
            htmlContent += `<div class="mb-1"><h6><i>UoM</i></h6><p>${WHInfo?.warehouse_uom?.title}</p></div>`;
            const link = $('#url-factory').attr('data-product-detail').format_url_with_uuid(prod.product_data.id);
            htmlContent += `<div class="dropdown-divider"></div><div class="text-right">
                            <a href="${link}" target="_blank" class="link-primary underline_hover">
                                <span>${$elmTrans.attr('data-view-detail')}</span>
                                <span class="icon ml-1">
                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                </span>
                            </a></div>`;
            $('.dropdown-menu', dropdownElm.parent('.dropdown')).html(htmlContent)
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
                    render: (data, type, row, meta) => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row, meta) => {
                        return `<div class="dropdown d-inline-block mr-2 text-cursor">
                                <i class="fas fa-info-circle text-blue"
                                   data-bs-toggle="dropdown"
                                   data-dropdown-animation
                                   aria-haspopup="true"
                                   aria-expanded="false" data-product-id="${row?.product_data?.id}"
                                   ></i>
                                <div class="dropdown-menu w-280p mt-2"></div>
                            </div> ${row?.['product_data']?.['title']}`
                    }
                },
                {
                    render: (data, type, row, meta) => {
                        return row?.['uom_data']?.['title'];
                    }
                },
                {
                    render: (data, type, row, meta) => {
                        return row?.['pickup_quantity'];
                    }
                },
                {
                    render: (data, type, row, meta) => {
                        return row?.['picked_quantity_before'];
                    }
                },
                {
                    render: (data, type, row, meta) => {
                        return row?.['remaining_quantity'];
                    }
                },
                {
                    render: (row, type, data, meta) => {
                        let isDisabled = ''
                        if (data.picked_quantity === data.remaining_quantity) isDisabled = 'disabled'
                        return `<div class="row">
                                    <div class="col-xs-12 col-sm-6">
                                        <input class="form-control" type="number" id="prod_row-${meta.row}" 
                                        value="${data.picked_quantity}" ${isDisabled}/>
                                    </div>
                                </div>`;
                    }
                },
            ],
            rowCallback(row, data, index) {
                $(`.dropdown > i`, row).off().on('show.bs.dropdown', function () {
                    getStockByProdID(data, $(this))
                })

                $(`#prod_row-${index}`, row).off().on('blur', async function (e) {
                    if (this.value) {
                        // format số âm, nhiều số 0. Ex. 0001, số thập phân.
                        let value = this.value.replace("-", "").replace(/^0+(?=\d)/, '').replace(/\.\d+$/, '');
                        this.value = value
                        $('body').append('<div class="cus-loading"><div class="spinner-border" role="status">' +
                            '<span class="sr-only"></span></div></div>')
                        const listCompare = await pickupInit.getWarehouseStock(data)
                        if (listCompare > 0 && listCompare >= parseFloat(value)) {
                            pickupInit.pickedQuantityUtil(value, index);
                            $(this).removeClass('is-invalid cl-red')
                        } else {
                            $.fn.notifyB(
                                {description: $('#trans-factory').attr('data-outstock')},
                                'failure'
                            );
                            $(this).addClass('is-invalid cl-red')
                            $('.cus-loading').remove()
                        }
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
    const $form = $('#picking_form');
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
        let csr = $("[name=csrfmiddlewaretoken]").val();
        const $transElm = $('#trans-factory')

        if (!_form.dataForm?.warehouse_id) {
            $.fn.notifyB({description: $transElm.attr('data-error-warehouse')}, 'failure')
            return false
        }
        const pickingData = pickupInit.getPicking
        if (_form.dataForm?.estimated_delivery_date)
            pickingData['estimated_delivery_date'] = moment(_form.dataForm['estimated_delivery_date'],
                'MM/DD/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss')
        else delete pickingData['estimated_delivery_date']

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
        for (prod of pickupInit.getProdList) {
            if (prod.picked_quantity > 0)
                prodSub.push({
                    'product_id': prod.product_data.id,
                    'done': prod.picked_quantity,
                    'delivery_data': [{
                        'warehouse': _form.dataForm['warehouse_id'],
                        'uom': prod.uom_data.id,
                        'stock': prod.picked_quantity,
                    }],
                    'order': prod.order,
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