// return template html dropdown for select2 [FIELD LEAVE_TYPE]
function renderTemplateResult(state) {
    if (!state.id) return state.text
    return $(
        `<p class="d-flex justify-content-normal sl_temp_cont">`
        + `<b>${state?.data?.leave_type?.code}</b>`
        + `<span class="one-row-txt" title="${state?.data?.leave_type?.title}">&nbsp;|&nbsp;&nbsp;${state?.data?.leave_type?.title}&nbsp;${
            state?.data?.leave_type?.code === 'ANPY' ? `(${state?.data?.["open_year"]})` : ''}</span>`
        + `<span class="text-blue">${state?.data?.check_balance ? `(${state?.data.available})` : ''}</span></p>`
    )
}
class DeliveryTableHandle {
    static initBtnAdd(){
        let $table = $('#products_detail_tbl')
        $('#btn-add').on('click', function(){
            const prodSlt = $('#table_provide_product_list').DataTable().rows('.selected').data().toArray()
            let dataList = []
            for (let item of prodSlt){
                dataList.push({
                    product: item['product'],
                    warehouse: '',
                    product_available: item.product_available,
                    order: item?.['order'],
                    request_number: item.quantity,
                    delivered_number: item?.['delivered'],
                    done: 0,
                    is_inventory: item['product']['is_inventory'],
                    date_delivered: moment().format('YYYY-MM-DD')
                })
            }
            if (dataList.length > 0) $table.DataTable().rows.add(dataList).draw()
        })
    }

    static initDataTable(dataList){
        const $table = $('#products_detail_tbl')
        if ($table.hasClass('dataTable')) $table.DataTable().clear().rows.add(dataList).draw()
        else {
            $table.DataTableDefault({
                data: dataList,
                ordering: false,
                paginate: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        data: 'product',
                        width: '35%',
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
                                        <div class="dropdown pointer mr-2">
                                            <i class="fas fa-info-circle text-blue info-btn"></i>
                                            <div class="dropdown-menu w-210p">${dataCont}</div>
                                        </div>
                                        <p>${row.title}</p>
                                    </div>`;
                        }
                    },
                    {
                        data: 'request_number',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            return row
                        }
                    },
                    {
                        data: 'delivered_number',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            return row
                        }
                    },
                    {
                        data: 'warehouse',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            let dataLoad = []
                            if (!row && data?.['warehouse_data']) row = data['warehouse_data']
                            if (row && Object.keys(row).length > 0) dataLoad.push({...row, selected: true})
                            let params = {
                                product_id: data.product.id
                            }
                            let html = $(`<select>`).addClass('form-select row_warehouse')
                                .attr('name', `warehouse_${meta.row}`).attr('data-zone', 'products').attr(
                                    'data-params', JSON.stringify(params)
                                )
                            if (row && Object.keys(row).length > 0) html.attr('data-onload', JSON.stringify(dataLoad))
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'done',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="products" name="done_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'date_delivered',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            if (row) row = moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            return `<div class="input-affix-wrapper">
                                        <input type="text" name="date_${meta.row}" class="form-control date-picker"
                                               autocomplete="off" value="${row}" data-zone="products">
                                        <span class="input-suffix"><i class="fa-solid fa-calendar-days"></i></span>
                                    </div>`
                        }
                    },
                    {
                        targets: 6,
                        width: '5%',
                        render: () => {
                            return $('.delete_btn').html()
                        }
                    }
                ],
                rowCallback: (row, data, index) => {
                    //delete row
                    $('.btn-remove-row', row).off().on('click', () => {
                        $table.DataTable().row(row).remove().draw(false)
                    })

                    // init warehouse selected
                    // 'templateResult': renderTemplateResult,
                    $('[name*="warehouse_"]', row).attr('data-url', $('#url-factory').attr('data-warehouse-url'))
                        .attr('data-keyResp', "warehouse_products_list")
                        .attr('data-keyText', "warehouse.code")
                        .attr('data-keyId', "warehouse.id")
                        .initSelect2({"dropdownAutoWidth": true,})
                        .on('select2:select', function (e) {
                            data.warehouse = e.params.data.data.warehouse.id
                        })

                    // handle done input
                    $('[name*="done_"]', row).on('change', function(){
                        let isErr = false, isVal = parseInt(this.value)
                        if (!/^[0-9]+$/.test(isVal)){
                            $.fn.notifyB({description: $('#trans-factory').attr('data-err-done')}, 'failure')
                            return false
                        }
                        if (isVal > data.request_number){
                            isErr = true
                            this.value = data.request_number
                        }
                        if (isVal === 0) isErr = true
                        if (isErr)
                            $.fn.notifyB({description: $('#trans-factory').attr('data-err-done')}, 'failure')
                        data.done = isVal
                    });

                    // handle date delivered
                    $('[name*="date_"]', row).daterangepicker({
                        singleDatePicker: true,
                        timepicker: false,
                        showDropdowns: false,
                        minYear: 2023,
                        locale: {
                            format: 'DD/MM/YYYY'
                        },
                        maxYear: parseInt(moment().format('YYYY'), 10),
                    }).on('change', function(){
                        data.date_delivered = moment(this.value, 'DD/MM/YYYY').format('YYYY-MM-DD')
                    })
                },
                drawCallback: (row, data, index) =>{
                    DropdownBSHandle.init()
                }
            })
            this.initBtnAdd()
        }
    }

    static init(data=[]){
        this.initDataTable(data)
    }

    static get_data(){
        return $('#products_detail_tbl').DataTable().data().toArray()
    }
}

class ModalProvideProdList {
    static init(data =[]){
        let $table = $('#table_provide_product_list')
        if ($table.hasClass('dataTable')) $table.DataTable().clear().rows.add(data).draw()
        else
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
                        data: 'order',
                        width: '10%',
                        render: (row, type, data, meta) =>{
                            let isDisabled = data['delivered'] === data['quantity'] ? 'disabled' : ''
                            return `<input type="checkbox" id="check_select_${meta.row}" ${isDisabled}>`
                        }
                    },
                    {
                        data: 'product',
                        width: '50%',
                        render: (row, type, data, meta) => {
                            return data['product'].title
                        }
                    },
                    {
                        data: 'quantity',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            return row
                        }
                    },
                    {
                        data: 'delivered',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            return row
                        }
                    }
                ],
                rowCallback: (row, data, index) => {
                    data['product']["uom_data"] = data?.['uom_data']
                    data['product']["available"] = data?.['product_available']
                    $(`#check_select_${index}`, row).on('change', function(){
                        if (this.checked) $(this).parents('tr').addClass('selected')
                        else $(this).parents('tr').removeClass('selected')
                    })
                }
            });
    }

    static getData(provideID){
        if (provideID.valid_uuid4()){
            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-provide_detail-url'),
                'method': 'GET',
                'data': {'asset_tools_provide_id': provideID}
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('asset_provide_product_list'))
                        ModalProvideProdList.init(data.asset_provide_product_list)
                },
                (err) =>{
                    console.log('error load resource', err)
                }
            )
        }
    }
}

