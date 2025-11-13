class ModalProdByEmployeeList {
    static init(data = []) {
        let $table = $('#table_provide_product_list')
        if ($table.hasClass('dataTable')) $table.DataTable().clear().rows.add(data).draw()
        else{
            $table.DataTableDefault({
                data: data,
                ordering: false,
                paginate: false,
                searching: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        targets: 1,
                        width: '5%',
                        render: (row, type, data, meta) => {
                            return `<input type="checkbox" id="check_select_${meta.row}" data-zone="products">`
                        }
                    },
                    {
                        data: 'product',
                        width: '50%',
                        render: (row, type, data) => {
                            return row?.title ? row.title : data.product_remark
                        }
                    },
                    {
                        data: 'quantity',
                        width: '15%',
                        className: 'text-center',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control text-center" data-zone="products" id="row_return_number_${meta.row}"/>`
                        }
                    }
                ],
                rowCallback: (row, data, index) => {
                    data['order'] = index
                    data['product']["uom_data"] = data?.['uom_data']
                    data['product']["available"] = data?.['product_available']
                    $(`#row_return_number_${index}`, row).on('change', function(){
                        if (parseInt(this.value) > 0){
                            this.value = parseInt(this.value)
                            data['return_number'] = parseInt(this.value)
                            $(this).removeClass('is-invalid')
                            if (this.value > data.quantity){
                                $.fn.notifyB({description: $('#trans-factory').attr('data-err-02')}, 'failure')
                                $(this).addClass('is-invalid')
                            }
                        }
                        else $(this).addClass('is-invalid')
                    });

                    $(`#check_select_${index}`, row).on('change', function () {
                        if (this.checked) $(this).parents('tr').addClass('selected')
                        else $(this).parents('tr').removeClass('selected')
                    })
                }
            });
        }
        $('.wrap-loading').addClass('hidden')
    }

    static getData(provideID) {
        if (provideID.valid_uuid4()) {
            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-provide_detail-url'),
                'method': 'GET',
                'data': {'employee_inherit_id': provideID, 'delivered__gt': 0}
            }).then(
                (resp) => {
                    let datas = $.fn.switcherResp(resp);
                    if (datas && datas.hasOwnProperty('asset_provide_product_list')){
                        let dataList = []
                        for (let data of datas['asset_provide_product_list']){
                            if (data['is_returned'] !== data.quantity)
                                dataList.push(data)
                        }
                        this.init(dataList)
                    }
                },
                (err) => {
                    console.log('error load resource', err)
                }
            )
        }
    }
}

class AssetReturnProductList {
    static init(data = []) {
        let $table = $('#products_detail_tbl')
        const urlFact = $('#url-factory')
        if ($table.hasClass('dataTable')) $table.DataTable().clear().rows.add(data).draw()
        else{
            $table.DataTableDefault({
                data: data,
                ordering: false,
                paginate: false,
                searching: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        data: 'product',
                        width: '75%',
                        render: (row, type, data) => {
                            const $elmTrans = $.fn.transEle;
                            let isFormat = [
                                {name: $elmTrans.attr('data-title'), value: 'title'},
                                {name: $elmTrans.attr('data-code'), value: 'code'},
                                {name: 'UoM', value: 'uom'},
                                {name: 'Available', value: 'available'}
                            ]
                            let link = null
                            let icon = ''
                            let rowData = data.product_provide_type === 'new' ? {'title': data.product_remark} : row
                            let name = data.product_provide_type === 'new' ? data.product_remark : rowData.title
                            if (data.product_provide_type === 'tool'){
                                icon = '<i class="fas fa-tools"></i>'
                                link = urlFact.attr('data-prod-detail')
                            }
                            else if (data.product_provide_type === 'fixed'){
                                icon = '<i class="fas fa-warehouse"></i>'
                                link = urlFact.attr('data-fixed-detail')
                            }
                            const dataCont = DataTableAction.item_view(rowData, link, isFormat)
                            return `<div class="input-group">
                                        <div class="dropdown pointer mr-2" data-dropdown-custom="true">
                                            <i class="fas fa-info-circle text-blue info-btn"></i>
                                            <div class="dropdown-menu w-210p">${dataCont}</div>
                                        </div>
                                        <p>${name} <span style="color: rgb(90, 147, 255)">${icon}</span></p>
                                    </div>`;
                        }
                    },
                    {
                        data: 'return_number',
                        width: '20%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        targets: 3,
                        width: '5%',
                        render: () => {
                            return $('.delete_btn').html()
                        }
                    }
                ],
                rowCallback: (row, data, index) => {
                    data.order = index;
                    //delete row
                    $('.btn-remove-row', row).off().on('click', () => {
                        $table.DataTable().row(row).remove().draw(false)
                    })
                },
                drawCallback: () =>{
                    DropdownBSHandle.init()
                }
            });
        }
    }

    static getData(provideID) {
        if (provideID.valid_uuid4()) {
            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-provide_detail-url'),
                'method': 'GET',
                'data': {'employee_inherit_id': provideID, 'delivered': 0}
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('asset_provide_product_list'))
                        ModalProvideProdList.init(data.asset_provide_product_list)
                },
                (err) => {
                    console.log('error load resource', err)
                }
            )
        }
    }
}

