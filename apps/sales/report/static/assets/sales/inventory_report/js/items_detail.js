$(document).ready(function () {
    let items_select_Ele = $('#items_select')
    let warehouses_select_Ele = $('#warehouses_select')
    let items_detail_report_table_Ele = $('#items_detail_report_table')
    const periodEle = $('#period-select')
    const periodMonthEle = $('#period-month')
    const trans_script = $('#trans-script')
    const url_script = $('#url-script')

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
    LoadPeriod()

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
                dataParam['order'] = parseInt(periodMonthEle.val())
                let inventory_detail_list_ajax = $.fn.callAjax2({
                    url: url_script.attr('data-url-inventory-list'),
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
                        console.log(results[0])
                        items_detail_report_table_Ele.find('tbody').html('')
                        for (const item of results[0]) {
                            if (items_select_Ele.val().includes(item?.['product']?.['id'])) {
                                items_detail_report_table_Ele.find('tbody').append(
                                    `<tr>
                                    <td><span class="badge badge-soft-primary">${item?.['product']?.['code']}</span></td>
                                    <td>
                                        <span class="badge-status">
                                            <span class="text-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="${item?.['product']?.['description']}"><i class="fas fa-info-circle"></i></span>
                                            <span class="text-secondary">${item?.['product']?.['title']}</span>
                                        </span>
                                    </td>
                                    <td><span class="badge badge-secondary badge-sm">Weighted average</span></td>
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
                                    <td></td>
                                    <td><span class="text-primary">${item?.['stock_quantity']}</span></td>
                                    <td><span class="text-primary mask-money" data-init-money="${item?.['stock_unit_price']}"></span></td>
                                    <td><span class="text-primary mask-money" data-init-money="${item?.['stock_subtotal_price']}"></span></td>
                                </tr>`
                                )
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