function submitHandleFunc() {
    WindowControl.showLoading();
    let $FormElm = $('#asset_delivery_form')
    let $EmpElm = $('#inputEmployeeInheritor')
    const frm = new SetupFormSubmit($FormElm);
    let formData = frm.dataForm;
    if (frm.dataMethod.toLowerCase() === 'post') formData.system_status = 1
    formData.employee_inherit_id = $EmpElm.attr('value')
    formData.products = DeliveryTableHandle.get_data()
    formData.date_created = moment(formData.date_created, 'DD/MM/YYYY').format('YYYY-MM-DD')
    for (let item of formData.products) {
        item.product = item.product.id
        if(!item['warehouse'].valid_uuid4()){
            $.fn.notifyB({description: $('#trans-factory').attr('data-empty-warehouse')}, 'failure');
            return false
        }
        if (item.done === 0){
            $.fn.notifyB({description: $('#trans-factory').attr('data-err-done')}, 'failure');
            return false
        }
        if (item.done > item.product_available){
            $.fn.notifyB({description: $('#trans-factory').attr('data-err-low_stock')}, 'failure');
            return false
        }
    }

    formData.attachments = $x.cls.file.get_val(formData.attachments, []),
    WFRTControl.callWFSubmitForm(frm);
}

$(document).ready(function(){
    // load modal table
    ModalProvideProdList.init()

    // run table delivery
    DeliveryTableHandle.init()

    // run dropdown provide request
    let $ProvideElm = $('#selectProvide')
    $ProvideElm.initSelect2()
    $ProvideElm.on('select2:select', function(e){
        let isValue = e.params.data.data
        if (isValue.hasOwnProperty('employee_inherit'))
            $('#inputEmployeeInheritor').val(isValue.employee_inherit?.full_name).attr('value',
                isValue.employee_inherit?.id)
        $('#add_new_line').removeClass('disabled')

        // call detail provide when select provide request
        $('#products_detail_tbl').DataTable().clear().draw()
        ModalProvideProdList.getData(isValue.id)
    });

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
});