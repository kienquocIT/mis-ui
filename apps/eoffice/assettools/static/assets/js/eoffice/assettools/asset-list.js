

class ListByUserHandle {
    static loadToolsList(data=[]){
        const $tbsTools = $('#asset_tbl')
        if (data)
            if ($tbsTools.hasClass('dataTable')) {
                $tbsTools.DataTable().clear().rows.add(data).draw()
            }
            else {
                $tbsTools.DataTableDefault({
                    data: data,
                    info: false,
                    searching: false,
                    paging: false,
                    autoWidth: true,
                    scrollX: true,
                    columns: [
                        {
                            data: 'product_data',
                            width: '35%',
                            render: (row, index, data) => {
                                return row?.title ? row.title : data?.['prod_buy_new'] ? data['prod_buy_new'] : '--'
                            }
                        },
                        {
                            data: 'product_data',
                            width: '10%',
                            render: (row) => {
                                return row?.code ? row.code : '--'
                            }
                        },
                        {
                            data: 'product_data',
                            width: '10%',
                            render: (row, index, data) => {
                                let obj_uom = row?.uom ? row.uom : data?.uom ? data.uom : '--'
                                return obj_uom?.title ? obj_uom.title : obj_uom
                            }
                        },
                        {
                            data: 'done',
                            width: '20%',
                            render: (row) => {
                                return row
                            }
                        },
                    ]
                })
            }
    }

    static callToolsListData(empID){
        if (!empID && !empID.valid_uuid4()) return false
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-asset-list'),
            'method': 'GET',
            'data': {'employee_inherit': empID}
        }).then((resp) => {
                let data = $.fn.switcherResp(resp)?.['asset_tools_list'];
                let temp = {}
                for (let item of data){
                    if (Object.keys(item?.product_data).length > 0){
                        if(temp[item?.product_data?.id]){
                            temp[item.product_data.id].done += item.done
                        }
                        else
                            temp[item.product_data.id] = item
                    }
                    else{
                        const str_temp = item['prod_buy_new'].trim().toLowerCase().replaceAll(' ', '_')
                        if (temp[str_temp] && temp[str_temp]['prod_buy_new'].trim() === item['prod_buy_new'].trim())
                            temp[str_temp].done += item.done
                        else
                            temp[str_temp] = item
                    }
                }
                const new_data = Object.values(temp).map(item => item)
                ListByUserHandle.loadToolsList(new_data)
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )
    }

    static init(){
        const $EmTable = $('#employee_tbl')
        const $urlElm = $('#url-factory');

        // load employee table
        $EmTable.DataTableDefault({
            ajax: {
                url: $urlElm.attr('data-employee-list'),
                type: "GET",
                dataSrc: 'data.employee_list',
                data: function (a) {
                    a.list_from_app = 'assettools.assettoolsdelivery.view'
                    return a
                },
            },
            useDataServer: true,
            info: false,
            pageLength: 50,
            autoWidth: true,
            scrollX: true,
            scrollY: "400px",
            columns: [
                {
                    data: 'full_name',
                    width: '40%',
                    render: (row) => {
                        return row
                    }
                },
                {
                    data: 'code',
                    width: '20%',
                    render: (row) => {
                        return `${row ? row : '--'}`
                    }
                },
                {
                    data: 'group',
                    width: '40%',
                    render: (row) => {
                        let txt = '--'
                        if (row?.title) txt = row.title
                        return `${txt}`
                    }
                },
            ],
            rowCallback: function (row, data) {
                $(row).on('click', function(){
                    if ($(this).hasClass('selected')) $(this).removeClass('selected');
                    else{
                        ListByUserHandle.callToolsListData(data.id)
                        $(this).parents('table').find('tr').removeClass('selected')
                        $(this).addClass('selected')
                        if (window.isMobile && $(window).width() < 1024){
                            $('.content_left').removeClass('is_active')
                            $('#employee_tbl_wrapper').slideToggle()
                        }
                    }
                })
            }
        })

        // show/hide employee table on mobile button
        $('.emp-list-sp').on('click', function(){
            const isParent = $(this).parents('.content_left'), $tbEmp = $('#employee_tbl_wrapper');
            if (isParent.hasClass('is_active')){
                isParent.removeClass('is_active')
                $tbEmp.slideToggle()
            }
            else{
                isParent.addClass('is_active')
                $tbEmp.slideToggle()
            }
        });

        // load asset, tools list default
        ListByUserHandle.loadToolsList()
    }
}

class ListByAssetHandle{
    static init(){
        const tabElm = $('#list_by_product'), $urlElm = $('#url-factory')
        if (!tabElm.length) return false
        $('#product_list_tb').DataTableDefault({
            ajax: {
                url: $urlElm.attr('data-instrument_tool_lst'),
                type: "GET",
                dataSrc: 'data.instrument_tool_list',
            },
            useDataServer: true,
            info: false,
            pageLength: 50,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    data: 'product', // name
                    width: '25%',
                    render: (row) => {
                        return row?.title ? row.title : '--'
                    }
                },
                {
                    data: 'product', // code
                    width: '10%',
                    render: (row) => {
                        return `${row?.code ? row.code : '--'}`
                    }
                },
                {
                    data: 'product', // UoM
                    width: '10%',
                    render: (row) => {
                        let txt = '--'
                        if (row?.['uom']) txt = row['measure_unit']
                        return txt
                    }
                },
                {
                    data: 'manage_department',
                    width: '15%',
                    render: (row) => {
                        let txt = '--'
                        if (row?.title && row?.code) txt = `<span class="badge badge-soft-success">${
                            row.title + ' - ' + row.code
                        }</span>`
                        return txt
                    }
                },
                {
                    data: 'use_department',
                    width: '15%',
                    render: (row) => {
                        let txt = ''
                        for (let item of row){
                            if (item?.title && item?.code)
                                txt += `<span class="badge badge-soft-success">${
                                    item.title + ' - ' + item.code
                                }</span>`
                        }
                        return txt
                    }
                },
                {
                    data: 'product', // quantity
                    width: '5%',
                    className: 'text-center',
                    render: (row) => {
                        return row?.quantity ? row.quantity : '--'
                    }
                },
                {
                    data: 'allocated_quantity',
                    width: '10%',
                    className: 'text-center',
                },
                {
                    data: 'product', // total available
                    width: '10%',
                    className: 'text-center',
                    render: (row, index, data) => {
                        let available_num = '--';
                        if (row?.['quantity'] && 'allocated_quantity' in data && 'write_off_quantity' in data)
                            available_num = row.quantity - data['allocated_quantity'] - data.write_off_quantity
                        return available_num
                    }
                }
            ],
        })
    }
}

$(document).ready(function () {
    // load employee list
    ListByUserHandle.init();

    // load asset list by product
    ListByAssetHandle.init()
    let has = false
    $('.asset-list-tabs a.prod-list').on('shown.bs.tab', function () {
        if (!has){
            $('#product_list_tb').DataTable().columns.adjust()
            has = true
        }
    })
})