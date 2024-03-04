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
            let item_list_id = items_select_Ele.val()
            if (item_list_id) {
                let dataParam = {}
                dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
                dataParam['period_mapped'] = periodEle.val()
                let inventory_detail_list_ajax = $.fn.callAjax2({
                    url: url_script.attr('data-url-inventory-list'),
                    data: dataParam,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_detail_list')) {
                            console.log(data?.['report_inventory_detail_list'])
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
                        items_detail_report_table_Ele.find('tbody').html('')
                        for (const item of results[0]) {
                            if (items_select_Ele.val().includes(item?.['product']?.['id'])) {
                                let cumulative_quantity = 0
                                let cumulative_value = 0
                                items_detail_report_table_Ele.find('tbody').append(
                                    `<tr>
                                        <td><span class="badge badge-soft-primary">${item?.['product']?.['code']}</span></td>
                                        <td>
                                            <span data-bs-toggle="tooltip" data-bs-placement="top" title="${item?.['product']?.['description']}" class="text-secondary">${item?.['product']?.['title']}</span>
                                        </td>
                                        <td><span class="text-secondary">Weighted average</span></td>
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
                                        <td class="text-center"><span class="text-secondary ${item?.['product']?.['id']}-cumulative-quantity">0</span></td>
                                        <td><span class="text-secondary mask-money ${item?.['product']?.['id']}-cumulative-cost" data-init-money="0"></span></td>
                                        <td><span class="text-secondary mask-money ${item?.['product']?.['id']}-cumulative-value" data-init-money="0"></span></td>
                                    </tr>`
                                )
                                for (const stock_activity of item?.['stock_activities']) {
                                    if (warehouses_select_Ele.val().length > 0) {
                                        if (warehouses_select_Ele.val().includes(stock_activity?.['warehouse_id'])) {
                                            let stock_type_label = `<span class="text-secondary">Opening balance</span>`
                                            cumulative_quantity += stock_activity?.['ending_balance_quantity']
                                            cumulative_value += stock_activity?.['ending_balance_value']
                                            items_detail_report_table_Ele.find('tbody').append(
                                                `<tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td><span class="badge badge-sm badge-secondary mb-1">${stock_activity?.['warehouse_code']}</span>&nbsp;<span class="text-secondary">${stock_activity?.['warehouse_title']}</span></td>
                                                    <td></td>
                                                    <td hidden></td>
                                                    <td hidden></td>
                                                    <td>${stock_type_label}</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td class="text-center"><span class="text-secondary">${stock_activity?.['opening_balance_quantity']}</span></td>
                                                    <td><span class="text-secondary mask-money" data-init-money="${stock_activity?.['opening_balance_cost']}"></span></td>
                                                    <td><span class="text-secondary mask-money" data-init-money="${stock_activity?.['opening_balance_value']}"></span></td>
                                                </tr>`
                                            )
                                            for (const activity of stock_activity?.['data_stock_activity']) {
                                                if (activity?.['stock_type'] === 1) {
                                                    let text_color = 'primary'
                                                    if (activity?.['trans_title'] === 'Goods return') {
                                                        text_color = 'blue'
                                                    }
                                                    let stock_type_label = `<span class="text-${text_color}">${activity?.['trans_title']}</span>`
                                                    items_detail_report_table_Ele.find('tbody').append(
                                                        `<tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><span>${moment(activity?.['system_date']).format("YYYY-MM-DD HH:mm")}</span></td>
                                                            <td hidden></td>
                                                            <td hidden></td>
                                                            <td>${stock_type_label}</td>
                                                            <td><span class="badge badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
                                                            <td class="text-center"><span class="text-${text_color}">${activity?.['quantity']}</span></td>
                                                            <td><span class="text-${text_color} mask-money" data-init-money="${activity?.['cost']}"></span></td>
                                                            <td><span class="text-${text_color} mask-money" data-init-money="${activity?.['value']}"></span></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td class="text-center"><span class="text-secondary">${activity?.['current_quantity']}</span></td>
                                                            <td><span class="text-secondary mask-money" data-init-money="${activity?.['current_cost']}"></span></td>
                                                            <td><span class="text-secondary mask-money" data-init-money="${activity?.['current_value']}"></span></td>
                                                        </tr>`
                                                    )
                                                } else {
                                                    let stock_type_label = `<span class="text-danger">${activity?.['trans_title']}</span>`
                                                    items_detail_report_table_Ele.find('tbody').append(
                                                        `<tr>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td><span>${moment(activity?.['system_date']).format("YYYY-MM-DD HH:mm")}</span></td>
                                                            <td hidden></td>
                                                            <td hidden></td>
                                                            <td>${stock_type_label}</td>
                                                            <td><span class="badge badge-soft-danger w-100">${activity?.['trans_code']}</span></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td class="text-center"><span class="text-danger">${activity?.['quantity']}</span></td>
                                                            <td><span class="text-danger mask-money" data-init-money="${activity?.['cost']}"></span></td>
                                                            <td><span class="text-danger mask-money" data-init-money="${activity?.['value']}"></span></td>
                                                            <td class="text-center"><span class="text-secondary">${activity?.['current_quantity']}</span></td>
                                                            <td><span class="text-secondary mask-money" data-init-money="${activity?.['current_cost']}"></span></td>
                                                            <td><span class="text-secondary mask-money" data-init-money="${activity?.['current_value']}"></span></td>
                                                        </tr>`
                                                    )
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        let stock_type_label = `<span class="text-secondary">Opening balance</span>`
                                        cumulative_quantity += stock_activity?.['ending_balance_quantity']
                                        cumulative_value += stock_activity?.['ending_balance_value']
                                        items_detail_report_table_Ele.find('tbody').append(
                                            `<tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td><span class="badge badge-sm badge-secondary mb-1">${stock_activity?.['warehouse_code']}</span>&nbsp;<span class="text-secondary">${stock_activity?.['warehouse_title']}</span></td>
                                                <td></td>
                                                <td hidden></td>
                                                <td hidden></td>
                                                <td>${stock_type_label}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td class="text-center"><span class="text-secondary">${stock_activity?.['opening_balance_quantity']}</span></td>
                                                <td><span class="text-secondary mask-money" data-init-money="${stock_activity?.['opening_balance_cost']}"></span></td>
                                                <td><span class="text-secondary mask-money" data-init-money="${stock_activity?.['opening_balance_value']}"></span></td>
                                            </tr>`
                                        )
                                        for (const activity of stock_activity?.['data_stock_activity']) {
                                            if (activity?.['stock_type'] === 1) {
                                                let text_color = 'primary'
                                                if (activity?.['trans_title'] === 'Goods return') {
                                                    text_color = 'blue'
                                                }
                                                let stock_type_label = `<span class="text-${text_color}">${activity?.['trans_title']}</span>`
                                                items_detail_report_table_Ele.find('tbody').append(
                                                    `<tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><span>${moment(activity?.['system_date']).format("YYYY-MM-DD HH:mm")}</span></td>
                                                        <td hidden></td>
                                                        <td hidden></td>
                                                        <td>${stock_type_label}</td>
                                                        <td><span class="badge badge-soft-${text_color} w-100">${activity?.['trans_code']}</span></td>
                                                        <td class="text-center"><span class="text-${text_color}">${activity?.['quantity']}</span></td>
                                                        <td><span class="text-${text_color} mask-money" data-init-money="${activity?.['cost']}"></span></td>
                                                        <td><span class="text-${text_color} mask-money" data-init-money="${activity?.['value']}"></span></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td class="text-center"><span class="text-secondary">${activity?.['current_quantity']}</span></td>
                                                        <td><span class="text-secondary mask-money" data-init-money="${activity?.['current_cost']}"></span></td>
                                                        <td><span class="text-secondary mask-money" data-init-money="${activity?.['current_value']}"></span></td>
                                                    </tr>`
                                                )
                                            } else {
                                                let stock_type_label = `<span class="text-danger">${activity?.['trans_title']}</span>`
                                                items_detail_report_table_Ele.find('tbody').append(
                                                    `<tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td><span>${moment(activity?.['system_date']).format("YYYY-MM-DD HH:mm")}</span></td>
                                                        <td hidden></td>
                                                        <td hidden></td>
                                                        <td>${stock_type_label}</td>
                                                        <td><span class="badge badge-soft-danger w-100">${activity?.['trans_code']}</span></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td class="text-center"><span class="text-danger">${activity?.['quantity']}</span></td>
                                                        <td><span class="text-danger mask-money" data-init-money="${activity?.['cost']}"></span></td>
                                                        <td><span class="text-danger mask-money" data-init-money="${activity?.['value']}"></span></td>
                                                        <td class="text-center"><span class="text-secondary">${activity?.['current_quantity']}</span></td>
                                                        <td><span class="text-secondary mask-money" data-init-money="${activity?.['current_cost']}"></span></td>
                                                        <td><span class="text-secondary mask-money" data-init-money="${activity?.['current_value']}"></span></td>
                                                    </tr>`
                                                )
                                            }
                                        }
                                    }
                                }
                                $(`.${item?.['product']?.['id']}-cumulative-quantity`).text(cumulative_quantity)
                                $(`.${item?.['product']?.['id']}-cumulative-value`).attr('data-init-money', cumulative_value)
                                $(`.${item?.['product']?.['id']}-cumulative-cost`).attr('data-init-money', cumulative_value/cumulative_quantity)

                            }
                        }
                        $.fn.initMaskMoney2()
                    })
            } else {
                $.fn.notifyB({"description": 'No item to view.', "timeout": 3500}, 'warning')
            }
        }
        else {
            $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
        }
    })
})