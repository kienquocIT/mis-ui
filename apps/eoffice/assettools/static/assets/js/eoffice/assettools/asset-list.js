class ListByUserHandle {
    static loadToolsList(data=[]){
        const $tbsTools = $('#asset_tbl')
        if (data)
            if ($tbsTools.hasClass('dataTable')) {
                $tbsTools.DataTable().clear().rows.add(data).draw()
            } else {
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
                            render: (row) => {
                                return row ? row?.title : '--'
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
                            render: (row) => {
                                return row?.uom?.title ? row.uom.title : '--'
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
                ListByUserHandle.loadToolsList(data)
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
            rowCallback: function (row, data, index) {
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
                url: $urlElm.attr('data-product-asset-list'),
                type: "GET",
                dataSrc: 'data.warehouse_product_asset_list',
            },
            useDataServer: true,
            info: false,
            pageLength: 50,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    data: 'product',
                    width: '30%',
                    render: (row) => {
                        return row?.title ? row.title : '--'
                    }
                },
                {
                    data: 'product',
                    width: '10%',
                    render: (row) => {
                        return `${row?.code ? row.code : '--'}`
                    }
                },
                {
                    data: 'uom',
                    width: '10%',
                    render: (row) => {
                        let txt = '--'
                        if (row?.title) txt = row.title
                        return `${txt}`
                    }
                },
                {
                    data: 'warehouse',
                    width: '20%',
                    render: (row) => {
                        let txt = '--'
                        if (row?.title) txt = row.title
                        return `${txt}`
                    }
                },
                {
                    data: 'stock_amount',
                    width: '10%',
                    className: 'text-center',
                    render: (row) => {
                        return row
                    }
                },
                {
                    data: 'used_amount',
                    width: '10%',
                    className: 'text-center',
                    render: (row) => {
                        return row
                    }
                },
                {
                    data: 'id',
                    width: '10%',
                    className: 'text-center',
                    render: (row, type, data) => {
                        let available = 0
                        if ('stock_amount' in data && 'used_amount' in data)
                            available = data.stock_amount - data.used_amount
                        return available
                    }
                },
            ],
        })
    }
}

$(document).ready(function () {
    // load employee list
    ListByUserHandle.init()

    // load asset list by product
    ListByAssetHandle.init()
    let has = false
    $('.asset-list-tabs a.prod-list').on('shown.bs.tab', function (e) {
        if (!has){
            $('#product_list_tb').DataTable().columns.adjust()
            has = true
        }
    })
})