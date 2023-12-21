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
    
    function CombineDataItems(data_source, selected_id_list) {
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
        return data;
    }

    function InitialDB(ele, data=[]) {
        ele.closest('.row').prop('hidden', data.length === 0)
        ele.DataTable().clear().destroy()
        ele.DataTableDefault({
            scrollX: true,
            scrollCollapse: true,
            fixedColumns: true,
            data: data,
            columns: [
                {
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span data-id="${row.items_id}" class="badge badge-soft-secondary">${row.items_code}</span>`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<div><span class="badge-label text-primary">${row.items_title}</span></div>`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="text-muted">${row.description}</span>`;
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="badge badge-primary">${row.valuation_method}</span>`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                },
                {

                    render: (data, type, row) => {
                        return `-`;
                    }
                }
            ],
        })
    }
    InitialDB(items_detail_report_table_Ele)

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
        let item_list_text = $(`#${items_select_Ele.attr('data-idx-data-loaded')}`).text();
        let item_list = JSON.parse(item_list_text ? item_list_text : [])
        InitialDB(items_detail_report_table_Ele, CombineDataItems(item_list, items_select_Ele.val()))
    })
})