$(document).ready(function () {
    const table_inventory_report = $('#table-inventory-report')

    const current_period_Ele = $('#current_period')
    const items_select_Ele = $('#items_select')
    const warehouses_select_Ele = $('#warehouses_select')
    const project_select_Ele = $('#project-select')
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

    function LoadProjectSelectBox(ele, data) {
        ele.initSelect2({
            allowClear: true,
            ajax: {
                url: ele.attr('data-url') + `?has_regis=1`,
                method: 'GET',
            },
            templateResult: function(data) {
                let ele = $('<div class="row"></div>');
                ele.append(`<div class="col-6"><span class="badge badge-soft-primary">${data.data?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['title']}</div>
                            <div class="col-6 fst-italic"><span class="badge badge-soft-blue badge-sm">${data.data?.['opportunity']?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['opportunity']?.['title']}</div>`);
                return ele;
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }
    LoadProjectSelectBox(project_select_Ele)

    function RenderTableWithParameter(table, data_list=[], data_wh=[], table_detail=false) {
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
                        if (row?.['sale_order_code']) {
                            if (!sale_order_code_list.includes(`${row?.['warehouse_code']}-so-code-${row?.['sale_order_code']}`)) {
                                sale_order_code_list.push(`${row?.['warehouse_code']}-so-code-${row?.['sale_order_code']}`)
                            }
                            return `<span class="${row?.['warehouse_code']}-so-code-${row?.['sale_order_code']}">${row?.['sale_order_code']}</span>`
                        }
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
                        }
                        if (row?.['type'] === 'product_row') {
                            let html = `
                                    <span class="badge badge-light badge-pill w-25">
                                        ${row?.['product_code']}
                                    </span>&nbsp;
                                    <span class="${row?.['type']}">${row?.['product_title']}</span>&nbsp;
                                    `
                            if (row?.['product_lot_number']) {
                                html += `<span class="text-blue small fw-bold"><i class="bi bi-bookmark-fill"></i>&nbsp;${row?.['product_lot_number']}</span>`
                            }
                            return html
                        }
                        if (row?.['type'] === 'detail_row') {
                            return `<span class="detail_row ${row?.['bg_in']} ${row?.['bg_out']}"></span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'product_row') {
                            return `<span class="text-secondary">${row?.['uom_title']}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'detail_row') {
                            return `<span>${row?.['date']}</span>`
                        }
                        return ``
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
                        return ``
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'detail_row') {
                            if (row?.['expired_date']) {
                                return `<span class="text-orange"><i class="bi bi-calendar2-x"></i>&nbsp;${row?.['expired_date']}</span>`
                            }
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-opening-quantity-span wh-open-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill opening-quantity-span prd-open-quantity-${row?.['warehouse_id']}">${row?.['prd_open_quantity']}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-opening-value-span mask-money wh-open-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill opening-value-span mask-money prd-open-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_open_value']}"></span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill text-primary wh-in-quantity-span wh-in-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill in-quantity-span prd-in-quantity-${row?.['warehouse_id']}">${row?.['prd_in_quantity']}</span>`
                        }
                        return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill in-quantity-span prd-in-quantity-${row?.['warehouse_id']}">${row?.['in_quantity']}</span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-in-value-span mask-money wh-in-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill in-quantity-span mask-money prd-in-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_in_value']}"></span>`
                        }
                        return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill in-quantity-span mask-money prd-in-value-${row?.['warehouse_id']}" data-init-money="${row?.['in_value']}"></span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-out-quantity-span wh-out-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill out-quantity-span prd-out-quantity-${row?.['warehouse_id']}">${row?.['prd_out_quantity']}</span>`
                        }
                        return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill out-quantity-span prd-out-quantity-${row?.['warehouse_id']}">${row?.['out_quantity']}</span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-out-value-span mask-money wh-out-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill out-quantity-span mask-money prd-out-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_out_value']}"></span>`
                        }
                        return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill out-quantity-span mask-money prd-out-value-${row?.['warehouse_id']}" data-init-money="${row?.['out_value']}"></span>`
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-ending-quantity-span wh-end-quantity-${row?.['warehouse_id']}">0</span></b>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill ending-quantity-span prd-end-quantity-${row?.['warehouse_id']}">${row?.['prd_end_quantity']}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<b><span style="font-size: medium" class="badge badge-soft-primary badge-outline badge-pill wh-ending-value-span mask-money wh-end-value-${row?.['warehouse_id']}" data-init-money="0"></span></b>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<span style="font-size: medium; border: none" class="badge badge-secondary badge-outline badge-pill ending-value-span mask-money prd-end-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_end_value']}"></span>`
                        }
                        return ``
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
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(4)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(5)').css({
                        'min-width': '100px'
                    })
                    $(this).find('td:eq(6)').css({
                        'min-width': '50px'
                    })
                    $(this).find('td:eq(7)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(8)').css({
                        'min-width': '50px'
                    })
                    $(this).find('td:eq(9)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(10)').css({
                        'min-width': '50px'
                    })
                    $(this).find('td:eq(11)').css({
                        'min-width': '200px'
                    })
                    $(this).find('td:eq(12)').css({
                        'min-width': '50px'
                    })
                    $(this).find('td:eq(13)').css({
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
                        sum_wh_open_quantity += parseFloat($(this).find('td:eq(6) span').text())
                        sum_wh_open_value += parseFloat($(this).find('td:eq(7) span').attr('data-init-money'))
                        sum_wh_in_quantity += parseFloat($(this).find('td:eq(8) span').text())
                        sum_wh_in_value += parseFloat($(this).find('td:eq(9) span').attr('data-init-money'))
                        sum_wh_out_quantity += parseFloat($(this).find('td:eq(10) span').text())
                        sum_wh_out_value += parseFloat($(this).find('td:eq(11) span').attr('data-init-money'))
                        sum_wh_end_quantity += parseFloat($(this).find('td:eq(12) span').text())
                        sum_wh_end_value += parseFloat($(this).find('td:eq(13) span').attr('data-init-money'))
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

                // group project
                table.find("tr th:eq(0)").prop('hidden', sale_order_code_list.length === 0)
                table.find("tr").each(function () {
                    $(this).find('td:eq(0)').prop('hidden', sale_order_code_list.length === 0)
                })

                table.find("tr th:eq(3)").prop('hidden', !table_detail)
                table.find("tr th:eq(4)").prop('hidden', !table_detail)
                table.find("tr th:eq(5)").prop('hidden', !table_detail)
                table.find("tr").each(function () {
                    $(this).find('td:eq(3)').prop('hidden', !table_detail)
                    $(this).find('td:eq(4)').prop('hidden', !table_detail)
                    $(this).find('td:eq(5)').prop('hidden', !table_detail)
                })

                if (!table_detail) {
                    $('.detail_row').each(function () {
                        $(this).closest('tr').remove()
                    })
                }
                for (const so_code_class of sale_order_code_list) {
                    let number_row = table.find(`.${so_code_class}`).length + 1
                    table.find(`.${so_code_class}:eq(0)`).closest('tr').before(`
                        <tr>
                            <td rowspan="${number_row}" class="text-center">
                                <span class="text-danger fw-bold"><i class="bi bi-clipboard-check"></i>&nbsp;${so_code_class.split('-')[3]}</span>
                            </td>
                        </tr>
                    `)
                    table.find(`.${so_code_class}`).each(function () {
                        $(this).closest('tr').find('td:eq(0)').remove()
                    })
                }
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
                         return ``
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
                            return `<a href="#"><span class="text-blue fw-bold qr-code-lot-info"
                                          data-product-id="${row?.['product']?.['id']}"
                                          data-product-code="${row?.['product']?.['code']}"
                                          data-product-title="${row?.['product']?.['title']}"
                                          data-product-description="${row?.['product']?.['description']}"
                                          data-lot-number="${row?.['lot_number']}"
                                          data-goods-receipt-date="${row?.['goods_receipt_date']}"
                                    >
                                        <i class="bi bi-bookmark-fill"></i>&nbsp;${row?.['lot_number']}
                                    </span> (${row?.['quantity_import']}) ${expire_date}</a>`
                        }
                        return ``
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'sn_row') {
                            return `<a href="#"><span class="text-dark fw-bold qr-code-sn-info"
                                          data-product-id="${row?.['product']?.['id']}"
                                          data-product-code="${row?.['product']?.['code']}"
                                          data-product-title="${row?.['product']?.['title']}"
                                          data-product-description="${row?.['product']?.['description']}"
                                          data-serial-number="${row?.['serial_number']}"
                                          data-vendor-serial-number="${row?.['vendor_serial_number']}"
                                          data-goods-receipt-date="${row?.['goods_receipt_date']}"
                                    >
                                        <i class="bi bi-upc"></i>&nbsp;${row?.['serial_number']}
                                    </span> (${row?.['vendor_serial_number']})</a>`
                        }
                        return ``
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
        if (periodMonthEle.val()) {
            WindowControl.showLoading();
            let dataParam = {}
            dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
            dataParam['period_mapped'] = periodEle.val()
            if (project_select_Ele.val()) {
                dataParam['sale_order'] = project_select_Ele.val()
            }
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
                    let results_data = []
                    for (const item of results[0]) {
                        if (Object.keys(item?.['warehouse']).length > 0) {
                            results_data.push(item)
                        }
                        else {
                            for (let i = 0; i < item?.['warehouse_sub_list'].length; i++) {
                                results_data.push({
                                    "id": item?.['id'],
                                    "product": item?.['product'],
                                    "warehouse": item?.['warehouse_sub_list'][i],
                                    "period_mapped": item?.['period_mapped'],
                                    "sub_period_order": item?.['sub_period_order'],
                                    "stock_activities": item?.['stock_activities'][i],
                                    "for_balance": item?.['for_balance']
                                })
                            }
                        }
                    }
                    results_data.sort((a, b) => (a.warehouse.code > b.warehouse.code) ? 1 : -1)
                    $('#btn-collapse').trigger('click')
                    table_inventory_report.find('tbody').html('')
                    let table_inventory_report_wh_row = []
                    let table_inventory_report_data = []
                    for (const warehouse_activities of results_data) {
                        if (warehouses_select_Ele.val().length === 0) {
                            if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                }
                                table_inventory_report_data.push({
                                    'type': 'warehouse_row',
                                    'warehouse_id': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['id'] : ''}`,
                                    'warehouse_code': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['code'] : ''}`,
                                    'warehouse_title': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['title'] : ''}`,
                                })
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': `${warehouse_activities?.['warehouse']?.['id']}`,
                                    'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                    'warehouse_title': `${warehouse_activities?.['warehouse']?.['title']}`,
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
                                    'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`,
                                })
                            }
                            else {
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': `${warehouse_activities?.['warehouse']?.['id']}`,
                                    'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                    'warehouse_title': `${warehouse_activities?.['warehouse']?.['title']}`,
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
                                    'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`,
                                })
                            }
                        }
                        else {
                            if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                        table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                    }
                                    table_inventory_report_data.push({
                                        'type': 'warehouse_row',
                                        'warehouse_id': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['id'] : ''}`,
                                        'warehouse_code': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['code'] : ''}`,
                                        'warehouse_title': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['title'] : ''}`,
                                    })
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': `${warehouse_activities?.['warehouse']?.['id']}`,
                                        'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                        'warehouse_title': `${warehouse_activities?.['warehouse']?.['title']}`,
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
                                        'warehouse_id': `${warehouse_activities?.['warehouse']?.['id']}`,
                                        'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                        'warehouse_title': `${warehouse_activities?.['warehouse']?.['title']}`,
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
        table_inventory_report.closest('div').prop('hidden', false)
        if (periodMonthEle.val()) {
            WindowControl.showLoading();
            let dataParam = {}
            dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
            dataParam['period_mapped'] = periodEle.val()
            if (project_select_Ele.val()) {
                dataParam['sale_order'] = project_select_Ele.val()
            }
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
                    let results_data = []
                    for (const item of results[0]) {
                        if (Object.keys(item?.['warehouse']).length > 0) {
                            results_data.push(item)
                        }
                        else {
                            for (let i = 0; i < item?.['warehouse_sub_list'].length; i++) {
                                results_data.push({
                                    "id": item?.['id'],
                                    "product": item?.['product'],
                                    "warehouse": item?.['warehouse_sub_list'][i],
                                    "period_mapped": item?.['period_mapped'],
                                    "sub_period_order": item?.['sub_period_order'],
                                    "stock_activities": item?.['stock_activities'][i],
                                    "for_balance": item?.['for_balance']
                                })
                            }
                        }
                    }
                    results_data.sort((a, b) => (a.warehouse.code > b.warehouse.code) ? 1 : -1)
                    $('#btn-collapse').trigger('click')
                    table_inventory_report.find('tbody').html('')
                    let table_inventory_report_wh_row = []
                    let table_inventory_report_data = []
                    for (const warehouse_activities of results_data) {
                        if (warehouses_select_Ele.val().length === 0) {
                            if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                }
                                table_inventory_report_data.push({
                                    'type': 'warehouse_row',
                                    'warehouse_id': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['id'] : ''}`,
                                    'warehouse_code': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['code'] : ''}`,
                                    'warehouse_title': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['title'] : ''}`,
                                })
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': `${warehouse_activities?.['warehouse']?.['id']}`,
                                    'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                    'warehouse_title': `${warehouse_activities?.['warehouse']?.['title']}`,
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
                                    'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`,
                                })
                                for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
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
                                    table_inventory_report_data.push({
                                        'type': 'detail_row',
                                        'date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                        'lot_number': activity?.['lot_number'],
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'],
                                        'in_value': activity?.['in_value'],
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'],
                                        'out_value': activity?.['out_value'],
                                        'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                        'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                    })
                                }
                            }
                            else {
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': `${warehouse_activities?.['warehouse']?.['id']}`,
                                    'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                    'warehouse_title': `${warehouse_activities?.['warehouse']?.['title']}`,
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
                                    'prd_end_value': `${warehouse_activities?.['stock_activities']?.['ending_balance_value']}`,
                                })
                                for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
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
                                    table_inventory_report_data.push({
                                        'type': 'detail_row',
                                        'date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                        'lot_number': activity?.['lot_number'],
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'],
                                        'in_value': activity?.['in_value'],
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'],
                                        'out_value': activity?.['out_value'],
                                        'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                        'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                    })
                                }
                            }
                        }
                        else {
                            if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                        table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                    }
                                    table_inventory_report_data.push({
                                        'type': 'warehouse_row',
                                        'warehouse_id': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['id'] : ''}`,
                                        'warehouse_code': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['code'] : ''}`,
                                        'warehouse_title': `${Object.keys(warehouse_activities?.['warehouse']).length !== 0 ? warehouse_activities?.['warehouse']?.['title'] : ''}`,
                                    })
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': `${warehouse_activities?.['warehouse']?.['id']}`,
                                        'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                        'warehouse_title': `${warehouse_activities?.['warehouse']?.['title']}`,
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
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
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
                                    table_inventory_report_data.push({
                                        'type': 'detail_row',
                                        'date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                        'lot_number': activity?.['lot_number'],
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'],
                                        'in_value': activity?.['in_value'],
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'],
                                        'out_value': activity?.['out_value'],
                                        'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                        'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                    })
                                }
                                } else {
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': `${warehouse_activities?.['warehouse']?.['id']}`,
                                        'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                        'warehouse_title': `${warehouse_activities?.['warehouse']?.['title']}`,
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
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
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
                                    table_inventory_report_data.push({
                                        'type': 'detail_row',
                                        'date': moment(activity?.['system_date']).format("DD/MM/YYYY"),
                                        'lot_number': activity?.['lot_number'],
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'],
                                        'in_value': activity?.['in_value'],
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'],
                                        'out_value': activity?.['out_value'],
                                        'warehouse_code': `${warehouse_activities?.['warehouse']?.['code']}`,
                                        'sale_order_code': `${warehouse_activities?.['product']?.['sale_order_code']}`,
                                    })
                                }
                                }
                            }
                        }
                    }
                    RenderTableWithParameter(table_inventory_report, table_inventory_report_data, table_inventory_report_wh_row, true)
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
        table_inventory_report.find('.detail_row').each(function () {
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
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-gtf')} (${trans_script.attr('data-trans-gtf-in')})`)
            }
            if ($(this).attr('class').includes('badge-soft-purple small gtf-out')) {
                $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
                $(this).closest('tr').attr('data-bs-placement', 'top')
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-gtf')} (${trans_script.attr('data-trans-gtf-out')})`)
            }
        })
        table_inventory_report.find('.no-info').each(function () {
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
                            'quantity_import': lot?.['quantity_import'],
                            'goods_receipt_date': lot?.['goods_receipt_date']
                        })
                    }
                    for (const sn of data?.['detail']?.['sn_data']) {
                        data_view_list.push({
                            'product': data?.['product'],
                            'row_type': 'sn_row',
                            'id': sn?.['id'],
                            'vendor_serial_number': sn?.['vendor_serial_number'],
                            'serial_number': sn?.['serial_number'],
                            'goods_receipt_date': sn?.['goods_receipt_date']
                        })
                    }
                }
                // console.log(data_view_list)

                RenderTableViewProductWarehouse($('#view-prd-wh-table'), data_view_list)
            })
    })

    $(document).on('click', '.qr-code-sn-info', function () {
        let dataParam = {}
        dataParam['product_id'] = $(this).attr('data-product-id')
        dataParam['product_code'] = $(this).attr('data-product-code')
        dataParam['product_title'] = $(this).attr('data-product-title')
        dataParam['product_des'] = $(this).attr('data-product-description')
        dataParam['serial_number'] = $(this).attr('data-serial-number')
        dataParam['vendor_serial_number'] = $(this).attr('data-vendor-serial-number')
        dataParam['goods_receipt_date'] = $(this).attr('data-goods-receipt-date').split('T')[0]
        let warehouse_view_list_ajax = $.fn.callAjax2({
            url: url_script.attr('data-url-qr-code-sn-info'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('qr_path_sn')) {
                    return data?.['qr_path_sn'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([warehouse_view_list_ajax]).then(
            (results) => {
                $('#modal-QR-sn #sn-view').text(dataParam['serial_number'])
                $('#modal-QR-sn .QR-sn-img').attr('src', results[0][0]?.['path'])
                $('#modal-QR-sn').modal('show')
            })
    })

    function printQRsn(sn_qr_id) {
        let divContents = document.getElementById(sn_qr_id).innerHTML;
        let a = window.open('', '');
        a.document.write('<html><body>');
        a.document.write(divContents);
        a.document.write('</body></html>');
        a.document.close();
        a.print();
    }

    $('#print-qr-sn').on('click', function () {
        printQRsn('QR-sn-img-div')
    })

    $(document).on('click', '.qr-code-lot-info', function () {
        let dataParam = {}
        dataParam['product_id'] = $(this).attr('data-product-id')
        dataParam['product_code'] = $(this).attr('data-product-code')
        dataParam['product_title'] = $(this).attr('data-product-title')
        dataParam['product_des'] = $(this).attr('data-product-description')
        dataParam['lot_number'] = $(this).attr('data-lot-number')
        dataParam['goods_receipt_date'] = $(this).attr('data-goods-receipt-date').split('T')[0]
        let warehouse_view_list_ajax = $.fn.callAjax2({
            url: url_script.attr('data-url-qr-code-lot-info'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('qr_path_lot')) {
                    return data?.['qr_path_lot'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([warehouse_view_list_ajax]).then(
            (results) => {
                $('#modal-QR-lot #lot-view').text(dataParam['lot_number'])
                $('#modal-QR-lot .QR-lot-img').attr('src', results[0][0]?.['path'])
                $('#modal-QR-lot').modal('show')
            })
    })

    function printQRLot(lot_qr_id) {
        let divContents = document.getElementById(lot_qr_id).innerHTML;
        let a = window.open('', '');
        a.document.write('<html><body>');
        a.document.write(divContents);
        a.document.write('</body></html>');
        a.document.close();
        a.print();
    }

    $('#print-qr-lot').on('click', function () {
        printQRLot('QR-lot-img-div')
    })
})