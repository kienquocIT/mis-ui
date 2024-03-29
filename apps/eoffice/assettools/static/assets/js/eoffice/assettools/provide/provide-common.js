const $urlElm = $('#url-factory')
let $tbl = $('#products_detail_tbl')

function employeeTemplate(state) {
    if (!state.id) return state.text
    return $(`<p><span>${state.text}</span> <span class="badge badge-soft-success">${state?.data?.group?.title || '--'}</span></p>`)
}

class ProductsTable {

    static calcSubtotal(data, index) {
        if (data.price > 0 && data.quantity > 0) {
            let total = parseInt(data.price) * parseInt(data.quantity)
            if (data.tax_data || data.tax) {
                let tempTax = data.tax ? data.tax : data['data_tax'] ? data['data_tax'] : {}
                let tax = tempTax?.rate > 0 ? total / 100 * tempTax.rate : 0
                total += tax
            }
            data.subtotal = total
        } else data.subtotal = 0
        $tbl.DataTable().cell(index, 6).data(data.subtotal).draw(false)
    }

    static init(dataList = []) {
        let params_prod = {
            asset_tools_filter: JSON.parse($('#prod_filter').text())
        }
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
                            if (!row && data?.['product_data']) row = data['product_data']
                            if (row && Object.keys(row).length > 0) dataLoad.push({...row, selected: true})
                            let html = $(`<select>`).addClass('form-select row_product-item')
                                .attr('name', `product_${meta.row}`).attr('data-zone', 'products')
                                .attr('data-params', JSON.stringify(params_prod))
                            if (row && Object.keys(row).length > 0) html.attr('data-onload', JSON.stringify(dataLoad))
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'product_remark',
                        width: '20%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="products" name="remark_${meta.row}" value="${row ? row : ''}">`
                        }
                    },
                    {
                        data: 'uom',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            if (!row && data?.['uom_data']) row = data['uom_data']
                            let html = $(`<select>`).addClass('form-select row_uom-item')
                                .attr('name', `uom_${meta.row}`)
                            if (row && Object.keys(row).length > 0)
                                html.append(`<option value="${row.id}" selected>${row.title}</option>`)
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
                            return `<input type="text" class="mask-money form-control" data-zone="products" name="price_${meta.row}" data-init-money="${parseFloat(row ? row : 0)}">`
                        }
                    },
                    {
                        data: 'tax',
                        width: '10%',
                        render: (row, type, data, meta) => {
                            let dataLoad = []
                            if (!row && data?.['tax_data']) row = data['tax_data']
                            if (row && Object.keys(row).length > 0) dataLoad.push({...row, selected: true})
                            else if(row) delete data['tax']
                            let html = $(`<select>`).addClass('form-select row_tax')
                                .attr('name', `tax_${meta.row}`).attr('data-zone', 'products')
                            if (row && Object.keys(row).length > 0) html.attr('data-onload', JSON.stringify(dataLoad))
                            return html.prop('outerHTML')
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
                        .attr('data-keyResp', "product_list")
                        .attr('data-keyText', "title")
                        .attr('data-keyId', "id")
                        .initSelect2()
                        .on('select2:select', function (e) {
                            const product = e.params.data.data
                            data.product = product.id
                            // reset all reference product has selected
                            $('[name*="uom_"]', row).html('').attr('data-params', JSON.stringify({
                                'group': product.general_uom_group.id
                            })).append(`<option value="${product?.['inventory_uom']?.id}" selected>${product?.['inventory_uom']?.['title']}</option>`)
                            data.uom = product?.['inventory_uom']?.id
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

                    // load tax
                    $('[name*="tax_"]', row).attr('data-url', $urlElm.attr('data-tax-url'))
                        .attr('data-keyResp', "tax_list")
                        .attr('data-keyText', "title")
                        .attr('data-keyId', "id")
                        .initSelect2()
                        .on('select2:select', function (e) {
                            data.tax = e.params.data.data
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
                    let totalPrice = 0
                    let allSubtotal = 0
                    let calcTax = 0
                    api.rows().every(function () {
                        let data = this.data()
                        let taxRate = data?.tax?.rate ? data.tax.rate : data?.['tax_data']?.['rate'] ? data.tax_data.rate : 0
                        if (taxRate && data?.['price'] > 0 && data?.['quantity'] > 0)
                            calcTax += data.price * data.quantity / 100 * taxRate
                        if (data?.['price'] > 0 && data?.['quantity'] > 0)
                            totalPrice += parseInt(data.price) * parseInt(data.quantity)
                        if (data?.['subtotal']) allSubtotal += parseInt(data.subtotal)
                    });

                    // Update footer
                    $('[name="pretax_amount"]').val(totalPrice)
                    $('[name="taxes"]').val(calcTax)
                    $('[name="total_amount"]').val(allSubtotal)
                    $(api.column(6).footer()).html(`<p class="pl-3 font-3"><span class="mask-money pretax_amount" data-init-money="${totalPrice}"></span></p>`);
                    $('tr:eq(1) th:eq(2)', api.table().footer()).html(`<p class="pl-3 font-3"><span class="mask-money taxes" data-init-money="${calcTax}"></span></p>`);
                    $('tr:eq(2) th:eq(2)', api.table().footer()).html(`<p class="pl-3 font-3"><span class="mask-money total" data-init-money="${allSubtotal}"></span></p>`);
                    $.fn.initMaskMoney2()
                },
            })

        const $addNewBtn = $('#add_new_line')
        $addNewBtn.off().on('click', function () {
            const newData = {
                'product': '',
                'product_remark': '',
                'uom': '',
                'quantity': 0,
            }
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
        if (item['uom'].hasOwnProperty('id')) item['uom'] = item['uom']['id']
        if (item.hasOwnProperty('tax') && item['tax'].hasOwnProperty('id')) item['tax'] = item['tax']['id']
    }
    // if (frm.dataMethod.toLowerCase() === 'put')
    let $elmFooter = $('.products_detail_tbl_wrapper .dataTables_scrollFootInner table tfoot tr th')
    formData.total = $elmFooter.find('.total').attr('data-init-money')
    formData.taxes = $elmFooter.find('.taxes').attr('data-init-money')
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