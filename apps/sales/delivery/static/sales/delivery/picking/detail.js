function loadDatePicker() {
    $('input[type=text].date-picker').dateRangePickerDefault();
}

class pickupUtil {
    prodList = [];
    subInfo = {}
    pickingData = {}

    set setProdList(data) {
        this.prodList = data
    }

    get getProdList() {
        return this.prodList
    }

    set setSubInfo(data) {
        this.subInfo = data
    }

    get getSubInfo() {
        return this.subInfo
    }

    set setPicking(data) {
        this.pickingData = data
    }

    get getPicking() {
        return this.pickingData
    }

    // Picked quantity on change
    pickedQuantityUtil(val, idx) {
        let value = parseInt(val);
        let currentList = this.getProdList
        // Cập nhật giá trị của input
        if (value && value <= currentList[idx]['remaining_quantity']){
            currentList[idx]['picked_quantity'] = value
            this.setProdList = currentList
        }
        else if (value > currentList[idx]['remaining_quantity'])// giá trị nhập vào lớn hơn số tồn kho
            $.fn.notifyPopup({
                description: $('#trans-factory').attr('data-error-picked-quantity')
            }, 'failure')

        // nhập đủ tự check all
        let countTemp = 0
        let sub = this.getSubInfo
        for (let item of currentList){
            countTemp += item.picked_quantity
        }
        if (countTemp === sub.remaining_quantity)
            $('#idxDoneAll').prop('checked', true)
        else
            $('#idxDoneAll').prop('checked', false)
    }

    checkAllHandle(){
        let _this = this
        $('#idxDoneAll').off().on('change', function(){
            let currentList = _this.getProdList
            let $table = $('#dtbPickingProductList')
            // Cập nhật lại giá trị trên mỗi dòng
            for (let [idx, item] of currentList.entries()){
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
}

function getWarehouse(){
    const $elmWarehouse = $('#inputWareHouse')
    let defaultData = $elmWarehouse.attr('data-onload');
    if (!defaultData){
        $.fn.callAjax($elmWarehouse.attr('data-url'), 'get')
            .then((req) => {
                let res = $.fn.switcherResp(req);
                if (res.hasOwnProperty('warehouse_list')){
                    let firstData = res.warehouse_list[0];
                    $elmWarehouse.attr('data-onload', JSON.stringify({
                        'id': firstData.id,
                        'title': firstData.title
                    }));
                    initSelectBox($elmWarehouse);
                }
            })
    }
}

$(document).ready(function () {
    // declare variable
    const pickupInit = new pickupUtil();

    // init datetime picker
    loadDatePicker()

    // load default warehouse
    getWarehouse()

    // call data when page loaded
    $.fn.callAjax(
        $('#idxUrlPickingDetail').text(),
        'GET',
        {},
        true,
    ).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && data.hasOwnProperty('picking_detail') && data.picking_detail.hasOwnProperty('sub') && data.picking_detail.sub.hasOwnProperty('products')) {
                // load sale order
                console.log('picking_detail: ', data['picking_detail']);
                pickupInit.setPicking = data['picking_detail']
                $('#inputSaleOrder').attr('value', data['picking_detail']?.['sale_order_data']?.['id']).val(
                    data['picking_detail']?.['sale_order_data']?.['title']
                );

                // state
                let state = data['picking_detail']?.['state'];
                if (state !== undefined && Number.isInteger(state)) {
                    let letStateChoices = JSON.parse($('#dataStateChoices').text());
                    let templateEle = `<span class="badge badge-info badge-outline">{0}</span>`;
                    switch (state) {
                        case 0:
                            templateEle = `<span class="badge badge-warning badge-outline">{0}</span>`;
                            break
                        case 1:
                            templateEle = `<span class="badge badge-success badge-outline">{0}</span>`;
                            break
                    }
                    $('#inputState').append(templateEle.format_by_idx(letStateChoices?.[state]));
                }

                // picking delivery date
                let estimate_delivery_date = data['picking_detail']?.['estimated_delivery_date'];
                if (estimate_delivery_date) {
                    $('#inputEstimateDeliveryDate').val(estimate_delivery_date);
                    loadDatePicker();
                }

                // warehouse
                let warehouse_data = data['picking_detail']?.['ware_house_data'];
                if (warehouse_data.hasOwnProperty('code')) {
                    $('#inputWareHouse').append(
                        `<option value="{0}">{1}</option>`.format_by_idx(
                            warehouse_data['id'],
                            warehouse_data['code'] + " - " + warehouse_data['title'],
                        )
                    )
                }

                // descriptions
                let remarks = data['picking_detail']?.['remarks']
                if (remarks) {
                    $('#inputRemarks').val(remarks);
                }

                // load product list
                pickupInit.setSubInfo = data.picking_detail.sub
                loadProductList(
                    data.picking_detail.sub['products']
                );
            }
        }
    )

    // init product list by DataTable
    function loadProductList(data) {
        pickupInit.setProdList = data
        $('#dtbPickingProductList').DataTableDefault({
            rowIdx: true,
            visibleSearchField: false,
            visiblePaging: false,
            data: pickupInit.getProdList,
            columns: [
                {
                    render: (data, type, row, meta) => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row, meta) => {
                        return row?.['product_data']?.['title'];
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
                        return `<div class="row">
                                    <div class="col-xs-12 col-sm-6">
                                        <input class="form-control" type="number" id="prod_row-${meta.row}" 
                                        value="${data.picked_quantity}"/>
                                    </div>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
                var table = $(this).DataTable();
                var data = table.rows().data();

                // loop for all row and init event on change value of picked quantity
                data.each(function (rowData, idx) {
                    // Đối với mỗi hàng, bạn có thể lấy được index của nó
                    $(`#prod_row-${idx}`).off().on('blur', function(e){
                        if (this.value){
                            // format số âm, nhiều số 0. Ex. 0001, số thập phân
                            let value = this.value.replace("-", "").replace(/^0+(?=\d)/, '').replace( /\.\d+$/, '');
                            this.value = value
                            pickupInit.pickedQuantityUtil(value, idx)
                        }
                    })
                });

                // xử lý event check all
                pickupInit.checkAllHandle()
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
    $form.on('submit', function(e){
        e.preventDefault();
        let _form = new SetupFormSubmit($form);
        let csr = $("[name=csrfmiddlewaretoken]").val();

        if (!_form.dataForm?.warehouse_id){
            $.fn.notifyPopup({description: 'Warehouse '}, 'failure')
            return false
        }
        const pickingData = pickupInit.getPicking
        delete pickingData['estimated_delivery_date']
        if (_form.dataForm?.estimated_delivery_date){
            pickingData['estimated_delivery_date'] = moment(_form.dataForm['estimate_delivery_date'],
                'MM/DD/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss')
        }
        pickingData['ware_house_id'] = _form.dataForm['warehouse_id']
        pickingData['remarks'] = _form.dataForm['remarks']
        pickingData['to_location'] = _form.dataForm['to_location']

        let prodSub = pickupInit.getProdList
        pickingData.sub.products = prodSub

        console.log('pickingData', pickingData)
        //call ajax to update picking
        // $.fn.callAjax(_form.dataUrl, _form.dataMethod, pickingData, csr)
        //     .then(
        //         (resp) => {
        //             const data = $.fn.switcherResp(resp);
        //             const description = (_form.dataMethod.toLowerCase() === 'put') ? data.detail : data.message;
        //             if (data) {
        //                 $.fn.notifyPopup({description: description}, 'success')
        //                 $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
        //             }
        //         },
        //     )
        //     .catch((err) => {
        //         console.log(err)
        //     })
    })
});