const $urlElm = $('#url-factory')
let $tbl = $('#expense_detail_tbl')
class expenseItemTable {
    static calcSubtotal(data, index) {
        if (data.price > 0 && data.quantity > 0) {
            let total = parseInt(data.price) * parseInt(data.quantity)
            if (data.tax_data){
                let tax = data?.tax_data?.rate > 0 ? total / 100 * data.tax_data.rate : 0
                total += tax
            }
            data.subtotal = total
        } else data.subtotal = 0
        $tbl.DataTable().cell(index, 6).data(data.subtotal).draw(false)
    }

    static get_data() {
        return $tbl.DataTable().data().toArray()
    }

    static init(dataList = []) {

        const $addNewBtn = $('#add_new_line')
        if ($tbl.hasClass('dataTable')) $tbl.DataTable().clear().rows.add(dataList).draw()
        else
            $tbl.DataTableDefault({
                styleDom: 'hide-foot',
                data: dataList,
                ordering: false,
                paginate: false,
                info: false,
                width: 'auto',
                columns: [
                    {
                        data: 'title',
                        width: '250px',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="expense_items" name="title_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'expense_item',
                        width: '250px',
                        render: (row, type, data, meta) => {
                            let dataLoad = []
                            if (!row && data?.['expense_item_data']) row = data['expense_item_data']
                            if (row && Object.keys(row).length > 0) dataLoad.push({...row, selected: true})
                            let html = $(`<select>`).addClass('form-select row_expense-item')
                                .attr('name', `expense_item_${meta.row}`).attr('data-zone', 'expense_items')
                            if (row && Object.keys(row).length > 0) html.attr('data-onload', JSON.stringify(dataLoad))
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'uom_txt',
                        width: '100px',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="expense_items" name="uom_txt_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'quantity',
                        width: '100px',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="expense_items" name="quantity_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'price',
                        width: '250px',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money" data-zone="expense_items" name="price_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'tax',
                        width: '180px',
                        render: (row, type, data, meta) => {
                            let dataLoad = []
                            if (!row && data?.['tax_data']) row = data['tax_data']
                            if (row && Object.keys(row).length > 0) dataLoad.push({...row, selected: true})
                            let html = $(`<select>`).addClass('form-select row_tax')
                                .attr('name', `tax_${meta.row}`).attr('data-zone', 'expense_items')
                            if (row && Object.keys(row).length > 0) html.attr('data-onload', JSON.stringify(dataLoad))
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'subtotal',
                        width: '250px',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="expense_items" name="subtotal_${meta.row}" readonly value="${row}">`
                        }
                    },
                    {
                        targets: 6,
                        width: '50px',
                        render: () => {
                            return $('.delete_btn').html()
                        }
                    }
                ],
                rowCallback: (row, data, index) => {
                    data.order = index

                    $('[name*="title_"]', row).on('blur', function () {
                        data.title = this.value
                    })

                    // load expense item
                    $('[name*="expense_item_"]', row).attr('data-url', $urlElm.attr('data-expense-url'))
                        .attr('data-keyResp', "expense_item_list")
                        .attr('data-keyText', "title")
                        .attr('data-keyId', "id")
                        .initSelect2()
                        .on('select2:select', function (e) {
                            data.expense_item = e.params.data.data.id
                        })

                    $('[name*="uom_txt_"]', row).on('blur', function () {
                        data.uom_txt = this.value
                    })

                    // load quantity
                    $('[name*="quantity_"]', row).on('change', function () {
                        let temp = this.value.replace('-', '').replace(/^0+|[a-z]/g, '')
                        this.value = temp
                        data.quantity = parseInt(temp)
                        expenseItemTable.calcSubtotal(data, index)
                    })

                    // load price
                    $.fn.initMaskMoney2($('[name*="price_"]', row), 'input')
                    $('[name*="price_"]', row).on('change', function () {
                        data.price = $(this).valCurrency()
                        expenseItemTable.calcSubtotal(data, index)
                    })

                    // load tax
                    $('[name*="tax_"]', row).attr('data-url', $urlElm.attr('data-tax-url'))
                        .attr('data-keyResp', "tax_list")
                        .attr('data-keyText', "title")
                        .attr('data-keyId', "id")
                        .initSelect2()
                        .on('select2:select', function (e) {
                            data.tax = e.params.data.data.id
                            data.tax_data = e.params.data.data
                            expenseItemTable.calcSubtotal(data, index)
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
                        if (data?.['tax_data']?.['rate'] && data?.['tax_data']?.['rate'] > 0 && data?.['price'] > 0 &&
                            data?.['quantity'] > 0)
                            calcTax += data.price * data.quantity / 100 * data.tax_data.rate
                        if (data?.['price'] > 0 && data?.['quantity'] > 0)
                            totalPrice += parseInt(data.price) * parseInt(data.quantity)
                        if (data?.['subtotal']) allSubtotal += parseInt(data.subtotal)
                    });

                    // Update footer
                    $('[name="pretax_amount"]').val(totalPrice)
                    $('[name="taxes"]').val(calcTax)
                    $('[name="total_amount"]').val(allSubtotal)
                    $(api.column(6).footer()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${totalPrice}"></span></p>`);
                    $('tr:eq(1) th:eq(2)', api.table().footer()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${calcTax}"></span></p>`);
                    $('tr:eq(2) th:eq(2)', api.table().footer()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${allSubtotal}"></span></p>`);
                    $.fn.initMaskMoney2()
                },
            })

        $addNewBtn.off().on('click', function () {
            const newData = {
                'title': '',
                'expense_item': {},
                'uom_txt': '',
                'quantity': 0,
                'price': 0,
                'subtotal': 0,
            }
            $tbl.DataTable().row.add(newData).draw()
        })
    }
}

$(document).ready(function () {

    let $empTripElm = $('#selectEmployeeOnTrip')

    function CalcTotalDay(data) {
        if (data.date_f !== 'Invalid date' && data.date_t !== 'Invalid date') {
            let tempTotal
            const dFrom = new Date(data.date_f)// số giờ bắt đầu
            const dTo = new Date(data.date_t)// số giờ kết thúc
            tempTotal = Math.abs(
                Math.floor(dTo.getTime() / (3600 * 24 * 1000)) -
                Math.floor(dFrom.getTime() / (3600 * 24 * 1000))
            ) + 1 // cộng 1 cho kết quả vì, khi cộng, phép toán ko tính ngày bắt đầu.
            if (!data.morning_f) tempTotal = tempTotal - 0.5
            if (data.morning_t) tempTotal = tempTotal - 0.5
            return tempTotal
        }
        return 0
    }

    // calc total day when date from date to on change
    $('#dateFInput, #dateTInput, [name="morning_t"], [name="morning_f"]').each(function () {
        $(this).on('change', function () {
            const calcResult = CalcTotalDay({
                'morning_f': $('[name="morning_f"]:checked').val() === 'true',
                'date_f': DateTimeControl.convertData($('#dateFInput').val(), 'DD/MM/YYYY', 'YYYY-MM-DD'),
                'morning_t': $('[name="morning_t"]:checked').val() === 'true',
                'date_t': DateTimeControl.convertData($('#dateTInput').val(), 'DD/MM/YYYY', 'YYYY-MM-DD'),
            })
            $('#totalDayInput').val(calcResult)
        });

    })
    // init date picker
    $('.date-picker').each(function () {
        const opt = {
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
        }
        if ($(this).attr('name') === 'date_created') $(this).daterangepicker(opt)
        else $(this).daterangepicker(opt).val('').trigger('change')
    })
    // employee init
    $empTripElm.initSelect2({tags: true, allowClear: true, closeOnSelect: false})
    // init city
    $('#selectDeparture, #selectDestination').each(function () {
        $(this).initSelect2()
    })

    // load dataTable
    expenseItemTable.init()

    const $FormElm = $('#business_trip_form')

    function submitHandleFunc() {
        const frm = new SetupFormSubmit($FormElm);
        let formData = frm.dataForm;
        formData.expense_items = expenseItemTable.get_data()
        formData.expense_items.map(function (item) {
            if (!item?.['expense_item'] && item?.['expense_item_data'])
                item['expense_item'] = item['expense_item_data']['id']
            if (item?.['tax_data']?.['id']) item['tax'] = item['tax_data']['id']
            item['price'] = parseInt(item['price'])
            return item
        })
        let OriginalList = $.map($empTripElm.select2('data'), (item)=> {return item.data.id});
        let dateF = formData.date_f, $morF = $('[name="morning_f"]:checked'), $morT = $('[name="morning_t"]:checked');
        if ($morF.val() === 'true') dateF += ' 00:00:00'
        else dateF += ' 12:00:00'
        let dateT = formData.date_t
        if ($morT.val() === 'true') dateT += ' 12:00:00'
        else dateT += ' 23:59:59'
        let data = {
            'title': formData.title,
            'remark': formData.remark,
            'employee_inherit_id': formData.employee_inherit_id,
            'date_created': $x.fn.reformatData(formData.date_created, 'DD/MM/YYYY', 'YYYY-MM-DD'),
            'departure': formData.departure,
            'destination': formData.destination,
            'employee_on_trip': OriginalList,
            'date_f': $x.fn.reformatData(dateF, 'DD/MM/YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'),
            'morning_f': $morF.val(),
            'date_t': $x.fn.reformatData(dateT, 'DD/MM/YYYY HH:mm:ss', 'YYYY-MM-DD HH:mm:ss'),
            'morning_t': $morT.val(),
            'total_day': parseFloat(formData.total_day),
            'pretax_amount': parseInt(formData.pretax_amount),
            'taxes': parseInt(formData.taxes),
            'total_amount': parseInt(formData.total_amount),
            'expense_items': formData.expense_items,
            'attachment': $x.cls.file.get_val(formData.attachment, []),
        }
        if (frm.dataMethod.toLowerCase() === 'post') data.system_status = 1

        $.fn.callAjax2({
            'url': frm.dataUrl,
            'method': frm.dataMethod,
            'data': data,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        window.location.replace($FormElm.attr('data-url-redirect'));
                    }, 1000);
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    }

    // form submit
    SetupFormSubmit.validate($FormElm, {
        rules: {
            title: {
                required: true,
            },
            employee_inherit: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});