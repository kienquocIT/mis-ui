$(document).ready(function () {
    let items_select_Ele = $('#items_select')
    let warehouses_select_Ele = $('#warehouses_select')
    let items_detail_report_table_Ele = $('#items_detail_report_table')
    let date_picker_Ele = $('input[type=text].date-picker')

    date_picker_Ele.daterangepicker({
        minYear: 1901,
        timePicker: true,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    });

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

    function CombineDataItems(data_source, selected_id_list) {
        console.log(data_source)
        let data = []
        for (let idx = 0; idx < selected_id_list.length; idx++){
            data.push({
                'items_id': data_source[selected_id_list[idx]]?.['id'],
                'items_code': data_source[selected_id_list[idx]]?.['code'],
                'items_title': data_source[selected_id_list[idx]]?.['title'],
                'description': data_source[selected_id_list[idx]]?.['description'],
                'valuation_method': 'Weight average',
                'warehouses': '',
                'system_date': '',
                'posting_date': '',
                'document_date': '',
                'trans_description': '',
                'trans_code': '',
                'stock_in_quantity': '',
                'cost_in': '',
                'in_value': '',
                'stock_out_quantity': '',
                'cost_out': '',
                'out_value': '',
                'cumulative_quantity': '',
                'cumulative_value': ''
            })
        }
        console.log(data)
        return data;
    }

    function InitialDB(ele, data=[]) {
        ele.closest('.row').prop('hidden', data.length === 0)
        ele.DataTable().clear().destroy()
        ele.DataTableDefault({
            scrollX: true,
            data: data ? data : [],
            columns: [
                {
                    target: 0,
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    target: 1,
                    render: (data, type, row) => {
                        return `<span data-id="${row.items_id}" class="badge badge-soft-secondary">${row.items_code}</span>`;
                    }
                },
                {
                    target: 2,
                    render: (data, type, row) => {
                        return `<span class="badge-label text-primary">${row.items_title}</span>`;
                    }
                },
                {
                    target: 3,
                    render: (data, type, row) => {
                        return `<span class="text-muted small">${row.description}</span>`;
                    }
                },
                {
                    target: 4,
                    render: (data, type, row) => {
                        return `<span class="badge badge-primary">${row.valuation_method}</span>`;
                    }
                },
                {
                    target: 5,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 6,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 7,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 8,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 9,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 10,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 11,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 12,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 13,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 14,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 15,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 16,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 17,
                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {
                    target: 18,
                    render: (data, type, row) => {
                        return `-`;
                    }
                }
            ],
        })
    }
    InitialDB(items_detail_report_table_Ele)

    $('#btn-view').on('click', function () {
        let item_list_id = items_select_Ele.val()
        if (item_list_id) {
            console.log(item_list_id)
            // InitialDB(items_detail_report_table_Ele, CombineDataItems(item_list, items_select_Ele.val()))
        }
        else {
            $.fn.notifyB({"description": 'No item to view.', "timeout": 3500}, 'warning')
        }
    })
})