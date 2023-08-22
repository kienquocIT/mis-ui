$(document).ready(function () {
    let tbl = $('#datatable_product_list');
    let url_detail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: "data.product_list"
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
                'data': 'general_product_type',
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-danger span-product-type" style="min-width: max-content; width: 50%">${
                        row.general_product_type.title}</span>`
                }
            }, {
                'data': 'general_product_category',
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-indigo span-product-category" style="min-width: max-content; width: 50%">${
                            row.general_product_category.title}</span>`
                }
            }, {
                'className': 'action-center',
                render: () => {
                    // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="/saledata/contact/update/` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return '';
                }
            },
        ],
    })
})