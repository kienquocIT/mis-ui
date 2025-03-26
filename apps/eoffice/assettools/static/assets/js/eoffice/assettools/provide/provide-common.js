const $urlElm = $('#url-factory')
let $tbl = $('#products_detail_tbl')

function employeeTemplate(state) {
    if (!state.id) return state.text
    return $(`<p><span>${state.text}</span> <span class="badge badge-soft-success">${state?.data?.group?.title || '--'}</span></p>`)
}

class ProductsTable {

    static calcSubtotal(data, index) {
        if (data.price > 0 && data.quantity > 0) {
            data.subtotal = parseInt(data.price) * parseInt(data.quantity)
        } else data.subtotal = 0
        $tbl.DataTable().cell(index, 5).data(data.subtotal).draw(false)
    }

    static init(dataList = []) {
        if ($tbl.hasClass('dataTable')) $tbl.DataTable().clear().rows.add(dataList).draw()
        else
            $tbl.DataTableDefault({
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
                            if (row && Object.keys(row).length > 0) dataLoad.push({...row, selected: true})
                            let html = $(`<select>`).addClass('form-select row_product-item')
                                .attr('name', `product_${meta.row}`).attr('data-zone', 'products')
                            if (row && Object.keys(row).length > 0) html.attr('data-onload', JSON.stringify(dataLoad))
                            if (data.new_prod) html.attr('disabled', true)
                            return html.prop('outerHTML')
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
                            // const amount = row;
                            // const formatAmount = new Intl.NumberFormat('vi-VI', {
                            //     style: 'currency',
                            //     currency: 'VND',
                            //     currencyDisplay: 'code'
                            // }).format(amount)
                            // return `<input type="text" class="mask-money form-control" data-zone="products" name="price_${meta.row}" data-init-money="${parseFloat(row ? row : 0)}">`
                            return `<input type="text" class="form-control" data-zone="products" name="price_${meta.row}" value="${row}" data-value-format="${row}">`
                        }
                    },
                    {
                        data: 'subtotal',
                        width: '15%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="products" name="subtotal_${meta.row}" readonly value="${row}">`
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

                    // load product item
                    $('[name*="product_"]', row).attr('data-url', $urlElm.attr('data-prod-url'))
                        .attr('data-keyResp', "instrument_tool_list")
                        .attr('data-keyText', "title")
                        .attr('data-keyId', "id")
                        .initSelect2()
                        .on('select2:select', function (e) {
                            const product = e.params.data.data
                            data.product = product
                            data.uom = product.product['measure_unit']
                            data.price = product.product.unit_price

                            $('[name*="uom_"], [name*="price_"]', row).prop('readonly', true)

                            $tbl.DataTable().cell(index, 2).data(product.product['measure_unit']).draw(false)
                            $tbl.DataTable().cell(index, 4).data(product.product.unit_price).draw(false)
                            $.fn.initMaskMoney2($('[name*="price_"]', row), 'input')
                        })
                    // load quantity
                    $('[name*="quantity_"]', row).on('change', function () {
                        let temp = this.value.replace('-', '').replace(/^0+|[a-z]/g, '')
                        this.value = temp
                        data.quantity = parseInt(temp)
                        ProductsTable.calcSubtotal(data, index)
                    })

                    // load price
                    $.fn.initMaskMoney2($('[name*="price_"]', row), 'input')
                    $('[name*="price_"]', row).on('change', function () {
                        data.price = !isNaN($(this).valCurrency()) ? parseInt($(this).valCurrency()) : 0
                        ProductsTable.calcSubtotal(data, index)
                    })

                    // init subtotal
                    $.fn.initMaskMoney2($('[name*="subtotal_"]', row), 'input')

                    //delete row
                    $('.btn-remove-row', row).off().on('click', () => {
                        $tbl.DataTable().row(row).remove().draw(false)
                    })
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

        const $addNewBtn = $('.add_new_line')
        $addNewBtn.off().on('click', function () {
            const newData = {
                'product': '',
                'product_remark': '',
                'uom': '',
                'quantity': 0,
            }
            if ($(this).attr('data-type') === 'crt_prod') newData.has_prod = true
            else newData.new_prod = true
            $tbl.DataTable().row.add(newData).draw()
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
        if (item['product'].hasOwnProperty('id')) item['product'] = item['product']['id']
    }
    // if (frm.dataMethod.toLowerCase() === 'put')
    let $elmFooter = $('.products_detail_tbl_wrapper .dataTables_scrollFootInner table tfoot tr th')
    formData.total = $elmFooter.find('.total').attr('data-init-money')
    // formData.taxes = $elmFooter.find('.taxes').attr('data-init-money')
    formData.pretax_amount = $elmFooter.find('.pretax_amount').attr('data-init-money')
    if (formData.total === 0){
        $.fn.notifyB({description: $transElm.attr('data-products')}, 'failure');
        return false
    }

    formData.attachments = $x.cls.file.get_val(formData.attachments, []),
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

});