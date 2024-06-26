$(document).ready(function () {
    const items_select_Ele = $('#items_select')
    const warehouses_select_Ele = $('#warehouses_select')
    const items_detail_report_table_Ele = $('#items_detail_report_table')
    const periodEle = $('#period-select')
    const periodMonthEle = $('#period-month')
    const trans_script = $('#trans-script')
    const url_script = $('#url-script')
    const current_period_Ele = $('#current_period')
    let current_period = {}
    if (current_period_Ele.text() !== '') {
        current_period = JSON.parse(current_period_Ele.text())
        getMonthOrder(current_period['space_month'], current_period?.['fiscal_year'])
        periodMonthEle.val(new Date().getMonth() - current_period['space_month'] + 1).trigger('change');
    }
    const $definition_inventory_valuation = $('#definition_inventory_valuation').text()
    if ($definition_inventory_valuation === '0') {
        $('#btn-calculate').remove()
    }
    let PERIODIC_CLOSED = false

    function getMonthOrder(space_month, fiscal_year) {
        periodMonthEle.html(``)
        let data = []
        for (let i = 0; i < 12; i++) {
            let year_temp = fiscal_year
            let trans_order = i + 1 + space_month
            if (trans_order > 12) {
                trans_order -= 12
                year_temp += 1
            }

            if (fiscal_year !== current_period['fiscal_year'] || trans_order <= new Date().getMonth() + 1) {
                if (year_temp === new Date().getFullYear()) {
                    periodMonthEle.append(`<option value="${i + 1}">${trans_script.attr(`data-trans-m${trans_order}th`)}</option>`)
                    data.push({
                        'id': i + 1,
                        'title': trans_script.attr(`data-trans-m${trans_order}th`),
                        'month': i + 1,
                        'year': year_temp
                    })
                }
            }
        }
        data.push({
            'id': '',
            'title': 'Select...',
            'month': 0,
            'year': 0,
        })
        periodMonthEle.empty();
        periodMonthEle.initSelect2({
            data: data,
            allowClear: true,
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                return $(`<span>${state.text} ${groupHTML}</span>`);
            },
        });
    }

    function LoadPeriod(data) {
        periodEle.initSelect2({
            ajax: {
                url: periodEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            let selected_option = SelectDDControl.get_data_from_idx(periodEle, periodEle.val())
            if (selected_option) {
                getMonthOrder(selected_option['space_month'], selected_option?.['fiscal_year'])
            }
        })
    }
    LoadPeriod(current_period)

    function LoadItemsSelectBox(ele, data) {
        ele.initSelect2({
            allowClear: true,
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    LoadItemsSelectBox(items_select_Ele)

    function LoadWarehouseSelectBox(ele, data) {
        ele.initSelect2({
            allowClear: true,
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {

        })
    }
    LoadWarehouseSelectBox(warehouses_select_Ele)

    function RenderTableWithParameter(table, data_list=[]) {
        table.DataTable().clear().destroy()
        table.DataTableDefault({
            dom: '',
            paging: false,
            reloadCurrency: true,
            data: data_list,
            columns: [
                {
                    className: '',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'prd') {
                            let html = `
                                <span class="product-td badge badge-secondary badge-pill w-25" data-product-id="${row?.['product_id']}">
                                    <a tabindex="0"
                                       data-bs-placement="bottom"
                                       data-bs-toggle="popover"
                                       data-bs-trigger="hover focus"
                                       data-bs-html="true"
                                       data-bs-content="- ${trans_script.attr('data-trans-uom')}: <span class='badge badge-soft-blue badge-pill'>${row?.['product_uom']}</span><br>- ${trans_script.attr('data-trans-vm')}: <span class='fst-italic'>${row?.['we']}<span>"
                                       class="w-100 text-white d-inline-block popover-prd">
                                    ${row?.['product_code']}
                                    </a>
                                </span>&nbsp;
                                <b>${row?.['product_title']}</b>
                            `
                            if (row?.['product_lot_number']) {
                                html += `<span class="text-blue small fw-bold"><i class="bi bi-bookmark-fill"></i>&nbsp;${row?.['product_lot_number']}</span>`
                            }
                            if (row?.['sale_order_code']) {
                                html += `<span class="text-pink small fw-bold"><i class="bi bi-clipboard-check"></i>&nbsp;${row?.['sale_order_code']}</span>`
                            }
                            return html
                        }
                        return ``
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'log') {
                            return `${row?.['system_date']}`
                        }
                        return ``
                    }
                },
                {
                    className: '',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'open') {
                            return `<label class="text-center text-secondary">${row?.['ob_label']}</label>`
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<label class="text-${row?.['text_color']} w-50">${row?.['trans_title']}</label>&nbsp;
                                    <span class="badge badge-soft-${row?.['text_color']} w-40">${row?.['trans_code']}</span>`
                        }
                        else if (row?.['row_type'] === 'wh') {
                            return `
                                    <span class="badge badge-sm badge-primary badge-pill">
                                        ${row?.['warehouse_code']}
                                    </span>&nbsp;
                                    <span class="text-primary fw-bold wh-of-${row?.['product_id']}">${row?.['warehouse_title']}</span>
                            `
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'log') {
                            return `<span class="text-${row?.['text_color']}">${row?.['quantity']}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'log') {
                            return `<span class="text-${row?.['text_color']} mask-money" data-init-money="${row?.['cost']}"></span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'log') {
                            return `<span class="text-${row?.['text_color']} mask-money" data-init-money="${row?.['value']}"></span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'open') {
                            return `<span style="font-size: medium" class="badge badge-pill text-secondary">${row?.['opening_balance_quantity']}</span>`
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<span style="font-size: medium" class="badge badge-pill text-secondary current-quantity-${row?.['product_id']}" data-stock-type="${row?.['stock_type']}">${row?.['current_quantity']}</span>`
                        }
                        else if (row?.['row_type'] === 'prd') {
                            return `<span style="font-size: medium" class="badge badge-soft-secondary badge-outline badge-pill sum-current-quantity-${row?.['product_id']}"></span>`
                        }
                        else if (row?.['row_type'] === 'wh') {
                            return `<span style="font-size: medium" class="badge badge-pill fw-bold text-primary sum-current-quantity-of-wh-${row?.['product_id']}">${row?.['ending_balance_quantity']}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'open') {
                            return `<span style="font-size: medium" class="badge badge-pill text-secondary mask-money" data-init-money="${row?.['opening_balance_cost']}"></span>`
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<span style="font-size: medium" class="badge badge-pill text-secondary mask-money current-cost-${row?.['product_id']}" data-stock-type="${row?.['stock_type']}" data-init-money="${row?.['current_cost']}"></span>`
                        }
                        else if (row?.['row_type'] === 'prd') {
                            return `<span style="font-size: medium" class="badge badge-soft-secondary badge-outline badge-pill mask-money sum-current-cost-${row?.['product_id']}" data-init-money=""></span>`
                        }
                        else if (row?.['row_type'] === 'wh') {
                            return `<span style="font-size: medium" class="badge badge-pill fw-bold text-primary mask-money sum-current-cost-of-wh-${row?.['product_id']}" data-init-money="${row?.['ending_balance_cost']}"></span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'open') {
                            return `<span style="font-size: medium" class="badge badge-pill text-secondary mask-money" data-init-money="${row?.['opening_balance_value']}"></span>`
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<span style="font-size: medium" class="badge badge-pill text-secondary mask-money current-value-${row?.['product_id']}" data-stock-type="${row?.['stock_type']}" data-init-money="${row?.['current_value']}"></span>`
                        }
                        else if (row?.['row_type'] === 'prd') {
                            return `<span style="font-size: medium" class="badge badge-soft-secondary badge-outline badge-pill mask-money sum-current-value-${row?.['product_id']}" data-init-money=""></span>`
                        }
                        else if (row?.['row_type'] === 'wh') {
                            return `<span style="font-size: medium" class="badge badge-pill fw-bold text-primary mask-money sum-current-value-of-wh-${row?.['product_id']}" data-init-money="${row?.['ending_balance_value']}"></span>`
                        }
                        return ``
                    }
                },
            ],
            initComplete: function(settings, json) {
                table.find('tbody tr').each(function () {
                    $(this).find('td:eq(0)').css({
                        'min-width': '400px'
                    })
                    $(this).find('td:eq(1)').css({
                        'min-width': '120px'
                    })
                    $(this).find('td:eq(2)').css({
                        'min-width': '250px'
                    })
                    $(this).find('td:eq(3)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(4)').css({
                        'min-width': '150px'
                    })
                    $(this).find('td:eq(5)').css({
                        'min-width': '150px'
                    })
                    $(this).find('td:eq(6)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(7)').css({
                        'min-width': '150px'
                    })
                    $(this).find('td:eq(8)').css({
                        'min-width': '150px'
                    })
                })

                table.find('.product-td').each(function () {
                    let product_id = $(this).attr('data-product-id')

                    let sum_current_quantity = 0
                    table.find(`.sum-current-quantity-of-wh-${product_id}`).each(function () {
                        sum_current_quantity += parseFloat($(this).text())
                    })

                    let sum_current_cost = 0
                    table.find(`.sum-current-cost-of-wh-${product_id}`).each(function () {
                        sum_current_cost += parseFloat($(this).attr('data-init-money'))
                    })

                    let sum_current_value = 0
                    table.find(`.sum-current-value-of-wh-${product_id}`).each(function () {
                        sum_current_value += parseFloat($(this).attr('data-init-money'))
                    })

                    table.find(`.sum-current-quantity-${product_id}`).text(sum_current_quantity)
                    table.find(`.sum-current-cost-${product_id}`).attr('data-init-money', sum_current_cost)
                    table.find(`.sum-current-value-${product_id}`).attr('data-init-money', sum_current_value)
                })

                const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
                const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
                $('.popover-prd:first-child').trigger('hover')
            },
        });
    }

    $('#btn-view').on('click', function () {
        if (periodMonthEle.val()) {
            items_detail_report_table_Ele.prop('hidden', true)
            WindowControl.showLoading();
            let dataParam = {}
            dataParam['sub_period_order'] = periodMonthEle.val() ? parseInt(periodMonthEle.val()) : null
            dataParam['period_mapped'] = periodEle.val() ? periodEle.val() : null
            dataParam['product_id_list'] = items_select_Ele.val().join(',')
            let inventory_detail_list_ajax = $.fn.callAjax2({
                url: url_script.attr('data-url-inventory-detail-list'),
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_detail_list')) {
                        return data?.['report_inventory_detail_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([inventory_detail_list_ajax]).then(
                (results) => {
                    // console.log(results[0])
                    items_detail_report_table_Ele.DataTable().clear().destroy()
                    items_detail_report_table_Ele.find('tbody').html('')
                    let table_inventory_report_data = []
                    for (const item of results[0]) {
                        table_inventory_report_data.push({
                            'row_type': 'prd',
                            'product_id': item?.['product']?.['id'],
                            'product_code': item?.['product']?.['code'],
                            'product_title': item?.['product']?.['title'],
                            'product_uom': item?.['product']?.['uom']?.['title'],
                            'product_lot_number': item?.['product']?.['lot_number'],
                            'sale_order_code': item?.['product']?.['sale_order_code'],
                            'we': trans_script.attr('data-trans-we')
                        })
                        for (const stock_activity of item?.['stock_activities']) {
                            if (warehouses_select_Ele.val().length > 0) {
                                if (warehouses_select_Ele.val().includes(stock_activity?.['warehouse_id'])) {
                                    table_inventory_report_data.push({
                                        'row_type': 'wh',
                                        'product_id': item?.['product']?.['id'],
                                        'warehouse_id': stock_activity?.['warehouse_id'],
                                        'warehouse_code': stock_activity?.['warehouse_code'],
                                        'warehouse_title': stock_activity?.['warehouse_title'],
                                        'ending_balance_quantity': stock_activity?.['ending_balance_quantity'],
                                        'ending_balance_cost': stock_activity?.['ending_balance_cost'],
                                        'ending_balance_value': stock_activity?.['ending_balance_value'],
                                    })
                                    table_inventory_report_data.push({
                                        'row_type': 'open',
                                        'product_id': item?.['product']?.['id'],
                                        'ob_label': trans_script.attr('data-trans-ob'),
                                        'opening_balance_quantity': stock_activity?.['opening_balance_quantity'],
                                        'opening_balance_cost': stock_activity?.['opening_balance_cost'],
                                        'opening_balance_value': stock_activity?.['opening_balance_value'],
                                    })
                                    for (const activity of stock_activity?.['data_stock_activity']) {
                                        let text_color = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            text_color = 'primary'
                                        }
                                        if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                            text_color = 'green'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            text_color = 'blue'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                            text_color = 'purple'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery') {
                                            text_color = 'danger'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            text_color = 'orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                                text_color = 'purple'
                                            }
                                        let trans_title_sub = {
                                            'Goods receipt': trans_script.attr('data-trans-grc'),
                                            'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                            'Goods return': trans_script.attr('data-trans-grt'),
                                            'Goods transfer (in)': trans_script.attr('data-trans-gtf'),
                                            'Delivery': trans_script.attr('data-trans-dlvr'),
                                            'Goods issue': trans_script.attr('data-trans-gis'),
                                            'Goods transfer (out)': trans_script.attr('data-trans-gtf'),
                                        }

                                        table_inventory_report_data.push({
                                            'row_type': 'log',
                                            'product_id': item?.['product']?.['id'],
                                            'text_color': text_color,
                                            'stock_type': activity?.['stock_type'],
                                            'trans_code': activity?.['trans_code'],
                                            'trans_title': trans_title_sub?.[activity?.['trans_title']],
                                            'system_date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                            'quantity': activity?.['quantity'],
                                            'cost': activity?.['cost'],
                                            'value': activity?.['value'],
                                            'current_quantity': activity?.['current_quantity'],
                                            'current_cost': activity?.['current_cost'],
                                            'current_value': activity?.['current_value'],
                                        })
                                    }
                                }
                            }
                            else {
                                table_inventory_report_data.push({
                                    'row_type': 'wh',
                                    'product_id': item?.['product']?.['id'],
                                    'warehouse_id': stock_activity?.['warehouse_id'],
                                    'warehouse_code': stock_activity?.['warehouse_code'],
                                    'warehouse_title': stock_activity?.['warehouse_title'],
                                    'ending_balance_quantity': stock_activity?.['ending_balance_quantity'],
                                    'ending_balance_cost': stock_activity?.['ending_balance_cost'],
                                    'ending_balance_value': stock_activity?.['ending_balance_value'],
                                })
                                table_inventory_report_data.push({
                                    'row_type': 'open',
                                    'product_id': item?.['product']?.['id'],
                                    'ob_label': trans_script.attr('data-trans-ob'),
                                    'opening_balance_quantity': stock_activity?.['opening_balance_quantity'],
                                    'opening_balance_cost': stock_activity?.['opening_balance_cost'],
                                    'opening_balance_value': stock_activity?.['opening_balance_value'],
                                })
                                for (const activity of stock_activity?.['data_stock_activity']) {
                                    let text_color = ''
                                    if (activity?.['trans_title'] === 'Goods receipt') {
                                        text_color = 'primary'
                                    }
                                    if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                        text_color = 'green'
                                    }
                                    if (activity?.['trans_title'] === 'Goods return') {
                                        text_color = 'blue'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                        text_color = 'purple'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery') {
                                        text_color = 'danger'
                                    }
                                    if (activity?.['trans_title'] === 'Goods issue') {
                                        text_color = 'orange'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            text_color = 'purple'
                                        }
                                    let trans_title_sub = {
                                        'Goods receipt': trans_script.attr('data-trans-grc'),
                                        'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                        'Goods return': trans_script.attr('data-trans-grt'),
                                        'Goods transfer (in)': trans_script.attr('data-trans-gtf'),
                                        'Delivery': trans_script.attr('data-trans-dlvr'),
                                        'Goods issue': trans_script.attr('data-trans-gis'),
                                        'Goods transfer (out)': trans_script.attr('data-trans-gtf'),
                                    }

                                    table_inventory_report_data.push({
                                        'row_type': 'log',
                                        'product_id': item?.['product']?.['id'],
                                        'text_color': text_color,
                                        'stock_type': activity?.['stock_type'],
                                        'trans_code': activity?.['trans_code'],
                                        'trans_title': trans_title_sub?.[activity?.['trans_title']],
                                        'system_date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                        'quantity': activity?.['quantity'],
                                        'cost': activity?.['cost'],
                                        'value': activity?.['value'],
                                        'current_quantity': activity?.['current_quantity'],
                                        'current_cost': activity?.['current_cost'],
                                        'current_value': activity?.['current_value'],
                                    })
                                }
                            }
                        }
                    }
                    RenderTableWithParameter(items_detail_report_table_Ele, table_inventory_report_data)
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                            if ($definition_inventory_valuation === '1') {
                                let condition1 = $definition_inventory_valuation === '1' && PERIODIC_CLOSED === false
                                let condition2 = $definition_inventory_valuation === '1'
                                let condition3 = $definition_inventory_valuation === '0'

                                items_detail_report_table_Ele.find('tbody .main-row').each(function () {
                                    $(this).find('td:eq(15) span').prop('hidden', condition1)
                                    $(this).find('td:eq(16) span').prop('hidden', condition1)
                                })
                                items_detail_report_table_Ele.find('tbody .eb-row').prop('hidden', condition1)

                                items_detail_report_table_Ele.find('tbody .detail-in').each(function () {
                                    $(this).find('td:eq(15) span').prop('hidden', condition2)
                                    $(this).find('td:eq(16) span').prop('hidden', condition2)
                                })
                                items_detail_report_table_Ele.find('tbody .detail-out').each(function () {
                                    $(this).find('td:eq(12) span').prop('hidden', condition2)
                                    $(this).find('td:eq(13) span').prop('hidden', condition2)
                                    $(this).find('td:eq(15) span').prop('hidden', condition2)
                                    $(this).find('td:eq(16) span').prop('hidden', condition2)
                                })

                                items_detail_report_table_Ele.find('tbody .eb-row').prop('hidden', condition3)
                            }
                            items_detail_report_table_Ele.prop('hidden', false)
                        },
                        500
                    )
                })
        }
        else {
            $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
        }
    })
    $('#btn-view').trigger('click')

    $('#btn-calculate').on('click', function () {
        Swal.fire({
            html:
                `<p class="text-center text-secondary fw-bold">${trans_script.attr('data-trans-sure-confirm')}</p>`,
            customClass: {
                confirmButton: 'btn btn-outline-primary text-primary',
                cancelButton: 'btn btn-outline-secondary text-secondary',
                container: 'swal2-has-bg',
                actions: 'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: trans_script.attr('data-trans-sure'),
            cancelButtonText: trans_script.attr('data-trans-cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                if (periodMonthEle.val()) {
                    items_detail_report_table_Ele.prop('hidden', true)
                    WindowControl.showLoading();
                    let dataParam = {}
                    dataParam['sub_period_order'] = periodMonthEle.val() ? parseInt(periodMonthEle.val()) : null
                    dataParam['period_mapped'] = periodEle.val() ? periodEle.val() : null
                    dataParam['product_id_list'] = items_select_Ele.val().join(',')
                    dataParam['is_calculate'] = 1
                    let inventory_detail_list_ajax = $.fn.callAjax2({
                        url: url_script.attr('data-url-inventory-detail-list'),
                        data: dataParam,
                        method: 'GET'
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_detail_list')) {
                                return data?.['report_inventory_detail_list'];
                            }
                            return {};
                        },
                        (errs) => {
                            console.log(errs);
                        }
                    )

                    Promise.all([inventory_detail_list_ajax]).then(
                        (results) => {
                            // console.log(results[0])
                            items_detail_report_table_Ele.DataTable().clear().destroy()
                            items_detail_report_table_Ele.find('tbody').html('')
                            for (const item of results[0]) {
                                let lot_number_html = ''
                                if (item?.['product']?.['lot_number']) {
                                    lot_number_html = `<span class="text-blue small fw-bold"><i class="bi bi-bookmark-fill"></i>&nbsp;${item?.['product']?.['lot_number']}</span>&nbsp;`
                                }
                                let sale_order_html = ''
                                if (item?.['product']?.['sale_order_code']) {
                                    sale_order_html = `<span class="text-pink small fw-bold"><i class="bi bi-clipboard-check"></i>&nbsp;${item?.['product']?.['sale_order_code']}</span>`
                                }

                                let cumulative_quantity = 0
                                let cumulative_value = 0
                                items_detail_report_table_Ele.find('tbody').append(
                                    `<tr class="main-row" style="background-color: #f5f5f5">
                                        <td class="first-col-x border-1">
                                            <span class="badge badge-secondary">${item?.['product']?.['code']}</span>
                                            <span class="text-secondary fw-bold">${item?.['product']?.['title']}</span>&nbsp;
                                            ${lot_number_html}
                                            ${sale_order_html}
                                        </td>
                                        <td><span class="text-primary small">${trans_script.attr('data-trans-we')}</span></td>
                                        <td></td>
                                        <td hidden></td>
                                        <td hidden></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td><span class="fw-bold text-secondary ${item?.['product']?.['id']}-cumulative-quantity">0</span></td>
                                        <td><span class="fw-bold text-secondary mask-money ${item?.['product']?.['id']}-cumulative-cost" data-init-money="0"></span></td>
                                        <td><span class="fw-bold text-secondary mask-money ${item?.['product']?.['id']}-cumulative-value" data-init-money="0"></span></td>
                                    </tr>`
                                )
                                for (const stock_activity of item?.['stock_activities']) {
                                    PERIODIC_CLOSED = stock_activity['periodic_closed']
                                    if (warehouses_select_Ele.val().length > 0) {
                                        if (warehouses_select_Ele.val().includes(stock_activity?.['warehouse_id'])) {
                                            let ob_label = `<span class="text-secondary">${trans_script.attr('data-trans-ob')}</span>`
                                            cumulative_quantity += stock_activity?.['ending_balance_quantity']
                                            cumulative_value += stock_activity?.['ending_balance_value']
                                            items_detail_report_table_Ele.find('tbody').append(
                                                `<tr class="fw-bold">
                                                    <td class="first-col border-1"></td>
                                                    <td></td>
                                                    <td><span class="badge badge-sm badge-secondary mb-1">${stock_activity?.['warehouse_code']}</span>&nbsp;<span class="text-secondary">${stock_activity?.['warehouse_title']}</span></td>
                                                    <td></td>
                                                    <td hidden></td>
                                                    <td hidden></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>`
                                            )
                                            items_detail_report_table_Ele.find('tbody').append(
                                                `<tr class="fw-bold ob-row">
                                                    <td class="first-col border-1"></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td hidden></td>
                                                    <td hidden></td>
                                                    <td>${ob_label}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td><span>${stock_activity?.['opening_balance_quantity']}</span></td>
                                                    <td><span class="mask-money" data-init-money="${stock_activity?.['opening_balance_cost']}"></span></td>
                                                    <td><span class="mask-money" data-init-money="${stock_activity?.['opening_balance_value']}"></span></td>
                                                </tr>`
                                            )
                                            for (const activity of stock_activity?.['data_stock_activity']) {
                                                if (activity?.['stock_type'] === 1) {
                                                    let text_color = ''
                                                    if (activity?.['trans_title'] === 'Goods receipt') {
                                                        text_color = 'primary'
                                                    }
                                                    if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                                        text_color = 'green'
                                                    }
                                                    if (activity?.['trans_title'] === 'Goods return') {
                                                        text_color = 'blue'
                                                    }
                                                    if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                                        text_color = 'purple'
                                                    }
                                                    let trans_title_sub = {
                                                        'Goods receipt': trans_script.attr('data-trans-grc'),
                                                        'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                                        'Goods return': trans_script.attr('data-trans-grt'),
                                                        'Goods transfer (in)': trans_script.attr('data-trans-gtf'),
                                                    }
                                                    let ob_label = `<span class="text-${text_color}">${trans_title_sub?.[activity?.['trans_title']]}</span>`
                                                    items_detail_report_table_Ele.find('tbody').append(
                                                        `<tr class="detail-in">
                                                            <td class="first-col border-1"></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><span>${moment(activity?.['system_date']).format("DD/MM/YYYY")}</span></td>
                                                            <td hidden></td>
                                                            <td hidden></td>
                                                            <td>${ob_label}</td>
                                                            <td><span class="badge badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
                                                            <td><span class="text-${text_color}">${activity?.['quantity']}</span></td>
                                                            <td><span class="mask-money text-${text_color}" data-init-money="${activity?.['cost']}"></span></td>
                                                            <td><span class="mask-money text-${text_color}" data-init-money="${activity?.['value']}"></span></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><span">${activity?.['current_quantity']}</span></td>
                                                            <td><span class="mask-money" data-init-money="${activity?.['current_cost']}"></span></td>
                                                            <td><span class="mask-money" data-init-money="${activity?.['current_value']}"></span></td>
                                                        </tr>`
                                                    )
                                                } else {
                                                    let text_color = ''
                                                    if (activity?.['trans_title'] === 'Delivery') {
                                                        text_color = 'danger'
                                                    }
                                                    if (activity?.['trans_title'] === 'Goods issue') {
                                                        text_color = 'orange'
                                                    }
                                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                                        text_color = 'purple'
                                                    }
                                                    let trans_title_sub = {
                                                        'Delivery': trans_script.attr('data-trans-dlvr'),
                                                        'Goods issue': trans_script.attr('data-trans-gis'),
                                                        'Goods transfer (out)': trans_script.attr('data-trans-gtf'),
                                                    }
                                                    let ob_label = `<span class="text-${text_color}">${trans_title_sub?.[activity?.['trans_title']]}</span>`
                                                    items_detail_report_table_Ele.find('tbody').append(
                                                        `<tr class="detail-out">
                                                            <td class="first-col border-1"></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><span>${moment(activity?.['system_date']).format("DD/MM/YYYY")}</span></td>
                                                            <td hidden></td>
                                                            <td hidden></td>
                                                            <td>${ob_label}</td>
                                                            <td><span class="badge badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><span class="text-${text_color}">${activity?.['quantity']}</span></td>
                                                            <td><span class="mask-money text-${text_color}" data-init-money="${activity?.['cost']}"></span></td>
                                                            <td><span class="mask-money text-${text_color}" data-init-money="${activity?.['value']}"></span></td>
                                                            <td><span>${activity?.['current_quantity']}</span></td>
                                                            <td><span class="mask-money" data-init-money="${activity?.['current_cost']}"></span></td>
                                                            <td><span class="mask-money" data-init-money="${activity?.['current_value']}"></span></td>
                                                        </tr>`
                                                    )
                                                }
                                            }
                                            let eb_label = `<span class="text-secondary">${trans_script.attr('data-trans-eb')}</span>`
                                            items_detail_report_table_Ele.find('tbody').append(
                                                `<tr class="fw-bold eb-row" hidden>
                                                    <td class="first-col border-1"></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td hidden></td>
                                                    <td hidden></td>
                                                    <td>${eb_label}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td><span>${stock_activity?.['ending_balance_quantity']}</span></td>
                                                    <td><span class="mask-money" data-init-money="${stock_activity?.['ending_balance_cost']}"></span></td>
                                                    <td><span class="mask-money" data-init-money="${stock_activity?.['ending_balance_value']}"></span></td>
                                                </tr>`
                                            )
                                        }
                                    } else {
                                        let ob_label = `<span class="text-secondary">${trans_script.attr('data-trans-ob')}</span>`
                                        cumulative_quantity += stock_activity?.['ending_balance_quantity']
                                        cumulative_value += stock_activity?.['ending_balance_value']
                                        items_detail_report_table_Ele.find('tbody').append(
                                            `<tr class="fw-bold">
                                                <td class="first-col border-1"></td>
                                                <td></td>
                                                <td><span class="badge badge-sm badge-secondary mb-1">${stock_activity?.['warehouse_code']}</span>&nbsp;<span class="text-secondary">${stock_activity?.['warehouse_title']}</span></td>
                                                <td></td>
                                                <td hidden></td>
                                                <td hidden></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>`
                                        )
                                        items_detail_report_table_Ele.find('tbody').append(
                                            `<tr class="fw-bold ob-row">
                                                <td class="first-col border-1"></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td hidden></td>
                                                <td hidden></td>
                                                <td>${ob_label}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td><span>${stock_activity?.['opening_balance_quantity']}</span></td>
                                                <td><span class="mask-money" data-init-money="${stock_activity?.['opening_balance_cost']}"></span></td>
                                                <td><span class="mask-money" data-init-money="${stock_activity?.['opening_balance_value']}"></span></td>
                                            </tr>`
                                        )
                                        for (const activity of stock_activity?.['data_stock_activity']) {
                                            if (activity?.['stock_type'] === 1) {
                                                let text_color = ''
                                                if (activity?.['trans_title'] === 'Goods receipt') {
                                                    text_color = 'primary'
                                                }
                                                if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                                    text_color = 'green'
                                                }
                                                if (activity?.['trans_title'] === 'Goods return') {
                                                    text_color = 'blue'
                                                }
                                                if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                                    text_color = 'purple'
                                                }
                                                let trans_title_sub = {
                                                    'Goods receipt': trans_script.attr('data-trans-grc'),
                                                    'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                                    'Goods return': trans_script.attr('data-trans-grt'),
                                                    'Goods transfer (in)': trans_script.attr('data-trans-gtf'),
                                                }
                                                let ob_label = `<span class="text-${text_color}">${trans_title_sub?.[activity?.['trans_title']]}</span>`
                                                items_detail_report_table_Ele.find('tbody').append(
                                                    `<tr class="detail-in">
                                                        <td class="first-col border-1"></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><span>${moment(activity?.['system_date']).format("DD/MM/YYYY")}</span></td>
                                                        <td hidden></td>
                                                        <td hidden></td>
                                                        <td>${ob_label}</td>
                                                        <td><span class="badge badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
                                                        <td><span class="text-${text_color}">${activity?.['quantity']}</span></td>
                                                        <td><span class="mask-money text-${text_color}" data-init-money="${activity?.['cost']}"></span></td>
                                                        <td><span class="mask-money text-${text_color}" data-init-money="${activity?.['value']}"></span></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><span>${activity?.['current_quantity']}</span></td>
                                                        <td><span class="mask-money" data-init-money="${activity?.['current_cost']}"></span></td>
                                                        <td><span class="mask-money" data-init-money="${activity?.['current_value']}"></span></td>
                                                    </tr>`
                                                )
                                            } else {
                                                let text_color = ''
                                                if (activity?.['trans_title'] === 'Delivery') {
                                                    text_color = 'danger'
                                                }
                                                if (activity?.['trans_title'] === 'Goods issue') {
                                                    text_color = 'orange'
                                                }
                                                if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                                    text_color = 'purple'
                                                }
                                                let trans_title_sub = {
                                                    'Delivery': trans_script.attr('data-trans-dlvr'),
                                                    'Goods issue': trans_script.attr('data-trans-gis'),
                                                    'Goods transfer (out)': trans_script.attr('data-trans-gtf'),
                                                }
                                                let ob_label = `<span class="text-${text_color}">${trans_title_sub?.[activity?.['trans_title']]}</span>`
                                                items_detail_report_table_Ele.find('tbody').append(
                                                    `<tr class="detail-out">
                                                        <td class="first-col border-1"></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><span>${moment(activity?.['system_date']).format("DD/MM/YYYY")}</span></td>
                                                        <td hidden></td>
                                                        <td hidden></td>
                                                        <td>${ob_label}</td>
                                                        <td><span class="badge badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><span class="text-${text_color}">${activity?.['quantity']}</span></td>
                                                        <td><span class="mask-money text-${text_color}" data-init-money="${activity?.['cost']}"></span></td>
                                                        <td><span class="mask-money text-${text_color}" data-init-money="${activity?.['value']}"></span></td>
                                                        <td><span>${activity?.['current_quantity']}</span></td>
                                                        <td><span class="mask-money" data-init-money="${activity?.['current_cost']}"></span></td>
                                                        <td><span class="mask-money" data-init-money="${activity?.['current_value']}"></span></td>
                                                    </tr>`
                                                )
                                            }
                                        }
                                        let eb_label = `<span class="text-secondary">${trans_script.attr('data-trans-eb')}</span>`
                                        items_detail_report_table_Ele.find('tbody').append(
                                            `<tr class="fw-bold eb-row" hidden>
                                                <td class="first-col border-1"></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td hidden></td>
                                                <td hidden></td>
                                                <td>${eb_label}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td><span>${stock_activity?.['ending_balance_quantity']}</span></td>
                                                <td><span class="mask-money" data-init-money="${stock_activity?.['ending_balance_cost']}"></span></td>
                                                <td><span class="mask-money" data-init-money="${stock_activity?.['ending_balance_value']}"></span></td>
                                            </tr>`
                                        )
                                    }
                                }
                                $(`.${item?.['product']?.['id']}-cumulative-quantity`).text(cumulative_quantity)
                                $(`.${item?.['product']?.['id']}-cumulative-value`).attr('data-init-money', cumulative_value)
                                $(`.${item?.['product']?.['id']}-cumulative-cost`).attr('data-init-money', cumulative_value / cumulative_quantity)
                            }
                            $.fn.initMaskMoney2()
                            setTimeout(
                                () => {
                                    WindowControl.hideLoading();
                                    if ($definition_inventory_valuation === '1') {
                                        let condition1 = $definition_inventory_valuation === '1' && PERIODIC_CLOSED === false
                                        let condition2 = $definition_inventory_valuation === '1'

                                        items_detail_report_table_Ele.find('tbody .main-row').each(function () {
                                            $(this).find('td:eq(15) span').prop('hidden', condition1)
                                            $(this).find('td:eq(16) span').prop('hidden', condition1)
                                        })
                                        items_detail_report_table_Ele.find('tbody .eb-row').prop('hidden', condition1)

                                        items_detail_report_table_Ele.find('tbody .detail-in').each(function () {
                                            $(this).find('td:eq(15) span').prop('hidden', condition2)
                                            $(this).find('td:eq(16) span').prop('hidden', condition2)
                                        })
                                        items_detail_report_table_Ele.find('tbody .detail-out').each(function () {
                                            $(this).find('td:eq(12) span').prop('hidden', condition2)
                                            $(this).find('td:eq(13) span').prop('hidden', condition2)
                                            $(this).find('td:eq(15) span').prop('hidden', condition2)
                                            $(this).find('td:eq(16) span').prop('hidden', condition2)
                                        })
                                    }
                                    items_detail_report_table_Ele.prop('hidden', false)
                                },
                                500
                            )
                        })
                }
                else {
                    $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
                }
            }
        })
    })
})