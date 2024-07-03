$(document).ready(function () {
    const table_inventory_report = $('#table-inventory-report')
    const table_inventory_report_detail = $('#table-inventory-report-detail')

    const current_period_Ele = $('#current_period')
    const items_select_Ele = $('#items_select')
    const warehouses_select_Ele = $('#warehouses_select')
    const periodEle = $('#period-select')
    const periodMonthEle = $('#period-month')
    const trans_script = $('#trans-script')
    const url_script = $('#url-script')
    let current_period = {}
    if (current_period_Ele.text() !== '') {
        current_period = JSON.parse(current_period_Ele.text())
        getMonthOrder(current_period['space_month'], current_period?.['fiscal_year'])
        periodMonthEle.val(new Date().getMonth() - current_period['space_month'] + 1).trigger('change');
    }
    const $definition_inventory_valuation = $('#definition_inventory_valuation').text()
    let PERIODIC_CLOSED = false

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

    periodMonthEle.on('change', function () {
        let selected_option = SelectDDControl.get_data_from_idx(periodEle, periodEle.val())
        if (selected_option) {
            $('#period-day-from').val(1);
            $('#period-day-to').val(
                get_final_date_of_current_month(
                    selected_option?.['fiscal_year'], parseInt(periodMonthEle.val()) + selected_option['space_month']
                )
            );
        }
    })

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

    function RenderTableWithParameter(table, data_list=[], data_wh=[]) {
        table.DataTable().clear().destroy()
        let sale_order_code_list = []
        table.DataTableDefault({
            dom: '',
            ordering: false,
            paging: false,
            reloadCurrency: true,
            data: data_list,
            columns: [
                {
                    className: '',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: '',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            if (row?.['warehouse_title']) {
                                return `<button type="button" data-bs-toggle="modal" data-bs-target="#view-prd-wh" data-wh-id="${row?.['warehouse_id']}" class="prd-wh-view btn btn-primary btn-rounded w-25">
                                            <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Click to see detail this warehouse">${row?.['warehouse_code']}</span>
                                        </button>&nbsp;
                                        <span class="text-primary ${row?.['type']}"><b>${row?.['warehouse_title']}</b></span>`
                            }
                            else {
                                return ``
                            }
                        }
                        else {
                            let sale_order_code = row?.['sale_order_code'] ? row?.['sale_order_code'] : ''
                            if (sale_order_code && !sale_order_code_list.includes(sale_order_code)) {
                                sale_order_code_list.push(sale_order_code)
                            }
                            let html = `
                                    <span class="badge badge-light badge-pill w-25 so-code-${row?.['sale_order_code'] ? row?.['sale_order_code'] : ''}">
                                        ${row?.['product_code']}
                                    </span>&nbsp;
                                    <span class="${row?.['type']}">${row?.['product_title']}</span>&nbsp;
                                    `
                            if (row?.['product_lot_number']) {
                                html += `<span class="text-blue small fw-bold"><i class="bi bi-bookmark-fill"></i>&nbsp;${row?.['product_lot_number']}</span>`
                            }
                            return html
                        }
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return ``
                        }
                        else {
                            return `<span class="badge badge-soft-blue badge-pill">${row?.['uom_title']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-opening-quantity-span wh-open-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill opening-quantity-span prd-open-quantity-${row?.['warehouse_id']}">${row?.['prd_open_quantity']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-opening-value-span mask-money wh-open-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill opening-value-span mask-money prd-open-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_open_value']}"></span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill text-primary wh-in-quantity-span wh-in-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill in-quantity-span prd-in-quantity-${row?.['warehouse_id']}">${row?.['prd_in_quantity']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-in-value-span mask-money wh-in-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill in-quantity-span mask-money prd-in-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_in_value']}"></span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-out-quantity-span wh-out-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill out-quantity-span prd-out-quantity-${row?.['warehouse_id']}">${row?.['prd_out_quantity']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-out-value-span mask-money wh-out-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill out-quantity-span mask-money prd-out-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_out_value']}"></span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-ending-quantity-span wh-end-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill ending-quantity-span prd-end-quantity-${row?.['warehouse_id']}">${row?.['prd_end_quantity']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-ending-value-span mask-money wh-end-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill ending-value-span mask-money prd-end-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_end_value']}"></span>`
                        }
                    }
                },
            ],
            initComplete: function(settings, json) {
                table.find('tbody tr').each(function () {
                    $(this).find('td:eq(0)').css({
                        'min-width': 'fit-content'
                    })
                    $(this).find('td:eq(1)').css({
                        'min-width': '400px'
                    })
                    $(this).find('td:eq(2)').css({
                        'min-width': '80px'
                    })
                    $(this).find('td:eq(3)').css({
                        'min-width': '50px'
                    })
                    $(this).find('td:eq(4)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(5)').css({
                        'min-width': '50px'
                    })
                    $(this).find('td:eq(6)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(7)').css({
                        'min-width': '50px'
                    })
                    $(this).find('td:eq(8)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(9)').css({
                        'min-width': '50px'
                    })
                    $(this).find('td:eq(10)').css({
                        'min-width': '200px'
                    })
                })

                let sum_wh_open_quantity = 0;
                let sum_wh_open_value = 0;
                let sum_wh_in_quantity = 0;
                let sum_wh_in_value = 0;
                let sum_wh_out_quantity = 0;
                let sum_wh_out_value = 0;
                let sum_wh_end_quantity = 0;
                let sum_wh_end_value = 0;

                for (const wh of data_wh) {
                    let wh_open_quantity = 0
                    table.find(`.prd-open-quantity-${wh}`).each(function () {
                        wh_open_quantity += parseFloat($(this).text())
                    })
                    table.find(`.wh-open-quantity-${wh}`).text(wh_open_quantity)

                    let wh_open_value = 0
                    table.find(`.prd-open-value-${wh}`).each(function () {
                        wh_open_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-open-value-${wh}`).attr('data-init-money', wh_open_value)

                    let wh_in_quantity = 0
                    table.find(`.prd-in-quantity-${wh}`).each(function () {
                        wh_in_quantity += parseFloat($(this).text())
                    })
                    table.find(`.wh-in-quantity-${wh}`).text(wh_in_quantity)

                    let wh_in_value = 0
                    table.find(`.prd-in-value-${wh}`).each(function () {
                        wh_in_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-in-value-${wh}`).attr('data-init-money', wh_in_value)

                    let wh_out_quantity = 0
                    table.find(`.prd-out-quantity-${wh}`).each(function () {
                        wh_out_quantity += parseFloat($(this).text())
                    })
                    table.find(`.wh-out-quantity-${wh}`).text(wh_out_quantity)

                    let wh_out_value = 0
                    table.find(`.prd-out-value-${wh}`).each(function () {
                        wh_out_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-out-value-${wh}`).attr('data-init-money', wh_out_value)

                    let wh_end_quantity = 0
                    table.find(`.prd-end-quantity-${wh}`).each(function () {
                        wh_end_quantity += parseFloat($(this).text())
                    })
                    table.find(`.wh-end-quantity-${wh}`).text(wh_end_quantity)

                    let wh_end_value = 0
                    table.find(`.prd-end-value-${wh}`).each(function () {
                        wh_end_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-end-value-${wh}`).attr('data-init-money', wh_end_value)

                    sum_wh_open_quantity += wh_open_quantity;
                    sum_wh_open_value += wh_open_value;
                    sum_wh_in_quantity += wh_in_quantity;
                    sum_wh_in_value += wh_in_value;
                    sum_wh_out_quantity += wh_out_quantity;
                    sum_wh_out_value += wh_out_value;
                    sum_wh_end_quantity += wh_end_quantity;
                    sum_wh_end_value += wh_end_value;
                }

                if (data_wh.length === 0) {
                    table.find('tbody tr').each(function () {
                        sum_wh_open_quantity += parseFloat($(this).find('td:eq(3) span').text())
                        sum_wh_open_value += parseFloat($(this).find('td:eq(4) span').attr('data-init-money'))
                        sum_wh_in_quantity += parseFloat($(this).find('td:eq(5) span').text())
                        sum_wh_in_value += parseFloat($(this).find('td:eq(6) span').attr('data-init-money'))
                        sum_wh_out_quantity += parseFloat($(this).find('td:eq(7) span').text())
                        sum_wh_out_value += parseFloat($(this).find('td:eq(8) span').attr('data-init-money'))
                        sum_wh_end_quantity += parseFloat($(this).find('td:eq(9) span').text())
                        sum_wh_end_value += parseFloat($(this).find('td:eq(10) span').attr('data-init-money'))
                    })
                }

                $('#table-inventory-report #opening-total-quantity').text(sum_wh_open_quantity)
                $('#table-inventory-report #opening-total-value').attr('data-init-money', sum_wh_open_value)
                $('#table-inventory-report #in-total-quantity').text(sum_wh_in_quantity)
                $('#table-inventory-report #in-total-value').attr('data-init-money', sum_wh_in_value)
                $('#table-inventory-report #out-total-quantity').text(sum_wh_out_quantity)
                $('#table-inventory-report #out-total-value').attr('data-init-money', sum_wh_out_value)
                $('#table-inventory-report #ending-total-quantity').text(sum_wh_end_quantity)
                $('#table-inventory-report #ending-total-value').attr('data-init-money', sum_wh_end_value)

                MatchTooltip()

                // group project
                if (sale_order_code_list.length === 0) {
                    table.find("tr th:eq(0)").prop('hidden', true)
                    table.find("tr td:eq(0)").prop('hidden', true)
                }
                for (const so_code of sale_order_code_list) {
                    let number_row = table.find(`tbody .so-code-${so_code}`).length + 1
                    table.find(`tbody .so-code-${so_code}:eq(0)`).closest('tr').before(`
                        <tr>
                            <td rowspan="${number_row}" class="text-center">
                                <span class="badge badge-pill badge-soft-red"><i class="bi bi-clipboard-check"></i>&nbsp;${so_code}</span>
                            </td>
                        </tr>
                    `)
                    table.find(`tbody .so-code-${so_code}`).each(function () {
                        $(this).closest('tr').find('td:eq(0)').remove()
                    })
                }
            },
        });
    }

    function RenderTableDetailWithParameter(table, data_list=[], data_wh=[]) {
        table.DataTable().clear().destroy()
        table.DataTableDefault({
            dom: '',
            ordering: false,
            paging: false,
            reloadCurrency: true,
            data: data_list,
            columns: [
                {
                    className: '',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<button type="button" data-bs-toggle="modal" data-bs-target="#view-prd-wh" data-wh-id="${row?.['warehouse_id']}" class="prd-wh-view btn btn-primary btn-rounded w-25">
                                        <span data-bs-toggle="tooltip" data-bs-placement="bottom" title="Click to see detail this warehouse">${row?.['warehouse_code']}</span>
                                    </button>&nbsp;
                                    <span class="text-primary ${row?.['type']}"><b>${row?.['warehouse_title']}</b></span>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return `<span class="badge badge-indicator inv-action ${row?.['bg_in']} ${row?.['bg_out']}"></span>`
                        }
                        else {
                            return `<span class="badge badge-light badge-pill w-25">
                                        ${row?.['product_code']}
                                    </span>&nbsp;
                                    <span class="${row?.['type']}" data-is-no-info="${row?.['is_no_info']}">${row?.['product_title']}</span>&nbsp;
                                    <span class="text-blue small fw-bold">${row?.['product_lot_number'] ? row?.['product_lot_number'] : ''}</span>`
                        }
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return ``
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return ``
                        }
                        else {
                            return `<span class="badge badge-soft-blue badge-pill">${row?.['uom_title']}</span>`
                        }
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'detail_row') {
                            return `<span>${row?.['date']}</span>`
                        }
                        return ''
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'detail_row') {
                            if (row?.['lot_number']) {
                                return `<span class="text-blue"><i class="bi bi-bookmark-fill"></i>&nbsp;${row?.['lot_number']}</span>`
                            }
                        }
                        return ''
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'detail_row') {
                            if (row?.['expired_date']) {
                                return `<span class="text-primary"><i class="bi bi-calendar2-x"></i>&nbsp;${row?.['expired_date']}</span>`
                            }
                        }
                        return ''
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-opening-quantity-span wh-open-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return ``
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill opening-quantity-span prd-open-quantity-${row?.['warehouse_id']}">${row?.['prd_open_quantity']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-opening-value-span mask-money wh-open-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return ``
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill opening-value-span mask-money prd-open-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_open_value']}"></span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill text-primary wh-in-quantity-span wh-in-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill">${row?.['in_quantity']}</span>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill in-quantity-span prd-in-quantity-${row?.['warehouse_id']}">${row?.['prd_in_quantity']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-in-value-span mask-money wh-in-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill mask-money" data-init-money="${row?.['in_value']}"></span>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill in-quantity-span mask-money prd-in-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_in_value']}"></span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-out-quantity-span wh-out-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill">${row?.['out_quantity']}</span>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill out-quantity-span prd-out-quantity-${row?.['warehouse_id']}">${row?.['prd_out_quantity']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-out-value-span mask-money wh-out-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill mask-money" data-init-money="${row?.['out_value']}"></span>`
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill out-quantity-span mask-money prd-out-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_out_value']}"></span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-ending-quantity-span wh-end-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return ``
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill ending-quantity-span prd-end-quantity-${row?.['warehouse_id']}">${row?.['prd_end_quantity']}</span>`
                        }
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-ending-value-span mask-money wh-end-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        else if (row?.['type'] === 'detail_row') {
                            return ``
                        }
                        else {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill ending-value-span mask-money prd-end-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_end_value']}"></span>`
                        }
                    }
                },
            ],
            initComplete: function(settings, json) {
                table.find('tbody tr').each(function () {
                    $(this).find('td:eq(0)').css({
                        'min-width': '400px'
                    })
                    $(this).find('td:eq(1)').css({
                        'min-width': '80px'
                    })
                    $(this).find('td:eq(2)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(3)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(4)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(5)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(6)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(7)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(8)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(9)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(10)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(11)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(12)').css({
                        'min-width': '200px'
                    })
                })

                let sum_wh_open_quantity = 0;
                let sum_wh_open_value = 0;
                let sum_wh_in_quantity = 0;
                let sum_wh_in_value = 0;
                let sum_wh_out_quantity = 0;
                let sum_wh_out_value = 0;
                let sum_wh_end_quantity = 0;
                let sum_wh_end_value = 0;

                for (const wh of data_wh) {
                    let wh_open_quantity = 0
                    table.find(`.prd-open-quantity-${wh}`).each(function () {
                        wh_open_quantity += parseFloat($(this).text())
                    })
                    table.find(`.wh-open-quantity-${wh}`).text(wh_open_quantity)

                    let wh_open_value = 0
                    table.find(`.prd-open-value-${wh}`).each(function () {
                        wh_open_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-open-value-${wh}`).attr('data-init-money', wh_open_value)

                    let wh_in_quantity = 0
                    table.find(`.prd-in-quantity-${wh}`).each(function () {
                        wh_in_quantity += parseFloat($(this).text())
                    })
                    table.find(`.wh-in-quantity-${wh}`).text(wh_in_quantity)

                    let wh_in_value = 0
                    table.find(`.prd-in-value-${wh}`).each(function () {
                        wh_in_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-in-value-${wh}`).attr('data-init-money', wh_in_value)

                    let wh_out_quantity = 0
                    table.find(`.prd-out-quantity-${wh}`).each(function () {
                        wh_out_quantity += parseFloat($(this).text())
                    })
                    table.find(`.wh-out-quantity-${wh}`).text(wh_out_quantity)

                    let wh_out_value = 0
                    table.find(`.prd-out-value-${wh}`).each(function () {
                        wh_out_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-out-value-${wh}`).attr('data-init-money', wh_out_value)

                    let wh_end_quantity = 0
                    table.find(`.prd-end-quantity-${wh}`).each(function () {
                        wh_end_quantity += parseFloat($(this).text())
                    })
                    table.find(`.wh-end-quantity-${wh}`).text(wh_end_quantity)

                    let wh_end_value = 0
                    table.find(`.prd-end-value-${wh}`).each(function () {
                        wh_end_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-end-value-${wh}`).attr('data-init-money', wh_end_value)

                    sum_wh_open_quantity += wh_open_quantity;
                    sum_wh_open_value += wh_open_value;
                    sum_wh_in_quantity += wh_in_quantity;
                    sum_wh_in_value += wh_in_value;
                    sum_wh_out_quantity += wh_out_quantity;
                    sum_wh_out_value += wh_out_value;
                    sum_wh_end_quantity += wh_end_quantity;
                    sum_wh_end_value += wh_end_value;
                }

                $('#table-inventory-report-detail #opening-total-quantity').text(sum_wh_open_quantity)
                $('#table-inventory-report-detail #opening-total-value').attr('data-init-money', sum_wh_open_value)
                $('#table-inventory-report-detail #in-total-quantity').text(sum_wh_in_quantity)
                $('#table-inventory-report-detail #in-total-value').attr('data-init-money', sum_wh_in_value)
                $('#table-inventory-report-detail #out-total-quantity').text(sum_wh_out_quantity)
                $('#table-inventory-report-detail #out-total-value').attr('data-init-money', sum_wh_out_value)
                $('#table-inventory-report-detail #ending-total-quantity').text(sum_wh_end_quantity)
                $('#table-inventory-report-detail #ending-total-value').attr('data-init-money', sum_wh_end_value)

                MatchTooltip()
            },
        });
    }

    function RenderTableViewProductWarehouse(table, data_list=[]) {
        table.DataTable().clear().destroy()
        table.DataTableDefault({
            reloadCurrency: true,
            data: data_list,
            paging: false,
            ordering: false,
            columns: [
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'main_row') {
                            return `<span class="${row?.['row_type']} badge badge-primary w-25">${row?.['product']?.['code']}</span>&nbsp;<span class="text-primary">${row?.['product']?.['title']}</span>`
                        }
                         return `<span hidden>${row?.['product']?.['code']}${row?.['product']?.['title']}</span>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'main_row') {
                            return `<span class="text-primary">${row?.['stock_amount']}</span> <span class="text-primary">${row?.['product']?.['uom']?.['title']}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'lot_row') {
                            let expire_date = row?.['expire_date'] ? `(${row?.['expire_date']})` : ''
                            return `<span class="text-blue fw-bold"><i class="bi bi-bookmark-fill"></i>&nbsp;${row?.['lot_number']}</span> (${row?.['quantity_import']}) ${expire_date}`
                        }
                        return `<span hidden>${JSON.stringify(row?.['lot_data'])}</span>`
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'sn_row') {
                            return `<span class="text-dark fw-bold"><i class="bi bi-upc"></i>&nbsp;${row?.['serial_number']}</span> (${row?.['vendor_serial_number']})`
                        }
                        return `<span hidden>${JSON.stringify(row?.['sn_data'])}</spanhidden>`
                    }
                },
            ],
            scrollCollapse: true,
            scrollY: '40vh',
            initComplete: function () {
                table.find('.main_row').each(function () {
                    $(this).closest('tr').css({
                        'background-color': 'rgb(235, 245, 245)'
                    })
                })
            }
        });
    }

    $('#btn-view').on('click', function () {
        $('table thead #thead-value').find('span').text('0')
        $('table thead #thead-value').find('span').attr('data-init-money', 0)
        $('table tbody').html('')
        table_inventory_report.closest('div').prop('hidden', false)
        table_inventory_report_detail.DataTable().clear().destroy()
        table_inventory_report_detail.closest('div').prop('hidden', true)
        if (periodMonthEle.val()) {
            WindowControl.showLoading();
            let dataParam = {}
            dataParam['sub_period_order'] = periodMonthEle.val() ? parseInt(periodMonthEle.val()) : null
            dataParam['period_mapped'] = periodEle.val() ? periodEle.val() : null
            dataParam['product_id_list'] = items_select_Ele.val().join(',')
            let inventory_detail_list_ajax = $.fn.callAjax2({
                url: url_script.attr('data-url-inventory-list') + `?date_range=${$('#period-day-from').val()}-${$('#period-day-to').val()}`,
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_list')) {
                        return data?.['report_inventory_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([inventory_detail_list_ajax]).then(
                (results) => {
                    console.log(results[0])
                    $('#btn-collapse').trigger('click')
                    table_inventory_report.find('tbody').html('')
                    let table_inventory_report_wh_row = []
                    let table_inventory_report_data = []
                    for (const warehouse_activities of results[0]) {
                        if (warehouses_select_Ele.val().length === 0) {
                            if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse_for_filter']?.['id']) && Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0) {
                                if (Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0) {
                                    table_inventory_report_wh_row.push(warehouse_activities?.['warehouse_for_filter']?.['id'])
                                }
                                table_inventory_report_data.push({
                                    'type': 'warehouse_row',
                                    'warehouse_id': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['id'] : ''}`,
                                    'warehouse_code': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['code'] : ''}`,
                                    'warehouse_title': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['title'] : ''}`,
                                })
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                    'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                    'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                    'product_code': `${warehouse_activities?.['product']?.['code']}`,
                                    'product_title': `${warehouse_activities?.['product']?.['title']}`,
                                    'product_lot_number': `${warehouse_activities?.['product']?.['lot_number']}`,
                                    'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                    'uom_title': `${warehouse_activities?.['product']?.['uom']?.['title']}`,
                                    'prd_open_quantity': `${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}`,
                                    'prd_open_value': `${warehouse_activities?.['stock_activities']?.['opening_balance_value']}`,
                                    'prd_in_quantity': `${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}`,
                                    'prd_in_value': `${warehouse_activities?.['stock_activities']?.['sum_in_value']}`,
                                    'prd_out_quantity': `${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}`,
                                    'prd_out_value': `${warehouse_activities?.['stock_activities']?.['sum_out_value']}`,
                                    'prd_end_quantity': `${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}`,
                                    'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`
                                })
                            }
                            else {
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                    'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                    'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                    'product_code': `${warehouse_activities?.['product']?.['code']}`,
                                    'product_title': `${warehouse_activities?.['product']?.['title']}`,
                                    'product_lot_number': `${warehouse_activities?.['product']?.['lot_number']}`,
                                    'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                    'uom_title': `${warehouse_activities?.['product']?.['uom']?.['title']}`,
                                    'prd_open_quantity': `${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}`,
                                    'prd_open_value': `${warehouse_activities?.['stock_activities']?.['opening_balance_value']}`,
                                    'prd_in_quantity': `${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}`,
                                    'prd_in_value': `${warehouse_activities?.['stock_activities']?.['sum_in_value']}`,
                                    'prd_out_quantity': `${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}`,
                                    'prd_out_value': `${warehouse_activities?.['stock_activities']?.['sum_out_value']}`,
                                    'prd_end_quantity': `${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}`,
                                    'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`
                                })
                            }
                        }
                        else {
                            if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse_for_filter']?.['id'])) {
                                if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse_for_filter']?.['id']) && Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0) {
                                    if (Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0) {
                                        table_inventory_report_wh_row.push(warehouse_activities?.['warehouse_for_filter']?.['id'])
                                    }
                                    table_inventory_report_data.push({
                                        'type': 'warehouse_row',
                                        'warehouse_id': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['id'] : ''}`,
                                        'warehouse_code': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['code'] : ''}`,
                                        'warehouse_title': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['title'] : ''}`,
                                    })
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                        'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                        'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                        'product_code': `${warehouse_activities?.['product']?.['code']}`,
                                        'product_title': `${warehouse_activities?.['product']?.['title']}`,
                                        'product_lot_number': `${warehouse_activities?.['product']?.['lot_number']}`,
                                        'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                        'uom_title': `${warehouse_activities?.['product']?.['uom']?.['title']}`,
                                        'prd_open_quantity': `${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}`,
                                        'prd_open_value': `${warehouse_activities?.['stock_activities']?.['opening_balance_value']}`,
                                        'prd_in_quantity': `${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}`,
                                        'prd_in_value': `${warehouse_activities?.['stock_activities']?.['sum_in_value']}`,
                                        'prd_out_quantity': `${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}`,
                                        'prd_out_value': `${warehouse_activities?.['stock_activities']?.['sum_out_value']}`,
                                        'prd_end_quantity': `${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}`,
                                        'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`
                                    })
                                } else {
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                        'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                        'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                        'product_code': `${warehouse_activities?.['product']?.['code']}`,
                                        'product_title': `${warehouse_activities?.['product']?.['title']}`,
                                        'product_lot_number': `${warehouse_activities?.['product']?.['lot_number']}`,
                                        'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                        'uom_title': `${warehouse_activities?.['product']?.['uom']?.['title']}`,
                                        'prd_open_quantity': `${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}`,
                                        'prd_open_value': `${warehouse_activities?.['stock_activities']?.['opening_balance_value']}`,
                                        'prd_in_quantity': `${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}`,
                                        'prd_in_value': `${warehouse_activities?.['stock_activities']?.['sum_in_value']}`,
                                        'prd_out_quantity': `${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}`,
                                        'prd_out_value': `${warehouse_activities?.['stock_activities']?.['sum_out_value']}`,
                                        'prd_end_quantity': `${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}`,
                                        'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`
                                    })
                                }
                            }
                        }
                    }
                    RenderTableWithParameter(table_inventory_report, table_inventory_report_data, table_inventory_report_wh_row)
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                            if ($definition_inventory_valuation === '1') {
                                let condition1 = $definition_inventory_valuation === '1' && PERIODIC_CLOSED === false
                                let condition2 = $definition_inventory_valuation === '1'
                                let condition3 = PERIODIC_CLOSED === false

                                table_inventory_report.find('#out-total-value').prop('hidden', condition1)
                                table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition1)
                                table_inventory_report.find('tbody .out-value-span').prop('hidden', condition1)
                                table_inventory_report.find('#ending-total-value').prop('hidden', condition1)
                                table_inventory_report.find('tbody .wh-ending-value-span').prop('hidden', condition1)
                                table_inventory_report.find('tbody .ending-value-span').prop('hidden', condition1)

                                table_inventory_report.find('tbody .out-value-span-detail').prop('hidden', condition2)

                                table_inventory_report.find('tbody .out-value-span').prop('hidden', condition3)
                                table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition3)
                            }
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

    $('#btn-view-detail').on('click', function () {
        $('table thead #thead-value').find('span').text('0')
        $('table thead #thead-value').find('span').attr('data-init-money', 0)
        $('table tbody').html('')
        table_inventory_report_detail.closest('div').prop('hidden', false)
        table_inventory_report.DataTable().clear().destroy()
        table_inventory_report.closest('div').prop('hidden', true)
        if (periodMonthEle.val()) {
            WindowControl.showLoading();
            let dataParam = {}
            dataParam['sub_period_order'] = periodMonthEle.val() ? parseInt(periodMonthEle.val()) : null
            dataParam['period_mapped'] = periodEle.val() ? periodEle.val() : null
            dataParam['product_id_list'] = items_select_Ele.val().join(',')
            let inventory_detail_list_ajax = $.fn.callAjax2({
                url: url_script.attr('data-url-inventory-list') + `?date_range=${$('#period-day-from').val()}-${$('#period-day-to').val()}`,
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_list')) {
                        return data?.['report_inventory_list'];
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
                    $('#btn-collapse').trigger('click')
                    table_inventory_report_detail.find('tbody').html('')
                    let table_inventory_report_wh_row = []
                    let table_inventory_report_data = []
                    for (const warehouse_activities of results[0]) {
                        if (warehouses_select_Ele.val().length === 0) {
                            if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse_for_filter']?.['id']) && Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0) {
                                if (Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0) {
                                    table_inventory_report_wh_row.push(warehouse_activities?.['warehouse_for_filter']?.['id'])
                                }
                                table_inventory_report_data.push({
                                    'type': 'warehouse_row',
                                    'warehouse_id': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['id'] : ''}`,
                                    'warehouse_code': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['code'] : ''}`,
                                    'warehouse_title': `${Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0 ? warehouse_activities?.['warehouse_for_filter']?.['title'] : ''}`,
                                })
                                
                                let in_quantity_enough = 0
                                let detail_data = []
                                for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                    in_quantity_enough += activity?.['in_quantity'] ? parseFloat(activity?.['in_quantity']) : 0
                                    let bg_in = ''
                                    let bg_out = ''
                                    if (activity?.['trans_title'] === 'Goods receipt') {
                                        bg_in = 'badge-soft-primary'
                                    }
                                    if (activity?.['trans_title'] === 'Goods return') {
                                        bg_in = 'badge-soft-blue'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery') {
                                        bg_out = 'badge-soft-danger'
                                    }
                                    if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                        bg_in = 'badge-soft-green'
                                    }
                                    if (activity?.['trans_title'] === 'Goods issue') {
                                        bg_out = 'badge-soft-orange'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                        bg_in = 'badge-soft-purple small gtf-in'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                        bg_out = 'badge-soft-purple small gtf-out'
                                    }
                                    detail_data.push({
                                        'type': 'detail_row',
                                        'date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                        'lot_number': activity?.['lot_number'],
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'],
                                        'in_value': activity?.['in_value'],
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'],
                                        'out_value': activity?.['out_value']
                                    })
                                }

                                let no_info = in_quantity_enough < parseFloat(warehouse_activities?.['stock_activities']?.['sum_in_quantity']) ? 'no-info' : ''
                                
                                table_inventory_report_data.push({
                                    'is_no_info': no_info,
                                    'type': 'product_row',
                                    'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                    'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                    'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                    'product_code': `${warehouse_activities?.['product']?.['code']}`,
                                    'product_title': `${warehouse_activities?.['product']?.['title']}`,
                                    'product_lot_number': `${warehouse_activities?.['product']?.['lot_number']}`,
                                    'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                    'uom_title': `${warehouse_activities?.['product']?.['uom']?.['title']}`,
                                    'prd_open_quantity': `${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}`,
                                    'prd_open_value': `${warehouse_activities?.['stock_activities']?.['opening_balance_value']}`,
                                    'prd_in_quantity': `${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}`,
                                    'prd_in_value': `${warehouse_activities?.['stock_activities']?.['sum_in_value']}`,
                                    'prd_out_quantity': `${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}`,
                                    'prd_out_value': `${warehouse_activities?.['stock_activities']?.['sum_out_value']}`,
                                    'prd_end_quantity': `${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}`,
                                    'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`
                                })
                                table_inventory_report_data = table_inventory_report_data.concat(detail_data)
                            }
                            else {
                                let in_quantity_enough = 0
                                let detail_data = []
                                for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                    in_quantity_enough += activity?.['in_quantity'] ? parseFloat(activity?.['in_quantity']) : 0
                                    let bg_in = ''
                                    let bg_out = ''
                                    if (activity?.['trans_title'] === 'Goods receipt') {
                                        bg_in = 'badge-soft-primary'
                                    }
                                    if (activity?.['trans_title'] === 'Goods return') {
                                        bg_in = 'badge-soft-blue'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery') {
                                        bg_out = 'badge-soft-danger'
                                    }
                                    if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                        bg_in = 'badge-soft-green'
                                    }
                                    if (activity?.['trans_title'] === 'Goods issue') {
                                        bg_out = 'badge-soft-orange'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                        bg_in = 'badge-soft-purple small gtf-in'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                        bg_out = 'badge-soft-purple small gtf-out'
                                    }
                                    detail_data.push({
                                        'type': 'detail_row',
                                        'date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                        'lot_number': activity?.['lot_number'],
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'],
                                        'in_value': activity?.['in_value'],
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'],
                                        'out_value': activity?.['out_value']
                                    })
                                }

                                let no_info = in_quantity_enough < parseFloat(warehouse_activities?.['stock_activities']?.['sum_in_quantity']) ? 'no-info' : ''

                                table_inventory_report_data.push({
                                    'is_no_info': no_info,
                                    'type': 'product_row',
                                    'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                    'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                    'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                    'product_code': `${warehouse_activities?.['product']?.['code']}`,
                                    'product_title': `${warehouse_activities?.['product']?.['title']}`,
                                    'product_lot_number': `${warehouse_activities?.['product']?.['lot_number']}`,
                                    'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                    'uom_title': `${warehouse_activities?.['product']?.['uom']?.['title']}`,
                                    'prd_open_quantity': `${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}`,
                                    'prd_open_value': `${warehouse_activities?.['stock_activities']?.['opening_balance_value']}`,
                                    'prd_in_quantity': `${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}`,
                                    'prd_in_value': `${warehouse_activities?.['stock_activities']?.['sum_in_value']}`,
                                    'prd_out_quantity': `${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}`,
                                    'prd_out_value': `${warehouse_activities?.['stock_activities']?.['sum_out_value']}`,
                                    'prd_end_quantity': `${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}`,
                                    'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`
                                })
                                table_inventory_report_data = table_inventory_report_data.concat(detail_data)
                            }
                        }
                        else {
                            if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse_for_filter']?.['id'])) {
                                if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse_for_filter']?.['id']) && Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0) {
                                    if (Object.keys(warehouse_activities?.['warehouse_for_filter']).length !== 0) {
                                        table_inventory_report_wh_row.push(warehouse_activities?.['warehouse_for_filter']?.['id'])
                                    }
                                    table_inventory_report_data.push({
                                            'type': 'warehouse_row',
                                            'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                            'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                            'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                        })

                                    let in_quantity_enough = 0
                                    let detail_data = []
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                        in_quantity_enough += activity?.['in_quantity'] ? parseFloat(activity?.['in_quantity']) : 0
                                        let bg_in = ''
                                        let bg_out = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            bg_in = 'badge-soft-primary'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            bg_in = 'badge-soft-blue'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery') {
                                            bg_out = 'badge-soft-danger'
                                        }
                                        if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                            bg_in = 'badge-soft-green'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            bg_out = 'badge-soft-orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                            bg_in = 'badge-soft-purple small gtf-in'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            bg_out = 'badge-soft-purple small gtf-out'
                                        }
                                        detail_data.push({
                                            'type': 'detail_row',
                                            'date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                            'lot_number': activity?.['lot_number'],
                                            'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                            'bg_in': bg_in,
                                            'in_quantity': activity?.['in_quantity'],
                                            'in_value': activity?.['in_value'],
                                            'bg_out': bg_out,
                                            'out_quantity': activity?.['out_quantity'],
                                            'out_value': activity?.['out_value']
                                        })
                                    }

                                    let no_info = in_quantity_enough < parseFloat(warehouse_activities?.['stock_activities']?.['sum_in_quantity']) ? 'no-info' : ''

                                    table_inventory_report_data.push({
                                        'is_no_info': no_info,
                                        'type': 'product_row',
                                        'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                        'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                        'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                        'product_code': `${warehouse_activities?.['product']?.['code']}`,
                                        'product_title': `${warehouse_activities?.['product']?.['title']}`,
                                        'product_lot_number': `${warehouse_activities?.['product']?.['lot_number']}`,
                                        'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                        'uom_title': `${warehouse_activities?.['product']?.['uom']?.['title']}`,
                                        'prd_open_quantity': `${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}`,
                                        'prd_open_value': `${warehouse_activities?.['stock_activities']?.['opening_balance_value']}`,
                                        'prd_in_quantity': `${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}`,
                                        'prd_in_value': `${warehouse_activities?.['stock_activities']?.['sum_in_value']}`,
                                        'prd_out_quantity': `${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}`,
                                        'prd_out_value': `${warehouse_activities?.['stock_activities']?.['sum_out_value']}`,
                                        'prd_end_quantity': `${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}`,
                                        'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`
                                    })
                                    table_inventory_report_data = table_inventory_report_data.concat(detail_data)
                                }
                                else {
                                    let in_quantity_enough = 0
                                    let detail_data = []
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                        in_quantity_enough += activity?.['in_quantity'] ? parseFloat(activity?.['in_quantity']) : 0
                                        let bg_in = ''
                                        let bg_out = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            bg_in = 'badge-soft-primary'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            bg_in = 'badge-soft-blue'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery') {
                                            bg_out = 'badge-soft-danger'
                                        }
                                        if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                            bg_in = 'badge-soft-green'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            bg_out = 'badge-soft-orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                            bg_in = 'badge-soft-purple small gtf-in'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            bg_out = 'badge-soft-purple small gtf-out'
                                        }
                                        detail_data.push({
                                            'type': 'detail_row',
                                            'date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                            'lot_number': activity?.['lot_number'],
                                            'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                            'bg_in': bg_in,
                                            'in_quantity': activity?.['in_quantity'],
                                            'in_value': activity?.['in_value'],
                                            'bg_out': bg_out,
                                            'out_quantity': activity?.['out_quantity'],
                                            'out_value': activity?.['out_value']
                                        })
                                    }

                                    let no_info = in_quantity_enough < parseFloat(warehouse_activities?.['stock_activities']?.['sum_in_quantity']) ? 'no-info' : ''

                                    table_inventory_report_data.push({
                                        'is_no_info': no_info,
                                        'type': 'product_row',
                                        'warehouse_id': `${warehouse_activities?.['warehouse_for_filter']?.['id']}`,
                                        'warehouse_code': `${warehouse_activities?.['warehouse_for_filter']?.['code']}`,
                                        'warehouse_title': `${warehouse_activities?.['warehouse_for_filter']?.['title']}`,
                                        'product_code': `${warehouse_activities?.['product']?.['code']}`,
                                        'product_title': `${warehouse_activities?.['product']?.['title']}`,
                                        'product_lot_number': `${warehouse_activities?.['product']?.['lot_number']}`,
                                        'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                        'uom_title': `${warehouse_activities?.['product']?.['uom']?.['title']}`,
                                        'prd_open_quantity': `${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}`,
                                        'prd_open_value': `${warehouse_activities?.['stock_activities']?.['opening_balance_value']}`,
                                        'prd_in_quantity': `${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}`,
                                        'prd_in_value': `${warehouse_activities?.['stock_activities']?.['sum_in_value']}`,
                                        'prd_out_quantity': `${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}`,
                                        'prd_out_value': `${warehouse_activities?.['stock_activities']?.['sum_out_value']}`,
                                        'prd_end_quantity': `${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}`,
                                        'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`
                                    })
                                    table_inventory_report_data = table_inventory_report_data.concat(detail_data)
                                }
                            }
                        }
                    }
                    RenderTableDetailWithParameter(table_inventory_report_detail, table_inventory_report_data, table_inventory_report_wh_row)
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                            if ($definition_inventory_valuation === '1') {
                                let condition1 = $definition_inventory_valuation === '1' && PERIODIC_CLOSED === false
                                let condition2 = $definition_inventory_valuation === '1'
                                let condition3 = PERIODIC_CLOSED === false

                                table_inventory_report.find('#out-total-value').prop('hidden', condition1)
                                table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition1)
                                table_inventory_report.find('tbody .out-value-span').prop('hidden', condition1)
                                table_inventory_report.find('#ending-total-value').prop('hidden', condition1)
                                table_inventory_report.find('tbody .wh-ending-value-span').prop('hidden', condition1)
                                table_inventory_report.find('tbody .ending-value-span').prop('hidden', condition1)

                                table_inventory_report.find('tbody .out-value-span-detail').prop('hidden', condition2)

                                table_inventory_report.find('tbody .out-value-span').prop('hidden', condition3)
                                table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition3)
                            }
                        },
                        500
                    )
                })
        }
        else {
            $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
        }
    })

    function MatchTooltip() {
        table_inventory_report_detail.find('.inv-action').each(function () {
            if ($(this).attr('class').includes('badge-soft-primary')) {
                $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
                $(this).closest('tr').attr('data-bs-placement', 'top')
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-grc'))
            }
            if ($(this).attr('class').includes('badge-soft-blue')) {
                $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
                $(this).closest('tr').attr('data-bs-placement', 'top')
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-grt'))
            }
            if ($(this).attr('class').includes('badge-soft-danger')) {
                $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
                $(this).closest('tr').attr('data-bs-placement', 'top')
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-dlvr'))
            }
            if ($(this).attr('class').includes('badge-soft-green')) {
                $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
                $(this).closest('tr').attr('data-bs-placement', 'top')
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-grc')} (IA)`)
            }
            if ($(this).attr('class').includes('badge-soft-orange')) {
                $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
                $(this).closest('tr').attr('data-bs-placement', 'top')
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-gis'))
            }
            if ($(this).attr('class').includes('badge-soft-purple small gtf-in')) {
                $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
                $(this).closest('tr').attr('data-bs-placement', 'top')
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-gtf')} (IN)`)
            }
            if ($(this).attr('class').includes('badge-soft-purple small gtf-out')) {
                $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
                $(this).closest('tr').attr('data-bs-placement', 'top')
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-gtf')} (OUT)`)
            }
        })
        table_inventory_report_detail.find('.no-info').each(function () {
            $(this).find('.in-quantity-span').addClass('required')
            $(this).find('.in-quantity-span').attr('data-bs-toggle', 'tooltip').attr('data-bs-placement', 'top').attr('title', trans_script.attr('data-trans-no-info'))
        })
    }

    $(document).on('click', '.prd-wh-view', function () {
        $('#view-prd-wh-title').text($(this).closest('td').find('.warehouse_row').text())
        let dataParam = {}
        dataParam['warehouse_id'] = $(this).attr('data-wh-id')
        let warehouse_view_list_ajax = $.fn.callAjax2({
            url: url_script.attr('data-url-inventory-list-view'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_prd_wh_list')) {
                    return data?.['report_inventory_prd_wh_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([warehouse_view_list_ajax]).then(
            (results) => {
                let data_view_list = []
                for (const data of results[0]) {
                    for (const lot of data?.['detail']?.['lot_data']) {
                        lot.expire_date = lot?.['expire_date'] ? moment(lot?.['expire_date'].split('T')[0]).format('DD/MM/YYYY') : ''
                    }

                    data_view_list.push({
                        'row_type': 'main_row',
                        'id': data?.['id'],
                        'product': data?.['product'],
                        'stock_amount': data?.['stock_amount'],
                        'lot_data': data?.['detail']?.['lot_data'],
                        'sn_data': data?.['detail']?.['sn_data']
                    })
                    for (const lot of data?.['detail']?.['lot_data']) {
                        data_view_list.push({
                            'product': data?.['product'],
                            'row_type': 'lot_row',
                            'id': lot?.['id'],
                            'lot_number': lot?.['lot_number'],
                            'expire_date': lot?.['expire_date'],
                            'quantity_import': lot?.['quantity_import']
                        })
                    }
                    for (const sn of data?.['detail']?.['sn_data']) {
                        data_view_list.push({
                            'product': data?.['product'],
                            'row_type': 'sn_row',
                            'id': sn?.['id'],
                            'vendor_serial_number': sn?.['vendor_serial_number'],
                            'serial_number': sn?.['serial_number']
                        })
                    }
                }

                RenderTableViewProductWarehouse($('#view-prd-wh-table'), data_view_list)
            })
    })
})