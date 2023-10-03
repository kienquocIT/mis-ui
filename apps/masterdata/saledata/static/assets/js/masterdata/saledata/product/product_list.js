$(document).ready(function () {
    let tbl = $('#datatable_product_list');
    let url_detail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        useDataServer: true,
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
                    return `<span class="text-secondary">${row.code}</span>`
                }
            }, {
                'data': 'title',
                render: (data, type, row) => {
                    return `<a href="${url_detail.replace(0, row.id)}"><span><b>${row.title}</b></span></a>`
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
                'className': 'text-center',
                render: (data, type, row) => {
                    let sum_stock = 0;
                    let tooltip_content = ``;
                    for (let i = 0; i < row['product_warehouse_detail'].length; i++) {
                        let temp = row['product_warehouse_detail'][i];
                        sum_stock += temp.stock_amount;
                        if (temp.stock_amount > 0) {
                            tooltip_content += `${temp.warehouse.title}: ${temp.stock_amount}\n`;
                        }
                    }
                    return `<span class="badge badge-soft-primary w-80" data-bs-toggle="tooltip" data-bs-placement="left" title="${tooltip_content}"><b>${sum_stock}</b></span>`;
                }
            }, {
                'className': 'text-center',
                render: (data, type, row) => {
                    let sum_available_value = 0;
                    let tooltip_content = ``;
                    for (let i = 0; i < row['product_warehouse_detail'].length; i++) {
                        let temp = row['product_warehouse_detail'][i];
                        sum_available_value += temp.stock_amount - temp?.['wait_for_delivery_amount'] + temp?.['wait_for_receipt_amount'];
                        if (temp.stock_amount > 0) {
                            tooltip_content += `${temp.warehouse.title}: ${temp.stock_amount - temp?.['wait_for_delivery_amount'] + temp?.['wait_for_receipt_amount']}\n`;
                        }
                    }
                    return `<span class="badge badge-soft-success w-80" data-bs-toggle="tooltip" data-bs-placement="left" title="${tooltip_content}"><b>${sum_available_value}</b></span>`;
                }
            }
        ],
    })
})