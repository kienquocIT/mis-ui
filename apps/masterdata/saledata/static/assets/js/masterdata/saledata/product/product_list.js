$(document).ready(function () {
    let tbl = $('#datatable_product_list');
    let url_detail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        useDataServer: true,
        reloadCurrency: true,
        rowIdx: true,
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
                'render': () => {
                    return ``;
                }
            }, {
                data: 'code',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    const link = url_detail.replace(0, row.id);
                    return `<a href="${link}"><span class="w-70 badge badge-primary">${row?.['code']}</span></a> ${$x.fn.buttonLinkBlank(link)}`
                }
            }, {
                data: 'title',
                className: 'wrap-text w-20',
                render: (data, type, row) => {
                    const link = url_detail.replace(0, row.id);
                    return `<a href="${link}" class="text-primary"><span><b>${row.title}</b></span></a>`
                }
            }, {
                data: 'general_product_types_mapped',
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    let html = ``;
                    for (let i = 0; i < row?.['general_product_types_mapped'].length; i++) {
                        html += `<span class="badge badge-outline badge-soft-blue span-product-type ml-1 mb-1" style="min-width: max-content; width: 50%">${row?.['general_product_types_mapped'][i].title}</span>`
                    }
                    return html;
                }
            }, {
                data: 'general_product_category',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="badge-status"><span class="badge badge-secondary badge-indicator"></span>&nbsp;<span class="text-secondary span-product-category">${row.general_product_category.title}</span></span>`
                }
            }, {
                data: 'general_price',
                className: 'wrap-text w-15 text-center',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row?.['general_price']}"></span>`
                }
            }, {
                className: 'wrap-text w-10 text-center',
                render: (data, type, row) => {
                    return `<span class="text-secondary">${row?.['stock_amount'] ? row?.['stock_amount'] : 0}</span>`;
                }
            }, {
                className: 'wrap-text w-10 text-center',
                render: (data, type, row) => {
                    return `<span class="text-primary">${row?.['available_amount'] ? row?.['available_amount']: 0}</span>`;
                }
            }
        ],
    })
})