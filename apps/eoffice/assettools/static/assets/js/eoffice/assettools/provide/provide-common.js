const $urlElm = $('#url-factory')
let $tbl = $('#products_detail_tbl')

function employeeTemplate(state) {
    if (!state.id) return state.text
    return $(`<p><span>${state.text}</span> <span class="badge badge-soft-success">${state?.data?.group?.title || '--'}</span></p>`)
}

function generateTag (is_stage){
    let icon = ''
    if (is_stage === 'tool') icon = '<i class="fas fa-tools"></i>'
    else if (is_stage === 'fixed') icon = '<i class="fas fa-warehouse"></i>'
    let str = ''
    if (is_stage === 'tool' || is_stage === 'fixed')
        str = `<div class="tags-separate">${icon}</div>`
    return str
}

class ProductsTable {

    static calcSubtotal(data, index) {
        if (data.price > 0 && data.quantity > 0) {
            data.subtotal = parseInt(data.price) * parseInt(data.quantity)
        } else data.subtotal = 0
        $tbl.DataTable().row(index).data(data).draw()
    }

    static init(dataList = []) {
        if ($tbl.hasClass('dataTable')) $tbl.DataTable().clear().rows.add(dataList).draw()
        else{
            const objTbl = $tbl.DataTableDefault({
                styleDom: 'hide-foot',
                data: dataList,
                ordering: false,
                paginate: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        data: 'product',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            let dataLoad = []
                            let html = $(`<select>`).addClass('form-select row_product-item')
                                .attr('name', `product_${meta.row}`).attr('data-zone', 'products')

                            if (row && Object.keys(row).length > 0) dataLoad.push({...row, selected: true})
                            else if ('product_fixed' in data)
                                dataLoad.push({...data.product_fixed, selected: true})

                            html.attr('data-onload', JSON.stringify(dataLoad))
                            if (data.new_prod) html.attr('disabled', true)
                            const istag = generateTag('product_fixed' in data ? 'fixed' : 'product' in data ? 'tool' : 'new')
                            return html.prop('outerHTML') + istag
                        }
                    },
                    {
                        data: 'product_remark',
                        width: '25%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="products" name="remark_${meta.row}" value="${row ? row : ''}">`
                        }
                    },
                    {
                        data: 'uom',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            if (!row && data?.['uom_data']) row = data['uom_data']
                            let html = $(`<input type="text">`)
                                .addClass('form-control')
                                .attr('name', `uom_${meta.row}`)
                                .attr('value', row)
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'quantity',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="products" name="quantity_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'price',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money" data-zone="products" ` +
                            `name="price_${meta.row}" data-value-format="${row}" value="${row}">`
                        }
                    },
                    {
                        data: 'subtotal',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money" data-zone="products" name="subtotal_${meta.row}" readonly data-value-format="${row}" value="${row}">`
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
                    data.order = index

                    $('[name*="remark_"]', row).on('blur', function () {
                        data.product_remark = this.value ? this.value : ''
                    })
                    $('input[name*="uom_"]', row).on('blur', function () {
                        data.uom = this.value ? this.value : ''
                    })

                    // load product item
                    let urls = ''
                    let keyresp = "instrument_tool_dd_list"
                    if ('product_fixed' in data){
                        urls = $urlElm.attr('data-prod-fixed-url')
                        keyresp = "fixed_asset_dd_list"
                    }
                    else if ('product' in data)
                        urls = $urlElm.attr('data-prod-url')
                    else $('[name*="product_"]', row).attr('disabled', true)
                    if (urls){
                        $('[name*="product_"]', row).attr('data-url', urls)
                            .attr('data-keyResp', keyresp)
                            .attr('data-keyText', "title")
                            .attr('data-keyId', "id")
                            .attr('data-params', '{"status": 0}')
                            .initSelect2()
                    }

                    // load quantity
                    $('[name*="quantity_"]', row).on('change', function () {
                        let temp = this.value.replace('-', '').replace(/^0+|[a-z]/g, '')
                        this.value = temp
                        data.quantity = parseInt(temp)
                        ProductsTable.calcSubtotal(data, index)
                    })

                    // load price
                    $('[name*="price_"]', row).on('change', function () {
                        let _price = $.inArray($(this).valCurrency(), ['undefined', undefined, '0']) === -1 ? $(this).valCurrency() : $(this).val()
                        data.price = !isNaN(_price) ? parseInt(_price) : 0
                        ProductsTable.calcSubtotal(data, index)
                    })

                    // delete row
                    $('.btn-remove-row', row).off().on('click', () => {
                        $tbl.DataTable().row(row).remove().draw(false)
                    })
                },
                drawCallback: function (row) {
                    $('.popover-elm').popover({
                        title: $.fn.gettext('Info'),
                        html: true,
                        trigger: 'click',
                        content: `<p><i class="fas fa-warehouse font-2"></i>: ${$.fn.gettext('Fixed assets')}</p>`
                            + `<p><i class="fas fa-tools font-2"></i>: ${$.fn.gettext('Instrument Tool')}</p>`
                    });
                    // mask money
                    $.fn.initMaskMoney2($('input.mask-money', row), 'input');
                },
                footerCallback: function () {
                    let api = this.api();

                    // Total footer row
                    let allSubtotal = 0
                    api.rows().every(function () {
                        let data = this.data()
                        if (data?.['subtotal']) allSubtotal += parseInt(data.subtotal)
                    });

                    // Update footer
                    $('[name="total_amount"]').val(allSubtotal)
                    $('tr:eq(1) th:eq(2)', api.table().footer()).html(`<p class="pl-3 font-3"><span class="mask-money total" data-init-money="${allSubtotal}"></span></p>`);
                    $.fn.initMaskMoney2()
                },
            })

            objTbl.on('select2:select', '[name*="product_"]', function(e){
                const product = e.params.data.data
                const td = objTbl.cell($(this).closest('td'));
                let data = objTbl.row(td[0][0].row).data();
                if ('product_fixed' in data) data.product_fixed = product
                else data.product = product

                if (product?.product?.['measure_unit']){
                    data.uom = product?.product?.['measure_unit']
                    $(`input[name="uom_${td[0][0].row}"]`).prop('readonly', true)
                    objTbl.cell(td[0][0].row, 2).data(data.uom).draw(false)
                }
                if (product?.product?.unit_price){
                    data.price = product?.product?.unit_price || 0
                    $(`input[name="price_${td[0][0].row}"]`).prop('readonly', true)
                    objTbl.cell(td[0][0].row, 4).data(data.price).draw(false)
                }

                $.fn.initMaskMoney2($(`[name="price_${td[0][0].row}"]`), 'input')
                $.fn.initMaskMoney2($(`[name="subtotal_${td[0][0].row}"]`), 'input')
            })
        }


        const $addNewBtn = $('.add_new_line')
        $addNewBtn.off().on('click', function (e) {
            e.stopPropagation()
            const type = $(this).attr('data-type')
            if (type){
                const newData = {
                    'product_remark': '',
                    'uom': '',
                    'quantity': 0,
                    'price': 0,
                    'subtotal': 0
                }
                if (type === 'crt_prod_fixed'){
                    newData.product_fixed = null
                    newData.has_prod = true
                }
                else if (type === 'crt_prod_instrument'){
                    newData.product = null
                    newData.has_prod = true
                }
                else newData.new_prod = true
                $tbl.DataTable().row.add(newData).draw()

                // hidden after selected
                $('.dd_toggle_add').dropdown('hide')
            }
        })
    }

    static get_data() {
        return $tbl.DataTable().data().toArray() || []
    }
}

