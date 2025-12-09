$(document).ready(function () {
    let tbl = $('#datatable_product_list');
    let url_detail = tbl.attr('data-url-detail');
    const $transScript = $('#trans-script')
    tbl.DataTableDefault({
        useDataServer: true,
        reloadCurrency: true,
        rowIdx: true,
        scrollX: true,
        scrollY: '64vh',
        scrollCollapse: true,
        fixedColumns: {
            leftColumns: 2
        },
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    // console.log(resp.data['product_list'])
                    return resp.data['product_list'] ? resp.data['product_list'] : [];
                }
                return [];
            },
        },
        columns: [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            }, {
                data: 'code',
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    const link = url_detail.replace(0, row?.['id']);
                    return `<a href="${link}" class="link-primary underline_hover fw-bold" title="${row?.['code']}">${row?.['code'] || '--'}</a>`;
                }
            }, {
                data: 'title',
                className: 'ellipsis-cell-lg w-35',
                render: (data, type, row) => {
                    const link = url_detail.replace(0, row?.['id']);
                    return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                }
            }, {
                data: 'general_product_types_mapped',
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return `<span class="span-product-type" title="${row?.['general_product_types_mapped'][0]?.['title']}">${row?.['general_product_types_mapped'][0]?.['title']}</span><br>`
                }
            }, {
                data: 'general_product_category',
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return `<span class="span-product-category">${row?.['general_product_category']?.['title']}</span>`
                }
            }, {
                data: 'general_price',
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money text-muted" data-init-money="${row?.['general_price']}"></span>`
                }
            }, {
                className: 'text-right w-10',
                render: (data, type, row) => {
                    let general_traceability_method = ['', $.fn.gettext('Batch/Lot'), $.fn.gettext('Serial')][row?.['general_traceability_method']]
                    return general_traceability_method ? `<span class="bflow-mirrow-badge">${general_traceability_method}</span>` : '--'
                }
            }, {
                className: 'text-right w-10',
                render: (data, type, row) => {
                    if (row?.['inventory_uom']?.['id']) {
                        return `<span class="text-muted">${row?.['stock_amount'] ? parseFloat(row?.['stock_amount']) / parseFloat(row?.['inventory_uom']?.['ratio']) : 0} ${row?.['inventory_uom']?.['title']}</span>`;
                    }
                    return '--'
                }
            },
            // {
            //     className: 'text-right w-10',
            //     render: (data, type, row) => {
            //         if (row?.['inventory_uom']?.['id']) {
            //             return `<span class="text-muted">${row?.['available_amount'] ? parseFloat(row?.['available_amount']) / parseFloat(row?.['inventory_uom']?.['ratio']) : 0} ${row?.['inventory_uom']?.['title']}</span>`;
            //         }
            //         return '--'
            //     }
            // }
        ],
    })
})