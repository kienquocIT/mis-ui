$(document).ready(function () {
    const $main_table = $('#goods-detail-main-table')
    const $prd_category = $('#prd-category')
    const $prd = $('#prd')
    const $wh = $('#wh')
    const $status = $('#status')

    function loadProductCategory(data) {
        $prd_category.initSelect2({
            allowClear: true,
            ajax: {
                url: $prd_category.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_category_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    loadProductCategory()

    function loadProduct(data) {
        $prd.initSelect2({
            allowClear: true,
            ajax: {
                url: $prd.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    loadProduct()

    function loadWarehouse(data) {
        $wh.initSelect2({
            allowClear: true,
            ajax: {
                url: $wh.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    loadWarehouse()

    function loadMainTable() {
        $main_table.DataTableDefault({
            dom: '',
            paging: false,
            useDataServer: true,
            reloadCurrency: true,
            ajax: {
                url: $main_table.attr('data-url'),
                type: $main_table.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let result = []
                        for (const item of resp.data['goods_detail_list'] ? resp.data['goods_detail_list'] : []) {
                            result = result.concat(item?.['product_data'])
                        }
                        return result;
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: 'product',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary badge-sm w-20">${data?.['code']}</span>&nbsp;<span>${data?.['title']}</span>`;
                    }
                },
                {
                    data: 'goods_receipt',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-secondary">${data?.['code']}</span>`;
                    }
                },
                {
                    data: 'goods_receipt',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span>${moment(data?.['date_approved'].split(' ')[0]).format('DD/MM/YYYY')}</span>`;
                    }
                },
                {
                    data: 'person_in_charge',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span>${data?.['full_name']}</span>`;
                    }
                },
                {
                    data: 'warehouse',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-blue badge-sm w-20">${data?.['code']}</span>&nbsp;<span>${data?.['title']}</span>`;
                    }
                },
                {
                    data: 'quantity_import',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `${data}`;
                    }
                },
                {
                    data: 'serial',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    data: 'lot',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
            ],
        });
    }

    loadMainTable();
})