function submitHandleFunc() {
    // WindowControl.showLoading();
    let $FormElm = $('#asset_provide_form')
    let $EmpElm = $('#selectEmployeeInherit')
    const frm = new SetupFormSubmit($FormElm);
    let formData = frm.dataForm;
    if (frm.dataMethod.toLowerCase() === 'post') formData.system_status = 1
    formData.employee_inherit_id = $EmpElm.val()
    formData.products = ProductsTable.get_data()
    for(let item of formData.products){
        delete item['tax']
        if (item['product']){
            if (item['product'].hasOwnProperty('id')){
                item['product'] = item['product']['id']
                delete item['product_fixed']
            }else{
                $.fn.notifyB({'description': $.fn.gettext('Please select product')}, 'failure')
                return false
            }
        }
        else if (item['product_fixed']){
            if (item['product_fixed'].hasOwnProperty('id')){
                item['product_fixed'] = item['product_fixed']['id']
                delete item['product']
            }else{
                $.fn.notifyB({'description': $.fn.gettext('Please select product')}, 'failure')
                return false
            }
        }
        else if (!item['product_fixed'] && !item['product']){
            delete item['product']
            delete item['product_fixed']
        }
    }

    let $elmFooter = $('.products_detail_tbl_wrapper .dataTables_scrollFootInner table tfoot tr th')
    formData.total = $elmFooter.find('.total').attr('data-init-money')
    // formData.taxes = $elmFooter.find('.taxes').attr('data-init-money')
    formData.pretax_amount = $elmFooter.find('.pretax_amount').attr('data-init-money')
    if (formData.total === 0){
        $.fn.notifyB({description: $transElm.attr('data-products')}, 'failure');
        return false
    }

    formData.attachments = $x.cls.file.get_val(formData.attachments, [])
    WFRTControl.callWFSubmitForm(frm);
}

$(document).ready(function () {
    // run products table
    ProductsTable.init()
    // Date picker
    $('.date-picker').daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        locale: {
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
    })
    // init employee
    let $empElm = $('#selectEmployeeInherit')
    $empElm
        .attr('data-onload', $('#employee_current').text())
        .initSelect2({'templateResult': employeeTemplate})
        .on('select2:select', function () {
            $tbl.DataTable().clear().draw()
        })

    // Đóng popover khi click ra ngoài table
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.popover-elm').length &&
            !$(e.target).closest('.popover').length) {
            $('.popover-elm').popover('hide')
        }
    })

});