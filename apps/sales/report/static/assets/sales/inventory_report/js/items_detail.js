$(document).ready(function () {
    const items_select_Ele = $('#items_select')
    const warehouses_select_Ele = $('#warehouses_select')
    const items_detail_report_table_Ele = $('#items_detail_report_table')
    const periodEle = $('#period-select')
    const periodMonthEle = $('#period-month')
    const trans_script = $('#trans-script')
    const url_script = $('#url-script')
    const $definition_inventory_valuation = $('#definition_inventory_valuation').text()
    if ($definition_inventory_valuation === '0') {
        $('#btn-calculate').remove()
    }
    let PERIODIC_CLOSED = false

    function LoadItemsSelectBox(ele, data) {
        ele.initSelect2({
            placeholder: trans_script.attr('data-trans-all'),
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
            placeholder: trans_script.attr('data-trans-all'),
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
            styleDom: 'hide-foot',
            paging: false,
            scrollY: '72vh',
            scrollX: true,
            scrollCollapse: true,
            reloadCurrency: true,
            data: data_list,
            columns: [
                {
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'prd') {
                            let lot_number = ''
                            let serial_number = ''
                            if (row?.['product_lot_number']) {
                                lot_number = `<br><span class="text-blue mr-1">${$.fn.gettext('Lot')}:</span><span class="text-blue">${row?.['product_lot_number']}</span><br>`
                            }
                            if (row?.['product_serial_number']) {
                                serial_number = `<br><span class="text-danger mr-1">${$.fn.gettext('Specific serial number')}:</span><span class="text-danger">${row?.['product_serial_number']}</span>`
                            }
                            let dot = [
                                '<span class="badge bg-blue badge-indicator"></span>',
                                '<span class="badge bg-success badge-indicator"></span>',
                                '<span class="badge bg-danger badge-indicator"></span>'
                            ][parseInt(row?.['vm'])]
                            let html = `
                                ${dot}
                                <span class="badge badge-sm badge-soft-secondary badge-outline">${row?.['product_code']}</span><br>
                                <span data-product-id="${row?.['product_id'] || ''}" data-product-lot-number="${row?.['product_lot_number'] || ''}" data-product-serial-number="${row?.['product_serial_number'] || ''}" class="product-td fw-bold">${row?.['product_title']}</span>${lot_number}${serial_number}<br>
                                <span class="text-muted mr-1">${trans_script.attr('data-trans-uom')}:</span><span class="text-muted">${row?.['product_uom']}</span><br>
                            `
                            if (row?.['order_code']) {
                                html += `<span class="ml-1 text-danger small fw-bold sale-order-td" data-so-id="${row?.['order_id'] || ''}">${row?.['order_code']}</span>`
                            }
                            return html
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<span class="text-muted">${row?.['system_date']}</span>`
                        }
                        else if (row?.['row_type'] === 'open') {
                            return `--`
                        }
                        else if (row?.['row_type'] === 'wh') {
                            return `<span class="badge badge-sm badge-primary ml-1">${row?.['warehouse_code']}</span>
                                    <span class="warehouse-td text-primary fw-bold wh-of-${row?.['product_id']}">${row?.['warehouse_title']}</span>`
                        }
                        return ''
                    }
                },
                {
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'open') {
                            return `<span class="text-center text-secondary">${row?.['ob_label']}</span>`
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<span class="text-${row?.['text_color']}">${row?.['trans_title']} ${row?.['trans_code']}</span>`
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
                            return `<span class="text-secondary">${row?.['opening_balance_quantity']}</span>`
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<span class="text-secondary current-quantity-${row?.['product_id']}" data-stock-type="${row?.['stock_type']}">${row?.['current_quantity']}</span>`
                        }
                        else if (row?.['row_type'] === 'prd') {
                            let unique_ele_id = `${row?.['product_id'] || ''}-${row?.['order_id'] || ''}-${row?.['product_lot_number'] || ''}-${row?.['product_serial_number'] || ''}`
                            return `<span class="fw-bold text-primary sum-current-quantity-${unique_ele_id}"></span>`
                        }
                        else if (row?.['row_type'] === 'wh') {
                            let unique_ele_id = `${row?.['product_id'] || ''}-${row?.['order_id'] || ''}-${row?.['product_lot_number'] || ''}-${row?.['product_serial_number'] || ''}`
                            return `<span class="fw-bold text-secondary sum-current-quantity-of-wh-${unique_ele_id}">${row?.['ending_balance_quantity']}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'open') {
                            return `<span class="text-secondary mask-money" data-init-money="${row?.['opening_balance_cost']}"></span>`
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<span class="text-secondary mask-money current-cost-${row?.['product_id']}" data-stock-type="${row?.['stock_type']}" data-init-money="${row?.['current_cost']}"></span>`
                        }
                        else if (row?.['row_type'] === 'prd') {
                            let unique_ele_id = `${row?.['product_id'] || ''}-${row?.['order_id'] || ''}-${row?.['product_lot_number'] || ''}-${row?.['product_serial_number'] || ''}`
                            return `<span class="fw-bold text-primary mask-money sum-current-cost-${unique_ele_id}" data-init-money=""></span>`
                        }
                        else if (row?.['row_type'] === 'wh') {
                            let unique_ele_id = `${row?.['product_id'] || ''}-${row?.['order_id'] || ''}-${row?.['product_lot_number'] || ''}-${row?.['product_serial_number'] || ''}`
                            return `<span class="fw-bold text-secondary mask-money sum-current-cost-of-wh-${unique_ele_id}" data-init-money="${row?.['ending_balance_cost']}"></span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'open') {
                            return `<span class="text-secondary mask-money" data-init-money="${row?.['opening_balance_value']}"></span>`
                        }
                        else if (row?.['row_type'] === 'log') {
                            return `<span class="text-secondary mask-money current-value-${row?.['product_id']}" data-stock-type="${row?.['stock_type']}" data-init-money="${row?.['current_value']}"></span>`
                        }
                        else if (row?.['row_type'] === 'prd') {
                            let unique_ele_id = `${row?.['product_id'] || ''}-${row?.['order_id'] || ''}-${row?.['product_lot_number'] || ''}-${row?.['product_serial_number'] || ''}`
                            return `<span class="fw-bold text-primary mask-money sum-current-value-${unique_ele_id}" data-init-money=""></span>`
                        }
                        else if (row?.['row_type'] === 'wh') {
                            let unique_ele_id = `${row?.['product_id'] || ''}-${row?.['order_id'] || ''}-${row?.['product_lot_number'] || ''}-${row?.['product_serial_number'] || ''}`
                            return `<span class="fw-bold text-secondary mask-money sum-current-value-of-wh-${unique_ele_id}" data-init-money="${row?.['ending_balance_value']}"></span>`
                        }
                        return ``
                    }
                },
            ],
            initComplete: function(settings, json) {
                table.find('.product-td').each(function () {
                    $(this).closest('tr').addClass('bg-secondary-light-5')
                    $(this).closest('tr').addClass('fixed-row')
                    $(this).closest('td').attr('colspan', 5)
                    $(this).closest('tr').find('td:eq(1)').remove()
                    $(this).closest('tr').find('td:eq(1)').remove()
                    $(this).closest('tr').find('td:eq(1)').remove()
                    $(this).closest('tr').find('td:eq(1)').remove()

                    let product_id = $(this).attr('data-product-id') || ''
                    let product_lot_number = $(this).attr('data-product-lot-number') || ''
                    let product_serial_number = $(this).attr('data-product-serial-number') || ''
                    let order_id = $(this).closest('tr').find('.sale-order-td').attr('data-so-id') || ''
                    let unique_ele_id = `${product_id}-${order_id}-${product_lot_number}-${product_serial_number}`

                    let sum_current_quantity = 0
                    table.find(`.sum-current-quantity-of-wh-${unique_ele_id}`).each(function () {
                        sum_current_quantity += parseFloat($(this).text())
                    })

                    let sum_current_value = 0
                    table.find(`.sum-current-value-of-wh-${unique_ele_id}`).each(function () {
                        sum_current_value += parseFloat($(this).attr('data-init-money'))
                    })

                    table.find(`.sum-current-quantity-${unique_ele_id}`).text(sum_current_quantity)
                    table.find(`.sum-current-cost-${unique_ele_id}`).attr('data-init-money', sum_current_quantity !== 0 ? sum_current_value/sum_current_quantity : 0)
                    table.find(`.sum-current-value-${unique_ele_id}`).attr('data-init-money', sum_current_value)
                })

                table.find('.warehouse-td').each(function () {
                    $(this).closest('td').attr('colspan', 5)
                    $(this).closest('tr').find('td:eq(1)').remove()
                    $(this).closest('tr').find('td:eq(1)').remove()
                    $(this).closest('tr').find('td:eq(1)').remove()
                    $(this).closest('tr').find('td:eq(1)').remove()
                })

                const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
                const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
                $('.popover-prd:first-child').trigger('hover')

                let wrapper$ = table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="text-muted">${trans_script.attr('data-trans-vm')}</span>`)
                    ).append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="badge bg-blue badge-indicator"></span><span class="text-muted">${trans_script.attr('data-trans-fifo')}</span>`)
                    ).append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="badge bg-success badge-indicator"></span><span class="text-muted">${trans_script.attr('data-trans-we')}</span>`)
                    ).append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="badge bg-danger badge-indicator"></span><span class="text-muted">${trans_script.attr('data-trans-si')}</span>`)
                    )
                }
            },
        });
    }

    $('#btn-view').on('click', function () {
        if (periodMonthEle.val()) {
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
                    if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_stock_list')) {
                        // console.log(data?.['report_inventory_stock_list'])
                        return data?.['report_inventory_stock_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([inventory_detail_list_ajax]).then(
                (results) => {
                    items_detail_report_table_Ele.DataTable().clear().destroy()
                    items_detail_report_table_Ele.find('tbody').html('')
                    let table_inventory_report_data = []
                    for (const item of results[0]) {
                        table_inventory_report_data.push({
                            'row_type': 'prd',
                            'product_id': item?.['product']?.['id'] || '',
                            'product_code': item?.['product']?.['code'] || '',
                            'product_title': item?.['product']?.['title'] || '',
                            'product_uom': item?.['product']?.['uom']?.['title'] || '',
                            'product_lot_number': item?.['product']?.['lot_number'] || '',
                            'product_serial_number': item?.['product']?.['serial_number'] || '',
                            'order_code': item?.['product']?.['order_code'] || '',
                            'order_id': item?.['product']?.['order_id'] || '',
                            'vm': item?.['product']?.['valuation_method'] || 0
                        })
                        for (const stock_activity of item?.['stock_activities']) {
                            if (warehouses_select_Ele.val().length > 0) {
                                if (warehouses_select_Ele.val().includes(stock_activity?.['warehouse_id'])) {
                                    table_inventory_report_data.push({
                                        'row_type': 'wh',
                                        'product_id': item?.['product']?.['id'] || '',
                                        'product_lot_number': item?.['product']?.['lot_number'] || '',
                                        'product_serial_number': item?.['product']?.['serial_number'] || '',
                                        'order_code': item?.['product']?.['order_code'],
                                        'warehouse_id': stock_activity?.['warehouse_id'] || '',
                                        'warehouse_code': stock_activity?.['warehouse_code'] || '',
                                        'warehouse_title': stock_activity?.['warehouse_title'] || '',
                                        'ending_balance_quantity': stock_activity?.['ending_balance_quantity'] || 0,
                                        'ending_balance_cost': stock_activity?.['ending_balance_cost'] || 0,
                                        'ending_balance_value': stock_activity?.['ending_balance_value'] || 0,
                                        'order_id': item?.['product']?.['order_id'] || '',
                                    })
                                    table_inventory_report_data.push({
                                        'row_type': 'open',
                                        'product_id': item?.['product']?.['id'] || '',
                                        'product_lot_number': item?.['product']?.['lot_number'] || '',
                                        'product_serial_number': item?.['product']?.['serial_number'] || '',
                                        'order_code': item?.['product']?.['order_code'],
                                        'ob_label': trans_script.attr('data-trans-ob'),
                                        'opening_balance_quantity': stock_activity?.['opening_balance_quantity'] || 0,
                                        'opening_balance_cost': stock_activity?.['opening_balance_cost'] || 0,
                                        'opening_balance_value': stock_activity?.['opening_balance_value'] || 0,
                                        'order_id': item?.['product']?.['order_id'] || '',
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
                                        if (activity?.['trans_title'] === 'Delivery (sale)' || activity?.['trans_title'] === 'Delivery (lease)' || activity?.['trans_title'] === 'Delivery (service)') {
                                            text_color = 'danger'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            text_color = 'orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            text_color = 'purple'
                                        }
                                        if (activity?.['trans_title'] === 'Balance init input')  {
                                            text_color = 'muted'
                                        }
                                        let trans_title_sub = {
                                            'Goods receipt': trans_script.attr('data-trans-grc'),
                                            'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                            'Goods return': trans_script.attr('data-trans-grt'),
                                            'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                            'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                            'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                            'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                            'Goods issue': trans_script.attr('data-trans-gis'),
                                            'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                        }

                                        table_inventory_report_data.push({
                                            'row_type': 'log',
                                            'product_id': item?.['product']?.['id'] || '',
                                            'product_lot_number': item?.['product']?.['lot_number'] || '',
                                            'product_serial_number': item?.['product']?.['serial_number'] || '',
                                            'order_code': item?.['product']?.['order_code'] || '',
                                            'text_color': text_color,
                                            'stock_type': activity?.['stock_type'] || '',
                                            'trans_code': activity?.['trans_code'] || '',
                                            'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                            'system_date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                            'quantity': activity?.['quantity'] || 0,
                                            'cost': activity?.['cost'] || 0,
                                            'value': activity?.['value'] || 0,
                                            'current_quantity': activity?.['current_quantity'] || 0,
                                            'current_cost': activity?.['current_cost'] || 0,
                                            'current_value': activity?.['current_value'] || 0,
                                            'order_id': item?.['product']?.['order_id'] || '',
                                        })
                                    }
                                }
                            }
                            else {
                                table_inventory_report_data.push({
                                    'row_type': 'wh',
                                    'product_id': item?.['product']?.['id'] || '',
                                    'product_lot_number': item?.['product']?.['lot_number'] || '',
                                    'product_serial_number': item?.['product']?.['serial_number'] || '',
                                    'order_code': item?.['product']?.['order_code'] || '',
                                    'warehouse_id': stock_activity?.['warehouse_id'] || '',
                                    'warehouse_code': stock_activity?.['warehouse_code'] || '',
                                    'warehouse_title': stock_activity?.['warehouse_title'] || '',
                                    'ending_balance_quantity': stock_activity?.['ending_balance_quantity'] || 0,
                                    'ending_balance_cost': stock_activity?.['ending_balance_cost'] || 0,
                                    'ending_balance_value': stock_activity?.['ending_balance_value'] || 0,
                                    'order_id': item?.['product']?.['order_id'] || '',
                                })
                                table_inventory_report_data.push({
                                    'row_type': 'open',
                                    'product_id': item?.['product']?.['id'] || '',
                                    'product_lot_number': item?.['product']?.['lot_number'] || '',
                                    'product_serial_number': item?.['product']?.['serial_number'] || '',
                                    'order_code': item?.['product']?.['order_code'] || '',
                                    'ob_label': trans_script.attr('data-trans-ob'),
                                    'opening_balance_quantity': stock_activity?.['opening_balance_quantity'] || 0,
                                    'opening_balance_cost': stock_activity?.['opening_balance_cost'] || 0,
                                    'opening_balance_value': stock_activity?.['opening_balance_value'] || 0,
                                    'order_id': item?.['product']?.['order_id'] || '',
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
                                    if (activity?.['trans_title'] === 'Delivery (sale)' || activity?.['trans_title'] === 'Delivery (lease)' || activity?.['trans_title'] === 'Delivery (service)') {
                                        text_color = 'danger'
                                    }
                                    if (activity?.['trans_title'] === 'Goods issue') {
                                        text_color = 'orange'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            text_color = 'purple'
                                        }
                                    if (activity?.['trans_title'] === 'Balance init input') {
                                        text_color = 'muted'
                                    }
                                    let trans_title_sub = {
                                        'Goods receipt': trans_script.attr('data-trans-grc'),
                                        'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                        'Goods return': trans_script.attr('data-trans-grt'),
                                        'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                        'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                        'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                        'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                        'Goods issue': trans_script.attr('data-trans-gis'),
                                        'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                        'Balance init input': trans_script.attr('data-trans-bii'),
                                    }

                                    table_inventory_report_data.push({
                                        'row_type': 'log',
                                        'product_id': item?.['product']?.['id'] || '',
                                        'product_lot_number': item?.['product']?.['lot_number'] || '',
                                        'product_serial_number': item?.['product']?.['serial_number'] || '',
                                        'order_code': item?.['product']?.['order_code'] || '',
                                        'text_color': text_color,
                                        'stock_type': activity?.['stock_type'] || '',
                                        'trans_code': activity?.['trans_code'] || '',
                                        'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                        'system_date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                        'quantity': activity?.['quantity'] || 0,
                                        'cost': activity?.['cost'] || 0,
                                        'value': activity?.['value'] || 0,
                                        'current_quantity': activity?.['current_quantity'] || 0,
                                        'current_cost': activity?.['current_cost'] || 0,
                                        'current_value': activity?.['current_value'] || 0,
                                        'order_id': item?.['product']?.['order_id'] || '',
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

    $('#btn-refresh').on('click', function () {
        if (periodMonthEle.val()) {
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
                    if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_stock_list')) {
                        // console.log(data?.['report_inventory_stock_list'])
                        return data?.['report_inventory_stock_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([inventory_detail_list_ajax]).then(
                (results) => {
                    items_detail_report_table_Ele.DataTable().clear().destroy()
                    items_detail_report_table_Ele.find('tbody').html('')
                    let table_inventory_report_data = []
                    for (const item of results[0]) {
                        table_inventory_report_data.push({
                            'row_type': 'prd',
                            'product_id': item?.['product']?.['id'] || '',
                            'product_code': item?.['product']?.['code'] || '',
                            'product_title': item?.['product']?.['title'] || '',
                            'product_uom': item?.['product']?.['uom']?.['title'] || '',
                            'product_lot_number': item?.['product']?.['lot_number'] || '',
                            'product_serial_number': item?.['product']?.['serial_number'] || '',
                            'order_code': item?.['product']?.['order_code'] || '',
                            'order_id': item?.['product']?.['order_id'] || '',
                            'vm': item?.['product']?.['valuation_method'] || 0
                        })
                        for (const stock_activity of item?.['stock_activities']) {
                            if (warehouses_select_Ele.val().length > 0) {
                                if (warehouses_select_Ele.val().includes(stock_activity?.['warehouse_id'])) {
                                    table_inventory_report_data.push({
                                        'row_type': 'wh',
                                        'product_id': item?.['product']?.['id'] || '',
                                        'product_lot_number': item?.['product']?.['lot_number'] || '',
                                        'product_serial_number': item?.['product']?.['serial_number'] || '',
                                        'order_code': item?.['product']?.['order_code'],
                                        'warehouse_id': stock_activity?.['warehouse_id'] || '',
                                        'warehouse_code': stock_activity?.['warehouse_code'] || '',
                                        'warehouse_title': stock_activity?.['warehouse_title'] || '',
                                        'ending_balance_quantity': stock_activity?.['ending_balance_quantity'] || 0,
                                        'ending_balance_cost': stock_activity?.['ending_balance_cost'] || 0,
                                        'ending_balance_value': stock_activity?.['ending_balance_value'] || 0,
                                        'order_id': item?.['product']?.['order_id'] || '',
                                    })
                                    table_inventory_report_data.push({
                                        'row_type': 'open',
                                        'product_id': item?.['product']?.['id'] || '',
                                        'product_lot_number': item?.['product']?.['lot_number'] || '',
                                        'product_serial_number': item?.['product']?.['serial_number'] || '',
                                        'order_code': item?.['product']?.['order_code'],
                                        'ob_label': trans_script.attr('data-trans-ob'),
                                        'opening_balance_quantity': stock_activity?.['opening_balance_quantity'] || 0,
                                        'opening_balance_cost': stock_activity?.['opening_balance_cost'] || 0,
                                        'opening_balance_value': stock_activity?.['opening_balance_value'] || 0,
                                        'order_id': item?.['product']?.['order_id'] || '',
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
                                        if (activity?.['trans_title'] === 'Delivery (sale)' || activity?.['trans_title'] === 'Delivery (lease)' || activity?.['trans_title'] === 'Delivery (service)') {
                                            text_color = 'danger'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            text_color = 'orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            text_color = 'purple'
                                        }
                                        if (activity?.['trans_title'] === 'Balance init input')  {
                                            text_color = 'muted'
                                        }
                                        let trans_title_sub = {
                                            'Goods receipt': trans_script.attr('data-trans-grc'),
                                            'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                            'Goods return': trans_script.attr('data-trans-grt'),
                                            'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                            'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                            'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                            'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                            'Goods issue': trans_script.attr('data-trans-gis'),
                                            'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                        }

                                        table_inventory_report_data.push({
                                            'row_type': 'log',
                                            'product_id': item?.['product']?.['id'] || '',
                                            'product_lot_number': item?.['product']?.['lot_number'] || '',
                                            'product_serial_number': item?.['product']?.['serial_number'] || '',
                                            'order_code': item?.['product']?.['order_code'] || '',
                                            'text_color': text_color,
                                            'stock_type': activity?.['stock_type'] || '',
                                            'trans_code': activity?.['trans_code'] || '',
                                            'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                            'system_date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                            'quantity': activity?.['quantity'] || 0,
                                            'cost': activity?.['cost'] || 0,
                                            'value': activity?.['value'] || 0,
                                            'current_quantity': activity?.['current_quantity'] || 0,
                                            'current_cost': activity?.['current_cost'] || 0,
                                            'current_value': activity?.['current_value'] || 0,
                                            'order_id': item?.['product']?.['order_id'] || '',
                                        })
                                    }
                                }
                            }
                            else {
                                table_inventory_report_data.push({
                                    'row_type': 'wh',
                                    'product_id': item?.['product']?.['id'] || '',
                                    'product_lot_number': item?.['product']?.['lot_number'] || '',
                                    'product_serial_number': item?.['product']?.['serial_number'] || '',
                                    'order_code': item?.['product']?.['order_code'] || '',
                                    'warehouse_id': stock_activity?.['warehouse_id'] || '',
                                    'warehouse_code': stock_activity?.['warehouse_code'] || '',
                                    'warehouse_title': stock_activity?.['warehouse_title'] || '',
                                    'ending_balance_quantity': stock_activity?.['ending_balance_quantity'] || 0,
                                    'ending_balance_cost': stock_activity?.['ending_balance_cost'] || 0,
                                    'ending_balance_value': stock_activity?.['ending_balance_value'] || 0,
                                    'order_id': item?.['product']?.['order_id'] || '',
                                })
                                table_inventory_report_data.push({
                                    'row_type': 'open',
                                    'product_id': item?.['product']?.['id'] || '',
                                    'product_lot_number': item?.['product']?.['lot_number'] || '',
                                    'product_serial_number': item?.['product']?.['serial_number'] || '',
                                    'order_code': item?.['product']?.['order_code'] || '',
                                    'ob_label': trans_script.attr('data-trans-ob'),
                                    'opening_balance_quantity': stock_activity?.['opening_balance_quantity'] || 0,
                                    'opening_balance_cost': stock_activity?.['opening_balance_cost'] || 0,
                                    'opening_balance_value': stock_activity?.['opening_balance_value'] || 0,
                                    'order_id': item?.['product']?.['order_id'] || '',
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
                                    if (activity?.['trans_title'] === 'Delivery (sale)' || activity?.['trans_title'] === 'Delivery (lease)' || activity?.['trans_title'] === 'Delivery (service)') {
                                        text_color = 'danger'
                                    }
                                    if (activity?.['trans_title'] === 'Goods issue') {
                                        text_color = 'orange'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            text_color = 'purple'
                                        }
                                    if (activity?.['trans_title'] === 'Balance init input') {
                                        text_color = 'muted'
                                    }
                                    let trans_title_sub = {
                                        'Goods receipt': trans_script.attr('data-trans-grc'),
                                        'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                        'Goods return': trans_script.attr('data-trans-grt'),
                                        'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                        'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                        'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                        'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                        'Goods issue': trans_script.attr('data-trans-gis'),
                                        'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                        'Balance init input': trans_script.attr('data-trans-bii'),
                                    }

                                    table_inventory_report_data.push({
                                        'row_type': 'log',
                                        'product_id': item?.['product']?.['id'] || '',
                                        'product_lot_number': item?.['product']?.['lot_number'] || '',
                                        'product_serial_number': item?.['product']?.['serial_number'] || '',
                                        'order_code': item?.['product']?.['order_code'] || '',
                                        'text_color': text_color,
                                        'stock_type': activity?.['stock_type'] || '',
                                        'trans_code': activity?.['trans_code'] || '',
                                        'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                        'system_date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                        'quantity': activity?.['quantity'] || 0,
                                        'cost': activity?.['cost'] || 0,
                                        'value': activity?.['value'] || 0,
                                        'current_quantity': activity?.['current_quantity'] || 0,
                                        'current_cost': activity?.['current_cost'] || 0,
                                        'current_value': activity?.['current_value'] || 0,
                                        'order_id': item?.['product']?.['order_id'] || '',
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
                            if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_stock_list')) {
                                return data?.['report_inventory_stock_list'];
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
                                    lot_number_html = `<span class="text-blue small fw-bold">${item?.['product']?.['lot_number']}</span>&nbsp;`
                                }
                                let order_html = ''
                                if (item?.['product']?.['order_code']) {
                                    order_html = `<span class="text-pink small fw-bold"><i class="bi bi-clipboard-check"></i>&nbsp;${item?.['product']?.['order_code']}</span>`
                                }

                                let cumulative_quantity = 0
                                let cumulative_value = 0
                                items_detail_report_table_Ele.find('tbody').append(
                                    `<tr class="main-row" style="background-color: #f5f5f5">
                                        <td class="first-col-x border-1">
                                            <span class="badge badge-secondary">${item?.['product']?.['code']}</span>
                                            <span class="text-secondary fw-bold">${item?.['product']?.['title']}</span>&nbsp;
                                            ${lot_number_html}
                                            ${order_html}
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
                                                    if (activity?.['trans_title'] === 'Balance init input') {
                                                        text_color = 'muted'
                                                    }
                                                    let trans_title_sub = {
                                                        'Goods receipt': trans_script.attr('data-trans-grc'),
                                                        'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                                        'Goods return': trans_script.attr('data-trans-grt'),
                                                        'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                                    }
                                                    let ob_label = `<span class="text-${text_color}">${trans_title_sub?.[activity?.['trans_title']]}</span>`
                                                    items_detail_report_table_Ele.find('tbody').append(
                                                        `<tr class="detail-in">
                                                            <td class="first-col border-1"></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><span class="small">${moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm")}</span></td>
                                                            <td hidden></td>
                                                            <td hidden></td>
                                                            <td>${ob_label}</td>
                                                            <td><span class="badge badge-sm badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
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
                                                    if (activity?.['trans_title'] === 'Delivery (sale)' || activity?.['trans_title'] === 'Delivery (lease)' || activity?.['trans_title'] === 'Delivery (service)') {
                                                        text_color = 'danger'
                                                    }
                                                    if (activity?.['trans_title'] === 'Goods issue') {
                                                        text_color = 'orange'
                                                    }
                                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                                        text_color = 'purple'
                                                    }
                                                    let trans_title_sub = {
                                                        'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                                        'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                                        'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                                        'Goods issue': trans_script.attr('data-trans-gis'),
                                                        'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                                    }
                                                    let ob_label = `<span class="text-${text_color}">${trans_title_sub?.[activity?.['trans_title']]}</span>`
                                                    items_detail_report_table_Ele.find('tbody').append(
                                                        `<tr class="detail-out">
                                                            <td class="first-col border-1"></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><span class="small">${moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm")}</span></td>
                                                            <td hidden></td>
                                                            <td hidden></td>
                                                            <td>${ob_label}</td>
                                                            <td><span class="badge badge-sm badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
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
                                                if (activity?.['trans_title'] === 'Balance init input') {
                                                    text_color = 'muted'
                                                }
                                                let trans_title_sub = {
                                                    'Goods receipt': trans_script.attr('data-trans-grc'),
                                                    'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                                    'Goods return': trans_script.attr('data-trans-grt'),
                                                    'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                                }
                                                let ob_label = `<span class="text-${text_color}">${trans_title_sub?.[activity?.['trans_title']]}</span>`
                                                items_detail_report_table_Ele.find('tbody').append(
                                                    `<tr class="detail-in">
                                                        <td class="first-col border-1"></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><span class="small">${moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm")}</span></td>
                                                        <td hidden></td>
                                                        <td hidden></td>
                                                        <td>${ob_label}</td>
                                                        <td><span class="badge badge-sm badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
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
                                                if (activity?.['trans_title'] === 'Delivery (sale)' || activity?.['trans_title'] === 'Delivery (lease)' || activity?.['trans_title'] === 'Delivery (service)') {
                                                    text_color = 'danger'
                                                }
                                                if (activity?.['trans_title'] === 'Goods issue') {
                                                    text_color = 'orange'
                                                }
                                                if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                                    text_color = 'purple'
                                                }
                                                let trans_title_sub = {
                                                    'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                                    'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                                    'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                                    'Goods issue': trans_script.attr('data-trans-gis'),
                                                    'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                                }
                                                let ob_label = `<span class="text-${text_color}">${trans_title_sub?.[activity?.['trans_title']]}</span>`
                                                items_detail_report_table_Ele.find('tbody').append(
                                                    `<tr class="detail-out">
                                                        <td class="first-col border-1"></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><span class="small">${moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm")}</span></td>
                                                        <td hidden></td>
                                                        <td hidden></td>
                                                        <td>${ob_label}</td>
                                                        <td><span class="badge badge-sm badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
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

    $(document).on("click", '#btn-filter', function () {
        LoadItemsSelectBox(items_select_Ele)
        LoadWarehouseSelectBox(warehouses_select_Ele)
    })
})