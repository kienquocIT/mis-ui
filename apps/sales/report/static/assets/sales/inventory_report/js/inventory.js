$(document).ready(function () {
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

    $('#btn-view').on('click', function () {
        $('table thead').find('span').text('0')
        $('table thead').find('span').attr('data-init-money', 0)
        $('table tbody').html('')
        if ($('#show-detail-cb').prop('checked')) {
            const table_inventory_report = $('#table-inventory-report-detail')
            table_inventory_report.prop('hidden', false)
            $('#table-inventory-report').prop('hidden', true)
            if (periodMonthEle.val()) {
                WindowControl.showLoading();
                let dataParam = {}
                dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
                dataParam['period_mapped'] = periodEle.val()
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
                        table_inventory_report.find('tbody').html('')
                        let opening_sum_quantity = 0
                        let in_sum_quantity = 0
                        let out_sum_quantity = 0
                        let ending_sum_quantity = 0
                        let opening_sum_value = 0
                        let in_sum_value = 0
                        let out_sum_value = 0
                        let ending_sum_value = 0
                        for (const warehouse_activities of results[0]) {
                            if (warehouses_select_Ele.val().length === 0) {
                                if (table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`).length === 0) {
                                    table_inventory_report.find('tbody').append(`
                                        <tr class="wh-row-${warehouse_activities?.['warehouse']?.['id']} bg-secondary-light-5">
                                            <td class="border-1" colspan="18">
                                                <span class="badge badge-primary">${warehouse_activities?.['warehouse']?.['code']}</span> <span class="text-primary"><b>${warehouse_activities?.['warehouse']?.['title']}</b></span>
                                            </td>
                                            <td class="border-1"><b><span class="wh-opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></b></td>
                                            <td class="border-1"><b><span class="wh-opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></b></td>
                                            <td class="border-1 text-primary"><b><span class="wh-in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></b></td>
                                            <td class="border-1 text-primary"><b><span class="wh-in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></b></td>
                                            <td class="border-1 text-danger"><b><span class="wh-out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></b></td>
                                            <td class="border-1 text-danger"><b><span class="wh-out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></b></td>
                                            <td class="border-1"><b><span class="wh-ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></b></td>
                                            <td class="border-1"><b><span class="wh-ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></b></td>                            
                                        </tr>
                                    `)
                                    let detail_html = ``
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                        let bg_in = ''
                                        let bg_out = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            bg_in = 'bg-primary-light-5'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            bg_in = 'bg-blue-light-5'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery') {
                                            bg_out = 'bg-danger-light-5'
                                        }
                                        detail_html += `
                                            <tr>
                                                <td class="border-1" colspan="3"><span></span></td>
                                                <td class="border-1" colspan="3"><span></span></td>
                                                <td class="border-1" colspan="3"><span></span></td>
                                                <td class="border-1" colspan="3"><span>${moment(activity?.['system_date']).format("YYYY-MM-DD")}</span></td>
                                                <td class="border-1" colspan="3"><span>${activity?.['lot_number']}</span></td>
                                                <td class="border-1" colspan="3"><span>${activity?.['expire_date'] ? moment(activity?.['expire_date']).format("YYYY-MM-DD") : ''}</span></td>
                                                <td class="border-1"></td>
                                                <td class="border-1"></td>
                                                <td class="border-1 ${bg_in}"><span class="in-quantity-span-detail">${activity?.['in_quantity']}</span></td>
                                                <td class="border-1 ${bg_in}"><span class="in-value-span-detail mask-money" data-init-money="${activity?.['in_value']}"></span></td>
                                                <td class="border-1 ${bg_out}"><span class="out-quantity-span-detail">${activity?.['out_quantity']}</span></td>
                                                <td class="border-1 ${bg_out}"><span class="out-value-span-detail mask-money" data-init-money="${activity?.['out_value']}"></span></td>
                                                <td class="border-1"></td>
                                                <td class="border-1"></td>
                                            </tr>
                                        `
                                    }
                                    table_inventory_report.find('tbody').append(`
                                        <tr>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"></td>
                                            <td class="border-1" colspan="3"></td>
                                            <td class="border-1" colspan="3"></td>
                                            <td class="border-1"><span class="opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></td>
                                            <td class="border-1 text-primary"><span class="in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                            <td class="border-1 text-primary"><span class="in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                            <td class="border-1 text-danger"><span class="out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                            <td class="border-1 text-danger"><span class="out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                            <td class="border-1"><span class="ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></td>
                                        </tr>
                                        ${detail_html}
                                    `)

                                    opening_sum_quantity += warehouse_activities?.['stock_activities']?.['opening_balance_quantity']
                                    in_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_in_quantity']
                                    out_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_out_quantity']
                                    ending_sum_quantity += warehouse_activities?.['stock_activities']?.['ending_balance_quantity']
                                    opening_sum_value += warehouse_activities?.['stock_activities']?.['opening_balance_value']
                                    in_sum_value += warehouse_activities?.['stock_activities']?.['sum_in_value']
                                    out_sum_value += warehouse_activities?.['stock_activities']?.['sum_out_value']
                                    ending_sum_value += warehouse_activities?.['stock_activities']?.['ending_balance_value']
                                }
                                else {
                                    let detail_html = ``
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                        let bg_in = ''
                                        let bg_out = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            bg_in = 'bg-primary-light-5'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            bg_in = 'bg-blue-light-5'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery') {
                                            bg_out = 'bg-danger-light-5'
                                        }
                                        detail_html += `
                                            <tr>
                                                <td class="border-1" colspan="3"><span></span></td>
                                                <td class="border-1" colspan="3"><span></span></td>
                                                <td class="border-1" colspan="3"><span></span></td>
                                                <td class="border-1" colspan="3"><span>${moment(activity?.['system_date']).format("YYYY-MM-DD")}</span></td>
                                                <td class="border-1" colspan="3"><span>${activity?.['lot_number']}</span></td>
                                                <td class="border-1" colspan="3"><span>${activity?.['expire_date'] ? moment(activity?.['expire_date']).format("YYYY-MM-DD") : ''}</span></td>
                                                <td class="border-1"></td>
                                                <td class="border-1"></td>
                                                <td class="border-1 ${bg_in}"><span class="in-quantity-span-detail">${activity?.['in_quantity']}</span></td>
                                                <td class="border-1 ${bg_in}"><span class="in-value-span-detail mask-money" data-init-money="${activity?.['in_value']}"></span></td>
                                                <td class="border-1 ${bg_out}"><span class="out-quantity-span-detail">${activity?.['out_quantity']}</span></td>
                                                <td class="border-1 ${bg_out}"><span class="out-value-span-detail mask-money" data-init-money="${activity?.['out_value']}"></span></td>
                                                <td class="border-1"></td>
                                                <td class="border-1"></td>
                                            </tr>
                                        `
                                    }

                                    let current_wh_row = table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`)
                                    current_wh_row.after(`
                                        <tr>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"></td>
                                            <td class="border-1" colspan="3"></td>
                                            <td class="border-1" colspan="3"></td>
                                            <td class="border-1"><span class="opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></td>
                                            <td class="border-1 text-primary"><span class="in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                            <td class="border-1 text-primary"><span class="in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                            <td class="border-1 text-danger"><span class="out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                            <td class="border-1 text-danger"><span class="out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                            <td class="border-1"><span class="ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></td>
                                        </tr>
                                        ${detail_html}
                                    `)

                                    current_wh_row.find('.wh-opening-quantity-span').text(parseFloat(current_wh_row.find('.wh-opening-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['opening_balance_quantity'])
                                    current_wh_row.find('.wh-opening-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-opening-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['opening_balance_value'])
                                    current_wh_row.find('.wh-in-quantity-span').text(parseFloat(current_wh_row.find('.wh-in-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['sum_in_quantity'])
                                    current_wh_row.find('.wh-in-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-in-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['sum_in_value'])
                                    current_wh_row.find('.wh-out-quantity-span').text(parseFloat(current_wh_row.find('.wh-out-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['sum_out_quantity'])
                                    current_wh_row.find('.wh-out-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-out-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['sum_out_value'])
                                    current_wh_row.find('.wh-ending-quantity-span').text(parseFloat(current_wh_row.find('.wh-ending-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['ending_balance_quantity'])
                                    current_wh_row.find('.wh-ending-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-ending-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['ending_balance_value'])

                                    opening_sum_quantity += warehouse_activities?.['stock_activities']?.['opening_balance_quantity']
                                    in_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_in_quantity']
                                    out_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_out_quantity']
                                    ending_sum_quantity += warehouse_activities?.['stock_activities']?.['ending_balance_quantity']
                                    opening_sum_value += warehouse_activities?.['stock_activities']?.['opening_balance_value']
                                    in_sum_value += warehouse_activities?.['stock_activities']?.['sum_in_value']
                                    out_sum_value += warehouse_activities?.['stock_activities']?.['sum_out_value']
                                    ending_sum_value += warehouse_activities?.['stock_activities']?.['ending_balance_value']
                                }
                                $('#table-inventory-report-detail #opening-total-quantity').text(opening_sum_quantity)
                                $('#table-inventory-report-detail #opening-total-value').attr('data-init-money', opening_sum_value)
                                $('#table-inventory-report-detail #in-total-quantity').text(in_sum_quantity)
                                $('#table-inventory-report-detail #in-total-value').attr('data-init-money', in_sum_value)
                                $('#table-inventory-report-detail #out-total-quantity').text(out_sum_quantity)
                                $('#table-inventory-report-detail #out-total-value').attr('data-init-money', out_sum_value)
                                $('#table-inventory-report-detail #ending-total-quantity').text(ending_sum_quantity)
                                $('#table-inventory-report-detail #ending-total-value').attr('data-init-money', ending_sum_value)
                            }
                            else {
                                if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                    if (table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`).length === 0) {
                                        table_inventory_report.find('tbody').append(`
                                            <tr class="wh-row-${warehouse_activities?.['warehouse']?.['id']} bg-secondary-light-5">
                                                <td class="border-1" colspan="18">
                                                    <span class="badge badge-primary">${warehouse_activities?.['warehouse']?.['code']}</span> <span class="text-primary"><b>${warehouse_activities?.['warehouse']?.['title']}</b></span>
                                                </td>
                                                <td class="border-1"><b><span class="wh-opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></b></td>
                                                <td class="border-1"><b><span class="wh-opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></b></td>
                                                <td class="border-1 text-primary"><b><span class="wh-in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></b></td>
                                                <td class="border-1 text-primary"><b><span class="wh-in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></b></td>
                                                <td class="border-1 text-danger"><b><span class="wh-out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></b></td>
                                                <td class="border-1 text-danger"><b><span class="wh-out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></b></td>
                                                <td class="border-1"><b><span class="wh-ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></b></td>
                                                <td class="border-1"><b><span class="wh-ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></b></td>                           
                                            </tr>
                                        `)
                                        let detail_html = ``
                                        for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                            let bg_in = ''
                                            let bg_out = ''
                                            if (activity?.['trans_title'] === 'Goods receipt') {
                                                bg_in = 'bg-primary-light-5'
                                            }
                                            if (activity?.['trans_title'] === 'Goods return') {
                                                bg_in = 'bg-blue-light-5'
                                            }
                                            if (activity?.['trans_title'] === 'Delivery') {
                                                bg_out = 'bg-danger-light-5'
                                            }
                                            detail_html += `
                                                <tr>
                                                    <td class="border-1" colspan="3"><span></span></td>
                                                    <td class="border-1" colspan="3"><span></span></td>
                                                    <td class="border-1" colspan="3"><span></span></td>
                                                    <td class="border-1" colspan="3"><span>${moment(activity?.['system_date']).format("YYYY-MM-DD")}</span></td>
                                                    <td class="border-1" colspan="3"><span>${activity?.['lot_number']}</span></td>
                                                    <td class="border-1" colspan="3"><span>${activity?.['expire_date'] ? moment(activity?.['expire_date']).format("YYYY-MM-DD") : ''}</span></td>
                                                    <td class="border-1"></td>
                                                    <td class="border-1"></td>
                                                    <td class="border-1 ${bg_in}"><span class="in-quantity-span-detail">${activity?.['in_quantity']}</span></td>
                                                    <td class="border-1 ${bg_in}"><span class="in-value-span-detail mask-money" data-init-money="${activity?.['in_value']}"></span></td>
                                                    <td class="border-1 ${bg_out}"><span class="out-quantity-span-detail">${activity?.['out_quantity']}</span></td>
                                                    <td class="border-1 ${bg_out}"><span class="out-value-span-detail mask-money" data-init-money="${activity?.['out_value']}"></span></td>
                                                    <td class="border-1"></td>
                                                    <td class="border-1"></td>
                                                </tr>
                                            `
                                        }
                                        table_inventory_report.find('tbody').append(`
                                            <tr>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                                <td class="border-1" colspan="3"></td>
                                                <td class="border-1" colspan="3"></td>
                                                <td class="border-1" colspan="3"></td>
                                                <td class="border-1"><span class="opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></td>
                                                <td class="border-1"><span class="opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></td>
                                                <td class="border-1 text-primary"><span class="in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                                <td class="border-1 text-primary"><span class="in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                                <td class="border-1 text-danger"><span class="out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                                <td class="border-1 text-danger"><span class="out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                                <td class="border-1"><span class="ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></td>
                                                <td class="border-1"><span class="ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></td>
                                            </tr>
                                            ${detail_html}
                                        `)

                                        opening_sum_quantity += warehouse_activities?.['stock_activities']?.['opening_balance_quantity']
                                        in_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_in_quantity']
                                        out_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_out_quantity']
                                        ending_sum_quantity += warehouse_activities?.['stock_activities']?.['ending_balance_quantity']
                                        opening_sum_value += warehouse_activities?.['stock_activities']?.['opening_balance_value']
                                        in_sum_value += warehouse_activities?.['stock_activities']?.['sum_in_value']
                                        out_sum_value += warehouse_activities?.['stock_activities']?.['sum_out_value']
                                        ending_sum_value += warehouse_activities?.['stock_activities']?.['ending_balance_value']
                                    }
                                    else {
                                        let detail_html = ``
                                        for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                            let bg_in = ''
                                            let bg_out = ''
                                            if (activity?.['in_quantity'] && activity?.['in_value']) {
                                                bg_in = 'bg-primary-light-5'
                                            }
                                            if (activity?.['out_quantity'] && activity?.['out_value']) {
                                                bg_out = 'bg-danger-light-5'
                                            }
                                            detail_html += `
                                                <tr>
                                                    <td class="border-1" colspan="3"><span></span></td>
                                                    <td class="border-1" colspan="3"><span></span></td>
                                                    <td class="border-1" colspan="3"><span></span></td>
                                                    <td class="border-1" colspan="3"><span>${moment(activity?.['system_date']).format("YYYY-MM-DD")}</span></td>
                                                    <td class="border-1" colspan="3"><span>${activity?.['lot_number']}</span></td>
                                                    <td class="border-1" colspan="3"><span>${activity?.['expire_date'] ? moment(activity?.['expire_date']).format("YYYY-MM-DD") : ''}</span></td>
                                                    <td class="border-1"></td>
                                                    <td class="border-1"></td>
                                                    <td class="border-1 ${bg_in}"><span class="in-quantity-span-detail">${activity?.['in_quantity']}</span></td>
                                                    <td class="border-1 ${bg_in}"><span class="in-value-span-detail mask-money" data-init-money="${activity?.['in_value']}"></span></td>
                                                    <td class="border-1 ${bg_out}"><span class="out-quantity-span-detail">${activity?.['out_quantity']}</span></td>
                                                    <td class="border-1 ${bg_out}"><span class="out-value-span-detail mask-money" data-init-money="${activity?.['out_value']}"></span></td>
                                                    <td class="border-1"></td>
                                                    <td class="border-1"></td>
                                                </tr>
                                            `
                                        }

                                        let current_wh_row = table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`)
                                        current_wh_row.after(`
                                            <tr>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                                <td class="border-1" colspan="3"></td>
                                                <td class="border-1" colspan="3"></td>
                                                <td class="border-1" colspan="3"></td>
                                                <td class="border-1"><span class="opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></td>
                                                <td class="border-1"><span class="opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></td>
                                                <td class="border-1 text-primary"><span class="in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                                <td class="border-1 text-primary"><span class="in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                                <td class="border-1 text-danger"><span class="out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                                <td class="border-1 text-danger"><span class="out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                                <td class="border-1"><span class="ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></td>
                                                <td class="border-1"><span class="ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></td>
                                            </tr>
                                            ${detail_html}
                                        `)

                                        current_wh_row.find('.wh-opening-quantity-span').text(parseFloat(current_wh_row.find('.wh-opening-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['opening_balance_quantity'])
                                        current_wh_row.find('.wh-opening-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-opening-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['opening_balance_value'])
                                        current_wh_row.find('.wh-in-quantity-span').text(parseFloat(current_wh_row.find('.wh-in-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['sum_in_quantity'])
                                        current_wh_row.find('.wh-in-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-in-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['sum_in_value'])
                                        current_wh_row.find('.wh-out-quantity-span').text(parseFloat(current_wh_row.find('.wh-out-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['sum_out_quantity'])
                                        current_wh_row.find('.wh-out-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-out-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['sum_out_value'])
                                        current_wh_row.find('.wh-ending-quantity-span').text(parseFloat(current_wh_row.find('.wh-ending-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['ending_balance_quantity'])
                                        current_wh_row.find('.wh-ending-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-ending-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['ending_balance_value'])

                                        opening_sum_quantity += warehouse_activities?.['stock_activities']?.['opening_balance_quantity']
                                        in_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_in_quantity']
                                        out_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_out_quantity']
                                        ending_sum_quantity += warehouse_activities?.['stock_activities']?.['ending_balance_quantity']
                                        opening_sum_value += warehouse_activities?.['stock_activities']?.['opening_balance_value']
                                        in_sum_value += warehouse_activities?.['stock_activities']?.['sum_in_value']
                                        out_sum_value += warehouse_activities?.['stock_activities']?.['sum_out_value']
                                        ending_sum_value += warehouse_activities?.['stock_activities']?.['ending_balance_value']
                                    }
                                    $('#table-inventory-report-detail #opening-total-quantity').text(opening_sum_quantity)
                                    $('#table-inventory-report-detail #opening-total-value').attr('data-init-money', opening_sum_value)
                                    $('#table-inventory-report-detail #in-total-quantity').text(in_sum_quantity)
                                    $('#table-inventory-report-detail #in-total-value').attr('data-init-money', in_sum_value)
                                    $('#table-inventory-report-detail #out-total-quantity').text(out_sum_quantity)
                                    $('#table-inventory-report-detail #out-total-value').attr('data-init-money', out_sum_value)
                                    $('#table-inventory-report-detail #ending-total-quantity').text(ending_sum_quantity)
                                    $('#table-inventory-report-detail #ending-total-value').attr('data-init-money', ending_sum_value)
                                }
                            }
                        }
                        $.fn.initMaskMoney2()
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            500
                        )
                    })
            }
            else {
                $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
            }
        }
        else {
            const table_inventory_report = $('#table-inventory-report')
            table_inventory_report.prop('hidden', false)
            $('#table-inventory-report-detail').prop('hidden', true)
            if (periodMonthEle.val()) {
                WindowControl.showLoading();
                let dataParam = {}
                dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
                dataParam['period_mapped'] = periodEle.val()
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
                        table_inventory_report.find('tbody').html('')
                        let opening_sum_quantity = 0
                        let in_sum_quantity = 0
                        let out_sum_quantity = 0
                        let ending_sum_quantity = 0
                        let opening_sum_value = 0
                        let in_sum_value = 0
                        let out_sum_value = 0
                        let ending_sum_value = 0
                        for (const warehouse_activities of results[0]) {
                            if (warehouses_select_Ele.val().length === 0) {
                                if (table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`).length === 0) {
                                    table_inventory_report.find('tbody').append(`
                                        <tr class="wh-row-${warehouse_activities?.['warehouse']?.['id']} bg-secondary-light-5">
                                            <td class="border-1" colspan="9">
                                                <span class="badge badge-primary">${warehouse_activities?.['warehouse']?.['code']}</span> <span class="text-primary"><b>${warehouse_activities?.['warehouse']?.['title']}</b></span>
                                            </td>
                                            <td class="border-1"><b><span class="wh-opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></b></td>
                                            <td class="border-1"><b><span class="wh-opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></b></td>
                                            <td class="border-1 text-primary"><b><span class="wh-in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></b></td>
                                            <td class="border-1 text-primary"><b><span class="wh-in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></b></td>
                                            <td class="border-1 text-danger"><b><span class="wh-out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></b></td>
                                            <td class="border-1 text-danger"><b><span class="wh-out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></b></td>
                                            <td class="border-1"><b><span class="wh-ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></b></td>
                                            <td class="border-1"><b><span class="wh-ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></b></td>                     
                                        </tr>
                                    `)
                                    table_inventory_report.find('tbody').append(`
                                        <tr>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                            <td class="border-1"><span class="opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></td>
                                            <td class="border-1 text-primary"><span class="in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                            <td class="border-1 text-primary"><span class="in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                            <td class="border-1 text-danger"><span class="out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                            <td class="border-1 text-danger"><span class="out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                            <td class="border-1"><span class="ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></td>
                                        </tr>
                                    `)

                                    opening_sum_quantity += warehouse_activities?.['stock_activities']?.['opening_balance_quantity']
                                    in_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_in_quantity']
                                    out_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_out_quantity']
                                    ending_sum_quantity += warehouse_activities?.['stock_activities']?.['ending_balance_quantity']
                                    opening_sum_value += warehouse_activities?.['stock_activities']?.['opening_balance_value']
                                    in_sum_value += warehouse_activities?.['stock_activities']?.['sum_in_value']
                                    out_sum_value += warehouse_activities?.['stock_activities']?.['sum_out_value']
                                    ending_sum_value += warehouse_activities?.['stock_activities']?.['ending_balance_value']
                                }
                                else {
                                    let current_wh_row = table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`)
                                    current_wh_row.after(`
                                        <tr>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                            <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                            <td class="border-1"><span class="opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></td>
                                            <td class="border-1 text-primary"><span class="in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                            <td class="border-1 text-primary"><span class="in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                            <td class="border-1 text-danger"><span class="out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                            <td class="border-1 text-danger"><span class="out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                            <td class="border-1"><span class="ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></td>
                                            <td class="border-1"><span class="ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></td>
                                        </tr>
                                    `)

                                    current_wh_row.find('.wh-opening-quantity-span').text(parseFloat(current_wh_row.find('.wh-opening-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['opening_balance_quantity'])
                                    current_wh_row.find('.wh-opening-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-opening-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['opening_balance_value'])
                                    current_wh_row.find('.wh-in-quantity-span').text(parseFloat(current_wh_row.find('.wh-in-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['sum_in_quantity'])
                                    current_wh_row.find('.wh-in-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-in-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['sum_in_value'])
                                    current_wh_row.find('.wh-out-quantity-span').text(parseFloat(current_wh_row.find('.wh-out-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['sum_out_quantity'])
                                    current_wh_row.find('.wh-out-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-out-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['sum_out_value'])
                                    current_wh_row.find('.wh-ending-quantity-span').text(parseFloat(current_wh_row.find('.wh-ending-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['ending_balance_quantity'])
                                    current_wh_row.find('.wh-ending-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-ending-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['ending_balance_value'])

                                    opening_sum_quantity += warehouse_activities?.['stock_activities']?.['opening_balance_quantity']
                                    in_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_in_quantity']
                                    out_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_out_quantity']
                                    ending_sum_quantity += warehouse_activities?.['stock_activities']?.['ending_balance_quantity']
                                    opening_sum_value += warehouse_activities?.['stock_activities']?.['opening_balance_value']
                                    in_sum_value += warehouse_activities?.['stock_activities']?.['sum_in_value']
                                    out_sum_value += warehouse_activities?.['stock_activities']?.['sum_out_value']
                                    ending_sum_value += warehouse_activities?.['stock_activities']?.['ending_balance_value']
                                }
                                $('#table-inventory-report #opening-total-quantity').text(opening_sum_quantity)
                                $('#table-inventory-report #opening-total-value').attr('data-init-money', opening_sum_value)
                                $('#table-inventory-report #in-total-quantity').text(in_sum_quantity)
                                $('#table-inventory-report #in-total-value').attr('data-init-money', in_sum_value)
                                $('#table-inventory-report #out-total-quantity').text(out_sum_quantity)
                                $('#table-inventory-report #out-total-value').attr('data-init-money', out_sum_value)
                                $('#table-inventory-report #ending-total-quantity').text(ending_sum_quantity)
                                $('#table-inventory-report #ending-total-value').attr('data-init-money', ending_sum_value)
                            } else {
                                if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                    if (table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`).length === 0) {
                                        table_inventory_report.find('tbody').append(`
                                            <tr class="wh-row-${warehouse_activities?.['warehouse']?.['id']} bg-secondary-light-5">
                                                <td class="border-1" colspan="9">
                                                    <span class="badge badge-primary">${warehouse_activities?.['warehouse']?.['code']}</span> <span class="text-primary"><b>${warehouse_activities?.['warehouse']?.['title']}</b></span>
                                                </td> 
                                                <td class="border-1"><b><span class="wh-opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></b></td>
                                                <td class="border-1"><b><span class="wh-opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></b></td>
                                                <td class="border-1 text-primary"><b><span class="wh-in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></b></td>
                                                <td class="border-1 text-primary"><b><span class="wh-in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></b></td>
                                                <td class="border-1 text-danger"><b><span class="wh-out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></b></td>
                                                <td class="border-1 text-danger"><b><span class="wh-out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></b></td>
                                                <td class="border-1"><b><span class="wh-ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></b></td>
                                                <td class="border-1"><b><span class="wh-ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></b></td>                             
                                            </tr>
                                        `)
                                        table_inventory_report.find('tbody').append(`
                                            <tr>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                                <td class="border-1"><span class="opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></td>
                                                <td class="border-1"><span class="opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></td>
                                                <td class="border-1 text-primary"><span class="in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                                <td class="border-1 text-primary"><span class="in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                                <td class="border-1 text-danger"><span class="out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                                <td class="border-1 text-danger"><span class="out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                                <td class="border-1"><span class="ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></td>
                                                <td class="border-1"><span class="ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></td>
                                            </tr>
                                        `)

                                        opening_sum_quantity += warehouse_activities?.['stock_activities']?.['opening_balance_quantity']
                                        in_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_in_quantity']
                                        out_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_out_quantity']
                                        ending_sum_quantity += warehouse_activities?.['stock_activities']?.['ending_balance_quantity']
                                        opening_sum_value += warehouse_activities?.['stock_activities']?.['opening_balance_value']
                                        in_sum_value += warehouse_activities?.['stock_activities']?.['sum_in_value']
                                        out_sum_value += warehouse_activities?.['stock_activities']?.['sum_out_value']
                                        ending_sum_value += warehouse_activities?.['stock_activities']?.['ending_balance_value']
                                    } else {
                                        let current_wh_row = table_inventory_report.find(`tbody .wh-row-${warehouse_activities?.['warehouse']?.['id']}`)
                                        current_wh_row.after(`
                                            <tr>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['code']}</span></td>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['title']}</span></td>
                                                <td class="border-1" colspan="3"><span>${warehouse_activities?.['product']?.['uom']?.['title']}</span></td>
                                                <td class="border-1"><span class="opening-quantity-span">${warehouse_activities?.['stock_activities']?.['opening_balance_quantity']}</span></td>
                                                <td class="border-1"><span class="opening-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['opening_balance_value']}"></span></td>
                                                <td class="border-1 text-primary"><span class="in-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_in_quantity']}</span></td>
                                                <td class="border-1 text-primary"><span class="in-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_in_value']}"></span></td>
                                                <td class="border-1 text-danger"><span class="out-quantity-span">${warehouse_activities?.['stock_activities']?.['sum_out_quantity']}</span></td>
                                                <td class="border-1 text-danger"><span class="out-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['sum_out_value']}"></span></td>
                                                <td class="border-1"><span class="ending-quantity-span">${warehouse_activities?.['stock_activities']?.['ending_balance_quantity']}</span></td>
                                                <td class="border-1"><span class="ending-value-span mask-money" data-init-money="${warehouse_activities?.['stock_activities']?.['ending_balance_value']}"></span></td>
                                            </tr>
                                        `)

                                        current_wh_row.find('.wh-opening-quantity-span').text(parseFloat(current_wh_row.find('.wh-opening-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['opening_balance_quantity'])
                                        current_wh_row.find('.wh-opening-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-opening-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['opening_balance_value'])
                                        current_wh_row.find('.wh-in-quantity-span').text(parseFloat(current_wh_row.find('.wh-in-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['sum_in_quantity'])
                                        current_wh_row.find('.wh-in-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-in-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['sum_in_value'])
                                        current_wh_row.find('.wh-out-quantity-span').text(parseFloat(current_wh_row.find('.wh-out-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['sum_out_quantity'])
                                        current_wh_row.find('.wh-out-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-out-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['sum_out_value'])
                                        current_wh_row.find('.wh-ending-quantity-span').text(parseFloat(current_wh_row.find('.wh-ending-quantity-span').text()) + warehouse_activities?.['stock_activities']?.['ending_balance_quantity'])
                                        current_wh_row.find('.wh-ending-value-span').attr('data-init-money', parseFloat(current_wh_row.find('.wh-ending-value-span').attr('data-init-money')) + warehouse_activities?.['stock_activities']?.['ending_balance_value'])

                                        opening_sum_quantity += warehouse_activities?.['stock_activities']?.['opening_balance_quantity']
                                        in_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_in_quantity']
                                        out_sum_quantity += warehouse_activities?.['stock_activities']?.['sum_out_quantity']
                                        ending_sum_quantity += warehouse_activities?.['stock_activities']?.['ending_balance_quantity']
                                        opening_sum_value += warehouse_activities?.['stock_activities']?.['opening_balance_value']
                                        in_sum_value += warehouse_activities?.['stock_activities']?.['sum_in_value']
                                        out_sum_value += warehouse_activities?.['stock_activities']?.['sum_out_value']
                                        ending_sum_value += warehouse_activities?.['stock_activities']?.['ending_balance_value']
                                    }
                                    $('#table-inventory-report #opening-total-quantity').text(opening_sum_quantity)
                                    $('#table-inventory-report #opening-total-value').attr('data-init-money', opening_sum_value)
                                    $('#table-inventory-report #in-total-quantity').text(in_sum_quantity)
                                    $('#table-inventory-report #in-total-value').attr('data-init-money', in_sum_value)
                                    $('#table-inventory-report #out-total-quantity').text(out_sum_quantity)
                                    $('#table-inventory-report #out-total-value').attr('data-init-money', out_sum_value)
                                    $('#table-inventory-report #ending-total-quantity').text(ending_sum_quantity)
                                    $('#table-inventory-report #ending-total-value').attr('data-init-money', ending_sum_value)
                                }
                            }
                        }
                        $.fn.initMaskMoney2()
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
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