$(document).ready(function () {
    const table_inventory_report = $('#table-inventory-report')
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
            periodMonthEle.append(`<option value="${i+1}">${trans_script.attr(`data-trans-m${trans_order}th`)}</option>`)

            data.push({
                'id': i+1,
                'title': trans_script.attr(`data-trans-m${trans_order}th`),
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

    $('#btn-view').on('click', function () {
        if (periodMonthEle.val()) {
            if (items_select_Ele.val().length > 0) {
                let item_list_id = items_select_Ele.val()
                if (item_list_id) {
                    let dataParam = {}
                    dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
                    dataParam['period_mapped'] = periodEle.val()
                    dataParam['product_id_list'] = items_select_Ele.val().join(',')
                    let inventory_detail_list_ajax = $.fn.callAjax2({
                        url: url_script.attr('data-url-inventory-list'),
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
                            console.log(results[0]);
                            table_inventory_report.find('tbody').html('')
                            for (const warehouse_activities of results[0]) {
                                if (warehouses_select_Ele.val().length === 0) {
                                    if (table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`).length === 0) {
                                        table_inventory_report.find('tbody').append(`
                                        <tr class="wh-row-${warehouse_activities?.['warehouse']?.['id']}">
                                            <td class="border-1" colspan="18"><span class="badge badge-soft-secondary">${warehouse_activities?.['warehouse']?.['code']}</span> <span class="text-secondary"><b>${warehouse_activities?.['warehouse']?.['title']}</b></span></td>                             
                                        </tr>
                                    `)
                                        table_inventory_report.find('tbody').append(`
                                        <tr>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['opening_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['opening_balance_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['ending_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['ending_balance_value']}"></span></td>
                                        </tr>
                                    `)
                                    }
                                    else {
                                        table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`).after(`
                                        <tr>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['opening_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['opening_balance_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['ending_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['ending_balance_value']}"></span></td>
                                        </tr>
                                    `)
                                    }
                                }
                                else {
                                    if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                        if (table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`).length === 0) {
                                            table_inventory_report.find('tbody').append(`
                                                <tr class="wh-row-${warehouse_activities?.['warehouse']?.['id']}">
                                                    <td class="border-1" colspan="18"><span class="badge badge-soft-secondary">${warehouse_activities?.['warehouse']?.['code']}</span> <span class="text-secondary"><b>${warehouse_activities?.['warehouse']?.['title']}</b></span></td>                             
                                                </tr>
                                            `)
                                            table_inventory_report.find('tbody').append(`
                                                <tr>
                                                    <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                                    <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                                    <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                                    <td class="border-1"><span>${warehouse_activities?.['opening_balance_quantity']}</span></td>
                                                    <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['opening_balance_value']}"></span></td>
                                                    <td class="border-1"><span>${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                                    <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                                    <td class="border-1"><span>${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                                    <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                                    <td class="border-1"><span>${warehouse_activities?.['ending_balance_quantity']}</span></td>
                                                    <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['ending_balance_value']}"></span></td>
                                                </tr>
                                            `)
                                        }
                                        else {
                                        table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`).after(`
                                        <tr>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['opening_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['opening_balance_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                            <td class="border-1"><span>${warehouse_activities?.['ending_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="mask-money" data-init-money="${warehouse_activities?.['ending_balance_value']}"></span></td>
                                        </tr>
                                    `)
                                    }
                                    }
                                }
                            }
                            $.fn.initMaskMoney2()
                        })
                } else {
                    $.fn.notifyB({"description": 'No item to view.', "timeout": 3500}, 'warning')
                }
            }
            else {
                $.fn.notifyB({"description": 'No item selected.', "timeout": 3500}, 'warning')
            }
        }
        else {
            $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
        }
    })
})