function submitHandleFunc() {
    let $FormElm = $('#asset_return_form')
    const frm = new SetupFormSubmit($FormElm);
    let formData = frm.dataForm;
    if (frm.dataMethod.toLowerCase() === 'post') formData.system_status = 1
    let temp = $('#products_detail_tbl').DataTable().data().toArray()
    let products = []
    formData.date_return = moment(formData.date_return, 'DD/MM/YYYY').format('YYYY-MM-DD')
    if (!temp) {
        $.fn.notifyB({description: $('#trans-factory').attr('data-products')}, 'failure');
        return false
    }
    for (let item of temp) {
        if (item.return_number > item.quantity){
            $.fn.notifyB({description: $('#trans-factory').attr('data-err-02')}, 'failure');
            return false
        }
        const temp = {
            'order': item.order,
            'product_remark': item.product_remark,
            'return_number': item.return_number
        }
        if (item.product_provide_type === 'fixed') temp['product_fixed'] = item?.product
        if (item.product_provide_type === 'tool') temp['product'] = item?.product?.id
        products.push(temp)
    }
    formData.products = products
    formData.attachments = $x.cls.file.get_val(formData.attachments, []);
    WFRTControl.callWFSubmitForm(frm);
}

$(document).ready(function() {

    // run date create
    $('#dateCreatedInput').daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        locale: {
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
    })

    // run attachment file
    new $x.cls.file($('#attachment')).init({'name': 'attachments'});

    // run dropdown employee_inherit
    const $EmpElm = $('#selectEmployeeInherit')
    const $ElmBtn = $('#add_new_line')
    const $modalElm = $('#provide_product_list')
    $EmpElm.initSelect2()
    $EmpElm.on('select2:select', function () {
        $ElmBtn.removeClass('disabled')
    });

    // on show modal load asset employee used
    $modalElm.on('shown.bs.modal', () => {
        $('.wrap-loading').removeClass('hidden')
        const _EmpID = $EmpElm.val()
        ModalProdByEmployeeList.getData(_EmpID)
    })

    $('#btn-add').off().on('click', function () {
        // lấy danh sách prod, kiểm tra danh sách prod có/ko
        // lấy danh sách trả về kiểm tra sản phẩm được chọn có nhập số lượng trả về không và số lượng trả về
        // có lớn hơn số lượng đã cấp không, kiểm tra xem có bị trùng prod đã select trước đó ko
        const prodSlt = $('#table_provide_product_list').DataTable().rows('.selected').data().toArray(),
            $ReturnTbl = $('#products_detail_tbl')
        let addedList = []
        let returnLst = $ReturnTbl.DataTable().data().toArray()
        if (prodSlt.length > 0) {
            for (let item of prodSlt) {
                const returnNumber = item?.['return_number']
                if (returnNumber && returnNumber > 0 && returnNumber <= item.quantity ){
                    let baby_red_flag = false
                    for (let select of returnLst){
                        if (item.product.id === select.product.id || (item.product_provide_type === 'fixed' && returnNumber > 1)){
                            // kiểm tra xem nếu đã chọn rồi ko cho chọn lại
                            $ReturnTbl.DataTable().cell(select.order, 1).data(select.return_number + returnNumber).draw(true)
                            baby_red_flag = true
                            break;
                        }
                    }
                    if (!baby_red_flag) addedList.push(item)
                }
                else{
                    const index = item.order
                    $(`#row_return_number_${index}`).addClass('is-invalid')
                    $.fn.notifyB({description: $('#trans-factory').attr('data-err-01')}, 'failure')
                }
            }
            if (addedList && addedList.length){
                $modalElm.modal('hide')
                $ReturnTbl.DataTable().rows.add(prodSlt).draw()
            }
        }
    });

    // init tab asset return list
    AssetReturnProductList.init()

    let $FormElm = $('#asset_return_form')
    SetupFormSubmit.validate($FormElm, {
        rules: {
            title: {
                required: true,
            },
            employee_inherit: {
                required: true,
            },
            products: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});