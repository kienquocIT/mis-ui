$(document).ready(function () {
    let tbl = $('#datatable_product_list');
    let url_detail = tbl.attr('data-url-detail');
    const $transScript = $('#trans-script')
    tbl.DataTableDefault({
        useDataServer: true,
        reloadCurrency: true,
        rowIdx: true,
        scrollX: '100vw',
        scrollY: '75vh',
        scrollCollapse: true,
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
                className: 'wrap-text w-5',
                'render': () => {
                    return ``;
                }
            }, {
                data: 'code',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    const link = url_detail.replace(0, row?.['id']);
                    return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`
                }
            }, {
                data: 'title',
                className: 'wrap-text w-25',
                render: (data, type, row) => {
                    const link = url_detail.replace(0, row?.['id']);
                    return `<a href="${link}" class="text-primary"><span><b>${row?.['title']}</b></span></a>`
                }
            }, {
                data: 'general_product_types_mapped',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    let html = ``;
                    for (let i = 0; i < row?.['general_product_types_mapped'].length; i++) {
                        html += `<span class="badge badge-light span-product-type ml-1 mb-1">${row?.['general_product_types_mapped'][i]?.['title']}</span>`
                    }
                    return html;
                }
            }, {
                data: 'general_product_category',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted span-product-category">${row?.['general_product_category']?.['title']}</span>`
                }
            }, {
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    const valuation_method_mapped = {
                        0: $transScript.attr('data-fifo'),
                        1: $transScript.attr('data-weighted-average'),
                        2: $transScript.attr('data-specific-eval-method'),
                    }
                    let trans_valuation_method = valuation_method_mapped[row?.['valuation_method']]
                    return `<span class="text-muted span-product-category">${trans_valuation_method}</span>`
                }
            }, {
                data: 'general_price',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money text-muted" data-init-money="${row?.['general_price']}"></span>`
                }
            }, {
                className: 'wrap-text text-right w-10',
                render: (data, type, row) => {
                    if (row?.['inventory_uom']?.['id']) {
                        return `<span class="text-muted">${row?.['stock_amount'] ? parseFloat(row?.['stock_amount']) / parseFloat(row?.['inventory_uom']?.['ratio']) : 0} ${row?.['inventory_uom']?.['title']}</span>`;
                    }
                    return '--'
                }
            }, {
                className: 'wrap-text text-right w-10',
                render: (data, type, row) => {
                    if (row?.['inventory_uom']?.['id']) {
                        return `<span class="text-muted">${row?.['available_amount'] ? parseFloat(row?.['available_amount']) / parseFloat(row?.['inventory_uom']?.['ratio']) : 0} ${row?.['inventory_uom']?.['title']}</span>`;
                    }
                    return '--'
                }
            }
        ],
    })
})