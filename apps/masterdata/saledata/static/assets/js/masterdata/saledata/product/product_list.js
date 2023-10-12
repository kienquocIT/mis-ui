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
                'data': 'code',
                render: (data, type, row) => {
                    const link = url_detail.replace(0, row.id);
                    return `<a href="${link}" class="badge badge-soft-primary w-70">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`
                }
            }, {
                'data': 'title',
                render: (data, type, row) => {
                    return `<span><b>${row.title}</b></span>`
                }
            }, {
                'className': 'text-center',
                'data': 'general_product_types_mapped',
                render: (data, type, row) => {
                    let html = ``;
                    for (let i = 0; i < row?.['general_product_types_mapped'].length; i++) {
                        html += `<span class="badge badge-primary span-product-type ml-1 mb-1" style="min-width: max-content; width: 50%">${row?.['general_product_types_mapped'][i].title}</span>`
                    }
                    return html;
                }
            }, {
                'data': 'general_product_category',
                render: (data, type, row) => {
                    return `<span class="badge-status"><span class="badge badge-secondary badge-indicator"></span>&nbsp;<span class="text-secondary span-product-category">${row.general_product_category.title}</span></span>`
                }
            }, {
                'data': 'general_price',
                render: (data, type, row) => {
                    return `<span class="mask-money text-primary" data-init-money="${row.general_price}"></span>`
                }
            }, {
                'className': 'text-center',
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-primary w-80" data-bs-toggle="tooltip" data-bs-placement="left" title=""><b>${row?.['stock_amount'] ? row?.['stock_amount'] : 0}</b></span>`;
                }
            }, {
                'className': 'text-center',
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-success w-80" data-bs-toggle="tooltip" data-bs-placement="left" title=""><b>${row?.['available_amount'] ? row?.['available_amount']: 0}</b></span>`;
                }
            }
        ],
    })
})