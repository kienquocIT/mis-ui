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
                        width: '55%',
                        render: (row, type, data, meta) => {
                            return row.title
                        }
                    },
                    {
                        data: 'quantity',
                        width: '10%',
                        className: 'text-center',
                        render: (row, type, data, meta) => {
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
                        if (this.checked && data['return_number'] <= 0 || !data['return_number']){
                            $(`#row_return_number_${index}`, row).addClass('is-invalid')
                            $.fn.notifyB({description: $('#trans-factory').attr('data-err-01')}, 'failure')
                        }
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
                'data': {'employee_inherit_id': provideID, 'delivered': 0}
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('asset_provide_product_list'))
                        this.init(data.asset_provide_product_list)
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
                        render: (row, type, data, meta) => {
                            const $elmTrans = $.fn.transEle;
                            let isFormat = [
                                {name: $elmTrans.attr('data-title'), value: 'title'},
                                {name: $elmTrans.attr('data-code'), value: 'code'},
                                {name: 'UoM', value: 'uom_data.title'},
                                {name: 'Available', value: 'available'}
                            ]
                            const dataCont = DataTableAction.item_view(row, $('#url-factory').attr('data-prod-detail'),
                                isFormat)
                            return `<div class="input-group">
                                        <div class="dropdown pointer mr-2" data-dropdown-custom="true">
                                            <i class="fas fa-info-circle text-blue info-btn"></i>
                                            <div class="dropdown-menu w-210p">${dataCont}</div>
                                        </div>
                                        <p>${row.title}</p>
                                    </div>`;
                        }
                    },
                    {
                        data: 'return_number',
                        width: '20%',
                        render: (row, type, data, meta) => {
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
                drawCallback: (row, data, index) =>{
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
    WindowControl.showLoading();
    let $FormElm = $('#asset_return_form')
    const frm = new SetupFormSubmit($FormElm);
    let formData = frm.dataForm;
    if (frm.dataMethod.toLowerCase() === 'post') formData.system_status = 1
    let temp = $('#products_detail_tbl').DataTable().data().toArray()
    let products = []
    formData.date_return = moment(formData.date_return, 'DD/MM/YYYY').format('YYYY-MM-DD')
    if (!temp){
        $.fn.notifyB({description: $('#trans-factory').attr('data-products')}, 'failure');
        return false
    }
    for (let item of temp) {
        if(!item['product_warehouse']['id'].valid_uuid4()){
            $.fn.notifyB({description: $('#trans-factory').attr('data-empty-warehouse')}, 'failure');
            return false
        }
        if (item.return_number > item.quantity){
            $.fn.notifyB({description: $('#trans-factory').attr('data-err-02')}, 'failure');
            return false
        }
        products.push({
            'order': item.order,
            'product': item.product.id,
            'warehouse_stored_product': item['product_warehouse']['id'],
            'return_number': item.return_number
        })
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
    $EmpElm.initSelect2()
    $EmpElm.on('select2:select', function (e) {
        // let isValue = e.params.data.data
        $ElmBtn.removeClass('disabled')
    });

    // on show modal load asset employee used
    $('#provide_product_list').on('shown.bs.modal', ()=>{
        $('.wrap-loading').removeClass('hidden')
        const _EmpID = $EmpElm.val()
        ModalProdByEmployeeList.getData(_EmpID)
    })
    $('#btn-add').off().on('click', function () {
        const prodSlt = $('#table_provide_product_list').DataTable().rows('.selected').data().toArray(),
            $ReturnTbl = $('#products_detail_tbl')
        let addedList = []
        let temp = $ReturnTbl.DataTable().data().toArray()
        if (prodSlt.length > 0) {
            for (let item of prodSlt) {
                const returnNumber = item?.['return_number']
                if (returnNumber && returnNumber > 0 && returnNumber <= item.quantity){
                    let baby_red_flag = false
                    for (let select of temp){
                        if (item.product.id === select.product.id){
                            $ReturnTbl.DataTable().cell(select.order, 1).data(select.return_number + returnNumber).draw(true)
                            baby_red_flag = true
                            break;
                        }
                    }
                    if (!baby_red_flag) addedList.push(item)
                }
            }
            if (addedList && addedList.length) $ReturnTbl.DataTable().rows.add(prodSlt).draw()
        }
    });

    // init tab asset return list
    AssetReturnProductList.init()


});