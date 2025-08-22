const $urlElm = $('#url-factory')
let $tbl = $('#expense_detail_tbl')
class expenseItemTable {
    static calcSubtotal(data) {
        data.subtotal = 0
        if (data.price > 0 && data.quantity > 0) {
            let total = parseInt(data.price) * parseInt(data.quantity)
            if (data.tax_data){
                let tax = data?.tax_data?.rate > 0 ? total / 100 * data.tax_data.rate : 0
                total += tax
            }
            data.subtotal = total
        }
        return data.subtotal
    }

    static get_data() {
        return $tbl.DataTable().data().toArray()
    }

    static init(dataList = []) {

        const $addNewBtn = $('#add_new_line')
        if ($tbl.hasClass('dataTable')) $tbl.DataTable().clear().rows.add(dataList).draw()
        else{
            let _tbl = $tbl.DataTableDefault({
                styleDom: 'hide-foot',
                data: dataList,
                ordering: false,
                paginate: false,
                info: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        data: 'title',
                        width: '16.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="expense_items" name="title_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'expense_item',
                        width: '16.66%',
                        render: (row, type, data, meta) => {
                            let dataLoad = []
                            if (!row && data?.['expense_item_data']) row = data['expense_item_data']
                            if (row && Object.keys(row).length > 0){
                                if (row?.['id']) row.selected = true
                                else row = {id: row, selected: true}
                                dataLoad.push(row)
                            }
                            let html = $(`<select>`).addClass('form-select row_expense-item')
                                .attr('name', `expense_item_${meta.row}`)
                                .attr('data-zone', 'expense_items')
                                .attr('data-url', $urlElm.attr('data-expense-url'))
                                .attr('data-keyResp', "expense_item_list")
                                .attr('data-keyText', "title")
                                .attr('data-keyId', "id")
                            if (row && Object.keys(row).length > 0)
                                html.attr('data-onload', JSON.stringify(dataLoad))
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'uom_txt',
                        width: '6.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="expense_items" name="uom_txt_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'quantity',
                        width: '6.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="expense_items" name="quantity_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'price',
                        width: '16.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control mask-money" data-zone="expense_items" name="price_${meta.row}" value="${row}">`
                        }
                    },
                    {
                        data: 'tax',
                        width: '12%',
                        render: (row, type, data, meta) => {
                            let dataLoad = []
                            if (!row && data?.['tax_data']) row = data['tax_data']
                            if (row && Object.keys(row).length > 0){
                                if (row?.['id']) row.selected = true
                                else row = {id: row, selected: true}
                                dataLoad.push(row)
                            }
                            let html = $(`<select>`)
                                .addClass('form-select row_tax')
                                .attr('name', `tax_${meta.row}`)
                                .attr('data-zone', 'expense_items')
                                .attr('data-url', $urlElm.attr('data-tax-url'))
                                .attr('data-keyResp', "tax_list")
                                .attr('data-keyText', "title")
                                .attr('data-keyId', "id")
                            if (row && Object.keys(row).length > 0) html.attr('data-onload', JSON.stringify(dataLoad))
                            return html.prop('outerHTML')
                        }
                    },
                    {
                        data: 'subtotal',
                        width: '16.66%',
                        render: (row, type, data, meta) => {
                            return `<input type="text" class="form-control" data-zone="expense_items" name="subtotal_${meta.row}" readonly value="${row}">`
                        }
                    },
                    {
                        targets: 6,
                        width: '3.33%',
                        render: () => {
                            return $('.delete_btn').html()
                        }
                    }
                ],
                rowCallback: (row) => {
                    // init select expense
                    $('select[name*="expense_item_"]', row).initSelect2()

                    //delete row
                    $('.btn-remove-row', row).off().on('click', () => {
                        $tbl.DataTable().row(row).remove().draw(false)
                    })
                    // init select tax
                    $('[name*="tax_"]', row).initSelect2();
                },
                drawCallback: function (){
                    // load price
                    $('[name*="price_"]').each(function (){
                        $.fn.initMaskMoney2($(this), 'input')
                    })
                    // init subtotal
                    $('[name*="subtotal_"]').each(function (){
                        $.fn.initMaskMoney2($(this), 'input')
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
            // save title
            _tbl.on('blur', 'tbody input[name*="title_"]', function(){
                const td = _tbl.cell($(this).closest('td'));
                let data = _tbl.row(td[0][0].row).data();
                data.title = this.value;
            })
            // save UoM
            _tbl.on('blur', 'tbody input[name*="uom_txt_"]', function(){
                let td = _tbl.cell($(this).closest('td'));
                let data = _tbl.row(td[0][0].row).data();
                data.uom_txt = this.value;
            })
            // save expense item
            _tbl.on('select2:select', 'tbody select[name*="expense_item_"]', function(e){
                let td = _tbl.cell($(this).closest('td'));
                let data = _tbl.row(td[0][0].row).data()
                data.expense_item = e.params.data.data.id
                data.expense_item_data = e.params.data.data
            })

            // save quantity
            _tbl.on('change', 'tbody input[name*="quantity_"]', function () {
                let temp = this.value.replace('-', '').replace(/^0+|[a-z]/g, '')
                this.value = temp
                let rowIdx = _tbl.cell($(this).closest('td'))[0][0].row;
                let data = _tbl.row(rowIdx).data()
                data.quantity = parseInt(temp)
                data.subtotal = expenseItemTable.calcSubtotal(data)
                const $sub = $(`input[name="subtotal_${rowIdx}"]`)
                $sub.attr('value', data.subtotal).val(data.subtotal)
                $.fn.initMaskMoney2($sub, 'input')
                if (data.price > 0 && data.quantity > 0) _tbl.draw(false)
            })

            // change price
            _tbl.on('change', 'input[name*="price_"]', function () {
                const rowIdx = _tbl.cell($(this).closest('td'))[0][0].row;
                let data = _tbl.row(rowIdx).data();
                data.price = parseInt($(this).valCurrency())
                data.subtotal = expenseItemTable.calcSubtotal(data)
                const $sub = $(`input[name="subtotal_${rowIdx}"]`)
                $sub.attr('value', data.subtotal).val(data.subtotal)
                $.fn.initMaskMoney2($sub, 'input')
                if (data.price > 0 && data.quantity > 0) _tbl.draw()
            })

            // load tax
            _tbl.on('select2:select', 'select[name*="tax_"]', function (e) {
                let idx = _tbl.cell($(this).closest('td'))[0][0].row;
                let data = _tbl.row(idx).data()
                data.tax = e.params.data.data.id
                data.tax_data = e.params.data.data
                data.subtotal = expenseItemTable.calcSubtotal(data)
                const $sub = $(`[name="subtotal_${idx}"]`)
                $sub.attr('value', data.subtotal).val(data.subtotal)
                $.fn.initMaskMoney2($sub, 'input')
                if (data.price > 0 && data.quantity > 0) _tbl.draw()
            })
        }

        $addNewBtn.off().on('click', function () {
            const newData = {
                'title': '',
                'expense_item': {},
                'uom_txt': '',
                'quantity': 0,
                'price': 0,
                'subtotal': 0,
            }
            $tbl.DataTable().row.add(newData).draw(false)
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
    // init date picker
    $('.flatpickr-input').each(function () {
        let dobData = null;
        if ($(this).attr('name') === 'date_created' && $('#business_trip_form[data-method="POST"]').length)
            dobData = new Date().toLocaleDateString()
        const opt = {
            'allowInput': true,
            'altInput': true,
            'altFormat': 'd/m/Y',
            'dateFormat': 'Y-m-d',
            'defaultDate': dobData || null,
            'locale': globeLanguage === 'vi' ? 'vn' : 'default',
            'shorthandCurrentMonth': true,
        }
        if ($(this).attr('name') === 'date_f'){
            opt.mode = 'range'
            opt.minDate = "today"
            opt.onChange = function (selectedDates, dateStr, instance) {
                // Tạo array string đã format
                const formattedArray = selectedDates.map(date =>
                    instance.formatDate(date, "Y-m-d")
                );
                if (formattedArray.length === 2){
                    const calcResult = CalcTotalDay({
                        'morning_f': $('[name="morning_f"]:checked').val() === 'true',
                        'date_f': formattedArray[0],
                        'morning_t': $('[name="morning_t"]:checked').val() === 'true',
                        'date_t': formattedArray[1],
                    })
                    $('#totalDayInput').val(calcResult)
                }
            }
        }
        $(this).flatpickr(opt)
        $(this).next().attr('aria-labelledby', $(this).attr('name') + '_hidden')
            .attr('id', $(this).attr('name') + '_hidden')
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
    // init func workflow change request
    WFRTControl.setWFInitialData('businessrequest');
    // khai báo thời gian click
    let lastClickTime = 0;
    const minClickInterval = 500;
    function submitHandleFunc() {
        // sử lý khi click double
        const currentTime = Date.now();
        if (currentTime - lastClickTime < minClickInterval) {
            e.preventDefault();
            return false;
        }
        lastClickTime = currentTime;

        const frm = new SetupFormSubmit($FormElm);
        let formData = frm.dataForm;
        let method = frm.dataMethod.toLowerCase()

        formData.expense_items = expenseItemTable.get_data()
        formData.expense_items.map(function (item, idx) {
            item.order = idx
            if (!item?.['expense_item'] && item?.['expense_item_data'])
                item['expense_item'] = item['expense_item_data']['id']
            if (item?.['tax_data']?.['id']) item['tax'] = item['tax_data']['id']
            item['price'] = parseInt(item['price'])
            return item
        })

        const OriginalList = $.map($empTripElm.select2('data'), (item)=> {return item.data.id});
        const dateRange = formData.date_f.split(' ');
        let dateF = dateRange[0];
        const $morF = $('[name="morning_f"]:checked');
        const $morT = $('[name="morning_t"]:checked');
        if (dateF && dateF !== 'Invalid date'){
            if ($morF.val() === 'true') dateF += ' 00:00:00'
            else dateF += ' 12:00:00'
            formData.date_f = dateF
            formData.morning_f = $morF.val()
        }
        let dateT = dateRange[2] || 'Invalid date';
        if (dateT && dateT !== 'Invalid date'){
            if ($morT.val() === 'true') dateT += ' 12:00:00'
            else dateT += ' 23:59:59'
            formData.date_t = dateT
            formData.morning_t = $morT.val()
            formData.total_day = parseFloat(formData.total_day)
        }
        if (method === 'post')
            formData.date_created = $x.fn.reformatData(formData.date_created, 'DD/MM/YYYY', 'YYYY-MM-DD')
        if (formData.total_day <= 0){
            $.fn.notifyB({description: $('#trans-factory').attr('data-error-time')}, 'failure');
            return false
        }
        if (formData.employee_on_trip) formData.employee_on_trip = OriginalList
        if (formData.attachment) formData.attachment = $x.cls.file.get_val(formData.attachment, [])
        formData.pretax_amount = parseInt(formData.pretax_amount)
        formData.taxes = parseInt(formData.taxes)
        formData.total_amount = parseInt(formData.total_amount)
        formData.employee_inherit_id = $('input[name="employee_inherit_id"]').val()
        if (method === 'post') formData.system_status = 1

        // WindowControl.showLoading();
        WFRTControl.callWFSubmitForm(frm);
    }

    // form submit
    SetupFormSubmit.validate($FormElm, {
        rules: {
            title: {
                required: true,
            },
            employee_inherit: {
                required: true,
            }
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});