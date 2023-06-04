$(document).ready(function () {
    let tbl = $('#datatable_product_list');
    let url_detail = tbl.attr('data-url-detail');
    tbl.DataTableDefault({
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('product_list')) return data['product_list'];
                return [];
            },
        },
        columns: [
            {
                'render': (data, type, row, meta) => {
                    let currentId = "chk_sel_" + String(meta.row + 1)
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                }
            }, {
                'data': 'code',
                render: (data, type, row, meta) => {
                    return `<a class="badge badge-outline badge-soft-success" style="min-width: 80px; width: 70%" href="${url_detail.replace(0, row.id)}"><center><span><b>${row.code}</b></span></center></a>`
                }
            }, {
                'data': 'title',
                render: (data, type, row, meta) => {
                    return `<a href="${url_detail.replace(0, row.id)}"><span><b>${row.title}</b></span></a>`
                }
            }, {
                'data': 'product_type',
                'render': (data, type, row, meta) => {
                    if (row.general_information?.product_type.title) {
                        return `<span class="badge badge-soft-danger badge-pill span-product-type" style="min-width: max-content; width: 50%">${row.general_information?.product_type?.title}</span>`
                    }
                    return ``;
                }
            }, {
                'data': 'product_category',
                'render': (data, type, row, meta) => {
                    if (row.general_information?.product_category.title) {
                        return `<span class="badge badge-soft-indigo badge-pill span-product-category" style="min-width: max-content; width: 50%">${row.general_information?.product_category?.title}</span>`
                    }
                    return ``;
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row, meta) => {
                    // let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="/saledata/contact/update/` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return '';
                }
            },
        ]
    })
})