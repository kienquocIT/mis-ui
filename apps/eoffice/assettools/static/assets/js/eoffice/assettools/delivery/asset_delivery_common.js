// return template html dropdown for select2 [FIELD LEAVE_TYPE]
function renderTemplateResult(state) {
    if (!state.id) return state.text
    return $(
        `<p class="d-flex justify-content-normal sl_temp_cont"><b>${state?.data?.code}</b>`
        + `<span class="one-row-txt" title="${state?.data?.title}">&nbsp;|&nbsp;&nbsp;${state?.data?.title}</span></p>`
    )
}

class DeliveryTableHandle {
    static initBtnAdd(){
        let $table = $('#products_detail_tbl')
        $('#btn-add').on('click', function(){
            const prodSlt = $('#table_provide_product_list').DataTable().rows('.selected').data().toArray()
            let dataList = []
            for (let item of prodSlt){
                const temp = {
                    product_remark: item.product_remark,
                    product_available: item.product_available,
                    order: item?.['order'],
                    request_number: item.quantity,
                    delivered_number: item?.['delivered'],
                    done: 0,
                    date_delivered: moment().format('YYYY-MM-DD'),
                    uom: item?.uom,
                    product_provide_type: item?.product_provide_type
                }
                if (item?.product_provide_type === 'tool') temp['product'] = item['product']
                if (item?.product_provide_type === 'fixed') temp['product_fixed'] = item['product']
                dataList.push(temp)
            }
            if (dataList.length > 0) $table.DataTable().rows.add(dataList).draw()
        })
    }

    static initDataTable(dataList){
        const $table = $('#products_detail_tbl')
        const $urlFact = $('#url-factory')
        if ($table.hasClass('dataTable')){
            $table.DataTable().rows.add(dataList).draw()
        }
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
                        render: (row, type, data) => {
                            const $elmTrans = $.fn.transEle, $localTrans = $('#trans-factory');
                            let isFormat = [
                                {name: $elmTrans.attr('data-title'), value: 'title'},
                                {name: $elmTrans.attr('data-code'), value: 'code'},
                                {name: $localTrans.attr('data-uom'), value: 'uom'},
                                {name: $localTrans.attr('data-avail'), value: 'available'}
                            ]
                            let prod = {title: data.product_remark}
                            let title = data.product_remark
                            let icon = ''
                            let link = null
                            if (data?.['product_provide_type'] === 'fixed'){
                                prod = data.product_fixed
                                icon = '<i class="fas fa-warehouse"></i>'
                                title = prod.title
                                link = $urlFact.attr('data-fixed-detail')

                            }
                            if (data?.['product_provide_type'] === 'tool'){
                                prod = row
                                icon = '<i class="fas fa-tools"></i>'
                                row.uom = data?.uom
                                row.available = data?.product_available
                                title = row.title
                                link = $urlFact.attr('data-prod-detail')
                            }
                            const dataCont = DataTableAction.item_view(prod, link, isFormat)
                            return `<div class="input-group title_prod">`
                                        + `<div class="dropdown pointer mr-2">`
                                            + `<i class="fas fa-info-circle text-blue info-btn"></i>`
                                            + `<div class="dropdown-menu w-210p">${dataCont}</div>`
                                        + `</div>`
                                        + `<p>${title} <span>${icon}</span></p></div>`;
                        }
                    },
                    {
                        data: 'request_number',
                        width: '10%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: 'delivered_number',
                        width: '10%',
                        render: (row) => {
                            return row
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
                rowCallback: (row, data) => {
                    // delete row
                    $('.btn-remove-row', row).off().on('click', () => {
                        $table.DataTable().row(row).remove().draw(false)
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
                drawCallback: () =>{
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
                        render: (row, type, data) => {
                            return row?.title ? row.title : data.product_remark
                        }
                    },
                    {
                        data: 'quantity',
                        width: '20%',
                        render: (row) => {
                            return row
                        }
                    },
                    {
                        data: 'delivered',
                        width: '20%',
                        render: (row) => {
                            return row
                        }
                    }
                ],
                rowCallback: (row, data, index) => {
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
                        ModalProvideProdList.init(data['asset_provide_product_list'])
                },
                (err) =>{
                    console.log('error load resource', err)
                }
            )
        }
    }
}

function submitHandleFunc() {
    let $FormElm = $('#asset_delivery_form')
    let $EmpElm = $('#inputEmployeeInheritor')
    const frm = new SetupFormSubmit($FormElm);
    let formData = frm.dataForm;
    if (frm.dataMethod.toLowerCase() === 'post') formData.system_status = 1
    formData.employee_inherit_id = $EmpElm.attr('value')
    formData.products = DeliveryTableHandle.get_data()
    formData.date_created = moment(formData.date_created, 'DD/MM/YYYY').format('YYYY-MM-DD')
    for (let item of formData.products) {
        if (
            ((item.done + item.delivered_number) > item.request_number || item.done === 0)
            || (item.product_remark === '' && item.product_provide_type === 'new')
        ){
            $.fn.notifyB({description: $('#trans-factory').attr('data-err-done')}, 'failure');
            return false
        }

        if (item.product_provide_type === 'tool') item.product = item.product?.id
        else if (item.product_provide_type === 'fixed'){
            item.product_fixed = item.product_fixed?.id
            delete item.product
        }
        else delete item.product
        if (!item.product_available && item.product_provide_type === 'tool'){
            $.fn.notifyB({description: $('#trans-factory').attr('data-out_of_stock')}, 'failure');
            return false
        }
        if (item.done > item.product_available && item.product_provide_type === 'tool'){
            $.fn.notifyB({description: $('#trans-factory').attr('data-err-low_stock')}, 'failure');
            return false
        }
    }

    formData.attachments = $x.cls.file.get_val(formData.attachments, [])
    WFRTControl.callWFSubmitForm(frm);
}

$(document).ready(function(){
    // load modal table
    ModalProvideProdList.init()

    // run table delivery
    DeliveryTableHandle.init()

    // run dropdown provide request
    let $ProvideElm = $('#selectProvide')
    $ProvideElm.on('select2:select', function(e){
        let isValue = e.params.data.data
        if (isValue){
            if (isValue.hasOwnProperty('employee_inherit'))
                $('#inputEmployeeInheritor').val(isValue.employee_inherit?.full_name).attr('value',
                    isValue.employee_inherit?.id)
            $('#add_new_line').removeClass('disabled')

            // call detail provide when select provide request
            $('#products_detail_tbl').DataTable().clear().draw()
            ModalProvideProdList.getData(isValue.id)
        }
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
    const $FormElm = $('#asset_delivery_form')
    SetupFormSubmit.validate($FormElm, {
        rules: {
            title: {
                required: true,
            },
            date: {
                required: true,
            },
            employee_inherit: {
                required: true,
            },
            provide: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});