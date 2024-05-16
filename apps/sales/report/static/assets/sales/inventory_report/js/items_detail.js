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
                    for (const item of results[0]) {
                        let cumulative_quantity = 0
                        let cumulative_value = 0
                        items_detail_report_table_Ele.find('tbody').append(
                            `<tr class="main-row" style="background-color: #eaeaea">
                                <td class="first-col-x border-1">
                                    <span class="badge badge-primary">${item?.['product']?.['code']}</span>
                                    <span class="text-primary small"><b>${item?.['product']?.['title']}</b></span>
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
                                        }
                                        else {
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
                            else {
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
                                    }
                                    else {
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
                            if ($definition_inventory_valuation === '1' && PERIODIC_CLOSED === false) {
                                items_detail_report_table_Ele.find('tbody .main-row').each(function () {
                                    $(this).find('td:eq(15)').html('-')
                                    $(this).find('td:eq(16)').html('-')
                                })
                                items_detail_report_table_Ele.find('tbody .eb-row').prop('hidden', false)
                            }
                            if ($definition_inventory_valuation === '1') {
                                items_detail_report_table_Ele.find('tbody .detail-in').each(function () {
                                    $(this).find('td:eq(15)').html('-')
                                    $(this).find('td:eq(16)').html('-')
                                })
                                items_detail_report_table_Ele.find('tbody .detail-out').each(function () {
                                    $(this).find('td:eq(12)').html('-')
                                    $(this).find('td:eq(13)').html('-')
                                    $(this).find('td:eq(15)').html('-')
                                    $(this).find('td:eq(16)').html('-')
                                })
                                items_detail_report_table_Ele.find('tbody .eb-row').prop('hidden', false)
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
                    let inventory_detail_list_ajax = $.fn.callAjax2({
                        url: url_script.attr('data-url-inventory-detail-list') + '?is_calculate=1',
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
                                let cumulative_quantity = 0
                                let cumulative_value = 0
                                items_detail_report_table_Ele.find('tbody').append(
                                    `<tr class="main-row" style="background-color: #eaeaea">
                                        <td class="first-col-x border-1">
                                            <span class="badge badge-primary">${item?.['product']?.['code']}</span>
                                            <span class="text-primary small"><b>${item?.['product']?.['title']}</b></span>
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
                                                }
                                                else {
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
                                    else {
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
                                            }
                                            else {
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
                                    if ($definition_inventory_valuation === '1' && PERIODIC_CLOSED === false) {
                                        items_detail_report_table_Ele.find('tbody .main-row').each(function () {
                                            $(this).find('td:eq(15)').html('-')
                                            $(this).find('td:eq(16)').html('-')
                                        })
                                        items_detail_report_table_Ele.find('tbody .eb-row').prop('hidden', false)
                                    }
                                    if ($definition_inventory_valuation === '1') {
                                        items_detail_report_table_Ele.find('tbody .detail-in').each(function () {
                                            $(this).find('td:eq(15)').html('-')
                                            $(this).find('td:eq(16)').html('-')
                                        })
                                        items_detail_report_table_Ele.find('tbody .detail-out').each(function () {
                                            $(this).find('td:eq(12)').html('-')
                                            $(this).find('td:eq(13)').html('-')
                                            $(this).find('td:eq(15)').html('-')
                                            $(this).find('td:eq(16)').html('-')
                                        })
                                        items_detail_report_table_Ele.find('tbody .eb-row').prop('hidden', false)
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