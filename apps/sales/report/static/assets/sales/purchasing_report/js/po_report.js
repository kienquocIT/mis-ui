$(document).ready(function () {
    const $trans_script = $('#trans-script')
    const $url_script = $('#url-script')

    const $periodEle = $('#period-select')
    const $periodMonthEle = $('#period-month')
    const $supplier = $('#supplier')
    const $prd_type = $('#prd-type')
    const $po_staff = $('#po-staff')
    const $prd_category = $('#prd-category')
    const $sale_order = $('#sale-order')
    const $prd = $('#prd')
    const btn_title = $('#btn-title')
    const $table_po_report = $('#table-po-report')

    const $current_period_Ele = $('#current_period')
    let current_period = {}
    if ($current_period_Ele.text() !== '') {
        current_period = JSON.parse($current_period_Ele.text())
        getMonthOrder(current_period['space_month'], current_period?.['fiscal_year'])
        $periodMonthEle.val(new Date().getMonth() - current_period['space_month'] + 1).trigger('change');
    }

    $('#btn-collapse').on('click', function () {
        if (btn_title.text() === btn_title.attr('data-trans-show')) {
            btn_title.text(btn_title.attr('data-trans-hide'))
            $(this).removeClass('btn-primary')
            $(this).addClass('btn-soft-primary')
        }
        else {
            btn_title.text(btn_title.attr('data-trans-show'))
            $(this).addClass('btn-primary')
            $(this).removeClass('btn-soft-primary')
        }
    })

    $periodMonthEle.on('change', function () {
        let selected_option = SelectDDControl.get_data_from_idx($periodEle, $periodEle.val())
        if (selected_option) {
            $('#period-day-from').val(1);
            $('#period-day-to').val(
                get_final_date_of_current_month(
                    selected_option?.['fiscal_year'], parseInt($periodMonthEle.val()) + selected_option['space_month']
                )
            );
        }
    })

    function getMonthOrder(space_month, fiscal_year) {
        $periodMonthEle.html(``)
        let data = []
        for (let i = 0; i < 12; i++) {
            let year_temp = fiscal_year
            let trans_order = i + 1 + space_month
            if (trans_order > 12) {
                trans_order -= 12
                year_temp += 1
            }
            $periodMonthEle.append(`<option value="${i+1}">${$trans_script.attr(`data-trans-m${trans_order}th`)}</option>`)

            data.push({
                'id': i+1,
                'title': $trans_script.attr(`data-trans-m${trans_order}th`),
                'month': i+1,
                'year': year_temp
            })
        }
        data.push({
            'id': '',
            'title': 'Select...',
            'month': 0,
            'year': 0,
        })
        $periodMonthEle.empty();
        $periodMonthEle.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
            data: data,
            allowClear: true,
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                return $(`<span>${state.text} ${groupHTML}</span>`);
            },
        });
    }

    function loadSupplier(data) {
        $supplier.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
            allowClear: true,
            ajax: {
                url: $supplier.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let res = []
                for (const item of resp.data[keyResp]) {
                    if (item?.['account_type'].includes('Customer')) {
                        res.push(item)
                    }
                }
                return res
            },
            data: (data ? data : null),
            keyResp: 'account_list',
            keyId: 'id',
            keyText: 'name',
        }).on('change', function () {})
    }

    function loadProductType(data) {
        $prd_type.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
            allowClear: true,
            ajax: {
                url: $prd_type.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_type_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    function loadPeriod(data) {
        $periodEle.initSelect2({
            ajax: {
                url: $periodEle.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let res = []
                for (const item of resp.data[keyResp]) {
                    if (item?.['fiscal_year'] <= new Date().getFullYear()) {
                        res.push(item)
                    }
                }
                return res
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            let selected_option = SelectDDControl.get_data_from_idx($periodEle, $periodEle.val())
            if (selected_option) {
                getMonthOrder(selected_option['space_month'], selected_option?.['fiscal_year'])
            }
        })
    }

    function get_final_date_of_current_month(filter_year, filter_month) {
        let currentDate = new Date();

        let year = currentDate.getFullYear();

        let nextMonth = currentDate.getMonth() + 1;

        if (filter_year && filter_month) {
            year = filter_year;
            nextMonth = filter_month;
        }

        if (nextMonth > 11) {
            year++;
            nextMonth = 0;
        }

        let firstDayOfNextMonth = new Date(year, nextMonth, 0);

        return firstDayOfNextMonth.getDate();
    }

    $('#period-day-from').val(1);

    $('#period-day-to').val(get_final_date_of_current_month());

    function loadPOStaff(data) {
        $po_staff.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
            allowClear: true,
            ajax: {
                url: $po_staff.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        }).on('change', function () {})
    }

    function loadProductCategory(data) {
        $prd_category.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
            allowClear: true,
            ajax: {
                url: $prd_category.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_category_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    function loadSaleOrder(data) {
        $sale_order.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
            allowClear: true,
            ajax: {
                url: $sale_order.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    function loadProduct(data) {
        $prd.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
            allowClear: true,
            ajax: {
                url: $prd.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    function LoadPage() {
        loadSupplier()
        loadProductType()
        loadPeriod(current_period)
        loadPOStaff()
        loadProductCategory()
        loadSaleOrder()
        loadProduct()
    }

    LoadPage()

    $('#btn-view').on('click', function () {
        WindowControl.showLoading();
        let dataParam = {}
        dataParam['sub_period_order'] = $periodMonthEle.val() ? parseInt($periodMonthEle.val()) : null
        dataParam['period_mapped'] = $periodEle.val() ? $periodEle.val() : null
        dataParam['start_day'] = $('#period-day-from').val() ? $('#period-day-from').val() : null
        dataParam['end_day'] = $('#period-day-to').val() ? $('#period-day-to').val() : null
        let po_report_list_ajax = $.fn.callAjax2({
            url: $url_script.attr('data-url-po-report-list'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('po_report_list')) {
                    let filtered_data = data?.['po_report_list']
                    console.log(filtered_data)
                    filtered_data = filter_by_supplier(filtered_data)
                    filtered_data = filter_by_po_staff(filtered_data)
                    filtered_data = filter_by_sale_order(filtered_data)
                    return filtered_data;
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([po_report_list_ajax]).then(
            (results) => {
                $('#btn-collapse').trigger('click')
                $table_po_report.find('tbody').html('')
                let table_order_quantity = 0
                let table_received_quantity = 0
                let table_remaining_quantity = 0
                let table_order_value = 0
                let table_received_value = 0
                let table_remaining_value = 0
                for (const po of results[0]) {
                    let po_row = $(`
                        <tr class="po-row">
                            <td class="border-1 text-primary fw-bold">
                                <span class="badge badge-primary badge-sm w-100p">${po?.['code']}</span>&nbsp;
                                ${po?.['title']}
                            </td>
                            <td class="border-1 text-primary fw-bold">${po?.['delivered_date'] ? moment(po?.['delivered_date']).format('DD/MM/YYYY') : ''}</td>
                            <td class="border-1 text-primary fw-bold">${po?.['employee_inherit']?.['fullname']}</td>
                            <td class="border-1 text-primary fw-bold">${po?.['supplier']?.['name']}</td>
                            <td class="border-1 text-primary fw-bold"></td>
                            <td class="border-1 text-primary fw-bold"></td>
                            <td class="border-1 text-primary fw-bold sum_order_quantity"></td>
                            <td class="border-1 text-primary fw-bold sum_received_quantity"></td>
                            <td class="border-1 text-primary fw-bold sum_remaining_quantity"></td>
                            <td class="border-1 text-primary fw-bold">
                                <span class="mask-money sum_order_value" data-init-money="0"></span>
                            </td>
                            <td class="border-1 text-primary fw-bold">
                                <span class="mask-money sum_received_value" data-init-money="0"></span>
                            </td>
                            <td class="border-1 text-primary fw-bold">
                                <span class="mask-money sum_remaining_value" data-init-money="0"></span>
                            </td>
                        </tr>
                    `)
                    $table_po_report.find('tbody').append(po_row)
                    let sum_order_quantity = 0
                    let sum_received_quantity = 0
                    let sum_remaining_quantity = 0
                    let sum_order_value = 0
                    let sum_received_value = 0
                    let sum_remaining_value = 0
                    let product_data = po?.['product_data']
                    product_data = filter_by_product_id(product_data)
                    product_data = filter_by_product_category(product_data)
                    product_data = filter_by_product_type(product_data)
                    for (const product of product_data) {
                        sum_order_quantity += parseFloat(product?.['order_quantity'])
                        sum_received_quantity += parseFloat(product?.['received_quantity'])
                        sum_remaining_quantity += parseFloat(product?.['remaining_quantity'])
                        sum_order_value += parseFloat(product?.['order_value'])
                        sum_received_value += parseFloat(product?.['received_value'])
                        sum_remaining_value += parseFloat(product?.['remaining_value'])
                        $table_po_report.find('tbody').append(`
                            <tr>
                                <td class="border-1"></td>
                                <td class="border-1"></td>
                                <td class="border-1"></td>
                                <td class="border-1"></td>
                                <td class="border-1">
                                    <span class="badge badge-soft-secondary badge-sm w-100p">${product?.['product']?.['code']}</span>&nbsp;&nbsp;${product?.['product']?.['title']}
                                </td>
                                <td class="border-1">${product?.['uom']?.['title']}</td>
                                <td class="border-1">${product?.['order_quantity']}</td>
                                <td class="border-1">${product?.['received_quantity']}</td>
                                <td class="border-1">${product?.['remaining_quantity']}</td>
                                <td class="border-1"><span class="mask-money" data-init-money="${product?.['order_value']}"></span></td>
                                <td class="border-1"><span class="mask-money" data-init-money="${product?.['received_value']}"></span></td>
                                <td class="border-1"><span class="mask-money" data-init-money="${product?.['remaining_value']}"></span></td>
                            </tr>
                        `)
                    }
                    po_row.find('.sum_order_quantity').text(sum_order_quantity)
                    po_row.find('.sum_received_quantity').text(sum_received_quantity)
                    po_row.find('.sum_remaining_quantity').text(sum_remaining_quantity)
                    po_row.find('.sum_order_value').attr('data-init-money', sum_order_value)
                    po_row.find('.sum_received_value').attr('data-init-money', sum_received_value)
                    po_row.find('.sum_remaining_value').attr('data-init-money', sum_remaining_value)
                    table_order_quantity += sum_order_quantity
                    table_received_quantity += sum_received_quantity
                    table_remaining_quantity += sum_remaining_quantity
                    table_order_value += sum_order_value
                    table_received_value += sum_received_value
                    table_remaining_value += sum_remaining_value
                }
                $table_po_report.find('#table-order-quantity').text(table_order_quantity)
                $table_po_report.find('#table-received-quantity').text(table_received_quantity)
                $table_po_report.find('#table-remaining-quantity').text(table_remaining_quantity)
                $table_po_report.find('#table-order-value').attr('data-init-money', table_order_value)
                $table_po_report.find('#table-received-value').attr('data-init-money', table_received_value)
                $table_po_report.find('#table-remaining-value').attr('data-init-money', table_remaining_value)
                $.fn.initMaskMoney2()
                setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    500
                )
            })
    })

    function filter_by_supplier(input_data) {
        if ($supplier.val().length > 0) {
            let filtered_data = []
            for (const item of input_data) {
                if ($supplier.val().includes(item?.['supplier']?.['id'])) {
                    filtered_data.push(item)
                }
            }
            return filtered_data
        }
        return input_data
    }

    function filter_by_po_staff(input_data) {
        if ($po_staff.val().length > 0) {
            let filtered_data = []
            for (const item of input_data) {
                if ($po_staff.val().includes(item?.['employee_inherit']?.['id'])) {
                    filtered_data.push(item)
                }
            }
            return filtered_data
        }
        return input_data
    }

    function filter_by_sale_order(input_data) {
        if ($sale_order.val().length > 0) {
            let filtered_data = []
            for (const item of input_data) {
                for (const so of $sale_order.val()) {
                    if (item?.['sale_order'].includes(so)) {
                        filtered_data.push(item)
                    }
                }
            }
            return filtered_data
        }
        return input_data
    }

    function filter_by_product_id(input_data) {
        if ($prd.val().length > 0) {
            let filtered_data = []
            for (const item of input_data) {
                if ($prd.val().includes(item?.['product']?.['id'])) {
                    filtered_data.push(item)
                }
            }
            return filtered_data
        }
        return input_data
    }

    function filter_by_product_category(input_data) {
        if ($prd_category.val().length > 0) {
            let filtered_data = []
            for (const item of input_data) {
                if ($prd_category.val().includes(item?.['product']?.['product_category'])) {
                    filtered_data.push(item)
                }
            }
            return filtered_data
        }
        return input_data
    }

    function filter_by_product_type(input_data) {
        if ($prd_type.val().length > 0) {
            let filtered_data = []
            for (const item of input_data) {
                if (item?.['product']?.['product_type'].filter(val => $prd_type.val().includes(val)).length > 0) {
                    filtered_data.push(item)
                }
            }
            return filtered_data
        }
        return input_data
    }
})
